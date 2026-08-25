/** Canonical module M00–M26 with Lucie posture. Source: ABox_Lucie_Module_Slice_Map_v1.0. */
export interface ModuleSlice {
  moduleId: string;
  canonicalName: string;
  canonicalOwnership: string;
  luciePosture: string;
  lucieScope: string;
  simplificationOrBoundary: string;
  workstream: string;
  stableIdRule: string;
}

export const MODULE_SLICES: ModuleSlice[] = [
  {
    "moduleId": "M00",
    "canonicalName": "ABox Platform Foundation",
    "canonicalOwnership": "Shared identity, tenant, organization, configuration, security, consent, audit, integration, task, event, data and runtime foundations.",
    "luciePosture": "Required foundation",
    "lucieScope": "Shared identity, tenant isolation, ACL, configuration, consent, audit, events, tasks, integration administration, runtime and release controls.",
    "simplificationOrBoundary": "Simplified administration is permitted; production-grade controls are not optional.",
    "workstream": "WS-01",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M01",
    "canonicalName": "IFP Shopping and JET EDE Handoff Profile",
    "canonicalOwnership": "IFP-specific consumer and agent experience using shared catalog, quote, cart, CRM, consent, audit and integration services.",
    "luciePosture": "Production Lucie slice",
    "lucieScope": "IFP on-exchange and off-exchange shopping profile, subsidy/FPL tools, PlanAI, cart, registration, save/resume and JET EDE handoff.",
    "simplificationOrBoundary": "No provider/drug lookup unless separately approved; formal on-exchange application remains outside ABox.",
    "workstream": "WS-02",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M02",
    "canonicalName": "Universal Quote and Cart Platform",
    "canonicalOwnership": "Product-agnostic Shopping Journey, Quote Session, Quote Result, Quote Snapshot, Comparison Set, Cart and Cart Item progression.",
    "luciePosture": "Production Lucie slice",
    "lucieScope": "Reusable Shopping Journey, Quote Session, immutable quote snapshots, compare, mixed cart, save/resume, shared quote and independent next paths.",
    "simplificationOrBoundary": "One simplified commerce spine; no product-specific duplicate carts or quote records.",
    "workstream": "WS-02",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M03",
    "canonicalName": "Product Catalog, Product Publishing and Plan Loading",
    "canonicalOwnership": "Product hierarchy, plans, benefits, rates, formulas, documents associations, availability, publishing and pathway bindings.",
    "luciePosture": "Simplified production",
    "lucieScope": "Ideon IFP loader and fixed mapping; versioned canned dental and vision plans, rating structures, availability, provenance and pathway bindings.",
    "simplificationOrBoundary": "No free-form product builder, formula studio or carrier self-service publishing.",
    "workstream": "WS-02",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M04",
    "canonicalName": "Marketplace Management and White Labeling",
    "canonicalOwnership": "Marketplace identity, branding, channels, product presentation, routing context, disclosures, storefronts and attribution.",
    "luciePosture": "Production Lucie slice",
    "lucieScope": "JET and agency-branded storefront context, basic themes, product visibility, routing context, attribution and disclosures.",
    "simplificationOrBoundary": "Limited white labeling and fixed configuration set; no marketplace network orchestration.",
    "workstream": "WS-01",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M05",
    "canonicalName": "Organization, Relationship and Multi-Tenant Model",
    "canonicalOwnership": "Organization identities, tenants, graph relationships, relationship scope, effective dates and data boundaries.",
    "luciePosture": "Simplified production",
    "lucieScope": "Tenant, organization, simple parent/downline relationships, marketplace context and effective-dated lifecycle.",
    "simplificationOrBoundary": "Expose one-parent/downline operating view while preserving canonical IDs and relationship seams.",
    "workstream": "WS-03",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M06",
    "canonicalName": "Agency, Agent and Network Management",
    "canonicalOwnership": "Agency profiles, agent profiles, affiliations, roles, network operations, onboarding, offboarding, configuration inheritance and captive relationships.",
    "luciePosture": "Simplified production",
    "lucieScope": "Agency and agent profiles, roster, onboarding/offboarding, role templates, one primary active affiliation and basic captivity.",
    "simplificationOrBoundary": "No comprehensive network administration, multi-affiliation UX or deep inheritance editor.",
    "workstream": "WS-03",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M07",
    "canonicalName": "Contract Sharing and Selling-Paper Marketplace",
    "canonicalOwnership": "Private listings and invitations, contract access requests, grants, restrictions, delegation, expiration, revocation and audit.",
    "luciePosture": "Excluded; protected seam",
    "lucieScope": "No contract sharing, selling-paper marketplace, invitation, delegation or revenue-sharing workflow.",
    "simplificationOrBoundary": "Keep IDs and integration boundaries only; do not show production screens.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M08",
    "canonicalName": "Licensing, Appointments, Credentials and Selling Authority",
    "canonicalOwnership": "Producer and agency credentials, appointments, certifications, E&O, validations and authoritative selling or servicing authority decisions.",
    "luciePosture": "Limited production",
    "lucieScope": "Licenses, carrier appointments, NIPR verification, basic captive modes and reason-coded sellability decisions.",
    "simplificationOrBoundary": "Limited rule set and one active affiliation; no full credential marketplace or advanced servicing authority.",
    "workstream": "WS-03",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M09",
    "canonicalName": "Lead, CRM and Customer 360",
    "canonicalOwnership": "Lead, customer, household, employer account, opportunity, timeline, assignment, task, communication, quote, application and policy context.",
    "luciePosture": "Production Lucie slice",
    "lucieScope": "Lead, customer/household, employer account, product opportunities, Customer 360, assignments, notes, tasks and timeline.",
    "simplificationOrBoundary": "Fixed statuses, rules-based routing and basic duplicate handling; no advanced CRM automation.",
    "workstream": "WS-05",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M10",
    "canonicalName": "Notifications, Communications, Templates and Scheduling",
    "canonicalOwnership": "Email, SMS, in-app, voice activity, templates, communication history, workflows, scheduling and calendar connections.",
    "luciePosture": "Production Lucie slice",
    "lucieScope": "Twilio SMS, SendGrid email, native in-app notifications, canned editable templates, delivery webhooks and fixed workflow triggers.",
    "simplificationOrBoundary": "No alternate provider, campaign studio, calendar integration, dialer or voice product.",
    "workstream": "WS-05",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M11",
    "canonicalName": "Vendor Management and Payment Operations",
    "canonicalOwnership": "Provider configuration, tokenized payment method, authorization, capture, status, failures, retry, void and refund references.",
    "luciePosture": "Nonproduction simulation; protected provider seam",
    "lucieScope": "Canned payment page for synthetic card/ACH test scenarios plus production status-only external/pending handling.",
    "simplificationOrBoundary": "No live authorization, capture, settlement or storage of real payment credentials.",
    "workstream": "WS-04",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M12",
    "canonicalName": "Commission Schedule, Revenue Projection and Revenue Sharing",
    "canonicalOwnership": "Schedules, inheritance, splits, overrides, attribution, projections and projection statements.",
    "luciePosture": "Excluded; protected seam",
    "lucieScope": "No commission schedules, projections, statements, reconciliation or producer payouts.",
    "simplificationOrBoundary": "Retain attribution fields and module boundary only.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M13",
    "canonicalName": "Document, Content, Knowledge, Help and Output Services",
    "canonicalOwnership": "Document repository, content, templates, disclosures, knowledge, contextual help and generated outputs.",
    "luciePosture": "Production Lucie slice",
    "lucieScope": "Document storage, fixed application PDFs, e-sign evidence, help inventory, contextual drawer and controlled outputs.",
    "simplificationOrBoundary": "No full output studio, knowledge marketplace or free-form content platform.",
    "workstream": "WS-04",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M14",
    "canonicalName": "AI Agent Platform and Standalone AI Services",
    "canonicalOwnership": "AI runtime, skills, knowledge controls, prompts, models, permissions, logging, guardrails, evidence and deployment modes.",
    "luciePosture": "Required foundation",
    "lucieScope": "AI runtime, approved model/configuration, permissions, evidence, prompts, guardrails and deployment controls for PlanAI.",
    "simplificationOrBoundary": "Single text-only PlanAI profile; no autonomous business agents.",
    "workstream": "WS-07",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M15",
    "canonicalName": "PlanAI Consumer and Agent Shopping Guidance",
    "canonicalOwnership": "Guided shopping, plan explanations, comparison summaries, recommendation rationale, field assistance, resume guidance and escalation.",
    "luciePosture": "Production Lucie slice",
    "lucieScope": "Text-only PlanAI recommendations, explanations, comparison summaries and next-step support for IFP, dental, vision and ICHRA.",
    "simplificationOrBoundary": "No voice, provider/drug matching or autonomous submission/payment behavior.",
    "workstream": "WS-07",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M16",
    "canonicalName": "Calling, Dialer and Voice Intelligence",
    "canonicalOwnership": "Click-to-call, inbound and outbound call logging, disposition, duration, agent and record association through Twilio.",
    "luciePosture": "Excluded; protected seam",
    "lucieScope": "No dialer, embedded call center, recording analytics or voice intelligence.",
    "simplificationOrBoundary": "Twilio may transport transactional SMS and basic voice notifications only; no M16 product surface.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M17",
    "canonicalName": "Cross-Sell, Offer, Bundle and Sponsorship Management",
    "canonicalOwnership": "Product-aware cross-sell, companion and dependency relationships, simple authoritative package pricing, and approved disclosed placements.",
    "luciePosture": "Excluded; protected seam",
    "lucieScope": "No offers, promotions, coupons, sponsorship management or dynamic bundle optimization.",
    "simplificationOrBoundary": "Normal product selection and dental/vision cross-navigation do not instantiate an offer engine.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M18",
    "canonicalName": "Policy, Member Servicing and Renewals",
    "canonicalOwnership": "Confirmed policy records, coverage views, documents, ID cards, demographic/dependent/QLE/termination requests and renewal reminders.",
    "luciePosture": "Excluded; protected seam",
    "lucieScope": "No policy record, member servicing, QLE, terminations, ID cards or renewal workflows.",
    "simplificationOrBoundary": "Applications and handoffs end before policy servicing.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M19",
    "canonicalName": "Medicare Distribution",
    "canonicalOwnership": "Medicare-specific product, quote, compliance, documents, agent and enrollment interfaces.",
    "luciePosture": "Excluded",
    "lucieScope": "No Medicare products, quoting, compliance or enrollment.",
    "simplificationOrBoundary": "Preserve canonical module ID only.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M20",
    "canonicalName": "ICHRA and Employer-Sponsored Shopping",
    "canonicalOwnership": "Employer intake, census quoting, proposal comparison, lead and account context, and agency routing.",
    "luciePosture": "Limited production",
    "lucieScope": "Employer/agent initiated ICHRA account, group/member census, contribution strategies, quoting, proposal and interest routing.",
    "simplificationOrBoundary": "No employee enrollment, eligibility administration, reimbursement or ongoing employer operations.",
    "workstream": "WS-06",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M21",
    "canonicalName": "Ancillary, Supplemental, Add-On and Custom Products",
    "canonicalOwnership": "Full dental and vision commerce and enrollment; quote, interest, cart and handoff for selected supplemental products.",
    "luciePosture": "Limited production",
    "lucieScope": "Dental and vision canned products, rating, quote, compare, cart, fixed forms and configured PDF/EDI pathways.",
    "simplificationOrBoundary": "Life, critical illness, accident and hospital indemnity are excluded.",
    "workstream": "WS-04",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M22",
    "canonicalName": "Fully Insured and Self-Funded Group",
    "canonicalOwnership": "Group employer, census, proposal, underwriting, enrollment, servicing and renewal interfaces.",
    "luciePosture": "Excluded",
    "lucieScope": "No fully insured or self-funded group insurance.",
    "simplificationOrBoundary": "Preserve canonical module ID only.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M23",
    "canonicalName": "Carrier-Led Distribution and Product Publishing",
    "canonicalOwnership": "Carrier marketplace operation, agency onboarding and delegated self-service publishing boundaries.",
    "luciePosture": "Excluded",
    "lucieScope": "No carrier-led marketplace, carrier self-service publishing or carrier agency onboarding.",
    "simplificationOrBoundary": "Preserve canonical module ID only.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M24",
    "canonicalName": "Data Warehouse, Analytics and Reporting",
    "canonicalOwnership": "Canonical event ingestion, governed datasets, operational reporting, dashboards, output metrics, lineage and future BI seams.",
    "luciePosture": "Production Lucie slice",
    "lucieScope": "Operational dashboards, exports, integration health, data-quality checks, event/metric foundation and PlanAI usage evidence.",
    "simplificationOrBoundary": "No open-ended BI authoring, predictive analytics or enterprise data product.",
    "workstream": "WS-08",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M25",
    "canonicalName": "Customer Service, Ticketing and Compliance Case Management",
    "canonicalOwnership": "Service cases, complaint and compliance cases, SLA queues and advanced ticketing.",
    "luciePosture": "Excluded; protected seam",
    "lucieScope": "No full service case management, ticketing or resolution platform.",
    "simplificationOrBoundary": "Tasks and exceptions remain inside CRM/My Work.",
    "workstream": "WS-00",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  },
  {
    "moduleId": "M26",
    "canonicalName": "Forms, Applications and Enrollment Pathways",
    "canonicalOwnership": "Dynamic forms, reusable fields, conditional logic, application capture, review, documents, signatures, submission packages, adapters and pathway runtime.",
    "luciePosture": "Simplified production",
    "lucieScope": "Versioned fixed forms, application lifecycle, review, JET E-Signature, PDF output, EDI output framework and submission states.",
    "simplificationOrBoundary": "No dynamic form configurator, conditional form studio or DocuSign.",
    "workstream": "WS-04",
    "stableIdRule": "Retain canonical module ID; Lucie posture does not redefine Phase 1 or North Star ownership."
  }
];
