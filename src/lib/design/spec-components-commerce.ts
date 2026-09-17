/**
 * Phase 8 — Commerce category specification.
 * DOCUMENTATION ONLY. Commerce components are experience-specific extensions
 * of ABox Core, not core primitives.
 */
import type { CanonicalComponentSpec, SpecCategoryGroup } from "./component-spec-types";

const commerce = (
  name: string,
  purpose: string,
  file: string,
  exportName: string,
  consumers: string,
  extra: Partial<CanonicalComponentSpec>,
): CanonicalComponentSpec => ({
  name,
  category: "commerce",
  purpose,
  anatomy: [{ part: "Root", requirement: "required", role: "card or region" }],
  contentModel: ["Governed product data only; never invented values."],
  properties: [],
  variants: [],
  states: [
    {
      state: "selected",
      affects: "border, background",
      accessibility: "selection is stated in text as well",
      label: "CURRENT IMPLEMENTATION",
    },
  ],
  sizes: "Set by the listing grid.",
  density: "Marketplace comfortable density.",
  dependencies: {
    typography: "title, price and metadata roles",
    spacing: "card padding family, gap-2 within rows",
    color: "--card, tier tokens, status tones",
    shape: "rounded-2xl",
    icon: "16px plus carrier mark",
  },
  responsive: "Grid collapses to a single column on narrow viewports.",
  accessibility: "Every status is stated in words; tier color is never the only signal.",
  interaction: "Selection, comparison and detail navigation preserve shopping state.",
  composition: {
    allowedChildren: "Badges, marks, actions.",
    prohibited: "Nested plan cards.",
    parentPatterns: "Plan results grid, cart, comparison.",
  },
  experienceExtensions: "Shopping and marketplace only.",
  currentImplementation: [{ file, exportName, consumers }],
  observedVariations: [],
  futureCanonicalTarget:
    "A commerce extension layer built from core primitives, kept out of ABox Core itself.",
  figmaMapping: "Component set with Tier, Exchange, Selected and Density variants.",
  migrationNotes: "No migration implied.",
  governanceStatus: "experience-specific extension",
  label: "CURRENT IMPLEMENTATION",
  ...extra,
});

export const COMMERCE_SPECS: SpecCategoryGroup = {
  id: "spec-commerce",
  category: "commerce",
  title: "Commerce",
  summary:
    "Commerce components express product meaning: plans, tiers, prices and exchange status. They extend the core rather than living inside it, so shopping rules never leak into generic primitives.",
  specs: [
    commerce(
      "PlanCard",
      "Present one plan with its tier, price, network and identifiers.",
      "src/components/abox/plan-card.tsx",
      "PlanCard",
      "6 files",
      {
        anatomy: [
          { part: "Root", requirement: "required", role: "plan surface" },
          { part: "Media", requirement: "optional", role: "carrier mark" },
          { part: "Title", requirement: "required", role: "plan name" },
          { part: "Indicator", requirement: "required", role: "metal tier badge" },
          {
            part: "Supporting",
            requirement: "required",
            role: "carrier, plan identifier, exchange status",
          },
          { part: "Content", requirement: "required", role: "premium and cost detail" },
          { part: "Action", requirement: "required", role: "select or view detail" },
        ],
        variants: [
          {
            kind: "structural",
            name: "form",
            values: "compact tile, fuller detail",
            label: "OBSERVED VARIATION",
          },
          {
            kind: "semantic",
            name: "tier",
            values: "metal tiers including Expanded Bronze",
            label: "CURRENT IMPLEMENTATION",
          },
        ],
        observedVariations: [
          "Two structural forms exist for tiles and detail.",
          "Exchange status and plan identifier appear on both forms.",
        ],
      },
    ),
    commerce(
      "ProductCard",
      "Represent a product line a shopper can enter.",
      "src/routes/index.tsx product plates",
      "composed per screen",
      "landing and shopping headers",
      {
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "A named product entry component shared by landing, header and shopping switcher.",
        governanceStatus: "future canonical target",
      },
    ),
    commerce(
      "PlanComparison",
      "Compare plans side by side.",
      "src/routes/compare.tsx",
      "route composition",
      "compare route",
      {
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "A comparison layout built from the plan card anatomy rather than parallel markup.",
        governanceStatus: "future canonical target",
      },
    ),
    commerce(
      "Amount",
      "Display a currency figure consistently.",
      "route markup",
      "formatting helpers",
      "plans, cart and quote",
      {
        dependencies: {
          typography: "numeric type role with tabular alignment where columns align",
          spacing: "inline",
          color: "--foreground",
          shape: "none",
          icon: "none",
        },
        observedVariations: [
          "Premiums are formatted as $#,##0.00; other figures follow their own formatting.",
        ],
        label: "UNOWNED AREA",
        futureCanonicalTarget:
          "One amount component owning currency, precision, locale and alignment.",
        governanceStatus: "future canonical target",
      },
    ),
    commerce(
      "TierDisplay",
      "Show a plan tier.",
      "src/components/abox/metal-badge.tsx",
      "MetalBadge",
      "tiles, detail and filters",
      {
        accessibility: "Foreground is chosen against the tier background so text stays readable.",
      },
    ),
    commerce(
      "CommerceStatus",
      "Show on-exchange or off-exchange and related plan status.",
      "src/components/abox/status-badge.tsx",
      "StatusBadge",
      "plan tiles and detail",
      {
        observedVariations: [
          "Status filters reuse the listing badge treatments so both read identically.",
        ],
      },
    ),
    commerce(
      "CartSummary",
      "Summarise selected coverage and its total.",
      "src/routes/cart.tsx",
      "route composition",
      "cart route",
      {
        observedVariations: [
          "The cart keeps one item per product type, so health plus dental, vision and life can coexist.",
          "Add-ons are surfaced as a highlighted section within the summary.",
        ],
        label: "UNOWNED AREA",
        governanceStatus: "future canonical target",
      },
    ),
  ],
};
