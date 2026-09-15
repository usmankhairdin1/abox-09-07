/**
 * Browse state — sessionStorage-backed plan-list filters, sort and the
 * active shopping product. Keeps a shopper's screen exactly as they left
 * it when they navigate away and come back.
 */
import { useSyncExternalStore } from "react";

export interface BrowseState {
  exchange: "all" | "on" | "off";
  metals: string[];
  networks: string[];
  carriers: string[];
  hsaOnly: boolean;
  easyPricingOnly: boolean;
  maxPremium: number;
  maxDeductible: number;
  maxOop: number;
  maxPcpCopay: number;
  maxSpecialistCopay: number;
  sort: string | null;
  product: string;
}

const KEY = "abox_browse_v1";

const EMPTY: BrowseState = {
  exchange: "all",
  metals: [],
  networks: [],
  carriers: [],
  hsaOnly: false,
  easyPricingOnly: false,
  maxPremium: 1000,
  maxDeductible: 7500,
  maxOop: 9500,
  maxPcpCopay: 50,
  maxSpecialistCopay: 100,
  sort: null,
  product: "ifp",
};

function load(): BrowseState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<BrowseState>) };
  } catch {
    return EMPTY;
  }
}

let state: BrowseState = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
}

export const browseStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  patch(next: Partial<BrowseState>) {
    state = { ...state, ...next };
    persist();
    for (const l of listeners) l();
  },
  resetFilters() {
    browseStore.patch({
      exchange: "all",
      metals: [],
      networks: [],
      carriers: [],
      hsaOnly: false,
      easyPricingOnly: false,
      maxPremium: 1000,
      maxDeductible: 7500,
      maxOop: 9500,
      maxPcpCopay: 50,
      maxSpecialistCopay: 100,
    });
  },
};

export function useBrowseState(): BrowseState {
  return useSyncExternalStore(browseStore.subscribe, () => browseStore.get(), () => EMPTY);
}
