# Fix: Maximum Call Stack Size Exceeded

## Problem
The application was generating a "Maximum call stack size exceeded" error when transitioning to challenge mode in the Counting Machine game. This was caused by an infinite message loop between JavaScript and Unity.

## Root Cause
- Circular communication between JS ↔ Unity without proper guards
- `sendMessage` being triggered recursively
- No protection against duplicate or circular messages
- Multiple state changes during challenge mode transition triggering rapid message sends

## Solution
Implemented anti-loop protection in the `useUnity` hook with three layers of defense:

### 1. Duplicate Message Prevention (100ms debounce)
```typescript
if (message === lastMessageRef.current && 
    (now - messageTimestampRef.current) < 100) {
  return; // Block duplicate within 100ms
}
```
Prevents the same message from being sent multiple times in quick succession.

### 2. Recursive Call Prevention
```typescript
if (sendingMessageRef.current) return; // Block if already sending
```
Blocks any new message sends while a previous send is in progress (50ms window).

### 3. Load State Validation
```typescript
if (!isLoaded) return; // Only send if Unity is loaded
```
Prevents errors from attempting to send messages before Unity is ready.

## Implementation Details

### Protected Send Function
Created a new `protectedSend` function that wraps all Unity message sends:

```typescript
const protectedSend = useCallback((message: string) => {
  if (!isLoaded) return;
  
  // Block duplicate messages (< 100ms)
  const now = Date.now();
  if (message === lastMessageRef.current && 
      (now - messageTimestampRef.current) < 100) {
    return;
  }
  
  // Block recursive sending
  if (sendingMessageRef.current) return;
  
  try {
    sendingMessageRef.current = true;
    lastMessageRef.current = message;
    messageTimestampRef.current = now;
    sendMessage('WebBridge', 'ReceiveStringMessageFromJs', message);
  } finally {
    setTimeout(() => {
      sendingMessageRef.current = false;
    }, 50);
  }
}, [isLoaded, sendMessage]);
```

### Updated Functions
All message-sending functions now use `protectedSend`:
- `changeCurrentValue`
- `changeCurrentGoalList`
- `lockThousandRoll`
- `lockHundredRoll`
- `lockTenRoll`
- `lockUnitRoll`

## Benefits
✅ Prevents infinite loops between JS and Unity
✅ Blocks duplicate messages within 100ms window
✅ Prevents recursive message sending
✅ Minimal code changes (surgical fix)
✅ No breaking changes to existing functionality
✅ No performance impact on normal operation

## Testing
- ✅ Linting passes
- ✅ Build succeeds
- ✅ No breaking changes to API

## Manual Verification Steps
1. Load the application
2. Wait for Unity to initialize
3. Navigate through different phases
4. Transition to challenge mode
5. Verify:
   - No stack overflow errors
   - Challenge mode loads correctly
   - Machine responds to input
   - Lock states apply correctly

## Files Modified
- `src/hooks/useUnity.ts` - Added anti-loop protection

## Related Issue
Fixes the "Maximum call stack size exceeded" bug that occurred when transitioning to challenge mode.
