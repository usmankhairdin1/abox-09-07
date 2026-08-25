/** Phase 1 IA v2.0 control and extension record registry. */
export interface IaControlRecord {
  id: string;
  name: string;
  recordClass: string;
  ownerModule: string;
  definition: string;
  canonicalReference: string;
  persistenceRule: string;
  status: string;
}

export const IA_CONTROL_RECORDS: IaControlRecord[] = [
  {
    "id": "OBJ-AI-CAPABILITY",
    "name": "AI Capability Configuration",
    "recordClass": "IA control record",
    "ownerModule": "M14",
    "definition": "Governed AI capability, deployment mode, skill, model, knowledge, access, guardrail and evidence configuration.",
    "canonicalReference": "OBJ-AI-INTERACTION",
    "persistenceRule": "May persist as AI configuration, but may not duplicate the canonical AI Interaction evidence record. M14 must finalize the physical model.",
    "status": "IA registered; canonicalization owned by M14 packet"
  },
  {
    "id": "OBJ-CENSUS",
    "name": "Employer Census Version",
    "recordClass": "Module-extension business record",
    "ownerModule": "M20",
    "definition": "Versioned employer census used for ICHRA quoting, validation and proposal generation.",
    "canonicalReference": "OBJ-EMPLOYER",
    "persistenceRule": "Must link to the canonical Employer Account and retain import/version provenance. M20 must promote or map the final object.",
    "status": "IA registered; canonicalization owned by M20 packet"
  },
  {
    "id": "OBJ-CONSENT-POLICY",
    "name": "Consent and Contact Policy",
    "recordClass": "IA control record",
    "ownerModule": "M00",
    "definition": "Versioned policy defining purpose, channel, jurisdiction, quiet-hour, frequency and eligibility requirements for communication.",
    "canonicalReference": "OBJ-CONSENT / OBJ-CONTACT-ELIGIBILITY",
    "persistenceRule": "Policy configuration may not replace transaction-level Consent Grants or Contact Eligibility records.",
    "status": "IA registered; canonicalization owned by M00 packet"
  },
  {
    "id": "OBJ-CONTENT-ITEM",
    "name": "Governed Content Item",
    "recordClass": "IA control record",
    "ownerModule": "M13",
    "definition": "Versioned FAQ, disclosure, notice, help, guidance or translated content used across contextual surfaces.",
    "canonicalReference": "OBJ-DOCUMENT / OBJ-TEMPLATE",
    "persistenceRule": "M13 must decide whether each content class maps to Document, Template or a promoted content object; duplicate repositories are prohibited.",
    "status": "IA registered; canonicalization owned by M13 packet"
  },
  {
    "id": "OBJ-CONTEXT-REFERENCE",
    "name": "Authorized Context Reference",
    "recordClass": "IA polymorphic reference",
    "ownerModule": "M00",
    "definition": "Permission-aware reference from a task, communication, audit event, AI interaction or output to one or more canonical business objects.",
    "canonicalReference": "Any authorized canonical object ID",
    "persistenceRule": "Not a standalone business record. It is a typed object reference and cannot own duplicated business data.",
    "status": "IA registered; platform reference contract"
  },
  {
    "id": "OBJ-CONTRACT-ACCESS-REQUEST",
    "name": "Contract Access Request",
    "recordClass": "Module-extension business record",
    "ownerModule": "M07",
    "definition": "Request for an organization to receive defined contract access, scope and delegation rights.",
    "canonicalReference": "OBJ-CONTRACT / OBJ-CONTRACT-ACCESS",
    "persistenceRule": "Approved requests create or update a canonical Contract Access Grant; request history remains auditable.",
    "status": "IA registered; canonicalization owned by M07 packet"
  },
  {
    "id": "OBJ-CONTRACT-LISTING",
    "name": "Contract Access Listing",
    "recordClass": "Module-extension business record",
    "ownerModule": "M07",
    "definition": "Private, invitation-only or network listing through which eligible organizations discover or request contract access.",
    "canonicalReference": "OBJ-CONTRACT",
    "persistenceRule": "Must reference the canonical Contract and cannot duplicate contract terms.",
    "status": "IA registered; canonicalization owned by M07 packet"
  },
  {
    "id": "OBJ-CREDENTIAL",
    "name": "Credential Readiness Aggregate",
    "recordClass": "IA aggregate view",
    "ownerModule": "M08",
    "definition": "Readiness aggregate across license, agency license, appointment, certification, E&O and verification evidence.",
    "canonicalReference": "OBJ-LICENSE / OBJ-AGENCY-LICENSE / OBJ-APPOINTMENT / OBJ-CERTIFICATION / OBJ-EO",
    "persistenceRule": "May cache a derived readiness result, but source credential records remain canonical and independently versioned.",
    "status": "IA registered; aggregate owned by M08 packet"
  },
  {
    "id": "OBJ-DATASET",
    "name": "Governed Analytics Dataset",
    "recordClass": "IA control record",
    "ownerModule": "M24",
    "definition": "Curated, permissioned and lineage-aware dataset used for reporting, exports and analytics.",
    "canonicalReference": "OBJ-CANONICAL-EVENT / canonical business objects",
    "persistenceRule": "Does not become a transactional system of record; lineage to source objects and events is mandatory.",
    "status": "IA registered; canonicalization owned by M24 packet"
  },
  {
    "id": "OBJ-ENROLLMENT-PATHWAY",
    "name": "Application and Enrollment Pathway",
    "recordClass": "Module-extension configuration record",
    "ownerModule": "M26",
    "definition": "Versioned executable pathway that orchestrates forms, documents, signatures, payment, review, handoff and submission steps.",
    "canonicalReference": "OBJ-PATHWAY-BINDING / OBJ-FORM-DEFINITION",
    "persistenceRule": "M26 owns the pathway definition; M03 owns only the versioned binding from Product or Offering.",
    "status": "IA registered; canonicalization owned by M26 packet"
  },
  {
    "id": "OBJ-HANDOFF",
    "name": "External Handoff Record",
    "recordClass": "Module-extension transaction record",
    "ownerModule": "M26",
    "definition": "Versioned and status-tracked handoff from ABox to EDE, carrier, partner or manual operating destination.",
    "canonicalReference": "OBJ-CART-ITEM / OBJ-INTEGRATION-MESSAGE",
    "persistenceRule": "Must retain correlation, payload version, destination and outcome without duplicating Application or Policy records.",
    "status": "IA registered; canonicalization owned by M26 packet"
  },
  {
    "id": "OBJ-IMPORT-RUN",
    "name": "Import Run",
    "recordClass": "IA operational record",
    "ownerModule": "M03",
    "definition": "Staged product, rate, benefit or source ingestion execution with mappings, provenance, validation and outcomes.",
    "canonicalReference": "OBJ-PRODUCT-VERSION / OBJ-RATE",
    "persistenceRule": "Operational evidence may persist, but imported business data must resolve to canonical product objects.",
    "status": "IA registered; canonicalization owned by M03 packet"
  },
  {
    "id": "OBJ-INTEGRATION-RUN",
    "name": "Integration Run",
    "recordClass": "IA operational record",
    "ownerModule": "M00",
    "definition": "Scheduled, event-driven or manual connector execution with correlation, status, retry, reconciliation and errors.",
    "canonicalReference": "OBJ-CONNECTOR / OBJ-INTEGRATION-MESSAGE",
    "persistenceRule": "Operational run evidence may not replace the canonical business transaction it transports.",
    "status": "IA registered; canonicalization owned by M00 packet"
  },
  {
    "id": "OBJ-KNOWLEDGE-SOURCE",
    "name": "Approved Knowledge Source",
    "recordClass": "IA control record",
    "ownerModule": "M14",
    "definition": "Permissioned, versioned and approved source available to PlanAI or other governed intelligence capabilities.",
    "canonicalReference": "OBJ-DOCUMENT / OBJ-AI-INTERACTION",
    "persistenceRule": "Knowledge source metadata must reference approved content; AI evidence still records the sources actually used.",
    "status": "IA registered; canonicalization owned by M14 packet"
  },
  {
    "id": "OBJ-LAUNCH-GATE",
    "name": "Production Launch Gate",
    "recordClass": "IA control record",
    "ownerModule": "M00",
    "definition": "Formal product, legal, security, data, integration, operational or commercial gate and evidence status for a release.",
    "canonicalReference": "OBJ-RELEASE",
    "persistenceRule": "Gate evidence is control metadata and cannot imply a certification or approval that has not occurred.",
    "status": "IA registered; canonicalization owned by M00 packet"
  },
  {
    "id": "OBJ-LOCATION",
    "name": "Organization Location",
    "recordClass": "Module-extension business record",
    "ownerModule": "M05",
    "definition": "Legal, operating, service or office location related to an organization, marketplace or team.",
    "canonicalReference": "OBJ-ORGANIZATION",
    "persistenceRule": "Must remain linked to the canonical Organization and must not create an independent tenant hierarchy.",
    "status": "IA registered; canonicalization owned by M05 packet"
  },
  {
    "id": "OBJ-METRIC-DEFINITION",
    "name": "Metric Definition",
    "recordClass": "IA control record",
    "ownerModule": "M24",
    "definition": "Governed KPI definition, formula, dimensions, time basis, source lineage and approved interpretation.",
    "canonicalReference": "OBJ-CANONICAL-EVENT / OBJ-DATASET",
    "persistenceRule": "Metric definitions govern calculation and do not own source transaction values.",
    "status": "IA registered; canonicalization owned by M24 packet"
  },
  {
    "id": "OBJ-ONBOARDING-CASE",
    "name": "Organization or Agent Onboarding Case",
    "recordClass": "Module-extension workflow record",
    "ownerModule": "M06",
    "definition": "Controlled onboarding workflow for an agency, agent, network or delegated relationship, including reviews and exceptions.",
    "canonicalReference": "OBJ-ORGANIZATION / OBJ-AGENT-PROFILE / OBJ-TASK",
    "persistenceRule": "May coordinate work but must not duplicate canonical organization, agent or credential data.",
    "status": "IA registered; canonicalization owned by M06 packet"
  },
  {
    "id": "OBJ-PLATFORM",
    "name": "ABox Platform Context",
    "recordClass": "IA control record",
    "ownerModule": "M00",
    "definition": "Top-level platform administration and operational context used for JET-wide controls, health and oversight.",
    "canonicalReference": "OBJ-TENANT / OBJ-CONFIG",
    "persistenceRule": "Not a separate tenant or customer record; it is a control context over platform-wide services and policies.",
    "status": "IA registered; platform control context"
  },
  {
    "id": "OBJ-PRODUCT-RELATIONSHIP",
    "name": "Product Relationship",
    "recordClass": "Module-extension configuration record",
    "ownerModule": "M03",
    "definition": "Versioned companion, add-on, dependency, replacement or limited package relationship between products or offerings.",
    "canonicalReference": "OBJ-PRODUCT / OBJ-OFFERING",
    "persistenceRule": "May support Phase 1 cross-sell; offer, coupon and advanced promotion execution remains M17.",
    "status": "IA registered; canonicalization owned by M03 with M17 seam"
  },
  {
    "id": "OBJ-PROTECTED-SEAM",
    "name": "Protected Architecture Seam",
    "recordClass": "IA control record",
    "ownerModule": "M00",
    "definition": "Named future capability boundary, interface or object contract intentionally protected without representing it as implemented.",
    "canonicalReference": "Canonical module/service/interface IDs",
    "persistenceRule": "Governance metadata only; never present as an active user capability without an approved build decision.",
    "status": "IA registered; platform governance record"
  },
  {
    "id": "OBJ-QUESTION",
    "name": "Form Question Definition",
    "recordClass": "Module-extension configuration record",
    "ownerModule": "M26",
    "definition": "Reusable question or field definition with type, validation, classification, permissions and localization.",
    "canonicalReference": "OBJ-FORM-DEFINITION",
    "persistenceRule": "Question versions belong to the M26 form-definition model and may not create product-specific duplicate schemas.",
    "status": "IA registered; canonicalization owned by M26 packet"
  },
  {
    "id": "OBJ-REFERRAL",
    "name": "Referral Record",
    "recordClass": "Module-extension business record",
    "ownerModule": "M09",
    "definition": "Partner, source or person referral that creates or influences a lead, opportunity, assignment and attribution chain.",
    "canonicalReference": "OBJ-LEAD / OBJ-OPPORTUNITY / OBJ-ATTRIBUTION",
    "persistenceRule": "Referral context must link to canonical CRM and attribution objects rather than duplicating a customer or transaction.",
    "status": "IA registered; canonicalization owned by M09 packet"
  },
  {
    "id": "OBJ-RELEASE",
    "name": "Controlled Release",
    "recordClass": "IA control record",
    "ownerModule": "M00",
    "definition": "Versioned release or rollout unit used to group scope, feature flags, gates, cohorts and evidence.",
    "canonicalReference": "OBJ-CONFIG / OBJ-LAUNCH-GATE",
    "persistenceRule": "Release metadata controls rollout but does not alter canonical module IDs or Phase 1 scope without an approved delta.",
    "status": "IA registered; canonicalization owned by M00 packet"
  },
  {
    "id": "OBJ-REPORT-DEFINITION",
    "name": "Report Definition",
    "recordClass": "IA control record",
    "ownerModule": "M24",
    "definition": "Governed report, dashboard or export definition over approved datasets, dimensions, columns and access rules.",
    "canonicalReference": "OBJ-OUTPUT / OBJ-DATASET",
    "persistenceRule": "Definitions control presentation and scheduling; exported outputs remain canonical Generated Outputs.",
    "status": "IA registered; canonicalization owned by M24 packet"
  },
  {
    "id": "OBJ-SECURITY-FINDING",
    "name": "Security Finding",
    "recordClass": "IA control record",
    "ownerModule": "M00",
    "definition": "Tracked vulnerability, test finding or control exception with severity, evidence, owner, remediation and closure.",
    "canonicalReference": "OBJ-TASK / OBJ-AUDIT-EVENT",
    "persistenceRule": "Security evidence is restricted and must not expose secrets or sensitive payloads in general work queues.",
    "status": "IA registered; canonicalization owned by M00 security packet"
  },
  {
    "id": "OBJ-SHARED-QUOTE",
    "name": "Shared Quote Package",
    "recordClass": "Module-extension transaction record",
    "ownerModule": "M02",
    "definition": "Tokenized, permissioned package of immutable quote snapshots sent for read-only review or authenticated continuation.",
    "canonicalReference": "OBJ-QUOTE-SNAPSHOT / OBJ-COMMUNICATION",
    "persistenceRule": "Must not copy mutable quote or cart state; authenticated continuation revalidates and creates consumer-owned journey state.",
    "status": "IA registered; canonicalization owned by M02 packet"
  },
  {
    "id": "OBJ-SUPPORT-ACCESS",
    "name": "Support Access Grant",
    "recordClass": "IA control record",
    "ownerModule": "M00",
    "definition": "Time-limited, reason-coded and audited JET support or emergency access to a customer context.",
    "canonicalReference": "OBJ-PERMISSION-POLICY / OBJ-AUDIT-EVENT",
    "persistenceRule": "Grant is temporary control evidence and may not bypass tenant, privacy or compliance policy.",
    "status": "IA registered; canonicalization owned by M00 packet"
  },
  {
    "id": "OBJ-TEAM",
    "name": "Organization Team",
    "recordClass": "Module-extension business record",
    "ownerModule": "M05",
    "definition": "Operational grouping of users and affiliations for assignments, reporting, capacity or administration.",
    "canonicalReference": "OBJ-ORGANIZATION / OBJ-AFFILIATION",
    "persistenceRule": "Must remain relationship-based and may not create a parallel agent identity or organization hierarchy.",
    "status": "IA registered; canonicalization owned by M05 packet"
  }
];
