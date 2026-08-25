import { createFileRoute } from "@tanstack/react-router";

import { Id, IdList, Note, PageHead, PostureTag, Section, Table, Tag } from "@/components/lucie/ui";
import {
  ASSUMPTIONS,
  DECISIONS,
  GATES,
  IA_ACL_RULES,
  IA_CONFIG,
  MODULE_BY_ID,
  OPEN_ITEMS,
  PATHWAYS,
  RISKS,
  ROLE_BASELINE,
  SEAMS,
} from "@/lib/lucie";

export const Route = createFileRoute("/lucie/governance")({
  head: () => ({
    meta: [
      { title: "Lucie Governance Registers — Decisions, Seams, Gates, Open Items" },
      {
        name: "description",
        content:
          "Locked Lucie decisions, protected seam register, product pathway matrix, role and ACL baseline, configuration guardrails, launch gates, open dependencies, assumptions and risks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Lucie Governance Registers" },
      {
        property: "og:description",
        content:
          "The control surfaces the release is held to: seams that stay protected, gates that permit activation, and dependencies that are never invented.",
      },
    ],
  }),
  component: GovernancePage,
});

function GovernancePage() {
  return (
    <>
      <PageHead
        eyebrow="Control registers"
        title="Governance"
        lede="These registers are what makes a fast release safe to sell. Decisions are locked and change-controlled, seams stay protected, gates separate build completion from production activation, and open items are classified so nobody invents a carrier, a legal disclosure or a payment provider to unblock themselves."
        right={
          <>
            <Id>{`${SEAMS.length} seams`}</Id>
            <Id>{`${GATES.length} gates`}</Id>
          </>
        }
      />

      <Section
        title="Protected seam register"
        id="SPINE-SEAMS"
        meta={`${SEAMS.length} seams`}
        description="A seam keeps its ID, objects and interface boundary. Lucie never collapses the data model to fit a simplification, and never renders a seam as an available capability."
      >
        <Table
          rows={SEAMS}
          keyOf={(s) => s.seamId}
          columns={[
            {
              head: "Seam",
              cell: (s) => (
                <>
                  <Id>{s.seamId}</Id>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {s.moduleId} · {MODULE_BY_ID[s.moduleId]?.canonicalName ?? "module"}
                  </div>
                </>
              ),
            },
            {
              head: "Protected capability",
              cell: (s) => <span className="font-medium">{s.protectedCapability}</span>,
              className: "min-w-[190px]",
            },
            { head: "Lucie treatment", cell: (s) => s.lucieTreatment, className: "min-w-[220px]" },
            { head: "Rule", cell: (s) => s.rule, className: "text-muted-foreground min-w-[220px]" },
          ]}
        />
      </Section>

      <Section
        title="Product pathway matrix"
        id="SPINE-PATHWAYS"
        description="Enrollability is configuration per carrier and product — quote only, application plus PDF, or application plus EDI. The UI reads the binding; it never decides it."
      >
        <Table
          rows={PATHWAYS}
          keyOf={(p) => p.product}
          columns={[
            { head: "Product", cell: (p) => <span className="font-medium">{p.product}</span> },
            { head: "Channels", cell: (p) => p.channels, className: "text-muted-foreground" },
            { head: "Quote", cell: (p) => p.quote },
            { head: "PlanAI", cell: (p) => p.planai },
            { head: "Application", cell: (p) => p.application },
            { head: "Signature", cell: (p) => p.signature },
            { head: "Payment", cell: (p) => p.payment },
            { head: "Next path", cell: (p) => p.nextPath },
            {
              head: "Production gate",
              cell: (p) => p.productionGate,
              className: "text-muted-foreground min-w-[180px]",
            },
          ]}
        />
      </Section>

      <Section title="Launch gates" id="SPINE-GATES" meta="Build completion is not activation">
        <Table
          rows={GATES}
          keyOf={(g) => g.gateId}
          columns={[
            { head: "Gate", cell: (g) => <Id>{g.gateId}</Id> },
            { head: "Name", cell: (g) => <span className="font-medium">{g.gate}</span> },
            { head: "Criteria", cell: (g) => g.criteria, className: "min-w-[280px]" },
            {
              head: "Blocking",
              cell: (g) => <Tag tone={/yes|block/i.test(g.blocking) ? "stop" : "warn"}>{g.blocking}</Tag>,
            },
          ]}
        />
      </Section>

      <Section
        title="Open items by dependency class"
        id="SPINE-OPEN-ITEMS"
        meta={`${OPEN_ITEMS.length} items`}
        description="Classified so work continues without invention. Carriers, states, EDI layouts, carrier forms, acknowledgements, legal copy, NIPR behavior, pricing and payment providers are dependencies, never assumptions."
      >
        <Table
          rows={OPEN_ITEMS}
          keyOf={(o) => o.openItemId}
          columns={[
            { head: "ID", cell: (o) => <Id>{o.openItemId}</Id> },
            {
              head: "Topic",
              cell: (o) => (
                <>
                  <div className="font-medium">{o.topic}</div>
                  <div className="mt-0.5">{o.question}</div>
                </>
              ),
              className: "min-w-[240px]",
            },
            {
              head: "Why it matters",
              cell: (o) => o.whyItMatters,
              className: "text-muted-foreground min-w-[220px]",
            },
            { head: "Owner", cell: (o) => o.owner },
            { head: "Blocking stage", cell: (o) => <PostureTag posture={o.blockingStage} /> },
            { head: "Status", cell: (o) => o.status, className: "text-muted-foreground" },
          ]}
        />
      </Section>

      <Section
        title="Role and access baseline"
        id="SPINE-ROLES"
        meta={`${ROLE_BASELINE.length} role templates`}
      >
        <Table
          rows={ROLE_BASELINE}
          keyOf={(r) => r.roleId}
          columns={[
            {
              head: "Role",
              cell: (r) => (
                <>
                  <Id>{r.roleId}</Id>
                  <div className="mt-1 font-medium">{r.role}</div>
                </>
              ),
            },
            { head: "Scope", cell: (r) => r.scope, className: "min-w-[180px]" },
            { head: "Allowed", cell: (r) => r.allowed, className: "min-w-[220px]" },
            {
              head: "Restricted",
              cell: (r) => r.restricted,
              className: "text-muted-foreground min-w-[220px]",
            },
          ]}
        />
      </Section>

      <Section
        title="ACL rules (IA v2.0)"
        id="SPINE-ACL"
        description="Every rule is enforced server-side. The UI mirrors a decision; it never substitutes for one, and it fails closed."
      >
        <Table
          rows={IA_ACL_RULES}
          keyOf={(a) => a.aclId}
          columns={[
            { head: "ID", cell: (a) => <Id>{a.aclId}</Id> },
            { head: "Rule", cell: (a) => <span className="font-medium">{a.rule}</span> },
            { head: "Enforcement", cell: (a) => a.enforcement, className: "min-w-[260px]" },
            {
              head: "Decision point",
              cell: (a) => a.decisionPoint,
              className: "text-muted-foreground min-w-[220px]",
            },
          ]}
        />
      </Section>

      <Section
        title="Configuration guardrails (IA v2.0)"
        id="SPINE-CONFIG"
        description="Configuration has an owning module and an inheritance scope. Lucie limits what is configurable; it does not move where configuration lives."
      >
        <Table
          rows={IA_CONFIG}
          keyOf={(c) => c.configId}
          columns={[
            { head: "ID", cell: (c) => <Id>{c.configId}</Id> },
            {
              head: "Configuration",
              cell: (c) => <span className="font-medium">{c.configuration}</span>,
              className: "min-w-[180px]",
            },
            { head: "Inheritance scope", cell: (c) => c.inheritanceScope },
            { head: "Owner", cell: (c) => <IdList ids={[c.ownerModule]} /> },
            {
              head: "Guardrail",
              cell: (c) => c.guardrail,
              className: "text-muted-foreground min-w-[240px]",
            },
          ]}
        />
      </Section>

      <Section title="Locked decisions" id="SPINE-DECISIONS" meta={`${DECISIONS.length} decisions`}>
        <Table
          rows={DECISIONS}
          keyOf={(d) => d.decisionId}
          columns={[
            { head: "ID", cell: (d) => <Id>{d.decisionId}</Id> },
            {
              head: "Decision",
              cell: (d) => <span className="font-medium">{d.decision}</span>,
              className: "min-w-[230px]",
            },
            { head: "Rationale", cell: (d) => d.rationale, className: "min-w-[210px]" },
            {
              head: "Downstream impact",
              cell: (d) => d.downstreamImpact,
              className: "text-muted-foreground min-w-[210px]",
            },
            { head: "Status", cell: (d) => <PostureTag posture={d.status} /> },
            {
              head: "Change control",
              cell: (d) => d.changeControl,
              className: "text-muted-foreground",
            },
          ]}
        />
      </Section>

      <Section title="Assumptions recorded" id="SPINE-ASSUMPTIONS" meta="Non-blocking">
        <Table
          rows={ASSUMPTIONS}
          keyOf={(a) => a.assumptionId}
          columns={[
            { head: "ID", cell: (a) => <Id>{a.assumptionId}</Id> },
            { head: "Assumption", cell: (a) => a.assumption, className: "min-w-[280px]" },
            {
              head: "Impact if wrong",
              cell: (a) => a.impactIfWrong,
              className: "text-muted-foreground min-w-[240px]",
            },
          ]}
        />
      </Section>

      <Section title="Managed risks" id="SPINE-RISKS">
        <Table
          rows={RISKS}
          keyOf={(r) => r.riskId}
          columns={[
            { head: "ID", cell: (r) => <Id>{r.riskId}</Id> },
            {
              head: "Risk",
              cell: (r) => (
                <>
                  <div className="font-medium">{r.risk}</div>
                  <div className="mt-0.5">{r.description}</div>
                </>
              ),
              className: "min-w-[250px]",
            },
            { head: "Severity", cell: (r) => <PostureTag posture={r.severity} /> },
            { head: "Mitigation", cell: (r) => r.mitigation, className: "min-w-[230px]" },
            { head: "Status", cell: (r) => r.status, className: "text-muted-foreground" },
          ]}
        />
      </Section>

      <Note tone="info">
        Nothing on this page is advisory. A decision here changes what may be built; a gate here
        changes what may go live; an open item here is a real dependency with an owner.
      </Note>
    </>
  );
}
