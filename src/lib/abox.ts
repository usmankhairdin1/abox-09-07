/**
 * ABox wireframe configuration.
 *
 * Everything a real admin would configure (labels, menu visibility, workspaces,
 * feature flags, help content) lives here as data rather than as hardcoded copy,
 * so the wireframes demonstrate the configurability rule instead of claiming it.
 */

export type PhaseStatus = "P1-Build" | "P1-Foundation" | "P1-IfNeeded" | "Phase 2" | "Future seam";

export type Packet = "M1" | "M2-Cand" | "P1-Later" | "Seam";

export interface Workspace {
  id: string;
  name: string;
  short: string;
  kind: "internal" | "external";
  phase: PhaseStatus;
  /** Module IDs visible in this workspace before ACL filtering. */
  modules: string[];
}

export const WORKSPACES: Workspace[] = [
  {
    id: "WS_PLATFORM_ADMIN",
    name: "JET Platform Workspace",
    short: "JET Platform",
    kind: "internal",
    phase: "P1-Build",
    modules: [
      "MOD_MY_WORK",
      "MOD_REPORTING",
      "MOD_LEADS_CUSTOMERS",
      "MOD_MARKETPLACE_SALES",
      "MOD_FORMS_ENROLLMENT",
      "MOD_PRODUCTS_PLANS",
      "MOD_AGENCY_ENTITY",
      "MOD_COMMISSIONS",
      "MOD_COMMUNICATIONS",
      "MOD_OUTPUTS_DOCS",
      "MOD_ADMIN_CONFIG",
    ],
  },
  {
    id: "WS_AGENCY",
    name: "Agency Workspace",
    short: "Agency",
    kind: "internal",
    phase: "P1-Build",
    modules: [
      "MOD_MY_WORK",
      "MOD_REPORTING",
      "MOD_LEADS_CUSTOMERS",
      "MOD_MARKETPLACE_SALES",
      "MOD_FORMS_ENROLLMENT",
      "MOD_PRODUCTS_PLANS",
      "MOD_AGENCY_ENTITY",
      "MOD_COMMISSIONS",
      "MOD_COMMUNICATIONS",
      "MOD_OUTPUTS_DOCS",
      "MOD_ADMIN_CONFIG",
    ],
  },
  {
    id: "WS_AGENT",
    name: "Agent Workspace",
    short: "Agent",
    kind: "internal",
    phase: "P1-Build",
    modules: [
      "MOD_MY_WORK",
      "MOD_LEADS_CUSTOMERS",
      "MOD_MARKETPLACE_SALES",
      "MOD_FORMS_ENROLLMENT",
      "MOD_OUTPUTS_DOCS",
      "MOD_REPORTING",
    ],
  },
  {
    id: "WS_CARRIER",
    name: "Carrier / Appointment Workspace",
    short: "Carrier",
    kind: "internal",
    phase: "P1-Foundation",
    modules: ["MOD_MY_WORK", "MOD_PRODUCTS_PLANS", "MOD_OUTPUTS_DOCS", "MOD_COMMISSIONS"],
  },
  {
    id: "WS_PARTNER",
    name: "Partner / Referral Workspace",
    short: "Partner",
    kind: "internal",
    phase: "P1-Foundation",
    modules: ["MOD_MY_WORK", "MOD_LEADS_CUSTOMERS", "MOD_REPORTING"],
  },
  {
    id: "WS_EMPLOYER_GROUP",
    name: "Employer / Group Workspace",
    short: "Employer",
    kind: "internal",
    phase: "P1-Foundation",
    modules: ["MOD_MY_WORK", "MOD_MARKETPLACE_SALES", "MOD_OUTPUTS_DOCS"],
  },
  {
    id: "WS_CONSUMER_MARKETPLACE",
    name: "Consumer Marketplace",
    short: "Marketplace",
    kind: "external",
    phase: "P1-Build",
    modules: [],
  },
  {
    id: "WS_MEMBER",
    name: "Member Workspace",
    short: "Member",
    kind: "external",
    phase: "P1-Foundation",
    modules: [],
  },
];

export interface EntityNode {
  id: string;
  label: string;
  type: string;
  depth: number;
  relationship: string;
}

/** The entity switcher list is produced by the relationship graph, not a flat list. */
export const ENTITIES: EntityNode[] = [
  { id: "ENT_JET", label: "JET", type: "Tenant", depth: 0, relationship: "platform tenant" },
  {
    id: "ENT_MKT_A",
    label: "Marketplace A",
    type: "Marketplace",
    depth: 1,
    relationship: "child of JET",
  },
  {
    id: "ENT_AGY_MASTER",
    label: "Northwind Master",
    type: "Agency",
    depth: 1,
    relationship: "parent / upline",
  },
  {
    id: "ENT_AGY_DOWN_1",
    label: "Harbor Point",
    type: "Agency",
    depth: 2,
    relationship: "downline of Northwind",
  },
  {
    id: "ENT_AGY_DOWN_2",
    label: "Cedar Ridge",
    type: "Agency",
    depth: 2,
    relationship: "downline of Northwind",
  },
  {
    id: "ENT_PARTNER_1",
    label: "Bright Referral",
    type: "Partner",
    depth: 2,
    relationship: "referral partner",
  },
];

export interface ModuleDef {
  id: string;
  /** Default label. Admin-configurable — see Admin → Label configuration. */
  label: string;
  to?: string;
  phase: PhaseStatus;
  packet: Packet;
  /** Nested modules never appear as a top-level menu item. */
  nested?: boolean;
  acl: string;
  screens: number;
}

export const MODULES: ModuleDef[] = [
  {
    id: "MOD_MY_WORK",
    label: "My Work",
    to: "/my-work",
    phase: "P1-Build",
    packet: "P1-Later",
    acl: "any authenticated internal user",
    screens: 4,
  },
  {
    id: "MOD_REPORTING",
    label: "Dashboards & Analytics",
    to: "/dashboard",
    phase: "P1-Build",
    packet: "P1-Later",
    acl: "reporting.view + entity data scope",
    screens: 2,
  },
  {
    id: "MOD_LEADS_CUSTOMERS",
    label: "Customers & Leads",
    to: "/object",
    phase: "P1-Build",
    packet: "P1-Later",
    acl: "leads.view, scoped by assignment and downline",
    screens: 4,
  },
  {
    id: "MOD_MARKETPLACE_SALES",
    label: "Marketplace & Sales",
    to: "/m1",
    phase: "P1-Build",
    packet: "M1",
    acl: "quote.create + marketplace and product access",
    screens: 13,
  },
  {
    id: "MOD_FORMS_ENROLLMENT",
    label: "Forms & Enrollment",
    to: "/p1",
    phase: "P1-Build",
    packet: "M2-Cand",
    acl: "enrollment.submit + sellability and paper access",
    screens: 19,
  },
  {
    id: "MOD_PRODUCTS_PLANS",
    label: "Products, Plans & Rates",
    to: "/p1",
    phase: "P1-Build",
    packet: "M2-Cand",
    acl: "product.manage (platform) / product.view (agency)",
    screens: 6,
  },
  {
    id: "MOD_AGENCY_ENTITY",
    label: "Agency & Entity Management",
    to: "/p1",
    phase: "P1-Build",
    packet: "M2-Cand",
    acl: "entity.manage within own subtree",
    screens: 7,
  },
  {
    id: "MOD_APPOINTMENTS_PAPER",
    label: "Appointments, Paper & Referrals",
    to: "/p1",
    phase: "P1-Build",
    packet: "M2-Cand",
    nested: true,
    acl: "appointment.manage, paper.grant — high sensitivity",
    screens: 6,
  },
  {
    id: "MOD_COMMISSIONS",
    label: "Commissions & Revenue",
    to: "/p1",
    phase: "P1-Build",
    packet: "P1-Later",
    acl: "commission.view flag — module absent when off",
    screens: 7,
  },
  {
    id: "MOD_COMMUNICATIONS",
    label: "Notifications & Scheduling",
    to: "/p1",
    phase: "P1-Build",
    packet: "P1-Later",
    acl: "comms.manage / notifications.read",
    screens: 5,
  },
  {
    id: "MOD_OUTPUTS_DOCS",
    label: "Documents & Outputs",
    to: "/p1",
    phase: "P1-Build",
    packet: "P1-Later",
    acl: "documents.view scoped by object access",
    screens: 7,
  },
  {
    id: "MOD_AI",
    label: "AI, Plan O & Governance",
    to: "/p1",
    phase: "P1-Build",
    packet: "P1-Later",
    nested: true,
    acl: "ai.govern (platform only) — overlay, not a default menu",
    screens: 5,
  },
  {
    id: "MOD_ADMIN_CONFIG",
    label: "Admin & Configuration",
    to: "/admin",
    phase: "P1-Build",
    packet: "P1-Later",
    acl: "admin.configure within global guardrails",
    screens: 11,
  },
];

export const MODULE_BY_ID: Record<string, ModuleDef> = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
);

/** Terms that vary by tenant. Screens render the label, never the constant. */
export type LabelKey = "agency" | "agent" | "lead" | "member" | "marketplace" | "workspace";

export const DEFAULT_LABELS: Record<LabelKey, string> = {
  agency: "Agency",
  agent: "Agent",
  lead: "Lead",
  member: "Member",
  marketplace: "Marketplace",
  workspace: "Workspace",
};

export const LABEL_ALTERNATIVES: Record<LabelKey, string[]> = {
  agency: ["Agency", "Firm", "Office", "Partner"],
  agent: ["Agent", "Advisor", "Producer", "Broker"],
  lead: ["Lead", "Prospect", "Opportunity", "Inquiry"],
  member: ["Member", "Client", "Customer", "Policyholder"],
  marketplace: ["Marketplace", "Storefront", "Shop"],
  workspace: ["Workspace", "Space", "Area"],
};

export interface FeatureFlag {
  id: string;
  label: string;
  scope: string;
  on: boolean;
  note: string;
}

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: "FLAG_PLAN_O",
    label: "Plan O guided shopping",
    scope: "Tenant / Marketplace",
    on: true,
    note: "Module 1 guardrails frozen",
  },
  {
    id: "FLAG_OFFEX",
    label: "Off-exchange enrollment",
    scope: "Tenant / Product",
    on: true,
    note: "Phase 1 build, Module 2 packet",
  },
  {
    id: "FLAG_DENTAL",
    label: "Dental enrollment line",
    scope: "Product",
    on: true,
    note: "Minimum ancillary proof line",
  },
  {
    id: "FLAG_ANCILLARY",
    label: "Extended ancillary lines",
    scope: "Product",
    on: false,
    note: "Phase 1 foundation pattern",
  },
  {
    id: "FLAG_ICHRA_QUOTE",
    label: "ICHRA quoting",
    scope: "Workspace",
    on: true,
    note: "Quote only — enrollment is Phase 2",
  },
  {
    id: "FLAG_PAYMENT_FE",
    label: "Payment capture front end",
    scope: "Tenant",
    on: true,
    note: "Vendor integration is a future seam",
  },
  {
    id: "FLAG_COMMISSION_PROJ",
    label: "Commission projection for agents",
    scope: "Entity / Role",
    on: false,
    note: "Module hidden entirely when off",
  },
  {
    id: "FLAG_PAPER_SHARING",
    label: "B2B2C paper sharing",
    scope: "Entity",
    on: true,
    note: "Nested under appointments",
  },
];

export const DRAWER_TABS = [
  "Context",
  "Summary",
  "Guidance",
  "Help & FAQ",
  "Audit",
  "Next actions",
] as const;

export type DrawerTab = (typeof DRAWER_TABS)[number];

export const ROLES = [
  {
    id: "ROLE_PLATFORM_ADMIN",
    label: "Platform admin",
    scope: "Global",
    audit: true,
    commissions: true,
  },
  {
    id: "ROLE_AGENCY_ADMIN",
    label: "Agency admin",
    scope: "Own entity + downline",
    audit: true,
    commissions: true,
  },
  {
    id: "ROLE_AGENCY_MANAGER",
    label: "Agency manager",
    scope: "Own entity",
    audit: false,
    commissions: true,
  },
  {
    id: "ROLE_AGENT",
    label: "Agent / producer",
    scope: "Assigned records only",
    audit: false,
    commissions: false,
  },
  {
    id: "ROLE_SUPPORT",
    label: "Support (impersonation)",
    scope: "Global, banded + logged",
    audit: true,
    commissions: false,
  },
];
