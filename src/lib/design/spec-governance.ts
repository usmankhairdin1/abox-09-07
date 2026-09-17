/**
 * Phase 8 — governance, maturity and the documentation template.
 * DOCUMENTATION ONLY. No scores, no ranking, no winners.
 */
import type { SpecGovernanceStatus, SpecLabel } from "./component-spec-types";

export interface MaturityCategory {
  status: SpecGovernanceStatus;
  meaning: string;
  whatItImplies: string;
  whatItDoesNotImply: string;
}

export const MATURITY_CATEGORIES: MaturityCategory[] = [
  {
    status: "documented current component",
    meaning: "A component that ships today and whose behavior is recorded here.",
    whatItImplies: "It can be read as evidence of how the product works.",
    whatItDoesNotImply: "It is not declared final, correct or preferred over anything else.",
  },
  {
    status: "documented current variation",
    meaning: "A shipping difference between implementations of the same idea.",
    whatItImplies: "It is intentional until proven otherwise and stays as it is.",
    whatItDoesNotImply: "It is not a defect and not queued for removal.",
  },
  {
    status: "future canonical target",
    meaning: "A proposed contract for a future library.",
    whatItImplies: "It gives a direction for later work if it is ever approved.",
    whatItDoesNotImply: "It does not exist, and nothing in production has moved towards it.",
  },
  {
    status: "future opportunity",
    meaning: "An improvement worth considering, without a proposed contract.",
    whatItImplies: "Someone has noticed a possible gain.",
    whatItDoesNotImply: "No commitment, no schedule.",
  },
  {
    status: "future decision",
    meaning: "Evidence is insufficient to state a rule safely.",
    whatItImplies: "A person must decide before anything is built.",
    whatItDoesNotImply: "A value has not been silently chosen.",
  },
  {
    status: "migration candidate",
    meaning: "An area a future migration would touch.",
    whatItImplies: "Scope and risk are recorded.",
    whatItDoesNotImply: "No migration is planned or started.",
  },
  {
    status: "experience-specific extension",
    meaning: "A component that carries domain meaning for one experience.",
    whatItImplies: "It legitimately lives outside the shared core.",
    whatItDoesNotImply: "It is not a lesser component and not a candidate for forced sharing.",
  },
];

export interface TemplateStep {
  order: number;
  heading: string;
  question: string;
  source: string;
}

export const DOCUMENTATION_TEMPLATE: TemplateStep[] = [
  {
    order: 1,
    heading: "What it is",
    question: "What does this component do in one sentence?",
    source: "purpose",
  },
  {
    order: 2,
    heading: "Why it exists",
    question: "What problem would recur without it?",
    source: "purpose and observed duplication",
  },
  { order: 3, heading: "Anatomy", question: "Which named parts does it have?", source: "anatomy" },
  {
    order: 4,
    heading: "Properties",
    question: "What can a consumer set, and of what kind?",
    source: "properties",
  },
  {
    order: 5,
    heading: "Variants",
    question: "Which closed appearance and structure sets exist?",
    source: "variants",
  },
  {
    order: 6,
    heading: "States",
    question: "How does it look and behave in each state?",
    source: "states",
  },
  { order: 7, heading: "Sizes", question: "Which size steps are allowed?", source: "sizes" },
  {
    order: 8,
    heading: "Density",
    question: "Does it change with density, and how?",
    source: "density",
  },
  {
    order: 9,
    heading: "Accessibility",
    question: "Keyboard, semantics, naming and state communication.",
    source: "accessibility",
  },
  {
    order: 10,
    heading: "Responsive behavior",
    question: "What changes as the viewport narrows?",
    source: "responsive",
  },
  {
    order: 11,
    heading: "Foundation dependencies",
    question: "Which roles does each part consume?",
    source: "dependencies",
  },
  {
    order: 12,
    heading: "Composition",
    question: "What may it contain, and where may it sit?",
    source: "composition",
  },
  {
    order: 13,
    heading: "Current implementations",
    question: "Where does this live today and who uses it?",
    source: "currentImplementation",
  },
  {
    order: 14,
    heading: "Observed variations",
    question: "How does production differ from itself?",
    source: "observedVariations",
  },
  {
    order: 15,
    heading: "Future canonical target",
    question: "What would a future library define?",
    source: "futureCanonicalTarget",
  },
  {
    order: 16,
    heading: "Figma mapping",
    question: "Which concepts a designer manipulates, and which stay in code.",
    source: "figmaMapping",
  },
  {
    order: 17,
    heading: "Migration notes",
    question: "What would changing this cost?",
    source: "migrationNotes",
  },
  {
    order: 18,
    heading: "Governance status",
    question: "Which maturity category applies?",
    source: "governanceStatus",
  },
];

export interface GovernanceRule {
  rule: string;
  rationale: string;
  label: SpecLabel;
}

export const SPEC_GOVERNANCE_RULES: GovernanceRule[] = [
  {
    rule: "A new component is justified only when the same structure and behavior recur in more than one experience and no existing component can express it through a property.",
    rationale:
      "The inventory already contains several parallel systems; adding more without a test makes it worse.",
    label: "GOVERNANCE RULE",
  },
  {
    rule: "Reuse before extension, extension before creation.",
    rationale: "Keeps the shared surface small and the differences deliberate.",
    label: "GOVERNANCE RULE",
  },
  {
    rule: "A specification never renames, replaces or deprecates a shipping implementation.",
    rationale: "The application is the source of truth for what exists.",
    label: "GOVERNANCE RULE",
  },
  {
    rule: "Duplicates are recorded side by side, in no order, with no winner.",
    rationale: "Choosing between them is a separate approved decision, not a documentation act.",
    label: "GOVERNANCE RULE",
  },
  {
    rule: "Where evidence is insufficient, the entry says FUTURE DECISION rather than choosing a value.",
    rationale: "A guessed value would look like a measurement later.",
    label: "GOVERNANCE RULE",
  },
  {
    rule: "Runtime branding and marketplace asset management stay outside the design system.",
    rationale: "They are operational features with their own owners and their own screens.",
    label: "GOVERNANCE RULE",
  },
  {
    rule: "Changing a foundation role requires checking every component that declares it as a dependency.",
    rationale:
      "The dependency chains exist precisely so that blast radius is visible before a change.",
    label: "GOVERNANCE RULE",
  },
];

export const OPEN_DECISIONS: { decision: string; blockedBy: string }[] = [
  {
    decision: "One control size ladder, or two named by intent.",
    blockedBy: "32 / 36 / 40 / 44px all ship deliberately.",
  },
  { decision: "Canonical card padding.", blockedBy: "p-5 dominates but is not universal." },
  {
    decision: "One focus treatment for the system.",
    blockedBy: "Several ring widths and offsets ship.",
  },
  {
    decision: "Token-based disabled state.",
    blockedBy: "opacity-50 is applied per primitive today.",
  },
  {
    decision: "Disambiguating the Sheet name.",
    blockedBy: "The primitive and the product term collide.",
  },
  {
    decision: "Whether ai-elements becomes the shared assistant layer.",
    blockedBy: "Several assistant surfaces exist.",
  },
  {
    decision: "Retiring the unused icon dependency and the compatibility aliases.",
    blockedBy: "Separate approval; nothing is removed here.",
  },
  {
    decision: "A media and image contract.",
    blockedBy: "No image assets or image component ship.",
  },
  { decision: "Date presentation rules.", blockedBy: "Formatting is per screen today." },
];
