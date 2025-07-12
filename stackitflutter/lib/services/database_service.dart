class DatabaseService {
  Future<List<String>> getQuestions() async {
    // Call to Express backend to fetch questions
    return ['Question 1', 'Question 2'];
  }
}