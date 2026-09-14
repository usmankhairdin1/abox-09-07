/**
 * Seed data for the Lucie prototype. Entirely fictional sample records used to
 * demonstrate the end-to-end journeys. Nothing here is production data.
 */

export type Persona = "consumer" | "agent" | "agency_admin" | "employer" | "jet_admin";

export interface PersonaDef {
  id: Persona;
  name: string;
  role: string;
  org: string;
  initials: string;
  home: string;
}

export const PERSONAS: PersonaDef[] = [
  {
    id: "consumer",
    name: "Dana Whitfield",
    role: "Shopper",
    org: "Northgate Marketplace",
    initials: "DW",
    home: "/lucie-app/shop",
  },
  {
    id: "agent",
    name: "Marcus Ellery",
    role: "Producer",
    org: "Northgate Insurance Group",
    initials: "ME",
    home: "/lucie-app/agency",
  },
  {
    id: "agency_admin",
    name: "Priya Raman",
    role: "Agency administrator",
    org: "Northgate Insurance Group",
    initials: "PR",
    home: "/lucie-app/agency",
  },
  {
    id: "employer",
    name: "Alan Duquesne",
    role: "Benefits lead",
    org: "Cedarline Logistics",
    initials: "AD",
    home: "/lucie-app/employer",
  },
  {
    id: "jet_admin",
    name: "Sofia Marchetti",
    role: "Platform operations",
    org: "JET Platform",
    initials: "SM",
    home: "/lucie-app/platform",
  },
];

export const personaById = (id: Persona) => PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];

/* ------------------------------------------------------------------ plans */

export type PlanKind = "medical" | "dental" | "vision";

export interface Plan {
  id: string;
  carrier: string;
  name: string;
  kind: PlanKind;
  metal: "Bronze" | "Silver" | "Gold" | "Platinum" | "Standard";
  market: "on-exchange" | "off-exchange";
  premium: number;
  deductible: number;
  oopMax: number;
  primaryCare: string;
  specialist: string;
  generic: string;
  network: string;
  hsa: boolean;
  rating: number;
  fitScore: number;
  fitReason: string;
  highlights: string[];
}

export const PLANS: Plan[] = [
  {
    id: "PL-4821",
    carrier: "Meridian Health",
    name: "Meridian Silver Core 3500",
    kind: "medical",
    metal: "Silver",
    market: "on-exchange",
    premium: 412,
    deductible: 3500,
    oopMax: 8700,
    primaryCare: "$30 copay",
    specialist: "$65 copay",
    generic: "$15 copay",
    network: "Meridian Select PPO",
    hsa: false,
    rating: 4.4,
    fitScore: 94,
    fitReason: "Both of your listed providers are in network and your usual prescriptions are tier 1.",
    highlights: ["Cost-sharing reductions apply", "Telehealth included", "No referral needed"],
  },
  {
    id: "PL-4822",
    carrier: "Meridian Health",
    name: "Meridian Bronze Saver 7000",
    kind: "medical",
    metal: "Bronze",
    market: "on-exchange",
    premium: 268,
    deductible: 7000,
    oopMax: 9450,
    primaryCare: "Deductible then 40%",
    specialist: "Deductible then 40%",
    generic: "$25 copay",
    network: "Meridian Select PPO",
    hsa: true,
    rating: 3.9,
    fitScore: 71,
    fitReason: "Lowest monthly cost, but your expected visits fall below the deductible.",
    highlights: ["HSA eligible", "Preventive care at no cost"],
  },
  {
    id: "PL-4830",
    carrier: "Corvallis Mutual",
    name: "Corvallis Gold Advantage",
    kind: "medical",
    metal: "Gold",
    market: "on-exchange",
    premium: 583,
    deductible: 1200,
    oopMax: 6200,
    primaryCare: "$20 copay",
    specialist: "$45 copay",
    generic: "$10 copay",
    network: "Corvallis Statewide HMO",
    hsa: false,
    rating: 4.6,
    fitScore: 88,
    fitReason: "Strongest coverage for frequent specialist visits; one provider is out of network.",
    highlights: ["Low deductible", "Maternity enhanced", "Care navigator"],
  },
  {
    id: "PL-4844",
    carrier: "Brightline Assurance",
    name: "Brightline Direct Value",
    kind: "medical",
    metal: "Standard",
    market: "off-exchange",
    premium: 349,
    deductible: 4500,
    oopMax: 8900,
    primaryCare: "$40 copay",
    specialist: "$80 copay",
    generic: "$20 copay",
    network: "Brightline Open Access",
    hsa: false,
    rating: 4.0,
    fitScore: 63,
    fitReason: "Available outside the exchange, so premium assistance cannot be applied.",
    highlights: ["No exchange application", "Nationwide network"],
  },
  {
    id: "PL-7001",
    carrier: "Clearview Dental",
    name: "Clearview Dental Plus",
    kind: "dental",
    metal: "Standard",
    market: "off-exchange",
    premium: 38,
    deductible: 50,
    oopMax: 1500,
    primaryCare: "2 cleanings covered",
    specialist: "50% major services",
    generic: "—",
    network: "Clearview National",
    hsa: false,
    rating: 4.2,
    fitScore: 80,
    fitReason: "Covers the orthodontic benefit you asked about after a 6 month wait.",
    highlights: ["No waiting period on preventive", "Orthodontia included"],
  },
  {
    id: "PL-7010",
    carrier: "Clearview Vision",
    name: "Clearview Vision Essentials",
    kind: "vision",
    metal: "Standard",
    market: "off-exchange",
    premium: 14,
    deductible: 0,
    oopMax: 500,
    primaryCare: "Annual exam $10",
    specialist: "—",
    generic: "—",
    network: "Clearview Vision Network",
    hsa: false,
    rating: 4.1,
    fitScore: 76,
    fitReason: "Frame allowance covers the lenses you selected last year.",
    highlights: ["$150 frame allowance", "Contacts alternative"],
  },
];

export const planById = (id: string) => PLANS.find((p) => p.id === id);

/* ----------------------------------------------------------------- agency */

export type AgentStatus = "draft" | "in_review" | "ready" | "blocked";

export interface License {
  id: string;
  state: string;
  lineOfAuthority: string;
  number: string;
  expires: string;
  status: "active" | "expiring" | "expired";
}

export interface Appointment {
  id: string;
  carrier: string;
  state: string;
  effective: string;
  status: "appointed" | "pending" | "terminated";
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  npn: string;
  states: string[];
  status: AgentStatus;
  captive: string;
  onboarded: string;
  licenses: License[];
  appointments: Appointment[];
  blockReason?: string;
}

export const AGENTS: Agent[] = [
  {
    id: "AGT-1042",
    name: "Marcus Ellery",
    email: "m.ellery@northgate-ins.example",
    npn: "18442901",
    states: ["TX", "OK"],
    status: "ready",
    captive: "Independent",
    onboarded: "2026-03-14",
    licenses: [
      {
        id: "LIC-9001",
        state: "TX",
        lineOfAuthority: "Health & Life",
        number: "TX-2291884",
        expires: "2027-04-30",
        status: "active",
      },
      {
        id: "LIC-9002",
        state: "OK",
        lineOfAuthority: "Health",
        number: "OK-771230",
        expires: "2026-11-15",
        status: "expiring",
      },
    ],
    appointments: [
      {
        id: "APP-3301",
        carrier: "Meridian Health",
        state: "TX",
        effective: "2026-01-02",
        status: "appointed",
      },
      {
        id: "APP-3302",
        carrier: "Corvallis Mutual",
        state: "TX",
        effective: "2026-02-18",
        status: "appointed",
      },
    ],
  },
  {
    id: "AGT-1058",
    name: "Renee Okafor",
    email: "r.okafor@northgate-ins.example",
    npn: "19003377",
    states: ["TX"],
    status: "in_review",
    captive: "Captive — Meridian Health",
    onboarded: "2026-08-02",
    licenses: [
      {
        id: "LIC-9105",
        state: "TX",
        lineOfAuthority: "Health",
        number: "TX-2410559",
        expires: "2027-08-31",
        status: "active",
      },
    ],
    appointments: [
      {
        id: "APP-3410",
        carrier: "Meridian Health",
        state: "TX",
        effective: "2026-08-20",
        status: "pending",
      },
    ],
  },
  {
    id: "AGT-1063",
    name: "Devon Sparks",
    email: "d.sparks@northgate-ins.example",
    npn: "19114820",
    states: ["NM"],
    status: "blocked",
    captive: "Captive — Meridian Health",
    onboarded: "2026-08-19",
    blockReason: "No active appointment in New Mexico and captive agreement excludes Corvallis products.",
    licenses: [
      {
        id: "LIC-9220",
        state: "NM",
        lineOfAuthority: "Health",
        number: "NM-330891",
        expires: "2026-09-30",
        status: "expiring",
      },
    ],
    appointments: [],
  },
];

export interface MarketplaceSite {
  id: string;
  name: string;
  domain: string;
  status: "draft" | "in_review" | "live" | "paused";
  products: number;
  updated: string;
  owner: string;
}

export const MARKETPLACES: MarketplaceSite[] = [
  {
    id: "MKT-2201",
    name: "Northgate Individual",
    domain: "shop.northgate-ins.example",
    status: "live",
    products: 12,
    updated: "2026-08-24",
    owner: "Priya Raman",
  },
  {
    id: "MKT-2214",
    name: "Northgate Dental & Vision",
    domain: "dv.northgate-ins.example",
    status: "draft",
    products: 4,
    updated: "2026-08-29",
    owner: "Priya Raman",
  },
];

/* --------------------------------------------------------------- employer */

export interface CensusRow {
  id: string;
  name: string;
  age: number;
  zip: string;
  tier: "Employee" | "Employee + spouse" | "Family";
  class: "Full-time" | "Part-time" | "Seasonal";
  salary: number;
}

export const CENSUS: CensusRow[] = [
  { id: "EMP-01", name: "Jordan Reyes", age: 34, zip: "78701", tier: "Employee", class: "Full-time", salary: 68000 },
  { id: "EMP-02", name: "Amara Boyd", age: 41, zip: "78745", tier: "Family", class: "Full-time", salary: 92000 },
  { id: "EMP-03", name: "Chris Nolan", age: 29, zip: "78702", tier: "Employee", class: "Full-time", salary: 54000 },
  { id: "EMP-04", name: "Lena Petrov", age: 52, zip: "78660", tier: "Employee + spouse", class: "Full-time", salary: 110000 },
  { id: "EMP-05", name: "Tomas Guerra", age: 25, zip: "78704", tier: "Employee", class: "Part-time", salary: 31000 },
  { id: "EMP-06", name: "Hana Ito", age: 38, zip: "78753", tier: "Family", class: "Full-time", salary: 84000 },
];

/* --------------------------------------------------------------- platform */

export interface Tenant {
  id: string;
  name: string;
  type: "Agency" | "Carrier partner" | "Employer";
  users: number;
  workspaces: string[];
  status: "active" | "provisioning" | "suspended";
  created: string;
}

export const TENANTS: Tenant[] = [
  {
    id: "TEN-100",
    name: "Northgate Insurance Group",
    type: "Agency",
    users: 34,
    workspaces: ["Agency", "Agent", "Marketplace"],
    status: "active",
    created: "2026-01-08",
  },
  {
    id: "TEN-118",
    name: "Cedarline Logistics",
    type: "Employer",
    users: 6,
    workspaces: ["ICHRA"],
    status: "active",
    created: "2026-05-21",
  },
  {
    id: "TEN-131",
    name: "Harbor Point Advisors",
    type: "Agency",
    users: 11,
    workspaces: ["Agency", "Agent"],
    status: "provisioning",
    created: "2026-08-27",
  },
];

export interface RoleTemplate {
  id: string;
  name: string;
  workspace: string;
  members: number;
  permissions: string[];
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: "ROLE-01",
    name: "Agency administrator",
    workspace: "Agency",
    members: 4,
    permissions: ["Manage producers", "Configure marketplace", "View commissions", "Export audit"],
  },
  {
    id: "ROLE-02",
    name: "Producer",
    workspace: "Agent",
    members: 27,
    permissions: ["Quote", "Manage own book", "Submit applications"],
  },
  {
    id: "ROLE-03",
    name: "Benefits lead",
    workspace: "ICHRA",
    members: 6,
    permissions: ["Manage census", "Model contributions", "Share proposals"],
  },
  {
    id: "ROLE-04",
    name: "Platform operator",
    workspace: "Platform",
    members: 5,
    permissions: ["Provision tenants", "Manage entitlements", "Resolve exceptions", "Flip launch gates"],
  },
];

export interface Entitlement {
  id: string;
  tenant: string;
  package: string;
  seats: number;
  seatsUsed: number;
  renews: string;
  modules: string[];
}

export const ENTITLEMENTS: Entitlement[] = [
  {
    id: "ENT-501",
    tenant: "Northgate Insurance Group",
    package: "Agency Growth",
    seats: 40,
    seatsUsed: 34,
    renews: "2027-01-08",
    modules: ["Marketplace", "Off-exchange", "ICHRA quoting"],
  },
  {
    id: "ENT-509",
    tenant: "Cedarline Logistics",
    package: "Employer Essentials",
    seats: 10,
    seatsUsed: 6,
    renews: "2027-05-21",
    modules: ["ICHRA quoting"],
  },
  {
    id: "ENT-514",
    tenant: "Harbor Point Advisors",
    package: "Agency Starter",
    seats: 15,
    seatsUsed: 0,
    renews: "2027-08-27",
    modules: ["Marketplace"],
  },
];

export interface Integration {
  id: string;
  name: string;
  kind: string;
  status: "healthy" | "degraded" | "failing";
  latency: string;
  lastEvent: string;
  successRate: number;
}

export const INTEGRATIONS: Integration[] = [
  { id: "INT-01", name: "Plan & rate service", kind: "Quoting", status: "healthy", latency: "310 ms", lastEvent: "2 min ago", successRate: 99.8 },
  { id: "INT-02", name: "Exchange handoff", kind: "Enrollment", status: "degraded", latency: "1.9 s", lastEvent: "6 min ago", successRate: 94.1 },
  { id: "INT-03", name: "Carrier EDI dispatch", kind: "Submission", status: "healthy", latency: "740 ms", lastEvent: "11 min ago", successRate: 98.6 },
  { id: "INT-04", name: "Producer credential feed", kind: "Compliance", status: "failing", latency: "—", lastEvent: "3 h ago", successRate: 61.2 },
  { id: "INT-05", name: "Document & e-sign", kind: "Documents", status: "healthy", latency: "520 ms", lastEvent: "1 min ago", successRate: 99.2 },
];

export interface ExceptionItem {
  id: string;
  subject: string;
  source: string;
  severity: "high" | "medium" | "low";
  opened: string;
  owner: string;
  detail: string;
  status: "open" | "resolved";
}

export const EXCEPTIONS: ExceptionItem[] = [
  {
    id: "EXC-3320",
    subject: "Carrier acknowledgement not received",
    source: "Carrier EDI dispatch",
    severity: "high",
    opened: "2026-08-30 14:02",
    owner: "Operations",
    detail: "Application SUB-88214 was dispatched but no acknowledgement returned within the expected window.",
    status: "open",
  },
  {
    id: "EXC-3321",
    subject: "Credential feed rejected batch",
    source: "Producer credential feed",
    severity: "high",
    opened: "2026-08-30 11:47",
    owner: "Compliance",
    detail: "Batch of 12 producer records rejected for malformed state code. Producers remain in review.",
    status: "open",
  },
  {
    id: "EXC-3319",
    subject: "Quote snapshot expired before checkout",
    source: "Plan & rate service",
    severity: "medium",
    opened: "2026-08-29 09:15",
    owner: "Operations",
    detail: "Shopper returned after the pricing snapshot expired; a fresh quote was required before continuing.",
    status: "resolved",
  },
];

export interface AuditEntry {
  id: string;
  when: string;
  actor: string;
  action: string;
  object: string;
  workspace: string;
  detail: string;
}

export const AUDIT: AuditEntry[] = [
  {
    id: "AUD-90211",
    when: "2026-08-31 09:14",
    actor: "Priya Raman",
    action: "Marketplace published",
    object: "Northgate Individual",
    workspace: "Agency",
    detail: "Brand colour and product catalogue changed, then published to shop.northgate-ins.example.",
  },
  {
    id: "AUD-90205",
    when: "2026-08-31 08:52",
    actor: "Sofia Marchetti",
    action: "Entitlement updated",
    object: "Northgate Insurance Group",
    workspace: "Platform",
    detail: "Seat count raised from 30 to 40.",
  },
  {
    id: "AUD-90188",
    when: "2026-08-30 17:31",
    actor: "Marcus Ellery",
    action: "Application submitted",
    object: "SUB-88214",
    workspace: "Agent",
    detail: "Off-exchange application signed and dispatched to Brightline Assurance.",
  },
  {
    id: "AUD-90170",
    when: "2026-08-30 15:06",
    actor: "Priya Raman",
    action: "Producer blocked",
    object: "Devon Sparks",
    workspace: "Agency",
    detail: "Readiness decision recorded as blocked pending appointment in New Mexico.",
  },
];

export interface LaunchGate {
  id: string;
  name: string;
  owner: string;
  state: "closed" | "conditional" | "open";
  criteria: string;
  evidence: string;
}

export const GATES: LaunchGate[] = [
  { id: "GATE-01", name: "Tenant provisioning", owner: "Platform operations", state: "open", criteria: "Tenants, roles and entitlements provisioned with audit coverage.", evidence: "34 tenants provisioned, audit sampling passed." },
  { id: "GATE-02", name: "Live quoting data", owner: "Data services", state: "open", criteria: "Quotes priced from live plan data and pinned to a snapshot.", evidence: "Snapshot expiry verified in staging." },
  { id: "GATE-03", name: "Application runtime", owner: "Product", state: "conditional", criteria: "Fixed application saves, resumes, validates and signs.", evidence: "Resume verified; document virus scan pending." },
  { id: "GATE-04", name: "Exchange handoff", owner: "Integrations", state: "conditional", criteria: "Handoff recorded as a handoff with tracked return status.", evidence: "Return path verified for 3 of 4 failure modes." },
  { id: "GATE-05", name: "Producer sellability", owner: "Compliance", state: "open", criteria: "Server-side decision with reason codes on every quote entry point.", evidence: "Reason codes reviewed 2026-08-22." },
  { id: "GATE-06", name: "Operational monitoring", owner: "Platform operations", state: "closed", criteria: "Every integration failure lands in an owned queue with a runbook.", evidence: "Credential feed runbook not yet written." },
];

/* ------------------------------------------------------------ submissions */

export interface Submission {
  id: string;
  applicant: string;
  product: string;
  carrier: string;
  channel: "Off-exchange" | "Exchange handoff";
  submitted: string;
  status: "In review" | "Acknowledged" | "Action needed" | "Handed off";
  note: string;
}

export const SUBMISSIONS: Submission[] = [
  {
    id: "SUB-88214",
    applicant: "Harriet Lowe",
    product: "Brightline Direct Value",
    carrier: "Brightline Assurance",
    channel: "Off-exchange",
    submitted: "2026-08-30 17:31",
    status: "Action needed",
    note: "Carrier acknowledgement outstanding; operations is tracking it.",
  },
  {
    id: "SUB-88190",
    applicant: "Owen Barrett",
    product: "Meridian Silver Core 3500",
    carrier: "Meridian Health",
    channel: "Exchange handoff",
    submitted: "2026-08-29 10:12",
    status: "Handed off",
    note: "Continued on the exchange; status returns here when the exchange reports it.",
  },
  {
    id: "SUB-88155",
    applicant: "Priya Nadar",
    product: "Clearview Dental Plus",
    carrier: "Clearview Dental",
    channel: "Off-exchange",
    submitted: "2026-08-28 13:40",
    status: "Acknowledged",
    note: "Carrier acknowledged receipt. Effective date confirmed for 1 October.",
  },
];

export const AGENCY_METRICS = {
  producers: 34,
  readyProducers: 29,
  quotesThisWeek: 412,
  applications: 58,
  marketplaces: 2,
};
