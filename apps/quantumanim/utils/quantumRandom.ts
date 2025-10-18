/**
 * Quantum-inspired random number generation with weighted probabilities
 * Creates more "quantum-like" randomness with superposition states
 */

export interface QuantumState {
  value: number;
  probability: number;
  phase: number;
}

export interface QuantumTransition {
  from: string;
  to: string;
  probability: number;
  duration: number;
}

/**
 * Generate a quantum random number with weighted probability
 * @param weights Array of probability weights for each outcome
 * @returns Index of the selected outcome
 */
export function quantumRandom(weights: number[]): number {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return i;
    }
  }
  
  return weights.length - 1;
}

/**
 * Create a superposition state with multiple possible values
 * @param states Array of possible quantum states
 * @returns Selected state based on quantum probabilities
 */
export function createSuperposition(states: QuantumState[]): QuantumState {
  const weights = states.map(state => state.probability);
  const selectedIndex = quantumRandom(weights);
  return states[selectedIndex];
}

/**
 * Generate quantum transition with probability-based outcomes
 * @param transitions Array of possible transitions
 * @returns Selected transition
 */
export function quantumTransition(transitions: QuantumTransition[]): QuantumTransition {
  const weights = transitions.map(t => t.probability);
  const selectedIndex = quantumRandom(weights);
  return transitions[selectedIndex];
}

/**
 * Create a wave function value for animations
 * @param time Current time
 * @param frequency Wave frequency
 * @param amplitude Wave amplitude
 * @returns Wave function value
 */
export function waveFunction(time: number, frequency: number = 1, amplitude: number = 1): number {
  return amplitude * Math.sin(2 * Math.PI * frequency * time);
}

/**
 * Generate quantum noise for organic-looking animations
 * @param time Current time
 * @param intensity Noise intensity (0-1)
 * @returns Noise value
 */
export function quantumNoise(time: number, intensity: number = 0.1): number {
  return (Math.random() - 0.5) * intensity * Math.sin(time * 0.1);
}

/**
 * Create entangled random values that are correlated
 * @param seed Seed for entanglement
 * @param count Number of entangled values
 * @returns Array of correlated random values
 */
export function createEntangledValues(seed: number, count: number): number[] {
  const values: number[] = [];
  let currentSeed = seed;
  
  for (let i = 0; i < count; i++) {
    // Simple linear congruential generator for entanglement
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    values.push(currentSeed / 4294967296);
  }
  
  return values;
}