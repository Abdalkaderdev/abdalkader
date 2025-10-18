'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useDrag } from 'use-gesture'; // Replaced with custom drag implementation
import { QuantumState } from '../../lib/quantum/quantumState';
import { WaveFunction } from '../../lib/quantum/waveFunction';

interface QuantumElement {
  id: string;
  type: 'particle' | 'barrier' | 'detector' | 'source';
  position: { x: number; y: number };
  quantumState?: QuantumState<string>;
  waveFunction?: WaveFunction;
  entangled?: string[];
}

const QuantumSandbox: React.FC = () => {
  const [elements, setElements] = useState<QuantumElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [probabilityField, setProbabilityField] = useState<number[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Create quantum element
  const createElement = useCallback((type: QuantumElement['type'], x: number, y: number) => {
    const id = `${type}-${Date.now()}`;
    const newElement: QuantumElement = {
      id,
      type,
      position: { x, y },
    };

    if (type === 'particle') {
      newElement.quantumState = new QuantumState({
        states: ['spin-up', 'spin-down'],
        probabilities: [0.5, 0.5]
      });
    } else if (type === 'source') {
      newElement.waveFunction = new WaveFunction({
        amplitude: 1,
        frequency: 0.1,
        phase: 0,
        wavelength: 50,
        direction: { x: 1, y: 0 }
      });
    }

    setElements(prev => [...prev, newElement]);
  }, []);

  // Drag handler
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (elementId: string, event: React.MouseEvent) => {
    setDraggedElement(elementId);
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setDragOffset({
        x: event.clientX - element.position.x,
        y: event.clientY - element.position.y
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (draggedElement) {
      setElements(prev => prev.map(el => 
        el.id === draggedElement 
          ? { 
              ...el, 
              position: { 
                x: event.clientX - dragOffset.x, 
                y: event.clientY - dragOffset.y 
              } 
            }
          : el
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  // Calculate probability field
  const calculateProbabilityField = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const field: number[][] = [];

    for (let x = 0; x < width; x += 10) {
      field[x] = [];
      for (let y = 0; y < height; y += 10) {
        let probability = 0;
        
        elements.forEach(element => {
          if (element.waveFunction) {
            const waveValue = element.waveFunction.calculate(x, y);
            probability += Math.abs(waveValue) ** 2;
          }
        });

        field[x][y] = Math.min(probability, 1);
      }
    }

    setProbabilityField(field);
  }, [elements]);

  // Render probability field
  const renderProbabilityField = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    probabilityField.forEach((row, x) => {
      row.forEach((prob, y) => {
        if (prob > 0) {
          ctx.fillStyle = `rgba(0, 255, 255, ${prob * 0.3})`;
          ctx.fillRect(x * 10, y * 10, 10, 10);
        }
      });
    });
  }, [probabilityField]);

  // Run quantum simulation
  const runSimulation = useCallback(() => {
    setIsRunning(true);
    calculateProbabilityField();
    
    // Animate quantum states
    elements.forEach(element => {
      if (element.quantumState && element.quantumState.isInSuperposition()) {
        // Simulate wave function evolution
        setTimeout(() => {
          element.quantumState?.observe();
        }, Math.random() * 2000);
      }
    });
  }, [elements, calculateProbabilityField]);

  return (
    <div className="w-full h-full bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Quantum Sandbox
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => createElement('particle', 100, 100)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
          >
            Add Particle
          </button>
          <button
            onClick={() => createElement('barrier', 200, 200)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Add Barrier
          </button>
          <button
            onClick={() => createElement('detector', 300, 300)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Add Detector
          </button>
          <button
            onClick={() => createElement('source', 50, 50)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
          >
            Add Source
          </button>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      <div className="relative w-full h-96 border-2 border-cyan-400 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="absolute inset-0 w-full h-full"
        />
        
        <div
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <AnimatePresence>
            {elements.map(element => (
              <motion.div
                key={element.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`absolute w-8 h-8 rounded-full cursor-move ${
                  element.type === 'particle' ? 'bg-cyan-400' :
                  element.type === 'barrier' ? 'bg-purple-400' :
                  element.type === 'detector' ? 'bg-green-400' :
                  'bg-yellow-400'
                } ${selectedElement === element.id ? 'ring-2 ring-white' : ''}`}
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseDown={(e) => handleMouseDown(element.id, e)}
                onClick={() => setSelectedElement(element.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
              {element.quantumState?.isInSuperposition() && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {selectedElement && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Element Properties</h3>
          {(() => {
            const element = elements.find(el => el.id === selectedElement);
            if (!element) return null;

            return (
              <div className="space-y-2">
                <p><strong>Type:</strong> {element.type}</p>
                <p><strong>Position:</strong> ({element.position.x}, {element.position.y})</p>
                {element.quantumState && (
                  <div>
                    <p><strong>Quantum State:</strong></p>
                    <div className="ml-4 space-y-1">
                      {element.quantumState.getStateProbabilities().map(({ state, probability }) => (
                        <p key={state} className="text-sm">
                          {state}: {(probability * 100).toFixed(1)}%
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {element.waveFunction && (
                  <div>
                    <p><strong>Wave Function:</strong> Active</p>
                    <p className="text-sm">Amplitude: {element.waveFunction.amplitude}</p>
                    <p className="text-sm">Frequency: {element.waveFunction.frequency}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default QuantumSandbox;