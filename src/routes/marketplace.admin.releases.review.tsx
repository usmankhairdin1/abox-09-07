/**
 * SCR-M04-019 — Publication Review.
 * Coordinated release scope, continuity, blockers and approval level
 * (REQ-M04-ADM-010/012).
 */
import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { CheckCircle2, Calendar } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import {
  marketplaceStore, useMarketplaceState, getDraftBrand, getDraftContent, getMarketplace, getReadiness,
} from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/releases/review")({
  head: () => ({ meta: [{ title: "Publication Review — ABox" }, { name: "description", content: "Coordinated release scope, continuity, blockers and approval level." }] }),
  component: Page,
});

function Page() {
  const mkt = useMarketplaceState();
  const navigate = useNavigate();
  const draftBrand = getDraftBrand(mkt);
  const draftContent = getDraftContent(mkt);
  const marketplace = getMarketplace(mkt);
  const readiness = getReadiness(mkt);
  const [published, setPublished] = useState(false);

  const isHighRisk = marketplace.lifecycle_status === "DRAFT";
  const blocked = readiness?.status === "BLOCKED";

  const publish = () => {
    marketplaceStore.publishRelease("Elena Alvarez");
    setPublished(true);
  };

  return (
    <InternalShell workspace="agency" pageTitle="Publication review" eyebrow="Publication Review · SCR-M04-019">
      {published && (
        <p className="mb-4 flex items-center gap-2 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm">
          <CheckCircle2 className="h-4 w-4 text-sage" aria-hidden /> Release published.{" "}
          <button onClick={() => navigate({ to: "/marketplace/admin" })} className="story-link text-primary">Back to admin home</button>
        </p>
      )}

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-display mb-3 text-xl">Coordinated release scope</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-lg border border-border p-3">
            <span>Brand and identity</span>
            <StatusBadge tone={draftBrand ? "warning" : "muted"}>{draftBrand ? "Changed" : "Unchanged"}</StatusBadge>
          </li>
          <li className="flex items-center justify-between rounded-lg border border-border p-3">
            <span>Content and language</span>
            <StatusBadge tone={draftContent ? "warning" : "muted"}>{draftContent ? "Changed" : "Unchanged"}</StatusBadge>
          </li>
        </ul>

        {readiness && (
          <div className={`mt-4 rounded-xl border p-3 text-sm ${blocked ? "border-destructive/30 bg-destructive/5" : "border-sage/40 bg-sage-soft/40"}`}>
            <p className="font-medium">{blocked ? "Blocked — cannot publish" : "Readiness passes"}</p>
            {blocked && (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                {readiness.items.filter((i) => i.result === "FAIL").map((i) => <li key={i.readiness_item_id}>{i.next_action}</li>)}
              </ul>
            )}
          </div>
        )}

        {isHighRisk && (
          <p className="mt-4 rounded-xl border border-warning/40 bg-warning/5 p-3 text-sm">
            This marketplace has not completed initial activation. Publishing a release requires JET approval —{" "}
            <Link to="/marketplace/admin/activation" className="story-link text-primary">submit for initial activation</Link> instead.
          </p>
        )}

        {!isHighRisk && (
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={publish} disabled={blocked} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40">
              Confirm and publish now
            </button>
            <Link to="/marketplace/admin/releases/schedule" className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-6 text-sm font-medium hover:bg-accent">
              <Calendar className="h-4 w-4" aria-hidden /> Schedule for later
            </Link>
          </div>
        )}
      </section>
    </InternalShell>
  );
}
