import { createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable, PageHeader, Section, StatusChip } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/lucie-app/platform/audit")({
  head: () => ({
    meta: [
      { title: "Audit trail — JET platform" },
      { name: "description", content: "Who changed what, in which workspace and when — including everything you have done in this walkthrough." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Audit trail" },
      { property: "og:description", content: "A searchable record of every consequential action." },
    ],
  }),
  component: AuditPage,
});

const ALL = "__all";

function AuditPage() {
  const { state } = useLucie();
  const [q, setQ] = useState("");
  const [ws, setWs] = useState(ALL);

  const workspaces = useMemo(() => Array.from(new Set(state.audit.map((a) => a.workspace))), [state.audit]);
  const rows = state.audit.filter((a) => {
    if (ws !== ALL && a.workspace !== ws) return false;
    const n = q.trim().toLowerCase();
    return !n || [a.actor, a.action, a.object, a.detail].join(" ").toLowerCase().includes(n);
  });

  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Audit trail"
        lede="Actions you take in this prototype are written here as you go, which is the point: the record is a by-product of the work, not a separate step."
        actions={
          <Button variant="outline" onClick={() => toast.success("Audit extract queued for download.")}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <Section title={`${rows.length} entries`}>
        <div className="mb-3 flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, action, object…" className="pl-9" />
          </div>
          <Select value={ws} onValueChange={setWs}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All workspaces</SelectItem>
              {workspaces.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          rows={rows}
          keyOf={(a) => a.id}
          empty="No entries match this search."
          columns={[
            { head: "When", cell: (a) => <span className="whitespace-nowrap text-xs tabular-nums">{a.when}</span> },
            { head: "Actor", cell: (a) => a.actor },
            {
              head: "Action",
              cell: (a) => (
                <div className="min-w-0">
                  <p className="font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.object}</p>
                </div>
              ),
            },
            { head: "Workspace", cell: (a) => <StatusChip tone="info">{a.workspace}</StatusChip> },
            { head: "Detail", cell: (a) => <span className="text-xs text-muted-foreground">{a.detail}</span>, className: "min-w-[260px]" },
          ]}
        />
      </Section>
    </>
  );
}
