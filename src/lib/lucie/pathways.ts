/** Product pathway matrix. Source: ABox_Lucie_Product_Pathway_Matrix_v1.0. */
export interface Pathway {
  product: string;
  channels: string;
  quote: string;
  compare: string;
  planai: string;
  cart: string;
  application: string;
  signature: string;
  payment: string;
  nextPath: string;
  productionGate: string;
}

export const PATHWAYS: Pathway[] = [
  {
    "product": "IFP On-Exchange",
    "channels": "D2C; agent initiated; agent assisted; agent takeover",
    "quote": "Full quote plus FPL and subsidy tools",
    "compare": "Yes",
    "planai": "Yes - text only",
    "cart": "Yes",
    "application": "No formal Exchange application in ABox",
    "signature": "Not in ABox for formal Exchange enrollment",
    "payment": "Not in ABox",
    "nextPath": "JET EDE handoff",
    "productionGate": "JET EDE contract, legal/entity posture, launch states and real Ideon data."
  },
  {
    "product": "IFP Off-Exchange",
    "channels": "D2C; agent initiated; agent assisted; agent takeover",
    "quote": "Full quote",
    "compare": "Yes",
    "planai": "Yes - text only",
    "cart": "Yes",
    "application": "Fixed canned form",
    "signature": "JET E-Signature where required",
    "payment": "Nonproduction simulation; production external/pending until vendor selected",
    "nextPath": "Quote only; application + PDF; or application + carrier EDI",
    "productionGate": "Carrier, state, approved form, PDF template and EDI specification."
  },
  {
    "product": "Dental",
    "channels": "D2C; agent initiated; agent assisted; agent takeover",
    "quote": "Canned product-specific rating",
    "compare": "Yes",
    "planai": "Yes - text only",
    "cart": "Yes",
    "application": "Fixed dental form",
    "signature": "JET E-Signature where required",
    "payment": "Nonproduction simulation; production external/pending until vendor selected",
    "nextPath": "Quote only; application + PDF; or application + carrier EDI",
    "productionGate": "Approved canned plans, carrier/state form, rating and submission specification."
  },
  {
    "product": "Vision",
    "channels": "D2C; agent initiated; agent assisted; agent takeover",
    "quote": "Canned product-specific rating",
    "compare": "Yes",
    "planai": "Yes - text only",
    "cart": "Yes",
    "application": "Fixed vision form",
    "signature": "JET E-Signature where required",
    "payment": "Nonproduction simulation; production external/pending until vendor selected",
    "nextPath": "Quote only; application + PDF; or application + carrier EDI",
    "productionGate": "Approved canned plans, carrier/state form, rating and submission specification."
  },
  {
    "product": "ICHRA Employer Quoting",
    "channels": "Employer initiated; agent initiated",
    "quote": "Employer intake, census and contribution-strategy quote",
    "compare": "Proposal/strategy comparison",
    "planai": "Yes - text-only explanation and tradeoffs",
    "cart": "No consumer cart; quote/proposal context",
    "application": "No employee enrollment or employer administration",
    "signature": "Not required for quote/interest route",
    "payment": "Not in Lucie ICHRA scope",
    "nextPath": "Mark interested and route lead/opportunity to configured entity",
    "productionGate": "Contribution methodology, census rules, proposal content and routing destination approved."
  }
];
