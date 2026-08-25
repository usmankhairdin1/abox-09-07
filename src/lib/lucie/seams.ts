/** Protected seam register (17). Source: ABox_Lucie_Protected_Seam_Register_v1.0. */
export interface Seam {
  seamId: string;
  moduleId: string;
  protectedCapability: string;
  lucieTreatment: string;
  rule: string;
}

export const SEAMS: Seam[] = [
  {
    "seamId": "LUC-SEAM-001",
    "moduleId": "M05",
    "protectedCapability": "Full relationship graph",
    "lucieTreatment": "Lucie uses one-parent/downline view but retains canonical organization IDs and effective-dated relationship boundary.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-002",
    "moduleId": "M06",
    "protectedCapability": "Multiple concurrent affiliations",
    "lucieTreatment": "Lucie exposes one primary active agency affiliation; data model must not prevent later affiliations.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-003",
    "moduleId": "M07",
    "protectedCapability": "Contract sharing marketplace",
    "lucieTreatment": "No Lucie UI; retain module, object and authority seams.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-004",
    "moduleId": "M03",
    "protectedCapability": "Dynamic product and formula platform",
    "lucieTreatment": "Lucie uses fixed mappings and canned structures; do not collapse canonical product/version boundaries.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-005",
    "moduleId": "M26",
    "protectedCapability": "Dynamic form configurator",
    "lucieTreatment": "Lucie uses fixed forms; retain form/version/pathway ownership boundary.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-006",
    "moduleId": "M11",
    "protectedCapability": "Live payment provider",
    "lucieTreatment": "Lucie simulates only outside production and preserves provider-adapter/status contracts.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-007",
    "moduleId": "M12",
    "protectedCapability": "Commission and revenue operations",
    "lucieTreatment": "Retain attribution fields and module boundary; no commission UI or calculation.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-008",
    "moduleId": "M18",
    "protectedCapability": "Policy and member servicing",
    "lucieTreatment": "No policy lifecycle; preserve application-to-policy outcome seam.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-009",
    "moduleId": "M16",
    "protectedCapability": "Calling, dialer and voice intelligence",
    "lucieTreatment": "No Lucie module surface; retain communication event boundary.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-010",
    "moduleId": "M17",
    "protectedCapability": "Offers, promotions and sponsorships",
    "lucieTreatment": "No offer engine; do not hardcode cross-sell behavior that blocks later expansion.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-011",
    "moduleId": "M20",
    "protectedCapability": "Full ICHRA administration",
    "lucieTreatment": "Quote and route interest only; preserve employer/employee administration boundary.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-012",
    "moduleId": "M21",
    "protectedCapability": "Additional supplemental product lines",
    "lucieTreatment": "Dental and vision only; retain product-family extensibility.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-013",
    "moduleId": "M19",
    "protectedCapability": "Medicare distribution",
    "lucieTreatment": "No Lucie implementation; retain product and pathway module ID.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-014",
    "moduleId": "M22",
    "protectedCapability": "Group insurance",
    "lucieTreatment": "No Lucie implementation; retain product and pathway module ID.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-015",
    "moduleId": "M23",
    "protectedCapability": "Carrier-led distribution",
    "lucieTreatment": "No carrier portal or publishing; preserve publisher/marketplace boundaries.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-016",
    "moduleId": "M25",
    "protectedCapability": "Service cases and resolution",
    "lucieTreatment": "Tasks and exceptions only; preserve future case object and workflow boundary.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  },
  {
    "seamId": "LUC-SEAM-017",
    "moduleId": "M24",
    "protectedCapability": "Advanced analytics and predictive AI",
    "lucieTreatment": "Canned dashboards and governed data only; preserve event/metric and AI governance foundations.",
    "rule": "Do not present as implemented; do not collapse the interface or data model."
  }
];
