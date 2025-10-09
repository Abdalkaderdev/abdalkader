import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiCpu, FiClock, FiEye, FiEyeOff } from 'react-icons/fi';
import { usePerformance } from '../hooks/usePerformance';

interface PerformanceDashboardProps {
  className?: string;
}

export default function PerformanceDashboard({ className = '' }: PerformanceDashboardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const { metrics, isMonitoring, startMonitoring, stopMonitoring } = usePerformance({
    enableFPS: true,
    enableMemory: true,
    enableRenderTime: true,
    sampleRate: 1000
  });

  useEffect(() => {
    // Auto-start monitoring in development
    if (process.env.NODE_ENV === 'development') {
      startMonitoring();
    }
  }, [startMonitoring]);

  const getFPSColor = (fps: number) => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMemoryColor = (memory?: number) => {
    if (!memory) return 'text-gray-400';
    if (memory < 50) return 'text-green-400';
    if (memory < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-orange-500 hover:bg-orange-600 text-black rounded-full shadow-lg transition-colors"
        title="Show Performance Dashboard"
      >
        <FiActivity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-4 right-4 z-50 ${className}`}
      >
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                Performance
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="p-3 space-y-3"
            >
              {/* FPS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiCpu className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">FPS</span>
                </div>
                <span className={`text-sm font-mono ${getFPSColor(metrics.fps)}`}>
                  {metrics.fps}
                </span>
              </div>

              {/* Memory Usage */}
              {metrics.memoryUsage && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                    <span className="text-sm text-gray-300">Memory</span>
                  </div>
                  <span className={`text-sm font-mono ${getMemoryColor(metrics.memoryUsage)}`}>
                    {metrics.memoryUsage}MB
                  </span>
                </div>
              )}

              {/* Load Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Load</span>
                </div>
                <span className="text-sm font-mono text-gray-300">
                  {metrics.loadTime}ms
                </span>
              </div>

              {/* Render Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                  <span className="text-sm text-gray-300">Render</span>
                </div>
                <span className="text-sm font-mono text-gray-300">
                  {metrics.renderTime}ms
                </span>
              </div>

              {/* Controls */}
              <div className="pt-2 border-t border-gray-700">
                <button
                  onClick={isMonitoring ? stopMonitoring : startMonitoring}
                  className={`w-full px-3 py-1 text-xs rounded transition-colors ${
                    isMonitoring
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}