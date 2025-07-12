import 'package:flutter/material.dart';
import '../widgets/question_card.dart';
import 'ask_questions_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Local list to store posted questions
  List<Map<String, dynamic>> sampleQuestions = [
    {
      'id': 'q1',
      'title': 'How to join 2 columns in a dataset using SQL?',
      'description': 'I am a beginner and want to join two columns...',
      'tags': ['SQL', 'Join'],
      'answers': 5,
      'user': 'Alice',
      'upvotes': 0,
      'downvotes': 0,
    },
    {
      'id': 'q2',
      'title': 'How to fix Flutter hot reload issue?',
      'description': 'Hot reload doesn\'t work after adding a new package...',
      'tags': ['Flutter', 'HotReload'],
      'answers': 3,
      'user': 'Bob',
      'upvotes': 0,
      'downvotes': 0,
    },
  ];

  // Function to handle vote changes (upvote or downvote)
  void _handleVote(String questionId, bool isUpvote) {
    setState(() {
      // Find the question by its id
      final question = sampleQuestions.firstWhere((q) => q['id'] == questionId);
      if (isUpvote) {
        question['upvotes'] += 1; // Increment upvotes
      } else {
        question['downvotes'] += 1; // Increment downvotes
      }
    });
  }

  // Function to handle adding a new question
  void _addNewQuestion(Map<String, dynamic> newQuestion) {
    setState(() {
      // Add the new question to the list
      sampleQuestions.add(newQuestion);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('StackIt')),
      body: Column(
        children: [
          // 🔳 Top Button Row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10),
            child: Row(
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    // Navigate to the AskQuestionScreen to post a new question
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => AskQuestionScreen(
                          onQuestionPosted: _addNewQuestion,
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.add),
                  label: const Text("Ask New Question"),
                ),
                const SizedBox(width: 10),

                // 🔽 Sort Dropdown
                PopupMenuButton<String>(
                  onSelected: (value) {
                    // TODO: Handle sort logic
                  },
                  itemBuilder: (context) => [
                    const PopupMenuItem(
                      value: 'Newest',
                      child: Text('Newest'),
                    ),
                    const PopupMenuItem(
                      value: 'Unanswered',
                      child: Text('Unanswered'),
                    ),
                    const PopupMenuItem(
                      value: 'Popular',
                      child: Text('Popular'),
                    ),
                  ],
                  child: Row(
                    children: const [
                      Icon(Icons.sort),
                      SizedBox(width: 5),
                      Text('Sort'),
                    ],
                  ),
                ),
                const Spacer(),

                // 🔍 Search Icon
                IconButton(
                  onPressed: () {
                    // TODO: Implement search
                  },
                  icon: const Icon(Icons.search),
                ),
              ],
            ),
          ),

          // 📋 Question List
          Expanded(
            child: ListView.builder(
              itemCount: sampleQuestions.length,
              itemBuilder: (context, index) {
                return QuestionCard(
                  question: sampleQuestions[index],
                  onVote: _handleVote, // Pass the vote handler
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
