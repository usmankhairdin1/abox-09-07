/**
 * Phase 8 — per-component Figma property mapping.
 * BLUEPRINT ONLY. Nothing is created in Figma.
 */
import type { SpecLabel } from "./component-spec-types";

export interface FigmaComponentMapping {
  component: string;
  componentProperties: string;
  variantProperties: string;
  booleanProperties: string;
  instanceSwap: string;
  textProperties: string;
  variablesAndModes: string;
  codeOnly: string;
  label: SpecLabel;
}

export const FIGMA_COMPONENT_MAPPINGS: FigmaComponentMapping[] = [
  {
    component: "Action family (Button, ActionPill, IconButton)",
    componentProperties: "Appearance, Size, State",
    variantProperties:
      "Appearance: solid / outline / ghost / link / pill; Size: 32 / 36 / 40 / 44; State: default / hover / focus / disabled / loading",
    booleanProperties: "Icon leading, Icon trailing, Label visible",
    instanceSwap: "Leading icon, trailing icon",
    textProperties: "Label",
    variablesAndModes: "Action surface and foreground roles; brand mode switches tenant colour",
    codeOnly: "onClick, asChild, routing, double-submit protection",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    component: "FormField with controls",
    componentProperties: "Control type, State, Required",
    variantProperties: "State: default / focus / error / disabled",
    booleanProperties: "Helper visible, Error visible, Required",
    instanceSwap: "Control instance, affix icons",
    textProperties: "Label, Helper, Error, Placeholder",
    variablesAndModes: "Input, border, destructive and muted foreground roles",
    codeOnly: "Validation, association wiring, masking",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    component: "StatusBadge and tone family",
    componentProperties: "Tone",
    variantProperties: "Tone: success / warning / danger / info / neutral",
    booleanProperties: "Indicator visible",
    instanceSwap: "Tone glyph",
    textProperties: "Label",
    variablesAndModes: "Status tone roles; dark mode as a variable mode",
    codeOnly: "Derivation of tone from record state",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    component: "Card",
    componentProperties: "Regions, Density",
    variantProperties: "Regions: header / body / footer combinations",
    booleanProperties: "Header visible, Footer visible, Media visible",
    instanceSwap: "Media, actions",
    textProperties: "Title, Description",
    variablesAndModes: "Card surface, hairline, radius and elevation",
    codeOnly: "Interactive card behavior",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    component: "Table family",
    componentProperties: "Density, Column count, State",
    variantProperties: "Density: dense / comfortable; State: default / loading / empty / error",
    booleanProperties: "Toolbar visible, Pagination visible, Selection column",
    instanceSwap: "Toolbar, pagination, empty state",
    textProperties: "Column headers",
    variablesAndModes: "Table surface, hairline and cell padding variables",
    codeOnly: "Sorting, virtualisation, data binding",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    component: "PageHeader",
    componentProperties: "Form, Actions",
    variantProperties: "Form: standard / compact",
    booleanProperties: "Description visible, Actions visible",
    instanceSwap: "Action slot",
    textProperties: "Title, Description",
    variablesAndModes: "Heading type styles and spacing variables",
    codeOnly: "Route awareness",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    component: "Overlay family",
    componentProperties: "Placement, Size",
    variantProperties: "Placement: centre / right / bottom; Size: sm / md / lg",
    booleanProperties: "Footer visible, Close visible",
    instanceSwap: "Body content, footer actions",
    textProperties: "Title, Description",
    variablesAndModes: "Overlay surface and scrim",
    codeOnly: "Focus trap, Escape handling, focus restoration",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    component: "PlanCard",
    componentProperties: "Form, Tier, Exchange, Selected",
    variantProperties: "Form: tile / detail; Tier: metal tiers; Exchange: on / off",
    booleanProperties: "Carrier mark visible, Best match visible",
    instanceSwap: "Carrier mark, action",
    textProperties: "Plan name, carrier, plan identifier, premium",
    variablesAndModes: "Tier tokens with contrast-chosen foreground",
    codeOnly: "Ranking, filtering, cart behavior",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    component: "Shells",
    componentProperties: "Not a component",
    variantProperties: "n/a",
    booleanProperties: "n/a",
    instanceSwap: "n/a",
    textProperties: "n/a",
    variablesAndModes: "Container width and header height variables",
    codeOnly: "Routing, session, navigation state",
    label: "FUTURE FIGMA ORGANIZATION",
  },
];

export const FIGMA_MAPPING_RULES: string[] = [
  "GOVERNANCE RULE — a concept maps to Figma only when a designer needs to manipulate it. Everything else stays code-only.",
  "GOVERNANCE RULE — never fake behavior with variants; a fake state in a mockup becomes a bug in a build.",
  "GOVERNANCE RULE — variant property values use the same words as the code specification.",
  "FUTURE DECISION — whether size variants are named by intent or by pixel height is unresolved, because two ladders exist in code.",
];
