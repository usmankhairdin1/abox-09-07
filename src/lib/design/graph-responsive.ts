/**
 * Phase 9 — responsive behavior traced through the layers.
 * DOCUMENTATION ONLY. No breakpoint is introduced and no existing responsive
 * behavior is changed. Evidence comes from the Phase 2 and Phase 7 records.
 */
import type { GraphLayer, SpecLabel } from "./graph-types";

export interface ResponsiveOwnership {
  layer: GraphLayer | "runtime";
  belongsHere: string;
  doesNotBelongHere: string;
  currentEvidence: string;
  status: SpecLabel;
}

export const RESPONSIVE_OWNERSHIP: ResponsiveOwnership[] = [
  {
    layer: "foundation",
    belongsHere: "Breakpoint values and the container width options.",
    doesNotBelongHere: "Decisions about what any particular screen does at a breakpoint.",
    currentEvidence: "Tailwind breakpoints as used; 88rem container on web-experience routes.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "semantic-role",
    belongsHere: "Whether a role has a responsive expression at all, such as container width.",
    doesNotBelongHere: "Per-component stacking.",
    currentEvidence: "Container role differs between web routes and shells.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "component-role",
    belongsHere: "Nothing. Roles are viewport-independent.",
    doesNotBelongHere: "Any breakpoint logic.",
    currentEvidence: "No role carries a breakpoint today.",
    status: "GOVERNANCE RULE",
  },
  {
    layer: "core-component",
    belongsHere:
      "Only behavior intrinsic to the component, such as an overlay becoming full width on small viewports.",
    doesNotBelongHere: "Layout decisions that belong to the consumer.",
    currentEvidence:
      "Button has no internal breakpoints; Dialog and Sheet adapt to small viewports.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "compound",
    belongsHere:
      "How its parts reflow: field stacking, card header wrapping, table horizontal scroll.",
    doesNotBelongHere: "Page-level column changes.",
    currentEvidence: "Tables scroll horizontally on narrow viewports.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "pattern",
    belongsHere: "Column counts, sidebar collapse, filter placement, grid gaps.",
    doesNotBelongHere: "Component internals.",
    currentEvidence: "Plan results collapse to a single column; filters move above results.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "experience-pattern",
    belongsHere: "Shell navigation collapse and header behavior.",
    doesNotBelongHere: "Anything a screen should decide for itself.",
    currentEvidence: "Each shell collapses navigation at its own breakpoint.",
    status: "OBSERVED VARIATION",
  },
  {
    layer: "screen",
    belongsHere:
      "Only genuinely screen-specific arrangements, such as the viewport-aware hero height.",
    doesNotBelongHere: "Re-implementing a pattern's responsive rules.",
    currentEvidence: "Landing hero uses a viewport-aware minimum height with centred content.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "runtime",
    belongsHere: "Nothing. Brand configuration and assets carry no responsive behavior.",
    doesNotBelongHere: "Everything responsive.",
    currentEvidence: "Runtime features supply values, not layout.",
    status: "GOVERNANCE RULE",
  },
];

export const RESPONSIVE_TRACES: { chain: string; behavior: string; status: SpecLabel }[] = [
  {
    chain: "Container role → marketplace shell → plans screen",
    behavior:
      "Header runs full width; content is constrained to 88rem and collapses to a single column.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    chain: "Table compound → list pattern → agency screen",
    behavior: "Horizontal scroll rather than column dropping, so no data is hidden.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    chain: "Overlay component → dialog pattern → dashboard workflow",
    behavior: "Modal surfaces become full width on small viewports; drawers anchor to an edge.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    chain: "Field compound → form pattern → settings screen",
    behavior: "Inline field layouts stack; label association is unaffected.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    chain: "Shell navigation → each experience",
    behavior: "Three shells collapse navigation independently at their own breakpoints.",
    status: "OBSERVED VARIATION",
  },
  {
    chain: "Control height role → touch viewports",
    behavior: "Dense 32px controls stay 32px on touch.",
    status: "FUTURE OPPORTUNITY",
  },
  {
    chain: "Density role → data components",
    behavior: "Not established: density is not a property, so it cannot respond to viewport.",
    status: "FUTURE DECISION",
  },
];
