/**
 * SCR-M05-028 — Organization Ending and Offboarding.
 * Individual continuity checklist (REQ-M05-OPS-024). Ended organizations
 * are not routinely reactivated — this is deliberately one-way.
 */
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, XCircle, CheckSquare, Square } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { orgStore, useOrgState, getOrganization } from "@/lib/org-store";

export const Route = createFileRoute("/agency/organizations/$organizationId/ending")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `End & offboard — ${params.organizationId} — ABox` }] }),
  component: Page,
});

const CHECKLIST = [
  "Open work reassigned to root or a sibling downline",
  "Users notified of the transition and access change",
  "Consumer records reviewed and reassigned where required",
  "Transaction and enrollment history confirmed preserved",
  "Documents retained per M13 retention policy",
  "Any pending handoffs completed",
  "Requested data exports completed",
  "Retention and legal-hold status reviewed",
] as const;

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Ending · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  const allChecked = CHECKLIST.every((item) => checked.has(item));
  const toggle = (item: string) => {
    const next = new Set(checked);
    next.has(item) ? next.delete(item) : next.add(item);
    setChecked(next);
  };

  const onEnd = () => {
    if (!allChecked || !reason.trim()) return;
    orgStore.endOrganization(organizationId, "Elena Alvarez", reason);
    navigate({ to: "/agency/organizations" });
  };

  if (record.lifecycle_status === "ENDED") {
    return (
      <InternalShell workspace="agency" pageTitle={`${record.display_name} — ended`} eyebrow="Organization Ending and Offboarding · SCR-M05-028">
        <p className="text-sm text-muted-foreground">This organization has already been ended and offboarded. Ended organizations are not routinely reactivated.</p>
        <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="story-link mt-3 inline-block text-sm text-primary">Back to profile</Link>
      </InternalShell>
    );
  }

  return (
    <InternalShell workspace="agency" pageTitle={`End & offboard — ${record.display_name}`} eyebrow="Organization Ending and Offboarding · SCR-M05-028">
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <section className="rounded-2xl border border-destructive/30 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-display text-xl">Offboarding checklist</h2>
          <StatusBadge tone={allChecked ? "sage" : "warning"}>{checked.size}/{CHECKLIST.length} complete</StatusBadge>
        </div>
        <ul className="space-y-2 text-sm">
          {CHECKLIST.map((item) => (
            <li key={item}>
              <button onClick={() => toggle(item)} className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left hover:bg-accent">
                {checked.has(item) ? <CheckSquare className="h-4 w-4 shrink-0 text-sage" aria-hidden /> : <Square className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
                {item}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <label className="mb-1 block text-eyebrow">Reason for ending</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="w-full rounded-lg border border-border bg-background p-3 text-sm" />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Ending is individual and does not physically delete the organization — historical and evidentiary records remain intact (REQ-M05-ORG-006).
        </p>

        <button
          onClick={onEnd} disabled={!allChecked || !reason.trim()}
          className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-destructive px-5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40"
        >
          <XCircle className="h-4 w-4" aria-hidden /> End and offboard organization
        </button>
      </section>
    </InternalShell>
  );
}
