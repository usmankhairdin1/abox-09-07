/**
 * Foundation inventory — audited from the running implementation.
 *
 * DOCUMENTATION ONLY: no values are defined here. Colour, radius, shadow and
 * font values are read live from `src/styles.css` by the reference pages;
 * the strings below record structural facts (counts, class names, conventions)
 * that were measured in the codebase.
 *
 * Consumers: `/design-system`, `/design-guide`. Never imported by app screens.
 */
import type { FoundationCategory } from "./types";

export const FOUNDATION: FoundationCategory[] = [
  {
    id: "color-architecture",
    title: "Color architecture",
    summary:
      "One token file drives every colour. `@theme inline` maps each custom property into a Tailwind utility, `:root` holds the light theme and `.dark` overrides it. Components reference utilities (bg-primary, text-muted-foreground); they never hardcode a colour.",
    entries: [
      { name: "@theme inline color map", value: "45 --color-* aliases pointing at the raw custom properties", source: "src/styles.css", consumers: "Every Tailwind colour utility in the app", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Adding a colour means adding both the raw property and its --color-* alias." },
      { name: ":root light theme", value: "oklch values — white canvas, navy ink, deep navy primary", source: "src/styles.css", consumers: "Default theme for all routes", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: ".dark overrides", value: "Full re-declaration of the same property names", source: "src/styles.css", consumers: "Dark theme", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Every new token needs a dark value or it inherits the light one." },
      { name: "Surface ladder", value: "background → surface → panel → card → popover", source: "src/styles.css", consumers: "Shells, cards, rails, menus", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Foreground pairing", value: "Each surface/brand/status token ships a matching *-foreground", source: "src/styles.css", consumers: "All text on tinted backgrounds", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Contrast standard: dark background → light foreground, light background → dark foreground." },
      { name: "Semantic status set", value: "success, warning, destructive, info, muted (+ foregrounds)", source: "src/styles.css", consumers: "StatusBadge, alerts, validation text, KPI tones", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "One meaning per token; colour is never decorative." },
      { name: "Metal tiers", value: "6 tiers × (base + -fg) = 12 tokens", source: "src/styles.css", consumers: "MetalBadge only", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Bronze, Expanded Bronze, Silver, Gold, Platinum, Catastrophic. Solid fills with paired foregrounds." },
      { name: "Chart sequence", value: "chart-1 … chart-5", source: "src/styles.css", consumers: "Charts and data visualisation", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Sidebar set", value: "sidebar + foreground/primary/accent/border/ring", source: "src/styles.css", consumers: "InternalShell navigation rail", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Lines & focus", value: "border, border-strong, hairline, input, ring", source: "src/styles.css", consumers: "Cards, dividers, inputs, focus outlines", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Structure is carried by hairlines; borders are 1px almost everywhere." },
      { name: "color-mix tinting", value: "StatusBadge mixes --tone with card/foreground at 12% / 34% / 88%", source: "src/components/abox/status-badge.tsx", consumers: "StatusBadge instances across 87 files", ownership: "business", shared: "convention", maturity: "current", note: "The mix ratios are the badge's own contract, not global tokens." },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    summary:
      "Two families and a measured type scale. Display type comes from Bricolage Grotesque via `@layer base` on h1–h3 and the `.text-display` utility; everything else is Inter Tight.",
    entries: [
      { name: "--font-sans", value: "Inter Tight, ui-sans-serif, system-ui, …", source: "src/styles.css", consumers: "html element, all body text", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "--font-display", value: "Bricolage Grotesque, falls back to Inter Tight", source: "src/styles.css", consumers: "h1–h3, .font-display, .text-display", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "--font-serif / --font-mono", value: "Both alias the display / sans stacks", source: "src/styles.css", consumers: "text-eyebrow, text-serial", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "There is no true mono font in the product; the mono token is an alias." },
      { name: "Heading base style", value: "h1–h3: display family, weight 600, tracking -0.028em, wdth 102 / opsz 32", source: "src/styles.css @layer base", consumers: "Every heading, automatically", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Body font features", value: "ss01, cv11 on body; antialiased; optimizeLegibility", source: "src/styles.css", consumers: "Whole document", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: ".text-display", value: "display family, 600, tracking -0.032em, line-height 1.02, opsz 48", source: "src/styles.css", consumers: "PageHeader default title, landing headlines", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: ".text-eyebrow", value: "0.6875rem, 500, uppercase, muted-foreground", source: "src/styles.css", consumers: "Context labels above titles, KPI labels", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: ".text-serial", value: "0.625rem, uppercase, tabular-nums, muted-foreground", source: "src/styles.css", consumers: "Identifiers, plan IDs, carrier meta", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Type scale in use", value: "text-sm ×759, text-xs ×445, text-xl ×94, text-2xl ×61, text-lg ×29, text-base ×24, text-3xl ×20, text-4xl ×19, text-5xl/6xl ×7 each", source: "measured across src/routes + src/components", consumers: "All screens", ownership: "pattern", shared: "convention", maturity: "current", note: "text-sm is the default reading size; text-xs carries labels and metadata." },
      { name: "Sub-scale literals", value: "text-[10px] ×29, text-[11px] ×22, text-[10.5px] ×3, text-[0.8rem] ×4", source: "measured across src/routes + src/components", consumers: "Badges, serial labels, dense internal chrome", ownership: "pattern", shared: "convention", maturity: "current", note: "Deliberately below the Tailwind scale; leave as-is." },
      { name: "Numeric typography", value: "tabular-nums with font-semibold on values", source: "KpiCard, PlanCard, tables", ownership: "business", consumers: "KPIs, premiums, table figures", shared: "convention", maturity: "current" },
      { name: "Weights in use", value: "font-medium (labels, nav), font-semibold (titles, values, badges)", source: "measured across components", consumers: "All screens", ownership: "pattern", shared: "convention", maturity: "current", note: "No font-bold convention; 600 is the heaviest routine weight." },
    ],
  },
  {
    id: "spacing",
    title: "Spacing scale",
    summary:
      "Tailwind's 4px scale, used selectively. These are the steps the application actually reaches for, ranked by real frequency.",
    entries: [
      { name: "gap-*", value: "gap-2 ×301, gap-3 ×173, gap-4 ×128, gap-1.5 ×127, gap-1 ×103, gap-6 ×52", source: "measured across src/routes + src/components", consumers: "Flex and grid layouts", ownership: "pattern", shared: "convention", maturity: "current", note: "gap-1.5 is the standard icon→text gap inside chips and badges." },
      { name: "p-*", value: "p-5 ×178, p-3 ×68, p-4 ×65, p-6 ×47", source: "measured across src/routes + src/components", consumers: "Cards, panels, tiles", ownership: "pattern", shared: "convention", maturity: "current", note: "p-5 is the de-facto card padding; p-6 appears on KPI cards and larger plates." },
      { name: "space-y-*", value: "space-y-2 ×50, space-y-5 ×42, space-y-4 ×35, space-y-3 ×33, space-y-6 ×16", source: "measured across src/routes + src/components", consumers: "Vertical stacks and form sections", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "Page horizontal padding", value: "px-4 md:px-8 on web experience pages; px-3 sm:px-4 lg:px-8 on the internal shell", source: "route files, internal-shell.tsx", consumers: "All shells", ownership: "business", shared: "convention", maturity: "current" },
      { name: "4px base", value: "No custom spacing scale is defined; Tailwind defaults apply", source: "src/styles.css (absence of a --spacing override)", consumers: "Everything", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
    ],
  },
  {
    id: "layout",
    title: "Layout & containers",
    summary:
      "Three shells own the frame. Headers span the full viewport; content is centred in a fixed-width container that differs per experience.",
    entries: [
      { name: "max-w-[88rem]", value: "1408px centred container", source: "23 web experience route/shell files", consumers: "Landing, plans, cart, quote, coverage, compare, member content", ownership: "pattern", shared: "convention", maturity: "current", note: "The agreed web-experience width. Do not widen or narrow." },
      { name: "max-w-[1500px]", value: "Internal workspace content width", source: "src/components/abox/internal-shell.tsx", consumers: "All dashboard/admin routes", ownership: "business", shared: "source-of-truth", maturity: "current", note: "Dashboards are explicitly out of scope for web-experience width changes." },
      { name: "Reading widths", value: "max-w-3xl ×15, max-w-2xl ×14, max-w-lg ×14, max-w-md ×11, max-w-4xl ×9", source: "measured across src/routes", consumers: "Copy blocks, descriptions, narrow forms", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "MarketplaceShell header", value: "sticky top-4 (top-6 on landing), z-30, glass pill, px-4 md:px-8", source: "src/components/abox/marketplace-shell.tsx", consumers: "30 marketplace routes", ownership: "business", shared: "source-of-truth", maturity: "current" },
      { name: "InternalShell rail", value: "fixed rail, w-[268px] expanded / w-[80px] collapsed, rounded-3xl glass, lg: and up", source: "src/components/abox/internal-shell.tsx", consumers: "89 internal routes", ownership: "business", shared: "source-of-truth", maturity: "current", note: "Below lg the rail becomes a Sheet at w-[300px]." },
      { name: "MemberShell", value: "Full-width header, max-w-[88rem] content, left icon rail with connecting arc", source: "src/components/abox/member-shell.tsx", consumers: "4 member routes", ownership: "business", shared: "source-of-truth", maturity: "current" },
      { name: "Hero height", value: "min-h-[calc(100svh-5.25rem)] with items-center", source: "src/routes/index.tsx", consumers: "Landing hero only", ownership: "local", shared: "one-off", maturity: "current", note: "Intentional: keeps the hero vertically centred on any viewport." },
      { name: "Skip link", value: "sr-only focus:not-sr-only, fixed top-left, z-50", source: "marketplace-shell.tsx, internal-shell.tsx", consumers: "Both shells", ownership: "business", shared: "convention", maturity: "current" },
    ],
  },
  {
    id: "responsive",
    title: "Breakpoints & responsive behaviour",
    summary:
      "Tailwind's default breakpoints, unmodified. No custom `screens` block exists. Responsiveness is expressed per component, and `md` carries most of the work.",
    entries: [
      { name: "sm (640px)", value: "173 usages", source: "Tailwind default", consumers: "Chip wrapping, small-screen truncation", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "md (768px)", value: "243 usages — the primary breakpoint", source: "Tailwind default", consumers: "Column switches, padding steps, title sizes", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "lg (1024px)", value: "83 usages", source: "Tailwind default", consumers: "Internal rail visibility, filter rails", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "xl / 2xl", value: "22 / 2 usages", source: "Tailwind default", consumers: "Wide-screen grid refinements", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Touch target floor", value: "@media (max-width: 640px) { button, a { min-height: 44px } }", source: "src/styles.css @layer base", consumers: "Every button and link on phones", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Accessibility guarantee — do not remove." },
      { name: "Stacking convention", value: "Multi-column grids collapse to one column; nothing is hidden on small screens", source: "route files", consumers: "All experiences", ownership: "pattern", shared: "convention", maturity: "current" },
    ],
  },
  {
    id: "shape",
    title: "Borders, radius & elevation",
    summary: "Borders are 1px hairlines; radius rises with surface size; shadows are cool navy-tinted and reserved for cards and overlays.",
    entries: [
      { name: "Radius scale", value: "sm 6px, md 10px, lg 14px, xl 18px, 2xl 22px, 3xl 28px, 4xl 36px; --radius base 0.875rem", source: "src/styles.css @theme inline", consumers: "Everything", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Radius in use", value: "rounded-full ×299, rounded-2xl ×294, rounded-lg ×170, rounded-xl ×95, rounded-md ×52, rounded-sm ×21, rounded-3xl ×17", source: "measured across src/routes + src/components", consumers: "Pills (full), cards and tiles (2xl), primitives (md/lg), rails (3xl)", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "Border widths", value: "1px everywhere; `* { border-color: var(--color-border) }` sets the default colour", source: "src/styles.css @layer base", consumers: "All bordered elements", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "There is no 2px border convention; emphasis uses border-strong or a ring." },
      { name: "Shadow set", value: "shadow-card, shadow-elevated, shadow-drawer, shadow-plate, shadow-glow", source: "src/styles.css @theme inline", consumers: "Cards, dialogs, drawers, plates, primary emphasis", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "All are multi-layer navy-tinted stacks — no black shadows, no halos." },
      { name: "--shadow-overlay", value: "Compatibility alias → shadow-elevated", source: "src/styles.css compatibility layer", consumers: "Governance/Lucie surfaces", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Focus ring", value: "focus-visible:ring-1 ring-ring on primitives; ring-2 + ring-offset-2 on selected chips", source: "button.tsx, filter chips", consumers: "All keyboard focus", ownership: "primitive", shared: "convention", maturity: "current" },
    ],
  },
  {
    id: "opacity",
    title: "Opacity conventions",
    summary:
      "Opacity is used as a tint modifier on tokens, not to dim content. Badges and filter chips run at full opacity by decision.",
    entries: [
      { name: "Tint modifiers", value: "/10 and /12 for icon tiles, /6 for the default KPI tile, /20–/40 for borders", source: "kpi-card.tsx, route files", consumers: "Icon tiles, soft borders", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "Text de-emphasis", value: "text-foreground/80, /70, /60 in shells and footers", source: "marketplace-shell.tsx, internal-shell.tsx", consumers: "Navigation and footer text", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "Hover alpha", value: "hover:bg-primary/90, /80 on filled controls", source: "src/components/ui/button.tsx", consumers: "Buttons", ownership: "primitive", shared: "source-of-truth", maturity: "current" },
      { name: "Disabled", value: "disabled:opacity-50 + pointer-events-none", source: "src/components/ui/button.tsx", consumers: "All disabled controls", ownership: "primitive", shared: "source-of-truth", maturity: "current" },
      { name: "No badge opacity", value: "Status and metal badges render at opacity 1 in results and filters alike", source: "status-badge.tsx, metal-badge.tsx, plans.index.tsx", consumers: "Plan results and filter rail", ownership: "business", shared: "convention", maturity: "current", note: "Deliberate decision — do not reintroduce dimming on unselected filters." },
      { name: "Scrim", value: "bg-black/40 mobile filter backdrop", source: "src/routes/plans.index.tsx", consumers: "Plans page filter drawer", ownership: "local", shared: "one-off", maturity: "current", note: "The only literal colour left in a route." },
    ],
  },
  {
    id: "sizing",
    title: "Control heights, icon sizes & density",
    summary: "Measured control and icon sizing as it exists. Heights cluster around four values; icons are overwhelmingly 16px.",
    entries: [
      { name: "h-10 (40px)", value: "142 usages — the dominant action height", source: "measured across src/routes + src/components", consumers: "Action pills, header controls", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "h-11 (44px)", value: "69 usages — large actions and primary CTAs", source: "measured", consumers: "Primary CTAs, wizard actions", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "h-9 (36px)", value: "46 usages — shadcn Button default, icon buttons", source: "src/components/ui/button.tsx + routes", consumers: "Primitives, compact chrome", ownership: "primitive", shared: "source-of-truth", maturity: "current" },
      { name: "h-8 (32px)", value: "43 usages — dense internal controls", source: "measured", consumers: "Toolbars, table actions", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "Icon 16px", value: "h-4 w-4 ×275 — the default", source: "measured", consumers: "Inside buttons, chips, list rows", ownership: "pattern", shared: "convention", maturity: "current", note: "Button CSS forces [&_svg]:size-4 inside primitives." },
      { name: "Icon 12 / 20 / 24px", value: "h-3 ×34, h-5 ×31, h-6 ×4", source: "measured", consumers: "Micro-labels, section headers, feature tiles", ownership: "pattern", shared: "convention", maturity: "current" },
      { name: "Icon tiles", value: "h-8/9/10/11 w-* squares; 16×16 (h-16 w-16) on KPI cards; PageHeader 36px compact / 48–56px default", source: "kpi-card.tsx, page-header.tsx", consumers: "KPI cards, page headers", ownership: "business", shared: "source-of-truth", maturity: "current" },
      { name: "Density", value: "Web experience is airy (p-5/p-6, gap-4/6); internal workspaces are dense (p-3/p-4, gap-2/3, h-8 controls)", source: "route comparison", consumers: "All experiences", ownership: "pattern", shared: "convention", maturity: "current", note: "Density is experience-specific by design, not an inconsistency." },
    ],
  },
  {
    id: "motion",
    title: "Motion",
    summary:
      "A single easing curve, short transitions and six named keyframes. A reduced-motion block disables all of it.",
    entries: [
      { name: "Signature easing", value: "cubic-bezier(0.2, 0.7, 0.2, 1)", source: "src/styles.css", consumers: "Every custom transition and animation", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Transition durations", value: "320ms (utilities), 700ms (edge-sheen), 200ms (rail width), 300ms (card hover)", source: "src/styles.css, internal-shell.tsx, kpi-card.tsx", consumers: "Hover and layout transitions", ownership: "foundation", shared: "convention", maturity: "current" },
      { name: "animate-fade-rise", value: "abox-fade-rise 500ms, both", source: "src/styles.css", consumers: "FadeRise wrapper in src/components/abox/motion.tsx", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "animate-hairline", value: "scaleX draw, 620ms, origin left", source: "src/styles.css", consumers: "PageHeader underline", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "animate-orbit / -slow", value: "22s / 60s linear infinite rotation", source: "src/styles.css", consumers: "Landing orbital graphic", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Source of the known screenshot noise on the landing page." },
      { name: "animate-drift", value: "6s ease-in-out infinite, ±6px translate", source: "src/styles.css", consumers: "Floating decoration", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "animate-pulse-ring", value: "2.4s scale 0.8 → 1.9 with fade", source: "src/styles.css", consumers: "Live/attention indicators", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "animate-shimmer", value: "2.4s linear, 200% gradient sweep", source: "src/styles.css", consumers: "Loading shimmer surfaces", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "CountUp", value: "Scripted numeric roll-in for KPI values", source: "src/components/abox/motion.tsx", consumers: "KpiCard", ownership: "business", shared: "source-of-truth", maturity: "current" },
      { name: "prefers-reduced-motion", value: "All animations and transitions collapse to 0.01ms", source: "src/styles.css @layer base", consumers: "Whole document", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Accessibility guarantee — do not remove." },
    ],
  },
  {
    id: "utilities",
    title: "Utility classes & effects",
    summary: "Custom `@utility` definitions that carry the ABox surface language. Each is defined once and consumed by class name.",
    entries: [
      { name: "glass", value: "color-mix card at 82% + blur(14px) saturate(140%) + 1px hairline", source: "src/styles.css", consumers: "Shell headers, internal rail, drawers", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "ring-pill", value: "inset 1px hairline ring", source: "src/styles.css", consumers: "Pill chrome", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "ember-underline", value: "2px primary underline, scaleX on hover/focus-visible", source: "src/styles.css", consumers: "Text links", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "divider-warm", value: "1px hairline top border", source: "src/styles.css", consumers: "Section dividers", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "card-brackets", value: "Four L-shaped corner marks via one ::before, revealed on hover", source: "src/styles.css", consumers: "KpiCard and feature cards", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "edge-sheen", value: "Diagonal hairline sweep across the card on hover (700ms)", source: "src/styles.css", consumers: "KpiCard and feature cards", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "noise-field", value: "22px radial dot grid", source: "src/styles.css", consumers: "DotField background decoration", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "contour", value: "Layered horizontal hairlines (topographic wash)", source: "src/styles.css", consumers: "Section backgrounds", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "aurora", value: "Flat background in light; vertical navy gradient in dark", source: "src/styles.css", consumers: "Full-bleed sections", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "ACTION_PILL", value: "8 canonical pill class strings (primary xs/md/lg, outline xs/sm/smCard/md/lg)", source: "src/components/abox/action-pill.ts", consumers: "64 call sites in 33 route files", ownership: "business", shared: "source-of-truth", maturity: "current", note: "Values are byte-identical to the strings they replaced." },
    ],
  },
  {
    id: "compatibility",
    title: "Compatibility aliases",
    summary:
      "A deliberate alias layer so the governed M0x / Lucie surfaces keep their original token vocabulary while rendering in Meridian Navy.",
    entries: [
      { name: "--brand-accent", value: "→ var(--primary)", source: "src/styles.css compatibility layer", consumers: "Governance surfaces, white-label hooks", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "--ai / --ai-foreground", value: "Violet accent with its own dark value", source: "src/styles.css", consumers: "PlanAI-assisted content", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "--surface-1 / -2 / -3", value: "→ card / surface / panel", source: "src/styles.css", consumers: "Wireframe and HF governance estates", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "--shadow-overlay", value: "→ var(--shadow-elevated)", source: "src/styles.css", consumers: "Overlay surfaces in governed screens", ownership: "foundation", shared: "source-of-truth", maturity: "current" },
      { name: "Second @theme inline block", value: "Exposes the alias tokens as --color-* utilities", source: "src/styles.css", consumers: "bg-ai, bg-surface-2, text-brand-accent etc.", ownership: "foundation", shared: "source-of-truth", maturity: "current", note: "Keep the aliases; removing them would break governed screens." },
    ],
  },
];
