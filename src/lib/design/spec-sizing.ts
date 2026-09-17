/**
 * Phase 8 — size and density framework.
 * DOCUMENTATION ONLY. Observed production differences are preserved, not normalized.
 */
import type { SpecLabel, SpecRule } from "./component-spec-types";

export interface SizeSpec {
  step: string;
  height: string;
  padding: string;
  typography: string;
  usedBy: string;
  source: string;
  label: SpecLabel;
  note?: string;
}

export const CONTROL_SIZE_EVIDENCE: SizeSpec[] = [
  {
    step: "Button sm",
    height: "h-8 (32px)",
    padding: "px-3",
    typography: "text-sm font-medium",
    usedBy: "Compact toolbars and inline actions.",
    source: "src/components/ui/button.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "Button default",
    height: "h-9 (36px)",
    padding: "px-4",
    typography: "text-sm font-medium",
    usedBy: "Primitive default across dialogs, forms and internal screens.",
    source: "src/components/ui/button.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "Button lg",
    height: "h-10 (40px)",
    padding: "px-6",
    typography: "text-sm font-medium",
    usedBy: "Prominent single actions.",
    source: "src/components/ui/button.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "ACTION_PILL xs",
    height: "h-8 (32px)",
    padding: "px-3",
    typography: "text-sm font-medium",
    usedBy: "Dense table and card actions.",
    source: "src/components/abox/action-pill.ts",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "ACTION_PILL sm / smCard",
    height: "h-9 (36px)",
    padding: "px-4",
    typography: "text-sm font-medium",
    usedBy: "Standard internal actions; smCard is the card-context spelling.",
    source: "src/components/abox/action-pill.ts",
    label: "OBSERVED VARIATION",
    note: "Two names produce the same height; both are in use and both are preserved.",
  },
  {
    step: "ACTION_PILL md",
    height: "h-10 (40px)",
    padding: "px-5",
    typography: "text-sm font-medium",
    usedBy: "Marketplace and web-experience actions.",
    source: "src/components/abox/action-pill.ts",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "ACTION_PILL lg",
    height: "h-11 (44px)",
    padding: "px-6",
    typography: "text-sm font-medium",
    usedBy: "Landing and hero calls to action.",
    source: "src/components/abox/action-pill.ts",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "Input / Select",
    height: "h-9 (36px) baseline",
    padding: "px-3",
    typography: "text-sm",
    usedBy: "All form primitives.",
    source: "src/components/ui/input.tsx, select.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "Member nav icon circle",
    height: "36px",
    padding: "n/a",
    typography: "n/a",
    usedBy: "Member shell side navigation.",
    source: "src/components/abox/member-shell.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
];

export const DENSITY_MODES: SizeSpec[] = [
  {
    step: "Dashboard dense",
    height: "table rows and KPI cards on the tighter scale",
    padding: "px-3 / p-5 families",
    typography: "text-sm dominant",
    usedBy: "InternalShell screens.",
    source: "src/components/abox/internal-shell.tsx, data-table.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "Marketplace comfortable",
    height: "plan tiles and filters on a roomier scale",
    padding: "p-5 dominant",
    typography: "text-sm body with larger titles",
    usedBy: "MarketplaceShell screens.",
    source: "src/components/abox/marketplace-shell.tsx, plan-card.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    step: "Web experience open",
    height: "hero and marketing sections",
    padding: "large section padding, 88rem container",
    typography: "larger display headings",
    usedBy: "Landing and public routes.",
    source: "src/routes/index.tsx",
    label: "CURRENT IMPLEMENTATION",
  },
];

export const SIZING_GOVERNANCE: SpecRule[] = [
  {
    topic: "One ladder or three",
    current:
      "Button, ACTION_PILL and form primitives each carry their own ladder; 32 / 36 / 40 / 44px all appear.",
    future:
      "Whether a single canonical ladder can absorb all three is not derivable from evidence.",
    label: "FUTURE DECISION",
  },
  {
    topic: "36px versus 40px",
    current: "Both are deliberate: 36px reads as internal density, 40px as retail prominence.",
    future: "If a future library keeps both, they must be named by intent, not by number.",
    label: "FUTURE DECISION",
  },
  {
    topic: "Density as a property",
    current: "Density is expressed through class choices inside screens, never as a prop.",
    future: "Density becomes an explicit property on data and list components only.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    topic: "Touch targets",
    current: "h-8 controls fall below the 44px comfortable touch target on dense internal screens.",
    future: "A future canonical rule would raise minimum interactive height on touch viewports.",
    label: "FUTURE OPPORTUNITY",
  },
  {
    topic: "Preservation",
    current: "All observed heights ship today and are correct in their contexts.",
    future: "No production height changes in this phase or as a consequence of this specification.",
    label: "GOVERNANCE RULE",
  },
];
