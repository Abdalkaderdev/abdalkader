/**
 * Tests for Tag component
 */
import { render, screen } from '@testing-library/react';
import Tag from '@/components/Tag';

// Mock the SCSS module
jest.mock('@/components/Tag/Tag.module.scss', () => ({
  tag: 'tag',
}));

describe('Tag', () => {
  it('renders with text', () => {
    render(<Tag text="React" />);

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders the text inside a span', () => {
    render(<Tag text="TypeScript" />);

    const span = screen.getByText('TypeScript');
    expect(span.tagName).toBe('SPAN');
  });

  it('has the tag class on container', () => {
    const { container } = render(<Tag text="Test" />);

    const tagDiv = container.firstChild as HTMLElement;
    expect(tagDiv).toHaveClass('tag');
  });

  describe('different text values', () => {
    it('renders simple text', () => {
      render(<Tag text="JavaScript" />);

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('renders text with spaces', () => {
      render(<Tag text="Next.js App Router" />);

      expect(screen.getByText('Next.js App Router')).toBeInTheDocument();
    });

    it('renders single character', () => {
      render(<Tag text="A" />);

      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('renders text with special characters', () => {
      render(<Tag text="C++" />);

      expect(screen.getByText('C++')).toBeInTheDocument();
    });

    it('renders text with numbers', () => {
      render(<Tag text="ES2024" />);

      expect(screen.getByText('ES2024')).toBeInTheDocument();
    });

    it('renders text with dots', () => {
      render(<Tag text="Node.js" />);

      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('renders empty string (edge case)', () => {
      const { container } = render(<Tag text="" />);

      // Component should render, span should be empty
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe('');
    });
  });

  describe('component structure', () => {
    it('has correct DOM structure', () => {
      const { container } = render(<Tag text="Test" />);

      // Should be: div > span
      const div = container.firstChild as HTMLElement;
      expect(div.tagName).toBe('DIV');

      const span = div.firstChild as HTMLElement;
      expect(span.tagName).toBe('SPAN');
    });

    it('text is a direct child of the span', () => {
      render(<Tag text="Direct" />);

      const span = screen.getByText('Direct');
      expect(span.childNodes.length).toBe(1);
      expect(span.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
    });
  });

  describe('multiple tags', () => {
    it('renders multiple tags independently', () => {
      render(
        <>
          <Tag text="React" />
          <Tag text="TypeScript" />
          <Tag text="Next.js" />
        </>
      );

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
    });

    it('each tag is visually separate', () => {
      const { container } = render(
        <>
          <Tag text="Tag1" />
          <Tag text="Tag2" />
        </>
      );

      const tags = container.querySelectorAll('.tag');
      expect(tags).toHaveLength(2);
    });
  });
});
