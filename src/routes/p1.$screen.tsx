import { createFileRoute, notFound } from "@tanstack/react-router";

import { AppShell } from "@/components/shell/AppShell";
import { ConsumerShell } from "@/components/shell/ConsumerShell";
import { P1Frame } from "@/components/wireframe/p1-canvas";
import { Annotation, WBox } from "@/components/wireframe/primitives";
import { P1_BY_SLUG } from "@/lib/p1";

export const Route = createFileRoute("/p1/$screen")({
  loader: ({ params }) => {
    const screen = P1_BY_SLUG[params.screen];
    if (!screen) throw notFound();
    return { screen };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — ABox Phase 1" }, { name: "robots", content: "noindex" }],
      };
    }
    const { screen } = loaderData;
    const title = `${screen.id} ${screen.name} — ABox Phase 1 Wireframe`;
    const description = `${screen.purpose} Primary user: ${screen.user}.`.slice(0, 158);
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
  component: P1ScreenPage,
  notFoundComponent: P1ScreenNotFound,
});

function P1ScreenPage() {
  const { screen } = Route.useLoaderData();
  const body = <P1Frame screen={screen} />;

  if (screen.shell === "consumer") {
    return <ConsumerShell assistantContext={screen.name.toLowerCase()}>{body}</ConsumerShell>;
  }

  const d = screen.drawer;
  return (
    <AppShell
      drawerTitle={`${screen.id} context`}
      assistantContext={screen.name.toLowerCase()}
      drawerBody={{
        Context: <Annotation>{d[0]}</Annotation>,
        Summary: <Annotation>{d[1] ?? d[0]}</Annotation>,
        Guidance: <Annotation>{d[2] ?? d[0]}</Annotation>,
        Audit: <Annotation>{d[4] ?? d[d.length - 2] ?? d[0]}</Annotation>,
        "Next actions": <Annotation>{d[d.length - 1]}</Annotation>,
      }}
    >
      {body}
    </AppShell>
  );
}

function P1ScreenNotFound() {
  return (
    <AppShell>
      <WBox
        className="h-32"
        label="no broader Phase 1 screen with that id — see /p1 for the full inventory"
      />
    </AppShell>
  );
}
