/**
 * Phase 11 — readiness and governance types.
 *
 * DOCUMENTATION ONLY. Additive types on top of the Phase 8 specification
 * vocabulary and the Phase 9/10 ids. Deliberately categorical: there is no
 * score, rank, tier or priority anywhere in this layer, because a number would
 * imply a winner and no winner is being chosen.
 */
import type { SpecLabel } from "./component-spec-types";
import type { Ownership } from "./types";

export type { SpecLabel, Ownership };

/**
 * Owner reference. Extends the Phase 1 Ownership vocabulary with the
 * governance-level owners used from Phase 6 onwards. Additive only.
 */
export type OwnerRef = Ownership | "design-system" | "route" | "runtime" | "none";

/** Categorical readiness. Never a score. */
export type ReadinessState =
  | "READY FOR FUTURE DECISION"
  | "NEEDS EVIDENCE"
  | "NEEDS OWNER"
  | "NEEDS PRODUCT DECISION"
  | "NEEDS DESIGN DECISION"
  | "NEEDS TECHNICAL DECISION"
  | "BLOCKED BY DUPLICATE"
  | "BLOCKED BY EXPERIENCE VARIATION"
  | "DEFERRED"
  | "NOT APPLICABLE";

export type SubjectType =
  | "foundation"
  | "semantic-role"
  | "core-component"
  | "compound"
  | "pattern"
  | "experience-pattern"
  | "shell"
  | "route-kit"
  | "runtime-system";

export type DecisionType =
  | "product decision"
  | "design decision"
  | "technical decision"
  | "ownership decision"
  | "naming decision"
  | "accessibility decision";

export type BlockerKind =
  | "duplicate implementation"
  | "experience variation"
  | "no owner"
  | "insufficient evidence"
  | "runtime boundary"
  | "no blocker";

export type ApprovalKind =
  | "design system owner"
  | "experience owner"
  | "product owner"
  | "accessibility review"
  | "engineering review"
  | "none required";

export type FigmaReadiness = "READY" | "PARTIAL" | "BLOCKED" | "FUTURE DECISION";

export type MigrationRisk =
  | "no migration implied"
  | "isolated — single consumer"
  | "broad — many consumers"
  | "cross-experience"
  | "unknown until decided";

/** One readiness record for one subject. */
export interface ReadinessRecord {
  /** Matches a Phase 8 spec id, Phase 9 graph node id or Phase 10 pattern id where one exists. */
  id: string;
  subjectType: SubjectType;
  subject: string;
  currentImplementation: string;
  currentConsumers: string;
  ownership: OwnerRef;
  evidence: string;
  observedVariations: string[];
  duplicateRelationships: string[];
  dependencies: string[];
  accessibilityReadiness: string;
  responsiveReadiness: string;
  contentReadiness: string;
  namingReadiness: string;
  foundationReadiness: string;
  experienceReadiness: string;
  figmaReadiness: FigmaReadiness;
  governanceStatus: SpecLabel;
  unresolvedDecisions: string[];
  requiredApprovals: ApprovalKind[];
  migrationRisk: MigrationRisk;
  readiness: ReadinessState;
  futureTarget?: string;
  note?: string;
}

/**
 * A candidate is an area that COULD become canonical later. It is not a
 * selected winner and carries no ordering.
 */
export interface CanonicalCandidate {
  id: string;
  area: string;
  currentImplementation: string;
  observedVariation: string;
  potentialCanonicalTarget: string;
  requiredDecision: string;
  evidence: string;
  consumers: string;
  blocker: BlockerKind;
  readiness: ReadinessState;
  status: SpecLabel;
  note?: string;
}

/** One concrete option that exists in the code today. */
export interface DecisionOption {
  option: string;
  existsAs: string;
  consumers: string;
  consequence: string;
}

export interface DecisionRecord {
  id: string;
  subject: string;
  decisionType: DecisionType;
  currentEvidence: string;
  affectedComponents: string[];
  affectedExperiences: string[];
  affectedScreens: string[];
  ownership: OwnerRef;
  options: DecisionOption[];
  requiredApprovals: ApprovalKind[];
  dependencyConstraints: string;
  blocksFigma: boolean;
  requiresProductionMigration: boolean;
  status: ReadinessState;
  note?: string;
}

export interface BoundaryRecord {
  layer: string;
  belongsHere: string;
  doesNotBelongHere: string;
  owner: OwnerRef;
  evidence: string;
  status: SpecLabel;
}

export interface GovernanceLayerRule {
  layer: string;
  owner: OwnerRef;
  evidenceRequired: string;
  mayChangeIndependently: string;
  consumersToCheck: string;
  visualRegression: boolean;
  accessibilityReview: boolean;
  responsiveReview: boolean;
  productApproval: boolean;
  migrationApproval: boolean;
  status: SpecLabel;
}

export interface MigrationStage {
  order: number;
  stage: string;
  purpose: string;
  entryCondition: string;
  evidenceProduced: string;
  exitCondition: string;
  approval: ApprovalKind;
  status: SpecLabel;
}

export interface RegressionClause {
  dimension: string;
  mustRemain: string;
  evidenceRequired: string;
  method: string;
  status: SpecLabel;
}

export interface FigmaReadinessArea {
  area: string;
  currentEvidence: string;
  gap: string;
  blocker: BlockerKind;
  readiness: FigmaReadiness;
  note?: string;
}

export interface LibraryGroupProposal {
  group: string;
  wouldContain: string;
  mappedFrom: string;
  justified: boolean;
  readiness: FigmaReadiness;
  note?: string;
}

export interface NamingReadinessRecord {
  currentName: string;
  currentUsage: string;
  conflict: string;
  futureProposal: string;
  migrationImpact: string;
  status: SpecLabel;
}

export interface AccessibilityReadinessRecord {
  area: string;
  currentEvidence: string;
  gap: string;
  readiness: ReadinessState;
  status: SpecLabel;
}

export interface ContentReadinessRecord {
  subject: string;
  requiredContent: string;
  optionalContent: string;
  longTextBehavior: string;
  emptyContent: string;
  errorContent: string;
  loadingContent: string;
  numericContent: string;
  bilingualNote: string;
  readiness: ReadinessState;
  status: SpecLabel;
}

export interface ExperienceReadinessRecord {
  experience: string;
  sharedCoreBehavior: string;
  experienceExtensions: string;
  intentionalDifferences: string;
  unresolvedDifferences: string;
  ownership: OwnerRef;
  figmaImplication: string;
  readiness: ReadinessState;
  status: SpecLabel;
}
