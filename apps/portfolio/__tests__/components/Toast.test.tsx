/**
 * Tests for Toast components
 *
 * Note: The Toast component is not exported directly, only ToastContainer is.
 * We test Toast behavior through ToastContainer.
 */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastContainer, ToastMessage, ToastType, useToast } from '@/components/Toast';
import { renderHook } from '@testing-library/react';

// Mock the SCSS module
jest.mock('@/components/Toast/Toast.module.scss', () => ({
  toast: 'toast',
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  content: 'content',
  icon: 'icon',
  close: 'close',
  container: 'container',
}));

describe('ToastContainer', () => {
  const mockOnClose = jest.fn();

  const createToastMessage = (overrides: Partial<ToastMessage> = {}): ToastMessage => ({
    id: 'test-id',
    message: 'Test message',
    type: 'info',
    duration: 3000,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('rendering', () => {
    it('renders an empty container when no toasts', () => {
      const { container } = render(<ToastContainer toasts={[]} onClose={mockOnClose} />);

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('container');
      expect(containerDiv.children).toHaveLength(0);
    });

    it('renders the toast message', () => {
      const toasts = [createToastMessage({ message: 'Hello World' })];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders with role="alert"', () => {
      const toasts = [createToastMessage()];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders a close button', () => {
      const toasts = [createToastMessage()];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('renders multiple toasts', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'First', type: 'info' },
        { id: '2', message: 'Second', type: 'success' },
        { id: '3', message: 'Third', type: 'error' },
      ];

      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  describe('toast types', () => {
    const types: ToastType[] = ['success', 'error', 'warning', 'info'];

    types.forEach((type) => {
      it(`renders ${type} toast with correct class`, () => {
        const toasts = [createToastMessage({ type })];
        const { container } = render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

        expect(container.querySelector(`.${type}`)).toBeInTheDocument();
      });
    });

    it('renders success icon', () => {
      const toasts = [createToastMessage({ type: 'success' })];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('renders error icon', () => {
      const toasts = [createToastMessage({ type: 'error' })];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('renders warning icon', () => {
      const toasts = [createToastMessage({ type: 'warning' })];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('renders info icon', () => {
      const toasts = [createToastMessage({ type: 'info' })];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    it('renders different toast types together', () => {
      const toasts: ToastMessage[] = [
        { id: '1', message: 'Success msg', type: 'success' },
        { id: '2', message: 'Error msg', type: 'error' },
        { id: '3', message: 'Warning msg', type: 'warning' },
        { id: '4', message: 'Info msg', type: 'info' },
      ];

      const { container } = render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(container.querySelector('.success')).toBeInTheDocument();
      expect(container.querySelector('.error')).toBeInTheDocument();
      expect(container.querySelector('.warning')).toBeInTheDocument();
      expect(container.querySelector('.info')).toBeInTheDocument();
    });
  });

  describe('close behavior', () => {
    it('calls onClose when close button is clicked', () => {
      const toasts = [createToastMessage({ id: 'close-test' })];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledWith('close-test');
    });

    it('auto-closes after duration', () => {
      const toasts = [createToastMessage({ id: 'auto-close', duration: 3000 })];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(mockOnClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockOnClose).toHaveBeenCalledWith('auto-close');
    });

    it('does not auto-close when duration is 0', () => {
      const toasts = [createToastMessage({ duration: 0 })];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('uses default duration of 3000ms when not specified', () => {
      const toasts: ToastMessage[] = [{ id: 'default-duration', message: 'Test', type: 'info' }];
      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      act(() => {
        jest.advanceTimersByTime(2999);
      });
      expect(mockOnClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(mockOnClose).toHaveBeenCalledWith('default-duration');
    });
  });

  describe('cleanup', () => {
    it('clears timer on unmount', () => {
      const toasts = [createToastMessage({ duration: 5000 })];
      const { unmount } = render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      unmount();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('toast keys', () => {
    it('renders toasts with unique keys', () => {
      const toasts: ToastMessage[] = [
        { id: 'unique-1', message: 'First', type: 'info' },
        { id: 'unique-2', message: 'Second', type: 'success' },
      ];

      const { container } = render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv.children).toHaveLength(2);
    });
  });
});

describe('useToast hook integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('integrates with ToastContainer', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success!');
      result.current.error('Error!');
    });

    const { container } = render(
      <ToastContainer toasts={result.current.toasts} onClose={result.current.removeToast} />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(container.querySelector('.success')).toBeInTheDocument();
    expect(container.querySelector('.error')).toBeInTheDocument();
  });

  it('removes toast when close button is clicked', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info('Test message');
    });

    const { rerender } = render(
      <ToastContainer toasts={result.current.toasts} onClose={result.current.removeToast} />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    rerender(
      <ToastContainer toasts={result.current.toasts} onClose={result.current.removeToast} />
    );

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });
});
