-- FAANG Prep Progress Tracking Schema (File-based Content Discovery)

-- User progress table (simplified - no lesson foreign key since lessons are file-based)
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  lesson_id VARCHAR(200) NOT NULL, -- Lesson ID from file discovery (increased size for base64 IDs)
  completed_at TIMESTAMP,
  time_spent_minutes INTEGER DEFAULT 0,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lesson_id) -- Ensure one progress record per lesson
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

-- No need for phases or lessons table inserts - everything is file-based now
-- Content discovery handles all phase and lesson metadata

-- Initialize user stats
INSERT INTO user_stats (current_streak, longest_streak, total_lessons_completed, total_hours_studied) 
VALUES (0, 0, 0, 0) ON CONFLICT DO NOTHING;
