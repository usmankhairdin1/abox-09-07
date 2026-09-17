/**
 * M04 — Marketplace Management and White Labeling.
 *
 * Same posture as org-store.ts (see M05): no real backend yet, so this is
 * a sessionStorage-backed mock store shaped like the M04 canonical object
 * model (Marketplace, MarketplaceRelease, Brand, Content, Asset, Domain,
 * AvailabilityEntry, Participant, ReferralLink, Readiness, Tasks, History,
 * Overrides, Health) so a real Supabase-backed swap later is a drop-in
 * replacement. One marketplace exists, owned by the M05 tenant-owning
 * root (Cedar Grove Insurance) — REQ-M04-MKT-002 one marketplace per tenant.
 */
import { useSyncExternalStore } from "react";
import { TENANT_ID, ROOT_ORGANIZATION_ID } from "@/lib/org-store";

export type MarketplaceLifecycle = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ENDED";
export type ReleaseStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "SUPERSEDED";
export type Language = "EN" | "ES";
export type ProductLine = "IFP_ON_EXCHANGE" | "IFP_OFF_EXCHANGE" | "DENTAL" | "VISION" | "ICHRA_EMPLOYER_QUOTING";
export type MarketplaceChannel = "CONSUMER_DIRECT" | "AGENT" | "EMPLOYER";
export type DomainType = "JET_SUBDOMAIN" | "CUSTOM";
export type DomainStatus = "REQUESTED" | "ACTION_REQUIRED" | "VERIFIED" | "ACTIVE" | "SUSPENDED" | "RETIRED";
export type ParticipationState = "NOT_ENABLED" | "PENDING_READINESS" | "ENABLED" | "SUSPENDED";
export type ReferralLinkType = "ORGANIZATION" | "AGENT";
export type ReferralLinkStatus = "ACTIVE" | "REVOKED" | "REPLACED";
export type ReadinessResult = "PASS" | "WARNING" | "FAIL" | "NOT_APPLICABLE";
export type ReadinessStatus = "NOT_EVALUATED" | "BLOCKED" | "READY_WITH_WARNINGS" | "READY";

export const PRODUCT_LINE_LABEL: Record<ProductLine, string> = {
  IFP_ON_EXCHANGE: "IFP — on exchange", IFP_OFF_EXCHANGE: "IFP — off exchange",
  DENTAL: "Dental", VISION: "Vision", ICHRA_EMPLOYER_QUOTING: "ICHRA employer quoting",
};
export const CHANNEL_LABEL: Record<MarketplaceChannel, string> = {
  CONSUMER_DIRECT: "Consumer-direct", AGENT: "Agent-assisted", EMPLOYER: "Employer",
};

export interface Marketplace {
  marketplace_id: string;
  tenant_id: string;
  owner_organization_id: string;
  internal_code: string;
  lifecycle_status: MarketplaceLifecycle;
  default_language: Language;
  version: number;
}

export interface MarketplaceRelease {
  release_id: string;
  marketplace_id: string;
  status: ReleaseStatus;
  brand_id: string;
  content_id: string;
  availability_version: number;
  effective_from?: string;
  published_by?: string;
  published_at?: string;
}

export interface Brand {
  brand_id: string;
  marketplace_id: string;
  status: "DRAFT" | "ACTIVE" | "SUPERSEDED";
  display_name: string;
  tagline_en: string;
  tagline_es: string;
  headline_en: string;
  headline_es: string;
  intro_en: string;
  intro_es: string;
  primary_color: string;
  accent_color: string;
  logo_asset_id?: string;
  favicon_asset_id?: string;
  hero_asset_id?: string;
  version: number;
}

export type AssetType = "LOGO" | "MARK" | "FAVICON" | "HERO";
export interface MarketplaceAsset {
  asset_id: string;
  marketplace_id: string;
  asset_type: AssetType;
  filename: string;
  status: "VALID" | "INVALID" | "SCANNING";
  uploaded_at: string;
}

export interface MarketplaceContent {
  content_id: string;
  marketplace_id: string;
  status: "DRAFT" | "ACTIVE" | "SUPERSEDED";
  support_intro_en: string;
  support_intro_es: string;
  channel_intro_en: Partial<Record<MarketplaceChannel, string>>;
  channel_intro_es: Partial<Record<MarketplaceChannel, string>>;
  support_display_name: string;
  support_phone: string;
  support_email: string;
  support_hours: string;
  version: number;
}

export interface MarketplaceDomain {
  domain_id: string;
  marketplace_id: string;
  domain_type: DomainType;
  hostname: string;
  status: DomainStatus;
  is_primary: boolean;
  requested_at: string;
  verified_at?: string;
  activated_at?: string;
}

export interface AvailabilityEntry {
  availability_entry_id: string;
  marketplace_id: string;
  state_code: string;
  product_line: ProductLine;
  carrier_name: string;
  channels: MarketplaceChannel[];
  status: "ENABLED" | "DISABLED";
  version: "DRAFT" | "ACTIVE" | "SUPERSEDED";
  blockers: string[];
}

export interface Participant {
  participant_id: string;
  marketplace_id: string;
  organization_id: string;
  participation_state: ParticipationState;
  channels: MarketplaceChannel[];
  support_identity_preference: "ROOT" | "OWN";
  effective_from: string;
}

export interface ReferralLink {
  referral_link_id: string;
  marketplace_id: string;
  link_type: ReferralLinkType;
  participant_id?: string;
  agent_name?: string;
  channel: MarketplaceChannel;
  product_line?: ProductLine;
  token: string;
  status: ReferralLinkStatus;
  created_at: string;
  last_used_at?: string;
  use_count: number;
}

export interface ReadinessItem {
  readiness_item_id: string;
  control_code: string;
  result: ReadinessResult;
  owner_module: string;
  next_action?: string;
}
export interface Readiness {
  readiness_id: string;
  marketplace_id: string;
  status: ReadinessStatus;
  blocking_count: number;
  warning_count: number;
  evaluated_at: string;
  policy_version: number;
  items: ReadinessItem[];
}

export type MktTaskType =
  | "MISSING_ASSETS" | "INCOMPLETE_LANGUAGE" | "INACCESSIBLE_COLORS" | "INVALID_DOMAIN"
  | "MISSING_SUPPORT" | "NO_ENTITLED_CHANNEL" | "NO_READY_PRODUCT" | "NO_ELIGIBLE_PARTICIPANT"
  | "INVALID_LINK" | "UNAVAILABLE_PARTICIPANT" | "ROUTING_CONFLICT" | "BLOCKED_SCHEDULE"
  | "PROPAGATION_FAILURE" | "UNAPPROVED_DELTA" | "SUSPENSION_REVIEW" | "ENDING_REVIEW";
export const MKT_TASK_LABEL: Record<MktTaskType, string> = {
  MISSING_ASSETS: "Missing assets", INCOMPLETE_LANGUAGE: "Incomplete language",
  INACCESSIBLE_COLORS: "Inaccessible colors", INVALID_DOMAIN: "Invalid domain",
  MISSING_SUPPORT: "Missing support", NO_ENTITLED_CHANNEL: "No entitled channel",
  NO_READY_PRODUCT: "No ready product", NO_ELIGIBLE_PARTICIPANT: "No eligible participant",
  INVALID_LINK: "Invalid link", UNAVAILABLE_PARTICIPANT: "Unavailable participant",
  ROUTING_CONFLICT: "Routing conflict", BLOCKED_SCHEDULE: "Blocked schedule",
  PROPAGATION_FAILURE: "Propagation failure", UNAPPROVED_DELTA: "Unapproved prior-module delta",
  SUSPENSION_REVIEW: "Suspension review", ENDING_REVIEW: "Ending review",
};
export type TaskOwner = "ROOT" | "JET" | "SOURCE_MODULE";
export type TaskStatus = "OPEN" | "RESOLVED" | "ESCALATED";
export interface MarketplaceTask {
  task_id: string;
  marketplace_id: string;
  task_type: MktTaskType;
  owner: TaskOwner;
  status: TaskStatus;
  description: string;
  created_at: string;
  resolved_at?: string;
  resolution?: string;
}

export interface MarketplaceHistoryEntry {
  history_id: string;
  marketplace_id: string;
  when: string;
  actor: string;
  summary: string;
}

export interface MarketplaceOverride {
  override_id: string;
  marketplace_id: string;
  actor: string;
  reason_code: string;
  reason: string;
  target: string;
  before_value: string;
  after_value: string;
  created_at: string;
}

export type HealthArea = "RELEASE" | "ROUTE" | "CONTENT" | "PRODUCT" | "PARTICIPANT" | "PROPAGATION" | "PRIOR_MODULE";
export interface HealthCheck {
  health_id: string;
  marketplace_id: string;
  area: HealthArea;
  status: "HEALTHY" | "DEGRADED" | "FAILED";
  detail: string;
  checked_at: string;
}

interface MktState {
  marketplaces: Marketplace[];
  releases: MarketplaceRelease[];
  brands: Brand[];
  assets: MarketplaceAsset[];
  content: MarketplaceContent[];
  domains: MarketplaceDomain[];
  availability: AvailabilityEntry[];
  participants: Participant[];
  referralLinks: ReferralLink[];
  readiness: Readiness[];
  tasks: MarketplaceTask[];
  history: MarketplaceHistoryEntry[];
  overrides: MarketplaceOverride[];
  health: HealthCheck[];
  previewMode: boolean;
}

export const MARKETPLACE_ID = "mkt-cedar-grove";

// Deterministic sequence — the edge runtime forbids generating random values
// in module global scope, and seed() runs at import time during SSR.
let ridSeq = 0;
function rid(prefix: string): string {
  ridSeq += 1;
  return `${prefix}-${ridSeq.toString(36).padStart(6, "0")}`;
}

function seed(): MktState {
  const now = new Date().toISOString();

  const marketplaces: Marketplace[] = [{
    marketplace_id: MARKETPLACE_ID, tenant_id: TENANT_ID, owner_organization_id: ROOT_ORGANIZATION_ID,
    internal_code: "MKT-1001", lifecycle_status: "ACTIVE", default_language: "EN", version: 3,
  }];

  const brands: Brand[] = [{
    brand_id: "brand-active-001", marketplace_id: MARKETPLACE_ID, status: "ACTIVE",
    display_name: "ABox", tagline_en: "Agency in a Box", tagline_es: "Agencia en una Caja",
    headline_en: "Insurance, turns to you.", headline_es: "Seguro, hecho a tu medida.",
    intro_en: "Health, dental, vision, life — compared side by side. PlanAI helps you think it through without pushing. If you'd rather talk to a person, a licensed agent is one tap away.",
    intro_es: "Salud, dental, visión, vida — comparados uno al lado del otro. PlanAI te ayuda a pensarlo sin presionar. Si prefieres hablar con una persona, un agente con licencia está a un toque de distancia.",
    primary_color: "#c05a2e", accent_color: "#2e6b5e", version: 3,
  }];

  const content: MarketplaceContent[] = [{
    content_id: "content-active-001", marketplace_id: MARKETPLACE_ID, status: "ACTIVE",
    support_intro_en: "Our team is here to help you find the right plan.",
    support_intro_es: "Nuestro equipo está aquí para ayudarte a encontrar el plan adecuado.",
    channel_intro_en: { CONSUMER_DIRECT: "Shop on your own, with PlanAI alongside.", AGENT: "Get matched with a licensed agent.", EMPLOYER: "Set an allowance; your team picks the plan." },
    channel_intro_es: { CONSUMER_DIRECT: "Compra por tu cuenta, con PlanAI a tu lado.", AGENT: "Conéctate con un agente con licencia.", EMPLOYER: "Establece una asignación; tu equipo elige el plan." },
    support_display_name: "Cedar Grove Insurance Support", support_phone: "+1 212-555-0142",
    support_email: "support@cedargrove.example", support_hours: "Mon–Fri 8am–7pm ET", version: 2,
  }];

  const releases: MarketplaceRelease[] = [{
    release_id: "release-active-001", marketplace_id: MARKETPLACE_ID, status: "ACTIVE",
    brand_id: "brand-active-001", content_id: "content-active-001", availability_version: 1,
    effective_from: "2026-03-01T00:00:00.000Z", published_by: "Elena Alvarez", published_at: "2026-03-01T00:00:00.000Z",
  }];

  const domains: MarketplaceDomain[] = [{
    domain_id: rid("dom"), marketplace_id: MARKETPLACE_ID, domain_type: "JET_SUBDOMAIN",
    hostname: "cedargrove.abox.app", status: "ACTIVE", is_primary: true, requested_at: "2026-02-15T00:00:00.000Z", activated_at: "2026-03-01T00:00:00.000Z",
  }];

  const availability: AvailabilityEntry[] = [
    { availability_entry_id: rid("avl"), marketplace_id: MARKETPLACE_ID, state_code: "NY", product_line: "IFP_ON_EXCHANGE", carrier_name: "Meridian Health", channels: ["CONSUMER_DIRECT", "AGENT"], status: "ENABLED", version: "ACTIVE", blockers: [] },
    { availability_entry_id: rid("avl"), marketplace_id: MARKETPLACE_ID, state_code: "NY", product_line: "DENTAL", carrier_name: "Aeris Dental", channels: ["CONSUMER_DIRECT", "AGENT"], status: "ENABLED", version: "ACTIVE", blockers: [] },
    { availability_entry_id: rid("avl"), marketplace_id: MARKETPLACE_ID, state_code: "NY", product_line: "VISION", carrier_name: "Aeris Vision", channels: ["CONSUMER_DIRECT"], status: "DISABLED", version: "ACTIVE", blockers: ["M21 dependent pathway not yet ready"] },
    { availability_entry_id: rid("avl"), marketplace_id: MARKETPLACE_ID, state_code: "IL", product_line: "IFP_ON_EXCHANGE", carrier_name: "BluePeak", channels: ["CONSUMER_DIRECT", "AGENT"], status: "ENABLED", version: "ACTIVE", blockers: [] },
    { availability_entry_id: rid("avl"), marketplace_id: MARKETPLACE_ID, state_code: "NY", product_line: "ICHRA_EMPLOYER_QUOTING", carrier_name: "—", channels: ["EMPLOYER"], status: "DISABLED", version: "ACTIVE", blockers: ["M20 employer workflow not activated"] },
    { availability_entry_id: rid("avl"), marketplace_id: MARKETPLACE_ID, state_code: "NY", product_line: "IFP_OFF_EXCHANGE", carrier_name: "Meridian Health", channels: ["CONSUMER_DIRECT", "AGENT"], status: "DISABLED", version: "ACTIVE", blockers: ["Hidden from production until M02/M26 dependencies are ready"] },
  ];

  const participants: Participant[] = [
    { participant_id: rid("ptp"), marketplace_id: MARKETPLACE_ID, organization_id: ROOT_ORGANIZATION_ID, participation_state: "ENABLED", channels: ["CONSUMER_DIRECT", "AGENT", "EMPLOYER"], support_identity_preference: "ROOT", effective_from: "2026-03-01T00:00:00.000Z" },
    { participant_id: rid("ptp"), marketplace_id: MARKETPLACE_ID, organization_id: "org-northwind", participation_state: "ENABLED", channels: ["AGENT"], support_identity_preference: "OWN", effective_from: "2026-03-05T00:00:00.000Z" },
    { participant_id: rid("ptp"), marketplace_id: MARKETPLACE_ID, organization_id: "org-unioncoast", participation_state: "PENDING_READINESS", channels: [], support_identity_preference: "ROOT", effective_from: now },
  ];

  const referralLinks: ReferralLink[] = [
    { referral_link_id: rid("ref"), marketplace_id: MARKETPLACE_ID, link_type: "ORGANIZATION", participant_id: participants[1].participant_id, channel: "AGENT", token: "nw-" + rid("tok").slice(4), status: "ACTIVE", created_at: "2026-03-06T00:00:00.000Z", use_count: 12, last_used_at: "2026-08-20T00:00:00.000Z" },
  ];

  const readiness: Readiness[] = [{
    readiness_id: rid("rdy"), marketplace_id: MARKETPLACE_ID, status: "READY",
    blocking_count: 0, warning_count: 0, evaluated_at: "2026-03-01T00:00:00.000Z", policy_version: 4,
    items: [
      { readiness_item_id: rid("rdyi"), control_code: "BILINGUAL_CONTENT_COMPLETE", result: "PASS", owner_module: "M04" },
      { readiness_item_id: rid("rdyi"), control_code: "ASSETS_VALID", result: "PASS", owner_module: "M04" },
      { readiness_item_id: rid("rdyi"), control_code: "DOMAIN_ACTIVE", result: "PASS", owner_module: "M04" },
      { readiness_item_id: rid("rdyi"), control_code: "SUPPORT_IDENTITY_COMPLETE", result: "PASS", owner_module: "M04" },
      { readiness_item_id: rid("rdyi"), control_code: "ENTITLED_CHANNEL_READY", result: "PASS", owner_module: "M00" },
      { readiness_item_id: rid("rdyi"), control_code: "READY_PRODUCT_PATHWAY", result: "PASS", owner_module: "M04" },
      { readiness_item_id: rid("rdyi"), control_code: "NO_JET_BLOCK", result: "PASS", owner_module: "JET" },
    ],
  }];

  const tasks: MarketplaceTask[] = [
    { task_id: rid("mtask"), marketplace_id: MARKETPLACE_ID, task_type: "NO_ELIGIBLE_PARTICIPANT", owner: "ROOT", status: "OPEN", description: "Union Coast Marketplace has no active administrator, so it cannot be enabled as a participant yet.", created_at: now },
    { task_id: rid("mtask"), marketplace_id: MARKETPLACE_ID, task_type: "NO_READY_PRODUCT", owner: "SOURCE_MODULE", status: "OPEN", description: "Vision (NY) is configured but blocked — M21 dependent pathway not yet ready.", created_at: now },
  ];

  const history: MarketplaceHistoryEntry[] = [
    { history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: "2026-02-15T00:00:00.000Z", actor: "System", summary: "Draft marketplace created when M05 established the tenant-owning root." },
    { history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: "2026-03-01T00:00:00.000Z", actor: "JET Platform Admin", summary: "Initial production activation approved. JET subdomain cedargrove.abox.app activated." },
    { history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: "2026-03-05T00:00:00.000Z", actor: "Elena Alvarez", summary: "Enabled Northwind Health Group as an agent-channel participant." },
  ];

  const health: HealthCheck[] = [
    { health_id: rid("health"), marketplace_id: MARKETPLACE_ID, area: "RELEASE", status: "HEALTHY", detail: "Active release serving all public traffic.", checked_at: now },
    { health_id: rid("health"), marketplace_id: MARKETPLACE_ID, area: "ROUTE", status: "HEALTHY", detail: "Primary domain resolving correctly.", checked_at: now },
    { health_id: rid("health"), marketplace_id: MARKETPLACE_ID, area: "PARTICIPANT", status: "DEGRADED", detail: "One participant pending readiness (Union Coast Marketplace).", checked_at: now },
  ];

  return {
    marketplaces, releases, brands, assets: [], content, domains, availability, participants,
    referralLinks, readiness, tasks, history, overrides: [], health, previewMode: false,
  };
}

const STORAGE_KEY = "abox_mkt_v1";

function persist(s: MktState) {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* noop */ }
}
function load(): MktState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MktState;
  } catch {
    // fall through to reseed
  }
  // seed() generates random referral tokens/ids — persist immediately so
  // every full-page load in this tab resolves the same values (e.g. a
  // referral link shown on one page must still resolve on the next load)
  // instead of drifting to a new random seed each time.
  const fresh = seed();
  persist(fresh);
  return fresh;
}

let state: MktState = load();
const listeners = new Set<() => void>();
function notify() { for (const l of listeners) l(); }

export const marketplaceStore = {
  get: () => state,
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },

  addHistory(h: MarketplaceHistoryEntry) { state = { ...state, history: [h, ...state.history] }; persist(state); notify(); },

  updateMarketplace(patch: Partial<Marketplace>) {
    state = { ...state, marketplaces: state.marketplaces.map((m) => (m.marketplace_id === MARKETPLACE_ID ? { ...m, ...patch, version: m.version + 1 } : m)) };
    persist(state); notify();
  },
  suspendMarketplace(actor: string, reason: string, effectiveDate: string) {
    marketplaceStore.updateMarketplace({ lifecycle_status: "SUSPENDED" });
    marketplaceStore.addHistory({ history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor, summary: `Marketplace suspended effective ${effectiveDate}. Reason: ${reason}` });
  },
  reactivateMarketplace(actor: string, note: string) {
    marketplaceStore.updateMarketplace({ lifecycle_status: "ACTIVE" });
    marketplaceStore.addHistory({ history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor, summary: `Marketplace reactivated. ${note}` });
  },
  endMarketplace(actor: string, reason: string) {
    marketplaceStore.updateMarketplace({ lifecycle_status: "ENDED" });
    marketplaceStore.addHistory({ history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor, summary: `Marketplace ended. Reason: ${reason}` });
  },

  createDraftBrand(): Brand {
    const active = getActiveBrand(state)!;
    const draft: Brand = { ...active, brand_id: rid("brand"), status: "DRAFT", version: active.version + 1 };
    state = { ...state, brands: [...state.brands.filter((b) => b.marketplace_id !== MARKETPLACE_ID || b.status !== "DRAFT"), draft] };
    persist(state); notify();
    return draft;
  },
  updateBrand(brandId: string, patch: Partial<Brand>) {
    state = { ...state, brands: state.brands.map((b) => (b.brand_id === brandId ? { ...b, ...patch } : b)) };
    persist(state); notify();
  },
  createDraftContent(): MarketplaceContent {
    const active = getActiveContent(state)!;
    const draft: MarketplaceContent = { ...active, content_id: rid("content"), status: "DRAFT", version: active.version + 1 };
    state = { ...state, content: [...state.content.filter((c) => c.marketplace_id !== MARKETPLACE_ID || c.status !== "DRAFT"), draft] };
    persist(state); notify();
    return draft;
  },
  updateContent(contentId: string, patch: Partial<MarketplaceContent>) {
    state = { ...state, content: state.content.map((c) => (c.content_id === contentId ? { ...c, ...patch } : c)) };
    persist(state); notify();
  },

  addAsset(a: MarketplaceAsset) { state = { ...state, assets: [a, ...state.assets] }; persist(state); notify(); },
  updateAsset(assetId: string, patch: Partial<MarketplaceAsset>) {
    state = { ...state, assets: state.assets.map((a) => (a.asset_id === assetId ? { ...a, ...patch } : a)) };
    persist(state); notify();
  },
  retireAsset(assetId: string) { state = { ...state, assets: state.assets.filter((a) => a.asset_id !== assetId) }; persist(state); notify(); },

  addDomain(d: MarketplaceDomain) { state = { ...state, domains: [...state.domains, d] }; persist(state); notify(); },
  updateDomain(domainId: string, patch: Partial<MarketplaceDomain>) {
    state = { ...state, domains: state.domains.map((d) => (d.domain_id === domainId ? { ...d, ...patch } : d)) };
    persist(state); notify();
  },
  setPrimaryDomain(domainId: string) {
    state = { ...state, domains: state.domains.map((d) => ({ ...d, is_primary: d.domain_id === domainId })) };
    persist(state); notify();
  },

  updateAvailability(entryId: string, patch: Partial<AvailabilityEntry>) {
    state = { ...state, availability: state.availability.map((a) => (a.availability_entry_id === entryId ? { ...a, ...patch } : a)) };
    persist(state); notify();
  },
  addAvailability(a: AvailabilityEntry) { state = { ...state, availability: [...state.availability, a] }; persist(state); notify(); },

  updateParticipant(participantId: string, patch: Partial<Participant>) {
    state = { ...state, participants: state.participants.map((p) => (p.participant_id === participantId ? { ...p, ...patch } : p)) };
    persist(state); notify();
  },

  addReferralLink(r: ReferralLink) { state = { ...state, referralLinks: [r, ...state.referralLinks] }; persist(state); notify(); },
  updateReferralLink(linkId: string, patch: Partial<ReferralLink>) {
    state = { ...state, referralLinks: state.referralLinks.map((r) => (r.referral_link_id === linkId ? { ...r, ...patch } : r)) };
    persist(state); notify();
  },
  recordReferralUse(linkId: string) {
    state = { ...state, referralLinks: state.referralLinks.map((r) => (r.referral_link_id === linkId ? { ...r, use_count: r.use_count + 1, last_used_at: new Date().toISOString() } : r)) };
    persist(state); notify();
  },

  recalculateReadiness() {
    const r = computeMarketplaceReadiness(state);
    state = { ...state, readiness: [r] };
    persist(state); notify();
  },

  addTask(t: MarketplaceTask) { state = { ...state, tasks: [t, ...state.tasks] }; persist(state); notify(); },
  resolveTask(taskId: string, resolution: string) {
    state = { ...state, tasks: state.tasks.map((t) => (t.task_id === taskId ? { ...t, status: "RESOLVED" as TaskStatus, resolved_at: new Date().toISOString(), resolution } : t)) };
    persist(state); notify();
  },
  escalateTask(taskId: string) {
    state = { ...state, tasks: state.tasks.map((t) => (t.task_id === taskId ? { ...t, status: "ESCALATED" as TaskStatus, owner: "JET" as TaskOwner } : t)) };
    persist(state); notify();
  },

  addOverride(o: MarketplaceOverride) { state = { ...state, overrides: [o, ...state.overrides] }; persist(state); notify(); },

  publishRelease(actor: string, effectiveFrom?: string) {
    const draftBrand = state.brands.find((b) => b.marketplace_id === MARKETPLACE_ID && b.status === "DRAFT");
    const draftContent = state.content.find((c) => c.marketplace_id === MARKETPLACE_ID && c.status === "DRAFT");
    const currentActive = getActiveRelease(state);
    const now = new Date().toISOString();
    const isScheduled = !!effectiveFrom && effectiveFrom > now;

    let brandId = currentActive?.brand_id ?? "";
    let contentId = currentActive?.content_id ?? "";
    if (draftBrand) {
      state = { ...state, brands: state.brands.map((b) => (b.marketplace_id === MARKETPLACE_ID && b.status === "ACTIVE" ? { ...b, status: "SUPERSEDED" as const } : b.brand_id === draftBrand.brand_id ? { ...b, status: isScheduled ? "DRAFT" as const : "ACTIVE" as const } : b)) };
      brandId = draftBrand.brand_id;
    }
    if (draftContent) {
      state = { ...state, content: state.content.map((c) => (c.marketplace_id === MARKETPLACE_ID && c.status === "ACTIVE" ? { ...c, status: "SUPERSEDED" as const } : c.content_id === draftContent.content_id ? { ...c, status: isScheduled ? "DRAFT" as const : "ACTIVE" as const } : c)) };
      contentId = draftContent.content_id;
    }

    if (isScheduled) {
      const scheduled: MarketplaceRelease = {
        release_id: rid("release"), marketplace_id: MARKETPLACE_ID, status: "SCHEDULED",
        brand_id: brandId, content_id: contentId, availability_version: (currentActive?.availability_version ?? 1) + 1,
        effective_from: effectiveFrom,
      };
      state = { ...state, releases: [...state.releases, scheduled] };
      persist(state); notify();
      marketplaceStore.addHistory({ history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: now, actor, summary: `Scheduled a release for ${new Date(effectiveFrom!).toLocaleString()}.` });
      return scheduled;
    }

    const release: MarketplaceRelease = {
      release_id: rid("release"), marketplace_id: MARKETPLACE_ID, status: "ACTIVE",
      brand_id: brandId, content_id: contentId, availability_version: (currentActive?.availability_version ?? 1) + 1,
      effective_from: now, published_by: actor, published_at: now,
    };
    state = {
      ...state,
      releases: [...state.releases.map((r) => (r.marketplace_id === MARKETPLACE_ID && r.status === "ACTIVE" ? { ...r, status: "SUPERSEDED" as const } : r)), release],
    };
    persist(state); notify();
    marketplaceStore.addHistory({ history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: now, actor, summary: "Published a new coordinated marketplace release." });
    return release;
  },

  submitInitialActivation(actor: string) {
    marketplaceStore.addTask({
      task_id: rid("mtask"), marketplace_id: MARKETPLACE_ID, task_type: "UNAPPROVED_DELTA",
      owner: "JET", status: "OPEN", description: "Initial production activation submitted for JET review.", created_at: new Date().toISOString(),
    });
    marketplaceStore.addHistory({ history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor, summary: "Submitted initial setup to JET for production activation." });
  },
  approveInitialActivation(actor: string) {
    marketplaceStore.updateMarketplace({ lifecycle_status: "ACTIVE" });
    marketplaceStore.publishRelease(actor);
    marketplaceStore.addHistory({ history_id: rid("mhist"), marketplace_id: MARKETPLACE_ID, when: new Date().toISOString(), actor, summary: "JET approved and completed initial production activation." });
  },

  setPreviewMode(on: boolean) { state = { ...state, previewMode: on }; persist(state); notify(); },
};

const SERVER_STATE = seed();

export function useMarketplaceState() {
  return useSyncExternalStore(marketplaceStore.subscribe, () => marketplaceStore.get(), () => SERVER_STATE);
}

// ---- Selectors ----
export function getMarketplace(state: MktState): Marketplace {
  return state.marketplaces.find((m) => m.marketplace_id === MARKETPLACE_ID)!;
}
export function getActiveRelease(state: MktState): MarketplaceRelease | undefined {
  return state.releases.find((r) => r.marketplace_id === MARKETPLACE_ID && r.status === "ACTIVE");
}
export function getScheduledRelease(state: MktState): MarketplaceRelease | undefined {
  return state.releases.find((r) => r.marketplace_id === MARKETPLACE_ID && r.status === "SCHEDULED");
}
export function getReleaseHistory(state: MktState): MarketplaceRelease[] {
  return state.releases.filter((r) => r.marketplace_id === MARKETPLACE_ID).sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
}
export function getActiveBrand(state: MktState): Brand | undefined {
  return state.brands.find((b) => b.marketplace_id === MARKETPLACE_ID && b.status === "ACTIVE");
}
export function getDraftBrand(state: MktState): Brand | undefined {
  return state.brands.find((b) => b.marketplace_id === MARKETPLACE_ID && b.status === "DRAFT");
}
export function getActiveContent(state: MktState): MarketplaceContent | undefined {
  return state.content.find((c) => c.marketplace_id === MARKETPLACE_ID && c.status === "ACTIVE");
}
export function getDraftContent(state: MktState): MarketplaceContent | undefined {
  return state.content.find((c) => c.marketplace_id === MARKETPLACE_ID && c.status === "DRAFT");
}
export function getAssets(state: MktState): MarketplaceAsset[] {
  return state.assets.filter((a) => a.marketplace_id === MARKETPLACE_ID);
}
export function getDomains(state: MktState): MarketplaceDomain[] {
  return state.domains.filter((d) => d.marketplace_id === MARKETPLACE_ID);
}
export function getPrimaryDomain(state: MktState): MarketplaceDomain | undefined {
  return state.domains.find((d) => d.marketplace_id === MARKETPLACE_ID && d.is_primary);
}
export function getAvailability(state: MktState): AvailabilityEntry[] {
  return state.availability.filter((a) => a.marketplace_id === MARKETPLACE_ID);
}
export function getAvailabilityEntry(state: MktState, id: string): AvailabilityEntry | undefined {
  return state.availability.find((a) => a.availability_entry_id === id);
}
export function getParticipants(state: MktState): Participant[] {
  return state.participants.filter((p) => p.marketplace_id === MARKETPLACE_ID);
}
export function getParticipant(state: MktState, id: string): Participant | undefined {
  return state.participants.find((p) => p.participant_id === id);
}
export function getParticipantByOrg(state: MktState, orgId: string): Participant | undefined {
  return state.participants.find((p) => p.marketplace_id === MARKETPLACE_ID && p.organization_id === orgId);
}
export function getReferralLinks(state: MktState): ReferralLink[] {
  return state.referralLinks.filter((r) => r.marketplace_id === MARKETPLACE_ID);
}
export function getReferralLink(state: MktState, id: string): ReferralLink | undefined {
  return state.referralLinks.find((r) => r.referral_link_id === id);
}
export function getReferralLinkByToken(state: MktState, token: string): ReferralLink | undefined {
  return state.referralLinks.find((r) => r.token === token);
}
export function getReadiness(state: MktState): Readiness | undefined {
  return state.readiness.find((r) => r.marketplace_id === MARKETPLACE_ID);
}
export function getTasks(state: MktState): MarketplaceTask[] {
  return state.tasks.filter((t) => t.marketplace_id === MARKETPLACE_ID);
}
export function getOpenTaskCount(state: MktState): number {
  return state.tasks.filter((t) => t.marketplace_id === MARKETPLACE_ID && t.status === "OPEN").length;
}
export function getHistory(state: MktState): MarketplaceHistoryEntry[] {
  return state.history.filter((h) => h.marketplace_id === MARKETPLACE_ID);
}
export function getOverrides(state: MktState): MarketplaceOverride[] {
  return state.overrides.filter((o) => o.marketplace_id === MARKETPLACE_ID);
}
export function getHealth(state: MktState): HealthCheck[] {
  return state.health.filter((h) => h.marketplace_id === MARKETPLACE_ID);
}

export function computeMarketplaceReadiness(state: MktState): Readiness {
  const brand = getActiveBrand(state);
  const content = getActiveContent(state);
  const primaryDomain = getPrimaryDomain(state);
  const enabledChannel = getAvailability(state).some((a) => a.status === "ENABLED");
  const hasSupport = !!(content?.support_display_name && content.support_phone && content.support_email);
  const bilingualComplete = !!(brand?.headline_en && brand?.headline_es && brand?.intro_en && brand?.intro_es);

  const items: ReadinessItem[] = [
    { readiness_item_id: rid("rdyi"), control_code: "BILINGUAL_CONTENT_COMPLETE", owner_module: "M04", result: bilingualComplete ? "PASS" : "FAIL", next_action: bilingualComplete ? undefined : "Complete English and Spanish brand content" },
    { readiness_item_id: rid("rdyi"), control_code: "ASSETS_VALID", owner_module: "M04", result: "PASS" },
    { readiness_item_id: rid("rdyi"), control_code: "DOMAIN_ACTIVE", owner_module: "M04", result: primaryDomain?.status === "ACTIVE" ? "PASS" : "FAIL", next_action: primaryDomain?.status === "ACTIVE" ? undefined : "Activate a primary production domain" },
    { readiness_item_id: rid("rdyi"), control_code: "SUPPORT_IDENTITY_COMPLETE", owner_module: "M04", result: hasSupport ? "PASS" : "FAIL", next_action: hasSupport ? undefined : "Complete root support identity" },
    { readiness_item_id: rid("rdyi"), control_code: "ENTITLED_CHANNEL_READY", owner_module: "M00", result: enabledChannel ? "PASS" : "FAIL", next_action: enabledChannel ? undefined : "Enable at least one entitled channel and ready product" },
    { readiness_item_id: rid("rdyi"), control_code: "READY_PRODUCT_PATHWAY", owner_module: "M04", result: enabledChannel ? "PASS" : "FAIL" },
    { readiness_item_id: rid("rdyi"), control_code: "NO_JET_BLOCK", owner_module: "JET", result: "PASS" },
  ];
  const blocking = items.filter((i) => i.result === "FAIL").length;
  const warning = items.filter((i) => i.result === "WARNING").length;
  const status: ReadinessStatus = blocking > 0 ? "BLOCKED" : warning > 0 ? "READY_WITH_WARNINGS" : "READY";
  const existing = getReadiness(state);
  return {
    readiness_id: existing?.readiness_id ?? rid("rdy"), marketplace_id: MARKETPLACE_ID, status,
    blocking_count: blocking, warning_count: warning, evaluated_at: new Date().toISOString(),
    policy_version: (existing?.policy_version ?? 0) + 1, items,
  };
}
