/**
 * SCR-M05-022 — Organization Activity and Change History.
 * Immutable actor and context before-and-after history, filterable
 * (REQ-M05-PRF-021 / REQ-M05-OPS-020).
 */
import { surfaceClass } from "@/components/abox/surface";
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, History } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { useOrgState, getOrganization, getHistory } from "@/lib/org-store";

export const Route = createFileRoute("/agency/organizations/$organizationId/history")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `History — ${params.organizationId} — ABox` }] }),
  component: Page,
});

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const history = getHistory(org, organizationId);
  const [actorFilter, setActorFilter] = useState("all");

  const actors = useMemo(() => Array.from(new Set(history.map((h) => h.actor))), [history]);
  const filtered = actorFilter === "all" ? history : history.filter((h) => h.actor === actorFilter);

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="History · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  return (
    <InternalShell workspace="agency" pageTitle={`Activity & change history — ${record.display_name}`} eyebrow="Activity and Change History · SCR-M05-022">
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-eyebrow" htmlFor="actor-filter">Filter by actor</label>
        <select id="actor-filter" value={actorFilter} onChange={(e) => setActorFilter(e.target.value)} className="h-10 rounded-full border border-border bg-card px-3 text-sm">
          <option value="all">All actors</option>
          {actors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <section className={surfaceClass()}>
        <header className="mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-display text-xl">History</h2>
        </header>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history matches this filter.</p>
        ) : (
          <ol className="divide-y divide-border">
            {filtered.map((h) => (
              <li key={h.history_id} className="grid grid-cols-[160px_1fr] gap-4 py-3 text-sm">
                <span className="text-xs text-muted-foreground">{new Date(h.when).toLocaleString()}</span>
                <span><span className="font-medium">{h.actor}</span> — {h.summary}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </InternalShell>
  );
}
