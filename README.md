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

### API 설명

API 파일은 두가지로 이루어져 있다.
- index.js
    - 1차인증과 2차인증을 담당하는 서버
- page.js
    - 2차 인증까지 완료된 사용자를 서비스로 리디렉팅 해주는 서버

이 두 파일은 서로 다른 두 서버로 실행하도록 설계 되어있다. 

#### index.js

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

---

#### 매개변수
| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `userId`  | `string` | OTP를 저장할 사용자 ID              |
| `otp`     | `string` | 저장할 OTP 코드                     |
| `callback`| `function`| 쿼리 실행 후 호출할 콜백 함수     |

---

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

---

#### 매개변수
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | OTP를 재발급할 사용자 ID      |
| `password` | `string` | 사용자 비밀번호 (확인용)      |

---

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

---

#### 매개변수
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | 로그인할 사용자 ID            |
| `password`| `string` | 사용자 비밀번호               |

---

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

---

#### 매개변수
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `string` | 로그인할 사용자 ID            |
| `password`| `string` | 사용자 비밀번호               |

---

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




### API를 활용한 데모 프로젝트 설명

해당 프로젝트에는 데모로 실행하기 위한 모바일 앱과 PC HTML 파일도 들어있다. 
해당 파일들은 예시이며 참고용으로 사용하길 바란다.

#### 프로젝트 구성 (주요 폴더와 파일)

- api_download (API 사용시 다운로드, 데모 미사용)
- data
    - login_info.csv (데모 사용 로그인 정보 - DB에 들어있는 내용)
- login_api
    - 


### API 사용방법



