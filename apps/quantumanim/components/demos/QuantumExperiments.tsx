'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QuantumState } from '../../lib/quantum/quantumState';
import { WaveFunction } from '../../lib/quantum/waveFunction';

interface ExperimentProps {
  title: string;
  description: string;
  onRun: () => void;
  isRunning: boolean;
  children: React.ReactNode;
}

const ExperimentCard: React.FC<ExperimentProps> = ({ title, description, onRun, isRunning, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-900 border border-cyan-400 rounded-lg p-6"
  >
    <h3 className="text-2xl font-bold text-cyan-400 mb-2">{title}</h3>
    <p className="text-gray-300 mb-4">{description}</p>
    <button
      onClick={onRun}
      disabled={isRunning}
      className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg transition-colors mb-4"
    >
      {isRunning ? 'Running...' : 'Run Experiment'}
    </button>
    {children}
  </motion.div>
);

const DoubleSlitExperiment: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; path: 'left' | 'right' | 'blocked' }>>([]);
  const [interferencePattern, setInterferencePattern] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const runExperiment = () => {
    setIsRunning(true);
    setParticles([]);
    setInterferencePattern([]);

    // Simulate particles going through double slit
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const quantumState = new QuantumState({
          states: ['left-slit', 'right-slit'],
          probabilities: [0.5, 0.5]
        });
        const result = quantumState.observe();
        
        const newParticle = {
          id: i,
          x: result === 'left-slit' ? 150 : 250,
          y: 50,
          path: result as 'left' | 'right'
        };

        setParticles(prev => [...prev, newParticle]);

        // Calculate interference pattern
        const detectorPosition = 400;
        const leftSlitDistance = Math.sqrt((150 - detectorPosition) ** 2 + (50 - 200) ** 2);
        const rightSlitDistance = Math.sqrt((250 - detectorPosition) ** 2 + (50 - 200) ** 2);
        const pathDifference = Math.abs(leftSlitDistance - rightSlitDistance);
        const wavelength = 50;
        const phase = (2 * Math.PI * pathDifference) / wavelength;
        const intensity = Math.cos(phase) ** 2;

        setInterferencePattern(prev => [...prev, intensity]);
      }, i * 50);
    }

    setTimeout(() => setIsRunning(false), 5000);
  };

  return (
    <ExperimentCard
      title="Double-Slit Experiment"
      description="Demonstrates wave-particle duality and quantum interference"
      onRun={runExperiment}
      isRunning={isRunning}
    >
      <div className="relative h-64 bg-black rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={250}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Double slit setup */}
        <div className="absolute left-0 top-0 w-full h-full">
          <div className="absolute left-32 top-20 w-2 h-40 bg-white"></div>
          <div className="absolute left-36 top-20 w-2 h-40 bg-white"></div>
          <div className="absolute left-40 top-20 w-2 h-40 bg-white"></div>
        </div>

        {/* Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            initial={{ x: particle.x, y: particle.y }}
            animate={{ 
              x: 400, 
              y: 200,
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 2, delay: particle.id * 0.05 }}
          />
        ))}

        {/* Interference pattern */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30">
          {interferencePattern.map((intensity, i) => (
            <div
              key={i}
              className="absolute h-full bg-cyan-400"
              style={{
                left: `${i}%`,
                width: '1%',
                opacity: intensity
              }}
            />
          ))}
        </div>
      </div>
    </ExperimentCard>
  );
};

const QuantumEraserExperiment: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [whichPath, setWhichPath] = useState<boolean>(false);
  const [interference, setInterference] = useState<boolean>(false);

  const runExperiment = () => {
    setIsRunning(true);
    
    // Simulate quantum eraser
    setTimeout(() => {
      setWhichPath(true);
      setInterference(false);
    }, 1000);

    setTimeout(() => {
      setWhichPath(false);
      setInterference(true);
    }, 3000);

    setTimeout(() => setIsRunning(false), 5000);
  };

  return (
    <ExperimentCard
      title="Quantum Eraser"
      description="Shows how measurement affects quantum interference"
      onRun={runExperiment}
      isRunning={isRunning}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${whichPath ? 'bg-red-400' : 'bg-gray-600'}`}></div>
          <span>Which-path information: {whichPath ? 'Available' : 'Erased'}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${interference ? 'bg-green-400' : 'bg-gray-600'}`}></div>
          <span>Interference pattern: {interference ? 'Visible' : 'Hidden'}</span>
        </div>

        <div className="h-20 bg-black rounded-lg relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{
              opacity: interference ? [0.3, 0.8, 0.3] : 0,
              scaleX: interference ? [0.5, 1, 0.5] : 0
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </ExperimentCard>
  );
};

const BellTestExperiment: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [correlation, setCorrelation] = useState<number>(0);
  const [violation, setViolation] = useState<boolean>(false);

  const runExperiment = () => {
    setIsRunning(true);
    
    // Simulate Bell test
    let measurements = 0;
    let correlations = 0;
    
    const interval = setInterval(() => {
      // Simulate entangled particles
      const angle1 = Math.random() * Math.PI;
      const angle2 = Math.random() * Math.PI;
      
      // Quantum correlation
      const correlationValue = Math.cos(2 * (angle1 - angle2));
      correlations += correlationValue;
      measurements++;
      
      const avgCorrelation = correlations / measurements;
      setCorrelation(avgCorrelation);
      
      // Check Bell inequality violation
      if (avgCorrelation > 2.828) { // 2√2
        setViolation(true);
      }
      
      if (measurements >= 100) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 100);
  };

  return (
    <ExperimentCard
      title="Bell Test Inequality"
      description="Tests quantum entanglement and non-locality"
      onRun={runExperiment}
      isRunning={isRunning}
    >
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-400">
            {correlation.toFixed(3)}
          </div>
          <div className="text-sm text-gray-400">Correlation Value</div>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${violation ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span>Bell Inequality: {violation ? 'Violated' : 'Not Violated'}</span>
        </div>

        <div className="h-8 bg-gray-800 rounded-lg relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
            style={{ width: `${Math.min(Math.abs(correlation) * 50, 100)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            Classical Limit: 2.0
          </div>
        </div>
      </div>
    </ExperimentCard>
  );
};

const QuantumExperiments: React.FC = () => {
  return (
    <div className="w-full h-full bg-black text-white p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Quantum Experiments
        </h1>
        <p className="text-gray-300 text-lg">
          Interactive demonstrations of fundamental quantum phenomena
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <DoubleSlitExperiment />
        <QuantumEraserExperiment />
        <BellTestExperiment />
      </div>
    </div>
  );
};

export default QuantumExperiments;