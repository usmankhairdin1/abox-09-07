/**
 * UX-009 — Inline "Edit quote" panel shown above the plan results.
 *
 * Reuses the single quote data model (src/lib/quote-store) and the same
 * field patterns as the /quote wizard (UX-003 → UX-007). Nothing is
 * duplicated: this edits the very same sessionStorage-backed QuoteState,
 * so the wizard and the plan results stay in sync, and filters/cart/
 * PlanAI state are untouched.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Trash2, X } from "lucide-react";
import {
  PRIORITIES,
  RELATIONSHIPS,
  RELATIONSHIP_LABEL,
  SEX_OPTIONS,
  USAGE_LEVELS,
  cryptoRandomId,
  resolveCountyStub,
  saveQuoteState,
  type Member,
  type PriorityKey,
  type QuoteState,
  type UsageLevel,
} from "@/lib/quote-store";
import { cn } from "@/lib/utils";

function inputCls(extra = "") {
  return cn(
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring min-h-11",
    extra,
  );
}

function blockNonIntegerKey(e: React.KeyboardEvent<HTMLInputElement>) {
  if (["e", "E", "+", "-", ".", ","].includes(e.key)) e.preventDefault();
}

export function QuoteEditPanel({
  quote,
  onApply,
  onClose,
}: {
  quote: QuoteState;
  onApply: (next: QuoteState) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<QuoteState>(quote);
  const patch = (p: Partial<QuoteState>) => setDraft((d) => ({ ...d, ...p }));

  const updateMember = (id: string, p: Partial<Member>) =>
    setDraft((d) => ({ ...d, members: d.members.map((m) => (m.id === id ? { ...m, ...p } : m)) }));
  const addMember = () =>
    setDraft((d) =>
      d.members.length >= 10
        ? d
        : { ...d, members: [...d.members, { id: cryptoRandomId(), relationship: "child", dob: "", sex: "female", tobacco: false }] },
    );
  const removeMember = (id: string) =>
    setDraft((d) => ({ ...d, members: d.members.filter((m) => m.id !== id) }));

  const togglePriority = (k: PriorityKey) =>
    setDraft((d) => {
      const has = d.priorities.includes(k);
      if (has) return { ...d, priorities: d.priorities.filter((p) => p !== k) };
      if (d.priorities.length >= 3) return d;
      return { ...d, priorities: [...d.priorities, k] };
    });

  const apply = () => {
    const next: QuoteState = { ...draft, county: resolveCountyStub(draft.zip) ?? draft.county };
    saveQuoteState(next);
    onApply(next);
  };

  return (
    <section
      id="edit-quote-panel"
      aria-label="Edit quote"
      className="mb-5 rounded-2xl border border-border bg-card p-4 md:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-eyebrow">Edit quote</p>
          <h2 className="text-lg font-semibold">Review your quote details</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Plan results below update as soon as you apply your changes.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close edit quote"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="eq-zip" className="text-sm font-medium">ZIP code</label>
          <input
            id="eq-zip"
            inputMode="numeric"
            maxLength={5}
            value={draft.zip}
            onChange={(e) => patch({ zip: e.target.value.replace(/\D/g, "").slice(0, 5) })}
            className={inputCls("mt-1.5")}
          />
        </div>
        <div>
          <label htmlFor="eq-eff" className="text-sm font-medium">Effective date</label>
          <input
            id="eq-eff"
            type="date"
            value={draft.effectiveDate}
            onChange={(e) => patch({ effectiveDate: e.target.value })}
            className={inputCls("mt-1.5")}
          />
        </div>
      </div>

      {/* Household */}
      <div className="mt-5">
        <p className="text-sm font-medium">Household</p>
        <ul className="mt-2 grid gap-3">
          {draft.members.map((m, idx) => (
            <li key={m.id} className="rounded-xl border border-border bg-surface p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Member {idx + 1}
                </p>
                {draft.members.length > 1 && m.relationship !== "primary" && (
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    aria-label={`Remove member ${idx + 1}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <label htmlFor={`eq-rel-${m.id}`} className="text-xs font-medium">Relationship</label>
                  <select
                    id={`eq-rel-${m.id}`}
                    value={m.relationship}
                    onChange={(e) => updateMember(m.id, { relationship: e.target.value as Member["relationship"] })}
                    className={inputCls("mt-1")}
                  >
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r}>{RELATIONSHIP_LABEL[r]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`eq-dob-${m.id}`} className="text-xs font-medium">Date of birth</label>
                  <input
                    id={`eq-dob-${m.id}`}
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={m.dob}
                    onChange={(e) => updateMember(m.id, { dob: e.target.value })}
                    className={inputCls("mt-1")}
                  />
                </div>
                <div>
                  <label htmlFor={`eq-sex-${m.id}`} className="text-xs font-medium">Sex</label>
                  <select
                    id={`eq-sex-${m.id}`}
                    value={m.sex}
                    onChange={(e) => updateMember(m.id, { sex: e.target.value as Member["sex"] })}
                    className={inputCls("mt-1 capitalize")}
                  >
                    {SEX_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-xs font-medium">Tobacco use</span>
                  <label className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm min-h-11">
                    <input
                      type="checkbox"
                      checked={m.tobacco}
                      onChange={(e) => updateMember(m.id, { tobacco: e.target.checked })}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    <span>Last 6 months</span>
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addMember}
          disabled={draft.members.length >= 10}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-border-strong bg-surface px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden /> Add family member
        </button>
      </div>

      {/* Priorities + usage */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium">Priorities <span className="font-normal text-muted-foreground">(up to 3)</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const on = draft.priorities.includes(p.key);
              return (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => togglePriority(p.key)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm transition-colors",
                    on ? "border-primary bg-primary-soft text-foreground" : "border-border bg-surface hover:bg-accent",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="eq-usage" className="text-sm font-medium">Expected care usage</label>
          <select
            id="eq-usage"
            value={draft.usage ?? ""}
            onChange={(e) => patch({ usage: (e.target.value || undefined) as UsageLevel | undefined })}
            className={inputCls("mt-1.5")}
          >
            <option value="">Not specified</option>
            {USAGE_LEVELS.map((u) => (
              <option key={u.key} value={u.key}>{u.label}</option>
            ))}
          </select>
          <label className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm min-h-11">
            <input
              type="checkbox"
              checked={draft.keepDoctor}
              onChange={(e) => patch({ keepDoctor: e.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            <span>Keep my current doctor</span>
          </label>
        </div>
      </div>

      {/* Subsidy inputs */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="eq-income" className="text-sm font-medium">Estimated annual income</label>
          <input
            id="eq-income"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            onKeyDown={blockNonIntegerKey}
            value={draft.income ?? ""}
            onChange={(e) => patch({ income: e.target.value === "" ? undefined : Number(e.target.value) })}
            className={inputCls("mt-1.5")}
          />
        </div>
        <div>
          <label htmlFor="eq-hh" className="text-sm font-medium">Tax household size</label>
          <input
            id="eq-hh"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            onKeyDown={blockNonIntegerKey}
            value={draft.taxHouseholdSize ?? ""}
            onChange={(e) => patch({ taxHouseholdSize: e.target.value === "" ? undefined : Number(e.target.value) })}
            className={inputCls("mt-1.5")}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={apply}
          className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Apply changes
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm hover:bg-accent"
        >
          Cancel
        </button>
        <Link to="/quote" search={{ step: 1 }} className="text-sm font-medium text-primary story-link">
          Open the full quote wizard
        </Link>
      </div>
    </section>
  );
}
