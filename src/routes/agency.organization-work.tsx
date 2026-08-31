/**
 * SCR-M05-026 — Organization Tasks and Exceptions.
 * Fixed M05 work types and escalation (REQ-M05-OPS-014/015/016).
 */
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getOrganization, TASK_TYPE_LABEL, type TaskStatus } from "@/lib/org-store";

export const Route = createFileRoute("/agency/organization-work")({
  head: () => ({ meta: [{ title: "Organization Tasks and Exceptions — ABox" }, { name: "description", content: "Fixed M05 work types and escalation." }] }),
  component: Page,
});

function Page() {
  const org = useOrgState();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("OPEN");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  const tasks = useMemo(
    () => (statusFilter === "all" ? org.tasks : org.tasks.filter((t) => t.status === statusFilter)),
    [org.tasks, statusFilter],
  );
  const openCount = org.tasks.filter((t) => t.status === "OPEN").length;
  const escalatedCount = org.tasks.filter((t) => t.status === "ESCALATED").length;

  const submitResolution = (taskId: string) => {
    orgStore.resolveTask(taskId, resolutionText || "Resolved by root.");
    setResolvingId(null); setResolutionText("");
  };

  return (
    <InternalShell workspace="agency" pageTitle="Organization tasks and exceptions" eyebrow="Organization Tasks and Exceptions · SCR-M05-026">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><AlertTriangle className="h-4 w-4" /> {openCount} open · {escalatedCount} escalated to JET</span>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")} className="h-10 rounded-full border border-border bg-card px-3 text-sm">
          <option value="OPEN">Open</option>
          <option value="ESCALATED">Escalated</option>
          <option value="RESOLVED">Resolved</option>
          <option value="all">All</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No tasks or exceptions match this filter.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => {
            const targetOrg = getOrganization(org, t.organization_id);
            return (
              <li key={t.task_id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone="muted">{TASK_TYPE_LABEL[t.task_type]}</StatusBadge>
                      <StatusBadge tone={t.status === "OPEN" ? "warning" : t.status === "ESCALATED" ? "destructive" : "sage"}>{t.status}</StatusBadge>
                      <StatusBadge tone="info">Owner: {t.owner}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm">{t.description}</p>
                    {targetOrg && (
                      <Link to="/agency/organizations/$organizationId" params={{ organizationId: t.organization_id }} className="story-link text-xs text-primary">
                        {targetOrg.display_name}
                      </Link>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>Opened {new Date(t.created_at).toLocaleString()}</p>
                    {t.resolution && <p className="mt-1 text-xs text-muted-foreground">Resolution: {t.resolution}</p>}
                  </div>
                  {t.status === "OPEN" && (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => orgStore.escalateTask(t.task_id)}
                        className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium hover:bg-accent"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /> Escalate to JET
                      </button>
                      <button
                        onClick={() => setResolvingId(resolvingId === t.task_id ? null : t.task_id)}
                        className="inline-flex h-8 items-center gap-1 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Resolve
                      </button>
                    </div>
                  )}
                </div>
                {resolvingId === t.task_id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      autoFocus value={resolutionText} onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Resolution note" className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm"
                    />
                    <button onClick={() => submitResolution(t.task_id)} className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">Save</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </InternalShell>
  );
}
