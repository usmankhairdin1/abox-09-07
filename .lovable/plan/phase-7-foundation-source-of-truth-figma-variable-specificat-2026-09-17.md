# Phase 7 — Foundation Source-of-Truth & Figma Variable Specification

Documentation and reference layer only. The running application stays pixel-identical and behaviourally identical. No production file is touched.

## Scope of edits

Only these may be created or edited:

- `src/lib/design/*` (new Phase 7 modules, additive type extensions)
- `src/components/design/reference-kit.tsx`
- `src/routes/design-system.tsx`
- `src/routes/design-guide.tsx`
- `.lovable/design-system.md`
- `roadmap.md`

New Phase 7 data is consumed only by `/design-system` and `/design-guide`. Both stay unlisted and reachable by direct URL only.

## Evidence first

Re-read the Phase 1–6 modules already in `src/lib/design/` (foundation, spacing, layout, spatial-relationships, typography, typography-behavior, iconography, assets, components, variants, states, relationships, architecture, classification, canonical-components, blueprints, normalization, naming, figma-library, governance) plus live production evidence in `src/styles.css`, `src/components/ui/*`, `src/components/abox/*`, shells, routes, branding and marketplace-asset implementations. Values and usage counts come from the codebase, never from invention. Where a future canonical value cannot be derived safely from evidence, the record is marked FUTURE DECISION rather than silently chosen.

## New reference modules (`src/lib/design/`)

| Module | Contents |
| --- | --- |
| `foundation-model.ts` | The primitive → semantic → component role → pattern/experience → screen dependency model, plus the explicit statement that production today mixes variables, aliases, utilities and literals |
| `color-foundation.ts` | Every colour token: name, value, purpose, consumers, frequency, light/dark behaviour, foreground pairing, contrast notes, primitive vs semantic, current status, future canonical role, Figma candidate, migration notes |
| `color-roles.ts` | Primitive colour vs semantic role vs component usage separation; overlaps recorded as OBSERVED OVERLAP with the future separation opportunity |
| `theme-modes.ts` | Light/dark value pairs, same/different flags, consumer implications, future Figma mode mapping |
| `status-tone.ts` | Current tone vocabulary, consumers, visual meaning, overlapping meanings, future semantic status roles and tone taxonomy — no winner chosen |
| `tier-foundation.ts` | Bronze, Expanded Bronze, Silver, Gold, Platinum, Catastrophic and foregrounds, kept separate from generic status semantics |
| `typography-foundation.ts` | Families, weights, sizes with counts, line heights, tracking, semantic roles (display, page title, section title, component title, body, supporting, label, eyebrow, caption, metadata, serial, table, KPI, action) and responsive typography records |
| `spacing-foundation.ts` | Spacing utilities with frequencies, pixel relationships, contextual groupings, and an evidence-derived future canonical scale with migration implications |
| `spacing-relationship-spec.ts` | The relational spacing set (page edge, header, section, title/supporting, label/control, field/field, icon/text, card, toolbar, filter, table, navigation, dialog, grid gaps) with observed range, consistency, contextual variation, future rule, Figma mapping |
| `layout-foundation.ts` | Container widths, shells, split and detail layouts, full-bleed, overlays, gutters, grid/flex conventions, plus breakpoint records with observed usage |
| `shape-foundation.ts` | Radius, border colour/width/hairline/focus-ring/decorative treatments, elevation/shadow tokens, opacity usage including the `bg-black/40` scrim |
| `icon-motion-density.ts` | Icon libraries and sizes (`h-4 w-4` vs `size-4` as FUTURE OPPORTUNITY), stroke and a11y conventions, motion keyframes/utilities/durations/reduced-motion with future motion roles, and control-height/density records preserving the 40px vs 36px variation |
| `component-roles.ts` | FUTURE CANONICAL TARGET foundation-consumption maps for Button, Input, Card, StatusBadge and the other Phase 6 canonical candidates |
| `token-naming.ts` | Future naming rules per category with examples, compatible with code, Figma variables and component properties, white-label aware |
| `primitive-semantic-map.ts` | Explicit primitive → semantic → component role → experience mappings across all categories |
| `figma-variables.ts` | Collection/mode model (ABox Core; Light, Dark), variable groups, true-variable vs documentation-metadata flags, per-token Figma mapping records, style naming conventions, and explicit limitation notes where a clean one-to-one mapping does not exist |
| `foundation-accessibility.ts` | Touch targets, focus-visible, contrast, semantic colour, disabled, error/success/warning, icon-only and decorative icons, readability, reduced motion, keyboard, status communication — each labelled current / variation / future governance / future decision |
| `foundation-boundaries.ts` | Brand foundation vs runtime Branding & White-Label; design-system vs production vs branding vs marketplace runtime assets, with ownership and sync direction |
| `foundation-experience.ts` | Web/Marketing, Shopping/Commerce, Dashboard/Admin usage rules over one shared foundation |
| `foundation-governance.ts` | Adding, modifying, deprecating a token, adding an alias, experience-specific tokens; change-propagation chain plus honest current-state note; descriptive maturity classifications (no scores, no rankings) |

`types.ts` is extended additively only; all Phase 1–6 exports, types and sections keep working.

## Labelling

Every record carries explicit status labels from the controlled vocabulary (CURRENT IMPLEMENTATION, OBSERVED VARIATION, OBSERVED OVERLAP, OBSERVED DUPLICATE, INSTALLED BUT UNUSED, POSSIBLY UNUSED, UNOWNED AREA, GOVERNANCE RULE, FUTURE CANONICAL TARGET, FUTURE OPPORTUNITY, FUTURE FIGMA ORGANIZATION, FUTURE MIGRATION, FUTURE DECISION). CURRENT IMPLEMENTATION and FUTURE CANONICAL TARGET are never merged into one statement.

## Reference pages

`/design-system` gains the 33 concise technical sections listed in the brief (Foundation Source of Truth through Open FUTURE DECISION items), rendered with the existing compact table helpers; new helpers are added to `reference-kit.tsx` only where an existing one does not fit. `/design-guide` gains management-facing foundation governance sections in plain language. No runtime editors, no theme switcher, no asset editing.

## Documentation

`.lovable/design-system.md` and `roadmap.md` receive a complete Phase 7 section stating that production is unchanged, Phase 7 is reference-only, current tokens are not automatically canonical, future canonical tokens are not production, no design library exists, and migration is deferred — cross-referenced to Phases 1–6.

## Validation

Typecheck, lint and production build; `/design-system` and `/design-guide` at desktop and mobile with zero console errors and Phase 1–6 sections still rendering; `/`, `/plans`, `/cart`, an agency/admin surface, Branding & White-Label and Marketplace Asset Management unchanged; no navigation or page links to either reference route; final changed-file scope check confirming no production file was modified.

## Explicitly not done

No normalization of colours, spacing, typography, radius, shadows, icon sizes, control heights or status tones. No alias removal, no renames, no dependency removal, no component consolidation, no winner chosen among duplicates, no visual corrections, no branding or marketplace changes, no real Figma components or assets, no migration.
