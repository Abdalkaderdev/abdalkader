// Accessibility utilities for the AI Lab

export const ARIA_LABELS = {
  // Navigation
  mainNavigation: 'Main navigation',
  skipToContent: 'Skip to main content',
  backToLab: 'Back to AI Lab',
  
  // Experiments
  experimentCard: 'Experiment card',
  experimentTitle: 'Experiment title',
  experimentDescription: 'Experiment description',
  experimentDifficulty: 'Experiment difficulty level',
  experimentStatus: 'Experiment status',
  experimentTechnologies: 'Experiment technologies',
  experimentEstimatedTime: 'Estimated completion time',
  
  // Search
  searchInput: 'Search experiments',
  searchResults: 'Search results',
  searchFilters: 'Search filters',
  clearSearch: 'Clear search',
  
  // Code Editor
  codeEditor: 'Code editor',
  codePreview: 'Code preview',
  copyCode: 'Copy code to clipboard',
  downloadCode: 'Download code',
  
  // Computer Vision
  webcamVideo: 'Webcam video feed',
  objectDetection: 'Object detection results',
  detectionCanvas: 'Detection visualization canvas',
  
  // Performance
  performanceMetrics: 'Performance metrics',
  fpsCounter: 'Frames per second counter',
  memoryUsage: 'Memory usage indicator',
  
  // Buttons
  playButton: 'Start experiment',
  pauseButton: 'Pause experiment',
  stopButton: 'Stop experiment',
  refreshButton: 'Refresh preview',
  settingsButton: 'Open settings',
  
  // Status indicators
  loading: 'Loading',
  error: 'Error occurred',
  success: 'Operation successful',
  warning: 'Warning'
};

export const KEYBOARD_SHORTCUTS = {
  // Global shortcuts
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  
  // Navigation
  HOME: 'Home',
  END: 'End',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  
  // Search
  SEARCH: 'Ctrl+K',
  CLEAR_SEARCH: 'Escape',
  
  // Code Editor
  SAVE: 'Ctrl+S',
  COPY: 'Ctrl+C',
  PASTE: 'Ctrl+V',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Y',
  
  // Experiments
  NEXT_EXPERIMENT: 'ArrowRight',
  PREVIOUS_EXPERIMENT: 'ArrowLeft',
  TOGGLE_FULLSCREEN: 'F11'
};

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  firstElement?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )) as HTMLElement[];
}

export function focusNextElement(container: HTMLElement, currentElement: HTMLElement): HTMLElement | null {
  const focusableElements = getFocusableElements(container);
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1) return focusableElements[0] || null;
  
  const nextIndex = (currentIndex + 1) % focusableElements.length;
  return focusableElements[nextIndex] || null;
}

export function focusPreviousElement(container: HTMLElement, currentElement: HTMLElement): HTMLElement | null {
  const focusableElements = getFocusableElements(container);
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1) return focusableElements[focusableElements.length - 1] || null;
  
  const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
  return focusableElements[prevIndex] || null;
}

export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.visibility !== 'hidden' &&
    style.display !== 'none' &&
    style.opacity !== '0'
  );
}

export function scrollIntoViewIfNeeded(element: HTMLElement) {
  if (!isElementVisible(element)) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }
}

export function createLiveRegion(priority: 'polite' | 'assertive' = 'polite'): HTMLElement {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);
  
  return liveRegion;
}

export function updateLiveRegion(liveRegion: HTMLElement, message: string) {
  liveRegion.textContent = message;
}

export function removeLiveRegion(liveRegion: HTMLElement) {
  if (liveRegion.parentNode) {
    liveRegion.parentNode.removeChild(liveRegion);
  }
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function meetsWCAGAA(contrastRatio: number): boolean {
  return contrastRatio >= 4.5;
}

export function meetsWCAGAAA(contrastRatio: number): boolean {
  return contrastRatio >= 7;
}