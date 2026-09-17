/**
 * Phase 8 — duplicate and overlap register.
 *
 * DOCUMENTATION ONLY. Implementations are listed side by side in no
 * meaningful order. Nothing here ranks, prefers, deprecates or selects a
 * winner, and nothing is consolidated.
 */
import type { DuplicateRegisterEntry } from "./component-spec-types";

export const DUPLICATE_REGISTER: DuplicateRegisterEntry[] = [
  {
    area: "Tables",
    implementations: [
      {
        name: "Table primitive",
        source: "src/components/ui/table.tsx",
        scope: "Raw markup used directly by some screens",
      },
      {
        name: "DataTable",
        source: "src/components/abox/data-table.tsx",
        scope: "20 files; columns, rows and an empty state",
      },
      {
        name: "Route-local tables",
        source: "src/components/m06, src/components/m08",
        scope: "Governed module screens",
      },
    ],
    overlap:
      "All three render tabular data with their own cell padding, header treatment and empty handling.",
    future:
      "FUTURE CANONICAL TARGET — one data family covering table, toolbar, filters, summary and pagination.",
    label: "OBSERVED DUPLICATE",
  },
  {
    area: "Page headers",
    implementations: [
      { name: "PageHeader", source: "src/components/abox/page-header.tsx", scope: "25 files" },
      { name: "Compact results header", source: "src/routes/plans.tsx", scope: "Plan results" },
      {
        name: "Route-local headers",
        source: "src/components/m06, src/components/m08",
        scope: "Governed module screens",
      },
    ],
    overlap: "Each renders a title, optional description and actions with its own sizing.",
    future:
      "FUTURE CANONICAL TARGET — one header contract with standard and compact structural variants.",
    label: "OBSERVED DUPLICATE",
  },
  {
    area: "Empty states",
    implementations: [
      { name: "EmptyState", source: "src/components/abox/empty-state.tsx", scope: "10 files" },
      {
        name: "Route-local empty blocks",
        source: "governed module kits and route markup",
        scope: "Their own screens",
      },
    ],
    overlap: "Same purpose, different anatomy and spacing.",
    future: "FUTURE CANONICAL TARGET — one empty state, with a separate error state beside it.",
    label: "OBSERVED DUPLICATE",
  },
  {
    area: "Form fields",
    implementations: [
      {
        name: "form.tsx field set",
        source: "src/components/ui/form.tsx",
        scope: "react-hook-form screens",
      },
      { name: "Label plus control", source: "route markup", scope: "Simple forms" },
      {
        name: "Route-local field wrappers",
        source: "src/components/m06, src/components/m08",
        scope: "Governed module forms",
      },
    ],
    overlap: "Three ways to associate a label, control, helper and error.",
    future: "FUTURE CANONICAL TARGET — one field contract every control plugs into.",
    label: "OBSERVED DUPLICATE",
  },
  {
    area: "Action paths",
    implementations: [
      { name: "Button", source: "src/components/ui/button.tsx", scope: "22 files" },
      {
        name: "ACTION_PILL",
        source: "src/components/abox/action-pill.ts",
        scope: "35 files, 82 references",
      },
      { name: "Route-local button helpers", source: "src/components/m06", scope: "Module screens" },
    ],
    overlap: "Three ways to render an action, with different size ladders.",
    future: "FUTURE CANONICAL TARGET — one action component with a pill appearance.",
    label: "OBSERVED OVERLAP",
  },
  {
    area: "Assistants",
    implementations: [
      {
        name: "PlanAI assistant",
        source: "src/components/abox/planai-assistant.tsx",
        scope: "Shopping",
      },
      {
        name: "Plan-O assistant",
        source: "src/components/abox/plan-o-assistant.tsx",
        scope: "Earlier naming, retained",
      },
      {
        name: "Lucie kits",
        source: "src/components/lucie, src/components/lucie-app",
        scope: "Their own surfaces",
      },
      {
        name: "ai-elements",
        source: "src/components/ai-elements",
        scope: "Shared AI building blocks",
      },
    ],
    overlap: "Several conversational surfaces with their own layout and controls.",
    future:
      "FUTURE OPPORTUNITY — a shared assistant surface contract. No consolidation is proposed here.",
    label: "OBSERVED DUPLICATE",
  },
  {
    area: "Sheet naming",
    implementations: [
      {
        name: "Sheet primitive",
        source: "src/components/ui/sheet.tsx",
        scope: "Edge-anchored overlay",
      },
      {
        name: "Drawer primitive",
        source: "src/components/ui/drawer.tsx",
        scope: "Bottom-anchored overlay",
      },
    ],
    overlap:
      "The word sheet names a primitive and is also used in product language, and Sheet and Drawer overlap in purpose.",
    future: "FUTURE DECISION — disambiguation belongs to a future library, not to production.",
    label: "OBSERVED OVERLAP",
  },
  {
    area: "Status and tone vocabulary",
    implementations: [
      {
        name: "StatusBadge tones",
        source: "src/components/abox/status-badge.tsx",
        scope: "89 files",
      },
      { name: "Badge variants", source: "src/components/ui/badge.tsx", scope: "Primitive" },
      { name: "Alert variants", source: "src/components/ui/alert.tsx", scope: "Primitive" },
      { name: "Toast tones", source: "src/components/ui/sonner.tsx", scope: "Global toaster" },
    ],
    overlap: "Four tone vocabularies express overlapping meanings.",
    future: "FUTURE CANONICAL TARGET — one semantic tone set consumed by all four.",
    label: "OBSERVED OVERLAP",
  },
  {
    area: "Tabs",
    implementations: [
      { name: "Tabs primitive", source: "src/components/ui/tabs.tsx", scope: "Primitive" },
      {
        name: "ModuleTabs",
        source: "src/components/abox/module-tabs.tsx",
        scope: "Module screens",
      },
    ],
    overlap: "Two tab presentations with different indicators.",
    future: "FUTURE CANONICAL TARGET — one tab contract with presentation variants.",
    label: "OBSERVED OVERLAP",
  },
  {
    area: "Shells and navigation",
    implementations: [
      {
        name: "InternalShell",
        source: "src/components/abox/internal-shell.tsx",
        scope: "89 files",
      },
      {
        name: "MarketplaceShell",
        source: "src/components/abox/marketplace-shell.tsx",
        scope: "30 files",
      },
      {
        name: "MemberShell",
        source: "src/components/abox/member-shell.tsx",
        scope: "Member routes",
      },
      {
        name: "Sidebar primitive",
        source: "src/components/ui/sidebar.tsx",
        scope: "Available, not used by the shells",
      },
    ],
    overlap: "Each shell implements navigation independently of the primitive.",
    future:
      "FUTURE CANONICAL TARGET — a shell contract describing landmarks and offsets, with shells kept separate.",
    label: "OBSERVED OVERLAP",
  },
];
