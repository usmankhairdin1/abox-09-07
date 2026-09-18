# Phase 26 — EmptyState Second-Consumer Proof (`/plans`) — PLAN ONLY

Plan only. No proof is executed here, no measurements are claimed, no files other than this plan are written.

## 1. Consumer identification

- Import: `src/routes/plans.index.tsx:13` — `import { EmptyState } from "@/components/abox/empty-state";`
- Call site: `src/routes/plans.index.tsx:339`, inside the Results block, rendered when `filtered.length === 0`.
- Direct import of the canonical source; no wrapper, alias or re-export in between.

## 2. Hashes and expected end state

| File | Hash now | Expected after proof |
| --- | --- | --- |
| `src/components/abox/empty-state.tsx` | `6cfba448d43364417d733a56ad819b72` | identical |
| `src/routes/plans.index.tsx` | `5efbec94b8f919814e4013c1e153fc7e` | identical |

Both re-hashed before and after. Git status clean before and after.

## 3. Props used by this consumer

- `title` — "No plans match those filters"
- `body` — "Try clearing a filter or widening your premium range."
- `action` — an inline `<button onClick={clearFilters}>` with class `mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground`
- Omitted: `icon`, `className`, children.

This differs from `/cart` in two ways that must be recorded, not corrected: the action is a **button with a handler** (not a `Link` with `href`), and there is **no icon plate**.

## 4. How the empty state is reached naturally

`filtered` is derived in `useMemo` from `SAMPLE_PLANS` against the active browse filters (exchange, metal tiers, networks, carriers, HSA-only, easy-pricing-only, max premium, deductible, OOP, PCP copay, specialist copay). The empty state appears only when the active filter combination excludes every sample plan.

Planned natural path: open `/plans`, then use the existing filter UI (the sidebar at 1440/834 and the mobile filter drawer at 390) to narrow until zero plans remain — for example lowering the max-premium control to its minimum, optionally combined with a metal-tier or carrier restriction. Filters are exercised only through the rendered controls.

Explicitly forbidden: editing `SAMPLE_PLANS`, writing to the browse store from a script, injecting query params that production doesn't already read, mocking, seeding, or adding any test-only branch. If no reachable filter combination yields zero results, that is recorded as a **blocker** and the phase reports the empty state as unreachable rather than forcing it.

## 5. Filters, params, state involved

Filter state is persisted in the browse store, so each viewport run starts from a fresh browser context and the filters are re-applied through the UI in that context. The recorded evidence includes the exact sequence of controls used and the resulting `filtered.length === 0` condition. Sorting is irrelevant to the empty condition but its control state is recorded.

## 6. Authentication

`/plans` is a public marketplace route and is expected to need no session. If the runtime demands one, the existing preview session is restored (cookies plus storage key) with no new account created and no credential echoed.

## 7. Viewports

1440, 834 and 390, each measured independently in its own context. No value inferred from another viewport.

## 8. Evidence to capture (per viewport)

- **DOM**: panel → `[decor, inner]`; inner children in order. Since no `icon` prop is passed, whether an icon plate node exists at all is part of the evidence.
- **Verbatim class strings**: panel, decor, inner, icon plate (if present), title, body, action.
- **Computed styles**: padding, gap, border width/style/colour, radius, background, box-shadow, overflow, align-items, text-align, min-height, transition, and full typography (family, size, weight, line-height, letter-spacing, colour) for title, body and action; any effect of a consumer `className` (none expected here).
- **Geometry**: panel, inner, title, body, action rects; icon plate and glyph if rendered.
- **Responsive**: wrapping of title/body/action, spacing, and whether the existing mobile minimum touch-target raises the action height at 390 as observed on `/cart`.
- **Overflow**: `documentElement.scrollWidth` vs `clientWidth`.
- **Icon**: dimensions, classes and `aria-hidden` if an icon renders; explicit "not rendered" if not.
- **Action**: element type (`BUTTON`), absence of `href`, focus treatment/ring, and behaviour on activation — the handler resets filters, so the expected outcome is the plan list returning and the empty state unmounting. This is observed, not altered.
- **Accessibility**: panel is a plain `div` with no role and no `aria-live`; title remains a `<p>`; relationship to the page `h1`; focusable elements inside the panel; tab order; decorative nodes `aria-hidden`.
- **Shell/context**: plans header, filter sidebar/drawer, navigation landmarks, page heading and the results summary line around the empty state.
- **Console**: errors and page errors, expected zero.

## 9. Checks

`tsgo --noEmit`, production build, and ESLint on both files with pre-existing Prettier findings recorded separately and left unfixed (baseline: 1 finding in `empty-state.tsx`; `plans.index.tsx` baseline to be recorded at execution time).

## 10. Comparison against Phase 24 / Phase 25

Panel shell, decor, inner stack, title and body treatment are expected to match the `/cart` proof exactly (padding `56px 24px`, gap `16px`, dashed 1px border, radius `14px`, title 24/600/32 Bricolage, body 14/20 clamped at 448px, no shadow). Legitimate differences to record without correcting: no icon plate, action is a `BUTTON` rather than an `A`, different copy, different panel width from the plans results column, and a panel height reflecting the missing icon row.

## 11. Preservation boundary

Zero production change. No edit to `empty-state.tsx` or `plans.index.tsx`, no wrapper, no Slot/asChild, no second EmptyState, no action-class normalization, no title-semantics or ARIA change, no spacing/typography/border/radius/colour/shadow/icon/decor/motion/responsive/touch-target change, no plan-data/filter/route/loading/state change, no branding or marketplace change, no alternate-system change (Lucie-app EmptyState, ConversationEmptyState, M08 EmptyRows, M06 inline paragraph, Lucie Table.empty, DataTable empty row, route-local dashed blocks), no migration of the remaining six unproven consumers.

## 12. Rollback / no-op

The proof is read-only; there is nothing to roll back. If any verification step diverges, the divergence is recorded as a finding — it is not repaired in this phase. Unreachable states are reported as blockers.

## 13. Proof gates

1. Hashes and git status recorded before. 2. `/plans` reached and the empty condition produced through existing filter controls only. 3. All evidence captured at 1440. 4. Same at 834. 5. Same at 390. 6. Action activation observed. 7. Typecheck, build, lint. 8. Hashes and git status unchanged after.

## 14. Final report

An execution report in the 22-section format used for Phase 25, ending with a conclusion limited to: the unchanged canonical source has a **second** verified production consumer. No winner or ranking among alternate EmptyState implementations is decided, and no claim is made about the remaining consumers.
