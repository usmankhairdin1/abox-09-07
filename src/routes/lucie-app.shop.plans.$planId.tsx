import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

import { Money, PageHeader, Section, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { planById } from "@/lib/lucie-app/data";
import { subsidyEstimate, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/plans/$planId")({
  head: () => ({
    meta: [
      { title: "Plan details — Northgate Marketplace" },
      {
        name: "description",
        content: "Full benefit detail, network, drug tiers and estimated yearly cost for the selected plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Plan details" },
      { property: "og:description", content: "Benefits, network and yearly cost estimate for this plan." },
    ],
  }),
  component: PlanDetail,
});

function PlanDetail() {
  const { planId } = Route.useParams();
  const { state, dispatch } = useLucie();
  const navigate = useNavigate();
  const plan = planById(planId);

  if (!plan) {
    return (
      <Card className="grid gap-3 p-8 text-center">
        <p className="font-medium">We could not find that plan</p>
        <p className="text-xs text-muted-foreground">It may no longer be offered for your coverage start date.</p>
        <Button asChild variant="outline" className="mx-auto w-fit">
          <Link to="/lucie-app/shop/plans">Back to plans</Link>
        </Button>
      </Card>
    );
  }

  const assistance = subsidyEstimate(state.household);
  const net =
    plan.kind === "medical" && plan.market === "on-exchange" && assistance.eligible
      ? Math.max(0, plan.premium - assistance.monthly)
      : plan.premium;
  const inCart = state.cart.some((c) => c.planId === plan.id);
  const yearly = net * 12 + Math.round(plan.deductible * 0.35);

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
        <Link to="/lucie-app/shop/plans">
          <ArrowLeft className="h-4 w-4" /> All plans
        </Link>
      </Button>

      <PageHeader
        eyebrow={`${plan.carrier} · ${plan.network}`}
        title={plan.name}
        lede={plan.fitReason}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "compare:toggle", planId: plan.id })}
            >
              {state.compare.includes(plan.id) ? "Remove from compare" : "Add to compare"}
            </Button>
            <Button
              disabled={inCart}
              onClick={() => {
                dispatch({ type: "cart:add", planId: plan.id, members: state.household.applicants.length });
                toast.success("Added to your cart.");
                void navigate({ to: "/lucie-app/shop/cart" });
              }}
            >
              {inCart ? "Already in cart" : "Add to cart"}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <StatusChip tone="info">{plan.kind}</StatusChip>
            <StatusChip>{plan.metal}</StatusChip>
            <StatusChip tone={plan.market === "on-exchange" ? "good" : "warn"}>{plan.market}</StatusChip>
            {plan.hsa ? <StatusChip tone="good">HSA eligible</StatusChip> : null}
          </div>

          <Tabs defaultValue="benefits">
            <TabsList>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="drugs">Prescriptions</TabsTrigger>
              <TabsTrigger value="docs">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="benefits">
              <Card className="grid gap-0 p-0">
                {[
                  ["Monthly premium", `$${plan.premium}`],
                  ["Annual deductible", `$${plan.deductible.toLocaleString()}`],
                  ["Out-of-pocket maximum", `$${plan.oopMax.toLocaleString()}`],
                  ["Primary care visit", plan.primaryCare],
                  ["Specialist visit", plan.specialist],
                  ["Generic prescriptions", plan.generic],
                  ["Emergency room", "$500 copay after deductible"],
                  ["Preventive care", "No cost in network"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 gap-4 border-b border-border/70 px-5 py-3 text-sm last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </Card>
            </TabsContent>

            <TabsContent value="network">
              <Card className="grid gap-3 p-5 text-sm">
                <p className="font-medium">{plan.network}</p>
                <p className="text-xs text-muted-foreground">
                  Your saved providers were checked against this network when the plan was priced.
                </p>
                <div className="grid gap-2">
                  {[
                    ["Dr. Amelia Cross — Family medicine", true],
                    ["Riverbend Imaging Center", true],
                    ["Dr. Sanjay Oberoi — Dermatology", plan.id !== "PL-4830"],
                  ].map(([label, inNet]) => (
                    <p key={String(label)} className="flex items-center gap-2 text-xs">
                      <span
                        className={
                          inNet
                            ? "grid h-4 w-4 place-items-center rounded-full bg-success/15 text-success"
                            : "grid h-4 w-4 place-items-center rounded-full bg-destructive/15 text-destructive"
                        }
                      >
                        {inNet ? <Check className="h-3 w-3" /> : "!"}
                      </span>
                      {label} — {inNet ? "in network" : "out of network"}
                    </p>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="drugs">
              <Card className="grid gap-0 p-0">
                {[
                  ["Tier 1 — generic", plan.generic],
                  ["Tier 2 — preferred brand", "$45 copay"],
                  ["Tier 3 — non-preferred brand", "40% coinsurance"],
                  ["Tier 4 — specialty", "50% coinsurance to $250"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 gap-4 border-b border-border/70 px-5 py-3 text-sm last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </Card>
            </TabsContent>

            <TabsContent value="docs">
              <Card className="grid gap-2 p-5 text-sm">
                {["Summary of benefits and coverage", "Provider directory", "Drug formulary", "Plan brochure"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toast.info("Sample document — not available in the prototype.")}
                    className="w-fit text-left text-xs text-primary underline-offset-4 hover:underline"
                  >
                    {d}
                  </button>
                ))}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="grid content-start gap-3">
          <Card className="gap-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your price</p>
            <p className="font-display text-3xl font-semibold">
              <Money value={net} per="mo" />
            </p>
            {net !== plan.premium ? (
              <p className="text-xs text-muted-foreground">
                ${plan.premium}/mo before ${assistance.monthly} assistance.
              </p>
            ) : null}
            <div className="mt-2 border-t border-border pt-3 text-xs text-muted-foreground">
              Estimated yearly cost including typical use:{" "}
              <span className="font-medium text-foreground">${yearly.toLocaleString()}</span>
            </div>
          </Card>
          <Card className="gap-2 p-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Why this scored {plan.fitScore}%
            </p>
            <div className="grid gap-1.5">
              {plan.highlights.map((h) => (
                <p key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {h}
                </p>
              ))}
            </div>
          </Card>
          <Card className="flex items-center gap-2 p-5 text-xs text-muted-foreground">
            <Star className="h-4 w-4 fill-warning text-warning" />
            {plan.rating} out of 5 from members who renewed this plan.
          </Card>
        </aside>
      </div>
    </>
  );
}
