import  { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Report to monitoring services
    console.error('Monitoring service disabled for build');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4' role="alert">
          <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border-l-4 border-red-500'>
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Application Error
            </h2>
            
            <p className='text-gray-600 mb-4 leading-relaxed'>
              An unexpected error occurred while running the application. This may be due to a network issue or temporary problem.
            </p>
            
            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left bg-gray-100 rounded p-3">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-red-600 overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors focus:ring-4 focus:ring-gray-200'
                aria-label="Try to recover from error"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-200'
                aria-label="Refresh the entire page"
              >
                Refresh Page
              </button>
            </div>
            
            {/* Contact Support */}
            <p className="mt-4 text-sm text-gray-500">
              If this problem persists, please{' '}
              <a 
                href="mailto:dfdaniels@gmail.com" 
                className="text-blue-600 hover:text-blue-800 underline focus:ring-2 focus:ring-blue-200 rounded"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
