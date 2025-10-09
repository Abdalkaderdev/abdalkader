import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  bundleSize: number | null;
  isWithinBudget: boolean;
}

interface PerformanceBudget {
  lcp: number; // 2.0s
  fid: number; // 100ms
  cls: number; // 0.1
  fcp: number; // 1.8s
  ttfb: number; // 600ms
  bundleSize: number; // 150KB
}

const PERFORMANCE_BUDGET: PerformanceBudget = {
  lcp: 2000, // 2.0s
  fid: 100,  // 100ms
  cls: 0.1,  // 0.1
  fcp: 1800, // 1.8s
  ttfb: 600, // 600ms
  bundleSize: 150 * 1024 // 150KB
};

export function usePerformanceBudget() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    bundleSize: null,
    isWithinBudget: true
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          const lcp = entry.startTime;
          setMetrics(prev => ({ ...prev, lcp }));
        }
        
        if (entry.entryType === 'first-input') {
          const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
        }
        
        if (entry.entryType === 'layout-shift') {
          const cls = (entry as any).value;
          setMetrics(prev => ({ ...prev, cls }));
        }
        
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          const fcp = entry.startTime;
          setMetrics(prev => ({ ...prev, fcp }));
        }
      }
    });

    // Observe Core Web Vitals
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    // Monitor bundle size
    const checkBundleSize = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const ttfb = navigation.responseStart - navigation.requestStart;
        
        // Estimate bundle size from resource timing
        const resources = performance.getEntriesByType('resource');
        const jsResources = resources.filter((resource: any) => 
          resource.name.includes('.js') && !resource.name.includes('chunk')
        );
        
        const totalJsSize = jsResources.reduce((total: number, resource: any) => {
          return total + (resource.transferSize || 0);
        }, 0);

        setMetrics(prev => ({
          ...prev,
          ttfb,
          bundleSize: totalJsSize
        }));
      }
    };

    // Check bundle size after page load
    const timer = setTimeout(checkBundleSize, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Check if metrics are within budget
  useEffect(() => {
    const newWarnings: string[] = [];
    let isWithinBudget = true;

    if (metrics.lcp && metrics.lcp > PERFORMANCE_BUDGET.lcp) {
      newWarnings.push(`LCP ${metrics.lcp.toFixed(0)}ms exceeds budget of ${PERFORMANCE_BUDGET.lcp}ms`);
      isWithinBudget = false;
    }

    if (metrics.fid && metrics.fid > PERFORMANCE_BUDGET.fid) {
      newWarnings.push(`FID ${metrics.fid.toFixed(0)}ms exceeds budget of ${PERFORMANCE_BUDGET.fid}ms`);
      isWithinBudget = false;
    }

    if (metrics.cls && metrics.cls > PERFORMANCE_BUDGET.cls) {
      newWarnings.push(`CLS ${metrics.cls.toFixed(3)} exceeds budget of ${PERFORMANCE_BUDGET.cls}`);
      isWithinBudget = false;
    }

    if (metrics.fcp && metrics.fcp > PERFORMANCE_BUDGET.fcp) {
      newWarnings.push(`FCP ${metrics.fcp.toFixed(0)}ms exceeds budget of ${PERFORMANCE_BUDGET.fcp}ms`);
      isWithinBudget = false;
    }

    if (metrics.ttfb && metrics.ttfb > PERFORMANCE_BUDGET.ttfb) {
      newWarnings.push(`TTFB ${metrics.ttfb.toFixed(0)}ms exceeds budget of ${PERFORMANCE_BUDGET.ttfb}ms`);
      isWithinBudget = false;
    }

    if (metrics.bundleSize && metrics.bundleSize > PERFORMANCE_BUDGET.bundleSize) {
      const sizeKB = (metrics.bundleSize / 1024).toFixed(1);
      newWarnings.push(`Bundle size ${sizeKB}KB exceeds budget of ${PERFORMANCE_BUDGET.bundleSize / 1024}KB`);
      isWithinBudget = false;
    }

    setWarnings(newWarnings);
    setMetrics(prev => ({ ...prev, isWithinBudget }));
  }, [metrics.lcp, metrics.fid, metrics.cls, metrics.fcp, metrics.ttfb, metrics.bundleSize]);

  return {
    metrics,
    warnings,
    budget: PERFORMANCE_BUDGET,
    isHealthy: metrics.isWithinBudget && warnings.length === 0
  };
}