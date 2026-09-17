/**
 * Phase 11 — proposed future Figma library structure.
 * DOCUMENTATION ONLY. The structure below is a proposal mapped from the Phase
 * 8–10 specifications. It is not final, and no part of it exists.
 */
import type { LibraryGroupProposal } from "./canonical-readiness-types";

export const LIBRARY_STRUCTURE_SKETCH = `ABox Core
├── Foundations
├── Actions
├── Forms
├── Display
├── Containers
├── Data
├── Navigation
├── Overlays
├── Feedback
├── Commerce
├── Brand
├── Shell
├── Patterns
└── Experience Extensions`;

export const LIBRARY_GROUPS: LibraryGroupProposal[] = [
  { group: "Foundations", wouldContain: "Colour, spacing, radius, shadow, type and motion variables.", mappedFrom: "Phase 1, 2, 3 and 7 foundation records.", justified: true, readiness: "READY" },
  { group: "Actions", wouldContain: "Button and action pill.", mappedFrom: "Phase 8 action specifications; ACTION_PILL across 35 files.", justified: true, readiness: "PARTIAL", note: "Size variants wait on the control-height decision." },
  { group: "Forms", wouldContain: "Input, Select, Label and a field composition.", mappedFrom: "Phase 8 form specifications.", justified: false, readiness: "BLOCKED", note: "Three field compositions exist; none is selected." },
  { group: "Display", wouldContain: "Status badge, metal tier badge, icon tile, text roles.", mappedFrom: "Phase 8 display specifications; StatusBadge in 89 files.", justified: true, readiness: "PARTIAL", note: "The icon tile has no owning component today." },
  { group: "Containers", wouldContain: "Card and surface treatments.", mappedFrom: "Phase 8 container specifications.", justified: true, readiness: "PARTIAL", note: "Padding density undecided." },
  { group: "Data", wouldContain: "Table, KPI card, data list.", mappedFrom: "Phase 8 data specifications; DataTable 20 consumers, KpiCard 18.", justified: false, readiness: "BLOCKED", note: "Three table implementations; none is selected." },
  { group: "Navigation", wouldContain: "Navigation items, breadcrumbs, tabs.", mappedFrom: "Phase 8 navigation specifications.", justified: false, readiness: "FUTURE DECISION", note: "Three shells implement navigation independently." },
  { group: "Overlays", wouldContain: "Dialog and drawer.", mappedFrom: "Phase 8 overlay specifications; Dialog in 4 files.", justified: true, readiness: "PARTIAL", note: "The plans filter overlay is separate today." },
  { group: "Feedback", wouldContain: "Empty state, loading, error, toast.", mappedFrom: "Phase 8 feedback specifications; EmptyState in 10 files.", justified: false, readiness: "BLOCKED", note: "Loading and error have no owner." },
  { group: "Commerce", wouldContain: "Plan tile, cart summary, add-ons surface.", mappedFrom: "Phase 8 commerce specifications; PlanCard in 6 files.", justified: true, readiness: "PARTIAL" },
  { group: "Brand", wouldContain: "Brand mark and wordmark slots only.", mappedFrom: "Phase 4 assets audit; AboxMark and AboxWordmark are code-drawn.", justified: true, readiness: "READY", note: "Tenant values stay runtime-owned; the library models the slot." },
  { group: "Shell", wouldContain: "Three page frames, kept separate.", mappedFrom: "Phase 5 and Phase 9 shell records.", justified: true, readiness: "PARTIAL", note: "Modelled as three, because the code has three." },
  { group: "Patterns", wouldContain: "The Phase 10 patterns as pattern frames.", mappedFrom: "Phase 10 pattern specifications.", justified: true, readiness: "PARTIAL" },
  { group: "Experience Extensions", wouldContain: "Per-experience specialisations of the core patterns.", mappedFrom: "Phase 10 experience patterns and extension records.", justified: true, readiness: "READY" },
];

export const LIBRARY_RULES: string[] = [
  "FUTURE OPPORTUNITY — this structure is a proposal. No Figma file, page, component, variant, style, variable or asset exists.",
  "GOVERNANCE RULE — a group marked unjustified is not created; the evidence does not yet support it.",
  "GOVERNANCE RULE — where the code has several implementations, the library models several components or none; it never silently picks one.",
  "GOVERNANCE RULE — the library follows production. Where they differ, production is correct and the library is updated.",
  "FUTURE DECISION — publishing, versioning and review ownership for the library have not been decided.",
];
