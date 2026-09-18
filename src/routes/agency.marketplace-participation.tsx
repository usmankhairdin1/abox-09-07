/**
 * SCR-M04-003 — Downline Marketplace Participation.
 * Own participation, support, referral links, readiness and correction
 * requests (REQ-M04-MKT-006 downline administration posture).
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, LinkIcon, ShieldCheck, Send } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { DownlineContextBanner } from "@/components/abox/downline-context-banner";
import { useOrgState, getOrganization, ROOT_ORGANIZATION_ID } from "@/lib/org-store";
import {
  marketplaceStore, useMarketplaceState, getMarketplace, getParticipantByOrg, getReferralLinks, getReadiness,
} from "@/lib/marketplace-store";

export const Route = createFileRoute("/agency/marketplace-participation")({
  head: () => ({ meta: [{ title: "Marketplace Participation — ABox" }, { name: "description", content: "Own participation, support, referral links, readiness and correction requests." }] }),
  component: Page,
});

function Page() {
  const org = useOrgState();
  const mkt = useMarketplaceState();
  const orgId = org.contextOrganizationId ?? ROOT_ORGANIZATION_ID;
  const record = getOrganization(org, orgId);
  const marketplace = getMarketplace(mkt);
  const participant = getParticipantByOrg(mkt, orgId);
  const links = getReferralLinks(mkt).filter((l) => l.participant_id === participant?.participant_id);
  const readiness = getReadiness(mkt);
  const [issue, setIssue] = useState("");
  const [sent, setSent] = useState(false);

  const submitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;
    marketplaceStore.addTask({
      task_id: crypto.randomUUID().slice(0, 8), marketplace_id: marketplace.marketplace_id,
      task_type: "MISSING_SUPPORT", owner: "ROOT", status: "OPEN",
      description: `Correction request from ${record?.display_name}: ${issue}`, created_at: new Date().toISOString(),
    });
    setIssue(""); setSent(true);
  };

  return (
    <InternalShell workspace="agency" pageTitle="Marketplace participation" eyebrow="Downline Marketplace Participation · SCR-M04-003">
      <DownlineContextBanner />

      {!participant ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {record?.display_name} is not yet a marketplace participant.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className={surfaceClass()}>
            <header className="mb-3 flex items-center gap-2"><Store className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">My participation</h2></header>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><dt className="text-muted-foreground">State</dt><dd><StatusBadge tone={participant.participation_state === "ENABLED" ? "sage" : participant.participation_state === "SUSPENDED" ? "destructive" : "warning"}>{participant.participation_state.replaceAll("_", " ")}</StatusBadge></dd></div>
              <div className="flex items-center justify-between"><dt className="text-muted-foreground">Channels</dt><dd>{participant.channels.length ? participant.channels.join(", ") : "None enabled"}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-muted-foreground">Support identity</dt><dd>{participant.support_identity_preference === "ROOT" ? "Root support" : "Own support"}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-muted-foreground">Since</dt><dd>{new Date(participant.effective_from).toLocaleDateString()}</dd></div>
            </dl>
          </section>

          <section className={surfaceClass()}>
            <header className="mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Marketplace readiness</h2></header>
            {readiness ? (
              <StatusBadge tone={readiness.status === "READY" ? "sage" : readiness.status === "BLOCKED" ? "destructive" : "warning"}>{readiness.status.replaceAll("_", " ")}</StatusBadge>
            ) : <span className="text-sm text-muted-foreground">Not evaluated</span>}
            <p className="mt-2 text-xs text-muted-foreground">Marketplace-wide readiness is managed by the root; your own profile readiness lives in Organization Readiness.</p>
            <Link to="/agency/organizations/$organizationId/readiness" params={{ organizationId: orgId }} className="story-link mt-2 inline-block text-sm text-primary">Open my organization readiness</Link>
          </section>

          <section className={cn(surfaceClass(), "lg:col-span-2")}>
            <header className="mb-3 flex items-center gap-2"><LinkIcon className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">My referral links</h2></header>
            {links.length === 0 ? (
              <p className="text-sm text-muted-foreground">No referral links yet. Ask the root to create one for your organization.</p>
            ) : (
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.referral_link_id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                    <span className="font-mono text-xs">/r/{l.token}</span>
                    <StatusBadge tone={l.status === "ACTIVE" ? "sage" : "muted"}>{l.status}</StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={cn(surfaceClass(), "lg:col-span-2")}>
            <header className="mb-3 flex items-center gap-2"><Send className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Request a correction</h2></header>
            {sent && <p className="mb-3 rounded-xl border border-sage/40 bg-sage-soft/40 p-3 text-sm">Sent to the root for review.</p>}
            <form onSubmit={submitCorrection} className="flex gap-2">
              <input value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Describe the issue…" className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm" />
              <button type="submit" className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">Send</button>
            </form>
          </section>
        </div>
      )}
    </InternalShell>
  );
}
