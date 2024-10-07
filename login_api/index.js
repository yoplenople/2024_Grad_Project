const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); //모든 도메인에서의 요청 허용

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: 'localhost', // 데이터베이스 호스트
  user: 'root', // MySQL 사용자 이름
  password: '0000', // MySQL 비밀번호
  database: 'my_login_db' // 사용할 데이터베이스 이름
});

// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
    return;
  }
  console.log('데이터베이스에 연결됨:', connection.threadId);
});

// 미들웨어 설정
app.use(bodyParser.json()); // JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(bodyParser.urlencoded({ extended: true}));

// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 사용자 데이터 조회 API
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM user', (error, results) => {
    if (error) {
      console.error('쿼리 실행 실패:', error);
      res.status(500).send('쿼리 실행 실패');
      return;
    }
    res.json(results); // 사용자 데이터를 JSON 형식으로 응답
  });
});

// 로그인 API 추가
app.post('/login', (req, res) => {
  const { id, password } = req.body; // 요청 본문에서 id와 password 추출
  console.log('ID: ', id, 'Password: ', password);

  if (!id || !password) {
    return res.status(400).json({ message: 'ID와 비밀번호를 입력해 주세요.' });
  }
  // 사용자 인증 쿼리
  connection.query('SELECT * FROM user WHERE id = ? AND password = ?', [id, password], (error, results) => {
    if (error) {
      console.error('쿼리 실행 실패:', error);
      return res.status(500).json({message: '쿼리 실행 실패'});
    }

    if (results.length > 0) {
      // 로그인 성공
      res.status(200).json({ message: '로그인 성공' });
    } else {
      // 로그인 실패
      res.status(401).json({ message: '로그인 실패: 잘못된 ID 또는 비밀번호' });
    }
  });
});
// 서버 시작
app.listen(PORT, '0.0.0.0',() => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
