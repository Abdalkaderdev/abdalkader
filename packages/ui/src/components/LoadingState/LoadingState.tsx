/**
 * LoadingState Component
 * Displays loading indicators with optional messages
 */

import React from 'react';
import './LoadingState.css';
import { Spinner } from '../Spinner';

export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  className?: string;
  variant?: 'spinner' | 'skeleton' | 'pulse';
}

export function LoadingState({
  message = 'Loading...',
  size = 'medium',
  fullScreen = false,
  className = '',
  variant = 'spinner',
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={`loading-state loading-state--skeleton ${fullScreen ? 'loading-state--fullscreen' : ''} ${className}`.trim()}>
        <div className="loading-state__skeleton">
          <div className="loading-state__skeleton-line loading-state__skeleton-line--title" />
          <div className="loading-state__skeleton-line loading-state__skeleton-line--body" />
          <div className="loading-state__skeleton-line loading-state__skeleton-line--body" />
          <div className="loading-state__skeleton-line loading-state__skeleton-line--short" />
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`loading-state loading-state--pulse ${fullScreen ? 'loading-state--fullscreen' : ''} ${className}`.trim()}>
        <div className="loading-state__pulse">
          <div className="loading-state__pulse-dot" />
          <div className="loading-state__pulse-dot" />
          <div className="loading-state__pulse-dot" />
        </div>
        {message && <p className="loading-state__message">{message}</p>}
      </div>
    );
  }

  return (
    <div className={`loading-state loading-state--spinner loading-state--${size} ${fullScreen ? 'loading-state--fullscreen' : ''} ${className}`.trim()}>
      <Spinner size={size} />
      {message && <p className="loading-state__message">{message}</p>}
    </div>
  );
}

