import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ actions */

export function Btn({
  children,
  variant = "primary",
  size = "md",
  className,
  full,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "quiet";
  size?: "sm" | "md" | "lg";
  className?: string;
  full?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-9 px-4 text-sm",
        size === "lg" && "h-11 px-6 text-[0.95rem]",
        variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",
        variant === "outline" && "border border-hairline bg-card hover:bg-accent",
        variant === "ghost" && "text-foreground/80 hover:bg-accent",
        variant === "quiet" && "text-muted-foreground hover:text-foreground",
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ surfaces */

export function Card({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string | undefined;
  as?: "div" | "section" | "article" | "li" | undefined;
}) {
  return (
    <As
      className={cn(
        "rounded-[var(--radius)] border border-hairline bg-card shadow-[0_1px_2px_0_oklch(0_0_0/4%)]",
        className,
      )}
    >
      {children}
    </As>
  );
}

export function Panel({
  title,
  meta,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string | undefined;
  meta?: string | undefined;
  actions?: ReactNode;
  children: ReactNode;
  className?: string | undefined;
  bodyClassName?: string | undefined;
}) {
  return (
    <Card as="section" className={className}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-4 py-3">
          <div className="min-w-0">
            <h3 className="font-display text-sm font-semibold tracking-tight">{title}</h3>
            {meta ? <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </Card>
  );
}

/* -------------------------------------------------------------------- status */

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "ai";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-hairline bg-muted text-muted-foreground",
  accent: "border-primary/25 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/12 text-success",
  warning: "border-warning/35 bg-warning/15 text-warning-foreground",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  ai: "border-ai/30 bg-ai/10 text-ai",
};

const TONE_DOT: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  accent: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  ai: "bg-ai",
};

/** Status is never colour-only: the label always carries the meaning. */
export function Badge({
  children,
  tone = "neutral",
  dot,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      {dot ? (
        <span className={cn("size-1.5 rounded-full", TONE_DOT[tone])} aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}

export function Alert({
  tone = "neutral",
  title,
  children,
  action,
}: {
  tone?: Tone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-3 rounded-[var(--radius)] border px-3.5 py-3",
        TONE_CLASS[tone],
      )}
      role={tone === "danger" ? "alert" : undefined}
    >
      <span
        className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", TONE_DOT[tone])}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {children ? (
          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{children}</div>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** Regulated disclosure. Quiet, legible, never dismissible. */
export function Disclosure({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "border-l-2 border-hairline pl-3 text-[11px] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* --------------------------------------------------------------------- data */

export function Stat({
  label,
  value,
  delta,
  deltaTone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: Tone;
  hint?: string;
}) {
  return (
    <Card className="px-4 py-3.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
        <span className="font-display text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        {delta ? (
          <span
            className={cn(
              "text-xs font-medium",
              deltaTone === "success" && "text-success",
              deltaTone === "danger" && "text-destructive",
              deltaTone === "neutral" && "text-muted-foreground",
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}

export function Field({
  label,
  value,
  placeholder,
  hint,
  suffix,
  className,
  sensitive,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  hint?: string;
  suffix?: ReactNode;
  className?: string;
  sensitive?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="flex items-center gap-2 text-xs font-medium text-foreground/80">
        {label}
        {sensitive ? <Badge tone="warning">sensitive</Badge> : null}
      </span>
      <span className="mt-1.5 flex h-10 items-center gap-2 rounded-[var(--radius)] border border-input bg-background px-3">
        <span
          className={cn(
            "flex-1 truncate text-sm",
            value ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {value ?? placeholder}
        </span>
        {suffix}
      </span>
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function Choice({
  label,
  hint,
  selected,
  className,
}: {
  label: string;
  hint?: string;
  selected?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius)] border px-3 py-2.5",
        selected ? "border-primary bg-primary/[0.06]" : "border-hairline bg-card",
        className,
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
          selected ? "border-primary" : "border-hairline",
        )}
        aria-hidden="true"
      >
        {selected ? <span className="size-2 rounded-full bg-primary" /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
    </div>
  );
}

export function Check({
  label,
  checked,
  hint,
}: {
  label: string;
  checked?: boolean | undefined;
  hint?: string | undefined;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded border",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-hairline bg-background",
        )}
        aria-hidden="true"
      >
        {checked ? (
          <svg
            viewBox="0 0 10 10"
            className="size-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 5l2.5 2.5L9 2" />
          </svg>
        ) : null}
      </span>
      <span className="min-w-0 text-xs leading-relaxed text-foreground/80">
        {label}
        {hint ? (
          <span className="mt-0.5 block text-[11px] text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </div>
  );
}

export function Table({
  columns,
  rows,
  dense = true,
}: {
  columns: string[];
  rows: ReactNode[][];
  dense?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[20rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline">
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-hairline last:border-b-0 hover:bg-accent/40">
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-3 align-middle",
                    dense ? "py-2.5" : "py-3.5",
                    j === 0 && "font-medium",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Bars({
  series,
  compare,
  labels,
}: {
  series: number[];
  compare?: number[];
  labels: string[];
}) {
  const max = Math.max(...series, ...(compare ?? [0]));
  return (
    <div className="flex h-40 items-end gap-2 border-b border-l border-hairline pb-0 pl-1">
      {series.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col justify-end gap-1">
          <div className="flex h-full items-end gap-0.5">
            {compare ? (
              <div
                className="w-1/2 rounded-t-sm bg-muted"
                style={{ height: `${((compare[i] ?? 0) / max) * 100}%` }}
                aria-hidden="true"
              />
            ) : null}
            <div
              className={cn("rounded-t-sm bg-primary", compare ? "w-1/2" : "w-full")}
              style={{ height: `${(v / max) * 100}%` }}
              aria-hidden="true"
            />
          </div>
          <span className="truncate text-center text-[10px] text-muted-foreground">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} aria-hidden="true" />;
}

export function EmptyState({
  title,
  body,
  action,
  tone = "neutral",
}: {
  title: string;
  body: string;
  action?: ReactNode;
  tone?: "neutral" | "acl";
}) {
  return (
    <div className="rounded-[var(--radius)] border border-dashed border-hairline bg-muted/25 px-5 py-8 text-center">
      <p className="font-display text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action ? <div className="mt-3 flex justify-center">{action}</div> : null}
      {tone === "acl" ? (
        <div className="mt-3 flex justify-center">
          <Badge tone="warning">permission-scoped empty state</Badge>
        </div>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------------- patterns */

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full border text-[11px] font-semibold",
                active && "border-primary bg-primary text-primary-foreground",
                done && "border-primary/40 bg-primary/10 text-primary",
                !active && !done && "border-hairline bg-card text-muted-foreground",
              )}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={cn(
                "text-xs",
                active ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 ? (
              <span className="mx-1 hidden h-px w-8 bg-border sm:block" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export interface TimelineEntry {
  kind: "system" | "human" | "ai" | "status";
  title: string;
  body?: string;
  meta: string;
  actor?: string;
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative space-y-0">
      <span className="absolute bottom-3 left-[9px] top-3 w-px bg-border" aria-hidden="true" />
      {entries.map((e, i) => (
        <li key={i} className="relative flex gap-3 py-3">
          <span
            className={cn(
              "relative z-10 mt-1 grid size-[19px] shrink-0 place-items-center rounded-full border-2 bg-card",
              e.kind === "ai" && "border-ai",
              e.kind === "system" && "border-hairline",
              e.kind === "human" && "border-primary",
              e.kind === "status" && "border-success",
            )}
            aria-hidden="true"
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                e.kind === "ai" && "bg-ai",
                e.kind === "system" && "bg-muted-foreground",
                e.kind === "human" && "bg-primary",
                e.kind === "status" && "bg-success",
              )}
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{e.title}</p>
              <Badge tone={e.kind === "ai" ? "ai" : e.kind === "status" ? "success" : "neutral"}>
                {e.kind === "ai"
                  ? "AI"
                  : e.kind === "system"
                    ? "System"
                    : e.kind === "status"
                      ? "Status"
                      : "Person"}
              </Badge>
            </div>
            {e.body ? (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{e.body}</p>
            ) : null}
            <p className="mt-1 text-[11px] text-muted-foreground">
              {e.meta}
              {e.actor ? ` · ${e.actor}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------- consumer plan surface */

export interface Plan {
  carrier: string;
  name: string;
  metal: string;
  net: string;
  gross: string;
  deductible: string;
  oopMax: string;
  network: string;
  hsa?: boolean;
  planO?: string;
}

export function PlanCard({
  plan,
  selected,
  compact,
}: {
  plan: Plan;
  selected?: boolean;
  compact?: boolean;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-3 p-4 transition-shadow hover:shadow-[0_4px_16px_-6px_oklch(0_0_0/12%)]",
        selected && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {plan.carrier}
          </p>
          <p className="font-display text-base font-semibold leading-snug tracking-tight">
            {plan.name}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge>{plan.metal}</Badge>
            <Badge>{plan.network}</Badge>
            {plan.hsa ? <Badge>HSA eligible</Badge> : null}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-2xl font-semibold tracking-tight tabular-nums">
            {plan.net}
          </p>
          <p className="text-[11px] text-muted-foreground">
            <span className="line-through">{plan.gross}</span> before credit
          </p>
          <p className="text-[11px] text-muted-foreground">per month · estimate</p>
        </div>
      </div>

      {plan.planO ? (
        <div className="rounded-[var(--radius)] border border-ai/30 bg-ai/[0.07] px-3 py-2">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ai">
            <span className="size-1.5 rounded-full bg-ai" aria-hidden="true" /> PlanAI reason
          </p>
          <p className="mt-1 text-xs leading-relaxed text-foreground/80">{plan.planO}</p>
        </div>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-hairline pt-3 text-xs">
        <div>
          <dt className="text-muted-foreground">Deductible</dt>
          <dd className="mt-0.5 font-medium tabular-nums">{plan.deductible}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Out-of-pocket max</dt>
          <dd className="mt-0.5 font-medium tabular-nums">{plan.oopMax}</dd>
        </div>
      </dl>

      {compact ? null : (
        <div className="mt-auto flex items-center gap-2 pt-1">
          <Btn size="sm">Add to cart</Btn>
          <Btn size="sm" variant="outline">
            Plan details
          </Btn>
          <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={cn(
                "grid size-4 place-items-center rounded border",
                selected ? "border-primary bg-primary text-primary-foreground" : "border-hairline",
              )}
              aria-hidden="true"
            >
              {selected ? "✓" : ""}
            </span>
            Compare
          </label>
        </div>
      )}
    </Card>
  );
}

export const PLANS: Plan[] = [
  {
    carrier: "Blue Summit Health",
    name: "Summit Silver 3500 HSA",
    metal: "Silver",
    net: "$142",
    gross: "$486",
    deductible: "$3,500",
    oopMax: "$7,200",
    network: "PPO",
    hsa: true,
  },
  {
    carrier: "Meridian Health Plans",
    name: "Meridian Silver Select 2500",
    metal: "Silver",
    net: "$168",
    gross: "$512",
    deductible: "$2,500",
    oopMax: "$6,900",
    network: "HMO",
  },
  {
    carrier: "Cascade Care",
    name: "Cascade Bronze Essential 7000",
    metal: "Bronze",
    net: "$0",
    gross: "$344",
    deductible: "$7,000",
    oopMax: "$9,450",
    network: "EPO",
  },
  {
    carrier: "Blue Summit Health",
    name: "Summit Gold 1000",
    metal: "Gold",
    net: "$284",
    gross: "$628",
    deductible: "$1,000",
    oopMax: "$4,500",
    network: "PPO",
  },
];
