# Phase Update Fix

## Issue
`sendChallengeToUnity` was receiving the old phase value even after a phase was completed and a new challenge phase was started. This prevented Unity from receiving the correct challenge list for the new phase.

## Root Cause
When transitioning between challenge phases, the code used `set({ phase: ... })` directly instead of calling `get().setPhase(...)`. This bypassed the logic in the `setPhase` function that:
1. Updates the phase state
2. Calls `sendChallengeToUnity` when entering a challenge phase
3. Updates button visibility and instructions

## Solution
Replaced all direct `set({ phase: ... })` calls with `get().setPhase(...)` for challenge phase transitions.

### Before (Broken)
```typescript
set({
    phase: nextChallenge.phase,
    columns: resetCols
});
get().updateButtonVisibility();
```

### After (Fixed)
```typescript
set({
    columns: resetCols
});
get().setPhase(nextChallenge.phase);
```

## How It Works

### Phase Transition Flow
1. Challenge is completed
2. `get().setPhase(nextChallenge.phase)` is called
3. `setPhase` function:
   - Sets `phase` in store state
   - Checks if phase starts with 'challenge-'
   - Calls `sendChallengeToUnity(phase)` with the NEW phase
   - Calls `updateButtonVisibility()` and `updateInstruction()`
4. Store subscriber triggers:
   - Detects phase change
   - Calls `sendRemainingTargetsToUnity(phase, currentIndex)`
5. Unity receives the correct challenge list

### Challenge Communication System
The system uses two complementary functions:

1. **`sendChallengeToUnity(phase)`**
   - Called when entering a NEW challenge phase
   - Sends the FULL list of targets for that phase
   - Triggered by `setPhase` function

2. **`sendRemainingTargetsToUnity(phase, currentIndex)`**
   - Called when progressing within a challenge phase
   - Sends only the REMAINING targets (from currentIndex onwards)
   - Triggered by store subscriber on phase or index changes

## Modified Locations in store.ts

1. **Line ~1888**: Intro to `challenge-unit-1` transition
2. **Line ~1982**: Learn to `challenge-ten-to-twenty` transition
3. **Line ~2135**: Learn to `challenge-hundred-to-two-hundred` transition
4. **Line ~2189**: Learn to `challenge-two-hundred-to-three-hundred` transition
5. **Line ~2342**: Learn to `challenge-thousand-to-two-thousand` transition
6. **Line ~2386**: Learn to `challenge-two-thousand-to-three-thousand` transition
7. **Line ~2633**: Click-remove to `challenge-unit-1` transition
8. **Line ~2926**: Tens challenge progression (challenge-tens-1 → challenge-tens-2, etc.)
9. **Line ~3207**: Hundreds challenge progression (challenge-hundreds-1 → challenge-hundreds-2, etc.)
10. **Line ~3575**: Thousands challenge progression (challenge-thousands-1 → challenge-thousands-2, etc.)

## Benefits
- ✅ Unity always receives the correct challenge list
- ✅ No duplicate code (reuses existing `setPhase` logic)
- ✅ Consistent phase transition behavior
- ✅ Proper separation of concerns
- ✅ Easier to maintain and debug

## Testing
- ✅ Build successful with no TypeScript errors
- ✅ Linting passed
- ✅ All challenge phase transitions now properly call `sendChallengeToUnity`
