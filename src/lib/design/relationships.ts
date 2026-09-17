/**
 * Relationship audit — the recurring spacing and typography pairings that
 * exist in production today, measured from real call sites.
 *
 * DOCUMENTATION ONLY. Nothing here is normalized: where the implementation
 * varies, the variation is recorded as observed and any tidy-up is listed as
 * a FUTURE OPPORTUNITY in governance.ts.
 *
 * Consumers: `/design-system`, `/design-guide`.
 */
import type { RelationshipGroup } from "./types";

export const SPACING_RELATIONSHIPS: RelationshipGroup[] = [
  {
    id: "page",
    title: "Page level",
    summary: "How a page frames itself: edges, header, and the rhythm between sections.",
    entries: [
      {
        pair: "Page edge → content",
        observed:
          "px-4 md:px-8 inside a centred max-w-[88rem] container (web); px-3 sm:px-4 lg:px-8 inside max-w-[1500px] (internal)",
        source: "web routes, internal-shell.tsx",
        consistency: "consistent",
        note: "Two values by experience, not an inconsistency.",
      },
      {
        pair: "Header → page content",
        observed:
          "Marketplace header is sticky top-4 (top-6 on landing); internal content starts at pt-6 md:pt-8; member content carries its own top offset",
        source: "marketplace-shell.tsx, internal-shell.tsx, member-shell.tsx",
        consistency: "varies",
        note: "Each shell owns its own offset.",
      },
      {
        pair: "Page title block → first content",
        observed: "PageHeader default mb-12 with an mt-10 hairline; compact mb-6 with no hairline",
        source: "page-header.tsx",
        consistency: "consistent",
      },
      {
        pair: "Section → section",
        observed:
          "py-12 between reference sections; landing sections use their own per-section padding",
        source: "route files",
        consistency: "varies",
      },
      {
        pair: "Page title → supporting text",
        observed: "mt-5 text-lg (default), mt-2 text-xs (compact)",
        source: "page-header.tsx",
        consistency: "consistent",
      },
      {
        pair: "Eyebrow → title",
        observed: "mb-3 on the eyebrow paragraph",
        source: "page-header.tsx",
        consistency: "consistent",
      },
      {
        pair: "Title icon → title",
        observed: "gap-4, icon tile 48/56px default, 36px compact",
        source: "page-header.tsx",
        consistency: "consistent",
      },
      {
        pair: "Header actions → title row",
        observed: "Same flex row, justify-between, gap-4; actions cluster at gap-2",
        source: "page-header.tsx",
        consistency: "consistent",
      },
    ],
  },
  {
    id: "cards",
    title: "Cards & panels",
    summary: "The card is the workhorse container; these are its measured internals.",
    entries: [
      {
        pair: "Card edge → card content",
        observed:
          "p-5 is the dominant card padding (178 usages); p-6 on KPI cards and larger plates; p-3/p-4 in dense internal chrome",
        source: "measured across routes and components",
        consistency: "varies",
        note: "Padding tracks density by experience.",
      },
      {
        pair: "Card title → description",
        observed: "mt-1 to mt-2 with text-xs/text-sm muted description",
        source: "route cards, reference cards",
        consistency: "varies",
      },
      {
        pair: "Card content → card action",
        observed: "mt-4 or a justify-between column with the action pinned at the bottom",
        source: "plan-card.tsx, route cards",
        consistency: "varies",
      },
      {
        pair: "Card surface",
        observed:
          "rounded-2xl border border-hairline bg-card, boxShadow var(--shadow-card) where elevated",
        source: "kpi-card.tsx, route cards",
        consistency: "consistent",
      },
      {
        pair: "Card grid gaps",
        observed: "gap-4 for tile grids, gap-6 for feature rows, gap-3 for dense lists",
        source: "route files",
        consistency: "varies",
      },
      {
        pair: "KPI internals",
        observed: "p-6, label as text-eyebrow, 64px icon tile, hover -translate-y-0.5 over 300ms",
        source: "kpi-card.tsx",
        consistency: "consistent",
      },
    ],
  },
  {
    id: "forms",
    title: "Forms & controls",
    summary: "Label above control, helper beneath, validation inline.",
    entries: [
      {
        pair: "Label → control",
        observed: "space-y-2 wrapper (8px)",
        source: "route form blocks, reference pages",
        consistency: "consistent",
      },
      {
        pair: "Control → helper text",
        observed: "text-xs text-muted-foreground on the next line inside the same space-y-2 stack",
        source: "quote.tsx and other forms",
        consistency: "consistent",
      },
      {
        pair: "Control → validation message",
        observed:
          "text-xs text-destructive for errors, text-xs text-sage for success, same stack position as helper text",
        source: "route forms",
        consistency: "consistent",
      },
      {
        pair: "Field → field",
        observed: "grid gap-5 in two-column forms; space-y-4/space-y-5 in single-column stacks",
        source: "route forms",
        consistency: "varies",
      },
      {
        pair: "Form section → form section",
        observed: "space-y-6 or a divider-warm hairline with pt-4",
        source: "quote.tsx",
        consistency: "varies",
      },
      {
        pair: "Control height",
        observed:
          "h-9 primitives, h-10 action pills, h-11 primary CTAs, h-8 dense internal controls",
        source: "button.tsx, action-pill.ts, routes",
        consistency: "varies",
        note: "Height signals prominence and experience density.",
      },
    ],
  },
  {
    id: "inline",
    title: "Inline & icon relationships",
    summary: "How icons, labels and text sit together inside a single line.",
    entries: [
      {
        pair: "Icon → text (chips, badges)",
        observed: "gap-1.5 (127 usages)",
        source: "status-badge.tsx, pills, nav links",
        consistency: "consistent",
      },
      {
        pair: "Button icon → button text",
        observed: "gap-2, icon forced to 16px by [&_svg]:size-4",
        source: "src/components/ui/button.tsx",
        consistency: "consistent",
      },
      {
        pair: "Icon → heading",
        observed: "gap-3 with a bordered icon tile in section headers; gap-4 in PageHeader",
        source: "route sections, page-header.tsx",
        consistency: "varies",
      },
      {
        pair: "Badge → badge",
        observed: "gap-2 in badge rows",
        source: "plan-card.tsx, filter rail",
        consistency: "consistent",
      },
      {
        pair: "Status dot → label",
        observed: "1.5 × 1.5 (6px) dot at gap-1.5 inside the badge",
        source: "status-badge.tsx",
        consistency: "consistent",
      },
    ],
  },
  {
    id: "data",
    title: "Tables, lists & results",
    summary: "Data presentation rhythm, as implemented by DataTable and the result pages.",
    entries: [
      {
        pair: "Table header → body",
        observed: "thead carries a border-b hairline; cells are px-5 py-4 in both header and body",
        source: "data-table.tsx",
        consistency: "consistent",
      },
      {
        pair: "Row → row",
        observed: "border-b border-hairline/60, last:border-0, hover:bg-panel/40",
        source: "data-table.tsx",
        consistency: "consistent",
      },
      {
        pair: "Table empty row",
        observed: "px-5 py-10 centred muted text",
        source: "data-table.tsx",
        consistency: "consistent",
      },
      {
        pair: "Toolbar → results",
        observed:
          "The results grid follows the controls row in the same vertical stack, typically at mt-4/mt-6",
        source: "plans.index.tsx",
        consistency: "varies",
      },
      {
        pair: "Filters → results",
        observed:
          "Two-column layout with the filter rail beside the results; drawer on small screens",
        source: "plans.index.tsx",
        consistency: "consistent",
      },
      {
        pair: "List item → list item",
        observed: "space-y-2 with mt-3 from the preceding heading",
        source: "quote.tsx summary lists",
        consistency: "consistent",
      },
      {
        pair: "Empty state internals",
        observed:
          "px-6 py-14, gap-4, dashed border-strong, 48px icon tile, text-display text-2xl title, max-w-md body",
        source: "empty-state.tsx",
        consistency: "consistent",
      },
    ],
  },
  {
    id: "navigation-overlays",
    title: "Navigation & overlays",
    summary: "Chrome rhythm in shells, dialogs and drawers.",
    entries: [
      {
        pair: "Nav item → nav item",
        observed: "gap-1.5 to gap-2 in the marketplace header; gap-2 stacked in the internal rail",
        source: "marketplace-shell.tsx, internal-shell.tsx",
        consistency: "consistent",
      },
      {
        pair: "Nav item internals",
        observed: "rounded-full px-3/px-4 py-2 text-sm, min-h-10 on interactive items",
        source: "marketplace-shell.tsx",
        consistency: "consistent",
      },
      {
        pair: "Rail group → group",
        observed:
          "A centred 1px hairline (mx-auto h-px w-5) separates collapsed groups; my-1 hairline when expanded",
        source: "internal-shell.tsx",
        consistency: "consistent",
      },
      {
        pair: "Dialog sections",
        observed:
          "DialogHeader stacks title and description; content padding comes from the primitive",
        source: "src/components/ui/dialog.tsx",
        consistency: "consistent",
      },
      {
        pair: "Drawer sections",
        observed: "DrawerHeader title + description, body below; shadow-drawer on the panel",
        source: "src/components/ui/drawer.tsx",
        consistency: "consistent",
      },
      {
        pair: "Overlay actions",
        observed: "Actions right-aligned in a flex row at gap-2",
        source: "dialog call sites",
        consistency: "consistent",
      },
    ],
  },
];

export const TYPOGRAPHY_RELATIONSHIPS: RelationshipGroup[] = [
  {
    id: "type-pairs",
    title: "Typographic pairings",
    summary: "Which size and colour follows which, as implemented.",
    entries: [
      {
        pair: "Page title → supporting text",
        observed:
          "text-display text-3xl md:text-4xl → text-lg text-muted-foreground (compact: text-xl md:text-2xl → text-xs)",
        source: "page-header.tsx",
        consistency: "consistent",
      },
      {
        pair: "Section heading → body",
        observed: "text-base/text-xl font-semibold → text-sm text-muted-foreground",
        source: "route sections",
        consistency: "varies",
        note: "Section heading size differs between internal routes; no shared SectionHeading component exists.",
      },
      {
        pair: "Card title → description",
        observed: "text-sm/text-base font-semibold → text-xs text-muted-foreground",
        source: "route cards",
        consistency: "varies",
      },
      {
        pair: "Label → control",
        observed: "text-xs/text-sm font-medium label above the control",
        source: "label.tsx call sites",
        consistency: "consistent",
      },
      {
        pair: "Title → metadata",
        observed:
          "Title in text-sm/base semibold, metadata in .text-serial (10px uppercase tabular)",
        source: "plan-card.tsx, data-table.tsx",
        consistency: "consistent",
      },
      {
        pair: "Numeric value → label",
        observed: "Large tabular-nums semibold value with .text-eyebrow label above it",
        source: "kpi-card.tsx",
        consistency: "consistent",
      },
      {
        pair: "Button typography",
        observed: "text-sm font-medium on primitives; text-sm font-semibold on action pills",
        source: "button.tsx, action-pill.ts",
        consistency: "varies",
        note: "Intentional: pills read as marketing-weight actions.",
      },
      {
        pair: "Navigation typography",
        observed: "text-sm font-medium (nav links) and font-semibold (active/product links)",
        source: "marketplace-shell.tsx",
        consistency: "consistent",
      },
      {
        pair: "Table header typography",
        observed: "text-[10px] font-semibold uppercase tracking-[0.18em] muted",
        source: "data-table.tsx",
        consistency: "consistent",
      },
      {
        pair: "Badge typography",
        observed: "text-[10px] font-semibold uppercase tracking-[0.12em]",
        source: "status-badge.tsx",
        consistency: "consistent",
      },
      {
        pair: "Helper / error / success",
        observed: "text-xs muted / text-xs text-destructive / text-xs text-sage",
        source: "route forms",
        consistency: "consistent",
      },
    ],
  },
];
