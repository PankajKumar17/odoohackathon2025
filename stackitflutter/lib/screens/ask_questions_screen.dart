import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class AskQuestionScreen extends StatefulWidget {
  const AskQuestionScreen({super.key});

  @override
  State<AskQuestionScreen> createState() => _AskQuestionScreenState();
}

class _AskQuestionScreenState extends State<AskQuestionScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _tagsController = TextEditingController();

  // Submit the question (send data to backend)
  Future<void> _submitQuestion() async {
    final title = _titleController.text.trim();
    final description = _descController.text.trim();
    final tags = _tagsController.text.trim().split(',');
    final questionUrl = "http://some-url.com"; // Replace with the appropriate value for the question URL
    final user = {
      'name': 'John Doe', // Add user information here (from authentication or local storage)
      'email': 'john@example.com',
    };

    if (title.isEmpty || description.isEmpty || tags.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill in all required fields")),
      );
      return;
    }

    final url = 'http://your-backend-url.com'; // Replace with your backend URL

    // Create the request body
    final body = json.encode({
      'questionName': title,
      'descreption': description,
      'tags': tags,
      'questionUrl': questionUrl,
      'user': user,
    });

    try {
      // Send the POST request
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      );

      // Check the response status
      if (response.statusCode == 201) {
        // Question added successfully
        print("Question added successfully");
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Question added successfully")),
        );
      } else {
        // Print the full response to get more insight into the failure
        print("Failed to add question: ${response.statusCode}");
        print("Response body: ${response.body}");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Failed to add question: ${response.body}")),
        );
      }
    } catch (error) {
      print("Error occurred: $error");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error occurred: $error")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Ask a New Question"),
      ),
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
