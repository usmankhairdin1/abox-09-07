import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { KpiCard } from "@/components/abox/kpi-card";
import { SAMPLE_STATEMENTS, type SampleStatement } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/agency/statements")({
  head: () => ({ meta: [{ title: "Agency Statements — ABox" }, { name: "description", content: SCREENS.SCR_AGENCY_STATEMENTS.purpose }] }),
  component: Page,
});

function Page() {
  const booked = SAMPLE_STATEMENTS.reduce((s, x) => s + x.booked, 0);
  const projected = SAMPLE_STATEMENTS.reduce((s, x) => s + x.projected, 0);
  const cols: Column<SampleStatement>[] = [
    { key: "period", header: "Period", cell: (r) => r.period },
    { key: "booked", header: "Booked", align: "right", cell: (r) => `$${r.booked.toLocaleString()}` },
    { key: "projected", header: "Projected", align: "right", cell: (r) => `$${r.projected.toLocaleString()}` },
    { key: "carriers", header: "Carriers", align: "right", cell: (r) => r.carriers },
    { key: "policies", header: "Policies", align: "right", cell: (r) => r.policies },
    { key: "status", header: "Status", cell: (r) => (
      <StatusBadge tone={r.status === "posted" ? "sage" : r.status === "projected" ? "primary" : "destructive"}>{r.status}</StatusBadge>
    )},
  ];
  return (
    <InternalShell workspace="agency" pageTitle="Agency statements" eyebrow="Money">
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Booked YTD" value={`$${booked.toLocaleString()}`} tone="primary" />
        <KpiCard label="Projected" value={`$${projected.toLocaleString()}`} tone="sage" />
        <KpiCard label="Disputed" value={SAMPLE_STATEMENTS.filter((s) => s.status === "disputed").length} tone="warning" />
      </div>
      <div className="mt-6">
        <DataTable columns={cols} rows={SAMPLE_STATEMENTS} getRowId={(r) => r.id} ariaLabel="Agency statements" />
      </div>
    </InternalShell>
  );
}
