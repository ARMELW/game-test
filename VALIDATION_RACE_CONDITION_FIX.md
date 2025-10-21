# Fix: Validation Race Condition in Tens Challenge

## Problem Description

During the tens challenge, when a user correctly enters the target value (e.g., 23), the validation incorrectly reports it as wrong even though Unity shows it as correct.

### Issue Logs Analysis

From the provided logs:
```
Target: 23 Calculé: 23  ← Correct!
data {type: 'addGoal', timestamp: 1761047199040, value: '0045', numericValue: 45}
data {type: 'wrongValue', timestamp: 1761047199042}  ← Unity sends wrongValue event
Wrong value event received from Unity - triggering validation
Target: 45 Calculé: 0  ← State already changed, validation fails
```

## Root Cause

1. User correctly enters value 23 (matching target)
2. React code validates and sends "correct value" to Unity
3. Unity processes this and:
   - Changes the challenge target to the next goal (45)
   - Sends back "addGoal" event (which is ignored by React)
   - Sends back "wrongValue" event (legacy behavior)
4. React receives "wrongValue" event and triggers validation again
5. By this time, the state has already been updated:
   - New target is 45
   - Columns have been reset to 0
   - This validation incorrectly shows failure: 0 ≠ 45

## Solution

Implemented a validation debounce mechanism to prevent rapid-fire duplicate validations:

### Changes in `MachineANombres.tsx`

1. **Added validation lock refs:**
```typescript
// Validation lock to prevent duplicate validations
const validationInProgressRef = useRef(false);
const lastValidationTimeRef = useRef(0);
```

2. **Modified `handleManualValidation` function:**
```typescript
const handleManualValidation = useCallback(() => {
  // Prevent duplicate validations within 500ms window
  const now = Date.now();
  if (validationInProgressRef.current || (now - lastValidationTimeRef.current) < 500) {
    console.log("Validation skipped - too soon after previous validation");
    return;
  }
  
  // Set validation lock
  validationInProgressRef.current = true;
  lastValidationTimeRef.current = now;
  
  // Release lock after a short delay
  setTimeout(() => {
    validationInProgressRef.current = false;
  }, 100);
  
  // ... rest of validation logic
}, [phase]);
```

## How It Works

1. **First Validation (User clicks validate or Unity sends validButton)**
   - Check: No validation in progress, more than 500ms since last validation
   - ✅ Proceed with validation
   - Set lock and record timestamp
   - Validation completes successfully
   - State transitions to next challenge
   - Lock releases after 100ms

2. **Second Validation Attempt (Unity sends wrongValue ~2ms later)**
   - Check: Less than 500ms since last validation (only 2ms elapsed)
   - ❌ Skip validation
   - Log: "Validation skipped - too soon after previous validation"
   - Prevent incorrect validation with new state

## Benefits

- **Prevents race conditions**: Multiple events from Unity cannot trigger overlapping validations
- **Maintains responsiveness**: 500ms window is short enough not to impact user experience
- **Minimal code changes**: Only adds debouncing logic, no changes to validation logic itself
- **Backward compatible**: Works with existing Unity integration

## Testing Recommendations

1. Test tens challenge with correct answers - should not show false negatives
2. Verify rapid button clicks still work (within reason)
3. Confirm validation still works normally for wrong answers
4. Check that help system triggers correctly after failed attempts

## Technical Details

- **Debounce window**: 500ms (adjustable if needed)
- **Lock duration**: 100ms (ensures validation completes before releasing)
- **Implementation**: Uses React `useRef` to maintain state across renders without triggering re-renders
