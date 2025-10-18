/**
 * Environment utility functions
 */

export type Environment = 'development' | 'staging' | 'production';

/**
 * Get the current environment
 */
export function getEnvironment(): Environment {
  // Check for explicit environment variable
  if (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    return process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
  }

  // Check for Vercel environment
  if (process.env.VERCEL_ENV) {
    switch (process.env.VERCEL_ENV) {
      case 'development':
        return 'development';
      case 'preview':
        return 'staging';
      case 'production':
        return 'production';
      default:
        return 'production';
    }
  }

  // Check for NODE_ENV
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }

  // Default to production
  return 'production';
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Check if we're in staging
 */
export function isStaging(): boolean {
  return getEnvironment() === 'staging';
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  const env = getEnvironment();
  
  return {
    environment: env,
    isDevelopment: isDevelopment(),
    isStaging: isStaging(),
    isProduction: isProduction(),
    enableDebug: env === 'development' || env === 'staging',
    enableFeatureFlags: env === 'staging',
    enablePerformanceMonitoring: true,
    enableErrorTracking: env !== 'development',
    enableABTesting: env === 'staging',
  };
}