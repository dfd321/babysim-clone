import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console methods to avoid noise in tests  
const consoleMock = {
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

Object.defineProperty(console, 'warn', { value: consoleMock.warn });
Object.defineProperty(console, 'error', { value: consoleMock.error });
Object.defineProperty(console, 'log', { value: consoleMock.log });

// Mock ResizeObserver for components that use it
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  consoleMock.warn.mockClear();
  consoleMock.error.mockClear();
  consoleMock.log.mockClear();
});

// Mock random for consistent test results
global.Math.random = jest.fn(() => 0.5);