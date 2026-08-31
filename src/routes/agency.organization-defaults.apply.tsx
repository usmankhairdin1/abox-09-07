/**
 * SCR-M05-025 — Root Defaults Bulk Application.
 * Review and apply selected values to chosen downlines
 * (REQ-M05-PRF-004 / REQ-M05-OPS-011). No dynamic inheritance — this is
 * a one-time, reviewed copy, matching the spec's explicit exclusion of
 * automatic synchronization.
 */
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getDirectDownlines, getSettings, ROOT_ORGANIZATION_ID } from "@/lib/org-store";

export const Route = createFileRoute("/agency/organization-defaults/apply")({
  head: () => ({ meta: [{ title: "Apply Root Defaults — ABox" }, { name: "description", content: "Review and apply selected root values to chosen downlines." }] }),
  component: Page,
});

function Page() {
  const org = useOrgState();
  const rootSettings = getSettings(org, ROOT_ORGANIZATION_ID);
  const downlines = getDirectDownlines(org, ROOT_ORGANIZATION_ID);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selectedOrgs, setSelectedOrgs] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState(false);

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setSet(next);
  };

  const preview = useMemo(() => {
    return downlines
      .filter((d) => selectedOrgs.has(d.organization_id))
      .flatMap((d) => Array.from(selectedKeys).map((key) => {
        const rootValue = rootSettings.find((s) => s.setting_key === key)?.value_json;
        const current = getSettings(org, d.organization_id).find((s) => s.setting_key === key);
        return { org: d.display_name, orgId: d.organization_id, key, current: current ? String(current.value_json) : "(not set)", proposed: String(rootValue) };
      }));
  }, [downlines, selectedOrgs, selectedKeys, rootSettings, org]);

  const onApply = () => {
    orgStore.applyRootDefaults(Array.from(selectedKeys), Array.from(selectedOrgs), "Elena Alvarez");
    setApplied(true);
  };

  return (
    <InternalShell workspace="agency" pageTitle="Apply root defaults" eyebrow="Root Defaults Bulk Application · SCR-M05-025">
      {applied && (
        <p className="mb-4 flex items-center gap-2 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm">
          <CheckCircle2 className="h-4 w-4 text-sage" aria-hidden /> Applied {selectedKeys.size} setting(s) to {selectedOrgs.size} organization(s). See each organization's history for the change record.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">1. Select root settings</h2>
          {rootSettings.length === 0 ? (
            <p className="text-sm text-muted-foreground">The root organization has no settings to propagate yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {rootSettings.map((s) => (
                <li key={s.setting_id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedKeys.has(s.setting_key)} onChange={() => toggle(selectedKeys, setSelectedKeys, s.setting_key)} />
                    {s.setting_key.replaceAll("_", " ")}
                  </label>
                  <span className="tabular-nums text-muted-foreground">{String(s.value_json)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">2. Select target downlines</h2>
          {downlines.length === 0 ? (
            <p className="text-sm text-muted-foreground">No direct downlines yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {downlines.map((d) => (
                <li key={d.organization_id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedOrgs.has(d.organization_id)} onChange={() => toggle(selectedOrgs, setSelectedOrgs, d.organization_id)} />
                    {d.display_name}
                  </label>
                  <StatusBadge tone={d.lifecycle_status === "ACTIVE" ? "sage" : "muted"}>{d.lifecycle_status}</StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {preview.length > 0 && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">3. Review current vs. proposed</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <tr><th className="px-3 py-2">Organization</th><th className="px-3 py-2">Setting</th><th className="px-3 py-2">Current</th><th className="px-3 py-2">Proposed</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {preview.map((p) => (
                  <tr key={`${p.orgId}-${p.key}`}>
                    <td className="px-3 py-2">{p.org}</td>
                    <td className="px-3 py-2">{p.key.replaceAll("_", " ")}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.current}</td>
                    <td className="px-3 py-2 font-medium">{p.proposed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={onApply} className="mt-4 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Confirm and apply
          </button>
        </section>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        <Link to="/agency/organization-admin" className="story-link text-primary">Back to admin home</Link>
      </p>
    </InternalShell>
  );
}
