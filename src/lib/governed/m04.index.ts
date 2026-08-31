// GENERATED from the controlled build packet machine-readable registers. Do not hand-edit.
import type { GovernedModuleIndex } from '@/lib/governed/types';

export const M04_INDEX: GovernedModuleIndex = {
 "module": "M04",
 "version": "1.0",
 "meta": {
  "document_control": {
   "package_id": "ABOX-LUCIE-M04-BP",
   "module_id": "M04",
   "module_name": "Marketplace Management and White Labeling",
   "version": "1.0",
   "status": "PRODUCTION_BUILD_READY",
   "controlled_date": "2026-08-20",
   "product_posture": "Lean, fixed, bilingual, accessible and AI-buildable Lucie MVP.",
   "baseline_dependencies": [
    "M00 v1.1 production-build baseline",
    "M05 v1.0 production-build baseline",
    "Protected M01 Release 1",
    "Lucie release handover and dependency analysis"
   ]
  },
  "summary_metrics": {
   "approved_functional_decisions": 145,
   "capabilities": 25,
   "total_requirements": 203,
   "functional_requirements": 145,
   "technical_baseline_requirements": 58,
   "acceptance_criteria": 609,
   "business_rules": 80,
   "validation_rules": 70,
   "canonical_objects": 34,
   "relationships": 35,
   "state_models": 15,
   "invariants": 35,
   "enumerations": 35,
   "workspaces": 4,
   "screens": 36,
   "user_flows": 20,
   "permissions": 55,
   "role_permission_rows": 330,
   "api_operations": 100,
   "events": 70,
   "integrations": 22,
   "upstream_contracts": 20,
   "security_controls": 40,
   "compliance_controls": 24,
   "ai_controls": 6,
   "launch_gates": 23,
   "operations": 28,
   "metrics": 40,
   "reports": 10,
   "runbooks": 22,
   "tests": 294,
   "m00_impacts": 24,
   "proposed_m00_deltas": 15,
   "m05_impacts": 22,
   "proposed_m05_deltas": 14,
   "m01_impacts": 26,
   "proposed_m01_deltas": 17,
   "m1d_review": 25,
   "forward_references": 41,
   "epics": 25,
   "stories": 75,
   "implementation_tasks": 176,
   "traceability_rows": 203
  }
 },
 "workspaces": [
  {
   "workspace_id": "WS-M04-001",
   "code": "JET_MARKETPLACE_OPERATIONS",
   "name": "JET Platform Administration",
   "actors": [
    "JET_PLATFORM_ADMIN"
   ],
   "default_screen": "SCR-M04-001",
   "purpose": "Initial activation, domains, legal and security blocks, owner transition, emergency control and platform operations."
  },
  {
   "workspace_id": "WS-M04-002",
   "code": "ROOT_MARKETPLACE_ADMINISTRATION",
   "name": "Root Agency Marketplace Administration",
   "actors": [
    "AGENCY_ADMIN at M05 tenant-owning root"
   ],
   "default_screen": "SCR-M04-002",
   "purpose": "Configure, preview, publish and operate the shared tenant marketplace."
  },
  {
   "workspace_id": "WS-M04-003",
   "code": "DOWNLINE_MARKETPLACE_PARTICIPATION",
   "name": "Downline Agency Marketplace Participation",
   "actors": [
    "AGENCY_ADMIN at enabled M05 direct downline"
   ],
   "default_screen": "SCR-M04-003",
   "purpose": "View own participation, support identity, links, readiness and correction requests."
  },
  {
   "workspace_id": "WS-M04-004",
   "code": "PUBLIC_MARKETPLACE",
   "name": "Public Marketplace Entry",
   "actors": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "WORKFORCE"
   ],
   "default_screen": "SCR-M04-027",
   "purpose": "Resolve and display the governed marketplace and start enabled pathways."
  }
 ],
 "screens": [
  {
   "id": "SCR-M04-001",
   "slug": "scr-m04-001",
   "module": "M04",
   "name": "JET Marketplace Operations",
   "workspace": "WS-M04-001",
   "route": "/platform/marketplaces",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "JET cross-tenant marketplace operational overview and explicit-context actions.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-002",
   "slug": "scr-m04-002",
   "module": "M04",
   "name": "Marketplace Administration Home",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Root operational summary, release status, blockers and quick actions.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-003",
   "slug": "scr-m04-003",
   "module": "M04",
   "name": "Downline Marketplace Participation",
   "workspace": "WS-M04-003",
   "route": "/agency/marketplace-participation",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT",
    "AGENCY_ADMIN_DOWNLINE"
   ],
   "purpose": "Own participation, support, referral links, readiness and correction requests.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-004",
   "slug": "scr-m04-004",
   "module": "M04",
   "name": "Marketplace Identity and Brand",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/brand",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Display identity, fixed assets, colors and accessible validation.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-005",
   "slug": "scr-m04-005",
   "module": "M04",
   "name": "Marketplace Content and Language",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/content",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "English and Spanish general and channel content and controlled legal assignments.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-006",
   "slug": "scr-m04-006",
   "module": "M04",
   "name": "Marketplace Assets",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/assets",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Upload, scan, validate, preview and retire fixed asset types.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-007",
   "slug": "scr-m04-007",
   "module": "M04",
   "name": "Domains and Public Routes",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/domains",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "JET subdomain, custom-domain request, verification, activation and route continuity.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-008",
   "slug": "scr-m04-008",
   "module": "M04",
   "name": "Custom Domain Request",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/domains/request",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Fixed domain ownership, verification, preview and JET submission flow.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-009",
   "slug": "scr-m04-009",
   "module": "M04",
   "name": "Channels and Product Availability",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/availability",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "State, product line, carrier and channel matrix with canonical blockers.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-010",
   "slug": "scr-m04-010",
   "module": "M04",
   "name": "Availability Entry Detail",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/availability/{availability_entry_id}",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Explain entitlement, product, carrier, geography, participant and integration readiness.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-011",
   "slug": "scr-m04-011",
   "module": "M04",
   "name": "Participants",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/participants",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Direct-downline participant status, channels, support, links and readiness.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-012",
   "slug": "scr-m04-012",
   "module": "M04",
   "name": "Participant Detail",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/participants/{participant_id}",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Enable, suspend, end and review one participant without altering M05 lifecycle.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-013",
   "slug": "scr-m04-013",
   "module": "M04",
   "name": "Referral Links",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/referral-links",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "View, create, copy, revoke and replace organization and agent links.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-014",
   "slug": "scr-m04-014",
   "module": "M04",
   "name": "Referral Link Detail",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/referral-links/{referral_link_id}",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Link status, participant, channel, product, use history and readiness.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-015",
   "slug": "scr-m04-015",
   "module": "M04",
   "name": "Routing and Support Identity",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/routing-support",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Fixed routing posture, root fallback and contextual support.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-016",
   "slug": "scr-m04-016",
   "module": "M04",
   "name": "Marketplace Readiness",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/readiness",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Fixed readiness controls, canonical owner and next action.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-017",
   "slug": "scr-m04-017",
   "module": "M04",
   "name": "Draft versus Active Comparison",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/releases/compare",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Business-impact comparison across release components.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-018",
   "slug": "scr-m04-018",
   "module": "M04",
   "name": "Marketplace Preview",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/preview",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Private language, device, channel, product, participant, referral and scenario preview.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-019",
   "slug": "scr-m04-019",
   "module": "M04",
   "name": "Publication Review",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/releases/review",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Coordinated release scope, continuity, blockers and approval level.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-020",
   "slug": "scr-m04-020",
   "module": "M04",
   "name": "Initial Activation Submission",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/activation",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Submit first production release to JET and review status.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-021",
   "slug": "scr-m04-021",
   "module": "M04",
   "name": "Scheduled Publication",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/releases/schedule",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "One future effective publication with readiness revalidation.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-022",
   "slug": "scr-m04-022",
   "module": "M04",
   "name": "Marketplace Lifecycle",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/lifecycle",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Suspend, reactivate, request ending and review continuity.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-023",
   "slug": "scr-m04-023",
   "module": "M04",
   "name": "Marketplace Tasks and Exceptions",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/work",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Fixed M04 tasks, exceptions, owner module and escalation.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-024",
   "slug": "scr-m04-024",
   "module": "M04",
   "name": "Marketplace History",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/history",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Immutable release, domain, participant, link, routing and JET override history.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-025",
   "slug": "scr-m04-025",
   "module": "M04",
   "name": "Marketplace Operational Health",
   "workspace": "WS-M04-002",
   "route": "/marketplace/admin/health",
   "roles": [
    "JET_PLATFORM_ADMIN",
    "AGENCY_ADMIN_ROOT"
   ],
   "purpose": "Current release, route, content, product, participant, propagation and delta health.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-026",
   "slug": "scr-m04-026",
   "module": "M04",
   "name": "JET Marketplace Override and Reconciliation",
   "workspace": "WS-M04-001",
   "route": "/platform/marketplaces/{marketplace_id}/override",
   "roles": [
    "JET_PLATFORM_ADMIN"
   ],
   "purpose": "Reason-coded JET override, route intervention and propagation reconciliation.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-016"
  },
  {
   "id": "SCR-M04-027",
   "slug": "scr-m04-027",
   "module": "M04",
   "name": "Public Marketplace Home",
   "workspace": "WS-M04-004",
   "route": "/",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Marketplace brand, enabled pathway cards, support, language, attribution and sign-in.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-028",
   "slug": "scr-m04-028",
   "module": "M04",
   "name": "Public Pathway Entry",
   "workspace": "WS-M04-004",
   "route": "/start/{pathway}",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Validated fixed entry into an enabled governed pathway.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-029",
   "slug": "scr-m04-029",
   "module": "M04",
   "name": "Referral Entry Confirmation",
   "workspace": "WS-M04-004",
   "route": "/r/{referral_token}",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Marketplace, agency, agent and new-journey confirmation without record access.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-030",
   "slug": "scr-m04-030",
   "module": "M04",
   "name": "Existing Journey or New Journey Choice",
   "workspace": "WS-M04-004",
   "route": "/journey-choice",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Explicit resume-original, start-new or governed transfer choice.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-031",
   "slug": "scr-m04-031",
   "module": "M04",
   "name": "Named Agent Unavailable",
   "workspace": "WS-M04-004",
   "route": "/agent-unavailable",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Explicit same-agency, another-agent, root, self-service or home alternatives.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-032",
   "slug": "scr-m04-032",
   "module": "M04",
   "name": "No Ready Products",
   "workspace": "WS-M04-004",
   "route": "/no-options",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Safe no-ready-product result and explicit approved next actions.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-033",
   "slug": "scr-m04-033",
   "module": "M04",
   "name": "Marketplace Suspended",
   "workspace": "WS-M04-004",
   "route": "/unavailable/suspended",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "New-start block with permitted sign-in or existing-record continuity.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-034",
   "slug": "scr-m04-034",
   "module": "M04",
   "name": "Marketplace Route Unavailable",
   "workspace": "WS-M04-004",
   "route": "/unavailable/route",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Fail-closed unknown, invalid, suspended or retired route state.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-035",
   "slug": "scr-m04-035",
   "module": "M04",
   "name": "Marketplace Deep-Link Unavailable",
   "workspace": "WS-M04-004",
   "route": "/unavailable/pathway",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "Unavailable pathway with no silent fallback and explicit approved alternatives.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  },
  {
   "id": "SCR-M04-036",
   "slug": "scr-m04-036",
   "module": "M04",
   "name": "Marketplace Support",
   "workspace": "WS-M04-004",
   "route": "/support",
   "roles": [
    "ANONYMOUS",
    "CONSUMER",
    "EMPLOYER_CONTACT",
    "SELLING_AGENT",
    "UNLICENSED_STAFF"
   ],
   "purpose": "One current primary support route for marketplace and responsible organization context.",
   "sections": [
    "Marketplace, tenant and acting context",
    "Primary content and current release state",
    "Blocking, warning or unavailable state",
    "Bilingual support and legal attribution",
    "History or evidence when administrative"
   ],
   "actions": [
    "View",
    "Review",
    "Execute permitted action",
    "Open support or history"
   ],
   "states": [
    "loading",
    "empty",
    "ready",
    "success",
    "warning",
    "blocked",
    "validation_error",
    "permission_denied",
    "suspended",
    "ended",
    "downstream_pending",
    "retry_available"
   ],
   "requirements": [],
   "responsive": "Desktop, tablet and mobile; administration is desktop-first with safe tablet and urgent mobile actions.",
   "localization": "Complete English and Spanish with expansion-safe layouts and governed legal-content versions.",
   "accessibility": "WCAG 2.2 AA; keyboard, focus, screen-reader status, error summary, non-color cues, 200 percent zoom and accessible images.",
   "status": "APPROVED",
   "capability": "CAP-M04-018"
  }
 ],
 "flows": [
  {
   "id": "FLOW-M04-001",
   "slug": "flow-m04-001",
   "module": "M04",
   "name": "Initial marketplace setup and activation",
   "summary": "Root completes identity, brand, content, support, availability, participants, route, preview and readiness and submits the first release to JET.",
   "screens": [
    "SCR-M04-002",
    "SCR-M04-004",
    "SCR-M04-005",
    "SCR-M04-007",
    "SCR-M04-009",
    "SCR-M04-011",
    "SCR-M04-015",
    "SCR-M04-016",
    "SCR-M04-018",
    "SCR-M04-020"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-002",
   "slug": "flow-m04-002",
   "module": "M04",
   "name": "Publish an ordinary brand change",
   "summary": "Root edits both languages and assets, previews, compares and publishes a low-risk coordinated release.",
   "screens": [
    "SCR-M04-004",
    "SCR-M04-005",
    "SCR-M04-006",
    "SCR-M04-017",
    "SCR-M04-018",
    "SCR-M04-019"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-003",
   "slug": "flow-m04-003",
   "module": "M04",
   "name": "Schedule a marketplace release",
   "summary": "Root schedules one future coordinated release and handles readiness failure without partial publication.",
   "screens": [
    "SCR-M04-017",
    "SCR-M04-019",
    "SCR-M04-021",
    "SCR-M04-023"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-004",
   "slug": "flow-m04-004",
   "module": "M04",
   "name": "Request and activate a custom domain",
   "summary": "Root proves domain control, JET verifies and activates, and prior route continuity is preserved.",
   "screens": [
    "SCR-M04-007",
    "SCR-M04-008",
    "SCR-M04-018",
    "SCR-M04-020"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-005",
   "slug": "flow-m04-005",
   "module": "M04",
   "name": "Configure state product carrier availability",
   "summary": "Root configures the fixed matrix and reviews source blockers before release.",
   "screens": [
    "SCR-M04-009",
    "SCR-M04-010",
    "SCR-M04-016",
    "SCR-M04-017"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-006",
   "slug": "flow-m04-006",
   "module": "M04",
   "name": "Enable a direct downline participant",
   "summary": "Root reviews M05 state and readiness, enables channels, support and link posture and publishes the release.",
   "screens": [
    "SCR-M04-011",
    "SCR-M04-012",
    "SCR-M04-015",
    "SCR-M04-016",
    "SCR-M04-019"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-007",
   "slug": "flow-m04-007",
   "module": "M04",
   "name": "Create a downline referral link",
   "summary": "Root or downline creates an attribution-only link on the shared marketplace domain and verifies public entry.",
   "screens": [
    "SCR-M04-013",
    "SCR-M04-014",
    "SCR-M04-029"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-008",
   "slug": "flow-m04-008",
   "module": "M04",
   "name": "Create an agent referral link",
   "summary": "Authorized administrator creates a link for an eligible M06 and M08-confirmed agent.",
   "screens": [
    "SCR-M04-013",
    "SCR-M04-014",
    "SCR-M04-029"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-009",
   "slug": "flow-m04-009",
   "module": "M04",
   "name": "Enter through normal public domain",
   "summary": "M04 resolves marketplace and release and presents only currently enabled pathways before personal data.",
   "screens": [
    "SCR-M04-027",
    "SCR-M04-028"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-010",
   "slug": "flow-m04-010",
   "module": "M04",
   "name": "Enter through participant referral",
   "summary": "M04 resolves link, displays agency or agent context and creates no record until explicit new-journey confirmation.",
   "screens": [
    "SCR-M04-029",
    "SCR-M04-028"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-011",
   "slug": "flow-m04-011",
   "module": "M04",
   "name": "Returning user enters a different referral context",
   "summary": "The user explicitly resumes the original journey, starts a new one or requests a governed transfer.",
   "screens": [
    "SCR-M04-029",
    "SCR-M04-030"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-012",
   "slug": "flow-m04-012",
   "module": "M04",
   "name": "Named agent becomes unavailable",
   "summary": "New routing stops and the consumer explicitly selects an approved alternative.",
   "screens": [
    "SCR-M04-031",
    "SCR-M04-036"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-013",
   "slug": "flow-m04-013",
   "module": "M04",
   "name": "No ready products",
   "summary": "The consumer receives a clear no-options result and only explicit safe alternatives.",
   "screens": [
    "SCR-M04-032",
    "SCR-M04-036"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-014",
   "slug": "flow-m04-014",
   "module": "M04",
   "name": "Suspend and reactivate the marketplace",
   "summary": "Root or JET reviews continuity, suspends new starts and later reactivates after readiness.",
   "screens": [
    "SCR-M04-022",
    "SCR-M04-033",
    "SCR-M04-025"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-015",
   "slug": "flow-m04-015",
   "module": "M04",
   "name": "End a marketplace",
   "summary": "Root requests ending and JET completes offboarding, route, participant and historical continuity.",
   "screens": [
    "SCR-M04-022",
    "SCR-M04-023",
    "SCR-M04-024",
    "SCR-M04-026"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-016",
   "slug": "flow-m04-016",
   "module": "M04",
   "name": "Suspend a participant",
   "summary": "Root stops new routing and links, reviews open work and preserves attribution.",
   "screens": [
    "SCR-M04-012",
    "SCR-M04-023",
    "SCR-M04-024"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-017",
   "slug": "flow-m04-017",
   "module": "M04",
   "name": "Reassign eligible open marketplace work",
   "summary": "Root selects a new organization or eligible agent with consent and history while final records remain protected.",
   "screens": [
    "SCR-M04-015",
    "SCR-M04-023",
    "SCR-M04-024"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-018",
   "slug": "flow-m04-018",
   "module": "M04",
   "name": "Resolve a route or publication failure",
   "summary": "JET inspects health and correlation, restores the active release or prior route and reconciles propagation.",
   "screens": [
    "SCR-M04-025",
    "SCR-M04-026",
    "SCR-M04-024"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-019",
   "slug": "flow-m04-019",
   "module": "M04",
   "name": "Preview participant and failure states",
   "summary": "Root previews downline, agent, suspended and unavailable scenarios in both languages and supported devices.",
   "screens": [
    "SCR-M04-018"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  },
  {
   "id": "FLOW-M04-020",
   "slug": "flow-m04-020",
   "module": "M04",
   "name": "Review and approve a prior-module delta",
   "summary": "Accountable owners review M00, M05 or protected M01 impacts without changing the baseline until approval.",
   "screens": [
    "SCR-M04-001",
    "SCR-M04-024"
   ],
   "languages": [
    "EN",
    "ES"
   ],
   "accessibility": "Every step meets WCAG 2.2 AA and preserves focus, status announcements and explicit context.",
   "status": "APPROVED"
  }
 ]
};
