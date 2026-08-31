/**
 * Lucie Release — business-experience model (WS-02 / WS-04).
 *
 * Encodes the release's fixed carrier pathways and the mandatory state
 * separation carried forward from the Lucie Charter:
 *   availability → quoteability → sellability → enrollability →
 *   application readiness → output generation (PDF / EDI) →
 *   external handoff → confirmed external outcome.
 *
 * PDF is not carrier acceptance. EDI is not confirmed submission.
 * EDE handoff is not enrollment. Simulation is not payment.
 *
 * This module is presentation/business logic for the Lucie slice only;
 * it does not read, weaken, or bypass the governed M00 control store.
 */
import type { ProductType } from "./cart-store";

/** LUC pathway matrix (5 product pathways). */
export type PathwayId =
  | "IFP_ON_EXCHANGE"
  | "OFFEX_QUOTE_ONLY"
  | "OFFEX_APPLICATION_PDF"
  | "OFFEX_APPLICATION_EDI"
  | "ICHRA_INTEREST";

export interface Pathway {
  id: PathwayId;
  label: string;
  summary: string;
  /** Terminal state this pathway can legitimately reach in the Lucie slice. */
  terminalState: string;
  /** What the pathway explicitly does NOT prove. */
  notProof: string;
  collectsApplication: boolean;
  requiresSignature: boolean;
  output: "none" | "handoff" | "pdf" | "edi";
}

export const PATHWAYS: Record<PathwayId, Pathway> = {
  IFP_ON_EXCHANGE: {
    id: "IFP_ON_EXCHANGE",
    label: "IFP on-exchange (EDE handoff)",
    summary: "Quote, subsidy estimate, compare and cart inside ABox; enrollment completes through the JET EDE handoff.",
    terminalState: "External handoff issued",
    notProof: "Handoff is not enrollment. Enrollment is confirmed only by the exchange.",
    collectsApplication: false,
    requiresSignature: false,
    output: "handoff",
  },
  OFFEX_QUOTE_ONLY: {
    id: "OFFEX_QUOTE_ONLY",
    label: "Off-exchange — quote only",
    summary: "Carrier is quoteable in this release but not application-enabled. Interest is captured and routed to a licensed agent.",
    terminalState: "Interest captured and routed",
    notProof: "No application exists. Nothing has been submitted to the carrier.",
    collectsApplication: false,
    requiresSignature: false,
    output: "none",
  },
  OFFEX_APPLICATION_PDF: {
    id: "OFFEX_APPLICATION_PDF",
    label: "Off-exchange — application + PDF",
    summary: "Fixed versioned application, e-signature, then a generated carrier PDF packet for delivery.",
    terminalState: "Signed PDF packet generated",
    notProof: "A generated PDF is not carrier acceptance and not an in-force policy.",
    collectsApplication: true,
    requiresSignature: true,
    output: "pdf",
  },
  OFFEX_APPLICATION_EDI: {
    id: "OFFEX_APPLICATION_EDI",
    label: "Off-exchange — application + EDI",
    summary: "Fixed versioned application, e-signature, then an EDI enrollment transaction prepared for the carrier.",
    terminalState: "EDI transaction generated",
    notProof: "A generated EDI file is not a confirmed submission and not an in-force policy.",
    collectsApplication: true,
    requiresSignature: true,
    output: "edi",
  },
  ICHRA_INTEREST: {
    id: "ICHRA_INTEREST",
    label: "ICHRA — quote and interest routing",
    summary: "Census, contribution strategy and employee quoting; interest is captured and routed. No administration in this release.",
    terminalState: "Interest captured and routed",
    notProof: "Routing is not ICHRA administration and not enrollment.",
    collectsApplication: false,
    requiresSignature: false,
    output: "none",
  },
};

/**
 * Fixed carrier pathway assignment for the Lucie launch footprint.
 * Carrier and form specifics are configuration; no values are invented
 * beyond the demonstrable release posture.
 */
const CARRIER_PATHWAY: Record<string, PathwayId> = {
  "Cedar Health": "OFFEX_APPLICATION_EDI",
  "Northwind Health": "OFFEX_APPLICATION_PDF",
  "Blue Ridge": "OFFEX_APPLICATION_PDF",
  "Summit Mutual": "OFFEX_QUOTE_ONLY",
};

export function resolvePathway(input: {
  productType: ProductType;
  carrier?: string;
  onExchange?: boolean;
}): Pathway {
  if (input.productType === "ichra") return PATHWAYS.ICHRA_INTEREST;
  if (input.productType === "ifp" && input.onExchange !== false) return PATHWAYS.IFP_ON_EXCHANGE;
  const mapped = input.carrier ? CARRIER_PATHWAY[input.carrier] : undefined;
  if (mapped) return PATHWAYS[mapped];
  // Dental and vision ship on canned plan structures with fixed enrollment forms.
  if (input.productType === "dental" || input.productType === "vision") {
    return PATHWAYS.OFFEX_APPLICATION_PDF;
  }
  return PATHWAYS.OFFEX_APPLICATION_PDF;
}

/** Application readiness is a separate state from enrollability. */
export type ReadinessKey = "applicant" | "household" | "coverage" | "consent" | "signature";

export const READINESS_LABEL: Record<ReadinessKey, string> = {
  applicant: "Applicant identity captured",
  household: "Household and coverage basis captured",
  coverage: "Plan and effective date confirmed",
  consent: "Typed consent and disclosures accepted",
  signature: "Applicant e-signature captured",
};

/**
 * Surface classification — which screens are M00 governance surfaces and
 * which are Lucie Release end-user business experiences.
 */
export type SurfaceClass = "m00-governance" | "lucie-business";

export const SURFACE_CLASSIFICATION: {
  route: string;
  name: string;
  klass: SurfaceClass;
  note: string;
}[] = [
  { route: "/app/jet/platform", name: "Platform Foundation (M00)", klass: "m00-governance", note: "Publishes the governed M00 baseline: registers, gates, risks, open items, change control." },
  { route: "/app/jet/acl", name: "ACL & Roles", klass: "m00-governance", note: "Fixed roles and permission matrix — M00 authorization foundation." },
  { route: "/app/jet/audit", name: "Audit Log", klass: "m00-governance", note: "M00 audit and evidence foundation." },
  { route: "/app/jet/integrations", name: "Integrations", klass: "m00-governance", note: "M00 integration control plane." },
  { route: "/app/jet/ai-governance", name: "AI Governance", klass: "m00-governance", note: "PlanAI governance posture; legal mode disabled by default." },
  { route: "/quote", name: "Quote Wizard", klass: "lucie-business", note: "WS-02 — consumer quote intake." },
  { route: "/plans", name: "Plan Results", klass: "lucie-business", note: "WS-02 — quoteable plan set and match." },
  { route: "/compare", name: "Plan Comparison", klass: "lucie-business", note: "WS-02 — side-by-side compare." },
  { route: "/cart", name: "Cart", klass: "lucie-business", note: "WS-02 — multi-product cart." },
  { route: "/review", name: "Review & Enroll Gate", klass: "lucie-business", note: "WS-02/WS-04 — pathway routing gate." },
  { route: "/apply", name: "Off-Exchange Application", klass: "lucie-business", note: "WS-04 — fixed application runtime, signature, PDF/EDI output." },
  { route: "/handoff", name: "EDE Handoff", klass: "lucie-business", note: "WS-02 — on-exchange handoff packet." },
  { route: "/app/employer/ichra", name: "ICHRA Quoting", klass: "lucie-business", note: "WS-06 — census, contribution, interest routing." },
];
