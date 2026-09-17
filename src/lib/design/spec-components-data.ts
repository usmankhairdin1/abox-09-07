/**
 * Phase 8 — Data category specification.
 * DOCUMENTATION ONLY. Multiple table systems coexist and all are preserved.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const simple = (
  name: string,
  purpose: string,
  file: string,
  exportName: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec>,
): CanonicalComponentSpec => ({
  name,
  category: "data",
  purpose,
  anatomy: [{ part: "Root", requirement: "required", role: "outer element" }],
  contentModel: [],
  properties: [],
  variants: [],
  states: [],
  sizes: "Follows the density of its host screen.",
  density: "Dashboard screens run denser than marketplace screens.",
  dependencies: {
    typography: "table role, text-sm",
    spacing: "px-3 to px-5 cell padding",
    color: "--card, hairline borders",
    shape: "rounded container, square cells",
    icon: "16px",
  },
  responsive: "Horizontal scroll on narrow viewports.",
  accessibility: "Real table semantics; headers associated with cells.",
  interaction: "Sorting and row actions where provided.",
  composition: {
    allowedChildren: "As stated.",
    prohibited: "As stated.",
    parentPatterns: "Dashboard screens.",
  },
  experienceExtensions: "Dashboard and admin only.",
  currentImplementation: [{ file, exportName, consumers }],
  observedVariations: [],
  futureCanonicalTarget:
    "A single data-display family covering table, toolbar, filters, summary and pagination.",
  figmaMapping: "Component set with Density, State and Column-count variants.",
  migrationNotes: "FUTURE MIGRATION — not scheduled; no winner chosen between existing systems.",
  governanceStatus: "documented current component",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const DATA_SPECS: SpecCategoryGroup = {
  id: "spec-data",
  category: "data",
  title: "Data",
  summary:
    "Two table systems ship: the primitive Table markup and the ABox DataTable, plus route-local tables inside the M06 and M08 kits. They are recorded side by side. No implementation is ranked or described as preferred.",
  specs: [
    simple(
      "Table",
      "Primitive table markup.",
      "src/components/ui/table.tsx",
      "Table, TableHeader, TableBody, TableRow, TableHead, TableCell",
      "primitive, used directly by some screens",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "table element" },
          { part: "Header", requirement: "required", role: "column headers" },
          { part: "Body", requirement: "required", role: "rows" },
          { part: "Footer", requirement: "optional", role: "summary row" },
        ],
        label: "OBSERVED DUPLICATE",
      },
    ),
    simple(
      "DataTable",
      "Configured table with columns, empty state and row actions.",
      "src/components/abox/data-table.tsx",
      "DataTable",
      "20 files",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "bordered container" },
          { part: "Header", requirement: "required", role: "column headers" },
          { part: "Body", requirement: "required", role: "rows, or the empty state" },
          { part: "Action", requirement: "optional", role: "row actions" },
        ],
        properties: [
          {
            name: "columns",
            propertyClass: "content",
            values: "column definitions",
            figma: "code-only",
            label: "CURRENT IMPLEMENTATION",
          },
          {
            name: "rows",
            propertyClass: "content",
            values: "data array",
            figma: "code-only",
            label: "CURRENT IMPLEMENTATION",
          },
          {
            name: "empty",
            propertyClass: "content",
            values: "empty state node",
            figma: "instance-swap",
            label: "CURRENT IMPLEMENTATION",
          },
          {
            name: "density",
            propertyClass: "density",
            values: "not exposed today",
            figma: "variant-property",
            label: "FUTURE CANONICAL TARGET",
          },
        ],
        states: [
          {
            state: "loading",
            affects: "rows replaced by skeletons",
            accessibility: "announce long waits",
            label: "FUTURE CANONICAL TARGET",
          },
          {
            state: "error",
            affects: "body replaced by an error region",
            accessibility: "message must be reachable",
            label: "FUTURE CANONICAL TARGET",
          },
          {
            state: "selected",
            affects: "row background",
            accessibility: "aria-selected where selection exists",
            label: "OBSERVED VARIATION",
          },
        ],
        label: "OBSERVED DUPLICATE",
      },
    ),
    simple(
      "TableToolbar",
      "Actions and controls that operate on the table below.",
      "route markup and route-local kits",
      "composed per screen",
      "unowned",
      {
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "A named toolbar owning search, filters, bulk actions and the spacing to the table.",
        governanceStatus: "future canonical target",
      },
    ),
    simple(
      "FilterBar",
      "Narrow a result set through grouped controls.",
      "src/routes/plans.tsx and dashboard screens",
      "composed per screen",
      "unowned",
      {
        observedVariations: [
          "Plan filters reuse listing badge treatments for metal, network, exchange and HSA.",
          "Dashboard filters use plain controls instead.",
        ],
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "A shared filter contract covering chips, counts, persistence and reset.",
        governanceStatus: "future canonical target",
      },
    ),
    simple(
      "Pagination",
      "Move through pages of results.",
      "src/components/ui/pagination.tsx",
      "Pagination",
      "primitive",
      {
        accessibility: "Navigation landmark with current-page indication.",
      },
    ),
    simple(
      "ResultsSummary",
      "State how many results are shown and under what filters.",
      "src/routes/plans.tsx compact header",
      "composed per screen",
      "unowned",
      {
        label: "UNOWNED AREA",
        futureCanonicalTarget: "One summary contract shared by plan results and dashboard lists.",
        governanceStatus: "future canonical target",
      },
    ),
    simple(
      "List",
      "Vertical collection of comparable items.",
      "route markup",
      "composed per screen",
      "unowned",
      {
        label: "UNOWNED AREA",
        governanceStatus: "future canonical target",
      },
    ),
    simple(
      "ListItem",
      "One entry in a list, with leading, label, supporting and trailing slots.",
      "route markup",
      "composed per screen",
      "unowned",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "row" },
          { part: "Leading", requirement: "optional", role: "icon or mark" },
          { part: "Label", requirement: "required", role: "primary text" },
          { part: "Supporting", requirement: "optional", role: "secondary text" },
          { part: "Trailing", requirement: "optional", role: "status or action" },
        ],
        label: "UNOWNED AREA",
        governanceStatus: "future canonical target",
      },
    ),
    simple(
      "DataRow",
      "A label and value pair used in detail panels and summaries.",
      "route markup, quote and cart summaries",
      "composed per screen",
      "unowned",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "row" },
          { part: "Label", requirement: "required", role: "field name" },
          { part: "Content", requirement: "required", role: "value" },
        ],
        label: "UNOWNED AREA",
        governanceStatus: "future canonical target",
      },
    ),
  ],
};
