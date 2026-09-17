/**
 * Phase 9 — compound → pattern edges.
 * DOCUMENTATION ONLY. Repeated markup alone does not make a pattern; a
 * pattern is a recurring arrangement that solves one screen problem.
 */
import type { DependencyEdge, DependencyNode } from "./graph-types";

export const PATTERN_NODES: DependencyNode[] = [
  { id: "pat.filter-results", layer: "pattern", name: "Filter and results layout", source: "src/routes/plans.tsx", ownership: "pattern", status: "CURRENT IMPLEMENTATION", evidence: "Left filters, compact header, results grid" },
  { id: "pat.results-toolbar", layer: "pattern", name: "Results toolbar", source: "src/routes/plans.tsx", ownership: "pattern", status: "CURRENT IMPLEMENTATION", evidence: "Compact header with count and sorting" },
  { id: "pat.detail-page", layer: "pattern", name: "Detail page layout", source: "plan detail and record screens", ownership: "pattern", status: "CURRENT IMPLEMENTATION", evidence: "Header, summary, sectioned content" },
  { id: "pat.comparison", layer: "pattern", name: "Comparison layout", source: "src/routes/compare.tsx", ownership: "local", status: "OBSERVED VARIATION", evidence: "Composed separately from the plan card" },
  { id: "pat.form-layout", layer: "pattern", name: "Form layout", source: "settings and governed module forms", ownership: "pattern", status: "OBSERVED DUPLICATE", evidence: "Several field systems produce it" },
  { id: "pat.settings-section", layer: "pattern", name: "Settings section", source: "src/routes/member.settings.tsx", ownership: "pattern", status: "CURRENT IMPLEMENTATION", evidence: "Preferences panel under the member header" },
  { id: "pat.kpi-grid", layer: "pattern", name: "KPI grouping", source: "dashboard screens", ownership: "pattern", status: "CURRENT IMPLEMENTATION", evidence: "KpiCard in 18 files" },
  { id: "pat.table-screen", layer: "pattern", name: "List and table screen", source: "agency and admin screens", ownership: "pattern", status: "OBSERVED DUPLICATE", evidence: "Two table systems plus route-local tables" },
  { id: "pat.empty-loading-error", layer: "pattern", name: "Empty, loading and error presentation", source: "EmptyState, Skeleton, route markup", ownership: "pattern", status: "UNOWNED AREA", evidence: "Empty is owned; loading and error are not" },
  { id: "pat.navigation", layer: "pattern", name: "Shell navigation", source: "three shells", ownership: "business", status: "OBSERVED OVERLAP", evidence: "Each shell implements it independently" },
  { id: "pat.cart-summary", layer: "pattern", name: "Cart and quote summary", source: "src/routes/cart.tsx", ownership: "pattern", status: "CURRENT IMPLEMENTATION", evidence: "Selected coverage, add-ons, total" },
  { id: "pat.hero", layer: "pattern", name: "Marketing hero", source: "src/routes/index.tsx", ownership: "local", status: "CURRENT IMPLEMENTATION", evidence: "Viewport-aware centred hero" },
  { id: "pat.assistant", layer: "pattern", name: "Assistant surface", source: "PlanAI, Lucie, ai-elements", ownership: "local", status: "OBSERVED DUPLICATE", evidence: "Several conversational surfaces" },
  { id: "pat.wizard", layer: "pattern", name: "Stepped wizard", source: "downline wizard", ownership: "business", status: "CURRENT IMPLEMENTATION", evidence: "Stepper plus step content" },
  { id: "pat.canonical-data", layer: "pattern", name: "Canonical data screen", source: "n/a", ownership: "none", status: "FUTURE CANONICAL TARGET", evidence: "Proposed: toolbar, filters, table, summary, pagination in one contract" },
];

export const PATTERN_EDGES: DependencyEdge[] = [
  { from: "cpd.filter-results", to: "pat.filter-results", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "plans route", ownership: "Route" },
  { from: "cpd.plan-card", to: "pat.filter-results", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Results grid renders plan cards", ownership: "ABox" },
  { from: "cpd.page-header", to: "pat.results-toolbar", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Compact header form", ownership: "ABox" },
  { from: "cpd.page-header", to: "pat.detail-page", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "25 files", ownership: "ABox" },
  { from: "cpd.card", to: "pat.detail-page", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Sectioned card content", ownership: "Primitive" },
  { from: "cpd.plan-card", to: "pat.comparison", relation: "composes", status: "OBSERVED VARIATION", evidence: "The compare route builds its own markup instead", ownership: "Route", note: "Recorded as a variation, not a defect." },
  { from: "cpd.field", to: "pat.form-layout", relation: "composes", status: "OBSERVED DUPLICATE", evidence: "Three field systems", ownership: "Primitive and route-local" },
  { from: "cpd.card", to: "pat.settings-section", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Preferences panel", ownership: "Primitive" },
  { from: "cmp.kpi-card", to: "pat.kpi-grid", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "18 files", ownership: "ABox" },
  { from: "cpd.table-full", to: "pat.table-screen", relation: "composes", status: "OBSERVED DUPLICATE", evidence: "DataTable 20 files, primitive table, route-local tables", ownership: "Mixed" },
  { from: "cpd.empty", to: "pat.empty-loading-error", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "EmptyState 10 files", ownership: "ABox" },
  { from: "cpd.loading", to: "pat.empty-loading-error", relation: "composes", status: "UNOWNED AREA", evidence: "No loading or error component owns this", ownership: "No single owner" },
  { from: "cmp.module-tabs", to: "pat.navigation", relation: "composes", status: "OBSERVED OVERLAP", evidence: "Module screens", ownership: "ABox" },
  { from: "cpd.card", to: "pat.cart-summary", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Cart summary and add-ons section", ownership: "Route" },
  { from: "cmp.action-pill", to: "pat.hero", relation: "composes", status: "CURRENT IMPLEMENTATION", evidence: "Hero calls to action at h-11", ownership: "ABox" },
  { from: "cpd.table-full", to: "pat.canonical-data", relation: "composes", status: "FUTURE CANONICAL TARGET", evidence: "Proposed only; nothing implements it", ownership: "Undecided" },
  { from: "cpd.split-action", to: "pat.canonical-data", relation: "composes", status: "FUTURE DECISION", evidence: "Not established", ownership: "Undecided" },
];
