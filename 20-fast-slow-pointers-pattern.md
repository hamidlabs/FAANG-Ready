# Fast-Slow Pointers Pattern

## Purpose

The Fast-Slow Pointers pattern (also called "Floyd's Tortoise and Hare") is a brilliant technique for detecting cycles and finding middle elements. It appears in 15% of FAANG interviews and provides elegant O(1) space solutions to problems that seem to require extra memory.

**Key Insight**: Two pointers moving at different speeds will eventually meet if there's a cycle. This simple concept solves complex problems about cycles, middle elements, and linked list manipulation.

---

## What is the Fast-Slow Pointers Pattern?

**Basic Concept**: Use two pointers where one moves faster than the other. The relative movement reveals important properties about the data structure.

```javascript
// Visual representation in a linked list
// 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
// ↑    ↑
// slow fast (initially both at start)
//
// After 1 step:
// 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7  
//      ↑         ↑
//    slow      fast (fast moves 2 steps, slow moves 1)
//
// After 2 steps:
// 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
//           ↑              ↑
//         slow           fast
//
// After 3 steps:
// 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
//                ↑                    ↑
//              slow                 fast (fast reaches end)
```

**Why Fast-Slow Works:**
- **Cycle detection**: In a cycle, fast pointer will eventually "lap" the slow pointer
- **Middle finding**: When fast reaches end, slow is at middle
- **Space efficiency**: No extra data structures needed
- **Mathematical guarantee**: Fast pointer gains one position per iteration

---

## Types of Fast-Slow Pointer Problems

### Type 1: Cycle Detection

**Pattern**: Fast moves 2 steps, slow moves 1 step. If there's a cycle, they'll meet.

```javascript
// Template for cycle detection
function hasCycle(head) {
    if (!head || !head.next) return false;
    
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

// Use cases:
// - Detect cycle in linked list
// - Find start of cycle
// - Detect cycle in array (using indices)
// - Check if linked list is circular
```

### Type 2: Finding Middle Element

**Pattern**: When fast reaches end (or null), slow is at middle.

```javascript
// Template for finding middle
function findMiddle(head) {
    if (!head) return null;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;      // Move 1 step
        fast = fast.next.next; // Move 2 steps
    }
    
    return slow; // Middle element
}

// Use cases:
// - Find middle of linked list
// - Split linked list into two halves
// - Palindrome checking (find middle first)
```

### Type 3: Finding Nth Element from End

**Pattern**: Give fast pointer n-step head start, then move both at same speed.

```javascript
// Template for nth from end
function nthFromEnd(head, n) {
    let slow = head;
    let fast = head;
    
    // Move fast pointer n steps ahead
    for (let i = 0; i < n; i++) {
        if (!fast) return null; // List shorter than n
        fast = fast.next;
    }
    
    // Move both at same speed
    while (fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow; // nth element from end
}

// Use cases:
// - Remove nth node from end
// - Find kth element from end
// - Two-pointer distance problems
```

---

## Real FAANG Interview Problems

### Problem 1: Linked List Cycle Detection

**Google/Amazon**: "Detect if linked list has a cycle."

**Complete Solution**:
```javascript
// Definition for singly-linked list
function ListNode(val) {
    this.val = val;
    this.next = null;
}

function hasCycle(head) {
    // Edge cases: empty list or single node
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    // Fast moves 2 steps, slow moves 1 step
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        // If they meet, there's a cycle
        if (slow === fast) {
            return true;
        }
    }
    
    // Fast reached end, no cycle
    return false;
}

// Why this works:
// - In a linear list: fast will reach null before slow
// - In a cyclic list: fast will eventually catch up to slow
// - Mathematical proof: fast gains 1 position per iteration
//   If cycle exists, gap will eventually become 0

// Example with cycle:
// 1 -> 2 -> 3 -> 4
//      ↑         ↓
//      6 <- 5 <- 

// Step 1: slow=1, fast=1
// Step 2: slow=2, fast=3  
// Step 3: slow=3, fast=5
// Step 4: slow=4, fast=1 (wrapped around)
// Step 5: slow=5, fast=3
// Step 6: slow=6, fast=5
// Step 7: slow=2, fast=2 (they meet!)

// Time: O(n) - at most n steps before meeting
// Space: O(1) - only two pointers
```

### Problem 2: Find Start of Cycle

**Meta/Microsoft**: "Find the node where cycle begins."

**Complete Solution**:
```javascript
function detectCycle(head) {
    if (!head || !head.next) return null;
    
    // Phase 1: Detect if cycle exists
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            break; // Cycle detected
        }
    }
    
    // No cycle found
    if (!fast || !fast.next) {
        return null;
    }
    
    // Phase 2: Find start of cycle
    // Reset one pointer to head
    slow = head;
    
    // Move both at same speed until they meet
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow; // Start of cycle
}

// Why this works (Mathematical proof):
// Let's say:
// - Distance from head to cycle start = a
// - Distance from cycle start to meeting point = b  
// - Remaining cycle distance = c
// - Total cycle length = b + c
//
// When they meet:
// - Slow has traveled: a + b
// - Fast has traveled: a + b + c + b = a + 2b + c
//
// Since fast travels twice as far as slow:
// a + 2b + c = 2(a + b)
// a + 2b + c = 2a + 2b  
// c = a
//
// So distance from head to cycle start (a) equals 
// distance from meeting point to cycle start (c)!
//
// That's why moving one pointer to head and both at same speed
// makes them meet exactly at cycle start.

// Example:
// 1 -> 2 -> 3 -> 4 -> 5
//           ↑         ↓
//           8 <- 7 <- 6
//
// a = 2 (head to node 3)
// b = 3 (node 3 to meeting point at node 6)  
// c = 2 (node 6 back to node 3)
// Indeed, a = c = 2

// Time: O(n) - two passes through list
// Space: O(1) - only pointers
```

### Problem 3: Middle of Linked List

**Amazon/Apple**: "Find middle node of linked list."

**Complete Solution**:
```javascript
function middleNode(head) {
    if (!head) return null;
    
    let slow = head;
    let fast = head;
    
    // Move fast 2 steps, slow 1 step
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow; // Middle node
}

// For even number of nodes, returns second middle
// Example: 1->2->3->4->5->6
// Returns node 4 (not node 3)

// If you want first middle for even length:
function firstMiddleNode(head) {
    if (!head || !head.next) return head;
    
    let slow = head;
    let fast = head.next; // Start fast one step ahead
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow; // First middle for even, middle for odd
}

// Example walkthrough: 1->2->3->4->5
// Initial: slow=1, fast=1
// Step 1: slow=2, fast=3
// Step 2: slow=3, fast=5
// Step 3: fast.next=null, exit loop
// Return slow=3 (middle node)

// Time: O(n/2) = O(n) - fast traverses entire list
// Space: O(1) - only two pointers
```

### Problem 4: Remove Nth Node From End

**Google/Meta**: "Remove nth node from end of linked list."

**Complete Solution**:
```javascript
function removeNthFromEnd(head, n) {
    // Create dummy node to handle edge case of removing first node
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let slow = dummy;
    let fast = dummy;
    
    // Move fast pointer n+1 steps ahead
    // (n+1 because we want slow to be at node before target)
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // Move both pointers until fast reaches end
    while (fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    // Now slow points to node before the one to remove
    slow.next = slow.next.next;
    
    return dummy.next;
}

// Example: [1,2,3,4,5], n=2 (remove 4)
// 
// dummy -> 1 -> 2 -> 3 -> 4 -> 5
// ↑                            
// slow, fast
//
// After moving fast n+1=3 steps:
// dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
// ↑                       ↑
// slow                   fast
//
// Move both until fast reaches null:
// dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null  
//                ↑                   ↑
//              slow                fast
//
// slow.next = slow.next.next removes node 4:
// dummy -> 1 -> 2 -> 3 -> 5

// Edge cases handled:
// - n = list length (remove first node): dummy node helps
// - n = 1 (remove last node): works normally
// - List of length 1: works with dummy node

// Time: O(n) - single pass through list
// Space: O(1) - only pointers and dummy node
```

### Problem 5: Palindrome Linked List

**Facebook/Apple**: "Check if linked list values form a palindrome."

**Complete Solution**:
```javascript
function isPalindrome(head) {
    if (!head || !head.next) return true;
    
    // Step 1: Find middle using fast-slow pointers
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Step 2: Reverse second half
    let secondHalf = reverseList(slow);
    let firstHalf = head;
    
    // Step 3: Compare both halves
    while (secondHalf) {
        if (firstHalf.val !== secondHalf.val) {
            return false;
        }
        firstHalf = firstHalf.next;
        secondHalf = secondHalf.next;
    }
    
    return true;
}

function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}

// Example: [1,2,3,2,1]
//
// Step 1: Find middle
// 1 -> 2 -> 3 -> 2 -> 1
//           ↑
//         slow (middle)
//
// Step 2: Reverse second half [3,2,1] -> [1,2,3]
// First half: 1 -> 2 -> 3
// Second half: 1 -> 2 -> 3 (reversed)
//
// Step 3: Compare: 1=1 ✓, 2=2 ✓, 3=3 ✓
// Result: true (palindrome)

// Alternative: O(n) space solution using stack/array
function isPalindromeSpace(head) {
    const values = [];
    let current = head;
    
    // Collect all values
    while (current) {
        values.push(current.val);
        current = current.next;
    }
    
    // Check if array is palindrome
    let left = 0;
    let right = values.length - 1;
    
    while (left < right) {
        if (values[left] !== values[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}

// Time: O(n) - traverse list twice
// Space: O(1) for optimized version, O(n) for array version
```

---

## Advanced Fast-Slow Pointer Techniques

### 1. Finding Duplicate Number (Floyd's Algorithm)

```javascript
// Find duplicate in array where values are 1 to n
function findDuplicate(nums) {
    // Treat array as linked list: nums[i] points to nums[nums[i]]
    let slow = nums[0];
    let fast = nums[0];
    
    // Phase 1: Find meeting point (proves cycle exists)
    do {
        slow = nums[slow];           // Move 1 step
        fast = nums[nums[fast]];     // Move 2 steps
    } while (slow !== fast);
    
    // Phase 2: Find start of cycle (the duplicate)
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}

// Example: [3,1,3,4,2]
// Index: 0 1 2 3 4
// Value: 3 1 3 4 2
// 
// Linked list interpretation:
// 0 -> 3 -> 4 -> 2 -> 3 (cycle!)
//      ↑              ↓
//      <--------------
//
// Duplicate is 3 (appears at indices 0 and 2)
```

### 2. Happy Number Detection

```javascript
function isHappy(n) {
    function getNext(num) {
        let sum = 0;
        while (num > 0) {
            const digit = num % 10;
            sum += digit * digit;
            num = Math.floor(num / 10);
        }
        return sum;
    }
    
    let slow = n;
    let fast = n;
    
    // Use fast-slow to detect cycle
    do {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    } while (slow !== fast);
    
    // If cycle ends at 1, it's happy number
    return slow === 1;
}

// Example: n = 19
// 1² + 9² = 82
// 8² + 2² = 68  
// 6² + 8² = 100
// 1² + 0² + 0² = 1 (happy!)
//
// Example: n = 4  
// 4² = 16
// 1² + 6² = 37
// 3² + 7² = 58
// 5² + 8² = 89
// 8² + 9² = 145
// 1² + 4² + 5² = 42
// 4² + 2² = 20
// 2² + 0² = 4 (cycle detected, not happy)
```

### 3. Cycle in Array

```javascript
function circularArrayLoop(nums) {
    const n = nums.length;
    
    for (let i = 0; i < n; i++) {
        if (nums[i] === 0) continue;
        
        let slow = i;
        let fast = i;
        
        // Check if we can form a valid cycle starting from i
        while (true) {
            slow = getNext(nums, slow);
            fast = getNext(nums, getNext(nums, fast));
            
            if (slow === -1 || fast === -1 || slow === fast) {
                break;
            }
        }
        
        if (slow !== -1 && slow === fast) {
            return true;
        }
    }
    
    return false;
}

function getNext(nums, index) {
    const n = nums.length;
    const direction = nums[index] > 0;
    
    const nextIndex = (index + nums[index]) % n;
    const normalizedIndex = nextIndex < 0 ? nextIndex + n : nextIndex;
    
    // Check if direction changes or self-loop
    if ((nums[normalizedIndex] > 0) !== direction || normalizedIndex === index) {
        return -1;
    }
    
    return normalizedIndex;
}
```

---

## Fast-Slow Pointer Patterns

### Pattern 1: Cycle Detection Template

```javascript
function detectCycleTemplate(structure) {
    let slow = getStart(structure);
    let fast = getStart(structure);
    
    // Phase 1: Detect cycle
    while (hasNext(fast) && hasNext(getNext(fast))) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
        
        if (areEqual(slow, fast)) {
            return true; // Cycle found
        }
    }
    
    return false; // No cycle
}

// Customize these functions for your data structure:
// - getStart(): Get starting position
// - hasNext(): Check if next position exists  
// - getNext(): Get next position
// - areEqual(): Check if two positions are equal
```

### Pattern 2: Middle Finding Template

```javascript
function findMiddleTemplate(structure) {
    let slow = getStart(structure);
    let fast = getStart(structure);
    
    while (hasNext(fast) && hasNext(getNext(fast))) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return slow; // Middle element
}

// For arrays: getNext(i) = i + 1, hasNext(i) = i < length
// For linked lists: getNext(node) = node.next, hasNext(node) = node !== null
```

### Pattern 3: Distance-Based Template

```javascript
function nthFromEndTemplate(structure, n) {
    let slow = getStart(structure);
    let fast = getStart(structure);
    
    // Give fast pointer n-step head start
    for (let i = 0; i < n && hasNext(fast); i++) {
        fast = getNext(fast);
    }
    
    // Move both at same speed
    while (hasNext(fast)) {
        slow = getNext(slow);
        fast = getNext(fast);
    }
    
    return slow;
}
```

---

## Practice Problems by Difficulty

### Easy Fast-Slow Problems
1. **Linked List Cycle** (LeetCode 141) - Basic cycle detection
2. **Middle of Linked List** (LeetCode 876) - Finding middle
3. **Remove Nth Node From End** (LeetCode 19) - Distance-based pointers
4. **Happy Number** (LeetCode 202) - Cycle detection in number sequence
5. **Palindrome Linked List** (LeetCode 234) - Combined techniques

### Medium Fast-Slow Problems  
1. **Linked List Cycle II** (LeetCode 142) - Find cycle start
2. **Find Duplicate Number** (LeetCode 287) - Array cycle detection
3. **Circular Array Loop** (LeetCode 457) - Complex cycle conditions
4. **Rotate List** (LeetCode 61) - Linked list manipulation
5. **Intersection of Two Linked Lists** (LeetCode 160) - Modified fast-slow

### Advanced Fast-Slow Applications
1. **Split Linked List in Parts** (LeetCode 725) - Multiple middle finding
2. **Odd Even Linked List** (LeetCode 328) - Rearrangement using pointers
3. **Reorder List** (LeetCode 143) - Combined middle + reverse
4. **Sort List** (LeetCode 148) - Merge sort with middle finding

---

## Common Mistakes and Solutions

### Mistake 1: Incorrect Speed Settings

```javascript
// Wrong: Both pointers moving at same speed
function hasCycleWrong(head) {
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next; // ❌ Same speed as slow
        
        if (slow === fast) return true;
    }
    
    return false;
}

// Correct: Fast moves twice as fast as slow
function hasCycleCorrect(head) {
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next; // ✅ Twice as fast
        
        if (slow === fast) return true;
    }
    
    return false;
}
```

### Mistake 2: Not Handling Edge Cases

```javascript
// Wrong: Not checking for null pointers
function middleNodeWrong(head) {
    let slow = head;
    let fast = head;
    
    while (fast.next) { // ❌ Will crash if fast is null
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}

// Correct: Proper null checks
function middleNodeCorrect(head) {
    if (!head) return null; // ✅ Handle empty list
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) { // ✅ Check both conditions
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```

### Mistake 3: Wrong Distance Calculation

```javascript
// Wrong: Incorrect head start distance
function removeNthWrong(head, n) {
    let slow = head;
    let fast = head;
    
    // ❌ Only n steps ahead, should be n+1 to get node before target
    for (let i = 0; i < n; i++) {
        fast = fast.next;
    }
    
    while (fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    // slow now points to node to remove, but we need node before it
    return slow;
}

// Correct: Proper distance for getting previous node
function removeNthCorrect(head, n) {
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let slow = dummy;
    let fast = dummy;
    
    // ✅ Move n+1 steps to get node before target
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    while (fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    slow.next = slow.next.next; // ✅ Can safely remove
    return dummy.next;
}
```

---

## Success Metrics

### Week 1: Basic Fast-Slow Understanding
- [ ] Understand why fast-slow pointers work for cycles
- [ ] Implement basic cycle detection in linked list
- [ ] Find middle of linked list using fast-slow
- [ ] Master the speed relationship (1:2 ratio)

### Week 2: Advanced Cycle Problems
- [ ] Find start of cycle using Floyd's algorithm
- [ ] Detect cycles in arrays and number sequences
- [ ] Handle edge cases in cycle detection
- [ ] Understand the mathematical proof behind cycle start

### Week 3: Complex Pointer Manipulation
- [ ] Remove nth node from end efficiently
- [ ] Check palindrome linked list with O(1) space
- [ ] Combine fast-slow with other techniques
- [ ] Solve distance-based pointer problems

### Week 4: Expert Fast-Slow Applications
- [ ] Apply pattern to non-obvious problems
- [ ] Optimize solutions using fast-slow pointers
- [ ] Handle complex edge cases confidently
- [ ] Ready for any FAANG fast-slow pointer interview

**Remember**: Fast-slow pointers exploit relative motion to reveal hidden structure. Think about what information the different speeds give you about the problem!