const db = require('./db');

function initializeDatabase() {
    console.log('🔧 Initializing database tables...');

    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT CHECK (difficulty IN ('Easy','Medium','Hard')),
      category_id INTEGER REFERENCES categories(id),
      answer_type TEXT CHECK (answer_type IN ('mcq','numerical')),
      options TEXT,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      constraints_info TEXT,
      examples TEXT,
      acceptance_rate REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
      answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      time_taken INTEGER,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      criteria TEXT
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, badge_id)
    );

    CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category_id);
    CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
    CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_problem ON submissions(problem_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_date ON submissions(submitted_at);
  `);

    // Seed categories if empty
    const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
    if (categoryCount.count === 0) {
        const insertCat = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
        insertCat.run('Quantitative Aptitude', 'quant');
        insertCat.run('Logical Reasoning', 'logical');
        insertCat.run('Data Interpretation', 'di');
        insertCat.run('Verbal Ability', 'verbal');
        console.log('✅ Seeded 4 categories');
    }

    // Seed badges if empty
    const badgeCount = db.prepare('SELECT COUNT(*) as count FROM badges').get();
    if (badgeCount.count === 0) {
        const insertBadge = db.prepare('INSERT INTO badges (name, description, icon, criteria) VALUES (?, ?, ?, ?)');
        const badges = [
            ['First Steps', 'Solve your first problem', '🎯', '{"type":"solved_count","value":1}'],
            ['Problem Solver', 'Solve 10 problems', '⭐', '{"type":"solved_count","value":10}'],
            ['Centurion', 'Solve 100 problems', '💯', '{"type":"solved_count","value":100}'],
            ['Speed Demon', 'Solve a problem in under 30 seconds', '⚡', '{"type":"speed","value":30}'],
            ['Perfectionist', 'Achieve 100% accuracy on 10 problems', '🎖️', '{"type":"accuracy","value":100}'],
            ['Quant Master', 'Solve 25 Quant problems', '🔢', '{"type":"category_count","category":"quant","value":25}'],
            ['Logic Lord', 'Solve 25 Logical Reasoning problems', '🧠', '{"type":"category_count","category":"logical","value":25}'],
            ['Data Wizard', 'Solve 25 DI problems', '📊', '{"type":"category_count","category":"di","value":25}'],
            ['Word Smith', 'Solve 25 Verbal problems', '📝', '{"type":"category_count","category":"verbal","value":25}'],
            ['Streak Master', 'Solve problems 7 days in a row', '🔥', '{"type":"streak","value":7}'],
        ];
        for (const b of badges) {
            insertBadge.run(...b);
        }
        console.log('✅ Seeded 10 badges');
    }

    console.log('✅ Database initialized successfully');
}

module.exports = initializeDatabase;
