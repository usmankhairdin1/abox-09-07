import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell, useShell } from "@/components/shell/AppShell";
import {
  AclNote,
  Annotation,
  IdChip,
  PageHeading,
  Pill,
  WBox,
  WLine,
  WPanel,
  WRow,
} from "@/components/wireframe/primitives";
import { ROLES } from "@/lib/abox";

export const Route = createFileRoute("/object")({
  head: () => ({
    meta: [
      { title: "Object Page Framework — ABox Wireframe" },
      {
        name: "description",
        content:
          "Reusable ABox object page pattern: header, status, owner context, primary actions, summary, tabs, timeline, related records, notes, documents and permission-gated audit.",
      },
      { property: "og:title", content: "Object Page Framework — ABox Wireframe" },
      {
        property: "og:description",
        content:
          "One structural pattern reused by every ABox object page, demonstrated across lead, member, quote, application and agency records.",
      },
    ],
  }),
  component: ObjectPage,
});

interface ObjectType {
  id: string;
  name: string;
  status: string;
  tabs: string[];
  docs: boolean;
  actions: string[];
  protected?: string;
}

function ObjectPage() {
  const { labels, roleId } = useShell();
  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[1]!;

  const TYPES: ObjectType[] = [
    {
      id: "OBJ_LEAD",
      name: `${labels.lead} record`,
      status: "Working · Contacted",
      tabs: ["Overview", "Household", "Quotes", "Activity", "Notes", "Documents"],
      docs: true,
      actions: ["Quick quote", "Log activity", "Assign", "Convert"],
    },
    {
      id: "OBJ_MEMBER",
      name: `${labels.member} / household`,
      status: "Active coverage",
      tabs: ["Overview", "Household", "Coverage", "Applications", "Notes", "Documents"],
      docs: true,
      actions: ["Start quote", "Message", "Add dependent"],
    },
    {
      id: "OBJ_QUOTE",
      name: "Quote / cart",
      status: "Shared · awaiting consumer",
      tabs: ["Overview", "Plans in cart", "Comparison", "Share history", "Notes"],
      docs: false,
      actions: ["Resume", "Re-share", "Convert to application"],
      protected: "Module 1 protected — canvas content is frozen; only shell chrome is added.",
    },
    {
      id: "OBJ_APPLICATION",
      name: "Application / submission",
      status: "Submitted · pending carrier",
      tabs: ["Overview", "Applicants", "Answers", "Submission", "Notes", "Documents"],
      docs: true,
      actions: ["View submission", "Upload document", "Withdraw"],
      protected: "EDE handoff steps are Module 1 protected.",
    },
    {
      id: "OBJ_AGENCY",
      name: `${labels.agency} record`,
      status: "Active · 2 downlines",
      tabs: ["Overview", "Hierarchy", "Appointments & paper", "Commissions", "Users", "Notes"],
      docs: true,
      actions: ["Add downline", "Manage paper access", "Edit branding"],
    },
  ];

  const [typeId, setTypeId] = useState("OBJ_LEAD");
  const obj = TYPES.find((t) => t.id === typeId) ?? TYPES[0]!;
  const tabs = role.audit ? [...obj.tabs, "Audit"] : obj.tabs;
  const [tab, setTab] = useState("Overview");
  const activeTab = tabs.includes(tab) ? tab : "Overview";

  return (
    <AppShell
      drawerTitle={`${obj.name} context`}
      assistantContext="this record"
      drawerBody={{
        Summary: (
          <div className="space-y-2">
            <Annotation>Drawer mirrors the object summary so it stays visible while scrolling.</Annotation>
            {["Status", "Owner", "Entity", "Created", "Last activity", "Attribution"].map((f) => (
              <div key={f} className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
                <span className="text-[11px] text-muted-foreground">{f}</span>
                <WLine w="45%" />
              </div>
            ))}
          </div>
        ),
        "Next actions": (
          <div className="space-y-2">
            {obj.actions.map((a) => (
              <div key={a} className="rounded-md border border-border px-2 py-1.5 text-[11px]">
                {a}
              </div>
            ))}
            <Annotation>Only actions the role can perform are listed.</Annotation>
          </div>
        ),
      }}
    >
      <PageHeading
        eyebrow="Reusable page pattern"
        title="Object page framework"
        id="PATTERN_OBJECT_PAGE"
        description="One structural pattern every object page in ABox reuses. Switch the object type to confirm the frame holds while header fields, tabs and actions change."
        actions={<Pill>Applies to all 43 objects</Pill>}
      />

      <WPanel title="Object type" id="PATTERN_OBJECT_SWITCH" meta="Wireframe control — proves reuse rather than five bespoke layouts">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTypeId(t.id)}
              className={`rounded-md border px-3 py-1.5 text-xs ${
                t.id === typeId ? "border-foreground/50 bg-muted font-medium" : "border-border hover:bg-muted"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        {obj.protected ? <Annotation className="mt-2">{obj.protected}</Annotation> : null}
      </WPanel>

      {/* header */}
      <section className="rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="size-9 rounded-full bg-muted" aria-hidden="true" />
              <h2 className="text-base font-semibold">{obj.name}</h2>
              <IdChip>{obj.id}</IdChip>
              <Pill>{obj.status}</Pill>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span>Record ID · placeholder</span>
              <span>External / carrier ID · placeholder</span>
              <span>Owner · assigned {labels.agent.toLowerCase()}</span>
              <span>Entity · current {labels.agency.toLowerCase()}</span>
              <span>Workspace context · current</span>
              <span>Attribution · source and referral</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {obj.actions.map((a) => (
              <Pill key={a}>{a}</Pill>
            ))}
            <Pill>More…</Pill>
          </div>
        </div>

        {/* summary */}
        <div className="grid gap-3 border-b border-border p-4 md:grid-cols-4">
          {["Key fields", "Status detail", "Dates", "Flags & exceptions"].map((g) => (
            <div key={g} className="rounded-md border border-dashed border-border bg-muted/25 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{g}</p>
              <div className="mt-2 space-y-1.5">
                <WLine w="80%" />
                <WLine w="60%" />
                <WLine w="70%" />
              </div>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="flex flex-wrap gap-1 border-b border-border px-3 py-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md border px-2.5 py-1.5 text-xs ${
                t === activeTab ? "border-border bg-muted font-medium" : "border-transparent text-muted-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <WPanel title={`${activeTab} section`} id="PATTERN_SECTION" meta="Section content is defined per object type in a later batch">
                <div className="grid gap-2 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-md border border-border p-2.5">
                      <WLine w="40%" className="h-1.5 bg-muted/70" />
                      <WLine w="75%" className="mt-2" />
                    </div>
                  ))}
                </div>
              </WPanel>

              <WPanel title="Timeline" id="PATTERN_TIMELINE" meta="Event stream from the platform event model — same source as reporting">
                <div className="space-y-3">
                  {["Created", "Quote started", "Shared", "Application submitted", "Document uploaded"].map(
                    (e) => (
                      <div key={e} className="flex gap-3">
                        <div className="mt-1 size-2 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden="true" />
                        <div className="flex-1 border-b border-border/60 pb-2">
                          <p className="text-xs font-medium">{e}</p>
                          <WLine w="55%" className="mt-1.5 h-1.5 bg-muted/70" />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </WPanel>

              <WPanel title="Notes" id="PATTERN_NOTES" meta="Internal notes; visibility scoped to entity, never shown to consumers">
                <WBox className="h-16" label="add a note" />
                <div className="mt-2">
                  <WRow /> <WRow />
                </div>
              </WPanel>

              {obj.docs ? (
                <WPanel title="Documents" id="PATTERN_DOCS" meta="Uploads, generated outputs and carrier artefacts">
                  <WRow trailing={<Pill>Download</Pill>} />
                  <WRow trailing={<Pill>Download</Pill>} />
                  <Annotation className="mt-2">
                    Documents tab appears only for object types that carry artefacts.
                  </Annotation>
                </WPanel>
              ) : null}

              {activeTab === "Audit" ? (
                <WPanel title="Audit" id="PATTERN_AUDIT" meta="Who changed what and when, including impersonation events">
                  <WRow /> <WRow /> <WRow />
                  <Annotation className="mt-2">
                    Tab exists only for roles with audit permission. Export is separately permissioned
                    and itself audited.
                  </Annotation>
                </WPanel>
              ) : null}
            </div>

            <div className="space-y-3">
              <WPanel title="Related records" id="PATTERN_RELATED" meta="Follows the relationship graph, not free-form links">
                {["Household members", "Quotes", "Applications", `Owning ${labels.agency.toLowerCase()}`, "Referral source"].map(
                  (r) => (
                    <div key={r} className="border-b border-border/60 py-2 last:border-b-0">
                      <p className="text-xs">{r}</p>
                      <WLine w="55%" className="mt-1.5 h-1.5 bg-muted/70" />
                    </div>
                  ),
                )}
              </WPanel>

              <WPanel title="Owner & context" id="PATTERN_OWNER">
                {["Assigned to", "Entity", "Workspace", "Attribution", "Sensitivity"].map((f) => (
                  <div key={f} className="flex items-center justify-between gap-2 border-b border-border/60 py-2 last:border-b-0">
                    <span className="text-[11px] text-muted-foreground">{f}</span>
                    <WLine w="45%" />
                  </div>
                ))}
              </WPanel>
            </div>
          </div>
        </div>
      </section>

      <AclNote>
        Access requires entity scope plus object permission. Sensitive fields (SSN, income, health
        answers) render masked with an unmask action that requires a reason and is logged. Actions are
        additionally gated by licensing, appointment and paper access — an unappointed{" "}
        {labels.agent.toLowerCase()} sees the record but not the submit action.
      </AclNote>
    </AppShell>
  );
}
