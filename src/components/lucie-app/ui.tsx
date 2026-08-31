import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid gap-4 border-b border-border pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {lede ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{lede}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grid gap-3", className)}>
      {title ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const toneCls = {
    default: "text-foreground",
    good: "text-success",
    warn: "text-warning",
    bad: "text-destructive",
  }[tone];
  return (
    <Card className="gap-1 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className={cn("font-display text-2xl font-semibold tabular-nums", toneCls)}>{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}

type ChipTone = "neutral" | "good" | "warn" | "bad" | "info";

const CHIP: Record<ChipTone, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  good: "bg-success/12 text-success border-success/25",
  warn: "bg-warning/14 text-warning-foreground border-warning/30",
  bad: "bg-destructive/10 text-destructive border-destructive/25",
  info: "bg-info/12 text-info border-info/25",
};

export function StatusChip({ tone = "neutral", children }: { tone?: ChipTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
        CHIP[tone],
      )}
    >
      {children}
    </span>
  );
}

export function toneFor(value: string): ChipTone {
  const v = value.toLowerCase();
  if (["ready", "active", "live", "healthy", "open", "appointed", "acknowledged", "resolved"].includes(v)) return "good";
  if (["in_review", "in review", "pending", "draft", "provisioning", "conditional", "expiring", "degraded"].includes(v))
    return "warn";
  if (["blocked", "failing", "expired", "suspended", "closed", "action needed", "terminated"].includes(v)) return "bad";
  if (["handed off", "paused"].includes(v)) return "info";
  return "neutral";
}

export interface Column<T> {
  head: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({
  rows,
  columns,
  keyOf,
  empty,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  keyOf: (row: T) => string;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
}) {
  if (!rows.length) {
    return <div className="rounded-xl border border-dashed border-border p-8 text-center">{empty}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            {columns.map((c) => (
              <th
                key={c.head}
                className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                {c.head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={keyOf(r)}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              className={cn(
                "border-b border-border/70 last:border-0 align-top",
                onRowClick && "cursor-pointer transition-colors hover:bg-accent/50",
              )}
            >
              {columns.map((c) => (
                <td key={c.head} className={cn("px-4 py-3", c.className)}>
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid justify-items-center gap-2 py-6 text-center">
      <p className="text-sm font-medium">{title}</p>
      {body ? <p className="max-w-sm text-xs text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid gap-2 rounded-xl border border-border bg-card p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function Stepper({
  steps,
  current,
}: {
  steps: { label: string; to?: string }[];
  current: number;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const body = (
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors",
              active && "border-primary bg-primary text-primary-foreground",
              done && "border-success/30 bg-success/10 text-success",
              !active && !done && "border-border text-muted-foreground",
            )}
          >
            <span className="tabular-nums opacity-70">{i + 1}</span>
            {s.label}
          </span>
        );
        return (
          <li key={s.label}>
            {s.to && (done || active) ? <Link to={s.to}>{body}</Link> : body}
          </li>
        );
      })}
    </ol>
  );
}

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
      {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function Money({ value, per }: { value: number; per?: string }) {
  return (
    <span className="tabular-nums">
      ${value.toLocaleString("en-US")}
      {per ? <span className="text-xs font-normal text-muted-foreground">/{per}</span> : null}
    </span>
  );
}

export function NotPermitted({ what }: { what: string }) {
  return (
    <Card className="border-warning/30 bg-warning/5 p-6">
      <Badge variant="outline" className="w-fit border-warning/40 text-warning-foreground">
        Not available for this role
      </Badge>
      <p className="mt-2 text-sm font-medium">{what}</p>
      <p className="text-xs text-muted-foreground">
        Switch persona in the top bar to view this area as someone who has access.
      </p>
    </Card>
  );
}
