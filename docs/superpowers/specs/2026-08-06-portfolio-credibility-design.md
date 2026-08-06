# Portfolio Credibility — Phase B Design

**Date:** 2026-08-06
**Status:** Approved design
**Phase:** B of 3 (A: Foundation ✅ → **B: Credibility** → C: Motion & visual upgrade)

## Context

Phase A fixed the plumbing. Phase B fixes what the site *claims*. Every item below was
verified against the `gh` CLI and Abdalkader's CV on 2026-08-06 — nothing here is inferred.

Phase B changes content only. No restyling, no new section designs, no token or asset work.

## Governing rule

**Nothing goes on the site that a reader cannot check.** Where a claim cannot be
substantiated, the fix is to remove it or to state the substantiable version — never to
soften it into a vaguer claim. A hedged number reads worse than no number.

## 1. Fabricated endorsements — remove (highest priority)

`TestimonialsSection` carried four testimonials attributed to four named individuals at four
named companies, none of which correspond to real people or real clients. One also asserted a
specific commercial result on the client's behalf. Names redacted here deliberately — this
repository is public, and there is no reason to restate them.

**The same four were also emitted as structured data.** `utils/jsonld.ts` exported a
review-list helper (four `@type: Review`) and an aggregate-rating helper
(`ratingValue: 5, ratingCount: 4`), both invoked from `pages/index.tsx`. The site therefore
published a 5.0-star rating to search engines derived entirely from those entries, which can
surface as stars in results. Google's structured-data policies prohibit fabricated reviews;
the exposure is rich-result removal or a manual action against the domain. Removing the
visible section alone would not have fixed this.

**Action.** Delete:
- `components/HomePage/TestimonialsSection/` (component + stylesheet)
- its import and mount in `pages/index.tsx`
- `allReviewsJsonLd()`, `aggregateRatingJsonLd()`, the `TestimonialData` type, and the
  `Review` / `AggregateRating` emitters in `utils/jsonld.ts`
- both call sites in the `JsonLd` array in `pages/index.tsx`

The slot stays empty. Phase C may fill it with a single-quote layout if a genuine
testimonial is ever collected. An absent testimonials section carries no cost; a fabricated
one is the largest liability on the site.

## 2. Unverifiable metrics — remove

Total stars across all 71 public repos is **0**, so the star and traffic claims are false,
not merely unsupported.

Remove from `data/projectsData.ts`:

| Claim | Project | Why |
|---|---|---|
| `500+ GitHub stars` | Apple TV Clone | repo has 0 stars, 0 forks |
| `10,000+ developer visits` | Apple TV Clone | no source |
| `Featured in CSS animation showcases` | Apple TV Clone | no source |
| `45,000+ virtual tours completed` | VirtualView | repo has 0 stars; no source |
| `60% increase in user engagement` | VirtualView | no source |
| `80% reduction in VR hardware requirements` | VirtualView | not a measurable claim |
| `95% user satisfaction rate` | Quantum Animation | no source |
| `15,000+ interactive sessions` | Quantum Animation | no source |
| `40% improvement in concept understanding` | Quantum Animation | no source |
| `50% reduction in learning time` | Quantum Animation | no source |
| `98% visual accuracy achieved` | Apple TV Clone | not measurable |
| prose: *partnerships with 3 educational institutions*, *20,000+ student engagements*, *featured in educational technology conferences*, *adopted by physics teachers worldwide* | Quantum Animation | no source |
| prose: *adopted by architectural firms and educational institutions*, *enabled 5+ real estate companies*, *reducing physical visit costs by 40%* | VirtualView | no source |

**Retained**, because the client publishes them: DiscipleOne's *50+ partner churches*,
*1,000+ active users*, *10,000+ completed quiet times*, *100% free access*.

**Retained**, because they are self-evident properties of the work rather than outcome
claims: *cross-platform (iOS, Android, Web)*, *real-time sync*, *multi-campus architecture*,
*mobile-responsive*, *PageSpeed 95+* (re-measurable on demand).

Each removed metric is replaced by a factual capability statement describing what was
built, not a smaller number.

## 3. Timeline — correct to the CV

`projectsData.ts` backdates four engagements and reports one ended engagement as ongoing:

| Project | Currently | Correct (per CV) |
|---|---|---|
| SoapBox Super App | `2024 - Present`, duration `Ongoing` | **Nov 2025 – Mar 2026**, ended |
| DiscipleOne Platform | `2024 - Present` | Nov 2025 – Present |
| VIA Discipleship App | `2024 - Present` | Nov 2025 – Present |
| ParsaLink AI CRM | `2024 - Present` | Jan 2026 – Present |

## 4. Years of experience — qualify, do not delete

The `8+ years` claim appears in `components/AboutPage/AboutHeroSection/index.tsx` and in the
SEO description in `pages/about.tsx`. It is **not** removed — Abdalkader confirms the
experience is real; it simply is not visible on the CV, whose earliest software role is
Nov 2023 and whose GitHub begins Sept 2023.

The liability is the unexplained gap next to the number, not the number. The fix is to make
the composition visible:

> **8+ years in technology** — telecommunications engineering and field work from 2015, then
> IT and freelance web work alongside continuous self-directed study across CS, AI/ML,
> DevOps and cloud (AWS, GCP, Azure). **Building software professionally since 2023**, at
> lead level within two years.

Every clause is checkable or ordinarily accepted, `8+` is covered from 2015, and the
trajectory reads stronger than the bare number. Copy is adapted to fit each location rather
than pasted verbatim; the SEO description gets a one-line variant.

If named client roles for 2018–2023 are supplied later they are added as proper entries.
Not a blocker.

## 5. Skills — split by kind of evidence, keep the breadth

`data/skillsData.ts` lists ~98 skills with `level`, `yearsOfExperience` and `projectsCount`.
The counts are fabricated-precise (`projectsCount: 25`) and several `yearsOfExperience`
values exceed the Nov 2023 floor for professional work.

Rather than cutting ~60 entries, group by the kind of evidence behind each:

- **Shipped** — used in delivered work. Evidence is a repo or a live URL.
  TypeScript, JavaScript, Python, React, Next.js, Node.js, Express, FastAPI, Django,
  React Native/Expo, Svelte, Go, Astro, PostgreSQL, MongoDB, Redis, Prisma, Supabase,
  Firebase, Docker, GSAP, Framer Motion, Three.js, SCSS, Tailwind, Git, Linux, Nginx,
  REST/GraphQL, WebSockets, LLM integration, prompt engineering, AI agents, RAG,
  fine-tuning, LangChain.
- **Studied / certified** — learned deliberately, not yet shipped in production.
  AWS (backed by the **AWS Skill Builder AI/ML & Generative AI track, 2024–25**), GCP,
  Azure, Kubernetes, Terraform, Elasticsearch, message queues.
- **Removed** — no basis of either kind: SolidJS, Vue, Remix, WordPress at *Expert / 5 yrs*,
  Shopify at *Advanced / 3 yrs*.

Also: drop `projectsCount` entirely — invented precision that adds nothing — and cap
`yearsOfExperience` at 3 for anything in the Shipped group, since professional software work
starts Nov 2023. Broad technology experience is expressed in the About copy (§4), not in
per-skill year counts.

## 6. Missing real work — add

Present in the CV or the GitHub orgs, absent from the site:

- **Phoenix Tower** — one engagement, web/TypeScript from ~Jun 2026, now Odoo/ERP
  development as a contractor. Current work.
- **SoapBox Website Builder** — `builder.soapboxsuperapp.com`, a shipped no-code builder.
- **Natuzzi Erbil** — AI & IT Consultant, Mar 2026 – present. Internationally recognised
  brand; a credibility asset.
- **Real House Company** — IT & Contract Manager, Apr 2025 – present.
- From the private orgs, selected by strength: `godfocus-*` (WhyLiveTodayLLC — his own
  company), `seraphim-*` (six-repo suite), `gloriaai` (AI WhatsApp sales agent).

Private repos are fine: these are judged on live URLs and named clients, which is stronger
evidence for client work than a starred repo.

**Also recommended, outside the codebase:** make the five GitHub org memberships public.
`gh api users/Abdalkaderdev/orgs` currently returns empty, so none of Disciple-One,
Mount-Seir-Tech, WhyLiveTodayLLC, creostudio or Tunggrok-llc is publicly attributable. One
click per org, and worth more than any code change here.

## 7. Project hierarchy — demote, do not delete

The array currently leads with real client work but retains clone/practice projects at equal
weight. Apple TV Clone and VirtualView are ordered below all client work and their framing
changed from outcome claims to what they demonstrate. They are kept — a clone is fine as a
craft exercise; it is only harmful when presented as a headline achievement.

## Testing & verification

| Check | Passes when |
|---|---|
| `pnpm build` (all 5 apps) | exit 0 |
| `pnpm typecheck` | exit 0 |
| `pnpm test` | 242 tests green, 0 errors (Phase A baseline) |
| No fabricated names anywhere | grep the four names and four company names removed in §1 across `apps/` and `packages/`; returns nothing |
| No review schema | `git grep -E "AggregateRating\|'@type': 'Review'" -- apps packages` returns nothing |
| No false metrics | `git grep -E "500\+ GitHub\|10,000\+ developer\|45,000\+\|95% user satisfaction"` returns nothing |
| Dates match CV | SoapBox reads Nov 2025 – Mar 2026 and is not marked ongoing |
| Rendered JSON-LD is valid | homepage `<script type="application/ld+json">` blocks parse, and contain no Review or AggregateRating |
| Visual check | `/`, `/about`, `/projects` render with no gap where testimonials were |

## Out of scope

- Restyling, new section designs, motion work → **Phase C** (testimonials slot may be
  filled there with the Radial Diagram single-quote layout)
- The four missing OG images (`og-home/about/contact/projects.jpg`) — pre-existing, needs
  asset creation
- The stale root-level markdown and `PORTFOLIO_AUDIT_REPORT.md`, which now contains
  resolved and inaccurate items

## Definition of done

1. No fabricated testimonial text, name, company, or review/rating schema anywhere.
2. No metric on the site that cannot be sourced.
3. All four engagement dates match the CV; SoapBox no longer reads as ongoing.
4. `8+ years` retained and qualified in both locations, with the composition visible.
5. Skills grouped by evidence kind, `projectsCount` gone, Shipped years capped at 3.
6. Phoenix Tower, SoapBox Website Builder, Natuzzi, Real House and selected org work added.
7. Clone projects ordered below client work and reframed.
8. Every check above passes.
