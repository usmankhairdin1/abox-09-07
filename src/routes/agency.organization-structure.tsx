/**
 * SCR-M05-005 — Organization Structure.
 * Root and direct-downline hierarchy with actions (AGENCY_ADMIN_ROOT).
 * Lean, fixed one-level hierarchy — no configurable graph builder
 * (REQ-M05-REL-003 lean hierarchy depth).
 */
import { surfaceClass } from "@/components/abox/surface";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ArrowRight, Eye } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { DownlineContextBanner } from "@/components/abox/downline-context-banner";
import {
  orgStore, useOrgState, getOrganization, getDirectDownlines, getReadiness, getRelationship,
  ROOT_ORGANIZATION_ID,
} from "@/lib/org-store";
import { ActionPill, actionPillClass } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/organization-structure")({
  head: () => ({ meta: [{ title: "Organization Structure — ABox" }, { name: "description", content: "Root and direct-downline hierarchy with actions." }] }),
  component: Page,
});

const READINESS_TONE = { READY: "sage", READY_WITH_WARNINGS: "warning", BLOCKED: "destructive", NOT_EVALUATED: "muted" } as const;

function Page() {
  const org = useOrgState();
  const root = getOrganization(org, ROOT_ORGANIZATION_ID);
  const downlines = getDirectDownlines(org, ROOT_ORGANIZATION_ID);

  if (!root) return null;

  return (
    <InternalShell workspace="agency" pageTitle="Organization structure" eyebrow="Organization · M05">
      <DownlineContextBanner />

      <p className="mb-6 text-sm text-muted-foreground">
        One tenant-owning root with direct downlines — Lucie supports a single hierarchy level; downlines cannot create children.
      </p>

      <div className={surfaceClass()}>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary-soft/30 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Building2 className="h-5 w-5" /></span>
            <div>
              <p className="font-medium">{root.display_name}</p>
              <p className="text-xs text-muted-foreground">Tenant-owning root · {root.reference_code}</p>
            </div>
          </div>
          <Link to="/agency/organizations/$organizationId" params={{ organizationId: root.organization_id }} className={actionPillClass("outlineSmCard")}>
            <Eye className="h-4 w-4" aria-hidden /> View profile
          </Link>
        </div>

        <ol className="mt-4 space-y-3 border-l-2 border-hairline pl-6">
          {downlines.length === 0 && (
            <li className="text-sm text-muted-foreground">No direct downlines yet.</li>
          )}
          {downlines.map((d) => {
            const readiness = getReadiness(org, d.organization_id);
            const rel = getRelationship(org, d.organization_id);
            const inContext = org.contextOrganizationId === d.organization_id;
            return (
              <li key={d.organization_id} className="relative flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
                <span aria-hidden className="absolute -left-[29px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-border" />
                <div className="min-w-0">
                  <p className="font-medium">{d.display_name}</p>
                  <p className="text-xs text-muted-foreground">{d.reference_code} · {rel ? rel.status : "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {readiness && <StatusBadge tone={READINESS_TONE[readiness.status]}>{readiness.status.replaceAll("_", " ")}</StatusBadge>}
                  <ActionPill
                    onClick={() => orgStore.setContext(inContext ? null : d.organization_id)}
                    variant="outlineSm"
                  >
                    {inContext ? "Exit context" : "Enter context"} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </ActionPill>
                  <Link to="/agency/organizations/$organizationId" params={{ organizationId: d.organization_id }} className={actionPillClass("outlineSm")}>
                    <Eye className="h-4 w-4" aria-hidden /> Profile
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </InternalShell>
  );
}
