/** Lucie assumption register. */
export interface Assumption {
  assumptionId: string;
  assumption: string;
  impactIfWrong: string;
}

export const ASSUMPTIONS: Assumption[] = [
  {
    "assumptionId": "LUC-ASM-001",
    "assumption": "Four months means approximately sixteen delivery weeks from approved kickoff.",
    "impactIfWrong": "Workstream windows and staffing assumptions must be rebaselined if wrong."
  },
  {
    "assumptionId": "LUC-ASM-002",
    "assumption": "JET supplies one canonical Lucie product and UX rather than custom code per agency.",
    "impactIfWrong": "White-label and configuration scope expands materially if wrong."
  },
  {
    "assumptionId": "LUC-ASM-003",
    "assumption": "Parallel product, agency, CRM, application, AI and hardening lanes are staffed.",
    "impactIfWrong": "The four-month target becomes unrealistic without parallel execution."
  },
  {
    "assumptionId": "LUC-ASM-004",
    "assumption": "Ideon production data and credentials are available early enough for integration testing.",
    "impactIfWrong": "IFP production activation moves even if the framework is complete."
  },
  {
    "assumptionId": "LUC-ASM-005",
    "assumption": "JET E-Signature is reusable without a new major platform build.",
    "impactIfWrong": "Signature scope and timing expand if the service is not ready."
  },
  {
    "assumptionId": "LUC-ASM-006",
    "assumption": "Twilio and SendGrid accounts can be configured by JET.",
    "impactIfWrong": "Production messaging is blocked without approved sender assets."
  },
  {
    "assumptionId": "LUC-ASM-007",
    "assumption": "Fixed forms and canned plan structures are acceptable for the first carriers.",
    "impactIfWrong": "A dynamic product/form platform would materially change scope."
  },
  {
    "assumptionId": "LUC-ASM-008",
    "assumption": "Carrier-specific PDF and EDI work can be isolated behind reusable adapters.",
    "impactIfWrong": "Carrier selection would otherwise force product-specific forks."
  },
  {
    "assumptionId": "LUC-ASM-009",
    "assumption": "Manual commercial contracts and invoicing are acceptable for Lucie.",
    "impactIfWrong": "Subscription billing and automated invoicing would add major scope."
  },
  {
    "assumptionId": "LUC-ASM-010",
    "assumption": "No commission or policy-servicing operation is required for Lucie monetization.",
    "impactIfWrong": "M12/M18 scope would have to be pulled forward if wrong."
  },
  {
    "assumptionId": "LUC-ASM-011",
    "assumption": "PlanAI remains text-only for Lucie.",
    "impactIfWrong": "Voice introduces additional integration, compliance and QA scope."
  },
  {
    "assumptionId": "LUC-ASM-012",
    "assumption": "Launch-state, carrier and legal inputs arrive before their production gates.",
    "impactIfWrong": "Framework completion alone cannot produce a certified launch."
  }
];
