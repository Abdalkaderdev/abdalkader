# Portfolio Foundation — Design Token Consolidation & Asset Diet

**Date:** 2026-08-06
**Status:** Approved design, ready for planning
**Phase:** A of 3 (A: Foundation → B: Credibility → C: Motion & visual upgrade)

## Context

`abdalkader.dev` is a Next.js 14 Pages Router app in a pnpm/Turborepo monorepo alongside
`cv`, `blog`, and `docs` apps and a shared `@abdalkader/ui` package. Two problems block
further design work:

1. **Four token sources, three of them dead.** Design values are authored in four places.
   Only one actually reaches the browser. Adding anything new makes it five.
2. **~70MB of static assets.** 45MB of video and 25MB of images, on a page that also
   loads Three.js, GSAP, Framer Motion, and Lenis.

Phase A fixes both so that Phase B (content credibility) and Phase C (visual upgrade)
build on one foundation instead of forking it further.

Phase A makes **no content changes, adds no sections, and restyles nothing.** Those are
explicitly B and C. Nothing is stated on the site that is not independently verifiable.

## Current state

### Which token files are live (measured, not assumed)

Determined by tracing imports from `packages/ui/src/index.ts` through the rollup
`extract: 'styles.css'` bundle to the portfolio's `import '@abdalkader/ui/dist/styles.css'`.

| File | Vars | Imported by | Status |
|---|---|---|---|
| `src/styles/design-tokens.css` | 116 | `src/index.ts`, `src/styles/index.ts` | **LIVE** — the only token file that renders |
| `src/styles/base.css` | — | `src/index.ts` | LIVE |
| `src/styles/portfolio-components.css` | — | `src/index.ts`, `src/styles/index.ts` | LIVE |
| `src/tokens/designTokens.css` | 195 | nothing | **DEAD** |
| `src/tokens/designTokens.ts` | — | nothing | **DEAD** |
| `src/styles/variables.css` | 37 | nothing | **DEAD** |
| `src/styles/design-system.css` | — | nothing | **DEAD** |
| `src/styles/design-tokens.js` / `.ts` | — | nothing | **DEAD** |
| `apps/portfolio/styles/variables.scss` | — | every portfolio stylesheet | LIVE (SCSS, separate) |

The largest and best-organised token file — `designTokens.css`, 195 vars, with component
tokens and accessibility overrides — has never been wired up. This inverts the obvious
assumption that it was authoritative.

### Consequences of the dead file being dead

Three things believed to be working are not:

1. **`prefers-reduced-motion` token overrides are inert.** `--animation-duration-*: 0s`
   exists only in `designTokens.css`. The portfolio does handle reduced motion in JS
   (`useReducedMotion`) and in 21 SCSS files, so this is not a total gap — but the
   token-level layer contributes nothing today.
2. **`prefers-contrast: high` overrides are inert.** `--color-primary: #ff6600` and
   `--color-background: #ffffff` never apply.
3. **Component tokens are inert.** `--button-*`, `--badge-*` and similar resolve to
   nothing; components fall back to their own values.

### Values that actually render

From `design-tokens.css`:

```
--border-radius: 12px          --breakpoint-lg: 1080px    --color-primary: #f44e00
--border-radius-sm: 6px        --breakpoint-md: 840px     --color-primary-light: #fa7300
--color-border: rgb(37, 37, 37)  --breakpoint-sm: 600px
```

`--border-radius-lg` is **not defined** in the live file — it exists only in dead files,
so there is no conflict to resolve.

`design-tokens.css` carries responsive `:root` overrides in `@media (max-width: 1080px |
840px | 600px)` blocks at lines 109–127 and again at 285–300. These are what `clamp()`
replaces. It has no `prefers-reduced-motion` or `prefers-contrast` blocks.

### Conflict resolution principle

**Whatever renders today wins.** Consolidation is therefore visually neutral by
construction, and any visual change in Phase A is attributable to the fluid scale or the
asset work — never to token merging.

| Token | Live value | Dead-file value | Resolution |
|---|---|---|---|
| `--border-radius` | `12px` | `0.375rem` | `12px` |
| `--border-radius-sm` | `6px` | `0.25rem` | `6px` |
| `--breakpoint-lg` | `1080px` | `1200px` | `1080px` — also matches every portfolio SCSS mixin |
| `--color-border` | `rgb(37, 37, 37)` | `#252525` | Same colour. Standardise on `#252525`. |
| `--color-primary` | `#f44e00` | `#f44e00` | No conflict |

Values that exist **only** in dead files are adopted only where listed explicitly below.
Everything else in those files is deleted rather than silently activated.

### Deliberate behaviour changes

These are the only intentional non-visual-parity changes in Phase A. Each is a genuine
improvement that consolidation makes cheap, and each is listed so it is reviewable rather
than incidental:

1. **Activate the `prefers-reduced-motion` token overrides.** Harvested from the dead
   file into the live source. Complements the existing JS and SCSS handling.
2. **Activate the `prefers-contrast: high` overrides.** Currently no high-contrast
   support exists at the token layer at all.

Component tokens (`--button-*`, `--badge-*`) are **not** activated in Phase A — wiring
them up would change component rendering, which is Phase C's remit.

### Asset weight

```
apps/portfolio/public/videos    45M
apps/portfolio/public/images    25M
```

`VideoBackground` is currently mounted on the home hero, about hero, projects, and
contact pages.

### Call-site counts (measured)

| Pattern | Count | Implication |
|---|---|---|
| SCSS colour functions on SCSS vars — `rgba($white, …)`, `lighten($primary, …)` | 205 | **Cannot** become CSS custom properties. `rgba(var(--x), 0.5)` is invalid SCSS. |
| Size/spacing mixin includes — `font-4_5`, `font-1`, `mT2`, `section`, … | 117 | Can go fluid without touching a single call site, by rewriting mixin bodies. |

This split is the central constraint of the design.

## Architecture

### One source, two generated outputs

`packages/ui/src/tokens/tokens.ts` becomes the only file where a design value is
authored. A generate script emits two artifacts, both committed and both build-verified:

```
tokens.ts  ──generate──┬──▶  tokens.css     CSS custom properties; sizes as clamp()
                       └──▶  _tokens.scss   SCSS variables; colours as literal hex
```

| Output | Contents | Consumers |
|---|---|---|
| `tokens.css` | All tokens as custom properties. Sizes and spacing as `clamp()`. Includes the newly-activated `prefers-reduced-motion` and `prefers-contrast` blocks. | Browser, `packages/ui` components, `cv`, `blog` |
| `_tokens.scss` | Colour tokens as **literal** hex/rgb so SCSS colour functions keep working. Size tokens as `var(--…)` references. | `apps/portfolio` (all 205 colour call sites) |

Colours are literal in SCSS; sizes are CSS custom properties. Sizes are never passed to
SCSS colour functions, so nothing breaks.

**Why generated rather than hand-maintained:** hand-syncing is the practice that produced
the current four-file state. The generate step is the cheapest available guarantee that
the two outputs cannot drift.

`src/index.ts` and `src/styles/index.ts` are repointed from `design-tokens.css` to the
generated `tokens.css`.

### Files removed

- `src/styles/design-tokens.css` — contents become the basis of `tokens.ts` (it holds the
  currently-rendered values)
- `src/tokens/designTokens.css` — harvested for the two accessibility override blocks,
  then deleted
- `src/tokens/designTokens.ts`, `src/styles/variables.css`, `src/styles/design-system.css`,
  `src/styles/design-tokens.js`, `src/styles/design-tokens.ts` — dead, deleted outright

`base.css` and `portfolio-components.css` are live and kept **unchanged** in this phase.

### The fluid scale

The responsive `:root` media-query blocks in `design-tokens.css` and the hard breakpoint
overrides inside the portfolio's SCSS mixins are both replaced by `clamp()`.

Mixin **names and signatures do not change.** Only their bodies do:

```scss
// before — three fixed steps
@mixin font-4_5 {
    font-size: 4.5rem;
    @media (max-width: 1080px) { font-size: 3.2rem; }
    @media (max-width: 600px)  { font-size: 2.5rem; }
}

// after — one fluid expression
@mixin font-4_5 {
    font-size: var(--fs-hero);
}
```

All 117 call sites are untouched and become fluid simultaneously.

**Endpoint rule:** each token's `clamp()` ceiling is the current desktop value and its
floor is the current 600px value, so the change is interpolation between sizes already in
use — not a redesign.

| Token | Replaces | Ceiling → floor |
|---|---|---|
| `--fs-hero` | `font-4_5` | 4.5rem → 2.5rem |
| `--fs-h2` | `font-2_75` | 2.75rem → 1.8rem |
| `--fs-h3` | `font-1_8` | 1.8rem → 1.2rem |
| `--fs-body` | `font-1` | 1rem → 0.8rem |
| `--fs-micro` | `font0_7` | 0.7rem (fixed today; gains a small fluid range) |
| `--space-4` … `--space-1` | `mT4`–`mT1` | 8rem → 3rem, 3rem → 2rem, 2rem → 1rem, 1rem → 0.8rem |
| `--pad-section` | `section`, `paddingAround` | 2rem → 1rem |

Exact `clamp()` coefficients are **computed and visually verified during
implementation**, not fixed here. Verification widths: 320, 480, 600, 840, 1080, 1440,
1920px. Preserving the measured endpoints is the requirement; middle coefficients that
no one has rendered do not belong in a spec.

Two defects fixed incidentally:

- **Sub-320px support.** The audit flagged 480px as the smallest breakpoint. A `clamp()`
  floor applies at every width below its crossover, so no new breakpoint is needed.
- **Undefined SCSS variables.** `$easing-smooth` and `$transition-secondary` are
  referenced but never defined. They gain real definitions in the single source.

### Asset diet

**Video** — home hero only.

- Re-encode to H.264 `.mp4` plus a WebM sibling; **target ≤3MB combined.**
- Add a `poster` frame so first paint does not wait on video.
- Remove `VideoBackground` from the about hero, projects, and contact pages. Those pages
  fall back to the existing `ThreeBackground`, already mounted and dynamically imported.
- Delete the now-unreferenced video files.

**Images** — convert PNG to WebP at q80, largest first: `about2`, `virtual`, `head`,
`serviceCard`. `next/image` already serves these, so only source files change.

**Target:** ~70MB → ~8MB.

### Cursor-spotlight reveal (projects grid)

One visible change in Phase A, so the phase is not purely infrastructural. Adapted from
the MotionSites reference but **not** implemented as that prompt specifies.

The reference redraws a canvas radial gradient each frame and exports it via
`toDataURL()` as a CSS mask — a canvas readback, a base64 encode, and a mask re-parse
every frame. Unacceptable on a page already running Three.js, GSAP, Framer Motion, and
Lenis.

Implementation instead:

```
mask-image: radial-gradient(circle var(--spot-r) at var(--mx) var(--my), …)
```

- `--mx` / `--my` updated in a `requestAnimationFrame`-throttled `pointermove` handler.
- The reference's 0.1 easing factor applied to two numbers in JS. No canvas, no
  per-frame serialisation.
- `--spot-r` is a `clamp()` token, consistent with the rest of the scale.
- Disabled under `prefers-reduced-motion` and on coarse pointers (`@media (pointer: coarse)`).
- Uses the portfolio's own project images. The reference's `images.higgs.ai/...` URLs
  belong to a third party's CDN account and are not used.

## Testing & verification

| Check | Passes when |
|---|---|
| `pnpm build` (all four apps) | Exit 0. Proves the generated `_tokens.scss` satisfies all 205 colour call sites — one unresolved SCSS colour function fails the build. |
| `pnpm typecheck` | Exit 0. Covers `tokens.ts` and the generate script. |
| `pnpm test` | Existing Jest suite (3 components, 4 hooks, 5 util modules) still green. |
| Generate-script idempotence | Running the generator twice yields no diff. A unit test asserts committed outputs match a fresh generation, so drift fails CI rather than shipping. |
| Token parity | Every `var(--…)` consumed anywhere resolves. `$easing-smooth` and `$transition-secondary` resolve. |
| No dead-token resurrection | No token that existed **only** in a dead file appears in the output, except the two accessibility blocks listed under Deliberate behaviour changes. |
| Visual regression | Screenshots at 320/480/600/840/1080/1440/1920px vs pre-change captures, for portfolio + cv + blog. Differences must be attributable to fluid interpolation — no layout breakage, no clipped text. |
| Asset budget | `du -sh public/videos public/images` totals ≤8MB. |
| Reduced motion | With `prefers-reduced-motion: reduce`, animation duration tokens resolve to `0s` and the spotlight is inert. This is a **new** capability — verify it now works, rather than that it still works. |
| High contrast | With `prefers-contrast: high`, `--color-primary` resolves to `#ff6600`. Also new. |

## Risks

| Risk | Mitigation |
|---|---|
| A value changes because a conflict was resolved wrongly | Resolution principle is "whatever renders today wins", so consolidation is visually neutral by construction. The five conflicts are enumerated with the live value recorded. |
| Activating the accessibility overrides has unintended visual effects | Both are behind media queries that are off by default. Verified explicitly in the two dedicated checks. High-contrast changes `--color-primary`, which is widely used — reviewed under an emulated high-contrast setting before merge. |
| `cv` / `blog` regress — they consume the `ui` bundle and are less exercised | Both are in the `pnpm build` gate and both get screenshot checks. At 3 and 5 pages they are small enough to review fully. |
| Fluid interpolation looks wrong at an unchecked width | Seven verification widths spanning 320–1920px, including 600 and 1080 where the old and new curves must meet. |
| Removing video from three pages leaves them flat | `ThreeBackground` is already mounted. Reviewed per page; if a page genuinely needs more it is noted for Phase C rather than solved by re-adding 15MB. |
| Scope creep into restyling | Phase A changes token plumbing, asset weight, and one scoped effect. Any visual improvement not a direct consequence of those is deferred to Phase C. |

## Out of scope

- Content, copy, metrics, testimonials, skills, project hierarchy → **Phase B**
- New sections (FAQ, 404, testimonials), restyling, further motion → **Phase C**
- Wiring up the dead component tokens (`--button-*`, `--badge-*`) → **Phase C**
- The ~50 stale root-level markdown files and ~250 committed screenshots → separate
  cleanup, noted not bundled
- `apps/old` (empty) and the README's references to a non-existent `apps/storybook` and a
  Hexo blog → noted for the docs cleanup

## Definition of done

1. `packages/ui/src/tokens/tokens.ts` is the only authored token source; all seven
   superseded files are deleted; `src/index.ts` imports the generated `tokens.css`.
2. `tokens.css` and `_tokens.scss` are generated, committed, and covered by the
   idempotence test.
3. All 117 size/spacing mixin call sites and all 205 colour call sites are unmodified and
   building.
4. Typography and spacing are fluid; no hard breakpoint overrides remain in the size
   mixins; layout holds from 320px to 1920px.
5. Reduced-motion and high-contrast token overrides are active and verified.
6. `public/videos` + `public/images` ≤ 8MB, video on the home hero only.
7. The cursor-spotlight reveal is live on the projects grid, with no per-frame canvas
   serialisation, inert under reduced motion and coarse pointers.
8. Every check in Testing & verification passes.
