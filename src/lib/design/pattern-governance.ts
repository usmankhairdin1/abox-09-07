/**
 * Phase 10 — pattern governance.
 * DOCUMENTATION ONLY. These rules describe how future pattern work should be
 * conducted. They are not enforced by any build step and they change nothing
 * that ships today.
 */
import type { PatternGovernanceRule } from "./pattern-spec-types";

export const PATTERN_DEFINITION_RULES: PatternGovernanceRule[] = [
  {
    question: "When is something a component?",
    rule: "It is one reusable unit with its own props and no assumption about the screen around it.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "When is it a compound?",
    rule: "It is a fixed composition of components that always appear together and are imported as one.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "When is it a pattern?",
    rule: "It is a recurring arrangement that solves one screen problem, observed in at least two independent places in the code.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "When is it an experience pattern?",
    rule: "A pattern keeps its anatomy but takes a composition, density or wording specific to one experience.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "When is repeated markup not a pattern?",
    rule: "When only the appearance repeats and the problem being solved differs. Visual similarity is never sufficient.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "When is something unowned?",
    rule: "When the arrangement recurs but no component, kit or shell is responsible for it.",
    status: "GOVERNANCE RULE",
  },
];

export const CANONICALIZATION_EVIDENCE: PatternGovernanceRule[] = [
  {
    question: "What is required before a pattern is called canonical?",
    rule: "Anatomy, states, responsive behaviour, density, accessibility and at least two real consumers, all read from code.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Can frequency decide a winner?",
    rule: "No. The most used implementation is the most used, not the correct one.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "What happens when evidence is thin?",
    rule: "It is recorded as FUTURE DECISION with the reason, never filled in by inference.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Who approves canonicalisation?",
    rule: "A person. No phase of this work selects a canonical implementation on its own.",
    status: "GOVERNANCE RULE",
  },
];

export const PATTERN_OWNERSHIP_RULES: PatternGovernanceRule[] = [
  {
    question: "Who owns a core pattern?",
    rule: "The design system, once a shared component or compound implements it.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Who owns an experience pattern?",
    rule: "The experience team, within the anatomy the core pattern defines.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Who owns a route-local pattern?",
    rule: "The route or governed module that wrote it, until it is adopted deliberately.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Who owns branding and marketplace artwork?",
    rule: "The runtime features. Patterns consume those values; the design system never takes their configuration.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Who owns an unowned pattern?",
    rule: "Nobody today. That is recorded as UNOWNED AREA and stays open until assigned.",
    status: "UNOWNED AREA",
  },
];

export const PATTERN_DOCUMENTATION_DUTIES: PatternGovernanceRule[] = [
  {
    question: "Naming",
    rule: "A pattern is named for the problem it solves, not for how it looks.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "States",
    rule: "Every state handled in code is documented; states not handled are recorded as absent, not invented.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Responsive",
    rule: "Breakpoint, structural change and each of desktop, tablet and mobile are recorded from real classes.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Accessibility",
    rule: "Landmark, heading level, labelling and focus behaviour are recorded, including where they are missing.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Figma mapping",
    rule: "A pattern is mapped to a proposed component set, variant properties and content model before any file is built.",
    status: "GOVERNANCE RULE",
  },
  {
    question: "Change impact",
    rule: "Before a pattern changes, the Phase 9 graph is used to list what the change can reach.",
    status: "GOVERNANCE RULE",
  },
];

export const APPROVAL_GATE: string[] = [
  "GOVERNANCE RULE — no production file is changed by a specification phase.",
  "GOVERNANCE RULE — consolidating duplicates, assigning owners to unowned patterns and aligning densities each need their own approval.",
  "GOVERNANCE RULE — a migration names its first consumer, its rollback and its visual check before it begins.",
  "GOVERNANCE RULE — the running application wins any disagreement with this documentation; the documentation is corrected, not the app.",
  "FUTURE DECISION — no migration has been approved or started.",
];
