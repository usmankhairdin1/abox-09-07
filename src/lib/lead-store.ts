/**
 * Agent CRM — leads. Same posture as org-store.ts/marketplace-store.ts:
 * no real backend yet, so this is a sessionStorage-backed mock store
 * (seeded from the former static SAMPLE_LEADS array) that makes "New
 * lead" a real, working action instead of a dead button.
 */
import { useSyncExternalStore } from "react";
import { SAMPLE_LEADS, type SampleLead } from "@/lib/sample-data";

interface LeadState {
  leads: SampleLead[];
}

function seed(): LeadState {
  return { leads: SAMPLE_LEADS };
}

const STORAGE_KEY = "abox_leads_v1";

function persist(s: LeadState) {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* noop */ }
}
function load(): LeadState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LeadState;
  } catch {
    // fall through to reseed
  }
  const fresh = seed();
  persist(fresh);
  return fresh;
}

let state: LeadState = load();
const listeners = new Set<() => void>();
function notify() { for (const l of listeners) l(); }

export const leadStore = {
  get: () => state,
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  addLead(lead: SampleLead) {
    state = { ...state, leads: [lead, ...state.leads] };
    persist(state); notify();
  },
  updateLead(id: string, patch: Partial<SampleLead>) {
    state = { ...state, leads: state.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) };
    persist(state); notify();
  },
};

const SERVER_STATE = seed();

export function useLeadState() {
  return useSyncExternalStore(leadStore.subscribe, () => leadStore.get(), () => SERVER_STATE);
}

export function getLeads(state: LeadState): SampleLead[] {
  return state.leads;
}
export function getLead(state: LeadState, id: string): SampleLead | undefined {
  return state.leads.find((l) => l.id === id);
}
export function nextLeadId(state: LeadState): string {
  const nums = state.leads.map((l) => Number(l.id.replace(/\D/g, "")) || 0);
  return `L-${(Math.max(0, ...nums) + 1).toString().padStart(4, "0")}`;
}
