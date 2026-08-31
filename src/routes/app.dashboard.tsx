/**
 * SCR_APP_DASHBOARD — performance & funnel
 */
import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, Send, DollarSign } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { SAMPLE_FUNNEL, SAMPLE_STATEMENTS } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: `${SCREENS.SCR_APP_DASHBOARD.name} — ABox` },
      { name: "description", content: SCREENS.SCR_APP_DASHBOARD.purpose },
      { property: "og:title", content: `${SCREENS.SCR_APP_DASHBOARD.name} — ABox` },
      { property: "og:description", content: SCREENS.SCR_APP_DASHBOARD.purpose },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const maxCount = Math.max(...SAMPLE_FUNNEL.map((s) => s.count));
  return (
    <InternalShell workspace="agent" pageTitle="Performance" eyebrow="Dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Visits (30d)"    value="2,140" icon={TrendingUp} delta={{ pct: 6.4 }} />
        <KpiCard label="Quotes sent"     value={214}   icon={Send}       delta={{ pct: 3.1 }} tone="primary" />
        <KpiCard label="Enrollments"     value={92}    icon={Users}      delta={{ pct: 14.5 }} tone="sage" />
        <KpiCard label="Projected earnings" value="$15,200" icon={DollarSign} hint="Booked $12,480" tone="primary" />
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-display text-2xl">Funnel</h2>
        <p className="text-sm text-muted-foreground">Marketplace visits to enrolled policies · last 30 days.</p>
        <ul className="mt-5 space-y-2">
          {SAMPLE_FUNNEL.map((s) => (
            <li key={s.step} className="grid grid-cols-[160px_1fr_120px] items-center gap-3 text-sm">
              <span>{s.step}</span>
              <div className="h-6 rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-primary/80"
                  style={{ width: `${Math.max(6, (s.count / maxCount) * 100)}%` }}
                  aria-hidden
                />
              </div>
              <span className="text-right tabular-nums">
                <span className="font-medium">{s.count.toLocaleString()}</span>
                <span className={"ml-2 text-xs " + (s.deltaPct >= 0 ? "text-sage" : "text-destructive")}>
                  {s.deltaPct >= 0 ? "+" : ""}{s.deltaPct.toFixed(1)}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-display text-2xl">Commissions trend</h2>
        <div className="mt-4 flex items-end gap-3">
          {SAMPLE_STATEMENTS.slice().reverse().map((s) => {
            const max = Math.max(...SAMPLE_STATEMENTS.map((x) => x.projected));
            const h = Math.max(20, (s.projected / max) * 160);
            return (
              <div key={s.id} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t-md bg-primary/70" style={{ height: h }} aria-hidden />
                <p className="text-[10px] text-muted-foreground">{s.period}</p>
                <p className="text-xs tabular-nums">${(s.projected / 1000).toFixed(1)}k</p>
              </div>
            );
          })}
        </div>
      </section>
    </InternalShell>
  );
}
