/**
 * Phase 8 — content and text behavior rules.
 * DOCUMENTATION ONLY. No production copy or layout is altered.
 */
import type { SpecLabel } from "./component-spec-types";

export interface ContentRule {
  topic: string;
  current: string;
  future: string;
  appliesTo: string;
  label: SpecLabel;
}

export const CONTENT_RULES: ContentRule[] = [
  {
    topic: "Long labels",
    current:
      "Plan names, carriers and identifiers can exceed their column; OverflowText handles the worst cases.",
    future: "Every component states whether its label truncates, wraps or grows.",
    appliesTo: "Actions, data rows, cards",
    label: "OBSERVED VARIATION",
  },
  {
    topic: "Truncation",
    current: "Single-line truncation with a reveal on demand in cart and plan surfaces.",
    future: "Truncated text always exposes the full value to both pointer and keyboard users.",
    appliesTo: "Tables, cards, list items",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Wrapping",
    current: "Headings wrap; badges and action labels do not.",
    future: "Wrapping is a declared property of each anatomy part, not an accident of width.",
    appliesTo: "All text-bearing parts",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "Overflow",
    current: "Tables scroll horizontally on narrow viewports.",
    future: "A component declares whether it scrolls, wraps or collapses under pressure.",
    appliesTo: "Data, navigation",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Localization",
    current: "English and Spanish strings ship for the governed surfaces.",
    future: "Components reserve room for longer translations; layouts never assume English length.",
    appliesTo: "Everything",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Bilingual text",
    current: "Language switching preserves state and meaning.",
    future: "Reading-order slot names keep leading and trailing correct across languages.",
    appliesTo: "Actions, navigation, fields",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Numeric values",
    current: "Premiums use $#,##0.00; counts are shown beside filters.",
    future: "Numeric-heavy columns use tabular figures so digits align.",
    appliesTo: "Commerce, data, KPI",
    label: "OBSERVED VARIATION",
  },
  {
    topic: "Dates",
    current: "Dates are formatted per screen.",
    future:
      "One date presentation per context: absolute for records, relative only where recency matters.",
    appliesTo: "Data, feedback",
    label: "FUTURE DECISION",
  },
  {
    topic: "Currency",
    current: "Currency symbol and precision are applied at the call site.",
    future: "An amount component owns symbol, precision and locale.",
    appliesTo: "Commerce",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "Empty content",
    current: "EmptyState explains the emptiness and offers a next step.",
    future: "Every collection component declares its empty presentation.",
    appliesTo: "Data, commerce",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    topic: "Missing content",
    current: "Missing values appear as blank cells in places.",
    future:
      "A missing value is stated explicitly rather than left blank, so absent and empty are distinguishable.",
    appliesTo: "Data, profiles",
    label: "FUTURE OPPORTUNITY",
  },
  {
    topic: "Loading content",
    current: "Skeletons and spinners are composed per screen.",
    future: "Loading preserves layout dimensions so content does not jump on arrival.",
    appliesTo: "Everything that fetches",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "Error content",
    current: "Errors are surfaced inline and through toasts.",
    future: "An error states what failed, what it blocks and what the reader can do next.",
    appliesTo: "Feedback, data, forms",
    label: "GOVERNANCE RULE",
  },
];
