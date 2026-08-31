/**
 * UX-016 — Consumer Dashboard (Member workspace)
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShoppingBag, MessageSquare, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { MemberShell } from "@/components/abox/member-shell";
import { PageHeader } from "@/components/abox/page-header";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { useCart, cartTotals } from "@/lib/cart-store";
import { loadQuoteState } from "@/lib/quote-store";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/member/")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-016"].name} — ABox` }, { name: "description", content: SCREENS["UX-016"].purpose }] }),
  component: Page,
});

function Page() {
  const cart = useCart();
  const totals = cartTotals(cart.items);
  const quote = typeof window === "undefined" ? null : loadQuoteState();
  const hasQuote = !!quote?.zip;

  return (
    <MemberShell>
      <PageHeader
        scrId="UX-016" eyebrow="Your workspace"
        title="Welcome back"
        description="Everything you're comparing, saving, and enrolling in — in one place."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Cart items" value={totals.count} icon={ShoppingBag} tone="primary" hint={`$${totals.monthly}/mo`} />
        <KpiCard label="Saved plans" value={cart.savedPlanIds.length} icon={CheckCircle2} tone="sage" />
        <KpiCard label="Unread messages" value={2} icon={MessageSquare} hint="From your agent" />
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <p className="font-medium">Pick up where you left off</p>
          </div>
          {hasQuote ? (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                You started a quote for ZIP <span className="text-foreground">{quote.zip}</span>
                {quote.county ? <> · {quote.county}</> : null}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {quote.priorities?.map((p) => <StatusBadge key={p} tone="primary">{p}</StatusBadge>)}
                {quote.usage && <StatusBadge tone="muted">{quote.usage} care</StatusBadge>}
              </div>
              <Link to="/quote" search={{ step: 1 }} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary story-link">
                Resume quote <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">You haven't started a quote yet.</p>
              <Link to="/quote" search={{ step: 1 }} className="mt-3 inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
                Start a quote
              </Link>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-medium">Your cart</p>
          {cart.items.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Nothing in your cart yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {cart.items.slice(0, 4).map((i) => (
                <li key={i.id} className="flex items-center justify-between">
                  <span className="truncate">{i.displayName}</span>
                  <span className="tabular-nums text-muted-foreground">${i.monthly}/mo</span>
                </li>
              ))}
              {cart.items.length > 4 && <li className="text-xs text-muted-foreground">+ {cart.items.length - 4} more</li>}
            </ul>
          )}
          <Link to="/cart" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary story-link">
            Go to cart <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-display text-2xl">Tasks</h2>
          <span className="text-xs text-muted-foreground">3 open</span>
        </div>
        <ul className="mt-3 divide-y divide-border text-sm">
          <TaskRow title="Review Plan-O explanation" due="Today" />
          <TaskRow title="Confirm household info" due="Tomorrow" />
          <TaskRow title="Add dental if needed" due="This week" />
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-dashed border-border-strong bg-surface/60 p-5 text-sm">
        <p className="text-eyebrow">Applications</p>
        <p className="mt-1">You don't have any applications in progress. Enrollments started from the cart show up here.</p>
        <Link to="/plans" className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
          <FileText className="h-4 w-4" aria-hidden /> Explore plans
        </Link>
      </section>
    </MemberShell>
  );
}
function TaskRow({ title, due }: { title: string; due: string }) {
  return (
    <li className="flex items-center justify-between py-3">
      <span>{title}</span>
      <span className="text-xs text-muted-foreground">Due {due}</span>
    </li>
  );
}
