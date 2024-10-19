const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// 정적 파일을 제공하기 위해 public 디렉토리 설정
app.use(express.static(path.join(__dirname, 'pc_login')));

// 발행된 토큰을 검증하는 함수
function authenticateToken(req, res, next) {
    const token = req.headers['x-access-token'];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, 'grad-project', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.userId = decoded.userId;
      next();
    });
  }

// 로그인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

//home.html 라우트
app.get('/home.html', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
  });

//404 처리
app.use((req, res) => {
    res.status(404).send('404: 페이지를 찾을 수 없습니다.');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});