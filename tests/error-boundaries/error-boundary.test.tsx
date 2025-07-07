import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import { TranslationProvider } from '../../src/contexts/TranslationContext';

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

// Test component that throws errors
const ThrowError: React.FC<{ shouldThrow: boolean; errorType?: 'render' | 'effect' | 'async' }> = ({ 
  shouldThrow, 
  errorType = 'render' 
}) => {
  React.useEffect(() => {
    if (shouldThrow && errorType === 'effect') {
      throw new Error('Error in useEffect');
    }
  }, [shouldThrow, errorType]);

  if (shouldThrow && errorType === 'render') {
    throw new Error('Test error in render');
  }

  if (shouldThrow && errorType === 'async') {
    setTimeout(() => {
      throw new Error('Async error - this should not be caught by error boundary');
    }, 0);
  }

  return <div data-testid="working-component">Component is working</div>;
};

// Component that throws different types of errors
const ErrorTypeComponent: React.FC<{ errorType: string }> = ({ errorType }) => {
  switch (errorType) {
    case 'typeError':
      throw new TypeError('Cannot read property of null');
    case 'referenceError':
      throw new ReferenceError('Variable is not defined');
    case 'syntaxError':
      throw new SyntaxError('Unexpected token');
    case 'rangeError':
      throw new RangeError('Invalid array length');
    case 'customError':
      const error = new Error('Custom error message');
      error.name = 'CustomApplicationError';
      throw error;
    case 'networkError':
      const networkError = new Error('Network request failed');
      (networkError as any).code = 'NETWORK_ERROR';
      throw networkError;
    default:
      return <div>No error</div>;
  }
};

// Component that simulates component lifecycle errors
const LifecycleErrorComponent: React.FC<{ triggerError: boolean }> = ({ triggerError }) => {
  const [count, setCount] = React.useState(0);

  if (triggerError && count > 0) {
    throw new Error('Error triggered in render after state update');
  }

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)} data-testid="trigger-error">
        Trigger Error (count: {count})
      </button>
    </div>
  );
};

// Component that throws during event handling
const EventErrorComponent: React.FC = () => {
  const handleClick = () => {
    throw new Error('Error in event handler');
  };

  return (
    <button onClick={handleClick} data-testid="event-error-button">
      Click to trigger error
    </button>
  );
};

describe('Error Boundary Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console errors for error boundary tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Error Boundary Functionality', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('working-component')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should catch and display error UI when child component throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByTestId('working-component')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Application Error')).toBeInTheDocument();
      expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
    });

    it('should display error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Error Details')).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should hide error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Error Details')).not.toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Recovery Mechanisms', () => {
    it('should allow recovery with "Try Again" button', async () => {
      const user = userEvent.setup();
      
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error should be displayed
      expect(screen.getByRole('alert')).toBeInTheDocument();
      
      // Click "Try Again"
      const tryAgainButton = screen.getByLabelText(/try to recover/i);
      await user.click(tryAgainButton);

      // Rerender with non-throwing component
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('working-component')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should reload page when "Refresh Page" button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByLabelText(/refresh the entire page/i);
      await user.click(refreshButton);

      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe('Different Error Types', () => {
    const errorTypes = [
      'typeError',
      'referenceError', 
      'syntaxError',
      'rangeError',
      'customError',
      'networkError'
    ];

    errorTypes.forEach(errorType => {
      it(`should catch and handle ${errorType}`, () => {
        render(
          <ErrorBoundary>
            <ErrorTypeComponent errorType={errorType} />
          </ErrorBoundary>
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Application Error')).toBeInTheDocument();
      });
    });
  });

  describe('Component Lifecycle Errors', () => {
    it('should catch errors in component state updates', async () => {
      const user = userEvent.setup();
      
      render(
        <ErrorBoundary>
          <LifecycleErrorComponent triggerError={true} />
        </ErrorBoundary>
      );

      const triggerButton = screen.getByTestId('trigger-error');
      await user.click(triggerButton);

      // Error boundary should catch the error after state update
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should catch errors in useEffect', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorType="effect" />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Event Handler Errors', () => {
    it('should NOT catch errors in event handlers (by design)', async () => {
      const user = userEvent.setup();
      
      // Event handler errors are not caught by error boundaries
      render(
        <ErrorBoundary>
          <EventErrorComponent />
        </ErrorBoundary>
      );

      const eventButton = screen.getByTestId('event-error-button');
      
      // This should not trigger the error boundary
      await expect(async () => {
        await user.click(eventButton);
      }).rejects.toThrow('Error in event handler');

      // Error boundary should not be triggered
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Nested Error Boundaries', () => {
    it('should handle nested error boundaries correctly', () => {
      render(
        <ErrorBoundary>
          <div>
            <ErrorBoundary>
              <ThrowError shouldThrow={true} />
            </ErrorBoundary>
            <div data-testid="sibling-component">Sibling component</div>
          </div>
        </ErrorBoundary>
      );

      // Inner error boundary should catch the error
      expect(screen.getByRole('alert')).toBeInTheDocument();
      // Sibling component should still render
      expect(screen.getByTestId('sibling-component')).toBeInTheDocument();
    });
  });

  describe('Error Boundary with Context', () => {
    it('should work correctly within context providers', () => {
      render(
        <TranslationProvider>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </TranslationProvider>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Application Error')).toBeInTheDocument();
    });
  });

  describe('Error Logging and Monitoring', () => {
    it('should log errors to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error caught by boundary:',
        expect.any(Error),
        expect.any(Object)
      );
      
      consoleSpy.mockRestore();
    });

    it('should capture error stack trace', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorDetails = screen.getByText('Error Details');
      fireEvent.click(errorDetails);
      
      // Should show stack trace
      expect(screen.getByText(/Test error in render/)).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Accessibility in Error States', () => {
    it('should have proper ARIA attributes for error display', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveAttribute('role', 'alert');
    });

    it('should have focusable and accessible action buttons', async () => {
      const user = userEvent.setup();
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByLabelText(/try to recover/i);
      const refreshButton = screen.getByLabelText(/refresh the entire page/i);

      expect(tryAgainButton).toBeInTheDocument();
      expect(refreshButton).toBeInTheDocument();

      // Should be focusable
      tryAgainButton.focus();
      expect(tryAgainButton).toHaveFocus();

      await user.tab();
      expect(refreshButton).toHaveFocus();
    });

    it('should provide accessible contact support link', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const supportLink = screen.getByRole('link', { name: /contact support/i });
      expect(supportLink).toBeInTheDocument();
      expect(supportLink).toHaveAttribute('href', 'mailto:dfdaniels@gmail.com');
    });
  });

  describe('Error Boundary Performance', () => {
    it('should not re-render unnecessarily when no errors occur', () => {
      let renderCount = 0;
      
      const TestComponent = () => {
        renderCount++;
        return <div>Render count: {renderCount}</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(renderCount).toBe(1);

      // Rerender with same props
      rerender(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(renderCount).toBe(2); // Should only increment by 1
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors with null or undefined messages', () => {
      const NullErrorComponent = () => {
        const error = new Error();
        error.message = null as any;
        throw error;
      };

      render(
        <ErrorBoundary>
          <NullErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Application Error')).toBeInTheDocument();
    });

    it('should handle errors with extremely long stack traces', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const LongStackErrorComponent = () => {
        const error = new Error('Error with long stack');
        error.stack = 'a'.repeat(10000); // Very long stack trace
        throw error;
      };

      render(
        <ErrorBoundary>
          <LongStackErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle rapid successive errors', async () => {
      const user = userEvent.setup();
      
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Trigger multiple errors in quick succession
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Try to recover
      const tryAgainButton = screen.getByLabelText(/try to recover/i);
      await user.click(tryAgainButton);

      // Immediately trigger another error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Browser Compatibility', () => {
    it('should work when Error.prototype.stack is not available', () => {
      const originalStack = Error.prototype.stack;
      delete (Error.prototype as any).stack;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      
      // Restore stack property
      (Error.prototype as any).stack = originalStack;
    });

    it('should handle errors in older browsers without full Error object support', () => {
      const MinimalErrorComponent = () => {
        throw 'String error instead of Error object';
      };

      render(
        <ErrorBoundary>
          <MinimalErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});