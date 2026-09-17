/**
 * Phase 11 — naming readiness.
 * DOCUMENTATION ONLY. Nothing is renamed. Future proposals stay proposals.
 */
import type { NamingReadinessRecord } from "./canonical-readiness-types";

export const NAMING_READINESS: NamingReadinessRecord[] = [
  {
    currentName: "ACTION_PILL",
    currentUsage: "Shared class string in 35 files, 82 references.",
    conflict: "A constant, not a component, so it cannot be a library component name as it stands.",
    futureProposal:
      "Actions / Pill as a component, with the constant preserved until a migration is approved.",
    migrationImpact: "Broad — 35 files if ever changed. No change proposed now.",
    status: "FUTURE OPPORTUNITY",
  },
  {
    currentName: "StatusBadge and MetalBadge",
    currentUsage: "StatusBadge in 89 files; MetalBadge for tiers.",
    conflict: "Two names for one visual concept with different vocabularies.",
    futureProposal: "Display / Badge with a kind property, if the decision is taken.",
    migrationImpact: "Broad and cross-experience.",
    status: "FUTURE OPPORTUNITY",
  },
  {
    currentName: "PageHeader",
    currentUsage: "25 files, default and compact variants.",
    conflict: "Marketing headings and the shell masthead open screens without this name.",
    futureProposal: "Patterns / Screen header, covering all three placements if unified.",
    migrationImpact: "Depends on dec.screen-header.",
    status: "FUTURE DECISION",
  },
  {
    currentName: "DataTable, Table",
    currentUsage: "DataTable in 20 files; the primitive is also called Table.",
    conflict: "Direct collision between an ABox component and a UI primitive.",
    futureProposal:
      "Data / Table for the canonical one, with the other retaining its current name until decided.",
    migrationImpact: "Blocked by dec.table.",
    status: "FUTURE DECISION",
  },
  {
    currentName: "KpiCard",
    currentUsage: "18 files.",
    conflict: "KPI is an internal abbreviation; the component shows any metric.",
    futureProposal: "Data / Metric card.",
    migrationImpact: "Moderate — 18 files if ever renamed.",
    status: "FUTURE OPPORTUNITY",
  },
  {
    currentName: "PlanAI and Plan-O",
    currentUsage: "PlanAI on shopping routes; a legacy Plan-O surface remains in the tree.",
    conflict: "The product name was settled as PlanAI; the older name persists in code.",
    futureProposal: "One assistant name once dec.assistant is decided.",
    migrationImpact: "Blocked by dec.assistant.",
    status: "FUTURE DECISION",
  },
  {
    currentName: "InternalShell, MarketplaceShell, MemberShell",
    currentUsage: "89, 30 and member routes.",
    conflict: "None. Three names for three genuinely different frames.",
    futureProposal: "Shell / Internal, Shell / Marketplace, Shell / Member.",
    migrationImpact: "None proposed.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    currentName: "Literal token names such as max-w-[88rem]",
    currentUsage: "23 occurrences for the web container width.",
    conflict: "A measurement used as a name; the intent is not readable from the value.",
    futureProposal: "A named container width role bound to the same value.",
    migrationImpact: "Would be value-identical, but still touches 23 files.",
    status: "FUTURE OPPORTUNITY",
  },
  {
    currentName: ".story-link",
    currentUsage: "89 uses.",
    conflict: "Named like a utility but has no definition found in the stylesheet.",
    futureProposal: "Decide whether it is defined or retired.",
    migrationImpact: "Defining it would visibly change 89 links.",
    status: "FUTURE DECISION",
  },
  {
    currentName: "ToothIcon",
    currentUsage: "Wrapper around Tabler IconDental for the dental product.",
    conflict: "Single-purpose wrapper name inside an otherwise lucide-based icon set.",
    futureProposal: "Keep as is; it exists because the icon set lacks the glyph.",
    migrationImpact: "None proposed.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    currentName: "CarrierMark",
    currentUsage: "Deterministic monogram in plan tiles, cart and elsewhere.",
    conflict: "Reads like a real carrier logo but is illustrative.",
    futureProposal: "A name that conveys the placeholder nature, if ever renamed.",
    migrationImpact: "Moderate.",
    status: "OBSERVED VARIATION",
  },
];

export const NAMING_RULES: string[] = [
  "GOVERNANCE RULE — nothing in production is renamed by this phase. Every proposal above is a proposal.",
  "GOVERNANCE RULE — a name describes the problem a thing solves, not how it looks or where it happens to live.",
  "GOVERNANCE RULE — ownership is never inferred from a name or a folder.",
  "GOVERNANCE RULE — a rename is a migration and carries the full regression contract, even when it changes no pixels.",
  "Figma BLOCKED — component naming cannot be settled in a library while these collisions are open.",
];
