/**
 * UX-026 — AI Review & Confirmation
 * User reviews AI-filled fields, confirms or edits, and strictly re-confirms
 * before sensitive next steps (submit, enroll, share, hand off).
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Check, Pencil, ShieldAlert } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { StatusBadge } from "@/components/abox/status-badge";
import { SCREENS } from "@/lib/screens";

interface Field {
  key: string; label: string; value: string; source: "user" | "ai" | "ai-suggested";
  sensitive?: boolean;
}
const INITIAL_FIELDS: Field[] = [
  { key: "zip", label: "ZIP", value: "30301", source: "user" },
  { key: "county", label: "County", value: "Fulton County, GA", source: "ai" },
  { key: "hh", label: "Household size", value: "2", source: "user" },
  { key: "priority-1", label: "Top priority", value: "Keep my doctor", source: "user" },
  { key: "priority-2", label: "Second priority", value: "Prescription coverage", source: "user" },
  { key: "pcp", label: "PCP name", value: "Dr. Maya Okoye", source: "ai-suggested" },
  { key: "rx", label: "Rx list", value: "Lisinopril 10mg, Atorvastatin 20mg", source: "ai-suggested" },
  { key: "income", label: "Estimated income", value: "$52,000", source: "user", sensitive: true },
];

export const Route = createFileRoute("/ai-review")({
  head: () => ({ meta: [{ title: `${SCREENS["UX-026"].name} — ABox` }, { name: "description", content: SCREENS["UX-026"].purpose }] }),
  component: Page,
});

function Page() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const [strictAgree, setStrictAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const aiCount = fields.filter((f) => f.source !== "user").length;
  const confirmedCount = confirmed.size;
  const allConfirmed = confirmedCount === fields.length;

  return (
    <MarketplaceShell>
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <PageHeader
          scrId="UX-026" eyebrow="AI review"
          title="Review what we prefilled"
          description="Plan-AI suggested some fields. Confirm or edit any of them before we continue."
        />

        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-primary/20 bg-primary-soft/40 p-4 text-sm">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          <span><span className="font-medium">{aiCount}</span> AI-suggested field(s) · <span className="font-medium">{confirmedCount}/{fields.length}</span> confirmed</span>
        </div>

        <ul className="space-y-2">
          {fields.map((f) => (
            <li key={f.key} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-eyebrow">{f.label}</p>
                    {f.source === "ai" && <StatusBadge tone="primary">Prefilled by AI</StatusBadge>}
                    {f.source === "ai-suggested" && <StatusBadge tone="info">Suggested</StatusBadge>}
                    {f.sensitive && <StatusBadge tone="warning"><ShieldAlert className="h-3 w-3" /> Sensitive</StatusBadge>}
                  </div>
                  {editing === f.key ? (
                    <input
                      autoFocus defaultValue={f.value}
                      onBlur={(e) => {
                        setFields((arr) => arr.map((x) => x.key === f.key ? { ...x, value: e.target.value, source: "user" } : x));
                        setEditing(null);
                      }}
                      className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-medium">{f.value}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditing(f.key)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs hover:bg-accent"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmed((c) => new Set(c).add(f.key))}
                    disabled={confirmed.has(f.key)}
                    className="inline-flex h-8 items-center gap-1 rounded-full bg-sage px-3 text-xs font-medium text-sage-foreground disabled:opacity-70"
                  >
                    <Check className="h-3 w-3" /> {confirmed.has(f.key) ? "Confirmed" : "Confirm"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/10 p-5">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox" checked={strictAgree}
              onChange={(e) => setStrictAgree(e.target.checked)}
              className="mt-0.5"
            />
            <div>
              <p className="font-medium">I confirm the values above are correct.</p>
              <p className="mt-1 text-muted-foreground">
                Required before we submit to the exchange, share this quote, or start enrollment.
              </p>
            </div>
          </label>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-sage/40 bg-sage-soft/40 p-5">
            <p className="font-medium">Reviewed and confirmed.</p>
            <p className="mt-1 text-sm">Proceeding to your next step in the flow.</p>
            <Link to="/review" className="mt-3 inline-flex text-sm text-primary story-link">Continue to enrollment review</Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={() => setSubmitted(true)}
              disabled={!allConfirmed || !strictAgree}
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              Confirm and continue
            </button>
          </div>
        )}
      </div>
    </MarketplaceShell>
  );
}
