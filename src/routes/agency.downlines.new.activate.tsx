/**
 * SCR-M05-014 — Create Downline Agency: Activation.
 * Activation confirmation and result. Writes the new Organization,
 * OrganizationRelationship (PARENT_OF), Contact, Address, Identifier,
 * Setting and Readiness records into the M05 mock store.
 */
import { surfaceClass } from "@/components/abox/surface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, PartyPopper } from "lucide-react";
import { InternalShell } from "@/components/abox/internal-shell";
import { DownlineWizardStepper } from "@/components/abox/downline-wizard-stepper";
import { loadWizardState, clearWizardState } from "@/lib/downline-wizard-store";
import {
  orgStore, TENANT_ID, ROOT_ORGANIZATION_ID, type Organization,
} from "@/lib/org-store";
import { ActionPill, actionPillClass } from "@/components/abox/action-pill-component";

export const Route = createFileRoute("/agency/downlines/new/activate")({
  head: () => ({ meta: [{ title: "Create Downline Agency — Activation — ABox" }] }),
  component: Page,
});

function rid(prefix: string): string {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

function Page() {
  const navigate = useNavigate();
  const [activated, setActivated] = useState<Organization | null>(null);

  const onActivate = () => {
    const wiz = loadWizardState();
    const now = new Date().toISOString();
    const organizationId = rid("org");

    const org: Organization = {
      organization_id: organizationId, tenant_id: TENANT_ID,
      reference_code: `ORG-${1000 + Math.floor(Math.random() * 8999)}`,
      organization_type: "AGENCY",
      legal_name: wiz.identity.legal_name, display_name: wiz.identity.display_name,
      dba_name: wiz.identity.dba_name || undefined,
      lifecycle_status: "ACTIVE", time_zone: wiz.legal.time_zone, default_language: wiz.legal.default_language,
      version: 1,
    };
    orgStore.addOrganization(org);

    orgStore.addRelationship({
      relationship_id: rid("rel"), tenant_id: TENANT_ID,
      parent_organization_id: ROOT_ORGANIZATION_ID, child_organization_id: organizationId,
      relationship_type: "PARENT_OF", status: "ACTIVE", effective_from: now, version: 1,
    });

    orgStore.addContact({
      contact_id: rid("ct"), organization_id: organizationId, contact_role: "PRIMARY_BUSINESS",
      name: wiz.contact.contact_name, job_title: wiz.contact.job_title || undefined,
      email: wiz.contact.email, telephone: wiz.contact.telephone,
      preferred_language: wiz.contact.preferred_language, effective_from: now,
    });

    orgStore.addAddress({
      address_id: rid("addr"), organization_id: organizationId, location_type: "HEADQUARTERS",
      line_1: wiz.location.line_1, line_2: wiz.location.line_2 || undefined, city: wiz.location.city,
      state_code: wiz.location.state_code, postal_code: wiz.location.postal_code, country_code: 840,
      validated_status: "UNVERIFIED", effective_from: now,
    });

    orgStore.addIdentifier({
      identifier_id: rid("id"), organization_id: organizationId, identifier_type: wiz.legal.identifier_type,
      masked_value: `••••${wiz.legal.identifier_value.slice(-4)}`, source: "Root intake",
      verification_status: "PENDING_VERIFICATION", effective_from: now,
    });

    orgStore.addSetting({
      setting_id: rid("set"), organization_id: organizationId, setting_key: "quote_expiration_days",
      value_json: wiz.settings.quote_expiration_days, source: wiz.settings.copy_root_defaults ? "ROOT_DEFAULT" : "DOWNLINE_OVERRIDE",
      effective_from: now, version: 1,
    });

    orgStore.setReadiness({
      readiness_id: rid("rdy"), organization_id: organizationId, status: "READY_WITH_WARNINGS",
      blocking_count: 0, warning_count: 1, evaluated_at: now, policy_version: 1,
      items: [
        { readiness_item_id: rid("rdyi"), readiness_id: organizationId, control_code: "PROFILE_COMPLETE", result: "PASS", owner_module: "M05" },
        { readiness_item_id: rid("rdyi"), readiness_id: organizationId, control_code: "ADMINISTRATOR_ASSIGNED", result: "PASS", owner_module: "M00", next_action: `Invitation recorded for ${wiz.administrator.admin_email} — no live invitation backend yet.` },
        { readiness_item_id: rid("rdyi"), readiness_id: organizationId, control_code: "IDENTIFIER_VERIFIED", result: "WARNING", owner_module: "M05", next_action: "Verification will complete once a live identifier-verification integration exists." },
      ],
    });

    orgStore.addHistory({
      history_id: rid("hist"), organization_id: organizationId, when: now, actor: "Elena Alvarez",
      summary: "Direct downline created and activated.",
    });

    clearWizardState();
    setActivated(org);
  };

  if (activated) {
    return (
      <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Activation · SCR-M05-014">
        <div className="mx-auto max-w-lg rounded-2xl border border-sage/40 bg-sage-soft/40 p-8 text-center">
          <PartyPopper className="mx-auto h-8 w-8 text-sage" aria-hidden />
          <h2 className="text-display mt-4 text-2xl">{activated.display_name} is active</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {activated.reference_code} was created as a direct downline of Cedar Grove Insurance and is ready with warnings —
            identifier verification is still pending.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/agency/organizations/$organizationId" params={{ organizationId: activated.organization_id }}
              className={actionPillClass("primaryMd")}
            >
              View organization profile
            </Link>
            <Link to="/agency/organization-admin" className={actionPillClass("outlineMd")}>
              Back to admin home
            </Link>
          </div>
        </div>
      </InternalShell>
    );
  }

  return (
    <InternalShell workspace="agency" pageTitle="Create downline agency" eyebrow="Activation · SCR-M05-014">
      <DownlineWizardStepper />

      <div className={cn("mt-8 max-w-2xl space-y-5", surfaceClass({ padding: "lg" }))}>
        <div className="flex items-start gap-2 rounded-xl border border-hairline bg-surface/60 p-3 text-sm">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
          <p>All required readiness controls pass. Activating will create the organization, its relationship to Cedar Grove Insurance, and its profile records.</p>
        </div>

        <div className="flex justify-between pt-2">
          <ActionPill
            onClick={() => navigate({ to: "/agency/downlines/new/readiness" })}
            variant="outlineLg"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </ActionPill>
          <ActionPill
            onClick={onActivate}
            variant="primaryLg"
          >
            Activate downline agency
          </ActionPill>
        </div>
      </div>
    </InternalShell>
  );
}
