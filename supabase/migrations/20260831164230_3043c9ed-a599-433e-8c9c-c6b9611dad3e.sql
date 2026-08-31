-- V006__row_level_security.sql
BEGIN;
ALTER TABLE lucie_m05.idempotency_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.idempotency_record FORCE ROW LEVEL SECURITY;
CREATE POLICY p_idempotency_record_tenant ON lucie_m05.idempotency_record
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.event_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.event_outbox FORCE ROW LEVEL SECURITY;
CREATE POLICY p_event_outbox_tenant ON lucie_m05.event_outbox
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_tenant ON lucie_m05.organization
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_relationship ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_relationship FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_relationship_tenant ON lucie_m05.organization_relationship
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_contact FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_contact_tenant ON lucie_m05.organization_contact
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_address ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_address FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_address_tenant ON lucie_m05.organization_address
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.office_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.office_location FORCE ROW LEVEL SECURITY;
CREATE POLICY p_office_location_tenant ON lucie_m05.office_location
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_external_identifier ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_external_identifier FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_external_identifier_tenant ON lucie_m05.organization_external_identifier
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_setting ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_setting FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_setting_tenant ON lucie_m05.organization_setting
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.business_hours FORCE ROW LEVEL SECURITY;
CREATE POLICY p_business_hours_tenant ON lucie_m05.business_hours
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_note ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_note FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_note_tenant ON lucie_m05.organization_note
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_document_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_document_reference FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_document_reference_tenant ON lucie_m05.organization_document_reference
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_readiness FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_readiness_tenant ON lucie_m05.organization_readiness
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_readiness_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_readiness_item FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_readiness_item_tenant ON lucie_m05.organization_readiness_item
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_import_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_import_job FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_import_job_tenant ON lucie_m05.organization_import_job
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_import_row_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_import_row_result FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_import_row_result_tenant ON lucie_m05.organization_import_row_result
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_duplicate_candidate ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_duplicate_candidate FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_duplicate_candidate_tenant ON lucie_m05.organization_duplicate_candidate
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_exception ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_exception FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_exception_tenant ON lucie_m05.organization_exception
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_task_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_task_reference FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_task_reference_tenant ON lucie_m05.organization_task_reference
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.reference_organization_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.reference_organization_request FORCE ROW LEVEL SECURITY;
CREATE POLICY p_reference_organization_request_tenant ON lucie_m05.reference_organization_request
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.tenant_ownership_change ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.tenant_ownership_change FORCE ROW LEVEL SECURITY;
CREATE POLICY p_tenant_ownership_change_tenant ON lucie_m05.tenant_ownership_change
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_ending_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_ending_plan FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_ending_plan_tenant ON lucie_m05.organization_ending_plan
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_export_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_export_job FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_export_job_tenant ON lucie_m05.organization_export_job
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.master_default_application ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.master_default_application FORCE ROW LEVEL SECURITY;
CREATE POLICY p_master_default_application_tenant ON lucie_m05.master_default_application
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_history_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_history_entry FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_history_entry_tenant ON lucie_m05.organization_history_entry
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.effective_administrative_scope ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.effective_administrative_scope FORCE ROW LEVEL SECURITY;
CREATE POLICY p_effective_administrative_scope_tenant ON lucie_m05.effective_administrative_scope
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_context_selection ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_context_selection FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_context_selection_tenant ON lucie_m05.organization_context_selection
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_attribution FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_attribution_tenant ON lucie_m05.organization_attribution
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_status_decision ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_status_decision FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_status_decision_tenant ON lucie_m05.organization_status_decision
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.organization_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.organization_summary FORCE ROW LEVEL SECURITY;
CREATE POLICY p_organization_summary_tenant ON lucie_m05.organization_summary
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.relationship_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.relationship_summary FORCE ROW LEVEL SECURITY;
CREATE POLICY p_relationship_summary_tenant ON lucie_m05.relationship_summary
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.downstream_propagation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.downstream_propagation_status FORCE ROW LEVEL SECURITY;
CREATE POLICY p_downstream_propagation_status_tenant ON lucie_m05.downstream_propagation_status
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
ALTER TABLE lucie_m05.tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m05.tenant FORCE ROW LEVEL SECURITY;
CREATE POLICY p_tenant_tenant ON lucie_m05.tenant
  USING (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id())
  WITH CHECK (lucie_m05.is_jet_admin() OR tenant_id = lucie_m05.current_tenant_id());
COMMIT;