/**
 * Phase 11 — accessibility readiness.
 * DOCUMENTATION ONLY. No accessibility implementation is changed. This records
 * the evidence found in the current code and the gaps a future canonical system
 * would have to close.
 */
import type { AccessibilityReadinessRecord } from "./canonical-readiness-types";

export const ACCESSIBILITY_READINESS: AccessibilityReadinessRecord[] = [
  {
    area: "Keyboard access",
    currentEvidence:
      "Interactive surfaces are real buttons, links and Radix primitives, so they are reachable by keyboard.",
    gap: "Route-local overlays such as the plans filter handle their own key behaviour separately from the Dialog primitive.",
    readiness: "NEEDS TECHNICAL DECISION",
    status: "OBSERVED VARIATION",
  },
  {
    area: "Focus visibility",
    currentEvidence: "Focus rings come from the primitives' default treatment.",
    gap: "No single focus token is defined; the treatment differs where selection rings were deliberately removed.",
    readiness: "NEEDS DESIGN DECISION",
    status: "FUTURE DECISION",
  },
  {
    area: "Disabled states",
    currentEvidence: "Primitives carry disabled styling; ABox components mostly inherit it.",
    gap: "No dedicated disabled token exists, carried forward from Phase 7.",
    readiness: "NEEDS DESIGN DECISION",
    status: "FUTURE DECISION",
  },
  {
    area: "Labels",
    currentEvidence: "Form controls use the Label primitive where the primitives are used.",
    gap: "Route-kit fields label independently, so labelling consistency depends on the field decision.",
    readiness: "BLOCKED BY DUPLICATE",
    status: "OBSERVED DUPLICATE",
  },
  {
    area: "Decorative icons",
    currentEvidence: "Shared icon wrappers set aria-hidden, including the dental icon wrapper.",
    gap: "Inline decorative SVGs in decor and auth components are not centrally governed.",
    readiness: "READY FOR FUTURE DECISION",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    area: "Icon-only controls",
    currentEvidence: "Icon-only controls in the shells carry accessible names.",
    gap: "No rule records which icon-only controls must carry a name; it is done case by case.",
    readiness: "NEEDS EVIDENCE",
    status: "OBSERVED VARIATION",
  },
  {
    area: "Semantic HTML",
    currentEvidence: "Shells use header, nav and main; tables use real table markup.",
    gap: "Marketing section headings have no owning component, so heading levels are set per section.",
    readiness: "NEEDS OWNER",
    status: "UNOWNED AREA",
  },
  {
    area: "ARIA",
    currentEvidence:
      "Filter chips communicate selection through aria-pressed, including where the visible ring was removed.",
    gap: "No documented rule for when a visual state may be dropped while the ARIA state remains.",
    readiness: "NEEDS DESIGN DECISION",
    status: "OBSERVED VARIATION",
  },
  {
    area: "Screen reader support",
    currentEvidence: "Radix primitives supply announcements for overlays and menus.",
    gap: "Route-local overlays and assistants are outside that coverage.",
    readiness: "BLOCKED BY DUPLICATE",
    status: "OBSERVED DUPLICATE",
  },
  {
    area: "Touch targets",
    currentEvidence: "Controls are 36px or 40px high depending on surface.",
    gap: "36px is below a 44px comfortable target; whether that is acceptable is undecided.",
    readiness: "NEEDS DESIGN DECISION",
    status: "FUTURE DECISION",
  },
  {
    area: "Reduced motion",
    currentEvidence: "Animations are limited and mostly decorative.",
    gap: "No reduced-motion handling is recorded in the audit.",
    readiness: "NEEDS EVIDENCE",
    status: "FUTURE DECISION",
  },
  {
    area: "Contrast roles",
    currentEvidence:
      "Metal badge foregrounds are chosen for contrast against each tier background; badge opacity was removed so tones render at full strength.",
    gap: "No contrast rule is recorded for arbitrary tone-on-surface combinations.",
    readiness: "READY FOR FUTURE DECISION",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    area: "Error and success states",
    currentEvidence:
      "Governed module screens present controlled outcomes; general error presentation is written per route.",
    gap: "No shared error surface exists, so announcement behaviour varies.",
    readiness: "NEEDS OWNER",
    status: "UNOWNED AREA",
  },
];

export const ACCESSIBILITY_RULES: string[] = [
  "GOVERNANCE RULE — this audit changes no accessibility behaviour; it records what the code does today.",
  "GOVERNANCE RULE — a gap is recorded from code evidence, never assumed from appearance.",
  "GOVERNANCE RULE — any future canonicalization touching an interactive surface requires accessibility review under the change governance rules.",
  "GOVERNANCE RULE — where a visible state was intentionally removed, the assistive-technology state must remain; that is recorded as current behaviour, not a defect.",
];
