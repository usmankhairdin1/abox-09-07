import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Grey placeholder block standing in for content that is not designed yet. */
export function WBox({
  className,
  label,
  children,
}: {
  className?: string;
  label?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md border border-dashed border-hairline bg-muted/40 p-3 text-center",
        className,
      )}
    >
      {children ?? (
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

/** Text placeholder line. */
export function WLine({ w = "100%", className }: { w?: string; className?: string }) {
  return (
    <div
      className={cn("h-2 rounded-full bg-muted", className)}
      style={{ width: w }}
      aria-hidden="true"
    />
  );
}

/** Row placeholder used inside list cards. */
export function WRow({
  primary = "70%",
  secondary = "40%",
  trailing,
}: {
  primary?: string;
  secondary?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-hairline py-2.5 last:border-b-0">
      <div className="size-7 shrink-0 rounded-full bg-muted" aria-hidden="true" />
      <div className="flex-1 space-y-1.5">
        <WLine w={primary} />
        <WLine w={secondary} className="h-1.5 bg-muted/70" />
      </div>
      {trailing}
    </div>
  );
}

/** Panel with a title, optional id chip and description. */
export function WPanel({
  title,
  id,
  meta,
  actions,
  children,
  className,
}: {
  title: string;
  id?: string;
  meta?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-hairline bg-card", className)}>
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-hairline px-4 py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            {id ? <IdChip>{id}</IdChip> : null}
          </div>
          {meta ? <p className="mt-1 text-xs text-muted-foreground">{meta}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

/** Stable ID chip — IDs are permanent and always shown on wireframes. */
export function IdChip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "prov";
}) {
  return (
    <span
      className={cn(
        "rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        tone === "prov"
          ? "border-dashed border-foreground/40 text-foreground/70"
          : "border-hairline bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

/** Wireframe annotation. Mono, bracketed, clearly not product copy. */
export function Annotation({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] leading-relaxed text-muted-foreground", className)}>
      <span aria-hidden="true">[ </span>
      {children}
      <span aria-hidden="true"> ]</span>
    </p>
  );
}

/** ACL / entity-context note. Every screen carries one. */
export function AclNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-hairline bg-muted/30 px-3 py-2">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        ACL &amp; entity context
      </p>
      <p className="mt-1 text-xs leading-relaxed text-foreground/80">{children}</p>
    </div>
  );
}

/** Small status pill. */
export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-hairline bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground/80",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Page heading used by every wireframe screen. */
export function PageHeading({
  eyebrow,
  title,
  id,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  id: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <IdChip>{id}</IdChip>
        </div>
        <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** Grey stand-in for a chart. No real chart at this fidelity. */
export function WChart({ bars = 9, height = 120 }: { bars?: number; height?: number }) {
  const pattern = [42, 68, 55, 80, 61, 92, 74, 50, 86, 63, 71, 58];
  return (
    <div
      className="flex items-end gap-1.5 rounded-md border border-dashed border-hairline bg-muted/20 p-3"
      style={{ height }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-muted"
          style={{ height: `${pattern[i % pattern.length]}%` }}
        />
      ))}
    </div>
  );
}
