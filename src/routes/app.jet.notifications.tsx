/**
 * SCR_JET_NOTIFICATIONS
 */
import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { SAMPLE_NOTIF_TEMPLATES, type SampleNotifTemplate } from "@/lib/sample-data-ext";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/app/jet/notifications")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_JET_NOTIFICATIONS.name} — ABox` }, { name: "description", content: SCREENS.SCR_JET_NOTIFICATIONS.purpose }] }),
  component: Page,
});

function Page() {
  const cols: Column<SampleNotifTemplate>[] = [
    { key: "name", header: "Template", cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">Trigger · {r.trigger}</p>
      </div>
    )},
    { key: "channel", header: "Channel", cell: (r) => <StatusBadge tone="muted">{r.channel}</StatusBadge> },
    { key: "schedule", header: "Schedule", cell: (r) => <span className="text-xs tabular-nums">{r.schedule}</span> },
    { key: "enabled", header: "Enabled", cell: (r) => (
      <StatusBadge tone={r.enabled ? "sage" : "muted"}>{r.enabled ? "On" : "Off"}</StatusBadge>
    )},
    { key: "last", header: "Last sent", align: "right", cell: (r) => <span className="text-xs text-muted-foreground">{r.lastSent}</span> },
  ];
  return (
    <InternalShell workspace="jet" pageTitle="Notifications" eyebrow="Configuration">
      <DataTable columns={cols} rows={SAMPLE_NOTIF_TEMPLATES} getRowId={(r) => r.id} ariaLabel="Notification templates" />
    </InternalShell>
  );
}
