/**
 * Phase 9 — the dependency chain expressed against the Figma blueprint.
 * BLUEPRINT ONLY. No Figma file, page, component, style or variable exists or
 * is created by this phase.
 */
import type { GraphLayer, SpecLabel } from "./graph-types";

export interface FigmaTrace {
  layer: GraphLayer;
  codeSide: string;
  figmaSide: string;
  translationLoss: string;
  status: SpecLabel;
}

export const FIGMA_TRACES: FigmaTrace[] = [
  {
    layer: "foundation",
    codeSide: "Tokens in the stylesheet, read at runtime.",
    figmaSide:
      "Variable collections with light, dark and tenant modes, plus text and effect styles.",
    translationLoss: "Colour conversion is lossy; layered shadows flatten.",
    status: "FUTURE FIGMA ORGANIZATION",
  },
  {
    layer: "semantic-role",
    codeSide: "Roles consumed by components.",
    figmaSide: "The semantic variable collection designers actually use; primitives stay private.",
    translationLoss: "Computed tone mixing has no equivalent and would need precomputing.",
    status: "FUTURE FIGMA ORGANIZATION",
  },
  {
    layer: "component-role",
    codeSide: "Named slots inside a component that read a role.",
    figmaSide: "Variable bindings on layers inside a component.",
    translationLoss: "A slot with conditional logic cannot be bound declaratively.",
    status: "FUTURE FIGMA ORGANIZATION",
  },
  {
    layer: "core-component",
    codeSide: "The component and its props.",
    figmaSide: "A component set per family with Appearance, Size and State variants.",
    translationLoss: "Behavioral props have no representation and must not be faked.",
    status: "FUTURE FIGMA ORGANIZATION",
  },
  {
    layer: "compound",
    codeSide: "A fixed composition such as a field or a dialog.",
    figmaSide: "A component assembled from core instances, with slot instance-swaps.",
    translationLoss: "Conditional parts become boolean properties, which flattens the logic.",
    status: "FUTURE FIGMA ORGANIZATION",
  },
  {
    layer: "pattern",
    codeSide: "A recurring arrangement composed in a route.",
    figmaSide: "A section pattern on the patterns page, assembled from components, never redrawn.",
    translationLoss: "Data-driven arrangement is represented by a fixed example.",
    status: "FUTURE FIGMA ORGANIZATION",
  },
  {
    layer: "experience-pattern",
    codeSide: "Experience extensions and shells.",
    figmaSide:
      "Separate library pages per experience, each declaring the core component it builds on.",
    translationLoss: "Shell behavior such as routing and session state is code-only.",
    status: "FUTURE FIGMA ORGANIZATION",
  },
  {
    layer: "screen",
    codeSide: "A real route with live data.",
    figmaSide: "Frames per breakpoint composed from patterns.",
    translationLoss: "Responsive behavior needs separate frames; it cannot be a property.",
    status: "FUTURE FIGMA ORGANIZATION",
  },
];

export const FIGMA_GRAPH_RULES: string[] = [
  "FUTURE FIGMA ORGANIZATION — every mapping here is a proposal. Nothing exists in Figma.",
  "GOVERNANCE RULE — the product is the original and the design file would be the mirror, never the other way round.",
  "GOVERNANCE RULE — where a concept cannot be represented honestly, it stays code-only rather than being approximated with a variant.",
  "FUTURE DECISION — size variant naming is unresolved in code, so it cannot be settled in a design file either.",
];
