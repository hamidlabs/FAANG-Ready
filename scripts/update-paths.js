const { Pool } = require('pg');

async function updatePaths() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    
    const updates = [
      [1, 'Phase 1 - English Communication Foundation/01-technical-english-sentence-builder/main.md'],
      [2, 'Phase 1 - English Communication Foundation/02-interview-conversation-scripts/main.md'],
      [3, 'Phase 1 - English Communication Foundation/03-code-explanation-framework/main.md'],
      [4, 'Phase 1 - English Communication Foundation/04-behavioral-answer-templates/main.md'],
      [5, 'Phase 2 - Problem-Solving Mental Framework/05-universal-problem-solving-method/main.md'],
      [6, 'Phase 2 - Problem-Solving Mental Framework/06-pattern-recognition-visual-guide/main.md'],
      [7, 'Phase 2 - Problem-Solving Mental Framework/07-debugging-and-testing-framework/main.md'],
      [8, 'Phase 3 - Core Data Structures/09-arrays-and-strings-complete-guide/main.md'],
      [9, 'Phase 3 - Core Data Structures/10-linked-lists-from-zero/main.md'],
      [10, 'Phase 3 - Core Data Structures/11-stacks-and-queues-practical/main.md'],
      [11, 'Phase 3 - Core Data Structures/12-trees-and-graphs-fundamentals/main.md'],
      [12, 'Phase 3 - Core Data Structures/13-hash-tables-and-sets-mastery/main.md'],
      [13, 'Phase 4 - Essential Algorithms/14-sorting-algorithms-complete/main.md'],
      [14, 'Phase 4 - Essential Algorithms/15-searching-algorithms-master/main.md'],
      [15, 'Phase 5 - Pattern-Based Problem Solving/18-two-pointers-pattern/main.md'],
      [16, 'Phase 5 - Pattern-Based Problem Solving/19-sliding-window-pattern/main.md'],
      [17, 'Phase 5 - Pattern-Based Problem Solving/20-fast-slow-pointers-pattern/main.md'],
      [18, 'Phase 5 - Pattern-Based Problem Solving/21-merge-intervals-pattern/main.md'],
      [19, 'Phase 5 - Pattern-Based Problem Solving/22-cyclic-sort-pattern/main.md'],
      [20, 'Phase 5 - Pattern-Based Problem Solving/23-tree-dfs-pattern/main.md'],
      [21, 'Phase 5 - Pattern-Based Problem Solving/24-tree-bfs-pattern/main.md'],
      [22, 'Phase 5 - Pattern-Based Problem Solving/25-island-pattern-graphs/main.md'],
      [23, 'Phase 6 - Advanced Patterns/28-dynamic-programming-patterns/main.md'],
      [24, 'Phase 6 - Advanced Patterns/29-greedy-algorithms-pattern/main.md'],
      [25, 'Phase 7 - System Design Mastery/framework-system-design.md'],
      [26, 'Phase 8 - Low-Level Design/37-oop-design-patterns/main.md']
    ];
    
    for (const [id, path] of updates) {
      await client.query('UPDATE lessons SET file_path = $1 WHERE id = $2', [path, id]);
    }
    
    console.log('✅ File paths updated successfully!');
    
    client.release();
  } catch (error) {
    console.error('❌ Error updating paths:', error);
  } finally {
    await pool.end();
  }
}

updatePaths();
