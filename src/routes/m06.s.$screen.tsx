import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHead } from "@/components/lucie/ui";
import { MetaRail } from "@/components/m06/kit";
import { findM06Screen, M06_WORKSPACE_NAMES } from "@/components/m06/registry";
import { useM06Call, useM06Context } from "@/lib/m06/use-m06";

export const Route = createFileRoute("/m06/s/$screen")({
  head: () => ({
    meta: [
      { title: "Agency and Network Workspace — ABox" },
      { name: "description", content: "Governed agency, agent and network management surface." },
      { property: "og:title", content: "Agency and Network Workspace — ABox" },
      { property: "og:description", content: "Governed agency, agent and network management surface." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: M06ScreenHost,
});

function M06ScreenHost() {
  const { screen } = Route.useParams();
  const { ctx, hydrated, email } = useM06Context();
  const call = useM06Call(ctx);
  const entry = findM06Screen(screen);

  if (!entry) {
    return (
      <div className="space-y-4">
        <PageHead eyebrow="Not found" title="No such screen" lede="This surface is not part of the approved screen register." />
        <Link to="/m06/screens" className="text-xs underline">
          Back to the screen directory
        </Link>
      </div>
    );
  }

  const { Component } = entry;

  return (
    <div className="space-y-5">
      <PageHead
        eyebrow={M06_WORKSPACE_NAMES[entry.workspace] ?? "Agency administration"}
        title={entry.name}
        lede={entry.purpose}
        right={
          <Link
            to="/m06/screens"
            className="rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] text-muted-foreground hover:bg-accent"
          >
            All screens
          </Link>
        }
      />
      <MetaRail
        meta={{
          id: entry.id,
          name: entry.name,
          workspace: M06_WORKSPACE_NAMES[entry.workspace] ?? entry.workspace,
          actor: email ?? "signed-out",
          permission: entry.permission,
          scope: hydrated ? `${ctx.organizationId.slice(0, 8)} in ${ctx.tenantId.slice(0, 8)}` : "resolving…",
        }}
      />
      {hydrated ? <Component call={call} ctx={ctx} /> : null}
    </div>
  );
}
