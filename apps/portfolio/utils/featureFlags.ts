/**
 * Feature Flag System for Staging Environment
 * Allows testing of WIP features in staging without affecting production
 */

import { getEnvironment } from '../src/utils/environment';

export interface FeatureFlags {
  // UI/UX Features
  newContactForm: boolean;
  enhancedAnimations: boolean;
  darkModeToggle: boolean;
  
  // Performance Features
  lazyLoadImages: boolean;
  preloadCriticalResources: boolean;
  
  // Analytics & Monitoring
  detailedAnalytics: boolean;
  performanceMonitoring: boolean;
  errorBoundaryReporting: boolean;
  
  // Experimental Features
  aiChatbot: boolean;
  interactivePortfolio: boolean;
  realTimeUpdates: boolean;
}

const defaultFlags: FeatureFlags = {
  // UI/UX Features
  newContactForm: false,
  enhancedAnimations: true,
  darkModeToggle: false,
  
  // Performance Features
  lazyLoadImages: true,
  preloadCriticalResources: true,
  
  // Analytics & Monitoring
  detailedAnalytics: false,
  performanceMonitoring: false,
  errorBoundaryReporting: false,
  
  // Experimental Features
  aiChatbot: false,
  interactivePortfolio: false,
  realTimeUpdates: false,
};

const stagingFlags: FeatureFlags = {
  // UI/UX Features
  newContactForm: true,
  enhancedAnimations: true,
  darkModeToggle: true,
  
  // Performance Features
  lazyLoadImages: true,
  preloadCriticalResources: true,
  
  // Analytics & Monitoring
  detailedAnalytics: true,
  performanceMonitoring: true,
  errorBoundaryReporting: true,
  
  // Experimental Features
  aiChatbot: true,
  interactivePortfolio: true,
  realTimeUpdates: true,
};

/**
 * Get feature flags based on environment
 */
export function getFeatureFlags(): FeatureFlags {
  const environment = getEnvironment();
  const enableFeatureFlags = process.env.NEXT_PUBLIC_ENABLE_FEATURE_FLAGS === 'true';
  
  if (environment === 'staging' && enableFeatureFlags) {
    return stagingFlags;
  }
  
  return defaultFlags;
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}

/**
 * Hook for React components to use feature flags
 */
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
  return isFeatureEnabled(feature);
}

/**
 * Get all enabled features for debugging
 */
export function getEnabledFeatures(): string[] {
  const flags = getFeatureFlags();
  return Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature);
}

/**
 * Development helper to override feature flags
 */
export function overrideFeatureFlag(feature: keyof FeatureFlags, enabled: boolean): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    const key = `ff_${feature}`;
    if (enabled) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
  }
}

/**
 * Check for local storage overrides (development only)
 */
function getLocalStorageOverride(feature: keyof FeatureFlags): boolean | null {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return null;
  }
  
  const key = `ff_${feature}`;
  const value = localStorage.getItem(key);
  return value === 'true' ? true : null;
}