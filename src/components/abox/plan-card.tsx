/**
 * PlanCard — glass plan surface. Left column: metadata + highlights.
 * Right column: massive stacked premium price with a "$/mo" serial. A
 * citron progress arc for the Plan-O match. Ink-fill CTA with sweep.
 */
import { Link } from "@tanstack/react-router";
import { Star, ShieldCheck, Sparkles, Check } from "lucide-react";
import type { SamplePlan } from "@/lib/sample-data";
import { StatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

interface Props {
  plan: SamplePlan;
  onAdd?: (plan: SamplePlan) => void;
  onCompareToggle?: (plan: SamplePlan) => void;
  onSaveToggle?: (plan: SamplePlan) => void;
  inCart?: boolean;
  inCompare?: boolean;
  saved?: boolean;
  compact?: boolean;
  /** Optional override for the Plan-AI match percentage. */
  matchScore?: number;
}

function MatchArc({ pct }: { pct: number }) {
  const r = 22, C = 2 * Math.PI * r;
  const dash = (pct / 100) * C;
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" className="shrink-0">
      <circle cx="28" cy="28" r={r} fill="none" stroke="var(--hairline)" strokeWidth="3" />
      <circle
        cx="28" cy="28" r={r} fill="none"
        stroke="var(--primary)" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${dash} ${C - dash}`}
        transform="rotate(-90 28 28)"
      />
      <text x="28" y="32" textAnchor="middle" className="fill-foreground font-mono" style={{ fontSize: 11, fontWeight: 600 }}>
        {pct}
      </text>
    </svg>
  );
}

export function PlanCard({ plan, onAdd, onCompareToggle, onSaveToggle, inCart, inCompare, saved, compact, matchScore }: Props) {
  return (
    <article
      aria-labelledby={`plan-${plan.id}-name`}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-hairline bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 card-brackets edge-sheen",
        compact && "p-5",
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* accent sweep */}
      <span aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />

      <header className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-serial">{plan.carrier}</span>
          </div>
          <h3 id={`plan-${plan.id}-name`} className="text-display mt-2 text-2xl leading-tight">
            <Link to="/plans/$planId" params={{ planId: plan.id }} className="relative inline-block ember-underline">
              {plan.name}
            </Link>
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <StatusBadge tone="sage">{plan.metalTier}</StatusBadge>
            <StatusBadge tone="muted">{plan.networkType}</StatusBadge>
            <StatusBadge tone={plan.onExchange ? "info" : "primary"}>
              {plan.onExchange ? "QHP" : "Off-exchange"}
            </StatusBadge>
            {plan.hsaEligible && <StatusBadge tone="sage">HSA</StatusBadge>}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-display text-5xl tabular-nums leading-none">
            <span className="text-lg align-top text-muted-foreground">$</span>{plan.monthlyPremium}
          </div>
          <div className="text-serial mt-1">per month</div>
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

      <div className="flex items-center justify-between gap-3 border-t border-hairline pt-4">
        <div className="flex items-center gap-2">
          <MatchArc pct={matchScore ?? plan.planOMatch} />
          <div className="text-xs">
            <p className="inline-flex items-center gap-1 font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Plan-O match
            </p>
            <p className="text-muted-foreground">Fit with your priorities</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {onSaveToggle && (
            <button
              onClick={() => onSaveToggle(plan)}
              aria-pressed={!!saved}
              className={cn(
                "inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-medium hover:bg-accent transition-colors glass",
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
                "inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-medium hover:bg-accent transition-colors glass",
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
              className="relative inline-flex h-9 items-center gap-1 overflow-hidden rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all hover:scale-[1.03] disabled:opacity-60"
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
