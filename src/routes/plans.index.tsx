/**
 * UX-009 — Plan Results
 * Filter, sort, save, compare, add to cart. Recommendations first,
 * with clear on/off-exchange labels and Plan-AI explanation.
 */
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter, ShoppingBag, Sparkles, X } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { PlanCard } from "@/components/abox/plan-card";
import { EmptyState } from "@/components/abox/empty-state";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_PLANS, planMatchScore, type SamplePlan, type PlanMatchInputs } from "@/lib/sample-data";
import { cartStore, useCart, PRODUCT_LABEL } from "@/lib/cart-store";
import { loadQuoteState, estimateMonthlyAPTC, recommendedExchangeView } from "@/lib/quote-store";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plans/")({
  head: () => ({
    meta: [
      { title: `${SCREENS["UX-009"].name} — ABox` },
      { name: "description", content: SCREENS["UX-009"].purpose },
    ],
  }),
  component: Page,
});

type SortKey = "plano" | "premium-asc" | "premium-desc" | "deductible-asc" | "rating";
const SORT_LABELS: Record<SortKey, string> = {
  plano: "Plan-AI match (recommended)",
  "premium-asc": "Lowest premium",
  "premium-desc": "Highest premium",
  "deductible-asc": "Lowest deductible",
  rating: "Highest rated",
};

function Page() {
  const quote = typeof window === "undefined" ? null : loadQuoteState();
  const cart = useCart();
  const matchInputs: PlanMatchInputs | null = quote
    ? { priorities: quote.priorities, usage: quote.usage, keepDoctor: quote.keepDoctor }
    : null;
  const monthlyAptc = quote ? estimateMonthlyAPTC(quote.income, quote.taxHouseholdSize) : undefined;
  const matchOf = (p: SamplePlan) => planMatchScore(p, matchInputs ?? { priorities: [] });
  const subsidizedPriceOf = (p: SamplePlan) =>
    p.onExchange && monthlyAptc ? Math.max(0, p.monthlyPremium - monthlyAptc) : undefined;

  const [showExchange, setShowExchange] = useState<"all" | "on" | "off">(() => recommendedExchangeView(quote));
  const [metals, setMetals] = useState<Set<SamplePlan["metalTier"]>>(new Set());
  const [networks, setNetworks] = useState<Set<SamplePlan["networkType"]>>(new Set());
  const [carriers, setCarriers] = useState<Set<string>>(new Set());
  const [hsaOnly, setHsaOnly] = useState(false);
  const [maxPremium, setMaxPremium] = useState<number>(1000);
  // Guided shoppers (with priorities from the wizard) default to Plan-AI
  // match; pure browse — no goals collected — defaults to lowest premium
  // per FR-044.
  const [sort, setSort] = useState<SortKey>(() => (quote?.priorities?.length ? "plano" : "premium-asc"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const allCarriers = useMemo(() => Array.from(new Set(SAMPLE_PLANS.map((p) => p.carrier))), []);

  const filtered = useMemo(() => {
    const list = SAMPLE_PLANS.filter((p) => {
      if (showExchange === "on" && !p.onExchange) return false;
      if (showExchange === "off" && p.onExchange) return false;
      if (metals.size > 0 && !metals.has(p.metalTier)) return false;
      if (networks.size > 0 && !networks.has(p.networkType)) return false;
      if (carriers.size > 0 && !carriers.has(p.carrier)) return false;
      if (hsaOnly && !p.hsaEligible) return false;
      if (p.monthlyPremium > maxPremium) return false;
      return true;
    });
    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "premium-asc": return a.monthlyPremium - b.monthlyPremium || matchOf(b) - matchOf(a);
        case "premium-desc": return b.monthlyPremium - a.monthlyPremium || matchOf(b) - matchOf(a);
        case "deductible-asc": return a.deductible - b.deductible || matchOf(b) - matchOf(a);
        case "rating": return b.rating - a.rating || matchOf(b) - matchOf(a);
        default: return matchOf(b) - matchOf(a);
      }
    });
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- matchOf/subsidizedPriceOf are derived from quote, stable per render
  }, [showExchange, metals, networks, carriers, hsaOnly, maxPremium, sort]);

  const clearFilters = () => {
    setShowExchange("all"); setMetals(new Set()); setNetworks(new Set());
    setCarriers(new Set()); setHsaOnly(false); setMaxPremium(1000);
  };
  const activeFilterCount =
    (showExchange !== "all" ? 1 : 0) + metals.size + networks.size + carriers.size +
    (hsaOnly ? 1 : 0) + (maxPremium !== 1000 ? 1 : 0);

  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <PageHeader
          scrId="UX-009"
          eyebrow="Plans that fit"
          title={`${filtered.length} plan${filtered.length === 1 ? "" : "s"} available`}
          description={
            quote?.zip
              ? `Shown for ZIP ${quote.zip}${quote.county ? ` · ${quote.county}` : ""} · effective ${quote.effectiveDate || "—"}.`
              : "Add your ZIP and household in the wizard to personalize these results."
          }
          actions={
            <div className="flex items-center gap-2">
              <Link to="/quote" search={{ step: 1 }} className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent">
                Edit quote
              </Link>
              <Link to="/cart" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <ShoppingBag className="h-4 w-4" aria-hidden />
                Cart · {cart.items.length}
              </Link>
            </div>
          }
        />

        <div className="flex gap-6">
          {/* Filters — desktop rail */}
          <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
            <FilterRail
              showExchange={showExchange} setShowExchange={setShowExchange}
              metals={metals} setMetals={setMetals}
              networks={networks} setNetworks={setNetworks}
              carriers={carriers} setCarriers={setCarriers}
              allCarriers={allCarriers}
              hsaOnly={hsaOnly} setHsaOnly={setHsaOnly}
              maxPremium={maxPremium} setMaxPremium={setMaxPremium}
              activeFilterCount={activeFilterCount} onClear={clearFilters}
              hasSubsidyCheck={!!quote && !quote.skipSubsidy && quote.income != null}
            />

            <div className="mt-5 rounded-2xl border border-border bg-card p-4">
              <p className="text-eyebrow">Add-ons available</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[PRODUCT_LABEL.dental, PRODUCT_LABEL.vision, PRODUCT_LABEL.life].map((l) => (
                  <span key={l} className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium">{l}</span>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Pair extra coverage with your medical plan.</p>
              <Link to="/coverage" className="mt-2 inline-flex text-sm font-medium text-primary story-link">Explore add-on coverage</Link>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Sort + mobile filter */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm lg:hidden"
              >
                <Filter className="h-4 w-4" aria-hidden /> Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{activeFilterCount}</span>
                )}
              </button>
              <div className="ml-auto inline-flex items-center gap-2">
                <label htmlFor="sort" className="text-xs uppercase tracking-widest text-muted-foreground">Sort by</label>
                <select
                  id="sort" value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-full border border-border bg-card px-3 py-2 text-sm"
                >
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                    <option key={k} value={k}>{SORT_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Plan-AI explanation */}
            {sort === "plano" && quote?.priorities?.length ? (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary-soft/40 p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div className="text-sm">
                  <p className="font-medium">Plan-AI is ranking for your priorities</p>
                  <p className="text-muted-foreground">
                    {quote.priorities.join(", ")} · {quote.usage ?? "moderate"} care usage
                  </p>
                </div>
              </div>
            ) : null}

            {/* Compare bar */}
            {cart.compareIds.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3">
                <p className="text-sm">
                  <span className="font-medium">{cart.compareIds.length}</span> selected for compare (up to 5)
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => cartStore.clearCompare()} className="text-xs text-muted-foreground hover:text-foreground">
                    Clear
                  </button>
                  <Link
                    to="/compare"
                    className={cn(
                      "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
                      cart.compareIds.length < 2 && "pointer-events-none opacity-50",
                    )}
                  >
                    Compare {cart.compareIds.length} plans
                  </Link>
                </div>
              </div>
            )}

            {/* Results */}
            {filtered.length === 0 ? (
              <EmptyState
                title="No plans match those filters"
                body="Try clearing a filter or widening your premium range."
                action={<button onClick={clearFilters} className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Clear filters</button>}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    matchScore={matchOf(plan)}
                    subsidizedPrice={subsidizedPriceOf(plan)}
                    inCart={cart.items.some((i) => i.id === plan.id)}
                    inCompare={cart.compareIds.includes(plan.id)}
                    saved={cart.savedPlanIds.includes(plan.id)}
                    onCompareToggle={(p) => cartStore.toggleCompare(p.id)}
                    onSaveToggle={(p) => cartStore.toggleSaved(p.id)}
                    onAdd={(p) => cartStore.add({
                      id: p.id, productType: "ifp", displayName: p.name, carrier: p.carrier,
                      monthly: p.monthlyPremium, effectiveDate: quote?.effectiveDate ?? "",
                      status: "draft", meta: { metal: p.metalTier, network: p.networkType, onExchange: p.onExchange },
                    })}
                  />
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
            <button className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} aria-label="Close filters" />
            <div className="w-80 max-w-full overflow-y-auto bg-background p-4 shadow-[var(--shadow-drawer)]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-display text-xl">Filters</p>
                <button onClick={() => setDrawerOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <FilterRail
                showExchange={showExchange} setShowExchange={setShowExchange}
                metals={metals} setMetals={setMetals}
                networks={networks} setNetworks={setNetworks}
                carriers={carriers} setCarriers={setCarriers}
                allCarriers={allCarriers}
                hsaOnly={hsaOnly} setHsaOnly={setHsaOnly}
                maxPremium={maxPremium} setMaxPremium={setMaxPremium}
                activeFilterCount={activeFilterCount} onClear={clearFilters}
                hasSubsidyCheck={!!quote && !quote.skipSubsidy && quote.income != null}
              />
            </div>
          </div>
        )}
      </div>
    </MarketplaceShell>
  );
}

interface FilterProps {
  showExchange: "all" | "on" | "off";
  setShowExchange: (v: "all" | "on" | "off") => void;
  metals: Set<SamplePlan["metalTier"]>;
  setMetals: (v: Set<SamplePlan["metalTier"]>) => void;
  networks: Set<SamplePlan["networkType"]>;
  setNetworks: (v: Set<SamplePlan["networkType"]>) => void;
  carriers: Set<string>;
  setCarriers: (v: Set<string>) => void;
  allCarriers: string[];
  hsaOnly: boolean;
  setHsaOnly: (v: boolean) => void;
  maxPremium: number;
  setMaxPremium: (v: number) => void;
  activeFilterCount: number;
  onClear: () => void;
  hasSubsidyCheck: boolean;
}
function FilterRail(p: FilterProps) {
  const METALS: SamplePlan["metalTier"][] = ["Bronze","Silver","Gold","Platinum","Catastrophic"];
  const NETS: SamplePlan["networkType"][] = ["HMO","PPO","EPO","POS"];
  const toggleIn = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set); next.has(v) ? next.delete(v) : next.add(v); setter(next);
  };
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-display text-lg">Filters</p>
        {p.activeFilterCount > 0 && (
          <button onClick={p.onClear} className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
        )}
      </div>

      <fieldset>
        <legend className="text-eyebrow mb-2">Exchange</legend>
        <div className="grid grid-cols-3 gap-1 rounded-full bg-surface p-1">
          {(["all","on","off"] as const).map((v) => (
            <button key={v} onClick={() => p.setShowExchange(v)}
              aria-pressed={p.showExchange === v}
              className={cn("rounded-full px-2 py-1.5 text-xs font-medium",
                p.showExchange === v ? "bg-card shadow-[var(--shadow-card)]" : "text-muted-foreground")}
            >
              {v === "all" ? "All" : v === "on" ? "On-QHP" : "Off-exch"}
            </button>
          ))}
        </div>
        {!p.hasSubsidyCheck && (
          <p className="mt-2 text-xs text-muted-foreground">
            <Link to="/quote" search={{ step: 5 }} className="story-link text-primary">Check your subsidy eligibility</Link> for a personalized default here.
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-eyebrow mb-2">Metal tier</legend>
        <div className="flex flex-wrap gap-1.5">
          {METALS.map((m) => {
            const on = p.metals.has(m);
            return (
              <button key={m} onClick={() => toggleIn(p.metals, m, p.setMetals)}
                aria-pressed={on}
                className={cn("rounded-full border px-2.5 py-1 text-xs",
                  on ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-accent")}
              >
                {m}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-eyebrow mb-2">Network</legend>
        <div className="flex flex-wrap gap-1.5">
          {NETS.map((n) => {
            const on = p.networks.has(n);
            return (
              <button key={n} onClick={() => toggleIn(p.networks, n, p.setNetworks)}
                aria-pressed={on}
                className={cn("rounded-full border px-2.5 py-1 text-xs",
                  on ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-accent")}
              >
                {n}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-eyebrow mb-2">Carrier</legend>
        <div className="space-y-1.5">
          {p.allCarriers.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={p.carriers.has(c)}
                onChange={() => toggleIn(p.carriers, c, p.setCarriers)}
                className="rounded"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center justify-between text-sm">
        <span>HSA-eligible only</span>
        <input type="checkbox" checked={p.hsaOnly} onChange={(e) => p.setHsaOnly(e.target.checked)} />
      </label>

      <fieldset>
        <legend className="text-eyebrow mb-2">Max premium</legend>
        <input
          type="range" min={100} max={1000} step={25} value={p.maxPremium}
          onChange={(e) => p.setMaxPremium(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
          aria-label="Maximum monthly premium"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>$100</span>
          <span className="font-medium text-foreground">${p.maxPremium}/mo</span>
          <span>$1,000</span>
        </div>
      </fieldset>
    </div>
  );
}
