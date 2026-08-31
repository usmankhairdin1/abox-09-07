/**
 * SCR-M04-035 — Marketplace Deep-Link Unavailable.
 * Unavailable pathway with no silent fallback and explicit approved
 * alternatives (REQ-M04-AVL-018).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Ban } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";

export const Route = createFileRoute("/unavailable/pathway")({
  head: () => ({ meta: [{ title: "Pathway unavailable — ABox" }] }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell variant="flow">
      <section className="mx-auto max-w-lg px-4 py-32 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-muted text-muted-foreground"><Ban className="h-8 w-8" aria-hidden /></span>
        <h1 className="text-display mt-6 text-3xl">That link isn't enabled here</h1>
        <p className="mt-3 text-sm text-muted-foreground">We don't silently swap you to a different channel, product or agency. Pick an enabled option below.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">See what's available</Link>
          <Link to="/support" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">Contact support</Link>
        </div>
      </section>
    </MarketplaceShell>
  );
}
