/**
 * SCR-M04-001 — JET Marketplace Operations.
 * JET cross-tenant marketplace operational overview and explicit-context
 * actions (JET_PLATFORM_ADMIN).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, ShieldAlert, AlertTriangle, Building2 } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { getOrganization, ROOT_ORGANIZATION_ID } from "@/lib/org-store";
import { useOrgState } from "@/lib/org-store";
import {
  useMarketplaceState, getMarketplace, getReadiness, getOpenTaskCount, getPrimaryDomain,
  type Marketplace,
} from "@/lib/marketplace-store";
import { actionPillClass } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/platform/marketplaces/")({
  head: () => ({ meta: [{ title: "JET Marketplace Operations — ABox" }, { name: "description", content: "JET cross-tenant marketplace operational overview and explicit-context actions." }] }),
  component: Page,
});

const LIFECYCLE_TONE = { DRAFT: "muted", ACTIVE: "sage", SUSPENDED: "warning", ENDED: "destructive" } as const;

function Page() {
  const mkt = useMarketplaceState();
  const org = useOrgState();
  const marketplace = getMarketplace(mkt);
  const readiness = getReadiness(mkt);
  const domain = getPrimaryDomain(mkt);
  const openTasks = getOpenTaskCount(mkt);
  const owner = getOrganization(org, marketplace.owner_organization_id ?? ROOT_ORGANIZATION_ID);

  const rows: Marketplace[] = [marketplace];
  const cols: Column<Marketplace>[] = [
    { key: "name", header: "Marketplace", cell: () => (
      <div>
        <Link to="/marketplace/admin" className="story-link font-medium text-foreground">{owner?.display_name ?? "Marketplace"}</Link>
        <p className="text-xs text-muted-foreground">{marketplace.internal_code} · {domain?.hostname ?? "no domain"}</p>
      </div>
    ) },
    { key: "tenant", header: "Tenant", cell: (r) => r.tenant_id },
    { key: "lifecycle", header: "Lifecycle", cell: (r) => <StatusBadge tone={LIFECYCLE_TONE[r.lifecycle_status]}>{r.lifecycle_status}</StatusBadge> },
    { key: "readiness", header: "Readiness", cell: () => readiness ? <StatusBadge tone={readiness.status === "READY" ? "sage" : readiness.status === "BLOCKED" ? "destructive" : "warning"}>{readiness.status.replaceAll("_", " ")}</StatusBadge> : <span className="text-muted-foreground">—</span> },
    { key: "actions", header: "Actions", align: "right", cell: (r) => (
      <Link to="/platform/marketplaces/$marketplaceId/override" params={{ marketplaceId: r.marketplace_id }} className={actionPillClass("outlineXs")}>
        <ShieldAlert className="h-3.5 w-3.5" aria-hidden /> Override
      </Link>
    ) },
  ];

  return (
    <InternalShell workspace="jet" pageTitle="Marketplace operations" eyebrow="JET Platform · M04">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Marketplaces in platform" value={rows.length} icon={Store} tone="primary" />
        <KpiCard label="Open marketplace exceptions" value={openTasks} icon={AlertTriangle} tone={openTasks > 0 ? "warning" : "default"} />
        <KpiCard label="Owning organizations" value={1} icon={Building2} />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-display text-xl">All marketplaces</h2>
        </div>
        <DataTable columns={cols} rows={rows} getRowId={(r) => r.marketplace_id} ariaLabel="Marketplaces" />
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Prior-module (M00/M05/protected M01) delta review lives on{" "}
        <Link to="/app/jet/platform" className="story-link text-primary">Platform Foundation (M00)</Link>.
      </p>
    </InternalShell>
  );
}
