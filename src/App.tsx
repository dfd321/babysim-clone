import { BabySimulator } from './components/BabySimulator'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <BabySimulator />
      </div>
    </ErrorBoundary>
  )
}

export default App
