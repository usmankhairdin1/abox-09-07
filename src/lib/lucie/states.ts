/**
 * State machine register and non-equivalence invariants.
 *
 * Nine states stay separate. Collapsing any two of them is the single most
 * likely way a four-month release starts telling the user something untrue.
 */

export interface StateDef {
  id: string;
  state: string;
  owner: string;
  question: string;
  values: string[];
  decidedBy: string;
  surfaces: string[];
}

export const STATES: StateDef[] = [
  {
    id: "ST-AVAILABILITY",
    state: "Availability",
    owner: "M03",
    question: "Does this product/plan exist for this market, state and effective period?",
    values: ["not loaded", "loaded", "published", "retired"],
    decidedBy: "Product record version, effective dates and market availability rows.",
    surfaces: ["LUC-SCR_PRODUCT_CATALOG", "LUC-SCR_PLAN_EDITOR", "LUC-SCR_CANNED_PLAN_LIBRARY"],
  },
  {
    id: "ST-QUOTEABILITY",
    state: "Quoteability",
    owner: "M02 + M03",
    question: "Can a rate be produced for this household or census right now?",
    values: ["quoteable", "missing rate data", "out of area", "expired rate period"],
    decidedBy: "Rating structure, Ideon load state and effective-date resolution.",
    surfaces: ["LUC-SCR_QUOTE_RESULTS", "LUC-SCR_DV_QUOTE_INTAKE", "LUC-SCR_ICHRA_RESULTS"],
  },
  {
    id: "ST-SELLABILITY",
    state: "Sellability",
    owner: "M08",
    question: "Is this actor authorized to sell this product in this state for this agency?",
    values: ["permitted", "blocked (reason-coded)", "pending verification"],
    decidedBy:
      "Server-side decision over license, appointment, state, captive posture and affiliation. Fails closed.",
    surfaces: ["LUC-SCR_AGENT_READINESS", "LUC-SCR_APPOINTMENTS", "LUC-SCR_CAPTIVE_CONSTRAINTS"],
  },
  {
    id: "ST-ENROLLABILITY",
    state: "Enrollability",
    owner: "M26 + M03",
    question: "Does a governed enrollment pathway exist for this product and carrier?",
    values: ["quote only", "application + PDF", "application + EDI"],
    decidedBy: "Carrier/product pathway binding, not the UI.",
    surfaces: ["LUC-SCR_PATHWAY_BINDINGS", "LUC-SCR_CARRIER_PATHWAY_SETTINGS"],
  },
  {
    id: "ST-APP-READINESS",
    state: "Application readiness",
    owner: "M26",
    question: "Are answers, documents, attestations and signatures complete for this version?",
    values: ["incomplete", "ready", "blocked", "superseded by form version"],
    decidedBy: "Fixed form version validation and required-evidence checks.",
    surfaces: ["LUC-SCR_APPLICATION_REVIEW", "LUC-SCR_DYNAMIC_FORM", "LUC-SCR_ESIGN"],
  },
  {
    id: "ST-EDI-GENERATION",
    state: "EDI generation",
    owner: "M26",
    question: "Was an output artifact produced, and against which mapping version?",
    values: ["not generated", "generated", "generation failed"],
    decidedBy: "Output/EDI generation job with mapping version recorded.",
    surfaces: ["LUC-SCR_SUBMISSION_STATUS", "LUC-SCR_APPLICATION_EXCEPTION_QUEUE"],
  },
  {
    id: "ST-EXTERNAL-HANDOFF",
    state: "External handoff",
    owner: "M01 + M00",
    question: "Was the record handed to an external system, and did it acknowledge receipt?",
    values: ["not handed off", "handed off", "acknowledged", "returned", "failed"],
    decidedBy: "Connector transmission plus callback/webhook evidence.",
    surfaces: ["LUC-SCR_EDE_HANDOFF_REVIEW", "LUC-SCR_WEBHOOK_MONITOR"],
  },
  {
    id: "ST-PAYMENT-POSTURE",
    state: "Payment posture",
    owner: "M11",
    question: "What is the payment arrangement for this item, if any?",
    values: ["none", "simulated (nonproduction)", "external to ABox", "pending at carrier"],
    decidedBy: "Provider seam configuration. Production never simulates.",
    surfaces: ["LUC-SCR_PAYMENT_CAPTURE", "LUC-SCR_PAYMENT_SIMULATION_LAB"],
  },
  {
    id: "ST-EXTERNAL-OUTCOME",
    state: "Confirmed external outcome",
    owner: "M26 + M00",
    question: "Did the external party confirm an accepted, declined or terminated result?",
    values: ["unknown", "accepted", "declined", "withdrawn"],
    decidedBy: "Received external confirmation only. Never inferred from our own action.",
    surfaces: ["LUC-SCR_SUBMISSION_STATUS", "LUC-SCR_AUDIT_EXPLORER"],
  },
];

export interface Invariant {
  id: string;
  claim: string;
  truth: string;
  test: string;
}

export const NON_EQUIVALENCE_INVARIANTS: Invariant[] = [
  {
    id: "INV-01",
    claim: "A generated PDF means the carrier accepted the application.",
    truth: "A generated PDF is an output artifact only.",
    test: "With EDI generation = generated and confirmed external outcome = unknown, no surface, notification or export may render an accepted/enrolled state.",
  },
  {
    id: "INV-02",
    claim: "Generated EDI means the application was submitted.",
    truth: "Generation and transmission are separate states with separate evidence.",
    test: "Transmission requires connector evidence; a generation-only record shows 'generated, not transmitted'.",
  },
  {
    id: "INV-03",
    claim: "JET EDE handoff means the consumer is enrolled.",
    truth: "ABox owns shopping; JET EDE owns formal Exchange enrollment.",
    test: "Handoff sets external handoff = handed off. Enrollment language is prohibited until an external outcome is received.",
  },
  {
    id: "INV-04",
    claim: "Payment simulation means money moved.",
    truth: "Simulation is not authorization, capture, settlement or payment.",
    test: "Simulation is disabled in production, cannot accept real credentials, and its records are labelled nonproduction in every read path.",
  },
  {
    id: "INV-05",
    claim: "Being quoteable means being sellable.",
    truth: "Quoteability is product data; sellability is authority.",
    test: "A quoteable plan with a blocked sellability decision cannot progress, and the block carries a reason code.",
  },
  {
    id: "INV-06",
    claim: "A pathway existing means the pathway is certified.",
    truth: "Enrollability is configuration; certification is a launch gate.",
    test: "An uncertified carrier pathway cannot be activated for production (LUC-GATE-03).",
  },
];
