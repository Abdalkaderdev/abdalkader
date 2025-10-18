/**
 * Performance Monitoring System for Staging Environment
 * Tracks Core Web Vitals and custom performance metrics
 */

import { getFeatureFlag } from './feature-flags';
import { getEnvironment } from '../utils/environment';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

// Interface for Web Vitals (currently unused but kept for future use)
// interface WebVitals {
//   CLS: number;
//   FID: number;
//   FCP: number;
//   LCP: number;
//   TTFB: number;
// }

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = getFeatureFlag('enablePerformanceMonitoring');
    if (this.isEnabled) {
      this.init();
    }
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    this.trackWebVitals();
    
    // Track custom metrics
    this.trackCustomMetrics();
    
    // Track page load performance
    this.trackPageLoad();
    
    // Track resource loading
    this.trackResourceTiming();
  }

  private trackWebVitals(): void {
    // Using the web-vitals library would be ideal here
    // For now, we'll track basic performance metrics
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric({
          name: entry.name,
          value: entry.duration,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }

  private trackCustomMetrics(): void {
    // Track component render times
    const originalConsoleTime = console.time;
    const originalConsoleTimeEnd = console.timeEnd;

    console.time = (label: string) => {
      originalConsoleTime(label);
      performance.mark(`${label}-start`);
    };

    console.timeEnd = (label: string) => {
      originalConsoleTimeEnd(label);
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
    };
  }

  private trackPageLoad(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.recordMetric({
          name: 'page-load-time',
          value: navigation.loadEventEnd - navigation.fetchStart,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        this.recordMetric({
          name: 'dom-content-loaded',
          value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        this.recordMetric({
          name: 'first-byte',
          value: navigation.responseStart - navigation.fetchStart,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
      }
    });
  }

  private trackResourceTiming(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Track slow resources
          if (resourceEntry.duration > 1000) {
            this.recordMetric({
              name: 'slow-resource',
              value: resourceEntry.duration,
              timestamp: Date.now(),
              url: resourceEntry.name,
              userAgent: navigator.userAgent,
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log to console in development
    if (getFeatureFlag('enableConsoleLogging')) {
      console.log('📊 Performance Metric:', metric);
    }

    // Send to analytics service in production
    this.sendToAnalytics(metric);
  }

  private sendToAnalytics(metric: PerformanceMetric): void {
    // In a real implementation, you would send this to your analytics service
    // For staging, we'll just log it
    if (getEnvironment() === 'staging') {
      // This would typically be sent to services like:
      // - Google Analytics
      // - DataDog
      // - New Relic
      // - Custom analytics endpoint
      console.log('📈 Analytics Event:', metric);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getAverageMetric(metricName: string): number {
    const metrics = this.metrics.filter(m => m.name === metricName);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  public exportMetrics(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      metrics: this.metrics,
      summary: {
        totalMetrics: this.metrics.length,
        averagePageLoad: this.getAverageMetric('page-load-time'),
        averageDOMContentLoaded: this.getAverageMetric('dom-content-loaded'),
        slowResources: this.metrics.filter(m => m.name === 'slow-resource').length,
      }
    }, null, 2);
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Development helper
export function getPerformanceDashboard(): void {
  if (getFeatureFlag('enableConsoleLogging')) {
    console.group('📊 Performance Dashboard');
    console.log('Total Metrics:', performanceMonitor.getMetrics().length);
    console.log('Average Page Load:', performanceMonitor.getAverageMetric('page-load-time').toFixed(2) + 'ms');
    console.log('Average DOM Content Loaded:', performanceMonitor.getAverageMetric('dom-content-loaded').toFixed(2) + 'ms');
    console.log('Export Data:', performanceMonitor.exportMetrics());
    console.groupEnd();
  }
}