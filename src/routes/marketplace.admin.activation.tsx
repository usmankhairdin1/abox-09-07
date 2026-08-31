/**
 * SCR-M04-020 — Initial Activation Submission.
 * Submit first production release to JET and review status
 * (REQ-M04-MKT-012 / REQ-M04-ADM-011).
 */
import { createFileRoute } from "@tanstack/react-router";
import { Send, CheckCircle2, Clock } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { marketplaceStore, useMarketplaceState, getMarketplace, getReadiness, getTasks } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/activation")({
  head: () => ({ meta: [{ title: "Initial Activation — ABox" }, { name: "description", content: "Submit first production release to JET and review status." }] }),
  component: Page,
});

function Page() {
  const mkt = useMarketplaceState();
  const marketplace = getMarketplace(mkt);
  const readiness = getReadiness(mkt);
  const pendingSubmission = getTasks(mkt).find((t) => t.task_type === "UNAPPROVED_DELTA" && t.status === "OPEN");
  const canSubmit = readiness?.status === "READY" || readiness?.status === "READY_WITH_WARNINGS";

  if (marketplace.lifecycle_status === "ACTIVE") {
    return (
      <InternalShell workspace="agency" pageTitle="Initial activation" eyebrow="Initial Activation Submission · SCR-M04-020">
        <p className="flex items-center gap-2 rounded-2xl border border-sage/40 bg-sage-soft/40 p-5 text-sm">
          <CheckCircle2 className="h-4 w-4 text-sage" aria-hidden /> This marketplace has already completed initial production activation.
        </p>
      </InternalShell>
    );
  }

  return (
    <InternalShell workspace="agency" pageTitle="Initial activation submission" eyebrow="Initial Activation Submission · SCR-M04-020">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-display mb-3 text-xl">Submit for JET review</h2>
        <p className="text-sm text-muted-foreground">
          JET activates only after confirming readiness, commercial entitlement, route, bilingual and legal content, product and geography readiness, support ownership, security and required M00/M05/M01 delta disposition.
        </p>

        {readiness && (
          <div className={`mt-4 rounded-xl border p-3 text-sm ${canSubmit ? "border-sage/40 bg-sage-soft/40" : "border-destructive/30 bg-destructive/5"}`}>
            <StatusBadge tone={canSubmit ? "sage" : "destructive"}>{readiness.status.replaceAll("_", " ")}</StatusBadge>
            {!canSubmit && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {readiness.items.filter((i) => i.result === "FAIL").map((i) => <li key={i.readiness_item_id}>{i.next_action}</li>)}
              </ul>
            )}
          </div>
        )}

        {pendingSubmission ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-warning/40 bg-warning/5 p-3 text-sm">
            <Clock className="h-4 w-4 text-warning" aria-hidden /> Submitted — pending JET review.
            <button
              onClick={() => { marketplaceStore.resolveTask(pendingSubmission.task_id, "JET approved initial activation."); marketplaceStore.approveInitialActivation("JET Platform Admin"); }}
              className="story-link ml-auto text-primary"
            >
              Simulate JET approval
            </button>
          </div>
        ) : (
          <button
            onClick={() => marketplaceStore.submitInitialActivation("Elena Alvarez")} disabled={!canSubmit}
            className="mt-5 inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden /> Submit to JET
          </button>
        )}
      </section>
    </InternalShell>
  );
}
