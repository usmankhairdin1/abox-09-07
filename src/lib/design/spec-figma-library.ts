/**
 * Phase 8 — Figma library blueprint.
 *
 * BLUEPRINT ONLY. No Figma file, page, component, style or variable is
 * created by this phase.
 */
import type { SpecLabel } from "./component-spec-types";

export interface FigmaLibrarySection {
  page: string;
  contains: string;
  organisation: string;
  sourceOfTruth: string;
  label: SpecLabel;
}

export const FIGMA_LIBRARY_BLUEPRINT: FigmaLibrarySection[] = [
  {
    page: "00 Foundations",
    contains:
      "Colour, typography, spacing, radius, elevation, motion and icon documentation frames.",
    organisation: "One frame per foundation category, mirroring the Phase 7 modules.",
    sourceOfTruth: "The stylesheet. Figma mirrors it and never leads it.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    page: "01 Variables",
    contains: "Primitive and semantic collections, with modes for light, dark and tenant brand.",
    organisation: "Primitive collection is private; semantic collection is the one designers use.",
    sourceOfTruth: "Token naming from the Phase 7 naming rules.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    page: "02 Text styles",
    contains:
      "Named styles for display, page title, section title, component title, body, supporting, label, eyebrow, caption, metadata, serial, table, KPI and action.",
    organisation: "Style names match the semantic type roles, not raw sizes.",
    sourceOfTruth: "The typography foundation.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    page: "03 Effect styles",
    contains: "Card, overlay and focus effects.",
    organisation: "One style per elevation role.",
    sourceOfTruth: "The shadow tokens. Layered shadows may not translate exactly.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    page: "04 Icons",
    contains: "Only the glyphs the product actually uses.",
    organisation: "Flat set, consistent frame size, swapped through instance-swap properties.",
    sourceOfTruth: "The icon imports in code.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    page: "10 Core components",
    contains: "Actions, forms, display, containers, data, navigation, overlays, feedback.",
    organisation:
      "One component set per family, with variant properties for appearance, size and state.",
    sourceOfTruth: "The specification registry in this reference layer.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    page: "20 Patterns",
    contains:
      "Page header with actions, table with toolbar and pagination, form section, dialog, filter bar with results.",
    organisation: "Assembled from core components; never redrawn.",
    sourceOfTruth: "The composition rules.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    page: "30 Experience extensions",
    contains: "Commerce, dashboard and marketing components.",
    organisation: "Separate pages per experience, each declaring the core component it builds on.",
    sourceOfTruth: "The experience boundaries.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    page: "40 Brand",
    contains: "Marks, wordmark and clear-space rules.",
    organisation: "Tenant variation expressed through variable modes, not duplicated components.",
    sourceOfTruth: "Runtime branding stays the operational source of truth.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
];

export const FIGMA_LIMITS: string[] = [
  "Colour conversion is lossy: the stylesheet uses oklch, Figma variables do not, so values are approximations.",
  "Computed tone mixing has no Figma equivalent and would need precomputing before it can be represented.",
  "Layered shadows flatten; a single effect style cannot always reproduce the rendered result.",
  "Responsive behavior needs separate frames per breakpoint; it cannot be a component property.",
  "Behavioral properties, focus management and announcements are code-only and must not be faked with variants.",
  "Any figure in the library is a mirror of code, never the other way round.",
];
