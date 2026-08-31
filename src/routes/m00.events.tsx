import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Id, Note, PageHead, Search, Section, Select, Stat, Table, Tag, Toolbar } from "@/components/lucie/ui";
import { EVENT_REGISTER, CAPABILITY_REGISTER } from "@/lib/m00/registers";
import { IMPLEMENTED_EVENT_IDS, RUNTIME_OPS } from "@/lib/m00/runtime";
import { m00Status } from "@/lib/m00/m00.functions";

export const Route = createFileRoute("/m00/events")({
  head: () => ({
    meta: [
      { title: "M00 event contracts and outbox | ABox" },
      {
        name: "description",
        content:
          "66 approved ABox M00 event contracts with envelope, delivery and compatibility rules, plus the live outbox publisher state.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "M00 event contracts and outbox" },
      { property: "og:description", content: "Approved event contracts and the live transactional outbox." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventsPage,
});

const OPS_BY_EVENT = new Map<string, string[]>();
for (const op of RUNTIME_OPS) {
  for (const id of op.event_ids) {
    OPS_BY_EVENT.set(id, [...(OPS_BY_EVENT.get(id) ?? []), op.op]);
  }
}

function EventsPage() {
  const [q, setQ] = useState("");
  const [cap, setCap] = useState("all");

  const status = useQuery({ queryKey: ["m00", "status"], queryFn: () => m00Status(), refetchInterval: 30000 });
  const s = (status.data?.data ?? {}) as Record<string, number>;

  const rows = useMemo(
    () =>
      EVENT_REGISTER.filter((r) => {
        if (cap !== "all" && r.capability_id !== cap) return false;
        if (!q) return true;
        return `${r.event_id} ${r.name} ${r.title} ${r.purpose}`.toLowerCase().includes(q.toLowerCase());
      }),
    [q, cap],
  );

  return (
    <>
      <PageHead
        eyebrow="Event contracts and transactional outbox"
        title="Events"
        lede="Each governed write inserts its envelope into the transactional outbox in the same transaction as the state change and the audit record, so no state change can exist without its event. The publisher drains pending envelopes and counts attempts."
        right={<Id>EVT-M00-001 … EVT-M00-066</Id>}
      />

      <div className="grid gap-2 sm:grid-cols-4">
        <Stat label="Contracts" value={EVENT_REGISTER.length} hint="approved" />
        <Stat label="Emitted by runtime" value={IMPLEMENTED_EVENT_IDS.size} hint="live producers" />
        <Stat label="Outbox envelopes" value={status.isLoading ? "…" : (s["outbox_events"] ?? "—")} hint="all time" />
        <Stat label="Pending" value={status.isLoading ? "…" : (s["outbox_pending"] ?? "—")} hint="awaiting drain" />
      </div>

      <Note tone="info">
        Delivery is at least once; consumers deduplicate on <Id>event_id</Id>. Compatibility is additive within v1 — a breaking
        change creates a v2 contract rather than mutating the approved envelope.
      </Note>

      <Section title="Contract register" meta={`${rows.length} shown`}>
        <Toolbar>
          <Search value={q} onChange={setQ} placeholder="Search event name, title or purpose" />
          <Select
            label="Capability"
            value={cap}
            onChange={setCap}
            options={[
              { value: "all", label: "All" },
              ...CAPABILITY_REGISTER.map((c) => ({ value: c.capability_id, label: `${c.capability_id} ${c.name}` })),
            ]}
          />
        </Toolbar>
        <Table
          rows={rows}
          keyOf={(r) => r.event_id}
          columns={[
            { head: "ID", cell: (r) => <Id>{r.event_id}</Id>, className: "w-28" },
            {
              head: "Event",
              cell: (r) => (
                <span>
                  <span className="font-mono text-[11px]">{r.name}</span>
                  <span className="block text-muted-foreground">{r.purpose}</span>
                </span>
              ),
            },
            { head: "Capability", cell: (r) => <Id>{r.capability_id}</Id> },
            {
              head: "Producer",
              cell: (r) =>
                IMPLEMENTED_EVENT_IDS.has(r.event_id) ? (
                  <span className="flex flex-wrap gap-1">
                    <Tag tone="good">live</Tag>
                    {(OPS_BY_EVENT.get(r.event_id) ?? []).map((o) => (
                      <Id key={o}>{o}</Id>
                    ))}
                  </span>
                ) : (
                  <Tag tone="neutral">contract only</Tag>
                ),
            },
          ]}
        />
      </Section>
    </>
  );
}
