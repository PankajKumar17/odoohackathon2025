import 'package:flutter/material.dart';

class AnswerTile extends StatelessWidget {
  const AnswerTile({super.key});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: const Text('Answer Body'),
      trailing: const Icon(Icons.thumb_up),
    );
  }
}