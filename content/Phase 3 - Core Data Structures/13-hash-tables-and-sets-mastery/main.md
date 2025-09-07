# Hash Tables and Sets Mastery

## Purpose

Hash tables (Maps) and Sets are the secret weapons of FAANG interviews. They solve 50%+ of algorithm problems by providing O(1) lookups. As a full-stack developer, you've used objects and Maps - now learn to master them for interviews.

**Key Insight**: Most "impossible" O(n²) problems become simple O(n) solutions with hash tables. They're not just data structures - they're problem-solving tools.

---

## What Are Hash Tables and Sets (From Zero)

### Hash Tables - Lightning Fast Lookups

**What is a hash table?**
A data structure that stores key-value pairs using a hash function to compute storage locations. Think of it like a super-fast dictionary.

```javascript
// In JavaScript, we have several hash table implementations:

// 1. Object (traditional, strings as keys)
const obj = {};
obj['key'] = 'value';
obj.name = 'John';
console.log(obj['key']); // 'value' in O(1) time

// 2. Map (modern, any type as keys)
const map = new Map();
map.set('string', 'value');
map.set(42, 'number key');
map.set(true, 'boolean key');
console.log(map.get('string')); // 'value' in O(1) time

// 3. Set (only keys, no duplicates)
const set = new Set();
set.add('value1');
set.add('value2');
set.add('value1'); // Ignored - no duplicates
console.log(set.has('value1')); // true in O(1) time
```

**How Hash Tables Work Internally:**
```javascript
// Simplified internal representation
// Hash function: converts key → array index

function simpleHash(key, arraySize) {
    let hash = 0;
    for (let char of key) {
        hash = (hash + char.charCodeAt(0)) % arraySize;
    }
    return hash;
}

// Example: "name" → hash(name) → index 3
// Internal array: [empty, empty, empty, {key:"name", value:"John"}, empty]

// This is why lookups are O(1) - direct array access!
```

**Why Hash Tables Are Interview Gold:**
- **Fast lookups**: O(1) average case
- **Fast insertions**: O(1) average case  
- **Fast deletions**: O(1) average case
- **Problem solving**: Turn O(n²) nested loops into O(n) single loops

### Sets - Unique Collections

**What is a Set?**
A collection that stores unique values. Perfect for checking existence and removing duplicates.

```javascript
const numbers = [1, 2, 2, 3, 3, 4];

// Remove duplicates
const uniqueNumbers = [...new Set(numbers)]; // [1, 2, 3, 4]

// Check if element exists
const numberSet = new Set([1, 2, 3, 4, 5]);
console.log(numberSet.has(3)); // true - O(1) lookup
console.log(numberSet.has(10)); // false - O(1) lookup

// Compare with array approach (O(n) lookup)
console.log(numbers.includes(3)); // true - but O(n) time
```

---

## Essential Hash Table Operations

### 1. Map Operations

```javascript
// Creating and basic operations
const map = new Map();

// Insert/Update - O(1)
map.set('apple', 5);
map.set('banana', 3);
map.set('apple', 10); // Updates existing value

// Lookup - O(1) 
console.log(map.get('apple'));    // 10
console.log(map.get('orange'));   // undefined
console.log(map.has('banana'));   // true

// Delete - O(1)
map.delete('banana');
console.log(map.has('banana'));   // false

// Size and Clear
console.log(map.size);   // 1
map.clear();             // Remove all entries

// Iteration
const fruitCount = new Map([['apple', 5], ['banana', 3]]);

// Iterate keys
for (let fruit of fruitCount.keys()) {
    console.log(fruit); // 'apple', 'banana'
}

// Iterate values  
for (let count of fruitCount.values()) {
    console.log(count); // 5, 3
}

// Iterate key-value pairs
for (let [fruit, count] of fruitCount.entries()) {
    console.log(`${fruit}: ${count}`); // 'apple: 5', 'banana: 3'
}
```

### 2. Set Operations

```javascript
// Creating and basic operations
const set = new Set();

// Add - O(1)
set.add('apple');
set.add('banana'); 
set.add('apple'); // Ignored - already exists

// Check existence - O(1)
console.log(set.has('apple'));   // true
console.log(set.has('orange'));  // false

// Delete - O(1)
set.delete('banana');

// Size
console.log(set.size); // 1

// Convert to array
const fruits = [...set]; // ['apple']

// Set operations
const set1 = new Set([1, 2, 3]);
const set2 = new Set([3, 4, 5]);

// Union (combine)
const union = new Set([...set1, ...set2]); // {1, 2, 3, 4, 5}

// Intersection (common elements)
const intersection = new Set(
    [...set1].filter(x => set2.has(x))
); // {3}

// Difference (in set1 but not set2)
const difference = new Set(
    [...set1].filter(x => !set2.has(x))
); // {1, 2}
```

### 3. Object as Hash Table

```javascript
// Objects work as hash tables but with limitations
const hashTable = {};

// Insert - O(1)
hashTable['key1'] = 'value1';
hashTable.key2 = 'value2';

// Lookup - O(1)
console.log(hashTable['key1']); // 'value1'
console.log(hashTable.key2);    // 'value2'

// Check existence
console.log('key1' in hashTable);           // true
console.log(hashTable.hasOwnProperty('key1')); // true

// Delete - O(1)
delete hashTable.key2;

// Iterate
for (let key in hashTable) {
    console.log(`${key}: ${hashTable[key]}`);
}

// Object vs Map differences:
// Object keys: only strings/symbols
// Map keys: any type (objects, numbers, etc.)
// Object has prototype properties
// Map size property available
```

---

## Real FAANG Interview Problems

### Problem 1: Two Sum (Most Common Hash Table Problem)

**Google/Meta/Amazon**: "Given array and target, return indices of two numbers that add up to target."

**Complete Solution with Explanation**:
```javascript
function twoSum(nums, target) {
    // Hash table to store: number → index
    const numToIndex = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const currentNum = nums[i];
        const complement = target - currentNum;
        
        // Check if complement exists in our hash table
        if (numToIndex.has(complement)) {
            // Found pair! Return indices
            return [numToIndex.get(complement), i];
        }
        
        // Store current number and its index
        numToIndex.set(currentNum, i);
    }
    
    return []; // No solution found
}

// Why this works:
// For each number, we need to find if (target - number) exists
// Hash table gives us O(1) lookup instead of O(n) search
// One pass through array = O(n) total time

// Test cases
console.log(twoSum([2, 7, 11, 15], 9));     // [0, 1] (2 + 7 = 9)
console.log(twoSum([3, 2, 4], 6));          // [1, 2] (2 + 4 = 6)
console.log(twoSum([3, 3], 6));             // [0, 1] (3 + 3 = 6)

// Time: O(n) - single pass
// Space: O(n) - hash table storage
```

### Problem 2: Group Anagrams

**Meta/Google**: "Group strings that are anagrams of each other."

**Complete Solution**:
```javascript
function groupAnagrams(strs) {
    // Hash table: sorted_string → array_of_anagrams
    const groups = new Map();
    
    for (let str of strs) {
        // Sort characters to create key
        // Anagrams will have same sorted form
        const sortedStr = str.split('').sort().join('');
        
        // Add to existing group or create new group
        if (!groups.has(sortedStr)) {
            groups.set(sortedStr, []);
        }
        groups.get(sortedStr).push(str);
    }
    
    // Return all groups as array
    return Array.from(groups.values());
}

// Why this works:
// Anagrams have same characters, just different order
// Sorting gives us canonical form: "eat" → "aet", "tea" → "aet"
// Hash table groups strings with same canonical form

// Alternative solution using character frequency
function groupAnagramsFreq(strs) {
    const groups = new Map();
    
    for (let str of strs) {
        // Create frequency signature
        const freq = new Array(26).fill(0);
        for (let char of str) {
            freq[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        
        // Use frequency array as key
        const key = freq.join(',');
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(str);
    }
    
    return Array.from(groups.values());
}

// Test case
const input = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log(groupAnagrams(input)); 
// [["eat","tea","ate"], ["tan","nat"], ["bat"]]

// Time: O(n * m log m) where n = number of strings, m = average string length
// Space: O(n * m) for hash table storage
```

### Problem 3: Longest Consecutive Sequence

**Google/Meta**: "Find length of longest consecutive sequence in unsorted array."

**Complete Solution**:
```javascript
function longestConsecutive(nums) {
    if (nums.length === 0) return 0;
    
    // Put all numbers in set for O(1) lookup
    const numSet = new Set(nums);
    let longestStreak = 0;
    
    for (let num of numSet) {
        // Only start counting from the beginning of sequence
        // If num-1 exists, this num is not the start
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentStreak = 1;
            
            // Count consecutive numbers
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentStreak++;
            }
            
            longestStreak = Math.max(longestStreak, currentStreak);
        }
    }
    
    return longestStreak;
}

// Why this works:
// Set allows O(1) lookup for consecutive numbers
// Key insight: only count from start of sequence (when num-1 doesn't exist)
// This prevents counting the same sequence multiple times

// Brute force would be O(n³):
function longestConsecutiveBrute(nums) {
    let longestStreak = 0;
    
    for (let num of nums) {
        let currentNum = num;
        let currentStreak = 1;
        
        // Count consecutive numbers (O(n) for each lookup)
        while (nums.includes(currentNum + 1)) { // O(n) includes check
            currentNum++;
            currentStreak++;
        }
        
        longestStreak = Math.max(longestStreak, currentStreak);
    }
    
    return longestStreak;
}

// Test cases
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4 (1,2,3,4)
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9

// Time: O(n) - each number visited at most twice  
// Space: O(n) - set storage
```

### Problem 4: Top K Frequent Elements

**Amazon/Meta**: "Find k most frequent elements in array."

**Complete Solution**:
```javascript
function topKFrequent(nums, k) {
    // Step 1: Count frequencies
    const freqMap = new Map();
    for (let num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // Step 2: Sort by frequency and return top k
    return Array.from(freqMap.entries())
        .sort((a, b) => b[1] - a[1])  // Sort by frequency descending
        .slice(0, k)                  // Take top k
        .map(entry => entry[0]);      // Extract just the numbers
}

// Alternative: Bucket sort approach (O(n) time)
function topKFrequentOptimal(nums, k) {
    // Step 1: Count frequencies  
    const freqMap = new Map();
    for (let num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // Step 2: Create buckets for each possible frequency
    const buckets = Array(nums.length + 1).fill().map(() => []);
    
    // Step 3: Put numbers in buckets based on frequency
    for (let [num, freq] of freqMap) {
        buckets[freq].push(num);
    }
    
    // Step 4: Collect top k elements from highest frequency buckets
    const result = [];
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
        result.push(...buckets[i]);
    }
    
    return result.slice(0, k);
}

// Test cases
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1, 2]
console.log(topKFrequent([1], 1));                  // [1]

// Time: O(n log n) for sorting approach, O(n) for bucket approach  
// Space: O(n) for frequency map
```

### Problem 5: Valid Anagram

**Amazon/Apple**: "Check if two strings are anagrams."

**Multiple Solution Approaches**:
```javascript
// Solution 1: Sorting approach
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    // Sort both strings and compare
    const sortedS = s.split('').sort().join('');
    const sortedT = t.split('').sort().join('');
    
    return sortedS === sortedT;
}

// Solution 2: Hash table frequency count
function isAnagramHash(s, t) {
    if (s.length !== t.length) return false;
    
    const charCount = new Map();
    
    // Count characters in first string
    for (let char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    // Subtract characters from second string
    for (let char of t) {
        if (!charCount.has(char)) {
            return false; // Character not in first string
        }
        
        const count = charCount.get(char) - 1;
        if (count === 0) {
            charCount.delete(char);
        } else {
            charCount.set(char, count);
        }
    }
    
    // Should be empty if anagrams
    return charCount.size === 0;
}

// Solution 3: Array frequency (for lowercase English letters only)
function isAnagramArray(s, t) {
    if (s.length !== t.length) return false;
    
    // Use array as hash table (26 letters)
    const freq = new Array(26).fill(0);
    
    for (let i = 0; i < s.length; i++) {
        freq[s.charCodeAt(i) - 'a'.charCodeAt(0)]++; // Increment for s
        freq[t.charCodeAt(i) - 'a'.charCodeAt(0)]--; // Decrement for t
    }
    
    // All frequencies should be 0
    return freq.every(count => count === 0);
}

// Test cases
console.log(isAnagram("anagram", "nagaram")); // true
console.log(isAnagram("rat", "car"));         // false

// Time: O(n log n) for sorting, O(n) for hash table
// Space: O(1) for array approach (constant 26), O(k) for hash table where k = unique characters
```

---

## Common Hash Table Patterns

### Pattern 1: Frequency Counter

**When to use**: Count occurrences, find duplicates, character analysis
```javascript
// Template for frequency counting
function frequencyPattern(arr) {
    const freq = new Map();
    
    // Count frequencies
    for (let item of arr) {
        freq.set(item, (freq.get(item) || 0) + 1);
    }
    
    // Process based on frequencies
    for (let [item, count] of freq) {
        // Do something with item and its count
    }
    
    return result;
}

// Examples:
// - Find first non-repeating character
// - Find most frequent element  
// - Check if array has duplicates
```

### Pattern 2: Fast Lookup

**When to use**: Replace O(n) searches with O(1) lookups
```javascript
// Template for fast lookups
function fastLookupPattern(arr, targets) {
    const lookupSet = new Set(arr); // or Map for key-value
    
    const result = [];
    for (let target of targets) {
        if (lookupSet.has(target)) {
            result.push(target);
        }
    }
    
    return result;
}

// Examples:  
// - Two Sum problem
// - Intersection of arrays
// - Check if elements exist
```

### Pattern 3: Grouping

**When to use**: Group related items together
```javascript
// Template for grouping
function groupingPattern(items, getKey) {
    const groups = new Map();
    
    for (let item of items) {
        const key = getKey(item);
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(item);
    }
    
    return Array.from(groups.values());
}

// Examples:
// - Group anagrams  
// - Group by category
// - Partition array by condition
```

### Pattern 4: Complement Finding

**When to use**: Find pairs that satisfy a condition
```javascript
// Template for finding complements
function complementPattern(arr, target) {
    const seen = new Set();
    const pairs = [];
    
    for (let item of arr) {
        const complement = target - item; // or other relationship
        
        if (seen.has(complement)) {
            pairs.push([complement, item]);
        }
        
        seen.add(item);
    }
    
    return pairs;
}

// Examples:
// - Two Sum variations
// - Find pairs with given sum
// - Complement in different context
```

---

## Practice Problems by Difficulty

### Easy Hash Table Problems (Start Here)
1. **Two Sum** (LeetCode 1) - Basic hash table usage
2. **Valid Anagram** (LeetCode 242) - Frequency counting
3. **Contains Duplicate** (LeetCode 217) - Set for uniqueness
4. **Intersection of Two Arrays** (LeetCode 349) - Set operations
5. **First Unique Character** (LeetCode 387) - Frequency analysis

### Medium Hash Table Problems
1. **Group Anagrams** (LeetCode 49) - Grouping pattern
2. **Top K Frequent Elements** (LeetCode 347) - Frequency + sorting
3. **Longest Consecutive Sequence** (LeetCode 128) - Advanced set usage
4. **4Sum II** (LeetCode 454) - Multiple hash tables
5. **Subarray Sum Equals K** (LeetCode 560) - Prefix sum + hash table

### Advanced Hash Table Problems
1. **LRU Cache** (LeetCode 146) - Hash table + doubly linked list
2. **Design Twitter** (LeetCode 355) - Multiple data structures
3. **Word Pattern** (LeetCode 290) - Bijection mapping

---

## Time and Space Complexity Guide

### Hash Table Operations

| Operation | Average Case | Worst Case | Notes |
|-----------|--------------|------------|-------|
| Insert    | O(1)        | O(n)       | Worst case with many collisions |
| Lookup    | O(1)        | O(n)       | Usually O(1) with good hash function |
| Delete    | O(1)        | O(n)       | Same as lookup |
| Iteration | O(n)        | O(n)       | Must visit all elements |

### Set Operations

| Operation | Time | Notes |
|-----------|------|-------|
| Add       | O(1) | Average case |
| Has       | O(1) | Average case |
| Delete    | O(1) | Average case |
| Size      | O(1) | Property access |
| Union     | O(n+m) | Combine two sets |
| Intersection | O(min(n,m)) | Common elements |

### Common Problem Complexities

| Problem Type | Without Hash Table | With Hash Table |
|--------------|-------------------|-----------------|
| Two Sum      | O(n²)            | O(n)           |
| Find Duplicates | O(n²)         | O(n)           |
| Group Items  | O(n² log n)      | O(n)           |
| Frequency Count | O(n log n)    | O(n)           |

---

## Common Mistakes and Solutions

### Mistake 1: Using Array Instead of Hash Table
```javascript
// Wrong: O(n) lookup for each element = O(n²) total
function findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) { // O(n²)
            if (arr[i] === arr[j]) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}

// Correct: O(1) lookup with hash table = O(n) total
function findDuplicatesOptimal(arr) {
    const seen = new Set();
    const duplicates = new Set();
    
    for (let num of arr) { // O(n)
        if (seen.has(num)) { // O(1)
            duplicates.add(num);
        } else {
            seen.add(num);
        }
    }
    
    return Array.from(duplicates);
}
```

### Mistake 2: Not Handling Edge Cases
```javascript
// Wrong: Doesn't handle undefined values
function twoSumBuggy(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.get(complement)) { // ❌ get() returns undefined for missing keys
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
}

// Correct: Use has() to check existence
function twoSumCorrect(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) { // ✅ Properly checks existence
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
}
```

### Mistake 3: Modifying Collection While Iterating
```javascript
// Wrong: Modifying set during iteration
function removeDuplicates(arr) {
    const set = new Set(arr);
    for (let item of set) {
        if (someCondition(item)) {
            set.delete(item); // ❌ Modifying during iteration
        }
    }
    return Array.from(set);
}

// Correct: Collect items to remove, then remove them
function removeDuplicatesCorrect(arr) {
    const set = new Set(arr);
    const toRemove = [];
    
    for (let item of set) {
        if (someCondition(item)) {
            toRemove.push(item);
        }
    }
    
    for (let item of toRemove) {
        set.delete(item);
    }
    
    return Array.from(set);
}
```

---

## Success Metrics

### Week 1: Hash Table Fundamentals
- [ ] Understand difference between Map, Set, and Object
- [ ] Comfortable with basic operations (get, set, has, delete)
- [ ] Recognize when to use hash table vs array
- [ ] Solve 5+ easy hash table problems

### Week 2: Pattern Recognition
- [ ] Master frequency counting pattern
- [ ] Use hash tables for fast lookups automatically
- [ ] Understand complement finding technique
- [ ] Solve 10+ problems using hash table patterns

### Week 3: Complex Problem Solving
- [ ] Combine hash tables with other data structures
- [ ] Handle edge cases (null, undefined, duplicates)
- [ ] Optimize time complexity using hash tables
- [ ] Solve medium-level hash table problems

### Week 4: Interview Mastery
- [ ] Choose optimal hash table approach for any problem
- [ ] Explain time/space complexity trade-offs
- [ ] Handle follow-up questions about hash collisions
- [ ] Ready for FAANG hash table interviews

**Remember**: Hash tables turn "searching" problems into "looking up" problems. Master this mindset shift!