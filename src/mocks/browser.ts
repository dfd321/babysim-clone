// Mock service worker for development (optional)
// This file sets up MSW (Mock Service Worker) for intercepting API calls in development

// Only import MSW if it's available (it's not in our dependencies)
try {
  const msw = await import('msw/browser');
  const { handlers } = await import('./handlers');
  
  export const worker = msw.setupWorker(...handlers);
} catch (error) {
  // MSW not available, export dummy worker
  export const worker = {
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
  };
}
