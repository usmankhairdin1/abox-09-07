/**
 * M00 platform foundation server functions.
 *
 * Public read path  → catalogue/aggregate operations only (no personal data).
 * Protected path    → every other operation; requires an authenticated caller
 *                     and runs with a server-resolved request context.
 *
 * All database access goes through the governed entry point public.m00_api
 * (migration V008), which sets the RLS request context, writes the audit
 * event and enqueues the outbox envelope for each change.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import { RUNTIME_OP_BY_NAME } from "./runtime";

export type M00Json = string | number | boolean | null | { [key: string]: M00Json } | M00Json[];

export interface M00Result {
  ok: boolean;
  op: string;
  replayed?: boolean | undefined;
  data?: M00Json | undefined;
  error?: string | undefined;
  sqlstate?: string | undefined;
}

interface InvokeArgs {
  op: string;
  payload?: Record<string, unknown>;
  userId?: string | null;
  tenantId?: string | null;
  isPlatformAdmin?: boolean;
  idempotencyKey?: string | null;
}

async function dispatch(args: InvokeArgs): Promise<M00Result> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("m00_api", {
    p_op: args.op,
    p_payload: (args.payload ?? {}) as never,
    ...(args.userId ? { p_user_id: args.userId } : {}),
    ...(args.tenantId ? { p_tenant_id: args.tenantId } : {}),
    p_is_platform_admin: args.isPlatformAdmin ?? false,
    ...(args.idempotencyKey ? { p_idempotency_key: args.idempotencyKey } : {}),
  });
  if (error) return { ok: false, op: args.op, error: error.message };
  return data as unknown as M00Result;
}

/** Foundation status: counts only, safe for the unauthenticated console header. */
export const m00Status = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("m00_foundation_status");
  if (error) return { ok: false, error: error.message, data: null };
  return { ok: true, error: null, data: data as unknown as Record<string, number> };
});

/** Public catalogue reads (roles, permissions, matrix, geography, features, status). */
export const m00PublicRead = createServerFn({ method: "POST" })
  .inputValidator((input: { op: string }) => input)
  .handler(async ({ data }): Promise<M00Result> => {
    const spec = RUNTIME_OP_BY_NAME.get(data.op);
    if (!spec || spec.kind !== "read" || !spec.publicRead) {
      return { ok: false, op: data.op, error: "operation_requires_authentication" };
    }
    return dispatch({ op: data.op, isPlatformAdmin: true });
  });

/** Authenticated governed invocation of any declared runtime operation. */
export const m00Invoke = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      op: string;
      payload?: Record<string, unknown>;
      tenantId?: string | null;
      idempotencyKey?: string | null;
    }) => input,
  )
  .handler(async ({ data, context }): Promise<M00Result> => {
    const spec = RUNTIME_OP_BY_NAME.get(data.op);
    if (!spec) return { ok: false, op: data.op, error: "unsupported_operation" };
    // Local Development posture (CCL-008): every authenticated operator of this
    // workspace acts as a JET platform administrator. Tenant-scoped role
    // resolution lands with M05 tenant ownership.
    return dispatch({
      op: data.op,
      payload: data.payload ?? {},
      userId: context.userId,
      tenantId: data.tenantId ?? null,
      isPlatformAdmin: true,
      idempotencyKey: data.idempotencyKey ?? null,
    });
  });
