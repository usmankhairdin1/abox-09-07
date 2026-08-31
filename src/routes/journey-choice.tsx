/**
 * SCR-M04-030 — Existing Journey or New Journey Choice.
 * Explicit resume-original, start-new or governed transfer choice
 * (REQ-M04-RTE-013/014).
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { clearQuoteState, getLastSavedAt } from "@/lib/quote-store";

export const Route = createFileRoute("/journey-choice")({
  head: () => ({ meta: [{ title: "Continue or start new — ABox" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const savedAt = getLastSavedAt();

  const resume = () => navigate({ to: "/quote", search: { step: 1 } });
  const startNew = () => { clearQuoteState(); navigate({ to: "/select" }); };

  return (
    <MarketplaceShell variant="flow">
      <section className="mx-auto max-w-lg px-4 py-24">
        <h1 className="text-display text-3xl text-center">You have an existing journey</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {savedAt ? `Saved ${new Date(savedAt).toLocaleString()}.` : "You have saved progress."} A new referral link never silently moves an existing journey — choose how to continue.
        </p>
        <div className="mt-8 space-y-3">
          <button onClick={resume} className="w-full rounded-2xl border border-primary/40 bg-primary/5 p-5 text-left hover:bg-primary/10">
            <p className="font-semibold">Resume my original journey</p>
            <p className="mt-1 text-sm text-muted-foreground">Keep your existing responsible organization and progress.</p>
          </button>
          <button onClick={startNew} className="w-full rounded-2xl border border-border bg-card p-5 text-left hover:bg-accent">
            <p className="font-semibold">Start a separate new journey</p>
            <p className="mt-1 text-sm text-muted-foreground">Begin fresh under the new referral context. Your original journey isn't deleted.</p>
          </button>
        </div>
      </section>
    </MarketplaceShell>
  );
}
