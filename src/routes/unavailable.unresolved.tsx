/**
 * SCR-M04-034 — Marketplace Route Unavailable.
 * Fail-closed unknown, invalid, suspended or retired route state
 * (REQ-M04-BRD-025). Spec route is /unavailable/route; "route" is a
 * reserved TanStack Router filename segment, so this uses /unavailable/unresolved.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { NoticePage } from "@/components/abox/notice-page";

export const Route = createFileRoute("/unavailable/unresolved")({
  head: () => ({ meta: [{ title: "Route unavailable — ABox" }] }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell variant="flow" showAssistant={false}>
      <NoticePage
        tone="destructive"
        icon={Globe}
        title="This address isn't a recognized marketplace"
        description="We never route an unknown or retired domain to another agency, tenant or generic shopping experience."
      >
        <Link to="/support" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Contact support</Link>
      </NoticePage>
    </MarketplaceShell>
  );
}
