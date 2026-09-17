/**
 * SCR-M05-017 — Organization Contacts.
 * Fixed contact roles and visibility (REQ-M05-PRF-006/007).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, Plus } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getOrganization, getContacts, type ContactRole, type Language } from "@/lib/org-store";
import { ACTION_PILL } from "@/components/abox/action-pill";

export const Route = createFileRoute("/agency/organizations/$organizationId/contacts")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `Contacts — ${params.organizationId} — ABox` }] }),
  component: Page,
});

const ROLES: ContactRole[] = ["PRIMARY_BUSINESS", "OPERATIONS", "SUPPORT", "COMPLIANCE"];

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const contacts = getContacts(org, organizationId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ contact_role: "OPERATIONS" as ContactRole, name: "", job_title: "", email: "", telephone: "", preferred_language: "EN" as Language });

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Contacts · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.telephone.trim()) return;
    orgStore.addContact({
      contact_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, contact_role: form.contact_role,
      name: form.name, job_title: form.job_title || undefined, email: form.email, telephone: form.telephone,
      preferred_language: form.preferred_language, effective_from: new Date().toISOString(),
    });
    orgStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Added ${form.contact_role.replaceAll("_", " ")} contact ${form.name}.` });
    orgStore.recalculateReadiness(organizationId);
    setForm({ contact_role: "OPERATIONS", name: "", job_title: "", email: "", telephone: "", preferred_language: "EN" });
    setShowForm(false);
  };

  return (
    <InternalShell
      workspace="agency" pageTitle={`Contacts — ${record.display_name}`} eyebrow="Organization Contacts · SCR-M05-017"
      actions={
        <button onClick={() => setShowForm((v) => !v)} className={ACTION_PILL.primaryMd}>
          <Plus className="h-4 w-4" aria-hidden /> Add contact
        </button>
      }
    >
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      {showForm && (
        <form onSubmit={onSubmit} className="mb-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-eyebrow">Role</label>
            <select value={form.contact_role} onChange={(e) => setForm({ ...form, contact_role: e.target.value as ContactRole })} className="h-10 w-full rounded-lg border border-border bg-background px-3">
              {ROLES.map((r) => <option key={r} value={r}>{r.replaceAll("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Preferred language</label>
            <select value={form.preferred_language} onChange={(e) => setForm({ ...form, preferred_language: e.target.value as Language })} className="h-10 w-full rounded-lg border border-border bg-background px-3">
              <option value="EN">English</option><option value="ES">Español</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Job title (optional)</label>
            <input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Telephone</label>
            <input required value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save contact</button>
          </div>
        </form>
      )}

      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No contacts on file.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {contacts.map((c) => (
            <li key={c.contact_id} className="rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{c.name}</p>
                <StatusBadge tone="muted">{c.contact_role.replaceAll("_", " ")}</StatusBadge>
              </div>
              {c.job_title && <p className="text-xs text-muted-foreground">{c.job_title}</p>}
              <p className="mt-1 flex items-center gap-1.5 text-xs"><Mail className="h-3 w-3" /> {c.email}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3" /> {c.telephone}</p>
              <p className="mt-1 text-xs text-muted-foreground">Preferred language: {c.preferred_language === "EN" ? "English" : "Español"}</p>
            </li>
          ))}
        </ul>
      )}
    </InternalShell>
  );
}
