/**
 * Phase 8 — ABox Core canonical component specification types.
 *
 * DOCUMENTATION ONLY. Nothing here is imported by application screens or
 * business logic. Consumers: `/design-system` and `/design-guide`.
 *
 * Read every specification as TWO separate statements:
 *   `currentImplementation` / `observedVariations`  = CURRENT IMPLEMENTATION
 *   `futureCanonicalTarget` / `figmaMapping` / …    = FUTURE CANONICAL TARGET
 *
 * A future canonical target is a PROPOSAL. No production component has been
 * created, renamed, aliased, moved, merged or migrated in this phase.
 */

/** Controlled vocabulary carried forward from Phase 7. */
export type SpecLabel =
  | "CURRENT IMPLEMENTATION"
  | "OBSERVED VARIATION"
  | "OBSERVED OVERLAP"
  | "OBSERVED DUPLICATE"
  | "INSTALLED BUT UNUSED"
  | "POSSIBLY UNUSED"
  | "UNOWNED AREA"
  | "GOVERNANCE RULE"
  | "FUTURE CANONICAL TARGET"
  | "FUTURE OPPORTUNITY"
  | "FUTURE FIGMA ORGANIZATION"
  | "FUTURE MIGRATION"
  | "FUTURE DECISION";

export type SpecCategory =
  | "actions"
  | "forms"
  | "display"
  | "containers"
  | "data"
  | "navigation"
  | "overlays"
  | "feedback"
  | "brand"
  | "commerce"
  | "shell";

/** Descriptive maturity — never a score, never a ranking. */
export type SpecGovernanceStatus =
  | "documented current component"
  | "documented current variation"
  | "future canonical target"
  | "future opportunity"
  | "future decision"
  | "migration candidate"
  | "experience-specific extension";

/** How a property should be expressed, in code and in Figma. */
export type PropertyClass =
  | "content"
  | "behavioral"
  | "visual-variant"
  | "size"
  | "density"
  | "state"
  | "icon"
  | "responsive"
  | "accessibility"
  | "experience";

export type VariantKind = "semantic" | "visual" | "size" | "density" | "structural";

export type FigmaPropertyKind =
  | "component-property"
  | "variant-property"
  | "boolean-property"
  | "instance-swap"
  | "text-property"
  | "variable"
  | "mode"
  | "style"
  | "code-only";

export interface AnatomyPart {
  /** Controlled anatomy vocabulary term. */
  part: string;
  requirement: "required" | "optional" | "conditional";
  role: string;
  note?: string;
}

export interface SpecProperty {
  name: string;
  propertyClass: PropertyClass;
  values: string;
  defaultValue?: string;
  figma: FigmaPropertyKind;
  label: SpecLabel;
  note?: string;
}

export interface SpecVariant {
  kind: VariantKind;
  name: string;
  values: string;
  label: SpecLabel;
  note?: string;
}

export interface SpecState {
  state: string;
  affects: string;
  accessibility: string;
  label: SpecLabel;
  note?: string;
}

export interface SpecImplementationRef {
  file: string;
  exportName: string;
  /** Consumer count as measured in Phase 5, or a plain description. */
  consumers: string;
  note?: string;
}

export interface SpecDependencies {
  typography: string;
  spacing: string;
  color: string;
  shape: string;
  icon: string;
}

export interface SpecComposition {
  allowedChildren: string;
  prohibited: string;
  parentPatterns: string;
}

export interface CanonicalComponentSpec {
  name: string;
  category: SpecCategory;
  purpose: string;
  anatomy: AnatomyPart[];
  contentModel: string[];
  properties: SpecProperty[];
  variants: SpecVariant[];
  states: SpecState[];
  sizes: string;
  density: string;
  dependencies: SpecDependencies;
  responsive: string;
  accessibility: string;
  interaction: string;
  composition: SpecComposition;
  experienceExtensions: string;
  currentImplementation: SpecImplementationRef[];
  observedVariations: string[];
  futureCanonicalTarget: string;
  figmaMapping: string;
  migrationNotes: string;
  governanceStatus: SpecGovernanceStatus;
  label: SpecLabel;
}

export interface SpecCategoryGroup {
  id: string;
  category: SpecCategory;
  title: string;
  summary: string;
  specs: CanonicalComponentSpec[];
}

/** Generic labelled reference row used by the supporting Phase 8 modules. */
export interface SpecRule {
  topic: string;
  current: string;
  future: string;
  label: SpecLabel;
  note?: string;
}

export interface DuplicateRegisterEntry {
  area: string;
  /** Parallel implementations recorded side by side. No ordering is implied. */
  implementations: { name: string; source: string; scope: string }[];
  overlap: string;
  future: string;
  label: SpecLabel;
}

export interface DependencyChainEntry {
  component: string;
  foundation: string;
  semanticRole: string;
  componentRole: string;
  compound: string;
  pattern: string;
  experiencePattern: string;
  screen: string;
  label: SpecLabel;
}
