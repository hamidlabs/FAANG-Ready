# Tree DFS Pattern - Master Guide

## From Zero to FAANG Ready

### What is Tree DFS and Why Should You Care?

Imagine you're exploring a maze. You pick a path and go as deep as possible before backtracking. That's exactly what Depth-First Search (DFS) does with trees!

DFS is your **secret weapon** for tree problems in FAANG interviews. It's used in 70% of tree questions because it naturally handles the recursive structure of trees.

### Core Concept: The Magic of "Go Deep First"

```
Example Tree:
        1
       / \
      2   3
     / \
    4   5

DFS Traversal: 1 → 2 → 4 → 5 → 3
(We go all the way down left, then backtrack and continue)
```

## The Three DFS Patterns You MUST Master

### Pattern 1: Preorder DFS (Root → Left → Right)
**Use when:** You need to process the parent before children (copying, printing structure)

### Pattern 2: Inorder DFS (Left → Root → Right)  
**Use when:** You need sorted output from BST or validate BST

### Pattern 3: Postorder DFS (Left → Right → Root)
**Use when:** You need to process children before parent (calculating height, deleting)

## Template: Your Universal DFS Solution

```javascript
// THE TEMPLATE THAT SOLVES 90% OF DFS PROBLEMS
function dfsTraversal(root, targetCondition) {
    // Base case - always handle null first
    if (!root) return defaultValue;
    
    // Process current node (preorder)
    let currentResult = processCurrentNode(root);
    
    // Recursively process children
    let leftResult = dfsTraversal(root.left, targetCondition);
    let rightResult = dfsTraversal(root.right, targetCondition);
    
    // Combine results (postorder)
    return combineResults(currentResult, leftResult, rightResult);
}
```

## Real FAANG Problems with Complete Solutions

### Problem 1: Maximum Depth of Binary Tree (Amazon, Google, Facebook)

**Question:** Given a binary tree, find its maximum depth.

**Input:**
```
    3
   / \
  9  20
    /  \
   15   7
```
**Expected Output:** 3

**My Step-by-Step Solution:**

```javascript
function maxDepth(root) {
    // Step 1: Handle empty tree
    if (!root) return 0;
    
    // Step 2: Get depths from both subtrees
    let leftDepth = maxDepth(root.left);
    let rightDepth = maxDepth(root.right);
    
    // Step 3: Current depth = max of subtrees + 1 (current node)
    return Math.max(leftDepth, rightDepth) + 1;
}

// Why this works:
// - Each recursive call handles one level
// - We add 1 for the current node
// - We take max of left/right because we want MAXIMUM depth
```

**Time Complexity:** O(n) - visit each node once
**Space Complexity:** O(h) - recursive call stack, where h = height

### Problem 2: Path Sum (Facebook, Amazon)

**Question:** Given a tree and target sum, determine if there exists a root-to-leaf path with that sum.

**Input:**
```
      5
     / \
    4   8
   /   / \
  11  13  4
 / \      \
7   2      1

Target: 22
```
**Expected Output:** true (5→4→11→2 = 22)

**My Complete Solution:**

```javascript
function hasPathSum(root, targetSum) {
    // Base case: reached null node
    if (!root) return false;
    
    // Check if we're at leaf node and sum matches
    if (!root.left && !root.right) {
        return root.val === targetSum;
    }
    
    // Recursive case: subtract current value and check children
    let remainingSum = targetSum - root.val;
    return hasPathSum(root.left, remainingSum) || 
           hasPathSum(root.right, remainingSum);
}

// Interview explanation:
// "I'm using DFS to explore all paths from root to leaf.
//  At each node, I subtract its value from target.
//  If I reach a leaf with remaining sum equal to leaf value, found it!"
```

### Problem 3: Binary Tree Paths (Google, Facebook)

**Question:** Return all root-to-leaf paths in a binary tree.

**Input:**
```
   1
 /   \
2     3
 \
  5
```
**Expected Output:** ["1->2->5", "1->3"]

**My Advanced Solution:**

```javascript
function binaryTreePaths(root) {
    let result = [];
    
    function dfs(node, currentPath) {
        if (!node) return;
        
        // Add current node to path
        currentPath.push(node.val);
        
        // If leaf node, add path to result
        if (!node.left && !node.right) {
            result.push(currentPath.join('->'));
        } else {
            // Continue exploring children
            dfs(node.left, currentPath);
            dfs(node.right, currentPath);
        }
        
        // CRITICAL: Backtrack - remove current node
        currentPath.pop();
    }
    
    dfs(root, []);
    return result;
}

// Key insight: Backtracking with currentPath.pop()
// This ensures we don't carry previous path data to other branches
```

### Problem 4: Validate Binary Search Tree (Amazon, Microsoft, Apple)

**Question:** Determine if a binary tree is a valid BST.

**My Professional Solution:**

```javascript
function isValidBST(root) {
    function validate(node, minVal, maxVal) {
        // Empty tree is valid BST
        if (!node) return true;
        
        // Current node violates BST property
        if (node.val <= minVal || node.val >= maxVal) {
            return false;
        }
        
        // Recursively validate left and right subtrees
        // Left subtree: all values must be < current node value
        // Right subtree: all values must be > current node value
        return validate(node.left, minVal, node.val) &&
               validate(node.right, node.val, maxVal);
    }
    
    return validate(root, -Infinity, Infinity);
}

// Interview tip: Many candidates forget about the min/max bounds!
// This solution correctly handles the global BST property.
```

## Problem Recognition Patterns

| **When You See** | **Use DFS Pattern** | **Template Variation** |
|---|---|---|
| "Find path from root to leaf" | Path Sum DFS | Track remaining sum |
| "Calculate tree height/depth" | Max/Min Depth DFS | Math.max/min of children |
| "Validate tree properties" | Validation DFS | Pass bounds/constraints |
| "Collect all paths" | Path Collection DFS | Use backtracking |
| "Process bottom-up" | Postorder DFS | Process children first |

## Your 30-Day DFS Mastery Schedule

### Week 1: Foundation (Days 1-7)
- **Day 1-2:** Maximum Depth, Minimum Depth
- **Day 3-4:** Path Sum I, Path Sum II  
- **Day 5-7:** Binary Tree Paths, Sum of Left Leaves

**Success Metric:** Can solve basic DFS problems in < 15 minutes

### Week 2: Intermediate (Days 8-14)
- **Day 8-10:** Validate BST, Symmetric Tree
- **Day 11-14:** Diameter of Binary Tree, Lowest Common Ancestor

**Success Metric:** Can handle BST validation and tree properties

### Week 3: Advanced (Days 15-21)
- **Day 15-17:** Serialize/Deserialize Binary Tree
- **Day 18-21:** Binary Tree Maximum Path Sum

**Success Metric:** Can solve complex recursive problems

### Week 4: FAANG Ready (Days 22-30)
- **Day 22-25:** Mix of all patterns under time pressure
- **Day 26-30:** Mock interviews with tree problems

**Success Metric:** Solve any tree DFS problem in < 20 minutes with clean code

## Interview Success Templates

### Template 1: Simple Property Check
```javascript
function checkProperty(root) {
    if (!root) return baseCase;
    
    let leftResult = checkProperty(root.left);
    let rightResult = checkProperty(root.right);
    
    return combineWithCurrentNode(root, leftResult, rightResult);
}
```

### Template 2: Path-based Problems
```javascript
function pathProblem(root, target) {
    function dfs(node, currentPath, currentSum) {
        if (!node) return;
        
        currentPath.push(node.val);
        currentSum += node.val;
        
        if (isLeaf(node) && currentSum === target) {
            // Found valid path
            processResult(currentPath);
        }
        
        dfs(node.left, currentPath, currentSum);
        dfs(node.right, currentPath, currentSum);
        
        // Backtrack
        currentPath.pop();
    }
    
    dfs(root, [], 0);
}
```

## Common Interview Mistakes to Avoid

❌ **Mistake 1:** Forgetting base case for null nodes
✅ **Fix:** Always handle `if (!root) return ...` first

❌ **Mistake 2:** Not backtracking in path problems  
✅ **Fix:** Remember to `currentPath.pop()` after recursive calls

❌ **Mistake 3:** Confusing preorder vs postorder
✅ **Fix:** Process node before children = preorder, after = postorder

❌ **Mistake 4:** Incorrect BST validation
✅ **Fix:** Use min/max bounds, not just left < root < right

## Quick Reference Cheat Sheet

```javascript
// Maximum Depth
return !root ? 0 : Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;

// Has Path Sum
return !root ? false : 
       (!root.left && !root.right) ? root.val === sum :
       hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val);

// Validate BST
function validate(node, min, max) {
    return !node ? true : 
           node.val > min && node.val < max &&
           validate(node.left, min, node.val) && validate(node.right, node.val, max);
}
```

## Next Steps

After mastering Tree DFS:
1. **Tree BFS Pattern** - Handle level-by-level processing
2. **Graph DFS** - Apply same concepts to graphs
3. **Advanced Trees** - Tries, Segment Trees, etc.

**Remember:** DFS is about going deep first, then backtracking. Master the recursive mindset, and you'll solve any tree problem!

**Your mantra:** "Base case first, recurse on children, combine results."