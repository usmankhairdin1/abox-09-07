/**
 * Phase 8 — experience extension boundaries.
 * DOCUMENTATION ONLY.
 */
import type { SpecLabel } from "./component-spec-types";

export interface ExperienceBoundary {
  experience: string;
  shell: string;
  sharedFromCore: string;
  legitimateExtensions: string;
  mustNotDiverge: string;
  label: SpecLabel;
}

export const EXPERIENCE_BOUNDARIES: ExperienceBoundary[] = [
  {
    experience: "Web / Marketing",
    shell: "Public routes with a full-width header and an 88rem centred container.",
    sharedFromCore: "Actions, links, cards, feedback, overlays, containers.",
    legitimateExtensions:
      "Hero plates, product entry chips, marketing sections and larger display typography.",
    mustNotDiverge:
      "Action semantics, focus treatment, tone vocabulary and accessible naming stay identical to every other experience.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    experience: "Shopping / Commerce",
    shell: "MarketplaceShell, comfortable density.",
    sharedFromCore: "Actions, forms, badges, overlays, containers, data primitives.",
    legitimateExtensions:
      "PlanCard, MetalBadge, CarrierMark, amount formatting, filter chips, cart summary, product switcher, assistant surface.",
    mustNotDiverge:
      "Status meaning, badge readability rules and the requirement that appointment or compensation never affects consumer visibility, prominence, sorting or comparison.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    experience: "Dashboard / Admin",
    shell: "InternalShell, dense.",
    sharedFromCore: "Actions, forms, overlays, feedback, containers, tables.",
    legitimateExtensions:
      "KpiCard, DataTable configurations, module tabs, governed status presentation, wizard steppers.",
    mustNotDiverge: "Field association, error communication, focus treatment and keyboard order.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    experience: "Member / Account",
    shell: "MemberShell with its own side navigation.",
    sharedFromCore: "Forms, cards, feedback, containers.",
    legitimateExtensions: "Account navigation arc and settings layout.",
    mustNotDiverge: "Form semantics and the shared container width.",
    label: "CURRENT IMPLEMENTATION",
  },
];

export const EXPERIENCE_RULES: string[] = [
  "GOVERNANCE RULE — the core library is shared. An experience may extend it; it may not fork it.",
  "GOVERNANCE RULE — visual differences between experiences are intentional. Density, container width and heading scale are allowed to differ.",
  "GOVERNANCE RULE — meaning, semantics and accessibility never differ between experiences.",
  "FUTURE CANONICAL TARGET — an extension declares which core component it builds on, so a change to the core is traceable to every experience it touches.",
  "FUTURE DECISION — whether marketing display typography becomes part of core or stays a web extension is unresolved.",
];
