/**
 * Phase 9 — duplicate and overlap integration.
 *
 * DOCUMENTATION ONLY. Several implementations may map to one future
 * conceptual role. That mapping does not rank them, score them, choose a
 * winner, call one best, or imply that any migration has occurred.
 */
import type { SpecLabel } from "./graph-types";

export interface DuplicateMapping {
  conceptualRole: string;
  /** Listed in no meaningful order. */
  implementations: { name: string; source: string; measured: string }[];
  graphEffect: string;
  futureRole: string;
  status: SpecLabel;
}

export const DUPLICATE_MAPPINGS: DuplicateMapping[] = [
  {
    conceptualRole: "Data surface",
    implementations: [
      {
        name: "Table primitive",
        source: "src/components/ui/table.tsx",
        measured: "direct use by some screens",
      },
      { name: "DataTable", source: "src/components/abox/data-table.tsx", measured: "20 files" },
      {
        name: "Route-local tables",
        source: "src/components/m06, m08",
        measured: "governed module screens",
      },
    ],
    graphEffect: "Three implements-edges from one component role. The graph shows three, not one.",
    futureRole: "FUTURE CANONICAL TARGET — a single data family. Nothing implements it.",
    status: "OBSERVED DUPLICATE",
  },
  {
    conceptualRole: "Screen header",
    implementations: [
      { name: "PageHeader", source: "src/components/abox/page-header.tsx", measured: "25 files" },
      { name: "Compact results header", source: "src/routes/plans.tsx", measured: "plan results" },
      {
        name: "Route-local headers",
        source: "src/components/m06, m08",
        measured: "module screens",
      },
    ],
    graphEffect: "One compound node reached by three separate implementations.",
    futureRole:
      "FUTURE CANONICAL TARGET — one header with standard and compact structural variants.",
    status: "OBSERVED DUPLICATE",
  },
  {
    conceptualRole: "Empty presentation",
    implementations: [
      { name: "EmptyState", source: "src/components/abox/empty-state.tsx", measured: "10 files" },
      {
        name: "Route-local empty blocks",
        source: "governed kits and route markup",
        measured: "their own screens",
      },
    ],
    graphEffect: "The empty/loading/error pattern has one owned part and one unowned part.",
    futureRole: "FUTURE CANONICAL TARGET — one empty state with a separate error state beside it.",
    status: "OBSERVED DUPLICATE",
  },
  {
    conceptualRole: "Field",
    implementations: [
      {
        name: "form.tsx field set",
        source: "src/components/ui/form.tsx",
        measured: "react-hook-form screens",
      },
      { name: "Label plus control", source: "route markup", measured: "simple forms" },
      { name: "Route-local wrappers", source: "src/components/m06, m08", measured: "module forms" },
    ],
    graphEffect: "Three composes-edges into one compound node.",
    futureRole: "FUTURE CANONICAL TARGET — one field contract owning label association.",
    status: "OBSERVED DUPLICATE",
  },
  {
    conceptualRole: "Action",
    implementations: [
      { name: "Button", source: "src/components/ui/button.tsx", measured: "22 files" },
      {
        name: "ACTION_PILL",
        source: "src/components/abox/action-pill.ts",
        measured: "35 files, 82 references",
      },
      { name: "Route-local helper", source: "src/components/m06", measured: "module screens" },
    ],
    graphEffect:
      "Three implements-edges from the primary action role, each with its own size ladder.",
    futureRole: "FUTURE CANONICAL TARGET — one action component with a pill appearance.",
    status: "OBSERVED OVERLAP",
  },
  {
    conceptualRole: "Assistant surface",
    implementations: [
      {
        name: "PlanAI assistant",
        source: "src/components/abox/planai-assistant.tsx",
        measured: "shopping",
      },
      {
        name: "Plan-O assistant",
        source: "src/components/abox/plan-o-assistant.tsx",
        measured: "retained",
      },
      {
        name: "Lucie kits",
        source: "src/components/lucie, lucie-app",
        measured: "their own surfaces",
      },
      { name: "ai-elements", source: "src/components/ai-elements", measured: "shared AI blocks" },
    ],
    graphEffect: "The assistant pattern has four parallel producers and no shared contract.",
    futureRole: "FUTURE OPPORTUNITY — a shared assistant contract. No consolidation proposed.",
    status: "OBSERVED DUPLICATE",
  },
  {
    conceptualRole: "Edge-anchored overlay",
    implementations: [
      { name: "Sheet primitive", source: "src/components/ui/sheet.tsx", measured: "primitive" },
      { name: "Drawer primitive", source: "src/components/ui/drawer.tsx", measured: "primitive" },
    ],
    graphEffect:
      "Two overlay nodes share one role, and the word sheet also names a product concept.",
    futureRole: "FUTURE DECISION — disambiguation belongs to a future library, not to production.",
    status: "OBSERVED OVERLAP",
  },
  {
    conceptualRole: "Status and tone",
    implementations: [
      {
        name: "StatusBadge tones",
        source: "src/components/abox/status-badge.tsx",
        measured: "89 files",
      },
      { name: "Badge variants", source: "src/components/ui/badge.tsx", measured: "primitive" },
      { name: "Alert variants", source: "src/components/ui/alert.tsx", measured: "primitive" },
      { name: "Toast tones", source: "src/components/ui/sonner.tsx", measured: "global toaster" },
    ],
    graphEffect: "One semantic role feeds four component roles with overlapping vocabularies.",
    futureRole: "FUTURE CANONICAL TARGET — one semantic tone set consumed by all four.",
    status: "OBSERVED OVERLAP",
  },
  {
    conceptualRole: "Tabbed switching",
    implementations: [
      { name: "Tabs primitive", source: "src/components/ui/tabs.tsx", measured: "primitive" },
      {
        name: "ModuleTabs",
        source: "src/components/abox/module-tabs.tsx",
        measured: "module screens",
      },
    ],
    graphEffect: "Two navigation implementations from one role.",
    futureRole: "FUTURE CANONICAL TARGET — one tab contract with presentation variants.",
    status: "OBSERVED OVERLAP",
  },
  {
    conceptualRole: "Shell navigation",
    implementations: [
      {
        name: "InternalShell",
        source: "src/components/abox/internal-shell.tsx",
        measured: "89 files",
      },
      {
        name: "MarketplaceShell",
        source: "src/components/abox/marketplace-shell.tsx",
        measured: "30 files",
      },
      {
        name: "MemberShell",
        source: "src/components/abox/member-shell.tsx",
        measured: "member routes",
      },
      {
        name: "Sidebar primitive",
        source: "src/components/ui/sidebar.tsx",
        measured: "not consumed by the shells",
      },
    ],
    graphEffect:
      "Three shells implement navigation independently; the primitive sits outside the graph's live paths.",
    futureRole:
      "FUTURE CANONICAL TARGET — a shell contract for landmarks and offsets, shells kept separate.",
    status: "OBSERVED OVERLAP",
  },
];

export const DUPLICATE_GRAPH_RULES: string[] = [
  "GOVERNANCE RULE — a duplicate is drawn as several edges into one role, never as one edge with a chosen implementation.",
  "GOVERNANCE RULE — the graph carries no ordering, score or preference between parallel implementations.",
  "GOVERNANCE RULE — a future conceptual role sharing a name with a shipping component does not mean the component has been promoted.",
  "FUTURE MIGRATION — resolving any duplicate is a separate approved decision and has not been taken.",
];
