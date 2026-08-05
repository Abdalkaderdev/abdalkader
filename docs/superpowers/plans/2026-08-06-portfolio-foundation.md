# Portfolio Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse four design-token sources into one generated source of truth, convert typography and spacing to fluid `clamp()`, and cut static assets from ~70MB to ~8MB.

**Architecture:** `packages/ui/src/tokens/tokens.ts` becomes the only file where a design value is authored. A Node generate script emits `tokens.css` (CSS custom properties, sizes as `clamp()`) and `_tokens.scss` (SCSS variables, colours as literal hex so SCSS colour functions keep compiling). The portfolio's existing SCSS mixins are rewritten internally to consume the fluid tokens, so all 117 mixin call sites and all 205 colour call sites stay untouched.

**Tech Stack:** TypeScript, Node (generate script), Rollup + PostCSS, SCSS, Next.js 14 Pages Router, Vitest (`packages/ui`), Jest (`apps/portfolio`), ffmpeg, sharp.

## Global Constraints

- Package manager is **pnpm 8.15.1**; Node **>=18**. Never use `npm` or `yarn`.
- **Conflict resolution rule: whatever renders today wins.** Consolidation must be visually neutral. Live values come from `packages/ui/src/styles/design-tokens.css`.
- Confirmed live token values: `--border-radius: 12px`, `--border-radius-sm: 6px`, `--breakpoint-sm: 600px`, `--breakpoint-md: 840px`, `--breakpoint-lg: 1080px`, `--color-border: rgb(37, 37, 37)`, `--color-primary: #f44e00`, `--color-primary-light: #fa7300`.
- **Do NOT activate the `prefers-color-scheme: light` block** found in the dead `designTokens.css`. It sets `--color-background: #ffffff`. The portfolio is deliberately dark; activating it would invert the site for every visitor whose OS prefers light. Only `prefers-reduced-motion` and `prefers-contrast: high` are activated.
- Do **not** wire up the dead component tokens (`--button-*`, `--badge-*`). Phase C.
- Fluid range for every `clamp()`: **600px (37.5rem) → 1440px (90rem)**.
- No content, copy, metric, or claim changes anywhere. Phase B owns those.
- No commit may contain Claude/AI attribution — no `Co-Authored-By`, no generated-with footer.
- Mixin names and signatures in `apps/portfolio/styles/variables.scss` must not change.

## Deviations from the spec, discovered during planning

Recorded here because the spec was written before these were measured:

1. `design-tokens.css` is **not purely tokens** — it also holds utility classes, four `@keyframes`, animation classes, scrollbar/selection/focus styling, and responsive display utilities. It cannot simply be deleted; Task 1 splits it first.
2. `VideoBackground` has **13 mount points across 12 files**, not 4. `Footer` mounts it, so video is on *every* page. The homepage has five.
3. A **third** accessibility block exists in the dead file — `prefers-color-scheme: light` — which must be excluded (see Global Constraints).
4. `loader-bg.mp4` (3.0MB) is **unreferenced** — free deletion.
5. `projects-bg.mp4` and `skills-bg.mp4` are **byte-identical** (md5 `8d5c59c6035f0740bb30374a3982b61a`) — deduplicate.
6. The `-md`/`-sm` token variants **are** referenced outside `design-tokens.css` — six times in `portfolio-components.css`. Collapsing them requires updating those six sites (Task 4).

## File Structure

**Created:**
- `packages/ui/src/tokens/tokens.ts` — single authored source. Exports `tokens` object.
- `packages/ui/src/tokens/generate.ts` — reads `tokens.ts`, writes both outputs.
- `packages/ui/src/tokens/tokens.css` — **generated**, do not hand-edit.
- `packages/ui/src/tokens/_tokens.scss` — **generated**, do not hand-edit.
- `packages/ui/src/tokens/__tests__/generate.test.ts` — idempotence + parity tests.
- `packages/ui/src/styles/utilities.css` — the non-token CSS split out of `design-tokens.css`.
- `apps/portfolio/hooks/useSpotlight.ts` — cursor-spotlight pointer tracking.

**Modified:**
- `packages/ui/src/index.ts:1-3` — repoint CSS imports.
- `packages/ui/src/styles/index.ts:7-8` — repoint CSS imports.
- `packages/ui/src/styles/portfolio-components.css:379,383,389,407,411,415` — six `-md`/`-sm` refs.
- `packages/ui/package.json` — add `generate:tokens` script, wire into `build`.
- `apps/portfolio/styles/variables.scss` — mixin bodies become fluid; add missing vars.
- 12 component files — remove 12 of 13 `VideoBackground` mounts.
- `apps/portfolio/components/ProjectCard/index.tsx` + `.module.scss` — spotlight.

**Deleted:** `packages/ui/src/tokens/designTokens.css`, `designTokens.ts`, `packages/ui/src/styles/design-tokens.css`, `design-tokens.js`, `design-tokens.ts`, `variables.css`, `design-system.css`.

---

### Task 1: Split non-token CSS out of the live token file

Pure refactor establishing a safety net: after this task the build output must be byte-identical apart from rule ordering.

**Files:**
- Create: `packages/ui/src/styles/utilities.css`
- Modify: `packages/ui/src/styles/design-tokens.css` (reduce to `:root` blocks only)
- Modify: `packages/ui/src/index.ts:1-3`, `packages/ui/src/styles/index.ts:7-8`

**Interfaces:**
- Consumes: nothing.
- Produces: `utilities.css` containing every non-`:root` rule formerly in `design-tokens.css`. `design-tokens.css` reduced to custom-property declarations only.

- [ ] **Step 1: Capture the current bundle as a baseline**

```bash
cd packages/ui && pnpm build && cp dist/styles.css /tmp/styles-baseline.css && wc -c /tmp/styles-baseline.css
```

- [ ] **Step 2: Create `utilities.css` with the non-token rules**

Move lines 133–301 of `design-tokens.css` verbatim into `packages/ui/src/styles/utilities.css`. That is: `.portfolio-gradient-text`, `.portfolio-button-primary` (+ `:hover`, `:focus-visible`), `.portfolio-input` (+ `:focus`), the four `@keyframes` (`portfolioFadeIn`, `portfolioSlideIn`, `portfolioFloat`, `portfolioGlow`), the `.portfolio-animate-*` classes, `.portfolio-stagger` and its ten `:nth-child` rules, the `::-webkit-scrollbar` rules, `::selection`, `:focus-visible`, and the three `.portfolio-hide-*` responsive utilities.

Prepend:

```css
/**
 * Abdalkader Design System — utility classes, keyframes, and global element styling.
 * Design tokens do not belong in this file; they live in their own token stylesheet.
 */
```

Worded to be true both now and after Task 2 — at this point `tokens.css` does not exist yet, so the comment must not name it.

- [ ] **Step 3: Reduce `design-tokens.css` to tokens only**

Delete lines 133–301 from `design-tokens.css`. What remains: the `:root` block (lines 7–106) and the three responsive `@media` blocks (lines 108–131).

- [ ] **Step 4: Repoint the imports**

`packages/ui/src/index.ts` lines 1–3 become:

```ts
import './styles/base.css';
import './styles/design-tokens.css';
import './styles/utilities.css';
import './styles/portfolio-components.css';
```

`packages/ui/src/styles/index.ts` lines 7–8 become:

```ts
import './design-tokens.css';
import './utilities.css';
import './portfolio-components.css';
```

- [ ] **Step 5: Verify the bundle is equivalent**

`rollup.config.js` sets `minimize: isProduction`, and plain `pnpm build` does not set `NODE_ENV=production` — so **comments survive into `dist/styles.css`**. The comparison must therefore strip comments first, or the header comment added in Step 2 would fail a check that is meant to police declarations.

```bash
cd packages/ui && pnpm build
strip() { perl -0777 -pe 's{/\*.*?\*/}{}gs' "$1" | tr -d '[:space:]' | fold -w1 | sort; }
diff <(strip /tmp/styles-baseline.css) <(strip dist/styles.css) && echo "EQUIVALENT"
```

Expected: `EQUIVALENT`. Comments are ignored; everything else is compared as a character multiset, so pure rule reordering passes while any added or dropped declaration fails.

If this prints differences, do **not** edit the baseline to make it pass — find the declaration you actually added or dropped.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/styles/utilities.css packages/ui/src/styles/design-tokens.css packages/ui/src/index.ts packages/ui/src/styles/index.ts
git commit -m "refactor(ui): split utility CSS out of design-tokens.css

design-tokens.css held utility classes, keyframes, and global element
styling alongside its token declarations. Separating them so the token
file can become a generated artifact."
```

---

### Task 2: Author the single token source and generate script

**Files:**
- Create: `packages/ui/src/tokens/tokens.ts`
- Create: `packages/ui/src/tokens/generate.ts`
- Create: `packages/ui/src/tokens/__tests__/generate.test.ts`
- Modify: `packages/ui/package.json`

**Interfaces:**
- Consumes: the live values enumerated in Global Constraints.
- Produces:
  - `tokens.ts` exports `const tokens: TokenSet` where
    `TokenSet = { colors: Record<string,string>; fluid: Record<string, FluidToken>; static: Record<string,string>; reducedMotion: Record<string,string>; highContrast: Record<string,string> }`
    and `FluidToken = { min: string; max: string; minVw?: string; maxVw?: string }`.
  - `generate.ts` exports `renderCss(t: TokenSet): string`, `renderScss(t: TokenSet): string`, and `fluidClamp(f: FluidToken): string`.

- [ ] **Step 1: Write the failing test**

Create `packages/ui/src/tokens/__tests__/generate.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { fluidClamp, renderCss, renderScss } from '../generate';
import { tokens } from '../tokens';

describe('fluidClamp', () => {
  it('computes a clamp with intercept and slope across 600px-1440px', () => {
    // 2.5rem at 600px, 4.5rem at 1440px
    // slope = (4.5-2.5)/(90-37.5) = 0.0380952rem per 1rem of vw -> 3.8095vw
    // intercept = 2.5 - 0.0380952*37.5 = 1.0714rem
    expect(fluidClamp({ min: '2.5rem', max: '4.5rem' }))
      .toBe('clamp(2.5rem, 1.0714rem + 3.8095vw, 4.5rem)');
  });

  it('emits a plain value when min equals max', () => {
    expect(fluidClamp({ min: '1rem', max: '1rem' })).toBe('1rem');
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

  it('emits the reduced-motion and high-contrast blocks', () => {
    const css = renderCss(tokens);
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('@media (prefers-contrast: high)');
  });

  it('never emits a prefers-color-scheme block', () => {
    expect(renderCss(tokens)).not.toContain('prefers-color-scheme');
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
    for (const name of ['$white', '$black', '$primary', '$textDark', '$textGrey',
                        '$textLight', '$navigationColor', '$borderColor',
                        '$gold', '$softGold', '$holyWhite']) {
      expect(scss).toContain(`${name}: `);
    }
  });

  it('never declares the same SCSS variable twice', () => {
    const names = [...renderScss(tokens).matchAll(/^\$([a-zA-Z][\w-]*):/gm)]
      .map((m) => m[1]);
    expect(names).toHaveLength(new Set(names).size);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
cd packages/ui && pnpm vitest run src/tokens
```

Expected: FAIL — `Cannot find module '../generate'`.

- [ ] **Step 3: Write `tokens.ts`**

```ts
export interface FluidToken {
  min: string;
  max: string;
  minVw?: string;
  maxVw?: string;
}

export interface TokenSet {
  colors: Record<string, string>;
  fluid: Record<string, FluidToken>;
  static: Record<string, string>;
  reducedMotion: Record<string, string>;
  highContrast: Record<string, string>;
}

/**
 * The single source of truth for every design value.
 * tokens.css and _tokens.scss are generated from this file — never hand-edit them.
 * Values marked "live" were measured from the previously-rendered bundle and must
 * not change in Phase A; consolidation is visually neutral by design.
 */
export const tokens: TokenSet = {
  colors: {
    // live
    'color-primary': '#f44e00',
    'color-primary-light': '#fa7300',
    'color-white': '#f8f8f8',
    'color-black': '#000',
    'color-text-dark': '#131313',
    'color-text-grey': '#787878',
    'color-text-light': '#a8a8a8',
    'color-navigation': '#2d2d2d59',
    'color-border': 'rgb(37, 37, 37)',
    'color-bg-primary': '#000',
    'color-bg-secondary': '#0a0a0a',
    'color-text-primary': '#f8f8f8',
    'color-text-secondary': '#787878',
    'color-accent': '#f44e00',
    // faith/spiritual accents, from apps/portfolio/styles/variables.scss
    'color-gold': '#d4af37',
    'color-soft-gold': '#f5f5dc',
    'color-holy-white': '#fafafa',
  },

  fluid: {
    // typography — ceiling is today's desktop value, floor is today's 600px value
    'fs-hero':   { min: '2.5rem',  max: '4.5rem'  }, // was font-4_5
    'fs-h2':     { min: '1.8rem',  max: '2.75rem' }, // was font-2_75
    'fs-h3':     { min: '1.2rem',  max: '1.8rem'  }, // was font-1_8
    'fs-body':   { min: '0.8rem',  max: '1rem'    }, // was font-1
    'fs-micro':  { min: '0.65rem', max: '0.7rem'  }, // was font0_7 (fixed before)
    // spacing — was mT4..mT1
    'space-4':   { min: '3rem',    max: '8rem'    },
    'space-3':   { min: '2rem',    max: '3rem'    },
    'space-2':   { min: '1rem',    max: '2rem'    },
    'space-1':   { min: '0.8rem',  max: '1rem'    },
    // layout
    'pad-section': { min: '1rem',  max: '2rem'    }, // was section/paddingAround
    'section-gap': { min: '6rem',  max: '10rem'   },
    // spotlight radius (Task 9)
    'spot-r':      { min: '10rem', max: '26rem'   },
  },

  static: {
    // typography
    'font-primary': "'PPNeueMontreal-Regular', sans-serif",
    'font-secondary': "'PPNeueMontreal-Medium', sans-serif",
    'font-pp-regular': "'PPNeueMontreal-Regular'",
    'font-pp-medium': "'PPNeueMontreal-Medium'",
    'line-height-tight': '0.9',
    'line-height-normal': '1',
    'line-height-relaxed': '1.2',
    // motion
    'transition-smooth': '0.8s cubic-bezier(0.19, 1, 0.22, 1)',
    'transition-fast': '0.3s ease-in-out',
    'transition-focus': '0.2s ease',
    'easing-smooth': 'cubic-bezier(0.19, 1, 0.22, 1)',
    'duration-slow': '0.8s',
    'duration-fast': '0.3s',
    'duration-focus': '0.2s',
    'stagger-delay': '0.003s',
    // non-fluid spacing steps retained for existing consumers
    'space-xs': '0.8rem',
    'space-sm': '1rem',
    'space-md': '1.5rem',
    'space-lg': '2rem',
    'space-xl': '3rem',
    'space-2xl': '5rem',
    'space-3xl': '6rem',
    'space-4xl': '8rem',
    'space-5xl': '10rem',
    // layout — live values
    'container-max-width': '1200px',
    'border-radius': '12px',
    'border-radius-sm': '6px',
    'breakpoint-sm': '600px',
    'breakpoint-md': '840px',
    'breakpoint-lg': '1080px',
    // z-index
    'z-dropdown': '1000',
    'z-sticky': '1020',
    'z-fixed': '1030',
    'z-modal-backdrop': '1040',
    'z-modal': '1050',
    'z-popover': '1060',
    'z-tooltip': '1070',
    'z-toast': '1080',
    'z-loading': '5000000',
    // effects
    'shadow-glow': '0 0 20px rgba(244, 78, 0, 0.3)',
    'shadow-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    'shadow-focus': '0 0 0 2px #f44e00',
    'backdrop-blur': 'blur(10px)',
  },

  // Harvested from the previously-dead designTokens.css. NEW behaviour in Phase A.
  reducedMotion: {
    'duration-slow': '0s',
    'duration-fast': '0s',
    'duration-focus': '0s',
    'transition-smooth': 'none',
    'transition-fast': 'none',
    'transition-focus': 'none',
    'stagger-delay': '0s',
  },

  // Harvested from the previously-dead designTokens.css. NEW behaviour in Phase A.
  highContrast: {
    'color-primary': '#ff6600',
    'color-primary-light': '#ff8800',
    'color-text-primary': '#ffffff',
    'color-text-secondary': '#cccccc',
    'color-border': '#666666',
  },
};
```

- [ ] **Step 4: Write `generate.ts`**

```ts
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tokens, type FluidToken, type TokenSet } from './tokens';

const DEFAULT_MIN_VW = '37.5rem'; // 600px
const DEFAULT_MAX_VW = '90rem';   // 1440px

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
  Object.entries(o).map(([k, v]) => `${indent}--${k}: ${v};`).join('\n');

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
}

@media (prefers-reduced-motion: reduce) {
  :root {
${decls(t.reducedMotion, '    ')}
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
  const fluid = Object.keys(t.fluid).map((k) => `$${k}: var(--${k});`).join('\n');
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
```

- [ ] **Step 5: Add the generate script**

In `packages/ui/package.json`, add to `scripts` and make `build` depend on it:

```json
"generate:tokens": "tsx src/tokens/generate.ts",
"build": "pnpm generate:tokens && rollup -c",
```

Install the runner:

```bash
cd packages/ui && pnpm add -D tsx
```

- [ ] **Step 6: Run the generator and the tests**

```bash
cd packages/ui && pnpm generate:tokens && pnpm vitest run src/tokens
```

Expected: `tokens.css` and `_tokens.scss` created; all tests PASS.

- [ ] **Step 7: Add the idempotence test**

Append to `packages/ui/src/tokens/__tests__/generate.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('committed outputs are in sync with the source', () => {
  const dir = join(__dirname, '..');

  it('tokens.css matches a fresh render', () => {
    expect(readFileSync(join(dir, 'tokens.css'), 'utf8')).toBe(renderCss(tokens));
  });

  it('_tokens.scss matches a fresh render', () => {
    expect(readFileSync(join(dir, '_tokens.scss'), 'utf8')).toBe(renderScss(tokens));
  });
});
```

- [ ] **Step 8: Verify drift now fails**

```bash
cd packages/ui && pnpm vitest run src/tokens
```

Expected: PASS. Then confirm the guard works — append a stray line to `tokens.css`, re-run, expect FAIL, then `pnpm generate:tokens` to restore.

- [ ] **Step 9: Commit**

```bash
git add packages/ui/src/tokens packages/ui/package.json packages/ui/../../pnpm-lock.yaml
git commit -m "feat(ui): add generated design token pipeline

tokens.ts is now the only place a design value is authored. A generate
step emits tokens.css (CSS custom properties, fluid clamps) and
_tokens.scss (literal colours, so SCSS colour functions keep compiling).

An idempotence test asserts the committed outputs match a fresh render,
so the two artifacts cannot drift."
```

---

### Task 3: Repoint consumers and delete the dead files

**Files:**
- Modify: `packages/ui/src/index.ts`, `packages/ui/src/styles/index.ts`
- Modify: `packages/ui/src/styles/portfolio-components.css:379,383,389,407,411,415`
- Delete: `packages/ui/src/styles/design-tokens.css`, `design-tokens.js`, `design-tokens.ts`, `variables.css`, `design-system.css`, `packages/ui/src/tokens/designTokens.css`, `designTokens.ts`

**Interfaces:**
- Consumes: `tokens.css` from Task 2.
- Produces: a bundle whose only token source is the generated `tokens.css`.

- [ ] **Step 1: Confirm the dead files really are dead**

```bash
cd "$(git rev-parse --show-toplevel)"
for f in designTokens.css designTokens.ts variables.css design-system.css design-tokens.js design-tokens.ts; do
  printf "%-22s " "$f"
  c=$(grep -rl "$f" apps packages --include=*.ts --include=*.tsx --include=*.css --include=*.scss --include=*.js --include=*.mjs 2>/dev/null | grep -v node_modules | grep -v "/$f$" | tr '\n' ' ')
  echo "${c:-NOT IMPORTED}"
done
```

Expected: all six report `NOT IMPORTED`. If any reports a consumer, stop and reassess — the plan assumes they are unreferenced.

- [ ] **Step 2: Repoint the imports to the generated file**

`packages/ui/src/index.ts` sits at `src/`, so its token path is `./tokens/tokens.css`. Lines 1–4 become:

```ts
import './styles/base.css';
import './tokens/tokens.css';
import './styles/utilities.css';
import './styles/portfolio-components.css';
```

`packages/ui/src/styles/index.ts` sits one level deeper, so its path is `../tokens/tokens.css`. Lines 7–9 become:

```ts
import '../tokens/tokens.css';
import './utilities.css';
import './portfolio-components.css';
```

- [ ] **Step 3: Update the six `-md`/`-sm` references**

The `-md`/`-sm` variants no longer exist — the fluid tokens replace them. In `packages/ui/src/styles/portfolio-components.css`, inside its `@media` blocks:

| Line | Before | After |
|---|---|---|
| 379 | `font-size: var(--text-hero-md);` | `font-size: var(--fs-hero);` |
| 383 | `font-size: var(--text-large-md);` | `font-size: var(--fs-h2);` |
| 389 | `padding: var(--space-md) var(--section-padding-sm);` | `padding: var(--space-md) var(--pad-section);` |
| 407 | `font-size: var(--text-medium-md);` | `font-size: var(--fs-h3);` |
| 411 | `font-size: var(--text-base-md);` | `font-size: var(--fs-body);` |
| 415 | `padding: var(--space-sm) var(--section-padding-sm);` | `padding: var(--space-sm) var(--pad-section);` |

The fluid tokens already shrink with the viewport, so these `@media` overrides are now redundant. Leave the blocks in place for this task — removing them is a separate reviewable change and Task 4 verifies the fluid values first.

- [ ] **Step 4: Delete the dead files**

```bash
cd "$(git rev-parse --show-toplevel)/packages/ui/src"
git rm styles/design-tokens.css styles/design-tokens.js styles/design-tokens.ts \
       styles/variables.css styles/design-system.css \
       tokens/designTokens.css tokens/designTokens.ts
```

- [ ] **Step 5: Verify every referenced custom property still resolves**

```bash
cd "$(git rev-parse --show-toplevel)"
comm -23 \
  <(grep -rhoE 'var\(--[a-z0-9-]+' apps packages --include=*.css --include=*.scss --include=*.tsx 2>/dev/null | grep -v node_modules | sed 's/var(//' | sort -u) \
  <(grep -rhoE '^\s*--[a-z0-9-]+' packages/ui/src/tokens/tokens.css | tr -d ' ' | sort -u)
```

Expected: empty output. Any line printed is a `var()` with no definition — add it to `tokens.ts` and regenerate.

- [ ] **Step 6: Confirm no dead-file-only token was resurrected**

The dead files held ~130 tokens the live bundle never had. Only the two preference blocks may cross over.

```bash
cd "$(git rev-parse --show-toplevel)"
git show HEAD~1:packages/ui/src/tokens/designTokens.css 2>/dev/null \
  | grep -oE '^\s*--[a-z0-9-]+' | tr -d ' ' | sort -u > /tmp/dead-tokens.txt
git show HEAD~1:packages/ui/src/styles/design-tokens.css 2>/dev/null \
  | grep -oE '^\s*--[a-z0-9-]+' | tr -d ' ' | sort -u > /tmp/live-tokens.txt
comm -23 /tmp/dead-tokens.txt /tmp/live-tokens.txt > /tmp/dead-only.txt
grep -oE '^\s*--[a-z0-9-]+' packages/ui/src/tokens/tokens.css | tr -d ' ' | sort -u > /tmp/new-tokens.txt
echo "dead-only tokens now shipping (expect only motion/contrast names):"
comm -12 /tmp/dead-only.txt /tmp/new-tokens.txt
```

Expected: the printed list contains only names used by the reduced-motion and high-contrast blocks. Any `--button-*`, `--badge-*`, or `--color-background*` name appearing here means a dead token leaked in — remove it from `tokens.ts`.

- [ ] **Step 7: Build everything, including cv and blog**

```bash
cd "$(git rev-parse --show-toplevel)" && pnpm build && pnpm typecheck
```

Expected: exit 0 for all four apps. This is the gate proving the generated `_tokens.scss` satisfies the portfolio's 205 colour call sites.

`cv` and `blog` consume the `ui` bundle and are less exercised than the portfolio, so check them visually too. Serve each and screenshot at 375px and 1440px:

```bash
pnpm --filter @abdalkader/cv dev    # then the same for @abdalkader/blog
```

`cv` has one page; `blog` has index, categories, and a post. Confirm no colour shifted, no text is clipped, and no layout collapsed.

- [ ] **Step 8: Commit**

```bash
git add -A packages/ui/src
git commit -m "refactor(ui): consolidate onto the generated token file

Deletes six token files that nothing imported, including the 195-variable
designTokens.css that was never wired up. Repoints the bundle at the
generated tokens.css and migrates the six -md/-sm variant references in
portfolio-components.css onto the fluid tokens."
```

---

### Task 4: Make the portfolio typography fluid

**Files:**
- Modify: `apps/portfolio/styles/variables.scss`

**Interfaces:**
- Consumes: `$fs-hero`, `$fs-h2`, `$fs-h3`, `$fs-body`, `$fs-micro` from the generated `_tokens.scss`.
- Produces: the same five mixin names, now emitting single fluid values. No call site changes.

- [ ] **Step 1: Import the generated SCSS and remove the duplicated colours**

At the top of `apps/portfolio/styles/variables.scss`, replace lines 1–23 (the `$transition` / colour / skeuomorphic-helper block) with:

```scss
@use '@abdalkader/ui/src/tokens/_tokens.scss' as *;
@forward '@abdalkader/ui/src/tokens/_tokens.scss';

// Skeuomorphic helpers — portfolio-local, not design tokens.
$shadow-dark: rgba(0, 0, 0, 0.5);
$shadow-medium: rgba(0, 0, 0, 0.3);
$shadow-light: rgba(0, 0, 0, 0.15);
$highlight-strong: rgba(255, 255, 255, 0.3);
$highlight-medium: rgba(255, 255, 255, 0.15);
$highlight-subtle: rgba(255, 255, 255, 0.08);
```

Keep `$white: #f8f8f8;` and `$black: #000;` resolving through the generated file — `renderScss` strips the `color-` prefix, so `--color-white` becomes `$white` and `--color-black` becomes `$black`, matching the names the 205 call sites already use.

- [ ] **Step 2: Rewrite the five font mixins**

Replace lines 80–137 of `variables.scss`:

```scss
/*========== Fonts ==========*/
@mixin font-4_5 {
    font-size: $fs-hero;
    line-height: 0.9;
    font-weight: lighter;
    text-transform: uppercase;
}

@mixin font-2_75 {
    font-size: $fs-h2;
    line-height: 0.9;
    font-weight: lighter;
    text-transform: uppercase;
}

@mixin font-1_8 {
    font-size: $fs-h3;
    letter-spacing: 0.08rem;
    text-transform: uppercase;
    font-weight: lighter;
}

@mixin font-1 {
    font-size: $fs-body;
    line-height: 1;
    letter-spacing: 0.05rem;
    text-transform: uppercase;
    font-weight: lighter;
}

@mixin font0_7 {
    font-size: $fs-micro;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
}
```

Every `@media` override inside these mixins is gone — the `clamp()` handles it.

- [ ] **Step 3: Build and confirm no SCSS errors**

```bash
cd "$(git rev-parse --show-toplevel)" && pnpm build:portfolio
```

Expected: exit 0. A missing variable from Step 1 surfaces here as `Undefined variable`.

- [ ] **Step 4: Capture screenshots at all seven widths**

Start the dev server:

```bash
cd apps/portfolio && pnpm dev
```

Then drive the Playwright MCP browser: for each width in 320, 480, 600, 840, 1080, 1440, 1920, call `browser_resize` then `browser_take_screenshot` for `/`, `/about`, and `/projects`, saving to `docs/superpowers/plans/screens/after-<page>-<width>.png`.

Verify by inspection: no clipped or overflowing text, no horizontal scrollbar, headings scale smoothly.

Confirm the hero actually renders the expected size at the two former breakpoints:

```js
() => getComputedStyle(document.querySelector('h1')).fontSize
```

Expected: `40px` (2.5rem) at 600px wide, and roughly `58px` (~3.64rem) at 1080px. **The old 1080px value was 3.2rem / 51px, so the hero is intentionally larger mid-range** — that is the smoothing, not a regression. Anything outside 2.5rem–4.5rem is a bug.

- [ ] **Step 5: Commit**

```bash
git add apps/portfolio/styles/variables.scss
git commit -m "feat(portfolio): make typography fluid

The five font mixins now emit a single clamp() instead of three fixed
steps with media-query overrides. All 117 mixin call sites are unchanged.
Colour variables now resolve through the generated _tokens.scss."
```

---

### Task 5: Make spacing and layout fluid

**Files:**
- Modify: `apps/portfolio/styles/variables.scss`

**Interfaces:**
- Consumes: `$space-1`…`$space-4`, `$pad-section` from `_tokens.scss`.
- Produces: `section`, `paddingAround`, `mT1`–`mT4` mixins, unchanged names.

- [ ] **Step 1: Rewrite the layout mixins**

Replace the `@mixin section` and `@mixin paddingAround` definitions (lines 53–70 of the original file):

```scss
@mixin section {
    position: relative;
    padding-left: $pad-section;
    padding-right: $pad-section;
}

@mixin paddingAround {
    padding: $pad-section;
}
```

- [ ] **Step 2: Rewrite the margin mixins**

Replace lines 139–174:

```scss
/*========== Margins ==========*/
@mixin mT4 { margin-top: $space-4; }
@mixin mT3 { margin-top: $space-3; }
@mixin mT2 { margin-top: $space-2; }
@mixin mT1 { margin-top: $space-1; }
```

- [ ] **Step 3: Confirm no undefined variables remain**

```bash
cd "$(git rev-parse --show-toplevel)"
grep -rhoE '\$[a-zA-Z][a-zA-Z0-9_-]*' apps/portfolio --include=*.scss | sort -u > /tmp/used.txt
grep -hoE '^\$[a-zA-Z][a-zA-Z0-9_-]*' packages/ui/src/tokens/_tokens.scss apps/portfolio/styles/variables.scss | sort -u > /tmp/defined.txt
comm -23 /tmp/used.txt /tmp/defined.txt
```

Expected: empty, or only variables that are local `@each`/function parameters. `$easing-smooth` and `$transition-secondary` must **not** appear — they are now defined.

- [ ] **Step 4: Build and re-screenshot**

```bash
cd "$(git rev-parse --show-toplevel)" && pnpm build && pnpm test
```

Expected: exit 0; Jest suite green. Re-capture the seven widths and confirm vertical rhythm scales without collapsing at 320px.

- [ ] **Step 5: Commit**

```bash
git add apps/portfolio/styles/variables.scss
git commit -m "feat(portfolio): make spacing and section padding fluid

mT1-mT4, section, and paddingAround now emit fluid clamps. Also resolves
the long-standing undefined \$easing-smooth and \$transition-secondary
references, which now come from the generated token file."
```

---

### Task 6: Verify the newly-activated accessibility overrides

The tokens were emitted in Task 2; this task proves they actually take effect and that light-mode was **not** activated.

**Files:**
- Create: `packages/ui/src/tokens/__tests__/preferences.test.ts`

**Interfaces:**
- Consumes: `renderCss` from Task 2.
- Produces: regression tests pinning the three preference decisions.

- [ ] **Step 1: Write the failing test**

```ts
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
    expect(b).toContain('--duration-slow: 0s;');
    expect(b).toContain('--duration-fast: 0s;');
    expect(b).toContain('--transition-smooth: none;');
  });

  it('raises contrast of the primary colour under high contrast', () => {
    const b = block('prefers-contrast: high');
    expect(b).toContain('--color-primary: #ff6600;');
    expect(b).toContain('--color-border: #666666;');
  });

  it('does NOT ship a light colour scheme — the site is deliberately dark', () => {
    expect(css).not.toContain('prefers-color-scheme');
    expect(css).not.toContain('--color-bg-primary: #ffffff');
  });
});
```

- [ ] **Step 2: Run it**

```bash
cd packages/ui && pnpm vitest run src/tokens/__tests__/preferences.test.ts
```

Expected: PASS (Task 2 already emits these). If the light-mode assertion fails, remove the `prefers-color-scheme` block — it must never ship.

- [ ] **Step 3: Verify in a real browser**

With the portfolio running, use the Playwright MCP browser to emulate each preference and read the computed value:

```js
() => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()
```

Expected: `#f44e00` normally, `#ff6600` under emulated `prefers-contrast: high`. Under emulated `prefers-reduced-motion: reduce`, `--duration-slow` reads `0s`. Confirm the page background stays black under an emulated light colour-scheme preference.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/tokens/__tests__/preferences.test.ts
git commit -m "test(ui): pin the preference-query decisions

Reduced-motion and high-contrast token overrides existed only in a file
nothing imported, so they never applied. They are active now. The
prefers-color-scheme block from the same dead file is deliberately
excluded and asserted against — the portfolio is intentionally dark."
```

---

### Task 7: Video diet

**Files:**
- Modify (remove `VideoBackground` usage): `components/AboutPage/AboutHeroSection/index.tsx:7,61`, `components/ContactPage/index.tsx:8,59`, `components/Footer/index.tsx:5,25`, `components/HomePage/EnhancedSkillsSection/index.tsx:8,116`, `components/HomePage/ProjectSection/index.tsx:8,169,323`, `components/HomePage/ServiceSection/index.tsx:10,176`, `components/LordsPrayer/index.tsx:5,272`, `components/ProjectPage/EnhancedProjectHeroSection/index.tsx:5,77`, `components/ProjectPage/EnhancedProjectsSection/index.tsx:7,152,208`, `components/ProjectPage/ProjectsSection/index.tsx:10,113`, `pages/guidance.tsx:3,15`
- Keep: `components/HomePage/HeroSection/index.tsx:156`
- Delete: 9 of 10 files in `public/videos/`

**Interfaces:**
- Consumes: nothing.
- Produces: exactly one `VideoBackground` mount, on the homepage hero.

- [ ] **Step 1: Record the baseline**

```bash
cd apps/portfolio && du -sh public/videos public/images
```

Expected: `45M public/videos`, `25M public/images`.

- [ ] **Step 2: Remove the twelve mounts**

In each file listed above, delete the `import VideoBackground from '@/components/VideoBackground';` line and the entire `<VideoBackground ... />` JSX element. `ProjectSection` and `EnhancedProjectsSection` each have **two** elements — remove both.

Leave every other element in those components untouched. `ThreeBackground` already provides a backdrop where one is needed; do not add anything new.

- [ ] **Step 3: Verify exactly one mount remains**

```bash
cd apps/portfolio && grep -rn "<VideoBackground" --include=*.tsx components pages | grep -v node_modules
```

Expected: exactly one line — `components/HomePage/HeroSection/index.tsx`.

- [ ] **Step 4: Compress the surviving video and generate a poster**

```bash
cd apps/portfolio/public/videos
ffmpeg -y -i home-hero-bg.mp4 -vcodec libx264 -crf 30 -preset slow -movflags +faststart -an home-hero-bg.opt.mp4
ffmpeg -y -i home-hero-bg.mp4 -c:v libvpx-vp9 -crf 38 -b:v 0 -an home-hero-bg.webm
ffmpeg -y -i home-hero-bg.mp4 -ss 1 -vframes 1 -q:v 3 ../images/home-hero-poster.jpg
mv home-hero-bg.opt.mp4 home-hero-bg.mp4
ls -la home-hero-bg.mp4 home-hero-bg.webm
```

Expected: the two video files total ≤3MB. If over, raise `-crf` and re-run.

- [ ] **Step 5: Delete the nine unused videos**

```bash
cd apps/portfolio/public/videos
git rm about-bg.mp4 contact-bg.mp4 guidance-bg.mp4 loader-bg.mp4 particle-bg.mp4 \
       prayer-bg.mp4 projects-bg.mp4 services-bg.mp4 skills-bg.mp4
```

`loader-bg.mp4` was already unreferenced. `projects-bg.mp4` and `skills-bg.mp4` were byte-identical duplicates. `about-bg.mp4` alone was 18.7MB.

- [ ] **Step 6: Wire up the poster and the WebM source**

In `components/HomePage/HeroSection/index.tsx`, the surviving mount becomes:

```tsx
<VideoBackground
    src="/videos/home-hero-bg.mp4"
    poster="/images/home-hero-poster.jpg"
    opacity={0.3}
    overlay
    overlayDirection="radial"
    startTime={1}
    endTime={6}
/>
```

`VideoBackground` already accepts `poster` (see its `VideoBackgroundProps`). Do not add WebM plumbing to the component in this task — a `<source>` list is a component API change; note it for Phase C and ship the `.webm` file unreferenced, or delete it if the mp4 already meets budget.

- [ ] **Step 7: Verify the budget and the build**

```bash
cd apps/portfolio && du -sh public/videos && cd .. && cd .. && pnpm build:portfolio
```

Expected: `public/videos` ≤3MB; build exits 0.

- [ ] **Step 8: Check the twelve pages still look intentional**

Load `/`, `/about`, `/projects`, `/contact`, `/guidance`, `/prayer` and a project detail page. Each should still have a deliberate backdrop. Any page that now looks unfinished gets a note in the commit body for Phase C — **do not** re-add video to fix it.

- [ ] **Step 9: Commit**

```bash
git add -A apps/portfolio
git commit -m "perf(portfolio): reduce video from 45MB to under 3MB

VideoBackground had 13 mount points across 12 files, including Footer,
which put a video background on every page; the homepage alone had five.
Keeps one mount on the homepage hero with a poster frame.

Deletes nine videos: about-bg.mp4 was 18.7MB on its own, loader-bg.mp4
was unreferenced, and skills-bg.mp4 was a byte-identical duplicate of
projects-bg.mp4."
```

---

### Task 8: Convert images to WebP

**Files:**
- Modify: `apps/portfolio/public/images/*` and any `.tsx` referencing a converted file

**Interfaces:**
- Consumes: nothing.
- Produces: WebP sources; `next/image` handles delivery.

- [ ] **Step 1: Convert the eight largest PNG/JPEG files**

```bash
cd apps/portfolio/public/images
npx sharp-cli --input about2.png virtual.png head.png serviceCard.png jegr.png \
  project4_1.png project5_1.jpeg \
  --output . --format webp --quality 80
ls -la about2.webp virtual.webp head.webp serviceCard.webp
```

- [ ] **Step 2: Repoint references**

```bash
cd "$(git rev-parse --show-toplevel)/apps/portfolio"
grep -rln "about2.png\|virtual.png\|head.png\|serviceCard.png\|jegr.png\|project4_1.png\|project5_1.jpeg" \
  --include=*.tsx --include=*.ts --include=*.scss . | grep -v node_modules
```

For each file found, change the extension to `.webp`. Note `virtual.webp`, `head.webp` and `jegr.webp` may already exist and be referenced — confirm before overwriting, and if a `.webp` is already in use, delete the stale `.png` rather than converting it.

- [ ] **Step 3: Delete the superseded originals**

```bash
cd apps/portfolio/public/images && git rm about2.png virtual.png head.png serviceCard.png jegr.png project4_1.png project5_1.jpeg
```

- [ ] **Step 4: Verify no broken references and check the budget**

```bash
cd "$(git rev-parse --show-toplevel)" && pnpm build:portfolio && du -sh apps/portfolio/public/images apps/portfolio/public/videos
```

Expected: build exits 0; combined total ≤8MB. Then load `/`, `/about`, `/projects` and confirm no broken images in the browser console.

- [ ] **Step 5: Commit**

```bash
git add -A apps/portfolio/public/images apps/portfolio
git commit -m "perf(portfolio): convert the largest images to WebP

about2, virtual, head and serviceCard were 1.0-1.7MB PNGs each."
```

---

### Task 9: Cursor-spotlight reveal on project cards

**Files:**
- Create: `apps/portfolio/hooks/useSpotlight.ts`
- Create: `apps/portfolio/__tests__/hooks/useSpotlight.test.ts`
- Modify: `apps/portfolio/components/ProjectCard/index.tsx`
- Modify: `apps/portfolio/components/ProjectCard/ProjectCard.module.scss`

**Interfaces:**
- Consumes: `$spot-r` from `_tokens.scss`; `ProjectCardProps.thumbnail` (base image) and `ProjectCardProps.customBgImage` (revealed image), both already on the component.
- Produces: `useSpotlight(): { ref: RefObject<HTMLDivElement>, active: boolean }`. Sets `--mx` and `--my` (px strings) on the referenced element.

- [ ] **Step 1: Write the failing test**

```ts
import { renderHook, act } from '@testing-library/react';
import useSpotlight from '@/hooks/useSpotlight';

describe('useSpotlight', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((q: string) => ({
      matches: false, media: q, onchange: null,
      addEventListener: jest.fn(), removeEventListener: jest.fn(),
      addListener: jest.fn(), removeListener: jest.fn(), dispatchEvent: jest.fn(),
    }));
  });

  it('starts inactive', () => {
    const { result } = renderHook(() => useSpotlight());
    expect(result.current.active).toBe(false);
  });

  it('is permanently inactive when reduced motion is preferred', () => {
    window.matchMedia = jest.fn().mockImplementation((q: string) => ({
      matches: q.includes('reduced-motion'), media: q, onchange: null,
      addEventListener: jest.fn(), removeEventListener: jest.fn(),
      addListener: jest.fn(), removeListener: jest.fn(), dispatchEvent: jest.fn(),
    }));
    const { result } = renderHook(() => useSpotlight());
    const el = document.createElement('div');
    (result.current.ref as React.MutableRefObject<HTMLDivElement>).current = el;
    act(() => { el.dispatchEvent(new Event('pointerenter')); });
    expect(result.current.active).toBe(false);
  });

  it('activates on pointerenter and deactivates on pointerleave', () => {
    const { result } = renderHook(() => useSpotlight());
    const el = document.createElement('div');
    document.body.appendChild(el);
    (result.current.ref as React.MutableRefObject<HTMLDivElement>).current = el;
    act(() => { el.dispatchEvent(new Event('pointerenter')); });
    expect(result.current.active).toBe(true);
    act(() => { el.dispatchEvent(new Event('pointerleave')); });
    expect(result.current.active).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
cd apps/portfolio && pnpm jest __tests__/hooks/useSpotlight.test.ts
```

Expected: FAIL — cannot resolve `@/hooks/useSpotlight`.

- [ ] **Step 3: Write the hook**

```ts
import { useCallback, useEffect, useRef, useState } from 'react';

const EASE = 0.1; // matches the MotionSites reference

/**
 * Tracks the pointer inside an element and writes eased --mx/--my custom
 * properties for a CSS radial-gradient mask.
 *
 * Deliberately avoids the reference implementation's canvas + toDataURL()
 * per frame: that forces a readback, a base64 encode, and a mask re-parse
 * every frame. Two custom properties cost effectively nothing.
 */
export default function useSpotlight() {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    const target = useRef({ x: 0, y: 0 });
    const smooth = useRef({ x: 0, y: 0 });
    const raf = useRef<number | null>(null);
    const enabled = useRef(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const coarse = window.matchMedia('(pointer: coarse)');
        const sync = () => { enabled.current = !motion.matches && !coarse.matches; };
        sync();
        motion.addEventListener('change', sync);
        coarse.addEventListener('change', sync);
        return () => {
            motion.removeEventListener('change', sync);
            coarse.removeEventListener('change', sync);
        };
    }, []);

    const tick = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        smooth.current.x += (target.current.x - smooth.current.x) * EASE;
        smooth.current.y += (target.current.y - smooth.current.y) * EASE;
        el.style.setProperty('--mx', `${smooth.current.x}px`);
        el.style.setProperty('--my', `${smooth.current.y}px`);
        raf.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onEnter = () => {
            if (!enabled.current) return;
            setActive(true);
            if (raf.current === null) raf.current = requestAnimationFrame(tick);
        };
        const onMove = (e: PointerEvent) => {
            if (!enabled.current) return;
            const r = el.getBoundingClientRect();
            target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        };
        const onLeave = () => {
            setActive(false);
            if (raf.current !== null) {
                cancelAnimationFrame(raf.current);
                raf.current = null;
            }
        };

        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
            el.removeEventListener('pointerenter', onEnter);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
            if (raf.current !== null) cancelAnimationFrame(raf.current);
        };
    }, [tick]);

    return { ref, active };
}
```

- [ ] **Step 4: Run the test**

```bash
cd apps/portfolio && pnpm jest __tests__/hooks/useSpotlight.test.ts
```

Expected: PASS.

- [ ] **Step 5: Wire it into `ProjectCard`**

Add the import and hook, and a reveal layer. Inside the component, after the existing `useState` calls:

```tsx
import useSpotlight from '@/hooks/useSpotlight';
// ...
const { ref: spotRef, active: spotActive } = useSpotlight();
```

Wrap the card's existing thumbnail area in `ref={spotRef}` and add the reveal layer as its last child, rendered only when both images exist:

```tsx
{customBgImage && thumbnail && (
    <div
        className={`${styles.spotlight} ${spotActive ? styles.spotlightActive : ''}`}
        style={{ backgroundImage: `url(${customBgImage})` }}
        aria-hidden="true"
    />
)}
```

- [ ] **Step 6: Add the mask styles**

Append to `ProjectCard.module.scss`:

```scss
.spotlight {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    // Soft-edged circular reveal following the pointer. Gradient stops mirror
    // the MotionSites reference; the mask is pure CSS, no canvas readback.
    --mx: 50%;
    --my: 50%;
    mask-image: radial-gradient(
        circle $spot-r at var(--mx) var(--my),
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 40%,
        rgba(0, 0, 0, 0.75) 60%,
        rgba(0, 0, 0, 0.4) 75%,
        rgba(0, 0, 0, 0.12) 88%,
        rgba(0, 0, 0, 0) 100%
    );
    -webkit-mask-image: radial-gradient(
        circle $spot-r at var(--mx) var(--my),
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 40%,
        rgba(0, 0, 0, 0.75) 60%,
        rgba(0, 0, 0, 0.4) 75%,
        rgba(0, 0, 0, 0.12) 88%,
        rgba(0, 0, 0, 0) 100%
    );
}

.spotlightActive {
    opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
    .spotlight { display: none; }
}

@media (pointer: coarse) {
    .spotlight { display: none; }
}
```

- [ ] **Step 7: Verify behaviour and cost in the browser**

Build and load `/projects`. Confirm: hovering a card reveals the second image under a soft circle that follows the cursor with visible easing; leaving fades it out. In DevTools Performance, record a two-second hover sweep and confirm no long tasks over 50ms and a steady 60fps. Then emulate `prefers-reduced-motion: reduce` and confirm the layer is absent from the box model.

- [ ] **Step 8: Run the whole suite and build**

```bash
cd "$(git rev-parse --show-toplevel)" && pnpm build && pnpm typecheck && pnpm test
```

Expected: all exit 0.

- [ ] **Step 9: Commit**

```bash
git add apps/portfolio/hooks/useSpotlight.ts apps/portfolio/__tests__/hooks/useSpotlight.test.ts apps/portfolio/components/ProjectCard
git commit -m "feat(portfolio): add cursor-spotlight reveal to project cards

Reveals a card's secondary image through a soft circular mask that eases
toward the pointer. Implemented with a CSS radial-gradient mask driven by
two custom properties rather than the reference approach of re-exporting
a canvas via toDataURL() every frame, which would have added a readback
and a base64 encode per frame to a page already running Three.js, GSAP,
Framer Motion and Lenis.

Inert under prefers-reduced-motion and on coarse pointers."
```

---

## Final verification

Run after Task 9. Every item is from the spec's Definition of Done.

- [ ] `pnpm build` — all four apps exit 0
- [ ] `pnpm typecheck` — exit 0
- [ ] `pnpm test` — portfolio Jest and ui Vitest green
- [ ] `pnpm --filter @abdalkader/ui vitest run src/tokens` — idempotence and preference tests pass
- [ ] Only `tokens.ts` authors values; the seven superseded files are gone:
      `git ls-files packages/ui/src | grep -E 'designTokens|design-tokens|variables.css|design-system'` returns nothing
- [ ] `git grep -c '@include font-\|@include mT\|@include section\|@include paddingAround' -- 'apps/portfolio/**/*.module.scss'` still totals 117
- [ ] No undefined `var()` — the `comm` check from Task 3 Step 5 returns empty
- [ ] Layout holds at 320/480/600/840/1080/1440/1920px on `/`, `/about`, `/projects`
- [ ] `cv` (1 page) and `blog` (index, categories, a post) render unchanged at 375px and 1440px
- [ ] No dead-file-only token ships except the motion/contrast names — Task 3 Step 6 check
- [ ] `du -sh apps/portfolio/public/videos apps/portfolio/public/images` totals ≤8MB
- [ ] Exactly one `<VideoBackground` mount in the codebase
- [ ] `--color-primary` computes to `#ff6600` under emulated `prefers-contrast: high`
- [ ] `--duration-slow` computes to `0s` under emulated `prefers-reduced-motion: reduce`
- [ ] Page background stays black under an emulated light colour-scheme preference
- [ ] Spotlight works on `/projects`, holds 60fps, absent under reduced motion and coarse pointers
- [ ] No commit in the branch contains AI attribution:
      `git log origin/main..HEAD --format=%B | grep -iE 'co-authored-by: claude|generated with|claude\.ai/code'` returns nothing
