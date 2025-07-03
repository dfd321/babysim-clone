// Mock service worker for development (optional)
// This file sets up MSW (Mock Service Worker) for intercepting API calls in development

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Start the worker only in development
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}