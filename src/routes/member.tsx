/**
 * /member — Consumer member layout (authenticated).
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireSessionIfEnforced } from "@/lib/auth-gate";

export const Route = createFileRoute("/member")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    await requireSessionIfEnforced(location.href);
  },
  component: () => <Outlet />,
});
