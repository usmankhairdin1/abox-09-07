import { Link, Outlet, createFileRoute, useMatches, useParams } from "@tanstack/react-router";

import { Annotation, IdChip, WPanel } from "@/components/wireframe/primitives";
import { moduleIndex, screensForWorkspace, type GovernedModuleKey } from "@/lib/governed";

export const Route = createFileRoute("/gov/$module/screens")({
  component: ScreensLayout,
});

function ScreensLayout() {
  const { module } = useParams({ from: "/gov/$module" }) as { module: GovernedModuleKey };
  const matches = useMatches();
  const onDetail = matches.some((m) => m.routeId === "/gov/$module/screens/$screen");
  if (onDetail) return <Outlet />;

  const idx = moduleIndex(module);

  return (
    <div className="space-y-4">
      <Annotation>
        {idx.screens.length} controlled screens and shared components. Each opens as a low-fidelity
        governed frame carrying its SCR, workspace, REQ, states, localization and accessibility
        record.
      </Annotation>

      {idx.workspaces.map((w) => {
        const screens = screensForWorkspace(module, w.workspace_id);
        if (!screens.length) return null;
        return (
          <WPanel key={w.workspace_id} title={`${w.name} (${screens.length})`} id={w.workspace_id}>
            <ul className="grid gap-1.5 lg:grid-cols-2">
              {screens.map((s) => (
                <li key={s.id}>
                  <Link
                    to="/gov/$module/screens/$screen"
                    params={{ module, screen: s.slug }}
                    className="block rounded border border-hairline p-2 hover:bg-accent"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <IdChip>{s.id}</IdChip>
                      <span className="text-xs font-medium">{s.name}</span>
                    </span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">{s.purpose}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </WPanel>
        );
      })}
    </div>
  );
}
