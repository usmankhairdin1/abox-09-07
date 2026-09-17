/**
 * Phase 10 — pattern specification types.
 *
 * DOCUMENTATION ONLY. Nothing here is imported by application screens or
 * business logic. Consumers: `/design-system` and `/design-guide`.
 *
 * These types are additive. Ownership, status labels and node ids are reused
 * from the Phase 8 specification and the Phase 9 dependency graph so the
 * pattern layer never becomes a second source of truth. A pattern id here is
 * always the same id the Phase 9 graph uses (`pat.*`), and an experience id is
 * always the Phase 9 experience id (`exp.*`).
 */
import type { SpecLabel } from "./component-spec-types";
import type { Ownership } from "./types";

export type { SpecLabel };

/** Broad grouping used only to organise the reference pages. */
export type PatternCategory =
  | "page-structure"
  | "data-presentation"
  | "selection-and-filtering"
  | "commerce"
  | "input"
  | "feedback"
  | "navigation"
  | "conversation";

/** One named slot inside a pattern. */
export interface PatternAnatomyPart {
  part: string;
  /** Component or markup that fills the slot today. */
  filledBy: string;
  required: boolean;
  /** File or route the slot was read from. */
  evidence: string;
  status: SpecLabel;
  note?: string;
}

export interface PatternAnatomyRecord {
  patternId: string;
  name: string;
  parts: PatternAnatomyPart[];
  /** Order the parts appear in, top to bottom, as the code renders them. */
  order: string;
  status: SpecLabel;
}

/** A structural difference that really exists between two uses of one pattern. */
export interface PatternVariantRecord {
  patternId: string;
  variant: string;
  difference: string;
  seenIn: string;
  /** Explicitly no winner: this field records why both are kept. */
  keptBecause: string;
  status: SpecLabel;
}

export interface PatternStateRecord {
  patternId: string;
  state:
    | "default"
    | "hover"
    | "focus"
    | "active"
    | "selected"
    | "disabled"
    | "loading"
    | "empty"
    | "error"
    | "success"
    | "warning"
    | "collapsed";
  behavior: string;
  evidence: string;
  status: SpecLabel;
}

export interface PatternResponsiveRecord {
  patternId: string;
  breakpoint: string;
  structuralChange: string;
  desktop: string;
  tablet: string;
  mobile: string;
  reorders: boolean;
  controlsCollapse: boolean;
  columnsStack: boolean;
  densityChanges: boolean;
  evidence: string;
  status: SpecLabel;
}

export interface PatternDensityRecord {
  patternId: string;
  mode: string;
  controlHeight: string;
  padding: string;
  gap: string;
  typography: string;
  iconSize: string;
  evidence: string;
  status: SpecLabel;
}

/** The full record for one pattern. Detail lives in the sibling modules. */
export interface PatternSpec {
  /** Same id as the Phase 9 graph node. */
  id: string;
  name: string;
  category: PatternCategory;
  purpose: string;
  /** Problem it solves once, on a screen. */
  problem: string;
  contentModel: string[];
  interaction: string;
  accessibility: string;
  ownership: Ownership | "runtime" | "none";
  /** Real file or route evidence. */
  evidence: string;
  experiences: string[];
  screens: string[];
  status: SpecLabel;
  futureTarget?: string;
  migrationNote?: string;
  note?: string;
}

export interface ExperiencePatternSpec {
  /** Phase 9 experience id. */
  experienceId: string;
  patternId: string;
  purpose: string;
  composition: string;
  variations: string[];
  responsive: string;
  screens: string[];
  ownership: string;
  status: SpecLabel;
  note?: string;
}

export interface ExperienceExtensionRecord {
  corePattern: string;
  experienceA: string;
  behaviorA: string;
  experienceB: string;
  behaviorB: string;
  /** Whether the code shows a real split or only a local difference. */
  classification: "extension" | "observed variation" | "separate system";
  evidence: string;
  status: SpecLabel;
}

export interface ScreenPatternTrace {
  route: string;
  screenId: string;
  experienceId: string;
  patternIds: string[];
  /** Assembled from the Phase 9 graph rather than restated by hand. */
  compounds: string[];
  components: string[];
  roles: string[];
  foundations: string[];
  status: SpecLabel;
}

export interface PatternDuplicateRecord {
  concept: string;
  implementations: { name: string; source: string; consumers: string }[];
  differences: string;
  ownership: string;
  resolution: "observed" | "unresolved";
  status: SpecLabel;
  note?: string;
}

export interface PatternGovernanceRule {
  question: string;
  rule: string;
  status: SpecLabel;
}

export interface PatternFigmaMapping {
  patternId: string;
  figmaStructure: string;
  variantProperties: string[];
  stateProperties: string[];
  responsiveVariants: string;
  densityVariants: string;
  contentModel: string;
  componentProperties: string[];
  status: SpecLabel;
}
