import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/object")({
  beforeLoad: () => {
    throw redirect({ to: "/app/object" });
  },
});
