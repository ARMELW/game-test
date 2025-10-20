# Fix for Infinite Re-render Issue

## Problem Description

When a challenge is initialized and the user clicks the green button (△), the application experiences an infinite re-render loop, causing memory leaks and performance issues.

## Root Cause Analysis

The issue was located in the interaction between two components:

1. **`src/MachineANombres.tsx`** (lines 220-331): A `useEffect` hook that synchronizes Unity roll locks based on the current phase and column states.

2. **`src/hooks/useUnity.ts`**: The custom hook that provides Unity communication functions.

### The Problem

The `useUnity` hook was returning new function instances on every render:

```typescript
// Before (problematic):
const lockUnitRoll = (locked: boolean) => {
  if (isLoaded) {
    sendMessage('WebBridge', 'ReceiveStringMessageFromJs', `LockUnit:${locked ? 1 : 0}`);
  }
};
```

These functions were used in the dependency array of a `useEffect`:

```typescript
useEffect(() => {
  // ... lock/unlock logic
  lockUnitRoll(lockUnits);
  lockTenRoll(lockTens);
  lockHundredRoll(lockHundreds);
  lockThousandRoll(lockThousands);
}, [phase, columns, isCountingAutomatically, unityLoaded, 
    lockUnitRoll, lockTenRoll, lockHundredRoll, lockThousandRoll, introMaxAttempt]);
```

### The Infinite Loop

1. Component renders
2. `useUnity()` creates new function instances
3. `useEffect` detects dependency change (new function references)
4. Effect runs and potentially updates state
5. Component re-renders → back to step 1

## Solution

Wrapped all Unity communication functions in `useCallback` to ensure stable references:

```typescript
// After (fixed):
const lockUnitRoll = useCallback((locked: boolean) => {
  if (isLoaded) {
    sendMessage('WebBridge', 'ReceiveStringMessageFromJs', `LockUnit:${locked ? 1 : 0}`);
  }
}, [isLoaded, sendMessage]);
```

### Functions Fixed

- `changeCurrentValue`
- `changeCurrentGoalList`
- `lockThousandRoll`
- `lockHundredRoll`
- `lockTenRoll`
- `lockUnitRoll`

## Testing

To verify the fix:

1. Run the development server: `npm run dev`
2. Navigate to the application
3. Progress through challenges until a challenge is initialized
4. Click the green button (△) multiple times
5. Verify that:
   - No infinite re-renders occur
   - No memory leaks are detected in browser DevTools
   - The UI remains responsive
   - State updates correctly

## Impact

- **Performance**: Eliminates infinite re-render loop
- **Memory**: Prevents memory leaks from excessive re-renders
- **User Experience**: Maintains smooth interaction during challenges
- **Code Quality**: Follows React best practices for hook dependencies

## Files Modified

- `src/hooks/useUnity.ts`: Wrapped 6 functions in `useCallback`

## Related Issues

This fix addresses the issue: "quand le challenge est initalisé et qu'on clique sur le bouton vert ca fait un leak, infinite rerender"
