/**
 * Phase 6 — component-vs-pattern decision framework.
 *
 * DOCUMENTATION ONLY. The framework is used here to CLASSIFY what already
 * exists and to identify future targets. It is never used as a reason to
 * delete, rewrite, rename or consolidate production code in this phase.
 *
 * Consumers: /design-system, /design-guide.
 */
import type { ClassificationCriterion, BlueprintRow } from "./types";

/** Observable criteria. Each one is answerable by reading the codebase. */
export const CLASSIFICATION_CRITERIA: ClassificationCriterion[] = [
  {
    criterion: "Reusable independently",
    question: "Can it be dropped into an unrelated screen and still make sense?",
    test: "Count import sites in unrelated route families. Two or more unrelated families means yes.",
    indicates: "Primitive, Component or Compound component",
    example:
      "StatusBadge is imported by 89 files across marketplace, member and internal routes — independently reusable.",
    phase: "Phase 5 — components, variants, states",
  },
  {
    criterion: "Stable anatomy",
    question: "Do the parts appear in the same order and relationship every time?",
    test: "Compare rendered parts across consumers. Optional parts are fine; reordered parts are not.",
    indicates: "Component or Compound component",
    example:
      "PageHeader always renders eyebrow → title → description → actions, with each part optional.",
    phase: "Phase 5 — components, variants, states",
  },
  {
    criterion: "Consistent API",
    question: "Is there a single prop surface, or does each consumer wire it up differently?",
    test: "Read the exported prop type. A props interface means a component; a copied class string means a pattern.",
    indicates: "Component if a props interface exists; Pattern if it is markup convention",
    example:
      "ACTION_PILL exports class strings and no element — it is a pattern with a central owner, not a component.",
    phase: "Phase 5 — components, variants, states",
  },
  {
    criterion: "Repeated composition",
    question: "Is the same arrangement of several components rebuilt repeatedly in route files?",
    test: "Search for the arrangement. Three or more occurrences with no owner is a pattern candidate.",
    indicates: "Pattern",
    example:
      "The surface card `rounded-2xl border bg-card p-5` recurs across routes with no component owner.",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    criterion: "Semantic responsibility",
    question: "Does it carry meaning the product depends on, beyond looking a certain way?",
    test: "Would changing its output change what the user understands, not just how it looks?",
    indicates: "Component",
    example: "MetalBadge encodes a plan tier; its colour is meaning, not decoration.",
    phase: "Phase 5 — components, variants, states",
  },
  {
    criterion: "Visual responsibility",
    question: "Does it own a distinct visual treatment that must stay identical everywhere?",
    test: "Check whether consumers pass styling overrides. Heavy overriding means the boundary is wrong.",
    indicates: "Component",
    example: "KpiCard owns its hover lift, brackets and sheen; consumers pass data, not classes.",
    phase: "Phase 5 — components, variants, states",
  },
  {
    criterion: "Interaction responsibility",
    question: "Does it own focus, keyboard behaviour or disabled semantics?",
    test: "Look for focus-visible, aria and disabled handling inside the implementation.",
    indicates: "Primitive",
    example: "Button owns focus-visible ring, disabled pointer-events and the 16px icon contract.",
    phase: "Phase 5 — components, variants, states",
  },
  {
    criterion: "Cross-experience reuse",
    question: "Is it consumed by more than one experience?",
    test: "Group consumers by route family: marketing, shopping, dashboard/admin.",
    indicates: "ABox Core rather than experience-specific",
    example: "EmptyState is used in shopping and admin routes — Core.",
    phase: "Phase 5 — components, variants, states",
  },
  {
    criterion: "Context dependence",
    question: "Does it need surrounding state, a store or a route to function?",
    test: "Check imports for stores, routers and loaders.",
    indicates: "Experience pattern or Route-local implementation",
    example:
      "The plans filter rail depends on the browse store and URL state — an experience pattern, not a Core component.",
    phase: "Phase 6 — direct production read",
  },
  {
    criterion: "Responsive behaviour",
    question: "Does it own its own breakpoint transformation, or inherit the page's?",
    test: "Look for responsive utilities inside the implementation.",
    indicates: "Component if self-contained; Pattern if the page drives it",
    example: "DataTable owns its own horizontal scroll and min-width; the page does not manage it.",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    criterion: "Data dependence",
    question: "Does it fetch, mutate or derive product data?",
    test: "Check for server functions, queries or store subscriptions.",
    indicates: "Screen or experience pattern — never a Core component",
    example:
      "Cart totals derive from the cart store; the display pieces are components, the derivation is not.",
    phase: "Phase 6 — direct production read",
  },
];

/**
 * The existing implementation classified against the framework.
 * `current` is what the code is today; `future` is where the framework
 * would place it in a canonical system.
 */
export const CLASSIFICATION_RESULTS: BlueprintRow[] = [
  {
    item: "Button",
    source: "src/components/ui/button.tsx",
    current:
      "shadcn primitive, 6 variants × 5 sizes, owns focus/disabled/icon sizing. 22 direct consumers.",
    future: "Primitive. Stays exactly where it is in the hierarchy.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "ACTION_PILL",
    source: "src/components/abox/action-pill.ts",
    current:
      "Exported class strings with no element or DOM contract. 35 files, 82 references. Centralized in the first centralization pass.",
    future:
      "Pattern with a central owner. A future phase could decide whether it becomes a Button variant set — that decision is not made here.",
    label: "FUTURE DECISION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "StatusBadge",
    source: "src/components/abox/status-badge.tsx",
    current: "6 tones, semantic meaning, 89 consumers across every experience.",
    future: "ABox Core component. Highest-reach component in the system.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "PageHeader",
    source: "src/components/abox/page-header.tsx",
    current: "Composes motion, icon, eyebrow, title, description and an action area. 25 consumers.",
    future: "Compound component.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "DataTable",
    source: "src/components/abox/data-table.tsx",
    current:
      "Column-driven table with empty row, hover affordance, alignment and sr-only caption. 20 consumers.",
    future: "Compound component.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Surface card",
    source: "Repeated route markup: rounded-2xl border bg-card p-5",
    current:
      "No component owner. Border token varies between border and hairline; padding varies between p-4, p-5 and p-6.",
    future:
      "Pattern. A future owner is possible but would change rendered output, so the variation is recorded and left alone.",
    label: "UNOWNED AREA",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    item: "Form field",
    source: "ui/label + ui/input, m06 Field/TextInput, m08 field helpers, lucie-app Field",
    current: "Multiple coexisting field systems across Core and route-local kits.",
    future: "Pattern requiring a future decision. No winner is selected in this phase.",
    label: "OBSERVED DUPLICATE",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Results toolbar",
    source: "src/routes/plans.index.tsx",
    current: "Sort select, shopping-mode bar and edit-quote action assembled inline in one route.",
    future: "Experience pattern (Shopping/Commerce).",
    label: "UNOWNED AREA",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Filter rail",
    source: "src/routes/plans.index.tsx",
    current:
      "Chips reuse the real MetalBadge and StatusBadge treatments; drawer on mobile; URL/store backed.",
    future: "Experience pattern (Shopping/Commerce) composed from Core components.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "InternalShell / MarketplaceShell / MemberShell",
    source: "src/components/abox/*-shell.tsx",
    current: "Three shells covering 123 routes; each owns navigation, header and responsive rail.",
    future:
      "Shell / Application Structure components inside Core. They remain three, because they serve three genuinely different navigation models.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "M06 / M08 / Lucie / Lucie-app kits",
    source: "src/components/m06/*, m08/*, lucie/*, lucie-app/*",
    current:
      "Route-local kits with their own tags, fields, tables, empty states and toasts, built for governed module screens.",
    future:
      "Route-local implementations. Some members are Core candidates; identifying them is a future decision, not this phase's job.",
    label: "OBSERVED OVERLAP",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "ai-elements",
    source: "src/components/ai-elements/*",
    current:
      "Conversation, message, prompt-input and shimmer, reachable only through PlanAiAssistant, which has no located route consumer.",
    future: "Route-local implementation pending a decision about the assistants themselves.",
    label: "POSSIBLY UNUSED",
    phase: "Phase 5 — components, variants, states",
  },
];
