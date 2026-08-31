/**
 * SCR-M04-011 — Participants.
 * Direct-downline participant status, channels, support, links and
 * readiness (REQ-M04-ADM-018).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { useOrgState, getOrganization, getDirectDownlines, getReadiness as getOrgReadiness, ROOT_ORGANIZATION_ID } from "@/lib/org-store";
import { useMarketplaceState, getParticipants, getReferralLinks, type Participant } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/participants/")({
  head: () => ({ meta: [{ title: "Marketplace Participants — ABox" }, { name: "description", content: "Direct-downline participant status, channels, support, links and readiness." }] }),
  component: Page,
});

const STATE_TONE = { NOT_ENABLED: "muted", PENDING_READINESS: "warning", ENABLED: "sage", SUSPENDED: "destructive" } as const;

function Page() {
  const org = useOrgState();
  const mkt = useMarketplaceState();
  const participants = getParticipants(mkt);
  const downlines = getDirectDownlines(org, ROOT_ORGANIZATION_ID);
  const linkCount = (participantId: string) => getReferralLinks(mkt).filter((l) => l.participant_id === participantId).length;

  const cols: Column<Participant>[] = [
    { key: "org", header: "Organization", cell: (r) => {
      const o = getOrganization(org, r.organization_id);
      return <Link to="/marketplace/admin/participants/$participantId" params={{ participantId: r.participant_id }} className="story-link font-medium text-foreground">{o?.display_name ?? r.organization_id}</Link>;
    } },
    { key: "state", header: "Participation", cell: (r) => <StatusBadge tone={STATE_TONE[r.participation_state]}>{r.participation_state.replaceAll("_", " ")}</StatusBadge> },
    { key: "channels", header: "Channels", cell: (r) => r.channels.join(", ") || "—" },
    { key: "readiness", header: "M05 readiness", cell: (r) => {
      const rd = getOrgReadiness(org, r.organization_id);
      return rd ? <StatusBadge tone={rd.status === "READY" ? "sage" : rd.status === "BLOCKED" ? "destructive" : "warning"}>{rd.status.replaceAll("_", " ")}</StatusBadge> : "—";
    } },
    { key: "links", header: "Links", align: "right", cell: (r) => linkCount(r.participant_id) },
  ];

  return (
    <InternalShell workspace="agency" pageTitle="Participants" eyebrow="Marketplace Participants · SCR-M04-011">
      <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /> {downlines.length} direct downline(s) in M05 · {participants.filter((p) => p.participation_state === "ENABLED").length} enabled here</p>
      <DataTable columns={cols} rows={participants} getRowId={(r) => r.participant_id} ariaLabel="Marketplace participants" />
    </InternalShell>
  );
}
