# Searching Algorithms Master Guide

## Purpose

Searching is one of the most fundamental operations in computer science and appears in 40% of FAANG interviews. Binary search alone can optimize solutions from O(n) to O(log n), making "impossible" problems suddenly feasible.

**Key Insight**: Searching isn't just about finding elements - it's about eliminating possibilities efficiently. Master these patterns to solve optimization, boundary-finding, and complex decision problems.

---

## Why Searching Matters in Interviews

**Real-World Applications You Know:**
- **Google Search**: Finding relevant results from billions of pages
- **Database Indexes**: Quickly locating records
- **Auto-complete**: Finding suggestions as you type
- **Load Balancing**: Finding optimal server

**Interview Applications:**
- **Find Peak Element**: Binary search on unsorted data
- **Search in Rotated Array**: Modified binary search
- **Find Minimum in Rotated Sorted Array**: Boundary detection
- **Koko Eating Bananas**: Binary search on answer space

---

## Fundamental Searching Algorithms

### 1. Linear Search - The Foundation

**How it works**: Check every element one by one until found or end reached.

```javascript
function linearSearch(arr, target) {
    // Check each element from start to end
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Found at index i
        }
    }
    
    return -1; // Not found
}

// Example walkthrough: arr = [4, 2, 7, 1, 9], target = 7
// i=0: arr[0] = 4 ≠ 7, continue
// i=1: arr[1] = 2 ≠ 7, continue  
// i=2: arr[2] = 7 = 7, return 2

// Time Complexity: O(n) - might check every element
// Space Complexity: O(1) - only using index variable
// Use case: Unsorted data, small datasets, one-time searches
```

**Linear Search Variations:**
```javascript
// Find all occurrences
function findAllOccurrences(arr, target) {
    const indices = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            indices.push(i);
        }
    }
    return indices;
}

// Find first element satisfying condition
function findFirst(arr, condition) {
    for (let i = 0; i < arr.length; i++) {
        if (condition(arr[i])) {
            return i;
        }
    }
    return -1;
}

// Example: Find first even number
const firstEven = findFirst([1, 3, 4, 6, 8], x => x % 2 === 0); // Returns 2 (index of 4)
```

### 2. Binary Search - The Game Changer

**How it works**: Divide sorted array in half repeatedly, eliminate half based on comparison.

```javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        // Find middle point (avoid overflow)
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Found
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Not found
}

// Example walkthrough: arr = [1, 3, 5, 7, 9, 11], target = 7
// Initial: left=0, right=5
// Iteration 1: mid=2, arr[2]=5 < 7, search right half, left=3
// Iteration 2: mid=4, arr[4]=9 > 7, search left half, right=3  
// Iteration 3: mid=3, arr[3]=7 = 7, return 3

// Why it works: Each comparison eliminates half the remaining elements
// Time Complexity: O(log n) - halves search space each time
// Space Complexity: O(1) - only using variables
// Requirement: Array must be sorted
```

**Binary Search Template (Most Important Pattern):**
```javascript
// Template for binary search problems
function binarySearchTemplate(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (condition(mid)) {
            // Found answer or potential answer
            return mid; // or continue searching for better answer
        } else if (shouldSearchLeft) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    
    return -1; // or left, or right, depending on problem
}

// Key decisions for any binary search:
// 1. What are left and right boundaries?
// 2. What is the condition to check at mid?
// 3. How to update left and right based on condition?
// 4. What to return when not found?
```

### 3. Binary Search Variations

**Find First Occurrence:**
```javascript
function findFirst(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid; // Potential answer
            right = mid - 1; // Continue searching left for first occurrence
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// Example: arr = [1, 2, 2, 2, 3, 4], target = 2
// Standard binary search might return index 1, 2, or 3
// This function always returns index 1 (first occurrence)
```

**Find Last Occurrence:**
```javascript
function findLast(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid; // Potential answer
            left = mid + 1; // Continue searching right for last occurrence
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}
```

**Find Insertion Point:**
```javascript
function findInsertionPoint(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return left; // Insert position to maintain sorted order
}

// Example: arr = [1, 3, 5, 7], target = 4
// Returns 2 (insert 4 at index 2 to get [1, 3, 4, 5, 7])
```

---

## Real FAANG Interview Problems

### Problem 1: Search in Rotated Sorted Array

**Google/Amazon**: "Search for target in rotated sorted array."

**Complete Solution**:
```javascript
function search(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1; // Target in left half
            } else {
                left = mid + 1;  // Target in right half
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;  // Target in right half
            } else {
                right = mid - 1; // Target in left half
            }
        }
    }
    
    return -1;
}

// Why this works:
// In rotated array, at least one half is always properly sorted
// We identify the sorted half and check if target lies within its range
// If yes, search that half; otherwise, search the other half

// Example: nums = [4,5,6,7,0,1,2], target = 0
// Visual: [4,5,6,7,0,1,2] - rotated at index 4
//          ↑ sorted  ↑ sorted
// 
// mid=3, nums[3]=7, nums[0]=4 ≤ nums[3]=7 (left half sorted)
// target=0 not in [4,7] range, search right half
// Continue with [0,1,2]...

// Time: O(log n) - binary search
// Space: O(1) - only variables
```

### Problem 2: Find Minimum in Rotated Sorted Array

**Meta/Apple**: "Find minimum element in rotated sorted array."

**Complete Solution**:
```javascript
function findMin(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Compare mid with right to determine which half contains minimum
        if (nums[mid] > nums[right]) {
            // Minimum is in right half (including mid+1 to right)
            left = mid + 1;
        } else {
            // Minimum is in left half (including left to mid)
            right = mid;
        }
    }
    
    return nums[left]; // left === right when loop ends
}

// Key insight: Compare mid with right boundary, not left
// This handles all rotation cases correctly

// Example: nums = [4,5,6,7,0,1,2]
// 
// left=0, right=6, mid=3
// nums[3]=7 > nums[6]=2, minimum in right half, left=4
//
// left=4, right=6, mid=5  
// nums[5]=1 < nums[6]=2, minimum in left half, right=5
//
// left=4, right=5, mid=4
// nums[4]=0 < nums[5]=1, minimum in left half, right=4
//
// left=4, right=4, exit loop, return nums[4]=0

// Edge cases handled:
// - No rotation: [1,2,3,4] → returns 1
// - Single element: [5] → returns 5
// - Two elements: [2,1] → returns 1

// Time: O(log n)
// Space: O(1)
```

### Problem 3: Find Peak Element

**Microsoft/Google**: "Find peak element (greater than neighbors) in array."

**Complete Solution**:
```javascript
function findPeakElement(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Compare with right neighbor to determine direction
        if (nums[mid] > nums[mid + 1]) {
            // Peak is on left side (including mid)
            right = mid;
        } else {
            // Peak is on right side (excluding mid)
            left = mid + 1;
        }
    }
    
    return left; // left === right, pointing to peak
}

// Why this works:
// - Array boundaries are treated as negative infinity
// - If nums[mid] > nums[mid+1], peak must be on left (including mid)
// - If nums[mid] < nums[mid+1], we can move right to find higher element
// - Eventually we'll find a peak (guaranteed to exist)

// Example: nums = [1,2,3,1]
// 
// left=0, right=3, mid=1
// nums[1]=2 < nums[2]=3, move right, left=2
//
// left=2, right=3, mid=2  
// nums[2]=3 > nums[3]=1, peak on left, right=2
//
// left=2, right=2, exit loop, return 2 (nums[2]=3 is peak)

// Works even with multiple peaks - finds any one of them

// Time: O(log n) - binary search
// Space: O(1) - only variables
```

### Problem 4: Koko Eating Bananas

**Google/Facebook**: "Find minimum eating speed to finish bananas in H hours."

**Complete Solution**:
```javascript
function minEatingSpeed(piles, h) {
    // Binary search on the answer space (eating speed)
    let left = 1; // Minimum possible speed
    let right = Math.max(...piles); // Maximum possible speed
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Calculate time needed at this speed
        const hoursNeeded = calculateHours(piles, mid);
        
        if (hoursNeeded <= h) {
            // This speed works, try slower speed
            right = mid;
        } else {
            // This speed too slow, need faster speed
            left = mid + 1;
        }
    }
    
    return left;
}

function calculateHours(piles, speed) {
    let hours = 0;
    for (let pile of piles) {
        // Ceiling division: Math.ceil(pile / speed)
        hours += Math.ceil(pile / speed);
    }
    return hours;
}

// Key insight: Binary search on answer space, not array indices
// We're searching for minimum speed, not element in array

// Example: piles = [3,6,7,11], h = 8
// 
// Speed range: [1, 11] (1 to max pile size)
// 
// Try speed 6: hours = ceil(3/6) + ceil(6/6) + ceil(7/6) + ceil(11/6) 
//                   = 1 + 1 + 2 + 2 = 6 ≤ 8 ✓ (try slower)
//
// Try speed 3: hours = ceil(3/3) + ceil(6/3) + ceil(7/3) + ceil(11/3)
//                   = 1 + 2 + 3 + 4 = 10 > 8 ✗ (too slow)
//
// Try speed 4: hours = ceil(3/4) + ceil(6/4) + ceil(7/4) + ceil(11/4)
//                   = 1 + 2 + 2 + 3 = 8 ≤ 8 ✓
//
// Answer: 4 (minimum speed to finish in 8 hours)

// Time: O(n * log(max_pile)) where n = number of piles
// Space: O(1) - only variables
```

### Problem 5: Search a 2D Matrix

**Amazon/Microsoft**: "Search target in row-wise and column-wise sorted matrix."

**Multiple Solution Approaches**:
```javascript
// Solution 1: Treat as 1D sorted array
function searchMatrix(matrix, target) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return false;
    }
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    let left = 0;
    let right = rows * cols - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // Convert 1D index to 2D coordinates
        const row = Math.floor(mid / cols);
        const col = mid % cols;
        const midValue = matrix[row][col];
        
        if (midValue === target) {
            return true;
        } else if (midValue < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}

// Solution 2: Start from top-right corner (staircase search)
function searchMatrixStaircase(matrix, target) {
    if (!matrix || matrix.length === 0) return false;
    
    let row = 0;
    let col = matrix[0].length - 1;
    
    while (row < matrix.length && col >= 0) {
        const current = matrix[row][col];
        
        if (current === target) {
            return true;
        } else if (current > target) {
            col--; // Move left (smaller values)
        } else {
            row++; // Move down (larger values)
        }
    }
    
    return false;
}

// Example matrix:
// [1,  4,  7, 11]
// [2,  5,  8, 12]  
// [3,  6,  9, 16]
// [10,13, 14, 17]

// Staircase search for target = 5:
// Start at (0,3): matrix[0][3] = 11 > 5, move left
// At (0,2): matrix[0][2] = 7 > 5, move left  
// At (0,1): matrix[0][1] = 4 < 5, move down
// At (1,1): matrix[1][1] = 5 = 5, found!

// Time: O(log(m*n)) for binary search, O(m+n) for staircase
// Space: O(1) for both approaches
```

---

## Binary Search on Answer Space

### Pattern: When to Use

**Problem Characteristics:**
- Looking for optimal value (minimum/maximum)
- Can verify if value X works in reasonable time
- If value X works, all values greater than X also work (or vice versa)
- Answer space has clear boundaries

**Template:**
```javascript
function binarySearchOnAnswer(problem_params) {
    let left = min_possible_answer;
    let right = max_possible_answer;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canAchieve(problem_params, mid)) {
            right = mid; // mid works, try smaller
        } else {
            left = mid + 1; // mid doesn't work, try larger
        }
    }
    
    return left;
}

function canAchieve(problem_params, candidate) {
    // Check if candidate answer is feasible
    // Return true/false
}
```

**Real Examples:**
1. **Koko Eating Bananas**: Search for minimum eating speed
2. **Split Array Largest Sum**: Search for minimum possible maximum sum
3. **Capacity to Ship Packages**: Search for minimum ship capacity
4. **Minimum Days to Make m Bouquets**: Search for minimum days

### Advanced Example: Split Array Largest Sum

```javascript
function splitArray(nums, m) {
    // Binary search on answer space: [max(nums), sum(nums)]
    let left = Math.max(...nums); // Minimum possible largest sum
    let right = nums.reduce((sum, num) => sum + num, 0); // Maximum possible
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canSplit(nums, m, mid)) {
            right = mid; // This maximum works, try smaller
        } else {
            left = mid + 1; // This maximum too small
        }
    }
    
    return left;
}

function canSplit(nums, m, maxSum) {
    let currentSum = 0;
    let splits = 1;
    
    for (let num of nums) {
        if (currentSum + num > maxSum) {
            splits++;
            currentSum = num;
            
            if (splits > m) {
                return false; // Need more than m splits
            }
        } else {
            currentSum += num;
        }
    }
    
    return true; // Can split within m groups
}

// Example: nums = [7,2,5,10,8], m = 2
// Answer space: [10, 32] (min: largest element, max: total sum)
// 
// Try maxSum = 21: Can split as [7,2,5] and [10,8]? 
//   [7,2,5] = 14 ≤ 21 ✓, [10,8] = 18 ≤ 21 ✓, uses 2 splits ✓
//
// Try maxSum = 15: Can split as [7,2] and [5,10,8]?
//   [7,2] = 9 ≤ 15 ✓, [5,10,8] = 23 > 15 ✗
//
// Answer: 18 (split as [7,2,5] and [10,8])
```

---

## Advanced Searching Techniques

### 1. Exponential Search

**When to use**: Searching in unbounded/infinite array or when size unknown.

```javascript
function exponentialSearch(arr, target) {
    // Find range where element may exist
    if (arr[0] === target) return 0;
    
    let bound = 1;
    while (bound < arr.length && arr[bound] < target) {
        bound *= 2; // Exponentially increase bound
    }
    
    // Binary search in found range
    const left = Math.floor(bound / 2);
    const right = Math.min(bound, arr.length - 1);
    
    return binarySearchRange(arr, target, left, right);
}

// Time: O(log n) - finding bound takes O(log n), binary search takes O(log n)
```

### 2. Interpolation Search

**When to use**: Uniformly distributed sorted data.

```javascript
function interpolationSearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        if (left === right) {
            return arr[left] === target ? left : -1;
        }
        
        // Estimate position based on value distribution
        const pos = left + Math.floor(
            ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
        );
        
        if (arr[pos] === target) {
            return pos;
        } else if (arr[pos] < target) {
            left = pos + 1;
        } else {
            right = pos - 1;
        }
    }
    
    return -1;
}

// Time: O(log log n) for uniformly distributed data, O(n) worst case
```

### 3. Ternary Search

**When to use**: Finding maximum/minimum of unimodal function.

```javascript
function ternarySearch(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (right - left > 2) {
        const mid1 = left + Math.floor((right - left) / 3);
        const mid2 = right - Math.floor((right - left) / 3);
        
        if (arr[mid1] < arr[mid2]) {
            left = mid1; // Maximum in right 2/3
        } else {
            right = mid2; // Maximum in left 2/3
        }
    }
    
    // Check remaining elements
    let maxIdx = left;
    for (let i = left + 1; i <= right; i++) {
        if (arr[i] > arr[maxIdx]) {
            maxIdx = i;
        }
    }
    
    return maxIdx;
}
```

---

## Practice Problems by Difficulty

### Easy Searching Problems
1. **Binary Search** (LeetCode 704) - Basic implementation
2. **Search Insert Position** (LeetCode 35) - Find insertion point
3. **First Bad Version** (LeetCode 278) - Binary search on answer
4. **Sqrt(x)** (LeetCode 69) - Binary search on answer space
5. **Guess Number Higher or Lower** (LeetCode 374) - Interactive binary search

### Medium Searching Problems
1. **Search in Rotated Sorted Array** (LeetCode 33) - Modified binary search
2. **Find Minimum in Rotated Sorted Array** (LeetCode 153) - Rotated array
3. **Find Peak Element** (LeetCode 162) - Peak finding
4. **Search a 2D Matrix** (LeetCode 74) - 2D binary search
5. **Koko Eating Bananas** (LeetCode 875) - Binary search on answer

### Hard Searching Problems
1. **Median of Two Sorted Arrays** (LeetCode 4) - Advanced binary search
2. **Split Array Largest Sum** (LeetCode 410) - Binary search on answer
3. **Find K-th Smallest Pair Distance** (LeetCode 719) - Complex answer space
4. **Minimum Days to Make m Bouquets** (LeetCode 1482) - Multi-constraint optimization

---

## Common Mistakes and Solutions

### Mistake 1: Infinite Loop in Binary Search

```javascript
// Wrong: Using left < right with left = mid
function binarySearchWrong(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) { // ❌ Can cause infinite loop
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid; // ❌ If mid = left, no progress
        } else {
            right = mid - 1;
        }
    }
}

// Correct: Proper loop condition and pointer updates
function binarySearchCorrect(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) { // ✅ Use <= for exact search
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1; // ✅ Always make progress
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}
```

### Mistake 2: Incorrect Boundary Updates

```javascript
// Wrong: Inconsistent boundary updates
function findFirstWrong(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid + 1; // ❌ Should be mid, not mid + 1
        }
    }
    
    return left;
}

// Correct: Consistent boundary logic
function findFirstCorrect(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid;
            right = mid - 1; // ✅ Continue searching left
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}
```

### Mistake 3: Wrong Answer Space for Binary Search on Answer

```javascript
// Wrong: Incorrect answer space boundaries
function kokoWrong(piles, h) {
    let left = 0; // ❌ Speed 0 makes no sense
    let right = piles.length; // ❌ Wrong upper bound
    
    // ... rest of code
}

// Correct: Logical answer space boundaries
function kokoCorrect(piles, h) {
    let left = 1; // ✅ Minimum meaningful speed
    let right = Math.max(...piles); // ✅ Maximum meaningful speed
    
    // ... rest of code
}
```

---

## Success Metrics

### Week 1: Basic Searching Mastery
- [ ] Implement linear and binary search from memory
- [ ] Understand when binary search is applicable
- [ ] Handle boundary conditions correctly
- [ ] Solve basic binary search problems confidently

### Week 2: Advanced Binary Search Patterns
- [ ] Master first/last occurrence variations
- [ ] Solve rotated array search problems
- [ ] Understand peak finding technique
- [ ] Handle 2D matrix searching

### Week 3: Binary Search on Answer Space
- [ ] Recognize optimization problems as search problems
- [ ] Implement binary search on answer patterns
- [ ] Solve Koko bananas and similar problems
- [ ] Understand feasibility checking functions

### Week 4: Expert-Level Search Techniques
- [ ] Combine searching with other algorithms
- [ ] Solve complex multi-constraint problems
- [ ] Optimize time complexity using advanced search
- [ ] Ready for any FAANG searching interview

**Remember**: Searching is about systematically eliminating possibilities. Think about what information each comparison gives you and how to use it to narrow down the search space efficiently!