-- Create database schema for FAANG Interview Prep platform

-- Users table (for future user authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phases table
CREATE TABLE IF NOT EXISTS phases (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    phase_id VARCHAR(50) REFERENCES phases(id),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    topic_id VARCHAR(50) REFERENCES topics(id),
    completed BOOLEAN DEFAULT FALSE,
    starred BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    starred_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, topic_id)
);

-- Insert phases data
INSERT INTO phases (id, title, description, order_index) VALUES
('phase1', 'English Communication Foundation', 'Master technical communication and interview skills', 1),
('phase2', 'Problem-Solving Mental Framework', 'Build systematic approach to algorithmic thinking', 2),
('phase3', 'Core Data Structures', 'Master fundamental data structures', 3),
('phase4', 'Essential Algorithms', 'Core sorting and searching algorithms', 4),
('phase5', 'Pattern-Based Problem Solving', 'Master the most important coding patterns', 5),
('phase6', 'Advanced Patterns', 'Dynamic programming and advanced techniques', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert topics data
INSERT INTO topics (id, title, filename, phase_id, order_index) VALUES
-- Phase 1: English Communication Foundation
('01-technical-english', 'Technical English Sentence Builder', '01-technical-english-sentence-builder.md', 'phase1', 1),
('02-interview-conversations', 'Interview Conversation Scripts', '02-interview-conversation-scripts.md', 'phase1', 2),
('03-code-explanation', 'Code Explanation Framework', '03-code-explanation-framework.md', 'phase1', 3),
('04-behavioral-answers', 'Behavioral Answer Templates', '04-behavioral-answer-templates.md', 'phase1', 4),
('07-debugging-testing', 'Debugging and Testing Framework', '07-debugging-and-testing-framework.md', 'phase1', 5),

-- Phase 2: Problem-Solving Mental Framework
('05-problem-solving', 'Universal Problem-Solving Method', '05-universal-problem-solving-method.md', 'phase2', 1),
('06-pattern-recognition', 'Pattern Recognition Visual Guide', '06-pattern-recognition-visual-guide.md', 'phase2', 2),

-- Phase 3: Core Data Structures
('09-arrays-strings', 'Arrays and Strings Complete Guide', '09-arrays-and-strings-complete-guide.md', 'phase3', 1),
('10-linked-lists', 'Linked Lists from Zero', '10-linked-lists-from-zero.md', 'phase3', 2),
('11-stacks-queues', 'Stacks and Queues Practical', '11-stacks-and-queues-practical.md', 'phase3', 3),
('12-trees-graphs', 'Trees and Graphs Fundamentals', '12-trees-and-graphs-fundamentals.md', 'phase3', 4),
('13-hash-tables', 'Hash Tables and Sets Mastery', '13-hash-tables-and-sets-mastery.md', 'phase3', 5),

-- Phase 4: Essential Algorithms
('14-sorting-algorithms', 'Sorting Algorithms Complete', '14-sorting-algorithms-complete.md', 'phase4', 1),
('15-searching-algorithms', 'Searching Algorithms Master', '15-searching-algorithms-master.md', 'phase4', 2),

-- Phase 5: Pattern-Based Problem Solving
('18-two-pointers', 'Two Pointers Pattern', '18-two-pointers-pattern.md', 'phase5', 1),
('19-sliding-window', 'Sliding Window Pattern', '19-sliding-window-pattern.md', 'phase5', 2),
('20-fast-slow-pointers', 'Fast-Slow Pointers Pattern', '20-fast-slow-pointers-pattern.md', 'phase5', 3),
('21-merge-intervals', 'Merge Intervals Pattern', '21-merge-intervals-pattern.md', 'phase5', 4),
('22-cyclic-sort', 'Cyclic Sort Pattern', '22-cyclic-sort-pattern.md', 'phase5', 5),

-- Phase 6: Advanced Patterns
('28-dynamic-programming', 'Dynamic Programming Patterns', '28-dynamic-programming-patterns.md', 'phase6', 1),
('29-greedy-algorithms', 'Greedy Algorithms Pattern', '29-greedy-algorithms-pattern.md', 'phase6', 2)

ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topics_phase_id ON topics(phase_id);
CREATE INDEX IF NOT EXISTS idx_topics_order_index ON topics(order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);
CREATE INDEX IF NOT EXISTS idx_user_progress_starred ON user_progress(starred);