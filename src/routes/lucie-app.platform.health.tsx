import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Section, StatCard, StatusChip, toneFor } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INTEGRATIONS } from "@/lib/lucie-app/data";

export const Route = createFileRoute("/lucie-app/platform/health")({
  head: () => ({
    meta: [
      { title: "Integration health — JET platform" },
      { name: "description", content: "Live status, latency and success rate for every integration the product depends on." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Integration health" },
      { property: "og:description", content: "Status, latency and success rate per integration." },
    ],
  }),
  component: HealthPage,
});

function HealthPage() {
  const healthy = INTEGRATIONS.filter((i) => i.status === "healthy").length;

  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Integration health"
        lede="Every failure here has a named owner and a queue entry — nothing is allowed to fail quietly into a log file."
        actions={
          <Button variant="outline" onClick={() => toast.success("Health probes re-run across all integrations.")}>
            <Activity className="h-4 w-4" /> Re-run probes
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Healthy" value={`${healthy} of ${INTEGRATIONS.length}`} tone={healthy === INTEGRATIONS.length ? "good" : "warn"} />
        <StatCard label="Reporting latency" value={INTEGRATIONS.filter((i) => i.latency !== "—").length} hint="integrations returning timings" />

        <StatCard
          label="Lowest success rate"
          value={`${Math.min(...INTEGRATIONS.map((i) => i.successRate))}%`}
          tone="warn"
        />
      </div>

      <Section title="Integrations">
        <div className="grid gap-3 sm:grid-cols-2">
          {INTEGRATIONS.map((i) => (
            <Card key={i.id} className="grid gap-2 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.kind}</p>
                </div>
                <StatusChip tone={toneFor(i.status)}>{i.status}</StatusChip>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Latency</p>
                  <p className="font-medium tabular-nums">{i.latency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success</p>
                  <p className="font-medium tabular-nums">{i.successRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last event</p>
                  <p className="font-medium">{i.lastEvent}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
