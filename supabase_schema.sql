-- ============================================
-- Aptive — Supabase Schema
-- Run this ENTIRE file in Supabase SQL Editor
-- ============================================

-- 1. ENUMS
CREATE TYPE difficulty_level AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE answer_type AS ENUM ('mcq', 'numerical');

-- 2. PROFILES (linked to auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    role user_role DEFAULT 'user',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);

-- 3. CATEGORIES
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- 4. PROBLEMS
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty difficulty_level NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    answer_type answer_type NOT NULL DEFAULT 'mcq',
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    constraints_info TEXT,
    examples JSONB DEFAULT '[]'::jsonb,
    acceptance_rate REAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_problems_category ON problems(category_id);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);

-- 5. SUBMISSIONS
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE NOT NULL,
    answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER,
    submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_submissions_date ON submissions(submitted_at);
CREATE INDEX idx_submissions_user_problem ON submissions(user_id, problem_id);

-- 6. BADGES
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    criteria JSONB
);

-- 7. USER_BADGES
CREATE TABLE user_badges (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, badge_id)
);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP (TRIGGER)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- UPDATE ACCEPTANCE RATE ON SUBMISSION (TRIGGER)
-- ============================================

CREATE OR REPLACE FUNCTION public.update_acceptance_rate()
RETURNS TRIGGER AS $$
DECLARE
    total_count INTEGER;
    correct_count INTEGER;
BEGIN
    SELECT COUNT(*), COUNT(*) FILTER (WHERE is_correct = true)
    INTO total_count, correct_count
    FROM submissions
    WHERE problem_id = NEW.problem_id;

    UPDATE problems
    SET acceptance_rate = ROUND((correct_count::NUMERIC / GREATEST(total_count, 1)) * 100, 1)
    WHERE id = NEW.problem_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_submission_created
    AFTER INSERT ON submissions
    FOR EACH ROW EXECUTE FUNCTION public.update_acceptance_rate();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
    ON categories FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- PROBLEMS
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Problems are viewable by everyone"
    ON problems FOR SELECT USING (true);

CREATE POLICY "Admins can insert problems"
    ON problems FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update problems"
    ON problems FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete problems"
    ON problems FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- SUBMISSIONS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own submissions"
    ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions"
    ON submissions FOR SELECT USING (auth.uid() = user_id);

-- BADGES
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
    ON badges FOR SELECT USING (true);

CREATE POLICY "Admins can manage badges"
    ON badges FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- USER_BADGES
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
    ON user_badges FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert badges"
    ON user_badges FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        OR auth.uid() = user_id
    );

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO categories (name, slug) VALUES
    ('Quantitative Aptitude', 'quant'),
    ('Logical Reasoning', 'logical'),
    ('Data Interpretation', 'di'),
    ('Verbal Ability', 'verbal');

INSERT INTO badges (name, description, icon, criteria) VALUES
    ('First Steps', 'Solve your first problem', '🎯', '{"type":"solved_count","value":1}'),
    ('Problem Solver', 'Solve 10 problems', '⭐', '{"type":"solved_count","value":10}'),
    ('Centurion', 'Solve 100 problems', '💯', '{"type":"solved_count","value":100}'),
    ('Speed Demon', 'Solve in under 30 seconds', '⚡', '{"type":"speed","value":30}'),
    ('Perfectionist', '100% accuracy on 10 problems', '🎖️', '{"type":"accuracy","value":100}'),
    ('Quant Master', 'Solve 25 Quant problems', '🔢', '{"type":"category_count","category":"quant","value":25}'),
    ('Logic Lord', 'Solve 25 Logical problems', '🧠', '{"type":"category_count","category":"logical","value":25}'),
    ('Data Wizard', 'Solve 25 DI problems', '📊', '{"type":"category_count","category":"di","value":25}'),
    ('Word Smith', 'Solve 25 Verbal problems', '📝', '{"type":"category_count","category":"verbal","value":25}'),
    ('Streak Master', '7-day solve streak', '🔥', '{"type":"streak","value":7}');

-- ============================================
-- PROFILE QUERIES (as database functions)
-- ============================================

-- Get user stats
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_solved', (
            SELECT COUNT(DISTINCT problem_id)
            FROM submissions
            WHERE user_id = p_user_id AND is_correct = true
        ),
        'total_attempts', (
            SELECT COUNT(*) FROM submissions WHERE user_id = p_user_id
        ),
        'accuracy', (
            SELECT ROUND(
                COALESCE(
                    COUNT(*) FILTER (WHERE is_correct = true)::NUMERIC /
                    NULLIF(COUNT(*), 0) * 100
                , 0), 1
            )
            FROM submissions WHERE user_id = p_user_id
        ),
        'rank', (
            SELECT COUNT(*) + 1 FROM (
                SELECT user_id, COUNT(DISTINCT problem_id) as solved
                FROM submissions WHERE is_correct = true
                GROUP BY user_id
                HAVING COUNT(DISTINCT problem_id) > (
                    SELECT COUNT(DISTINCT problem_id)
                    FROM submissions
                    WHERE user_id = p_user_id AND is_correct = true
                )
            ) ranked
        ),
        'difficulty_distribution', (
            SELECT COALESCE(json_agg(row_to_json(d)), '[]')
            FROM (
                SELECT p.difficulty, COUNT(DISTINCT s.problem_id) as count
                FROM submissions s JOIN problems p ON s.problem_id = p.id
                WHERE s.user_id = p_user_id AND s.is_correct = true
                GROUP BY p.difficulty
            ) d
        ),
        'category_distribution', (
            SELECT COALESCE(json_agg(row_to_json(c)), '[]')
            FROM (
                SELECT cat.name, cat.slug, COUNT(DISTINCT s.problem_id) as count
                FROM submissions s
                JOIN problems p ON s.problem_id = p.id
                JOIN categories cat ON p.category_id = cat.id
                WHERE s.user_id = p_user_id AND s.is_correct = true
                GROUP BY cat.name, cat.slug
            ) c
        )
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get heatmap data
CREATE OR REPLACE FUNCTION get_heatmap_data(p_user_id UUID)
RETURNS JSON AS $$
BEGIN
    RETURN (
        SELECT COALESCE(json_agg(row_to_json(h)), '[]')
        FROM (
            SELECT
                submitted_at::date as date,
                COUNT(*) as count,
                COUNT(*) FILTER (WHERE is_correct = true) as correct
            FROM submissions
            WHERE user_id = p_user_id
              AND submitted_at > NOW() - INTERVAL '365 days'
            GROUP BY submitted_at::date
            ORDER BY date
        ) h
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
