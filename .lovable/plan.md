# Phase 21 — PageHeader Canonical Proof & Zero-Diff Confirmation

Verification only. Expected outcome: **zero production file changes**. The existing `src/components/abox/page-header.tsx` is proven by inspecting the running application, never by editing it.

## Expected production changes

None. No file edited, created, renamed, moved or deleted; no import or call site touched. A blocker stops the phase and is reported, not patched.

## Step 1 — Re-measure the current repository

Reference layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`) excluded. Preliminary reads already show:

- Source: `src/components/abox/page-header.tsx`, the only ABox definition; depends on `cn` and `FadeRise` from `./motion`.
- **23 production files, 24 call sites** (the two reference routes are excluded from that count).
- Prop usage: `title` 24, `eyebrow` 23, `description` 23, `scrId` 13, `actions` 7, `className` 3, `icon` 1, `variant` 1.
- API: `title` required; `eyebrow`, `scrId`, `description`, `icon`, `actions`, `className`, `variant` optional; `variant` defaults to `"default"` with one alternative, `"compact"`.
- `variant="compact"` has exactly one production consumer: `src/routes/plans.index.tsx:212`.
- Renders `FadeRise as="header"` → `<header>` wrapper, `<h1>` title, optional eyebrow paragraph, optional icon plate, optional description, optional actions row, and a hairline rule in the default variant only.
- Separate header systems confirmed present and out of scope: `PageHead` in `src/components/lucie/ui.tsx`, `PageHeader` in `src/components/lucie-app/ui.tsx` (used by JET and employer routes), plus shell headers, `ModuleTabs` and inline display headings. Recorded, never merged or ranked.

If the measurement materially contradicts the documented architecture, stop and report before running any proof.

## Step 2 — Proof-gate consumers

Chosen to cover every shape the API actually exercises:

| Route | File | Shape proven |
|---|---|---|
| `/faq` | `faq.tsx` | straightforward eyebrow + title + description, default variant |
| `/cart` | `cart.tsx` | title with actions |
| `/plans` | `plans.index.tsx:212` | the single `variant="compact"` consumer, with actions |
| `/member` | `member.index.tsx` | responsive usage inside `MemberShell` |
| `/coverage` | `coverage.tsx` | actions plus `className` override |
| `/plans/:planId` | `plans.$planId.tsx` | `scrId` context label and actions in a shopping detail page |

The `icon` prop has exactly one consumer; the proof identifies and includes it so the icon plate is covered by real evidence.

## Step 3 — Rendered DOM and style proof

Playwright against the running app, authenticated as `dana_1789563948@example.com` where a route requires sign-in. For each instance capture: outer `tagName` and complete DOM subtree; full `class` attribute with token order; inline style; custom properties; aria and data attributes; text content and accessible name; heading element and level; eyebrow, description, icon plate and actions structure; computed display, position, width, height, padding, margin, gap, border, radius, background, shadow, typography, line-height, letter-spacing, alignment; and surrounding page geometry including the hairline rule.

Foundation dependencies recorded as used, never modified: `text-eyebrow`, `text-display`, `text-3xl`/`md:text-4xl` vs compact `text-xl`/`md:text-2xl`, `leading-[0.98]`, `tracking-tight`, `text-muted-foreground`, `border-border`, `bg-surface`, `bg-hairline`, `rounded-2xl`, `text-primary`, the `mb-12` vs `mb-6` spacing pair, the `h-12 w-12 md:h-14 md:w-14` vs `h-9 w-9` plate sizes, and the `animate-hairline` motion rule.

## Step 4 — Variant, optional-content and action proof

- Record the compact and default variants side by side as observed facts: heading size, plate size, description size, bottom margin, presence of the eyebrow and hairline. No variant is renamed, merged or declared canonical.
- Verify optional content by presence and absence: eyebrow vs `scrId` fallback, description present and omitted, icon plate present and omitted, actions present and omitted.
- For action consumers verify element tag (`button` vs `a`), href and navigation, click, keyboard activation, accessible name, focus ring, and action position and spacing. No action control is modified or converted.

## Step 5 — Responsive, accessibility, interaction, console

- Capture at 1440, 834 and 390: header position, width, height, title and description wrapping, action placement and wrapping, spacing, alignment, typography, plate sizing across the `md:` boundary, and surrounding page geometry.
- Accessibility: `<header>` landmark, single `<h1>` per page and its level, accessible name equals the title, icon marked `aria-hidden`, hairline rule `aria-hidden`, tab order and focus of actions and surrounding controls unchanged.
- Console per route; any warning is checked against the untouched implementation before being attributed to environment noise. Nothing suppressed.

## Step 6 — Validation

Typecheck, build and lint run read-only; existing lint findings are reported as pre-existing, never fixed. `git status` and `git diff` must show zero changes in production and reference paths.

## Stop condition

Any unexplained rendered difference halts the phase. The report names route, file, element, property, observed value, current baseline, reproduction steps, and whether the difference reproduces against the untouched implementation. No patch, restyle, prop change, wrapper or migration.

## Out of scope

Remaining PageHeader consumers · `lucie/PageHead` · `lucie-app/PageHeader` · shell headers · `ModuleTabs` · inline headings and section headers · foundations and tokens · `nav-config` · Branding & White-Label · Marketplace Asset Management · the reference layer and prior phase documents. Observations stay observations; no header system is merged or ranked.

## Final report

Fourteen sections as specified: phase status, production files changed (expected zero), source path and whether it changed, fresh measurement, proof-gate routes and what each established, DOM/style evidence, API/variant/content evidence, responsive evidence, accessibility and interaction evidence, console/typecheck/lint/build, alternate header inventory, scope confirmation, open decisions, and the factual canonicality conclusion.
