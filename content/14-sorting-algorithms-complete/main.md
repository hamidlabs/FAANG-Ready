# Sorting Algorithms Complete Guide

## Purpose

Sorting is fundamental to computer science and appears in 30% of FAANG interviews. As a full-stack developer, you've used built-in sort functions - now master the algorithms behind them to solve complex problems.

**Key Insight**: Sorting isn't just about arranging data. It's a problem-solving tool that enables binary search, simplifies comparisons, and reveals hidden patterns in data.

---

## Why Sorting Matters in Interviews

**Real-World Applications You Know:**
- **Database queries**: ORDER BY clauses
- **Search results**: Ranking by relevance
- **File systems**: Alphabetical listing
- **E-commerce**: Sort by price, rating, date

**Interview Applications:**
- **Merge Intervals**: Sort by start time first
- **Kth Largest Element**: Use Quick Select (based on Quick Sort)
- **Group Anagrams**: Sort characters within each string
- **Meeting Rooms**: Sort meetings by start time

---

## Fundamental Sorting Algorithms

### 1. Bubble Sort - The Teaching Algorithm

**How it works**: Compare adjacent elements and swap if in wrong order. "Bubble" largest elements to the end.

```javascript
function bubbleSort(arr) {
    const n = arr.length;
    
    // Do n-1 passes through array
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        // In each pass, check adjacent pairs
        for (let j = 0; j < n - i - 1; j++) {
            // If left element > right element, swap
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
                swapped = true;
            }
        }
        
        // If no swaps in this pass, array is sorted
        if (!swapped) break;
    }
    
    return arr;
}

// Example walkthrough: [64, 34, 25, 12, 22, 11, 90]
// Pass 1: [34, 25, 12, 22, 11, 64, 90] (90 bubbles to end)
// Pass 2: [25, 12, 22, 11, 34, 64, 90] (64 bubbles to position)
// Pass 3: [12, 22, 11, 25, 34, 64, 90] (34 bubbles to position)
// Continue until sorted...

// Time Complexity: O(n²) average and worst case, O(n) best case (already sorted)
// Space Complexity: O(1) - sorts in place
// Use case: Educational purposes, small datasets
```

### 2. Selection Sort - Find and Place

**How it works**: Find minimum element and place it at the beginning. Repeat for remaining elements.

```javascript
function selectionSort(arr) {
    const n = arr.length;
    
    // One by one move boundary of unsorted subarray
    for (let i = 0; i < n - 1; i++) {
        // Find minimum element in remaining unsorted array
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        
        // Swap found minimum element with first element
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
    
    return arr;
}

// Example walkthrough: [64, 25, 12, 22, 11, 90]
// Step 1: Find min (11), swap with first: [11, 25, 12, 22, 64, 90]
// Step 2: Find min in remaining (12), swap: [11, 12, 25, 22, 64, 90]
// Step 3: Find min in remaining (22), swap: [11, 12, 22, 25, 64, 90]
// Continue...

// Time Complexity: O(n²) in all cases
// Space Complexity: O(1)
// Use case: Small datasets, when memory writes are expensive
```

### 3. Insertion Sort - Build Sorted Portion

**How it works**: Build sorted array one element at a time by inserting each element into its correct position.

```javascript
function insertionSort(arr) {
    const n = arr.length;
    
    // Start from second element (first is already "sorted")
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // Insert key at correct position
        arr[j + 1] = key;
    }
    
    return arr;
}

// Example walkthrough: [5, 2, 4, 6, 1, 3]
// i=1: Insert 2 into [5] → [2, 5, 4, 6, 1, 3]
// i=2: Insert 4 into [2, 5] → [2, 4, 5, 6, 1, 3]  
// i=3: Insert 6 into [2, 4, 5] → [2, 4, 5, 6, 1, 3]
// i=4: Insert 1 into [2, 4, 5, 6] → [1, 2, 4, 5, 6, 3]
// i=5: Insert 3 into [1, 2, 4, 5, 6] → [1, 2, 3, 4, 5, 6]

// Time Complexity: O(n²) worst case, O(n) best case (nearly sorted)
// Space Complexity: O(1)
// Use case: Small datasets, nearly sorted data, online algorithms
```

---

## Advanced Sorting Algorithms

### 4. Merge Sort - Divide and Conquer

**How it works**: Recursively divide array into halves, sort each half, then merge them back together.

```javascript
function mergeSort(arr) {
    // Base case: arrays of 0 or 1 element are already sorted
    if (arr.length <= 1) return arr;
    
    // Divide: split array in half
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    // Conquer: recursively sort both halves
    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);
    
    // Combine: merge sorted halves
    return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    // Compare elements from both arrays and pick smaller one
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    // Add remaining elements from both arrays
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }
    
    return result;
}

// Example walkthrough: [38, 27, 43, 3, 9, 82, 10]
// Divide:
//     [38, 27, 43, 3, 9, 82, 10]
//         /              \
//   [38, 27, 43]      [3, 9, 82, 10]
//     /      \         /          \
// [38]    [27, 43]   [3, 9]    [82, 10]
//           /  \      /   \      /    \
//        [27] [43]  [3] [9]   [82]  [10]
//
// Merge back up:
// [27, 43] → [3, 9] → [10, 82] → [27, 38, 43] → [3, 9, 10, 82] → [3, 9, 10, 27, 38, 43, 82]

// Time Complexity: O(n log n) in all cases - consistent performance
// Space Complexity: O(n) - needs extra space for merging
// Use case: When you need guaranteed O(n log n), stable sort, external sorting
```

### 5. Quick Sort - Partition and Recurse

**How it works**: Choose a pivot, partition array around pivot, recursively sort partitions.

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        // Partition the array and get pivot index
        const pivotIndex = partition(arr, low, high);
        
        // Recursively sort elements before and after partition
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    
    return arr;
}

function partition(arr, low, high) {
    // Choose rightmost element as pivot
    const pivot = arr[high];
    
    // Index of smaller element (indicates right position of pivot)
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        // If current element is smaller than or equal to pivot
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
        }
    }
    
    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    return i + 1; // Return pivot index
}

// Example walkthrough: [10, 80, 30, 90, 40, 50, 70]
// Choose pivot = 70
// Partition: [10, 30, 40, 50, 70, 90, 80] (elements ≤ 70 on left, > 70 on right)
// Recursively sort left: [10, 30, 40, 50] and right: [90, 80]
// Final result: [10, 30, 40, 50, 70, 80, 90]

// Time Complexity: O(n log n) average case, O(n²) worst case
// Space Complexity: O(log n) average case for recursion stack
// Use case: General purpose sorting, when average case performance is acceptable
```

### 6. Heap Sort - Use a Heap

**How it works**: Build a max heap, repeatedly extract maximum and place it at end.

```javascript
function heapSort(arr) {
    const n = arr.length;
    
    // Build max heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];
        
        // Call heapify on reduced heap
        heapify(arr, i, 0);
    }
    
    return arr;
}

function heapify(arr, n, i) {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // If largest is not root
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Time Complexity: O(n log n) in all cases
// Space Complexity: O(1) - sorts in place
// Use case: When you need O(n log n) guarantee with O(1) space
```

---

## Real FAANG Interview Problems

### Problem 1: Merge Intervals

**Google/Meta**: "Given intervals, merge overlapping ones."

```javascript
function merge(intervals) {
    if (intervals.length <= 1) return intervals;
    
    // Step 1: Sort intervals by start time - KEY INSIGHT!
    intervals.sort((a, b) => a[0] - b[0]);
    
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = merged[merged.length - 1];
        
        // Check if current overlaps with last merged interval
        if (current[0] <= lastMerged[1]) {
            // Merge: update end time to maximum of both
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap: add current interval
            merged.push(current);
        }
    }
    
    return merged;
}

// Example: [[1,3],[2,6],[8,10],[15,18]]
// After sorting: [[1,3],[2,6],[8,10],[15,18]] (already sorted)
// Merge [1,3] and [2,6] → [1,6] (since 2 ≤ 3)
// [1,6] and [8,10] → no overlap, keep both
// Result: [[1,6],[8,10],[15,18]]

// Time: O(n log n) for sorting + O(n) for merging = O(n log n)
// Space: O(1) if not counting output space
```

### Problem 2: Kth Largest Element

**Amazon/Facebook**: "Find kth largest element in unsorted array."

```javascript
// Solution 1: Sort and access (simple but not optimal)
function findKthLargestSort(nums, k) {
    nums.sort((a, b) => b - a); // Sort descending
    return nums[k - 1];
    
    // Time: O(n log n), Space: O(1)
}

// Solution 2: Quick Select (optimal - based on Quick Sort partition)
function findKthLargest(nums, k) {
    // Convert to "kth smallest" problem (easier to implement)
    return quickSelect(nums, 0, nums.length - 1, nums.length - k);
}

function quickSelect(nums, left, right, k) {
    // Partition and get pivot position
    const pivotIndex = partition(nums, left, right);
    
    if (pivotIndex === k) {
        return nums[pivotIndex]; // Found kth smallest
    } else if (pivotIndex < k) {
        return quickSelect(nums, pivotIndex + 1, right, k); // Search right
    } else {
        return quickSelect(nums, left, pivotIndex - 1, k); // Search left
    }
}

function partition(nums, left, right) {
    const pivot = nums[right];
    let i = left - 1;
    
    for (let j = left; j < right; j++) {
        if (nums[j] <= pivot) {
            i++;
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }
    
    [nums[i + 1], nums[right]] = [nums[right], nums[i + 1]];
    return i + 1;
}

// Solution 3: Min Heap (for small k)
function findKthLargestHeap(nums, k) {
    const minHeap = [];
    
    for (let num of nums) {
        if (minHeap.length < k) {
            minHeap.push(num);
            minHeap.sort((a, b) => a - b); // Keep heap property
        } else if (num > minHeap[0]) {
            minHeap[0] = num;
            minHeap.sort((a, b) => a - b);
        }
    }
    
    return minHeap[0];
}

// Time Complexities:
// Sort approach: O(n log n)
// Quick Select: O(n) average, O(n²) worst
// Min Heap: O(n log k)
```

### Problem 3: Sort Colors (Dutch National Flag)

**Microsoft/Google**: "Sort array containing only 0s, 1s, and 2s."

```javascript
function sortColors(nums) {
    // Three pointers approach (Dutch National Flag algorithm)
    let left = 0;      // Boundary for 0s
    let current = 0;   // Current element being processed
    let right = nums.length - 1; // Boundary for 2s
    
    while (current <= right) {
        if (nums[current] === 0) {
            // Swap with left boundary and advance both pointers
            [nums[left], nums[current]] = [nums[current], nums[left]];
            left++;
            current++;
        } else if (nums[current] === 1) {
            // 1 is already in correct position, just advance
            current++;
        } else { // nums[current] === 2
            // Swap with right boundary, move right boundary
            [nums[current], nums[right]] = [nums[right], nums[current]];
            right--;
            // Don't advance current - need to check swapped element
        }
    }
    
    return nums;
}

// Example: [2,0,2,1,1,0]
// Step by step:
// [0,0,2,1,1,2] after processing 0s
// [0,0,1,1,2,2] after processing 1s and 2s

// Time: O(n) - single pass
// Space: O(1) - in-place sorting
```

### Problem 4: Meeting Rooms II

**Google/Amazon**: "Find minimum number of meeting rooms needed."

```javascript
function minMeetingRooms(intervals) {
    if (!intervals || intervals.length === 0) return 0;
    
    // Separate start and end times
    const starts = intervals.map(interval => interval[0]).sort((a, b) => a - b);
    const ends = intervals.map(interval => interval[1]).sort((a, b) => a - b);
    
    let rooms = 0;
    let endPointer = 0;
    
    for (let i = 0; i < starts.length; i++) {
        // If meeting starts before earliest meeting ends
        if (starts[i] < ends[endPointer]) {
            rooms++; // Need new room
        } else {
            endPointer++; // A room becomes available
        }
    }
    
    return rooms;
}

// Alternative heap approach
function minMeetingRoomsHeap(intervals) {
    if (!intervals || intervals.length === 0) return 0;
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const minHeap = []; // Store end times
    
    for (let interval of intervals) {
        // If room is available (earliest end time ≤ current start time)
        if (minHeap.length > 0 && minHeap[0] <= interval[0]) {
            minHeap.shift(); // Remove the room that just freed up
        }
        
        // Add current meeting's end time
        minHeap.push(interval[1]);
        minHeap.sort((a, b) => a - b); // Maintain min heap property
    }
    
    return minHeap.length;
}

// Time: O(n log n) for sorting
// Space: O(n) for heap storage
```

---

## When to Use Each Sorting Algorithm

### Quick Reference Table

| Algorithm | Time (Avg) | Time (Worst) | Space | When to Use |
|-----------|------------|--------------|-------|-------------|
| Bubble Sort | O(n²) | O(n²) | O(1) | Teaching, very small datasets |
| Selection Sort | O(n²) | O(n²) | O(1) | Small datasets, minimal swaps needed |
| Insertion Sort | O(n²) | O(n²) | O(1) | Small/nearly sorted data, online algorithms |
| Merge Sort | O(n log n) | O(n log n) | O(n) | Stable sort needed, guaranteed performance |
| Quick Sort | O(n log n) | O(n²) | O(log n) | General purpose, average case important |
| Heap Sort | O(n log n) | O(n log n) | O(1) | Guaranteed performance + space efficiency |

### JavaScript's Built-in Sort

```javascript
// JavaScript uses Timsort (hybrid of merge sort and insertion sort)
const arr = [3, 1, 4, 1, 5, 9, 2, 6];

// Default: lexicographic (string) comparison
arr.sort(); // [1, 1, 2, 3, 4, 5, 6, 9]

// Numeric comparison
arr.sort((a, b) => a - b); // Ascending: [1, 1, 2, 3, 4, 5, 6, 9]
arr.sort((a, b) => b - a); // Descending: [9, 6, 5, 4, 3, 2, 1, 1]

// Custom comparison
const people = [{name: 'John', age: 30}, {name: 'Jane', age: 25}];
people.sort((a, b) => a.age - b.age); // Sort by age ascending

// Time: O(n log n) average case
// Space: O(n) 
// Stable: Yes (equal elements maintain relative order)
```

---

## Sorting-Related Interview Patterns

### Pattern 1: Sort First, Then Process

```javascript
// Template: When comparing elements or finding patterns
function sortBasedSolution(arr) {
    // Step 1: Sort to reveal patterns
    arr.sort((a, b) => a - b);
    
    // Step 2: Process sorted array (much simpler logic)
    // Two pointers, sliding window, etc.
}

// Examples:
// - 3Sum problem: sort first, then use two pointers
// - Merge intervals: sort by start time
// - Find pairs: sort to use two pointers
```

### Pattern 2: Custom Sorting

```javascript
// Template: Sort by custom criteria to simplify problem
function customSortSolution(items) {
    // Define custom comparison based on problem requirements
    items.sort((a, b) => {
        // Custom logic: could be multiple criteria
        if (a.priority !== b.priority) {
            return b.priority - a.priority; // Higher priority first
        }
        return a.timestamp - b.timestamp; // Earlier timestamp first
    });
    
    // Process sorted items
}

// Examples:
// - Task scheduling: sort by priority then time
// - Meeting rooms: sort by start time
// - Group anagrams: sort characters within strings
```

### Pattern 3: Partial Sorting (Quick Select)

```javascript
// Template: When you only need kth element, not full sort
function partialSortSolution(arr, k) {
    // Quick select for kth smallest/largest
    return quickSelect(arr, 0, arr.length - 1, k);
}

// Examples:
// - Kth largest element
// - Top k frequent elements
// - Median finding
```

---

## Practice Problems by Difficulty

### Easy Sorting Problems
1. **Merge Sorted Array** (LeetCode 88) - Two pointers after sorting concept
2. **Sort Colors** (LeetCode 75) - Counting sort / Dutch flag
3. **Squares of Sorted Array** (LeetCode 977) - Two pointers on sorted data
4. **Intersection of Two Arrays** (LeetCode 349) - Sort then merge
5. **Valid Anagram** (LeetCode 242) - Sort strings and compare

### Medium Sorting Problems  
1. **Merge Intervals** (LeetCode 56) - Sort then merge
2. **Kth Largest Element** (LeetCode 215) - Quick select
3. **Top K Frequent Elements** (LeetCode 347) - Sorting by frequency
4. **Meeting Rooms II** (LeetCode 253) - Sort events
5. **3Sum** (LeetCode 15) - Sort then two pointers

### Hard Sorting Problems
1. **Maximum Gap** (LeetCode 164) - Bucket sort
2. **Count of Smaller Numbers After Self** (LeetCode 315) - Merge sort with counting
3. **Reverse Pairs** (LeetCode 493) - Modified merge sort

---

## Common Mistakes and Solutions

### Mistake 1: Forgetting Stability

```javascript
// Wrong: Using unstable sort when order matters
const students = [
    {name: 'John', grade: 85},
    {name: 'Jane', grade: 85},
    {name: 'Bob', grade: 90}
];

// This might change relative order of John and Jane
students.sort((a, b) => b.grade - a.grade);

// Correct: JavaScript's sort is stable, but be explicit when needed
students.sort((a, b) => {
    if (a.grade !== b.grade) {
        return b.grade - a.grade;
    }
    return 0; // Maintain original order for equal grades
});
```

### Mistake 2: Modifying Array During Sort Comparison

```javascript
// Wrong: Modifying array in comparison function
arr.sort((a, b) => {
    arr.push(someValue); // ❌ Don't modify array being sorted
    return a - b;
});

// Correct: Keep comparison function pure
arr.sort((a, b) => a - b);
```

### Mistake 3: Incorrect Quick Select Implementation

```javascript
// Wrong: Not handling partitioning correctly
function quickSelectWrong(arr, k) {
    // Missing proper base case and partition logic
    return arr[k]; // ❌ Too simplistic
}

// Correct: Proper quick select with partitioning
function quickSelect(arr, left, right, k) {
    if (left === right) return arr[left];
    
    const pivotIndex = partition(arr, left, right);
    
    if (k === pivotIndex) {
        return arr[k];
    } else if (k < pivotIndex) {
        return quickSelect(arr, left, pivotIndex - 1, k);
    } else {
        return quickSelect(arr, pivotIndex + 1, right, k);
    }
}
```

---

## Success Metrics

### Week 1: Basic Sorting Understanding
- [ ] Understand when and why to use each sorting algorithm
- [ ] Implement bubble, selection, and insertion sort from memory
- [ ] Recognize problems where sorting simplifies solution
- [ ] Comfortable with JavaScript's built-in sort function

### Week 2: Advanced Sorting Mastery
- [ ] Implement merge sort and quick sort from memory
- [ ] Understand quick select for kth element problems
- [ ] Use sorting as preprocessing step in complex problems
- [ ] Handle custom sorting criteria confidently

### Week 3: Sorting-Based Problem Solving
- [ ] Solve merge intervals and meeting rooms problems
- [ ] Use two pointers on sorted arrays effectively
- [ ] Implement heap sort for space-constrained scenarios
- [ ] Recognize when NOT to sort (when it's unnecessary)

### Week 4: Interview-Level Sorting Expertise
- [ ] Choose optimal sorting approach for any problem
- [ ] Optimize solutions using partial sorting techniques
- [ ] Handle edge cases in sorting-based solutions
- [ ] Ready for any FAANG sorting algorithm interview

**Remember**: Sorting reveals patterns and simplifies complex problems. Think "sort first" when dealing with comparisons, intervals, or finding relationships between elements!