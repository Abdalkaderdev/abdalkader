import { useState, useEffect, useCallback } from 'react';

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  focusVisible: boolean;
  audioDescriptions: boolean;
}

export interface AccessibilityFeatures {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  setFocus: (element: HTMLElement) => void;
  getAccessibleText: (element: HTMLElement) => string;
  isKeyboardAccessible: (element: HTMLElement) => boolean;
  getContrastRatio: (foreground: string, background: string) => number;
  getAccessibleColor: (color: string, background: string) => string;
  getResponsiveClasses: (baseClasses: string) => string;
  getTouchTargetSize: (baseSize: string) => string;
  getScreenReaderText: (text: string, context?: string) => string;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: false,
    voiceControl: false,
    colorBlind: 'none',
    fontSize: 'medium',
    focusVisible: true,
    audioDescriptions: false
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize accessibility settings
  useEffect(() => {
    const initializeAccessibility = () => {
      // Check for reduced motion preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check for high contrast preference
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      // Check for screen reader
      const screenReader = 'speechSynthesis' in window && 'speechRecognition' in window;
      
      // Check for keyboard navigation
      const keyboardNavigation = 'keyboard' in navigator;
      
      // Check for voice control
      const voiceControl = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      
      // Load saved settings
      const savedSettings = localStorage.getItem('therapy_accessibility_settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse accessibility settings:', error);
        }
      } else {
        // Set default settings based on system preferences
        setSettings(prev => ({
          ...prev,
          reducedMotion,
          highContrast,
          screenReader,
          keyboardNavigation,
          voiceControl
        }));
      }
      
      setIsInitialized(true);
    };

    initializeAccessibility();
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('therapy_accessibility_settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Announce message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.screenReader) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [settings.screenReader]);

  // Set focus to element
  const setFocus = useCallback((element: HTMLElement) => {
    if (!element) return;
    
    element.focus();
    
    // Announce focus change
    const accessibleText = getAccessibleText(element);
    if (accessibleText) {
      announce(`Focused on ${accessibleText}`);
    }
  }, [announce]);

  // Get accessible text for element
  const getAccessibleText = useCallback((element: HTMLElement): string => {
    if (!element) return '';
    
    // Check for aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Check for aria-labelledby
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy);
      if (labelElement) return labelElement.textContent || '';
    }
    
    // Check for title
    const title = element.getAttribute('title');
    if (title) return title;
    
    // Check for alt text
    const alt = element.getAttribute('alt');
    if (alt) return alt;
    
    // Check for text content
    const textContent = element.textContent?.trim();
    if (textContent) return textContent;
    
    // Check for placeholder
    const placeholder = element.getAttribute('placeholder');
    if (placeholder) return placeholder;
    
    return '';
  }, []);

  // Check if element is keyboard accessible
  const isKeyboardAccessible = useCallback((element: HTMLElement): boolean => {
    if (!element) return false;
    
    // Check if element is focusable
    const focusableElements = [
      'button', 'input', 'select', 'textarea', 'a', 'area', 'iframe',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    const isFocusable = focusableElements.some(selector => 
      element.matches(selector)
    );
    
    if (!isFocusable) return false;
    
    // Check if element is visible
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    
    // Check if element is enabled
    if (element.hasAttribute('disabled')) return false;
    
    return true;
  }, []);

  // Calculate contrast ratio
  const getContrastRatio = useCallback((foreground: string, background: string): number => {
    const getLuminance = (color: string): number => {
      const rgb = color.match(/\d+/g);
      if (!rgb || rgb.length < 3) return 0;
      
      const [r, g, b] = rgb.map(Number);
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }, []);

  // Get accessible color based on contrast
  const getAccessibleColor = useCallback((color: string, background: string): string => {
    const contrastRatio = getContrastRatio(color, background);
    
    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    const minContrast = settings.largeText ? 3 : 4.5;
    
    if (contrastRatio >= minContrast) return color;
    
    // If contrast is too low, return a high-contrast alternative
    return settings.highContrast ? '#ffffff' : '#000000';
  }, [settings.largeText, settings.highContrast, getContrastRatio]);

  // Get responsive classes based on accessibility settings
  const getResponsiveClasses = useCallback((baseClasses: string): string => {
    let classes = baseClasses;
    
    if (settings.largeText) {
      classes += ' text-lg';
    }
    
    if (settings.highContrast) {
      classes += ' border-2 border-white';
    }
    
    if (settings.reducedMotion) {
      classes += ' motion-reduce';
    }
    
    return classes;
  }, [settings.largeText, settings.highContrast, settings.reducedMotion]);

  // Get touch target size based on accessibility settings
  const getTouchTargetSize = useCallback((baseSize: string): string => {
    if (settings.largeText) {
      return 'min-h-[48px] min-w-[48px]';
    }
    
    return baseSize;
  }, [settings.largeText]);

  // Get screen reader text
  const getScreenReaderText = useCallback((text: string, context?: string): string => {
    if (!settings.screenReader) return text;
    
    let srText = text;
    
    if (context) {
      srText = `${context}: ${text}`;
    }
    
    // Add additional context for screen readers
    if (text.includes('button') || text.includes('click')) {
      srText += '. Press Enter or Space to activate.';
    }
    
    if (text.includes('link')) {
      srText += '. Press Enter to follow link.';
    }
    
    return srText;
  }, [settings.screenReader]);

  // Apply accessibility styles to document
  useEffect(() => {
    if (!isInitialized) return;
    
    const root = document.documentElement;
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--motion-duration', '0s');
      root.style.setProperty('--motion-delay', '0s');
    } else {
      root.style.removeProperty('--motion-duration');
      root.style.removeProperty('--motion-delay');
    }
    
    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Apply color blind support
    if (settings.colorBlind !== 'none') {
      root.classList.add(`color-blind-${settings.colorBlind}`);
    } else {
      root.classList.remove('color-blind-protanopia', 'color-blind-deuteranopia', 'color-blind-tritanopia');
    }
    
    // Apply focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [settings, isInitialized]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!settings.keyboardNavigation) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content
      if (event.key === 'Tab' && event.shiftKey && event.ctrlKey) {
        event.preventDefault();
        const main = document.querySelector('main');
        if (main) setFocus(main as HTMLElement);
      }
      
      // Skip to navigation
      if (event.key === 'Tab' && event.ctrlKey) {
        event.preventDefault();
        const nav = document.querySelector('nav');
        if (nav) setFocus(nav as HTMLElement);
      }
      
      // Escape key to close modals
      if (event.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
          if (closeButton) setFocus(closeButton as HTMLElement);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, setFocus]);

  // Voice control handler
  useEffect(() => {
    if (!settings.voiceControl) return;
    
    const handleVoiceCommand = (event: CustomEvent) => {
      const command = event.detail.command.toLowerCase();
      
      switch (command) {
        case 'start exercise':
          const startButton = document.querySelector('[aria-label*="start exercise"]');
          if (startButton) setFocus(startButton as HTMLElement);
          break;
        case 'stop exercise':
          const stopButton = document.querySelector('[aria-label*="stop exercise"]');
          if (stopButton) setFocus(stopButton as HTMLElement);
          break;
        case 'save mood':
          const saveButton = document.querySelector('[aria-label*="save mood"]');
          if (saveButton) setFocus(saveButton as HTMLElement);
          break;
        case 'help':
          const helpButton = document.querySelector('[aria-label*="help"]');
          if (helpButton) setFocus(helpButton as HTMLElement);
          break;
      }
    };
    
    document.addEventListener('voiceCommand', handleVoiceCommand as EventListener);
    return () => document.removeEventListener('voiceCommand', handleVoiceCommand as EventListener);
  }, [settings.voiceControl, setFocus]);

  // Accessibility features object
  const features: AccessibilityFeatures = {
    announce,
    setFocus,
    getAccessibleText,
    isKeyboardAccessible,
    getContrastRatio,
    getAccessibleColor,
    getResponsiveClasses,
    getTouchTargetSize,
    getScreenReaderText
  };

  return {
    settings,
    updateSettings,
    features,
    isInitialized
  };
};

export default useAccessibility;