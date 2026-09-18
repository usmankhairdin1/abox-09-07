/**
 * UX-023 — JET Handoff Confirmation
 */
import { surfaceClass } from "@/components/abox/surface";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Check, PackageCheck } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { StatusBadge } from "@/components/abox/status-badge";
import { EmptyState } from "@/components/abox/empty-state";
import { useCart, PRODUCT_LABEL, type ProductType } from "@/lib/cart-store";
import { loadQuoteState } from "@/lib/quote-store";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/handoff")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-023"].name} — ABox` }, { name: "description", content: SCREENS["UX-023"].purpose }] }),
  component: Page,
});

function Page() {
  const cart = useCart();
  const quote = typeof window === "undefined" ? null : loadQuoteState();
  const onExchange = cart.items.filter((i) => i.meta?.onExchange !== false && i.productType === "ifp");
  const offExchange = cart.items.filter((i) => !(i.meta?.onExchange !== false && i.productType === "ifp"));

  return (
    <MarketplaceShell showAssistant={false}>
      <div className="mx-auto max-w-4xl px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6">
        <PageHeader
          scrId="UX-023" eyebrow="Handoff ready"
          title="Your handoff packet is prepared"
          description="Open the on-exchange plans in a new tab to finish enrollment via healthcare.gov. Off-exchange plans continue inside ABox."
        />

        {cart.items.length === 0 ? (
          <EmptyState title="No plans to hand off" body="Add a plan to your cart first." action={
            <Link to="/plans" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Browse plans</Link>
          } />
        ) : (
          <div className="space-y-6">
            <div className={surfaceClass()}>
              <div className="flex items-start gap-3">
                <PackageCheck className="mt-0.5 h-5 w-5 text-sage" aria-hidden />
                <div className="flex-1">
                  <p className="font-medium">Handoff packet</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• ZIP: <span className="text-foreground">{quote?.zip || "—"}</span></li>
                    <li>• Household: <span className="text-foreground">{quote?.members?.length ?? 0} member(s)</span></li>
                    <li>• Effective date: <span className="text-foreground">{quote?.effectiveDate || "—"}</span></li>
                    <li>• Priorities: <span className="text-foreground">{quote?.priorities?.join(", ") || "—"}</span></li>
                    <li>• Handoff token: <span className="tabular-nums text-foreground">HND-{Date.now().toString(36).toUpperCase()}</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {onExchange.length > 0 && (
              <section className={surfaceClass()}>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-display text-2xl">On-exchange (QHP)</h2>
                  <StatusBadge tone="info">{onExchange.length} plan(s)</StatusBadge>
                </div>
                <ul className="mt-3 divide-y divide-border">
                  {onExchange.map((i) => (
                    <li key={i.id} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="font-medium">{i.displayName}</p>
                        <p className="text-xs text-muted-foreground">{i.carrier}</p>
                      </div>
                      <span className="tabular-nums">${i.monthly}/mo</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://www.healthcare.gov" target="_blank" rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Open JET marketplace <ExternalLink className="h-4 w-4" />
                </a>
              </section>
            )}

            {offExchange.length > 0 && (
              <section className={surfaceClass()}>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-display text-2xl">Continue inside ABox</h2>
                  <StatusBadge tone="primary">{offExchange.length} item(s)</StatusBadge>
                </div>
                <ul className="mt-3 divide-y divide-border">
                  {offExchange.map((i) => (
                    <li key={i.id} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="font-medium">{i.displayName}</p>
                        <p className="text-xs text-muted-foreground">{PRODUCT_LABEL[i.productType as ProductType]} · {i.carrier}</p>
                      </div>
                      <span className="tabular-nums">${i.monthly}/mo</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/member"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  Continue in member workspace
                </Link>
              </section>
            )}

            <div className="rounded-2xl border border-dashed border-border-strong bg-surface/60 p-5 text-sm">
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-sage" aria-hidden />
                <p>Cart status set to <span className="font-medium">Handed off</span>. You can track completion from your member workspace.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketplaceShell>
  );
}
