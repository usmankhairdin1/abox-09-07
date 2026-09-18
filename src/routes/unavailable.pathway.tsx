/**
 * SCR-M04-035 — Marketplace Deep-Link Unavailable.
 * Unavailable pathway with no silent fallback and explicit approved
 * alternatives (REQ-M04-AVL-018).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Ban } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { NoticePage } from "@/components/abox/notice-page";

export const Route = createFileRoute("/unavailable/pathway")({
  head: () => ({ meta: [{ title: "Pathway unavailable — ABox" }] }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell variant="flow">
      <NoticePage
        tone="muted"
        icon={Ban}
        title="That link isn't enabled here"
        description="We don't silently swap you to a different channel, product or agency. Pick an enabled option below."
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">See what's available</Link>
          <Link to="/support" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">Contact support</Link>
        </div>
      </NoticePage>
    </MarketplaceShell>
  );
}
