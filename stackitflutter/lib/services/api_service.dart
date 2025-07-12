// lib/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> submitQuestion(
  String questionName,
  String description,
  List<String> tags,
  String questionUrl,
  Map<String, dynamic> user,
) async {
  final url = 'http://your-backend-url.com'; // Replace with your backend API URL

  // Create the request body
  final body = json.encode({
    'questionName': questionName,
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
    } else {
      // Handle error
      print("Failed to add question: ${response.body}");
    }
  } catch (error) {
    print("Error occurred: $error");
  }
}
