# Voice Feature Testing Guide

## Overview
The pedagogical assistant now has text-to-speech (TTS) capabilities. Messages are spoken aloud using the browser's Web Speech API, and phase transitions are synchronized with voice completion rather than arbitrary timeouts.

## What Has Changed

### Before
- Phase transitions used `setTimeout` with fixed delays (e.g., `FEEDBACK_DELAY = 2500ms`)
- Messages were displayed but not spoken
- Transitions happened regardless of whether the user had time to read the message

### After
- Messages are spoken using the Web Speech API
- Phase transitions occur when the voice finishes speaking
- The `sequenceFeedback` function now accepts an `onComplete` callback
- A new `speakAndThen` helper function for simple voice-then-action patterns

## Modified Functions

### Core Functions
1. **`sequenceFeedback(first, second?, onComplete?)`**
   - Speaks first message
   - When first message finishes, speaks second message (if provided)
   - When all messages finish, calls onComplete callback

2. **`speakAndThen(message, onComplete?)`**
   - Speaks a single message
   - Calls onComplete when finished

### Updated Intro Sequences
- `handleIntroNameSubmit()` - Welcome sequence with user's name
- `handleIntroMachineResponse()` - Response to machine feedback
- `handleIntroFirstClick()` - First interaction with the machine
- `handleIntroDigitsSubmit()` - Digit counting challenge responses

## How to Test

### 1. Enable Audio
Make sure your browser allows audio playback and your speakers/headphones are working.

### 2. Test Intro Sequence
1. Start the application
2. Enter your name (or skip)
3. Listen for the welcome message to be spoken
4. Notice how the next phase starts after the voice finishes, not after a fixed delay

### 3. Test Machine Feedback
1. Provide feedback about the machine (choose any option)
2. Listen for the response to be spoken
3. Notice the smooth transition to the next phase after voice completion

### 4. Test First Clicks
1. Click the △ button
2. Listen for the feedback messages
3. Notice how each message is spoken before the next action

### 5. Test Digit Counting
1. Progress to the digit counting challenge
2. Enter an answer (try 10 for correct, 9 for a common mistake)
3. Listen for the multi-part feedback sequences
4. Notice how messages flow naturally with voice timing

## Browser Compatibility

The Web Speech API is supported in:
- Chrome/Edge (recommended)
- Safari
- Firefox (limited support)

If speech synthesis is not supported, the application will still function but without voice output.

## Configuration

### Voice Settings
The text-to-speech service uses these defaults:
- Language: French (fr-FR)
- Rate: 1.0 (normal speed)
- Pitch: 1.0 (normal pitch)
- Volume: 1.0 (full volume)

### Customization
To change voice settings, modify the `textToSpeechService` configuration in `store.ts`:

```typescript
textToSpeechService.setPersona({
  language: PersonaLanguage.Francais
});

textToSpeechService.setVoiceConfig({
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0
});
```

## Known Limitations

1. **Browser Limitations**: Some browsers may require user interaction before allowing speech synthesis
2. **Voice Quality**: Voice quality depends on the browser and operating system TTS engine
3. **Language Support**: Only French is currently configured, but the system supports other languages
4. **Animation Sequences**: Some visual animations still use setTimeout for timing (this is intentional for visual pacing)

## Future Improvements

Potential enhancements:
- Add voice controls (pause, resume, stop)
- Allow users to choose voice settings
- Add visual indicators when speaking
- Support for multiple languages
- Voice recognition for user responses

## Technical Details

### File Structure
```
src/
├── voice/
│   ├── services/speech/
│   │   ├── text-to-speech.ts       # TTS service
│   │   ├── speech-to-text.ts       # STT service (for future use)
│   │   └── persona.types.ts        # Voice configuration types
│   ├── hooks/
│   │   ├── use-text-to-speech.ts   # React hook for TTS
│   │   └── use-speech-to-text.ts   # React hook for STT
│   └── utils/
│       └── voice-helper.ts         # Utility functions
└── store.ts                        # Main state with voice integration
```

### Key Changes in store.ts
- Added import: `import { textToSpeechService } from './voice/services/speech/text-to-speech.ts';`
- Modified `sequenceFeedback` to use TTS callbacks
- Added `speakAndThen` helper function
- Replaced setTimeout chains with voice completion callbacks in intro sequences

## Troubleshooting

### Voice Not Working
1. Check browser console for errors
2. Verify browser supports Web Speech API
3. Check audio output settings
4. Try in a different browser (Chrome recommended)

### Voice Too Fast/Slow
Adjust the rate in voice configuration (0.1 to 10, default is 1.0)

### Wrong Language
Verify the PersonaLanguage setting is correct for your content

### Transitions Too Quick
This might indicate the voice is not playing. Check browser compatibility and console errors.
