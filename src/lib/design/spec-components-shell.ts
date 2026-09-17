/**
 * Phase 8 — Shell category specification.
 * DOCUMENTATION ONLY. All shells remain exactly as they ship.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const shell = (
  name: string,
  purpose: string,
  file: string,
  exportName: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec>,
): CanonicalComponentSpec => ({
  name,
  category: "shell",
  purpose,
  anatomy: [
    { part: "Root", requirement: "required", role: "page frame" },
    { part: "Header", requirement: "required", role: "top band" },
    { part: "Content", requirement: "required", role: "route outlet region" },
    { part: "Footer", requirement: "optional", role: "closing band" },
  ],
  contentModel: ["One route outlet.", "Navigation belongs to the shell, not the screen."],
  properties: [],
  variants: [],
  states: [
    {
      state: "selected",
      affects: "active navigation item",
      accessibility: "aria-current",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  sizes: "Container width per experience.",
  density: "Each shell sets the density of the screens inside it.",
  dependencies: {
    typography: "shell navigation roles",
    spacing: "header height and content offset",
    color: "surface and sidebar roles",
    shape: "rounded content regions",
    icon: "16px navigation glyphs",
  },
  responsive: "Navigation collapses below the shell's breakpoint.",
  accessibility: "Landmarks for banner, navigation and main; skip order matches the visual order.",
  interaction: "Navigation and session controls.",
  composition: {
    allowedChildren: "Route content.",
    prohibited: "A second shell inside a shell.",
    parentPatterns: "Route tree.",
  },
  experienceExtensions: "Each experience owns one shell.",
  currentImplementation: [{ file, exportName, consumers }],
  observedVariations: [],
  futureCanonicalTarget:
    "Shells stay separate. A shared shell contract would describe landmarks, header height and content offset only.",
  figmaMapping: "Frames per experience and breakpoint, not a single component.",
  migrationNotes: "No migration implied.",
  governanceStatus: "documented current component",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const SHELL_SPECS: SpecCategoryGroup = {
  id: "spec-shell",
  category: "shell",
  title: "Shells",
  summary:
    "Three shells ship and each owns its own navigation, width and density. They are recorded as parallel implementations; no shared shell is proposed for production.",
  specs: [
    shell(
      "InternalShell",
      "Frame for dashboard and administration screens.",
      "src/components/abox/internal-shell.tsx",
      "InternalShell",
      "89 files",
      {
        observedVariations: ["Owns its own sidebar rather than the sidebar primitive."],
      },
    ),
    shell(
      "MarketplaceShell",
      "Frame for shopping and marketplace screens.",
      "src/components/abox/marketplace-shell.tsx",
      "MarketplaceShell",
      "30 files",
      {
        observedVariations: ["Header runs full width while content is constrained to 88rem."],
      },
    ),
    shell(
      "MemberShell",
      "Frame for member account screens.",
      "src/components/abox/member-shell.tsx",
      "MemberShell",
      "member routes",
      {
        observedVariations: [
          "Side navigation uses 36px icon circles joined by a centred connecting arc.",
        ],
      },
    ),
    shell(
      "ExperienceShell",
      "A shared frame contract behind all three shells.",
      "n/a",
      "n/a",
      "does not exist",
      {
        currentImplementation: [],
        futureCanonicalTarget:
          "A contract describing landmarks, header height, content offset and container width, which the three shells would satisfy without being merged.",
        governanceStatus: "future canonical target",
        label: "FUTURE CANONICAL TARGET",
      },
    ),
    shell(
      "OverlayShell",
      "The frame used by full-screen overlay experiences.",
      "src/components/ui/dialog.tsx and sheet.tsx",
      "overlay surfaces",
      "composed per usage",
      {
        label: "UNOWNED AREA",
        governanceStatus: "future decision",
        futureCanonicalTarget:
          "No dedicated overlay shell exists; overlays are composed directly. Whether one is warranted is unresolved.",
      },
    ),
  ],
};
