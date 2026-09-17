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
import { AboxMark } from "@/components/abox/logo";
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
} from "@/components/design/reference-kit";

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
      </RefContainer>
    </RefPage>
  );
}

function RadiusValue({ name }: { name: string }) {
  const value = useTokenValue(name);
  return <span className="text-serial">{value || name}</span>;
}
