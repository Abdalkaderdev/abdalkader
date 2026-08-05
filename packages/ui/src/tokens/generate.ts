import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tokens, type FluidToken, type TokenSet } from './tokens';

const DEFAULT_MIN_VW = '37.5rem'; // 600px
const DEFAULT_MAX_VW = '90rem'; // 1440px

const rem = (v: string): number => parseFloat(v);
const round = (n: number): number => Math.round(n * 10000) / 10000;

/**
 * Linear interpolation between two sizes across a viewport range, expressed as
 * clamp(min, intercept + slope*vw, max). Returns a plain value when min === max.
 */
export function fluidClamp(f: FluidToken): string {
  if (f.min === f.max) return f.min;
  const minVw = rem(f.minVw ?? DEFAULT_MIN_VW);
  const maxVw = rem(f.maxVw ?? DEFAULT_MAX_VW);
  const slope = (rem(f.max) - rem(f.min)) / (maxVw - minVw);
  const intercept = rem(f.min) - slope * minVw;
  return `clamp(${f.min}, ${round(intercept)}rem + ${round(slope * 100)}vw, ${f.max})`;
}

const decls = (o: Record<string, string>, indent = '  '): string =>
  Object.entries(o)
    .map(([k, v]) => `${indent}--${k}: ${v};`)
    .join('\n');

export function renderCss(t: TokenSet): string {
  const fluid = Object.entries(t.fluid)
    .map(([k, f]) => `  --${k}: ${fluidClamp(f)};`)
    .join('\n');

  return `/**
 * GENERATED FILE — do not edit.
 * Source: packages/ui/src/tokens/tokens.ts
 * Regenerate: pnpm --filter @abdalkader/ui generate:tokens
 */

:root {
${decls(t.colors)}

${decls(t.static)}

${fluid}

  /* Deprecated aliases — retire in Phase C by migrating their call sites. */
${decls(t.aliases)}
}

@media (prefers-reduced-motion: reduce) {
  :root {
${decls(t.reducedMotion, '    ')}
  }
}

/* 'more' is the value defined by Media Queries Level 5. 'high' was an early
   draft name that no current engine matches — it is emitted second, purely as
   a fallback for older engines that shipped the draft spelling. */
@media (prefers-contrast: more) {
  :root {
${decls(t.highContrast, '    ')}
  }
}

@media (prefers-contrast: high) {
  :root {
${decls(t.highContrast, '    ')}
  }
}
`;
}

export function renderScss(t: TokenSet): string {
  // Colours literal — SCSS colour functions (rgba/lighten) cannot take var().
  const colors = Object.entries(t.colors)
    .map(([k, v]) => `$${k.replace(/^color-/, '')}: ${v};`)
    .join('\n');
  // Sizes reference the custom properties so one value drives both outputs.
  const fluid = Object.keys(t.fluid)
    .map((k) => `$${k}: var(--${k});`)
    .join('\n');
  const statics = Object.entries(t.static)
    .map(([k, v]) => `$${k}: ${v};`)
    .join('\n');

  return `// GENERATED FILE — do not edit.
// Source: packages/ui/src/tokens/tokens.ts
// Regenerate: pnpm --filter @abdalkader/ui generate:tokens
//
// Colours are literal so rgba()/lighten() keep compiling.
// Sizes are var() references to the fluid clamps in tokens.css.

${colors}

${statics}

${fluid}

// camelCase aliases. The loop above emits kebab-case ($text-dark, $soft-gold),
// but the portfolio's 205 call sites use camelCase. Only names the loop does
// NOT already produce appear here — $gold is emitted identically above and must
// not be repeated.
$transition: ${t.static['transition-smooth']};
$transition-secondary: ${t.static['transition-fast']};
$textDark: ${t.colors['color-text-dark']};
$textGrey: ${t.colors['color-text-grey']};
$textLight: ${t.colors['color-text-light']};
$navigationColor: ${t.colors['color-navigation']};
$borderColor: ${t.colors['color-border']};
$softGold: ${t.colors['color-soft-gold']};
$holyWhite: ${t.colors['color-holy-white']};
`;
}

if (require.main === module) {
  const dir = __dirname;
  writeFileSync(join(dir, 'tokens.css'), renderCss(tokens), 'utf8');
  writeFileSync(join(dir, '_tokens.scss'), renderScss(tokens), 'utf8');
  // eslint-disable-next-line no-console
  console.log('Generated tokens.css and _tokens.scss');
}
