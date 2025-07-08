import { BabySimulator } from './components/BabySimulator';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BabySimulator />
    </ErrorBoundary>
  );
}

export default App;