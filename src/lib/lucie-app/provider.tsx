/**
 * Working state for the group-benefits modelling and platform-operations
 * surfaces. Kept client-side and persisted so a model built on the census
 * screen is still there on the results and proposal screens.
 */
import { useEffect, useMemo, useReducer, type ReactNode } from "react";

import { LucieContext, initialState, reducer, type LucieState } from "@/lib/lucie-app/store";

const KEY = "abox.group-benefits.state";

function hydrate(): LucieState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...initialState(), ...(JSON.parse(raw) as Partial<LucieState>) } : initialState();
  } catch {
    return initialState();
  }
}

export function GroupBenefitsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    const stored = hydrate();
    dispatch({ type: "hydrate", state: stored } as never);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — state stays in memory */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <LucieContext.Provider value={value}>{children}</LucieContext.Provider>;
}
