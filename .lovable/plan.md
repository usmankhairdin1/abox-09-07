# Phase 27 — EmptyState Third-Consumer Proof (`/compare`) — PLAN ONLY

Plan only. No proof executed, no measurement claimed, no production file touched.

## Selected consumer (established from current repository evidence)

- File: `src/routes/compare.tsx`
- Route/path: `/compare` (`createFileRoute("/compare")`, screen UX-011 "Plan Comparison")
- Import line: **10** — `import { EmptyState } from "@/components/abox/empty-state";`
- Call site: **line 79**, inside `plans.length === 0 ? (...)`
- Current consumer hash (discovered in planning, to be re-verified unchanged after execution): `1aacd224262b8730fb9e92d750d32e05`
- Canonical source: `src/components/abox/empty-state.tsx`, expected `6cfba448d43364417d733a56ad819b72`

Why it is next: a repo-wide search for `empty-state` imports outside the reference routes returns exactly the eight Phase 24 consumers — `apply`, `cart`, `compare`, `handoff`, `member.quotes`, `plans.index`, `review`, `shared.$token`. `cart` was proven in Phase 25 and `plans.index` in Phase 26; the stated remaining order begins with `compare`, and repository evidence matches that inventory with no discrepancy.

Props actually supplied at the call site (to be confirmed at runtime, not assumed):
`title="Nothing to compare yet"`; `body="Pick up to 5 plans from the results page. You can compare across metal tier, network, and cost."`; `action` = a TanStack `Link to="/plans"` with class `mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground` labelled "Go to plans". `icon` omitted. `className` omitted.

## Preservation contract

Zero production change. No edit to the canonical source or to `src/routes/compare.tsx`; no wrapper, Slot/asChild, additional EmptyState definition, action-class normalization, title-semantics or ARIA change; no spacing, typography, border, radius, colour, shadow, icon, decor, motion, responsive or touch-target change; no route, data, state-logic, loading, filtering, branding, marketplace or alternate-system change; no migration of any other consumer. Divergences are recorded as evidence, never repaired.

## Execution gates

1. **Before** — md5 of both files (expected `6cfba448…` and `1aacd224…`) and `git status`.
2. **Natural reachability** — `/compare` is a public marketplace route rendered inside `MarketplaceShell`. The empty branch renders when the compare selection is empty (`cart.compareIds` yields no matching plans). Reach it only through normal use: a fresh browser context whose compare selection is already empty, or by removing selections through the existing in-app controls (per-column "Remove … from comparison" button, or the header "Clear comparison" action) . Forbidden: editing `SAMPLE_PLANS` or any data, direct `cartStore` writes, localStorage/session manipulation, unsupported query parameters, mocks, seeds, test branches, injected state, temporary production code. If the state cannot be reached naturally, the gate is reported as an unreachable-state blocker.
3. **Rendering** — confirm the canonical panel renders for this consumer.
4-6. **Independent capture at 1440, 834 and 390**, no inference between viewports:
   - DOM hierarchy: panel → decor, inner; inner children measured exactly as they exist; explicit yes/no on an icon plate and glyph (the consumer omits `icon`, so none is expected and none will be added).
   - Verbatim class strings for panel, decor, inner, title, body, action (plus plate/glyph only if they exist).
   - Computed styles: panel padding, gap, border width/style/colour, radius, background, box-shadow, overflow, align-items, text-align, min-height, transition; title and body family/size/weight/line-height/letter-spacing/colour/max-width; action element type, padding, background, colour, border, radius, focus treatment, any touch-target minimum.
   - Bounding rectangles for panel, inner, title, body, action (and plate/glyph if present).
   - Responsive: panel dimensions, wrapping, spacing, action dimensions, breakpoint and mobile touch-target behaviour recorded per viewport.
   - Overflow: `documentElement.scrollWidth` vs `clientWidth`.
   - Shell/context: page `h1`, "Back to results" link, PageHeader eyebrow/title/description, absence of the "Clear comparison" header action in the empty branch, header, navigation landmarks.
   - Console errors and page errors.
7. **Action / focus / interaction** — confirm the actual element type (expected an `A` produced by the TanStack `Link`), its `href`, focusability and focus treatment; activate it and observe navigation to `/plans`; return to `/compare` through normal navigation. No handler or component change.
8. **Accessibility** — panel element type, `role`, `aria-live`, `tabIndex`, title element, relationship to the page heading, focusable elements inside the panel, tab order, decorative `aria-hidden` treatment. No ARIA added.
9. **Console** — captured at each viewport.
10. `tsgo --noEmit`. 11. Production build. 12. ESLint on the canonical source and `src/routes/compare.tsx`, with pre-existing findings recorded separately and left unfixed.
13. **After** — re-hash both files, re-check `git status`. 14. Confirm zero production-file changes. 15. Confirm alternate systems untouched: Lucie-app EmptyState, ConversationEmptyState, M08 EmptyRows, M06 inline empty paragraph, Lucie Table.empty, ABox DataTable empty row, route-local dashed empty blocks — none migrated.

## Comparison requirement

Separate (A) shared canonical behaviour actually evidenced — panel shell, decor, inner stack, title and body treatment, spacing, border/radius/background, no shadow — from (B) legitimate consumer differences to record without correcting: no icon plate, a `Link` action to `/plans` (unlike the `/plans` button), different copy, different panel width inside the 88rem compare container, different panel height, and the compare/PageHeader context. No ranking of consumers or alternate implementations.

## Rollback / no-op

Read-only proof; nothing to roll back. Divergence → record, do not repair. Unreachable state → report the blocker, do not manufacture state.

## Final report requirement (for the later execution turn)

Exactly 22 sections: 1. Execution status 2. Source hash before/after 3. Git status before/after 4. Selected consumer reachability and exact natural path 5. DOM evidence 6. Class strings verbatim 7. Computed styles 8. Geometry by viewport 9. Props / icon evidence 10. Action / focus / interaction behavior 11. Responsive behavior 12. Overflow 13. Shell/context 14. Accessibility 15. Console 16. Typecheck 17. Build 18. ESLint 19. Production-file integrity 20. Alternate systems 21. Unexpected findings / blockers 22. Conclusion.

Conclusion, if all gates pass, limited to: the unchanged canonical EmptyState source has a THIRD verified production consumer at `/compare`. No claim that all consumers are proven, no obsolescence claim, no winner, no migration recommendation, no production change.
