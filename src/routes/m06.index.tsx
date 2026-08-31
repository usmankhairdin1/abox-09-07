import { createFileRoute, Link } from "@tanstack/react-router";

import { Id, IdList, KV, Note, PageHead, Section, Stat, Table, Tag } from "@/components/lucie/ui";
import { M06_INDEX } from "@/lib/governed/m06.index";
import { M06_OPERATIONS } from "@/lib/m06/m06.functions";

export const Route = createFileRoute("/m06/")({
  head: () => ({
    meta: [
      { title: "M06 foundation | ABox agency and network" },
      {
        name: "description",
        content:
          "Live M06 Agency, Agent and Network Management foundation: canonical schema, tenant and organization isolation, server-side permission enforcement and governed operations.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "M06 agency and network foundation" },
      {
        property: "og:description",
        content: "Canonical M06 data model, enforcement posture and governed runtime operations.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: M06Foundation,
});

const OBJECT_GROUPS: { group: string; tables: string[]; note: string }[] = [
  {
    group: "Workforce identity and affiliation",
    tables: ["workforce_profile", "agency_operational_profile", "agency_affiliation", "affiliation_correction"],
    note: "OBJ-M06-001, 002, 003, 027, 032. Roster-only profiles are first-class; user linkage is optional.",
  },
  {
    group: "Groups and assignment",
    tables: ["workforce_group", "group_membership", "work_assignment_context"],
    note: "OBJ-M06-004 to 007 and 033. Business units and teams share one governed group table.",
  },
  {
    group: "Lifecycle",
    tables: ["lifecycle_case", "profile_status_history"],
    note: "OBJ-M06-011, 012, 013, 031. Onboarding, transfer and offboarding are one case object with a type.",
  },
  {
    group: "Operating posture and readiness",
    tables: ["availability_declaration", "service_scope", "readiness_result"],
    note: "OBJ-M06-014 to 017. Readiness is derived and never authored directly.",
  },
  {
    group: "Work surface",
    tables: ["m06_exception", "task_reference", "workforce_note", "document_reference", "history_entry"],
    note: "OBJ-M06-018 to 022. Note audience is a controlled value and filtered server-side.",
  },
  {
    group: "Jobs, reconciliation and notification",
    tables: ["job_reference", "reconciliation_run", "notification_request"],
    note: "OBJ-M06-023, 024, 025, 026.",
  },
  {
    group: "Identity resolution",
    tables: ["duplicate_candidate", "identity_link_review", "support_context"],
    note: "OBJ-M06-029, 030, 040. Matching proposes; a human decides.",
  },
  {
    group: "Upstream projections (read-only)",
    tables: ["upstream_projection"],
    note: "OBJ-M06-008, 009, 010, 034 to 039. Owned by M00, M04, M05 and M08; M06 never writes the source of truth.",
  },
  {
    group: "Control plane",
    tables: ["enumeration_value", "state_model", "permission_grant", "event_outbox", "schema_version"],
    note: "30 controlled enumerations and 15 state models seeded from the packet registers.",
  },
];

function M06Foundation() {
  const metrics = M06_INDEX.meta.summary_metrics ?? {};
  return (
    <>
      <PageHead
        eyebrow="M06 · production build baseline"
        title="Agency, agent and network foundation"
        lede="Canonical data, tenant isolation and organization scope are in place first; server-side permission enforcement sits in front of every operation, and the UI can only ask for work the server has already authorised."
        right={<Id>M06-1.0-V002</Id>}
      />

      <Note tone="warn">
        CONF-M06-001 resolved under CCL-M06-001: the packet migrations V001-V008 ship as marker stubs
        only, so the DDL was authored from the controlled Object, Enumeration, State Model and
        Relationship registers. Stable IDs are unchanged. CONF-M06-002 is closed — the repaired packet
        carries routes, permissions and actions in the Screen Register.
      </Note>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Screens" value={M06_INDEX.screens.length} hint="Screen Register" />
        <Stat label="Flows" value={M06_INDEX.flows.length} hint="User Flow Register" />
        <Stat label="Governed operations live" value={M06_OPERATIONS.length} hint="lucie_m06_api" />
        <Stat
          label="Requirements"
          value={String(metrics["requirements"] ?? metrics["Requirement_Register"] ?? "135")}
          hint="Requirement Register"
        />
      </div>

      <Section
        title="Enforcement posture"
        description="Every M06 call resolves context before it resolves intent. Ambiguity is a denied condition, not a fallback."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <KV k="Entry point" v={<Id>public.lucie_m06_api</Id>} />
          <KV k="Context rule" v="Tenant and organization must both resolve, or the call returns CONTEXT_AMBIGUOUS." />
          <KV k="Permission rule" v="Operation maps to a permission from the Permission Register and is checked before any read or write." />
          <KV k="Table access" v="Row-level security enabled and forced on every table; no direct app grants exist." />
          <KV k="Audit" v="Every insert, update and delete writes an immutable history entry." />
          <KV k="Events" v="Each successful write enqueues a governed envelope in the M06 outbox." />
        </div>
      </Section>

      <Section title="Canonical objects" meta="40 register objects mapped to the live schema">
        <Table
          rows={OBJECT_GROUPS}
          keyOf={(r) => r.group}
          columns={[
            { head: "Group", cell: (r) => <span className="font-medium">{r.group}</span> },
            { head: "Tables", cell: (r) => <IdList ids={r.tables} /> },
            { head: "Register note", cell: (r) => <span className="text-muted-foreground">{r.note}</span> },
          ]}
        />
      </Section>

      <Section title="Ownership boundaries" description="M06 composes; it does not annex.">
        <div className="flex flex-wrap gap-2">
          <Tag tone="info">M00 owns identity and access</Tag>
          <Tag tone="info">M05 owns organizations and hierarchy</Tag>
          <Tag tone="info">M04 owns marketplace and branding</Tag>
          <Tag tone="info">M08 owns selling authority</Tag>
          <Tag tone="good">M06 owns workforce profile, affiliation, groups, lifecycle, readiness</Tag>
        </div>
      </Section>

      <Section title="Where to go next">
        <div className="flex flex-wrap gap-2 text-xs">
          <Link to="/m06/roster" className="rounded-lg border border-hairline px-2.5 py-1.5 hover:bg-accent">
            Workforce roster (live)
          </Link>
          <Link to="/m06/console" className="rounded-lg border border-hairline px-2.5 py-1.5 hover:bg-accent">
            Runtime console
          </Link>
          <Link
            to="/gov/$module"
            params={{ module: "m06" }}
            className="rounded-lg border border-hairline px-2.5 py-1.5 hover:bg-accent"
          >
            Screens, flows and registers
          </Link>
        </div>
      </Section>
    </>
  );
}
