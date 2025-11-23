/**
 * Enhanced Loading Spinner Component
 * Senior Frontend Developer - Component Specialist
 */

import React from 'react';
import { motion } from 'framer-motion';
import './Spinner.css';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'orbit';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'default',
      color = 'primary',
      speed = 'normal',
      className = '',
    },
    ref
  ) => {
    const getSpinnerContent = () => {
      const baseClasses = `portfolio-spinner portfolio-spinner--${size} portfolio-spinner--${variant} portfolio-spinner--${color} portfolio-spinner--${speed} ${className}`.trim();

      switch (variant) {
        case 'default':
          return (
            <motion.div
              className={baseClasses}
              ref={ref}
              animate={{ rotate: 360 }}
              transition={{
                duration: speed === 'slow' ? 2 : speed === 'fast' ? 0.8 : 1.2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="portfolio-spinner-circle" />
            </motion.div>
          );

        case 'dots':
          return (
            <div className={baseClasses} ref={ref}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="portfolio-spinner-dot"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: speed === 'slow' ? 1.5 : speed === 'fast' ? 0.6 : 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          );

        case 'pulse':
          return (
            <div className={baseClasses} ref={ref}>
              <motion.div
                className="portfolio-spinner-pulse"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 0.3, 0.8],
                }}
                transition={{
                  duration: speed === 'slow' ? 2 : speed === 'fast' ? 0.8 : 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          );

        case 'bars':
          return (
            <div className={baseClasses} ref={ref}>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="portfolio-spinner-bar"
                  animate={{
                    scaleY: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: speed === 'slow' ? 1.2 : speed === 'fast' ? 0.5 : 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          );

        case 'orbit':
          return (
            <div className={baseClasses} ref={ref}>
              <motion.div
                className="portfolio-spinner-orbit"
                animate={{ rotate: 360 }}
                transition={{
                  duration: speed === 'slow' ? 3 : speed === 'fast' ? 1.5 : 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="portfolio-spinner-orbit-dot"
                    style={{
                      transform: `rotate(${i * 120}deg) translateY(-10px)`,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          );

        default:
          return null;
      }
    };

    return getSpinnerContent();
  }
);

Spinner.displayName = 'Spinner';

/**
 * Full Page Loading Spinner
 */
export const FullPageSpinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (props, ref) => (
    <div className="portfolio-fullpage-spinner" ref={ref}>
      <div className="portfolio-fullpage-spinner-content">
        <Spinner {...props} />
        <p className="portfolio-fullpage-spinner-text">Loading...</p>
      </div>
    </div>
  )
);

FullPageSpinner.displayName = 'FullPageSpinner';

/**
 * Button Loading Spinner
 */
export const ButtonSpinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (props, ref) => (
    <div className="portfolio-button-spinner" ref={ref}>
      <Spinner size="sm" variant="default" {...props} />
    </div>
  )
);

ButtonSpinner.displayName = 'ButtonSpinner';
