# Pattern Recognition Visual Guide

## Purpose

This guide helps you identify which algorithmic pattern to use within 30 seconds of reading any problem. As someone without strong algorithmic foundation, pattern recognition is your shortcut to solving problems efficiently.

**Key Insight**: Most coding problems fall into ~15 common patterns. Master pattern recognition, and you can solve 80% of interview problems.

---

## The 30-Second Pattern Identification Process

### Step 1: Read the Problem Statement (10 seconds)
**Look for these key indicators**:

### Step 2: Identify Data Structure (5 seconds)
- Array/String → Likely Two Pointers, Sliding Window, or Hash Map
- Linked List → Likely Fast/Slow Pointers or In-place Reversal  
- Tree → Likely DFS or BFS
- Graph → Likely DFS/BFS or Topological Sort
- Multiple arrays/lists → Likely Merge Intervals or K-way merge

### Step 3: Identify Operation Type (15 seconds)
- Find pairs/triplets → Two Pointers or Hash Map
- Find substring/subarray → Sliding Window
- Detect cycles → Fast/Slow Pointers
- Merge/combine → Merge Intervals
- Generate combinations → Backtracking
- Optimize decisions → Dynamic Programming

---

## Visual Pattern Recognition Flowchart

```
START: Read Problem Statement
    ↓
Does it involve ARRAYS or STRINGS?
    ↓ YES
    Are you looking for:
    ├─ Pairs that sum to target? → TWO POINTERS or HASH MAP
    ├─ Longest/shortest substring? → SLIDING WINDOW  
    ├─ Missing/duplicate numbers? → CYCLIC SORT
    ├─ Merging sorted arrays? → MERGE INTERVALS
    └─ All permutations/combinations? → BACKTRACKING
    ↓ NO
    
Does it involve LINKED LISTS?
    ↓ YES
    Are you looking for:
    ├─ Cycle detection? → FAST/SLOW POINTERS
    ├─ Middle element? → FAST/SLOW POINTERS
    ├─ Reverse operations? → IN-PLACE REVERSAL
    └─ Merging lists? → TWO POINTERS
    ↓ NO
    
Does it involve TREES?
    ↓ YES
    Are you looking for:
    ├─ All paths/sums? → TREE DFS
    ├─ Level-by-level? → TREE BFS
    ├─ Serialize/validate? → TREE DFS
    └─ Lowest common ancestor? → TREE DFS
    ↓ NO
    
Does it involve GRAPHS?
    ↓ YES
    Are you looking for:
    ├─ Connected components? → DFS/BFS
    ├─ Shortest path? → BFS
    ├─ Course scheduling? → TOPOLOGICAL SORT
    └─ Islands/regions? → DFS/BFS
    ↓ NO
    
Does it involve OPTIMIZATION?
    ↓ YES
    Are you looking for:
    ├─ Maximum/minimum value? → DYNAMIC PROGRAMMING
    ├─ Number of ways? → DYNAMIC PROGRAMMING
    ├─ Best choice at each step? → GREEDY
    └─ Overlapping subproblems? → DYNAMIC PROGRAMMING
```

---

## Pattern Quick Reference

### 1. Two Pointers Pattern 👆👆

**When to Use**:
- Array is sorted or can be sorted
- Looking for pairs, triplets, or comparing elements
- Need to work from both ends toward center

**Visual Signature**:
```
[1, 2, 3, 4, 5, 6]
 ↑              ↑
left          right
```

**Key Problem Phrases**:
- "Find two numbers that sum to..."
- "Remove duplicates in-place..."
- "Reverse array/string..."
- "Valid palindrome..."

**Real FAANG Questions**:
- **Google**: Container With Most Water (LeetCode 11)
- **Meta**: 3Sum (LeetCode 15)  
- **Amazon**: Two Sum II (LeetCode 167)

### 2. Sliding Window Pattern 🪟

**When to Use**:
- Working with subarrays or substrings
- Need to find longest/shortest/optimal subarray
- Looking for patterns within contiguous elements

**Visual Signature**:
```
[a, b, c, d, e, f, g]
    [---window---]
     ↑         ↑
   start      end
```

**Key Problem Phrases**:
- "Longest substring without..."
- "Minimum window substring..."
- "Maximum sum subarray of size k..."
- "Find all anagrams..."

**Real FAANG Questions**:
- **Google**: Longest Substring Without Repeating Characters (LeetCode 3)
- **Meta**: Minimum Window Substring (LeetCode 76)
- **Amazon**: Fruit Into Baskets (LeetCode 904)

### 3. Fast & Slow Pointers Pattern 🐇🐢

**When to Use**:
- Detecting cycles in linked lists
- Finding middle element
- Palindrome checking

**Visual Signature**:
```
1 → 2 → 3 → 4 → 5 → 6
    🐢     🐇
```

**Key Problem Phrases**:
- "Detect cycle in linked list..."
- "Find middle of linked list..."
- "Check if palindrome..."
- "Happy number..."

**Real FAANG Questions**:
- **Google**: Linked List Cycle (LeetCode 141)
- **Meta**: Find the Duplicate Number (LeetCode 287)
- **Amazon**: Middle of the Linked List (LeetCode 876)

### 4. Merge Intervals Pattern 📊

**When to Use**:
- Working with intervals or ranges
- Need to merge overlapping intervals
- Scheduling problems

**Visual Signature**:
```
Intervals: [1,3] [2,6] [8,10] [15,18]
Result:    [1,6]      [8,10] [15,18]
           ↑___↑
         merged
```

**Key Problem Phrases**:
- "Merge overlapping intervals..."
- "Insert interval..."
- "Meeting rooms..."
- "Range sum queries..."

**Real FAANG Questions**:
- **Google**: Merge Intervals (LeetCode 56)
- **Meta**: Insert Interval (LeetCode 57)
- **Amazon**: Meeting Rooms II (LeetCode 253)

### 5. Cyclic Sort Pattern 🔄

**When to Use**:
- Array contains numbers in range [1, n] or [0, n-1]
- Finding missing/duplicate numbers
- Numbers should be in their correct position

**Visual Signature**:
```
Input:  [3, 1, 5, 4, 2]
Output: [1, 2, 3, 4, 5]
         ↑  ↑  ↑  ↑  ↑
      position matches value
```

**Key Problem Phrases**:
- "Find missing number..."
- "Find duplicate number..."
- "Array contains numbers from 1 to n..."
- "First missing positive..."

**Real FAANG Questions**:
- **Google**: Missing Number (LeetCode 268)
- **Meta**: Find All Numbers Disappeared in Array (LeetCode 448)
- **Amazon**: First Missing Positive (LeetCode 41)

### 6. Tree Depth-First Search (DFS) Pattern 🌳

**When to Use**:
- Exploring all paths in a tree
- Tree validation or transformation
- Path sum problems

**Visual Signature**:
```
       1
      / \
     2   3
    / \
   4   5
DFS order: 1→2→4→5→3
```

**Key Problem Phrases**:
- "Path sum equals..."
- "Maximum depth of tree..."
- "Serialize/deserialize tree..."
- "Validate binary search tree..."

**Real FAANG Questions**:
- **Google**: Path Sum (LeetCode 112)
- **Meta**: Binary Tree Maximum Path Sum (LeetCode 124)
- **Amazon**: Serialize and Deserialize Binary Tree (LeetCode 297)

### 7. Tree Breadth-First Search (BFS) Pattern 🌳

**When to Use**:
- Level-by-level tree traversal
- Finding shortest path in unweighted tree
- Level order operations

**Visual Signature**:
```
       1         Level 0
      / \
     2   3       Level 1  
    / \
   4   5         Level 2
BFS order: 1→2→3→4→5
```

**Key Problem Phrases**:
- "Level order traversal..."
- "Binary tree right side view..."
- "Minimum depth..."
- "Level with maximum sum..."

**Real FAANG Questions**:
- **Google**: Binary Tree Level Order Traversal (LeetCode 102)
- **Meta**: Binary Tree Right Side View (LeetCode 199)
- **Amazon**: Minimum Depth of Binary Tree (LeetCode 111)

### 8. Islands (DFS/BFS) Pattern 🏝️

**When to Use**:
- 2D grid problems
- Connected components
- Flood fill algorithms

**Visual Signature**:
```
Grid:
1 1 0 0 0
1 1 0 0 0  
0 0 1 0 0  ← Island detection
0 0 0 1 1
```

**Key Problem Phrases**:
- "Number of islands..."
- "Max area of island..."
- "Surrounded regions..."
- "Word search..."

**Real FAANG Questions**:
- **Google**: Number of Islands (LeetCode 200)
- **Meta**: Max Area of Island (LeetCode 695)
- **Amazon**: Word Search (LeetCode 79)

---

## Pattern Recognition Practice

### Drill 1: Quick Pattern ID (30 seconds each)

**Problem**: "Given an array of integers, find two numbers such that they add up to a specific target."
**Pattern**: Two Pointers or Hash Map ✓
**Why**: Looking for pairs that sum to target

**Problem**: "Find the longest substring without repeating characters."
**Pattern**: Sliding Window ✓
**Why**: Working with substrings, finding longest valid window

**Problem**: "Determine if a linked list has a cycle."
**Pattern**: Fast/Slow Pointers ✓
**Why**: Cycle detection in linked list

**Problem**: "Merge all overlapping intervals."
**Pattern**: Merge Intervals ✓
**Why**: Working with intervals, need to merge overlapping

**Problem**: "Given array containing numbers from 1 to n, find missing number."
**Pattern**: Cyclic Sort ✓
**Why**: Numbers in range [1,n], finding missing

### Drill 2: Advanced Pattern Recognition

**Problem**: "Design a data structure that supports insert, delete, and get random element in O(1) time."
**Pattern**: Hash Map + Dynamic Array
**Why**: Need O(1) operations, combination of data structures

**Problem**: "Find the shortest path between two nodes in an unweighted graph."
**Pattern**: BFS
**Why**: Shortest path in unweighted graph = BFS

**Problem**: "Given a string, find all possible combinations of valid parentheses."
**Pattern**: Backtracking
**Why**: Generate all valid combinations

---

## Company-Specific Pattern Preferences

### Google Favorites
1. **Two Pointers**: Container With Most Water, 3Sum
2. **Sliding Window**: Longest Substring problems  
3. **Tree DFS**: Path sum variants
4. **Dynamic Programming**: Word Break, Coin Change

### Meta Favorites
1. **Hash Map**: Group Anagrams, Two Sum variants
2. **BFS/DFS**: Friend connections, social network problems
3. **String Manipulation**: Valid Palindrome variants
4. **Backtracking**: Generate combinations

### Amazon Favorites
1. **Tree BFS**: Level order traversal variants
2. **Two Pointers**: Merge sorted arrays
3. **Sliding Window**: Subarray problems
4. **Graph DFS/BFS**: Connected components

### Apple Favorites
1. **Dynamic Programming**: Optimization problems
2. **Tree DFS**: Binary tree problems
3. **String Processing**: Text manipulation
4. **Design Problems**: Data structure design

---

## Pattern Mastery Checklist

### Beginner Level (Week 1-2)
- [ ] Can identify basic patterns in 30 seconds
- [ ] Know visual signatures for top 5 patterns
- [ ] Comfortable with Two Pointers and Sliding Window

### Intermediate Level (Week 3-4)  
- [ ] Recognize 10+ patterns quickly
- [ ] Can adapt patterns to problem variations
- [ ] Confident with Tree and Graph patterns

### Advanced Level (Week 5-8)
- [ ] Automatic pattern recognition
- [ ] Can combine multiple patterns in complex problems
- [ ] Identify when to use advanced patterns (DP, Backtracking)

---

## Daily Practice Routine

### Week 1: Pattern Familiarization
- **Daily (15 minutes)**: Study 2-3 patterns, memorize visual signatures
- **Practice**: Read 10 problem statements, identify patterns (don't solve)

### Week 2: Speed Recognition
- **Daily (15 minutes)**: Timed pattern recognition drills
- **Practice**: 30-second pattern ID for 20 problems daily

### Week 3: Application Practice
- **Daily (30 minutes)**: Solve 1-2 problems per pattern
- **Practice**: Focus on pattern implementation, not just recognition

### Week 4: Integration Mastery
- **Daily (45 minutes)**: Mixed problem solving using pattern recognition
- **Practice**: Simulate interview conditions with random problems

**Remember**: Pattern recognition is a skill that improves with deliberate practice. The more problems you see, the faster you'll recognize patterns in new problems.