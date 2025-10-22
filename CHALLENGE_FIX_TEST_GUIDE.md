# Challenge System Index Progression Fix - Test Guide

## What Was Fixed

The challenge system had an issue where the subscriber was calling `sendRemainingTargetsToUnity()` on every state change, causing:
- Redundant Unity calls when unrelated state changed
- Race conditions during phase transitions between challenges
- Potential confusion in Unity with stale target data

## How to Test

### Prerequisites
- Run the application: `npm run dev`
- Open browser console to monitor Unity bridge calls (if needed)

### Test Case 1: Single Challenge Progression
**Test**: Complete targets within a single challenge (e.g., challenge-unit-1)

**Expected Behavior**:
1. When entering challenge-unit-1, Unity receives the full target list: [3, 5, 7]
2. After completing first target (3):
   - Unity should receive remaining targets: [5, 7]
   - This should happen only ONCE (not multiple times)
3. After completing second target (5):
   - Unity should receive remaining target: [7]
4. After completing final target (7):
   - Challenge moves to next phase

**What to Watch For**:
- ✅ Unity receives target lists only when index actually changes
- ✅ No duplicate/redundant calls when user is solving a target (clicking add/subtract)
- ✅ Correct remaining targets sent at each step

### Test Case 2: Challenge Phase Transitions
**Test**: Complete all targets in one challenge and move to the next (e.g., challenge-unit-1 → challenge-unit-2)

**Expected Behavior**:
1. Complete all targets in challenge-unit-1
2. System transitions to challenge-unit-2
3. Unity should receive the NEW challenge's targets: [2, 6, 8]
4. Unity should NOT receive the old challenge's targets during transition

**What to Watch For**:
- ✅ Clean transition without sending old challenge data
- ✅ New challenge starts with correct target list
- ✅ Index properly reset to 0 for new challenge

### Test Case 3: User Interaction During Challenge
**Test**: Click add/subtract buttons multiple times while solving a target

**Expected Behavior**:
1. Each click updates the columns
2. Unity should NOT receive new target lists on each click
3. Target list should only be sent when validation succeeds and index increments

**What to Watch For**:
- ✅ No Unity calls during user interaction (add/subtract)
- ✅ Only relevant state updates trigger Unity messages

## Before vs After

### Before (Problematic Behavior)
```
User clicks add → subscriber called → sendRemainingTargetsToUnity
User clicks add → subscriber called → sendRemainingTargetsToUnity
Feedback changes → subscriber called → sendRemainingTargetsToUnity
User validates → index changes → subscriber called → sendRemainingTargetsToUnity
```
Result: Many redundant calls, potential race conditions

### After (Fixed Behavior)
```
Enter challenge phase → subscriber called → sendRemainingTargetsToUnity
User clicks add → subscriber called → no Unity call (index unchanged)
User clicks add → subscriber called → no Unity call (index unchanged)
Feedback changes → subscriber called → no Unity call (not a challenge state change)
User validates → index changes → subscriber called → sendRemainingTargetsToUnity
```
Result: Only necessary calls when index or phase actually changes

## Code Changes Summary

The fix modifies the subscriber to:
1. Track both current and previous index values
2. Detect when index actually changes
3. Only call `sendRemainingTargetsToUnity` when:
   - Phase changes to a challenge phase, OR
   - Index changes within the same challenge phase

## Notes for Developers

- The fix is minimal and surgical - only the subscriber logic changed
- No changes to challenge validation functions
- No changes to Unity bridge functions
- Build and linter both pass
- No breaking changes to existing functionality
