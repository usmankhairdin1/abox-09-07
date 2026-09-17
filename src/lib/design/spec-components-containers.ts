/**
 * Phase 8 — Containers category specification.
 * DOCUMENTATION ONLY.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const container = (
  name: string,
  purpose: string,
  current: string,
  extra: Partial<CanonicalComponentSpec>,
): CanonicalComponentSpec => ({
  name,
  category: "containers",
  purpose,
  anatomy: [
    { part: "Root", requirement: "required", role: "layout element" },
    { part: "Content", requirement: "required", role: "children" },
  ],
  contentModel: ["Arbitrary children; the container owns rhythm, not meaning."],
  properties: [
    {
      name: "gap",
      propertyClass: "size",
      values: "spacing step",
      figma: "variable",
      label: "FUTURE CANONICAL TARGET",
    },
    {
      name: "padding",
      propertyClass: "size",
      values: "spacing step",
      figma: "variable",
      label: "FUTURE CANONICAL TARGET",
    },
  ],
  variants: [],
  states: [],
  sizes: "Spacing steps from the foundation.",
  density: "Density is expressed through the chosen spacing step.",
  dependencies: {
    typography: "none",
    spacing: "gap-1 through gap-4 dominate; gap-2 is the most frequent",
    color: "usually none; surfaces carry background",
    shape: "usually none",
    icon: "none",
  },
  responsive: "Breakpoint behavior is set by the consumer.",
  accessibility: "Presentational; must not break reading order.",
  interaction: "None.",
  composition: {
    allowedChildren: "Any.",
    prohibited: "Semantic meaning.",
    parentPatterns: "Every screen.",
  },
  experienceExtensions: "None; layout primitives stay shared.",
  currentImplementation: [
    {
      file: current,
      exportName: "utility classes",
      consumers: "every screen",
      note: "UNOWNED AREA — expressed as Tailwind utilities, not components.",
    },
  ],
  observedVariations: [
    "gap-1.5 and gap-2 both occur for the same relationship in different screens.",
  ],
  futureCanonicalTarget:
    "Named layout primitives so spacing steps are chosen from a contract rather than per call site.",
  figmaMapping: "Auto-layout frames with spacing variables, not components.",
  migrationNotes:
    "FUTURE MIGRATION — very high call-site count; no migration implied by this specification.",
  governanceStatus: "future canonical target",
  label: "UNOWNED AREA",
  ...extra,
});

export const CONTAINER_SPECS: SpecCategoryGroup = {
  id: "spec-containers",
  category: "containers",
  title: "Containers",
  summary:
    "Layout is expressed today through Tailwind utilities rather than components. That is recorded as an unowned area; the canonical targets describe what named primitives would cover if they ever existed.",
  specs: [
    container(
      "Stack",
      "Arrange children vertically with one rhythm.",
      "Tailwind flex-col utilities",
      {},
    ),
    container(
      "Inline",
      "Arrange children horizontally with one rhythm and wrapping.",
      "Tailwind flex utilities",
      {},
    ),
    container("Grid", "Place children on a column grid.", "Tailwind grid utilities", {
      observedVariations: [
        "Column counts and gaps are chosen per screen; several grid conventions coexist.",
      ],
    }),
    container(
      "Surface",
      "A background plane that separates content from the canvas.",
      "src/styles.css surface tokens",
      {
        dependencies: {
          typography: "none",
          spacing: "section padding",
          color: "--background, --surface, --panel, --card",
          shape: "rounded families",
          icon: "none",
        },
        currentImplementation: [
          {
            file: "src/styles.css",
            exportName: "--background, --surface, --panel, --card",
            consumers: "every screen",
          },
        ],
        observedVariations: ["Three compatibility surface aliases remain in the stylesheet."],
        label: "CURRENT IMPLEMENTATION",
        governanceStatus: "documented current component",
      },
    ),
    container("Section", "A titled region of a page.", "route markup", {
      anatomy: [
        { part: "Root", requirement: "required", role: "section element" },
        { part: "Title", requirement: "optional", role: "section heading" },
        { part: "Supporting", requirement: "optional", role: "section description" },
        { part: "Content", requirement: "required", role: "section body" },
      ],
    }),
    container("Panel", "A recessed region inside a surface.", "src/styles.css --panel", {
      label: "CURRENT IMPLEMENTATION",
      governanceStatus: "documented current component",
    }),
    container(
      "ScrollArea",
      "Constrain overflow with a styled scroll region.",
      "src/components/ui/scroll-area.tsx",
      {
        currentImplementation: [
          {
            file: "src/components/ui/scroll-area.tsx",
            exportName: "ScrollArea",
            consumers: "primitive",
          },
        ],
        label: "CURRENT IMPLEMENTATION",
        governanceStatus: "documented current component",
      },
    ),
    container(
      "Container",
      "Constrain page width and centre content.",
      "max-w-[88rem] in web-experience routes",
      {
        currentImplementation: [
          {
            file: "src/routes",
            exportName: "max-w-[88rem]",
            consumers: "23 occurrences across web-experience routes",
          },
        ],
        observedVariations: [
          "Web-experience pages use an 88rem centred container while headers run full width.",
          "Dashboard shells use their own widths and are untouched.",
        ],
        futureCanonicalTarget: "A named container with documented width options per experience.",
        label: "CURRENT IMPLEMENTATION",
        governanceStatus: "documented current component",
      },
    ),
  ],
};
