import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with correct variant class', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--primary');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--secondary');

      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--danger');
    });

    it('renders with correct size class', () => {
      const { rerender } = render(<Button size="small">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--small');

      rerender(<Button size="medium">Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--medium');

      rerender(<Button size="large">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--large');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} disabled>Click me</Button>);
      await user.click(screen.getByRole('button'));
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('can be activated with keyboard', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('States', () => {
    it('renders disabled state correctly', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Button aria-describedby="description">Button</Button>
          <span id="description">Description text</span>
        </>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'description');
    });

    it('has correct button type', () => {
      const { rerender } = render(<Button type="button">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

      rerender(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards all button attributes', () => {
      render(
        <Button
          id="test-button"
          name="test"
          value="test-value"
          data-testid="custom-button"
        >
          Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-button');
      expect(button).toHaveAttribute('name', 'test');
      expect(button).toHaveAttribute('value', 'test-value');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
    });
  });
});