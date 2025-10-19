'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  touchMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorScheme: 'auto' | 'light' | 'dark' | 'high-contrast';
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: false,
    touchMode: false,
    fontSize: 'medium',
    colorScheme: 'auto',
  });

  const [isOnline, setIsOnline] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect device capabilities and preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSettings(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));

    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setSettings(prev => ({ ...prev, highContrast: highContrastQuery.matches }));

    // Check for color scheme preference
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSettings(prev => ({ 
      ...prev, 
      colorScheme: colorSchemeQuery.matches ? 'dark' : 'light' 
    }));

    // Detect screen reader
    const hasScreenReader = 
      'speechSynthesis' in window ||
      'webkitSpeechSynthesis' in window ||
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver');

    setSettings(prev => ({ ...prev, screenReader: hasScreenReader }));

    // Detect device type
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      const isTabletDevice = width >= 768 && width < 1024;
      const isDesktopDevice = width >= 1024;

      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
      setIsDesktop(isDesktopDevice);
      setSettings(prev => ({ ...prev, touchMode: isMobileDevice || isTabletDevice }));
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Listen for preference changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ 
        ...prev, 
        colorScheme: e.matches ? 'dark' : 'light' 
      }));
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    highContrastQuery.addEventListener('change', handleContrastChange);
    colorSchemeQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      window.removeEventListener('resize', checkDeviceType);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleMotionChange);
      highContrastQuery.removeEventListener('change', handleContrastChange);
      colorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Get responsive classes based on device type
  const getResponsiveClasses = useCallback((classes: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    base?: string;
  }) => {
    const { mobile, tablet, desktop, base } = classes;
    let result = base || '';
    
    if (isMobile && mobile) result += ` ${mobile}`;
    if (isTablet && tablet) result += ` ${tablet}`;
    if (isDesktop && desktop) result += ` ${desktop}`;
    
    return result.trim();
  }, [isMobile, isTablet, isDesktop]);

  // Get accessibility classes
  const getAccessibilityClasses = useCallback(() => {
    const classes = [];
    
    if (settings.reducedMotion) classes.push('motion-reduce');
    if (settings.highContrast) classes.push('high-contrast');
    if (settings.largeText) classes.push('large-text');
    if (settings.screenReader) classes.push('screen-reader');
    if (settings.keyboardNavigation) classes.push('keyboard-navigation');
    if (settings.touchMode) classes.push('touch-mode');
    
    return classes.join(' ');
  }, [settings]);

  // Get font size multiplier
  const getFontSizeMultiplier = useCallback(() => {
    switch (settings.fontSize) {
      case 'small': return 0.875;
      case 'medium': return 1;
      case 'large': return 1.125;
      case 'extra-large': return 1.25;
      default: return 1;
    }
  }, [settings.fontSize]);

  // Check if element should be animated
  const shouldAnimate = useCallback((elementType: 'card' | 'button' | 'text' | 'page' = 'card') => {
    if (settings.reducedMotion) return false;
    
    // Different animation preferences for different elements
    switch (elementType) {
      case 'card':
        return !settings.reducedMotion;
      case 'button':
        return !settings.reducedMotion && !settings.touchMode;
      case 'text':
        return !settings.reducedMotion;
      case 'page':
        return !settings.reducedMotion;
      default:
        return !settings.reducedMotion;
    }
  }, [settings.reducedMotion, settings.touchMode]);

  // Get focus styles
  const getFocusStyles = useCallback(() => {
    if (settings.highContrast) {
      return 'focus:outline-2 focus:outline-offset-2 focus:outline-orange-500';
    }
    return 'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black';
  }, [settings.highContrast]);

  // Get touch target size
  const getTouchTargetSize = useCallback(() => {
    if (settings.touchMode) {
      return 'min-h-[44px] min-w-[44px]'; // WCAG AA minimum touch target size
    }
    return 'min-h-[32px] min-w-[32px]';
  }, [settings.touchMode]);

  // Announce to screen readers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (settings.screenReader) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [settings.screenReader]);

  // Get color scheme classes
  const getColorSchemeClasses = useCallback(() => {
    switch (settings.colorScheme) {
      case 'light':
        return 'light-theme';
      case 'dark':
        return 'dark-theme';
      case 'high-contrast':
        return 'high-contrast-theme';
      default:
        return 'auto-theme';
    }
  }, [settings.colorScheme]);

  return {
    settings,
    isOnline,
    isMobile,
    isTablet,
    isDesktop,
    updateSettings,
    getResponsiveClasses,
    getAccessibilityClasses,
    getFontSizeMultiplier,
    shouldAnimate,
    getFocusStyles,
    getTouchTargetSize,
    announceToScreenReader,
    getColorSchemeClasses,
  };
};

export default useAccessibility;