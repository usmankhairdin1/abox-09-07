/**
 * SCR-M05-019 — Organization External Identifiers.
 * Masked identifier and verification history (REQ-M05-PRF-012/013).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Fingerprint, Plus, CheckCircle2, XCircle } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getOrganization, getIdentifiers, type IdentifierType } from "@/lib/org-store";
import { ACTION_PILL } from "@/components/abox/action-pill";

export const Route = createFileRoute("/agency/organizations/$organizationId/identifiers")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `Identifiers — ${params.organizationId} — ABox` }] }),
  component: Page,
});

const TYPES: IdentifierType[] = ["EIN", "AGENCY_NPN", "NAIC_CARRIER_CODE", "JET_CUSTOMER_CODE", "VENDOR_REFERENCE", "PARTNER_REFERENCE", "EXTERNAL_ORGANIZATION_CODE"];

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const identifiers = getIdentifiers(org, organizationId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ identifier_type: "EIN" as IdentifierType, value: "" });

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Identifiers · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.value.trim().length < 4) return;
    orgStore.addIdentifier({
      identifier_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, identifier_type: form.identifier_type,
      masked_value: `••••${form.value.trim().slice(-4)}`, source: "Root intake", verification_status: "PENDING_VERIFICATION",
      effective_from: new Date().toISOString(),
    });
    orgStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Submitted ${form.identifier_type.replaceAll("_", " ")} for verification.` });
    orgStore.recalculateReadiness(organizationId);
    setForm({ identifier_type: "EIN", value: "" });
    setShowForm(false);
  };

  const verify = (id: string, ok: boolean) => {
    orgStore.updateIdentifier(id, { verification_status: ok ? "VERIFIED" : "REJECTED", verified_at: ok ? new Date().toISOString() : undefined });
    orgStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Identifier ${ok ? "verified" : "rejected"}.` });
    orgStore.recalculateReadiness(organizationId);
  };

  return (
    <InternalShell
      workspace="agency" pageTitle={`External identifiers — ${record.display_name}`} eyebrow="External Identifiers · SCR-M05-019"
      actions={
        <button onClick={() => setShowForm((v) => !v)} className={ACTION_PILL.primaryMd}>
          <Plus className="h-4 w-4" aria-hidden /> Add identifier
        </button>
      }
    >
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      {showForm && (
        <form onSubmit={onSubmit} className="mb-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-eyebrow">Identifier type</label>
            <select value={form.identifier_type} onChange={(e) => setForm({ ...form, identifier_type: e.target.value as IdentifierType })} className="h-10 w-full rounded-lg border border-border bg-background px-3">
              {TYPES.map((t) => <option key={t} value={t}>{t.replaceAll("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Value</label>
            <input required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" placeholder="Only the last 4 characters are retained on screen" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Submit for verification</button>
          </div>
        </form>
      )}

      {identifiers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No identifiers on file.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {identifiers.map((i) => (
            <li key={i.identifier_id} className="rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 font-medium"><Fingerprint className="h-3.5 w-3.5 text-muted-foreground" /> {i.identifier_type.replaceAll("_", " ")}</p>
                <StatusBadge tone={i.verification_status === "VERIFIED" ? "sage" : i.verification_status === "PENDING_VERIFICATION" ? "warning" : i.verification_status === "REJECTED" ? "destructive" : "muted"}>
                  {i.verification_status.replaceAll("_", " ")}
                </StatusBadge>
              </div>
              <p className="font-mono text-xs text-muted-foreground">{i.masked_value}</p>
              <p className="text-xs text-muted-foreground">Source: {i.source}</p>
              {i.verification_status === "PENDING_VERIFICATION" && (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => verify(i.identifier_id, true)} className={ACTION_PILL.outlineXs}>
                    <CheckCircle2 className="h-3.5 w-3.5 text-sage" aria-hidden /> Mark verified
                  </button>
                  <button onClick={() => verify(i.identifier_id, false)} className={ACTION_PILL.outlineXs}>
                    <XCircle className="h-3.5 w-3.5 text-destructive" aria-hidden /> Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </InternalShell>
  );
}
