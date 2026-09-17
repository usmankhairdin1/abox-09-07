/**
 * Reference-layer types.
 *
 * DOCUMENTATION ONLY. Nothing in `src/lib/design/*` defines a design value,
 * and nothing here may be imported by application screens or business logic.
 * Consumers: `/design-system` and `/design-guide` only.
 */

/** Where the decision actually lives and how widely it is shared. */
export type Ownership =
  | "foundation" // src/styles.css — global token
  | "primitive" // src/components/ui/* — shadcn primitive
  | "business" // src/components/abox/* — ABox component
  | "pattern" // recurring markup across routes, no single owner yet
  | "local"; // intentionally one-off in a single screen

/** Whether the entry describes what ships today or a future idea. */
export type Maturity = "current" | "opportunity";

export interface FoundationEntry {
  /** Token, utility class or convention name. */
  name: string;
  /** Actual value or implementation as it exists today. */
  value: string;
  /** Owning source file. */
  source: string;
  /** Known consumers, described in plain terms. */
  consumers: string;
  ownership: Ownership;
  /** True shared source of truth vs. a recurring convention vs. one-off. */
  shared: "source-of-truth" | "convention" | "one-off";
  maturity: Maturity;
  /** What must not be changed casually. */
  note?: string;
}

export interface FoundationCategory {
  id: string;
  title: string;
  summary: string;
  entries: FoundationEntry[];
}

export interface RelationshipEntry {
  /** The pair being measured, e.g. "Heading → supporting text". */
  pair: string;
  /** Observed implementation, verbatim from production code. */
  observed: string;
  /** Where it was observed. */
  source: string;
  /** Consistency as found — not normalized. */
  consistency: "consistent" | "varies";
  note?: string;
}

export interface RelationshipGroup {
  id: string;
  title: string;
  summary: string;
  entries: RelationshipEntry[];
}

export interface InventoryEntry {
  name: string;
  source: string;
  /** Number of distinct application files importing it (reference pages excluded). */
  consumers: number;
  ownership: Ownership;
  /** States or variants implemented today. */
  states: string;
  status: "in-use" | "available-unused" | "internal-only";
  note?: string;
}

export interface InventoryGroup {
  id: string;
  title: string;
  summary: string;
  entries: InventoryEntry[];
}

/* -----------------------------------------------------------------
 * Phase 2 — spacing & layout audit types.
 * Documentation only. No value below is consumed at runtime by the
 * application; `/design-system` and `/design-guide` are the only readers.
 * ----------------------------------------------------------------- */

/** How widely a spacing or layout value recurs across the codebase. */
export type Frequency = "recurring" | "occasional" | "one-off";

/** Consistency of a pattern exactly as found — never normalized. */
export type Consistency = "consistent" | "mostly-consistent" | "variable" | "one-off";

export interface SpacingEntry {
  /** Utility class or arbitrary value as written in production code. */
  value: string;
  /** Computed length for reference. */
  computed: string;
  /** Approximate occurrences across src/routes + src/components. */
  occurrences: number;
  /** What the value is used for. */
  purpose: string;
  /** Representative places it occurs. */
  where: string;
  frequency: Frequency;
  consistency: Consistency;
  /** Where the decision currently lives. */
  source: string;
  ownership: Ownership;
  /** Whether a future token could safely absorb it. */
  centralizable: "safe" | "conditional" | "unsafe";
  /** Visual risk if the value were ever changed. */
  risk: "low" | "medium" | "high";
  note?: string;
}

export interface SpacingGroup {
  id: string;
  title: string;
  summary: string;
  entries: SpacingEntry[];
}

export interface ContainerEntry {
  name: string;
  widthBehavior: string;
  maxWidth: string;
  gutters: string;
  alignment: string;
  responsive: string;
  consumers: string;
  source: string;
  shared: "shared" | "local";
  variations: string;
}

export interface ResponsivePattern {
  name: string;
  trigger: string;
  desktop: string;
  tablet: string;
  mobile: string;
  source: string;
  consumers: string;
  variations: string;
}

export interface DensityEntry {
  mode: string;
  context: string;
  controlHeight: string;
  padding: string;
  gap: string;
  typography: string;
  iconSize: string;
  source: string;
  note?: string;
}

export interface DimensionEntry {
  element: string;
  value: string;
  occurrences: string;
  source: string;
  ownership: Ownership;
  note?: string;
}

export interface LayoutPattern {
  name: string;
  purpose: string;
  anatomy: string;
  examples: string;
  responsive: string;
  spacing: string;
  shared: "shared" | "local";
  source: string;
  ownership: Ownership;
  maturity: Maturity;
  opportunity?: string;
}

/* -----------------------------------------------------------------
 * Phase 4 — iconography & asset audit types.
 * Documentation only. Consumed by `/design-system` and `/design-guide`.
 * ----------------------------------------------------------------- */

/** One icon as it is actually used, grouped under a semantic category. */
export interface IconEntry {
  /** Exported icon name as imported in production code. */
  name: string;
  /** Library or file it comes from. */
  library: string;
  /** What it means in this product. */
  role: string;
  /** Approximate import sites across src/routes + src/components. */
  usage: number;
  /** Representative consumers. */
  where: string;
  /** Most common rendered size. */
  size: string;
  /** Usual foreground treatment. */
  treatment: string;
  /** Whether the icon itself is an interaction target. */
  interactive: "interactive" | "static" | "both";
  /** Decorative (aria-hidden) vs. meaning-carrying (labelled). */
  semantics: "decorative" | "meaningful" | "both";
  /** Experiences it appears in. */
  experience: string;
  note?: string;
}

export interface IconCategory {
  id: string;
  title: string;
  summary: string;
  entries: IconEntry[];
}

/** A logo, brand mark, image or other visual asset. */
export interface AssetEntry {
  name: string;
  /** Asset kind — inline SVG component, binary file, runtime upload, etc. */
  kind: string;
  /** File, path or import as it exists today. */
  source: string;
  consumers: string;
  variants: string;
  dimensions: string;
  /** Alt / aria treatment as implemented. */
  accessibility: string;
  /** Which system owns changes to it. */
  owner: string;
  status: "in-use" | "available-unused" | "runtime-managed" | "possibly-unused";
  note?: string;
}

export interface AssetGroup {
  id: string;
  title: string;
  summary: string;
  entries: AssetEntry[];
}

/* -----------------------------------------------------------------
 * Phase 5 — component inventory audit types.
 * Documentation only. Consumed by `/design-system` and `/design-guide`.
 * ----------------------------------------------------------------- */

/** Primary taxonomy bucket. One category per component. */
export type ComponentCategory =
  | "foundation-primitive"
  | "form-control"
  | "action"
  | "display"
  | "container"
  | "data"
  | "navigation"
  | "overlay"
  | "feedback"
  | "commerce"
  | "brand"
  | "shell"
  | "pattern"
  | "specialized"
  | "reference-only";

/** What the thing actually is, structurally. */
export type ComponentKind =
  | "primitive"
  | "component"
  | "composition"
  | "wrapper"
  | "layout-helper"
  | "page-local"
  | "repeated-markup"
  | "pattern-candidate";

/** Which experience(s) consume it, derived from real consumers. */
export type ComponentScope =
  | "core-shared"
  | "multi-experience"
  | "web-marketing"
  | "shopping-marketplace"
  | "dashboard-admin"
  | "specialized-local"
  | "reference-only";

export interface ComponentEntry {
  name: string;
  source: string;
  category: ComponentCategory;
  kind: ComponentKind;
  layer: "production" | "reference";
  scope: ComponentScope;
  /** Approximate direct import sites, as measured. "n/a" when not reliably countable. */
  consumers: string;
  /** Representative consumers, indirect consumers noted explicitly. */
  consumerDetail: string;
  experience: string;
  dependencies: string;
  /** Major child components rendered inside it. */
  children: string;
  /** Descriptive maturity label — never a score. */
  maturity: string;
  status: "in-use" | "internal-only" | "installed-unused" | "possibly-unused" | "reference-only";
  note?: string;
}

export interface ComponentGroup {
  id: string;
  title: string;
  summary: string;
  entries: ComponentEntry[];
}

/** Actual anatomy of a component, as implemented. */
export interface AnatomyEntry {
  component: string;
  source: string;
  parts: string[];
  note?: string;
}

/** One variant/size/appearance property and its measured usage. */
export interface VariantEntry {
  component: string;
  property: string;
  values: string;
  used: string;
  unused: string;
  consumers: string;
  source: string;
  note?: string;
}

/** States a component actually implements and how each is expressed. */
export interface ComponentStateEntry {
  component: string;
  states: string;
  expression: string;
  /** Does the state alter rendered content, not just styling? */
  changesContent: string;
  changesIcon: string;
  accessibility: string;
  source: string;
  note?: string;
}
