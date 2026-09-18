# Phase 32 — Group C Interactive / Selectable Card Surface Centralization (PLAN ONLY)

## 1. Objective
Audit production card surfaces where the panel itself is the interactive or selectable affordance, and centralize their shared base surface styling onto the existing canonical source only where byte-identical class output, identical DOM, identical interaction semantics and identical accessibility can be proven per consumer. Zero migrations is an acceptable, valid outcome.

## 2. Scope Boundary
In scope: production `src/**` interactive card surfaces. Out of scope and untouched: `src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`, branding runtime, marketplace asset runtime, all foundation tokens. `src/components/abox/surface.tsx` is locked for planning (hash `51b51b31bee3283794f6a05af03f2878`).

## 3. Group C Definition
A surface is Group C only when the element carrying the card surface classes is itself interactive or selectable: `Link`/`a`, `button`, `label` acting as a selectable card, or an element with `role=button`/`role=link`/`aria-pressed`/`aria-selected`/`data-state` plus keyboard operability. A static panel that merely contains links or buttons is NOT Group C.

## 4. Fresh Inventory Method
At execution start, run a fresh read-only repository-wide inventory (no reuse of historical counts) across `src/**` excluding the reference layer, matching: `rounded-2xl`, `rounded-xl`, `border-border`, `border-hairline`, `bg-card`, `shadow-card`, `shadow-elevated`, `hover:`, `focus:`, `focus-visible:`, `active:`, `cursor-pointer`, `group`, `data-state`, `aria-selected`, `aria-pressed`, `role="button"`, `role="link"`, `onClick`, `Link`/`NavLink`. Every hit is opened and read in source; no classification from grep alone.

Per candidate record: file, line, route/screen, exact class string, element type, semantic role, native vs ARIA interaction, href/action, keyboard interaction, focus behaviour, hover behaviour, active/pressed behaviour, selected/unselected, disabled, loading, padding, radius, border, background, shadow, decoration, responsive overrides, inline styles, pseudo-elements, child count, interactive descendants, event handlers, state source, owning system, whether Surface/surfaceClass is already involved, eligibility classification, exclusion reason.

## 5. Candidate Taxonomy
Every hit is placed in exactly one bucket, with no ranking or scoring:
A. Static Group A surface already centralized (Phase 30).
B. Group B elevated/decorated surface already audited (Phase 31).
C. Group C interactive/selectable card candidate.
D. Experience-specific interactive composition.
E. Non-ABox system (shadcn ui, Lucie, Lucie-app, M06, M08).
F. Explicit exclusion.

Preliminary signal from a read-only survey (to be re-measured at execution, not carried forward as fact): `app.agency.index.tsx` lines 28/33/38/42 are four `Link` cards sharing one exact string `rounded-2xl border border-border bg-card p-5 hover:bg-accent/40`; `agent-unavailable.tsx` lines 24/25 are `Link` cards on `... p-4 hover:bg-accent`; `journey-choice.tsx` lines 30/34 are full-width `button` cards; `app.index.tsx:190` is a `Link` card on the border-hairline/shadow-card vocabulary with translate/border hover; `quote.tsx` lines 896/959/1142 are `label` selection cards on `bg-surface`/`bg-sage-soft`; `index.tsx:188` and `plan-card.tsx:44` are decorated hero/plan cards. None of these is assumed eligible.

## 6. Existing Canonical Source Assessment
`surfaceClass()` emits in fixed order: base (`rounded-2xl border border-border bg-card`) → padding → elevated → interactiveHover (`transition-colors hover:bg-accent`) → decor. The first execution question per candidate is purely mechanical: does `surfaceClass({...})` reproduce the consumer's existing string byte-for-byte, in the same order? Where a candidate's hover differs (`hover:bg-accent/40`, `hover:-translate-y-0.5`, `hover:border-primary/30`) or lacks `transition-colors`, `interactiveHover` does NOT match and the consumer is not eligible under option 1.

## 7. Interaction-Semantics Assessment
For every Group C candidate, document before any decision: native element and its built-in semantics, activation keys, focus target, focus-visible treatment, pointer behaviour, event propagation, nested interactive descendants, navigation/route/URL and browser back-forward effects, selected/disabled/loading state sources. No candidate is eligible until its full interaction model is written down.

## 8. Canonical Architecture Decision Framework
Strict priority:
1. Existing `surfaceClass()` with no source change.
2. A narrowly scoped, additive, default-off helper option — only if at least two eligible consumers share the exact treatment and all Phase 29/30/31 consumers provably keep byte-identical output.
3. A dedicated canonical interactive-card primitive — only if repeated interaction semantics (not merely similar looks) justify a component-level source.
4. Leave literal.
No universal card component. No merging of cards differing in navigation, selection, keyboard, focus, state, disabled, loading, business logic or accessibility semantics.

## 9. API / Helper Design
Default position: no API change. Group C consumers keep their own element and apply canonical base classes through `surfaceClass()` composed with `cn(...)`, exactly as Phase 30/31 precedent. Any proposed option must be additive, default off, leave existing option names and emission order untouched, require no change to any existing consumer, and be justified by two or more eligible consumers. A singleton treatment stays literal.

## 10. DOM Preservation Strategy
Class helper on the existing native element only; never a component wrapper around an interactive element. `Link` stays `Link`, `button` stays `button`, `label` stays `label`. A consumer is ineligible if canonicalization would change element type, wrapper count or position, DOM ancestry, selector relationships, CSS inheritance, stacking context, containing block, event target, event propagation, focus target or the accessibility tree.

## 11. Class Preservation Strategy
Rendered `class` must be byte-identical. Consumer-specific, conditional, state and responsive classes keep their original ordering; where a consumer has leading classes, they are placed first inside `cn(...)` so the merged string order is unchanged. Canonical emission order is never reordered for one consumer. Non-reproducible ordering ⇒ literal.

## 12. State Matrix
Per eligible family, enumerate and then measure only the states that actually exist: rest, hover, focus, focus-visible, active, pressed, selected, unselected, disabled, loading, unavailable, visited where relevant, plus any width-specific differences. No existing state may be omitted from the audit.

## 13. Visual Verification
Before/after per consumer: exact class attribute, DOM snapshot, computed padding, margin, border width/style/colour, radius, background, box-shadow, opacity, transition, typography, cursor, outline, outline-offset, transform, position, overflow — captured at rest and at each existing interactive state (hover, focus-visible, active/pressed, selected, disabled).

## 14. Geometry Verification
Card bounding rectangle, direct-child rectangles, focus outline geometry, pseudo-element geometry, and position relative to neighbouring cards in the same grid/stack.

## 15. Responsive Verification
Every batch verified independently at 1440, 834 and 390: dimensions, wrapping, grid/stack behaviour, gaps, overflow (`scrollWidth` vs `clientWidth`), focus visibility, touch target size. Mobile behaviour is never inferred from desktop.

## 16. Accessibility Verification
Semantic element, accessible name, role, ARIA attributes, tab order, keyboard activation, focus target, focus-visible styling, disabled semantics, selected and pressed semantics, and accessibility tree all unchanged. No redundant ARIA added where native semantics already apply.

## 17. Nested Interactive Content
Cards containing links, buttons, inputs, selects, checkboxes, radios or menus are audited for their existing interaction model first. A card is ineligible if canonicalization would create invalid or behaviourally different nested-interactive semantics.

## 18. Known Areas to Re-audit
Re-audit without presumption of migration: `src/routes/app.index.tsx`, `journey-choice`, `app.agency.index.tsx`, `agent-unavailable`, quote selection labels, marketplace interactive cards, organization/plan/quote selection cards, dashboard navigation cards, and any family surfaced by the fresh inventory. Phase 31's `quote.tsx:499` and `coverage.tsx:49` remain unchanged. The ICHRA panels remain literal.

## 19. Explicit Exclusions
KpiCard, PlanCard, EmptyState internals, DataTable internals, StatusBadge, ActionPill, PageHeader, InternalShell, MarketplaceShell, MemberShell, ModuleTabs, Lucie, Lucie-app, M06, M08, dialogs, drawers, sheets, popovers, menus, overlays, modals, cards with bespoke state machines, cards whose styling is inseparable from business logic, experience-specific compositions, unsupported responsive behaviour, non-reproducible class ordering, non-identical DOM, non-identical accessibility semantics, unsafe nested interactive content, non-reproducible state behaviour.

## 20. Migration Eligibility Rules
A consumer is eligible only when all hold: it is genuinely Group C; its full class string is reproducible byte-for-byte by `surfaceClass()` plus consumer classes in original order; its element type and DOM are unchanged; every existing state renders identically; accessibility is unchanged; it belongs to no excluded system; and it is part of a repeated ordinary pattern rather than a one-off experience. Otherwise: literal, documented exception.

## 21. Batch Strategy
Batch count is derived from the fresh inventory, not predefined. Batch 1 is exactly one proof consumer drawn from a repeated ordinary interactive-card pattern. Each later batch lists its consumers, eligibility rationale, interaction semantics, expected files, rollback procedure, verification gate and source-integrity check. Batches are never collapsed into one pass. If no family proves safe, Phase 32 concludes with zero migrations and a written rationale.

## 22. Consumer-by-Consumer Migration Map
Produced at execution from the fresh inventory as a file:line table with classification bucket, eligibility verdict, proposed usage (or "remain literal") and exclusion reason. No migration map entry is committed to in advance of that inventory.

## 23. Rollback Strategy
Each migrated consumer is independently reversible by restoring its original element, original class string and original imports; interaction semantics are untouched by construction. If the canonical source were extended, rollback must additionally leave every Phase 29/30/31 consumer byte-identical.

## 24. Branding Boundary
Branding & White-Label remains runtime-owned: no branding state, store, route, asset or white-label behaviour touched.

## 25. Marketplace Boundary
Marketplace Asset Management remains runtime-owned: no asset state, upload flow, record, ownership or behaviour touched.

## 26. Reference-System Boundary
`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide` untouched; no duplication or relocation of production ownership into the reference layer.

## 27. Foundation Boundary
No normalization of spacing, typography, controls, icon sizing, token naming, radius vocabulary, shadow vocabulary, density or motion. Any foundation gap found is recorded as a separate future opportunity only.

## 28. Governance / Future Usage Rules
`src/components/abox/surface.tsx` remains the single canonical source of the shared card base. Interactive consumers use `surfaceClass()` on their own native element; duplicate implementations of the base string are prohibited. Interaction state and accessibility remain owned by the consumer, never by the canonical source. New interactive-card patterns are classified through this same taxonomy before adoption; exceptions and evidence are recorded in `.lovable/manual-work-map.md`.

## 29. Validation Commands
Per batch: `npx tsgo --noEmit`; production build; ESLint on touched files only; console verification on the affected routes; `git status` before/after; changed-file review; `md5sum src/components/abox/surface.tsx`. Pre-existing lint findings are recorded separately from new findings; any new error blocks that batch.

## 30. Evidence Capture Requirements
Evidence is never manufactured. Anything not captured is reported as `NOT CAPTURED`. Auth-gated routes that cannot be measured are left literal rather than migrated on inference.

## 31. Risk Register
- Hover vocabulary mismatch (`hover:bg-accent/40`, translate/border hovers) makes `interactiveHover` unusable — mitigation: literal.
- Pressure to extend the API for cosmetic consistency — mitigation: two-consumer rule, additive default-off only.
- Focus/keyboard regression from wrapper insertion — mitigation: class helper only, never wrappers.
- Auth-gated interactive cards unverifiable — mitigation: literal, NOT CAPTURED.
- Selection-state cards whose classes are conditional — mitigation: ineligible unless every state string is reproducible.

## 32. Deferred Opportunities
Phase 27 EmptyState third-consumer proof and remaining EmptyState consumers; ICHRA parity if a test account is supplied; Phase 30 batches 2–7 measured-parity backfill; possible unification of metric cards; hover-vocabulary consolidation as a separate foundation phase.

## 33. Expected Changed Files
Unknown until the fresh inventory; expected to be a small number of route files, plus `.lovable/manual-work-map.md` for exception records. `src/components/abox/surface.tsx` expected unchanged.

## 34. Success Criteria
Complete fresh inventory and taxonomy; every candidate classified with recorded evidence; migrations only where measured parity is proven; canonical source unchanged unless a justified additive option is proven; no DOM, interaction, accessibility, responsive or visual change anywhere; zero migrations is a valid success.

## 35. Final Report Requirements
The eventual implementation report must distinguish: migrated consumers, intentionally literal consumers, excluded systems, measured parity, page-level verification, state-level verification, evidence NOT CAPTURED, actual source changes, actual consumer changes, regressions if any, and unresolved decisions.

## 36. Authorization Boundary
PLAN ONLY. No production file created, modified, deleted, renamed, migrated or refactored; `src/components/abox/surface.tsx` untouched. Implementation begins only after separate approval of this plan.
