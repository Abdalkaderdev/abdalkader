import { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-300">Loading experiment...</p>
    </div>
  </div>
);

export default function LazyWrapper({ 
  children, 
  fallback = <DefaultFallback />, 
  className = '' 
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        {children}
      </motion.div>
    </Suspense>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: P) {
    return (
      <LazyWrapper fallback={fallback}>
        <Component {...props} />
      </LazyWrapper>
    );
  };
}

// Lazy load heavy components
export const LazyComputerVisionExperiment = lazy(() => 
  import('./ComputerVisionExperiment').then(module => ({ 
    default: module.default 
  }))
);

export const LazyCodeEditor = lazy(() => 
  import('./CodeEditor').then(module => ({ 
    default: module.default 
  }))
);

export const LazyComponentPreview = lazy(() => 
  import('./ComponentPreview').then(module => ({ 
    default: module.default 
  }))
);

export const LazyAIPrompt = lazy(() => 
  import('./AIPrompt').then(module => ({ 
    default: module.default 
  }))
);