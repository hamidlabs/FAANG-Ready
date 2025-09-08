# Tree BFS Pattern - Master Guide

## From Zero to FAANG Ready

### What is Tree BFS and Why is it Your Interview Superpower?

Imagine you're standing at the top floor of a building and need to visit every room. Instead of randomly jumping around, you visit ALL rooms on floor 1, then ALL rooms on floor 2, and so on. That's exactly what Breadth-First Search (BFS) does with trees!

BFS is **essential** for tree problems that require level-by-level processing. It appears in 40% of tree interview questions, especially at Google and Facebook.

### Core Concept: Level-by-Level Exploration

```
Example Tree:
        3
       / \
      9  20
        /  \
       15   7

BFS Traversal by Levels:
Level 0: [3]
Level 1: [9, 20] 
Level 2: [15, 7]

Result: 3 → 9 → 20 → 15 → 7
```

## The BFS Magic: Queue-Based Processing

Unlike DFS (which uses recursion/stack), BFS uses a **queue**:
- **Add** children to the BACK of queue
- **Remove** nodes from the FRONT of queue
- This naturally processes level by level!

## The Universal BFS Template

```javascript
// THE TEMPLATE THAT SOLVES 95% OF BFS PROBLEMS
function levelOrderTraversal(root) {
    if (!root) return [];
    
    let result = [];
    let queue = [root];
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        let currentLevel = [];
        
        // Process all nodes at current level
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift(); // Remove from front
            currentLevel.push(node.val);
            
            // Add children to queue for next level
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}
```

## Real FAANG Problems with Complete Solutions

### Problem 1: Binary Tree Level Order Traversal (Amazon, Facebook, Microsoft)

**Question:** Given a binary tree, return the level order traversal as a list of lists.

**Input:**
```
    3
   / \
  9  20
    /  \
   15   7
```
**Expected Output:** [[3], [9, 20], [15, 7]]

**My Professional Solution:**

```javascript
function levelOrder(root) {
    if (!root) return [];
    
    let result = [];
    let queue = [root];
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        let currentLevel = [];
        
        // Process entire current level
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            currentLevel.push(node.val);
            
            // Queue up next level's nodes
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

// Key insight: levelSize captures current level's node count
// This prevents mixing levels when new nodes are added to queue
```

**Time Complexity:** O(n) - visit each node once  
**Space Complexity:** O(w) - maximum width of tree

### Problem 2: Binary Tree Zigzag Level Order (Amazon, Microsoft)

**Question:** Traverse the tree level by level, but alternate direction (left-to-right, then right-to-left).

**Input:**
```
    3
   / \
  9  20
    /  \
   15   7
```
**Expected Output:** [[3], [20, 9], [15, 7]]

**My Step-by-Step Solution:**

```javascript
function zigzagLevelOrder(root) {
    if (!root) return [];
    
    let result = [];
    let queue = [root];
    let leftToRight = true; // Direction flag
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        let currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            
            // Add to front or back based on direction
            if (leftToRight) {
                currentLevel.push(node.val);
            } else {
                currentLevel.unshift(node.val); // Add to front!
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
        leftToRight = !leftToRight; // Flip direction
    }
    
    return result;
}

// Interview tip: Use unshift() for reverse order
// Alternative: collect normally, then reverse the array
```

### Problem 3: Binary Tree Right Side View (Amazon, Facebook)

**Question:** Return the values you can see when looking at the tree from the right side.

**Input:**
```
   1            <---
 /   \
2     3         <---
 \     \
  5     4       <---
```
**Expected Output:** [1, 3, 4]

**My Elegant Solution:**

```javascript
function rightSideView(root) {
    if (!root) return [];
    
    let result = [];
    let queue = [root];
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            
            // Last node in level = rightmost visible
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return result;
}

// Brilliant insight: Last node processed in each level
// is the rightmost node, which is what we see from right side!
```

### Problem 4: Minimum Depth of Binary Tree (Google, Apple)

**Question:** Find the minimum depth (shortest path from root to any leaf).

**My Optimal BFS Solution:**

```javascript
function minDepth(root) {
    if (!root) return 0;
    
    let queue = [root];
    let depth = 1;
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            
            // First leaf node we encounter = minimum depth!
            if (!node.left && !node.right) {
                return depth;
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        depth++;
    }
    
    return depth;
}

// Why BFS is better than DFS here:
// BFS finds the first leaf (minimum depth) immediately
// DFS would need to check all paths to find minimum
```

### Problem 5: Average of Levels (Amazon, Facebook)

**Question:** Calculate the average value of nodes on each level.

**My Complete Solution:**

```javascript
function averageOfLevels(root) {
    if (!root) return [];
    
    let result = [];
    let queue = [root];
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        let levelSum = 0;
        
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            levelSum += node.val;
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        // Calculate average for this level
        result.push(levelSum / levelSize);
    }
    
    return result;
}

// Clean approach: Sum all values in level, then divide by count
```

## Problem Recognition Patterns

| **When You See** | **Use BFS** | **Why BFS Over DFS** |
|---|---|---|
| "Level by level" | Level Order Traversal | Natural level processing |
| "Find minimum depth" | BFS Shortest Path | Finds first leaf quickly |
| "Right/Left side view" | BFS with Position Tracking | Easy to track last/first in level |
| "Average/Sum per level" | Level-wise Processing | Groups nodes by level naturally |
| "Serialize by levels" | BFS Serialization | Maintains level structure |

## BFS vs DFS: When to Use Which?

### Use BFS When:
✅ Need to process level by level  
✅ Finding shortest path/minimum depth  
✅ Memory isn't a major constraint  
✅ Need to find something "closest" to root

### Use DFS When:
✅ Need to go deep into tree structure  
✅ Memory is limited (tree is very wide)  
✅ Processing parent-child relationships  
✅ Validating tree properties

## Your 30-Day BFS Mastery Schedule

### Week 1: Foundation (Days 1-7)
- **Day 1-2:** Binary Tree Level Order Traversal
- **Day 3-4:** Binary Tree Level Order II (bottom-up)
- **Day 5-7:** Average of Levels, Maximum Width

**Success Metric:** Can implement basic BFS in < 10 minutes

### Week 2: Direction & Views (Days 8-14)
- **Day 8-10:** Binary Tree Zigzag, Right Side View
- **Day 11-14:** Left Side View, Bottom Left Tree Value

**Success Metric:** Master direction-based BFS problems

### Week 3: Advanced Applications (Days 15-21)
- **Day 15-17:** Minimum Depth, Maximum Depth with BFS
- **Day 18-21:** Connect Next Right Pointers, Perfect Binary Tree

**Success Metric:** Can optimize problems using BFS characteristics

### Week 4: FAANG Ready (Days 22-30)
- **Day 22-25:** Mix all BFS patterns under time pressure
- **Day 26-30:** Mock interviews with level-order problems

**Success Metric:** Solve any BFS tree problem in < 15 minutes

## Interview Success Templates

### Template 1: Standard Level Processing
```javascript
function processLevels(root) {
    if (!root) return [];
    
    let result = [];
    let queue = [root];
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        let currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            
            // Process current node
            currentLevel.push(node.val);
            
            // Add children for next level
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}
```

### Template 2: Early Termination (Minimum Depth Style)
```javascript
function findTarget(root, condition) {
    if (!root) return null;
    
    let queue = [root];
    let level = 0;
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        level++;
        
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            
            if (condition(node)) {
                return level; // Found target!
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return -1; // Not found
}
```

### Template 3: Direction-Based Processing
```javascript
function alternatingProcess(root) {
    if (!root) return [];
    
    let result = [];
    let queue = [root];
    let reverse = false;
    
    while (queue.length > 0) {
        let levelSize = queue.length;
        let currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            let node = queue.shift();
            
            if (reverse) {
                currentLevel.unshift(node.val); // Add to front
            } else {
                currentLevel.push(node.val); // Add to back
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
        reverse = !reverse;
    }
    
    return result;
}
```

## Common Interview Mistakes to Avoid

❌ **Mistake 1:** Not capturing level size before processing
```javascript
// WRONG - level size changes as you add children
while (queue.length > 0) {
    for (let i = 0; i < queue.length; i++) { // BAD!
        // Process node...
    }
}
```
✅ **Fix:** Capture `levelSize` before the loop

❌ **Mistake 2:** Using wrong queue methods
✅ **Fix:** `queue.shift()` to remove from front, `queue.push()` to add to back

❌ **Mistake 3:** Forgetting to handle empty tree
✅ **Fix:** Always check `if (!root) return [];` first

❌ **Mistake 4:** Mixing up left-to-right vs right-to-left
✅ **Fix:** Use `unshift()` for reverse order or toggle direction flag

## Quick Reference Cheat Sheet

```javascript
// Standard BFS Template
let queue = [root];
while (queue.length > 0) {
    let size = queue.length;
    for (let i = 0; i < size; i++) {
        let node = queue.shift();
        // Process node
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
}

// Right Side View: Take last node in each level
if (i === levelSize - 1) result.push(node.val);

// Zigzag: Alternate direction with flag
if (leftToRight) level.push(node.val);
else level.unshift(node.val);

// Minimum Depth: Return when first leaf found
if (!node.left && !node.right) return depth;
```

## Next Steps

After mastering Tree BFS:
1. **Graph BFS** - Apply to graph shortest path problems
2. **Multi-source BFS** - Handle multiple starting points
3. **Bidirectional BFS** - Search from both ends

**Remember:** BFS = Level-by-level processing with a queue. Perfect for "width-first" exploration!

**Your mantra:** "Process current level completely before moving to next level."