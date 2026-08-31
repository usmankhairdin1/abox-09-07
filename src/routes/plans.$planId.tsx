/**
 * UX-010 — Plan Detail
 * Benefits, costs, network + Rx, Plan-O explanation. Add to cart / compare.
 */
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ArrowLeft, ShoppingBag, Star, Sparkles, Stethoscope, Pill } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { PageHeader } from "@/components/abox/page-header";
import { SAMPLE_PLANS } from "@/lib/sample-data";
import { SAMPLE_PROVIDERS, SAMPLE_DRUGS } from "@/lib/sample-data-ext";
import { cartStore, useCart } from "@/lib/cart-store";
import { SCREENS } from "@/lib/screens";
import { loadQuoteState } from "@/lib/quote-store";

export const Route = createFileRoute("/plans/$planId")({
  loader: ({ params }) => {
    const plan = SAMPLE_PLANS.find((p) => p.id === params.planId);
    if (!plan) throw notFound();
    return { plan };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.plan.name} — ABox` : "Plan not found — ABox" },
      { name: "description", content: SCREENS["UX-010"].purpose },
    ],
  }),
  notFoundComponent: NotFound,
  component: Page,
});

function NotFound() {
  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-eyebrow">Plan not found</p>
        <h1 className="text-display mt-2 text-4xl">We couldn't find that plan.</h1>
        <Link to="/plans" className="mt-6 inline-flex items-center gap-1 text-sm text-primary story-link">
          Back to results
        </Link>
      </div>
    </MarketplaceShell>
  );
}

function Page() {
  const { plan } = Route.useLoaderData();
  const cart = useCart();
  const quote = typeof window === "undefined" ? null : loadQuoteState();
  const inCart = cart.items.some((i) => i.id === plan.id);

  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <Link to="/plans" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Link>

        <PageHeader
          scrId="UX-010"
          eyebrow={plan.carrier}
          title={plan.name}
          description={`${plan.metalTier} · ${plan.networkType} · ${plan.onExchange ? "On-exchange (QHP)" : "Off-exchange"}`}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => cartStore.toggleCompare(plan.id)}
                aria-pressed={cart.compareIds.includes(plan.id)}
                className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent"
              >
                {cart.compareIds.includes(plan.id) ? "In compare" : "Add to compare"}
              </button>
              <button
                disabled={inCart}
                onClick={() => cartStore.add({
                  id: plan.id, productType: "ifp", displayName: plan.name, carrier: plan.carrier,
                  monthly: plan.monthlyPremium, effectiveDate: quote?.effectiveDate ?? "",
                  status: "draft",
                })}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden />
                {inCart ? "In cart" : "Add to cart"}
              </button>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Plan-O explanation */}
            <div className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                <p className="text-sm font-medium">Plan-O match {plan.planOMatch}%</p>
              </div>
              <p className="mt-2 text-sm text-foreground/80">
                Ranks {plan.planOMatch >= 85 ? "strongly" : "moderately"} for {quote?.priorities?.length ? quote.priorities.join(", ") : "your priorities"}.
                Educational match score, not a promise.
              </p>
            </div>

            {/* Benefits & costs */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-display text-2xl">What you'd pay</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Stat label="Monthly premium" value={`$${plan.monthlyPremium}`} large />
                <Stat label="Deductible" value={`$${plan.deductible.toLocaleString()}`} />
                <Stat label="Out-of-pocket max" value={`$${plan.oopMax.toLocaleString()}`} />
                <Stat label="Coinsurance" value="20% after ded." />
                <Stat label="PCP visit" value={`$${plan.pcpCopay}`} />
                <Stat label="Specialist" value={`$${plan.specialistCopay}`} />
                <Stat label="Generic Rx" value={`$${plan.genericRx}`} />
                <Stat label="Urgent care" value="$65" />
              </div>
            </section>

            {/* Highlights */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-display text-2xl">Highlights</h2>
              <ul className="mt-3 grid gap-2 md:grid-cols-2">
                {plan.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
                {plan.hsaEligible && (
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
                    HSA-eligible — pair with tax-advantaged savings
                  </li>
                )}
              </ul>
            </section>

            {/* Network & Rx */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-display text-2xl">Network & prescriptions</h2>
                <span className="text-xs text-muted-foreground">Educational — check the carrier's directory for enrollment.</span>
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-eyebrow">
                    <Stethoscope className="h-3.5 w-3.5" aria-hidden /> Providers
                  </p>
                  <ul className="space-y-2 text-sm">
                    {SAMPLE_PROVIDERS.slice(0, 4).map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.specialty} · {p.system}</p>
                        </div>
                        <StatusBadge tone={p.inNetwork ? "sage" : "warning"}>
                          {p.inNetwork ? "In network" : "Out of network"}
                        </StatusBadge>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-eyebrow">
                    <Pill className="h-3.5 w-3.5" aria-hidden /> Prescriptions
                  </p>
                  <ul className="space-y-2 text-sm">
                    {SAMPLE_DRUGS.slice(0, 4).map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                        <div>
                          <p className="font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground">Tier {d.tier} · {d.generic ? "Generic" : "Brand"}</p>
                        </div>
                        <span className="tabular-nums text-xs">~${d.monthlyEstimate}/mo</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Disclosure */}
            <p className="text-xs text-muted-foreground">
              QHP display follows federal requirements. Prescriptions & network estimates are illustrative and may
              vary by pharmacy, specialty, and carrier tier updates.
            </p>
          </div>

          {/* Right — sticky summary */}
          <aside className="space-y-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-eyebrow">Estimated cost</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-display text-4xl tabular-nums">${plan.monthlyPremium}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Before any subsidy</p>
                <div className="mt-4 space-y-1.5 text-sm">
                  <Row label="Rating" value={<span className="inline-flex items-center gap-0.5"><Star className="h-3 w-3 fill-primary text-primary" /> {plan.rating.toFixed(1)}</span>} />
                  <Row label="Network" value={plan.networkType} />
                  <Row label="Metal" value={plan.metalTier} />
                  <Row label="On-exchange" value={plan.onExchange ? "Yes" : "No"} />
                </div>
              </div>
              <Link to="/coverage" className="block rounded-2xl border border-dashed border-border-strong p-4 text-center text-sm hover:bg-accent">
                Explore add-on coverage
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </MarketplaceShell>
  );
}

function Stat({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <p className="text-eyebrow">{label}</p>
      <p className={`mt-1 tabular-nums ${large ? "text-display text-2xl" : "font-medium"}`}>{value}</p>
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
