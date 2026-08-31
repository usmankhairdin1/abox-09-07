import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Id, KV, Note, PageHead, Section, Stat, Table, Tag } from "@/components/lucie/ui";
import { m00Status } from "@/lib/m00/m00.functions";
import { MIGRATIONS, RUNTIME_COVERAGE, RUNTIME_OPS } from "@/lib/m00/runtime";
import { CAPABILITY_REGISTER, REQUIREMENT_REGISTER, TEST_REGISTER } from "@/lib/m00/registers";

export const Route = createFileRoute("/m00/")({
  head: () => ({
    meta: [
      { title: "M00 Platform Foundation — live status | ABox" },
      {
        name: "description",
        content:
          "Live status of the ABox M00 platform foundation: applied migrations, forced row level security, seeded catalogues, runtime operation coverage and event outbox health.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "M00 Platform Foundation — live status" },
      {
        property: "og:description",
        content: "Applied migrations, RLS posture, seeded catalogues and runtime coverage for ABox M00.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FoundationOverview,
});

function FoundationOverview() {
  const status = useQuery({
    queryKey: ["m00", "status"],
    queryFn: () => m00Status(),
    refetchInterval: 30000,
  });

  const s = (status.data?.data ?? {}) as Record<string, number>;

  return (
    <>
      <PageHead
        eyebrow="M00 build packet v1.1"
        title="Platform foundation runtime"
        lede="The M00 schema is no longer inert. V001–V008 are applied to the Local Development Cloud Postgres, request context is resolved server-side on every call, and each governed write produces an audit record and an outbox envelope."
        right={<Id>protected_detailed_module_baselines = [M01]</Id>}
      />

      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Tables" value={status.isLoading ? "…" : (s["tables"] ?? "—")} hint="m00 schema" />
        <Stat label="Forced RLS" value={status.isLoading ? "…" : (s["rls_forced"] ?? "—")} hint="tables" />
        <Stat label="Policies" value={status.isLoading ? "…" : (s["policies"] ?? "—")} hint="row scopes" />
        <Stat label="Roles" value={status.isLoading ? "…" : (s["roles"] ?? "—")} hint="fixed templates" />
        <Stat label="Permissions" value={status.isLoading ? "…" : (s["permissions"] ?? "—")} hint="definitions" />
        <Stat label="Grant cells" value={status.isLoading ? "…" : (s["role_permission_grants"] ?? "—")} hint="role × permission" />
        <Stat label="Geographies" value={status.isLoading ? "…" : (s["geographies"] ?? "—")} hint="reference" />
        <Stat label="Identities" value={status.isLoading ? "…" : (s["users"] ?? "—")} hint="user_identity" />
        <Stat label="Tasks" value={status.isLoading ? "…" : (s["tasks"] ?? "—")} hint="shared work" />
        <Stat label="Audit events" value={status.isLoading ? "…" : (s["audit_events"] ?? "—")} hint="append only" />
        <Stat label="Outbox" value={status.isLoading ? "…" : (s["outbox_events"] ?? "—")} hint="envelopes" />
        <Stat label="Pending" value={status.isLoading ? "…" : (s["outbox_pending"] ?? "—")} hint="undrained" />
      </div>

      {status.data && !status.data.ok ? (
        <Note tone="stop">Foundation status unavailable: {status.data.error}</Note>
      ) : null}

      <Section
        title="Applied migrations"
        id="V001–V008"
        description="V001–V007 are the packet migrations applied unedited except for two defective source statements held under change control. V008 is the application runtime layer added on top of them."
      >
        <Table
          rows={MIGRATIONS}
          keyOf={(m) => m.id}
          columns={[
            { head: "Migration", cell: (m) => <Id>{m.id}</Id>, className: "w-24" },
            { head: "Contents", cell: (m) => m.title },
            {
              head: "State",
              cell: (m) => <Tag tone={m.status.startsWith("APPLIED (2") ? "warn" : "good"}>{m.status}</Tag>,
            },
          ]}
        />
      </Section>

      <Section
        title="Runtime coverage"
        meta={`${RUNTIME_COVERAGE.opsTotal} governed operations`}
        description="Coverage is derived from the runtime operation catalogue, which binds each executable operation to the API and event IDs it satisfies. Unbound register rows remain specification-only."
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="API operations served"
            value={`${RUNTIME_COVERAGE.apiImplemented} / ${RUNTIME_COVERAGE.apiTotal}`}
            hint="API-M00-###"
          />
          <Stat
            label="Event contracts emitted"
            value={`${RUNTIME_COVERAGE.eventEmitted} / ${RUNTIME_COVERAGE.eventTotal}`}
            hint="EVT-M00-###"
          />
          <Stat label="Write operations" value={RUNTIME_COVERAGE.writeOps} hint="audited + evented" />
          <Stat label="Capabilities" value={CAPABILITY_REGISTER.length} hint="CAP-M00-###" />
          <Stat label="Requirements" value={REQUIREMENT_REGISTER.length} hint="REQ-M00-###" />
          <Stat label="Governed scenarios" value={TEST_REGISTER.length} hint="TS-M00-###" />
        </div>
      </Section>

      <Section title="Governed operations" meta="public.m00_api dispatcher">
        <Table
          rows={RUNTIME_OPS}
          keyOf={(o) => o.op}
          columns={[
            { head: "Operation", cell: (o) => <Id>{o.op}</Id> },
            { head: "Title", cell: (o) => o.title },
            { head: "Kind", cell: (o) => <Tag tone={o.kind === "write" ? "warn" : "neutral"}>{o.kind}</Tag> },
            { head: "APIs", cell: (o) => o.api_ids.map((id) => <Id key={id}>{id}</Id>) },
            { head: "Events", cell: (o) => (o.event_ids.length ? o.event_ids.map((id) => <Id key={id}>{id}</Id>) : "—") },
            { head: "Access", cell: (o) => (o.publicRead ? "public read" : "authenticated") },
          ]}
        />
      </Section>

      <Section title="Change control held items" id="CCL-004 / CCL-005 / CCL-008">
        <div className="grid gap-2 sm:grid-cols-3">
          <KV k="CCL-004" v="ck_connector_definition_02 — array column compared against scalar list in source SQL; statement held." />
          <KV k="CCL-005" v="ck_release_record_01 — text version compared against integer in source SQL; statement held." />
          <KV k="CCL-008" v="V008 runtime layer: request context, governed entry point, audit + outbox on every write." />
        </div>
      </Section>
    </>
  );
}
