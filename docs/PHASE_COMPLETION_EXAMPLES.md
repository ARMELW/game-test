# Example: Using Phase Completion Tracking

This example demonstrates how to use the phase completion tracking system in the game.

## Basic Usage

```typescript
import { useStore } from './store';

function GameComponent() {
  const {
    phase,
    getPhaseStatus,
    markPhaseComplete,
    isPhaseComplete,
    setAutoTransitionEnabled,
    autoTransitionEnabled
  } = useStore();

  // Get current phase status
  const currentStatus = getPhaseStatus(phase);
  console.log('Current phase:', phase);
  console.log('Status:', currentStatus.status);

  // Handle phase completion
  const handleComplete = () => {
    markPhaseComplete(phase);
    console.log(`Phase ${phase} marked as complete!`);
  };

  return (
    <div>
      <h2>Current Phase: {phase}</h2>
      <p>Status: {currentStatus.status}</p>
      
      <button 
        onClick={handleComplete}
        disabled={isPhaseComplete(phase)}
      >
        {isPhaseComplete(phase) ? 'Already Completed' : 'Mark Complete'}
      </button>

      <label>
        <input
          type="checkbox"
          checked={autoTransitionEnabled}
          onChange={(e) => setAutoTransitionEnabled(e.target.checked)}
        />
        Enable Auto-Transition
      </label>
    </div>
  );
}
```

## Progress Tracker Example

```typescript
import { useStore } from './store';

function ProgressTracker() {
  const phaseStatusMap = useStore((state) => state.phaseStatusMap);

  const phases = Object.entries(phaseStatusMap);
  const completed = phases.filter(([_, status]) => status === 'completed').length;
  const total = phases.length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="progress-tracker">
      <h3>Game Progress</h3>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        >
          {percentage}%
        </div>
      </div>
      <p>{completed} / {total} phases completed</p>
    </div>
  );
}
```

## Phase List Example

```typescript
import { useStore } from './store';
import { ALL_PHASES } from './types';

function PhaseList() {
  const { phaseStatusMap, phase: currentPhase, setPhase } = useStore();

  return (
    <div className="phase-list">
      <h3>All Phases</h3>
      {ALL_PHASES.map((phase) => {
        const status = phaseStatusMap[phase];
        const isCurrent = phase === currentPhase;
        
        return (
          <div 
            key={phase} 
            className={`phase-item ${status} ${isCurrent ? 'current' : ''}`}
            onClick={() => setPhase(phase)}
          >
            <span className="phase-name">{phase}</span>
            <span className="phase-status">
              {status === 'completed' && '✓'}
              {status === 'in-progress' && '→'}
              {status === 'not-started' && '○'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

## Challenge Completion Example

```typescript
import { useStore } from './store';

function ChallengeComponent() {
  const {
    phase,
    columns,
    markPhaseComplete,
    handleValidateLearning
  } = useStore();

  const checkAnswer = () => {
    const totalNumber = columns.reduce(
      (acc, col, idx) => acc + col.value * Math.pow(10, idx), 
      0
    );

    if (totalNumber === targetNumber) {
      // Correct answer!
      handleValidateLearning();
      
      // Mark this challenge phase as complete
      markPhaseComplete(phase);
      
      console.log(`Challenge ${phase} completed!`);
    } else {
      console.log('Try again!');
    }
  };

  return (
    <button onClick={checkAnswer}>
      Validate Answer
    </button>
  );
}
```

## Auto-Transition Control Example

```typescript
import { useStore } from './store';

function GameSettings() {
  const { autoTransitionEnabled, setAutoTransitionEnabled } = useStore();

  return (
    <div className="settings">
      <h3>Game Settings</h3>
      
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={autoTransitionEnabled}
            onChange={(e) => setAutoTransitionEnabled(e.target.checked)}
          />
          <span>Automatic Phase Transitions</span>
        </label>
        <p className="help-text">
          {autoTransitionEnabled 
            ? 'Phases will automatically advance when completed'
            : 'You must manually navigate between phases'}
        </p>
      </div>
    </div>
  );
}
```

## Conditional Feature Unlock Example

```typescript
import { useStore } from './store';

function AdvancedFeature() {
  const isPhaseComplete = useStore((state) => state.isPhaseComplete);

  // Check if required phases are completed
  const isUnlocked = 
    isPhaseComplete('challenge-unit-3') && 
    isPhaseComplete('learn-carry') &&
    isPhaseComplete('challenge-tens-1');

  if (!isUnlocked) {
    return (
      <div className="locked-feature">
        <p>🔒 Complete the following to unlock:</p>
        <ul>
          <li>{isPhaseComplete('challenge-unit-3') ? '✓' : '○'} Unit Challenge 3</li>
          <li>{isPhaseComplete('learn-carry') ? '✓' : '○'} Learn Carry</li>
          <li>{isPhaseComplete('challenge-tens-1') ? '✓' : '○'} Tens Challenge 1</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="unlocked-feature">
      <h3>🎉 Advanced Feature Unlocked!</h3>
      {/* Your advanced feature content */}
    </div>
  );
}
```

## Debugging with Console Logs

The system automatically logs phase transitions:

```
[setPhase] Transitioning from "tutorial" to "explore-units"
[markPhaseComplete] Marking phase "tutorial" as completed
[markPhaseComplete] Auto-transition enabled, checking for next phase
[checkAndTransitionToNextPhase] Auto-transitioning from "explore-units" to "click-add"
```

You can monitor these logs in the browser console to understand the phase flow.

## Using the Debug Panel

In development mode or with `?debug` parameter:

1. The debug panel appears in the bottom-right corner
2. Shows current phase and status
3. Toggle auto-transition on/off
4. Navigate between phases with Previous/Next buttons
5. Manually mark phases as complete
6. View statistics and lists of completed/in-progress phases

This is useful for:
- Testing phase transitions
- Debugging phase completion logic
- Jumping to specific phases during development
- Verifying auto-transition behavior
