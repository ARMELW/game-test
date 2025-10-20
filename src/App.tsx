
import { useStore } from "./store";
import MachineANombres from "./MachineANombres";

function App() {

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      background: '#f0f0f0',
      borderBottom: '2px solid #ddd'
    }}>
      <MachineANombres />
    </div>
  );
}

export default App;
