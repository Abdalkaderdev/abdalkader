import React, { useState, useEffect } from 'react';
import { useSuperposition, SuperpositionConfig } from '../hooks/useSuperposition';
import { QuantumState } from '../utils/quantumRandom';

export interface QuantumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  superpositionStates?: QuantumState[];
  collapseDuration?: number;
  autoCollapse?: boolean;
  disabled?: boolean;
}

/**
 * Quantum Superposition Button
 * Multiple visual states that collapse on interaction
 */
export function QuantumButton({
  children,
  onClick,
  className = '',
  superpositionStates = [
    { value: 0, probability: 0.3, phase: 0 },
    { value: 1, probability: 0.4, phase: Math.PI / 2 },
    { value: 2, probability: 0.3, phase: Math.PI },
  ],
  collapseDuration = 500,
  autoCollapse = false,
  disabled = false,
}: QuantumButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const config: SuperpositionConfig = {
    states: superpositionStates,
    collapseDuration,
    autoCollapse,
    autoCollapseDelay: 2000,
  };

  const { currentState, isCollapsed, collapse, reset, isAnimating } = useSuperposition(config);

  const handleClick = () => {
    if (disabled) return;
    
    collapse();
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Reset superposition after collapse
  useEffect(() => {
    if (isCollapsed) {
      const timer = setTimeout(() => {
        reset();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCollapsed, reset]);

  // Get button styles based on quantum state
  const getButtonStyles = () => {
    const baseStyles = `
      relative overflow-hidden transition-all duration-300 ease-out
      bg-gradient-to-r from-quantum-blue to-quantum-purple
      text-white font-semibold py-3 px-6 rounded-lg
      shadow-lg hover:shadow-xl
      transform-gpu
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;

    if (isCollapsed) {
      return `${baseStyles} bg-gradient-to-r from-quantum-green to-quantum-pink`;
    }

    if (isAnimating) {
      return `${baseStyles} animate-quantum-collapse`;
    }

    if (isPressed) {
      return `${baseStyles} scale-95 shadow-md`;
    }

    if (isHovered) {
      return `${baseStyles} scale-105 shadow-xl`;
    }

    // Superposition state - multiple visual states
    if (currentState && !isCollapsed) {
      const stateValue = currentState.value;
      switch (stateValue) {
        case 0:
          return `${baseStyles} animate-quantum-pulse bg-gradient-to-r from-quantum-blue to-quantum-purple`;
        case 1:
          return `${baseStyles} animate-quantum-float bg-gradient-to-r from-quantum-purple to-quantum-pink`;
        case 2:
          return `${baseStyles} animate-quantum-wave bg-gradient-to-r from-quantum-pink to-quantum-orange`;
        default:
          return `${baseStyles} animate-quantum-superposition bg-gradient-to-r from-quantum-blue to-quantum-purple`;
      }
    }

    return `${baseStyles} animate-quantum-superposition`;
  };

  return (
    <button
      className={`${getButtonStyles()} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled}
    >
      {/* Quantum effect overlay */}
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
      
      {/* Button content */}
      <span className="relative z-10">
        {children}
      </span>
      
      {/* Quantum particles effect */}
      {!isCollapsed && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-quantum-pulse" />
          <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-quantum-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full animate-quantum-wave" style={{ animationDelay: '1s' }} />
        </div>
      )}
    </button>
  );
}