/**
 * ABox stable screen ID registry.
 *
 * Every SCR_ / UX_ ID from the IA Handoff Package and Module 1 V4
 * Reconciliation Packet is enumerated here so route files can annotate
 * their identity and phase posture in one place.
 *
 * Phase posture:
 *  - "m1"           → Active Module 1 build (do not disrupt)
 *  - "m1-align"     → Non-breaking IA alignment on top of Module 1
 *  - "phase1"       → Broader Phase 1 (Module 2 candidate / later Phase 1)
 *  - "future"       → Future seam only (stub, no build)
 */
export type PhasePosture = "m1" | "m1-align" | "phase1" | "future";

export interface ScreenMeta {
  id: string;
  name: string;
  workspace:
    | "marketplace"
    | "member"
    | "agent"
    | "agency"
    | "jet"
    | "carrier"
    | "employer"
    | "partner"
    | "system";
  phase: PhasePosture;
  purpose: string;
}

export const SCREENS: Record<string, ScreenMeta> = {
  // ----- Consumer Marketplace (Module 1) -----
  "UX-001": { id: "UX-001", name: "Marketplace Landing", workspace: "marketplace", phase: "m1",
    purpose: "Branded marketplace landing; lead-with-Health/IFP; product cards; ICHRA employer path; persistent help." },
  "UX-002": { id: "UX-002", name: "Product Selection & Path Choice", workspace: "marketplace", phase: "m1",
    purpose: "Choose Plan-O guided vs Browse Myself after selecting product." },
  "UX-003": { id: "UX-003", name: "Quote Wizard — ZIP & Effective Date", workspace: "marketplace", phase: "m1",
    purpose: "ZIP input, county resolution, effective date default = 1st of next month." },
  "UX-004": { id: "UX-004", name: "Quote Wizard — Household Members", workspace: "marketplace", phase: "m1",
    purpose: "Primary DOB, sex, tobacco; add/remove family members with relationship." },
  "UX-005": { id: "UX-005", name: "Plan-O — Goals & Usage", workspace: "marketplace", phase: "m1",
    purpose: "Priority ranking, expected usage, doctor match, plan-O worksheet." },
  "UX-006": { id: "UX-006", name: "Provider & Drug Optional Lookup", workspace: "marketplace", phase: "m1",
    purpose: "Optional provider and drug search; skip option; matched-results feedback." },
  "UX-007": { id: "UX-007", name: "Optional Subsidy Check", workspace: "marketplace", phase: "m1",
    purpose: "Estimated income, tax household size; skip subsidy option." },
  "UX-008": { id: "UX-008", name: "Subsidy Estimate & Education", workspace: "marketplace", phase: "m1",
    purpose: "Estimated APTC/CSR education, disclaimer, continue to plans." },
  "UX-009": { id: "UX-009", name: "Plan Results", workspace: "marketplace", phase: "m1",
    purpose: "Recommended plans, on/off-exchange toggle, filters, cart drawer entry." },
  "UX-010": { id: "UX-010", name: "Plan Detail", workspace: "marketplace", phase: "m1",
    purpose: "Benefits, costs, network + Rx, Plan-O explanation, add to cart / compare." },
  "UX-011": { id: "UX-011", name: "Plan Comparison", workspace: "marketplace", phase: "m1",
    purpose: "Side-by-side comparison up to 5 plans; expandable detailed rows." },
  "UX-012": { id: "UX-012", name: "More Coverage & Ancillary Cards", workspace: "marketplace", phase: "m1",
    purpose: "Dental, vision, life, critical illness, accident, hospital indemnity cards." },
  "UX-013": { id: "UX-013", name: "Cart Drawer", workspace: "marketplace", phase: "m1",
    purpose: "Cart grouped by product type; effective term/plan/status; review & enroll." },
  "UX-014": { id: "UX-014", name: "Review & Enroll Gate", workspace: "marketplace", phase: "m1",
    purpose: "Review by product; per-product validation; next-step explanation and CTA." },
  "UX-015": { id: "UX-015", name: "Registration / Login", workspace: "marketplace", phase: "m1",
    purpose: "Register with email+password or phone OTP; light consent." },
  "UX-016": { id: "UX-016", name: "Consumer Dashboard", workspace: "member", phase: "m1",
    purpose: "Saved quotes, carts, applications, tasks, messages; Plan-O resume summary." },
  "UX-017": { id: "UX-017", name: "Agent Quick Quote — Start", workspace: "agent", phase: "m1",
    purpose: "Start anonymous prospect quote or find existing lead." },
  "UX-018": { id: "UX-018", name: "Agent Quick Quote — Workspace", workspace: "agent", phase: "m1",
    purpose: "Compact quote input, results panel, Plan-O assist, send/add/request follow-up." },
  "UX-019": { id: "UX-019", name: "Agent Send Quote", workspace: "agent", phase: "m1",
    purpose: "Choose plans, channel, template preview, expiration default 7 days." },
  "UX-020": { id: "UX-020", name: "Shared Quote — Read-Only View", workspace: "marketplace", phase: "m1",
    purpose: "Tokenized shared quote; I'm interested; request call; no cart mutation without login." },
  "UX-021": { id: "UX-021", name: "Lead Timeline & Milestones", workspace: "agent", phase: "m1",
    purpose: "Lead timeline with filters; milestones; next action; duplicate detection." },
  "UX-022": { id: "UX-022", name: "Schedule Time / Request Call", workspace: "marketplace", phase: "m1",
    purpose: "Request call form; calendar slot picker; confirmation and task creation." },
  "UX-023": { id: "UX-023", name: "JET Handoff Confirmation", workspace: "marketplace", phase: "m1",
    purpose: "Selected plans; generate handoff packet; open JET marketplace new tab; cart status." },
  "UX-024": { id: "UX-024", name: "Module 1 Config — Branding & Products", workspace: "jet", phase: "m1",
    purpose: "Marketplace branding basics; product availability; ranking; disclosure text." },
  "UX-025": { id: "UX-025", name: "Module 1 Config — Routing & Notifications", workspace: "jet", phase: "m1",
    purpose: "Routing basics; channel/template basics; scheduling availability; Plan-O on/off." },
  "UX-026": { id: "UX-026", name: "AI Review & Confirmation", workspace: "marketplace", phase: "m1",
    purpose: "Review AI-filled fields; confirm / edit; strict confirmation for sensitive next steps." },

  // ----- Broader Phase 1 (Module 2 candidates / later Phase 1) -----
  "SCR_APP_MY_WORK": { id: "SCR_APP_MY_WORK", name: "My Work", workspace: "agent", phase: "phase1",
    purpose: "Prioritized tasks, follow-ups, unread messages, hot leads for the signed-in operator." },
  "SCR_APP_DASHBOARD": { id: "SCR_APP_DASHBOARD", name: "Performance Dashboard", workspace: "agent", phase: "phase1",
    purpose: "Performance cards, funnel, quote activity, commission projection snapshot." },
  "SCR_APP_CUSTOMERS": { id: "SCR_APP_CUSTOMERS", name: "Customers & Leads", workspace: "agent", phase: "phase1",
    purpose: "Unified customer + lead list with segmentation, filters, saved views." },
  "SCR_APP_LEAD_DETAIL": { id: "SCR_APP_LEAD_DETAIL", name: "Lead / Customer Detail", workspace: "agent", phase: "phase1",
    purpose: "Object page with timeline, quotes, applications, communications, tasks." },
  "SCR_APP_COMMUNICATIONS": { id: "SCR_APP_COMMUNICATIONS", name: "Communications", workspace: "agent", phase: "phase1",
    purpose: "Unified inbox: email, SMS, in-app messages; templates and quick replies." },
  "SCR_APP_TASKS": { id: "SCR_APP_TASKS", name: "Tasks", workspace: "agent", phase: "phase1",
    purpose: "Manual and event-triggered tasks with assignments and SLA cues." },
  "SCR_APP_COMMISSIONS": { id: "SCR_APP_COMMISSIONS", name: "Commissions", workspace: "agent", phase: "phase1",
    purpose: "Agent statements, projected earnings, dispute submission." },
  "SCR_APP_OFF_EXCHANGE": { id: "SCR_APP_OFF_EXCHANGE", name: "Off-Exchange Enrollment", workspace: "agent", phase: "phase1",
    purpose: "Intake, dynamic application form, payment capture, submission status." },
  "SCR_AGENCY_SETUP": { id: "SCR_AGENCY_SETUP", name: "Agency & Entity Setup", workspace: "agency", phase: "phase1",
    purpose: "Agency records, relationship graph, master/child hierarchy, entity switching." },
  "SCR_AGENCY_PRODUCERS": { id: "SCR_AGENCY_PRODUCERS", name: "Producers & Licenses", workspace: "agency", phase: "phase1",
    purpose: "Producer records, license & appointment tracking, NIPR reconciliation posture." },
  "SCR_AGENCY_REVENUE": { id: "SCR_AGENCY_REVENUE", name: "Revenue Splits & Referrals", workspace: "agency", phase: "phase1",
    purpose: "Configure revenue splits, referral rewards, hierarchy overrides." },
  "SCR_AGENCY_STATEMENTS": { id: "SCR_AGENCY_STATEMENTS", name: "Agency Statements", workspace: "agency", phase: "phase1",
    purpose: "Statement periods, projected vs booked commissions, exports." },
  "SCR_JET_PRODUCTS": { id: "SCR_JET_PRODUCTS", name: "Product Catalog", workspace: "jet", phase: "phase1",
    purpose: "Registry of products (IFP, Medicare, dental, vision, ICHRA, life, etc.)." },
  "SCR_JET_PRODUCT_BUILDER": { id: "SCR_JET_PRODUCT_BUILDER", name: "Product Builder", workspace: "jet", phase: "phase1",
    purpose: "Configure product schemas, availability rules, versioning." },
  "SCR_JET_APPOINTMENTS": { id: "SCR_JET_APPOINTMENTS", name: "Carrier Appointments", workspace: "jet", phase: "phase1",
    purpose: "Carrier appointment records, state matrix, effective ranges." },
  "SCR_JET_FORM_CONFIG": { id: "SCR_JET_FORM_CONFIG", name: "Form Configurator", workspace: "jet", phase: "phase1",
    purpose: "Field builder, conditional logic, required docs, signature, versioning, preview." },
  "SCR_JET_NOTIFICATIONS": { id: "SCR_JET_NOTIFICATIONS", name: "Notification Scheduler", workspace: "jet", phase: "phase1",
    purpose: "Templates, event triggers, time-based schedules, recurring/delayed sends." },
  "SCR_JET_BRANDING": { id: "SCR_JET_BRANDING", name: "Branding & White-Label", workspace: "jet", phase: "phase1",
    purpose: "Tenant/agency branding tokens, logo, disclosures, live/demo mode." },
  "SCR_JET_ACL": { id: "SCR_JET_ACL", name: "ACL Configuration", workspace: "jet", phase: "phase1",
    purpose: "Global + local ACL policies, role templates, guardrail warnings." },
  "SCR_JET_AUDIT": { id: "SCR_JET_AUDIT", name: "Audit Log", workspace: "jet", phase: "phase1",
    purpose: "Immutable event log with filters, exports, compliance holds." },
  "SCR_JET_AI_GOV": { id: "SCR_JET_AI_GOV", name: "AI / Plan-O Governance", workspace: "jet", phase: "phase1",
    purpose: "Enable/disable per tenant/module/role; knowledge sources; disclaimers; escalation." },
  "SCR_JET_INTEGRATIONS": { id: "SCR_JET_INTEGRATIONS", name: "Integrations", workspace: "jet", phase: "phase1",
    purpose: "Carrier feeds, EDE, drug/provider directories, pay processors, webhook subscriptions." },
  "SCR_EMPLOYER_ICHRA": { id: "SCR_EMPLOYER_ICHRA", name: "Employer ICHRA Quote", workspace: "employer", phase: "phase1",
    purpose: "Group census, deep-quote foundation. Enrollment excluded from Phase 1." },
  "SCR_PARTNER_HOME": { id: "SCR_PARTNER_HOME", name: "Partner / Referral Home", workspace: "partner", phase: "phase1",
    purpose: "Referral submission, status, reward settings visibility." },
  "SCR_SYS_SETTINGS": { id: "SCR_SYS_SETTINGS", name: "Personal Settings", workspace: "system", phase: "phase1",
    purpose: "Profile, notification preferences, theme, security." },
};
