# Cyclic Sort Pattern

## Purpose

The Cyclic Sort pattern is a hidden gem that solves array problems involving numbers in a specific range (usually 1 to n) in O(n) time and O(1) space. It appears in 10% of FAANG interviews but provides elegant solutions to seemingly complex problems about missing numbers, duplicates, and permutations.

**Key Insight**: When array contains numbers in range [1, n], each number has a "correct" position. By cyclically placing each number in its correct position, we can solve many problems in optimal time and space.

---

## What is the Cyclic Sort Pattern?

**Basic Concept**: For array with numbers 1 to n, place each number at index (number - 1). This creates a sorted array where arr[i] = i + 1.

```javascript
// Example: Sort array [3, 1, 5, 4, 2] using cyclic sort
// Target: [1, 2, 3, 4, 5]
// Rule: Number x goes to index (x-1)

function cyclicSort(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1; // Where nums[i] should be
        
        if (nums[i] !== nums[correctIndex]) {
            // Swap nums[i] to its correct position
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++; // nums[i] is in correct position
        }
    }
    
    return nums;
}

// Step by step for [3, 1, 5, 4, 2]:
// i=0: nums[0]=3 should be at index 2, swap with nums[2]=5 → [5, 1, 3, 4, 2]
// i=0: nums[0]=5 should be at index 4, swap with nums[4]=2 → [2, 1, 3, 4, 5]
// i=0: nums[0]=2 should be at index 1, swap with nums[1]=1 → [1, 2, 3, 4, 5]
// i=0: nums[0]=1 is at correct position, i++
// i=1,2,3,4: all elements in correct positions
// Result: [1, 2, 3, 4, 5]
```

**Why Cyclic Sort Works:**
- **Perfect mapping**: Each number has exactly one correct position
- **Efficient swapping**: Each swap places at least one number correctly
- **Optimal complexity**: Each number is moved at most once
- **In-place sorting**: No extra space needed

**When to Use Cyclic Sort:**
- Array contains numbers in range [1, n] or [0, n-1]
- Need to find missing numbers, duplicates, or first missing positive
- Want O(n) time and O(1) space solution
- Problem involves permutations or cyclic arrangements

---

## Cyclic Sort Pattern Variations

### Variation 1: Basic Cyclic Sort

**Pattern**: Sort array containing numbers 1 to n.

```javascript
// Template for basic cyclic sort
function cyclicSort(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    return nums;
}
```

### Variation 2: Find Missing Number

**Pattern**: Use cyclic sort to find what's missing.

```javascript
// Template for finding missing number
function findMissingNumber(nums) {
    let i = 0;
    
    // Cyclic sort
    while (i < nums.length) {
        if (nums[i] < nums.length && nums[i] !== nums[nums[i]]) {
            [nums[i], nums[nums[i]]] = [nums[nums[i]], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find first position where nums[i] !== i
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i) {
            return i;
        }
    }
    
    return nums.length; // All positions filled, missing number is n
}
```

### Variation 3: Find All Duplicates

**Pattern**: After cyclic sort, duplicates are at wrong positions.

```javascript
// Template for finding duplicates
function findDuplicates(nums) {
    let i = 0;
    
    // Cyclic sort
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find numbers at wrong positions
    const duplicates = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            duplicates.push(nums[i]);
        }
    }
    
    return duplicates;
}
```

---

## Real FAANG Interview Problems

### Problem 1: Find Missing Number

**Google/Meta**: "Find missing number in array containing n distinct numbers from 0 to n."

**Complete Solution**:
```javascript
function missingNumber(nums) {
    let i = 0;
    
    // Cyclic sort for range [0, n]
    while (i < nums.length) {
        const correctIndex = nums[i];
        
        // Only swap if number is in valid range and not in correct position
        if (nums[i] < nums.length && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find first position where nums[i] !== i
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i) {
            return i; // This index is missing
        }
    }
    
    return nums.length; // Missing number is n
}

// Alternative O(n) solution without modifying array:
function missingNumberMath(nums) {
    const n = nums.length;
    const expectedSum = n * (n + 1) / 2; // Sum of 0 to n
    const actualSum = nums.reduce((sum, num) => sum + num, 0);
    
    return expectedSum - actualSum;
}

// Alternative using XOR (most elegant):
function missingNumberXOR(nums) {
    let xor = nums.length; // Start with n
    
    for (let i = 0; i < nums.length; i++) {
        xor ^= i ^ nums[i]; // XOR with index and value
    }
    
    return xor;
}

// Example: nums = [3, 0, 1]
// Cyclic sort approach:
// i=0: nums[0]=3 goes to index 3, but array length is 3, so i++
// i=1: nums[1]=0 goes to index 0, swap → [0, 3, 1]
// i=2: nums[2]=1 goes to index 1, swap → [0, 1, 3]
// Check: nums[0]=0 ✓, nums[1]=1 ✓, nums[2]=3 ≠ 2 ✗
// Missing: 2

// Time: O(n), Space: O(1) for cyclic sort
// Time: O(n), Space: O(1) for math and XOR approaches too
```

### Problem 2: Find All Numbers Disappeared in an Array

**Amazon/Apple**: "Find all missing numbers from 1 to n in array."

**Complete Solution**:
```javascript
function findDisappearedNumbers(nums) {
    let i = 0;
    
    // Cyclic sort for range [1, n]
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find all positions where nums[i] !== i + 1
    const missing = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            missing.push(i + 1);
        }
    }
    
    return missing;
}

// Alternative solution without modifying array (using marking):
function findDisappearedNumbersMarking(nums) {
    // Mark presence by making corresponding index negative
    for (let num of nums) {
        const index = Math.abs(num) - 1;
        if (nums[index] > 0) {
            nums[index] = -nums[index];
        }
    }
    
    // Find positive indices (unmarked numbers)
    const missing = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
            missing.push(i + 1);
        }
    }
    
    return missing;
}

// Example: nums = [4, 3, 2, 7, 8, 2, 3, 1]
// Cyclic sort:
// Place 4 at index 3, 3 at index 2, etc.
// After sorting: [1, 2, 3, 4, 3, 2, 7, 8]
// 
// Check positions:
// nums[0] = 1 = 0+1 ✓
// nums[1] = 2 = 1+1 ✓  
// nums[2] = 3 = 2+1 ✓
// nums[3] = 4 = 3+1 ✓
// nums[4] = 3 ≠ 4+1, missing: 5
// nums[5] = 2 ≠ 5+1, missing: 6
// nums[6] = 7 = 6+1 ✓
// nums[7] = 8 = 7+1 ✓
//
// Answer: [5, 6]

// Time: O(n), Space: O(1) not counting output
```

### Problem 3: Find Duplicate Number

**Microsoft/Google**: "Find duplicate number in array of n+1 integers from 1 to n."

**Complete Solution**:
```javascript
function findDuplicate(nums) {
    let i = 0;
    
    // Cyclic sort
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find number at wrong position
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            return nums[i]; // This is the duplicate
        }
    }
    
    return -1; // Should never reach here
}

// Alternative: Floyd's Cycle Detection (most elegant)
function findDuplicateFloyd(nums) {
    // Treat array as linked list: nums[i] points to nums[nums[i]]
    let slow = nums[0];
    let fast = nums[0];
    
    // Phase 1: Find meeting point
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    // Phase 2: Find entrance to cycle (duplicate number)
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}

// Alternative: Binary Search on Answer
function findDuplicateBinarySearch(nums) {
    let left = 1;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Count numbers <= mid
        let count = 0;
        for (let num of nums) {
            if (num <= mid) count++;
        }
        
        // If count > mid, duplicate is in [1, mid]
        if (count > mid) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
}

// Example: nums = [1, 3, 4, 2, 2]
// Cyclic sort approach:
// After sorting: [1, 2, 3, 4, 2]
// Check: nums[4] = 2 ≠ 5, so 2 is duplicate

// Floyd's approach treats this as:
// 0→1→3→2→2 (cycle at 2)

// Time: O(n) for cyclic sort and Floyd's
// Space: O(1) for all approaches
```

### Problem 4: First Missing Positive

**Amazon/Meta**: "Find smallest missing positive integer in unsorted array."

**Complete Solution**:
```javascript
function firstMissingPositive(nums) {
    const n = nums.length;
    let i = 0;
    
    // Cyclic sort for positive numbers in range [1, n]
    while (i < n) {
        const correctIndex = nums[i] - 1;
        
        // Only sort if number is in valid range and not in correct position
        if (nums[i] > 0 && nums[i] <= n && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find first position where nums[i] !== i + 1
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1; // First missing positive
        }
    }
    
    return n + 1; // All positions [1, n] are filled
}

// Alternative solution using marking (more intuitive):
function firstMissingPositiveMarking(nums) {
    const n = nums.length;
    
    // Step 1: Replace non-positive numbers with n+1
    for (let i = 0; i < n; i++) {
        if (nums[i] <= 0) {
            nums[i] = n + 1;
        }
    }
    
    // Step 2: Mark presence by making index negative
    for (let i = 0; i < n; i++) {
        const num = Math.abs(nums[i]);
        if (num <= n) {
            nums[num - 1] = -Math.abs(nums[num - 1]);
        }
    }
    
    // Step 3: Find first positive index
    for (let i = 0; i < n; i++) {
        if (nums[i] > 0) {
            return i + 1;
        }
    }
    
    return n + 1;
}

// Example: nums = [3, 4, -1, 1]
// Cyclic sort approach:
// i=0: 3 goes to index 2, swap → [-1, 4, 3, 1]
// i=0: -1 is negative, skip, i++
// i=1: 4 goes to index 3, swap → [-1, 1, 3, 4]  
// i=1: 1 goes to index 0, swap → [1, -1, 3, 4]
// i=1: -1 is negative, skip, i++
// Continue...
// Final: [1, -1, 3, 4]
// Check: nums[1] = -1 ≠ 2, so answer is 2

// Time: O(n), Space: O(1)
```

### Problem 5: Find All Duplicates in Array

**Facebook/Apple**: "Find all duplicates in array where each element appears once or twice."

**Complete Solution**:
```javascript
function findDuplicates(nums) {
    let i = 0;
    
    // Cyclic sort
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find numbers at wrong positions (duplicates)
    const duplicates = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            duplicates.push(nums[i]);
        }
    }
    
    return duplicates;
}

// Alternative using negative marking (doesn't modify positions):
function findDuplicatesMarking(nums) {
    const duplicates = [];
    
    for (let num of nums) {
        const index = Math.abs(num) - 1;
        
        if (nums[index] < 0) {
            // Already marked, this is duplicate
            duplicates.push(Math.abs(num));
        } else {
            // Mark as seen
            nums[index] = -nums[index];
        }
    }
    
    return duplicates;
}

// Example: nums = [4, 3, 2, 7, 8, 2, 3, 1]
// Cyclic sort places each number at correct position
// Numbers that can't be placed (because position occupied by duplicate)
// are the duplicates

// After cyclic sort: [1, 2, 3, 4, 3, 2, 7, 8]
// Check positions:
// nums[4] = 3 ≠ 5, duplicate: 3
// nums[5] = 2 ≠ 6, duplicate: 2
// Answer: [3, 2]

// Time: O(n), Space: O(1) not counting output
```

---

## Cyclic Sort Templates

### Template 1: Basic Cyclic Sort (Range 1 to n)

```javascript
function cyclicSort(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    return nums;
}
```

### Template 2: Find Missing (Range 0 to n or 1 to n)

```javascript
function findMissing(nums) {
    let i = 0;
    
    // Cyclic sort
    while (i < nums.length) {
        const correctIndex = nums[i]; // or nums[i] - 1 for range [1,n]
        
        if (nums[i] < nums.length && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find missing
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i) { // or nums[i] !== i + 1
            return i; // or i + 1
        }
    }
    
    return nums.length; // or nums.length + 1
}
```

### Template 3: Find Duplicates

```javascript
function findDuplicates(nums) {
    let i = 0;
    
    // Cyclic sort
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find duplicates (numbers at wrong positions)
    const result = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            result.push(nums[i]);
        }
    }
    
    return result;
}
```

---

## Advanced Cyclic Sort Techniques

### 1. Cyclic Sort with Constraints

```javascript
// Handle numbers outside valid range
function cyclicSortConstrained(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const num = nums[i];
        const correctIndex = num - 1;
        
        // Only sort if number is in valid range
        if (num >= 1 && num <= nums.length && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    return nums;
}
```

### 2. Cyclic Sort for Range [0, n]

```javascript
function cyclicSortZeroToN(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i];
        
        // For range [0, n], number x goes to index x
        if (nums[i] < nums.length && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    return nums;
}
```

### 3. Cyclic Sort with Multiple Passes

```javascript
// When need to handle complex constraints
function cyclicSortMultiPass(nums) {
    // Pass 1: Handle positive numbers
    for (let i = 0; i < nums.length; i++) {
        while (nums[i] > 0 && nums[i] <= nums.length && nums[i] !== nums[nums[i] - 1]) {
            const correctIndex = nums[i] - 1;
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        }
    }
    
    // Pass 2: Process results
    const result = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            result.push(i + 1);
        }
    }
    
    return result;
}
```

---

## Practice Problems by Difficulty

### Easy Cyclic Sort Problems
1. **Missing Number** (LeetCode 268) - Basic missing number
2. **Find All Numbers Disappeared** (LeetCode 448) - Multiple missing numbers
3. **Cyclic Sort** (Educational) - Basic sorting with cyclic sort

### Medium Cyclic Sort Problems  
1. **Find Duplicate Number** (LeetCode 287) - Single duplicate
2. **Find All Duplicates** (LeetCode 442) - Multiple duplicates
3. **First Missing Positive** (LeetCode 41) - Constrained range
4. **Set Mismatch** (LeetCode 645) - Find duplicate and missing

### Advanced Cyclic Sort Applications
1. **Find Smallest Missing Positive** - Multiple constraints
2. **K Missing Positive Numbers** - Complex missing pattern
3. **Find Corrupt Pair** - Duplicate and missing together

---

## Common Cyclic Sort Mistakes

### Mistake 1: Wrong Range Handling

```javascript
// Wrong: Not checking if number is in valid range
function findMissingWrong(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        // ❌ nums[i] might be negative or > n
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
}

// Correct: Check valid range first
function findMissingCorrect(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        // ✅ Check if number is in valid range [1, n]
        if (nums[i] >= 1 && nums[i] <= nums.length && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
}
```

### Mistake 2: Infinite Loop in Swapping

```javascript
// Wrong: Can cause infinite loop with duplicates
function cyclicSortWrong(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        // ❌ If nums[i] == nums[correctIndex], infinite swap
        if (correctIndex !== i) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
}

// Correct: Check if swap is needed
function cyclicSortCorrect(nums) {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        // ✅ Only swap if values are different
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
}
```

### Mistake 3: Wrong Index Calculation

```javascript
// Wrong: Off-by-one error in index calculation
function findMissingRangeError(nums) {
    // For range [0, n], number x should be at index x
    // For range [1, n], number x should be at index x-1
    
    let i = 0;
    while (i < nums.length) {
        // ❌ Wrong calculation for range [0, n]
        const correctIndex = nums[i] - 1;
        // Should be: const correctIndex = nums[i];
    }
}
```

---

## Success Metrics

### Week 1: Cyclic Sort Fundamentals
- [ ] Understand the cyclic sort algorithm
- [ ] Implement basic cyclic sort for range [1, n]
- [ ] Solve missing number problems
- [ ] Handle edge cases (empty array, single element)

### Week 2: Advanced Applications
- [ ] Find duplicates using cyclic sort
- [ ] Handle constrained ranges (positive numbers only)
- [ ] Solve first missing positive problem
- [ ] Combine cyclic sort with other techniques

### Week 3: Pattern Recognition
- [ ] Recognize when to use cyclic sort vs other approaches
- [ ] Handle arrays with numbers outside valid range
- [ ] Optimize space usage and avoid array modification
- [ ] Solve complex missing/duplicate problems

### Week 4: Mastery
- [ ] Solve any cyclic sort problem under time pressure
- [ ] Choose between cyclic sort and alternative approaches
- [ ] Debug cyclic sort implementations efficiently
- [ ] Ready for FAANG cyclic sort interviews

**Remember**: Cyclic sort is powerful when array elements have a natural "home" position. Look for problems involving ranges, missing numbers, or duplicates in constrained arrays!