/**
 * Enhanced Progress Bar Component
 * Senior Frontend Developer - Component Specialist
 */

import React from 'react';
import { motion } from 'framer-motion';
import './Progress.css';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'striped' | 'animated' | 'indeterminate';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'md',
      variant = 'default',
      color = 'primary',
      showLabel = false,
      label,
      className = '',
    },
    ref
  ) => {
    const percentage = Math.min((value / max) * 100, 100);
    const displayLabel = label || `${Math.round(percentage)}%`;

    const getProgressContent = () => {
      const baseClasses = `portfolio-progress portfolio-progress--${size} portfolio-progress--${variant} portfolio-progress--${color} ${className}`.trim();

      if (variant === 'indeterminate') {
        return (
          <div className={baseClasses} ref={ref}>
            <motion.div
              className="portfolio-progress-bar"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        );
      }

      return (
        <div className={baseClasses} ref={ref}>
          <motion.div
            className={`portfolio-progress-bar ${variant === 'animated' ? 'portfolio-progress-bar--animated' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: 0.8,
              ease: [0.19, 1, 0.22, 1],
            }}
          />
          
          {showLabel && (
            <span className="portfolio-progress-label">
              {displayLabel}
            </span>
          )}
        </div>
      );
    };

    return getProgressContent();
  }
);

Progress.displayName = 'Progress';

/**
 * Circular Progress Component
 */
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  thickness?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'md',
      thickness = 4,
      color = 'primary',
      showLabel = false,
      label,
      className = '',
    },
    ref
  ) => {
    const percentage = Math.min((value / max) * 100, 100);
    const displayLabel = label || `${Math.round(percentage)}%`;

    const getSize = () => {
      switch (size) {
        case 'sm': return 40;
        case 'md': return 60;
        case 'lg': return 80;
        default: return 60;
      }
    };

    const svgSize = getSize();
    const radius = (svgSize - thickness) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`portfolio-circular-progress portfolio-circular-progress--${size} ${className}`.trim()}>
        <svg
          ref={ref}
          width={svgSize}
          height={svgSize}
          className="portfolio-circular-progress-svg"
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={thickness}
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 0.8,
              ease: [0.19, 1, 0.22, 1],
            }}
            style={{ color: `var(--color-${color})` }}
          />
        </svg>
        
        {showLabel && (
          <span className="portfolio-circular-progress-label">
            {displayLabel}
          </span>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

/**
 * Progress Steps Component
 */
export interface ProgressStep {
  id: string;
  label: string;
  completed?: boolean;
  active?: boolean;
}

export interface ProgressStepsProps {
  steps: ProgressStep[];
  currentStep?: number;
  className?: string;
}

export const ProgressSteps = React.forwardRef<HTMLDivElement, ProgressStepsProps>(
  (
    {
      steps,
      currentStep = 0,
      className = '',
    },
    ref
  ) => {
    return (
      <div className={`portfolio-progress-steps ${className}`} ref={ref}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`portfolio-progress-step ${
              index === currentStep ? 'portfolio-progress-step--active' : ''
            } ${
              index < currentStep ? 'portfolio-progress-step--completed' : ''
            }`}
          >
            <div className="portfolio-progress-step-indicator">
              {index < currentStep ? (
                <span className="portfolio-progress-step-check">✓</span>
              ) : (
                <span className="portfolio-progress-step-number">{index + 1}</span>
              )}
            </div>
            <span className="portfolio-progress-step-label">{step.label}</span>
            
            {index < steps.length - 1 && (
              <div
                className={`portfolio-progress-step-connector ${
                  index < currentStep ? 'portfolio-progress-step-connector--completed' : ''
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
);

ProgressSteps.displayName = 'ProgressSteps';
