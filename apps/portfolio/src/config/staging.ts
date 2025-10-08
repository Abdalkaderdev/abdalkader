/**
 * Staging Environment Configuration
 * Centralized configuration for staging-specific settings
 */

export const stagingConfig = {
  // Environment identification
  environment: 'staging',
  
  // Feature flags
  features: {
    enablePerformanceMonitoring: true,
    enableErrorTracking: true,
    enableDebugMode: true,
    enableConsoleLogging: true,
    enableABTesting: true,
    enableNewAnimations: true,
    enableAdvancedAnalytics: true,
    enableNewHeader: false,
    enableDarkModeToggle: true,
    enableAccessibilityImprovements: true,
  },

  // Performance monitoring settings
  performance: {
    collectMetrics: true,
    trackWebVitals: true,
    trackCustomMetrics: true,
    trackResourceTiming: true,
    maxMetrics: 100,
    sendToAnalytics: true,
  },

  // Error tracking settings
  errorTracking: {
    enabled: true,
    trackJavaScriptErrors: true,
    trackReactErrors: true,
    trackNetworkErrors: true,
    trackUnhandledRejections: true,
    maxErrors: 50,
    sendToService: true,
  },

  // A/B testing settings
  abTesting: {
    enabled: true,
    trackEvents: true,
    trackInteractions: true,
    trackScrollDepth: true,
    trackFormSubmissions: true,
    experiments: [
      'header-design',
      'cta-button',
      'color-scheme',
      'navigation-style',
    ],
  },

  // Analytics settings
  analytics: {
    enabled: true,
    trackPageViews: true,
    trackUserInteractions: true,
    trackPerformanceMetrics: true,
    trackErrorEvents: true,
    trackABTestEvents: true,
  },

  // Development tools
  devTools: {
    showStagingTools: true,
    enableConsoleLogging: true,
    enablePerformanceDashboard: true,
    enableErrorDashboard: true,
    enableABTestingDashboard: true,
    enableDataExport: true,
  },

  // API endpoints (staging-specific)
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api-staging.abdalkader.dev',
    analyticsEndpoint: '/analytics',
    errorEndpoint: '/errors',
    abTestingEndpoint: '/ab-testing',
  },

  // External services
  services: {
    // Example: Sentry configuration
    sentry: {
      enabled: true,
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: 'staging',
      tracesSampleRate: 1.0,
      debug: true,
    },
    
    // Example: Google Analytics
    googleAnalytics: {
      enabled: true,
      trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
      debug: true,
    },
  },

  // Staging-specific UI settings
  ui: {
    showEnvironmentBanner: true,
    bannerText: 'STAGING ENVIRONMENT',
    bannerColor: '#8b5cf6', // Purple
    showDebugInfo: true,
    enableHotReload: true,
  },

  // Security settings (staging-specific)
  security: {
    enableCSP: false, // Disabled for easier debugging
    enableHSTS: false, // Disabled for local testing
    enableXSSProtection: true,
    enableContentTypeSniffing: false,
  },

  // Cache settings
  cache: {
    enabled: false, // Disabled for easier testing
    ttl: 0,
    maxSize: 0,
  },
};

/**
 * Check if we're in staging environment
 */
export function isStagingEnvironment(): boolean {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging' || 
         process.env.NODE_ENV === 'development';
}

/**
 * Get configuration value with fallback
 */
export function getConfigValue<T>(key: string, fallback: T): T {
  const keys = key.split('.');
  let value: unknown = stagingConfig;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return fallback;
    }
  }
  
  return value as T;
}

/**
 * Initialize staging environment
 */
export function initializeStagingEnvironment(): void {
  if (!isStagingEnvironment()) {
    return;
  }

  // Log environment info
  console.log('🚀 Staging Environment Initialized');
  console.log('Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
  console.log('Node Environment:', process.env.NODE_ENV);
  console.log('Feature Flags:', stagingConfig.features);

  // Set up global error handling
  if (stagingConfig.errorTracking.enabled) {
    window.addEventListener('error', (event) => {
      console.error('🚨 Global Error:', event.error);
    });
  }

  // Set up performance monitoring
  if (stagingConfig.performance.collectMetrics) {
    console.log('📊 Performance monitoring enabled');
  }

  // Set up A/B testing
  if (stagingConfig.abTesting.enabled) {
    console.log('🧪 A/B testing enabled');
  }
}

// Auto-initialize if in staging
if (typeof window !== 'undefined' && isStagingEnvironment()) {
  initializeStagingEnvironment();
}