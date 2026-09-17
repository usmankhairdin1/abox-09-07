/**
 * Phase 9 — spacing traced through the layers.
 * DOCUMENTATION ONLY. References the Phase 2 and Phase 7 spacing records.
 * Contextual variation is preserved, never normalized.
 */
import type { SpecLabel } from "./graph-types";

export interface SpacingTrace {
  relationship: string;
  foundation: string;
  component: string;
  pattern: string;
  screen: string;
  variation: string;
  status: SpecLabel;
}

export const SPACING_TRACES: SpacingTrace[] = [
  {
    relationship: "Icon → text",
    foundation: "gap-2 — 316 occurrences; gap-1 — 232",
    component: "Button, ACTION_PILL, navigation links",
    pattern: "Toolbars, navigation, cards",
    screen: "All screens",
    variation: "gap-1.5 also occurs for the same relationship.",
    status: "OBSERVED VARIATION",
  },
  {
    relationship: "Control padding",
    foundation: "px-3 — 238 occurrences; px-4 — 154",
    component: "Button, Input, Select, ACTION_PILL",
    pattern: "Forms and toolbars",
    screen: "All screens",
    variation: "Padding follows the size step, and the two ladders differ.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Card edge → content",
    foundation: "p-5 — 187 occurrences",
    component: "Card, KpiCard, PlanCard",
    pattern: "Detail page, KPI grouping, cart summary",
    screen: "All experiences",
    variation: "p-5 dominates but is not universal; other paddings coexist.",
    status: "FUTURE DECISION",
  },
  {
    relationship: "Grid and column gaps",
    foundation: "gap-4 — 133; gap-3 — 173",
    component: "Layout utilities, not components",
    pattern: "Listing grids, KPI grids",
    screen: "Plans, dashboards",
    variation: "Grid gaps are chosen per screen.",
    status: "UNOWNED AREA",
  },
  {
    relationship: "Page edge → content",
    foundation: "max-w-[88rem] — 23 occurrences",
    component: "Shells and route containers",
    pattern: "Every web-experience page",
    screen: "Landing, plans, cart, member settings",
    variation: "Headers run full width while content is constrained; dashboards use their own widths.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Header → content",
    foundation: "Shell offset values",
    component: "InternalShell, MarketplaceShell, MemberShell",
    pattern: "Every shell-hosted screen",
    screen: "All shell screens",
    variation: "Member settings added extra top spacing so content does not sit against the header.",
    status: "OBSERVED VARIATION",
  },
  {
    relationship: "Label → control",
    foundation: "Small consistent step",
    component: "form.tsx field set",
    pattern: "Form layout",
    screen: "Settings and module forms",
    variation: "Consistent inside form.tsx; other field systems differ.",
    status: "OBSERVED DUPLICATE",
  },
  {
    relationship: "Field → field",
    foundation: "Vertical rhythm steps",
    component: "Form sections",
    pattern: "Form layout",
    screen: "Forms across experiences",
    variation: "Field spacing differs between form systems.",
    status: "OBSERVED VARIATION",
  },
  {
    relationship: "Toolbar → results",
    foundation: "Spacing steps",
    component: "Compact PageHeader above the grid",
    pattern: "Filter and results",
    screen: "Plans",
    variation: "One step on plans; dashboard lists differ.",
    status: "FUTURE CANONICAL TARGET",
  },
  {
    relationship: "Table header → body",
    foundation: "Cell padding by density",
    component: "Table, DataTable",
    pattern: "List and table screen",
    screen: "Agency and admin",
    variation: "Two table systems apply different cell padding.",
    status: "OBSERVED DUPLICATE",
  },
  {
    relationship: "Section → section",
    foundation: "Large steps on web, tighter in dashboards",
    component: "Route sections",
    pattern: "Marketing page, detail page",
    screen: "Landing, record screens",
    variation: "Two rhythms exist deliberately.",
    status: "OBSERVED VARIATION",
  },
];
