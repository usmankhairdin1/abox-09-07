import { createFileRoute, Link } from "@tanstack/react-router";
import { MemberShell } from "@/components/abox/member-shell";
import { PageHeader } from "@/components/abox/page-header";
import { EmptyState } from "@/components/abox/empty-state";
import { StatusBadge } from "@/components/abox/status-badge";
import { PlanCard } from "@/components/abox/plan-card";
import { SAMPLE_PLANS } from "@/lib/sample-data";
import { cartStore, useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/member/quotes")({
  head: () => ({ meta: [{ title: "Saved Quotes — ABox Member" }, { name: "description", content: "Your saved quotes and plans." }] }),
  component: Page,
});

function Page() {
  const cart = useCart();
  const saved = SAMPLE_PLANS.filter((p) => cart.savedPlanIds.includes(p.id));
  return (
    <MemberShell>
      <PageHeader eyebrow="Your marketplace" title="Saved quotes & plans" description="Plans you saved for later. Add to cart when you're ready." />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge tone="muted">{saved.length} saved</StatusBadge>
        <Link to="/plans" className="text-sm text-primary story-link">Browse more</Link>
      </div>
      {saved.length === 0 ? (
        <EmptyState
          title="You haven't saved any plans yet"
          body="Tap Save on any plan card to keep it here."
          action={<Link to="/plans" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Go to plans</Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {saved.map((p) => (
            <PlanCard
              key={p.id} plan={p} saved
              inCart={cart.items.some((i) => i.id === p.id)}
              onSaveToggle={(pl) => cartStore.toggleSaved(pl.id)}
              onAdd={(pl) => cartStore.add({
                id: pl.id, productType: "ifp", displayName: pl.name, carrier: pl.carrier,
                monthly: pl.monthlyPremium, effectiveDate: "", status: "draft",
              })}
            />
          ))}
        </div>
      )}
    </MemberShell>
  );
}
