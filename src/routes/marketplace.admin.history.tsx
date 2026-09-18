/**
 * SCR-M04-024 — Marketplace History.
 * Immutable release, domain, participant, link, routing and JET override
 * history (REQ-M04-ADM-023).
 */
import { surfaceClass } from "@/components/abox/surface";
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { useMarketplaceState, getHistory } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/history")({
  head: () => ({ meta: [{ title: "Marketplace History — ABox" }, { name: "description", content: "Immutable release, domain, participant, link, routing and JET override history." }] }),
  component: Page,
});

function Page() {
  const mkt = useMarketplaceState();
  const history = getHistory(mkt);
  const [actorFilter, setActorFilter] = useState("all");
  const actors = useMemo(() => Array.from(new Set(history.map((h) => h.actor))), [history]);
  const filtered = actorFilter === "all" ? history : history.filter((h) => h.actor === actorFilter);

  return (
    <InternalShell workspace="agency" pageTitle="Marketplace history" eyebrow="Marketplace History · SCR-M04-024">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-eyebrow" htmlFor="actor-filter">Filter by actor</label>
        <select id="actor-filter" value={actorFilter} onChange={(e) => setActorFilter(e.target.value)} className="h-10 rounded-full border border-border bg-card px-3 text-sm">
          <option value="all">All actors</option>
          {actors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <section className={surfaceClass()}>
        <header className="mb-3 flex items-center gap-2"><History className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">History</h2></header>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history matches this filter.</p>
        ) : (
          <ol className="divide-y divide-border">
            {filtered.map((h) => (
              <li key={h.history_id} className="grid grid-cols-[160px_1fr] gap-4 py-3 text-sm">
                <span className="text-xs text-muted-foreground" suppressHydrationWarning>{new Date(h.when).toLocaleString()}</span>
                <span><span className="font-medium">{h.actor}</span> — {h.summary}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </InternalShell>
  );
}
