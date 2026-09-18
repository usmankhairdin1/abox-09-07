/**
 * SCR_APP_COMMUNICATIONS — Unified inbox
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Bell, Send } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_MESSAGES } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/communications")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_APP_COMMUNICATIONS.name} — ABox` }, { name: "description", content: SCREENS.SCR_APP_COMMUNICATIONS.purpose }] }),
  component: Page,
});

function Page() {
  const [active, setActive] = useState(SAMPLE_MESSAGES[0]?.id ?? null);
  const [filter, setFilter] = useState<"all" | "email" | "sms" | "in-app">("all");
  const list = SAMPLE_MESSAGES.filter((m) => filter === "all" || m.channel === filter);
  const current = SAMPLE_MESSAGES.find((m) => m.id === active);

  return (
    <InternalShell workspace="agent" pageTitle="Communications" eyebrow="Inbox">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-3">
          <div className="grid grid-cols-4 gap-1 rounded-full bg-surface p-1 text-xs">
            {(["all","email","sms","in-app"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
                className={cn("rounded-full py-1.5", filter === f ? "bg-card font-medium shadow-[var(--shadow-card)]" : "text-muted-foreground")}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {list.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => setActive(m.id)}
                  className={cn("block w-full px-4 py-3 text-left text-sm hover:bg-accent",
                    active === m.id && "bg-primary-soft/40")}
                  aria-pressed={active === m.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{m.person}</p>
                    <span className="text-[10px] text-muted-foreground">{m.ago}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{m.snippet}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <StatusBadge tone="muted">
                      {m.channel === "email" ? <Mail className="h-3 w-3" /> : m.channel === "sms" ? <MessageSquare className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                      {m.channel}
                    </StatusBadge>
                    {m.unread && <StatusBadge tone="primary">Unread</StatusBadge>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={surfaceClass()}>
          {current ? (
            <>
              <header className="flex items-baseline justify-between">
                <div>
                  <p className="text-eyebrow">{current.channel}</p>
                  <h2 className="text-display mt-1 text-2xl">{current.person}</h2>
                </div>
                <span className="text-xs text-muted-foreground">{current.ago}</span>
              </header>
              <p className="mt-5 whitespace-pre-line text-sm">{current.snippet}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Continued: this is a placeholder message body. In production it renders the full thread.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-6 rounded-xl border border-border bg-surface/60 p-3">
                <textarea
                  rows={4} placeholder="Type a reply…"
                  className="w-full resize-none bg-transparent outline-none placeholder:text-muted-foreground"
                  aria-label="Reply"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    Templates: <button className="story-link text-primary">Subsidy recap</button> · <button className="story-link text-primary">Book call</button>
                  </div>
                  <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
                    <Send className="h-4 w-4" /> Send reply
                  </button>
                </div>
              </form>
            </>
          ) : (
            <p className="text-muted-foreground">Select a conversation to view.</p>
          )}
        </section>
      </div>
    </InternalShell>
  );
}
