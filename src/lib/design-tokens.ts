/**
 * Design-token inventory — the single list of token NAMES used by the
 * Design System reference (`/design-system`) and the management Design
 * Guide (`/design-guide`).
 *
 * This file deliberately contains no color/size VALUES. Every value is read
 * at runtime from the CSS custom properties defined in `src/styles.css`,
 * which remains the only source of truth. Adding a token here only makes it
 * visible in the reference pages; it never defines it.
 */

export interface TokenRef {
  /** CSS custom property name, without the leading `--`. */
  name: string;
  /** Human label used in the management-facing guide. */
  label: string;
  /** What the token is for, in plain language. */
  usage: string;
  /** Optional paired foreground token for contrast previews. */
  foreground?: string;
}

export interface TokenGroup {
  id: string;
  title: string;
  intro: string;
  tokens: TokenRef[];
}

export const COLOR_GROUPS: TokenGroup[] = [
  {
    id: "canvas",
    title: "Canvas & surfaces",
    intro: "The layered backgrounds every screen is built on, from the page canvas up to popovers.",
    tokens: [
      { name: "background", label: "Background", usage: "Page canvas", foreground: "foreground" },
      {
        name: "surface",
        label: "Surface",
        usage: "Recessed sections and rails",
        foreground: "surface-foreground",
      },
      { name: "panel", label: "Panel", usage: "Deeper panels inside a surface" },
      {
        name: "card",
        label: "Card",
        usage: "Cards, tiles and plates",
        foreground: "card-foreground",
      },
      {
        name: "popover",
        label: "Popover",
        usage: "Menus, dropdowns, tooltips",
        foreground: "popover-foreground",
      },
      {
        name: "sidebar",
        label: "Sidebar",
        usage: "Internal workspace navigation rail",
        foreground: "sidebar-foreground",
      },
    ],
  },
  {
    id: "brand",
    title: "Brand",
    intro: "Meridian Navy. Primary carries action and active state; sage is the supporting accent.",
    tokens: [
      {
        name: "primary",
        label: "Primary",
        usage: "Primary action, active state, links",
        foreground: "primary-foreground",
      },
      {
        name: "primary-soft",
        label: "Primary soft",
        usage: "Tinted primary surfaces and highlights",
      },
      {
        name: "sage",
        label: "Sage",
        usage: "Supporting accent, positive emphasis",
        foreground: "sage-foreground",
      },
      { name: "sage-soft", label: "Sage soft", usage: "Tinted sage surfaces" },
      {
        name: "secondary",
        label: "Secondary",
        usage: "Quiet panels and secondary controls",
        foreground: "secondary-foreground",
      },
      {
        name: "accent",
        label: "Accent",
        usage: "Hover wash on neutral controls",
        foreground: "accent-foreground",
      },
      { name: "ai", label: "AI", usage: "PlanAI-assisted content", foreground: "ai-foreground" },
    ],
  },
  {
    id: "semantic",
    title: "Semantic status",
    intro:
      "Color is semantic, never decorative. One meaning per token, used consistently across every workspace.",
    tokens: [
      {
        name: "success",
        label: "Success",
        usage: "Complete, verified",
        foreground: "success-foreground",
      },
      {
        name: "warning",
        label: "Warning",
        usage: "Needs attention or review",
        foreground: "warning-foreground",
      },
      {
        name: "destructive",
        label: "Destructive",
        usage: "Blocked, failed, destructive action",
        foreground: "destructive-foreground",
      },
      {
        name: "info",
        label: "Info",
        usage: "Informational state, on-exchange marker",
        foreground: "info-foreground",
      },
      { name: "muted", label: "Muted", usage: "Neutral chrome", foreground: "muted-foreground" },
    ],
  },
  {
    id: "lines",
    title: "Lines, inputs & focus",
    intro: "Structure is carried by hairlines rather than heavy shadows.",
    tokens: [
      { name: "border", label: "Border", usage: "Default border" },
      { name: "border-strong", label: "Border strong", usage: "Emphasised or dashed containers" },
      { name: "hairline", label: "Hairline", usage: "Dividers and card outlines" },
      { name: "input", label: "Input", usage: "Form control borders" },
      { name: "ring", label: "Focus ring", usage: "Keyboard focus indicator" },
    ],
  },
  {
    id: "charts",
    title: "Data visualisation",
    intro: "The chart sequence, ordered so adjacent series stay distinguishable.",
    tokens: [
      { name: "chart-1", label: "Chart 1", usage: "First series" },
      { name: "chart-2", label: "Chart 2", usage: "Second series" },
      { name: "chart-3", label: "Chart 3", usage: "Third series" },
      { name: "chart-4", label: "Chart 4", usage: "Fourth series" },
      { name: "chart-5", label: "Chart 5", usage: "Fifth series" },
    ],
  },
];

/** Metal tiers, in plan-ladder order. Foregrounds are paired for contrast. */
export const METAL_TOKENS: TokenRef[] = [
  {
    name: "metal-bronze",
    label: "Bronze",
    usage: "Lowest actuarial value tier",
    foreground: "metal-bronze-fg",
  },
  {
    name: "metal-expanded-bronze",
    label: "Expanded Bronze",
    usage: "Expanded Bronze tier",
    foreground: "metal-expanded-bronze-fg",
  },
  {
    name: "metal-silver",
    label: "Silver",
    usage: "Silver tier, cost-sharing reductions",
    foreground: "metal-silver-fg",
  },
  { name: "metal-gold", label: "Gold", usage: "Gold tier", foreground: "metal-gold-fg" },
  {
    name: "metal-platinum",
    label: "Platinum",
    usage: "Highest actuarial value tier",
    foreground: "metal-platinum-fg",
  },
  {
    name: "metal-catastrophic",
    label: "Catastrophic",
    usage: "Catastrophic tier, eligibility limited",
    foreground: "metal-catastrophic-fg",
  },
];

export const RADIUS_TOKENS = [
  { name: "radius-sm", label: "sm", usage: "Inputs, dense controls" },
  { name: "radius-md", label: "md", usage: "Buttons, small cards" },
  { name: "radius-lg", label: "lg", usage: "Cards" },
  { name: "radius-xl", label: "xl", usage: "Panels" },
  { name: "radius-2xl", label: "2xl", usage: "Plates, plan tiles, KPI cards" },
  { name: "radius-3xl", label: "3xl", usage: "Large feature plates" },
  { name: "radius-4xl", label: "4xl", usage: "Hero-scale containers" },
] as const;

export const SHADOW_TOKENS = [
  { name: "shadow-card", label: "Card", usage: "Plan tiles and resting cards" },
  { name: "shadow-elevated", label: "Elevated", usage: "Dialogs and popovers" },
  { name: "shadow-drawer", label: "Drawer", usage: "Side drawers" },
  { name: "shadow-plate", label: "Plate", usage: "Feature plates" },
  { name: "shadow-glow", label: "Glow", usage: "Primary emphasis" },
] as const;

/** The 4px-based spacing steps the application actually uses. */
export const SPACING_STEPS = [
  { rem: 0.25, px: 4, usage: "Icon/label gap" },
  { rem: 0.5, px: 8, usage: "Chip and badge gaps" },
  { rem: 0.75, px: 12, usage: "Dense stacks" },
  { rem: 1, px: 16, usage: "Card padding, form rows" },
  { rem: 1.5, px: 24, usage: "Section padding" },
  { rem: 2, px: 32, usage: "Section separation" },
  { rem: 3, px: 48, usage: "Page blocks" },
  { rem: 4, px: 64, usage: "Major page rhythm" },
] as const;

export const TYPOGRAPHY_SPECIMENS = [
  {
    id: "display",
    label: "Display",
    className: "text-display text-4xl",
    usage: "Page titles and hero headlines",
    sample: "Insurance, turns to you.",
  },
  {
    id: "h1",
    label: "Heading 1",
    className: "text-display text-3xl",
    usage: "Primary page heading",
    sample: "Plan available",
  },
  {
    id: "h2",
    label: "Heading 2",
    className: "text-display text-xl",
    usage: "Section heading",
    sample: "Profile completeness",
  },
  {
    id: "h3",
    label: "Heading 3",
    className: "text-base font-semibold",
    usage: "Card and panel heading",
    sample: "Recent changes",
  },
  {
    id: "body",
    label: "Body",
    className: "text-sm",
    usage: "Default reading text",
    sample: "Compare plans side by side, then hand the selection to your agent.",
  },
  {
    id: "body-muted",
    label: "Supporting body",
    className: "text-sm text-muted-foreground",
    usage: "Secondary explanation",
    sample: "Estimates are illustrative until the carrier confirms eligibility.",
  },
  {
    id: "label",
    label: "Label",
    className: "text-xs font-medium",
    usage: "Form labels and controls",
    sample: "Effective date",
  },
  {
    id: "caption",
    label: "Caption",
    className: "text-xs text-muted-foreground",
    usage: "Helper and footnote text",
    sample: "Licensed in 50 states.",
  },
  {
    id: "eyebrow",
    label: "Eyebrow",
    className: "text-eyebrow",
    usage: "Context label above a title",
    sample: "Organization · M05",
  },
  {
    id: "serial",
    label: "Serial",
    className: "text-serial",
    usage: "Identifiers and carrier marks",
    sample: "ORG-1001",
  },
  {
    id: "numeric",
    label: "Numeric / data",
    className: "text-2xl font-semibold tabular-nums",
    usage: "Premiums, KPI values, table figures",
    sample: "$1,248.00",
  },
] as const;

/** Reads a live CSS custom property from the document root. */
export function readToken(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}
