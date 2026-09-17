/**
 * Phase 3 — responsive typography, typography states, text-length behaviour
 * and readability conventions.
 *
 * DOCUMENTATION ONLY. Measured from the shipping implementation; nothing is
 * normalized. Consumers: `/design-system`, `/design-guide`.
 */
import type { DensityEntry, RelationshipGroup, ResponsivePattern } from "./types";

export const RESPONSIVE_TYPOGRAPHY: ResponsivePattern[] = [
  {
    name: "Masthead / hero headline",
    trigger: "md (768px), lg for the hero's largest step",
    desktop: "text-6xl (hero reaches lg:text-7xl) with leading-[0.98]",
    tablet: "text-6xl from 768px",
    mobile: "text-4xl",
    source: "components/abox/internal-shell.tsx, routes/index.tsx",
    consumers: "md:text-6xl 6 uses, lg:text-7xl 1 use",
    variations: "The hero adds an sm:text-5xl intermediate step the masthead does not have.",
  },
  {
    name: "Page title",
    trigger: "md",
    desktop: "text-display text-4xl",
    tablet: "text-4xl from 768px",
    mobile: "text-3xl",
    source: "components/abox/page-header.tsx",
    consumers: "md:text-4xl 7 uses",
    variations: "Compact variant runs text-xl → md:text-2xl instead.",
  },
  {
    name: "Page subtitle",
    trigger: "md",
    desktop: "text-lg text-muted-foreground",
    tablet: "text-lg from 768px",
    mobile: "text-base or text-sm depending on surface",
    source: "page-header.tsx and marketing sections",
    consumers: "md:text-lg 5 uses",
    variations:
      "OBSERVED VARIATION — the compact header drops the subtitle to text-xs with no responsive step.",
  },
  {
    name: "Input font size",
    trigger: "md",
    desktop: "md:text-sm",
    tablet: "md:text-sm from 768px",
    mobile: "text-base (16px) — prevents iOS zoom on focus",
    source: "components/ui/input.tsx",
    consumers: "All inputs",
    variations:
      "CURRENT IMPLEMENTATION — the only place the app uses a larger size on mobile than desktop, and it is deliberate.",
  },
  {
    name: "Body and control text",
    trigger: "none",
    desktop: "text-sm",
    tablet: "text-sm",
    mobile: "text-sm",
    source: "everywhere",
    consumers: "779 uses",
    variations: "Body text does not change size across breakpoints anywhere in the app.",
  },
  {
    name: "Badge and micro type",
    trigger: "none",
    desktop: "text-[10px] uppercase tracking-[0.12em]",
    tablet: "unchanged",
    mobile: "unchanged",
    source: "status-badge.tsx, metal-badge.tsx",
    consumers: "All badges",
    variations: "Micro type never scales — the 10px floor holds on every viewport.",
  },
  {
    name: "Header text visibility",
    trigger: "sm, md, lg, xl",
    desktop: "Brand tagline, search placeholder, ⌘K hint and the $X/mo cart figure all visible",
    tablet: "Search and hint hidden; tagline visible from md",
    mobile: "Icon-only affordances; cart shows the count only",
    source: "marketplace-shell.tsx, internal-shell.tsx",
    consumers: "All shells",
    variations: "Username truncates at max-w-[10ch], widening to sm:max-w-[16ch].",
  },
  {
    name: "Text alignment",
    trigger: "sm, xl",
    desktop: "sm:text-left on dialog headers; xl:text-right on one numeric column",
    tablet: "sm:text-left from 640px",
    mobile: "text-center in dialog headers and empty states",
    source: "components/ui/dialog.tsx, admin tables",
    consumers: "sm:text-left 4 uses, xl:text-right 1 use",
    variations: "Alignment changes are rare and local.",
  },
  {
    name: "Reading width",
    trigger: "content width, not a breakpoint",
    desktop: "max-w-3xl on page descriptions, max-w-md on empty-state bodies",
    tablet: "Same caps apply",
    mobile: "Caps exceed the viewport, so text fills the column",
    source: "page-header.tsx, empty-state.tsx, marketing sections",
    consumers: "max-w-3xl 15 uses, max-w-2xl 14, max-w-md 11",
    variations:
      "No prose or ch-based measure is used except two max-w-[10ch]/[16ch] truncation caps.",
  },
];

export const TYPOGRAPHY_STATES: RelationshipGroup = {
  id: "typography-states",
  title: "Typography states",
  summary:
    "State is carried almost entirely by colour tokens. Weight and size do not change between states anywhere in the application.",
  entries: [
    {
      pair: "Default",
      observed: "text-foreground at text-sm; secondary content uses text-muted-foreground",
      source: "everywhere",
      consistency: "consistent",
    },
    {
      pair: "Hover (link)",
      observed: "text-muted-foreground → hover:text-foreground; some links add hover:underline",
      source: "nav links, footer links, inline links",
      consistency: "varies",
      note: "OBSERVED VARIATION — some hovers change colour only, others add an underline.",
    },
    {
      pair: "Hover (control)",
      observed: "hover:bg-accent with the text colour unchanged",
      source: "action-pill.ts, nav links, dropdown items",
      consistency: "consistent",
    },
    {
      pair: "Focus",
      observed: "focus-visible:ring-1 focus-visible:ring-ring with outline removed; text unchanged",
      source: "components/ui/button.tsx, input.tsx",
      consistency: "consistent",
      note: "Focus never alters typography — only the ring.",
    },
    {
      pair: "Active / selected",
      observed:
        "text-primary or a filled background with the paired foreground token; aria-pressed carries state for ring-less chips",
      source: "nav links, filter chips",
      consistency: "varies",
    },
    {
      pair: "Disabled",
      observed:
        "disabled:opacity-50 with disabled:pointer-events-none and disabled:cursor-not-allowed",
      source: "components/ui/button.tsx, input.tsx",
      consistency: "consistent",
      note: "Opacity, not a separate muted text colour.",
    },
    {
      pair: "Loading",
      observed: "Skeleton blocks replace the text entirely; the label does not change",
      source: "components/ui/skeleton.tsx and call sites",
      consistency: "consistent",
    },
    {
      pair: "Error",
      observed: "text-destructive at text-xs beneath the control; 49 uses of the token overall",
      source: "form markup, Alert destructive variant",
      consistency: "consistent",
    },
    {
      pair: "Success",
      observed: "text-sage (44 uses) or text-success (3 uses) for positive status",
      source: "StatusBadge, KPI deltas",
      consistency: "varies",
      note: "OBSERVED VARIATION — two tokens express success; sage dominates.",
    },
    {
      pair: "Warning",
      observed: "text-warning (19 uses), always paired with words, never colour alone",
      source: "StatusBadge, readiness views",
      consistency: "consistent",
    },
    {
      pair: "Informational",
      observed: "info token used for the on-exchange marker",
      source: "StatusBadge",
      consistency: "consistent",
    },
    {
      pair: "Muted",
      observed:
        "text-muted-foreground — 803 uses, the single most common text colour after the default",
      source: "everywhere",
      consistency: "consistent",
    },
    {
      pair: "Link affordance",
      observed:
        ".ember-underline draws a 2px primary bar on hover/focus (4 uses); .story-link is referenced 89 times but has no definition",
      source: "src/styles.css, call sites",
      consistency: "varies",
      note: "OBSERVED VARIATION — the dominant inline-link class does nothing. Those links rely on text-primary and hover colour for affordance.",
    },
    {
      pair: "Visited links",
      observed: "No visited-state styling anywhere in the codebase",
      source: "n/a",
      consistency: "consistent",
    },
  ],
};

export const TEXT_BEHAVIOR: RelationshipGroup = {
  id: "text-behavior",
  title: "Text length and content behaviour",
  summary:
    "Truncation is the dominant strategy for constrained text, with a tooltip reveal where the full value matters.",
  entries: [
    {
      pair: "Long plan / carrier names",
      observed:
        "OverflowText — truncates with ellipsis and reveals the full value in a tooltip on hover and keyboard focus, re-measuring via ResizeObserver",
      source: "components/abox/overflow-text.tsx",
      consistency: "consistent",
      note: "The only component-owned overflow treatment; no tooltip is produced when the text fits.",
    },
    {
      pair: "Long page titles",
      observed: "min-w-0 max-w-3xl on the title stack; wraps rather than truncates",
      source: "components/abox/page-header.tsx, internal-shell masthead",
      consistency: "consistent",
    },
    {
      pair: "Long navigation labels",
      observed:
        "truncate inside a min-w-0 flex child; username capped at max-w-[10ch] / sm:max-w-[16ch]",
      source: "marketplace-shell.tsx, internal-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "Long identifiers and paths",
      observed: "break-all (9 uses) on serial text and token names",
      source: "reference and admin surfaces",
      consistency: "consistent",
    },
    {
      pair: "Long descriptions",
      observed:
        "line-clamp-1 (3 uses) and line-clamp-2 (2 uses) in dense cards; break-words (4 uses) elsewhere",
      source: "card markup",
      consistency: "varies",
    },
    {
      pair: "Chips and counts",
      observed: "whitespace-nowrap (12 uses) so labels never break mid-chip",
      source: "filter chips, nav items, badges",
      consistency: "consistent",
    },
    {
      pair: "Table values",
      observed: "Cells wrap; the table scrolls horizontally rather than truncating columns",
      source: "components/abox/data-table.tsx",
      consistency: "consistent",
    },
    {
      pair: "Helper and error text",
      observed: "Wraps freely; no clamp or max-width applied",
      source: "form markup",
      consistency: "consistent",
    },
    {
      pair: "Empty-state body",
      observed: "max-w-md centred; wraps",
      source: "components/abox/empty-state.tsx",
      consistency: "consistent",
    },
    {
      pair: "Container height",
      observed:
        "Text containers are content-driven almost everywhere; the only fixed heights are control heights and viewport-capped panels",
      source: "across the app",
      consistency: "consistent",
      note: "CURRENT IMPLEMENTATION — longer text grows its container rather than clipping, which is why truncation is opt-in per element.",
    },
    {
      pair: "Bilingual expansion",
      observed:
        "English and Spanish strings share the same components; Spanish strings are typically longer and rely on the same wrap/truncate behaviour",
      source: "bilingual string tables consumed by governed screens",
      consistency: "mostly consistent" as unknown as "varies",
      note: "No language-specific typography overrides exist.",
    },
  ],
};

export const READABILITY_CONVENTIONS: DensityEntry[] = [
  {
    mode: "Smallest text",
    context: "Badges, table headers, serials and dense chrome",
    controlHeight: "n/a",
    padding: "n/a",
    gap: "n/a",
    typography:
      "10px is the standard micro size; text-[9px] appears once — the smallest text shipped",
    iconSize: "12–16px alongside",
    source: "status-badge.tsx, metal-badge.tsx, .text-serial, one local chip",
    note: "FUTURE OPPORTUNITY — raising the 9px and 10px floors would improve legibility but would change badge sizing everywhere.",
  },
  {
    mode: "Contrast pairing",
    context: "All surfaces",
    controlHeight: "n/a",
    padding: "n/a",
    gap: "n/a",
    typography:
      "Dark background takes a light foreground and vice versa; metal tiers encode this with paired -fg tokens. Text colour is always a token — no literal colours.",
    iconSize: "n/a",
    source: "src/styles.css, metal-badge.tsx",
  },
  {
    mode: "Muted text",
    context: "Secondary content",
    controlHeight: "n/a",
    padding: "n/a",
    gap: "n/a",
    typography:
      "text-muted-foreground, 803 uses — never used for the only copy of critical information",
    iconSize: "n/a",
    source: "everywhere",
  },
  {
    mode: "Status text",
    context: "Badges, readiness, blocking reasons",
    controlHeight: "n/a",
    padding: "n/a",
    gap: "n/a",
    typography: "Always words plus colour, never colour alone",
    iconSize: "12–16px optional glyph",
    source: "status-badge.tsx and governed screens",
  },
  {
    mode: "Screen-reader text",
    context: "Skip links, icon buttons, live regions",
    controlHeight: "44px skip-link target once focused",
    padding: "focus:px-3 focus:py-2",
    gap: "n/a",
    typography:
      "sr-only (22 uses) becomes visible on focus with bg-primary and text-primary-foreground; aria-live used in 3 places",
    iconSize: "n/a",
    source: "all three shells",
  },
  {
    mode: "Mobile touch",
    context: "Every button and link below 640px",
    controlHeight: "min-height: 44px enforced globally in @layer base",
    padding: "unchanged",
    gap: "unchanged",
    typography: "Text size is unchanged; only the hit area grows",
    iconSize: "unchanged",
    source: "src/styles.css @media (max-width: 640px)",
    note: "CURRENT IMPLEMENTATION — a global rule, not a per-component one.",
  },
  {
    mode: "Reduced motion",
    context: "Users with prefers-reduced-motion",
    controlHeight: "n/a",
    padding: "n/a",
    gap: "n/a",
    typography:
      "Animation and transition durations collapse to 0.01ms globally; text entrance animations therefore resolve instantly with no layout or size change",
    iconSize: "n/a",
    source: "src/styles.css @media (prefers-reduced-motion: reduce)",
  },
];

/* ------------------------------------------------------------------
 * Component typography cross-reference.
 * Which typography each existing component applies, as implemented.
 * ------------------------------------------------------------------ */

export const COMPONENT_TYPOGRAPHY: RelationshipGroup = {
  id: "component-typography",
  title: "Component typography cross-reference",
  summary:
    "Typography as applied by each shipping component. No component was altered; this is an inventory.",
  entries: [
    {
      pair: "Button",
      observed: "text-sm font-medium; sm size drops to text-xs; gap-2 to a 16px icon",
      source: "components/ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Action pill",
      observed: "text-sm font-semibold — heavier than the Button primitive",
      source: "components/abox/action-pill.ts",
      consistency: "consistent",
      note: "OBSERVED VARIATION — deliberate marketing weight beside font-medium primitives.",
    },
    {
      pair: "Input / Textarea",
      observed: "text-base md:text-sm with placeholder:text-muted-foreground",
      source: "components/ui/input.tsx, textarea.tsx",
      consistency: "consistent",
    },
    {
      pair: "Label",
      observed: "text-sm font-medium",
      source: "components/ui/label.tsx",
      consistency: "consistent",
    },
    {
      pair: "Select / DropdownMenu",
      observed: "text-sm items; muted section labels",
      source: "components/ui/select.tsx, dropdown-menu.tsx",
      consistency: "consistent",
    },
    {
      pair: "Tabs",
      observed: "text-sm font-medium triggers; active trigger takes the foreground colour",
      source: "components/ui/tabs.tsx",
      consistency: "consistent",
    },
    {
      pair: "Card",
      observed: "Title font-semibold; CardDescription text-sm text-muted-foreground",
      source: "components/ui/card.tsx",
      consistency: "consistent",
      note: "OBSERVED VARIATION — hand-rolled ABox cards use text-xs descriptions instead.",
    },
    {
      pair: "Badge",
      observed: "text-xs font-semibold in the shadcn primitive",
      source: "components/ui/badge.tsx",
      consistency: "consistent",
    },
    {
      pair: "StatusBadge / MetalBadge",
      observed: "text-[10px] font-semibold uppercase tracking-[0.12em]",
      source: "components/abox/status-badge.tsx, metal-badge.tsx",
      consistency: "consistent",
      note: "OBSERVED VARIATION — 10px semibold uppercase here vs text-xs in the shadcn Badge.",
    },
    {
      pair: "Navigation (marketplace)",
      observed:
        "text-sm font-medium pills; brand wordmark text-display text-base with a .text-serial tagline",
      source: "components/abox/marketplace-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "Sidebar (admin rail)",
      observed:
        "text-sm items; text-display text-lg brand; text-xs muted workspace name; section labels use .text-eyebrow",
      source: "components/abox/internal-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "Search",
      observed: "text-sm with placeholder:text-muted-foreground/70 and a 10px ⌘K keycap",
      source: "components/abox/internal-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "Table",
      observed:
        "shadcn head h-10 font-medium text-muted-foreground; ABox DataTable head text-[10px] uppercase tracking-[0.18em]",
      source: "components/ui/table.tsx, components/abox/data-table.tsx",
      consistency: "varies",
    },
    {
      pair: "Tooltip / Popover",
      observed: "text-xs tooltip content; text-sm popover body",
      source: "components/ui/tooltip.tsx, popover.tsx",
      consistency: "consistent",
    },
    {
      pair: "Dialog",
      observed:
        "Title font-semibold; description text-sm text-muted-foreground; header text-center sm:text-left",
      source: "components/ui/dialog.tsx",
      consistency: "consistent",
    },
    {
      pair: "Sheet / drawer",
      observed: "Same title/description treatment as Dialog",
      source: "components/ui/sheet.tsx",
      consistency: "consistent",
    },
    {
      pair: "Alert",
      observed: "Title font-medium with tracking-tight; description text-sm",
      source: "components/ui/alert.tsx",
      consistency: "consistent",
    },
    {
      pair: "Toast (sonner)",
      observed: "text-sm title with a muted description, themed from the same tokens",
      source: "components/ui/sonner.tsx",
      consistency: "consistent",
    },
    {
      pair: "Filters",
      observed: "text-sm chip labels reusing the exact badge treatments from the results list",
      source: "routes/plans.index.tsx",
      consistency: "consistent",
    },
    {
      pair: "PlanCard",
      observed:
        "text-display plan name with leading-tight; text-xs / text-[11px] meta; text-2xl tabular-nums price; .text-serial plan ID; badges at 10px",
      source: "components/abox/plan-card.tsx",
      consistency: "consistent",
    },
    {
      pair: "KpiCard",
      observed:
        ".text-eyebrow label; text-display text-5xl tabular-nums leading-none value; text-xs delta chip",
      source: "components/abox/kpi-card.tsx",
      consistency: "consistent",
    },
    {
      pair: "EmptyState",
      observed: "text-display text-2xl title; max-w-md text-sm muted body",
      source: "components/abox/empty-state.tsx",
      consistency: "consistent",
    },
    {
      pair: "PageHeader",
      observed:
        "eyebrow/SCR line via .text-eyebrow; text-display text-3xl md:text-4xl title (compact text-xl md:text-2xl); text-lg muted description",
      source: "components/abox/page-header.tsx",
      consistency: "consistent",
    },
    {
      pair: "Wizard stepper",
      observed: "text-sm step labels with .text-eyebrow step numbers",
      source: "components/abox/downline-wizard-stepper.tsx",
      consistency: "consistent",
    },
    {
      pair: "Cart",
      observed: "text-sm line items, text-xs meta, text-display tabular-nums totals",
      source: "routes/cart.tsx",
      consistency: "consistent",
    },
    {
      pair: "Breadcrumb / Pagination / Avatar",
      observed:
        "Primitives exist in components/ui but no screen consumes them — no typography in use",
      source: "components/ui/*",
      consistency: "consistent",
      note: "Installed but unused; govern when a feature needs them.",
    },
  ],
};
