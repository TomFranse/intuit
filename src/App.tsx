import { ToneProvider } from './contexts/ToneContext';
import ToneCreator from './pages/ToneCreator/ToneCreator';
import './App.css';

function App() {
  return (
    <ToneProvider>
      <div className="min-h-screen bg-gray-100">
        <ToneCreator />
      </div>
    </ToneProvider>
  );
}

export default App;
