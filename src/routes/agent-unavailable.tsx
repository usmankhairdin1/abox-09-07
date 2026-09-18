/**
 * SCR-M04-031 — Named Agent Unavailable.
 * Explicit same-agency, another-agent, root, self-service or home
 * alternatives (REQ-M04-RTE-023).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserX } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agent-unavailable")({
  head: () => ({ meta: [{ title: "Agent unavailable — ABox" }] }),
  component: Page,
});

function Page() {
  return (
    <MarketplaceShell variant="flow">
      <section className="mx-auto max-w-lg px-4 py-32 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-warning/40 bg-warning/10 text-warning"><UserX className="h-8 w-8" aria-hidden /></span>
        <h1 className="text-display mt-6 text-2xl">That agent isn't available right now</h1>
        <p className="mt-3 text-sm text-muted-foreground">We never substitute another agent silently. Choose how you'd like to continue.</p>
        <div className="mt-8 grid gap-3 text-left">
          <Link to="/schedule" className="rounded-2xl border border-primary/40 bg-primary/5 p-4 hover:bg-primary/10"><p className="font-semibold">Same agency, no specific agent</p><p className="text-sm text-muted-foreground">We'll route you to the next available person there.</p></Link>
          <Link to="/select" className={cn(surfaceClass({ padding: "sm" }), "hover:bg-accent")}><p className="font-semibold">Shop on my own</p><p className="text-sm text-muted-foreground">Continue self-service where available.</p></Link>
          <Link to="/" className={cn(surfaceClass({ padding: "sm" }), "hover:bg-accent")}><p className="font-semibold">Marketplace home</p></Link>
        </div>
      </section>
    </MarketplaceShell>
  );
}
