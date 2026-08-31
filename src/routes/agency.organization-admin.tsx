/**
 * SCR-M05-002 — Root Agency Administration Home.
 * Operational summary and root quick actions for the tenant-owning root
 * agency (AGENCY_ADMIN_ROOT).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Plus, ListTree, ShieldCheck, AlertTriangle, GitBranch, Upload, ListTodo, Settings2 } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { DownlineContextBanner } from "@/components/abox/downline-context-banner";
import {
  useOrgState, getDirectDownlines, getReadiness, ROOT_ORGANIZATION_ID,
  ORG_TYPE_LABEL, type Organization,
} from "@/lib/org-store";

export const Route = createFileRoute("/agency/organization-admin")({
  head: () => ({ meta: [{ title: "Root Agency Administration — ABox" }, { name: "description", content: "Operational summary and root quick actions." }] }),
  component: Page,
});

const READINESS_TONE = { READY: "sage", READY_WITH_WARNINGS: "warning", BLOCKED: "destructive", NOT_EVALUATED: "muted" } as const;

function Page() {
  const org = useOrgState();
  const downlines = getDirectDownlines(org, ROOT_ORGANIZATION_ID);
  const ready = downlines.filter((d) => getReadiness(org, d.organization_id)?.status === "READY").length;
  const blocked = downlines.filter((d) => getReadiness(org, d.organization_id)?.status === "BLOCKED").length;
  const openExceptions = downlines.reduce((sum, d) => sum + (getReadiness(org, d.organization_id)?.blocking_count ?? 0), 0);

  const cols: Column<Organization>[] = [
    { key: "name", header: "Organization", cell: (r) => (
      <Link to="/agency/organizations/$organizationId" params={{ organizationId: r.organization_id }} className="story-link font-medium text-foreground">
        {r.display_name}
      </Link>
    ) },
    { key: "type", header: "Type", cell: (r) => ORG_TYPE_LABEL[r.organization_type] },
    { key: "lifecycle", header: "Status", cell: (r) => (
      <StatusBadge tone={r.lifecycle_status === "ACTIVE" ? "sage" : r.lifecycle_status === "DRAFT" ? "muted" : "destructive"}>{r.lifecycle_status}</StatusBadge>
    ) },
    { key: "readiness", header: "Readiness", cell: (r) => {
      const rd = getReadiness(org, r.organization_id);
      return rd ? <StatusBadge tone={READINESS_TONE[rd.status]}>{rd.status.replaceAll("_", " ")}</StatusBadge> : <StatusBadge tone="muted">NOT EVALUATED</StatusBadge>;
    } },
  ];

  return (
    <InternalShell
      workspace="agency" pageTitle="Root Agency Administration" eyebrow="Organization · M05"
      actions={
        <Link to="/agency/downlines/new/identity" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" aria-hidden /> Create downline agency
        </Link>
      }
    >
      <DownlineContextBanner />

      <div className="mb-6 flex flex-wrap gap-2">
        <Link to="/agency/organization-structure" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium hover:bg-accent">
          <GitBranch className="h-3.5 w-3.5" aria-hidden /> Structure
        </Link>
        <Link to="/agency/organization-imports" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium hover:bg-accent">
          <Upload className="h-3.5 w-3.5" aria-hidden /> Import CSV
        </Link>
        <Link to="/agency/organization-defaults/apply" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium hover:bg-accent">
          <Settings2 className="h-3.5 w-3.5" aria-hidden /> Apply root defaults
        </Link>
        <Link to="/agency/organization-work" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium hover:bg-accent">
          <ListTodo className="h-3.5 w-3.5" aria-hidden /> Tasks &amp; exceptions
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Direct downlines" value={downlines.length} icon={Building2} tone="primary" />
        <KpiCard label="Ready" value={ready} icon={ShieldCheck} tone="sage" />
        <KpiCard label="Blocked" value={blocked} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Open blocking items" value={openExceptions} icon={ListTree} />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-display text-xl">Direct downlines</h2>
          <Link to="/agency/organizations" className="text-sm font-medium text-primary story-link">View full directory</Link>
        </div>
        <DataTable
          columns={cols}
          rows={downlines}
          getRowId={(r) => r.organization_id}
          ariaLabel="Direct downlines"
          empty="No direct downlines yet. Create one to get started."
        />
      </section>
    </InternalShell>
  );
}
