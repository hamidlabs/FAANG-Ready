# Debugging and Testing Framework

## Purpose

This guide teaches you how to debug code during live interviews and test your solutions like FAANG engineers. As someone who builds applications, you know debugging in development - but interviews have different rules and expectations.

**Key Principle**: Interviewers don't expect perfect code on first try. They want to see how you think through problems when things go wrong.

---

## What is Debugging in Interviews?

**Debugging** = Finding and fixing errors in your code systematically

**Why it matters in interviews:**
- Shows problem-solving thinking process
- Demonstrates attention to detail  
- Proves you can work through problems methodically
- Often distinguishes good candidates from great ones

**Interview vs Real-World Debugging:**
```javascript
// Real world: You have debugger, console.log, Stack Overflow
function buggyFunction() {
    console.log("Debug point 1");  // ✅ Can use logging
    debugger;                      // ✅ Can use breakpoints
    // Can Google the error        // ✅ External resources
}

// Interview: You have only your brain and the whiteboard/screen
function buggyFunction() {
    // Must trace through manually    ✅ Mental execution
    // Must explain your thinking     ✅ Verbal reasoning  
    // Must fix without external help ✅ Pure problem solving
}
```

---

## The TRACE Method for Interview Debugging

### Step 1: **T**race Through Code Manually

**Goal**: Execute your code line by line in your head

**How to do it:**
1. Pick a simple input example
2. Walk through each line of code
3. Track all variable values
4. Speak out loud what each line does

**Example with Buggy Two Sum:**
```javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i <= nums.length; i++) {  // ❌ Bug here
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Let's trace with nums = [2, 7], target = 9
```

**Tracing Process (Say this out loud):**
```
"Let me trace through this with nums = [2, 7], target = 9

i = 0: nums[0] = 2, complement = 9 - 2 = 7, map is empty, add {2: 0}
i = 1: nums[1] = 7, complement = 9 - 7 = 2, map has 2, return [0, 1] ✓
i = 2: nums[2] = undefined... wait, that's accessing beyond array length!

I see the bug: my loop condition should be i < nums.length, not i <= nums.length"
```

### Step 2: **R**ecognize Common Bug Patterns

**Most Common Interview Bugs:**

**1. Off-by-One Errors:**
```javascript
// Wrong: Excludes last element
for (let i = 0; i < arr.length - 1; i++) { }  // ❌

// Wrong: Includes non-existent element  
for (let i = 0; i <= arr.length; i++) { }     // ❌

// Correct: Includes all elements
for (let i = 0; i < arr.length; i++) { }      // ✅
```

**2. Null/Undefined Access:**
```javascript
// Wrong: Doesn't check for null
function process(node) {
    return node.val + node.next.val;  // ❌ node.next might be null
}

// Correct: Check before accessing
function process(node) {
    if (!node || !node.next) return 0;  // ✅
    return node.val + node.next.val;
}
```

**3. Mutating While Iterating:**
```javascript
// Wrong: Modifying array during iteration
for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) arr.splice(i, 1);  // ❌ Skips elements
}

// Correct: Iterate backwards
for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] < 0) arr.splice(i, 1);  // ✅
}
```

### Step 3: **A**nalyze Edge Cases

**Goal**: Test your solution with tricky inputs

**Standard Edge Cases to Always Check:**
- Empty input: `[]`, `""`, `null`
- Single element: `[1]`, `"a"`
- Two elements: `[1,2]`, `"ab"`
- All same elements: `[1,1,1]`, `"aaa"`
- Already sorted: `[1,2,3]`
- Reverse sorted: `[3,2,1]`

**Example Edge Case Testing:**
```javascript
function findMax(arr) {
    let max = arr[0];  // ❌ Bug: what if arr is empty?
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    
    return max;
}

// Test edge cases:
console.log(findMax([]));      // ❌ Error: Cannot read property '0' of undefined
console.log(findMax([5]));     // ✅ Returns 5
console.log(findMax([1,2,3])); // ✅ Returns 3

// Fix: Handle empty array
function findMax(arr) {
    if (arr.length === 0) return null;  // ✅ Handle edge case
    
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
```

### Step 4: **C**heck Logic Flow

**Goal**: Verify your algorithm logic is correct

**Questions to Ask Yourself:**
- Am I handling all possible paths through the code?
- Are my if/else conditions mutually exclusive?
- Do I exit loops correctly?
- Am I returning the right type of value?

**Example Logic Flow Check:**
```javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {  // ✅ Correct condition
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;    // ✅ Moves past mid
        } else {
            right = mid - 1;   // ✅ Moves before mid
        }
    }
    
    return -1;  // ✅ Indicates not found
}

// Logic check questions:
// 1. Will this loop terminate? Yes, left and right converge
// 2. Do I handle all cases? Yes: found, too small, too large
// 3. Are boundary updates correct? Yes, we move past mid each time
```

### Step 5: **E**xecute Test Cases

**Goal**: Run through multiple examples to verify correctness

**Test Case Strategy:**
1. **Happy path**: Normal expected input
2. **Edge cases**: Boundary conditions
3. **Error cases**: Invalid input
4. **Large cases**: Performance considerations

**Example Complete Testing:**
```javascript
function isPalindrome(s) {
    // Clean string: keep only alphanumeric, convert to lowercase
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}

// Test cases with manual verification:
console.log(isPalindrome("A man, a plan, a canal: Panama")); 
// Cleaned: "amanaplanacanalpanama"
// Check: a-a, m-m, a-a, n-n... ✅ true

console.log(isPalindrome("race a car"));
// Cleaned: "raceacar" 
// Check: r-r, a-a, c-c, e-a ❌ false

console.log(isPalindrome(""));
// Cleaned: ""
// Empty string is palindrome ✅ true

console.log(isPalindrome("a"));
// Single char is palindrome ✅ true
```

---

## Real FAANG Interview Debugging Scenarios

### Scenario 1: Google Interview - Array Bounds Error

**Problem**: "Find the first duplicate in an array"
**Buggy Code**:
```javascript
function findFirstDuplicate(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j <= arr.length; j++) {  // ❌ Bug here
            if (arr[i] === arr[j]) {
                return arr[i];
            }
        }
    }
    return -1;
}
```

**Debugging Process** (What to say):
```
"Let me trace through this with a simple example: [1, 2, 1]

i=0, arr[0]=1:
  j=1, arr[1]=2, 1≠2, continue
  j=2, arr[2]=1, 1===1, return 1 ✓
  j=3, arr[3]=undefined... 

Wait, I see the issue. My inner loop condition is j <= arr.length, 
but arrays are 0-indexed, so the last valid index is arr.length - 1.
I should use j < arr.length instead."
```

**Fixed Code**:
```javascript
function findFirstDuplicate(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {  // ✅ Fixed
            if (arr[i] === arr[j]) {
                return arr[i];
            }
        }
    }
    return -1;
}
```

### Scenario 2: Meta Interview - Infinite Loop

**Problem**: "Remove all occurrences of a value from array"
**Buggy Code**:
```javascript
function removeValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1);  // ❌ Creates infinite loop potential
        }
    }
    return arr;
}
```

**Debugging Process**:
```
"Let me test this with arr = [1, 2, 2, 3], val = 2

i=0: arr[0]=1, 1≠2, continue, arr=[1,2,2,3]
i=1: arr[1]=2, 2===2, splice, arr=[1,2,3]
i=2: arr[2]=3, 3≠2, continue

Wait, I only removed one '2' but there were two. The issue is that 
when I splice at index 1, the second '2' shifts to index 1, but my
loop moves to index 2, so I skip it.

I need to either iterate backwards or adjust the index after splicing."
```

**Fixed Code (Two Solutions)**:
```javascript
// Solution 1: Iterate backwards
function removeValue(arr, val) {
    for (let i = arr.length - 1; i >= 0; i--) {  // ✅
        if (arr[i] === val) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

// Solution 2: Adjust index after splice
function removeValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1);
            i--;  // ✅ Stay at same position for next iteration
        }
    }
    return arr;
}
```

### Scenario 3: Amazon Interview - Stack Overflow

**Problem**: "Calculate factorial recursively"
**Buggy Code**:
```javascript
function factorial(n) {
    return n * factorial(n - 1);  // ❌ No base case
}
```

**Debugging Process**:
```
"Let me trace through factorial(3):

factorial(3) = 3 * factorial(2)
factorial(2) = 2 * factorial(1)  
factorial(1) = 1 * factorial(0)
factorial(0) = 0 * factorial(-1)
factorial(-1) = -1 * factorial(-2)
...

This will continue forever! I'm missing the base case that stops 
the recursion. Factorial of 0 should return 1."
```

**Fixed Code**:
```javascript
function factorial(n) {
    // Base case
    if (n <= 1) return 1;  // ✅ Stops recursion
    
    // Recursive case
    return n * factorial(n - 1);
}
```

---

## Testing Strategies During Interviews

### Strategy 1: Test-Driven Debugging

**Process**:
1. Before coding: Write down expected inputs and outputs
2. After coding: Check if your solution produces expected outputs
3. If wrong: Trace to find where expectation differs from reality

**Example**:
```javascript
// Problem: Find second largest element
// Before coding, write test cases:
// Input: [1, 3, 2, 5, 4] → Expected: 4
// Input: [1, 1, 1, 1] → Expected: ? (Edge case to clarify)
// Input: [5] → Expected: ? (Edge case to clarify)

function findSecondLargest(arr) {
    if (arr.length < 2) return null;
    
    let largest = Math.max(arr[0], arr[1]);
    let secondLargest = Math.min(arr[0], arr[1]);
    
    for (let i = 2; i < arr.length; i++) {
        if (arr[i] > largest) {
            secondLargest = largest;
            largest = arr[i];
        } else if (arr[i] > secondLargest && arr[i] < largest) {
            secondLargest = arr[i];
        }
    }
    
    return secondLargest;
}

// Test: [1, 3, 2, 5, 4]
// i=0,1: largest=3, secondLargest=1
// i=2: arr[2]=2, 2>1 && 2<3, secondLargest=2
// i=3: arr[3]=5, 5>3, largest=5, secondLargest=3
// i=4: arr[4]=4, 4>3 && 4<5, secondLargest=4 ✓
```

### Strategy 2: Edge Case Testing

**Common Edge Cases by Problem Type**:

**Array Problems**:
- Empty array: `[]`
- Single element: `[1]`
- Two elements: `[1, 2]`
- All duplicates: `[1, 1, 1]`
- Sorted: `[1, 2, 3]`
- Reverse sorted: `[3, 2, 1]`

**String Problems**:
- Empty string: `""`
- Single character: `"a"`
- All same character: `"aaaa"`
- Palindrome: `"aba"`
- No solution: `"abc"` (for palindrome problems)

**Tree Problems**:
- Empty tree: `null`
- Single node: `TreeNode(1)`
- Left skewed: `1 → 2 → 3`
- Right skewed: `1 ← 2 ← 3`
- Balanced: Standard binary tree

### Strategy 3: Complexity Verification

**Check Your Solution**:
1. **Time Complexity**: Count nested loops and recursive calls
2. **Space Complexity**: Track extra data structures and recursion depth

**Example Complexity Check**:
```javascript
function twoSum(nums, target) {
    const map = new Map();  // O(n) space in worst case
    
    for (let i = 0; i < nums.length; i++) {  // O(n) iterations
        const complement = target - nums[i];  // O(1) operation
        
        if (map.has(complement)) {  // O(1) lookup
            return [map.get(complement), i];  // O(1) operation
        }
        
        map.set(nums[i], i);  // O(1) operation
    }
    
    return [];
}

// Time: O(n) - single loop with O(1) operations inside
// Space: O(n) - hash map stores at most n elements
```

---

## Communication During Debugging

### What to Say When You Find a Bug

**Instead of**: "Oh no, this is wrong!"
**Say**: "Let me check this logic. I think I might have an edge case issue here."

**Instead of**: "I'm so stupid!"
**Say**: "I see the issue now. Let me trace through this more carefully."

**Instead of**: "This should work!"
**Say**: "Let me verify this with a concrete example to make sure the logic is correct."

### Debugging Out Loud Template

```
"Let me trace through this code with a simple example...

[Walk through line by line]

I notice that when [specific condition], the code does [unexpected behavior].
The issue seems to be [specific bug].
Let me fix this by [solution approach].

Now let me verify the fix works:
[Test with the same example]

This looks correct now. Let me also check an edge case...
[Test edge case]
"
```

---

## Practice Exercises

### Exercise 1: Debug This Binary Search
```javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length;  // Bug 1
    
    while (left < right) {   // Bug 2
        let mid = (left + right) / 2;  // Bug 3
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid;      // Bug 4
        } else {
            right = mid;
        }
    }
    
    return -1;
}
```

**Practice Process**:
1. Trace through with `arr = [1, 3, 5, 7], target = 5`
2. Identify all bugs
3. Fix each bug
4. Test with edge cases

### Exercise 2: Debug This Palindrome Check
```javascript
function isPalindrome(s) {
    let left = 0;
    let right = s.length;    // Bug 1
    
    while (left <= right) {  // Bug 2
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}
```

### Exercise 3: Debug This Tree Traversal
```javascript
function inorderTraversal(root) {
    const result = [];
    
    function traverse(node) {
        traverse(node.left);     // Bug 1
        result.push(node.val);   // Bug 2
        traverse(node.right);    // Bug 3
    }
    
    traverse(root);
    return result;
}
```

---

## Success Metrics

### Week 1: Basic Debugging Skills
- [ ] Can trace through simple functions manually
- [ ] Recognize off-by-one errors immediately
- [ ] Check null/undefined cases automatically
- [ ] Test with at least 3 different inputs

### Week 2: Edge Case Mastery
- [ ] Automatically consider edge cases for any problem
- [ ] Can debug array bounds and loop termination issues
- [ ] Comfortable explaining debugging process out loud
- [ ] Fix bugs in under 2 minutes for simple problems

### Week 3: Complex Problem Debugging
- [ ] Debug recursive functions and tree traversals
- [ ] Handle multiple bugs in single function
- [ ] Test edge cases systematically
- [ ] Verify time/space complexity after fixes

### Week 4: Interview-Level Debugging
- [ ] Debug under time pressure while explaining
- [ ] Catch bugs before running code (static analysis)
- [ ] Fix bugs smoothly without losing confidence
- [ ] Ready for real FAANG interview debugging challenges

**Remember**: Bugs are normal in interviews. How you handle them shows your problem-solving skills!