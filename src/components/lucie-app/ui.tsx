import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/abox/status-badge";
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
    <header className="grid gap-4 border-b border-hairline pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : null}
        <h1 className="text-display mt-1.5 text-2xl sm:text-3xl">{title}</h1>
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
    <section className={cn("grid gap-4", className)}>
      {title ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h2 className="text-display text-lg">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
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
    <div
      className="grid gap-2 rounded-2xl border border-hairline bg-card p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <p className="text-eyebrow">{label}</p>
      <p className={cn("text-display text-3xl leading-none tabular-nums", toneCls)}>{value}</p>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

type ChipTone = "neutral" | "good" | "warn" | "bad" | "info";

const CHIP_TONE = {
  neutral: "muted",
  good: "sage",
  warn: "warning",
  bad: "destructive",
  info: "info",
} as const;

export function StatusChip({ tone = "neutral", children }: { tone?: ChipTone; children: ReactNode }) {
  return <StatusBadge tone={CHIP_TONE[tone]}>{children}</StatusBadge>;
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
    return <div className="rounded-xl border border-dashed border-hairline-strong/60 bg-surface/40 p-10 text-center text-sm text-muted-foreground">{empty}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline bg-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline text-left">
            {columns.map((c) => (
              <th
                key={c.head}
                className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
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
                "border-b border-hairline/70 align-top transition-colors last:border-0",
                onRowClick && "cursor-pointer hover:bg-surface/60",
              )}
            >
              {columns.map((c) => (
                <td key={c.head} className={cn("px-5 py-4 text-sm leading-relaxed", c.className)}>
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
      <p className="text-base font-semibold">{title}</p>
      {body ? <p className="max-w-sm text-sm text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid gap-2 rounded-xl border border-hairline bg-card p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-xl" />
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
              !active && !done && "border-hairline text-muted-foreground",
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
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>

      <span className="text-eyebrow">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
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
    <Card className="gap-2 rounded-2xl border-warning/30 bg-warning/5 p-6">
      <Badge variant="outline" className="w-fit border-warning/40 text-warning-foreground">
        Not available for this role
      </Badge>
      <p className="mt-2 text-sm font-medium">{what}</p>
      <p className="text-sm text-muted-foreground">
        Switch persona in the top bar to view this area as someone who has access.
      </p>
    </Card>
  );
}
