/**
 * Controlled identifiers for the M08 screens delivered in Increment 1.
 *
 * Values are transcribed from the packet's Screen Register, Traceability
 * Register and User Flow Register. Where the source package defines no flow for
 * a screen, `flows` is empty and `flow_defined_by_source` is false — a flow
 * identifier is never invented.
 */

export interface M08ScreenMeta {
  id: string;
  key: string;
  name_key: string;
  route: string;
  audience: string[];
  permission: string;
  capability: string;
  /** FLOW-M08-* identifiers the package actually associates with the screen. */
  flows: string[];
  flow_defined_by_source: boolean;
  requirements: string[];
  acceptance_criteria: string[];
  /** Proposed prior-module deltas this surface depends on (all unapproved). */
  deltas: string[];
  impacts: string[];
  status: "APPROVED_BASELINE";
}

export const M08_SCREENS: M08ScreenMeta[] = [
  {
    id: "SCR-M08-001",
    key: "overview",
    name_key: "screen.001",
    route: "/people/{personId}/selling-setup",
    audience: ["AGENT", "AGENCY_ADMIN"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-018",
    flows: ["FLOW-M08-001"],
    flow_defined_by_source: true,
    requirements: [
      "REQ-M08-013", "REQ-M08-105", "REQ-M08-107", "REQ-M08-114", "REQ-M08-115",
      "REQ-M08-254", "REQ-M08-261", "REQ-M08-262", "REQ-M08-263", "REQ-M08-264",
      "REQ-M08-265", "REQ-M08-266", "REQ-M08-267", "REQ-M08-268", "REQ-M08-271",
      "REQ-M08-272", "REQ-M08-297",
    ],
    acceptance_criteria: ["AC-M08-013-01", "AC-M08-013-02", "AC-M08-105-01", "AC-M08-261-01"],
    deltas: ["DELTA-M08-M06-001", "DELTA-M08-M06-002", "DELTA-M08-M00-003"],
    impacts: ["IMP-M08-M06", "IMP-M08-M00"],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-002",
    key: "where-i-can-sell",
    name_key: "screen.002",
    route: "/people/{personId}/selling-setup/where-i-can-sell",
    audience: ["AGENT", "AGENCY_ADMIN"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-020",
    flows: [],
    flow_defined_by_source: false,
    requirements: ["REQ-M08-074", "REQ-M08-090", "REQ-M08-108", "REQ-M08-109", "REQ-M08-110", "REQ-M08-134"],
    acceptance_criteria: ["AC-M08-074-01", "AC-M08-090-01", "AC-M08-108-01"],
    deltas: ["DELTA-M08-M06-003"],
    impacts: ["IMP-M08-M06"],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-003",
    key: "blockers",
    name_key: "screen.003",
    route: "/people/{personId}/selling-setup/blockers",
    audience: ["AGENT", "AGENCY_ADMIN"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-021",
    flows: ["FLOW-M08-006"],
    flow_defined_by_source: true,
    requirements: [
      "REQ-M08-010", "REQ-M08-042", "REQ-M08-059", "REQ-M08-086", "REQ-M08-087",
      "REQ-M08-164", "REQ-M08-165", "REQ-M08-166", "REQ-M08-167", "REQ-M08-259", "REQ-M08-270",
    ],
    acceptance_criteria: ["AC-M08-010-01", "AC-M08-086-01", "AC-M08-164-01"],
    deltas: ["DELTA-M08-M06-004"],
    impacts: ["IMP-M08-M06"],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-004",
    key: "licenses",
    name_key: "screen.004",
    route: "/people/{personId}/selling-setup/licenses/{licenseId}",
    audience: ["AGENT", "AGENCY_ADMIN", "JET_COMPLIANCE"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-004",
    flows: ["FLOW-M08-008"],
    flow_defined_by_source: true,
    requirements: ["REQ-M08-017", "REQ-M08-029", "REQ-M08-030", "REQ-M08-031", "REQ-M08-034", "REQ-M08-035"],
    acceptance_criteria: ["AC-M08-017-01", "AC-M08-029-01", "AC-M08-034-01"],
    deltas: [],
    impacts: [],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-005",
    key: "appointments",
    name_key: "screen.005",
    route: "/people/{personId}/selling-setup/appointments/{appointmentId}",
    audience: ["AGENT", "AGENCY_ADMIN", "JET_COMPLIANCE"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-005",
    flows: ["FLOW-M08-009"],
    flow_defined_by_source: true,
    requirements: ["REQ-M08-019", "REQ-M08-051", "REQ-M08-052", "REQ-M08-053", "REQ-M08-054"],
    acceptance_criteria: ["AC-M08-019-01", "AC-M08-051-01", "AC-M08-053-01"],
    deltas: [],
    impacts: [],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-006",
    key: "product-authority",
    name_key: "screen.006",
    route: "/people/{personId}/selling-setup/product-authority/{grantId}",
    audience: ["AGENCY_ADMIN", "JET_COMPLIANCE"],
    permission: "m08.authority.read",
    capability: "CAP-M08-006",
    flows: ["FLOW-M08-010"],
    flow_defined_by_source: true,
    requirements: ["REQ-M08-005", "REQ-M08-016", "REQ-M08-043", "REQ-M08-046", "REQ-M08-049", "REQ-M08-050", "REQ-M08-056"],
    acceptance_criteria: ["AC-M08-005-01", "AC-M08-046-01", "AC-M08-050-01"],
    deltas: [],
    impacts: [],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-007",
    key: "eo",
    name_key: "screen.007",
    route: "/people/{personId}/selling-setup/eo",
    audience: ["AGENT", "AGENCY_ADMIN"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-013",
    flows: ["FLOW-M08-013"],
    flow_defined_by_source: true,
    requirements: ["REQ-M08-064", "REQ-M08-065", "REQ-M08-066", "REQ-M08-067"],
    acceptance_criteria: ["AC-M08-064-01", "AC-M08-066-01"],
    deltas: [],
    impacts: [],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-008",
    key: "training",
    name_key: "screen.008",
    route: "/people/{personId}/selling-setup/training",
    audience: ["AGENT", "AGENCY_ADMIN"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-015",
    flows: ["FLOW-M08-014"],
    flow_defined_by_source: true,
    requirements: ["REQ-M08-068", "REQ-M08-069"],
    acceptance_criteria: ["AC-M08-068-01", "AC-M08-069-01"],
    deltas: [],
    impacts: [],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-009",
    key: "documents",
    name_key: "screen.009",
    route: "/people/{personId}/selling-setup/documents",
    audience: ["AGENT", "AGENCY_ADMIN"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-017",
    flows: ["FLOW-M08-001"],
    flow_defined_by_source: true,
    requirements: ["REQ-M08-033", "REQ-M08-070", "REQ-M08-152", "REQ-M08-253"],
    acceptance_criteria: ["AC-M08-070-01", "AC-M08-152-01"],
    deltas: [],
    impacts: ["IMP-M08-M13"],
    status: "APPROVED_BASELINE",
  },
  {
    id: "SCR-M08-010",
    key: "npn",
    name_key: "screen.010",
    route: "/people/{personId}/selling-setup/npn",
    audience: ["AGENT", "AGENCY_ADMIN"],
    permission: "m08.credential.read.agency",
    capability: "CAP-M08-003",
    flows: [],
    flow_defined_by_source: false,
    requirements: [
      "REQ-M08-018", "REQ-M08-023", "REQ-M08-024", "REQ-M08-025", "REQ-M08-026",
      "REQ-M08-027", "REQ-M08-028", "REQ-M08-044", "REQ-M08-237",
    ],
    acceptance_criteria: ["AC-M08-018-01", "AC-M08-024-01", "AC-M08-027-01"],
    deltas: ["DELTA-M08-M00-003"],
    impacts: ["IMP-M08-M00"],
    status: "APPROVED_BASELINE",
  },
];

export function m08Screen(key: string) {
  return M08_SCREENS.find((s) => s.key === key);
}
