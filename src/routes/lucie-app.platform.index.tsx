import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHeader, Section, StatCard, StatusChip, toneFor } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INTEGRATIONS, TENANTS } from "@/lib/lucie-app/data";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/platform/")({
  head: () => ({
    meta: [
      { title: "Platform operations — JET" },
      { name: "description", content: "Tenant health, integration status, open exceptions and launch readiness for the platform in one operations home." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Platform operations" },
      { property: "og:description", content: "One place to see tenants, integrations, exceptions and launch gates." },
    ],
  }),
  component: PlatformHome,
});

function PlatformHome() {
  const { state } = useLucie();
  const openExceptions = state.exceptions.filter((e) => e.status === "open");
  const blockedGates = state.gates.filter((g) => g.state !== "open");

  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Operations home"
        lede="What is running, what is broken and what is still holding back launch. Everything here links to the queue where the work actually happens."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tenants" value={TENANTS.length} hint={`${TENANTS.filter((t) => t.status === "active").length} active`} />
        <StatCard label="Integrations healthy" value={`${INTEGRATIONS.filter((i) => i.status === "healthy").length}/${INTEGRATIONS.length}`} tone={INTEGRATIONS.every((i) => i.status === "healthy") ? "good" : "warn"} />
        <StatCard label="Open exceptions" value={openExceptions.length} tone={openExceptions.length ? "warn" : "good"} />
        <StatCard label="Gates not open" value={blockedGates.length} tone={blockedGates.length ? "warn" : "good"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Exceptions needing an owner"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/lucie-app/platform/exceptions">
                Open queue <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <Card className="grid gap-0 p-0">
            {openExceptions.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">The queue is clear.</p>
            ) : (
              openExceptions.map((e) => (
                <div key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-5 py-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.source} · {e.owner} · opened {e.opened}
                    </p>
                  </div>
                  <StatusChip tone={e.severity === "high" ? "bad" : "warn"}>{e.severity}</StatusChip>
                </div>
              ))
            )}
          </Card>
        </Section>

        <Section
          title="Launch readiness"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/lucie-app/platform/gates">
                Open gates <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <Card className="grid gap-0 p-0">
            {state.gates.map((g) => (
              <div key={g.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-5 py-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{g.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{g.owner}</p>
                </div>
                <StatusChip tone={toneFor(g.state)}>{g.state}</StatusChip>
              </div>
            ))}
          </Card>
        </Section>
      </div>
    </>
  );
}
