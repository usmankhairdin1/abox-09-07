/**
 * UX-013 — Cart Drawer (rendered as a full page + grouped by product type)
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ArrowRight, ShoppingBag, ShoppingCart, FileText } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { EmptyState } from "@/components/abox/empty-state";
import { StatusBadge } from "@/components/abox/status-badge";
import { CarrierMark } from "@/components/abox/carrier-mark";
import { MetalBadge } from "@/components/abox/metal-badge";
import { cartStore, cartTotals, useCart, PRODUCT_LABEL, type ProductType } from "@/lib/cart-store";
import { SAMPLE_PLANS } from "@/lib/sample-data";
import { formatUSD } from "@/lib/format";
import { SaveContinueButton } from "@/components/abox/save-continue-button";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-013"].name} — ABox` }, { name: "description", content: SCREENS["UX-013"].purpose }] }),
  component: Page,
});

function Page() {
  const cart = useCart();
  const totals = cartTotals(cart.items);
  const grouped = cart.items.reduce<Record<string, typeof cart.items>>((acc, i) => {
    (acc[i.productType] = acc[i.productType] ?? []).push(i); return acc;
  }, {});
  const missingAddOns = (["dental", "vision", "life"] as ProductType[]).filter(
    (t) => !cart.items.some((i) => i.productType === t),
  );

  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-6">
        <PageHeader
          scrId="UX-013" eyebrow="Your selections"
          title="Cart"
          description="Review your selected plan, then continue to enrollment."
          icon={ShoppingCart}
          actions={cart.items.length > 0 && (
            <div className="flex items-center gap-2">
              <Link to="/plans" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm hover:bg-accent">
                <ShoppingBag className="h-4 w-4" aria-hidden /> Shop plans
              </Link>
              <SaveContinueButton />
            </div>
          )}
        />

        {cart.items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            body="Add a health plan, then optionally bundle dental, vision, or life."
            action={<Link to="/plans" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Browse plans</Link>}
          />
        ) : (
          <>
            {missingAddOns.length > 0 && (
              <div className="mb-5 rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-eyebrow">Add-ons available</p>
                    <p className="mt-1 text-xs text-muted-foreground">Pair extra coverage with your medical plan.</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {missingAddOns.map((t) => (
                        <span key={t} className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium">{PRODUCT_LABEL[t]}</span>
                      ))}
                    </div>
                  </div>
                  <Link to="/coverage" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Explore add-on coverage
                  </Link>
                </div>
              </div>
            )}
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {(Object.keys(grouped) as ProductType[]).map((type) => (
                <section key={type} className="rounded-2xl border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border px-5 py-2.5">
                    <h2 className="text-display text-lg">{PRODUCT_LABEL[type]}</h2>
                    <span className="text-xs text-muted-foreground">{grouped[type].length} item{grouped[type].length > 1 ? "s" : ""}</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {grouped[type].map((i) => {
                      const plan = SAMPLE_PLANS.find((p) => p.id === i.id);
                      return (
                      <li key={i.id} className="px-5 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <CarrierMark carrier={i.carrier} size={44} />
                            <div className="min-w-0">
                              <p className="text-eyebrow">{i.carrier}</p>
                              <p className="text-display text-lg leading-snug">{i.displayName}</p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                {plan && (
                                  <>
                                    <MetalBadge tier={plan.metalTier} />
                                    <span className="font-medium">{plan.networkType}</span>
                                    <span>·</span>
                                  </>
                                )}
                                <span>Effective {i.effectiveDate || "TBD"}</span>
                                <span>·</span>
                                <StatusBadge tone={i.status === "ready" ? "sage" : i.status === "needs-info" ? "warning" : "muted"}>
                                  {i.status.replaceAll("-", " ")}
                                </StatusBadge>
                              </div>
                              {plan && (
                                <div className="mt-2.5 grid max-w-md grid-cols-3 gap-2 text-xs">
                                  <div className="rounded-lg bg-surface px-2.5 py-1.5">
                                    <p className="text-muted-foreground">Deductible</p>
                                    <p className="font-medium tabular-nums">{formatUSD(plan.deductible)}</p>
                                  </div>
                                  <div className="rounded-lg bg-surface px-2.5 py-1.5">
                                    <p className="text-muted-foreground">Out-of-pocket max</p>
                                    <p className="font-medium tabular-nums">{formatUSD(plan.oopMax)}</p>
                                  </div>
                                  <div className="rounded-lg bg-surface px-2.5 py-1.5">
                                    <p className="text-muted-foreground">Primary care visit</p>
                                    <p className="font-medium tabular-nums">{formatUSD(plan.pcpCopay)}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="tabular-nums">
                              <span className="text-display text-2xl">${i.monthly}</span>
                              <span className="text-sm text-muted-foreground">/mo</span>
                            </span>
                            <button
                              onClick={() => cartStore.remove(i.id)}
                              aria-label={`Remove ${i.displayName}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 pl-[56px]">
                          <Link
                            to="/plans/$planId"
                            params={{ planId: i.id }}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:bg-accent"
                          >
                            <FileText className="h-4 w-4" aria-hidden /> Plan details
                          </Link>
                        </div>
                       </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>

            <aside className="space-y-4">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
                <p className="text-eyebrow">Total</p>
                <p className="text-display mt-2 text-3xl tabular-nums">${totals.monthly}<span className="text-sm text-muted-foreground">/mo</span></p>
                <p className="mt-1 text-xs text-muted-foreground">Before subsidies, if eligible.</p>
                <div className="mt-5 space-y-1 text-xs text-muted-foreground">
                  {Object.entries(totals.byType).map(([t, n]) => (
                    <div key={t} className="flex items-center justify-between">
                      <span>{PRODUCT_LABEL[t as ProductType] ?? t}</span>
                      <span className="tabular-nums">{n} item{n > 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
                <Link to="/review" className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Review & enroll <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => cartStore.clear()}
                  className="mt-3 w-full text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear cart
                </button>
              </div>

            </aside>
          </div>
          </>
        )}
      </div>
    </MarketplaceShell>
  );
}
