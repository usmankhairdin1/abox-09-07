/**
 * Phase 8 — composition and relationship rules.
 * DOCUMENTATION ONLY. An observed composition is not automatically canonical.
 */
import type { SpecLabel } from "./component-spec-types";

export interface CompositionRule {
  parent: string;
  child: string;
  rule: string;
  current: string;
  label: SpecLabel;
}

export const COMPOSITION_RULES: CompositionRule[] = [
  {
    parent: "Card",
    child: "Button / ActionPill",
    rule: "Card actions live in the header or the footer, never both, and never inside the body text.",
    current:
      "Dashboard and marketplace cards place actions in both positions depending on the screen.",
    label: "OBSERVED VARIATION",
  },
  {
    parent: "FormField",
    child: "Input / Select / Checkbox / Switch",
    rule: "Exactly one control per field, with the label, helper and error wired to it.",
    current: "form.tsx implements this; several screens compose a bare Label and Input instead.",
    label: "OBSERVED VARIATION",
  },
  {
    parent: "DataTable",
    child: "TableToolbar / Pagination / EmptyState",
    rule: "A table declares a toolbar region above and a pagination region below, and always supplies an empty state.",
    current: "DataTable owns the empty state; toolbars and pagination are composed per screen.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    parent: "PageHeader",
    child: "Button / ActionPill",
    rule: "At most one primary action; the rest are secondary or move into a menu.",
    current: "Observed consistently across internal screens.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    parent: "Dialog",
    child: "Header / Body / Footer",
    rule: "A dialog always has a title; the confirming action is last in reading order in the footer.",
    current: "Radix-based dialogs follow this today.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    parent: "FilterBar",
    child: "FilterControl",
    rule: "Filters state their counts, persist their selection and expose a reset.",
    current: "Plan filters implement counts, persistence and reset; dashboard filters vary.",
    label: "OBSERVED VARIATION",
  },
  {
    parent: "Data row",
    child: "StatusBadge",
    rule: "A status badge carries words, so a row is readable without color.",
    current: "Observed consistently across the 89 StatusBadge consumers.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    parent: "Comparison layout",
    child: "PlanCard",
    rule: "Compared items use identical anatomy so rows align across columns.",
    current: "The compare route composes its own markup rather than reusing the plan card.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    parent: "Shell",
    child: "PageHeader",
    rule: "A screen supplies one page header; the shell owns navigation and the content offset.",
    current: "Observed across InternalShell and MarketplaceShell screens.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    parent: "EmptyState",
    child: "Button / ActionPill",
    rule: "An empty state offers at most one recovery action.",
    current: "Observed across the 10 EmptyState consumers.",
    label: "CURRENT IMPLEMENTATION",
  },
];

export interface SpatialRule {
  relationship: string;
  observed: string;
  future: string;
  label: SpecLabel;
}

export const RELATIONSHIP_RULES: SpatialRule[] = [
  {
    relationship: "Page edge → content",
    observed: "88rem centred container on web-experience routes; shells set their own offsets.",
    future: "Container width becomes a named option per experience.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Header → content",
    observed:
      "Content begins below the header with a deliberate offset; member settings added extra top spacing.",
    future: "One header-to-content offset per shell.",
    label: "OBSERVED VARIATION",
  },
  {
    relationship: "Section → section",
    observed: "Large vertical rhythm between sections on web pages, tighter in dashboards.",
    future: "Two documented rhythms rather than per-screen values.",
    label: "OBSERVED VARIATION",
  },
  {
    relationship: "Title → supporting",
    observed: "Small fixed gap under headings.",
    future: "One step from the spacing scale.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Heading → body",
    observed:
      "Heading sizes were reduced across pages while body text stayed; the relationship is now closer.",
    future: "A documented ratio per heading role.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Label → control",
    observed: "Consistent small gap in form primitives.",
    future: "Owned by the canonical field.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Control → helper/error",
    observed: "Helper and error share one region below the control.",
    future: "Reserved space so validation does not shift layout.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    relationship: "Field → field",
    observed: "Vertical field spacing varies between form systems.",
    future: "One field rhythm per density.",
    label: "OBSERVED VARIATION",
  },
  {
    relationship: "Icon → text",
    observed: "gap-2 dominates with 232 gap-1 and some gap-1.5 occurrences.",
    future: "One gap per size step.",
    label: "OBSERVED VARIATION",
  },
  {
    relationship: "Card edge → content",
    observed: "p-5 dominates at 187 occurrences; other paddings coexist.",
    future: "One card padding per density.",
    label: "FUTURE DECISION",
  },
  {
    relationship: "Card title → description",
    observed: "Tight pairing, consistent across card families.",
    future: "Owned by the canonical card.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Content → action",
    observed: "Actions sit after content with a clear separation.",
    future: "One content-to-action step.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Toolbar/filter → results",
    observed: "Plan results use a compact header directly above the grid.",
    future: "One toolbar-to-results step shared by tables and grids.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    relationship: "Table header → body",
    observed: "Hairline separation with cell padding by density.",
    future: "Density-driven rather than per-screen.",
    label: "OBSERVED VARIATION",
  },
  {
    relationship: "Navigation rhythm",
    observed:
      "Each shell sets its own item spacing; member navigation uses 36px circles on a centred arc.",
    future: "Rhythm documented per shell, not unified.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Dialog sections",
    observed: "Header, body and footer separated by the card padding family.",
    future: "Owned by the overlay family.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    relationship: "Grid / column gaps",
    observed: "gap-4 and gap-3 dominate listing grids.",
    future: "Grid gap chosen from the scale by density.",
    label: "CURRENT IMPLEMENTATION",
  },
];
