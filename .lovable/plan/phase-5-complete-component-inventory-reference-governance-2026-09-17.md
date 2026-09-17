# Phase 5 — Complete component inventory + reference governance

Documentation and reference-layer work only. No production component, route, style, or behaviour changes. Every finding is recorded with the established labels rather than fixed.

## What this phase produces

A complete, evidence-based record of every reusable component in the application: where it is defined, who uses it, which variants/sizes/states actually exist, what is shared versus experience-specific, what overlaps, what is unused, and how it should map into a future Figma component library.

## Confirmed starting inventory

- ABox business components: 27 files under `src/components/abox/` plus the `decor/` primitive set
- shadcn/UI primitives: 49 files under `src/components/ui/`
- Icon components: 1 (`src/components/icons/tooth-icon.tsx`)
- Reference-only components: `src/components/design/reference-kit.tsx` (kept clearly separate from production)
- Existing reference modules: 13 under `src/lib/design/` — all extended additively, none replaced

Route-local reusable components (for example the M06/M08 screen kits and route-defined helpers) are inventoried separately and classified, not promoted.

## New reference modules (`src/lib/design/`)

- `components.ts` — master inventory: name, source file, taxonomy category, production vs reference, shared vs local, layer, consumers and approximate count, experience(s), primitive/component/composition/pattern classification, dependencies, child and parent components
- `component-variants.ts` — variant, size and prop inventory per component, including variants that exist but have no consumer
- `component-states.ts` — actual states per component, how each is expressed, and accessibility implications
- `component-relationships.ts` — recurring composition relationships and whether each is shared, experience-specific, or repeated-but-unowned

`types.ts` gains the matching entry types. `governance.ts` gains component governance rules, maturity, unowned areas, deferred opportunities, the Figma component mapping, and the future Figma library organization.

## Audit coverage

Taxonomy (15 categories from foundation primitive through reference-only), ownership, consumer map (direct / indirect / reference-only), shared vs experience-specific, anatomy, variants, sizes, states, responsive behaviour, composition-vs-component classification, duplication and overlap, installed-but-unused components and unused variants/states, accessibility, and cross-references back to Phase 2 spacing, Phase 3 typography and Phase 4 iconography findings.

Where the codebase cannot establish a reliable count, the entry says so instead of guessing.

## Reference pages

`/design-system` gains the technical component sections (taxonomy, inventories, ownership, consumer map, anatomy, variants, sizes, states, responsive, relationships, classification, duplication, unused, accessibility, three cross-references, maturity, Figma mapping, future Figma organization), built with the existing reference-kit table helpers plus any small additional helper the new data shapes require. Structured summary tables with representative records, not an unreadable dump.

`/design-guide` gains one management section, "Component governance": what belongs in the core system, what stays experience-specific, when a new component is warranted, avoiding duplicates, preserving existing component APIs, variant and state governance, accessibility and responsive expectations, relationship to tokens, iconography, Branding & White-Label and Marketplace Asset Management, Figma expectations, change propagation, and documentation requirements — with concise Web/Marketing, Shopping/Marketplace, Dashboard/Admin and Future Experiences notes.

Both routes stay unlisted and direct-URL-only; no navigation, header, sidebar, breadcrumb or in-page links are added.

## Documentation

`.lovable/design-system.md` gains a Phase 5 section and `roadmap.md` records Phase 5 completion plus carried-forward component opportunities, using the labels CURRENT IMPLEMENTATION, OBSERVED VARIATION, OBSERVED DUPLICATE, OBSERVED OVERLAP, INSTALLED BUT UNUSED, POSSIBLY UNUSED, UNOWNED AREA, GOVERNANCE RULE, FUTURE OPPORTUNITY, FUTURE FIGMA ORGANIZATION.

## File scope

Created or edited: `src/lib/design/*`, `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `.lovable/design-system.md`, `roadmap.md`.

Read as evidence, never modified: `src/components/ui/*`, `src/components/abox/*`, `src/components/icons/*`, `src/styles.css`, all production route files, Branding & White-Label, Marketplace Asset Management.

## Validation

Typecheck, lint, production build; both reference pages at desktop and mobile with no console errors and no navigation links; representative production routes at desktop and mobile unchanged; Branding and Marketplace Assets intact; a scope check confirming no file outside the allowed list was touched; earlier phase sections still rendering. Any failure is fixed in the reference layer only.
