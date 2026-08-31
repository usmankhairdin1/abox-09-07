/** Reference-style M00 foundation snapshot. Provides sample rows for the Platform Foundation home screen. */

export interface M00Gate {
  id: string;
  name: string;
  criteria: string;
  owner: string;
  stage: string;
  status: string;
}

export interface M00Risk {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  likelihood: string;
  status: string;
}

export interface M00OpenItem {
  id: string;
  topic: string;
  question: string;
  owner: string;
  stage: string;
}

export interface M00Screen {
  id: string;
  recordId: string;
  name: string;
  workspace: string;
  purpose: string;
  status: string;
}

export const M00_SNAPSHOT = {
  counts: {
    requirements: 128,
    traceableRequirements: 124,
    acceptanceCriteria: 96,
    testScenarios: 84,
    apiOperations: 48,
    eventContracts: 22,
    screens: 52,
    gates: 9,
    tasks: 17,
  },
  gates: [
    { id: "GATE-001", name: "Identity & access", criteria: "AuthN/AuthZ baseline and role templates", owner: "M00", stage: "ARCHITECTURE_REVIEW", status: "PASS" },
    { id: "GATE-002", name: "Environment separation", criteria: "Local / preview / production isolation", owner: "M00", stage: "ARCHITECTURE_REVIEW", status: "PASS" },
    { id: "GATE-003", name: "Audit and change control", criteria: "Immutable logs, migration ordering, approval gates", owner: "M00", stage: "PRODUCTION_READINESS", status: "PASS" },
    { id: "GATE-004", name: "Privacy & PII handling", criteria: "Tokenization, masking, retention policy", owner: "M00", stage: "SECURITY_REVIEW", status: "PASS" },
    { id: "GATE-005", name: "Dependency scanning", criteria: "No critical/high vulnerabilities in prod deps", owner: "SecOps", stage: "SECURITY_REVIEW", status: "PASS" },
    { id: "GATE-006", name: "Error handling", criteria: "Boundary errors captured, user-safe messages", owner: "M00", stage: "UAT", status: "PASS" },
    { id: "GATE-007", name: "Performance baseline", criteria: "Core routes < 500ms TTFB", owner: "M00", stage: "UAT", status: "PASS" },
    { id: "GATE-008", name: "Rollback runbook", criteria: "DB and deploy rollback tested", owner: "M00", stage: "PRODUCTION_READINESS", status: "PASS" },
    { id: "GATE-009", name: "Launch observability", criteria: "Health, metrics, alerts wired", owner: "M00", stage: "LAUNCH", status: "PASS" },
  ] satisfies M00Gate[],
  risks: [
    { id: "RISK-001", title: "Schema migration ordering", description: "V001–V007 must run before V008; reverse order breaks foreign keys.", severity: "HIGH", likelihood: "Unlikely", status: "MITIGATED" },
    { id: "RISK-002", title: "Magic-link replay", description: "Single-use tokens must be revoked after first use.", severity: "CRITICAL", likelihood: "Rare", status: "MITIGATED" },
    { id: "RISK-003", title: "PII in error logs", description: "Error capture must filter tokens, SSN, DOB.", severity: "HIGH", likelihood: "Possible", status: "MONITORING" },
    { id: "RISK-004", title: "Third-party provider unavailability", description: "E-delegated evidence and carrier lookup fallbacks.", severity: "MEDIUM", likelihood: "Possible", status: "ACCEPTED" },
  ] satisfies M00Risk[],
  openItems: [
    { id: "OPEN-001", topic: "Lifecycle hooks", question: "When should tenant-initiated deletions cascade vs soft-delete?", owner: "M00", stage: "DESIGN_REVIEW" },
    { id: "OPEN-002", topic: "Feature flags", question: "Should PlanAI recommendations be gated per marketplace or per user?", owner: "M04/M00", stage: "DESIGN_REVIEW" },
  ] satisfies M00OpenItem[],
  screens: [
    { id: "SCR_PLATFORM_HOME", recordId: "SCR_PLATFORM_HOME", name: "Platform Foundation Home", workspace: "WS_JET_ADMIN", purpose: "Governed control surface for M00 baseline.", status: "IMPLEMENTED" },
    { id: "SCR_AUDIT_LOG", recordId: "SCR_AUDIT_LOG", name: "Audit Log", workspace: "WS_JET_ADMIN", purpose: "Immutable record of controlled changes.", status: "IMPLEMENTED" },
    { id: "SCR_ACL_MATRIX", recordId: "SCR_ACL_MATRIX", name: "ACL Matrix", workspace: "WS_JET_ADMIN", purpose: "Role-to-permission mapping and enforcement.", status: "IMPLEMENTED" },
  ] satisfies M00Screen[],
};
