# Linked Lists From Zero

## Purpose

This guide explains linked lists from absolute basics to FAANG interview mastery. As someone who works with arrays in Next.js/Express, think of linked lists as a different way to organize data where elements don't need to be next to each other in memory.

**Key Insight**: Linked lists trade random access (arrays) for efficient insertion/deletion at any position.

---

## What Are Linked Lists (Complete Explanation)

### The Problem with Arrays

In your Next.js applications, when you use arrays:
```javascript
let users = ['Alice', 'Bob', 'Charlie'];
```

In memory, this looks like:
```
Memory: ['Alice']['Bob']['Charlie']
Address:  1000    1004    1008
```

**Problems with arrays:**
- **Fixed size**: Hard to grow/shrink
- **Expensive insertion**: Adding 'Dave' at the beginning means moving everyone
- **Memory waste**: Must allocate maximum expected size

### The Linked List Solution

A linked list stores data in **nodes**, where each node contains:
1. **Data**: The actual value
2. **Next**: Pointer/reference to the next node

```javascript
// Single node structure
class ListNode {
    constructor(val) {
        this.val = val;      // The data
        this.next = null;    // Pointer to next node
    }
}
```

**Visual representation:**
```
[Data|Next] -> [Data|Next] -> [Data|Next] -> null
  Alice         Bob           Charlie
   1000         2500           3200
```

Each node can be anywhere in memory - they're connected by pointers, not physical location.

---

## Building Linked Lists From Scratch

### Creating Individual Nodes

```javascript
// Create nodes
let node1 = new ListNode('Alice');
let node2 = new ListNode('Bob');
let node3 = new ListNode('Charlie');

// Connect them
node1.next = node2;  // Alice points to Bob
node2.next = node3;  // Bob points to Charlie
// node3.next is already null (end of list)

// Now we have: Alice -> Bob -> Charlie -> null
```

### Linked List Class Implementation

```javascript
class LinkedList {
    constructor() {
        this.head = null;  // Points to first node
        this.size = 0;     // Track list length
    }
    
    // Add element to the end
    append(val) {
        const newNode = new ListNode(val);
        
        // If list is empty, new node becomes head
        if (!this.head) {
            this.head = newNode;
        } else {
            // Find the last node
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            // Connect last node to new node
            current.next = newNode;
        }
        
        this.size++;
    }
    
    // Add element to the beginning
    prepend(val) {
        const newNode = new ListNode(val);
        newNode.next = this.head;  // New node points to current head
        this.head = newNode;       // New node becomes head
        this.size++;
    }
    
    // Display the list
    display() {
        if (!this.head) {
            console.log('List is empty');
            return;
        }
        
        let result = [];
        let current = this.head;
        while (current) {
            result.push(current.val);
            current = current.next;
        }
        console.log(result.join(' -> '));
    }
}

// Usage example
let list = new LinkedList();
list.append('Alice');
list.append('Bob');
list.prepend('Charlie');
list.display();  // Charlie -> Alice -> Bob
```

---

## Essential Linked List Operations

### 1. Traversal (Visiting Each Node) - O(n)

```javascript
function traverseList(head) {
    let current = head;
    
    while (current !== null) {
        console.log(current.val);  // Process current node
        current = current.next;    // Move to next node
    }
}

// Alternative: Recursive traversal
function traverseRecursive(head) {
    if (head === null) return;  // Base case
    
    console.log(head.val);           // Process current
    traverseRecursive(head.next);    // Recurse on rest
}
```

### 2. Searching - O(n)

```javascript
function findNode(head, target) {
    let current = head;
    let index = 0;
    
    while (current !== null) {
        if (current.val === target) {
            return index;  // Found at this position
        }
        current = current.next;
        index++;
    }
    
    return -1;  // Not found
}
```

### 3. Insertion Operations

**Insert at Beginning - O(1)**:
```javascript
function insertAtHead(head, val) {
    const newNode = new ListNode(val);
    newNode.next = head;
    return newNode;  // New head
}
```

**Insert at End - O(n)**:
```javascript
function insertAtTail(head, val) {
    const newNode = new ListNode(val);
    
    if (!head) return newNode;  // List was empty
    
    // Find last node
    let current = head;
    while (current.next) {
        current = current.next;
    }
    
    current.next = newNode;
    return head;  // Head unchanged
}
```

**Insert at Specific Position - O(n)**:
```javascript
function insertAtPosition(head, val, position) {
    if (position === 0) {
        return insertAtHead(head, val);
    }
    
    const newNode = new ListNode(val);
    let current = head;
    
    // Navigate to position-1
    for (let i = 0; i < position - 1 && current; i++) {
        current = current.next;
    }
    
    if (!current) {
        throw new Error('Position out of bounds');
    }
    
    // Insert between current and current.next
    newNode.next = current.next;
    current.next = newNode;
    
    return head;
}
```

### 4. Deletion Operations

**Delete First Node - O(1)**:
```javascript
function deleteHead(head) {
    if (!head) return null;  // Empty list
    return head.next;        // Second node becomes new head
}
```

**Delete Last Node - O(n)**:
```javascript
function deleteTail(head) {
    if (!head) return null;          // Empty list
    if (!head.next) return null;     // Only one node
    
    // Find second-to-last node
    let current = head;
    while (current.next.next) {
        current = current.next;
    }
    
    current.next = null;  // Remove last node
    return head;
}
```

**Delete by Value - O(n)**:
```javascript
function deleteByValue(head, val) {
    if (!head) return null;
    
    // If head node has the value
    if (head.val === val) {
        return head.next;
    }
    
    let current = head;
    while (current.next && current.next.val !== val) {
        current = current.next;
    }
    
    // If found, remove it
    if (current.next) {
        current.next = current.next.next;
    }
    
    return head;
}
```

---

## Real FAANG Interview Problems

### Problem 1: Reverse Linked List

**Google/Amazon/Meta**: "Reverse a singly linked list."

**Complete Solution with Explanation**:
```javascript
function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        let nextTemp = current.next;  // Save next node
        current.next = prev;          // Reverse the link
        prev = current;               // Move prev forward
        current = nextTemp;           // Move current forward
    }
    
    return prev;  // prev is now the new head
}

// Visual walkthrough:
// Original: 1 -> 2 -> 3 -> null
// Step 1:   null <- 1    2 -> 3 -> null
// Step 2:   null <- 1 <- 2    3 -> null
// Step 3:   null <- 1 <- 2 <- 3
// Result:   3 -> 2 -> 1 -> null

// LeetCode 206: https://leetcode.com/problems/reverse-linked-list/
// Time: O(n), Space: O(1)
```

**Recursive Solution**:
```javascript
function reverseListRecursive(head) {
    // Base case: empty or single node
    if (!head || !head.next) {
        return head;
    }
    
    // Reverse the rest of the list
    const newHead = reverseListRecursive(head.next);
    
    // Reverse current connection
    head.next.next = head;
    head.next = null;
    
    return newHead;
}

// Time: O(n), Space: O(n) due to recursion stack
```

### Problem 2: Detect Cycle in Linked List

**Google/Meta**: "Determine if a linked list has a cycle."

**Complete Solution with Explanation**:
```javascript
function hasCycle(head) {
    if (!head || !head.next) return false;
    
    let slow = head;      // Tortoise moves 1 step
    let fast = head;      // Hare moves 2 steps
    
    while (fast && fast.next) {
        slow = slow.next;       // Move 1 step
        fast = fast.next.next;  // Move 2 steps
        
        if (slow === fast) {
            return true;  // Cycle detected
        }
    }
    
    return false;  // No cycle
}

// Visual explanation:
// If there's a cycle, the fast pointer will eventually catch up to slow pointer
// Like a track race where faster runner laps slower runner

// LeetCode 141: https://leetcode.com/problems/linked-list-cycle/
// Time: O(n), Space: O(1)
```

### Problem 3: Merge Two Sorted Lists

**Amazon/Apple**: "Merge two sorted linked lists into one sorted list."

**Complete Solution with Explanation**:
```javascript
function mergeTwoLists(list1, list2) {
    // Create dummy node to simplify logic
    const dummy = new ListNode(0);
    let current = dummy;
    
    // Compare and merge while both lists have nodes
    while (list1 && list2) {
        if (list1.val <= list2.val) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }
    
    // Attach remaining nodes (if any)
    current.next = list1 || list2;
    
    return dummy.next;  // Skip dummy node
}

// Example:
// list1: 1 -> 2 -> 4
// list2: 1 -> 3 -> 4
// result: 1 -> 1 -> 2 -> 3 -> 4 -> 4

// LeetCode 21: https://leetcode.com/problems/merge-two-sorted-lists/
// Time: O(m + n), Space: O(1)
```

### Problem 4: Remove Nth Node From End

**Microsoft/Meta**: "Remove the nth node from the end of the list."

**Complete Solution with Explanation**:
```javascript
function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0);
    dummy.next = head;
    
    let first = dummy;
    let second = dummy;
    
    // Move first pointer n+1 steps ahead
    for (let i = 0; i <= n; i++) {
        first = first.next;
    }
    
    // Move both pointers until first reaches end
    while (first !== null) {
        first = first.next;
        second = second.next;
    }
    
    // Remove the nth node from end
    second.next = second.next.next;
    
    return dummy.next;
}

// Two-pointer technique:
// When first pointer reaches end, second pointer is at (n+1)th from end
// This allows us to remove nth from end in one pass

// LeetCode 19: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
// Time: O(n), Space: O(1)
```

### Problem 5: Find Middle of Linked List

**Amazon/Google**: "Find the middle node of a linked list."

**Complete Solution with Explanation**:
```javascript
function findMiddle(head) {
    if (!head) return null;
    
    let slow = head;
    let fast = head;
    
    // Fast moves 2 steps, slow moves 1 step
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;  // Slow is at middle when fast reaches end
}

// For odd length: slow reaches exact middle
// For even length: slow reaches second middle node

// LeetCode 876: https://leetcode.com/problems/middle-of-the-linked-list/
// Time: O(n), Space: O(1)
```

---

## Advanced Linked List Concepts

### Doubly Linked Lists

**What is it**: Each node has pointers to both next AND previous nodes.

```javascript
class DoublyListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    // Add to end - O(1) with tail pointer
    append(val) {
        const newNode = new DoublyListNode(val);
        
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        
        this.size++;
    }
    
    // Remove from anywhere - O(1) if you have node reference
    removeNode(node) {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }
        
        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
        
        this.size--;
    }
}
```

### Circular Linked Lists

**What is it**: Last node points back to first node, forming a circle.

```javascript
// In circular list, there's no null - last.next = head
function isCircular(head) {
    if (!head) return false;
    
    let current = head;
    do {
        current = current.next;
        if (current === head) return true;
    } while (current && current !== head);
    
    return false;
}
```

---

## When to Use Linked Lists vs Arrays

### Use Linked Lists When:
- **Frequent insertion/deletion** at beginning or middle
- **Unknown size** - list grows/shrinks dynamically  
- **Memory scattered** - don't need contiguous memory
- **Implementing other data structures** (stacks, queues)

### Use Arrays When:
- **Random access needed** - need to jump to specific index
- **Memory efficiency important** - no extra pointer storage
- **Cache performance matters** - better locality of reference
- **Mathematical operations** - easier to implement algorithms

### Real-World Examples:

**Linked Lists in Practice**:
```javascript
// Browser history (back/forward buttons)
class BrowserHistory {
    constructor() {
        this.current = null;  // Current page
    }
    
    visit(url) {
        const page = new ListNode(url);
        page.prev = this.current;
        if (this.current) {
            this.current.next = page;
        }
        this.current = page;
    }
    
    back() {
        if (this.current && this.current.prev) {
            this.current = this.current.prev;
            return this.current.val;
        }
        return null;
    }
    
    forward() {
        if (this.current && this.current.next) {
            this.current = this.current.next;
            return this.current.val;
        }
        return null;
    }
}
```

---

## Common Linked List Mistakes

### Mistake 1: Losing Reference to Head
```javascript
// Wrong: Modifying head directly
function traverse(head) {
    while (head) {  // ❌ Modifying original head
        console.log(head.val);
        head = head.next;
    }
}

// Correct: Use separate pointer
function traverse(head) {
    let current = head;  // ✅ Preserve original head
    while (current) {
        console.log(current.val);
        current = current.next;
    }
}
```

### Mistake 2: Not Handling Empty Lists
```javascript
// Wrong: Assuming head exists
function getFirst(head) {
    return head.val;  // ❌ Crashes if head is null
}

// Correct: Check for null
function getFirst(head) {
    return head ? head.val : null;  // ✅ Safe
}
```

### Mistake 3: Memory Leaks in Deletion
```javascript
// Wrong: Just removing reference
function deleteNode(prev, nodeToDelete) {
    prev.next = nodeToDelete.next;  // ❌ nodeToDelete still exists
}

// Better: Clear the deleted node
function deleteNode(prev, nodeToDelete) {
    prev.next = nodeToDelete.next;
    nodeToDelete.next = null;  // ✅ Help garbage collection
}
```

---

## Practice Problems by Difficulty

### Easy Problems (Start Here)
1. **Reverse Linked List** (LeetCode 206)
2. **Merge Two Sorted Lists** (LeetCode 21)  
3. **Remove Duplicates from Sorted List** (LeetCode 83)
4. **Middle of the Linked List** (LeetCode 876)
5. **Convert Binary Number in Linked List to Integer** (LeetCode 1290)

### Medium Problems
1. **Add Two Numbers** (LeetCode 2)
2. **Remove Nth Node From End of List** (LeetCode 19)
3. **Rotate List** (LeetCode 61)
4. **Sort List** (LeetCode 148)
5. **Copy List with Random Pointer** (LeetCode 138)

### Hard Problems
1. **Merge k Sorted Lists** (LeetCode 23)
2. **Reverse Nodes in k-Group** (LeetCode 25)

---

## Success Metrics

### Week 1: Understand the Concept
- [ ] Understand what linked lists are and why they exist
- [ ] Can create and traverse a simple linked list
- [ ] Solve basic insertion/deletion problems

### Week 2: Master Basic Operations  
- [ ] Comfortable with all CRUD operations on linked lists
- [ ] Can solve reverse linked list and cycle detection
- [ ] Understand two-pointer technique

### Week 3: Problem-Solving Fluency
- [ ] Solve medium linked list problems confidently
- [ ] Can explain solutions while coding
- [ ] Understand trade-offs vs arrays

### Week 4: Interview Ready
- [ ] Solve any linked list problem using systematic approach
- [ ] Can handle edge cases automatically
- [ ] Ready for linked list interview questions

**Remember**: Linked lists are fundamental to many other data structures. Master them here, and you'll understand stacks, queues, and trees much more easily!