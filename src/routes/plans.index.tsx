/**
 * UX-009 — Plan Results
 * Filter, sort, save, compare, add to cart. Recommendations first,
 * with clear on/off-exchange labels and PlanAI explanation.
 */
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Filter, Sparkles, X } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { PlanCard } from "@/components/abox/plan-card";
import { CarrierMark } from "@/components/abox/carrier-mark";
import { ShoppingPathBar } from "@/components/abox/shopping-path-bar";
import { EmptyState } from "@/components/abox/empty-state";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_PLANS, planMatchScore, type SamplePlan, type PlanMatchInputs } from "@/lib/sample-data";
import { cartStore, useCart, PRODUCT_LABEL } from "@/lib/cart-store";
import { loadQuoteState, estimateMonthlyAPTC, recommendedExchangeView, defaultQuoteState, type QuoteState } from "@/lib/quote-store";
import { QuoteEditPanel } from "@/components/abox/quote-edit-panel";
import { SCREENS } from "@/lib/screens";
import { browseStore, useBrowseState } from "@/lib/browse-store";
import { formatUSD } from "@/lib/format";
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

type SortKey = "plano" | "premium-asc" | "premium-desc" | "deductible-asc" | "rating" | "best-value";
const SORT_LABELS: Record<SortKey, string> = {
  plano: "Recommended",
  "premium-asc": "Lowest Premium",
  "premium-desc": "Highest premium",
  "deductible-asc": "Lowest Deductible",
  rating: "Highest rated",
  "best-value": "Best Value",
};

function Page() {
  // The quote lives in state so the inline "Edit quote" panel can update the
  // results in place; it is still the one shared quote-store model.
  const [quote, setQuote] = useState<QuoteState | null>(() =>
    typeof window === "undefined" ? null : loadQuoteState(),
  );
  useEffect(() => {
    // Hydration fallback: if the server rendered with no quote, re-read the
    // shopper's persisted quote once after mounting.
    if (!quote) {
      const persisted = loadQuoteState();
      if (persisted) setQuote(persisted);
    }
  }, [quote]);
  const [editOpen, setEditOpen] = useState(false);
  const cart = useCart();
  const matchInputs: PlanMatchInputs | null = quote
    ? { priorities: quote.priorities, usage: quote.usage, keepDoctor: quote.keepDoctor }
    : null;
  const monthlyAptc = quote ? estimateMonthlyAPTC(quote.income, quote.taxHouseholdSize) : undefined;
  const matchOf = (p: SamplePlan) => planMatchScore(p, matchInputs);
  const subsidizedPriceOf = (p: SamplePlan) =>
    p.onExchange && monthlyAptc ? Math.max(0, p.monthlyPremium - monthlyAptc) : undefined;

  // Filters/sort persist for the browsing session (browse-store) so returning
  // to this screen restores it exactly as the shopper left it.
  const browse = useBrowseState();
  const showExchange = browse.exchange;
  const setShowExchange = (v: "all" | "on" | "off") => browseStore.patch({ exchange: v });
  const metals = useMemo(() => new Set(browse.metals as SamplePlan["metalTier"][]), [browse.metals]);
  const setMetals = (v: Set<SamplePlan["metalTier"]>) => browseStore.patch({ metals: [...v] });
  const networks = useMemo(() => new Set(browse.networks as SamplePlan["networkType"][]), [browse.networks]);
  const setNetworks = (v: Set<SamplePlan["networkType"]>) => browseStore.patch({ networks: [...v] });
  const carriers = useMemo(() => new Set(browse.carriers), [browse.carriers]);
  const setCarriers = (v: Set<string>) => browseStore.patch({ carriers: [...v] });
  const hsaOnly = browse.hsaOnly;
  const setHsaOnly = (v: boolean) => browseStore.patch({ hsaOnly: v });
  const easyPricingOnly = browse.easyPricingOnly;
  const setEasyPricingOnly = (v: boolean) => browseStore.patch({ easyPricingOnly: v });
  const maxPremium = browse.maxPremium;
  const setMaxPremium = (v: number) => browseStore.patch({ maxPremium: v });
  const maxDeductible = browse.maxDeductible;
  const setMaxDeductible = (v: number) => browseStore.patch({ maxDeductible: v });
  const maxOop = browse.maxOop;
  const setMaxOop = (v: number) => browseStore.patch({ maxOop: v });
  const maxPcpCopay = browse.maxPcpCopay;
  const setMaxPcpCopay = (v: number) => browseStore.patch({ maxPcpCopay: v });
  const maxSpecialistCopay = browse.maxSpecialistCopay;
  const setMaxSpecialistCopay = (v: number) => browseStore.patch({ maxSpecialistCopay: v });

  useEffect(() => {
    if (browse.sort === null) {
      browseStore.patch({
        exchange: recommendedExchangeView(quote),
        sort: quote?.priorities?.length ? "plano" : "premium-asc",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time seed of persisted browse defaults
  }, []);
  // Guided shoppers (with priorities from the wizard) default to PlanAI
  // match; pure browse — no goals collected — defaults to lowest premium
  // per FR-044.
  const sort = (browse.sort ?? (quote?.priorities?.length ? "plano" : "premium-asc")) as SortKey;
  const setSort = (v: SortKey) => browseStore.patch({ sort: v });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Carrier options come from the plan data itself (no hard-coded list), with
  // live counts computed against every *other* active filter so the numbers
  // stay accurate as the shopper narrows results.
  const carrierOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of SAMPLE_PLANS) {
      if (!counts.has(p.carrier)) counts.set(p.carrier, 0);
      if (showExchange === "on" && !p.onExchange) continue;
      if (showExchange === "off" && p.onExchange) continue;
      if (metals.size > 0 && !metals.has(p.metalTier)) continue;
      if (networks.size > 0 && !networks.has(p.networkType)) continue;
      if (hsaOnly && !p.hsaEligible) continue;
      if (easyPricingOnly && !(p.pcpCopay <= 15 && p.specialistCopay <= 40)) continue;
      if (p.monthlyPremium > maxPremium) continue;
      if (p.deductible > maxDeductible) continue;
      if (p.oopMax > maxOop) continue;
      if (p.pcpCopay > maxPcpCopay) continue;
      if (p.specialistCopay > maxSpecialistCopay) continue;
      counts.set(p.carrier, (counts.get(p.carrier) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) =>
      b.count - a.count || a.name.localeCompare(b.name),
    );
  }, [showExchange, metals, networks, hsaOnly, easyPricingOnly, maxPremium, maxDeductible, maxOop, maxPcpCopay, maxSpecialistCopay]);

  const filtered = useMemo(() => {
    const list = SAMPLE_PLANS.filter((p) => {
      if (showExchange === "on" && !p.onExchange) return false;
      if (showExchange === "off" && p.onExchange) return false;
      if (metals.size > 0 && !metals.has(p.metalTier)) return false;
      if (networks.size > 0 && !networks.has(p.networkType)) return false;
      if (carriers.size > 0 && !carriers.has(p.carrier)) return false;
      if (hsaOnly && !p.hsaEligible) return false;
      if (easyPricingOnly && !(p.pcpCopay <= 15 && p.specialistCopay <= 40)) return false;
      if (p.monthlyPremium > maxPremium) return false;
      if (p.deductible > maxDeductible) return false;
      if (p.oopMax > maxOop) return false;
      if (p.pcpCopay > maxPcpCopay) return false;
      if (p.specialistCopay > maxSpecialistCopay) return false;
      return true;
    });
    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "premium-asc": return a.monthlyPremium - b.monthlyPremium || matchOf(b) - matchOf(a);
        case "best-value": {
          // Best value from existing data only: estimated first-year cost
          // (annualized effective premium after any on-exchange subsidy + deductible).
          const annualCost = (p: SamplePlan) => (subsidizedPriceOf(p) ?? p.monthlyPremium) * 12 + p.deductible;
          return annualCost(a) - annualCost(b) || b.rating - a.rating || matchOf(b) - matchOf(a);
        }
        case "premium-desc": return b.monthlyPremium - a.monthlyPremium || matchOf(b) - matchOf(a);
        case "deductible-asc": return a.deductible - b.deductible || matchOf(b) - matchOf(a);
        case "rating": return b.rating - a.rating || matchOf(b) - matchOf(a);
        default: return matchOf(b) - matchOf(a);
      }
    });
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- matchOf/subsidizedPriceOf are derived from quote, stable per render
  }, [showExchange, metals, networks, carriers, hsaOnly, easyPricingOnly, maxPremium, maxDeductible, maxOop, maxPcpCopay, maxSpecialistCopay, sort, quote]);

  const clearFilters = () => browseStore.resetFilters();
  const activeFilterCount =
    (showExchange !== "all" ? 1 : 0) + metals.size + networks.size + carriers.size +
    (hsaOnly ? 1 : 0) + (easyPricingOnly ? 1 : 0) +
    (maxPremium !== 1000 ? 1 : 0) + (maxDeductible !== 7500 ? 1 : 0) + (maxOop !== 9500 ? 1 : 0) +
    (maxPcpCopay !== 50 ? 1 : 0) + (maxSpecialistCopay !== 100 ? 1 : 0);

  const summaryLine = useMemo(() => {
    const countText = `${filtered.length} Plan${filtered.length === 1 ? "" : "s"} Available`;
    if (!quote?.zip) return `${countText}.`;
    const parts = [countText, `for ${quote.zip}`];
    const personCount = quote.members?.length ?? 0;
    if (personCount > 0) parts.push(`${personCount} Person${personCount === 1 ? "" : "s"}`);
    if (quote.effectiveDate) {
      const d = new Date(`${quote.effectiveDate}T00:00:00`);
      parts.push(
        `effective ${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      );
    }
    return `${parts.join(" · ")}.`;
  }, [filtered.length, quote]);

  return (
    <MarketplaceShell product="ifp">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-6">
        <PageHeader
          variant="compact"
          title={summaryLine}
          actions={
            <button
              type="button"
              onClick={() => setEditOpen((v) => !v)}
              aria-expanded={editOpen}
              aria-controls="edit-quote-panel"
              className="inline-flex h-9 items-center rounded-full border border-border px-3.5 text-sm hover:bg-accent"
            >
              Edit quote
            </button>
          }
        />

        {editOpen && (
          <QuoteEditPanel
            quote={quote ?? defaultQuoteState()}
            onApply={(next) => {
              setQuote(next);
              setEditOpen(false);
            }}
            onClose={() => setEditOpen(false)}
          />
        )}

        <ShoppingPathBar current="browse" />

        <div className="flex gap-6">
          {/* Filters — desktop rail */}
          <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
            <FilterRail
              showExchange={showExchange} setShowExchange={setShowExchange}
              metals={metals} setMetals={setMetals}
              networks={networks} setNetworks={setNetworks}
              carriers={carriers} setCarriers={setCarriers}
              carrierOptions={carrierOptions}
              hsaOnly={hsaOnly} setHsaOnly={setHsaOnly}
              maxPremium={maxPremium} setMaxPremium={setMaxPremium}
              maxDeductible={maxDeductible} setMaxDeductible={setMaxDeductible}
              maxOop={maxOop} setMaxOop={setMaxOop}
              maxPcpCopay={maxPcpCopay} setMaxPcpCopay={setMaxPcpCopay}
              maxSpecialistCopay={maxSpecialistCopay} setMaxSpecialistCopay={setMaxSpecialistCopay}
              easyPricingOnly={easyPricingOnly} setEasyPricingOnly={setEasyPricingOnly}
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
              <div className="ml-auto inline-flex flex-wrap items-center gap-2">
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

            {/* PlanAI explanation */}
            {sort === "plano" && quote?.priorities?.length ? (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary-soft/40 p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div className="text-sm">
                  <p className="font-medium">PlanAI is ranking for your priorities</p>
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
              <div className="grid gap-4">
                {filtered.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    matchScore={matchOf(plan)}
                    subsidizedPrice={subsidizedPriceOf(plan)}
                    horizontal
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
                carrierOptions={carrierOptions}
                hsaOnly={hsaOnly} setHsaOnly={setHsaOnly}
                maxPremium={maxPremium} setMaxPremium={setMaxPremium}
                maxDeductible={maxDeductible} setMaxDeductible={setMaxDeductible}
                maxOop={maxOop} setMaxOop={setMaxOop}
                maxPcpCopay={maxPcpCopay} setMaxPcpCopay={setMaxPcpCopay}
                maxSpecialistCopay={maxSpecialistCopay} setMaxSpecialistCopay={setMaxSpecialistCopay}
                easyPricingOnly={easyPricingOnly} setEasyPricingOnly={setEasyPricingOnly}
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
  carrierOptions: { name: string; count: number }[];
  hsaOnly: boolean;
  setHsaOnly: (v: boolean) => void;
  easyPricingOnly: boolean;
  setEasyPricingOnly: (v: boolean) => void;
  maxPremium: number;
  setMaxPremium: (v: number) => void;
  maxDeductible: number;
  setMaxDeductible: (v: number) => void;
  maxOop: number;
  setMaxOop: (v: number) => void;
  maxPcpCopay: number;
  setMaxPcpCopay: (v: number) => void;
  maxSpecialistCopay: number;
  setMaxSpecialistCopay: (v: number) => void;
  activeFilterCount: number;
  onClear: () => void;
  hasSubsidyCheck: boolean;
}
function FilterRail(p: FilterProps) {
  const METALS: SamplePlan["metalTier"][] = ["Bronze","Expanded Bronze","Silver","Gold","Platinum","Catastrophic"];
  const NETS: SamplePlan["networkType"][] = ["HMO","PPO","EPO","POS"];
  const toggleIn = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set); next.has(v) ? next.delete(v) : next.add(v); setter(next);
  };
  const FilterLegend = ({ children }: { children: React.ReactNode }) => (
    <legend className="mb-2 text-eyebrow">{children}</legend>
  );
  const RangeFilter = ({ label, min, max, step, value, onChange, suffix }: {
    label: string; min: number; max: number; step: number; value: number;
    onChange: (value: number) => void; suffix?: string;
  }) => (
    <fieldset>
      <FilterLegend>{label}</FilterLegend>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]" aria-label={`Maximum ${label.toLowerCase()}`} />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{formatUSD(min)}</span>
        <span className="font-medium text-foreground">{formatUSD(value)}{suffix ?? ""}</span>
        <span>{formatUSD(max)}</span>
      </div>
    </fieldset>
  );
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-display text-lg">Filters</p>
        {p.activeFilterCount > 0 && (
          <button onClick={p.onClear} className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
        )}
      </div>

      <fieldset>
        <FilterLegend>Exchange</FilterLegend>
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
        <FilterLegend>Metal tier</FilterLegend>
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
        <FilterLegend>Network</FilterLegend>
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
        <FilterLegend>Carrier</FilterLegend>
        <div className="space-y-1.5">
          {p.carrierOptions.map((c) => {
            const checked = p.carriers.has(c.name);
            const unavailable = c.count === 0 && !checked;
            return (
              <label
                key={c.name}
                className={cn("flex items-center gap-2 text-sm", unavailable && "text-muted-foreground")}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={unavailable}
                  onChange={() => toggleIn(p.carriers, c.name, p.setCarriers)}
                  className="rounded"
                />
                <CarrierMark carrier={c.name} size={20} />
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <span className="tabular-nums text-xs text-muted-foreground">({c.count})</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <FilterLegend>Premium</FilterLegend>
        <input
          type="range" min={100} max={1000} step={25} value={p.maxPremium}
          onChange={(e) => p.setMaxPremium(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
          aria-label="Maximum monthly premium"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>$100</span>
          <span className="font-medium text-foreground">{formatUSD(p.maxPremium)}/mo</span>
          <span>$1,000</span>
        </div>
      </fieldset>

      <RangeFilter label="Deductible" min={0} max={7500} step={250} value={p.maxDeductible} onChange={p.setMaxDeductible} />
      <RangeFilter label="Out-of-pocket maximum" min={3000} max={9500} step={250} value={p.maxOop} onChange={p.setMaxOop} />

      <fieldset>
        <FilterLegend>HSA eligibility</FilterLegend>
        <label className="flex items-center justify-between text-sm">
          <span>HSA-eligible only</span>
          <input type="checkbox" checked={p.hsaOnly} onChange={(e) => p.setHsaOnly(e.target.checked)} />
        </label>
      </fieldset>

      <fieldset>
        <FilterLegend>Easy pricing</FilterLegend>
        <label className="flex items-center justify-between text-sm">
          <span>Low or $0 doctor visit costs</span>
          <input type="checkbox" checked={p.easyPricingOnly} onChange={(e) => p.setEasyPricingOnly(e.target.checked)} />
        </label>
      </fieldset>

      <RangeFilter label="Primary care visit" min={0} max={50} step={5} value={p.maxPcpCopay} onChange={p.setMaxPcpCopay} />
      <RangeFilter label="Specialist visit" min={0} max={100} step={5} value={p.maxSpecialistCopay} onChange={p.setMaxSpecialistCopay} />
    </div>
  );
}
