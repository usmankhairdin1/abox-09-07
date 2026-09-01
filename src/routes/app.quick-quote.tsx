/**
 * UX-017 / UX-018 — Agent Quick Quote
 * Start anonymous prospect quote or find existing lead. Compact input
 * with results panel, Plan-AI assist, and send/add/request-follow-up.
 */
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Sparkles, ArrowRight, Send, Plus, UserSearch, Phone } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { PlanCard } from "@/components/abox/plan-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_PLANS, planMatchScore, type PlanMatchInputs } from "@/lib/sample-data";
import { useLeadState, getLeads } from "@/lib/lead-store";
import { cartStore, useCart } from "@/lib/cart-store";
import type { PriorityKey } from "@/lib/quote-store";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

const PRIORITY_OPTIONS = ["Keep my doctor", "Low premium", "Low deductible", "Prescription coverage", "Broad network", "HSA eligibility"] as const;
const PRIORITY_TO_KEY: Record<(typeof PRIORITY_OPTIONS)[number], PriorityKey> = {
  "Keep my doctor": "doctor",
  "Low premium": "premium",
  "Low deductible": "deductible",
  "Prescription coverage": "rx",
  "Broad network": "network",
  "HSA eligibility": "hsa",
};

export const Route = createFileRoute("/app/quick-quote")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-017"].name} — ABox` }, { name: "description", content: SCREENS["UX-017"].purpose }] }),
  component: Page,
});

function Page() {
  const [tab, setTab] = useState<"new" | "find">("new");
  const [zip, setZip] = useState("30301");
  const [hh, setHh] = useState(2);
  const [priority, setPriority] = useState<(typeof PRIORITY_OPTIONS)[number]>("Keep my doctor");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const cart = useCart();
  const leadState = useLeadState();
  const filtered = useMemo(() => getLeads(leadState).filter((l) => l.name.toLowerCase().includes(search.toLowerCase())), [leadState, search]);
  const plans = SAMPLE_PLANS.slice(0, 6);
  const matchInputs: PlanMatchInputs = { priorities: [PRIORITY_TO_KEY[priority]], usage: undefined, keepDoctor: priority === "Keep my doctor" };

  return (
    <InternalShell workspace="agent" pageTitle="Quick Quote" eyebrow="Selling"
      actions={
        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm">
            Save draft
          </button>
          <Link
            to="/app/send-quote"
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground",
              selected.size === 0 && "opacity-60 pointer-events-none",
            )}
          >
            <Send className="h-4 w-4" /> Send quote ({selected.size})
          </Link>
        </div>
      }
    >
      <RightSummary zip={zip} hh={hh} priority={priority} selected={selected.size} />

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-surface p-1 sm:max-w-md">
        <button onClick={() => setTab("new")} aria-pressed={tab === "new"}
          className={cn("inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-sm",
            tab === "new" ? "bg-card shadow-[var(--shadow-card)] font-medium" : "text-muted-foreground")}>
          <Plus className="h-4 w-4" /> New quote
        </button>
        <button onClick={() => setTab("find")} aria-pressed={tab === "find"}
          className={cn("inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-sm",
            tab === "find" ? "bg-card shadow-[var(--shadow-card)] font-medium" : "text-muted-foreground")}>
          <UserSearch className="h-4 w-4" /> Find existing lead
        </button>
      </div>

      {tab === "find" ? (
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads by name, ID, or phone…"
              className="h-11 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search leads"
            />
          </div>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {filtered.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.id} · {l.product} · {l.stage}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Updated {l.updatedAgo}</span>
                  <Link to="/app/customers/$id" params={{ id: l.id }} className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent">
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section aria-label="Quote inputs" className="rounded-2xl border border-border bg-card p-5">
            <p className="text-eyebrow">Quote inputs</p>
            <div className="mt-3 space-y-3">
              <label className="block text-sm">
                <span className="text-xs text-muted-foreground">ZIP</span>
                <input value={zip} onChange={(e) => setZip(e.target.value)} inputMode="numeric" maxLength={5}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring tabular-nums" />
              </label>
              <label className="block text-sm">
                <span className="text-xs text-muted-foreground">Household size</span>
                <input type="number" min={1} max={10} value={hh} onChange={(e) => setHh(Number(e.target.value))}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring tabular-nums" />
              </label>
              <label className="block text-sm">
                <span className="text-xs text-muted-foreground">Top priority</span>
                <select value={priority} onChange={(e) => setPriority(e.target.value as (typeof PRIORITY_OPTIONS)[number])}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring">
                  {PRIORITY_OPTIONS.map((o) =>
                    <option key={o}>{o}</option>)}
                </select>
              </label>
              <button className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-medium text-primary-foreground">
                Run Plan-AI <Sparkles className="h-4 w-4" />
              </button>
              <div className="mt-3 rounded-xl bg-primary-soft/40 p-3 text-xs text-primary">
                <p className="font-medium">Plan-AI assist</p>
                <p className="mt-1 text-foreground/80">Prioritizing PPO + Tier 1 Rx. 6 plans match strongly.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
                <StatusBadge tone="muted">ZIP {zip}</StatusBadge>
                <StatusBadge tone="muted">{hh} people</StatusBadge>
                <StatusBadge tone="primary">{priority}</StatusBadge>
              </div>
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-display text-2xl">Results</h2>
              <p className="text-sm text-muted-foreground">{plans.length} plans · sort: Plan-AI match</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {plans.map((p) => {
                const isSel = selected.has(p.id);
                return (
                  <div key={p.id} className="relative h-full pt-3">
                    <PlanCard
                      plan={p}
                      compact
                      matchScore={planMatchScore(p, matchInputs)}
                      inCart={cart.items.some((i) => i.id === p.id)}
                      inCompare={cart.compareIds.includes(p.id)}
                      onCompareToggle={(plan) => cartStore.toggleCompare(plan.id)}
                      onAdd={(plan) => cartStore.add({
                        id: plan.id, productType: "ifp", displayName: plan.name, carrier: plan.carrier,
                        monthly: plan.monthlyPremium, effectiveDate: "", status: "draft",
                      })}
                    />
                    <button
                      onClick={() => setSelected((s) => {
                        const n = new Set(s); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n;
                      })}
                      aria-pressed={isSel}
                      className={cn("absolute right-3 top-0 z-10 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm",
                        isSel ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}
                    >
                      {isSel ? "Selected" : "Select"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </InternalShell>
  );
}

function RightSummary({ zip, hh, priority, selected }: { zip: string; hh: number; priority: string; selected: number }) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="text-eyebrow">Quote</p>
        <p className="mt-1">ZIP {zip} · {hh} people</p>
        <p className="text-muted-foreground">Priority: {priority}</p>
      </div>
      <div>
        <p className="text-eyebrow">Selection</p>
        <p className="mt-1 text-lg tabular-nums">{selected} plan(s) selected</p>
      </div>
      <div className="space-y-2">
        <p className="text-eyebrow">Next action</p>
        <Link to="/app/send-quote" className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 hover:bg-accent">
          <span className="inline-flex items-center gap-2"><Send className="h-3.5 w-3.5" /> Send quote</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
        <Link to="/app/schedule" className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 hover:bg-accent">
          <span className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Book callback</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
