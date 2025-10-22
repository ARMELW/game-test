# Challenge System Index Progression - Technical Deep Dive

## Problem Statement (Original French)

"Tu peu tester un peu le system de challenge parce su'il a quelque chose qui ne colle pas du tous au niveau de passage d'un index a l'autre"

Translation: "Test the challenge system because there's something wrong with the progression from one index to another"

## Technical Analysis

### Architecture Overview

The challenge system has several components:

1. **Challenge Definitions** (`types.ts`):
   - Arrays of target numbers for each challenge phase
   - Example: `UNIT_CHALLENGES[0] = { phase: 'challenge-unit-1', targets: [3, 5, 7] }`

2. **State Management** (`store.ts`):
   - Current phase (e.g., 'challenge-unit-1')
   - Target index (which target in the array the user is currently solving)
   - Success count (how many targets completed)

3. **Unity Bridge** (`unityBridge.ts`):
   - `sendChallengeListToUnity(targets)`: Sends full challenge target list
   - `sendCorrectValue()`: Notifies Unity of correct answer
   - `sendNextGoal()`: Notifies Unity to show next target

4. **Zustand Subscriber**:
   - Runs on every state change
   - Synchronizes state with Unity

### The Bug

The subscriber was implemented as:

```typescript
useStore.subscribe((state, previousState) => {
    // Get current index
    let currentIndex = 0;
    if (state.phase.startsWith('challenge-unit-')) {
        currentIndex = state.unitTargetIndex;
    }
    // ... similar for other challenge types
    
    // PROBLEM: Called on EVERY state change
    sendRemainingTargetsToUnity(state.phase, currentIndex);
});
```

#### Issue #1: Redundant Calls

Every time ANY state property changed, `sendRemainingTargetsToUnity` was called:

```typescript
// User clicks add button
handleAdd() → set({ columns: newColumns }) → subscriber runs → Unity call

// Feedback message changes
setFeedback("Good job!") → subscriber runs → Unity call

// User validates
handleValidateLearning() → set({ unitTargetIndex: 1 }) → subscriber runs → Unity call
```

With hundreds of state changes during a challenge, Unity was receiving the same target list repeatedly.

#### Issue #2: Race Condition During Phase Transitions

When transitioning between challenges (e.g., challenge-unit-1 → challenge-unit-2):

```typescript
// In handleValidateLearning() after completing all targets:
resetUnitChallenge();  // Sets unitTargetIndex = 0
                       // Still in phase 'challenge-unit-1'
                       // Subscriber sees: phase='challenge-unit-1', index=0
                       // Sends: [3, 5, 7] ← WRONG! Old challenge data

set({ phase: 'challenge-unit-2' });  // Changes phase
                                      // Subscriber sees: phase='challenge-unit-2', index=0
                                      // Sends: [2, 6, 8] ← CORRECT
```

Unity received the old challenge's targets briefly during the transition.

#### Issue #3: Timing Issues

The subscriber runs synchronously after every `set()` call. With rapid state updates:

```typescript
set({ columns: newCols, unitTargetIndex: 1 });
// Subscriber sees both changes at once
// But what if there are intermediate states?

setTimeout(() => {
    set({ feedback: "Next target" });
    // Subscriber runs again with same index
    // Sends same target list again
}, FEEDBACK_DELAY);
```

### The Fix

Modified subscriber to only call Unity when relevant state changes:

```typescript
useStore.subscribe((state, previousState) => {
    let currentIndex = 0;
    let previousIndex = 0;
    let indexChanged = false;
    
    // Track both current and previous index
    if (state.phase.startsWith('challenge-unit-')) {
        currentIndex = state.unitTargetIndex;
        previousIndex = previousState.unitTargetIndex;
        indexChanged = currentIndex !== previousIndex;
    }
    // ... similar for other challenge types
    
    const phaseChanged = state.phase !== previousState.phase;
    const isInChallengePhase = state.phase.startsWith('challenge-');
    
    // Only send when phase OR index changes
    if (isInChallengePhase && (phaseChanged || indexChanged)) {
        sendRemainingTargetsToUnity(state.phase, currentIndex);
    }
});
```

### Benefits of the Fix

1. **Performance**: Drastically reduced Unity bridge calls
   - Before: Hundreds of calls per challenge
   - After: ~3-7 calls per challenge (only when needed)

2. **Correctness**: No more stale data during transitions
   - Clean phase transitions without sending old challenge data

3. **Predictability**: Unity only receives updates when:
   - Entering a new challenge phase
   - Progressing to next target in current challenge

### Edge Cases Handled

1. **Phase change without index change**:
   - Moving from non-challenge to challenge phase
   - Unity receives full target list for new challenge

2. **Index change without phase change**:
   - Completing a target within same challenge
   - Unity receives remaining targets

3. **Both phase and index change**:
   - Shouldn't happen in normal flow
   - Both are challenge-related, so Unity call is appropriate

4. **Neither phase nor index change**:
   - Most common case (user clicking buttons, feedback updates)
   - No Unity call (optimization)

### Testing Scenarios

#### Scenario 1: Normal Progress Through Challenge
```
Initial: phase='challenge-unit-1', index=0
→ Unity receives [3, 5, 7]

User solves 3, validates
→ set({ index: 1 })
→ indexChanged=true, phaseChanged=false
→ Unity receives [5, 7]

User solves 5, validates
→ set({ index: 2 })
→ indexChanged=true, phaseChanged=false
→ Unity receives [7]

User solves 7, validates
→ Phase changes to 'learn-carry'
→ indexChanged=false, phaseChanged=true, isInChallengePhase=false
→ No Unity call (not a challenge phase)
```

#### Scenario 2: Challenge to Challenge Transition
```
Complete challenge-unit-3
→ resetUnitChallenge() sets index=0
→ indexChanged=true (2→0), phaseChanged=false
→ Unity receives [4, 9, 1] (correct, same challenge)

→ set({ phase: 'learn-carry' })
→ phaseChanged=true, isInChallengePhase=false
→ No Unity call (not a challenge phase)
```

#### Scenario 3: User Clicking Add/Subtract
```
phase='challenge-unit-1', index=0

User clicks add
→ set({ columns: newCols })
→ indexChanged=false, phaseChanged=false
→ No Unity call ✓

User clicks add again
→ set({ columns: newCols })
→ indexChanged=false, phaseChanged=false
→ No Unity call ✓

User validates with wrong answer
→ set({ feedback: "Try again" })
→ indexChanged=false, phaseChanged=false
→ No Unity call ✓
```

## Implementation Details

### Code Location
- File: `src/store.ts`
- Lines: 4120-4180 (subscriber block)

### Dependencies
- `sendRemainingTargetsToUnity()`: Helper function that slices target array
- `sendChallengeListToUnity()`: Unity bridge function (unchanged)
- Zustand's `subscribe()`: Reactive state subscription

### No Breaking Changes
- All validation functions unchanged
- Unity bridge interface unchanged
- Challenge definitions unchanged
- Only optimization in subscriber logic

## Future Improvements

1. **Debouncing**: Could add debounce to handle rapid state changes
2. **Memoization**: Cache target lists to avoid recalculation
3. **Logging**: Add debug logs to track Unity calls in development
4. **Unit Tests**: Create tests for subscriber behavior (none exist currently)

## References

- Original issue: "Challenge system index progression problem"
- Related files:
  - `src/store.ts`: Main state management
  - `src/types.ts`: Challenge type definitions
  - `src/unityBridge.ts`: Unity communication
- Documentation:
  - `CHALLENGE_FIX_TEST_GUIDE.md`: Manual testing guide
  - `UNITY_BRIDGE_API.md`: Unity bridge documentation
