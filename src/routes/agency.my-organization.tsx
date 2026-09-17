/**
 * SCR-M05-003 — Downline Administration Home.
 * Own-organization completeness, lifecycle, parent, administrators,
 * readiness, issues, next actions, recent changes and overrides for the
 * organization currently in context (root sees its own home when not
 * acting inside a downline).
 */
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, ShieldCheck, AlertTriangle, History, ArrowRight } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { DownlineContextBanner } from "@/components/abox/downline-context-banner";
import {
  useOrgState, getOrganization, getContacts, getAddresses, getIdentifiers,
  getReadiness, getHistory, getRelationship, getOverrides, getOpenTaskCount,
  ROOT_ORGANIZATION_ID, ORG_TYPE_LABEL,
} from "@/lib/org-store";
import { ACTION_PILL } from "@/components/abox/action-pill";

export const Route = createFileRoute("/agency/my-organization")({
  head: () => ({ meta: [{ title: "Downline Administration Home — ABox" }, { name: "description", content: "Own-organization readiness, profile and next actions." }] }),
  component: Page,
});

function Page() {
  const org = useOrgState();
  const orgId = org.contextOrganizationId ?? ROOT_ORGANIZATION_ID;
  const record = getOrganization(org, orgId);
  const isRoot = orgId === ROOT_ORGANIZATION_ID;
  const readiness = getReadiness(org, orgId);
  const relationship = isRoot ? undefined : getRelationship(org, orgId);
  const root = getOrganization(org, ROOT_ORGANIZATION_ID);
  const history = getHistory(org, orgId).slice(0, 5);
  const overrides = getOverrides(org, orgId);
  const openTasks = getOpenTaskCount(org, orgId);
  const contacts = getContacts(org, orgId);
  const addresses = getAddresses(org, orgId);
  const identifiers = getIdentifiers(org, orgId);

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Organization · M05">
        <p>No organization is in context.</p>
      </InternalShell>
    );
  }

  return (
    <InternalShell
      workspace="agency" pageTitle={record.display_name} eyebrow={`My organization · ${record.reference_code}`}
      actions={
        <Link to="/agency/organizations/$organizationId" params={{ organizationId: orgId }} className={ACTION_PILL.primaryMd}>
          Open full profile <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      }
    >
      <DownlineContextBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Lifecycle" value={record.lifecycle_status} icon={Building2} tone={record.lifecycle_status === "ACTIVE" ? "sage" : "default"} />
        <KpiCard label="Readiness" value={readiness ? readiness.status.replaceAll("_", " ") : "Not evaluated"} icon={ShieldCheck} tone={readiness?.status === "READY" ? "sage" : readiness?.status === "BLOCKED" ? "warning" : "default"} />
        <KpiCard label="Open issues" value={openTasks} icon={AlertTriangle} tone={openTasks > 0 ? "warning" : "default"} />
        <KpiCard label="Overrides applied" value={overrides.length} icon={History} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">Profile completeness</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between"><span>Type</span><span>{ORG_TYPE_LABEL[record.organization_type]}</span></li>
            <li className="flex items-center justify-between"><span>Contacts on file</span><span>{contacts.length}</span></li>
            <li className="flex items-center justify-between"><span>Addresses on file</span><span>{addresses.length}</span></li>
            <li className="flex items-center justify-between"><span>External identifiers</span><span>{identifiers.length}</span></li>
            <li className="flex items-center justify-between"><span>Time zone</span><span>{record.time_zone}</span></li>
            <li className="flex items-center justify-between"><span>Language</span><span>{record.default_language === "EN" ? "English" : "Español"}</span></li>
          </ul>
          {!isRoot && relationship && (
            <p className="mt-4 text-sm text-muted-foreground">
              Direct downline of <span className="font-medium text-foreground">{root?.display_name}</span> since{" "}
              {new Date(relationship.effective_from).toLocaleDateString()} — <StatusBadge tone={relationship.status === "ACTIVE" ? "sage" : "warning"}>{relationship.status}</StatusBadge>
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">Recent changes</h2>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet.</p>
          ) : (
            <ol className="divide-y divide-border">
              {history.map((h) => (
                <li key={h.history_id} className="py-2.5 text-sm">
                  <span className="text-xs text-muted-foreground">{new Date(h.when).toLocaleDateString()}</span>{" "}
                  <span className="font-medium">{h.actor}</span> — {h.summary}
                </li>
              ))}
            </ol>
          )}
          <Link to="/agency/organizations/$organizationId/history" params={{ organizationId: orgId }} className="story-link mt-3 inline-block text-sm text-primary">
            View full activity history
          </Link>
        </section>
      </div>

      {readiness && readiness.status !== "READY" && (
        <section className="mt-6 rounded-2xl border border-warning/40 bg-warning/5 p-5">
          <h2 className="text-display mb-3 text-xl">Next actions</h2>
          <ul className="space-y-2 text-sm">
            {readiness.items.filter((i) => i.result !== "PASS").map((i) => (
              <li key={i.readiness_item_id} className="flex items-center justify-between gap-3">
                <span>{i.control_code.replaceAll("_", " ")}</span>
                <span className="text-muted-foreground">{i.next_action ?? "Resolve to continue."}</span>
              </li>
            ))}
          </ul>
          <Link to="/agency/organizations/$organizationId/readiness" params={{ organizationId: orgId }} className="story-link mt-3 inline-block text-sm text-primary">
            Open readiness detail
          </Link>
        </section>
      )}
    </InternalShell>
  );
}
