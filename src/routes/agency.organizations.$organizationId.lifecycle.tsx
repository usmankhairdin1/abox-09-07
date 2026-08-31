/**
 * SCR-M05-027 — Organization Suspension and Reactivation.
 * Impact review and governed lifecycle command (REQ-M05-OPS-024).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PauseCircle, PlayCircle } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getOrganization, getOpenTaskCount } from "@/lib/org-store";

export const Route = createFileRoute("/agency/organizations/$organizationId/lifecycle")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `Suspend / reactivate — ${params.organizationId} — ABox` }] }),
  component: Page,
});

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const openTasks = getOpenTaskCount(org, organizationId);
  const [reason, setReason] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [done, setDone] = useState(false);

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Lifecycle · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  const suspend = () => {
    if (!reason.trim()) return;
    orgStore.suspendOrganization(organizationId, "Elena Alvarez", reason, effectiveDate);
    setReason(""); setDone(true);
  };
  const reactivate = () => {
    orgStore.reactivateOrganization(organizationId, "Elena Alvarez", reason || "Blockers resolved; readiness re-confirmed.");
    setReason(""); setDone(true);
  };

  return (
    <InternalShell workspace="agency" pageTitle={`Suspension & reactivation — ${record.display_name}`} eyebrow="Organization Suspension and Reactivation · SCR-M05-027">
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      {done && <p className="mb-4 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm">Lifecycle change recorded — see activity history.</p>}

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-display text-xl">Current lifecycle</h2>
          <StatusBadge tone={record.lifecycle_status === "ACTIVE" ? "sage" : record.lifecycle_status === "SUSPENDED" ? "warning" : record.lifecycle_status === "ENDED" ? "destructive" : "muted"}>{record.lifecycle_status}</StatusBadge>
        </div>

        <div className="mb-4 rounded-xl border border-border bg-panel/40 p-4 text-sm">
          <p className="font-medium">Impact review</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            <li>{openTasks} open task{openTasks === 1 ? "" : "s"} for this organization.</li>
            <li>Suspension blocks its users and new normal transactions while allowing root/JET investigation.</li>
            <li>Reactivation requires resolved blockers and passed readiness.</li>
          </ul>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-eyebrow">Reason</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="w-full rounded-lg border border-border bg-background p-3" />
          </div>
          {record.lifecycle_status !== "SUSPENDED" && (
            <div>
              <label className="mb-1 block text-eyebrow">Effective date</label>
              <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="h-10 w-full max-w-xs rounded-lg border border-border bg-background px-3" />
            </div>
          )}
          <div className="flex gap-3">
            {record.lifecycle_status === "SUSPENDED" ? (
              <button onClick={reactivate} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <PlayCircle className="h-4 w-4" aria-hidden /> Reactivate
              </button>
            ) : (
              <button onClick={suspend} disabled={!reason.trim()} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-destructive/40 px-5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-40">
                <PauseCircle className="h-4 w-4" aria-hidden /> Suspend organization
              </button>
            )}
          </div>
        </div>
      </section>
    </InternalShell>
  );
}
