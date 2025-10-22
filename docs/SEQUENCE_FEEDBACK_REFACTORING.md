# Sequence Feedback Refactoring

## Overview

This document describes the refactoring of the `sequenceFeedback` system to manage two-part feedback messages as state rather than nested callback chains.

## Problem

Previously, `sequenceFeedback` was implemented as a function that directly managed TTS callbacks in a nested manner:

```typescript
sequenceFeedback: (first: string, second?: string, onComplete?: () => void) => {
    get().setFeedback(first);
    textToSpeechService.setCallbacks({
        onEnd: () => {
            if (second) {
                get().setFeedback(second);
                textToSpeechService.setCallbacks({
                    onEnd: () => onComplete?.()
                });
                textToSpeechService.speak(second);
            } else {
                onComplete?.();
            }
        }
    });
    textToSpeechService.speak(first);
}
```

This approach had several issues:
1. Nested callbacks made the code hard to follow
2. State was not tracked in the store
3. Couldn't be managed through `updateInstruction`
4. Difficult to test and debug

## Solution

The refactoring treats feedback sequences as state, similar to how phases are managed:

### New State Properties

```typescript
feedbackSequence: string[]           // Array of messages to speak in sequence
feedbackSequenceStep: number         // Current step in the sequence
feedbackSequenceCallback: (() => void) | null  // Callback to execute when complete
```

### New Functions

1. **`setFeedbackSequence(sequence: string[], callback?: () => void)`**
   - Initiates a new feedback sequence
   - Sets the sequence array, resets step to 0, stores callback
   - Triggers the first message via `advanceFeedbackSequence()`

2. **`advanceFeedbackSequence()`**
   - Speaks the current message in the sequence
   - Sets up TTS callback to advance to next step
   - Executes completion callback when sequence finishes
   - Clears state when complete

3. **`sequenceFeedback(first: string, second?: string, onComplete?: () => void)`**
   - Backward-compatible wrapper
   - Converts old API to new state-based approach
   - Will be removed once all calls are migrated

## Benefits

1. **State Management**: Feedback sequences are now tracked in the store
2. **Testability**: Can inspect current sequence step in tests
3. **Centralization**: Can be integrated with `updateInstruction` for phase-based management
4. **Clarity**: Removes nested callback chains
5. **Flexibility**: Easy to add more messages to a sequence

## Usage

### Current (Backward Compatible)
```typescript
sequenceFeedback(
    "First message",
    "Second message",
    () => { /* callback */ }
);
```

### New (Direct State Management)
```typescript
setFeedbackSequence([
    "First message",
    "Second message",
    "Third message"  // Can easily add more
], () => { /* callback */ });
```

## Future Improvements

1. **Phase Integration**: Integrate with `updateInstruction` to manage sequences based on phase
2. **Remove Wrapper**: Once all code is migrated, remove the `sequenceFeedback` wrapper
3. **Enhanced Features**: Add pause/resume, skip, or replay capabilities
4. **Testing**: Add unit tests for sequence management

## Migration Guide

To migrate existing `sequenceFeedback` calls:

```typescript
// Before
sequenceFeedback("Message 1", "Message 2", callback);

// After
setFeedbackSequence(["Message 1", "Message 2"], callback);
```

For single messages:
```typescript
// Before
sequenceFeedback("Single message");

// After  
setFeedbackSequence(["Single message"]);
// Or just use speakAndThen for single messages
```
