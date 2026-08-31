/** Phase 1 IA v1 → v2 delta register. */
export interface IaDelta {
  deltaId: string;
  area: string;
  change: string;
  v2Disposition: string;
  status: string;
  affectedArtifacts: string;
}

export const IA_DELTA: IaDelta[] = [
  {
    "deltaId": "DLT-IA2-001",
    "area": "Source hierarchy",
    "change": "Replace the historical Phase 1 Blueprint as controlling scope with the approved Phase 1 Source Package v1.0.",
    "v2Disposition": "v2.0 controls Phase 1 IA; old blueprint is historical visual/concept reference only.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-002",
    "area": "Supersession",
    "change": "Supersede ABox Phase 1 IA v1.0 as the active IA baseline.",
    "v2Disposition": "v1 remains historical for lineage; v2 is the complete replacement baseline.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-003",
    "area": "Terminology",
    "change": "Remove retired delivery-slice terminology from all Phase 1 IA artifacts.",
    "v2Disposition": "Phase 1 is the go-to-market RVP; no retired parity framing appears.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-004",
    "area": "PlanAI",
    "change": "Rename Plan AI/Plan-AI display language to PlanAI while preserving stable IDs and traceability.",
    "v2Disposition": "Known screen ID SCR_PLANO_GUIDED_INTAKE is retained with new display label.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-005",
    "area": "Module registry",
    "change": "Map every IA surface to stable canonical modules M00-M26 and separate module identity from build sequence.",
    "v2Disposition": "Delivery sequence follows SEQ-00 through SEQ-04, not numeric IDs.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-006",
    "area": "M02 ownership",
    "change": "Replace generic shopping container assumptions with the approved product-agnostic Shopping Journey, Quote Session, Quote Result, Quote Snapshot, Comparison Set, Cart and Cart Item model.",
    "v2Disposition": "Commerce screens use M02 canonical objects and progression.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-007",
    "area": "M03 ownership",
    "change": "Replace generic product builder assumptions with the M03 Product Line -> Product Family -> Product -> Plan -> Distribution Offering hierarchy.",
    "v2Disposition": "Product administration and offering-context screens are expanded.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-008",
    "area": "M26 ownership",
    "change": "Formalize Forms, Applications and Enrollment Pathways as M26.",
    "v2Disposition": "Forms, application, document requirement, signature, payment and submission surfaces map to M26 boundaries.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-009",
    "area": "Agency operations",
    "change": "Expand minimal agency setup to comprehensive agency, agent, network, affiliation, onboarding, configuration inheritance and offboarding IA.",
    "v2Disposition": "Agency and Agent Management is production depth in Phase 1.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-010",
    "area": "Captive agents",
    "change": "Add first-class captive and exclusivity constraint administration and enforcement visibility.",
    "v2Disposition": "M06 owns relationship; M08 enforces it in authority decisions.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-011",
    "area": "Contracts and authority",
    "change": "Expand B2B2C paper sharing, credentials and authoritative selling/servicing decisions.",
    "v2Disposition": "Contract access remains distinct from appointment, product authorization and authority.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-012",
    "area": "Payments",
    "change": "Promote payment from a front-end seam to real tokenized provider integration where a pathway requires it.",
    "v2Disposition": "M11 configuration, payment methods and transaction status surfaces added.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-013",
    "area": "Electronic signature",
    "change": "Add JET E-Signature as default and DocuSign when licensed and configured.",
    "v2Disposition": "Provider policy and separate configuration surfaces added.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-014",
    "area": "Communications",
    "change": "Lock Twilio/Twilio SendGrid as Phase 1 external provider and expand unified communication and scheduling surfaces.",
    "v2Disposition": "Front-end connect, test, activate and health administration added.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-015",
    "area": "Commission stages",
    "change": "Represent setup and projection in Phase 1 while preserving actual reconciliation and payout as later depth.",
    "v2Disposition": "Schedules, projections and projected statements added; no paid-state UI is implied.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-016",
    "area": "Policy servicing",
    "change": "Add limited production policy, member, ID card, QLE, demographic, dependent, termination and renewal surfaces.",
    "v2Disposition": "M18 limited production IA added.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-017",
    "area": "Reporting and data",
    "change": "Expand operational reporting, Output Studio, metric dictionary, datasets, lineage and data-quality IA.",
    "v2Disposition": "M24 is a production foundation rather than a future seam.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-018",
    "area": "AI governance",
    "change": "Separate PlanAI shopping surfaces from the M14 AI Control Center and evidence model.",
    "v2Disposition": "Embedded assistance and centralized governance coexist.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-019",
    "area": "Protected seams",
    "change": "Represent M19, M22, M23 and M25 as explicit protected seams without presenting them as implemented Phase 1 features.",
    "v2Disposition": "Reference screens and registry added.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  },
  {
    "deltaId": "DLT-IA2-020",
    "area": "Consumption guidance",
    "change": "Remove recipient-specific execution files from the IA package.",
    "v2Disposition": "A single generic README controls consumption order; recipient instructions are external communications.",
    "status": "Applied",
    "affectedArtifacts": "Master IA, screen catalog, workbook, JSON and downstream wireframes"
  }
];
