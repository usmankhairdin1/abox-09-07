// GENERATED from the controlled build packet machine-readable registers. Do not hand-edit.
import type { GovernedModuleIndex } from '@/lib/governed/types';

export const M06_INDEX: GovernedModuleIndex = {
 "module": "M06",
 "version": "1.0",
 "meta": {
  "document_control": {
   "package_id": "ABOX-LUCIE-M06-BP",
   "module_id": "M06",
   "module_name": "Agency, Agent and Network Management",
   "version": "1.0",
   "status": "PRODUCTION_BUILD_BASELINE",
   "controlled_date": "2026-08-24",
   "activation_status": "NOT_AUTHORIZED",
   "source_precedence": [
    "Approved M06 decisions",
    "Finalized M00/M01/M05/M04 contracts",
    "M06 canonical contracts and requirements",
    "Traceability registers",
    "Narrative documents",
    "Reference-only inputs"
   ],
   "baseline_dependencies": [
    "M00 v1.1",
    "M05 v1.0",
    "M04 v1.0",
    "Protected M01 Release 1"
   ]
  },
  "summary_metrics": {
   "capabilities": 25,
   "decisions": 89,
   "requirements": 135,
   "acceptanceCriteria": 470,
   "tests": 675,
   "objects": 40,
   "relationships": 30,
   "enumerations": 30,
   "stateModels": 15,
   "screens": 35,
   "flows": 18,
   "permissions": 75,
   "apiOperations": 82,
   "events": 77,
   "integrations": 18,
   "securityControls": 40,
   "complianceControls": 20,
   "implementationTasks": 175,
   "priorModuleImpacts": 22,
   "proposedPriorModuleDeltas": 27,
   "approvedPriorModuleDeltas": 0,
   "launchGates": 20,
   "openActivationInputs": 12,
   "user_flows": 18
  }
 },
 "workspaces": [
  {
   "workspace_id": "WS-M06-001",
   "code": "AGENCY_ADMINISTRATION",
   "name": "Agency Administration",
   "actors": [
    "Agency Administration"
   ],
   "default_screen": "SCR-M06-001",
   "purpose": "M06 Agency Administration surfaces governed by the approved screen register."
  },
  {
   "workspace_id": "WS-M06-002",
   "code": "AGENT_OR_COMPOSITE_USER",
   "name": "Agent or composite user",
   "actors": [
    "Agent or composite user"
   ],
   "default_screen": "SCR-M06-003",
   "purpose": "M06 Agent or composite user surfaces governed by the approved screen register."
  }
 ],
 "screens": [
  {
   "id": "SCR-M06-001",
   "slug": "scr-m06-001",
   "module": "M06",
   "name": "Agency Administration Home",
   "workspace": "WS-M06-001",
   "route": "/agency/agency-administration-home",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled agency administration home experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-001"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-001"
  },
  {
   "id": "SCR-M06-002",
   "slug": "scr-m06-002",
   "module": "M06",
   "name": "Agency Roster",
   "workspace": "WS-M06-001",
   "route": "/agency/agency-roster",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled agency roster experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-002"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-002"
  },
  {
   "id": "SCR-M06-003",
   "slug": "scr-m06-003",
   "module": "M06",
   "name": "Agent Profile",
   "workspace": "WS-M06-002",
   "route": "/agency/agent-profile",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled agent profile experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-003"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-003"
  },
  {
   "id": "SCR-M06-004",
   "slug": "scr-m06-004",
   "module": "M06",
   "name": "Agency Profile",
   "workspace": "WS-M06-001",
   "route": "/agency/agency-profile",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled agency profile experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-004"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-004"
  },
  {
   "id": "SCR-M06-005",
   "slug": "scr-m06-005",
   "module": "M06",
   "name": "Add Agent Wizard",
   "workspace": "WS-M06-001",
   "route": "/agency/add-agent-wizard",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled add agent wizard experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-005"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-005"
  },
  {
   "id": "SCR-M06-006",
   "slug": "scr-m06-006",
   "module": "M06",
   "name": "Add Staff Wizard",
   "workspace": "WS-M06-001",
   "route": "/agency/add-staff-wizard",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled add staff wizard experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-006"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-006"
  },
  {
   "id": "SCR-M06-007",
   "slug": "scr-m06-007",
   "module": "M06",
   "name": "Roster-only Conversion",
   "workspace": "WS-M06-001",
   "route": "/agency/roster-only-conversion",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled roster-only conversion experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-007"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-007"
  },
  {
   "id": "SCR-M06-008",
   "slug": "scr-m06-008",
   "module": "M06",
   "name": "Roles and Access Home",
   "workspace": "WS-M06-001",
   "route": "/agency/roles-and-access-home",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled roles and access home experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-008"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-008"
  },
  {
   "id": "SCR-M06-009",
   "slug": "scr-m06-009",
   "module": "M06",
   "name": "System Role Detail",
   "workspace": "WS-M06-001",
   "route": "/agency/system-role-detail",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled system role detail experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-009"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-009"
  },
  {
   "id": "SCR-M06-010",
   "slug": "scr-m06-010",
   "module": "M06",
   "name": "Custom Role Builder",
   "workspace": "WS-M06-001",
   "route": "/agency/custom-role-builder",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled custom role builder experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-010"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-010"
  },
  {
   "id": "SCR-M06-011",
   "slug": "scr-m06-011",
   "module": "M06",
   "name": "Role Version Compare",
   "workspace": "WS-M06-001",
   "route": "/agency/role-version-compare",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled role version compare experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-011"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-011"
  },
  {
   "id": "SCR-M06-012",
   "slug": "scr-m06-012",
   "module": "M06",
   "name": "Role Assignments",
   "workspace": "WS-M06-001",
   "route": "/agency/role-assignments",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled role assignments experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-012"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-012"
  },
  {
   "id": "SCR-M06-013",
   "slug": "scr-m06-013",
   "module": "M06",
   "name": "Effective Access Inspector",
   "workspace": "WS-M06-001",
   "route": "/agency/effective-access-inspector",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled effective access inspector experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-013"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-013"
  },
  {
   "id": "SCR-M06-014",
   "slug": "scr-m06-014",
   "module": "M06",
   "name": "Access Audit",
   "workspace": "WS-M06-001",
   "route": "/agency/access-audit",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled access audit experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-014"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-014"
  },
  {
   "id": "SCR-M06-015",
   "slug": "scr-m06-015",
   "module": "M06",
   "name": "Business Units",
   "workspace": "WS-M06-001",
   "route": "/agency/business-units",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled business units experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-015"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-015"
  },
  {
   "id": "SCR-M06-016",
   "slug": "scr-m06-016",
   "module": "M06",
   "name": "Business Unit Detail",
   "workspace": "WS-M06-001",
   "route": "/agency/business-unit-detail",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled business unit detail experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-016"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-016"
  },
  {
   "id": "SCR-M06-017",
   "slug": "scr-m06-017",
   "module": "M06",
   "name": "Teams",
   "workspace": "WS-M06-001",
   "route": "/agency/teams",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled teams experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-017"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-017"
  },
  {
   "id": "SCR-M06-018",
   "slug": "scr-m06-018",
   "module": "M06",
   "name": "Team Detail",
   "workspace": "WS-M06-001",
   "route": "/agency/team-detail",
   "roles": [
    "access.role.read"
   ],
   "purpose": "Provide the controlled team detail experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-018"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-018"
  },
  {
   "id": "SCR-M06-019",
   "slug": "scr-m06-019",
   "module": "M06",
   "name": "Onboarding Cases",
   "workspace": "WS-M06-001",
   "route": "/agency/onboarding-cases",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled onboarding cases experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-019"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-019"
  },
  {
   "id": "SCR-M06-020",
   "slug": "scr-m06-020",
   "module": "M06",
   "name": "Transfer Case",
   "workspace": "WS-M06-001",
   "route": "/agency/transfer-case",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled transfer case experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-020"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-020"
  },
  {
   "id": "SCR-M06-021",
   "slug": "scr-m06-021",
   "module": "M06",
   "name": "Offboarding Case",
   "workspace": "WS-M06-001",
   "route": "/agency/offboarding-case",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled offboarding case experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-021"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-021"
  },
  {
   "id": "SCR-M06-022",
   "slug": "scr-m06-022",
   "module": "M06",
   "name": "Tasks and Exceptions",
   "workspace": "WS-M06-001",
   "route": "/agency/tasks-and-exceptions",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled tasks and exceptions experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-022"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-022"
  },
  {
   "id": "SCR-M06-023",
   "slug": "scr-m06-023",
   "module": "M06",
   "name": "Readiness Detail",
   "workspace": "WS-M06-001",
   "route": "/agency/readiness-detail",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled readiness detail experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-023"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-023"
  },
  {
   "id": "SCR-M06-024",
   "slug": "scr-m06-024",
   "module": "M06",
   "name": "Operational Eligibility Detail",
   "workspace": "WS-M06-001",
   "route": "/agency/operational-eligibility-detail",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled operational eligibility detail experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-024"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-024"
  },
  {
   "id": "SCR-M06-025",
   "slug": "scr-m06-025",
   "module": "M06",
   "name": "Referral Link Component",
   "workspace": "WS-M06-002",
   "route": "/agency/referral-link-component",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled referral link component experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-025"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-025"
  },
  {
   "id": "SCR-M06-026",
   "slug": "scr-m06-026",
   "module": "M06",
   "name": "Credential Selling Setup Component",
   "workspace": "WS-M06-002",
   "route": "/agency/credential-selling-setup-component",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled credential selling setup component experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-001"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-001"
  },
  {
   "id": "SCR-M06-027",
   "slug": "scr-m06-027",
   "module": "M06",
   "name": "Import Roster",
   "workspace": "WS-M06-001",
   "route": "/agency/import-roster",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled import roster experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-002"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-002"
  },
  {
   "id": "SCR-M06-028",
   "slug": "scr-m06-028",
   "module": "M06",
   "name": "Import Results",
   "workspace": "WS-M06-001",
   "route": "/agency/import-results",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled import results experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-003"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-003"
  },
  {
   "id": "SCR-M06-029",
   "slug": "scr-m06-029",
   "module": "M06",
   "name": "Export Request",
   "workspace": "WS-M06-001",
   "route": "/agency/export-request",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled export request experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-004"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-004"
  },
  {
   "id": "SCR-M06-030",
   "slug": "scr-m06-030",
   "module": "M06",
   "name": "Fixed Reports",
   "workspace": "WS-M06-001",
   "route": "/agency/fixed-reports",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled fixed reports experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-005"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-005"
  },
  {
   "id": "SCR-M06-031",
   "slug": "scr-m06-031",
   "module": "M06",
   "name": "Notification Preferences Projection",
   "workspace": "WS-M06-001",
   "route": "/agency/notification-preferences-projection",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled notification preferences projection experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-006"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-006"
  },
  {
   "id": "SCR-M06-032",
   "slug": "scr-m06-032",
   "module": "M06",
   "name": "Support Context",
   "workspace": "WS-M06-001",
   "route": "/agency/support-context",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled support context experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-007"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-007"
  },
  {
   "id": "SCR-M06-033",
   "slug": "scr-m06-033",
   "module": "M06",
   "name": "Duplicate Review",
   "workspace": "WS-M06-001",
   "route": "/agency/duplicate-review",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled duplicate review experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-008"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-008"
  },
  {
   "id": "SCR-M06-034",
   "slug": "scr-m06-034",
   "module": "M06",
   "name": "Agency Defaults",
   "workspace": "WS-M06-001",
   "route": "/agency/agency-defaults",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled agency defaults experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-009"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-009"
  },
  {
   "id": "SCR-M06-035",
   "slug": "scr-m06-035",
   "module": "M06",
   "name": "Agent Workspace",
   "workspace": "WS-M06-002",
   "route": "/agency/agent-workspace",
   "roles": [
    "workforce.profile.read"
   ],
   "purpose": "Provide the controlled agent workspace experience.",
   "sections": [
    "Context banner",
    "status",
    "content",
    "actions",
    "tasks/exceptions",
    "errors",
    "owner/freshness."
   ],
   "actions": [
    "View",
    "create or update permitted state",
    "inspect reasons, history and owner freshness."
   ],
   "states": [
    "Loading",
    "Ready",
    "Empty",
    "Error",
    "Denied"
   ],
   "requirements": [
    "CAP-M06-010"
   ],
   "responsive": "Desktop and tablet governed layout",
   "localization": "EN/ES bilingual parity",
   "accessibility": "WCAG 2.2 AA",
   "status": "APPROVED",
   "capability": "CAP-M06-010"
  }
 ],
 "flows": [
  {
   "id": "FLOW-M06-001",
   "slug": "flow-m06-001",
   "module": "M06",
   "name": "Create roster-only profile",
   "summary": "Complete create roster-only profile through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-001",
    "SCR-M06-002"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-002",
   "slug": "flow-m06-002",
   "module": "M06",
   "name": "Convert roster-only profile to user",
   "summary": "Complete convert roster-only profile to user through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-003",
    "SCR-M06-004"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-003",
   "slug": "flow-m06-003",
   "module": "M06",
   "name": "Guided agent onboarding",
   "summary": "Complete guided agent onboarding through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-005",
    "SCR-M06-006"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-004",
   "slug": "flow-m06-004",
   "module": "M06",
   "name": "Create and activate custom role",
   "summary": "Complete create and activate custom role through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-007",
    "SCR-M06-008"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-005",
   "slug": "flow-m06-005",
   "module": "M06",
   "name": "Assign role through team",
   "summary": "Complete assign role through team through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-009",
    "SCR-M06-010"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-006",
   "slug": "flow-m06-006",
   "module": "M06",
   "name": "Transfer agent",
   "summary": "Complete transfer agent through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-011",
    "SCR-M06-012"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-007",
   "slug": "flow-m06-007",
   "module": "M06",
   "name": "Suspend and reactivate",
   "summary": "Complete suspend and reactivate through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-013",
    "SCR-M06-014"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-008",
   "slug": "flow-m06-008",
   "module": "M06",
   "name": "Offboard and reassign",
   "summary": "Complete offboard and reassign through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-015",
    "SCR-M06-016"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-009",
   "slug": "flow-m06-009",
   "module": "M06",
   "name": "Resolve duplicate signup",
   "summary": "Complete resolve duplicate signup through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-017",
    "SCR-M06-018"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-010",
   "slug": "flow-m06-010",
   "module": "M06",
   "name": "Import roster",
   "summary": "Complete import roster through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-019",
    "SCR-M06-020"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-011",
   "slug": "flow-m06-011",
   "module": "M06",
   "name": "Export roster or report",
   "summary": "Complete export roster or report through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-021",
    "SCR-M06-022"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-012",
   "slug": "flow-m06-012",
   "module": "M06",
   "name": "Create customer-visible note",
   "summary": "Complete create customer-visible note through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-023",
    "SCR-M06-024"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-013",
   "slug": "flow-m06-013",
   "module": "M06",
   "name": "Resolve blocking exception",
   "summary": "Complete resolve blocking exception through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-025",
    "SCR-M06-026"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-014",
   "slug": "flow-m06-014",
   "module": "M06",
   "name": "Manage availability",
   "summary": "Complete manage availability through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-027",
    "SCR-M06-028"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-015",
   "slug": "flow-m06-015",
   "module": "M06",
   "name": "Request or use referral link",
   "summary": "Complete request or use referral link through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-029",
    "SCR-M06-030"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-016",
   "slug": "flow-m06-016",
   "module": "M06",
   "name": "Apply operational defaults",
   "summary": "Complete apply operational defaults through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-031",
    "SCR-M06-032"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-017",
   "slug": "flow-m06-017",
   "module": "M06",
   "name": "JET support access",
   "summary": "Complete jet support access through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-033",
    "SCR-M06-034"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M06-018",
   "slug": "flow-m06-018",
   "module": "M06",
   "name": "Recover from dependency outage",
   "summary": "Complete recover from dependency outage through the approved M06 owner-aware workflow.",
   "screens": [
    "SCR-M06-035",
    "SCR-M06-001"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "WCAG 2.2 AA with focus and status announcements",
   "status": "APPROVED"
  }
 ]
};
