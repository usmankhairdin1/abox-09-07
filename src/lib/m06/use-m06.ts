/**
 * M06 runtime client hooks.
 *
 * All reads and writes funnel through `m06Invoke` -> `lucie_m06_api`, which
 * enforces actor, unambiguous tenant + organization scope, and a server-side
 * permission check before any row is touched. Nothing here queries a table
 * directly, and nothing here decides access — the UI can only render what the
 * server already authorised.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { m06Invoke, type M06Result } from "@/lib/m06/m06.functions";

const CTX_KEY = "abox.m06.context";

/** Local Development sample network seeded by migration M06-1.0-V003. */
export const M06_DEMO_TENANT = "11111111-1111-4111-8111-111111111111";
export const M06_DEMO_ORG = "22222222-2222-4222-8222-222222222222";

export interface M06Context {
  tenantId: string;
  organizationId: string;
}

function readContext(): M06Context {
  if (typeof window === "undefined") return { tenantId: "", organizationId: "" };
  try {
    const raw = window.localStorage.getItem(CTX_KEY);
    if (!raw) return { tenantId: M06_DEMO_TENANT, organizationId: M06_DEMO_ORG };
    const parsed = JSON.parse(raw) as Partial<M06Context>;
    return {
      tenantId: parsed.tenantId ?? M06_DEMO_TENANT,
      organizationId: parsed.organizationId ?? M06_DEMO_ORG,
    };
  } catch {
    return { tenantId: M06_DEMO_TENANT, organizationId: M06_DEMO_ORG };
  }
}

export function useM06Context() {
  const [ctx, setCtx] = useState<M06Context>({ tenantId: "", organizationId: "" });
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setCtx(readContext());
    setHydrated(true);
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setEmail(session?.user?.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const persist = useCallback((next: M06Context) => {
    setCtx(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CTX_KEY, JSON.stringify(next));
    }
  }, []);

  return { ctx, hydrated, email, persist };
}

export type M06Call = (op: string, payload?: Record<string, unknown>) => Promise<M06Result>;

export function useM06Call(ctx: M06Context): M06Call {
  const invoke = useServerFn(m06Invoke);
  return useCallback(
    async (op, payload = {}) => {
      try {
        return (await invoke({
          data: {
            op,
            payload,
            tenantId: ctx.tenantId || null,
            organizationId: ctx.organizationId || null,
          },
        })) as M06Result;
      } catch (err) {
        return {
          ok: false,
          code: "CLIENT_ERROR",
          reason: err instanceof Error ? err.message : String(err),
        };
      }
    },
    [invoke, ctx.tenantId, ctx.organizationId],
  );
}

export type LoadState = "loading" | "ready" | "empty" | "error" | "denied";

export interface M06Query<T> {
  state: LoadState;
  data: T[];
  raw: unknown;
  error: M06Result | null;
  reload: () => void;
}

function resolveState(res: M06Result | null, rows: unknown): LoadState {
  if (!res) return "loading";
  if (!res.ok) {
    return res.code === "PERMISSION_DENIED" || res.code === "CONTEXT_AMBIGUOUS" || res.code === "UNAUTHENTICATED"
      ? "denied"
      : "error";
  }
  if (Array.isArray(rows) && rows.length === 0) return "empty";
  if (rows === null || rows === undefined) return "empty";
  return "ready";
}

/** Run one governed read and track its lifecycle state. */
export function useM06Query<T = Record<string, unknown>>(
  call: M06Call,
  op: string | null,
  payload: Record<string, unknown> = {},
  enabled = true,
): M06Query<T> {
  const key = JSON.stringify(payload);
  const [res, setRes] = useState<M06Result | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!op || !enabled) return;
    let cancelled = false;
    setRes(null);
    void call(op, JSON.parse(key) as Record<string, unknown>).then((r) => {
      if (!cancelled) setRes(r);
    });
    return () => {
      cancelled = true;
    };
  }, [call, op, key, enabled, tick]);

  const raw = res?.ok ? res.data : null;
  const data = useMemo(() => (Array.isArray(raw) ? (raw as T[]) : []), [raw]);

  return {
    state: !op || !enabled ? "empty" : resolveState(res, raw),
    data,
    raw,
    error: res && !res.ok ? res : null,
    reload: () => setTick((n) => n + 1),
  };
}

/** Convenience for object (non-array) reads. */
export function useM06Record<T = Record<string, unknown>>(
  call: M06Call,
  op: string | null,
  payload: Record<string, unknown> = {},
  enabled = true,
) {
  const q = useM06Query<never>(call, op, payload, enabled);
  return { ...q, record: (q.raw as T | null) ?? null };
}

export function describeResult(res: M06Result): string {
  if (res.ok) return "Applied.";
  const parts = [res.code ?? "ERROR"];
  if (res.permission) parts.push(`permission ${res.permission}`);
  if (res.reason) parts.push(res.reason);
  return parts.join(" · ");
}
