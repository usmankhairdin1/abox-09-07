import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";

import { KpiCard } from "@/components/abox/kpi-card";
import { MastheadMark } from "@/components/abox/decor";
import { StatusBadge } from "@/components/abox/status-badge";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PRIORITY_WORK, RECENT_ACTIVITY, BOOK_OF_BUSINESS } from "@/lib/workspace-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Operations Home — Agency in a Box" },
      {
        name: "description",
        content:
          "Manage agency work, customer activity, submissions, products, commissions, and governed operations in ABox.",
      },
      { property: "og:title", content: "Operations Home — Agency in a Box" },
      {
        property: "og:description",
        content:
          "A unified insurance distribution workspace for agencies, agents, marketplaces, and platform teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OperationsHome,
});

const ICONS = { FileCheck2, Users, Building2 } as const;

const ESTATES = [
  { to: "/select", title: "Marketplace & sales", detail: "Quote, compare, cart, and member journeys", icon: ShoppingBag },
  { to: "/app/object", title: "Customers & records", detail: "Customer, quote, application, and policy records", icon: Users },
  { to: "/app/admin", title: "Administration", detail: "Branding, access control, products, and audit", icon: Building2 },
  { to: "/lucie", title: "Governance", detail: "Traceability, states, modules, and release controls", icon: ShieldCheck },
] as const;

function OperationsHome() {
  return (
    <AppShell drawerTitle="Today at a glance" assistantContext="your operations home">
      <header className="relative overflow-hidden border-b border-hairline pb-10 pt-8 md:pb-12 md:pt-12">
        <MastheadMark label="Agency workspace · Northwind Master" />
        <div className="mt-7 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-3xl">
            <h1 className="text-display text-4xl leading-none sm:text-5xl md:text-6xl">Good morning, Elena.</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Your book is moving. Three cases need attention today and seven new opportunities are ready for follow-up.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full" asChild>
              <Link to="/app/object"><Users />Find customer</Link>
            </Button>
            <Button className="rounded-full" asChild>
              <Link to="/quote" search={{ step: 1 }}><UserPlus />Start a quote</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="py-8" aria-labelledby="portfolio-heading">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-eyebrow">Book of business</p>
            <h2 id="portfolio-heading" className="text-display mt-2 text-2xl">Performance snapshot</h2>
          </div>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link to="/app/dashboard">View analytics <ArrowRight /></Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <KpiCard label="Active members" value={BOOK_OF_BUSINESS.activeMembers.toLocaleString()} delta={{ pct: 8.4, label: "this month" }} icon={Users} />
          <KpiCard label="Open opportunities" value={BOOK_OF_BUSINESS.openOpportunities} delta={{ pct: 12.1, label: "this week" }} icon={UserPlus} tone="primary" />
          <KpiCard label="In-flight applications" value={BOOK_OF_BUSINESS.inFlightApplications} hint="5 need attention" icon={FileCheck2} tone="warning" />
          <KpiCard label="Placement rate" value={`${BOOK_OF_BUSINESS.placementRate}%`} delta={{ pct: 3.2, label: "vs. last month" }} icon={CheckCircle2} tone="sage" />
        </div>
      </section>

      <section className="grid gap-6 border-t border-hairline py-8 xl:grid-cols-[1.15fr_.85fr]">
        <div className="min-w-0">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow">Queue</p>
              <h2 className="text-display mt-2 text-2xl">Needs your attention</h2>
            </div>
            <StatusBadge tone="warning">{PRIORITY_WORK.length} priority</StatusBadge>
          </div>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
            {PRIORITY_WORK.map((item, index) => {
              const Icon = ICONS[item.icon];
              return (
                <Link
                  key={item.title}
                  to="/app/my-work"
                  className="group flex w-full items-center gap-4 border-b border-hairline p-5 text-left transition-colors last:border-0 hover:bg-accent/60"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-hairline bg-surface text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold">{item.title}</span>
                    <span className="mt-1 block truncate text-sm text-muted-foreground">{item.detail}</span>
                  </span>
                  <span className="hidden text-right sm:block">
                    <StatusBadge tone={item.tone}>{item.meta}</StatusBadge>
                    <span className="mt-2 block text-xs text-muted-foreground">Priority {index + 1}</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-5">
            <p className="text-eyebrow">This month</p>
            <h2 className="text-display mt-2 text-2xl">Production pace</h2>
          </div>
          <div className="rounded-2xl border border-hairline bg-primary p-6 text-primary-foreground shadow-elevated">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase">Placed premium</p>
                <p className="text-display mt-3 text-4xl">{BOOK_OF_BUSINESS.placedPremium}</p>
              </div>
              <span className="rounded-full border border-primary-foreground/20 px-3 py-1 text-xs">
                {BOOK_OF_BUSINESS.goalProgress}% of goal
              </span>
            </div>
            <Progress value={BOOK_OF_BUSINESS.goalProgress} className="mt-8 bg-primary-foreground/20 [&_[data-slot=progress-indicator]]:bg-primary-foreground" />
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-primary-foreground/15 pt-5">
              {[["Goal", BOOK_OF_BUSINESS.goal], ["Pending", BOOK_OF_BUSINESS.pending], ["Days left", String(BOOK_OF_BUSINESS.daysLeft)]].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-primary-foreground/65">{label}</p>
                  <p className="mt-1 font-semibold tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 border-t border-hairline py-8 xl:grid-cols-[1.2fr_.8fr]">
        <div className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-eyebrow">Live operations</p>
              <h2 className="text-display mt-2 text-2xl">Recent activity</h2>
            </div>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/app/object">View all <ArrowRight /></Link>
            </Button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
            {RECENT_ACTIVITY.map((row) => (
              <div key={`${row.event}-${row.subject}`} className="grid gap-2 border-b border-hairline px-5 py-4 last:border-0 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-medium">{row.event}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{row.subject}</p>
                </div>
                <p className="text-sm text-muted-foreground">{row.detail}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{row.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-5">
            <p className="text-eyebrow">Explore</p>
            <h2 className="text-display mt-2 text-2xl">ABox capabilities</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {ESTATES.map((estate) => {
              const Icon = estate.icon;
              return (
                <Link key={estate.to} to={estate.to} className="group rounded-2xl border border-hairline bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30">
                  <Icon className="size-5 text-primary" />
                  <p className="mt-5 text-sm font-semibold">{estate.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{estate.detail}</p>
                  <ArrowRight className="mt-4 size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
