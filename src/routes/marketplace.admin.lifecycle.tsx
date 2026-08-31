/**
 * SCR-M04-022 — Marketplace Lifecycle.
 * Suspend, reactivate, request ending and review continuity
 * (REQ-M04-MKT-013/014/015).
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PauseCircle, PlayCircle, XCircle } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { marketplaceStore, useMarketplaceState, getMarketplace, getOpenTaskCount, MARKETPLACE_ID } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/lifecycle")({
  head: () => ({ meta: [{ title: "Marketplace Lifecycle — ABox" }, { name: "description", content: "Suspend, reactivate, request ending and review continuity." }] }),
  component: Page,
});

function Page() {
  const mkt = useMarketplaceState();
  const marketplace = getMarketplace(mkt);
  const openTasks = getOpenTaskCount(mkt);
  const [reason, setReason] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [endRequested, setEndRequested] = useState(false);
  const [done, setDone] = useState(false);

  const suspend = () => { if (!reason.trim()) return; marketplaceStore.suspendMarketplace("Elena Alvarez", reason, effectiveDate); setReason(""); setDone(true); };
  const reactivate = () => { marketplaceStore.reactivateMarketplace("Elena Alvarez", reason || "Readiness re-confirmed."); setReason(""); setDone(true); };
  const requestEnd = () => {
    marketplaceStore.addTask({ task_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, task_type: "ENDING_REVIEW", owner: "JET", status: "OPEN", description: `Root requested marketplace ending. Reason: ${reason}`, created_at: new Date().toISOString() });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: "Requested marketplace ending — routed to JET for offboarding completion." });
    setEndRequested(true);
  };

  return (
    <InternalShell workspace="agency" pageTitle="Marketplace lifecycle" eyebrow="Marketplace Lifecycle · SCR-M04-022">
      {done && <p className="mb-4 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm">Lifecycle change recorded — see history.</p>}

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-display text-xl">Current lifecycle</h2>
          <StatusBadge tone={marketplace.lifecycle_status === "ACTIVE" ? "sage" : marketplace.lifecycle_status === "SUSPENDED" ? "warning" : marketplace.lifecycle_status === "ENDED" ? "destructive" : "muted"}>{marketplace.lifecycle_status}</StatusBadge>
        </div>

        <div className="mb-4 rounded-xl border border-border bg-panel/40 p-4 text-sm">
          <p className="font-medium">Impact review</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            <li>{openTasks} open issue{openTasks === 1 ? "" : "s"} for this marketplace.</li>
            <li>Suspension blocks new anonymous entry and new starts; existing saved quotes, applications and enrollment records remain reachable for authenticated users (REQ-M04-MKT-014).</li>
            <li>Only JET can complete ending as part of offboarding.</li>
          </ul>
        </div>

        {marketplace.lifecycle_status !== "ENDED" && (
          <div className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-eyebrow">Reason</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="w-full rounded-lg border border-border bg-background p-3" />
            </div>
            {marketplace.lifecycle_status !== "SUSPENDED" && (
              <div>
                <label className="mb-1 block text-eyebrow">Effective date</label>
                <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="h-10 w-full max-w-xs rounded-lg border border-border bg-background px-3" />
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {marketplace.lifecycle_status === "SUSPENDED" ? (
                <button onClick={reactivate} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <PlayCircle className="h-4 w-4" aria-hidden /> Reactivate
                </button>
              ) : (
                <button onClick={suspend} disabled={!reason.trim()} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-warning/40 px-5 text-sm font-medium text-warning hover:bg-warning/10 disabled:opacity-40">
                  <PauseCircle className="h-4 w-4" aria-hidden /> Suspend marketplace
                </button>
              )}
              {marketplace.lifecycle_status === "ACTIVE" && !endRequested && (
                <button onClick={requestEnd} disabled={!reason.trim()} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-destructive/40 px-5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-40">
                  <XCircle className="h-4 w-4" aria-hidden /> Request ending
                </button>
              )}
              {endRequested && <StatusBadge tone="warning">Ending request sent to JET</StatusBadge>}
            </div>
          </div>
        )}
      </section>
    </InternalShell>
  );
}
