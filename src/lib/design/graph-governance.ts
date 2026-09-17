/**
 * Phase 9 — governance and change propagation.
 * DOCUMENTATION ONLY. No migration is performed or scheduled.
 */
import type { SpecLabel } from "./graph-types";

export interface PropagationRule {
  changeAt: string;
  propagatesTo: string;
  reviewPoint: string;
  owner: string;
  status: SpecLabel;
}

export const PROPAGATION_RULES: PropagationRule[] = [
  {
    changeAt: "Foundation token",
    propagatesTo:
      "Every semantic role reading it, then every component role, component, pattern, experience and screen below.",
    reviewPoint:
      "List the affected roles before changing the value; a token with many roles is a high-blast-radius change.",
    owner: "Foundation",
    status: "GOVERNANCE RULE",
  },
  {
    changeAt: "Semantic role",
    propagatesTo: "Component roles that consume it and everything beneath them.",
    reviewPoint:
      "Check whether more than one component role depends on the same meaning; overlapping roles multiply the effect.",
    owner: "Design system",
    status: "GOVERNANCE RULE",
  },
  {
    changeAt: "Core component",
    propagatesTo: "Measured consumers, then compounds, patterns, experiences and screens.",
    reviewPoint:
      "Read the consumer count first. Anything above roughly twenty files needs visual diffing across experiences.",
    owner: "Component author",
    status: "GOVERNANCE RULE",
  },
  {
    changeAt: "Compound component",
    propagatesTo: "The patterns built on it and the screens that render them.",
    reviewPoint: "Confirm no experience relies on the exact part arrangement being changed.",
    owner: "Component author",
    status: "GOVERNANCE RULE",
  },
  {
    changeAt: "Pattern",
    propagatesTo: "Every experience that uses it and every screen inside them.",
    reviewPoint:
      "Several patterns have no owner today, so a change needs an owner appointed first.",
    owner: "Unowned for several patterns",
    status: "UNOWNED AREA",
  },
  {
    changeAt: "Experience extension",
    propagatesTo: "Only the screens in that experience.",
    reviewPoint:
      "Confirm the change is genuinely experience-specific and does not belong in the core.",
    owner: "Experience",
    status: "GOVERNANCE RULE",
  },
  {
    changeAt: "Screen",
    propagatesTo: "Nothing, provided the screen composes rather than redefines.",
    reviewPoint:
      "A screen that invents a new token, role or pattern has widened its blast radius silently.",
    owner: "Route",
    status: "GOVERNANCE RULE",
  },
  {
    changeAt: "Runtime brand value",
    propagatesTo: "Rendered output only, through the role it fills.",
    reviewPoint: "Handled by the Branding feature's own approval path, not by the design system.",
    owner: "Branding & White-Label",
    status: "GOVERNANCE RULE",
  },
];

export const MIGRATION_STAGES: {
  stage: number;
  name: string;
  meaning: string;
  status: SpecLabel;
}[] = [
  {
    stage: 1,
    name: "Establish a canonical foundation",
    meaning: "Agree the roles and names before any code moves.",
    status: "FUTURE MIGRATION",
  },
  {
    stage: 2,
    name: "Establish a canonical component",
    meaning: "Build it beside the existing ones, consuming nothing and breaking nothing.",
    status: "FUTURE MIGRATION",
  },
  {
    stage: 3,
    name: "Validate against current implementation",
    meaning: "Prove it can reproduce what ships, pixel for pixel.",
    status: "FUTURE MIGRATION",
  },
  {
    stage: 4,
    name: "Migrate selected consumers",
    meaning: "A small, explicitly chosen set — never a sweep.",
    status: "FUTURE MIGRATION",
  },
  {
    stage: 5,
    name: "Validate parity",
    meaning: "Before and after comparison on every touched screen.",
    status: "FUTURE MIGRATION",
  },
  {
    stage: 6,
    name: "Deprecate the old path",
    meaning: "Marked, not removed, and only once nothing depends on it.",
    status: "FUTURE MIGRATION",
  },
  {
    stage: 7,
    name: "Remove",
    meaning: "Only after explicit approval, never as part of another change.",
    status: "FUTURE MIGRATION",
  },
];

export const MIGRATION_BOUNDARY: string[] = [
  "FUTURE MIGRATION — every stage above is conceptual. None has been started.",
  "GOVERNANCE RULE — this phase does not identify which component should migrate first, and does not rank candidates.",
  "GOVERNANCE RULE — a duplicate is resolved only by an explicit approved decision, not by a migration happening to touch it.",
  "GOVERNANCE RULE — removal is always a separate approval from replacement.",
  "GOVERNANCE RULE — runtime branding and marketplace assets are never part of a migration.",
];
