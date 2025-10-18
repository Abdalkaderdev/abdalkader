import { useState, useEffect, useCallback, useRef } from 'react';
import { QuantumState } from '../lib/quantum/quantumState';

export interface UseQuantumStateConfig<T> {
  states: T[];
  probabilities?: number[];
  phase?: number;
  autoCollapse?: boolean;
  collapseDelay?: number;
  onCollapse?: (collapsedState: T) => void;
  onReset?: () => void;
}

export interface UseQuantumStateReturn<T> {
  currentState: T | null;
  isInSuperposition: boolean;
  probabilities: Array<{ state: T; probability: number }>;
  collapse: () => T;
  reset: () => void;
  updateProbabilities: (newProbabilities: number[]) => void;
  getAmplitude: (state: T) => number;
  getComplexAmplitude: (state: T) => { real: number; imaginary: number };
  phase: number;
  setPhase: (phase: number) => void;
}

/**
 * Hook for managing quantum states with React
 */
export function useQuantumState<T>(config: UseQuantumStateConfig<T>): UseQuantumStateReturn<T> {
  const [currentState, setCurrentState] = useState<T | null>(null);
  const [isInSuperposition, setIsInSuperposition] = useState(true);
  const [probabilities, setProbabilities] = useState<Array<{ state: T; probability: number }>>([]);
  const [phase, setPhase] = useState(config.phase || 0);
  
  const quantumStateRef = useRef<QuantumState<T> | null>(null);
  const autoCollapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize quantum state
  useEffect(() => {
    quantumStateRef.current = new QuantumState({
      states: config.states,
      probabilities: config.probabilities,
      phase: config.phase || 0
    });

    // Set up observer
    quantumStateRef.current.addObserver((collapsedState) => {
      setCurrentState(collapsedState);
      setIsInSuperposition(collapsedState === null);
      
      if (collapsedState !== null) {
        config.onCollapse?.(collapsedState);
      }
    });

    // Update probabilities display
    updateProbabilitiesDisplay();

    return () => {
      if (quantumStateRef.current) {
        quantumStateRef.current.removeObserver(() => {});
      }
    };
  }, [config.states, config.probabilities, config.phase]);

  // Auto-collapse effect
  useEffect(() => {
    if (config.autoCollapse && isInSuperposition) {
      autoCollapseTimeoutRef.current = setTimeout(() => {
        collapse();
      }, config.collapseDelay || 3000);
    }

    return () => {
      if (autoCollapseTimeoutRef.current) {
        clearTimeout(autoCollapseTimeoutRef.current);
      }
    };
  }, [config.autoCollapse, config.collapseDelay, isInSuperposition]);

  const updateProbabilitiesDisplay = useCallback(() => {
    if (quantumStateRef.current) {
      const stateProbs = quantumStateRef.current.getStateProbabilities();
      setProbabilities(stateProbs);
    }
  }, []);

  const collapse = useCallback((): T => {
    if (!quantumStateRef.current) {
      throw new Error('Quantum state not initialized');
    }
    
    const collapsedState = quantumStateRef.current.observe();
    return collapsedState;
  }, []);

  const reset = useCallback(() => {
    if (quantumStateRef.current) {
      quantumStateRef.current.reset();
      config.onReset?.();
    }
  }, [config.onReset]);

  const updateProbabilities = useCallback((newProbabilities: number[]) => {
    if (quantumStateRef.current) {
      quantumStateRef.current.updateProbabilities(newProbabilities);
      updateProbabilitiesDisplay();
    }
  }, [updateProbabilitiesDisplay]);

  const getAmplitude = useCallback((state: T): number => {
    if (!quantumStateRef.current) return 0;
    return quantumStateRef.current.getAmplitude(state);
  }, []);

  const getComplexAmplitude = useCallback((state: T): { real: number; imaginary: number } => {
    if (!quantumStateRef.current) return { real: 0, imaginary: 0 };
    return quantumStateRef.current.getComplexAmplitude(state);
  }, []);

  const handleSetPhase = useCallback((newPhase: number) => {
    if (quantumStateRef.current) {
      quantumStateRef.current.setPhase(newPhase);
      setPhase(newPhase);
    }
  }, []);

  return {
    currentState,
    isInSuperposition,
    probabilities,
    collapse,
    reset,
    updateProbabilities,
    getAmplitude,
    getComplexAmplitude,
    phase,
    setPhase: handleSetPhase,
  };
}