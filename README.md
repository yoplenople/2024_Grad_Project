# 2024 충남대학교 졸업프로젝트

## SDP 환경에서의 멀티채널 인증서버 API 개발

## 프로젝트 참가자
19학번 이용준,
19학번 강전웅, 
19학번 이정호

## 목차
- [프로젝트 개요](#프로젝트-개요)
- [개발 내용](#개발-내용)
- [사용 프레임워크](#사용-프레임워크)
- [프로젝트 설명](#프로젝트-설명)

## 프로젝트 개요
이 프로젝트는 2024년 충남대학교 졸업 프로젝트로, Software Defined Perimeter(SDP) 환경에 적합한 멀티채널 인증 서버를 개발하는 것을 목표로 한다. 다양한 인증 방식과 채널을 통해 사용자 인증의 안전성과 유연성을 향상시키고자 한다.

최근 사회적으로 온라인 환경상의 작업량이 많아짐에 따라 사용자들은 개인정보 노출에 더욱 민감해진 상황이다. 이러한 문제들을 SDP 라는 최신 보안 아키텍처를 통해 해결해보려고 한다. 이를 위한 멀티채널 인증체계 개발을 목표로 해당 프로젝트는 시작됐다. 

## 개발 내용
SDP 환경을 구축하기 위한 인증서버를 만들고 여기서 1차 인증과 2차 인증을 진행하도록 한다. 1차 인증은 PC환경에서 ID/PW 방식을 사용하고, 2차 인증은 모바일 기기를 활용한 OTP 코드를 사용하여 멀티채널 이증을 진행한다. 1차인증과 2차인증의 채널을 분리함으로서 최종적으로 SDP와 멀티채널인증을 결합하고 향상된 보안성을 제공한다. 

## 사용 프레임워크
- API 개발
    - Node.js
    - Express.js
    - JWT
- 예시 로그인 환경 프레임워크
    - Flutter
    - HTML / JS / CSS
    - MySQL

## 프로젝트 설명
해당 프로젝트에 대한 설명은 세 가지 파트로 나눠서 다룰 예정이다.

- [API 설명](#api-설명)
- [API를 활용한 데모 프로젝트 설명](#api를-활용한-데모-프로젝트-설명)
- [API 사용방법](#api-사용방법)

## API 설명

API 파일은 두가지로 이루어져 있다.
- index.js
    - 1차인증과 2차인증을 담당하는 서버
- page.js
    - 2차 인증까지 완료된 사용자를 서비스로 리디렉팅 해주는 서버

이 두 파일은 서로 다른 두 서버로 실행하도록 설계 되어있다. 

## index.js

#### 데이터베이스 연결
```javascript
// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
    return;
  }
  console.log('데이터베이스에 연결됨:', connection.threadId);
});
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `err` | `object` | 오류 발생 시 반환되는 객체 |
| `connection.threadId` | `number` | 데이터베이스 연결 시 생성된 스레드 ID |

---

### MySQL 데이터베이스 연결 설정
```javascript
// MySQL 데이터베이스 연결 설정
// 다른 데이터베이스 사용 시 해당 내용 변경 필요
const connection = mysql.createConnection({   // connection이라는 연결 변수 선언. 앞으로 db와의 연결은 connection으로 호출
  host: 'localhost', // **알맞게 변경 **
  user: 'root', // **알맞게 변경 **
  password: '0000', // **알맞게 변경 **
  database: 'my_login_db' // **알맞게 변경 **
});
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `host` | `string` | 데이터베이스 호스트 |
| `user` | `string` | MySQL 사용자 이름|
| `password` | `string` | MySQL 비밀번호 |
| `databse` | `string` | 사용할 데이터베이스 이름 |

---

### 서버 시작
```javascript
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
```
#### 설명
- **기능**: 서버를 시작하고, 모든 유저의 로그인 상태를 초기화하는 기능을 포함합니다.

#### 서버 시작
- **포트**: `PORT`에서 서버를 실행합니다.
- **호스트**: `0.0.0.0`에서 접속을 허용합니다.

#### 동작
1. 서버가 시작되면 로그를 기록합니다.
2. 데이터베이스에서 모든 유저의 `is_logged_in` 상태를 `FALSE`로 업데이트합니다.

#### 로그 메시지
- 서버가 성공적으로 시작되면 다음 메시지가 출력됩니다:
```plaintext
서버가 http://localhost:${PORT}에서 실행 중입니다.
모든 유저의 is_logged_in이 false로 업데이트되었습니다.
```
- is_logged_in 업데이트 실패 시
```plaintext
is_logged_in 업데이트 실패: [오류 내용]
```

---

### 서버 시작 시 모든 OTP 삭제
```javascript
// 서버 시작 시 모든 OTP 삭제
  connection.query('DELETE FROM otp', (error, results) => {
    if (error) {
      console.error('OTP 삭제 실패:', error);
    } else {
      console.log('모든 OTP가 삭제되었습니다.');
    }
  });
});
```
#### 설명
- **기능**: 서버가 시작될 때 데이터베이스에서 모든 OTP를 삭제하는 기능을 포함합니다.

#### 동작
- 서버 시작 시 다음 쿼리를 실행하여 모든 OTP를 삭제합니다:

```sql
DELETE FROM otp
```
### 로그 메세지
- OTP 삭제 성공 시
```plaintext
모든 OTP가 삭제되었습니다
```
- OTP 삭제 실패 시
```plaintext
OTP 삭제 실패: [오류 내용]
```

---

### 루트 경로에 대한 GET 요청 처리
```javascript
// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  res.send('인증 서버 실행 중');
});
```
#### 응답
- **200 OK**: 인증 서버가 실행 중임을 알리는 메시지

```plaintext
인증 서버 실행 중
```

---

### 로그 기록 함수
```javascript
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
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | 로그를 기록할 사용자 ID |
| `action` | `string` | 사용자가 수행한 액션 |
| `result` | `string` | 액션의 결과 |
| `issue` | `string` | 발생한 문제 또는 추가 정보 |

---

### 외부에서 로그에 기록할 수 있는 API
```javascript
// 외부에서 로그에 기록 할 수 있게 하는 API
app.post('/logActivity', (req, res) => {
  const { userId, action, result, issue } = req.body;
  logAction(userId, action, result, issue);
  res.status(200).json({ message: 'Activity logged successfully' });
});
```
| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `userId`  | `string` | 로그를 기록할 사용자 ID            |
| `action`  | `string` | 사용자가 수행한 액션               |
| `result`  | `string` | 액션의 결과                        |
| `issue`   | `string` | 발생한 문제 또는 추가 정보        |

#### 응답
- **200 OK**: 활동이 성공적으로 기록되었음을 알리는 메시지
```json
"message": "Activity logged successfully"
```

---

### OTP 생성 함수 (무작위 4자리 숫자)
```javascript
// OTP 생성 함수 (무작위 4자리 숫자)
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4자리 OTP 생성
}
```
#### 설명
- **기능**: 무작위로 4자리 숫자 OTP(일회용 비밀번호)를 생성하여 문자열로 반환합니다.

#### 반환값
- **string**: 생성된 4자리 OTP (예: "1234")

---

### 유저별 OTP 저장 및 만료 시간 설정 함수
```javascript
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
```
#### 설명
- **기능**: 사용자의 OTP를 데이터베이스에 저장하고, 이전 OTP를 삭제하며, 만료 시간을 설정합니다.


#### 매개변수
| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `userId`  | `string` | OTP를 저장할 사용자 ID              |
| `otp`     | `string` | 저장할 OTP 코드                     |
| `callback`| `function`| 쿼리 실행 후 호출할 콜백 함수     |

#### 반환값
- **callback**: 쿼리 실행 결과에 따라 에러 또는 `null`을 반환합니다.

---

### OTP 재생성 코드 
```javascript
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
```
#### 설명
- **기능**: 사용자의 OTP를 재발급하고, 성공 또는 실패에 대한 응답을 반환합니다.

#### 매개변수
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | OTP를 재발급할 사용자 ID      |
| `password` | `string` | 사용자 비밀번호 (확인용)      |

#### 반환값
- **200 OK**: OTP 재발급 성공 시

```json
"message": "OTP 재발급 성공"
```

---


### PC 로그인 API
```javascript
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
```
#### 설명
- **기능**: 사용자의 ID와 비밀번호를 통해 PC에서 로그인 요청을 처리하고, 성공 또는 실패에 대한 응답을 반환합니다.

#### 매개변수
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | 로그인할 사용자 ID            |
| `password`| `string` | 사용자 비밀번호               |

#### 반환값
- **200 OK**: 로그인 성공 시
```json
"message": "로그인 성공"
```

- **400 Bad Request**: ID 또는 비밀번호가 입력되지 않았을 때
```json
"message": "ID와 비밀번호를 입력해 주세요."
```

- **401 Unauthorized**: 잘못된 ID 또는 비밀번호로 로그인 실패 시
```json
"message": "로그인 실패: 잘못된 ID 또는 비밀번호"
```

- **403 Forbidden**: 모바일에서 먼저 로그인해야 할 때
```json
"message": "모바일에서 먼저 로그인 해주세요."
```

- **500 Internal Server Error**: 쿼리 실행 실패 또는 OTP 저장 실패 시
```json
"message": "쿼리 실행 실패"  // 또는 "OTP 저장 실패."
```

---

### 모바일 로그인 API
```javascript
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
```
#### 설명
- **기능**: 사용자의 ID와 비밀번호를 통해 모바일에서 로그인 요청을 처리하고, 성공 또는 실패에 대한 응답을 반환합니다.

#### 매개변수
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | 로그인할 사용자 ID            |
| `password`| `string` | 사용자 비밀번호               |

#### 반환값
- **200 OK**: 모바일 로그인 성공 시
```json
"message": "모바일 로그인 성공"
```

- **400 Bad Request**: ID 또는 비밀번호가 입력되지 않았을 때
```json
"message": "ID와 비밀번호를 입력해 주세요."
```

- **401 Unauthorized**: 잘못된 ID 또는 비밀번호로 로그인 실패 시
```json
"message": "로그인 실패: 잘못된 ID 또는 비밀번호"
```

- **500 Internal Server Error**: 쿼리 실행 실패 또는 OTP 저장 실패 시
```json
"message": "쿼리 실행 실패"  // 또는 "OTP 저장 실패."
```

---

### 모바일 로그아웃 API
```javascript
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
```

#### 설명
- **기능**: 사용자의 ID를 통해 모바일 로그아웃 요청을 처리하고, 성공 또는 실패에 대한 응답을 반환합니다.

#### 매개변수
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | 로그아웃할 사용자 ID (URL 파라미터) |

#### 반환값
- **200 OK**: 모바일 로그아웃 성공 시
```json
"message": "모바일 로그아웃 성공"
```

- **500 Internal Server Error**: 로그인 상태 업데이트 실패 시
```json
"message": "로그인 상태 업데이트 실패"
```

---

### OTP 조회 API
```javascript
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
```
#### 설명
- **기능**: 사용자의 ID를 통해 OTP를 조회하고, 성공 또는 실패에 대한 응답을 반환합니다.

#### 매개변수
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | OTP를 조회할 사용자 ID (URL 파라미터) |

#### 반환값
- **200 OK**: OTP 조회 성공 시
```json
"otp": "OTP 코드"
```

- **404 Not Found**: OTP가 존재하지 않거나 만료된 경우
```json
"message": "OTP가 존재하지 않거나 만료되었습니다."
```

- **500 Internal Server Error**: 쿼리 실행 실패 시
```json
쿼리 실행 실패
```

---

### OTP 확인 API
```javascript
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
```
### 설명
- **기능**: 클라이언트에서 전송된 ID와 OTP를 확인하여 유효성을 검증하고, 성공 시 JWT를 생성하여 반환합니다.

### 매개변수
- `id`: 클라이언트에서 전송된 사용자 ID
- `otp`: 클라이언트에서 전송된 OTP

### 동작
1. 클라이언트로부터 ID와 OTP를 요청 본문에서 추출합니다.
2. 데이터베이스에서 OTP를 확인하는 쿼리를 실행합니다.
3. OTP가 일치하고 유효한 경우:
   - 성공 로그를 기록하고 JWT를 생성합니다.
   - 성공 메시지와 함께 토큰을 반환합니다.
4. OTP가 일치하지 않거나 만료된 경우:
   - 실패 로그를 기록하고 오류 메시지를 반환합니다.

### 반환값
- **200 OK**: OTP 인증 성공 시
```json
"message": "성공",
"token": "생성된 JWT"
```

- **401 Unauthorized**: OTP 인증 실패 시
```json
"message": "OTP 확인 실패 혹은 만료됨"
```

- **500 Internal Server Error**: 쿼리 실행 실패 시
```plaintext
쿼리 실행 실패
```

---

## page.js

### session 셋업
```javascript
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
```
#### 설명
- **기능**: Express 애플리케이션에서 세션 관리를 설정합니다.

#### 세션 설정
- **secret**: 세션을 암호화하기 위한 비밀 키입니다.
- **resave**: 세션이 수정되지 않은 경우에도 저장할지 여부를 결정합니다. `false`로 설정하면 수정되지 않은 세션은 저장되지 않습니다.
- **saveUninitialized**: 초기화되지 않은 세션을 저장할지 여부를 결정합니다. `true`로 설정하면 초기화되지 않은 세션도 저장됩니다.
- **cookie**: 세션 쿠키의 설정입니다.
  - **secure**: `true`로 설정하면 HTTPS에서만 쿠키가 전송됩니다. 현재 `false`로 설정되어 있어 HTTP에서도 사용할 수 있습니다.

#### 사용 예시
```javascript
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
```

---

### 정적 파일을 제공하기 위해 public 디렉토리 설정
```javascript
// 정적 파일을 제공하기 위해 public 디렉토리 설정
app.use(express.static(path.join(__dirname, 'pc_login')));
```
#### 설명
- **기능**: Express 애플리케이션에서 정적 파일을 제공하기 위해 특정 디렉토리를 설정합니다.

#### 정적 파일 설정
- **express.static**: 정적 파일을 제공하는 미들웨어입니다.
- **path.join(__dirname, 'pc_login')**: 현재 디렉토리(`__dirname`)와 `pc_login` 디렉토리를 결합하여 정적 파일의 경로를 설정합니다.

---

### 서버 실행
```javascript
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
```
#### 설명
- **기능**: Express 애플리케이션을 지정된 포트에서 실행합니다.

#### 동작
- **app.listen**: 서버를 시작하고 클라이언트의 요청을 수신할 준비를 합니다.
- **PORT**: 서버가 실행될 포트 번호입니다.
- 서버가 성공적으로 실행되면, 콘솔에 실행 중인 URL을 출력합니다.

---

### 로그인 페이지 라우트
```javascript
// 로그인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
```
#### 설명
- **기능**: 로그인 페이지를 클라이언트에 제공하는 라우트를 설정합니다.

#### 라우트 설정
- **HTTP 메서드**: `GET`
- **경로**: 루트 경로 (`/`)
- **응답**: 클라이언트에게 `login.html` 파일을 전송합니다.

---

### 홈페이지 라우팅 설정
```javascript
//home.html 라우트
app.get('/home.html', (req, res) => {
    const token = req.headers.token;
    if (token) {
        req.session.token = token;
    }
    if (!req.session.token) {
        sendLogMemo('unknown', '홈페이지 접근', '실패', '토큰 없음');
        return res.status(401).send(`
        <h1>접근권한 없음. 로그인 후 이용 해주세요.</h1>
        <button onclick="window.location.href='http://localhost:4000/'">로그인 페이지로 이동</button>
    `);
    }
    jwt.verify(req.session.token, 'grad-project', (err, decoded) => {
        if (err) {
            sendLogMemo('unknown', '토큰 인증', '실패', '토큰 없음');
            return res.status(401).send('Unauthorized: Invalid token');
        }
        sendLogMemo(decoded.userId, '토큰 인증', '성공', '');
        req.userId = decoded.userId;
        sendLogMemo(req.userId, '홈페이지 접근', '성공', '');
        handleHomePage(req, res);
    });
});
```

#### 설명
- **기능**: 사용자가 `/home.html` 경로에 접근할 때 토큰을 검증하고, 유효한 경우 홈 페이지를 제공하는 라우트를 설정합니다.

#### 라우트 설정
- **HTTP 메서드**: `GET`
- **경로**: `/home.html`
- **토큰 처리**:
  - 요청 헤더에서 `token`을 추출하여 세션에 저장합니다.
  - 세션에 토큰이 없으면 접근 거부 메시지를 반환합니다.
  
#### 동작 흐름
1. **토큰 확인**:
   - 요청 헤더에서 토큰을 가져옵니다.
   - 토큰이 없으면 로그를 기록하고 401 상태 코드와 함께 접근 거부 메시지를 반환합니다.
   
2. **토큰 검증**:
   - `jwt.verify`를 사용하여 토큰의 유효성을 검사합니다.
   - 유효하지 않은 경우 로그를 기록하고 401 상태 코드와 함께 오류 메시지를 반환합니다.
   
3. **홈페이지 접근**:
   - 유효한 토큰이 확인되면 사용자 ID를 세션에 저장하고, 로그를 기록한 후 `handleHomePage` 함수를 호출하여 홈 페이지를 처리합니다.

---

### 홈페이지 전달
```javascript
function handleHomePage(req, res) {
    res.sendFile(path.join(__dirname, 'home.html'));
}
```
#### 설명
- **기능**: 클라이언트에게 홈 페이지인 `home.html` 파일을 전송하는 함수입니다.

#### 함수 동작
- **매개변수**:
  - `req`: 요청 객체
  - `res`: 응답 객체

- **동작**: 
  - `res.sendFile`을 사용하여 `home.html` 파일을 클라이언트에 전송합니다.

---

### 404 처리
```javascript
app.use((req, res) => {
    res.status(404).send('404: 페이지를 찾을 수 없습니다.');
});
```

#### 설명
- **기능**: 요청한 페이지를 찾을 수 없을 때 404 오류를 처리하는 미들웨어를 설정합니다.

#### 동작
- 모든 요청에 대해 실행되며, 요청한 경로가 서버에서 처리되지 않을 경우 404 상태 코드와 함께 오류 메시지를 반환합니다.

---

### 로그 기록 전송 함수
```javascript
function sendLogMemo(userId, action, result, issue) {
    fetch('http://localhost:3000/logActivity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId,
            action,
            result,
            issue
        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}
```

#### 설명
- **기능**: 사용자 활동을 로그로 기록하기 위해 서버에 전송하는 함수입니다.
- 로그와 로그 기록 함수가 index.js에 있기 때문에 같이 로깅을 위한 함수입니다.

#### 함수 동작
- **매개변수**:
  - `userId`: 로그를 기록할 사용자 ID
  - `action`: 수행한 액션 (예: 로그인, 페이지 접근 등)
  - `result`: 액션의 결과 (예: 성공, 실패)
  - `issue`: 관련된 이슈나 추가 정보

- **동작**:
  - `fetch` API를 사용하여 로그 기록을 서버에 POST 방식으로 전송합니다.
  - 요청 헤더에 `Content-Type`을 `application/json`으로 설정하고, 로그 데이터를 JSON 형식으로 전송합니다.
  - 서버로부터의 응답을 처리하여 로그를 콘솔에 출력하며, 오류 발생 시 오류 메시지를 콘솔에 출력합니다.

---

### 로그아웃 API
```javascript
app.post('/logout', (req, res) => {
    jwt.verify(req.session.token, 'grad-project', (err, decoded) => {
        if (err) {
            // 토큰 인증 관련 에러
            console.error('Error verifying token:', err);
            return res.status(401).send('Unauthorized: Invalid token');
        }
        const userId = decoded.userId;
        req.session.destroy((err) => {
            if (err) {
                sendLogMemo(userId, '홈페이지 로그아웃 및 토큰 삭제', '실패', '세션 파기 실패');
                console.error('Error destroying session:', err);
            } else {
                sendLogMemo(userId, '홈페이지 로그아웃 및 토큰 삭제', '성공', '');
                res.json({ message: 'Logged out successfully' });
            }
        });
    });
});
```

#### 설명
- **기능**: 사용자의 로그아웃 요청을 처리하고 세션을 삭제하는 라우트를 설정합니다.

#### 라우트 설정
- **HTTP 메서드**: `POST`
- **경로**: `/logout`

#### 동작 흐름
1. **토큰 검증**:
   - `jwt.verify`를 사용하여 세션에 저장된 토큰의 유효성을 검사합니다.
   - 유효하지 않은 경우 401 상태 코드와 함께 오류 메시지를 반환합니다.

2. **세션 삭제**:
   - 토큰이 유효한 경우, 사용자 ID를 추출합니다.
   - `req.session.destroy`를 호출하여 세션을 삭제합니다.
   - 세션 삭제에 실패하면 로그를 기록하고 오류 메시지를 출력합니다.
   - 세션 삭제가 성공하면 로그를 기록하고 성공 메시지를 JSON 형식으로 반환합니다.



## API를 활용한 데모 프로젝트 설명

해당 프로젝트에는 데모로 실행하기 위한 모바일 앱과 PC HTML 파일도 들어있다. 
해당 파일들은 예시이며 참고용으로 사용하길 바란다.
그대로 따라서 본인 코드에 넣으면 안될 것이다. 본인 코드에 맟춰 사용 바란다.
여기에서는 API 호출 부분만 간략하게 설명 하도록 한다.

### 프로젝트 구성 (주요 폴더와 파일)

- api_download (API 사용시 다운로드, 데모 미사용)
- data
    - login_info.csv (데모 사용 로그인 정보 - DB에 들어있는 내용)
- login_api (1/2차 인증 담당 API)
    - index.js
    - log.txt
- mobile_otp_app (데모를 위한 플러터 모바일 앱)
  - lib
    - main.dart (모바일 1차 로그인 페이지)
    - otp.dart (OTP 표시 페이지)
- pc_login (PC 로그인 페이지와 홈페이지)
  - page.js (홈페이지 라우팅 API)
  - login.html (로그인 페이지)
  - home.html (예시 홈페이지)

`index.js`는 `localhost:3000`에서 호스팅하고
`page.js`는 'localhost:4000'에서 호스팅 했다

### 서비스 흐름
1. 모바일에서 1차 로그인 한다.
2. PC에서 1차 로그인 한다.
3. 모바일에 OTP가 표시된다.
4. PC에서 OTP 입력
5. 홈페이지 접근 성공
6. 홈페이지 로그아웃

### 흐름에 따른 코드 설명

### 모바일 1차 로그인 기능 (main.dart)
```dart
Future<void> login() async {
    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:3000/mobile_login'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'id': controller.text,
          'password': controller2.text,
        }),
      );
      if (response.statusCode == 200) {
        String userId = controller.text;
        if (context.mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (BuildContext context) => OTPPage(userId: userId)),
          );
        }
      } else {
        if (context.mounted) {
          showSnackBar(context, const Text('로그인에 실패 했습니다'));
        }
      }
    } catch (e) {
      if (context.mounted) {
        showSnackBar(context, const Text('네트워크 오류가 발생했습니다. 다시 시도해 주세요.'));
      }
    }
}
```

#### 설명
- **기능**: 사용자가 입력한 ID와 비밀번호를 서버에 POST 요청하여 로그인 처리를 수행합니다.

#### 동작 흐름
1. **HTTP POST 요청**:
   - `http.post`를 사용하여 로그인 정보를 서버에 전송합니다.
   - 요청 URL: `http://10.0.2.2:3000/mobile_login`
   - 요청 헤더에 `Content-Type`을 `application/json; charset=UTF-8`으로 설정합니다.
   - 요청 본문에 사용자가 입력한 ID와 비밀번호를 JSON 형식으로 전송합니다.

2. **응답 처리**:
   - 서버의 응답 상태 코드가 200인 경우, 로그인 성공으로 간주하고 `userId`를 사용하여 `OTPPage`로 이동합니다.
   - 상태 코드가 200이 아닌 경우, 로그인 실패 메시지를 스낵바로 표시합니다.

3. **예외 처리**:
   - 네트워크 오류가 발생한 경우, 관련 오류 메시지를 스낵바로 표시합니다.

---

### PC 1차 로그인 기능 (login.html)
```javascript
// 로그인 폼
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('id').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('login-error'); // 로그인 오류 메시지 요소
    const mobileError = document.getElementById('mobile-error'); // 모바일 오류 메시지 요소

    // 오류 메시지 초기화
    loginError.style.display = 'none';
    mobileError.style.display = 'none';

    // 간단한 클라이언트 측 검증
    fetch('http://localhost:3000/pc_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: username, password: password })
    })
        .then(response => {
            if (response.status === 200) {
                // 로그인 성공
                alert(`로그인 성공!`);
                document.querySelector('.login-container').style.display = 'none';
                document.querySelector('.otp-container').style.display = 'block';
                userId = username;
                // 타이머 시작
                startTimer(); // 3분 타이머 시작
            }
            else if (response.status === 403) {
                // 모바일 오류 처리
                mobileError.style.display = 'block';
                throw new Error('Mobile error');
            } else if (response.status === 401) {
                // 로그인 오류 처리
                loginError.style.display = 'block';
                throw new Error('Login error');
            }
            return response.json();
        });
});
```

#### 설명
- **기능**: 로그인 폼을 처리하고 서버에 로그인 요청을 보내는 JavaScript 코드입니다.

#### 동작 흐름
1. **폼 제출 이벤트 리스너**:
   - `submit` 이벤트가 발생하면 기본 동작을 방지하고, 사용자가 입력한 ID와 비밀번호를 가져옵니다.

2. **오류 메시지 초기화**:
   - 로그인 오류 메시지와 모바일 오류 메시지를 숨깁니다.

3. **클라이언트 측 검증 및 서버 요청**:
   - `fetch`를 사용하여 서버에 로그인 정보를 POST 방식으로 전송합니다.
   - 요청 URL: `http://localhost:3000/pc_login`
   - 요청 본문에 사용자 ID와 비밀번호를 JSON 형식으로 포함합니다.

4. **응답 처리**:
   - 서버의 응답 상태 코드에 따라 다음과 같이 처리합니다:
     - **200**: 로그인 성공
       - 성공 메시지를 알림으로 표시하고, 로그인 폼을 숨기며 OTP 입력 화면을 표시합니다.
       - 사용자 ID를 저장하고 3분 타이머를 시작합니다.
     - **403**: 모바일 오류
       - 모바일 오류 메시지를 표시합니다.
     - **401**: 로그인 오류
       - 로그인 오류 메시지를 표시합니다.

---

### 모바일 OTP 표시 기능 (otp.dart)
```dart
Future<void> fetchOTP() async {
    setState(() {
      errorMessage = ''; // 오류 메시지 초기화
      isLoading = true; // 로딩 시작
    });

    try {
      final response = await http.get(
        Uri.parse(
            'http://10.0.2.2:3000/get_otp/${widget.userId}'), // 서버의 로그인 API URL
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          otp = data['otp']; // 서버에서 받은 OTP
          isLoading = false; // 로딩 완료
        });
      } else {
        setState(() {
          isLoading = false; // 로딩 완료
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = '오류 발생: $e';
        isLoading = false; // 로딩 완료
      });
    }
}
```

#### 설명
- **기능**: 서버에서 OTP(일회용 비밀번호)를 가져오는 비동기 함수입니다.

#### 동작 흐름
1. **상태 초기화**:
   - `setState`를 통해 오류 메시지를 초기화하고 로딩 상태를 `true`로 설정합니다.

2. **HTTP GET 요청**:
   - `http.get`을 사용하여 서버에 요청을 보냅니다.
   - 요청 URL: `http://10.0.2.2:3000/get_otp/${widget.userId}` (사용자의 ID를 포함)

3. **응답 처리**:
   - 서버의 응답 상태 코드가 200인 경우:
     - 응답 본문을 JSON 형식으로 파싱하여 OTP를 가져옵니다.
     - 가져온 OTP를 상태에 저장하고 로딩 상태를 `false`로 설정합니다.
   - 상태 코드가 200이 아닌 경우:
     - 로딩 상태만 `false`로 설정합니다.

4. **예외 처리**:
   - 요청 중 오류가 발생한 경우, 오류 메시지를 설정하고 로딩 상태를 `false`로 변경합니다.


---

### PC에서 2차인증 OTP를 검증 (login.html)
```javascript
// OTP 폼
document.getElementById('otpForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const otp = document.getElementById('otp').value;
    const otpError = document.getElementById('otp-error');

    // id를 올바르게 설정되었는지 확인
    fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId, otp: otp }) // userId를 통해서 요청
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.token);
            if (data.message === '성공') {
                verifyToken(data.token);
            } else {
                otpError.style.display = 'block'; // 오류 메시지 표시
                throw new Error('OTP 인증 실패');
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
});
```

#### 설명
- **기능**: 사용자가 입력한 OTP(일회용 비밀번호)를 서버에 전송하여 인증하는 JavaScript 코드입니다.

#### 동작 흐름
1. **폼 제출 이벤트 리스너**:
   - `submit` 이벤트가 발생할 때 기본 동작을 방지하고 사용자가 입력한 OTP 값을 가져옵니다.

2. **서버 요청**:
   - `fetch`를 사용하여 서버에 OTP 인증 요청을 보냅니다.
   - 요청 URL: `http://localhost:3000/verify-otp`
   - 요청 본문에 사용자 ID와 입력한 OTP를 JSON 형식으로 포함합니다.

3. **응답 처리**:
   - 서버의 응답을 JSON으로 파싱합니다.
   - 응답 메시지가 `'성공'`인 경우:
     - 인증 성공 시 `verifyToken` 함수를 호출하여 토큰을 처리합니다.
   - 그렇지 않은 경우:
     - 오류 메시지를 표시하고 오류를 발생시킵니다.

4. **예외 처리**:
   - 요청 중 오류가 발생한 경우, 오류 메시지를 콘솔에 출력합니다.

---

### OTP 인증 성공 시 토큰 발행 및 홈페이지로 리디렉팅 기능 (login.html)
```javascript
// 토큰 및 리디렉팅 함수
function verifyToken(token) {
    fetch('http://localhost:4000/home.html', {
        method: 'GET',
        headers: {
            'Token': token
        }
    })
        .then(response => {
            if (response.ok) {
                console.log('Token verified successfully');
                const url = response.url;
                window.location.href = url; // home.html로 디렉팅
            } else {
                console.error('Error verifying token:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}
```
#### 설명
- **기능**: 서버에 토큰을 검증하고, 성공적으로 검증된 경우 사용자를 홈 페이지로 리디렉션하는 함수입니다.

#### 동작 흐름
1. **토큰 검증 요청**:
   - `fetch`를 사용하여 서버에 GET 요청을 보냅니다.
   - 요청 URL: `http://localhost:4000/home.html`
   - 요청 헤더에 `Token`을 포함하여 서버에 전송합니다.

2. **응답 처리**:
   - 서버의 응답이 성공적(`response.ok`)인 경우:
     - 성공 메시지를 콘솔에 출력합니다.
     - 응답의 URL을 가져와 해당 URL로 리디렉션합니다.
   - 응답이 성공적이지 않은 경우:
     - 오류 메시지를 콘솔에 출력합니다.

3. **예외 처리**:
   - 요청 중 오류가 발생한 경우, 오류 메시지를 콘솔에 출력합니다.

---

### 홈페이지 로그아웃 기능 (home.html)
```javascript
// 로그아웃 버튼 클릭 이벤트 처리
document.getElementById('logoutBtn').addEventListener('click', function () {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = '/';
        })
        .catch(error => console.error('Error:', error.message));
});
```
#### 설명
- **기능**: 사용자가 로그아웃 버튼을 클릭할 때 서버에 로그아웃 요청을 보내고, 성공적으로 로그아웃되면 홈 페이지로 리디렉션하는 코드입니다.

#### 동작 흐름
1. **버튼 클릭 이벤트 리스너**:
   - `logoutBtn` 요소에 클릭 이벤트 리스너를 추가합니다.

2. **서버 로그아웃 요청**:
   - `fetch`를 사용하여 `/logout` 경로에 POST 요청을 보냅니다.
   - 요청 헤더에 `Content-Type`을 `application/json`으로 설정합니다.

3. **응답 처리**:
   - 서버의 응답을 JSON 형식으로 파싱합니다.
   - 로그아웃이 성공적으로 처리되면, 사용자를 홈 페이지(`'/'`)로 리디렉션합니다.

4. **예외 처리**:
   - 요청 중 오류가 발생한 경우, 오류 메시지를 콘솔에 출력합니다.

---

## API 사용방법

### Node.js 다운로드 및 설치

- **Node.js 다운로드 및 설치**
  - Node.js 공식 웹사이트: [nodejs.org](https://nodejs.org)로 이동합니다.
- **운영체제에 맞는 설치 파일**:
  - Windows, macOS, 또는 Linux에 맞는 설치 파일을 다운로드합니다.
- **설치**:
  - 다운로드한 파일을 실행하여 설치 과정을 따릅니다. 대부분의 경우 기본값으로 진행하면 됩니다.

**설치 확인**
   - 설치가 완료되면, 터미널(명령 프롬프트)에서 다음 명령어를 입력하여 설치가 제대로 되었는지 확인합니다:

```bash
node -v
npm -v
```

### 필요 npm 라이브러리 다운로드
```bash
npm init -y
```

```bash
npm install express mysql2 body-parser cors jsonwebtoken
```

### db에 OTP 항목 테이블 생성
```sql
CREATE TABLE otp (
    user VARCHAR() NOT NULL,  -- 사용자 ID
    otp NUMBER() NOT NULL    -- OTP 값
);
```

### 데이터베이스 연결 설정

해당 예시는 `MySQL`이다. 본인 프로젝트에서 사용하는 DB로 변경하여 사용하기 바란다.

```javascript
// MySQL 데이터베이스 연결 설정
// 다른 데이터베이스 사용 시 해당 내용 변경 필요
const connection = mysql.createConnection({   // connection이라는 연결 변수 선언. 앞으로 db와의 연결은 connection으로 호출
  host: 'localhost', // **알맞게 변경 **
  user: 'root', // **알맞게 변경 **
  password: '0000', // **알맞게 변경 **
  database: 'my_login_db' // **알맞게 변경 **
});
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `host` | `string` | 데이터베이스 호스트 |
| `user` | `string` | MySQL 사용자 이름|
| `password` | `string` | MySQL 비밀번호 |
| `databse` | `string` | 사용할 데이터베이스 이름 |

### page.js 홈페이지 라우트 및 홈페이지 전달 함수 수정
```javascript
app.get('/home.html', (req, res) => { }
```
```javascript
function handleHomePage(req, res) {
    res.sendFile(path.join(__dirname, 'home.html'));
}
```
`/home.html`로 되어있는 부분을 본인의 홈페이지 주소에 맞게 작성해준다.

### 포트 설정 후 서버 운영

`index.js`와 `page.js`의 포트를 각각 정해주고 서버를 실행 해주길 바란다.

이후 기능 구현 및 사용하면 된다.


## 마무리
해당 프로젝트를 진행하면서 서버사이드 프로그래밍과 데모 시연을 위한 코딩을 통해 풀스택 개발자에 한발자국 다가갈 수 있었다고 생각한다. 

SDP에 대한 개념과 이해도 또한 늘었으며 이 주제로 졸업프로젝트를 진행할 수 있도록 도와주신 담당교수 원유재 교수님한테 감사하고 종합설계 과목에서 프로젝트 방향성에 도움 주신 김영국 교수님 또한 감사드립니다.
