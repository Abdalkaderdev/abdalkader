'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Target, Code, Zap, Globe } from 'lucide-react';
import { UnifiedHeader } from '@/components/ecosystem/UnifiedHeader';
import { CrossDomainProvider } from '@/components/ecosystem/CrossDomainProvider';
import { EcosystemAuthProvider } from '@/contexts/EcosystemAuthContext';
import { EEGVisualizer } from '@/components/bci/EEGVisualizer';
import { FocusTrainer } from '@/components/experiments/FocusTrainer';
import { useEEG } from '@/hooks/useEEG';
import { useReducedMotion } from '@/hooks/useAnimations';

type ActiveSection = 'dashboard' | 'experiments' | 'developer' | 'visualizer';

export default function NeuroInterface() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const { 
    isConnected, 
    isRecording, 
    data: eegData, 
    bioState, 
    connect, 
    startRecording, 
    stopRecording 
  } = useEEG();
  const reducedMotion = useReducedMotion();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'experiments', label: 'Experiments', icon: Target },
    { id: 'developer', label: 'Developer', icon: Code },
    { id: 'visualizer', label: 'Visualizer', icon: Brain },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-3xl shadow-lg"
                  animate={reducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="portfolio-hero-text text-white">Neuro Interface Platform</h1>
                  <p className="portfolio-large-text text-purple-400">Brain-Computer Interface Web Platform</p>
                </div>
              </div>
              
              <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience the future of human-computer interaction with real-time bio-signal processing, 
                thought-controlled applications, and neuro-feedback training. Connect your mind to the digital world.
              </p>
            </motion.div>

            {/* Connection Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30 text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isConnected ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <Activity className={`w-6 h-6 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <h3 className="portfolio-medium-text text-white mb-2">EEG Status</h3>
                <p className="portfolio-small-text text-gray-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>

              <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30 text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isRecording ? 'bg-blue-500/20' : 'bg-gray-500/20'
                }`}>
                  <Zap className={`w-6 h-6 ${isRecording ? 'text-blue-400' : 'text-gray-400'}`} />
                </div>
                <h3 className="portfolio-medium-text text-white mb-2">Recording</h3>
                <p className="portfolio-small-text text-gray-300">
                  {isRecording ? 'Active' : 'Inactive'}
                </p>
              </div>

              <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-orange-500/20">
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="portfolio-medium-text text-white mb-2">Focus Level</h3>
                <p className="portfolio-small-text text-gray-300">
                  {bioState ? `${Math.round(bioState.focus * 100)}%` : 'N/A'}
                </p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  className="bg-black/50 rounded-lg p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all text-left group"
                  whileHover={reducedMotion ? {} : { scale: 1.02 }}
                  whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                    <item.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="portfolio-medium-text text-white mb-2">{item.label}</h3>
                  <p className="portfolio-small-text text-gray-400">
                    {item.id === 'dashboard' && 'Real-time neuro metrics and controls'}
                    {item.id === 'experiments' && 'Interactive BCI training games'}
                    {item.id === 'developer' && 'APIs and tools for BCI development'}
                    {item.id === 'visualizer' && 'Live brainwave visualization'}
                  </p>
                </motion.button>
              ))}
            </motion.div>
          </div>
        );

      case 'experiments':
        return <FocusTrainer />;

      case 'visualizer':
        return (
          <EEGVisualizer
            eegData={eegData}
            bioState={bioState}
            showSpectrogram
            showBrainwaves
            showBioState
          />
        );

      case 'developer':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="portfolio-hero-text text-white mb-4">Developer Tools</h2>
              <p className="portfolio-base-text text-gray-300">
                APIs, SDKs, and tools for building BCI applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30">
                <h3 className="portfolio-medium-text text-white mb-4">Real-time Data API</h3>
                <p className="portfolio-small-text text-gray-300 mb-4">
                  Stream EEG data and bio-signals to your applications
                </p>
                <div className="bg-gray-900/50 rounded p-4 font-mono text-sm text-green-400">
                  <pre>{`const eegStream = new EEGStream();
eegStream.on('data', (data) => {
  console.log(data.frequencies);
});`}</pre>
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30">
                <h3 className="portfolio-medium-text text-white mb-4">Neuro Feedback Widgets</h3>
                <p className="portfolio-small-text text-gray-300 mb-4">
                  Pre-built components for neuro-feedback applications
                </p>
                <div className="bg-gray-900/50 rounded p-4 font-mono text-sm text-green-400">
                  <pre>{`<NeuroFeedbackWidget
  type="focus"
  target={0.8}
  onTargetReached={handleSuccess}
/>`}</pre>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <EcosystemAuthProvider>
      <CrossDomainProvider>
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)`
            }} />
          </div>
          
          <div className="relative z-10">
            {/* Unified Header */}
            <UnifiedHeader 
              showSearch 
              showNotifications 
              showUserMenu 
              showEcosystemMap 
            />
            
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6">
              <div className="flex gap-2">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as ActiveSection)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                    whileHover={reducedMotion ? {} : { scale: 1.05 }}
                    whileTap={reducedMotion ? {} : { scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="portfolio-small-text">{item.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </nav>
            
            {/* Main Content */}
            <main className="container mx-auto px-4 pb-12">
              {renderActiveSection()}
            </main>
          </div>
        </div>
      </CrossDomainProvider>
    </EcosystemAuthProvider>
  );
}