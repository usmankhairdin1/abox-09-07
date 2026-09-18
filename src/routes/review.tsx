/**
 * UX-014 — Review & Enroll Gate
 * Per-product review and validation. Explains the next step per product
 * (on-exchange handoff vs off-exchange enrollment).
 */
import { surfaceClass } from "@/components/abox/surface";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { EmptyState } from "@/components/abox/empty-state";
import { StatusBadge } from "@/components/abox/status-badge";
import { useCart, PRODUCT_LABEL, type ProductType } from "@/lib/cart-store";
import { loadQuoteState } from "@/lib/quote-store";
import { resolvePathway } from "@/lib/lucie-release";
import { useAuthSession } from "@/lib/auth-session";
import { SaveContinueButton } from "@/components/abox/save-continue-button";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/review")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-014"].name} — ABox` }, { name: "description", content: SCREENS["UX-014"].purpose }] }),
  component: Page,
});

function Page() {
  const cart = useCart();
  const quote = typeof window === "undefined" ? null : loadQuoteState();
  const grouped = cart.items.reduce<Record<string, typeof cart.items>>((acc, i) => {
    (acc[i.productType] = acc[i.productType] ?? []).push(i); return acc;
  }, {});
  const hasQuote = !!(quote?.zip && quote.members?.length);
  const { session } = useAuthSession();
  const hasAccount = !!session;

  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-[88rem] px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-6">
        <PageHeader
          scrId="UX-014" eyebrow="Almost there"
          title="Review before you enroll"
          description="We'll take you to the exchange for on-exchange plans and to a licensed application for off-exchange plans."
          actions={cart.items.length > 0 && <SaveContinueButton />}
        />

        {cart.items.length === 0 ? (
          <EmptyState
            title="Nothing to review"
            body="Add plans to your cart before you enroll."
            action={<Link to="/plans" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Browse plans</Link>}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <Checklist
                items={[
                  { label: "Quote details captured", ok: hasQuote, hint: hasQuote ? "ZIP, household, priorities on file" : "Return to the quote wizard" },
                  { label: "Cart has at least one plan", ok: cart.items.length > 0 },
                  { label: "Account created", ok: hasAccount, hint: hasAccount ? "Signed in" : "Register or sign in to enroll" },
                ]}
              />

              {(Object.keys(grouped) as ProductType[]).map((type) => (
                <section key={type} className={surfaceClass()}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-display text-2xl">{PRODUCT_LABEL[type]}</h2>
                    <span className="text-xs text-muted-foreground">{grouped[type].length} item(s)</span>
                  </div>
                  <ul className="mt-3 divide-y divide-border">
                    {grouped[type].map((i) => (
                      <li key={i.id} className="flex items-start justify-between gap-4 py-3">
                        <div>
                          <p className="font-medium">{i.displayName}</p>
                          <p className="text-xs text-muted-foreground">{i.carrier} · Effective {i.effectiveDate || "TBD"}</p>
                        </div>
                        <div className="text-right">
                          <p className="tabular-nums font-medium">${i.monthly}/mo</p>
                          <StatusBadge tone={i.meta?.onExchange === false ? "primary" : "info"}>
                            {i.meta?.onExchange === false ? "Off-exchange" : "On-exchange (QHP)"}
                          </StatusBadge>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-2 rounded-xl bg-surface/70 p-3 text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Next step: </span>
                      {type === "ifp"
                        ? "On-exchange plans go to healthcare.gov via a JET handoff. Off-exchange plans continue in the app."
                        : "This coverage is submitted directly through the carrier application flow."}
                    </p>
                    {grouped[type].map((i) => {
                      const p = resolvePathway({ productType: i.productType, carrier: i.carrier, onExchange: i.meta?.onExchange !== false });
                      return (
                        <p key={i.id}>
                          <span className="text-foreground">{i.displayName}</span> — {p.label}. {p.notProof}
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <aside className="space-y-4">
              <div className="sticky top-24 space-y-4">
                <div className={surfaceClass()}>
                  <p className="text-eyebrow">Total (illustrative)</p>
                  <p className="text-display mt-2 text-3xl tabular-nums">
                    ${cart.items.reduce((s, i) => s + i.monthly, 0)}<span className="text-sm text-muted-foreground">/mo</span>
                  </p>
                  {!hasAccount && (
                    <Link to="/auth" className="mt-4 flex w-full items-center justify-center gap-1 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Continue to sign in <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {hasAccount && (
                    <Link to="/handoff" className="mt-4 flex w-full items-center justify-center gap-1 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Continue to JET handoff <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {cart.items.some((i) => resolvePathway({ productType: i.productType, carrier: i.carrier, onExchange: i.meta?.onExchange !== false }).output !== "handoff") && (
                    <Link to="/apply" className="mt-2 flex w-full items-center justify-center gap-1 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface">
                      Start off-exchange application <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Plan availability, network, and pricing are subject to carrier and exchange confirmation.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </MarketplaceShell>
  );
}

function Checklist({ items }: { items: { label: string; ok: boolean; hint?: string }[] }) {
  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-3 px-5 py-3">
          {i.ok
            ? <Check className="h-4 w-4 text-sage" aria-hidden />
            : <AlertTriangle className="h-4 w-4 text-warning" aria-hidden />}
          <div className="flex-1">
            <p className="text-sm font-medium">{i.label}</p>
            {i.hint && <p className="text-xs text-muted-foreground">{i.hint}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
