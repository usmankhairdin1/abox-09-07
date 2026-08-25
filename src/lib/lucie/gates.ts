/** Production launch gates. Source: ABox_Lucie_Launch_Gates_v1.0. */
export interface Gate {
  gateId: string;
  gate: string;
  criteria: string;
  blocking: string;
}

export const GATES: Gate[] = [
  {
    "gateId": "LUC-GATE-01",
    "gate": "Scope and Traceability",
    "criteria": "All Lucie capabilities, screens, module slices, requirements and tests trace to this package and upstream canonical IDs.",
    "blocking": "Any orphan or silent scope expansion."
  },
  {
    "gateId": "LUC-GATE-02",
    "gate": "Product and Data",
    "criteria": "Approved real Ideon data, canned plan data, forms and pathway configuration; no sample data in production.",
    "blocking": "Missing or invalid production data."
  },
  {
    "gateId": "LUC-GATE-03",
    "gate": "Carrier and EDI",
    "criteria": "Selected carrier forms, PDF and EDI mappings are validated and certified where those pathways launch.",
    "blocking": "Uncertified carrier-specific output."
  },
  {
    "gateId": "LUC-GATE-04",
    "gate": "JET EDE",
    "criteria": "Opaque-token handoff, callback, legal role, disclosures and failure behavior are approved.",
    "blocking": "Unverified EDE boundary."
  },
  {
    "gateId": "LUC-GATE-05",
    "gate": "Legal and Compliance",
    "criteria": "Launch states, PlanAI mode, disclosures, consent, signatures, licensing and privacy posture are approved.",
    "blocking": "Unresolved legal release gate."
  },
  {
    "gateId": "LUC-GATE-06",
    "gate": "Security and Privacy",
    "criteria": "Tenant isolation, ACL, secret storage, safe URL, PHI/PII scrubbing, access and audit tests pass.",
    "blocking": "Critical or high security finding."
  },
  {
    "gateId": "LUC-GATE-07",
    "gate": "Payment Safety",
    "criteria": "Simulation is disabled for real production transactions; real credentials cannot be entered or retained.",
    "blocking": "Any production path implies funds moved without a provider."
  },
  {
    "gateId": "LUC-GATE-08",
    "gate": "Operational Readiness",
    "criteria": "Monitoring, runbooks, support, escalation, retries, rollback and data-quality queues are active.",
    "blocking": "No accountable operating path."
  },
  {
    "gateId": "LUC-GATE-09",
    "gate": "Commercial Readiness",
    "criteria": "Selected agencies, agreements, entitlements, training and customer communication are confirmed.",
    "blocking": "No approved commercial cohort."
  }
];
