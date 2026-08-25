/** Phase 1 IA v2.0 ACL rules and decision points. */
export interface IaAclRule {
  aclId: string;
  rule: string;
  enforcement: string;
  decisionPoint: string;
}

export const IA_ACL_RULES: IaAclRule[] = [
  {
    "aclId": "ACL-IA2-001",
    "rule": "Tenant boundary",
    "enforcement": "Every record access evaluates tenant boundary; cross-tenant access requires an explicit JET-authorized operating relationship and policy.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-002",
    "rule": "Organization relationship scope",
    "enforcement": "Parent, upline, downline and partner visibility derives from effective-dated relationship scope and granted data rights.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-003",
    "rule": "Workspace eligibility",
    "enforcement": "A user may enter only workspaces permitted by identity, role, affiliation and organization relationship.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-004",
    "rule": "Active affiliation context",
    "enforcement": "Agent actions are evaluated under the explicitly selected affiliation and marketplace context.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-005",
    "rule": "Record-level access",
    "enforcement": "Lead, customer, application, policy and task access considers owner, assignment, servicing organization and delegated access.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-006",
    "rule": "Action-level authority",
    "enforcement": "View, create, edit, approve, submit, sign, pay, service, export and administer are independent permissions.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-007",
    "rule": "Selling and servicing authority",
    "enforcement": "Regulated actions require authoritative M08 decisions in addition to UI permissions.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-008",
    "rule": "Sensitive data classification",
    "enforcement": "PII, PHI, payment, security and credential fields require least-privilege field and export controls.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-009",
    "rule": "Configuration envelope",
    "enforcement": "Local administrators may configure only values and policies allowed by global JET guardrails and inherited locks.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-010",
    "rule": "Privileged access",
    "enforcement": "Emergency and support access is time-limited, reason-coded, approved where required and fully audited.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-011",
    "rule": "Consumer self-access",
    "enforcement": "Consumers may access only their own records and explicitly delegated household records.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  },
  {
    "aclId": "ACL-IA2-012",
    "rule": "Aggregate versus detail",
    "enforcement": "Uplines may receive permitted aggregate reporting without receiving unrestricted underlying record access.",
    "decisionPoint": "Server-side policy enforcement; UI mirrors but never substitutes for enforcement."
  }
];
