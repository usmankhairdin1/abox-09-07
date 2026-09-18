/**
 * SCR-M05-029 — Reference Organization Request.
 * Root directly creates tenant-scoped EMPLOYER/PARTNER references;
 * CARRIER/VENDOR references are JET-controlled and go through a request
 * queue to prevent competing identities (REQ-M05-PRF-015/016/017).
 */
import { surfaceClass } from "@/components/abox/surface";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, TENANT_ID, ORG_TYPE_LABEL, type ReferenceOrgType } from "@/lib/org-store";

export const Route = createFileRoute("/agency/reference-organizations/request")({
  head: () => ({ meta: [{ title: "Reference Organization Request — ABox" }, { name: "description", content: "Carrier and vendor reference request." }] }),
  component: Page,
});

const DIRECT_TYPES: ReferenceOrgType[] = ["EMPLOYER", "PARTNER"];
const JET_TYPES: ReferenceOrgType[] = ["CARRIER", "VENDOR"];

function Page() {
  const org = useOrgState();
  const [type, setType] = useState<ReferenceOrgType>("EMPLOYER");
  const [name, setName] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const isDirect = DIRECT_TYPES.includes(type);
  const myRequests = org.referenceRequests.filter((r) => r.requested_by === "Elena Alvarez");
  const referenceOrgs = org.organizations.filter((o) => o.organization_type === "EMPLOYER" || o.organization_type === "PARTNER" || o.organization_type === "CARRIER" || o.organization_type === "VENDOR");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isDirect) {
      const organization_id = `org-${crypto.randomUUID().slice(0, 8)}`;
      orgStore.addOrganization({
        organization_id, tenant_id: TENANT_ID, reference_code: `ORG-${1000 + Math.floor(Math.random() * 8999)}`,
        organization_type: type, legal_name: name, display_name: name, lifecycle_status: "ACTIVE",
        time_zone: "America/New_York", default_language: "EN", version: 1,
      });
      orgStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), organization_id, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Created as a tenant-scoped ${ORG_TYPE_LABEL[type]} reference organization.` });
      setResult(`${name} created as a ${ORG_TYPE_LABEL[type]} reference. No access, workspace or commercial activation was granted.`);
    } else {
      orgStore.addReferenceRequest({
        request_id: crypto.randomUUID().slice(0, 8), tenant_id: TENANT_ID, requested_type: type, name,
        requested_by: "Elena Alvarez", status: "PENDING", created_at: new Date().toISOString(),
      });
      setResult(`Request submitted to JET to link or create "${name}" as a ${ORG_TYPE_LABEL[type]} reference.`);
    }
    setName("");
  };

  return (
    <InternalShell workspace="agency" pageTitle="Reference organization request" eyebrow="Reference Organization Request · SCR-M05-029">
      {result && <p className="mb-4 flex items-center gap-2 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm"><CheckCircle2 className="h-4 w-4 text-sage" aria-hidden /> {result}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={surfaceClass()}>
          <h2 className="text-display mb-3 text-xl">Request a reference organization</h2>
          <form onSubmit={onSubmit} className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-eyebrow">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as ReferenceOrgType)} className="h-10 w-full rounded-lg border border-border bg-background px-3">
                {[...DIRECT_TYPES, ...JET_TYPES].map((t) => <option key={t} value={t}>{ORG_TYPE_LABEL[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Organization name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
            </div>
            <p className="text-xs text-muted-foreground">
              {isDirect
                ? "Employer and partner references are created directly and remain tenant-scoped. Creating a reference grants no access, route or transaction authority."
                : "Carrier and vendor references are JET-controlled. Your request will link to an existing reference or create a new one to prevent duplicate identities."}
            </p>
            <button type="submit" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              {isDirect ? "Create reference" : "Submit request to JET"}
            </button>
          </form>
        </section>

        <div className="space-y-6">
          {myRequests.length > 0 && (
            <section className={surfaceClass()}>
              <h2 className="text-display mb-3 text-xl">Your carrier/vendor requests</h2>
              <ul className="space-y-2 text-sm">
                {myRequests.map((r) => (
                  <li key={r.request_id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                    <span className="flex items-center gap-1.5">{r.status === "PENDING" && <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />} {r.name}</span>
                    <StatusBadge tone={r.status === "PENDING" ? "warning" : r.status === "REJECTED" ? "destructive" : "sage"}>{r.status}</StatusBadge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className={surfaceClass()}>
            <h2 className="text-display mb-3 text-xl">Existing reference organizations</h2>
            {referenceOrgs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reference organizations yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {referenceOrgs.map((o) => (
                  <li key={o.organization_id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                    <Link to="/agency/organizations/$organizationId" params={{ organizationId: o.organization_id }} className="story-link text-foreground">{o.display_name}</Link>
                    <StatusBadge tone="muted">{ORG_TYPE_LABEL[o.organization_type]}</StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </InternalShell>
  );
}
