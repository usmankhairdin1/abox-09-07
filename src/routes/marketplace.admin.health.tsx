/**
 * SCR-M04-025 — Marketplace Operational Health.
 * Current release, route, content, product, participant, propagation and
 * delta health (REQ-M04-ADM-019).
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { useMarketplaceState, getHealth, type HealthArea } from "@/lib/marketplace-store";

export const Route = createFileRoute("/marketplace/admin/health")({
  head: () => ({ meta: [{ title: "Marketplace Operational Health — ABox" }, { name: "description", content: "Current release, route, content, product, participant, propagation and delta health." }] }),
  component: Page,
});

const AREA_LABEL: Record<HealthArea, string> = {
  RELEASE: "Release", ROUTE: "Route", CONTENT: "Content", PRODUCT: "Product",
  PARTICIPANT: "Participant", PROPAGATION: "Propagation", PRIOR_MODULE: "Prior-module compatibility",
};
const AREA_OWNER_LINK: Partial<Record<HealthArea, { label: string; to: string }>> = {
  ROUTE: { label: "Domains", to: "/marketplace/admin/domains" },
  PARTICIPANT: { label: "Participants", to: "/marketplace/admin/participants" },
  PRIOR_MODULE: { label: "Platform Foundation (M00)", to: "/app/jet/platform" },
};

function Page() {
  const mkt = useMarketplaceState();
  const health = getHealth(mkt);

  return (
    <InternalShell workspace="agency" pageTitle="Marketplace operational health" eyebrow="Marketplace Operational Health · SCR-M04-025">
      <ul className="space-y-3">
        {health.map((h) => {
          const link = AREA_OWNER_LINK[h.area];
          return (
            <li key={h.health_id} className={cn("flex flex-wrap items-center justify-between gap-3", surfaceClass({ padding: "sm" }))}>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{AREA_LABEL[h.area]}</p>
                  <p className="text-xs text-muted-foreground">{h.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge tone={h.status === "HEALTHY" ? "sage" : h.status === "DEGRADED" ? "warning" : "destructive"}>{h.status}</StatusBadge>
                {link && <Link to={link.to} className="story-link text-sm text-primary">{link.label}</Link>}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">Each blocker identifies its canonical owner — never presented as an editable value when owned elsewhere.</p>
    </InternalShell>
  );
}
