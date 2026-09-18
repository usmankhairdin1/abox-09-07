/**
 * SCR-M04-002 — Marketplace Administration Home.
 * Root operational summary, release status, blockers and quick actions
 * (JET_PLATFORM_ADMIN, AGENCY_ADMIN_ROOT).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Store, ShieldCheck, AlertTriangle, Users, Palette, FileText, Image,
  Globe, ListTree, Link as LinkIcon, Headset, Eye, ListTodo, History, Activity, PauseCircle,
} from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { KpiCard } from "@/components/abox/kpi-card";
import { StatusBadge } from "@/components/abox/status-badge";
import { getOrganization, ROOT_ORGANIZATION_ID } from "@/lib/org-store";
import { useOrgState } from "@/lib/org-store";
import {
  useMarketplaceState, getMarketplace, getActiveRelease, getScheduledRelease, getReadiness,
  getOpenTaskCount, getParticipants, getAvailability, getPrimaryDomain, getActiveBrand, getHistory,
} from "@/lib/marketplace-store";
import { actionPillClass } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/marketplace/admin/")({
  head: () => ({ meta: [{ title: "Marketplace Administration — ABox" }, { name: "description", content: "Root operational summary, release status, blockers and quick actions." }] }),
  component: Page,
});

const LIFECYCLE_TONE = { DRAFT: "muted", ACTIVE: "sage", SUSPENDED: "warning", ENDED: "destructive" } as const;
const READINESS_TONE = { READY: "sage", READY_WITH_WARNINGS: "warning", BLOCKED: "destructive", NOT_EVALUATED: "muted" } as const;

const QUICK_ACTIONS = [
  { label: "Brand", to: "/marketplace/admin/brand", icon: Palette },
  { label: "Content", to: "/marketplace/admin/content", icon: FileText },
  { label: "Assets", to: "/marketplace/admin/assets", icon: Image },
  { label: "Domains", to: "/marketplace/admin/domains", icon: Globe },
  { label: "Availability", to: "/marketplace/admin/availability", icon: ListTree },
  { label: "Participants", to: "/marketplace/admin/participants", icon: Users },
  { label: "Referral links", to: "/marketplace/admin/referral-links", icon: LinkIcon },
  { label: "Routing & support", to: "/marketplace/admin/routing-support", icon: Headset },
  { label: "Readiness", to: "/marketplace/admin/readiness", icon: ShieldCheck },
  { label: "Preview", to: "/marketplace/admin/preview", icon: Eye },
  { label: "Lifecycle", to: "/marketplace/admin/lifecycle", icon: PauseCircle },
  { label: "Work", to: "/marketplace/admin/work", icon: ListTodo },
  { label: "History", to: "/marketplace/admin/history", icon: History },
  { label: "Health", to: "/marketplace/admin/health", icon: Activity },
] as const;

function Page() {
  const mkt = useMarketplaceState();
  const org = useOrgState();
  const marketplace = getMarketplace(mkt);
  const release = getActiveRelease(mkt);
  const scheduled = getScheduledRelease(mkt);
  const readiness = getReadiness(mkt);
  const openTasks = getOpenTaskCount(mkt);
  const participants = getParticipants(mkt);
  const enabledParticipants = participants.filter((p) => p.participation_state === "ENABLED").length;
  const availability = getAvailability(mkt);
  const enabledProducts = availability.filter((a) => a.status === "ENABLED").length;
  const domain = getPrimaryDomain(mkt);
  const brand = getActiveBrand(mkt);
  const owner = getOrganization(org, marketplace.owner_organization_id ?? ROOT_ORGANIZATION_ID);
  const recentHistory = getHistory(mkt).slice(0, 5);

  return (
    <InternalShell
      workspace="agency" pageTitle="Marketplace administration" eyebrow={`Marketplace · ${marketplace.internal_code}`}
      actions={
        marketplace.lifecycle_status === "DRAFT" ? (
          <Link to="/marketplace/admin/activation" className={actionPillClass("primaryMd")}>
            Submit for activation
          </Link>
        ) : (
          <Link to="/marketplace/admin/releases/review" className={actionPillClass("primaryMd")}>
            Publish a release
          </Link>
        )
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} className={actionPillClass("outlineSmCard")}>
            <a.icon className="h-3.5 w-3.5" aria-hidden /> {a.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Lifecycle" value={marketplace.lifecycle_status} icon={Store} tone={marketplace.lifecycle_status === "ACTIVE" ? "sage" : "default"} />
        <KpiCard label="Readiness" value={readiness ? readiness.status.replaceAll("_", " ") : "Not evaluated"} icon={ShieldCheck} tone={readiness?.status === "READY" ? "sage" : readiness?.status === "BLOCKED" ? "warning" : "default"} />
        <KpiCard label="Enabled participants" value={`${enabledParticipants} / ${participants.length}`} icon={Users} />
        <KpiCard label="Open issues" value={openTasks} icon={AlertTriangle} tone={openTasks > 0 ? "warning" : "default"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">Active release</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><dt className="text-muted-foreground">Owner</dt><dd>{owner?.display_name}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-muted-foreground">Brand</dt><dd>{brand?.display_name ?? "—"}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-muted-foreground">Domain</dt><dd>{domain?.hostname ?? "Not configured"}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-muted-foreground">Enabled product paths</dt><dd>{enabledProducts} / {availability.length}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-muted-foreground">Published</dt><dd>{release?.published_at ? new Date(release.published_at).toLocaleDateString() : "Never"}</dd></div>
          </dl>
          {scheduled && (
            <p className="mt-4 rounded-xl border border-warning/40 bg-warning/5 p-3 text-sm">
              A release is scheduled for {new Date(scheduled.effective_from!).toLocaleString()}.{" "}
              <Link to="/marketplace/admin/releases/schedule" className="story-link text-primary">Manage schedule</Link>
            </p>
          )}
          {readiness && readiness.status !== "READY" && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <p className="font-medium">Blockers</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                {readiness.items.filter((i) => i.result !== "PASS").map((i) => <li key={i.readiness_item_id}>{i.next_action ?? i.control_code.replaceAll("_", " ")}</li>)}
              </ul>
              <Link to="/marketplace/admin/readiness" className="story-link mt-2 inline-block text-primary">Open readiness</Link>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-display mb-3 text-xl">Recent changes</h2>
          {recentHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet.</p>
          ) : (
            <ol className="divide-y divide-border">
              {recentHistory.map((h) => (
                <li key={h.history_id} className="py-2.5 text-sm">
                  <span className="text-xs text-muted-foreground">{new Date(h.when).toLocaleDateString()}</span> <span className="font-medium">{h.actor}</span> — {h.summary}
                </li>
              ))}
            </ol>
          )}
          <Link to="/marketplace/admin/history" className="story-link mt-3 inline-block text-sm text-primary">View full history</Link>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-display mb-3 text-xl">Participants</h2>
        <ul className="grid gap-2 sm:grid-cols-3">
          {participants.map((p) => {
            const o = getOrganization(org, p.organization_id);
            return (
              <li key={p.participant_id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <span>{o?.display_name ?? p.organization_id}</span>
                <StatusBadge tone={p.participation_state === "ENABLED" ? "sage" : p.participation_state === "SUSPENDED" ? "destructive" : p.participation_state === "PENDING_READINESS" ? "warning" : "muted"}>{p.participation_state.replaceAll("_", " ")}</StatusBadge>
              </li>
            );
          })}
        </ul>
        <Link to="/marketplace/admin/participants" className="story-link mt-3 inline-block text-sm text-primary">Manage participants</Link>
      </section>
    </InternalShell>
  );
}
