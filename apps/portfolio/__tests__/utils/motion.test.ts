/**
 * Tests for motion utility functions
 */
import { isReducedMotion } from '@/utils/motion';

describe('motion utilities', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    // Restore original matchMedia after each test
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  describe('isReducedMotion', () => {
    it('returns false when reduced motion is not preferred', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      });

      expect(isReducedMotion()).toBe(false);
    });

    it('returns true when reduced motion is preferred', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      });

      expect(isReducedMotion()).toBe(true);
    });

    it('returns false when matchMedia is not available', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      });

      expect(isReducedMotion()).toBe(false);
    });

    it('returns false when matchMedia throws an error', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => {
          throw new Error('matchMedia error');
        }),
      });

      expect(isReducedMotion()).toBe(false);
    });

    it('calls matchMedia with the correct query', () => {
      const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      isReducedMotion();

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });
});
