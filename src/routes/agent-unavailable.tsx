/**
 * SCR-M04-031 — Named Agent Unavailable.
 * Explicit same-agency, another-agent, root, self-service or home
 * alternatives (REQ-M04-RTE-023).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserX } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { NoticePage } from "@/components/abox/notice-page";
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agent-unavailable")({
  head: () => ({ meta: [{ title: "Agent unavailable — ABox" }] }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell variant="flow">
      <NoticePage
        tone="warning"
        icon={UserX}
        title="That agent isn't available right now"
        description="We never substitute another agent silently. Choose how you'd like to continue."
      >
        <div className="mt-8 grid gap-3 text-left">
          <Link to="/schedule" className="rounded-2xl border border-primary/40 bg-primary/5 p-4 hover:bg-primary/10"><p className="font-semibold">Same agency, no specific agent</p><p className="text-sm text-muted-foreground">We'll route you to the next available person there.</p></Link>
          <Link to="/select" className={cn(surfaceClass({ padding: "sm" }), "hover:bg-accent")}><p className="font-semibold">Shop on my own</p><p className="text-sm text-muted-foreground">Continue self-service where available.</p></Link>
          <Link to="/" className={cn(surfaceClass({ padding: "sm" }), "hover:bg-accent")}><p className="font-semibold">Marketplace home</p></Link>
        </div>
      </NoticePage>
    </MarketplaceShell>
  );
}
