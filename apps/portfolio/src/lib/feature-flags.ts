/**
 * Feature Flags System for Staging Environment
 * Allows enabling/disabling features without code deployment
 */

import { isStaging } from '../utils/environment';

export interface FeatureFlags {
  // Performance monitoring
  enablePerformanceMonitoring: boolean;
  enableErrorTracking: boolean;
  
  // Development features
  enableDebugMode: boolean;
  enableConsoleLogging: boolean;
  
  // Experimental features
  enableABTesting: boolean;
  enableNewAnimations: boolean;
  enableAdvancedAnalytics: boolean;
  
  // UI/UX experiments
  enableNewHeader: boolean;
  enableDarkModeToggle: boolean;
  enableAccessibilityImprovements: boolean;
}

const defaultFlags: FeatureFlags = {
  enablePerformanceMonitoring: process.env.NODE_ENV === 'development' || isStaging(),
  enableErrorTracking: isStaging(),
  enableDebugMode: process.env.NODE_ENV === 'development',
  enableConsoleLogging: process.env.NEXT_PUBLIC_DEBUG === 'true',
  enableABTesting: isStaging(),
  enableNewAnimations: process.env.NEXT_PUBLIC_FEATURE_FLAGS === 'true',
  enableAdvancedAnalytics: isStaging(),
  enableNewHeader: false,
  enableDarkModeToggle: process.env.NEXT_PUBLIC_FEATURE_FLAGS === 'true',
  enableAccessibilityImprovements: true,
};

/**
 * Get feature flag value
 */
export function getFeatureFlag<K extends keyof FeatureFlags>(flag: K): FeatureFlags[K] {
  // In staging, allow runtime flag overrides via localStorage
  if (typeof window !== 'undefined' && isStaging()) {
    const storedFlags = localStorage.getItem('feature-flags');
    if (storedFlags) {
      try {
        const parsed = JSON.parse(storedFlags);
        if (flag in parsed) {
          return parsed[flag];
        }
      } catch {
        console.warn('Invalid feature flags in localStorage');
      }
    }
  }
  
  return defaultFlags[flag];
}

/**
 * Set feature flag value (staging only)
 */
export function setFeatureFlag<K extends keyof FeatureFlags>(
  flag: K, 
  value: FeatureFlags[K]
): void {
  if (!isStaging()) {
    console.warn('Feature flags can only be modified in staging environment');
    return;
  }
  
  if (typeof window !== 'undefined') {
    const storedFlags = localStorage.getItem('feature-flags') || '{}';
    const parsed = JSON.parse(storedFlags);
    parsed[flag] = value;
    localStorage.setItem('feature-flags', JSON.stringify(parsed));
    
    // Trigger a custom event for components to react to flag changes
    window.dispatchEvent(new CustomEvent('feature-flag-changed', {
      detail: { flag, value }
    }));
  }
}

/**
 * Get all feature flags
 */
export function getAllFeatureFlags(): FeatureFlags {
  return Object.keys(defaultFlags).reduce((acc, key) => {
    acc[key as keyof FeatureFlags] = getFeatureFlag(key as keyof FeatureFlags);
    return acc;
  }, {} as FeatureFlags);
}

/**
 * Development helper to log all flags
 */
export function logFeatureFlags(): void {
  if (getFeatureFlag('enableConsoleLogging')) {
    console.group('🚩 Feature Flags');
    console.table(getAllFeatureFlags());
    console.groupEnd();
  }
}