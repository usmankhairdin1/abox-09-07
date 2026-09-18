/**
 * SCR-M05-018 — Organization Addresses and Offices.
 * One headquarters, one mailing (defaults to HQ), optional offices —
 * United States only (REQ-M05-PRF-008/009).
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getOrganization, getAddresses, COUNTRY_NAME, type LocationType } from "@/lib/org-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/organizations/$organizationId/locations")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `Addresses — ${params.organizationId} — ABox` }] }),
  component: Page,
});

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const addresses = getAddresses(org, organizationId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ location_type: "OFFICE" as LocationType, line_1: "", line_2: "", city: "", state_code: "", postal_code: "" });
  const hasHq = addresses.some((a) => a.location_type === "HEADQUARTERS");

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Addresses · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.line_1.trim() || !form.city.trim() || !form.state_code.trim() || !form.postal_code.trim()) return;
    orgStore.addAddress({
      address_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, location_type: form.location_type,
      line_1: form.line_1, line_2: form.line_2 || undefined, city: form.city, state_code: form.state_code.toUpperCase(),
      postal_code: form.postal_code, country_code: 840, validated_status: "UNVERIFIED", effective_from: new Date().toISOString(),
    });
    orgStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Added ${form.location_type.toLowerCase()} address at ${form.line_1}.` });
    orgStore.recalculateReadiness(organizationId);
    setForm({ location_type: "OFFICE", line_1: "", line_2: "", city: "", state_code: "", postal_code: "" });
    setShowForm(false);
  };

  return (
    <InternalShell
      workspace="agency" pageTitle={`Addresses — ${record.display_name}`} eyebrow="Addresses and Offices · SCR-M05-018"
      actions={
        <ActionPill onClick={() => setShowForm((v) => !v)} variant="primaryMd">
          <Plus className="h-4 w-4" aria-hidden /> Add address
        </ActionPill>
      }
    >
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      {showForm && (
        <form onSubmit={onSubmit} className={cn("mb-6 grid gap-4", surfaceClass(), "sm:grid-cols-2")}>
          <div>
            <label className="mb-1 block text-eyebrow">Location type</label>
            <select value={form.location_type} onChange={(e) => setForm({ ...form, location_type: e.target.value as LocationType })} className="h-10 w-full rounded-lg border border-border bg-background px-3">
              {(!hasHq ? ["HEADQUARTERS", "MAILING", "OFFICE"] : ["MAILING", "OFFICE"]).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Line 1</label>
            <input required value={form.line_1} onChange={(e) => setForm({ ...form, line_1: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Line 2 (optional)</label>
            <input value={form.line_2} onChange={(e) => setForm({ ...form, line_2: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">City</label>
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">State</label>
            <input required maxLength={2} value={form.state_code} onChange={(e) => setForm({ ...form, state_code: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Postal code</label>
            <input required value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save address</button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No addresses on file.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.address_id} className="rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 font-medium"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {a.line_1}</p>
                <StatusBadge tone="muted">{a.location_type}</StatusBadge>
              </div>
              {a.line_2 && <p className="text-xs text-muted-foreground">{a.line_2}</p>}
              <p className="text-xs text-muted-foreground">{a.city}, {a.state_code} {a.postal_code} · {COUNTRY_NAME[a.country_code] ?? a.country_code}</p>
              <p className="mt-1 text-xs"><StatusBadge tone={a.validated_status === "VERIFIED" ? "sage" : "warning"}>{a.validated_status.replaceAll("_", " ")}</StatusBadge></p>
            </li>
          ))}
        </ul>
      )}
    </InternalShell>
  );
}
