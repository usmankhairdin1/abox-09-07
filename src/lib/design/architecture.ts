/**
 * Phase 6 — ABox Core architecture model.
 *
 * DOCUMENTATION ONLY. This module describes the layer model a future canonical
 * ABox Design System should target, and the dependency direction between those
 * layers. It does not define, create, replace or alias any production
 * abstraction. Nothing here is imported by an application screen.
 *
 * There is exactly ONE system: ABox Core. Web/Marketing, Shopping/Commerce and
 * Dashboard/Admin are guidance on how to USE Core — never parallel systems.
 *
 * Consumers: /design-system, /design-guide.
 */
import type { ArchLayerEntry } from "./types";

/** The four top-level pillars of ABox Core. */
export const CORE_ARCHITECTURE: ArchLayerEntry[] = [
  {
    id: "core-foundations",
    layer: "ABox Core · Foundations",
    responsibility:
      "The indivisible decisions everything else is built from: colour, type, space, radius, elevation, motion, iconography and accessibility baselines.",
    belongs:
      "CSS custom properties in src/styles.css (surfaces, foregrounds, borders, brand, status tones, metal tiers, chart colours), the type ramp, the spacing scale, radius and shadow tokens, breakpoints, the lucide icon set and the reduced-motion baseline.",
    excludes:
      "Anything that renders markup. A foundation is a value or a rule, never a component. Screen-specific overrides never belong here.",
    source: "src/styles.css — audited in Phase 1, 2, 3 and 4",
    dependsOn: "Nothing. Foundations are the bottom of the stack.",
    consumedBy: "Primitives, components, compound components, patterns and screens.",
    phase: "Phase 1 — foundations",
    label: "CURRENT IMPLEMENTATION",
    note: "Foundations already exist and are already the real source of truth. Phase 6 adds no new token.",
  },
  {
    id: "core-components",
    layer: "ABox Core · Components",
    responsibility:
      "Reusable rendering units with a stable API, owned centrally and shared across experiences.",
    belongs:
      "The shadcn primitives in src/components/ui/* and the shared business components in src/components/abox/*, organized into Actions, Forms, Display, Containers, Data, Navigation, Overlays, Feedback, Brand, Commerce and Shell.",
    excludes:
      "Screen composition, data fetching, route knowledge, and anything that only makes sense inside one route.",
    source: "src/components/ui/*, src/components/abox/* — inventoried in Phase 5",
    dependsOn: "Foundations only.",
    consumedBy: "Compound components, patterns, experience patterns and screens.",
    phase: "Phase 5 — components, variants, states",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    id: "core-patterns",
    layer: "ABox Core · Patterns",
    responsibility:
      "Repeated arrangements of components that solve a recurring product problem: a page frame, a results toolbar, a filter rail, an empty state, a KPI row.",
    belongs:
      "Page structure, page header, section structure, forms, search, filters, results, tables and data, navigation, dialog and drawer workflows, marketplace and commerce, plans and pricing, cart, empty and loading states, dashboard and KPI, responsive layouts.",
    excludes:
      "One-off route markup that has never been repeated, and any pattern that would require its own token set.",
    source:
      "Some patterns already have a component owner (PageHeader, EmptyState, DataTable); others live as repeated route markup with no owner.",
    dependsOn: "Components and Foundations.",
    consumedBy: "Experience patterns and screens.",
    phase: "Phase 5 — components, variants, states",
    label: "FUTURE CANONICAL TARGET",
    note: "Several patterns are UNOWNED AREAs today — card surface, form field, results toolbar, loading. Phase 6 records them; it does not create owners.",
  },
  {
    id: "core-experience",
    layer: "ABox Core · Experience guidance",
    responsibility:
      "Contextual rules for how the same shared components should be applied in a given part of the product.",
    belongs:
      "Web/Marketing, Shopping/Commerce, Dashboard/Admin and Future experiences — density choices, hierarchy choices, content tone, which patterns are appropriate where.",
    excludes:
      "New components. A component must never fork merely because it appears in a different experience.",
    source: "Derived from measured consumers across src/routes/*",
    dependsOn: "Patterns, Components and Foundations.",
    consumedBy: "Screens.",
    phase: "Phase 5 — components, variants, states",
    label: "GOVERNANCE RULE",
  },
];

/**
 * The seven-level hierarchy a future canonical system should use, with the
 * allowed dependency direction. Dependencies flow downward only.
 */
export const COMPONENT_HIERARCHY: ArchLayerEntry[] = [
  {
    id: "h-foundation",
    layer: "1 · Foundation",
    responsibility: "A raw design decision expressed as a value or a global rule.",
    belongs:
      "--background, --primary, --sage, --warning, --destructive, --info, the metal tier tokens, --radius, shadow tokens, the type ramp, the spacing scale, the reduced-motion rule.",
    excludes: "Markup, behaviour, state.",
    source: "src/styles.css",
    dependsOn: "Nothing.",
    consumedBy: "Every level above.",
    phase: "Phase 1 — foundations",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    id: "h-primitive",
    layer: "2 · Primitive",
    responsibility:
      "A single interactive or structural element that owns focus, keyboard and disabled behaviour.",
    belongs: "Button, Input, Label, Select, Checkbox, Dialog, Sheet, Tooltip, Skeleton, Spinner.",
    excludes: "Product vocabulary. A primitive knows nothing about plans, agencies or carriers.",
    source: "src/components/ui/* — 49 files, 29 with production consumers",
    dependsOn: "Foundations.",
    consumedBy: "Components and above.",
    phase: "Phase 5 — components, variants, states",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    id: "h-component",
    layer: "3 · Component",
    responsibility: "A product-aware reusable unit with a stable, documented API.",
    belongs: "StatusBadge, MetalBadge, CarrierMark, EmptyState, KpiCard, ModuleTabs, Logo.",
    excludes: "Page layout, navigation structure, data loading.",
    source: "src/components/abox/*",
    dependsOn: "Primitives and Foundations.",
    consumedBy: "Compound components, patterns, screens.",
    phase: "Phase 5 — components, variants, states",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    id: "h-compound",
    layer: "4 · Compound component",
    responsibility:
      "A unit that composes several components and owns the relationship between them.",
    belongs: "PageHeader, DataTable, PlanCard, DownlineWizardStepper, QuoteEditPanel.",
    excludes: "Route awareness beyond the props it is given.",
    source: "src/components/abox/*",
    dependsOn: "Components, Primitives, Foundations.",
    consumedBy: "Patterns, experience patterns, screens.",
    phase: "Phase 5 — components, variants, states",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    id: "h-pattern",
    layer: "5 · Pattern",
    responsibility:
      "A repeated composition solving a recurring problem, independent of any one experience.",
    belongs:
      "Page frame, page title block, action pill row, surface card, section heading, empty state, loading state, wizard.",
    excludes: "Anything used exactly once.",
    source:
      "Partly owned (PageHeader, EmptyState, ACTION_PILL); partly unowned repeated route markup.",
    dependsOn: "Compound components and below.",
    consumedBy: "Experience patterns and screens.",
    phase: "Phase 5 — components, variants, states",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    id: "h-experience-pattern",
    layer: "6 · Experience pattern",
    responsibility:
      "A pattern specialised for one part of the product, still built from shared components.",
    belongs:
      "Plan results filter rail, results toolbar, cart summary, marketplace landing hero, KPI dashboard row, agency roster workspace.",
    excludes:
      "A forked copy of a shared component. Specialisation is composition and props, never a duplicate.",
    source: "src/routes/plans.index.tsx, src/routes/cart.tsx, src/routes/index.tsx, agency routes",
    dependsOn: "Patterns and below.",
    consumedBy: "Screens.",
    phase: "Phase 5 — components, variants, states",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    id: "h-screen",
    layer: "7 · Screen",
    responsibility: "A route. Composes everything below it and owns data and permissions.",
    belongs: "Every file in src/routes/*.",
    excludes:
      "New design values. A screen must not invent a colour, a type size or a spacing rule that the layers below do not already provide.",
    source: "src/routes/* — 123 routes covered by the three shells",
    dependsOn: "Every level below.",
    consumedBy: "Nothing. Screens are the top of the stack.",
    phase: "Phase 5 — components, variants, states",
    label: "CURRENT IMPLEMENTATION",
  },
];

/** Dependency direction rules. Stated as governance, not enforced in code. */
export const DEPENDENCY_RULES: string[] = [
  "GOVERNANCE RULE — Dependencies flow downward only: screens may consume every level below them; foundations may consume nothing.",
  "GOVERNANCE RULE — A foundation must never depend on a component, a pattern or a screen. A token that only makes sense on one screen is not a token.",
  "GOVERNANCE RULE — A primitive must never import a business component. Button must not know what a plan is.",
  "GOVERNANCE RULE — A component may consume primitives and foundations; it may not consume a pattern or a screen.",
  "GOVERNANCE RULE — A pattern may consume components; two patterns must not consume each other, which is how circular dependencies start.",
  "GOVERNANCE RULE — An experience pattern may consume shared patterns and components; it must not be imported back into ABox Core.",
  "GOVERNANCE RULE — Route-local kits may consume Core; Core must never import from a route-local kit.",
  "GOVERNANCE RULE — The reference layer (src/lib/design/*, src/components/design/*, /design-system, /design-guide) may read from everything and must be imported by nothing.",
  "CURRENT IMPLEMENTATION — The production graph already respects downward flow: no ui/* primitive imports an abox/* component, and no abox/* component imports a route.",
  "OBSERVED OVERLAP — Route-local kits (M06, M08, Lucie, Lucie-app) re-implement pattern-level concerns rather than consuming Core patterns. Recorded, not changed.",
];

/** How each Phase 6 section traces back to earlier audit evidence. */
export const CROSS_PHASE_TRACEABILITY = [
  {
    phase: "Phase 1 — Foundations",
    feeds: "Foundations layer, token → component dependency model, Figma variable mapping",
    artifacts: "src/lib/design/foundation.ts, relationships.ts, inventory.ts",
  },
  {
    phase: "Phase 2 — Spacing, layout, responsive",
    feeds: "Responsive blueprint, density blueprint, container and grid architecture",
    artifacts: "src/lib/design/spacing.ts, layout.ts, spatial-relationships.ts",
  },
  {
    phase: "Phase 3 — Typography",
    feeds: "Typography foundations, semantic type roles, naming conventions, Figma text styles",
    artifacts: "src/lib/design/typography.ts, typography-behavior.ts",
  },
  {
    phase: "Phase 4 — Iconography & assets",
    feeds: "Icon foundations, asset architecture, brand architecture, Figma asset mapping",
    artifacts: "src/lib/design/iconography.ts, iconography-behavior.ts, assets.ts",
  },
  {
    phase: "Phase 5 — Components, variants, states",
    feeds:
      "Canonical component map, anatomy, variant, state and accessibility blueprints, duplicate map, route-local kits, shell architecture",
    artifacts:
      "src/lib/design/components.ts, component-variants.ts, component-states.ts, component-relationships.ts",
  },
  {
    phase: "Phase 6 — Direct production read",
    feeds:
      "Dependency direction, hierarchy placement, shell route coverage and anything inspected rather than inferred",
    artifacts: "src/styles.css, src/components/ui/*, src/components/abox/*, src/routes/*",
  },
] as const;
