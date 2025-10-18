/**
 * Quantum Animation Engine
 * Handles physics-based animations using GSAP and Framer Motion
 */

import { gsap } from 'gsap';
import { motion, AnimationControls } from 'framer-motion';
import { QuantumState } from '../quantum/quantumState';
import { WaveFunction } from '../quantum/waveFunction';

export interface AnimationState {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
  blur?: number;
  glow?: number;
  probability?: number;
}

export interface QuantumAnimationConfig {
  duration?: number;
  ease?: string;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  onComplete?: () => void;
}

export class QuantumAnimationEngine {
  private activeAnimations: Map<string, gsap.core.Timeline | gsap.core.Tween> = new Map();
  private quantumStates: Map<string, QuantumState<any>> = new Map();

  /**
   * Create superposition animation - element exists in multiple states
   */
  createSuperpositionAnimation(
    element: HTMLElement,
    states: AnimationState[],
    config: QuantumAnimationConfig = {}
  ): void {
    const { duration = 2, ease = "power2.inOut", repeat = -1, yoyo = true } = config;
    
    // Create quantum state for the element
    const quantumState = new QuantumState({
      states: states.map((_, index) => index),
      probabilities: states.map(state => state.probability || 1 / states.length)
    });

    this.quantumStates.set(element.id || 'default', quantumState);

    // Animate through all possible states
    const timeline = gsap.timeline({ repeat, yoyo });
    
    states.forEach((state, index) => {
      timeline.to(element, {
        x: state.x || 0,
        y: state.y || 0,
        scale: state.scale || 1,
        rotation: state.rotation || 0,
        opacity: state.opacity || 1,
        filter: `blur(${state.blur || 0}px)`,
        boxShadow: state.glow ? `0 0 ${state.glow}px rgba(0, 255, 255, 0.5)` : 'none',
        duration: duration / states.length,
        ease: ease
      });
    });

    this.activeAnimations.set(element.id || 'default', timeline);
  }

  /**
   * Create wave function animation
   */
  createWaveFunctionAnimation(
    canvas: HTMLCanvasElement,
    wave: WaveFunction,
    config: QuantumAnimationConfig = {}
  ): void {
    const { duration = 5, ease = "none" } = config;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Generate wave data
      const waveData = wave.generateWaveData(canvas.width, canvas.height, 2);
      
      // Draw wave function
      this.drawWaveFunction(ctx, waveData, canvas.width, canvas.height);
      
      // Update wave time
      wave.updateTime(0.016); // ~60fps
      
      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Create entanglement animation between two elements
   */
  createEntanglementAnimation(
    element1: HTMLElement,
    element2: HTMLElement,
    config: QuantumAnimationConfig = {}
  ): void {
    const { duration = 0.5, ease = "power2.out" } = config;

    // Create quantum states for both elements
    const state1 = new QuantumState({
      states: ['normal', 'entangled'],
      probabilities: [0.5, 0.5]
    });

    const state2 = new QuantumState({
      states: ['normal', 'entangled'],
      probabilities: [0.5, 0.5]
    });

    // Entangle the states
    state1.entangleWith(state2);

    // Add observers for instant correlation
    state1.addObserver((collapsedState) => {
      if (collapsedState === 'entangled') {
        gsap.to(element1, {
          scale: 1.1,
          boxShadow: "0 0 20px rgba(255, 0, 255, 0.8)",
          duration: duration,
          ease: ease
        });
      }
    });

    state2.addObserver((collapsedState) => {
      if (collapsedState === 'entangled') {
        gsap.to(element2, {
          scale: 1.1,
          boxShadow: "0 0 20px rgba(255, 0, 255, 0.8)",
          duration: duration,
          ease: ease
        });
      }
    });

    this.quantumStates.set(element1.id || 'element1', state1);
    this.quantumStates.set(element2.id || 'element2', state2);
  }

  /**
   * Create quantum tunneling animation
   */
  createTunnelingAnimation(
    element: HTMLElement,
    barrier: { x: number; y: number; width: number; height: number },
    config: QuantumAnimationConfig = {}
  ): void {
    const { duration = 2, ease = "power2.inOut" } = config;

    // Create wave function for tunneling
    const wave = new WaveFunction({
      amplitude: 1,
      frequency: 0.5,
      phase: 0,
      wavelength: 100,
      direction: { x: 1, y: 0 }
    });

    // Animate element through barrier
    const timeline = gsap.timeline();
    
    // Approach barrier
    timeline.to(element, {
      x: barrier.x - 50,
      duration: duration * 0.3,
      ease: "power2.out"
    });

    // Tunneling effect - element becomes semi-transparent and blurs
    timeline.to(element, {
      opacity: 0.3,
      filter: "blur(5px)",
      scale: 0.8,
      duration: duration * 0.4,
      ease: "power2.inOut"
    });

    // Emerge on other side
    timeline.to(element, {
      x: barrier.x + barrier.width + 50,
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      duration: duration * 0.3,
      ease: "power2.out"
    });
  }

  /**
   * Create quantum interference pattern
   */
  createInterferenceAnimation(
    canvas: HTMLCanvasElement,
    waves: WaveFunction[],
    config: QuantumAnimationConfig = {}
  ): void {
    const { duration = 3, ease = "none" } = config;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate interference pattern
      const interferenceData: Array<{ x: number; y: number; amplitude: number }> = [];
      
      for (let x = 0; x < canvas.width; x += 4) {
        for (let y = 0; y < canvas.height; y += 4) {
          let totalAmplitude = 0;
          
          waves.forEach(wave => {
            totalAmplitude += wave.calculate(x, y, wave.getTime());
          });
          
          interferenceData.push({ x, y, amplitude: totalAmplitude });
        }
      }
      
      // Draw interference pattern
      this.drawInterferencePattern(ctx, interferenceData);
      
      // Update all waves
      waves.forEach(wave => wave.updateTime(0.016));
      
      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Create probability cloud animation
   */
  createProbabilityCloudAnimation(
    canvas: HTMLCanvasElement,
    quantumState: QuantumState<any>,
    config: QuantumAnimationConfig = {}
  ): void {
    const { duration = 2, ease = "power2.inOut" } = config;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get state probabilities
      const stateProbs = quantumState.getStateProbabilities();
      
      // Draw probability cloud
      this.drawProbabilityCloud(ctx, stateProbs, canvas.width, canvas.height);
      
      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Draw wave function on canvas
   */
  private drawWaveFunction(
    ctx: CanvasRenderingContext2D,
    waveData: Array<{ x: number; y: number; amplitude: number; phase: number }>,
    width: number,
    height: number
  ): void {
    // Create gradient for wave visualization
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0.8)');

    ctx.fillStyle = gradient;
    
    // Draw wave as filled areas
    waveData.forEach(point => {
      const alpha = Math.abs(point.amplitude);
      const size = alpha * 10;
      
      ctx.globalAlpha = alpha;
      ctx.fillRect(point.x - size/2, point.y - size/2, size, size);
    });
  }

  /**
   * Draw interference pattern on canvas
   */
  private drawInterferencePattern(
    ctx: CanvasRenderingContext2D,
    interferenceData: Array<{ x: number; y: number; amplitude: number }>
  ): void {
    // Create interference pattern visualization
    interferenceData.forEach(point => {
      const intensity = Math.abs(point.amplitude);
      const hue = (intensity * 360) % 360;
      
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${intensity})`;
      ctx.fillRect(point.x, point.y, 4, 4);
    });
  }

  /**
   * Draw probability cloud on canvas
   */
  private drawProbabilityCloud(
    ctx: CanvasRenderingContext2D,
    stateProbs: Array<{ state: any; probability: number }>,
    width: number,
    height: number
  ): void {
    const centerX = width / 2;
    const centerY = height / 2;
    
    stateProbs.forEach((stateProb, index) => {
      const angle = (index / stateProbs.length) * 2 * Math.PI;
      const radius = stateProb.probability * 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Draw probability cloud
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.3, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(0, 255, 255, ${stateProb.probability})`;
      ctx.fill();
    });
  }

  /**
   * Stop all animations
   */
  stopAllAnimations(): void {
    this.activeAnimations.forEach(animation => {
      animation.kill();
    });
    this.activeAnimations.clear();
  }

  /**
   * Stop specific animation
   */
  stopAnimation(elementId: string): void {
    const animation = this.activeAnimations.get(elementId);
    if (animation) {
      animation.kill();
      this.activeAnimations.delete(elementId);
    }
  }

  /**
   * Get quantum state for element
   */
  getQuantumState(elementId: string): QuantumState<any> | undefined {
    return this.quantumStates.get(elementId);
  }

  /**
   * Update quantum state probabilities
   */
  updateQuantumState(elementId: string, newProbabilities: number[]): void {
    const quantumState = this.quantumStates.get(elementId);
    if (quantumState) {
      quantumState.updateProbabilities(newProbabilities);
    }
  }
}