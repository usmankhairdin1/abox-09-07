# Phase 10 — Pattern & Experience Architecture Specification

Reference-layer only. The running application stays pixel-identical and behaviourally identical. Nothing in production is changed, consolidated, renamed, normalised or migrated.

## What this phase adds

Phases 1–9 recorded foundations, spacing, typography, assets, the component inventory, the architecture blueprint, foundation governance, the component specification and the full dependency graph. The graph already connects compounds to patterns to experiences to screens, but the pattern layer itself is thin: each pattern is one node with a one-line evidence string.

Phase 10 makes the two middle layers — PATTERN and EXPERIENCE PATTERN — explicit enough for a designer to rebuild them, without touching anything that ships.

## Files to create (all under `src/lib/design/`)

| File | Purpose |
| --- | --- |
| `pattern-spec-types.ts` | Additive types only: `PatternSpec`, `PatternAnatomyPart`, `PatternVariantRecord`, `PatternStateRecord`, `PatternResponsiveRecord`, `PatternDensityRecord`, `ExperiencePatternSpec`, `ScreenPatternTrace`, `PatternDuplicateRecord`, `PatternFigmaMapping`. Reuses `Ownership`, status strings and `DependencyNode`/`DependencyEdge` ids from Phase 8/9 types rather than redefining them. |
| `pattern-anatomy.ts` | Named parts of each pattern with required/optional flags and the component that fills each slot, taken from real route and component code. |
| `pattern-composition.ts` | Pattern → compound → component → semantic role → foundation, derived by referencing Phase 9 `PATTERN_EDGES`, `COMPOUND_EDGES` and `graph-registry` traversal helpers. No new edges invented from visual similarity. |
| `pattern-variants.ts` | Observed structural variations per pattern. No winner, no ranking, no frequency-implies-canonical. |
| `pattern-states.ts` | Pattern-level states, each labelled CURRENT IMPLEMENTATION, OBSERVED VARIATION or FUTURE DECISION. |
| `pattern-responsive.ts` | Real breakpoint behaviour read from actual classes: what stacks, what collapses, what reorders, what changes density, at which breakpoint. |
| `pattern-density.ts` | Control height, padding, gap, type size and icon size per density mode, preserving the recorded 36px/40px and card-padding differences. |
| `experience-patterns.ts` | Web/Marketing, Shopping/Commerce, Dashboard/Admin, Member/Account: purpose, source patterns, experience-specific composition, variations, responsive behaviour, screen consumers, ownership, status. Built on the existing Phase 9 experience nodes. |
| `experience-extensions.ts` | Where one core pattern behaves differently per experience — marketing vs dashboard headers, commerce vs admin results, member vs admin navigation, plan/product presentation. Recorded as extensions, not separate systems, unless code shows a real split. |
| `screen-pattern-map.ts` | Screen → experience pattern → pattern → compound → component → role → foundation for the established audit screens, assembled from Phase 9 `SCREEN_TRACEABILITY` and graph traversal, not rebuilt independently. |
| `pattern-duplicates.ts` | Pattern-level duplicates and overlaps: concepts, implementations, consumers, differences, ownership, resolved/unresolved. References Phase 9 `DUPLICATE_MAPPINGS`; adds only the pattern dimension. |
| `pattern-governance.ts` | When something is a component vs a pattern vs an experience pattern; evidence required before canonicalisation; ownership, naming, state/responsive/accessibility documentation duties; change-impact expectations; approval gate before any production migration. |
| `pattern-figma.ts` | Blueprint only: how each pattern would become a Figma component set, with variants, states, responsive and density variants, content model and properties. Nothing is created in Figma. |
| `pattern-registry.ts` | Single assembly point. Imports the Phase 10 modules, joins them to `spec-registry` (Phase 8) and `graph-registry` (Phase 9) by id, exposes lookups and a summary. No parallel graph, no duplicate screen or component inventory. |

## Pattern categories to audit

Audited against code; anything without composition, route or class evidence is recorded as `FUTURE DECISION — insufficient implementation evidence` rather than guessed.

Page headers and compact headers; section headers; toolbars and filter rails; search/filter/result layouts; card collections; KPI groups; table and data presentation; detail layouts; split layouts; form sections; action groups; empty, loading and error presentation; status and metal-tier presentation; plan comparison; shell navigation; dialog and drawer compositions; wizard/stepper; assistant surfaces; cart and quote summary; marketing hero.

## Evidence methodology

For each candidate: read the route and component files that produce it; count real usages with ripgrep; read the actual Tailwind classes for spacing, density and breakpoints; read the real state and ARIA handling; cross-check against the Phase 5 inventory and Phase 9 graph. Repeated markup alone does not make a pattern. Visual similarity alone is never evidence.

## Handling of duplicates, variations, responsive, states, density

Duplicates and overlaps are listed side by side with their consumers and differences. No winner is chosen, nothing is ranked, scored, merged, deleted or migrated. Genuine variations — card padding, 36px vs 40px controls, table densities, gap-1.5 vs gap-2, compare building its own markup — are preserved as OBSERVED VARIATION. Responsive behaviour is transcribed from existing classes; no breakpoint is added or normalised. Density modes are recorded as they are, including compact and standard differences.

## Branding and asset boundary

Branding & White-Label and Marketplace Asset Management stay runtime-owned, exactly as Phases 4–9 established. Phase 10 records only how patterns consume those runtime values; it takes no ownership of their configuration and changes no branding or asset behaviour.

## Reference pages

`/design-system` gains concise technical sections: pattern taxonomy, anatomy, composition, variants, states, responsive behaviour, density, experience patterns, screen-to-pattern traceability, duplicate/overlap register, governance and the future Figma pattern blueprint.

`/design-guide` gains management sections: what a pattern is; component vs pattern vs experience pattern; pattern ownership; how pattern changes propagate; how variations are handled; when normalisation needs explicit approval; how future Figma patterns would relate to production; why observed inconsistencies are not silently normalised.

Both pages stay unlisted and direct-URL-only. Existing display helpers are reused (`SpecMatrixTable`, `DefinitionRows`, `AnatomyList`, `VariantTable`, `ComponentStateTable`, `ResponsiveTable`, `DensityTable`, `DuplicateRegisterTable`, `TraceabilityCard`, `RuleList`, `ArchLabelChip`). At most two small additive helpers are added to `reference-kit.tsx`, and only if no existing helper fits.

## Documentation

`.lovable/design-system.md` gains a Phase 10 section, every statement labelled CURRENT IMPLEMENTATION, OBSERVED VARIATION, INSTALLED BUT UNUSED, UNOWNED, FUTURE OPPORTUNITY or FUTURE DECISION. `roadmap.md` gains the Phase 10 entry. No future pattern is described as existing; no Figma component is described as created.

## Files to modify

`src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `.lovable/design-system.md`, `roadmap.md`. Nothing else.

## Validation

1. `bunx tsgo --noEmit` clean.
2. Lint on changed files; only the known pre-existing fast-refresh warning accepted.
3. Production build succeeds.
4. `/design-system` and `/design-guide` render on desktop and mobile with no new console errors.
5. Regression check on `/`, `/plans`, `/cart`, `/agency/my-organization`, `/app/jet/branding`, `/marketplace/admin/assets`.
6. Scope check confirming no production file changed.
7. No navigation, header, sidebar or breadcrumb link to the reference pages.
8. Phase 1–9 reference sections still present and rendering.
9. Branding & White-Label intact.
10. Marketplace Asset Management intact.
11. No duplicate deleted, merged, renamed, normalised or migrated.
12. No Figma asset created.
13. Registry check: Phase 10 joins the Phase 8 registry and Phase 9 graph by id and does not re-declare components, screens or foundations.

## Explicit confirmation

No production route, component, style, token, asset, branding behaviour, business logic or navigation is touched in this phase. The reference modules are consumed only by `/design-system` and `/design-guide`.
