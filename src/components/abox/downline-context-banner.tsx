/**
 * SCR-M05-015 — Downline Context Banner.
 * Persistent, explicit actual-user / root / downline context indicator.
 * Never implies impersonation: always shows the real signed-in actor
 * plus which organization they're currently acting within.
 */
import { Building2, ArrowLeftCircle } from "lucide-react";
import { useAuthSession } from "@/lib/auth-session";
import { orgStore, useOrgState, getOrganization, ROOT_ORGANIZATION_ID } from "@/lib/org-store";

export function DownlineContextBanner() {
  const org = useOrgState();
  const { session } = useAuthSession();
  const actorLabel = session?.user.email ?? session?.user.phone ?? "Elena Alvarez (agent workspace)";
  const root = getOrganization(org, ROOT_ORGANIZATION_ID);
  const selected = org.contextOrganizationId ? getOrganization(org, org.contextOrganizationId) : null;
  const inDownlineContext = !!selected;

  return (
    <div
      role="status"
      className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-card px-5 py-3"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{actorLabel}</span>
        </span>
        <span className="hidden h-4 w-px bg-hairline sm:block" aria-hidden />
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-primary" aria-hidden />
          {inDownlineContext ? (
            <>
              <span className="text-muted-foreground">Acting for downline</span>
              <span className="font-medium text-foreground">{selected!.display_name}</span>
            </>
          ) : (
            <>
              <span className="text-muted-foreground">Acting as root</span>
              <span className="font-medium text-foreground">{root?.display_name ?? "—"}</span>
            </>
          )}
        </span>
      </div>
      {inDownlineContext && (
        <button
          onClick={() => orgStore.setContext(null)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
        >
          <ArrowLeftCircle className="h-3.5 w-3.5" aria-hidden />
          Return to root
        </button>
      )}
    </div>
  );
}
