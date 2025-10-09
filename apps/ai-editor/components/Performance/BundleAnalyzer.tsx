import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

interface BundleInfo {
  name: string;
  size: number;
  gzippedSize?: number;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
  priority: 'high' | 'medium' | 'low';
  loaded: boolean;
}

interface BundleAnalyzerProps {
  showDetails?: boolean;
  className?: string;
}

const BUNDLE_BUDGET = {
  total: 150 * 1024, // 150KB
  js: 100 * 1024,    // 100KB
  css: 20 * 1024,    // 20KB
  images: 20 * 1024, // 20KB
  fonts: 10 * 1024   // 10KB
};

export default function BundleAnalyzer({ showDetails = false, className = '' }: BundleAnalyzerProps) {
  const [bundles, setBundles] = useState<BundleInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [isWithinBudget, setIsWithinBudget] = useState(true);

  useEffect(() => {
    const analyzeBundles = async () => {
      if (typeof window === 'undefined') return;

      setIsAnalyzing(true);

      try {
        // Get all resource entries
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        const bundleInfo: BundleInfo[] = resources
          .filter(resource => 
            resource.name.includes('.js') || 
            resource.name.includes('.css') || 
            resource.name.includes('.woff') ||
            resource.name.includes('.woff2') ||
            resource.name.includes('.png') ||
            resource.name.includes('.jpg') ||
            resource.name.includes('.jpeg') ||
            resource.name.includes('.svg')
          )
          .map(resource => {
            const url = new URL(resource.name);
            const filename = url.pathname.split('/').pop() || '';
            const extension = filename.split('.').pop()?.toLowerCase() || '';
            
            let type: BundleInfo['type'] = 'other';
            if (['js', 'mjs'].includes(extension)) type = 'js';
            else if (extension === 'css') type = 'css';
            else if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) type = 'font';
            else if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(extension)) type = 'image';

            let priority: BundleInfo['priority'] = 'low';
            if (filename.includes('main') || filename.includes('app')) priority = 'high';
            else if (filename.includes('chunk') || filename.includes('vendor')) priority = 'medium';

            return {
              name: filename,
              size: resource.transferSize || 0,
              type,
              priority,
              loaded: true
            };
          })
          .filter(bundle => bundle.size > 0)
          .sort((a, b) => b.size - a.size);

        setBundles(bundleInfo);

        // Calculate total size
        const total = bundleInfo.reduce((sum, bundle) => sum + bundle.size, 0);
        setTotalSize(total);
        setIsWithinBudget(total <= BUNDLE_BUDGET.total);

      } catch (error) {
        console.error('Bundle analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // Analyze bundles after page load
    const timer = setTimeout(analyzeBundles, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const getTypeColor = (type: BundleInfo['type']) => {
    switch (type) {
      case 'js': return 'text-blue-400';
      case 'css': return 'text-green-400';
      case 'image': return 'text-purple-400';
      case 'font': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: BundleInfo['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSizeColor = (size: number, budget: number) => {
    const percentage = (size / budget) * 100;
    if (percentage > 100) return 'text-red-400';
    if (percentage > 80) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getTypeStats = () => {
    const stats = bundles.reduce((acc, bundle) => {
      if (!acc[bundle.type]) {
        acc[bundle.type] = { count: 0, size: 0 };
      }
      acc[bundle.type].count++;
      acc[bundle.type].size += bundle.size;
      return acc;
    }, {} as Record<string, { count: number; size: number }>);

    return stats;
  };

  const typeStats = getTypeStats();

  if (!showDetails && isWithinBudget) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl max-w-sm max-h-96 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isWithinBudget ? (
              <FiCheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <FiAlertTriangle className="w-5 h-5 text-yellow-400" />
            )}
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              Bundle Analyzer
            </h3>
          </div>
          <FiPackage className="w-4 h-4 text-gray-400" />
        </div>

        {/* Total Size */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Total Size
            </span>
            <span className={`text-sm font-semibold ${getSizeColor(totalSize, BUNDLE_BUDGET.total)}`}>
              {formatSize(totalSize)} / {formatSize(BUNDLE_BUDGET.total)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                totalSize > BUNDLE_BUDGET.total ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((totalSize / BUNDLE_BUDGET.total) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="space-y-2 mb-4">
          {Object.entries(typeStats).map(([type, stats]) => (
            <div key={type} className="flex items-center justify-between">
              <span className={`text-xs capitalize ${getTypeColor(type as BundleInfo['type'])}`}>
                {type} ({stats.count})
              </span>
              <span className="text-xs text-gray-300">
                {formatSize(stats.size)}
              </span>
            </div>
          ))}
        </div>

        {/* Bundle List */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Largest Bundles:
          </div>
          {bundles.slice(0, 5).map((bundle, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`${getTypeColor(bundle.type)}`}>
                  {bundle.type}
                </span>
                <span className="text-gray-300 truncate">
                  {bundle.name}
                </span>
                <span className={`${getPriorityColor(bundle.priority)}`}>
                  {bundle.priority}
                </span>
              </div>
              <span className="text-gray-400 ml-2">
                {formatSize(bundle.size)}
              </span>
            </div>
          ))}
        </div>

        {isAnalyzing && (
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Analyzing bundles...
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}