/**
 * SCR_APP_CUSTOMERS — Customers & Leads
 */
import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Plus } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DataTable, type Column } from "@/components/abox/data-table";
import { StatusBadge } from "@/components/abox/status-badge";
import { type SampleLead } from "@/lib/sample-data";
import { leadStore, useLeadState, getLeads, nextLeadId } from "@/lib/lead-store";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/customers/")({
  head: () => ({ meta: [{ title: `${SCREENS.SCR_APP_CUSTOMERS.name} — ABox` }, { name: "description", content: SCREENS.SCR_APP_CUSTOMERS.purpose }] }),
  component: Page,
});

const STAGES: SampleLead["stage"][] = ["New","Contacted","Quoted","Shared","Enrolled","Lost"];

function Page() {
  const navigate = useNavigate();
  const leadState = useLeadState();
  const leads = getLeads(leadState);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<"all" | SampleLead["stage"]>("all");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [product, setProduct] = useState("IFP · Silver");

  const filtered = useMemo(() =>
    leads.filter((l) =>
      (stage === "all" || l.stage === stage) &&
      (search === "" || l.name.toLowerCase().includes(search.toLowerCase()) || l.id.includes(search))
    ), [leads, search, stage]);

  const createLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = nextLeadId(leadState);
    leadStore.addLead({
      id, name: name.trim(), stage: "New", product, updatedAgo: "just now",
      planO: false, agent: "You", nextAction: "Reach out to introduce yourself",
    });
    setName(""); setShowForm(false);
    navigate({ to: "/app/customers/$id", params: { id } });
  };

  const cols: Column<SampleLead>[] = [
    { key: "name", header: "Lead", cell: (r) => (
      <div>
        <Link to="/app/customers/$id" params={{ id: r.id }} className="story-link font-medium">{r.name}</Link>
        <p className="text-xs text-muted-foreground">{r.id}</p>
      </div>
    ) },
    { key: "product", header: "Product", cell: (r) => r.product },
    { key: "premium", header: "Premium", align: "right", cell: (r) => r.premium ? `$${r.premium}/mo` : "—" },
    { key: "stage", header: "Stage", cell: (r) => (
      <StatusBadge tone={
        r.stage === "Enrolled" ? "sage" :
        r.stage === "Shared" ? "info" :
        r.stage === "Quoted" ? "primary" :
        r.stage === "Lost" ? "destructive" : "muted"
      }>{r.stage}</StatusBadge>
    )},
    { key: "next", header: "Next action", cell: (r) => <span className="text-sm">{r.nextAction}</span> },
    { key: "updated", header: "Updated", align: "right", cell: (r) => <span className="text-xs text-muted-foreground">{r.updatedAgo}</span> },
  ];

  return (
    <InternalShell workspace="agent" pageTitle="Customers & leads" eyebrow="Relationships"
      actions={
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New lead
        </button>
      }
    >
      {showForm && (
        <form onSubmit={createLead} className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
          <label className="block text-sm">
            <span className="text-xs text-muted-foreground">Full name</span>
            <input
              autoFocus required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 h-10 w-56 rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              placeholder="Jordan Rivera"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs text-muted-foreground">Product interest</span>
            <select value={product} onChange={(e) => setProduct(e.target.value)} className="mt-1 h-10 w-44 rounded-lg border border-border bg-background px-3">
              <option>IFP · Bronze</option><option>IFP · Silver</option><option>IFP · Gold</option>
              <option>Dental</option><option>Vision</option>
            </select>
          </label>
          <button type="submit" className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">Create lead</button>
        </form>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID…"
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...STAGES] as const).map((s) => (
            <button
              key={s} onClick={() => setStage(s as typeof stage)} aria-pressed={stage === s}
              className={cn("rounded-full border px-3 py-1.5 text-xs",
                stage === s ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-accent")}
            >
              {s === "all" ? "All stages" : s}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={cols} rows={filtered} getRowId={(r) => r.id}
        ariaLabel="Leads and customers"
        empty={<span>No leads match those filters.</span>}
      />
    </InternalShell>
  );
}
