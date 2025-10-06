import React, { useId } from 'react';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  helperText?: string;
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
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  
  const describedBy = [
    ariaDescribedBy,
    error && errorMessage ? errorId : null,
    helperText ? helperId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={`input ${error ? 'input--error' : ''}`}
        aria-invalid={error}
        aria-describedby={describedBy}
        aria-required={required}
        {...props}
      />
      {error && errorMessage && (
        <div id={errorId} className="input-error" role="alert">
          {errorMessage}
        </div>
      )}
      {helperText && !error && (
        <div id={helperId} className="input-helper">
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';