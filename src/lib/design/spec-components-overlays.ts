/**
 * Phase 8 — Overlays category specification.
 * DOCUMENTATION ONLY. The Sheet naming collision is recorded, not resolved.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const overlay = (
  name: string,
  purpose: string,
  file: string,
  exportName: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec> = {},
): CanonicalComponentSpec => ({
  name,
  category: "overlays",
  purpose,
  anatomy: [
    { part: "Trigger", requirement: "required", role: "control that opens the surface" },
    { part: "Overlay", requirement: "conditional", role: "scrim behind modal surfaces" },
    { part: "Root", requirement: "required", role: "floating surface" },
    { part: "Header", requirement: "optional", role: "title and description" },
    { part: "Body", requirement: "required", role: "content" },
    { part: "Footer", requirement: "optional", role: "actions" },
  ],
  contentModel: ["One title.", "Actions in the footer, confirm last in reading order."],
  properties: [
    {
      name: "open / onOpenChange",
      propertyClass: "behavioral",
      values: "controlled or uncontrolled",
      figma: "code-only",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "side / placement",
      propertyClass: "visual-variant",
      values: "per primitive",
      figma: "variant-property",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  variants: [],
  states: [
    {
      state: "open",
      affects: "visibility, trigger styling",
      accessibility: "aria-expanded on the trigger",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      state: "focus-visible",
      affects: "ring inside the surface",
      accessibility: "focus is trapped in modal surfaces",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  sizes: "Width set per usage.",
  density: "Follows the host experience.",
  dependencies: {
    typography: "title and description roles",
    spacing: "p-5 family, gap between sections",
    color: "--card, overlay scrim, hairline",
    shape: "rounded-2xl family",
    icon: "16px close glyph",
  },
  responsive: "Modal surfaces become full width on small viewports; drawers anchor to an edge.",
  accessibility: "Focus trap, Escape to dismiss, restored focus on close, labelled by its title.",
  interaction: "Opens from a trigger, dismisses by Escape, scrim click or an explicit control.",
  composition: {
    allowedChildren: "Header, body, footer content.",
    prohibited: "Nested modals.",
    parentPatterns: "Triggered from actions and table rows.",
  },
  experienceExtensions: "Dashboards use dialogs heavily; shopping uses drawers and popovers.",
  currentImplementation: [{ file, exportName, consumers }],
  observedVariations: [],
  futureCanonicalTarget:
    "One overlay family with shared header, body and footer anatomy across dialog, sheet and drawer.",
  figmaMapping:
    "Component set with Placement, Size and State variants; body as an instance-swap slot.",
  migrationNotes: "No migration implied.",
  governanceStatus: "documented current component",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const OVERLAY_SPECS: SpecCategoryGroup = {
  id: "spec-overlays",
  category: "overlays",
  title: "Overlays",
  summary:
    "Overlay primitives come from Radix and share anatomy already. One naming collision exists between the Sheet primitive and the domain use of the word sheet; it is recorded as an observed issue and left untouched.",
  specs: [
    overlay(
      "Dialog",
      "Interrupt the task for a focused decision or short form.",
      "src/components/ui/dialog.tsx",
      "Dialog",
      "4 direct files",
    ),
    overlay(
      "AlertDialog",
      "Confirm a consequential or destructive action.",
      "src/components/ui/alert-dialog.tsx",
      "AlertDialog",
      "confirmation flows",
      {
        accessibility: "Dismissal must not be the default path; the confirming action is explicit.",
      },
    ),
    overlay(
      "Sheet",
      "Edge-anchored surface for secondary tasks.",
      "src/components/ui/sheet.tsx",
      "Sheet",
      "primitive",
      {
        observedVariations: [
          "OBSERVED OVERLAP — the primitive name Sheet coexists with the word sheet used in product language, so the same term means two things depending on context.",
        ],
        label: "OBSERVED OVERLAP",
        futureCanonicalTarget:
          "A future library would disambiguate the name. Nothing is renamed here; the collision is recorded only.",
        governanceStatus: "future decision",
      },
    ),
    overlay(
      "Drawer",
      "Bottom-anchored surface, mainly for touch viewports.",
      "src/components/ui/drawer.tsx",
      "Drawer",
      "primitive",
      {
        observedVariations: ["Drawer and Sheet overlap in purpose; both are kept."],
        label: "OBSERVED OVERLAP",
      },
    ),
    overlay(
      "Popover",
      "Non-modal surface anchored to its trigger.",
      "src/components/ui/popover.tsx",
      "Popover",
      "filters and pickers",
      {
        accessibility: "Not focus-trapped; closes on outside interaction.",
      },
    ),
    overlay(
      "DropdownMenu",
      "A menu of actions raised from a control.",
      "src/components/ui/dropdown-menu.tsx",
      "DropdownMenu",
      "header profile control and row actions",
      {
        anatomy: [
          { part: "Trigger", requirement: "required", role: "menu button" },
          { part: "Root", requirement: "required", role: "menu surface" },
          { part: "Content", requirement: "required", role: "menu items" },
        ],
        accessibility: "Menu semantics with roving focus and type-ahead.",
      },
    ),
    overlay(
      "ContextMenu",
      "Actions raised by right-click.",
      "src/components/ui/context-menu.tsx",
      "ContextMenu",
      "primitive",
      {
        label: "POSSIBLY UNUSED",
        accessibility: "Requires an equivalent keyboard path; right-click alone is not sufficient.",
      },
    ),
    overlay(
      "Command",
      "Search-driven overlay for jumping to actions or records.",
      "src/components/ui/command.tsx",
      "Command",
      "used to compose combobox behavior",
      {
        futureCanonicalTarget: "Splits into a Combobox contract and a global command surface.",
        governanceStatus: "future canonical target",
      },
    ),
  ],
};
