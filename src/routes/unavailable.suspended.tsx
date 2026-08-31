/**
 * SCR-M04-033 — Marketplace Suspended.
 * New-start block with permitted sign-in or existing-record continuity
 * (REQ-M04-MKT-014).
 */
import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { SuspendedMarketplaceNotice } from "@/components/abox/suspended-marketplace-notice";

export const Route = createFileRoute("/unavailable/suspended")({
  head: () => ({ meta: [{ title: "Marketplace paused — ABox" }] }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell variant="flow" showAssistant={false}>
      <SuspendedMarketplaceNotice />
    </MarketplaceShell>
  );
}
