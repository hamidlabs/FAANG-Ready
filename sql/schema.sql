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

-- Notes table for storing user notes on lesson content
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  lesson_id VARCHAR(200) NOT NULL, -- Lesson ID from file discovery
  selected_text TEXT NOT NULL, -- The text that was selected to create the note
  note_content TEXT NOT NULL, -- The actual note content
  position_data JSONB, -- Store position information as JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notes_lesson_id ON notes(lesson_id);

-- Initialize user stats
INSERT INTO user_stats (current_streak, longest_streak, total_lessons_completed, total_hours_studied)
VALUES (0, 0, 0, 0) ON CONFLICT DO NOTHING;
