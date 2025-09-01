# Island Pattern in Graphs - Master Guide

## From Zero to FAANG Ready

### What is the Island Pattern and Why It's Your Secret Weapon?

Imagine you're looking at a world map from space. You see land (1s) and water (0s). An "island" is a group of connected land pieces. The Island Pattern is a **game-changing** technique for solving connected component problems in 2D grids.

This pattern appears in **60% of graph problems** at FAANG companies, especially Google, Amazon, and Facebook. Master this, and you'll dominate grid-based interview questions!

### Core Concept: Connected Components in 2D Grid

```
Grid Example:
[
  [1,1,1,1,0],
  [1,1,0,1,0],
  [1,1,0,0,0],
  [0,0,0,0,0]
]

Islands (connected 1s):
Island 1: positions (0,0), (0,1), (0,2), (0,3), (1,0), (1,1), (1,3), (2,0), (2,1)
Total islands: 1

Each island = group of connected land cells (horizontally/vertically adjacent)
```

## The Universal Island Pattern Template

```javascript
// THE TEMPLATE THAT SOLVES 90% OF ISLAND PROBLEMS
function islandPattern(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;
    
    // Visit every cell in the grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // When we find an unvisited land cell, start DFS
            if (grid[i][j] === '1') {
                count++;
                dfs(grid, i, j); // Mark entire island as visited
            }
        }
    }
    
    return count;
}

function dfs(grid, row, col) {
    // Boundary checks and visited check
    if (row < 0 || row >= grid.length || 
        col < 0 || col >= grid[0].length || 
        grid[row][col] === '0') {
        return;
    }
    
    // Mark current cell as visited
    grid[row][col] = '0';
    
    // Explore all 4 directions (up, down, left, right)
    dfs(grid, row - 1, col); // up
    dfs(grid, row + 1, col); // down
    dfs(grid, row, col - 1); // left
    dfs(grid, row, col + 1); // right
}
```

## Real FAANG Problems with Complete Solutions

### Problem 1: Number of Islands (Amazon, Google, Facebook)

**Question:** Given a 2D binary grid of '1's (land) and '0's (water), count the number of islands.

**Input:**
```
grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
```
**Expected Output:** 1

**My Professional Solution:**

```javascript
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                islandCount++;
                // DFS to mark entire island as visited
                markIslandAsVisited(grid, i, j);
            }
        }
    }
    
    return islandCount;
}

function markIslandAsVisited(grid, row, col) {
    // Base cases: out of bounds or water/visited
    if (row < 0 || row >= grid.length || 
        col < 0 || col >= grid[0].length || 
        grid[row][col] === '0') {
        return;
    }
    
    // Mark as visited by converting to '0'
    grid[row][col] = '0';
    
    // Recursively visit all 4 connected directions
    markIslandAsVisited(grid, row - 1, col); // North
    markIslandAsVisited(grid, row + 1, col); // South
    markIslandAsVisited(grid, row, col - 1); // West
    markIslandAsVisited(grid, row, col + 1); // East
}

// Time Complexity: O(M × N) where M = rows, N = cols
// Space Complexity: O(M × N) for recursive call stack in worst case
```

### Problem 2: Max Area of Island (Facebook, Amazon)

**Question:** Find the maximum area of an island in the grid. Area = number of connected '1' cells.

**Input:**
```
grid = [
  [1,1,0,0,0],
  [1,1,0,0,0],
  [0,0,0,1,1],
  [0,0,0,1,1]
]
```
**Expected Output:** 4

**My Step-by-Step Solution:**

```javascript
function maxAreaOfIsland(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let maxArea = 0;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                // Calculate area of current island
                let currentArea = calculateIslandArea(grid, i, j);
                maxArea = Math.max(maxArea, currentArea);
            }
        }
    }
    
    return maxArea;
}

function calculateIslandArea(grid, row, col) {
    // Base case: out of bounds or water
    if (row < 0 || row >= grid.length || 
        col < 0 || col >= grid[0].length || 
        grid[row][col] === 0) {
        return 0;
    }
    
    // Mark as visited
    grid[row][col] = 0;
    
    // Calculate area: current cell (1) + area of all connected cells
    return 1 + 
           calculateIslandArea(grid, row - 1, col) +
           calculateIslandArea(grid, row + 1, col) +
           calculateIslandArea(grid, row, col - 1) +
           calculateIslandArea(grid, row, col + 1);
}

// Interview insight: We're accumulating area by adding 1 for current cell
// plus the areas returned from all 4 directions
```

### Problem 3: Surrounded Regions (Google, Microsoft)

**Question:** Capture all regions surrounded by 'X'. A region is captured by flipping all 'O's into 'X's.

**Input:**
```
board = [
  ["X","X","X","X"],
  ["X","O","O","X"],
  ["X","X","O","X"],
  ["X","O","X","X"]
]
```
**Expected Output:**
```
[
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","O","X","X"]
]
```

**My Advanced Solution:**

```javascript
function solve(board) {
    if (!board || board.length === 0) return;
    
    const rows = board.length;
    const cols = board[0].length;
    
    // Step 1: Mark all 'O's connected to border as safe
    // Check first and last rows
    for (let j = 0; j < cols; j++) {
        if (board[0][j] === 'O') markSafe(board, 0, j);
        if (board[rows-1][j] === 'O') markSafe(board, rows-1, j);
    }
    
    // Check first and last columns
    for (let i = 0; i < rows; i++) {
        if (board[i][0] === 'O') markSafe(board, i, 0);
        if (board[i][cols-1] === 'O') markSafe(board, i, cols-1);
    }
    
    // Step 2: Convert remaining 'O's to 'X' and safe 'S's back to 'O'
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 'O') {
                board[i][j] = 'X'; // Surrounded, capture it
            } else if (board[i][j] === 'S') {
                board[i][j] = 'O'; // Safe, restore it
            }
        }
    }
}

function markSafe(board, row, col) {
    if (row < 0 || row >= board.length || 
        col < 0 || col >= board[0].length || 
        board[row][col] !== 'O') {
        return;
    }
    
    // Mark as safe using 'S'
    board[row][col] = 'S';
    
    // Mark all connected 'O's as safe
    markSafe(board, row - 1, col);
    markSafe(board, row + 1, col);
    markSafe(board, row, col - 1);
    markSafe(board, row, col + 1);
}

// Strategy: Instead of finding surrounded regions directly,
// we find regions that CAN'T be surrounded (connected to border)
```

### Problem 4: Number of Distinct Islands (Facebook, Google)

**Question:** Count islands that have different shapes. Same shape islands should be counted as one.

**My Expert Solution:**

```javascript
function numDistinctIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    const uniqueShapes = new Set();
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                let path = [];
                dfsWithPath(grid, i, j, i, j, path, 'start');
                uniqueShapes.add(path.join(''));
            }
        }
    }
    
    return uniqueShapes.size;
}

function dfsWithPath(grid, row, col, startRow, startCol, path, direction) {
    if (row < 0 || row >= grid.length || 
        col < 0 || col >= grid[0].length || 
        grid[row][col] === 0) {
        return;
    }
    
    grid[row][col] = 0; // Mark visited
    
    // Record relative position from starting point
    path.push(direction);
    
    // Explore all 4 directions with direction labels
    dfsWithPath(grid, row - 1, col, startRow, startCol, path, 'u');
    dfsWithPath(grid, row + 1, col, startRow, startCol, path, 'd');
    dfsWithPath(grid, row, col - 1, startRow, startCol, path, 'l');
    dfsWithPath(grid, row, col + 1, startRow, startCol, path, 'r');
    
    // Backtrack marker (important for unique path)
    path.push('back');
}

// Genius approach: Record the path of DFS traversal as island "signature"
// Islands with same shape will have same DFS path pattern
```

### Problem 5: Making A Large Island (Google, Facebook)

**Question:** Change at most one '0' to '1'. What's the largest island you can achieve?

**My Two-Pass Solution:**

```javascript
function largestIsland(grid) {
    const n = grid.length;
    let islandId = 2; // Start from 2 (0=water, 1=unprocessed land)
    const islandSizes = new Map();
    
    // Pass 1: Label each island with unique ID and record size
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                let size = labelIsland(grid, i, j, islandId);
                islandSizes.set(islandId, size);
                islandId++;
            }
        }
    }
    
    let maxSize = Math.max(...islandSizes.values() || [0]);
    
    // Pass 2: Try changing each '0' to '1'
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 0) {
                let connectedIslands = getConnectedIslands(grid, i, j);
                let totalSize = 1; // The '0' we're changing to '1'
                
                for (let id of connectedIslands) {
                    totalSize += islandSizes.get(id);
                }
                
                maxSize = Math.max(maxSize, totalSize);
            }
        }
    }
    
    return maxSize;
}

function labelIsland(grid, row, col, id) {
    if (row < 0 || row >= grid.length || 
        col < 0 || col >= grid[0].length || 
        grid[row][col] !== 1) {
        return 0;
    }
    
    grid[row][col] = id;
    
    return 1 + 
           labelIsland(grid, row - 1, col, id) +
           labelIsland(grid, row + 1, col, id) +
           labelIsland(grid, row, col - 1, id) +
           labelIsland(grid, row, col + 1, id);
}

function getConnectedIslands(grid, row, col) {
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
    const islands = new Set();
    
    for (let [dr, dc] of directions) {
        let newRow = row + dr;
        let newCol = col + dc;
        
        if (newRow >= 0 && newRow < grid.length && 
            newCol >= 0 && newCol < grid[0].length && 
            grid[newRow][newCol] > 1) {
            islands.add(grid[newRow][newCol]);
        }
    }
    
    return islands;
}
```

## Problem Recognition Patterns

| **When You See** | **Use Island Pattern** | **Key Technique** |
|---|---|---|
| "Count connected components" | Number of Islands | Basic DFS marking |
| "Find largest/smallest component" | Max Area Island | DFS with size calculation |
| "Surrounded by boundaries" | Surrounded Regions | Border-first DFS |
| "Distinct shapes/patterns" | Distinct Islands | Path recording DFS |
| "Modify grid for optimization" | Making Large Island | Multi-pass with labeling |

## Island Pattern Variations

### 1. 4-Directional (Most Common)
```javascript
const directions = [[-1,0], [1,0], [0,-1], [0,1]]; // Up, Down, Left, Right
```

### 2. 8-Directional (Including Diagonals)
```javascript
const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
```

### 3. Custom Movement (Knight moves, etc.)
```javascript
const knightMoves = [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]];
```

## Your 30-Day Island Pattern Mastery Schedule

### Week 1: Foundation (Days 1-7)
- **Day 1-2:** Number of Islands (basic pattern)
- **Day 3-4:** Max Area of Island
- **Day 5-7:** Island Perimeter, Number of Closed Islands

**Success Metric:** Can solve basic island counting in < 15 minutes

### Week 2: Advanced Techniques (Days 8-14)
- **Day 8-10:** Surrounded Regions, Escape Large Maze
- **Day 11-14:** Number of Distinct Islands

**Success Metric:** Master multi-pass and path recording techniques

### Week 3: Optimization Problems (Days 15-21)
- **Day 15-17:** Making A Large Island
- **Day 18-21:** Shortest Bridge, Island Perimeter II

**Success Metric:** Can handle complex grid optimization problems

### Week 4: FAANG Ready (Days 22-30)
- **Day 22-25:** Mix all island patterns under time pressure
- **Day 26-30:** Mock interviews with 2D grid problems

**Success Metric:** Solve any island problem in < 20 minutes with optimal solution

## Interview Success Templates

### Template 1: Basic Island Counting
```javascript
function countIslands(grid) {
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(grid, i, j);
            }
        }
    }
    return count;
}

function dfs(grid, row, col) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || grid[row][col] !== '1') {
        return;
    }
    grid[row][col] = '0';
    dfs(grid, row-1, col);
    dfs(grid, row+1, col);
    dfs(grid, row, col-1);
    dfs(grid, row, col+1);
}
```

### Template 2: Area Calculation
```javascript
function calculateArea(grid, row, col) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || grid[row][col] !== 1) {
        return 0;
    }
    grid[row][col] = 0;
    return 1 + calculateArea(grid, row-1, col) + calculateArea(grid, row+1, col) + 
           calculateArea(grid, row, col-1) + calculateArea(grid, row, col+1);
}
```

### Template 3: Path Recording
```javascript
function recordPath(grid, row, col, path, direction) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || grid[row][col] !== 1) {
        return;
    }
    grid[row][col] = 0;
    path.push(direction);
    
    recordPath(grid, row-1, col, path, 'u');
    recordPath(grid, row+1, col, path, 'd');
    recordPath(grid, row, col-1, path, 'l');
    recordPath(grid, row, col+1, path, 'r');
    
    path.push('back');
}
```

## Common Interview Mistakes to Avoid

❌ **Mistake 1:** Not handling grid boundaries properly  
✅ **Fix:** Always check bounds before accessing grid[row][col]

❌ **Mistake 2:** Forgetting to mark cells as visited  
✅ **Fix:** Mark grid[row][col] = '0' or use separate visited array

❌ **Mistake 3:** Incorrect base case in DFS  
✅ **Fix:** Check bounds AND value in single condition

❌ **Mistake 4:** Not considering diagonal movements when required  
✅ **Fix:** Use 8-directional array when problem mentions "adjacent" cells

## Quick Reference Cheat Sheet

```javascript
// Basic Island DFS Template
function dfs(grid, row, col) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || grid[row][col] !== '1') return;
    grid[row][col] = '0';
    dfs(grid, row-1, col); dfs(grid, row+1, col); dfs(grid, row, col-1); dfs(grid, row, col+1);
}

// Area calculation: return 1 + sum of all 4 directions
// Path recording: push direction before recursive call, push 'back' after
// Multi-pass: first pass to label/calculate, second pass to optimize
```

## Next Steps

After mastering Island Pattern:
1. **Union-Find** - Alternative approach for connected components
2. **Graph Algorithms** - Apply DFS/BFS to general graphs
3. **Advanced Grid Problems** - Shortest path in grids, A* algorithm

**Remember:** Island Pattern = DFS on 2D grid to find connected components!

**Your mantra:** "Mark visited, explore 4 directions, handle boundaries carefully."