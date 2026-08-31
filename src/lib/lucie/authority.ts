/**
 * Locked authority header for every Lucie artifact.
 *
 * Source: corrected SOURCE_HIERARCHY_AND_SUPERSESSION_NOTICE in the Lucie,
 * Phase 1 and Information Architecture packages. Any artifact that cannot name
 * the active source version it inherited is not implementation-authoritative.
 */

export interface ConsumedSource {
  rank: number;
  id: string;
  artifact: string;
  version: string;
  authority: string;
  controls: string;
}

export const CONSUMED_SOURCES: ConsumedSource[] = [
  {
    rank: 1,
    id: "ART_LUCIE_001",
    artifact: "ABox Lucie Release Handover Package",
    version: "v1.0 · 12 Aug 2026",
    authority: "Controlling for Lucie",
    controls:
      "Lucie scope, simplifications, exclusions, workstreams, delivery depth, protected seams and launch gates.",
  },
  {
    rank: 2,
    id: "ART_P1_SOURCE_001",
    artifact: "ABox Phase 1 Source Package",
    version: "v1.0",
    authority: "Controlling for Phase 1",
    controls:
      "Broader product and operating model, current module ownership M00–M26, dependency sequence and production posture Lucie must preserve.",
  },
  {
    rank: 3,
    id: "ART_IA_002",
    artifact: "ABox Phase 1 Information Architecture Package",
    version: "v2.0",
    authority: "Controlling for experience structure",
    controls:
      "Platform shell, workspaces, navigation, stable screen and surface IDs, canonical object homes, journeys, access placement and configuration placement.",
  },
  {
    rank: 4,
    id: "ART_M01_BUILD_001",
    artifact: "ABox Module 1 V4 Hardening Package + PRD v1.3.2 + Traceability v1.0.2",
    version: "v4 / v1.3.2 / v1.0.2",
    authority: "The only protected detailed module baseline",
    controls:
      "Protected IFP shopping and JET EDE profile, requirement spine, compliance controls and no-orphan traceability.",
  },
  {
    rank: 5,
    id: "ART_NS_001",
    artifact: "ABox North Star package",
    version: "v1.0",
    authority: "Long-term intent; anti-narrowing control",
    controls:
      "Marketplace-of-marketplaces identity, AI-native posture, architecture guardrails and service model.",
  },
];

export const PROTECTED_BASELINE_INVARIANT = "protected_detailed_module_baselines = [M01]";

export interface StaleStatement {
  id: string;
  statement: string;
  foundIn: string;
  disposition: string;
}

/** Stale statements identified during ingestion and explicitly NOT inherited. */
export const STALE_STATEMENTS: StaleStatement[] = [
  {
    id: "STALE-01",
    statement:
      "ABox Product Architecture and Module Sequencing Pack v1.0 (2026-06-24) as a controlling module, ownership or sequencing source.",
    foundIn: "Lucie README upstream references; older project notes",
    disposition:
      "Retired. Module identity, ownership and dependency sequence come from the Phase 1 Source Package v1.0.",
  },
  {
    id: "STALE-02",
    statement: "Prior M02 build packets treated as a controlling quote/cart baseline.",
    foundIn: "Upstream reference folders",
    disposition: "Reference only. M02 remains a stable module ID and ownership label.",
  },
  {
    id: "STALE-03",
    statement: "ABox M03 Stage 1 Build Packet v1.1 treated as a protected product baseline.",
    foundIn: "Lucie 04_Upstream_References",
    disposition: "Reference only. M03 product posture follows approved Phase 1 decisions.",
  },
  {
    id: "STALE-04",
    statement: "\u201cPlan AI\u201d as the shopping-assistant name.",
    foundIn: "Phase 1 IA v1.0 and earlier project wireframes",
    disposition:
      "PlanAI is canonical. IA v2.0 retains the stable ID and renames the display label only.",
  },
  {
    id: "STALE-05",
    statement: "June 2026 Phase 1 Blueprint deck as a scope or build-sequence source.",
    foundIn: "Earlier project design passes",
    disposition: "Excluded by the Lucie README; superseded framing. Visual reference at most.",
  },
  {
    id: "STALE-06",
    statement:
      "Earlier project wireframe sets (/m1, /p1, /hf) treated as the ABox screen baseline.",
    foundIn: "This project, prior design batches",
    disposition:
      "Not authoritative. IA v2.0 controls IDs and placement; see the reconciliation register.",
  },
];

export interface ArtifactRule {
  id: string;
  rule: string;
}

/** Rules every downstream Lucie artifact must satisfy. */
export const ARTIFACT_RULES: ArtifactRule[] = [
  {
    id: "RULE-01",
    rule: "Every row carries a Lucie capability ID, canonical module ID, IA surface ID, workstream and applicable launch gate.",
  },
  {
    id: "RULE-02",
    rule: "Stable module IDs M00–M26 are ownership and traceability identifiers, never build order.",
  },
  {
    id: "RULE-03",
    rule: "No Lucie-specific module numbers and no second object model. IA v2.0 owns the object homes.",
  },
  {
    id: "RULE-04",
    rule: "Lucie workstreams are delivery lanes, not modules.",
  },
  {
    id: "RULE-05",
    rule: "Module 1 controls may not be weakened by a Lucie simplification. Deltas require an explicit approved M01 delta.",
  },
  {
    id: "RULE-06",
    rule: "Fixed plans, fixed forms and canned workflows are governed versioned assets: owner, effective dates, lifecycle state, audit history, replaceable service boundary.",
  },
  {
    id: "RULE-07",
    rule: "Protected seams keep their IDs, objects and interface boundaries. They are never shown as implemented and the data model is never collapsed.",
  },
  {
    id: "RULE-08",
    rule: "Carriers, states, EDI layouts, carrier forms, acknowledgements, legal copy, NIPR behavior, pricing and payment providers are dependencies, never invented.",
  },
];

export const WORKSPACE_LABELS: Record<string, string> = {
  WS_PLATFORM_ADMIN: "JET Platform",
  WS_AGENCY: "Agency",
  WS_AGENT: "Agent",
  WS_EMPLOYER_GROUP: "Employer / Group",
  WS_CONSUMER_MARKETPLACE: "Consumer Marketplace",
  WS_MEMBER: "Member",
};
