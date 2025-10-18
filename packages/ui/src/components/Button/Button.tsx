import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  {
    variant = 'primary',
    size = 'medium',
    disabled = false,
    children,
    className = '',
    type = 'button',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) => {
  return (
    <button
      ref={ref}
      type={type}
      className={`portfolio-btn portfolio-btn--${variant} portfolio-btn--${size} ${className}`.trim()}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';