/**
 * Reference kit — presentation shell used by the two unlisted reference
 * pages (`/design-system`, `/design-guide`).
 *
 * These are documentation wrappers only. They never redefine a token or a
 * component: values are read live from `src/styles.css` and every example
 * inside them renders the real production component.
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { readToken } from "@/lib/design-tokens";

export function RefPage({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-background text-foreground">{children}</div>;
}

export function RefContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[88rem] px-4 md:px-8", className)}>{children}</div>
  );
}

export function RefSection({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-hairline py-12 first:border-t-0">
      {eyebrow && <p className="text-eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-display text-2xl md:text-3xl">{title}</h2>
      {intro && <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function RefBlock({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-base font-semibold">{title}</h3>
      {note && <p className="mt-1 max-w-3xl text-xs text-muted-foreground">{note}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** Neutral stage for rendering live production components. */
export function RefStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-2xl border border-hairline bg-card p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Reads a live CSS variable and re-reads it when the theme class changes. */
export function useTokenValue(name: string): string {
  const [value, setValue] = useState("");
  useEffect(() => {
    const read = () => setValue(readToken(name));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, [name]);
  return value;
}

export function Swatch({
  name,
  label,
  usage,
  foreground,
}: {
  name: string;
  label: string;
  usage?: string;
  foreground?: string;
}) {
  const value = useTokenValue(name);
  return (
    <figure className="overflow-hidden rounded-xl border border-hairline bg-card">
      <div
        className="flex h-20 items-end justify-between px-3 pb-2"
        style={{
          background: `var(--${name})`,
          color: foreground ? `var(--${foreground})` : undefined,
        }}
      >
        {foreground && <span className="text-[11px] font-medium">Aa</span>}
      </div>
      <figcaption className="border-t border-hairline p-3">
        <p className="text-sm font-medium">{label}</p>
        {usage && <p className="mt-0.5 text-xs text-muted-foreground">{usage}</p>}
        <p className="text-serial mt-2 break-all">--{name}</p>
        <p className="mt-0.5 break-all text-[11px] tabular-nums text-muted-foreground">
          {value || "—"}
        </p>
      </figcaption>
    </figure>
  );
}

export function SwatchGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>;
}

/** Simple in-page table of contents for the long reference pages. */
export function RefToc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="rounded-2xl border border-hairline bg-surface/60 p-5">
      <p className="text-eyebrow mb-3">On this page</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className="relative ember-underline text-muted-foreground hover:text-foreground"
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
