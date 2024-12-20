import 'package:flutter/material.dart';
import 'package:mobile_otp_app/otp.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OTP Generator',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const IDPWLoginPage(title: 'ID/PW Login Page'),
      debugShowCheckedModeBanner: false, // 디버그 배너 끄기
    );
  }
}

class IDPWLoginPage extends StatefulWidget {
  const IDPWLoginPage({super.key, required this.title});

  final String title;

  @override
  State<IDPWLoginPage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<IDPWLoginPage> {
  final TextEditingController controller = TextEditingController();
  final TextEditingController controller2 = TextEditingController();

  @override
  void dispose() {
    controller.dispose();
    controller2.dispose();
    super.dispose();
  }

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

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) {
        return;
      },
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: const Text('로그인 페이지'),
          elevation: 0.0,
          backgroundColor: Colors.blue,
          centerTitle: true,
        ),
        body: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
          },
          child: SingleChildScrollView(
            child: Column(
              children: [
                const Padding(padding: EdgeInsets.only(top: 50)),
                Form(
                  child: Theme(
                    data: ThemeData(
                      primaryColor: Colors.grey,
                      inputDecorationTheme: const InputDecorationTheme(
                        labelStyle:
                            TextStyle(color: Colors.teal, fontSize: 15.0),
                      ),
                    ),
                    child: Container(
                      padding: const EdgeInsets.all(40.0),
                      child: Builder(builder: (context) {
                        return Column(
                          children: [
                            TextField(
                              controller: controller,
                              autofocus: true,
                              decoration:
                                  const InputDecoration(labelText: '아이디'),
                              keyboardType: TextInputType.emailAddress,
                            ),
                            TextField(
                              controller: controller2,
                              decoration:
                                  const InputDecoration(labelText: '비밀번호'),
                              keyboardType: TextInputType.text,
                              obscureText: true,
                            ),
                            const SizedBox(height: 40.0),
                            ButtonTheme(
                              minWidth: 100.0,
                              height: 50.0,
                              child: ElevatedButton(
                                onPressed: login, // 로그인 함수 호출
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.orangeAccent,
                                ),
                                child: const Icon(
                                  Icons.arrow_forward,
                                  color: Colors.white,
                                  size: 35.0,
                                ),
                              ),
                            ),
                          ],
                        );
                      }),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
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
}
