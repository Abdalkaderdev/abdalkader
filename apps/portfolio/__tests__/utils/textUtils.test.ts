/**
 * Tests for textUtils utility functions
 */
import { splitText } from '@/utils/textUtils';

describe('textUtils', () => {
  describe('splitText', () => {
    it('returns an array of span elements for valid text', () => {
      const result = splitText('Hello World');

      expect(result).toHaveLength(2); // Two words
      expect(result[0].key).toBe('0');
      expect(result[1].key).toBe('1');
    });

    it('returns empty array for empty string', () => {
      const result = splitText('');

      expect(result).toEqual([]);
    });

    it('returns empty array for whitespace-only string', () => {
      const result = splitText('   ');

      expect(result).toEqual([]);
    });

    it('returns empty array for non-string input', () => {
      expect(splitText(null)).toEqual([]);
      expect(splitText(undefined)).toEqual([]);
      expect(splitText(123)).toEqual([]);
      expect(splitText({})).toEqual([]);
      expect(splitText([])).toEqual([]);
    });

    it('handles single word', () => {
      const result = splitText('Hello');

      expect(result).toHaveLength(1);
    });

    it('handles multiple words', () => {
      const result = splitText('One Two Three Four');

      expect(result).toHaveLength(4);
    });

    it('trims leading and trailing whitespace', () => {
      const result = splitText('  Hello World  ');

      expect(result).toHaveLength(2);
    });

    it('creates span elements with correct structure', () => {
      const result = splitText('Hi');

      expect(result).toHaveLength(1);
      // Check that result[0] is a valid React element
      expect(result[0]).toBeDefined();
      expect(result[0].props).toBeDefined();
      expect(result[0].props.style).toEqual(
        expect.objectContaining({
          display: 'inline-block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        })
      );
    });
  });
});
