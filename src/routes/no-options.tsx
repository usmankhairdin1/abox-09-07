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
      <NoticePage
        tone="muted"
        icon={SearchX}
        title="No plans ready for that area yet"
        description="We don't show stale, cross-state or simulated plans. Try a different location, another product, or talk to an agent."
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/select" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Correct my location</Link>
          <Link to="/schedule" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">Talk to an agent</Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">Marketplace home</Link>
        </div>
      </NoticePage>
    </MarketplaceShell>
  );
}
