/**
 * Enhanced Select/Dropdown Component with Animations
 * Senior Frontend Developer - Form Specialist
 */

import React, { useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error = false,
      errorMessage,
      required = false,
      helperText,
      placeholder = 'Select an option',
      icon,
      className = '',
      id,
      'aria-describedby': ariaDescribedBy,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const describedBy = [
      ariaDescribedBy,
      error && errorMessage ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    const handleSelect = (option: SelectOption) => {
      setSelectedValue(option.value);
      setIsOpen(false);
      
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', {
        writable: false,
        value: { value: option.value },
      });
      onChange?.(event as any);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    React.useEffect(() => {
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    return (
      <motion.div
        className={`portfolio-select-wrapper ${className}`.trim()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label htmlFor={selectId} className="portfolio-select-label">
            {label}
            {required && <span className="portfolio-select-required">*</span>}
          </label>
        )}

        <div className="portfolio-select-container" ref={containerRef}>
          {icon && <span className="portfolio-select-icon">{icon}</span>}

          <motion.button
            type="button"
            className={`portfolio-select-trigger ${isOpen ? 'portfolio-select-trigger--open' : ''} ${
              error ? 'portfolio-select-trigger--error' : ''
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-describedby={describedBy}
          >
            <span className="portfolio-select-value">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="portfolio-select-chevron"
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="portfolio-select-dropdown"
                initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
                transition={{ duration: 0.2 }}
                role="listbox"
              >
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    className={`portfolio-select-option ${
                      selectedValue === option.value ? 'portfolio-select-option--selected' : ''
                    } ${option.disabled ? 'portfolio-select-option--disabled' : ''}`}
                    onClick={() => !option.disabled && handleSelect(option)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={selectedValue === option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={!option.disabled ? { x: 5, backgroundColor: 'rgba(244, 78, 0, 0.1)' } : {}}
                  >
                    {option.label}
                    {selectedValue === option.value && (
                      <motion.span
                        className="portfolio-select-checkmark"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <select
            ref={ref}
            id={selectId}
            className="portfolio-select-native"
            value={selectedValue}
            onChange={(e) => handleSelect(options.find((opt) => opt.value === e.target.value) || options[0])}
            aria-describedby={describedBy}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && errorMessage && (
          <motion.div
            id={errorId}
            className="portfolio-select-error"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}

        {helperText && !error && (
          <motion.div
            id={helperId}
            className="portfolio-select-helper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {helperText}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

Select.displayName = 'Select';
