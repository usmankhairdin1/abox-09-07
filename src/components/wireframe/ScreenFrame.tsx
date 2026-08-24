import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import {
  Annotation,
  IdChip,
  PageHeading,
  Pill,
  WPanel,
} from "@/components/wireframe/primitives";
import { M1_BY_SLUG, type M1Screen } from "@/lib/m1";

/** Bullet list used by the annotation rail. */
function Notes({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((i) => (
        <li key={i} className="flex gap-2 text-xs leading-relaxed text-foreground/80">
          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Standard Module 1 wireframe frame: heading, grey-box canvas, then the
 * annotation rail carrying purpose, components, actions, drawer, assistant,
 * compliance, source and scope for the screen.
 */
export function ScreenFrame({ screen, children }: { screen: M1Screen; children: ReactNode }) {
  const idx = Object.keys(M1_BY_SLUG).indexOf(screen.slug);
  const slugs = Object.keys(M1_BY_SLUG);
  const prev = idx > 0 ? slugs[idx - 1] : undefined;
  const next = idx < slugs.length - 1 ? slugs[idx + 1] : undefined;

  return (
    <div className="space-y-4">
      <PageHeading
        eyebrow={`Module 1 · ${screen.group}`}
        title={screen.name}
        id={screen.id}
        description={screen.purpose}
        actions={
          <>
            <Pill>{screen.scope}</Pill>
            <Pill>{screen.shell === "consumer" ? "External branded chrome" : "Internal unified shell"}</Pill>
          </>
        }
      />

      <WPanel
        title="Wireframe canvas"
        id={screen.id}
        meta={`Primary user: ${screen.user} · structure only, no visual design`}
      >
        {children}
      </WPanel>

      <div className="grid gap-3 lg:grid-cols-2">
        <WPanel title="Key components" id={`${screen.id}-COMPONENTS`}>
          <Notes items={screen.components} />
        </WPanel>
        <WPanel title="Primary actions" id={`${screen.id}-ACTIONS`}>
          <div className="flex flex-wrap gap-1.5">
            {screen.actions.map((a) => (
              <Pill key={a}>{a}</Pill>
            ))}
          </div>
        </WPanel>

        <WPanel
          title="Right drawer content"
          id={`${screen.id}-DRAWER`}
          meta={screen.drawer ? "Internal shell drawer (IA alignment)" : "Not applicable"}
        >
          {screen.drawer ? (
            <Notes items={screen.drawer} />
          ) : (
            <Annotation>
              No right drawer. Consumer and member surfaces are externally branded and simplified —
              the internal context drawer is an internal-shell pattern only. Contextual help is
              delivered by the bottom-right help bubble instead.
            </Annotation>
          )}
        </WPanel>

        <WPanel title="Bottom assistant / help behavior" id={`${screen.id}-ASSIST`}>
          <p className="text-xs leading-relaxed text-foreground/80">{screen.assistant}</p>
        </WPanel>

        <WPanel
          title="Compliance & audit notes"
          id={`${screen.id}-COMPLIANCE`}
          className="lg:col-span-2"
        >
          <Notes items={screen.compliance} />
        </WPanel>

        <WPanel title="Supporting source" id={`${screen.id}-SOURCE`} className="lg:col-span-2">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            {screen.source}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <IdChip>{screen.scope}</IdChip>
            <Annotation>
              Scope fence: ABox_Module1_Reconciliation_Package_v1.0. Nothing on this screen adds a
              broader Phase 1 capability.
            </Annotation>
          </div>
        </WPanel>
      </div>

      <nav className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {prev ? (
            <Link
              to="/m1/$screen"
              params={{ screen: prev }}
              className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
            >
              ← {M1_BY_SLUG[prev]?.id}
            </Link>
          ) : null}
          <Link to="/m1" className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted">
            Module 1 index
          </Link>
          {next ? (
            <Link
              to="/m1/$screen"
              params={{ screen: next }}
              className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
            >
              {M1_BY_SLUG[next]?.id} →
            </Link>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            V4 click path
          </span>
          {screen.next.map((n) => (
            <Link
              key={n}
              to="/m1/$screen"
              params={{ screen: n }}
              className="rounded-md border border-dashed border-border px-2.5 py-1 text-xs hover:bg-muted"
            >
              {M1_BY_SLUG[n]?.id ?? n}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
