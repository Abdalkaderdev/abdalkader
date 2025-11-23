/**
 * ErrorState Component
 * Displays error messages with optional retry actions
 */

import React from 'react';
import './ErrorState.css';
import { Button } from '../Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  className = '',
  variant = 'default',
}: ErrorStateProps) {
  const errorMessage = message || (error instanceof Error ? error.message : error) || 'An unexpected error occurred';

  return (
    <div className={`error-state error-state--${variant} ${className}`.trim()}>
      <div className="error-state__icon">⚠️</div>
      <h3 className="error-state__title">{title}</h3>
      <p className="error-state__message">{errorMessage}</p>
      {onRetry && (
        <div className="error-state__action">
          <Button variant="primary" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

