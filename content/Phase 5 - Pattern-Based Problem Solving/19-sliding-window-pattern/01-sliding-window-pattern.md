# Sliding Window Pattern

## Purpose

The Sliding Window pattern is the secret weapon for subarray/substring problems in FAANG interviews. It transforms O(n²) or O(n³) brute force solutions into elegant O(n) algorithms. Master this pattern to solve problems that seem computationally impossible.

**Key Insight**: Instead of recalculating everything for each possible subarray, maintain a "window" and slide it efficiently, updating only what changes.

---

## What is the Sliding Window Pattern?

**Basic Concept**: Maintain a window (subarray/substring) between two pointers and slide it through the data, efficiently updating the window state as you move.

```javascript
// Visual representation
// Array: [1, 2, 3, 4, 5, 6, 7]
// Window of size 3:
// 
// Step 1: [1, 2, 3] 4  5  6  7    (window sum = 6)
//          ↑     ↑
//        left   right
//
// Step 2:  1 [2, 3, 4] 5  6  7    (window sum = 9 = 6 - 1 + 4)
//             ↑     ↑
//           left   right
//
// Step 3:  1  2 [3, 4, 5] 6  7    (window sum = 12 = 9 - 2 + 5)
//                ↑     ↑
//              left   right
```

**Why Sliding Window Works:**
- **Avoids redundant calculations**: Don't recalculate entire window, just update changes
- **Linear time complexity**: Each element enters and exits window at most once
- **Natural for contiguous subarrays**: Perfect fit for substring/subarray problems

---

## Types of Sliding Window Problems

### Type 1: Fixed Size Window

**Pattern**: Window size is given, slide window and track optimal result.

```javascript
// Template for fixed size sliding window
function fixedWindowPattern(arr, k) {
    if (arr.length < k) return null;
    
    // Calculate initial window
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    let result = windowSum; // Or whatever you're tracking
    
    // Slide window
    for (let i = k; i < arr.length; i++) {
        // Remove element going out of window
        windowSum -= arr[i - k];
        // Add element coming into window
        windowSum += arr[i];
        
        // Update result based on current window
        result = Math.max(result, windowSum); // Or whatever operation
    }
    
    return result;
}

// Use cases:
// - Maximum sum subarray of size k
// - Average of all subarrays of size k  
// - Maximum number of vowels in substring of length k
```

### Type 2: Variable Size Window (Expand/Contract)

**Pattern**: Expand window until condition breaks, then contract until condition restored.

```javascript
// Template for variable size sliding window
function variableWindowPattern(arr, condition) {
    let left = 0;
    let right = 0;
    let windowState = initializeState(); // Hash map, counter, etc.
    let result = initializeResult();
    
    while (right < arr.length) {
        // Expand window: add arr[right] to window
        updateWindowState(windowState, arr[right]);
        
        // Contract window while condition is violated
        while (conditionViolated(windowState, condition)) {
            updateResult(result, left, right); // Optional: update result
            
            // Remove arr[left] from window
            removeFromWindowState(windowState, arr[left]);
            left++;
        }
        
        // Update result with current valid window
        updateResult(result, left, right);
        right++;
    }
    
    return result;
}

// Use cases:
// - Longest substring without repeating characters
// - Minimum window substring
// - Longest substring with at most k distinct characters
```

### Type 3: Dynamic Window (Best Fit)

**Pattern**: Adjust window size dynamically to find optimal solution.

```javascript
// Template for dynamic sliding window
function dynamicWindowPattern(arr, target) {
    let left = 0;
    let windowSum = 0;
    let result = initializeResult();
    
    for (let right = 0; right < arr.length; right++) {
        windowSum += arr[right];
        
        // Shrink window while sum is too large
        while (windowSum > target && left <= right) {
            windowSum -= arr[left];
            left++;
        }
        
        // Check if current window meets criteria
        if (windowSum === target) {
            updateResult(result, left, right);
        }
        
        // Or update result based on current window size
        updateResult(result, right - left + 1);
    }
    
    return result;
}

// Use cases:
// - Subarray with given sum
// - Smallest subarray with sum >= target
// - Maximum size subarray with sum <= target
```

---

## Real FAANG Interview Problems

### Problem 1: Maximum Sum Subarray of Size K

**Amazon/Google**: "Find maximum sum of any contiguous subarray of size k."

**Complete Solution**:
```javascript
function maxSumSubarray(nums, k) {
    if (nums.length < k) return null;
    
    // Calculate sum of first window
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    let maxSum = windowSum;
    
    // Slide window through rest of array
    for (let i = k; i < nums.length; i++) {
        // Slide window: remove leftmost, add rightmost
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

// Example: nums = [2, 1, 5, 1, 3, 2], k = 3
// 
// Initial window [2, 1, 5]: sum = 8
// Slide to [1, 5, 1]: sum = 8 - 2 + 1 = 7  
// Slide to [5, 1, 3]: sum = 7 - 1 + 3 = 9
// Slide to [1, 3, 2]: sum = 9 - 5 + 2 = 6
// 
// Maximum sum = 9

// Time: O(n) - each element processed once
// Space: O(1) - only variables

// Brute force would be O(n * k):
function maxSumBruteForce(nums, k) {
    let maxSum = -Infinity;
    
    for (let i = 0; i <= nums.length - k; i++) {
        let currentSum = 0;
        for (let j = i; j < i + k; j++) { // Recalculate sum every time
            currentSum += nums[j];
        }
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}
```

### Problem 2: Longest Substring Without Repeating Characters

**Google/Meta**: "Find length of longest substring without repeating characters."

**Complete Solution**:
```javascript
function lengthOfLongestSubstring(s) {
    const charSet = new Set(); // Track characters in current window
    let left = 0;              // Left boundary of window
    let maxLength = 0;         // Result: maximum length found
    
    for (let right = 0; right < s.length; right++) {
        // Expand window: add s[right]
        
        // Contract window while we have duplicates
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        // Add current character to window
        charSet.add(s[right]);
        
        // Update maximum length
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// How it works step by step:
// s = "abcabcbb"
//
// right=0, s[0]='a': charSet={a}, window="a", maxLength=1
// right=1, s[1]='b': charSet={a,b}, window="ab", maxLength=2  
// right=2, s[2]='c': charSet={a,b,c}, window="abc", maxLength=3
// right=3, s[3]='a': 'a' in charSet, contract:
//   Remove s[0]='a': charSet={b,c}, left=1
//   Add 'a': charSet={b,c,a}, window="bca", maxLength=3
// right=4, s[4]='b': 'b' in charSet, contract:
//   Remove s[1]='b': charSet={c,a}, left=2
//   Add 'b': charSet={c,a,b}, window="cab", maxLength=3
// ... continue

// Alternative approach with hash map (tracks last seen position):
function lengthOfLongestSubstringMap(s) {
    const charMap = new Map(); // char -> last seen index
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        // If character seen before and within current window
        if (charMap.has(char) && charMap.get(char) >= left) {
            left = charMap.get(char) + 1; // Move left past last occurrence
        }
        
        charMap.set(char, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Time: O(n) - each character visited at most twice
// Space: O(min(m, n)) where m is character set size
```

### Problem 3: Minimum Window Substring

**Meta/Amazon**: "Find minimum window that contains all characters of target string."

**Complete Solution**:
```javascript
function minWindow(s, t) {
    if (s.length < t.length) return "";
    
    // Count frequency of characters in target
    const targetFreq = new Map();
    for (let char of t) {
        targetFreq.set(char, (targetFreq.get(char) || 0) + 1);
    }
    
    const windowFreq = new Map();
    let left = 0;
    let minStart = 0;
    let minLength = Infinity;
    let formed = 0; // Number of unique characters in window with desired frequency
    
    const required = targetFreq.size; // Number of unique characters in t
    
    for (let right = 0; right < s.length; right++) {
        // Expand window: add character from right
        const char = s[right];
        windowFreq.set(char, (windowFreq.get(char) || 0) + 1);
        
        // Check if frequency of current character matches desired count
        if (targetFreq.has(char) && windowFreq.get(char) === targetFreq.get(char)) {
            formed++;
        }
        
        // Contract window when we have valid window
        while (formed === required && left <= right) {
            // Update minimum window if current is smaller
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minStart = left;
            }
            
            // Remove character from left
            const leftChar = s[left];
            windowFreq.set(leftChar, windowFreq.get(leftChar) - 1);
            
            if (targetFreq.has(leftChar) && windowFreq.get(leftChar) < targetFreq.get(leftChar)) {
                formed--;
            }
            
            left++;
        }
    }
    
    return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
}

// Example: s = "ADOBECODEBANC", t = "ABC"
// 
// Target frequencies: {A: 1, B: 1, C: 1}
// 
// Expand to "ADOBEC": contains A, B, C - valid window, length 6
// Contract: try removing 'A' - no longer contains A, invalid
// Continue expanding...
// Eventually find "BANC": contains A, B, C - valid window, length 4
// This is minimum, so return "BANC"

// Time: O(|s| + |t|) - each character in s visited at most twice
// Space: O(|s| + |t|) - hash maps for frequency counting
```

### Problem 4: Longest Substring with At Most K Distinct Characters

**Google/Uber**: "Find longest substring with at most k distinct characters."

**Complete Solution**:
```javascript
function lengthOfLongestSubstringKDistinct(s, k) {
    if (k === 0) return 0;
    
    const charCount = new Map(); // Character -> frequency in window
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        // Expand window: add character from right
        const rightChar = s[right];
        charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);
        
        // Contract window while we have more than k distinct characters
        while (charCount.size > k) {
            const leftChar = s[left];
            charCount.set(leftChar, charCount.get(leftChar) - 1);
            
            // Remove character if its count becomes 0
            if (charCount.get(leftChar) === 0) {
                charCount.delete(leftChar);
            }
            
            left++;
        }
        
        // Update maximum length with current valid window
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Example: s = "eceba", k = 2
// 
// Window "e": {e: 1}, 1 distinct ≤ 2 ✓, maxLength = 1
// Window "ec": {e: 1, c: 1}, 2 distinct ≤ 2 ✓, maxLength = 2
// Window "ece": {e: 2, c: 1}, 2 distinct ≤ 2 ✓, maxLength = 3  
// Window "eceb": {e: 2, c: 1, b: 1}, 3 distinct > 2 ✗, contract:
//   Remove 'e': {e: 1, c: 1, b: 1}, still 3 distinct, contract:
//   Remove 'c': {e: 1, b: 1}, 2 distinct ≤ 2 ✓, maxLength = 3
// Window "ceba": {e: 1, c: 1, b: 1, a: 1}, 4 distinct > 2 ✗, contract until valid
// 
// Final maxLength = 3 (substring "ece")

// Time: O(n) - each character visited at most twice  
// Space: O(k) - hash map stores at most k+1 distinct characters
```

### Problem 5: Subarray Product Less Than K

**Amazon/Microsoft**: "Count subarrays where product of all elements < k."

**Complete Solution**:
```javascript
function numSubarrayProductLessThanK(nums, k) {
    if (k <= 1) return 0; // Product can't be less than k if k ≤ 1
    
    let left = 0;
    let product = 1;
    let count = 0;
    
    for (let right = 0; right < nums.length; right++) {
        // Expand window: multiply by nums[right]
        product *= nums[right];
        
        // Contract window while product >= k
        while (product >= k && left <= right) {
            product /= nums[left];
            left++;
        }
        
        // Count all subarrays ending at right with product < k
        // Number of subarrays = right - left + 1
        count += right - left + 1;
    }
    
    return count;
}

// Why count += right - left + 1 works:
// When window [left, right] has product < k, ALL subarrays ending at right
// within this window also have product < k:
// 
// Example: nums = [10, 5, 2, 6], k = 100, current window = [5, 2]
// Subarrays ending at position 2 (value 2):
// - [2] (just the element at right)  
// - [5, 2] (from left to right)
// Count = right - left + 1 = 2 - 1 + 1 = 2

// Example walkthrough: nums = [10, 5, 2, 6], k = 100
// 
// right=0, nums[0]=10: product=10 < 100, count += 1 (subarray: [10])
// right=1, nums[1]=5: product=50 < 100, count += 2 (subarrays: [5], [10,5])  
// right=2, nums[2]=2: product=100 ≥ 100, contract:
//   Remove 10: product=10, left=1
//   product=10 < 100, count += 2 (subarrays: [2], [5,2])
// right=3, nums[3]=6: product=60 < 100, count += 3 (subarrays: [6], [2,6], [5,2,6])
// 
// Total count = 1 + 2 + 2 + 3 = 8

// Time: O(n) - each element enters and exits window at most once
// Space: O(1) - only variables
```

---

## Sliding Window Patterns and Templates

### Pattern 1: Find Maximum/Minimum in Fixed Window

```javascript
function maxInFixedWindow(arr, k, operation) {
    let windowResult = calculateInitialWindow(arr, k, operation);
    let result = windowResult;
    
    for (let i = k; i < arr.length; i++) {
        // Update window by removing arr[i-k] and adding arr[i]  
        windowResult = updateWindow(windowResult, arr[i-k], arr[i], operation);
        result = Math.max(result, windowResult); // or Math.min
    }
    
    return result;
}

// Examples:
// - Maximum sum of size k subarray
// - Maximum average of size k subarray
// - Minimum sum of size k subarray
```

### Pattern 2: Find Optimal Variable Window

```javascript
function optimalVariableWindow(arr, condition) {
    let left = 0;
    let windowState = {};
    let result = initializeResult();
    
    for (let right = 0; right < arr.length; right++) {
        // Add arr[right] to window
        addToWindow(windowState, arr[right]);
        
        // Contract window while condition violated
        while (violatesCondition(windowState, condition)) {
            removeFromWindow(windowState, arr[left]);
            left++;
        }
        
        // Update result with current window
        updateResult(result, windowState, right - left + 1);
    }
    
    return result;
}

// Examples:
// - Longest substring without repeating characters
// - Longest substring with at most k distinct characters
// - Smallest window containing all characters
```

### Pattern 3: Count Valid Windows

```javascript
function countValidWindows(arr, condition) {
    let left = 0;
    let windowState = {};
    let count = 0;
    
    for (let right = 0; right < arr.length; right++) {
        addToWindow(windowState, arr[right]);
        
        // Contract window while condition violated
        while (violatesCondition(windowState, condition)) {
            removeFromWindow(windowState, arr[left]);
            left++;
        }
        
        // All subarrays ending at right within current window are valid
        count += right - left + 1;
    }
    
    return count;
}

// Examples:
// - Count subarrays with product less than k
// - Count substrings with at most k distinct characters
// - Count binary subarrays with sum equal to goal
```

---

## Advanced Sliding Window Techniques

### 1. Multiple Pointers Sliding Window

```javascript
// For problems requiring more complex window management
function multiPointerWindow(arr, condition) {
    let slow = 0;
    let fast = 0;
    let result = [];
    
    while (fast < arr.length) {
        // Extend window with fast pointer
        
        if (someCondition) {
            // Process current window
            result.push(processWindow(arr, slow, fast));
            slow++;
        }
        
        fast++;
    }
    
    return result;
}
```

### 2. Sliding Window with Deque

```javascript
// For finding maximum/minimum in all windows of size k
function slidingWindowMaximum(nums, k) {
    const deque = []; // Store indices
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside current window
        while (deque.length && deque[0] <= i - k) {
            deque.shift();
        }
        
        // Remove indices of smaller elements (they won't be maximum)
        while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // Add maximum of current window to result
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}
```

### 3. Sliding Window with Hash Map State

```javascript
// Template for complex state tracking
function complexSlidingWindow(s, t) {
    const targetCount = countFrequency(t);
    const windowCount = new Map();
    
    let left = 0;
    let validChars = 0;
    let result = initializeResult();
    
    for (let right = 0; right < s.length; right++) {
        const rightChar = s[right];
        
        // Add to window
        windowCount.set(rightChar, (windowCount.get(rightChar) || 0) + 1);
        
        // Check if this character now has correct frequency
        if (targetCount.has(rightChar) && 
            windowCount.get(rightChar) === targetCount.get(rightChar)) {
            validChars++;
        }
        
        // Contract window when we have all characters
        while (validChars === targetCount.size) {
            updateResult(result, left, right);
            
            const leftChar = s[left];
            windowCount.set(leftChar, windowCount.get(leftChar) - 1);
            
            if (targetCount.has(leftChar) && 
                windowCount.get(leftChar) < targetCount.get(leftChar)) {
                validChars--;
            }
            
            left++;
        }
    }
    
    return result;
}
```

---

## Practice Problems by Difficulty

### Easy Sliding Window Problems
1. **Maximum Sum Subarray of Size K** - Fixed window basics
2. **Average of All Subarrays of Size K** - Fixed window calculation
3. **Maximum Number of Vowels in Substring** (LeetCode 1456) - Fixed window with condition
4. **Contains Duplicate II** (LeetCode 219) - Variable window with hash map
5. **Minimum Difference Between Largest and Smallest Value** - Fixed window min/max

### Medium Sliding Window Problems
1. **Longest Substring Without Repeating Characters** (LeetCode 3) - Variable window expansion/contraction
2. **Longest Substring with At Most K Distinct Characters** (LeetCode 340) - Variable window with counting
3. **Subarrays with K Different Integers** (LeetCode 992) - Complex counting
4. **Max Consecutive Ones III** (LeetCode 1004) - Variable window with constraint
5. **Subarray Product Less Than K** (LeetCode 713) - Variable window counting

### Hard Sliding Window Problems
1. **Minimum Window Substring** (LeetCode 76) - Complex variable window
2. **Sliding Window Maximum** (LeetCode 239) - Deque-based sliding window
3. **Substring with Concatenation of All Words** (LeetCode 30) - Complex pattern matching
4. **Minimum Number of Taps to Water Garden** (LeetCode 1326) - Interval-based sliding window

---

## Common Mistakes and Solutions

### Mistake 1: Not Updating Window State Correctly

```javascript
// Wrong: Forgetting to update window state when contracting
function longestSubstringWrong(s, k) {
    const charCount = new Map();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        charCount.set(s[right], (charCount.get(s[right]) || 0) + 1);
        
        while (charCount.size > k) {
            // ❌ Not updating charCount when removing character
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
}

// Correct: Always update window state consistently
function longestSubstringCorrect(s, k) {
    const charCount = new Map();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        charCount.set(s[right], (charCount.get(s[right]) || 0) + 1);
        
        while (charCount.size > k) {
            const leftChar = s[left];
            charCount.set(leftChar, charCount.get(leftChar) - 1);
            
            // ✅ Remove character from map if count becomes 0
            if (charCount.get(leftChar) === 0) {
                charCount.delete(leftChar);
            }
            
            left++;
        }
        
        maxLength = Math.max(maxLength, right - left + 1);
    }
}
```

### Mistake 2: Incorrect Counting Logic

```javascript
// Wrong: Counting valid windows incorrectly
function countSubarraysWrong(nums, k) {
    let left = 0;
    let product = 1;
    let count = 0;
    
    for (let right = 0; right < nums.length; right++) {
        product *= nums[right];
        
        while (product >= k) {
            product /= nums[left];
            left++;
        }
        
        count++; // ❌ Only counting one subarray per position
    }
    
    return count;
}

// Correct: Count all valid subarrays ending at current position
function countSubarraysCorrect(nums, k) {
    let left = 0;
    let product = 1;
    let count = 0;
    
    for (let right = 0; right < nums.length; right++) {
        product *= nums[right];
        
        while (product >= k) {
            product /= nums[left];
            left++;
        }
        
        // ✅ Count all subarrays ending at right
        count += right - left + 1;
    }
    
    return count;
}
```

### Mistake 3: Inefficient Window Initialization

```javascript
// Wrong: Recalculating entire window each time
function maxSumWindowWrong(nums, k) {
    let maxSum = -Infinity;
    
    for (let i = 0; i <= nums.length - k; i++) {
        let sum = 0;
        // ❌ Recalculating sum for each window
        for (let j = i; j < i + k; j++) {
            sum += nums[j];
        }
        maxSum = Math.max(maxSum, sum);
    }
    
    return maxSum;
}

// Correct: Calculate once, then slide efficiently
function maxSumWindowCorrect(nums, k) {
    let windowSum = 0;
    
    // ✅ Calculate initial window once
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    let maxSum = windowSum;
    
    // ✅ Slide window efficiently
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
```

---

## Success Metrics

### Week 1: Basic Sliding Window Mastery
- [ ] Understand fixed vs variable window patterns
- [ ] Implement maximum sum subarray of size k
- [ ] Solve longest substring without repeating characters
- [ ] Master window expansion and contraction logic

### Week 2: Advanced Window Management
- [ ] Handle complex state tracking with hash maps
- [ ] Solve minimum window substring problems
- [ ] Count valid windows correctly
- [ ] Use sliding window for substring problems

### Week 3: Complex Sliding Window Applications
- [ ] Combine sliding window with other data structures
- [ ] Solve problems with multiple constraints
- [ ] Handle edge cases in window boundary conditions
- [ ] Optimize from brute force using sliding window

### Week 4: Expert Sliding Window Techniques
- [ ] Solve any sliding window problem under time pressure
- [ ] Recognize sliding window opportunities immediately
- [ ] Handle complex counting and optimization problems
- [ ] Ready for any FAANG sliding window interview

**Remember**: Sliding window is about efficient updates, not recalculation. Think about what changes when you move the window and update only that, not the entire window state!