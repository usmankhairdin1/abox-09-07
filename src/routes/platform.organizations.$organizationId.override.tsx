/**
 * SCR-M05-030 — JET Override and Reconciliation.
 * Reason-coded override and propagation reconciliation (JET_PLATFORM_ADMIN).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert, RotateCw } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import {
  orgStore, useOrgState, getOrganization, getOverrides, getTasks,
} from "@/lib/org-store";
import { ACTION_PILL } from "@/components/abox/action-pill";

export const Route = createFileRoute("/platform/organizations/$organizationId/override")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `JET Override — ${params.organizationId} — ABox` }] }),
  component: Page,
});

const REASON_CODES = [
  "DATA_CORRECTION", "SECURITY_INCIDENT", "COMPLIANCE_HOLD", "DUPLICATE_RESOLUTION", "EMERGENCY_SUPPORT",
] as const;
const OVERRIDABLE_FIELDS = ["legal_name", "display_name", "time_zone", "default_language", "lifecycle_status"] as const;

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const overrides = getOverrides(org, organizationId);
  const propagationTasks = getTasks(org, organizationId).filter((t) => t.task_type === "PROPAGATION_FAILURE");

  const [field, setField] = useState<(typeof OVERRIDABLE_FIELDS)[number]>("display_name");
  const [afterValue, setAfterValue] = useState("");
  const [reasonCode, setReasonCode] = useState<(typeof REASON_CODES)[number]>("DATA_CORRECTION");
  const [reason, setReason] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitted, setSubmitted] = useState(false);

  if (!record) {
    return (
      <InternalShell workspace="jet" pageTitle="Organization not found" eyebrow="JET Override · M05">
        <p>That organization doesn't exist in this session. <Link to="/platform/organizations" className="story-link text-primary">Back to operations</Link></p>
      </InternalShell>
    );
  }

  const beforeValue = String(record[field]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!afterValue.trim() || !reason.trim()) return;
    orgStore.addOverride({
      override_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, actor: "JET Platform Admin",
      authority: "JET", target_field: field, before_value: beforeValue, after_value: afterValue,
      reason_code: reasonCode, reason, effective_date: effectiveDate, created_at: new Date().toISOString(),
    });
    orgStore.updateOrganization(organizationId, { [field]: afterValue } as Record<string, string>);
    orgStore.addHistory({
      history_id: crypto.randomUUID().slice(0, 8), organization_id: organizationId, when: new Date().toISOString(),
      actor: "JET Platform Admin", summary: `JET override: ${field} "${beforeValue}" → "${afterValue}" (${reasonCode}). ${reason}`,
    });
    setAfterValue(""); setReason(""); setSubmitted(true);
  };

  return (
    <InternalShell workspace="jet" pageTitle={`Override — ${record.display_name}`} eyebrow="JET Override and Reconciliation · SCR-M05-030">
      <Link to="/platform/organizations" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to operations
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-display text-xl">Issue a reason-coded override</h2>
          </header>
          {submitted && (
            <p className="mb-3 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm">Override applied and recorded in history.</p>
          )}
          <form onSubmit={onSubmit} className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-eyebrow">Target field</label>
              <select value={field} onChange={(e) => setField(e.target.value as typeof field)} className="h-10 w-full rounded-lg border border-border bg-background px-3">
                {OVERRIDABLE_FIELDS.map((f) => <option key={f} value={f}>{f.replaceAll("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Current value</label>
              <input value={beforeValue} disabled className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-muted-foreground" />
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">New value</label>
              <input value={afterValue} onChange={(e) => setAfterValue(e.target.value)} required className="h-10 w-full rounded-lg border border-border bg-background px-3" />
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Reason code</label>
              <select value={reasonCode} onChange={(e) => setReasonCode(e.target.value as typeof reasonCode)} className="h-10 w-full rounded-lg border border-border bg-background px-3">
                {REASON_CODES.map((r) => <option key={r} value={r}>{r.replaceAll("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Explanation</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} className="w-full rounded-lg border border-border bg-background p-3" />
            </div>
            <div>
              <label className="mb-1 block text-eyebrow">Effective date</label>
              <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} required className="h-10 w-full rounded-lg border border-border bg-background px-3" />
            </div>
            <button type="submit" className={ACTION_PILL.primaryLg}>
              Apply override
            </button>
          </form>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <header className="mb-3 flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-display text-xl">Propagation reconciliation</h2>
            </header>
            {propagationTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No propagation issues for this organization.</p>
            ) : (
              <ul className="space-y-3">
                {propagationTasks.map((t) => (
                  <li key={t.task_id} className="rounded-xl border border-border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p>{t.description}</p>
                      <StatusBadge tone={t.status === "OPEN" ? "destructive" : "sage"}>{t.status}</StatusBadge>
                    </div>
                    {t.status === "OPEN" && (
                      <button
                        onClick={() => orgStore.resolveTask(t.task_id, "Retried propagation; downstream reconciled.")}
                        className="mt-2 inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium hover:bg-accent"
                      >
                        <RotateCw className="h-3.5 w-3.5" aria-hidden /> Retry and reconcile
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <header className="mb-3">
              <h2 className="text-display text-xl">Override history</h2>
            </header>
            {overrides.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overrides recorded for this organization.</p>
            ) : (
              <ol className="divide-y divide-border">
                {overrides.map((o) => (
                  <li key={o.override_id} className="py-3 text-sm">
                    <p className="font-medium">{o.target_field.replaceAll("_", " ")}: "{o.before_value}" → "{o.after_value}"</p>
                    <p className="text-xs text-muted-foreground">{o.reason_code.replaceAll("_", " ")} · {o.reason} · effective {o.effective_date}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </InternalShell>
  );
}
