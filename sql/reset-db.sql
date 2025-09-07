-- Reset database for file-based content discovery
-- This will clean up all old lesson data and prepare for new system

-- Drop old tables that are no longer needed
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS phases CASCADE;

-- Clean up user progress table (keep data but ensure structure is correct)
DROP TABLE IF EXISTS user_progress CASCADE;

-- Create the new simplified schema
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

-- Initialize user stats
INSERT INTO user_stats (current_streak, longest_streak, total_lessons_completed, total_hours_studied) 
VALUES (0, 0, 0, 0) ON CONFLICT DO NOTHING;