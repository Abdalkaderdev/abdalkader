'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumState } from '../../lib/quantum/quantumState';
import { WaveFunction } from '../../lib/quantum/waveFunction';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  interactive?: React.ReactNode;
}

const SchrodingerEquationVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (!isAnimating) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw wave function
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 50 * Math.sin((x * 0.02) + time);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw probability density
      ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 50 * Math.sin((x * 0.02) + time);
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      setTime(prev => prev + 0.1);
      requestAnimationFrame(animate);
    };

    animate();
  }, [isAnimating, time]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Schrödinger Equation</h4>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
        >
          {isAnimating ? 'Pause' : 'Animate'}
        </button>
      </div>
      
      <div className="bg-black rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full h-48"
        />
        <div className="mt-2 text-sm text-gray-400">
          <p>Wave function: ψ(x,t) = A·sin(kx - ωt + φ)</p>
          <p>Probability density: |ψ(x,t)|²</p>
        </div>
      </div>
    </div>
  );
};

const ProbabilityDensityVisualizer: React.FC = () => {
  const [particleCount, setParticleCount] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [histogram, setHistogram] = useState<number[]>([]);

  const runSimulation = () => {
    setIsRunning(true);
    const newHistogram = new Array(20).fill(0);
    
    for (let i = 0; i < particleCount; i++) {
      // Simulate quantum measurement
      const quantumState = new QuantumState({
        states: ['position-1', 'position-2', 'position-3'],
        probabilities: [0.3, 0.5, 0.2]
      });
      const result = quantumState.observe();
      
      const binIndex = result === 'position-1' ? 0 : result === 'position-2' ? 1 : 2;
      newHistogram[binIndex * 6 + Math.floor(Math.random() * 6)]++;
    }
    
    setHistogram(newHistogram);
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Probability Density</h4>
        <div className="flex items-center space-x-4">
          <label className="text-sm">
            Particles: 
            <input
              type="number"
              value={particleCount}
              onChange={(e) => setParticleCount(Number(e.target.value))}
              className="ml-2 w-20 px-2 py-1 bg-gray-700 rounded text-white"
              min="10"
              max="1000"
            />
          </label>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {isRunning ? 'Running...' : 'Simulate'}
          </button>
        </div>
      </div>
      
      <div className="bg-black rounded-lg p-4">
        <div className="flex items-end space-x-1 h-32">
          {histogram.map((count, i) => (
            <div
              key={i}
              className="bg-cyan-400 flex-1 min-h-[4px]"
              style={{ height: `${(count / Math.max(...histogram, 1)) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-400">
          <p>Measurement results distribution</p>
          <p>Total measurements: {histogram.reduce((a, b) => a + b, 0)}</p>
        </div>
      </div>
    </div>
  );
};

const HistoricalExperiment: React.FC<{ experiment: string }> = ({ experiment }) => {
  const experiments = {
    'photoelectric': {
      title: 'Photoelectric Effect (Einstein, 1905)',
      description: 'Demonstrated particle nature of light',
      content: (
        <div className="space-y-4">
          <p>Einstein explained the photoelectric effect by proposing that light consists of discrete packets of energy called photons.</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-mono">E = hf</p>
            <p className="text-xs text-gray-400">Energy = Planck constant × frequency</p>
          </div>
        </div>
      )
    },
    'uncertainty': {
      title: 'Uncertainty Principle (Heisenberg, 1927)',
      description: 'Fundamental limit on simultaneous measurement precision',
      content: (
        <div className="space-y-4">
          <p>You cannot simultaneously know both the position and momentum of a particle with perfect precision.</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-mono">Δx · Δp ≥ ℏ/2</p>
            <p className="text-xs text-gray-400">Position uncertainty × Momentum uncertainty ≥ ℏ/2</p>
          </div>
        </div>
      )
    },
    'complementarity': {
      title: 'Complementarity Principle (Bohr, 1927)',
      description: 'Wave and particle aspects are complementary',
      content: (
        <div className="space-y-4">
          <p>Quantum objects exhibit both wave and particle properties, but never simultaneously in the same experiment.</p>
          <div className="flex space-x-4">
            <div className="flex-1 bg-gray-800 p-4 rounded-lg">
              <h5 className="font-semibold text-cyan-400">Wave Nature</h5>
              <p className="text-sm">Interference, diffraction, superposition</p>
            </div>
            <div className="flex-1 bg-gray-800 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-400">Particle Nature</h5>
              <p className="text-sm">Localized energy, discrete interactions</p>
            </div>
          </div>
        </div>
      )
    }
  };

  const exp = experiments[experiment as keyof typeof experiments];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">{exp.title}</h4>
      <p className="text-gray-300">{exp.description}</p>
      {exp.content}
    </div>
  );
};

const EducationalMode: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const lessons: Lesson[] = [
    {
      id: 'superposition',
      title: 'Quantum Superposition',
      description: 'Understanding how particles can exist in multiple states simultaneously',
      content: (
        <div className="space-y-4">
          <p>In quantum mechanics, particles can exist in a superposition of multiple states until measured.</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-mono">|ψ⟩ = α|0⟩ + β|1⟩</p>
            <p className="text-xs text-gray-400">where |α|² + |β|² = 1</p>
          </div>
          <p>When measured, the particle collapses to one definite state with probability |α|² for |0⟩ and |β|² for |1⟩.</p>
        </div>
      ),
      interactive: <SchrodingerEquationVisualizer />
    },
    {
      id: 'entanglement',
      title: 'Quantum Entanglement',
      description: 'The mysterious connection between quantum particles',
      content: (
        <div className="space-y-4">
          <p>Entangled particles share a quantum state and instantaneously affect each other, regardless of distance.</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-mono">|ψ⟩ = (1/√2)(|00⟩ + |11⟩)</p>
            <p className="text-xs text-gray-400">Bell state - maximally entangled</p>
          </div>
          <p>Einstein called this &quot;spooky action at a distance&quot; - but it&apos;s real and has been experimentally verified!</p>
        </div>
      )
    },
    {
      id: 'measurement',
      title: 'Quantum Measurement',
      description: 'How observation changes quantum reality',
      content: (
        <div className="space-y-4">
          <p>Measurement in quantum mechanics is fundamentally different from classical measurement.</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Measurement causes wave function collapse</li>
            <li>Outcome is probabilistic, not deterministic</li>
            <li>Observer effect: measurement changes the system</li>
            <li>No hidden variables (Bell&apos;s theorem)</li>
          </ul>
        </div>
      ),
      interactive: <ProbabilityDensityVisualizer />
    },
    {
      id: 'history',
      title: 'Historical Experiments',
      description: 'Key discoveries that shaped quantum mechanics',
      content: <HistoricalExperiment experiment="photoelectric" />
    }
  ];

  return (
    <div className="w-full h-full bg-black text-white p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Educational Mode
        </h1>
        <p className="text-gray-300 text-lg">
          Learn quantum mechanics through interactive lessons and visualizations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lesson Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLesson(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentLesson === index
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-xs opacity-75">{lesson.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={currentLesson}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              {lessons[currentLesson].title}
            </h2>
            
            <div className="space-y-6">
              {lessons[currentLesson].content}
              
              {lessons[currentLesson].interactive && (
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
                  {lessons[currentLesson].interactive}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EducationalMode;