/**
 * Phase 9 — typography traced through the layers.
 * DOCUMENTATION ONLY. References the Phase 3 and Phase 7 typography records
 * rather than restating the scale. Nothing is normalized.
 */
import type { SpecLabel } from "./graph-types";

export interface TypeTrace {
  role: string;
  foundation: string;
  component: string;
  pattern: string;
  screen: string;
  variation: string;
  status: SpecLabel;
}

export const TYPOGRAPHY_TRACES: TypeTrace[] = [
  {
    role: "Display",
    foundation: "Largest heading role in the stylesheet",
    component: "Route markup; no component owns it",
    pattern: "Marketing hero",
    screen: "Landing",
    variation: "Heading sizes were reduced across pages; the hero keeps the largest role.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    role: "Page title",
    foundation: "Heading roles",
    component: "PageHeader",
    pattern: "Detail page, results toolbar",
    screen: "25 files use PageHeader",
    variation: "The compact results header uses a larger title than its compact form implies.",
    status: "OBSERVED VARIATION",
  },
  {
    role: "Section title",
    foundation: "Heading roles",
    component: "CardTitle, route section headings",
    pattern: "Settings section, detail page",
    screen: "Member settings, record screens",
    variation: "Section heading sizes differ between experiences.",
    status: "OBSERVED VARIATION",
  },
  {
    role: "Body",
    foundation: "text-sm — 779 uses",
    component: "Nearly every component",
    pattern: "All patterns",
    screen: "All screens",
    variation: "text-sm dominates to the point of being the de facto base size.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    role: "Supporting",
    foundation: "Muted foreground with the smaller sizes",
    component: "CardDescription, FormDescription, PageHeader description",
    pattern: "Detail page, form layout",
    screen: "All experiences",
    variation: "Helper text sizing differs between internal and marketplace screens.",
    status: "OBSERVED VARIATION",
  },
  {
    role: "Label",
    foundation: "font-medium — 406 uses",
    component: "Label, FormLabel, action labels",
    pattern: "Form layout, toolbars",
    screen: "Forms across all experiences",
    variation: "Three field systems render labels their own way.",
    status: "OBSERVED DUPLICATE",
  },
  {
    role: "Eyebrow",
    foundation: "Uppercase tracking values",
    component: "Section eyebrows, KPI labels",
    pattern: "KPI grouping, sections",
    screen: "Dashboards",
    variation: "Five uppercase tracking values observed.",
    status: "OBSERVED VARIATION",
  },
  {
    role: "Serial / metadata",
    foundation: "Smallest size with muted foreground",
    component: "Identifiers and source references",
    pattern: "Data rows, plan cards",
    screen: "Plans, dashboards",
    variation: "Plan identifiers appear on both plan card forms.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    role: "Table",
    foundation: "text-sm with medium headers",
    component: "Table, DataTable",
    pattern: "List and table screen",
    screen: "Agency and admin screens",
    variation: "Two table systems set their own cell type.",
    status: "OBSERVED DUPLICATE",
  },
  {
    role: "KPI numeric",
    foundation: "Large numeric type",
    component: "KpiCard",
    pattern: "KPI grouping",
    screen: "Dashboards",
    variation: "Tabular figures are not applied consistently where columns align.",
    status: "OBSERVED VARIATION",
  },
  {
    role: "Action",
    foundation: "text-sm font-medium",
    component: "Button, ACTION_PILL",
    pattern: "Every pattern with an action",
    screen: "All screens",
    variation: "Both action paths use the same type, which is why they read alike.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    role: "Story link",
    foundation: "Not established",
    component: ".story-link used 89 times",
    pattern: "Inline links",
    screen: "Several",
    variation: "The class is used but no definition was found in the stylesheet.",
    status: "UNOWNED AREA",
  },
  {
    role: "Mono",
    foundation: "JetBrains Mono alias",
    component: "None",
    pattern: "None",
    screen: "None",
    variation: "Declared but unused.",
    status: "INSTALLED BUT UNUSED",
  },
];
