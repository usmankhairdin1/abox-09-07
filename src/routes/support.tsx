/**
 * SCR-M04-036 — Marketplace Support.
 * One current primary support route for marketplace and responsible
 * organization context (REQ-M04-RTE-026/027/028).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Phone, Mail, Clock } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { useMarketplaceState, getActiveContent } from "@/lib/marketplace-store";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — ABox" }] }),
  component: Page,
});

function Page() {
  const mkt = useMarketplaceState();
  const content = getActiveContent(mkt);

  return (
    <MarketplaceShell variant="flow">
      <section className="mx-auto max-w-lg px-4 py-24 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary"><LifeBuoy className="h-8 w-8" aria-hidden /></span>
        <h1 className="text-display mt-6 text-2xl">{content?.support_display_name ?? "Support"}</h1>
        {content?.support_intro_en && <p className="mt-3 text-sm text-muted-foreground">{content.support_intro_en}</p>}
        <div className="mt-8 space-y-3 text-left text-sm">
          {content?.support_phone && <p className="flex items-center gap-2 rounded-xl border border-border bg-card p-3"><Phone className="h-4 w-4 text-muted-foreground" /> {content.support_phone}</p>}
          {content?.support_email && <p className="flex items-center gap-2 rounded-xl border border-border bg-card p-3"><Mail className="h-4 w-4 text-muted-foreground" /> {content.support_email}</p>}
          {content?.support_hours && <p className="flex items-center gap-2 rounded-xl border border-border bg-card p-3"><Clock className="h-4 w-4 text-muted-foreground" /> {content.support_hours}</p>}
        </div>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent">Back to marketplace home</Link>
      </section>
    </MarketplaceShell>
  );
}
