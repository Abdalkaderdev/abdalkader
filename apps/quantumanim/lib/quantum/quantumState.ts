/**
 * Core Quantum State Management
 * Implements quantum superposition, entanglement, and wave function collapse
 */

export interface QuantumStateConfig<T> {
  states: T[];
  probabilities?: number[];
  phase?: number;
  entangled?: boolean;
}

export class QuantumState<T> {
  private states: T[];
  private probabilities: number[];
  private phase: number;
  private collapsed: T | null = null;
  private entangledWith: Set<QuantumState<any>> = new Set();
  private observers: Set<(state: T | null) => void> = new Set();

  constructor(config: QuantumStateConfig<T>) {
    this.states = config.states;
    this.probabilities = config.probabilities || this.generateEqualProbabilities();
    this.phase = config.phase || 0;
    
    // Normalize probabilities
    this.normalizeProbabilities();
  }

  /**
   * Generate equal probabilities for all states
   */
  private generateEqualProbabilities(): number[] {
    return new Array(this.states.length).fill(1 / this.states.length);
  }

  /**
   * Normalize probabilities to sum to 1
   */
  private normalizeProbabilities(): void {
    const sum = this.probabilities.reduce((acc, prob) => acc + prob, 0);
    this.probabilities = this.probabilities.map(prob => prob / sum);
  }

  /**
   * Observe the quantum state - collapses wave function
   */
  observe(): T {
    if (this.collapsed !== null) {
      return this.collapsed;
    }

    // Collapse based on probability distribution
    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < this.states.length; i++) {
      cumulativeProbability += this.probabilities[i];
      if (random <= cumulativeProbability) {
        this.collapsed = this.states[i];
        this.notifyObservers();
        this.notifyEntangledStates();
        return this.collapsed;
      }
    }

    // Fallback to last state
    this.collapsed = this.states[this.states.length - 1];
    this.notifyObservers();
    this.notifyEntangledStates();
    return this.collapsed;
  }

  /**
   * Get current probability of a specific state
   */
  getProbability(state: T): number {
    const index = this.states.indexOf(state);
    return index >= 0 ? this.probabilities[index] : 0;
  }

  /**
   * Get all possible states and their probabilities
   */
  getStateProbabilities(): Array<{ state: T; probability: number }> {
    return this.states.map((state, index) => ({
      state,
      probability: this.probabilities[index]
    }));
  }

  /**
   * Check if state is in superposition
   */
  isInSuperposition(): boolean {
    return this.collapsed === null;
  }

  /**
   * Get current collapsed state
   */
  getCollapsedState(): T | null {
    return this.collapsed;
  }

  /**
   * Reset to superposition state
   */
  reset(): void {
    this.collapsed = null;
    this.notifyObservers();
  }

  /**
   * Create quantum entanglement with another state
   */
  entangleWith(other: QuantumState<any>): void {
    this.entangledWith.add(other);
    other.entangledWith.add(this);
  }

  /**
   * Break entanglement with another state
   */
  disentangleFrom(other: QuantumState<any>): void {
    this.entangledWith.delete(other);
    other.entangledWith.delete(this);
  }

  /**
   * Check if entangled with another state
   */
  isEntangledWith(other: QuantumState<any>): boolean {
    return this.entangledWith.has(other);
  }

  /**
   * Get all entangled states
   */
  getEntangledStates(): QuantumState<any>[] {
    return Array.from(this.entangledWith);
  }

  /**
   * Add observer for state changes
   */
  addObserver(observer: (state: T | null) => void): void {
    this.observers.add(observer);
  }

  /**
   * Remove observer
   */
  removeObserver(observer: (state: T | null) => void): void {
    this.observers.delete(observer);
  }

  /**
   * Notify all observers of state change
   */
  private notifyObservers(): void {
    this.observers.forEach(observer => observer(this.collapsed));
  }

  /**
   * Notify entangled states of collapse
   */
  private notifyEntangledStates(): void {
    this.entangledWith.forEach(entangledState => {
      if (entangledState.isInSuperposition()) {
        // Force collapse of entangled state
        entangledState.observe();
      }
    });
  }

  /**
   * Update probabilities (for dynamic quantum systems)
   */
  updateProbabilities(newProbabilities: number[]): void {
    if (newProbabilities.length !== this.states.length) {
      throw new Error('Probability array length must match states length');
    }
    
    this.probabilities = [...newProbabilities];
    this.normalizeProbabilities();
    
    // Reset to superposition if collapsed
    if (this.collapsed !== null) {
      this.reset();
    }
  }

  /**
   * Get quantum phase
   */
  getPhase(): number {
    return this.phase;
  }

  /**
   * Set quantum phase
   */
  setPhase(phase: number): void {
    this.phase = phase;
  }

  /**
   * Get superposition amplitude for a state
   */
  getAmplitude(state: T): number {
    const index = this.states.indexOf(state);
    if (index < 0) return 0;
    
    const probability = this.probabilities[index];
    return Math.sqrt(probability) * Math.cos(this.phase);
  }

  /**
   * Get complex amplitude for a state
   */
  getComplexAmplitude(state: T): { real: number; imaginary: number } {
    const index = this.states.indexOf(state);
    if (index < 0) return { real: 0, imaginary: 0 };
    
    const probability = this.probabilities[index];
    const amplitude = Math.sqrt(probability);
    
    return {
      real: amplitude * Math.cos(this.phase),
      imaginary: amplitude * Math.sin(this.phase)
    };
  }
}