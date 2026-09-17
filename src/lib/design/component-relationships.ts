/**
 * Phase 5 — component composition relationships and cross-references.
 *
 * DOCUMENTATION ONLY. Records the relationships that actually occur in
 * production code, plus how components consume the Phase 2 spacing, Phase 3
 * typography and Phase 4 iconography findings. Nothing here changes a value.
 */
import type { RelationshipGroup } from "./types";

export const COMPONENT_COMPOSITION: RelationshipGroup = {
  id: "component-composition",
  title: "Component composition relationships",
  summary:
    "Recurring parent → child relationships as implemented. Each is marked as shared, experience-specific, or repeated without an owning component.",
  entries: [
    {
      pair: "Button → icon + label",
      observed:
        "gap-2 between the two; the icon is forced to size-4 and pointer-events-none by the primitive",
      source: "ui/button.tsx",
      consistency: "consistent",
      note: "Shared relationship — the strongest single contract in the component layer.",
    },
    {
      pair: "ACTION_PILL → icon + label",
      observed: "gap-1 at xs, gap-1.5 at sm/md/lg; the consumer supplies both children",
      source: "abox/action-pill.ts",
      consistency: "mostly-consistent",
      note: "Shared relationship, but unenforced — the class string cannot constrain its children.",
    },
    {
      pair: "Card → CardHeader → CardTitle → CardDescription → CardContent → CardFooter",
      observed: "The full chain exists in the primitive and is used by six consumers",
      source: "ui/card.tsx",
      consistency: "consistent",
      note: "Repeated but largely unowned — most surfaces write the equivalent markup inline.",
    },
    {
      pair: "Label → control → error text",
      observed: "Label above the control; error as adjacent text-xs text-destructive",
      source: "ui/label.tsx + ui/input.tsx + route markup",
      consistency: "varies",
      note: "Repeated without an owning component. UNOWNED AREA.",
    },
    {
      pair: "Dialog → Header → Title → Description → Content → Footer",
      observed: "Radix-backed chain with a close control carrying an sr-only label",
      source: "ui/dialog.tsx",
      consistency: "consistent",
      note: "Shared relationship.",
    },
    {
      pair: "Sheet → Header → Content → close",
      observed: "Same chain as Dialog, side-anchored",
      source: "ui/sheet.tsx",
      consistency: "consistent",
      note: "Shared relationship; backs the mobile navigation rail and the plans filter drawer.",
    },
    {
      pair: "DataTable → header → body → row → cell",
      observed:
        "No toolbar and no pagination child; toolbars are route markup and nothing is paginated",
      source: "abox/data-table.tsx",
      consistency: "consistent",
      note: "Shared relationship with two missing links that are FUTURE OPPORTUNITY, not defects.",
    },
    {
      pair: "Results toolbar → DataTable / plan list",
      observed: "Sort select, shopping-mode bar and edit-quote action sit above the results",
      source: "src/routes/plans.index.tsx",
      consistency: "one-off",
      note: "Repeated but unowned — the toolbar has no component.",
    },
    {
      pair: "PageHeader → eyebrow → title → description → actions",
      observed: "Actions sit on the trailing edge; a hairline rule closes the block",
      source: "abox/page-header.tsx",
      consistency: "consistent",
      note: "Shared relationship across dashboard and shopping.",
    },
    {
      pair: "KpiCard → label → metric → delta → hint",
      observed: "Metric rolls in through CountUp; the delta is optional",
      source: "abox/kpi-card.tsx",
      consistency: "consistent",
      note: "Dashboard-specific relationship.",
    },
    {
      pair: "PlanCard → CarrierMark → title → MetalBadge → StatusBadge row → price → actions",
      observed:
        "One composition rendering five other ABox components; the deepest nesting in the product",
      source: "abox/plan-card.tsx",
      consistency: "consistent",
      note: "Shopping-specific relationship.",
    },
    {
      pair: "StatusBadge → dot + label",
      observed: "6px aria-hidden dot then the label, both tinted from one --tone",
      source: "abox/status-badge.tsx",
      consistency: "consistent",
      note: "Shared relationship.",
    },
    {
      pair: "EmptyState → icon frame → title → body → action",
      observed: "48px frame with a 20px primary glyph above the text",
      source: "abox/empty-state.tsx",
      consistency: "consistent",
      note: "Shared relationship.",
    },
    {
      pair: "Shell → nav group → nav item → icon + label + active state",
      observed: "No badge child on nav items today",
      source: "the three shells",
      consistency: "consistent",
      note: "Shared relationship.",
    },
    {
      pair: "Wizard stepper → step marker → label → connector",
      observed: "Complete, current and upcoming markers along a connector",
      source: "abox/downline-wizard-stepper.tsx",
      consistency: "consistent",
      note: "Experience-specific relationship (agency downline flow).",
    },
    {
      pair: "M08 screen → TraceRail + DimensionStrip + OutcomeTag + BlockerCard",
      observed:
        "Every governed screen pairs its content with trace identifiers and separate status dimensions",
      source: "components/m08/kit.tsx",
      consistency: "consistent",
      note: "Experience-specific and governed — not a generic pattern.",
    },
  ],
};

export const COMPONENT_TYPOGRAPHY_CROSSREF: RelationshipGroup = {
  id: "component-typography-crossref",
  title: "Component typography cross-reference",
  summary:
    "How representative components consume the Phase 3 typography findings. Values are recorded exactly as implemented.",
  entries: [
    {
      pair: "Button label",
      observed: "text-sm font-medium; text-xs at size sm",
      source: "ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "ACTION_PILL label",
      observed: "text-xs at xs, text-sm at sm/md/lg, font-medium throughout",
      source: "abox/action-pill.ts",
      consistency: "consistent",
    },
    {
      pair: "DataTable header",
      observed: "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
      source: "abox/data-table.tsx",
      consistency: "consistent",
      note: "The canonical serial header treatment.",
    },
    {
      pair: "DataTable body",
      observed: "text-sm; right-aligned cells add tabular-nums",
      source: "abox/data-table.tsx",
      consistency: "consistent",
      note: "Cross-reference Phase 3 — text-sm (779 occurrences) is the real body size.",
    },
    {
      pair: "StatusBadge label",
      observed: "Small label at full opacity, colour mixed from --tone at 88%",
      source: "abox/status-badge.tsx",
      consistency: "consistent",
    },
    {
      pair: "PageHeader title",
      observed:
        "Heading sizes were reduced product-wide in an earlier approved change; the compact variant's title was raised again for the shopping results header",
      source: "abox/page-header.tsx",
      consistency: "varies",
      note: "OBSERVED VARIATION — section headings use several sizes for one role. Deferred in Phase 3 and still deferred.",
    },
    {
      pair: "KpiCard metric",
      observed: "Large numeric with tabular alignment through CountUp",
      source: "abox/kpi-card.tsx",
      consistency: "consistent",
      note: "Cross-reference Phase 3 numeric typography.",
    },
    {
      pair: "Card description",
      observed: "Several sizes across consumers for one conceptual role",
      source: "ui/card.tsx and route markup",
      consistency: "varies",
      note: "OBSERVED VARIATION carried forward from Phase 3.",
    },
    {
      pair: "Eyebrow / serial",
      observed: "Uppercase with tracking; five distinct tracking values were measured product-wide",
      source: "PageHeader, DataTable, reference layer",
      consistency: "varies",
      note: "OBSERVED VARIATION carried forward from Phase 3.",
    },
    {
      pair: "Premium and price",
      observed: "Formatted as $#,##0.00 with tabular numerals",
      source: "lib/format.ts, abox/plan-card.tsx",
      consistency: "consistent",
    },
  ],
};

export const COMPONENT_SPACING_CROSSREF: RelationshipGroup = {
  id: "component-spacing-crossref",
  title: "Component spacing cross-reference",
  summary:
    "How representative components consume the Phase 2 spacing findings. Nothing was re-spaced.",
  entries: [
    {
      pair: "Button internal padding",
      observed: "px-4 py-2 default, px-3 at sm, px-8 at lg",
      source: "ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "Icon-to-text gap",
      observed: "gap-2 in Button; gap-1 / gap-1.5 in the pills",
      source: "ui/button.tsx, abox/action-pill.ts",
      consistency: "varies",
      note: "OBSERVED VARIATION carried forward from Phase 2 — gap-1.5 vs gap-2 for the same relationship.",
    },
    {
      pair: "Card padding",
      observed: "p-5 is dominant (187 occurrences); p-3, p-4 and p-6 also occur",
      source: "Route markup",
      consistency: "varies",
      note: "OBSERVED VARIATION carried forward. Centralising it would risk visual change.",
    },
    {
      pair: "Table cell padding",
      observed: "px-5 py-4; the empty row uses px-5 py-10",
      source: "abox/data-table.tsx",
      consistency: "consistent",
    },
    {
      pair: "Title-to-description gap",
      observed: "Small vertical gap inside PageHeader, then a hairline rule closing the block",
      source: "abox/page-header.tsx",
      consistency: "consistent",
    },
    {
      pair: "Content-to-action gap",
      observed: "Action rows separate from content with the common gap-2 / gap-3 rhythm",
      source: "PlanCard, PageHeader, route markup",
      consistency: "mostly-consistent",
      note: "gap-2 is the single most frequent spacing utility in the codebase (316 occurrences).",
    },
    {
      pair: "Field-to-field gap",
      observed: "Set by the route or the module kit, not by a shared field component",
      source: "Route forms, m06/kit.tsx, lucie-app/ui.tsx",
      consistency: "varies",
      note: "UNOWNED AREA.",
    },
    {
      pair: "Toolbar-to-results gap",
      observed: "Route-level spacing above the results region",
      source: "src/routes/plans.index.tsx",
      consistency: "one-off",
    },
    {
      pair: "Content container width",
      observed: "max-w-[88rem] centred on web-experience pages; dashboard pages excluded",
      source: "Route markup, MemberShell",
      consistency: "consistent",
    },
  ],
};

export const COMPONENT_ICON_CROSSREF: RelationshipGroup = {
  id: "component-icon-crossref",
  title: "Component iconography cross-reference",
  summary: "How representative components consume the Phase 4 iconography findings.",
  entries: [
    {
      pair: "Button",
      observed:
        "lucide-react, size-4 enforced, currentColor, default stroke, decorative beside a label and aria-labelled when icon-only",
      source: "ui/button.tsx",
      consistency: "consistent",
    },
    {
      pair: "StatusBadge",
      observed: "No icon — an aria-hidden 6px dot instead of a glyph",
      source: "abox/status-badge.tsx",
      consistency: "consistent",
      note: "A deliberate difference from the usual status-icon convention.",
    },
    {
      pair: "MetalBadge",
      observed: "No icon; tier meaning is carried by the solid token fill and the word",
      source: "abox/metal-badge.tsx",
      consistency: "consistent",
    },
    {
      pair: "CarrierMark",
      observed:
        "Not an icon — a deterministic monogram disc at 36 / 34 / 30px with a genuine HTML title attribute",
      source: "abox/carrier-mark.tsx",
      consistency: "consistent",
      note: "Brand-asset usage, documented as illustrative placeholder art.",
    },
    {
      pair: "PlanCard",
      observed: "CarrierMark plus Button-owned action icons at 16px",
      source: "abox/plan-card.tsx",
      consistency: "consistent",
    },
    {
      pair: "KpiCard",
      observed: "Optional decorative Lucide icon, aria-hidden, token-coloured by tone",
      source: "abox/kpi-card.tsx",
      consistency: "consistent",
    },
    {
      pair: "DataTable",
      observed: "No icon in the primitive; action icons arrive through Button in the cells",
      source: "abox/data-table.tsx",
      consistency: "consistent",
    },
    {
      pair: "EmptyState",
      observed: "48px square hairline frame around a 20px primary glyph, aria-hidden",
      source: "abox/empty-state.tsx",
      consistency: "consistent",
      note: "The only square icon frame; elsewhere the container is a circle.",
    },
    {
      pair: "PageHeader",
      observed: "Optional leading Lucide icon passed as a component prop",
      source: "abox/page-header.tsx",
      consistency: "consistent",
    },
    {
      pair: "Shells",
      observed:
        "AboxMark at 36px aria-hidden beside a readable wordmark; nav icons at 16px; ~104 circular icon containers product-wide",
      source: "the three shells",
      consistency: "mostly-consistent",
      note: "The circular icon container remains an UNOWNED AREA.",
    },
    {
      pair: "Product chips",
      observed:
        "products.ts maps each product key to an icon — HeartPulse, Tooth, Eye, Shield, Activity, Ambulance, BedDouble, Users",
      source: "src/lib/products.ts",
      consistency: "consistent",
      note: "Tooth is the single Tabler import; ICHRA uses Users everywhere by earlier decision.",
    },
  ],
};

export const COMPONENT_EXPERIENCE_SPLIT = [
  {
    experience: "Core shared",
    components:
      "StatusBadge, ACTION_PILL, Button, Logo, motion, EmptyState, PageHeader, the shell family",
    guidance:
      "These reach every experience. A change here propagates product-wide and requires application review.",
  },
  {
    experience: "Web / Marketing",
    components: "MarketplaceShell (landing mode), the decor primitives, hero composition",
    guidance:
      "The only consumer of the decorative SVG set. Brand presentation lives here; nothing else should import decor.",
  },
  {
    experience: "Shopping / Marketplace",
    components:
      "PlanCard, MetalBadge, CarrierMark, ProductSwitcher, ShoppingPathBar, QuoteEditPanel, OverflowText, SuspendedMarketplaceNotice",
    guidance:
      "Commerce components stay in this experience. Metal tiers and carrier marks must not be reused as generic display.",
  },
  {
    experience: "Dashboard / Admin",
    components:
      "InternalShell, DataTable, KpiCard, ModuleTabs, SaveContinueButton, DownlineWizardStepper, DownlineContextBanner, the M06/M08/Lucie kits",
    guidance:
      "The widest component vocabulary and all four duplicate kits. Prefer the shared ABox component over a module-local equivalent in new work.",
  },
  {
    experience: "Member portal",
    components: "MemberShell plus the shared display and action layer",
    guidance: "Consumes shared components only; it defines no components of its own.",
  },
  {
    experience: "Future experiences",
    components: "—",
    guidance:
      "Reserved governance slot. A new experience consumes the core system and documents contextual usage here rather than forking components.",
  },
];
