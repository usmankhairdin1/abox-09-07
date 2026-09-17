# Phase 8 — ABox Core Canonical Component Library Specification

Documentation and reference-layer only. No production file is created, edited, renamed, deleted, or refactored. The running application stays pixel-, behavior-, route-, responsive-, branding- and asset-identical.

## What Phase 8 produces

A machine-readable specification of what a future ABox Core component library should define, built entirely from evidence already gathered in Phases 1–7 plus the current code. Every entry states separately what exists today and what a future canonical version would look like. Where the evidence does not support a safe future rule, the entry is marked FUTURE DECISION rather than guessed.

Phase 5 already inventories what exists (27 ABox modules, 49 UI primitives, shells, route-local kits, duplicates, unused items). Phase 6 already sketches architecture and a canonical component map. Phase 8 does not repeat those — it adds the per-component specification layer on top of them and links back by reference.

## Files

All new files live in `src/lib/design/`. Only these files are touched:

New modules
- `component-spec-types.ts` — the shared specification shape (see Technical section). Imports and extends existing types from `types.ts`; no type is duplicated.
- `spec-anatomy.ts` — the controlled anatomy vocabulary (Root, Leading, Icon, Label, Supporting, Trailing, Header, Body, Footer, Title, Description, Content, Action, Media, Indicator, Control, Helper, Error, Overlay, Trigger) with definition, when it applies, and when it must not be forced.
- `spec-properties.ts` — the property model: content / behavioral / visual variant / size / density / state / icon / responsive / accessibility / experience property classes, plus which map to Figma properties and which stay code-only.
- `spec-variants.ts` — variant governance: semantic, visual, size, density, structural; rules for when an OBSERVED VARIATION may become a canonical variant and when it stays documented only.
- `spec-states.ts` — the future state vocabulary (default, hover, focus, focus-visible, active, selected, checked, open, expanded, disabled, loading, error, success, warning, info, pressed) and what each state may affect.
- `spec-sizing.ts` — size and density framework carrying the observed 40px / 36px / `h-9` differences forward as preserved facts; any unresolved rule marked FUTURE DECISION.
- `spec-icons.ts` — icon rules (sizing, leading/trailing, icon-only, decorative vs accessible, alignment, spacing, loading/state icons) referencing Phase 4 evidence: Lucide dominant, single Tabler use, Font Awesome INSTALLED BUT UNUSED, `h-4 w-4` vs `size-4` variation.
- `spec-components-actions.ts`
- `spec-components-forms.ts`
- `spec-components-display.ts`
- `spec-components-containers.ts`
- `spec-components-data.ts`
- `spec-components-navigation.ts`
- `spec-components-overlays.ts`
- `spec-components-feedback.ts`
- `spec-components-brand.ts`
- `spec-components-commerce.ts`
- `spec-components-shell.ts`
  Each holds the full specifications for its category using one shared shape. Split by category so no file becomes unreadable.
- `spec-registry.ts` — assembles every category into one exported registry plus derived counts. This is the single source the reference pages read.
- `spec-composition.ts` — allowed and prohibited composition rules, plus the recurring relationship rules (page edge → content, label → control, toolbar → results, table header → body, dialog sections, and the rest) linked to the components they govern.
- `spec-dependencies.ts` — the dependency chain per component: Foundation → semantic role → component role → component → compound → pattern → experience pattern → screen, each link tagged CURRENT IMPLEMENTATION, FUTURE CANONICAL TARGET or FUTURE DECISION.
- `spec-duplicates.ts` — the preserved duplicate/overlap register: multiple table systems, multiple PageHeader systems, multiple EmptyState systems, multiple form-field systems, multiple assistants, the Sheet naming collision, multiple action paths, status/tone vocabulary overlap, route-local kits. Recorded side by side, no ranking, no winner, no "best".
- `spec-route-kits.ts` — how M06, M06 screen-common, M08, Lucie, Lucie-app and ai-elements should relate to ABox Core in future (core → experience extension → route-local kit), without touching them.
- `spec-experience.ts` — extension boundaries for Web/Marketing, Shopping/Commerce, Dashboard/Admin: what stays shared core and where an experience may legitimately extend.
- `spec-accessibility.ts` — future accessibility requirements per category, with current behavior and future governance stated separately.
- `spec-content.ts` — content and text behavior rules: long labels, truncation, wrapping, overflow, localization and bilingual text, numeric/date/currency, empty, missing, loading and error content.
- `spec-figma-library.ts` — the Figma library blueprint: structure, foundations, variables, text and effect styles, component families, properties, variants, states, sizes, density, slots, icons, patterns, experience extensions, naming.
- `spec-figma-mapping.ts` — per-component mapping to Figma component / variant / boolean / instance-swap / text properties, variables, modes and styles, plus concepts that must stay code-only.
- `spec-naming.ts` — naming conventions for components, variants, states, sizes, density, slots, properties, tokens, Figma components and variables. No existing production name is changed.
- `spec-governance.ts` — descriptive maturity categories (documented current component, documented current variation, future canonical target, future opportunity, future decision, migration candidate, experience-specific extension), the documentation template, and the rules for justifying a new component versus reusing one. No scores, no ranking.

Edited files
- `src/components/design/reference-kit.tsx` — reuse existing helpers wherever they fit (`BlueprintTable`, `TokenSpecTable`, `RoleChainTable`, `ComponentRoleList`, `FoundationA11yTable`, `FoundationMaturityTable`, existing relationship and variant tables). Add only what genuinely cannot be expressed by an existing helper: a `ComponentSpecCard` (renders one full specification), a `SpecMatrixTable` (property/variant/state grids), and a `DuplicateRegisterTable` (parallel implementations without ordering). Additive only; no existing helper's output changes.
- `src/routes/design-system.tsx` — new technical sections consuming `spec-registry.ts` and the supporting modules, appended after the Phase 7 sections, with matching table-of-contents entries.
- `src/routes/design-guide.tsx` — new management-facing sections in plain language.
- `.lovable/design-system.md` — a Phase 8 section, same CURRENT IMPLEMENTATION / OBSERVED … / FUTURE … vocabulary.
- `roadmap.md` — Phase 8 recorded, with open decisions carried forward.

Both reference routes stay unlisted, direct-URL only, and absent from navigation, sidebars, headers, menus, breadcrumbs, and every application link.

## Coverage

Specifications are written for the categories requested — Actions, Forms, Display, Containers, Data, Navigation, Overlays, Feedback, Brand, Commerce, Shell — but only for entries the codebase actually supports. Anything listed in the request without production evidence (for example SplitButton, or Image/Media) is recorded as FUTURE DECISION with the reason, never invented as if it existed. Brand entries keep Branding & White-Label and Marketplace Asset Management explicitly outside the design-system specification as runtime-owned.

## Design Guide additions

What ABox Core is, what is current versus future, how components are governed, when a new component is justified and when an existing one should be reused, how experience extensions work, how Figma relates to code, how a future migration would be staged, why branding and runtime assets stay separate, and how open decisions are tracked — written for non-engineering readers.

## Technical section

Shared specification shape (in `component-spec-types.ts`, extending existing `types.ts` primitives):

```text
CanonicalComponentSpec {
  name, category, purpose,
  anatomy:      { part, required|optional, role, note }[]
  contentModel: string[]
  properties:   { name, propertyClass, values, default?, figmaMapping, status }[]
  variants:     { kind: semantic|visual|size|density|structural, values, status }[]
  states:       { state, affects[], a11y, status }[]
  sizes, density
  iconBehavior, typographyDeps, spacingDeps, colorDeps, shapeDeps
  responsive, accessibility, interaction
  composition:  { allowedChildren, prohibited, parentPatterns }
  experienceExtensions
  currentImplementation: { file, export, consumers, note }[]
  observedVariations:   string[]
  futureCanonicalTarget: string
  figmaMapping, migrationNotes, governanceStatus
}
```

Every field carries an explicit status drawn from the Phase 7 controlled vocabulary, so a reader can never mistake a target for something that ships today. `currentImplementation` points at real files and real consumer counts already measured in Phase 5; nothing is re-measured loosely or estimated.

The registry in `spec-registry.ts` is the only assembly point; the reference pages render from it and never restate a specification inline, so the structured data stays the single source of truth.

Reuse over duplication: foundation tokens come from the Phase 7 modules, relationships from `relationships.ts` / `spatial-relationships.ts` / `component-relationships.ts`, inventory facts from `components.ts` and `inventory.ts`, architecture from `architecture.ts` and `canonical-components.ts`. Phase 8 links to these rather than copying their contents.

## Validation

- `bunx tsgo --noEmit` clean
- lint on the changed files, accepting only the known pre-existing fast-refresh warning
- production build passes
- `/design-system` and `/design-guide` verified on desktop and mobile, zero console errors
- all Phase 1–7 sections still render
- representative production routes (`/`, `/plans`, `/cart`, an agency route) unchanged
- Branding & White-Label and Marketplace Asset Management unchanged
- no application navigation, breadcrumb or link points at either reference route
- final changed-file scope check against the allowed list

## Explicit confirmation

No production application file will be modified. The only files created or edited are those under `src/lib/design/`, `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `.lovable/design-system.md`, and `roadmap.md`. No migration, consolidation, renaming, deletion, winner selection, normalization, dependency cleanup, or Figma asset creation happens in this phase.
