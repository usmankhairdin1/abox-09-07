/**
 * SCR-M04-009 — Channels and Product Availability.
 * State, product line, carrier and channel matrix with canonical
 * blockers (REQ-M04-AVL-003/005/009/010/011).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ListTree } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import {
  marketplaceStore, useMarketplaceState, getAvailability, PRODUCT_LINE_LABEL,
  CHANNEL_LABEL, type AvailabilityEntry,
} from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/availability/")({
  head: () => ({ meta: [{ title: "Channels and Product Availability — ABox" }, { name: "description", content: "State, product line, carrier and channel matrix with canonical blockers." }] }),
  component: Page,
});

function Page() {
  const mkt = useMarketplaceState();
  const entries = getAvailability(mkt);

  const toggle = (entry: AvailabilityEntry) => {
    if (entry.blockers.length > 0 && entry.status === "DISABLED") return; // cannot enable while blocked
    marketplaceStore.updateAvailability(entry.availability_entry_id, { status: entry.status === "ENABLED" ? "DISABLED" : "ENABLED" });
    marketplaceStore.addHistory({
      history_id: crypto.randomUUID().slice(0, 8), marketplace_id: entry.marketplace_id, when: new Date().toISOString(),
      actor: "Elena Alvarez", summary: `${entry.status === "ENABLED" ? "Disabled" : "Enabled"} ${PRODUCT_LINE_LABEL[entry.product_line]} in ${entry.state_code} (${entry.carrier_name}).`,
    });
    marketplaceStore.recalculateReadiness();
  };

  const cols: Column<AvailabilityEntry>[] = [
    { key: "state", header: "State", cell: (r) => r.state_code },
    { key: "product", header: "Product line", cell: (r) => (
      <Link to="/marketplace/admin/availability/$availabilityEntryId" params={{ availabilityEntryId: r.availability_entry_id }} className="story-link font-medium text-foreground">
        {PRODUCT_LINE_LABEL[r.product_line]}
      </Link>
    ) },
    { key: "carrier", header: "Carrier", cell: (r) => r.carrier_name },
    { key: "channels", header: "Channels", cell: (r) => r.channels.map((c) => CHANNEL_LABEL[c]).join(", ") || "—" },
    { key: "status", header: "Status", cell: (r) => (
      r.blockers.length > 0
        ? <StatusBadge tone="warning">Blocked</StatusBadge>
        : <StatusBadge tone={r.status === "ENABLED" ? "sage" : "muted"}>{r.status}</StatusBadge>
    ) },
    { key: "toggle", header: "Action", align: "right", cell: (r) => (
      <button
        onClick={() => toggle(r)} disabled={r.blockers.length > 0 && r.status === "DISABLED"}
        className="inline-flex h-8 items-center rounded-full border border-border px-3 text-xs font-medium hover:bg-accent disabled:opacity-40"
      >
        {r.status === "ENABLED" ? "Disable" : "Enable"}
      </button>
    ) },
  ];

  return (
    <InternalShell workspace="agency" pageTitle="Channels and product availability" eyebrow="Channels and Product Availability · SCR-M04-009">
      <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><ListTree className="h-4 w-4" /> Configure only at state, product line and carrier level — no plan-by-plan curation (REQ-M04-AVL-003).</p>
      <DataTable columns={cols} rows={entries} getRowId={(r) => r.availability_entry_id} ariaLabel="Availability matrix" />
    </InternalShell>
  );
}
