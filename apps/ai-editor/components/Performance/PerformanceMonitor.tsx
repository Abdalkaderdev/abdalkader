import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import { usePerformanceBudget } from '../../hooks/usePerformanceBudget';

interface PerformanceMonitorProps {
  showDetails?: boolean;
  className?: string;
}

export default function PerformanceMonitor({ showDetails = false, className = '' }: PerformanceMonitorProps) {
  const { metrics, warnings, budget, isHealthy } = usePerformanceBudget();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatMetric = (value: number | null, unit: string = 'ms') => {
    if (value === null) return 'Loading...';
    return `${value.toFixed(0)}${unit}`;
  };

  const formatBundleSize = (value: number | null) => {
    if (value === null) return 'Loading...';
    return `${(value / 1024).toFixed(1)}KB`;
  };

  const getMetricStatus = (value: number | null, threshold: number, reverse = false) => {
    if (value === null) return 'loading';
    const isGood = reverse ? value <= threshold : value <= threshold;
    return isGood ? 'good' : 'warning';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'loading': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <FiCheckCircle className="w-4 h-4" />;
      case 'warning': return <FiAlertTriangle className="w-4 h-4" />;
      case 'loading': return <FiInfo className="w-4 h-4" />;
      default: return <FiInfo className="w-4 h-4" />;
    }
  };

  if (!showDetails && isHealthy) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl max-w-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <FiCheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <FiAlertTriangle className="w-5 h-5 text-yellow-400" />
            )}
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              Performance Monitor
            </h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiInfo className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Status */}
        <div className="text-xs text-gray-300 mb-3" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {isHealthy ? 'All metrics within budget' : `${warnings.length} warning(s) detected`}
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-3">
            {warnings.map((warning, index) => (
              <div key={index} className="text-xs text-yellow-400 mb-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                • {warning}
              </div>
            ))}
          </div>
        )}

        {/* Detailed Metrics */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-3 border-t border-gray-700"
            >
              {/* LCP */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  LCP
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getStatusColor(getMetricStatus(metrics.lcp, budget.lcp))}`}>
                    {formatMetric(metrics.lcp)}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {budget.lcp}ms
                  </span>
                  {getStatusIcon(getMetricStatus(metrics.lcp, budget.lcp))}
                </div>
              </div>

              {/* FID */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  FID
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getStatusColor(getMetricStatus(metrics.fid, budget.fid))}`}>
                    {formatMetric(metrics.fid)}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {budget.fid}ms
                  </span>
                  {getStatusIcon(getMetricStatus(metrics.fid, budget.fid))}
                </div>
              </div>

              {/* CLS */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  CLS
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getStatusColor(getMetricStatus(metrics.cls, budget.cls))}`}>
                    {metrics.cls ? metrics.cls.toFixed(3) : 'Loading...'}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {budget.cls}
                  </span>
                  {getStatusIcon(getMetricStatus(metrics.cls, budget.cls))}
                </div>
              </div>

              {/* Bundle Size */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  Bundle
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getStatusColor(getMetricStatus(metrics.bundleSize, budget.bundleSize))}`}>
                    {formatBundleSize(metrics.bundleSize)}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {budget.bundleSize / 1024}KB
                  </span>
                  {getStatusIcon(getMetricStatus(metrics.bundleSize, budget.bundleSize))}
                </div>
              </div>

              {/* TTFB */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  TTFB
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getStatusColor(getMetricStatus(metrics.ttfb, budget.ttfb))}`}>
                    {formatMetric(metrics.ttfb)}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {budget.ttfb}ms
                  </span>
                  {getStatusIcon(getMetricStatus(metrics.ttfb, budget.ttfb))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}