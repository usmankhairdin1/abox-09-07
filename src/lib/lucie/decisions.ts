/** Locked Lucie decisions (21). */
export interface Decision {
  decisionId: string;
  decision: string;
  rationale: string;
  downstreamImpact: string;
  status: string;
  changeControl: string;
}

export const DECISIONS: Decision[] = [
  {
    "decisionId": "LUC-DEC-001",
    "decision": "Lucie is a four-month commercially deployable ABox release profile.",
    "rationale": "Provides a focused delivery target without redefining ABox.",
    "downstreamImpact": "All planning and artifacts optimize for the four-month boundary.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-002",
    "decision": "Stable ABox module IDs remain canonical and do not express Lucie build order.",
    "rationale": "Prevents a forked architecture.",
    "downstreamImpact": "Module work is described as Lucie slices and dependency workstreams.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-003",
    "decision": "Lucie uses selected commercial availability.",
    "rationale": "Supports monetization without claiming general availability.",
    "downstreamImpact": "Tenant entitlements and launch gates control access.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-004",
    "decision": "IFP on-exchange ends in JET EDE handoff.",
    "rationale": "Preserves the regulated enrollment boundary.",
    "downstreamImpact": "ABox owns shopping; JET EDE owns formal Exchange enrollment.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-005",
    "decision": "FPL and subsidy tools are included for IFP on-exchange.",
    "rationale": "Completes the requested shopping parity.",
    "downstreamImpact": "Calculation versions, inputs and disclaimers must be auditable.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-006",
    "decision": "IFP off-exchange supports exactly three carrier pathways.",
    "rationale": "Constrains scope while enabling monetizable outcomes.",
    "downstreamImpact": "Quote only, application+PDF or application+EDI are configurable per carrier/product.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-007",
    "decision": "Dental and vision use the same three pathway modes.",
    "rationale": "Creates a consistent operating model.",
    "downstreamImpact": "Each uses fixed product-specific forms and plan structures.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-008",
    "decision": "Lucie uses versioned fixed forms rather than the dynamic form configurator.",
    "rationale": "Makes the four-month target feasible.",
    "downstreamImpact": "Form versions, validation, actor provenance and submission state remain governed.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-009",
    "decision": "IFP plan data comes from Ideon through a fixed loader and mapping.",
    "rationale": "Avoids building full product administration.",
    "downstreamImpact": "Real Ideon data is a production gate; no sample data in production.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-010",
    "decision": "Dental and vision plans are canned, versioned data structures.",
    "rationale": "Supports product-specific rating without free-form configuration.",
    "downstreamImpact": "Plan data remains governed and not embedded in frontend code.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-011",
    "decision": "Agency relationships are simplified to parent/downline for Lucie.",
    "rationale": "Reduces UI and rule complexity.",
    "downstreamImpact": "Canonical organization and effective-dated relationship boundaries remain protected.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-012",
    "decision": "Lucie exposes four workforce role templates.",
    "rationale": "Keeps administration understandable.",
    "downstreamImpact": "JET Admin, Agency Admin, Selling Agent and Unlicensed Staff use permissions underneath.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-013",
    "decision": "Lucie includes limited licenses, appointments, NIPR verification and sellability.",
    "rationale": "Prevents unauthorized selling.",
    "downstreamImpact": "Reason-coded outcomes and captive restrictions are server-side.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-014",
    "decision": "Lucie supports D2C, agent initiation, assistance and takeover.",
    "rationale": "Covers primary commercial channels.",
    "downstreamImpact": "Actor transitions and attribution remain auditable.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-015",
    "decision": "ICHRA supports employer- and agent-initiated quoting only.",
    "rationale": "Creates a monetizable employer lead path.",
    "downstreamImpact": "Employee enrollment and ongoing administration are excluded.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-016",
    "decision": "PlanAI is text-only across IFP, dental, vision and ICHRA.",
    "rationale": "Controls delivery and legal complexity.",
    "downstreamImpact": "Voice and autonomous transaction actions are excluded.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-017",
    "decision": "Twilio/SendGrid is the only external communications provider family.",
    "rationale": "Avoids multi-provider complexity.",
    "downstreamImpact": "Front-end configuration, testing, health and webhook status are required.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-018",
    "decision": "JET E-Signature is the only Lucie signature provider.",
    "rationale": "Avoids DocuSign integration scope.",
    "downstreamImpact": "Signature evidence remains governed and versioned.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-019",
    "decision": "Payment is simulation-only in nonproduction until a provider is selected.",
    "rationale": "Prevents false payment claims and unsafe credential collection.",
    "downstreamImpact": "Production uses status-only external/pending handling.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-020",
    "decision": "Basic CRM, accounts, save/resume, quote sharing, tasks, reporting and JET administration are required.",
    "rationale": "Makes the release operationally workable and monetizable.",
    "downstreamImpact": "These are baseline supporting capabilities, not optional enhancements.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  },
  {
    "decisionId": "LUC-DEC-021",
    "decision": "Workflows are canned explicit state machines.",
    "rationale": "Avoids a workflow designer while preserving reliable operations.",
    "downstreamImpact": "States, transitions, actors, notifications and audit events are explicit.",
    "status": "Locked",
    "changeControl": "Change requires Saad approval and a published Lucie delta."
  }
];
