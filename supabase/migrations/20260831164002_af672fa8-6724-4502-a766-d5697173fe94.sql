-- V004__readiness_imports_and_operations.sql
BEGIN;

CREATE TABLE lucie_m05.organization_readiness (
  readiness_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  status text NOT NULL CHECK (status IN ('NOT_EVALUATED','BLOCKED','READY_WITH_WARNINGS','READY')),
  blocking_count integer NOT NULL DEFAULT 0 CHECK (blocking_count >= 0),
  warning_count integer NOT NULL DEFAULT 0 CHECK (warning_count >= 0),
  evaluated_at timestamptz NOT NULL,
  policy_version text NOT NULL,
  UNIQUE (organization_id)
);

CREATE TABLE lucie_m05.organization_readiness_item (
  readiness_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  readiness_id uuid NOT NULL REFERENCES lucie_m05.organization_readiness(readiness_id) ON DELETE CASCADE,
  control_code text NOT NULL,
  result text NOT NULL CHECK (result IN ('PASS','WARNING','FAIL','NOT_APPLICABLE')),
  owner_module text NOT NULL,
  next_action text,
  evidence_reference text,
  UNIQUE (readiness_id, control_code)
);

CREATE TABLE lucie_m05.organization_import_job (
  import_job_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  root_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  file_reference text NOT NULL,
  template_version text NOT NULL DEFAULT 'M05-CSV-1.0',
  status text NOT NULL CHECK (status IN ('UPLOADED','VALIDATING','VALIDATION_FAILED','READY_TO_COMMIT','COMMITTING','COMPLETED','FAILED','CANCELED')),
  validation_version integer NOT NULL DEFAULT 0 CHECK (validation_version >= 0),
  row_count integer NOT NULL DEFAULT 0 CHECK (row_count >= 0),
  blocking_error_count integer NOT NULL DEFAULT 0 CHECK (blocking_error_count >= 0),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  committed_at timestamptz
);

CREATE TABLE lucie_m05.organization_import_row_result (
  row_result_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  import_job_id uuid NOT NULL REFERENCES lucie_m05.organization_import_job(import_job_id) ON DELETE CASCADE,
  row_number integer NOT NULL CHECK (row_number >= 1),
  reference_code text,
  status text NOT NULL CHECK (status IN ('VALID','WARNING','BLOCKING_ERROR','COMMITTED','NOT_COMMITTED')),
  errors_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  warnings_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  UNIQUE (import_job_id, row_number)
);

CREATE TABLE lucie_m05.organization_duplicate_candidate (
  candidate_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  proposed_organization_id uuid REFERENCES lucie_m05.organization(organization_id),
  matched_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  match_reasons jsonb NOT NULL,
  confidence_band text NOT NULL CHECK (confidence_band IN ('LOW','MEDIUM','HIGH')),
  status text NOT NULL CHECK (status IN ('OPEN','CONFIRMED_DISTINCT','LINKED_EXISTING','CANCELED_PROPOSED','ESCALATED')),
  resolved_by uuid,
  resolved_at timestamptz,
  resolution_explanation text
);

CREATE TABLE lucie_m05.organization_exception (
  exception_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  exception_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('NORMAL','HIGH','URGENT')),
  owner text NOT NULL,
  status text NOT NULL,
  task_id uuid,
  diagnostic_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE lucie_m05.organization_task_reference (
  task_reference_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  task_id uuid NOT NULL,
  purpose text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, task_id, purpose)
);

CREATE TABLE lucie_m05.reference_organization_request (
  request_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  requesting_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  proposed_name text NOT NULL,
  organization_type text NOT NULL CHECK (organization_type IN ('CARRIER','VENDOR')),
  external_identifiers jsonb NOT NULL DEFAULT '[]'::jsonb,
  business_reason text NOT NULL,
  status text NOT NULL CHECK (status IN ('SUBMITTED','IN_REVIEW','LINKED_EXISTING','CREATED_NEW','REJECTED','CANCELED')),
  resolved_organization_id uuid REFERENCES lucie_m05.organization(organization_id),
  resolved_by uuid,
  resolved_at timestamptz
);

CREATE TABLE lucie_m05.tenant_ownership_change (
  ownership_change_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  current_owner_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  proposed_owner_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  effective_date timestamptz NOT NULL,
  reason text NOT NULL,
  impact_review_json jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('DRAFT','IMPACT_REVIEW','APPROVED','SCHEDULED','EXECUTING','COMPLETED','FAILED','CANCELED')),
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uq_m05_active_ownership_change
ON lucie_m05.tenant_ownership_change (tenant_id)
WHERE status IN ('APPROVED','SCHEDULED','EXECUTING');

CREATE TABLE lucie_m05.organization_ending_plan (
  ending_plan_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  effective_date timestamptz NOT NULL,
  reason text NOT NULL,
  checklist_json jsonb NOT NULL,
  open_blocker_count integer NOT NULL DEFAULT 0 CHECK (open_blocker_count >= 0),
  status text NOT NULL CHECK (status IN ('DRAFT','IN_REVIEW','BLOCKED','READY','EXECUTING','COMPLETED','CANCELED')),
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE UNIQUE INDEX uq_m05_current_ending_plan
ON lucie_m05.organization_ending_plan (organization_id)
WHERE status IN ('DRAFT','IN_REVIEW','BLOCKED','READY','EXECUTING');

CREATE TABLE lucie_m05.organization_export_job (
  export_job_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  requester_user_id uuid NOT NULL,
  organization_ids uuid[] NOT NULL,
  purpose text NOT NULL,
  field_set text[] NOT NULL,
  masking_policy text NOT NULL,
  status text NOT NULL CHECK (status IN ('QUEUED','RUNNING','COMPLETED','FAILED','EXPIRED','CANCELED')),
  file_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  CHECK (cardinality(organization_ids) >= 1)
);

CREATE TABLE lucie_m05.master_default_application (
  application_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  root_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  target_organization_ids uuid[] NOT NULL,
  setting_keys text[] NOT NULL,
  preview_json jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('PREVIEWED','CONFIRMED','EXECUTING','COMPLETED','FAILED','CANCELED')),
  confirmed_by uuid,
  executed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (cardinality(target_organization_ids) >= 1),
  CHECK (cardinality(setting_keys) >= 1)
);

COMMIT;