/**
 * Phase 8 — the single assembly point for the canonical component specification.
 *
 * DOCUMENTATION ONLY. The reference pages read from here; no specification is
 * restated inline in a route or in the reference kit.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup, SpecLabel } from "./component-spec-types";
import { ACTION_SPECS } from "./spec-components-actions";
import { FORM_SPECS } from "./spec-components-forms";
import { DISPLAY_SPECS } from "./spec-components-display";
import { CONTAINER_SPECS } from "./spec-components-containers";
import { DATA_SPECS } from "./spec-components-data";
import { NAVIGATION_SPECS } from "./spec-components-navigation";
import { OVERLAY_SPECS } from "./spec-components-overlays";
import { FEEDBACK_SPECS } from "./spec-components-feedback";
import { BRAND_SPECS } from "./spec-components-brand";
import { COMMERCE_SPECS } from "./spec-components-commerce";
import { SHELL_SPECS } from "./spec-components-shell";

export const SPEC_REGISTRY: SpecCategoryGroup[] = [
  ACTION_SPECS,
  FORM_SPECS,
  DISPLAY_SPECS,
  CONTAINER_SPECS,
  DATA_SPECS,
  NAVIGATION_SPECS,
  OVERLAY_SPECS,
  FEEDBACK_SPECS,
  BRAND_SPECS,
  COMMERCE_SPECS,
  SHELL_SPECS,
];

export const ALL_SPECS: CanonicalComponentSpec[] = SPEC_REGISTRY.flatMap((g) => g.specs);

function countBy(predicate: (s: CanonicalComponentSpec) => boolean) {
  return ALL_SPECS.filter(predicate).length;
}

export const SPEC_SUMMARY = {
  categories: SPEC_REGISTRY.length,
  components: ALL_SPECS.length,
  withCurrentImplementation: countBy((s) => s.currentImplementation.length > 0),
  withoutEvidence: countBy((s) => s.currentImplementation.length === 0),
  openDecisions: countBy((s) => s.governanceStatus === "future decision"),
  unownedAreas: countBy((s) => s.label === "UNOWNED AREA"),
  duplicatesOrOverlaps: countBy(
    (s) => s.label === "OBSERVED DUPLICATE" || s.label === "OBSERVED OVERLAP",
  ),
  experienceExtensions: countBy((s) => s.governanceStatus === "experience-specific extension"),
};

/** Distribution of the controlled vocabulary across the registry. */
export const SPEC_LABEL_COUNTS: { label: SpecLabel; count: number }[] = Array.from(
  ALL_SPECS.reduce((acc, s) => {
    acc.set(s.label, (acc.get(s.label) ?? 0) + 1);
    return acc;
  }, new Map<SpecLabel, number>()),
)
  .map(([label, count]) => ({ label, count }))
  .sort((a, b) => b.count - a.count);
