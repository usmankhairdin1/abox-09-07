/**
 * SCR-M05-020 — Organization Settings.
 * Downline-owned values and root overrides (REQ-M05-PRF-003/004/005).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Settings2, Plus } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getOrganization, getSettings, ROOT_ORGANIZATION_ID } from "@/lib/org-store";

export const Route = createFileRoute("/agency/organizations/$organizationId/settings")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `Settings — ${params.organizationId} — ABox` }] }),
  component: Page,
});

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const settings = getSettings(org, organizationId);
  const isRoot = organizationId === ROOT_ORGANIZATION_ID;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Settings · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  const save = (settingId: string) => {
    orgStore.updateSetting(settingId, { value_json: draft, source: isRoot ? "ROOT_DEFAULT" : "ROOT_OVERRIDE", overridden_by_scope: isRoot ? undefined : "Elena Alvarez (root)" });
    orgStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Updated setting value${isRoot ? "" : " (root override)"}.` });
    setEditingId(null);
  };

  const addSetting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    orgStore.addSetting({
      setting_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, setting_key: newKey.trim(),
      value_json: newValue, source: isRoot ? "ROOT_DEFAULT" : "DOWNLINE_OVERRIDE", effective_from: new Date().toISOString(), version: 1,
    });
    orgStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Added setting ${newKey}.` });
    setNewKey(""); setNewValue(""); setShowForm(false);
  };

  return (
    <InternalShell
      workspace="agency" pageTitle={`Settings — ${record.display_name}`} eyebrow="Organization Settings · SCR-M05-020"
      actions={
        <button onClick={() => setShowForm((v) => !v)} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" aria-hidden /> Add setting
        </button>
      }
    >
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      {showForm && (
        <form onSubmit={addSetting} className="mb-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-eyebrow">Setting key</label>
            <input required value={newKey} onChange={(e) => setNewKey(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3" placeholder="e.g. quote_expiration_days" />
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Value</label>
            <input required value={newValue} onChange={(e) => setNewValue(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save</button>
          </div>
        </form>
      )}

      <section className="rounded-2xl border border-border bg-card p-5">
        <header className="mb-3 flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-display text-xl">Settings</h2>
        </header>
        {settings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No settings on file.</p>
        ) : (
          <ul className="divide-y divide-border">
            {settings.map((s) => (
              <li key={s.setting_id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <span className="font-medium">{s.setting_key.replaceAll("_", " ")}</span>
                {editingId === s.setting_id ? (
                  <span className="flex items-center gap-2">
                    <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} className="h-9 w-40 rounded-lg border border-border bg-background px-2" />
                    <button onClick={() => save(s.setting_id)} className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">Save</button>
                    <button onClick={() => setEditingId(null)} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">Cancel</button>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 tabular-nums">
                    {String(s.value_json)}
                    <StatusBadge tone={s.source === "JET_OVERRIDE" ? "destructive" : s.source === "ROOT_OVERRIDE" ? "warning" : "muted"}>{s.source.replaceAll("_", " ")}</StatusBadge>
                    <button onClick={() => { setEditingId(s.setting_id); setDraft(String(s.value_json)); }} className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-accent">
                      {isRoot ? "Edit" : "Override"}
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {!isRoot && (
        <p className="mt-4 text-xs text-muted-foreground">
          Prefer applying values consistently across downlines? Use{" "}
          <Link to="/agency/organization-defaults/apply" className="story-link text-primary">Apply root defaults</Link>.
        </p>
      )}
    </InternalShell>
  );
}
