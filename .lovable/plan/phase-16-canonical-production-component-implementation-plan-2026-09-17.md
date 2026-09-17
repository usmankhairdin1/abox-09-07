# Phase 16 — Canonical Production Component Implementation (Plan Only)

## Objective

Produce one written implementation plan for the first controlled canonical production component. No component is created, no consumer migrated, no production file touched. The running application stays exactly as it is.

## Only output

Create exactly one new file:

- `.lovable/phase-16-canonical-production-component-implementation-plan.md`

Nothing else is created or modified — no `src/components/**`, no `src/routes/**`, no `src/styles.css`, no `src/lib/**`, no imports, no tokens, no navigation.

## Re-measured production evidence (reference layer excluded)

Importing production files, measured now — `src/lib/design/**`, `src/components/design/**` and the two reference routes excluded:

- ABox: InternalShell 89, StatusBadge 87, ACTION_PILL 34 files / 99 references, MarketplaceShell 30, PageHeader 23, DataTable 19, KpiCard 16, EmptyState 8, MemberShell 4, PlanCard 4, ModuleTabs 2, MetalBadge 2, CarrierMark 1
- UI primitives: button 20, card 6, input 5, select 5, tooltip 4, dialog 3, sheet 3, dropdown-menu 3, label 3, skeleton 2, textarea 2, tabs 1, badge 1; table 0, pagination 0, alert 0, form 0

The document re-verifies these plus shells, surfaces, forms, tables, loading, icon plates and route-local kits from actual import evidence before any selection is argued.

## First implementation family

The document names **the action pill** as the proposed first canonical family and states the factual evidence: a single shared source already exists (`src/components/abox/action-pill.ts`), it exports frozen class strings that are byte-identical to what consumers render, it has 34 measured production consumers with a clear file boundary, it depends only on already-centralized foundations (primary/border/accent/card colors, radius-full, existing h-8/h-9/h-10/h-11 heights), and it carries no internal state, data flow or responsive branching — so a component wrapper can be proven pixel-identical.

Alternatives are documented factually, not ranked, and left as FUTURE DECISION: StatusBadge and KpiCard are already single-source components needing no new source; DataTable and PageHeader carry known structural variation; Button overlaps the pill treatments and depends on the unresolved 36px/40px control-height decision.

## Document structure

1. Scope, preservation contract, status vocabulary (READY FOR FUTURE MIGRATION, REQUIRES VISUAL BASELINE, REQUIRES BEHAVIOR BASELINE, REQUIRES API ADAPTER, EXPERIENCE-SPECIFIC, ROUTE-LOCAL, RUNTIME-OWNED, BLOCKED, DO NOT MIGRATE, FUTURE DECISION, MIGRATION PREREQUISITE)
2. Re-measured production inventory
3. First-family selection criteria and the evidence per candidate; no scores, no "best"
4. Implementation boundary for the proposed family: future source file, future export, current source, direct/indirect consumers, dependencies, variants, states, sizes, density, icon behavior, typography, spacing, color, border, radius, shadow, motion, responsive behavior, accessibility, content behavior, experience boundaries
5. Exact API preservation derived only from current code — the eight existing variant keys (primaryXs/Md/Lg, outlineXs/Sm/SmCard/Md/Lg), `className` passthrough, `asChild`/anchor-vs-Link usage observed at call sites, event handlers, children/slots, existing aria usage; any gap recorded as an adapter to be documented, not built
6. Source-level propagation: FOUNDATION → SEMANTIC ROLE → CANONICAL COMPONENT → VERIFIED CONSUMER → PATTERN → EXPERIENCE → SCREEN, with the rule that the canonical file becomes the genuine shared source after verified migration and the class map keeps a single owner
7. Legacy preservation: `action-pill.ts` remains exported and untouched; per-implementation source, consumers, migration candidacy, blockers, parity requirements, rollback, and post-migration status
8. Consumer-by-consumer migration register for all 34 measured files (route/file, current source, variant, size, density, visual behavior, interaction behavior, proposed mapping, compatibility concerns, baseline requirement, status)
9. Experience preservation across Web/Marketing, Shopping/Commerce, Dashboard/Admin, Member/Account, recording that the pill appears in several and is not forced to converge
10. Foundation safety — dependencies traced to `src/styles.css` and existing utilities; unresolved control-height and pill-vs-Button overlap marked MIGRATION PREREQUISITE, not solved here
11. Baseline requirements: desktop/tablet/mobile route screenshots plus default, hover, focus, focus-visible, active, disabled, selected, loading, error, success and open/closed states, each recorded with route, viewport, runtime conditions, variant, size, density and content state
12. Post-migration regression comparison list and the STOP / DO NOT ACCEPT / ROLL BACK rule; "visually close" is not acceptance
13. Reversible rollback procedure restoring imports, source, props, variants, styles, behavior and route output
14. One-family-at-a-time sequence: create source → verify API → baselines → isolated validation → one controlled consumer → regression → continue only after parity → next consumer → update records → evaluate retirement separately; never bulk replace
15. Validation plan: TypeScript, ESLint, build, route rendering, desktop/tablet/mobile, accessibility, keyboard, focus, interaction, console, screenshots, regression comparison, import graph, duplicate/unused detection
16. Branding & white-label and marketplace assets stay runtime-owned and out of scope
17. Route-local kit boundary (M06, M06 screen-common, M08, Lucie, Lucie-app, ai-elements, icon helpers) — classified, not migrated
18. Future dependency graph with allowed/forbidden dependencies, circular-dependency prevention, ownership boundaries and source-of-truth location
19. Change-impact examples for the proposed component, including what must not change
20. Future file map: path, purpose, exports, dependencies, current source evidence, consumers, creation condition, migration condition, retirement condition
21. Future Figma relationship: component name, set, variants, states, sizes, density, slots, semantic variables, experience extensions, accessibility notes; no assets created
22. Management approval gates and the open FUTURE DECISION / BLOCKED register

## Validation

- Confirm exactly one new file exists and no other file changed
- Confirm no production component, import, route, style or token changed
- Confirm the application still builds and the reference layer is untouched
- Final report per the requested 23 points, claiming planning only — no implementation
