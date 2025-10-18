/**
 * Wave Function Mathematics and Visualization
 * Implements quantum wave functions, interference, and probability distributions
 */

export interface WaveFunctionConfig {
  amplitude: number;
  frequency: number;
  phase: number;
  wavelength: number;
  direction: { x: number; y: number };
}

export interface InterferencePattern {
  x: number;
  y: number;
  amplitude: number;
  phase: number;
}

export class WaveFunction {
  private config: WaveFunctionConfig;
  private time: number = 0;

  constructor(config: WaveFunctionConfig) {
    this.config = { ...config };
  }

  // Getter methods for accessing configuration
  get amplitude(): number {
    return this.config.amplitude;
  }

  get frequency(): number {
    return this.config.frequency;
  }

  get phase(): number {
    return this.config.phase;
  }

  get wavelength(): number {
    return this.config.wavelength;
  }

  get direction(): { x: number; y: number } {
    return this.config.direction;
  }

  /**
   * Calculate wave function value at position and time
   */
  calculate(x: number, y: number, t: number = this.time): number {
    const { amplitude, frequency, phase, wavelength, direction } = this.config;
    
    // Wave equation: ψ(x,y,t) = A * sin(k·r - ωt + φ)
    const k = (2 * Math.PI) / wavelength; // Wave number
    const omega = 2 * Math.PI * frequency; // Angular frequency
    const r = x * direction.x + y * direction.y; // Position vector dot product
    
    return amplitude * Math.sin(k * r - omega * t + phase);
  }

  /**
   * Calculate probability density |ψ|²
   */
  calculateProbabilityDensity(x: number, y: number, t: number = this.time): number {
    const amplitude = this.calculate(x, y, t);
    return amplitude * amplitude;
  }

  /**
   * Update time for animation
   */
  updateTime(deltaTime: number): void {
    this.time += deltaTime;
  }

  /**
   * Get current time
   */
  getTime(): number {
    return this.time;
  }

  /**
   * Reset time to zero
   */
  resetTime(): void {
    this.time = 0;
  }

  /**
   * Create interference pattern with another wave
   */
  createInterference(other: WaveFunction, x: number, y: number, t: number = this.time): InterferencePattern {
    const wave1 = this.calculate(x, y, t);
    const wave2 = other.calculate(x, y, t);
    
    // Superposition principle: ψ_total = ψ1 + ψ2
    const totalAmplitude = wave1 + wave2;
    
    // Calculate phase of resulting wave
    const phase1 = this.getPhase(x, y, t);
    const phase2 = other.getPhase(x, y, t);
    
    return {
      x,
      y,
      amplitude: totalAmplitude,
      phase: Math.atan2(
        Math.sin(phase1) + Math.sin(phase2),
        Math.cos(phase1) + Math.cos(phase2)
      )
    };
  }

  /**
   * Get phase at position and time
   */
  getPhase(x: number, y: number, t: number = this.time): number {
    const { frequency, phase, wavelength, direction } = this.config;
    const k = (2 * Math.PI) / wavelength;
    const omega = 2 * Math.PI * frequency;
    const r = x * direction.x + y * direction.y;
    
    return k * r - omega * t + phase;
  }

  /**
   * Create standing wave pattern
   */
  createStandingWave(x: number, y: number, t: number = this.time): number {
    const { amplitude, frequency, phase, wavelength, direction } = this.config;
    const k = (2 * Math.PI) / wavelength;
    const omega = 2 * Math.PI * frequency;
    const r = x * direction.x + y * direction.y;
    
    // Standing wave: ψ = A * sin(k·r) * cos(ωt + φ)
    return amplitude * Math.sin(k * r) * Math.cos(omega * t + phase);
  }

  /**
   * Generate wave data for visualization
   */
  generateWaveData(
    width: number, 
    height: number, 
    resolution: number = 1,
    t: number = this.time
  ): Array<{ x: number; y: number; amplitude: number; phase: number }> {
    const data: Array<{ x: number; y: number; amplitude: number; phase: number }> = [];
    
    for (let x = 0; x < width; x += resolution) {
      for (let y = 0; y < height; y += resolution) {
        const amplitude = this.calculate(x, y, t);
        const phase = this.getPhase(x, y, t);
        
        data.push({ x, y, amplitude, phase });
      }
    }
    
    return data;
  }

  /**
   * Create quantum tunneling effect
   */
  createTunnelingEffect(
    x: number, 
    y: number, 
    barrier: { x: number; y: number; width: number; height: number },
    t: number = this.time
  ): number {
    const { amplitude, frequency, phase, wavelength, direction } = this.config;
    
    // Check if position is inside barrier
    const insideBarrier = 
      x >= barrier.x && x <= barrier.x + barrier.width &&
      y >= barrier.y && y <= barrier.y + barrier.height;
    
    if (insideBarrier) {
      // Exponential decay inside barrier (tunneling)
      const distance = Math.sqrt(
        Math.pow(x - barrier.x, 2) + Math.pow(y - barrier.y, 2)
      );
      const decayConstant = 0.1; // Controls tunneling probability
      const tunnelingAmplitude = amplitude * Math.exp(-decayConstant * distance);
      
      return tunnelingAmplitude * Math.sin(2 * Math.PI * frequency * t + phase);
    } else {
      // Normal wave outside barrier
      return this.calculate(x, y, t);
    }
  }

  /**
   * Get wave properties
   */
  getConfig(): WaveFunctionConfig {
    return { ...this.config };
  }

  /**
   * Update wave configuration
   */
  updateConfig(newConfig: Partial<WaveFunctionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clone wave function
   */
  clone(): WaveFunction {
    return new WaveFunction({ ...this.config });
  }
}

/**
 * Quantum Interference Manager
 */
export class QuantumInterference {
  private waves: WaveFunction[] = [];

  /**
   * Add wave to interference pattern
   */
  addWave(wave: WaveFunction): void {
    this.waves.push(wave);
  }

  /**
   * Remove wave from interference pattern
   */
  removeWave(wave: WaveFunction): void {
    const index = this.waves.indexOf(wave);
    if (index > -1) {
      this.waves.splice(index, 1);
    }
  }

  /**
   * Calculate total interference pattern
   */
  calculateInterference(x: number, y: number, t: number): InterferencePattern {
    let totalAmplitude = 0;
    let totalPhase = 0;

    this.waves.forEach(wave => {
      const amplitude = wave.calculate(x, y, t);
      const phase = wave.getPhase(x, y, t);
      
      totalAmplitude += amplitude;
      totalPhase += phase;
    });

    return {
      x,
      y,
      amplitude: totalAmplitude,
      phase: totalPhase / this.waves.length
    };
  }

  /**
   * Generate interference pattern data
   */
  generateInterferenceData(
    width: number,
    height: number,
    resolution: number = 1,
    t: number
  ): Array<{ x: number; y: number; amplitude: number; phase: number }> {
    const data: Array<{ x: number; y: number; amplitude: number; phase: number }> = [];
    
    for (let x = 0; x < width; x += resolution) {
      for (let y = 0; y < height; y += resolution) {
        const interference = this.calculateInterference(x, y, t);
        data.push(interference);
      }
    }
    
    return data;
  }

  /**
   * Get all waves
   */
  getWaves(): WaveFunction[] {
    return [...this.waves];
  }

  /**
   * Clear all waves
   */
  clear(): void {
    this.waves = [];
  }
}