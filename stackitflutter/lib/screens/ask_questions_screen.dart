import 'package:flutter/material.dart';

class AskQuestionScreen extends StatefulWidget {
  final Function(Map<String, dynamic>) onQuestionPosted; // Callback to add question

  const AskQuestionScreen({super.key, required this.onQuestionPosted});

  @override
  _AskQuestionScreenState createState() => _AskQuestionScreenState();
}

class _AskQuestionScreenState extends State<AskQuestionScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _tagsController = TextEditingController();

  // Function to submit the question
  void _submitQuestion() {
    final title = _titleController.text.trim();
    final description = _descController.text.trim();
    final tags = _tagsController.text.trim().split(',');

    if (title.isEmpty || description.isEmpty || tags.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill in all required fields")),
      );
      return;
    }

    // Create the new question map
    final newQuestion = {
      'id': DateTime.now().toString(), // Unique ID based on the time
      'title': title,
      'description': description,
      'tags': tags,
      'answers': 0,
      'user': 'Anonymous',
      'upvotes': 0,
      'downvotes': 0,
    };

    // Pass the new question to the parent widget
    widget.onQuestionPosted(newQuestion);

    // Close the screen after submitting
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Ask a New Question")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const Text("Title", style: TextStyle(fontWeight: FontWeight.bold)),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                hintText: "e.g. How to join 2 columns in SQL?",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),

            const Text("Description", style: TextStyle(fontWeight: FontWeight.bold)),
            TextField(
              controller: _descController,
              decoration: const InputDecoration(
                hintText: "Describe your problem clearly...",
                border: OutlineInputBorder(),
              ),
              maxLines: 5,  // Allow multi-line input for the description
            ),
            const SizedBox(height: 16),

            const Text("Tags (comma-separated)", style: TextStyle(fontWeight: FontWeight.bold)),
            TextField(
              controller: _tagsController,
              decoration: const InputDecoration(
                hintText: "e.g. SQL, Join, Beginner",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),

            ElevatedButton.icon(
              onPressed: _submitQuestion,
              icon: const Icon(Icons.send),
              label: const Text("Submit Question"),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
