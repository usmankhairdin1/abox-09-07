/**
 * Phase 8 — state governance for future ABox Core components.
 * DOCUMENTATION ONLY. Existing production state behavior is preserved as-is.
 */
import type { SpecLabel, SpecRule } from "./component-spec-types";

export interface StateSpec {
  state: string;
  definition: string;
  mayAffect: string;
  accessibility: string;
  currentEvidence: string;
  label: SpecLabel;
}

export const STATE_VOCABULARY: StateSpec[] = [
  {
    state: "default",
    definition: "Resting appearance with no interaction and no validity signal.",
    mayAffect: "background, border, text, icon",
    accessibility: "Nothing announced beyond the accessible name and role.",
    currentEvidence: "All primitives render a resting style from cva base classes.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "hover",
    definition: "Pointer is over an interactive element.",
    mayAffect: "background, border, text, cursor",
    accessibility: "Never the only signal; not announced.",
    currentEvidence: "Button and ACTION_PILL both shift background on hover.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "focus",
    definition: "Element holds focus by any means.",
    mayAffect: "ring",
    accessibility: "Focus must always be perceivable.",
    currentEvidence: "Primitives rely on focus-visible rather than focus.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "focus-visible",
    definition: "Focus arrived by keyboard or equivalent.",
    mayAffect: "ring, outline offset",
    accessibility: "Required for every interactive component.",
    currentEvidence: "button.tsx, input.tsx and others use a --ring based focus-visible ring.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "active",
    definition: "Element is being pressed.",
    mayAffect: "background, transform",
    accessibility: "Not announced.",
    currentEvidence: "Present on some actions, absent on others.",
    label: "OBSERVED VARIATION",
  },
  {
    state: "selected",
    definition: "Element is one of a set and is currently chosen.",
    mayAffect: "background, border, text, indicator",
    accessibility: "aria-pressed or aria-selected depending on the role.",
    currentEvidence:
      "Plan filter chips use aria-pressed; exchange filters intentionally show no visible selection ring.",
    label: "OBSERVED VARIATION",
  },
  {
    state: "checked",
    definition: "Binary control is on.",
    mayAffect: "background, indicator",
    accessibility: "Native or Radix checked semantics.",
    currentEvidence: "checkbox.tsx, switch.tsx, radio-group.tsx.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "open",
    definition: "An overlay owned by this trigger is displayed.",
    mayAffect: "trigger background, chevron rotation",
    accessibility: "aria-expanded on the trigger.",
    currentEvidence: "Radix data-state=open styling across dropdown, select, popover, dialog.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "expanded",
    definition: "Inline disclosure is showing its content.",
    mayAffect: "indicator rotation, height",
    accessibility: "aria-expanded and a controlled region.",
    currentEvidence: "accordion.tsx, collapsible.tsx.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "disabled",
    definition: "Interaction is unavailable.",
    mayAffect: "opacity, cursor, pointer-events",
    accessibility: "disabled attribute or aria-disabled; must remain readable.",
    currentEvidence: "Primitives use opacity-50 plus pointer-events-none rather than a token.",
    label: "OBSERVED VARIATION",
  },
  {
    state: "loading",
    definition: "The component is waiting on work it triggered.",
    mayAffect: "icon, label, interaction",
    accessibility: "Status should be announced politely for long operations.",
    currentEvidence: "Button has no loading state; screens compose Spinner or Skeleton separately.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    state: "error",
    definition: "Validation or operation failed.",
    mayAffect: "border, text, icon, helper region",
    accessibility: "aria-invalid plus an associated message.",
    currentEvidence: "form.tsx FormMessage; Alert destructive variant.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "success",
    definition: "Operation completed or value verified.",
    mayAffect: "border, text, icon",
    accessibility: "Announced only when the user needs confirmation.",
    currentEvidence: "StatusBadge success tone; sonner success toast.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "warning",
    definition: "Attention needed but not blocking.",
    mayAffect: "border, text, icon, background tint",
    accessibility: "Text must state the condition, not only color.",
    currentEvidence: "warning tone used by badges, callouts and the reference kit.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "info",
    definition: "Neutral supporting information.",
    mayAffect: "background tint, icon",
    accessibility: "No live region.",
    currentEvidence: "info tone used for on-exchange status.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    state: "pressed",
    definition: "Toggle is currently on.",
    mayAffect: "background, border, indicator",
    accessibility: "aria-pressed.",
    currentEvidence: "toggle.tsx, toggle-group.tsx and plan filter chips.",
    label: "CURRENT IMPLEMENTATION",
  },
];

export const STATE_GOVERNANCE: SpecRule[] = [
  {
    topic: "Color is never the only signal",
    current: "Status badges pair a tone with explicit text.",
    future: "Every state must be readable without color: text, icon or shape carries it too.",
    label: "GOVERNANCE RULE",
  },
  {
    topic: "Disabled treatment",
    current: "opacity-50 and pointer-events-none, applied per primitive.",
    future: "A dedicated disabled foreground and surface role would keep contrast predictable.",
    label: "FUTURE DECISION",
  },
  {
    topic: "Focus treatment",
    current: "Several ring widths and offsets exist across primitives and custom controls.",
    future: "One focus treatment for the whole system.",
    label: "FUTURE DECISION",
  },
  {
    topic: "Selection without a ring",
    current: "Exchange filters deliberately expose selection only through aria-pressed.",
    future: "Recorded as an intentional accessibility-first choice, not a defect to normalize.",
    label: "OBSERVED VARIATION",
  },
  {
    topic: "Loading",
    current: "No component owns a loading state; screens compose it.",
    future: "Action components gain a loading state that preserves width and announces progress.",
    label: "FUTURE CANONICAL TARGET",
  },
];
