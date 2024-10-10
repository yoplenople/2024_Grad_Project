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
app.use(bodyParser.urlencoded({ extended: true }));

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

// OTP 생성 함수 (무작위 4자리 숫자)
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4자리 OTP 생성
}

// 유저별 OTP 저장 및 만료 시간 설정
function saveOTP(userId, otp, callback) {
  const expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 3분 후 만료 시간 설정
  const query = 'INSERT INTO otp (user_id, otp_code, expiration) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code = ?, expiration = ?';

  connection.query(query, [userId, otp, expirationTime, otp, expirationTime], (error, results) => {
    if (error) {
      console.error('OTP 저장 실패:', error);
      callback(error);
      return;
    }
    console.log('OTP 저장 성공');
    callback(null);
  });
}

// pc 로그인 API 추가
app.post('/pc_login', (req, res) => {
  const { id, password } = req.body; // 요청 본문에서 id와 password 추출
  console.log('ID: ', id, 'Password: ', password);

  if (!id || !password) {
    return res.status(400).json({ message: 'ID와 비밀번호를 입력해 주세요.' });
  }
  // 사용자 인증 쿼리
  connection.query('SELECT * FROM user WHERE id = ? AND password = ?', [id, password], (error, results) => {
    if (error) {
      console.error('쿼리 실행 실패:', error);
      return res.status(500).json({ message: '쿼리 실행 실패' });
    }

    if (results.length > 0) {
      // 로그인 성공
      console.log('로그인 요청:', req.body);
      const user = results[0];
      // 모바일에서 로그인했는지 확인
      if (!user.is_logged_in) {
        return res.status(403).json({ message: '모바일에서 먼저 로그인 해주세요.' });
      } else {
        const otp = generateOTP();
        saveOTP(user.id, otp, (err) => {
          if (err) {
            return res.status(500).json({ message: 'OTP 저장 실패' });
          }
          console.log('요청된 OTP:', otp);
          res.status(200).json({ message: '로그인 성공' });
        });
      }
    } else {
      // 로그인 실패
      res.status(401).json({ message: '로그인 실패: 잘못된 ID 또는 비밀번호' });
    }
  });
});

// 모바일 로그인 API 추가
app.post('/mobile_login', (req, res) => {
  const { id, password } = req.body; // 요청 본문에서 id와 password 추출
  console.log('ID: ', id, 'Password: ', password);

  if (!id || !password) {
    return res.status(400).json({ message: 'ID와 비밀번호를 입력해 주세요.' });
  }
  // 사용자 인증 쿼리
  connection.query('SELECT * FROM user WHERE id = ? AND password = ?', [id, password], (error, results) => {
    if (error) {
      console.error('쿼리 실행 실패:', error);
      return res.status(500).json({ message: '쿼리 실행 실패' });
    }

    if (results.length > 0) {
      // 로그인 성공
      console.log('로그인 요청:', req.body);
      const user = results[0];
      const otp = generateOTP();
      connection.query('UPDATE user SET is_logged_in = TRUE WHERE id = ?', [user.id], (updateError) => {
        if (updateError) {
          return res.status(500).json({ message: '로그인 상태 업데이트 실패' });
        }
        res.status(200).json({ message: '로그인 성공', otp });
      });
    } else {
      // 로그인 실패
      res.status(401).json({ message: '로그인 실패: 잘못된 ID 또는 비밀번호' });
    }
  });
});

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log('서버가 http://localhost:${PORT}에서 실행 중입니다.');
});

// OTP 확인 API
app.post('/verify-otp', (req, res) => {
  const { id, otp } = req.body; // 클라이언트에서 전송된 id와 otp
  console.log('요청된 userId:', id); // 요청된 userId 로그
  console.log('요청된 OTP:', otp); // 요청된 OTP 로그

  // 데이터베이스에서 OTP 확인 쿼리
  const query = 'SELECT * FROM otp WHERE user_id = ? AND otp_code = ? AND expiration > NOW()';
  connection.query(query, [id, otp], (error, results) => {
    if (error) {
      console.error('쿼리 실행 실패:', error);
      return res.status(500).send('쿼리 실행 실패');
    }

    // OTP가 일치하고 유효한 경우
    if (results.length > 0) {
      res.status(200).json({ message: 'OTP 확인 성공' });
    } else {
      // OTP가 일치하지 않거나 만료된 경우
      console.log('에러', results);
      res.status(401).json({ message: 'OTP 확인 실패 또는 만료됨' });
    }
  });
});