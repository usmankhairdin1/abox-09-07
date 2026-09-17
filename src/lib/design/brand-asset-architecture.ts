/**
 * Phase 6 — brand and asset architecture.
 *
 * DOCUMENTATION ONLY.
 *
 * The central distinction: CORE BRAND FOUNDATIONS are design-system property;
 * RUNTIME BRAND CONFIGURATION belongs to the existing Branding & White-Label
 * screens and Marketplace Asset Management. This module documents the boundary.
 * It does not duplicate, replace or manage either system.
 *
 * Consumers: /design-system, /design-guide.
 */
import type { BlueprintRow } from "./types";

/** What the design system owns versus what the running product owns. */
export const BRAND_ARCHITECTURE: BlueprintRow[] = [
  {
    item: "Product mark (AboxMark)",
    source: "src/components/abox/logo.tsx",
    current:
      "Code-drawn inline SVG with four tones and a size prop. Not a file, not an upload. Five direct consumers.",
    future: "CORE BRAND FOUNDATION. Lives in the Figma brand frame with tone variants.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Wordmark (AboxWordmark)",
    source: "src/components/abox/logo.tsx",
    current: "Code-drawn, uses the display type family, hides on the narrowest shell widths.",
    future: "CORE BRAND FOUNDATION.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Favicon",
    source: "public/favicon.ico",
    current:
      "The only binary image asset in the entire project. No PNG, JPG, WEBP, AVIF, GIF or SVG file exists under src or public besides it.",
    future: "CORE BRAND FOUNDATION, generated from the mark rather than maintained separately.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Brand colours",
    source: "src/styles.css",
    current:
      "Meridian Navy primary with a sage supporting accent, plus an AI accent, defined as tokens and themed for light and dark.",
    future: "CORE BRAND FOUNDATION mapped directly to Figma colour variables.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Brand typography",
    source: "src/styles.css, loaded in src/routes/__root.tsx",
    current:
      "A display family for headings and a body family for text, plus serif and mono aliases. JetBrains Mono is loaded but has no measured production consumer.",
    future:
      "CORE BRAND FOUNDATION. The unused mono load is recorded as a FUTURE OPPORTUNITY, not removed.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 3 — typography",
  },
  {
    item: "Product branding (Shop plans, ICHRA, Dental, Vision, Life)",
    source: "src/lib/products.ts and the product icon set",
    current:
      "Each product carries an icon and a label used consistently in the header, hero chips and product switcher. ICHRA is always uppercase.",
    future: "CORE BRAND FOUNDATION — the product vocabulary is part of the brand, not of a screen.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "White-label boundaries",
    source: "src/routes/app.jet.branding.tsx and related screens",
    current:
      "Per-tenant brand configuration is created, edited and stored by the existing Branding screens at runtime.",
    future:
      "RUNTIME BRAND CONFIGURATION. The design system describes the slots a tenant brand can fill; it never stores or edits a tenant brand.",
    label: "GOVERNANCE RULE",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Marketplace brand assets",
    source: "src/routes/marketplace.admin.brand.tsx, marketplace.admin.assets.tsx",
    current: "Per-marketplace assets are uploaded and managed by Marketplace Asset Management.",
    future: "RUNTIME BRAND CONFIGURATION. The reference pages must never become an asset editor.",
    label: "GOVERNANCE RULE",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "CarrierMark",
    source: "src/components/abox/carrier-mark.tsx",
    current:
      "A deterministic monogram derived from the carrier name, with a neutral fallback. Illustrative — not a real carrier logo.",
    future:
      "Stays illustrative in the design system. Real carrier logos, if ever introduced, would be RUNTIME ASSETS owned by asset management.",
    label: "GOVERNANCE RULE",
    phase: "Phase 4 — iconography & assets",
  },
];

/** Where each class of asset actually lives and who is allowed to change it. */
export const ASSET_ARCHITECTURE: BlueprintRow[] = [
  {
    item: "Design-system assets",
    source: "src/lib/design/*, src/components/design/reference-kit.tsx",
    current:
      "No image files at all. The reference layer is data plus rendering of real production components.",
    future:
      "Stays fileless. The reference layer documents assets; it never becomes a second place to store them.",
    label: "GOVERNANCE RULE",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Production assets",
    source: "src/components/abox/logo.tsx, decor/, icons/",
    current:
      "Everything visual is code: inline SVG marks, inline decorative SVG in decor and auth, and icon components. No <img> tag exists anywhere in the product.",
    future:
      "Keep code-drawn assets as the default. Any future binary asset needs an explicit owner before it is added.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Runtime marketplace assets",
    source: "Marketplace Asset Management screens",
    current: "Uploaded and managed at runtime by marketplace administrators.",
    future: "RUNTIME source of truth. Out of scope for the design system, permanently.",
    label: "GOVERNANCE RULE",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Branding assets",
    source: "Branding & White-Label screens",
    current: "Per-tenant logos and brand values configured at runtime.",
    future: "RUNTIME source of truth. The design system provides the slot, not the content.",
    label: "GOVERNANCE RULE",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Icons",
    source: "lucide-react across 144 files; Tabler IconDental once",
    current:
      "149 distinct lucide icons in production. Font Awesome is installed but has no production consumer.",
    future:
      "lucide is the canonical set. A second library requires an explicit exception, as the dental icon already has.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Decorative graphics",
    source: "src/components/abox/decor/",
    current:
      "DotField, DiagonalWeave and related inline SVG consumed by the shells and EmptyState. Seven exports have no located direct consumer.",
    future:
      "Core decorative layer. The unconsumed exports are recorded as POSSIBLY UNUSED, not deleted.",
    label: "POSSIBLY UNUSED",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Future Figma assets",
    source: "—",
    current: "None exist.",
    future:
      "FUTURE FIGMA ORGANIZATION — a brand frame holding the mark, wordmark and product icons, mirroring the code. No tenant or marketplace asset ever enters the library.",
    label: "FUTURE FIGMA ORGANIZATION",
    phase: "Phase 4 — iconography & assets",
  },
];

/** The ownership boundary, stated once, plainly. */
export const ASSET_OWNERSHIP_RULES: string[] = [
  "GOVERNANCE RULE — the design system owns the ABox product brand: mark, wordmark, brand colours, type families and the product icon vocabulary.",
  "GOVERNANCE RULE — Branding & White-Label owns every per-tenant brand value at runtime. The design system never reads, writes or mirrors tenant configuration.",
  "GOVERNANCE RULE — Marketplace Asset Management owns every uploaded marketplace asset. The reference pages display nothing from it and edit nothing in it.",
  "GOVERNANCE RULE — a carrier logo is runtime data, not a design asset. CarrierMark stays an illustrative monogram.",
  "GOVERNANCE RULE — the reference pages are read-only documentation. They must never gain an upload control, an editor or a write path.",
  "CURRENT IMPLEMENTATION — the product currently ships exactly one binary asset, the favicon. Everything else visual is drawn in code.",
];
