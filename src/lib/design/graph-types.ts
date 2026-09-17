/**
 * Phase 9 — integrated dependency graph types.
 *
 * DOCUMENTATION ONLY. Nothing here is imported by application screens or
 * business logic. Consumers: `/design-system` and `/design-guide`.
 *
 * An edge exists only where the codebase shows one: an import, a measured
 * consumer count, or a token read. Visual similarity never creates an edge.
 * Where a relationship cannot be established safely it is recorded with the
 * status FUTURE DECISION and the reason.
 */
import type { SpecLabel } from "./component-spec-types";
import type { Ownership } from "./types";

export type { SpecLabel };

/** The eight layers of the integrated model, in dependency order. */
export type GraphLayer =
  | "foundation"
  | "semantic-role"
  | "component-role"
  | "core-component"
  | "compound"
  | "pattern"
  | "experience-pattern"
  | "screen";

export const GRAPH_LAYERS: { layer: GraphLayer; title: string; meaning: string }[] = [
  { layer: "foundation", title: "Foundation", meaning: "A raw decision: a token, a scale step, a breakpoint." },
  { layer: "semantic-role", title: "Semantic role", meaning: "What a foundation value means, independent of where it is used." },
  { layer: "component-role", title: "Component role", meaning: "The slot inside a component that consumes a semantic role." },
  { layer: "core-component", title: "Core component", meaning: "A component with no domain knowledge." },
  { layer: "compound", title: "Compound component", meaning: "A fixed composition of core components." },
  { layer: "pattern", title: "Pattern", meaning: "A recurring arrangement that solves one screen problem." },
  { layer: "experience-pattern", title: "Experience pattern", meaning: "A pattern specialised for one experience." },
  { layer: "screen", title: "Screen", meaning: "A real route the user opens." },
];

export type EdgeRelation =
  | "defines"
  | "implements"
  | "composes"
  | "consumes"
  | "extends"
  | "renders"
  | "owns"
  | "overlaps-with";

export interface DependencyNode {
  id: string;
  layer: GraphLayer;
  name: string;
  /** Real file or route where this node lives, when it has one. */
  source?: string;
  ownership: Ownership | "runtime" | "none";
  status: SpecLabel;
  evidence: string;
  note?: string;
}

export interface DependencyEdge {
  from: string;
  to: string;
  relation: EdgeRelation;
  status: SpecLabel;
  /** File, measured count, or an explicit statement that it is not established. */
  evidence: string;
  ownership: string;
  note?: string;
}

/** Specialised views over the same two shapes. */
export type FoundationDependency = DependencyEdge;
export type ComponentDependency = DependencyEdge;
export type PatternDependency = DependencyEdge;
export type ExperienceDependency = DependencyEdge;
export type ScreenDependency = DependencyEdge;

export type ConsumerKind = "direct" | "indirect" | "route-local" | "reference-only";

export interface ConsumerReference {
  component: string;
  source: string;
  kind: ConsumerKind;
  /** Measured in Phase 5. Never estimated. */
  measured: string;
  status: SpecLabel;
  note?: string;
}

export interface TraceabilityRecord {
  screen: string;
  route: string;
  experience: string;
  patterns: string[];
  components: string[];
  foundation: string[];
  variations: string[];
  ownershipBoundary: string;
  status: SpecLabel;
}

export interface ImpactRecord {
  change: string;
  layer: GraphLayer;
  reachableRoles: string[];
  reachableComponents: string[];
  reachablePatterns: string[];
  reachableExperiences: string[];
  reachableScreens: string[];
  confidence: "evidenced" | "partial" | "not-determinable";
  status: SpecLabel;
  note?: string;
}

export interface OwnershipRecord {
  layer: string;
  ownedBy: string;
  changesRequire: string;
  outsideTheSystem: string;
  status: SpecLabel;
}

export interface StatusRecord {
  status: SpecLabel;
  meaning: string;
  readAs: string;
}

export interface ChainStep {
  layer: GraphLayer;
  label: string;
  evidence: string;
  status: SpecLabel;
}

export interface TracedChain {
  id: string;
  title: string;
  question: string;
  steps: ChainStep[];
}
