/**
 * SCR-M04-014 — Referral Link Detail.
 * Link status, participant, channel, product, use history and readiness.
 */
import { surfaceClass } from "@/components/abox/surface";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LinkIcon, Ban } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { useOrgState, getOrganization } from "@/lib/org-store";
import {
  marketplaceStore, useMarketplaceState, getReferralLink, getParticipants, MARKETPLACE_ID,
  CHANNEL_LABEL, PRODUCT_LINE_LABEL,
} from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/referral-links/$referralLinkId")({
  loader: ({ params }) => ({ referralLinkId: params.referralLinkId }),
  head: ({ params }) => ({ meta: [{ title: `Referral link — ${params.referralLinkId} — ABox` }] }),
  component: Page,
});

function Page() {
  const { referralLinkId } = Route.useLoaderData();
  const org = useOrgState();
  const mkt = useMarketplaceState();
  const link = getReferralLink(mkt, referralLinkId);

  if (!link) {
    return (
      <InternalShell workspace="agency" pageTitle="Not found" eyebrow="Referral Link · M04">
        <p>That referral link doesn't exist. <Link to="/marketplace/admin/referral-links" className="story-link text-primary">Back to links</Link></p>
      </InternalShell>
    );
  }

  const participant = link.participant_id ? getParticipants(mkt).find((p) => p.participant_id === link.participant_id) : undefined;
  const orgRecord = participant ? getOrganization(org, participant.organization_id) : undefined;

  return (
    <InternalShell
      workspace="agency" pageTitle={`/r/${link.token}`} eyebrow="Referral Link Detail · SCR-M04-014"
      actions={link.status === "ACTIVE" && (
        <button
          onClick={() => { marketplaceStore.updateReferralLink(link.referral_link_id, { status: "REVOKED" }); marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Revoked referral link /r/${link.token}.` }); }}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-destructive/40 px-4 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <Ban className="h-4 w-4" aria-hidden /> Revoke
        </button>
      )}
    >
      <Link to="/marketplace/admin/referral-links" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to links
      </Link>

      <section className={surfaceClass()}>
        <header className="mb-4 flex items-center gap-2"><LinkIcon className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Link details</h2></header>
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <div><dt className="text-eyebrow">Type</dt><dd>{link.link_type === "ORGANIZATION" ? "Downline organization" : "Agent"}</dd></div>
          <div><dt className="text-eyebrow">Participant</dt><dd>{link.link_type === "ORGANIZATION" ? orgRecord?.display_name ?? "—" : link.agent_name}</dd></div>
          <div><dt className="text-eyebrow">Channel</dt><dd>{CHANNEL_LABEL[link.channel]}</dd></div>
          <div><dt className="text-eyebrow">Product line</dt><dd>{link.product_line ? PRODUCT_LINE_LABEL[link.product_line] : "Any enabled"}</dd></div>
          <div><dt className="text-eyebrow">Status</dt><dd><StatusBadge tone={link.status === "ACTIVE" ? "sage" : "muted"}>{link.status}</StatusBadge></dd></div>
          <div><dt className="text-eyebrow">Created</dt><dd>{new Date(link.created_at).toLocaleDateString()}</dd></div>
          <div><dt className="text-eyebrow">Use count</dt><dd>{link.use_count}</dd></div>
          <div><dt className="text-eyebrow">Last used</dt><dd>{link.last_used_at ? new Date(link.last_used_at).toLocaleDateString() : "Never"}</dd></div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          A referral link establishes entry attribution only — it is never a credential and grants no existing-record access (REQ-M04-RTE-011).
        </p>
      </section>
    </InternalShell>
  );
}
