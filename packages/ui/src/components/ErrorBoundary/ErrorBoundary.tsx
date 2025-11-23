/**
 * Enhanced Error Boundary Component
 * Senior Frontend Developer - Component Specialist
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showRetry?: boolean;
  showHome?: boolean;
  customMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Log to error reporting service (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <motion.div
          className="portfolio-error-boundary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="portfolio-error-boundary-content">
            <motion.div
              className="portfolio-error-boundary-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <AlertCircle size={64} />
            </motion.div>

            <motion.h1
              className="portfolio-error-boundary-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Oops! Something went wrong
            </motion.h1>

            <motion.p
              className="portfolio-error-boundary-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {this.props.customMessage || 
                "We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue."}
            </motion.p>

            {/* Error details in development */}
            {typeof window !== 'undefined' && (window as any).__DEV__ && this.state.error && (
              <motion.details
                className="portfolio-error-boundary-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <summary>Error Details</summary>
                <pre className="portfolio-error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </motion.details>
            )}

            {/* Action buttons */}
            <motion.div
              className="portfolio-error-boundary-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {this.props.showRetry !== false && (
                <button
                  className="portfolio-error-boundary-button portfolio-error-boundary-button--primary"
                  onClick={this.handleRetry}
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              )}

              {this.props.showHome !== false && (
                <button
                  className="portfolio-error-boundary-button portfolio-error-boundary-button--secondary"
                  onClick={this.handleGoHome}
                >
                  <Home size={16} />
                  Go Home
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error Fallback Component
 */
export interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  message?: string;
  showRetry?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  message,
  showRetry = true,
}) => {
  return (
    <div className="portfolio-error-fallback">
      <AlertCircle size={48} />
      <h3>Something went wrong</h3>
      <p>{message || error?.message || 'An unexpected error occurred'}</p>
      {showRetry && resetError && (
        <button onClick={resetError}>Try again</button>
      )}
    </div>
  );
};

/**
 * useErrorHandler Hook
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const throwError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  return {
    error,
    resetError,
    throwError,
  };
};

/**
 * Async Error Boundary for handling async errors
 */
export interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  const { error, resetError } = useErrorHandler();

  if (error) {
    return fallback || <ErrorFallback error={error} resetError={resetError} />;
  }

  return <>{children}</>;
};
