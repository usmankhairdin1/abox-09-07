# Phase 31 — Group B Elevated / Decorated Surface Centralization (PLAN ONLY)

## 1. Objective
Determine, with fresh evidence, whether production panels that combine the canonical ABox surface foundation with an elevated / decorated / sheen / bracket treatment can derive their shared base surface styling from the existing canonical source (`src/components/abox/surface.tsx`), while preserving every existing visual, DOM, behavioural, responsive and semantic distinction exactly. Flattening Group B into the Phase 30 plain variant is explicitly out of scope.

## 2. Scope Boundary
In scope: production panels already structurally based on `rounded-2xl` + `border` + `bg-card`, plus one or more of `shadow-[var(--shadow-card)]`, `shadow-[var(--shadow-elevated)]`, `card-brackets`, `edge-sheen`, hover elevation.
Out of scope: Group A (done in Phase 30), Group C interactive/selectable cards, component kits, shells, overlays, foundation/token work, branding runtime, marketplace asset runtime, the reference layer.

## 3. Group B Definition
A consumer is Group B when ALL hold:
- Its surface styling begins from the canonical base string (`rounded-2xl border border-border bg-card`, or a documented near-variant such as `border-hairline`).
- It additionally applies at least one intentional treatment: elevated shadow, decorative brackets, edge sheen, or a hover treatment on a panel that is itself non-interactive.
- The panel element itself is not a link, button, or otherwise interactive element.
- Its class ordering can be reproduced byte-for-byte from canonical definitions plus consumer-owned classes.
Anything failing one criterion is not Group B for this phase.

## 4. Fresh Inventory Method
At execution start, run a repository-wide read-only inventory over `src/**`, excluding `src/lib/design/**` and `src/components/design/**`. Do not reuse counts from earlier phases; the preliminary numbers below are indicative only and must be re-measured.
Search terms: `rounded-2xl`, `border-border`, `border-hairline`, `bg-card`, `shadow-[var(--shadow-card)]`, `shadow-[var(--shadow-elevated)]`, `shadow-lg`, `shadow-md`, `shadow-sm`, `card-brackets`, `edge-sheen`, `hover:shadow`.
Per candidate record: file, line, route/screen, exact class string, element type, padding, radius, border, background, shadow, decoration, hover treatment, responsive overrides, inline styles, interactive descendants, panel-itself-interactive flag, owning system, whether Surface/surfaceClass is already involved, eligibility classification, exclusion reason.
Indicative current signal (to be re-measured): `shadow-[var(--shadow-card)]` 14, `shadow-[var(--shadow-elevated)]` 2, `card-brackets` 9, `edge-sheen` 8, `border-hairline` 146, `shadow-lg` 8, `shadow-md` 7, `shadow-sm` 13; 18 lines combine `rounded-2xl` with shadow/decor across 11 files, several of which (`components/abox/kpi-card.tsx`, `plan-card.tsx`, `components/lucie/ui.tsx`, `components/m08/*`, `components/m06/*`) are pre-excluded systems. This suggests Group B density is low and may not justify any API change.

## 5. Candidate Surface Taxonomy
Classify every hit into exactly one bucket, with no ranking or scoring:
A. Plain Group A, already migrated in Phase 30.
B. Group B elevated/decorated candidate.
C. Group C interactive/selectable/card surface.
D. Intentional experience-specific surface.
E. Non-ABox system (Lucie, Lucie-app, M06, M08, shadcn).
F. Explicit exclusion.

## 6. Existing Canonical Source Assessment
`src/components/abox/surface.tsx` (hash `51b51b31bee3283794f6a05af03f2878`) is locked for planning. It already exposes `elevated` (`shadow-[var(--shadow-card)]`), `interactiveHover` (`transition-colors hover:bg-accent`) and `decor` (`card-brackets`) flags, emitted in the fixed order base → padding → elevated → interactiveHover → decor. The plan's first execution question is therefore: does each Group B candidate's existing class string match that emission order exactly? If yes, no source change is required at all — `surfaceClass({ elevated: true })` etc. suffices. Only if a genuinely repeated treatment (e.g. `edge-sheen`, `shadow-elevated`) appears across multiple eligible consumers may a narrowly scoped, additive, default-off option be proposed — and only after proving all Phase 29/30 consumers emit byte-identical output.

## 7. Proposed Canonical Architecture
Smallest possible change, in priority order:
1. Zero source change — eligible consumers call existing `surfaceClass()` options.
2. Additive, default-off boolean options on the existing `SurfaceClassOptions` only where the fresh inventory proves repetition across two or more eligible consumers and the emission order reproduces existing strings exactly.
3. No new component. No universal card component. No absorption of unrelated card behaviour.
If a treatment appears exactly once, it stays literal and is documented as a singleton, not canonicalized.

## 8. API / Helper Design
Any extension must: keep `Surface` a native `div` with no `as`/Slot/`asChild`/element substitution; keep all existing option names, defaults and emission order untouched; add options default-off so every Phase 29/30 call site is unchanged byte-for-byte; be built from the same internal class constants so `Surface` and `surfaceClass()` stay in lockstep. Link/button consumers use `surfaceClass()` only, never a wrapper.

## 9. DOM Preservation Strategy
Prefer `className={surfaceClass(...)}` on the existing native element. A consumer is ineligible for wrapper migration if it would change element type, wrapper count or position, selector relationships, CSS inheritance, stacking context, containing block, layout participation, focus behaviour, event propagation or the accessibility tree. `section`/`article`/`aside` panels use the class helper, never the `Surface` component.

## 10. Class Preservation Strategy
The rendered `class` attribute must be byte-identical. Consumers with extra classes use `cn(extraClasses, surfaceClass(...))` with extras first when the original string ordered them first. If the canonical emission order cannot reproduce the literal string, the consumer stays literal and is logged as an exception; the canonical source is never reordered to accommodate one consumer.

## 11. Computed Style Verification
Per migrated consumer, capture before/after computed padding, margin, border width/style/colour, radius, background, box-shadow, opacity, overflow, transition, alignment, min-height and text typography. Computed-style equality alone is never sufficient — a class-string difference is a blocker.

## 12. Geometry Verification
Capture the panel bounding rectangle and direct-child rectangles before and after, plus decorative pseudo-element geometry where brackets/sheen are present.

## 13. Responsive Verification
Every batch independently verified at 1440, 834 and 390 px. No inference of mobile/tablet behaviour from desktop. Record `scrollWidth` vs `clientWidth`; zero new horizontal overflow.

## 14. Shadow / Decoration Verification
Explicitly compare rendered `box-shadow`, and for `card-brackets` / `edge-sheen` compare pseudo-element presence, computed content, position, size, colour and opacity before and after.

## 15. Hover Verification
For panels carrying a hover treatment while remaining non-interactive: capture computed styles in rest and hover state before and after, and confirm the transition property is unchanged.

## 16. Accessibility Verification
No role, ARIA attribute or `tabIndex` added or removed. Panel remains non-focusable. All focusable descendants, tab order and keyboard behaviour unchanged. Accessibility tree unchanged.

## 17. Interaction Verification
No handler, link, route, form or navigation change. No interactive card converted. Event propagation unchanged.

## 18. Known Exception Re-audit
Re-audit, do not auto-migrate: coverage, journey-choice, quote, app/employer/ichra, app/agency, ai-review, agent-unavailable, marketplace releases review, the one dynamic panel in organization detail, the shared quote-edit panel. Each is re-classified against the Section 3 definition; any that remains experience-specific or non-reproducible stays literal with a written reason.

## 19. Explicit Exclusions
Excluded unless exact evidence proves otherwise: KpiCard, PlanCard, EmptyState internals, DataTable internals, StatusBadge, ActionPill, PageHeader, Lucie, Lucie-app, M06, M08, InternalShell, MarketplaceShell, MemberShell, ModuleTabs, dialogs, drawers, sheets, popovers, menus, overlays, modals, interactive/selectable cards, cards with bespoke state machines, cards whose styling is inseparable from business logic, experience-specific compositions, components whose DOM cannot remain identical, surfaces with unsupported responsive overrides, surfaces whose class ordering cannot be reproduced byte-for-byte, surfaces whose shadow/decor output cannot be represented without change.

## 20. Migration Eligibility Rules
Eligible only when: Group B per Section 3; class string reproducible byte-for-byte; element type and DOM unchanged; no responsive surface override the API cannot express; not in Sections 18/19 exclusions; the panel itself non-interactive; no inline style contributing surface treatment. Uncertainty means ineligible.

## 21. Batch Strategy
Batch count is determined by the fresh inventory, not fixed in advance. Batch 1 is a single-consumer proof of the most common Group B pattern, fully measured. Later batches group by route/file family, each with explicit consumer list, eligibility rationale, expected file changes, rollback procedure, verification gate and source-integrity check. Batches are not collapsed into one pass; if density is so low that all eligible consumers fit one small batch, that is stated with the consumer list rather than assumed.

## 22. Consumer-by-Consumer Migration Map
Produced at execution start from the fresh inventory — deliberately not pre-populated here, since pre-committing a map would be an implementation decision unsupported by current evidence. The map records per consumer: file:line, route, current class string, proposed call, eligibility verdict, batch assignment, and exception reason where applicable.

## 23. Rollback Strategy
Each consumer reverts independently by restoring its original literal class string. Each batch is independently reversible. If the source was extended, reverting the extension must leave all Phase 29/30 consumers byte-identical. A failed or uncertain consumer is reverted immediately, classified as an exception, and does not block the rest of its batch.

## 24. Branding Boundary
Branding & White-Label state, stores, routes and assets remain runtime-owned and untouched; no relocation or duplication into the design/reference layer.

## 25. Marketplace Asset Boundary
Marketplace asset state, stores, upload flows, records and ownership remain runtime-owned and untouched. Eligible marketplace admin panels may change only their surface class source.

## 26. Reference-System Boundary
`src/lib/design/**`, `src/components/design/**`, `/design-system` and `/design-guide` stay reference-only, untouched and excluded from the inventory.

## 27. Foundation Boundary
No token added, renamed or altered; no change to spacing, typography, control sizing, icon sizing, radius usage, shadow vocabulary, token naming or density. Foundation gaps found during the audit are recorded as separate future opportunities only.

## 28. Governance / Future Usage Rules
Canonical ownership: `src/components/abox/surface.tsx` owns the shared ABox base surface plus its explicitly enabled treatments. Consumers own layout, content, typography, positioning, state and experience-specific decoration. New duplicate implementations of the base surface string are prohibited; new Group B surfaces are classified against Section 3 before being written. Exceptions are recorded in `.lovable/manual-work-map.md` with file, reason and date. Exact-preservation evidence is recorded per batch in the final report.

## 29. Validation Commands
Per batch: `npx tsgo --noEmit`; production build; ESLint on touched files only. Pre-existing findings recorded separately and left unfixed; any new error blocks that batch.

## 30. Evidence Capture Requirements
Per batch: git status before/after, changed-file list, relevant source hashes, before/after class strings, DOM snapshots, computed styles, bounding rectangles, hover-state captures, shadow/decor captures, 1440/834/390 captures, overflow measurements, console output. Anything not captured is reported as NOT CAPTURED — never inferred, never manufactured.

## 31. Risk Register
- Class-order mismatch between literal strings and canonical emission order — mitigated by byte-identical gating and leaving consumers literal.
- Low Group B density making centralization unjustified — mitigated by allowing "no migration" as a valid outcome.
- Pseudo-element decoration (`card-brackets`, `edge-sheen`) behaving differently under different stacking contexts — mitigated by explicit decoration geometry capture.
- `border-hairline` being a separate foundation vocabulary rather than a Surface variant — mitigated by classifying it in the inventory before any API decision.
- Scope creep into Group C or foundation work — mitigated by Sections 19 and 27.

## 32. Deferred Opportunities
Phase 27 EmptyState third-consumer proof and remaining EmptyState consumers; Group C interactive cards (Phase 32); possible unification of metric cards (KpiCard / Stat / StatCard); `border-hairline` vs `border-border` vocabulary reconciliation; backfilling measured parity evidence for Phase 30 batches 2–7; the project's pre-existing prettier backlog.

## 33. Expected Changed Files
Expected: a small set of route/panel files re-pointed to `surfaceClass()`, plus possibly `src/components/abox/surface.tsx` only if Section 6/7 proves an additive option is justified. Not expected to change: tokens, config, branding, marketplace, reference layer, shells, kits, `routeTree.gen.ts`.

## 34. Success Criteria
Every migrated consumer is byte-identical in class string and DOM, with measured parity at 1440/834/390; no new console, type, build or lint error; exceptions documented rather than forced; canonical source either unchanged or changed in a proven backward-compatible additive way; zero branding, marketplace, reference or foundation impact. Migrating nothing, with a documented rationale, is an acceptable successful outcome.

## 35. Final Report Requirements
The implementation report must distinguish, without conflation: migrated consumers; intentionally literal consumers; excluded consumers; measured parity (with the actual measurements); evidence NOT CAPTURED; actual canonical-source changes; actual consumer changes; regressions if any; and unresolved decisions. It must follow the section order of this plan and must not claim per-consumer measurement that was not performed.

## 36. Authorization Boundary
PLAN ONLY. No production file created, modified or deleted. No migration started. No change to `src/components/abox/surface.tsx`. Implementation begins only after separate approval of this plan.
