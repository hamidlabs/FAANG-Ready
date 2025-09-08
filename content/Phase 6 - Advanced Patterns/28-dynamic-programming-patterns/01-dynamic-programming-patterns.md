# Dynamic Programming Patterns

## Purpose

Dynamic Programming (DP) is the most feared and respected topic in FAANG interviews. It appears in 35% of senior-level interviews and separates good candidates from great ones. Master DP to unlock solutions to seemingly impossible optimization problems.

**Key Insight**: DP isn't about memorizing solutions - it's about recognizing that complex problems can be broken down into overlapping subproblems. Solve each subproblem once, store the result, and reuse it.

---

## What is Dynamic Programming (From Zero)

**Dynamic Programming** = Recursion + Memoization + Optimal Substructure

**Simple Definition**: A method for solving complex problems by breaking them down into simpler subproblems, solving each subproblem only once, and storing their results.

```javascript
// Example: Fibonacci without DP (inefficient)
function fibonacciNaive(n) {
    if (n <= 1) return n;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

// This calculates fib(5) by calling fib(4) + fib(3)
// fib(4) = fib(3) + fib(2)
// fib(3) = fib(2) + fib(1)
// Notice fib(3) is calculated multiple times!

// With DP (efficient)
function fibonacciDP(n, memo = {}) {
    if (n in memo) return memo[n]; // Already calculated
    if (n <= 1) return n;
    
    memo[n] = fibonacciDP(n - 1, memo) + fibonacciDP(n - 2, memo);
    return memo[n];
}

// Now each fib(x) is calculated only once and stored
```

**When to Use DP:**
1. **Optimization problems**: Find maximum/minimum value
2. **Counting problems**: How many ways to do something
3. **Decision problems**: Is it possible to achieve something
4. **Overlapping subproblems**: Same subproblems appear multiple times
5. **Optimal substructure**: Optimal solution contains optimal solutions to subproblems

---

## Core DP Concepts

### 1. Overlapping Subproblems

**Problem**: Same subproblems are solved multiple times.

```javascript
// Without memoization: fib(5) tree
//                  fib(5)
//                 /      \
//            fib(4)      fib(3)
//           /      \     /      \
//      fib(3)   fib(2) fib(2) fib(1)
//      /    \   /    \  /    \
//   fib(2) fib(1) fib(1) fib(0) fib(1) fib(0)
//   /   \
// fib(1) fib(0)

// Notice: fib(3) calculated twice, fib(2) calculated 3 times, fib(1) calculated 5 times!
// Time complexity: O(2^n) - exponential

// With memoization: Each subproblem solved once
// Time complexity: O(n) - linear
```

### 2. Optimal Substructure

**Property**: Optimal solution to problem contains optimal solutions to subproblems.

```javascript
// Example: Shortest path from A to C through B
// If shortest A→C goes through B, then:
// - A→B must be shortest path from A to B
// - B→C must be shortest path from B to C
// 
// If A→B wasn't shortest, we could replace it with shorter path
// and get a shorter A→C path (contradiction)
```

### 3. State Definition

**Most Important Step**: Define what each DP state represents.

```javascript
// Example: Climbing stairs (1 or 2 steps at a time)
// State definition: dp[i] = number of ways to reach step i
// Recurrence: dp[i] = dp[i-1] + dp[i-2]
// Base cases: dp[0] = 1, dp[1] = 1

function climbStairs(n) {
    if (n <= 1) return 1;
    
    const dp = new Array(n + 1);
    dp[0] = 1; // One way to stay at ground
    dp[1] = 1; // One way to reach step 1
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
```

---

## DP Implementation Approaches

### 1. Top-Down (Memoization)

**Approach**: Start with original problem, recursively break down, store results.

```javascript
// Template for top-down DP
function dpTopDown(params, memo = {}) {
    // Create unique key from parameters
    const key = createKey(params);
    
    // Check if already calculated
    if (key in memo) return memo[key];
    
    // Base cases
    if (isBaseCase(params)) {
        return baseValue(params);
    }
    
    // Recursive case: try all possible transitions
    let result = initializeResult();
    for (let choice of getPossibleChoices(params)) {
        const subResult = dpTopDown(makeTransition(params, choice), memo);
        result = combineResults(result, subResult);
    }
    
    // Store and return result
    memo[key] = result;
    return result;
}

// Advantages: Easy to write, natural recursion
// Disadvantages: Recursion overhead, stack overflow risk
```

### 2. Bottom-Up (Tabulation)

**Approach**: Start with base cases, build up to original problem.

```javascript
// Template for bottom-up DP
function dpBottomUp(params) {
    // Create DP table
    const dp = createDPTable(params);
    
    // Initialize base cases
    initializeBaseCases(dp);
    
    // Fill DP table in correct order
    for (let state of getAllStatesInOrder(params)) {
        if (isBaseCase(state)) continue;
        
        let result = initializeResult();
        for (let choice of getPossibleChoices(state)) {
            const prevState = getPreviousState(state, choice);
            result = combineResults(result, dp[prevState]);
        }
        
        dp[state] = result;
    }
    
    return dp[targetState];
}

// Advantages: No recursion overhead, guaranteed to work
// Disadvantages: Must figure out correct order, may calculate unnecessary states
```

### 3. Space Optimization

**Approach**: Use only necessary previous states.

```javascript
// Example: Fibonacci with O(1) space
function fibonacciOptimized(n) {
    if (n <= 1) return n;
    
    let prev2 = 0; // fib(0)
    let prev1 = 1; // fib(1)
    
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// From O(n) space to O(1) space
// Only possible when each state depends on constant number of previous states
```

---

## Real FAANG Interview Problems

### Problem 1: Climbing Stairs

**Google/Amazon**: "How many ways to climb n stairs (1 or 2 steps at a time)?"

**Complete Solution**:
```javascript
// Top-down approach
function climbStairsTopDown(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 2) return n;
    
    memo[n] = climbStairsTopDown(n - 1, memo) + climbStairsTopDown(n - 2, memo);
    return memo[n];
}

// Bottom-up approach
function climbStairs(n) {
    if (n <= 2) return n;
    
    const dp = new Array(n + 1);
    dp[1] = 1; // 1 way to reach step 1
    dp[2] = 2; // 2 ways to reach step 2: (1+1) or (2)
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Space optimized
function climbStairsOptimal(n) {
    if (n <= 2) return n;
    
    let prev2 = 1; // dp[1]
    let prev1 = 2; // dp[2]
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// State definition: dp[i] = number of ways to reach step i
// Recurrence: dp[i] = dp[i-1] + dp[i-2]
// Why? To reach step i, you can come from step i-1 (take 1 step) 
//      or from step i-2 (take 2 steps)

// Example: n = 4
// dp[1] = 1: (1)
// dp[2] = 2: (1,1), (2)  
// dp[3] = 3: (1,1,1), (1,2), (2,1)
// dp[4] = 5: (1,1,1,1), (1,1,2), (1,2,1), (2,1,1), (2,2)

// Time: O(n), Space: O(1) for optimized version
```

### Problem 2: House Robber

**Meta/Apple**: "Rob houses to maximize money without robbing adjacent houses."

**Complete Solution**:
```javascript
function rob(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    // dp[i] = maximum money that can be robbed up to house i
    const dp = new Array(nums.length);
    dp[0] = nums[0];                    // Rob first house
    dp[1] = Math.max(nums[0], nums[1]); // Best of first two houses
    
    for (let i = 2; i < nums.length; i++) {
        // Choice: rob house i or don't rob house i
        dp[i] = Math.max(
            dp[i - 1],           // Don't rob house i, take best so far
            dp[i - 2] + nums[i]  // Rob house i, add to best from i-2
        );
    }
    
    return dp[nums.length - 1];
}

// Space optimized version
function robOptimal(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = nums[0];                    // Best up to i-2
    let prev1 = Math.max(nums[0], nums[1]); // Best up to i-1
    
    for (let i = 2; i < nums.length; i++) {
        const current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// State definition: dp[i] = maximum money robbed from houses 0 to i
// Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
// Why? At each house, choose to rob it (can't rob i-1) or skip it

// Example: nums = [2, 7, 9, 3, 1]
// dp[0] = 2: rob house 0
// dp[1] = max(2, 7) = 7: rob house 1
// dp[2] = max(7, 2+9) = 11: rob houses 0 and 2  
// dp[3] = max(11, 7+3) = 11: keep previous best
// dp[4] = max(11, 11+1) = 12: rob houses 0, 2, and 4

// Time: O(n), Space: O(1) for optimized version
```

### Problem 3: Coin Change

**Amazon/Google**: "Find minimum coins to make target amount."

**Complete Solution**:
```javascript
function coinChange(coins, amount) {
    // dp[i] = minimum coins needed to make amount i
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0; // 0 coins needed to make amount 0
    
    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// Top-down approach with memoization
function coinChangeTopDown(coins, amount, memo = {}) {
    if (amount in memo) return memo[amount];
    if (amount === 0) return 0;
    if (amount < 0) return Infinity;
    
    let minCoins = Infinity;
    for (let coin of coins) {
        const subResult = coinChangeTopDown(coins, amount - coin, memo);
        if (subResult !== Infinity) {
            minCoins = Math.min(minCoins, subResult + 1);
        }
    }
    
    memo[amount] = minCoins;
    return minCoins;
}

// State definition: dp[i] = minimum coins to make amount i
// Recurrence: dp[i] = min(dp[i - coin] + 1) for all coins where coin <= i
// Why? Try using each coin and take the minimum

// Example: coins = [1, 3, 4], amount = 6
// dp[0] = 0
// dp[1] = 1 (use coin 1)
// dp[2] = 2 (use coin 1 twice)
// dp[3] = 1 (use coin 3)
// dp[4] = 1 (use coin 4)
// dp[5] = 2 (use coins 4 and 1)
// dp[6] = 2 (use coin 3 twice)

// Time: O(amount × coins.length), Space: O(amount)
```

### Problem 4: Longest Increasing Subsequence

**Microsoft/Meta**: "Find length of longest increasing subsequence."

**Complete Solution**:
```javascript
// O(n²) DP solution
function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;
    
    // dp[i] = length of LIS ending at index i
    const dp = new Array(nums.length).fill(1);
    
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return Math.max(...dp);
}

// O(n log n) solution using binary search
function lengthOfLISOptimal(nums) {
    if (nums.length === 0) return 0;
    
    const tails = []; // tails[i] = smallest tail of LIS of length i+1
    
    for (let num of nums) {
        // Binary search for position to insert/replace
        let left = 0;
        let right = tails.length;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        if (left === tails.length) {
            tails.push(num); // Extend LIS
        } else {
            tails[left] = num; // Replace to keep smallest tail
        }
    }
    
    return tails.length;
}

// State definition: dp[i] = length of LIS ending exactly at index i
// Recurrence: dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]

// Example: nums = [10, 9, 2, 5, 3, 7, 101, 18]
// dp[0] = 1: [10]
// dp[1] = 1: [9]  
// dp[2] = 1: [2]
// dp[3] = 2: [2, 5]
// dp[4] = 2: [2, 3]
// dp[5] = 3: [2, 3, 7] or [2, 5, 7]
// dp[6] = 4: [2, 3, 7, 101]
// dp[7] = 4: [2, 3, 7, 18]

// Answer: max(dp) = 4

// Time: O(n²) for DP, O(n log n) for binary search version
// Space: O(n)
```

### Problem 5: Edit Distance

**Google/Amazon**: "Find minimum operations to transform string1 to string2."

**Complete Solution**:
```javascript
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // dp[i][j] = min operations to transform word1[0...i-1] to word2[0...j-1]
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Base cases: transform to/from empty string
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i; // Delete all characters from word1
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j; // Insert all characters to match word2
    }
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                // Characters match, no operation needed
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // Try all three operations and take minimum
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,     // Delete from word1
                    dp[i][j - 1] + 1,     // Insert into word1  
                    dp[i - 1][j - 1] + 1  // Replace in word1
                );
            }
        }
    }
    
    return dp[m][n];
}

// Space optimized version (only need previous row)
function minDistanceOptimal(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    let prev = Array(n + 1).fill(0).map((_, j) => j);
    
    for (let i = 1; i <= m; i++) {
        const curr = Array(n + 1);
        curr[0] = i;
        
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = Math.min(
                    prev[j] + 1,      // Delete
                    curr[j - 1] + 1,  // Insert
                    prev[j - 1] + 1   // Replace
                );
            }
        }
        
        prev = curr;
    }
    
    return prev[n];
}

// State definition: dp[i][j] = min operations to transform word1[0...i-1] to word2[0...j-1]
// Recurrence: 
// - If word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]
// - Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])

// Example: word1 = "horse", word2 = "ros"
//     ""  r  o  s
// ""   0  1  2  3
// h    1  1  2  3
// o    2  2  1  2  
// r    3  2  2  2
// s    4  3  3  2
// e    5  4  4  3

// Answer: dp[5][3] = 3 operations (delete h, delete o, delete e)

// Time: O(m × n), Space: O(n) for optimized version
```

---

## Common DP Patterns

### Pattern 1: Linear DP (1D)

**When to use**: Problems on arrays/strings with decision at each position.

```javascript
// Template for linear DP
function linearDP(arr) {
    const n = arr.length;
    const dp = new Array(n);
    
    // Base case
    dp[0] = baseValue(arr[0]);
    
    // Fill DP array
    for (let i = 1; i < n; i++) {
        dp[i] = makeOptimalChoice(dp, arr, i);
    }
    
    return dp[n - 1]; // or Math.max(...dp) depending on problem
}

// Examples:
// - House Robber: dp[i] = max money up to house i
// - Climbing Stairs: dp[i] = ways to reach step i
// - Maximum Subarray: dp[i] = max sum ending at i
```

### Pattern 2: Grid DP (2D)

**When to use**: Problems on grids, comparing two sequences.

```javascript
// Template for grid DP
function gridDP(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // Initialize base cases (first row and column)
    initializeBaseCases(dp, grid);
    
    // Fill DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = makeOptimalChoice(dp, grid, i, j);
        }
    }
    
    return dp[m - 1][n - 1]; // or extract answer from dp table
}

// Examples:
// - Unique Paths: dp[i][j] = ways to reach cell (i,j)
// - Edit Distance: dp[i][j] = min operations to transform s1[0...i] to s2[0...j]
// - Longest Common Subsequence: dp[i][j] = LCS length of s1[0...i] and s2[0...j]
```

### Pattern 3: Knapsack DP

**When to use**: Selection problems with constraints.

```javascript
// Template for 0/1 knapsack
function knapsackDP(weights, values, capacity) {
    const n = weights.length;
    // dp[i][w] = max value using first i items with weight limit w
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // Don't take item i-1
            dp[i][w] = dp[i - 1][w];
            
            // Take item i-1 if it fits
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }
    
    return dp[n][capacity];
}

// Examples:
// - 0/1 Knapsack: select items to maximize value within weight limit
// - Coin Change: select coins to make target amount
// - Partition Equal Subset Sum: select subset with sum = total/2
```

### Pattern 4: Interval DP

**When to use**: Problems on ranges/intervals.

```javascript
// Template for interval DP
function intervalDP(arr) {
    const n = arr.length;
    // dp[i][j] = optimal value for range [i, j]
    const dp = Array(n).fill().map(() => Array(n).fill(0));
    
    // Base cases: single elements
    for (let i = 0; i < n; i++) {
        dp[i][i] = baseValue(arr[i]);
    }
    
    // Fill by length of interval
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            // Try all possible split points
            for (let k = i; k < j; k++) {
                dp[i][j] = Math.max(
                    dp[i][j],
                    combineResults(dp[i][k], dp[k + 1][j], i, j, k)
                );
            }
        }
    }
    
    return dp[0][n - 1];
}

// Examples:
// - Matrix Chain Multiplication: optimal parenthesization
// - Palindrome Partitioning: minimum cuts to make palindromes
// - Burst Balloons: maximum points from bursting balloons
```

---

## DP Problem Recognition

### Keywords That Signal DP

| Keywords | Problem Type | Example |
|----------|-------------|---------|
| "Maximum/Minimum" | Optimization | Maximum subarray sum |
| "How many ways" | Counting | Ways to climb stairs |
| "Is it possible" | Decision | Can partition array |
| "Optimal" | Optimization | Optimal strategy |
| "All possible" | Enumeration | All paths in grid |
| "Longest/Shortest" | Optimization | Longest common subsequence |

### Problem Structure Recognition

```javascript
// Structure 1: Make choice at each step
// Example: Rob houses or not
if (problemHasChoicesAtEachStep) {
    useLinearDP();
}

// Structure 2: Compare/combine two sequences
// Example: Edit distance, LCS
if (problemInvolvesTwoSequences) {
    useGridDP();
}

// Structure 3: Select subset with constraints
// Example: Knapsack, coin change
if (problemInvoluesSubsetSelection) {
    useKnapsackDP();
}

// Structure 4: Optimize on intervals/ranges
// Example: Matrix multiplication, palindrome partitioning
if (problemOnRangesOrIntervals) {
    useIntervalDP();
}
```

---

## Common DP Mistakes and Solutions

### Mistake 1: Wrong State Definition

```javascript
// Wrong: State doesn't capture all necessary information
function uniquePathsWrong(m, n) {
    // ❌ Only tracks position, not enough information
    const dp = Array(m * n).fill(0);
    // This doesn't work because we need 2D coordinates
}

// Correct: State captures complete information needed
function uniquePathsCorrect(m, n) {
    // ✅ dp[i][j] represents paths to cell (i, j)
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // Initialize base cases
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}
```

### Mistake 2: Missing Base Cases

```javascript
// Wrong: Not handling base cases properly
function climbStairsWrong(n) {
    const dp = new Array(n + 1);
    // ❌ Missing base cases, will get NaN
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Correct: Proper base case initialization
function climbStairsCorrect(n) {
    if (n <= 2) return n;
    
    const dp = new Array(n + 1);
    dp[1] = 1; // ✅ Base case
    dp[2] = 2; // ✅ Base case
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
```

### Mistake 3: Wrong Transition Formula

```javascript
// Wrong: Incorrect recurrence relation
function houseRobberWrong(nums) {
    const dp = new Array(nums.length);
    dp[0] = nums[0];
    dp[1] = nums[1]; // ❌ Should be max of first two
    
    for (let i = 2; i < nums.length; i++) {
        dp[i] = dp[i - 2] + nums[i]; // ❌ Missing choice of not robbing
    }
    
    return dp[nums.length - 1];
}

// Correct: Proper recurrence considering all choices
function houseRobberCorrect(nums) {
    if (nums.length === 1) return nums[0];
    
    const dp = new Array(nums.length);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]); // ✅ Max of first two
    
    for (let i = 2; i < nums.length; i++) {
        // ✅ Choice: rob current house or don't
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    
    return dp[nums.length - 1];
}
```

---

## Practice Problems by Difficulty

### Easy DP Problems (Start Here)
1. **Climbing Stairs** (LeetCode 70) - Basic linear DP
2. **House Robber** (LeetCode 198) - Decision at each step
3. **Maximum Subarray** (LeetCode 53) - Kadane's algorithm
4. **Min Cost Climbing Stairs** (LeetCode 746) - Choice variant
5. **Fibonacci Number** (LeetCode 509) - Classic DP introduction

### Medium DP Problems
1. **Coin Change** (LeetCode 322) - Unbounded knapsack
2. **Unique Paths** (LeetCode 62) - Grid DP
3. **Longest Increasing Subsequence** (LeetCode 300) - Sequence DP
4. **House Robber II** (LeetCode 213) - Circular constraint
5. **Word Break** (LeetCode 139) - String DP

### Hard DP Problems
1. **Edit Distance** (LeetCode 72) - Two sequence DP
2. **Regular Expression Matching** (LeetCode 10) - Complex state transitions
3. **Burst Balloons** (LeetCode 312) - Interval DP
4. **Distinct Subsequences** (LeetCode 115) - String matching DP
5. **Interleaving String** (LeetCode 97) - Three sequence DP

---

## Success Metrics

### Week 1: DP Fundamentals
- [ ] Understand overlapping subproblems and optimal substructure
- [ ] Implement fibonacci with memoization
- [ ] Solve climbing stairs and house robber problems
- [ ] Recognize when DP is applicable

### Week 2: DP Pattern Recognition
- [ ] Master linear DP (1D array problems)
- [ ] Understand grid DP (2D problems)
- [ ] Solve coin change and unique paths
- [ ] Write both top-down and bottom-up solutions

### Week 3: Advanced DP Techniques
- [ ] Handle complex state definitions
- [ ] Solve sequence comparison problems (LCS, edit distance)
- [ ] Implement space optimization techniques
- [ ] Tackle knapsack-type problems

### Week 4: DP Mastery
- [ ] Solve any easy/medium DP problem independently
- [ ] Recognize DP patterns immediately
- [ ] Debug DP solutions efficiently
- [ ] Ready for FAANG DP interviews

**Remember**: DP success comes from recognizing patterns, not memorizing solutions. Focus on understanding the problem structure and state transitions!