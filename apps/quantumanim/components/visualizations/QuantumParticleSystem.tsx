'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { QuantumState } from '../../lib/quantum/quantumState';

interface Particle {
  position: [number, number, number];
  velocity: [number, number, number];
  quantumState: QuantumState<string>;
  entangled?: string;
  phase: number;
}

const QuantumParticles: React.FC<{ count: number; isRunning: boolean }> = ({ count, isRunning }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = React.useState<Particle[]>([]);

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const quantumState = new QuantumState({
        states: ['spin-up', 'spin-down'],
        probabilities: [0.5, 0.5]
      });
      
      newParticles.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        velocity: [
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ],
        quantumState,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Create entangled pairs
    for (let i = 0; i < count; i += 2) {
      if (i + 1 < count) {
        newParticles[i].entangled = `pair-${i / 2}`;
        newParticles[i + 1].entangled = `pair-${i / 2}`;
      }
    }

    setParticles(newParticles);
  }, [count]);

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current || !isRunning) return;

    const time = state.clock.getElapsedTime();
    
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        const [x, y, z] = particle.position;
        const [vx, vy, vz] = particle.velocity;

        // Quantum wave function evolution
        const waveFunction = Math.sin(x * 0.1 + time + particle.phase) * 
                           Math.cos(y * 0.1 + time + particle.phase) * 
                           Math.sin(z * 0.1 + time + particle.phase);

        // Update position based on wave function
        const newX = x + vx + waveFunction * 0.01;
        const newY = y + vy + waveFunction * 0.01;
        const newZ = z + vz + waveFunction * 0.01;

        // Entanglement effect
        if (particle.entangled) {
          const entangledParticle = prevParticles.find(p => 
            p.entangled === particle.entangled && p !== particle
          );
          
          if (entangledParticle) {
            // Instant correlation
            const correlation = Math.sin(time * 2) * 0.5;
            return {
              ...particle,
              position: [newX + correlation, newY + correlation, newZ + correlation],
              velocity: [vx, vy, vz]
            };
          }
        }

        return {
          ...particle,
          position: [newX, newY, newZ],
          velocity: [vx, vy, vz]
        };
      })
    );

    // Update Three.js points
    const positions = particles.flatMap(p => p.position);
    pointsRef.current.geometry.setAttribute('position', 
      new THREE.Float32BufferAttribute(positions, 3)
    );
  });

  const positions = useMemo(() => 
    new Float32Array(particles.flatMap(p => p.position)), [particles]
  );

  const colors = useMemo(() => 
    particles.flatMap(p => {
      const state = p.quantumState.isInSuperposition() ? 'superposition' : 'collapsed';
      return state === 'superposition' 
        ? [0, 1, 1] // Cyan for superposition
        : [1, 0, 1]; // Magenta for collapsed
    }), [particles]
  );

  return (
    <Points ref={pointsRef as any} positions={positions}>
      <PointMaterial
        size={0.1}
        color="#00ffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        vertexColors
      />
    </Points>
  );
};

const QuantumField: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const fieldRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!fieldRef.current || !isVisible) return;

    const time = state.clock.getElapsedTime();
    
    // Animate quantum field
    fieldRef.current.rotation.x = time * 0.1;
    fieldRef.current.rotation.y = time * 0.15;
    fieldRef.current.rotation.z = time * 0.05;

    // Pulsing effect
    const scale = 1 + Math.sin(time * 2) * 0.1;
    fieldRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={fieldRef} position={[0, 0, 0]}>
      <sphereGeometry args={[15, 32, 32]} />
      <meshBasicMaterial
        color="#ff00ff"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
};

const QuantumParticleSystem: React.FC = () => {
  const [particleCount, setParticleCount] = React.useState(1000);
  const [isRunning, setIsRunning] = React.useState(false);
  const [showField, setShowField] = React.useState(true);
  const [entanglementStrength, setEntanglementStrength] = React.useState(0.5);

  return (
    <div className="w-full h-full bg-black text-white p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Quantum Particle System
        </h2>
        <p className="text-gray-300">
          Three.js WebGL visualization of quantum particles in superposition and entanglement
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
          >
            {isRunning ? 'Pause' : 'Start'} Simulation
          </button>
          
          <label className="flex items-center space-x-2">
            <span>Particles:</span>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={particleCount}
              onChange={(e) => setParticleCount(Number(e.target.value))}
              className="w-32"
            />
            <span className="w-16 text-sm">{particleCount}</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showField}
              onChange={(e) => setShowField(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Quantum Field</span>
          </label>

          <label className="flex items-center space-x-2">
            <span>Entanglement:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={entanglementStrength}
              onChange={(e) => setEntanglementStrength(Number(e.target.value))}
              className="w-32"
            />
            <span className="w-8 text-sm">{(entanglementStrength * 100).toFixed(0)}%</span>
          </label>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-96 border-2 border-cyan-400 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <QuantumParticles count={particleCount} isRunning={isRunning} />
          {showField && <QuantumField isVisible={showField} />}
          
          <Text
            position={[0, -20, 0]}
            fontSize={2}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
          >
            Quantum Particles in Superposition
          </Text>
          
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
            <span className="font-semibold">Superposition</span>
          </div>
          <p className="text-sm text-gray-400">
            Particles exist in multiple states simultaneously
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
            <span className="font-semibold">Collapsed</span>
          </div>
          <p className="text-sm text-gray-400">
            Particles have definite states after measurement
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
            <span className="font-semibold">Entangled</span>
          </div>
          <p className="text-sm text-gray-400">
            Particles instantaneously affect each other
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantumParticleSystem;