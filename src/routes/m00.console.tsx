import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";

import { Id, Note, PageHead, Section, Select, Tag } from "@/components/lucie/ui";
import { RUNTIME_OPS, RUNTIME_OP_BY_NAME } from "@/lib/m00/runtime";
import { m00Invoke, m00PublicRead, type M00Result } from "@/lib/m00/m00.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/m00/console")({
  head: () => ({
    meta: [
      { title: "M00 runtime console | ABox" },
      {
        name: "description",
        content:
          "Invoke governed ABox M00 foundation operations against the live database: resolve context, read catalogues, register identities, assign roles, create tasks and drain the event outbox.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "M00 runtime console" },
      { property: "og:description", content: "Execute governed platform foundation operations against the live schema." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConsolePage,
});

function ConsolePage() {
  const [op, setOp] = useState("status");
  const [payload, setPayload] = useState("{}");
  const [tenantId, setTenantId] = useState("");
  const [idemKey, setIdemKey] = useState("");
  const [result, setResult] = useState<M00Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const invoke = useServerFn(m00Invoke);
  const publicRead = useServerFn(m00PublicRead);
  const qc = useQueryClient();

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const spec = RUNTIME_OP_BY_NAME.get(op);
  const needsAuth = !spec?.publicRead;

  const options = useMemo(
    () => RUNTIME_OPS.map((o) => ({ value: o.op, label: `${o.op} — ${o.title}` })),
    [],
  );

  function pick(next: string) {
    setOp(next);
    const s = RUNTIME_OP_BY_NAME.get(next);
    setPayload(JSON.stringify(s?.sample ?? {}, null, 2));
    setResult(null);
  }

  async function run() {
    setBusy(true);
    setResult(null);
    try {
      let parsed: Record<string, unknown> = {};
      if (payload.trim()) parsed = JSON.parse(payload) as Record<string, unknown>;
      const res =
        needsAuth || !spec?.publicRead
          ? await invoke({
              data: {
                op,
                payload: parsed,
                tenantId: tenantId.trim() || null,
                idempotencyKey: idemKey.trim() || null,
              },
            })
          : await publicRead({ data: { op } });
      setResult(res as M00Result);
      void qc.invalidateQueries({ queryKey: ["m00", "status"] });
    } catch (err) {
      setResult({ ok: false, op, error: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead
        eyebrow="Governed runtime"
        title="Operation console"
        lede="Calls go through the single governed entry point. The server resolves identity, tenant and administrative authority — the console cannot assert them. Every write records an audit event and enqueues its outbox envelope in the same transaction."
        right={<Id>public.m00_api</Id>}
      />

      {email ? (
        <Note tone="good">
          Signed in as {email}. Operator authority applies in Local Development (CCL-008).{" "}
          <button
            type="button"
            className="underline"
            onClick={() => {
              void supabase.auth.signOut();
            }}
          >
            Sign out
          </button>
        </Note>
      ) : (
        <Note tone="warn">
          Not signed in. Public catalogue reads work; everything else needs an authenticated operator.{" "}
          <Link to="/auth" className="underline">
            Sign in
          </Link>
          .
        </Note>
      )}

      <Section title="Invoke" meta={spec ? `${spec.kind} · ${spec.capability_id}` : ""}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select label="Operation" value={op} onChange={pick} options={options} />
            {spec ? (
              <>
                <Tag tone={spec.kind === "write" ? "warn" : "neutral"}>{spec.kind}</Tag>
                {spec.api_ids.map((id) => (
                  <Id key={id}>{id}</Id>
                ))}
                {spec.event_ids.map((id) => (
                  <Id key={id}>{id}</Id>
                ))}
              </>
            ) : null}
          </div>

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
                placeholder="uuid (optional)"
                className="min-w-[240px] rounded-lg border border-hairline bg-background px-2 py-1.5 font-mono text-xs normal-case tracking-normal"
              />
            </label>
            <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Idempotency key
              <input
                value={idemKey}
                onChange={(e) => setIdemKey(e.target.value)}
                placeholder="optional"
                className="min-w-[200px] rounded-lg border border-hairline bg-background px-2 py-1.5 font-mono text-xs normal-case tracking-normal"
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
        <Section title="Response" meta={result.ok ? "ok" : "error"}>
          {result.ok ? null : <Note tone="stop">{result.error ?? "unknown_error"}</Note>}
          {result.replayed ? <Note tone="info">Replayed from the idempotency record; no new state was written.</Note> : null}
          <pre className="mt-2 max-h-[420px] overflow-auto rounded-lg border border-hairline bg-muted/40 p-3 font-mono text-[11px] leading-relaxed">
            {JSON.stringify(result.data ?? result, null, 2)}
          </pre>
        </Section>
      ) : null}
    </>
  );
}
