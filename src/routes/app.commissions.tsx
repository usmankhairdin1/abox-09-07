/**
 * SCR_APP_COMMISSIONS
 */
import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, Download, AlertCircle } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_STATEMENTS, type SampleStatement } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/commissions")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_APP_COMMISSIONS.name} — ABox` }, { name: "description", content: SCREENS.SCR_APP_COMMISSIONS.purpose }] }),
  component: Page,
});

function Page() {
  const total = SAMPLE_STATEMENTS.reduce((s, x) => s + x.booked, 0);
  const projected = SAMPLE_STATEMENTS.reduce((s, x) => s + x.projected, 0);
  const cols: Column<SampleStatement>[] = [
    { key: "period",   header: "Period",     cell: (r) => r.period },
    { key: "booked",   header: "Booked",     align: "right", cell: (r) => `$${r.booked.toLocaleString()}` },
    { key: "projected",header: "Projected",  align: "right", cell: (r) => `$${r.projected.toLocaleString()}` },
    { key: "carriers", header: "Carriers",   align: "right", cell: (r) => r.carriers },
    { key: "policies", header: "Policies",   align: "right", cell: (r) => r.policies },
    { key: "status",   header: "Status",     cell: (r) => (
      <StatusBadge tone={r.status === "posted" ? "sage" : r.status === "projected" ? "primary" : "destructive"}>{r.status}</StatusBadge>
    )},
    { key: "actions",  header: "", cell: (r) => (
      <div className="flex justify-end gap-1">
        <button className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs hover:bg-accent">
          <Download className="h-3 w-3" /> Export
        </button>
        {r.status === "disputed" && (
          <button className="inline-flex h-8 items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-3 text-xs">
            <AlertCircle className="h-3 w-3" /> Review dispute
          </button>
        )}
      </div>
    )},
  ];
  return (
    <InternalShell workspace="agent" pageTitle="Commissions" eyebrow="Earnings">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="YTD booked" value={`$${total.toLocaleString()}`} icon={DollarSign} tone="primary" />
        <KpiCard label="YTD projected" value={`$${projected.toLocaleString()}`} tone="sage" />
        <KpiCard label="Open disputes" value={SAMPLE_STATEMENTS.filter((s) => s.status === "disputed").length} tone="warning" />
        <KpiCard label="Policies" value={SAMPLE_STATEMENTS.reduce((s, x) => s + x.policies, 0)} />
      </div>
      <div className="mt-6">
        <DataTable columns={cols} rows={SAMPLE_STATEMENTS} getRowId={(r) => r.id} ariaLabel="Commission statements" />
      </div>
    </InternalShell>
  );
}
