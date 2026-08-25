/** Canonical terminology control. */
export interface TerminologyRule {
  term: string;
  canonical: string;
  rule: string;
}

export const TERMINOLOGY: TerminologyRule[] = [
  {
    "term": "Plan-O / Plan O / Plan-AI",
    "canonical": "PlanAI",
    "rule": "Use PlanAI in all new Lucie artifacts; historical sources may retain prior terms for traceability."
  },
  {
    "term": "Lucie as Phase 1",
    "canonical": "Lucie Release sub-slice",
    "rule": "Lucie is not the canonical Phase 1 definition."
  },
  {
    "term": "MVP as prototype",
    "canonical": "Commercially deployable constrained release",
    "rule": "The release is simplified but production obligations still apply."
  },
  {
    "term": "Dummy payment accepted",
    "canonical": "Nonproduction payment simulation",
    "rule": "No real credentials, authorization, payment acceptance or funds movement."
  }
];
