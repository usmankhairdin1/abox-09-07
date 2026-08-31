/**
 * Extended sample data — providers, drugs, tasks, messages, statements,
 * agencies, producers, appointments, form templates, AI governance rules,
 * audit events, and integrations. All fabricated. Feeds every Phase 1
 * screen so no page is empty.
 */

export interface SampleProvider {
  id: string; name: string; specialty: string; system: string; inNetwork: boolean;
}
export const SAMPLE_PROVIDERS: SampleProvider[] = [
  { id: "prv-01", name: "Dr. Maya Okoye, MD", specialty: "Primary Care", system: "Piedmont Health", inNetwork: true },
  { id: "prv-02", name: "Dr. Aleksander Rota, DO", specialty: "Cardiology", system: "Meridian Medical", inNetwork: true },
  { id: "prv-03", name: "Dr. Simone LeClair, MD", specialty: "Endocrinology", system: "SunState Care", inNetwork: false },
  { id: "prv-04", name: "Dr. Elias Ford, MD", specialty: "Pediatrics", system: "BluePeak", inNetwork: true },
  { id: "prv-05", name: "Dr. Hana Ito, MD", specialty: "OB/GYN", system: "Aeris Medical Group", inNetwork: true },
];

export interface SampleDrug {
  id: string; name: string; tier: 1 | 2 | 3 | 4 | 5; generic: boolean; monthlyEstimate: number;
}
export const SAMPLE_DRUGS: SampleDrug[] = [
  { id: "rx-01", name: "Lisinopril 10mg", tier: 1, generic: true, monthlyEstimate: 4 },
  { id: "rx-02", name: "Atorvastatin 20mg", tier: 1, generic: true, monthlyEstimate: 5 },
  { id: "rx-03", name: "Ozempic 1mg", tier: 4, generic: false, monthlyEstimate: 385 },
  { id: "rx-04", name: "Levothyroxine 75mcg", tier: 1, generic: true, monthlyEstimate: 6 },
  { id: "rx-05", name: "Humira Pen 40mg", tier: 5, generic: false, monthlyEstimate: 5200 },
];

export interface SampleTask {
  id: string; title: string; leadName?: string; due: string; priority: "high" | "med" | "low";
  status: "open" | "done" | "snoozed"; sla?: string; source: "manual" | "event" | "ai";
}
export const SAMPLE_TASKS: SampleTask[] = [
  { id: "TSK-2011", title: "Send subsidy recap to Renata", leadName: "Renata Alvarez", due: "Today · 4:00 PM", priority: "high", status: "open", sla: "SLA 4h", source: "manual" },
  { id: "TSK-2010", title: "Callback — Marcus Chen", leadName: "Marcus Chen", due: "Today · 5:00 PM", priority: "high", status: "open", sla: "SLA 2h", source: "event" },
  { id: "TSK-2009", title: "Nudge shared quote — expiring", leadName: "Priya Shah", due: "Tomorrow", priority: "med", status: "open", source: "ai" },
  { id: "TSK-2008", title: "Onboarding call — Aisha Traoré", leadName: "Aisha Traoré", due: "Fri · 10:00 AM", priority: "med", status: "open", source: "manual" },
  { id: "TSK-2007", title: "License CE hours reminder", due: "Next Mon", priority: "low", status: "snoozed", source: "system" as unknown as "manual" },
  { id: "TSK-2006", title: "Quote follow-up — Devon Wright", leadName: "Devon Wright", due: "Yesterday", priority: "high", status: "open", sla: "Overdue 22h", source: "event" },
];

export interface SampleMessage {
  id: string; channel: "email" | "sms" | "in-app"; person: string; snippet: string;
  ago: string; unread: boolean; direction: "in" | "out";
}
export const SAMPLE_MESSAGES: SampleMessage[] = [
  { id: "M-01", channel: "email", person: "Priya Shah", snippet: "Thanks — I compared the Silver and Gold options and…", ago: "18m", unread: true, direction: "in" },
  { id: "M-02", channel: "sms", person: "Marcus Chen", snippet: "Can we chat around 5? I have a couple questions on subsidies.", ago: "42m", unread: true, direction: "in" },
  { id: "M-03", channel: "in-app", person: "Aisha Traoré", snippet: "Got it, thanks for confirming the pediatric dental add-on.", ago: "2h", unread: false, direction: "in" },
  { id: "M-04", channel: "email", person: "You → Devon Wright", snippet: "Sharing three plans that match your provider request.", ago: "5h", unread: false, direction: "out" },
  { id: "M-05", channel: "email", person: "Renata Alvarez", snippet: "I'll bring my last year's tax return to our call.", ago: "1d", unread: false, direction: "in" },
];

export interface SampleStatement {
  id: string; period: string; booked: number; projected: number; status: "posted" | "projected" | "disputed";
  carriers: number; policies: number;
}
export const SAMPLE_STATEMENTS: SampleStatement[] = [
  { id: "ST-2026-07", period: "Jul 2026", booked: 12480, projected: 15200, status: "projected", carriers: 6, policies: 47 },
  { id: "ST-2026-06", period: "Jun 2026", booked: 14210, projected: 14210, status: "posted", carriers: 6, policies: 52 },
  { id: "ST-2026-05", period: "May 2026", booked: 13980, projected: 13980, status: "posted", carriers: 5, policies: 49 },
  { id: "ST-2026-04", period: "Apr 2026", booked: 12100, projected: 12800, status: "disputed", carriers: 5, policies: 44 },
  { id: "ST-2026-03", period: "Mar 2026", booked: 11540, projected: 11540, status: "posted", carriers: 5, policies: 41 },
];

export interface SampleEntity {
  id: string; name: string; kind: "agency" | "producer-shop" | "carrier-partner" | "referrer";
  parent?: string; producers: number; states: string[]; status: "active" | "onboarding" | "paused";
}
export const SAMPLE_ENTITIES: SampleEntity[] = [
  { id: "ENT-001", name: "Cedar Grove Insurance", kind: "agency", producers: 24, states: ["GA","FL","AL","SC","TN"], status: "active" },
  { id: "ENT-002", name: "Northwind Health Group", kind: "producer-shop", parent: "ENT-001", producers: 6, states: ["GA","FL"], status: "active" },
  { id: "ENT-003", name: "Union Coast Marketplace", kind: "agency", producers: 11, states: ["CA","NV","AZ"], status: "active" },
  { id: "ENT-004", name: "Ridgeline Referral Co.", kind: "referrer", producers: 0, states: ["GA"], status: "active" },
  { id: "ENT-005", name: "Aeris Direct Partners", kind: "carrier-partner", producers: 3, states: ["FL","TX"], status: "onboarding" },
];

export interface SampleProducer {
  id: string; name: string; npn: string; states: string[]; carriers: number;
  ceHours: number; ceRequired: number; nextExpiry: string; status: "good" | "warning" | "expired";
}
export const SAMPLE_PRODUCERS: SampleProducer[] = [
  { id: "P-1101", name: "Elena Alvarez", npn: "20871034", states: ["GA","FL","SC"], carriers: 8, ceHours: 22, ceRequired: 24, nextExpiry: "Dec 15, 2026", status: "warning" },
  { id: "P-1102", name: "Devon Park", npn: "20871035", states: ["GA","TN"], carriers: 5, ceHours: 24, ceRequired: 24, nextExpiry: "Mar 3, 2027", status: "good" },
  { id: "P-1103", name: "Marta Silveira", npn: "20871036", states: ["FL","GA","AL"], carriers: 7, ceHours: 12, ceRequired: 24, nextExpiry: "Sep 1, 2026", status: "warning" },
  { id: "P-1104", name: "Jamal Reed", npn: "20871037", states: ["GA"], carriers: 3, ceHours: 0, ceRequired: 24, nextExpiry: "Aug 20, 2026", status: "expired" },
  { id: "P-1105", name: "Naomi Ishii", npn: "20871038", states: ["GA","FL","SC","AL","TN"], carriers: 9, ceHours: 24, ceRequired: 24, nextExpiry: "Feb 12, 2027", status: "good" },
];

export interface SampleCarrierAppt {
  id: string; carrier: string; states: string[]; product: string;
  effective: string; terminates?: string; status: "active" | "pending" | "terminated";
}
export const SAMPLE_APPTS: SampleCarrierAppt[] = [
  { id: "APT-01", carrier: "Meridian Health", states: ["GA","FL","AL"], product: "IFP + Dental", effective: "Jan 1, 2025", status: "active" },
  { id: "APT-02", carrier: "BluePeak", states: ["GA","SC","TN"], product: "IFP", effective: "Mar 15, 2024", status: "active" },
  { id: "APT-03", carrier: "SunState", states: ["FL"], product: "IFP + Vision", effective: "Jul 1, 2025", status: "active" },
  { id: "APT-04", carrier: "Aeris", states: ["GA","FL","TX"], product: "Life + Accident", effective: "Feb 1, 2026", status: "pending" },
  { id: "APT-05", carrier: "SmileGuard", states: ["GA","FL","AL","SC","TN"], product: "Dental only", effective: "Jan 1, 2024", terminates: "Dec 31, 2026", status: "active" },
];

export interface SampleProductCatalog {
  key: string; name: string; category: string; version: string; states: number;
  carriers: number; live: boolean; owner: string;
}
export const SAMPLE_PRODUCT_CATALOG: SampleProductCatalog[] = [
  { key: "ifp", name: "IFP — Individual & Family", category: "Health", version: "v1.4", states: 32, carriers: 8, live: true, owner: "JET Product" },
  { key: "dental", name: "Dental — Preferred", category: "Ancillary", version: "v1.1", states: 45, carriers: 5, live: true, owner: "JET Product" },
  { key: "vision", name: "Vision — Standard", category: "Ancillary", version: "v1.0", states: 45, carriers: 3, live: true, owner: "JET Product" },
  { key: "life", name: "Life — Term 10/20/30", category: "Life", version: "v0.9", states: 40, carriers: 4, live: true, owner: "JET Product" },
  { key: "critical", name: "Critical Illness", category: "Supplemental", version: "v0.7", states: 32, carriers: 3, live: true, owner: "JET Product" },
  { key: "accident", name: "Accident", category: "Supplemental", version: "v0.7", states: 32, carriers: 3, live: true, owner: "JET Product" },
  { key: "hospital", name: "Hospital Indemnity", category: "Supplemental", version: "v0.6", states: 24, carriers: 2, live: true, owner: "JET Product" },
  { key: "ichra", name: "ICHRA for Employers", category: "Group", version: "v0.5", states: 50, carriers: 12, live: false, owner: "JET Product" },
  { key: "medicare", name: "Medicare Advantage", category: "Senior", version: "v0.2", states: 0, carriers: 0, live: false, owner: "JET Product" },
];

export interface SampleFormTemplate {
  id: string; name: string; version: string; fields: number; conditional: number;
  requiredDocs: number; signatureRequired: boolean; lastEdited: string; published: boolean;
}
export const SAMPLE_FORMS: SampleFormTemplate[] = [
  { id: "F-2001", name: "IFP · Off-Exchange Application", version: "v3.2", fields: 42, conditional: 14, requiredDocs: 2, signatureRequired: true, lastEdited: "3 days ago", published: true },
  { id: "F-2002", name: "Dental Enrollment", version: "v1.4", fields: 12, conditional: 3, requiredDocs: 0, signatureRequired: true, lastEdited: "1 wk ago", published: true },
  { id: "F-2003", name: "ICHRA Employer Census", version: "v0.9", fields: 24, conditional: 8, requiredDocs: 1, signatureRequired: false, lastEdited: "yesterday", published: false },
  { id: "F-2004", name: "Life · Term 10 Application", version: "v2.1", fields: 38, conditional: 12, requiredDocs: 3, signatureRequired: true, lastEdited: "2 wk ago", published: true },
];

export interface SampleNotifTemplate {
  id: string; name: string; channel: "email" | "sms" | "in-app"; trigger: string;
  schedule: string; enabled: boolean; lastSent: string;
}
export const SAMPLE_NOTIF_TEMPLATES: SampleNotifTemplate[] = [
  { id: "NT-01", name: "Shared quote — expiring in 48h", channel: "email", trigger: "quote.expires_soon", schedule: "T-48h", enabled: true, lastSent: "12m ago" },
  { id: "NT-02", name: "Callback confirmation", channel: "sms", trigger: "call.scheduled", schedule: "immediate", enabled: true, lastSent: "1h ago" },
  { id: "NT-03", name: "Enrollment complete", channel: "email", trigger: "policy.effective", schedule: "immediate", enabled: true, lastSent: "3h ago" },
  { id: "NT-04", name: "Plan-AI follow-up nudge", channel: "in-app", trigger: "plano.abandoned", schedule: "T+24h", enabled: false, lastSent: "—" },
  { id: "NT-05", name: "Producer CE reminder", channel: "email", trigger: "producer.ce_due", schedule: "T-30d", enabled: true, lastSent: "2d ago" },
];

export interface SampleAclRole {
  id: string; name: string; scope: "global" | "agency" | "local"; users: number;
  permissions: string[]; guardrails: number;
}
export const SAMPLE_ACL_ROLES: SampleAclRole[] = [
  { id: "R-ADMIN", name: "JET Admin", scope: "global", users: 4, permissions: ["*"], guardrails: 0 },
  { id: "R-AGENCY-ADMIN", name: "Agency Admin", scope: "agency", users: 12, permissions: ["agency.*","producer.*","commissions.read"], guardrails: 2 },
  { id: "R-PRODUCER", name: "Producer", scope: "local", users: 84, permissions: ["quote.*","lead.*","cart.*","policy.read"], guardrails: 4 },
  { id: "R-CSR", name: "Customer Service", scope: "local", users: 15, permissions: ["lead.read","message.*","task.*"], guardrails: 6 },
  { id: "R-COMPLIANCE", name: "Compliance Reviewer", scope: "global", users: 3, permissions: ["audit.*","ai.review","policy.read"], guardrails: 0 },
];

export interface SampleAuditEvent {
  id: string; ts: string; actor: string; action: string; entity: string; ip: string; result: "ok" | "denied";
}
export const SAMPLE_AUDIT: SampleAuditEvent[] = [
  { id: "A-9021", ts: "2026-07-20 09:44:12 UTC", actor: "elena.alvarez@cedargrove", action: "quote.sent", entity: "L-1042", ip: "72.14.201.4", result: "ok" },
  { id: "A-9020", ts: "2026-07-20 09:31:44 UTC", actor: "plano-agent", action: "planO.recommend", entity: "L-1042", ip: "internal", result: "ok" },
  { id: "A-9019", ts: "2026-07-20 08:12:07 UTC", actor: "devon.park@cedargrove", action: "role.change", entity: "P-1103", ip: "72.14.201.9", result: "ok" },
  { id: "A-9018", ts: "2026-07-19 22:08:30 UTC", actor: "marta.silveira@northwind", action: "cart.enroll", entity: "L-1038", ip: "24.99.1.17", result: "ok" },
  { id: "A-9017", ts: "2026-07-19 17:44:56 UTC", actor: "jamal.reed@cedargrove", action: "carrier.appoint", entity: "APT-04", ip: "72.14.201.4", result: "denied" },
  { id: "A-9016", ts: "2026-07-19 14:02:11 UTC", actor: "system", action: "notification.batch", entity: "NT-01", ip: "internal", result: "ok" },
];

export interface SampleIntegration {
  id: string; name: string; category: "EDE" | "Directory" | "Carrier" | "Payments" | "Comms";
  status: "connected" | "degraded" | "disconnected"; lastSync: string; error?: string;
}
export const SAMPLE_INTEGRATIONS: SampleIntegration[] = [
  { id: "I-01", name: "EDE — Enhanced Direct Enrollment", category: "EDE", status: "connected", lastSync: "3m ago" },
  { id: "I-02", name: "NPI Provider Directory", category: "Directory", status: "connected", lastSync: "12m ago" },
  { id: "I-03", name: "MediSpan Rx", category: "Directory", status: "degraded", lastSync: "42m ago", error: "429 rate-limit last 4 requests" },
  { id: "I-04", name: "Meridian Carrier Feed", category: "Carrier", status: "connected", lastSync: "1h ago" },
  { id: "I-05", name: "BluePeak Carrier Feed", category: "Carrier", status: "connected", lastSync: "1h ago" },
  { id: "I-06", name: "Stripe Payments", category: "Payments", status: "connected", lastSync: "8m ago" },
  { id: "I-07", name: "Twilio SMS", category: "Comms", status: "connected", lastSync: "2m ago" },
  { id: "I-08", name: "Postmark Email", category: "Comms", status: "connected", lastSync: "1m ago" },
  { id: "I-09", name: "NIPR License Sync", category: "Directory", status: "disconnected", lastSync: "3d ago", error: "Credentials rotated — reconnect" },
];

export interface SampleAiRule {
  id: string; scope: "tenant" | "module" | "role"; name: string; enabled: boolean;
  disclaimer: string; escalation: "auto-hand-off" | "advisory" | "silent";
}
export const SAMPLE_AI_RULES: SampleAiRule[] = [
  { id: "AR-01", scope: "tenant", name: "Plan-AI guidance", enabled: true, disclaimer: "Educational, not binding.", escalation: "auto-hand-off" },
  { id: "AR-02", scope: "module", name: "Subsidy explainer", enabled: true, disclaimer: "Illustrative FPL estimate.", escalation: "advisory" },
  { id: "AR-03", scope: "module", name: "Off-exchange dynamic form", enabled: true, disclaimer: "Field-level assistance only.", escalation: "silent" },
  { id: "AR-04", scope: "role", name: "Agent copilot — quick quote", enabled: true, disclaimer: "Human decides.", escalation: "advisory" },
  { id: "AR-05", scope: "role", name: "Consumer autoreply", enabled: false, disclaimer: "Opt-in only.", escalation: "silent" },
];

export interface SampleFunnel {
  step: string; count: number; deltaPct: number;
}
export const SAMPLE_FUNNEL: SampleFunnel[] = [
  { step: "Visits", count: 2140, deltaPct: 6.4 },
  { step: "Quote started", count: 812, deltaPct: 4.1 },
  { step: "Quote completed", count: 484, deltaPct: 11.2 },
  { step: "Plans viewed", count: 421, deltaPct: 9.8 },
  { step: "Cart", count: 168, deltaPct: -2.4 },
  { step: "Enrolled", count: 92, deltaPct: 14.5 },
];

export interface SampleAppointmentSlot {
  id: string; when: string; day: string; producer: string; available: boolean;
}
export const SAMPLE_SLOTS: SampleAppointmentSlot[] = [
  { id: "S-01", when: "10:00 AM", day: "Today", producer: "Elena A.", available: true },
  { id: "S-02", when: "11:30 AM", day: "Today", producer: "Devon P.", available: true },
  { id: "S-03", when: "2:00 PM",  day: "Today", producer: "Elena A.", available: false },
  { id: "S-04", when: "4:30 PM",  day: "Today", producer: "Naomi I.", available: true },
  { id: "S-05", when: "9:00 AM",  day: "Tomorrow", producer: "Elena A.", available: true },
  { id: "S-06", when: "10:30 AM", day: "Tomorrow", producer: "Marta S.", available: true },
  { id: "S-07", when: "3:00 PM",  day: "Tomorrow", producer: "Devon P.", available: true },
];
