/**
 * Phase 8 — Feedback category specification.
 * DOCUMENTATION ONLY.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const feedback = (
  name: string,
  purpose: string,
  file: string,
  exportName: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec> = {},
): CanonicalComponentSpec => ({
  name,
  category: "feedback",
  purpose,
  anatomy: [
    { part: "Root", requirement: "required", role: "tinted surface" },
    { part: "Icon", requirement: "optional", role: "tone glyph" },
    { part: "Title", requirement: "optional", role: "what happened" },
    { part: "Description", requirement: "required", role: "detail and next step" },
    { part: "Action", requirement: "optional", role: "recovery or dismissal" },
  ],
  contentModel: ["Plain language.", "State the consequence and the next step."],
  properties: [
    {
      name: "tone",
      propertyClass: "visual-variant",
      values: "info, success, warning, danger",
      figma: "variant-property",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  variants: [
    {
      kind: "semantic",
      name: "tone",
      values: "info, success, warning, danger",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  states: [
    {
      state: "default",
      affects: "tint, border, icon",
      accessibility: "text carries the meaning",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  sizes: "One size; width follows the container.",
  density: "Follows the host experience.",
  dependencies: {
    typography: "title medium, body text-sm",
    spacing: "p-4 to p-5, gap-2 icon to text",
    color: "tone roles with tinted surfaces",
    shape: "rounded-2xl family",
    icon: "16px",
  },
  responsive: "Stacks its action below the text on narrow viewports.",
  accessibility: "Never color alone; live regions only where the message appears after an action.",
  interaction: "Static unless an action or dismissal is supplied.",
  composition: {
    allowedChildren: "Text and at most one action.",
    prohibited: "Forms and long content.",
    parentPatterns: "Page tops, card bodies, form sections.",
  },
  experienceExtensions: "Compliance messaging in the governed modules uses its own presentation.",
  currentImplementation: [{ file, exportName, consumers }],
  observedVariations: [],
  futureCanonicalTarget: "One tone vocabulary shared by alert, toast, badge and inline validation.",
  figmaMapping: "Component with Tone, Title and Action properties.",
  migrationNotes: "No migration implied.",
  governanceStatus: "documented current component",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const FEEDBACK_SPECS: SpecCategoryGroup = {
  id: "spec-feedback",
  category: "feedback",
  title: "Feedback",
  summary:
    "Feedback is delivered by alerts, toasts and inline validation. Their tone vocabularies overlap with status badges; the overlap is documented rather than merged.",
  specs: [
    feedback(
      "Alert",
      "Explain a condition in place, attached to the content it concerns.",
      "src/components/ui/alert.tsx",
      "Alert, AlertTitle, AlertDescription",
      "primitive",
    ),
    feedback(
      "Toast",
      "Confirm a completed action without interrupting.",
      "src/components/ui/sonner.tsx",
      "Toaster, sonner toast",
      "mounted once in the root route",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "floating notice" },
          { part: "Icon", requirement: "optional", role: "tone glyph" },
          { part: "Label", requirement: "required", role: "message" },
          { part: "Action", requirement: "optional", role: "undo or view" },
        ],
        accessibility: "Announced politely; must not be the only record of an important outcome.",
        responsive: "Anchors to a viewport edge and stacks.",
      },
    ),
    feedback(
      "Notification",
      "Persist a message the user can return to.",
      "n/a",
      "n/a",
      "no persistent notification surface exists",
      {
        currentImplementation: [],
        futureCanonicalTarget:
          "No inbox or notification centre exists in the application, so a contract cannot be derived from evidence.",
        governanceStatus: "future decision",
        label: "FUTURE DECISION",
      },
    ),
    feedback(
      "Confirmation",
      "Require explicit agreement before a consequential action.",
      "src/components/ui/alert-dialog.tsx",
      "AlertDialog",
      "confirmation flows",
      {
        accessibility: "The confirming action names the consequence, not just 'OK'.",
        futureCanonicalTarget:
          "High-impact actions pair confirmation with a meaningful preview of what will change.",
      },
    ),
    feedback(
      "InlineValidation",
      "Report validity at the field that caused it.",
      "src/components/ui/form.tsx",
      "FormMessage",
      "form screens",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "message region under the control" },
          { part: "Error", requirement: "required", role: "validation text" },
        ],
        accessibility: "Referenced by aria-describedby and paired with aria-invalid.",
      },
    ),
    feedback(
      "ErrorState",
      "Explain that content could not be loaded and offer recovery.",
      "route markup and EmptyState",
      "composed per screen",
      "unowned",
      {
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "A named error state distinct from the empty state, with a retry contract.",
        governanceStatus: "future canonical target",
      },
    ),
  ],
};
