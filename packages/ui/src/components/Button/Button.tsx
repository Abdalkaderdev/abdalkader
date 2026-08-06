/**
 * Enhanced Button Component with Micro-interactions
 * Senior Frontend Developer - Component Specialist
 */

import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';
// import { animationSets, hoverAnimations, tapAnimations } from '@/animations/presets';

/**
 * Framer Motion defines its own `onAnimationStart` and drag handlers with
 * signatures that clash with React's DOM event handlers of the same name, so
 * those are omitted. They were never reachable anyway — this component did not
 * forward its rest props at all until they were wired up.
 */
type ButtonMotionConflicts =
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonMotionConflicts> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  {
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    children,
    className = '',
    type = 'button',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    icon,
    iconPosition = 'left',
    ...props
  },
  ref
) => {
  const isDisabled = disabled || loading;

  const buttonClasses = `portfolio-btn portfolio-btn--${variant} portfolio-btn--${size} ${
    isDisabled ? 'portfolio-btn--disabled' : ''
  } ${loading ? 'portfolio-btn--loading' : ''} ${className}`.trim();

  return (
    <motion.button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
      {...props}
    >
      <span className="portfolio-btn__content">
        {loading && (
          <motion.span
            className="portfolio-btn__spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <motion.span
            className="portfolio-btn__icon portfolio-btn__icon--left"
            animate={{ x: 0 }}
            whileHover={{ x: -3 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.span>
        )}
        
        <span className="portfolio-btn__text">{children}</span>
        
        {!loading && icon && iconPosition === 'right' && (
          <motion.span
            className="portfolio-btn__icon portfolio-btn__icon--right"
            animate={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.span>
        )}
      </span>

      {/* Ripple effect overlay */}
      <span className="portfolio-btn__ripple" />
    </motion.button>
  );
});

Button.displayName = 'Button';