import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_PRODUCERS, type SampleProducer } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/agency/producers")({
  head: () => ({ meta: [{ title: "Producers & Licenses — ABox" }, { name: "description", content: SCREENS.SCR_AGENCY_PRODUCERS.purpose }] }),
  component: Page,
});

function Page() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("3 days ago");

  async function reconcile() {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 700));
    setSyncing(false);
    setLastSync("just now");
    toast.success("NIPR reconciliation complete", {
      description: `${SAMPLE_PRODUCERS.filter((p) => p.status !== "good").length} producer(s) still need attention`,
    });
  }

  const cols: Column<SampleProducer>[] = [
    { key: "name", header: "Producer", cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">NPN {r.npn} · {r.id}</p>
      </div>
    )},
    { key: "states", header: "States", cell: (r) => <span className="text-xs">{r.states.join(", ")}</span> },
    { key: "carriers", header: "Carriers", align: "right", cell: (r) => r.carriers },
    { key: "ce", header: "CE hours", align: "right", cell: (r) => (
      <span className={r.ceHours < r.ceRequired ? "text-warning-foreground" : ""}>{r.ceHours}/{r.ceRequired}</span>
    )},
    { key: "next", header: "Next expiry", cell: (r) => r.nextExpiry },
    { key: "status", header: "Status", cell: (r) => (
      <StatusBadge tone={r.status === "good" ? "sage" : r.status === "warning" ? "warning" : "destructive"}>{r.status}</StatusBadge>
    )},
  ];
  return (
    <InternalShell workspace="agency" pageTitle="Producers & licenses" eyebrow="People">
      <div className="mb-4 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
        <p className="font-medium">1 producer has expired licensure.</p>
        <p className="text-muted-foreground">
          NIPR sync ran {lastSync}.{" "}
          <button type="button" disabled={syncing} onClick={reconcile} className="story-link text-primary disabled:opacity-60">
            {syncing ? "Reconciling…" : "Reconcile now"}
          </button>
        </p>
      </div>
      <DataTable columns={cols} rows={SAMPLE_PRODUCERS} getRowId={(r) => r.id} ariaLabel="Producers" />
    </InternalShell>
  );
}
