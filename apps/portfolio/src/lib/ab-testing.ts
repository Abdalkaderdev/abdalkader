/**
 * A/B Testing Framework for Staging Environment
 * Enables experimentation with different features and UI variations
 */

import { getFeatureFlag } from './feature-flags';

interface Experiment {
  id: string;
  name: string;
  variants: {
    [key: string]: {
      name: string;
      weight: number;
      config: Record<string, unknown>;
    };
  };
  isActive: boolean;
  startDate: number;
  endDate?: number;
}

interface ExperimentResult {
  experimentId: string;
  variant: string;
  userId: string;
  sessionId: string;
  timestamp: number;
  events: {
    [eventName: string]: {
      count: number;
      lastTriggered: number;
    };
  };
}

class ABTestingFramework {
  private experiments: Experiment[] = [];
  private results: ExperimentResult[] = [];
  private userId: string;
  private sessionId: string;
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = getFeatureFlag('enableABTesting');
    this.userId = this.generateUserId();
    this.sessionId = this.generateSessionId();
    
    if (this.isEnabled) {
      this.init();
      this.loadExperiments();
    }
  }

  private generateUserId(): string {
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('ab-testing-user-id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('ab-testing-user-id', userId);
      }
      return userId;
    }
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Track page views
    this.trackEvent('page_view', { url: window.location.href });
    
    // Track user interactions
    this.setupInteractionTracking();
  }

  private loadExperiments(): void {
    // In a real implementation, these would be loaded from a remote service
    // For staging, we'll define some example experiments
    this.experiments = [
      {
        id: 'header-design',
        name: 'Header Design A/B Test',
        variants: {
          control: {
            name: 'Original Header',
            weight: 50,
            config: {
              showLogo: true,
              navigationStyle: 'horizontal',
              backgroundColor: 'transparent'
            }
          },
          variant_a: {
            name: 'New Header Design',
            weight: 50,
            config: {
              showLogo: true,
              navigationStyle: 'vertical',
              backgroundColor: 'rgba(0,0,0,0.1)'
            }
          }
        },
        isActive: true,
        startDate: Date.now(),
      },
      {
        id: 'cta-button',
        name: 'Call-to-Action Button Test',
        variants: {
          control: {
            name: 'Blue Button',
            weight: 33,
            config: {
              color: '#3b82f6',
              text: 'Get Started',
              size: 'medium'
            }
          },
          variant_a: {
            name: 'Green Button',
            weight: 33,
            config: {
              color: '#10b981',
              text: 'Start Now',
              size: 'medium'
            }
          },
          variant_b: {
            name: 'Large Button',
            weight: 34,
            config: {
              color: '#3b82f6',
              text: 'Get Started',
              size: 'large'
            }
          }
        },
        isActive: true,
        startDate: Date.now(),
      }
    ];
  }

  private setupInteractionTracking(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackEvent('click', {
        element: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.substring(0, 100)
      });
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackEvent('form_submit', {
        formId: form.id,
        action: form.action,
        method: form.method
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.trackEvent('scroll_depth', { percent: scrollPercent });
      }
    });
  }

  public getVariant(experimentId: string): string | null {
    if (!this.isEnabled) return null;

    const experiment = this.experiments.find(e => e.id === experimentId && e.isActive);
    if (!experiment) return null;

    // Check if user is already assigned to a variant
    const existingResult = this.results.find(r => 
      r.experimentId === experimentId && r.userId === this.userId
    );

    if (existingResult) {
      return existingResult.variant;
    }

    // Assign user to a variant based on weights
    const variant = this.assignVariant(experiment);
    
    // Record the assignment
    this.recordExperimentResult(experimentId, variant);
    
    return variant;
  }

  private assignVariant(experiment: Experiment): string {
    const random = Math.random() * 100;
    let cumulativeWeight = 0;

    for (const [variantId, variant] of Object.entries(experiment.variants)) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        return variantId;
      }
    }

    // Fallback to first variant
    return Object.keys(experiment.variants)[0];
  }

  private recordExperimentResult(experimentId: string, variant: string): void {
    const result: ExperimentResult = {
      experimentId,
      variant,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      events: {}
    };

    this.results.push(result);
    this.saveResults();
  }

  public trackEvent(eventName: string, properties: Record<string, unknown> = {}): void {
    if (!this.isEnabled) return;

    // Add event to all active experiments for this user
    this.results.forEach(result => {
      if (!result.events[eventName]) {
        result.events[eventName] = {
          count: 0,
          lastTriggered: 0
        };
      }
      
      result.events[eventName].count++;
      result.events[eventName].lastTriggered = Date.now();
    });

    // Log to console in development
    if (getFeatureFlag('enableConsoleLogging')) {
      console.log('🧪 A/B Test Event:', { eventName, properties });
    }

    // Send to analytics
    this.sendToAnalytics(eventName, properties);
  }

  private sendToAnalytics(eventName: string, properties: Record<string, unknown>): void {
    // In a real implementation, you would send this to analytics services
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
      console.log('📊 Analytics Event:', { eventName, properties, userId: this.userId });
    }
  }

  private saveResults(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ab-testing-results', JSON.stringify(this.results));
    }
  }

  public loadResults(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ab-testing-results');
      if (stored) {
        try {
          this.results = JSON.parse(stored);
        } catch {
          console.warn('Failed to load A/B testing results');
        }
      }
    }
  }

  public getExperimentConfig(experimentId: string, variant: string): Record<string, unknown> | null {
    const experiment = this.experiments.find(e => e.id === experimentId);
    if (!experiment || !experiment.variants[variant]) return null;

    return experiment.variants[variant].config;
  }

  public getExperimentResults(experimentId: string): {
    totalUsers: number;
      variants: Record<string, {
        users: number;
        events: Record<string, number>;
      }>;
  } {
    const experimentResults = this.results.filter(r => r.experimentId === experimentId);
    
    const result = {
      totalUsers: experimentResults.length,
      variants: {} as Record<string, {
        users: number;
        events: Record<string, number>;
      }>
    };

    experimentResults.forEach(experimentResult => {
      if (!result.variants[experimentResult.variant]) {
        result.variants[experimentResult.variant] = {
          users: 0,
          events: {}
        };
      }
      
      result.variants[experimentResult.variant].users++;
      
      Object.entries(experimentResult.events).forEach(([eventName, eventData]) => {
        if (!result.variants[experimentResult.variant].events[eventName]) {
          result.variants[experimentResult.variant].events[eventName] = 0;
        }
        result.variants[experimentResult.variant].events[eventName] += eventData.count;
      });
    });

    return result;
  }

  public getExperiments(): Experiment[] {
    return [...this.experiments];
  }

  public getActiveExperiments(): Experiment[] {
    return this.experiments.filter(exp => exp.isActive);
  }

  public getResults(): ExperimentResult[] {
    return [...this.results];
  }

  public getUserId(): string {
    return this.userId;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public exportData(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      experiments: this.experiments,
      results: this.results,
      summary: this.experiments.map(exp => ({
        id: exp.id,
        results: this.getExperimentResults(exp.id)
      }))
    }, null, 2);
  }
}

// Singleton instance
export const abTesting = new ABTestingFramework();

// Development helper
export function getABTestingDashboard(): void {
  if (getFeatureFlag('enableConsoleLogging')) {
    console.group('🧪 A/B Testing Dashboard');
    console.log('User ID:', abTesting.getUserId());
    console.log('Session ID:', abTesting.getSessionId());
    console.log('Active Experiments:', abTesting.getActiveExperiments().length);
    console.log('Total Results:', abTesting.getResults().length);
    console.log('Export Data:', abTesting.exportData());
    console.groupEnd();
  }
}

// React hook for A/B testing
export function useABTest(experimentId: string) {
  const variant = abTesting.getVariant(experimentId);
  const config = variant ? abTesting.getExperimentConfig(experimentId, variant) : null;
  
  return {
    variant,
    config,
    trackEvent: abTesting.trackEvent.bind(abTesting)
  };
}