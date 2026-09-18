# Phase 38 — Production Spacing & Layout Source-of-Truth Audit / Centralization

## 1. Objective

Audit current production spacing and layout in `src/routes/**` and `src/components/abox/**`, distinguish semantic relationships from repeated numbers, and centralize only exact, independently measurable duplicates. This phase is not a redesign, normalization, density change, or responsive rewrite. A zero-migration result remains valid if execution evidence invalidates the candidates below.

## 2. Preservation contract

“NOT ONE PIXEL, NOT ONE DOT.” Every accepted migration must preserve the native element and DOM hierarchy, attribute and child order, exact rendered class string, computed spacing and dimensions, parent/child geometry, breakpoints, wrapping, overflow and scrolling, sticky/fixed behavior, interactions, accessibility, routing, content, and business behavior. No nearby-token substitutions, class reordering, new wrappers, or layout normalization are allowed.

## 3. Fresh inventory methodology

- Re-scan the implementation state immediately before execution; do not reuse Phase 2 counts as proof.
- Scope production routes and ABox components; exclude `/design-system`, `/design-guide`, `src/lib/design/**`, `src/components/design/**`, Branding & White-Label runtime, Marketplace Asset Management runtime, Lucie/Lucie-app, M06, M08, and AI-elements.
- Enumerate padding, margin, gap/space, positioning/inset, width/min/max-width, height/min/max-height, page gutters, section/card/form/table/navigation/overlay spacing, responsive variants, arbitrary values, `calc()`, CSS variables, constants, and inline styles.
- For every repeated candidate, open every call site and record: file/line, route, element, semantic role, exact class string, ancestry, children, component/shell owner, responsive variants, content dependency, state/business coupling, overflow/sticky behavior, measurability, and decision.
- Treat counts as discovery only. The fresh scan currently finds 4,431 spacing/layout-token occurrences and 298 distinct tokens across the scoped route/ABox files; common values include `gap-2` 233, `px-3` 208, `mt-1` 143, `px-4` 132, `gap-3` 131, and `gap-4` 82. These counts do not establish shared meaning.

## 4. Spacing inventory

Create an execution register covering:

- Page: outer gutters, top/bottom padding, major section rhythm.
- Section: heading-to-content, subsection, section-to-section relationships.
- Component: surface/card padding, internal gaps, action groups.
- Forms: field stacks, label/control/helper relationships, grouped controls.
- Content: heading/body, paragraphs, lists, tables.
- Navigation: items, tabs, breadcrumbs, pagination.
- Overlays: dialog, sheet/drawer, popover, action rows.
- Shells and experiences: internal, marketplace, member, quote, apply, off-exchange, journey, AI review, agent/agency/member/admin.
- Route-local, business-coupled, and deliberately bespoke values.

Fresh high-frequency values are heterogeneous: for example, `gap-2` appears in headers, controls, lists, navigation, and business rows; `p-5` appears in Surface padding and unrelated bespoke panels. They remain separate unless call-site inspection proves identical relationships and ownership.

## 5. Layout inventory

Record container width, centering, gutters, grid/flex tracks, min/max sizing, sticky/fixed positioning, overflow, and responsive transitions. Current confirmed families include:

- Marketplace wide content wrapper, six exact call sites: `compare.tsx:63`, `coverage.tsx:32`, `cart.tsx:37`, `plans.$planId.tsx:62`, `review.tsx:37`, `plans.index.tsx:211` — `mx-auto max-w-[88rem] px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-6`.
- Marketplace narrow workflow wrapper, four exact call sites: `schedule.tsx:30`, `ai-review.tsx:48`, `handoff.tsx:28`, and the empty state of `apply.tsx:91` — `mx-auto max-w-4xl px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6`.
- Other `max-w-[88rem]` layouts deliberately differ in padding, rhythm, display mode, or purpose: landing sections, auth split, quote flow, select, ICHRA, footer, product switcher, and member shell. They are not members of either exact wrapper family.
- Internal, marketplace, and member shell geometry remains three independent systems.

## 6. Semantic taxonomy

Classify every candidate once as: page-level, section-level, component-level, form-level, content-level, navigation-level, overlay-level, shell-level, experience-level, route-local, business-coupled, or intentional bespoke. Within each category, record whether it is canonical, repeated and eligible, repeated but semantically distinct, component-owned, shell-owned, route-local, one-off, auth-gated/NOT CAPTURED, or excluded.

Numeric coincidence never establishes a token. `gap-4` in an action row, field stack, and navigation list remains three relationships; `p-5` on Surface, a warning panel, and shell content remains separately owned.

## 7. Ownership map

Preserve these verified owners:

- `Surface` / `surfaceClass`: base surface plus `none`, `p-4`, `p-5`, `p-6` padding variants.
- `ActionPill` / `actionPillClass`: control-internal height, horizontal padding, and icon gap.
- `controlClass`: control height and horizontal padding.
- `PageHeader`: default/compact outer rhythm, internal title/action gap, description spacing, icon geometry, and hairline spacing.
- `KpiCard`, `DataTable`, `EmptyState`, `Field`, and `NoticePage`: their intrinsic spacing.
- shadcn card/button/input/table/dialog/sheet primitives: their own independently versioned spacing.
- internal, marketplace, and member shells: shell-specific geometry only.

Do not extract intrinsic values merely because the same number appears elsewhere.

## 8. Existing token/source map

- `src/styles.css` currently defines radii, typography, color, shadows, and decorative geometry, but no production semantic spacing or page-container custom properties.
- Tailwind’s spacing scale is the emitted value source for ordinary utility classes; it is not evidence that different semantic uses share ownership.
- `src/lib/design-tokens.ts` and `SPACING_STEPS` are reference inventory only and cannot become runtime ownership in this phase.
- Surface, ActionPill, and control helpers are the existing production class-level spacing owners described above.
- No existing production page-layout/container helper was found. Unused UI primitives are not made canonical merely because they exist.

## 9. Candidate centralization opportunities

### Candidate P1 — wide marketplace content wrapper

Six consumers share the exact element type (`div`), exact direct-child position under `MarketplaceShell`, exact class string, same page-content role, and the same mobile/tablet gutter and vertical-rhythm contract. This is the strongest candidate for a narrow class source.

### Candidate P2 — narrow marketplace workflow wrapper

Four consumers share the exact element type, direct-child shell relationship, exact class string, and constrained workflow/confirmation-page role. `apply.tsx:91` is only the empty-state branch; that state must be captured independently before it may migrate.

### Candidate P3 — table-cell spacing

Raw `px-3 py-2` occurs in structurally similar route-local tables, but current evidence is insufficient to prove common component ownership, full table anatomy, density, and runtime accessibility across all call sites. Inventory it, but leave it literal unless execution inspection and measurable route evidence prove at least two exact consumers without competing `DataTable` ownership.

### Candidate P4 — route-local error/stack/row spacing

Repeated `space-y-4`, `rounded-lg … px-3 py-2`, and quote error blocks are discoveries only. They combine layout with business validation, controls, or route-specific state. Default decision: literal/deferred unless a fresh semantic and behavioral proof clears every gate.

## 10. Exact equivalence criteria

A candidate proceeds only when at least two legitimate, independently measurable consumers have the same semantic relationship, ownership boundary, element/component context, exact relevant class output, responsive behavior, content/wrapping behavior, surrounding geometry, alignment, overflow behavior, and no incompatible shell or business coupling. A shared source must reduce duplication without changing or broadening meaning.

## 11. High-risk areas

Treat page gutters, shell spacing, arbitrary pixel values, nested grid/flex tracks, tables, sticky headers, scrolling regions, dialogs/sheets, mobile-only rules, dynamic panels, wizard flows, marketplace/admin layouts, and business-specific geometry as blocked until independently proven. `calc()` values and component geometry tied to typography or control sizing are not token candidates by default.

## 12. Auth-gated limitations

The current browser state is `LOVABLE_BROWSER_AUTH_STATUS=signed_out`. All `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, and `/member/*` runtime candidates are source-audited but marked **NOT CAPTURED** unless a valid session becomes available during execution. No auth-gated candidate may migrate from source similarity alone. Public route state that depends on cart, quote, or workflow data must be constructed through the real UI/storage flow before proof.

## 13. Proposed migration batches

### Batch 0 — narrow source only

If final preflight reconfirms P1 and P2, add `src/components/abox/marketplace-page-layout.ts` containing only two exported constants:

```ts
export const MARKETPLACE_PAGE_LAYOUT = {
  wide: "mx-auto max-w-[88rem] px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-6",
  narrow: "mx-auto max-w-4xl px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6",
} as const;
```

This is a class source, not a component: it adds no DOM, polymorphism, props, variants beyond the two proven roles, or business logic. Do not change `MarketplaceShell` or move the wrapper into it because shell consumers intentionally use different widths and rhythms.

### Batch 1 — P1 proof

Migrate only `coverage.tsx:32` to `MARKETPLACE_PAGE_LAYOUT.wide`. Capture and compare before/after at all required widths. Any class, geometry, wrapping, or overflow difference stops P1, restores the literal, removes the unused key if necessary, and records the incompatibility.

### Batches 2–6 — remaining P1 consumers

Independently gate `compare.tsx:63`, `plans.$planId.tsx:62`, `cart.tsx:37`, `review.tsx:37`, and `plans.index.tsx:211`. Populate real compare/cart/review states where needed; do not infer non-empty-state parity from an empty page.

### Batch 7 — P2 proof

Migrate only `schedule.tsx:30` to `MARKETPLACE_PAGE_LAYOUT.narrow`; verify pick, form, and done states where reachable through the real flow.

### Batches 8–10 — remaining P2 consumers

Independently gate `ai-review.tsx:48`, `handoff.tsx:28`, and `apply.tsx:91`. Capture AI-review editing/confirmation states, populated and empty handoff states when available, and specifically the empty apply branch. A state that cannot be reached is NOT CAPTURED and its consumer remains literal.

P3/P4 receive no migration batch unless fresh execution evidence upgrades them under the same one-consumer-first process. No repository-wide sweep is permitted.

## 14. Exact proof methodology

For each consumer, save before and after evidence at 1440×viewport, 834×viewport, and 390×viewport using the same content and state. Compare:

- serialized DOM subtree, attributes, child order, and exact class attribute;
- computed margins, padding, row/column gap, width/height and min/max dimensions;
- wrapper, parent, first/last child bounding rectangles and x/y positions;
- grid/flex tracks and alignment, wrapping, line count, scroll width/height, client dimensions, and overflow;
- sticky/fixed position and meaningful responsive transitions;
- interactive-state geometry where relevant;
- landmarks, heading structure, tab order, keyboard behavior, destinations, business state, and console output.

Screenshots supplement metrics; they do not replace byte and geometry comparisons. Any unexplained difference fails the batch.

## 15. Expected source changes

If both candidates pass, expected implementation files are:

- new `src/components/abox/marketplace-page-layout.ts`;
- the ten listed consumer routes, only as independently verified;
- `.lovable/manual-work-map.md` after implementation for governance and evidence.

No CSS, shell, reference, token-inventory, component-library, dependency, route-definition, content, or asset changes are expected. The actual changed-file set may be smaller or zero when evidence blocks a consumer.

## 16. Expected zero-change paths

Leave literal: all shell geometry; landing-page sections; quote/apply full workflow widths; select, ICHRA, auth, footer, and product-switcher containers; Surface/ActionPill/control internal spacing; component-intrinsic spacing; tables not already owned by `DataTable`; form and business-state spacing; arbitrary/calc geometry; overlays; auth-gated candidates without evidence; all icon/control sizing already governed by Phase 37.

## 17. Explicit exclusions

No changes to reference-only architecture, Branding & White-Label runtime, Marketplace Asset Management runtime, the three shell families, Lucie/Lucie-app, M06, M08, AI-elements, foundation values, completed canonical component contracts, route behavior, content, typography, icons, controls, assets, or business logic. No universal Layout, Stack, Container, Spacing, polymorphic wrapper, global reset, or lint rule.

## 18. Governance updates

Only after implementation, record in `.lovable/manual-work-map.md`:

- the narrow marketplace wrapper source and its exact legitimate consumers;
- wide and narrow role definitions and the prohibition on using them by numeric resemblance alone;
- component-intrinsic and shell-specific owners;
- intentional duplicate values and rejected/deferred candidates;
- excluded and auth-gated NOT CAPTURED areas;
- future-use rule: a new consumer must match role, shell ancestry, element, full class contract, and responsive behavior exactly;
- exception rule and per-consumer rollback point.

## 19. Validation commands

After every batch, run:

- `npx tsgo --noEmit`;
- the project production build through the normal harness;
- targeted ESLint for the new source and touched consumer;
- full lint comparison, separating pre-existing findings from new findings;
- Playwright route/state checks at 1440, 834, and 390;
- DOM/class/computed-spacing/geometry/wrapping/overflow/scroll comparisons;
- accessibility and keyboard checks where applicable;
- console comparison;
- `git diff --check`, focused `git diff`, and `git status --short`;
- locked-source hash verification.

No existing lint backlog is repaired as part of this phase.

## 20. Locked-source/hash strategy

Capture hashes again immediately before execution. Current baselines include:

- `src/styles.css` — `534cd653f5aae3c9a8e042345d53d852`
- `surface.tsx` — `51b51b31bee3283794f6a05af03f2878`
- `action-pill.ts` — `a5bc83a678aacb67c1209f3bd2bcb405`
- `action-pill-component.tsx` — `4c9fb9167b9cf98c17b792387dd73b44`
- `control.tsx` — `1c6efd5cf752b69d16458b6af82b5d4f`
- `page-header.tsx` — `5be9e6eaf9a615fa79c3d591ea8f4d2c`
- `kpi-card.tsx` — `9279cd202f40815897f7f82a23972353`
- `data-table.tsx` — `63c1e60eed38407aa9d6e6301b362637`
- `empty-state.tsx` — `6cfba448d43364417d733a56ad819b72`
- `field.tsx` — `f35b23647e16f71451ce95a584a9951e`
- `notice-page.tsx` — `81ee6c0f956b0c40d50ddd9095185353`
- internal/marketplace/member shells — `37dbf66f…`, `dcdc36a6…`, `4a9dd8dd…`
- shadcn card/button/dialog/sheet — `d6c48ea3…`, `f7a5102d…`, `ef4fe8e7…`, `0221fbf9…`

All remain locked. The proposed new source receives a baseline hash immediately after Batch 0 and must remain unchanged through consumer batches.

## 21. Rollback strategy

Each consumer rolls back independently by restoring its original literal class string and removing only its new import when unused. If P1 or P2 fails completely, remove only that source key; if both fail, delete only the new source. Rollback must not touch Phases 29–37, shell code, CSS, dependencies, or unrelated consumers.

## 22. Final acceptance criteria

Success requires a complete fresh inventory and taxonomy; explicit ownership, exclusions, NOT CAPTURED evidence, and rejected candidates; at least two independently measured consumers for every retained canonical role; byte-identical class output; identical DOM, computed spacing, parent/child geometry, responsive behavior, wrapping, overflow/scrolling, accessibility, interactions, routing, business behavior, and console output at all three widths; clean typecheck/build; no new lint errors; locked hashes unchanged; and no unrelated diff. If these gates cannot be met, the accepted result is zero migration with the evidence documented.

**Authorization:** PLAN ONLY. Nothing in production, reference code, styles, routes, components, assets, branding, marketplace functionality, or behavior is implemented or changed until this plan is separately approved.
