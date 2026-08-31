/** Reference-style M00 change-control register. */

export interface ChangeRecord {
  id: string;
  subject: string;
  blocks: string;
  decision: string;
  disposition: string;
  status: "OPEN" | "CLOSED" | "DEFERRED";
}

export interface EnvRow {
  name: string;
  purpose: string;
  gate: string;
  state: "AVAILABLE" | "BUILDING" | "RESTRICTED";
}

export interface Phase {
  id: string;
  name: string;
  status: "COMPLETE" | "READY" | "IN_PROGRESS" | "NOT_STARTED";
  evidence: string;
}

export const M00_CHANGE_RECORDS: ChangeRecord[] = [
  { id: "CHG-001", subject: "Scope clarification: off-exchange quoting", blocks: "M01, M04", decision: "Quote-only, no enrollment", disposition: "Off-exchange enrollment deferred to Wave 2.", status: "CLOSED" },
  { id: "CHG-002", subject: "M05 tenant boundary", blocks: "M05", decision: "Tenant-isolated organizations", disposition: "No cross-tenant reads without explicit relationship.", status: "CLOSED" },
  { id: "CHG-003", subject: "PlanAI disclaimer copy", blocks: "M01", decision: "Guidance only · not binding", disposition: "Awaiting legal review.", status: "OPEN" },
];

export const M00_ENVIRONMENTS: EnvRow[] = [
  { name: "Local", purpose: "Developer workstation", gate: "GATE-002", state: "AVAILABLE" },
  { name: "Preview", purpose: "Branch previews and Lovable live preview", gate: "GATE-002", state: "AVAILABLE" },
  { name: "Staging", purpose: "Internal QA / UAT", gate: "GATE-007", state: "AVAILABLE" },
  { name: "Production", purpose: "Live members and agents", gate: "GATE-009", state: "RESTRICTED" },
];

export const M00_PHASES: Phase[] = [
  { id: "PHASE-0", name: "Foundation", status: "COMPLETE", evidence: "Migrations V001–V009, VERIFY passed" },
  { id: "PHASE-1", name: "Marketplace & quoting", status: "READY", evidence: "M04/M01 screens implemented" },
  { id: "PHASE-2", name: "Organization & agency", status: "IN_PROGRESS", evidence: "M05/M06 in build" },
  { id: "PHASE-3", name: "Enrollment & commissions", status: "NOT_STARTED", evidence: "Wave 2" },
];
