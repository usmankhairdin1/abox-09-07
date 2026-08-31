import { Link, createFileRoute, notFound, useParams } from "@tanstack/react-router";

import {
  Annotation,
  IdChip,
  PageHeading,
  WBox,
  WPanel,
} from "@/components/wireframe/primitives";
import {
  flowBySlug,
  isGovernedModule,
  screenById,
  type GovernedModuleKey,
} from "@/lib/governed";

export const Route = createFileRoute("/gov/$module/flows/$flow")({
  beforeLoad: ({ params }) => {
    if (!isGovernedModule(params.module)) throw notFound();
    if (!flowBySlug(params.module, params.flow)) throw notFound();
  },
  head: ({ params }) => {
    const flow = isGovernedModule(params.module)
      ? flowBySlug(params.module, params.flow)
      : undefined;
    if (!flow) {
      return { meta: [{ title: "Unavailable — ABox Lucie" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${flow.id} ${flow.name} — ABox Lucie flow`;
    const description = flow.summary.slice(0, 158);
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
  component: FlowDetail,
  notFoundComponent: () => <WBox className="h-32" label="no governed flow with that identifier" />,
});

function FlowDetail() {
  const { module, flow: slug } = useParams({ from: "/gov/$module/flows/$flow" }) as {
    module: GovernedModuleKey;
    flow: string;
  };
  const flow = flowBySlug(module, slug);
  if (!flow) return <WBox className="h-32" label="no governed flow with that identifier" />;

  return (
    <div className="space-y-4">
      <Link
        to="/gov/$module/flows"
        params={{ module }}
        className="inline-block rounded border border-hairline px-2 py-1 font-mono text-[10px] uppercase hover:bg-accent"
      >
        ← flow register
      </Link>

      <PageHeading id={flow.id} title={flow.name} description={flow.summary} />

      <div className="flex flex-wrap gap-2">
        <IdChip>{flow.status}</IdChip>
        {flow.languages.map((l) => (
          <IdChip key={l}>{l}</IdChip>
        ))}
      </div>

      <WPanel title="Governed step sequence" id={`${flow.id}-STEPS`}>
        <ol className="space-y-2">
          {flow.screens.map((sid, i) => {
            const screen = screenById(module, sid);
            return (
              <li key={sid} className="flex gap-3 rounded border border-dashed border-hairline p-2">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-hairline font-mono text-[10px]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <IdChip>{sid}</IdChip>
                    <span className="text-xs font-medium">{screen?.name ?? "screen record"}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {screen?.purpose ?? "Screen referenced by the controlled flow register."}
                  </p>
                  {screen ? (
                    <Link
                      to="/gov/$module/screens/$screen"
                      params={{ module, screen: screen.slug }}
                      className="mt-1 inline-block text-[11px] underline underline-offset-2"
                    >
                      Open frame
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </WPanel>

      <WPanel title="Accessibility and language" id={`${flow.id}-A11Y`}>
        <Annotation>{flow.accessibility}</Annotation>
        <Annotation className="mt-1">
          The selected language persists across every step; focus is placed on the step heading after
          each transition and the step change is announced politely.
        </Annotation>
      </WPanel>
    </div>
  );
}
