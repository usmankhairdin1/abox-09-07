/**
 * Phase 8 — Display category specification.
 * DOCUMENTATION ONLY.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const base = (
  name: string,
  purpose: string,
  file: string,
  exportName: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec>,
): CanonicalComponentSpec => ({
  name,
  category: "display",
  purpose,
  anatomy: [{ part: "Root", requirement: "required", role: "outer element" }],
  contentModel: [],
  properties: [],
  variants: [],
  states: [],
  sizes: "See dependencies.",
  density: "No density property.",
  dependencies: {
    typography: "text-sm baseline",
    spacing: "component padding",
    color: "semantic roles",
    shape: "rounded",
    icon: "16px",
  },
  responsive: "No internal breakpoints unless stated.",
  accessibility: "Decorative parts hidden; meaning carried by text.",
  interaction: "Non-interactive unless stated.",
  composition: {
    allowedChildren: "As stated.",
    prohibited: "As stated.",
    parentPatterns: "As stated.",
  },
  experienceExtensions: "None unless stated.",
  currentImplementation: [{ file, exportName, consumers }],
  observedVariations: [],
  futureCanonicalTarget: "Unchanged contract, formalised against the foundation.",
  figmaMapping: "Component with the variants listed.",
  migrationNotes: "No migration implied.",
  governanceStatus: "documented current component",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const DISPLAY_SPECS: SpecCategoryGroup = {
  id: "spec-display",
  category: "display",
  title: "Display",
  summary:
    "Display components carry meaning without interaction. Status and tier vocabularies overlap today; both are preserved and documented rather than merged.",
  specs: [
    base(
      "Card",
      "Group related content on a raised surface.",
      "src/components/ui/card.tsx",
      "Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter",
      "6 direct files",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "surface with border and radius" },
          { part: "Header", requirement: "optional", role: "title, description, actions" },
          { part: "Title", requirement: "optional", role: "card heading" },
          { part: "Description", requirement: "optional", role: "supporting text" },
          { part: "Media", requirement: "optional", role: "mark or illustration" },
          { part: "Body", requirement: "required", role: "content" },
          { part: "Footer", requirement: "optional", role: "actions" },
        ],
        contentModel: ["One title at most.", "Actions live in header or footer, not both."],
        variants: [
          {
            kind: "structural",
            name: "regions",
            values: "header / body / footer combinations",
            label: "CURRENT IMPLEMENTATION",
          },
        ],
        states: [
          {
            state: "hover",
            affects: "border, shadow on interactive cards",
            accessibility: "interactive cards need a real control",
            label: "OBSERVED VARIATION",
          },
        ],
        dependencies: {
          typography: "title and description roles",
          spacing: "p-5 dominant, other paddings observed",
          color: "--card, hairline border",
          shape: "rounded-2xl family",
          icon: "16px",
        },
        observedVariations: [
          "Card padding is not uniform across experiences; p-5 dominates but is not universal.",
        ],
        composition: {
          allowedChildren: "Any content, actions in defined slots.",
          prohibited: "Nested cards of the same elevation.",
          parentPatterns: "Grids, dashboards, marketplace listings.",
        },
        label: "OBSERVED VARIATION",
      },
    ),
    base(
      "StatusBadge",
      "State the status of a record in words plus a tone.",
      "src/components/abox/status-badge.tsx",
      "StatusBadge",
      "89 files",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "pill" },
          { part: "Indicator", requirement: "optional", role: "tone mark" },
          { part: "Label", requirement: "required", role: "status text" },
        ],
        contentModel: ["Short status text; never an icon alone."],
        variants: [
          {
            kind: "semantic",
            name: "tone",
            values: "success, warning, danger, info, neutral and related tones",
            label: "CURRENT IMPLEMENTATION",
          },
        ],
        states: [
          {
            state: "default",
            affects: "background, text",
            accessibility: "text carries meaning",
            label: "CURRENT IMPLEMENTATION",
          },
        ],
        dependencies: {
          typography: "text-xs / text-sm medium",
          spacing: "px-2 py-0.5 family",
          color: "status tone roles",
          shape: "rounded-full",
          icon: "optional 16px",
        },
        observedVariations: ["Status tone vocabulary overlaps with Alert and toast tones."],
        futureCanonicalTarget:
          "One semantic tone vocabulary shared by badge, alert and inline validation.",
        label: "OBSERVED OVERLAP",
      },
    ),
    base(
      "Badge",
      "Neutral count or tag.",
      "src/components/ui/badge.tsx",
      "Badge",
      "primitive with limited direct use",
      {
        variants: [
          {
            kind: "visual",
            name: "variant",
            values: "default, secondary, outline, destructive",
            label: "CURRENT IMPLEMENTATION",
          },
        ],
        observedVariations: ["Overlaps with StatusBadge and MetalBadge in purpose."],
        label: "OBSERVED OVERLAP",
      },
    ),
    base(
      "MetalBadge",
      "Show a plan's metal tier.",
      "src/components/abox/metal-badge.tsx",
      "MetalBadge",
      "plan tiles, plan detail and filters",
      {
        variants: [
          {
            kind: "semantic",
            name: "tier",
            values:
              "Bronze, Expanded Bronze, Silver, Gold, Platinum and catastrophic where applicable",
            label: "CURRENT IMPLEMENTATION",
          },
        ],
        dependencies: {
          typography: "text-xs medium",
          spacing: "compact pill padding",
          color: "solid tier tokens with contrast-chosen foreground",
          shape: "rounded-full",
          icon: "none",
        },
        accessibility: "Foreground is selected against the tier background for contrast.",
        futureCanonicalTarget:
          "Stays a commerce-domain component; tiers never fold into the generic tone set.",
        governanceStatus: "experience-specific extension",
        label: "CURRENT IMPLEMENTATION",
      },
    ),
    base(
      "Avatar",
      "Represent a person or organisation.",
      "src/components/ui/avatar.tsx",
      "Avatar",
      "primitive",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "circular frame" },
          { part: "Media", requirement: "optional", role: "image" },
          { part: "Label", requirement: "conditional", role: "initials fallback" },
        ],
        observedVariations: [
          "No image assets ship in the project, so the fallback path dominates.",
        ],
      },
    ),
    base(
      "Icon",
      "Render a glyph consistently.",
      "src/components/icons",
      "ToothIcon and direct library imports",
      "144 files import lucide-react",
      {
        observedVariations: [
          "h-4 w-4 and size-4 both appear.",
          "One Tabler glyph is wrapped; Font Awesome is installed but unused.",
        ],
        futureCanonicalTarget: "A single icon wrapper owning size steps and aria-hidden defaults.",
        label: "OBSERVED VARIATION",
      },
    ),
    base(
      "Divider",
      "Separate content without a heading.",
      "src/components/ui/separator.tsx",
      "Separator",
      "primitive",
      {
        variants: [
          {
            kind: "structural",
            name: "orientation",
            values: "horizontal, vertical",
            label: "CURRENT IMPLEMENTATION",
          },
        ],
        observedVariations: ["Many screens use a hairline border instead of the primitive."],
        label: "OBSERVED VARIATION",
      },
    ),
    base(
      "Tooltip",
      "Reveal a short clarification on hover or focus.",
      "src/components/ui/tooltip.tsx",
      "Tooltip",
      "overflow text and icon-only controls",
      {
        accessibility:
          "Must be reachable by keyboard; never the only source of essential information.",
        composition: {
          allowedChildren: "Short text.",
          prohibited: "Interactive content.",
          parentPatterns: "OverflowText, icon-only actions.",
        },
      },
    ),
    base(
      "OverflowText",
      "Truncate long values and reveal the full text on demand.",
      "src/components/abox/overflow-text.tsx",
      "OverflowText",
      "plan names, carriers and identifiers",
      {
        futureCanonicalTarget:
          "A shared truncation contract used by every table cell and card title.",
        governanceStatus: "future canonical target",
      },
    ),
    base(
      "EmptyState",
      "Explain that there is nothing to show and offer the next step.",
      "src/components/abox/empty-state.tsx",
      "EmptyState",
      "10 files",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "centred block" },
          { part: "Icon", requirement: "optional", role: "illustrative glyph" },
          { part: "Title", requirement: "required", role: "what is empty" },
          { part: "Description", requirement: "optional", role: "why and what next" },
          { part: "Action", requirement: "optional", role: "recovery action" },
        ],
        observedVariations: ["Route-local kits define their own empty states as well."],
        label: "OBSERVED DUPLICATE",
      },
    ),
    base(
      "Skeleton",
      "Hold layout while content loads.",
      "src/components/ui/skeleton.tsx",
      "Skeleton",
      "4 direct files",
      {
        accessibility:
          "Decorative; the loading condition should also be announced where the wait is long.",
        futureCanonicalTarget:
          "Skeletons shaped from the component they stand in for, rather than ad-hoc blocks.",
      },
    ),
    base(
      "LoadingState",
      "Communicate that work is in progress.",
      "src/components/ui/spinner.tsx",
      "Spinner",
      "composed per screen",
      {
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "A named loading state pairing spinner, skeleton and announcement rules.",
        governanceStatus: "future canonical target",
      },
    ),
    base(
      "Progress",
      "Show completion of a known-length operation.",
      "src/components/ui/progress.tsx",
      "Progress",
      "primitive",
      {
        accessibility: "Requires an accessible name and value.",
      },
    ),
    base(
      "KpiCard",
      "Present one measured figure with its context.",
      "src/components/abox/kpi-card.tsx",
      "KpiCard",
      "18 files",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "card surface" },
          { part: "Label", requirement: "required", role: "what is measured" },
          { part: "Content", requirement: "required", role: "the figure" },
          { part: "Supporting", requirement: "optional", role: "comparison or period" },
          { part: "Indicator", requirement: "optional", role: "direction or tone" },
        ],
        dependencies: {
          typography: "KPI numeric role, label eyebrow role",
          spacing: "card padding family",
          color: "--card plus tone for the indicator",
          shape: "rounded-2xl",
          icon: "16px",
        },
        governanceStatus: "experience-specific extension",
      },
    ),
    base(
      "Image / Media",
      "Display supplied imagery.",
      "n/a",
      "n/a",
      "no image files exist in src or public except the favicon",
      {
        currentImplementation: [],
        futureCanonicalTarget:
          "No production image component exists and no image assets ship, so a media contract cannot be specified from evidence.",
        governanceStatus: "future decision",
        label: "FUTURE DECISION",
      },
    ),
  ],
};
