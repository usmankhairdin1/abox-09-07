/**
 * Phase 11 — experience readiness.
 * DOCUMENTATION ONLY. Experience differences are preserved, never flattened.
 */
import type { ExperienceReadinessRecord } from "./canonical-readiness-types";

export const EXPERIENCE_READINESS: ExperienceReadinessRecord[] = [
  {
    experience: "Web / Marketing",
    sharedCoreBehavior: "Uses the shared tokens, action pills, badges and the 88rem web container.",
    experienceExtensions: "Hero with viewport-aware height, entry product pills, marketing section cards.",
    intentionalDifferences: "Larger type steps, a taller hero pill height, and heading sizes tuned in earlier approved work.",
    unresolvedDifferences: "Section headers have no owning component; hero pill height is undecided against the shared pill.",
    ownership: "business",
    figmaImplication: "Modellable as an experience extension set; section headers cannot be modelled while unowned.",
    readiness: "NEEDS OWNER",
    status: "OBSERVED VARIATION",
  },
  {
    experience: "Shopping / Commerce",
    sharedCoreBehavior: "Marketplace shell, shared badges and tokens, shared page header in compact form.",
    experienceExtensions: "Filter rail with a dialog below lg, plan tiles, cart summary, add-ons surface, PlanAI assistant, session-backed shopping state.",
    intentionalDifferences: "Single selection per product type in the cart while health, dental, vision and life bundle together; persisted filters; carrier marks in listings but not in filters.",
    unresolvedDifferences: "The filter overlay does not use the Dialog primitive; the assistant surface competes with two others.",
    ownership: "business",
    figmaImplication: "Commerce patterns are modellable; the overlay and assistant wait on their decisions.",
    readiness: "BLOCKED BY DUPLICATE",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    experience: "Dashboard / Admin",
    sharedCoreBehavior: "Internal shell across 89 files, shared status badges, page headers, KPI cards and data tables.",
    experienceExtensions: "Governed module kits for M06 and M08 with their own field compositions and controlled identifiers.",
    intentionalDifferences: "Denser controls and tables than the web experience; permission-dependent states.",
    unresolvedDifferences: "Three table implementations and three field compositions coexist.",
    ownership: "business",
    figmaImplication: "Blocked until the table and field decisions are taken.",
    readiness: "BLOCKED BY DUPLICATE",
    status: "OBSERVED DUPLICATE",
  },
  {
    experience: "Member / Account",
    sharedCoreBehavior: "Member shell with the same 88rem content width and shared primitives.",
    experienceExtensions: "Left navigation with a connecting arc through the icon circles; settings surfaces.",
    intentionalDifferences: "Stacks at md where cart and hero stack at lg; its own header treatment.",
    unresolvedDifferences: "The stacking breakpoint difference is undecided; the shell overlaps the other two.",
    ownership: "business",
    figmaImplication: "Modellable as a separate shell; responsive variants wait on the breakpoint decision.",
    readiness: "BLOCKED BY EXPERIENCE VARIATION",
    status: "OBSERVED VARIATION",
  },
];

export const EXPERIENCE_READINESS_RULES: string[] = [
  "GOVERNANCE RULE — an intentional difference is preserved. Uniformity is not a goal in itself.",
  "GOVERNANCE RULE — a difference is only unresolved when no evidence explains it; otherwise it is an extension.",
  "GOVERNANCE RULE — experience owners decide within the core anatomy; changing the anatomy is a design-system decision.",
  "GOVERNANCE RULE — a future library models experiences as extensions of the core, never as forks of it.",
];
