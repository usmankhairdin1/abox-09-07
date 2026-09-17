/**
 * Phase 7 — typography foundation specification.
 * DOCUMENTATION ONLY. Built on the Phase 3 audit plus direct reads of
 * `src/styles.css`. No production text is retyped or restyled.
 */
import type { BlueprintRow } from "./types";

const P3 = "Phase 3 — typography" as const;

export const TYPE_FAMILY_SPEC: BlueprintRow[] = [
  {
    item: "Inter Tight — --font-sans",
    source: "src/styles.css @theme inline; loaded via <link> in src/routes/__root.tsx",
    current:
      "Body family for the whole product, with fallbacks ui-sans-serif, system-ui, -apple-system, Segoe UI. Body sets font-feature-settings ss01 and cv11.",
    future: "Text family variable Font / Sans, mapped to every non-display Figma text style.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "Bricolage Grotesque — --font-display",
    source: "src/styles.css; applied to h1, h2, h3 and .font-display",
    current:
      "Display family at weight 600, letter-spacing -0.028em, font-variation-settings wdth 102 and opsz 32. 194 text-display occurrences.",
    future: "Font / Display, with the variation settings recorded as style metadata.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
    note: "Variable-font axis settings cannot be expressed as Figma variables; they belong in the text style.",
  },
  {
    item: "--font-serif alias",
    source: "src/styles.css @theme inline",
    current:
      "Declared as Bricolage Grotesque then Inter Tight — it resolves to the display family, not to a serif.",
    future:
      "FUTURE DECISION — keep as a documented compatibility alias or retire it. The name does not describe the value.",
    label: "OBSERVED OVERLAP",
    phase: P3,
  },
  {
    item: "--font-mono alias",
    source: "src/styles.css @theme inline",
    current:
      "Declared as Inter Tight with sans fallbacks — there is no monospaced font behind it. Consumed by text-eyebrow (225 uses) and text-serial (16 uses).",
    future:
      "FUTURE DECISION — either load a real mono family or rename the utilities so they stop implying one.",
    label: "OBSERVED OVERLAP",
    phase: P3,
  },
  {
    item: "JetBrains Mono",
    source: "Font link in the root route",
    current: "Loaded but no production rule or class references it.",
    future: "Either adopt it behind --font-mono or stop loading it. Not changed in this phase.",
    label: "INSTALLED BUT UNUSED",
    phase: P3,
  },
];

export const TYPE_WEIGHT_SPEC: BlueprintRow[] = [
  {
    item: "font-medium (500)",
    source: "Throughout components and routes",
    current: "406 occurrences — the default emphasis weight for labels, table cells and buttons.",
    future: "Weight token Weight / Medium, referenced by the label, action and table roles.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "font-semibold (600)",
    source: "Headings, card titles, badge text",
    current:
      "Used for component titles and for all headings, since h1–h3 set weight 600 in the base layer.",
    future:
      "Weight / Semibold, referenced by display, page title, section title and component title.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "font-normal (400)",
    source: "Body copy default",
    current: "Implicit default; rarely written explicitly.",
    future: "Weight / Regular for body and supporting roles.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "font-bold (700)",
    source: "Occasional numeric emphasis",
    current: "Used sparingly; no systematic role.",
    future: "FUTURE DECISION — whether a bold step belongs in the canonical scale at all.",
    label: "FUTURE DECISION",
    phase: P3,
  },
];

export const TYPE_SIZE_SPEC: BlueprintRow[] = [
  {
    item: "text-sm (14px)",
    source: "Everywhere",
    current: "779 occurrences — the effective body size of the product, not a small variant.",
    future: "Body / Default at 14px. The canonical scale must name 14px as body, not as small.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "text-xs (12px)",
    source: "Supporting text, table meta, helper copy",
    current: "Widely used for secondary information beneath a body line.",
    future: "Supporting / Small at 12px.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "text-base (16px)",
    source: "Card titles, input at mobile",
    current:
      "Input renders at text-base then drops to text-sm from md upward, which prevents iOS zoom on focus.",
    future: "Body / Large at 16px, with the control-specific responsive step recorded.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "text-lg / text-xl / text-2xl / text-3xl / text-4xl",
    source: "Page headers, section titles, hero",
    current:
      "Heading sizes were reduced across web pages on request; hero and page titles now step down at smaller viewports.",
    future: "Display, Page title, Section title roles with defined responsive steps.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "text-[10px] and text-[11px]",
    source: "StatusBadge, text-serial, text-eyebrow, table heads",
    current:
      "Arbitrary values below the Tailwind scale carry the uppercase micro-label register. text-eyebrow fixes 0.6875rem; text-serial fixes 0.625rem.",
    future: "Micro / Label and Micro / Serial as named steps so the arbitrary values disappear.",
    label: "OBSERVED VARIATION",
    phase: P3,
  },
];

export const TYPE_RHYTHM_SPEC: BlueprintRow[] = [
  {
    item: "Display line height",
    source: "@utility text-display",
    current: "line-height 1.02 with letter-spacing -0.032em and opsz 48.",
    future: "Display text style with the same metrics.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "Heading tracking",
    source: "base layer h1, h2, h3",
    current: "letter-spacing -0.028em, weight 600, wdth 102, opsz 32.",
    future: "One heading text style family sharing the tracking value.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "Body line height",
    source: "Tailwind defaults",
    current: "Inherited from the utility scale; no project-level override exists.",
    future: "Explicit body line height in the canonical scale.",
    label: "FUTURE DECISION",
    phase: P3,
    note: "There is no production evidence of an intended body line-height value.",
  },
  {
    item: "Uppercase tracking values",
    source: "StatusBadge, MetaChip, table heads, eyebrow, serial",
    current:
      "Five tracking values appear with uppercase micro labels, including 0.12em, 0.18em and the 0 set by the eyebrow and serial utilities.",
    future: "Two named tracking steps — label and heading — with the rest recorded as variation.",
    label: "OBSERVED VARIATION",
    phase: P3,
  },
  {
    item: "Tabular numerals",
    source: "text-serial utility and 85 tabular-nums occurrences",
    current: "Numeric columns, premiums and identifiers use tabular figures.",
    future: "A numeric text style with tabular figures switched on by default.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: ".story-link",
    source: "Referenced 89 times; no definition found in src/styles.css",
    current: "A class name used widely with no rule behind it, so it renders nothing.",
    future: "FUTURE DECISION — define it or remove the references. Neither is done here.",
    label: "OBSERVED VARIATION",
    phase: P3,
  },
];

export const TYPE_ROLE_SPEC: BlueprintRow[] = [
  {
    item: "Display",
    source: "@utility text-display, hero and reference headers",
    current: "Bricolage 600, tracking -0.032em, line height 1.02, size set at the call site.",
    future: "Text style Display / L, M, S with the size step baked into each.",
    label: "FUTURE CANONICAL TARGET",
    phase: P3,
  },
  {
    item: "Page title",
    source: "PageHeader (25 consumers)",
    current: "Display family at a page-level size; the compact header variant uses a smaller step.",
    future: "Text style Page title, with a compact variant.",
    label: "FUTURE CANONICAL TARGET",
    phase: P3,
  },
  {
    item: "Section title",
    source: "RefSection and route section headings",
    current: "h2 at text-2xl, stepping to text-3xl from md.",
    future: "Text style Section title with a responsive step recorded as metadata.",
    label: "FUTURE CANONICAL TARGET",
    phase: P3,
  },
  {
    item: "Component title",
    source: "Card headers, KpiCard, PlanCard",
    current: "text-base or text-sm at font-semibold.",
    future: "Text style Component title.",
    label: "OBSERVED VARIATION",
    phase: P3,
    note: "Two sizes are in use for the same role.",
  },
  {
    item: "Body",
    source: "Product-wide",
    current: "text-sm at regular weight.",
    future: "Text style Body.",
    label: "FUTURE CANONICAL TARGET",
    phase: P3,
  },
  {
    item: "Supporting text",
    source: "Descriptions under titles",
    current: "text-sm or text-xs in muted-foreground.",
    future: "Text style Supporting, bound to the content/secondary colour role.",
    label: "OBSERVED VARIATION",
    phase: P3,
  },
  {
    item: "Label",
    source: "Label primitive, form fields",
    current: "text-sm font-medium.",
    future: "Text style Label.",
    label: "FUTURE CANONICAL TARGET",
    phase: P3,
  },
  {
    item: "Eyebrow",
    source: "@utility text-eyebrow, 225 occurrences",
    current: "0.6875rem, weight 500, uppercase, muted foreground.",
    future: "Text style Eyebrow — one of the most consistent roles in the product.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "Caption",
    source: "Small notes beneath content",
    current: "text-xs muted; no dedicated utility.",
    future: "Text style Caption.",
    label: "FUTURE DECISION",
    phase: P3,
    note: "Caption and supporting text are not currently distinguishable in code.",
  },
  {
    item: "Metadata / serial",
    source: "@utility text-serial, 16 occurrences",
    current: "0.625rem, uppercase, tabular, muted — used for file paths and identifiers.",
    future: "Text style Serial.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "Table text",
    source: "DataTable (20 consumers)",
    current: "text-sm cells with a 10px uppercase head row.",
    future: "Text styles Table / Cell and Table / Head.",
    label: "FUTURE CANONICAL TARGET",
    phase: P3,
  },
  {
    item: "KPI / numeric",
    source: "KpiCard (18 consumers), premium formatting",
    current: "Large display-family numerals with tabular figures; premiums format as $#,##0.00.",
    future: "Text style Numeric / KPI.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "Action text",
    source: "Button cva, ACTION_PILL",
    current: "text-sm font-medium; the sm size drops to text-xs.",
    future: "Text style Action, with a small step.",
    label: "FUTURE CANONICAL TARGET",
    phase: P3,
  },
];

export const RESPONSIVE_TYPE_SPEC: BlueprintRow[] = [
  {
    item: "Heading step-down",
    source: "Landing, operations, quote, support, error pages",
    current:
      "Headings render one step smaller at the base width and step up at md — for example text-2xl md:text-3xl.",
    future: "Two-step responsive text styles: base and md-and-up.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    item: "Input font size",
    source: "src/components/ui/input.tsx",
    current: "text-base at base width, md:text-sm above it.",
    future: "Recorded as a deliberate control rule, not as an inconsistency.",
    label: "GOVERNANCE RULE",
    phase: P3,
  },
  {
    item: "Supporting text does not scale",
    source: "Landing and marketing sections",
    current: "Paragraph sizes stay fixed while headings scale, which was the requested behaviour.",
    future: "Record body as size-stable across breakpoints.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "Long text overflow",
    source: "src/components/abox/overflow-text.tsx",
    current:
      "OverflowText truncates long plan names, carriers and identifiers and reveals the full value on hover.",
    future: "A truncation rule attached to the table and card title roles.",
    label: "CURRENT IMPLEMENTATION",
    phase: P3,
  },
  {
    item: "Measure / line length",
    source: "max-w-3xl on intros and descriptions",
    current: "Reading width is limited by container utilities at the call site, not by a token.",
    future: "A measure value in the canonical spec, expressed as a number variable.",
    label: "FUTURE OPPORTUNITY",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    item: "Bilingual text length",
    source: "English and Spanish strings",
    current:
      "Spanish strings run longer; components rely on wrapping and truncation rather than fixed widths.",
    future: "A stated rule that no type role may assume an English string length.",
    label: "GOVERNANCE RULE",
    phase: P3,
  },
];
