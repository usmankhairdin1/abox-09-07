# Phase 14 — Canonical Production Component Library Plan (plan-only)

Plan-only phase. No production file is created, modified, renamed, deleted, refactored, migrated, centralized, normalized, wrapped or aliased. No route, page, JSX, component, component API, import, export, CSS, Tailwind class, token, typography, spacing, layout, responsive behaviour, breakpoint, colour, border, radius, shadow, icon, animation, control height, density, accessibility behaviour, interaction, navigation, link, content, business rule, state behaviour, branding, white-label behaviour, marketplace asset, marketplace workflow or runtime configuration changes. The running application stays exactly as it is.

## What gets produced

Exactly one new file: `.lovable/phase-14-canonical-production-component-library-plan.md`, with all 31 sections plus the validation record.

It opens with the two required statements verbatim:

- "PHASE 14 IS PLAN ONLY. NO PRODUCTION APPLICATION CHANGES HAVE BEEN MADE."
- "The existing rendered application is the preservation baseline. Any future canonical production component must reproduce the existing visual, responsive, accessibility, interaction, navigation, content, branding, asset, and business-logic behavior exactly for every verified consumer."

Phase 5, 8, 9, 10, 11, 12 and 13 records are navigation only. Every consumer count is re-measured against today's code, with `src/lib/design/**` and `src/components/design/**` excluded from production counts. Propagation is asserted only where a real import exists — never because two pieces of UI look alike.

## Evidence already re-measured for this plan

- `src/components/ui/button.tsx` — CVA with variants `default`, `outline`, `ghost` (plus the others in the file) and sizes `default h-9 px-4 py-2`, `sm h-8 rounded-md px-3 text-xs`, `lg h-10 rounded-md px-8`, `icon h-9 w-9`, `icon-sm h-8 w-8`; base includes `rounded-md`, `focus-visible:ring-1 ring-ring`, `disabled:opacity-50`, `[&_svg]:size-4`.
- `src/components/abox/data-table.tsx` — typed `Column<T>` API (`key`, `header`, `cell`, `className`, `align`) plus `rows`, `getRowId`, `caption`, `empty`, `onRowClick`, `ariaLabel`; wrapper `rounded-lg border border-hairline bg-card`, `min-w-[640px]`, header `text-[10px] uppercase tracking-[0.18em]`, cells `px-5 py-4`.
- `react-hook-form`, `@hookform/resolvers` and `zod` are installed; the only production file importing react-hook-form is `src/components/ui/form.tsx`. Every other form in the app is hand-rolled.
- Production importing files: InternalShell 89, StatusBadge 87, ACTION_PILL 33, MarketplaceShell 30, PageHeader 23, Button 22, DataTable 19, KpiCard 16, EmptyState 8, Input 7, Select 7, Card 6, MemberShell 4, PlanCard 4, Skeleton 4, Dialog 4, Tooltip 4, Tabs 3, Textarea 3, Sheet 3, DropdownMenu 3, MetalBadge 2, ModuleTabs 2, Alert 1, Badge 1, Checkbox 1, RadioGroup 1, Popover 1, Switch 1. Zero production importers: `planai-assistant.tsx`, `overflow-text.tsx`, `placeholder-screen.tsx`, `theme-toggle.tsx`, `AboxWordmark`, `ToothIcon`, `ui/table.tsx`, `ui/pagination.tsx`.
- Route-local kits: `m06/kit.tsx` (+ `screens/common.tsx`, `registry.tsx`, `workforce-page.tsx`), `m08/kit.tsx` (+ `screens.tsx`, `selling-setup.tsx`), `lucie/ui.tsx`, `lucie-app/ui.tsx` (+ `frames.tsx`), `ai-elements/*`, `icons/tooth-icon.tsx`.

## How the sections get built

**§1 re-validation (A–S)** — re-audit `ui/*`, `abox/*`, `abox/decor/*`, the three shells, every route-local kit, route-local UI, repeated inline implementations, icons, forms, tables, cards, headers, navigation, action groups, status/tier, loading/empty/error, overlays, assistants and commerce components. Per component: name, path, export, category, purpose, direct production consumers and count, consuming routes, experiences, shared vs route-local, indirect consumption, variants, states, sizes, density, responsive and accessibility behaviour, styling source, foundation and pattern dependencies, known local overrides, known duplicates, preservation risk. No invented consumers or counts.

**§2 canonical definition** — the thirteen requirements (real source, real consumers, stable responsibility, explicit API, documented variants/states/sizing/density/accessibility/responsive, foundation dependencies, composition rules, verified propagation path, regression contract, ownership), plus the explicit non-criteria: visual commonality, folder location, frequency, apparent reusability, presence in `src/lib/design`, or appearance on the reference pages.

**§3 candidate register** — every area you listed across actions, forms, display, data, navigation, overlays, feedback, commerce, brand and shell, each with the full evidence row and one neutral status. No ranking, no scoring; a single existing source is named only where the code shows no competing implementation for the same responsibility.

**§4 current vs future source** — per candidate: current production source, future canonical source (`NOT YET DECIDED` / `FUTURE FILE — NOT CREATED` where undetermined), current consumers, future verified consumers, non-consumers, local overrides, experience extensions, migration requirement, preservation risk.

**§5 API blueprint** — for serious candidates only, derived from the code that exists (for example `DataTable`'s real `Column<T>` API and `PageHeader`'s real props). Anything the current code does not settle is marked `FUTURE DECISION` rather than invented.

**§6 variants** — Button variants/sizes as written, the eight `ACTION_PILL` strings, six StatusBadge tones, six metal tiers, PageHeader `default`/`compact`, card and table density. Each classified as current production variant, observed variation, experience extension, route-specific exception or future decision. Nothing merged.

**§7 states** — the sixteen states you listed, recorded per component as what actually changes today (colour, border, background, typography, icon, opacity, dimension, interaction, ARIA), including the deliberately suppressed selection rings on the exchange filters.

**§8 size and density** — the measured distribution (`h-10` 139, `h-11` 66, `h-9` 43, `h-8` 40, `h-12` 7) and the global `min-height: 44px` below 640px, mapped to 32/36/40/44/48px. No standard chosen; the question is only whether future components would need size variants, density variants, experience variants or component-specific dimensions.

**§9 propagation model** — per canonical candidate: canonical source → API → verified consumers → pattern → experience → screen, with import path, usage, variant, local override, foundation dependency, responsive and state behaviour, and the regression requirement per consumer. Only real imports create a relationship.

**§10 dependency graph** — foundation → semantic role → core component → compound → pattern → experience → screen, using Phase 9 records only where today's code confirms them, with component-to-foundation, component-to-component, component-to-pattern, component-to-shell and component-to-experience edges, and an explicit no-circular-ownership rule.

**§11 compound components** — form field, result toolbar, filter rail, card collection, KPI group, table presentation, plan comparison, cart summary, page opening, navigation group, dialog sections — each only where a distinct responsibility beyond grouping is evidenced; otherwise `FUTURE DECISION`.

**§12 duplicate register** — reconciles Phases 5/8/9/10/11/12 against current code for cards, page headers, form fields, tables, navigation, assistants, empty states, action groups, status/tone systems, control sizing, icon containers, shells and route-local kits, in your A/B format. No winner, no merge, no deletion.

**§13 experience boundaries** — per candidate: global, shared-with-variants, experience extension, experience-specific or route-specific, justified from code. Nothing flattened.

**§14 shells** — `InternalShell` (501 lines, 89), `MarketplaceShell` (223, 30), `MemberShell` (145, 4): responsibility, routes, consumers, navigation source (`nav-config.ts` `WORKSPACES` / `MEMBER_NAV` versus the marketplace shell's inline navigation), responsive behaviour, branding and asset relationship, future boundary, shared foundations, experience-specific responsibilities. Not merged.

**§15 forms** — the react-hook-form/zod stack confined to `ui/form.tsx`, the `ui/*` field primitives and their real importer counts, `m06/kit.tsx` `Field`/`TextInput`/`TextArea`/`Picker`, `lucie/ui.tsx` `Select`/`Search`, and the raw `<input>/<select>/<textarea>` routes (`marketplace.admin.brand.tsx` 9, two override routes 6 and 5, `marketplace.admin.content.tsx` 6, two agency routes 6 each). Labels, descriptions, errors, validation, focus and keyboard behaviour recorded, nothing consolidated.

**§16 tables and data** — `DataTable` (19) with its real API, `lucie/Table`, the five raw `<table>` routes, `ui/table.tsx` and `ui/pagination.tsx` recorded as installed-but-unused, plus toolbars, density, sorting, selection, loading, empty and responsive behaviour (`min-w-[640px]` horizontal scroll). No new pagination behaviour, no consolidation.

**§17 cards and surfaces** — `ui/card.tsx` (6) versus the inline surface pattern (`marketplace.admin.content.tsx` 15, `agency.organizations.$organizationId.index.tsx` 13, `quote.tsx` 10, two more at 10), plus `PlanCard`, `KpiCard`, `DefinitionCard`, `BlockerCard`, marketing plates and cart summary. Padding, radius, border, shadow, background, internal spacing, responsive behaviour, variants, consumers and experience per implementation. No universal card decided.

**§18 navigation and page headers** — `abox/page-header.tsx` two variants (23), `lucie/PageHead`, `lucie-app/PageHeader`, inline `text-display` headings, section headers, `ModuleTabs` versus `ui/tabs.tsx`, breadcrumbs, shell navigation and `src/lib/nav-config.ts`, keeping design-system component, navigation configuration, shell and page-specific navigation distinct.

**§19 branding and marketplace** — `/app/jet/branding`, `app.jet.branding.tsx`, `marketplace.admin.brand.tsx`, `marketplace.admin.assets.tsx`, `marketplace-store.ts` stay runtime-owned; future display components may read branding configuration but never own its state, storage or the upload/scan/validate/preview/retire workflow.

**§20 route-local kits** — per kit: what it owns, what it imports, what it should keep owning, potential future shared concepts, route scope, migration blocker, preservation risk. No kit is migrated.

**§21 icons and decorative** — `ToothIcon` (Tabler, 0 production importers), `decor/*`, inline SVG marks, icon wrappers, icon-only controls, each assigned to foundation, primitive, component, decorative system, experience layer or route-local layer. No library consolidation.

**§22 accessibility contract** — semantic HTML, ARIA, keyboard, focus, disabled, screen-reader, decorative icon handling (`aria-hidden`), label and error association, reduced motion (`src/styles.css` L268–274) and touch targets (the 44px rule), required to remain exactly equivalent.

**§23 content and responsive contract** — short/long content, localization (the M08 English/Spanish toggle), wrapping, truncation, missing and optional content, dense content, and mobile/tablet/desktop behaviour per candidate, with the rule that no architecture change may cause unexpected wrapping or layout change.

**§24 future file map** and **§31 final implementation map** — the exact column sets you specified, using only real current files and `NOT YET DECIDED` / `FUTURE FILE — NOT CREATED` for anything future.

**§25 library structure** — conceptual layers only (primitives, canonical components, compound components, patterns, experience extensions, shells, decorative), with explicit guards against circular dependencies, business-logic leakage, branding ownership leakage, route-specific code becoming canonical, and reference documentation becoming a runtime dependency. No directory or file is created.

**§26 migration sequence** — your fifteen incremental, reversible steps, with the prohibitions on mass migration, automatic replacement, unverified consumers and similarity-based migration.

**§27 regression contract** — the full visual / responsive / interaction / accessibility / functional / branding enumeration in exact-preservation language, with no tolerance and no "visually equivalent".

**§28 manual change map** — per concept: current source, future canonical source, verified consumers, propagation, non-consumers, local overrides, blockers, regression requirement.

**§29 open decision register** — only decisions that survive code inspection, each with question, evidence, implementations, consumers, options present in code, what would change, preservation risk, required owner, required approval, status. Unanswered, unranked.

**§30 Phase 15 gate** — what the Production Pattern Library cannot begin without: canonical ownership, component APIs, variant and state architecture, foundation dependencies, compound boundaries, experience and shell boundaries, duplicate decisions, regression baseline.

## Validation before reporting complete

Confirm only `.lovable/phase-14-canonical-production-component-library-plan.md` was created; no production file, route, component, component API, token, styling, visual, responsive, accessibility, interaction, navigation, branding or marketplace behaviour changed; all consumer counts re-measured; all cited paths exist; reference-layer files remain reference-only; no future component file created; no duplicate merged, component renamed or deleted; no winner, ranking or score; no normalization; no migration; current and future architecture separated; every proposed canonical component evidenced or marked FUTURE DECISION; the exact-preservation regression contract present; Phase 15 prerequisites documented; the plan implementation-ready but not implemented. Then report `PHASE 14 PLAN COMPLETE — NO PRODUCTION CHANGES MADE` with the requested summary.
