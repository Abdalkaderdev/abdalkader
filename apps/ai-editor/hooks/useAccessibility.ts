import { useEffect, useRef, useCallback, useState } from 'react';
import { 
  announceToScreenReader, 
  trapFocus, 
  getFocusableElements,
  focusNextElement,
  focusPreviousElement,
  scrollIntoViewIfNeeded,
  createLiveRegion,
  updateLiveRegion,
  removeLiveRegion,
  ARIA_LABELS,
  KEYBOARD_SHORTCUTS
} from '../utils/accessibility';

interface UseAccessibilityOptions {
  enableKeyboardNavigation?: boolean;
  enableScreenReaderAnnouncements?: boolean;
  enableFocusTrap?: boolean;
  liveRegionPriority?: 'polite' | 'assertive';
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    enableKeyboardNavigation = true,
    enableScreenReaderAnnouncements = true,
    enableFocusTrap = false,
    liveRegionPriority = 'polite'
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const liveRegionRef = useRef<HTMLElement | null>(null);

  // Initialize live region
  useEffect(() => {
    if (enableScreenReaderAnnouncements) {
      liveRegionRef.current = createLiveRegion(liveRegionPriority);
    }

    return () => {
      if (liveRegionRef.current) {
        removeLiveRegion(liveRegionRef.current);
      }
    };
  }, [enableScreenReaderAnnouncements, liveRegionPriority]);

  // Focus trap
  useEffect(() => {
    if (enableFocusTrap && containerRef.current) {
      const cleanup = trapFocus(containerRef.current);
      return cleanup;
    }
  }, [enableFocusTrap]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = e;
      const target = e.target as HTMLElement;

      // Global shortcuts
      if (key === KEYBOARD_SHORTCUTS.ESCAPE) {
        // Close modals, dropdowns, etc.
        const closeableElements = containerRef.current?.querySelectorAll('[data-closeable]');
        closeableElements?.forEach(element => {
          if (element.contains(target)) {
            element.dispatchEvent(new CustomEvent('close'));
          }
        });
      }

      // Arrow key navigation
      if (key === KEYBOARD_SHORTCUTS.ARROW_DOWN || key === KEYBOARD_SHORTCUTS.ARROW_UP) {
        e.preventDefault();
        const nextElement = key === KEYBOARD_SHORTCUTS.ARROW_DOWN 
          ? focusNextElement(containerRef.current!, target)
          : focusPreviousElement(containerRef.current!, target);
        
        if (nextElement) {
          nextElement.focus();
          scrollIntoViewIfNeeded(nextElement);
        }
      }

      // Search shortcut
      if ((ctrlKey || metaKey) && key === 'k') {
        e.preventDefault();
        const searchInput = containerRef.current?.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);

    return () => {
      container?.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableKeyboardNavigation]);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (enableScreenReaderAnnouncements) {
      announceToScreenReader(message, priority);
    }
  }, [enableScreenReaderAnnouncements]);

  const announceLive = useCallback((message: string) => {
    if (liveRegionRef.current) {
      updateLiveRegion(liveRegionRef.current, message);
    }
  }, []);

  const focusElement = useCallback((selector: string) => {
    const element = containerRef.current?.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      scrollIntoViewIfNeeded(element);
    }
  }, []);

  const getAriaLabel = useCallback((key: keyof typeof ARIA_LABELS) => {
    return ARIA_LABELS[key];
  }, []);

  return {
    containerRef,
    announce,
    announceLive,
    focusElement,
    getAriaLabel
  };
}

// Hook for managing focus in lists/grids
export function useFocusManagement(containerRef: React.RefObject<HTMLElement>) {
  const focusIndexRef = useRef<number>(0);

  const focusItem = useCallback((index: number) => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    const targetElement = focusableElements[index];
    
    if (targetElement) {
      targetElement.focus();
      scrollIntoViewIfNeeded(targetElement);
      focusIndexRef.current = index;
    }
  }, [containerRef]);

  const focusNext = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    const nextIndex = (focusIndexRef.current + 1) % focusableElements.length;
    focusItem(nextIndex);
  }, [containerRef, focusItem]);

  const focusPrevious = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    const prevIndex = focusIndexRef.current === 0 
      ? focusableElements.length - 1 
      : focusIndexRef.current - 1;
    focusItem(prevIndex);
  }, [containerRef, focusItem]);

  const focusFirst = useCallback(() => {
    focusItem(0);
  }, [focusItem]);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    focusItem(focusableElements.length - 1);
  }, [containerRef, focusItem]);

  return {
    focusItem,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    currentIndex: focusIndexRef.current
  };
}

// Hook for managing ARIA states
export function useAriaState(initialState: Record<string, boolean> = {}) {
  const [states, setStates] = useState(initialState);

  const setAriaState = useCallback((key: string, value: boolean) => {
    setStates(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleAriaState = useCallback((key: string) => {
    setStates(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getAriaProps = useCallback((key: string) => {
    return {
      [`aria-${key}`]: states[key],
      'aria-expanded': states[key] ? 'true' : 'false'
    };
  }, [states]);

  return {
    states,
    setAriaState,
    toggleAriaState,
    getAriaProps
  };
}