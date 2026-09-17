/**
 * Phase 9 — pattern → experience edges.
 * DOCUMENTATION ONLY. Intentional differences between experiences are
 * preserved, not flattened into uniformity.
 */
import type { DependencyEdge, DependencyNode } from "./graph-types";

export const EXPERIENCE_NODES: DependencyNode[] = [
  {
    id: "exp.web",
    layer: "experience-pattern",
    name: "Web / Marketing",
    source: "public routes",
    ownership: "pattern",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Full-width header, 88rem centred container",
  },
  {
    id: "exp.shop",
    layer: "experience-pattern",
    name: "Shopping / Commerce",
    source: "MarketplaceShell routes",
    ownership: "pattern",
    status: "CURRENT IMPLEMENTATION",
    evidence: "30 files use the marketplace shell",
  },
  {
    id: "exp.dash",
    layer: "experience-pattern",
    name: "Dashboard / Admin",
    source: "InternalShell routes",
    ownership: "pattern",
    status: "CURRENT IMPLEMENTATION",
    evidence: "89 files use the internal shell",
  },
  {
    id: "exp.member",
    layer: "experience-pattern",
    name: "Member / Account",
    source: "MemberShell routes",
    ownership: "pattern",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Member routes",
  },
];

export const EXPERIENCE_EDGES: DependencyEdge[] = [
  {
    from: "pat.hero",
    to: "exp.web",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Landing hero",
    ownership: "Web",
    note: "Experience-specific. Larger display typography is intentional.",
  },
  {
    from: "pat.navigation",
    to: "exp.web",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Full-width header with product links",
    ownership: "Web",
  },
  {
    from: "pat.filter-results",
    to: "exp.shop",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "plans route",
    ownership: "Shopping",
  },
  {
    from: "pat.results-toolbar",
    to: "exp.shop",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Compact results header",
    ownership: "Shopping",
  },
  {
    from: "pat.cart-summary",
    to: "exp.shop",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "cart route",
    ownership: "Shopping",
  },
  {
    from: "pat.comparison",
    to: "exp.shop",
    relation: "extends",
    status: "OBSERVED VARIATION",
    evidence: "compare route builds its own markup",
    ownership: "Shopping",
  },
  {
    from: "pat.assistant",
    to: "exp.shop",
    relation: "extends",
    status: "OBSERVED DUPLICATE",
    evidence: "PlanAI alongside other assistant surfaces",
    ownership: "Shopping",
  },
  {
    from: "pat.table-screen",
    to: "exp.dash",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Agency and admin screens",
    ownership: "Dashboard",
  },
  {
    from: "pat.kpi-grid",
    to: "exp.dash",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "18 KpiCard files",
    ownership: "Dashboard",
  },
  {
    from: "pat.wizard",
    to: "exp.dash",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Downline wizard",
    ownership: "Dashboard",
  },
  {
    from: "pat.settings-section",
    to: "exp.member",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "member settings",
    ownership: "Member",
  },
  {
    from: "pat.form-layout",
    to: "exp.dash",
    relation: "extends",
    status: "OBSERVED DUPLICATE",
    evidence: "Governed module forms",
    ownership: "Dashboard and route-local",
  },
  {
    from: "pat.form-layout",
    to: "exp.member",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Settings forms",
    ownership: "Member",
  },
  {
    from: "pat.detail-page",
    to: "exp.dash",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Record screens",
    ownership: "Dashboard",
  },
  {
    from: "pat.detail-page",
    to: "exp.shop",
    relation: "extends",
    status: "CURRENT IMPLEMENTATION",
    evidence: "Plan detail",
    ownership: "Shopping",
  },
  {
    from: "pat.empty-loading-error",
    to: "exp.dash",
    relation: "extends",
    status: "UNOWNED AREA",
    evidence: "Loading and error composed per screen",
    ownership: "No single owner",
  },
  {
    from: "pat.empty-loading-error",
    to: "exp.shop",
    relation: "extends",
    status: "UNOWNED AREA",
    evidence: "Same composition per screen",
    ownership: "No single owner",
  },
  {
    from: "pat.canonical-data",
    to: "exp.dash",
    relation: "extends",
    status: "FUTURE CANONICAL TARGET",
    evidence: "Proposed only",
    ownership: "Undecided",
  },
];

export const SHARED_VERSUS_SPECIFIC: {
  pattern: string;
  sharedAcross: string;
  specificTo: string;
  boundary: string;
  status: DependencyEdge["status"];
}[] = [
  {
    pattern: "Page header",
    sharedAcross: "Dashboard, Shopping, Member",
    specificTo: "Compact form is shopping-only",
    boundary: "Title and action semantics stay identical; sizing may differ.",
    status: "OBSERVED VARIATION",
  },
  {
    pattern: "Filter and results",
    sharedAcross: "Shopping and Dashboard lists",
    specificTo: "Badge-styled chips are shopping-only",
    boundary: "Counts, persistence and reset behave the same way.",
    status: "OBSERVED VARIATION",
  },
  {
    pattern: "Empty state",
    sharedAcross: "All experiences",
    specificTo: "Route-local variants in governed modules",
    boundary: "One recovery action; wording stays plain.",
    status: "OBSERVED DUPLICATE",
  },
  {
    pattern: "Navigation",
    sharedAcross: "None — each shell owns its own",
    specificTo: "All three shells",
    boundary: "Landmarks and current-page semantics never differ.",
    status: "OBSERVED OVERLAP",
  },
  {
    pattern: "Hero",
    sharedAcross: "None",
    specificTo: "Web only",
    boundary: "Marketing scale must not leak into dashboards.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    pattern: "KPI grouping",
    sharedAcross: "None",
    specificTo: "Dashboard only",
    boundary: "Numeric type role is shared; layout is not.",
    status: "CURRENT IMPLEMENTATION",
  },
];
