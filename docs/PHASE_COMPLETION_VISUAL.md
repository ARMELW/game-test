# Phase Completion Tracking - Visual Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Game Application                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐        ┌──────────────────┐                │
│  │  React UI      │◄──────►│  Zustand Store   │                │
│  │  Components    │        │                  │                │
│  └────────────────┘        │  Phase Tracking  │                │
│         │                  │     System       │                │
│         │                  └────────┬─────────┘                │
│         │                           │                           │
│         ▼                           ▼                           │
│  ┌────────────────────────────────────────────┐                │
│  │         Phase Status Functions             │                │
│  ├────────────────────────────────────────────┤                │
│  │  • getPhaseStatus()                        │                │
│  │  • markPhaseComplete()                     │                │
│  │  • isPhaseComplete()                       │                │
│  │  • setAutoTransitionEnabled()              │                │
│  │  • checkAndTransitionToNextPhase()         │                │
│  └────────────────────────────────────────────┘                │
│                           │                                     │
│                           ▼                                     │
│  ┌────────────────────────────────────────────┐                │
│  │         PhaseStatusMap                     │                │
│  ├────────────────────────────────────────────┤                │
│  │  'loading': 'completed'                    │                │
│  │  'intro-welcome': 'completed'              │                │
│  │  'tutorial': 'in-progress'         ◄─────  │  Current Phase │
│  │  'explore-units': 'not-started'            │                │
│  │  ...                                       │                │
│  └────────────────────────────────────────────┘                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Phase Status Lifecycle

```
┌──────────────┐       Enter Phase        ┌──────────────┐
│              │   ─────────────────────►  │              │
│ Not-Started  │                           │ In-Progress  │
│              │                           │              │
└──────────────┘                           └──────┬───────┘
                                                  │
                                                  │ Exit Phase /
                                                  │ markPhaseComplete()
                                                  │
                                                  ▼
                                           ┌──────────────┐
                                           │              │
                                           │  Completed   │
                                           │              │
                                           └──────────────┘
```

## Automatic Transition Flow

```
┌────────────────────────────────────────────────────────────────┐
│                     Phase Completion                            │
│                                                                 │
│  User completes phase objective (e.g., solves challenge)       │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│               markPhaseComplete(currentPhase)                   │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│              Update phaseStatusMap                              │
│              currentPhase → 'completed'                         │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│         Is autoTransitionEnabled = true?                        │
└────────────┬───────────────────────────────────┬───────────────┘
             │ NO                                 │ YES
             │                                    │
             ▼                                    ▼
    ┌────────────────┐              ┌─────────────────────────────┐
    │  Stay on       │              │  checkAndTransitionToNextPhase() │
    │  current phase │              └──────────┬──────────────────┘
    └────────────────┘                         │
                                               ▼
                                     ┌────────────────────────────┐
                                     │ Is phase in manual list?   │
                                     └───────┬──────────────┬─────┘
                                             │ NO           │ YES
                                             │              │
                                             ▼              ▼
                                   ┌──────────────┐  ┌──────────┐
                                   │ goToNextPhase│  │   Stay   │
                                   │     ()       │  │          │
                                   └──────────────┘  └──────────┘
```

## Debug Panel Interface

```
┌────────────────────────────────────────────┐
│         Phase Status Debug                 │
├────────────────────────────────────────────┤
│                                            │
│  Current Phase: tutorial                   │
│  Status: in-progress                       │
│                                            │
│  ☑ Enable Auto-Transition                 │
│                                            │
│  [← Previous]  [Next →]                    │
│                                            │
│  [Mark Current Phase Complete]             │
│                                            │
│  ┌──────────────┬──────────────┐          │
│  │  Completed   │  In Progress │          │
│  │     15       │      1       │          │
│  └──────────────┴──────────────┘          │
│                                            │
│  ▶ Completed Phases (15)                   │
│  ▶ In Progress Phases (1)                  │
│                                            │
└────────────────────────────────────────────┘
```

## Code Integration Example

```typescript
// In your game component
import { useStore } from './store';

function GamePhase() {
  const {
    phase,
    getPhaseStatus,
    markPhaseComplete,
    setAutoTransitionEnabled
  } = useStore();

  // Enable auto-transitions for tutorial
  useEffect(() => {
    if (phase.startsWith('tutorial')) {
      setAutoTransitionEnabled(true);
    }
  }, [phase]);

  // When challenge is solved
  const handleSuccess = () => {
    // Mark phase as complete
    // If auto-transition is enabled, 
    // automatically moves to next phase
    markPhaseComplete(phase);
  };

  return (
    <div>
      <h2>{phase}</h2>
      <button onClick={handleSuccess}>
        Complete Challenge
      </button>
    </div>
  );
}
```

## Status Queries

```typescript
// Check single phase
const tutorialStatus = getPhaseStatus('tutorial');
// Returns: { phase: 'tutorial', status: 'completed' }

// Check if complete (boolean)
const isDone = isPhaseComplete('tutorial');
// Returns: true

// Get all completed phases
const phaseStatusMap = useStore(state => state.phaseStatusMap);
const completedPhases = Object.entries(phaseStatusMap)
  .filter(([_, status]) => status === 'completed')
  .map(([phase, _]) => phase);
// Returns: ['loading', 'intro-welcome', 'tutorial', ...]

// Calculate progress percentage
const total = Object.keys(phaseStatusMap).length;
const completed = completedPhases.length;
const progress = Math.round((completed / total) * 100);
// Returns: 21 (means 21% complete)
```

## Manual vs Automatic Transitions

### Automatic Transition Phases
These phases will auto-advance when completed (if enabled):
- Tutorial phases
- Learning phases (learn-units, learn-tens, etc.)
- Most challenge phases
- Exploration phases

### Manual Transition Phases
These phases require explicit user action:
- `normal` - Free play mode
- `done` - Game completion
- `celebration-before-thousands` - User must click "Continue"
- `celebration-thousands-complete` - Final celebration
- `intro-discover-machine` - User must choose response
- `intro-count-digits` - User must enter answer
- `intro-max-value-question` - User must enter answer

## State Updates Timeline

```
Time  Action                           Phase Status
────  ─────────────────────────────   ─────────────────────
t0    App loads                        loading: in-progress
t1    TTS ready, transition to intro   loading: completed
                                       intro-welcome: in-progress
t2    Intro complete, go to tutorial   intro-welcome: completed
                                       tutorial: in-progress
t3    User completes tutorial          tutorial: completed (auto-transition enabled)
t4    Auto-transition triggered        explore-units: in-progress
...
```

## Benefits at a Glance

✅ **Track Progress**: Know exactly which phases are done
✅ **Auto-Advance**: Optionally move to next phase automatically
✅ **Flexible**: Can enable/disable auto-transition anytime
✅ **Non-Breaking**: Works alongside existing code
✅ **Debuggable**: Visual UI + console logs
✅ **Type-Safe**: Full TypeScript support
✅ **Well-Documented**: Complete guides in French

## Quick Reference

| Function | Purpose | Example |
|----------|---------|---------|
| `getPhaseStatus(phase)` | Get phase info | `getPhaseStatus('tutorial')` |
| `markPhaseComplete(phase)` | Mark done | `markPhaseComplete('tutorial')` |
| `isPhaseComplete(phase)` | Check if done | `isPhaseComplete('tutorial')` |
| `setAutoTransitionEnabled(bool)` | Toggle auto | `setAutoTransitionEnabled(true)` |
| `checkAndTransitionToNextPhase()` | Manual check | Called automatically |

## File Structure

```
game-test/
├── src/
│   ├── types.ts                        ← New types added
│   ├── store.ts                        ← Tracking implementation
│   ├── App.tsx                         ← Debug component integrated
│   └── components/
│       └── PhaseStatusDebug.tsx        ← NEW: Debug UI
├── docs/
│   ├── PHASE_COMPLETION_TRACKING.md    ← NEW: Full API docs
│   ├── PHASE_COMPLETION_EXAMPLES.md    ← NEW: Code examples
│   └── PHASE_COMPLETION_VISUAL.md      ← NEW: This file
└── README.md                           ← Updated with reference
```

---

**Ready to use!** 🚀

See the full documentation in:
- [API Reference](PHASE_COMPLETION_TRACKING.md)
- [Code Examples](PHASE_COMPLETION_EXAMPLES.md)
