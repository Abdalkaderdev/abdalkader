import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fluidClamp, renderCss, renderScss } from '../generate';
import { tokens } from '../tokens';

describe('fluidClamp', () => {
  it('computes a clamp with intercept and slope across 600px-1440px', () => {
    // 2.5rem at 600px, 4.5rem at 1440px
    // slope = (4.5-2.5)/(90-37.5) = 0.0380952rem per 1rem of vw -> 3.8095vw
    // intercept = 2.5 - 0.0380952*37.5 = 1.0714rem
    expect(fluidClamp({ min: '2.5rem', max: '4.5rem' })).toBe(
      'clamp(2.5rem, 1.0714rem + 3.8095vw, 4.5rem)'
    );
  });

  it('emits a plain value when min equals max', () => {
    expect(fluidClamp({ min: '1rem', max: '1rem' })).toBe('1rem');
  });

  it('honours a custom viewport range', () => {
    // 1rem at 320px (20rem) -> 2rem at 80rem: slope = 1/60 -> 1.6667vw
    // intercept = 1 - (1/60)*20 = 0.6667rem
    expect(fluidClamp({ min: '1rem', max: '2rem', minVw: '20rem', maxVw: '80rem' })).toBe(
      'clamp(1rem, 0.6667rem + 1.6667vw, 2rem)'
    );
  });
});

describe('renderCss', () => {
  it('emits every colour token as a custom property', () => {
    const css = renderCss(tokens);
    expect(css).toContain('--color-primary: #f44e00;');
    expect(css).toContain('--color-border: rgb(37, 37, 37);');
  });

  it('emits fluid tokens as clamp expressions', () => {
    expect(renderCss(tokens)).toMatch(/--fs-hero: clamp\(/);
  });

  it('preserves the live values that must not change in Phase A', () => {
    const css = renderCss(tokens);
    expect(css).toContain('--border-radius: 12px;');
    expect(css).toContain('--border-radius-sm: 6px;');
    expect(css).toContain('--breakpoint-lg: 1080px;');
  });

  it('emits the reduced-motion and high-contrast blocks', () => {
    const css = renderCss(tokens);
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('@media (prefers-contrast: more)');
  });

  it('never emits a prefers-color-scheme block', () => {
    expect(renderCss(tokens)).not.toContain('prefers-color-scheme');
  });

  it('keeps the deprecated names resolving so existing call sites do not break', () => {
    const css = renderCss(tokens);
    // These were defined by the file this pipeline replaced and are still
    // referenced by portfolio-components.css and CrossAppNavigation.css.
    for (const name of [
      '--text-hero',
      '--text-hero-md',
      '--text-hero-sm',
      '--text-large',
      '--text-medium',
      '--text-base',
      '--text-small',
      '--section-padding',
      '--section-gap-md',
      '--color-primary-gradient',
    ]) {
      expect(css).toContain(`${name}: `);
    }
  });

  it('every alias points at a token that actually exists', () => {
    const css = renderCss(tokens);
    const defined = new Set(
      [...css.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1])
    );
    for (const target of Object.values(tokens.aliases)) {
      const name = target.match(/var\((--[a-z0-9-]+)\)/)?.[1];
      expect(name, `alias target ${target} is malformed`).toBeDefined();
      expect(defined.has(name!), `alias points at undefined ${name}`).toBe(true);
    }
  });
});

describe('renderScss', () => {
  it('emits colours as literal values so SCSS colour functions work', () => {
    const scss = renderScss(tokens);
    expect(scss).toContain('$primary: #f44e00;');
    expect(scss).not.toMatch(/\$primary:\s*var\(/);
  });

  it('emits fluid sizes as var() references', () => {
    expect(renderScss(tokens)).toContain('$fs-hero: var(--fs-hero);');
  });

  it('defines the variables the portfolio references but never defined', () => {
    const scss = renderScss(tokens);
    expect(scss).toContain('$easing-smooth: cubic-bezier(0.19, 1, 0.22, 1);');
    expect(scss).toContain('$transition-secondary:');
  });

  it('defines the camelCase names the 205 portfolio call sites use', () => {
    const scss = renderScss(tokens);
    for (const name of [
      '$white',
      '$black',
      '$primary',
      '$textDark',
      '$textGrey',
      '$textLight',
      '$navigationColor',
      '$borderColor',
      '$gold',
      '$softGold',
      '$holyWhite',
    ]) {
      expect(scss).toContain(`${name}: `);
    }
  });

  it('never declares the same SCSS variable twice', () => {
    const names = [...renderScss(tokens).matchAll(/^\$([a-zA-Z][\w-]*):/gm)].map((m) => m[1]);
    expect(names).toHaveLength(new Set(names).size);
  });
});

describe('committed outputs are in sync with the source', () => {
  const dir = join(__dirname, '..');

  it('tokens.css matches a fresh render', () => {
    expect(readFileSync(join(dir, 'tokens.css'), 'utf8')).toBe(renderCss(tokens));
  });

  it('_tokens.scss matches a fresh render', () => {
    expect(readFileSync(join(dir, '_tokens.scss'), 'utf8')).toBe(renderScss(tokens));
  });
});
