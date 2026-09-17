/**
 * Phase 8 — foundation dependency chains.
 * DOCUMENTATION ONLY.
 *
 * Chain: Foundation → semantic role → component role → component →
 * compound component → pattern → experience pattern → screen.
 */
import type { DependencyChainEntry, SpecLabel, SpecRule } from "./component-spec-types";

export const DEPENDENCY_CHAINS: DependencyChainEntry[] = [
  {
    component: "Button",
    foundation: "--primary, --primary-foreground, --ring, spacing steps, text-sm",
    semanticRole: "action surface, action foreground, focus ring",
    componentRole: "control background, control label, control ring",
    compound: "ButtonGroup",
    pattern: "PageHeader actions, Card footer, Dialog footer",
    experiencePattern: "Dashboard toolbars",
    screen: "Agency and JET administration screens",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "ActionPill",
    foundation: "--primary, --foreground, hairline, rounded-full",
    semanticRole: "action surface, action outline",
    componentRole: "pill background, pill label",
    compound: "none",
    pattern: "Hero calls to action, card actions",
    experiencePattern: "Web and marketplace actions",
    screen: "Landing, plans, cart",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "FormField",
    foundation: "--foreground, --muted-foreground, --destructive, spacing steps",
    semanticRole: "label text, helper text, error text",
    componentRole: "field label, field helper, field error",
    compound: "Form section",
    pattern: "Form layouts",
    experiencePattern: "Application and settings forms",
    screen: "Member settings, governed module forms",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "StatusBadge",
    foundation: "status tone tokens, text-xs medium, rounded-full",
    semanticRole: "success, warning, danger, info, neutral",
    componentRole: "badge surface, badge foreground",
    compound: "Data row, plan tile",
    pattern: "Status columns and filter chips",
    experiencePattern: "Dashboard tables, plan results",
    screen: "Organization screens, plans",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "MetalBadge",
    foundation: "tier tokens with contrast-chosen foreground",
    semanticRole: "product tier",
    componentRole: "tier surface, tier foreground",
    compound: "PlanCard",
    pattern: "Plan tiles and tier filters",
    experiencePattern: "Shopping",
    screen: "Plans, cart, compare",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "DataTable",
    foundation: "--card, hairline, spacing steps, table type role",
    semanticRole: "table surface, table header, table cell",
    componentRole: "row background, cell padding, header weight",
    compound: "Table with toolbar and pagination",
    pattern: "List screens",
    experiencePattern: "Dashboard administration",
    screen: "Organization, downline, admin screens",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "PageHeader",
    foundation: "heading roles, spacing steps",
    semanticRole: "page title, page description",
    componentRole: "header title, header supporting, header action",
    compound: "Header with actions",
    pattern: "Screen introduction",
    experiencePattern: "All shells",
    screen: "Every internal and marketplace screen",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "Dialog",
    foundation: "--card, overlay scrim, radius, spacing steps",
    semanticRole: "overlay surface, overlay scrim",
    componentRole: "surface, header, body, footer",
    compound: "Confirmation",
    pattern: "Focused decisions",
    experiencePattern: "Dashboard workflows",
    screen: "Administration actions",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "PlanCard",
    foundation: "--card, tier tokens, status tones, numeric type",
    semanticRole: "product surface, product price, product status",
    componentRole: "card surface, tier indicator, amount, status",
    compound: "Plan results grid, comparison",
    pattern: "Product listing",
    experiencePattern: "Shopping",
    screen: "Plans, cart, compare",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    component: "Stack / Inline / Grid",
    foundation: "spacing scale",
    semanticRole: "layout rhythm",
    componentRole: "gap and padding steps",
    compound: "Section layouts",
    pattern: "Every screen layout",
    experiencePattern: "All experiences",
    screen: "All screens",
    label: "UNOWNED AREA",
  },
  {
    component: "LoadingState",
    foundation: "muted surfaces, motion foundation",
    semanticRole: "pending surface",
    componentRole: "skeleton surface, spinner foreground",
    compound: "Table loading, card loading",
    pattern: "Pending content",
    experiencePattern: "All experiences",
    screen: "All data screens",
    label: "FUTURE CANONICAL TARGET",
  },
];

export const DEPENDENCY_GOVERNANCE: SpecRule[] = [
  {
    topic: "Direction of dependency",
    current: "Components read foundation tokens directly from the stylesheet.",
    future: "A component depends on a semantic role, never on a raw token value.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "No upward dependency",
    current:
      "Core primitives carry no domain knowledge; commerce meaning lives in commerce components.",
    future: "A core component must never depend on an experience component or a domain concept.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Screens do not invent roles",
    current: "Several screens apply raw utilities for spacing and tone.",
    future: "A screen composes patterns; it does not define new foundation roles.",
    label: "FUTURE OPPORTUNITY",
  },
];

export const CHAIN_LABELS: SpecLabel[] = [
  "CURRENT IMPLEMENTATION",
  "FUTURE CANONICAL TARGET",
  "FUTURE DECISION",
];
