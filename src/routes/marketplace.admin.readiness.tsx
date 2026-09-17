/**
 * SCR-M04-016 — Marketplace Readiness.
 * Fixed readiness controls, canonical owner and next action
 * (REQ-M04-MKT-011).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, RotateCw } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { marketplaceStore, useMarketplaceState, getReadiness } from "@/lib/marketplace-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/marketplace/admin/readiness")({
  head: () => ({ meta: [{ title: "Marketplace Readiness — ABox" }, { name: "description", content: "Fixed readiness controls, canonical owner and next action." }] }),
  component: Page,
});

const RESULT_TONE = { PASS: "sage", WARNING: "warning", FAIL: "destructive", NOT_APPLICABLE: "muted" } as const;

function Page() {
  const mkt = useMarketplaceState();
  const readiness = getReadiness(mkt);

  return (
    <InternalShell
      workspace="agency" pageTitle="Marketplace readiness" eyebrow="Marketplace Readiness · SCR-M04-016"
      actions={<ActionPill variant="primaryMd" onClick={() => marketplaceStore.recalculateReadiness()}><RotateCw className="h-4 w-4" aria-hidden /> Recalculate</ActionPill>}
    >
      {readiness ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Overall status</h2></span>
            <StatusBadge tone={readiness.status === "READY" ? "sage" : readiness.status === "READY_WITH_WARNINGS" ? "warning" : readiness.status === "BLOCKED" ? "destructive" : "muted"}>{readiness.status.replaceAll("_", " ")}</StatusBadge>
          </div>
          <p className="mb-4 text-xs text-muted-foreground" suppressHydrationWarning>
            Evaluated {new Date(readiness.evaluated_at).toLocaleString()} · policy v{readiness.policy_version} · {readiness.blocking_count} blocking, {readiness.warning_count} warning
          </p>
          <ul className="divide-y divide-border">
            {readiness.items.map((item) => (
              <li key={item.readiness_item_id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{item.control_code.replaceAll("_", " ")}</p>
                  {item.next_action && <p className="text-xs text-muted-foreground">{item.next_action}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.owner_module}</span>
                  <StatusBadge tone={RESULT_TONE[item.result]}>{item.result}</StatusBadge>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Users cannot manually mark a failed control as passed — resolve it at its canonical owner, e.g.{" "}
            <Link to="/marketplace/admin/domains" className="story-link text-primary">Domains</Link>,{" "}
            <Link to="/marketplace/admin/content" className="story-link text-primary">Content</Link> or{" "}
            <Link to="/marketplace/admin/availability" className="story-link text-primary">Availability</Link>, then recalculate.
          </p>
        </section>
      ) : <p className="text-sm text-muted-foreground">Not evaluated yet.</p>}
    </InternalShell>
  );
}
