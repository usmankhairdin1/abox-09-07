REVOKE INSERT, UPDATE ON ALL TABLES IN SCHEMA m00 FROM sandbox_exec;
REVOKE SELECT ON ALL TABLES IN SCHEMA m00 FROM sandbox_exec;
REVOKE USAGE ON SCHEMA m00 FROM sandbox_exec;

-- ABox Lucie M00 Platform Foundation - PostgreSQL migration V007 v1.1
-- Read models and protected-M01 compatibility views. These views add M00 context without rewriting M01 history.
CREATE OR REPLACE VIEW m00.m01_active_identity_context_v1 AS
SELECT ui.user_id, ui.account_status, ui.primary_locale, tm.tenant_id, tm.organization_id,
       ra.role_assignment_id, rt.code AS role_code, tm.status AS membership_status
FROM m00.user_identity ui
LEFT JOIN m00.tenant_membership tm ON tm.user_id=ui.user_id AND tm.status='ACTIVE'
LEFT JOIN m00.role_assignment ra ON ra.user_id=ui.user_id AND (ra.effective_to IS NULL OR ra.effective_to>clock_timestamp())
LEFT JOIN m00.role_template rt ON rt.role_template_id=ra.role_template_id;

CREATE OR REPLACE VIEW m00.m01_provider_route_v1 AS
SELECT provider_route_id, tenant_id, service_type, commercial_model, connector_instance_id, status, effective_from, effective_to, version
FROM m00.provider_route;

CREATE OR REPLACE VIEW m00.m01_consent_evidence_v1 AS
SELECT ce.consent_evidence_id, ce.user_id, ce.tenant_id, ce.marketplace_id, cd.consent_code,
       ce.language, cd.content_version, ce.collection_method, ce.related_record_id, ce.accepted_at
FROM m00.consent_evidence ce JOIN m00.consent_definition cd ON cd.consent_definition_id=ce.consent_definition_id;

COMMENT ON VIEW m00.m01_active_identity_context_v1 IS 'Compatibility read model only. Approval of PDM records remains mandatory before M01 behavior changes.';