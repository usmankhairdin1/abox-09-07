/** Lucie delivery lane (WS-00 … WS-08). Source: ABox_Lucie_4_Month_Workstream_Plan_v1.0. */
export interface Workstream {
  workstreamId: string;
  name: string;
  window: string;
  sequence: string;
  parallelLane: string;
  scope: string;
  entryDependencies: string;
  exitCriteria: string;
}

export const WORKSTREAMS: Workstream[] = [
  {
    "workstreamId": "WS-00",
    "name": "Program Control, Source Lock and Convergence Governance",
    "window": "Weeks 1-16",
    "sequence": "0",
    "parallelLane": "Program control",
    "scope": "Source hierarchy, decision control, canonical IDs, protected seams, backlog traceability, release gates and delta management.",
    "entryDependencies": "Approved Lucie handoff package",
    "exitCriteria": "All work items trace to Lucie capability IDs and upstream modules; no silent architecture fork."
  },
  {
    "workstreamId": "WS-01",
    "name": "Platform Shell, Identity, Marketplace and Governance",
    "window": "Weeks 1-6",
    "sequence": "1",
    "parallelLane": "Foundation",
    "scope": "Tenant isolation, authentication, ACL, roles, preferences, themes, white labeling, marketplace shell, audit, consent, settings and integration administration.",
    "entryDependencies": "WS-00 source lock",
    "exitCriteria": "JET admin and agency users can be created, scoped and audited; marketplace shell is production-safe."
  },
  {
    "workstreamId": "WS-02",
    "name": "IFP Commerce, Ideon and JET EDE",
    "window": "Weeks 1-8",
    "sequence": "2",
    "parallelLane": "Commerce",
    "scope": "Ideon loader, fixed IFP mapping, FPL/subsidy tools, quote, compare, PlanAI, cart, registration, save/resume, shared quote and JET EDE handoff.",
    "entryDependencies": "WS-01 identity/tenant foundations; Ideon and EDE contracts available for integration testing",
    "exitCriteria": "Consumer and agent complete IFP on/off shopping; on-ex begins enrollment through validated JET EDE handoff."
  },
  {
    "workstreamId": "WS-03",
    "name": "Agency, Agent, Licensing and Basic Sellability",
    "window": "Weeks 2-8",
    "sequence": "3",
    "parallelLane": "Distribution operations",
    "scope": "Parent-child agencies, roster, roles, captive status, licenses, appointments, NIPR verification and reason-coded sellability.",
    "entryDependencies": "WS-01 organization and ACL foundations",
    "exitCriteria": "Only authorized selling agents can quote/progress within configured agency, carrier and state context."
  },
  {
    "workstreamId": "WS-04",
    "name": "Off-Exchange, Dental, Vision, Applications and Outputs",
    "window": "Weeks 4-11",
    "sequence": "4",
    "parallelLane": "Enrollment",
    "scope": "Fixed forms, pathway settings, PDF generation, EDI framework, JET E-Signature, dental/vision canned products and nonproduction payment simulation.",
    "entryDependencies": "WS-02 cart/product context; WS-03 sellability; carrier form/EDI inputs for production certification",
    "exitCriteria": "Each supported product follows quote-only, application+PDF or application+EDI behavior with traceable status."
  },
  {
    "workstreamId": "WS-05",
    "name": "CRM, Tasks, Twilio Notifications and Help",
    "window": "Weeks 3-10",
    "sequence": "5",
    "parallelLane": "Customer operations",
    "scope": "Lead capture, opportunities, Customer 360, assignment, notes, tasks, canned workflows, Twilio messaging, in-app notifications and help drawer.",
    "entryDependencies": "WS-01 identity/ACL and WS-02 journey events",
    "exitCriteria": "Every shopper/employer activity is operationally visible and actionable; notifications are consent-gated and auditable."
  },
  {
    "workstreamId": "WS-06",
    "name": "ICHRA Employer Quoting and Interest Routing",
    "window": "Weeks 4-10",
    "sequence": "6",
    "parallelLane": "Employer",
    "scope": "Employer account, census, contribution strategies, quote, comparison, proposal and routed interest.",
    "entryDependencies": "WS-01 employer identity; WS-02 quote services; WS-05 CRM/routing",
    "exitCriteria": "Employer or agent can create an ICHRA quote and route enrollment interest to the configured entity."
  },
  {
    "workstreamId": "WS-07",
    "name": "PlanAI and AI Governance",
    "window": "Weeks 3-11",
    "sequence": "7",
    "parallelLane": "AI",
    "scope": "Text-only PlanAI for IFP, dental, vision and ICHRA; evidence, disclaimers, guardrails, approved knowledge and escalation.",
    "entryDependencies": "WS-02 quote context; WS-01 AI access and audit controls",
    "exitCriteria": "Recommendations are non-definitive, traceable, versioned, product-aware and safe for the configured deployment mode."
  },
  {
    "workstreamId": "WS-08",
    "name": "Reporting, Integration Health, QA and Launch Hardening",
    "window": "Weeks 8-16",
    "sequence": "8",
    "parallelLane": "Hardening",
    "scope": "Dashboards, exports, data-quality checks, integration monitoring, accessibility, performance, security, UAT, training and release gates.",
    "entryDependencies": "All feature workstreams produce stable events and statuses",
    "exitCriteria": "Applicable product, legal, security, data, operational and commercial gates pass for selected launch footprint."
  }
];
