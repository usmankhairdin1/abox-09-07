/**
 * Shared presentation kit for the M06 screen register.
 *
 * The metadata rail is deliberately non-intrusive: it carries the stable
 * SCR-M06-* identifier, the acting workspace, the permission the server checks
 * and the governed states, so a stakeholder can see the access model working
 * without the screen turning into a requirements dump.
 */

import { useEffect, type ReactNode } from "react";

import { Id, Note } from "@/components/lucie/ui";
import { StatusBadge } from "@/components/abox/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { LoadState, M06Query } from "@/lib/m06/use-m06";

export type Tone = "neutral" | "good" | "warn" | "stop" | "info";

export function statusTone(v: string | null | undefined): Tone {
  const s = (v ?? "").toUpperCase();
  if (
    ["ACTIVE", "READY", "COMPLETED", "RESOLVED", "ACCEPTED", "AVAILABLE", "VALID", "GRANTED", "OPERATIONALLY_ELIGIBLE", "COMPLETED_WITHOUT_DRIFT", "VERIFIED_MATCH"].includes(s)
  )
    return "good";
  if (
    ["SUSPENDED", "BLOCKED", "IN_REVIEW", "REVIEW_REQUIRED", "PENDING", "PROCESSING", "VALIDATING", "POSSIBLE_MATCH", "READY_WITH_LIMITATIONS", "NOT_ACCEPTING_NEW_WORK", "COMPLETED_WITH_DRIFT", "TEMPORARILY_UNAVAILABLE", "REQUESTED", "UPLOADED"].includes(s)
  )
    return "warn";
  if (["INACTIVE", "FAILED", "INVALID", "OPEN", "REVOKED", "EXPIRED", "NOT_READY", "OPERATIONALLY_INELIGIBLE", "CANCELED", "ENDED", "UNAVAILABLE"].includes(s))
    return "stop";
  if (["DRAFT", "PLANNED", "NOT_REQUESTED", "NOT_APPLICABLE", "UNSPECIFIED"].includes(s)) return "neutral";
  return "info";
}

export function StatusTag({ value }: { value: string | null | undefined }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return <Tag tone={statusTone(value)}>{value.replaceAll("_", " ").toLowerCase()}</Tag>;
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

export function Btn({
  children,
  onClick,
  variant = "ghost",
  disabled,
  type = "button",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20",
        variant === "ghost" && "border-hairline bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
        variant === "danger" && "border-destructive/40 bg-destructive/10 text-foreground hover:bg-destructive/20",
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      {children}
      {hint ? <span className="text-[11px] text-muted-foreground/80">{hint}</span> : null}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40";

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputCls, "resize-y leading-relaxed")}
    />
  );
}

export function Picker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

export function StateBlock({
  state,
  error,
  empty = "Nothing to show for the current scope and filters.",
  children,
}: {
  state: LoadState;
  error?: { code?: string; reason?: string; permission?: string } | null;
  empty?: string;
  children: ReactNode;
}) {
  if (state === "loading") {
    return (
      <div className="space-y-2" aria-busy>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-8 animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    );
  }
  if (state === "denied") {
    return (
      <Note tone="stop">
        <strong>Denied.</strong> {error?.code === "CONTEXT_AMBIGUOUS"
          ? "Tenant and organization scope must both resolve to exactly one value. Ambiguous scope is refused rather than widened."
          : `The server refused this read${error?.permission ? ` — it requires ${error.permission}` : ""}.`}
        {error?.reason ? <span className="block pt-1 opacity-80">{error.reason}</span> : null}
      </Note>
    );
  }
  if (state === "error") {
    return (
      <Note tone="stop">
        <strong>{error?.code ?? "Error"}.</strong> {error?.reason ?? "The operation did not complete."}
      </Note>
    );
  }
  if (state === "empty") {
    return (
      <p className="rounded-2xl border border-dashed border-hairline-strong/60 bg-surface/40 px-3 py-10 text-center text-xs text-muted-foreground">
        {empty}
      </p>
    );
  }
  return <>{children}</>;
}

export function QueryBlock<T>({
  query,
  empty,
  children,
}: {
  query: M06Query<T>;
  empty?: string;
  children: (rows: T[]) => ReactNode;
}) {
  return (
    <StateBlock state={query.state} error={query.error} empty={empty}>
      {children(query.data)}
    </StateBlock>
  );
}

/* ------------------------------------------------------------------ */
/* Governance banners                                                  */
/* ------------------------------------------------------------------ */

export function PendingM00({ deltas, children }: { deltas: string[]; children: ReactNode }) {
  return (
    <Note tone="warn">
      <strong>Pending M00 approval.</strong> {children}{" "}
      <span className="opacity-80">Blocked by {deltas.join(", ")}.</span> M06 does not
      substitute its own role or effective-access evaluation while these deltas are in draft.
    </Note>
  );
}

export function OwnedElsewhere({ module, children }: { module: string; children: ReactNode }) {
  return (
    <Note tone="info">
      <strong>Read-only projection from {module}.</strong> {children} M06 never writes the
      source of truth for this data.
    </Note>
  );
}

/* ------------------------------------------------------------------ */
/* Detail sheet                                                        */
/* ------------------------------------------------------------------ */

export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-full w-full max-w-xl flex-col border-l border-hairline bg-card shadow-2xl"
      >
        <header className="flex items-start gap-3 border-b border-hairline px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-[15px] font-semibold tracking-tight">{title}</h2>
            {subtitle ? (
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                {subtitle}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg border border-hairline px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent"
          >
            Close
          </button>
        </header>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Metadata rail                                                       */
/* ------------------------------------------------------------------ */

export interface ScreenMeta {
  id: string;
  name: string;
  workspace: string;
  actor: string;
  permission: string;
  scope: string;
  capability?: string;
}

export function MetaRail({ meta, extra }: { meta: ScreenMeta; extra?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-hairline bg-surface/50 px-4 py-2.5 text-[11px] text-muted-foreground">
      <Id>{meta.id}</Id>
      <span>
        <span className="opacity-70">Actor</span> {meta.actor}
      </span>
      <span>
        <span className="opacity-70">Permission</span>{" "}
        <code className="rounded bg-background px-1 py-0.5">{meta.permission}</code>
      </span>
      <span>
        <span className="opacity-70">Scope</span> {meta.scope}
      </span>
      {meta.capability ? (
        <span>
          <span className="opacity-70">Capability</span> {meta.capability}
        </span>
      ) : null}
      {extra}
    </div>
  );
}

export function Toast({ message, tone }: { message: string; tone: Tone }) {
  if (!message) return null;
  return <Note tone={tone}>{message}</Note>;
}

export function fmtDate(v: unknown): string {
  if (!v) return "—";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function fmtDateTime(v: unknown): string {
  if (!v) return "—";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
