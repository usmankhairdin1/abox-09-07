import { Link, createFileRoute, useParams } from "@tanstack/react-router";

import { Annotation, IdChip, WPanel } from "@/components/wireframe/primitives";
import {
  MODULE_TITLE,
  moduleIndex,
  screensForWorkspace,
  type GovernedModuleKey,
} from "@/lib/governed";

export const Route = createFileRoute("/gov/$module/")({
  head: ({ params }) => {
    const title = `${params.module.toUpperCase()} governed estate — ABox Lucie`;
    const description =
      "Controlled workspaces, screens, flows and registers for the Lucie build packet, rendered as low-fidelity wireframes with stable IDs.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: GovOverview,
});

function GovOverview() {
  const { module } = useParams({ from: "/gov/$module" }) as { module: GovernedModuleKey };
  const idx = moduleIndex(module);
  const metrics = Object.entries(idx.meta.summary_metrics ?? {});

  return (
    <div className="space-y-4">
      <Annotation>
        {MODULE_TITLE[module]} rendered from the packet's machine-readable registers. Nothing here
        is invented: every workspace, screen, flow and count is the controlled record.
      </Annotation>

      <WPanel title="Fixed workspaces" id={`${module.toUpperCase()}-WORKSPACES`}>
        <div className="grid gap-3 md:grid-cols-2">
          {idx.workspaces.map((w) => {
            const screens = screensForWorkspace(module, w.workspace_id);
            return (
              <section key={w.workspace_id} className="rounded-lg border border-dashed border-hairline p-3">
                <header className="mb-1 flex flex-wrap items-center gap-2">
                  <IdChip>{w.workspace_id}</IdChip>
                  <span className="text-xs font-semibold">{w.name}</span>
                </header>
                <p className="text-[11px] text-muted-foreground">{w.purpose}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Actors: {w.actors.length ? w.actors.join(", ") : "recorded on each screen"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {screens.map((s) => (
                    <Link
                      key={s.id}
                      to="/gov/$module/screens/$screen"
                      params={{ module, screen: s.slug }}
                      className="rounded border border-hairline px-1.5 py-0.5 font-mono text-[10px] hover:bg-accent"
                    >
                      {s.id}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </WPanel>

      <WPanel title="Controlled counts" id={`${module.toUpperCase()}-METRICS`}>
        {metrics.length ? (
          <dl className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {metrics.map(([k, v]) => (
              <div key={k} className="rounded border border-dashed border-hairline p-2">
                <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {k.replace(/_/g, " ")}
                </dt>
                <dd className="font-mono text-sm">{String(v)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <Annotation>
            Summary metrics are not published in this packet's registry; see the register browser.
          </Annotation>
        )}
      </WPanel>

      <WPanel title="Governed flows" id={`${module.toUpperCase()}-FLOWS`}>
        {idx.flows.length ? (
          <ul className="grid gap-1.5 md:grid-cols-2">
            {idx.flows.map((f) => (
              <li key={f.id}>
                <Link
                  to="/gov/$module/flows/$flow"
                  params={{ module, flow: f.slug }}
                  className="flex items-center gap-2 rounded border border-hairline px-2 py-1.5 text-xs hover:bg-accent"
                >
                  <IdChip>{f.id}</IdChip>
                  <span className="truncate">{f.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Annotation>This packet does not publish a user-flow register.</Annotation>
        )}
      </WPanel>
    </div>
  );
}
