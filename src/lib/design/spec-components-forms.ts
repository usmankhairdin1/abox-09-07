/**
 * Phase 8 — Forms category specification.
 * DOCUMENTATION ONLY.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const field: CanonicalComponentSpec = {
  name: "FormField",
  category: "forms",
  purpose: "Bind a label, control, helper text and error message into one accessible unit.",
  anatomy: [
    { part: "Root", requirement: "required", role: "field wrapper owning vertical rhythm" },
    { part: "Label", requirement: "required", role: "names the control" },
    { part: "Control", requirement: "required", role: "the focusable input" },
    { part: "Helper", requirement: "optional", role: "persistent guidance" },
    { part: "Error", requirement: "conditional", role: "validation message" },
  ],
  contentModel: ["One label.", "One control.", "Helper or error, not both saying the same thing."],
  properties: [
    {
      name: "label",
      propertyClass: "content",
      values: "string",
      figma: "text-property",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "helper",
      propertyClass: "content",
      values: "string",
      figma: "text-property",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "error",
      propertyClass: "state",
      values: "string",
      figma: "variant-property",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "required",
      propertyClass: "accessibility",
      values: "boolean",
      figma: "boolean-property",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  variants: [
    { kind: "structural", name: "layout", values: "stacked, inline", label: "OBSERVED VARIATION" },
  ],
  states: [
    {
      state: "error",
      affects: "control border, helper region",
      accessibility: "aria-invalid and aria-describedby",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      state: "disabled",
      affects: "label and control opacity",
      accessibility: "disabled attribute",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  sizes: "Follows its control's size.",
  density: "Field-to-field spacing varies by screen; recorded, not normalized.",
  dependencies: {
    typography: "label text-sm font-medium, helper text-xs muted",
    spacing: "label to control and control to helper gaps",
    color: "--foreground, --muted-foreground, --destructive",
    shape: "inherited from the control",
    icon: "optional status glyph",
  },
  responsive: "Stacks on narrow viewports; inline layouts collapse.",
  accessibility:
    "Label is programmatically associated; helper and error are referenced by aria-describedby.",
  interaction: "No behavior of its own beyond focus forwarding.",
  composition: {
    allowedChildren: "Input, Textarea, Select, Combobox, Checkbox, Radio, Switch.",
    prohibited: "Two controls under one label.",
    parentPatterns: "Forms inside Card, Dialog and Sheet.",
  },
  experienceExtensions: "Route-local kits under M06 and M08 carry their own field wrappers.",
  currentImplementation: [
    {
      file: "src/components/ui/form.tsx",
      exportName: "FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage",
      consumers: "react-hook-form based screens",
    },
    { file: "src/components/ui/label.tsx", exportName: "Label", consumers: "5 direct files" },
    {
      file: "src/components/m06, src/components/m08",
      exportName: "route-local field wrappers",
      consumers: "their own screens",
      note: "OBSERVED DUPLICATE — parallel field systems, preserved.",
    },
  ],
  observedVariations: [
    "Some screens place a plain Label above an Input without the form wrapper.",
    "Helper text sizing differs between internal and marketplace screens.",
  ],
  futureCanonicalTarget:
    "One field contract that every control plugs into, owning label association, helper and error wiring.",
  figmaMapping: "Component with Label, Helper, Error text properties and a State variant.",
  migrationNotes: "FUTURE MIGRATION — multiple field systems; not scheduled and no winner chosen.",
  governanceStatus: "documented current variation",
  label: "OBSERVED DUPLICATE",
};

const control = (
  name: string,
  purpose: string,
  file: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec> = {},
): CanonicalComponentSpec => ({
  name,
  category: "forms",
  purpose,
  anatomy: [
    { part: "Root", requirement: "required", role: "control wrapper" },
    { part: "Control", requirement: "required", role: "focusable element" },
    { part: "Leading", requirement: "optional", role: "icon or prefix" },
    { part: "Trailing", requirement: "optional", role: "icon, unit or clear affordance" },
  ],
  contentModel: ["Value, placeholder and optional affixes."],
  properties: [
    {
      name: "value / onChange",
      propertyClass: "behavioral",
      values: "controlled or uncontrolled",
      figma: "code-only",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "placeholder",
      propertyClass: "content",
      values: "string",
      figma: "text-property",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "disabled",
      propertyClass: "state",
      values: "boolean",
      figma: "variant-property",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "invalid",
      propertyClass: "state",
      values: "boolean",
      figma: "variant-property",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  variants: [
    {
      kind: "size",
      name: "size",
      values: "single h-9 baseline today",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  states: [
    {
      state: "focus-visible",
      affects: "ring, border",
      accessibility: "required",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      state: "disabled",
      affects: "opacity, cursor",
      accessibility: "disabled attribute",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      state: "error",
      affects: "border, ring",
      accessibility: "aria-invalid",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  sizes: "h-9 baseline.",
  density: "No density property.",
  dependencies: {
    typography: "text-sm",
    spacing: "px-3 internal padding",
    color: "--input, --background, --ring, --destructive",
    shape: "rounded-md with a hairline border",
    icon: "16px affixes",
  },
  responsive: "Full width by default; consumers constrain.",
  accessibility: "Native semantics; always paired with a label.",
  interaction: "Standard control behavior; Radix owns keyboard handling where applicable.",
  composition: {
    allowedChildren: "Affix glyphs only.",
    prohibited: "Nested controls.",
    parentPatterns: "FormField, FilterBar, TableToolbar, Dialog bodies.",
  },
  experienceExtensions: "Marketplace filters wrap the same controls with their own labelling.",
  currentImplementation: [{ file, exportName: name, consumers }],
  observedVariations: ["Height and padding overrides appear in a few dense screens."],
  futureCanonicalTarget:
    "Unchanged contract, plugged into the canonical FormField and the shared size ladder.",
  figmaMapping: "Component with State, Size and affix boolean properties.",
  migrationNotes: "No migration implied.",
  governanceStatus: "documented current component",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const FORM_SPECS: SpecCategoryGroup = {
  id: "spec-forms",
  category: "forms",
  title: "Forms",
  summary:
    "Form controls come from the primitive set and are composed by several parallel field systems. All of them are preserved; the canonical target describes one field contract without replacing any of them.",
  specs: [
    field,
    control("Input", "Single-line text entry.", "src/components/ui/input.tsx", "7 direct files"),
    control(
      "Textarea",
      "Multi-line text entry.",
      "src/components/ui/textarea.tsx",
      "available primitive",
    ),
    control(
      "Select",
      "Choose one option from a closed list.",
      "src/components/ui/select.tsx",
      "7 direct files",
    ),
    control(
      "Combobox",
      "Filterable option list.",
      "src/components/ui/command.tsx",
      "composed from Command and Popover",
      {
        label: "OBSERVED VARIATION",
        futureCanonicalTarget:
          "A named Combobox rather than an ad-hoc Command plus Popover composition.",
        governanceStatus: "future canonical target",
      },
    ),
    control(
      "Checkbox",
      "Toggle one independent option.",
      "src/components/ui/checkbox.tsx",
      "filters and forms",
    ),
    control(
      "Radio",
      "Choose one option from a small visible set.",
      "src/components/ui/radio-group.tsx",
      "forms",
    ),
    control(
      "Switch",
      "Immediately apply an on/off preference.",
      "src/components/ui/switch.tsx",
      "settings screens",
    ),
    control(
      "SearchField",
      "Text entry that filters a result set.",
      "src/components/ui/input.tsx",
      "composed per screen with a leading glyph",
      {
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "A named SearchField owning the glyph, clear affordance and debounce contract.",
        governanceStatus: "future canonical target",
      },
    ),
    control(
      "FilterControl",
      "A selectable chip or control that narrows a result set.",
      "src/routes/plans.tsx",
      "plan filters, marketplace filters",
      {
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "A named filter control with shared selected-state governance across experiences.",
        observedVariations: [
          "Metal, network, exchange and HSA chips reuse listing badge treatments.",
          "Exchange filters intentionally render no visible selection ring.",
        ],
        governanceStatus: "experience-specific extension",
      },
    ),
  ],
};
