const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;
const jwt = require('jsonwebtoken');
const session = require('express-session');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 정적 파일을 제공하기 위해 public 디렉토리 설정
app.use(express.static(path.join(__dirname, 'pc_login')));

// 로그인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

//home.html 라우트
app.get('/home.html', (req, res) => {
    const token = req.headers.token;
    if (token) {
        req.session.token = token;
    }
    if (!req.session.token) {
        return res.status(401).send(`
        <h1>접근권한 없음. 로그인 후 이용 해주세요.</h1>
        <button onclick="window.location.href='http://localhost:4000/'">로그인 페이지로 이동</button>
    `);
    }
    jwt.verify(req.session.token, 'grad-project', (err, decoded) => {

        if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
        }
        req.userId = decoded.userId;
        handleHomePage(req, res);
    });
});

function handleHomePage(req, res) {
    res.sendFile(path.join(__dirname, 'home.html'));
}

// 로그아웃 기능 처리
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        res.json({ message: 'Logged out successfully' });
      }
    });
  });

//404 처리
app.use((req, res) => {
    res.status(404).send('404: 페이지를 찾을 수 없습니다.');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});