/**
 * Phase 8 — Navigation category specification.
 * DOCUMENTATION ONLY. Multiple page-header systems coexist and all are preserved.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const nav = (
  name: string,
  purpose: string,
  file: string,
  exportName: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec>,
): CanonicalComponentSpec => ({
  name,
  category: "navigation",
  purpose,
  anatomy: [{ part: "Root", requirement: "required", role: "navigation region" }],
  contentModel: [],
  properties: [],
  variants: [],
  states: [
    {
      state: "selected",
      affects: "color, weight, indicator",
      accessibility: "aria-current",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      state: "focus-visible",
      affects: "ring",
      accessibility: "required",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  sizes: "Follows the shell it belongs to.",
  density: "Dashboard navigation is denser than web navigation.",
  dependencies: {
    typography: "text-sm medium",
    spacing: "gap-2 between glyph and label",
    color: "--foreground, --primary, sidebar roles",
    shape: "rounded-md",
    icon: "16px",
  },
  responsive: "Collapses to a mobile presentation below the shell's breakpoint.",
  accessibility:
    "Navigation landmarks, current-page indication, keyboard order matching visual order.",
  interaction: "Navigation only.",
  composition: {
    allowedChildren: "Links and their glyphs.",
    prohibited: "Unrelated actions.",
    parentPatterns: "Shells.",
  },
  experienceExtensions: "Each shell owns its own navigation presentation.",
  currentImplementation: [{ file, exportName, consumers }],
  observedVariations: [],
  futureCanonicalTarget:
    "Shared navigation item contract, with shells supplying their own arrangement.",
  figmaMapping: "Component set with State and Experience variants.",
  migrationNotes: "No migration implied.",
  governanceStatus: "documented current component",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const NAVIGATION_SPECS: SpecCategoryGroup = {
  id: "spec-navigation",
  category: "navigation",
  title: "Navigation",
  summary:
    "Several page-header implementations ship: the ABox PageHeader, the compact results header, and route-local headers in the M06 and M08 kits. They are recorded in parallel with no winner.",
  specs: [
    nav(
      "PageHeader",
      "Name the screen, explain it and expose its primary actions.",
      "src/components/abox/page-header.tsx",
      "PageHeader",
      "25 files",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "header band" },
          { part: "Title", requirement: "required", role: "screen name" },
          { part: "Supporting", requirement: "optional", role: "description" },
          { part: "Action", requirement: "optional", role: "primary and secondary actions" },
        ],
        variants: [
          {
            kind: "structural",
            name: "form",
            values: "standard, compact results header",
            label: "OBSERVED VARIATION",
          },
        ],
        observedVariations: [
          "A compact form is used on plan results with a larger title than the description implies.",
          "Route-local kits define their own header markup.",
        ],
        futureCanonicalTarget: "One header contract with standard and compact structural variants.",
        label: "OBSERVED DUPLICATE",
        governanceStatus: "documented current variation",
      },
    ),
    nav(
      "Breadcrumbs",
      "Show position in a hierarchy and offer a route back.",
      "src/components/ui/breadcrumb.tsx",
      "Breadcrumb",
      "primitive",
      {
        accessibility: "Navigation landmark with the current page marked and not linked.",
      },
    ),
    nav(
      "Tabs",
      "Switch between sibling views within one screen.",
      "src/components/ui/tabs.tsx",
      "Tabs",
      "primitive",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "tab region" },
          { part: "Control", requirement: "required", role: "tab list" },
          { part: "Indicator", requirement: "optional", role: "active marker" },
          { part: "Content", requirement: "required", role: "panel" },
        ],
        observedVariations: ["ModuleTabs provides a separate tab presentation for module screens."],
        currentImplementation: [
          { file: "src/components/ui/tabs.tsx", exportName: "Tabs", consumers: "primitive" },
          {
            file: "src/components/abox/module-tabs.tsx",
            exportName: "ModuleTabs",
            consumers: "module screens",
          },
        ],
        label: "OBSERVED OVERLAP",
      },
    ),
    nav(
      "Sidebar",
      "Persistent navigation for an application shell.",
      "src/components/ui/sidebar.tsx",
      "Sidebar",
      "primitive plus shell implementations",
      {
        observedVariations: [
          "InternalShell and MemberShell implement their own navigation rather than the primitive.",
        ],
        label: "OBSERVED OVERLAP",
      },
    ),
    nav(
      "Stepper",
      "Show progress through a multi-step task.",
      "src/components/abox/downline-wizard-stepper.tsx",
      "DownlineWizardStepper",
      "downline wizard",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "step rail" },
          { part: "Indicator", requirement: "required", role: "step marker" },
          { part: "Label", requirement: "required", role: "step name" },
        ],
        futureCanonicalTarget:
          "A shared stepper covering wizard, application and onboarding flows.",
        governanceStatus: "experience-specific extension",
      },
    ),
    nav(
      "ShoppingPathBar",
      "Let a shopper switch between guided and self-directed shopping.",
      "src/components/abox/shopping-path-bar.tsx",
      "ShoppingPathBar",
      "shopping routes",
      {
        governanceStatus: "experience-specific extension",
      },
    ),
    nav(
      "ProductSwitcher",
      "Switch between products while keeping shopping state.",
      "src/components/abox/product-switcher.tsx",
      "ProductSwitcher",
      "shopping routes",
      {
        governanceStatus: "experience-specific extension",
      },
    ),
  ],
};
