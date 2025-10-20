# Manual Testing Guide for Infinite Re-render Fix

## Overview
This guide helps verify that the infinite re-render issue has been fixed when clicking the green button (△) during challenges.

## Pre-requisites
- Development server running (`npm run dev`)
- Browser with Developer Tools open (recommended: Chrome/Firefox)

## Test Steps

### 1. Monitor for Infinite Re-renders

**Setup:**
1. Open the application in your browser
2. Open Browser Developer Tools (F12)
3. Go to the Console tab
4. Enable "Preserve log" to keep all messages

**Test Procedure:**
1. Navigate through the intro screens
2. Progress to a challenge phase (e.g., "challenge-unit-1")
3. Click the green button (△) multiple times (at least 5 clicks)

**Expected Result:**
- No console errors about "Maximum update depth exceeded"
- No warning messages about infinite loops
- Console logs should not flood continuously
- Application remains responsive

**Failure Indicators:**
- Console filled with repeated messages
- Browser becomes unresponsive
- Error: "Too many re-renders. React limits the number of renders..."
- Memory usage continuously increasing

### 2. Monitor Performance

**Setup:**
1. Open Developer Tools → Performance tab
2. Click "Record" button

**Test Procedure:**
1. Start recording
2. Navigate to a challenge
3. Click the green button (△) 5-10 times
4. Stop recording after 5 seconds

**Expected Result:**
- Smooth performance graph
- No excessive JavaScript execution spikes
- Normal frame rate (close to 60 FPS)
- Reasonable memory usage

**Failure Indicators:**
- Long JavaScript execution bars
- Frame drops
- Memory continuously increasing
- Warning triangles in the performance timeline

### 3. Memory Leak Check

**Setup:**
1. Open Developer Tools → Memory tab
2. Take a heap snapshot

**Test Procedure:**
1. Take initial snapshot (Snapshot 1)
2. Navigate to a challenge
3. Click green button (△) 20 times
4. Take second snapshot (Snapshot 2)
5. Click green button (△) 20 more times
6. Take third snapshot (Snapshot 3)

**Expected Result:**
- Memory increase is reasonable and stabilizes
- No continuous memory growth pattern
- Snapshot comparison shows expected objects only

**Failure Indicators:**
- Each snapshot shows significantly more memory
- Continuous upward trend in memory usage
- Large number of detached DOM nodes
- Excessive function closures or event listeners

### 4. Functional Test

**Test Procedure:**
1. Complete the full intro sequence
2. Progress through multiple challenges
3. Test all phases that involve the green button:
   - `tutorial`
   - `challenge-unit-1`, `challenge-unit-2`, `challenge-unit-3`
   - `challenge-ten-to-twenty`
   - `challenge-tens-1`, `challenge-tens-2`, `challenge-tens-3`
   - `challenge-hundreds-1`, `challenge-hundreds-2`, `challenge-hundreds-3`
   - `challenge-thousands-1`, `challenge-thousands-2`, `challenge-thousands-3`

**Expected Result:**
- All challenges work correctly
- State updates properly after each click
- Unity machine displays update correctly
- No lag or freezing
- Instructions and feedback display properly

## React DevTools Check (Optional)

If you have React DevTools installed:

**Setup:**
1. Open React DevTools
2. Go to Profiler tab
3. Enable "Highlight updates when components render"

**Test Procedure:**
1. Start profiling
2. Navigate to a challenge
3. Click green button multiple times
4. Stop profiling

**Expected Result:**
- Only expected components re-render (MachineANombres and its children)
- No cascading re-renders
- Re-render count is reasonable (1-2 per click)
- No components flashing repeatedly without user interaction

## Common Issues & Solutions

### Issue: "Cannot read property 'SendMessage' of undefined"
**Solution:** Unity hasn't loaded yet. Wait a few seconds and try again.

### Issue: Button doesn't respond
**Solution:** Check that you're in the correct phase and the column is unlocked.

### Issue: Legitimate re-renders
**Note:** Some re-renders are expected:
- When state changes (counter updates)
- When phase transitions occur
- When Unity sends messages back
These are normal and shouldn't cause performance issues.

## Success Criteria

✅ No infinite loop errors in console
✅ Smooth interaction with green button
✅ Memory usage remains stable
✅ Application remains responsive
✅ All challenges completable
✅ No visual glitches or freezing

## Reporting Issues

If you encounter problems:
1. Note the exact phase where it occurs
2. Capture console errors
3. Take screenshots of performance timeline
4. Document steps to reproduce
5. Report with the issue number reference

---

**Related Issue:** "quand le challenge est initalisé et qu'on clique sur le bouton vert ca fait un leak, infinite rerender"
**Fix Applied:** Wrapped Unity communication functions in `useCallback` to prevent function reference changes
