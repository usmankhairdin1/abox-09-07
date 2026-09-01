/**
 * SCR_APP_MY_WORK — Agent daily worklist
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckSquare, MessageSquare, Flame, Sparkles } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_TASKS, SAMPLE_MESSAGES } from "@/lib/sample-data-ext";
import { SAMPLE_NOTIFICATIONS } from "@/lib/sample-data";
import { useLeadState, getLeads } from "@/lib/lead-store";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/my-work")({
  head: () => ({
    meta: [
      { title: `${SCREENS.SCR_APP_MY_WORK.name} — ABox` },
      { name: "description", content: SCREENS.SCR_APP_MY_WORK.purpose },
      { property: "og:title", content: `${SCREENS.SCR_APP_MY_WORK.name} — ABox` },
      { property: "og:description", content: SCREENS.SCR_APP_MY_WORK.purpose },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const openTasks = SAMPLE_TASKS.filter((t) => t.status === "open");
  const unreadMessages = SAMPLE_MESSAGES.filter((m) => m.unread);
  const leadState = useLeadState();
  const hotLeads = getLeads(leadState).filter((l) => ["Quoted","Shared"].includes(l.stage));
  return (
    <InternalShell workspace="agent" pageTitle="My work" eyebrow="Today"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open tasks" value={openTasks.length} icon={CheckSquare} tone="primary" hint={`${openTasks.filter((t) => t.priority === "high").length} high priority`} />
        <KpiCard label="Unread messages" value={unreadMessages.length} icon={MessageSquare} />
        <KpiCard label="Hot leads" value={hotLeads.length} icon={Flame} tone="warning" hint="Quoted or shared" />
        <KpiCard label="Plan-AI nudges" value={3} icon={Sparkles} tone="sage" hint="AI-suggested" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-baseline justify-between border-b border-border px-5 py-3">
            <h2 className="text-display text-2xl">Tasks</h2>
            <Link to="/app/tasks" className="text-xs text-primary story-link">All tasks</Link>
          </header>
          <ul className="divide-y divide-border">
            {openTasks.slice(0, 6).map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.leadName ?? "—"} · {t.due}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {t.sla && <StatusBadge tone={t.sla.startsWith("Overdue") ? "destructive" : "warning"}>{t.sla}</StatusBadge>}
                  <StatusBadge tone={t.priority === "high" ? "primary" : t.priority === "med" ? "muted" : "muted"}>{t.priority}</StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-baseline justify-between border-b border-border px-5 py-3">
            <h2 className="text-display text-2xl">Hot leads</h2>
            <Link to="/app/customers" className="text-xs text-primary story-link">All leads</Link>
          </header>
          <ul className="divide-y divide-border">
            {hotLeads.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                <Link to="/app/customers/$id" params={{ id: l.id }} className="flex-1 min-w-0">
                  <p className="font-medium story-link">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.id} · {l.product}</p>
                </Link>
                <StatusBadge tone={l.stage === "Quoted" ? "primary" : l.stage === "Shared" ? "info" : "muted"}>{l.stage}</StatusBadge>
                <span className="text-xs text-muted-foreground">{l.updatedAgo}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </InternalShell>
  );
}
