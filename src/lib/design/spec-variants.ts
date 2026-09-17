/**
 * Phase 8 — variant governance for future ABox Core components.
 * DOCUMENTATION ONLY. No production variant is added, removed or renamed.
 */
import type { SpecLabel, SpecRule, VariantKind } from "./component-spec-types";

export interface VariantKindSpec {
  kind: VariantKind;
  definition: string;
  currentEvidence: string;
  futureRule: string;
  label: SpecLabel;
}

export const VARIANT_KINDS: VariantKindSpec[] = [
  {
    kind: "semantic",
    definition: "Carries meaning: success, warning, danger, info, neutral.",
    currentEvidence:
      "StatusBadge tones and Alert variants express meaning; MetalBadge tiers express product meaning.",
    futureRule:
      "One semantic vocabulary shared across badges, alerts and inline validation. Meaning never depends on a raw color.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    kind: "visual",
    definition: "Appearance only, no change in meaning: solid, outline, ghost, link.",
    currentEvidence: "Button variants default, destructive, outline, secondary, ghost, link.",
    futureRule:
      "Visual variants stay a closed set. destructive is an exception — it is visual and semantic at once and must stay documented as such.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    kind: "size",
    definition: "Control height and padding step.",
    currentEvidence: "Button sm h-8, default h-9, lg h-10, icon; ACTION_PILL xs h-8 to lg h-11.",
    futureRule:
      "A single size ladder is desirable but not yet derivable — see FUTURE DECISION below.",
    label: "OBSERVED VARIATION",
  },
  {
    kind: "density",
    definition: "Spacing rhythm inside repeating content, independent of control size.",
    currentEvidence: "Tables and filter lists use different paddings per screen; no prop exists.",
    futureRule:
      "Density becomes an explicit variant on data components only, not on every component.",
    label: "FUTURE DECISION",
  },
  {
    kind: "structural",
    definition: "Changes which anatomy parts render, not only how they look.",
    currentEvidence:
      "PlanCard has a compact tile form and a fuller detail form; PageHeader has a compact results form.",
    futureRule:
      "Structural variants are named after the structure, not the screen, and list the parts they add or drop.",
    label: "FUTURE CANONICAL TARGET",
  },
];

export const VARIANT_GOVERNANCE: SpecRule[] = [
  {
    topic: "Promotion of an observed variation",
    current: "Many appearance differences exist as inline class overrides in screens.",
    future:
      "A variation becomes a canonical variant only when it recurs across more than one experience and carries a stable intent. Otherwise it stays OBSERVED VARIATION.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "No winner selection",
    current: "Button, ACTION_PILL and route-local action helpers coexist.",
    future:
      "The canonical model describes one future action surface. It does not declare any current implementation correct, preferred or deprecated.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Variant count",
    current: "Button carries six visual variants; StatusBadge carries a broader tone set.",
    future:
      "New variants require a documented need; appearance tweaks belong to the consumer, not the library.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Unified size ladder",
    current:
      "36px, 40px and primitive h-9 controls all exist and are all intentional in their contexts.",
    future: "Not resolvable from evidence. Left open.",
    label: "FUTURE DECISION",
  },
  {
    topic: "Tier variants",
    current:
      "Metal tiers including Expanded Bronze are solid tokenised badges used in tiles and filters.",
    future:
      "Tiers stay a commerce-domain variant set, never folded into the generic semantic vocabulary.",
    label: "GOVERNANCE RULE",
  },
];
