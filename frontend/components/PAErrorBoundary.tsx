import { Component, ReactNode } from 'react';
import { BiError } from 'react-icons/bi';

import { PAButton } from './controls/PAButton';
import { PACard } from './controls/PACard';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the entire application.
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
export class PAErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[var(--rs-body)] flex items-center justify-center p-4">
          <PACard className="max-w-md w-full p-6 text-center">
            <div className="flex justify-center mb-4">
              <BiError size={64} className="text-[var(--rs-text-error)]" />
            </div>

            <h1 className="text-xl font-semibold text-[var(--rs-text-primary)] mb-2">
              Something went wrong
            </h1>

            <p className="text-[var(--rs-text-secondary)] mb-4">
              An unexpected error occurred. Please try reloading the page.
            </p>

            {this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm text-[var(--rs-text-secondary)] hover:text-[var(--rs-text-primary)]">
                  Error details
                </summary>
                <pre className="mt-2 p-3 bg-[var(--rs-bg-active)] rounded text-xs text-[var(--rs-text-error)] overflow-auto max-h-32">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      {'\n\n'}
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <PAButton
                onClick={this.handleReset}
                fullWidth
              >
                Try Again
              </PAButton>
              <PAButton
                onClick={this.handleReload}
                appearance="primary"
                fullWidth
              >
                Reload Page
              </PAButton>
            </div>
          </PACard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PAErrorBoundary;
