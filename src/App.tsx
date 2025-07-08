import { BabySimulator } from './components/BabySimulator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TranslationProvider } from './contexts/TranslationContext';

function App() {
  return (
    <TranslationProvider>
      <ErrorBoundary>
        <BabySimulator />
      </ErrorBoundary>
    </TranslationProvider>
  );
}

export default App;