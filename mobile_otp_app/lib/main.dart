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
  TextEditingController controller = TextEditingController();
  TextEditingController controller2 = TextEditingController();

  Future<void> login() async {
  try {
    final response = await http.post(
      Uri.parse('http://10.0.2.2:3000/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'id': controller.text,
        'password': controller2.text,
      }),
    );

    if (response.statusCode == 200) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (BuildContext context) => OTPPage()),
      );
    } else {
      final responseData = json.decode(response.body);
      showSnackBar(context, Text(responseData['message'])); // 수정된 부분
    }
  } catch (e) {
    showSnackBar(context, const Text('네트워크 오류가 발생했습니다. 다시 시도해 주세요.'));
  }
}


  @override

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ID/PW Login Page'),
        elevation: 0.0,
        backgroundColor: Colors.blue,
        centerTitle: true,
        leading: IconButton(icon: const Icon(Icons.menu), onPressed: () {}),
        actions: <Widget>[
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        ],
      ),
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: SingleChildScrollView(
          child: Column(
            children: [
              const Padding(padding: EdgeInsets.only(top: 50)),
              const Center(
                child: Image(
                  image: AssetImage('cheesetrust_logo.png'),
                  width: 170.0,
                ),
              ),
              Form(
                child: Theme(
                  data: ThemeData(
                    primaryColor: Colors.grey,
                    inputDecorationTheme: const InputDecorationTheme(
                      labelStyle: TextStyle(color: Colors.teal, fontSize: 15.0),
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
                            decoration: const InputDecoration(labelText: 'Enter ID'),
                            keyboardType: TextInputType.emailAddress,
                          ),
                          TextField(
                            controller: controller2,
                            decoration: const InputDecoration(labelText: 'Enter PW'),
                            keyboardType: TextInputType.text,
                            obscureText: true,
                          ),
                          const SizedBox(height: 40.0),
                          ButtonTheme(
                            minWidth: 100.0,
                            height: 50.0,
                            child: ElevatedButton(
                              onPressed: login, // 로그인 함수 호출
                              child: const Icon(
                                Icons.arrow_forward,
                                color: Colors.white,
                                size: 35.0,
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.orangeAccent,
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
