/**
 * Phase 8 — accessibility specification per component category.
 * DOCUMENTATION ONLY. Current behavior and future governance are separated.
 */
import type { SpecCategory, SpecLabel } from "./component-spec-types";

export interface CategoryA11ySpec {
  category: SpecCategory;
  keyboard: string;
  semantics: string;
  naming: string;
  stateCommunication: string;
  currentBehavior: string;
  futureGovernance: string;
  label: SpecLabel;
}

export const CATEGORY_ACCESSIBILITY: CategoryA11ySpec[] = [
  {
    category: "actions",
    keyboard: "Reachable in visual order; Enter and Space activate.",
    semantics: "Real button for actions, real anchor for navigation.",
    naming: "Label text, or an explicit accessible name for icon-only controls.",
    stateCommunication: "disabled through the attribute; pressed through aria-pressed.",
    currentBehavior:
      "Focus-visible rings ship on the primitives; icon-only naming is left to the caller.",
    futureGovernance: "An icon-only action cannot render without an accessible name.",
    label: "OBSERVED VARIATION",
  },
  {
    category: "forms",
    keyboard: "Tab order follows the visual order; Escape closes pickers.",
    semantics: "Native inputs, or Radix controls with the correct roles.",
    naming: "Every control has a programmatically associated label.",
    stateCommunication:
      "aria-invalid with an associated message; required communicated in text as well as markup.",
    currentBehavior:
      "form.tsx wires label, description and message; bare Label plus Input compositions rely on the caller.",
    futureGovernance: "The canonical field owns association so it cannot be forgotten.",
    label: "OBSERVED VARIATION",
  },
  {
    category: "display",
    keyboard: "Non-interactive unless a control is inside.",
    semantics: "Headings at the correct level; decorative glyphs hidden.",
    naming: "Status is stated in words, not colour alone.",
    stateCommunication: "n/a",
    currentBehavior: "Badges carry text; the shared icon wrapper hides decorative glyphs.",
    futureGovernance: "Any tone-bearing component must remain readable in greyscale.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    category: "containers",
    keyboard: "Must not disturb reading or tab order.",
    semantics: "section, main and aside used where they carry meaning.",
    naming: "Landmarks labelled when more than one of a type exists.",
    stateCommunication: "n/a",
    currentBehavior: "Layout is expressed with utilities; landmarks come from the shells.",
    futureGovernance: "Named layout primitives stay presentational.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    category: "data",
    keyboard: "Sortable headers are real controls; row actions are reachable.",
    semantics: "Real table markup with associated headers.",
    naming: "Tables have an accessible name where more than one appears.",
    stateCommunication: "Sort direction and selection announced.",
    currentBehavior:
      "Primitive and ABox tables use real table semantics; sorting announcement varies.",
    futureGovernance: "Sorting, selection and loading are announced consistently.",
    label: "OBSERVED VARIATION",
  },
  {
    category: "navigation",
    keyboard: "Arrow keys within tab lists; visible focus throughout.",
    semantics: "nav landmarks, lists for item groups.",
    naming: "Each navigation region is labelled.",
    stateCommunication: "aria-current for the active destination.",
    currentBehavior: "Shells implement their own navigation with current-page indication.",
    futureGovernance: "One navigation item contract carrying current-page semantics.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    category: "overlays",
    keyboard: "Focus moves in, is trapped for modal surfaces, and returns on close.",
    semantics: "Radix dialog, menu and popover roles.",
    naming: "Labelled by its title, described by its description.",
    stateCommunication: "aria-expanded on the trigger.",
    currentBehavior: "Radix provides this for all overlay primitives.",
    futureGovernance: "Unchanged; the canonical family inherits the same guarantees.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    category: "feedback",
    keyboard: "Actions inside feedback are reachable; toasts do not steal focus.",
    semantics: "Live regions only where a message appears after an action.",
    naming: "Message text states the condition and the next step.",
    stateCommunication: "Politeness matched to urgency.",
    currentBehavior: "Toasts announce politely; inline validation is associated with its field.",
    futureGovernance: "One announcement policy across alerts, toasts and validation.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    category: "brand",
    keyboard: "The home link is reachable.",
    semantics: "Marks are decorative beside the product name.",
    naming: "A standalone mark that acts as a link carries an accessible name.",
    stateCommunication: "n/a",
    currentBehavior: "Marks are code-drawn SVG with hidden decorative geometry.",
    futureGovernance: "Unchanged.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    category: "commerce",
    keyboard: "Plan selection, comparison and detail are keyboard reachable.",
    semantics: "Selection is a real control, not a clickable card region alone.",
    naming: "Plan name, carrier, tier and identifier are all readable text.",
    stateCommunication: "Selected coverage is stated in words as well as visually.",
    currentBehavior:
      "Tier, exchange status and identifiers are rendered as text on both card forms.",
    futureGovernance: "Tier colour never carries meaning by itself.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    category: "shell",
    keyboard: "Landmark order matches the visual order; navigation is reachable first.",
    semantics: "banner, navigation and main landmarks.",
    naming: "Each shell names its navigation region.",
    stateCommunication: "Current destination indicated.",
    currentBehavior: "Each shell implements landmarks independently.",
    futureGovernance: "A shell contract guarantees landmarks regardless of experience.",
    label: "CURRENT IMPLEMENTATION",
  },
];

export const A11Y_CROSS_RULES: string[] = [
  "GOVERNANCE RULE — colour is never the only carrier of meaning, in any component or state.",
  "GOVERNANCE RULE — every interactive element has a visible focus indicator.",
  "GOVERNANCE RULE — ARIA is used only where native semantics cannot express the relationship.",
  "GOVERNANCE RULE — disabled controls remain readable; contrast is not sacrificed to express unavailability.",
  "GOVERNANCE RULE — bilingual content must not change semantics; labels and states translate, roles do not.",
  "FUTURE DECISION — one focus treatment for the entire system is not yet chosen.",
  "FUTURE OPPORTUNITY — a comfortable minimum touch target on touch viewports, where dense controls are currently 32px.",
  "FUTURE OPPORTUNITY — reduced-motion handling stated per component rather than globally.",
  "FUTURE CANONICAL TARGET — loading announcements for operations long enough to notice.",
];
