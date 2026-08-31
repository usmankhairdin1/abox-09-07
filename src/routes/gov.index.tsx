import { Link, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/shell/AppShell";
import { Annotation, IdChip, PageHeading, WPanel } from "@/components/wireframe/primitives";
import { GOVERNED_MODULES, MODULE_PACKET, MODULE_TITLE, moduleIndex } from "@/lib/governed";

export const Route = createFileRoute("/gov/")({
  head: () => {
    const title = "Governed build packets — ABox Lucie estate";
    const description =
      "Every controlled Lucie build packet (M00, M04, M05) rendered as navigable wireframes: workspaces, screens, flows, registers, impacts and traceability.";
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
  component: GovIndex,
});

function GovIndex() {
  return (
    <AppShell assistantContext="the governed build-packet estate">
      <div className="space-y-4">
        <PageHeading
          id="GOV-INDEX"
          title="Governed build packets"
          subtitle="Controlled Lucie modules rendered from their machine-readable registers. Low-fidelity wireframes only — structure, states, evidence and navigation."
        />
        <div className="grid gap-3 md:grid-cols-3">
          {GOVERNED_MODULES.map((m) => {
            const idx = moduleIndex(m);
            return (
              <WPanel key={m} title={MODULE_TITLE[m]} id={m.toUpperCase()}>
                <p className="text-[11px] text-muted-foreground">{MODULE_PACKET[m]}</p>
                <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                  <li>{idx.workspaces.length} workspaces</li>
                  <li>{idx.screens.length} controlled screens</li>
                  <li>{idx.flows.length} governed flows</li>
                </ul>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Link
                    to="/gov/$module"
                    params={{ module: m }}
                    className="rounded border border-border px-2 py-1 text-xs hover:bg-muted"
                  >
                    Open estate
                  </Link>
                  <Link
                    to="/gov/$module/screens"
                    params={{ module: m }}
                    className="rounded border border-border px-2 py-1 text-xs hover:bg-muted"
                  >
                    Screens
                  </Link>
                  <Link
                    to="/gov/$module/registers"
                    params={{ module: m }}
                    className="rounded border border-border px-2 py-1 text-xs hover:bg-muted"
                  >
                    Registers
                  </Link>
                </div>
              </WPanel>
            );
          })}
        </div>
        <Annotation>
          <IdChip>Precedence</IdChip> Approved change records and deltas → registry and contracts →
          requirements, rules, validation and acceptance → workbook and CSV registers → controlled
          narrative → visuals → Phase 1 and North Star reference material.
        </Annotation>
      </div>
    </AppShell>
  );
}
