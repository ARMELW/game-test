# Fix for intro-discover-carry Phase Loop Issue

## Issue Description
The user reported that in the intro phase, after exploring the carry mechanism (clicking △ and ∇ to see how 10 units convert to 1 ten), the app would get stuck or loop back to asking "combien de chiffres on a découvert" (how many digits we discovered) instead of progressing to the next phase.

## Root Cause
In the `intro-discover-carry` phase:
1. When the user clicks ∇ at [0, 1] (0 units, 1 ten), the borrow animation shows
2. The code displays: "Tu as vu ? La GROSSE lumière est redevenue 10 PETITES !"
3. Then: "Refais l'aller-retour plusieurs fois pour bien comprendre !"
4. Then: "Continue à explorer !"
5. Finally, after a delay, it transitions to `intro-count-digits` phase

**The Problem**: If the user follows the instruction to explore by clicking ∇ again during the delay, it triggers the borrow animation AGAIN, creating multiple pending `setTimeout` callbacks that all try to transition to `intro-count-digits`. This causes:
- Multiple transitions being scheduled
- Confusion about when to show the input field
- Potential for the phase to loop back unexpectedly

## Solution
Added animation tracking flags to prevent duplicate animations and phase transitions:

### 1. New State Properties
```typescript
introBorrowAnimationShown: boolean  // Tracks if borrow (10→9) animation shown
introCarryAnimationShown: boolean   // Tracks if carry (9→10) animation shown
```

### 2. Phase Initialization
When entering `intro-discover-carry` phase, both flags are reset to `false`:
```typescript
set({ introBorrowAnimationShown: false, introCarryAnimationShown: false });
```

### 3. Animation Control in handleAdd
When clicking △ to trigger carry (9 → 10):
- First time: Show full animation, set `introCarryAnimationShown = true`
- Subsequent times: Just perform the carry silently

### 4. Animation Control in handleSubtract
When clicking ∇ to trigger borrow (10 → 9):
- First time: Show full animation, set `introBorrowAnimationShown = true`, schedule transition
- Subsequent times: Just perform the borrow silently, NO new transition scheduled

This ensures:
✅ Animation shown exactly once
✅ Transition to `intro-count-digits` happens exactly once
✅ User can still explore by clicking △/∇ without triggering duplicate animations
✅ Smooth progression through the intro sequence

## Files Modified
1. `src/types.ts` - Added new properties and setters to MachineState interface
2. `src/store.ts` - Implemented the animation tracking logic

## Testing Instructions
To verify the fix works correctly:

1. Start the application and begin the intro sequence
2. Enter your name when prompted
3. Answer the questions about the machine
4. When you reach the `intro-discover-carry` phase:
   - Click △ on the units column to fill it to 9
   - Click △ one more time to see the carry animation (9 → 10)
   - Click △ again - should carry silently without animation
   - Click ∇ to see the borrow animation (10 → 9)
   - Click ∇ again - should borrow silently without animation
   - Click △ and ∇ multiple times
5. After the delay, you should be prompted: "Te rappelles-tu combien de chiffres différents tu as vu ?"
6. Answer the question (10 is correct)
7. Verify that you progress to the next phase (`intro-second-column`) smoothly without looping back

## Expected Behavior
- ✅ Carry animation shows only once when first going from 9 to 10
- ✅ Borrow animation shows only once when first going from 10 to 9
- ✅ User can continue exploring by clicking △/∇ without triggering animations again
- ✅ After the delay following the borrow animation, the app transitions to asking about digit count
- ✅ After answering correctly, the app progresses to `intro-second-column` phase
- ✅ No looping back to the digit counting question
