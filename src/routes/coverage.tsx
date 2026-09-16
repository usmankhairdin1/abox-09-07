/**
 * UX-012 — More Coverage & Ancillary Cards
 * Dental, vision, life, critical illness, accident, hospital indemnity.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { SAMPLE_ANCILLARY, type SampleAncillary } from "@/lib/sample-data";
import { cartStore, useCart, type ProductType } from "@/lib/cart-store";
import { loadQuoteState } from "@/lib/quote-store";
import { SCREENS } from "@/lib/screens";

const TYPE_TO_PRODUCT: Record<SampleAncillary["type"], ProductType> = {
  Dental: "dental", Vision: "vision", Life: "life",
  "Critical Illness": "critical", Accident: "accident", "Hospital Indemnity": "hospital",
};

export const Route = createFileRoute("/coverage")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-012"].name} — ABox` }, { name: "description", content: SCREENS["UX-012"].purpose }] }),
  component: Page,
});

function Page() {
  const cart = useCart();
  const quote = typeof window === "undefined" ? null : loadQuoteState();
  return (
    <MarketplaceShell product="dental">
      <div className="mx-auto max-w-[88rem] px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-6">
        <Link to="/plans" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to health plans
        </Link>
        <PageHeader
          scrId="UX-012" eyebrow="Round out your coverage"
          title="Add-on coverage"
          description="Ancillary and supplemental products you can bundle with your health plan or purchase alone."
          actions={
            <Link to="/plans" className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent">
              Shop plans
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_ANCILLARY.map((a) => {
            const inCart = cart.items.some((i) => i.id === a.id);
            return (
              <article key={a.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <p className="text-eyebrow">{a.type}</p>
                <h3 className="text-display mt-1 text-xl">{a.name}</h3>
                <p className="text-sm text-muted-foreground">{a.carrier}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-display text-3xl tabular-nums">${a.monthly}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-3 flex-1 space-y-1 text-sm">
                  <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />{a.highlight}</li>
                  <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />No exam required</li>
                  <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />Guaranteed acceptance</li>
                </ul>
                <button
                  disabled={inCart}
                  onClick={() => cartStore.add({
                    id: a.id, productType: TYPE_TO_PRODUCT[a.type], displayName: a.name, carrier: a.carrier,
                    monthly: a.monthly, effectiveDate: quote?.effectiveDate ?? "", status: "ready",
                  })}
                  className="mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {inCart ? "In cart" : (<><Plus className="h-4 w-4" aria-hidden /> Add to cart</>)}
                </button>
              </article>
            );
          })}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-border-strong bg-surface/60 p-5">
          <p className="text-sm text-muted-foreground">Bundling ancillary coverage with a health plan often lowers the total monthly premium.</p>
          <Link to="/cart" className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Review cart
          </Link>
        </div>
      </div>
    </MarketplaceShell>
  );
}
