# Arrays and Strings Complete Guide

## Purpose

This is your foundation for all algorithmic thinking. Arrays and strings are the building blocks of most coding problems. Master these, and you'll solve 60% of FAANG interview questions.

**Key Insight**: Every complex data structure is built on arrays. Understanding arrays deeply makes everything else easier.

---

## What Are Arrays and Strings (From Zero)

### Arrays - The Foundation

**What is an array?**
An array is a collection of elements stored in contiguous memory locations. Think of it like numbered boxes in a row.

```javascript
// Visual representation
Array: [5, 2, 8, 1, 9]
Index:  0  1  2  3  4

Memory: [5][2][8][1][9]
Address: 1000 1004 1008 1012 1016
         ↑
      start address
```

**Why arrays matter:**
- **Random Access**: Get any element in O(1) time using index
- **Cache Friendly**: Elements stored together, faster memory access
- **Foundation**: Most data structures use arrays internally

**Basic Operations:**
```javascript
// Creating arrays
let arr = [1, 2, 3, 4, 5];           // Literal creation
let arr2 = new Array(5);             // Create array of size 5
let arr3 = Array.from({length: 5});  // Create array with undefined values

// Accessing elements - O(1) time
console.log(arr[0]);     // First element: 1
console.log(arr[4]);     // Last element: 5
console.log(arr.length); // Length: 5

// Modifying elements - O(1) time  
arr[2] = 10;             // Change third element
console.log(arr);        // [1, 2, 10, 4, 5]
```

### Strings - Arrays of Characters

**What is a string?**
A string is essentially an array of characters. In JavaScript, strings are immutable (cannot be changed directly).

```javascript
// Visual representation
String: "hello"
Index:   0 1 2 3 4
Chars:  [h][e][l][l][o]
```

**Key Difference from Arrays:**
```javascript
// Arrays are mutable
let arr = [1, 2, 3];
arr[1] = 5;              // Works: [1, 5, 3]

// Strings are immutable in JavaScript
let str = "hello";
str[1] = 'a';            // Doesn't work: still "hello"
str = str.replace('e', 'a'); // Must create new string: "hallo"
```

---

## Essential Array Operations

### 1. Traversal (Visiting Each Element)

**Basic Loop - O(n) time**:
```javascript
function printAllElements(arr) {
    // Visit each element once
    for (let i = 0; i < arr.length; i++) {
        console.log(`Element at index ${i}: ${arr[i]}`);
    }
}

// Modern JavaScript alternatives
arr.forEach((element, index) => {
    console.log(`Element at index ${index}: ${element}`);
});

// For-of loop (when you don't need index)
for (let element of arr) {
    console.log(element);
}
```

### 2. Searching (Finding Elements)

**Linear Search - O(n) time**:
```javascript
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;  // Found at index i
        }
    }
    return -1;  // Not found
}

// Built-in methods
arr.indexOf(target);     // Returns index or -1
arr.includes(target);    // Returns true/false
arr.find(x => x > 5);    // Returns first element > 5
arr.findIndex(x => x > 5); // Returns index of first element > 5
```

**Binary Search - O(log n) time** (only works on sorted arrays):
```javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;  // Found
        } else if (arr[mid] < target) {
            left = mid + 1;  // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1;  // Not found
}
```

### 3. Insertion (Adding Elements)

**Add to End - O(1) time**:
```javascript
let arr = [1, 2, 3];
arr.push(4);           // [1, 2, 3, 4]
arr[arr.length] = 5;   // [1, 2, 3, 4, 5]
```

**Add to Beginning - O(n) time** (must shift all elements):
```javascript
let arr = [1, 2, 3];
arr.unshift(0);        // [0, 1, 2, 3]
```

**Add at Specific Index - O(n) time**:
```javascript
let arr = [1, 2, 4, 5];
arr.splice(2, 0, 3);   // Insert 3 at index 2: [1, 2, 3, 4, 5]
//         ↑  ↑  ↑
//      index delete_count new_element
```

### 4. Deletion (Removing Elements)

**Remove from End - O(1) time**:
```javascript
let arr = [1, 2, 3, 4];
let removed = arr.pop();  // removed = 4, arr = [1, 2, 3]
```

**Remove from Beginning - O(n) time**:
```javascript
let arr = [1, 2, 3, 4];
let removed = arr.shift(); // removed = 1, arr = [2, 3, 4]
```

**Remove from Specific Index - O(n) time**:
```javascript
let arr = [1, 2, 3, 4, 5];
arr.splice(2, 1);      // Remove 1 element at index 2: [1, 2, 4, 5]
```

---

## Essential String Operations

### 1. String Traversal

```javascript
function printAllCharacters(str) {
    for (let i = 0; i < str.length; i++) {
        console.log(`Character at index ${i}: ${str[i]}`);
    }
}

// Modern alternatives
for (let char of str) {
    console.log(char);
}

str.split('').forEach((char, index) => {
    console.log(`Character at index ${index}: ${char}`);
});
```

### 2. String Searching

```javascript
let str = "hello world";

str.indexOf('world');      // 6 (index where 'world' starts)
str.includes('hello');     // true
str.startsWith('hello');   // true
str.endsWith('world');     // true
str.search(/wor/);         // 6 (regex search)
```

### 3. String Manipulation (Creates New Strings)

```javascript
let str = "hello";

// Concatenation
str + " world";            // "hello world"
str.concat(" world");      // "hello world"

// Substring extraction
str.slice(1, 4);           // "ell" (from index 1 to 3)
str.substring(1, 4);       // "ell" (similar to slice)
str.substr(1, 3);          // "ell" (start at 1, take 3 chars)

// Case manipulation
str.toLowerCase();         // "hello"
str.toUpperCase();         // "HELLO"

// Replacement
str.replace('l', 'x');     // "hexlo" (replaces first 'l')
str.replaceAll('l', 'x');  // "hexxo" (replaces all 'l')

// Splitting
"hello,world".split(',');  // ["hello", "world"]
"hello".split('');         // ["h", "e", "l", "l", "o"]
```

---

## Real FAANG Interview Problems

### Problem 1: Two Sum (Most Common Array Problem)

**Google/Meta/Amazon**: "Given an array of integers, return indices of two numbers that add up to a target."

**Complete Solution with Explanation**:
```javascript
function twoSum(nums, target) {
    // Hash map to store number -> index mapping
    const numToIndex = new Map();
    
    // One pass through the array
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // Check if complement exists
        if (numToIndex.has(complement)) {
            return [numToIndex.get(complement), i];
        }
        
        // Store current number and its index
        numToIndex.set(nums[i], i);
    }
    
    return []; // No solution found
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9));  // [0, 1] because 2 + 7 = 9
console.log(twoSum([3, 2, 4], 6));       // [1, 2] because 2 + 4 = 6

// Time: O(n) - one pass through array
// Space: O(n) - hash map storage
```

### Problem 2: Valid Palindrome (String Problem)

**Google/Apple**: "Check if a string is a palindrome, ignoring spaces and case."

**Complete Solution with Explanation**:
```javascript
function isPalindrome(s) {
    // Clean the string: remove non-alphanumeric and convert to lowercase
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Two pointers from both ends
    let left = 0;
    let right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car"));                     // false

// Time: O(n) - one pass to clean, one pass to check
// Space: O(n) - cleaned string storage
```

### Problem 3: Best Time to Buy and Sell Stock

**Amazon/Meta**: "Find maximum profit from buying and selling stock once."

**Complete Solution with Explanation**:
```javascript
function maxProfit(prices) {
    if (prices.length < 2) return 0;
    
    let minPrice = prices[0];    // Minimum price seen so far
    let maxProfit = 0;           // Maximum profit possible
    
    for (let i = 1; i < prices.length; i++) {
        // If current price is lower, update minimum
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } 
        // Otherwise, check if selling today gives better profit
        else {
            const profit = prices[i] - minPrice;
            maxProfit = Math.max(maxProfit, profit);
        }
    }
    
    return maxProfit;
}

// Test cases
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5 (buy at 1, sell at 6)
console.log(maxProfit([7, 6, 4, 3, 1]));    // 0 (no profit possible)

// Time: O(n) - one pass through prices
// Space: O(1) - only using two variables
```

### Problem 4: Longest Substring Without Repeating Characters

**Google/Meta**: "Find length of longest substring without repeating characters."

**Complete Solution with Explanation**:
```javascript
function lengthOfLongestSubstring(s) {
    const charSet = new Set();  // Track characters in current window
    let left = 0;               // Left boundary of window
    let maxLength = 0;          // Maximum length found
    
    for (let right = 0; right < s.length; right++) {
        // Shrink window until no duplicates
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        // Add current character and update max length
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb"));    // 1 ("b")
console.log(lengthOfLongestSubstring("pwwkew"));   // 3 ("wke")

// Time: O(n) - each character visited at most twice
// Space: O(min(m, n)) - set size limited by character set
```

---

## Common Array/String Patterns

### Pattern 1: Two Pointers

**When to use**: Sorted array, find pairs, palindromes
```javascript
// Template for two pointers
function twoPointersTemplate(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        // Check condition
        if (condition) {
            // Found answer or process
            return result;
        } else if (needMoveLeft) {
            left++;
        } else {
            right--;
        }
    }
    
    return defaultResult;
}
```

### Pattern 2: Sliding Window

**When to use**: Subarray/substring problems, find longest/shortest
```javascript
// Template for sliding window
function slidingWindowTemplate(arr, k) {
    let windowStart = 0;
    let maxValue = 0;
    let windowSum = 0;
    
    for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
        windowSum += arr[windowEnd];  // Add to window
        
        // Shrink window if needed
        while (windowCondition) {
            windowSum -= arr[windowStart];
            windowStart++;
        }
        
        maxValue = Math.max(maxValue, windowSum);
    }
    
    return maxValue;
}
```

### Pattern 3: Hash Map for Fast Lookups

**When to use**: Need to remember what you've seen, count frequencies
```javascript
// Template for hash map usage
function hashMapTemplate(arr) {
    const map = new Map();
    
    for (let element of arr) {
        // Check if we've seen this element
        if (map.has(element)) {
            // Process based on previous occurrence
        }
        
        // Store/update element information
        map.set(element, someValue);
    }
    
    return result;
}
```

---

## Practice Problems by Difficulty

### Easy Problems (Start Here)
1. **Two Sum** (LeetCode 1) - Hash map pattern
2. **Best Time to Buy and Sell Stock** (LeetCode 121) - Single pass
3. **Valid Palindrome** (LeetCode 125) - Two pointers
4. **Remove Duplicates from Sorted Array** (LeetCode 26) - Two pointers
5. **Merge Sorted Array** (LeetCode 88) - Two pointers from end

### Medium Problems (After Easy Mastery)
1. **Longest Substring Without Repeating Characters** (LeetCode 3) - Sliding window
2. **3Sum** (LeetCode 15) - Two pointers with sorting
3. **Container With Most Water** (LeetCode 11) - Two pointers
4. **Group Anagrams** (LeetCode 49) - Hash map with sorting
5. **Product of Array Except Self** (LeetCode 238) - Prefix/suffix products

### Hard Problems (Advanced)
1. **Minimum Window Substring** (LeetCode 76) - Advanced sliding window
2. **Trapping Rain Water** (LeetCode 42) - Two pointers or stack
3. **Sliding Window Maximum** (LeetCode 239) - Deque data structure

---

## Common Mistakes and How to Avoid Them

### Mistake 1: Off-by-One Errors
```javascript
// Wrong: Missing last element
for (let i = 0; i < arr.length - 1; i++) {  // ❌
    process(arr[i]);
}

// Correct: Include all elements
for (let i = 0; i < arr.length; i++) {      // ✅
    process(arr[i]);
}
```

### Mistake 2: Modifying Array While Iterating
```javascript
// Wrong: Modifying during iteration
for (let i = 0; i < arr.length; i++) {     // ❌
    if (arr[i] < 0) {
        arr.splice(i, 1);  // Changes array size during iteration
    }
}

// Correct: Iterate backwards or use filter
for (let i = arr.length - 1; i >= 0; i--) { // ✅
    if (arr[i] < 0) {
        arr.splice(i, 1);
    }
}

// Or better: Use filter for new array
arr = arr.filter(x => x >= 0);              // ✅
```

### Mistake 3: Forgetting String Immutability
```javascript
// Wrong: Trying to modify string directly
str[0] = 'A';  // ❌ Doesn't work in JavaScript

// Correct: Create new string
str = 'A' + str.slice(1);  // ✅
```

---

## Success Metrics

### Week 1: Basic Understanding
- [ ] Understand what arrays and strings are internally
- [ ] Can perform basic operations (access, modify, traverse)
- [ ] Solve 5+ easy array problems

### Week 2: Pattern Recognition
- [ ] Recognize when to use two pointers vs sliding window
- [ ] Comfortable with hash map for lookups
- [ ] Solve 10+ easy problems across all patterns

### Week 3: Problem Solving Fluency
- [ ] Can solve most easy problems without hints
- [ ] Beginning to tackle medium difficulty problems
- [ ] Understanding time/space complexity for all solutions

### Week 4: Interview Readiness
- [ ] Solve medium problems with confidence
- [ ] Can explain solutions clearly while coding
- [ ] Ready for real array/string interview questions

**Remember**: Arrays and strings are your foundation. Spend time here to make everything else easier!