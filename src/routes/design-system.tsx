/**
 * Internal Design System reference — /design-system (unlisted).
 *
 * A live technical mirror of the implementation: every token value is read
 * from `src/styles.css` at runtime and every example renders the actual
 * production component. Nothing here is a demo copy, and nothing here is
 * linked from the application navigation.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Search,
  Plus,
  ArrowRight,
  Check,
  AlertTriangle,
  ShieldCheck,
  Users,
  Building2,
  ShoppingCart,
  Store,
  FileText,
  Settings,
  Bell,
  Eye,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { PageHeader } from "@/components/abox/page-header";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { MetalBadge } from "@/components/abox/metal-badge";
import { CarrierMark } from "@/components/abox/carrier-mark";
import { PlanCard } from "@/components/abox/plan-card";
import { EmptyState } from "@/components/abox/empty-state";
import { DataTable } from "@/components/abox/data-table";
import { AboxMark, AboxWordmark } from "@/components/abox/logo";
import { OverflowText } from "@/components/abox/overflow-text";
import { ACTION_PILL } from "@/components/abox/action-pill";

import { SAMPLE_PLANS, type SamplePlan } from "@/lib/sample-data";
import { SHOP_PRODUCTS } from "@/lib/products";
import {
  COLOR_GROUPS,
  METAL_TOKENS,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  SPACING_STEPS,
  TYPOGRAPHY_SPECIMENS,
} from "@/lib/design-tokens";
import {
  RefBlock,
  RefContainer,
  RefPage,
  RefSection,
  RefStage,
  RefToc,
  Swatch,
  SwatchGrid,
  useTokenValue,
  FoundationTable,
  RelationshipTable,
  InventoryTable,
  DefinitionRows,
  MaturityCallout,
  MetaChip,
  SpacingTable,
  ContainerTable,
  ResponsiveTable,
  DensityTable,
  DimensionTable,
  LayoutPatternList,
  RuleList,
  IconTable,
  AssetTable,
  ComponentTable,
  AnatomyList,
  VariantTable,
  ComponentStateTable,
  ArchLayerList,
  CanonicalMapTable,
  CriteriaTable,
  BlueprintTable,
  ArchRelationshipTable,
  OverlapList,
  KitTable,
  ShellTable,
  NamingTable,
  FigmaSectionTable,
  FigmaVariableTable,
  MigrationList,
  ExperienceArchTable,
} from "@/components/design/reference-kit";
import {
  COMPONENT_TAXONOMY,
  COMPONENT_GROUPS,
  CONSUMER_MAP,
  COMPONENT_ANATOMY,
  COMPOSITION_CLASSIFICATION,
  DUPLICATION_FINDINGS,
  UNUSED_FINDINGS,
  COMPONENT_MATURITY,
} from "@/lib/design/components";
import { COMPONENT_VARIANTS, COMPONENT_SIZES } from "@/lib/design/component-variants";
import {
  COMPONENT_STATES,
  COMPONENT_RESPONSIVE,
  COMPONENT_ACCESSIBILITY,
} from "@/lib/design/component-states";
import {
  COMPONENT_COMPOSITION,
  COMPONENT_TYPOGRAPHY_CROSSREF,
  COMPONENT_SPACING_CROSSREF,
  COMPONENT_ICON_CROSSREF,
  COMPONENT_EXPERIENCE_SPLIT,
} from "@/lib/design/component-relationships";
import { FOUNDATION } from "@/lib/design/foundation";
import { SPACING_RELATIONSHIPS, TYPOGRAPHY_RELATIONSHIPS } from "@/lib/design/relationships";
import { COMPONENT_INVENTORY, PATTERN_INVENTORY, STATE_INVENTORY } from "@/lib/design/inventory";
import { SPACING_GROUPS } from "@/lib/design/spacing";
import {
  CONTAINERS,
  DIMENSIONS,
  GRID_FLEX_RELATIONSHIPS,
  LAYOUT_PATTERNS,
} from "@/lib/design/layout";
import {
  DENSITY_MODES,
  RESPONSIVE_PATTERNS,
  STRUCTURAL_RELATIONSHIPS,
} from "@/lib/design/spatial-relationships";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  TYPE_SCALE,
  LINE_HEIGHT_AND_TRACKING,
  TYPOGRAPHY_UTILITIES,
  SEMANTIC_TYPOGRAPHY,
  NUMERIC_TYPOGRAPHY,
} from "@/lib/design/typography";
import {
  ICON_SOURCES,
  ICON_CATEGORIES,
  ICON_SIZES,
  ICON_TREATMENT,
} from "@/lib/design/iconography";
import {
  ICON_ACCESSIBILITY,
  ICON_STATES,
  ICON_RELATIONSHIPS,
  ICON_EXPERIENCES,
} from "@/lib/design/iconography-behavior";
import {
  BRAND_ASSETS,
  MEDIA_ASSETS,
  ASSET_ORGANIZATION,
  ASSET_BEHAVIOR,
  ASSET_UNUSED_FINDINGS,
  ASSET_OWNERSHIP,
  ICON_ASSET_MATURITY,
  ICON_ASSET_DEFERRED,
  FIGMA_ICON_ASSET_MAPPING,
} from "@/lib/design/assets";
import {
  RESPONSIVE_TYPOGRAPHY,
  TYPOGRAPHY_STATES,
  TEXT_BEHAVIOR,
  READABILITY_CONVENTIONS,
  COMPONENT_TYPOGRAPHY,
} from "@/lib/design/typography-behavior";
import {
  OWNERSHIP_HIERARCHY,
  SAFE_CHANGE_RULES,
  INTENTIONAL_ONE_OFFS,
  DEFERRED_OPPORTUNITIES,
  EXPERIENCES,
  FIGMA_MAPPING,
  FIGMA_LAYOUT_MAPPING,
  LAYOUT_GOVERNANCE_RULES,
  LAYOUT_DEFERRED_OPPORTUNITIES,
  LAYOUT_UNOWNED_AREAS,
  FIGMA_TYPOGRAPHY_MAPPING,
  TYPOGRAPHY_GOVERNANCE_RULES,
  TYPOGRAPHY_MATURITY,
  TYPOGRAPHY_UNOWNED_AREAS,
  TYPOGRAPHY_DEFERRED_OPPORTUNITIES,
  COMPONENT_GOVERNANCE_RULES,
  COMPONENT_UNOWNED_AREAS,
  COMPONENT_DEFERRED_OPPORTUNITIES,
  FIGMA_COMPONENT_MAPPING,
  FUTURE_FIGMA_ORGANIZATION,
} from "@/lib/design/governance";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "ABox Design System — Live Component Reference" },
      {
        name: "description",
        content:
          "Live technical reference for ABox design tokens, UI primitives and production components.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "ABox Design System — Live Component Reference" },
      {
        property: "og:description",
        content:
          "Live technical reference for ABox design tokens, UI primitives and production components.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignSystemPage,
});

const TOC = [
  { id: "tokens", label: "Tokens" },
  { id: "metal", label: "Metal tiers" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius & shadow" },
  { id: "icons", label: "Icons" },
  { id: "primitives", label: "UI primitives" },
  { id: "abox", label: "ABox components" },
  { id: "states", label: "States" },
  { id: "patterns", label: "Patterns" },
  { id: "foundation-audit", label: "Foundation audit" },
  { id: "spacing-relationships", label: "Spacing relationships" },
  { id: "type-relationships", label: "Type relationships" },
  { id: "component-inventory", label: "Component inventory" },
  { id: "state-inventory", label: "State inventory" },
  { id: "pattern-inventory", label: "Pattern inventory" },
  { id: "spacing-audit", label: "Spacing audit" },
  { id: "layout-containers", label: "Containers" },
  { id: "layout-structure", label: "Grid & structure" },
  { id: "responsive-audit", label: "Responsive" },
  { id: "density-audit", label: "Density" },
  { id: "dimensions-audit", label: "Dimensions" },
  { id: "layout-patterns", label: "Layout patterns" },
  { id: "governance", label: "Governance" },
  { id: "layout-governance", label: "Layout governance" },
  { id: "type-families", label: "Font families" },
  { id: "type-scale-audit", label: "Type scale" },
  { id: "type-utilities", label: "Type utilities" },
  { id: "type-semantic", label: "Semantic type" },
  { id: "type-responsive", label: "Responsive type" },
  { id: "type-components", label: "Component type" },
  { id: "type-states", label: "Type states" },
  { id: "type-data", label: "Numeric & data type" },
  { id: "type-readability", label: "Readability" },
  { id: "type-governance", label: "Type governance" },
  { id: "icon-sources", label: "Icon sources" },
  { id: "icon-inventory", label: "Icon inventory" },
  { id: "icon-sizes", label: "Icon sizes" },
  { id: "icon-treatment", label: "Icon treatment" },
  { id: "icon-a11y", label: "Icon accessibility" },
  { id: "icon-states", label: "Icon states" },
  { id: "icon-relationships", label: "Icon relationships" },
  { id: "brand-assets", label: "Logos & marks" },
  { id: "media-assets", label: "Imagery & media" },
  { id: "asset-organization", label: "Asset organization" },
  { id: "asset-behavior", label: "Asset behaviour" },
  { id: "icon-experiences", label: "Icon by experience" },
  { id: "asset-governance", label: "Asset governance" },
  { id: "experiences", label: "Experiences" },
  { id: "figma", label: "Figma mapping" },
  { id: "component-taxonomy", label: "Component taxonomy" },
  { id: "component-source-inventory", label: "Component inventory (full)" },
  { id: "component-consumers", label: "Consumer map" },
  { id: "component-experience", label: "Shared vs experience" },
  { id: "component-anatomy", label: "Anatomy" },
  { id: "component-variants", label: "Variants" },
  { id: "component-sizes", label: "Sizes" },
  { id: "component-state-audit", label: "Component states" },
  { id: "component-responsive", label: "Component responsive" },
  { id: "component-composition", label: "Composition relationships" },
  { id: "component-classification", label: "Composition vs component" },
  { id: "component-duplication", label: "Duplicates & overlap" },
  { id: "component-unused", label: "Installed but unused" },
  { id: "component-a11y", label: "Component accessibility" },
  { id: "component-crossref", label: "Type / space / icon cross-ref" },
  { id: "component-maturity", label: "Component maturity" },
  { id: "component-governance", label: "Component governance" },
  { id: "component-figma", label: "Figma components" },
  { id: "future-figma-library", label: "Future Figma library" },
];

function DesignSystemPage() {
  const plan = SAMPLE_PLANS[0] as SamplePlan;
  return (
    <RefPage>
      <RefContainer className="py-10 md:py-14">
        <header className="mb-10">
          <p className="text-eyebrow mb-3">Internal reference · not in navigation</p>
          <h1 className="text-display text-3xl md:text-4xl">ABox Design System</h1>
          <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
            The live implementation. Token values are read from the running stylesheet and every
            example below renders the same component the application ships. Source of truth:
            <span className="text-serial ml-1">src/styles.css</span>,
            <span className="text-serial ml-1">src/components/ui</span>,
            <span className="text-serial ml-1">src/components/abox</span>.
          </p>
        </header>

        <RefToc items={TOC} />

        <RefSection
          id="tokens"
          eyebrow="Layer 1"
          title="Design tokens"
          intro="All color decisions are CSS custom properties in src/styles.css, themed for light and dark. Components consume tokens, never literal colors."
        >
          {COLOR_GROUPS.map((group) => (
            <RefBlock key={group.id} title={group.title} note={group.intro}>
              <SwatchGrid>
                {group.tokens.map((t) => (
                  <Swatch
                    key={t.name}
                    name={t.name}
                    label={t.label}
                    usage={t.usage}
                    foreground={t.foreground}
                  />
                ))}
              </SwatchGrid>
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="metal"
          eyebrow="Layer 1"
          title="Metal tiers"
          intro="Plan tiers are solid, token-backed colors with a paired foreground so text contrast holds in both themes. The MetalBadge component is the only consumer."
        >
          <SwatchGrid>
            {METAL_TOKENS.map((t) => (
              <Swatch
                key={t.name}
                name={t.name}
                label={t.label}
                usage={t.usage}
                foreground={t.foreground}
              />
            ))}
          </SwatchGrid>
          <RefStage className="mt-6">
            {METAL_TOKENS.map((t) => (
              <MetalBadge key={t.name} tier={t.label as SamplePlan["metalTier"]} />
            ))}
          </RefStage>
        </RefSection>

        <RefSection
          id="typography"
          eyebrow="Layer 1"
          title="Typography"
          intro="Two families: Bricolage Grotesque for display and headings, Inter Tight for everything else. The text-display, text-eyebrow and text-serial utilities carry the specialised styles."
        >
          <div className="divide-y divide-hairline rounded-2xl border border-hairline bg-card">
            {TYPOGRAPHY_SPECIMENS.map((t) => (
              <div key={t.id} className="grid gap-2 p-5 md:grid-cols-[200px_1fr] md:items-baseline">
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.usage}</p>
                  <p className="text-serial mt-1">{t.className}</p>
                </div>
                <p className={t.className}>{t.sample}</p>
              </div>
            ))}
          </div>
        </RefSection>

        <RefSection
          id="spacing"
          eyebrow="Layer 1"
          title="Spacing"
          intro="A 4px base. These are the steps the application actually uses; anything outside the set is an exception, not a scale value."
        >
          <div className="space-y-2">
            {SPACING_STEPS.map((s) => (
              <div
                key={s.px}
                className="flex items-center gap-4 rounded-xl border border-hairline bg-card px-4 py-2.5"
              >
                <span className="w-16 text-sm font-medium tabular-nums">{s.px}px</span>
                <span className="w-16 text-xs text-muted-foreground tabular-nums">{s.rem}rem</span>
                <span
                  className="h-3 rounded-sm bg-primary"
                  style={{ width: `${s.px}px` }}
                  aria-hidden
                />
                <span className="text-xs text-muted-foreground">{s.usage}</span>
              </div>
            ))}
          </div>
        </RefSection>

        <RefSection
          id="radius"
          eyebrow="Layer 1"
          title="Radius & elevation"
          intro="Radius climbs with surface size. Shadows are cool navy-tinted and reserved for cards and overlays — no halos or glows on flat content."
        >
          <RefBlock title="Radius">
            <div className="flex flex-wrap gap-4">
              {RADIUS_TOKENS.map((r) => (
                <div key={r.name} className="w-40">
                  <div
                    className="flex h-20 items-center justify-center border border-hairline bg-surface"
                    style={{ borderRadius: `var(--${r.name})` }}
                  >
                    <RadiusValue name={r.name} />
                  </div>
                  <p className="mt-2 text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.usage}</p>
                </div>
              ))}
            </div>
          </RefBlock>
          <RefBlock title="Shadows">
            <div className="flex flex-wrap gap-6">
              {SHADOW_TOKENS.map((s) => (
                <div key={s.name} className="w-56">
                  <div
                    className="h-20 rounded-2xl border border-hairline bg-card"
                    style={{ boxShadow: `var(--${s.name})` }}
                  />
                  <p className="mt-3 text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.usage}</p>
                  <p className="text-serial mt-1">--{s.name}</p>
                </div>
              ))}
            </div>
          </RefBlock>
        </RefSection>

        <RefSection
          id="icons"
          eyebrow="Layer 1"
          title="Iconography"
          intro="Lucide is the icon library, at 16px inside controls and 20–24px for headers and feature tiles. Product icons come from the single catalogue in src/lib/products.ts; the dental symbol is Tabler's IconDental."
        >
          <RefBlock title="Sizes">
            <RefStage>
              {[14, 16, 20, 24, 28].map((s) => (
                <span key={s} className="flex flex-col items-center gap-1.5">
                  <ShieldCheck
                    style={{ width: s, height: s }}
                    className="text-primary"
                    aria-hidden
                  />
                  <span className="text-serial">{s}px</span>
                </span>
              ))}
            </RefStage>
          </RefBlock>
          <RefBlock
            title="Product icons"
            note="Single source: SHOP_PRODUCTS. Used by the landing hero chips, the product switcher and the shopping flows."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SHOP_PRODUCTS.map((p) => (
                <div
                  key={p.key}
                  className="flex items-center gap-3 rounded-xl border border-hairline bg-card p-3"
                >
                  <p.icon className="h-5 w-5 text-primary" aria-hidden />
                  <span className="text-sm font-medium">{p.label}</span>
                </div>
              ))}
            </div>
          </RefBlock>
          <RefBlock
            title="Interface icons"
            note="Navigation, status and action icons in common use."
          >
            <RefStage>
              {[
                Home,
                Search,
                Plus,
                ArrowRight,
                Check,
                AlertTriangle,
                ShieldCheck,
                Users,
                Building2,
                ShoppingCart,
                Store,
                FileText,
                Settings,
                Bell,
                Eye,
                Star,
              ].map((Icon, i) => (
                <Icon key={i} className="h-5 w-5 text-muted-foreground" aria-hidden />
              ))}
            </RefStage>
          </RefBlock>
        </RefSection>

        <RefSection
          id="primitives"
          eyebrow="Layer 2"
          title="UI primitives"
          intro="shadcn primitives in src/components/ui. These own focus, keyboard and disabled behaviour; ABox components compose them."
        >
          <RefBlock
            title="Button — variants"
            note="Button variants: default, secondary, outline, ghost, link, destructive."
          >
            <RefStage>
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </RefStage>
          </RefBlock>
          <RefBlock title="Button — sizes">
            <RefStage>
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Add">
                <Plus />
              </Button>
            </RefStage>
          </RefBlock>
          <RefBlock
            title="Action pill"
            note="The rounded action treatment used across routes, now owned by ACTION_PILL in src/components/abox/action-pill.ts."
          >
            <RefStage>
              <button type="button" className={ACTION_PILL.primaryMd}>
                Primary md
              </button>
              <button type="button" className={ACTION_PILL.primaryLg}>
                Primary lg
              </button>
              <button type="button" className={ACTION_PILL.primaryXs}>
                Primary xs
              </button>
              <button type="button" className={ACTION_PILL.outlineMd}>
                Outline md
              </button>
              <button type="button" className={ACTION_PILL.outlineLg}>
                Outline lg
              </button>
              <button type="button" className={ACTION_PILL.outlineSm}>
                Outline sm
              </button>
              <button type="button" className={ACTION_PILL.outlineSmCard}>
                Outline sm (card)
              </button>
              <button type="button" className={ACTION_PILL.outlineXs}>
                Outline xs
              </button>
            </RefStage>
          </RefBlock>
          <RefBlock title="Form controls">
            <div className="grid gap-5 rounded-2xl border border-hairline bg-card p-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ds-input">Text input</Label>
                <Input id="ds-input" placeholder="ZIP code" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-select">Select</Label>
                <Select>
                  <SelectTrigger id="ds-select">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="lowest">Lowest premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ds-textarea">Textarea</Label>
                <Textarea id="ds-textarea" placeholder="Notes for the agent" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="ds-check" />
                <Label htmlFor="ds-check">Checkbox</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="ds-switch" />
                <Label htmlFor="ds-switch">Switch</Label>
              </div>
            </div>
          </RefBlock>
          <RefBlock title="Tabs">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="readiness">Readiness</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-4 text-sm text-muted-foreground">
                Overview panel content.
              </TabsContent>
              <TabsContent value="readiness" className="pt-4 text-sm text-muted-foreground">
                Readiness panel content.
              </TabsContent>
              <TabsContent value="history" className="pt-4 text-sm text-muted-foreground">
                History panel content.
              </TabsContent>
            </Tabs>
          </RefBlock>
          <RefBlock title="Alert">
            <Alert>
              <AlertTriangle className="h-4 w-4" aria-hidden />
              <AlertTitle>Readiness incomplete</AlertTitle>
              <AlertDescription>
                Two controls still need evidence before this organization can transact.
              </AlertDescription>
            </Alert>
          </RefBlock>
          <RefBlock title="Overlays">
            <RefStage>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm handoff</DialogTitle>
                    <DialogDescription>
                      The selected plan and quote context are passed to the agent.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Filters</DrawerTitle>
                    <DrawerDescription>
                      The mobile filter pattern used on the plans page.
                    </DrawerDescription>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            </RefStage>
          </RefBlock>
        </RefSection>

        <RefSection
          id="abox"
          eyebrow="Layer 3"
          title="ABox components"
          intro="Business-aware components in src/components/abox. Each one is the single owner of its pattern — pages compose these rather than re-implementing them."
        >
          <RefBlock title="Brand mark — AboxMark">
            <RefStage>
              <AboxMark />
              <AboxMark tone="sage" />
              <AboxMark tone="foreground" />
              <AboxMark size={56} />
            </RefStage>
          </RefBlock>
          <RefBlock
            title="StatusBadge"
            note="Six semantic tones. Used for lifecycle, readiness, network type, exchange status and HSA eligibility."
          >
            <RefStage>
              <StatusBadge tone="sage">Ready</StatusBadge>
              <StatusBadge tone="primary">Off-exchange</StatusBadge>
              <StatusBadge tone="info">On-exchange</StatusBadge>
              <StatusBadge tone="warning">Needs review</StatusBadge>
              <StatusBadge tone="destructive">Blocked</StatusBadge>
              <StatusBadge tone="muted">HMO</StatusBadge>
            </RefStage>
          </RefBlock>
          <RefBlock
            title="CarrierMark"
            note="Deterministic illustrative monograms — not official carrier logos. Used in plan tiles and the cart."
          >
            <RefStage>
              {["Meridian Health", "BluePeak", "Sunstate Mutual", "Aries Care"].map((c) => (
                <span key={c} className="flex items-center gap-2">
                  <CarrierMark carrier={c} size={36} />
                  <span className="text-serial">{c}</span>
                </span>
              ))}
            </RefStage>
          </RefBlock>
          <RefBlock title="KpiCard">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Lifecycle" value="ACTIVE" icon={Building2} tone="sage" />
              <KpiCard label="Readiness" value="READY" icon={ShieldCheck} />
              <KpiCard label="Open issues" value={3} icon={AlertTriangle} tone="warning" />
              <KpiCard label="Downlines" value={12} icon={Users} tone="primary" />
            </div>
          </RefBlock>
          <RefBlock
            title="PageHeader"
            note="Default variant for marketplace and member flows; compact variant for dense result screens."
          >
            <div className="rounded-2xl border border-hairline bg-card p-6">
              <PageHeader
                eyebrow="Marketplace"
                title="Explore add-on coverage"
                description="Pair extra coverage with your medical plan."
                icon={Store}
              />
              <PageHeader
                variant="compact"
                title="Plan available"
                description="8 Plans Available · for 30301 · 2 Persons · effective 01/01/2027."
                icon={ShoppingCart}
              />
            </div>
          </RefBlock>
          <RefBlock
            title="PlanCard"
            note="The production plan tile in both layouts — horizontal for the results list, stacked for grids."
          >
            <div className="space-y-4">
              <PlanCard plan={plan} horizontal isBestMatch />
              <div className="max-w-md">
                <PlanCard plan={SAMPLE_PLANS[1] as SamplePlan} />
              </div>
            </div>
          </RefBlock>
          <RefBlock title="DataTable">
            <DataTable
              ariaLabel="Sample organizations"
              getRowId={(r) => r.code}
              columns={[
                {
                  key: "name",
                  header: "Organization",
                  cell: (r) => <OverflowText text={r.name} />,
                },
                {
                  key: "code",
                  header: "Reference",
                  cell: (r) => <span className="text-serial">{r.code}</span>,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (r) => <StatusBadge tone={r.tone}>{r.status}</StatusBadge>,
                },
              ]}
              rows={[
                {
                  name: "Cedar Grove Insurance",
                  code: "ORG-1001",
                  status: "Active",
                  tone: "sage" as const,
                },
                {
                  name: "Northwind Health Group",
                  code: "ORG-1002",
                  status: "Needs review",
                  tone: "warning" as const,
                },
              ]}
            />
          </RefBlock>
          <RefBlock title="EmptyState">
            <EmptyState
              icon={Search}
              title="No plans match these filters"
              body="Clear a filter or widen the metal tier selection to see more results."
            />
          </RefBlock>
        </RefSection>

        <RefSection
          id="states"
          eyebrow="Layer 3"
          title="Component states"
          intro="The states that exist in the implementation. Hover and focus are shown live — interact with the examples."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-medium">Interactive</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button className="hover:bg-primary/90">Hover me</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline">Focus me</Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Focus uses the shared ring token; disabled reduces opacity and blocks pointer
                events.
              </p>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-medium">Loading</p>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-medium">Validation</p>
              <div className="mt-4 space-y-2">
                <Input aria-invalid placeholder="Invalid input" />
                <p className="text-xs text-destructive">Postal code must be 5 digits.</p>
                <Input placeholder="Valid input" defaultValue="30301" />
                <p className="text-xs text-sage">Looks good.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-medium">Selection</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full ring-2 ring-primary ring-offset-2 ring-offset-card">
                  <MetalBadge tier="Silver" />
                </span>
                <MetalBadge tier="Gold" />
                <MetalBadge tier="Bronze" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Selected filters are announced with aria-pressed; the ring is used only where the
                pattern calls for it.
              </p>
            </div>
          </div>
        </RefSection>

        <RefSection
          id="patterns"
          eyebrow="Layer 4"
          title="Layout & page patterns"
          intro="Three shells frame the application. They are components, not per-page markup, so header, navigation and width behaviour stay identical everywhere."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "MarketplaceShell",
                body: "Consumer shopping surface. Full-width header, 88rem content container, product switcher and cart affordance.",
              },
              {
                title: "MemberShell",
                body: "Signed-in member area. Full-width header, left icon rail with connecting arc, 88rem content.",
              },
              {
                title: "InternalShell",
                body: "Internal workspaces. Navy sidebar rail from nav-config, workspace-scoped page title and actions.",
              },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-hairline bg-card p-5">
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-hairline bg-surface/60 p-5">
            <p className="text-eyebrow mb-3">Content width</p>
            <p className="text-sm text-muted-foreground">
              Web experience pages use a centred <span className="text-serial">max-w-[88rem]</span>{" "}
              container with
              <span className="text-serial ml-1">px-4 md:px-8</span>. Headers stay full width.
              Internal dashboards keep their own shell widths.
            </p>
          </div>
        </RefSection>

        <RefSection
          id="foundation-audit"
          eyebrow="Audit"
          title="Foundation inventory"
          intro="Every foundation category audited against the running implementation: what it is, where the source of truth lives, who consumes it, and whether it is a true shared token, a recurring convention or an intentional one-off. Values are recorded as measured — nothing here was normalized."
        >
          {FOUNDATION.map((cat) => (
            <RefBlock key={cat.id} title={cat.title} note={cat.summary}>
              <FoundationTable entries={cat.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="spacing-relationships"
          eyebrow="Audit"
          title="Spacing relationships"
          intro="Beyond the raw scale: the recurring spacing pairings the application actually uses, measured at real call sites. Where the implementation varies, the variation is recorded as found and left untouched."
        >
          {SPACING_RELATIONSHIPS.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.summary}>
              <RelationshipTable entries={g.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="type-relationships"
          eyebrow="Audit"
          title="Typography relationships"
          intro="Which size, weight and colour follows which, as implemented today."
        >
          {TYPOGRAPHY_RELATIONSHIPS.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.summary}>
              <RelationshipTable entries={g.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="component-inventory"
          eyebrow="Audit"
          title="Component inventory"
          intro="Consumer counts are import counts across src/routes and src/components, excluding each component's own folder and these reference pages. 'Available' means the primitive is installed and themed but no application screen imports it yet — a fact, not a defect."
        >
          {COMPONENT_INVENTORY.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.summary}>
              <InventoryTable entries={g.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="state-inventory"
          eyebrow="Audit"
          title="State inventory"
          intro="The interaction and feedback states that exist in the implementation, and where each one is defined."
        >
          <DefinitionRows
            rows={STATE_INVENTORY.map((s) => ({
              term: s.state,
              detail: "note" in s && s.note ? `${s.implementation} — ${s.note}` : s.implementation,
              meta: s.source,
            }))}
          />
        </RefSection>

        <RefSection
          id="pattern-inventory"
          eyebrow="Audit"
          title="Pattern inventory"
          intro="Repeated arrangements across the product. Some already have a component owner; others remain route-level conventions and are recorded as such."
        >
          {PATTERN_INVENTORY.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.summary}>
              <InventoryTable entries={g.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="spacing-audit"
          eyebrow="Phase 2 audit"
          title="Spacing foundation"
          intro="Measured from src/routes and src/components. The application has no spacing token in src/styles.css — spacing is expressed with Tailwind utilities at each call site, so these tables are the actual source of truth. Counts are approximate and describe scale."
        >
          {SPACING_GROUPS.map((group) => (
            <RefBlock key={group.id} title={group.title} note={group.summary}>
              <SpacingTable entries={group.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="layout-containers"
          eyebrow="Phase 2 audit"
          title="Layout foundation — containers"
          intro="Every recurring container behaviour as implemented. The web experience and the admin shell deliberately use different ceilings; both are preserved."
        >
          <ContainerTable entries={CONTAINERS} />
        </RefSection>

        <RefSection
          id="layout-structure"
          eyebrow="Phase 2 audit"
          title="Structural relationships, grid & flex"
          intro="Observed spacing between adjacent structural elements, and the grid and flex conventions that produce them. Consistency is reported as found and is not normalized."
        >
          <RefBlock title={STRUCTURAL_RELATIONSHIPS.title} note={STRUCTURAL_RELATIONSHIPS.summary}>
            <RelationshipTable entries={STRUCTURAL_RELATIONSHIPS.entries} />
          </RefBlock>
          <RefBlock title={GRID_FLEX_RELATIONSHIPS.title} note={GRID_FLEX_RELATIONSHIPS.summary}>
            <RelationshipTable entries={GRID_FLEX_RELATIONSHIPS.entries} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="responsive-audit"
          eyebrow="Phase 2 audit"
          title="Responsive foundation"
          intro="Breakpoint usage measured in the codebase: md carries 246 modifiers, sm 173, lg 87, xl 22 and 2xl 2. These are the real responsive relationships, not Tailwind's defaults listed generically."
        >
          <ResponsiveTable entries={RESPONSIVE_PATTERNS} />
        </RefSection>

        <RefSection
          id="density-audit"
          eyebrow="Phase 2 audit"
          title="Density"
          intro="Observed contextual density modes. These are descriptions of what ships, not tokens — no density token exists in the implementation."
        >
          <DensityTable entries={DENSITY_MODES} />
        </RefSection>

        <RefSection
          id="dimensions-audit"
          eyebrow="Phase 2 audit"
          title="Dimensional relationships"
          intro="Recurring dimensions that set layout quality, cross-referenced with the foundation audit's control-height and icon-size records."
        >
          <DimensionTable entries={DIMENSIONS} />
        </RefSection>

        <RefSection
          id="layout-patterns"
          eyebrow="Phase 2 audit"
          title="Layout patterns"
          intro="Structural patterns present in the application today. Nothing here is a new runtime pattern — each entry points at the code that already implements it."
        >
          <LayoutPatternList entries={LAYOUT_PATTERNS} />
        </RefSection>

        <RefSection
          id="governance"
          eyebrow="Governance"
          title="Ownership & safe change"
          intro="Which layer owns which decision, and the rules that keep a change from leaking into the shipped product unintentionally."
        >
          <RefBlock title="Ownership hierarchy">
            <DefinitionRows
              rows={OWNERSHIP_HIERARCHY.map((l) => ({
                term: l.layer,
                detail: `${l.owns}. ${l.changeRule}`,
                meta: l.source,
              }))}
            />
          </RefBlock>
          <RefBlock title="Safe centralization rules">
            <ul className="space-y-2 rounded-2xl border border-hairline bg-card p-5 text-sm text-muted-foreground">
              {SAFE_CHANGE_RULES.map((r) => (
                <li key={r} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </RefBlock>
          <RefBlock
            title="Intentional one-offs"
            note="Deliberate local decisions. They look like inconsistencies and must not be normalized."
          >
            <MaturityCallout kind="current" title="Leave these exactly as they are">
              <ul className="mt-2 space-y-2">
                {INTENTIONAL_ONE_OFFS.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <span className="text-serial">{o.source}</span>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
          <RefBlock
            title="Deferred opportunities"
            note="Identified during the audit and intentionally NOT applied, because each could change rendered output or behaviour."
          >
            <MaturityCallout
              kind="opportunity"
              title="Not implemented — candidates for a future phase"
            >
              <ul className="mt-2 space-y-2">
                {DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>

        <RefSection
          id="icon-sources"
          eyebrow="Phase 4 audit"
          title="Iconography sources"
          intro="Three icon packages are installed and one carries the product. Everything else visual is inline SVG authored in components so it can read design tokens."
        >
          <FoundationTable entries={ICON_SOURCES.entries} />
        </RefSection>

        <RefSection
          id="icon-inventory"
          eyebrow="Phase 4 audit"
          title="Icon inventory by semantic category"
          intro="149 distinct icons ship across 144 files. Representative records per category rather than every occurrence — exceptions and dual-purpose glyphs are kept visible rather than summarised away. Counts are import sites, not render counts."
        >
          {ICON_CATEGORIES.map((c) => (
            <RefBlock key={c.id} title={c.title} note={c.summary}>
              <IconTable entries={c.entries} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="icon-sizes"
          eyebrow="Phase 4 audit"
          title="Icon size audit"
          intro="h-4 w-4 accounts for 281 of the measured occurrences — more than four times the next size. Wrapper dimensions are recorded separately from glyph dimensions."
        >
          <SpacingTable entries={ICON_SIZES.entries} />
        </RefSection>

        <RefSection
          id="icon-treatment"
          eyebrow="Phase 4 audit"
          title="Stroke, fill & colour treatment"
          intro="The strongest convention in the product: stroke width is never overridden on an icon, and no icon carries a literal colour."
        >
          <FoundationTable entries={ICON_TREATMENT.entries} />
        </RefSection>

        <RefSection
          id="icon-a11y"
          eyebrow="Phase 4 audit"
          title="Interaction & accessibility"
          intro="aria-hidden appears 257 times across 99 files. Icon-only controls carry an aria-label (90) or an sr-only label (28); that labelling is applied per call site rather than enforced by a component."
        >
          <RelationshipTable entries={ICON_ACCESSIBILITY.entries} />
        </RefSection>

        <RefSection
          id="icon-states"
          eyebrow="Phase 4 audit"
          title="Icon states"
          intro="State is colour, and sometimes the wrapper. No icon changes size or stroke between states, and no glyph is swapped to express one."
        >
          <RelationshipTable entries={ICON_STATES.entries} />
        </RefSection>

        <RefSection
          id="icon-relationships"
          eyebrow="Phase 4 audit"
          title="Icon, mark & artwork relationships"
          intro="Measured pairings between an icon or mark and the element beside it."
        >
          <RelationshipTable entries={ICON_RELATIONSHIPS.entries} />
        </RefSection>

        <RefSection
          id="brand-assets"
          eyebrow="Phase 4 audit"
          title="Logos & brand marks"
          intro="Every mark is drawn in code from CSS variables. That is why the product needs no dark-mode logo file and why white-labelling re-themes the mark without a new asset."
        >
          <AssetTable entries={BRAND_ASSETS.entries} />
          <RefBlock
            title="Live marks"
            note="Rendered from the production components — the same code the application ships."
          >
            <RefStage>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <AboxMark />
                  <AboxWordmark />
                </div>
                <AboxMark tone="sage" />
                <AboxMark tone="foreground" />
                <CarrierMark carrier="Cedar Grove Health" />
                <CarrierMark carrier="Northwind Mutual" />
                <CarrierMark carrier="—" />
              </div>
            </RefStage>
          </RefBlock>
        </RefSection>

        <RefSection
          id="media-assets"
          eyebrow="Phase 4 audit"
          title="Imagery & media"
          intro="The defining finding of this phase: the product ships no imagery at all. No raster file, no committed SVG file, no img element, no assets directory. Visual identity is tokens, type, icons and code-drawn SVG."
        >
          <AssetTable entries={MEDIA_ASSETS.entries} />
        </RefSection>

        <RefSection
          id="asset-organization"
          eyebrow="Phase 4 audit"
          title="Asset naming & organization"
          intro="Assets are components, so naming follows React conventions rather than a file taxonomy. Variants are props, never filename suffixes."
        >
          <FoundationTable entries={ASSET_ORGANIZATION.entries} />
        </RefSection>

        <RefSection
          id="asset-behavior"
          eyebrow="Phase 4 audit"
          title="Asset behaviour & fallbacks"
          intro="Cropping and object-fit conventions do not exist because no bitmap renders. Scaling, layering and fallback behaviour do."
        >
          <RelationshipTable entries={ASSET_BEHAVIOR.entries} />
        </RefSection>

        <RefSection
          id="icon-experiences"
          eyebrow="Phase 4 audit"
          title="Iconography by experience"
          intro="One shared icon system. These records document context of use only — no experience has its own icon library, stroke convention or brand mark."
        >
          <DensityTable entries={ICON_EXPERIENCES} />
        </RefSection>

        <RefSection
          id="asset-governance"
          eyebrow="Phase 4 governance"
          title="Iconography & asset governance"
          intro="Ownership per asset category, maturity in descriptive terms, unused findings, the Figma blueprint, and the changes deliberately not made."
        >
          <RefBlock
            title="Ownership"
            note="Branding & White-Label and Marketplace Asset Management are existing runtime systems. The design system documents them; it never duplicates them."
          >
            <DefinitionRows
              rows={ASSET_OWNERSHIP.map((o) => ({
                term: o.category,
                detail: `Source of truth: ${o.sourceOfTruth}. Owner: ${o.owner}. Safe to change: ${o.safeToChange}. Needs review: ${o.needsReview}. Centralized: ${o.centralized}.`,
              }))}
            />
          </RefBlock>
          <RefBlock title="Maturity" note="Descriptive categories only — no scores, no rankings.">
            <DefinitionRows
              rows={ICON_ASSET_MATURITY.map((m) => ({
                term: m.item,
                detail: m.detail,
                meta: m.maturity,
              }))}
            />
          </RefBlock>
          <RefBlock
            title="Installed but unused, possibly unused & duplicates"
            note="Recorded from measurable evidence. Nothing was deleted or uninstalled."
          >
            <RuleList items={ASSET_UNUSED_FINDINGS} tone="warning" />
          </RefBlock>
          <RefBlock
            title="Figma icon & asset mapping"
            note="A mapping specification only. Nothing was converted and no Figma component was generated."
          >
            <DefinitionRows
              rows={FIGMA_ICON_ASSET_MAPPING.map((m) => ({
                term: m.implementation,
                detail: `→ ${m.figma}. ${m.note}`,
              }))}
            />
          </RefBlock>
          <RefBlock title="Deferred opportunities">
            <MaturityCallout
              kind="opportunity"
              title="Not applied — would change production code or rendered output"
            >
              <ul className="mt-2 space-y-2">
                {ICON_ASSET_DEFERRED.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>
        <RefSection
          id="experiences"
          eyebrow="Governance"
          title="Experience guidance"
          intro="One core system, three shipped experiences plus a slot for future ones. Experiences share every token and component; only context-specific usage differs."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {EXPERIENCES.map((e) => (
              <div key={e.id} className="rounded-2xl border border-hairline bg-card p-5">
                <p className="text-base font-semibold">{e.title}</p>
                <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <div>
                    <dt className="inline font-medium text-foreground">Surfaces: </dt>
                    <dd className="inline">{e.surfaces}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Container: </dt>
                    <dd className="inline">{e.container}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Density: </dt>
                    <dd className="inline">{e.density}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Shell: </dt>
                    <dd className="inline">{e.shellAndChrome}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">Components: </dt>
                    <dd className="inline">{e.typicalComponents}</dd>
                  </div>
                </dl>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {e.guidance.map((g) => (
                    <li key={g} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RefSection>

        <RefSection
          id="figma"
          eyebrow="Blueprint"
          title="Future Figma mapping"
          intro="How this implementation will map into a Figma library when that work begins. Blueprint only — no conversion has been performed and no Figma file exists yet."
        >
          <RefBlock
            title="Tokens, components and states"
            note="Established in the foundation phase."
          >
            <DefinitionRows
              rows={FIGMA_MAPPING.map((m) => ({
                term: m.implementation,
                detail: `→ ${m.figma}. ${m.note}`,
              }))}
            />
          </RefBlock>
          <RefBlock
            title="Spacing, layout and responsive behaviour"
            note="Added in Phase 2. Blueprint only — no Figma file, no conversion, and no runtime code was altered to make conversion easier later."
          >
            <DefinitionRows
              rows={FIGMA_LAYOUT_MAPPING.map((m) => ({
                term: m.implementation,
                detail: `→ ${m.figma}. ${m.note}`,
              }))}
            />
          </RefBlock>
        </RefSection>

        <RefSection
          id="layout-governance"
          eyebrow="Phase 2 governance"
          title="Spacing & layout governance"
          intro="Rules that keep the audit honest, the areas that still have no owner, and the opportunities that were deliberately not taken because they would have re-spaced shipping screens."
        >
          <RefBlock title="Governance rules">
            <RuleList items={LAYOUT_GOVERNANCE_RULES} />
          </RefBlock>
          <RefBlock
            title="Unowned recurring areas"
            note="Recurring spacing and layout that no component or token currently owns. Recorded, not centralized."
          >
            <RuleList items={LAYOUT_UNOWNED_AREAS} tone="warning" />
          </RefBlock>
          <RefBlock title="Deferred opportunities">
            <MaturityCallout kind="opportunity" title="Not applied — would change rendered output">
              <ul className="mt-2 space-y-2">
                {LAYOUT_DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>

        <RefSection
          id="type-families"
          eyebrow="Phase 3 audit"
          title="Font families & weights"
          intro="Two real families ship: Inter Tight for everything and Bricolage Grotesque for headings. The serif and mono tokens alias those stacks — there is no serif or monospace face in the product."
        >
          <RefBlock title="Families">
            <FoundationTable entries={FONT_FAMILIES} />
          </RefBlock>
          <RefBlock title="Weights">
            <FoundationTable entries={FONT_WEIGHTS} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="type-scale-audit"
          eyebrow="Phase 3 audit"
          title="Type scale as measured"
          intro="Every size that ships, with its occurrence count. text-sm (779 uses) is the real body size; text-base is used as a heading size, not for body copy. Sub-scale literals exist because Tailwind's scale stops at 12px."
        >
          <RefBlock title="Sizes">
            <SpacingTable entries={TYPE_SCALE} />
          </RefBlock>
          <RefBlock title="Line height & tracking">
            <FoundationTable entries={LINE_HEIGHT_AND_TRACKING} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="type-utilities"
          eyebrow="Phase 3 audit"
          title="Typography utilities"
          intro="The three shipping typography utilities, plus the link utilities. One of them — .story-link — is referenced 89 times and has no definition anywhere."
        >
          <FoundationTable entries={TYPOGRAPHY_UTILITIES} />
        </RefSection>

        <RefSection
          id="type-semantic"
          eyebrow="Phase 3 audit"
          title="Semantic typography hierarchy"
          intro="Each role as implemented. Where two surfaces use different values for the same role, that is recorded as an observed variation rather than resolved."
        >
          <RelationshipTable entries={SEMANTIC_TYPOGRAPHY.entries} />
        </RefSection>

        <RefSection
          id="type-responsive"
          eyebrow="Phase 3 audit"
          title="Responsive typography"
          intro="Body text never changes size across breakpoints. Only display, title, subtitle and the input primitive step — and the input deliberately runs larger on mobile to stop iOS zooming on focus."
        >
          <ResponsiveTable entries={RESPONSIVE_TYPOGRAPHY} />
        </RefSection>

        <RefSection
          id="type-components"
          eyebrow="Phase 3 audit"
          title="Component typography cross-reference"
          intro="Typography as applied by each shipping component, cross-referenced with the component inventory. Inventory only — no component was altered."
        >
          <RelationshipTable entries={COMPONENT_TYPOGRAPHY.entries} />
        </RefSection>

        <RefSection
          id="type-states"
          eyebrow="Phase 3 audit"
          title="Typography states & text behaviour"
          intro="State is carried by colour and opacity. Weight and size do not change between states anywhere in the application."
        >
          <RefBlock title={TYPOGRAPHY_STATES.title} note={TYPOGRAPHY_STATES.summary}>
            <RelationshipTable entries={TYPOGRAPHY_STATES.entries} />
          </RefBlock>
          <RefBlock title={TEXT_BEHAVIOR.title} note={TEXT_BEHAVIOR.summary}>
            <RelationshipTable entries={TEXT_BEHAVIOR.entries} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="type-data"
          eyebrow="Phase 3 audit"
          title="Numeric & data typography"
          intro="tabular-nums appears 90 times and is the only numeric alignment convention. Figures align through tabular figures in Inter Tight, not a monospace face."
        >
          <RelationshipTable entries={NUMERIC_TYPOGRAPHY.entries} />
        </RefSection>

        <RefSection
          id="type-readability"
          eyebrow="Phase 3 audit"
          title="Readability & accessibility conventions"
          intro="What the implementation already does for legibility, contrast, screen readers, touch and reduced motion."
        >
          <DensityTable entries={READABILITY_CONVENTIONS} />
        </RefSection>

        <RefSection
          id="type-governance"
          eyebrow="Phase 3 governance"
          title="Typography governance & maturity"
          intro="Rules, maturity of each role using the existing governance language, areas with no owner, the Figma text-style blueprint, and the changes deliberately not made."
        >
          <RefBlock title="Governance rules">
            <RuleList items={TYPOGRAPHY_GOVERNANCE_RULES} />
          </RefBlock>
          <RefBlock
            title="Maturity"
            note="Implementation maturity, not a judgement of design quality."
          >
            <DefinitionRows
              rows={TYPOGRAPHY_MATURITY.map((m) => ({
                term: m.item,
                detail: m.detail,
                meta: m.maturity,
              }))}
            />
          </RefBlock>
          <RefBlock
            title="Unowned typography areas"
            note="Recurring typography that no component or utility currently owns."
          >
            <RuleList items={TYPOGRAPHY_UNOWNED_AREAS} tone="warning" />
          </RefBlock>
          <RefBlock
            title="Figma text-style mapping"
            note="Blueprint only. Nothing has been converted and no runtime class was renamed."
          >
            <DefinitionRows
              rows={FIGMA_TYPOGRAPHY_MAPPING.map((m) => ({
                term: m.implementation,
                detail: `→ ${m.figma}. ${m.note}`,
              }))}
            />
          </RefBlock>
          <RefBlock title="Deferred opportunities">
            <MaturityCallout kind="opportunity" title="Not applied — would change rendered type">
              <ul className="mt-2 space-y-2">
                {TYPOGRAPHY_DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.item}>
                    <span className="font-medium text-foreground">{o.item}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>
        <RefSection
          id="component-taxonomy"
          eyebrow="Phase 5 audit"
          title="Component taxonomy"
          intro="Fifteen categories, one per component. Where the category is genuinely arguable the record says so rather than forcing a choice."
        >
          <FoundationTable entries={COMPONENT_TAXONOMY.entries} />
        </RefSection>

        <RefSection
          id="component-source-inventory"
          eyebrow="Phase 5 audit"
          title="Complete component source inventory"
          intro="Every reusable component discovered in the codebase: ABox business components, shadcn primitives, shells, the one icon component, the module kits and the reference-only layer. Consumer counts were measured by import path with each component's own folder and both reference pages excluded."
        >
          {COMPONENT_GROUPS.map((group) => (
            <RefBlock key={group.id} title={group.title} note={group.summary}>
              <ComponentTable entries={[...group.entries]} />
            </RefBlock>
          ))}
        </RefSection>

        <RefSection
          id="component-consumers"
          eyebrow="Phase 5 audit"
          title="Consumer map"
          intro="Direct means the file imports the component. Indirect means it renders through another component — a distinction that matters for motion, OverflowText and ToothIcon, whose direct counts understate their reach."
        >
          <RelationshipTable entries={CONSUMER_MAP.entries} />
        </RefSection>

        <RefSection
          id="component-experience"
          eyebrow="Phase 5 audit"
          title="Shared vs experience-specific"
          intro="Derived from actual consumers, not from naming. One core system; the experience sections below are contextual usage guidance only."
        >
          <DefinitionRows
            rows={COMPONENT_EXPERIENCE_SPLIT.map((e) => ({
              term: e.experience,
              detail: e.guidance,
              meta: e.components,
            }))}
          />
        </RefSection>

        <RefSection
          id="component-anatomy"
          eyebrow="Phase 5 audit"
          title="Component anatomy"
          intro="The parts that actually exist, in render order. Missing parts — a table toolbar, a pagination row, a loading part on Button — are recorded as absent rather than invented."
        >
          <AnatomyList entries={COMPONENT_ANATOMY} />
        </RefSection>

        <RefSection
          id="component-variants"
          eyebrow="Phase 5 audit"
          title="Variant inventory"
          intro="Variant names are recorded exactly as written in code. Nothing was renamed, normalized or consolidated."
        >
          <VariantTable entries={[...COMPONENT_VARIANTS]} />
        </RefSection>

        <RefSection
          id="component-sizes"
          eyebrow="Phase 5 audit"
          title="Size inventory"
          intro="Actual control heights, padding, gaps and icon dimensions. Cross-references the Phase 2 spacing ladder and the Phase 4 icon sizes."
        >
          <DimensionTable entries={[...COMPONENT_SIZES]} />
        </RefSection>

        <RefSection
          id="component-state-audit"
          eyebrow="Phase 5 audit"
          title="Component state inventory"
          intro="Only the states that exist today. No missing state was added, and gaps are recorded as future opportunities."
        >
          <ComponentStateTable entries={[...COMPONENT_STATES]} />
        </RefSection>

        <RefSection
          id="component-responsive"
          eyebrow="Phase 5 audit"
          title="Responsive component behaviour"
          intro="Measured behaviour only. Cross-references the Phase 2 responsive audit; no breakpoint was changed."
        >
          <RelationshipTable entries={COMPONENT_RESPONSIVE.entries} />
        </RefSection>

        <RefSection
          id="component-composition"
          eyebrow="Phase 5 audit"
          title="Component relationships"
          intro="Recurring parent to child relationships, each marked shared, experience-specific, or repeated without an owning component."
        >
          <RelationshipTable entries={COMPONENT_COMPOSITION.entries} />
        </RefSection>

        <RefSection
          id="component-classification"
          eyebrow="Phase 5 audit"
          title="Composition vs component"
          intro="Not everything reusable should become a Figma component, and not everything repeated should become a production component. This classification is the input to that decision."
        >
          <RelationshipTable entries={COMPOSITION_CLASSIFICATION.entries} />
        </RefSection>

        <RefSection
          id="component-duplication"
          eyebrow="Phase 5 audit"
          title="Duplication and overlap findings"
          intro="Recorded only. No component was consolidated, renamed or removed, and no winner was chosen."
        >
          <RuleList items={DUPLICATION_FINDINGS} tone="warning" />
        </RefSection>

        <RefSection
          id="component-unused"
          eyebrow="Phase 5 audit"
          title="Installed but unused"
          intro="Components, variants and states that exist and have no located consumer. Confidence is stated per finding; nothing was deleted or uninstalled."
        >
          <RuleList items={UNUSED_FINDINGS} tone="warning" />
        </RefSection>

        <RefSection
          id="component-a11y"
          eyebrow="Phase 5 audit"
          title="Component accessibility inventory"
          intro="What the components actually do. Cross-references the Phase 4 icon accessibility findings; nothing was repaired in this phase."
        >
          <RelationshipTable entries={COMPONENT_ACCESSIBILITY.entries} />
        </RefSection>

        <RefSection
          id="component-crossref"
          eyebrow="Phase 5 audit"
          title="Typography, spacing and iconography cross-reference"
          intro="How representative components consume the Phase 2, 3 and 4 findings. Values are recorded as implemented."
        >
          <RefBlock title="Typography" note="Cross-reference to the Phase 3 type audit.">
            <RelationshipTable entries={COMPONENT_TYPOGRAPHY_CROSSREF.entries} />
          </RefBlock>
          <RefBlock title="Spacing" note="Cross-reference to the Phase 2 spacing audit.">
            <RelationshipTable entries={COMPONENT_SPACING_CROSSREF.entries} />
          </RefBlock>
          <RefBlock title="Iconography" note="Cross-reference to the Phase 4 icon audit.">
            <RelationshipTable entries={COMPONENT_ICON_CROSSREF.entries} />
          </RefBlock>
        </RefSection>

        <RefSection
          id="component-maturity"
          eyebrow="Phase 5 audit"
          title="Component maturity"
          intro="Descriptive categories only — no scores, rankings or overall grades."
        >
          <DefinitionRows
            rows={COMPONENT_MATURITY.map((m) => ({
              term: m.area,
              detail: m.detail,
              meta: m.state,
            }))}
          />
        </RefSection>

        <RefSection
          id="component-governance"
          eyebrow="Phase 5 audit"
          title="Component governance"
          intro="Rules that describe how the component layer is kept coherent. Documentation, not a runtime mechanism."
        >
          <RefBlock title="Governance rules">
            <RuleList items={COMPONENT_GOVERNANCE_RULES} />
          </RefBlock>
          <RefBlock title="Unowned areas">
            <RuleList items={COMPONENT_UNOWNED_AREAS} tone="warning" />
          </RefBlock>
          <RefBlock title="Deferred opportunities">
            <MaturityCallout
              kind="opportunity"
              title="Not applied — every item would change rendered screens"
            >
              <ul className="mt-2 space-y-2">
                {COMPONENT_DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.title}>
                    <span className="font-medium text-foreground">{o.title}</span> — {o.detail}{" "}
                    <MetaChip tone="warning">{o.risk}</MetaChip>
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
        </RefSection>

        <RefSection
          id="component-figma"
          eyebrow="Phase 5 audit"
          title="Figma component mapping"
          intro="A mapping specification only. Nothing has been converted, no Figma component exists, and no DOM-to-Figma conversion is implied."
        >
          <DefinitionRows
            rows={FIGMA_COMPONENT_MAPPING.map((m) => ({
              term: m.production,
              detail: `→ ${m.figma}. ${m.note}`,
            }))}
          />
        </RefSection>

        <RefSection
          id="future-figma-library"
          eyebrow="Future Figma organization"
          title="Core component library blueprint"
          intro="A proposed organization for a future Figma library, derived strictly from the discovered production inventory. This hierarchy does not exist in production today."
        >
          <MaturityCallout kind="opportunity" title="Future Figma organization — not yet built">
            <p>
              One core library plus contextual experience guidance. No experience gets its own
              competing system.
            </p>
          </MaturityCallout>
          <DefinitionRows
            rows={FUTURE_FIGMA_ORGANIZATION.map((f) => ({ term: f.level, detail: f.detail }))}
          />
        </RefSection>
      </RefContainer>
    </RefPage>
  );
}

function RadiusValue({ name }: { name: string }) {
  const value = useTokenValue(name);
  return <span className="text-serial">{value || name}</span>;
}
