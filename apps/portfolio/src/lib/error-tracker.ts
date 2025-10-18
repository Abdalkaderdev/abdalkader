/**
 * Error Tracking System for Staging Environment
 * Captures and reports errors with detailed context
 */

import { getFeatureFlag } from './feature-flags';
import React from 'react';

interface ErrorContext {
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  componentStack?: string;
  props?: Record<string, unknown>;
}

interface ErrorReport {
  id: string;
  type: 'javascript' | 'react' | 'network' | 'promise';
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fingerprint: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
}

class ErrorTracker {
  private errors: ErrorReport[] = [];
  private isEnabled: boolean = false;
  private sessionId: string;

  constructor() {
    this.isEnabled = getFeatureFlag('enableErrorTracking');
    this.sessionId = this.generateSessionId();
    
    if (this.isEnabled) {
      this.init();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', this.handleGlobalError.bind(this));
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    
    // React error boundary integration
    this.setupReactErrorBoundary();
    
    // Network error tracking
    this.trackNetworkErrors();
  }

  private handleGlobalError(event: ErrorEvent): void {
    const context: ErrorContext = {
      message: event.message,
      stack: event.error?.stack,
      url: event.filename || window.location.href,
      line: event.lineno,
      column: event.colno,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
    };

    this.recordError({
      type: 'javascript',
      context,
      severity: this.determineSeverity(event.error),
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const context: ErrorContext = {
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
    };

    this.recordError({
      type: 'promise',
      context,
      severity: 'medium',
    });
  }

  private setupReactErrorBoundary(): void {
    // This would be integrated with React Error Boundary components
    // For now, we'll create a helper function
    (window as unknown as { __reactErrorBoundary: (error: Error, errorInfo: React.ErrorInfo) => void }).__reactErrorBoundary = this.recordReactError.bind(this);
  }

  public recordReactError(error: Error, errorInfo: React.ErrorInfo): void {
    const context: ErrorContext = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      componentStack: errorInfo.componentStack || undefined,
    };

    this.recordError({
      type: 'react',
      context,
      severity: 'high',
    });
  }

  private trackNetworkErrors(): void {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Track failed requests
        if (!response.ok) {
          const context: ErrorContext = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: typeof args[0] === 'string' ? args[0] : (args[0] as Request).url,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            sessionId: this.sessionId,
          };

          this.recordError({
            type: 'network',
            context,
            severity: response.status >= 500 ? 'high' : 'medium',
          });
        }
        
        return response;
      } catch (error) {
        const context: ErrorContext = {
          message: `Network Error: ${error}`,
          url: typeof args[0] === 'string' ? args[0] : (args[0] as Request).url,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          sessionId: this.sessionId,
        };

        this.recordError({
          type: 'network',
          context,
          severity: 'high',
        });
        
        throw error;
      }
    };
  }

  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'medium';
    
    const message = error.message.toLowerCase();
    
    if (message.includes('chunk') || message.includes('loading')) {
      return 'medium';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'high';
    }
    
    if (message.includes('syntax') || message.includes('reference')) {
      return 'critical';
    }
    
    return 'medium';
  }

  private generateFingerprint(error: ErrorReport): string {
    // Create a unique fingerprint for similar errors
    const key = `${error.type}:${error.context.message}:${error.context.url}:${error.context.line}`;
    return btoa(key).substring(0, 16);
  }

  private recordError(errorData: Omit<ErrorReport, 'id' | 'fingerprint' | 'count' | 'firstSeen' | 'lastSeen'>): void {
    const fingerprint = this.generateFingerprint(errorData as ErrorReport);
    const existingError = this.errors.find(e => e.fingerprint === fingerprint);
    
    if (existingError) {
      // Update existing error
      existingError.count++;
      existingError.lastSeen = Date.now();
    } else {
      // Create new error
      const newError: ErrorReport = {
        ...errorData,
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fingerprint,
        count: 1,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
      };
      
      this.errors.push(newError);
    }

    // Log to console in development
    if (getFeatureFlag('enableConsoleLogging')) {
      console.error('🚨 Error Tracked:', errorData);
    }

    // Send to error reporting service
    this.sendToErrorService(errorData);
  }

  private sendToErrorService(error: Omit<ErrorReport, 'id' | 'fingerprint' | 'count' | 'firstSeen' | 'lastSeen'>): void {
    // In a real implementation, you would send this to services like:
    // - Sentry
    // - Bugsnag
    // - Rollbar
    // - Custom error reporting endpoint
    
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
      console.log('📧 Error Report:', error);
      
      // Example: Send to custom endpoint
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(error)
      // }).catch(console.error);
    }
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  public getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: ErrorReport[];
  } {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    return {
      total: this.errors.length,
      byType: this.errors.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + error.count;
        return acc;
      }, {} as Record<string, number>),
      bySeverity: this.errors.reduce((acc, error) => {
        acc[error.severity] = (acc[error.severity] || 0) + error.count;
        return acc;
      }, {} as Record<string, number>),
      recent: this.errors.filter(error => error.lastSeen > oneHourAgo),
    };
  }

  public exportErrors(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      sessionId: this.sessionId,
      errors: this.errors,
      stats: this.getErrorStats(),
    }, null, 2);
  }

  public clearErrors(): void {
    this.errors = [];
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Development helper
export function getErrorDashboard(): void {
  if (getFeatureFlag('enableConsoleLogging')) {
    console.group('🚨 Error Dashboard');
    const stats = errorTracker.getErrorStats();
    console.log('Total Errors:', stats.total);
    console.log('By Type:', stats.byType);
    console.log('By Severity:', stats.bySeverity);
    console.log('Recent Errors:', stats.recent.length);
    console.log('Export Data:', errorTracker.exportErrors());
    console.groupEnd();
  }
}

// React Error Boundary helper
export function withErrorTracking<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const ErrorBoundaryComponent = class extends React.Component<P> {
    static displayName = `withErrorTracking(${Component.displayName || Component.name})`;
    
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      errorTracker.recordReactError(error, errorInfo);
    }

    render() {
      return React.createElement(Component, this.props);
    }
  };
  
  return ErrorBoundaryComponent;
}