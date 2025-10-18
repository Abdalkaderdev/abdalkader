import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SuperpositionElement } from '../quantum/SuperpositionElement';

export interface SchrodingerDemoProps {
  className?: string;
}

/**
 * Schrödinger's UI Component Demo
 * A component that exists in multiple states until observed (clicked)
 */
export function SchrodingerDemo({ className = '' }: SchrodingerDemoProps) {
  const [observationCount, setObservationCount] = useState(0);
  const [lastObservation, setLastObservation] = useState<string>('');

  const buttonStates = [
    'I am both clicked and unclicked',
    'I exist in superposition',
    'I am in multiple states',
    'I am quantum uncertain',
    'I am in a quantum state'
  ];

  const handleCollapse = (collapsedState: string) => {
    setObservationCount(prev => prev + 1);
    setLastObservation(collapsedState);
  };

  const handleReset = () => {
    setLastObservation('');
  };

  return (
    <div className={`schrodinger-demo ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">
          Schrödinger&apos;s UI Component
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          This button exists in multiple states simultaneously until you observe it by clicking. 
          Just like Schrödinger&apos;s cat, it&apos;s both clicked and unclicked until you look!
        </p>
        
        {/* Observation stats */}
        <div className="flex justify-center space-x-6 text-sm text-gray-400 mb-8">
          <div>
            <span className="text-cyan-400">Observations:</span> {observationCount}
          </div>
          {lastObservation && (
            <div>
              <span className="text-magenta-400">Last result:</span> {lastObservation}
            </div>
          )}
        </div>
      </div>

      {/* Schrödinger Button */}
      <div className="flex justify-center mb-8">
        <SuperpositionElement
          states={buttonStates}
          onCollapse={handleCollapse}
          onReset={handleReset}
          autoCollapse={false}
          className="quantum-glow"
          animationConfig={{
            duration: 3,
            ease: "easeInOut",
            repeat: -1,
            yoyo: true
          }}
        >
          {(state, isSuperposition) => (
            <motion.button
              className={`
                px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300
                ${isSuperposition 
                  ? 'bg-gradient-to-r from-cyan-500 to-magenta-500 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                }
                ${isSuperposition ? 'quantum-glow-intense' : 'shadow-lg'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSuperposition ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>I am both clicked and unclicked</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>{state}</span>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </motion.button>
          )}
        </SuperpositionElement>
      </div>

      {/* Quantum explanation */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before observation */}
          <motion.div 
            className="p-6 bg-gray-800/50 rounded-lg border border-cyan-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              Before Observation (Superposition)
            </h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Component exists in multiple states simultaneously</li>
              <li>• All possible outcomes have probability amplitudes</li>
              <li>• No definite state until measured</li>
              <li>• Visualized as overlapping animations</li>
            </ul>
          </motion.div>

          {/* After observation */}
          <motion.div 
            className="p-6 bg-gray-800/50 rounded-lg border border-green-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              After Observation (Collapse)
            </h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Wave function collapses to definite state</li>
              <li>• Only one outcome becomes reality</li>
              <li>• All other possibilities disappear</li>
              <li>• Observer effect in action</li>
            </ul>
          </motion.div>
        </div>

        {/* Quantum mechanics explanation */}
        <motion.div 
          className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-purple-400 mb-3">
            The Quantum Mystery
          </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              In quantum mechanics, particles can exist in superposition until observed. 
              This is the famous &quot;measurement problem&quot; - the act of observation changes the system. 
              Schrödinger&apos;s cat thought experiment illustrates this by imagining a cat in a box with 
              a quantum device that could kill it. Until you open the box, the cat is both alive and dead!
            </p>
        </motion.div>

        {/* Interactive elements */}
        <div className="mt-6 flex justify-center space-x-4">
          <motion.button
            onClick={() => setObservationCount(0)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Counter
          </motion.button>
          
          <motion.button
            onClick={handleReset}
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 rounded text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset to Superposition
          </motion.button>
        </div>
      </div>
    </div>
  );
}