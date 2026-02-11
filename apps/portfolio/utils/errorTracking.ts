/**
 * Error Tracking System for Staging Environment
 * Captures and reports errors with detailed context
 */

import React from 'react';
import { getEnvironment } from '../src/utils/environment';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  buildId?: string;
  environment: string;
  additionalContext?: Record<string, any>;
}

interface ErrorBoundaryInfo {
  componentStack: string;
  errorBoundary?: string;
}

interface Breadcrumb {
  message: string;
  category: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

class ErrorTracker {
  private isEnabled: boolean;
  private endpoint: string;
  public sessionId: string;
  private buildId?: string;

  constructor() {
    this.isEnabled = process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true';
    this.endpoint = '/api/errors';
    this.sessionId = this.generateSessionId();
    this.buildId = process.env.NEXT_PUBLIC_BUILD_ID;
    
    if (this.isEnabled) {
      this.setupGlobalErrorHandlers();
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        type: 'javascript-error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        type: 'unhandled-promise-rejection',
        reason: event.reason,
      });
    });

    // Handle React errors (if available)
    if (typeof window !== 'undefined' && 'React' in window) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('React')) {
          this.captureError(new Error(args.join(' ')), {
            type: 'react-error',
            args: args,
          });
        }
        originalConsoleError.apply(console, args);
      };
    }
  }

  /**
   * Capture and report an error
   */
  captureError(error: Error, additionalContext?: Record<string, any>): void {
    if (!this.isEnabled) {
      console.error('[Error Tracker] Error captured (tracking disabled):', error);
      return;
    }

    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      buildId: this.buildId,
      environment: getEnvironment(),
      additionalContext,
    };

    console.error('[Error Tracker] Capturing error:', errorReport);
    this.sendErrorReport(errorReport);
  }

  /**
   * Capture React Error Boundary errors
   */
  captureErrorBoundary(error: Error, errorInfo: ErrorBoundaryInfo): void {
    this.captureError(error, {
      type: 'react-error-boundary',
      componentStack: errorInfo.componentStack,
      errorBoundary: errorInfo.errorBoundary,
    });
  }

  /**
   * Capture custom application errors
   */
  captureException(error: Error, context?: Record<string, any>): void {
    this.captureError(error, {
      type: 'application-error',
      ...context,
    });
  }

  /**
   * Log warning messages
   */
  captureWarning(message: string, context?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const warningReport: ErrorReport = {
      message: `[WARNING] ${message}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      buildId: this.buildId,
      environment: getEnvironment(),
      additionalContext: {
        type: 'warning',
        ...context,
      },
    };

    console.warn('[Error Tracker] Warning:', warningReport);
    this.sendErrorReport(warningReport);
  }

  /**
   * Send error report to endpoint
   */
  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (error) {
      console.error('[Error Tracker] Failed to send error report:', error);
    }
  }

  /**
   * Set user context for error reports
   */
  setUserContext(userId: string, additionalData?: Record<string, any>): void {
    // Store user context for future error reports
    if (typeof window !== 'undefined') {
      (window as any).__errorTrackerUserContext = {
        userId,
        ...additionalData,
      };
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, category?: string, data?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const breadcrumb = {
      message,
      category: category || 'general',
      timestamp: Date.now(),
      data,
    };

    // Store breadcrumbs in session storage for debugging
    if (typeof window !== 'undefined') {
      const breadcrumbs = JSON.parse(sessionStorage.getItem('error-tracker-breadcrumbs') || '[]');
      breadcrumbs.push(breadcrumb);
      
      // Keep only last 50 breadcrumbs
      if (breadcrumbs.length > 50) {
        breadcrumbs.shift();
      }
      
      sessionStorage.setItem('error-tracker-breadcrumbs', JSON.stringify(breadcrumbs));
    }
  }

  /**
   * Get current session breadcrumbs
   */
  getBreadcrumbs(): Breadcrumb[] {
    if (typeof window === 'undefined') return [];

    return JSON.parse(sessionStorage.getItem('error-tracker-breadcrumbs') || '[]') as Breadcrumb[];
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

/**
 * React Error Boundary component
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
    errorTracker.captureErrorBoundary(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return React.createElement(FallbackComponent);
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback(): React.ReactElement {
  const isStaging = getEnvironment() === 'staging';
  
  return React.createElement('div', {
    style: {
      padding: '20px',
      textAlign: 'center' as const,
      backgroundColor: isStaging ? '#fff3cd' : '#f8f9fa',
      border: isStaging ? '1px solid #ffeaa7' : '1px solid #dee2e6',
      borderRadius: '8px',
      margin: '20px'
    }
  }, 
    React.createElement('h2', null, 'Something went wrong'),
    React.createElement('p', null, 
      isStaging 
        ? 'An error occurred in the staging environment. The development team has been notified.'
        : 'We apologize for the inconvenience. Please try refreshing the page.'
    ),
    isStaging && React.createElement('details', { style: { marginTop: '10px', textAlign: 'left' as const } },
      React.createElement('summary', null, 'Error Details (Staging Only)'),
      React.createElement('pre', {
        style: {
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }
      }, `Session ID: ${errorTracker.sessionId}\nTimestamp: ${new Date().toISOString()}\nURL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}`)
    ),
    React.createElement('button', {
      onClick: () => window.location.reload(),
      style: {
        marginTop: '10px',
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }
    }, 'Refresh Page')
  );
}