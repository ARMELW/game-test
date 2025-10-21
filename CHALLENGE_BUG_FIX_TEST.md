# Manual Test Guide: Challenge Progression Bug Fix

## Issue Description
Previously, when a user made a wrong answer in a challenge, the objective would be removed from the challenge list in Unity and the system would move to the next objective anyway.

## What Was Fixed
The subscriber in `store.ts` was calling `sendRemainingTargetsToUnity()` on every state change, which caused Unity to receive the challenge list multiple times, including after failure attempts. Now it only sends updates when the phase or target index actually changes.

## How to Test

### Setup
1. Build and run the application: `npm run dev`
2. Navigate through the intro to reach a challenge phase (e.g., `challenge-unit-1`)

### Test Case 1: Wrong Answer Should Not Advance
1. Start a unit challenge (after intro)
2. The first target might be `3`
3. **Set the value to something WRONG** (e.g., `5` instead of `3`)
4. Click the "VALIDER" button
5. **Expected Result:**
   - You should see error feedback
   - The objective should remain `3` (NOT move to the next target)
   - Unity should still show `3` as the current goal
   - The challenge counter should NOT increment (e.g., should stay at `0/3` not move to `1/3`)
6. **Repeat the wrong answer 2-3 more times**
   - Each time, verify the objective stays the same
   - The attempt count should increase (reflected in feedback messages)
7. **Now give the CORRECT answer** (`3`)
   - The objective should advance to the next target
   - Unity should update to show the next goal
   - The success counter should increment (e.g., `1/3`)

### Test Case 2: Multiple Failed Attempts
1. Continue in the same challenge
2. For the next objective (e.g., `5`), give wrong answers multiple times:
   - Try `2` → Should show error, stay on objective `5`
   - Try `7` → Should show error, stay on objective `5`
   - Try `4` → Should show error, stay on objective `5`
   - After 4+ attempts, you should see help options
3. **Expected Result:**
   - Objective should remain `5` throughout all failed attempts
   - Unity goal list should not change
   - Help system should activate after multiple failures

### Test Case 3: Correct Answer Advances
1. On the current objective, **give the correct answer**
2. **Expected Result:**
   - Objective advances to the next one
   - Unity receives "next goal" message
   - Success counter increments
   - Unity challenge list updates to remove the completed objective

### Test Case 4: Different Challenge Types
Repeat Test Cases 1-3 for other challenge types:
- `challenge-tens-1`, `challenge-tens-2`, `challenge-tens-3`
- `challenge-hundreds-1`, `challenge-hundreds-2`, `challenge-hundreds-3`
- `challenge-thousands-1`, `challenge-thousands-2`, `challenge-thousands-3`

## What to Look For

### ✅ Success Indicators
- Wrong answers do NOT advance the objective
- Unity's goal list stays consistent when giving wrong answers
- The challenge progress counter only increments on correct answers
- Feedback messages are appropriate for wrong vs. right answers
- Help system activates correctly after multiple failures

### ❌ Failure Indicators (What Was Happening Before)
- Objective advances even on wrong answers
- Unity goal list changes when it shouldn't
- Challenge counter increments incorrectly
- The challenge completes with wrong answers

## Technical Details

### Before Fix
```typescript
// This ran on EVERY state change
sendRemainingTargetsToUnity(state.phase, currentIndex);
```

### After Fix
```typescript
// Only runs when phase or index actually changes
if (state.phase !== previousState.phase || currentIndex !== previousIndex) {
    sendRemainingTargetsToUnity(state.phase, currentIndex);
}
```

### Why This Fixes It
- **Before:** Every feedback update, attempt count change, or any state change would re-send the challenge list to Unity
- **After:** Challenge list only updates when the user actually progresses (correct answer) or changes phases
- This prevents Unity from receiving mixed signals about what the current objective should be
