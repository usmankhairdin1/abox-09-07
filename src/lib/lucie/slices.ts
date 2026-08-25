/**
 * Integrated vertical release slices A–H.
 *
 * Source: ABox Lucie Release Four-Month Delivery Blueprint v1.0, section 4.
 * A slice is the demonstrable integrated outcome; a coded window is not an
 * activation. Activation still depends on the applicable launch gates.
 */

export interface VerticalSlice {
  id: string;
  name: string;
  outcome: string;
  workstreams: string[];
  surfaces: string[];
  acceptancePosture: string;
  gates: string[];
}

export const SLICES: VerticalSlice[] = [
  {
    id: "SLICE-A",
    name: "Governed shell",
    outcome:
      "JET admin creates tenant, agency and users, assigns roles, branding and entitlements; access and changes are audited.",
    workstreams: ["WS-00", "WS-01"],
    surfaces: [
      "LUC-SCR_TENANTS",
      "LUC-SCR_ROLE_TEMPLATES",
      "LUC-SCR_WORKSPACE_CONFIG",
      "LUC-SCR_COMMERCIAL_ENTITLEMENTS",
      "LUC-SCR_AUDIT_EXPLORER",
    ],
    acceptancePosture:
      "A provisioned agency user sees only in-scope data; every configuration change produces an audit record with actor, tenant and before/after.",
    gates: ["LUC-GATE-01", "LUC-GATE-06", "LUC-GATE-09"],
  },
  {
    id: "SLICE-B",
    name: "IFP shopping",
    outcome:
      "Consumer or agent starts, quotes from live Ideon data, uses subsidy and PlanAI, compares, carts, registers, saves and resumes.",
    workstreams: ["WS-02", "WS-07"],
    surfaces: [
      "LUC-SCR_CONS_LANDING",
      "LUC-SCR_ELIGIBILITY_INTAKE",
      "LUC-SCR_SUBSIDY_FPL_TOOLS",
      "LUC-SCR_QUOTE_RESULTS",
      "LUC-SCR_PLAN_COMPARE",
      "LUC-SCR_CART_REVIEW",
      "LUC-SCR_REGISTRATION",
    ],
    acceptancePosture:
      "Quote results are produced from real Ideon data and pinned to an immutable quote snapshot; a stale snapshot is detected and re-quoted rather than silently repriced.",
    gates: ["LUC-GATE-02", "LUC-GATE-05"],
  },
  {
    id: "SLICE-C",
    name: "EDE handoff",
    outcome:
      "On-exchange cart item passes readiness and moves to JET EDE with an opaque token and tracked status.",
    workstreams: ["WS-01", "WS-02", "WS-05"],
    surfaces: [
      "LUC-SCR_EDE_HANDOFF_REVIEW",
      "LUC-SCR_SUBMISSION_STATUS",
      "LUC-SCR_WEBHOOK_MONITOR",
    ],
    acceptancePosture:
      "Handoff is recorded as a handoff, never as an enrollment. Typed consent, safe URL and failure/return behavior match the protected Module 1 controls.",
    gates: ["LUC-GATE-04", "LUC-GATE-05", "LUC-GATE-06"],
  },
  {
    id: "SLICE-D",
    name: "Authorized agent",
    outcome:
      "Agency onboards an agent, verifies credentials, applies the captive rule and permits or blocks quote and progression.",
    workstreams: ["WS-03"],
    surfaces: [
      "LUC-SCR_AGENT_ONBOARDING",
      "LUC-SCR_LICENSES",
      "LUC-SCR_APPOINTMENTS",
      "LUC-SCR_CAPTIVE_CONSTRAINTS",
      "LUC-SCR_AGENT_READINESS",
    ],
    acceptancePosture:
      "Sellability fails closed with a reason code when license, appointment, state or captive posture is missing; the decision is server-side and auditable.",
    gates: ["LUC-GATE-05", "LUC-GATE-06"],
  },
  {
    id: "SLICE-E",
    name: "Off-exchange application",
    outcome:
      "A fixed application saves and resumes, validates, e-signs, generates PDF or EDI status and exposes exceptions.",
    workstreams: ["WS-04", "WS-05"],
    surfaces: [
      "LUC-SCR_OFFEX_ENROLL_START",
      "LUC-SCR_DYNAMIC_FORM",
      "LUC-SCR_APPLICATION_REVIEW",
      "LUC-SCR_ESIGN",
      "LUC-SCR_SUBMISSION_STATUS",
      "LUC-SCR_APPLICATION_EXCEPTION_QUEUE",
    ],
    acceptancePosture:
      "A generated PDF is not carrier acceptance and generated EDI is not confirmed submission; both render as distinct states with an owned exception path.",
    gates: ["LUC-GATE-03", "LUC-GATE-05", "LUC-GATE-07"],
  },
  {
    id: "SLICE-F",
    name: "Dental and vision",
    outcome:
      "Canned plans quote, compare and cart, then enter the same fixed form and pathway runtime.",
    workstreams: ["WS-02", "WS-04", "WS-07"],
    surfaces: [
      "LUC-SCR_DV_QUOTE_INTAKE",
      "LUC-SCR_CANNED_PLAN_LIBRARY",
      "LUC-SCR_PATHWAY_BINDINGS",
      "LUC-SCR_CART_REVIEW",
    ],
    acceptancePosture:
      "Canned plan data is versioned governed data, never embedded in frontend code, and each product resolves to exactly one of the three pathway modes.",
    gates: ["LUC-GATE-02", "LUC-GATE-03"],
  },
  {
    id: "SLICE-G",
    name: "ICHRA quote and route",
    outcome:
      "Employer or agent creates an employer account and census, models contribution, compares a proposal and routes interest.",
    workstreams: ["WS-05", "WS-06", "WS-07"],
    surfaces: [
      "LUC-SCR_ICHRA_ENTRY",
      "LUC-SCR_ICHRA_CENSUS",
      "LUC-SCR_ICHRA_CONTRIBUTION",
      "LUC-SCR_ICHRA_RESULTS",
      "LUC-SCR_ICHRA_PROPOSAL",
      "LUC-SCR_ICHRA_ROUTING",
    ],
    acceptancePosture:
      "Routing produces an owned CRM record; no employee enrollment, eligibility administration or reimbursement surface exists anywhere in the flow.",
    gates: ["LUC-GATE-05", "LUC-GATE-09"],
  },
  {
    id: "SLICE-H",
    name: "Operate and monitor",
    outcome: "JET sees dashboards, integration health, queues, audit evidence and gate state.",
    workstreams: ["WS-08"],
    surfaces: [
      "LUC-SCR_PLATFORM_HOME",
      "LUC-SCR_REPORT_CATALOG",
      "LUC-SCR_ANALYTICS_DATASETS",
      "LUC-SCR_AUDIT_EXPLORER",
      "LUC-SCR_LAUNCH_GATES",
    ],
    acceptancePosture:
      "Integration and data failures surface in an owned queue with a runbook; no failure disappears and no demo substitutes for an operating path.",
    gates: ["LUC-GATE-06", "LUC-GATE-08", "LUC-GATE-09"],
  },
];
