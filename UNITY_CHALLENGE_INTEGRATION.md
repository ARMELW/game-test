# Unity Bridge Challenge Integration

## Overview

This document describes the integration between the challenge system and Unity, allowing Unity to receive real-time updates about challenge targets.

## Implementation

### Message Format

Unity receives messages in the following format:
```
ChangeList<target1>/<target2>/<target3>/...
```

**Examples:**
- `ChangeList544/1352/9871` - Challenge with targets 544, 1352, and 9871
- `ChangeList3/5/7` - Challenge with targets 3, 5, and 7
- `ChangeList1234/2345/3456` - Challenge with targets 1234, 2345, and 3456

### When Messages Are Sent

Unity receives challenge list updates in the following scenarios:

#### 1. Entering a Challenge Phase
When `setPhase()` is called with a challenge phase (any phase starting with `challenge-`), the full list of targets for that challenge is sent to Unity.

**Example:**
```typescript
setPhase('challenge-unit-1'); 
// Sends: ChangeList3/5/7
```

#### 2. Moving to Next Target
When a target is successfully validated and there are more targets in the challenge, Unity receives a `next goal` message to advance to the next target in its current list.

**Example:**
```typescript
// Challenge has targets [3, 5, 7]
// User validates target 3 successfully
sendNextGoal(); // Sends: "next goal" message
// Unity advances to show target 5 (second item in its list)
```

**Note:** Unity keeps the full list of targets it received when the phase started and advances through it using the `next goal` message. This prevents synchronization issues.

#### 3. Challenge Reset
When a challenge is reset, Unity receives the full list of targets again.

**Example:**
```typescript
resetUnitChallenge();
// Sends: ChangeList3/5/7 (full list from beginning)
```

## Supported Challenge Types

The integration supports all challenge types in the application:

- **Unit Challenges**: `challenge-unit-1`, `challenge-unit-2`, `challenge-unit-3`
- **Ten to Twenty**: `challenge-ten-to-twenty`
- **Tens Challenges**: `challenge-tens-1`, `challenge-tens-2`, `challenge-tens-3`
- **Hundred to Two Hundred**: `challenge-hundred-to-two-hundred`
- **Two Hundred to Three Hundred**: `challenge-two-hundred-to-three-hundred`
- **Hundreds Challenges**: `challenge-hundreds-1`, `challenge-hundreds-2`, `challenge-hundreds-3`
- **Thousand to Two Thousand**: `challenge-thousand-to-two-thousand`
- **Two Thousand to Three Thousand**: `challenge-two-thousand-to-three-thousand`
- **Thousands Simple Combination**: `challenge-thousands-simple-combination`
- **Thousands Challenges**: `challenge-thousands-1`, `challenge-thousands-2`, `challenge-thousands-3`

## Code Structure

### unityBridge.ts

Added new function:
```typescript
export function sendChallengeListToUnity(targets: number[]) {
  if (typeof window.unityInstance !== 'undefined' && targets && targets.length > 0) {
    const value = targets.join('/');
    window.unityInstance.SendMessage('WebBridge', 'ReceiveStringMessageFromJs', 'ChangeList' + value);
  }
}
```

### store.ts

Added helper functions:

1. **sendChallengeToUnity(phase: string)**: Sends the full challenge list for a given phase
2. **sendRemainingTargetsToUnity(phase: string, currentIndex: number)**: Sends remaining targets from the current index (only used when phase changes)

These helpers are integrated into:
- `setPhase()` - Sends full list when entering challenge phase
- Subscriber - Sends full list only when phase changes to a challenge phase (prevents race conditions)
- All `resetXxxChallenge()` functions - Sends full list on reset
- Validation handlers - Send `sendNextGoal()` message to advance Unity through its current list

## Error Handling

The integration includes proper error handling:

1. **Unity Instance Check**: Messages are only sent if `window.unityInstance` is defined
2. **Target Validation**: Messages are only sent if targets array is non-empty
3. **Phase Validation**: Only challenge phases trigger Unity messages
4. **Index Validation**: Target indices are validated before accessing challenge arrays

## Testing

To verify the integration:

1. Enter a challenge phase and check Unity console for `ChangeList` messages
2. Progress through a challenge and verify Unity receives updated target lists
3. Reset a challenge and verify Unity receives the full list again

## Example Flow

```
User Flow                          Unity Message                React State
─────────────────────────────────  ──────────────────────────   ─────────────────────────
Enter challenge-unit-1              ChangeList3/5/7              targetIndex=0, showing 3
Complete target 3                   "next goal"                  targetIndex=1, showing 5
Complete target 5                   "next goal"                  targetIndex=2, showing 7
Complete target 7                   (Challenge complete)         Move to next phase
Enter challenge-unit-2              ChangeList2/6/8              targetIndex=0, showing 2
Reset challenge                     ChangeList2/6/8              targetIndex=0, showing 2
```

**Key Point:** Unity maintains the full goal list and advances through it using "next goal" messages. The goal list is only sent when:
- Entering a new challenge phase
- Resetting a challenge
- NOT when just incrementing the target index (this prevents synchronization issues)

## Notes

- Messages are sent asynchronously and do not block the main application flow
- Unity must have a `WebBridge` GameObject with a method that receives these messages
- The integration is backward compatible - if Unity is not initialized, messages are silently ignored
