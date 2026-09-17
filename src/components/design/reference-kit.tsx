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
  return (
    <MetaChip tone={tone as "primary" | "sage" | "warning" | "muted"}>
      {OWNERSHIP_LABEL[ownership] ?? ownership}
    </MetaChip>
  );
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
              <th scope="col" className="px-5 py-4 font-semibold">
                Name
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Current implementation
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Source of truth
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Consumers
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Ownership
              </th>
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
                <td className="px-5 py-4">
                  <span className="text-serial">{e.source}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{e.consumers}</td>
                <td className="px-5 py-4">
                  <span className="flex flex-wrap gap-1.5">
                    <OwnershipChip ownership={e.ownership} />
                    <MetaChip>
                      {e.shared === "source-of-truth"
                        ? "Shared"
                        : e.shared === "convention"
                          ? "Convention"
                          : "One-off"}
                    </MetaChip>
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
              <th scope="col" className="px-5 py-4 font-semibold">
                Relationship
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Observed implementation
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Where
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                As found
              </th>
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
                <td className="px-5 py-4">
                  <span className="text-serial">{e.source}</span>
                </td>
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
              <th scope="col" className="px-5 py-4 font-semibold">
                Component
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Source
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Consumers
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                States / variants today
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.name} className="border-b border-hairline/60 align-top last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{e.name}</p>
                  {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
                </td>
                <td className="px-5 py-4">
                  <span className="text-serial">{e.source}</span>
                </td>
                <td className="px-5 py-4 tabular-nums text-muted-foreground">{e.consumers}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.states}</td>
                <td className="px-5 py-4">
                  <span className="flex flex-wrap gap-1.5">
                    <MetaChip tone={statusTone[e.status] ?? "muted"}>
                      {e.status === "in-use"
                        ? "In use"
                        : e.status === "available-unused"
                          ? "Available"
                          : "Internal"}
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

/* -----------------------------------------------------------------
 * Phase 2 — spacing & layout audit display primitives.
 * Documentation-only; consumed by /design-system and /design-guide.
 * ----------------------------------------------------------------- */

function RefTable({
  minWidth,
  head,
  children,
}: {
  minWidth: string;
  head: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth }}>
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="px-5 py-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

const ROW = "border-b border-hairline/60 align-top last:border-0";

function ConsistencyChip({ value }: { value: string }) {
  const tone =
    value === "consistent" ? "sage" : value === "mostly-consistent" ? "muted" : "warning";
  const label =
    value === "consistent"
      ? "Consistent"
      : value === "mostly-consistent"
        ? "Mostly consistent"
        : value === "one-off"
          ? "One-off"
          : "Variable";
  return <MetaChip tone={tone as "sage" | "muted" | "warning"}>{label}</MetaChip>;
}

/** Spacing audit table: value, purpose, frequency, risk. */
export function SpacingTable({
  entries,
}: {
  entries: {
    value: string;
    computed: string;
    occurrences: number;
    purpose: string;
    where: string;
    frequency: string;
    consistency: string;
    source: string;
    ownership: string;
    centralizable: string;
    risk: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="980px"
      head={["Value", "Uses", "Purpose & where", "As found", "Centralizable", "Ownership"]}
    >
      {entries.map((e) => (
        <tr key={e.value} className={ROW}>
          <td className="px-5 py-4">
            <p className="text-serial">{e.value}</p>
            <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">{e.computed}</p>
          </td>
          <td className="px-5 py-4 tabular-nums text-muted-foreground">{e.occurrences}</td>
          <td className="px-5 py-4 text-muted-foreground">
            <span className="block text-foreground">{e.purpose}</span>
            <span className="mt-1 block text-xs">{e.where}</span>
            {e.note && <span className="mt-1 block text-xs">{e.note}</span>}
          </td>
          <td className="px-5 py-4">
            <span className="flex flex-wrap gap-1.5">
              <ConsistencyChip value={e.consistency} />
              <MetaChip>
                {e.frequency === "recurring"
                  ? "Recurring"
                  : e.frequency === "occasional"
                    ? "Occasional"
                    : "One-off"}
              </MetaChip>
            </span>
          </td>
          <td className="px-5 py-4">
            <span className="flex flex-wrap gap-1.5">
              <MetaChip
                tone={
                  e.centralizable === "safe"
                    ? "sage"
                    : e.centralizable === "unsafe"
                      ? "warning"
                      : "muted"
                }
              >
                {e.centralizable === "safe"
                  ? "Safe"
                  : e.centralizable === "unsafe"
                    ? "Unsafe"
                    : "Conditional"}
              </MetaChip>
              <MetaChip tone={e.risk === "high" ? "warning" : "muted"}>{e.risk} risk</MetaChip>
            </span>
          </td>
          <td className="px-5 py-4">
            <OwnershipChip ownership={e.ownership} />
            <p className="text-serial mt-1.5 break-all">{e.source}</p>
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Container inventory table. */
export function ContainerTable({
  entries,
}: {
  entries: {
    name: string;
    widthBehavior: string;
    maxWidth: string;
    gutters: string;
    alignment: string;
    responsive: string;
    consumers: string;
    source: string;
    shared: string;
    variations: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="1000px"
      head={["Container", "Width & gutters", "Responsive", "Consumers", "Variations"]}
    >
      {entries.map((e) => (
        <tr key={e.name} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{e.name}</p>
            <span className="mt-1.5 flex flex-wrap gap-1.5">
              <MetaChip tone={e.shared === "shared" ? "sage" : "warning"}>
                {e.shared === "shared" ? "Shared" : "Local"}
              </MetaChip>
            </span>
            <p className="text-serial mt-1.5 break-all">{e.source}</p>
          </td>
          <td className="px-5 py-4 text-muted-foreground">
            <span className="text-serial block">{e.maxWidth}</span>
            <span className="text-serial mt-1 block">{e.gutters}</span>
            <span className="mt-1 block text-xs">{e.widthBehavior}</span>
            <span className="mt-1 block text-xs">{e.alignment}</span>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{e.responsive}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.consumers}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.variations}</td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Responsive pattern table: desktop / tablet / mobile as implemented. */
export function ResponsiveTable({
  entries,
}: {
  entries: {
    name: string;
    trigger: string;
    desktop: string;
    tablet: string;
    mobile: string;
    source: string;
    consumers: string;
    variations: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="1040px"
      head={["Pattern", "Trigger", "Desktop", "Tablet", "Mobile", "Where"]}
    >
      {entries.map((e) => (
        <tr key={e.name} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{e.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{e.variations}</p>
          </td>
          <td className="px-5 py-4">
            <span className="text-serial">{e.trigger}</span>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{e.desktop}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.tablet}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.mobile}</td>
          <td className="px-5 py-4">
            <span className="text-serial break-all">{e.source}</span>
            <p className="mt-1 text-xs text-muted-foreground">{e.consumers}</p>
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Density table: observed contextual density modes. */
export function DensityTable({
  entries,
}: {
  entries: {
    mode: string;
    context: string;
    controlHeight: string;
    padding: string;
    gap: string;
    typography: string;
    iconSize: string;
    source: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="960px"
      head={["Mode", "Context", "Control height", "Padding & gap", "Type & icon", "Source"]}
    >
      {entries.map((e) => (
        <tr key={e.mode} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{e.mode}</p>
            {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
          </td>
          <td className="px-5 py-4 text-muted-foreground">{e.context}</td>
          <td className="px-5 py-4">
            <span className="text-serial">{e.controlHeight}</span>
          </td>
          <td className="px-5 py-4 text-muted-foreground">
            <span className="text-serial block">{e.padding}</span>
            <span className="text-serial mt-1 block">{e.gap}</span>
          </td>
          <td className="px-5 py-4 text-muted-foreground">
            <span className="block">{e.typography}</span>
            <span className="mt-1 block text-xs">{e.iconSize}</span>
          </td>
          <td className="px-5 py-4">
            <span className="text-serial break-all">{e.source}</span>
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Dimensional inventory table. */
export function DimensionTable({
  entries,
}: {
  entries: {
    element: string;
    value: string;
    occurrences: string;
    source: string;
    ownership: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable minWidth="880px" head={["Element", "Observed value", "Uses", "Source", "Ownership"]}>
      {entries.map((e) => (
        <tr key={e.element} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{e.element}</p>
            {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
          </td>
          <td className="px-5 py-4">
            <span className="text-serial">{e.value}</span>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{e.occurrences}</td>
          <td className="px-5 py-4">
            <span className="text-serial break-all">{e.source}</span>
          </td>
          <td className="px-5 py-4">
            <OwnershipChip ownership={e.ownership} />
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Layout pattern cards: anatomy, examples, responsive behaviour. */
export function LayoutPatternList({
  entries,
}: {
  entries: {
    name: string;
    purpose: string;
    anatomy: string;
    examples: string;
    responsive: string;
    spacing: string;
    shared: string;
    source: string;
    ownership: string;
    maturity: string;
    opportunity?: string;
  }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {entries.map((e) => (
        <article key={e.name} className="rounded-2xl border border-hairline bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="text-sm font-semibold">{e.name}</h4>
            <span className="flex flex-wrap gap-1.5">
              <OwnershipChip ownership={e.ownership} />
              <MetaChip tone={e.shared === "shared" ? "sage" : "muted"}>
                {e.shared === "shared" ? "Shared" : "Local"}
              </MetaChip>
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{e.purpose}</p>
          <dl className="mt-4 space-y-2 text-xs">
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Anatomy
              </dt>
              <dd className="mt-0.5 text-muted-foreground">{e.anatomy}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Spacing
              </dt>
              <dd className="mt-0.5 text-muted-foreground">{e.spacing}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Responsive
              </dt>
              <dd className="mt-0.5 text-muted-foreground">{e.responsive}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Examples
              </dt>
              <dd className="text-serial mt-0.5 break-all">{e.examples}</dd>
            </div>
          </dl>
          {e.opportunity && (
            <p className="mt-4 rounded-xl border border-warning/40 bg-warning/5 p-3 text-xs text-muted-foreground">
              {e.opportunity}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

/** Simple governance / unowned-area list. */
export function RuleList({
  items,
  tone = "muted",
}: {
  items: string[];
  tone?: "muted" | "warning";
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "rounded-xl border p-4 text-sm text-muted-foreground",
            tone === "warning" ? "border-warning/40 bg-warning/5" : "border-hairline bg-card",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* -----------------------------------------------------------------
 * Phase 4 — iconography & asset display helpers.
 * Documentation-only rendering. No production component is affected.
 * ----------------------------------------------------------------- */

/** Semantic icon inventory table. */
export function IconTable({
  entries,
}: {
  entries: {
    name: string;
    library: string;
    role: string;
    usage: number;
    where: string;
    size: string;
    treatment: string;
    interactive: string;
    semantics: string;
    experience: string;
    note?: string;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">
                Icon
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Role &amp; where
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Size
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Treatment
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Import sites
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.name} className="border-b border-hairline/60 align-top last:border-0">
                <td className="px-5 py-4">
                  <span className="font-medium">{e.name}</span>
                  <span className="mt-1 block text-serial">{e.library}</span>
                  <span className="mt-2 flex flex-wrap gap-1">
                    <MetaChip>{e.semantics}</MetaChip>
                    <MetaChip>{e.interactive}</MetaChip>
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <span className="block text-foreground">{e.role}</span>
                  {e.where}
                  <span className="mt-1 block text-xs">{e.experience}</span>
                  {e.note && <span className="mt-1 block text-xs text-warning">{e.note}</span>}
                </td>
                <td className="px-5 py-4 text-muted-foreground">{e.size}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.treatment}</td>
                <td className="px-5 py-4 tabular-nums">{e.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Logo / brand mark / media asset table. */
export function AssetTable({
  entries,
}: {
  entries: {
    name: string;
    kind: string;
    source: string;
    consumers: string;
    variants: string;
    dimensions: string;
    accessibility: string;
    owner: string;
    status: string;
    note?: string;
  }[];
}) {
  const tone = (status: string): "muted" | "primary" | "sage" | "warning" =>
    status === "in-use" ? "sage" : status === "runtime-managed" ? "primary" : "warning";
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] text-sm">
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">
                Asset
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Source &amp; consumers
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Variants &amp; size
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Accessibility
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Owner
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.name} className="border-b border-hairline/60 align-top last:border-0">
                <td className="px-5 py-4">
                  <span className="font-medium">{e.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{e.kind}</span>
                  <span className="mt-2 block">
                    <MetaChip tone={tone(e.status)}>{e.status}</MetaChip>
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <span className="text-serial">{e.source}</span>
                  <span className="mt-1 block">{e.consumers}</span>
                  {e.note && <span className="mt-1 block text-xs text-warning">{e.note}</span>}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {e.variants}
                  <span className="mt-1 block text-xs">{e.dimensions}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{e.accessibility}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------
 * Phase 5 — component inventory display helpers.
 * Documentation-only rendering. No production component is affected.
 * ----------------------------------------------------------------- */

const COMPONENT_STATUS_LABEL: Record<string, string> = {
  "in-use": "In use",
  "internal-only": "Internal",
  "installed-unused": "Installed, unused",
  "possibly-unused": "Possibly unused",
  "reference-only": "Reference only",
};

/** Full component inventory table: identity, classification, consumers, maturity. */
export function ComponentTable({
  entries,
}: {
  entries: {
    name: string;
    source: string;
    category: string;
    kind: string;
    layer: string;
    scope: string;
    consumers: string;
    consumerDetail: string;
    experience: string;
    dependencies: string;
    children: string;
    maturity: string;
    status: string;
    note?: string;
  }[];
}) {
  const tone = (status: string): "sage" | "muted" | "warning" =>
    status === "in-use" ? "sage" : status === "internal-only" ? "muted" : "warning";
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">
                Component
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Classification
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Consumers
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Composition
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Maturity
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.name} className="border-b border-hairline/60 align-top last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{e.name}</p>
                  <p className="text-serial mt-1">{e.source}</p>
                  <span className="mt-2 flex flex-wrap gap-1">
                    <MetaChip tone={tone(e.status)}>
                      {COMPONENT_STATUS_LABEL[e.status] ?? e.status}
                    </MetaChip>
                    {e.layer === "reference" && <MetaChip tone="primary">Reference</MetaChip>}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <span className="block text-foreground">{e.category}</span>
                  {e.kind}
                  <span className="mt-1 block text-xs">{e.scope}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <span className="block font-medium tabular-nums text-foreground">
                    {e.consumers}
                  </span>
                  {e.consumerDetail}
                  <span className="mt-1 block text-xs">{e.experience}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <span className="block">{e.children}</span>
                  <span className="mt-1 block text-xs">Depends on: {e.dependencies}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {e.maturity}
                  {e.note && <span className="mt-1 block text-xs text-warning">{e.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Component anatomy: the parts that actually exist, in render order. */
export function AnatomyList({
  entries,
}: {
  entries: { component: string; source: string; parts: string[]; note?: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {entries.map((e) => (
        <div key={e.component} className="rounded-2xl border border-hairline bg-card p-5">
          <p className="text-sm font-semibold">{e.component}</p>
          <p className="text-serial mt-1">{e.source}</p>
          <ol className="mt-3 space-y-1.5">
            {e.parts.map((p, i) => (
              <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                <span className="tabular-nums text-xs text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
          {e.note && <p className="mt-3 text-xs text-warning">{e.note}</p>}
        </div>
      ))}
    </div>
  );
}

/** Variant / size property inventory with measured usage. */
export function VariantTable({
  entries,
}: {
  entries: {
    component: string;
    property: string;
    values: string;
    used: string;
    unused: string;
    consumers: string;
    source: string;
    note?: string;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">
                Component &amp; property
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Allowed values
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Measured use
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Unused
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr
                key={`${e.component}-${e.property}`}
                className="border-b border-hairline/60 align-top last:border-0"
              >
                <td className="px-5 py-4">
                  <p className="font-medium">{e.component}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{e.property}</p>
                  <p className="text-serial mt-1">{e.source}</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{e.values}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  <span className="block">{e.used}</span>
                  <span className="mt-1 block text-xs">{e.consumers}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {e.unused}
                  {e.note && <span className="mt-1 block text-xs text-warning">{e.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Per-component state inventory. */
export function ComponentStateTable({
  entries,
}: {
  entries: {
    component: string;
    states: string;
    expression: string;
    changesContent: string;
    changesIcon: string;
    accessibility: string;
    source: string;
    note?: string;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">
                Component
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                States today
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                How it is expressed
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Content / icon change
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                Accessibility
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.component} className="border-b border-hairline/60 align-top last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium">{e.component}</p>
                  <p className="text-serial mt-1">{e.source}</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{e.states}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {e.expression}
                  {e.note && <span className="mt-1 block text-xs text-warning">{e.note}</span>}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <span className="block">Content: {e.changesContent}</span>
                  <span className="mt-1 block text-xs">Icon: {e.changesIcon}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{e.accessibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------
 * Phase 6 — architecture blueprint display helpers.
 *
 * Documentation-only rendering. Every helper below is consumed by
 * /design-system and /design-guide and by nothing else. No production
 * component is affected by anything in this section.
 * ----------------------------------------------------------------- */

/** Chip for the controlled Phase 6 label vocabulary. */
export function ArchLabelChip({ label }: { label: string }) {
  const tone: "sage" | "muted" | "warning" | "primary" = label.startsWith("CURRENT")
    ? "sage"
    : label.startsWith("GOVERNANCE")
      ? "primary"
      : label.startsWith("OBSERVED") ||
          label.startsWith("INSTALLED") ||
          label.startsWith("POSSIBLY") ||
          label.startsWith("UNOWNED")
        ? "muted"
        : "warning";
  return <MetaChip tone={tone}>{label}</MetaChip>;
}

/** Architecture layers: responsibility, what belongs, dependency direction. */
export function ArchLayerList({
  entries,
}: {
  entries: {
    id: string;
    layer: string;
    responsibility: string;
    belongs: string;
    excludes: string;
    source: string;
    dependsOn: string;
    consumedBy: string;
    phase: string;
    label: string;
    note?: string;
  }[];
}) {
  return (
    <div className="space-y-4">
      {entries.map((e) => (
        <div key={e.id} className="rounded-2xl border border-hairline bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{e.layer}</p>
            <ArchLabelChip label={e.label} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{e.responsibility}</p>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <dt className="text-serial">Belongs here</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{e.belongs}</dd>
            </div>
            <div>
              <dt className="text-serial">Does not belong</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{e.excludes}</dd>
            </div>
            <div>
              <dt className="text-serial">Depends on</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{e.dependsOn}</dd>
            </div>
            <div>
              <dt className="text-serial">Consumed by</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{e.consumedBy}</dd>
            </div>
          </dl>
          <p className="text-serial mt-4">
            {e.source} · {e.phase}
          </p>
          {e.note && <p className="mt-2 text-xs text-warning">{e.note}</p>}
        </div>
      ))}
    </div>
  );
}

/** Future canonical component map. Current evidence and proposal stay apart. */
export function CanonicalMapTable({
  entries,
}: {
  entries: {
    canonical: string;
    currentName: string;
    currentSource: string;
    taxonomy: string;
    tier: string;
    classification: string;
    consumers: string;
    usage: string;
    variants: string;
    sizes: string;
    states: string;
    anatomy: string;
    responsive: string;
    dependencies: string;
    relationships: string;
    related: string;
    duplication: string;
    accessibility: string;
    typography: string;
    spacing: string;
    iconography: string;
    tokens: string;
    normalization: string;
    migration: string;
    figma: string;
    label: string;
  }[];
}) {
  return (
    <div className="space-y-4">
      {entries.map((e) => (
        <div key={e.canonical} className="rounded-2xl border border-hairline bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <MetaChip tone="warning">Future canonical target</MetaChip>
            <p className="text-sm font-semibold">{e.canonical}</p>
          </div>
          <div className="mt-3 rounded-xl border border-sage/30 bg-sage-soft/40 p-4">
            <MetaChip tone="sage">Current implementation</MetaChip>
            <p className="mt-2 text-sm font-medium">{e.currentName}</p>
            <p className="text-serial mt-1">{e.currentSource}</p>
            <dl className="mt-3 grid gap-3 md:grid-cols-2">
              {[
                ["Taxonomy", `${e.taxonomy} · ${e.tier} · ${e.classification}`],
                ["Consumers", `${e.consumers} — ${e.usage}`],
                ["Variants", e.variants],
                ["Sizes", e.sizes],
                ["States", e.states],
                ["Anatomy", e.anatomy],
                ["Responsive", e.responsive],
                ["Dependencies", e.dependencies],
                ["Relationships", e.relationships],
                ["Related", e.related],
                ["Accessibility", e.accessibility],
                ["Typography", e.typography],
                ["Spacing", e.spacing],
                ["Iconography", e.iconography],
                ["Tokens", e.tokens],
                ["Duplication", e.duplication],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-serial">{term}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-3 rounded-xl border border-warning/40 bg-warning/5 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <ArchLabelChip label={e.label} />
            </div>
            <dl className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <dt className="text-serial">Normalization</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{e.normalization}</dd>
              </div>
              <div>
                <dt className="text-serial">Migration notes</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{e.migration}</dd>
              </div>
              <div>
                <dt className="text-serial">Figma mapping</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{e.figma}</dd>
              </div>
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Observable criteria for the component-vs-pattern framework. */
export function CriteriaTable({
  entries,
}: {
  entries: {
    criterion: string;
    question: string;
    test: string;
    indicates: string;
    example: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="960px"
      head={["Criterion", "Observable test", "Indicates", "Production example"]}
    >
      {entries.map((e) => (
        <tr key={e.criterion} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{e.criterion}</p>
            <p className="mt-1 text-xs text-muted-foreground">{e.question}</p>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{e.test}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.indicates}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.example}</td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Blueprint table: current evidence in one column, the proposal in the next. */
export function BlueprintTable({
  rows,
}: {
  rows: {
    item: string;
    source: string;
    current: string;
    future: string;
    label: string;
    phase: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="1000px"
      head={["Item", "Current implementation", "Future canonical target", "Label & evidence"]}
    >
      {rows.map((r) => (
        <tr key={r.item} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{r.item}</p>
            <p className="text-serial mt-1">{r.source}</p>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{r.current}</td>
          <td className="px-5 py-4 text-muted-foreground">
            {r.future}
            {r.note && <span className="mt-1 block text-xs text-warning">{r.note}</span>}
          </td>
          <td className="px-5 py-4">
            <ArchLabelChip label={r.label} />
            <p className="text-serial mt-2">{r.phase}</p>
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Architecture relationship edges, current and proposed. */
export function ArchRelationshipTable({
  entries,
}: {
  entries: {
    from: string;
    relation: string;
    to: string;
    nature: string;
    evidence: string;
    label: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable minWidth="900px" head={["From", "Relationship", "To", "Nature & evidence"]}>
      {entries.map((e) => (
        <tr key={`${e.from}-${e.relation}-${e.to}`} className={ROW}>
          <td className="px-5 py-4 font-medium">{e.from}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.relation}</td>
          <td className="px-5 py-4 text-muted-foreground">
            {e.to}
            {e.note && <span className="mt-1 block text-xs text-warning">{e.note}</span>}
          </td>
          <td className="px-5 py-4">
            <MetaChip tone={e.nature === "current" ? "sage" : "warning"}>
              {e.nature === "current" ? "Exists today" : "Proposed"}
            </MetaChip>
            <p className="text-serial mt-2">{e.evidence}</p>
            <div className="mt-2">
              <ArchLabelChip label={e.label} />
            </div>
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Duplicate / overlap areas. No winner is shown, because none is chosen. */
export function OverlapList({
  entries,
}: {
  entries: {
    area: string;
    implementations: string;
    evidence: string;
    consumers: string;
    differences: string;
    risks: string;
    decision: string;
    sequence: string;
    label: string;
  }[];
}) {
  return (
    <div className="space-y-4">
      {entries.map((e) => (
        <div key={e.area} className="rounded-2xl border border-hairline bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{e.area}</p>
            <ArchLabelChip label={e.label} />
          </div>
          <dl className="mt-3 grid gap-3 md:grid-cols-2">
            {[
              ["Implementations involved", e.implementations],
              ["Consumers", e.consumers],
              ["Differences", e.differences],
              ["Risks of consolidation", e.risks],
              ["Decision required", e.decision],
              ["Proposed sequence", e.sequence],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-serial">{term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
          <p className="text-serial mt-4">{e.evidence}</p>
        </div>
      ))}
    </div>
  );
}

/** Route-local kit architecture. */
export function KitTable({
  entries,
}: {
  entries: {
    kit: string;
    source: string;
    purpose: string;
    consumers: string;
    reusableScope: string;
    experienceScope: string;
    dependencies: string;
    overlap: string;
    classification: string;
    migration: string;
    label: string;
  }[];
}) {
  return (
    <div className="space-y-4">
      {entries.map((e) => (
        <div key={e.kit} className="rounded-2xl border border-hairline bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{e.kit}</p>
            <ArchLabelChip label={e.label} />
          </div>
          <p className="text-serial mt-1">{e.source}</p>
          <p className="mt-2 text-sm text-muted-foreground">{e.purpose}</p>
          <dl className="mt-3 grid gap-3 md:grid-cols-2">
            {[
              ["Consumers", e.consumers],
              ["Reusable scope", e.reusableScope],
              ["Experience scope", e.experienceScope],
              ["Dependencies", e.dependencies],
              ["Classification", e.classification],
              ["Overlap with Core", e.overlap],
              ["Future migration considerations", e.migration],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-serial">{term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/** Shell family architecture. */
export function ShellTable({
  entries,
}: {
  entries: {
    shell: string;
    source: string;
    purpose: string;
    responsibility: string;
    routes: string;
    dependencies: string;
    navigation: string;
    responsive: string;
    branding: string;
    coreRelationship: string;
    figma: string;
    label: string;
  }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {entries.map((e) => (
        <div key={e.shell} className="rounded-2xl border border-hairline bg-card p-5">
          <p className="text-sm font-semibold">{e.shell}</p>
          <p className="text-serial mt-1">{e.source}</p>
          <p className="mt-2 text-sm text-muted-foreground">{e.purpose}</p>
          <dl className="mt-3 space-y-3">
            {[
              ["Route coverage", e.routes],
              ["Structural responsibility", e.responsibility],
              ["Navigation", e.navigation],
              ["Responsive", e.responsive],
              ["Branding", e.branding],
              ["Shared dependencies", e.dependencies],
              ["Relationship to Core", e.coreRelationship],
              ["Future Figma representation", e.figma],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-serial">{term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <ArchLabelChip label={e.label} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Naming conventions, with codebase and Figma compatibility stated. */
export function NamingTable({
  entries,
}: {
  entries: {
    subject: string;
    convention: string;
    example: string;
    codebaseFit: string;
    figmaFit: string;
    label: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="1000px"
      head={["Subject", "Convention", "Fit with current codebase", "Fit with Figma"]}
    >
      {entries.map((e) => (
        <tr key={e.subject} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{e.subject}</p>
            <div className="mt-2">
              <ArchLabelChip label={e.label} />
            </div>
          </td>
          <td className="px-5 py-4 text-muted-foreground">
            {e.convention}
            <span className="text-serial mt-2 block">{e.example}</span>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{e.codebaseFit}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.figmaFit}</td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Figma library sections: purpose, what belongs, what does not. */
export function FigmaSectionTable({
  entries,
}: {
  entries: {
    section: string;
    purpose: string;
    belongs: string;
    excludes: string;
    source: string;
    mapping: string;
    governanceOwner: string;
    migration: string;
    label: string;
  }[];
}) {
  return (
    <div className="space-y-4">
      {entries.map((e) => (
        <div key={e.section} className="rounded-2xl border border-warning/40 bg-warning/5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{e.section}</p>
            <ArchLabelChip label={e.label} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{e.purpose}</p>
          <dl className="mt-3 grid gap-3 md:grid-cols-2">
            {[
              ["What belongs", e.belongs],
              ["What does not belong", e.excludes],
              ["Source in codebase", e.source],
              ["Mapping", e.mapping],
              ["Governance owner", e.governanceOwner],
              ["Migration notes", e.migration],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-serial">{term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/** Token / style to Figma variable mapping, including stated limitations. */
export function FigmaVariableTable({
  entries,
}: {
  entries: {
    source: string;
    figma: string;
    kind: string;
    mapping: string;
    limitation: string;
    label: string;
  }[];
}) {
  return (
    <RefTable minWidth="960px" head={["Source in code", "Figma target", "Mapping", "Limitation"]}>
      {entries.map((e) => (
        <tr key={e.source} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{e.source}</p>
            <div className="mt-2">
              <ArchLabelChip label={e.label} />
            </div>
          </td>
          <td className="px-5 py-4 text-muted-foreground">
            {e.figma}
            <span className="text-serial mt-1 block">{e.kind}</span>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{e.mapping}</td>
          <td className="px-5 py-4 text-muted-foreground">{e.limitation}</td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Migration roadmap phases. Sequence only — nothing is executed. */
export function MigrationList({
  entries,
}: {
  entries: {
    phase: string;
    title: string;
    goal: string;
    prerequisites: string;
    affected: string;
    risk: string;
    validation: string;
    rollback: string;
    visualDiff: string;
    label: string;
  }[];
}) {
  return (
    <div className="space-y-4">
      {entries.map((e) => (
        <div key={e.phase} className="rounded-2xl border border-hairline bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <MetaChip tone="muted">{e.phase}</MetaChip>
            <p className="text-sm font-semibold">{e.title}</p>
            <MetaChip tone={e.risk === "low" ? "sage" : e.risk === "medium" ? "muted" : "warning"}>
              {e.risk} risk
            </MetaChip>
            <ArchLabelChip label={e.label} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{e.goal}</p>
          <dl className="mt-3 grid gap-3 md:grid-cols-2">
            {[
              ["Prerequisites", e.prerequisites],
              ["Affected areas", e.affected],
              ["Validation requirements", e.validation],
              ["Rollback expectations", e.rollback],
              ["Visual diffing", e.visualDiff],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-serial">{term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/** Experience architecture: one system, applied differently. */
export function ExperienceArchTable({
  entries,
}: {
  entries: {
    experience: string;
    routes: string;
    hierarchy: string;
    density: string;
    components: string;
    patterns: string;
    typography: string;
    brand: string;
    rule: string;
    label: string;
  }[];
}) {
  return (
    <div className="space-y-4">
      {entries.map((e) => (
        <div key={e.experience} className="rounded-2xl border border-hairline bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{e.experience}</p>
            <ArchLabelChip label={e.label} />
          </div>
          <p className="text-serial mt-1">{e.routes}</p>
          <dl className="mt-3 grid gap-3 md:grid-cols-2">
            {[
              ["Hierarchy", e.hierarchy],
              ["Density", e.density],
              ["Components used", e.components],
              ["Patterns", e.patterns],
              ["Typography", e.typography],
              ["Brand expression", e.brand],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-serial">{term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-xl border border-primary/30 bg-primary-soft/40 p-4 text-sm">
            {e.rule}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phase 7 — foundation specification display                          */
/* ------------------------------------------------------------------ */

/** One foundation token: copied value, purpose, usage, future role, Figma. */
export function TokenSpecTable({
  tokens,
}: {
  tokens: {
    token: string;
    value: string;
    darkValue?: string;
    modes: string;
    purpose: string;
    consumers: string;
    usage: string;
    foreground?: string;
    contrast?: string;
    source: string;
    status: string;
    futureRole: string;
    figma: string;
    migration: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="1180px"
      head={["Token", "Value", "Purpose & consumers", "Usage", "Future role", "Figma & migration"]}
    >
      {tokens.map((t) => (
        <tr key={t.token} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{t.token}</p>
            <p className="text-serial mt-1">{t.source}</p>
            <div className="mt-2">
              <ArchLabelChip label={t.status} />
            </div>
          </td>
          <td className="px-5 py-4">
            <p className="text-serial">{t.value}</p>
            {t.darkValue && <p className="text-serial mt-1">dark: {t.darkValue}</p>}
            <p className="text-serial mt-1 text-muted-foreground">{t.modes}</p>
            {t.foreground && (
              <p className="text-serial mt-1">on: {t.foreground}</p>
            )}
          </td>
          <td className="px-5 py-4 text-muted-foreground">
            {t.purpose}
            <span className="text-serial mt-1 block">{t.consumers}</span>
            {t.contrast && (
              <span className="mt-1 block text-xs text-warning">{t.contrast}</span>
            )}
          </td>
          <td className="px-5 py-4 text-serial">{t.usage}</td>
          <td className="px-5 py-4 text-muted-foreground">
            {t.futureRole}
            {t.note && <span className="mt-1 block text-xs text-warning">{t.note}</span>}
          </td>
          <td className="px-5 py-4 text-muted-foreground">
            {t.figma}
            <span className="text-serial mt-1 block">{t.migration}</span>
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** primitive → semantic → component role → experience. */
export function RoleChainTable({
  entries,
}: {
  entries: {
    primitive: string;
    semantic: string;
    componentRole: string;
    experience: string;
    evidence: string;
    label: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="1000px"
      head={["Primitive", "Semantic role", "Component role", "Experience", "Evidence"]}
    >
      {entries.map((e) => (
        <tr key={`${e.primitive}-${e.semantic}`} className={ROW}>
          <td className="px-5 py-4 text-serial">{e.primitive}</td>
          <td className="px-5 py-4 font-medium">{e.semantic}</td>
          <td className="px-5 py-4 text-muted-foreground">
            {e.componentRole}
            {e.note && <span className="mt-1 block text-xs text-warning">{e.note}</span>}
          </td>
          <td className="px-5 py-4 text-muted-foreground">{e.experience}</td>
          <td className="px-5 py-4">
            <p className="text-serial">{e.evidence}</p>
            <div className="mt-2">
              <ArchLabelChip label={e.label} />
            </div>
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Which foundation role each component slot would consume. */
export function ComponentRoleList({
  specs,
}: {
  specs: {
    component: string;
    source: string;
    roles: { slot: string; foundation: string; current: string }[];
    label: string;
    note?: string;
  }[];
}) {
  return (
    <div className="space-y-4">
      {specs.map((s) => (
        <div key={s.component} className="rounded-2xl border border-hairline bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{s.component}</p>
            <ArchLabelChip label={s.label} />
          </div>
          <p className="text-serial mt-1">{s.source}</p>
          <dl className="mt-4 grid gap-2 sm:grid-cols-2">
            {s.roles.map((r) => (
              <div key={r.slot} className="rounded-xl border border-hairline p-3">
                <dt className="text-eyebrow">{r.slot}</dt>
                <dd className="mt-1 text-sm font-medium">{r.foundation}</dd>
                <dd className="text-serial mt-1">today: {r.current}</dd>
              </div>
            ))}
          </dl>
          {s.note && <p className="mt-3 text-xs text-warning">{s.note}</p>}
        </div>
      ))}
    </div>
  );
}

/** Foundation-level accessibility records. */
export function FoundationA11yTable({
  records,
}: {
  records: {
    topic: string;
    current: string;
    requirement: string;
    consumers: string;
    status: string;
    note?: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="980px"
      head={["Topic", "Current implementation", "Future requirement", "Consumers & status"]}
    >
      {records.map((r) => (
        <tr key={r.topic} className={ROW}>
          <td className="px-5 py-4 font-medium">{r.topic}</td>
          <td className="px-5 py-4 text-muted-foreground">{r.current}</td>
          <td className="px-5 py-4 text-muted-foreground">
            {r.requirement}
            {r.note && <span className="mt-1 block text-xs text-warning">{r.note}</span>}
          </td>
          <td className="px-5 py-4">
            <p className="text-serial">{r.consumers}</p>
            <div className="mt-2">
              <ArchLabelChip label={r.status} />
            </div>
          </td>
        </tr>
      ))}
    </RefTable>
  );
}

/** Descriptive foundation maturity. No scores. */
export function FoundationMaturityTable({
  records,
}: {
  records: {
    category: string;
    implementation: string;
    evidence: string;
    centralization: string;
    variation: string;
    ownership: string;
    futureTarget: string;
    readiness: string;
    openDecision: string;
  }[];
}) {
  return (
    <RefTable
      minWidth="1120px"
      head={["Category", "Current implementation", "Centralisation", "Observed variation", "Future target", "Open decision"]}
    >
      {records.map((r) => (
        <tr key={r.category} className={ROW}>
          <td className="px-5 py-4">
            <p className="font-medium">{r.category}</p>
            <p className="text-serial mt-1">{r.ownership}</p>
          </td>
          <td className="px-5 py-4 text-muted-foreground">
            {r.implementation}
            <span className="text-serial mt-1 block">{r.evidence}</span>
          </td>
          <td className="px-5 py-4">
            <MetaChip tone={r.centralization === "CENTRALIZED" ? "sage" : "warning"}>
              {r.centralization}
            </MetaChip>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{r.variation}</td>
          <td className="px-5 py-4 text-muted-foreground">
            {r.futureTarget}
            <span className="text-serial mt-1 block">{r.readiness}</span>
          </td>
          <td className="px-5 py-4 text-muted-foreground">{r.openDecision}</td>
        </tr>
      ))}
    </RefTable>
  );
}
