# Greedy Algorithms Pattern

## Purpose

Greedy algorithms provide optimal solutions by making locally optimal choices at each step. They appear in 20% of FAANG interviews and offer elegant solutions to optimization problems. Master greedy thinking to solve complex problems with surprisingly simple approaches.

**Key Insight**: Sometimes being "greedy" (choosing what looks best right now) leads to the globally optimal solution. The art is recognizing when this works and proving it's correct.

---

## What are Greedy Algorithms (From Zero)

**Greedy Algorithm**: Make the choice that looks best at the current moment, never reconsidering previous decisions.

```javascript
// Example: Making change with coins
// Problem: Give change for $0.67 using fewest coins
// Available: quarters ($0.25), dimes ($0.10), nickels ($0.05), pennies ($0.01)

function makeChangeGreedy(amount) {
    const coins = [25, 10, 5, 1]; // Sorted by value (largest first)
    const result = [];
    let remaining = Math.round(amount * 100); // Convert to cents
    
    for (let coin of coins) {
        while (remaining >= coin) {
            result.push(coin);
            remaining -= coin;
        }
    }
    
    return result;
}

// For $0.67: [25, 25, 10, 5, 1, 1] - 6 coins total
// Greedy choice: Always take largest coin possible
// This works for US currency because it's specially designed
```

**Why Greedy Works (When It Does):**
- **Greedy Choice Property**: Local optimum leads to global optimum
- **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
- **No Backtracking**: Once choice is made, never reconsider

**When Greedy Fails:**
```javascript
// Counter-example: coins = [1, 3, 4], amount = 6
// Greedy: 4 + 1 + 1 = 3 coins
// Optimal: 3 + 3 = 2 coins
// Greedy doesn't always work!
```

---

## Greedy vs Other Approaches

### Greedy vs Dynamic Programming

```javascript
// Problem: Coin change with coins [1, 3, 4], amount = 6

// Greedy approach (incorrect for this case)
function coinChangeGreedy(coins, amount) {
    coins.sort((a, b) => b - a); // Largest first
    let count = 0;
    
    for (let coin of coins) {
        while (amount >= coin) {
            amount -= coin;
            count++;
        }
    }
    
    return amount === 0 ? count : -1;
}
// Result: 3 coins (4 + 1 + 1)

// DP approach (always correct)  
function coinChangeDP(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}
// Result: 2 coins (3 + 3)
```

### When to Choose Greedy

**Use Greedy When:**
1. **Greedy choice property** can be proven
2. **Optimal substructure** exists
3. **Problem has matroid structure** (advanced concept)
4. **Intuition suggests** local optimum → global optimum

**Examples Where Greedy Works:**
- Activity selection (choose earliest ending)
- Huffman coding (merge least frequent)
- Minimum spanning tree (choose cheapest edge)
- Fractional knapsack (choose best value/weight ratio)

---

## Classic Greedy Algorithm Types

### Type 1: Activity Selection

**Pattern**: Choose activities that don't conflict, maximize count.

```javascript
// Template for activity selection
function activitySelection(activities) {
    // Sort by finish time (greedy choice)
    activities.sort((a, b) => a.end - b.end);
    
    const selected = [];
    let lastEndTime = -1;
    
    for (let activity of activities) {
        // If activity starts after last one ends
        if (activity.start >= lastEndTime) {
            selected.push(activity);
            lastEndTime = activity.end;
        }
    }
    
    return selected;
}

// Why this works: 
// - Always choose activity that finishes earliest
// - This leaves maximum time for remaining activities
// - Provably optimal
```

### Type 2: Huffman Coding

**Pattern**: Build optimal prefix codes by merging least frequent elements.

```javascript
// Template for Huffman coding
class Node {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

function huffmanCoding(charFreq) {
    // Create min heap of nodes
    const heap = charFreq.map(([char, freq]) => new Node(char, freq));
    
    // Build Huffman tree
    while (heap.length > 1) {
        heap.sort((a, b) => a.freq - b.freq); // Simple sort (use real heap for efficiency)
        
        // Take two least frequent nodes (greedy choice)
        const left = heap.shift();
        const right = heap.shift();
        
        // Create new internal node
        const merged = new Node(null, left.freq + right.freq, left, right);
        heap.push(merged);
    }
    
    return heap[0]; // Root of Huffman tree
}

// Why greedy works:
// - Always merge two least frequent nodes
// - Minimizes weighted path length
// - Proven optimal for prefix codes
```

### Type 3: Greedy Graph Algorithms

**Pattern**: Make locally optimal choices for global graph properties.

```javascript
// Kruskal's Minimum Spanning Tree
function kruskalMST(edges, numVertices) {
    // Sort edges by weight (greedy choice)
    edges.sort((a, b) => a.weight - b.weight);
    
    const parent = Array(numVertices).fill(0).map((_, i) => i);
    const mst = [];
    
    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }
    
    function union(x, y) {
        const px = find(x);
        const py = find(y);
        if (px !== py) {
            parent[px] = py;
            return true;
        }
        return false;
    }
    
    for (let edge of edges) {
        if (union(edge.u, edge.v)) {
            mst.push(edge);
            if (mst.length === numVertices - 1) break;
        }
    }
    
    return mst;
}
```

---

## Real FAANG Interview Problems

### Problem 1: Jump Game

**Google/Meta**: "Can you reach the last index by jumping at most arr[i] steps from index i?"

**Complete Solution**:
```javascript
function canJump(nums) {
    let farthest = 0; // Farthest index we can reach
    
    for (let i = 0; i < nums.length; i++) {
        // If current position is unreachable, return false
        if (i > farthest) return false;
        
        // Update farthest reachable position (greedy choice)
        farthest = Math.max(farthest, i + nums[i]);
        
        // If we can reach the end, return true
        if (farthest >= nums.length - 1) return true;
    }
    
    return farthest >= nums.length - 1;
}

// Greedy strategy: Always track the farthest we can reach
// At each position, extend our reach as much as possible

// Example: nums = [2,3,1,1,4]
// i=0: farthest = max(0, 0+2) = 2
// i=1: farthest = max(2, 1+3) = 4 (can reach end!)
// i=2: farthest = max(4, 2+1) = 4
// Return true

// Example: nums = [3,2,1,0,4]  
// i=0: farthest = max(0, 0+3) = 3
// i=1: farthest = max(3, 1+2) = 3
// i=2: farthest = max(3, 2+1) = 3
// i=3: farthest = max(3, 3+0) = 3
// i=4: i=4 > farthest=3, return false

// Time: O(n), Space: O(1)
```

### Problem 2: Gas Station

**Amazon/Microsoft**: "Find starting gas station to complete circular route."

**Complete Solution**:
```javascript
function canCompleteCircuit(gas, cost) {
    let totalTank = 0;
    let currentTank = 0;
    let start = 0;
    
    for (let i = 0; i < gas.length; i++) {
        const netGas = gas[i] - cost[i];
        totalTank += netGas;
        currentTank += netGas;
        
        // If we can't reach next station from current start
        if (currentTank < 0) {
            // Try starting from next station (greedy choice)
            start = i + 1;
            currentTank = 0;
        }
    }
    
    // If total gas >= total cost, solution exists
    return totalTank >= 0 ? start : -1;
}

// Greedy insight: If we can't reach station i+1 from any station in [start, i],
// then stations [start, i] are all invalid starting points
// So we greedily try starting from i+1

// Example: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
// net = [-2,-2,-2,3,3]
//
// i=0: totalTank=-2, currentTank=-2 < 0, start=1, currentTank=0
// i=1: totalTank=-4, currentTank=-2 < 0, start=2, currentTank=0  
// i=2: totalTank=-6, currentTank=-2 < 0, start=3, currentTank=0
// i=3: totalTank=-3, currentTank=3 >= 0
// i=4: totalTank=0, currentTank=6 >= 0
//
// totalTank=0 >= 0, return start=3

// Why greedy works:
// - If total gas >= total cost, exactly one solution exists
// - If we fail starting from position i, all positions before current failure are invalid
// - So we greedily try the next possible position

// Time: O(n), Space: O(1)
```

### Problem 3: Meeting Rooms

**Google/Apple**: "Find maximum number of non-overlapping meetings."

**Complete Solution**:
```javascript
function maxMeetings(intervals) {
    if (intervals.length === 0) return 0;
    
    // Sort by end time (greedy choice)
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1; // Always can take first meeting
    let lastEndTime = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        // If meeting starts after previous one ends
        if (intervals[i][0] >= lastEndTime) {
            count++;
            lastEndTime = intervals[i][1];
        }
    }
    
    return count;
}

// Greedy strategy: Always choose meeting that ends earliest
// This leaves maximum time for future meetings

// Example: intervals = [[1,4],[2,3],[3,6],[5,7]]
// After sorting by end time: [[2,3],[1,4],[3,6],[5,7]]
//
// Take [2,3], lastEndTime = 3, count = 1
// [1,4]: 1 < 3 (overlaps), skip
// [3,6]: 3 >= 3 (no overlap), take, lastEndTime = 6, count = 2  
// [5,7]: 5 < 6 (overlaps), skip
//
// Answer: 2 meetings

// Proof of correctness:
// Let OPT be optimal solution, GREEDY be our solution
// If OPT ≠ GREEDY, we can replace first meeting in OPT
// with first meeting in GREEDY (which ends earlier)
// This gives at least as good solution, contradiction

// Time: O(n log n) for sorting, Space: O(1)
```

### Problem 4: Minimum Number of Arrows

**Amazon/Meta**: "Find minimum arrows to burst all balloons."

**Complete Solution**:
```javascript
function findMinArrowShots(points) {
    if (points.length === 0) return 0;
    
    // Sort by end position (greedy choice)
    points.sort((a, b) => a[1] - b[1]);
    
    let arrows = 1;
    let arrowPosition = points[0][1]; // Place first arrow at end of first balloon
    
    for (let i = 1; i < points.length; i++) {
        // If balloon starts after arrow position
        if (points[i][0] > arrowPosition) {
            // Need new arrow
            arrows++;
            arrowPosition = points[i][1]; // Place arrow at end of this balloon
        }
        // Else: current arrow can burst this balloon too
    }
    
    return arrows;
}

// Greedy strategy: Place arrow as far right as possible
// This maximizes overlap with future balloons

// Example: points = [[10,16],[2,8],[1,6],[7,12]]
// After sorting by end: [[1,6],[2,8],[7,12],[10,16]]
//
// Arrow 1 at position 6: bursts [1,6] and [2,8] 
// [7,12]: 7 > 6, need new arrow
// Arrow 2 at position 12: bursts [7,12] and [10,16]
//
// Answer: 2 arrows

// Why greedy works:
// - Placing arrow at rightmost position of leftmost balloon
// - Maximizes chance of hitting future balloons
// - Any optimal solution must shoot leftmost balloon somewhere
// - Shooting it rightmost is always better or equal

// Time: O(n log n), Space: O(1)
```

### Problem 5: Task Scheduler

**Facebook/Google**: "Find minimum time to complete tasks with cooling period."

**Complete Solution**:
```javascript
function leastInterval(tasks, n) {
    // Count frequency of each task
    const freq = new Map();
    for (let task of tasks) {
        freq.set(task, (freq.get(task) || 0) + 1);
    }
    
    // Sort frequencies in descending order
    const frequencies = Array.from(freq.values()).sort((a, b) => b - a);
    
    const maxFreq = frequencies[0];
    const maxCount = frequencies.filter(f => f === maxFreq).length;
    
    // Greedy calculation:
    // Create slots: (maxFreq - 1) * (n + 1) + maxCount
    // This ensures most frequent tasks are spaced properly
    const minTime = (maxFreq - 1) * (n + 1) + maxCount;
    
    // Answer is maximum of calculated time and total tasks
    // (idle time might be zero if many different tasks)
    return Math.max(minTime, tasks.length);
}

// Greedy insight: Most frequent tasks determine the structure
// Arrange most frequent tasks first with cooling periods
// Fill gaps with other tasks

// Example: tasks = ["A","A","A","B","B","B"], n = 2
// Frequencies: A=3, B=3, maxFreq=3, maxCount=2
//
// Structure: A _ _ A _ _ A (most frequent task creates skeleton)
//           A B _ A B _ A B (fill with second most frequent)
//
// minTime = (3-1) * (2+1) + 2 = 2*3 + 2 = 8
// tasks.length = 6
// Answer: max(8, 6) = 8

// Example: tasks = ["A","B","C","D","E","A","B","C"], n = 2  
// Frequencies: A=2, B=2, C=2, others=1, maxFreq=2, maxCount=3
// minTime = (2-1) * (2+1) + 3 = 1*3 + 3 = 6
// tasks.length = 8
// Answer: max(6, 8) = 8 (no idle time needed)

// Time: O(n), Space: O(1) - at most 26 different tasks
```

---

## Greedy Algorithm Design Process

### Step 1: Identify Greedy Choice

**Questions to Ask:**
- What choice seems "obviously best" at each step?
- What local optimization might lead to global optimum?
- How can I order the problem elements?

```javascript
// Example: Activity selection
// Greedy choices to consider:
// 1. Choose shortest activity first? (Wrong)
// 2. Choose activity that starts earliest? (Wrong) 
// 3. Choose activity that ends earliest? (Correct!)
// 4. Choose activity with least conflicts? (Complex, not greedy)
```

### Step 2: Prove Greedy Choice Property

**Proof Techniques:**
1. **Exchange Argument**: Show greedy choice can replace any choice in optimal solution
2. **Induction**: Show greedy maintains optimality at each step  
3. **Contradiction**: Assume non-greedy is better, derive contradiction

```javascript
// Example proof for activity selection:
// Theorem: Choosing earliest-ending activity is optimal
// 
// Proof by exchange argument:
// - Let OPT be optimal solution with activities [a1, a2, ..., ak]
// - Let g be earliest-ending activity
// - If g ∉ OPT, replace a1 with g
// - Since g ends before or at same time as a1, no conflicts created
// - New solution has same size, so still optimal
// - Therefore, greedy choice is safe
```

### Step 3: Prove Optimal Substructure

**Show**: After making greedy choice, remaining problem has same property.

```javascript
// Example: After choosing earliest-ending activity,
// remaining activities form independent subproblem
// Optimal solution to original = greedy choice + optimal solution to subproblem
```

---

## Advanced Greedy Techniques

### 1. Greedy with Multiple Criteria

```javascript
// Example: Fractional Knapsack
function fractionalKnapsack(items, capacity) {
    // Sort by value/weight ratio (greedy choice)
    items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
    
    let totalValue = 0;
    let remainingCapacity = capacity;
    
    for (let item of items) {
        if (item.weight <= remainingCapacity) {
            // Take entire item
            totalValue += item.value;
            remainingCapacity -= item.weight;
        } else {
            // Take fraction of item
            const fraction = remainingCapacity / item.weight;
            totalValue += item.value * fraction;
            break; // Knapsack is full
        }
    }
    
    return totalValue;
}
```

### 2. Greedy with Custom Comparators

```javascript
// Example: Largest Number
function largestNumber(nums) {
    // Custom comparator: a+b vs b+a
    nums.sort((a, b) => {
        const order1 = String(a) + String(b);
        const order2 = String(b) + String(a);
        return order2.localeCompare(order1); // Descending
    });
    
    const result = nums.join('');
    return result[0] === '0' ? '0' : result; // Handle all zeros
}

// Example: nums = [3, 30, 34, 5, 9]
// Compare: "330" vs "303" → choose 3 before 30
// Compare: "534" vs "345" → choose 5 before 34
// Result: "9534330"
```

### 3. Greedy with State Tracking

```javascript
// Example: Remove K Digits
function removeKdigits(num, k) {
    const stack = [];
    let removed = 0;
    
    for (let digit of num) {
        // Greedy: remove larger digits from end when possible
        while (stack.length > 0 && stack[stack.length - 1] > digit && removed < k) {
            stack.pop();
            removed++;
        }
        stack.push(digit);
    }
    
    // Remove remaining digits from end if needed
    while (removed < k) {
        stack.pop();
        removed++;
    }
    
    // Handle leading zeros and empty result
    const result = stack.join('').replace(/^0+/, '');
    return result || '0';
}
```

---

## Practice Problems by Difficulty

### Easy Greedy Problems
1. **Assign Cookies** (LeetCode 455) - Greedy assignment
2. **Lemonade Change** (LeetCode 860) - Greedy cash management
3. **Maximum Units on Truck** (LeetCode 1710) - Greedy selection
4. **Can Place Flowers** (LeetCode 605) - Greedy placement
5. **Minimum Moves to Equal Array Elements** (LeetCode 453) - Greedy insight

### Medium Greedy Problems
1. **Jump Game** (LeetCode 55) - Greedy reachability
2. **Gas Station** (LeetCode 134) - Circular greedy
3. **Task Scheduler** (LeetCode 621) - Frequency-based greedy
4. **Minimum Number of Arrows** (LeetCode 452) - Interval greedy
5. **Reconstruct Itinerary** (LeetCode 332) - Greedy path construction

### Hard Greedy Problems
1. **Candy** (LeetCode 135) - Two-pass greedy
2. **Remove K Digits** (LeetCode 402) - Stack-based greedy
3. **Split Array into Consecutive Subsequences** (LeetCode 659) - Complex greedy
4. **Minimum Number of Taps** (LeetCode 1326) - Interval covering greedy

---

## Common Greedy Mistakes

### Mistake 1: Assuming Greedy Always Works

```javascript
// Wrong: Coin change with arbitrary denominations
function coinChangeGreedy(coins, amount) {
    coins.sort((a, b) => b - a);
    let count = 0;
    
    for (let coin of coins) {
        count += Math.floor(amount / coin);
        amount %= coin;
    }
    
    return amount === 0 ? count : -1;
}

// This fails for coins = [1, 3, 4], amount = 6
// Greedy: 4 + 1 + 1 = 3 coins
// Optimal: 3 + 3 = 2 coins

// Correct approach: Use DP for general coin change
```

### Mistake 2: Wrong Greedy Choice

```javascript
// Wrong: Activity selection by shortest duration
function activitySelectionWrong(activities) {
    activities.sort((a, b) => (a.end - a.start) - (b.end - b.start));
    // This doesn't work!
}

// Correct: Activity selection by earliest end time  
function activitySelectionCorrect(activities) {
    activities.sort((a, b) => a.end - b.end);
    // This is optimal
}
```

### Mistake 3: Not Proving Correctness

```javascript
// Always ask: Why does my greedy choice work?
// Can I construct a counter-example?
// Does the exchange argument hold?

// For exam: If you can't prove greedy works, consider DP
```

---

## Success Metrics

### Week 1: Greedy Fundamentals
- [ ] Understand when greedy works vs fails
- [ ] Solve basic greedy problems (assign cookies, lemonade change)
- [ ] Recognize greedy choice property
- [ ] Distinguish greedy from DP problems

### Week 2: Classic Greedy Patterns
- [ ] Master interval scheduling (meeting rooms, arrows)
- [ ] Solve movement problems (jump game, gas station)
- [ ] Handle frequency-based problems (task scheduler)
- [ ] Understand proof techniques

### Week 3: Advanced Greedy Applications
- [ ] Combine greedy with other data structures
- [ ] Handle multiple criteria optimization
- [ ] Solve string manipulation greedy problems
- [ ] Design custom comparators for greedy sorting

### Week 4: Greedy Mastery
- [ ] Recognize greedy opportunities immediately  
- [ ] Prove correctness of greedy choices
- [ ] Solve complex multi-step greedy problems
- [ ] Ready for any FAANG greedy algorithm interview

**Remember**: Greedy algorithms are about making the locally optimal choice that leads to global optimality. The key is recognizing when this property holds and being able to prove it!