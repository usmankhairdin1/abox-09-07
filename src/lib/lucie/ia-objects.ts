/** Phase 1 IA v2.0 canonical object relationships. */
export interface IaObjectRelationship {
  relationshipId: string;
  sourceObject: string;
  relationship: string;
  targetObject: string;
  rule: string;
}

export const IA_OBJECTS: IaObjectRelationship[] = [
  {
    "relationshipId": "REL-IA2-001",
    "sourceObject": "OBJ-TENANT",
    "relationship": "contains",
    "targetObject": "OBJ-ORGANIZATION",
    "rule": "A tenant may contain multiple related organizations; an organization belongs to one active tenant boundary at a time."
  },
  {
    "relationshipId": "REL-IA2-002",
    "sourceObject": "OBJ-ORGANIZATION",
    "relationship": "participates in",
    "targetObject": "OBJ-MARKETPLACE",
    "rule": "An organization may own or participate in multiple marketplaces."
  },
  {
    "relationshipId": "REL-IA2-003",
    "sourceObject": "OBJ-ORGANIZATION",
    "relationship": "has",
    "targetObject": "OBJ-ORG-REL",
    "rule": "Relationships are effective-dated, scoped and non-destructive."
  },
  {
    "relationshipId": "REL-IA2-004",
    "sourceObject": "OBJ-AGENT-PROFILE",
    "relationship": "has",
    "targetObject": "OBJ-AFFILIATION",
    "rule": "A producer may have multiple organization and marketplace affiliations."
  },
  {
    "relationshipId": "REL-IA2-005",
    "sourceObject": "OBJ-AFFILIATION",
    "relationship": "is constrained by",
    "targetObject": "OBJ-CAPTIVITY",
    "rule": "Captive and hybrid constraints apply to active transaction context."
  },
  {
    "relationshipId": "REL-IA2-006",
    "sourceObject": "OBJ-MARKETPLACE",
    "relationship": "offers",
    "targetObject": "OBJ-OFFERING",
    "rule": "Offerings carry product, contract, date, geography, channel and operator context."
  },
  {
    "relationshipId": "REL-IA2-007",
    "sourceObject": "OBJ-PRODUCT",
    "relationship": "contains",
    "targetObject": "OBJ-PLAN",
    "rule": "A product has one or more selectable plans."
  },
  {
    "relationshipId": "REL-IA2-008",
    "sourceObject": "OBJ-PLAN",
    "relationship": "is offered as",
    "targetObject": "OBJ-OFFERING",
    "rule": "The same plan may be offered differently by marketplace, contract and period."
  },
  {
    "relationshipId": "REL-IA2-009",
    "sourceObject": "OBJ-SHOPPING-JOURNEY",
    "relationship": "contains",
    "targetObject": "OBJ-QUOTE-SESSION",
    "rule": "One journey may contain multiple product-specific quote sessions."
  },
  {
    "relationshipId": "REL-IA2-010",
    "sourceObject": "OBJ-QUOTE-SESSION",
    "relationship": "produces",
    "targetObject": "OBJ-QUOTE-RESULT",
    "rule": "Results preserve source, certainty, availability and rule context."
  },
  {
    "relationshipId": "REL-IA2-011",
    "sourceObject": "OBJ-QUOTE-RESULT",
    "relationship": "snapshotted as",
    "targetObject": "OBJ-QUOTE-SNAPSHOT",
    "rule": "Selected and shared results use immutable snapshots."
  },
  {
    "relationshipId": "REL-IA2-012",
    "sourceObject": "OBJ-SHOPPING-JOURNEY",
    "relationship": "owns active",
    "targetObject": "OBJ-CART",
    "rule": "One active cart per journey; historical versions preserved."
  },
  {
    "relationshipId": "REL-IA2-013",
    "sourceObject": "OBJ-CART",
    "relationship": "contains",
    "targetObject": "OBJ-CART-ITEM",
    "rule": "Each item has independent readiness and next path."
  },
  {
    "relationshipId": "REL-IA2-014",
    "sourceObject": "OBJ-LEAD",
    "relationship": "has",
    "targetObject": "OBJ-OPPORTUNITY",
    "rule": "A master relationship may have multiple product pursuits."
  },
  {
    "relationshipId": "REL-IA2-015",
    "sourceObject": "OBJ-CUSTOMER",
    "relationship": "belongs to",
    "targetObject": "OBJ-HOUSEHOLD",
    "rule": "Individual and household relationships are modeled separately from identity."
  },
  {
    "relationshipId": "REL-IA2-016",
    "sourceObject": "OBJ-EMPLOYER",
    "relationship": "has",
    "targetObject": "OBJ-CENSUS",
    "rule": "Employer accounts may hold versioned census data for quoting."
  },
  {
    "relationshipId": "REL-IA2-017",
    "sourceObject": "OBJ-APPLICATION",
    "relationship": "uses",
    "targetObject": "OBJ-FORM-DEFINITION",
    "rule": "Application stores the published form template version used."
  },
  {
    "relationshipId": "REL-IA2-018",
    "sourceObject": "OBJ-APPLICATION",
    "relationship": "executes",
    "targetObject": "OBJ-ENROLLMENT-PATHWAY",
    "rule": "Pathway version controls documents, signatures, payment, review and submission."
  },
  {
    "relationshipId": "REL-IA2-019",
    "sourceObject": "OBJ-APPLICATION",
    "relationship": "has",
    "targetObject": "OBJ-DOCUMENT",
    "rule": "Documents link to application version and requirement context."
  },
  {
    "relationshipId": "REL-IA2-020",
    "sourceObject": "OBJ-APPLICATION",
    "relationship": "has",
    "targetObject": "OBJ-SIGNATURE-PACKAGE",
    "rule": "Signature provider and evidence remain pinned once initiated."
  },
  {
    "relationshipId": "REL-IA2-021",
    "sourceObject": "OBJ-APPLICATION",
    "relationship": "has",
    "targetObject": "OBJ-PAYMENT",
    "rule": "Payment is linked by application and cart item when required."
  },
  {
    "relationshipId": "REL-IA2-022",
    "sourceObject": "OBJ-APPLICATION",
    "relationship": "produces",
    "targetObject": "OBJ-SUBMISSION",
    "rule": "Each attempt is versioned and independently tracked."
  },
  {
    "relationshipId": "REL-IA2-023",
    "sourceObject": "OBJ-CONTRACT",
    "relationship": "published through",
    "targetObject": "OBJ-CONTRACT-LISTING",
    "rule": "Listings expose permitted scope without transferring ownership."
  },
  {
    "relationshipId": "REL-IA2-024",
    "sourceObject": "OBJ-CONTRACT-ACCESS-REQUEST",
    "relationship": "creates",
    "targetObject": "OBJ-CONTRACT-ACCESS",
    "rule": "Approved requests create effective-dated grants."
  },
  {
    "relationshipId": "REL-IA2-025",
    "sourceObject": "OBJ-CONTRACT-ACCESS",
    "relationship": "feeds",
    "targetObject": "OBJ-AUTHORITY-DECISION",
    "rule": "Contract access is one input, not proof of full authority."
  },
  {
    "relationshipId": "REL-IA2-026",
    "sourceObject": "OBJ-CREDENTIAL",
    "relationship": "feeds",
    "targetObject": "OBJ-AUTHORITY-DECISION",
    "rule": "Licenses, appointments, training and E&O are independently evaluated."
  },
  {
    "relationshipId": "REL-IA2-027",
    "sourceObject": "OBJ-COMMISSION-SCHEDULE",
    "relationship": "applies to",
    "targetObject": "OBJ-CONTRACT",
    "rule": "Schedule source and precedence are preserved."
  },
  {
    "relationshipId": "REL-IA2-028",
    "sourceObject": "OBJ-COMMISSION-PROJECTION",
    "relationship": "references",
    "targetObject": "OBJ-COMMISSION-SCHEDULE",
    "rule": "Projection stores exact schedule and attribution version."
  },
  {
    "relationshipId": "REL-IA2-029",
    "sourceObject": "OBJ-POLICY",
    "relationship": "covers",
    "targetObject": "OBJ-COVERED-MEMBER",
    "rule": "Policy records identify covered members without claiming issuance absent confirmation."
  },
  {
    "relationshipId": "REL-IA2-030",
    "sourceObject": "OBJ-POLICY",
    "relationship": "has",
    "targetObject": "OBJ-SERVICE-REQUEST",
    "rule": "Service requests remain requested/pending until external confirmation."
  },
  {
    "relationshipId": "REL-IA2-031",
    "sourceObject": "OBJ-TASK",
    "relationship": "references",
    "targetObject": "OBJ-CONTEXT-REFERENCE",
    "rule": "Tasks and exceptions are shared platform work, not copied into each module."
  },
  {
    "relationshipId": "REL-IA2-032",
    "sourceObject": "OBJ-COMMUNICATION",
    "relationship": "references",
    "targetObject": "OBJ-CONTEXT-REFERENCE",
    "rule": "Messages and calls maintain contextual record links."
  },
  {
    "relationshipId": "REL-IA2-033",
    "sourceObject": "OBJ-AUDIT-EVENT",
    "relationship": "references",
    "targetObject": "OBJ-CONTEXT-REFERENCE",
    "rule": "Audit is append-only and permission-filtered."
  },
  {
    "relationshipId": "REL-IA2-034",
    "sourceObject": "OBJ-AI-INTERACTION",
    "relationship": "references",
    "targetObject": "OBJ-CONTEXT-REFERENCE",
    "rule": "Material AI evidence records model, prompt/skill, sources, output and human action."
  },
  {
    "relationshipId": "REL-IA2-035",
    "sourceObject": "OBJ-OUTPUT",
    "relationship": "references",
    "targetObject": "OBJ-CONTEXT-REFERENCE",
    "rule": "Every output can be reconstructed from source data and template versions."
  }
];
