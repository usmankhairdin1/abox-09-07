/** Phase 1 IA v2.0 configuration registry and guardrails. */
export interface IaConfigEntry {
  configId: string;
  configuration: string;
  inheritanceScope: string;
  ownerModule: string;
  guardrail: string;
}

export const IA_CONFIG: IaConfigEntry[] = [
  {
    "configId": "CFG-IA2-001",
    "configuration": "Platform labels and entity terminology",
    "inheritanceScope": "Platform -> tenant -> marketplace",
    "ownerModule": "M00",
    "guardrail": "Versioned, localized and stable-ID aware."
  },
  {
    "configId": "CFG-IA2-002",
    "configuration": "Navigation visibility and ordering",
    "inheritanceScope": "Platform -> workspace -> role",
    "ownerModule": "M00",
    "guardrail": "Cannot expose an unauthorized module."
  },
  {
    "configId": "CFG-IA2-003",
    "configuration": "Workspace availability and default landing",
    "inheritanceScope": "Platform -> tenant -> user preference",
    "ownerModule": "M00",
    "guardrail": "User preference limited to permitted destinations."
  },
  {
    "configId": "CFG-IA2-004",
    "configuration": "Global and local role templates",
    "inheritanceScope": "Platform -> organization",
    "ownerModule": "M00",
    "guardrail": "Local roles cannot weaken global controls."
  },
  {
    "configId": "CFG-IA2-005",
    "configuration": "Permission policies",
    "inheritanceScope": "Platform -> tenant -> organization -> team -> user",
    "ownerModule": "M00",
    "guardrail": "Simulation and approval required for sensitive change."
  },
  {
    "configId": "CFG-IA2-006",
    "configuration": "Feature flags and rollout",
    "inheritanceScope": "Environment -> tenant -> marketplace -> cohort",
    "ownerModule": "M00",
    "guardrail": "Legal/security-sensitive capability cannot be enabled without gate."
  },
  {
    "configId": "CFG-IA2-007",
    "configuration": "Organization relationship settings",
    "inheritanceScope": "Platform -> relationship",
    "ownerModule": "M05",
    "guardrail": "Effective-dated and audited."
  },
  {
    "configId": "CFG-IA2-008",
    "configuration": "Agency and agent inheritance",
    "inheritanceScope": "Platform -> network -> master agency -> agency -> marketplace -> agent",
    "ownerModule": "M06",
    "guardrail": "Current value, source and lock state visible."
  },
  {
    "configId": "CFG-IA2-009",
    "configuration": "Captive and exclusivity constraints",
    "inheritanceScope": "Affiliation -> carrier/product/state/marketplace/channel",
    "ownerModule": "M06/M08",
    "guardrail": "Effective-dated; exceptions approved and audited."
  },
  {
    "configId": "CFG-IA2-010",
    "configuration": "Marketplace branding",
    "inheritanceScope": "Platform -> marketplace",
    "ownerModule": "M04",
    "guardrail": "Required legal content remains locked."
  },
  {
    "configId": "CFG-IA2-011",
    "configuration": "Marketplace products and pathways",
    "inheritanceScope": "Marketplace -> distribution offering",
    "ownerModule": "M04/M03",
    "guardrail": "Availability distinct from sellability and enrollability."
  },
  {
    "configId": "CFG-IA2-012",
    "configuration": "Lead pipeline and stages",
    "inheritanceScope": "Platform milestones -> organization pipeline -> product opportunity",
    "ownerModule": "M09",
    "guardrail": "Local stages map to stable reporting milestones."
  },
  {
    "configId": "CFG-IA2-013",
    "configuration": "Lead routing and assignment",
    "inheritanceScope": "Platform -> network -> agency -> marketplace",
    "ownerModule": "M09/M08",
    "guardrail": "Authority and captive constraints cannot be bypassed."
  },
  {
    "configId": "CFG-IA2-014",
    "configuration": "Task SLA and escalation",
    "inheritanceScope": "Platform -> organization -> work type",
    "ownerModule": "M00",
    "guardrail": "Effective-dated and queue-aware."
  },
  {
    "configId": "CFG-IA2-015",
    "configuration": "Product hierarchy and attributes",
    "inheritanceScope": "Product line -> family -> product -> plan -> offering",
    "ownerModule": "M03",
    "guardrail": "Published versions immutable."
  },
  {
    "configId": "CFG-IA2-016",
    "configuration": "Benefits and display structures",
    "inheritanceScope": "Product template -> product/plan",
    "ownerModule": "M03",
    "guardrail": "Product-agnostic, typed semantics."
  },
  {
    "configId": "CFG-IA2-017",
    "configuration": "Rates, formulas and rounding",
    "inheritanceScope": "Product/plan/jurisdiction/effective period",
    "ownerModule": "M03",
    "guardrail": "Testable, versioned and explainable."
  },
  {
    "configId": "CFG-IA2-018",
    "configuration": "Product source mappings",
    "inheritanceScope": "Source -> namespace -> product fields",
    "ownerModule": "M03",
    "guardrail": "Raw provenance retained."
  },
  {
    "configId": "CFG-IA2-019",
    "configuration": "Product publication and availability",
    "inheritanceScope": "Publisher -> product/offer -> marketplace/geography/channel",
    "ownerModule": "M03/M04",
    "guardrail": "Dual approval for sensitive changes."
  },
  {
    "configId": "CFG-IA2-020",
    "configuration": "Quote inputs, compare and cart rules",
    "inheritanceScope": "Product/marketplace/channel",
    "ownerModule": "M02",
    "guardrail": "M01 behavior protected through profile configuration."
  },
  {
    "configId": "CFG-IA2-021",
    "configuration": "PlanAI deployment mode",
    "inheritanceScope": "Platform -> tenant -> marketplace -> product",
    "ownerModule": "M14/M15",
    "guardrail": "Only approved modes; required-if-enabled guardrail bundles."
  },
  {
    "configId": "CFG-IA2-022",
    "configuration": "PlanAI knowledge and prompts",
    "inheritanceScope": "Platform -> capability -> context",
    "ownerModule": "M14",
    "guardrail": "Approved sources, versioning and evidence."
  },
  {
    "configId": "CFG-IA2-023",
    "configuration": "Form templates and question libraries",
    "inheritanceScope": "Platform -> publisher -> product/pathway",
    "ownerModule": "M26",
    "guardrail": "Published versions immutable."
  },
  {
    "configId": "CFG-IA2-024",
    "configuration": "Enrollment pathways",
    "inheritanceScope": "Product/offer -> state -> marketplace -> contract path",
    "ownerModule": "M26/M03",
    "guardrail": "Steps and adapters versioned."
  },
  {
    "configId": "CFG-IA2-025",
    "configuration": "Document requirements",
    "inheritanceScope": "Product/pathway/answer/jurisdiction",
    "ownerModule": "M26/M13",
    "guardrail": "Classification, retention and access inherited."
  },
  {
    "configId": "CFG-IA2-026",
    "configuration": "Electronic signature provider policy",
    "inheritanceScope": "Tenant/organization/product/pathway",
    "ownerModule": "M26/M13",
    "guardrail": "JET E-Signature default; DocuSign when licensed and configured."
  },
  {
    "configId": "CFG-IA2-027",
    "configuration": "Payment provider and methods",
    "inheritanceScope": "Tenant/product/pathway",
    "ownerModule": "M11",
    "guardrail": "PCI-tokenized; no raw card or security code storage."
  },
  {
    "configId": "CFG-IA2-028",
    "configuration": "Twilio and SendGrid provider",
    "inheritanceScope": "Platform -> approved organization account",
    "ownerModule": "M10/M16",
    "guardrail": "Front-end test and activation; masked secrets."
  },
  {
    "configId": "CFG-IA2-029",
    "configuration": "Communication templates",
    "inheritanceScope": "Platform -> network -> agency -> marketplace",
    "ownerModule": "M10/M13",
    "guardrail": "Locked compliance content preserved."
  },
  {
    "configId": "CFG-IA2-030",
    "configuration": "Consent and contact eligibility",
    "inheritanceScope": "Jurisdiction -> purpose -> channel -> recipient",
    "ownerModule": "M00/M10",
    "guardrail": "Send-time fail-closed evaluation."
  },
  {
    "configId": "CFG-IA2-031",
    "configuration": "Scheduling availability",
    "inheritanceScope": "Organization -> team -> user",
    "ownerModule": "M10",
    "guardrail": "Timezone, duration, buffer and fallback aware."
  },
  {
    "configId": "CFG-IA2-032",
    "configuration": "Commission schedules and splits",
    "inheritanceScope": "Carrier/upline/agency -> contract/product/effective period",
    "ownerModule": "M12",
    "guardrail": "Precedence and historical version integrity."
  },
  {
    "configId": "CFG-IA2-033",
    "configuration": "Policy servicing routes",
    "inheritanceScope": "Carrier/product/jurisdiction/request type",
    "ownerModule": "M18",
    "guardrail": "Requested and confirmed states remain distinct."
  },
  {
    "configId": "CFG-IA2-034",
    "configuration": "Output templates and branding",
    "inheritanceScope": "Platform -> organization -> marketplace -> output type",
    "ownerModule": "M13",
    "guardrail": "Source and template versions retained."
  },
  {
    "configId": "CFG-IA2-035",
    "configuration": "Metric definitions and stage mappings",
    "inheritanceScope": "Platform -> approved organization mapping",
    "ownerModule": "M24",
    "guardrail": "Canonical definitions cannot be locally redefined."
  },
  {
    "configId": "CFG-IA2-036",
    "configuration": "Report views and schedules",
    "inheritanceScope": "Dataset -> role/organization/user",
    "ownerModule": "M24",
    "guardrail": "Export permissions enforced."
  },
  {
    "configId": "CFG-IA2-037",
    "configuration": "Connector endpoints and credentials",
    "inheritanceScope": "Environment -> connector instance",
    "ownerModule": "M00",
    "guardrail": "Secrets masked; test, health and audit required."
  },
  {
    "configId": "CFG-IA2-038",
    "configuration": "Retention, archival and legal hold",
    "inheritanceScope": "Data class -> object -> jurisdiction/contract",
    "ownerModule": "M00/M13",
    "guardrail": "Cannot violate global minimums."
  }
];
