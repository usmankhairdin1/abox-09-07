// GENERATED from the controlled build packet machine-readable registers. Do not hand-edit.
import type { GovernedModuleIndex } from '@/lib/governed/types';

export const M05_INDEX: GovernedModuleIndex = {
 "module": "M05",
 "version": "1.0",
 "meta": {
  "document_control": {
   "package_id": "ABOX-LUCIE-M05-BP",
   "module_id": "M05",
   "module_name": "Organization, Relationship and Multi-Tenant Model",
   "version": "1.0",
   "status": "PRODUCTION_BUILD_READY",
   "controlled_date": "2026-08-18",
   "product_posture": "Lean, fixed, bilingual, accessible and AI-buildable Lucie MVP.",
   "baseline_dependencies": [
    "M00 v1.1 production-build baseline",
    "Protected M01 Release 1",
    "Lucie handover and dependency analysis"
   ],
   "reference_inputs": [
    "AMS_Agency_and_Agent_Mgmt.xlsx as REFERENCE_ONLY_NON_BASELINE"
   ]
  },
  "summary_metrics": {
   "approved_functional_decisions": 145,
   "capabilities": 24,
   "total_requirements": 199,
   "functional_requirements": 145,
   "technical_baseline_requirements": 54,
   "acceptance_criteria": 597,
   "business_rules": 75,
   "validation_rules": 60,
   "canonical_objects": 31,
   "relationships": 33,
   "state_models": 12,
   "invariants": 30,
   "workspaces": 3,
   "screens": 30,
   "user_flows": 16,
   "permissions": 50,
   "role_permission_rows": 300,
   "api_operations": 92,
   "events": 61,
   "integrations": 18,
   "upstream_contracts": 16,
   "security_controls": 35,
   "compliance_controls": 20,
   "ai_controls": 5,
   "launch_gates": 18,
   "operations": 20,
   "metrics": 30,
   "reports": 8,
   "runbooks": 18,
   "tests": 265,
   "m00_impacts": 22,
   "proposed_m00_deltas": 14,
   "m01_impacts": 18,
   "proposed_m01_deltas": 12,
   "m1d_review": 25,
   "ams_reference_dispositions": 37,
   "m06_forward_references": 35,
   "epics": 24,
   "stories": 72,
   "implementation_tasks": 160,
   "traceability_rows": 199
  }
 },
 "workspaces": [
  {
   "workspace_id": "WS-M05-001",
   "code": "JET_PLATFORM_ADMIN",
   "name": "JET Platform Administration",
   "actors": [
    "JET_PLATFORM_ADMIN"
   ],
   "default_screen": "SCR-M05-001",
   "purpose": "Platform, tenant-owner, reference, emergency and support operations."
  },
  {
   "workspace_id": "WS-M05-002",
   "code": "ROOT_AGENCY_ADMIN",
   "name": "Root Agency Administration",
   "actors": [
    "AGENCY_ADMIN at tenant-owning root"
   ],
   "default_screen": "SCR-M05-002",
   "purpose": "Create and fully administer direct downlines and consolidated records."
  },
  {
   "workspace_id": "WS-M05-003",
   "code": "DOWNLINE_AGENCY_ADMIN",
   "name": "Downline Agency Administration",
   "actors": [
    "AGENCY_ADMIN at direct downline"
   ],
   "default_screen": "SCR-M05-003",
   "purpose": "Manage own organization profile, users, readiness, work and history."
  }
 ],
 "screens": [
  {
   "id": "SCR-M05-001",
   "slug": "scr-m05-001",
   "module": "M05",
   "name": "JET Tenant and Organization Operations",
   "workspace": "WS-M05-001",
   "route": "/platform/organizations",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "JET tenant and organization oversight and controlled actions.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-013"
  },
  {
   "id": "SCR-M05-002",
   "slug": "scr-m05-002",
   "module": "M05",
   "name": "Root Agency Administration Home",
   "workspace": "WS-M05-002",
   "route": "/agency/organization-admin",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Operational summary and root quick actions.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-013"
  },
  {
   "id": "SCR-M05-003",
   "slug": "scr-m05-003",
   "module": "M05",
   "name": "Downline Administration Home",
   "workspace": "WS-M05-003",
   "route": "/agency/my-organization",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Own-organization readiness, profile and next actions.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-013"
  },
  {
   "id": "SCR-M05-004",
   "slug": "scr-m05-004",
   "module": "M05",
   "name": "Organization Directory",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Authorized tenant-wide directory and filters.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-013"
  },
  {
   "id": "SCR-M05-005",
   "slug": "scr-m05-005",
   "module": "M05",
   "name": "Organization Structure",
   "workspace": "WS-M05-002",
   "route": "/agency/organization-structure",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Root and direct-downline hierarchy with actions.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-013"
  },
  {
   "id": "SCR-M05-006",
   "slug": "scr-m05-006",
   "module": "M05",
   "name": "Organization Profile",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Fixed profile sections and history.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-013"
  },
  {
   "id": "SCR-M05-007",
   "slug": "scr-m05-007",
   "module": "M05",
   "name": "Create Downline Agency: Identity",
   "workspace": "WS-M05-002",
   "route": "/agency/downlines/new/identity",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Draft identity and duplicate preview.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-008",
   "slug": "scr-m05-008",
   "module": "M05",
   "name": "Create Downline Agency: Legal and Identifiers",
   "workspace": "WS-M05-002",
   "route": "/agency/downlines/new/legal",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Legal fields, evidence and identifiers.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-009",
   "slug": "scr-m05-009",
   "module": "M05",
   "name": "Create Downline Agency: Contacts",
   "workspace": "WS-M05-002",
   "route": "/agency/downlines/new/contacts",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Required contact roles.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-010",
   "slug": "scr-m05-010",
   "module": "M05",
   "name": "Create Downline Agency: Addresses and Offices",
   "workspace": "WS-M05-002",
   "route": "/agency/downlines/new/locations",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Headquarters, mailing and offices.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-011",
   "slug": "scr-m05-011",
   "module": "M05",
   "name": "Create Downline Agency: Settings",
   "workspace": "WS-M05-002",
   "route": "/agency/downlines/new/settings",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Copied defaults and editable settings.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-012",
   "slug": "scr-m05-012",
   "module": "M05",
   "name": "Create Downline Agency: Initial Administrator",
   "workspace": "WS-M05-002",
   "route": "/agency/downlines/new/administrator",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "M00 invitation and membership readiness.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-013",
   "slug": "scr-m05-013",
   "module": "M05",
   "name": "Create Downline Agency: Readiness Review",
   "workspace": "WS-M05-002",
   "route": "/agency/downlines/new/readiness",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Fixed control outcomes and blockers.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-014",
   "slug": "scr-m05-014",
   "module": "M05",
   "name": "Create Downline Agency: Activation",
   "workspace": "WS-M05-002",
   "route": "/agency/downlines/new/activate",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Activation confirmation and result.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-015",
   "slug": "scr-m05-015",
   "module": "M05",
   "name": "Downline Context Banner",
   "workspace": "WS-M05-002",
   "route": "shared-component",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Persistent actual-user, root and downline context.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-016",
   "slug": "scr-m05-016",
   "module": "M05",
   "name": "Organization Readiness",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/readiness",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Control-level readiness and next actions.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-017",
   "slug": "scr-m05-017",
   "module": "M05",
   "name": "Organization Contacts",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/contacts",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Fixed contact roles and visibility.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-018",
   "slug": "scr-m05-018",
   "module": "M05",
   "name": "Organization Addresses and Offices",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/locations",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Address and office history.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-019",
   "slug": "scr-m05-019",
   "module": "M05",
   "name": "Organization External Identifiers",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/identifiers",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Masked identifier and verification history.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-020",
   "slug": "scr-m05-020",
   "module": "M05",
   "name": "Organization Settings",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/settings",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Downline-owned values and root overrides.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-021",
   "slug": "scr-m05-021",
   "module": "M05",
   "name": "Organization Relationship History",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/relationships",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Effective relationship evidence.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-022",
   "slug": "scr-m05-022",
   "module": "M05",
   "name": "Organization Activity and Change History",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/history",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Immutable actor and context before-and-after history.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-023",
   "slug": "scr-m05-023",
   "module": "M05",
   "name": "Organization Imports",
   "workspace": "WS-M05-002",
   "route": "/agency/organization-imports",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Template, upload, validation, preview and commit.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-024",
   "slug": "scr-m05-024",
   "module": "M05",
   "name": "Organization Import Result",
   "workspace": "WS-M05-002",
   "route": "/agency/organization-imports/{import_job_id}",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Row results, errors and committed outcome.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-025",
   "slug": "scr-m05-025",
   "module": "M05",
   "name": "Root Defaults Bulk Application",
   "workspace": "WS-M05-002",
   "route": "/agency/organization-defaults/apply",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Review and apply selected values.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-026",
   "slug": "scr-m05-026",
   "module": "M05",
   "name": "Organization Tasks and Exceptions",
   "workspace": "WS-M05-002",
   "route": "/agency/organization-work",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Fixed M05 work types and escalation.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-027",
   "slug": "scr-m05-027",
   "module": "M05",
   "name": "Organization Suspension and Reactivation",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/lifecycle",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Impact review and governed lifecycle command.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-028",
   "slug": "scr-m05-028",
   "module": "M05",
   "name": "Organization Ending and Offboarding",
   "workspace": "WS-M05-002",
   "route": "/agency/organizations/{organization_id}/ending",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Individual continuity checklist.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-029",
   "slug": "scr-m05-029",
   "module": "M05",
   "name": "Reference Organization Request",
   "workspace": "WS-M05-002",
   "route": "/agency/reference-organizations/request",
   "roles": [
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Carrier and vendor reference request.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  },
  {
   "id": "SCR-M05-030",
   "slug": "scr-m05-030",
   "module": "M05",
   "name": "JET Override and Reconciliation",
   "workspace": "WS-M05-001",
   "route": "/platform/organizations/{organization_id}/override",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Reason-coded override and propagation reconciliation.",
   "sections": [
    "Context and status",
    "Primary content",
    "Blocking or warning state",
    "History and evidence",
    "Help and support"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "warning",
    "blocked",
    "error",
    "permission_denied",
    "downstream_pending"
   ],
   "requirements": [],
   "responsive": "Desktop-first administration; functional tablet; controlled mobile read and urgent actions.",
   "localization": "English and Spanish; expansion-safe; exact governed legal text where applicable.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader labels, error summary, non-color status and 200 percent zoom.",
   "status": "APPROVED",
   "capability": "CAP-M05-004"
  }
 ],
 "flows": [
  {
   "id": "FLOW-M05-001",
   "slug": "flow-m05-001",
   "module": "M05",
   "name": "Create one direct downline",
   "summary": "Root creates, configures, invites administrator, reviews readiness and activates a direct downline.",
   "screens": [
    "SCR-M05-002",
    "SCR-M05-007",
    "SCR-M05-008",
    "SCR-M05-009",
    "SCR-M05-010",
    "SCR-M05-011",
    "SCR-M05-012",
    "SCR-M05-013",
    "SCR-M05-014"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-002",
   "slug": "flow-m05-002",
   "module": "M05",
   "name": "Create downlines by CSV",
   "summary": "Root downloads template, uploads, validates all rows, resolves errors, commits and reviews results.",
   "screens": [
    "SCR-M05-023",
    "SCR-M05-024"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-003",
   "slug": "flow-m05-003",
   "module": "M05",
   "name": "Enter and exit downline context",
   "summary": "Root selects a direct downline, sees persistent context and returns to root without impersonation.",
   "screens": [
    "SCR-M05-004",
    "SCR-M05-005",
    "SCR-M05-015"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-004",
   "slug": "flow-m05-004",
   "module": "M05",
   "name": "Edit and override a downline setting",
   "summary": "Downline edits its permitted value; root reviews and overrides with evidence.",
   "screens": [
    "SCR-M05-006",
    "SCR-M05-020",
    "SCR-M05-022"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-005",
   "slug": "flow-m05-005",
   "module": "M05",
   "name": "Apply root defaults",
   "summary": "Root selects settings and downlines, previews impacts, confirms and reviews results.",
   "screens": [
    "SCR-M05-025",
    "SCR-M05-022"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-006",
   "slug": "flow-m05-006",
   "module": "M05",
   "name": "Review possible duplicate",
   "summary": "Root or JET compares a proposed organization with matches and resolves without automatic merge.",
   "screens": [
    "SCR-M05-007",
    "SCR-M05-026",
    "SCR-M05-030"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-007",
   "slug": "flow-m05-007",
   "module": "M05",
   "name": "Verify an external identifier",
   "summary": "Root submits identifier and evidence; verification result updates readiness.",
   "screens": [
    "SCR-M05-019",
    "SCR-M05-016"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-008",
   "slug": "flow-m05-008",
   "module": "M05",
   "name": "Search across downlines",
   "summary": "Root searches authorized records and opens a result in explicit downline context.",
   "screens": [
    "SCR-M05-004",
    "SCR-M05-015"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-009",
   "slug": "flow-m05-009",
   "module": "M05",
   "name": "Reassign eligible open work",
   "summary": "Root moves eligible open work among root and direct downlines while preserving history and notifying users.",
   "screens": [
    "SCR-M05-026",
    "SCR-M05-022"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-010",
   "slug": "flow-m05-010",
   "module": "M05",
   "name": "Suspend and reactivate a downline",
   "summary": "Root reviews impact, suspends, resolves blockers and reactivates.",
   "screens": [
    "SCR-M05-027",
    "SCR-M05-016"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-011",
   "slug": "flow-m05-011",
   "module": "M05",
   "name": "End a relationship and offboard",
   "summary": "Root or JET completes individual continuity checklist and ends relationship and access safely.",
   "screens": [
    "SCR-M05-028",
    "SCR-M05-021",
    "SCR-M05-022"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-012",
   "slug": "flow-m05-012",
   "module": "M05",
   "name": "Request carrier or vendor reference",
   "summary": "Root requests a controlled reference; JET links, creates or rejects.",
   "screens": [
    "SCR-M05-029",
    "SCR-M05-030"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-013",
   "slug": "flow-m05-013",
   "module": "M05",
   "name": "Resolve propagation failure",
   "summary": "JET inspects correlation, retries or reconciles without false success.",
   "screens": [
    "SCR-M05-030",
    "SCR-M05-026"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-014",
   "slug": "flow-m05-014",
   "module": "M05",
   "name": "Perform authorized export",
   "summary": "Root selects organizations, purpose and field set; export applies masking and expires.",
   "screens": [
    "SCR-M05-004",
    "SCR-M05-024"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-015",
   "slug": "flow-m05-015",
   "module": "M05",
   "name": "Change tenant owner",
   "summary": "JET completes impact review, schedules and executes ownership change without silent data movement.",
   "screens": [
    "SCR-M05-001",
    "SCR-M05-030"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M05-016",
   "slug": "flow-m05-016",
   "module": "M05",
   "name": "Review prior-module delta",
   "summary": "Owner reviews M00 or M01 impact, approves or rejects proposal and preserves baseline.",
   "screens": [
    "SCR-M05-001"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "All steps meet WCAG 2.2 AA and preserve focus and status announcements.",
   "status": "APPROVED"
  }
 ]
};
