/** Open implementation and release inputs (15). */
export interface OpenItem {
  openItemId: string;
  topic: string;
  question: string;
  whyItMatters: string;
  owner: string;
  blockingStage: string;
  status: string;
}

export const OPEN_ITEMS: OpenItem[] = [
  {
    "openItemId": "LUC-OQ-001",
    "topic": "Launch states",
    "question": "Which states are included in the first production release?",
    "whyItMatters": "Legal/compliance, plan availability, forms, disclosures, licensing and communication rules.",
    "owner": "JET Product / Legal",
    "blockingStage": "Production launch",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-002",
    "topic": "First IFP off-exchange carrier",
    "question": "Which carrier and products are the first production PDF/EDI targets?",
    "whyItMatters": "Forms, mapping, EDI certification and payment posture.",
    "owner": "JET Product / Carrier Ops",
    "blockingStage": "Carrier certification",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-003",
    "topic": "Dental carrier and plan set",
    "question": "Which dental carrier, plans, rating method and forms are approved?",
    "whyItMatters": "Determines canned data, quotes and application output.",
    "owner": "JET Product / Carrier Ops",
    "blockingStage": "Product activation",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-004",
    "topic": "Vision carrier and plan set",
    "question": "Which vision carrier, plans, rating method and forms are approved?",
    "whyItMatters": "Determines canned data, quotes and application output.",
    "owner": "JET Product / Carrier Ops",
    "blockingStage": "Product activation",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-005",
    "topic": "Carrier EDI specifications",
    "question": "What schemas, code sets, endpoints and acknowledgements apply?",
    "whyItMatters": "Required for production EDI certification.",
    "owner": "Carrier Ops / Engineering",
    "blockingStage": "Carrier certification",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-006",
    "topic": "Approved forms and PDF templates",
    "question": "Which state/carrier form and output versions are legally approved?",
    "whyItMatters": "Required for fixed-form production use.",
    "owner": "JET Product / Legal / Carrier Ops",
    "blockingStage": "Product activation",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-007",
    "topic": "Ideon connection and mapping",
    "question": "Which Ideon products, fields, credentials and refresh cadence are available?",
    "whyItMatters": "Required for production IFP plan data.",
    "owner": "JET Product / Engineering",
    "blockingStage": "Product and data gate",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-008",
    "topic": "JET EDE handoff contract",
    "question": "What packet, token, callback, status and legal entity contract applies?",
    "whyItMatters": "Required for on-exchange production handoff.",
    "owner": "JET EDE / Engineering / Legal",
    "blockingStage": "JET EDE gate",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-009",
    "topic": "NIPR verification approach",
    "question": "Which NIPR or licensing provider, credentials and exception process are approved?",
    "whyItMatters": "Required for production verification behavior.",
    "owner": "JET Compliance / Engineering",
    "blockingStage": "Sellability activation",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-010",
    "topic": "Twilio configuration",
    "question": "Which account, sender numbers, messaging service, SendGrid domain and webhook endpoints are approved?",
    "whyItMatters": "Required for production communications.",
    "owner": "JET Operations / Engineering",
    "blockingStage": "Communication activation",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-011",
    "topic": "PlanAI deployment approval",
    "question": "Which model, prompt, knowledge set, disclosures and legal mode may launch?",
    "whyItMatters": "Required for PlanAI production enablement.",
    "owner": "JET Product / Legal / AI Governance",
    "blockingStage": "Legal and AI gate",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-012",
    "topic": "Future payment provider",
    "question": "Which vendor and carrier pathways will require live payment?",
    "whyItMatters": "Determines later provider integration and PCI scope.",
    "owner": "JET Product / Finance / Engineering",
    "blockingStage": "Future live payment activation",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-013",
    "topic": "Commercial pricing and entitlements",
    "question": "What fees, seats, features and usage terms apply to selected agencies?",
    "whyItMatters": "Required for monetization and provisioning.",
    "owner": "JET Executive / Finance / Sales",
    "blockingStage": "Commercial readiness",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-014",
    "topic": "Launch cohort",
    "question": "Which agencies and users enter UAT and selected commercial availability?",
    "whyItMatters": "Required for onboarding, training, support and scale assumptions.",
    "owner": "JET Product / Sales / Operations",
    "blockingStage": "Commercial readiness",
    "status": "Open - not a definition blocker"
  },
  {
    "openItemId": "LUC-OQ-015",
    "topic": "Brand assets and theme defaults",
    "question": "Which ABox/JET/agency logos, colors, domains and disclaimer variants are approved?",
    "whyItMatters": "Required for consistent white-label production presentation.",
    "owner": "JET Brand / Product",
    "blockingStage": "Design and launch readiness",
    "status": "Open - not a definition blocker"
  }
];
