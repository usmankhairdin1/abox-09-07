/**
 * UX-019 — Agent Send Quote
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Send, Mail, MessageSquare, Link as LinkIcon, Calendar, Check } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_PLANS } from "@/lib/sample-data";
import { generateShareToken, saveSharedQuote } from "@/lib/shared-quote-store";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/send-quote")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-019"].name} — ABox` }, { name: "description", content: SCREENS["UX-019"].purpose }] }),
  component: Page,
});

function Page() {
  const [channel, setChannel] = useState<"email" | "sms" | "link">("email");
  const [selected, setSelected] = useState<Set<string>>(new Set(["plan-01","plan-02","plan-08"]));
  const [expires, setExpires] = useState("7");
  const [sentToken, setSentToken] = useState<string | null>(null);

  return (
    <InternalShell workspace="agent" pageTitle="Send quote" eyebrow="Selling · UX-019">
      {sentToken ? (
        <div className="rounded-2xl border border-sage/40 bg-sage-soft/40 p-6">
          <div className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 text-sage" />
            <div>
              <p className="font-medium">Quote sent to Renata Alvarez</p>
              <p className="mt-1 text-sm">
                Delivered via {channel === "email" ? "email" : channel === "sms" ? "SMS" : "shareable link"}. Expires in {expires} days.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Token: {sentToken}</p>
              <Link
                to="/shared/$token"
                params={{ token: sentToken }}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary story-link"
              >
                <LinkIcon className="h-3.5 w-3.5" /> Preview the recipient's view
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const token = generateShareToken();
            saveSharedQuote({
              token,
              planIds: Array.from(selected),
              recipientLabel: "Renata Alvarez",
              channel,
              createdAt: new Date().toISOString(),
              expiresInDays: Number(expires),
              agentName: "Elena Alvarez",
            });
            setSentToken(token);
          }}
          className="grid gap-6 lg:grid-cols-[1fr_360px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5">
              <p className="text-eyebrow">Recipient</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-xs text-muted-foreground">Lead</span>
                  <select className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3">
                    <option>Renata Alvarez · L-1042</option>
                    <option>Marcus Chen · L-1041</option>
                    <option>Priya Shah · L-1040</option>
                    <option>Jonah Beckett · L-1039</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="text-xs text-muted-foreground">Channel</span>
                  <div className="mt-1 grid grid-cols-3 gap-1 rounded-full bg-surface p-1">
                    {(["email","sms","link"] as const).map((c) => (
                      <button type="button" key={c} onClick={() => setChannel(c)}
                        aria-pressed={channel === c}
                        className={cn("inline-flex items-center justify-center gap-1 rounded-full py-1.5 text-xs",
                          channel === c ? "bg-card shadow-[var(--shadow-card)] font-medium" : "text-muted-foreground")}>
                        {c === "email" ? <Mail className="h-3.5 w-3.5" /> : c === "sms" ? <MessageSquare className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
                        {c === "email" ? "Email" : c === "sms" ? "SMS" : "Link"}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <p className="text-eyebrow">Plans in this quote</p>
                <span className="text-xs text-muted-foreground">{selected.size} selected</span>
              </div>
              <ul className="mt-3 divide-y divide-border">
                {SAMPLE_PLANS.slice(0, 8).map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox" checked={selected.has(p.id)}
                        onChange={() => setSelected((s) => {
                          const n = new Set(s); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n;
                        })}
                      />
                      <span>
                        <span className="font-medium">{p.name}</span>
                        <span className="ml-1 text-xs text-muted-foreground">· {p.carrier}</span>
                      </span>
                    </label>
                    <span className="tabular-nums">${p.monthlyPremium}/mo</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <p className="text-eyebrow">Message template</p>
              <textarea
                defaultValue={"Hi Renata,\n\nBased on what we talked about — keeping your PCP and prescription coverage — I put together three plans I'd focus on first. Take a look and let me know what you think.\n\nElena"}
                rows={7}
                className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                aria-label="Message body"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Merge fields available: {`{{firstName}}`}, {`{{planCount}}`}, {`{{expirationDate}}`}
              </p>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-eyebrow">Options</p>
                <label className="mt-3 block text-sm">
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Expires in</span>
                  <select value={expires} onChange={(e) => setExpires(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3">
                    <option value="3">3 days</option>
                    <option value="7">7 days (default)</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </label>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  <StatusBadge tone="primary">PlanAI attached</StatusBadge>
                  <StatusBadge tone="muted">Track opens</StatusBadge>
                  <StatusBadge tone="muted">Auto-nudge at T-48h</StatusBadge>
                </div>
                <button type="submit"
                  disabled={selected.size === 0}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60">
                  <Send className="h-4 w-4" /> Send quote
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Shared quotes are read-only. Recipient must register to add to a cart or start enrollment.
              </p>
            </div>
          </aside>
        </form>
      )}
    </InternalShell>
  );
}
