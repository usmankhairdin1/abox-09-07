# Phase 6 — Design System Architecture & Normalization Blueprint

Documentation and reference layer only. The running application is not touched:
no production component, route, style, token, asset, branding or behaviour changes.
Phases 1–5 answered "what exists". Phase 6 answers "what the future canonical
system should target", with every statement traced back to Phase 1–5 evidence or
a direct read of production code.

## Scope

Only these files are created or edited:

- `src/lib/design/*` (new architecture modules)
- `src/components/design/reference-kit.tsx` (new reference-only display helpers)
- `src/routes/design-system.tsx` (technical sections)
- `src/routes/design-guide.tsx` (management sections)
- `.lovable/design-system.md`
- `roadmap.md`

Nothing else is created, edited, renamed or deleted. New data is consumed only by
the two unlisted reference routes, never by an application screen.

## Evidence first

Before writing architecture, re-read the Phase 1–5 artifacts already in
`src/lib/design/` plus the production evidence they describe: `src/styles.css`,
`src/components/ui/*`, `src/components/abox/*` and `decor/*`, the three shells,
the six route-local kits (M06, M06 screen common, M08, Lucie, Lucie-app,
ai-elements), branding and marketplace-asset routes, and `src/lib/nav-config.ts`.
Where production can be inspected directly, it is inspected rather than inferred.

## New reference modules

| Module | Contents |
| --- | --- |
| `architecture.ts` | ABOX CORE layer model: Foundations, Components, Patterns, Experience Guidance; the 7-level hierarchy Foundation → Primitive → Component → Compound → Pattern → Experience Pattern → Screen, with allowed dependency direction |
| `canonical-components.ts` | Future canonical component map — one record per candidate with canonical future name, current source and name, taxonomy, core-vs-experience, component-vs-pattern, consumers, variants, sizes, states, anatomy, responsive, dependencies, relationships, duplication notes, accessibility, type/spacing/icon/token dependencies, normalization status, migration notes, Figma mapping |
| `classification.ts` | Component-vs-pattern decision framework: observable criteria, and the existing implementation classified against them |
| `blueprints.ts` | Anatomy, variant, state, accessibility, responsive and density blueprints, each row split into CURRENT IMPLEMENTATION versus FUTURE CANONICAL TARGET |
| `architecture-relationships.ts` | Machine-readable relationship map (contains / composes / uses primitive / consumes / depends on token, icon, asset / duplicate / overlap / route-local) plus the TOKEN → … → SCREEN dependency model |
| `normalization.ts` | Duplicate and overlap normalization map, route-local kit architecture, shell architecture, and the Phase A–G migration roadmap |
| `brand-asset-architecture.ts` | Core brand foundations versus runtime brand configuration; asset ownership boundaries across design-system, production, marketplace runtime, branding, icons and decorative graphics |
| `naming.ts` | Naming conventions for tokens, components, variants, sizes, states, patterns, icons, assets and Figma variables/components/properties |
| `figma-library.ts` | Future Figma library blueprint (00 Foundations → 05 Documentation) and explicit token/style/variable mappings, including documented limitations where one-to-one mapping is not appropriate |

`types.ts` and `governance.ts` are extended additively with the new record types,
Phase 6 governance rules and the change-propagation model. Existing exports keep
their shapes so Phase 1–5 sections render unchanged.

## Non-negotiable authoring rules

- Every row is labelled: CURRENT IMPLEMENTATION, OBSERVED VARIATION, OBSERVED
  DUPLICATE, OBSERVED OVERLAP, INSTALLED BUT UNUSED, POSSIBLY UNUSED, UNOWNED
  AREA, GOVERNANCE RULE, FUTURE CANONICAL TARGET, FUTURE OPPORTUNITY, FUTURE
  FIGMA ORGANIZATION, FUTURE MIGRATION.
- A future canonical target is never written as if it already exists.
- No winner is chosen among duplicates; no component is ranked or scored.
- Anatomy with insufficient production evidence is marked FUTURE DECISION rather
  than invented.
- One core system only. Experience guidance is usage guidance, never a second
  component set.
- Each architecture section carries a cross-phase pointer: Phase 1 foundations,
  Phase 2 spacing/layout/responsive, Phase 3 typography, Phase 4
  iconography/assets, Phase 5 components/variants/states/relationships.

## Reference page updates

`/design-system` gains technical sections for architecture, hierarchy, canonical
component map, classification framework, anatomy, variant, state, accessibility,
responsive and density blueprints, relationships, duplicate/overlap map,
route-local kits, shell architecture, brand and asset architecture, the
token→pattern dependency model, naming, Figma library blueprint, Figma variable
mapping, experience architecture and migration roadmap — rendered with concise
tables built from new reference-only helpers. No runtime editor, no fake Figma
components.

`/design-guide` gains a management-facing architecture and governance section:
what ABox Core is, what belongs in Core versus experience guidance, when to make
a component versus a pattern, variant/state governance, accessibility and
responsive governance, branding and asset governance, the duplicate resolution
process, Figma and production synchronization, and migration governance — in
plain management language.

Both routes stay unlisted and direct-URL only.

## Validation

Typecheck, lint, production build. Then a browser pass at desktop and mobile
widths over `/design-system`, `/design-guide`, `/`, `/plans`, `/cart`, the
branding screen and the marketplace asset screen: 200 responses, zero console
errors, Phase 1–5 sections still rendering, and zero links to either reference
route from any application page. Finally a scope check against the allowed file
list to confirm no production file was modified.

## Final report

Files created and extended, scope confirmation, architecture layers, counts of
canonical candidates, patterns, duplicate/overlap areas, route-local kits, shell
families, Figma mappings, token/style mappings and migration phases, the
accessibility/responsive/experience/branding/asset governance coverage,
validation results, explicit confirmation that the application, Branding &
White-Label and Marketplace Asset Management are untouched, and the list of
open FUTURE DECISION items.
