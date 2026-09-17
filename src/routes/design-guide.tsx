/**
 * Management-facing Design Guide — /design-guide (unlisted).
 *
 * A presentation-ready explanation of the ABox design language for
 * leadership and stakeholders. It documents; it does not configure. Runtime
 * branding and white-label settings remain owned by the existing Branding
 * screens — nothing here duplicates or replaces them.
 *
 * Every swatch reads a live token and every component example is the real
 * production component, so the guide stays true to the shipped product.
 */
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Compass,
  ShoppingCart,
  Users,
  AlertTriangle,
  Building2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { AboxMark } from "@/components/abox/logo";
import { PlanCard } from "@/components/abox/plan-card";
import { MetalBadge } from "@/components/abox/metal-badge";
import { StatusBadge } from "@/components/abox/status-badge";
import { KpiCard } from "@/components/abox/kpi-card";
import { CarrierMark } from "@/components/abox/carrier-mark";
import { EmptyState } from "@/components/abox/empty-state";
import { PageHeader } from "@/components/abox/page-header";
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
  DefinitionRows,
  MaturityCallout,
  RuleList,
} from "@/components/design/reference-kit";
import {
  OWNERSHIP_HIERARCHY,
  SAFE_CHANGE_RULES,
  INTENTIONAL_ONE_OFFS,
  DEFERRED_OPPORTUNITIES,
  EXPERIENCES,
  FIGMA_MAPPING,
  FIGMA_LAYOUT_MAPPING,
  LAYOUT_GOVERNANCE_RULES,
  LAYOUT_UNOWNED_AREAS,
  FIGMA_TYPOGRAPHY_MAPPING,
  TYPOGRAPHY_GOVERNANCE_RULES,
  TYPOGRAPHY_UNOWNED_AREAS,
  COMPONENT_GOVERNANCE_RULES,
  COMPONENT_UNOWNED_AREAS,
  COMPONENT_DEFERRED_OPPORTUNITIES,
  FUTURE_FIGMA_ORGANIZATION,
} from "@/lib/design/governance";
import {
  ASSET_OWNERSHIP,
  ASSET_UNUSED_FINDINGS,
  FIGMA_ICON_ASSET_MAPPING,
} from "@/lib/design/assets";
import { COMPONENT_EXPERIENCE_SPLIT } from "@/lib/design/component-relationships";


export const Route = createFileRoute("/design-guide")({
  head: () => ({
    meta: [
      { title: "ABox Design Guide — Brand & Visual System" },
      {
        name: "description",
        content:
          "Management-facing guide to the ABox brand, color, typography, components and layout patterns.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "ABox Design Guide — Brand & Visual System" },
      {
        property: "og:description",
        content:
          "Management-facing guide to the ABox brand, color, typography, components and layout patterns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignGuidePage,
});

const TOC = [
  { id: "overview", label: "Brand overview" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "tokens", label: "Design tokens" },
  { id: "components", label: "Components" },
  { id: "states", label: "States" },
  { id: "products", label: "Products & plans" },
  { id: "layouts", label: "Layout & navigation" },
  { id: "icons", label: "Iconography" },
  { id: "patterns", label: "UI patterns" },
  { id: "governance", label: "Governance" },
  { id: "accessibility", label: "Accessibility" },
  { id: "experiences", label: "Experiences" },
  { id: "spacing-layout", label: "Spacing & layout" },
  { id: "typography-governance", label: "Typography" },
  { id: "icon-asset-governance", label: "Icons & assets" },
  { id: "component-governance", label: "Components" },
  { id: "figma", label: "Figma mapping" },
];

const PRINCIPLES = [
  {
    icon: Compass,
    title: "A guide, not a sales engine",
    body: "The interface explains the decision. Recommendations are shown with their reasoning, never as pressure.",
  },
  {
    icon: Layers,
    title: "Structure over decoration",
    body: "Hairlines, spacing and type carry hierarchy. Shadows are reserved for cards and overlays.",
  },
  {
    icon: Sparkles,
    title: "Color is meaning",
    body: "Navy is action. Amber is attention. Red is blocked. Green is verified. A calm screen shows one accent at most.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance is visible",
    body: "Status, eligibility and what is blocking an action are always stated in plain language, never hidden.",
  },
];

function DesignGuidePage() {
  const plan = SAMPLE_PLANS[0] as SamplePlan;
  return (
    <RefPage>
      <RefContainer className="py-10 md:py-16">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-6 border-b border-hairline pb-10">
          <div className="max-w-3xl">
            <p className="text-eyebrow mb-3">Brand & design guidelines</p>
            <h1 className="text-display text-3xl md:text-4xl">The ABox visual system</h1>
            <p className="mt-4 text-sm text-muted-foreground md:text-base">
              Meridian Navy — a premium enterprise system built for insurance decisions. This guide
              shows the live brand as it exists in the product today. Every color, typeface and
              component on this page is rendered from the application itself, so the guide can never
              drift from what customers see.
            </p>
          </div>
          <AboxMark size={72} />
        </header>

        <RefToc items={TOC} />

        <RefSection
          id="overview"
          eyebrow="01"
          title="Brand overview"
          intro="One system, two expressions: a calm instrument panel for internal work, and a confident retail surface for shoppers."
        >
          <RefBlock
            title="Logo usage"
            note="The ABox mark is a circular orbital badge. It appears in four tones so it holds on white canvas, sage surfaces, the navy sidebar and inverted plates. Do not recolor, stretch or add effects."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  { tone: "primary", label: "On light canvas", bg: "bg-background" },
                  { tone: "sage", label: "Sage accent", bg: "bg-surface" },
                  { tone: "sidebar", label: "Navy rail", bg: "bg-sidebar" },
                  { tone: "foreground", label: "Inverted", bg: "bg-panel" },
                ] as const
              ).map((t) => (
                <div
                  key={t.tone}
                  className={`flex flex-col items-center gap-3 rounded-2xl border border-hairline p-6 ${t.bg}`}
                >
                  <AboxMark tone={t.tone} size={48} />
                  <span className="text-xs text-muted-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </RefBlock>
          <RefBlock title="Visual principles">
            <div className="grid gap-4 md:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="rounded-2xl border border-hairline bg-card p-5">
                  <p.icon className="h-5 w-5 text-primary" aria-hidden />
                  <p className="mt-3 text-base font-semibold">{p.title}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
                </div>
              ))}
            </div>
          </RefBlock>
        </RefSection>

        <RefSection
          id="colors"
          eyebrow="02"
          title="Brand colors"
          intro="A white canvas, cool grey surfaces and a deep navy primary, with a muted teal accent. Semantic colors carry one meaning each and are never used decoratively."
        >
          {COLOR_GROUPS.map((g) => (
            <RefBlock key={g.id} title={g.title} note={g.intro}>
              <SwatchGrid>
                {g.tokens.map((t) => (
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
          id="typography"
          eyebrow="03"
          title="Typography"
          intro="Bricolage Grotesque sets display and headings; Inter Tight carries body, labels and data. Numbers are tabular so premiums and totals align in columns."
        >
          <div className="divide-y divide-hairline rounded-2xl border border-hairline bg-card">
            {TYPOGRAPHY_SPECIMENS.map((t) => (
              <div key={t.id} className="grid gap-2 p-5 md:grid-cols-[220px_1fr] md:items-baseline">
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.usage}</p>
                </div>
                <p className={t.className}>{t.sample}</p>
              </div>
            ))}
          </div>
        </RefSection>

        <RefSection
          id="tokens"
          eyebrow="04"
          title="Design tokens"
          intro="A token is a named design decision — 'primary action color', 'card corner radius'. Screens reference the name, never the raw value, so one change updates the whole product at once."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Spacing</p>
              <p className="mt-1 text-xs text-muted-foreground">
                A 4px rhythm keeps every screen aligned.
              </p>
              <div className="mt-4 space-y-2">
                {SPACING_STEPS.map((s) => (
                  <div key={s.px} className="flex items-center gap-3">
                    <span className="w-12 text-xs tabular-nums text-muted-foreground">
                      {s.px}px
                    </span>
                    <span
                      className="h-2.5 rounded-sm bg-primary"
                      style={{ width: `${s.px}px` }}
                      aria-hidden
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Corner radius</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Softness grows with the size of the surface.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {RADIUS_TOKENS.map((r) => (
                  <div
                    key={r.name}
                    className="flex h-14 w-20 items-center justify-center border border-hairline bg-surface text-xs text-muted-foreground"
                    style={{ borderRadius: `var(--${r.name})` }}
                  >
                    {r.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Elevation</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Shadows are cool and restrained — used for cards and overlays only.
              </p>
              <div className="mt-4 space-y-3">
                {SHADOW_TOKENS.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-xl border border-hairline bg-card px-4 py-3 text-xs"
                    style={{ boxShadow: `var(--${s.name})` }}
                  >
                    <span className="font-medium">{s.label}</span>
                    <span className="text-muted-foreground">{s.usage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RefSection>

        <RefSection
          id="components"
          eyebrow="05"
          title="Components"
          intro="Every example below is the live production component. If one of these changes in the product, this page changes with it."
        >
          <RefBlock title="Buttons">
            <RefStage>
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <button type="button" className={ACTION_PILL.primaryMd}>
                Action pill
              </button>
              <button type="button" className={ACTION_PILL.outlineMd}>
                Secondary pill
              </button>
            </RefStage>
          </RefBlock>
          <RefBlock
            title="Status indicators"
            note="Status is always stated in words with a color, never color alone."
          >
            <RefStage>
              <StatusBadge tone="sage">Ready</StatusBadge>
              <StatusBadge tone="warning">Needs review</StatusBadge>
              <StatusBadge tone="destructive">Blocked</StatusBadge>
              <StatusBadge tone="info">On-exchange</StatusBadge>
              <StatusBadge tone="primary">Off-exchange</StatusBadge>
              <StatusBadge tone="muted">PPO</StatusBadge>
            </RefStage>
          </RefBlock>
          <RefBlock title="Metric cards">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Active organizations" value={12} icon={Building2} tone="primary" />
              <KpiCard label="Readiness" value="READY" icon={ShieldCheck} tone="sage" />
              <KpiCard label="Open issues" value={3} icon={AlertTriangle} tone="warning" />
              <KpiCard label="Members served" value="1,284" icon={Users} />
            </div>
          </RefBlock>
          <RefBlock title="Inputs and selection">
            <div className="grid gap-5 rounded-2xl border border-hairline bg-card p-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dg-zip">ZIP code</Label>
                <Input id="dg-zip" defaultValue="30301" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dg-sort">Sort by</Label>
                <Select>
                  <SelectTrigger id="dg-sort">
                    <SelectValue placeholder="Recommended" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="premium">Lowest premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Tabs defaultValue="plans">
                  <TabsList>
                    <TabsTrigger value="plans">Plans</TabsTrigger>
                    <TabsTrigger value="addons">Add-ons</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </RefBlock>
          <RefBlock title="Page headers">
            <div className="rounded-2xl border border-hairline bg-card p-6">
              <PageHeader
                eyebrow="Marketplace"
                title="Your selection"
                description="Review the plan before handing it to an agent."
                icon={ShoppingCart}
              />
            </div>
          </RefBlock>
        </RefSection>

        <RefSection
          id="states"
          eyebrow="06"
          title="Component states"
          intro="Only the states the product actually uses: default, hover, focus, selected, disabled, loading, error and success."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Actions</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="outline">Hover / focus</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Loading</p>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Error</p>
              <div className="mt-4 space-y-2">
                <Input aria-invalid defaultValue="303" />
                <p className="text-xs text-destructive">Enter a valid 5-digit ZIP code.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Success & selection</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <StatusBadge tone="sage">Verified</StatusBadge>
                <span className="rounded-full ring-2 ring-primary ring-offset-2 ring-offset-card">
                  <MetalBadge tier="Gold" />
                </span>
              </div>
            </div>
          </div>
        </RefSection>

        <RefSection
          id="products"
          eyebrow="07"
          title="Products & plan patterns"
          intro="The shopping surface. Plan tiles put carrier identity, tier, network and price in a fixed order so plans stay comparable at a glance."
        >
          <RefBlock
            title="Product catalogue"
            note="One catalogue drives the landing hero, the product switcher and every shopping screen."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SHOP_PRODUCTS.map((p) => (
                <div key={p.key} className="rounded-2xl border border-hairline bg-card p-4">
                  <p.icon className="h-5 w-5 text-primary" aria-hidden />
                  <p className="mt-3 text-sm font-semibold">{p.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
                </div>
              ))}
            </div>
          </RefBlock>
          <RefBlock
            title="Metal tiers"
            note="Six tiers, each with its own solid color and a paired text color for contrast in light and dark themes."
          >
            <RefStage>
              {METAL_TOKENS.map((t) => (
                <MetalBadge key={t.name} tier={t.label as SamplePlan["metalTier"]} />
              ))}
            </RefStage>
          </RefBlock>
          <RefBlock
            title="Plan tile"
            note="Pricing is presented as a single monthly figure with the estimate basis stated beneath it."
          >
            <PlanCard plan={plan} horizontal isBestMatch />
          </RefBlock>
          <RefBlock
            title="Carrier identity"
            note="Illustrative carrier marks, generated consistently from the carrier name. These are placeholders, not official logos."
          >
            <RefStage>
              {["Meridian Health", "BluePeak", "Sunstate Mutual", "Aries Care"].map((c) => (
                <span key={c} className="flex items-center gap-2">
                  <CarrierMark carrier={c} size={36} />
                  <span className="text-sm">{c}</span>
                </span>
              ))}
            </RefStage>
          </RefBlock>
        </RefSection>

        <RefSection
          id="layouts"
          eyebrow="08"
          title="Layout & navigation"
          intro="Three shells frame every screen. Each owns its header, navigation and content width, so pages never reinvent the frame."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Marketplace",
                body: "Shopper-facing. Full-width header with products and cart, centred content, progress kept across the shopping flow.",
              },
              {
                title: "Member",
                body: "Signed-in area. Full-width header with the member's name, left icon rail for dashboard, quotes, cart, messages and settings.",
              },
              {
                title: "Internal / admin",
                body: "Agency, marketplace and platform workspaces. Navy navigation rail grouped by module, page title and actions in a consistent header.",
              },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-hairline bg-card p-5">
                <p className="text-base font-semibold">{s.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Shopper-facing pages share one centred content width and generous side breathing room;
            headers always span the full screen. Layouts reflow to a single column on tablets and
            phones without hiding information.
          </p>
        </RefSection>

        <RefSection
          id="icons"
          eyebrow="09"
          title="Iconography"
          intro="A single line-icon family at consistent weights. Icons support the label; they never replace it."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Sizes in use</p>
              <div className="mt-4 flex items-end gap-6">
                {[16, 20, 24].map((s) => (
                  <span key={s} className="flex flex-col items-center gap-2">
                    <ShieldCheck
                      style={{ width: s, height: s }}
                      className="text-primary"
                      aria-hidden
                    />
                    <span className="text-xs text-muted-foreground">{s}px</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Product icons</p>
              <div className="mt-4 flex flex-wrap gap-4">
                {SHOP_PRODUCTS.map((p) => (
                  <p.icon key={p.key} className="h-5 w-5 text-primary" aria-hidden />
                ))}
              </div>
            </div>
          </div>
        </RefSection>

        <RefSection
          id="patterns"
          eyebrow="10"
          title="Recurring UI patterns"
          intro="Patterns that appear across the product and behave the same way everywhere."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Filters",
                body: "Filter chips reuse the same badges shown on the results, so a filter always looks like the thing it filters.",
              },
              {
                title: "Search",
                body: "A single input with an icon; results update in place rather than on a new screen.",
              },
              {
                title: "Tables",
                body: "Hairline rows, no zebra striping, identifiers in the serial style, status as a badge.",
              },
              {
                title: "Forms",
                body: "Label above control, helper text beneath, inline validation messages in the destructive color.",
              },
              {
                title: "Dialogs & drawers",
                body: "Dialogs confirm a decision; drawers hold filters and detail on smaller screens.",
              },
              {
                title: "Responsive",
                body: "Multi-column layouts collapse to one column; touch targets grow on small screens.",
              },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl border border-hairline bg-card p-5">
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <EmptyState
              icon={Search}
              title="No results"
              body="Empty states explain what happened and offer the next step."
            />
            <div className="rounded-2xl border border-hairline bg-card p-5">
              <p className="text-sm font-semibold">Loading</p>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>
        </RefSection>

        <RefSection
          id="governance"
          eyebrow="11"
          title="How the system is governed"
          intro="The design system is owned in layers. A decision lives in exactly one place, and everything below it inherits that decision."
        >
          <RefBlock
            title="Who owns what"
            note="Reading top to bottom: the higher the layer, the wider the blast radius of a change."
          >
            <DefinitionRows
              rows={OWNERSHIP_HIERARCHY.map((l) => ({
                term: l.layer,
                detail: `${l.owns}. ${l.changeRule}`,
              }))}
            />
          </RefBlock>
          <RefBlock title="How a change propagates">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Change a token",
                  body: "Update one value in the style foundation and every screen, both light and dark, follows immediately.",
                },
                {
                  title: "Change a component",
                  body: "Update the single owning component and every page that uses it updates — this is a product change and needs product review.",
                },
                {
                  title: "Change one screen",
                  body: "Stays local to that screen. Safe, but it is how drift starts: prefer adding a variant to the shared component.",
                },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-hairline bg-card p-5">
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                </div>
              ))}
            </div>
          </RefBlock>
          <RefBlock title="Shared versus deliberately local">
            <div className="grid gap-4 lg:grid-cols-2">
              <MaturityCallout kind="current" title="Deliberately local — do not 'fix' these">
                <ul className="mt-2 space-y-2">
                  {INTENTIONAL_ONE_OFFS.slice(0, 5).map((o) => (
                    <li key={o.item}>
                      <span className="font-medium text-foreground">{o.item}</span> — {o.detail}
                    </li>
                  ))}
                </ul>
              </MaturityCallout>
              <MaturityCallout kind="opportunity" title="Identified, intentionally not done yet">
                <ul className="mt-2 space-y-2">
                  {DEFERRED_OPPORTUNITIES.slice(0, 5).map((o) => (
                    <li key={o.item}>
                      <span className="font-medium text-foreground">{o.item}</span> — {o.detail}
                    </li>
                  ))}
                </ul>
              </MaturityCallout>
            </div>
          </RefBlock>
          <RefBlock title="Working rules">
            <ul className="space-y-2 rounded-2xl border border-hairline bg-card p-5 text-sm text-muted-foreground">
              {SAFE_CHANGE_RULES.map((r) => (
                <li key={r} className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </RefBlock>
        </RefSection>

        <RefSection
          id="accessibility"
          eyebrow="12"
          title="Accessibility principles"
          intro="Accessibility is built into the foundation rather than added per screen."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Contrast by pairing",
                body: "Every surface and status colour ships with a matching text colour. Dark backgrounds take light text; light backgrounds take dark text.",
              },
              {
                title: "Never colour alone",
                body: "Status is always stated in words alongside its colour, so meaning survives colour blindness and greyscale printing.",
              },
              {
                title: "Visible focus",
                body: "Keyboard focus draws a ring from the shared focus colour on every interactive element.",
              },
              {
                title: "Touch targets",
                body: "On phones, every button and link is at least 44px tall.",
              },
              {
                title: "Reduced motion",
                body: "If the operating system asks for less motion, every animation and transition switches off.",
              },
              {
                title: "Skip to content",
                body: "Each shell starts with a skip link that appears on keyboard focus.",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-hairline bg-card p-5">
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </RefSection>

        <RefSection
          id="experiences"
          eyebrow="13"
          title="Experience guidance"
          intro="One core design system and one master guide. Each experience gets guidance on context — never its own colours, fonts or component copies."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {EXPERIENCES.map((e) => (
              <div key={e.id} className="rounded-2xl border border-hairline bg-card p-5">
                <p className="text-base font-semibold">{e.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{e.surfaces}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Feel: </span>
                  {e.density}
                </p>
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
          id="spacing-layout"
          eyebrow="14"
          title="Spacing & layout governance"
          intro="Spacing and layout are governed by the product as it exists today. The audit behind this section measured the real values in the codebase rather than proposing a tidier system."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <MaturityCallout kind="current" title="How spacing is decided today">
              <p>
                There is no spacing token in the stylesheet. Spacing is written directly on each
                screen, so the shipping screens are the reference. Reuse a value that already serves
                the same purpose instead of choosing a new one.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Layout patterns are reused, not invented">
              <p>
                Page shells, card grids, filter rails, detail splits, tables, overlays and empty
                states all exist. A new screen picks the closest existing pattern; it does not
                create a parallel one.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="opportunity" title="Inconsistency is recorded, not corrected">
              <p>
                Where similar areas use different values — card padding, section rhythm, summary
                column widths — the difference is documented as an observed variation. Silently
                normalising it would visibly re-space live screens.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Shared belongs to the core system">
              <p>
                Shared spacing and layout belong to the Core Design System. Experience-specific
                layouts are documented as usage patterns of that one system — never as separate
                design systems with their own scales.
              </p>
            </MaturityCallout>
          </div>

          <div className="mt-8">
            <RuleList items={LAYOUT_GOVERNANCE_RULES} />
          </div>

          <div className="mt-8">
            <h3 className="text-base font-semibold">Guidance by experience</h3>
            <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
              Same tokens, same components, different context. Container and density notes describe
              what each experience already does.
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {EXPERIENCES.map((e) => (
                <div key={e.id} className="rounded-2xl border border-hairline bg-card p-5">
                  <p className="text-base font-semibold">{e.title}</p>
                  <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
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
                  </dl>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-base font-semibold">Still unowned</h3>
            <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
              Recurring layout areas with no single owner. Listed so the gap is visible, not to
              trigger an immediate change.
            </p>
            <div className="mt-4">
              <RuleList items={LAYOUT_UNOWNED_AREAS} tone="warning" />
            </div>
          </div>
        </RefSection>

        <RefSection
          id="typography-governance"
          eyebrow="15"
          title="Typography governance"
          intro="Two typefaces, three working weights and a small set of named roles carry the entire product. The audit behind this section measured what actually ships rather than proposing a new type scale."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <MaturityCallout kind="current" title="Two typefaces, one system">
              <p>
                Bricolage Grotesque sets headings and headline numbers; Inter Tight sets everything
                else. Every experience &mdash; marketing, shopping and the admin workspaces &mdash;
                shares that same pairing. There is no second type system to choose between.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Roles, not sizes">
              <p>
                New work picks an existing role &mdash; page title, section heading, body, label,
                caption, badge, identifier &mdash; and reuses its treatment. Choosing a size
                directly is how a system drifts.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="State is colour, never weight">
              <p>
                Muted, error, success, warning and disabled text all change colour or opacity only.
                Text never gets bigger or bolder to signal a state, and colour is never the only
                signal &mdash; the wording always carries the meaning too.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Numbers line up">
              <p>
                Prices, totals, KPI values and identifiers use tabular figures so digits sit in
                fixed-width columns. Any new number shown in a list or table follows the same rule.
              </p>
            </MaturityCallout>
          </div>
          <RefBlock title="The rules">
            <RuleList items={TYPOGRAPHY_GOVERNANCE_RULES} />
          </RefBlock>
          <RefBlock
            title="Known variation"
            note="Recorded from the live product. These are not defects to fix on sight &mdash; changing them re-types many screens at once."
          >
            <RuleList items={TYPOGRAPHY_UNOWNED_AREAS} tone="warning" />
          </RefBlock>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <MaturityCallout kind="current" title="Marketing & web pages">
              <p>
                The largest type in the product lives here, and only here. Headlines step down on
                smaller screens; body copy does not.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Shopping & marketplace">
              <p>
                Dense, scannable type: small labels, tight badges and tabular prices. Plan names use
                the heading face at a modest size so a long name stays readable.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Dashboards & admin">
              <p>
                Compact titles, uppercase micro-labels and tabular data. Large type is reserved for
                headline metrics.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Future experiences">
              <p>
                Any new surface inherits this same type system. An experience may adjust density and
                scale within the documented roles; it does not introduce a new typeface, weight or
                scale.
              </p>
            </MaturityCallout>
          </div>
          <RefBlock
            title="Bilingual readiness"
            note="Spanish runs roughly 15&ndash;25% longer than English."
          >
            <p className="text-sm text-muted-foreground">
              Type choices assume text will grow. Labels wrap rather than shrink, long values
              truncate with the full text available on hover and focus, and no layout depends on a
              fixed character count.
            </p>
          </RefBlock>
        </RefSection>

        <RefSection
          id="icon-asset-governance"
          eyebrow="16"
          title="Iconography &amp; asset governance"
          intro="One icon set serves the whole product, and every brand mark is drawn in code rather than shipped as a picture. That is what lets a partner&rsquo;s branding change without anyone producing new artwork."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <MaturityCallout kind="current" title="One shared icon set">
              <p>
                Around 150 icons from a single library cover marketing, shopping and the admin
                workspaces. New work picks an icon that already carries the meaning it needs; adding
                a second icon library is a decision for the design system, not a per-screen choice.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Icons never carry meaning alone">
              <p>
                An icon always sits beside a word, and colour always reinforces a label rather than
                replacing it. Where a control shows only an icon, it still announces a name to
                screen readers and keeps a large enough tap target on phones.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Brand marks are code, not pictures">
              <p>
                The ABox mark is drawn from the brand colours at runtime, so it adapts to light and
                dark and to a partner&rsquo;s palette automatically. There is no logo file to
                re-export when branding changes.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="The product ships no photography">
              <p>
                There are no photos or illustrations in the product today &mdash; identity comes
                from type, colour, icons and drawn background artwork. Introducing the first image
                is a deliberate decision that needs its own conventions, not an incidental one.
              </p>
            </MaturityCallout>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <MaturityCallout kind="current" title="Where partner branding lives">
              <p>
                Logos, marks and favicons for a partner are uploaded and managed in the existing
                Branding and Marketplace Assets screens. Those screens are the source of truth. This
                guide describes where those assets appear; it never stores or edits them, and the
                design system must not grow a second place to manage them.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Carrier marks are placeholders">
              <p>
                The small circular carrier badges on plan listings are generated initials, not real
                carrier logos. They are deliberately consistent per carrier so the experience feels
                settled. Replacing them with licensed logos is an asset and permissions decision,
                not a styling tweak.
              </p>
            </MaturityCallout>
          </div>

          <RefBlock title="Who owns what">
            <DefinitionRows
              rows={ASSET_OWNERSHIP.map((o) => ({
                term: o.category,
                detail: `Owned by ${o.owner}. Safe to change: ${o.safeToChange}. Needs review: ${o.needsReview}.`,
              }))}
            />
          </RefBlock>

          <RefBlock
            title="Known observations"
            note="Recorded from the live product. None of these break anything today; each is a decision waiting to be taken deliberately."
          >
            <RuleList items={ASSET_UNUSED_FINDINGS} tone="warning" />
          </RefBlock>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <MaturityCallout kind="current" title="Web / Marketing">
              <p>
                The only place drawn background artwork appears. Brand presentation is strongest
                here, and the forward arrow is the consistent signal that an action moves you on.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Shopping / Marketplace">
              <p>
                Smaller, denser icons: cart, store, product marks and carrier badges. Every product
                has exactly one icon, defined in one place, so it looks the same wherever it
                appears.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Dashboard / Admin">
              <p>
                The widest icon vocabulary &mdash; navigation, status, documents, uploads and
                hierarchy. Status icons always travel with their status word.
              </p>
            </MaturityCallout>
            <MaturityCallout kind="current" title="Future experiences">
              <p>
                A new surface inherits this icon set and these brand marks unchanged. It may use
                icons more or less densely; it does not bring its own icon library or its own logo.
              </p>
            </MaturityCallout>
          </div>

          <RefBlock
            title="Change propagation"
            note="Because icons and marks are shared, a change is rarely local."
          >
            <p className="text-sm text-muted-foreground">
              Changing a product&rsquo;s icon changes it on every screen at once, and changing the
              brand mark changes every header. That is the intended behaviour &mdash; it is also why
              these changes get reviewed rather than made in passing. The reverse also holds: never
              copy an icon or mark into a screen to customise it locally.
            </p>
          </RefBlock>
        </RefSection>

        <RefSection
          id="component-governance"
          eyebrow="17"
          title="Component governance"
          intro="The product is built from a shared set of components. This section explains what belongs in that shared set, what stays specific to one experience, and how changes are meant to travel. It documents the rules — it is not a place to change anything."
        >
          <RefBlock title="What belongs in the core system">
            <p className="text-sm text-muted-foreground">
              A component joins the core set when more than one part of the product needs it and it
              carries no business meaning of its own — a button, a badge, a page title block, an
              empty result message. A component stays specific to one part of the product when its
              meaning only exists there: a plan tile, a metal tier, a licensing outcome. Keeping
              that line clear is what stops the shared set from turning into a dumping ground.
            </p>
          </RefBlock>
          <RefBlock title="The rules we work to">
            <RuleList items={COMPONENT_GOVERNANCE_RULES} />
          </RefBlock>
          <RefBlock
            title="Where ownership is currently unclear"
            note="Named honestly so the gaps are visible. Nothing here is broken today."
          >
            <RuleList items={COMPONENT_UNOWNED_AREAS} tone="warning" />
          </RefBlock>
          <RefBlock title="Known improvements, deliberately not made yet">
            <MaturityCallout
              kind="opportunity"
              title="Each of these would change screens people use today"
            >
              <p className="mb-2">
                The audit found several places where the same idea is built more than once. None of
                them is being changed in this phase, because every fix would alter live screens.
                They are recorded so the decision can be made on purpose later.
              </p>
              <ul className="space-y-2">
                {COMPONENT_DEFERRED_OPPORTUNITIES.map((o) => (
                  <li key={o.title}>
                    <span className="font-medium text-foreground">{o.title}</span> — {o.detail}
                  </li>
                ))}
              </ul>
            </MaturityCallout>
          </RefBlock>
          <RefBlock title="Guidance by part of the product">
            <DefinitionRows
              rows={COMPONENT_EXPERIENCE_SPLIT.map((e) => ({
                term: e.experience,
                detail: e.guidance,
                meta: e.components,
              }))}
            />
          </RefBlock>
          <RefBlock title="How this connects to everything else">
            <p className="text-sm text-muted-foreground">
              Components take their colours, type and spacing from the shared tokens, and their
              icons from the shared icon set — never from values written directly into a screen.
              Logos, uploaded imagery and per-marketplace brand assets stay owned by the existing
              Branding and Marketplace Asset screens; the component layer displays them and never
              takes over managing them. When a shared component changes, it changes everywhere at
              once, so those changes are reviewed across all parts of the product before they ship.
            </p>
          </RefBlock>
          <RefBlock
            title="What the future Figma library would look like"
            note="Proposed organization only. This does not exist yet."
          >
            <DefinitionRows
              rows={FUTURE_FIGMA_ORGANIZATION.map((f) => ({ term: f.level, detail: f.detail }))}
            />
          </RefBlock>
        </RefSection>



        <RefSection
          id="figma"
          eyebrow="17"
          title="Where this goes next: Figma"
          intro="When the design library is built in Figma, it will mirror this implementation one-to-one rather than being drawn from scratch. Nothing has been converted yet — this is the agreed mapping."
        >
          <DefinitionRows
            rows={[
              ...FIGMA_MAPPING,
              ...FIGMA_LAYOUT_MAPPING,
              ...FIGMA_TYPOGRAPHY_MAPPING,
              ...FIGMA_ICON_ASSET_MAPPING,
            ].map((m) => ({
              term: m.implementation,
              detail: `→ ${m.figma}. ${m.note}`,
            }))}
          />
        </RefSection>

        <footer className="border-t border-hairline py-10 text-xs text-muted-foreground">
          This guide documents the design language. Runtime brand configuration and white-label
          settings stay in the existing Branding screens — this page never changes them.
        </footer>
      </RefContainer>
    </RefPage>
  );
}
