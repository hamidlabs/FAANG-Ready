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

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  phase_id INTEGER REFERENCES phases(id),
  title VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  estimated_hours INTEGER DEFAULT 2,
  difficulty VARCHAR(20) DEFAULT 'medium',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id),
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

-- Insert lessons
INSERT INTO lessons (phase_id, title, file_path, estimated_hours, difficulty, order_index) VALUES
-- Phase 1
(1, 'Technical English Sentence Builder', 'Phase 1 - English Communication Foundation/01-technical-english-sentence-builder/main.md', 3, 'easy', 1),
(1, 'Interview Conversation Scripts', 'Phase 1 - English Communication Foundation/02-interview-conversation-scripts/main.md', 4, 'medium', 2),
(1, 'Code Explanation Framework', 'Phase 1 - English Communication Foundation/03-code-explanation-framework/main.md', 3, 'medium', 3),
(1, 'Behavioral Answer Templates', 'Phase 1 - English Communication Foundation/04-behavioral-answer-templates/main.md', 4, 'medium', 4),
(1, 'Complete Behavioral Interview Mastery', 'Phase 1 - English Communication Foundation/05-complete-behavioral-interview-mastery/main.md', 5, 'medium', 5),

-- Phase 2
(2, 'Universal Problem-Solving Method', 'Phase 2 - Problem-Solving Mental Framework/05-universal-problem-solving-method/main.md', 4, 'medium', 1),
(2, 'Pattern Recognition Visual Guide', 'Phase 2 - Problem-Solving Mental Framework/06-pattern-recognition-visual-guide/main.md', 3, 'medium', 2),
(2, 'Debugging and Testing Framework', 'Phase 2 - Problem-Solving Mental Framework/07-debugging-and-testing-framework/main.md', 3, 'medium', 3),

-- Phase 3
(3, 'Arrays and Strings Complete Guide', 'Phase 3 - Core Data Structures/09-arrays-and-strings-complete-guide/main.md', 6, 'medium', 1),
(3, 'Linked Lists From Zero', 'Phase 3 - Core Data Structures/10-linked-lists-from-zero/main.md', 5, 'medium', 2),
(3, 'Stacks and Queues Practical', 'Phase 3 - Core Data Structures/11-stacks-and-queues-practical/main.md', 4, 'medium', 3),
(3, 'Trees and Graphs Fundamentals', 'Phase 3 - Core Data Structures/12-trees-and-graphs-fundamentals/main.md', 8, 'hard', 4),
(3, 'Hash Tables and Sets Mastery', 'Phase 3 - Core Data Structures/13-hash-tables-and-sets-mastery/main.md', 5, 'medium', 5),

-- Phase 4
(4, 'Sorting Algorithms Complete', 'Phase 4 - Essential Algorithms/14-sorting-algorithms-complete/main.md', 6, 'medium', 1),
(4, 'Searching Algorithms Master', 'Phase 4 - Essential Algorithms/15-searching-algorithms-master/main.md', 5, 'medium', 2),

-- Phase 5
(5, 'Two Pointers Pattern', 'Phase 5 - Pattern-Based Problem Solving/18-two-pointers-pattern/main.md', 4, 'medium', 1),
(5, 'Sliding Window Pattern', 'Phase 5 - Pattern-Based Problem Solving/19-sliding-window-pattern/main.md', 5, 'medium', 2),
(5, 'Fast Slow Pointers Pattern', 'Phase 5 - Pattern-Based Problem Solving/20-fast-slow-pointers-pattern/main.md', 4, 'medium', 3),
(5, 'Merge Intervals Pattern', 'Phase 5 - Pattern-Based Problem Solving/21-merge-intervals-pattern/main.md', 4, 'medium', 4),
(5, 'Cyclic Sort Pattern', 'Phase 5 - Pattern-Based Problem Solving/22-cyclic-sort-pattern/main.md', 3, 'medium', 5),
(5, 'Tree DFS Pattern', 'Phase 5 - Pattern-Based Problem Solving/23-tree-dfs-pattern/main.md', 5, 'hard', 6),
(5, 'Tree BFS Pattern', 'Phase 5 - Pattern-Based Problem Solving/24-tree-bfs-pattern/main.md', 4, 'medium', 7),
(5, 'Island Pattern Graphs', 'Phase 5 - Pattern-Based Problem Solving/25-island-pattern-graphs/main.md', 5, 'hard', 8),

-- Phase 6
(6, 'Dynamic Programming Patterns', 'Phase 6 - Advanced Patterns/28-dynamic-programming-patterns/main.md', 10, 'hard', 1),
(6, 'Greedy Algorithms Pattern', 'Phase 6 - Advanced Patterns/29-greedy-algorithms-pattern/main.md', 6, 'hard', 2),

-- Phase 7
(7, 'System Design Framework', 'Phase 7 - System Design Mastery/framework-system-design.md', 12, 'hard', 1),

-- Phase 8
(8, 'OOP Design Patterns', 'Phase 8 - Low-Level Design/37-oop-design-patterns/main.md', 8, 'hard', 1);

-- Initialize user stats
INSERT INTO user_stats (current_streak, longest_streak, total_lessons_completed, total_hours_studied) 
VALUES (0, 0, 0, 0) ON CONFLICT DO NOTHING;
