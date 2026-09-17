/**
 * Phase 9 — component → compound component edges.
 * DOCUMENTATION ONLY. Only compositions supported by Phase 8 evidence appear
 * here. Anything unsupported is recorded as FUTURE DECISION.
 */
import type { DependencyEdge, DependencyNode } from "./graph-types";

export const COMPOUND_NODES: DependencyNode[] = [
  { id: "cpd.field", layer: "compound", name: "Field (label + control + helper/error)", source: "src/components/ui/form.tsx", ownership: "primitive", status: "OBSERVED DUPLICATE", evidence: "Three field systems ship" },
  { id: "cpd.card", layer: "compound", name: "Card (header + body + footer)", source: "src/components/ui/card.tsx", ownership: "primitive", status: "CURRENT IMPLEMENTATION", evidence: "Card sub-components" },
  { id: "cpd.dialog", layer: "compound", name: "Dialog (trigger + overlay + header + body + footer)", source: "src/components/ui/dialog.tsx", ownership: "primitive", status: "CURRENT IMPLEMENTATION", evidence: "Radix parts" },
  { id: "cpd.table", layer: "compound", name: "Table (header + body + row + cell)", source: "src/components/ui/table.tsx, data-table.tsx", ownership: "business", status: "OBSERVED DUPLICATE", evidence: "Two table systems plus route-local tables" },
  { id: "cpd.table-full", layer: "compound", name: "Table with toolbar and pagination", source: "route composition", ownership: "pattern", status: "UNOWNED AREA", evidence: "Toolbar and pagination are assembled per screen" },
  { id: "cpd.page-header", layer: "compound", name: "PageHeader (title + supporting + actions)", source: "src/components/abox/page-header.tsx", ownership: "business", status: "CURRENT IMPLEMENTATION", evidence: "25 files" },
  { id: "cpd.filter-results", layer: "compound", name: "Filter controls + results summary", source: "src/routes/plans.tsx", ownership: "pattern", status: "UNOWNED AREA", evidence: "Composed in the route" },
  { id: "cpd.plan-card", layer: "compound", name: "PlanCard (tier + price + detail + actions)", source: "src/components/abox/plan-card.tsx", ownership: "business", status: "CURRENT IMPLEMENTATION", evidence: "6 files" },
  { id: "cpd.empty", layer: "compound", name: "Empty state (icon + title + description + action)", source: "src/components/abox/empty-state.tsx", ownership: "business", status: "OBSERVED DUPLICATE", evidence: "10 files plus route-local variants" },
  { id: "cpd.loading", layer: "compound", name: "Loading presentation", source: "skeleton.tsx, spinner.tsx", ownership: "pattern", status: "UNOWNED AREA", evidence: "Composed per screen" },
  { id: "cpd.split-action", layer: "compound", name: "Action with attached menu", source: "n/a", ownership: "none", status: "FUTURE DECISION", evidence: "Not established: no such composition exists" },
];

export const COMPOUND_EDGES: DependencyEdge[] = [
  { from: "cmp.label", to: "cpd.field", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "form.tsx composes Label with the control", ownership: "Primitive" },
  { from: "cmp.input", to: "cpd.field", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "FormControl wraps the input", ownership: "Primitive" },
  { from: "cmp.select", to: "cpd.field", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Used inside fields", ownership: "Primitive" },
  { from: "cmp.form", to: "cpd.field", relation: "composes", status: "OBSERVED DUPLICATE", evidence: "form.tsx is one of three field systems", ownership: "Primitive and route-local" },
  { from: "cmp.card", to: "cpd.card", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "CardHeader, CardContent, CardFooter", ownership: "Primitive" },
  { from: "cmp.button", to: "cpd.card", relation: "composes", status: "OBSERVED VARIATION", evidence: "Card actions appear in header and footer depending on the screen", ownership: "Consumer" },
  { from: "cmp.dialog", to: "cpd.dialog", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Radix dialog parts", ownership: "Primitive" },
  { from: "cmp.button", to: "cpd.dialog", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Dialog footers hold actions", ownership: "Primitive" },
  { from: "cmp.table", to: "cpd.table", relation: "composes", status: "OBSERVED DUPLICATE", evidence: "Primitive table parts", ownership: "Primitive" },
  { from: "cmp.data-table", to: "cpd.table", relation: "composes", status: "OBSERVED DUPLICATE", evidence: "20 files", ownership: "ABox" },
  { from: "cmp.status-badge", to: "cpd.table", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Status columns across dashboard tables", ownership: "ABox" },
  { from: "cpd.table", to: "cpd.table-full", relation: "composes", status: "UNOWNED AREA", evidence: "Toolbar and pagination are not owned by either table system", ownership: "No single owner" },
  { from: "cmp.empty-state", to: "cpd.table", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "DataTable renders an empty state", ownership: "ABox" },
  { from: "cmp.page-header", to: "cpd.page-header", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Title, description and actions", ownership: "ABox" },
  { from: "cmp.action-pill", to: "cpd.page-header", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Header actions in marketplace screens", ownership: "ABox" },
  { from: "cmp.metal-badge", to: "cpd.plan-card", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Tier indicator on both card forms", ownership: "ABox" },
  { from: "cmp.status-badge", to: "cpd.plan-card", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Exchange status on both card forms", ownership: "ABox" },
  { from: "cmp.carrier-mark", to: "cpd.plan-card", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Carrier monogram in listings", ownership: "ABox", note: "Deliberately absent from carrier filters." },
  { from: "cmp.plan-card", to: "cpd.plan-card", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "plan-card.tsx", ownership: "ABox" },
  { from: "cmp.metal-badge", to: "cpd.filter-results", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Filter chips reuse the listing badge treatments", ownership: "Route" },
  { from: "cmp.skeleton", to: "cpd.loading", relation: "composes", status: "UNOWNED AREA", evidence: "Skeleton shapes are chosen per screen", ownership: "No single owner" },
  { from: "cmp.empty-state", to: "cpd.empty", relation: "composes", status: "OBSERVED DUPLICATE", evidence: "Route-local empty blocks exist beside it", ownership: "ABox and route-local" },
  { from: "cmp.button", to: "cpd.split-action", relation: "composes", status: "FUTURE DECISION", evidence: "Not established: no attached-menu action exists in the codebase", ownership: "Undecided" },
];
