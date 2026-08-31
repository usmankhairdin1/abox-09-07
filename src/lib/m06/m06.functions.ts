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
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface M06Result {
  ok: boolean;
  code?: string;
  reason?: string;
  permission?: string;
  data?: unknown;
}

export const M06_OPERATIONS = [
  "workforce.profile.list",
  "workforce.profile.get",
  "workforce.profile.create",
  "workforce.profile.update",
  "workforce.lifecycle.transition",
  "workforce.lifecycle.case.open",
  "workforce.lifecycle.case.complete",
  "workforce.lifecycle.case.list",
  "affiliation.create",
  "affiliation.end",
  "affiliation.list",
  "group.create",
  "group.list",
  "membership.add",
  "availability.declare",
  "servicescope.set",
  "readiness.evaluate",
  "readiness.list",
  "note.add",
  "note.list",
  "exception.open",
  "exception.resolve",
  "exception.list",
  "history.list",
] as const;

export type M06Operation = (typeof M06_OPERATIONS)[number];

export const m06Invoke = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      op: string;
      payload?: Record<string, unknown>;
      tenantId?: string | null;
      organizationId?: string | null;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    if (!(M06_OPERATIONS as readonly string[]).includes(data.op)) {
      return { ok: false, code: "UNSUPPORTED_OPERATION", reason: data.op } as M06Result as never;
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("lucie_m06_api", {
      p_op: data.op,
      p_payload: (data.payload ?? {}) as never,
      p_user_id: context.userId,
      ...(data.tenantId ? { p_tenant_id: data.tenantId } : {}),
      ...(data.organizationId ? { p_organization_id: data.organizationId } : {}),
      // Local Development posture (CCL-M06-002): the authenticated workspace
      // operator acts as JET platform administrator until M00 custom roles land.
      p_is_platform_admin: true,
    });
    if (error) {
      return { ok: false, code: "RPC_ERROR", reason: error.message } as M06Result as never;
    }
    return (result ?? { ok: false, code: "EMPTY_RESPONSE" }) as never;
  });

