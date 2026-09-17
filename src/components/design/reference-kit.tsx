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

/* -----------------------------------------------------------------
 * Foundation-audit display primitives.
 * Documentation-only; consumed by /design-system and /design-guide.
 * ----------------------------------------------------------------- */

const OWNERSHIP_LABEL: Record<string, string> = {
  foundation: "Foundation",
  primitive: "Primitive",
  business: "Business",
  pattern: "Pattern",
  local: "Local",
};

/** Small metadata chip: ownership level, sharing status, maturity. */
export function MetaChip({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "primary" | "sage" | "warning";
}) {
  const tones: Record<string, string> = {
    muted: "border-hairline text-muted-foreground",
    primary: "border-primary/30 text-primary",
    sage: "border-sage/30 text-sage",
    warning: "border-warning/40 text-warning",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function OwnershipChip({ ownership }: { ownership: string }) {
  const tone =
    ownership === "foundation"
      ? "primary"
      : ownership === "local"
        ? "warning"
        : ownership === "pattern"
          ? "muted"
          : "sage";
  return <MetaChip tone={tone as "primary" | "sage" | "warning" | "muted"}>{OWNERSHIP_LABEL[ownership] ?? ownership}</MetaChip>;
}

/** Foundation inventory table: name, value, source, consumers, ownership. */
export function FoundationTable({
  entries,
}: {
  entries: {
    name: string;
    value: string;
    source: string;
    consumers: string;
    ownership: string;
    shared: string;
    maturity: string;
    note?: string;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">Name</th>
              <th scope="col" className="px-5 py-4 font-semibold">Current implementation</th>
              <th scope="col" className="px-5 py-4 font-semibold">Source of truth</th>
              <th scope="col" className="px-5 py-4 font-semibold">Consumers</th>
              <th scope="col" className="px-5 py-4 font-semibold">Ownership</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.name} className="border-b border-hairline/60 align-top last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{e.name}</p>
                  {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
                </td>
                <td className="px-5 py-4 text-muted-foreground">{e.value}</td>
                <td className="px-5 py-4"><span className="text-serial">{e.source}</span></td>
                <td className="px-5 py-4 text-muted-foreground">{e.consumers}</td>
                <td className="px-5 py-4">
                  <span className="flex flex-wrap gap-1.5">
                    <OwnershipChip ownership={e.ownership} />
                    <MetaChip>{e.shared === "source-of-truth" ? "Shared" : e.shared === "convention" ? "Convention" : "One-off"}</MetaChip>
                    {e.maturity === "opportunity" && <MetaChip tone="warning">Future</MetaChip>}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Relationship table: which pair, what the implementation actually does. */
export function RelationshipTable({
  entries,
}: {
  entries: { pair: string; observed: string; source: string; consistency: string; note?: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">Relationship</th>
              <th scope="col" className="px-5 py-4 font-semibold">Observed implementation</th>
              <th scope="col" className="px-5 py-4 font-semibold">Where</th>
              <th scope="col" className="px-5 py-4 font-semibold">As found</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.pair} className="border-b border-hairline/60 align-top last:border-0">
                <td className="px-5 py-4 font-medium">{e.pair}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {e.observed}
                  {e.note && <span className="mt-1 block text-xs">{e.note}</span>}
                </td>
                <td className="px-5 py-4"><span className="text-serial">{e.source}</span></td>
                <td className="px-5 py-4">
                  <MetaChip tone={e.consistency === "consistent" ? "sage" : "warning"}>
                    {e.consistency === "consistent" ? "Consistent" : "Varies"}
                  </MetaChip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Component / pattern inventory table. */
export function InventoryTable({
  entries,
}: {
  entries: {
    name: string;
    source: string;
    consumers: number;
    ownership: string;
    states: string;
    status: string;
    note?: string;
  }[];
}) {
  const statusTone: Record<string, "sage" | "muted" | "warning"> = {
    "in-use": "sage",
    "available-unused": "warning",
    "internal-only": "muted",
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">Component</th>
              <th scope="col" className="px-5 py-4 font-semibold">Source</th>
              <th scope="col" className="px-5 py-4 font-semibold">Consumers</th>
              <th scope="col" className="px-5 py-4 font-semibold">States / variants today</th>
              <th scope="col" className="px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.name} className="border-b border-hairline/60 align-top last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{e.name}</p>
                  {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
                </td>
                <td className="px-5 py-4"><span className="text-serial">{e.source}</span></td>
                <td className="px-5 py-4 tabular-nums text-muted-foreground">{e.consumers}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.states}</td>
                <td className="px-5 py-4">
                  <span className="flex flex-wrap gap-1.5">
                    <MetaChip tone={statusTone[e.status] ?? "muted"}>
                      {e.status === "in-use" ? "In use" : e.status === "available-unused" ? "Available" : "Internal"}
                    </MetaChip>
                    <OwnershipChip ownership={e.ownership} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Two-column definition rows for governance and mapping records. */
export function DefinitionRows({
  rows,
}: {
  rows: { term: string; detail: string; meta?: string }[];
}) {
  return (
    <div className="divide-y divide-hairline rounded-2xl border border-hairline bg-card">
      {rows.map((r) => (
        <div key={r.term} className="grid gap-2 p-5 md:grid-cols-[280px_1fr]">
          <p className="text-sm font-medium">{r.term}</p>
          <div>
            <p className="text-sm text-muted-foreground">{r.detail}</p>
            {r.meta && <p className="text-serial mt-1">{r.meta}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Callout used to separate CURRENT IMPLEMENTATION from FUTURE OPPORTUNITY. */
export function MaturityCallout({
  kind,
  title,
  children,
}: {
  kind: "current" | "opportunity";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        kind === "current" ? "border-sage/30 bg-sage-soft/40" : "border-warning/40 bg-warning/5",
      )}
    >
      <MetaChip tone={kind === "current" ? "sage" : "warning"}>
        {kind === "current" ? "Current implementation" : "Future opportunity"}
      </MetaChip>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
