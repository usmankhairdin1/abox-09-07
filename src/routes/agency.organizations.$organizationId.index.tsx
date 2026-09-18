/**
 * SCR-M05-006 — Organization Profile.
 * Fixed profile sections and history for JET_PLATFORM_ADMIN,
 * AGENCY_ADMIN_ROOT and AGENCY_ADMIN_DOWNLINE.
 */
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, Fingerprint, Settings2, History, ShieldCheck, GitBranch, PauseCircle, XCircle, ShieldAlert } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { StatusBadge } from "@/components/abox/status-badge";
import { DownlineContextBanner } from "@/components/abox/downline-context-banner";
import {
  orgStore, useOrgState, getOrganization, getContacts, getAddresses, getIdentifiers,
  getSettings, getReadiness, getHistory, getRelationship, ROOT_ORGANIZATION_ID,
  ORG_TYPE_LABEL, COUNTRY_NAME,
} from "@/lib/org-store";
import { ActionPill, actionPillClass } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/organizations/$organizationId/")({
  loader: ({ params }) => {
    // Existence is re-checked reactively in the component (sessionStorage-backed
    // store isn't available in the SSR loader); this just guards the obviously invalid case.
    return { organizationId: params.organizationId };
  },
  head: ({ params }) => ({ meta: [{ title: `Organization — ${params.organizationId} — ABox` }] }),
  component: Page,
});

const READINESS_RESULT_TONE = { PASS: "sage", WARNING: "warning", FAIL: "destructive", NOT_APPLICABLE: "muted" } as const;

function Page() {
  const { organizationId } = Route.useLoaderData();
  const org = useOrgState();
  const record = getOrganization(org, organizationId);

  if (!record) {
    return (
      <InternalShell workspace="agency" pageTitle="Organization not found" eyebrow="Organization · M05">
        <p>
          That organization doesn't exist in this session.{" "}
          <Link to="/agency/organizations" className="story-link text-primary">Back to directory</Link>
        </p>
      </InternalShell>
    );
  }

  const contacts = getContacts(org, organizationId);
  const addresses = getAddresses(org, organizationId);
  const identifiers = getIdentifiers(org, organizationId);
  const settings = getSettings(org, organizationId);
  const readiness = getReadiness(org, organizationId);
  const history = getHistory(org, organizationId);
  const relationship = getRelationship(org, organizationId);
  const root = getOrganization(org, ROOT_ORGANIZATION_ID);
  const isRoot = organizationId === ROOT_ORGANIZATION_ID;
  const inContext = org.contextOrganizationId === organizationId;

  return (
    <InternalShell
      workspace="agency" eyebrow={`Organization · ${record.reference_code}`} pageTitle={record.display_name}
      actions={
        !isRoot && (
          <ActionPill
            onClick={() => orgStore.setContext(inContext ? null : organizationId)}
            variant="primaryMd"
          >
            {inContext ? "Exit downline context" : "Act as this downline"}
          </ActionPill>
        )
      }
    >
      <aside className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="contents text-sm">
          <div>
            <p className="text-eyebrow">Lifecycle</p>
            <StatusBadge tone={record.lifecycle_status === "ACTIVE" ? "sage" : record.lifecycle_status === "DRAFT" ? "muted" : "destructive"}>{record.lifecycle_status}</StatusBadge>
          </div>
          <div>
            <p className="text-eyebrow">Type</p>
            <p>{ORG_TYPE_LABEL[record.organization_type]}</p>
          </div>
          {!isRoot && relationship && (
            <div>
              <p className="text-eyebrow">Relationship to root</p>
              <StatusBadge tone={relationship.status === "ACTIVE" ? "sage" : relationship.status === "PENDING" ? "warning" : "muted"}>{relationship.status}</StatusBadge>
              <p className="mt-1 text-xs text-muted-foreground">Direct downline since {new Date(relationship.effective_from).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <p className="text-eyebrow">Readiness</p>
            {readiness ? (
              <StatusBadge tone={readiness.status === "READY" ? "sage" : readiness.status === "READY_WITH_WARNINGS" ? "warning" : readiness.status === "BLOCKED" ? "destructive" : "muted"}>
                {readiness.status.replaceAll("_", " ")}
              </StatusBadge>
            ) : <span className="text-muted-foreground">Not evaluated</span>}
          </div>
          <div>
            <p className="text-eyebrow">Time zone</p>
            <p>{record.time_zone}</p>
          </div>
          <div>
            <p className="text-eyebrow">Default language</p>
            <p>{record.default_language === "EN" ? "English" : "Español"}</p>
          </div>
        </div>
        </div>
      </aside>

      <DownlineContextBanner />

      <Link to="/agency/organizations" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to directory
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Contacts</h2></span>
            <Link to="/agency/organizations/$organizationId/contacts" params={{ organizationId }} className="story-link text-sm text-primary">Manage</Link>
          </header>
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contacts on file.</p>
          ) : (
            <ul className="space-y-3">
              {contacts.map((c) => (
                <li key={c.contact_id} className="rounded-xl border border-border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{c.name}</p>
                    <StatusBadge tone="muted">{c.contact_role.replaceAll("_", " ")}</StatusBadge>
                  </div>
                  {c.job_title && <p className="text-xs text-muted-foreground">{c.job_title}</p>}
                  <p className="mt-1 flex items-center gap-1.5 text-xs"><Mail className="h-3 w-3" /> {c.email}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3" /> {c.telephone}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Addresses &amp; offices</h2></span>
            <Link to="/agency/organizations/$organizationId/locations" params={{ organizationId }} className="story-link text-sm text-primary">Manage</Link>
          </header>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No addresses on file.</p>
          ) : (
            <ul className="space-y-3">
              {addresses.map((a) => (
                <li key={a.address_id} className="rounded-xl border border-border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{a.line_1}</p>
                    <StatusBadge tone="muted">{a.location_type}</StatusBadge>
                  </div>
                  {a.line_2 && <p className="text-xs text-muted-foreground">{a.line_2}</p>}
                  <p className="text-xs text-muted-foreground">{a.city}, {a.state_code} {a.postal_code} · {COUNTRY_NAME[a.country_code] ?? a.country_code}</p>
                  <p className="mt-1 text-xs"><StatusBadge tone={a.validated_status === "VERIFIED" ? "sage" : "warning"}>{a.validated_status.replaceAll("_", " ")}</StatusBadge></p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><Fingerprint className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">External identifiers</h2></span>
            <Link to="/agency/organizations/$organizationId/identifiers" params={{ organizationId }} className="story-link text-sm text-primary">Manage</Link>
          </header>
          {identifiers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No identifiers on file.</p>
          ) : (
            <ul className="space-y-3">
              {identifiers.map((i) => (
                <li key={i.identifier_id} className="rounded-xl border border-border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{i.identifier_type.replaceAll("_", " ")}</p>
                    <StatusBadge tone={i.verification_status === "VERIFIED" ? "sage" : i.verification_status === "PENDING_VERIFICATION" ? "warning" : i.verification_status === "REJECTED" ? "destructive" : "muted"}>
                      {i.verification_status.replaceAll("_", " ")}
                    </StatusBadge>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{i.masked_value}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Settings</h2></span>
            <Link to="/agency/organizations/$organizationId/settings" params={{ organizationId }} className="story-link text-sm text-primary">Manage</Link>
          </header>
          {settings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No settings on file.</p>
          ) : (
            <ul className="space-y-2">
              {settings.map((s) => (
                <li key={s.setting_id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                  <span className="font-medium">{s.setting_key.replaceAll("_", " ")}</span>
                  <span className="flex items-center gap-2 tabular-nums">
                    {String(s.value_json)}
                    <StatusBadge tone="muted">{s.source.replaceAll("_", " ")}</StatusBadge>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {readiness && (
          <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
            <header className="mb-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Readiness</h2></span>
              <Link to="/agency/organizations/$organizationId/readiness" params={{ organizationId }} className="story-link text-sm text-primary">Manage</Link>
            </header>
            <ul className="divide-y divide-border">
              {readiness.items.map((item) => (
                <li key={item.readiness_item_id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">{item.control_code.replaceAll("_", " ")}</p>
                    {item.next_action && <p className="text-xs text-muted-foreground">{item.next_action}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.owner_module}</span>
                    <StatusBadge tone={READINESS_RESULT_TONE[item.result]}>{item.result}</StatusBadge>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!isRoot && (
          <section className="rounded-2xl border border-border bg-card p-5">
            <header className="mb-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><GitBranch className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Relationships</h2></span>
              <Link to="/agency/organizations/$organizationId/relationships" params={{ organizationId }} className="story-link text-sm text-primary">View all</Link>
            </header>
            <p className="text-sm text-muted-foreground">
              {relationship ? `Direct downline of ${root?.display_name ?? "the root agency"} since ${new Date(relationship.effective_from).toLocaleDateString()}.` : "No relationship on file."}
            </p>
          </section>
        )}

        <section className={`rounded-2xl border border-border bg-card p-5 ${isRoot ? "lg:col-span-2" : ""}`}>
          <header className="mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><History className="h-4 w-4 text-muted-foreground" /><h2 className="text-display text-xl">Activity &amp; change history</h2></span>
            <Link to="/agency/organizations/$organizationId/history" params={{ organizationId }} className="story-link text-sm text-primary">View all</Link>
          </header>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet.</p>
          ) : (
            <ol className="divide-y divide-border">
              {history.slice(0, 5).map((h) => (
                <li key={h.history_id} className="grid grid-cols-[140px_1fr] gap-4 py-3 text-sm">
                  <span className="text-xs text-muted-foreground">{new Date(h.when).toLocaleString()}</span>
                  <span>
                    <span className="font-medium">{h.actor}</span> — {h.summary}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {!isRoot && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-5">
          <span className="text-sm font-medium text-muted-foreground">Lifecycle &amp; oversight:</span>
          <Link to="/agency/organizations/$organizationId/lifecycle" params={{ organizationId }} className={actionPillClass("outlineSm")}>
            <PauseCircle className="h-4 w-4" aria-hidden /> Suspend / reactivate
          </Link>
          <Link to="/agency/organizations/$organizationId/ending" params={{ organizationId }} className={actionPillClass("outlineSm")}>
            <XCircle className="h-4 w-4" aria-hidden /> End &amp; offboard
          </Link>
          <Link to="/platform/organizations/$organizationId/override" params={{ organizationId }} className={actionPillClass("outlineSm")}>
            <ShieldAlert className="h-4 w-4" aria-hidden /> JET override
          </Link>
        </div>
      )}
    </InternalShell>
  );
}
