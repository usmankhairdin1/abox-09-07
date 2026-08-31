/**
 * M00 runtime operation catalogue.
 *
 * Every runtime operation implemented in the V008 governed entry point
 * (public.m00_api) is declared here and bound to the stable IDs it satisfies:
 * API operation IDs (API-M00-###), event contract IDs (EVT-M00-###) and the
 * capability that owns them. Nothing may execute that is not declared here.
 */

import { API_REGISTER, EVENT_REGISTER } from "./registers";

export type OpKind = "read" | "write";

export interface RuntimeOp {
  /** Dispatcher operation name passed to public.m00_api. */
  op: string;
  kind: OpKind;
  title: string;
  capability_id: string;
  /** API register IDs this operation serves. */
  api_ids: string[];
  /** Event contract IDs this operation emits. */
  event_ids: string[];
  /** Example payload used by the runtime console. */
  sample: Record<string, unknown>;
  /** Read ops marked public expose catalogue/aggregate data only. */
  publicRead?: boolean;
}

export const RUNTIME_OPS: RuntimeOp[] = [
  {
    op: "status",
    kind: "read",
    title: "Foundation health summary",
    capability_id: "CAP-M00-019",
    api_ids: ["API-M00-082"],
    event_ids: [],
    sample: {},
    publicRead: true,
  },
  {
    op: "context.resolve",
    kind: "read",
    title: "Resolve active context",
    capability_id: "CAP-M00-001",
    api_ids: ["API-M00-001", "API-M00-003"],
    event_ids: [],
    sample: {},
  },
  {
    op: "context.switch",
    kind: "write",
    title: "Switch administrative context",
    capability_id: "CAP-M00-001",
    api_ids: ["API-M00-002"],
    event_ids: ["EVT-M00-016"],
    sample: { tenant_id: null },
  },
  {
    op: "roles.list",
    kind: "read",
    title: "List fixed role templates",
    capability_id: "CAP-M00-005",
    api_ids: ["API-M00-013"],
    event_ids: [],
    sample: {},
    publicRead: true,
  },
  {
    op: "permissions.list",
    kind: "read",
    title: "List permission definitions",
    capability_id: "CAP-M00-005",
    api_ids: ["API-M00-013"],
    event_ids: [],
    sample: {},
    publicRead: true,
  },
  {
    op: "roles.matrix",
    kind: "read",
    title: "Role to permission matrix",
    capability_id: "CAP-M00-005",
    api_ids: ["API-M00-013"],
    event_ids: [],
    sample: {},
    publicRead: true,
  },
  {
    op: "geography.list",
    kind: "read",
    title: "Reference geography catalogue",
    capability_id: "CAP-M00-010",
    api_ids: ["API-M00-033"],
    event_ids: [],
    sample: {},
    publicRead: true,
  },
  {
    op: "features.list",
    kind: "read",
    title: "List feature controls",
    capability_id: "CAP-M00-009",
    api_ids: ["API-M00-029"],
    event_ids: [],
    sample: {},
    publicRead: true,
  },
  {
    op: "features.set",
    kind: "write",
    title: "Set feature control target",
    capability_id: "CAP-M00-009",
    api_ids: ["API-M00-030"],
    event_ids: ["EVT-M00-024"],
    sample: { feature_code: "planai.recommendations", environment: "local", target_type: "PLATFORM", enabled: true },
  },
  {
    op: "users.list",
    kind: "read",
    title: "List platform identities",
    capability_id: "CAP-M00-003",
    api_ids: ["API-M00-005"],
    event_ids: [],
    sample: {},
  },
  {
    op: "users.create",
    kind: "write",
    title: "Register identity and actor profile",
    capability_id: "CAP-M00-003",
    api_ids: ["API-M00-005", "API-M00-006"],
    event_ids: ["EVT-M00-001"],
    sample: { actor_type: "AGENT", account_status: "PENDING", primary_locale: "en-US" },
  },
  {
    op: "memberships.list",
    kind: "read",
    title: "List tenant memberships",
    capability_id: "CAP-M00-001",
    api_ids: ["API-M00-019", "API-M00-020"],
    event_ids: [],
    sample: {},
  },
  {
    op: "memberships.create",
    kind: "write",
    title: "Create tenant membership",
    capability_id: "CAP-M00-001",
    api_ids: ["API-M00-019"],
    event_ids: ["EVT-M00-015"],
    sample: { user_id: null, tenant_id: null, status: "ACTIVE" },
  },
  {
    op: "roles.assign",
    kind: "write",
    title: "Assign fixed role",
    capability_id: "CAP-M00-005",
    api_ids: ["API-M00-014"],
    event_ids: ["EVT-M00-013"],
    sample: { user_id: null, role_code: "JET_PLATFORM_ADMIN", tenant_id: null },
  },
  {
    op: "tasks.list",
    kind: "read",
    title: "List shared tasks (My Work)",
    capability_id: "CAP-M00-014",
    api_ids: ["API-M00-049"],
    event_ids: [],
    sample: {},
  },
  {
    op: "tasks.create",
    kind: "write",
    title: "Create shared task",
    capability_id: "CAP-M00-014",
    api_ids: ["API-M00-050"],
    event_ids: ["EVT-M00-038"],
    sample: { task_type: "REVIEW", related_record_type: "user_identity", priority: "NORMAL" },
  },
  {
    op: "tasks.transition",
    kind: "write",
    title: "Transition task state",
    capability_id: "CAP-M00-014",
    api_ids: ["API-M00-051"],
    event_ids: ["EVT-M00-040", "EVT-M00-041"],
    sample: { task_id: null, status: "COMPLETED" },
  },
  {
    op: "exceptions.list",
    kind: "read",
    title: "List exceptions",
    capability_id: "CAP-M00-015",
    api_ids: ["API-M00-053"],
    event_ids: [],
    sample: {},
  },
  {
    op: "exceptions.raise",
    kind: "write",
    title: "Open exception record",
    capability_id: "CAP-M00-015",
    api_ids: ["API-M00-053", "API-M00-054"],
    event_ids: ["EVT-M00-042"],
    sample: { exception_type: "INTEGRATION", severity: "MEDIUM", responsible_module_id: "M00" },
  },
  {
    op: "consent.record",
    kind: "write",
    title: "Record consent evidence",
    capability_id: "CAP-M00-011",
    api_ids: ["API-M00-035"],
    event_ids: ["EVT-M00-028"],
    sample: { consent_definition_id: null, capture_channel: "WEB", evidence_reference: "console" },
  },
  {
    op: "audit.list",
    kind: "read",
    title: "Read audit events",
    capability_id: "CAP-M00-013",
    api_ids: ["API-M00-047"],
    event_ids: [],
    sample: {},
  },
  {
    op: "events.list",
    kind: "read",
    title: "Read outbox event stream",
    capability_id: "CAP-M00-019",
    api_ids: ["API-M00-082"],
    event_ids: [],
    sample: {},
  },
  {
    op: "events.publish",
    kind: "write",
    title: "Publish envelope to outbox",
    capability_id: "CAP-M00-019",
    api_ids: ["API-M00-082"],
    event_ids: [],
    sample: { event_name: "abox.m00.usage.recorded.v1", aggregate_type: "platform", aggregate_id: "console", data: {} },
  },
  {
    op: "events.drain",
    kind: "write",
    title: "Drain outbox (publisher worker)",
    capability_id: "CAP-M00-019",
    api_ids: ["API-M00-082"],
    event_ids: [],
    sample: { batch_size: 50 },
  },
];

export const RUNTIME_OP_BY_NAME = new Map(RUNTIME_OPS.map((o) => [o.op, o]));

export const IMPLEMENTED_API_IDS = new Set(RUNTIME_OPS.flatMap((o) => o.api_ids));
export const IMPLEMENTED_EVENT_IDS = new Set(RUNTIME_OPS.flatMap((o) => o.event_ids));

export const RUNTIME_COVERAGE = {
  apiTotal: API_REGISTER.length,
  apiImplemented: IMPLEMENTED_API_IDS.size,
  eventTotal: EVENT_REGISTER.length,
  eventEmitted: IMPLEMENTED_EVENT_IDS.size,
  opsTotal: RUNTIME_OPS.length,
  writeOps: RUNTIME_OPS.filter((o) => o.kind === "write").length,
};

/** Migrations applied to the Local Development Cloud Postgres. */
export const MIGRATIONS = [
  { id: "V001", title: "Extensions, m00 schema, request-context functions", status: "APPLIED" },
  { id: "V002", title: "Canonical and technical tables (48)", status: "APPLIED" },
  { id: "V003", title: "Constraints, foreign keys, indexes", status: "APPLIED (2 defective statements held — CCL-004, CCL-005)" },
  { id: "V004", title: "Forced row level security on all tables", status: "APPLIED" },
  { id: "V005", title: "Versioning and tamper-protection triggers", status: "APPLIED" },
  { id: "V006", title: "Seed catalogues (roles, permissions, geography)", status: "APPLIED" },
  { id: "V007", title: "M01 compatibility read models (3 views)", status: "APPLIED" },
  { id: "V008", title: "Application runtime layer: request context, governed entry point, outbox publisher", status: "APPLIED (CCL-008)" },
];
