/**
 * Phase 6 — architecture relationship map and the token → screen dependency
 * model.
 *
 * DOCUMENTATION ONLY. Each edge is marked `current` (it exists in the code
 * today) or `future` (it is proposed). Current edges were confirmed by reading
 * the implementation; future edges are proposals and nothing more.
 *
 * Consumers: /design-system, /design-guide.
 */
import type { ArchRelationshipEntry } from "./types";

export const ARCH_RELATIONSHIPS: ArchRelationshipEntry[] = [
  /* --- contains / composes --- */
  {
    from: "PlanCard",
    relation: "contains",
    to: "CarrierMark, MetalBadge, StatusBadge, OverflowText",
    nature: "current",
    evidence: "src/components/abox/plan-card.tsx",
    label: "CURRENT IMPLEMENTATION",
    note: "The densest composition in the product: four components in one card.",
  },
  {
    from: "PageHeader",
    relation: "composes",
    to: "motion FadeRise, lucide icon, action area",
    nature: "current",
    evidence: "src/components/abox/page-header.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "KpiCard",
    relation: "composes",
    to: "motion CountUp, lucide icon",
    nature: "current",
    evidence: "src/components/abox/kpi-card.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "DataTable",
    relation: "contains",
    to: "StatusBadge (through cell renderers)",
    nature: "current",
    evidence: "Column cell functions across agency and admin routes",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "EmptyState",
    relation: "composes",
    to: "decor DotField / DiagonalWeave",
    nature: "current",
    evidence: "src/components/abox/empty-state.tsx, src/components/abox/decor/",
    label: "CURRENT IMPLEMENTATION",
  },

  /* --- uses primitive --- */
  {
    from: "InternalShell",
    relation: "uses primitive",
    to: "Sheet, Input, DropdownMenu, Tooltip",
    nature: "current",
    evidence: "src/components/abox/internal-shell.tsx",
    label: "CURRENT IMPLEMENTATION",
    note: "The mobile rail is a Sheet; the search control is an Input.",
  },
  {
    from: "MarketplaceShell",
    relation: "uses primitive",
    to: "Sheet, DropdownMenu",
    nature: "current",
    evidence: "src/components/abox/marketplace-shell.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "QuoteEditPanel",
    relation: "uses primitive",
    to: "Dialog or Sheet, Input, Select, Button",
    nature: "current",
    evidence: "src/components/abox/quote-edit-panel.tsx",
    label: "CURRENT IMPLEMENTATION",
  },

  /* --- pattern consumes component --- */
  {
    from: "Plans filter rail (experience pattern)",
    relation: "pattern consumes component",
    to: "MetalBadge, StatusBadge",
    nature: "current",
    evidence: "src/routes/plans.index.tsx",
    label: "CURRENT IMPLEMENTATION",
    note: "Filter chips render the real badges, which is why filters and listings match exactly.",
  },
  {
    from: "Results toolbar (experience pattern)",
    relation: "pattern consumes component",
    to: "Select, ACTION_PILL, ShoppingPathBar",
    nature: "current",
    evidence: "src/routes/plans.index.tsx",
    label: "UNOWNED AREA",
  },
  {
    from: "Cart summary (experience pattern)",
    relation: "pattern consumes component",
    to: "CarrierMark, MetalBadge, OverflowText, ACTION_PILL",
    nature: "current",
    evidence: "src/routes/cart.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "Dashboard KPI row (experience pattern)",
    relation: "experience pattern consumes shared component",
    to: "KpiCard",
    nature: "current",
    evidence: "src/routes/app.dashboard.tsx and agency routes",
    label: "CURRENT IMPLEMENTATION",
  },

  /* --- token dependencies --- */
  {
    from: "StatusBadge",
    relation: "depends on token",
    to: "--sage, --primary, --warning, --muted, --destructive, --info",
    nature: "current",
    evidence: "src/components/abox/status-badge.tsx via color-mix",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "MetalBadge",
    relation: "depends on token",
    to: "Six metal tier tokens and their paired foregrounds",
    nature: "current",
    evidence: "src/components/abox/metal-badge.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "DataTable",
    relation: "depends on token",
    to: "--card, --hairline, --panel, --primary",
    nature: "current",
    evidence: "src/components/abox/data-table.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "Route markup",
    relation: "depends on token",
    to: "Tailwind utilities mapped to tokens",
    nature: "current",
    evidence: "Across src/routes/*",
    label: "OBSERVED VARIATION",
    note: "Some arbitrary values such as max-w-[88rem] are written literally rather than as a named token. Recorded, not changed.",
  },

  /* --- icon and asset dependencies --- */
  {
    from: "Nearly every component",
    relation: "depends on icon",
    to: "lucide-react — 149 distinct icons across 144 files",
    nature: "current",
    evidence: "Phase 4 icon audit",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    from: "Product icon set",
    relation: "depends on icon",
    to: "Tabler IconDental through the shared wrapper",
    nature: "current",
    evidence: "src/components/icons/tooth-icon.tsx",
    label: "CURRENT IMPLEMENTATION",
    note: "The only non-lucide icon in production.",
  },
  {
    from: "Shells",
    relation: "depends on asset",
    to: "AboxMark / AboxWordmark — code-drawn SVG, not a file",
    nature: "current",
    evidence: "src/components/abox/logo.tsx",
    label: "CURRENT IMPLEMENTATION",
  },

  /* --- duplicate / overlap edges --- */
  {
    from: "abox/DataTable",
    relation: "duplicate implementation of",
    to: "ui/Table (unused), lucie table, lucie-app DataTable",
    nature: "current",
    evidence: "Phase 5 duplication findings",
    label: "OBSERVED DUPLICATE",
  },
  {
    from: "abox/PageHeader",
    relation: "duplicate implementation of",
    to: "m06 page head, lucie page head, lucie-app PageHeader",
    nature: "current",
    evidence: "Phase 5 duplication findings",
    label: "OBSERVED DUPLICATE",
  },
  {
    from: "StatusBadge",
    relation: "overlaps",
    to: "ui/Badge, m06 StatusTag, lucie-app StatusChip",
    nature: "current",
    evidence: "Phase 5 duplication findings",
    label: "OBSERVED OVERLAP",
  },
  {
    from: "Button",
    relation: "overlaps",
    to: "ACTION_PILL, m06 Btn",
    nature: "current",
    evidence: "Phase 5 duplication findings",
    label: "OBSERVED OVERLAP",
  },
  {
    from: "ui/Sheet",
    relation: "name collision with",
    to: "m06 kit Sheet",
    nature: "current",
    evidence: "src/components/m06/kit.tsx",
    label: "OBSERVED OVERLAP",
    note: "Two different components share one name in one codebase.",
  },

  /* --- route-local edges --- */
  {
    from: "M06 screens",
    relation: "route-local dependency",
    to: "m06 kit (StatusTag, Btn, Field, Sheet, Toast, MetaRail)",
    nature: "current",
    evidence: "src/components/m06/*",
    label: "OBSERVED OVERLAP",
  },
  {
    from: "M08 Selling Setup",
    relation: "route-local dependency",
    to: "m08 kit (outcome, dimension, provenance, blocker, trace rail)",
    nature: "current",
    evidence: "src/components/m08/kit.tsx",
    label: "CURRENT IMPLEMENTATION",
    note: "Governed vocabulary — deliberately not generic, and not a consolidation candidate.",
  },
  {
    from: "PlanAiAssistant",
    relation: "route-local dependency",
    to: "ai-elements conversation, message, prompt-input, shimmer",
    nature: "current",
    evidence: "src/components/ai-elements/*",
    label: "POSSIBLY UNUSED",
  },

  /* --- future edges --- */
  {
    from: "Canonical action component",
    relation: "would absorb",
    to: "Button and ACTION_PILL appearance",
    nature: "future",
    evidence: "Proposal only — no code change",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    from: "Canonical field component",
    relation: "would absorb",
    to: "ui composition and three route-local field systems",
    nature: "future",
    evidence: "Proposal only — no code change",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    from: "Shared shell base",
    relation: "would own",
    to: "Skip link, header, content container for all three shells",
    nature: "future",
    evidence: "Proposal only — no code change",
    label: "FUTURE OPPORTUNITY",
  },
  {
    from: "Canonical surface card",
    relation: "would own",
    to: "The unowned repeated card markup",
    nature: "future",
    evidence: "Proposal only — no code change",
    label: "FUTURE OPPORTUNITY",
  },
];

/** TOKENS → … → SCREENS. Each level lists a real production example. */
export const DEPENDENCY_MODEL = [
  {
    level: "1 · Tokens",
    detail:
      "CSS custom properties in src/styles.css: surfaces, foregrounds, borders, brand, status tones, metal tiers, radius, shadow, chart colours.",
    example: "--primary, --sage, --hairline, --radius",
    depends: "Nothing",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    level: "2 · Foundation utilities",
    detail:
      "Tailwind utilities and custom utilities layered on the tokens, plus @utility and @custom-variant rules.",
    example: "bg-card, text-muted-foreground, animate-shimmer, .text-serial",
    depends: "Tokens",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    level: "3 · Primitives",
    detail: "shadcn components that own focus, keyboard and disabled behaviour.",
    example: "Button, Input, Select, Dialog, Sheet, Skeleton",
    depends: "Foundation utilities and tokens",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    level: "4 · Core components",
    detail: "Product-aware shared components with a stable API.",
    example: "StatusBadge, MetalBadge, EmptyState, CarrierMark, Logo",
    depends: "Primitives and below",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    level: "5 · Compound components",
    detail: "Components that own the relationship between several components.",
    example: "PageHeader, DataTable, KpiCard, PlanCard, DownlineWizardStepper",
    depends: "Core components and below",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    level: "6 · Patterns",
    detail: "Repeated compositions, some owned and some not.",
    example: "Page frame, action pill row, empty state, surface card, section heading",
    depends: "Compound components and below",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    level: "7 · Experience patterns",
    detail: "Patterns specialised for one part of the product.",
    example: "Plans filter rail, results toolbar, cart summary, dashboard KPI row",
    depends: "Patterns and below",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    level: "8 · Screens",
    detail: "Routes. They own data, permissions and composition — never new design values.",
    example: "src/routes/plans.index.tsx, src/routes/cart.tsx, src/routes/agency.*",
    depends: "Everything below",
    label: "CURRENT IMPLEMENTATION",
  },
] as const;

/** Places production writes a literal where a token could exist. Not changed. */
export const LITERAL_VALUE_FINDINGS: string[] = [
  "OBSERVED VARIATION — max-w-[88rem] is written as an arbitrary value in 23 places rather than as a named container token.",
  "OBSERVED VARIATION — min-w-[640px] inside DataTable is a literal table breakpoint with no token behind it.",
  "OBSERVED VARIATION — the hero uses min-h-[calc(100svh-5.25rem)]; the 5.25rem header offset is a literal repeated in layout maths.",
  "OBSERVED VARIATION — uppercase label tracking appears as five different tracking-[…] literals rather than one named step.",
  "OBSERVED VARIATION — the 2px ember hover border in DataTable is a literal w-[2px].",
  "FUTURE OPPORTUNITY — each of the above could become a named token. None is changed in this phase, because every one of them affects rendered layout.",
];
