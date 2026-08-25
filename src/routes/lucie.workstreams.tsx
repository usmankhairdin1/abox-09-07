import { createFileRoute } from "@tanstack/react-router";

import { Id, IdList, KV, Note, PageHead, Section, Table, Tag } from "@/components/lucie/ui";
import { capabilitiesForWorkstream, WORKSTREAMS } from "@/lib/lucie";

export const Route = createFileRoute("/lucie/workstreams")({
  head: () => ({
    meta: [
      { title: "Lucie Delivery Lanes — Nine Workstreams and Critical Path" },
      {
        name: "description",
        content:
          "The nine Lucie workstreams as delivery lanes: window, sequence, entry dependencies, exit criteria, capability load, critical path and parallel work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Lucie Delivery Lanes" },
      {
        property: "og:description",
        content:
          "Workstreams are lanes, not modules. Critical path runs from identity and tenant controls through to launch hardening.",
      },
    ],
  }),
  component: WorkstreamsPage,
});

const CRITICAL_PATH = ["WS-00", "WS-01", "WS-02", "WS-03", "WS-04", "WS-08"];

function WorkstreamsPage() {
  return (
    <>
      <PageHead
        eyebrow="Delivery structure"
        title="Nine delivery lanes"
        lede="Workstreams are lanes for sequencing and staffing. They are never modules, never object owners and never a second identifier space — every lane's work still resolves to canonical module IDs on the traceability matrix."
        right={<Id>{`${WORKSTREAMS.length} lanes`}</Id>}
      />

      <Section
        title="Critical path and parallel work"
        id="SPINE-CRITICAL-PATH"
        description="The governed-shell foundation cannot be parallelised away: tenant isolation, roles and audit gate every other lane's acceptance. Product data and shopping follow, then the pathway-bearing enrollment work, then hardening."
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {CRITICAL_PATH.map((id, i) => (
            <span key={id} className="flex items-center gap-1.5">
              {i > 0 ? <span className="text-muted-foreground">→</span> : null}
              <Tag tone="stop">{id}</Tag>
            </span>
          ))}
        </div>
        <dl className="mt-3 grid gap-0">
          <KV
            k="Runs in parallel"
            v="WS-05 communications and consent, WS-06 CRM and Customer 360, and WS-07 PlanAI can develop alongside the critical path once the shell and canonical objects exist. They still land inside a release slice for acceptance."
          />
          <KV
            k="Cannot be parallelised"
            v="Nothing downstream can be accepted before tenant isolation, server-side access decisions and audit exist. Fixed-asset governance (owner, effective dates, lifecycle, audit) must land with the assets, not after them."
          />
          <KV
            k="Sequencing rule"
            v="A coded window is not an activation. Every lane's exit criteria are separate from the launch gates that permit production use."
          />
        </dl>
      </Section>

      {WORKSTREAMS.map((w) => {
        const caps = capabilitiesForWorkstream(w.workstreamId);
        return (
          <Section
            key={w.workstreamId}
            title={w.name}
            id={w.workstreamId}
            meta={`${caps.length} capabilities · ${w.window || "window TBC"}`}
          >
            <dl className="grid gap-0">
              <KV k="Scope" v={w.scope} />
              <KV k="Sequence" v={w.sequence} />
              <KV k="Parallel lane" v={w.parallelLane || "Not parallel"} />
              <KV k="Entry dependencies" v={w.entryDependencies} />
              <KV k="Exit criteria" v={w.exitCriteria} />
              <KV
                k="Canonical modules touched"
                v={
                  <IdList
                    ids={Array.from(
                      new Set(caps.flatMap((c) => c.canonicalModules.split(/[,;]/).map((s) => s.trim()))),
                    ).filter(Boolean)}
                  />
                }
              />
            </dl>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                Capability load in this lane
              </summary>
              <div className="mt-2">
                <Table
                  rows={caps}
                  keyOf={(c) => c.capabilityId}
                  columns={[
                    { head: "ID", cell: (c) => <Id>{c.capabilityId}</Id> },
                    { head: "Capability", cell: (c) => c.capability },
                    {
                      head: "Simplification",
                      cell: (c) => c.simplification || "—",
                      className: "text-muted-foreground",
                    },
                    {
                      head: "Acceptance posture",
                      cell: (c) => c.acceptancePosture || "—",
                      className: "text-muted-foreground",
                    },
                  ]}
                />
              </div>
            </details>
          </Section>
        );
      })}

      <Note tone="warn">
        Capability counts here are derived from the capability register's workstream column. If a
        lane looks light, that is a real signal about where requirements still need to be written —
        not a rendering artifact.
      </Note>
    </>
  );
}
