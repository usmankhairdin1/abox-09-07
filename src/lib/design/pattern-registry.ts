/**
 * Phase 10 — pattern registry.
 *
 * DOCUMENTATION ONLY. Single assembly point for the pattern layer. It joins
 * the Phase 10 modules to the Phase 8 component specification and the Phase 9
 * dependency graph by id. It deliberately declares no components, screens,
 * foundations or edges of its own.
 */
import { PATTERN_SPECS, PATTERN_ANATOMY } from "./pattern-anatomy";
import { PATTERN_VARIANTS } from "./pattern-variants";
import { PATTERN_STATES } from "./pattern-states";
import { PATTERN_RESPONSIVE } from "./pattern-responsive";
import { PATTERN_DENSITY } from "./pattern-density";
import { PATTERN_COMPOSITION } from "./pattern-composition";
import { PATTERN_FIGMA_MAPPINGS } from "./pattern-figma";
import { PATTERN_DUPLICATES } from "./pattern-duplicates";
import { EXPERIENCE_PATTERNS } from "./experience-patterns";
import { SCREEN_PATTERN_MAP } from "./screen-pattern-map";
import { PATTERN_NODES } from "./graph-patterns";
import { nodeName } from "./graph-registry";
import type { PatternSpec } from "./pattern-spec-types";

export { PATTERN_SPECS };

/** Everything known about one pattern, gathered from the sibling modules. */
export function patternDossier(id: string) {
  return {
    spec: PATTERN_SPECS.find((p) => p.id === id),
    graphNode: PATTERN_NODES.find((n) => n.id === id),
    anatomy: PATTERN_ANATOMY.find((a) => a.patternId === id),
    variants: PATTERN_VARIANTS.filter((v) => v.patternId === id),
    states: PATTERN_STATES.filter((s) => s.patternId === id),
    responsive: PATTERN_RESPONSIVE.filter((r) => r.patternId === id),
    density: PATTERN_DENSITY.filter((d) => d.patternId === id),
    composition: PATTERN_COMPOSITION.filter((c) => c.patternId === id),
    experiences: EXPERIENCE_PATTERNS.filter((e) => e.patternId === id),
    figma: PATTERN_FIGMA_MAPPINGS.find((f) => f.patternId === id),
  };
}

export const PATTERN_DOSSIERS = PATTERN_SPECS.map((p) => patternDossier(p.id));

/** Patterns grouped for the reference page, in taxonomy order. */
export const PATTERN_TAXONOMY: { category: PatternSpec["category"]; title: string; patterns: PatternSpec[] }[] = [
  { category: "page-structure", title: "Page structure" },
  { category: "selection-and-filtering", title: "Selection and filtering" },
  { category: "data-presentation", title: "Data presentation" },
  { category: "commerce", title: "Commerce" },
  { category: "input", title: "Input" },
  { category: "feedback", title: "Feedback" },
  { category: "navigation", title: "Navigation" },
  { category: "conversation", title: "Conversation" },
].map((g) => ({ ...g, patterns: PATTERN_SPECS.filter((p) => p.category === g.category) })) as {
  category: PatternSpec["category"];
  title: string;
  patterns: PatternSpec[];
}[];

/**
 * Integrity check between the phases. A pattern id that has a specification
 * but no Phase 9 graph node, or the reverse, is surfaced instead of hidden.
 */
export const REGISTRY_INTEGRITY = {
  specIds: PATTERN_SPECS.map((p) => p.id),
  graphIds: PATTERN_NODES.map((n) => n.id),
  specsWithoutGraphNode: PATTERN_SPECS.filter((p) => !PATTERN_NODES.some((n) => n.id === p.id)).map((p) => p.id),
  graphNodesWithoutSpec: PATTERN_NODES.filter((n) => !PATTERN_SPECS.some((p) => p.id === n.id)).map((n) => nodeName(n.id)),
};

export const PATTERN_SUMMARY = {
  patterns: PATTERN_SPECS.length,
  categories: PATTERN_TAXONOMY.filter((g) => g.patterns.length > 0).length,
  anatomyRecords: PATTERN_ANATOMY.length,
  anatomyParts: PATTERN_ANATOMY.reduce((n, a) => n + a.parts.length, 0),
  variants: PATTERN_VARIANTS.length,
  states: PATTERN_STATES.length,
  responsiveRecords: PATTERN_RESPONSIVE.length,
  densityRecords: PATTERN_DENSITY.length,
  compositionRows: PATTERN_COMPOSITION.length,
  experiencePatterns: EXPERIENCE_PATTERNS.length,
  tracedScreens: SCREEN_PATTERN_MAP.length,
  duplicateConcepts: PATTERN_DUPLICATES.length,
  figmaProposals: PATTERN_FIGMA_MAPPINGS.length,
  current: PATTERN_SPECS.filter((p) => p.status === "CURRENT IMPLEMENTATION").length,
  variationsOrDuplicates: PATTERN_SPECS.filter(
    (p) => p.status === "OBSERVED VARIATION" || p.status === "OBSERVED DUPLICATE" || p.status === "OBSERVED OVERLAP",
  ).length,
  unowned: PATTERN_SPECS.filter((p) => p.status === "UNOWNED AREA").length,
  open: PATTERN_SPECS.filter((p) => p.status === "FUTURE DECISION" || p.status === "FUTURE CANONICAL TARGET").length,
};

export const REGISTRY_RULES: string[] = [
  "CURRENT IMPLEMENTATION — this registry is the only assembly point for the pattern layer.",
  "CURRENT IMPLEMENTATION — component records come from the Phase 8 specification and relationships from the Phase 9 graph; neither is copied here.",
  "GOVERNANCE RULE — pattern ids are the Phase 9 graph ids, so a pattern can never exist in one phase and not the other without the integrity check showing it.",
  "GOVERNANCE RULE — this module is imported only by `/design-system` and `/design-guide`.",
];
