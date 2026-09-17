/**
 * Phase 10 — Figma blueprint for the pattern layer.
 * DOCUMENTATION ONLY. Nothing exists in Figma. No file, component, variant or
 * asset has been created. Every row below is a proposal for a future library.
 */
import type { PatternFigmaMapping } from "./pattern-spec-types";

export const PATTERN_FIGMA_MAPPINGS: PatternFigmaMapping[] = [
  {
    patternId: "pat.page-header",
    figmaStructure: "Component set 'Pattern / Page header' with two variants.",
    variantProperties: ["Variant: Default | Compact"],
    stateProperties: [],
    responsiveVariants: "Breakpoint: Mobile | Desktop, matching the md type step.",
    densityVariants: "Carried by the Variant property rather than a separate axis.",
    contentModel: "Eyebrow, Title, Description, Icon, Actions as component properties.",
    componentProperties: [
      "Eyebrow (text, optional)",
      "Title (text)",
      "Description (text, optional)",
      "Icon (instance swap, optional)",
      "Actions (instance swap, optional)",
      "Show hairline (boolean)",
    ],
    status: "FUTURE OPPORTUNITY",
  },
  {
    patternId: "pat.filter-results",
    figmaStructure:
      "Pattern frame combining a filter rail component, the compact header and a results list.",
    variantProperties: ["Layout: Rail | Dialog"],
    stateProperties: ["State: Default | Empty"],
    responsiveVariants: "Rail above lg, Dialog below lg.",
    densityVariants: "None observed.",
    contentModel: "Filter groups, result count, sort value, result rows.",
    componentProperties: ["Result count (text)", "Sort (text)", "Filters (instance swap)"],
    status: "FUTURE OPPORTUNITY",
  },
  {
    patternId: "pat.kpi-grid",
    figmaStructure: "Component 'Pattern / Metric card' plus a grid frame.",
    variantProperties: ["Tone: Default | Primary | Sage | Warning"],
    stateProperties: ["State: Default | Hover"],
    responsiveVariants: "Grid column count only.",
    densityVariants: "Single density at p-6.",
    contentModel: "Label, value, delta, hint, icon.",
    componentProperties: [
      "Label (text)",
      "Value (text)",
      "Delta (text, optional)",
      "Hint (text, optional)",
      "Icon (instance swap, optional)",
    ],
    status: "FUTURE OPPORTUNITY",
  },
  {
    patternId: "pat.table-screen",
    figmaStructure: "Component set 'Pattern / Table' with a row sub-component.",
    variantProperties: ["Source: DataTable | Primitive | Route-local"],
    stateProperties: ["State: Default | Empty | Loading"],
    responsiveVariants: "Overflow: Fits | Scrolls, since the table never restructures.",
    densityVariants: "Standard only; route-local densities are recorded as variations, not axes.",
    contentModel: "Column headers, rows, empty message.",
    componentProperties: ["Columns (text)", "Rows (nested instances)", "Empty message (text)"],
    status: "FUTURE DECISION",
  },
  {
    patternId: "pat.cart-summary",
    figmaStructure: "Pattern frame with a coverage list and a summary card.",
    variantProperties: ["Add-ons: Present | Absent"],
    stateProperties: ["State: Default | Empty | Replacement warning"],
    responsiveVariants: "Breakpoint: Stacked | Split at lg.",
    densityVariants: "None observed.",
    contentModel: "Coverage rows, add-ons, total, continue action.",
    componentProperties: ["Total (text)", "Coverage rows (nested instances)"],
    status: "FUTURE OPPORTUNITY",
  },
  {
    patternId: "pat.hero",
    figmaStructure: "Pattern frame 'Experience / Web / Hero'.",
    variantProperties: [],
    stateProperties: [],
    responsiveVariants: "Breakpoint: Mobile | Tablet | Desktop, tracking the four headline steps.",
    densityVariants: "Hero action pills sit at their own height and are recorded as a variation.",
    contentModel: "Headline, paragraph, entry pills, illustrative panel.",
    componentProperties: ["Headline (text)", "Paragraph (text)", "Pills (nested instances)"],
    status: "FUTURE OPPORTUNITY",
  },
  {
    patternId: "pat.status-tier",
    figmaStructure: "Component set 'Pattern / Badge' bound to the tone and tier variables.",
    variantProperties: ["Kind: Status | Metal tier", "Tone or tier value"],
    stateProperties: ["State: Static | Selected"],
    responsiveVariants: "None.",
    densityVariants: "None.",
    contentModel: "Label only.",
    componentProperties: ["Label (text)"],
    status: "FUTURE OPPORTUNITY",
  },
  {
    patternId: "pat.navigation",
    figmaStructure:
      "Three separate pattern frames, one per shell, because the code shares no navigation implementation.",
    variantProperties: ["Shell: Internal | Marketplace | Member"],
    stateProperties: ["State: Expanded | Collapsed"],
    responsiveVariants:
      "Each shell collapses at its own breakpoint; the blueprint keeps them separate.",
    densityVariants: "Three observed densities, kept apart.",
    contentModel: "Brand, destinations, account, context actions.",
    componentProperties: ["Destinations (nested instances)", "Account name (text)"],
    status: "FUTURE DECISION",
  },
  {
    patternId: "pat.empty-loading-error",
    figmaStructure:
      "Component 'Pattern / Empty state' only. Loading and error have no production owner to model.",
    variantProperties: [],
    stateProperties: ["State: Empty"],
    responsiveVariants: "None.",
    densityVariants: "None.",
    contentModel: "Icon, title, body, action.",
    componentProperties: [
      "Title (text)",
      "Body (text, optional)",
      "Action (instance swap, optional)",
    ],
    status: "UNOWNED AREA",
  },
];

export const FIGMA_PATTERN_RULES: string[] = [
  "FUTURE OPPORTUNITY — nothing in this blueprint exists. No Figma file, component, variant, style or asset has been created.",
  "GOVERNANCE RULE — a pattern is only modelled in Figma once its anatomy, states and responsive behaviour are recorded from code.",
  "GOVERNANCE RULE — a duplicate is modelled as separate components until someone approves a single one; the library never silently picks one.",
  "GOVERNANCE RULE — an unowned pattern is not modelled as if it had an owner.",
  "GOVERNANCE RULE — brand and marketplace artwork stay runtime values; the library models the slot, never the tenant's content.",
];
