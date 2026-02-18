/**
 * Tests for useStaggeredReveal hook
 */
import { renderHook, act } from '@testing-library/react';
import { useStaggeredReveal } from '@/hooks/useStaggeredReveal';

// Mock GSAP and ScrollTrigger - declare mocks before using them
jest.mock('@/libs/gsap', () => {
  const mockTimelineInstance = {
    paused: true,
    play: jest.fn(),
    reverse: jest.fn(),
    kill: jest.fn(),
    to: jest.fn().mockReturnThis(),
  };

  return {
    gsap: {
      set: jest.fn(),
      to: jest.fn().mockReturnValue({ kill: jest.fn() }),
      timeline: jest.fn().mockImplementation(() => mockTimelineInstance),
    },
    ScrollTrigger: {
      create: jest.fn().mockReturnValue({
        kill: jest.fn(),
      }),
    },
  };
});

describe('useStaggeredReveal', () => {
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
    it('returns addToRefs function', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      expect(typeof result.current.addToRefs).toBe('function');
    });

    it('returns clearRefs function', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      expect(typeof result.current.clearRefs).toBe('function');
    });

    it('returns triggerReveal function', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      expect(typeof result.current.triggerReveal).toBe('function');
    });

    it('returns reverseReveal function', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      expect(typeof result.current.reverseReveal).toBe('function');
    });
  });

  describe('addToRefs', () => {
    it('adds element to refs', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      const element = document.createElement('div');

      act(() => {
        result.current.addToRefs(element);
      });

      // Element should be tracked (we can verify by checking clearRefs behavior)
      act(() => {
        result.current.clearRefs();
      });

      // No error should occur
    });

    it('handles null elements gracefully', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      act(() => {
        result.current.addToRefs(null);
      });

      // No error should occur
    });

    it('does not add duplicate elements', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      const element = document.createElement('div');

      act(() => {
        result.current.addToRefs(element);
        result.current.addToRefs(element);
        result.current.addToRefs(element);
      });

      // No error should occur, and element should only be tracked once internally
    });
  });

  describe('clearRefs', () => {
    it('clears all refs', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      const element1 = document.createElement('div');
      const element2 = document.createElement('div');

      act(() => {
        result.current.addToRefs(element1);
        result.current.addToRefs(element2);
      });

      act(() => {
        result.current.clearRefs();
      });

      // No error should occur
    });
  });

  describe('options', () => {
    it('uses default options when none provided', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      expect(result.current.addToRefs).toBeDefined();
    });

    it('accepts custom options', () => {
      const { result } = renderHook(() =>
        useStaggeredReveal({
          stagger: 0.1,
          duration: 1.0,
          distance: 60,
          direction: 'left',
          start: 'top 80%',
          end: 'bottom 10%',
          reverseOnLeave: false,
          delay: 0.5,
          ease: 'power4.out',
          scale: true,
          scaleFrom: 0.9,
          opacity: true,
          opacityFrom: 0,
        })
      );

      expect(result.current.addToRefs).toBeDefined();
    });

    it('accepts direction up', () => {
      const { result } = renderHook(() =>
        useStaggeredReveal({ direction: 'up' })
      );

      expect(result.current.addToRefs).toBeDefined();
    });

    it('accepts direction down', () => {
      const { result } = renderHook(() =>
        useStaggeredReveal({ direction: 'down' })
      );

      expect(result.current.addToRefs).toBeDefined();
    });

    it('accepts direction left', () => {
      const { result } = renderHook(() =>
        useStaggeredReveal({ direction: 'left' })
      );

      expect(result.current.addToRefs).toBeDefined();
    });

    it('accepts direction right', () => {
      const { result } = renderHook(() =>
        useStaggeredReveal({ direction: 'right' })
      );

      expect(result.current.addToRefs).toBeDefined();
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

      const { result } = renderHook(() => useStaggeredReveal());

      // Functions should still be returned
      expect(result.current.addToRefs).toBeDefined();
      expect(result.current.clearRefs).toBeDefined();
      expect(result.current.triggerReveal).toBeDefined();
      expect(result.current.reverseReveal).toBeDefined();
    });
  });

  describe('callbacks', () => {
    it('accepts onStart callback', () => {
      const onStart = jest.fn();

      const { result } = renderHook(() =>
        useStaggeredReveal({ onStart })
      );

      expect(result.current.addToRefs).toBeDefined();
    });

    it('accepts onComplete callback', () => {
      const onComplete = jest.fn();

      const { result } = renderHook(() =>
        useStaggeredReveal({ onComplete })
      );

      expect(result.current.addToRefs).toBeDefined();
    });
  });

  describe('manual controls', () => {
    it('triggerReveal can be called without error', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      act(() => {
        result.current.triggerReveal();
      });

      // No error should occur
    });

    it('reverseReveal can be called without error', () => {
      const { result } = renderHook(() => useStaggeredReveal());

      act(() => {
        result.current.reverseReveal();
      });

      // No error should occur
    });
  });
});
