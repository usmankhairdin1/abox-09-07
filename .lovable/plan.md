# Phase 36 — Production Typography Role & Text-Style Source-of-Truth Centralization (PLAN ONLY)

Exact-preservation contract: NOT ONE PIXEL, NOT ONE DOT. No implementation occurs under this plan.

## 1. Fresh inventory methodology

Read-only sweep of production `src/**` (routes, components, lib), excluding reference-only layers.
- Enumerate every typography utility occurrence per file with line numbers, then open each file and read the surrounding element so classification comes from real DOM context, never grep counts.
- Group by exact `className` string, then by element type (`h1`–`h4`, `p`, `span`, `label`, `td`, `th`, `button`), then by semantic role.
- Record inherited typography from ancestors (shell, Surface, card) before judging any candidate.
- Record runtime-content sensitivity (mapped data, plan names, org names, currency values).

## 2. Existing typography source map (already confirmed read-only)

Owner of custom text styles: `src/styles.css` (md5 `534cd653f5aae3c9a8e042345d53d852`).
- `@theme` font families: `--font-sans`/`--font-mono` = Inter Tight, `--font-display`/`--font-serif` = Bricolage Grotesque.
- `@utility text-display` — display family, weight 600, tracking −0.032em, line-height 1.02, variation settings.
- `@utility text-eyebrow` — mono family, 0.6875rem, weight 500, uppercase, muted color.
- `@utility text-serial` — mono, 0.625rem, uppercase, muted, tabular-nums.
These three utilities are the only production typography aliases. Sizing/weight is always composed with raw Tailwind utilities at the call site.

Component-owned typography (locked, re-audit only):
| Source | md5 | Owns |
| --- | --- | --- |
| page-header.tsx | 5be9e6ea… | context eyebrow, page title (`text-display text-3xl … md:text-4xl`), compact variant |
| kpi-card.tsx | 9279cd20… | KPI label eyebrow, KPI value (`text-display … text-5xl tabular-nums`) |
| empty-state.tsx | 6cfba448… | empty title (`text-display text-2xl`) |
| field.tsx | f35b2364… | field label caption (`text-eyebrow` inside `block text-sm` label) |
| control.tsx | 1c6efd5c… | control box styling (no typography role) |
| surface.tsx | 51b51b31… | container only |
| notice-page.tsx | 81ee6c0f… | notice title/description |
`src/lib/design/**` and `src/components/design/**` (including `graph-typography.ts`) are reference-only documentation and are not production owners.

## 3. Semantic role taxonomy

Page title · section title · subsection title · eyebrow/overline · body · muted body · field label · helper text · error text · KPI value · badge label · nav label · button label · table header · table cell · pricing/numeric value · legal/disclaimer. Two roles are never merged on visual similarity alone.

## 4. Candidate register (produced in full at execution; measured scale today)

Approximate production occurrences: `text-eyebrow` 267, `text-display` 246, `text-sm` 983, `text-xs` 571, `text-2xl` 86, `font-semibold` 194, `uppercase` 93, `tracking-tight` 12.

Dominant repeated shapes already identified:
- `<h2 className="text-display text-xl">` section heading — 55 occurrences across 27 route files.
- `<label className="mb-1 block text-eyebrow">` — form label above control (Phase 34 recorded, auth-gated).
- `text-eyebrow` bare caption inside cards and stat blocks.
- `text-display text-2xl` / `text-display mb-3 text-xl` local heading variants.

Crucial reachability fact: of the 55 `text-display text-xl` headings, only `privacy.tsx:41` and `terms.tsx:40` sit on publicly reachable routes, and each is a single call site inside a `.map()`. All remaining 53 live on `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*` — auth-gated, unmeasurable with the current signed-out session.

## 5. Canonical ownership map

Font family and the three semantic aliases → `src/styles.css`. Role-specific composed typography → the completed component that owns the role (PageHeader, KpiCard, EmptyState, field, NoticePage, StatusBadge, ActionPill, DataTable). Everything else → the consumer route.

## 6. Fragmentation register (record, do not repair)

Section headings drift across `text-display text-xl`, `text-display text-2xl`, `text-display mb-3 text-xl`, `text-display text-lg`. Caption vocabulary splits between `text-eyebrow`, `text-xs text-muted-foreground` and `text-serial`. Body text splits between `text-sm` and `text-sm text-muted-foreground`. Three heading weights coexist (`text-display` intrinsic 600 plus explicit `font-semibold`/`font-medium`). These are documented inconsistencies, not this phase's work.

## 7–8. Eligibility decisions and exclusions

Hard gate: a candidate is eligible only when semantic role, element, class output, computed metrics, inheritance, wrapping, truncation, geometry, responsive and state behaviour are all reproducible exactly, and parity can actually be measured in the browser.

Expected outcome under that gate: **zero migrations.**
- Section heading — the only repeated role with real scale, but 53 of 55 consumers are auth-gated (NOT CAPTURED) and the two measurable ones are single call sites per file. A shared source cannot be proven on two unmeasurable-majority consumers, and creating it for two literal call sites is abstraction without benefit.
- Eyebrow/label roles — already owned by `text-eyebrow` and `field.tsx`; no second owner may be created.
- Page title, KPI value, empty title, badge, notice title — intrinsic to completed component contracts; ownership stays intact.
- Pricing, quote calculation, plan names, organization names, status text — business/geometry-coupled; excluded.
- Lucie, Lucie-app, M06, M08, ai-elements, shells, Branding & White-Label runtime, Marketplace Asset Management runtime, reference layers — excluded outright.

If the execution sweep surfaces a role with ≥2 measurable consumers sharing an exactly identical contract, it is handled under sections 9–12; otherwise zero migrations is the successful outcome.

## 9–11. Proposed canonical sources and proof consumer

No new typography source is proposed up front. No universal `Typography`/`Text` component, no generic element-polymorphic API, no duplicate alias. A new source would be considered only on this evidence bar: ≥2 measurable consumers, identical semantic role, identical element, identical class string, no business coupling. Its spec would then state exact path under `src/components/abox/`, fixed native element, closed role list, no defaults that alter output, class ownership limited to the role's own classes, and the reason it is narrower than a universal abstraction.

## 12. Batch strategy (only if a candidate qualifies)

One role, one proof consumer, before-evidence captured, migrate that consumer alone, prove parity, then gate each subsequent consumer independently. No batch collapsing.

## 13–16. Evidence required per batch

Per consumer, before and after: full DOM tree, exact `class` attribute string (byte comparison), computed font-family/size/line-height/weight/letter-spacing/text-transform/color, bounding rect, line count, wrapping, scroll dimensions, surrounding element geometry, overflow, console errors — at 1440, 834 and 390, plus any breakpoint the consumer actually declares. Long-content checks with controlled measurement-only data (long title, long unbroken string, long plan/org name, numeric value); production copy is never edited. Accessibility: heading level unchanged, accessible name unchanged, label association unchanged, semantic element unchanged, focus behaviour unchanged.

## 17–19. Boundaries and NOT CAPTURED handling

Component, shell and experience boundaries as listed in sections 2 and 8. Branding and Marketplace runtime typography untouched. `LOVABLE_BROWSER_AUTH_STATUS` is `signed_out`; every authenticated route is inspected in source, recorded as NOT CAPTURED, and left literal. Parity is never inferred from source similarity.

## 20. Validation commands (at execution)

`npx tsgo --noEmit`; production build; ESLint on touched files only, compared against the pre-existing prettier baseline; `git status`/`git diff` before and after; Playwright DOM/class/computed-style/geometry/wrapping/overflow/console capture at the three widths; `md5sum` of every locked source to prove it is unchanged.

## 21. Rollback

Each migration reverts independently by restoring the original class string, element, DOM and imports in that one file; a new source, if created, is deleted once its last consumer is reverted. Phases 29–35 remain untouched in every rollback path.

## 22. Governance (after implementation only)

`.lovable/manual-work-map.md` records canonical role owner, legitimate consumers, exclusions, future-use rule, duplication-prevention rule, exception rule and rollback point. If the outcome is zero migrations, the register, fragmentation list and exclusions are recorded instead.

## 23. Risk register

Font-metric drift · line-height drift · baseline shift · wrapping change · inherited-style change · semantic-role conflation · heading-level change · responsive typography drift · long-content overflow · numeric-width change · component ownership erosion · shell/experience boundary erosion · branding interference · route-local business typography · content change · auth-gated unmeasurable typography · formatting churn · duplicate alias creation.

## 24. Deferred opportunities (record only)

Section-heading size vocabulary consolidation · caption vocabulary (`text-eyebrow` vs `text-xs text-muted-foreground` vs `text-serial`) · redundant `font-semibold` on `text-display` · spacing normalization · control-height normalization · focus-ring vocabulary · icon sizing · remaining navigation fragmentation · Figma mapping · Phase 30 batches 2–7 evidence backfill · Phase 31/32 evidence gaps · remaining EmptyState evidence.

## 25. Expected changed files

Most likely none. If a candidate qualifies: the eligible consumer files, at most one narrow typography source, and `.lovable/manual-work-map.md` after implementation.

## 26. Success criteria

Complete opened-source inventory; every candidate in exactly one bucket; canonical ownership map and fragmentation register produced; every migration (if any) byte-identical in class output and measured identical in DOM, computed typography, geometry, wrapping, responsive and accessibility behaviour; all locked hashes unchanged unless strictly justified; typecheck and build clean; no new lint findings; zero content changes; zero migrations accepted as a valid successful outcome.

## 27. Authorization

PLAN ONLY. No repository edits, no implementation, no typography changes until this plan is separately approved.
