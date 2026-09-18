# Phase 49 — Final Production Design-System Gap Audit & Closure Plan

Audit only. No production code, UI, behaviour, routes, assets, branding, tokens, ESLint or enforcement changes. The only file that may change on implementation is `.lovable/manual-work-map.md` (Phase 49 block). Zero-change completion is a valid outcome.

## Purpose

Determine, with fresh evidence, what genuinely remains before the production-side ABox design-system architecture can be called complete — and distinguish real gaps from intentional exceptions. Neither outcome (more migration phases vs. documentation-only closure) is assumed.

## Scope

In: `src/routes/**`, `src/components/abox/**`, `src/components/ui/**`, `src/lib/**`, `src/styles.css`, the three shells, design-system-relevant production configuration.

Out: reference/design layers, Figma, Lucie, M06, M08, AI-elements, third-party internals, Marketplace Asset Management internals (ownership verification only), `.lovable/**` except governance documents used for reconciliation. Generated reports stay diagnostic, never source-of-truth.

## Audit passes

Each pass produces findings only; nothing is edited in production.

1. **Canonical completeness (A).** Re-verify each canonical family — ActionPill, StatusBadge, KpiCard, PageHeader, DataTable, EmptyState, Surface, controlClass, Field/LabeledField, marketplace page layout, NoticePage, motion helpers, logo — for single source, named owner, measured consumers, documented exceptions, and absence of a second canonical definition.
2. **Remaining fragmentation (B).** Fresh sweep of production UI families with more than one implementation. Each candidate classified as exact duplicate, exact semantic duplicate, intentional variant, business-coupled, shell-specific, experience-specific, route-local, library-owned, framework convention, intentional one-off, or requires-future-review, with files, sites, element type, class output, API, DOM, behaviour, responsive behaviour, accessibility semantics, coupling, existing owner, independent-consumer count, and whether exact parity is provable.
3. **Foundation ownership (C).** For colours, semantic roles, typography, spacing, layout widths, control sizing, icon sizing, radius, border, elevation, motion, interaction states, breakpoints, density: record canonical / partial / intentionally decentralised / library-owned / route-owned / genuine gap. Repetition alone is never a gap.
4. **Token drift (D).** Duplicate definitions, equivalent aliases, unused canonical tokens, production literals, local CSS variables, arbitrary Tailwind values, duplicated semantic values — recorded as evidence, never auto-replaced.
5. **API / ownership drift (E).** Duplicate sources, conflicting owners, equivalent consumer bypasses, wrapper duplication, unnecessary polymorphism, Slot/asChild misuse, undocumented API divergence. No API redesign.
6. **Boundaries (F).** Re-confirm no production import of reference/design layers, no reference import of runtime branding/marketplace ownership, E1–E4 and the server-only restriction still enforceable, no reverse leakage.
7. **Branding (G).** Runtime Brand record remains the runtime owner; static logo source remains distinct; Marketplace Asset Management remains separate; no production component has silently become a branding owner.
8. **Shells (H).** InternalShell, MarketplaceShell, MemberShell remain independent; only actual leakage or accidental duplication is reported. No merge.
9. **Tables (I).** DataTable remains the sole ABox table source; route-local tables remain justified exceptions; shadcn table/pagination remain unadopted and E2-protected; no undocumented second table system.
10. **Forms/controls (J)** and **Surface/card (K)** and **Navigation/page composition (L).** Ownership re-verified against the recorded exception register; Group B/C Surface variants, control variants, shell navigation and route-local navigation stay as documented; no universal abstraction implied.
11. **Governance completeness (M).** Reconcile `.lovable/manual-work-map.md`, the canonical-source matrix, the Phase 44 exception register, the Phase 47 report schema, the Phase 48 reconciliation model and E1–E7 state; flag stale, contradictory, duplicated or missing entries.

## Classification and migration bar (N)

Every discovered item receives exactly one disposition, unranked and unscored: COMPLETE/canonical, COMPLETE/intentional exception, COMPLETE/library-owned, COMPLETE/framework convention, DOCUMENTATION GAP, FUTURE MIGRATION CANDIDATE, FUTURE AUDIT REQUIRED, REVIEW-REQUIRED.

A FUTURE MIGRATION CANDIDATE may only be recorded when evidence shows all of: two or more independently measurable consumers, same semantic role, same element semantics, same relevant DOM structure, same or provably equivalent class output, same responsive behaviour, same accessibility behaviour, no business coupling, no shell-specific ownership, no framework/library ownership conflict. Otherwise no migration is proposed. Any candidate recorded here is not implemented in Phase 49 and requires its own separately approved plan-only phase.

## Production completion definition (O)

Phase 49 records an evidence-based checklist covering: canonical source ownership, production consumer coverage, documented exceptions, foundation ownership, branding/runtime ownership, shell boundaries, reference/runtime boundaries, governance enforcement, drift detection, exact-preservation verification, no unexplained duplicate canonical definitions, no unresolved ownership ambiguity. Completion is not claimed in the plan phase.

## Future work boundaries (P)

The Phase 49 block separates: work required before production-side completion, work optional or intentionally deferred, and Figma-specific work. Figma work is named only as out-of-scope future work — never as production migration.

## Validation

Baseline lint count; typecheck; production build; E1/E2/E3/E4 negative controls; server-only negative control; E5/E6/E7 report determinism (byte-identical reruns); hashes for canonical components, the three shells, `src/styles.css`, `src/lib/marketplace-store.ts`, `src/components/abox/logo.tsx`; `git diff --stat -- src/` empty; no runtime asset, branding or route changes; no generated report promoted to source-of-truth.

## Expected changes

Governance documentation only: one Phase 49 block appended to `.lovable/manual-work-map.md`. If the audit surfaces nothing that needs recording, zero change is the correct result.

## Rollback

Remove the Phase 49 block from `.lovable/manual-work-map.md`. No production rollback exists because no production file is touched.

## Success criteria

Every finding dispositioned with evidence; no migration performed; no canonical source created or altered; exception boundaries intact; importerFiles and usageSites kept as separate units; E7 exact-definition only; E5/E6/E7 still report-only; E1–E4 still enforced; unresolved items marked REVIEW-REQUIRED; production byte-identical.
