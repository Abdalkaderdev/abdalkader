export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'click' | 'scroll' | 'search' | 'interaction' | 'error' | 'performance';
  domain: string;
  path: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
  userAgent: string;
  referrer?: string;
}

export interface PerformanceMetrics {
  domain: string;
  path: string;
  timestamp: number;
  metrics: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
    domLoad: number;
    windowLoad: number;
  };
  resources: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
  network: {
    connectionType: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

export interface EcosystemAnalytics {
  totalVisitors: number;
  totalPageViews: number;
  averageBounceRate: number;
  topPages: Array<{
    path: string;
    domain: string;
    views: number;
    uniqueVisitors: number;
    bounceRate: number;
  }>;
  topDomains: Array<{
    domain: string;
    visitors: number;
    pageViews: number;
    bounceRate: number;
    growth: number;
  }>;
  userJourney: Array<{
    userId: string;
    path: string;
    domain: string;
    timestamp: number;
    duration: number;
  }>;
  performance: {
    averageFCP: number;
    averageLCP: number;
    averageFID: number;
    averageCLS: number;
  };
}

class AnalyticsManager {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private performanceObserver?: PerformanceObserver;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initialize(): void {
    if (this.isInitialized) return;

    // Initialize performance monitoring
    this.initializePerformanceMonitoring();

    // Track page view on load
    this.trackPageView();

    // Track unload events
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushEvents();
      });
    }

    // Track visibility changes
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushEvents();
        }
      });
    }

    this.isInitialized = true;
  }

  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Observe Core Web Vitals
    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPerformanceMetric(entry);
        }
      });

      // Observe different types of performance entries
      this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  private trackPerformanceMetric(entry: PerformanceEntry): void {
    const metrics: Partial<PerformanceMetrics['metrics']> = {};

    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
        break;
      case 'largest-contentful-paint':
        metrics.lcp = (entry as any).startTime;
        break;
      case 'first-input':
        metrics.fid = (entry as any).processingStart - entry.startTime;
        break;
      case 'layout-shift':
        if (!(entry as any).hadRecentInput) {
          metrics.cls = (entry as any).value;
        }
        break;
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
        metrics.domLoad = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
        metrics.windowLoad = navEntry.loadEventEnd - navEntry.fetchStart;
        break;
    }

    if (Object.keys(metrics).length > 0) {
      this.trackEvent('performance', {
        ...metrics,
        entryType: entry.entryType,
        entryName: entry.name,
      });
    }
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public trackEvent(type: AnalyticsEvent['type'], data: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      domain: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      data,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    };

    this.events.push(event);

    // Send to analytics service (in real implementation)
    this.sendEvent(event);

    // Flush if we have too many events
    if (this.events.length > 100) {
      this.flushEvents();
    }
  }

  public trackPageView(page?: string): void {
    if (typeof window === 'undefined') return;
    
    this.trackEvent('page_view', {
      page: page || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  }

  public trackClick(element: string, context?: string): void {
    this.trackEvent('click', {
      element,
      context,
      x: 0, // Would be actual click coordinates
      y: 0,
    });
  }

  public trackSearch(query: string, results?: number): void {
    this.trackEvent('search', {
      query,
      results,
    });
  }

  public trackError(error: Error, context?: string): void {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  public trackScroll(depth: number): void {
    if (typeof document === 'undefined') return;
    
    this.trackEvent('scroll', {
      depth,
      percentage: Math.round((depth / document.body.scrollHeight) * 100),
    });
  }

  public trackInteraction(action: string, target: string, data?: Record<string, any>): void {
    this.trackEvent('interaction', {
      action,
      target,
      ...data,
    });
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // In a real implementation, this would send to your analytics service
      // For now, we'll just log it
      console.log('Analytics Event:', event);
      
      // Simulate API call
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  private async flushEvents(): Promise<void> {
    if (this.events.length === 0) return;

    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: this.events,
          sessionId: this.sessionId,
          domain: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        }),
      });

      this.events = [];
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
    }
  }

  public async getEcosystemAnalytics(): Promise<EcosystemAnalytics> {
    try {
      const response = await fetch('/api/analytics/ecosystem');
      return await response.json();
    } catch (error) {
      console.error('Failed to get ecosystem analytics:', error);
      return {
        totalVisitors: 0,
        totalPageViews: 0,
        averageBounceRate: 0,
        topPages: [],
        topDomains: [],
        userJourney: [],
        performance: {
          averageFCP: 0,
          averageLCP: 0,
          averageFID: 0,
          averageCLS: 0,
        },
      };
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  public cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    this.flushEvents();
  }
}

// Global analytics instance
export const analytics = new AnalyticsManager();

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackScroll: analytics.trackScroll.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    getEcosystemAnalytics: analytics.getEcosystemAnalytics.bind(analytics),
  };
};

// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void): void => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  analytics.trackEvent('performance', {
    name,
    duration: end - start,
    type: 'custom_measurement',
  });
};

export const measureAsyncPerformance = async (name: string, fn: () => Promise<any>): Promise<any> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  analytics.trackEvent('performance', {
    name,
    duration: end - start,
    type: 'async_measurement',
  });
  
  return result;
};

export default analytics;