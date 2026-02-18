/**
 * Tests for useTiltEffect hook
 */
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useTiltEffect } from '@/hooks/useTiltEffect';

// Mock GSAP
jest.mock('@/libs/gsap', () => ({
  gsap: {
    to: jest.fn().mockReturnValue({
      kill: jest.fn(),
    }),
    set: jest.fn(),
  },
}));

describe('useTiltEffect', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset matchMedia to default (no reduced motion)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  describe('initialization', () => {
    it('returns event handlers and state', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      expect(typeof result.current.onMouseMove).toBe('function');
      expect(typeof result.current.onMouseEnter).toBe('function');
      expect(typeof result.current.onMouseLeave).toBe('function');
      expect(result.current.state).toBeDefined();
    });

    it('returns state with isHovering and isTouchDevice', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      expect(typeof result.current.state.isHovering).toBe('boolean');
      expect(typeof result.current.state.isTouchDevice).toBe('boolean');
    });

    it('starts with isHovering as false', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      expect(result.current.state.isHovering).toBe(false);
    });
  });

  describe('options', () => {
    it('uses default options when none provided', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      // Hook should work with default options
      expect(result.current.onMouseMove).toBeDefined();
    });

    it('accepts custom options', () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref, {
          maxTilt: 20,
          perspective: 1200,
          scale: 1.05,
          glare: true,
          maxGlare: 0.5,
          duration: 0.4,
          returnDuration: 0.8,
          ease: 'power3.out',
        });
      });

      expect(result.current.onMouseMove).toBeDefined();
    });
  });

  describe('reduced motion', () => {
    it('respects prefers-reduced-motion setting', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      // Handlers should still be returned but will do nothing when called
      expect(result.current.onMouseMove).toBeDefined();
      expect(result.current.onMouseEnter).toBeDefined();
      expect(result.current.onMouseLeave).toBeDefined();
    });

    it('adds event listener for reduced motion changes', () => {
      const addEventListenerMock = jest.fn();

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: addEventListenerMock,
          removeEventListener: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('touch device detection', () => {
    it('detects touch device based on ontouchstart', () => {
      // Mock touch device
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: () => {},
      });

      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      expect(result.current.state.isTouchDevice).toBe(true);

      // Clean up
      delete (window as { ontouchstart?: unknown }).ontouchstart;
    });

    it('detects touch device based on maxTouchPoints', () => {
      // Mock no ontouchstart but maxTouchPoints > 0
      const originalNavigator = { ...navigator };
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: 1,
      });

      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      expect(result.current.state.isTouchDevice).toBe(true);

      // Clean up
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: originalNavigator.maxTouchPoints,
      });
    });
  });

  describe('handler stability', () => {
    it('handlers are stable across rerenders', () => {
      const { result, rerender } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      const firstHandlers = {
        onMouseMove: result.current.onMouseMove,
        onMouseEnter: result.current.onMouseEnter,
        onMouseLeave: result.current.onMouseLeave,
      };

      rerender();

      expect(result.current.onMouseMove).toBe(firstHandlers.onMouseMove);
      expect(result.current.onMouseEnter).toBe(firstHandlers.onMouseEnter);
      expect(result.current.onMouseLeave).toBe(firstHandlers.onMouseLeave);
    });
  });

  describe('cleanup', () => {
    it('cleans up on unmount', () => {
      const removeEventListenerMock = jest.fn();

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: removeEventListenerMock,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useTiltEffect(ref);
      });

      unmount();

      expect(removeEventListenerMock).toHaveBeenCalled();
    });
  });
});
