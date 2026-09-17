/**
 * Governance records — ownership hierarchy, safe-change rules, intentional
 * one-offs, deferred opportunities, experience guidance and the Figma
 * mapping blueprint.
 *
 * DOCUMENTATION ONLY. Consumers: `/design-system`, `/design-guide`.
 */

export interface OwnershipLayer {
  layer: string;
  owns: string;
  source: string;
  changeRule: string;
}

export const OWNERSHIP_HIERARCHY: OwnershipLayer[] = [
  {
    layer: "1 — Foundation tokens",
    owns: "Colour, typography, radius, shadow, utilities, motion, compatibility aliases",
    source: "src/styles.css",
    changeRule:
      "Change here propagates to the entire product, both themes. Every new token needs a light value, a dark value and a --color-* alias.",
  },
  {
    layer: "2 — UI primitives",
    owns: "Interaction contracts: focus, keyboard, disabled, ARIA, portal behaviour",
    source: "src/components/ui/*",
    changeRule:
      "Extend by composition. Do not fork a primitive into abox; do not hardcode colour inside one.",
  },
  {
    layer: "3 — Business components",
    owns: "ABox semantics: plan tiles, status, KPIs, tables, shells, page headers",
    source: "src/components/abox/*",
    changeRule:
      "One owner per pattern. A visual change here is a product change and needs the same review as a screen change.",
  },
  {
    layer: "4 — Component states & variants",
    owns: "Variant props and state classes on the components above",
    source: "Component files (variant maps, cva configs, tone records)",
    changeRule: "Add a variant rather than overriding classes at the call site.",
  },
  {
    layer: "5 — Reusable patterns",
    owns: "Repeated arrangements that have no component owner yet (surface card, section heading, filter rail)",
    source: "Route markup",
    changeRule:
      "Extract only when every call site is byte-identical. Otherwise document it and leave the screens alone.",
  },
  {
    layer: "6 — Experience guidelines",
    owns: "Context-specific usage: density, container width, tone of voice",
    source: "/design-guide experience sections",
    changeRule: "Guidance only — experiences never get their own tokens or forked components.",
  },
  {
    layer: "7 — Application consumers",
    owns: "Screens under src/routes",
    source: "src/routes/*",
    changeRule:
      "Consume layers 1–5. A screen should not introduce a new colour, font or shadow value.",
  },
];

export const SAFE_CHANGE_RULES = [
  "Preservation beats centralization. If a refactor could change rendered output, document it instead of applying it.",
  "Only exact-duplicate class strings may be lifted into a shared constant, and the constant must be byte-identical.",
  "Never normalize an existing value because a neighbouring value looks tidier — variation is often deliberate.",
  "New tokens are added only when no equivalent production token exists.",
  "Colour utilities are always token-backed; literal colours (bg-black/40, hex, rgb) do not belong in components.",
  "Dark background takes a light foreground; light background takes a dark foreground. Metal tiers encode this with paired -fg tokens.",
  "Reference modules under src/lib/design/* and src/components/design/* are documentation only and must never be imported by application screens or business logic.",
  "/design-system and /design-guide stay unlisted: no nav, sidebar, header, menu, breadcrumb or in-page link.",
];

export const INTENTIONAL_ONE_OFFS = [
  {
    item: "Landing hero height",
    detail:
      "min-h-[calc(100svh-5.25rem)] with items-center — keeps the hero centred on any viewport.",
    source: "src/routes/index.tsx",
  },
  {
    item: "Exchange filter chips without a selection ring",
    detail: "Selection is announced only through aria-pressed; the ring was removed deliberately.",
    source: "src/routes/plans.index.tsx",
  },
  {
    item: "Sub-scale type literals",
    detail: "text-[10px], text-[11px], text-[10.5px], text-[0.8rem] for badges and dense chrome.",
    source: "Badges, serials, internal chrome",
  },
  {
    item: "Internal container width",
    detail: "max-w-[1500px] for dashboards versus max-w-[88rem] for web experience pages.",
    source: "internal-shell.tsx vs web routes",
  },
  {
    item: "Mobile filter scrim",
    detail: "The single literal bg-black/40 in a route file.",
    source: "src/routes/plans.index.tsx",
  },
  {
    item: "Action pill weight",
    detail:
      "font-semibold pills next to font-medium primitives — a deliberate marketing-weight action.",
    source: "action-pill.ts vs ui/button.tsx",
  },
  {
    item: "Font aliases",
    detail:
      "--font-serif and --font-mono both alias existing stacks; there is no separate serif or mono face.",
    source: "src/styles.css",
  },
];

export const DEFERRED_OPPORTUNITIES = [
  {
    item: "Remaining bespoke pill strings",
    detail:
      "~40 near-miss variants differ by margins, disabled: modifiers, justify-center or py-3 sizing. Folding them in needs per-site visual verification.",
    risk: "Could change rendered output",
  },
  {
    item: "SurfaceCard component",
    detail:
      "Repeated rounded-2xl border bg-card p-5 markup, but the border token alternates between `border` and `hairline`.",
    risk: "Could change rendered output",
  },
  {
    item: "SectionHeading component",
    detail: "Section heading sizes vary between internal routes (text-base / text-xl / text-2xl).",
    risk: "Would normalize existing typography",
  },
  {
    item: "Literal scrim colour",
    detail: "bg-black/40 on the plans mobile filter backdrop could become a token.",
    risk: "Could shift the scrim's exact appearance",
  },
  {
    item: "Assistant consolidation",
    detail: "planai-assistant.tsx and plan-o-assistant.tsx coexist.",
    risk: "Behavioural change, not styling",
  },
  {
    item: "Spacing relationship normalization",
    detail: "Card padding, section rhythm and grid gaps vary by experience.",
    risk: "Would re-space existing screens",
  },
  {
    item: "Breadcrumbs, pagination, avatars, charts",
    detail:
      "Primitives and tokens exist; no screen consumes them yet. Govern them when a feature needs them.",
    risk: "None — additive when a real need appears",
  },
  {
    item: "Design tokens exported for Figma",
    detail: "A machine-readable token export (W3C format) could be generated from src/styles.css.",
    risk: "None — additive tooling",
  },
];

export interface ExperienceGuide {
  id: string;
  title: string;
  surfaces: string;
  container: string;
  density: string;
  shellAndChrome: string;
  typicalComponents: string;
  guidance: string[];
}

export const EXPERIENCES: ExperienceGuide[] = [
  {
    id: "web",
    title: "Web / Marketing",
    surfaces: "Landing, ICHRA, support, shared links, auth",
    container: "Centred max-w-[88rem], px-4 md:px-8; header spans the full viewport",
    density: "Airy — generous section padding, large display type, full-height hero",
    shellAndChrome: "MarketplaceShell in landing mode (header offset top-6)",
    typicalComponents: "AboxMark, PageHeader (default), action pills, product chips, feature cards",
    guidance: [
      "Display type carries the page; supporting copy stays text-lg muted.",
      "At most one accent colour per section — decoration is structural (hairlines, dot grids, brackets).",
      "Motion is entrance-level (fade-rise, hairline draw) plus the orbital graphic; nothing competes with the headline.",
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    surfaces: "Plans, plan detail, compare, cart, coverage, quote, apply, review, select",
    container: "Same centred max-w-[88rem]; results use a filter rail beside the list",
    density:
      "Comparative — compact page header, dense tiles, information ordered identically on every plan",
    shellAndChrome: "MarketplaceShell with product switcher, cart affordance and shopping-mode bar",
    typicalComponents:
      "PlanCard, MetalBadge, StatusBadge, CarrierMark, QuoteEditPanel, PageHeader (compact)",
    guidance: [
      "Plan tiles keep a fixed information order so plans stay comparable at a glance.",
      "Filter chips reuse the exact badges shown in results, at full opacity.",
      "Prices are formatted $#,##0.00 with the estimate basis stated beneath.",
      "Status dimensions (metal tier, network, exchange, HSA) stay visibly separate.",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard / Admin",
    surfaces: "Agency, marketplace admin, JET platform, member area",
    container: "max-w-[1500px] inside InternalShell; member area uses max-w-[88rem]",
    density: "Dense — h-8/h-9 controls, p-3/p-4 panels, gap-2/gap-3, tabular data",
    shellAndChrome:
      "InternalShell navy rail (268px / 80px collapsed / sheet below lg), sticky glass header with search",
    typicalComponents: "KpiCard, DataTable, StatusBadge, ModuleTabs, wizard stepper, EmptyState",
    guidance: [
      "Status is always words plus colour, never colour alone.",
      "Identifiers use .text-serial; figures use tabular-nums.",
      "Tables are hairline-ruled with no zebra striping.",
      "Dashboard screens are explicitly out of scope for web-experience width and spacing decisions.",
    ],
  },
  {
    id: "future",
    title: "Future experiences",
    surfaces: "Reserved — e.g. employer portal, carrier portal, mobile-first flows",
    container: "To be decided against the shared container rules",
    density: "To be decided",
    shellAndChrome: "Must reuse or extend an existing shell",
    typicalComponents: "Existing shared components",
    guidance: [
      "A new experience gets a guidance section here — never its own token set or forked components.",
      "If a genuinely new primitive is needed, it is added to the shared layer and documented, not kept local.",
    ],
  },
];

export const FIGMA_MAPPING = [
  {
    implementation: "CSS custom property in src/styles.css",
    figma: "Variable inside a Light / Dark mode collection",
    note: "One collection, two modes; names match the token names one-to-one.",
  },
  {
    implementation:
      "Typography utility (.text-display, .text-eyebrow, .text-serial) and the measured type scale",
    figma: "Text style",
    note: "Family, size, weight, line height and tracking captured per style.",
  },
  {
    implementation: "--radius-* scale",
    figma: "Number variable bound to corner radius",
    note: "sm 6 → 4xl 36.",
  },
  {
    implementation: "--shadow-* set",
    figma: "Effect style",
    note: "Multi-layer drop shadows reproduce the navy-tinted stacks.",
  },
  {
    implementation: "src/components/ui/* primitive",
    figma: "Component",
    note: "Focus and disabled expressed as component properties.",
  },
  {
    implementation: "src/components/abox/* component",
    figma: "Component in the ABox library",
    note: "PlanCard, StatusBadge, KpiCard, PageHeader, MetalBadge, CarrierMark, DataTable, EmptyState.",
  },
  {
    implementation:
      "Variant prop (Button variant/size, StatusBadge tone, MetalBadge tier, PageHeader variant, ACTION_PILL key)",
    figma: "Variant property",
    note: "Property names mirror the prop names.",
  },
  {
    implementation:
      "Interactive state (hover, focus, active, selected, disabled, loading, error, success)",
    figma: "Boolean or enum component property",
    note: "State inventory maps one-to-one.",
  },
  {
    implementation:
      "Recurring pattern (page frame, filter rail, results toolbar, wizard, empty state)",
    figma: "Layout template / pattern frame",
    note: "Built from library components, not detached copies.",
  },
  {
    implementation: "Brand asset (AboxMark tones, CarrierMark)",
    figma: "Library asset / component set",
    note: "Four logo tones become variants of one asset.",
  },
  {
    implementation: "Experience guide (Web, Shopping, Dashboard, Future)",
    figma: "Page or section within the library file",
    note: "Guidance pages reference the same components — no duplicates per experience.",
  },
  {
    implementation: "Breakpoints (sm 640, md 768, lg 1024, xl 1280)",
    figma: "Frame presets for responsive examples",
    note: "md is the primary breakpoint in the implementation.",
  },
];
