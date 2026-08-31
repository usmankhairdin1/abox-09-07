import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { MemberShell } from "@/components/abox/member-shell";
import { PageHeader } from "@/components/abox/page-header";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_MESSAGES } from "@/lib/sample-data-ext";

export const Route = createFileRoute("/member/messages")({
  head: () => ({ meta: [{ title: "Messages — ABox Member" }, { name: "description", content: "Messages between you and your agent." }] }),
  component: Page,
});

function Page() {
  return (
    <MemberShell>
      <PageHeader eyebrow="Inbox" title="Messages" description="From your agent, and shared quote nudges." />
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {SAMPLE_MESSAGES.map((m) => (
          <li key={m.id} className="flex items-start gap-3 px-5 py-4">
            <Mail className="mt-1 h-4 w-4 text-muted-foreground" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{m.person}</p>
                <span className="text-xs text-muted-foreground">{m.ago}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{m.snippet}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <StatusBadge tone="muted">{m.channel}</StatusBadge>
                {m.unread && <StatusBadge tone="primary">Unread</StatusBadge>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </MemberShell>
  );
}
