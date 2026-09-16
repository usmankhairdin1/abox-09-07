/**
 * SCR-M04-029 — Referral Entry Confirmation.
 * Marketplace, agency, agent and new-journey confirmation without record
 * access (REQ-M04-RTE-008/009/011/013/014).
 */
import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { useOrgState, getOrganization } from "@/lib/org-store";
import { marketplaceStore, useMarketplaceState, getReferralLinkByToken, CHANNEL_LABEL, getParticipants } from "@/lib/marketplace-store";
import { getLastSavedAt } from "@/lib/quote-store";

export const Route = createFileRoute("/r/$referralToken")({
  loader: ({ params }) => ({ referralToken: params.referralToken }),
  head: ({ params }) => ({ meta: [{ title: `Referral — ${params.referralToken} — ABox` }] }),
  component: Page,
});

export const REFERRAL_CONTEXT_KEY = "abox_referral_context_v1";

function Page() {
  const { referralToken } = Route.useLoaderData();
  const org = useOrgState();
  const mkt = useMarketplaceState();
  const navigate = useNavigate();
  const recorded = useRef(false);
  const [hasExisting] = useState(() => !!getLastSavedAt());

  const link = getReferralLinkByToken(mkt, referralToken);
  const participant = link?.participant_id ? getParticipants(mkt).find((p) => p.participant_id === link.participant_id) : undefined;
  const orgRecord = participant ? getOrganization(org, participant.organization_id) : undefined;
  const valid = link && link.status === "ACTIVE" && (link.link_type === "AGENT" || (participant && participant.participation_state === "ENABLED"));

  useEffect(() => {
    if (valid && link && !recorded.current) { marketplaceStore.recordReferralUse(link.referral_link_id); recorded.current = true; }
  }, [valid, link]);

  if (!link || !valid) {
    return (
      <MarketplaceShell variant="flow">
        <section className="mx-auto max-w-lg px-4 py-32 text-center">
          <h1 className="text-display text-2xl">This link isn't available</h1>
          <p className="mt-3 text-sm text-muted-foreground">The agency or agent behind this link is unavailable. We never substitute another participant silently.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/agent-unavailable" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">See alternatives</Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">Marketplace home</Link>
          </div>
        </section>
      </MarketplaceShell>
    );
  }

  const proceed = () => {
    sessionStorage.setItem(REFERRAL_CONTEXT_KEY, JSON.stringify({
      token: referralToken, organization: orgRecord?.display_name ?? null, agentName: link.agent_name ?? null,
      channel: link.channel, enteredAt: new Date().toISOString(),
    }));
    navigate({ to: hasExisting ? "/journey-choice" : "/" });
  };

  return (
    <MarketplaceShell variant="flow">
      <section className="mx-auto max-w-lg px-4 py-32 text-center">
        <p className="text-eyebrow">You're entering via a referral</p>
        <h1 className="text-display mt-4 text-2xl">
          {link.link_type === "ORGANIZATION" ? orgRecord?.display_name : link.agent_name}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This link sets {link.link_type === "ORGANIZATION" ? orgRecord?.display_name : link.agent_name} as your entry attribution for a new {CHANNEL_LABEL[link.channel].toLowerCase()} journey.
          It does not grant access to any existing records you may have.
        </p>
        <button onClick={proceed} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform">
          Continue to the marketplace
        </button>
      </section>
    </MarketplaceShell>
  );
}
