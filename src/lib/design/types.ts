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
  /**
   * Consistency as found — not normalized. Phase 5 widened this to the shared
   * `Consistency` scale; the renderer still treats anything other than
   * "consistent" as varying, so no previously written row changes appearance.
   */
  consistency: Consistency | "varies";
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

/* -----------------------------------------------------------------
 * Phase 6 — architecture & normalization blueprint types.
 *
 * DOCUMENTATION ONLY. Phase 6 describes what a future canonical design
 * system SHOULD target. Nothing here describes an abstraction that exists
 * in production today unless the row is explicitly labelled
 * "CURRENT IMPLEMENTATION". Consumed by `/design-system` and
 * `/design-guide` only.
 * ----------------------------------------------------------------- */

/**
 * The controlled label vocabulary. Every Phase 6 row carries exactly one, so
 * a reader can never confuse what ships today with what is proposed.
 */
export type ArchLabel =
  | "CURRENT IMPLEMENTATION"
  | "OBSERVED VARIATION"
  | "OBSERVED DUPLICATE"
  | "OBSERVED OVERLAP"
  | "INSTALLED BUT UNUSED"
  | "POSSIBLY UNUSED"
  | "UNOWNED AREA"
  | "GOVERNANCE RULE"
  | "FUTURE CANONICAL TARGET"
  | "FUTURE OPPORTUNITY"
  | "FUTURE FIGMA ORGANIZATION"
  | "FUTURE MIGRATION"
  | "FUTURE DECISION";

/** Which completed audit phase supplies the evidence for a row. */
export type EvidencePhase =
  | "Phase 1 — foundations"
  | "Phase 2 — spacing, layout, responsive"
  | "Phase 3 — typography"
  | "Phase 4 — iconography & assets"
  | "Phase 5 — components, variants, states"
  | "Phase 6 — direct production read";

/** One level of the ABox Core architecture or of the component hierarchy. */
export interface ArchLayerEntry {
  id: string;
  /** Layer name, e.g. "Foundations" or "Compound component". */
  layer: string;
  /** Plain description of the level's responsibility. */
  responsibility: string;
  /** What belongs at this level, with production examples. */
  belongs: string;
  /** What explicitly does not belong here. */
  excludes: string;
  /** Where the level lives, or would live, in the codebase. */
  source: string;
  /** Allowed downward dependencies. */
  dependsOn: string;
  /** Who is allowed to consume this level. */
  consumedBy: string;
  phase: EvidencePhase;
  label: ArchLabel;
  note?: string;
}

/** A future canonical component candidate, mapped to its current evidence. */
export interface CanonicalComponentEntry {
  /** Proposed future canonical name. Does NOT exist in production. */
  canonical: string;
  /** Current implementation name as written in code today. */
  currentName: string;
  currentSource: string;
  taxonomy: ComponentCategory;
  /** ABox Core or experience-scoped in the future system. */
  tier: "ABox Core" | "Experience-specific";
  classification:
    "primitive" | "component" | "compound component" | "pattern" | "experience pattern";
  /** Measured direct import sites today. */
  consumers: string;
  /** Direct vs indirect reach, as measured. */
  usage: string;
  variants: string;
  sizes: string;
  states: string;
  anatomy: string;
  responsive: string;
  dependencies: string;
  relationships: string;
  related: string;
  duplication: string;
  accessibility: string;
  typography: string;
  spacing: string;
  iconography: string;
  tokens: string;
  /** What normalization, if any, a future phase would target. */
  normalization: string;
  migration: string;
  figma: string;
  label: ArchLabel;
  phase: EvidencePhase;
}

/** One observable criterion in the component-vs-pattern framework. */
export interface ClassificationCriterion {
  criterion: string;
  question: string;
  /** How the criterion is judged, in observable terms. */
  test: string;
  /** Which levels the criterion pushes towards when satisfied. */
  indicates: string;
  /** A production example that demonstrates the criterion. */
  example: string;
  phase: EvidencePhase;
}

/**
 * A blueprint row. `current` is evidence; `future` is a proposal.
 * The two are never merged into one sentence.
 */
export interface BlueprintRow {
  item: string;
  source: string;
  /** CURRENT IMPLEMENTATION — what production does today. */
  current: string;
  /** FUTURE CANONICAL TARGET — what a future system should target. */
  future: string;
  label: ArchLabel;
  phase: EvidencePhase;
  note?: string;
}

export interface BlueprintGroup {
  id: string;
  title: string;
  summary: string;
  rows: BlueprintRow[];
}

/** A single edge in the architecture relationship map. */
export interface ArchRelationshipEntry {
  from: string;
  /** Edge kind, e.g. "contains", "uses primitive", "depends on token". */
  relation: string;
  to: string;
  /** Whether the edge exists today or is proposed. */
  nature: "current" | "future";
  evidence: string;
  label: ArchLabel;
  note?: string;
}

/** A duplicate or overlap area, recorded without choosing a winner. */
export interface OverlapArea {
  area: string;
  implementations: string;
  evidence: string;
  consumers: string;
  differences: string;
  risks: string;
  /** The decision a future phase must make — deliberately left open. */
  decision: string;
  /** Sequence of steps that would precede any decision. */
  sequence: string;
  label: ArchLabel;
  phase: EvidencePhase;
}

/** A route-local kit, described as architecture rather than as a defect. */
export interface RouteKitEntry {
  kit: string;
  source: string;
  purpose: string;
  consumers: string;
  reusableScope: string;
  experienceScope: string;
  dependencies: string;
  overlap: string;
  classification: string;
  migration: string;
  label: ArchLabel;
}

/** One of the three shell families. */
export interface ShellArchEntry {
  shell: string;
  source: string;
  purpose: string;
  responsibility: string;
  routes: string;
  dependencies: string;
  navigation: string;
  responsive: string;
  branding: string;
  coreRelationship: string;
  figma: string;
  label: ArchLabel;
}

/** A naming convention rule for a future canonical system. */
export interface NamingRule {
  subject: string;
  convention: string;
  example: string;
  /** How the rule sits against the current codebase. */
  codebaseFit: string;
  figmaFit: string;
  label: ArchLabel;
  note?: string;
}

/** One section of the proposed future Figma library. */
export interface FigmaSectionEntry {
  section: string;
  purpose: string;
  belongs: string;
  excludes: string;
  source: string;
  mapping: string;
  governanceOwner: string;
  migration: string;
  label: ArchLabel;
}

/** A token/style to Figma variable mapping, including its limits. */
export interface FigmaVariableMapping {
  source: string;
  figma: string;
  kind: string;
  mapping: string;
  /** Where a one-to-one mapping does not hold, stated plainly. */
  limitation: string;
  label: ArchLabel;
}

/** One phase of the proposed migration roadmap. */
export interface MigrationPhaseEntry {
  phase: string;
  title: string;
  goal: string;
  prerequisites: string;
  affected: string;
  risk: "low" | "medium" | "high";
  validation: string;
  rollback: string;
  visualDiff: string;
  label: ArchLabel;
}

/* -----------------------------------------------------------------
 * Phase 7 — foundation source-of-truth & Figma variable specification.
 * Documentation only. Nothing below defines a runtime design value, and
 * nothing below may be imported by application screens or business logic.
 * Consumers: `/design-system` and `/design-guide` only.
 * ----------------------------------------------------------------- */

/** How a foundation value is expressed in the codebase today. */
export type FoundationKind =
  "primitive" | "semantic" | "alias" | "utility" | "call-site literal" | "convention";

/** Descriptive centralization classification. Never a score or a rank. */
export type CentralizationLevel =
  "CENTRALIZED" | "PARTIALLY CENTRALIZED" | "CALL-SITE BASED" | "UNOWNED";

/** One foundation token or value, with current evidence and future target kept apart. */
export interface TokenSpec {
  /** Name exactly as written in production, or the utility/class observed. */
  token: string;
  /** Light-mode or single value, verbatim. */
  value: string;
  /** Dark-mode value where `.dark` redefines it. */
  darkValue?: string;
  /** Whether light and dark differ. */
  modes: "same" | "different" | "not themed";
  kind: FoundationKind;
  purpose: string;
  /** Known consumers in plain terms. */
  consumers: string;
  /** Measured usage, e.g. "229 class occurrences". */
  usage: string;
  /** Paired foreground token where one exists. */
  foreground?: string;
  /** Contrast / accessibility observation — never a correction. */
  contrast?: string;
  source: string;
  /** CURRENT IMPLEMENTATION or the observed-variation family. */
  status: ArchLabel;
  /** FUTURE CANONICAL TARGET role. Not production. */
  futureRole: string;
  /** Figma variable or style candidate. Nothing exists yet. */
  figma: string;
  migration: string;
  phase: EvidencePhase;
  note?: string;
}

export interface TokenSpecGroup {
  id: string;
  title: string;
  summary: string;
  tokens: TokenSpec[];
}

/** primitive → semantic → component role → experience usage. */
export interface RoleChainEntry {
  primitive: string;
  semantic: string;
  componentRole: string;
  experience: string;
  evidence: string;
  label: ArchLabel;
  note?: string;
}

/** Future foundation-consumption map for one canonical component candidate. */
export interface ComponentRoleSpec {
  component: string;
  source: string;
  roles: { slot: string; foundation: string; current: string }[];
  label: ArchLabel;
  note?: string;
}

/** Foundation-level accessibility governance record. */
export interface FoundationA11yRecord {
  topic: string;
  /** What production does today. */
  current: string;
  /** What a future canonical system would require. */
  requirement: string;
  consumers: string;
  status: ArchLabel;
  note?: string;
}

/** Descriptive maturity record. No scoring, no ranking. */
export interface FoundationMaturityRecord {
  category: string;
  implementation: string;
  evidence: string;
  centralization: CentralizationLevel;
  variation: string;
  ownership: string;
  futureTarget: string;
  readiness: string;
  openDecision: string;
}
