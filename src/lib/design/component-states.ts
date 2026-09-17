/**
 * Phase 5 — component state, responsive and accessibility inventory.
 *
 * DOCUMENTATION ONLY. Only states that exist in the current implementation are
 * listed. No missing state is invented and no accessibility issue is repaired
 * here; gaps are recorded as FUTURE OPPORTUNITY.
 */
import type { ComponentStateEntry, RelationshipGroup } from "./types";

export const COMPONENT_STATES: ComponentStateEntry[] = [
  {
    component: "Button",
    states: "default, hover, focus-visible, disabled",
    expression:
      "hover:bg-*/90 or hover:bg-accent; focus-visible:ring-1 ring-ring; disabled:opacity-50 with pointer-events-none and cursor-not-allowed",
    changesContent: "No",
    changesIcon: "No",
    accessibility:
      "Native button semantics; disabled is the real attribute, so it is announced and removed from the tab order",
    source: "ui/button.tsx",
    note: "No loading state in the primitive — consumers express loading themselves.",
  },
  {
    component: "SaveContinueButton",
    states: "idle, saving, saved",
    expression: "Label text swap on a Button",
    changesContent: "Yes — the label text changes",
    changesIcon: "No",
    accessibility:
      "FUTURE OPPORTUNITY — the transition is visual only; there is no live region announcing the save result",
    source: "abox/save-continue-button.tsx",
  },
  {
    component: "StatusBadge",
    states: "six tones; no interactive states",
    expression: "Dot, text and border all derived from --tone via colour-mix, always full opacity",
    changesContent: "No",
    changesIcon: "No — the dot is aria-hidden and constant",
    accessibility: "Status meaning is carried by the visible label text, never by colour alone",
    source: "abox/status-badge.tsx",
  },
  {
    component: "Filter chips (plans)",
    states: "selected, unselected",
    expression:
      "aria-pressed plus the badge treatment itself; exchange filters intentionally carry no visible selection ring",
    changesContent: "No",
    changesIcon: "No",
    accessibility:
      "aria-pressed communicates selection to screen readers even where the ring was deliberately removed",
    source: "src/routes/plans.index.tsx",
    note: "OBSERVED VARIATION — this is a deliberate earlier decision, not an oversight.",
  },
  {
    component: "DataTable row",
    states: "default, hover, clickable, empty",
    expression:
      "hover:bg-panel/40 plus an ember left border that scales in; cursor-pointer only when onRowClick is supplied; empty renders one full-width cell",
    changesContent: "Empty state replaces the body with a single message row",
    changesIcon: "No",
    accessibility:
      "FUTURE OPPORTUNITY — a clickable row is a tr with an onClick, so it is not keyboard reachable on its own",
    source: "abox/data-table.tsx",
  },
  {
    component: "KpiCard",
    states: "default, hover, four tones",
    expression: "Hover lift (-translate-y-0.5), corner brackets reveal, edge sheen sweep",
    changesContent: "No",
    changesIcon: "No",
    accessibility: "Decorative only; the metric is plain text",
    source: "abox/kpi-card.tsx",
  },
  {
    component: "PlanCard",
    states: "default, in-cart, saved, in-compare, best-match, compact, horizontal",
    expression:
      "Disabled add button when in cart; text-sage when saved; text-primary when in compare; a single best-match indicator",
    changesContent: "Yes — the best-match indicator and subsidised price appear conditionally",
    changesIcon: "No",
    accessibility: "aria-pressed on the save and compare toggles",
    source: "abox/plan-card.tsx",
  },
  {
    component: "Input",
    states: "default, focus, disabled, aria-invalid",
    expression: "Ring on focus; invalid styling keyed off aria-invalid",
    changesContent: "No",
    changesIcon: "No",
    accessibility:
      "OBSERVED VARIATION — error text is rendered as adjacent markup; aria-describedby association is applied inconsistently across forms",
    source: "ui/input.tsx and route forms",
  },
  {
    component: "Dialog and Sheet",
    states: "open, closed",
    expression: "Radix data-state with overlay and content animation",
    changesContent: "Yes — the layer mounts and unmounts",
    changesIcon: "No",
    accessibility:
      "Radix supplies focus trap, escape handling and dialog role; the close control carries an sr-only label",
    source: "ui/dialog.tsx, ui/sheet.tsx",
    note: "The cleanest accessibility pattern in the codebase.",
  },
  {
    component: "Shell navigation item",
    states: "active, inactive; rail expanded, collapsed, mobile sheet",
    expression: "Weight and background change on the active link",
    changesContent: "Labels hide when the rail collapses",
    changesIcon: "No — the icon persists in every rail state",
    accessibility: "Skip link with focus:not-sr-only; nav landmarks in each shell",
    source: "abox/internal-shell.tsx, member-shell.tsx, marketplace-shell.tsx",
  },
  {
    component: "Skeleton and Spinner",
    states: "loading",
    expression: "animate-shimmer block; spinner primitive",
    changesContent: "Yes — replaces content while pending",
    changesIcon: "No",
    accessibility:
      "FUTURE OPPORTUNITY — no aria-busy or live-region announcement accompanies loading regions",
    source: "ui/skeleton.tsx, ui/spinner.tsx",
    note: "UNOWNED AREA — each module kit also ships its own LoadingRows.",
  },
  {
    component: "EmptyState",
    states: "empty",
    expression: "Icon frame, title, optional body, optional action",
    changesContent: "It is the content",
    changesIcon: "No",
    accessibility: "Glyph is aria-hidden; the title carries the meaning",
    source: "abox/empty-state.tsx",
  },
  {
    component: "Toast (Sonner)",
    states: "default toast with description",
    expression: "Mounted once in routes/__root.tsx",
    changesContent: "Yes",
    changesIcon: "No",
    accessibility: "Sonner provides the live region",
    source: "ui/sonner.tsx",
    note: "Triggered from cart-store on plan replacement.",
  },
  {
    component: "Global reduced motion",
    states: "reduced-motion",
    expression: "All animation and transition durations collapse to 0.01ms",
    changesContent: "No",
    changesIcon: "No",
    accessibility: "Honours the OS preference for every component at once",
    source: "src/styles.css @layer base",
  },
];

export const COMPONENT_RESPONSIVE: RelationshipGroup = {
  id: "component-responsive",
  title: "Responsive component behaviour",
  summary:
    "Measured behaviour only. Cross-references the Phase 2 responsive audit; no breakpoint or behaviour was changed.",
  entries: [
    {
      pair: "InternalShell rail → mobile",
      observed: "Persistent rail on lg and up; below that the rail moves into a Sheet",
      source: "abox/internal-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "InternalShell search → viewport",
      observed: "The search control with its ⌘K hint renders on lg and up only",
      source: "abox/internal-shell.tsx",
      consistency: "consistent",
      note: "Desktop-only control with no mobile equivalent — recorded, not changed.",
    },
    {
      pair: "MarketplaceShell header → viewport",
      observed: "Header spans full width at every size; the content region is capped at 88rem",
      source: "abox/marketplace-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "MemberShell nav → viewport",
      observed: "Icon nav with a connecting arc through the 36px circles; content capped at 88rem",
      source: "abox/member-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "DataTable → narrow viewport",
      observed:
        "min-w-[640px] inside overflow-x-auto — the table scrolls horizontally rather than restacking",
      source: "abox/data-table.tsx",
      consistency: "consistent",
      note: "No card-per-row mobile adaptation exists. FUTURE OPPORTUNITY only.",
    },
    {
      pair: "Plans filter rail → mobile",
      observed: "Side rail on desktop; the same chips move into a drawer below the breakpoint",
      source: "src/routes/plans.index.tsx",
      consistency: "consistent",
    },
    {
      pair: "PlanCard → layout prop",
      observed:
        "Stacked and horizontal layouts are chosen by the consumer, not by a media query; compact shrinks the mark to 30px",
      source: "abox/plan-card.tsx",
      consistency: "varies",
      note: "OBSERVED VARIATION — a prop-driven rather than breakpoint-driven responsive strategy.",
    },
    {
      pair: "PageHeader → compact variant",
      observed: "Compact is selected by the route, not by viewport",
      source: "abox/page-header.tsx",
      consistency: "consistent",
    },
    {
      pair: "Buttons and links → below 640px",
      observed: "A global rule raises the minimum height to 44px",
      source: "src/styles.css",
      consistency: "consistent",
    },
    {
      pair: "Hero → viewport height",
      observed: "min-h-[calc(100svh-5.25rem)] with centred flex alignment",
      source: "src/routes/index.tsx",
      consistency: "one-off",
      note: "Deliberately viewport-aware rather than a fixed height.",
    },
  ],
};

export const COMPONENT_ACCESSIBILITY: RelationshipGroup = {
  id: "component-accessibility",
  title: "Component accessibility inventory",
  summary:
    "What the components actually do today. Cross-references the Phase 4 icon accessibility findings. Nothing was repaired in this phase.",
  entries: [
    {
      pair: "Semantic HTML",
      observed:
        "Native button, a, table, thead, th scope=col, nav and main are used throughout; the shells render a skip link",
      source: "ui/*, abox/data-table.tsx, the three shells",
      consistency: "consistent",
    },
    {
      pair: "Focus treatment",
      observed: "focus-visible:outline-none with focus-visible:ring-1 ring-ring on the primitives",
      source: "ui/button.tsx and siblings",
      consistency: "consistent",
    },
    {
      pair: "Disabled treatment",
      observed:
        "disabled:pointer-events-none, opacity-50, cursor-not-allowed on the real attribute",
      source: "ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Decorative icons",
      observed: "aria-hidden appears 257 times across 99 files — the dominant convention",
      source: "Product-wide",
      consistency: "consistent",
      note: "Cross-reference Phase 4.",
    },
    {
      pair: "Icon-only controls",
      observed: "36px square with an aria-label or an sr-only label",
      source: "ui/button.tsx size=icon, Dialog and Sheet close",
      consistency: "mostly-consistent",
      note: "FUTURE OPPORTUNITY — there is no shared helper enforcing the accessible name.",
    },
    {
      pair: "Toggle state",
      observed: "aria-pressed on filter chips and on the PlanCard save and compare toggles",
      source: "plans.index.tsx, abox/plan-card.tsx",
      consistency: "consistent",
    },
    {
      pair: "Table semantics",
      observed: "sr-only caption when supplied, th scope=col, optional ariaLabel on the table",
      source: "abox/data-table.tsx",
      consistency: "mostly-consistent",
      note: "FUTURE OPPORTUNITY — clickable rows are not keyboard reachable.",
    },
    {
      pair: "Dialog semantics",
      observed: "Radix supplies role, focus trap, escape and the labelled title",
      source: "ui/dialog.tsx, ui/sheet.tsx",
      consistency: "consistent",
    },
    {
      pair: "Form label association",
      observed: "Label + control pairing where the Label primitive is used",
      source: "ui/label.tsx",
      consistency: "varies",
      note: "FUTURE OPPORTUNITY — module kits define their own Field; error text is not always associated with aria-describedby.",
    },
    {
      pair: "Loading announcements",
      observed: "None — skeletons and spinners are visual only",
      source: "ui/skeleton.tsx, module LoadingRows",
      consistency: "varies",
      note: "FUTURE OPPORTUNITY.",
    },
    {
      pair: "Status colour independence",
      observed: "Every status badge pairs its tone with a visible word",
      source: "abox/status-badge.tsx, m08 OutcomeTag",
      consistency: "consistent",
    },
    {
      pair: "Touch targets",
      observed: "44px minimum on buttons and links below 640px",
      source: "src/styles.css",
      consistency: "consistent",
    },
    {
      pair: "Reduced motion",
      observed: "All durations collapse to 0.01ms at the base layer",
      source: "src/styles.css",
      consistency: "consistent",
    },
    {
      pair: "Bilingual readiness",
      observed: "M08 ships an English/Spanish string table with a language toggle in its kit",
      source: "components/m08/kit.tsx, lib/m08/strings.ts",
      consistency: "varies",
      note: "Module-scoped rather than product-wide — recorded as an UNOWNED AREA at the system level.",
    },
  ],
};
