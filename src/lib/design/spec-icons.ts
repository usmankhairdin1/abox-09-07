/**
 * Phase 8 — icon behavior specification.
 * DOCUMENTATION ONLY. No icon, dependency or usage is changed.
 */
import type { SpecLabel, SpecRule } from "./component-spec-types";

export interface IconRuleSpec {
  topic: string;
  current: string;
  future: string;
  evidence: string;
  label: SpecLabel;
}

export const ICON_BEHAVIOR: IconRuleSpec[] = [
  {
    topic: "Library source",
    current: "lucide-react is the dominant source: imported in 144 files, 149 distinct icons.",
    future: "One primary library remains the default for all core components.",
    evidence: "src/components across routes and components.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Secondary library",
    current: "Tabler is imported exactly once, for IconDental, wrapped by ToothIcon.",
    future: "A single documented exception is acceptable when no equivalent glyph exists.",
    evidence: "src/components/icons.",
    label: "OBSERVED VARIATION",
  },
  {
    topic: "Unused dependency",
    current: "Font Awesome is installed and imported nowhere.",
    future: "Retiring it is a separate decision; nothing is removed in this phase.",
    evidence: "package.json versus zero imports.",
    label: "INSTALLED BUT UNUSED",
  },
  {
    topic: "Sizing syntax",
    current: "Both h-4 w-4 and size-4 appear; they compute identically.",
    future: "One syntax for new code; existing usages are left alone.",
    evidence: "Mixed across abox and route files.",
    label: "OBSERVED VARIATION",
  },
  {
    topic: "Default glyph size",
    current: "16px inside controls; larger sizes appear in empty states and hero plates.",
    future: "Glyph size follows the control's size step rather than being set per call site.",
    evidence: "button.tsx base rule sizes child SVG to 16px.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "Leading and trailing",
    current: "Icons are passed as children in reading order with a gap-2 separation.",
    future: "Named leading and trailing slots so position is explicit and direction-safe.",
    evidence: "Header navigation links, ACTION_PILL call sites.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "Icon-only controls",
    current: "Button exposes icon sizes; accessible naming is the consumer's responsibility.",
    future: "An icon-only control cannot render without an accessible name.",
    evidence: "button.tsx icon variants.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Decorative icons",
    current:
      "The shared icon wrapper sets aria-hidden; inline decorative SVGs exist in decor and auth components.",
    future: "Decorative glyphs are always hidden from assistive technology.",
    evidence: "src/components/icons, src/components/abox/decor.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Alignment and spacing",
    current: "Icons align to the text centre line with gap-2; gap-1.5 also occurs.",
    future: "One icon-to-text gap per size step.",
    evidence: "Measured gap counts in Phase 2.",
    label: "OBSERVED VARIATION",
  },
  {
    topic: "State and loading icons",
    current:
      "Status tones pair with meaning-carrying glyphs; Spinner exists as a separate primitive.",
    future: "A loading action swaps its leading icon for the spinner without changing width.",
    evidence: "spinner.tsx, status-badge.tsx.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "Brand and carrier marks",
    current: "AboxMark, AboxWordmark and CarrierMark are code-drawn, not image files.",
    future: "Brand marks stay components; carrier artwork stays a runtime asset concern.",
    evidence: "src/components/abox/logo.tsx, carrier-mark.tsx.",
    label: "CURRENT IMPLEMENTATION",
  },
];

export const ICON_GOVERNANCE: SpecRule[] = [
  {
    topic: "No normalization",
    current: "Mixed sizing syntax and two libraries ship today.",
    future: "Nothing is migrated, removed or rewritten as a result of this specification.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Figma icon set",
    current: "Icons are imported per file from the library package.",
    future:
      "A Figma icon page mirrors only the glyphs actually used, swapped through instance-swap properties.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
];
