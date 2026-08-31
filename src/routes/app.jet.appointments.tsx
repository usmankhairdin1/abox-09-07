/**
 * SCR_JET_APPOINTMENTS — Carrier appointments matrix
 */
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_APPTS, type SampleCarrierAppt } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/appointments")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_APPOINTMENTS.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_APPOINTMENTS.purpose }] }),
  component: Page,
});

function Page() {
  const cols: Column<SampleCarrierAppt>[] = [
    { key: "carrier", header: "Carrier", cell: (r) => r.carrier },
    { key: "product", header: "Product line", cell: (r) => r.product },
    { key: "states", header: "States", cell: (r) => <span className="text-xs">{r.states.join(", ")}</span> },
    { key: "eff", header: "Effective", cell: (r) => r.effective },
    { key: "term", header: "Termination", cell: (r) => r.terminates ?? "—" },
    { key: "status", header: "Status", cell: (r) => (
      <StatusBadge tone={r.status === "active" ? "sage" : r.status === "pending" ? "warning" : "destructive"}>{r.status}</StatusBadge>
    )},
  ];
  return (
    <InternalShell workspace="jet" pageTitle="Carrier appointments" eyebrow="Catalog">
      <DataTable columns={cols} rows={SAMPLE_APPTS} getRowId={(r) => r.id} ariaLabel="Carrier appointments" />
    </InternalShell>
  );
}
