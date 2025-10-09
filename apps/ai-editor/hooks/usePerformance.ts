import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  loadTime: number;
  renderTime: number;
}

interface UsePerformanceOptions {
  enableFPS?: boolean;
  enableMemory?: boolean;
  enableRenderTime?: boolean;
  sampleRate?: number; // How often to sample (in ms)
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    enableFPS = true,
    enableMemory = false,
    enableRenderTime = true,
    sampleRate = 1000
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    loadTime: 0,
    renderTime: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // FPS monitoring
  useEffect(() => {
    if (!enableFPS || !isMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= sampleRate) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enableFPS, isMonitoring, sampleRate]);

  // Memory monitoring
  useEffect(() => {
    if (!enableMemory || !isMonitoring) return;

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
        
        setMetrics(prev => ({
          ...prev,
          memoryUsage
        }));
      }
    };

    const interval = setInterval(measureMemory, sampleRate);
    return () => clearInterval(interval);
  }, [enableMemory, isMonitoring, sampleRate]);

  // Load time measurement
  useEffect(() => {
    const measureLoadTime = () => {
      const loadTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        loadTime: Math.round(loadTime)
      }));
    };

    if (document.readyState === 'complete') {
      measureLoadTime();
    } else {
      window.addEventListener('load', measureLoadTime);
      return () => window.removeEventListener('load', measureLoadTime);
    }
  }, []);

  // Render time measurement
  const measureRenderTime = useCallback((callback: () => void) => {
    if (!enableRenderTime) {
      callback();
      return;
    }

    const startTime = performance.now();
    callback();
    
    // Use requestAnimationFrame to measure after render
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderTime = Math.round(endTime - startTime);
      
      setMetrics(prev => ({
        ...prev,
        renderTime
      }));
    });
  }, [enableRenderTime]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    measureRenderTime
  };
}

// Hook for measuring component performance
export function useComponentPerformance(componentName: string) {
  const { metrics, measureRenderTime } = usePerformance({
    enableFPS: false,
    enableMemory: true,
    enableRenderTime: true
  });

  const logPerformance = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] Performance:`, {
        renderTime: `${metrics.renderTime}ms`,
        memoryUsage: metrics.memoryUsage ? `${metrics.memoryUsage}MB` : 'N/A',
        loadTime: `${metrics.loadTime}ms`
      });
    }
  }, [componentName, metrics]);

  return {
    metrics,
    measureRenderTime,
    logPerformance
  };
}