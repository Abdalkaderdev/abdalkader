/**
 * Tests for SEO utility functions
 */
import { buildCanonical, SITE_URL } from '@/utils/seo';

describe('seo utilities', () => {
  describe('SITE_URL', () => {
    it('should have a default value', () => {
      expect(SITE_URL).toBeDefined();
      expect(typeof SITE_URL).toBe('string');
    });
  });

  describe('buildCanonical', () => {
    it('returns SITE_URL for empty pathname', () => {
      expect(buildCanonical('')).toBe(SITE_URL);
    });

    it('returns SITE_URL for root pathname', () => {
      expect(buildCanonical('/')).toBe(SITE_URL);
    });

    it('builds canonical URL for a simple path', () => {
      expect(buildCanonical('/about')).toBe(`${SITE_URL}/about`);
    });

    it('builds canonical URL for nested paths', () => {
      expect(buildCanonical('/projects/my-project')).toBe(
        `${SITE_URL}/projects/my-project`
      );
    });

    it('removes trailing slash from pathname', () => {
      expect(buildCanonical('/about/')).toBe(`${SITE_URL}/about`);
    });

    it('handles paths with multiple trailing slashes by removing one', () => {
      // Current implementation only removes one trailing slash
      expect(buildCanonical('/about//')).toBe(`${SITE_URL}/about/`);
    });

    it('preserves query parameters in path', () => {
      expect(buildCanonical('/search?q=test')).toBe(`${SITE_URL}/search?q=test`);
    });

    it('handles paths with hash fragments', () => {
      expect(buildCanonical('/about#section')).toBe(`${SITE_URL}/about#section`);
    });
  });
});
