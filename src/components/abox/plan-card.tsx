/**
 * PlanCard — glass plan surface. Left column: metadata + highlights.
 * Right column: massive stacked premium price with a "$/mo" serial. A
 * citron progress arc for the PlanAI match. Ink-fill CTA with sweep.
 */
import { Link } from "@tanstack/react-router";
import { Star, ShieldCheck, Sparkles, Check, FileText } from "lucide-react";
import type { SamplePlan } from "@/lib/sample-data";
import { StatusBadge } from "./status-badge";
import { MetalBadge } from "./metal-badge";
import { formatUSD, formatUSDAmount } from "@/lib/format";
import { CarrierMark } from "./carrier-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OverflowText } from "./overflow-text";

interface Props {
  plan: SamplePlan;
  onAdd?: (plan: SamplePlan) => void;
  onCompareToggle?: (plan: SamplePlan) => void;
  onSaveToggle?: (plan: SamplePlan) => void;
  inCart?: boolean;
  inCompare?: boolean;
  saved?: boolean;
  compact?: boolean;
  horizontal?: boolean;
  /** Reactive PlanAI match (see `planMatchScore`). Falls back to the plan's baseline prior if omitted. */
  matchScore?: number;
  /** Estimated after-subsidy monthly price. Only ever set for on-exchange plans — never off-exchange. */
  subsidizedPrice?: number;
}


export function PlanCard({ plan, onAdd, onCompareToggle, onSaveToggle, inCart, inCompare, saved, compact, horizontal, matchScore, subsidizedPrice }: Props) {
  const match = matchScore ?? plan.planOMatch;
  const showSubsidized = subsidizedPrice != null && subsidizedPrice < plan.monthlyPremium;
  const displayedPremium = showSubsidized && subsidizedPrice != null ? subsidizedPrice : plan.monthlyPremium;
  if (horizontal) {
    return (
      <article
        aria-labelledby={`plan-${plan.id}-name`}
        className="group relative overflow-hidden rounded-2xl border border-hairline bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 card-brackets edge-sheen md:p-6"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(220px,1.15fr)_minmax(360px,1.6fr)_minmax(180px,.75fr)] xl:items-center">
          <header className="min-w-0">
            <div className="flex items-center gap-2">
              <CarrierMark carrier={plan.carrier} size={36} />
              <OverflowText text={plan.carrier} className="text-serial" />
              <span className="shrink-0 text-muted-foreground/60" aria-hidden>·</span>
              <OverflowText text={`ID ${plan.id}`} className="shrink-0 text-[11px] tabular-nums text-muted-foreground" />
            </div>
            <h3 id={`plan-${plan.id}-name`} className="text-display mt-2 text-2xl leading-tight">
              <Link to="/plans/$planId" params={{ planId: plan.id }} className="relative inline-block max-w-full ember-underline">
                <OverflowText text={plan.name} />
              </Link>
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <MetalBadge tier={plan.metalTier} />
              <StatusBadge tone="muted">{plan.networkType}</StatusBadge>
              <StatusBadge tone={plan.onExchange ? "info" : "primary"}>
                {plan.onExchange ? "On-exchange" : "Off-exchange"}
              </StatusBadge>
              {plan.hsaEligible && <StatusBadge tone="sage">HSA</StatusBadge>}
            </div>
          </header>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Deductible" value={formatUSD(plan.deductible)} />
            <Stat label="OOP maximum" value={formatUSD(plan.oopMax)} />
            <Stat label="Primary care visit" value={formatUSD(plan.pcpCopay)} />
            <Stat label="Specialist visit" value={formatUSD(plan.specialistCopay)} />
          </div>

          <div className="flex items-end justify-between gap-4 border-t border-hairline pt-4 xl:block xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0 xl:text-right">
            <div>
              <div className="text-display text-4xl tabular-nums leading-none">
                <span className="text-base align-top text-muted-foreground">$</span>{formatUSDAmount(displayedPremium)}
              </div>
              {showSubsidized && (
                <div className="mt-1 text-xs text-muted-foreground tabular-nums line-through">{formatUSD(plan.monthlyPremium)}/mo</div>
              )}
              <div className="text-serial mt-1">/ mo{showSubsidized ? " after subsidy" : ""}</div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" aria-hidden />
                <span className="tabular-nums">{plan.rating.toFixed(1)}</span>
                <span aria-hidden>·</span>
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                <span>Match {match}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/plans/$planId" params={{ planId: plan.id }}>
              <FileText aria-hidden /> Plan details
            </Link>
          </Button>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {onSaveToggle && (
              <Button variant="outline" size="sm" onClick={() => onSaveToggle(plan)} aria-pressed={!!saved} className={cn("rounded-full", saved && "text-sage")}>
                <ShieldCheck aria-hidden /> {saved ? "Saved" : "Save"}
              </Button>
            )}
            {onCompareToggle && (
              <Button variant="outline" size="sm" onClick={() => onCompareToggle(plan)} aria-pressed={!!inCompare} className={cn("rounded-full", inCompare && "text-primary")}>
                {inCompare ? "In compare" : "Compare"}
              </Button>
            )}
            {onAdd && (
              <Button size="sm" onClick={() => onAdd(plan)} disabled={inCart} className="rounded-full">
                {inCart ? "In cart" : "Add to cart"}
              </Button>
            )}
          </div>
        </div>
      </article>
    );
  }
  return (
    <article
      aria-labelledby={`plan-${plan.id}-name`}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-hairline bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 card-brackets edge-sheen",
        compact && "p-5",
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >

      <header className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CarrierMark carrier={plan.carrier} size={compact ? 30 : 34} />
            <OverflowText text={plan.carrier} className="text-serial" />
            <span className="shrink-0 text-muted-foreground/60" aria-hidden>·</span>
            <OverflowText text={`ID ${plan.id}`} className="shrink-0 text-[11px] tabular-nums text-muted-foreground" />
          </div>
          <h3 id={`plan-${plan.id}-name`} className="text-display mt-2 text-2xl leading-tight">
            <Link to="/plans/$planId" params={{ planId: plan.id }} className="relative inline-block max-w-full ember-underline">
              <OverflowText text={plan.name} />
            </Link>
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <MetalBadge tier={plan.metalTier} />
            <StatusBadge tone="muted">{plan.networkType}</StatusBadge>
            <StatusBadge tone={plan.onExchange ? "info" : "primary"}>
              {plan.onExchange ? "On-exchange" : "Off-exchange"}
            </StatusBadge>
            {plan.hsaEligible && <StatusBadge tone="sage">HSA</StatusBadge>}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-display text-5xl tabular-nums leading-none">
            <span className="text-lg align-top text-muted-foreground">$</span>{formatUSDAmount(displayedPremium)}
          </div>
          {showSubsidized && (
            <div className="text-xs text-muted-foreground tabular-nums line-through">{formatUSD(plan.monthlyPremium)}/mo</div>
          )}
          <div className="text-serial mt-1">/ mo{showSubsidized ? " after subsidy" : ""}</div>
          <div className="mt-2 inline-flex items-center gap-0.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" aria-hidden />
            <span className="tabular-nums">{plan.rating.toFixed(1)}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2 rounded-2xl glass p-1">
        <Stat label="Deductible" value={`$${plan.deductible.toLocaleString()}`} />
        <Stat label="OOP max"    value={`$${plan.oopMax.toLocaleString()}`} />
        <Stat label="PCP"        value={`$${plan.pcpCopay}`} />
      </div>

      {!compact && (
        <ul className="space-y-2 text-sm">
          {plan.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-soft/50 px-3 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          PlanAI match {match}%
        </span>
        <div className="flex items-center gap-1.5">
          {onSaveToggle && (
            <button
              onClick={() => onSaveToggle(plan)}
              aria-pressed={!!saved}
              className={cn(
                "inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3 text-xs font-medium hover:bg-accent transition-colors glass",
                saved && "text-sage",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {saved ? "Saved" : "Save"}
            </button>
          )}
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(plan)}
              aria-pressed={!!inCompare}
              className={cn(
                "inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3 text-xs font-medium hover:bg-accent transition-colors glass",
                inCompare && "text-primary",
              )}
            >
              {inCompare ? "In compare" : "Compare"}
            </button>
          )}
          {onAdd && (
            <button
              onClick={() => onAdd(plan)}
              disabled={inCart}
              className="relative inline-flex h-9 items-center gap-1 overflow-hidden whitespace-nowrap rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all hover:scale-[1.03] disabled:opacity-60"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              {inCart ? "In cart" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/40 px-3 py-2.5">
      <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}
