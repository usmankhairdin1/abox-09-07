import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_ENTITIES, type SampleEntity } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/agency/entities")({
  head: () => ({ meta: [{ title: "Entities & Hierarchy — ABox" }, { name: "description", content: SCREENS.SCR_AGENCY_SETUP.purpose }] }),
  component: Page,
});

function Page() {
  const cols: Column<SampleEntity>[] = [
    { key: "id", header: "ID", cell: (r) => r.id },
    { key: "name", header: "Entity", cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        {r.parent && <p className="text-xs text-muted-foreground">Under {SAMPLE_ENTITIES.find((e) => e.id === r.parent)?.name}</p>}
      </div>
    )},
    { key: "kind", header: "Kind", cell: (r) => <StatusBadge tone="muted">{r.kind}</StatusBadge> },
    { key: "prods", header: "Producers", align: "right", cell: (r) => r.producers },
    { key: "states", header: "States", cell: (r) => <span className="text-xs">{r.states.join(", ")}</span> },
    { key: "status", header: "Status", cell: (r) => (
      <StatusBadge tone={r.status === "active" ? "sage" : r.status === "onboarding" ? "primary" : "warning"}>{r.status}</StatusBadge>
    )},
  ];
  return (
    <InternalShell workspace="agency" pageTitle="Entities & hierarchy" eyebrow="Structure">
      <DataTable columns={cols} rows={SAMPLE_ENTITIES} getRowId={(r) => r.id} ariaLabel="Agency entities" />
    </InternalShell>
  );
}
