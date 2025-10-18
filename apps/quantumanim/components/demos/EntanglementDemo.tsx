import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EntangledPair } from '../quantum/EntangledPair';

export interface EntanglementDemoProps {
  className?: string;
}

/**
 * Quantum Entanglement Demo
 * Demonstrates "spooky action at a distance" in UI components
 */
export function EntanglementDemo({ className = '' }: EntanglementDemoProps) {
  const [entanglementEvents, setEntanglementEvents] = useState<Array<{
    id: string;
    state: string;
    timestamp: number;
  }>>([]);

  const handleStateChange = (id: string, state: unknown) => {
    setEntanglementEvents(prev => [
      ...prev,
      {
        id,
        state: String(state),
        timestamp: Date.now()
      }
    ].slice(-10)); // Keep only last 10 events
  };

  const handleEntanglement = (isEntangled: boolean) => {
    console.log(`Entanglement ${isEntangled ? 'created' : 'broken'}`);
  };

  const clearEvents = () => {
    setEntanglementEvents([]);
  };

  return (
    <div className={`entanglement-demo ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-magenta-400 mb-4">
          Quantum Entanglement
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Two particles become &quot;entangled&quot; when they share quantum properties. 
          When you measure one, the other instantly changes, no matter how far apart they are!
        </p>
      </div>

      {/* Entangled Pair Demo */}
      <div className="mb-8">
        <EntangledPair
          id1="quantum-particle-1"
          id2="quantum-particle-2"
          states1={['spin-up', 'spin-down', 'superposition']}
          states2={['spin-up', 'spin-down', 'superposition']}
          onStateChange={handleStateChange}
          onEntanglement={handleEntanglement}
          className="mb-6"
          children1={(state1, isEntangled) => (
            <div className="text-center">
              <div className="text-2xl mb-2">
                {state1 === 'spin-up' ? '↑' : state1 === 'spin-down' ? '↓' : '↕'}
              </div>
              <div className="text-sm font-semibold">
                {state1 === 'spin-up' ? 'Spin Up' : 
                 state1 === 'spin-down' ? 'Spin Down' : 
                 'Superposition'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Particle 1
              </div>
            </div>
          )}
          children2={(state2, isEntangled) => (
            <div className="text-center">
              <div className="text-2xl mb-2">
                {state2 === 'spin-up' ? '↑' : state2 === 'spin-down' ? '↓' : '↕'}
              </div>
              <div className="text-sm font-semibold">
                {state2 === 'spin-up' ? 'Spin Up' : 
                 state2 === 'spin-down' ? 'Spin Down' : 
                 'Superposition'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Particle 2
              </div>
            </div>
          )}
        />
      </div>

      {/* Entanglement Events Log */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events Log */}
          <motion.div 
            className="p-6 bg-gray-800/50 rounded-lg border border-magenta-400/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-magenta-400">
                Entanglement Events
              </h3>
              <button
                onClick={clearEvents}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {entanglementEvents.length === 0 ? (
                <p className="text-gray-400 text-sm">No events yet. Click the particles above!</p>
              ) : (
                entanglementEvents.map((event, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-cyan-400">
                      {event.id === 'quantum-particle-1' ? 'Particle 1' : 'Particle 2'}
                    </span>
                    <span className="text-magenta-400">
                      {event.state}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quantum Explanation */}
          <motion.div 
            className="p-6 bg-gray-800/50 rounded-lg border border-cyan-400/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">
              Spooky Action at a Distance
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                <strong className="text-magenta-400">Einstein&apos;s Problem:</strong> 
                Einstein called this &quot;spooky action at a distance&quot; because it seemed to violate 
                the speed of light limit.
              </p>
              <p>
                <strong className="text-cyan-400">Quantum Reality:</strong> 
                Entangled particles share a single quantum state. When you measure one, 
                the other instantly &quot;knows&quot; and changes to match.
              </p>
              <p>
                <strong className="text-green-400">No Information Transfer:</strong> 
                While the correlation is instant, no actual information travels faster than light. 
                The randomness prevents faster-than-light communication.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bell's Inequality */}
        <motion.div 
          className="mt-6 p-6 bg-gradient-to-r from-purple-900/30 to-magenta-900/30 rounded-lg border border-purple-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
            <h3 className="text-lg font-semibold text-purple-400 mb-3">
              Bell&apos;s Theorem & Quantum Non-Locality
            </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            John Bell proved that quantum entanglement cannot be explained by local hidden variables. 
            The correlations between entangled particles are stronger than any classical theory allows, 
            proving that quantum mechanics is fundamentally non-local.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-gray-700/50 rounded">
              <div className="font-semibold text-cyan-400 mb-1">Classical Limit</div>
              <div className="text-gray-300">≤ 2.0</div>
            </div>
            <div className="p-3 bg-gray-700/50 rounded">
              <div className="font-semibold text-magenta-400 mb-1">Quantum Reality</div>
              <div className="text-gray-300">≈ 2.8</div>
            </div>
            <div className="p-3 bg-gray-700/50 rounded">
              <div className="font-semibold text-green-400 mb-1">Violation</div>
              <div className="text-gray-300">40% stronger!</div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Experiment */}
        <motion.div 
          className="mt-6 p-6 bg-gray-800/30 rounded-lg border border-gray-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            Try the Experiment
          </h3>
          <div className="text-sm text-gray-400 space-y-2">
            <p>1. Click &quot;Entangle&quot; to create quantum correlation</p>
            <p>2. Click either particle to collapse both states instantly</p>
            <p>3. Notice how the other particle immediately matches</p>
            <p>4. This happens instantly, regardless of distance!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}