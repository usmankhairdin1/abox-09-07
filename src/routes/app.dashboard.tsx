import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, useShell } from "@/components/shell/AppShell";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { PageHeading } from "@/components/wireframe/primitives";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/abox";
import {
  COMMISSION_SNAPSHOT,
  FUNNEL,
  LEAD_SOURCES,
  MARKETPLACE_STOREFRONTS,
  QUOTE_ACTIVITY,
  BOOK_OF_BUSINESS,
} from "@/lib/workspace-data";
import { ArrowRight, CheckCircle2, FileCheck2, UserPlus, Users } from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboards & Analytics — Agency in a Box" },
      {
        name: "description",
        content:
          "Production analytics for your agency: funnel conversion, quote activity, lead sources, commission projection and marketplace performance.",
      },
      { property: "og:title", content: "Dashboards & Analytics — Agency in a Box" },
      {
        property: "og:description",
        content: "Entity-scoped analytics across quotes, applications, commissions and marketplaces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const FILTERS = [
  { label: "Workspace", value: "Northwind Master" },
  { label: "Entity / downline", value: "All downline (7)" },
  { label: "Date range", value: "Last 30 days" },
  { label: "Product line", value: "All products" },
  { label: "Producer / team", value: "Entire team" },
];

function DashboardPage() {
  const { labels, roleId } = useShell();
  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[1]!;
  const maxQuote = Math.max(...QUOTE_ACTIVITY.map((d) => d.d2c + d.assisted));
  const maxCommission = Math.max(...COMMISSION_SNAPSHOT.months);

  return (
    <AppShell drawerTitle="Dashboard context" assistantContext="this dashboard">
      <PageHeading
        eyebrow="Dashboards & Analytics"
        title="Performance analytics"
        id="SCR_DASHBOARD"
        description="Live production metrics for your book of business, scoped to the workspace and entity you have selected."
        actions={
          <>
            <Button variant="outline" className="rounded-full">Save view</Button>
            <Button variant="outline" className="rounded-full">Export</Button>
          </>
        }
      />

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FILTERS.map((f) => (
          <div key={f.label} className="rounded-xl border border-hairline bg-card px-4 py-3 shadow-card">
            <p className="text-eyebrow">{f.label}</p>
            <p className="mt-1.5 text-sm font-medium">{f.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <KpiCard label="Quotes started" value="2,140" delta={{ pct: 9.6, label: "vs. prior 30 days" }} icon={UserPlus} />
        <KpiCard label="Applications submitted" value="542" delta={{ pct: 6.2, label: "vs. prior 30 days" }} icon={FileCheck2} tone="primary" />
        <KpiCard label="Conversion rate" value="25.3%" delta={{ pct: 1.8, label: "quote to submit" }} icon={CheckCircle2} tone="sage" />
        <KpiCard label={`Active ${labels.member.toLowerCase()}s`} value={BOOK_OF_BUSINESS.activeMembers.toLocaleString()} hint="Across all storefronts" icon={Users} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-hairline bg-card p-6 shadow-card">
          <h2 className="text-display text-xl">Conversion funnel</h2>
          <p className="mt-1 text-sm text-muted-foreground">Shop → quote → cart → application → submitted → effectuated</p>
          <div className="mt-5 space-y-3">
            {FUNNEL.map((s) => (
              <div key={s.stage} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-sm text-muted-foreground">{s.stage}</span>
                <div className="h-7 flex-1 overflow-hidden rounded-lg bg-surface">
                  <div className="h-full rounded-lg bg-primary/85" style={{ width: `${(s.value / FUNNEL[0]!.value) * 100}%` }} />
                </div>
                <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-hairline bg-card p-6 shadow-card">
          <h2 className="text-display text-xl">Quote activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">Direct-to-consumer vs. agent assisted, last 7 days</p>
          <div className="mt-6 flex h-44 items-end gap-3">
            {QUOTE_ACTIVITY.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 flex-col justify-end gap-0.5">
                  <div className="w-full grow" style={{ flexGrow: maxQuote - d.d2c - d.assisted }} />
                  <div className="w-full rounded-t bg-primary/80" style={{ flexGrow: d.d2c }} title={`Direct ${d.d2c}`} />
                  <div className="w-full rounded-b bg-primary/35" style={{ flexGrow: d.assisted }} title={`Assisted ${d.assisted}`} />
                </div>
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-primary/80" />Direct</span>
            <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-primary/35" />Agent assisted</span>
          </div>
        </article>

        <article className="rounded-2xl border border-hairline bg-card p-6 shadow-card">
          <h2 className="text-display text-xl">{labels.lead} activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">By source, with current working status</p>
          <div className="mt-4">
            {LEAD_SOURCES.map((l) => (
              <div key={l.source} className="flex items-center justify-between border-b border-hairline py-3.5 last:border-0">
                <div>
                  <p className="text-sm font-medium">{l.source}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{l.count} leads</p>
                </div>
                <StatusBadge tone={l.status === "Open" ? "warning" : "info"}>{l.status}</StatusBadge>
              </div>
            ))}
          </div>
        </article>

        {role.commissions ? (
          <article className="rounded-2xl border border-hairline bg-card p-6 shadow-card">
            <h2 className="text-display text-xl">Commission projection</h2>
            <p className="mt-1 text-sm text-muted-foreground">Projection only — statements live in the Commissions module</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[["Projected MTD", COMMISSION_SNAPSHOT.projectedMtd], ["Projected annualised", COMMISSION_SNAPSHOT.projectedAnnualised], ["Pending overrides", COMMISSION_SNAPSHOT.pendingOverrides]].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-hairline p-3">
                  <p className="text-sm text-muted-foreground">{k}</p>
                  <p className="mt-2 text-lg font-semibold tabular-nums">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex h-28 items-stretch gap-2">
              {COMMISSION_SNAPSHOT.months.map((m, i) => (
                <div key={i} className="flex w-full flex-1 flex-col justify-end">
                  <div className="w-full rounded-t bg-primary/60" style={{ height: `${(m / maxCommission) * 100}%`, minHeight: 4 }} />
                </div>
              ))}
            </div>
          </article>
        ) : (
          <article className="rounded-2xl border border-hairline bg-card p-6 shadow-card">
            <h2 className="text-display text-xl">Commission projection</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Commission visibility is not enabled for the {role.label.toLowerCase()} role.
            </p>
          </article>
        )}

        <article className="rounded-2xl border border-hairline bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-display text-xl">{labels.marketplace} performance</h2>
              <p className="mt-1 text-sm text-muted-foreground">Traffic and outcomes per storefront</p>
            </div>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/app/admin">Manage storefronts <ArrowRight /></Link>
            </Button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-muted-foreground">
                  <th className="py-2.5 font-medium">Storefront</th>
                  <th className="py-2.5 text-right font-medium">Sessions</th>
                  <th className="py-2.5 text-right font-medium">Quotes</th>
                  <th className="py-2.5 text-right font-medium">Placed</th>
                  <th className="py-2.5 text-right font-medium">Placement rate</th>
                </tr>
              </thead>
              <tbody>
                {MARKETPLACE_STOREFRONTS.map((s) => (
                  <tr key={s.name} className="border-b border-hairline last:border-0">
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3 text-right tabular-nums">{s.sessions.toLocaleString()}</td>
                    <td className="py-3 text-right tabular-nums">{s.quotes.toLocaleString()}</td>
                    <td className="py-3 text-right tabular-nums">{s.placed}</td>
                    <td className="py-3 text-right tabular-nums">{Math.round((s.placed / s.quotes) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <p className="mt-8 rounded-xl border border-hairline bg-primary-soft/60 px-4 py-3 text-sm leading-relaxed text-foreground/85">
        Every metric is entity scoped: an {labels.agent.toLowerCase()} sees their own production, an{" "}
        {labels.agency.toLowerCase()} admin sees their entity plus downline, platform admins see all. Exports inherit the
        same scope and are logged.
      </p>
    </AppShell>
  );
}
