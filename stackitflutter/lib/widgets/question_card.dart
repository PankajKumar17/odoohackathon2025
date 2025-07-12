import 'package:flutter/material.dart';

class QuestionCard extends StatelessWidget {
  final Map<String, dynamic> question;
  final Function(String, bool) onVote; // Callback to handle vote changes

  const QuestionCard({super.key, required this.question, required this.onVote});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              question['title'],
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: (question['tags'] as List<String>)
                  .map((tag) => Chip(label: Text(tag)))
                  .toList(),
            ),
            const SizedBox(height: 8),
            Text(question['description']),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Asked by: ${question['user']}'),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blueGrey,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text('${question['answers']} answers'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                // Upvote button (like)
                IconButton(
                  icon: const Icon(Icons.thumb_up),
                  color: Colors.green,
                  onPressed: () {
                    onVote(question['id'], true); // Pass id and upvote (true)
                  },
                ),
                // Display upvote count
                Text('${question['upvotes']}'),

                // Downvote button (dislike)
                IconButton(
                  icon: const Icon(Icons.thumb_down),
                  color: Colors.red,
                  onPressed: () {
                    onVote(question['id'], false); // Pass id and downvote (false)
                  },
                ),
                // Display downvote count
                Text('${question['downvotes']}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
