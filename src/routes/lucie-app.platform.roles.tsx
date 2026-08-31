import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Section, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROLE_TEMPLATES } from "@/lib/lucie-app/data";

export const Route = createFileRoute("/lucie-app/platform/roles")({
  head: () => ({
    meta: [
      { title: "Roles and workspaces — JET platform" },
      { name: "description", content: "Role templates that decide which workspace a user lands in and what they are allowed to do there." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Roles and workspaces" },
      { property: "og:description", content: "Workspace-scoped role templates and their permissions." },
    ],
  }),
  component: RolesPage,
});

function RolesPage() {
  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Roles and workspaces"
        lede="Access is granted by role inside a workspace, never by page. That is why a producer never sees a platform screen even if they know the address."
        actions={
          <Button onClick={() => toast.success("New role template drafted.")}>
            <KeyRound className="h-4 w-4" /> New role template
          </Button>
        }
      />

      <Section title="Role templates">
        <div className="grid gap-3 sm:grid-cols-2">
          {ROLE_TEMPLATES.map((r) => (
            <Card key={r.id} className="grid gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.workspace} workspace · {r.members} members
                  </p>
                </div>
                <StatusChip tone="info">{r.id}</StatusChip>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.permissions.map((p) => (
                  <StatusChip key={p}>{p}</StatusChip>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit"
                onClick={() => toast.success(`${r.name} permissions opened for editing.`)}
              >
                Edit permissions
              </Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
