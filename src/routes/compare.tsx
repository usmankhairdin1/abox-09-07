/**
 * UX-011 — Plan Comparison
 * Side-by-side compare up to 5 plans, expandable rows.
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, X, ChevronDown } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { EmptyState } from "@/components/abox/empty-state";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_PLANS, type SamplePlan } from "@/lib/sample-data";
import { cartStore, useCart } from "@/lib/cart-store";
import { loadQuoteState } from "@/lib/quote-store";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-011"].name} — ABox` }, { name: "description", content: SCREENS["UX-011"].purpose }] }),
  component: Page,
});

interface Section { key: string; label: string; rows: Array<{ label: string; get: (p: SamplePlan) => React.ReactNode; }>; }
const SECTIONS: Section[] = [
  { key: "cost", label: "Costs", rows: [
    { label: "Monthly premium", get: (p) => `$${p.monthlyPremium}` },
    { label: "Deductible",      get: (p) => `$${p.deductible.toLocaleString()}` },
    { label: "OOP maximum",     get: (p) => `$${p.oopMax.toLocaleString()}` },
    { label: "PCP copay",       get: (p) => `$${p.pcpCopay}` },
    { label: "Specialist",      get: (p) => `$${p.specialistCopay}` },
    { label: "Generic Rx",      get: (p) => `$${p.genericRx}` },
  ]},
  { key: "meta", label: "Plan attributes", rows: [
    { label: "Metal tier",  get: (p) => p.metalTier },
    { label: "Network",     get: (p) => p.networkType },
    { label: "Exchange",    get: (p) => p.onExchange ? "On (QHP)" : "Off" },
    { label: "HSA-eligible", get: (p) => p.hsaEligible ? "Yes" : "No" },
    { label: "Plan-O match", get: (p) => `${p.planOMatch}%` },
    { label: "Rating",       get: (p) => p.rating.toFixed(1) },
  ]},
  { key: "highlights", label: "Highlights", rows: [
    { label: "Highlights", get: (p) => (
      <ul className="space-y-1">
        {p.highlights.map((h) => <li key={h}>• {h}</li>)}
      </ul>
    )},
  ]},
];

function Page() {
  const cart = useCart();
  const quote = typeof window === "undefined" ? null : loadQuoteState();
  const plans = cart.compareIds
    .map((id) => SAMPLE_PLANS.find((p) => p.id === id))
    .filter((p): p is SamplePlan => !!p);
  const [open, setOpen] = useState<Record<string, boolean>>({ cost: true, meta: true, highlights: true });

  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <Link to="/plans" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Link>
        <PageHeader
          scrId="UX-011" eyebrow="Comparison"
          title={`Compare ${plans.length} plan${plans.length === 1 ? "" : "s"}`}
          description="Side-by-side view. Toggle sections open or closed. Add the winner to your cart."
          actions={plans.length > 0 && (
            <button onClick={() => cartStore.clearCompare()} className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent">
              Clear comparison
            </button>
          )}
        />

        {plans.length === 0 ? (
          <EmptyState
            title="Nothing to compare yet"
            body="Pick up to 5 plans from the results page. You can compare across metal tier, network, and cost."
            action={<Link to="/plans" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Go to plans</Link>}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid" style={{ gridTemplateColumns: `220px repeat(${plans.length}, minmax(200px, 1fr))` }}>
              <div className="border-b border-border p-4 bg-surface" />
              {plans.map((p) => (
                <div key={p.id} className="border-b border-l border-border p-4 relative">
                  <button
                    onClick={() => cartStore.toggleCompare(p.id)}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
                    aria-label={`Remove ${p.name} from comparison`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <p className="text-eyebrow">{p.carrier}</p>
                  <Link to="/plans/$planId" params={{ planId: p.id }} className="story-link mt-1 block text-sm font-medium leading-tight">
                    {p.name}
                  </Link>
                  <div className="mt-2 text-display text-2xl tabular-nums">${p.monthlyPremium}<span className="text-xs text-muted-foreground">/mo</span></div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <StatusBadge tone="sage">{p.metalTier}</StatusBadge>
                    <StatusBadge tone="muted">{p.networkType}</StatusBadge>
                  </div>
                  <button
                    onClick={() => cartStore.add({
                      id: p.id, productType: "ifp", displayName: p.name, carrier: p.carrier,
                      monthly: p.monthlyPremium, effectiveDate: quote?.effectiveDate ?? "",
                      status: "draft",
                    })}
                    disabled={cart.items.some((i) => i.id === p.id)}
                    className="mt-3 w-full rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                  >
                    {cart.items.some((i) => i.id === p.id) ? "In cart" : "Add to cart"}
                  </button>
                </div>
              ))}
            </div>

            {SECTIONS.map((section) => (
              <div key={section.key}>
                <button
                  onClick={() => setOpen((o) => ({ ...o, [section.key]: !o[section.key] }))}
                  className="flex w-full items-center justify-between border-b border-border bg-surface/60 px-4 py-3 text-left text-sm font-medium hover:bg-surface"
                  aria-expanded={!!open[section.key]}
                >
                  {section.label}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", open[section.key] && "rotate-180")} />
                </button>
                {open[section.key] && section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid border-b border-border last:border-b-0"
                    style={{ gridTemplateColumns: `220px repeat(${plans.length}, minmax(200px, 1fr))` }}
                  >
                    <div className="p-4 text-xs uppercase tracking-widest text-muted-foreground">{row.label}</div>
                    {plans.map((p) => (
                      <div key={p.id} className="border-l border-border p-4 text-sm tabular-nums">{row.get(p)}</div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </MarketplaceShell>
  );
}
