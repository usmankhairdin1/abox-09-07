import { createFileRoute, notFound } from "@tanstack/react-router";

import { AppShell } from "@/components/shell/AppShell";
import { ConsumerShell } from "@/components/shell/ConsumerShell";
import { M1Canvas } from "@/components/wireframe/m1-canvases";
import { ScreenFrame } from "@/components/wireframe/ScreenFrame";
import { Annotation, WBox } from "@/components/wireframe/primitives";
import { M1_BY_SLUG } from "@/lib/m1";

export const Route = createFileRoute("/m1/$screen")({
  loader: ({ params }) => {
    const screen = M1_BY_SLUG[params.screen];
    if (!screen) throw notFound();
    return { screen };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — ABox Module 1" }, { name: "robots", content: "noindex" }],
      };
    }
    const { screen } = loaderData;
    const title = `${screen.id} ${screen.name} — ABox Module 1 Wireframe`;
    const description = `${screen.purpose} Primary user: ${screen.user}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 158) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 158) },
      ],
    };
  },
  component: M1ScreenPage,
  notFoundComponent: M1ScreenNotFound,
});

function M1ScreenPage() {
  const { screen } = Route.useLoaderData();
  const body = (
    <ScreenFrame screen={screen}>
      <M1Canvas slug={screen.slug} />
    </ScreenFrame>
  );

  if (screen.shell === "consumer") {
    return (
      <ConsumerShell
        variant={
          screen.slug === "ux-016" ? "member" : screen.slug === "ux-020" ? "shared-link" : "marketplace"
        }
        assistantContext={screen.name.toLowerCase()}
      >
        {body}
      </ConsumerShell>
    );
  }

  const drawer = screen.drawer;

  return (
    <AppShell
      drawerTitle={`${screen.id} context`}
      assistantContext={screen.name.toLowerCase()}
      {...(drawer
        ? {
            drawerBody: {
              Context: <Annotation>{drawer[0]}</Annotation>,
              Summary: <Annotation>{drawer[1]}</Annotation>,
              Guidance: <Annotation>{drawer[2]}</Annotation>,
              Audit: <Annotation>{drawer[4]}</Annotation>,
              "Next actions": <Annotation>{drawer[5]}</Annotation>,
            },
          }
        : {})}
    >
      {body}
    </AppShell>
  );

}

function M1ScreenNotFound() {
  return (
    <AppShell>
      <WBox className="h-32" label="no Module 1 screen with that id — see /m1 for UX-001 … UX-026" />
    </AppShell>
  );
}
