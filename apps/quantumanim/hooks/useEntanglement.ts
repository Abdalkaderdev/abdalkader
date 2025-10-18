import { useState, useEffect, useCallback, useRef } from 'react';
import { QuantumState } from '../lib/quantum/quantumState';

export interface EntangledPair<T, U> {
  id1: string;
  id2: string;
  state1: QuantumState<T>;
  state2: QuantumState<U>;
  isEntangled: boolean;
}

export interface UseEntanglementConfig<T, U> {
  id1: string;
  id2: string;
  states1: T[];
  states2: U[];
  probabilities1?: number[];
  probabilities2?: number[];
  onStateChange?: (id: string, state: T | U) => void;
  onEntanglement?: (isEntangled: boolean) => void;
}

export interface UseEntanglementReturn<T, U> {
  entangledPair: EntangledPair<T, U> | null;
  isEntangled: boolean;
  state1: T | null;
  state2: U | null;
  collapseState1: () => T;
  collapseState2: () => U;
  resetBoth: () => void;
  breakEntanglement: () => void;
  createEntanglement: () => void;
}

/**
 * Hook for managing quantum entanglement between two states
 */
export function useEntanglement<T, U>(config: UseEntanglementConfig<T, U>): UseEntanglementReturn<T, U> {
  const [entangledPair, setEntangledPair] = useState<EntangledPair<T, U> | null>(null);
  const [isEntangled, setIsEntangled] = useState(false);
  const [state1, setState1] = useState<T | null>(null);
  const [state2, setState2] = useState<U | null>(null);
  
  const state1Ref = useRef<QuantumState<T> | null>(null);
  const state2Ref = useRef<QuantumState<U> | null>(null);

  // Initialize quantum states
  useEffect(() => {
    const quantumState1 = new QuantumState({
      states: config.states1,
      probabilities: config.probabilities1
    });

    const quantumState2 = new QuantumState({
      states: config.states2,
      probabilities: config.probabilities2
    });

    // Set up observers
    quantumState1.addObserver((collapsedState) => {
      setState1(collapsedState);
      if (collapsedState !== null) {
        config.onStateChange?.(config.id1, collapsedState);
      }
    });

    quantumState2.addObserver((collapsedState) => {
      setState2(collapsedState);
      if (collapsedState !== null) {
        config.onStateChange?.(config.id2, collapsedState);
      }
    });

    state1Ref.current = quantumState1;
    state2Ref.current = quantumState2;

    // Create entanglement
    quantumState1.entangleWith(quantumState2);

    setEntangledPair({
      id1: config.id1,
      id2: config.id2,
      state1: quantumState1,
      state2: quantumState2,
      isEntangled: true
    });

    setIsEntangled(true);
    config.onEntanglement?.(true);

    return () => {
      if (state1Ref.current && state2Ref.current) {
        state1Ref.current.disentangleFrom(state2Ref.current);
      }
    };
  }, [config.states1, config.states2, config.probabilities1, config.probabilities2]);

  const collapseState1 = useCallback((): T => {
    if (!state1Ref.current) {
      throw new Error('Quantum state 1 not initialized');
    }
    return state1Ref.current.observe();
  }, []);

  const collapseState2 = useCallback((): U => {
    if (!state2Ref.current) {
      throw new Error('Quantum state 2 not initialized');
    }
    return state2Ref.current.observe();
  }, []);

  const resetBoth = useCallback(() => {
    if (state1Ref.current) {
      state1Ref.current.reset();
    }
    if (state2Ref.current) {
      state2Ref.current.reset();
    }
  }, []);

  const breakEntanglement = useCallback(() => {
    if (state1Ref.current && state2Ref.current) {
      state1Ref.current.disentangleFrom(state2Ref.current);
      setIsEntangled(false);
      config.onEntanglement?.(false);
    }
  }, [config.onEntanglement]);

  const createEntanglement = useCallback(() => {
    if (state1Ref.current && state2Ref.current) {
      state1Ref.current.entangleWith(state2Ref.current);
      setIsEntangled(true);
      config.onEntanglement?.(true);
    }
  }, [config.onEntanglement]);

  return {
    entangledPair,
    isEntangled,
    state1,
    state2,
    collapseState1,
    collapseState2,
    resetBoth,
    breakEntanglement,
    createEntanglement,
  };
}