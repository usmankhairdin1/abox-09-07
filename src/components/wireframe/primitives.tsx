import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared screen primitives.
 *
 * These were originally grey-box wireframe stand-ins. They now render in the
 * Meridian Navy design system (hairline borders, card surfaces, display type,
 * editorial serial labels) so every estate that consumes them — /m1, /p1, /gov,
 * /m00, /m06 — reads as a finished product surface. Structure, props and
 * semantics are unchanged.
 */

/** Content region placeholder — a real surface plate, not a grey box. */
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
        "relative flex items-center justify-center overflow-hidden rounded-xl border border-hairline bg-surface/60 p-4 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 noise-field opacity-40"
      />
      {children ?? (
        <span className="relative text-serial text-[10.5px] leading-relaxed">{label}</span>
      )}
    </div>
  );
}

/** Text placeholder line. */
export function WLine({ w = "100%", className }: { w?: string; className?: string }) {
  return (
    <div
      className={cn("h-2 rounded-full bg-panel", className)}
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
    <div className="group flex items-center gap-3 border-b border-hairline/70 py-3 transition-colors last:border-b-0 hover:bg-surface/60">
      <div
        className="size-8 shrink-0 rounded-full border border-hairline bg-primary-soft"
        aria-hidden="true"
      />
      <div className="flex-1 space-y-1.5">
        <WLine w={primary} />
        <WLine w={secondary} className="h-1.5 bg-panel/70" />
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
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-hairline bg-card shadow-card",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-hairline bg-surface/50 px-5 py-3.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-[15px] font-semibold tracking-tight">{title}</h2>
            {id ? <IdChip>{id}</IdChip> : null}
          </div>
          {meta ? <p className="mt-1 text-xs text-muted-foreground">{meta}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

/** Stable ID chip — IDs are permanent and always shown. */
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
        "inline-flex items-center whitespace-nowrap rounded-lg border px-2 py-0.5 font-mono text-[10px] uppercase leading-4 tracking-tight",
        tone === "prov"
          ? "border-dashed border-border-strong text-muted-foreground"
          : "border-hairline bg-surface text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

/** Governance annotation — quiet, editorial, clearly not product copy. */
export function Annotation({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "relative border-l-2 border-primary/25 pl-3 text-[11.5px] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** ACL / entity-context note. Every screen carries one. */
export function AclNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-hairline bg-primary-soft/60 px-4 py-3">
      <p className="text-eyebrow">ACL &amp; entity context</p>
      <p className="mt-1 text-xs leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}

/** Small status pill. */
export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-0.5 text-[11px] font-medium text-foreground/80",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Page heading used by every screen. */
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
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-5">
      <div className="min-w-0">
        {eyebrow ? <p className="text-eyebrow tracking-[0.14em]">{eyebrow}</p> : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <h1 className="text-display text-2xl sm:text-[28px]">{title}</h1>
          <IdChip>{id}</IdChip>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-4 h-px w-24 origin-left animate-hairline bg-primary/40" aria-hidden />
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** Compact column chart. */
export function WChart({ bars = 9, height = 120 }: { bars?: number; height?: number }) {
  const pattern = [42, 68, 55, 80, 61, 92, 74, 50, 86, 63, 71, 58];
  return (
    <div
      className="flex items-end gap-1.5 rounded-xl border border-hairline bg-surface/50 p-3"
      style={{ height }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md bg-primary/70 transition-[height] duration-500"
          style={{
            height: `${pattern[i % pattern.length] ?? 60}%`,
            opacity: 0.35 + ((pattern[i % pattern.length] ?? 60) / 100) * 0.6,
          }}
        />
      ))}
    </div>
  );
}
