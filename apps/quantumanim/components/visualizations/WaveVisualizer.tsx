import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { WaveFunction, QuantumInterference } from '../../lib/quantum/waveFunction';

export interface WaveVisualizerProps {
  width?: number;
  height?: number;
  className?: string;
  showInterference?: boolean;
  showTunneling?: boolean;
  showStandingWave?: boolean;
}

/**
 * Wave Function Visualizer
 * Renders quantum wave functions and interference patterns
 */
export function WaveVisualizer({
  width = 800,
  height = 400,
  className = '',
  showInterference = true,
  showTunneling = false,
  showStandingWave = false
}: WaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(true);
  const [waveType, setWaveType] = useState<'traveling' | 'standing' | 'interference'>('traveling');

  // Create wave functions with useMemo to prevent recreation on every render
  const wave1 = useMemo(() => new WaveFunction({
    amplitude: 1,
    frequency: 0.5,
    phase: 0,
    wavelength: 100,
    direction: { x: 1, y: 0 }
  }), []);

  const wave2 = useMemo(() => new WaveFunction({
    amplitude: 0.8,
    frequency: 0.6,
    phase: Math.PI / 4,
    wavelength: 80,
    direction: { x: -1, y: 0 }
  }), []);

  const interference = useMemo(() => {
    const interferenceInstance = new QuantumInterference();
    interferenceInstance.addWave(wave1);
    interferenceInstance.addWave(wave2);
    return interferenceInstance;
  }, [wave1, wave2]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (waveType === 'traveling') {
        drawTravelingWave(ctx, wave1, width, height);
      } else if (waveType === 'standing') {
        drawStandingWave(ctx, wave1, width, height);
      } else if (waveType === 'interference' && showInterference) {
        drawInterferencePattern(ctx, interference, width, height);
      }

      if (showTunneling) {
        drawTunnelingEffect(ctx, wave1, width, height);
      }

      // Update wave time
      wave1.updateTime(0.016);
      wave2.updateTime(0.016);

      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isAnimating) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, waveType, showInterference, showTunneling, isAnimating, wave1, wave2, interference]);

  const drawTravelingWave = (ctx: CanvasRenderingContext2D, wave: WaveFunction, width: number, height: number) => {
    const centerY = height / 2;
    const points: Array<{ x: number; y: number }> = [];

    // Generate wave points
    for (let x = 0; x < width; x += 2) {
      const amplitude = wave.calculate(x, centerY);
      const y = centerY + amplitude * 50; // Scale amplitude
      points.push({ x, y });
    }

    // Draw wave
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.stroke();

    // Draw probability density
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, centerY);
        ctx.lineTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    // Close the area
    ctx.lineTo(width, centerY);
    ctx.lineTo(0, centerY);
    ctx.closePath();
    ctx.fill();
  };

  const drawStandingWave = (ctx: CanvasRenderingContext2D, wave: WaveFunction, width: number, height: number) => {
    const centerY = height / 2;
    const points: Array<{ x: number; y: number }> = [];

    for (let x = 0; x < width; x += 2) {
      const amplitude = wave.createStandingWave(x, centerY);
      const y = centerY + amplitude * 50;
      points.push({ x, y });
    }

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
    ctx.lineWidth = 2;
    
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.stroke();
  };

  const drawInterferencePattern = (ctx: CanvasRenderingContext2D, interference: QuantumInterference, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x += 2) {
      for (let y = 0; y < height; y += 2) {
        const pattern = interference.calculateInterference(x, y, interference.getWaves()[0].getTime());
        const intensity = Math.abs(pattern.amplitude);
        
        const index = (y * width + x) * 4;
        const hue = (intensity * 360) % 360;
        const { r, g, b } = hslToRgb(hue / 360, 1, 0.5);
        
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = Math.min(255, intensity * 255);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawTunnelingEffect = (ctx: CanvasRenderingContext2D, wave: WaveFunction, width: number, height: number) => {
    const centerY = height / 2;
    const barrier = { x: width * 0.4, y: centerY - 30, width: width * 0.2, height: 60 };

    // Draw barrier
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(barrier.x, barrier.y, barrier.width, barrier.height);

    // Draw tunneling wave
    const points: Array<{ x: number; y: number }> = [];
    for (let x = 0; x < width; x += 2) {
      const amplitude = wave.createTunnelingEffect(x, centerY, barrier);
      const y = centerY + amplitude * 50;
      points.push({ x, y });
    }

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;
    
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.stroke();
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div className={`wave-visualizer ${className}`}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-cyan-400">
          Wave Function Visualization
        </h3>
        
        <div className="flex space-x-2">
          <select
            value={waveType}
            onChange={(e) => setWaveType(e.target.value as any)}
            className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
          >
            <option value="traveling">Traveling Wave</option>
            <option value="standing">Standing Wave</option>
            <option value="interference">Interference</option>
          </select>
          
          <button
            onClick={toggleAnimation}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              isAnimating 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isAnimating ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-600 rounded-lg bg-black"
        />
        
        {/* Wave properties overlay */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded">
          <div>Frequency: {wave1.getConfig().frequency.toFixed(2)} Hz</div>
          <div>Wavelength: {wave1.getConfig().wavelength.toFixed(0)} px</div>
          <div>Phase: {(wave1.getPhase(0, 0) * 180 / Math.PI).toFixed(0)}°</div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-2">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={showInterference}
            onChange={(e) => {/* Handle interference toggle */}}
            className="rounded"
          />
          <span>Show Interference</span>
        </label>
        
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={showTunneling}
            onChange={(e) => {/* Handle tunneling toggle */}}
            className="rounded"
          />
          <span>Show Tunneling</span>
        </label>
      </div>
    </div>
  );
}

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}