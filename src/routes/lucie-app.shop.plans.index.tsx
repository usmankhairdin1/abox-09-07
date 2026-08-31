import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Filter, Scale, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState, Money, PageHeader, Section, StatusChip, Stepper } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLANS, type Plan } from "@/lib/lucie-app/data";
import { SHOP_STEPS } from "@/lib/lucie-app/steps";
import { subsidyEstimate, useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/shop/plans/")({
  head: () => ({
    meta: [
      { title: "Plan results — Northgate Marketplace" },
      {
        name: "description",
        content: "Plans priced for your household with assistance applied, sorted by fit, premium or deductible.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Plan results" },
      { property: "og:description", content: "Compare medical, dental and vision plans side by side." },
    ],
  }),
  component: PlanResults,
});

const ALL = "all";

function PlanResults() {
  const { state, dispatch } = useLucie();
  const navigate = useNavigate();
  const [kind, setKind] = useState<string>(ALL);
  const [metal, setMetal] = useState<string>(ALL);
  const [sort, setSort] = useState("fit");
  const [q, setQ] = useState("");
  const [maxPremium, setMaxPremium] = useState("");

  const assistance = state.household.submitted ? subsidyEstimate(state.household) : { monthly: 0, eligible: false, fplPct: 0 };

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = PLANS.filter((p) => {
      if (kind !== ALL && p.kind !== kind) return false;
      if (metal !== ALL && p.metal !== metal) return false;
      if (maxPremium && p.premium > Number(maxPremium)) return false;
      if (!needle) return true;
      return `${p.name} ${p.carrier} ${p.network}`.toLowerCase().includes(needle);
    });
    return list.sort((a, b) => {
      if (sort === "premium") return a.premium - b.premium;
      if (sort === "deductible") return a.deductible - b.deductible;
      return b.fitScore - a.fitScore;
    });
  }, [kind, metal, sort, q, maxPremium]);

  const netPremium = (p: Plan) =>
    p.kind === "medical" && p.market === "on-exchange" && assistance.eligible
      ? Math.max(0, p.premium - assistance.monthly)
      : p.premium;

  const addToCart = (p: Plan) => {
    dispatch({ type: "cart:add", planId: p.id, members: state.household.applicants.length });
    toast.success(`${p.name} added to your cart.`);
  };

  return (
    <>
      <Stepper steps={SHOP_STEPS} current={1} />
      <PageHeader
        eyebrow="Step 2 of 9"
        title="Plans for your household"
        lede={
          state.household.submitted
            ? `Priced for ${state.household.applicants.length} people in ${state.household.county} County, ${state.household.state}.`
            : "Showing standard pricing. Add your coverage details to see prices for your household."
        }
        actions={
          <>
            {state.compare.length ? (
              <Button variant="outline" asChild>
                <Link to="/lucie-app/shop/compare">
                  <Scale className="h-4 w-4" /> Compare ({state.compare.length})
                </Link>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link to="/lucie-app/shop/eligibility">Edit details</Link>
            </Button>
          </>
        }
      />

      {assistance.eligible ? (
        <Card className="flex flex-wrap items-center gap-2 border-success/25 bg-success/5 p-4 text-sm">
          <Sparkles className="h-4 w-4 text-success" />
          <span className="font-medium text-success">${assistance.monthly}/month assistance applied</span>
          <span className="text-xs text-muted-foreground">
            Applied to marketplace medical plans below. Dental, vision and off-exchange plans show full price.
          </span>
        </Card>
      ) : null}

      <Card className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="grid gap-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Filter className="h-3 w-3" /> Search
          </span>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Carrier, plan or network" />
        </div>
        <div className="grid gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">Product</span>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All products</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="dental">Dental</SelectItem>
              <SelectItem value="vision">Vision</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">Level</span>
          <Select value={metal} onValueChange={setMetal}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any level</SelectItem>
              <SelectItem value="Bronze">Bronze</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">Max monthly premium</span>
          <Input
            value={maxPremium}
            inputMode="numeric"
            placeholder="Any"
            onChange={(e) => setMaxPremium(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div className="grid gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">Sort by</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fit">Best fit</SelectItem>
              <SelectItem value="premium">Lowest premium</SelectItem>
              <SelectItem value="deductible">Lowest deductible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Section title={`${rows.length} plan${rows.length === 1 ? "" : "s"}`} description="Select up to three plans to compare.">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8">
            <EmptyState
              title="No plans match those filters"
              body="Try widening the premium limit or clearing the product filter."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setKind(ALL);
                    setMetal(ALL);
                    setMaxPremium("");
                    setQ("");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-3">
            {rows.map((p) => {
              const inCart = state.cart.some((c) => c.planId === p.id);
              const net = netPremium(p);
              return (
                <Card key={p.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto]">
                  <div className="min-w-0 grid content-start gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusChip tone="info">{p.kind}</StatusChip>
                      <StatusChip>{p.metal}</StatusChip>
                      {p.market === "off-exchange" ? <StatusChip tone="warn">Off exchange</StatusChip> : null}
                      {p.hsa ? <StatusChip tone="good">HSA eligible</StatusChip> : null}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {p.carrier} · {p.network}
                      </p>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      {p.rating} member rating
                      <span className="mx-1">·</span>
                      <Sparkles className="h-3.5 w-3.5 text-primary" /> {p.fitScore}% fit
                    </p>
                    <p className="max-w-lg text-xs leading-relaxed text-muted-foreground">{p.fitReason}</p>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 self-start text-xs">
                    {[
                      ["Deductible", `$${p.deductible.toLocaleString()}`],
                      ["Out-of-pocket max", `$${p.oopMax.toLocaleString()}`],
                      ["Primary care", p.primaryCare],
                      ["Generic drugs", p.generic],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="grid content-start justify-items-end gap-2">
                    <p className="text-right">
                      <span className="font-display text-2xl font-semibold">
                        <Money value={net} per="mo" />
                      </span>
                      {net !== p.premium ? (
                        <span className="block text-[11px] text-muted-foreground line-through">
                          ${p.premium}/mo before assistance
                        </span>
                      ) : null}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/lucie-app/shop/plans/$planId" params={{ planId: p.id }}>
                          Details
                        </Link>
                      </Button>
                      <Button size="sm" disabled={inCart} onClick={() => addToCart(p)}>
                        {inCart ? "In cart" : "Add to cart"}
                      </Button>
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Checkbox
                        checked={state.compare.includes(p.id)}
                        onCheckedChange={() => dispatch({ type: "compare:toggle", planId: p.id })}
                      />
                      Compare
                    </label>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={() => {
            if (!state.cart.length) {
              toast.error("Add at least one plan to continue.");
              return;
            }
            void navigate({ to: "/lucie-app/shop/cart" });
          }}
        >
          Go to cart <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
