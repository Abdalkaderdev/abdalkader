/**
 * Tests for useToast hook
 */
import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/components/Toast';

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('starts with an empty toasts array', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toEqual([]);
    });

    it('provides all expected methods', () => {
      const { result } = renderHook(() => useToast());

      expect(typeof result.current.addToast).toBe('function');
      expect(typeof result.current.removeToast).toBe('function');
      expect(typeof result.current.success).toBe('function');
      expect(typeof result.current.error).toBe('function');
      expect(typeof result.current.warning).toBe('function');
      expect(typeof result.current.info).toBe('function');
    });
  });

  describe('addToast', () => {
    it('adds a toast with the correct properties', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message', 'info', 3000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        message: 'Test message',
        type: 'info',
        duration: 3000,
      });
      expect(result.current.toasts[0].id).toBeDefined();
    });

    it('uses default type of info when not specified', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message');
      });

      expect(result.current.toasts[0].type).toBe('info');
    });

    it('uses default duration of 3000 when not specified', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message');
      });

      expect(result.current.toasts[0].duration).toBe(3000);
    });

    it('returns the toast id', () => {
      const { result } = renderHook(() => useToast());

      let id: string;
      act(() => {
        id = result.current.addToast('Test message');
      });

      expect(id!).toBe(result.current.toasts[0].id);
    });

    it('can add multiple toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('First');
        result.current.addToast('Second');
        result.current.addToast('Third');
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].message).toBe('First');
      expect(result.current.toasts[1].message).toBe('Second');
      expect(result.current.toasts[2].message).toBe('Third');
    });
  });

  describe('removeToast', () => {
    it('removes a toast by id', () => {
      const { result } = renderHook(() => useToast());

      let id: string;
      act(() => {
        id = result.current.addToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.removeToast(id!);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('only removes the specified toast', () => {
      const { result } = renderHook(() => useToast());

      let id1: string;
      let id2: string;
      act(() => {
        id1 = result.current.addToast('First');
        id2 = result.current.addToast('Second');
      });

      act(() => {
        result.current.removeToast(id1!);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].id).toBe(id2!);
    });

    it('does nothing when id does not exist', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.addToast('Test message');
      });

      act(() => {
        result.current.removeToast('nonexistent-id');
      });

      expect(result.current.toasts).toHaveLength(1);
    });
  });

  describe('convenience methods', () => {
    it('success creates a toast with type success', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.success('Success message');
      });

      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[0].message).toBe('Success message');
    });

    it('error creates a toast with type error', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.error('Error message');
      });

      expect(result.current.toasts[0].type).toBe('error');
      expect(result.current.toasts[0].message).toBe('Error message');
    });

    it('warning creates a toast with type warning', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.warning('Warning message');
      });

      expect(result.current.toasts[0].type).toBe('warning');
      expect(result.current.toasts[0].message).toBe('Warning message');
    });

    it('info creates a toast with type info', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.info('Info message');
      });

      expect(result.current.toasts[0].type).toBe('info');
      expect(result.current.toasts[0].message).toBe('Info message');
    });

    it('convenience methods accept custom duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.success('Test', 5000);
        result.current.error('Test', 6000);
        result.current.warning('Test', 7000);
        result.current.info('Test', 8000);
      });

      expect(result.current.toasts[0].duration).toBe(5000);
      expect(result.current.toasts[1].duration).toBe(6000);
      expect(result.current.toasts[2].duration).toBe(7000);
      expect(result.current.toasts[3].duration).toBe(8000);
    });
  });

  describe('toast id uniqueness', () => {
    it('generates unique ids for each toast', () => {
      const { result } = renderHook(() => useToast());

      const ids: string[] = [];
      act(() => {
        for (let i = 0; i < 10; i++) {
          ids.push(result.current.addToast(`Message ${i}`));
        }
      });

      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });
  });
});
