/**
 * Tests for Button component
 */
import { render, screen } from '@testing-library/react';
import Button from '@/components/Button';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return <a href={href} {...props}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock the SCSS module
jest.mock('@/components/Button/Button.module.scss', () => ({
  btn: 'btn',
}));

describe('Button', () => {
  it('renders with text', () => {
    render(<Button text="Click me" href="/test" />);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    render(<Button text="Go Home" href="/home" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('applies the btn class', () => {
    render(<Button text="Styled Button" href="/test" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('btn');
  });

  it('applies extra class when provided', () => {
    render(<Button text="Extra Class" href="/test" extraClass="custom-class" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('btn');
    expect(link).toHaveClass('custom-class');
  });

  it('does not apply extra class when not provided', () => {
    render(<Button text="No Extra" href="/test" />);

    const link = screen.getByRole('link');
    expect(link.className.trim()).toBe('btn');
  });

  describe('target blank behavior', () => {
    it('sets target="_self" by default', () => {
      render(<Button text="Internal Link" href="/internal" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_self');
    });

    it('sets target="_blank" when targetBlank is true', () => {
      render(<Button text="External Link" href="https://example.com" targetBlank />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('adds rel="noopener noreferrer" when targetBlank is true', () => {
      render(<Button text="External Link" href="https://example.com" targetBlank />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel attribute when targetBlank is false', () => {
      render(<Button text="Internal Link" href="/internal" targetBlank={false} />);

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('rel');
    });
  });

  describe('different href values', () => {
    it('handles absolute URLs', () => {
      render(<Button text="External" href="https://example.com" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('handles relative paths', () => {
      render(<Button text="Relative" href="/about/team" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/about/team');
    });

    it('handles hash links', () => {
      render(<Button text="Hash" href="#section" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '#section');
    });

    it('handles empty href', () => {
      render(<Button text="Empty" href="" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '');
    });
  });

  describe('text content', () => {
    it('renders simple text', () => {
      render(<Button text="Simple" href="/test" />);

      expect(screen.getByText('Simple')).toBeInTheDocument();
    });

    it('renders text with special characters', () => {
      render(<Button text="Click & Go!" href="/test" />);

      expect(screen.getByText('Click & Go!')).toBeInTheDocument();
    });

    it('renders text with numbers', () => {
      render(<Button text="Option 1" href="/test" />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders long text', () => {
      const longText = 'This is a very long button text that should still render correctly';
      render(<Button text={longText} href="/test" />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });
});
