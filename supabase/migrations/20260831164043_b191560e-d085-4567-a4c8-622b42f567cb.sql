-- V005__history_scope_attribution_and_propagation.sql
BEGIN;

CREATE TABLE lucie_m05.organization_history_entry (
  history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid REFERENCES lucie_m05.organization(organization_id),
  relationship_id uuid REFERENCES lucie_m05.organization_relationship(relationship_id),
  actor_user_id uuid,
  actor_workload_id text,
  acting_organization_id uuid,
  selected_context_id uuid,
  action text NOT NULL,
  before_json jsonb,
  after_json jsonb,
  reason_code text,
  explanation text,
  correlation_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE lucie_m05.effective_administrative_scope (
  scope_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  user_id uuid NOT NULL,
  root_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  effective_organization_ids uuid[] NOT NULL,
  relationship_versions jsonb NOT NULL,
  policy_version text NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX idx_m05_scope_user_tenant
ON lucie_m05.effective_administrative_scope (user_id, tenant_id, expires_at DESC);

CREATE TABLE lucie_m05.organization_context_selection (
  context_selection_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  session_id uuid NOT NULL,
  user_id uuid NOT NULL,
  root_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  selected_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  relationship_id uuid REFERENCES lucie_m05.organization_relationship(relationship_id),
  relationship_version integer,
  policy_version text NOT NULL,
  selected_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);

CREATE UNIQUE INDEX uq_m05_current_context
ON lucie_m05.organization_context_selection (session_id)
WHERE ended_at IS NULL;

CREATE TABLE lucie_m05.organization_attribution (
  attribution_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  record_type text NOT NULL,
  record_id uuid NOT NULL,
  originating_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  responsible_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  assigned_user_id uuid,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  changed_by uuid NOT NULL,
  reason_code text,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE UNIQUE INDEX uq_m05_current_attribution
ON lucie_m05.organization_attribution (record_type, record_id)
WHERE effective_to IS NULL;

CREATE TABLE lucie_m05.organization_status_decision (
  decision_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  user_id uuid,
  allowed boolean NOT NULL,
  reason_code text NOT NULL,
  evaluated_at timestamptz NOT NULL DEFAULT now(),
  policy_version text NOT NULL,
  organization_version integer NOT NULL,
  relationship_version integer
);

CREATE TABLE lucie_m05.organization_summary (
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  organization_type text NOT NULL,
  legal_name text NOT NULL,
  display_name text NOT NULL,
  lifecycle_status text NOT NULL,
  parent_organization_id uuid,
  contact_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  location_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  default_language text NOT NULL,
  identifier_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  readiness_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  version integer NOT NULL,
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  PRIMARY KEY (organization_id, version)
);

CREATE TABLE lucie_m05.relationship_summary (
  relationship_id uuid NOT NULL REFERENCES lucie_m05.organization_relationship(relationship_id),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  parent_organization_id uuid NOT NULL,
  child_organization_id uuid NOT NULL,
  status text NOT NULL,
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  version integer NOT NULL,
  PRIMARY KEY (relationship_id, version)
);

CREATE TABLE lucie_m05.downstream_propagation_status (
  propagation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  event_id uuid NOT NULL,
  consumer text NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING','PROCESSING','DELIVERED','FAILED_RETRYABLE','FAILED_FINAL','RECONCILED')),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_error_code text,
  next_retry_at timestamptz,
  reconciled_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, consumer)
);

CREATE OR REPLACE FUNCTION lucie_m05.prevent_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'M05_IMMUTABLE_EVIDENCE';
END
$$;

CREATE TRIGGER trg_immutable_history_update
BEFORE UPDATE OR DELETE ON lucie_m05.organization_history_entry
FOR EACH ROW EXECUTE FUNCTION lucie_m05.prevent_mutation();

CREATE TRIGGER trg_immutable_note_update
BEFORE UPDATE OR DELETE ON lucie_m05.organization_note
FOR EACH ROW EXECUTE FUNCTION lucie_m05.prevent_mutation();

COMMIT;