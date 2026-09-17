/**
 * SCR-M05-024 — Organization Import Result.
 * Row results, errors and committed outcome (REQ-M05-OPS-009/010).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getImportJob } from "@/lib/org-store";
import { ACTION_PILL } from "@/components/abox/action-pill";

export const Route = createFileRoute("/agency/organization-imports/$importJobId")({
  loader: ({ params }) => ({ importJobId: params.importJobId }),
  head: ({ params }) => ({ meta: [{ title: `Import result — ${params.importJobId} — ABox` }] }),
  component: Page,
});

function Page() {
  const { importJobId } = Route.useLoaderData();
  const org = useOrgState();
  const job = getImportJob(org, importJobId);

  if (!job) {
    return (
      <InternalShell workspace="agency" pageTitle="Import not found" eyebrow="Organization Import Result · M05">
        <p>That import job doesn't exist in this session. <Link to="/agency/organization-imports" className="story-link text-primary">Back to imports</Link></p>
      </InternalShell>
    );
  }

  const validCount = job.rows.filter((r) => r.status === "VALID").length;

  return (
    <InternalShell
      workspace="agency" pageTitle={`Import result — ${job.filename}`} eyebrow="Organization Import Result · SCR-M05-024"
      actions={
        job.status === "VALIDATED" ? (
          <button
            onClick={() => orgStore.commitImportJob(job.import_job_id, "Elena Alvarez")}
            className={ACTION_PILL.primaryMd}
          >
            Commit import ({validCount} organizations, DRAFT)
          </button>
        ) : undefined
      }
    >
      <Link to="/agency/organization-imports" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to imports
      </Link>

      <div className="mb-4 flex items-center gap-3">
        <StatusBadge tone={job.status === "COMMITTED" ? "sage" : job.status === "FAILED" ? "destructive" : "warning"}>{job.status}</StatusBadge>
        <span className="text-sm text-muted-foreground">Submitted {new Date(job.created_at).toLocaleString()}</span>
        {job.committed_at && <span className="text-sm text-muted-foreground">· Committed {new Date(job.committed_at).toLocaleString()}</span>}
      </div>

      {job.status === "COMMITTED" && (
        <p className="mb-4 flex items-center gap-2 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm">
          <CheckCircle2 className="h-4 w-4 text-sage" aria-hidden /> {validCount} organizations created as DRAFT. Activation still requires an accepted administrator and passed readiness.
        </p>
      )}

      <section className="rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <tr><th className="px-4 py-3">Row</th><th className="px-4 py-3">Organization</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Outcome</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {job.rows.map((r) => (
                <tr key={r.row_number}>
                  <td className="px-4 py-3">{r.row_number}</td>
                  <td className="px-4 py-3">{r.display_name || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge tone={r.status === "VALID" ? "sage" : "destructive"}>{r.status}</StatusBadge></td>
                  <td className="px-4 py-3 text-sm">
                    {r.created_organization_id ? (
                      <Link to="/agency/organizations/$organizationId" params={{ organizationId: r.created_organization_id }} className="story-link text-primary">View organization</Link>
                    ) : r.errors.length ? <span className="text-xs text-muted-foreground">{r.errors.join("; ")}</span> : <span className="text-xs text-muted-foreground">Not yet committed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </InternalShell>
  );
}
