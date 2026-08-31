/**
 * SCR-M04-012 — Participant Detail.
 * Enable, suspend, end and review one participant without altering M05
 * lifecycle (REQ-M04-RTE-033).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, PlayCircle, PauseCircle, XCircle } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { useOrgState, getOrganization, getReadiness as getOrgReadiness } from "@/lib/org-store";
import {
  marketplaceStore, useMarketplaceState, getParticipant, getReferralLinks, MARKETPLACE_ID,
  CHANNEL_LABEL, type MarketplaceChannel,
} from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/participants/$participantId")({
  loader: ({ params }) => ({ participantId: params.participantId }),
  head: ({ params }) => ({ meta: [{ title: `Participant — ${params.participantId} — ABox` }] }),
  component: Page,
});

const ALL_CHANNELS: MarketplaceChannel[] = ["CONSUMER_DIRECT", "AGENT", "EMPLOYER"];

function Page() {
  const { participantId } = Route.useLoaderData();
  const org = useOrgState();
  const mkt = useMarketplaceState();
  const participant = getParticipant(mkt, participantId);
  const orgRecord = participant ? getOrganization(org, participant.organization_id) : undefined;
  const orgReadiness = participant ? getOrgReadiness(org, participant.organization_id) : undefined;
  const links = participant ? getReferralLinks(mkt).filter((l) => l.participant_id === participantId) : [];

  if (!participant || !orgRecord) {
    return (
      <InternalShell workspace="agency" pageTitle="Not found" eyebrow="Participant · M04">
        <p>That participant doesn't exist. <Link to="/marketplace/admin/participants" className="story-link text-primary">Back to participants</Link></p>
      </InternalShell>
    );
  }

  const canEnable = orgReadiness?.status === "READY" || orgReadiness?.status === "READY_WITH_WARNINGS";
  const toggleChannel = (ch: MarketplaceChannel) => {
    const next = participant.channels.includes(ch) ? participant.channels.filter((c) => c !== ch) : [...participant.channels, ch];
    marketplaceStore.updateParticipant(participantId, { channels: next });
  };
  const enable = () => {
    marketplaceStore.updateParticipant(participantId, { participation_state: "ENABLED" });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Enabled ${orgRecord.display_name} as a marketplace participant.` });
  };
  const suspend = () => {
    marketplaceStore.updateParticipant(participantId, { participation_state: "SUSPENDED" });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Suspended ${orgRecord.display_name}'s marketplace participation. Attribution preserved.` });
  };
  const end = () => {
    marketplaceStore.updateParticipant(participantId, { participation_state: "NOT_ENABLED", channels: [] });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Ended ${orgRecord.display_name}'s marketplace participation. M05 organization lifecycle unaffected.` });
  };

  return (
    <InternalShell workspace="agency" pageTitle={orgRecord.display_name} eyebrow="Participant Detail · SCR-M04-012">
      <Link to="/marketplace/admin/participants" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to participants
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Participation</h2></header>
          <StatusBadge tone={participant.participation_state === "ENABLED" ? "sage" : participant.participation_state === "SUSPENDED" ? "destructive" : "warning"}>{participant.participation_state.replaceAll("_", " ")}</StatusBadge>

          <p className="mt-4 text-eyebrow">Channels</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ALL_CHANNELS.map((ch) => (
              <button key={ch} onClick={() => toggleChannel(ch)} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${participant.channels.includes(ch) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}>
                {CHANNEL_LABEL[ch]}
              </button>
            ))}
          </div>

          <p className="mt-4 text-eyebrow">Organization readiness</p>
          {orgReadiness ? <StatusBadge tone={orgReadiness.status === "READY" ? "sage" : "warning"}>{orgReadiness.status.replaceAll("_", " ")}</StatusBadge> : <span className="text-sm text-muted-foreground">Not evaluated</span>}
          <Link to="/agency/organizations/$organizationId/readiness" params={{ organizationId: participant.organization_id }} className="story-link ml-2 text-sm text-primary">View</Link>

          <div className="mt-5 flex flex-wrap gap-2">
            {participant.participation_state !== "ENABLED" && (
              <button onClick={enable} disabled={!canEnable} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40">
                <PlayCircle className="h-4 w-4" aria-hidden /> Enable
              </button>
            )}
            {participant.participation_state === "ENABLED" && (
              <button onClick={suspend} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:bg-accent">
                <PauseCircle className="h-4 w-4" aria-hidden /> Suspend
              </button>
            )}
            {participant.participation_state !== "NOT_ENABLED" && (
              <button onClick={end} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-destructive/40 px-4 text-sm font-medium text-destructive hover:bg-destructive/10">
                <XCircle className="h-4 w-4" aria-hidden /> End participation
              </button>
            )}
          </div>
          {!canEnable && participant.participation_state !== "ENABLED" && (
            <p className="mt-2 text-xs text-muted-foreground">Cannot enable until organization readiness passes.</p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3"><h2 className="text-display text-xl">Referral links</h2></header>
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No referral links for this participant.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {links.map((l) => (
                <li key={l.referral_link_id} className="flex items-center justify-between rounded-lg border border-border p-2">
                  <span className="font-mono text-xs">/r/{l.token}</span>
                  <StatusBadge tone={l.status === "ACTIVE" ? "sage" : "muted"}>{l.status}</StatusBadge>
                </li>
              ))}
            </ul>
          )}
          <Link to="/marketplace/admin/referral-links" className="story-link mt-3 inline-block text-sm text-primary">Manage referral links</Link>
        </section>
      </div>
    </InternalShell>
  );
}
