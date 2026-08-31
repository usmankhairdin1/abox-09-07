import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState, Money, PageHeader, Section, StatusChip, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { planById } from "@/lib/lucie-app/data";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { subsidyEstimate, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Northgate Marketplace" },
      { name: "description", content: "Review the plans you selected, check what each one still needs, and continue to the application." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Your cart" },
      { property: "og:description", content: "Mixed product cart with readiness checks before you apply." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { state, dispatch } = useLucie();
  const navigate = useNavigate();
  const assistance = subsidyEstimate(state.household);

  const lines = state.cart
    .map((l) => ({ line: l, plan: planById(l.planId) }))
    .filter((x): x is { line: typeof x.line; plan: NonNullable<typeof x.plan> } => Boolean(x.plan));

  const net = (p: NonNullable<ReturnType<typeof planById>>) =>
    p.kind === "medical" && p.market === "on-exchange" && assistance.eligible
      ? Math.max(0, p.premium - assistance.monthly)
      : p.premium;

  const monthly = lines.reduce((s, x) => s + net(x.plan), 0);
  const hasExchange = lines.some((x) => x.plan.market === "on-exchange" && x.plan.kind === "medical");

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={2} />
      <PageHeader
        eyebrow="Step 3 of 9"
        title="Your cart"
        lede="Each item is checked before you can continue. Items follow different paths — medical marketplace cover continues on the exchange, everything else is completed here."
      />

      {lines.length === 0 ? (
        <Card className="p-10">
          <EmptyState
            title="Your cart is empty"
            body="Add a plan from the results page and it will appear here with its own readiness checks."
            action={
              <Button asChild size="sm">
                <Link to="/lucie-app/shop/plans">Browse plans</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Section title={`${lines.length} item${lines.length === 1 ? "" : "s"}`}>
            <div className="grid gap-3">
              {lines.map(({ line, plan }) => (
                <Card key={plan.id} className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0 grid gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusChip tone="info">{plan.kind}</StatusChip>
                      <StatusChip tone={plan.market === "on-exchange" ? "warn" : "good"}>
                        {plan.market === "on-exchange" ? "Continues on the exchange" : "Completed here"}
                      </StatusChip>
                      <StatusChip tone="good">Ready</StatusChip>
                    </div>
                    <p className="font-display text-base font-semibold">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {plan.carrier} · covering {line.members} {line.members === 1 ? "person" : "people"} from{" "}
                      {new Date(state.household.coverageStart).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="grid justify-items-end gap-2">
                    <span className="font-display text-lg font-semibold">
                      <Money value={net(plan)} per="mo" />
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        dispatch({ type: "cart:remove", planId: plan.id });
                        toast.success("Removed from cart.");
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {hasExchange ? (
              <Card className="flex gap-3 border-warning/30 bg-warning/5 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  One item is a marketplace medical plan. After you review your details we hand you over to the
                  exchange to finish that enrolment; you will come back here to see the status. Your other items are
                  completed on this site.
                </p>
              </Card>
            ) : null}
          </Section>

          <aside className="grid content-start gap-3">
            <Card className="grid gap-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Monthly total</p>
              <p className="font-display text-3xl font-semibold">
                <Money value={monthly} per="mo" />
              </p>
              {assistance.eligible ? (
                <p className="text-xs text-success">${assistance.monthly}/month assistance already applied.</p>
              ) : null}
              <div className="grid gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                {lines.map(({ plan }) => (
                  <div key={plan.id} className="flex justify-between gap-4">
                    <span className="truncate">{plan.name}</span>
                    <span className="tabular-nums">${net(plan)}</span>
                  </div>
                ))}
              </div>
              <Button
                className="mt-1"
                onClick={() => void navigate({ to: state.registered ? "/lucie-app/shop/application" : "/lucie-app/shop/register" })}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/lucie-app/shop/plans">Keep shopping</Link>
              </Button>
            </Card>
          </aside>
        </div>
      )}
    </>
  );
}
