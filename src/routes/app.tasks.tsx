/**
 * SCR_APP_TASKS — Tasks list
 * Working task board: create, complete and reopen tasks against live
 * component state (seeded from the workspace sample set).
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

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
  const [tasks, setTasks] = useState<SampleTask[]>(SAMPLE_TASKS);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("Today");
  const [priority, setPriority] = useState<SampleTask["priority"]>("high");

  function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const task: SampleTask = {
      ...tasks[0]!,
      id: `T-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      title: title.trim(),
      due,
      priority,
      status: "open",
      source: "manual",
      sla: undefined,
      leadName: undefined,
    };
    setTasks([task, ...tasks]);
    setTitle("");
    setComposing(false);
    toast.success("Task created", { description: task.title });
  }

  function toggle(row: SampleTask) {
    const next = row.status === "done" ? "open" : "done";
    setTasks((prev) => prev.map((t) => (t.id === row.id ? { ...t, status: next } : t)));
    toast(next === "done" ? "Task completed" : "Task reopened", { description: row.title });
  }

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
    { key: "actions", header: "", cell: (r) => (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => toggle(r)}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs hover:bg-accent"
        >
          {r.status === "done" ? <><RotateCcw className="h-3 w-3" /> Reopen</> : <><CheckSquare className="h-3 w-3" /> Complete</>}
        </button>
      </div>
    )},
  ];

  return (
    <InternalShell
      workspace="agent"
      pageTitle="Tasks"
      eyebrow="Relationships"
      actions={
        <button
          type="button"
          onClick={() => setComposing((v) => !v)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New task
        </button>
      }
    >
      {composing && (
        <form onSubmit={createTask} className="mb-4 grid gap-2 rounded-2xl border border-border bg-card p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Follow up with Jordan Rivera"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            value={due}
            onChange={(e) => setDue(e.target.value)}
            placeholder="Due"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as SampleTask["priority"])}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="high">high</option>
            <option value="normal">normal</option>
          </select>
          <button type="submit" className="h-10 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
            Add
          </button>
        </form>
      )}
      <DataTable columns={cols} rows={tasks} getRowId={(r) => r.id} ariaLabel="Tasks" />
    </InternalShell>
  );
}
