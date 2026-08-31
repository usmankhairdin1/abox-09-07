// GENERATED from the controlled build packet machine-readable registers. Do not hand-edit.
import type { GovernedModuleIndex } from '@/lib/governed/types';

export const M00_INDEX: GovernedModuleIndex = {
 "module": "M00",
 "version": "1.1",
 "meta": {
  "document_control": {
   "package_name": "ABox Lucie M00 Platform Foundation Build Packet",
   "package_id": "ABOX-LUCIE-M00-BP",
   "version": "1.1",
   "status": "PRODUCTION_BUILD_READY",
   "controlled_date": "2026-08-14",
   "module_id": "M00",
   "module_name": "ABox Platform Foundation",
   "preflight_annex": "FND-CTX-001",
   "lucie_posture": "Lean, fixed-behavior, AI-buildable MVP; not a configurable Phase 1 or North Star implementation.",
   "prepared_for": "Athina, Michael, and the JET product, design, engineering, QA, security, privacy, operations and release teams",
   "canonical_registry": "ABox_Lucie_M00_Canonical_Registry_v1.1.json",
   "change_rule": "Stable IDs are never renumbered or reused; behavior changes require controlled change and prior-module impact review.",
   "certification_scope": "Implementation-grade requirements, contracts, migrations, tests, runbooks and governed M01 deltas for production software delivery.",
   "deployment_boundary": "This packet is not deployed software. Production activation still requires implemented code, executed evidence, UAT, security/privacy/legal/provider approvals and JET release authorization."
  },
  "summary_metrics": {
   "approved_decisions": 150,
   "capabilities": 25,
   "requirements": 201,
   "acceptance_criteria": 603,
   "business_rules": 65,
   "validation_rules": 50,
   "canonical_objects": 45,
   "relationships": 35,
   "state_models": 15,
   "invariants": 30,
   "workspaces": 6,
   "screens": 34,
   "ia_extensions": 11,
   "permissions": 93,
   "role_permission_rows": 558,
   "apis": 82,
   "events": 66,
   "integrations": 15,
   "upstream_contracts": 12,
   "security_controls": 30,
   "compliance_controls": 20,
   "ai_controls": 12,
   "launch_gates": 18,
   "operations_controls": 20,
   "metrics": 30,
   "runbooks": 15,
   "tests": 253,
   "m01_impacts": 20,
   "m01_proposed_deltas": 17,
   "m1d_records_reviewed": 25,
   "epics": 25,
   "stories": 75,
   "tasks": 225,
   "integrity_checks": 31,
   "enumerations": 33,
   "production_hardening_records": 7,
   "openapi_operations": 82,
   "asyncapi_events": 66,
   "production_build_status_note": "PRODUCTION_BUILD_READY"
  }
 },
 "workspaces": [
  {
   "workspace_id": "WS-M00-001",
   "code": "WS_PLATFORM_ADMIN",
   "name": "JET Platform Administration",
   "actors": [
    "JET_PLATFORM_ADMIN"
   ],
   "default_screen": "SCR_PLATFORM_HOME",
   "purpose": "Operate tenants, identities, controls, connectors, audit, privacy, releases, and health."
  },
  {
   "workspace_id": "WS-M00-002",
   "code": "WS_AGENCY",
   "name": "Agency Administration",
   "actors": [
    "AGENCY_ADMIN"
   ],
   "default_screen": "SCR_AGENCY_MY_WORK",
   "purpose": "Manage authorized agency users, roles, work, usage visibility, and tenant status."
  },
  {
   "workspace_id": "WS-M00-003",
   "code": "WS_AGENT",
   "name": "Agent Workspace",
   "actors": [
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "default_screen": "SCR_AGENT_MY_WORK",
   "purpose": "Access assigned work, tasks, preferences, and downstream selling/support journeys."
  },
  {
   "workspace_id": "WS-M00-004",
   "code": "WS_CONSUMER_MARKETPLACE",
   "name": "Consumer Shopping",
   "actors": [
    "CONSUMER",
    "ANONYMOUS"
   ],
   "default_screen": "M01_CONSUMER_HOME",
   "purpose": "Shop, save/resume, receive assistance, apply, and hand off through the active marketplace."
  },
  {
   "workspace_id": "WS-M00-005",
   "code": "WS_MEMBER",
   "name": "Member Workspace",
   "actors": [
    "CONSUMER_WITH_CONFIRMED_ENROLLMENT"
   ],
   "default_screen": "SCR_MEMBER_HOME",
   "purpose": "Read confirmed enrollment summary, documents, messages, next actions, preferences, history, and support."
  },
  {
   "workspace_id": "WS-M00-006",
   "code": "WS_EMPLOYER_GROUP",
   "name": "Employer Quoting",
   "actors": [
    "EMPLOYER_CONTACT",
    "SELLING_AGENT"
   ],
   "default_screen": "SCR_EMPLOYER_HOME",
   "purpose": "Start/resume employer quote activity and view next actions; M20 owns domain functionality."
  }
 ],
 "screens": [
  {
   "id": "SCR_PLATFORM_HOME",
   "slug": "scr-platform-home",
   "module": "M00",
   "name": "JET Platform Home",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Platform health, launch status, tenant activation, provider and exception summary.",
   "sections": [],
   "actions": [
    "Open tenant",
    "Review launch gates",
    "Review connector health",
    "Open incidents"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-147"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-025"
  },
  {
   "id": "SCR_TENANTS",
   "slug": "scr-tenants",
   "module": "M00",
   "name": "Tenant Context Directory",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Search and inspect tenant, owning organization, marketplace, activation and dependencies without editing M05/M04 canonical data.",
   "sections": [],
   "actions": [
    "Select active context",
    "Open commercial activation",
    "Open memberships",
    "Suspend supported activity"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-003"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-002"
  },
  {
   "id": "SCR_COMMERCIAL_ENTITLEMENTS",
   "slug": "scr-commercial-entitlements",
   "module": "M00",
   "name": "Commercial Activation and Entitlements",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_VIEW"
   ],
   "purpose": "Manage activation lifecycle, fixed product/channel entitlements and seat allocation.",
   "sections": [],
   "actions": [
    "Activate",
    "Suspend",
    "End",
    "Set entitlements",
    "Set seats",
    "View usage"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-049"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-007"
  },
  {
   "id": "SCR_FEATURE_FLAGS",
   "slug": "scr-feature-flags",
   "module": "M00",
   "name": "Feature and Emergency Controls",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Manage predefined feature targets and emergency disable controls.",
   "sections": [],
   "actions": [
    "Enable",
    "Disable",
    "Schedule effective time",
    "Review affected tenants",
    "Record reason"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-057"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-009"
  },
  {
   "id": "SCR_LAUNCH_GATES",
   "slug": "scr-launch-gates",
   "module": "M00",
   "name": "Launch Gate Control",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "JET_RELEASE_OWNER"
   ],
   "purpose": "Review and record applicable production gate evidence and decisions.",
   "sections": [],
   "actions": [
    "Open gate",
    "Attach evidence",
    "Pass",
    "Fail",
    "Mark N/A",
    "View blockers"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-133"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-020"
  },
  {
   "id": "SCR_ROLE_TEMPLATES",
   "slug": "scr-role-templates",
   "module": "M00",
   "name": "Role and Permission Catalogue",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_VIEW"
   ],
   "purpose": "Read fixed roles, permissions, risk levels and versions.",
   "sections": [],
   "actions": [
    "View role",
    "View permissions",
    "View version history"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-029"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-005"
  },
  {
   "id": "SCR_SUPPORT_ACCESS",
   "slug": "scr-support-access",
   "module": "M00",
   "name": "Privileged Support Access",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN_WITH_PRIVILEGE"
   ],
   "purpose": "Request and operate time-limited audited emergency access.",
   "sections": [],
   "actions": [
    "Request read access",
    "Request write access",
    "Enter reason",
    "End access",
    "View history"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-042"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-006"
  },
  {
   "id": "SCR_AUDIT_EXPLORER",
   "slug": "scr-audit-explorer",
   "module": "M00",
   "name": "Audit Explorer",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_LIMITED"
   ],
   "purpose": "Search authorized immutable platform and tenant audit evidence.",
   "sections": [],
   "actions": [
    "Filter",
    "Open event",
    "Export evidence",
    "View correlation timeline"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-105"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-014"
  },
  {
   "id": "SCR_WEBHOOK_MONITOR",
   "slug": "scr-webhook-monitor",
   "module": "M00",
   "name": "Webhook and Callback Monitor",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Review safe webhook receipt, validation, correlation and processing status.",
   "sections": [],
   "actions": [
    "Filter callbacks",
    "Open receipt",
    "Retry processing",
    "Create exception",
    "Open related job"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-121"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-016"
  },
  {
   "id": "SCR_WORKSPACE_CONFIG",
   "slug": "scr-workspace-config",
   "module": "M00",
   "name": "Workspace and Locale Configuration",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "View fixed workspace catalogue, navigation eligibility, landing options and localization readiness.",
   "sections": [],
   "actions": [
    "View workspace",
    "Preview role",
    "Review translation readiness",
    "Review disabled reasons"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-060"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-010"
  },
  {
   "id": "SCR_INTEGRATION_CATALOG",
   "slug": "scr-integration-catalog",
   "module": "M00",
   "name": "Integration Catalogue",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "View approved connector definitions and required pathways.",
   "sections": [],
   "actions": [
    "Open connector type",
    "Create instance",
    "View supported environments",
    "View owner"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-110"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-016"
  },
  {
   "id": "SCR_CONNECTOR_DETAIL",
   "slug": "scr-connector-detail",
   "module": "M00",
   "name": "Connector Detail",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Configure/test connector instance and review lifecycle, credentials reference, endpoint and scope.",
   "sections": [],
   "actions": [
    "Test",
    "Mark ready",
    "Activate",
    "Suspend",
    "Rotate credential reference",
    "View health"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-113"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-016"
  },
  {
   "id": "SCR_CONNECTOR_RUNS",
   "slug": "scr-connector-runs",
   "module": "M00",
   "name": "Connector Jobs and Reconciliation",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Review jobs, retries, callbacks, reconciliation, failures and exceptions.",
   "sections": [],
   "actions": [
    "Retry safe job",
    "Run reconciliation",
    "Cancel eligible job",
    "Open exception",
    "Export operational evidence"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-120"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-016"
  },
  {
   "id": "SCR_ENVIRONMENTS_RELEASES",
   "slug": "scr-environments-releases",
   "module": "M00",
   "name": "Environments and Releases",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "JET_RELEASE_OWNER"
   ],
   "purpose": "View local/QA/UAT/production controls, immutable artifacts, deployment, activation and rollback.",
   "sections": [],
   "actions": [
    "Open release",
    "Deploy",
    "Activate",
    "Rollback",
    "Compare environment",
    "View provenance"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-114"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-022"
  },
  {
   "id": "SCR_SECURITY_OPERATIONS",
   "slug": "scr-security-operations",
   "module": "M00",
   "name": "Security Operations",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN_WITH_SECURITY"
   ],
   "purpose": "Review authentication abuse, denied access, privileged activity, secrets/credential health and security alerts.",
   "sections": [],
   "actions": [
    "Open alert",
    "Revoke sessions",
    "Suspend identity",
    "Review access denial",
    "Open runbook"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-044"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-023"
  },
  {
   "id": "SCR_PLATFORM_USERS",
   "slug": "scr-platform-users",
   "module": "M00",
   "name": "Platform User Administration",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Search and administer identities, invitations, roles, MFA, sessions and memberships within scope.",
   "sections": [],
   "actions": [
    "Invite",
    "Assign fixed role",
    "Suspend",
    "End",
    "Reset MFA",
    "Revoke sessions"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-041"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-006"
  },
  {
   "id": "SCR_PROVIDER_ROUTING",
   "slug": "scr-provider-routing",
   "module": "M00",
   "name": "Provider Routing and Usage",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_VIEW"
   ],
   "purpose": "Configure agency-owned or JET pay-to-use route for Twilio, DocuSign and secure email and view usage.",
   "sections": [],
   "actions": [
    "Select model",
    "Configure route",
    "Test",
    "Activate",
    "Schedule switch",
    "View usage"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-111"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-017"
  },
  {
   "id": "SCR_PRIVACY_QUEUE",
   "slug": "scr-privacy-queue",
   "module": "M00",
   "name": "Privacy Request Queue",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "JET_COMPLIANCE_REVIEW"
   ],
   "purpose": "Process simple privacy requests through fixed statuses.",
   "sections": [],
   "actions": [
    "Assign",
    "Request information",
    "Complete",
    "Deny with reason",
    "Export response"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-101"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-015"
  },
  {
   "id": "SCR_LEGAL_HOLDS",
   "slug": "scr-legal-holds",
   "module": "M00",
   "name": "Legal Holds",
   "workspace": "WS_PLATFORM_ADMIN",
   "route": "",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "JET_COMPLIANCE_REVIEW"
   ],
   "purpose": "Place, review and release simple legal holds.",
   "sections": [],
   "actions": [
    "Place hold",
    "Review scope",
    "Release hold",
    "View deletion impact"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-107"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-014"
  },
  {
   "id": "SCR_AGENCY_MY_WORK",
   "slug": "scr-agency-my-work",
   "module": "M00",
   "name": "Agency My Work",
   "workspace": "WS_AGENCY",
   "route": "",
   "roles": [
    "AGENCY_ADMIN"
   ],
   "purpose": "Show agency/team assignments, due work, blockers, usage and tenant availability.",
   "sections": [],
   "actions": [
    "Filter work",
    "Reassign in scope",
    "Open task",
    "Open user roster",
    "View availability"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-090"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-014"
  },
  {
   "id": "SCR_AGENCY_ROLES",
   "slug": "scr-agency-roles",
   "module": "M00",
   "name": "Agency Role Assignments",
   "workspace": "WS_AGENCY",
   "route": "",
   "roles": [
    "AGENCY_ADMIN"
   ],
   "purpose": "Assign fixed permitted roles within organization hierarchy.",
   "sections": [],
   "actions": [
    "Assign role",
    "Remove role",
    "View effective access",
    "View denial"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-031"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-005"
  },
  {
   "id": "SCR_AGENCY_USERS",
   "slug": "scr-agency-users",
   "module": "M00",
   "name": "Agency User Administration",
   "workspace": "WS_AGENCY",
   "route": "",
   "roles": [
    "AGENCY_ADMIN"
   ],
   "purpose": "Invite and manage agency users within seat and hierarchy limits.",
   "sections": [],
   "actions": [
    "Invite",
    "Resend",
    "Suspend",
    "Assign role",
    "View seat count"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-041"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-006"
  },
  {
   "id": "SCR_AGENT_MY_WORK",
   "slug": "scr-agent-my-work",
   "module": "M00",
   "name": "Agent My Work",
   "workspace": "WS_AGENT",
   "route": "",
   "roles": [
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Show assigned tasks, exceptions, consumer/external next actions and recent completion.",
   "sections": [],
   "actions": [
    "Open task",
    "Start work",
    "Request information",
    "Complete eligible work"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-090"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-014"
  },
  {
   "id": "SCR_AGENT_TASKS",
   "slug": "scr-agent-tasks",
   "module": "M00",
   "name": "Agent Tasks and Exceptions",
   "workspace": "WS_AGENT",
   "route": "",
   "roles": [
    "SELLING_AGENT",
    "UNLICENSED_STAFF",
    "AGENCY_ADMIN"
   ],
   "purpose": "Search and operate authorized task/exception details and history.",
   "sections": [],
   "actions": [
    "Update status",
    "Add internal note",
    "Retry approved action",
    "Open related record"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-098"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-015"
  },
  {
   "id": "SCR_AGENT_PREFERENCES",
   "slug": "scr-agent-preferences",
   "module": "M00",
   "name": "Agent Preferences",
   "workspace": "WS_AGENT",
   "route": "",
   "roles": [
    "SELLING_AGENT",
    "UNLICENSED_STAFF",
    "AGENCY_ADMIN"
   ],
   "purpose": "Set language and permitted landing preference; view notification defaults.",
   "sections": [],
   "actions": [
    "Change language",
    "Change landing page",
    "Review notification preference"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-063"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-010"
  },
  {
   "id": "SCR_REGISTRATION",
   "slug": "scr-registration",
   "module": "M00",
   "name": "Consumer Registration",
   "workspace": "WS_CONSUMER_MARKETPLACE",
   "route": "",
   "roles": [
    "ANONYMOUS",
    "CONSUMER"
   ],
   "purpose": "Register/verify one global consumer identity in the active marketplace and selected language.",
   "sections": [],
   "actions": [
    "Register",
    "Verify email",
    "Verify telephone",
    "Set password",
    "Accept terms/privacy"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-025"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-004"
  },
  {
   "id": "SCR_MEMBER_HOME",
   "slug": "scr-member-home",
   "module": "M00",
   "name": "Member Home",
   "workspace": "WS_MEMBER",
   "route": "",
   "roles": [
    "CONSUMER_WITH_CONFIRMED_ENROLLMENT"
   ],
   "purpose": "Show confirmed enrollment summary, documents, next actions, source freshness and support.",
   "sections": [],
   "actions": [
    "Open plan summary",
    "Open document",
    "Open next action",
    "Switch to shopping",
    "Contact support"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-097"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-014"
  },
  {
   "id": "SCR_MEMBER_PREFERENCES",
   "slug": "scr-member-preferences",
   "module": "M00",
   "name": "Member Preferences",
   "workspace": "WS_MEMBER",
   "route": "",
   "roles": [
    "CONSUMER",
    "CONSUMER_WITH_CONFIRMED_ENROLLMENT"
   ],
   "purpose": "Manage profile language, accessibility and permitted communication preferences.",
   "sections": [],
   "actions": [
    "Change language",
    "Change communication preference",
    "Request account closure"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-064"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-024"
  },
  {
   "id": "SCR_MEMBER_CONSENTS",
   "slug": "scr-member-consents",
   "module": "M00",
   "name": "Consent and Sharing History",
   "workspace": "WS_MEMBER",
   "route": "",
   "roles": [
    "CONSUMER",
    "CONSUMER_WITH_CONFIRMED_ENROLLMENT"
   ],
   "purpose": "Review consent, agent sharing, representation and withdrawal history.",
   "sections": [],
   "actions": [
    "View evidence",
    "Withdraw optional consent",
    "Revoke representation",
    "Download activity"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-092"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-014"
  },
  {
   "id": "SCR_ACCOUNT_SECURITY",
   "slug": "scr-account-security",
   "module": "M00",
   "name": "Account Security",
   "workspace": "WS_MEMBER",
   "route": "",
   "roles": [
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "WORKFORCE_SELF"
   ],
   "purpose": "Manage password, verified contacts, MFA where applicable, sessions and recovery controls.",
   "sections": [],
   "actions": [
    "Change password",
    "Verify contact",
    "Sign out devices",
    "View sign-ins"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-039"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-004"
  },
  {
   "id": "SCR_CONSUMER_ACTIVITY",
   "slug": "scr-consumer-activity",
   "module": "M00",
   "name": "Account Activity",
   "workspace": "WS_MEMBER",
   "route": "",
   "roles": [
    "CONSUMER",
    "CONSUMER_WITH_CONFIRMED_ENROLLMENT",
    "EMPLOYER_CONTACT"
   ],
   "purpose": "Show simplified user activity including sign-ins, consent, agent sharing, signatures and handoffs.",
   "sections": [],
   "actions": [
    "Filter activity",
    "Download history",
    "Open related transaction"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-105"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-014"
  },
  {
   "id": "SCR_PRIVACY_REQUEST",
   "slug": "scr-privacy-request",
   "module": "M00",
   "name": "Privacy Request",
   "workspace": "WS_MEMBER",
   "route": "",
   "roles": [
    "CONSUMER",
    "CONSUMER_WITH_CONFIRMED_ENROLLMENT",
    "EMPLOYER_CONTACT",
    "WORKFORCE_SELF"
   ],
   "purpose": "Submit and track access, correction, portability, closure, deletion and use/sharing requests.",
   "sections": [],
   "actions": [
    "Create request",
    "View status",
    "Respond to information request",
    "Download result"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-101"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-015"
  },
  {
   "id": "SCR_EDE_HANDOFF_REVIEW",
   "slug": "scr-ede-handoff-review",
   "module": "M00",
   "name": "JET EDE Handoff Review",
   "workspace": "WS_CONSUMER_MARKETPLACE",
   "route": "",
   "roles": [
    "CONSUMER",
    "SELLING_AGENT"
   ],
   "purpose": "Review destination, data sharing authorization, language, provider status, retries and next actions.",
   "sections": [],
   "actions": [
    "Review authorization",
    "Confirm handoff",
    "View pending/failure",
    "Open support"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-116"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-016"
  },
  {
   "id": "SCR_EMPLOYER_HOME",
   "slug": "scr-employer-home",
   "module": "M00",
   "name": "Employer Home",
   "workspace": "WS_EMPLOYER_GROUP",
   "route": "",
   "roles": [
    "EMPLOYER_CONTACT",
    "SELLING_AGENT"
   ],
   "purpose": "Show employer quote resume/start, next actions and support; M20 owns domain details.",
   "sections": [],
   "actions": [
    "Start quote",
    "Resume quote",
    "Open next action",
    "Contact support"
   ],
   "states": [
    "loading",
    "ready",
    "empty",
    "validation_error",
    "system_error",
    "unauthorized",
    "disabled_by_entitlement",
    "disabled_by_feature",
    "blocked_by_gate",
    "provider_pending_or_unavailable",
    "offline_or_retry_safe",
    "success"
   ],
   "requirements": [
    "REQ-M00-027"
   ],
   "responsive": "mobile-first for consumer/member; responsive administrative grids",
   "localization": "",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen reader, zoom, English/Spanish",
   "status": "APPROVED_SPEC",
   "capability": "CAP-M00-004"
  }
 ],
 "flows": []
};
