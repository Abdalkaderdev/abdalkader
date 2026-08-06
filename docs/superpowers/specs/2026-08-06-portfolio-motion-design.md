# Portfolio Motion & Visual Upgrade — Phase C Design

**Date:** 2026-08-06
**Status:** Approved design
**Phase:** C of 3 (A: Foundation ✅ → B: Credibility ✅ → **C: Motion & visual**)

## Context

Phases A and B fixed the plumbing and the claims. Phase C is the visual and interaction
work, built on the fluid token scale from A and the corrected content from B.

**The organising principle** comes from the owner: the scroll-driven card stack on the
projects page is what people react to. So Phase C extends the card-stack interaction
language rather than scattering unrelated effects across the site.

## Sources and licensing

| Source | Licence | Use |
|---|---|---|
| **Vengeance UI** (`github.com/Ashutoshx7/VengenceUI`) | **MIT, no attribution required** | Primary source. Pull from GitHub, not the docs site. |
| **motionsites.ai** free-tier prompts | free tier, "Copy" items | Technique reference only — the transform maths, not the code |
| Skiper UI | — | **Rejected by the owner.** Free tier requires visible attribution. |
| animmasterlib.dev | — | Rejected. 60% plain HTML/CSS/JS, not React. |

**Security note, verified independently by three separate agents:** `skiper-ui.com`,
`vengenceui.com` and `motionsites.ai` auto-redirect to one another mid-session, with no
click, reproducibly — consistent with injected affiliate/redirect scripts. Always take code
from GitHub. Never paste from those docs pages during a long browsing session.

**Porting reality:** every candidate is Tailwind + a shadcn `cn()` helper. The portfolio has
**no Tailwind and no shadcn** — 62 SCSS modules. `npx shadcn add` never works here, and every
component is a hand-port to SCSS. Budget accordingly; there is no shortcut.

## Performance budget

The site already loads GSAP + ScrollTrigger, Framer Motion, Lenis and Three.js. Phase A cut
assets from 70MB to 8MB and that must not regress. Therefore:

- **No new animation library.** Everything uses what is already present, or plain CSS.
- **No per-frame canvas readback.** The `toDataURL()`-per-frame pattern in the motionsites
  reference is explicitly rejected; Phase A's spotlight already demonstrates the CSS-mask
  alternative.
- **No second Three.js scene.** Rules out Vengeance's *3D Books Showcase*.
- Any new asset must be WebP, and video is not reintroduced.
- New effects are inert under `prefers-reduced-motion` and on coarse pointers, enforced in
  both JS and CSS — matching the `useSpotlight` precedent from Phase A.

## 1. Visible FAQ section — fixes a live compliance issue (highest priority)

`pages/index.tsx` emits `faqPageJsonLd()`, which declares a `FAQPage` with five questions.
**No visible FAQ exists anywhere on the site.** Google's FAQPage guidelines require the
question and answer content to be visible on the page that declares it, so this is the same
class of violation as the fabricated `Review` markup removed in Phase B: structured data
describing content that is not there.

The five questions are legitimate, non-fabricated content (services, technologies, remote
work, timelines, how to start). So the fix is to **build the section the schema promises**
rather than delete the schema — which also fills a gap the portfolio audit flagged.

**Build.** A `FAQSection` component on the homepage, rendering exactly the five Q&As from
`faqPageJsonLd()` so schema and page cannot diverge. Pattern from the motionsites *FAQ CTA*
prompt: an accordion driven by plain React state (`activeIndex`), chevron toggle, active-row
border and shadow change. **No library.** Chevron from `lucide-react`, already a dependency.

**Single source of truth.** Extract the five Q&As into `data/faqData.ts`, consumed by *both*
`faqPageJsonLd()` and `FAQSection`. This is the same lesson as Phase A's tokens and Phase B's
duplicated metric lists: two copies drift, and here drift is a policy violation.

**Two copy corrections while doing this:**
- The technologies answer claims *"I specialize in … TensorFlow, PyTorch"*. Both are
  classified `studied`, not `shipped`, in the Phase B skills work. Reword so the FAQ agrees
  with the skills section.
- The getting-started answer gives `hello@abdalkader.dev`. **Verify this address receives
  mail before shipping.** The CV uses a Gmail address and the contact form posts to an API.
  A dead contact address in FAQ schema is worse than no schema.

**Discarded from that prompt:** its animated-gradient CTA card. The blob palette
(yellow/red/green/pink/orange) clashes with `#f44e00`/`#d4af37`. The `@property`-driven
gradient *technique* is noted for possible reuse in brand colours; the literal design is not
taken.

## 2. Glow Border Card — card-stack enhancement, zero cost

From Vengeance UI. A rotating `conic-gradient` border driven by `@property` for smooth angle
interpolation. **Pure CSS: no JS, no library, no per-frame work, GPU-composited.**

Applied to the active/flipped card in `ProjectShowcase`, so the card the visitor is engaging
with is visibly distinguished. Colours use `--color-primary` and `--color-gold` from the
Phase A token source rather than the source's own palette.

`@property` degrades gracefully — unsupported engines get a static border, not a broken one.

**Why first among the visual items:** highest payoff per unit of risk, and it strengthens the
element the owner says people react to.

## 3. Magnetic dwell easing on the card stack

From the motionsites *Animated Cards* free prompt. The transferable part is one line:

```
easedDiff = sign(diff) * pow(abs(diff) * 2, 4.2) / 2
```

where `diff` is the fractional distance from the nearest card index. The exponent produces a
*held settle* at each card before it releases to the next — a feel standard easing curves do
not give.

**Adaptation.** The source drives `progress` from a constant `0.0016`/frame increment in its
own `requestAnimationFrame` loop. Here `progress` is driven from **ScrollTrigger's
`onUpdate`** instead, giving a scroll-scrubbed version of the same maths and reusing the
pinning the stack already has. No new rAF loop, no new dependency.

Also available from that prompt if wanted later, all pure CSS transforms: `perspective:
1350px`, and fake volumetric card thickness via 5 stacked layers at `translateZ` offsets
`[-1.47, -0.73, 0, 0.73, 1.47]px`.

## 4. A real 404 page

`pages/404.tsx` is minimal — the audit noted no search, no suggested links. Layout cue from
the motionsites *404 Planet* prompt: full-viewport composition, oversized numerals, a clear
return action.

**Its stock background video is not used.** Phase A removed 45MB of video and that is not
being undone. The backdrop is CSS/token-driven, in keeping with the site's identity.

## 5. Backdrop for the pages that lost video

Phase A removed 13 of 14 `VideoBackground` mounts. Five pages — about, projects, contact,
guidance, prayer — now render on flat black, because `ThreeBackground` is mounted only in
`HeroSection`, not globally. Verified: they return 200 with no errors and read as
intentional, but they are flatter than before.

A cheap CSS or token-driven backdrop for those pages, costing no new bytes. Lower priority
than 1–4; do it only if the flatness actually bothers the owner on review.

## Deliberately not doing

| Item | Why |
|---|---|
| Vengeance *3D Books Showcase* | imports `three` plus procedural canvas cover painters — a second Three.js scene on a page that already has one |
| Vengeance *Interactive Book* | its docs page hard-redirects off-site; unusable |
| motionsites Backgrounds catalogue | all large MP4; would undo Phase A |
| motionsites *Tech-Noir About* | solid `#FF0000` block with a Cloudinary video; no palette or identity fit |
| Anything named Liquid / Ripple / Gooey / Particles from Vengeance | naming suggests canvas or WebGL; verify source before ever considering |
| Replacing the card stack | it is the site's strongest asset. Extend, never replace. |
| Filling the empty testimonials slot | stays empty until a genuine attributable quote exists (Phase B decision). The *Radial Diagram* single-quote layout is the design to use if one arrives. |

## Testing & verification

| Check | Passes when |
|---|---|
| `pnpm build` (5 apps) | exit 0 |
| `pnpm typecheck` | exit 0 |
| `pnpm test` | ≥242 tests green, 0 errors |
| FAQ schema matches page | the five rendered questions are byte-identical to `faqPageJsonLd()` output, both sourced from `data/faqData.ts`; a test asserts this |
| Contact address | the address in the FAQ answer is confirmed to receive mail |
| Assets | `public/videos` + `public/images` still ≤8MB |
| Reduced motion | every new effect inert under `prefers-reduced-motion: reduce` |
| Coarse pointer | hover-dependent effects inert under `@media (pointer: coarse)` |
| No new dependency | `git diff` on `apps/portfolio/package.json` adds nothing, or only a justified named exception |
| Layout | holds 320px–1920px on every page touched |

## Definition of done

1. A visible FAQ renders the same five Q&As the schema declares, from one shared source,
   with a test preventing drift.
2. The TensorFlow/PyTorch overclaim is reworded; the contact address is verified.
3. Glow Border Card distinguishes the active card, pure CSS, tokens for colour.
4. Card-stack scrub uses the magnetic dwell easing, driven by ScrollTrigger.
5. `pages/404.tsx` is a real page with a clear return path and no video.
6. No new animation library, no second Three.js scene, assets still ≤8MB.
7. Every check above passes.
