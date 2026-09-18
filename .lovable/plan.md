# Phase 25 — Execute EmptyState First-Consumer Proof (/cart)

Unchanged from the approved plan; re-issued only because the session returned to plan mode and I need it approved again to run the proof. Approve to execute immediately.

## Boundary

Zero production-code change. `src/components/abox/empty-state.tsx` and `src/routes/cart.tsx` are not modified. No wrapper, no Slot/asChild, no import/prop/style/token/logic/route/store/branding/marketplace change, no action-class centralization, no title-semantics change, no `aria-live`, no decor change.

## Execution

1. **Before** — record md5 of `src/components/abox/empty-state.tsx`, `git status`, and the current import relationship (`cart.tsx:8` → canonical source; call site line 52).
2. **Reach `/cart` naturally** — fresh browser context with an empty cart. If items exist, remove them only via the existing in-app remove control. No storage edits, no scripted data mutation, no logic changes, no test branches.
3. **Capture at 1440, 834 and 390 independently** (no inference between viewports):
   - Full DOM hierarchy and verbatim class strings for panel, decor layer, inner stack, icon plate, glyph, title, body and action.
   - Computed styles: font family/size/weight/line-height, colours, padding, gaps, border width/style/colour, radius, background, overflow, align-items, text-align, min-height, box-shadow, transition.
   - Geometry for panel, icon plate, glyph and action; wrapping and spacing.
   - Page-level overflow: `document.scrollWidth` vs `clientWidth`.
   - MarketplaceShell relationship and route behaviour.
   - Accessibility: plain `div`, no role, no `aria-live`, title still `<p>`, action the only focusable control, tab order.
   - Console output.
4. **Action/navigation proof** — focus the action, record its focus treatment and dimensions, activate it, verify navigation to `/plans`, return to `/cart` through normal navigation. The action is not altered.
5. **Re-measure the Phase 24 baseline** (1344×306 / 770×306 / 358×334) and report actual values.
6. **Checks** — `tsgo --noEmit`, production build, ESLint on the component and the route with pre-existing findings recorded separately and left unfixed.
7. **After** — re-record source hash, `cart.tsx` state, `git status`; confirm no production, route, style, foundation, dependency, branding or marketplace file changed and no second EmptyState exists.

If any runtime step is blocked, report exactly what was unreachable. No evidence is fabricated and no difference is repaired.

## Out of scope

Lucie-app `EmptyState`, `ConversationEmptyState`, M08 `EmptyRows`, M06 inline paragraph, Lucie `Table.empty`, ABox `DataTable` empty row, route-local dashed blocks, the other seven consumers, and the seven repeated action class strings.

## Output

An EXECUTION FINAL REPORT with the 22 required sections containing real measured values — not a plan.
