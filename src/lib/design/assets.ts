/**
 * Phase 4 — logo, brand mark and visual asset audit.
 *
 * DOCUMENTATION ONLY. Describes the production implementation as found.
 * This module does not manage assets and must never become an asset editor:
 * runtime asset management already exists in the Branding and Marketplace
 * Assets screens, and those remain the source of truth.
 *
 * Consumers: `/design-system` and `/design-guide` only.
 */
import type { AssetGroup, FoundationCategory, RelationshipGroup } from "./types";

/* ------------------------------------------------------------------
 * Logos & brand marks.
 * ------------------------------------------------------------------ */

export const BRAND_ASSETS: AssetGroup = {
  id: "brand-assets",
  title: "Logos & brand marks",
  summary:
    "Every brand mark in the product is drawn in code from design tokens. There is no logo image file in the repository — which is what makes white-labelling possible without shipping a new asset.",
  entries: [
    {
      name: "AboxMark",
      kind: "Inline SVG React component (viewBox 0 0 40 40)",
      source: "src/components/abox/logo.tsx",
      consumers:
        "marketplace-shell, internal-shell, member-shell, routes/index.tsx, quote.tsx, placeholder-screen, both assistants, app.jet.branding.tsx",
      variants: "tone: primary | sage | sidebar | foreground; size prop (default 36)",
      dimensions: "36px default; the size prop drives both the span and the svg",
      accessibility:
        'aria-hidden="true" hard-coded; the adjacent wordmark text carries the brand name',
      owner: "Design system (component) — recoloured at runtime by Branding & White-Label tokens",
      status: "in-use",
      note: "CURRENT IMPLEMENTATION — every fill and stroke reads a CSS variable (--surface, --primary, --sage, --hairline, --sidebar-*), so the mark re-themes with the brand automatically.",
    },
    {
      name: "AboxWordmark",
      kind: "Text component, not an image",
      source: "src/components/abox/logo.tsx",
      consumers: "Shell headers and the landing page",
      variants: "default (24px + 'Agency in a Box' eyebrow) and compact (20px, no eyebrow)",
      dimensions: "Inline sizes 24px / 20px set as style fontSize",
      accessibility: "Real text — readable by assistive technology, no alt text needed",
      owner: "Design system (component)",
      status: "in-use",
      note: "The wordmark is typography, not artwork. It inherits the display face automatically.",
    },
    {
      name: "CarrierMark",
      kind: "Deterministic monogram component (no SVG, no image)",
      source: "src/components/abox/carrier-mark.tsx",
      consumers: "abox/plan-card.tsx, routes/cart.tsx",
      variants: "size prop (default 36); neutral fallback when a name yields no initials",
      dimensions: "36px disc; font size computed as size × 0.34",
      accessibility:
        "aria-hidden with an HTML title; the carrier name is always printed as text beside it",
      owner: "Design system (component)",
      status: "in-use",
      note: "CURRENT IMPLEMENTATION — the component's own source states these are illustrative placeholders, not official carrier logos. Initials sit on a hue derived deterministically from the carrier name, so a carrier always renders the same mark. Real carrier logos would arrive through asset management, not through this component.",
    },
    {
      name: "favicon.ico",
      kind: "Binary file",
      source: "public/favicon.ico, referenced in src/routes/__root.tsx",
      consumers: "The browser tab for every route",
      variants: "Single file, no light/dark or sized variants",
      dimensions: "Standard .ico",
      accessibility: "n/a",
      owner: "Application shell",
      status: "in-use",
      note: "The only binary visual asset committed to the repository.",
    },
    {
      name: "Marketplace LOGO / MARK / FAVICON / HERO",
      kind: "Runtime-uploaded assets",
      source:
        "src/routes/marketplace.admin.assets.tsx (REQ-M04-BRD-004), backed by marketplace-store",
      consumers: "Marketplace-branded surfaces at runtime",
      variants: "Four fixed asset types, one active each; HERO is optional",
      dimensions: "Set by the uploaded file; validated through the existing scan flow",
      accessibility: "Handled by the consuming surface",
      owner: "Marketplace Asset Management — existing runtime functionality",
      status: "runtime-managed",
      note: "GOVERNANCE RULE — the design system documents that these exist and are the source of truth for marketplace branding. It must not duplicate, replace or preview-manage them. When no asset is uploaded, the screen states that an approved baseline is used.",
    },
    {
      name: "White-label brand configuration",
      kind: "Runtime brand settings",
      source: "src/routes/app.jet.branding.tsx",
      consumers: "Every branded surface via tokens",
      variants: "Logo, favicon and wordmark configuration; hue-adaptive mark on light and dark",
      dimensions: "Configuration, not fixed dimensions",
      accessibility: "Handled by consuming components",
      owner: "Branding & White-Label — existing runtime functionality",
      status: "runtime-managed",
      note: "Referenced here as an existing source of truth. The reference pages describe it; they never configure it.",
    },
  ],
};

/* ------------------------------------------------------------------
 * Imagery & media.
 * ------------------------------------------------------------------ */

export const MEDIA_ASSETS: AssetGroup = {
  id: "media-assets",
  title: "Imagery & media",
  summary:
    "The single most important finding of this phase: the product ships no imagery. No raster file, no committed SVG file, no <img> element, no src/assets directory. Everything visual is tokens, type, icons and code-drawn SVG.",
  entries: [
    {
      name: "Raster imagery (PNG / JPG / WEBP / AVIF / GIF)",
      kind: "—",
      source: "No matches under src/ or public/",
      consumers: "None",
      variants: "—",
      dimensions: "—",
      accessibility: "—",
      owner: "—",
      status: "in-use",
      note: "CURRENT IMPLEMENTATION — confirmed absent. Any future imagery would be the first of its kind and needs a convention created deliberately.",
    },
    {
      name: "Committed SVG files",
      kind: "—",
      source: "No .svg file exists in the repository",
      consumers: "None",
      variants: "—",
      dimensions: "—",
      accessibility: "—",
      owner: "—",
      status: "in-use",
      note: "All SVG is authored inline inside React components, so it can read CSS variables.",
    },
    {
      name: "<img> elements",
      kind: "—",
      source: "No <img> tag anywhere in src",
      consumers: "None",
      variants: "—",
      dimensions: "—",
      accessibility: "—",
      owner: "—",
      status: "in-use",
      note: "UNOWNED AREA — because no image is rendered, there is no alt-text convention, no object-fit convention and no aspect-ratio convention to document. These will need to be defined the first time an image ships.",
    },
    {
      name: "Decorative SVG primitives",
      kind: "Inline SVG React components",
      source: "src/components/abox/decor/index.tsx",
      consumers: "src/routes/index.tsx only",
      variants: "size, tone, className props; opacity applied at the call site",
      dimensions:
        "Caller-driven — for example OrbitalRings at 560, RadialTicks at 420, CoverageWeave at 340",
      accessibility: "Background artwork, pointer-events-none, not announced",
      owner: "Design system (components)",
      status: "in-use",
      note: "These stand in for illustration. Six are used on the landing page: Aurora, DotField, OrbitalRings, RadialTicks, CoverageWeave, BlueprintGrid. Several are hidden below md.",
    },
    {
      name: "Auth screen artwork",
      kind: "Inline SVG",
      source: "src/routes/auth.tsx",
      consumers: "That route only",
      variants: "None",
      dimensions: "Local",
      accessibility: "Decorative",
      owner: "Local to the route",
      status: "in-use",
      note: "OBSERVED VARIATION — local artwork outside the decor module.",
    },
    {
      name: "Avatars & thumbnails",
      kind: "—",
      source: "components/ui/avatar.tsx exists; no screen consumes it",
      consumers: "None",
      variants: "—",
      dimensions: "—",
      accessibility: "—",
      owner: "Primitive",
      status: "available-unused",
      note: "People are represented by initials, icons or text — never by a photo.",
    },
  ],
};

/* ------------------------------------------------------------------
 * Naming, organization and variants.
 * ------------------------------------------------------------------ */

export const ASSET_ORGANIZATION: FoundationCategory = {
  id: "asset-organization",
  title: "Asset naming & organization",
  summary:
    "Because assets are components rather than files, naming follows React component conventions rather than an asset-file taxonomy.",
  entries: [
    {
      name: "Icon wrapper location",
      value: "src/components/icons/ — one file, tooth-icon.tsx, exporting Tooth.",
      source: "src/components/icons/",
      consumers: "src/lib/products.ts",
      ownership: "business",
      shared: "convention",
      maturity: "current",
      note: "A folder created for a single wrapper. The convention is clear even though the folder has one occupant.",
    },
    {
      name: "Decorative art location",
      value:
        "src/components/abox/decor/index.tsx — a single barrel file holding every decorative primitive.",
      source: "src/components/abox/decor/",
      consumers: "routes/index.tsx",
      ownership: "business",
      shared: "convention",
      maturity: "current",
    },
    {
      name: "Brand mark location",
      value: "src/components/abox/logo.tsx — AboxMark and AboxWordmark together.",
      source: "src/components/abox/logo.tsx",
      consumers: "All shells and several routes",
      ownership: "business",
      shared: "source-of-truth",
      maturity: "current",
    },
    {
      name: "Component naming",
      value:
        "PascalCase, descriptive of the thing rather than its shape: AboxMark, AboxWordmark, CarrierMark, Tooth, OrbitalRings, HealthPulseShield, CoverageWeave, FamilySilhouette.",
      source: "src/components/abox/*",
      consumers: "—",
      ownership: "business",
      shared: "convention",
      maturity: "current",
    },
    {
      name: "Compatibility aliases",
      value:
        "HairlineGrid = DotField, ConcentricArcs = OrbitalRings, DiagonalWeave = DotField — three export names pointing at two components.",
      source: "src/components/abox/decor/index.tsx",
      consumers: "None found outside the module",
      ownership: "business",
      shared: "one-off",
      maturity: "opportunity",
      note: "OBSERVED DUPLICATE — kept so older imports keep resolving. Removing them is a code change and is deferred.",
    },
    {
      name: "Variant expression",
      value:
        "Variants are props, not filenames: tone on AboxMark, compact on AboxWordmark, size on marks and decor, tone on grid primitives. There is no -light / -dark / -2x file suffix anywhere, because there are no files.",
      source: "abox/logo.tsx, carrier-mark.tsx, decor/index.tsx",
      consumers: "All consumers",
      ownership: "business",
      shared: "convention",
      maturity: "current",
    },
    {
      name: "Runtime asset identifiers",
      value:
        "Marketplace assets use fixed uppercase type identifiers — LOGO, MARK, FAVICON, HERO — plus a generated asset_id, filename and status (SCANNING, VALID).",
      source: "src/routes/marketplace.admin.assets.tsx, src/lib/marketplace-store.ts",
      consumers: "Asset management",
      ownership: "business",
      shared: "source-of-truth",
      maturity: "current",
      note: "The only file-oriented naming in the product, and it is runtime data rather than repository content.",
    },
    {
      name: "Light / dark handling",
      value:
        "No asset variants. Marks read theme-aware CSS variables, so one component serves both themes.",
      source: "abox/logo.tsx tones",
      consumers: "All",
      ownership: "business",
      shared: "convention",
      maturity: "current",
      note: "CURRENT IMPLEMENTATION — this is why the product needs no dark-mode logo file.",
    },
  ],
};

/* ------------------------------------------------------------------
 * Asset behaviour.
 * ------------------------------------------------------------------ */

export const ASSET_BEHAVIOR: RelationshipGroup = {
  id: "asset-behavior",
  title: "Asset behaviour",
  summary:
    "Cropping, object-fit and aspect-ratio conventions do not exist because no bitmap is rendered. What does exist is scaling, layering and fallback behaviour for code-drawn marks and artwork.",
  entries: [
    {
      pair: "Mark scaling",
      observed:
        "A numeric size prop drives width, height and — for CarrierMark — font size. No CSS scaling or transform is used.",
      source: "abox/logo.tsx, abox/carrier-mark.tsx",
      consistency: "consistent",
    },
    {
      pair: "Rounded corners",
      observed: "Marks are rounded-full. The EmptyState icon frame is rounded-md.",
      source: "abox/carrier-mark.tsx, abox/empty-state.tsx",
      consistency: "consistent",
    },
    {
      pair: "Borders",
      observed:
        "CarrierMark takes a hue-derived border; the fallback uses border-hairline. AboxMark strokes its outer disc with --hairline.",
      source: "abox/carrier-mark.tsx, abox/logo.tsx",
      consistency: "consistent",
    },
    {
      pair: "Overlays & scrims",
      observed:
        "Decorative layers sit behind content at reduced opacity with pointer-events-none; Aurora provides the only gradient wash.",
      source: "routes/index.tsx, abox/decor/index.tsx",
      consistency: "consistent",
    },
    {
      pair: "Responsive artwork",
      observed:
        "Heavier decoration is hidden below md — for example CoverageWeave carries hidden md:block. Sizes are fixed pixel props, not fluid.",
      source: "routes/index.tsx",
      consistency: "consistent",
    },
    {
      pair: "Overflow",
      observed:
        "Artwork is absolutely positioned inside an overflow-hidden section, often with negative offsets so it bleeds off the edge.",
      source: "routes/index.tsx",
      consistency: "consistent",
    },
    {
      pair: "Fallback — carrier",
      observed:
        "A carrier name yielding no initials renders an em dash on a neutral surface with a hairline border, at the same size.",
      source: "abox/carrier-mark.tsx",
      consistency: "consistent",
    },
    {
      pair: "Fallback — marketplace asset",
      observed:
        "With no uploaded asset the screen states that an approved baseline is used; nothing is broken or blank.",
      source: "routes/marketplace.admin.assets.tsx",
      consistency: "consistent",
    },
    {
      pair: "Loading / error state",
      observed:
        "Uploaded assets move through SCANNING to VALID, shown as a status row with a retire action.",
      source: "routes/marketplace.admin.assets.tsx",
      consistency: "consistent",
    },
    {
      pair: "Shadows on marks",
      observed: "None. Marks and artwork carry no shadow anywhere.",
      source: "src/**",
      consistency: "consistent",
    },
  ],
};

/* ------------------------------------------------------------------
 * Unused / duplicate findings.
 * ------------------------------------------------------------------ */

export const ASSET_UNUSED_FINDINGS = [
  "INSTALLED BUT UNUSED — @fortawesome/free-solid-svg-icons is a dependency with no import anywhere in src.",
  "POSSIBLY UNUSED — the decor module exports roughly 20 primitives but only six are consumed, all on the landing page. CornerCrop, TickerRule, MarqueeSerial, IsoStack, GlassPanel, HealthPulseShield, PolicyLines, FamilySilhouette and PlateFrame have no consumer found.",
  "OBSERVED DUPLICATE — HairlineGrid, ConcentricArcs and DiagonalWeave are compatibility aliases resolving to DotField and OrbitalRings; no external consumer uses them.",
  "AVAILABLE BUT UNUSED — the Avatar primitive exists in components/ui with no consuming screen, consistent with the absence of any imagery.",
  "OBSERVED VARIATION — the auth route holds inline decorative SVG outside the decor module.",
  "OBSERVED VARIATION — h-4 w-4 and size-4 express the same 16px icon size in different syntaxes.",
  "NOT UNUSED, RECORDED FOR CLARITY — @tabler/icons-react has exactly one import (IconDental) and it is load-bearing for the Dental product.",
];

/* ------------------------------------------------------------------
 * Ownership & governance.
 * ------------------------------------------------------------------ */

export const ASSET_OWNERSHIP = [
  {
    category: "Core shared icons (lucide-react)",
    sourceOfTruth: "The lucide-react package plus the conventions recorded in this audit",
    owner: "Design system",
    safeToChange:
      "Adding a new icon for a new feature, following the existing size and colour conventions",
    needsReview:
      "Replacing an icon already used across screens, or changing a default size or stroke",
    centralized: "Yes — one library serves every experience",
  },
  {
    category: "Product icons",
    sourceOfTruth: "src/lib/products.ts",
    owner: "Product, through that single map",
    safeToChange: "Nothing in isolation — the map is the only place a product glyph may be set",
    needsReview:
      "Any change to a product's glyph, since it propagates to every product surface at once",
    centralized: "Yes — already a single source of truth",
  },
  {
    category: "Local icon wrappers",
    sourceOfTruth: "src/components/icons/",
    owner: "Design system",
    safeToChange: "Adding a wrapper for a glyph the icon library genuinely lacks",
    needsReview: "Introducing a third icon library",
    centralized: "Partially — one wrapper exists today",
  },
  {
    category: "Brand marks",
    sourceOfTruth: "src/components/abox/logo.tsx",
    owner: "Design system, themed by Branding & White-Label tokens",
    safeToChange: "Using an existing tone or size in a new place",
    needsReview:
      "Changing the mark geometry, adding a tone, or hard-coding a colour instead of a token",
    centralized: "Yes",
  },
  {
    category: "Carrier marks",
    sourceOfTruth: "src/components/abox/carrier-mark.tsx",
    owner: "Design system",
    safeToChange: "Using the component in a new plan context",
    needsReview:
      "Replacing placeholder monograms with real carrier logos — that is an asset-management decision with licensing implications, not a styling change",
    centralized: "Yes",
  },
  {
    category: "Decorative artwork",
    sourceOfTruth: "src/components/abox/decor/index.tsx",
    owner: "Design system",
    safeToChange: "Opacity, position and size at the call site",
    needsReview: "Using heavy artwork outside the marketing experience",
    centralized: "Yes, though most of it is currently unused",
  },
  {
    category: "White-label brand assets",
    sourceOfTruth: "The Branding & White-Label screens",
    owner: "The tenant, through existing runtime functionality",
    safeToChange: "Anything the branding screen already permits",
    needsReview: "Nothing here — this is runtime configuration, not design-system content",
    centralized: "Yes — and the design system must not duplicate it",
  },
  {
    category: "Marketplace-managed assets",
    sourceOfTruth: "The Marketplace Assets screen and its store",
    owner: "Marketplace administrators",
    safeToChange: "Uploading, validating and retiring the four fixed asset types",
    needsReview: "Adding a fifth asset type — that is a product requirement change",
    centralized: "Yes — and the design system must not duplicate it",
  },
  {
    category: "Third-party assets",
    sourceOfTruth: "None in the repository",
    owner: "—",
    safeToChange: "—",
    needsReview: "Introducing any third-party logo, which brings licensing obligations",
    centralized: "n/a — no third-party mark ships today",
  },
];

/* ------------------------------------------------------------------
 * Maturity.
 * ------------------------------------------------------------------ */

export const ICON_ASSET_MATURITY = [
  {
    item: "Icon library choice",
    maturity: "centralized",
    detail: "One library carries 149 icons across 144 files.",
  },
  {
    item: "Stroke width",
    maturity: "centralized",
    detail: "Never overridden — the library default is universal.",
  },
  {
    item: "Icon colour",
    maturity: "centralized",
    detail: "currentColor or a semantic token; no literal colour on any icon.",
  },
  {
    item: "Product icon mapping",
    maturity: "centralized",
    detail: "src/lib/products.ts is the single source of truth.",
  },
  {
    item: "Brand mark",
    maturity: "centralized",
    detail: "One token-driven component with four tones.",
  },
  {
    item: "Carrier mark",
    maturity: "centralized",
    detail: "One deterministic component with a documented placeholder status.",
  },
  {
    item: "Button icon sizing",
    maturity: "centralized",
    detail: "Enforced by the Button primitive's [&_svg]:size-4 rule.",
  },
  {
    item: "Icon size ladder",
    maturity: "partially centralized",
    detail: "Four sizes dominate, but only the Button case is enforced; the rest is convention.",
  },
  {
    item: "Icon accessibility",
    maturity: "partially centralized",
    detail: "aria-hidden is near-universal; icon-only labelling is per call site.",
  },
  {
    item: "Circular icon container",
    maturity: "repeated",
    detail: "Roughly 104 similar wrappers with no owning component.",
  },
  {
    item: "Negative-status glyphs",
    maturity: "inconsistent",
    detail: "XCircle, Ban, ShieldAlert and PauseCircle overlap in meaning.",
  },
  {
    item: "Dual-purpose glyphs",
    maturity: "unowned",
    detail: "Eye, Shield, Users and Activity each carry two meanings.",
  },
  {
    item: "Loading icon",
    maturity: "inconsistent",
    detail: "No single spinner convention across async surfaces.",
  },
  {
    item: "Decorative artwork",
    maturity: "undocumented",
    detail: "Most primitives are unused and none carried usage guidance before this audit.",
  },
  {
    item: "Imagery conventions",
    maturity: "future opportunity",
    detail: "No image ships, so alt text, aspect ratio and object-fit have no convention yet.",
  },
  {
    item: "Second icon library",
    maturity: "future opportunity",
    detail: "Tabler is carried for one glyph; Font Awesome for none.",
  },
];

export const ICON_ASSET_DEFERRED = [
  {
    item: "Remove the unused Font Awesome dependency",
    detail: "No import exists; removal affects bundle and install only, not rendered output.",
    risk: "Low — but it is a dependency change, out of scope for a documentation phase",
  },
  {
    item: "Consolidate the single Tabler import",
    detail:
      "Would require replacing the dental glyph, which was chosen deliberately after several attempts.",
    risk: "High — reopens a settled decision",
  },
  {
    item: "Converge h-4 w-4 and size-4",
    detail: "Same rendered size, two syntaxes across 312 occurrences.",
    risk: "Low visually, high in churn",
  },
  {
    item: "Shared Icon wrapper or icon-size tokens",
    detail: "Would make the size ladder enforceable rather than conventional.",
    risk: "High — touches nearly every component",
  },
  {
    item: "IconButton component with a required label",
    detail: "Would make icon-only accessibility structural instead of per call site.",
    risk: "Medium — changes control markup",
  },
  {
    item: "IconDisc component for the circular wrapper",
    detail: "Would absorb roughly 104 repeated wrappers.",
    risk: "Medium — the wrappers vary in size and tone",
  },
  {
    item: "Resolve the decor compatibility aliases and unused primitives",
    detail: "Nine primitives and three aliases appear to have no consumer.",
    risk: "Low, but deletion needs certainty the audit cannot fully provide",
  },
  {
    item: "A negative-status glyph mapping",
    detail: "One glyph per outcome across XCircle, Ban, ShieldAlert and PauseCircle.",
    risk: "Medium — changes icons on enforcement screens",
  },
  {
    item: "Imagery conventions",
    detail: "Define alt text, aspect ratio, object-fit and fallbacks before the first image ships.",
    risk: "None — purely additive, nothing exists to break",
  },
  {
    item: "Generated Figma icon-library export",
    detail: "The used-icon set could be exported once a token layer exists.",
    risk: "None — additive tooling",
  },
];

export const FIGMA_ICON_ASSET_MAPPING = [
  {
    implementation: "lucide-react",
    figma: "One shared icon library, published as a component library",
    note: "Only the 149 icons actually in use are imported — not the whole set.",
  },
  {
    implementation: "A single icon (e.g. ArrowRight)",
    figma: "One component",
    note: "Named with the library name so the origin stays traceable.",
  },
  {
    implementation: "h-3 / h-3.5 / h-4 / h-5 (12/14/16/20px)",
    figma: "A size property on the icon component",
    note: "16px is the default variant; the other three are alternates.",
  },
  {
    implementation: "currentColor",
    figma: "Colour inherited from the parent, not baked into the icon component",
    note: "The mechanism that keeps one icon usable on every surface.",
  },
  {
    implementation: "Semantic colour token on an icon",
    figma: "A colour property bound to the shared colour styles",
    note: "Never a raw hex.",
  },
  {
    implementation: "Icon state (hover, active, disabled, status)",
    figma: "A variant on the parent control, not on the icon",
    note: "Mirrors the implementation, where state lives on the wrapper.",
  },
  {
    implementation: "Semantic category (navigation, status, action, commerce…)",
    figma: "Library page or naming prefix",
    note: "Dual-purpose glyphs appear once and are cross-referenced, not duplicated.",
  },
  {
    implementation: "src/lib/products.ts",
    figma: "A product-icon mapping table in the library documentation",
    note: "Keeps the one-glyph-per-product rule visible to designers.",
  },
  {
    implementation: "AboxMark",
    figma: "A brand component with a tone property",
    note: "Four tones become four variants; colours bind to brand styles so white-label re-themes it.",
  },
  {
    implementation: "AboxWordmark",
    figma: "A text-based brand component with a compact variant",
    note: "A text style, not an outlined logo.",
  },
  {
    implementation: "CarrierMark",
    figma: "A monogram component with a placeholder label",
    note: "Must be marked illustrative so nobody mistakes it for a licensed carrier logo.",
  },
  {
    implementation: "Decorative SVG primitives",
    figma: "An illustration section with usage notes",
    note: "Marketing-only; explicitly not general-purpose.",
  },
  {
    implementation: "Marketplace LOGO / MARK / FAVICON / HERO",
    figma: "A documented placeholder slot",
    note: "Runtime-managed content. The library shows where it lands; it never stores the assets.",
  },
  {
    implementation: "Shared vs. experience-specific",
    figma: "Core library vs. an experience guidance page",
    note: "One core library; experiences document context only.",
  },
  {
    implementation: "Icon → label spacing (gap-1 / 1.5 / 2 by size)",
    figma: "Auto-layout spacing on the component",
    note: "Taken from the measured relationships, not chosen fresh.",
  },
];
