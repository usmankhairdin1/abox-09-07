/**
 * Phase 7 — accessibility as a foundation concern.
 * Observations only. No contrast value, focus ring or target size is changed.
 */
import type { FoundationA11yRecord } from "./types";

export const FOUNDATION_ACCESSIBILITY: FoundationA11yRecord[] = [
  {
    topic: "Foreground pairing",
    current:
      "Every surface token ships with a paired foreground: --background/--foreground, --card/--card-foreground, --primary/--primary-foreground, --muted/--muted-foreground, and each metal tier with its own -fg.",
    requirement:
      "A colour token may only enter the canonical layer with a declared foreground partner.",
    consumers: "All surfaces and every badge",
    status: "CURRENT IMPLEMENTATION",
    note: "This pairing discipline is the strongest accessibility property the system already has.",
  },
  {
    topic: "Tier foreground selection",
    current:
      "Metal tier foregrounds are chosen per tier rather than inherited, so light tiers take dark text and dark tiers take light text.",
    requirement: "Tier foregrounds stay explicit and are never derived automatically.",
    consumers: "MetalBadge in plan tiles, filters and cart",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Status tone contrast",
    current:
      "Tone chips mix the tone 88% with the foreground colour for text, which keeps text dark on a 12% tint.",
    requirement:
      "Any future precomputed tone palette must reproduce the same effective contrast.",
    consumers: "StatusBadge across 89 files",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Focus visibility",
    current:
      "69 focus-visible declarations and 68 ring-ring occurrences; primitives use a 1px ring in the ring colour with an offset.",
    requirement:
      "A single focus treatment defined once at foundation level rather than repeated per component.",
    consumers: "Button, Input, Select, links, pills",
    status: "OBSERVED VARIATION",
    note: "Ring width and offset vary slightly between primitives and hand-written call sites.",
  },
  {
    topic: "Focus ring on tinted surfaces",
    current: "The ring colour is a single token used on every background.",
    requirement: "Confirm the ring remains visible on the darkest tier and status surfaces.",
    consumers: "Filter chips, metal badges used as buttons",
    status: "FUTURE DECISION",
  },
  {
    topic: "Touch targets",
    current: "Below 640px, buttons and links are given a 44px minimum height globally.",
    requirement: "A stated foundation guarantee tied to the density scale.",
    consumers: "Every interactive element on mobile",
    status: "CURRENT IMPLEMENTATION",
    note: "Above 640px the 32px dense button sits below 44px. Recorded, not corrected.",
  },
  {
    topic: "Reduced motion",
    current:
      "A prefers-reduced-motion block reduces animation and transition durations to 0.01ms application-wide.",
    requirement: "Every future motion token inherits this guarantee.",
    consumers: "All six keyframes and every transition",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Colour as sole signal",
    current:
      "StatusBadge always pairs its tone with a text label and a dot, so status is never colour alone.",
    requirement: "Status roles must carry a non-colour signal.",
    consumers: "Status surfaces throughout",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Disabled contrast",
    current: "Disabled controls use 50% opacity, which lowers text contrast proportionally.",
    requirement:
      "A future canonical disabled treatment would use dedicated tokens rather than opacity.",
    consumers: "Button, Input and their derivatives",
    status: "FUTURE OPPORTUNITY",
  },
  {
    topic: "Decorative icons",
    current: "Icon wrappers apply aria-hidden; icon-only controls carry accessible names.",
    requirement: "Stated as a foundation rule for the icon layer.",
    consumers: "144 files importing Lucide, the ToothIcon wrapper",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Selection without a visible ring",
    current:
      "Exchange filters intentionally communicate selection through aria-pressed with no visible ring, by explicit request.",
    requirement:
      "Recorded as a deliberate exception, not a defect, so a future normalisation does not reverse it.",
    consumers: "Plan results exchange filter",
    status: "GOVERNANCE RULE",
  },
  {
    topic: "Typography legibility floor",
    current:
      "The smallest recurring size is a 10px uppercase micro label with 0.12em tracking, used in badges and table heads.",
    requirement: "The floor is documented so it is not lowered further.",
    consumers: "StatusBadge, MetalBadge, DataTable heads",
    status: "OBSERVED VARIATION",
  },
  {
    topic: "Bilingual text expansion",
    current:
      "Spanish strings run longer than English; overflow is handled per component with truncation and hover detail.",
    requirement:
      "Type and density tokens must tolerate expansion without a fixed-width assumption.",
    consumers: "Plan tiles, cart rows, navigation",
    status: "CURRENT IMPLEMENTATION",
  },
];
