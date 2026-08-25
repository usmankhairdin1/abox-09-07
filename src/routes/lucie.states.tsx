import { createFileRoute } from "@tanstack/react-router";

import { Id, IdList, Note, PageHead, Section, Table, Tag } from "@/components/lucie/ui";
import { NON_EQUIVALENCE_INVARIANTS, STATES } from "@/lib/lucie";

export const Route = createFileRoute("/lucie/states")({
  head: () => ({
    meta: [
      { title: "Lucie State Model — Nine States Kept Separate" },
      {
        name: "description",
        content:
          "Availability, quoteability, sellability, enrollability, application readiness, EDI generation, external handoff, payment posture and confirmed external outcome as separate governed states.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Lucie State Model" },
      {
        property: "og:description",
        content:
          "A PDF is not acceptance, EDI is not submission, handoff is not enrollment, simulation is not payment.",
      },
    ],
  }),
  component: StatesPage,
});

function StatesPage() {
  return (
    <>
      <PageHead
        eyebrow="Truth model"
        title="States and non-equivalence invariants"
        lede="Collapsing two of these states is the fastest way for a fast release to tell a user something untrue. Each state has one owner, one question it answers and one evidence source; nothing infers an external party's decision from our own action."
        right={
          <>
            <Id>{`${STATES.length} states`}</Id>
            <Id>{`${NON_EQUIVALENCE_INVARIANTS.length} invariants`}</Id>
          </>
        }
      />

      <Section
        title="State register"
        id="SPINE-STATES"
        description="Each state is resolved server-side and rendered, never computed in the UI as a convenience."
      >
        <Table
          rows={STATES}
          keyOf={(s) => s.id}
          columns={[
            {
              head: "State",
              cell: (s) => (
                <>
                  <Id>{s.id}</Id>
                  <div className="mt-1 font-medium">{s.state}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">owner {s.owner}</div>
                </>
              ),
              className: "min-w-[170px]",
            },
            { head: "Question it answers", cell: (s) => s.question, className: "min-w-[220px]" },
            {
              head: "Values",
              cell: (s) => (
                <span className="flex flex-wrap gap-1">
                  {s.values.map((v) => (
                    <Tag key={v}>{v}</Tag>
                  ))}
                </span>
              ),
            },
            {
              head: "Decided by",
              cell: (s) => s.decidedBy,
              className: "text-muted-foreground min-w-[200px]",
            },
            { head: "Surfaces", cell: (s) => <IdList ids={s.surfaces} /> },
          ]}
        />
      </Section>

      <Section
        title="Non-equivalence invariants"
        id="SPINE-INVARIANTS"
        meta="Each one is a testable acceptance rule"
      >
        <Table
          rows={NON_EQUIVALENCE_INVARIANTS}
          keyOf={(i) => i.id}
          columns={[
            { head: "ID", cell: (i) => <Id>{i.id}</Id> },
            {
              head: "Prohibited claim",
              cell: (i) => <Tag tone="stop">{i.claim}</Tag>,
              className: "min-w-[220px]",
            },
            { head: "Truth", cell: (i) => i.truth, className: "min-w-[200px]" },
            { head: "Test", cell: (i) => i.test, className: "text-muted-foreground min-w-[260px]" },
          ]}
        />
      </Section>

      <Note tone="stop">
        These invariants bind copy, notifications, exports and reporting as well as screens. A report
        that labels a generated PDF as an enrollment is the same defect as a screen that does it.
      </Note>
    </>
  );
}
