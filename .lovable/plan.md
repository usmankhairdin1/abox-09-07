# Phase 19 — StatusBadge Canonical Proof & Zero-Diff Confirmation

Phase 19 is a verification phase. The expected outcome is **zero production file changes**: the existing `src/components/abox/status-badge.tsx` is proven canonical by inspecting the running application, not by editing it.

## Expected production changes

None. No file is edited, created, renamed, moved or deleted — not the component, not the four proof consumers, not imports, not call sites. If the proof uncovers a technical blocker, execution stops and reports it rather than changing the component.

## Step 1 — Re-measure the current repository

Fresh counts, reference layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`) excluded:
- exact source path and verbatim source implementation
- production importer count and call-site count
- literal vs dynamic tone counts, per-tone distribution across all six tones
- call sites relying on the `tone` default
- `className` consumers
- alternate status systems still present (`StatusTag`, `StatusChip`, `Tag`/`Note`, `ui/badge`, `MetalBadge`, inline chip)

If the measurement materially contradicts Phase 18, stop and report before any further step.

## Step 2 — Rendered proof on the four approved routes

Driven with Playwright against the running app, authenticated where the route requires it.

| Route | File | What is proven |
|---|---|---|
| `/agency/organizations/:id/readiness` | `agency.organizations.$organizationId.readiness.tsx` | dynamic tone via `RESULT_TONE` map, list rows, multiple tones on one page |
| `/plans` | `abox/plan-card.tsx` | conditional rendering, ternary tone, shopping context, MetalBadge adjacency |
| `/app/employer/ichra` | `app.employer.ichra.tsx` | the single `className` consumer and its final class attribute |
| `/app/schedule` | `app.schedule.tsx` | simple ternary tone baseline in a card list |

For every StatusBadge instance on each route, capture: outer `tagName`, full DOM subtree, complete `class` attribute with token order, inline `style` attribute, resolved `--tone` custom property, `aria-hidden` on the dot, accessible name, text content, computed color / background / border / radius / typography, bounding box, padding, margin, position, and the surrounding row or card geometry.

## Step 3 — Tone, default and className proof

- Record the resolved CSS variable and computed colour for every tone appearing on the four routes; note which of the six tones are not exercised there and say so plainly rather than inferring.
- Confirm whether any proof consumer omits `tone` and therefore relies on the `"muted"` default; record the result either way.
- Confirm the ICHRA badge's final class attribute contains the shared classes, the tone class, and `mt-3` in the current order.

## Step 4 — Responsive, accessibility and console proof

- Repeat the capture at 1440, 834 and 390 for each route: position, width, height, wrapping, alignment, typography, surrounding layout.
- Verify the badge stays non-focusable and out of the tab order, the dot stays `aria-hidden`, accessible names match the rendered text, and surrounding links, buttons and navigation behave as before.
- Verify conditional rendering still hides badges when the data says so (e.g. HSA chip on plan cards).
- Record console output per route. Any warning is checked against the untouched implementation before being attributed to environment noise; nothing is suppressed.

## Step 5 — Scope and build validation

`git status` / `git diff` must be empty for production and reference paths; typecheck and build must stay clean; confirm no other StatusBadge consumer, no alternate status system, no MetalBadge, no branding, no marketplace and no reference-layer file was touched.

## Stop condition

Any unexplained rendered difference halts the phase immediately. The report then names the exact file, element, property, before and after values, reproduction steps, and whether the difference reproduces against the untouched implementation. No patching, no restyling, no API change, no further consumers.

## Out of scope

The remaining 85 StatusBadge consumers · `StatusTag` · `StatusChip` · `Tag` / `Note` · `ui/badge` · `MetalBadge` · the inline chip in `index.tsx` · foundations and tokens · shells · route-local kits · Branding & White-Label · Marketplace Asset Management · the reference layer. All nine Phase 18 open decisions stay unresolved unless the proof establishes a fact directly.

## Final report

Thirteen sections as specified: phase status, production files changed (expected: zero), source path and whether it changed, fresh measurement, per-route proof results, DOM/style evidence, tone and default evidence, responsive evidence, accessibility and interaction evidence, console/typecheck/lint/build, scope confirmation, preserved open decisions, and the factual canonicality conclusion.
