# Phase 2 — Spacing & Layout System Audit + Reference Governance

Documentation and reference-layer work only. The running application stays pixel-identical and behaviourally identical: no application screen, route, component, primitive, token, or behaviour is touched. Anything inconsistent is recorded as an observed variation or a future opportunity, never normalised.

## What gets built

Four new reference-only data modules plus extensions to the two unlisted reference pages, all describing what the code already does.

### 1. Spacing audit (`src/lib/design/spacing.ts`)
Catalogue of the spacing scale actually in use, measured from the codebase (padding, margin, gap, space-y/x, insets, page gutters, section rhythm, card/control padding, icon-to-text gaps, field spacing, toolbar/table/modal/drawer/empty-state/plan-cart spacing). Early counts already show the real scale: `gap-2` (316 uses), `px-3` (238), `gap-1` (232), `p-5` (187), `gap-3` (173), `px-4` (154), `gap-4` (133), `px-5` (102), plus the `max-w-[88rem]` web-experience container (23 uses). Each entry records value, where it occurs, approximate consumer count, semantic purpose, recurring vs one-off, consistent vs variable, current source, ownership, future centralisation safety, and visual risk of change.

### 2. Layout audit (`src/lib/design/layout.ts`)
Container inventory (web-experience 88rem container, full-width header, member shell, agency/dashboard shells, cart/product strips), max-width and gutter conventions, shell structure, filter rail plus results split, card/product/plan/KPI grids, table, form, modal, drawer, empty-state, centred and asymmetric layouts, sticky/absolute regions, overflow and clipping, min/max sizing, viewport-relative sizing (for example the hero's `min-h-[calc(100svh-5.25rem)]`). Each recurring container records width behaviour, max-width, horizontal padding, alignment, responsive behaviour, typical consumers, source, shared vs local, and observed variations. No new universal container is introduced.

### 3. Relationship, responsive, density and dimension audit (`src/lib/design/spatial-relationships.ts`)
- Structural relationships (page edge → content, container → section, section → section, heading → supporting text, card edge → content → action, grid → item, toolbar → filters → results, sidebar → main, label → control → helper, icon → text, table header → rows, dialog header/body/footer, drawer sections, empty-state elements), each marked consistent / mostly consistent / variable / one-off.
- Responsive patterns with real desktop/tablet/mobile behaviour, the triggering breakpoint, source, consumer examples, and variations — grid and column transitions, sidebar and navigation behaviour, stacking, wrapping, visibility and ordering changes, mobile control sizing, touch targets, mobile overlay behaviour.
- Density conventions (compact vs normal controls and cards, dense tables, form/dashboard/navigation/marketplace/comparison density) tied to control height, padding, row height, gap, typography and icon size. No density tokens are invented.
- Dimensional inventory (button, input, select and search heights, row and nav item heights, badges, chips, icon containers, avatars, card minimums, modal/drawer/sidebar/filter-rail widths, touch-target floors, common gaps), cross-referenced with the Phase 1 control-height and icon-size records.

### 4. Layout pattern inventory + Figma mapping
Extends `src/lib/design/inventory.ts` and `src/lib/design/governance.ts` with the layout patterns present today (page shell, standard content page, page header, section, card/product/plan/dashboard grids, KPI row, data table, results toolbar, filter rail, form, wizard, empty state, dialog, drawer, split, sidebar + content, marketplace, shopping/cart, admin, mobile stacked) — each with purpose, anatomy, real examples, responsive behaviour, spacing relationships, shared/local status, source, ownership, maturity, and future opportunity. The Figma blueprint gains spacing-value → variable, relationship → spacing rule, container → layout template, grid → grid pattern, flex → Auto Layout guidance, breakpoint → responsive doc, and control dimension → component property mappings. Blueprint only — nothing is converted or exported.

### 5. Reference pages
`/design-system` gains a spacing and layout reference section: spacing foundation with counts and semantics, layout foundation (containers, gutters, widths, alignment, grids, flex, dimensions), responsive foundation, density, layout patterns, and the Figma mapping — all rendered with the existing reference-kit components and visual language. `/design-guide` gains management-level governance on reusing existing spacing and layout, not silently normalising variation, and keeping shared spacing in the Core Design System, with experience sections for Web/Marketing, Shopping/Marketplace, Dashboard/Admin, and Future Experiences.

### 6. Documentation
`.lovable/design-system.md` and `roadmap.md` updated with every statement labelled CURRENT IMPLEMENTATION, OBSERVED VARIATION, GOVERNANCE RULE, or FUTURE OPPORTUNITY, including unowned spacing/layout areas. All previously deferred opportunities are preserved.

## Files changed

Only: `src/lib/design/*` (new `spacing.ts`, `layout.ts`, `spatial-relationships.ts`; extend `inventory.ts`, `governance.ts`, `types.ts`), `src/components/design/reference-kit.tsx` (display-only helpers), `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `.lovable/design-system.md`, `roadmap.md`. New modules are imported only by the two reference routes.

## Validation

TypeScript, ESLint, production build; `/design-system` and `/design-guide` rendered at desktop and mobile with no console errors; both confirmed unlisted with no navigation references added; git-level confirmation that no file outside the allowed scope changed; screenshot comparison of `/`, `/plans`, `/cart`, `/agency/my-organization` at desktop, tablet and mobile, treating known animation regions as noise exactly as in Phase 1.
