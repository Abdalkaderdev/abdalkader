import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, AnimationControls } from 'framer-motion';
import { useQuantumState } from '../../hooks/useQuantumState';
import { QuantumAnimationEngine } from '../../lib/physics/animationEngine';

export interface SuperpositionElementProps<T> {
  states: T[];
  probabilities?: number[];
  children: (state: T | null, isSuperposition: boolean) => React.ReactNode;
  className?: string;
  onCollapse?: (collapsedState: T) => void;
  onReset?: () => void;
  autoCollapse?: boolean;
  collapseDelay?: number;
  animationConfig?: {
    duration?: number;
    ease?: string;
    repeat?: number;
    yoyo?: boolean;
  };
}

/**
 * SuperpositionElement - A component that exists in multiple states simultaneously
 * Demonstrates quantum superposition through visual states
 */
export function SuperpositionElement<T>({
  states,
  probabilities,
  children,
  className = '',
  onCollapse,
  onReset,
  autoCollapse = false,
  collapseDelay = 3000,
  animationConfig = {
    duration: 2,
    ease: "easeInOut",
    repeat: -1,
    yoyo: true
  }
}: SuperpositionElementProps<T>) {
  const elementRef = useRef<HTMLDivElement>(null);
  const animationEngineRef = useRef<QuantumAnimationEngine | null>(null);
  const controls = useAnimation();

  const {
    currentState,
    isInSuperposition,
    probabilities: stateProbabilities,
    collapse,
    reset,
    getAmplitude,
    phase
  } = useQuantumState({
    states,
    probabilities,
    autoCollapse,
    collapseDelay,
    onCollapse,
    onReset
  });

  // Initialize animation engine
  useEffect(() => {
    if (elementRef.current && !animationEngineRef.current) {
      animationEngineRef.current = new QuantumAnimationEngine();
    }
  }, []);

  // Create superposition animation
  useEffect(() => {
    if (elementRef.current && animationEngineRef.current && isInSuperposition) {
      // Convert quantum states to animation states
      const animationStates = states.map((state, index) => ({
        x: Math.sin((index / states.length) * Math.PI * 2) * 20,
        y: Math.cos((index / states.length) * Math.PI * 2) * 20,
        scale: 0.8 + (stateProbabilities[index]?.probability || 0) * 0.4,
        rotation: (index / states.length) * 360,
        opacity: 0.7 + (stateProbabilities[index]?.probability || 0) * 0.3,
        blur: 2 - (stateProbabilities[index]?.probability || 0) * 2,
        glow: (stateProbabilities[index]?.probability || 0) * 20,
        probability: stateProbabilities[index]?.probability || 0
      }));

      animationEngineRef.current.createSuperpositionAnimation(
        elementRef.current,
        animationStates,
        animationConfig
      );
    }
  }, [states, stateProbabilities, isInSuperposition, animationConfig]);

  // Handle collapse animation
  useEffect(() => {
    if (!isInSuperposition && currentState !== null) {
      // Stop superposition animation
      if (animationEngineRef.current && elementRef.current) {
        animationEngineRef.current.stopAnimation(elementRef.current.id || 'default');
      }

      // Animate to collapsed state
      controls.start({
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
        filter: 'blur(0px)',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.8)',
        transition: {
          duration: 0.5,
          ease: "easeOut"
        }
      });
    }
  }, [isInSuperposition, currentState, controls]);

  const handleClick = () => {
    if (isInSuperposition) {
      collapse();
    } else {
      reset();
    }
  };

  const handleMouseEnter = () => {
    if (isInSuperposition) {
      controls.start({
        scale: 1.05,
        boxShadow: '0 0 40px rgba(255, 0, 255, 0.6)',
        transition: { duration: 0.3 }
      });
    }
  };

  const handleMouseLeave = () => {
    if (isInSuperposition) {
      controls.start({
        scale: 1,
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
        transition: { duration: 0.3 }
      });
    }
  };

  return (
    <motion.div
      ref={elementRef}
      className={`
        relative cursor-pointer select-none
        ${isInSuperposition ? 'quantum-superposition-effect' : ''}
        ${className}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={controls}
      initial={{
        scale: 1,
        opacity: 1,
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
      }}
    >
      {/* Quantum state indicator */}
      {isInSuperposition && (
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
      )}

      {/* Probability cloud visualization */}
      {isInSuperposition && (
        <div className="absolute inset-0 pointer-events-none">
          {stateProbabilities.map((stateProb, index) => {
            const amplitude = getAmplitude(states[index]);
            const angle = (index / stateProbabilities.length) * Math.PI * 2;
            const radius = Math.abs(amplitude) * 30;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <div
                key={index}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.1}s`
                }}
              />
            );
          })}
        </div>
      )}

      {/* Phase indicator */}
      {isInSuperposition && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div 
            className="w-2 h-2 bg-magenta-400 rounded-full"
            style={{
              transform: `rotate(${phase * 180 / Math.PI}deg)`,
              transition: 'transform 0.1s linear'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children(currentState, isInSuperposition)}
      </div>

      {/* Collapsed state indicator */}
      {!isInSuperposition && currentState !== null && (
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full" />
      )}
    </motion.div>
  );
}