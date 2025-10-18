import { useState, useEffect, useCallback } from 'react';
import { createSuperposition, QuantumState } from '../utils/quantumRandom';

export interface SuperpositionConfig {
  states: QuantumState[];
  collapseDuration?: number;
  autoCollapse?: boolean;
  autoCollapseDelay?: number;
}

export interface SuperpositionResult {
  currentState: QuantumState | null;
  isCollapsed: boolean;
  collapse: () => void;
  reset: () => void;
  isAnimating: boolean;
}

/**
 * Hook for managing quantum superposition states
 * Handles multiple visual states that collapse on interaction
 */
export function useSuperposition(config: SuperpositionConfig): SuperpositionResult {
  const [currentState, setCurrentState] = useState<QuantumState | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const collapse = useCallback(() => {
    if (isCollapsed) return;
    
    setIsAnimating(true);
    setIsCollapsed(true);
    
    // Select final state based on quantum probabilities
    const finalState = createSuperposition(config.states);
    setCurrentState(finalState);
    
    // Reset animation state after collapse
    setTimeout(() => {
      setIsAnimating(false);
    }, config.collapseDuration || 500);
  }, [config.states, config.collapseDuration, isCollapsed]);

  const reset = useCallback(() => {
    setCurrentState(null);
    setIsCollapsed(false);
    setIsAnimating(false);
  }, []);

  // Auto-collapse effect
  useEffect(() => {
    if (config.autoCollapse && !isCollapsed) {
      const timer = setTimeout(() => {
        collapse();
      }, config.autoCollapseDelay || 3000);
      
      return () => clearTimeout(timer);
    }
  }, [config.autoCollapse, config.autoCollapseDelay, isCollapsed, collapse]);

  return {
    currentState,
    isCollapsed,
    collapse,
    reset,
    isAnimating,
  };
}