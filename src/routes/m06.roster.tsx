import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Id, KV, Note, PageHead, Search, Section, Select, Table, Tag, Toolbar } from "@/components/lucie/ui";
import { m06Invoke, type M06Result } from "@/lib/m06/m06.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/m06/roster")({
  head: () => ({
    meta: [
      { title: "Agency roster | ABox M06" },
      {
        name: "description",
        content:
          "Live governed agency roster: create workforce profiles, manage affiliation, run lifecycle transitions and evaluate operational readiness with server-side permission enforcement.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Agency roster (M06)" },
      { property: "og:description", content: "Governed workforce roster with lifecycle and readiness." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RosterPage,
});

interface Profile {
  workforce_profile_id: string;
  display_name: string;
  person_category: string;
  status: string;
  captivity: string;
  work_email: string | null;
  npn: string | null;
  roster_only: boolean;
  user_account_id: string | null;
}

interface Readiness {
  workforce_profile_id: string;
  readiness_state: string;
  operational_eligibility: string;
  reasons: string[];
}

const CTX_KEY = "abox.m06.context";
const DEMO_TENANT = "11111111-1111-4111-8111-111111111111";
const DEMO_ORG = "22222222-2222-4222-8222-222222222222";

function readinessTone(state: string) {
  if (state === "READY") return "good" as const;
  if (state === "READY_WITH_LIMITATIONS") return "info" as const;
  if (state === "REVIEW_REQUIRED") return "warn" as const;
  return "stop" as const;
}

function statusTone(status: string) {
  if (status === "ACTIVE") return "good" as const;
  if (status === "SUSPENDED") return "warn" as const;
  if (status === "INACTIVE") return "stop" as const;
  return "neutral" as const;
}

function RosterPage() {
  const invoke = useServerFn(m06Invoke);

  const [tenantId, setTenantId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [readiness, setReadiness] = useState<Record<string, Readiness>>({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("AGENT");
  const [newEmail, setNewEmail] = useState("");
  const [newNpn, setNewNpn] = useState("");

  useEffect(() => {
    const raw = typeof window === "undefined" ? null : window.localStorage.getItem(CTX_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { tenantId?: string; organizationId?: string };
        setTenantId(parsed.tenantId ?? "");
        setOrganizationId(parsed.organizationId ?? "");
      } catch {
        /* ignore malformed context */
      }
    }
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setEmail(session?.user?.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const persist = (t: string, o: string) => {
    setTenantId(t);
    setOrganizationId(o);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CTX_KEY, JSON.stringify({ tenantId: t, organizationId: o }));
    }
  };

  const call = useCallback(
    async (op: string, payload: Record<string, unknown> = {}): Promise<M06Result> => {
      try {
        return (await invoke({
          data: { op, payload, tenantId: tenantId || null, organizationId: organizationId || null },
        })) as M06Result;
      } catch (err) {
        return { ok: false, code: "CLIENT_ERROR", reason: err instanceof Error ? err.message : String(err) };
      }
    },
    [invoke, tenantId, organizationId],
  );

  const refresh = useCallback(async () => {
    if (!tenantId || !organizationId) {
      setProfiles([]);
      setReadiness({});
      return;
    }
    setBusy(true);
    const list = await call("workforce.profile.list");
    if (!list.ok) {
      setError(`${list.code ?? "ERROR"}: ${list.reason ?? list.permission ?? ""}`);
      setProfiles([]);
    } else {
      setError(null);
      setProfiles((list.data as Profile[]) ?? []);
      const r = await call("readiness.list");
      const map: Record<string, Readiness> = {};
      if (r.ok) for (const row of (r.data as Readiness[]) ?? []) map[row.workforce_profile_id] = row;
      setReadiness(map);
    }
    setBusy(false);
  }, [call, tenantId, organizationId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function createProfile() {
    if (!newName.trim()) return;
    setBusy(true);
    const res = await call("workforce.profile.create", {
      display_name: newName.trim(),
      person_category: newCategory,
      work_email: newEmail.trim() || null,
      npn: newNpn.trim() || null,
    });
    if (!res.ok) setError(`${res.code ?? "ERROR"}: ${res.reason ?? res.permission ?? ""}`);
    setNewName("");
    setNewEmail("");
    setNewNpn("");
    await refresh();
  }

  async function transition(id: string, action: string) {
    const reason = window.prompt(`Reason for ${action.toLowerCase()} (required and recorded in history):`);
    if (!reason) return;
    setBusy(true);
    const res = await call("workforce.lifecycle.transition", {
      workforce_profile_id: id,
      action,
      reason,
    });
    if (!res.ok) setError(`${res.code ?? "ERROR"}: ${res.reason ?? ""}`);
    await refresh();
  }

  async function evaluate(id: string) {
    setBusy(true);
    const res = await call("readiness.evaluate", { workforce_profile_id: id });
    if (!res.ok) setError(`${res.code ?? "ERROR"}: ${res.reason ?? ""}`);
    await refresh();
  }

  async function affiliate(id: string) {
    setBusy(true);
    const res = await call("affiliation.create", {
      workforce_profile_id: id,
      status: "ACTIVE",
      is_primary: true,
    });
    if (!res.ok) setError(`${res.code ?? "ERROR"}: ${res.reason ?? ""}`);
    await refresh();
  }

  const visible = profiles.filter(
    (p) =>
      (!statusFilter || p.status === statusFilter) &&
      (!query.trim() ||
        `${p.display_name} ${p.work_email ?? ""} ${p.npn ?? ""}`.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <PageHead
        eyebrow="SCR-M06-002 · Agency Roster"
        title="Workforce roster"
        lede="Reads and writes run through the governed M06 entry point. The server resolves tenant and organization, denies ambiguous context, checks the permission for the operation, records history and enqueues an event."
        right={<Id>workforce.profile.read</Id>}
      />

      {email ? null : (
        <Note tone="warn">
          Not signed in. Every M06 operation requires an authenticated operator.{" "}
          <Link to="/auth" className="underline">
            Sign in
          </Link>
          .
        </Note>
      )}

      <Section
        title="Acting context"
        description="Tenant and organization are the isolation boundary. Leaving either blank is a denied condition, not a wildcard."
      >
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Tenant
            <input
              value={tenantId}
              onChange={(e) => persist(e.target.value, organizationId)}
              placeholder="tenant uuid"
              className="min-w-[290px] rounded-lg border border-hairline bg-background px-2 py-1.5 font-mono text-xs normal-case tracking-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Organization
            <input
              value={organizationId}
              onChange={(e) => persist(tenantId, e.target.value)}
              placeholder="organization uuid"
              className="min-w-[290px] rounded-lg border border-hairline bg-background px-2 py-1.5 font-mono text-xs normal-case tracking-normal"
            />
          </label>
          <button
            type="button"
            onClick={() => persist(DEMO_TENANT, DEMO_ORG)}
            className="rounded-lg border border-hairline px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
          >
            Use development context
          </button>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={busy}
            className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Working…" : "Refresh"}
          </button>
        </div>
        {!tenantId || !organizationId ? (
          <Note tone="stop">Context is ambiguous — the server will refuse every operation until both values resolve.</Note>
        ) : null}
      </Section>

      {error ? <Note tone="stop">{error}</Note> : null}

      <Section title="Add a roster-only profile" meta="FLOW-M06-001">
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Display name
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="min-w-[220px] rounded-lg border border-hairline bg-background px-2 py-1.5 text-xs normal-case tracking-normal"
            />
          </label>
          <Select
            label="Category"
            value={newCategory}
            onChange={setNewCategory}
            options={[
              { value: "AGENT", label: "AGENT" },
              { value: "UNLICENSED_STAFF", label: "UNLICENSED_STAFF" },
              { value: "OTHER_WORKFORCE", label: "OTHER_WORKFORCE" },
            ]}
          />
          <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Work email
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="min-w-[200px] rounded-lg border border-hairline bg-background px-2 py-1.5 text-xs normal-case tracking-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            NPN
            <input
              value={newNpn}
              onChange={(e) => setNewNpn(e.target.value)}
              className="min-w-[140px] rounded-lg border border-hairline bg-background px-2 py-1.5 font-mono text-xs normal-case tracking-normal"
            />
          </label>
          <button
            type="button"
            onClick={() => void createProfile()}
            disabled={busy || !newName.trim() || !tenantId || !organizationId}
            className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            Create profile
          </button>
        </div>
      </Section>

      <Section title="Roster" meta={`${visible.length} of ${profiles.length}`}>
        <Toolbar>
          <Search value={query} onChange={setQuery} placeholder="Search name, email or NPN" />
          <Select
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "", label: "All statuses" },
              { value: "DRAFT", label: "DRAFT" },
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "SUSPENDED", label: "SUSPENDED" },
              { value: "INACTIVE", label: "INACTIVE" },
            ]}
          />
        </Toolbar>
        <Table
          rows={visible}
          keyOf={(p) => p.workforce_profile_id}
          empty="No workforce profiles in this organization yet."
          columns={[
            {
              head: "Person",
              cell: (p) => (
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{p.display_name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {p.person_category} · {p.roster_only ? "roster-only" : "user-linked"}
                    {p.npn ? ` · NPN ${p.npn}` : ""}
                  </span>
                </div>
              ),
            },
            { head: "Status", cell: (p) => <Tag tone={statusTone(p.status)}>{p.status}</Tag> },
            {
              head: "Readiness",
              cell: (p) => {
                const r = readiness[p.workforce_profile_id];
                if (!r) return <span className="text-muted-foreground">Not evaluated</span>;
                return (
                  <div className="flex flex-col gap-1">
                    <Tag tone={readinessTone(r.readiness_state)}>{r.readiness_state}</Tag>
                    <span className="text-[11px] text-muted-foreground">
                      {(r.reasons ?? []).join("; ") || "All checks pass."}
                    </span>
                  </div>
                );
              },
            },
            {
              head: "Actions",
              cell: (p) => (
                <div className="flex flex-wrap gap-1">
                  {p.status !== "ACTIVE" ? (
                    <ActionButton onClick={() => void transition(p.workforce_profile_id, p.status === "SUSPENDED" ? "REACTIVATE" : "ACTIVATE")}>
                      {p.status === "SUSPENDED" ? "Reactivate" : "Activate"}
                    </ActionButton>
                  ) : (
                    <ActionButton onClick={() => void transition(p.workforce_profile_id, "SUSPEND")}>Suspend</ActionButton>
                  )}
                  <ActionButton onClick={() => void transition(p.workforce_profile_id, "OFFBOARD")}>Offboard</ActionButton>
                  <ActionButton onClick={() => void affiliate(p.workforce_profile_id)}>Affiliate</ActionButton>
                  <ActionButton onClick={() => void evaluate(p.workforce_profile_id)}>Evaluate readiness</ActionButton>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section title="What the server enforced">
        <div className="grid gap-2 sm:grid-cols-2">
          <KV k="Context" v="Tenant and organization resolved server-side; ambiguity returns CONTEXT_AMBIGUOUS." />
          <KV k="Permission" v="workforce.profile.read / .create / .update and workforce.lifecycle.manage." />
          <KV k="Reason capture" v="Suspend, reactivate and offboard require a reason and write status history." />
          <KV k="Readiness" v="Derived from affiliation, service scope, identity linkage and open exceptions." />
        </div>
      </Section>
    </>
  );
}

function ActionButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-hairline px-2 py-1 text-[11px] font-medium transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}
