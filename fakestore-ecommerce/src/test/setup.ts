import '@testing-library/jest-dom'

// Mock ResizeObserver for tests
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
});

// Mock confirm for tests
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: () => true
});