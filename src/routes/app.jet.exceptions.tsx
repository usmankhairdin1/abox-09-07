import { JetFrame } from "@/components/lucie-app/frames";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, PageHeader, Section, StatCard, StatusChip, toneFor } from "@/components/lucie-app/ui";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ExceptionItem } from "@/lib/lucie-app/data";
import { useLucie } from "@/lib/lucie-app/store";

export const Route = createFileRoute("/app/jet/exceptions")({
  head: () => ({
    meta: [
      { title: "Exception queue — JET platform" },
      { name: "description", content: "Owned queue of failed handoffs, rejected feeds and expired quotes, each with a runbook and a resolution trail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Exception queue" },
      { property: "og:description", content: "Every operational failure, owned and resolvable." },
    ],
  }),
  component: () => (
    <JetFrame title="Exception queue">
      <ExceptionsPage />
    </JetFrame>
  ),
});

const ALL = "__all";

function ExceptionsPage() {
  const { state, dispatch } = useLucie();
  const [status, setStatus] = useState("open");
  const [severity, setSeverity] = useState(ALL);
  const [selected, setSelected] = useState<ExceptionItem | null>(null);

  const rows = state.exceptions.filter(
    (e) => (status === ALL || e.status === status) && (severity === ALL || e.severity === severity),
  );

  return (
    <>
      <PageHeader
        eyebrow="JET platform"
        title="Exception queue"
        lede="Anything that fails between systems lands here with an owner. Resolving an item writes an audit entry, so the fix is evidenced rather than remembered."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Open" value={state.exceptions.filter((e) => e.status === "open").length} tone="warn" />
        <StatCard label="High severity" value={state.exceptions.filter((e) => e.severity === "high" && e.status === "open").length} tone="bad" />
        <StatCard label="Resolved" value={state.exceptions.filter((e) => e.status === "resolved").length} tone="good" />
      </div>

      <Section title="Queue">
        <div className="mb-3 flex flex-wrap gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All severities</SelectItem>
              {["high", "medium", "low"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          rows={rows}
          keyOf={(e) => e.id}
          onRowClick={(e) => setSelected(e)}
          empty="Nothing matches the selected filters."
          columns={[
            {
              head: "Exception",
              cell: (e) => (
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.id} · {e.source}
                  </p>
                </div>
              ),
            },
            { head: "Owner", cell: (e) => e.owner },
            { head: "Opened", cell: (e) => e.opened },
            { head: "Severity", cell: (e) => <StatusChip tone={e.severity === "high" ? "bad" : e.severity === "medium" ? "warn" : "neutral"}>{e.severity}</StatusChip> },
            { head: "Status", cell: (e) => <StatusChip tone={toneFor(e.status)}>{e.status}</StatusChip> },
          ]}
        />
      </Section>

      <Sheet open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.subject}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 px-4 pb-8">
                <div className="flex flex-wrap gap-2">
                  <StatusChip tone={toneFor(selected.status)}>{selected.status}</StatusChip>
                  <StatusChip tone={selected.severity === "high" ? "bad" : "warn"}>{selected.severity}</StatusChip>
                  <StatusChip>{selected.owner}</StatusChip>
                </div>
                <p className="text-sm leading-relaxed">{selected.detail}</p>
                <div className="grid gap-1.5 rounded-lg border border-border p-4 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Runbook</p>
                  <p>1. Confirm the payload in the integration log for {selected.source}.</p>
                  <p>2. Re-dispatch once the upstream system reports healthy.</p>
                  <p>3. Notify the owning workspace if the customer is waiting.</p>
                </div>
                {selected.status === "open" ? (
                  <Button
                    size="sm"
                    className="w-fit"
                    onClick={() => {
                      dispatch({ type: "exception:resolve", id: selected.id });
                      setSelected({ ...selected, status: "resolved" });
                      toast.success(`${selected.id} marked resolved.`);
                    }}
                  >
                    Mark resolved
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
