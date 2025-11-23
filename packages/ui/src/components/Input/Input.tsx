/**
 * Enhanced Input Component with Animations & Validation
 * Senior Frontend Developer - Form Specialist
 */

import React, { useId, useState } from 'react';
import { motion } from 'framer-motion';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  successMessage?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((
  {
    type = 'text',
    label,
    error = false,
    errorMessage,
    required = false,
    helperText,
    className = '',
    id,
    icon,
    successMessage,
    'aria-describedby': ariaDescribedBy,
    onFocus,
    onBlur,
    ...props
  },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  
  const describedBy = [
    ariaDescribedBy,
    error && errorMessage ? errorId : null,
    helperText ? helperId : null,
  ].filter(Boolean).join(' ') || undefined;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  return (
    <motion.div
      className={`portfolio-input-wrapper ${className}`.trim()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <motion.label
          htmlFor={inputId}
          className="portfolio-input-label"
          animate={isFocused || hasValue ? { y: -24, fontSize: '0.875rem' } : { y: 0, fontSize: '1rem' }}
          transition={{ duration: 0.3 }}
        >
          {label}
          {required && <span className="portfolio-input-required" aria-label="required">*</span>}
        </motion.label>
      )}

      <div className="portfolio-input-container">
        {icon && (
          <motion.span
            className="portfolio-input-icon"
            animate={isFocused ? { color: 'var(--color-primary)' } : { color: 'var(--color-text-grey)' }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.span>
        )}

        <input
          ref={ref}
          type={type}
          id={inputId}
          className={`portfolio-input ${error ? 'portfolio-input--error' : ''} ${isFocused ? 'portfolio-input--focused' : ''}`}
          aria-invalid={error}
          aria-describedby={describedBy}
          aria-required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Underline animation */}
        <motion.div
          className="portfolio-input-underline"
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Success indicator */}
        {!error && hasValue && successMessage && (
          <motion.span
            className="portfolio-input-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            ✓
          </motion.span>
        )}
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <motion.div
          id={errorId}
          className="portfolio-input-error"
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <motion.div
          id={helperId}
          className="portfolio-input-helper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {helperText}
        </motion.div>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';