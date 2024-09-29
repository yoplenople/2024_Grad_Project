import 'package:flutter/material.dart';


class OTPPage extends StatelessWidget {
  const OTPPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('OTP Generator'),
      ),

      body: const Center(
        child: Text('OTP Page'),
        
      ),
    );
  }
}
