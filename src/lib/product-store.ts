/**
 * JET product catalog store — sessionStorage-backed so "New product",
 * publish/unpublish and version bumps are real, persisted actions across
 * the JET workspace instead of static rows.
 */
import { useSyncExternalStore } from "react";
import { SAMPLE_PRODUCT_CATALOG, type SampleProductCatalog } from "@/lib/sample-data-ext";

interface ProductState {
  products: SampleProductCatalog[];
}

const STORAGE_KEY = "abox_products_v1";

function seed(): ProductState {
  return { products: SAMPLE_PRODUCT_CATALOG };
}

function persist(s: ProductState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

function load(): ProductState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProductState;
  } catch {
    /* fall through */
  }
  const fresh = seed();
  persist(fresh);
  return fresh;
}

let state: ProductState = load();
const listeners = new Set<() => void>();
function notify() {
  for (const l of listeners) l();
}

export const productStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  addProduct(product: SampleProductCatalog) {
    state = { ...state, products: [product, ...state.products] };
    persist(state);
    notify();
  },
  updateProduct(key: string, patch: Partial<SampleProductCatalog>) {
    state = {
      ...state,
      products: state.products.map((p) => (p.key === key ? { ...p, ...patch } : p)),
    };
    persist(state);
    notify();
  },
};

const SERVER_STATE = seed();

export function useProductState(): ProductState {
  return useSyncExternalStore(productStore.subscribe, () => productStore.get(), () => SERVER_STATE);
}

export function makeProductKey(name: string, existing: SampleProductCatalog[]): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "product";
  let key = base;
  let n = 2;
  while (existing.some((p) => p.key === key)) key = `${base}-${n++}`;
  return key;
}
