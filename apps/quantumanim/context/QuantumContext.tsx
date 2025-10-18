import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createEntangledValues } from '../utils/quantumRandom';

export interface EntangledState {
  id: string;
  value: any;
  entangledWith: string[];
  lastUpdate: number;
}

export interface QuantumContextType {
  entangledStates: Map<string, EntangledState>;
  createEntanglement: (id1: string, id2: string) => void;
  updateEntangledState: (id: string, value: any) => void;
  getEntangledState: (id: string) => EntangledState | undefined;
  breakEntanglement: (id: string) => void;
  isEntangled: (id1: string, id2: string) => boolean;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export interface QuantumProviderProps {
  children: ReactNode;
}

/**
 * Quantum Context Provider for managing entangled component states
 * Enables instant mirroring between entangled components
 */
export function QuantumProvider({ children }: QuantumProviderProps) {
  const [entangledStates, setEntangledStates] = useState<Map<string, EntangledState>>(new Map());

  const createEntanglement = useCallback((id1: string, id2: string) => {
    setEntangledStates(prev => {
      const newMap = new Map(prev);
      
      // Get or create states for both components
      const state1 = newMap.get(id1) || {
        id: id1,
        value: null,
        entangledWith: [],
        lastUpdate: Date.now(),
      };
      
      const state2 = newMap.get(id2) || {
        id: id2,
        value: null,
        entangledWith: [],
        lastUpdate: Date.now(),
      };
      
      // Add entanglement
      if (!state1.entangledWith.includes(id2)) {
        state1.entangledWith.push(id2);
      }
      if (!state2.entangledWith.includes(id1)) {
        state2.entangledWith.push(id1);
      }
      
      newMap.set(id1, state1);
      newMap.set(id2, state2);
      
      return newMap;
    });
  }, []);

  const updateEntangledState = useCallback((id: string, value: any) => {
    setEntangledStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(id);
      
      if (!state) return newMap;
      
      // Update the current state
      const updatedState = {
        ...state,
        value,
        lastUpdate: Date.now(),
      };
      
      newMap.set(id, updatedState);
      
      // Update all entangled states with the same value
      state.entangledWith.forEach(entangledId => {
        const entangledState = newMap.get(entangledId);
        if (entangledState) {
          newMap.set(entangledId, {
            ...entangledState,
            value,
            lastUpdate: Date.now(),
          });
        }
      });
      
      return newMap;
    });
  }, []);

  const getEntangledState = useCallback((id: string) => {
    return entangledStates.get(id);
  }, [entangledStates]);

  const breakEntanglement = useCallback((id: string) => {
    setEntangledStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(id);
      
      if (!state) return newMap;
      
      // Remove this component from all entangled lists
      state.entangledWith.forEach(entangledId => {
        const entangledState = newMap.get(entangledId);
        if (entangledState) {
          const updatedEntangledState = {
            ...entangledState,
            entangledWith: entangledState.entangledWith.filter(entId => entId !== id),
          };
          newMap.set(entangledId, updatedEntangledState);
        }
      });
      
      // Clear this component's entanglement
      const updatedState = {
        ...state,
        entangledWith: [],
      };
      newMap.set(id, updatedState);
      
      return newMap;
    });
  }, []);

  const isEntangled = useCallback((id1: string, id2: string) => {
    const state1 = entangledStates.get(id1);
    return state1?.entangledWith.includes(id2) || false;
  }, [entangledStates]);

  const value: QuantumContextType = {
    entangledStates,
    createEntanglement,
    updateEntangledState,
    getEntangledState,
    breakEntanglement,
    isEntangled,
  };

  return (
    <QuantumContext.Provider value={value}>
      {children}
    </QuantumContext.Provider>
  );
}

/**
 * Hook to use the Quantum Context
 */
export function useQuantum() {
  const context = useContext(QuantumContext);
  if (context === undefined) {
    throw new Error('useQuantum must be used within a QuantumProvider');
  }
  return context;
}