'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useReducedMotion } from '@/hooks/useAnimations';

interface ResponsiveCardProps {
  children: React.ReactNode;
  variant?: 'timeline' | 'language' | 'paradigm' | 'code' | 'ai';
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  title?: string;
  description?: string;
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  id?: string;
  tilt?: boolean;
  glow?: boolean;
  delay?: number;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  variant = 'timeline',
  className = '',
  onClick,
  onKeyDown,
  title,
  description,
  role = 'button',
  tabIndex = 0,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaControls,
  id,
  tilt = false,
  glow = false,
  delay = 0,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { 
    settings, 
    isMobile, 
    isTablet, 
    isDesktop, 
    getResponsiveClasses, 
    getAccessibilityClasses,
    shouldAnimate,
    getFocusStyles,
    getTouchTargetSize,
    announceToScreenReader
  } = useAccessibility();
  const reducedMotion = useReducedMotion();

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e);
      return;
    }

    // Standard keyboard navigation
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onClick) {
          onClick();
          announceToScreenReader(`Activated ${title || 'card'}`);
        }
        break;
      case 'Escape':
        if (isFocused) {
          cardRef.current?.blur();
        }
        break;
    }
  };

  // Handle focus management
  const handleFocus = () => {
    setIsFocused(true);
    if (settings.screenReader) {
      announceToScreenReader(`${title || 'Card'} focused. ${description || ''}`);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Handle touch interactions
  const handleTouchStart = () => {
    if (settings.touchMode) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    if (settings.touchMode) {
      setIsPressed(false);
      if (onClick) {
        onClick();
      }
    }
  };

  // Handle mouse interactions
  const handleMouseDown = () => {
    if (!settings.touchMode) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    if (!settings.touchMode) {
      setIsPressed(false);
    }
  };

  // Get responsive card classes
  const getCardClasses = () => {
    const baseClasses = 'group relative overflow-hidden transition-all duration-300';
    const accessibilityClasses = getAccessibilityClasses();
    const focusClasses = getFocusStyles();
    const touchClasses = getTouchTargetSize();
    
    const responsiveClasses = getResponsiveClasses({
      mobile: 'p-4 rounded-lg min-h-[120px]',
      tablet: 'p-6 rounded-xl min-h-[140px]',
      desktop: 'p-8 rounded-2xl min-h-[160px]',
    });

    const variantClasses = {
      timeline: 'bg-black/50 backdrop-blur-lg border border-orange-500/30',
      language: 'bg-gray-900/50 backdrop-blur-lg border border-gray-700',
      paradigm: 'bg-indigo-900/50 backdrop-blur-lg border border-indigo-500/30',
      code: 'bg-green-900/50 backdrop-blur-lg border border-green-500/30',
      ai: 'bg-orange-900/50 backdrop-blur-lg border border-orange-500/30',
    };

    const stateClasses = [
      isFocused ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-black' : '',
      isPressed ? 'scale-95' : '',
      settings.highContrast ? 'border-2' : '',
    ].filter(Boolean).join(' ');

    return [
      baseClasses,
      accessibilityClasses,
      focusClasses,
      touchClasses,
      responsiveClasses,
      variantClasses[variant],
      stateClasses,
      className,
    ].filter(Boolean).join(' ');
  };

  // Animation variants based on accessibility settings
  const getAnimationVariants = () => {
    if (!shouldAnimate('card')) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        hover: {},
        tap: {},
      };
    }

    return {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.6, 
          ease: [0.19, 1, 0.22, 1],
          delay: delay * 0.1 
        }
      },
      exit: { 
        opacity: 0, 
        y: -20, 
        scale: 0.95,
        transition: { duration: 0.3 }
      },
      hover: settings.touchMode ? {} : {
        y: -5,
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] }
      },
      tap: {
        scale: 0.98,
        transition: { duration: 0.1 }
      },
    };
  };

  const animationVariants = getAnimationVariants();

  return (
    <motion.div
      ref={cardRef}
      className={getCardClasses()}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel || title}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      id={id}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={settings.touchMode ? undefined : "hover"}
      whileTap="tap"
      layout
    >
      {/* Focus indicator for keyboard navigation */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-inherit border-2 border-orange-500 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* High contrast border */}
      {settings.highContrast && (
        <div className="absolute inset-0 rounded-inherit border-2 border-white pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>

      {/* Screen reader only content */}
      {settings.screenReader && (
        <div className="sr-only">
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
          <p>Press Enter or Space to activate</p>
        </div>
      )}
    </motion.div>
  );
};

export default ResponsiveCard;