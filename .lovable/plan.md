# Phase 50 — Figma-Native ABox Design System & Library Generation Blueprint (PLAN ONLY)

Planning and extraction blueprint only. No production code, UI, behaviour, routes, assets, branding, tokens, ESLint, governance enforcement or Figma file is created or changed in this phase. Phases 1–49 decisions are respected and not reopened.

## 1. Executive scope

Produce the evidence-backed blueprint for turning the completed ABox production architecture into a native Figma library — variables, text styles, effect styles, component sets with real variants and properties, patterns, shell assets and representative screens — generated from the canonical production sources rather than manually rebuilt or pasted as images.

Prerequisite (not a blocker for this plan): Lovable has no cloud Figma connector. Any future write-capable Figma phase needs the Lovable Desktop app plus Figma Desktop in Dev Mode with the local MCP server enabled; the desktop Figma connector is read-only, so write automation must run through a supported Figma plugin/Make path. This constraint is recorded in the Risks section and shapes the automation map.

## 2. Exact source inventory

Extraction sources, each with export names and measured consumers from Phase 49:

`src/styles.css` (198 custom properties, two `@theme inline` blocks, 13 `@utility` rules, 6 `abox-*` keyframes, `@custom-variant dark`) · `action-pill-component.tsx` (`ActionPill`, `actionPillClass`; 38 importers) · `action-pill.ts` (`ACTION_PILL`, `ActionPillVariant`; 2) · `status-badge.tsx` (`StatusBadge`; 89) · `kpi-card.tsx` (18) · `page-header.tsx` (25) · `data-table.tsx` (`DataTable`, `Column`; 20) · `empty-state.tsx` (10) · `surface.tsx` (82) · `control.tsx` (`controlClass`, `ControlClassOptions`; 2) · `field.tsx` (2) · `notice-page.tsx` (4) · `marketplace-page-layout.ts` (`MARKETPLACE_PAGE_LAYOUT`; 10) · `logo.tsx` (`AboxMark`, `AboxWordmark`; 5) · `motion.tsx` (`FadeRise`, `Stagger`, `StaggerItem`, `CountUp`; 1) · `plan-card.tsx` (6) · `metal-badge.tsx` (25) · three shells · `src/lib/marketplace-store.ts` (Brand record, `getActiveBrand`, `getDraftBrand`) · consumed shadcn/Radix primitives only (button 22, input 7, select 7, card 6, label 5, dialog 4, skeleton 4, tooltip 4, tabs 3, sheet 3, textarea 3, dropdown-menu 3, separator 2, and the 1-importer set). No additional canonical ABox component is invented.

## 3. Foundation mapping

Each extracted item receives exactly one disposition: Figma variable · text style · effect style · component · component property · variant · pattern · screen composition · code-only · runtime-only · library-owned · intentionally not represented.

- **Colour** — primitives and semantic/status/theme roles from `styles.css` become Figma variables with Light/Dark modes driven by the `dark` variant. Runtime Brand values (`primary_color`, `accent_color`, logo/favicon asset ids) are **runtime-only** and must never become static foundation variables.
- **Typography** — font families and the centrally owned `text-display`, `text-eyebrow`, `text-serial` utilities become Figma text styles. Everything else stays component-owned (Phase 33 finding): recorded as code-only, not promoted to global styles.
- **Spacing** — only proven owners map to variables: `MARKETPLACE_PAGE_LAYOUT` wrappers, `ACTION_PILL` geometry, `controlClass` heights, Surface padding. The 139 arbitrary one-off values stay code-only (Phase 49 deferral, not reopened).
- **Shape** — radius/border/hairline variables plus elevation as Figma effect styles; `card-brackets`, `edge-sheen`, `ember-underline`, `glass`, `noise-field`, `contour`, `aurora`, `ring-pill`, `divider-warm` documented as decoration vocabulary, mapped to effect/style or documentation-only where Figma cannot represent them exactly.
- **Layout** — marketplace wide/narrow wrappers, shell layout boundaries, container/gutter relationships; breakpoints (1440/834/390 framing) are library-owned Tailwind behaviour, represented as frame sizes not variables.
- **Iconography** — lucide-react family, sizing conventions, decorative (`aria-hidden`) vs functional (labelled) distinction; icons become instance-swap properties, not duplicated component sets.

## 4. Variable collection blueprint

Collections to be evaluated and specified: `Color/Primitive`, `Color/Semantic`, `Color/Status`, `Spacing`, `Radius`, `Border`, `Elevation`, `Layout`, `Control`. Modes: Light / Dark only. Every proposed variable is recorded with collection, name, type, value, mode, code source (file + declaration), semantic purpose, scope (global / component-scoped / runtime-owned) and designer exposure. Tenant branding is excluded by rule.

## 5. Component mapping

For each of ActionPill, StatusBadge, KpiCard, PageHeader, DataTable, EmptyState, Surface, control family, Field, NoticePage, marketplace page layout, motion helpers, AboxMark, AboxWordmark the blueprint records: source file, export name, importer count, usage-site count where known (importerFiles and usageSites stay separate units), purpose, anatomy, props, variants, states, sizes, icon behaviour, typography, spacing, shape, responsive behaviour, interaction behaviour, accessibility behaviour, composition relationships, Figma candidate + properties + variants + component-set grouping, and a traceability id.

Utility-only code (`marketplace-page-layout.ts`, `controlClass`, `ACTION_PILL`) maps to variables and documentation, not to components. Motion helpers map to documentation plus, where meaningful, prototype/smart-animate notes — never to components.

## 6. Component property / variant blueprint

Per candidate: component set, variant axes (tone, size, state), boolean properties, instance-swap (icon) properties, text properties, exposed nested properties, allowed combinations and combinations that must remain impossible. Variants are created only where the production source has a real axis; code props with no design representation stay code-only, and business data never becomes a variant.

## 7. Pattern mapping

Only patterns already established in production: Foundation → Component → Compound (KpiCard row, Field group, DataTable with EmptyState) → Pattern (page header + surface content, marketplace page layout) → Experience pattern → Screen. No new pattern is invented.

## 8. Shell mapping

InternalShell, MarketplaceShell, MemberShell remain three independent families in Figma, with per-shell navigation, layout, responsive behaviour, and an explicit list of shared ABox components used inside each. Shared assets are represented once; shell chrome is never unified.

## 9. Branding boundary

Documented as a relationship, not an ownership transfer: Brand record → `getActiveBrand` → marketplace shell/landing; `getDraftBrand` → admin brand/preview/compare/releases. Figma holds the static ABox mark and design-time foundation colours only. Tenant colours, runtime asset references and favicon stay runtime-owned. Figma must not become the runtime branding source.

## 10. Screen inventory

Each proposed screen records route, shell, state, viewport, evidence level, components demonstrated, Figma frame candidate, responsive frames needed and exactness confidence. Evidence levels are stated honestly: **runtime-captured** for the measurable public routes (`/`, `/faq`, `/select`, `/quote?step=1`, `/plans`, `/compare`, `/cart`, `/review`, `/handoff`); **source-inspected / structurally represented** for all auth-gated `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, `/member/*` screens, which remain NOT CAPTURED. No visual capture is claimed where none exists.

## 11. Automation map

- **A. Fully automatable** — variable collections and values, text styles, effect styles, component-set scaffolds with variants and properties, Auto Layout from the extracted geometry, naming, library page structure, traceability records.
- **B. Automatable with review** — component anatomy fidelity, decoration utilities, icon mapping, pattern compositions, representative screen assembly.
- **C. Manual Figma judgment** — canvas organisation, documentation annotations, prototype/motion notes, limitation write-ups where Figma cannot express a CSS treatment.
- **D. Must stay code/runtime-owned** — runtime branding, live data, business logic, routing, governance enforcement, Marketplace Asset Management.

## 12. Manual-work map

Explicitly isolate only the C-list above so no future phase manually rebuilds components that generation can produce from source.

## 13. Traceability model

A stable id per canonical component, e.g. `abox/<export-name>`, recorded in a Phase 50 traceability table holding source file, export name, phase/canonical decision reference, content hash where useful, and the Figma target (component set key once created). Production source is **not** modified to carry Figma metadata.

## 14. Library architecture and naming

Pages: `00 Foundations`, `01 Components`, `02 Patterns`, `03 Shells`, `04 Experiences`, `05 Screens`, `06 Documentation`. Naming conventions defined for pages, sections, collections, variables, text styles, effect styles, components, component sets, variants, properties, patterns and screens — all using production terminology (ABox export names, token names as declared in `styles.css`).

## 15. Exactness and validation model

Future implementation is measured against: geometry, spacing, typography, colour, radius, border, elevation, states, responsive behaviour at 1440/834/390, accessibility intent, shell boundaries, branding boundaries, ownership. Screenshots alone never establish parity. Pre-implementation baselines: production source fingerprints, canonical source inventory, Figma variable/component inventories, naming and property validation, traceability check, shell- and branding-boundary checks, and a no-production-mutation check.

## 16. Risks and limitations

No cloud Figma connector; desktop MCP is read-only, so write automation depends on a supported plugin/Make path. Figma cannot express several CSS treatments exactly (`noise-field`, `contour`, `aurora`, `glass`, `edge-sheen`, keyframe motion) — these are recorded as limitations, never used to justify changing production. Auth-gated screens cannot be runtime-captured.

## 17. Future implementation batches (not executed now)

Batch 0 library foundation · Batch 1 variables and foundations · Batch 2 canonical components · Batch 3 patterns and shell assets · Batch 4 representative screens · Batch 5 traceability · Batch 6 exactness and responsive validation · Batch 7 library governance and handoff. Each requires its own separately approved plan.

## 18. Must NOT be automated or moved into Figma

Runtime branding values and assets, Marketplace Asset Management, live data, business logic, routing, governance enforcement and E5/E6/E7 state, Lucie, M06, M08, AI-elements, shadcn/Radix internals as if ABox-owned, shell merging, route-local/business-coupled components as generic Figma components, the unused assistant component, the deferred one-off spacing values.

## 19. Expected changes and rollback

Documentation only: one Phase 50 blueprint block appended to `.lovable/manual-work-map.md`. No `src/` change, no Figma mutation. Rollback is deleting that block.

## 20. Success criteria

Production untouched; no Figma mutation; Phases 1–49 respected; every canonical source carries a clear Figma disposition; runtime concerns stay runtime-owned; three shells stay independent; no new production consolidation proposed; automation vs manual work explicitly separated; variables, components, patterns and screens clearly distinguished.
