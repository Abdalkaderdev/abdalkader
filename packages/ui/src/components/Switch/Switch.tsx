import React from 'react';
import { motion } from 'framer-motion';
import './Switch.css';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className = '',
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const switchClasses = `portfolio-switch portfolio-switch--${size} ${
    disabled ? 'portfolio-switch--disabled' : ''
  } ${className}`.trim();

  return (
    <div className={`portfolio-switch-wrapper ${label ? 'portfolio-switch-wrapper--with-label' : ''}`}>
      {label && (
        <label className="portfolio-switch-label" onClick={handleToggle}>
          {label}
        </label>
      )}
      
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={switchClasses}
        onClick={handleToggle}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="portfolio-switch-thumb"
          animate={{
            x: checked ? (size === 'sm' ? 12 : size === 'lg' ? 24 : 18) : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        
        {/* Visual feedback for states */}
        <div className="portfolio-switch-track">
          <motion.div
            className="portfolio-switch-indicator"
            animate={{
              opacity: checked ? 1 : 0,
              scale: checked ? 1 : 0.5,
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </motion.button>
    </div>
  );
};

Switch.displayName = 'Switch';
