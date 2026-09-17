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
} from "@/components/design/reference-kit";
import {
  OWNERSHIP_HIERARCHY,
  SAFE_CHANGE_RULES,
  INTENTIONAL_ONE_OFFS,
  DEFERRED_OPPORTUNITIES,
  EXPERIENCES,
  FIGMA_MAPPING,
} from "@/lib/design/governance";

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
          <RefBlock title="Who owns what" note="Reading top to bottom: the higher the layer, the wider the blast radius of a change.">
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
                { title: "Change a token", body: "Update one value in the style foundation and every screen, both light and dark, follows immediately." },
                { title: "Change a component", body: "Update the single owning component and every page that uses it updates — this is a product change and needs product review." },
                { title: "Change one screen", body: "Stays local to that screen. Safe, but it is how drift starts: prefer adding a variant to the shared component." },
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
              { title: "Contrast by pairing", body: "Every surface and status colour ships with a matching text colour. Dark backgrounds take light text; light backgrounds take dark text." },
              { title: "Never colour alone", body: "Status is always stated in words alongside its colour, so meaning survives colour blindness and greyscale printing." },
              { title: "Visible focus", body: "Keyboard focus draws a ring from the shared focus colour on every interactive element." },
              { title: "Touch targets", body: "On phones, every button and link is at least 44px tall." },
              { title: "Reduced motion", body: "If the operating system asks for less motion, every animation and transition switches off." },
              { title: "Skip to content", body: "Each shell starts with a skip link that appears on keyboard focus." },
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
          id="figma"
          eyebrow="14"
          title="Where this goes next: Figma"
          intro="When the design library is built in Figma, it will mirror this implementation one-to-one rather than being drawn from scratch. Nothing has been converted yet — this is the agreed mapping."
        >
          <DefinitionRows
            rows={FIGMA_MAPPING.map((m) => ({
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
