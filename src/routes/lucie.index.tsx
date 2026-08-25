import { createFileRoute } from "@tanstack/react-router";

import { Id, IdList, KV, Note, PageHead, Section, Stat, Table, Tag } from "@/components/lucie/ui";
import {
  ARTIFACT_RULES,
  CONSUMED_SOURCES,
  COUNTS,
  COVERAGE_CHECKS,
  PROTECTED_BASELINE_INVARIANT,
  SPINE_VERSION,
  STALE_STATEMENTS,
  TERMINOLOGY,
} from "@/lib/lucie";

export const Route = createFileRoute("/lucie/")({
  head: () => ({
    meta: [
      { title: "Lucie Traceability & Delivery Spine — ABox" },
      {
        name: "description",
        content:
          "The controlling spine for the ABox Lucie release: source authority, capability-to-module-to-surface traceability, nine delivery lanes, protected seams and launch gates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Lucie Traceability & Delivery Spine — ABox" },
      {
        property: "og:description",
        content:
          "Every Lucie capability resolved to a canonical module ID, IA v2.0 surface ID, delivery lane and launch gate.",
      },
    ],
  }),
  component: SpineOverview,
});

function SpineOverview() {
  return (
    <>
      <PageHead
        eyebrow="Execution artifact 1"
        title={SPINE_VERSION}
        lede="The spine is the attachment point for everything that follows: requirements, architecture, backlog and delivery artifacts all hang off these IDs. It renders the controlling registers rather than restating them, so no downstream artifact can quietly invent scope, drop a seam or relabel a module."
        right={<Id>{PROTECTED_BASELINE_INVARIANT}</Id>}
      />

      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Capabilities" value={COUNTS.capabilities} hint="LUC-CAP-###" />
        <Stat label="Canonical modules" value={COUNTS.modules} hint="M00–M26" />
        <Stat label="Lucie surfaces" value={COUNTS.surfaces} hint="IA v2.0 IDs" />
        <Stat label="Delivery lanes" value={COUNTS.workstreams} hint="WS-00 … WS-08" />
        <Stat label="Release slices" value={COUNTS.slices} hint="Integrated outcomes" />
        <Stat label="Protected seams" value={COUNTS.seams} hint="Never shown as built" />
        <Stat label="Launch gates" value={COUNTS.gates} hint="Activation control" />
        <Stat label="Open items" value={COUNTS.openItems} hint="Classified dependencies" />
        <Stat label="Legacy screens" value={COUNTS.legacyScreens} hint="Dispositioned" />
      </div>

      <Section
        title="Consumed source authority"
        id="SPINE-AUTHORITY"
        meta="Corrected SOURCE_HIERARCHY_AND_SUPERSESSION_NOTICE"
        description="Read in this order. Where an older README, guide, workbook, CSV, JSON or machine-context file conflicts with this hierarchy, the hierarchy wins and the stale statement is recorded rather than inherited."
      >
        <Table
          rows={CONSUMED_SOURCES}
          keyOf={(r) => r.id}
          columns={[
            { head: "#", cell: (r) => <span className="tabular-nums">{r.rank}</span> },
            {
              head: "Artifact",
              cell: (r) => (
                <>
                  <div className="font-medium">{r.artifact}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{r.version}</div>
                </>
              ),
            },
            { head: "Authority", cell: (r) => <Tag tone="info">{r.authority}</Tag> },
            { head: "Controls", cell: (r) => r.controls, className: "text-muted-foreground" },
          ]}
        />
        <Note tone="warn">
          Module 1 is the only protected detailed module baseline. M02 and M03 keep their stable
          module IDs and capability ownership, but their prior build packets are not protected,
          controlling or immutable. The June 2026 Product Architecture and Module Sequencing Pack is
          retired and carries no authority.
        </Note>
      </Section>

      <Section
        title="Rules every downstream artifact must satisfy"
        id="SPINE-RULES"
        meta={`${ARTIFACT_RULES.length} rules`}
      >
        <dl className="grid gap-0">
          {ARTIFACT_RULES.map((r) => (
            <KV key={r.id} k={r.id} v={r.rule} />
          ))}
        </dl>
      </Section>

      <Section
        title="Spine integrity checks"
        id="SPINE-CHECKS"
        meta="Computed from the registers, not asserted in prose"
        description="These run over the loaded registers every time the page renders. An attention state is a real gap in the spine, not a styling state."
      >
        <Table
          rows={COVERAGE_CHECKS}
          keyOf={(c) => c.id}
          columns={[
            { head: "ID", cell: (c) => <Id>{c.id}</Id> },
            { head: "Check", cell: (c) => <span className="font-medium">{c.check}</span> },
            {
              head: "Status",
              cell: (c) => (
                <Tag tone={c.status === "pass" ? "good" : "warn"}>
                  {c.status === "pass" ? "pass" : "attention"}
                </Tag>
              ),
            },
            { head: "Detail", cell: (c) => c.detail, className: "text-muted-foreground" },
          ]}
        />
      </Section>

      <Section
        title="Stale statements identified and not inherited"
        id="SPINE-STALE"
        meta={`${STALE_STATEMENTS.length} recorded`}
      >
        <Table
          rows={STALE_STATEMENTS}
          keyOf={(s) => s.id}
          columns={[
            { head: "ID", cell: (s) => <Id>{s.id}</Id> },
            { head: "Stale statement", cell: (s) => s.statement },
            { head: "Found in", cell: (s) => s.foundIn, className: "text-muted-foreground" },
            { head: "Disposition", cell: (s) => s.disposition },
          ]}
        />
      </Section>

      <Section title="Canonical terminology" id="SPINE-TERMS" meta="Applies to all new artifacts">
        <Table
          rows={TERMINOLOGY}
          keyOf={(t) => t.term}
          columns={[
            { head: "Legacy / variant term", cell: (t) => t.term },
            { head: "Canonical", cell: (t) => <IdList ids={[t.canonical]} /> },
            { head: "Rule", cell: (t) => t.rule, className: "text-muted-foreground" },
          ]}
        />
      </Section>
    </>
  );
}
