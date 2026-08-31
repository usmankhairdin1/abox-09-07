import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Id, Note, PageHead, Search, Section, Select, Stat, Table, Tag, Toolbar } from "@/components/lucie/ui";
import { API_REGISTER, CAPABILITY_REGISTER } from "@/lib/m00/registers";
import { IMPLEMENTED_API_IDS, RUNTIME_OPS } from "@/lib/m00/runtime";

export const Route = createFileRoute("/m00/api")({
  head: () => ({
    meta: [
      { title: "M00 API register — 82 operations | ABox" },
      {
        name: "description",
        content:
          "The full ABox M00 API register: 82 contract operations with permission, idempotency and capability binding, showing which are served by the live runtime.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "M00 API register — 82 operations" },
      { property: "og:description", content: "Contract operations bound to the live M00 runtime entry point." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ApiRegisterPage,
});

const OPS_BY_API = new Map<string, string[]>();
for (const op of RUNTIME_OPS) {
  for (const id of op.api_ids) {
    OPS_BY_API.set(id, [...(OPS_BY_API.get(id) ?? []), op.op]);
  }
}

function ApiRegisterPage() {
  const [q, setQ] = useState("");
  const [cap, setCap] = useState("all");
  const [state, setState] = useState("all");

  const rows = useMemo(
    () =>
      API_REGISTER.filter((r) => {
        const live = IMPLEMENTED_API_IDS.has(r.api_id);
        if (cap !== "all" && r.capability_id !== cap) return false;
        if (state === "live" && !live) return false;
        if (state === "spec" && live) return false;
        if (!q) return true;
        const hay = `${r.api_id} ${r.method} ${r.path} ${r.title} ${r.permission}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      }),
    [q, cap, state],
  );

  return (
    <>
      <PageHead
        eyebrow="05 Data, API, Event and Integration"
        title="API register"
        lede="Every operation in the approved contract, with its permission, idempotency requirement and owning capability. Rows marked live are reachable now through the governed runtime entry point; the rest remain contract-only until their capability lands."
        right={<Id>API-M00-001 … API-M00-082</Id>}
      />

      <div className="grid gap-2 sm:grid-cols-4">
        <Stat label="Operations" value={API_REGISTER.length} hint="contract total" />
        <Stat label="Served by runtime" value={IMPLEMENTED_API_IDS.size} hint="reachable now" />
        <Stat label="Idempotent writes" value={API_REGISTER.filter((r) => r.idempotency_required === "True").length} hint="key required" />
        <Stat label="Capabilities" value={CAPABILITY_REGISTER.length} hint="CAP-M00-###" />
      </div>

      <Section title="Operations" meta={`${rows.length} shown`}>
        <Toolbar>
          <Search value={q} onChange={setQ} placeholder="Search ID, path, title or permission" />
          <Select
            label="Capability"
            value={cap}
            onChange={setCap}
            options={[
              { value: "all", label: "All" },
              ...CAPABILITY_REGISTER.map((c) => ({ value: c.capability_id, label: `${c.capability_id} ${c.name}` })),
            ]}
          />
          <Select
            label="Runtime"
            value={state}
            onChange={setState}
            options={[
              { value: "all", label: "All" },
              { value: "live", label: "Served" },
              { value: "spec", label: "Contract only" },
            ]}
          />
        </Toolbar>
        <Table
          rows={rows}
          keyOf={(r) => r.api_id}
          columns={[
            { head: "ID", cell: (r) => <Id>{r.api_id}</Id>, className: "w-28" },
            { head: "Operation", cell: (r) => (
              <span>
                <span className="font-mono text-[11px] font-semibold">{r.method}</span> {r.path}
                <span className="block text-muted-foreground">{r.title}</span>
              </span>
            ) },
            { head: "Permission", cell: (r) => <Id>{r.permission}</Id> },
            { head: "Idempotent", cell: (r) => (r.idempotency_required === "True" ? <Tag tone="info">required</Tag> : "—") },
            { head: "Capability", cell: (r) => <Id>{r.capability_id}</Id> },
            {
              head: "Runtime",
              cell: (r) =>
                IMPLEMENTED_API_IDS.has(r.api_id) ? (
                  <span className="flex flex-wrap gap-1">
                    <Tag tone="good">served</Tag>
                    {(OPS_BY_API.get(r.api_id) ?? []).map((o) => (
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

      <Note tone="info">
        Contract-only rows are not stubs. They stay unimplemented deliberately: their owning capability either belongs to a
        later module (tenants to M05, marketplace to M04) or depends on an approved change record. No operation is emulated.
      </Note>
    </>
  );
}
