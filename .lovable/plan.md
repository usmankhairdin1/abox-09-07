# Phase 59 Plan — Current Application Fidelity Import

## 1. Scope and protected baseline

This is a new import phase, not B11 and not a new design-system layer. B0–B10 remain closed, reusable, and immutable.

Implementation will be limited to the Figma plugin/reference layer. It will not change `src/**`, application behavior, backend data, routes, publishing, or any existing Figma object on:

- `00 Foundations`
- `01 Components`
- `02 Patterns`
- `03 Shells`
- `04 Experiences`
- `05 Screens`
- `06 Documentation`

The existing B8 five experience frames, B9 179 screen/state reference frames and 682 reactions, and B10 ten documentation frames remain unchanged. New high-fidelity artifacts will go only on a new page appended after the protected pages: **`07 Current App`**. This page is an import workspace, not a foundation page. Its creation and all Figma writes require a later approved implementation phase.

The implementation must version the global page verifier to permit this one appended page while continuing to assert that the first seven pages, their order, approved names, IDs, counts, and signatures are unchanged. This is a new-phase page-manifest extension, not a reopening or mutation of B0–B10 and not a governed “B11” batch.

## 2. Sources to inspect and extract

The implementation extractor will use these authorities, in this order:

1. **Routes and screen identity:** `src/routes/*.tsx`, `src/lib/screens.ts`, `src/lib/nav-config.ts`, and generated route declarations for cross-checking only.
2. **Governed screen expansion:** `src/lib/governed/m00.index.ts`, `m04.index.ts`, `m05.index.ts`, `m06.index.ts`, `src/lib/m08/registry.ts`, `src/lib/m08/data.ts`, `src/components/m06/registry.tsx`, `src/components/m06/screens/*`, and `src/components/m08/*`.
3. **Shared application structure:** `src/components/abox/*`, `src/components/lucie/*`, `src/components/lucie-app/*`, `src/components/m06/*`, `src/components/m08/*`, and production-used `src/components/ui/*`.
4. **Tokens and visual rules:** `src/styles.css`, `src/lib/design-tokens.ts`, and route/component Tailwind call sites.
5. **Existing Figma contracts:** `tools/figma-plugin/extract-b1.mjs` through `extract-b10.mjs`, `tokens-b1.js` through `tokens-b10.js`, `plugin.js`, `README.md`, `.lovable/manual-work-map.md`, and `src/lib/design/*` as supporting evidence only.

No screenshot, route registry, or design-document assertion may override current production source.

## 3. Complete current screen inventory

### 3.1 Reproducible inventory method

Create a read-only extractor that:

1. Parses every `createFileRoute()` declaration and records route template, source file, parent layout, shell, imports, screen ID, dynamic parameters, and head metadata.
2. Classifies each declaration as content, layout-only, redirect/alias, design-reference-only, governed host, or ordinary screen.
3. Normalizes trailing-slash aliases without collapsing distinct dynamic templates.
4. Expands governed hosts only from their registered screen definitions; it does not guess screens from labels or tabs.
5. Expands source-backed visual states only when the source supplies distinct visible composition/content.
6. Joins every candidate to its existing B8 experience and B9 screen/state identity.
7. Emits arithmetic showing route inputs, exclusions, host replacements, governed additions, and final fidelity-artifact count. Any unmatched content route or duplicate stable identity stops extraction.

### 3.2 Verified route families to reconcile

The direct source audit contains **153 route declarations**: one root wrapper, five layout-only routes, six redirect-only routes, two internal design-reference routes, and 140 direct content routes before governed-host reconciliation.

- **Layouts, no imported screen:** `/agency`, `/app`, `/marketplace`, `/member`, `/platform`.
- **Redirects/aliases, no duplicate screen:** `/admin`, `/app/admin`, `/app/object`, `/dashboard`, `/my-work`, `/object`.
- **Internal references, no production import artifact:** the design-guide and design-system routes.
- **Public/marketplace:** `/`, accessibility, auth, coverage and ICHRA journey routes, plans list/detail, compare, cart, apply, review, schedule, handoff, support/legal, referral/shared-token entry, and unavailable outcomes.
- **Agency/M05:** organization list/detail tabs, imports, defaults, structure, administration, relationships, marketplace participation, reference-organization request, and the eight-step new-downline flow.
- **Workforce governed hosts:** the 12 `/agency/workforce/*` route hosts, replaced in the final inventory by registered M06/M08 screen identities rather than duplicated wrappers.
- **Agency operations:** `/app/agency/`, entities, producers, revenue, and statements.
- **Agent/internal:** `/app/`, dashboard, customers list/detail, work, tasks, schedule, communications, commissions, quick quote, send quote, off-exchange, and agent profile host.
- **JET platform:** ACL, AI governance, appointments, audit, branding, entitlements, exceptions, form configurator, integrations, launch readiness, module 1, notifications, platform, product builder, and products.
- **Employer/ICHRA:** census, contribution, ICHRA, proposal, and results.
- **Marketplace administration/M04:** admin home, activation, assets, availability list/detail, brand, content, domains list/request, health, history, lifecycle, participants list/detail, preview, readiness, referral links list/detail, release compare/review/schedule, routing support, and work.
- **Member:** home, messages, quotes, and settings.
- **Platform governance/M00–M05:** marketplace list/override and organization list/override.
- **Partner:** `/app/partner`.

Dynamic templates remain templates, with parameter metadata rather than fabricated records: `$organizationId`, `$importJobId`, `$id`, `$availabilityEntryId`, `$participantId`, `$referralLinkId`, `$planId`, `$marketplaceId`, `$referralToken`, `$token`, and `$pathway`.

### 3.3 Relationship to B8/B9

B8 already represents five experience-level references. B9 already represents the complete governed identity/reference layer using this arithmetic: 142 audited content route files, minus two internal references, 12 workforce hosts, one quote host, and one agent-profile host, plus 35 M06 screens, ten M08 screens, six quote states, and two visual-state records, for 179 frames.

Those B9 objects are metadata/reference compositions, not full route reconstructions. The new artifacts will link back to the corresponding B8/B9 IDs while preserving those objects. There are no newly invented product routes; the additional targets are editable fidelity representations of current source-backed screens and states. The final artifact count will be extractor output, not a manually fixed estimate.

## 4. Component reuse map

For every route, build a recursive composition manifest recording source component, props, children, repeated data, responsive branches, and Figma mapping.

### 4.1 Existing assets that may become real instances

Use live B4/B5 component keys and exact approved variants:

- `ActionPill` → `ABox/Action/ActionPill`
- `Button` → `ABox/Action/Button`
- `StatusBadge` → `ABox/Status/StatusBadge`
- `MetalBadge` → `ABox/Status/MetalBadge`
- `Surface` → `ABox/Surface/Surface`
- `Control` → `ABox/Control/Control`
- `KpiCard` → `ABox/Card/KpiCard`, including approved `deltaSign`
- `PageHeader` → `ABox/Header/PageHeader`
- `ModuleTabs` → `ABox/Nav/ModuleTab`
- `DownlineWizardStepper` → `ABox/Nav/WizardStep`
- `AboxMark` → `ABox/Brand/AboxMark`
- `EmptyState` → `ABox/Feedback/EmptyState`
- `LabeledField` → `ABox/Form/LabeledField` with its exposed nested Control
- `Input` → `ABox/Form/Input`

Map only when the production props resolve to an existing variant/property contract. Populate existing text/boolean properties from visible source content. Preserve the instance link; do not detach it. A dynamic or unsupported prop becomes a route-local editable layer around the nearest valid instance, never a fabricated variant.

Reuse B6 `KpiRow`, `ModuleTabBar`, and `WizardStepper` when the production hierarchy matches. Reuse B7 `Internal`, `Marketplace` (`flow` or `landing`), and `Member` shells where the route uses those shells and the approved property surface is sufficient.

### 4.2 Route-local editable composition

`DataTable`, `PlanCard`, marketplace page layouts, notices, context banners, shopping-path bar, product switcher, quote editor, carrier marks, M06/M08 kits and screen bodies, Lucie/Lucie-app surfaces, dialogs, sheets, popovers, tabs, selects, charts, and assistant surfaces have no approved matching B4/B5 foundation. Reconstruct them as named native Frames, Auto Layout, Text, Vector, Rectangle, and existing nested instances. Do not create components or component sets from them in this phase.

Respect known B5 exclusions: do not add the deferred KpiCard icon/hint/delta-label, PageHeader icon/actions, or EmptyState icon/action properties.

## 5. Token and style binding

For every generated property, bind by source provenance rather than visual equality:

- Bind fills, strokes, radii, spacing, sizing, and effects to the existing B1 variable only when the production declaration resolves through that exact CSS variable/alias.
- Bind typography to B2 variables and B3 text styles only where an approved mapping exists.
- Apply B3 paint/effect styles through their existing IDs; never recreate styles by name.
- Preserve B4/B5 instance bindings internally and use existing B6/B7 instances without detaching.

Values without an approved binding remain literal editable Figma properties with source metadata: Tailwind numeric spacing/sizing/type utilities, responsive breakpoint changes, `color-mix()` and alpha modifiers, computed carrier colors, gradients, backdrop blur, decorative utilities, motion, font axes/features, and `base`/`heading`/`display` typography lacking complete B3 text styles. Equal numeric/color values alone are not evidence of a token relationship.

## 6. Editable screen reconstruction and fidelity

Each fidelity artifact will contain:

1. source identity metadata;
2. the resolved B7 shell instance where applicable;
3. native editable route hierarchy in source order;
4. real B4/B5/B6 instances wherever structurally valid;
5. route-local native compositions for unsupported structures;
6. visible source-backed content and states;
7. interaction metadata and prototype links;
8. responsive and runtime limitations.

Use canonical desktop width **1440 px** with a minimum **1024 px** viewport height. Long pages grow to their source-derived content height and do not clip content. Add a **390 px** mobile companion only where source breakpoints materially change hierarchy, visibility, or shell behavior; add no tablet variant unless source contains a distinct tablet composition. Runtime rendering may be used only to measure and visually compare the current application, never as imported pixels.

## 7. Deterministic placement on `07 Current App`

Create one top-level module group Frame per approved inventory group. Each group contains a 96 px heading band and screen-family cells ordered by normalized route order, then governed screen order and state order.

- Page origin: `(0, 0)`.
- Group padding: `160 px`.
- Desktop screen width: `1440 px`; mobile companion width: `390 px`.
- Gap inside one screen family: `80 px`.
- Horizontal gap between screen families: `160 px`.
- Row gap: `240 px`.
- Maximum: four desktop screen families per row.
- Group gap: `640 px` vertically.
- Each next row starts below the tallest cell in the previous row; each next group starts below the computed bottom of the previous group.

Positions are calculated from manifest dimensions before any node is written, followed by rectangle-intersection validation. A collision, non-finite dimension, or changed stable ordering stops the run. Reruns calculate the same coordinates from stable identities rather than current canvas selection or manual viewport position.

## 8. Interaction and flow mapping

Extract links, router navigation, deterministic submit continuations, buttons, tabs, wizard next/back, row/card navigation, dialogs, sheets, drawers, popovers, filters, compare/save/cart actions, and dismiss controls from routes and shared components. Classify every source-backed interaction:

- **A — native prototype:** static internal destination or source-proven state target; create a reaction only after both stable target IDs resolve.
- **B — existing component state:** use approved B4/B5 variant/property behavior; do not create a duplicate screen.
- **C — runtime/business logic:** auth, API/database results, pricing/subsidy, persistence, validation, search/filter computation, generated IDs, external redirects, and other data-dependent outcomes; retain metadata only, or link to an existing visual state when source deterministically supplies one.
- **D — unsupported/ambiguous:** record evidence and create no reaction.

Overlay transitions are native only when the source supplies a deterministic dialog/sheet/popover state and Figma can represent it without inventing behavior. Motion maps only when source timing/direction has an exact supported equivalent. Screen fidelity and instance linkage take priority over uncertain prototype coverage.

## 9. Reimport safety and identity

Use a phase-specific namespace, never `b9`/`b10`, with plugin data for stable screen ID, route template, source file, viewport/state key, module, source signature, structure signature, binding signature, interaction signature, and placement signature.

- Reuse a matching artifact in place and preserve its Figma node ID.
- Reconcile only generated descendants owned by this phase; never delete or replace protected B0–B10 nodes or live library masters.
- Preserve matching component instances and their overrides by stable child keys.
- Create missing owned descendants, update changed owned properties, and remove stale owned descendants only after a complete preflight proves the new manifest.
- Never absorb or overwrite user-created nodes. An unknown child, duplicate stable ID, changed protected dependency, missing library asset, ambiguous target, or signature conflict stops before mutation and reports the conflict.
- Guarded rollback may remove only nodes created by the failed run. It must not roll back reused nodes or any B0–B10 asset.
- Run 2 with unchanged source must create zero pages, groups, screens, descendants, and reactions; preserve all IDs; and produce identical signatures and coordinates.

## 10. Implementation files after approval

Expected plugin/reference-layer changes only:

- new `tools/figma-plugin/extract-current-app.mjs`
- generated `tools/figma-plugin/tokens-current-app.js`
- `tools/figma-plugin/tokens.js` only to append `07 Current App` to the permitted page manifest
- `tools/figma-plugin/plugin.js`
- `tools/figma-plugin/build.mjs`
- `tools/figma-plugin/ui.html`
- `tools/figma-plugin/README.md`
- generated `tools/figma-plugin/code.js`
- `.lovable/manual-work-map.md`
- `roadmap.md` for phase status/evidence

No `src/**`, migration, backend, or application file changes are permitted.

## 11. Scope boundary

### Can be implemented in this phase

- Source-derived inventory and B8/B9 cross-reference manifest.
- Native editable desktop screens and source-proven responsive companions on `07 Current App`.
- Existing B1–B7 bindings and real component/pattern/shell instances.
- Route-local editable compositions where no approved foundation exists.
- Deterministic Category-A prototype links and Category-B state mappings.
- Conflict-safe create, update, verify, and idempotency flows.

### Requires a separate approved foundation phase

Any new reusable component, component property, variant, variable, text/paint/effect style, pattern, or shell. This import must not create one merely to improve linkage.

### Cannot be faithfully represented in static Figma

Live authentication, permissions, database/API results, pricing and subsidy engines, persistence, computed filtering/ranking, generated runtime values, accessibility semantics, unsupported CSS effects, and unsupported motion. These remain explicit metadata/limitations.

### Deferred

Ambiguous destinations, source states without deterministic fixtures, unsupported responsive behaviors, and any component extraction whose foundation does not already exist.

## 12. Validation and evidence

Before writing, verify exact protected page order, all B0–B10 counts/signatures, complete inventory arithmetic, unique stable IDs, dependency resolution, and zero geometric collisions.

After implementation, in Figma Desktop:

1. Run **Create Current App**, then **Verify Current App**.
2. Record real page/group/screen/instance/reaction node IDs and inventory arithmetic.
3. Confirm every artifact is native/editable, no image fills or flattened imports exist, and every mapped B4–B7 usage resolves to a live instance.
4. Confirm B1/B2/B3 bindings reference existing variable/style IDs and every literal fallback has source evidence.
5. Confirm module order, route order, dimensions, row wrapping, group spacing, and zero overlaps.
6. Compare representative Public, Internal, Agency/M06, JET, Employer, Marketplace Admin/M04, Member, and Platform screens against the running application at 1440 px and source-backed 390 px cases; record hierarchy, content, typography, spacing, state, and shell differences.
7. Exercise representative prototype links, wizard steps, tabs, overlays, and component states; confirm runtime-only interactions are not falsely simulated.
8. Re-run **Create Current App**, then verify again: zero new objects/reactions, unchanged node IDs, signatures, bindings, and coordinates.
9. Re-run B0–B10 closure verification and prove every protected count/signature is unchanged.

Offline extraction/build checks are necessary but remain labeled offline; final acceptance requires real-Figma create/verify/recreate/verify evidence.
