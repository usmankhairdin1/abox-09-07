/**
 * ABox Cart & selections — sessionStorage state that spans the
 * marketplace flow (Plans → Compare → Cart → Review → Handoff).
 * All product types (health, dental, vision, life, etc.) live in the
 * same cart, grouped by productType at render time (UX-013).
 */
import { useSyncExternalStore } from "react";

export type ProductType =
  | "ifp"
  | "dental"
  | "vision"
  | "life"
  | "critical"
  | "accident"
  | "hospital"
  | "ichra";

export interface CartItem {
  id: string;                 // planId or ancillaryId
  productType: ProductType;
  displayName: string;
  carrier: string;
  monthly: number;
  effectiveDate: string;      // ISO
  status: "draft" | "ready" | "needs-info" | "will-be-referred";
  notes?: string;
  meta?: Record<string, string | number | boolean>;
}

interface CartState {
  items: CartItem[];
  compareIds: string[];      // for /compare
  savedPlanIds: string[];    // "saved for later"
}

const CART_KEY = "abox_cart_v1";

function load(): CartState {
  if (typeof window === "undefined") return { items: [], compareIds: [], savedPlanIds: [] };
  try {
    const raw = window.sessionStorage.getItem(CART_KEY);
    if (!raw) return { items: [], compareIds: [], savedPlanIds: [] };
    const p = JSON.parse(raw) as CartState;
    return { items: p.items ?? [], compareIds: p.compareIds ?? [], savedPlanIds: p.savedPlanIds ?? [] };
  } catch {
    return { items: [], compareIds: [], savedPlanIds: [] };
  }
}
function save(s: CartState) {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(CART_KEY, JSON.stringify(s)); } catch { /* noop */ }
}

let state: CartState = load();
const listeners = new Set<() => void>();
function notify() { for (const l of listeners) l(); }

export const cartStore = {
  get: () => state,
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  add(item: CartItem) {
    if (state.items.some((i) => i.id === item.id)) return;
    // One plan per product type: a new medical plan replaces the current
    // medical plan, but add-ons (dental, vision, life…) stack alongside it.
    const replaced = state.items.find((i) => i.productType === item.productType) ?? null;
    state = {
      ...state,
      items: [...state.items.filter((i) => i.productType !== item.productType), item],
    };
    save(state); notify();
    if (replaced && typeof window !== "undefined") {
      void import("sonner").then(({ toast }) =>
        toast("Cart updated", {
          description: `One plan at a time — ${replaced.displayName} was replaced with ${item.displayName}.`,
        }),
      );
    }
  },
  remove(id: string) {
    state = { ...state, items: state.items.filter((i) => i.id !== id) }; save(state); notify();
  },
  update(id: string, patch: Partial<CartItem>) {
    state = { ...state, items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) };
    save(state); notify();
  },
  clear() { state = { items: [], compareIds: [], savedPlanIds: [] }; save(state); notify(); },
  toggleCompare(id: string) {
    const has = state.compareIds.includes(id);
    const next = has
      ? state.compareIds.filter((x) => x !== id)
      : state.compareIds.length < 5 ? [...state.compareIds, id] : state.compareIds;
    state = { ...state, compareIds: next }; save(state); notify();
  },
  clearCompare() {
    state = { ...state, compareIds: [] }; save(state); notify();
  },
  toggleSaved(id: string) {
    const has = state.savedPlanIds.includes(id);
    state = {
      ...state,
      savedPlanIds: has ? state.savedPlanIds.filter((x) => x !== id) : [...state.savedPlanIds, id],
    };
    save(state); notify();
  },
};

const SERVER_CART: CartState = { items: [], compareIds: [], savedPlanIds: [] };

export function useCart() {
  return useSyncExternalStore(cartStore.subscribe, () => cartStore.get(), () => SERVER_CART);
}

export function cartTotals(items: CartItem[]) {
  const monthly = items.reduce((sum, i) => sum + i.monthly, 0);
  const byType = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.productType] = (acc[i.productType] ?? 0) + 1; return acc;
  }, {});
  return { monthly, byType, count: items.length };
}

export const PRODUCT_LABEL: Record<ProductType, string> = {
  ifp: "Health Insurance",
  dental: "Dental",
  vision: "Vision",
  life: "Life",
  critical: "Critical Illness",
  accident: "Accident",
  hospital: "Hospital Indemnity",
  ichra: "ICHRA",
};
