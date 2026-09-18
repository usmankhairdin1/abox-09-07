/**
 * SCR-M04-032 — No Ready Products.
 * Safe no-ready-product result and explicit approved next actions
 * (REQ-M04-AVL-028).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { NoticePage } from "@/components/abox/notice-page";

export const Route = createFileRoute("/no-options")({
  head: () => ({ meta: [{ title: "No plans available yet — ABox" }] }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell variant="flow">
      <section className="mx-auto max-w-lg px-4 py-32 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-muted text-muted-foreground"><SearchX className="h-8 w-8" aria-hidden /></span>
        <h1 className="text-display mt-6 text-2xl">No plans ready for that area yet</h1>
        <p className="mt-3 text-sm text-muted-foreground">We don't show stale, cross-state or simulated plans. Try a different location, another product, or talk to an agent.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/select" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Correct my location</Link>
          <Link to="/schedule" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">Talk to an agent</Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">Marketplace home</Link>
        </div>
      </section>
    </MarketplaceShell>
  );
}
