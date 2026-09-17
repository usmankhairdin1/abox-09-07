/**
 * Phase 11 — conceptual migration-readiness model.
 * DOCUMENTATION ONLY. No stage below has been performed, no first target has
 * been chosen, and nothing is ranked. The model exists so a future approved
 * migration has a shape before it starts.
 */
import type { MigrationStage } from "./canonical-readiness-types";

export const MIGRATION_STAGES: MigrationStage[] = [
  {
    order: 1,
    stage: "Discovery",
    purpose: "Establish what exists, who uses it and what depends on it.",
    entryCondition: "An area appears in the candidate register.",
    evidenceProduced: "Implementations, consumers, dependencies and observed variations.",
    exitCondition: "Every implementation is named with real consumers.",
    approval: "none required",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    order: 2,
    stage: "Decision",
    purpose: "A named person chooses between options that exist in the code.",
    entryCondition: "Discovery complete and a decision record open.",
    evidenceProduced: "A recorded decision with its approver and date.",
    exitCondition: "The decision register entry is no longer open.",
    approval: "design system owner",
    status: "FUTURE DECISION",
  },
  {
    order: 3,
    stage: "Canonical specification",
    purpose:
      "Write the chosen implementation's anatomy, props, variants, states, responsive behaviour and content model.",
    entryCondition: "A decision exists.",
    evidenceProduced: "A specification precise enough to build against.",
    exitCondition: "The specification covers every behaviour the current consumers rely on.",
    approval: "design system owner",
    status: "FUTURE DECISION",
  },
  {
    order: 4,
    stage: "Compatibility design",
    purpose:
      "Decide how existing consumers keep rendering identically while the canonical version arrives.",
    entryCondition: "A specification exists.",
    evidenceProduced: "A compatibility approach and the list of behaviours it must preserve.",
    exitCondition: "Every current rendering is reproducible.",
    approval: "engineering review",
    status: "FUTURE DECISION",
  },
  {
    order: 5,
    stage: "Pilot consumer",
    purpose: "Convert exactly one consumer and prove the output is unchanged.",
    entryCondition: "Compatibility approach agreed.",
    evidenceProduced: "Before and after evidence for one screen at the agreed viewports.",
    exitCondition: "No visual, responsive, accessibility or behavioural difference.",
    approval: "design system owner",
    status: "FUTURE DECISION",
  },
  {
    order: 6,
    stage: "Regression validation",
    purpose: "Prove the regression contract holds for the pilot.",
    entryCondition: "Pilot converted.",
    evidenceProduced: "Screenshot comparison, console check, build and typecheck results.",
    exitCondition: "Every clause of the regression contract is satisfied.",
    approval: "engineering review",
    status: "FUTURE DECISION",
  },
  {
    order: 7,
    stage: "Staged migration",
    purpose: "Convert remaining consumers in reviewable batches.",
    entryCondition: "Pilot validated.",
    evidenceProduced: "Per-batch before and after evidence.",
    exitCondition: "All intended consumers converted, or a batch fails and the stage stops.",
    approval: "design system owner",
    status: "FUTURE DECISION",
  },
  {
    order: 8,
    stage: "Consumer verification",
    purpose: "Confirm every converted consumer still behaves as it did.",
    entryCondition: "Migration batches complete.",
    evidenceProduced: "Route-level verification across the representative screens and viewports.",
    exitCondition: "No behavioural or visual difference anywhere.",
    approval: "product owner",
    status: "FUTURE DECISION",
  },
  {
    order: 9,
    stage: "Cleanup",
    purpose: "Retire the superseded implementation once nothing consumes it.",
    entryCondition: "Verification complete and consumer count for the old implementation is zero.",
    evidenceProduced: "Proof of zero consumers.",
    exitCondition: "The old implementation is removed without any rendered change.",
    approval: "engineering review",
    status: "FUTURE DECISION",
  },
  {
    order: 10,
    stage: "Documentation update",
    purpose: "Bring the reference layer back in line with the new production reality.",
    entryCondition: "Cleanup complete.",
    evidenceProduced: "Updated specification, graph, pattern and readiness records.",
    exitCondition: "The reference layer matches the code again.",
    approval: "design system owner",
    status: "FUTURE DECISION",
  },
];

export const MIGRATION_PRECONDITIONS: string[] = [
  "GOVERNANCE RULE — a migration may not start while its decision record is open.",
  "GOVERNANCE RULE — a migration may not start without a compatibility approach that preserves current rendering.",
  "GOVERNANCE RULE — a migration stops at the first stage whose exit condition fails; it does not continue and correct later.",
  "GOVERNANCE RULE — no target has been chosen and no ordering of targets exists. Choosing a first target is itself a decision.",
  "FUTURE DECISION — no stage above has been performed. Production is untouched.",
];

export const ROLLBACK_MODEL: string[] = [
  "GOVERNANCE RULE — every stage that changes code names its rollback before it begins.",
  "GOVERNANCE RULE — a pilot is chosen because it is reversible, never because it is important.",
  "GOVERNANCE RULE — rollback restores the previous rendering exactly; partial rollback is not an acceptable end state.",
];
