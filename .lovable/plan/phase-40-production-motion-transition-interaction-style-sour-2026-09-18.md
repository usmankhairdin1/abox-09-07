# Phase 40 — Production Motion, Transition & Interaction-Style Source-of-Truth Audit Plan

## 1. Current-state audit methodology

Audit the post-Phase-39 tree across `src/routes/**`, `src/components/abox/**`, production utilities, `src/styles.css`, and relevant shadcn sources. Exclude the design/reference layers, Branding & White-Label runtime, Marketplace Asset Management runtime, Lucie/Lucie-app, M06, M08, AI-elements unless an ABox source is involved, and intentional shell-specific behavior from centralization.

For every occurrence, record the complete class/style expression, element, semantic role, owner, route/state, responsive behavior, transition property/duration/easing, transforms, animation details, start/end values, state triggers, event and keyboard behavior, accessibility, reduced-motion path, business coupling, and current measurability. Classify A–M. Repetition is discovery evidence only; isolated `transition-*`, `duration-*`, or `hover:*` matches do not establish equivalence.

## 2. Fresh inventory

The current eligible scan found 110 production files containing a motion or interaction-state marker. Token-level inventory found:

- transitions: 77 occurrences / 6 spellings — `transition-colors` 35, `transition-all` 18, `transition-transform` 16, generic/JS `transition` 5, `transition-opacity` 2, `transition-[width]` 1;
- durations: 12 explicit Tailwind occurrences — `duration-300` 9 and `duration-200` 3; no `duration-75/100/150/500` in the audited ABox/routes scope;
- easing: no Tailwind `ease-*` utilities in eligible route/ABox class strings; easing is expressed in CSS declarations and the ABox motion primitive;
- transforms under interaction: 31 occurrences / 11 spellings, led by `hover:-translate-y-0.5` 8, `hover:scale-[1.03]` 6, `group-hover:translate-x-1` 3, `group-hover:-rotate-6` 3, and `group-hover:scale-105` 3;
- ABox/Tailwind animation use: 8 occurrences / 7 names — `animate-drift` twice; `animate-pulse`, `animate-hairline`, `animate-pulse-ring`, `animate-fade-rise`, `animate-orbit`, and `animate-orbit-slow` once each in the eligible scan;
- state-marker lexical counts: hover 264, focus 108, focus-visible 15, active 2, disabled 66, group-hover 24, data-state 1, and no peer or aria-selector class occurrences in the audited ABox/routes/CSS scope;
- no ABox route/page View Transition API, `AnimatePresence`, layout animation, or motion custom property was found;
- no eligible inline transition or animation style was found; the only eligible inline transform-related style is transform-origin metadata in ABox decor. Static positioning transforms are inventoried separately from animated state changes.

`src/styles.css` defines six `abox-*` keyframes and seven animation utility classes. `tw-animate-css` is imported once and supplies shadcn state animation utilities.

## 3. Current canonical ownership

Preserve these verified owners:

- `src/styles.css`: the global reduced-motion override; `ember-underline` (320ms custom easing); `card-brackets` (320ms opacity/transform/inset); `edge-sheen` (700ms transform); six `abox-*` keyframes; and `animate-fade-rise`, `animate-hairline`, `animate-orbit`, `animate-orbit-slow`, `animate-drift`, `animate-pulse-ring`, and `animate-shimmer`.
- `src/components/abox/motion.tsx`: `FadeRise` (420ms, 10px rise, custom easing), `Stagger` (50ms default child interval), `StaggerItem`, and `CountUp` (900ms default cubic-out approximation), with explicit `useReducedMotion()` behavior.
- `ActionPill`: the established hover states embedded in each pill variant; it does not own generic motion.
- `Surface`: only `transition-colors hover:bg-accent` when `interactiveHover` is enabled.
- `controlClass`: only its existing focus-ring behavior; it owns no transition duration.
- PageHeader, KpiCard, PlanCard, DataTable, EmptyState, Field, NoticePage, StatusBadge, ThemeToggle, ProductSwitcher, and ShoppingPathBar: component-intrinsic behavior.
- shadcn primitives: their existing transition/focus/state classes; Radix supplies lifecycle/ARIA state behavior and `tw-animate-css` supplies `animate-in/out`, fade, zoom, and slide utilities.
- internal, marketplace, and member shells: independent shell-specific width, opacity, scale, navigation, and active-state behavior.

## 4. Exact candidate inventory

### P40-C1 — quote wizard primary advance actions

Exact class expression at `src/routes/quote.tsx:466` and `:475`:

`inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-11`

The consumers are the final-step `<a>` and intermediate-step `<button>` within the same conditional footer slot. They share visual treatment and forward-navigation intent, but differ in element type, handler/navigation semantics, and cannot coexist in one state. A class constant would merely deduplicate one route-local string and would not create cross-consumer semantic ownership. **Reject as G/K; leave literal.**

### P40-C2 — shopping-mode selector options

Exact base expression at `shopping-path-bar.tsx:63` and `:76`:

`inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors`

Both links are already intrinsically owned by one `ShoppingPathBar` component, with selected/unselected behavior composed locally. Extracting a second source would not connect independent owners. **Reject as D.**

### P40-C3 — PlanCard secondary actions

Exact base expression at `plan-card.tsx:201` and `:214` for Save and Compare. Both are already intrinsic to PlanCard and include different pressed-state color additions. **Reject as D; no competing action source.**

### P40-C4 — select-route arrow cues

Exact icon expression at `select.tsx:62` and `:86`:

`h-4 w-4 transition-transform group-hover:translate-x-0.5`

The SVG behavior is identical, but one cue belongs to a navigation button and one to a link card, both within one route-local choice composition. A shared motion source would be an abstraction only for two local icon strings and would conflate parent interaction contexts. **Reject as G/K.**

### P40-C5 — root recovery actions

The primary class string is exact at `__root.tsx:29` and `:61`, but one is the measurable not-found Link and one is an error-boundary retry button whose legitimate error state is not independently measurable without manufacturing failure. Element, event, and navigation semantics differ. **Reject as G/J/K.**

### P40-C6 — card lift/icon transform family

Landing path cards, KpiCard, both PlanCard modes, ProductSwitcher chips, selection cards, and signed-in dashboard cards repeat fragments such as `transition-all duration-300`, `hover:-translate-y-0.5`, `group-hover:-rotate-6`, and `group-hover:scale-105`. Full expressions, roles, elements, translate distance, border/color changes, pseudo-elements, padding, responsive states, and ownership differ. KpiCard and PlanCard already own their behavior. **Reject as D/F/H/J/K.**

### P40-C7 — disclosure chevrons

FAQ and compare use `transition-transform` plus conditional `rotate-180`, but their complete icon expressions, parent controls, content lifecycle, and disclosure layouts differ; compare's populated state also requires supported application data. **Reject as G/K; no disclosure abstraction.**

### P40-C8 — loading animations

The only eligible route `animate-pulse` occurrence is an auth-gated agent-profile placeholder. Other superficially matching skeletons are in excluded M06/M08 systems. `animate-shimmer` currently has no eligible production consumer. **Reject as J/M; no skeleton source.**

## 5. Candidate acceptance/rejection decision

**No candidate survives all gates.** Exact duplicate strings are either component-intrinsic, route-local, semantically different, different native elements/handlers, not independently measurable, or already owned. Cross-file families match only fragments and differ in full transition behavior. Broad duration/easing/action-hover abstractions would normalize unlike behavior and are prohibited.

The implementation outcome should therefore be zero production migrations. If the execution-time inventory reveals a newly added qualifying pair, stop and return a revised plan rather than expanding scope.

## 6. Proposed canonical sources

**None.** Do not add motion tokens, class constants, helpers, component variants, CSS utilities, or wrappers. Do not extend ActionPill or Surface for near-matches. Existing CSS, ABox motion primitives, intrinsic components, shells, shadcn, Radix, and `tw-animate-css` remain the complete ownership map.

## 7. Exact consumer list

**No migration consumers.** All P40-C1 through P40-C8 consumers remain unchanged. This includes the exact local duplicate pairs in quote, ShoppingPathBar, PlanCard, select, and root boundaries.

## 8. Batch-by-batch implementation sequence

### Batch 0 — baseline and classification

- Regenerate the production inventory and A–M classification from the approved tree.
- Capture current hashes for every locked source.
- Confirm reachability only through legitimate UI/storage flows.
- Add no canonical source and change no consumer.

### Batch 1 — zero-change gate

- Confirm no candidate survives exact role/context/state/reduced-motion/measurability requirements.
- Verify no production or reference diff and no duplicate source was introduced.

### Batch 2 — governance only

- After validation, append the Phase 40 ownership, inventory, rejected candidates, NOT CAPTURED cases, reduced-motion findings, third-party boundaries, hashes, and rollback statement to `.lovable/manual-work-map.md`.

There are no consumer migration batches. Any future migration requires a revised plan beginning with additive-source-only Batch 0 and one measurable proof consumer in Batch 1.

## 9. Motion/state parity evidence gates

For the approved zero-migration result, prove that all production hashes and runtime output remain unchanged. A future authorized migration must capture before/after at 1440, 834, and 390 and verify:

- exact DOM, element, attributes, class string, computed transition property/duration/delay/easing, transform, opacity, affected color/background/border/shadow, geometry, layout, overflow, and scroll dimensions;
- rest, hover, focus-visible, active, selected, pressed, disabled, group/data state, keyboard focus/activation, ARIA, route, handler outcome, and business state;
- transition start/end values, intermediate samples against elapsed time, property scope, duration, delay, easing, transform/opacity trajectory, and interaction responsiveness;
- animation name, keyframes, duration, delay, timing function, iteration count, direction, fill mode, start/end state, and reduced-motion result;
- console, runtime, and network output.

Screenshots alone do not pass. Separate entrance-animation capture timing from stable computed geometry.

## 10. Reduced-motion audit

Two explicit systems exist and remain unchanged:

1. `src/styles.css:268–274` globally forces animation and transition durations to `0.01ms` and animation iteration count to one under `prefers-reduced-motion: reduce`.
2. `motion.tsx` calls `useReducedMotion()` in FadeRise, Stagger, and CountUp, returning static markup/final values and bypassing motion-driven animation.

There are no `motion-safe:*` or `motion-reduce:*` class consumers in the eligible scope. shadcn/Radix state animations receive the global CSS duration override. CSS keyframe consumers likewise receive it. This is L/M ownership, not a centralization candidate. Execution validation will compare normal and reduced-motion computed results without changing either mechanism.

## 11. Auth-gated exclusions

With the current environment signed out, `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, and `/member/*` interactions that cannot be reached legitimately are **NOT CAPTURED**. This includes dashboard/card lifts, agent-profile pulse loading, admin controls, downline flows, member navigation, and internal-shell content states. Inspect source only; do not infer runtime parity, mint/fabricate unsupported state, or migrate them.

## 12. Intentional exceptions

Leave unchanged:

- ActionPill variants whose hover behavior is intentionally encoded without a generic transition source;
- Surface `interactiveHover` and all component-intrinsic KpiCard, PlanCard, DataTable, PageHeader, ThemeToggle, ProductSwitcher, ShoppingPathBar, assistant, and decor motion;
- `FadeRise`'s 420ms runtime animation versus CSS `animate-fade-rise`'s 500ms animation — same general motif, different implementation/timing/ownership;
- card lift amounts (`-0.5` versus `-1`), scale amounts (`1.02`, `1.03`, `1.04`, `1.05`), arrow travel (`0.5` versus `1`), and differing property scopes;
- route-local disclosure, selection, opacity, disabled, focus, loading, drawer, and business-state behavior;
- shell width/tooltip/nav transitions;
- shadcn/Radix/tw-animate lifecycle motion and all excluded experience systems.

## 13. Validation commands

After approved execution:

- `npx tsgo --noEmit`
- normal harness production build and latest `/tmp/observability/build-errors.log`
- targeted ESLint only if an unexpected production file changes
- full lint compared with the pre-existing formatting baseline, without unrelated repairs
- `git diff --check`
- focused `git diff` and `git status --short`
- fresh `rg`/script inventory for transitions, durations, easing, transforms, animation, states, inline styles, keyframes, and reduced motion
- Playwright checks only where needed to support classification; normal and reduced-motion contexts; 1440/834/390
- console/runtime/network inspection
- exact changed-file and untouched-production inventory.

## 14. Locked-source verification

Capture and compare current SHA-256 hashes before and after execution. Current post-Phase-39 values include:

- styles `c88dbdab…`; motion primitive must be freshly captured in Batch 0;
- ActionPill source `63837c0d…`; component `e4c55a00…`;
- Surface `bcf6247e…`; control `921f7f3c…`; PageHeader `a9ecdacc…`;
- KpiCard `c4ae4e7c…`; PlanCard `aa496285…`; DataTable `dacf8c29…`;
- EmptyState `ab024eba…`; Field `0a5e63e8…`; NoticePage `2039a29d…`; StatusBadge `0ee08a42…`;
- internal shell `287a3715…`; marketplace shell `126ceb89…`; member shell `24e0660c…`;
- shadcn Button `674547d4…`, Input `92debb7d…`, Dialog `e3a6de15…`, Sheet `a82f9341…`, DropdownMenu `c6eb5ff2…`, Tooltip `9682690f…`.

Add hashes for every other shadcn primitive implicated by the final inventory. Every production hash must remain unchanged under zero migration.

## 15. Rollback procedure

Production rollback is empty because no production change is planned. If governance wording is wrong, remove only the Phase 40 documentation block. If any unexpected production diff appears, stop, restore that file exactly, rerun hashes/typecheck/build and relevant browser checks, and do not claim completion. Do not affect Phases 29–39.

## 16. Governance updates

Only after implementation evidence is complete, append to `.lovable/manual-work-map.md`:

- fresh quantitative inventory and A–M ownership taxonomy;
- zero-migration decision and P40-C1 through P40-C8 rejections;
- existing CSS/ABox/shadcn/Radix/tw-animate owners;
- intentional exceptions and auth-gated NOT CAPTURED items;
- explicit normal/reduced-motion findings;
- validation evidence, locked hashes, rollback path, and future admission rule requiring at least two independently measurable exact consumers.

Do not modify governance during this PLAN ONLY phase.

## 17. Preservation contract

No change to visuals, timing, easing, transition-property scope, transforms, hover/focus/active/pressed/selected/disabled behavior, animations, reduced-motion handling, layout, DOM, handlers, navigation, routes, accessibility, responsiveness, content, branding, assets, business logic, or shell independence. No universal Interaction, Motion, Hover, Transition, Animation, or polymorphic wrapper abstraction.

## 18. Expected changed-file scope

Expected approved implementation diff: `.lovable/manual-work-map.md` only. Expected changed production/reference files: **zero**. No package or generated-file changes. If evidence changes this outcome, execution stops for a revised plan.
