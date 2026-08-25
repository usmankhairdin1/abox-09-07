import { createFileRoute } from "@tanstack/react-router";

import { Id, IdList, KV, Note, PageHead, Section, Tag } from "@/components/lucie/ui";
import { GATE_BY_ID, SLICES, SURFACE_BY_ID, WORKSTREAM_BY_ID } from "@/lib/lucie";

export const Route = createFileRoute("/lucie/slices")({
  head: () => ({
    meta: [
      { title: "Lucie Release Slices — Integrated Delivery Outcomes A to H" },
      {
        name: "description",
        content:
          "Eight integrated Lucie release slices, each with its demonstrable outcome, contributing lanes, IA v2.0 surfaces, acceptance posture and blocking launch gates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Lucie Release Slices" },
      {
        property: "og:description",
        content:
          "A slice is an integrated outcome, not a coded window. Activation still depends on the applicable launch gates.",
      },
    ],
  }),
  component: SlicesPage,
});

function SlicesPage() {
  return (
    <>
      <PageHead
        eyebrow="Integrated outcomes"
        title="Release slices A–H"
        lede="Each slice is something a real user can complete end to end, across lanes. Slices are how the four months are demonstrated and accepted; they are deliberately not lane milestones, because a lane finishing code proves nothing on its own."
        right={<Id>{`${SLICES.length} slices`}</Id>}
      />

      {SLICES.map((s) => (
        <Section
          key={s.id}
          title={s.name}
          id={s.id}
          meta={`${s.surfaces.length} surfaces · ${s.gates.length} gates`}
        >
          <dl className="grid gap-0">
            <KV k="Demonstrable outcome" v={s.outcome} />
            <KV k="Acceptance posture" v={s.acceptancePosture} />
            <KV
              k="Contributing lanes"
              v={
                <span className="flex flex-wrap gap-1.5">
                  {s.workstreams.map((id) => (
                    <Tag key={id} tone="info">
                      {id} · {WORKSTREAM_BY_ID[id]?.name ?? "unknown lane"}
                    </Tag>
                  ))}
                </span>
              }
            />
            <KV
              k="Surfaces"
              v={
                <ul className="grid gap-1">
                  {s.surfaces.map((id) => (
                    <li key={id} className="flex flex-wrap items-baseline gap-2">
                      <Id>{id}</Id>
                      <span className="text-xs text-muted-foreground">
                        {SURFACE_BY_ID[id]?.surfaceName ?? "not in surface baseline"}
                      </span>
                    </li>
                  ))}
                </ul>
              }
            />
            <KV
              k="Blocking gates"
              v={
                <ul className="grid gap-1">
                  {s.gates.map((id) => (
                    <li key={id} className="flex flex-wrap items-baseline gap-2">
                      <Id>{id}</Id>
                      <span className="text-xs text-muted-foreground">
                        {GATE_BY_ID[id]?.gate ?? "not in gate register"}
                      </span>
                    </li>
                  ))}
                </ul>
              }
            />
          </dl>
        </Section>
      ))}

      <Note tone="warn">
        A slice being demonstrable is not the same as it being live. Production activation for any
        slice touching carriers, EDE, NIPR or payment remains behind its launch gates, and the
        payment simulation seam never activates in production at all.
      </Note>
    </>
  );
}
