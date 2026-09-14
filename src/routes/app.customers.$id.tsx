/**
 * UX-021 — Lead Timeline & Milestones (Lead detail)
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Send, Phone, FileText, CheckCircle2 } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_TIMELINE } from "@/lib/sample-data";
import { SAMPLE_TASKS, SAMPLE_MESSAGES } from "@/lib/sample-data-ext";
import { useLeadState, getLeads, getLead } from "@/lib/lead-store";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/customers/$id")({
  loader: ({ params }) => ({ id: params.id }),
  head: ({ params }) => ({
    meta: [
      { title: `Lead — ${params.id} — ABox` },
      { name: "description", content: SCREENS["UX-021"].purpose },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useLoaderData();
  const leadState = useLeadState();
  const lead = getLead(leadState, id);

  if (!lead) {
    return (
      <InternalShell workspace="agent" pageTitle="Lead not found" eyebrow="Relationships">
        <p>That lead doesn't exist. <Link to="/app/customers" className="story-link text-primary">Back to leads</Link></p>
      </InternalShell>
    );
  }

  const leadTasks = SAMPLE_TASKS.filter((t) => t.leadName === lead.name);
  const leadMsgs = SAMPLE_MESSAGES.filter((m) => m.person.includes(lead.name.split(" ")[0]));
  const leadTimeline = SAMPLE_TIMELINE.filter((e) => e.leadName === lead.name);
  const duplicates = getLeads(leadState).filter(
    (l) => l.id !== lead.id && l.name.trim().toLowerCase() === lead.name.trim().toLowerCase(),
  );

  return (
    <InternalShell workspace="agent" eyebrow={`Lead · ${lead.id}`} pageTitle={lead.name}
      actions={
        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm">
            <Phone className="h-4 w-4" /> Log call
          </button>
          <Link to="/app/send-quote" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
            <Send className="h-4 w-4" /> Send quote
          </Link>
        </div>
      }
    >
      <aside className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="contents text-sm">
          <div>
            <p className="text-eyebrow">Stage</p>
            <StatusBadge tone={lead.stage === "Enrolled" ? "sage" : lead.stage === "Shared" ? "info" : "primary"}>{lead.stage}</StatusBadge>
          </div>
          <div>
            <p className="text-eyebrow">Product</p>
            <p>{lead.product}</p>
          </div>
          <div>
            <p className="text-eyebrow">Owner</p>
            <p>{lead.agent}</p>
          </div>
          <div>
            <p className="text-eyebrow">Duplicate check</p>
            {duplicates.length === 0 ? (
              <StatusBadge tone="sage">No duplicates found</StatusBadge>
            ) : (
              <div className="space-y-1.5">
                <StatusBadge tone="warning">{duplicates.length} possible match{duplicates.length > 1 ? "es" : ""}</StatusBadge>
                <ul className="space-y-1 text-xs">
                  {duplicates.map((d) => (
                    <li key={d.id}>
                      <Link to="/app/customers/$id" params={{ id: d.id }} className="story-link text-primary">
                        {d.name} · {d.id}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        </div>
      </aside>

      <Link to="/app/customers" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>

      <div className="grid gap-4 md:grid-cols-4">
        <Milestone label="Created" done />
        <Milestone label="Contacted" done={lead.stage !== "New"} />
        <Milestone label="Quoted"    done={["Quoted","Shared","Enrolled"].includes(lead.stage)} />
        <Milestone label="Enrolled"  done={lead.stage === "Enrolled"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-border bg-card">
          <header className="border-b border-border px-5 py-3">
            <h2 className="text-display text-2xl">Timeline</h2>
          </header>
          <ol className="divide-y divide-border">
            {leadTimeline.length === 0 && (
              <li className="px-5 py-3 text-sm text-muted-foreground">No timeline events yet.</li>
            )}
            {leadTimeline.map((e) => (
              <li key={e.id} className="grid grid-cols-[120px_1fr] gap-4 px-5 py-3 text-sm">
                <div className="text-xs text-muted-foreground">{e.when}</div>
                <div>
                  <p className="font-medium">{e.summary}</p>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {e.actor} · {e.eventType}
                    {e.planO && <span className="ml-2 inline-flex items-center gap-0.5 text-primary"><Sparkles className="h-3 w-3" /> PlanAI</span>}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card">
            <header className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="text-display text-xl">Tasks</h2>
              <span className="text-xs text-muted-foreground">{leadTasks.length}</span>
            </header>
            <ul className="divide-y divide-border">
              {leadTasks.length === 0 && <li className="px-5 py-3 text-sm text-muted-foreground">No tasks yet.</li>}
              {leadTasks.map((t) => (
                <li key={t.id} className="px-5 py-3 text-sm">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.due}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <header className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="text-display text-xl">Messages</h2>
              <span className="text-xs text-muted-foreground">{leadMsgs.length}</span>
            </header>
            <ul className="divide-y divide-border">
              {leadMsgs.length === 0 && <li className="px-5 py-3 text-sm text-muted-foreground">No messages yet.</li>}
              {leadMsgs.map((m) => (
                <li key={m.id} className="px-5 py-3 text-sm">
                  <p className="text-xs text-muted-foreground">{m.channel} · {m.ago}</p>
                  <p className="mt-0.5 line-clamp-2">{m.snippet}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <header className="mb-2 flex items-center justify-between">
              <h2 className="text-display text-xl">Documents</h2>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </header>
            <p className="text-sm text-muted-foreground">Quotes and shared links appear here as PDFs.</p>
          </section>
        </div>
      </div>
    </InternalShell>
  );
}

function Milestone({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className={"rounded-2xl border p-4 " + (done ? "border-sage/40 bg-sage-soft/40" : "border-border bg-card")}>
      <div className="flex items-center gap-2">
        <CheckCircle2 className={"h-4 w-4 " + (done ? "text-sage" : "text-muted-foreground")} aria-hidden />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{done ? "Complete" : "Pending"}</p>
    </div>
  );
}
