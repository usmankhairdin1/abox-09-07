/**
 * Governance records — ownership hierarchy, safe-change rules, intentional
 * one-offs, deferred opportunities, experience guidance and the Figma
 * mapping blueprint.
 *
 * DOCUMENTATION ONLY. Consumers: /design-system, /design-guide.
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
      "Repeated rounded-2xl border bg-card p-5 markup, but the border token alternates between border and hairline.",
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

/* -----------------------------------------------------------------
 * Phase 2 — spacing & layout governance.
 * Documentation only; consumed by /design-system and /design-guide.
 * ----------------------------------------------------------------- */

export const LAYOUT_GOVERNANCE_RULES = [
  "GOVERNANCE RULE — Spacing is governed by the existing implementation. The shipping value wins over any tidier alternative.",
  "GOVERNANCE RULE — Reuse a recurring spacing relationship before inventing a new one; the audit tables are the lookup.",
  "GOVERNANCE RULE — Reuse a layout pattern only where one genuinely exists today; do not force a screen into a pattern it never used.",
  "GOVERNANCE RULE — Inconsistent spacing is recorded as OBSERVED VARIATION, never silently normalized.",
  "GOVERNANCE RULE — Shared spacing and layout belong to the Core Design System; experience-specific layouts are usage patterns, not separate systems.",
  "GOVERNANCE RULE — No spacing token exists in src/styles.css today. Introducing one is a future opportunity that must not re-space existing screens.",
  "GOVERNANCE RULE — The web experience is capped at max-w-[88rem]; the admin shell at max-w-[1500px]. These are deliberately different and must not be merged.",
  "GOVERNANCE RULE — Dashboard and admin surfaces are out of scope for web-experience width and spacing decisions.",
];

export const LAYOUT_DEFERRED_OPPORTUNITIES = [
  {
    item: "Web-experience container component",
    detail:
      "max-w-[88rem] px-4 md:px-8 is repeated at 23 call sites with differing vertical padding. A component could own the horizontal contract only.",
    risk: "Medium — vertical padding differs per surface, so a naive component would re-space pages",
  },
  {
    item: "Card padding convergence",
    detail: "p-5 (ABox), p-6 (shadcn Card), p-4 and p-3 all serve card-like surfaces.",
    risk: "High — would visibly re-space most screens",
  },
  {
    item: "Detail-split width alignment",
    detail: "Summary columns are 320px on plan detail and 360px in the cart, with gap-6 vs gap-5.",
    risk: "Medium — changes two shopping screens",
  },
  {
    item: "Results toolbar component",
    detail: "The count / filter-trigger / sort row recurs in shape but has no owning component.",
    risk: "Medium — extraction must preserve each call site's exact classes",
  },
  {
    item: "Icon-to-text gap convergence",
    detail: "gap-1.5 and gap-2 both express the same icon/label relationship.",
    risk: "Medium — affects hundreds of controls",
  },
  {
    item: "Table density convergence",
    detail:
      "ABox DataTable (px-5 py-4) and the shadcn table primitive (h-10 px-2) are different densities.",
    risk: "Medium — would change row heights",
  },
  {
    item: "Touch-target floor",
    detail:
      "min-h-11 is applied to 16 controls and min-h-10 to 3; most controls rely on their height class.",
    risk: "Low — additive, but would grow some 36px controls",
  },
  {
    item: "Spacing token export for Figma",
    detail: "A spacing/layout variable set could be generated once a token layer exists.",
    risk: "None — additive tooling",
  },
];

export const LAYOUT_UNOWNED_AREAS = [
  "Page container (max-w-[88rem] px-4 md:px-8) — recurring, no owner.",
  "Shopping page vertical padding (pt-4 pb-8 md:pt-6 md:pb-10) — recurring, no owner.",
  "Card grid recipe (grid gap-4 sm:grid-cols-2 lg:grid-cols-3|4) — recurring, no owner.",
  "Results toolbar row — recurring in shape, no owner.",
  "Detail split with sticky summary — two implementations, no owner.",
  "Form field rhythm (space-y-2 / space-y-3 / space-y-4) — variable, no owner.",
  "Section heading to supporting text spacing — mostly consistent, no owner.",
];

export const FIGMA_LAYOUT_MAPPING = [
  {
    implementation: "Observed spacing value (gap-2, p-5, px-4 md:px-8)",
    figma: "Number variable in a spacing collection",
    note: "Named by observed purpose, not by a new invented scale.",
  },
  {
    implementation: "Semantic spacing relationship (heading → supporting text)",
    figma: "Documented spacing rule on the pattern frame",
    note: "Relationships that vary are documented as variants, not collapsed.",
  },
  {
    implementation: "Web-experience container (max-w-[88rem] px-4 md:px-8)",
    figma: "Layout template frame at 1408px with responsive gutter notes",
    note: "Admin's max-w-[1500px] is a second, separate template.",
  },
  {
    implementation: "Card grid (grid gap-4 sm:grid-cols-2 lg:grid-cols-4)",
    figma: "Grid style plus a layout pattern frame",
    note: "Column counts recorded per breakpoint.",
  },
  {
    implementation: "Flex row (inline-flex items-center gap-2, min-w-0 flex-1, shrink-0)",
    figma: "Auto Layout with fill/hug sizing guidance",
    note: "min-w-0 flex-1 maps to Fill; shrink-0 maps to Hug.",
  },
  {
    implementation: "Breakpoints sm 640 / md 768 / lg 1024 / xl 1280",
    figma: "Frame presets used for responsive documentation",
    note: "md and lg carry almost all structural change in this codebase.",
  },
  {
    implementation: "Control dimension (h-9 primitive, h-10 marketplace, h-11 touch)",
    figma: "Component size property",
    note: "Three sizes, matching the observed density modes.",
  },
  {
    implementation: "Page shell (Marketplace / Internal / Member)",
    figma: "Layout template per shell",
    note: "Header, rail offsets and footer captured as template regions.",
  },
  {
    implementation: "Form structure (label → control → helper)",
    figma: "Form pattern frame with Auto Layout spacing",
    note: "Variation in helper spacing recorded as an observed range.",
  },
  {
    implementation: "Dashboard structure (KPI row → table → panels)",
    figma: "Dashboard pattern frame",
    note: "Uses the admin template, not the web template.",
  },
  {
    implementation: "Marketplace structure (filter rail → toolbar → results)",
    figma: "Shopping pattern frame",
    note: "Rail 256px, gap 24px, results single-column.",
  },
  {
    implementation: "Overlay structure (dialog 512px, drawer 384px)",
    figma: "Overlay component sizes",
    note: "Interior p-6 with gap-4 regions.",
  },
];

/* -----------------------------------------------------------------
 * Phase 3 — typography governance.
 * Documentation only; consumed by /design-system and /design-guide.
 * ----------------------------------------------------------------- */

export const TYPOGRAPHY_GOVERNANCE_RULES = [
  "GOVERNANCE RULE — The existing typography is the source of truth. A shipping size, weight, line height or tracking wins over a tidier alternative.",
  "GOVERNANCE RULE — Reuse an established typography role before introducing a new one; the semantic role table is the lookup.",
  "GOVERNANCE RULE — Do not silently normalize existing variation. Section heading sizes, card description sizes and uppercase tracking values differ on purpose or by history; both are recorded, neither is corrected.",
  "GOVERNANCE RULE — Typography changes are high visual risk. text-sm alone appears 779 times; a change to it re-types the entire product.",
  "GOVERNANCE RULE — One Core Typography System. Experience guidance explains usage context; it never defines a competing type scale.",
  "GOVERNANCE RULE — Text colour is always a token. Muted text is never the only carrier of critical information, and status is always words plus colour.",
  "GOVERNANCE RULE — .text-display sets family, weight, tracking and line height but not size; the call site always supplies the size.",
  "GOVERNANCE RULE — Figma text styles must eventually map to these governed implementation values, not to an idealised scale.",
];

export const TYPOGRAPHY_MATURITY = [
  {
    item: ".text-eyebrow, .text-serial",
    maturity: "established / shared",
    detail: "Fully bound utilities — family, size, weight, transform and colour. 229 and 46 uses.",
  },
  {
    item: ".text-display",
    maturity: "established / contextual",
    detail:
      "Owns family, weight, tracking and line height; size is always supplied by the call site.",
  },
  {
    item: "Badge typography (10px semibold uppercase 0.12em)",
    maturity: "established / shared",
    detail: "The most tightly governed role — identical in StatusBadge and MetalBadge.",
  },
  {
    item: "Page title and subtitle",
    maturity: "established / shared",
    detail: "Owned by PageHeader, including the compact variant.",
  },
  {
    item: "Body and secondary body",
    maturity: "established / contextual",
    detail: "text-sm and text-sm text-muted-foreground, consistent but unowned by any component.",
  },
  {
    item: "Section headings",
    maturity: "recurring but inconsistent",
    detail: "text-base, text-xl and text-2xl all serve the same role across routes.",
  },
  {
    item: "Card titles and descriptions",
    maturity: "recurring but inconsistent",
    detail:
      "text-sm/text-base titles; text-xs/text-sm descriptions depending on whether the shadcn Card is used.",
  },
  {
    item: "Uppercase tracking",
    maturity: "recurring but inconsistent",
    detail: "0.08em, 0.12em, 0.14em, 0.18em and tracking-widest all in use.",
  },
  {
    item: "Sub-scale literals (10px, 11px, 10.5px, 0.8rem, 9px)",
    maturity: "local / one-off",
    detail:
      "10px and 11px are genuinely recurring; the other three are single optical adjustments.",
  },
  {
    item: ".story-link",
    maturity: "local / one-off",
    detail: "89 references with no CSS definition — a dead class that renders nothing.",
  },
  {
    item: "JetBrains Mono",
    maturity: "installed but unused",
    detail: "Requested in the font link at weights 400 and 500; referenced nowhere.",
  },
  {
    item: "--font-serif",
    maturity: "installed but unused",
    detail: "Aliases the display stack; no consumer found.",
  },
  {
    item: "font-bold (700)",
    maturity: "installed but unused",
    detail: "Loaded for both families; used once, in the 404 numeral.",
  },
  {
    item: "Breadcrumb / Pagination / Avatar typography",
    maturity: "installed but unused",
    detail: "Primitives exist; no screen consumes them.",
  },
];

export const TYPOGRAPHY_UNOWNED_AREAS = [
  "Section heading typography — three sizes, no SectionHeading component.",
  "Card title and description typography — varies with whether the shadcn Card is used.",
  "Body and secondary body text — consistent in practice but owned by no component or token.",
  "Helper and error text pairing — consistent in shape, unowned.",
  "Uppercase micro-label tracking — five values, no single owner.",
  "Date and time typography — no dedicated numeric treatment.",
  "Inline link affordance — .story-link is undefined, so 89 links have no shared treatment.",
];

export const TYPOGRAPHY_DEFERRED_OPPORTUNITIES = [
  {
    item: "Bind or remove JetBrains Mono",
    detail:
      "Binding it to --font-mono would restyle every eyebrow and serial; removing it from the font link is network-only but leaves the 'mono' naming misleading.",
    risk: "High if bound, none if only removed from the request",
  },
  {
    item: "Define or remove .story-link",
    detail:
      "Defining it would change the appearance of 89 inline links; removing it is a no-op visually.",
    risk: "High if defined",
  },
  {
    item: "SectionHeading component",
    detail: "Would settle text-base / text-xl / text-2xl into one role.",
    risk: "High — would re-type many screens",
  },
  {
    item: "Uppercase tracking convergence",
    detail: "Five tracking values serve uppercase micro labels.",
    risk: "Medium — visible on badges and table headers",
  },
  {
    item: "Sub-scale size tokens",
    detail: "10px and 11px recur enough to justify named steps.",
    risk: "Low if values are preserved exactly",
  },
  {
    item: "Raise the micro-type floor",
    detail: "text-[9px] and the 10px badge size are below common legibility guidance.",
    risk: "High — would resize badges and table headers across the product",
  },
  {
    item: "Success token convergence",
    detail: "text-sage (44) and text-success (3) both express success.",
    risk: "Medium — changes status colour on some surfaces",
  },
  {
    item: "Tabular figures for dates",
    detail: "Dates in column layouts do not use tabular-nums.",
    risk: "Low — subtle alignment shift",
  },
  {
    item: "Typography text-style export for Figma",
    detail: "Text styles could be generated from the governed values once a token layer exists.",
    risk: "None — additive tooling",
  },
];

export const FIGMA_TYPOGRAPHY_MAPPING = [
  {
    implementation: '--font-sans "Inter Tight" / --font-display "Bricolage Grotesque"',
    figma: "Two font families in the library",
    note: "Serif and mono aliases do not become separate Figma families — they resolve to these two.",
  },
  {
    implementation: "Weights 400 / 500 / 600 (700 used once)",
    figma: "Text-style weight",
    note: "Three working weights; 700 documented as a single exception, not a style.",
  },
  {
    implementation: 'font-variation-settings "wdth" 102, "opsz" 32 / 48',
    figma: "Variable font axis values on the display text styles",
    note: "opsz 32 for h1–h3, opsz 48 for .text-display.",
  },
  {
    implementation: "Observed size + line height + tracking triple",
    figma: "One text style per observed combination",
    note: "Derived from the measured scale, not from an idealised ratio.",
  },
  {
    implementation:
      "Semantic role (page title, section heading, body, label, caption, badge, serial)",
    figma: "Named text style",
    note: "Roles with observed variation become multiple styles, not one averaged style.",
  },
  {
    implementation: ".text-display / .text-eyebrow / .text-serial",
    figma: "Text-style usage rule",
    note: ".text-display is a partial style — size stays a per-instance override.",
  },
  {
    implementation: "Responsive step (text-3xl md:text-4xl, text-base md:text-sm)",
    figma: "Desktop and mobile variants of the same text style",
    note: "The input's larger mobile size is documented as intentional, not an error.",
  },
  {
    implementation: "tabular-nums and font-variant-numeric",
    figma: "Data text style with tabular figures enabled",
    note: "Prices, KPI values and identifiers.",
  },
  {
    implementation: "Component typography (Button, Card, Badge, Table, Dialog)",
    figma: "Text-style property on the component",
    note: "Cross-referenced against the component inventory.",
  },
  {
    implementation: "State typography (muted, error, success, warning, disabled)",
    figma: "Colour property on the component state",
    note: "States change colour and opacity only — never size or weight.",
  },
  {
    implementation: "Experience typography guidance",
    figma: "Page or section in the library file",
    note: "Usage context only; all experiences share one type system.",
  },
  {
    implementation: "Naming guidance",
    figma: "Style names derived from the implementation",
    note: "Use the role names already in the code — display, eyebrow, serial, body, caption, badge — rather than inventing an h1/h2/h3 ladder the product does not use.",
  },
];

/* -----------------------------------------------------------------
 * Phase 5 — component governance, maturity, mapping and future library.
 * Documentation only. Consumed by `/design-system` and `/design-guide`.
 * ----------------------------------------------------------------- */

export const COMPONENT_GOVERNANCE_RULES = [
  "GOVERNANCE RULE — a component belongs in the core system when at least two experiences consume it and it carries no product-specific business meaning. StatusBadge, Button, ACTION_PILL, PageHeader, EmptyState and the motion wrappers meet that test today.",
  "GOVERNANCE RULE — a component stays experience-specific when its meaning only exists in that experience. PlanCard, MetalBadge and CarrierMark are shopping concepts; the M08 outcome and dimension components are governed concepts. Neither set should be generalised into the core.",
  "GOVERNANCE RULE — before adding a component, check the shared layer and the four module kits. Four parallel table, header and empty-state implementations already exist; a fifth should be a deliberate decision, not an accident.",
  "GOVERNANCE RULE — existing component APIs stay as they are until a migration is planned on purpose. Renaming a variant, adding a required prop or changing a default re-renders live screens.",
  "GOVERNANCE RULE — variants are added, never repurposed. Changing what an existing variant name means silently changes every screen that uses it.",
  "GOVERNANCE RULE — state is expressed through colour, weight, background and border. No component changes its icon or its size to express a state today, and new work should keep that.",
  "GOVERNANCE RULE — accessibility behaviour belongs to the primitive. Focus rings, disabled handling, dialog semantics and icon sizing are owned by src/components/ui and must not be re-implemented in a screen.",
  "GOVERNANCE RULE — components consume tokens, never literal colour values. Metal tiers and their paired foregrounds are fixed token pairs.",
  "GOVERNANCE RULE — brand marks come from abox/logo.tsx and abox/carrier-mark.tsx. Runtime logo, favicon and hero assets remain owned by Branding & White-Label and Marketplace Asset Management; the component layer never duplicates that ownership.",
  "GOVERNANCE RULE — src/components/design/reference-kit.tsx is documentation rendering. It must never be imported by an application screen, and no application component may import anything from src/lib/design.",
  "GOVERNANCE RULE — a change to a core shared component is reviewed against all three experiences before it ships, because the shells alone reach 123 routes.",
];

export const COMPONENT_UNOWNED_AREAS = [
  "UNOWNED AREA — the card surface. The dominant rounded-2xl border bg-card treatment is markup, and the border token varies between border and hairline.",
  "UNOWNED AREA — form fields. There is no shared Field component; ui/form.tsx is installed and unused while three module kits each define their own.",
  "UNOWNED AREA — the results toolbar and filter chip row, both repeated without a component.",
  "UNOWNED AREA — loading. Skeleton and Spinner exist, but each module kit ships its own LoadingRows and no loading state is announced to assistive technology.",
  "UNOWNED AREA — the circular icon container, roughly 104 occurrences with no component owner.",
  "UNOWNED AREA — the status tone vocabulary. Fifteen distinct tone values express one conceptual scale across StatusBadge and the module kits.",
  "UNOWNED AREA — bilingual strings. M08 owns a string table and a language toggle; there is no product-wide equivalent.",
];

export const COMPONENT_DEFERRED_OPPORTUNITIES = [
  {
    title: "Converge the four table implementations",
    detail:
      "DataTable, lucie Table, lucie-app DataTable and the raw ui/table.tsx primitive. Column APIs differ, so any convergence re-renders admin screens.",
    risk: "high",
  },
  {
    title: "Converge the parallel page headers and empty states",
    detail:
      "lucie PageHead and lucie-app PageHeader/EmptyState duplicate ABox components by name and purpose.",
    risk: "medium",
  },
  {
    title: "Unify the status tone vocabulary",
    detail:
      "StatusBadge tones, m06 Tone and lucie-app ChipTone describe one scale in three vocabularies. Mapping them would change rendered colours.",
    risk: "high",
  },
  {
    title: "Give the card surface a component owner",
    detail:
      "Centralising it would have to pick one padding and one border token, changing screens that currently differ.",
    risk: "high",
  },
  {
    title: "Introduce a shared Field component",
    detail: "Would replace three module field systems and re-lay-out every form.",
    risk: "high",
  },
  {
    title: "Resolve the two assistant implementations",
    detail:
      "PlanAiAssistant and PlanOAssistant both exist with no located route consumer. Behavioural, not styling.",
    risk: "medium",
  },
  {
    title: "Decide the fate of the 20 unused primitives and the ai-elements tree",
    detail:
      "Keep as installed capability or remove. Either way it is a dependency decision, not a design decision.",
    risk: "low",
  },
  {
    title: "Add a keyboard path for clickable table rows",
    detail: "Rows carry onClick on a tr with no keyboard equivalent.",
    risk: "low",
  },
  {
    title: "Announce loading states",
    detail: "aria-busy or a live region for skeleton regions.",
    risk: "low",
  },
  {
    title: "Add a shared accessible-name helper for icon-only controls",
    detail: "The convention is followed by hand today.",
    risk: "low",
  },
  {
    title: "Reconcile the Button and ACTION_PILL action ladders",
    detail:
      "Button stops at h-10 and is rounded-md; the pill reaches h-11 and is rounded-full. Both are intentional today.",
    risk: "medium",
  },
];

export const FIGMA_COMPONENT_MAPPING = [
  {
    production: "src/components/ui primitives",
    figma: "Core library → Components, as base components with variant properties",
    note: "Only the 29 with a production consumer belong in the first library pass.",
  },
  {
    production: "Button variant and size props",
    figma: "Two Figma variant properties — Variant (6 values) and Size (5 values)",
    note: "Mirror the cva names exactly; do not rename in Figma.",
  },
  {
    production: "ACTION_PILL keys",
    figma:
      "One Action Pill component with Tone (primary/outline) and Size (xs/sm/md/lg) properties",
    note: "smCard becomes a Surface boolean rather than a fifth size.",
  },
  {
    production: "StatusBadge tone",
    figma: "Status Badge component with a six-value Tone property",
    note: "The module-kit tone vocabularies stay out of the core library.",
  },
  {
    production: "MetalBadge tier",
    figma: "Metal Badge with a six-value Tier property bound to the metal token pairs",
    note: "Fill and foreground are a fixed pair per tier.",
  },
  {
    production: "Component states",
    figma: "State property — default, hover, focus, disabled, selected, loading where implemented",
    note: "Only states that exist in code; no invented states.",
  },
  {
    production: "Card family, Dialog, Sheet",
    figma: "Parent component with nested header, content and footer subcomponents",
    note: "Nested components, not detached copies.",
  },
  {
    production: "PlanCard",
    figma: "Commerce component composing Carrier Mark, Metal Badge and Status Badge instances",
    note: "Composition, so the children stay linked to the core components.",
  },
  {
    production: "The three shells",
    figma: "Page frame templates, one per experience",
    note: "Templates rather than components — they define the page, not a part of it.",
  },
  {
    production: "Repeated markup (card surface, section heading, results toolbar)",
    figma: "Pattern candidates documented in the Patterns section",
    note: "Not promoted to components automatically.",
  },
  {
    production: "Module kits (M06, M08, Lucie, Lucie-app)",
    figma: "Experience sections, not core components",
    note: "Their duplication is documented so it is not replicated in Figma.",
  },
  {
    production: "reference-kit.tsx",
    figma: "Not mapped — documentation rendering only",
    note: "Never becomes a Figma component.",
  },
];

export const FUTURE_FIGMA_ORGANIZATION = [
  {
    level: "ABOX CORE → Foundations",
    detail: "Tokens, Typography, Iconography, Assets — sourced from the Phase 1–4 audits.",
  },
  {
    level: "ABOX CORE → Components → Actions",
    detail: "Button, Action Pill, Button Group, Save & Continue.",
  },
  {
    level: "ABOX CORE → Components → Forms",
    detail:
      "Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Label. A Field pattern is documented but has no production owner.",
  },
  {
    level: "ABOX CORE → Components → Display",
    detail: "Status Badge, Metal Badge, Badge, Overflow Text.",
  },
  {
    level: "ABOX CORE → Components → Containers",
    detail: "Card family plus the card-surface pattern candidate.",
  },
  { level: "ABOX CORE → Components → Data", detail: "Data Table, KPI Card." },
  { level: "ABOX CORE → Components → Navigation", detail: "Module Tabs, Tabs, nav item." },
  {
    level: "ABOX CORE → Components → Overlays",
    detail: "Dialog, Sheet, Dropdown, Tooltip, Popover.",
  },
  {
    level: "ABOX CORE → Components → Feedback",
    detail: "Empty State, Skeleton, Spinner, Progress, Toast, Alert.",
  },
  { level: "ABOX CORE → Components → Brand", detail: "ABox Mark, Wordmark, Carrier Mark." },
  {
    level: "ABOX CORE → Patterns",
    detail:
      "Page structures (three frames), forms, data, navigation, commerce, and the documented experience patterns.",
  },
  {
    level: "Experience guidance",
    detail:
      "Web/Marketing, Shopping/Marketplace, Dashboard/Admin and a reserved Future slot — contextual usage only, never separate libraries.",
  },
];
