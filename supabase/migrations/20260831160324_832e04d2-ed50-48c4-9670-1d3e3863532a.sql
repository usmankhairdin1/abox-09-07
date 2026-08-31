-- ABox Lucie M00 Platform Foundation - PostgreSQL migration V002 v1.1
-- Canonical M00 tables plus controlled technical tables. External M04/M05/M06/M08/M13/M26 IDs remain opaque contract references.

CREATE TABLE IF NOT EXISTS m00."user_identity" (
  "user_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "account_status" text NOT NULL,
  "primary_locale" text NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_user_identity" PRIMARY KEY ("user_id")
);

CREATE TABLE IF NOT EXISTS m00."actor_profile" (
  "actor_profile_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "actor_type" text NOT NULL,
  "status" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_actor_profile" PRIMARY KEY ("actor_profile_id")
);

CREATE TABLE IF NOT EXISTS m00."contact_method" (
  "contact_method_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "type" text NOT NULL,
  "normalized_value" text NOT NULL,
  "verified_at" timestamptz,
  "status" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_contact_method" PRIMARY KEY ("contact_method_id")
);

CREATE TABLE IF NOT EXISTS m00."identity_verification" (
  "verification_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "method" text NOT NULL,
  "result" text NOT NULL,
  "provider_reference" text,
  "verified_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_identity_verification" PRIMARY KEY ("verification_id")
);

CREATE TABLE IF NOT EXISTS m00."invitation" (
  "invitation_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "tenant_id" uuid NOT NULL,
  "organization_id" uuid NOT NULL,
  "role_template_ids" uuid[] DEFAULT '{}' NOT NULL,
  "status" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_invitation" PRIMARY KEY ("invitation_id")
);

CREATE TABLE IF NOT EXISTS m00."session" (
  "session_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "actor_type" text NOT NULL,
  "authentication_strength" text NOT NULL,
  "issued_at" timestamptz NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "revoked_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_session" PRIMARY KEY ("session_id")
);

CREATE TABLE IF NOT EXISTS m00."mfa_enrollment" (
  "mfa_enrollment_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "method" text NOT NULL,
  "status" text NOT NULL,
  "enrolled_at" timestamptz NOT NULL,
  "last_verified_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_mfa_enrollment" PRIMARY KEY ("mfa_enrollment_id")
);

CREATE TABLE IF NOT EXISTS m00."tenant_membership" (
  "membership_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "tenant_id" uuid NOT NULL,
  "organization_id" uuid NOT NULL,
  "status" text NOT NULL,
  "effective_from" date NOT NULL,
  "effective_to" date,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_tenant_membership" PRIMARY KEY ("membership_id")
);

CREATE TABLE IF NOT EXISTS m00."role_template" (
  "role_template_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "actor_type" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "status" text NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_role_template" PRIMARY KEY ("role_template_id")
);

CREATE TABLE IF NOT EXISTS m00."permission_definition" (
  "permission_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "code" text NOT NULL,
  "resource" text NOT NULL,
  "action" text NOT NULL,
  "risk_level" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_permission_definition" PRIMARY KEY ("permission_id")
);

CREATE TABLE IF NOT EXISTS m00."role_assignment" (
  "role_assignment_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "role_template_id" uuid NOT NULL,
  "tenant_id" uuid NOT NULL,
  "organization_id" uuid NOT NULL,
  "effective_from" timestamptz NOT NULL,
  "effective_to" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_role_assignment" PRIMARY KEY ("role_assignment_id")
);

CREATE TABLE IF NOT EXISTS m00."access_decision" (
  "access_decision_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "workload_identity_id" uuid,
  "permission_code" text NOT NULL,
  "result" text NOT NULL,
  "reason_code" text NOT NULL,
  "policy_version" text NOT NULL,
  "correlation_id" uuid NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_access_decision" PRIMARY KEY ("access_decision_id")
);

CREATE TABLE IF NOT EXISTS m00."privileged_access_grant" (
  "privileged_access_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "administrator_user_id" uuid NOT NULL,
  "target_tenant_id" uuid NOT NULL,
  "mode" text NOT NULL,
  "reason_code" text NOT NULL,
  "justification" text NOT NULL,
  "starts_at" timestamptz NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "status" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_privileged_access_grant" PRIMARY KEY ("privileged_access_id")
);

CREATE TABLE IF NOT EXISTS m00."workload_identity" (
  "workload_identity_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "owner" text NOT NULL,
  "purpose" text NOT NULL,
  "environment" text NOT NULL,
  "status" text NOT NULL,
  "credential_reference_id" uuid NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_workload_identity" PRIMARY KEY ("workload_identity_id")
);

CREATE TABLE IF NOT EXISTS m00."commercial_activation" (
  "commercial_activation_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "agreement_reference" text NOT NULL,
  "status" text NOT NULL,
  "effective_from" date NOT NULL,
  "effective_to" date,
  "approved_by" uuid NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_commercial_activation" PRIMARY KEY ("commercial_activation_id")
);

CREATE TABLE IF NOT EXISTS m00."entitlement_grant" (
  "entitlement_grant_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "entitlement_type" text NOT NULL,
  "entitlement_code" text NOT NULL,
  "status" text NOT NULL,
  "effective_from" date NOT NULL,
  "effective_to" date,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_entitlement_grant" PRIMARY KEY ("entitlement_grant_id")
);

CREATE TABLE IF NOT EXISTS m00."seat_allocation" (
  "seat_allocation_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "allocated_count" integer NOT NULL,
  "active_count" integer NOT NULL,
  "effective_from" date NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_seat_allocation" PRIMARY KEY ("seat_allocation_id")
);

CREATE TABLE IF NOT EXISTS m00."feature_control" (
  "feature_control_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "feature_code" text NOT NULL,
  "environment" text NOT NULL,
  "target_type" text NOT NULL,
  "target_reference" text NOT NULL,
  "enabled" boolean NOT NULL,
  "effective_from" timestamptz NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_feature_control" PRIMARY KEY ("feature_control_id")
);

CREATE TABLE IF NOT EXISTS m00."emergency_disable" (
  "emergency_disable_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "feature_code" text NOT NULL,
  "scope_type" text NOT NULL,
  "scope_reference" text NOT NULL,
  "reason_code" text NOT NULL,
  "enabled_at" timestamptz NOT NULL,
  "disabled_by" uuid NOT NULL,
  "released_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_emergency_disable" PRIMARY KEY ("emergency_disable_id")
);

CREATE TABLE IF NOT EXISTS m00."platform_configuration" (
  "configuration_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "key" text NOT NULL,
  "scope_type" text NOT NULL,
  "scope_reference" text NOT NULL,
  "value_reference" text NOT NULL,
  "effective_from" timestamptz NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_platform_configuration" PRIMARY KEY ("configuration_id")
);

CREATE TABLE IF NOT EXISTS m00."workspace_preference" (
  "workspace_preference_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "locale" text NOT NULL,
  "landing_page_id" text,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_by" uuid,
  CONSTRAINT "pk_workspace_preference" PRIMARY KEY ("workspace_preference_id")
);

CREATE TABLE IF NOT EXISTS m00."reference_geography" (
  "geography_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "country_code" text NOT NULL,
  "subdivision_code" text,
  "name_en" text NOT NULL,
  "name_es" text NOT NULL,
  "status" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_reference_geography" PRIMARY KEY ("geography_id")
);

CREATE TABLE IF NOT EXISTS m00."consent_definition" (
  "consent_definition_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "consent_code" text NOT NULL,
  "purpose" text NOT NULL,
  "requiredness" text NOT NULL,
  "language" text NOT NULL,
  "content_version" text NOT NULL,
  "effective_from" timestamptz NOT NULL,
  "status" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_consent_definition" PRIMARY KEY ("consent_definition_id")
);

CREATE TABLE IF NOT EXISTS m00."consent_evidence" (
  "consent_evidence_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "consent_definition_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "actor_type" text NOT NULL,
  "tenant_id" uuid NOT NULL,
  "marketplace_id" uuid NOT NULL,
  "language" text NOT NULL,
  "collection_method" text NOT NULL,
  "related_record_id" uuid,
  "accepted_at" timestamptz NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_consent_evidence" PRIMARY KEY ("consent_evidence_id")
);

CREATE TABLE IF NOT EXISTS m00."consent_withdrawal" (
  "consent_withdrawal_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "consent_evidence_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "scope" text NOT NULL,
  "effective_at" timestamptz NOT NULL,
  "channel" text NOT NULL,
  "reason" text,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_consent_withdrawal" PRIMARY KEY ("consent_withdrawal_id")
);

CREATE TABLE IF NOT EXISTS m00."representation_authorization" (
  "representation_authorization_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "represented_user_or_person_id" uuid NOT NULL,
  "representative_user_id" uuid NOT NULL,
  "authorization_type" text NOT NULL,
  "scope_codes" text[] DEFAULT '{}' NOT NULL,
  "language" text NOT NULL,
  "content_version" text NOT NULL,
  "status" text NOT NULL,
  "effective_from" timestamptz NOT NULL,
  "revoked_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_representation_authorization" PRIMARY KEY ("representation_authorization_id")
);

CREATE TABLE IF NOT EXISTS m00."privacy_request" (
  "privacy_request_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "requester_user_id" uuid NOT NULL,
  "request_type" text NOT NULL,
  "status" text NOT NULL,
  "submitted_at" timestamptz NOT NULL,
  "assigned_team_id" uuid,
  "completed_at" timestamptz,
  "decision_reason" text,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_privacy_request" PRIMARY KEY ("privacy_request_id")
);

CREATE TABLE IF NOT EXISTS m00."legal_hold" (
  "legal_hold_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "target_type" text NOT NULL,
  "target_reference" uuid NOT NULL,
  "reason" text NOT NULL,
  "owner_user_id" uuid NOT NULL,
  "status" text NOT NULL,
  "starts_at" timestamptz NOT NULL,
  "review_at" timestamptz,
  "released_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_legal_hold" PRIMARY KEY ("legal_hold_id")
);

CREATE TABLE IF NOT EXISTS m00."audit_event" (
  "audit_event_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "event_code" text NOT NULL,
  "actor_user_id" uuid,
  "workload_identity_id" uuid,
  "tenant_id" uuid,
  "organization_id" uuid,
  "marketplace_id" uuid,
  "correlation_id" uuid NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "payload_hash" text NOT NULL,
  "metadata" jsonb NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_audit_event" PRIMARY KEY ("audit_event_id")
);

CREATE TABLE IF NOT EXISTS m00."task" (
  "task_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "task_type" text NOT NULL,
  "related_record_type" text NOT NULL,
  "related_record_id" uuid NOT NULL,
  "tenant_id" uuid NOT NULL,
  "assignee_type" text NOT NULL,
  "assignee_reference" uuid,
  "status" text NOT NULL,
  "priority" text NOT NULL,
  "due_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_task" PRIMARY KEY ("task_id")
);

CREATE TABLE IF NOT EXISTS m00."operational_team" (
  "operational_team_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid,
  "organization_id" uuid,
  "team_type" text NOT NULL,
  "status" text NOT NULL,
  "member_user_ids" uuid[] DEFAULT '{}' NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_operational_team" PRIMARY KEY ("operational_team_id")
);

CREATE TABLE IF NOT EXISTS m00."exception" (
  "exception_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "exception_type" text NOT NULL,
  "severity" text NOT NULL,
  "related_record_type" text NOT NULL,
  "related_record_id" uuid NOT NULL,
  "responsible_module_id" text NOT NULL,
  "owner_reference" uuid,
  "status" text NOT NULL,
  "diagnostic_reference" text,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_exception" PRIMARY KEY ("exception_id")
);

CREATE TABLE IF NOT EXISTS m00."connector_definition" (
  "connector_definition_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "connector_code" text NOT NULL,
  "provider_name" text NOT NULL,
  "supported_environments" text[] DEFAULT '{}' NOT NULL,
  "schema_version" text NOT NULL,
  "status" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_connector_definition" PRIMARY KEY ("connector_definition_id")
);

CREATE TABLE IF NOT EXISTS m00."connector_instance" (
  "connector_instance_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "connector_definition_id" uuid NOT NULL,
  "environment" text NOT NULL,
  "lifecycle_status" text NOT NULL,
  "health_status" text NOT NULL,
  "credential_reference_id" uuid,
  "endpoint_reference" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_connector_instance" PRIMARY KEY ("connector_instance_id")
);

CREATE TABLE IF NOT EXISTS m00."provider_route" (
  "provider_route_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "service_type" text NOT NULL,
  "commercial_model" text NOT NULL,
  "connector_instance_id" uuid,
  "status" text NOT NULL,
  "effective_from" timestamptz NOT NULL,
  "effective_to" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_provider_route" PRIMARY KEY ("provider_route_id")
);

CREATE TABLE IF NOT EXISTS m00."credential_reference" (
  "credential_reference_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "secret_path_reference" text NOT NULL,
  "secret_version_reference" text NOT NULL,
  "environment" text NOT NULL,
  "owner" text NOT NULL,
  "status" text NOT NULL,
  "rotated_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_credential_reference" PRIMARY KEY ("credential_reference_id")
);

CREATE TABLE IF NOT EXISTS m00."integration_job" (
  "integration_job_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "job_type" text NOT NULL,
  "connector_instance_id" uuid,
  "tenant_id" uuid,
  "status" text NOT NULL,
  "idempotency_key" text,
  "request_version" text NOT NULL,
  "started_at" timestamptz,
  "completed_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_integration_job" PRIMARY KEY ("integration_job_id")
);

CREATE TABLE IF NOT EXISTS m00."webhook_receipt" (
  "webhook_receipt_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "connector_instance_id" uuid NOT NULL,
  "provider_event_id" text NOT NULL,
  "received_at" timestamptz NOT NULL,
  "signature_result" text NOT NULL,
  "processing_status" text NOT NULL,
  "related_job_id" uuid,
  "payload_hash" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_webhook_receipt" PRIMARY KEY ("webhook_receipt_id")
);

CREATE TABLE IF NOT EXISTS m00."reconciliation_run" (
  "reconciliation_run_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "connector_instance_id" uuid NOT NULL,
  "scope_type" text NOT NULL,
  "scope_reference" text,
  "status" text NOT NULL,
  "started_at" timestamptz NOT NULL,
  "completed_at" timestamptz,
  "difference_count" integer NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_reconciliation_run" PRIMARY KEY ("reconciliation_run_id")
);

CREATE TABLE IF NOT EXISTS m00."import_job" (
  "import_job_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "import_type" text NOT NULL,
  "file_document_id" uuid NOT NULL,
  "status" text NOT NULL,
  "row_count" integer NOT NULL,
  "error_count" integer NOT NULL,
  "committed_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_import_job" PRIMARY KEY ("import_job_id")
);

CREATE TABLE IF NOT EXISTS m00."export_job" (
  "export_job_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid,
  "export_type" text NOT NULL,
  "purpose" text NOT NULL,
  "status" text NOT NULL,
  "requested_by" uuid NOT NULL,
  "expires_at" timestamptz,
  "file_document_id" uuid,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_export_job" PRIMARY KEY ("export_job_id")
);

CREATE TABLE IF NOT EXISTS m00."usage_record" (
  "usage_record_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "marketplace_id" uuid,
  "service_type" text NOT NULL,
  "transaction_type" text NOT NULL,
  "quantity" numeric(18,6) NOT NULL,
  "outcome" text NOT NULL,
  "business_reference" text NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_usage_record" PRIMARY KEY ("usage_record_id")
);

CREATE TABLE IF NOT EXISTS m00."launch_gate" (
  "launch_gate_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "gate_code" text NOT NULL,
  "scope_type" text NOT NULL,
  "scope_reference" text NOT NULL,
  "status" text NOT NULL,
  "owner_role" text NOT NULL,
  "required" boolean NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_launch_gate" PRIMARY KEY ("launch_gate_id")
);

CREATE TABLE IF NOT EXISTS m00."launch_gate_evidence" (
  "launch_gate_evidence_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "launch_gate_id" uuid NOT NULL,
  "evidence_type" text NOT NULL,
  "artifact_reference" text NOT NULL,
  "result" text NOT NULL,
  "approved_by" uuid,
  "approved_at" timestamptz,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_launch_gate_evidence" PRIMARY KEY ("launch_gate_evidence_id")
);

CREATE TABLE IF NOT EXISTS m00."release_record" (
  "release_record_id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "version" text DEFAULT 1 NOT NULL,
  "environment" text NOT NULL,
  "status" text NOT NULL,
  "artifact_digest" text NOT NULL,
  "release_owner" uuid NOT NULL,
  "go_no_go" text,
  "deployed_at" timestamptz,
  "activated_at" timestamptz,
  "created_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "created_by" uuid,
  "updated_at" timestamptz DEFAULT clock_timestamp() NOT NULL,
  "updated_by" uuid,
  CONSTRAINT "pk_release_record" PRIMARY KEY ("release_record_id")
);

CREATE TABLE IF NOT EXISTS m00."role_permission_grant" (
  "role_template_id" uuid NOT NULL,
  "permission_id" uuid NOT NULL,
  "access" text NOT NULL,
  "condition_text" text,
  "created_at" timestamptz NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT "pk_role_permission_grant" PRIMARY KEY ("role_template_id","permission_id")
);

CREATE TABLE IF NOT EXISTS m00."idempotency_record" (
  "idempotency_record_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" uuid,
  "actor_user_id" uuid,
  "workload_identity_id" uuid,
  "operation_id" text NOT NULL,
  "idempotency_key_hash" text NOT NULL,
  "request_hash" text NOT NULL,
  "response_status" integer,
  "response_body" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT clock_timestamp(),
  "expires_at" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS m00."outbox_event" (
  "event_id" uuid PRIMARY KEY,
  "event_name" text NOT NULL,
  "aggregate_type" text NOT NULL,
  "aggregate_id" text NOT NULL,
  "tenant_id" uuid,
  "correlation_id" uuid NOT NULL,
  "payload" jsonb NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "published_at" timestamptz,
  "attempt_count" integer NOT NULL DEFAULT 0,
  "next_attempt_at" timestamptz,
  "last_error_code" text
);