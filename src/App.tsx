
import MachineANombres from "./MachineANombres";
import { PhaseStatusDebug } from "./components/PhaseStatusDebug";

// The initial phase is set in the store
// No need to set it here, the store will handle the loading phase

function App() {
  // Show debug panel in development mode
  const showDebug = import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug');

  return (
    <>
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        background: '#f0f0f0',
        borderBottom: '2px solid #ddd'
      }}>
        <MachineANombres />
      </div>
      {showDebug && <PhaseStatusDebug />}
    </>
  );
}

export default App;
