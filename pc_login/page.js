const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// 정적 파일을 제공하기 위해 public 디렉토리 설정
app.use(express.static(path.join(__dirname, 'pc_login')));

// 로그인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

//home.html 라우트
app.get('/home.html', (req, res) => {
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