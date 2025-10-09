// Performance configuration and optimization utilities

export const PERFORMANCE_CONFIG = {
  // Bundle size limits (in bytes)
  BUNDLE_LIMITS: {
    TOTAL: 150 * 1024,        // 150KB
    JS: 100 * 1024,           // 100KB
    CSS: 20 * 1024,           // 20KB
    IMAGES: 20 * 1024,        // 20KB
    FONTS: 10 * 1024          // 10KB
  },

  // Core Web Vitals thresholds
  CORE_WEB_VITALS: {
    LCP: 2000,                // 2.0s
    FID: 100,                 // 100ms
    CLS: 0.1,                 // 0.1
    FCP: 1800,                // 1.8s
    TTFB: 600                 // 600ms
  },

  // Lazy loading thresholds
  LAZY_LOADING: {
    IMAGE_THRESHOLD: 0.1,     // 10% viewport
    COMPONENT_THRESHOLD: 0.2, // 20% viewport
    MODEL_THRESHOLD: 0.5      // 50% viewport
  },

  // Animation preferences
  ANIMATION: {
    REDUCED_MOTION: 'prefers-reduced-motion: reduce',
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500
    },
    EASING: {
      EASE_OUT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      EASE_IN: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      EASE_IN_OUT: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
    }
  },

  // Browser support
  BROWSER_SUPPORT: {
    CHROME: 90,
    FIREFOX: 88,
    SAFARI: 15,
    EDGE: 90
  }
};

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        this.metrics.set('lcp', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.set('fid', fid);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FID monitoring not supported');
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.set('cls', clsValue);
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }

  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.set('fcp', entry.startTime);
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FCP monitoring not supported');
    }
  }

  private observeTTFB() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        this.metrics.set('ttfb', ttfb);
      }
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  isWithinBudget(): boolean {
    const lcp = this.metrics.get('lcp');
    const fid = this.metrics.get('fid');
    const cls = this.metrics.get('cls');
    const fcp = this.metrics.get('fcp');
    const ttfb = this.metrics.get('ttfb');

    return (
      (!lcp || lcp <= PERFORMANCE_CONFIG.CORE_WEB_VITALS.LCP) &&
      (!fid || fid <= PERFORMANCE_CONFIG.CORE_WEB_VITALS.FID) &&
      (!cls || cls <= PERFORMANCE_CONFIG.CORE_WEB_VITALS.CLS) &&
      (!fcp || fcp <= PERFORMANCE_CONFIG.CORE_WEB_VITALS.FCP) &&
      (!ttfb || ttfb <= PERFORMANCE_CONFIG.CORE_WEB_VITALS.TTFB)
    );
  }

  getWarnings(): string[] {
    const warnings: string[] = [];
    const { CORE_WEB_VITALS } = PERFORMANCE_CONFIG;

    const lcp = this.metrics.get('lcp');
    if (lcp && lcp > CORE_WEB_VITALS.LCP) {
      warnings.push(`LCP ${lcp.toFixed(0)}ms exceeds budget of ${CORE_WEB_VITALS.LCP}ms`);
    }

    const fid = this.metrics.get('fid');
    if (fid && fid > CORE_WEB_VITALS.FID) {
      warnings.push(`FID ${fid.toFixed(0)}ms exceeds budget of ${CORE_WEB_VITALS.FID}ms`);
    }

    const cls = this.metrics.get('cls');
    if (cls && cls > CORE_WEB_VITALS.CLS) {
      warnings.push(`CLS ${cls.toFixed(3)} exceeds budget of ${CORE_WEB_VITALS.CLS}`);
    }

    const fcp = this.metrics.get('fcp');
    if (fcp && fcp > CORE_WEB_VITALS.FCP) {
      warnings.push(`FCP ${fcp.toFixed(0)}ms exceeds budget of ${CORE_WEB_VITALS.FCP}ms`);
    }

    const ttfb = this.metrics.get('ttfb');
    if (ttfb && ttfb > CORE_WEB_VITALS.TTFB) {
      warnings.push(`TTFB ${ttfb.toFixed(0)}ms exceeds budget of ${CORE_WEB_VITALS.TTFB}ms`);
    }

    return warnings;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Bundle size analyzer
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private bundles: Map<string, number> = new Map();

  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  analyzeBundles(): { name: string; size: number; type: string }[] {
    if (typeof window === 'undefined') return [];

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return resources
      .filter(resource => 
        resource.name.includes('.js') || 
        resource.name.includes('.css') || 
        resource.name.includes('.woff') ||
        resource.name.includes('.woff2')
      )
      .map(resource => {
        const url = new URL(resource.name);
        const filename = url.pathname.split('/').pop() || '';
        const extension = filename.split('.').pop()?.toLowerCase() || '';
        
        let type = 'other';
        if (['js', 'mjs'].includes(extension)) type = 'js';
        else if (extension === 'css') type = 'css';
        else if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) type = 'font';

        return {
          name: filename,
          size: resource.transferSize || 0,
          type
        };
      })
      .filter(bundle => bundle.size > 0)
      .sort((a, b) => b.size - a.size);
  }

  getTotalSize(): number {
    const bundles = this.analyzeBundles();
    return bundles.reduce((total, bundle) => total + bundle.size, 0);
  }

  isWithinBudget(): boolean {
    const totalSize = this.getTotalSize();
    return totalSize <= PERFORMANCE_CONFIG.BUNDLE_LIMITS.TOTAL;
  }

  getSizeByType(): Record<string, number> {
    const bundles = this.analyzeBundles();
    return bundles.reduce((acc, bundle) => {
      acc[bundle.type] = (acc[bundle.type] || 0) + bundle.size;
      return acc;
    }, {} as Record<string, number>);
  }

  getWarnings(): string[] {
    const warnings: string[] = [];
    const totalSize = this.getTotalSize();
    const sizeByType = this.getSizeByType();
    const { BUNDLE_LIMITS } = PERFORMANCE_CONFIG;

    if (totalSize > BUNDLE_LIMITS.TOTAL) {
      warnings.push(`Total bundle size ${(totalSize / 1024).toFixed(1)}KB exceeds budget of ${BUNDLE_LIMITS.TOTAL / 1024}KB`);
    }

    if (sizeByType.js > BUNDLE_LIMITS.JS) {
      warnings.push(`JS bundle size ${(sizeByType.js / 1024).toFixed(1)}KB exceeds budget of ${BUNDLE_LIMITS.JS / 1024}KB`);
    }

    if (sizeByType.css > BUNDLE_LIMITS.CSS) {
      warnings.push(`CSS bundle size ${(sizeByType.css / 1024).toFixed(1)}KB exceeds budget of ${BUNDLE_LIMITS.CSS / 1024}KB`);
    }

    if (sizeByType.font > BUNDLE_LIMITS.FONTS) {
      warnings.push(`Font bundle size ${(sizeByType.font / 1024).toFixed(1)}KB exceeds budget of ${BUNDLE_LIMITS.FONTS / 1024}KB`);
    }

    return warnings;
  }
}

// Animation utilities
export const animationUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get appropriate animation duration
  getDuration(type: 'fast' | 'normal' | 'slow' = 'normal'): number {
    if (this.prefersReducedMotion()) return 0;
    return PERFORMANCE_CONFIG.ANIMATION.DURATION[type.toUpperCase() as keyof typeof PERFORMANCE_CONFIG.ANIMATION.DURATION];
  },

  // Get appropriate easing function
  getEasing(type: 'ease-out' | 'ease-in' | 'ease-in-out' = 'ease-out'): string {
    if (this.prefersReducedMotion()) return 'linear';
    return PERFORMANCE_CONFIG.ANIMATION.EASING[type.toUpperCase().replace('-', '_') as keyof typeof PERFORMANCE_CONFIG.ANIMATION.EASING];
  }
};