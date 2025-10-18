import { useState, useEffect, useCallback } from 'react';
import { quantumTransition, QuantumTransition, waveFunction, quantumNoise } from '../utils/quantumRandom';

export interface QuantumTransitionConfig {
  transitions: QuantumTransition[];
  autoTrigger?: boolean;
  triggerInterval?: number;
  waveEffect?: boolean;
  noiseIntensity?: number;
}

export interface QuantumTransitionResult {
  currentTransition: QuantumTransition | null;
  triggerTransition: () => void;
  isTransitioning: boolean;
  waveValue: number;
  noiseValue: number;
}

/**
 * Hook for managing probability-based quantum transitions
 * Creates weighted random animation outcomes
 */
export function useQuantumTransition(config: QuantumTransitionConfig): QuantumTransitionResult {
  const [currentTransition, setCurrentTransition] = useState<QuantumTransition | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [waveValue, setWaveValue] = useState(0);
  const [noiseValue, setNoiseValue] = useState(0);

  const triggerTransition = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Select transition based on quantum probabilities
    const selectedTransition = quantumTransition(config.transitions);
    setCurrentTransition(selectedTransition);
    
    // Reset transition state after duration
    setTimeout(() => {
      setIsTransitioning(false);
    }, selectedTransition.duration);
  }, [config.transitions, isTransitioning]);

  // Wave effect animation
  useEffect(() => {
    if (!config.waveEffect) return;
    
    let animationId: number;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setWaveValue(waveFunction(elapsed, 1, 1));
      setNoiseValue(quantumNoise(elapsed, config.noiseIntensity || 0.1));
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [config.waveEffect, config.noiseIntensity]);

  // Auto-trigger effect
  useEffect(() => {
    if (!config.autoTrigger) return;
    
    const interval = setInterval(() => {
      triggerTransition();
    }, config.triggerInterval || 2000);
    
    return () => clearInterval(interval);
  }, [config.autoTrigger, config.triggerInterval, triggerTransition]);

  return {
    currentTransition,
    triggerTransition,
    isTransitioning,
    waveValue,
    noiseValue,
  };
}