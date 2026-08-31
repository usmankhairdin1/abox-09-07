/**
 * SCR-M05-004 — Organization Directory.
 * Authorized tenant-wide directory with filters (AGENCY_ADMIN_ROOT).
 */
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { DownlineContextBanner } from "@/components/abox/downline-context-banner";
import {
  useOrgState, getReadiness, getRelationship, ROOT_ORGANIZATION_ID,
  ORG_TYPE_LABEL, type Organization, type OrganizationStatus, type OrganizationType,
} from "@/lib/org-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agency/organizations/")({
  head: () => ({ meta: [{ title: "Organization Directory — ABox" }, { name: "description", content: "Authorized tenant-wide organization directory and filters." }] }),
  component: Page,
});

const STATUS_TONE: Record<OrganizationStatus, "sage" | "muted" | "warning" | "destructive"> = {
  ACTIVE: "sage", DRAFT: "muted", SUSPENDED: "warning", ENDED: "destructive",
};

function Page() {
  const org = useOrgState();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrganizationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<OrganizationType | "all">("all");

  const filtered = useMemo(() => {
    return org.organizations.filter((o) => {
      if (search && !o.display_name.toLowerCase().includes(search.toLowerCase()) && !o.legal_name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && o.lifecycle_status !== statusFilter) return false;
      if (typeFilter !== "all" && o.organization_type !== typeFilter) return false;
      return true;
    });
  }, [org.organizations, search, statusFilter, typeFilter]);

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
    { key: "relationship", header: "Relationship", cell: (r) => {
      if (r.organization_id === ROOT_ORGANIZATION_ID) return <span className="text-muted-foreground">Tenant-owning root</span>;
      const rel = getRelationship(org, r.organization_id);
      return rel ? <StatusBadge tone={rel.status === "ACTIVE" ? "sage" : rel.status === "PENDING" ? "warning" : "muted"}>{rel.status}</StatusBadge> : "—";
    } },
    { key: "lifecycle", header: "Lifecycle", cell: (r) => <StatusBadge tone={STATUS_TONE[r.lifecycle_status]}>{r.lifecycle_status}</StatusBadge> },
    { key: "readiness", header: "Readiness", cell: (r) => {
      const rd = getReadiness(org, r.organization_id);
      if (!rd) return <span className="text-muted-foreground">—</span>;
      return <StatusBadge tone={rd.status === "READY" ? "sage" : rd.status === "READY_WITH_WARNINGS" ? "warning" : rd.status === "BLOCKED" ? "destructive" : "muted"}>{rd.status.replaceAll("_", " ")}</StatusBadge>;
    } },
  ];

  return (
    <InternalShell workspace="agency" pageTitle="Organization directory" eyebrow="Organization · M05">
      <DownlineContextBanner />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search organizations"
          />
        </div>
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrganizationStatus | "all")}
          className="h-10 rounded-full border border-border bg-card px-3 text-sm"
          aria-label="Filter by lifecycle status"
        >
          <option value="all">All statuses</option>
          {(["DRAFT", "ACTIVE", "SUSPENDED", "ENDED"] as const).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as OrganizationType | "all")}
          className="h-10 rounded-full border border-border bg-card px-3 text-sm"
          aria-label="Filter by organization type"
        >
          <option value="all">All types</option>
          {(Object.keys(ORG_TYPE_LABEL) as OrganizationType[]).map((t) => <option key={t} value={t}>{ORG_TYPE_LABEL[t]}</option>)}
        </select>
        {(search || statusFilter !== "all" || typeFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}
            className={cn("text-xs text-muted-foreground hover:text-foreground")}
          >
            Clear filters
          </button>
        )}
      </div>

      <DataTable
        columns={cols}
        rows={filtered}
        getRowId={(r) => r.organization_id}
        ariaLabel="Organization directory"
        empty="No organizations match those filters."
      />
    </InternalShell>
  );
}
