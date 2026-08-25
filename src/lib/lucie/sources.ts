/** Corrected source hierarchy and conflict treatment. */
export interface SourceRank {
  rank: string;
  source: string;
  use: string;
  conflict: string;
}

export const SOURCE_HIERARCHY: SourceRank[] = [
  {
    "rank": "1",
    "source": "ABox Lucie Release Handover Package v1.0",
    "use": "Controls Lucie scope, simplifications, exclusions, workstreams, gates and project instructions.",
    "conflict": "Controls the Lucie release unless Saad publishes a later Lucie delta."
  },
  {
    "rank": "2",
    "source": "ABox Phase 1 Source Package v1.0",
    "use": "Controls the broader Phase 1 product, operating model, module ownership and production posture.",
    "conflict": "Lucie may narrow implementation depth but may not redefine Phase 1."
  },
  {
    "rank": "3",
    "source": "ABox Phase 1 Information Architecture Package v2.0",
    "use": "Controls platform shell, workspaces, navigation, stable screen IDs, objects, events, ACL and configuration placement.",
    "conflict": "Lucie may simplify visible surfaces but must preserve IA identity and convergence."
  },
  {
    "rank": "4",
    "source": "ABox Product Architecture and Module Sequencing Pack v1.0",
    "use": "Controls canonical module IDs, dependency logic, object boundaries and anti-hardcoding architecture.",
    "conflict": "Lucie workstreams do not renumber or redefine canonical modules."
  },
  {
    "rank": "5",
    "source": "ABox Module 1 V4 Hardening Package plus PRD v1.3.2 and Traceability v1.0.2",
    "use": "Controls protected IFP shopping, PlanAI, consent, audit, EDE and no-PHI behaviors inherited by Lucie.",
    "conflict": "Lucie expansion may add bounded off-exchange, dental, vision and ICHRA slices but cannot weaken protected controls."
  },
  {
    "rank": "6",
    "source": "ABox M03 Stage 1 Build Packet v1.1",
    "use": "Controls canonical product, plan, source, publishing, provenance and pathway ownership.",
    "conflict": "Lucie uses fixed structures and limited admin without creating a competing product model."
  },
  {
    "rank": "7",
    "source": "North Star Handover Package v1.0",
    "use": "Controls the long-term marketplace-of-marketplaces and AI-native platform intent.",
    "conflict": "Lucie cannot be presented as the full North Star or as a replacement for it."
  }
];
