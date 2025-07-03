import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Only start MSW in development if available
if (import.meta.env?.DEV) {
  try {
    const { worker } = await import('./mocks/browser')
    worker.start()
  } catch (error) {
    console.warn('MSW not available, continuing without mocking')
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
