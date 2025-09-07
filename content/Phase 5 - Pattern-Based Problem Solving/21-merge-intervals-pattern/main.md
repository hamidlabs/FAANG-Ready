# Merge Intervals Pattern

## Purpose

The Merge Intervals pattern is essential for handling time-based and range-based problems in FAANG interviews. It appears in 20% of scheduling, calendar, and optimization problems. Master this pattern to solve complex overlapping problems with elegant solutions.

**Key Insight**: Most interval problems become simple after sorting by start time. The pattern transforms chaotic overlapping intervals into organized, non-overlapping ranges.

---

## What is the Merge Intervals Pattern?

**Basic Concept**: Given intervals (ranges with start and end points), merge overlapping ones, insert new ones, or find optimal arrangements by systematically processing them in sorted order.

```javascript
// Visual representation
// Original intervals: [[1,3], [6,9], [2,5], [15,18]]
// 
// Before sorting:
// 1---3
//   2---5
//       6-------9
//               15------18
//
// After sorting by start time: [[1,3], [2,5], [6,9], [15,18]]
// 1---3
//   2---5  (overlaps with [1,3])
//         6-------9
//                 15------18
//
// After merging:
// 1-------5  (merged [1,3] and [2,5])
//           6-------9
//                   15------18
// Result: [[1,5], [6,9], [15,18]]
```

**Why Sorting First Works:**
- **Eliminates chaos**: Random intervals become ordered timeline
- **Enables single pass**: Process each interval once from left to right
- **Simplifies overlap detection**: Only need to check with previous interval
- **Reduces complexity**: From O(n²) comparisons to O(n) processing after O(n log n) sort

---

## Types of Merge Intervals Problems

### Type 1: Merge Overlapping Intervals

**Pattern**: Sort by start time, then merge adjacent overlapping intervals.

```javascript
// Template for merging intervals
function mergeIntervals(intervals) {
    if (intervals.length <= 1) return intervals;
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = merged[merged.length - 1];
        
        // Check if current overlaps with last merged
        if (current[0] <= lastMerged[1]) {
            // Merge: extend end time to maximum
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap: add as new interval
            merged.push(current);
        }
    }
    
    return merged;
}

// Use cases:
// - Meeting room scheduling
// - Calendar optimization
// - Resource allocation
// - Time range consolidation
```

### Type 2: Insert New Interval

**Pattern**: Insert interval into sorted list and merge overlapping ones.

```javascript
// Template for inserting interval
function insertInterval(intervals, newInterval) {
    const result = [];
    let i = 0;
    
    // Add all intervals that end before new interval starts
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }
    
    // Merge all overlapping intervals with new interval
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push(newInterval);
    
    // Add remaining intervals
    while (i < intervals.length) {
        result.push(intervals[i]);
        i++;
    }
    
    return result;
}

// Use cases:
// - Add meeting to calendar
// - Insert task in schedule  
// - Resource booking
// - Timeline updates
```

### Type 3: Find Free Time Slots

**Pattern**: Identify gaps between intervals after merging.

```javascript
// Template for finding free time
function findFreeTime(busyIntervals, start, end) {
    // Merge overlapping busy times
    const merged = mergeIntervals(busyIntervals);
    const freeTime = [];
    
    // Check for free time before first interval
    if (merged.length > 0 && start < merged[0][0]) {
        freeTime.push([start, merged[0][0]]);
    }
    
    // Check for gaps between intervals
    for (let i = 1; i < merged.length; i++) {
        const gapStart = merged[i - 1][1];
        const gapEnd = merged[i][0];
        
        if (gapStart < gapEnd) {
            freeTime.push([gapStart, gapEnd]);
        }
    }
    
    // Check for free time after last interval
    if (merged.length > 0 && merged[merged.length - 1][1] < end) {
        freeTime.push([merged[merged.length - 1][1], end]);
    }
    
    return freeTime;
}

// Use cases:
// - Find available meeting times
// - Schedule optimization
// - Resource gap analysis
// - Free slot detection
```

---

## Real FAANG Interview Problems

### Problem 1: Merge Intervals

**Google/Amazon**: "Merge all overlapping intervals."

**Complete Solution**:
```javascript
function merge(intervals) {
    if (intervals.length <= 1) return intervals;
    
    // Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = merged[merged.length - 1];
        
        // Check for overlap: current start <= last end
        if (current[0] <= lastMerged[1]) {
            // Merge: update end time to maximum of both
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap: add current as separate interval
            merged.push(current);
        }
    }
    
    return merged;
}

// Example: intervals = [[1,3],[2,6],[8,10],[15,18]]
// 
// After sorting: [[1,3],[2,6],[8,10],[15,18]] (already sorted)
// 
// Process [1,3]: merged = [[1,3]]
// Process [2,6]: 2 <= 3 (overlap), merge to [1,6], merged = [[1,6]]  
// Process [8,10]: 8 > 6 (no overlap), add separate, merged = [[1,6],[8,10]]
// Process [15,18]: 15 > 10 (no overlap), add separate, merged = [[1,6],[8,10],[15,18]]
//
// Final result: [[1,6],[8,10],[15,18]]

// Edge cases handled:
// - Empty or single interval: return as-is
// - No overlaps: return original (sorted)
// - All intervals overlap: return single merged interval
// - Adjacent intervals: [1,2] and [2,3] merge to [1,3]

// Time: O(n log n) - sorting dominates
// Space: O(1) if modifying input, O(n) for result array
```

### Problem 2: Insert Interval

**Meta/Microsoft**: "Insert interval into sorted non-overlapping list and merge if needed."

**Complete Solution**:
```javascript
function insert(intervals, newInterval) {
    const result = [];
    let i = 0;
    
    // Step 1: Add all intervals that end before newInterval starts
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }
    
    // Step 2: Merge all overlapping intervals with newInterval
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        // Expand newInterval to encompass overlapping interval
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    
    // Add the merged newInterval
    result.push(newInterval);
    
    // Step 3: Add all remaining intervals
    while (i < intervals.length) {
        result.push(intervals[i]);
        i++;
    }
    
    return result;
}

// Example: intervals = [[1,3],[6,9]], newInterval = [2,5]
//
// Step 1: Add intervals ending before 2
//   [1,3] ends at 3, which is >= 2, so don't add
//   i = 0, result = []
//
// Step 2: Merge overlapping intervals
//   [1,3] starts at 1 <= 5, so it overlaps
//   newInterval becomes [min(2,1), max(5,3)] = [1,5]
//   i = 1
//   [6,9] starts at 6 > 5, so no more overlaps
//   
// Add newInterval: result = [[1,5]]
//
// Step 3: Add remaining intervals
//   Add [6,9]: result = [[1,5], [6,9]]

// Another example: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
//
// Step 1: Add [1,2] (ends before 4), result = [[1,2]]
// Step 2: Merge [3,5], [6,7], [8,10] (all overlap with [4,8])
//   newInterval becomes [3,10] after merging all
// Step 3: Add [12,16], final result = [[1,2],[3,10],[12,16]]

// Time: O(n) - single pass through intervals
// Space: O(n) - result array
```

### Problem 3: Meeting Rooms II

**Amazon/Google**: "Find minimum number of meeting rooms needed."

**Complete Solution**:
```javascript
function minMeetingRooms(intervals) {
    if (!intervals || intervals.length === 0) return 0;
    
    // Approach 1: Event-based solution (most intuitive)
    const events = [];
    
    // Create start and end events
    for (let interval of intervals) {
        events.push([interval[0], 1]);  // Meeting starts (+1 room)
        events.push([interval[1], -1]); // Meeting ends (-1 room)
    }
    
    // Sort events by time, with end events before start events at same time
    events.sort((a, b) => {
        if (a[0] === b[0]) {
            return a[1] - b[1]; // End events (-1) before start events (1)
        }
        return a[0] - b[0];
    });
    
    let maxRooms = 0;
    let currentRooms = 0;
    
    for (let [time, change] of events) {
        currentRooms += change;
        maxRooms = Math.max(maxRooms, currentRooms);
    }
    
    return maxRooms;
}

// Alternative approach: Separate start and end arrays
function minMeetingRoomsArrays(intervals) {
    const starts = intervals.map(interval => interval[0]).sort((a, b) => a - b);
    const ends = intervals.map(interval => interval[1]).sort((a, b) => a - b);
    
    let startIdx = 0;
    let endIdx = 0;
    let rooms = 0;
    let maxRooms = 0;
    
    while (startIdx < starts.length) {
        // If meeting starts before earliest meeting ends, need new room
        if (starts[startIdx] < ends[endIdx]) {
            rooms++;
            startIdx++;
        } else {
            // A meeting ended, room becomes available
            rooms--;
            endIdx++;
        }
        
        maxRooms = Math.max(maxRooms, rooms);
    }
    
    return maxRooms;
}

// Example: intervals = [[0,30],[5,10],[15,20]]
//
// Events approach:
// events = [[0,1], [30,-1], [5,1], [10,-1], [15,1], [20,-1]]
// After sorting: [[0,1], [5,1], [10,-1], [15,1], [20,-1], [30,-1]]
//
// Process events:
// Time 0: +1 room, currentRooms=1, maxRooms=1
// Time 5: +1 room, currentRooms=2, maxRooms=2  
// Time 10: -1 room, currentRooms=1, maxRooms=2
// Time 15: +1 room, currentRooms=2, maxRooms=2
// Time 20: -1 room, currentRooms=1, maxRooms=2
// Time 30: -1 room, currentRooms=0, maxRooms=2
//
// Answer: 2 rooms needed

// Time: O(n log n) - sorting dominates
// Space: O(n) - events array
```

### Problem 4: Non-overlapping Intervals

**Google/Apple**: "Find minimum intervals to remove to make rest non-overlapping."

**Complete Solution**:
```javascript
function eraseOverlapIntervals(intervals) {
    if (intervals.length <= 1) return 0;
    
    // Sort by end time (greedy approach)
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 0;
    let lastEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < lastEnd) {
            // Overlap detected, remove current interval
            count++;
        } else {
            // No overlap, update lastEnd
            lastEnd = intervals[i][1];
        }
    }
    
    return count;
}

// Why sort by end time?
// Greedy strategy: Keep intervals that end earliest
// This leaves maximum space for future intervals

// Example: intervals = [[1,2],[2,3],[3,4],[1,3]]
//
// After sorting by end time: [[1,2],[2,3],[3,4],[1,3]]
// 
// Process [1,2]: lastEnd = 2, count = 0
// Process [2,3]: 2 >= 2 (no overlap), lastEnd = 3, count = 0
// Process [3,4]: 3 >= 3 (no overlap), lastEnd = 4, count = 0  
// Process [1,3]: 1 < 4 (overlap), remove it, count = 1
//
// Wait, this doesn't seem right. Let me recalculate:
//
// After sorting by end time: [[1,2], [2,3], [1,3], [3,4]]
//
// Process [1,2]: lastEnd = 2, count = 0
// Process [2,3]: 2 >= 2 (no overlap), lastEnd = 3, count = 0
// Process [1,3]: 1 < 3 (overlap with [2,3]), remove [1,3], count = 1
// Process [3,4]: 3 >= 3 (no overlap), lastEnd = 4, count = 1
//
// Answer: Remove 1 interval

// Alternative: Sort by start time and keep track of minimum end
function eraseOverlapIntervalsAlt(intervals) {
    if (intervals.length <= 1) return 0;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    let count = 0;
    let prevEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < prevEnd) {
            // Overlap: remove interval with larger end time
            count++;
            prevEnd = Math.min(prevEnd, intervals[i][1]);
        } else {
            prevEnd = intervals[i][1];
        }
    }
    
    return count;
}

// Time: O(n log n) - sorting
// Space: O(1) - only variables
```

### Problem 5: Employee Free Time

**Google/Uber**: "Find free time common to all employees."

**Complete Solution**:
```javascript
function employeeFreeTime(schedule) {
    // Flatten all intervals from all employees
    const allIntervals = [];
    for (let employee of schedule) {
        for (let interval of employee) {
            allIntervals.push(interval);
        }
    }
    
    // Sort by start time
    allIntervals.sort((a, b) => a.start - b.start);
    
    // Merge overlapping intervals
    const merged = [allIntervals[0]];
    for (let i = 1; i < allIntervals.length; i++) {
        const current = allIntervals[i];
        const last = merged[merged.length - 1];
        
        if (current.start <= last.end) {
            last.end = Math.max(last.end, current.end);
        } else {
            merged.push(current);
        }
    }
    
    // Find gaps between merged intervals (free time)
    const freeTime = [];
    for (let i = 1; i < merged.length; i++) {
        const freeStart = merged[i - 1].end;
        const freeEnd = merged[i].start;
        
        if (freeStart < freeEnd) {
            freeTime.push(new Interval(freeStart, freeEnd));
        }
    }
    
    return freeTime;
}

// Example: schedule = [[[1,3],[6,7]], [[2,4]], [[2,5],[9,12]]]
// Employee 1: [1,3], [6,7]
// Employee 2: [2,4]  
// Employee 3: [2,5], [9,12]
//
// All intervals: [[1,3], [6,7], [2,4], [2,5], [9,12]]
// After sorting: [[1,3], [2,4], [2,5], [6,7], [9,12]]
//
// Merge overlapping:
// [1,3] and [2,4]: overlap, merge to [1,4]
// [1,4] and [2,5]: overlap, merge to [1,5]  
// [1,5] and [6,7]: no overlap, keep separate
// [6,7] and [9,12]: no overlap, keep separate
//
// Merged: [[1,5], [6,7], [9,12]]
//
// Free time (gaps):
// Between [1,5] and [6,7]: [5,6]
// Between [6,7] and [9,12]: [7,9]
//
// Answer: [[5,6], [7,9]]

// Time: O(n log n) where n is total number of intervals
// Space: O(n) for flattened intervals array
```

---

## Advanced Merge Intervals Techniques

### 1. Interval Tree for Dynamic Operations

```javascript
class IntervalNode {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.max = end; // Maximum end time in subtree
        this.left = null;
        this.right = null;
    }
}

class IntervalTree {
    constructor() {
        this.root = null;
    }
    
    insert(start, end) {
        this.root = this._insert(this.root, start, end);
    }
    
    _insert(node, start, end) {
        if (!node) {
            return new IntervalNode(start, end);
        }
        
        if (start <= node.start) {
            node.left = this._insert(node.left, start, end);
        } else {
            node.right = this._insert(node.right, start, end);
        }
        
        // Update max end time
        node.max = Math.max(node.end, 
                           node.left ? node.left.max : 0,
                           node.right ? node.right.max : 0);
        
        return node;
    }
    
    findOverlapping(start, end) {
        const result = [];
        this._findOverlapping(this.root, start, end, result);
        return result;
    }
    
    _findOverlapping(node, start, end, result) {
        if (!node) return;
        
        // Check if current interval overlaps
        if (node.start <= end && start <= node.end) {
            result.push([node.start, node.end]);
        }
        
        // Recursively search left if it might contain overlapping intervals
        if (node.left && node.left.max >= start) {
            this._findOverlapping(node.left, start, end, result);
        }
        
        // Recursively search right
        if (node.right) {
            this._findOverlapping(node.right, start, end, result);
        }
    }
}
```

### 2. Sweep Line Algorithm

```javascript
function processIntervals(intervals, queries) {
    const events = [];
    
    // Add interval start and end events
    for (let i = 0; i < intervals.length; i++) {
        events.push([intervals[i][0], 'start', i]);
        events.push([intervals[i][1], 'end', i]);
    }
    
    // Add query events
    for (let i = 0; i < queries.length; i++) {
        events.push([queries[i], 'query', i]);
    }
    
    // Sort events by time
    events.sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        // Priority: end < query < start
        const priority = {'end': 0, 'query': 1, 'start': 2};
        return priority[a[1]] - priority[b[1]];
    });
    
    const activeIntervals = new Set();
    const results = [];
    
    for (let [time, type, index] of events) {
        if (type === 'start') {
            activeIntervals.add(index);
        } else if (type === 'end') {
            activeIntervals.delete(index);
        } else { // query
            results.push([...activeIntervals]);
        }
    }
    
    return results;
}
```

### 3. Calendar Booking System

```javascript
class MyCalendar {
    constructor() {
        this.bookings = [];
    }
    
    book(start, end) {
        // Check for conflicts with existing bookings
        for (let [bookedStart, bookedEnd] of this.bookings) {
            if (start < bookedEnd && end > bookedStart) {
                return false; // Conflict found
            }
        }
        
        // No conflict, add booking
        this.bookings.push([start, end]);
        return true;
    }
}

// Double booking allowed
class MyCalendarTwo {
    constructor() {
        this.bookings = [];
        this.doubleBookings = [];
    }
    
    book(start, end) {
        // Check if this would create triple booking
        for (let [doubleStart, doubleEnd] of this.doubleBookings) {
            if (start < doubleEnd && end > doubleStart) {
                return false; // Would create triple booking
            }
        }
        
        // Check for overlaps with existing bookings (creates double bookings)
        for (let [bookedStart, bookedEnd] of this.bookings) {
            if (start < bookedEnd && end > bookedStart) {
                // Add overlapping part to double bookings
                const overlapStart = Math.max(start, bookedStart);
                const overlapEnd = Math.min(end, bookedEnd);
                this.doubleBookings.push([overlapStart, overlapEnd]);
            }
        }
        
        this.bookings.push([start, end]);
        return true;
    }
}
```

---

## Practice Problems by Difficulty

### Easy Merge Intervals Problems
1. **Merge Intervals** (LeetCode 56) - Basic merging
2. **Insert Interval** (LeetCode 57) - Insertion and merging
3. **Non-overlapping Intervals** (LeetCode 435) - Greedy interval selection
4. **Meeting Rooms** (LeetCode 252) - Simple overlap detection
5. **Summary Ranges** (LeetCode 228) - Consecutive number ranges

### Medium Merge Intervals Problems
1. **Meeting Rooms II** (LeetCode 253) - Minimum rooms needed
2. **Interval List Intersections** (LeetCode 986) - Find intersections
3. **Remove Covered Intervals** (LeetCode 1288) - Remove subset intervals
4. **My Calendar I** (LeetCode 729) - Dynamic booking system
5. **Partition Labels** (LeetCode 763) - String partitioning

### Hard Merge Intervals Problems
1. **Employee Free Time** (LeetCode 759) - Multi-employee scheduling
2. **My Calendar III** (LeetCode 732) - K-booking system
3. **Data Stream as Disjoint Intervals** (LeetCode 352) - Dynamic interval management
4. **Range Module** (LeetCode 715) - Add/remove/query ranges

---

## Common Mistakes and Solutions

### Mistake 1: Not Sorting First

```javascript
// Wrong: Processing intervals without sorting
function mergeWrong(intervals) {
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        // ❌ Without sorting, can't assume order
        const current = intervals[i];
        const last = merged[merged.length - 1];
        
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    
    return merged;
}

// Correct: Always sort first
function mergeCorrect(intervals) {
    if (intervals.length <= 1) return intervals;
    
    // ✅ Sort by start time first
    intervals.sort((a, b) => a[0] - b[0]);
    
    const merged = [intervals[0]];
    // ... rest of logic
}
```

### Mistake 2: Incorrect Overlap Detection

```javascript
// Wrong: Incomplete overlap condition
function hasOverlapWrong(interval1, interval2) {
    // ❌ Missing equal case
    return interval1[0] < interval2[1] && interval2[0] < interval1[1];
}

// Correct: Complete overlap condition
function hasOverlapCorrect(interval1, interval2) {
    // ✅ Includes touching intervals (equality)
    return interval1[0] <= interval2[1] && interval2[0] <= interval1[1];
}

// Note: Whether touching intervals ([1,2] and [2,3]) count as overlapping
// depends on problem requirements. Some problems treat them as separate.
```

### Mistake 3: Wrong Merge Logic

```javascript
// Wrong: Not updating end time correctly
function mergeIncorrect(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = merged[merged.length - 1];
        
        if (current[0] <= last[1]) {
            // ❌ Not taking maximum end time
            last[1] = current[1];
        } else {
            merged.push(current);
        }
    }
    
    return merged;
}

// Correct: Take maximum of both end times
function mergeCorrect(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = merged[merged.length - 1];
        
        if (current[0] <= last[1]) {
            // ✅ Take maximum end time
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    
    return merged;
}
```

---

## Success Metrics

### Week 1: Basic Interval Operations
- [ ] Understand why sorting by start time helps
- [ ] Implement basic merge intervals algorithm
- [ ] Handle edge cases (empty, single interval)
- [ ] Recognize overlap conditions correctly

### Week 2: Advanced Interval Problems
- [ ] Insert intervals into sorted lists
- [ ] Find minimum meeting rooms needed
- [ ] Remove minimum intervals for non-overlapping
- [ ] Calculate free time between intervals

### Week 3: Complex Interval Systems
- [ ] Build calendar booking systems
- [ ] Handle multiple employee schedules
- [ ] Implement efficient interval queries
- [ ] Use greedy algorithms for interval optimization

### Week 4: Expert Interval Mastery
- [ ] Solve any interval problem under time pressure
- [ ] Choose optimal approach for different scenarios
- [ ] Handle dynamic interval operations
- [ ] Ready for any FAANG interval interview

**Remember**: Merge intervals is about organizing chaos into order. Sort first to see the timeline clearly, then process systematically from left to right!