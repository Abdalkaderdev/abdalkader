/**
 * AILoadingState Component for AI Operations
 * Displays loading states for various AI operations with progress indicators
 */

import React from 'react';
import { motion } from 'framer-motion';
import './AILoadingState.css';

export type LoadingType = 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'progress';

export interface AILoadingStateProps {
  type?: LoadingType;
  message?: string;
  progress?: number;
  stage?: string;
  modelName?: string;
  estimatedTime?: number;
  className?: string;
  'aria-label'?: string;
  size?: 'small' | 'medium' | 'large';
}

export const AILoadingState = React.forwardRef<HTMLDivElement, AILoadingStateProps>(
  (
    {
      type = 'spinner',
      message = 'Processing...',
      progress,
      stage,
      modelName,
      estimatedTime,
      className = '',
      'aria-label': ariaLabel,
      size = 'medium',
    },
    ref
  ) => {
    const formatTime = (seconds: number): string => {
      if (seconds < 60) return `${Math.round(seconds)}s`;
      const minutes = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${minutes}m ${secs}s`;
    };

    const renderLoader = () => {
      switch (type) {
        case 'spinner':
          return (
            <div className="ai-loading__spinner" aria-hidden="true">
              <motion.div
                className="ai-loading__spinner-ring"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          );

        case 'dots':
          return (
            <div className="ai-loading__dots" aria-hidden="true">
              <motion.span
                className="ai-loading__dot"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="ai-loading__dot"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="ai-loading__dot"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          );

        case 'pulse':
          return (
            <div className="ai-loading__pulse" aria-hidden="true">
              <motion.div
                className="ai-loading__pulse-circle"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          );

        case 'skeleton':
          return (
            <div className="ai-loading__skeleton" aria-hidden="true">
              <div className="ai-loading__skeleton-line ai-loading__skeleton-line--short" />
              <div className="ai-loading__skeleton-line ai-loading__skeleton-line--medium" />
              <div className="ai-loading__skeleton-line ai-loading__skeleton-line--long" />
            </div>
          );

        case 'progress':
          return (
            <div className="ai-loading__progress-container" aria-hidden="true">
              <div className="ai-loading__progress-bar">
                <motion.div
                  className="ai-loading__progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress ?? 0}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {progress !== undefined && (
                <span className="ai-loading__progress-text">{progress}%</span>
              )}
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={`ai-loading ai-loading--${size} ${className}`.trim()}
        aria-label={ariaLabel || message}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="ai-loading__content">
          {renderLoader()}

          <div className="ai-loading__info">
            {modelName && (
              <div className="ai-loading__model-name" aria-label={`Model: ${modelName}`}>
                {modelName}
              </div>
            )}

            {stage && (
              <div className="ai-loading__stage" aria-label={`Stage: ${stage}`}>
                {stage}
              </div>
            )}

            <div className="ai-loading__message">{message}</div>

            {estimatedTime && (
              <div className="ai-loading__estimated-time" aria-label="Estimated time remaining">
                ~{formatTime(estimatedTime)} remaining
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

AILoadingState.displayName = 'AILoadingState';

