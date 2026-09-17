# Phase 9 — ABox Core System Integration & Dependency Graph

Reference-layer only. No production file is created, edited, renamed, deleted or refactored. The running application stays pixel-, behavior-, route-, responsive-, branding- and asset-identical.

## What Phase 9 produces

Phases 1–8 described each layer separately: foundations, spacing, typography, icons, inventory, architecture, foundation specification, and canonical component specifications. Phase 9 does not repeat any of that. It connects them into one graph so a reader can start at a real screen and trace back through pattern, component, semantic role and foundation — and run the same trace in reverse to see what a change could touch.

Every edge in the graph carries a status from the existing controlled vocabulary, so a proposed relationship can never be read as current architecture.

## Files

All new modules live in `src/lib/design/`. Only these files are touched:

New modules
- `graph-types.ts` — node and edge types (see Technical section). Extends the existing Phase 1–8 types; nothing is redefined.
- `graph-foundation.ts` — foundation → semantic role edges across colour, typography, spacing, layout, radius, border, elevation, opacity, icon, motion, control sizing, density, status and tier. Links to the Phase 7 records rather than copying the token inventory.
- `graph-roles.ts` — semantic role → component role edges (primary/secondary/destructive action, input control, field label, supporting text, status indicator, tier indicator, card/data/navigation/overlay/feedback surfaces). Where production holds more than one meaning for one role, both are carried as OBSERVED OVERLAP.
- `graph-components.ts` — component role → actual implementation edges, pointing at the Phase 8 specifications and the real files, with Phase 5 consumer counts reused verbatim.
- `graph-compounds.ts` — component → compound edges only where Phase 8 evidence supports them (field, card, dialog, table, page header, filter bar with results, plan card). Anything unsupported is FUTURE DECISION.
- `graph-patterns.ts` — compound → pattern edges, split into CURRENT OBSERVED PATTERN and FUTURE CANONICAL PATTERN. Repeated markup alone does not qualify as a pattern.
- `graph-experiences.ts` — pattern → experience edges for Web/Marketing, Shopping/Commerce, Dashboard/Admin and Member/Account, recording shared patterns, legitimate extensions and intentional differences.
- `graph-screens.ts` — experience → screen edges plus traceability records for representative surfaces: landing, plans, cart, an agency/admin surface, Branding & White-Label, and Marketplace Asset Management. Each records experience, patterns, components, foundation dependencies, known variations and ownership boundary.
- `graph-consumers.ts` — the consumer graph, distinguishing direct, indirect, route-local and reference-only usage. Counts come from the Phase 5 measurements; nothing is estimated, and reference-page usage is never counted as production consumption.
- `graph-duplicates.ts` — folds the Phase 8 duplicate register into the graph: several implementations may map to one future conceptual role, with no ranking, scoring, winner or implied migration.
- `graph-kits.ts` — route-local kits (M06, M06 screen-common, M08, Lucie, Lucie-app, ai-elements) positioned as core → experience extension → kit, preserved as current implementations.
- `graph-shells.ts` — InternalShell, MarketplaceShell and MemberShell with their foundation, navigation and composition dependencies and experience ownership.
- `graph-brand-boundary.ts` — the ownership boundary and direction of dependency between the design-system foundation, runtime Branding & White-Label, and Marketplace Asset Management, stating plainly that runtime brand assets are not design-system tokens.
- `graph-accessibility.ts` — accessibility traced through the chain, separating current implementation, observed gap, future governance and future decision.
- `graph-responsive.ts` — where responsive behavior actually belongs at each layer, using the existing breakpoint evidence. No new breakpoint is introduced.
- `graph-typography.ts` and `graph-spacing.ts` — type role and spacing relationship traced to component, pattern and screen, referencing the Phase 2, 3 and 7 records instead of restating them.
- `graph-figma.ts` — the same chain expressed against the Figma blueprint: foundation → variable/style, component → component, variant/state → properties, pattern → composition, experience → library organisation, screen → future frames. Marked FUTURE FIGMA ORGANIZATION throughout.
- `graph-governance.ts` — how a change flows: foundation change → roles → components → patterns → experiences → screens, with review points and layer ownership.
- `graph-impact.ts` — the change-impact model answering "if this changes, what could be affected", derived from the edges rather than written by hand. Anything not safely determinable is FUTURE DECISION.
- `graph-migration.ts` — conceptual migration stages only. No stage is executed, no component is named as first, nothing is ranked.
- `graph-registry.ts` — the single assembly point: all nodes and edges in one registry, with derived counts and lookups. The reference pages read only from here.

Edited files
- `src/components/design/reference-kit.tsx` — reuse existing helpers first (`SpecMatrixTable`, `BlueprintTable`, `RoleChainTable`, `DuplicateRegisterTable`, `DefinitionRows`, `RuleList`, `ArchLayerList`). Add only what they genuinely cannot express: a `DependencyChainList` (one readable chain, screen to foundation and back), a `TraceabilityCard` (one representative screen with its layers), and an `ImpactTable` (a change and its reachable layers). Additive only; no existing helper's output changes.
- `src/routes/design-system.tsx` — new technical sections appended after Phase 8, consuming `graph-registry.ts`, with matching table-of-contents entries.
- `src/routes/design-guide.tsx` — management-facing sections in plain language.
- `.lovable/design-system.md` — a Phase 9 section stating explicitly that the phase is reference-only, production is unchanged, the graph is descriptive and future architecture, current implementation remains the source of truth, future relationships are not production relationships, migration is deferred, duplicates are untouched and Figma remains a blueprint.
- `roadmap.md` — Phase 9 recorded with open decisions carried forward.

Both reference routes stay unlisted, direct-URL only, and absent from navigation, sidebars, headers, menus, breadcrumbs and every application link.

## Design Guide additions

How the pieces fit together; why foundations matter; how components become patterns and patterns become experiences; how screens consume the system; what current versus future means; why several implementations of one idea are recorded rather than resolved; how a change spreads and who reviews it; who owns each layer; how a design file would relate to the code; and why any migration needs its own approval. Written for non-engineering readers.

## Technical section

Node and edge model in `graph-types.ts`:

```text
DependencyNode {
  id, layer: foundation | semantic-role | component-role | core-component
           | compound | pattern | experience-pattern | screen,
  name, source?, ownership, status: SpecLabel, evidence, note?
}

DependencyEdge {
  from, to,
  relation: defines | implements | composes | consumes | extends
          | renders | owns | overlaps-with,
  status: SpecLabel,        // CURRENT IMPLEMENTATION … FUTURE DECISION
  evidence,                 // file, measured count, or "not established"
  ownership,
  note?
}
```

Specialised records reuse these two shapes: `FoundationDependency`, `ComponentDependency`, `PatternDependency`, `ExperienceDependency`, `ScreenDependency`, `ConsumerReference`, `TraceabilityRecord`, `ImpactRecord`, `OwnershipRecord`, `StatusRecord`. `SpecLabel`, `Ownership` and the Phase 8 specification shapes are imported, not redefined.

Current and future never merge: an edge is one or the other, and a chain that mixes them renders with each link's own status visible, so a future link cannot be mistaken for shipping architecture.

`graph-registry.ts` is authoritative. The impact model and all derived counts are computed from the edges, not hand-written, so the graph cannot disagree with itself. Reference pages and documentation consume it; no large structure is restated inline in JSX or markdown.

Evidence discipline: an edge exists only where code shows it — an import, a measured consumer count, a token read. Visual similarity alone never creates an edge. Anything unestablished is recorded as FUTURE DECISION with the reason.

## Validation

- `bunx tsgo --noEmit` clean
- lint on the changed files, accepting only the known pre-existing fast-refresh warning
- production build passes
- `/design-system` and `/design-guide` verified on desktop and mobile, zero console errors
- all Phase 1–8 sections still render unchanged
- representative production routes verified unchanged: `/`, `/plans`, `/cart`, an agency/admin surface
- Branding & White-Label and Marketplace Asset Management unchanged
- no navigation, breadcrumb or application link points at either reference route
- final changed-file scope check against the allowed list

## Explicit confirmation

No production application file will be modified. The only files created or edited are those under `src/lib/design/`, `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `.lovable/design-system.md` and `roadmap.md`. No migration, consolidation, normalization, renaming, deletion, winner selection, dependency cleanup, production wrapper or Figma asset is produced in this phase.
