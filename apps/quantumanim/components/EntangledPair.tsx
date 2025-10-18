import React, { useState, useEffect } from 'react';
import { useQuantum } from '../context/QuantumContext';

export interface EntangledComponentProps {
  id: string;
  entangledWith: string;
  children: React.ReactNode;
  className?: string;
  onStateChange?: (value: any) => void;
}

/**
 * Individual entangled component
 * Automatically mirrors the state of its entangled partner
 */
export function EntangledComponent({
  id,
  entangledWith,
  children,
  className = '',
  onStateChange,
}: EntangledComponentProps) {
  const { createEntanglement, updateEntangledState, getEntangledState, isEntangled } = useQuantum();
  const [localState, setLocalState] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Create entanglement on mount
  useEffect(() => {
    createEntanglement(id, entangledWith);
  }, [id, entangledWith, createEntanglement]);

  // Listen for entangled state changes
  useEffect(() => {
    const checkEntangledState = () => {
      const entangledState = getEntangledState(id);
      if (entangledState && entangledState.value !== localState) {
        setLocalState(entangledState.value);
        onStateChange?.(entangledState.value);
        setIsUpdating(true);
        
        // Reset updating state after animation
        setTimeout(() => setIsUpdating(false), 300);
      }
    };

    const interval = setInterval(checkEntangledState, 50);
    return () => clearInterval(interval);
  }, [id, localState, getEntangledState, onStateChange]);

  const handleInteraction = (newValue: any) => {
    setLocalState(newValue);
    updateEntangledState(id, newValue);
    onStateChange?.(newValue);
    setIsUpdating(true);
    
    setTimeout(() => setIsUpdating(false), 300);
  };

  return (
    <div
      className={`
        relative transition-all duration-300 ease-out
        ${isUpdating ? 'animate-quantum-collapse' : ''}
        ${isEntangled(id, entangledWith) ? 'ring-2 ring-quantum-blue ring-opacity-50' : ''}
        ${className}
      `}
      onClick={() => handleInteraction(!localState)}
    >
      {children}
    </div>
  );
}

export interface EntangledPairProps {
  id1: string;
  id2: string;
  component1: React.ReactNode;
  component2: React.ReactNode;
  className?: string;
  onStateChange?: (id: string, value: any) => void;
}

/**
 * Pair of entangled components that mirror each other
 * When one changes, the other instantly reflects the change
 */
export function EntangledPair({
  id1,
  id2,
  component1,
  component2,
  className = '',
  onStateChange,
}: EntangledPairProps) {
  const { createEntanglement, isEntangled } = useQuantum();
  const [isEntangledActive, setIsEntangledActive] = useState(false);

  // Create entanglement between the two components
  useEffect(() => {
    createEntanglement(id1, id2);
    setIsEntangledActive(isEntangled(id1, id2));
  }, [id1, id2, createEntanglement, isEntangled]);

  const handleStateChange1 = (value: any) => {
    onStateChange?.(id1, value);
  };

  const handleStateChange2 = (value: any) => {
    onStateChange?.(id2, value);
  };

  return (
    <div className={`entangled-pair ${className}`}>
      {/* Entanglement indicator */}
      {isEntangledActive && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-4 h-4 bg-quantum-blue rounded-full animate-quantum-pulse" />
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-8">
        <EntangledComponent
          id={id1}
          entangledWith={id2}
          onStateChange={handleStateChange1}
          className="flex-1 max-w-xs"
        >
          {component1}
        </EntangledComponent>
        
        {/* Entanglement connection line */}
        <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-quantum-blue to-quantum-purple animate-quantum-pulse" />
        
        <EntangledComponent
          id={id2}
          entangledWith={id1}
          onStateChange={handleStateChange2}
          className="flex-1 max-w-xs"
        >
          {component2}
        </EntangledComponent>
      </div>
    </div>
  );
}