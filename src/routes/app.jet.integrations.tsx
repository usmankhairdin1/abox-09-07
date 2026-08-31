/**
 * SCR_JET_INTEGRATIONS
 */
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_INTEGRATIONS } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/integrations")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_INTEGRATIONS.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_INTEGRATIONS.purpose }] }),
  component: Page,
});

function Page() {
  const byCat = SAMPLE_INTEGRATIONS.reduce<Record<string, typeof SAMPLE_INTEGRATIONS>>((acc, i) => {
    (acc[i.category] = acc[i.category] ?? []).push(i); return acc;
  }, {});
  return (
    <InternalShell workspace="jet" pageTitle="Integrations" eyebrow="Governance">
      <div className="space-y-6">
        {Object.entries(byCat).map(([cat, list]) => (
          <section key={cat}>
            <p className="text-eyebrow mb-2">{cat}</p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {list.map((i) => (
                <article key={i.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{i.name}</p>
                    <StatusBadge tone={i.status === "connected" ? "sage" : i.status === "degraded" ? "warning" : "destructive"}>{i.status}</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Last sync {i.lastSync}</p>
                  {i.error && <p className="mt-2 rounded-md bg-warning/10 p-2 text-xs text-warning-foreground">{i.error}</p>}
                  <div className="mt-3 flex gap-1">
                    <button className="rounded-full border border-border px-3 py-1 text-xs hover:bg-accent">Configure</button>
                    {i.status !== "connected" && <button className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Reconnect</button>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </InternalShell>
  );
}
