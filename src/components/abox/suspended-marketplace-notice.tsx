/**
 * Shared unavailable-marketplace notice — used at the root landing when
 * the marketplace is SUSPENDED/ENDED (REQ-M04-MKT-014) and at the
 * dedicated SCR-M04-033 route. New starts are blocked; sign-in and
 * existing-record continuity remain available.
 */
import { Link } from "@tanstack/react-router";
import { PauseCircle, LogIn } from "lucide-react";

export function SuspendedMarketplaceNotice({ ended = false }: { ended?: boolean }) {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-warning/40 bg-warning/10 text-warning">
        <PauseCircle className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="text-display mt-6 text-3xl">{ended ? "This marketplace has closed" : "New shopping is temporarily paused"}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {ended
          ? "This marketplace is no longer accepting new activity. If you have an existing account, you can still sign in to reach your records."
          : "We're not accepting new quotes or applications right now, but your saved quotes, applications and messages are still safe. Sign in to pick up where you left off."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform">
          <LogIn className="h-4 w-4" aria-hidden /> Sign in to my account
        </Link>
        <Link to="/support" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">
          Contact support
        </Link>
      </div>
    </section>
  );
}
