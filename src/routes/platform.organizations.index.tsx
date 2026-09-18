/**
 * SCR-M05-001 — JET Tenant and Organization Operations.
 * JET tenant and organization oversight and controlled actions
 * (JET_PLATFORM_ADMIN only).
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Landmark, Building2, ShieldAlert, GitPullRequestArrow } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import {
  orgStore, useOrgState, ROOT_ORGANIZATION_ID, TENANT_ID, getOrganization,
  ORG_TYPE_LABEL, type Organization, type ReferenceOrganizationRequest,
} from "@/lib/org-store";
import { actionPillClass } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/platform/organizations/")({
  head: () => ({ meta: [{ title: "JET Tenant and Organization Operations — ABox" }, { name: "description", content: "JET tenant and organization oversight and controlled actions." }] }),
  component: Page,
});

function Page() {
  const org = useOrgState();
  const root = getOrganization(org, ROOT_ORGANIZATION_ID);
  const pendingRequests = org.referenceRequests.filter((r) => r.status === "PENDING");
  const openOverrideTargets = org.tasks.filter((t) => t.owner === "JET" && t.status !== "RESOLVED");

  const cols: Column<Organization>[] = [
    { key: "name", header: "Organization", cell: (r) => (
      <div>
        <Link to="/agency/organizations/$organizationId" params={{ organizationId: r.organization_id }} className="story-link font-medium text-foreground">
          {r.display_name}
        </Link>
        <p className="text-xs text-muted-foreground">{r.reference_code}</p>
      </div>
    ) },
    { key: "type", header: "Type", cell: (r) => ORG_TYPE_LABEL[r.organization_type] },
    { key: "lifecycle", header: "Lifecycle", cell: (r) => <StatusBadge tone={r.lifecycle_status === "ACTIVE" ? "sage" : r.lifecycle_status === "DRAFT" ? "muted" : r.lifecycle_status === "SUSPENDED" ? "warning" : "destructive"}>{r.lifecycle_status}</StatusBadge> },
    { key: "override", header: "Actions", align: "right", cell: (r) => (
      <Link
        to="/platform/organizations/$organizationId/override" params={{ organizationId: r.organization_id }}
        className={actionPillClass("outlineXs")}
      >
        <ShieldAlert className="h-3.5 w-3.5" aria-hidden /> Override
      </Link>
    ) },
  ];

  const reqCols: Column<ReferenceOrganizationRequest>[] = [
    { key: "name", header: "Requested reference", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "type", header: "Type", cell: (r) => r.requested_type },
    { key: "by", header: "Requested by", cell: (r) => r.requested_by },
    { key: "actions", header: "Resolution", align: "right", cell: (r) => (
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            const organization_id = crypto.randomUUID().slice(0, 8);
            const id = `org-${organization_id}`;
            orgStore.addOrganization({
              organization_id: id, tenant_id: TENANT_ID, reference_code: `ORG-${1000 + Math.floor(Math.random() * 8999)}`,
              organization_type: r.requested_type as "CARRIER" | "VENDOR", legal_name: r.name, display_name: r.name,
              lifecycle_status: "ACTIVE", time_zone: "America/New_York", default_language: "EN", version: 1,
            });
            orgStore.resolveReferenceRequest(r.request_id, "CREATED", "JET created a new platform reference organization.", id);
            orgStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), organization_id: id, when: new Date().toISOString(), actor: "JET Platform Admin", summary: "Created as a JET-controlled reference organization." });
          }}
          className="inline-flex h-8 items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create reference
        </button>
        <button
          onClick={() => orgStore.resolveReferenceRequest(r.request_id, "REJECTED", "JET rejected the request — no valid reference basis.")}
          className="inline-flex h-8 items-center rounded-full border border-border px-3 text-xs font-medium hover:bg-accent"
        >
          Reject
        </button>
      </div>
    ) },
  ];

  return (
    <InternalShell workspace="jet" pageTitle="Tenant and organization operations" eyebrow="JET Platform · M05">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Organizations in tenant" value={org.organizations.length} icon={Building2} tone="primary" />
        <KpiCard label="Pending reference requests" value={pendingRequests.length} icon={GitPullRequestArrow} tone="warning" />
        <KpiCard label="Open JET exceptions" value={openOverrideTargets.length} icon={ShieldAlert} />
      </div>

      <section className={cn("mt-6", surfaceClass())}>
        <header className="mb-3 flex items-center gap-2">
          <Landmark className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-display text-xl">Tenant record</h2>
        </header>
        <dl className="grid gap-4 sm:grid-cols-3 text-sm">
          <div><dt className="text-eyebrow">Tenant ID</dt><dd className="font-mono">{TENANT_ID}</dd></div>
          <div><dt className="text-eyebrow">Owning organization</dt><dd>{root?.display_name ?? "—"}</dd></div>
          <div><dt className="text-eyebrow">Lifecycle</dt><dd><StatusBadge tone="sage">ACTIVE</StatusBadge></dd></div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          Prior-module (M00/protected M01) delta review lives on{" "}
          <Link to="/app/jet/platform" className="story-link text-primary">Platform Foundation (M00)</Link>.
        </p>
      </section>

      {pendingRequests.length > 0 && (
        <section className="mt-6 rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-display text-xl">Pending carrier / vendor reference requests</h2>
          </div>
          <DataTable columns={reqCols} rows={pendingRequests} getRowId={(r) => r.request_id} ariaLabel="Pending reference requests" />
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-display text-xl">All organizations</h2>
        </div>
        <DataTable columns={cols} rows={org.organizations} getRowId={(r) => r.organization_id} ariaLabel="All organizations" />
      </section>
    </InternalShell>
  );
}
