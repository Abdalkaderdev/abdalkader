'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ErrorBoundary Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI to display when an error occurs */
  fallback?: ReactNode;
  /** Callback function when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether to show the retry button */
  showRetry?: boolean;
  /** Whether to show the home button */
  showHome?: boolean;
  /** Custom error message to display */
  customMessage?: string;
  /** Component name for better error identification */
  componentName?: string;
  /** Custom retry handler */
  onRetry?: () => void;
}

/**
 * ErrorBoundary State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
}

/**
 * Reusable Error Boundary Component for the History Museum App
 *
 * Features:
 * - Catches errors in child components (including D3 visualizations)
 * - Shows a friendly, themed error message
 * - Provides retry functionality
 * - Logs errors for debugging
 * - Supports custom fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    this.logError(error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Log error details for debugging
   */
  private logError(error: Error, errorInfo: ErrorInfo) {
    const componentName = this.props.componentName || 'Unknown Component';
    const timestamp = new Date().toISOString();

    console.group(`[ErrorBoundary] Error in ${componentName}`);
    console.error('Timestamp:', timestamp);
    console.error('Error:', error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // In production, you could send this to an error tracking service
    if (typeof window !== 'undefined') {
      // Store error in session storage for debugging
      try {
        const errorLog = {
          componentName,
          timestamp,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        };
        const existingLogs = JSON.parse(sessionStorage.getItem('errorLogs') || '[]');
        existingLogs.push(errorLog);
        // Keep only the last 10 errors
        if (existingLogs.length > 10) {
          existingLogs.shift();
        }
        sessionStorage.setItem('errorLogs', JSON.stringify(existingLogs));
      } catch {
        // Silent fail if storage is not available
      }
    }
  }

  /**
   * Handle retry button click
   */
  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false,
        retryCount: prevState.retryCount + 1,
      }));

      // Call custom retry handler if provided
      this.props.onRetry?.();
    }
  };

  /**
   * Handle go home button click
   */
  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  /**
   * Toggle error details visibility
   */
  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  /**
   * Check if this is a D3/visualization related error
   */
  private isVisualizationError(): boolean {
    const errorMessage = this.state.error?.message?.toLowerCase() || '';
    const errorStack = this.state.error?.stack?.toLowerCase() || '';

    return (
      errorMessage.includes('d3') ||
      errorMessage.includes('svg') ||
      errorMessage.includes('canvas') ||
      errorMessage.includes('visualization') ||
      errorStack.includes('d3') ||
      errorStack.includes('visualization')
    );
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isVisualizationError = this.isVisualizationError();
      const canRetry = this.state.retryCount < this.maxRetries;
      const componentName = this.props.componentName || 'this section';

      // Default error UI
      return (
        <motion.div
          className="relative w-full min-h-[400px] flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-red-500/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center max-w-lg">
            {/* Error Icon */}
            <motion.div
              className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              {isVisualizationError ? (
                <Bug className="w-10 h-10 text-red-400" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-red-400" />
              )}
            </motion.div>

            {/* Error Title */}
            <motion.h2
              className="text-2xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isVisualizationError
                ? 'Visualization Error'
                : 'Something went wrong'}
            </motion.h2>

            {/* Error Message */}
            <motion.p
              className="text-gray-300 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {this.props.customMessage || (
                isVisualizationError
                  ? `We encountered an issue loading ${componentName}. This might be due to your browser or device compatibility. Please try again or use a different browser.`
                  : `We're sorry, but ${componentName} couldn't be loaded. Our team has been notified.`
              )}
            </motion.p>

            {/* Retry Count Info */}
            {this.state.retryCount > 0 && (
              <motion.p
                className="text-sm text-gray-500 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Retry attempt {this.state.retryCount} of {this.maxRetries}
              </motion.p>
            )}

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {this.props.showRetry !== false && canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}

              {this.props.showHome !== false && (
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              )}
            </motion.div>

            {/* Error Details (Expandable) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                className="text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors mx-auto"
                >
                  {this.state.showDetails ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Error Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Error Details
                    </>
                  )}
                </button>

                {this.state.showDetails && (
                  <motion.div
                    className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 overflow-auto max-h-60"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <p className="text-sm font-mono text-red-400 mb-2">
                      {this.state.error.message}
                    </p>
                    <pre className="text-xs font-mono text-gray-400 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="text-xs font-mono text-gray-500 mt-4 whitespace-pre-wrap">
                        Component Stack:
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

/**
 * Visualization Error Fallback Component
 * A simpler fallback specifically for D3 visualization components
 */
interface VisualizationErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
  componentName?: string;
}

export const VisualizationErrorFallback: React.FC<VisualizationErrorFallbackProps> = ({
  message,
  onRetry,
  componentName = 'Visualization',
}) => {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-orange-500/30">
      <div className="text-center">
        <Bug className="w-12 h-12 text-orange-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          {componentName} Unavailable
        </h3>
        <p className="text-gray-400 mb-4 max-w-md">
          {message || 'The visualization could not be loaded. This might be a temporary issue.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
