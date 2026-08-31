import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Id, Note, PageHead, Search, Section, Select, Stat, Table, Tag, Toolbar } from "@/components/lucie/ui";
import { REQUIREMENT_REGISTER, TASK_REGISTER, TEST_REGISTER } from "@/lib/m00/registers";

export const Route = createFileRoute("/m00/tests")({
  head: () => ({
    meta: [
      { title: "M00 governed scenarios and task packs | ABox" },
      {
        name: "description",
        content:
          "253 governed M00 test scenarios and 225 implementation tasks traced to requirements, with execution posture for the ABox platform foundation.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "M00 governed scenarios and task packs" },
      { property: "og:description", content: "Scenario and task registers traced to M00 requirement IDs." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TestsPage,
});

function TestsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");

  const types = useMemo(() => Array.from(new Set(TEST_REGISTER.map((t) => t.test_type))).sort(), []);

  const rows = useMemo(
    () =>
      TEST_REGISTER.filter((t) => {
        if (type !== "all" && t.test_type !== type) return false;
        if (!q) return true;
        return `${t.test_id} ${t.title} ${t.requirement_ids}`.toLowerCase().includes(q.toLowerCase());
      }),
    [q, type],
  );

  return (
    <>
      <PageHead
        eyebrow="08 QA, traceability and regression · 10 Implementation task packs"
        title="Scenarios and task packs"
        lede="The governed scenario register is the acceptance surface for M00. Package contract tests pass; the Gherkin behaviour suite is executed against QA once that environment exists, so scenarios are shown as ready for automation rather than passed."
        right={<Id>TS-M00-001 … TS-M00-253</Id>}
      />

      <div className="grid gap-2 sm:grid-cols-4">
        <Stat label="Scenarios" value={TEST_REGISTER.length} hint="governed" />
        <Stat label="Requirements" value={REQUIREMENT_REGISTER.length} hint="REQ-M00-###" />
        <Stat label="Implementation tasks" value={TASK_REGISTER.length} hint="TASK-M00-###" />
        <Stat label="Package contract tests" value="14 / 14" hint="executed, passed" />
      </div>

      <Note tone="warn">
        Execution posture: only the package verification suite has been executed. The 253 scenarios require QA, UAT and
        Production environments, which remain outstanding under CCL-002.
      </Note>

      <Section title="Governed scenarios" meta={`${rows.length} shown`}>
        <Toolbar>
          <Search value={q} onChange={setQ} placeholder="Search scenario or requirement ID" />
          <Select
            label="Type"
            value={type}
            onChange={setType}
            options={[{ value: "all", label: "All" }, ...types.map((t) => ({ value: t, label: t }))]}
          />
        </Toolbar>
        <Table
          rows={rows.slice(0, 120)}
          keyOf={(t) => t.test_id}
          columns={[
            { head: "ID", cell: (t) => <Id>{t.test_id}</Id>, className: "w-28" },
            { head: "Scenario", cell: (t) => t.title },
            { head: "Type", cell: (t) => <Tag tone="neutral">{t.test_type}</Tag> },
            { head: "Requirements", cell: (t) => t.requirement_ids.split(" | ").map((r) => <Id key={r}>{r}</Id>) },
            { head: "State", cell: (t) => <Tag tone="info">{t.status}</Tag> },
          ]}
        />
        {rows.length > 120 ? (
          <p className="mt-2 text-[11px] text-muted-foreground">Showing first 120 of {rows.length}. Narrow the search to see more.</p>
        ) : null}
      </Section>

      <Section title="Implementation task packs" meta={`${TASK_REGISTER.length} tasks`}>
        <Table
          rows={TASK_REGISTER.slice(0, 60)}
          keyOf={(t) => t.task_id}
          columns={[
            { head: "ID", cell: (t) => <Id>{t.task_id}</Id>, className: "w-32" },
            { head: "Epic", cell: (t) => <Id>{t.epic_id}</Id> },
            { head: "Task", cell: (t) => t.title },
            { head: "Role", cell: (t) => t.primary_role },
            { head: "State", cell: (t) => <Tag tone="neutral">{t.status}</Tag> },
          ]}
        />
        <p className="mt-2 text-[11px] text-muted-foreground">Showing first 60 of {TASK_REGISTER.length} task pack rows.</p>
      </Section>
    </>
  );
}
