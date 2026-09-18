# Phase 25 — EmptyState Canonical Proof & First-Consumer Gate (PLAN ONLY)

Plan only. No production code changes in this phase. Deliverable is one document: `.lovable/phase-25-empty-state-first-consumer-proof-plan.md`.

## Central finding that shapes this plan

`src/routes/cart.tsx:8` already reads `import { EmptyState } from "@/components/abox/empty-state";` and calls it directly at line 52. There is no wrapper, no alias, no local re-implementation and no indirection between consumer and canonical source.

Per the instruction "if the selected consumer already imports the ABox EmptyState directly, the implementation must not perform an unnecessary refactor merely to claim a migration", **the correct implementation boundary for this gate is zero production code change.** The gate is executed as verification: prove the existing component renders and behaves identically for the selected consumer, then record it as canonical for that consumer. No wrapper, no Slot/asChild, no import rewrite, no API change.

## Selected first consumer

**`/cart` — `src/routes/cart.tsx:52`.** Justification from Phase 24 evidence:

- Already imports the ABox EmptyState directly (line 8).
- The **only** consumer exercising the `icon` prop (`ShoppingCart`), so it covers both the icon plate and the text/action path in one gate.
- Naturally reachable: an empty cart is the default first-visit state — no seeding, no data mutation, no filter manipulation, no auth bypass, no route change.
- Exercises `icon`, `title`, `body`, `action` (a TanStack `Link` to `/plans`); only `className` is absent, and that is covered separately by `/shared/$token` in a later gate.
- Sits inside `MarketplaceShell`, giving a real shell context.
- Already measured at three viewports in Phase 24: 1344 × 306, 770 × 306, 358 × 334, zero console errors, no page-level overflow.

No other consumer is migrated, and no alternate implementation is touched.

## Current source and rendered anatomy (restated for the document)

Source `src/components/abox/empty-state.tsx`, md5 `6cfba448d43364417d733a56ad819b72`. Panel `div` with `relative flex flex-col items-center gap-4 overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface/60 px-6 py-14 text-center`; `aria-hidden` decor layer at `opacity-40`; inner centered stack; 48×48 icon plate (`rounded-md border border-hairline bg-background`) with a 20×20 `aria-hidden` glyph; `p.text-display.text-2xl` title; `p.max-w-md.text-sm.text-muted-foreground` body; consumer action node. Computed at 1440: padding `56px 24px`, radius 14px, border `1px dashed oklch(0.3 0.04 265 / 0.24)`, gap 16px, no shadow, no motion; title 24/600/32 Bricolage Grotesque; body 14px clamped 448px; action 114 × 36 pill linking to `/plans`.

## Proof gate to be defined in the document

Route `/cart` with an empty cart, at **1440 / 834 / 390**, capturing before and after (identical by construction, since nothing changes):

1. source hash and `git status`; 2. DOM hierarchy; 3. verbatim class strings for panel, decor, inner stack, icon plate, title, body, action; 4. computed styles (font family/size/weight/line-height, colours, padding, gaps, border width/style/colour, radius, background, overflow, align-items, text-align, min-height, shadow, transition); 5. geometry for panel, icon plate, glyph and action; 6. icon `aria-hidden` and dimensions; 7. action dimensions, focus ring, click navigation to `/plans`; 8. page-level overflow (`scrollWidth == clientWidth`); 9. MarketplaceShell integration and route behaviour; 10. accessibility semantics — plain `div`, no role, no `aria-live`, `<p>` title unchanged, action as the only focusable element, tab order; 11. console output; 12. `tsgo` typecheck; 13. build; 14. ESLint with pre-existing findings recorded and unfixed; 15. final hash and `git status`.

Natural reachability: load `/cart` in a fresh session with an empty cart. If the cart is non-empty, empty it only through the existing in-app remove control — never by editing the store, data or logic.

## Rollback

Since the boundary is zero change, rollback is trivial: nothing to revert. If the gate ever requires a change to pass, that change is not made — it is recorded as an unresolved migration decision and the gate stops.

## Out of scope (explicit)

Lucie-app `EmptyState`, `ConversationEmptyState`, M08 `EmptyRows`, M06 inline paragraph, Lucie `Table.empty`, ABox `DataTable` empty row, route-local dashed blocks; the seven repeated action class strings; the `<p>` title semantics; `aria-live`; decor implementation; tokens; styling; new or renamed props; ReactNode prop conversion; moving consumer action logic into the component; the other seven consumers; branding, white-label, marketplace assets, runtime stores and admin asset screens.

## Risks and blockers to record

Cart state persists per session, so the gate must start from an empty cart reached through the app itself. `/plans` filtered-empty and the `shared.$token` expired branch remain unreached from Phase 24 and stay out of this gate. `DotField` coupling means any decor change would propagate to all eight consumers — another reason the boundary stays at zero change. A zero-change gate proves canonical status for this consumer only; it does not prove the remaining seven.

## Validation

Confirm `git status` clean apart from the planning document; no production source, route, style, foundation, dependency, branding or marketplace file changed. Implementation is not performed; work stops after the plan.
