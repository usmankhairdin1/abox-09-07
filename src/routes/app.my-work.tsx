import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell, useShell } from "@/components/shell/AppShell";
import { StatusBadge } from "@/components/abox/status-badge";
import { PageHeading } from "@/components/wireframe/primitives";
import { Button } from "@/components/ui/button";
import { TASKS, PRIORITY_WORK, RECENT_ACTIVITY } from "@/lib/workspace-data";

export const Route = createFileRoute("/app/my-work")({
  head: () => ({
    meta: [
      { title: "My Work — Agency in a Box" },
      {
        name: "description",
        content:
          "Your daily queue in ABox: tasks, assigned leads, follow-ups, quotes in progress, handoffs and exceptions.",
      },
      { property: "og:title", content: "My Work — Agency in a Box" },
      {
        property: "og:description",
        content: "Everything assigned to you today, with a configurable landing preference.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyWorkPage,
});

const LANDING_OPTIONS = [
  { to: "/app/my-work", label: "My Work" },
  { to: "/app/dashboard", label: "Dashboards & Analytics" },
  { to: "/app/object", label: "Customers & Leads" },
  { to: "/app/admin", label: "Admin & Configuration" },
];

const QUEUES = ["All", "Applications", "Leads", "Renewals", "Appointments"] as const;

const STATUS_TONE = {
  Open: "warning",
  "In progress": "primary",
  Blocked: "destructive",
  Done: "sage",
} as const;

function MyWorkPage() {
  const { labels, landing, setLanding } = useShell();
  const [queue, setQueue] = useState<(typeof QUEUES)[number]>("All");

  const rows = TASKS.filter((t) => queue === "All" || t.queue === queue);

  return (
    <AppShell drawerTitle="Work context" assistantContext="your work queue">
      <PageHeading
        eyebrow="My Work"
        title="Today's queue"
        id="SCR_MY_WORK"
        description={`Everything assigned to you across tasks, ${labels.lead.toLowerCase()}s, applications and renewals.`}
        actions={
          <Button className="rounded-full" asChild>
            <Link to="/quote" search={{ step: 1 }}>Start a quote</Link>
          </Button>
        }
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Open tasks", String(TASKS.filter((t) => t.status !== "Done").length), "3 overdue"],
          ["Assigned leads", "24", "6 new today"],
          ["Quotes in progress", "9", "2 expiring this week"],
        ].map(([label, value, hint]) => (
          <div key={label} className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
            <p className="text-eyebrow">{label}</p>
            <p className="text-display mt-2 text-3xl tabular-nums">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-display text-2xl">Tasks</h2>
          <div className="flex flex-wrap gap-2">
            {QUEUES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQueue(q)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  queue === q ? "border-primary bg-primary text-primary-foreground" : "border-hairline hover:bg-accent/60"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-hairline bg-card shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-muted-foreground">
                <th className="px-5 py-3 font-medium">Task</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Queue</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-hairline last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3.5 font-medium">{t.title}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.customer}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.queue}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.due}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.owner}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge tone={STATUS_TONE[t.status]}>{t.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-hairline bg-card p-6 shadow-card">
          <h2 className="text-display text-xl">Suggested next actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">PlanAI ranks by deadline and placement impact</p>
          <div className="mt-4">
            {PRIORITY_WORK.map((p) => (
              <div key={p.title} className="border-b border-hairline py-3.5 last:border-0">
                <p className="text-sm font-medium">{p.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-hairline bg-card p-6 shadow-card">
          <h2 className="text-display text-xl">Recent activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">Across your book of business</p>
          <div className="mt-4">
            {RECENT_ACTIVITY.map((a) => (
              <div key={`${a.event}-${a.subject}`} className="flex items-center justify-between border-b border-hairline py-3.5 last:border-0">
                <div>
                  <p className="text-sm font-medium">{a.event}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{a.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-2xl border border-hairline bg-card p-6 shadow-card">
        <h2 className="text-display text-xl">Landing preference</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the page you land on after signing in.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {LANDING_OPTIONS.map((o) => (
            <button
              key={o.to}
              type="button"
              onClick={() => setLanding(o.to)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                landing === o.to ? "border-primary bg-primary text-primary-foreground" : "border-hairline hover:bg-accent/60"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
