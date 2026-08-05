import { describe, it, expect } from 'vitest';
import { renderCss } from '../generate';
import { tokens } from '../tokens';

const css = renderCss(tokens);

const block = (query: string): string => {
  const i = css.indexOf(`@media (${query})`);
  if (i === -1) return '';
  return css.slice(i, css.indexOf('\n}\n', css.indexOf('{', i)));
};

describe('preference support', () => {
  it('zeroes motion durations under reduced motion', () => {
    const b = block('prefers-reduced-motion: reduce');
    expect(b).not.toBe('');
    expect(b).toContain('--duration-slow: 0s;');
    expect(b).toContain('--duration-fast: 0s;');
    expect(b).toContain('--transition-smooth: none;');
  });

  it('raises contrast of the primary colour under high contrast', () => {
    const b = block('prefers-contrast: high');
    expect(b).not.toBe('');
    expect(b).toContain('--color-primary: #ff6600;');
    expect(b).toContain('--color-border: #666666;');
  });

  it('does NOT ship a light colour scheme — the site is deliberately dark', () => {
    // The dead designTokens.css carried a prefers-color-scheme: light block that
    // set --color-background: #ffffff. Activating it would invert the theme for
    // every visitor whose OS prefers light. It must never ship.
    expect(css).not.toContain('prefers-color-scheme');
    expect(css).not.toContain('--color-bg-primary: #ffffff');
  });

  it('every preference override targets a token defined in the base block', () => {
    const base = css.slice(0, css.indexOf('@media'));
    const defined = new Set([...base.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]));
    for (const group of [tokens.reducedMotion, tokens.highContrast]) {
      for (const name of Object.keys(group)) {
        expect(defined.has(`--${name}`), `override --${name} has no base value`).toBe(true);
      }
    }
  });
});
