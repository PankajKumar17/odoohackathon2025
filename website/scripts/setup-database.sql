-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (email, username, full_name) VALUES
('john@example.com', 'john_doe', 'John Doe'),
('jane@example.com', 'jane_smith', 'Jane Smith'),
('bob@example.com', 'bob_wilson', 'Bob Wilson')
ON CONFLICT (email) DO NOTHING;

-- Insert sample questions
INSERT INTO questions (title, description, tags, author_id) VALUES
('How to learn React effectively?', 'I am new to React and want to know the best practices and resources to learn it quickly and effectively.', ARRAY['react', 'javascript', 'learning'], (SELECT id FROM users WHERE username = 'john_doe')),
('Best practices for database design?', 'What are the key principles I should follow when designing a relational database schema?', ARRAY['database', 'sql', 'design'], (SELECT id FROM users WHERE username = 'jane_smith')),
('How to optimize website performance?', 'My website is loading slowly. What are the most effective ways to improve performance?', ARRAY['performance', 'web', 'optimization'], (SELECT id FROM users WHERE username = 'bob_wilson'))
ON CONFLICT DO NOTHING;

-- Insert sample answers
INSERT INTO answers (content, question_id, author_id) VALUES
('Start with the official React documentation and build small projects. Practice is key!', (SELECT id FROM questions WHERE title = 'How to learn React effectively?'), (SELECT id FROM users WHERE username = 'jane_smith')),
('Focus on normalization, use appropriate data types, and always think about indexing for performance.', (SELECT id FROM questions WHERE title = 'Best practices for database design?'), (SELECT id FROM users WHERE username = 'john_doe')),
('Optimize images, minify CSS/JS, use CDN, and implement caching strategies.', (SELECT id FROM questions WHERE title = 'How to optimize website performance?'), (SELECT id FROM users WHERE username = 'jane_smith'))
ON CONFLICT DO NOTHING;
