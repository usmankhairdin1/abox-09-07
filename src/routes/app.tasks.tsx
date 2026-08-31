/**
 * SCR_APP_TASKS — Tasks list
 */
import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_TASKS, type SampleTask } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_APP_TASKS.name} — ABox` }, { name: "description", content: SCREENS.SCR_APP_TASKS.purpose }] }),
  component: Page,
});

function Page() {
  const cols: Column<SampleTask>[] = [
    { key: "title", header: "Task", cell: (r) => (
      <div>
        <p className="font-medium">{r.title}</p>
        {r.leadName && <p className="text-xs text-muted-foreground">{r.leadName}</p>}
      </div>
    )},
    { key: "due", header: "Due", cell: (r) => r.due },
    { key: "priority", header: "Priority", cell: (r) => (
      <StatusBadge tone={r.priority === "high" ? "primary" : "muted"}>{r.priority}</StatusBadge>
    )},
    { key: "sla", header: "SLA", cell: (r) => r.sla ? <StatusBadge tone={r.sla.startsWith("Overdue") ? "destructive" : "warning"}>{r.sla}</StatusBadge> : "—" },
    { key: "status", header: "Status", cell: (r) => (
      <StatusBadge tone={r.status === "open" ? "primary" : r.status === "done" ? "sage" : "muted"}>{r.status}</StatusBadge>
    )},
    { key: "src", header: "Source", cell: (r) => <span className="text-xs uppercase tracking-widest text-muted-foreground">{r.source}</span> },
  ];
  return (
    <InternalShell workspace="agent" pageTitle="Tasks" eyebrow="Relationships"
      actions={<button className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"><CheckSquare className="h-4 w-4" /> New task</button>}
    >
      <DataTable columns={cols} rows={SAMPLE_TASKS} getRowId={(r) => r.id} ariaLabel="Tasks" />
    </InternalShell>
  );
}
