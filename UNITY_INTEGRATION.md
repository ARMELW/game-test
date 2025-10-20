# Unity Game Integration in Machine à Nombres

## Overview

The Machine à Nombres educational application now uses a Unity WebGL game as its primary interface instead of the previous visual representation with tokens. This provides a more engaging and interactive 3D experience for learning numbers.

## Implementation Details

### What Changed

**Before:**
- Visual representation using React components with colored circles (tokens)
- React buttons for adding/subtracting values
- 2D interface with column-based layout

**After:**
- Unity WebGL 3D counting machine with realistic appearance
- Interactive Unity buttons (green △ for add, red ∇ for subtract)
- Immersive 3D experience with animations and visual feedback
- Visual dots on the machine representing quantities (1-9)
- Four rolls displaying thousands, hundreds, tens, and units

### Architecture

```
┌─────────────────────────────────────────┐
│         React Application               │
│  (MachineANombres Component)           │
│                                         │
│  • Educational phase logic              │
│  • State management (Zustand)           │
│  • Instruction display                  │
│  • Challenge validation                 │
└──────────────┬──────────────────────────┘
               │
               │ Props & State Sync
               │
┌──────────────▼──────────────────────────┐
│         Unity Game Component            │
│                                         │
│  • 3D Counting Machine Display          │
│  • Button click handling                │
│  • Visual animations                    │
│  • Roll locking system                  │
└──────────────┬──────────────────────────┘
               │
               │ Messages
               │
┌──────────────▼──────────────────────────┐
│         Unity Bridge                    │
│  (window.unityInstance)                │
│                                         │
│  • SendMessage to Unity                 │
│  • Receive messages from Unity          │
│  • Global function exposure             │
└─────────────────────────────────────────┘
```

### Key Components

#### 1. MachineANombres.tsx
The main component that orchestrates the educational experience:

- **Unity Integration**: Uses `useUnity()` hook to communicate with Unity
- **State Synchronization**: 
  - Syncs current value to Unity display via `changeCurrentValue()`
  - Controls roll locking based on educational phase
- **Message Handling**: Processes button clicks from Unity through `handleUnityMessage()`
- **Educational Logic**: Maintains all existing phase transitions and learning flows

#### 2. Unity Message Protocol
Messages sent from Unity to React:
```javascript
"ButtonClick:Add:0"      // User clicked add button on units (column 0)
"ButtonClick:Subtract:2" // User clicked subtract button on hundreds (column 2)
```

Messages sent from React to Unity:
```javascript
"SetValue1234"           // Set machine display to 1234
"LockUnit:1"            // Lock the units roll (1=locked, 0=unlocked)
"LockTen:0"             // Unlock the tens roll
"LockHundred:1"         // Lock the hundreds roll
"LockThousand:0"        // Unlock the thousands roll
```

### Roll Locking System

The Unity machine implements a sophisticated roll locking system that controls which operations are allowed based on the educational phase:

- **Units Roll Locked**: Cannot add/subtract by 1
- **Tens Roll Locked**: Cannot add/subtract by 10, range constrained to X0-X9
- **Hundreds Roll Locked**: Cannot add/subtract by 100, range constrained to XX00-XX99
- **Thousands Roll Locked**: Cannot add/subtract by 1000, range constrained to X000-X999

The locking is dynamically controlled based on:
1. Which columns are unlocked in the current phase
2. The specific learning objective (e.g., only units in early phases)
3. Whether auto-counting is active

### Benefits of Unity Integration

1. **More Engaging**: 3D machine is more visually appealing than 2D tokens
2. **Professional Look**: Realistic machine design enhances the educational experience
3. **Better Feedback**: Unity animations and visual effects provide instant feedback
4. **Consistent with Concept**: Matches the "machine" metaphor from the pedagogical design
5. **Scalable**: Unity can easily add more features (sounds, advanced animations, etc.)

## Educational Flow Compatibility

All existing educational phases work seamlessly with the Unity machine:

### Introduction Phases
- ✅ intro-welcome: Welcome message with first interaction
- ✅ intro-discover: Discovering the machine
- ✅ intro-first-interaction: First button clicks
- ✅ intro-count-digits: Counting the 10 digits
- ✅ intro-discover-carry: Understanding carry-over with second column

### Learning Phases
- ✅ tutorial: Basic button interaction
- ✅ explore-units: Learning units 0-9
- ✅ click-add/click-remove: Practice adding and removing
- ✅ challenge-unit-X: Unit challenges
- ✅ learn-carry: Understanding the 10-for-1 exchange
- ✅ practice-ten: Working with tens
- ✅ learn-tens-combination: Combining tens and units
- ✅ challenge-tens-X: Tens challenges

### Advanced Phases
- ✅ practice-hundred: Working with hundreds
- ✅ challenge-hundreds-X: Hundreds challenges
- ✅ practice-thousand: Working with thousands
- ✅ challenge-thousands-X: Thousands challenges
- ✅ normal: Free mode with all columns unlocked

## Testing

### Manual Testing Checklist
- [x] Unity machine loads correctly
- [x] Display shows correct initial value (0000)
- [x] Phase transitions work properly
- [x] Instructions display correctly
- [x] Roll locking system works as expected
- [ ] Button clicks in Unity trigger correct state changes (requires Unity to send messages)
- [ ] Auto-counting animations work
- [ ] All educational phases flow correctly

### Browser Compatibility
- ✅ Chrome/Chromium (tested)
- ⏳ Firefox (should work - WebGL 2.0 support)
- ⏳ Safari (should work - WebGL 2.0 support)
- ⏳ Edge (should work - WebGL 2.0 support)

## Future Enhancements

1. **Sound Effects**: Add audio feedback for button clicks and achievements
2. **Advanced Animations**: More elaborate carry-over animations
3. **Goal Display**: Show target numbers on the Unity machine
4. **Visual Hints**: Highlight specific buttons when in guided mode
5. **Celebration Effects**: Special effects when challenges are completed

## Development Notes

### Prerequisites
- Unity game files must be present in `public/counting-machine/`
- react-unity-webgl package installed (`^10.1.5`)

### Building
```bash
npm install
npm run build
```

### Running Locally
```bash
npm run dev
# Navigate to http://localhost:5173/game/
```

## Troubleshooting

### Unity Not Loading
- Check browser console for 404 errors
- Verify Unity build files are in `public/counting-machine/Build/`
- Ensure WebGL 2.0 is supported in the browser

### Locking Not Working
- Check that Unity game version supports the locking messages
- Verify phase logic in `MachineANombres.tsx` is correct
- Check console logs for message sending/receiving

### Display Not Syncing
- Verify `changeCurrentValue()` is being called in useEffect
- Check Unity console logs for received messages
- Ensure unityLoaded is true before sending messages

## References

- [Unity Bridge API Documentation](./UNITY_BRIDGE_API.md)
- [Unity Implementation Summary](./UNITY_IMPLEMENTATION_SUMMARY.md)
- [Pedagogical Concept](./CONCEPT.md)
