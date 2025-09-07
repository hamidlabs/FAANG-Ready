-- FAANG Prep Progress Tracking Schema

-- Phases table
CREATE TABLE IF NOT EXISTS phases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  week_start INTEGER NOT NULL,
  week_end INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table (simplified - content discovery is now file-based)
CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(50) PRIMARY KEY, -- Using lesson ID from file discovery
  phase_id INTEGER REFERENCES phases(id),
  title VARCHAR(255) NOT NULL,
  estimated_hours INTEGER DEFAULT 2,
  difficulty VARCHAR(20) DEFAULT 'medium',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  lesson_id VARCHAR(50) REFERENCES lessons(id),
  completed_at TIMESTAMP,
  time_spent_minutes INTEGER DEFAULT 0,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Streaks and achievements
CREATE TABLE IF NOT EXISTS user_stats (
  id SERIAL PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_lessons_completed INTEGER DEFAULT 0,
  total_hours_studied INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert phases
INSERT INTO phases (name, description, week_start, week_end) VALUES
('English Communication Foundation', 'Master technical English for FAANG interviews', 1, 4),
('Problem-Solving Mental Framework', 'Develop systematic problem-solving approach', 5, 8),
('Core Data Structures', 'Master fundamental data structures', 9, 16),
('Essential Algorithms', 'Learn key algorithms for interviews', 17, 24),
('Pattern-Based Problem Solving', 'Master coding patterns', 25, 36),
('Advanced Patterns', 'Advanced algorithmic techniques', 37, 44),
('System Design Mastery', 'High-level system design skills', 45, 52),
('Low-Level Design', 'Object-oriented design patterns', 53, 56);

-- Lessons are now discovered automatically from the content directory
-- No need to insert lesson data - content discovery handles this

-- Initialize user stats
INSERT INTO user_stats (current_streak, longest_streak, total_lessons_completed, total_hours_studied) 
VALUES (0, 0, 0, 0) ON CONFLICT DO NOTHING;
