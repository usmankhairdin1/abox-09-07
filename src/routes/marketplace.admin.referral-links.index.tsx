/**
 * SCR-M04-013 — Referral Links.
 * View, create, copy, revoke and replace organization and agent links
 * (REQ-M04-RTE-008/009/010).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LinkIcon, Plus, Copy, Ban } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { useOrgState, getOrganization } from "@/lib/org-store";
import {
  marketplaceStore, useMarketplaceState, getReferralLinks, getParticipants, MARKETPLACE_ID,
  CHANNEL_LABEL, type ReferralLink, type ReferralLinkType, type MarketplaceChannel,
} from "@/lib/marketplace-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/marketplace/admin/referral-links/")({
  head: () => ({ meta: [{ title: "Referral Links — ABox" }, { name: "description", content: "View, create, copy, revoke and replace organization and agent links." }] }),
  component: Page,
});

function Page() {
  const org = useOrgState();
  const mkt = useMarketplaceState();
  const links = getReferralLinks(mkt);
  const enabledParticipants = getParticipants(mkt).filter((p) => p.participation_state === "ENABLED");
  const [showForm, setShowForm] = useState(false);
  const [linkType, setLinkType] = useState<ReferralLinkType>("ORGANIZATION");
  const [participantId, setParticipantId] = useState(enabledParticipants[0]?.participant_id ?? "");
  const [agentName, setAgentName] = useState("");
  const [channel, setChannel] = useState<MarketplaceChannel>("AGENT");

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const token = crypto.randomUUID().slice(0, 10);
    marketplaceStore.addReferralLink({
      referral_link_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, link_type: linkType,
      participant_id: linkType === "ORGANIZATION" ? participantId : undefined,
      agent_name: linkType === "AGENT" ? agentName : undefined,
      channel, token, status: "ACTIVE", created_at: new Date().toISOString(), use_count: 0,
    });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: `Created a ${linkType.toLowerCase()} referral link.` });
    setShowForm(false); setAgentName("");
  };

  const revoke = (l: ReferralLink) => {
    marketplaceStore.updateReferralLink(l.referral_link_id, { status: "REVOKED" });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: "Revoked a referral link." });
  };

  const cols: Column<ReferralLink>[] = [
    { key: "link", header: "Link", cell: (r) => (
      <Link to="/marketplace/admin/referral-links/$referralLinkId" params={{ referralLinkId: r.referral_link_id }} className="story-link font-mono text-xs text-foreground">/r/{r.token}</Link>
    ) },
    { key: "participant", header: "Participant", cell: (r) => r.link_type === "ORGANIZATION" ? getOrganization(org, getParticipants(mkt).find((p) => p.participant_id === r.participant_id)?.organization_id ?? "")?.display_name ?? "—" : r.agent_name },
    { key: "channel", header: "Channel", cell: (r) => CHANNEL_LABEL[r.channel] },
    { key: "status", header: "Status", cell: (r) => <StatusBadge tone={r.status === "ACTIVE" ? "sage" : "muted"}>{r.status}</StatusBadge> },
    { key: "uses", header: "Uses", align: "right", cell: (r) => r.use_count },
    { key: "actions", header: "Actions", align: "right", cell: (r) => (
      <div className="flex justify-end gap-2">
        <ActionPill onClick={() => navigator.clipboard?.writeText(`https://cedargrove.abox.app/r/${r.token}`)} variant="outlineXs"><Copy className="h-3.5 w-3.5" aria-hidden /> Copy</ActionPill>
        {r.status === "ACTIVE" && <ActionPill onClick={() => revoke(r)} variant="outlineXs"><Ban className="h-3.5 w-3.5" aria-hidden /> Revoke</ActionPill>}
      </div>
    ) },
  ];

  return (
    <InternalShell
      workspace="agency" pageTitle="Referral links" eyebrow="Referral Links · SCR-M04-013"
      actions={<ActionPill onClick={() => setShowForm((v) => !v)} variant="primaryMd"><Plus className="h-4 w-4" aria-hidden /> Create link</ActionPill>}
    >
      {showForm && (
        <form onSubmit={create} className="mb-6 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-eyebrow">Link type</label>
            <select value={linkType} onChange={(e) => setLinkType(e.target.value as ReferralLinkType)} className="h-10 w-full rounded-lg border border-border bg-background px-3">
              <option value="ORGANIZATION">Downline organization</option>
              <option value="AGENT">Agent</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-eyebrow">Channel</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value as MarketplaceChannel)} className="h-10 w-full rounded-lg border border-border bg-background px-3">
              {(["CONSUMER_DIRECT", "AGENT", "EMPLOYER"] as MarketplaceChannel[]).map((c) => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
            </select>
          </div>
          {linkType === "ORGANIZATION" ? (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-eyebrow">Participant organization</label>
              <select value={participantId} onChange={(e) => setParticipantId(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3">
                {enabledParticipants.map((p) => <option key={p.participant_id} value={p.participant_id}>{getOrganization(org, p.organization_id)?.display_name}</option>)}
              </select>
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-eyebrow">Agent name</label>
              <input required value={agentName} onChange={(e) => setAgentName(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3" />
            </div>
          )}
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Create</button>
          </div>
        </form>
      )}

      <DataTable columns={cols} rows={links} getRowId={(r) => r.referral_link_id} ariaLabel="Referral links" empty="No referral links yet." />
    </InternalShell>
  );
}
