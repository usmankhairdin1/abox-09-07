import { createFileRoute } from "@tanstack/react-router";

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

export const Route = createFileRoute("/my-work")({
  head: () => ({
    meta: [
      { title: "My Work — ABox Wireframe" },
      {
        name: "description",
        content:
          "Low-fidelity wireframe of the ABox My Work landing page: tasks, leads, follow-ups, quotes in progress, handoffs, exceptions and AI suggested next actions.",
      },
      { property: "og:title", content: "My Work — ABox Wireframe" },
      {
        property: "og:description",
        content:
          "Structure-only wireframe of the ABox My Work landing page with a configurable landing preference.",
      },
    ],
  }),
  component: MyWorkPage,
});

const LANDING_OPTIONS = [
  { to: "/my-work", label: "My Work" },
  { to: "/dashboard", label: "Dashboards & Analytics" },
  { to: "/object", label: "Customers & Leads" },
  { to: "/admin", label: "Admin & Configuration" },
];

function MyWorkPage() {
  const { labels, landing, setLanding } = useShell();

  const cards: { id: string; title: string; count: string; rows: number; note: string }[] = [
    {
      id: "SCR_MY_WORK_TASKS",
      title: "My tasks",
      count: "11 open · 3 overdue",
      rows: 4,
      note: "Task type, due date, related object, owner.",
    },
    {
      id: "SCR_MY_WORK_LEADS",
      title: `Assigned ${labels.lead.toLowerCase()}s`,
      count: "24 assigned · 6 new today",
      rows: 4,
      note: `Only ${labels.lead.toLowerCase()}s assigned to me or my downline appear here.`,
    },
    {
      id: "SCR_MY_WORK_FOLLOWUP",
      title: "Follow-ups due",
      count: "9 today · 14 this week",
      rows: 3,
      note: "Cadence set by agency-configured follow-up rules.",
    },
    {
      id: "SCR_MY_WORK_MSGS",
      title: "Messages",
      count: "5 unread",
      rows: 3,
      note: "Inbound consumer replies across email, SMS and in-app.",
    },
    {
      id: "SCR_MY_WORK_QUOTES",
      title: "Quotes in progress",
      count: "17 active · 4 shared",
      rows: 4,
      note: "Includes shared quotes awaiting consumer action (Module 1 objects, read only here).",
    },
    {
      id: "SCR_MY_WORK_HANDOFF",
      title: "Applications & handoffs needing action",
      count: "7 waiting",
      rows: 4,
      note: "Includes EDE handoff returns and off-exchange submissions awaiting a step.",
    },
    {
      id: "SCR_MY_WORK_EXCEPTIONS",
      title: "Exceptions",
      count: "3 blocking · 5 warnings",
      rows: 3,
      note: "Sellability, licensing, appointment, paper access and data validation failures.",
    },
  ];

  return (
    <AppShell drawerTitle="My Work context" assistantContext="your work queue">
      <PageHeading
        eyebrow="My Work"
        title="My Work landing"
        id="SCR_MY_WORK"
        description="The default landing page for internal users. Everything shown is scoped to the current workspace, entity and assignment — it is a personal queue, not an agency report."
        actions={<Pill>P1-Build · provisional screen</Pill>}
      />

      <WPanel
        title="Landing preference"
        id="SCR_USER_PREFS"
        meta="Users choose where they land; admins set the tenant default and can lock it"
      >
        <div className="flex flex-wrap items-center gap-2">
          {LANDING_OPTIONS.map((o) => (
            <button
              key={o.to}
              type="button"
              onClick={() => setLanding(o.to)}
              className={`rounded-md border px-3 py-1.5 text-xs ${
                landing === o.to
                  ? "border-foreground/50 bg-muted font-medium"
                  : "border-border hover:bg-muted"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <Annotation className="mt-2">
          Current preference: {landing}. Stored per user. Options are limited to modules the role
          can actually reach.
        </Annotation>
      </WPanel>

      <WPanel
        title="AI suggested next actions"
        id="SCR_MY_WORK_AI"
        meta="Overlay, not a separate module — suggestions always cite the record they came from"
      >
        <div className="grid gap-2 md:grid-cols-3">
          {[
            "3 shared quotes expire in 48 hours — send a reminder",
            "2 applications blocked on missing income documents",
            "5 renewals with no follow-up in 14 days",
          ].map((s) => (
            <div key={s} className="rounded-md border border-dashed border-border bg-muted/30 p-3">
              <p className="text-xs text-foreground/80">{s}</p>
              <div className="mt-2 flex gap-1.5">
                <Pill>Act</Pill>
                <Pill>Dismiss</Pill>
                <Pill>Why this?</Pill>
              </div>
            </div>
          ))}
        </div>
        <Annotation className="mt-2">
          Suggestions respect ACL: an action is only offered when the user could perform it
          manually. Every suggestion is logged for governance review.
        </Annotation>
      </WPanel>

      <div className="grid gap-3 lg:grid-cols-2">
        {cards.map((c) => (
          <WPanel
            key={c.id}
            title={c.title}
            id={c.id}
            meta={c.count}
            actions={<Pill>View all</Pill>}
          >
            <div className="flex flex-wrap gap-1.5 pb-2">
              {["All", "Mine", "Overdue", "Today"].map((f) => (
                <Pill key={f}>{f}</Pill>
              ))}
            </div>
            {Array.from({ length: c.rows }).map((_, i) => (
              <WRow key={i} trailing={<Pill>Action</Pill>} />
            ))}
            <Annotation className="mt-2">{c.note}</Annotation>
          </WPanel>
        ))}

        <WPanel
          title="Configurable widget slot"
          id="SCR_MY_WORK_SLOT"
          meta="Admins add or hide cards per workspace and role"
        >
          <WBox className="h-28" label="empty widget slot" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <WLine w="70%" />
            <WLine w="50%" />
          </div>
        </WPanel>
      </div>

      <AclNote>
        Rows are limited to records the user owns or inherits through the relationship graph.
        Commission-bearing counts are hidden when the commission visibility flag is off for the
        role. Sensitive consumer fields render masked in queue rows and unmask only on the object
        page with a logged reason.
      </AclNote>
    </AppShell>
  );
}
