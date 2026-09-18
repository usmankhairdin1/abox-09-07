/**
 * SCR-M04-026 — JET Marketplace Override and Reconciliation.
 * Reason-coded JET override, route intervention and propagation
 * reconciliation (JET_PLATFORM_ADMIN).
 */
import { surfaceClass } from "@/components/abox/surface";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert, RotateCw } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import {
  marketplaceStore, useMarketplaceState, getMarketplace, getOverrides, getTasks, getActiveBrand,
} from "@/lib/marketplace-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/platform/marketplaces/$marketplaceId/override")({
  loader: ({ params }) => ({ marketplaceId: params.marketplaceId }),
  head: ({ params }) => ({ meta: [{ title: `JET Override — ${params.marketplaceId} — ABox` }] }),
  component: Page,
});

const REASON_CODES = ["DATA_CORRECTION", "SECURITY_INCIDENT", "COMPLIANCE_HOLD", "LEGAL_BLOCK", "EMERGENCY_SUPPORT"] as const;
const TARGETS = ["display_name", "primary_color", "accent_color", "lifecycle_status"] as const;

function Page() {
  const mkt = useMarketplaceState();
  const marketplace = getMarketplace(mkt);
  const brand = getActiveBrand(mkt);
  const overrides = getOverrides(mkt);
  const propagationTasks = getTasks(mkt).filter((t) => t.task_type === "PROPAGATION_FAILURE");

  const [target, setTarget] = useState<(typeof TARGETS)[number]>("display_name");
  const [afterValue, setAfterValue] = useState("");
  const [reasonCode, setReasonCode] = useState<(typeof REASON_CODES)[number]>("DATA_CORRECTION");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const beforeValue = target === "lifecycle_status" ? marketplace.lifecycle_status : String(brand?.[target as keyof typeof brand] ?? "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!afterValue.trim() || !reason.trim()) return;
    marketplaceStore.addOverride({
      override_id: crypto.randomUUID().slice(0, 8), marketplace_id: marketplace.marketplace_id, actor: "JET Platform Admin",
      reason_code: reasonCode, reason, target, before_value: beforeValue, after_value: afterValue, created_at: new Date().toISOString(),
    });
    if (target === "lifecycle_status") {
      marketplaceStore.updateMarketplace({ lifecycle_status: afterValue as typeof marketplace.lifecycle_status });
    } else if (brand) {
      marketplaceStore.updateBrand(brand.brand_id, { [target]: afterValue } as Record<string, string>);
    }
    marketplaceStore.addHistory({
      history_id: crypto.randomUUID().slice(0, 8), marketplace_id: marketplace.marketplace_id, when: new Date().toISOString(),
      actor: "JET Platform Admin", summary: `JET override: ${target} "${beforeValue}" → "${afterValue}" (${reasonCode}). ${reason}`,
    });
    setAfterValue(""); setReason(""); setSubmitted(true);
  };

  return (
    <InternalShell workspace="jet" pageTitle="Marketplace override" eyebrow="JET Override and Reconciliation · SCR-M04-026">
      <Link to="/platform/marketplaces" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to operations
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={surfaceClass()}>
          <header className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-display text-xl">Issue a reason-coded override</h2>
          </header>
          {submitted && <p className="mb-3 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm">Override applied and recorded in history.</p>}
          <form onSubmit={onSubmit} className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-eyebrow">Target field</label>
              <select value={target} onChange={(e) => setTarget(e.target.value as typeof target)} className="h-10 w-full rounded-lg border border-border bg-background px-3">
                {TARGETS.map((t) => <option key={t} value={t}>{t.replaceAll("_", " ")}</option>)}
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
            <ActionPill type="submit" variant="primaryLg">
              Apply override
            </ActionPill>
          </form>
        </section>

        <div className="space-y-6">
          <section className={surfaceClass()}>
            <header className="mb-3 flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-display text-xl">Propagation reconciliation</h2>
            </header>
            {propagationTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No propagation issues for this marketplace.</p>
            ) : (
              <ul className="space-y-3">
                {propagationTasks.map((t) => (
                  <li key={t.task_id} className="rounded-xl border border-border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p>{t.description}</p>
                      <StatusBadge tone={t.status === "OPEN" ? "destructive" : "sage"}>{t.status}</StatusBadge>
                    </div>
                    {t.status === "OPEN" && (
                      <button onClick={() => marketplaceStore.resolveTask(t.task_id, "Retried propagation; downstream reconciled.")} className="mt-2 inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium hover:bg-accent">
                        <RotateCw className="h-3.5 w-3.5" aria-hidden /> Retry and reconcile
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={surfaceClass()}>
            <header className="mb-3"><h2 className="text-display text-xl">Override history</h2></header>
            {overrides.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overrides recorded.</p>
            ) : (
              <ol className="divide-y divide-border">
                {overrides.map((o) => (
                  <li key={o.override_id} className="py-3 text-sm">
                    <p className="font-medium">{o.target.replaceAll("_", " ")}: "{o.before_value}" → "{o.after_value}"</p>
                    <p className="text-xs text-muted-foreground">{o.reason_code.replaceAll("_", " ")} · {o.reason}</p>
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
