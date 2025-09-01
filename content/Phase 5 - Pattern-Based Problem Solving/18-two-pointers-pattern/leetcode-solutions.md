# LeetCode Solutions - Two Pointers Pattern

## Essential Two Pointer Problems

### 1. Container With Most Water (LeetCode 11)
**Difficulty**: Medium  
**Pattern**: Opposite Direction Pointers

```javascript
function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const width = right - left;
        const minHeight = Math.min(height[left], height[right]);
        const currentArea = width * minHeight;
        
        maxWater = Math.max(maxWater, currentArea);
        
        // Move the pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}
```

**Key Insight**: Always move the pointer with the smaller height because moving the taller one cannot increase the area.

### 2. 3Sum (LeetCode 15)
**Difficulty**: Medium  
**Pattern**: Fixed + Two Pointers

```javascript
function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for first number
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // Skip duplicates
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

### 3. Trapping Rain Water (LeetCode 42)
**Difficulty**: Hard  
**Pattern**: Two Pointers with Max Heights

```javascript
function trap(height) {
    if (!height || height.length < 3) return 0;
    
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let waterTrapped = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                waterTrapped += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                waterTrapped += rightMax - height[right];
            }
            right--;
        }
    }
    
    return waterTrapped;
}
```

### 4. Valid Palindrome II (LeetCode 680)
**Difficulty**: Easy  
**Pattern**: Palindrome Check with One Skip

```javascript
function validPalindrome(s) {
    function isPalindrome(str, left, right) {
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            // Try skipping left character or right character
            return isPalindrome(s, left + 1, right) || 
                   isPalindrome(s, left, right - 1);
        }
        left++;
        right--;
    }
    
    return true;
}
```

### 5. Sort Colors (LeetCode 75)
**Difficulty**: Medium  
**Pattern**: Three Pointers (Dutch Flag)

```javascript
function sortColors(nums) {
    let left = 0;      // boundary for 0s
    let right = nums.length - 1;  // boundary for 2s
    let current = 0;   // current element
    
    while (current <= right) {
        if (nums[current] === 0) {
            // Swap with left boundary
            [nums[left], nums[current]] = [nums[current], nums[left]];
            left++;
            current++;
        } else if (nums[current] === 2) {
            // Swap with right boundary
            [nums[current], nums[right]] = [nums[right], nums[current]];
            right--;
            // Don't increment current (need to check swapped element)
        } else {
            // nums[current] === 1, just move forward
            current++;
        }
    }
}
```

## Problem-Solving Framework

### Step 1: Identify the Pattern
- **Opposite Direction**: Start from both ends, move inward
- **Same Direction**: Both pointers start from beginning, move at different speeds
- **Fixed + Moving**: Fix one element, use two pointers on remaining

### Step 2: Handle Edge Cases
- Empty array or string
- Single element
- All elements same
- Already sorted/reversed

### Step 3: Optimize
- Sort if needed (usually for sum problems)
- Skip duplicates when required
- Use early termination when possible

## Common Mistakes to Avoid

1. **Forgetting to skip duplicates** in sum problems
2. **Not handling edge cases** properly
3. **Wrong pointer movement** after finding a match
4. **Integer overflow** in sum calculations
5. **Boundary conditions** when incrementing/decrementing

## Time Complexities

| Problem | Time | Space | Notes |
|---------|------|-------|--------|
| Two Sum II | O(n) | O(1) | Sorted array |
| 3Sum | O(n²) | O(1) | After sorting |
| Container Water | O(n) | O(1) | Greedy approach |
| Trapping Rain Water | O(n) | O(1) | Two pointers |
| Palindrome Check | O(n) | O(1) | Basic validation |

## Practice Progression

### Beginner (Week 1)
- [ ] Valid Palindrome
- [ ] Two Sum II
- [ ] Remove Duplicates from Sorted Array

### Intermediate (Week 2)  
- [ ] 3Sum
- [ ] Container With Most Water
- [ ] Sort Colors

### Advanced (Week 3)
- [ ] Trapping Rain Water
- [ ] 4Sum
- [ ] Minimum Window Substring