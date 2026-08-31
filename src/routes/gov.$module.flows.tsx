import { Link, Outlet, createFileRoute, useMatches, useParams } from "@tanstack/react-router";

import { Annotation, IdChip, WPanel } from "@/components/wireframe/primitives";
import { moduleIndex, type GovernedModuleKey } from "@/lib/governed";

export const Route = createFileRoute("/gov/$module/flows")({
  component: FlowsLayout,
});

function FlowsLayout() {
  const { module } = useParams({ from: "/gov/$module" }) as { module: GovernedModuleKey };
  const matches = useMatches();
  if (matches.some((m) => m.routeId === "/gov/$module/flows/$flow")) return <Outlet />;

  const idx = moduleIndex(module);

  return (
    <div className="space-y-4">
      <Annotation>
        {idx.flows.length} governed user flows. Each flow walks its controlled screen sequence in
        order; no ungoverned journey is introduced.
      </Annotation>
      <WPanel title="Flow register" id={`${module.toUpperCase()}-FLOW-REGISTER`}>
        <ul className="space-y-1.5">
          {idx.flows.map((f) => (
            <li key={f.id}>
              <Link
                to="/gov/$module/flows/$flow"
                params={{ module, flow: f.slug }}
                className="block rounded border border-border p-2 hover:bg-muted"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <IdChip>{f.id}</IdChip>
                  <span className="text-xs font-medium">{f.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {f.screens.length} steps
                  </span>
                </span>
                <span className="mt-1 block text-[11px] text-muted-foreground">{f.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </WPanel>
    </div>
  );
}
