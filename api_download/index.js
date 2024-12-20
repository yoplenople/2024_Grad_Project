const express = require('express');
const mysql = require('mysql2'); // 해당 프로젝트에선 mysql을 데이터베이스로 사용함
// 만약 mysql이 아닌 다른 db를 연결 원하면 위 줄 삭제 후 해당 db 데이터 여기에 작성
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // fs 모듈 추가
const path = require('path'); // path 모듈 추가
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000; // 서버를 운용할 PORT 번호 입력

app.use(cors()); //모든 도메인에서의 요청 허용

// MySQL 데이터베이스 연결 설정
// 다른 데이터베이스 사용 시 해당 내용 변경 필요
const connection = mysql.createConnection({   // connection이라는 연결 변수 선언. 앞으로 db와의 연결은 connection으로 호출
  host: 'localhost', // 데이터베이스 호스트 **알맞게 변경 **
  user: 'root', // MySQL 사용자 이름  **알맞게 변경 **
  password: '0000', // MySQL 비밀번호 **알맞게 변경 **
  database: 'my_login_db' // 사용할 데이터베이스 이름 **알맞게 변경 **
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
app.use(bodyParser.urlencoded({ extended: true })); // encoding 된 본문을 파싱하기 위한 미들웨어

// 로그 기록 함수
function logAction(userId, action, result, issue) {
  const timestamp = new Date().toISOString(
    { 
      timeZone: 'Asia/Seoul',
      hour12: false,
     }
  ); // 현재 날짜와 시간
  const logMessage = `${timestamp} - User: ${userId}, Action: ${action}, ${result}, ${issue}\n`;
  fs.appendFile(path.join(__dirname, 'log.txt'), logMessage, (err) => {
    if (err) {
      console.error('로그 기록 실패:', err);
    }
  });
}

// 외부에서 로그에 기록 할 수 있게 하는 API
app.post('/logActivity', (req, res) => {
  const { userId, action, result, issue } = req.body;
  logAction(userId, action, result, issue);
  res.status(200).json({ message: 'Activity logged successfully' });
});

// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  res.send('인증 서버 실행 중');
});

// 사용자 데이터 조회 API
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM user', (error, results) => {  // 사용하는 DB 문법에 맞게 수정
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

  // 이전 OTP 삭제 쿼리
  const deleteQuery = 'DELETE FROM otp WHERE user_id = ?';
  connection.query(deleteQuery, [userId], (deleteError) => {
    if (deleteError) {
      console.error('이전 OTP 삭제 실패:', deleteError);
      callback(deleteError);
      return;
    }

    // 새로운 OTP 저장 쿼리
    const query = 'INSERT INTO otp (user_id, otp_code, expiration) VALUES (?, ?, ?)';
    connection.query(query, [userId, otp, expirationTime], (error, results) => {
      if (error) {
        console.error('OTP 저장 실패:', error);
        callback(error);
        return;
      }
      console.log('OTP 저장 성공');
      callback(null);
    });
  });
}

// OTP 재생성 코드 추가
app.post('/regenerate-otp', (req, res) => {
  const { id, password } = req.body;
  console.log('ID: ', id, 'OTP 재발급');

  const otp = generateOTP();
  saveOTP(id, otp, (err) => {
    if (err) {
      logAction(id, 'OTP 재발급', '실패', '재발급 실패');
      return res.status(500).json({ message: 'OTP 저장 실패' });
    }
    res.status(200).json({ message: 'OTP 재발급 성공' });
    logAction(id, 'OTP 재발급', '성공', '');
  });
});


// pc 로그인 API 추가
app.post('/pc_login', (req, res) => {
  const { id, password } = req.body; // 요청 본문에서 id와 password 추출
  console.log('ID: ', id);

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
      console.log('로그인 요청:', id);
      const user = results[0];
      // 모바일에서 로그인했는지 확인
      if (!user.is_logged_in) {
        logAction(user.id, '로그인', '실패', '모바일 미로그인');
        return res.status(403).json({ message: '모바일에서 먼저 로그인 해주세요.' });
      } else {
        const otp = generateOTP();
        saveOTP(user.id, otp, (err) => {
          if (err) {
            logAction(user.id, '로그인', '실패','OTP 저장 실패');
            return res.status(500).json({ message: 'OTP 저장 실패' });
          }
          logAction(user.id, '로그인', '성공', '');
          res.status(200).json({ message: '로그인 성공' });
        });
      }
    } else {
      // 로그인 실패
      logAction(id, '로그인', '실패', '잘못된 ID 또는 비밀번호');
      console.log('로그인 실패: 잘못된 ID 또는 비밀번호');
      res.status(401).json({ message: '로그인 실패: 잘못된 ID 또는 비밀번호' });
    }
  });
});



// 모바일 로그인 API 추가
app.post('/mobile_login', (req, res) => {
  const { id, password } = req.body; // 요청 본문에서 id와 password 추출
  console.log('ID: ', id);

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
      console.log('로그인 요청:', id);
      const user = results[0];
      connection.query('UPDATE user SET is_logged_in = TRUE WHERE id = ?', [user.id], (updateError) => {
        if (updateError) {
          console.log('로그인 상태 업데이트 실패:', id);
          return res.status(500).json({ message: '로그인 상태 업데이트 실패' });
        }
        logAction(user.id, '모바일 로그인', '성공', '');
        res.status(200).json({ message: '모바일 로그인 성공' });
        console.log('로그인 성공:', id);
      });
    } else {
      // 로그인 실패
      logAction(id, '모바일 로그인', '실패', '잘못된 ID 또는 비밀번호');
      res.status(401).json({ message: '로그인 실패: 잘못된 ID 또는 비밀번호' });
      console.log('로그인 실패: 잘못된 ID 또는 비밀번호:', id);
    }
  });
});

// 모바일 로그아웃 API 추가
app.post('/mobile_logout/:id', (req, res) => {
  const userId = req.params.id; // URL 파라미터에서 userId 추출

  connection.query('UPDATE user SET is_logged_in = FALSE WHERE id = ?', [userId], (updateError) => {
    if (updateError) {
      console.log('로그인 상태 업데이트 실패:', userId);
      return res.status(500).json({ message: '로그인 상태 업데이트 실패' });
    }
    logAction(userId, '모바일 로그아웃', '성공', '');
    res.status(200).json({ message: '모바일 로그아웃 성공' });
    console.log('모바일 로그아웃 성공:', userId);
  });
}
);

// OTP 조회 API 추가
app.get('/get_otp/:id', (req, res) => {
  const userId = req.params.id; // URL 파라미터에서 userId 추출
  console.log('모바일에서 OTP 요청');

  // 데이터베이스에서 OTP 조회 쿼리
  const query = 'SELECT otp_code FROM otp WHERE user_id = ? AND expiration > NOW()';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('쿼리 실행 실패:', error);
      return res.status(500).send('쿼리 실행 실패');
    }

    // OTP가 존재하는 경우
    if (results.length > 0) {
      console.log('OTP 코드: ', results[0].otp_code);

      const otp = results[0].otp_code; // OTP 코드 추출
      res.status(200).json({ otp }); // OTP를 JSON 형식으로 응답
    } else {
      // OTP가 존재하지 않거나 만료된 경우
      res.status(404).json({ message: 'OTP가 존재하지 않거나 만료되었습니다.' });
    }
  });
});

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  logAction('-----서버-----', '서버 재실행', '성공', '');
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);

  // 서버 시작 시 모든 유저의 is_logged_in을 false로 업데이트
  connection.query('UPDATE user SET is_logged_in = FALSE', (error, results) => {
    if (error) {
      console.error('is_logged_in 업데이트 실패:', error);
    } else {
      console.log('모든 유저의 is_logged_in이 false로 업데이트되었습니다.');
    }
  });

  // 서버 시작 시 모든 OTP 삭제
  connection.query('DELETE FROM otp', (error, results) => {
    if (error) {
      console.error('OTP 삭제 실패:', error);
    } else {
      console.log('모든 OTP가 삭제되었습니다.');
    }
  });
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
      logAction(id, 'OTP 인증', '성공', '');
      const token = jwt.sign({ userId: id }, 'grad-project', { expiresIn: '1h' }); // grad-project == secret key
      logAction(id, '토큰 생성', '성공', '');
      res.status(200).json({ message: '성공', token: token });
    } else {
      // OTP가 일치하지 않거나 만료된 경우
      logAction(id, 'OTP 인증', '실패', '만료 또는 잘못된 OTP');
      console.log('에러', results);
      res.status(401).json({ message: 'OTP 확인 실패 또는 만료됨' });
    }
  });
});