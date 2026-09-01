import { createFileRoute, Link } from "@tanstack/react-router";

import { Id, PageHead, Section, Tag } from "@/components/lucie/ui";
import { M06_SCREENS, M06_WORKSPACE_NAMES } from "@/components/m06/registry";

export const Route = createFileRoute("/m06/screens")({
  head: () => ({
    meta: [
      { title: "Agency and Network Screens — ABox" },
      { name: "description", content: "Every governed agency, agent and network management screen in one place." },
      { property: "og:title", content: "Agency and Network Screens — ABox" },
      { property: "og:description", content: "Every governed agency, agent and network management screen in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: M06ScreenDirectory,
});

function M06ScreenDirectory() {
  const groups = Object.entries(
    M06_SCREENS.reduce<Record<string, typeof M06_SCREENS>>((acc, s) => {
      (acc[s.workspace] ??= []).push(s);
      return acc;
    }, {}),
  );

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="Agency, agent and network management"
        title="Screen directory"
        lede="Each surface below reads and writes through the governed API, which checks the actor, the tenant and organization scope, and the permission before anything happens."
      />
      {groups.map(([ws, screens]) => (
        <Section key={ws} title={M06_WORKSPACE_NAMES[ws] ?? ws} meta={`${screens.length} screens`}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {screens.map((s) => (
              <li key={s.id}>
                <Link
                  to="/m06/s/$screen"
                  params={{ screen: s.key }}
                  className="block rounded-xl border border-hairline bg-surface/40 px-4 py-3 transition-colors hover:bg-accent"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <Id>{s.id}</Id>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.purpose}</p>
                  <Tag tone="info">{s.permission}</Tag>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </div>
  );
}
