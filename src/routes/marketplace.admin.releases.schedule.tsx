/**
 * SCR-M04-021 — Scheduled Publication.
 * One future effective publication with readiness revalidation
 * (REQ-M04-BRD-019 / REQ-M04-ADM-013).
 */
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Calendar, XCircle } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { marketplaceStore, useMarketplaceState, getScheduledRelease, getDraftBrand, getDraftContent, MARKETPLACE_ID } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/releases/schedule")({
  head: () => ({ meta: [{ title: "Scheduled Publication — ABox" }, { name: "description", content: "One future effective publication with readiness revalidation." }] }),
  component: Page,
});

function Page() {
  const mkt = useMarketplaceState();
  const navigate = useNavigate();
  const scheduled = getScheduledRelease(mkt);
  const hasDraft = !!getDraftBrand(mkt) || !!getDraftContent(mkt);
  const [datetime, setDatetime] = useState(() => {
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    return d.toISOString().slice(0, 16);
  });

  const schedule = () => {
    marketplaceStore.publishRelease("Elena Alvarez", new Date(datetime).toISOString());
    navigate({ to: "/marketplace/admin" });
  };
  const cancel = () => {
    if (!scheduled) return;
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: "Cancelled a scheduled release." });
  };

  return (
    <InternalShell workspace="agency" pageTitle="Scheduled publication" eyebrow="Scheduled Publication · SCR-M04-021">
      {scheduled ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">Scheduled release</h2>
          <StatusBadge tone="warning">
            <Calendar className="h-3 w-3" /> Effective {new Date(scheduled.effective_from!).toLocaleString()}
          </StatusBadge>
          <p className="mt-3 text-sm text-muted-foreground">Only one future effective publication is allowed. Readiness is revalidated at the effective time — if blocked, the current active release remains and no partial release is shown.</p>
          <button onClick={cancel} className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full border border-destructive/40 px-4 text-sm font-medium text-destructive hover:bg-destructive/10">
            <XCircle className="h-4 w-4" aria-hidden /> Cancel schedule
          </button>
        </section>
      ) : !hasDraft ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No draft to schedule. Start one from <Link to="/marketplace/admin/brand" className="story-link text-primary">Brand</Link> or <Link to="/marketplace/admin/content" className="story-link text-primary">Content</Link>.
        </p>
      ) : (
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">Schedule this draft</h2>
          <label className="mb-1 block text-eyebrow">Effective date and time</label>
          <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="h-10 w-full max-w-xs rounded-lg border border-border bg-background px-3 text-sm" />
          <button onClick={schedule} className="mt-4 block inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Calendar className="h-4 w-4" aria-hidden /> Schedule publication
          </button>
        </section>
      )}
    </InternalShell>
  );
}
