import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import PortfolioHeader from '../src/components/shared/PortfolioHeader';
import { SchrodingerDemo } from '../components/demos/SchrodingerDemo';
import { EntanglementDemo } from '../components/demos/EntanglementDemo';
import { WaveVisualizer } from '../components/visualizations/WaveVisualizer';
import { SuperpositionElement } from '../components/quantum/SuperpositionElement';
import QuantumSandbox from '../components/demos/QuantumSandbox';
import QuantumExperiments from '../components/demos/QuantumExperiments';
import EducationalMode from '../components/demos/EducationalMode';
import QuantumParticleSystem from '../components/visualizations/QuantumParticleSystem';

export default function Home() {
  const [activeDemo, setActiveDemo] = useState<'schrodinger' | 'entanglement' | 'waves' | 'sandbox' | 'experiments' | 'education' | 'particles'>('schrodinger');
  const [quantumClicks, setQuantumClicks] = useState(0);

  const demos = [
    { id: 'schrodinger', name: 'Schrödinger\'s UI', icon: '🐱' },
    { id: 'entanglement', name: 'Quantum Entanglement', icon: '🔗' },
    { id: 'waves', name: 'Wave Functions', icon: '🌊' },
    { id: 'sandbox', name: 'Quantum Sandbox', icon: '🧪' },
    { id: 'experiments', name: 'Quantum Experiments', icon: '⚛️' },
    { id: 'education', name: 'Educational Mode', icon: '📚' },
    { id: 'particles', name: 'Particle System', icon: '✨' }
  ] as const;

  const handleQuantumClick = () => {
    setQuantumClicks(prev => prev + 1);
  };

  return (
    <>
      <Head>
        <title>Quantum Animation System - quantumanim.abdalkader.dev</title>
        <meta name="description" content="Interactive quantum physics playground with superposition, entanglement, and wave functions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* Portfolio Style Header */}
        <PortfolioHeader 
          appName="Quantum Lab"
          appDescription="Interactive quantum physics playground with superposition, entanglement, and wave functions"
          currentApp="Quantum Lab"
        />
        
        {/* Quantum Field Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
          <div className="quantum-particle" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
          <div className="quantum-particle" style={{ top: '60%', left: '80%', animationDelay: '1s' }} />
          <div className="quantum-particle" style={{ top: '40%', left: '50%', animationDelay: '2s' }} />
          <div className="quantum-particle" style={{ top: '80%', left: '20%', animationDelay: '0.5s' }} />
          <div className="quantum-particle" style={{ top: '10%', left: '70%', animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-6xl mx-auto">
              <motion.h1 
                className="text-7xl md:text-9xl font-bold mb-8 quantum-text-glow"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Quantum
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-400 to-cyan-400"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                >
                  Animation
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Experience quantum physics through interactive animations. 
                Superposition, entanglement, wave functions, and the mysterious world of quantum mechanics.
              </motion.p>

              {/* Quantum Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <SuperpositionElement
                  states={['Explore Quantum World', 'Discover Superposition', 'Experience Entanglement', 'Witness Wave Collapse']}
                  onCollapse={handleQuantumClick}
                  className="quantum-glow-intense"
                  animationConfig={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: -1,
                    yoyo: true
                  }}
                >
                  {(state, isSuperposition) => (
                    <motion.button
                      className="px-12 py-6 text-2xl font-bold rounded-2xl transition-all duration-500"
                      style={{
                        background: isSuperposition 
                          ? 'linear-gradient(45deg, #00FFFF, #FF00FF, #00FFFF)'
                          : 'linear-gradient(45deg, #00FF00, #0080FF, #00FF00)',
                        backgroundSize: isSuperposition ? '200% 200%' : '100% 100%',
                        animation: isSuperposition ? 'gradient-shift 2s ease infinite' : 'none'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSuperposition ? 'I am in Superposition' : state}
                    </motion.button>
                  )}
                </SuperpositionElement>
              </motion.div>

              <motion.p 
                className="mt-8 text-cyan-400 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                Quantum Clicks: {quantumClicks}
              </motion.p>
            </div>
          </section>

          {/* Demo Navigation */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <motion.h2 
                className="text-4xl font-bold text-center mb-12 quantum-text-glow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Quantum Physics Demos
              </motion.h2>

              {/* Demo Tabs */}
              <div className="flex justify-center mb-12">
                <div className="bg-gray-900/50 rounded-2xl p-2 backdrop-blur-sm">
                  {demos.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => setActiveDemo(demo.id as any)}
                      className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                        activeDemo === demo.id
                          ? 'bg-gradient-to-r from-cyan-500 to-magenta-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <span className="mr-2">{demo.icon}</span>
                      {demo.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Demo Content */}
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-[600px]"
              >
                {activeDemo === 'schrodinger' && <SchrodingerDemo />}
                {activeDemo === 'entanglement' && <EntanglementDemo />}
                {activeDemo === 'waves' && (
                  <div className="max-w-6xl mx-auto">
                    <WaveVisualizer 
                      width={800} 
                      height={400}
                      showInterference={true}
                      showTunneling={true}
                    />
                  </div>
                )}
                {activeDemo === 'sandbox' && <QuantumSandbox />}
                {activeDemo === 'experiments' && <QuantumExperiments />}
                {activeDemo === 'education' && <EducationalMode />}
                {activeDemo === 'particles' && <QuantumParticleSystem />}
              </motion.div>
            </div>
          </section>

          {/* Quantum Principles */}
          <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/30">
            <div className="max-w-6xl mx-auto">
              <motion.h2 
                className="text-4xl font-bold text-center mb-16 quantum-text-glow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Quantum Principles
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: 'Superposition',
                    description: 'Objects exist in multiple states simultaneously until observed',
                    icon: '↕️',
                    color: 'from-cyan-400 to-blue-500'
                  },
                  {
                    title: 'Entanglement',
                    description: 'Distant particles instantly affect each other',
                    icon: '🔗',
                    color: 'from-magenta-400 to-pink-500'
                  },
                  {
                    title: 'Wave Collapse',
                    description: 'Measurement forces quantum states to become definite',
                    icon: '💥',
                    color: 'from-green-400 to-emerald-500'
                  },
                  {
                    title: 'Uncertainty',
                    description: 'Some properties cannot be known simultaneously',
                    icon: '❓',
                    color: 'from-purple-400 to-indigo-500'
                  }
                ].map((principle, index) => (
                  <motion.div
                    key={principle.title}
                    className="p-6 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700/50"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${principle.color} flex items-center justify-center text-3xl mb-4`}>
                      {principle.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{principle.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{principle.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-16 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4 quantum-text-glow">
                  Quantum Animation System
                </h3>
                <p className="text-gray-400 mb-6">
                  Built with Next.js 15, TypeScript, Framer Motion, Three.js, and GSAP
                </p>
                <p className="text-sm text-gray-500">
                  quantumanim.abdalkader.dev • Exploring quantum mechanics through interactive animations
                </p>
              </motion.div>
            </div>
          </footer>
        </div>

        <style jsx>{`
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </main>
    </>
  );
}