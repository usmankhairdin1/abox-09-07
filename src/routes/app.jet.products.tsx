/**
 * SCR_JET_PRODUCTS
 */
import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_PRODUCT_CATALOG, type SampleProductCatalog } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/products")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_PRODUCTS.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_PRODUCTS.purpose }] }),
  component: Page,
});

function Page() {
  const cols: Column<SampleProductCatalog>[] = [
    { key: "name", header: "Product", cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.category} · {r.owner}</p>
      </div>
    )},
    { key: "version", header: "Version", cell: (r) => <span className="tabular-nums text-xs">{r.version}</span> },
    { key: "states", header: "States", align: "right", cell: (r) => r.states },
    { key: "carriers", header: "Carriers", align: "right", cell: (r) => r.carriers },
    { key: "live", header: "Availability", cell: (r) => (
      <StatusBadge tone={r.live ? "sage" : "muted"}>{r.live ? "Live" : "Draft"}</StatusBadge>
    )},
  ];
  return (
    <InternalShell workspace="jet" pageTitle="Product catalog" eyebrow="Catalog"
      actions={<button className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"><Package className="h-4 w-4" /> New product</button>}
    >
      <DataTable columns={cols} rows={SAMPLE_PRODUCT_CATALOG} getRowId={(r) => r.key} ariaLabel="Product catalog" />
    </InternalShell>
  );
}
