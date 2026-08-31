/**
 * SCR-M04-028 — Public Pathway Entry.
 * Validated fixed entry into an enabled governed pathway
 * (REQ-M04-ADM-026 deep-link entry).
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { useMarketplaceState, getMarketplace, getAvailability } from "@/lib/marketplace-store";

export const Route = createFileRoute("/start/$pathway")({
  loader: ({ params }) => ({ pathway: params.pathway }),
  head: ({ params }) => ({ meta: [{ title: `Start — ${params.pathway} — ABox` }] }),
  component: Page,
});

const PATHWAY_TARGET: Record<string, string> = {
  ifp: "/select?product=ifp", dental: "/select?product=dental", vision: "/select?product=vision",
  ichra: "/ichra", agent: "/schedule",
};
const PATHWAY_LINES: Record<string, ("IFP_ON_EXCHANGE" | "IFP_OFF_EXCHANGE" | "DENTAL" | "VISION")[]> = {
  ifp: ["IFP_ON_EXCHANGE", "IFP_OFF_EXCHANGE"], dental: ["DENTAL"], vision: ["VISION"],
};

function Page() {
  const { pathway } = Route.useLoaderData();
  const navigate = useNavigate();
  const mkt = useMarketplaceState();
  const marketplace = getMarketplace(mkt);
  const availability = getAvailability(mkt);

  const target = PATHWAY_TARGET[pathway];
  const lines = PATHWAY_LINES[pathway];
  const isReady = marketplace.lifecycle_status === "ACTIVE" && (!lines || availability.some((a) => lines.includes(a.product_line as never) && a.status === "ENABLED"));

  useEffect(() => {
    if (target && isReady) { navigate({ to: target, replace: true }); return; }
    // Unknown pathway key → unresolved route (SCR-M04-034). Known but
    // currently-disabled pathway → dedicated deep-link-unavailable screen
    // (SCR-M04-035) rather than a duplicate inline message.
    if (!target) navigate({ to: "/unavailable/unresolved", replace: true });
    else if (!isReady) navigate({ to: "/unavailable/pathway", replace: true });
  }, [target, isReady, navigate]);

  return (
    <MarketplaceShell variant="flow">
      <section className="mx-auto max-w-lg px-4 py-32 text-center text-sm text-muted-foreground">Taking you there…</section>
    </MarketplaceShell>
  );
}
