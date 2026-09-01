import { createFileRoute } from "@tanstack/react-router";

import { InternalShell } from "@/components/abox/internal-shell";
import { AgentWorkspace } from "@/components/m06/screens/roster";
import { useM06Call, useM06Context } from "@/lib/m06/use-m06";

const TITLE = "My profile & availability — ABox";
const DESC =
  "Your own workforce record: profile details, affiliation, availability and the readiness that governs what you can sell.";

export const Route = createFileRoute("/app/agent-profile")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { ctx, hydrated } = useM06Context();
  const call = useM06Call(ctx);
  return (
    <InternalShell workspace="agent" eyebrow="My record" pageTitle="My profile & availability">
      {hydrated ? (
        <AgentWorkspace call={call} ctx={ctx} />
      ) : (
        <div className="h-40 animate-pulse rounded-2xl border border-hairline bg-surface/50" />
      )}
    </InternalShell>
  );
}
