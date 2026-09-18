/**
 * SCR-M05-016 — Organization Readiness.
 * Control-level readiness and next actions.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, RotateCw, UserCheck } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import {
  orgStore, useOrgState, getOrganization, getReadiness,
} from "@/lib/org-store";
import { ActionPill } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/organizations/$organizationId/readiness")({
  loader: ({ params }) => ({ organizationId: params.organizationId }),
  head: ({ params }) => ({ meta: [{ title: `Readiness — ${params.organizationId} — ABox` }] }),
  component: Page,
});

const RESULT_TONE = { PASS: "sage", WARNING: "warning", FAIL: "destructive", NOT_APPLICABLE: "muted" } as const;

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);
  const readiness = getReadiness(org, organizationId);

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Readiness · M05">
        <p>That organization doesn't exist in this session. <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link></p>
      </InternalShell>
    );
  }

  return (
    <InternalShell
      workspace="agency" pageTitle={`Readiness — ${record.display_name}`} eyebrow="Organization Readiness · SCR-M05-016"
      actions={
        <ActionPill
          onClick={() => orgStore.recalculateReadiness(organizationId)}
          variant="primaryMd"
        >
          <RotateCw className="h-4 w-4" aria-hidden /> Recalculate
        </ActionPill>
      }
    >
      <Link to="/agency/organizations/$organizationId" params={{ organizationId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      {readiness ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Overall status</h2></span>
            <StatusBadge tone={readiness.status === "READY" ? "sage" : readiness.status === "READY_WITH_WARNINGS" ? "warning" : readiness.status === "BLOCKED" ? "destructive" : "muted"}>
              {readiness.status.replaceAll("_", " ")}
            </StatusBadge>
          </div>
          <p className="mb-4 text-xs text-muted-foreground" suppressHydrationWarning>
            Evaluated {new Date(readiness.evaluated_at).toLocaleString()} · policy v{readiness.policy_version} · {readiness.blocking_count} blocking, {readiness.warning_count} warning
          </p>
          <ul className="divide-y divide-border">
            {readiness.items.map((item) => (
              <li key={item.readiness_item_id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{item.control_code.replaceAll("_", " ")}</p>
                  {item.next_action && <p className="text-xs text-muted-foreground">{item.next_action}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.owner_module}</span>
                  <StatusBadge tone={RESULT_TONE[item.result]}>{item.result}</StatusBadge>
                  {item.control_code === "ADMINISTRATOR_ASSIGNED" && item.result !== "PASS" && (
                    <ActionPill
                      onClick={() => orgStore.markAdministratorActive(organizationId, "Elena Alvarez")}
                      variant="outlineXs"
                    >
                      <UserCheck className="h-3.5 w-3.5" aria-hidden /> Mark administrator active
                    </ActionPill>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">Users cannot manually pass a failed control — resolve the underlying profile, identifier or administrator gap, then recalculate.</p>
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">Not evaluated yet.</p>
      )}
    </InternalShell>
  );
}
