/**
 * SCR-M05-021 — Organization Relationship History.
 * Effective relationship evidence (REQ-M05-REL-006/009).
 */
import { surfaceClass } from "@/components/abox/surface";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, GitBranch } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { useOrgState, getOrganization, getRelationshipHistory, ROOT_ORGANIZATION_ID } from "@/lib/org-store";

export const Route = createFileRoute("/agency/organizations/$organizationId/relationships")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `Relationships — ${params.organizationId} — ABox` }] }),
  component: Page,
});

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const relationships = getRelationshipHistory(org, organizationId);
  const root = getOrganization(org, ROOT_ORGANIZATION_ID);

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Relationships · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  return (
    <InternalShell workspace="agency" pageTitle={`Relationships — ${record.display_name}`} eyebrow="Relationship History · SCR-M05-021">
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <section className={surfaceClass()}>
        <header className="mb-3 flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-display text-xl">PARENT_OF relationship evidence</h2>
        </header>
        {relationships.length === 0 ? (
          <p className="text-sm text-muted-foreground">No relationship history — this organization is the tenant-owning root.</p>
        ) : (
          <ol className="divide-y divide-border">
            {relationships.map((r) => (
              <li key={r.relationship_id} className="grid gap-2 py-3 text-sm sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-medium">Direct downline of {root?.display_name ?? r.parent_organization_id}</p>
                  <p className="text-xs text-muted-foreground">
                    Effective {new Date(r.effective_from).toLocaleDateString()}
                    {r.effective_to ? ` – ${new Date(r.effective_to).toLocaleDateString()}` : " – present"} · v{r.version}
                  </p>
                </div>
                <StatusBadge tone={r.status === "ACTIVE" ? "sage" : r.status === "PENDING" ? "warning" : "muted"}>{r.status}</StatusBadge>
              </li>
            ))}
          </ol>
        )}
      </section>
    </InternalShell>
  );
}
