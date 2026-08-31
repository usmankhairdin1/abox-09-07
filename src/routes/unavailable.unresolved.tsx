/**
 * SCR-M04-034 — Marketplace Route Unavailable.
 * Fail-closed unknown, invalid, suspended or retired route state
 * (REQ-M04-BRD-025). Spec route is /unavailable/route; "route" is a
 * reserved TanStack Router filename segment, so this uses /unavailable/unresolved.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";

export const Route = createFileRoute("/unavailable/unresolved")({
  head: () => ({ meta: [{ title: "Route unavailable — ABox" }] }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell variant="flow" showAssistant={false}>
      <section className="mx-auto max-w-lg px-4 py-32 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive"><Globe className="h-8 w-8" aria-hidden /></span>
        <h1 className="text-display mt-6 text-3xl">This address isn't a recognized marketplace</h1>
        <p className="mt-3 text-sm text-muted-foreground">We never route an unknown or retired domain to another agency, tenant or generic shopping experience.</p>
        <Link to="/support" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Contact support</Link>
      </section>
    </MarketplaceShell>
  );
}
