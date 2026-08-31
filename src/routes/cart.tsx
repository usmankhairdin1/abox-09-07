/**
 * UX-013 — Cart Drawer (rendered as a full page + grouped by product type)
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { EmptyState } from "@/components/abox/empty-state";
import { StatusBadge } from "@/components/abox/status-badge";
import { cartStore, cartTotals, useCart, PRODUCT_LABEL, type ProductType } from "@/lib/cart-store";
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

  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <PageHeader
          scrId="UX-013" eyebrow="Your selections"
          title="Cart"
          description="Grouped by product type. Each item lists its effective term, plan, and status."
          actions={cart.items.length > 0 && (
            <Link to="/review" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Review & enroll <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        />

        {cart.items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            body="Add a health plan, then optionally bundle dental, vision, or life."
            action={<Link to="/plans" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Browse plans</Link>}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {(Object.keys(grouped) as ProductType[]).map((type) => (
                <section key={type} className="rounded-2xl border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h2 className="text-display text-lg">{PRODUCT_LABEL[type]}</h2>
                    <span className="text-xs text-muted-foreground">{grouped[type].length} item{grouped[type].length > 1 ? "s" : ""}</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {grouped[type].map((i) => (
                      <li key={i.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                        <div className="min-w-0">
                          <p className="text-eyebrow">{i.carrier}</p>
                          <p className="font-medium">{i.displayName}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                            <span>Effective {i.effectiveDate || "TBD"}</span>
                            <span>·</span>
                            <StatusBadge tone={i.status === "ready" ? "sage" : i.status === "needs-info" ? "warning" : "muted"}>
                              {i.status.replaceAll("-", " ")}
                            </StatusBadge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="tabular-nums text-sm">
                            <span className="text-display text-lg">${i.monthly}</span>
                            <span className="text-muted-foreground">/mo</span>
                          </span>
                          <button
                            onClick={() => cartStore.remove(i.id)}
                            aria-label={`Remove ${i.displayName}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <aside className="space-y-4">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
                <p className="text-eyebrow">Total (illustrative)</p>
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
        )}
      </div>
    </MarketplaceShell>
  );
}
