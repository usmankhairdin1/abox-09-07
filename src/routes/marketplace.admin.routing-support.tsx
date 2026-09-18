/**
 * SCR-M04-015 — Routing and Support Identity.
 * Fixed routing posture, root fallback and contextual support
 * (REQ-M04-RTE-016/026/027).
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Headset, GitBranch } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { useOrgState, getOrganization } from "@/lib/org-store";
import { useMarketplaceState, getActiveContent, getParticipants } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/routing-support")({
  head: () => ({ meta: [{ title: "Routing and Support Identity — ABox" }, { name: "description", content: "Fixed routing posture, root fallback and contextual support." }] }),
  component: Page,
});

const ROUTING_SEQUENCE = [
  "Preserve an existing active journey",
  "Valid agent referral",
  "Valid downline referral",
  "Existing authorized relationship confirmed by the owning module",
  "Otherwise: normal marketplace entry to the root",
];

function Page() {
  const org = useOrgState();
  const mkt = useMarketplaceState();
  const content = getActiveContent(mkt);
  const participants = getParticipants(mkt).filter((p) => p.participation_state === "ENABLED");

  return (
    <InternalShell workspace="agency" pageTitle="Routing and support identity" eyebrow="Routing and Support Identity · SCR-M04-015">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className={surfaceClass()}>
          <header className="mb-3 flex items-center gap-2"><GitBranch className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Fixed routing sequence</h2></header>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {ROUTING_SEQUENCE.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">No round-robin, weighted or AI-scored routing in this release (REQ-M04-RTE-017).</p>
        </section>

        <section className={surfaceClass()}>
          <header className="mb-3 flex items-center gap-2"><Headset className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Root support identity (fallback)</h2></header>
          {content ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd>{content.support_display_name}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Phone</dt><dd>{content.support_phone}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd>{content.support_email}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Hours</dt><dd>{content.support_hours}</dd></div>
            </dl>
          ) : <p className="text-sm text-muted-foreground">Not configured.</p>}
          <Link to="/marketplace/admin/content" className="story-link mt-3 inline-block text-sm text-primary">Edit in Content</Link>
        </section>

        <section className={cn(surfaceClass(), "lg:col-span-2")}>
          <header className="mb-3"><h2 className="text-display text-xl">Participant support identity</h2></header>
          <ul className="grid gap-2 sm:grid-cols-2">
            {participants.map((p) => {
              const o = getOrganization(org, p.organization_id);
              return (
                <li key={p.participant_id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                  <span>{o?.display_name}</span>
                  <StatusBadge tone="muted">{p.support_identity_preference === "ROOT" ? "Uses root support" : "Own support"}</StatusBadge>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Root support is the fixed fallback whenever downline support is incomplete or inactive (REQ-M04-RTE-027).</p>
        </section>
      </div>
    </InternalShell>
  );
}
