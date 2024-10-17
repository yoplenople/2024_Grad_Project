import 'package:flutter/material.dart';
import 'package:mobile_otp_app/main.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class OTPPage extends StatefulWidget {
  final String userId; // 사용자 ID를 전달받음

  const OTPPage({super.key, required this.userId});

  @override
  _OTPPageState createState() => _OTPPageState();
}

class _OTPPageState extends State<OTPPage> {
  String otp = ''; // OTP 값을 저장할 변수
  bool isLoading = true; // 로딩 상태를 관리할 변수
  String errorMessage = ''; // 오류 메시지를 저장할 변수

  @override
  void initState() {
    super.initState();
    fetchOTP(); // OTP를 가져오는 함수 호출
  }

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

  Future<void> logout() async {
    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:3000/mobile_logout/${widget.userId}'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'id': widget.userId,
        }),
      );
      if (response.statusCode == 200) {
        // 로그아웃 성공 시
        showSnackBar(context, const Text('로그아웃 성공'));
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (BuildContext context) =>
                  IDPWLoginPage(title: "ID/PW Login Page")),
        );
      } else {
        showSnackBar(context, const Text('로그아웃 실패'));
      }
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        return false;
      },
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: const Text('OTP Generator'),
          actions: [
            IconButton(
              icon: const Icon(Icons.logout), // 로그아웃 아이콘
              onPressed: () {
                logout();
                print('로그아웃 버튼 클릭됨');
              },
            ),
          ],
        ),
        body: Center(
          child: isLoading
              ? const CircularProgressIndicator() // 로딩 중일 때
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Your OTP is:',
                      style: TextStyle(fontSize: 24),
                    ),
                    const SizedBox(height: 20), // 간격 추가
                    Text(
                      otp.isNotEmpty ? otp : 'No OTP generated', // OTP 값을 표시
                      style: const TextStyle(
                          fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20), // 간격 추가
                    if (errorMessage.isNotEmpty) // 오류 메시지 표시
                      Text(
                        errorMessage,
                        style: const TextStyle(color: Colors.red, fontSize: 16),
                      ),
                    const SizedBox(height: 20), // 간격 추가
                    ElevatedButton(
                      onPressed: fetchOTP, // 버튼 클릭 시 fetchOTP 호출
                      child: const Text('Refresh OTP'), // 버튼 텍스트
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}

void showSnackBar(BuildContext context, Text text) {
  final snackBar = SnackBar(
    content: text,
    backgroundColor: const Color.fromARGB(255, 112, 48, 48),
  );

// Find the ScaffoldMessenger in the widget tree
// and use it to show a SnackBar.
  ScaffoldMessenger.of(context).showSnackBar(snackBar);
}
