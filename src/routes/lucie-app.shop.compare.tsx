import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

import { EmptyState, Money, PageHeader, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { planById } from "@/lib/lucie-app/data";
import { subsidyEstimate, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/compare")({
  head: () => ({
    meta: [
      { title: "Compare plans — Northgate Marketplace" },
      { name: "description", content: "Compare up to three plans side by side on price, deductible, network and benefits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Compare plans" },
      { property: "og:description", content: "Side by side comparison of the plans you selected." },
    ],
  }),
  component: ComparePage,
});

const ROWS: { label: string; get: (p: NonNullable<ReturnType<typeof planById>>) => string }[] = [
  { label: "Carrier", get: (p) => p.carrier },
  { label: "Level", get: (p) => p.metal },
  { label: "Market", get: (p) => p.market },
  { label: "Deductible", get: (p) => `$${p.deductible.toLocaleString()}` },
  { label: "Out-of-pocket max", get: (p) => `$${p.oopMax.toLocaleString()}` },
  { label: "Primary care", get: (p) => p.primaryCare },
  { label: "Specialist", get: (p) => p.specialist },
  { label: "Generic drugs", get: (p) => p.generic },
  { label: "Network", get: (p) => p.network },
  { label: "HSA eligible", get: (p) => (p.hsa ? "Yes" : "No") },
  { label: "Fit score", get: (p) => `${p.fitScore}%` },
];

function ComparePage() {
  const { state, dispatch } = useLucie();
  const plans = state.compare.map(planById).filter(Boolean) as NonNullable<ReturnType<typeof planById>>[];
  const assistance = subsidyEstimate(state.household);

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to="/lucie-app/shop/plans">
          <ArrowLeft className="h-4 w-4" /> Back to plans
        </Link>
      </Button>
      <PageHeader eyebrow="Compare" title="Side by side" lede="Up to three plans, with your assistance already applied where it can be." />

      {plans.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            title="Nothing selected to compare"
            body="Tick the compare box on any plan card to bring it here."
            action={
              <Button asChild size="sm" variant="outline">
                <Link to="/lucie-app/shop/plans">Choose plans</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="w-40 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Feature
                </th>
                {plans.map((p) => {
                  const net =
                    p.kind === "medical" && p.market === "on-exchange" && assistance.eligible
                      ? Math.max(0, p.premium - assistance.monthly)
                      : p.premium;
                  return (
                    <th key={p.id} className="min-w-[190px] px-4 py-3 text-left align-top">
                      <div className="grid gap-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-display text-sm font-semibold">{p.name}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${p.name} from comparison`}
                            onClick={() => dispatch({ type: "compare:toggle", planId: p.id })}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-display text-lg font-semibold">
                          <Money value={net} per="mo" />
                        </span>
                        <StatusChip tone="info">{p.kind}</StatusChip>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-border/70 last:border-0">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{r.label}</th>
                  {plans.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-sm">
                      {r.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3" />
                {plans.map((p) => {
                  const inCart = state.cart.some((c) => c.planId === p.id);
                  return (
                    <td key={p.id} className="px-4 py-3">
                      <Button
                        size="sm"
                        disabled={inCart}
                        onClick={() => {
                          dispatch({ type: "cart:add", planId: p.id, members: state.household.applicants.length });
                          toast.success(`${p.name} added to your cart.`);
                        }}
                      >
                        {inCart ? "In cart" : "Add to cart"}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
