/**
 * Phase 4 — icon interaction, accessibility and state audit.
 *
 * DOCUMENTATION ONLY. Describes the production implementation as found.
 * Consumers: `/design-system` and `/design-guide` only.
 */
import type { DensityEntry, RelationshipGroup } from "./types";

/* ------------------------------------------------------------------
 * Interaction & accessibility.
 * ------------------------------------------------------------------ */

export const ICON_ACCESSIBILITY: RelationshipGroup = {
  id: "icon-accessibility",
  title: "Icon interaction & accessibility",
  summary:
    "aria-hidden appears 257 times across 99 files and is the dominant convention: an icon beside a label is hidden from assistive technology. Icon-only controls carry an aria-label (90 uses) or an sr-only label (28 uses).",
  entries: [
    {
      pair: "Icon + text button",
      observed:
        "Button renders gap-2 with [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none; the icon is aria-hidden and the text is the accessible name.",
      source: "components/ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Icon-only button",
      observed:
        "Button size=\"icon\" gives a 36px square target; the accessible name comes from an aria-label on the control.",
      source: "components/ui/button.tsx and consumers such as marketplace.admin.assets.tsx",
      consistency: "varies",
      note: "OBSERVED VARIATION — most icon-only controls are labelled, but the convention is applied per call site, not enforced by a component.",
    },
    {
      pair: "Dialog / Sheet close",
      observed:
        "An X icon with a sibling <span className=\"sr-only\">Close</span> — visible glyph, spoken label.",
      source: "components/ui/dialog.tsx, sheet.tsx",
      consistency: "consistent",
      note: "The cleanest icon-only accessibility pattern in the codebase.",
    },
    {
      pair: "Decorative icon beside a label",
      observed: "aria-hidden on the icon; the adjacent text carries all meaning.",
      source: "257 occurrences across 99 files",
      consistency: "consistent",
    },
    {
      pair: "Status icon",
      observed:
        "Always accompanied by the status word. Colour and glyph reinforce the label; neither is the sole signal.",
      source: "abox/status-badge.tsx and outcome surfaces",
      consistency: "consistent",
    },
    {
      pair: "Icon inside an input",
      observed:
        "Absolutely positioned, pointer-events-none, muted, aria-hidden. The field's own label or placeholder carries the meaning.",
      source: "Search fields in internal-shell.tsx and roster screens",
      consistency: "consistent",
    },
    {
      pair: "Tooltip-revealed content",
      observed:
        "TooltipTrigger wraps the control in 5 files. OverflowText uses the same mechanism to reveal truncated values on hover and focus — keyboard users are not excluded.",
      source: "components/ui/tooltip.tsx, abox/overflow-text.tsx",
      consistency: "consistent",
    },
    {
      pair: "title attribute",
      observed:
        "281 occurrences, but the overwhelming majority are React props named title on components and page headers, not HTML title tooltips. CarrierMark is a genuine HTML title, paired with aria-hidden.",
      source: "abox/carrier-mark.tsx and component props",
      consistency: "variable",
      note: "OBSERVED VARIATION — CarrierMark is aria-hidden with a title, so its carrier name is available on hover but not to a screen reader; the carrier name is always printed as text beside it.",
    },
    {
      pair: "Focus treatment",
      observed:
        "focus-visible:ring-1 focus-visible:ring-ring on the control. The icon itself is never a focus target — the wrapping button or link is.",
      source: "components/ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Touch target",
      observed:
        "Below 640px a global rule gives buttons and links a 44px minimum height, so a 14px glyph still has a compliant target.",
      source: "src/styles.css mobile rule",
      consistency: "consistent",
    },
    {
      pair: "Disabled icon control",
      observed: "disabled:pointer-events-none disabled:opacity-50 on the control; the icon dims with it.",
      source: "components/ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Brand mark accessibility",
      observed:
        "AboxMark is hard-coded aria-hidden=\"true\". Where it appears in a shell header it sits beside the AboxWordmark text, so the brand still has a readable name.",
      source: "abox/logo.tsx and the three shells",
      consistency: "consistent",
    },
  ],
};

/* ------------------------------------------------------------------
 * Icon states.
 * ------------------------------------------------------------------ */

export const ICON_STATES: RelationshipGroup = {
  id: "icon-states",
  title: "Icon states",
  summary:
    "State is carried by colour, and occasionally by the wrapper's background or border. No icon changes size or stroke between states, and no icon is swapped for a different glyph to express a state.",
  entries: [
    {
      pair: "Default",
      observed: "currentColor, or text-muted-foreground for supporting icons.",
      source: "Global convention",
      consistency: "consistent",
    },
    {
      pair: "Hover",
      observed:
        "Colour promotion — muted to foreground, or muted to destructive on delete controls. Some CTA arrows translate a few pixels on group hover.",
      source: "Table actions, cart removal, action pills",
      consistency: "consistent",
    },
    {
      pair: "Focus",
      observed: "A ring on the wrapping control. The glyph is unchanged.",
      source: "components/ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Active / selected",
      observed:
        "The wrapper changes — background tint, border tone or an aria-pressed state. The icon takes the resulting foreground colour.",
      source: "Nav items, filter chips, tabs",
      consistency: "consistent",
    },
    {
      pair: "Disabled",
      observed: "opacity-50 on the control and pointer events removed. No separate disabled icon exists.",
      source: "components/ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Loading",
      observed:
        "A spinning Loader-class glyph with animate-spin where present; most async surfaces use skeletons or text instead of an icon.",
      source: "Async actions across routes",
      consistency: "variable",
      note: "OBSERVED VARIATION — there is no single loading-icon convention.",
    },
    {
      pair: "Success / warning / error / informational",
      observed:
        "Distinct glyph plus the matching semantic colour token, always with a text label: CheckCircle2 + success, AlertTriangle + warning, XCircle + destructive, Info + info.",
      source: "Outcome and status surfaces",
      consistency: "consistent",
    },
    {
      pair: "Destructive",
      observed: "Muted at rest, text-destructive on hover. The glyph never starts red.",
      source: "Trash2 usages",
      consistency: "consistent",
    },
    {
      pair: "Animation",
      observed:
        "Limited to CTA arrow translation, spinners and the landing artwork. The reduced-motion rule collapses all of it.",
      source: "src/styles.css reduced-motion rule",
      consistency: "consistent",
    },
  ],
};

/* ------------------------------------------------------------------
 * Icon ↔ element relationships.
 * ------------------------------------------------------------------ */

export const ICON_RELATIONSHIPS: RelationshipGroup = {
  id: "icon-relationships",
  title: "Icon relationships",
  summary:
    "Measured pairings between an icon and the element it sits with. Recorded as found; none of these were normalized.",
  entries: [
    {
      pair: "Icon → text",
      observed: "gap-2 at 16px icons, gap-1.5 at 14px, gap-1 at 12px. Vertically centred via items-center.",
      source: "Global convention across routes",
      consistency: "consistent",
    },
    {
      pair: "Icon → button label",
      observed: "gap-2, enforced by the Button primitive's base class along with size-4 and shrink-0.",
      source: "components/ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Icon → control height",
      observed: "16px glyph inside a 36px default control; the icon-only variant is a 36px square.",
      source: "components/ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Icon → badge",
      observed: "12px glyph beside a 10px uppercase label, gap-1.",
      source: "abox/status-badge.tsx consumers",
      consistency: "consistent",
    },
    {
      pair: "Icon → navigation item",
      observed: "16px glyph, gap-2 to a text-sm font-medium label, in both the marketplace header and the admin rail.",
      source: "abox/marketplace-shell.tsx, internal-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "Icon → input",
      observed: "16px muted glyph absolutely positioned inside the field, with left padding on the input to clear it.",
      source: "Search fields",
      consistency: "consistent",
    },
    {
      pair: "Icon → table action",
      observed: "14px glyph in a ghost icon button, muted at rest.",
      source: "abox/data-table.tsx consumers",
      consistency: "consistent",
    },
    {
      pair: "Icon → status label",
      observed: "Glyph and word always travel together; colour reinforces both.",
      source: "Outcome surfaces",
      consistency: "consistent",
    },
    {
      pair: "Icon → heading",
      observed:
        "20px glyph beside a section or page heading, gap-2. The cart heading is the reference example.",
      source: "routes/cart.tsx and marketing sections",
      consistency: "varies",
    },
    {
      pair: "Icon → empty state",
      observed: "20px primary glyph inside a 48px rounded-md hairline frame, above the title.",
      source: "abox/empty-state.tsx",
      consistency: "consistent",
    },
    {
      pair: "Icon → circular container",
      observed: "14–16px glyph centred in a 32px or 36px rounded-full bordered disc.",
      source: "Roughly 104 occurrences across routes and components",
      consistency: "variable",
      note: "UNOWNED AREA — repeated markup with no owning component.",
    },
    {
      pair: "Brand mark → header",
      observed:
        "AboxMark at its 36px default, gap to the AboxWordmark, inside the shell header's fixed height.",
      source: "marketplace-shell.tsx, internal-shell.tsx, member-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "Brand mark → sidebar",
      observed: "AboxMark tone=\"sidebar\" beside a text-display text-lg wordmark and a muted workspace name.",
      source: "abox/internal-shell.tsx",
      consistency: "consistent",
    },
    {
      pair: "Carrier mark → plan tile",
      observed:
        "36px CarrierMark disc to the left of the plan name, with the carrier name printed as text beside it.",
      source: "abox/plan-card.tsx, routes/cart.tsx",
      consistency: "consistent",
      note: "Carrier marks appear in plan listings and the cart only — they were deliberately removed from the carrier filter list.",
    },
    {
      pair: "Decorative art → section",
      observed:
        "Absolutely positioned behind content at opacity-30 to opacity-80, pointer-events-none, often hidden below md.",
      source: "routes/index.tsx",
      consistency: "consistent",
    },
  ],
};

/* ------------------------------------------------------------------
 * Experience-specific icon and asset conventions.
 * One shared system; these describe context of use only.
 * ------------------------------------------------------------------ */

export const ICON_EXPERIENCES: DensityEntry[] = [
  {
    mode: "Web / Marketing",
    context: "Landing, ICHRA, support, accessibility and other public pages",
    controlHeight: "Action pills at 40px+, generous CTA targets",
    padding: "Icons sit inside spacious plates and chips",
    gap: "gap-2 icon-to-label",
    typography: "Icons pair with display headings and text-sm body",
    iconSize: "16px in CTAs and chips, 20px on feature plates",
    source: "routes/index.tsx and public routes",
    note: "The only experience that uses the decorative SVG primitives. Brand presentation is heaviest here: AboxMark plus wordmark, product chips from src/lib/products.ts, and ArrowRight as the consistent CTA affordance.",
  },
  {
    mode: "Shopping / Marketplace",
    context: "Plans, cart, quote, compare, coverage, apply",
    controlHeight: "36px controls, compact filter chips",
    padding: "Dense tiles and rails",
    gap: "gap-1.5 to gap-2",
    typography: "Icons pair with text-sm and text-xs labels",
    iconSize: "16px default, 14px in tiles and chips, 12px in badges",
    source: "routes/plans.index.tsx, cart.tsx, abox/plan-card.tsx",
    note: "Commerce glyphs (ShoppingCart, ShoppingBag, Store), product icons from the central product map, and CarrierMark monograms. No product photography exists — plan identity is carried entirely by the carrier monogram and typography.",
  },
  {
    mode: "Dashboard / Admin",
    context: "Agency, JET platform, marketplace admin, member settings",
    controlHeight: "36px controls; 32px in dense table rows",
    padding: "Compact",
    gap: "gap-1.5 to gap-2",
    typography: "Icons pair with text-sm items and 10px uppercase micro-labels",
    iconSize: "16px in the nav rail, 14px in table actions, 12px in status badges",
    source: "abox/internal-shell.tsx, data-table.tsx",
    note: "The widest icon vocabulary: navigation, status, enforcement, document, upload and hierarchy glyphs. Also the home of the two asset-owning screens — branding and marketplace assets.",
  },
  {
    mode: "Future experiences",
    context: "Reserved governance slot",
    controlHeight: "Inherits",
    padding: "Inherits",
    gap: "Inherits",
    typography: "Inherits",
    iconSize: "Inherits",
    source: "—",
    note: "A new experience inherits this icon system unchanged. It may adjust density within the documented sizes; it does not add an icon library, a stroke convention or a brand mark. No assets or conventions are invented here in advance.",
  },
];
