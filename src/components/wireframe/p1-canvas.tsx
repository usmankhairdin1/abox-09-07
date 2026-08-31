import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { DispositionBanner } from "@/components/LucieDisposition";
import {
  Annotation,
  IdChip,
  PageHeading,
  Pill,
  WBox,
  WChart,
  WLine,
  WPanel,
  WRow,
} from "@/components/wireframe/primitives";
import { P1_BY_SLUG, P1_SLUGS, type P1Screen, type P1Zone } from "@/lib/p1";
import { dispositionForGroup } from "@/lib/reconciliation-status";
import { cn } from "@/lib/utils";

function ZoneShell({ zone, children }: { zone: P1Zone; children: ReactNode }) {
  return (
    <section
      className={cn(
        "rounded-lg border border-dashed border-hairline bg-muted/10 p-3",
        zone.wide && "lg:col-span-2",
      )}
    >
      <header className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold tracking-tight">{zone.title}</span>
        <IdChip>{zone.id}</IdChip>
      </header>
      {children}
      {zone.note ? <Annotation className="mt-2">{zone.note}</Annotation> : null}
    </section>
  );
}

/** Grey-box render of one zone. Structure only — no visual design, no real data. */
function Zone({ zone }: { zone: P1Zone }) {
  const items = zone.items ?? [];

  const body = (() => {
    switch (zone.kind) {
      case "fields":
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((i) => (
              <div key={i} className="space-y-1">
                <p className="text-[11px] text-muted-foreground">{i}</p>
                <WBox className="h-8" />
              </div>
            ))}
          </div>
        );
      case "kv":
        return (
          <dl className="grid gap-2 sm:grid-cols-2">
            {items.map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 border-b border-hairline pb-1.5"
              >
                <dt className="text-[11px] text-muted-foreground">{i}</dt>
                <dd>
                  <WLine w="70px" />
                </dd>
              </div>
            ))}
          </dl>
        );
      case "list":
        return (
          <ul className="space-y-1.5">
            {items.map((i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded border border-hairline bg-card px-2.5 py-2"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full bg-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-[11px] leading-snug text-foreground/80">{i}</span>
              </li>
            ))}
          </ul>
        );
      case "table":
        return (
          <div className="overflow-hidden rounded border border-hairline">
            <div className="flex gap-2 border-b border-hairline bg-muted/40 px-2.5 py-2">
              {items.map((h) => (
                <span
                  key={h}
                  className="flex-1 truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </span>
              ))}
            </div>
            {[0, 1, 2, 3].map((r) => (
              <div
                key={r}
                className="flex gap-2 border-b border-hairline px-2.5 py-2 last:border-b-0"
              >
                {items.map((h) => (
                  <span key={h} className="flex-1">
                    <WLine w={r % 2 === 0 ? "80%" : "62%"} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        );
      case "tabs":
        return (
          <div className="flex flex-wrap gap-1.5 border-b border-hairline pb-2">
            {items.map((i, n) => (
              <span
                key={i}
                className={cn(
                  "rounded-t border border-hairline px-2.5 py-1 text-[11px]",
                  n === 0 ? "bg-card font-medium" : "bg-muted/40 text-muted-foreground",
                )}
              >
                {i}
              </span>
            ))}
          </div>
        );
      case "cards":
        return (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((i) => (
              <div key={i} className="rounded border border-hairline bg-card p-2.5">
                <p className="text-[11px] font-medium leading-snug">{i}</p>
                <WLine w="60%" className="mt-2" />
                <WLine w="40%" className="mt-1.5" />
              </div>
            ))}
          </div>
        );
      case "actions":
        return (
          <div className="flex flex-wrap gap-1.5">
            {items.map((i) => (
              <Pill key={i}>{i}</Pill>
            ))}
          </div>
        );
      case "checks":
        return (
          <ul className="space-y-1.5">
            {items.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="mt-0.5 size-3.5 shrink-0 rounded-sm border border-muted-foreground/60"
                  aria-hidden="true"
                />
                <span className="text-[11px] leading-snug text-foreground/80">{i}</span>
              </li>
            ))}
          </ul>
        );
      case "tree":
        return (
          <ul className="space-y-1.5">
            {items.map((i, n) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded border border-hairline bg-card px-2.5 py-1.5"
                style={{ marginLeft: `${Math.min(n, 3) * 14}px` }}
              >
                <span className="font-mono text-[10px] text-muted-foreground">└</span>
                <span className="text-[11px] text-foreground/80">{i}</span>
              </li>
            ))}
          </ul>
        );
      case "timeline":
        return (
          <ol className="space-y-2 border-l border-hairline pl-3">
            {items.map((i) => (
              <li key={i} className="relative text-[11px] leading-snug text-foreground/80">
                <span
                  className="absolute -left-[17px] top-1 size-2 rounded-full border border-hairline bg-card"
                  aria-hidden="true"
                />
                {i}
              </li>
            ))}
          </ol>
        );
      case "editor":
        return (
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i} className="rounded border border-hairline bg-card p-2">
                <p className="mb-1.5 text-[11px] text-muted-foreground">{i}</p>
                <WLine w="94%" />
                <WLine w="86%" className="mt-1.5" />
                <WLine w="52%" className="mt-1.5" />
              </div>
            ))}
          </div>
        );
      case "box":
      default:
        return items.length ? (
          <div className="space-y-1.5">
            {items.map((i) => (
              <WRow key={i} primary={i} />
            ))}
          </div>
        ) : (
          <WBox className="h-20" />
        );
    }
  })();

  return <ZoneShell zone={zone}>{body}</ZoneShell>;
}

export function P1Canvas({ screen }: { screen: P1Screen }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {screen.canvas.map((z) => (
        <Zone key={z.id} zone={z} />
      ))}
    </div>
  );
}

function Notes({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((i) => (
        <li key={i} className="flex gap-2 text-xs leading-relaxed text-foreground/80">
          <span
            className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground"
            aria-hidden="true"
          />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

/** Frame carrying every annotation field the request asks for, per screen. */
export function P1Frame({ screen }: { screen: P1Screen }) {
  const idx = P1_SLUGS.indexOf(screen.slug);
  const prev = idx > 0 ? P1_SLUGS[idx - 1] : undefined;
  const next = idx < P1_SLUGS.length - 1 ? P1_SLUGS[idx + 1] : undefined;

  return (
    <div className="space-y-4">
      <PageHeading
        eyebrow={`Broader Phase 1 · ${screen.group}`}
        title={screen.name}
        id={screen.id}
        description={screen.purpose}
        actions={
          <>
            <Pill>
              {screen.packet === "M2-Cand" ? "Module 2 candidate" : "Later Phase 1 packet"}
            </Pill>
            <Pill>
              {screen.shell === "consumer" ? "External branded chrome" : "Internal unified shell"}
            </Pill>
          </>
        }
      />

      <DispositionBanner info={dispositionForGroup(screen.group)} legacyId={screen.id} />

      <Annotation>
        Not a change to active Module 1. Module 1 remains exactly as specified in the V4 Hardening
        Package; this screen belongs to a later packet per the Reconciliation Package.
      </Annotation>

      <WPanel
        title="Wireframe canvas"
        id={screen.id}
        meta={`Primary user: ${screen.user} · structure only, no visual design`}
      >
        <P1Canvas screen={screen} />
      </WPanel>

      <div className="grid gap-3 lg:grid-cols-2">
        <WPanel title="Workspace & module" id={`${screen.id}-PLACE`}>
          <Notes
            items={[
              `Workspace: ${screen.workspace}`,
              `Module: ${screen.module}`,
              `Primary user: ${screen.user}`,
            ]}
          />
        </WPanel>
        <WPanel title="Primary actions" id={`${screen.id}-ACTIONS`}>
          <div className="flex flex-wrap gap-1.5">
            {screen.actions.map((a) => (
              <Pill key={a}>{a}</Pill>
            ))}
          </div>
        </WPanel>

        <WPanel title="Important objects shown" id={`${screen.id}-OBJECTS`}>
          <Notes items={screen.objects} />
        </WPanel>
        <WPanel title="Configuration points" id={`${screen.id}-CONFIG`}>
          <Notes items={screen.config} />
        </WPanel>

        <WPanel title="ACL notes" id={`${screen.id}-ACL`}>
          <Notes items={screen.acl} />
        </WPanel>
        <WPanel title="Right drawer content" id={`${screen.id}-DRAWER`}>
          <Notes items={screen.drawer} />
        </WPanel>

        <WPanel title="Bottom assistant behavior" id={`${screen.id}-ASSIST`}>
          <p className="text-xs leading-relaxed text-foreground/80">{screen.assistant}</p>
        </WPanel>
        <WPanel title="Assumptions" id={`${screen.id}-ASSUME`}>
          <Notes items={screen.assumptions} />
        </WPanel>

        <WPanel title="Source basis" id={`${screen.id}-SOURCE`} className="lg:col-span-2">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            {screen.source}
          </p>
          {screen.m1Seam ? (
            <Annotation className="mt-2">Module 1 seam — read only: {screen.m1Seam}</Annotation>
          ) : null}
        </WPanel>
      </div>

      <nav className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {prev ? (
            <Link
              to="/p1/$screen"
              params={{ screen: prev }}
              className="rounded-lg border border-hairline px-3 py-1.5 text-xs hover:bg-accent"
            >
              ← {P1_BY_SLUG[prev]?.id}
            </Link>
          ) : null}
          <Link
            to="/p1"
            className="rounded-lg border border-hairline px-3 py-1.5 text-xs hover:bg-accent"
          >
            Phase 1 index
          </Link>
          {next ? (
            <Link
              to="/p1/$screen"
              params={{ screen: next }}
              className="rounded-lg border border-hairline px-3 py-1.5 text-xs hover:bg-accent"
            >
              {P1_BY_SLUG[next]?.id} →
            </Link>
          ) : null}
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {screen.group}
        </span>
      </nav>
    </div>
  );
}

export { WChart };
