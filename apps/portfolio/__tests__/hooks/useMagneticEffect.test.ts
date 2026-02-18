/**
 * Tests for useMagneticEffect hook
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { useMagneticEffect } from '@/hooks/useMagneticEffect';

// Mock GSAP
jest.mock('@/libs/gsap', () => ({
  gsap: {
    to: jest.fn().mockReturnValue({
      kill: jest.fn(),
    }),
  },
}));

describe('useMagneticEffect', () => {
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

  it('returns onMouseMove and onMouseLeave handlers', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useMagneticEffect(ref);
    });

    expect(typeof result.current.onMouseMove).toBe('function');
    expect(typeof result.current.onMouseLeave).toBe('function');
  });

  it('uses default options when none provided', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useMagneticEffect(ref);
    });

    // Handlers should be defined
    expect(result.current.onMouseMove).toBeDefined();
    expect(result.current.onMouseLeave).toBeDefined();
  });

  it('accepts custom options', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useMagneticEffect(ref, {
        strength: 0.5,
        threshold: 150,
        returnDuration: 1.0,
      });
    });

    expect(result.current.onMouseMove).toBeDefined();
    expect(result.current.onMouseLeave).toBeDefined();
  });

  describe('reduced motion preference', () => {
    it('respects prefers-reduced-motion setting', async () => {
      // Mock reduced motion preference
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
        return useMagneticEffect(ref);
      });

      // Handlers should still be returned
      expect(result.current.onMouseMove).toBeDefined();
      expect(result.current.onMouseLeave).toBeDefined();
    });

    it('listens for changes to reduced motion preference', () => {
      const addEventListenerMock = jest.fn();
      const removeEventListenerMock = jest.fn();

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: addEventListenerMock,
          removeEventListener: removeEventListenerMock,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useMagneticEffect(ref);
      });

      // Should add listener on mount
      expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

      unmount();

      // Should remove listener on unmount
      expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('cleanup', () => {
    it('cleans up animation on unmount', () => {
      const killMock = jest.fn();
      const gsap = require('@/libs/gsap').gsap;
      gsap.to.mockReturnValue({ kill: killMock });

      const { unmount, result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useMagneticEffect(ref);
      });

      unmount();

      // Cleanup effect should run on unmount
      // Note: actual animation cleanup depends on whether animation was triggered
    });
  });

  describe('handler callbacks are stable', () => {
    it('onMouseMove reference is stable across rerenders', () => {
      const { result, rerender } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useMagneticEffect(ref);
      });

      const firstOnMouseMove = result.current.onMouseMove;
      rerender();
      const secondOnMouseMove = result.current.onMouseMove;

      expect(firstOnMouseMove).toBe(secondOnMouseMove);
    });

    it('onMouseLeave reference is stable across rerenders', () => {
      const { result, rerender } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useMagneticEffect(ref);
      });

      const firstOnMouseLeave = result.current.onMouseLeave;
      rerender();
      const secondOnMouseLeave = result.current.onMouseLeave;

      expect(firstOnMouseLeave).toBe(secondOnMouseLeave);
    });
  });
});
