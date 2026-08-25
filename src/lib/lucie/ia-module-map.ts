/** Phase 1 IA v2.0 module map and screen counts. */
export interface IaModuleMapEntry {
  moduleId: string;
  moduleName: string;
  phase1Posture: string;
  moduleContainers: string;
  screenCount: string;
  representativeScreens: string;
  iaRule: string;
}

export const IA_MODULE_MAP: IaModuleMapEntry[] = [
  {
    "moduleId": "M00",
    "moduleName": "ABox Platform Foundation",
    "phase1Posture": "Production foundation",
    "moduleContainers": "MOD_MY_WORK, MOD_ADMIN_CONFIG",
    "screenCount": "30",
    "representativeScreens": "SCR_REGISTRATION, SCR_EDE_HANDOFF_REVIEW, SCR_MEMBER_CONSENTS, SCR_MEMBER_PREFERENCES, SCR_AGENT_MY_WORK, SCR_AGENT_TASKS, SCR_AGENT_PREFERENCES, SCR_AGENCY_MY_WORK, SCR_AGENCY_ROLES, SCR_LOCAL_ACCESS_POLICIES",
    "iaRule": "Must precede or be delivered alongside every user-facing capability."
  },
  {
    "moduleId": "M01",
    "moduleName": "IFP Shopping and JET EDE Handoff Profile",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_MARKETPLACE_SALES",
    "screenCount": "4",
    "representativeScreens": "SCR_CONS_LANDING, SCR_ELIGIBILITY_INTAKE, SCR_EDE_HANDOFF_REVIEW, SCR_AGENT_QUICK_QUOTE",
    "iaRule": "Protected implementation profile; not owner of shared commerce services."
  },
  {
    "moduleId": "M02",
    "moduleName": "Universal Quote and Cart Platform",
    "phase1Posture": "Production foundation",
    "moduleContainers": "MOD_MARKETPLACE_SALES",
    "screenCount": "17",
    "representativeScreens": "SCR_ELIGIBILITY_INTAKE, SCR_PLANO_GUIDED_INTAKE, SCR_QUOTE_RESULTS, SCR_PLAN_DETAIL, SCR_PLAN_COMPARE, SCR_CART_REVIEW, SCR_SHARED_QUOTE_VIEW, SCR_SHARED_QUOTE_CONTINUE, SCR_EDE_HANDOFF_REVIEW, SCR_SUPPLEMENTAL_INTEREST",
    "iaRule": "Owns cross-product commerce state; product logic plugs in."
  },
  {
    "moduleId": "M03",
    "moduleName": "Product Catalog, Product Publishing and Plan Loading",
    "phase1Posture": "Production foundation",
    "moduleContainers": "MOD_PRODUCTS_PLANS",
    "screenCount": "22",
    "representativeScreens": "SCR_PRODUCT_SELECT, SCR_QUOTE_RESULTS, SCR_PLAN_DETAIL, SCR_OFFEX_ENROLL_START, SCR_AGENCY_PRODUCT_ACCESS, SCR_PRODUCT_CATALOG, SCR_PRODUCT_DETAIL, SCR_PRODUCT_EDITOR, SCR_PLAN_EDITOR, SCR_BENEFIT_EDITOR",
    "iaRule": "Final v1.1 build packet controls detailed product decisions."
  },
  {
    "moduleId": "M04",
    "moduleName": "Marketplace Management and White Labeling",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_MARKETPLACE_SALES, MOD_AGENCY_ENTITY",
    "screenCount": "13",
    "representativeScreens": "SCR_CONS_LANDING, SCR_PRODUCT_SELECT, SCR_AGENCY_MARKETPLACES, SCR_AGENCY_MARKETPLACE_DETAIL, SCR_STOREFRONT_EDITOR, SCR_STOREFRONT_PREVIEW, SCR_AGENCY_PRODUCT_ACCESS, SCR_MARKETPLACE_ADMIN, SCR_PRODUCT_PREVIEW, SCR_ICHRA_ENTRY",
    "iaRule": "Marketplace is separate from tenant and organization."
  },
  {
    "moduleId": "M05",
    "moduleName": "Organization, Relationship and Multi-Tenant Model",
    "phase1Posture": "Production foundation",
    "moduleContainers": "MOD_AGENCY_ENTITY",
    "screenCount": "10",
    "representativeScreens": "SCR_AGENT_AFFILIATIONS, SCR_AGENCY_HOME, SCR_ORGANIZATION_PROFILE, SCR_RELATIONSHIP_GRAPH, SCR_AGENCY_HIERARCHY, SCR_TENANTS, SCR_ORGANIZATIONS, SCR_GLOBAL_RELATIONSHIP_GRAPH, SCR_CARRIER_PROFILE, SCR_PARTNER_PROFILE",
    "iaRule": "Tenant is security boundary; relationship graph is not a fixed tree."
  },
  {
    "moduleId": "M06",
    "moduleName": "Agency, Agent and Network Management",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_AGENCY_ENTITY",
    "screenCount": "17",
    "representativeScreens": "SCR_AGENT_HOME, SCR_AGENT_READINESS, SCR_AGENT_AFFILIATIONS, SCR_AGENT_PROFILE, SCR_AGENCY_HOME, SCR_AGENCY_MY_WORK, SCR_ORGANIZATION_PROFILE, SCR_AGENCY_HIERARCHY, SCR_AGENCY_LOCATIONS, SCR_AGENCY_TEAMS",
    "iaRule": "Integrated user experience with M08 compliance data."
  },
  {
    "moduleId": "M07",
    "moduleName": "Contract Sharing and Selling-Paper Marketplace",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_APPOINTMENTS_PAPER",
    "screenCount": "6",
    "representativeScreens": "SCR_AGENCY_MY_WORK, SCR_CONTRACT_LISTINGS, SCR_CONTRACT_REQUESTS, SCR_CONTRACT_GRANTS, SCR_CONTRACT_DETAIL, SCR_CARRIER_CONTRACTS",
    "iaRule": "Contract access does not itself create selling authority."
  },
  {
    "moduleId": "M08",
    "moduleName": "Licensing, Appointments, Credentials and Selling Authority",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_APPOINTMENTS_PAPER",
    "screenCount": "19",
    "representativeScreens": "SCR_QUOTE_RESULTS, SCR_AGENT_QUICK_QUOTE, SCR_AGENT_READINESS, SCR_AGENT_CREDENTIALS, SCR_AGENCY_MY_WORK, SCR_AGENCY_AGENT_DETAIL, SCR_AGENT_ONBOARDING, SCR_CAPTIVE_CONSTRAINTS, SCR_AGENCY_PRODUCT_ACCESS, SCR_CONTRACT_GRANTS",
    "iaRule": "Consumes affiliations, captivity, product, contract and jurisdiction context."
  },
  {
    "moduleId": "M09",
    "moduleName": "Lead, CRM and Customer 360",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_MY_WORK, MOD_LEADS_CUSTOMERS",
    "screenCount": "18",
    "representativeScreens": "SCR_REGISTRATION, SCR_SHARED_QUOTE_CONTINUE, SCR_SUPPLEMENTAL_INTEREST, SCR_MEMBER_HOME, SCR_MEMBER_PROFILE, SCR_AGENT_HOME, SCR_AGENT_MY_WORK, SCR_AGENT_LEADS, SCR_AGENT_LEAD_DETAIL, SCR_AGENT_CUSTOMER_360",
    "iaRule": "Canonical relationship and opportunity records; no duplicate CRM copies."
  },
  {
    "moduleId": "M10",
    "moduleName": "Notifications, Communications, Templates and Scheduling",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_MY_WORK, MOD_COMMUNICATIONS",
    "screenCount": "19",
    "representativeScreens": "SCR_SHARED_QUOTE_VIEW, SCR_SCHEDULE_HELP, SCR_MEMBER_HOME, SCR_SERVICE_REQUEST_DETAIL, SCR_MEMBER_CONSENTS, SCR_MEMBER_MESSAGES, SCR_MEMBER_APPOINTMENTS, SCR_AGENT_MY_WORK, SCR_AGENT_SHARED_QUOTES, SCR_AGENT_COMMUNICATIONS",
    "iaRule": "Twilio provider family is Phase 1 external communications implementation."
  },
  {
    "moduleId": "M11",
    "moduleName": "Vendor Management and Payment Operations",
    "phase1Posture": "Production implementation where required",
    "moduleContainers": "MOD_FORMS_ENROLLMENT, MOD_ADMIN_CONFIG",
    "screenCount": "4",
    "representativeScreens": "SCR_CART_REVIEW, SCR_PAYMENT_CAPTURE, SCR_MEMBER_PAYMENT_METHODS, SCR_PAYMENT_PROVIDER_CONFIG",
    "iaRule": "Actual provider selection is an implementation gate."
  },
  {
    "moduleId": "M12",
    "moduleName": "Commission Schedule, Revenue Projection and Revenue Sharing",
    "phase1Posture": "Production implementation for setup and projection",
    "moduleContainers": "MOD_COMMISSIONS",
    "screenCount": "5",
    "representativeScreens": "SCR_CONTRACT_DETAIL, SCR_COMMISSION_SCHEDULES, SCR_REVENUE_PROJECTIONS, SCR_PROJECTED_STATEMENTS, SCR_PARTNER_REWARDS",
    "iaRule": "Actual payment, reconciliation, chargebacks and payouts remain later."
  },
  {
    "moduleId": "M13",
    "moduleName": "Document, Content, Knowledge, Help and Output Services",
    "phase1Posture": "Production foundation",
    "moduleContainers": "MOD_FORMS_ENROLLMENT, MOD_OUTPUTS_DOCS, MOD_ADMIN_CONFIG",
    "screenCount": "23",
    "representativeScreens": "SCR_DOC_UPLOAD, SCR_ESIGN, SCR_MEMBER_APPLICATION_DETAIL, SCR_MEMBER_DOCUMENTS, SCR_MEMBER_ID_CARDS, SCR_AGENT_OUTPUTS, SCR_PROJECTED_STATEMENTS, SCR_COMMUNICATION_TEMPLATES, SCR_AGENCY_OUTPUTS, SCR_DOCUMENT_REPOSITORY",
    "iaRule": "M03 and M26 associate documents; M13 owns repository and output services."
  },
  {
    "moduleId": "M14",
    "moduleName": "AI Agent Platform and Standalone AI Services",
    "phase1Posture": "Production foundation",
    "moduleContainers": "MOD_AI",
    "screenCount": "5",
    "representativeScreens": "SCR_PLANO_GUIDED_INTAKE, SCR_AI_CONTROL_CENTER, SCR_PLANAI_CONFIG, SCR_AI_KNOWLEDGE_SOURCES, SCR_AI_EVIDENCE",
    "iaRule": "AI assistance remains bounded by deterministic authority and human control."
  },
  {
    "moduleId": "M15",
    "moduleName": "PlanAI Consumer and Agent Shopping Guidance",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_MARKETPLACE_SALES, MOD_AI",
    "screenCount": "6",
    "representativeScreens": "SCR_PLANO_GUIDED_INTAKE, SCR_QUOTE_RESULTS, SCR_PLAN_DETAIL, SCR_PLAN_COMPARE, SCR_PLANAI_CONFIG, SCR_AI_EVIDENCE",
    "iaRule": "PlanAI is the shopping assistant, not the umbrella name for all ABox intelligence."
  },
  {
    "moduleId": "M16",
    "moduleName": "Calling, Dialer and Voice Intelligence",
    "phase1Posture": "Limited production implementation",
    "moduleContainers": "MOD_COMMUNICATIONS",
    "screenCount": "3",
    "representativeScreens": "SCR_AGENT_COMMUNICATIONS, SCR_AGENCY_COMMUNICATIONS, SCR_TWILIO_CONFIG",
    "iaRule": "Predictive dialer, advanced campaign calling, recording analytics and advanced voice intelligence remain later."
  },
  {
    "moduleId": "M17",
    "moduleName": "Cross-Sell, Offer, Bundle and Sponsorship Management",
    "phase1Posture": "Limited production implementation",
    "moduleContainers": "MOD_MARKETPLACE_SALES",
    "screenCount": "1",
    "representativeScreens": "SCR_PRODUCT_RELATIONSHIPS",
    "iaRule": "Advanced promotions, coupons, personalized discounting and dynamic offer optimization remain later."
  },
  {
    "moduleId": "M18",
    "moduleName": "Policy, Member Servicing and Renewals",
    "phase1Posture": "Limited production implementation",
    "moduleContainers": "MOD_MY_WORK, MOD_POLICY_SERVICING",
    "screenCount": "12",
    "representativeScreens": "SCR_MEMBER_HOME, SCR_MEMBER_DOCUMENTS, SCR_MY_COVERAGE, SCR_MEMBER_POLICY_DETAIL, SCR_MEMBER_ID_CARDS, SCR_SERVICE_REQUEST_START, SCR_SERVICE_REQUEST_DETAIL, SCR_AGENT_MY_WORK, SCR_AGENT_POLICIES, SCR_AGENT_POLICY_DETAIL",
    "iaRule": "Carrier or external system remains contractual source where applicable."
  },
  {
    "moduleId": "M19",
    "moduleName": "Medicare Distribution",
    "phase1Posture": "Protected seam",
    "moduleContainers": "MOD_PRODUCTS_PLANS",
    "screenCount": "2",
    "representativeScreens": "SCR_PROTECTED_SEAM_REGISTRY, SCR_MEDICARE_SEAM",
    "iaRule": "No Phase 1 commercial implementation."
  },
  {
    "moduleId": "M20",
    "moduleName": "ICHRA and Employer-Sponsored Shopping",
    "phase1Posture": "Limited production implementation",
    "moduleContainers": "MOD_MARKETPLACE_SALES, MOD_PRODUCTS_PLANS",
    "screenCount": "8",
    "representativeScreens": "SCR_PRODUCT_SELECT, SCR_ICHRA_ENTRY, SCR_EMPLOYER_PROFILE, SCR_CENSUS_UPLOAD, SCR_ICHRA_QUOTE, SCR_ICHRA_RESULTS, SCR_ICHRA_PROPOSAL, SCR_ICHRA_ROUTING",
    "iaRule": "Full employer and employee administration remains later."
  },
  {
    "moduleId": "M21",
    "moduleName": "Ancillary, Supplemental, Add-On and Custom Products",
    "phase1Posture": "Production plus limited implementation by product",
    "moduleContainers": "MOD_MARKETPLACE_SALES, MOD_PRODUCTS_PLANS",
    "screenCount": "2",
    "representativeScreens": "SCR_PRODUCT_SELECT, SCR_SUPPLEMENTAL_INTEREST",
    "iaRule": "Uses shared catalog, quote, cart and pathway services rather than cloned flows."
  },
  {
    "moduleId": "M22",
    "moduleName": "Fully Insured and Self-Funded Group",
    "phase1Posture": "Protected seam",
    "moduleContainers": "MOD_PRODUCTS_PLANS",
    "screenCount": "2",
    "representativeScreens": "SCR_PROTECTED_SEAM_REGISTRY, SCR_GROUP_SEAM",
    "iaRule": "No Phase 1 commercial implementation."
  },
  {
    "moduleId": "M23",
    "moduleName": "Carrier-Led Distribution and Product Publishing",
    "phase1Posture": "Protected seam",
    "moduleContainers": "MOD_AGENCY_ENTITY",
    "screenCount": "4",
    "representativeScreens": "SCR_PROTECTED_SEAM_REGISTRY, SCR_CARRIER_LED_SEAM, SCR_CARRIER_HOME, SCR_CARRIER_PRODUCTS",
    "iaRule": "Carrier products may be loaded in Phase 1; full carrier-led operations remain later."
  },
  {
    "moduleId": "M24",
    "moduleName": "Data Warehouse, Analytics and Reporting",
    "phase1Posture": "Production foundation",
    "moduleContainers": "MOD_REPORTING",
    "screenCount": "9",
    "representativeScreens": "SCR_AGENT_REPORTS, SCR_AGENCY_REPORTS, SCR_PLATFORM_HOME, SCR_REPORT_CATALOG, SCR_METRIC_DICTIONARY, SCR_DATA_QUALITY, SCR_ANALYTICS_DATASETS, SCR_CARRIER_REPORTS, SCR_PARTNER_MARKETPLACE",
    "iaRule": "Technology selection remains architecture work."
  },
  {
    "moduleId": "M25",
    "moduleName": "Customer Service, Ticketing and Compliance Case Management",
    "phase1Posture": "Protected seam",
    "moduleContainers": "MOD_MY_WORK, MOD_POLICY_SERVICING",
    "screenCount": "2",
    "representativeScreens": "SCR_PROTECTED_SEAM_REGISTRY, SCR_CASE_MANAGEMENT_SEAM",
    "iaRule": "Phase 1 uses shared tasks and structured service requests, not full case management."
  },
  {
    "moduleId": "M26",
    "moduleName": "Forms, Applications and Enrollment Pathways",
    "phase1Posture": "Production implementation",
    "moduleContainers": "MOD_FORMS_ENROLLMENT",
    "screenCount": "22",
    "representativeScreens": "SCR_CART_REVIEW, SCR_OFFEX_ENROLL_START, SCR_DYNAMIC_FORM, SCR_DOC_UPLOAD, SCR_ESIGN, SCR_PAYMENT_CAPTURE, SCR_APPLICATION_REVIEW, SCR_SUBMISSION_STATUS, SCR_MEMBER_APPLICATIONS, SCR_MEMBER_APPLICATION_DETAIL",
    "iaRule": "Later approved module; must be added to consolidated registry."
  }
];
