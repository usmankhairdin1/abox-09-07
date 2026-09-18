/**
 * SCR-M04-023 — Marketplace Tasks and Exceptions.
 * Fixed M04 tasks, exceptions, owner module and escalation
 * (REQ-M04-ADM-020/021).
 */
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { marketplaceStore, useMarketplaceState, MKT_TASK_LABEL, type TaskStatus } from "@/lib/marketplace-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/marketplace/admin/work")({
  head: () => ({ meta: [{ title: "Marketplace Tasks and Exceptions — ABox" }, { name: "description", content: "Fixed M04 tasks, exceptions, owner module and escalation." }] }),
  component: Page,
});

function Page() {
  const mkt = useMarketplaceState();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("OPEN");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  const tasks = useMemo(() => (statusFilter === "all" ? mkt.tasks : mkt.tasks.filter((t) => t.status === statusFilter)), [mkt.tasks, statusFilter]);
  const openCount = mkt.tasks.filter((t) => t.status === "OPEN").length;
  const escalatedCount = mkt.tasks.filter((t) => t.status === "ESCALATED").length;

  const submitResolution = (taskId: string) => { marketplaceStore.resolveTask(taskId, resolutionText || "Resolved by root."); setResolvingId(null); setResolutionText(""); };

  return (
    <InternalShell workspace="agency" pageTitle="Marketplace tasks and exceptions" eyebrow="Marketplace Tasks and Exceptions · SCR-M04-023">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><AlertTriangle className="h-4 w-4" /> {openCount} open · {escalatedCount} escalated to JET</span>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")} className="h-10 rounded-full border border-border bg-card px-3 text-sm">
          <option value="OPEN">Open</option><option value="ESCALATED">Escalated</option><option value="RESOLVED">Resolved</option><option value="all">All</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No tasks or exceptions match this filter.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t.task_id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="muted">{MKT_TASK_LABEL[t.task_type]}</StatusBadge>
                    <StatusBadge tone={t.status === "OPEN" ? "warning" : t.status === "ESCALATED" ? "destructive" : "sage"}>{t.status}</StatusBadge>
                    <StatusBadge tone="info">Owner: {t.owner.replaceAll("_", " ")}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm">{t.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>Opened {new Date(t.created_at).toLocaleString()}</p>
                  {t.resolution && <p className="mt-1 text-xs text-muted-foreground">Resolution: {t.resolution}</p>}
                </div>
                {t.status === "OPEN" && (
                  <div className="flex shrink-0 items-center gap-2">
                    <ActionPill onClick={() => marketplaceStore.escalateTask(t.task_id)} variant="outlineXs"><ArrowUpRight className="h-3.5 w-3.5" aria-hidden /> Escalate to JET</ActionPill>
                    <ActionPill onClick={() => setResolvingId(resolvingId === t.task_id ? null : t.task_id)} variant="primaryXs"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Resolve</ActionPill>
                  </div>
                )}
              </div>
              {resolvingId === t.task_id && (
                <div className="mt-3 flex gap-2">
                  <input autoFocus value={resolutionText} onChange={(e) => setResolutionText(e.target.value)} placeholder="Resolution note" className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm" />
                  <button onClick={() => submitResolution(t.task_id)} className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">Save</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </InternalShell>
  );
}
