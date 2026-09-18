/**
 * M05 — Organization, Relationship and Multi-Tenant Model.
 *
 * No real backend exists yet (Supabase `public` schema is empty; M00's
 * tenancy/RLS migrations haven't been run — see governance/m00). This is
 * a sessionStorage-backed mock store shaped exactly like the M05
 * canonical object schemas (OBJ-M05-001..010), so swapping in real
 * Supabase queries later is a drop-in replacement, not a redesign.
 * Field names intentionally match the spec's JSON Schemas verbatim
 * (snake_case) rather than the app's usual camelCase.
 */
import { useSyncExternalStore } from "react";

export type OrganizationType = "JET_PLATFORM" | "AGENCY" | "EMPLOYER" | "CARRIER" | "VENDOR" | "PARTNER";
export type OrganizationStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ENDED";
export type RelationshipStatus = "PENDING" | "ACTIVE" | "ENDED";
export type ContactRole = "PRIMARY_BUSINESS" | "OPERATIONS" | "SUPPORT" | "COMPLIANCE";
export type LocationType = "HEADQUARTERS" | "OFFICE" | "MAILING";
export type IdentifierType =
  | "EIN" | "AGENCY_NPN" | "NAIC_CARRIER_CODE" | "JET_CUSTOMER_CODE"
  | "VENDOR_REFERENCE" | "PARTNER_REFERENCE" | "EXTERNAL_ORGANIZATION_CODE";
export type VerificationStatus = "UNVERIFIED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
export type ReadinessStatus = "NOT_EVALUATED" | "BLOCKED" | "READY_WITH_WARNINGS" | "READY";
export type ReadinessResult = "PASS" | "WARNING" | "FAIL" | "NOT_APPLICABLE";
export type Language = "EN" | "ES";

export const ORG_TYPE_LABEL: Record<OrganizationType, string> = {
  JET_PLATFORM: "JET Platform", AGENCY: "Agency", EMPLOYER: "Employer",
  CARRIER: "Carrier", VENDOR: "Vendor", PARTNER: "Partner",
};
export const COUNTRY_NAME: Record<number, string> = { 840: "United States" };

export interface Organization {
  organization_id: string;
  tenant_id: string;
  reference_code: string;
  organization_type: OrganizationType;
  legal_name: string;
  display_name: string;
  dba_name?: string;
  lifecycle_status: OrganizationStatus;
  time_zone: string;
  default_language: Language;
  version: number;
}

export interface OrganizationRelationship {
  relationship_id: string;
  tenant_id: string;
  parent_organization_id: string;
  child_organization_id: string;
  relationship_type: "PARENT_OF";
  status: RelationshipStatus;
  effective_from: string;
  effective_to?: string;
  version: number;
}

export interface OrganizationContact {
  contact_id: string;
  organization_id: string;
  contact_role: ContactRole;
  name: string;
  job_title?: string;
  email: string;
  telephone: string;
  preferred_language: Language;
  effective_from: string;
}

export interface OrganizationAddress {
  address_id: string;
  organization_id: string;
  location_type: LocationType;
  line_1: string;
  line_2?: string;
  city: string;
  state_code: string;
  postal_code: string;
  country_code: number;
  validated_status: VerificationStatus;
  effective_from: string;
}

export interface OrganizationExternalIdentifier {
  identifier_id: string;
  organization_id: string;
  identifier_type: IdentifierType;
  masked_value: string;
  source: string;
  verification_status: VerificationStatus;
  verified_at?: string;
  effective_from: string;
}

export interface OrganizationSetting {
  setting_id: string;
  organization_id: string;
  setting_key: string;
  value_json: unknown;
  source: "ROOT_DEFAULT" | "DOWNLINE_OVERRIDE" | "ROOT_OVERRIDE" | "JET_OVERRIDE";
  overridden_by_scope?: string;
  effective_from: string;
  version: number;
}

export interface OrganizationReadinessItem {
  readiness_item_id: string;
  readiness_id: string;
  control_code: string;
  result: ReadinessResult;
  owner_module: string;
  next_action?: string;
}

export interface OrganizationReadiness {
  readiness_id: string;
  organization_id: string;
  status: ReadinessStatus;
  blocking_count: number;
  warning_count: number;
  evaluated_at: string;
  policy_version: number;
  items: OrganizationReadinessItem[];
}

export interface OrganizationHistoryEntry {
  history_id: string;
  organization_id: string;
  when: string;
  actor: string;
  summary: string;
}

// ---- SCR-M05-026 fixed task/exception types (REQ-M05-OPS-014) ----
export type TaskType =
  | "DUPLICATE_REVIEW" | "PROFILE_GAP" | "MISSING_ADMINISTRATOR" | "INVALID_ADDRESS"
  | "IDENTIFIER_STATUS" | "RELATIONSHIP_CONFLICT" | "ACTIVATION_BLOCK"
  | "SUSPENSION_REVIEW" | "ENDING_REVIEW" | "MIGRATION" | "OPEN_WORK_BLOCK"
  | "DOWNSTREAM_PROFILE_UNAVAILABLE" | "PROPAGATION_FAILURE" | "PRIOR_MODULE_COMPATIBILITY";
export type TaskOwner = "ROOT" | "JET" | "DOWNLINE";
export type TaskStatus = "OPEN" | "RESOLVED" | "ESCALATED";

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  DUPLICATE_REVIEW: "Possible duplicate", PROFILE_GAP: "Profile gap",
  MISSING_ADMINISTRATOR: "Missing administrator", INVALID_ADDRESS: "Invalid address",
  IDENTIFIER_STATUS: "Identifier status", RELATIONSHIP_CONFLICT: "Relationship conflict",
  ACTIVATION_BLOCK: "Activation block", SUSPENSION_REVIEW: "Suspension review",
  ENDING_REVIEW: "Ending review", MIGRATION: "Migration", OPEN_WORK_BLOCK: "Open-work block",
  DOWNSTREAM_PROFILE_UNAVAILABLE: "Downstream profile unavailable",
  PROPAGATION_FAILURE: "Propagation failure", PRIOR_MODULE_COMPATIBILITY: "Prior-module compatibility",
};

export interface OrganizationTask {
  task_id: string;
  organization_id: string;
  task_type: TaskType;
  owner: TaskOwner;
  status: TaskStatus;
  description: string;
  created_at: string;
  resolved_at?: string;
  resolution?: string;
}

// ---- SCR-M05-029 reference organizations (REQ-M05-PRF-015/016/017) ----
export type ReferenceOrgType = "EMPLOYER" | "PARTNER" | "CARRIER" | "VENDOR";
export type ReferenceRequestStatus = "PENDING" | "LINKED" | "CREATED" | "REJECTED";

export interface ReferenceOrganizationRequest {
  request_id: string;
  tenant_id: string;
  requested_type: ReferenceOrgType;
  name: string;
  requested_by: string;
  status: ReferenceRequestStatus;
  created_at: string;
  resolution_note?: string;
  created_organization_id?: string;
}

// ---- SCR-M05-030 root/JET overrides (REQ-M05-OPS-018) ----
export interface OverrideRecord {
  override_id: string;
  organization_id: string;
  actor: string;
  authority: "ROOT" | "JET";
  target_field: string;
  before_value: string;
  after_value: string;
  reason_code: string;
  reason: string;
  effective_date: string;
  created_at: string;
}

// ---- SCR-M05-023/024 CSV imports (REQ-M05-OPS-007/008/009/010) ----
export interface ImportRow {
  row_number: number;
  display_name: string;
  legal_name: string;
  contact_name: string;
  contact_email: string;
  city: string;
  state_code: string;
  status: "VALID" | "ERROR";
  errors: string[];
  created_organization_id?: string;
}
export type ImportJobStatus = "VALIDATED" | "COMMITTED" | "FAILED";

export interface ImportJob {
  import_job_id: string;
  tenant_id: string;
  filename: string;
  status: ImportJobStatus;
  rows: ImportRow[];
  created_at: string;
  committed_at?: string;
}

interface OrgState {
  organizations: Organization[];
  relationships: OrganizationRelationship[];
  contacts: OrganizationContact[];
  addresses: OrganizationAddress[];
  identifiers: OrganizationExternalIdentifier[];
  settings: OrganizationSetting[];
  readiness: OrganizationReadiness[];
  history: OrganizationHistoryEntry[];
  tasks: OrganizationTask[];
  referenceRequests: ReferenceOrganizationRequest[];
  overrides: OverrideRecord[];
  importJobs: ImportJob[];
  /** null = acting as root; otherwise the selected downline org_id (SCR-M05-015). */
  contextOrganizationId: string | null;
}

export const TENANT_ID = "tenant-cedar-grove";
export const ROOT_ORGANIZATION_ID = "org-root-cedar-grove";

// Deterministic sequence — the edge runtime forbids generating random values
// in module global scope, and seed() runs at import time during SSR.
let ridSeq = 0;
function rid(prefix: string): string {
  ridSeq += 1;
  return `${prefix}-${ridSeq.toString(36).padStart(6, "0")}`;
}

function seed(): OrgState {
  const now = new Date().toISOString();
  const organizations: Organization[] = [
    {
      organization_id: ROOT_ORGANIZATION_ID, tenant_id: TENANT_ID, reference_code: "ORG-1001",
      organization_type: "AGENCY", legal_name: "Cedar Grove Insurance LLC", display_name: "Cedar Grove Insurance",
      lifecycle_status: "ACTIVE", time_zone: "America/New_York", default_language: "EN", version: 1,
    },
    {
      organization_id: "org-northwind", tenant_id: TENANT_ID, reference_code: "ORG-1002",
      organization_type: "AGENCY", legal_name: "Northwind Health Group Inc.", display_name: "Northwind Health Group",
      lifecycle_status: "ACTIVE", time_zone: "America/Chicago", default_language: "EN", version: 1,
    },
    {
      organization_id: "org-unioncoast", tenant_id: TENANT_ID, reference_code: "ORG-1003",
      organization_type: "AGENCY", legal_name: "Union Coast Marketplace LLC", display_name: "Union Coast Marketplace",
      lifecycle_status: "DRAFT", time_zone: "America/Los_Angeles", default_language: "EN", version: 1,
    },
  ];

  const relationships: OrganizationRelationship[] = [
    {
      relationship_id: rid("rel"), tenant_id: TENANT_ID, parent_organization_id: ROOT_ORGANIZATION_ID,
      child_organization_id: "org-northwind", relationship_type: "PARENT_OF", status: "ACTIVE",
      effective_from: "2026-02-01T00:00:00.000Z", version: 1,
    },
    {
      relationship_id: rid("rel"), tenant_id: TENANT_ID, parent_organization_id: ROOT_ORGANIZATION_ID,
      child_organization_id: "org-unioncoast", relationship_type: "PARENT_OF", status: "PENDING",
      effective_from: now, version: 1,
    },
  ];

  const contacts: OrganizationContact[] = [
    { contact_id: rid("ct"), organization_id: ROOT_ORGANIZATION_ID, contact_role: "PRIMARY_BUSINESS", name: "Elena Alvarez", job_title: "Agency Administrator", email: "elena@cedargrove.example", telephone: "+1 212-555-0142", preferred_language: "EN", effective_from: "2026-01-01T00:00:00.000Z" },
    { contact_id: rid("ct"), organization_id: "org-northwind", contact_role: "PRIMARY_BUSINESS", name: "Marcus Feld", job_title: "Managing Partner", email: "marcus@northwindhealth.example", telephone: "+1 312-555-0198", preferred_language: "EN", effective_from: "2026-02-01T00:00:00.000Z" },
  ];

  const addresses: OrganizationAddress[] = [
    { address_id: rid("addr"), organization_id: ROOT_ORGANIZATION_ID, location_type: "HEADQUARTERS", line_1: "48 Ledger Row", city: "New York", state_code: "NY", postal_code: "10004", country_code: 840, validated_status: "VERIFIED", effective_from: "2026-01-01T00:00:00.000Z" },
    { address_id: rid("addr"), organization_id: "org-northwind", location_type: "HEADQUARTERS", line_1: "900 Prairie Ave", city: "Chicago", state_code: "IL", postal_code: "60605", country_code: 840, validated_status: "VERIFIED", effective_from: "2026-02-01T00:00:00.000Z" },
  ];

  const identifiers: OrganizationExternalIdentifier[] = [
    { identifier_id: rid("id"), organization_id: ROOT_ORGANIZATION_ID, identifier_type: "EIN", masked_value: "••-•••1287", source: "Root intake", verification_status: "VERIFIED", verified_at: "2026-01-05T00:00:00.000Z", effective_from: "2026-01-01T00:00:00.000Z" },
    { identifier_id: rid("id"), organization_id: "org-northwind", identifier_type: "EIN", masked_value: "••-•••4410", source: "Downline intake", verification_status: "VERIFIED", verified_at: "2026-02-03T00:00:00.000Z", effective_from: "2026-02-01T00:00:00.000Z" },
  ];

  const settings: OrganizationSetting[] = [
    { setting_id: rid("set"), organization_id: ROOT_ORGANIZATION_ID, setting_key: "quote_expiration_days", value_json: 7, source: "ROOT_DEFAULT", effective_from: "2026-01-01T00:00:00.000Z", version: 1 },
    { setting_id: rid("set"), organization_id: "org-northwind", setting_key: "quote_expiration_days", value_json: 7, source: "ROOT_DEFAULT", effective_from: "2026-02-01T00:00:00.000Z", version: 1 },
  ];

  const readiness: OrganizationReadiness[] = [
    {
      readiness_id: rid("rdy"), organization_id: ROOT_ORGANIZATION_ID, status: "READY",
      blocking_count: 0, warning_count: 0, evaluated_at: now, policy_version: 1,
      items: [
        { readiness_item_id: rid("rdyi"), readiness_id: "root", control_code: "PROFILE_COMPLETE", result: "PASS", owner_module: "M05" },
        { readiness_item_id: rid("rdyi"), readiness_id: "root", control_code: "ADMINISTRATOR_ASSIGNED", result: "PASS", owner_module: "M00" },
        { readiness_item_id: rid("rdyi"), readiness_id: "root", control_code: "IDENTIFIER_VERIFIED", result: "PASS", owner_module: "M05" },
      ],
    },
    {
      readiness_id: rid("rdy"), organization_id: "org-northwind", status: "READY",
      blocking_count: 0, warning_count: 0, evaluated_at: now, policy_version: 1,
      items: [
        { readiness_item_id: rid("rdyi"), readiness_id: "nw", control_code: "PROFILE_COMPLETE", result: "PASS", owner_module: "M05" },
        { readiness_item_id: rid("rdyi"), readiness_id: "nw", control_code: "ADMINISTRATOR_ASSIGNED", result: "PASS", owner_module: "M00" },
        { readiness_item_id: rid("rdyi"), readiness_id: "nw", control_code: "IDENTIFIER_VERIFIED", result: "PASS", owner_module: "M05" },
      ],
    },
    {
      readiness_id: rid("rdy"), organization_id: "org-unioncoast", status: "BLOCKED",
      blocking_count: 2, warning_count: 1, evaluated_at: now, policy_version: 1,
      items: [
        { readiness_item_id: rid("rdyi"), readiness_id: "uc", control_code: "PROFILE_COMPLETE", result: "WARNING", owner_module: "M05", next_action: "Add headquarters address" },
        { readiness_item_id: rid("rdyi"), readiness_id: "uc", control_code: "ADMINISTRATOR_ASSIGNED", result: "FAIL", owner_module: "M00", next_action: "Invite an initial administrator" },
        { readiness_item_id: rid("rdyi"), readiness_id: "uc", control_code: "IDENTIFIER_VERIFIED", result: "FAIL", owner_module: "M05", next_action: "Submit EIN for verification" },
      ],
    },
  ];

  const history: OrganizationHistoryEntry[] = [
    { history_id: rid("hist"), organization_id: ROOT_ORGANIZATION_ID, when: "2026-01-01T00:00:00.000Z", actor: "System", summary: "Tenant-owning root agency established." },
    { history_id: rid("hist"), organization_id: "org-northwind", when: "2026-02-01T00:00:00.000Z", actor: "Elena Alvarez", summary: "Direct downline activated." },
  ];

  const tasks: OrganizationTask[] = [
    { task_id: rid("task"), organization_id: "org-unioncoast", task_type: "MISSING_ADMINISTRATOR", owner: "ROOT", status: "OPEN", description: "Union Coast Marketplace has no accepted, active administrator yet.", created_at: now },
    { task_id: rid("task"), organization_id: "org-unioncoast", task_type: "IDENTIFIER_STATUS", owner: "ROOT", status: "OPEN", description: "Submitted EIN for Union Coast Marketplace has not been verified.", created_at: now },
    { task_id: rid("task"), organization_id: "org-unioncoast", task_type: "PROFILE_GAP", owner: "DOWNLINE", status: "OPEN", description: "Union Coast Marketplace is missing a headquarters address.", created_at: now },
  ];

  return {
    organizations, relationships, contacts, addresses, identifiers, settings, readiness, history,
    tasks, referenceRequests: [], overrides: [], importJobs: [], contextOrganizationId: null,
  };
}

const STORAGE_KEY = "abox_org_v1";
const SEQ_KEY = "abox_org_v1_seq";

function persist(s: OrgState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    // The id sequence is part of the persisted state: without it the counter
    // restarts at 0 on every full-page load and reissues ids that records
    // already stored in this session own.
    window.sessionStorage.setItem(SEQ_KEY, String(ridSeq));
  } catch { /* noop */ }
}
function load(): OrgState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const storedSeq = Number(window.sessionStorage.getItem(SEQ_KEY));
      if (Number.isFinite(storedSeq) && storedSeq > ridSeq) ridSeq = storedSeq;
      return JSON.parse(raw) as OrgState;
    }
  } catch {
    // fall through to reseed
  }
  // seed() generates random ids on every call — persist immediately so a
  // fresh tab's data stays stable across full-page loads instead of
  // reseeding (with new random ids) on every navigation.
  const fresh = seed();
  persist(fresh);
  return fresh;
}

let state: OrgState = load();
const listeners = new Set<() => void>();
function notify() { for (const l of listeners) l(); }

export const orgStore = {
  get: () => state,
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },

  addOrganization(org: Organization) {
    state = { ...state, organizations: [...state.organizations, org] }; persist(state); notify();
  },
  addRelationship(rel: OrganizationRelationship) {
    state = { ...state, relationships: [...state.relationships, rel] }; persist(state); notify();
  },
  addContact(c: OrganizationContact) {
    state = { ...state, contacts: [...state.contacts, c] }; persist(state); notify();
  },
  addAddress(a: OrganizationAddress) {
    state = { ...state, addresses: [...state.addresses, a] }; persist(state); notify();
  },
  addIdentifier(i: OrganizationExternalIdentifier) {
    state = { ...state, identifiers: [...state.identifiers, i] }; persist(state); notify();
  },
  addSetting(s: OrganizationSetting) {
    state = { ...state, settings: [...state.settings, s] }; persist(state); notify();
  },
  setReadiness(r: OrganizationReadiness) {
    state = { ...state, readiness: [...state.readiness.filter((x) => x.organization_id !== r.organization_id), r] };
    persist(state); notify();
  },
  addHistory(h: OrganizationHistoryEntry) {
    state = { ...state, history: [h, ...state.history] }; persist(state); notify();
  },
  setContext(organizationId: string | null) {
    state = { ...state, contextOrganizationId: organizationId }; persist(state); notify();
  },
  updateOrganization(id: string, patch: Partial<Organization>) {
    state = { ...state, organizations: state.organizations.map((o) => (o.organization_id === id ? { ...o, ...patch, version: o.version + 1 } : o)) };
    persist(state); notify();
  },
  updateContact(id: string, patch: Partial<OrganizationContact>) {
    state = { ...state, contacts: state.contacts.map((c) => (c.contact_id === id ? { ...c, ...patch } : c)) };
    persist(state); notify();
  },
  updateSetting(id: string, patch: Partial<OrganizationSetting>) {
    state = { ...state, settings: state.settings.map((s) => (s.setting_id === id ? { ...s, ...patch, version: s.version + 1 } : s)) };
    persist(state); notify();
  },
  updateIdentifier(id: string, patch: Partial<OrganizationExternalIdentifier>) {
    state = { ...state, identifiers: state.identifiers.map((i) => (i.identifier_id === id ? { ...i, ...patch } : i)) };
    persist(state); notify();
  },
  recalculateReadiness(orgId: string) {
    const r = computeReadiness(state, orgId);
    state = { ...state, readiness: [...state.readiness.filter((x) => x.organization_id !== orgId), r] };
    persist(state); notify();
  },
  markAdministratorActive(orgId: string, actor: string) {
    const existing = getReadiness(state, orgId);
    const items = (existing?.items ?? []).map((i) =>
      i.control_code === "ADMINISTRATOR_ASSIGNED" ? { ...i, result: "PASS" as ReadinessResult, next_action: undefined } : i,
    );
    const blocking = items.filter((i) => i.result === "FAIL").length;
    const warning = items.filter((i) => i.result === "WARNING").length;
    const status: ReadinessStatus = blocking > 0 ? "BLOCKED" : warning > 0 ? "READY_WITH_WARNINGS" : "READY";
    const r: OrganizationReadiness = {
      readiness_id: existing?.readiness_id ?? rid("rdy"), organization_id: orgId, status,
      blocking_count: blocking, warning_count: warning, evaluated_at: new Date().toISOString(),
      policy_version: (existing?.policy_version ?? 0) + 1, items,
    };
    state = { ...state, readiness: [...state.readiness.filter((x) => x.organization_id !== orgId), r] };
    persist(state); notify();
    orgStore.addHistory({ history_id: rid("hist"), organization_id: orgId, when: new Date().toISOString(), actor, summary: "Initial administrator marked active; readiness control satisfied." });
    orgStore.resolveTasksByType(orgId, "MISSING_ADMINISTRATOR", actor, "Administrator confirmed active.");
  },

  addTask(t: OrganizationTask) {
    state = { ...state, tasks: [t, ...state.tasks] }; persist(state); notify();
  },
  resolveTask(taskId: string, resolution: string) {
    state = { ...state, tasks: state.tasks.map((t) => (t.task_id === taskId ? { ...t, status: "RESOLVED" as TaskStatus, resolved_at: new Date().toISOString(), resolution } : t)) };
    persist(state); notify();
  },
  escalateTask(taskId: string) {
    state = { ...state, tasks: state.tasks.map((t) => (t.task_id === taskId ? { ...t, status: "ESCALATED" as TaskStatus, owner: "JET" as TaskOwner } : t)) };
    persist(state); notify();
  },
  resolveTasksByType(orgId: string, type: TaskType, actor: string, resolution: string) {
    state = {
      ...state,
      tasks: state.tasks.map((t) => (t.organization_id === orgId && t.task_type === type && t.status === "OPEN"
        ? { ...t, status: "RESOLVED" as TaskStatus, resolved_at: new Date().toISOString(), resolution } : t)),
    };
    persist(state); notify();
  },

  addReferenceRequest(r: ReferenceOrganizationRequest) {
    state = { ...state, referenceRequests: [r, ...state.referenceRequests] }; persist(state); notify();
  },
  resolveReferenceRequest(requestId: string, status: ReferenceRequestStatus, note: string, createdOrganizationId?: string) {
    state = {
      ...state,
      referenceRequests: state.referenceRequests.map((r) => (r.request_id === requestId
        ? { ...r, status, resolution_note: note, created_organization_id: createdOrganizationId } : r)),
    };
    persist(state); notify();
  },

  addOverride(o: OverrideRecord) {
    state = { ...state, overrides: [o, ...state.overrides] }; persist(state); notify();
  },

  createImportJob(job: ImportJob) {
    state = { ...state, importJobs: [job, ...state.importJobs] }; persist(state); notify();
  },
  commitImportJob(jobId: string, actor: string) {
    const job = state.importJobs.find((j) => j.import_job_id === jobId);
    if (!job) return;
    const now = new Date().toISOString();
    const updatedRows = job.rows.map((row) => {
      if (row.status !== "VALID") return row;
      const organizationId = rid("org");
      orgStore.addOrganization({
        organization_id: organizationId, tenant_id: TENANT_ID, reference_code: `ORG-${1000 + Math.floor(Math.random() * 8999)}`,
        organization_type: "AGENCY", legal_name: row.legal_name, display_name: row.display_name,
        lifecycle_status: "DRAFT", time_zone: "America/New_York", default_language: "EN", version: 1,
      });
      orgStore.addRelationship({
        relationship_id: rid("rel"), tenant_id: TENANT_ID, parent_organization_id: ROOT_ORGANIZATION_ID,
        child_organization_id: organizationId, relationship_type: "PARENT_OF", status: "ACTIVE", effective_from: now, version: 1,
      });
      orgStore.addContact({
        contact_id: rid("ct"), organization_id: organizationId, contact_role: "PRIMARY_BUSINESS",
        name: row.contact_name, email: row.contact_email, telephone: "", preferred_language: "EN", effective_from: now,
      });
      if (row.city && row.state_code) {
        orgStore.addAddress({
          address_id: rid("addr"), organization_id: organizationId, location_type: "HEADQUARTERS",
          line_1: "Pending update", city: row.city, state_code: row.state_code, postal_code: "", country_code: 840,
          validated_status: "UNVERIFIED", effective_from: now,
        });
      }
      orgStore.recalculateReadiness(organizationId);
      orgStore.addHistory({ history_id: rid("hist"), organization_id: organizationId, when: now, actor, summary: `Imported via CSV batch ${job.filename} as DRAFT.` });
      return { ...row, created_organization_id: organizationId };
    });
    state = {
      ...state,
      importJobs: state.importJobs.map((j) => (j.import_job_id === jobId ? { ...j, status: "COMMITTED" as ImportJobStatus, rows: updatedRows, committed_at: now } : j)),
    };
    persist(state); notify();
  },

  suspendOrganization(orgId: string, actor: string, reason: string, effectiveDate: string) {
    orgStore.updateOrganization(orgId, { lifecycle_status: "SUSPENDED" });
    orgStore.addHistory({ history_id: rid("hist"), organization_id: orgId, when: new Date().toISOString(), actor, summary: `Suspended effective ${effectiveDate}. Reason: ${reason}` });
  },
  reactivateOrganization(orgId: string, actor: string, note: string) {
    orgStore.updateOrganization(orgId, { lifecycle_status: "ACTIVE" });
    orgStore.addHistory({ history_id: rid("hist"), organization_id: orgId, when: new Date().toISOString(), actor, summary: `Reactivated. ${note}` });
  },
  endOrganization(orgId: string, actor: string, reason: string) {
    const now = new Date().toISOString();
    orgStore.updateOrganization(orgId, { lifecycle_status: "ENDED" });
    state = {
      ...state,
      relationships: state.relationships.map((r) => (r.child_organization_id === orgId && r.status !== "ENDED" ? { ...r, status: "ENDED" as RelationshipStatus, effective_to: now } : r)),
    };
    persist(state); notify();
    if (state.contextOrganizationId === orgId) orgStore.setContext(null);
    orgStore.addHistory({ history_id: rid("hist"), organization_id: orgId, when: now, actor, summary: `Ended and offboarded. Reason: ${reason}` });
  },

  applyRootDefaults(settingKeys: string[], targetOrgIds: string[], actor: string) {
    const now = new Date().toISOString();
    for (const orgId of targetOrgIds) {
      for (const key of settingKeys) {
        const rootSetting = state.settings.find((s) => s.organization_id === ROOT_ORGANIZATION_ID && s.setting_key === key);
        if (!rootSetting) continue;
        const existing = state.settings.find((s) => s.organization_id === orgId && s.setting_key === key);
        if (existing) {
          orgStore.updateSetting(existing.setting_id, { value_json: rootSetting.value_json, source: "ROOT_DEFAULT" });
        } else {
          orgStore.addSetting({
            setting_id: rid("set"), organization_id: orgId, setting_key: key, value_json: rootSetting.value_json,
            source: "ROOT_DEFAULT", effective_from: now, version: 1,
          });
        }
      }
      orgStore.addHistory({ history_id: rid("hist"), organization_id: orgId, when: now, actor, summary: `Root defaults applied for: ${settingKeys.join(", ")}.` });
    }
  },
};

// Stable reference for getServerSnapshot — calling seed() fresh on every
// invocation would return a new object each time, which useSyncExternalStore
// requires NOT to do (causes an infinite re-render loop on the client).
const SERVER_STATE = seed();

export function useOrgState() {
  return useSyncExternalStore(
    orgStore.subscribe,
    () => orgStore.get(),
    () => SERVER_STATE,
  );
}

// ---- Selectors ----
export function getOrganization(state: OrgState, id: string): Organization | undefined {
  return state.organizations.find((o) => o.organization_id === id);
}
export function getDirectDownlines(state: OrgState, parentId: string): Organization[] {
  const childIds = new Set(
    state.relationships.filter((r) => r.parent_organization_id === parentId && r.status !== "ENDED").map((r) => r.child_organization_id),
  );
  return state.organizations.filter((o) => childIds.has(o.organization_id));
}
export function getRelationship(state: OrgState, childId: string): OrganizationRelationship | undefined {
  return state.relationships.find((r) => r.child_organization_id === childId);
}
export function getContacts(state: OrgState, orgId: string): OrganizationContact[] {
  return state.contacts.filter((c) => c.organization_id === orgId);
}
export function getAddresses(state: OrgState, orgId: string): OrganizationAddress[] {
  return state.addresses.filter((a) => a.organization_id === orgId);
}
export function getIdentifiers(state: OrgState, orgId: string): OrganizationExternalIdentifier[] {
  return state.identifiers.filter((i) => i.organization_id === orgId);
}
export function getSettings(state: OrgState, orgId: string): OrganizationSetting[] {
  return state.settings.filter((s) => s.organization_id === orgId);
}
export function getReadiness(state: OrgState, orgId: string): OrganizationReadiness | undefined {
  return state.readiness.find((r) => r.organization_id === orgId);
}
export function getHistory(state: OrgState, orgId: string): OrganizationHistoryEntry[] {
  return state.history.filter((h) => h.organization_id === orgId);
}
export function getTasks(state: OrgState, orgId?: string): OrganizationTask[] {
  return orgId ? state.tasks.filter((t) => t.organization_id === orgId) : state.tasks;
}
export function getOpenTaskCount(state: OrgState, orgId: string): number {
  return state.tasks.filter((t) => t.organization_id === orgId && t.status === "OPEN").length;
}
export function getReferenceRequests(state: OrgState): ReferenceOrganizationRequest[] {
  return state.referenceRequests;
}
export function getOverrides(state: OrgState, orgId: string): OverrideRecord[] {
  return state.overrides.filter((o) => o.organization_id === orgId);
}
export function getAllOverrides(state: OrgState): OverrideRecord[] {
  return state.overrides;
}
export function getImportJobs(state: OrgState): ImportJob[] {
  return state.importJobs;
}
export function getImportJob(state: OrgState, id: string): ImportJob | undefined {
  return state.importJobs.find((j) => j.import_job_id === id);
}
export function getRelationshipHistory(state: OrgState, orgId: string): OrganizationRelationship[] {
  return state.relationships.filter((r) => r.child_organization_id === orgId);
}

/** Derives PROFILE_COMPLETE and IDENTIFIER_VERIFIED from current data; carries forward
 *  the ADMINISTRATOR_ASSIGNED control as-is since M00 membership isn't tracked in this mock. */
export function computeReadiness(state: OrgState, orgId: string): OrganizationReadiness {
  const existing = getReadiness(state, orgId);
  const contacts = getContacts(state, orgId);
  const addresses = getAddresses(state, orgId);
  const identifiers = getIdentifiers(state, orgId);
  const hasHq = addresses.some((a) => a.location_type === "HEADQUARTERS");
  const hasPrimaryContact = contacts.some((c) => c.contact_role === "PRIMARY_BUSINESS");
  const verifiedIdentifier = identifiers.some((i) => i.verification_status === "VERIFIED");
  const adminItem = existing?.items.find((i) => i.control_code === "ADMINISTRATOR_ASSIGNED");

  const items: OrganizationReadinessItem[] = [
    {
      readiness_item_id: rid("rdyi"), readiness_id: orgId, control_code: "PROFILE_COMPLETE", owner_module: "M05",
      result: hasHq && hasPrimaryContact ? "PASS" : "FAIL",
      next_action: hasHq && hasPrimaryContact ? undefined : !hasHq ? "Add a headquarters address" : "Add a primary business contact",
    },
    {
      readiness_item_id: rid("rdyi"), readiness_id: orgId, control_code: "ADMINISTRATOR_ASSIGNED", owner_module: "M00",
      result: adminItem?.result ?? "FAIL",
      next_action: (adminItem?.result ?? "FAIL") === "PASS" ? undefined : (adminItem?.next_action ?? "Invite an initial administrator"),
    },
    {
      readiness_item_id: rid("rdyi"), readiness_id: orgId, control_code: "IDENTIFIER_VERIFIED", owner_module: "M05",
      result: verifiedIdentifier ? "PASS" : identifiers.length ? "WARNING" : "FAIL",
      next_action: verifiedIdentifier ? undefined : identifiers.length ? "Awaiting identifier verification" : "Submit an external identifier for verification",
    },
  ];
  const blocking = items.filter((i) => i.result === "FAIL").length;
  const warning = items.filter((i) => i.result === "WARNING").length;
  const status: ReadinessStatus = blocking > 0 ? "BLOCKED" : warning > 0 ? "READY_WITH_WARNINGS" : "READY";
  return {
    readiness_id: existing?.readiness_id ?? rid("rdy"), organization_id: orgId, status,
    blocking_count: blocking, warning_count: warning, evaluated_at: new Date().toISOString(),
    policy_version: (existing?.policy_version ?? 0) + 1, items,
  };
}
