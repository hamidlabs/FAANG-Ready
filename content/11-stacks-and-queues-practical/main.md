# Stacks and Queues - Practical Guide

## Purpose

This guide explains stacks and queues from absolute basics to real-world applications. As a full-stack developer, you've actually used these concepts in your Next.js/Express applications without realizing it!

**Key Insight**: Stacks and queues are just specialized arrays with restricted access patterns that solve specific problems efficiently.

---

## What Are Stacks (Complete Explanation)

### The Stack Concept

A **stack** is a data structure that follows **LIFO** (Last In, First Out) principle. Think of it like a stack of plates - you can only add or remove plates from the top.

**Real-world analogies**:
- Stack of books: Take from top, add to top
- Browser history: Back button removes last visited page
- Function calls: Last function called is first to return
- Undo operations: Last action is first to be undone

### Stack in Your Development Experience

**You've used stacks in**:
```javascript
// JavaScript call stack
function first() {
    console.log('First function');
    second();  // Calls second, waits for it to finish
}

function second() {
    console.log('Second function');
    third();   // Calls third, waits for it to finish
}

function third() {
    console.log('Third function');
}

first();

// Call stack visualization:
// Step 1: [first]
// Step 2: [first, second]  
// Step 3: [first, second, third]
// Step 4: [first, second] (third returns)
// Step 5: [first] (second returns)
// Step 6: [] (first returns)
```

### Basic Stack Operations

```javascript
class Stack {
    constructor() {
        this.items = [];  // Internal array storage
    }
    
    // Add element to top - O(1)
    push(element) {
        this.items.push(element);
        return this.size();
    }
    
    // Remove and return top element - O(1)
    pop() {
        if (this.isEmpty()) {
            return null;  // or throw error
        }
        return this.items.pop();
    }
    
    // Look at top element without removing - O(1)
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }
    
    // Check if stack is empty - O(1)
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Get number of elements - O(1)
    size() {
        return this.items.length;
    }
    
    // Display stack contents
    display() {
        console.log('Stack (top to bottom):', [...this.items].reverse());
    }
}

// Usage example
let stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
stack.display();  // [30, 20, 10]

console.log(stack.pop());   // 30
console.log(stack.peek());  // 20
console.log(stack.size());  // 2
```

---

## What Are Queues (Complete Explanation)

### The Queue Concept

A **queue** is a data structure that follows **FIFO** (First In, First Out) principle. Think of it like a line at a coffee shop - first person in line is first to be served.

**Real-world analogies**:
- Queue at bank: First person in line is served first
- Print queue: Documents print in order they were submitted
- Task processing: Process tasks in order they arrive
- Breadth-first search: Explore nodes level by level

### Queue in Your Development Experience

**You've used queues in**:
```javascript
// Event handling in JavaScript (Event Queue)
console.log('1');

setTimeout(() => {
    console.log('2');  // Goes to event queue
}, 0);

console.log('3');

// Output: 1, 3, 2
// Because setTimeout callback goes to queue and waits for main thread
```

### Basic Queue Operations

```javascript
class Queue {
    constructor() {
        this.items = [];  // Internal array storage
    }
    
    // Add element to rear/back - O(1)
    enqueue(element) {
        this.items.push(element);
        return this.size();
    }
    
    // Remove and return front element - O(n) for array implementation
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();  // Removes first element
    }
    
    // Look at front element without removing - O(1)
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }
    
    // Look at rear element without removing - O(1)
    rear() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }
    
    // Check if queue is empty - O(1)
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Get number of elements - O(1)
    size() {
        return this.items.length;
    }
    
    // Display queue contents
    display() {
        console.log('Queue (front to rear):', this.items);
    }
}

// Usage example
let queue = new Queue();
queue.enqueue('Alice');
queue.enqueue('Bob');
queue.enqueue('Charlie');
queue.display();  // ['Alice', 'Bob', 'Charlie']

console.log(queue.dequeue());  // 'Alice'
console.log(queue.front());    // 'Bob'
console.log(queue.size());     // 2
```

### Efficient Queue Implementation

The array-based queue above has O(n) dequeue operation because `shift()` moves all elements. For better performance:

```javascript
class EfficientQueue {
    constructor() {
        this.items = {};
        this.headIndex = 0;
        this.tailIndex = 0;
    }
    
    // Add to rear - O(1)
    enqueue(element) {
        this.items[this.tailIndex] = element;
        this.tailIndex++;
        return this.size();
    }
    
    // Remove from front - O(1)
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        
        const item = this.items[this.headIndex];
        delete this.items[this.headIndex];
        this.headIndex++;
        return item;
    }
    
    // Check size - O(1)
    size() {
        return this.tailIndex - this.headIndex;
    }
    
    isEmpty() {
        return this.size() === 0;
    }
    
    front() {
        return this.isEmpty() ? null : this.items[this.headIndex];
    }
}
```

---

## Real FAANG Interview Problems

### Problem 1: Valid Parentheses

**Google/Amazon/Meta**: "Given a string containing parentheses, determine if they are valid."

**Complete Solution with Stack**:
```javascript
function isValid(s) {
    const stack = [];
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        // If opening bracket, push to stack
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        }
        // If closing bracket
        else if (char === ')' || char === '}' || char === ']') {
            // Check if stack is empty or doesn't match
            if (stack.length === 0 || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }
    
    // Valid if all brackets are matched (stack is empty)
    return stack.length === 0;
}

// Test cases
console.log(isValid("()"));        // true
console.log(isValid("()[]{}"));    // true
console.log(isValid("(]"));        // false
console.log(isValid("([)]"));      // false

// LeetCode 20: https://leetcode.com/problems/valid-parentheses/
// Time: O(n), Space: O(n)
```

### Problem 2: Min Stack

**Google/Apple**: "Design a stack that supports push, pop, top, and retrieving minimum element in O(1)."

**Complete Solution**:
```javascript
class MinStack {
    constructor() {
        this.stack = [];     // Main stack
        this.minStack = [];  // Stack to track minimums
    }
    
    // Push element - O(1)
    push(val) {
        this.stack.push(val);
        
        // Update min stack
        if (this.minStack.length === 0 || val <= this.getMin()) {
            this.minStack.push(val);
        }
    }
    
    // Pop element - O(1)
    pop() {
        if (this.stack.length === 0) return;
        
        const popped = this.stack.pop();
        
        // If popped element was the minimum, remove from min stack too
        if (popped === this.getMin()) {
            this.minStack.pop();
        }
    }
    
    // Get top element - O(1)
    top() {
        return this.stack.length === 0 ? null : this.stack[this.stack.length - 1];
    }
    
    // Get minimum element - O(1)
    getMin() {
        return this.minStack.length === 0 ? null : this.minStack[this.minStack.length - 1];
    }
}

// Usage
let minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin()); // -3
minStack.pop();
console.log(minStack.top());    // 0
console.log(minStack.getMin()); // -2

// LeetCode 155: https://leetcode.com/problems/min-stack/
// All operations: O(1)
```

### Problem 3: Implement Queue Using Stacks

**Amazon/Microsoft**: "Implement a queue using only stack operations."

**Complete Solution**:
```javascript
class MyQueue {
    constructor() {
        this.inStack = [];   // For enqueue operations
        this.outStack = [];  // For dequeue operations
    }
    
    // Add element to rear - Amortized O(1)
    push(x) {
        this.inStack.push(x);
    }
    
    // Remove element from front - Amortized O(1)
    pop() {
        this.peek();  // Ensure outStack has elements
        return this.outStack.pop();
    }
    
    // Get front element - Amortized O(1)
    peek() {
        // If outStack is empty, transfer all from inStack
        if (this.outStack.length === 0) {
            while (this.inStack.length > 0) {
                this.outStack.push(this.inStack.pop());
            }
        }
        return this.outStack[this.outStack.length - 1];
    }
    
    // Check if queue is empty - O(1)
    empty() {
        return this.inStack.length === 0 && this.outStack.length === 0;
    }
}

// Example usage
let queue = new MyQueue();
queue.push(1);
queue.push(2);
console.log(queue.peek());  // 1
console.log(queue.pop());   // 1
console.log(queue.empty()); // false

// LeetCode 232: https://leetcode.com/problems/implement-queue-using-stacks/
```

### Problem 4: Daily Temperatures

**Meta/Google**: "Find how many days you have to wait for warmer temperature."

**Complete Solution with Stack**:
```javascript
function dailyTemperatures(temperatures) {
    const result = new Array(temperatures.length).fill(0);
    const stack = []; // Stack of indices
    
    for (let i = 0; i < temperatures.length; i++) {
        // While stack not empty and current temp > temp at top of stack
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            result[prevIndex] = i - prevIndex; // Days to wait
        }
        
        stack.push(i); // Push current index
    }
    
    return result;
}

// Example
const temps = [73, 74, 75, 71, 69, 72, 76, 73];
console.log(dailyTemperatures(temps)); 
// [1, 1, 4, 2, 1, 1, 0, 0]
// 73->74: 1 day, 74->75: 1 day, 75->76: 4 days, etc.

// LeetCode 739: https://leetcode.com/problems/daily-temperatures/
// Time: O(n), Space: O(n)
```

### Problem 5: Moving Average from Data Stream

**Google/LinkedIn**: "Calculate moving average of last n numbers from data stream."

**Complete Solution with Queue**:
```javascript
class MovingAverage {
    constructor(size) {
        this.size = size;
        this.queue = [];
        this.sum = 0;
    }
    
    // Add new value and return current average - O(1)
    next(val) {
        this.queue.push(val);
        this.sum += val;
        
        // If queue exceeds size, remove oldest element
        if (this.queue.length > this.size) {
            this.sum -= this.queue.shift();
        }
        
        return this.sum / this.queue.length;
    }
}

// Usage
let ma = new MovingAverage(3);
console.log(ma.next(1));    // 1.0
console.log(ma.next(10));   // 5.5
console.log(ma.next(3));    // 4.67
console.log(ma.next(5));    // 6.0 (average of 10, 3, 5)

// LeetCode 346: https://leetcode.com/problems/moving-average-from-data-stream/
// Time: O(1) per operation, Space: O(size)
```

---

## Real-World Applications

### 1. Browser History (Stack)

```javascript
class BrowserHistory {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
    }
    
    visit(url) {
        // Remove any forward history when visiting new page
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(url);
        this.currentIndex++;
        return url;
    }
    
    back(steps = 1) {
        this.currentIndex = Math.max(0, this.currentIndex - steps);
        return this.history[this.currentIndex];
    }
    
    forward(steps = 1) {
        this.currentIndex = Math.min(
            this.history.length - 1, 
            this.currentIndex + steps
        );
        return this.history[this.currentIndex];
    }
}
```

### 2. Task Queue System (Queue)

```javascript
class TaskQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    
    // Add task to queue
    addTask(task) {
        this.queue.push(task);
        if (!this.processing) {
            this.processTasks();
        }
    }
    
    // Process tasks in FIFO order
    async processTasks() {
        this.processing = true;
        
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            try {
                await task();  // Execute task
                console.log('Task completed');
            } catch (error) {
                console.error('Task failed:', error);
            }
        }
        
        this.processing = false;
    }
}

// Usage in your Express.js app
const taskQueue = new TaskQueue();

// Add email sending task
taskQueue.addTask(async () => {
    // Send email logic here
    console.log('Email sent');
});

// Add database cleanup task
taskQueue.addTask(async () => {
    // Database cleanup logic
    console.log('Database cleaned');
});
```

### 3. Undo/Redo Functionality (Two Stacks)

```javascript
class UndoRedoSystem {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }
    
    // Execute command and save for undo
    executeCommand(command) {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = []; // Clear redo stack on new command
    }
    
    // Undo last command
    undo() {
        if (this.undoStack.length === 0) return false;
        
        const command = this.undoStack.pop();
        command.undo();
        this.redoStack.push(command);
        return true;
    }
    
    // Redo last undone command
    redo() {
        if (this.redoStack.length === 0) return false;
        
        const command = this.redoStack.pop();
        command.execute();
        this.undoStack.push(command);
        return true;
    }
}

// Example command
class TextCommand {
    constructor(text, position) {
        this.text = text;
        this.position = position;
        this.previousText = '';
    }
    
    execute() {
        // Save current state and insert text
        this.previousText = document.getCurrentText();
        document.insertText(this.text, this.position);
    }
    
    undo() {
        // Restore previous state
        document.setText(this.previousText);
    }
}
```

---

## When to Use Stack vs Queue

### Use Stack When:
- **LIFO order needed**: Last operation should be undone first
- **Function calls**: Recursive algorithms, parsing expressions
- **Balancing**: Parentheses matching, tag validation
- **Backtracking**: DFS algorithms, maze solving
- **Memory management**: Function call frames

### Use Queue When:
- **FIFO order needed**: First request should be served first
- **Scheduling**: Task queues, print queues
- **Breadth-First Search**: Tree/graph traversal level by level
- **Buffer**: Data streaming, producer-consumer problems
- **Fair resource allocation**: Round-robin scheduling

### In Your Web Development:

**Stacks in Frontend**:
- Component render stack
- Error handling (try-catch stack)
- Browser history
- Undo operations in text editors

**Queues in Backend**:
- Request processing queue
- Email sending queue
- Background job processing
- Rate limiting (request queues)

---

## Advanced Stack/Queue Problems

### Monotonic Stack Pattern

**When to use**: Finding next/previous greater/smaller elements

```javascript
function nextGreaterElement(nums) {
    const result = new Array(nums.length).fill(-1);
    const stack = []; // Stack of indices
    
    for (let i = 0; i < nums.length; i++) {
        // While stack not empty and current > top of stack
        while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = nums[i]; // Found next greater element
        }
        stack.push(i);
    }
    
    return result;
}

// Example: [2, 1, 2, 4, 3, 1] → [4, 2, 4, -1, -1, -1]
```

### Sliding Window Maximum (Dequeue)

```javascript
function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // Store indices of useful elements
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside current window
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }
        
        // Remove indices of smaller elements from rear
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
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

---

## Practice Problems by Difficulty

### Easy Problems (Stack)
1. **Valid Parentheses** (LeetCode 20)
2. **Baseball Game** (LeetCode 682)
3. **Remove All Adjacent Duplicates in String** (LeetCode 1047)

### Easy Problems (Queue)
1. **Implement Stack using Queues** (LeetCode 225)
2. **Number of Recent Calls** (LeetCode 933)

### Medium Problems (Stack)
1. **Min Stack** (LeetCode 155)
2. **Daily Temperatures** (LeetCode 739)
3. **Next Greater Element II** (LeetCode 503)
4. **Evaluate Reverse Polish Notation** (LeetCode 150)

### Medium Problems (Queue)
1. **Design Circular Queue** (LeetCode 622)
2. **Moving Average from Data Stream** (LeetCode 346)

### Hard Problems
1. **Sliding Window Maximum** (LeetCode 239) - Deque
2. **Largest Rectangle in Histogram** (LeetCode 84) - Monotonic Stack

---

## Success Metrics

### Week 1: Understand Concepts
- [ ] Understand LIFO vs FIFO principles
- [ ] Can implement basic stack and queue operations
- [ ] Recognize when to use stack vs queue

### Week 2: Problem Solving
- [ ] Solve valid parentheses and basic stack problems
- [ ] Comfortable with queue operations and use cases
- [ ] Can explain stack/queue applications in web development

### Week 3: Advanced Applications
- [ ] Understand monotonic stack pattern
- [ ] Can solve medium difficulty stack/queue problems
- [ ] Recognize stack/queue patterns in complex problems

### Week 4: Interview Ready
- [ ] Solve any stack/queue problem systematically
- [ ] Can implement efficient versions of both data structures
- [ ] Ready for stack/queue interview questions

**Remember**: Stacks and queues are building blocks for more complex algorithms. Master them, and you'll recognize these patterns everywhere in advanced topics!