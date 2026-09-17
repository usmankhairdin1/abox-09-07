/**
 * Phase 10 — pattern-level duplicates and overlaps.
 * DOCUMENTATION ONLY. The component-level register lives in Phase 9; this
 * module adds only the pattern dimension. Nothing is ranked, scored, merged,
 * renamed, deleted or migrated, and no winner is chosen.
 */
import type { PatternDuplicateRecord } from "./pattern-spec-types";
import { DUPLICATE_MAPPINGS } from "./graph-duplicates";

/** The Phase 9 component-level register, referenced rather than restated. */
export const COMPONENT_LEVEL_DUPLICATES = DUPLICATE_MAPPINGS;

export const PATTERN_DUPLICATES: PatternDuplicateRecord[] = [
  {
    concept: "Tabular record presentation",
    implementations: [
      { name: "DataTable", source: "src/components/abox/data-table.tsx", consumers: "20 files" },
      {
        name: "Table primitive",
        source: "src/components/ui/table.tsx",
        consumers: "route-local admin screens",
      },
      {
        name: "Route-local tables",
        source: "governed module screens",
        consumers: "written per route",
      },
    ],
    differences:
      "Cell padding, minimum width, empty-row handling and whether an aria-label is required.",
    ownership: "Mixed: ABox, primitive and route",
    resolution: "unresolved",
    status: "OBSERVED DUPLICATE",
  },
  {
    concept: "Field and form composition",
    implementations: [
      {
        name: "Primitive fields",
        source: "Input, Label, Select",
        consumers: "7 files each for Input and Select, 5 for Label",
      },
      { name: "M06 route kit fields", source: "M06 route-local kit", consumers: "M06 screens" },
      { name: "M08 route kit fields", source: "M08 route-local kit", consumers: "M08 screens" },
    ],
    differences: "Label placement, help and error text, control height and validation wiring.",
    ownership: "Primitive and route-local",
    resolution: "unresolved",
    status: "OBSERVED DUPLICATE",
  },
  {
    concept: "Shell navigation",
    implementations: [
      {
        name: "InternalShell",
        source: "src/components/abox/internal-shell.tsx",
        consumers: "89 files",
      },
      {
        name: "MarketplaceShell",
        source: "src/components/abox/marketplace-shell.tsx",
        consumers: "30 files",
      },
      {
        name: "MemberShell",
        source: "src/components/abox/member-shell.tsx",
        consumers: "member routes",
      },
    ],
    differences:
      "Rail versus floating header, collapse breakpoint, search presence and account control treatment.",
    ownership: "Business",
    resolution: "observed",
    status: "OBSERVED OVERLAP",
    note: "Three audiences, three deliberate models. Recorded as overlap, not as a defect.",
  },
  {
    concept: "Assistant surface",
    implementations: [
      {
        name: "PlanAI",
        source: "src/components/abox/planai-assistant.tsx",
        consumers: "shopping routes",
      },
      {
        name: "Plan-O assistant",
        source: "src/components/abox/plan-o-assistant.tsx",
        consumers: "legacy surface",
      },
      { name: "ai-elements kit", source: "route-local ai-elements", consumers: "Lucie screens" },
    ],
    differences: "Message model, composer, persistence and accessibility handling.",
    ownership: "Route-local",
    resolution: "unresolved",
    status: "OBSERVED DUPLICATE",
  },
  {
    concept: "Overlay surface",
    implementations: [
      { name: "Dialog primitive", source: "src/components/ui/dialog.tsx", consumers: "4 files" },
      {
        name: "Route-local filter overlay",
        source: "src/routes/plans.index.tsx line 374",
        consumers: "plans route",
      },
    ],
    differences: "Focus trapping, close affordance and animation.",
    ownership: "Primitive and route",
    resolution: "unresolved",
    status: "OBSERVED VARIATION",
  },
  {
    concept: "Screen opening header",
    implementations: [
      { name: "PageHeader", source: "src/components/abox/page-header.tsx", consumers: "25 files" },
      {
        name: "Marketing section headings",
        source: "src/routes/index.tsx",
        consumers: "landing sections",
      },
      {
        name: "InternalShell page masthead",
        source: "internal-shell.tsx lines 114-119",
        consumers: "internal routes",
      },
    ],
    differences:
      "Whether an eyebrow, icon tile or hairline exists, and which heading level is used.",
    ownership: "ABox, route and shell",
    resolution: "unresolved",
    status: "OBSERVED DUPLICATE",
  },
  {
    concept: "Absent-content presentation",
    implementations: [
      { name: "EmptyState", source: "src/components/abox/empty-state.tsx", consumers: "10 files" },
      { name: "Skeleton blocks", source: "src/components/ui/skeleton.tsx", consumers: "4 files" },
      { name: "Inline error markup", source: "written per route", consumers: "various" },
    ],
    differences: "Only the empty case has a component. Loading and error are composed ad hoc.",
    ownership: "Partly unowned",
    resolution: "unresolved",
    status: "UNOWNED AREA",
  },
];

export const DUPLICATE_HANDLING_RULES: string[] = [
  "GOVERNANCE RULE — every implementation is listed with its real consumers. None is marked preferred.",
  "GOVERNANCE RULE — usage count is evidence of reach, never evidence of correctness.",
  "GOVERNANCE RULE — nothing here is deleted, merged, renamed, normalised or migrated by this phase.",
  "GOVERNANCE RULE — resolving any of these requires an explicit approval, because each resolution changes production output.",
  "FUTURE DECISION — all entries marked unresolved remain open.",
];
