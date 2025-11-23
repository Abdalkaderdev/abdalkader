/**
 * Enhanced Button Component with Micro-interactions
 * Senior Frontend Developer - Component Specialist
 */

import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';
// import { animationSets, hoverAnimations, tapAnimations } from '@/animations/presets';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
      className={buttonClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
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