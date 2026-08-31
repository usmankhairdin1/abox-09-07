/**
 * /app — Internal workspace layout route.
 * Wraps every internal page in the InternalShell.
 * Workspace context is derived per-route (via search or path), for
 * now defaulting to "agent" — sub-routes can pass their own via context.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: () => <Outlet />,
});
