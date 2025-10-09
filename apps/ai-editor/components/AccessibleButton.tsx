import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../hooks/useAccessibility';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  ariaDescription?: string;
  announceOnClick?: boolean;
  announceMessage?: string;
  className?: string;
  children?: React.ReactNode;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    ariaLabel,
    ariaDescription,
    announceOnClick = false,
    announceMessage,
    className = '',
    children,
    disabled,
    onClick,
    ...props
  }, ref) => {
    const { announce, getAriaLabel } = useAccessibility();

    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-orange-500 to-red-500 text-black hover:from-orange-600 hover:to-red-600 active:scale-95',
      secondary: 'bg-gray-700 text-white hover:bg-gray-600 active:scale-95',
      outline: 'border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black active:scale-95',
      ghost: 'text-gray-300 hover:text-white hover:bg-gray-800 active:scale-95'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (announceOnClick && announceMessage) {
        announce(announceMessage);
      }
      onClick?.(e);
    };

    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <motion.button
        ref={ref}
        type="button"
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? `${props.id}-description` : undefined}
        aria-disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}
        
        {children && (
          <span>{children}</span>
        )}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}

        {ariaDescription && (
          <span id={`${props.id}-description`} className="sr-only">
            {ariaDescription}
          </span>
        )}
      </motion.button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;