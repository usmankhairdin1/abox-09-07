/** Managed Lucie risks. */
export interface Risk {
  riskId: string;
  risk: string;
  description: string;
  severity: string;
  mitigation: string;
  status: string;
}

export const RISKS: Risk[] = [
  {
    "riskId": "LUC-RSK-001",
    "risk": "Scope compression",
    "description": "The release touches many canonical modules despite simplified depth.",
    "severity": "High",
    "mitigation": "Strict workstream ownership, fixed configurations and weekly scope control.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-002",
    "risk": "Carrier selection delay",
    "description": "No carrier is selected for forms or EDI.",
    "severity": "High",
    "mitigation": "Build the adapter/framework early; treat carrier certification as a launch gate.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-003",
    "risk": "Ideon data delay or mapping mismatch",
    "description": "IFP quotes cannot be production-accurate.",
    "severity": "High",
    "mitigation": "Lock mapping contract early, validate provenance and block sample data in production.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-004",
    "risk": "EDI certification variance",
    "description": "Carrier schemas and acknowledgements differ materially.",
    "severity": "High",
    "mitigation": "Separate canonical payload from adapters and certify selected carrier only.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-005",
    "risk": "Launch-state legal delay",
    "description": "State rules and disclosures are not approved in time.",
    "severity": "High",
    "mitigation": "Keep rules configurable and gate activation by state.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-006",
    "risk": "Payment simulation confusion",
    "description": "Users may mistake simulation for real payment.",
    "severity": "High",
    "mitigation": "Nonproduction lock, synthetic values, persistent labeling and no paid status.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-007",
    "risk": "Fixed-form proliferation",
    "description": "New carriers may demand many divergent forms.",
    "severity": "Medium",
    "mitigation": "Version assets and enforce a controlled form-family strategy.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-008",
    "risk": "PlanAI legal or quality failure",
    "description": "Recommendation language or evidence is not acceptable.",
    "severity": "High",
    "mitigation": "Deployment switch, guardrails, evaluation set, disclosures and human escalation.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-009",
    "risk": "Tenant or ACL defect",
    "description": "Cross-tenant or unauthorized data exposure.",
    "severity": "High",
    "mitigation": "Server-side policy enforcement, negative tests and security gate.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-010",
    "risk": "NIPR/provider uncertainty",
    "description": "Verification behavior cannot be completed.",
    "severity": "Medium",
    "mitigation": "Preserve manual verification and exception queue behind the same authority contract.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-011",
    "risk": "Twilio deliverability or consent defect",
    "description": "Messages fail or violate communication eligibility.",
    "severity": "High",
    "mitigation": "Sender validation, webhook monitoring, typed consent and fail-closed send checks.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-012",
    "risk": "Operational support gap",
    "description": "No team owns exception queues and incidents.",
    "severity": "High",
    "mitigation": "Define queue owners, SLAs, runbooks and support readiness gate.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-013",
    "risk": "User experience overload",
    "description": "A broad cross-product release becomes difficult to navigate.",
    "severity": "Medium",
    "mitigation": "Use the simplified IA subset, contextual help and role-based navigation.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-014",
    "risk": "Data quality and stale quotes",
    "description": "Bad source data or old snapshots produce misleading results.",
    "severity": "High",
    "mitigation": "Validation, provenance, immutable snapshots and stale-quote refresh.",
    "status": "Open / managed"
  },
  {
    "riskId": "LUC-RSK-015",
    "risk": "Convergence drift",
    "description": "Lucie shortcuts become a competing architecture.",
    "severity": "High",
    "mitigation": "Stable IDs, protected seams, source hierarchy and main-project change control.",
    "status": "Open / managed"
  }
];
