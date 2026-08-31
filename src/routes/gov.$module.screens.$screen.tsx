import { Link, createFileRoute, notFound, useParams } from "@tanstack/react-router";

import { GovernedFrame } from "@/components/governed/GovernedFrame";
import { WBox } from "@/components/wireframe/primitives";
import { isGovernedModule, screenBySlug, type GovernedModuleKey } from "@/lib/governed";

export const Route = createFileRoute("/gov/$module/screens/$screen")({
  beforeLoad: ({ params }) => {
    if (!isGovernedModule(params.module)) throw notFound();
    if (!screenBySlug(params.module, params.screen)) throw notFound();
  },
  head: ({ params }) => {
    const screen = isGovernedModule(params.module)
      ? screenBySlug(params.module, params.screen)
      : undefined;
    if (!screen) {
      return { meta: [{ title: "Unavailable — ABox Lucie" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${screen.id} ${screen.name} — ABox Lucie wireframe`;
    const description = screen.purpose.slice(0, 158);
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
  component: ScreenDetail,
  notFoundComponent: ScreenMissing,
});

function ScreenDetail() {
  const { module, screen: slug } = useParams({ from: "/gov/$module/screens/$screen" }) as {
    module: GovernedModuleKey;
    screen: string;
  };
  const screen = screenBySlug(module, slug);
  if (!screen) return <ScreenMissing />;

  return (
    <div className="space-y-3">
      <Link
        to="/gov/$module/screens"
        params={{ module }}
        className="inline-block rounded border border-border px-2 py-1 font-mono text-[10px] uppercase hover:bg-muted"
      >
        ← screen inventory
      </Link>
      <GovernedFrame module={module} screen={screen} />
    </div>
  );
}

function ScreenMissing() {
  return <WBox className="h-32" label="no controlled screen with that identifier" />;
}
