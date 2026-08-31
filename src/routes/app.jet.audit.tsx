/**
 * SCR_JET_AUDIT
 */
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_AUDIT, type SampleAuditEvent } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/audit")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_AUDIT.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_AUDIT.purpose }] }),
  component: Page,
});

function Page() {
  const cols: Column<SampleAuditEvent>[] = [
    { key: "ts", header: "Timestamp (UTC)", cell: (r) => <span className="tabular-nums text-xs">{r.ts}</span> },
    { key: "actor", header: "Actor", cell: (r) => r.actor },
    { key: "action", header: "Action", cell: (r) => <code className="text-xs">{r.action}</code> },
    { key: "entity", header: "Entity", cell: (r) => r.entity },
    { key: "ip", header: "IP", cell: (r) => <span className="text-xs text-muted-foreground tabular-nums">{r.ip}</span> },
    { key: "result", header: "Result", cell: (r) => (
      <StatusBadge tone={r.result === "ok" ? "sage" : "destructive"}>{r.result}</StatusBadge>
    )},
  ];
  return (
    <InternalShell workspace="jet" pageTitle="Audit log" eyebrow="Governance">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Immutable event log · retention 7 years.</p>
        <button className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent">Export CSV</button>
      </div>
      <DataTable columns={cols} rows={SAMPLE_AUDIT} getRowId={(r) => r.id} ariaLabel="Audit log" />
    </InternalShell>
  );
}
