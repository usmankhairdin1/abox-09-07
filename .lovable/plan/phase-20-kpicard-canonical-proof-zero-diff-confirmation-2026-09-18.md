# Phase 20 — KpiCard Canonical Proof & Zero-Diff Confirmation

Verification only. Expected outcome: **zero production file changes**. The existing `src/components/abox/kpi-card.tsx` is proven canonical by inspecting the running application, never by editing it.

## Expected production changes

None. No file edited, created, renamed, moved or deleted; no import or call site touched. A technical blocker stops the phase and is reported, not patched.

## Step 1 — Re-measure the current repository

Reference layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`) excluded. Preliminary reads already show:

- Source: `src/components/abox/kpi-card.tsx`, the only definition; depends on `cn` and `CountUp` from `./motion`.
- 16 production consumer files, 58 call sites; one is a route-local kit file (`src/components/m06/screens/roster.tsx`).
- Prop usage: `label` 58, `value` 58, `icon` 51, `tone` 41, `hint` 10, `delta` 6, `className` **0**.
- API: `label`, `value` required; `delta`, `icon`, `hint`, `tone`, `className` optional; `tone` defaults to `"default"` with four values (`default`, `primary`, `sage`, `warning`).
- Alternate implementation found: `StatCard` in `src/components/lucie-app/ui.tsx`, used by JET launch-readiness, exceptions, entitlements and employer census/contribution routes, with its own tone vocabulary (`good`/`warn`/`bad`). Separate system, not merged, not ranked.
- To confirm during the proof: `roster.tsx` shows `tone="stop"`/`tone="good"`, which are not KpiCard tones — establish whether those belong to a different component in that file or are mapped before reaching KpiCard. If a KpiCard call site really passes an unsupported tone, that is a STOP-and-report finding, not something to fix.

If the measurement materially contradicts the documented architecture, stop and report before running any proof.

## Step 2 — Proof-gate consumers

Chosen from current evidence to cover the four required shapes:

| Route | File | Shape proven |
|---|---|---|
| `/app/dashboard` | `app.dashboard.tsx` | straightforward four-card dashboard grid with icons |
| `/app/commissions` | `app.commissions.tsx` | dynamic data-derived values, `delta` chips |
| `/app/agency/statements` | `app.agency.statements.tsx` | tone variation (`primary`, `sage`, `warning`) and icon variation |
| `/marketplace/admin` | `marketplace.admin.index.tsx` | responsive admin layout inside `MarketplaceShell` |
| `/agency/workforce/roster` | `m06/screens/roster.tsx` | route-local kit usage; resolves the tone question above |

The report names the exact route, file and card instance for every proof.

## Step 3 — Rendered DOM and style proof

Playwright against the running app, authenticated as `dana_1789563948@example.com` where the route requires sign-in. For every card instance capture: outer `tagName` and full DOM subtree; complete `class` attribute with token order; inline `style` (the `--shadow-card` box-shadow); resolved custom properties; aria and data attributes; text content and accessible name; icon element, tile classes and `h-8 w-8` sizing; label / value / delta / hint structure; computed display, position, width, height, padding, margin, gap, border, radius, background, shadow, typography, line-height, letter-spacing, alignment; and the surrounding grid geometry.

Also record actual foundation dependencies as used: `--shadow-card`, `border-hairline`, `bg-card`, `rounded-2xl`, `p-6`, `text-eyebrow`, `text-display`, `text-5xl`, `tabular-nums`, `glass`, `card-brackets`, `edge-sheen`, plus the tone token families `--primary`, `--sage`, `--warning` and their foregrounds. Nothing is normalized.

## Step 4 — Prop, data and conditional proof

Verify against the live render: `CountUp` numeric parsing including prefix/suffix (currency and percentage values), the `parsed.n === null` fallback path, delta chip sign and colour (`text-sage` vs `text-destructive`, ▲/▼), the combined `delta || hint` row, and cards rendered with no icon. Data flow, formatting and conditional logic stay untouched.

## Step 5 — Responsive, accessibility, interaction, console

- Capture at 1440, 834 and 390: card position, width, height, grid placement, wrapping, alignment, internal spacing, typography, icon placement, stacking, surrounding section geometry.
- Accessibility: card is a plain `div`, not focusable, no role; icon wrapper stays `aria-hidden`; accessible text equals label plus value plus hint; tab order and focus of surrounding controls unchanged.
- Interaction: the `group-hover` transitions on the card and icon tile are observed, not altered; surrounding buttons and links still focus, activate and navigate.
- Console per route; any warning is checked against the untouched implementation before being attributed to environment noise. Nothing suppressed.

## Step 6 — Validation

Typecheck, build and lint run read-only; existing lint findings are reported as pre-existing, never fixed. `git status` and `git diff` must show zero changes in production and reference paths.

## Stop condition

Any unexplained rendered difference halts the phase. The report then names route, file, element, property, observed value, current baseline, reproduction steps, and whether the difference reproduces against the untouched implementation. No patch, restyle, prop change, wrapper or migration.

## Out of scope

The remaining KpiCard consumers · `StatCard` and every alternate or inline KPI implementation · shells and `nav-config` · foundations and tokens · Branding & White-Label · Marketplace Asset Management · the reference layer and prior phase documents. Observations are recorded as future decisions, never converted into decisions.

## Final report

Thirteen sections as specified: phase status, production files changed (expected zero), source path and whether it changed, fresh measurement, proof-gate routes and what each established, DOM/style evidence, prop/variant/data evidence, responsive evidence, accessibility and interaction evidence, console/typecheck/lint/build, scope confirmation, open decisions, and the factual canonicality conclusion.
