import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useEntanglement } from '../../hooks/useEntanglement';
import { QuantumAnimationEngine } from '../../lib/physics/animationEngine';

export interface EntangledPairProps<T, U> {
  id1: string;
  id2: string;
  states1: T[];
  states2: U[];
  probabilities1?: number[];
  probabilities2?: number[];
  children1: (state: T | null, isEntangled: boolean) => React.ReactNode;
  children2: (state: U | null, isEntangled: boolean) => React.ReactNode;
  className?: string;
  onStateChange?: (id: string, state: T | U) => void;
  onEntanglement?: (isEntangled: boolean) => void;
  showConnection?: boolean;
  connectionColor?: string;
}

/**
 * EntangledPair - Two components that are quantum entangled
 * When one changes, the other instantly reflects the change
 */
export function EntangledPair<T, U>({
  id1,
  id2,
  states1,
  states2,
  probabilities1,
  probabilities2,
  children1,
  children2,
  className = '',
  onStateChange,
  onEntanglement,
  showConnection = true,
  connectionColor = 'rgba(255, 0, 255, 0.6)'
}: EntangledPairProps<T, U>) {
  const element1Ref = useRef<HTMLDivElement>(null);
  const element2Ref = useRef<HTMLDivElement>(null);
  const animationEngineRef = useRef<QuantumAnimationEngine | null>(null);
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  const {
    isEntangled,
    state1,
    state2,
    collapseState1,
    collapseState2,
    resetBoth,
    breakEntanglement,
    createEntanglement
  } = useEntanglement({
    id1,
    id2,
    states1,
    states2,
    probabilities1,
    probabilities2,
    onStateChange,
    onEntanglement
  });

  // Initialize animation engine
  useEffect(() => {
    if (!animationEngineRef.current) {
      animationEngineRef.current = new QuantumAnimationEngine();
    }
  }, []);

  // Create entanglement animation
  useEffect(() => {
    if (element1Ref.current && element2Ref.current && animationEngineRef.current) {
      animationEngineRef.current.createEntanglementAnimation(
        element1Ref.current,
        element2Ref.current,
        { duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isEntangled]);

  const handleElement1Click = () => {
    if (isEntangled) {
      collapseState1();
    }
  };

  const handleElement2Click = () => {
    if (isEntangled) {
      collapseState2();
    }
  };

  const handleReset = () => {
    resetBoth();
  };

  const handleBreakEntanglement = () => {
    breakEntanglement();
  };

  const handleCreateEntanglement = () => {
    createEntanglement();
  };

  // Entanglement connection animation
  const connectionControls = useAnimation();

  useEffect(() => {
    if (isEntangled) {
      connectionControls.start({
        scaleX: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
      });
    } else {
      connectionControls.start({
        scaleX: 0,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
      });
    }
  }, [isEntangled, connectionControls]);

  return (
    <div className={`entangled-pair relative ${className}`}>
      {/* Entanglement controls */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          <button
            onClick={handleCreateEntanglement}
            disabled={isEntangled}
            className="px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Entangle
          </button>
          <button
            onClick={handleBreakEntanglement}
            disabled={!isEntangled}
            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Disentangle
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Entanglement status indicator */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className={`w-3 h-3 rounded-full ${isEntangled ? 'bg-magenta-400 animate-pulse' : 'bg-gray-400'}`} />
      </div>

      {/* Main content container */}
      <div className="flex items-center justify-center space-x-8 relative">
        {/* Element 1 */}
        <motion.div
          ref={element1Ref}
          className="flex-1 max-w-xs"
          onClick={handleElement1Click}
          animate={controls1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`
            relative p-4 rounded-lg border-2 transition-all duration-300
            ${isEntangled ? 'border-magenta-400 bg-magenta-900/20' : 'border-gray-600 bg-gray-800/20'}
            ${state1 !== null ? 'ring-2 ring-green-400' : ''}
          `}>
            {children1(state1, isEntangled)}
            
            {/* State indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs">
              {state1 !== null ? (
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Entanglement connection line */}
        {showConnection && (
          <motion.div
            className="hidden md:block w-16 h-0.5 relative"
            animate={connectionControls}
            initial={{ scaleX: 0, opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-magenta-400 to-cyan-400"
              style={{
                background: `linear-gradient(90deg, ${connectionColor}, rgba(255, 0, 255, 0.8), ${connectionColor})`
              }}
            />
            
            {/* Quantum particles along connection */}
            {isEntangled && (
              <>
                <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-magenta-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-0 left-3/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
              </>
            )}
          </motion.div>
        )}

        {/* Element 2 */}
        <motion.div
          ref={element2Ref}
          className="flex-1 max-w-xs"
          onClick={handleElement2Click}
          animate={controls2}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`
            relative p-4 rounded-lg border-2 transition-all duration-300
            ${isEntangled ? 'border-magenta-400 bg-magenta-900/20' : 'border-gray-600 bg-gray-800/20'}
            ${state2 !== null ? 'ring-2 ring-green-400' : ''}
          `}>
            {children2(state2, isEntangled)}
            
            {/* State indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs">
              {state2 !== null ? (
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Entanglement info */}
        <div className="mt-4 text-center text-sm text-gray-400">
          {isEntangled ? (
            <span className="text-magenta-400">
              Entangled • Click either element to collapse both
            </span>
          ) : (
            <span className="text-gray-500">
              Disentangled • Click &quot;Entangle&quot; to create quantum correlation
            </span>
          )}
        </div>
    </div>
  );
}