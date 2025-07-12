import 'package:flutter/material.dart';

class QuestionDetailScreen extends StatelessWidget {
  final TextEditingController answerController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("StackIt"),
        actions: [
          TextButton(onPressed: () {}, child: Text('Home', style: TextStyle(color: Colors.white))),
          IconButton(onPressed: () {}, icon: Icon(Icons.notifications)),
          CircleAvatar(backgroundColor: Colors.white),
          SizedBox(width: 10),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          Text("Question > How to join...", style: TextStyle(color: Colors.blue)),
          SizedBox(height: 12),
          Text("How to join 2 columns in a data set to make a separate column in SQL",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          Wrap(
            spacing: 6,
            children: ["SQL", "Join"].map((tag) => Chip(label: Text(tag))).toList(),
          ),
          SizedBox(height: 8),
          Text("I do not know the code for it as I am a beginner..."),

          SizedBox(height: 20),
          Divider(),
          Text("Answers", style: TextStyle(fontSize: 18)),

          ListTile(title: Text("Answer 1"), subtitle: Text("Use the || operator or CONCAT()")),
          ListTile(title: Text("Answer 2"), subtitle: Text("Use CONCAT_WS() for better control")),

          SizedBox(height: 16),
          Divider(),
          Text("Submit Your Answer"),
          SizedBox(height: 8),
          TextField(
            controller: answerController,
            maxLines: 4,
            decoration: InputDecoration(hintText: "Write your answer...", border: OutlineInputBorder()),
          ),
          SizedBox(height: 12),
          ElevatedButton(onPressed: () {}, child: Text("Submit")),
        ],
      ),
    );
  }
}
