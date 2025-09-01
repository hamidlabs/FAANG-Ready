# Two Pointers Pattern

## Purpose

The Two Pointers pattern is a FAANG interview favorite that appears in 25% of array/string problems. It transforms O(n²) brute force solutions into elegant O(n) algorithms. Master this pattern to solve problems that seem impossible at first glance.

**Key Insight**: Instead of checking every pair with nested loops, use two pointers moving smartly through data to find what you need in one pass.

---

## What is the Two Pointers Pattern?

**Basic Concept**: Use two pointers (indices) to traverse data from different positions, moving them based on certain conditions to solve the problem efficiently.

```javascript
// Visual representation
// Array: [1, 2, 3, 4, 5, 6, 7]
// Pointers:
//         ↑                 ↑
//       left              right

// Common movements:
// 1. Move both pointers toward center
// 2. Move both pointers in same direction  
// 3. Move one pointer based on condition
```

**Why Two Pointers Works:**
- **Eliminates nested loops**: Instead of O(n²) comparisons, make O(n) smart decisions
- **Reduces space complexity**: No extra data structures needed
- **Natural for sorted data**: Take advantage of ordering to make smart moves

---

## Types of Two Pointers Problems

### Type 1: Opposite Directional (Converging)

**Pattern**: Start from both ends, move pointers toward each other.

```javascript
// Template for converging two pointers
function convergingTwoPointers(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        // Check current pair
        if (condition) {
            // Found answer or process current pair
            return result;
        } else if (needMoveLeft) {
            left++;
        } else {
            right--;
        }
    }
    
    return defaultResult;
}

// Use cases:
// - Two Sum on sorted array
// - Valid palindrome
// - Container with most water
// - Trapping rain water
```

### Type 2: Same Directional (Fast/Slow)

**Pattern**: Both pointers move in same direction at different speeds.

```javascript
// Template for same direction two pointers
function sameDirectionTwoPointers(arr) {
    let slow = 0;
    let fast = 0;
    
    while (fast < arr.length) {
        // Process fast pointer element
        
        if (condition) {
            // Move slow pointer when condition met
            slow++;
        }
        
        fast++;
    }
    
    return result; // Often involves slow pointer position
}

// Use cases:
// - Remove duplicates from sorted array
// - Move zeros to end
// - Remove element
// - Partition array
```

### Type 3: Sliding Window (Fixed/Variable)

**Pattern**: Maintain a window between two pointers, expand or contract based on conditions.

```javascript
// Template for sliding window
function slidingWindowTwoPointers(arr) {
    let left = 0;
    let right = 0;
    
    while (right < arr.length) {
        // Expand window by including arr[right]
        // Update window state
        
        while (windowNeedsContraction) {
            // Contract window from left
            left++;
        }
        
        // Process current window [left, right]
        right++;
    }
    
    return result;
}

// Use cases:
// - Longest substring without repeating characters
// - Minimum window substring
// - Maximum sum subarray of size k
```

---

## Real FAANG Interview Problems

### Problem 1: Two Sum II (Sorted Array)

**Google/Meta**: "Find two numbers in sorted array that add up to target."

**Complete Solution**:
```javascript
function twoSum(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;
    
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        
        if (sum === target) {
            return [left + 1, right + 1]; // 1-indexed as per problem
        } else if (sum < target) {
            left++; // Need larger sum, move left pointer right
        } else {
            right--; // Need smaller sum, move right pointer left
        }
    }
    
    return []; // No solution found (shouldn't happen per problem guarantee)
}

// Why this works on sorted array:
// - If sum is too small, only way to increase is move left pointer right
// - If sum is too large, only way to decrease is move right pointer left
// - This eliminates the need to check all pairs

// Example: numbers = [2,7,11,15], target = 9
// Step 1: left=0, right=3, sum=2+15=17 > 9, move right to 2
// Step 2: left=0, right=2, sum=2+11=13 > 9, move right to 1
// Step 3: left=0, right=1, sum=2+7=9 = 9, return [1,2]

// Time: O(n) - single pass
// Space: O(1) - only two pointers
```

### Problem 2: Container With Most Water

**Amazon/Google**: "Find two lines that form container holding most water."

**Complete Solution**:
```javascript
function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        // Calculate water area: width × min(left_height, right_height)
        const width = right - left;
        const minHeight = Math.min(height[left], height[right]);
        const area = width * minHeight;
        
        maxWater = Math.max(maxWater, area);
        
        // Move pointer with smaller height
        // Why? Moving the taller one can only decrease area
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// Key insight: Always move the pointer with smaller height
// Moving the taller one will either:
// 1. Decrease width (guaranteed)
// 2. Keep same height (limited by shorter one)
// 3. Result in smaller or same area
// Moving shorter one gives chance to find taller height

// Example: height = [1,8,6,2,5,4,8,3,7]
// Visual:
//   8 |     █       █
//   7 |     █       █   █
//   6 |     █ █     █   █
//   5 |     █ █   █ █   █
//   4 |     █ █   █ █ █ █
//   3 |     █ █   █ █ █ █ █
//   2 |     █ █ █ █ █ █ █ █
//   1 | █   █ █ █ █ █ █ █ █
//       0 1 2 3 4 5 6 7 8

// left=0, right=8: area = 8 * min(1,7) = 8 * 1 = 8
// Move left (height[0]=1 < height[8]=7)
// left=1, right=8: area = 7 * min(8,7) = 7 * 7 = 49
// Continue until left meets right...

// Time: O(n) - each pointer moves at most n times
// Space: O(1) - only variables
```

### Problem 3: 3Sum

**Meta/Google**: "Find all unique triplets that sum to zero."

**Complete Solution**:
```javascript
function threeSum(nums) {
    const result = [];
    
    // Step 1: Sort array to enable two pointers approach
    nums.sort((a, b) => a - b);
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicate values for first element
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        // Fix first element, find two elements that sum to -nums[i]
        const target = -nums[i];
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[left] + nums[right];
            
            if (sum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // Skip duplicates for second element
                while (left < right && nums[left] === nums[left + 1]) left++;
                // Skip duplicates for third element  
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < target) {
                left++; // Need larger sum
            } else {
                right--; // Need smaller sum
            }
        }
    }
    
    return result;
}

// Why this works:
// 1. Sort array first to enable two pointers
// 2. For each element, find two others using two pointers
// 3. Skip duplicates to ensure unique triplets

// Example: nums = [-1,0,1,2,-1,-4]
// After sorting: [-4,-1,-1,0,1,2]
// 
// i=0, nums[0]=-4, target=4:
//   left=1(-1), right=5(2), sum=-1+2=1 < 4, move left
//   left=2(-1), right=5(2), sum=-1+2=1 < 4, move left  
//   left=3(0), right=5(2), sum=0+2=2 < 4, move left
//   left=4(1), right=5(2), sum=1+2=3 < 4, move left
//   left=5, left >= right, exit
//
// i=1, nums[1]=-1, target=1:
//   left=2(-1), right=5(2), sum=-1+2=1 = 1, found [-1,-1,2]
//   Continue...

// Time: O(n²) - O(n log n) for sort + O(n) for outer loop × O(n) for two pointers
// Space: O(1) if not counting output space
```

### Problem 4: Valid Palindrome

**Apple/Amazon**: "Check if string is palindrome ignoring non-alphanumeric characters."

**Complete Solution**:
```javascript
function isPalindrome(s) {
    // Clean string: convert to lowercase, keep only alphanumeric
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
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

// Alternative: Process without cleaning (more memory efficient)
function isPalindromeOptimal(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Skip non-alphanumeric from left
        while (left < right && !isAlphaNumeric(s[left])) {
            left++;
        }
        
        // Skip non-alphanumeric from right
        while (left < right && !isAlphaNumeric(s[right])) {
            right--;
        }
        
        // Compare characters
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}

function isAlphaNumeric(char) {
    const code = char.charCodeAt(0);
    return (code >= 48 && code <= 57) ||  // 0-9
           (code >= 65 && code <= 90) ||  // A-Z
           (code >= 97 && code <= 122);   // a-z
}

// Test cases:
// "A man, a plan, a canal: Panama" → true
// "race a car" → false
// "" → true (empty string is palindrome)

// Time: O(n) - single pass through string
// Space: O(1) for optimal version, O(n) for cleaned version
```

### Problem 5: Remove Duplicates from Sorted Array

**Microsoft/Google**: "Remove duplicates in-place, return new length."

**Complete Solution**:
```javascript
function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    
    let slow = 0; // Points to position for next unique element
    
    for (let fast = 1; fast < nums.length; fast++) {
        // When we find a new unique element
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast]; // Place unique element
        }
        // If nums[fast] === nums[slow], skip (it's a duplicate)
    }
    
    return slow + 1; // Length of array with unique elements
}

// How it works:
// - Slow pointer tracks position for next unique element
// - Fast pointer explores array looking for unique elements
// - When fast finds unique element, place it at slow position

// Example: nums = [1,1,2,2,3,3,3,4]
// Initially: slow=0, fast=1
// fast=1: nums[1]=1 === nums[0]=1, skip
// fast=2: nums[2]=2 ≠ nums[0]=1, slow=1, nums[1]=2 → [1,2,2,2,3,3,3,4]
// fast=3: nums[3]=2 === nums[1]=2, skip  
// fast=4: nums[4]=3 ≠ nums[1]=2, slow=2, nums[2]=3 → [1,2,3,2,3,3,3,4]
// Continue...
// Final: [1,2,3,4,3,3,3,4], return 4

// Time: O(n) - single pass
// Space: O(1) - in-place modification
```

---

## Two Pointers Pattern Variations

### Variation 1: Fixed Distance

**When to use**: Problems involving pairs with specific distance.

```javascript
function fixedDistancePattern(arr, k) {
    let left = 0;
    let right = k; // Fixed distance of k
    
    while (right < arr.length) {
        // Process pair at distance k: arr[left] and arr[right]
        
        left++;
        right++;
    }
}

// Example: Find pairs with difference k
function findPairsWithDifference(nums, k) {
    nums.sort((a, b) => a - b);
    const pairs = [];
    let left = 0;
    let right = 1;
    
    while (right < nums.length) {
        const diff = nums[right] - nums[left];
        
        if (diff === k) {
            pairs.push([nums[left], nums[right]]);
            left++;
            right++;
        } else if (diff < k) {
            right++;
        } else {
            left++;
            if (left === right) right++;
        }
    }
    
    return pairs;
}
```

### Variation 2: Multiple Pointers

**When to use**: Problems requiring more than two pointers.

```javascript
// Four Sum problem using multiple two pointers
function fourSum(nums, target) {
    const result = [];
    nums.sort((a, b) => a - b);
    
    for (let i = 0; i < nums.length - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        for (let j = i + 1; j < nums.length - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            
            // Two pointers for remaining elements
            let left = j + 1;
            let right = nums.length - 1;
            
            while (left < right) {
                const sum = nums[i] + nums[j] + nums[left] + nums[right];
                
                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);
                    
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }
    
    return result;
}
```

### Variation 3: Cycle Detection (Floyd's Algorithm)

**When to use**: Detecting cycles in linked lists or arrays.

```javascript
// Detect cycle in linked list
function hasCycle(head) {
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;      // Move 1 step
        fast = fast.next.next; // Move 2 steps
        
        if (slow === fast) {
            return true; // Cycle detected
        }
    }
    
    return false; // No cycle
}

// Find cycle start
function detectCycleStart(head) {
    let slow = head;
    let fast = head;
    
    // First, detect if cycle exists
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            // Cycle found, now find start
            slow = head;
            while (slow !== fast) {
                slow = slow.next;
                fast = fast.next;
            }
            return slow; // Start of cycle
        }
    }
    
    return null; // No cycle
}
```

---

## When to Use Two Pointers

### Problem Signals (When to think Two Pointers)

1. **Array/string problems** asking for pairs, triplets, or subarrays
2. **Sorted data** where you can make decisions based on comparisons
3. **Palindrome-related** problems
4. **Problems with O(n²) brute force** that seem like they should be faster
5. **"Remove/modify in-place"** problems
6. **Finding elements with specific relationships**

### Quick Recognition Guide

| Problem Statement Contains | Likely Pattern |
|----------------------------|----------------|
| "Two numbers that sum to..." | Opposite directional |
| "Remove duplicates in-place" | Same directional |
| "Valid palindrome" | Opposite directional |
| "Container with most..." | Opposite directional |
| "Longest/shortest subarray" | Sliding window |
| "Move elements" | Same directional |
| "Find triplets" | 3Sum variation |

---

## Practice Problems by Difficulty

### Easy Two Pointers Problems
1. **Two Sum II** (LeetCode 167) - Basic opposite directional
2. **Valid Palindrome** (LeetCode 125) - String processing
3. **Remove Duplicates** (LeetCode 26) - Same directional
4. **Move Zeroes** (LeetCode 283) - Element rearrangement
5. **Intersection of Two Arrays II** (LeetCode 350) - Sorted arrays

### Medium Two Pointers Problems
1. **3Sum** (LeetCode 15) - Triple pointers
2. **Container With Most Water** (LeetCode 11) - Area optimization
3. **Sort Colors** (LeetCode 75) - Dutch flag algorithm
4. **Remove Nth Node From End** (LeetCode 19) - Linked list
5. **Longest Palindromic Substring** (LeetCode 5) - Expand around center

### Hard Two Pointers Problems
1. **Minimum Window Substring** (LeetCode 76) - Advanced sliding window
2. **Trapping Rain Water** (LeetCode 42) - Complex area calculation
3. **4Sum** (LeetCode 18) - Four pointers extension
4. **Substring with Concatenation** (LeetCode 30) - Complex pattern matching

---

## Common Mistakes and Solutions

### Mistake 1: Not Handling Duplicates

```javascript
// Wrong: Doesn't skip duplicate triplets in 3Sum
function threeSumWrong(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // ❌ Not skipping duplicate i values
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;
                // ❌ Not skipping duplicate left/right values
            }
            // ... other conditions
        }
    }
}

// Correct: Skip duplicates at all levels
function threeSumCorrect(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue; // ✅ Skip duplicate i
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // ✅ Skip duplicates for left and right
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            }
        }
    }
}
```

### Mistake 2: Incorrect Pointer Movement Logic

```javascript
// Wrong: Moving pointers without logic
function containerWrong(height) {
    let left = 0;
    let right = height.length - 1;
    let max = 0;
    
    while (left < right) {
        const area = (right - left) * Math.min(height[left], height[right]);
        max = Math.max(max, area);
        
        // ❌ Random movement - always moving left
        left++;
    }
    
    return max;
}

// Correct: Move pointer with logic
function containerCorrect(height) {
    let left = 0;
    let right = height.length - 1;
    let max = 0;
    
    while (left < right) {
        const area = (right - left) * Math.min(height[left], height[right]);
        max = Math.max(max, area);
        
        // ✅ Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return max;
}
```

### Mistake 3: Boundary Condition Errors

```javascript
// Wrong: Incorrect loop conditions
function removeDuplicatesWrong(nums) {
    let slow = 0;
    
    // ❌ Starting fast at 0 instead of 1
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    
    return slow + 1;
}

// Correct: Proper initialization
function removeDuplicatesCorrect(nums) {
    if (nums.length === 0) return 0;
    
    let slow = 0;
    
    // ✅ Start fast at 1
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    
    return slow + 1;
}
```

---

## Success Metrics

### Week 1: Basic Two Pointers Mastery
- [ ] Understand when to use opposite vs same directional pointers
- [ ] Solve basic problems like Two Sum II and Valid Palindrome
- [ ] Implement remove duplicates pattern confidently
- [ ] Recognize two pointers opportunities automatically

### Week 2: Advanced Pattern Recognition
- [ ] Master 3Sum and its variations
- [ ] Solve Container With Most Water efficiently
- [ ] Handle duplicate skipping in complex scenarios
- [ ] Use two pointers for in-place array modifications

### Week 3: Complex Applications
- [ ] Combine two pointers with other techniques
- [ ] Solve sliding window problems using two pointers
- [ ] Handle multiple pointers (4Sum, etc.)
- [ ] Optimize from O(n²) to O(n) using two pointers

### Week 4: Interview Readiness
- [ ] Solve two pointers problems under time pressure
- [ ] Explain the logic and intuition clearly
- [ ] Handle edge cases and boundary conditions
- [ ] Ready for any FAANG two pointers interview question

**Remember**: Two pointers is about making smart moves based on data properties. Instead of checking all possibilities, use the structure of the problem to eliminate impossible cases efficiently!