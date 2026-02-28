-- AptiDude Database Schema

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL
);

-- Problems table
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(10) CHECK (difficulty IN ('Easy','Medium','Hard')),
  category_id INTEGER REFERENCES categories(id),
  answer_type VARCHAR(10) CHECK (answer_type IN ('mcq','numerical')),
  options JSONB,
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  constraints_info TEXT,
  examples JSONB,
  acceptance_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  answer VARCHAR(255) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Badges table
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  criteria JSONB
);

-- User badges junction
CREATE TABLE user_badges (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Indexes
CREATE INDEX idx_problems_category ON problems(category_id);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_submissions_date ON submissions(submitted_at);

-- Seed categories
INSERT INTO categories (name, slug) VALUES
  ('Quantitative Aptitude', 'quant'),
  ('Logical Reasoning', 'logical'),
  ('Data Interpretation', 'di'),
  ('Verbal Ability', 'verbal');

-- Seed badges
INSERT INTO badges (name, description, icon, criteria) VALUES
  ('First Steps', 'Solve your first problem', '🎯', '{"type": "solved_count", "value": 1}'),
  ('Problem Solver', 'Solve 10 problems', '⭐', '{"type": "solved_count", "value": 10}'),
  ('Centurion', 'Solve 100 problems', '💯', '{"type": "solved_count", "value": 100}'),
  ('Speed Demon', 'Solve a problem in under 30 seconds', '⚡', '{"type": "speed", "value": 30}'),
  ('Perfectionist', 'Achieve 100% accuracy on 10 problems', '🎖️', '{"type": "accuracy", "value": 100}'),
  ('Quant Master', 'Solve 25 Quant problems', '🔢', '{"type": "category_count", "category": "quant", "value": 25}'),
  ('Logic Lord', 'Solve 25 Logical Reasoning problems', '🧠', '{"type": "category_count", "category": "logical", "value": 25}'),
  ('Data Wizard', 'Solve 25 DI problems', '📊', '{"type": "category_count", "category": "di", "value": 25}'),
  ('Word Smith', 'Solve 25 Verbal problems', '📝', '{"type": "category_count", "category": "verbal", "value": 25}'),
  ('Streak Master', 'Solve problems 7 days in a row', '🔥', '{"type": "streak", "value": 7}');
