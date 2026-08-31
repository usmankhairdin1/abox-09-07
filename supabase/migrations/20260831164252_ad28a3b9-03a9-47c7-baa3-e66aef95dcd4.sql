-- V007__indexes_seeds_and_verification.sql
BEGIN;

CREATE INDEX idx_m05_organization_tenant_status
ON lucie_m05.organization (tenant_id, lifecycle_status, organization_type, display_name);

CREATE INDEX idx_m05_relationship_parent_status
ON lucie_m05.organization_relationship (tenant_id, parent_organization_id, status, effective_from);

CREATE INDEX idx_m05_relationship_child_status
ON lucie_m05.organization_relationship (tenant_id, child_organization_id, status, effective_from);

CREATE INDEX idx_m05_contact_org_role
ON lucie_m05.organization_contact (tenant_id, organization_id, contact_role, effective_to);

CREATE INDEX idx_m05_address_org_type
ON lucie_m05.organization_address (tenant_id, organization_id, location_type, effective_to);

CREATE INDEX idx_m05_identifier_org_type
ON lucie_m05.organization_external_identifier (tenant_id, organization_id, identifier_type, verification_status);

CREATE INDEX idx_m05_readiness_status
ON lucie_m05.organization_readiness (tenant_id, status, evaluated_at DESC);

CREATE INDEX idx_m05_import_tenant_status
ON lucie_m05.organization_import_job (tenant_id, status, created_at DESC);

CREATE INDEX idx_m05_exception_tenant_status
ON lucie_m05.organization_exception (tenant_id, status, severity, created_at DESC);

CREATE INDEX idx_m05_history_org_time
ON lucie_m05.organization_history_entry (tenant_id, organization_id, occurred_at DESC);

CREATE INDEX idx_m05_attribution_org
ON lucie_m05.organization_attribution (tenant_id, responsible_organization_id, effective_to);

CREATE INDEX idx_m05_propagation_status
ON lucie_m05.downstream_propagation_status (tenant_id, status, next_retry_at);

CREATE OR REPLACE VIEW lucie_m05.active_organization_structure AS
SELECT
  t.tenant_id,
  t.owning_organization_id AS root_organization_id,
  r.relationship_id,
  r.child_organization_id,
  r.version AS relationship_version
FROM lucie_m05.tenant t
LEFT JOIN lucie_m05.organization_relationship r
  ON r.tenant_id = t.tenant_id
 AND r.parent_organization_id = t.owning_organization_id
 AND r.status = 'ACTIVE'
WHERE t.lifecycle_status = 'ACTIVE';

COMMENT ON VIEW lucie_m05.active_organization_structure IS
'Read model only. M00 still enforces authorization using versioned M05 scope evidence.';

INSERT INTO lucie_m05.schema_version_evidence (
  schema_version, applied_by, artifact_sha256, evidence
) VALUES (
  'M05-1.0-V007',
  current_user,
  repeat('0', 64),
  jsonb_build_object(
    'module', 'M05',
    'status', 'PRODUCTION_BUILD_READY',
    'controlled_date', '2026-08-18',
    'verification_required', true
  )
)
ON CONFLICT (schema_version) DO NOTHING;

COMMIT;