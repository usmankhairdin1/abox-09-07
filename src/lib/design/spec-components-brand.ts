/**
 * Phase 8 — Brand category specification.
 * DOCUMENTATION ONLY. Runtime Branding & White-Label and Marketplace Asset
 * Management remain the owners of brand configuration and asset storage.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const brand = (
  name: string,
  purpose: string,
  file: string,
  exportName: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec> = {},
): CanonicalComponentSpec => ({
  name,
  category: "brand",
  purpose,
  anatomy: [{ part: "Root", requirement: "required", role: "mark container" }],
  contentModel: ["Brand-supplied content only."],
  properties: [
    {
      name: "tone",
      propertyClass: "visual-variant",
      values: "light, sage, navy, inverted",
      figma: "variant-property",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "size",
      propertyClass: "size",
      values: "per placement",
      figma: "variant-property",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  variants: [
    {
      kind: "visual",
      name: "tone",
      values: "light, sage, navy, inverted",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  states: [],
  sizes: "Set by the placement.",
  density: "n/a",
  dependencies: {
    typography: "wordmark type where applicable",
    spacing: "clear space around the mark",
    color: "brand roles",
    shape: "circular badge",
    icon: "code-drawn geometry",
  },
  responsive: "Mark alone on narrow viewports, mark plus wordmark on wide.",
  accessibility: "Decorative when adjacent to the product name; otherwise labelled.",
  interaction: "Usually a link home.",
  composition: {
    allowedChildren: "None.",
    prohibited: "Recolouring, stretching or effects.",
    parentPatterns: "Shell headers, auth screens, footers.",
  },
  experienceExtensions: "White-label tenants supply their own brand values at runtime.",
  currentImplementation: [{ file, exportName, consumers }],
  observedVariations: [],
  futureCanonicalTarget:
    "Brand components stay code-drawn and consume brand roles rather than fixed colors.",
  figmaMapping: "Component with Tone and Size variants; tenant values expressed as Figma modes.",
  migrationNotes: "No migration implied.",
  governanceStatus: "documented current component",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const BRAND_SPECS: SpecCategoryGroup = {
  id: "spec-brand",
  category: "brand",
  title: "Brand",
  summary:
    "Brand marks are drawn in code; no image assets ship except the favicon. The design system specifies how marks behave. It does not own brand configuration or asset storage — those stay with the runtime Branding & White-Label and Marketplace Asset Management screens.",
  specs: [
    brand(
      "BrandMark",
      "The circular ABox badge.",
      "src/components/abox/logo.tsx",
      "AboxMark",
      "shell headers and auth screens",
    ),
    brand(
      "Wordmark",
      "The product name set as a mark.",
      "src/components/abox/logo.tsx",
      "AboxWordmark",
      "headers and footers",
    ),
    brand("Favicon", "The browser tab mark.", "public/favicon.ico", "favicon", "single file", {
      properties: [],
      variants: [],
      futureCanonicalTarget: "Remains a delivered file, not a component.",
      governanceStatus: "documented current component",
    }),
    brand(
      "BrandAsset",
      "Tenant-supplied artwork applied at runtime.",
      "Branding & White-Label screens",
      "runtime configuration",
      "tenant administrators",
      {
        properties: [],
        variants: [],
        composition: {
          allowedChildren: "None.",
          prohibited: "Design-system ownership of asset storage or upload.",
          parentPatterns: "Runtime branding configuration.",
        },
        futureCanonicalTarget:
          "The design system describes placement, clear space and tone rules only. Storage, upload and tenant configuration stay with the runtime screens.",
        governanceStatus: "documented current component",
        label: "GOVERNANCE RULE",
      },
    ),
    brand(
      "CarrierMark",
      "Represent an insurance carrier beside a plan.",
      "src/components/abox/carrier-mark.tsx",
      "CarrierMark",
      "plan tiles, cart and plan detail",
      {
        properties: [],
        variants: [],
        observedVariations: [
          "The mark is a deterministic monogram, not carrier artwork, and is explicitly illustrative.",
          "Carrier marks appear in listings but were deliberately removed from carrier filters.",
        ],
        futureCanonicalTarget:
          "A media slot that accepts real carrier artwork when asset management supplies it, falling back to the monogram.",
        governanceStatus: "experience-specific extension",
        label: "OBSERVED VARIATION",
      },
    ),
  ],
};
