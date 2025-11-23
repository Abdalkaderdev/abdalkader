/**
 * Enhanced Tooltip Component with Animations
 * Senior Frontend Developer - Component Specialist
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Tooltip.css';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      position = 'top',
      delay = 0.2,
      disabled = false,
      className = '',
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      if (disabled) return;
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay * 1000);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={containerRef || ref}
        className={`portfolio-tooltip-container ${className}`.trim()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}

        <AnimatePresence>
          {isVisible && !disabled && (
            <motion.div
              className={`portfolio-tooltip portfolio-tooltip--${position}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              role="tooltip"
            >
              <motion.div
                className="portfolio-tooltip-content"
                initial={{ y: -5 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {content}
              </motion.div>

              {/* Arrow */}
              <div className="portfolio-tooltip-arrow" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
