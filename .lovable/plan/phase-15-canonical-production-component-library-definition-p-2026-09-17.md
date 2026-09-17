# Phase 15 — Canonical Production Component Library Definition (Plan Only)

## Objective

Produce one written, implementation-ready specification of the future canonical production component library. No production code is created, edited, renamed, or migrated. The running application stays exactly as it is.

## Only output

Create exactly one new file:

- `.lovable/phase-15-canonical-production-component-library-definition.md`

Nothing else is created or modified — no `src/components/ui/*`, no `src/components/abox/*`, no `src/routes/*`, no `src/styles.css`, no `src/lib/*`, no reference pages, no imports, no navigation.

## Evidence base (already re-measured)

Production-only counts (reference layer `src/lib/design/**` and `src/components/design/**` excluded):

- 49 UI primitives in `src/components/ui`
- 27 ABox modules plus `abox/decor`
- Referencing files: InternalShell 92, StatusBadge 91, ACTION_PILL 36, PageHeader 34, MarketplaceShell 32, DataTable 26, Button 21, KpiCard 19, EmptyState 12, PlanCard 7, MetalBadge 6, MemberShell 6, ModuleTabs 3

The document will re-verify and extend these with per-area counts for forms, inputs, selects, textareas, checkboxes, radios, switches, dialogs, sheets, popovers, menus, tabs, skeletons, breadcrumbs, pagination, icon plates, assistants, route-local kits, branding and marketplace asset components — all from actual import/reference evidence, never visual similarity.

## Document structure

The specification file will contain these sections, in this order:

1. Scope, preservation rules, and status vocabulary (CURRENT SHARED, CANONICAL CANDIDATE, FUTURE CANONICAL, EXPERIENCE-SPECIFIC, PATTERN, ROUTE-LOCAL, RUNTIME-OWNED, OBSERVED VARIATION, BLOCKED, FUTURE DECISION, DEFERRED — no numeric scores, no winners)
2. Re-measured production usage inventory
3. Canonical qualification criteria and disqualifiers
4. Canonical register across categories A–L (Actions, Forms, Display, Containers/Surfaces, Data, Navigation, Overlays, Feedback, Commerce, Brand, Shell, Compound), each entry carrying: canonical name, current source file(s), current consumers, responsibility, qualification evidence, current status, future source file, future export, API, variants, states, sizes, density, icon behavior, typography/spacing/color/shape dependencies, responsive behavior, accessibility contract, composition rules, experience boundaries, migration prerequisites, regression requirements, known incompatibilities, governance owner, status
5. Button / action architecture — `ui/button.tsx`, `ACTION_PILL`, inline, link-like, icon-only, CTA, destructive, commerce treatments documented separately; no merging
6. Page header / section header architecture — ABox PageHeader, compact variant, Lucie PageHead, Lucie-app PageHeader, inline and toolbar headings, marketing heroes; shared responsibility vs experience extension
7. Card / surface architecture — `ui/card`, inline surfaces, KpiCard, PlanCard, definition/blocker cards, marketing, shopping, cart/quote, admin and route-local surfaces with actual border/background/padding/radius/shadow/density differences
8. Form architecture — `ui/form.tsx`, react-hook-form/zod usage, hand-rolled forms, field wrappers, labels, descriptions, validation, errors, route-local M06/Lucie form systems; primitives vs compound patterns
9. Data / table architecture — DataTable, `ui/table`, Lucie tables, raw tables, table-like layouts, pagination, sorting, filtering, empty and overflow behavior, mobile behavior
10. Status / tone architecture — StatusBadge, Badge, Alert, semantic colors, sage/muted tones, MetalBadge tiers, commerce and admin states; generic status kept separate from metal tiers
11. Navigation / shell architecture — InternalShell, MarketplaceShell, MemberShell, `nav-config.ts`, WORKSPACES, MEMBER_NAV, module tabs, breadcrumbs, mobile nav; shells stay separate
12. Branding & white-label and marketplace asset boundary — runtime-owned, documented only, never absorbed into the design system
13. Route-local kit boundary — M06, M06 screen-common, M08, Lucie, Lucie-app, ai-elements, icon helpers: reusable vs intentionally local, extraction blockers
14. Compound component architecture — FormField, ResultToolbar, FilterRail, CardCollection, KPIGroup, TablePresentation, PlanComparison, CartSummary, PageOpening, NavigationGroup, DialogSections, Search/Filter/Results
15. Future canonical source-file map derived from actual ownership, with responsibility, evidence, exports, dependencies, consumers, prerequisites, and safe-to-create judgment per proposed file
16. Public API / export architecture (names, paths, props, variant/state/size/density models, slots, accessibility contract, legacy compatibility)
17. Propagation model: Foundation → Semantic Role → Canonical Component → Compound → Pattern → Experience Pattern → Verified Consumer → Screen, with allowed and forbidden dependency directions and genuine source-level reuse as the target
18. Consumer migration eligibility classification (READY FOR FUTURE MIGRATION, REQUIRES VISUAL BASELINE, REQUIRES BEHAVIOR BASELINE, REQUIRES API ADAPTER, EXPERIENCE-SPECIFIC, ROUTE-LOCAL, RUNTIME-OWNED, BLOCKED, DO NOT MIGRATE) with evidence per classification
19. Exact-preservation migration contract — pre/post baselines across desktop, tablet, mobile and interaction states; any unexplained difference means stop and roll back
20. Design foundation dependencies per canonical component, referencing current production sources and the Phase 13 plan; unsafe foundations listed as prerequisites, not changed
21. Experience boundaries — Web/Marketing, Shopping/Commerce, Dashboard/Admin, Member/Account
22. Accessibility contract per component, derived from current behavior only
23. Responsive / density contract, preserving existing 36px / 40px / 44px / 48px distinctions with no universal control height
24. Duplicate / overlap register (cards, buttons, headers, forms, tables, KPI, empty, loading, tones, shells, navigation, icon plates, assistants, kits) — side by side, unranked, unmerged
25. Legacy / unused inventory, verifying at minimum `planai-assistant.tsx`, `overflow-text.tsx`, `placeholder-screen.tsx`, `theme-toggle.tsx`, ToothIcon, `ui/table.tsx`, `ui/pagination.tsx`, unused decor — classified only, never deleted
26. Change-impact examples tracing source → direct consumers → compounds → patterns → experiences → screens for button, action pill, status badge, card, page header, form field, data table, typography, spacing, icon size, control height
27. Future implementation sequence (freeze → review → resolve decisions → create sources → one family at a time → parity → verified migration → regression → records → exceptions → retire only if approved; never bulk replacement)
28. Management decision register — only open questions, no guessed answers
29. Technical review checklist
30. Future Figma mapping per canonical component (names, sets, variant/state/size/density properties, slots, semantic variables, experience extensions), no assets created
31. Document relationships to `.lovable/manual-work-map.md`, `.lovable/design-system.md`, Phase 12/13/14 plans, `roadmap.md`, and `src/lib/design/*`, with every claim labeled CURRENT IMPLEMENTATION, OBSERVED VARIATION, FUTURE CANONICAL TARGET, FUTURE DECISION, or MIGRATION PREREQUISITE

## Validation

- Confirm exactly one new file exists and no other file changed (scope/diff check)
- Confirm no production component, import, route, style, or token changed
- Confirm the application still builds and the reference layer is untouched
- Final report per the requested 20 points, claiming specification only — no implementation
