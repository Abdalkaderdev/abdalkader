/**
 * Performance Monitoring System for Staging Environment
 * Tracks Core Web Vitals and custom performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface WebVitalsMetric extends PerformanceMetric {
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean;
  private endpoint: string;

  constructor() {
    this.isEnabled = process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';
    this.endpoint = '/api/performance';
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals(metric: WebVitalsMetric): void {
    if (!this.isEnabled) return;

    console.log(`[Performance] ${metric.name}:`, metric.value);
    
    this.metrics.push({
      name: metric.name,
      value: metric.value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Send to analytics endpoint
    this.sendMetric(metric);
  }

  /**
   * Track custom performance metrics
   */
  trackCustomMetric(name: string, value: number, additionalData?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    console.log(`[Performance] ${name}:`, value, additionalData);
    
    this.metrics.push(metric);
    this.sendMetric({ ...metric, ...additionalData });
  }

  /**
   * Track page load performance
   */
  trackPageLoad(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.trackCustomMetric('page-load-time', navigation.loadEventEnd - navigation.fetchStart);
          this.trackCustomMetric('dom-content-loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          this.trackCustomMetric('first-byte', navigation.responseStart - navigation.fetchStart);
        }

        // Track resource loading
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const totalResourceSize = resources.reduce((total, resource: PerformanceResourceTiming) => {
          return total + (resource.transferSize || 0);
        }, 0);

        this.trackCustomMetric('total-resource-size', totalResourceSize);
        this.trackCustomMetric('resource-count', resources.length);
      }, 0);
    });
  }

  /**
   * Track user interactions
   */
  trackInteraction(action: string, element?: string): void {
    if (!this.isEnabled) return;

    this.trackCustomMetric('user-interaction', performance.now(), {
      action,
      element,
      type: 'interaction'
    });
  }

  /**
   * Track bundle size and chunks
   */
  trackBundleMetrics(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Track JavaScript bundle size
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalBundleSize = 0;

    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (src.includes('/_next/static/')) {
        fetch(src, { method: 'HEAD' })
          .then(response => {
            const size = parseInt(response.headers.get('content-length') || '0');
            totalBundleSize += size;
          })
          .catch(() => {
            // Ignore errors for bundle size tracking
          });
      }
    });

    setTimeout(() => {
      this.trackCustomMetric('bundle-size', totalBundleSize);
    }, 1000);
  }

  /**
   * Send metric to analytics endpoint
   */
  private async sendMetric(metric: any): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.warn('[Performance] Failed to send metric:', error);
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    
    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = 0;
      }
      summary[metric.name] += metric.value;
    });

    return summary;
  }

  /**
   * Clear stored metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Web Vitals tracking function for Next.js
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  performanceMonitor.trackWebVitals(metric);
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  performanceMonitor.trackPageLoad();
  performanceMonitor.trackBundleMetrics();

  // Track route changes in Next.js
  if (typeof window !== 'undefined' && 'next' in window) {
    const router = (window as any).next?.router;
    if (router) {
      router.events.on('routeChangeStart', (url: string) => {
        performanceMonitor.trackCustomMetric('route-change-start', performance.now(), { url });
      });
      
      router.events.on('routeChangeComplete', (url: string) => {
        performanceMonitor.trackCustomMetric('route-change-complete', performance.now(), { url });
      });
    }
  }
}

/**
 * Track custom performance markers
 */
export function trackPerformanceMarker(name: string, startTime?: number): void {
  const endTime = performance.now();
  const duration = startTime ? endTime - startTime : endTime;
  
  performanceMonitor.trackCustomMetric(`marker-${name}`, duration);
}