import React, { useState } from 'react';
import Head from 'next/head';
import { QuantumButton } from '../components/QuantumButton';
import { EntangledPair } from '../components/EntangledPair';
import { useQuantumTransition } from '../hooks/useQuantumTransition';
import { QuantumTransition } from '../utils/quantumRandom';

export default function Home() {
  const [buttonClicks, setButtonClicks] = useState(0);
  const [entangledState, setEntangledState] = useState<any>(null);

  // Quantum transition configuration
  const transitionConfig = {
    transitions: [
      { from: 'idle', to: 'pulse', probability: 0.4, duration: 1000 },
      { from: 'idle', to: 'float', probability: 0.3, duration: 1500 },
      { from: 'idle', to: 'wave', probability: 0.3, duration: 2000 },
    ] as QuantumTransition[],
    autoTrigger: true,
    triggerInterval: 3000,
    waveEffect: true,
    noiseIntensity: 0.1,
  };

  const { currentTransition, triggerTransition, isTransitioning, waveValue, noiseValue } = useQuantumTransition(transitionConfig);

  const handleButtonClick = () => {
    setButtonClicks(prev => prev + 1);
  };

  const handleEntangledStateChange = (id: string, value: any) => {
    setEntangledState({ id, value, timestamp: Date.now() });
  };

  return (
    <>
      <Head>
        <title>Quantum Animation System - quantumanim.abdalkader.dev</title>
        <meta name="description" content="Interactive quantum animation system with superposition, entanglement, and probability-based transitions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-dark-900 text-white">
        {/* Background quantum particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="quantum-particle" style={{ top: '20%', left: '10%' }} />
          <div className="quantum-particle" style={{ top: '60%', left: '80%' }} />
          <div className="quantum-particle" style={{ top: '40%', left: '50%' }} />
          <div className="quantum-particle" style={{ top: '80%', left: '20%' }} />
          <div className="quantum-particle" style={{ top: '10%', left: '70%' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 quantum-text-glow">
              Quantum
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-quantum-blue via-quantum-purple to-quantum-pink">
                Animation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience quantum mechanics through interactive animations. 
              Superposition, entanglement, and probability-based transitions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="px-3 py-1 bg-dark-700 rounded-full">Superposition</span>
              <span className="px-3 py-1 bg-dark-700 rounded-full">Entanglement</span>
              <span className="px-3 py-1 bg-dark-700 rounded-full">Probability</span>
              <span className="px-3 py-1 bg-dark-700 rounded-full">Wave Functions</span>
            </div>
          </header>

          {/* Quantum Transition Demo */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 quantum-text-glow">
              Probability-Based Transitions
            </h2>
            <div className="max-w-2xl mx-auto">
              <div 
                className="quantum-wave-effect p-8 rounded-lg quantum-border quantum-glow"
                style={{
                  transform: `translateY(${waveValue * 10}px) translateX(${noiseValue * 5}px)`,
                }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Current Transition: {currentTransition?.to || 'idle'}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Wave Value: {waveValue.toFixed(3)} | Noise: {noiseValue.toFixed(3)}
                  </p>
                  <button
                    onClick={triggerTransition}
                    disabled={isTransitioning}
                    className="px-6 py-3 bg-quantum-purple hover:bg-quantum-pink disabled:opacity-50 rounded-lg transition-colors duration-300"
                  >
                    {isTransitioning ? 'Transitioning...' : 'Trigger Quantum Transition'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Superposition Button Demo */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 quantum-text-glow">
              Superposition Button
            </h2>
            <div className="text-center">
              <p className="text-gray-300 mb-8">
                Click the button to collapse its quantum superposition state
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <QuantumButton
                  onClick={handleButtonClick}
                  className="quantum-glow"
                >
                  Collapse Superposition
                </QuantumButton>
                <QuantumButton
                  onClick={handleButtonClick}
                  autoCollapse={true}
                  className="quantum-glow"
                >
                  Auto-Collapse
                </QuantumButton>
                <QuantumButton
                  onClick={handleButtonClick}
                  className="quantum-glow"
                >
                  Quantum State
                </QuantumButton>
              </div>
              <p className="mt-4 text-gray-400">
                Button clicks: {buttonClicks}
              </p>
            </div>
          </section>

          {/* Entangled Components Demo */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 quantum-text-glow">
              Entangled Components
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-300 text-center mb-8">
                Click either component to see instant entanglement. 
                When one changes, the other mirrors it instantly.
              </p>
              
              <EntangledPair
                id1="quantum-card-1"
                id2="quantum-card-2"
                component1={
                  <div className="p-6 bg-gradient-to-br from-quantum-blue to-quantum-purple rounded-lg quantum-glow cursor-pointer hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">Quantum Card 1</h3>
                    <p className="text-sm opacity-90">Click me to entangle!</p>
                  </div>
                }
                component2={
                  <div className="p-6 bg-gradient-to-br from-quantum-purple to-quantum-pink rounded-lg quantum-glow cursor-pointer hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">Quantum Card 2</h3>
                    <p className="text-sm opacity-90">I mirror the other card!</p>
                  </div>
                }
                onStateChange={handleEntangledStateChange}
                className="relative"
              />
              
              {entangledState && (
                <div className="mt-6 p-4 bg-dark-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Entanglement Status:</h4>
                  <p className="text-sm text-gray-300">
                    Last change: {entangledState.id} at {new Date(entangledState.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Quantum Effects Showcase */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 quantum-text-glow">
              Quantum Effects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="quantum-superposition-effect p-6 bg-dark-800 rounded-lg quantum-border">
                <h3 className="text-lg font-semibold mb-2">Superposition Effect</h3>
                <p className="text-sm text-gray-300">Multiple states existing simultaneously</p>
              </div>
              
              <div className="quantum-wave-effect p-6 bg-dark-800 rounded-lg quantum-border">
                <h3 className="text-lg font-semibold mb-2">Wave Effect</h3>
                <p className="text-sm text-gray-300">Quantum wave propagation</p>
              </div>
              
              <div className="p-6 bg-dark-800 rounded-lg quantum-border quantum-glow">
                <h3 className="text-lg font-semibold mb-2">Quantum Glow</h3>
                <p className="text-sm text-gray-300">Energy field visualization</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-gray-400">
            <p className="mb-4">
              Built with React, TypeScript, and quantum mechanics principles
            </p>
            <p className="text-sm">
              quantumanim.abdalkader.dev • Quantum Animation System
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}