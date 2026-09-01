/**
 * M06 Agency, Agent and Network Management — governed server functions.
 *
 * Every call goes through public.lucie_m06_api, which enforces, in order:
 *   1. authenticated actor,
 *   2. unambiguous tenant + organization context (ambiguity is denied),
 *   3. server-side permission check,
 *   4. canonical write + history + outbox event.
 *
 * Ownership boundaries: M00 owns identity, M05 owns organizations, M04 owns
 * marketplace and M08 owns selling authority. M06 only writes its own objects.
 */

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";


export interface M06Result {
  ok: boolean;
  code?: string;
  reason?: string;
  permission?: string;
  data?: unknown;
}

export const M06_OPERATIONS = [
  "access.effective",
  "access.grant.list",
  "affiliation.correct",
  "affiliation.create",
  "affiliation.end",
  "affiliation.list",
  "agency.profile.get",
  "agency.profile.upsert",
  "assignment.list",
  "availability.declare",
  "availability.list",
  "document.list",
  "duplicate.list",
  "duplicate.resolve",
  "exception.list",
  "exception.open",
  "exception.resolve",
  "group.create",
  "group.get",
  "group.list",
  "group.update",
  "history.list",
  "identity.review.decide",
  "identity.review.list",
  "job.advance",
  "job.create",
  "job.get",
  "job.list",
  "membership.add",
  "membership.list",
  "membership.remove",
  "membership.setlead",
  "note.add",
  "note.list",
  "notification.list",
  "outbox.list",
  "projection.list",
  "readiness.evaluate",
  "readiness.list",
  "reconciliation.list",
  "reconciliation.start",
  "servicescope.list",
  "servicescope.remove",
  "servicescope.set",
  "support.end",
  "support.list",
  "support.start",
  "task.list",
  "task.update",
  "workforce.lifecycle.case.complete",
  "workforce.lifecycle.case.get",
  "workforce.lifecycle.case.list",
  "workforce.lifecycle.case.open",
  "workforce.lifecycle.case.update",
  "workforce.lifecycle.history",
  "workforce.lifecycle.transition",
  "workforce.profile.create",
  "workforce.profile.get",
  "workforce.profile.list",
  "workforce.profile.update",
] as const;

export type M06Operation = (typeof M06_OPERATIONS)[number];

export const m06Invoke = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      op: string;
      payload?: Record<string, unknown>;
      tenantId?: string | null;
      organizationId?: string | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    if (!(M06_OPERATIONS as readonly string[]).includes(data.op)) {
      return { ok: false, code: "UNSUPPORTED_OPERATION", reason: data.op } as M06Result as never;
    }

    // Fail closed without throwing: an unauthenticated caller gets a governed
    // denial the screens can render, not a blank error boundary.
    const header = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
    const token = header?.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return {
        ok: false,
        code: "UNAUTHENTICATED",
        reason: "Sign in to use governed workforce operations.",
      } as M06Result as never;
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: actor, error: actorError } = await supabaseAdmin.auth.getUser(token);
    if (actorError || !actor.user) {
      return {
        ok: false,
        code: "UNAUTHENTICATED",
        reason: "Your session has expired. Sign in again.",
      } as M06Result as never;
    }

    // Resolve the acting context from M00 identity/membership/role assignment.
    // Nothing about tenant, organization or privilege comes from the client.
    const rpc = supabaseAdmin.rpc.bind(supabaseAdmin) as unknown as (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: unknown; error: { message: string } | null }>;

    const { data: ctx, error: ctxError } = await rpc("abox_resolve_context", {
      p_user_id: actor.user.id,
    });
    if (ctxError) {
      return { ok: false, code: "CONTEXT_ERROR", reason: ctxError.message } as M06Result as never;
    }
    const context = (ctx ?? {}) as {
      ok?: boolean;
      code?: string;
      reason?: string;
      tenant_id?: string;
      organization_id?: string;
      is_platform_admin?: boolean;
      organizations?: { organization_id: string }[];
    };
    if (!context.ok || !context.tenant_id || !context.organization_id) {
      return {
        ok: false,
        code: context.code ?? "CONTEXT_AMBIGUOUS",
        reason: context.reason ?? "No effective access context; the request is denied.",
      } as M06Result as never;
    }

    // A requested organization is honoured only when the actor is entitled to it.
    const allowed = new Set((context.organizations ?? []).map((o) => o.organization_id));
    let organizationId = context.organization_id;
    if (data.organizationId && data.organizationId !== organizationId) {
      if (!allowed.has(data.organizationId)) {
        return {
          ok: false,
          code: "SCOPE_DENIED",
          reason: "You do not have access to the requested organization.",
        } as M06Result as never;
      }
      organizationId = data.organizationId;
    }
    if (data.tenantId && data.tenantId !== context.tenant_id) {
      return {
        ok: false,
        code: "SCOPE_DENIED",
        reason: "You do not have access to the requested tenant.",
      } as M06Result as never;
    }

    const { data: result, error } = await rpc("lucie_m06_api", {
      p_op: data.op,
      p_payload: data.payload ?? {},
      p_user_id: actor.user.id,
      p_tenant_id: context.tenant_id,
      p_organization_id: organizationId,
      p_is_platform_admin: context.is_platform_admin === true,
    });
    if (error) {
      return { ok: false, code: "RPC_ERROR", reason: error.message } as M06Result as never;
    }
    return (result ?? { ok: false, code: "EMPTY_RESPONSE" }) as never;
  });

/** Current actor's resolved tenant, organization, role and permissions. */
export const m06Context = createServerFn({ method: "POST" }).handler(async () => {
  const header = getRequestHeader("authorization") ?? getRequestHeader("Authorization");
  const token = header?.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return { ok: false, code: "UNAUTHENTICATED" } as M06Result as never;
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: actor, error: actorError } = await supabaseAdmin.auth.getUser(token);
  if (actorError || !actor.user) {
    return { ok: false, code: "UNAUTHENTICATED" } as M06Result as never;
  }
  const rpc = supabaseAdmin.rpc.bind(supabaseAdmin) as unknown as (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
  const { data: ctx, error } = await rpc("abox_resolve_context", { p_user_id: actor.user.id });
  if (error) {
    return { ok: false, code: "CONTEXT_ERROR", reason: error.message } as M06Result as never;
  }
  return (ctx ?? { ok: false, code: "CONTEXT_AMBIGUOUS" }) as never;
});


