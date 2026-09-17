/**
 * Phase 9 — accessibility traced through the dependency chain.
 * DOCUMENTATION ONLY. Current behavior, observed gaps and future governance
 * are recorded separately and never merged.
 */
import type { SpecLabel } from "./graph-types";

export interface A11yTrace {
  chain: string;
  requirement: string;
  currentImplementation: string;
  observedGap: string;
  futureGovernance: string;
  status: SpecLabel;
}

export const ACCESSIBILITY_TRACES: A11yTrace[] = [
  {
    chain: "Foundation status tone → status indicator → StatusBadge → data row → dashboard screen",
    requirement: "Status must be readable without colour.",
    currentImplementation: "StatusBadge renders words beside the tone across 89 files.",
    observedGap:
      "None found in the badge itself; the tone vocabulary overlaps with Alert and toast.",
    futureGovernance: "One semantic tone vocabulary, still always paired with text.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    chain: "Foundation tier token → tier indicator → MetalBadge → plan card → plans screen",
    requirement: "Tier text must stay legible on every tier background.",
    currentImplementation: "The badge selects a light or dark foreground against the tier colour.",
    observedGap: "None found.",
    futureGovernance: "Contrast selection stays a property of the tier role, not of the call site.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    chain: "Foundation ring → focus role → every interactive component",
    requirement: "Every interactive element shows a visible focus indicator.",
    currentImplementation: "Primitives implement focus-visible rings.",
    observedGap: "Ring width and offset differ between primitives and custom controls.",
    futureGovernance: "One focus treatment for the whole system.",
    status: "FUTURE DECISION",
  },
  {
    chain: "Component role glyph slot → icon-only action → toolbars and table rows",
    requirement: "An icon-only control needs an accessible name.",
    currentImplementation: "Button exposes icon sizes; naming is left to the caller.",
    observedGap: "Nothing enforces the name at the component boundary.",
    futureGovernance: "An icon-only action cannot render without an accessible name.",
    status: "OBSERVED VARIATION",
  },
  {
    chain: "Field compound → label, helper and error → form patterns → settings and module screens",
    requirement: "Label, helper and error are programmatically associated with the control.",
    currentImplementation: "form.tsx wires all three.",
    observedGap: "Bare Label plus Input compositions rely on the caller to do the wiring.",
    futureGovernance: "The canonical field owns association so it cannot be skipped.",
    status: "OBSERVED VARIATION",
  },
  {
    chain: "Filter control → selected state → plans screen",
    requirement: "Selection must be perceivable by assistive technology.",
    currentImplementation:
      "Exchange filters expose selection through aria-pressed with no visible ring.",
    observedGap: "None. The absence of the ring was a deliberate request.",
    futureGovernance: "Recorded as an intentional choice, not a defect to normalize.",
    status: "OBSERVED VARIATION",
  },
  {
    chain: "Overlay surface → Dialog and Sheet → dashboard workflows",
    requirement: "Focus enters, is trapped and returns; Escape dismisses.",
    currentImplementation: "Radix provides this for every overlay primitive.",
    observedGap: "None found.",
    futureGovernance: "Unchanged; the canonical overlay family inherits the same guarantees.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    chain: "Control height role → dense controls → dashboard toolbars on touch viewports",
    requirement: "Interactive targets should be comfortable on touch.",
    currentImplementation: "Dense toolbars use 32px controls.",
    observedGap: "Below the comfortable touch minimum on touch viewports.",
    futureGovernance: "A minimum interactive height on touch, if ever approved.",
    status: "FUTURE OPPORTUNITY",
  },
  {
    chain: "Loading surface → tables and cards → every data screen",
    requirement: "Long waits should be announced, not only shown.",
    currentImplementation: "Skeletons and spinners are composed per screen.",
    observedGap: "No component announces a pending state.",
    futureGovernance: "Loading announcements for operations long enough to notice.",
    status: "FUTURE CANONICAL TARGET",
  },
  {
    chain: "Shell → landmarks → every screen inside it",
    requirement: "Banner, navigation and main landmarks with matching keyboard order.",
    currentImplementation: "Each shell implements landmarks independently.",
    observedGap: "Three independent implementations of the same guarantee.",
    futureGovernance: "A shell contract guarantees landmarks regardless of experience.",
    status: "OBSERVED OVERLAP",
  },
  {
    chain: "Disabled treatment → every control",
    requirement: "A disabled control stays readable.",
    currentImplementation: "opacity-50 applied per primitive.",
    observedGap: "Contrast depends on the surface behind the control.",
    futureGovernance: "A dedicated disabled foreground role.",
    status: "FUTURE DECISION",
  },
];
