import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Store, UserPlus } from "lucide-react";

import { PageHeader, Section, StatCard, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AGENCY_METRICS } from "@/lib/lucie-app/data";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/agency/")({
  head: () => ({
    meta: [
      { title: "Agency overview — Northgate Insurance Group" },
      { name: "description", content: "Producer readiness, live marketplaces, submissions in flight and the work waiting on your agency today." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Agency overview" },
      { property: "og:description", content: "Everything your agency needs to act on today, in one view." },
    ],
  }),
  component: AgencyHome,
});

function AgencyHome() {
  const { state } = useLucie();
  const blocked = state.agents.filter((a) => a.status !== "ready");
  const expiring = state.agents.flatMap((a) =>
    a.licenses.filter((l) => l.status === "expiring").map((l) => ({ agent: a.name, license: l })),
  );

  return (
    <>
      <PageHeader
        eyebrow="Northgate Insurance Group"
        title="Agency overview"
        lede="Your producers, your storefronts and the applications moving through them. Anything that needs a decision is listed first."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/lucie-app/agency/marketplaces">
                <Store className="h-4 w-4" /> Marketplaces
              </Link>
            </Button>
            <Button asChild>
              <Link to="/lucie-app/agency/producers">
                <UserPlus className="h-4 w-4" /> Onboard a producer
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Producers" value={state.agents.length} hint={`${state.agents.filter((a) => a.status === "ready").length} cleared to sell`} />
        <StatCard label="Quotes this week" value={AGENCY_METRICS.quotesThisWeek} hint="Across all storefronts" />
        <StatCard label="Applications in flight" value={state.submissions.length} hint="Awaiting carrier outcome" />
        <StatCard label="Marketplaces" value={state.marketplaces.length} hint={`${state.marketplaces.filter((m) => m.status === "live").length} live`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Needs your attention"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/lucie-app/agency/producers">
                Open producers <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <Card className="grid gap-0 p-0">
            {blocked.length === 0 && expiring.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">Nothing is blocked. Every producer can sell today.</p>
            ) : null}
            {blocked.map((a) => (
              <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-5 py-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.blockReason ?? "Readiness incomplete."}</p>
                </div>
                <StatusChip tone="warn">{a.status.replace("_", " ")}</StatusChip>
              </div>
            ))}
            {expiring.map(({ agent, license }) => (
              <div key={license.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-5 py-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{agent}</p>
                  <p className="text-xs text-muted-foreground">
                    {license.state} {license.lineOfAuthority} licence expires {license.expires}.
                  </p>
                </div>
                <StatusChip tone="warn">Expiring</StatusChip>
              </div>
            ))}
          </Card>
        </Section>

        <Section title="Recent activity">
          <Card className="grid gap-0 p-0">
            {state.audit.slice(0, 6).map((e) => (
              <div key={e.id} className="border-b border-border/60 px-5 py-3 last:border-0">
                <p className="text-sm font-medium">{e.action}</p>
                <p className="text-xs text-muted-foreground">
                  {e.actor} · {e.object} · {e.when}
                </p>
              </div>
            ))}
          </Card>
        </Section>
      </div>
    </>
  );
}
