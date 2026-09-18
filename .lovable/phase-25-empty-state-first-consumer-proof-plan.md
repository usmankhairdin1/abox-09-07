# PHASE 25 — EmptyState Canonical Production Proof & First-Consumer Gate (PLAN ONLY)

No production file was created, edited, renamed, migrated or normalized while producing this document. Implementation has not occurred and stops after this plan.

---

## 1. Executive summary

Phase 24 established `src/components/abox/empty-state.tsx` as the only shared empty-state component with production consumers (8 files / 8 call sites). This phase prepares **one** first-consumer proof gate to establish whether that component can be treated as canonical without changing its rendered output or behaviour.

The decisive fact is that the selected consumer already imports the canonical source directly. Under the phase rule forbidding refactors made "merely to claim a migration", the implementation boundary for this gate is therefore **zero production code change**. The gate is a before/after verification in which the "after" is identical by construction, because nothing is modified. Canonical status would then be recorded for that one consumer only.

---

## 2. Selected first consumer and factual justification

**`/cart` — `src/routes/cart.tsx`, call site at line 52.**

| Criterion | Evidence |
| --- | --- |
| Already uses ABox EmptyState | `src/routes/cart.tsx:8` — `import { EmptyState } from "@/components/abox/empty-state";` |
| Naturally reachable | An empty cart is the default first-visit state; the empty state renders under `cart.items.length === 0` with no seeding, filtering, auth bypass or data mutation |
| Exercises meaningful props | The **only** consumer passing `icon` (`ShoppingCart`), plus `title`, `body`, and `action` as a TanStack `Link` to `/plans` |
| No data/logic change needed | The condition is consumer-owned and satisfied by default |
| Clean proof surface | Single instance on the page, inside `MarketplaceShell`, already measured in Phase 24 at 1344 × 306 / 770 × 306 / 358 × 334 with zero console errors and no page-level overflow |

`className` is the only prop this consumer does not exercise; it is covered by `/shared/$token` in a later gate, not here. No other consumer is migrated, and no alternate implementation is converted or compared.

---

## 3. Current source path and hash

| Item | Value |
| --- | --- |
| Source | `src/components/abox/empty-state.tsx` |
| md5 | `6cfba448d43364417d733a56ad819b72` |
| Dependencies | `cn` (`@/lib/utils`), `DiagonalWeave` (`./decor`, aliased to `DotField`), `ComponentType` (type only) |

---

## 4. Current import relationship

```
src/routes/cart.tsx:8   import { EmptyState } from "@/components/abox/empty-state";
src/routes/cart.tsx:52  <EmptyState icon={ShoppingCart} title="Your cart is empty"
                           body="Add a health plan, then optionally bundle dental, vision, or life."
                           action={<Link to="/plans" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Browse plans</Link>} />
```

Direct import of the canonical source. No wrapper, alias, barrel indirection, local re-implementation or duplicated definition exists between consumer and source.

---

## 5. Current rendered anatomy (observed in Phase 24, unmodified)

```
div  (no role, no aria-live, no landmark)
  "relative flex flex-col items-center gap-4 overflow-hidden rounded-lg
   border border-dashed border-border-strong bg-surface/60 px-6 py-14 text-center"
 ├ div.pointer-events-none.absolute.inset-0.[mask-image:…].opacity-40  [aria-hidden="true"]
 └ div.relative.flex.flex-col.items-center.gap-4
   ├ div.flex.h-12.w-12.items-center.justify-center.rounded-md.border.border-hairline.bg-background
   │   └ svg 20×20 [aria-hidden]  (ShoppingCart, text-primary)
   ├ p.text-display.text-2xl               "Your cart is empty"
   ├ p.max-w-md.text-sm.text-muted-foreground
   └ a.mt-2.rounded-full.bg-primary.px-4.py-2.text-sm.text-primary-foreground → /plans
```

Computed at 1440: padding `56px 24px`; border `1px dashed oklch(0.3 0.04 265 / 0.24)`; radius `14px`; background `oklab(0.968 … / 0.6)`; overflow hidden; `align-items: center`; gap `16px` outer and inner; `text-align: center`; `min-height: 0px`; no shadow, no transition. Title Bricolage Grotesque 24px / 600 / 32px, `oklch(0.22 0.025 265)`. Body 14px, `oklch(0.5 0.018 265)`, `max-width: 448px`. Icon plate 48 × 48, radius 10px, hairline border, white background; glyph 20 × 20 in `oklch(0.31 0.09 265)`. Action 114 × 36, fully rounded, primary background, 14px.

---

## 6. Proposed exact implementation boundary

**Zero production code change.**

- `src/components/abox/empty-state.tsx` — not modified.
- `src/routes/cart.tsx` — not modified. Current import is already the canonical one; a rewrite would be an unnecessary refactor and is explicitly forbidden.
- No canonical wrapper is introduced. No Slot/asChild or other abstraction is used — following the Phase 17 precedent, such an abstraction may only be introduced when exact ref, event, DOM and prop behaviour is proven identical, and no evidence here requires one.
- No import change, no barrel file, no alias, no re-export.

If a future finding shows a change is genuinely required, it is documented (source file, consumer file, current import, proposed import, expected DOM, expected class strings, expected behaviour, necessity) and brought back for approval — not applied inside this gate.

---

## 7. Before/after preservation contract

The application must remain pixel-identical and behaviourally identical: DOM structure, element types, class strings, computed styles, dimensions, spacing, typography, colours, borders, radius, background, decoration, iconography, action markup, links, navigation, button behaviour, responsive behaviour, accessibility behaviour, shell context, route behaviour, content, business logic, branding and marketplace assets. Because the boundary is zero change, "before" and "after" are expected to be byte- and pixel-identical. Any observed difference halts the gate and is reported, never corrected by editing the application. No visual or behavioural improvement is authorized.

---

## 8. API preservation

The existing API remains authoritative and unchanged: `title` (required), `icon`, `body`, `action`, `className` (optional). No prop is added, renamed or redefined; no ReactNode prop is converted to another representation; consumer-owned action logic stays in the consumer; the decor implementation, tokens and styling are untouched; the seven repeated action class strings are untouched; the `<p>` title is untouched and no `aria-live` or role is added.

---

## 9. Proof-gate route

`/cart` with an empty cart, inside `MarketplaceShell`, at 1440 / 834 / 390. One gate, one consumer, one instance.

---

## 10. Natural reachability method

Open `/cart` in a fresh browser context where no plan has been added — the default state. If a cart item is present, it is removed using the existing in-app remove control only. Prohibited: seeding fake data, mutating `cart-store` directly, altering route logic, adding temporary test branches, changing filters, bypassing conditions, or touching authentication. If the state cannot be reached naturally, that is recorded as a blocker and the gate stops.

---

## 11. DOM and class verification

Capture the full element tree from the panel `div` through decor layer, inner stack, icon plate, glyph, title `p`, body `p` and the action `a`. Record verbatim `className` for each — no normalization, no sorting, no trimming — and compare against the anatomy in §5. Confirm element types: panel `DIV`, title `P`, body `P`, action `A` with `href="/plans"`.

---

## 12. Computed-style verification

For panel, decor, inner stack, icon plate, glyph, title, body and action: font-family, font-size, font-weight, line-height, letter-spacing, colour, background-color, padding, gap, align-items, text-align, border-width/style/colour, border-radius, box-shadow, overflow, min-height, transition, opacity. Values recorded as rendered; never compared against an idealized token value and never adjusted to match one.

---

## 13. Geometry verification

`getBoundingClientRect` for panel, icon plate, glyph, title, body and action at each viewport; expected panel dimensions from the Phase 24 baseline are 1344 × 306, 770 × 306 and 358 × 334, with the icon plate 48 × 48, glyph 20 × 20 and action 114 × 36 constant across viewports.

---

## 14. Responsive verification

Run the full capture independently at **1440, 834 and 390** — mobile behaviour is measured, never inferred from desktop. Check panel width and height, text wrapping, the 448px body clamp, constant padding/gaps/typography (the component declares no breakpoint variants), and page-level overflow (`document.scrollWidth == clientWidth`).

---

## 15. Interaction and navigation verification

The action is a TanStack `Link`: confirm it renders as `A` with `href="/plans"`, is focusable, shows its focus treatment, and navigates to `/plans` on click and on Enter. No button behaviour applies at this gate (the only `button` action lives in `/plans`, which is out of scope here). Confirm the panel itself has no hover, focus or click behaviour.

---

## 16. Accessibility verification

Confirm and record without changing: panel is a plain `div` with no role and no `aria-live`; the title remains `<p>` and contributes no heading level; the decor layer and icon glyph remain `aria-hidden="true"`; the action is the only focusable element inside the panel; tab order follows DOM order; the page's own heading structure is unaffected. No ARIA is added and no semantic element is promoted.

---

## 17. Shell and context verification

Confirm `MarketplaceShell` renders unchanged around the empty state — header, navigation, assistant affordance and spacing — and that route behaviour on `/cart` is unaffected. No shell file is inspected for modification, only for rendered effect.

---

## 18. Console, typecheck, build and lint verification

Zero console errors on `/cart` at all three viewports. `tsgo --noEmit` clean. Build log reports OK. ESLint run against `src/components/abox/empty-state.tsx` and `src/routes/cart.tsx` with every finding recorded verbatim and left unfixed; pre-existing findings are listed separately from anything new. Any new issue is reported, not repaired.

---

## 19. Rollback strategy

The boundary is zero change, so there is nothing to revert; rollback is a no-op. If the gate were ever to require a production change in order to pass, that change is not made — the requirement is recorded as an unresolved migration decision and the gate stops pending approval.

---

## 20. Alternate-system boundary

Out of scope and untouched, with no migration, comparison or ranking: Lucie-app `EmptyState`, `ConversationEmptyState`, M08 `EmptyRows`, the M06 inline empty paragraph, Lucie `Table.empty`, the ABox `DataTable` empty row, and all route-local dashed empty blocks.

---

## 21. Explicit out-of-scope items

The other seven EmptyState consumers; centralizing the repeated action class strings; promoting the `<p>` title; adding `aria-live` or roles; changing the decor implementation; changing tokens or styling; adding or renaming props; converting ReactNode props; moving action logic into the component; Branding & White-Label; Marketplace Asset Management; marketplace and branding asset ownership; existing runtime stores; admin asset screens.

---

## 22. Risks and blockers

1. Cart state persists per session — the gate must begin from an empty cart reached through the application itself.
2. A zero-change gate proves canonical status for `/cart` only; the remaining seven consumers stay unproven.
3. `/plans` filtered-empty (the only `button` action) and the `shared.$token` expired branch were unreachable in Phase 24 and remain outside this gate.
4. `DiagonalWeave`/`DotField` coupling means any decor change would propagate to all eight consumers — a further reason the boundary is zero change.
5. Any difference observed between viewports must be attributable to container width or text wrapping; anything else halts the gate.

---

## 23. Confirmation that implementation has NOT occurred

No production source, route, component, style, foundation, dependency, branding or marketplace file was created, modified or deleted. `src/components/abox/empty-state.tsx` hash remains `6cfba448d43364417d733a56ad819b72`; `src/routes/cart.tsx` is unchanged. `git status` shows only this planning document. Work stops here pending approval of the gate.
