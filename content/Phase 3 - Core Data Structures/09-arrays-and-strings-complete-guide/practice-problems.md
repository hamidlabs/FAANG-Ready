# Practice Problems - Arrays and Strings

## Easy Problems (Start Here)

### 1. Two Sum
**Problem**: Given an array of integers and a target sum, return indices of two numbers that add up to the target.

**Solution**:
```javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}
```

### 2. Valid Palindrome
**Problem**: Check if a string is a palindrome, ignoring non-alphanumeric characters.

**Solution**:
```javascript
function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}
```

## Medium Problems

### 3. Group Anagrams
**Problem**: Group strings that are anagrams of each other.

**Solution**:
```javascript
function groupAnagrams(strs) {
    const map = new Map();
    
    for (const str of strs) {
        const sorted = str.split('').sort().join('');
        
        if (!map.has(sorted)) {
            map.set(sorted, []);
        }
        
        map.get(sorted).push(str);
    }
    
    return Array.from(map.values());
}
```

## Hard Problems

### 4. Minimum Window Substring
**Problem**: Find the minimum window in string that contains all characters of pattern.

**Solution**:
```javascript
function minWindow(s, t) {
    if (s.length < t.length) return "";
    
    const need = new Map();
    const window = new Map();
    
    for (const char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    let left = 0, right = 0;
    let valid = 0;
    let start = 0, len = Infinity;
    
    while (right < s.length) {
        const c = s[right];
        right++;
        
        if (need.has(c)) {
            window.set(c, (window.get(c) || 0) + 1);
            if (window.get(c) === need.get(c)) {
                valid++;
            }
        }
        
        while (valid === need.size) {
            if (right - left < len) {
                start = left;
                len = right - left;
            }
            
            const d = s[left];
            left++;
            
            if (need.has(d)) {
                if (window.get(d) === need.get(d)) {
                    valid--;
                }
                window.set(d, window.get(d) - 1);
            }
        }
    }
    
    return len === Infinity ? "" : s.substring(start, start + len);
}
```

## Practice Schedule

### Week 1: Arrays
- [ ] Two Sum variants
- [ ] Container With Most Water  
- [ ] 3Sum and 4Sum
- [ ] Product of Array Except Self

### Week 2: Strings
- [ ] Longest Substring Without Repeating Characters
- [ ] Valid Anagram variations
- [ ] String to Integer (atoi)
- [ ] Implement strStr()

### Week 3: Advanced
- [ ] Minimum Window Substring
- [ ] Text Justification
- [ ] Regular Expression Matching
- [ ] Edit Distance

## Tips for Success

1. **Start with brute force** - Always get a working solution first
2. **Optimize gradually** - Use hashmaps to reduce time complexity
3. **Practice edge cases** - Empty arrays, single elements, duplicates
4. **Time yourself** - Aim for 20-30 minutes per problem