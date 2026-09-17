/**
 * Phase 8 — property model for future ABox Core components.
 * DOCUMENTATION ONLY.
 */
import type { PropertyClass, FigmaPropertyKind, SpecLabel, SpecRule } from "./component-spec-types";

export interface PropertyClassSpec {
  propertyClass: PropertyClass;
  definition: string;
  examples: string;
  figma: FigmaPropertyKind;
  label: SpecLabel;
  note?: string;
}

export const PROPERTY_CLASSES: PropertyClassSpec[] = [
  {
    propertyClass: "content",
    definition: "Text, nodes and slots the consumer supplies.",
    examples: "label, title, description, helper, children, actions",
    figma: "text-property",
    label: "FUTURE CANONICAL TARGET",
    note: "Slot-shaped content maps to instance-swap, plain strings to text properties.",
  },
  {
    propertyClass: "behavioral",
    definition: "What the component does rather than how it looks.",
    examples: "onSelect, asChild, href, type, open/onOpenChange",
    figma: "code-only",
    label: "CURRENT IMPLEMENTATION",
    note: "Radix primitives already own most behavioral props; Figma cannot represent them.",
  },
  {
    propertyClass: "visual-variant",
    definition: "A named appearance drawn from a closed set.",
    examples: "Button variant: default, destructive, outline, secondary, ghost, link",
    figma: "variant-property",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    propertyClass: "size",
    definition: "Control height and internal padding step.",
    examples: "Button sm/default/lg/icon; ACTION_PILL xs/sm/smCard/md/lg",
    figma: "variant-property",
    label: "OBSERVED VARIATION",
    note: "Two independent size scales exist today; see spec-sizing.",
  },
  {
    propertyClass: "density",
    definition: "Vertical rhythm inside repeating structures, independent of size.",
    examples: "Table row padding, filter chip spacing, dashboard card padding",
    figma: "variant-property",
    label: "FUTURE DECISION",
    note: "No production component exposes density as a prop today; it is expressed by class choice.",
  },
  {
    propertyClass: "state",
    definition: "Interaction or validity condition, usually derived rather than passed.",
    examples: "disabled, checked, open, selected, loading, invalid",
    figma: "variant-property",
    label: "CURRENT IMPLEMENTATION",
    note: "Hover and focus-visible are CSS states in code and variant states in Figma.",
  },
  {
    propertyClass: "icon",
    definition: "Presence, identity and position of a glyph.",
    examples: "leadingIcon, trailingIcon, iconOnly",
    figma: "instance-swap",
    label: "FUTURE CANONICAL TARGET",
    note: "Today icons are passed as children, not as props.",
  },
  {
    propertyClass: "responsive",
    definition: "How a component reacts to viewport width.",
    examples: "stack at sm, hide supporting text below md",
    figma: "code-only",
    label: "CURRENT IMPLEMENTATION",
    note: "Figma needs separate frames; responsive behavior cannot be a single property.",
  },
  {
    propertyClass: "accessibility",
    definition: "Explicit accessible naming and relationships.",
    examples: "aria-label for icon-only controls, aria-describedby for helper and error",
    figma: "code-only",
    label: "GOVERNANCE RULE",
  },
  {
    propertyClass: "experience",
    definition: "A property that only one experience needs.",
    examples: "PlanCard exchange status, marketplace product type",
    figma: "component-property",
    label: "FUTURE CANONICAL TARGET",
    note: "Recorded as an experience-specific extension rather than core surface area.",
  },
];

export const PROPERTY_RULES: SpecRule[] = [
  {
    topic: "Boolean proliferation",
    current:
      "Production components mostly use cva variants, not booleans; ACTION_PILL takes a size and tone argument.",
    future:
      "A closed variant set is preferred over several booleans. Booleans are reserved for genuine on/off slots such as iconOnly.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Derived versus passed state",
    current:
      "disabled, checked and open are passed; hover, focus-visible and active are CSS-derived.",
    future: "Keep derived states derived. A future component should not accept a hover prop.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Slots versus props",
    current: "Actions, icons and descriptions are passed as React nodes today.",
    future:
      "Content that can contain markup stays a slot; single strings become text properties so Figma can mirror them.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "Escape hatches",
    current:
      "Every primitive accepts className, which is how most production variation is expressed.",
    future:
      "className remains, but a future canonical component records which overrides are expected rather than incidental.",
    label: "FUTURE OPPORTUNITY",
  },
  {
    topic: "Experience properties",
    current: "PlanCard, KpiCard and marketplace components carry domain properties directly.",
    future:
      "Domain properties stay on experience components; they must not be pushed into ABox Core primitives.",
    label: "GOVERNANCE RULE",
  },
];
