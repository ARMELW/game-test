import { useStore } from '../store';

/**
 * Debug component to display and control phase completion status
 * This component helps visualize and test the phase completion tracking system
 */
export function PhaseStatusDebug() {
  const phase = useStore((state) => state.phase);
  const phaseStatusMap = useStore((state) => state.phaseStatusMap);
  const autoTransitionEnabled = useStore((state) => state.autoTransitionEnabled);
  const setAutoTransitionEnabled = useStore((state) => state.setAutoTransitionEnabled);
  const getPhaseStatus = useStore((state) => state.getPhaseStatus);
  const markPhaseComplete = useStore((state) => state.markPhaseComplete);
  const isPhaseComplete = useStore((state) => state.isPhaseComplete);
  const goToNextPhase = useStore((state) => state.goToNextPhase);
  const goToPreviousPhase = useStore((state) => state.goToPreviousPhase);

  const currentPhaseStatus = getPhaseStatus(phase);
  const completedPhases = Object.entries(phaseStatusMap).filter(
    ([_, status]) => status === 'completed'
  );
  const inProgressPhases = Object.entries(phaseStatusMap).filter(
    ([_, status]) => status === 'in-progress'
  );

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-md max-h-96 overflow-auto border-2 border-gray-300">
      <h3 className="font-bold text-lg mb-2">Phase Status Debug</h3>
      
      {/* Current Phase Info */}
      <div className="mb-4 p-2 bg-blue-50 rounded">
        <div className="font-semibold">Current Phase:</div>
        <div className="text-sm">{phase}</div>
        <div className="text-xs text-gray-600">
          Status: <span className="font-medium">{currentPhaseStatus.status}</span>
        </div>
      </div>

      {/* Auto-transition Control */}
      <div className="mb-4 p-2 bg-gray-50 rounded">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoTransitionEnabled}
            onChange={(e) => setAutoTransitionEnabled(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
          <span className="text-sm font-medium">Enable Auto-Transition</span>
        </label>
        <p className="text-xs text-gray-600 mt-1">
          When enabled, completed phases automatically transition to the next phase
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={goToPreviousPhase}
          className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          ← Previous
        </button>
        <button
          onClick={goToNextPhase}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Next →
        </button>
      </div>

      {/* Manual Complete Button */}
      <div className="mb-4">
        <button
          onClick={() => markPhaseComplete(phase)}
          disabled={isPhaseComplete(phase)}
          className={`w-full px-3 py-2 rounded text-sm ${
            isPhaseComplete(phase)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isPhaseComplete(phase) ? '✓ Already Completed' : 'Mark Current Phase Complete'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 bg-green-50 rounded text-center">
          <div className="text-2xl font-bold text-green-600">{completedPhases.length}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="p-2 bg-yellow-50 rounded text-center">
          <div className="text-2xl font-bold text-yellow-600">{inProgressPhases.length}</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
      </div>

      {/* Phase Lists */}
      <details className="mb-2">
        <summary className="cursor-pointer text-sm font-medium text-green-700 hover:text-green-800">
          Completed Phases ({completedPhases.length})
        </summary>
        <ul className="mt-2 text-xs space-y-1 max-h-32 overflow-auto">
          {completedPhases.map(([phaseName]) => (
            <li key={phaseName} className="text-gray-600 pl-2">
              ✓ {phaseName}
            </li>
          ))}
        </ul>
      </details>

      <details>
        <summary className="cursor-pointer text-sm font-medium text-yellow-700 hover:text-yellow-800">
          In Progress Phases ({inProgressPhases.length})
        </summary>
        <ul className="mt-2 text-xs space-y-1 max-h-32 overflow-auto">
          {inProgressPhases.map(([phaseName]) => (
            <li key={phaseName} className="text-gray-600 pl-2">
              → {phaseName}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <p>Use this panel to test phase completion tracking and automatic transitions.</p>
      </div>
    </div>
  );
}
