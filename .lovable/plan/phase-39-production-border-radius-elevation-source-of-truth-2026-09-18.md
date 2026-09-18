# Phase 39 — Production Border, Radius & Elevation Source-of-Truth Audit Plan

## 1. Current-state audit methodology

Audit `src/routes/**`, `src/components/abox/**`, production utilities, and `src/styles.css` from the post-Phase-38 tree. Exclude `/design-system`, `/design-guide`, `src/lib/design/**`, `src/components/design/**`, Branding & White-Label runtime, Marketplace Asset Management runtime, Lucie/Lucie-app, M06, M08, AI-elements, and intentional shell styling.

For every occurrence, record the full class expression, element, semantic role, owner, route/state, responsive and interactive variants, pseudo-elements, inline styles, DOM ancestry, geometry/overflow implications, business coupling, and measurability. Classify each occurrence A–K under the requested taxonomy. Frequency is discovery evidence only, never equivalence evidence.

Fresh inventory baseline across the eligible production scope found 957 border-token occurrences across 27 spellings, 632 radius occurrences across 8 spellings, and 32 Tailwind shadow occurrences across 5 spellings. The largest families are `border` (417), `border-b` (362), `rounded-full` (272), `rounded-lg` (154), `rounded-2xl` (100), `rounded-xl` (65), and `border-hairline` (56). There are also 25 eligible inline `boxShadow`/`box-shadow` call sites. These totals will be regenerated immediately before any approved execution because they are an audit baseline, not a migration list.

## 2. Verified existing ownership

Preserve these current owners unchanged:

- `src/styles.css`: radius values `--radius-sm` through `--radius-4xl`; border colors `--border`, `--border-strong`, `--hairline`, `--input`; shadows `--shadow-card`, `--shadow-elevated`, `--shadow-drawer`, `--shadow-plate`, `--shadow-glow`, and compatibility alias `--shadow-overlay`; `card-brackets`, `edge-sheen`, `glass`, `ring-pill`, and `divider-warm` utilities.
- `Surface` / `surfaceClass`: exact base `rounded-2xl border border-border bg-card`, approved padding variants, opt-in `shadow-[var(--shadow-card)]`, interactive hover, and `card-brackets` decor.
- `ActionPill`: rounded-full action-control border/radius behavior and its existing variants.
- `controlClass`: `rounded-lg border border-border` within the established form-control geometry and optional focus ring.
- `PageHeader`: its icon tile border/radius and hairline treatment.
- `KpiCard`, `PlanCard`, `DataTable`, `EmptyState`, `StatusBadge`, `Field`, `NoticePage`, and shadcn primitives: their intrinsic treatments.
- Internal, marketplace, and member shells: independent shell-specific border/radius/elevation behavior; no merge.

## 3. Exact candidate inventory

### Candidate P39-E1 — shadow utility spelling

Current exact call sites using arbitrary variable syntax rather than the generated semantic utility include:

- Public/measurable: `auth.tsx` (four active segmented-control branches), `quote.tsx` (decorated subsidy panel), `plans.index.tsx` (mobile filter drawer), `select.tsx` (selected card and hover elevation).
- Auth-gated/unmeasurable: `app.communications.tsx`, `app.send-quote.tsx`, `app.quick-quote.tsx`, `app.jet.module1.tsx`.

The possible substitutions are `shadow-[var(--shadow-card)]` → `shadow-card`, `shadow-[var(--shadow-elevated)]` → `shadow-elevated`, and `shadow-[var(--shadow-drawer)]` → `shadow-drawer`. Both spellings derive from the same variables in `styles.css`, but the emitted class attribute is not byte-identical. Under this phase's exact-class preservation requirement, **P39-E1 is rejected and remains literal**. No normalization batch is proposed.

### Candidate P39-S1 — repeated hairline elevated/decorated cards

Observed consumers include the landing-page path cards, `KpiCard`, both `PlanCard` modes, the signed-in employer ICHRA panels, and route-local landing metrics/trust cards. They share fragments such as `rounded-2xl`, `border-hairline`, `shadow-card`, `card-brackets`, or `edge-sheen`, but differ in semantic role, element, full class output, radius, padding, hover translation, hover border, pseudo-element set, responsive layout, and component ownership. `KpiCard` and `PlanCard` are already intrinsic owners; signed-in consumers are not measurable. **Rejected as K/D/H/J, not a new shared source.**

### Candidate P39-P1 — segmented active-pill elevation

The exact active fragment `bg-card shadow-[var(--shadow-card)] font-medium` appears in public auth selectors and signed-in quick-quote/send-quote/communications/module selectors. Their surrounding control classes, icon structure, option counts, labels, state transitions, shell ownership, and measurability differ. ActionPill does not own segmented selectors. **Rejected as experience/route-local business state, not a border/radius/elevation abstraction.**

### Candidate P39-B1 — repeated borders, radii, and dividers

Repeated `border-b border-border`, `divide-y divide-border`, rounded-full bordered controls, warning/sage/destructive panels, and dashed containers span headers, tables, lists, status panels, inputs, dropzones, empty states, and actions. Matching fragments do not establish equivalent roles. Many are already owned by DataTable, EmptyState, NoticePage, ActionPill, controlClass, StatusBadge, or shadcn. **No surviving candidate.**

### Candidate P39-S2 — residual Surface-like literals

Residual `rounded-2xl border border-border bg-card` strings were rechecked. They are coupled to list division, overflow, sticky positioning, interactive link behavior, route state, or signed-in contexts, or were previously excluded by the exact Surface audit. No newly discovered pair clears all equivalence and measurement gates. **No migration.**

## 4. Proposed canonical sources

**None.** Current semantic variables and established components already own the legitimate shared treatments. Creating a second class constant for a fragment, adding radius aliases, adding a hairline Surface variant, or introducing a generic Card/Border/Radius/Shadow wrapper would duplicate ownership or collapse semantically distinct consumers.

Zero migration is the expected implementation result unless the execution-time inventory reveals a newly added, independently measurable pair that satisfies every gate. Any such discovery must stop execution and return for a revised plan; it is not pre-authorized here.

## 5. Exact consumer list for migration

**None.** No current consumer is approved for production migration. P39-E1 call sites remain an explicit spelling exception because changing the class token would violate byte-identical class output even though computed shadow should be equivalent.

## 6. Batch-by-batch sequence

### Batch 0 — baseline and classification only

- Regenerate route/component inventory and A–K taxonomy.
- Capture current hashes for all locked sources.
- Confirm public route/state reachability through supported UI/storage flows only.
- Produce no canonical source and no consumer change.

### Batch 1 — zero-change verification

- Confirm no eligible candidate survived.
- Run source searches ensuring no duplicate canonical source was introduced.
- Verify production files and runtime output remain unchanged.

### Batch 2 — governance only, after verification

- Add the Phase 39 audit result, ownership map, rejected candidates, NOT CAPTURED items, and rollback statement to `.lovable/manual-work-map.md`.
- No production/reference/UI file changes.

There are no consumer migration batches in the approved path. If future evidence establishes a candidate, it requires a revised plan with additive-source Batch 0, exactly one proof consumer in Batch 1, then independently gated consumers or tightly identical groups.

## 7. Parity and evidence gates

Because this plan proposes zero production migration, preserve baseline hashes and confirm no production DOM/class/style delta. If a revised plan later authorizes a migration, capture before and after at 1440, 834, and 390 for every state and verify:

- byte-identical class string, DOM tree, element, attributes, parent/child relationships;
- computed border width/color/style, radius, box-shadow, and `::before`/`::after` content/styles;
- element/parent/child rectangles, alignment, wrapping, overflow, scroll/client dimensions, and sticky positioning;
- rest, hover, focus-visible, active, selected, and disabled states where applicable;
- keyboard order/activation, ARIA/landmarks, navigation, routing, business state, and console output.

Visual similarity or screenshots alone do not pass. Entrance-animation timing noise must be separated from stable computed geometry and documented rather than silently accepted.

## 8. Auth-gated exclusions

`/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, and `/member/*` consumers that cannot be reached with a legitimate current session are source-inspected and marked **NOT CAPTURED**. This includes the signed-in segmented selectors, employer ICHRA decorated/elevated panels, dashboard cards, downline banner/actions, and administrative status panels. No runtime parity is inferred, no session is fabricated, and no auth-gated consumer is migrated.

## 9. Intentional exceptions and deferred areas

Leave literal or component-owned:

- `border-hairline` premium cards versus Surface's `border-border` base;
- `shadow-card` inline styles in KpiCard, PlanCard, landing-page metrics/cards, PlaceholderScreen, and DownlineContextBanner;
- `card-brackets`/`edge-sheen` combinations with differing pseudo-element, hover, radius, element, and ownership contracts;
- dashed EmptyState, PlaceholderScreen, coverage note, handoff, quote, Plan detail, and quote-edit patterns;
- responsive borders in PlanCard and route-local tables;
- warning/sage/destructive emphasis panels and selection borders tied to business state;
- shell chrome, overlays, drawers, assistant panels, and route-local arbitrary shadows;
- all shadcn primitive borders, radii, focus shadows, and elevation;
- residual Surface-like literals that remain coupled to overflow, lists, sticky behavior, or unmeasurable routes.

## 10. Validation commands and evidence

After the zero-change audit and after the governance-only update:

- `npx tsgo --noEmit`
- normal harness production build; inspect the newest `/tmp/observability/build-errors.log` entry
- targeted ESLint on the governance-adjacent scope only if production files unexpectedly change; otherwise document no production lint delta
- full lint comparison against the pre-existing baseline without repairing unrelated formatting
- `git diff --check`, focused `git diff`, and `git status --short`
- `rg` inventories for border/radius/shadow/decor definitions and consumers
- Playwright baseline only where needed to support classification; no before/after UI claim without a production change
- console/runtime/network log inspection
- explicit changed-file and untouched-file inventory

## 11. Locked-source verification

Record and recheck these current hashes before and after execution:

- `styles.css` `534cd653…`
- `surface.tsx` `51b51b31…`
- `action-pill.ts` `a5bc83a6…`; action-pill component `4c9fb916…`
- `control.tsx` `1c6efd5c…`
- `page-header.tsx` `5be9e6ea…`
- `kpi-card.tsx` `9279cd20…`; `plan-card.tsx` `057e7279…`
- `data-table.tsx` `63c1e60e…`; `empty-state.tsx` `6cfba448…`
- `field.tsx` `f35b2364…`; `notice-page.tsx` `81ee6c0f…`; `status-badge.tsx` `f4d812b3…`
- shadcn Card `d6c48ea3…`, Button `f7a5102d…`, Input `1d4cc52a…`, Dialog `ef4fe8e7…`, Sheet `0221fbf9…`
- all three shell hashes from Phase 38.

Every production hash must remain unchanged under the zero-migration result.

## 12. Rollback procedure

The planned production rollback is empty because no production file changes. If governance wording is incorrect, revert only the Phase 39 documentation block. If an unexpected production diff appears, stop, restore that file exactly, rerun hashes/typecheck/build, and do not claim completion. No rollback may touch Phases 29–38.

## 13. Governance updates

Only after execution evidence is complete, append Phase 39 to `.lovable/manual-work-map.md` with:

- verified canonical owners and their boundaries;
- the current quantitative inventory and A–K taxonomy summary;
- zero-migration outcome;
- rejected P39-E1/P39-S1/P39-P1/P39-B1/P39-S2 candidates and reasons;
- intentional literal exceptions and auth-gated NOT CAPTURED consumers;
- future admission rule requiring at least two independently measurable, semantically identical consumers with exact class/DOM/state/pseudo-element parity;
- validation, locked hashes, and rollback path.

Do not modify governance during this PLAN ONLY phase.

## 14. Preservation contract and expected changed-file scope

Guarantee no changes to layout, spacing, typography, color, radius, border, shadow, DOM, routes, navigation, interaction, accessibility, responsive behavior, content, branding, assets, shells, or business logic. Do not create universal Card, Border, Radius, Shadow, Layout, polymorphic, or generic wrapper abstractions.

Expected implementation diff after approval: `.lovable/manual-work-map.md` only. Expected production/reference changed-file count: **zero**. If the evidence changes that outcome, stop and submit a revised plan rather than expanding scope autonomously.
