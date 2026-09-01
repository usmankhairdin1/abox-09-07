/**
 * /agency — Agency workspace layout (authenticated).
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireSessionIfEnforced } from "@/lib/auth-gate";

export const Route = createFileRoute("/agency")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    await requireSessionIfEnforced(location.href);
  },
  component: () => <Outlet />,
});
