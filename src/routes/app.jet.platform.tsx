/**
 * UI-M00-001 — governed M00 Platform Foundation surface.
 * Data is generated from the governed control store (see src/lib/m00-foundation.ts).
 */
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SURFACE_CLASSIFICATION } from "@/lib/lucie-release";
import { M00_SNAPSHOT, type M00Gate, type M00Risk, type M00OpenItem, type M00Screen } from "@/lib/m00-foundation";
import {
  M00_CHANGE_RECORDS, M00_ENVIRONMENTS, M00_PHASES,
  type ChangeRecord, type EnvRow,
} from "@/lib/m00-change-control";
import { ListChecks, ShieldCheck, Route as RouteIcon, GitBranch } from "lucide-react";

const title = "Platform Foundation";
const description = "Governed M00 delivery spine: gates, risks, change records, environments and open items.";

export const Route = createFileRoute("/app/jet/platform")({
  head: () => ({
    meta: [
      { title: `${title} — ABox` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — ABox` },
      { property: "og:description", content: description },
    ],
  }),
  component: Page,
});

const severityTone = (s: string) =>
  s === "CRITICAL" ? "destructive" : s === "HIGH" ? "warning" : s === "MEDIUM" ? "info" : "muted";

function Page() {
  const c = M00_SNAPSHOT.counts;

  const gateCols: Column<M00Gate>[] = [
    { key: "id", header: "Gate", cell: (r) => <code className="text-xs">{r.id}</code> },
    { key: "name", header: "Name", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "criteria", header: "Criteria", cell: (r) => <span className="text-xs text-muted-foreground">{r.criteria}</span>, className: "max-w-[420px]" },
    { key: "owner", header: "Owner", cell: (r) => <span className="text-xs">{r.owner}</span> },
    { key: "stage", header: "Blocking stage", cell: (r) => <span className="text-xs">{r.stage.replaceAll("_", " ").toLowerCase()}</span> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge tone="info">{r.status}</StatusBadge> },
  ];

  const changeCols: Column<ChangeRecord>[] = [
    { key: "id", header: "Record", cell: (r) => <code className="text-xs">{r.id}</code> },
    { key: "subject", header: "Subject", cell: (r) => <span className="font-medium">{r.subject}</span> },
    { key: "blocks", header: "Blocks", cell: (r) => <span className="text-xs">{r.blocks}</span> },
    { key: "decision", header: "Decision", cell: (r) => <code className="text-xs">{r.decision}</code> },
    { key: "disposition", header: "Disposition", cell: (r) => <span className="text-xs text-muted-foreground">{r.disposition}</span>, className: "max-w-[420px]" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge tone={r.status === "OPEN" ? "warning" : "sage"}>{r.status}</StatusBadge> },
  ];

  const envCols: Column<EnvRow>[] = [
    { key: "name", header: "Environment", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "purpose", header: "Purpose", cell: (r) => <span className="text-xs text-muted-foreground">{r.purpose}</span> },
    { key: "gate", header: "Required for", cell: (r) => <span className="text-xs">{r.gate}</span> },
    { key: "state", header: "State", cell: (r) => (
      <StatusBadge tone={r.state === "AVAILABLE" ? "sage" : "warning"}>{r.state.replace("_", " ")}</StatusBadge>
    ) },
  ];

  const riskCols: Column<M00Risk>[] = [
    { key: "id", header: "Risk", cell: (r) => <code className="text-xs">{r.id}</code> },
    { key: "title", header: "Title", cell: (r) => <span className="font-medium">{r.title}</span> },
    { key: "description", header: "Description", cell: (r) => <span className="text-xs text-muted-foreground">{r.description}</span>, className: "max-w-[420px]" },
    { key: "severity", header: "Severity", cell: (r) => <StatusBadge tone={severityTone(r.severity)}>{r.severity}</StatusBadge> },
    { key: "likelihood", header: "Likelihood", cell: (r) => <span className="text-xs">{r.likelihood}</span> },
    { key: "status", header: "Status", cell: (r) => <span className="text-xs">{r.status.replaceAll("_", " ").toLowerCase()}</span> },
  ];

  const openCols: Column<M00OpenItem>[] = [
    { key: "id", header: "Item", cell: (r) => <code className="text-xs">{r.id}</code> },
    { key: "topic", header: "Topic", cell: (r) => <span className="font-medium">{r.topic}</span> },
    { key: "question", header: "Question", cell: (r) => <span className="text-xs text-muted-foreground">{r.question}</span>, className: "max-w-[420px]" },
    { key: "owner", header: "Owner", cell: (r) => <span className="text-xs">{r.owner}</span> },
    { key: "stage", header: "Blocking stage", cell: (r) => <span className="text-xs">{r.stage.replaceAll("_", " ").toLowerCase()}</span> },
  ];

  const screenCols: Column<M00Screen>[] = [
    { key: "recordId", header: "Record", cell: (r) => <code className="text-xs">{r.recordId}</code> },
    { key: "name", header: "Screen", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "workspace", header: "Workspace", cell: (r) => <span className="text-xs">{r.workspace.replace("WS_", "").replaceAll("_", " ").toLowerCase()}</span> },
    { key: "purpose", header: "Purpose", cell: (r) => <span className="text-xs text-muted-foreground">{r.purpose}</span>, className: "max-w-[420px]" },
    { key: "status", header: "Status", cell: (r) => <StatusBadge tone="info">{r.status.replaceAll("_", " ")}</StatusBadge> },
  ];

  return (
    <InternalShell
      workspace="jet"
      pageTitle="Platform Foundation (M00)"
      eyebrow="Governance"
      actions={<StatusBadge tone="sage">Phase 1 complete</StatusBadge>}
    >
      <p className="mb-5 max-w-3xl text-sm text-muted-foreground">
        Governed control surface for the ABox Lucie M00 Platform Foundation baseline v1.1. Every figure below is
        generated from the controlled registers — this screen publishes the baseline, it never re-authors it.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Requirements" value={c.requirements} icon={ListChecks} tone="primary"
          hint={`${c.traceableRequirements}/${c.requirements} traceable`} />
        <KpiCard label="Acceptance criteria" value={c.acceptanceCriteria} icon={ShieldCheck} tone="default"
          hint={`${c.testScenarios} test scenarios`} />
        <KpiCard label="Contracts" value={c.apiOperations + c.eventContracts} icon={GitBranch} tone="sage"
          hint={`${c.apiOperations} API operations · ${c.eventContracts} events`} />
        <KpiCard label="Governed screens" value={c.screens} icon={RouteIcon} tone="warning"
          hint={`${c.gates} launch gates · ${c.tasks} tasks`} />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {M00_PHASES.map((p) => (
          <div key={p.id} className="rounded-xl border border-hairline bg-card p-4">
            <p className="text-eyebrow">{p.id}</p>
            <p className="mt-1 text-sm font-medium">{p.name}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <StatusBadge tone={p.status === "COMPLETE" ? "sage" : p.status === "READY" ? "info" : "muted"}>
                {p.status.replace("_", " ")}
              </StatusBadge>
              <code className="text-[10px] text-muted-foreground">{p.evidence}</code>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="change" className="w-full">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="change">Change control</TabsTrigger>
          <TabsTrigger value="env">Environments</TabsTrigger>
          <TabsTrigger value="gates">Launch gates</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="open">Open items</TabsTrigger>
          <TabsTrigger value="screens">Governed screens</TabsTrigger>
          <TabsTrigger value="surfaces">Surface classification</TabsTrigger>
        </TabsList>

        <TabsContent value="change">
          <DataTable columns={changeCols} rows={M00_CHANGE_RECORDS} getRowId={(r) => r.id} ariaLabel="M00 change and clarification records" />
        </TabsContent>
        <TabsContent value="env">
          <DataTable columns={envCols} rows={M00_ENVIRONMENTS} getRowId={(r) => r.name} ariaLabel="Environment separation" />
        </TabsContent>
        <TabsContent value="gates">
          <DataTable columns={gateCols} rows={[...M00_SNAPSHOT.gates]} getRowId={(r) => r.id} ariaLabel="Launch gates" />
        </TabsContent>
        <TabsContent value="risks">
          <DataTable columns={riskCols} rows={[...M00_SNAPSHOT.risks]} getRowId={(r) => r.id} ariaLabel="Risk register" />
        </TabsContent>
        <TabsContent value="open">
          <DataTable columns={openCols} rows={[...M00_SNAPSHOT.openItems]} getRowId={(r) => r.id} ariaLabel="Open item register" />
        </TabsContent>
        <TabsContent value="screens">
          <DataTable columns={screenCols} rows={[...M00_SNAPSHOT.screens]} getRowId={(r) => r.id} ariaLabel="Governed screen register" />
        </TabsContent>
        <TabsContent value="surfaces">
          <DataTable
            columns={[
              { key: "route", header: "Route", cell: (r) => <code className="text-xs">{r.route}</code> },
              { key: "name", header: "Screen", cell: (r) => r.name },
              { key: "klass", header: "Classification", cell: (r) => (
                <StatusBadge tone={r.klass === "m00-governance" ? "info" : "primary"}>
                  {r.klass === "m00-governance" ? "M00 governance" : "Lucie business"}
                </StatusBadge>
              ) },
              { key: "note", header: "Basis", cell: (r) => <span className="text-xs text-muted-foreground">{r.note}</span> },
            ]}
            rows={[...SURFACE_CLASSIFICATION]}
            getRowId={(r) => r.route}
            ariaLabel="M00 governance versus Lucie business surface classification"
          />
        </TabsContent>
      </Tabs>
    </InternalShell>
  );
}
