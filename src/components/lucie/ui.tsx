import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Id({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10.5px] leading-4 tracking-tight text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function IdList({ ids, empty = "—" }: { ids: string[]; empty?: string }) {
  if (!ids.length) return <span className="text-xs text-muted-foreground">{empty}</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {ids.map((id) => (
        <Id key={id}>{id}</Id>
      ))}
    </span>
  );
}

type Tone = "neutral" | "good" | "warn" | "stop" | "info";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-border bg-muted/60 text-muted-foreground",
  good: "border-chart-2/40 bg-chart-2/10 text-foreground",
  warn: "border-chart-5/45 bg-chart-5/12 text-foreground",
  stop: "border-destructive/40 bg-destructive/10 text-foreground",
  info: "border-primary/25 bg-primary/8 text-foreground",
};

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Posture strings come from the registers; tone is derived, never authored per screen. */
export function postureTone(posture: string): Tone {
  const p = posture.toLowerCase();
  if (p.includes("excluded") || p.includes("not in") || p.includes("out of")) return "stop";
  if (p.includes("seam") || p.includes("deferred") || p.includes("later")) return "warn";
  if (p.includes("simplified") || p.includes("limited") || p.includes("fixed")) return "info";
  if (p.includes("required") || p.includes("in scope") || p.includes("active")) return "good";
  return "neutral";
}

export function PostureTag({ posture }: { posture: string }) {
  if (!posture) return <span className="text-xs text-muted-foreground">—</span>;
  return <Tag tone={postureTone(posture)}>{posture}</Tag>;
}

export function Section({
  title,
  id,
  meta,
  description,
  children,
  className,
}: {
  title: string;
  id?: string;
  meta?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("min-w-0 rounded-xl border border-border bg-card shadow-sm", className)}
      aria-label={title}
    >
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {id ? <Id>{id}</Id> : null}
        {meta ? <span className="ml-auto text-[11px] text-muted-foreground">{meta}</span> : null}
      </header>
      {description ? (
        <p className="border-b border-border/70 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function PageHead({
  eyebrow,
  title,
  lede,
  right,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {lede ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lede}</p>
        ) : null}
      </div>
      {right ? <div className="flex flex-wrap items-center gap-2">{right}</div> : null}
    </header>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="text-lg font-semibold leading-none tabular-nums">{value}</div>
      <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {hint ? <div className="mt-1 text-[11px] text-muted-foreground/80">{hint}</div> : null}
    </div>
  );
}

export function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="grid gap-0.5 border-b border-border/60 py-2 last:border-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-3">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {k}
      </dt>
      <dd className="min-w-0 text-xs leading-relaxed text-foreground/90">{v}</dd>
    </div>
  );
}

export interface Column<T> {
  head: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function Table<T>({
  rows,
  columns,
  keyOf,
  empty = "No rows match the current filters.",
}: {
  rows: T[];
  columns: Column<T>[];
  keyOf: (row: T) => string;
  empty?: string;
}) {
  if (!rows.length) {
    return (
      <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
        {empty}
      </p>
    );
  }
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <table className="w-full min-w-[720px] border-collapse text-left align-top">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th
                key={c.head}
                className="px-2 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground first:pl-0 last:pr-0"
              >
                {c.head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={keyOf(row)} className="border-b border-border/60 align-top last:border-0">
              {columns.map((c) => (
                <td
                  key={c.head}
                  className={cn(
                    "px-2 py-2.5 text-xs leading-relaxed first:pl-0 last:pr-0",
                    c.className,
                  )}
                >
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 p-2">
      {children}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border bg-background px-2 py-1.5 text-xs font-normal normal-case tracking-normal text-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Search({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-w-[200px] flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
    />
  );
}

export function Note({ children, tone = "info" }: { children: ReactNode; tone?: Tone }) {
  return (
    <p
      className={cn(
        "rounded-lg border px-3 py-2.5 text-xs leading-relaxed",
        TONE_CLASS[tone],
        "text-foreground/85",
      )}
    >
      {children}
    </p>
  );
}
