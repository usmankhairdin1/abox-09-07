/**
 * Phase 7 — foundation source-of-truth model.
 *
 * DOCUMENTATION ONLY. Consumed by `/design-system` and `/design-guide`.
 * No application screen, component or business rule may import this file.
 */
import type { ArchLayerEntry, BlueprintRow } from "./types";

/** The dependency model a future canonical foundation would follow. */
export const FOUNDATION_MODEL: ArchLayerEntry[] = [
  {
    id: "fm-primitive",
    layer: "Primitive tokens",
    responsibility: "Raw values with no product meaning attached.",
    belongs:
      "Colour values such as oklch(0.31 0.090 265), radius steps 6/10/14/18/22/28/36px, the Tailwind spacing ladder, font families.",
    excludes: "Anything that names a use, such as `card`, `input` or `danger`.",
    source: "src/styles.css @theme inline and :root",
    dependsOn: "Nothing.",
    consumedBy: "Semantic tokens only.",
    phase: "Phase 1 — foundations",
    label: "FUTURE CANONICAL TARGET",
    note: "Production does not separate this level today: :root declares semantic names holding raw values directly.",
  },
  {
    id: "fm-semantic",
    layer: "Semantic tokens",
    responsibility: "Name the use, not the value.",
    belongs:
      "--background, --card, --primary, --muted-foreground, --border, --ring, --destructive, --warning, --info, --success, --sidebar-*.",
    excludes: "Component-specific decisions such as a button's height.",
    source: "src/styles.css :root and .dark",
    dependsOn: "Primitive tokens.",
    consumedBy: "Component semantic roles and Tailwind colour utilities.",
    phase: "Phase 1 — foundations",
    label: "CURRENT IMPLEMENTATION",
    note: "This level exists today and is the strongest part of the current system.",
  },
  {
    id: "fm-component-role",
    layer: "Component semantic roles",
    responsibility: "Bind a component slot to a semantic token.",
    belongs:
      "Button surface/foreground/border/ring, input surface/border/placeholder, card surface/border/elevation, badge tone/foreground.",
    excludes: "Screen layout and content decisions.",
    source: "src/components/ui/* and src/components/abox/*",
    dependsOn: "Semantic tokens.",
    consumedBy: "Patterns and screens.",
    phase: "Phase 5 — components, variants, states",
    label: "OBSERVED VARIATION",
    note: "Bindings exist inside each component's class strings; they are not named or shared as roles.",
  },
  {
    id: "fm-pattern",
    layer: "Pattern / experience usage",
    responsibility: "Recurring compositions and how each experience applies the same foundation.",
    belongs:
      "Results toolbar, filter rail, KPI row, form field grouping, marketplace shell, internal shell, member shell.",
    excludes: "New token values invented per experience.",
    source: "src/components/abox/*, src/routes/*",
    dependsOn: "Component semantic roles.",
    consumedBy: "Screens.",
    phase: "Phase 2 — spacing, layout, responsive",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    id: "fm-screen",
    layer: "Screen",
    responsibility: "Compose patterns for one route.",
    belongs: "Route files under src/routes.",
    excludes: "Defining foundation values.",
    source: "src/routes/*",
    dependsOn: "Patterns, components, semantic tokens.",
    consumedBy: "Nothing — screens are the leaf.",
    phase: "Phase 6 — direct production read",
    label: "OBSERVED VARIATION",
    note: "Some screens still write literal values (arbitrary widths, opacity suffixes) that bypass the chain.",
  },
];

/** Honest description of the mixed state production is actually in. */
export const FOUNDATION_CURRENT_STATE: BlueprintRow[] = [
  {
    item: "Centralised variables",
    source: "src/styles.css",
    current:
      "Colour, radius, shadow, font family and sidebar tokens are declared once as CSS custom properties and themed for light and dark.",
    future:
      "Same variables, split into a primitive layer and a semantic layer so that a value change and a meaning change are separate acts.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Compatibility aliases",
    source: "src/styles.css target-app compatibility layer",
    current:
      "--brand-accent, --surface-1, --surface-2, --surface-3 and --shadow-overlay re-point older governance surfaces at current tokens. --ai / --ai-foreground add an assistant tone.",
    future:
      "Aliases carry an owner, a reason and a migration intent; none is removed in this phase.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
    note: "Aliases stay. Removing one would change governance surfaces that depend on it.",
  },
  {
    item: "Custom utilities",
    source: "src/styles.css @utility blocks",
    current:
      "text-display, text-eyebrow, text-serial, glass, noise-field, contour, aurora, card-brackets, edge-sheen, ember-underline, ring-pill, divider-warm carry composite decisions that are not expressible as a single token.",
    future:
      "Utilities stay as composite recipes; each maps to a Figma text or effect style rather than to a variable.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 3 — typography",
  },
  {
    item: "Call-site literals",
    source: "src/routes/*, src/components/*",
    current:
      "Spacing, control heights, icon sizes, opacity suffixes and some widths are written as Tailwind utilities or arbitrary values at the point of use, with no intermediate token.",
    future:
      "An evidence-derived scale names the recurring values; migration is a separate, approved phase.",
    label: "OBSERVED VARIATION",
    phase: "Phase 2 — spacing, layout, responsive",
    note: "This is the single largest gap between the current state and the future model.",
  },
  {
    item: "Claim boundary",
    source: "Phase 7",
    current:
      "The application is not driven by the Phase 7 model. It is driven by src/styles.css plus utilities plus literals.",
    future:
      "The Phase 7 specification becomes the source of truth for the target only once a migration phase is approved and executed.",
    label: "GOVERNANCE RULE",
    phase: "Phase 6 — direct production read",
  },
];
