# Universal Problem-Solving Method

## Purpose

This is your systematic approach to ANY coding problem - from simple array questions to complex system design. As someone who builds applications but lacks algorithmic foundation, this framework will guide your thinking process step by step.

**Key Principle**: You don't need to be naturally good at algorithms. You need a systematic method that works every time.

---

## The 6-Step Method (UMPIRE)

### Step 1: **U**nderstand the Problem (2-3 minutes)

**Goal**: Completely understand what you're being asked to do.

**Actions**:
1. **Read the problem twice** - once quickly, once slowly
2. **Identify the input and output** clearly
3. **Ask clarifying questions** (in interviews) or make assumptions (when practicing)
4. **Restate the problem** in your own words

**Example with Two Sum Problem**:
```
Problem: "Given an array of integers and a target sum, find two numbers that add up to the target."

Understanding:
- Input: Array of integers [2, 7, 11, 15], target = 9
- Output: Indices of two numbers [0, 1] (because 2 + 7 = 9)
- Clarifications: Can I use the same element twice? Are there always valid solutions?
- Restatement: "I need to find two different elements in the array that sum to the target and return their positions."
```

**English Phrases to Use**:
- "Let me make sure I understand this correctly..."
- "So the input is [X] and the expected output is [Y]?"
- "Can I clarify [specific edge case]?"
- "In other words, I need to [restate the problem]."

### Step 2: **M**atch to Known Patterns (2-3 minutes)

**Goal**: Connect this problem to patterns you know.

**Common Patterns to Look For**:
- **Array traversal**: Need to visit each element
- **Two pointers**: Looking for pairs or comparing from both ends
- **Hash map**: Need fast lookups or frequency counting
- **Sliding window**: Working with subarrays or substrings
- **Sorting**: Order matters or you need to find min/max efficiently
- **Tree/Graph traversal**: Hierarchical or connected data

**Example with Two Sum**:
```
Pattern Recognition:
"I need to find pairs that sum to a target. This could be:
1. Brute force: Check every pair (nested loops)
2. Two pointers: But only works if array is sorted
3. Hash map: Store what I've seen and check for complements

This looks like a hash map problem because I need fast lookups to find complements."
```

**English Phrases to Use**:
- "This reminds me of [similar problem/pattern]..."
- "I can see this is a [pattern name] problem because..."
- "The key insight is that I need to [main operation]..."
- "This has similarities to [known concept]..."

### Step 3: **P**lan the Solution (3-5 minutes)

**Goal**: Design your approach before coding.

**Actions**:
1. **Choose your approach** from Step 2
2. **Write out the algorithm** in plain English
3. **Consider time and space complexity**
4. **Think about edge cases**
5. **Walk through with an example**

**Example with Two Sum**:
```
Plan:
1. Create a hash map to store numbers I've seen and their indices
2. Loop through the array once
3. For each number, calculate what its complement should be (target - current)
4. Check if the complement exists in my hash map
5. If yes: return both indices
6. If no: add current number and index to hash map
7. Continue until I find a solution

Time Complexity: O(n) - one pass through array
Space Complexity: O(n) - hash map storage

Edge Cases: What if no solution exists? What if array is empty?

Example walkthrough:
Array: [2, 7, 11, 15], target: 9
- i=0, num=2, complement=7, map={}, add 2
- i=1, num=7, complement=2, map={2:0}, found! return [0,1]
```

**English Phrases to Use**:
- "My approach will be to..."
- "The algorithm works in [number] steps..."
- "First I'll [step 1], then [step 2]..."
- "This should take O([complexity]) time and O([complexity]) space..."

### Step 4: **I**mplement the Solution (10-15 minutes)

**Goal**: Write clean, working code.

**Best Practices**:
1. **Start with the structure** (function signature, variables)
2. **Code in small pieces** and test as you go
3. **Use descriptive variable names**
4. **Add comments** for complex logic
5. **Handle edge cases** as you encounter them

**Example Implementation**:
```javascript
function twoSum(nums, target) {
    // Hash map to store number -> index mapping
    const numToIndex = new Map();
    
    // Iterate through array once
    for (let i = 0; i < nums.length; i++) {
        const currentNum = nums[i];
        const complement = target - currentNum;
        
        // Check if complement exists in our map
        if (numToIndex.has(complement)) {
            // Found a pair! Return indices
            return [numToIndex.get(complement), i];
        }
        
        // Haven't seen complement yet, store current number
        numToIndex.set(currentNum, i);
    }
    
    // No solution found (shouldn't happen if problem guarantees solution)
    return [];
}
```

**While Coding, Say**:
- "I'll start by setting up the basic structure..."
- "Here I'm creating [variable] to track [purpose]..."
- "This line handles the case where [specific scenario]..."
- "Let me add a comment to explain this logic..."

### Step 5: **R**eview & Test (3-5 minutes)

**Goal**: Verify your solution works correctly.

**Actions**:
1. **Trace through your code** with the example
2. **Test edge cases** you identified
3. **Check for bugs** (off-by-one errors, null checks, etc.)
4. **Verify time/space complexity**

**Example Testing**:
```javascript
// Test with main example
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]

// Test edge cases
console.log(twoSum([3, 3], 6));         // Expected: [0, 1] (same number, different indices)
console.log(twoSum([1, 2, 3], 7));      // Expected: [] (no solution)

// Trace through manually:
// nums=[2,7,11,15], target=9
// i=0: num=2, complement=7, map={}, add {2:0}
// i=1: num=7, complement=2, map={2:0}, found! return [0,1] ✓
```

**English Phrases to Use**:
- "Let me trace through this with an example..."
- "I should test the edge case where [scenario]..."
- "The time complexity is O([complexity]) because [reason]..."
- "This handles [edge case] correctly because [explanation]..."

### Step 6: **E**valuate & Optimize (2-3 minutes)

**Goal**: Consider if you can do better.

**Questions to Ask**:
- Can I improve the time complexity?
- Can I reduce space usage?
- Is there a more elegant approach?
- Are there other edge cases?

**Example Optimization**:
```
Current solution: O(n) time, O(n) space

Alternative approaches:
1. Brute force: O(n²) time, O(1) space - worse time complexity
2. Sort + two pointers: O(n log n) time, O(1) space - worse time, but less space
3. Current approach is optimal for this problem

No further optimization needed.
```

**English Phrases to Use**:
- "Let me consider if there's a more efficient approach..."
- "The current solution is optimal because [reason]..."
- "An alternative would be [approach], but that would [trade-off]..."
- "I think this is the best solution given the constraints."

---

## Real FAANG Interview Examples

### Google Interview Question
**Problem**: "Given a string, find the length of the longest substring without repeating characters."

**Applying the 6-Step Method**:

**1. Understand**: 
```
Input: String "abcabcbb"
Output: Integer 3 (substring "abc")
Clarifications: What counts as a character? Case sensitive?
Restatement: Find the longest contiguous substring with all unique characters.
```

**2. Match Pattern**: 
```
This is a sliding window problem because:
- I need to work with substrings (contiguous elements)
- I need to expand and contract a window based on conditions
- I need to track the maximum valid window size
```

**3. Plan**:
```
Use sliding window with two pointers:
1. Expand right pointer to grow window
2. Track characters in current window with Set
3. When duplicate found, shrink from left until no duplicates
4. Track maximum window size seen
Time: O(n), Space: O(min(m,n)) where m is character set size
```

**4. Implement**:
```javascript
function lengthOfLongestSubstring(s) {
    let left = 0, maxLength = 0;
    const charSet = new Set();
    
    for (let right = 0; right < s.length; right++) {
        // Shrink window until no duplicate
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        // Add current character and update max
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}
```

**5. Review**: Test with "abcabcbb", "bbbbb", "", "pwwkew"

**6. Evaluate**: Optimal solution for time, could use array instead of Set for slight performance gain.

### Meta Interview Question
**Problem**: "Merge two sorted arrays in-place."

**Applying the 6-Step Method**:

**1. Understand**:
```
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: nums1 = [1,2,2,3,5,6] (modified in-place)
Clarification: nums1 has enough space to hold both arrays
```

**2. Match Pattern**:
```
This is a two-pointers problem because:
- Working with two sorted arrays
- Need to merge them in sorted order
- Can use three pointers: one for each array and one for result position
```

**3. Plan**:
```
Work backwards to avoid overwriting:
1. Start from the end of both arrays
2. Compare elements and place larger one at the end of nums1
3. Move pointers backward
4. Continue until all elements processed
Time: O(m+n), Space: O(1)
```

This systematic approach works for ANY problem type!

---

## Pattern Recognition Quick Reference

### When You See These Keywords → Think These Patterns

**Array/String Problems**:
- "Find pair that sums to..." → Hash Map or Two Pointers
- "Longest substring/subarray..." → Sliding Window
- "Find missing/duplicate..." → Cyclic Sort or Hash Map
- "Merge sorted arrays..." → Two Pointers

**Tree Problems**:
- "Path from root to leaf..." → DFS (Depth First Search)
- "Level by level..." → BFS (Breadth First Search)
- "Lowest common ancestor..." → Tree DFS
- "Serialize/deserialize..." → Tree traversal

**Graph Problems**:
- "Connected components..." → DFS/BFS
- "Shortest path..." → BFS or Dijkstra
- "Cycle detection..." → DFS with visited tracking
- "Islands..." → DFS/BFS on grid

**Dynamic Programming**:
- "Maximum/minimum..." → Often DP
- "Number of ways..." → Often DP
- "Can we reach/make..." → Often DP
- "Overlapping subproblems..." → Definitely DP

---

## Practice Schedule

### Week 1: Method Internalization
- **Day 1-3**: Practice the 6 steps on simple problems (Two Sum, Reverse Array, etc.)
- **Day 4-5**: Focus on pattern recognition - read problems and identify patterns without solving
- **Day 6-7**: Apply method to 3-5 easy LeetCode problems

### Week 2: Building Confidence
- **Day 1-7**: Solve 1 easy problem daily using the method, saying steps out loud

### Week 3: Pattern Mastery
- **Day 1-7**: Focus on one pattern per day, solve 2-3 problems per pattern

### Week 4: Speed and Fluency
- **Day 1-7**: Time yourself using the method, aim to complete steps faster while maintaining quality

---

## Success Metrics

### Week 1
- [ ] Can apply all 6 steps to any simple problem
- [ ] Comfortable identifying basic patterns
- [ ] No longer feel lost when seeing new problems

### Week 2
- [ ] Automatic use of the method without conscious effort
- [ ] Can explain thinking process clearly while solving
- [ ] Successfully solve 70% of attempted easy problems

### Week 3
- [ ] Recognize patterns within 30 seconds of reading problem
- [ ] Can adapt method to different problem types
- [ ] Comfortable with most common algorithm patterns

### Week 4
- [ ] Complete entire method in 20-25 minutes for medium problems
- [ ] Natural problem-solving flow without forced structure
- [ ] Ready to tackle pattern-specific learning

**Remember**: This method is your safety net. Even when you become advanced, returning to these 6 steps will help you solve problems you've never seen before.