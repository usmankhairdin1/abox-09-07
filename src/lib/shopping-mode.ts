/**
 * Shopping mode + PlanAI availability.
 *
 * Keeps a shopper's path (guided wizard vs. self-browse) and the furthest
 * guided step they reached, so switching between the two paths resumes
 * instead of restarting. Quote answers live in `quote-store`, filters in
 * `browse-store`; this module only records where the shopper was.
 *
 * It also exposes a tiny open/close store for the existing PlanAI
 * assistant so any shopping screen can surface the same assistant instead
 * of shipping a second implementation.
 */
import { useSyncExternalStore } from "react";

export type ShoppingMode = "guided" | "browse";

export interface ShoppingModeState {
  mode: ShoppingMode;
  lastStep: number;
}

const KEY = "abox_shopping_mode_v1";
const EMPTY: ShoppingModeState = { mode: "browse", lastStep: 1 };

function load(): ShoppingModeState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<ShoppingModeState>) };
  } catch {
    return EMPTY;
  }
}

let state: ShoppingModeState = load();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota / privacy mode */
    }
  }
  for (const l of listeners) l();
}

export const shoppingModeStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  patch(next: Partial<ShoppingModeState>) {
    const merged = { ...state, ...next };
    if (merged.mode === state.mode && merged.lastStep === state.lastStep) return;
    state = merged;
    emit();
  },
  /** Record the guided step a shopper is on so /plans can send them back to it. */
  recordGuidedStep(step: number) {
    shoppingModeStore.patch({ mode: "guided", lastStep: Math.max(1, Math.min(6, step)) });
  },
  recordBrowse() {
    shoppingModeStore.patch({ mode: "browse" });
  },
};

export function useShoppingMode(): ShoppingModeState {
  return useSyncExternalStore(shoppingModeStore.subscribe, () => shoppingModeStore.get(), () => EMPTY);
}

/* ------------------------------------------------------------------ */
/* PlanAI assistant open state (shared with PlanOAssistant)           */
/* ------------------------------------------------------------------ */

let assistantOpen = false;
const assistantListeners = new Set<() => void>();

export const planAiStore = {
  get: () => assistantOpen,
  subscribe(l: () => void) {
    assistantListeners.add(l);
    return () => assistantListeners.delete(l);
  },
  set(open: boolean) {
    if (assistantOpen === open) return;
    assistantOpen = open;
    for (const l of assistantListeners) l();
  },
  toggle() {
    planAiStore.set(!assistantOpen);
  },
};

export function usePlanAiOpen(): boolean {
  return useSyncExternalStore(planAiStore.subscribe, () => planAiStore.get(), () => false);
}
