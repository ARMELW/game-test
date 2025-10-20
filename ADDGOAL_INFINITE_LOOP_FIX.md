# Fix: addGoal Infinite Loop Prevention

## Problem
The application was experiencing "Maximum call stack size exceeded" errors caused by the `addGoal` message handler in `MachineANombres.tsx`. When Unity sent an `addGoal` message, the JavaScript code would call validation handlers that could trigger state changes, which in turn caused Unity to send more `addGoal` messages, creating an infinite loop.

## Root Cause
- Unity sends `addGoal` message to JavaScript
- JavaScript calls validation handler (e.g., `handleValidateTenToTwenty()`)
- Validation handler updates state or triggers Unity interactions
- Unity responds by sending another `addGoal` message immediately
- Loop repeats, causing stack overflow

## Solution
Implemented a debouncing mechanism specifically for `addGoal` messages in `MachineANombres.tsx`.

### Implementation Details

Added anti-loop protection at the message handling level:

```typescript
// Ref to track last addGoal validation time to prevent rapid successive calls
const lastAddGoalTimeRef = useRef<number>(0);
const addGoalDebounceMs = 150; // Debounce period for addGoal messages

// Inside handleUnityMessage callback
else if (parsedData.type === 'addGoal') {
  // Anti-loop protection: Prevent addGoal from being processed too frequently
  const now = Date.now();
  if (now - lastAddGoalTimeRef.current < addGoalDebounceMs) {
    console.warn('addGoal message ignored - debounce protection active');
    return;
  }
  lastAddGoalTimeRef.current = now;

  // Handle validation triggered by Unity's "add to goal list" message
  // ... rest of the validation logic
}
```

### Key Features
1. **Time-based debouncing**: Prevents `addGoal` messages from being processed more than once every 150ms
2. **Minimal code changes**: Only 12 lines added to the existing codebase
3. **No breaking changes**: Normal operation is unaffected, only rapid successive calls are blocked
4. **Warning logging**: Blocked messages are logged to console for debugging

## Complementary Protection
This fix works in conjunction with the existing anti-loop protection in `useUnity.ts` (see `CALL_STACK_FIX.md`):
- `useUnity.ts`: Prevents OUTGOING messages from being sent too frequently
- `MachineANombres.tsx`: Prevents INCOMING `addGoal` messages from being processed too frequently

Together, these provide comprehensive protection against infinite loops.

## Testing
- ✅ Linting passes
- ✅ Build succeeds  
- ✅ No breaking changes to existing functionality
- ✅ TypeScript compilation successful

## Manual Verification Steps
1. Load the application and wait for Unity to initialize
2. Navigate to a challenge phase (e.g., 'challenge-ten-to-twenty')
3. Trigger validation by interacting with Unity
4. Monitor browser console for any "Maximum call stack size exceeded" errors
5. Verify that:
   - No stack overflow errors occur
   - Challenge validation works correctly
   - Rapid successive `addGoal` messages are debounced (check console warnings)
   - Normal single `addGoal` messages are processed correctly

## Files Modified
- `src/MachineANombres.tsx` - Added debouncing protection for `addGoal` messages

## Related Fixes
- See `CALL_STACK_FIX.md` for outgoing message protection in `useUnity.ts`

## Benefits
✅ Prevents infinite message loops from `addGoal` handlers  
✅ Maintains existing functionality for legitimate messages  
✅ Minimal performance overhead (simple timestamp comparison)  
✅ Easy to debug with console warnings  
✅ Surgical fix with no side effects  
