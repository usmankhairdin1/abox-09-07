/**
 * KpiCard — glass metric orb. Large tabular numeric, delta chip in
 * a pill and a large corner icon tile.
 */
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";
import { CountUp } from "./motion";

interface Props {
  label: string;
  value: string | number;
  delta?: { pct: number; label?: string };
  icon?: ComponentType<{ className?: string }>;
  hint?: string;
  tone?: "default" | "primary" | "sage" | "warning";
  className?: string;
}

function parseNumeric(v: string | number): { n: number | null; prefix: string; suffix: string } {
  if (typeof v === "number") return { n: v, prefix: "", suffix: "" };
  const m = v.match(/^([^\d-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return { n: null, prefix: "", suffix: "" };
  return { n: Number(m[2].replace(/,/g, "")), prefix: m[1], suffix: m[3] };
}

const TONE = {
  default: { text: "text-primary", tile: "bg-primary/6", hover: "group-hover:bg-primary group-hover:text-primary-foreground", wash: "var(--primary)" },
  primary: { text: "text-primary", tile: "bg-primary/10", hover: "group-hover:bg-primary group-hover:text-primary-foreground", wash: "var(--primary)" },
  sage:    { text: "text-sage",    tile: "bg-sage/10",    hover: "group-hover:bg-sage group-hover:text-sage-foreground",       wash: "var(--sage)" },
  warning: { text: "text-warning", tile: "bg-warning/12", hover: "group-hover:bg-warning group-hover:text-warning-foreground", wash: "var(--warning)" },
} as const;

export function KpiCard({ label, value, delta, icon: Icon, hint, tone = "default", className }: Props) {
  const parsed = parseNumeric(value);
  const t = TONE[tone];
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 card-brackets edge-sheen",
        className,
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Refined tone accent: a hairline wash along the top edge — no colored side bars. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, ${t.wash}, transparent 65%)` }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-eyebrow">{label}</p>
        </div>
        {Icon && (
          <span
            aria-hidden
            className={cn(
              "inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-hairline transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105",
              t.tile, t.text, t.hover,
            )}
          >
            <Icon className="h-8 w-8" />
          </span>
        )}
      </div>


      <p className="relative text-display mt-8 text-5xl tabular-nums leading-none">
        {parsed.n === null ? value : (
          <>
            {parsed.prefix}
            <CountUp value={parsed.n} />
            {parsed.suffix}
          </>
        )}
      </p>

      {(delta || hint) && (
        <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium tabular-nums glass",
                delta.pct >= 0 ? "text-sage" : "text-destructive",
              )}
            >
              {delta.pct >= 0 ? "▲" : "▼"} {Math.abs(delta.pct).toFixed(1)}%
            </span>
          )}
          {delta?.label && <span className="text-muted-foreground">{delta.label}</span>}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}
