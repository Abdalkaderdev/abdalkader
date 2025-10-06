import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from '../Input';

expect.extend(toHaveNoViolations);

describe('Input', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
    });

    it('renders different input types', () => {
      const { rerender } = render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input type="password" />);
      const passwordInput = document.querySelector('input[type="password"]');
      expect(passwordInput).toBeInTheDocument();

      rerender(<Input type="number" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });

  describe('User Input', () => {
    it('handles user input', async () => {
      const user = userEvent.setup();
      render(<Input label="Name" />);
      
      const input = screen.getByLabelText(/name/i);
      await user.type(input, 'John Doe');
      
      expect(input).toHaveValue('John Doe');
    });

    it('calls onChange handler', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Input onChange={handleChange} />);
      await user.type(screen.getByRole('textbox'), 'test');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('works as controlled component', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Input value="controlled" onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveValue('controlled');
      await user.type(input, 'a');
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Error States', () => {
    it('displays error message', () => {
      render(<Input error errorMessage="This field is required" />);
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });

    it('applies error class', () => {
      render(<Input error />);
      expect(screen.getByRole('textbox')).toHaveClass('input--error');
    });

    it('sets aria-invalid when error', () => {
      render(<Input error />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('error message has role alert', () => {
      render(<Input error errorMessage="Error" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Error');
    });
  });

  describe('Helper Text', () => {
    it('displays helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
    });

    it('hides helper text when error is shown', () => {
      render(<Input helperText="Helper" error errorMessage="Error" />);
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('shows required indicator', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('sets aria-required', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Disabled State', () => {
    it('renders disabled input', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('does not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      
      expect(input).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Input label="Email" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error state', async () => {
      const { container } = render(
        <Input label="Email" error errorMessage="Invalid email" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('associates label with input', () => {
      render(<Input label="Email" />);
      const input = screen.getByLabelText(/email/i);
      expect(input).toBeInTheDocument();
    });

    it('links error message with aria-describedby', () => {
      render(<Input label="Email" error errorMessage="Error" />);
      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain('error');
    });

    it('links helper text with aria-describedby', () => {
      render(<Input label="Email" helperText="Helper" />);
      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain('helper');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('allows focus via ref', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<Input ref={ref} />);
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('Number Input', () => {
    it('respects min and max attributes', () => {
      render(<Input type="number" min={0} max={100} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('respects step attribute', () => {
      render(<Input type="number" step={5} />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('step', '5');
    });
  });
});