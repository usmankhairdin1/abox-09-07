import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/object")({
  beforeLoad: () => {
    throw redirect({ to: "/app/customers" });
  },
});
