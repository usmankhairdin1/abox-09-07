import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useMemo, useReducer } from "react";

import { LucieAppShell } from "@/components/lucie-app/shell";
import { initialState, LucieContext, reducer } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app")({
  component: LucieAppLayout,
});

function LucieAppLayout() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <LucieContext.Provider value={value}>
      <LucieAppShell>
        <Outlet />
      </LucieAppShell>
    </LucieContext.Provider>
  );
}
