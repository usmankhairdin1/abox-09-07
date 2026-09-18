/**
 * SCR-M04-007 — Domains and Public Routes.
 * JET subdomain, custom-domain request, verification, activation and
 * route continuity (REQ-M04-BRD-021..025).
 */
import { surfaceClass } from "@/components/abox/surface";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Plus, CheckCircle2, Star } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { marketplaceStore, useMarketplaceState, getDomains, MARKETPLACE_ID, type DomainStatus } from "@/lib/marketplace-store";
import { ActionPill, actionPillClass } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/marketplace/admin/domains/")({
  head: () => ({ meta: [{ title: "Marketplace Domains — ABox" }, { name: "description", content: "JET subdomain, custom-domain request, verification, activation and route continuity." }] }),
  component: Page,
});

const STATUS_TONE: Record<DomainStatus, "sage" | "muted" | "warning" | "destructive"> = {
  REQUESTED: "muted", ACTION_REQUIRED: "warning", VERIFIED: "warning", ACTIVE: "sage", SUSPENDED: "destructive", RETIRED: "muted",
};

function Page() {
  const mkt = useMarketplaceState();
  const domains = getDomains(mkt);

  const verify = (id: string) => {
    marketplaceStore.updateDomain(id, { status: "VERIFIED", verified_at: new Date().toISOString() });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "Elena Alvarez", summary: "Domain ownership verified." });
  };
  const activate = (id: string) => {
    marketplaceStore.setPrimaryDomain(id);
    marketplaceStore.updateDomain(id, { status: "ACTIVE", activated_at: new Date().toISOString() });
    marketplaceStore.addHistory({ history_id: crypto.randomUUID().slice(0, 8), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor: "JET Platform Admin", summary: "Domain activated as primary production route." });
    marketplaceStore.recalculateReadiness();
  };

  return (
    <InternalShell
      workspace="agency" pageTitle="Domains and public routes" eyebrow="Domains and Public Routes · SCR-M04-007"
      actions={<Link to="/marketplace/admin/domains/request" className={actionPillClass("primaryMd")}><Plus className="h-4 w-4" aria-hidden /> Request custom domain</Link>}
    >
      <ul className="space-y-3">
        {domains.map((d) => (
          <li key={d.domain_id} className={surfaceClass({ padding: "sm" })}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{d.hostname}</span>
                {d.is_primary && <StatusBadge tone="primary"><Star className="h-3 w-3" /> Primary</StatusBadge>}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge tone={STATUS_TONE[d.status]}>{d.status.replaceAll("_", " ")}</StatusBadge>
                {d.status === "REQUESTED" || d.status === "ACTION_REQUIRED" ? (
                  <ActionPill onClick={() => verify(d.domain_id)} variant="outlineXs">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Mark verified
                  </ActionPill>
                ) : d.status === "VERIFIED" ? (
                  <ActionPill onClick={() => activate(d.domain_id)} variant="primaryXs">
                    JET: Activate
                  </ActionPill>
                ) : null}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {d.domain_type === "JET_SUBDOMAIN" ? "JET-managed subdomain" : "Custom domain"} · requested {new Date(d.requested_at).toLocaleDateString()}
              {d.activated_at && ` · activated ${new Date(d.activated_at).toLocaleDateString()}`}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">Exactly one domain is the active primary production entry — activating a new one supersedes the prior primary.</p>
    </InternalShell>
  );
}
