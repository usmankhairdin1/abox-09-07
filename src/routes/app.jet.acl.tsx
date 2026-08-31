/**
 * SCR_JET_ACL
 */
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_ACL_ROLES, type SampleAclRole } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/acl")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_ACL.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_ACL.purpose }] }),
  component: Page,
});

function Page() {
  const cols: Column<SampleAclRole>[] = [
    { key: "name", header: "Role", cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.id}</p>
      </div>
    )},
    { key: "scope", header: "Scope", cell: (r) => <StatusBadge tone={r.scope === "global" ? "primary" : r.scope === "agency" ? "info" : "muted"}>{r.scope}</StatusBadge> },
    { key: "users", header: "Users", align: "right", cell: (r) => r.users },
    { key: "perms", header: "Permissions", cell: (r) => <code className="text-xs">{r.permissions.join(", ")}</code> },
    { key: "guard", header: "Guardrails", align: "right", cell: (r) => (
      <StatusBadge tone={r.guardrails > 0 ? "warning" : "muted"}>{r.guardrails}</StatusBadge>
    )},
  ];
  return (
    <InternalShell workspace="jet" pageTitle="ACL & roles" eyebrow="Governance">
      <div className="mb-4 rounded-2xl border border-info/30 bg-info/5 p-4 text-sm">
        <p className="font-medium">Guardrails prevent role escalation.</p>
        <p className="text-muted-foreground">Warnings appear here when a role change would grant access above the actor's own permissions.</p>
      </div>
      <DataTable columns={cols} rows={SAMPLE_ACL_ROLES} getRowId={(r) => r.id} ariaLabel="ACL roles" />
    </InternalShell>
  );
}
