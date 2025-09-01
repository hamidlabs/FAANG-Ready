# Trees and Graphs Fundamentals

## Purpose

Trees and graphs are the backbone of 40% of FAANG interview questions. As someone who builds web applications, think of them as the data structures behind file systems, DOM trees, social networks, and database relationships.

**Key Insight**: Trees and graphs aren't abstract concepts - they're everywhere in real systems. Master these, and complex problems become simple.

---

## What Are Trees and Graphs (From Zero)

### Trees - Hierarchical Data

**What is a tree?**
A tree is a hierarchical data structure with nodes connected by edges, where each node has at most one parent.

```javascript
// Visual representation of a binary tree
//       1          <- Root (no parent)
//      / \
//     2   3        <- Level 1 (children of root)
//    / \   \
//   4   5   6      <- Level 2 (leaves - no children)

// In code representation:
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;   // Left child
        this.right = null;  // Right child
    }
}

// Building the tree above
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.right = new TreeNode(6);
```

**Tree Terminology** (Like a family tree):
- **Root**: The top node (like the oldest ancestor)
- **Parent**: Node that has children
- **Child**: Node that has a parent
- **Leaf**: Node with no children (end of a branch)
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to specific node

**Why Trees Matter**:
- **File Systems**: Folders contain files and other folders
- **DOM**: HTML elements contain other elements
- **Organization Charts**: Boss → Manager → Employee hierarchy
- **Decision Making**: If-else logic flows

### Binary Trees - The Most Important Type

**What is a binary tree?**
A tree where each node has at most 2 children (left and right).

```javascript
// Binary Tree Properties
//       5
//      / \
//     3   8        <- Each node has ≤ 2 children
//    / \   \
//   1   4   9

const binaryTree = {
    val: 5,
    left: {
        val: 3,
        left: { val: 1, left: null, right: null },
        right: { val: 4, left: null, right: null }
    },
    right: {
        val: 8,
        left: null,
        right: { val: 9, left: null, right: null }
    }
};
```

**Binary Search Tree (BST) - Special Binary Tree**:
```javascript
// BST Property: Left < Root < Right for every node
//       5
//      / \
//     3   8        <- 3 < 5 < 8 ✓
//    / \   \
//   1   4   9      <- 1 < 3 < 4 ✓ and 8 < 9 ✓

// This allows for O(log n) search, insert, delete
function searchBST(root, target) {
    if (!root) return null;
    
    if (root.val === target) return root;
    
    // Go left if target is smaller
    if (target < root.val) {
        return searchBST(root.left, target);
    }
    
    // Go right if target is larger
    return searchBST(root.right, target);
}
```

### Graphs - Connected Networks

**What is a graph?**
A collection of nodes (vertices) connected by edges. Think social networks: people (nodes) connected by friendships (edges).

```javascript
// Visual representation
// A --- B
// |     |
// C --- D

// Different ways to represent this graph:

// 1. Adjacency List (most common in interviews)
const graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'], 
    'C': ['A', 'D'],
    'D': ['B', 'C']
};

// 2. Adjacency Matrix
const matrix = [
    [0, 1, 1, 0],  // A connects to B, C
    [1, 0, 0, 1],  // B connects to A, D
    [1, 0, 0, 1],  // C connects to A, D
    [0, 1, 1, 0]   // D connects to B, C
];

// 3. Edge List
const edges = [
    ['A', 'B'], ['A', 'C'], 
    ['B', 'D'], ['C', 'D']
];
```

**Graph Types**:
- **Directed**: Edges have direction (Twitter follows)
- **Undirected**: Edges work both ways (Facebook friendships)
- **Weighted**: Edges have values (flight costs)
- **Unweighted**: All edges equal (social connections)

---

## Tree Traversal Methods

### 1. Depth-First Search (DFS) - Go Deep First

**Three DFS Types** (Remember: **Pre**-**In**-**Post** refers to when you **process the root**):

**Preorder: Root → Left → Right**
```javascript
//       1
//      / \
//     2   3
//    / \
//   4   5
// Visit order: 1, 2, 4, 5, 3

function preorderTraversal(root) {
    const result = [];
    
    function traverse(node) {
        if (!node) return;
        
        result.push(node.val);    // Process root first
        traverse(node.left);      // Then left subtree
        traverse(node.right);     // Then right subtree
    }
    
    traverse(root);
    return result; // [1, 2, 4, 5, 3]
}

// When to use: Create copy of tree, expression trees
```

**Inorder: Left → Root → Right**
```javascript
//       1
//      / \
//     2   3
//    / \
//   4   5
// Visit order: 4, 2, 5, 1, 3

function inorderTraversal(root) {
    const result = [];
    
    function traverse(node) {
        if (!node) return;
        
        traverse(node.left);      // Left subtree first
        result.push(node.val);    // Process root in middle
        traverse(node.right);     // Right subtree last
    }
    
    traverse(root);
    return result; // [4, 2, 5, 1, 3]
}

// When to use: BST → gives sorted order!
```

**Postorder: Left → Right → Root**
```javascript
//       1
//      / \
//     2   3
//    / \
//   4   5
// Visit order: 4, 5, 2, 3, 1

function postorderTraversal(root) {
    const result = [];
    
    function traverse(node) {
        if (!node) return;
        
        traverse(node.left);      // Left subtree first
        traverse(node.right);     // Right subtree second
        result.push(node.val);    // Process root last
    }
    
    traverse(root);
    return result; // [4, 5, 2, 3, 1]
}

// When to use: Delete tree, calculate size/height
```

### 2. Breadth-First Search (BFS) - Go Wide First

**Level Order Traversal**:
```javascript
//       1        <- Level 0
//      / \
//     2   3      <- Level 1
//    / \
//   4   5       <- Level 2
// Visit order: 1, 2, 3, 4, 5 (level by level)

function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];  // Use queue for BFS
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        // Process all nodes in current level
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            // Add children for next level
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result; // [[1], [2, 3], [4, 5]]
}

// When to use: Find shortest path, level-based processing
```

---

## Graph Traversal Methods

### 1. DFS for Graphs

```javascript
function dfsGraph(graph, start) {
    const visited = new Set();
    const result = [];
    
    function dfs(node) {
        if (visited.has(node)) return;
        
        visited.add(node);
        result.push(node);
        
        // Visit all neighbors
        for (let neighbor of graph[node]) {
            dfs(neighbor);
        }
    }
    
    dfs(start);
    return result;
}

// Example usage:
const graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
};

console.log(dfsGraph(graph, 'A')); // ['A', 'B', 'D', 'C']
```

### 2. BFS for Graphs

```javascript
function bfsGraph(graph, start) {
    const visited = new Set();
    const result = [];
    const queue = [start];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        // Add all unvisited neighbors
        for (let neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}

console.log(bfsGraph(graph, 'A')); // ['A', 'B', 'C', 'D']
```

---

## Real FAANG Interview Problems

### Problem 1: Binary Tree Maximum Depth

**Google/Meta**: "Find the maximum depth of a binary tree."

**Complete Solution**:
```javascript
function maxDepth(root) {
    // Base case: empty tree has depth 0
    if (!root) return 0;
    
    // Recursive case: 1 + max depth of subtrees
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    
    return 1 + Math.max(leftDepth, rightDepth);
}

// Alternative iterative solution using BFS
function maxDepthIterative(root) {
    if (!root) return 0;
    
    const queue = [root];
    let depth = 0;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        depth++;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return depth;
}

// Test case:
//       1
//      / \
//     2   3
//    /
//   4
// Expected depth: 3

// Time: O(n) - visit each node once
// Space: O(h) where h is height (recursion stack)
```

### Problem 2: Binary Tree Inorder Traversal

**Google**: "Return inorder traversal of binary tree."

**Complete Solutions**:
```javascript
// Recursive solution (easier to understand)
function inorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);      // Left
        result.push(node.val);   // Root  
        inorder(node.right);     // Right
    }
    
    inorder(root);
    return result;
}

// Iterative solution (more complex but O(1) recursion space)
function inorderIterative(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
        // Go to leftmost node
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // Process current node
        current = stack.pop();
        result.push(current.val);
        
        // Move to right subtree
        current = current.right;
    }
    
    return result;
}

// Time: O(n), Space: O(h) where h is tree height
```

### Problem 3: Validate Binary Search Tree

**Amazon/Meta**: "Check if binary tree is valid BST."

**Complete Solution with Common Pitfalls**:
```javascript
// Wrong approach (only checks immediate children)
function isValidBSTWrong(root) {
    if (!root) return true;
    
    // ❌ This only checks immediate children, not the BST property globally
    if (root.left && root.left.val >= root.val) return false;
    if (root.right && root.right.val <= root.val) return false;
    
    return isValidBSTWrong(root.left) && isValidBSTWrong(root.right);
}

// Correct approach (maintains min/max bounds)
function isValidBST(root) {
    function validate(node, min, max) {
        if (!node) return true;
        
        // Check if current node violates BST property
        if (node.val <= min || node.val >= max) {
            return false;
        }
        
        // Left subtree: all values must be < node.val
        // Right subtree: all values must be > node.val
        return validate(node.left, min, node.val) && 
               validate(node.right, node.val, max);
    }
    
    return validate(root, -Infinity, Infinity);
}

// Alternative: Inorder traversal should give sorted array
function isValidBSTInorder(root) {
    const inorder = [];
    
    function traverse(node) {
        if (!node) return;
        traverse(node.left);
        inorder.push(node.val);
        traverse(node.right);
    }
    
    traverse(root);
    
    // Check if array is sorted and has no duplicates
    for (let i = 1; i < inorder.length; i++) {
        if (inorder[i] <= inorder[i - 1]) {
            return false;
        }
    }
    
    return true;
}

// Time: O(n), Space: O(h) for recursion stack
```

### Problem 4: Number of Islands

**Amazon/Google**: "Count connected components in 2D grid."

**Complete Solution**:
```javascript
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;
    
    function dfs(row, col) {
        // Boundary check and water check
        if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] === '0') {
            return;
        }
        
        // Mark current cell as visited by turning it to water
        grid[row][col] = '0';
        
        // Explore all 4 directions
        dfs(row - 1, col); // Up
        dfs(row + 1, col); // Down
        dfs(row, col - 1); // Left
        dfs(row, col + 1); // Right
    }
    
    // Scan the grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === '1') {
                islandCount++;
                dfs(row, col); // Sink the entire island
            }
        }
    }
    
    return islandCount;
}

// Alternative BFS solution
function numIslandsBFS(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;
    
    function bfs(startRow, startCol) {
        const queue = [[startRow, startCol]];
        grid[startRow][startCol] = '0';
        
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            
            for (let [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    grid[newRow][newCol] === '1') {
                    
                    grid[newRow][newCol] = '0';
                    queue.push([newRow, newCol]);
                }
            }
        }
    }
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === '1') {
                islandCount++;
                bfs(row, col);
            }
        }
    }
    
    return islandCount;
}

// Time: O(m × n), Space: O(m × n) in worst case for recursion/queue
```

### Problem 5: Binary Tree Level Order Traversal

**Meta/Apple**: "Return level order traversal as list of lists."

**Complete Solution**:
```javascript
function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        // Process all nodes in current level
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            // Add children for next level
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

// Variant: Right side view (last node in each level)
function rightSideView(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            // If it's the last node in level, add to result
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return result;
}

// Time: O(n), Space: O(w) where w is maximum width of tree
```

---

## Common Tree/Graph Patterns

### Pattern 1: Tree DFS (Recursive)

```javascript
// Template for tree DFS problems
function treeDFS(root) {
    function dfs(node) {
        // Base case
        if (!node) return baseValue;
        
        // Recursive case
        const leftResult = dfs(node.left);
        const rightResult = dfs(node.right);
        
        // Combine results
        return combineLogic(node.val, leftResult, rightResult);
    }
    
    return dfs(root);
}

// Examples:
// - Max depth: return 1 + Math.max(left, right)
// - Sum of all nodes: return node.val + left + right
// - Check if valid BST: validate bounds
```

### Pattern 2: Tree BFS (Level Processing)

```javascript
// Template for level-by-level processing
function treeBFS(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            // Process current node
            currentLevel.push(node.val);
            
            // Add children
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}
```

### Pattern 3: Graph DFS (Connected Components)

```javascript
// Template for finding connected components
function graphDFS(graph) {
    const visited = new Set();
    const components = [];
    
    function dfs(node, component) {
        if (visited.has(node)) return;
        
        visited.add(node);
        component.push(node);
        
        for (let neighbor of graph[node]) {
            dfs(neighbor, component);
        }
    }
    
    // Check all nodes
    for (let node in graph) {
        if (!visited.has(node)) {
            const component = [];
            dfs(node, component);
            components.push(component);
        }
    }
    
    return components;
}
```

---

## Practice Problems by Difficulty

### Easy Tree Problems (Start Here)
1. **Maximum Depth of Binary Tree** (LeetCode 104) - Basic DFS
2. **Same Tree** (LeetCode 100) - Tree comparison  
3. **Invert Binary Tree** (LeetCode 226) - Tree manipulation
4. **Path Sum** (LeetCode 112) - Root to leaf paths
5. **Binary Tree Inorder Traversal** (LeetCode 94) - Traversal basics

### Medium Tree Problems
1. **Validate Binary Search Tree** (LeetCode 98) - BST properties
2. **Binary Tree Level Order Traversal** (LeetCode 102) - BFS
3. **Construct Binary Tree from Preorder and Inorder** (LeetCode 105) - Tree building
4. **Binary Tree Right Side View** (LeetCode 199) - Level processing
5. **Kth Smallest Element in BST** (LeetCode 230) - BST traversal

### Easy Graph Problems
1. **Number of Islands** (LeetCode 200) - 2D DFS/BFS
2. **Max Area of Island** (LeetCode 695) - Connected components
3. **Clone Graph** (LeetCode 133) - Graph traversal and copying

### Medium Graph Problems
1. **Course Schedule** (LeetCode 207) - Cycle detection
2. **Pacific Atlantic Water Flow** (LeetCode 417) - Multi-source BFS/DFS
3. **Word Ladder** (LeetCode 127) - Shortest path BFS

---

## Common Mistakes and Solutions

### Tree Mistakes

**Mistake 1: Forgetting Base Cases**
```javascript
// Wrong: No null check
function maxDepth(root) {
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)); // ❌
}

// Correct: Handle null nodes
function maxDepth(root) {
    if (!root) return 0; // ✅ Base case
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

**Mistake 2: Modifying Tree During Traversal**
```javascript
// Wrong: Deleting while traversing
function deleteNodes(root) {
    if (root.val === target) {
        root = null; // ❌ Doesn't actually delete
    }
}

// Correct: Return new tree structure
function deleteNodes(root) {
    if (!root) return null;
    if (root.val === target) return null; // ✅ Actually removes node
    
    root.left = deleteNodes(root.left);
    root.right = deleteNodes(root.right);
    return root;
}
```

### Graph Mistakes

**Mistake 1: Forgetting Visited Set**
```javascript
// Wrong: Infinite loop in cycles
function dfs(node) {
    result.push(node);
    for (let neighbor of graph[node]) {
        dfs(neighbor); // ❌ Will loop forever in cycles
    }
}

// Correct: Track visited nodes
function dfs(node, visited) {
    if (visited.has(node)) return; // ✅ Prevent cycles
    
    visited.add(node);
    result.push(node);
    for (let neighbor of graph[node]) {
        dfs(neighbor, visited);
    }
}
```

---

## Success Metrics

### Week 1: Tree Fundamentals
- [ ] Understand tree structure and terminology
- [ ] Implement all three DFS traversals from memory
- [ ] Solve 5+ easy tree problems
- [ ] Comfortable with recursive thinking

### Week 2: Tree Problem Solving
- [ ] Master BFS/level-order traversal
- [ ] Understand BST properties and validation
- [ ] Can solve tree problems without looking up syntax
- [ ] Solve 10+ easy-medium tree problems

### Week 3: Graph Fundamentals  
- [ ] Understand graph representations (adjacency list/matrix)
- [ ] Implement DFS and BFS for graphs
- [ ] Solve connected components problems
- [ ] Understand difference between tree and graph traversal

### Week 4: Advanced Tree/Graph Problems
- [ ] Comfortable with both recursive and iterative solutions
- [ ] Can handle complex tree construction/manipulation
- [ ] Solve shortest path and cycle detection problems
- [ ] Ready for FAANG tree/graph interview questions

**Remember**: Trees and graphs are about relationships and connections. Think about the problem structure before jumping into code!