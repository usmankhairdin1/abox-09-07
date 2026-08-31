import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Id, Note, PageHead, Section, Select } from "@/components/lucie/ui";
import { M06_OPERATIONS, m06Invoke, type M06Result } from "@/lib/m06/m06.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/m06/console")({
  head: () => ({
    meta: [
      { title: "M06 runtime console | ABox" },
      {
        name: "description",
        content:
          "Invoke governed M06 agency, agent and network operations against the live database with server-side tenant, organization and permission enforcement.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "M06 runtime console" },
      { property: "og:description", content: "Run governed agency and workforce operations against the live schema." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: M06Console,
});

const SAMPLES: Record<string, Record<string, unknown>> = {
  "workforce.profile.list": {},
  "workforce.profile.get": { workforce_profile_id: "" },
  "workforce.profile.create": { display_name: "New Agent", person_category: "AGENT" },
  "workforce.profile.update": { workforce_profile_id: "", work_phone: "555-0100" },
  "workforce.lifecycle.transition": { workforce_profile_id: "", action: "ACTIVATE", reason: "Onboarding complete" },
  "workforce.lifecycle.case.open": { workforce_profile_id: "", case_type: "ONBOARDING" },
  "workforce.lifecycle.case.complete": { case_id: "" },
  "workforce.lifecycle.case.list": {},
  "affiliation.create": { workforce_profile_id: "", status: "ACTIVE", is_primary: true },
  "affiliation.end": { affiliation_id: "" },
  "affiliation.list": {},
  "group.create": { group_type: "TEAM", name: "Enrollment Team" },
  "group.list": {},
  "membership.add": { group_id: "", workforce_profile_id: "" },
  "availability.declare": { workforce_profile_id: "", availability: "AVAILABLE" },
  "servicescope.set": { workforce_profile_id: "", state_code: "TX", product_lines: ["ACA"] },
  "readiness.evaluate": { workforce_profile_id: "" },
  "readiness.list": {},
  "note.add": { workforce_profile_id: "", audience: "AGENCY_VISIBLE", body: "Follow-up scheduled." },
  "note.list": { workforce_profile_id: "" },
  "exception.open": { subject_type: "WorkforceProfile", subject_id: "", code: "READINESS_BLOCK", summary: "Missing appointment" },
  "exception.resolve": { exception_id: "", status: "RESOLVED", resolution_note: "Cleared" },
  "exception.list": {},
  "history.list": {},
};

const CTX_KEY = "abox.m06.context";

function M06Console() {
  const invoke = useServerFn(m06Invoke);
  const [op, setOp] = useState<string>("workforce.profile.list");
  const [payload, setPayload] = useState("{}");
  const [tenantId, setTenantId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [result, setResult] = useState<M06Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const raw = typeof window === "undefined" ? null : window.localStorage.getItem(CTX_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { tenantId?: string; organizationId?: string };
        setTenantId(parsed.tenantId ?? "");
        setOrganizationId(parsed.organizationId ?? "");
      } catch {
        /* ignore */
      }
    }
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setEmail(session?.user?.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  function pick(next: string) {
    setOp(next);
    setPayload(JSON.stringify(SAMPLES[next] ?? {}, null, 2));
    setResult(null);
  }

  async function run() {
    setBusy(true);
    setResult(null);
    try {
      const parsed = payload.trim() ? (JSON.parse(payload) as Record<string, unknown>) : {};
      const res = (await invoke({
        data: { op, payload: parsed, tenantId: tenantId || null, organizationId: organizationId || null },
      })) as M06Result;
      setResult(res);
    } catch (err) {
      setResult({ ok: false, code: "CLIENT_ERROR", reason: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead
        eyebrow="Governed runtime"
        title="M06 operation console"
        lede="One entry point, one enforcement order: authenticate, resolve tenant and organization, check the permission, then act. The console cannot assert authority the server has not granted."
        right={<Id>public.lucie_m06_api</Id>}
      />

      {email ? (
        <Note tone="good">Signed in as {email}. Operator authority applies in Local Development (CCL-M06-002).</Note>
      ) : (
        <Note tone="warn">
          Not signed in — every M06 operation will be refused.{" "}
          <Link to="/auth" className="underline">
            Sign in
          </Link>
          .
        </Note>
      )}

      <Section title="Invoke" meta={`${M06_OPERATIONS.length} governed operations`}>
        <div className="flex flex-col gap-3">
          <Select
            label="Operation"
            value={op}
            onChange={pick}
            options={M06_OPERATIONS.map((o) => ({ value: o, label: o }))}
          />

          <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Payload (JSON)
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              spellCheck={false}
              rows={8}
              className="w-full rounded-lg border border-hairline bg-background p-2.5 font-mono text-xs normal-case tracking-normal text-foreground"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Tenant
              <input
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                placeholder="tenant uuid"
                className="min-w-[260px] rounded-lg border border-hairline bg-background px-2 py-1.5 font-mono text-xs normal-case tracking-normal"
              />
            </label>
            <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Organization
              <input
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                placeholder="organization uuid"
                className="min-w-[260px] rounded-lg border border-hairline bg-background px-2 py-1.5 font-mono text-xs normal-case tracking-normal"
              />
            </label>
            <button
              type="button"
              onClick={() => void run()}
              disabled={busy}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Running…" : "Run operation"}
            </button>
          </div>
        </div>
      </Section>

      {result ? (
        <Section title="Response" meta={result.ok ? "ok" : (result.code ?? "error")}>
          {result.ok ? null : (
            <Note tone="stop">
              {result.code ?? "ERROR"}
              {result.reason ? ` — ${result.reason}` : ""}
              {result.permission ? ` — required permission ${result.permission}` : ""}
            </Note>
          )}
          <pre className="mt-2 max-h-[420px] overflow-auto rounded-lg border border-hairline bg-muted/40 p-3 font-mono text-[11px] leading-relaxed">
            {JSON.stringify(result.data ?? result, null, 2)}
          </pre>
        </Section>
      ) : null}
    </>
  );
}
