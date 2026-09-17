/**
 * Phase 6 — anatomy, variant, state, accessibility, responsive and density
 * blueprints.
 *
 * DOCUMENTATION ONLY. Every row separates what production does today
 * (`current`) from what a future canonical system should target (`future`).
 * The two are never merged. Where production evidence is insufficient, the
 * row is labelled FUTURE DECISION rather than invented.
 *
 * Nothing here adds a variant, a state or a rule to production.
 *
 * Consumers: /design-system, /design-guide.
 */
import type { BlueprintGroup } from "./types";

/* ============================ ANATOMY ============================ */

export const ANATOMY_BLUEPRINT: BlueprintGroup = {
  id: "anatomy-blueprint",
  title: "Anatomy blueprint",
  summary:
    "The parts each component actually renders, and the slot model a future canonical version would formalise. Unknowns are marked FUTURE DECISION rather than filled in.",
  rows: [
    {
      item: "Button",
      source: "src/components/ui/button.tsx",
      current:
        "Root button, optional leading icon, label, optional trailing icon. Any child SVG is forced to 16px by the base rule. Height comes from the size variant.",
      future:
        "Formal slots: leading, label, trailing. Icon-only requires an accessible name. Min touch target documented separately from visual height.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "PageHeader",
      source: "src/components/abox/page-header.tsx",
      current:
        "Optional eyebrow, optional SCR identifier, optional icon, title, optional description, optional action area. Wrapped in a FadeRise motion entrance.",
      future:
        "Named regions: meta, title, description, actions. Density property replaces the default/compact pair.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "DataTable",
      source: "src/components/abox/data-table.tsx",
      current:
        "Scroll wrapper, table with a 640px min width, sr-only caption, uppercase serial header row, body rows with a hover ember left border, and a single empty row spanning all columns.",
      future:
        "Regions: caption, header, body, empty, and a footer region that does not exist today.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "PlanCard",
      source: "src/components/abox/plan-card.tsx",
      current:
        "Carrier mark, carrier name, plan name with overflow handling, metal badge, status badges, plan identifier, price block, action row. Two layouts.",
      future:
        "Regions: identity, classification, pricing, actions. Layout becomes a property rather than a branch.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Surface card",
      source: "Repeated route markup",
      current:
        "No component, so no fixed anatomy. Padding is p-4, p-5 or p-6 depending on the screen; the border token alternates between border and hairline.",
      future: "FUTURE DECISION — the canonical padding and border for a card surface is not settled by the evidence. Both variants are in active production use.",
      label: "FUTURE DECISION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Form field",
      source: "ui/label + ui/input and three route-local kits",
      current:
        "Assembled per screen. Label, control, hint and error exist in some screens and not others; no kit agrees on the order of hint and error.",
      future:
        "FUTURE DECISION — the canonical field anatomy cannot be derived, because the four systems genuinely differ. Requires a design decision, not an audit.",
      label: "FUTURE DECISION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Shell",
      source: "src/components/abox/*-shell.tsx",
      current:
        "Skip link, sticky header, navigation (rail, header links or icon arc), main region, and in the internal shell a search control.",
      future:
        "A shared base owning skip link, header and content container; the navigation region stays per family.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "EmptyState",
      source: "src/components/abox/empty-state.tsx",
      current: "Optional decorative background, optional icon, title, optional body, optional action.",
      future: "Same anatomy with a Size property for inline versus full-page use.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
  ],
};

/* ============================ VARIANTS ============================ */

export const VARIANT_BLUEPRINT: BlueprintGroup = {
  id: "variant-blueprint",
  title: "Variant blueprint",
  summary:
    "Currently observed variant vocabularies, kept separate from future standardization opportunities. Existing variants are deliberately NOT forced into one vocabulary.",
  rows: [
    {
      item: "Button variants",
      source: "src/components/ui/button.tsx",
      current:
        "default, destructive, outline, secondary, ghost, link. Measured use: outline 18, ghost 11, secondary 2, destructive 2, link 1; default is never written explicitly.",
      future:
        "Keep all six. Document that `default` is implicit so a Figma variant can carry the same default.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "ACTION_PILL variants",
      source: "src/components/abox/action-pill.ts",
      current:
        "primary xs/md/lg and outline xs/sm/smCard/md/lg. Every variant has at least one consumer — the only export in the system with no dead variant.",
      future:
        "FUTURE DECISION — whether these become Button appearance values or stay a separate pill vocabulary. Not decided here.",
      label: "FUTURE DECISION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "StatusBadge tones",
      source: "src/components/abox/status-badge.tsx",
      current:
        "sage, primary, warning, muted, destructive, info. Measured use: primary 34, muted 31, warning 29, sage 27, info 16, destructive 4.",
      future:
        "Preserve all six tones and their current meanings. Any future consolidation absorbs other vocabularies INTO this one rather than reducing it.",
      label: "GOVERNANCE RULE",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Card variants",
      source: "ui/Card, KpiCard, PlanCard, repeated route markup",
      current:
        "Four coexisting card treatments with different padding, radius, border token and hover behaviour.",
      future:
        "FUTURE OPPORTUNITY — one surface with Padding, Border, Radius and Interactive properties. Deferred because every value is in live use.",
      label: "OBSERVED VARIATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Table densities",
      source: "abox/DataTable, lucie table, lucie-app DataTable, m06 tables",
      current: "Four densities in production, ranging from px-5 py-4 down to tighter kit cells.",
      future:
        "A Density property with values derived from the measured cells — not from invented numbers.",
      label: "OBSERVED VARIATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Control heights",
      source: "ui/button.tsx, action-pill.ts, ui/input.tsx, ui/select.tsx",
      current:
        "h-8, h-9, h-10 and h-11 all occur. Button defaults to h-9; pills run h-8 to h-11; inputs are h-9; some select triggers differ.",
      future:
        "FUTURE OPPORTUNITY — one control-height ramp. Deferred: changing any height moves layout on live screens.",
      label: "OBSERVED VARIATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Shell variants",
      source: "src/components/abox/*-shell.tsx",
      current:
        "Three families. Internal has an expandable rail and search; marketplace has a full-width header with a landing offset; member has an icon arc.",
      future:
        "Stay three. They encode three different navigation models, not three styles of the same thing.",
      label: "GOVERNANCE RULE",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Experience-specific variation",
      source: "Measured across route families",
      current:
        "The same components are used at different densities in shopping and admin, driven by page composition rather than by component props.",
      future:
        "Document as experience guidance. A component must not fork because an experience prefers it tighter.",
      label: "GOVERNANCE RULE",
      phase: "Phase 5 — components, variants, states",
    },
  ],
};

/* ============================ STATES ============================ */

export const STATE_BLUEPRINT: BlueprintGroup = {
  id: "state-blueprint",
  title: "State blueprint",
  summary:
    "The full future state model. For each state: what production implements, what is implied, what an existing primitive already provides, and what is simply absent. No state is added to production.",
  rows: [
    {
      item: "default",
      source: "Every component",
      current: "Implemented everywhere. Every component ships a resting state.",
      future: "Baseline. No change.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "hover",
      source: "button.tsx, kpi-card.tsx, data-table.tsx, styles.css",
      current:
        "Implemented on actions, cards and table rows: hover:bg-*/90, hover:bg-accent, a -translate-y-0.5 card lift, bracket reveal and edge sheen at 300–700ms.",
      future: "Keep. Document hover as optional on touch-primary surfaces.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "focus-visible",
      source: "ui/button.tsx, shells",
      current:
        "focus-visible:ring-1 focus-visible:ring-ring on primitives; skip links use focus:not-sr-only. ACTION_PILL class strings include no ring of their own.",
      future:
        "FUTURE OPPORTUNITY — every interactive surface, including pill-classed links, carries an explicit focus ring.",
      label: "FUTURE OPPORTUNITY",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "active",
      source: "Navigation links, filter chips",
      current: "Active navigation items change weight and background.",
      future: "Formalise as a property rather than per-shell markup.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "selected",
      source: "src/routes/plans.index.tsx",
      current:
        "aria-pressed on filter chips. Metal, network and HSA chips show a tone-aware ring; exchange chips intentionally show no ring at all.",
      future:
        "Keep the exchange exception documented as an intentional product decision, not an inconsistency to repair.",
      label: "OBSERVED VARIATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "checked",
      source: "ui/checkbox.tsx, ui/switch.tsx, ui/radio-group.tsx",
      current: "Available through the primitives; each has exactly one production consumer.",
      future: "Available through existing primitives. No new work implied.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "expanded",
      source: "internal-shell.tsx",
      current: "The internal rail expands and collapses; ui/Collapsible and Accordion are unused.",
      future: "Document the rail's expanded state as a shell property.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "open",
      source: "ui/dialog.tsx, ui/sheet.tsx, ui/select.tsx, ui/dropdown-menu.tsx",
      current: "Radix-owned open state with overlay, focus trap and escape handling.",
      future: "Keep Radix ownership. Do not re-implement open state.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "disabled",
      source: "ui/button.tsx",
      current: "disabled:pointer-events-none disabled:opacity-50, consistent across primitives.",
      future: "Keep. Document that opacity alone must be paired with a real disabled attribute.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "loading",
      source: "ui/skeleton.tsx, ui/spinner.tsx, save-continue-button.tsx, animate-shimmer",
      current:
        "Skeleton blocks, a Spinner primitive, a shimmer utility and one component with a real saving state. Button itself has no loading state.",
      future:
        "FUTURE OPPORTUNITY — a loading property on the action component, modelled on SaveContinueButton.",
      label: "FUTURE OPPORTUNITY",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "error",
      source: "ui/input.tsx, route forms",
      current: "aria-invalid styling plus a text-xs destructive message written per screen.",
      future: "Owned by the future field component rather than by each screen.",
      label: "UNOWNED AREA",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "success",
      source: "StatusBadge, route forms",
      current: "Expressed as a sage-toned badge or sage confirmation text.",
      future: "Part of the single status vocabulary.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "warning",
      source: "StatusBadge, KpiCard",
      current: "Warning tone available on both; 29 measured badge uses.",
      future: "Keep.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "destructive",
      source: "ui/button.tsx, StatusBadge",
      current: "Destructive button variant used twice; destructive badge tone used four times.",
      future:
        "Document when destructive is required — the low usage suggests destructive actions are rare, not that the variant is unnecessary.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "read-only",
      source: "—",
      current: "Not implemented as a distinct state anywhere in production.",
      future:
        "FUTURE OPPORTUNITY — governed screens display recorded values that are not editable; a read-only field state would express that better than a disabled one.",
      label: "FUTURE OPPORTUNITY",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "empty",
      source: "abox/empty-state.tsx, abox/data-table.tsx",
      current: "EmptyState component plus a DataTable empty row.",
      future: "One empty vocabulary across the component and the table row.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "validation (pending / verified / rejected)",
      source: "M08 governed screens",
      current:
        "Expressed through the M08 outcome components with the four controlled outcomes, not through a generic field state.",
      future:
        "Stays governed by M08. Generic form validation must not absorb the controlled outcome vocabulary.",
      label: "GOVERNANCE RULE",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "reduced motion",
      source: "src/styles.css @layer base",
      current: "All animation and transition durations collapse to 0.01ms.",
      future: "Keep as a foundation rule; every future component inherits it automatically.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 1 — foundations",
    },
  ],
};

/* ========================= ACCESSIBILITY ========================= */

export const ACCESSIBILITY_BLUEPRINT: BlueprintGroup = {
  id: "accessibility-blueprint",
  title: "Accessibility blueprint",
  summary:
    "Current accessibility implementation alongside the governance requirement a future canonical system should hold itself to. Nothing is repaired in this phase.",
  rows: [
    {
      item: "Keyboard interaction",
      source: "Radix primitives, shells",
      current:
        "Radix owns keyboard behaviour for select, dialog, sheet and dropdown. Clickable DataTable rows have no keyboard equivalent.",
      future:
        "Every interactive surface reachable and operable by keyboard, including row-level activation.",
      label: "FUTURE OPPORTUNITY",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Focus-visible",
      source: "ui/button.tsx",
      current: "Ring on primitives; pill-classed links rely on the underlying element.",
      future: "An explicit, consistent ring on every focusable surface.",
      label: "FUTURE OPPORTUNITY",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Semantic HTML",
      source: "Across components",
      current:
        "Tables use thead/tbody with scope=col, headings use real heading elements, navigation uses nav landmarks, shells provide a skip link.",
      future: "Keep as a hard requirement for every new component.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Labels and descriptions",
      source: "ui/label.tsx, route forms",
      current: "Association is handled per screen; there is no field component enforcing it.",
      future: "The future field component owns label association, hint and description wiring.",
      label: "UNOWNED AREA",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Error messaging",
      source: "route forms",
      current: "aria-invalid plus visible text; no programmatic description link in every case.",
      future: "Errors linked with aria-describedby by the field component.",
      label: "FUTURE OPPORTUNITY",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Decorative icons",
      source: "Across components",
      current:
        "Icons are consistently decorative and hidden from assistive technology; meaning is always carried by adjacent text.",
      future: "Keep. This is one of the strongest areas of the current implementation.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 4 — iconography & assets",
    },
    {
      item: "Icon-only controls",
      source: "Shells, toolbars",
      current: "Icon-only buttons carry accessible names where they occur.",
      future: "Make the accessible name a required property of any icon-only action.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 4 — iconography & assets",
    },
    {
      item: "Touch targets",
      source: "Shells",
      current: "44px targets on mobile navigation; smaller inline chips exist in dense filters.",
      future: "Document a minimum interactive target and where dense exceptions are acceptable.",
      label: "OBSERVED VARIATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Reduced motion",
      source: "src/styles.css",
      current: "Global; every animation collapses.",
      future: "Keep as a foundation.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 1 — foundations",
    },
    {
      item: "Contrast",
      source: "Metal tokens, status tones",
      current:
        "Metal badges pair each solid fill with a deliberately chosen light or dark foreground; badges render at full opacity by product decision.",
      future: "Keep. Contrast pairing is already an explicit product rule.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 1 — foundations",
    },
    {
      item: "Status announcements",
      source: "ui/sonner.tsx",
      current: "Toasts announce through the library's live region; other status changes do not.",
      future:
        "FUTURE OPPORTUNITY — saving, saved and filter-result-count changes announced politely.",
      label: "FUTURE OPPORTUNITY",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Dialog and drawer focus",
      source: "ui/dialog.tsx, ui/sheet.tsx, ui/drawer.tsx",
      current: "Radix focus trap, escape handling and restore on close.",
      future: "Keep Radix ownership.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Table semantics",
      source: "abox/data-table.tsx",
      current: "sr-only caption, scope=col headers, tabular alignment for numerics.",
      future: "Extend the same semantics to the route-local tables whenever they are revisited.",
      label: "OBSERVED VARIATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Navigation semantics",
      source: "Shells",
      current: "Landmarks, skip link, current-page indication on active items.",
      future: "Require aria-current on every active navigation item in the shared shell base.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Bilingual content",
      source: "M08 screens, marketplace surfaces",
      current: "English and Spanish strings exist for the governed M08 experience.",
      future:
        "Document that no component may hard-code a user-facing string; strings arrive as props.",
      label: "GOVERNANCE RULE",
      phase: "Phase 5 — components, variants, states",
    },
  ],
};

/* ========================== RESPONSIVE ========================== */

export const RESPONSIVE_BLUEPRINT: BlueprintGroup = {
  id: "responsive-blueprint",
  title: "Responsive blueprint",
  summary:
    "Phase 2 measured the real responsive behaviour. This blueprint records it and states the future rule, without changing a single breakpoint.",
  rows: [
    {
      item: "Container",
      source: "Shells and web-experience routes",
      current:
        "Web-experience pages centre on max-w-[88rem] with 23 measured occurrences; headers stay full width; dashboard pages use their own widths.",
      future: "One documented container scale with the 88rem web width as a named value.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Breakpoints",
      source: "Tailwind defaults used throughout",
      current: "sm, md, lg and xl are used; lg is the dominant layout switch.",
      future: "Publish the four as documentation variables for Figma; do not add new ones.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Navigation",
      source: "internal-shell.tsx, marketplace-shell.tsx, member-shell.tsx",
      current: "Rail collapses into a Sheet below lg; the member arc reflows; header links condense.",
      future: "Shared navigation collapse rule in the future shell base.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Tables",
      source: "abox/data-table.tsx",
      current: "Horizontal scroll below a 640px min width rather than column stacking.",
      future:
        "FUTURE DECISION — scroll versus stacked cards on mobile. Both are defensible; evidence does not settle it.",
      label: "FUTURE DECISION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Filters",
      source: "src/routes/plans.index.tsx",
      current: "Sidebar rail on desktop, drawer on mobile.",
      future: "Canonical filter pattern for Shopping/Commerce.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Cards and grids",
      source: "Dashboard and results grids",
      current: "Column counts step down at md and lg; ten measured responsive patterns in total.",
      future: "Named grid patterns rather than per-page column choices.",
      label: "OBSERVED VARIATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Toolbars",
      source: "plans and admin toolbars",
      current: "Wrap onto a second row; some collapse controls into a menu.",
      future: "FUTURE DECISION — wrap versus collapse is not consistent today.",
      label: "FUTURE DECISION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Dialogs and drawers",
      source: "ui/dialog.tsx, ui/sheet.tsx, ui/drawer.tsx",
      current: "Dialog centres; sheet enters from a side; drawer is used only on the reference page.",
      future: "Document when each is appropriate; the choice is currently ad hoc.",
      label: "OBSERVED VARIATION",
      phase: "Phase 5 — components, variants, states",
    },
    {
      item: "Commerce layouts",
      source: "plans, cart, compare",
      current: "Results switch between stacked and horizontal tiles; cart summary stacks below lg.",
      future: "Shopping experience pattern with documented breakpoints.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Dashboard layouts",
      source: "app and agency routes",
      current: "KPI rows step from four to two to one column; tables scroll.",
      future: "Dashboard experience pattern with documented breakpoints.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
  ],
};

/* =========================== DENSITY =========================== */

export const DENSITY_BLUEPRINT: BlueprintGroup = {
  id: "density-blueprint",
  title: "Density blueprint",
  summary:
    "Built only from values Phase 2 actually measured. No density step is invented to make the ramp look complete.",
  rows: [
    {
      item: "Compact (dense admin and filters)",
      source: "Filter chips, dense toolbars, m06 kit",
      current: "h-8 controls, px-3, gap-1 to gap-2, text-xs, 14–16px icons.",
      future: "Named Compact density. Values taken verbatim from production.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Default (most of the product)",
      source: "Button h-9, Input h-9, pill sm/md",
      current: "h-9 to h-10 controls, px-3 to px-4, gap-2, text-sm, 16px icons.",
      future: "Named Default density.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Comfortable (marketing and prominent actions)",
      source: "pill lg, landing hero",
      current: "h-11 controls, px-5 to px-6, gap-3 and above, larger headings.",
      future: "Named Comfortable density, used mainly by Web/Marketing.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Table density",
      source: "abox/DataTable and three route-local tables",
      current: "px-5 py-4 in Core; tighter cells in the kits. Four densities measured.",
      future: "A Density property on the canonical table, with values drawn from those four.",
      label: "OBSERVED VARIATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Card density",
      source: "Route markup and KpiCard",
      current: "p-4, p-5 and p-6 all in use; p-5 is dominant at 187 occurrences.",
      future: "Three named padding steps rather than free choice.",
      label: "OBSERVED VARIATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Gap ramp",
      source: "Measured across routes and components",
      current: "gap-2 at 316 uses, gap-1 at 232, gap-3 at 173, gap-4 at 133; gap-1.5 also occurs.",
      future:
        "Document gap-2 as the default relationship spacing. gap-1.5 stays an OBSERVED VARIATION.",
      label: "CURRENT IMPLEMENTATION",
      phase: "Phase 2 — spacing, layout, responsive",
    },
    {
      item: "Control-height-to-icon relationship",
      source: "ui/button.tsx",
      current: "Icons render at 16px regardless of the h-8 / h-9 / h-10 control height.",
      future:
        "FUTURE DECISION — whether icon size should scale with density. Production says it does not.",
      label: "FUTURE DECISION",
      phase: "Phase 4 — iconography & assets",
    },
  ],
};

export const ALL_BLUEPRINTS: BlueprintGroup[] = [
  ANATOMY_BLUEPRINT,
  VARIANT_BLUEPRINT,
  STATE_BLUEPRINT,
  ACCESSIBILITY_BLUEPRINT,
  RESPONSIVE_BLUEPRINT,
  DENSITY_BLUEPRINT,
];
