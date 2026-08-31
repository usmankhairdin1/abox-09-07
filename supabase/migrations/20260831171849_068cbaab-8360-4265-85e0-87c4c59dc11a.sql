CREATE SCHEMA IF NOT EXISTS lucie_m06;

CREATE TABLE IF NOT EXISTS lucie_m06.enumeration_value (
  enumeration_name text NOT NULL,
  value            text NOT NULL,
  enumeration_id   text NOT NULL,
  sort_order       int  NOT NULL DEFAULT 0,
  PRIMARY KEY (enumeration_name, value)
);

INSERT INTO lucie_m06.enumeration_value (enumeration_id, enumeration_name, value, sort_order)
SELECT e.id, e.name, v.value, v.ord
FROM (VALUES
 ('ENUM-M06-001','WorkforceProfileStatus','DRAFT;ACTIVE;SUSPENDED;INACTIVE'),
 ('ENUM-M06-002','AffiliationStatus','PLANNED;ACTIVE;ENDED;CANCELED'),
 ('ENUM-M06-003','CaptivityClassification','CAPTIVE;INDEPENDENT;UNSPECIFIED'),
 ('ENUM-M06-004','ReadinessState','READY;READY_WITH_LIMITATIONS;NOT_READY;REVIEW_REQUIRED;NOT_APPLICABLE'),
 ('ENUM-M06-005','OperationalEligibility','OPERATIONALLY_ELIGIBLE;OPERATIONALLY_INELIGIBLE;REVIEW_REQUIRED'),
 ('ENUM-M06-006','Availability','AVAILABLE;NOT_ACCEPTING_NEW_WORK;TEMPORARILY_UNAVAILABLE'),
 ('ENUM-M06-007','NoteAudience','ME_ONLY;AGENCY_VISIBLE;JET_ONLY;CUSTOMER_VISIBLE'),
 ('ENUM-M06-008','RoleStatus','DRAFT;ACTIVE;RETIRED'),
 ('ENUM-M06-009','ExceptionStatus','OPEN;IN_REVIEW;RESOLVED;WAIVED;CANCELED'),
 ('ENUM-M06-010','ProcessingStatus','PENDING;PROCESSING;COMPLETED;FAILED'),
 ('ENUM-M06-011','PersonCategory','AGENT;UNLICENSED_STAFF;OTHER_WORKFORCE'),
 ('ENUM-M06-012','InvitationDisposition','NOT_REQUESTED;PENDING;ACCEPTED;EXPIRED;REVOKED'),
 ('ENUM-M06-013','IdentityMatchOutcome','NO_MATCH;POSSIBLE_MATCH;VERIFIED_MATCH;REVIEW_REQUIRED'),
 ('ENUM-M06-014','DocumentState','UNAVAILABLE;AVAILABLE;PROCESSING;FAILED'),
 ('ENUM-M06-015','NotificationChannel','IN_PRODUCT;EMAIL;SMS'),
 ('ENUM-M06-016','NotificationUrgency','ROUTINE;IMPORTANT;TIME_SENSITIVE;CRITICAL'),
 ('ENUM-M06-017','GroupType','BUSINESS_UNIT;TEAM'),
 ('ENUM-M06-018','ScopeType','ORGANIZATION;BUSINESS_UNIT;TEAM;SELF;ASSIGNED_RECORD;OWNED_RECORD'),
 ('ENUM-M06-019','AssignmentSource','DIRECT;BUSINESS_UNIT;TEAM;SYSTEM'),
 ('ENUM-M06-020','Provenance','API_VALIDATED;MANUALLY_VERIFIED;DOCUMENT_SUPPORTED;SELF_REPORTED'),
 ('ENUM-M06-021','TransferStatus','DRAFT;BLOCKED;READY;PROCESSING;COMPLETED;FAILED;CANCELED'),
 ('ENUM-M06-022','OffboardingStatus','DRAFT;SCHEDULED;BLOCKED;PROCESSING;COMPLETED;FAILED;CANCELED'),
 ('ENUM-M06-023','ImportStatus','UPLOADED;VALIDATING;VALID;INVALID;COMMITTING;COMPLETED;FAILED'),
 ('ENUM-M06-024','ExportStatus','REQUESTED;PROCESSING;READY;EXPIRED;FAILED'),
 ('ENUM-M06-025','ReconciliationStatus','REQUESTED;PROCESSING;COMPLETED_WITHOUT_DRIFT;COMPLETED_WITH_DRIFT;FAILED'),
 ('ENUM-M06-026','SupportMode','INACTIVE;ACTIVE;EXPIRED'),
 ('ENUM-M06-027','RiskLevel','STANDARD;HIGH;CRITICAL;JET_ONLY'),
 ('ENUM-M06-028','LifecycleAction','ACTIVATE;SUSPEND;REACTIVATE;OFFBOARD;TRANSFER;REHIRE'),
 ('ENUM-M06-029','ServiceScopeStatus','ACTIVE;INACTIVE'),
 ('ENUM-M06-030','FeatureState','DISABLED;PILOT;ENABLED;EMERGENCY_DISABLED')
) AS e(id, name, csv)
CROSS JOIN LATERAL unnest(string_to_array(e.csv, ';')) WITH ORDINALITY AS v(value, ord)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS lucie_m06.state_model (
  state_model_id text PRIMARY KEY,
  entity         text NOT NULL,
  states         text[] NOT NULL,
  transition_rule text NOT NULL,
  status         text NOT NULL DEFAULT 'APPROVED'
);

INSERT INTO lucie_m06.state_model (state_model_id, entity, states, transition_rule)
SELECT s.id, s.entity, string_to_array(s.csv, ';'),
       'Only explicit authorized transitions; immutable history; effective dating where applicable.'
FROM (VALUES
 ('SM-M06-001','WorkforceProfileStatus','DRAFT;ACTIVE;SUSPENDED;INACTIVE'),
 ('SM-M06-002','AffiliationStatus','PLANNED;ACTIVE;ENDED;CANCELED'),
 ('SM-M06-003','CaptivityClassification','CAPTIVE;INDEPENDENT;UNSPECIFIED'),
 ('SM-M06-004','ReadinessState','READY;READY_WITH_LIMITATIONS;NOT_READY;REVIEW_REQUIRED;NOT_APPLICABLE'),
 ('SM-M06-005','OperationalEligibility','OPERATIONALLY_ELIGIBLE;OPERATIONALLY_INELIGIBLE;REVIEW_REQUIRED'),
 ('SM-M06-006','Availability','AVAILABLE;NOT_ACCEPTING_NEW_WORK;TEMPORARILY_UNAVAILABLE'),
 ('SM-M06-007','NoteAudience','ME_ONLY;AGENCY_VISIBLE;JET_ONLY;CUSTOMER_VISIBLE'),
 ('SM-M06-008','RoleStatus','DRAFT;ACTIVE;RETIRED'),
 ('SM-M06-009','ExceptionStatus','OPEN;IN_REVIEW;RESOLVED;WAIVED;CANCELED'),
 ('SM-M06-010','ProcessingStatus','PENDING;PROCESSING;COMPLETED;FAILED'),
 ('SM-M06-011','PersonCategory','AGENT;UNLICENSED_STAFF;OTHER_WORKFORCE'),
 ('SM-M06-012','InvitationDisposition','NOT_REQUESTED;PENDING;ACCEPTED;EXPIRED;REVOKED'),
 ('SM-M06-013','IdentityMatchOutcome','NO_MATCH;POSSIBLE_MATCH;VERIFIED_MATCH;REVIEW_REQUIRED'),
 ('SM-M06-014','DocumentState','UNAVAILABLE;AVAILABLE;PROCESSING;FAILED'),
 ('SM-M06-015','NotificationChannel','IN_PRODUCT;EMAIL;SMS')
) AS s(id, entity, csv)
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION lucie_m06.is_enum(p_enum text, p_value text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = lucie_m06, public AS $fn$
  SELECT p_value IS NULL OR EXISTS (
    SELECT 1 FROM lucie_m06.enumeration_value
    WHERE enumeration_name = p_enum AND value = p_value
  );
$fn$;

CREATE TABLE IF NOT EXISTS lucie_m06.workforce_profile (
  workforce_profile_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            uuid NOT NULL,
  organization_id      uuid NOT NULL,
  person_category      text NOT NULL,
  status               text NOT NULL DEFAULT 'DRAFT',
  captivity            text NOT NULL DEFAULT 'UNSPECIFIED',
  invitation_disposition text NOT NULL DEFAULT 'NOT_REQUESTED',
  user_account_id      uuid,
  display_name         text NOT NULL,
  legal_first_name     text,
  legal_last_name      text,
  work_email           text,
  work_phone           text,
  npn                  text,
  external_reference   text,
  roster_only          boolean NOT NULL DEFAULT true,
  effective_from       date NOT NULL DEFAULT current_date,
  effective_to         date,
  version              int  NOT NULL DEFAULT 1,
  created_at           timestamptz NOT NULL DEFAULT now(),
  created_by           uuid,
  updated_at           timestamptz NOT NULL DEFAULT now(),
  updated_by           uuid,
  CONSTRAINT ck_wp_status   CHECK (lucie_m06.is_enum('WorkforceProfileStatus', status)),
  CONSTRAINT ck_wp_category CHECK (lucie_m06.is_enum('PersonCategory', person_category)),
  CONSTRAINT ck_wp_captive  CHECK (lucie_m06.is_enum('CaptivityClassification', captivity)),
  CONSTRAINT ck_wp_invite   CHECK (lucie_m06.is_enum('InvitationDisposition', invitation_disposition)),
  CONSTRAINT ck_wp_dates    CHECK (effective_to IS NULL OR effective_to >= effective_from)
);
CREATE INDEX IF NOT EXISTS ix_wp_tenant_org ON lucie_m06.workforce_profile (tenant_id, organization_id, status);
CREATE INDEX IF NOT EXISTS ix_wp_user ON lucie_m06.workforce_profile (user_account_id) WHERE user_account_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS lucie_m06.agency_operational_profile (
  agency_operational_profile_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL,
  organization_id uuid NOT NULL UNIQUE,
  operating_name  text,
  captivity_default text NOT NULL DEFAULT 'UNSPECIFIED',
  service_states  text[] NOT NULL DEFAULT '{}',
  defaults        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_aop_captive CHECK (lucie_m06.is_enum('CaptivityClassification', captivity_default))
);

CREATE TABLE IF NOT EXISTS lucie_m06.agency_affiliation (
  affiliation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL,
  status         text NOT NULL DEFAULT 'PLANNED',
  captivity      text NOT NULL DEFAULT 'UNSPECIFIED',
  is_primary     boolean NOT NULL DEFAULT false,
  effective_from date NOT NULL DEFAULT current_date,
  effective_to   date,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  CONSTRAINT ck_aff_status CHECK (lucie_m06.is_enum('AffiliationStatus', status)),
  CONSTRAINT ck_aff_captive CHECK (lucie_m06.is_enum('CaptivityClassification', captivity)),
  CONSTRAINT ck_aff_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);
CREATE INDEX IF NOT EXISTS ix_aff_profile ON lucie_m06.agency_affiliation (workforce_profile_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS ux_aff_primary_active ON lucie_m06.agency_affiliation (workforce_profile_id) WHERE is_primary AND status = 'ACTIVE';

CREATE TABLE IF NOT EXISTS lucie_m06.affiliation_correction (
  correction_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL,
  affiliation_id uuid NOT NULL REFERENCES lucie_m06.agency_affiliation(affiliation_id) ON DELETE CASCADE,
  reason        text NOT NULL,
  before_state  jsonb NOT NULL,
  after_state   jsonb NOT NULL,
  corrected_by  uuid,
  corrected_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lucie_m06.workforce_group (
  group_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  group_type text NOT NULL,
  parent_group_id uuid REFERENCES lucie_m06.workforce_group(group_id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_grp_type CHECK (lucie_m06.is_enum('GroupType', group_type)),
  CONSTRAINT ck_grp_self CHECK (parent_group_id IS NULL OR parent_group_id <> group_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_group_name ON lucie_m06.workforce_group (tenant_id, organization_id, group_type, lower(name));

CREATE TABLE IF NOT EXISTS lucie_m06.group_membership (
  membership_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  group_id  uuid NOT NULL REFERENCES lucie_m06.workforce_group(group_id) ON DELETE CASCADE,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  group_type text NOT NULL,
  is_lead boolean NOT NULL DEFAULT false,
  effective_from date NOT NULL DEFAULT current_date,
  effective_to date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_gm_type CHECK (lucie_m06.is_enum('GroupType', group_type))
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_gm_open ON lucie_m06.group_membership (group_id, workforce_profile_id) WHERE effective_to IS NULL;

CREATE TABLE IF NOT EXISTS lucie_m06.lifecycle_case (
  case_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  case_type text NOT NULL CHECK (case_type IN ('ONBOARDING','TRANSFER','OFFBOARDING')),
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'DRAFT',
  source_organization_id uuid,
  target_organization_id uuid,
  scheduled_for date,
  blocking_reasons text[] NOT NULL DEFAULT '{}',
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS ix_case_profile ON lucie_m06.lifecycle_case (workforce_profile_id, case_type, status);

CREATE TABLE IF NOT EXISTS lucie_m06.profile_status_history (
  history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  from_status text,
  to_status   text NOT NULL,
  lifecycle_action text,
  reason text,
  actor_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_psh_to CHECK (lucie_m06.is_enum('WorkforceProfileStatus', to_status)),
  CONSTRAINT ck_psh_action CHECK (lucie_m06.is_enum('LifecycleAction', lifecycle_action))
);

CREATE TABLE IF NOT EXISTS lucie_m06.availability_declaration (
  availability_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  availability text NOT NULL DEFAULT 'AVAILABLE',
  note text,
  effective_from date NOT NULL DEFAULT current_date,
  effective_to date,
  declared_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_av CHECK (lucie_m06.is_enum('Availability', availability))
);

CREATE TABLE IF NOT EXISTS lucie_m06.service_scope (
  service_scope_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  state_code char(2) NOT NULL,
  product_lines text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_ss_status CHECK (lucie_m06.is_enum('ServiceScopeStatus', status))
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_ss ON lucie_m06.service_scope (workforce_profile_id, state_code);

CREATE TABLE IF NOT EXISTS lucie_m06.readiness_result (
  readiness_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  readiness_state text NOT NULL DEFAULT 'REVIEW_REQUIRED',
  operational_eligibility text NOT NULL DEFAULT 'REVIEW_REQUIRED',
  reasons text[] NOT NULL DEFAULT '{}',
  contributing_sources jsonb NOT NULL DEFAULT '{}'::jsonb,
  owner_freshness_at timestamptz,
  evaluated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_rr_state CHECK (lucie_m06.is_enum('ReadinessState', readiness_state)),
  CONSTRAINT ck_rr_elig CHECK (lucie_m06.is_enum('OperationalEligibility', operational_eligibility))
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_readiness_current ON lucie_m06.readiness_result (workforce_profile_id);

CREATE TABLE IF NOT EXISTS lucie_m06.m06_exception (
  exception_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  organization_id uuid,
  subject_type text NOT NULL,
  subject_id uuid,
  code text NOT NULL,
  summary text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN',
  risk_level text NOT NULL DEFAULT 'STANDARD',
  resolution_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  CONSTRAINT ck_ex_status CHECK (lucie_m06.is_enum('ExceptionStatus', status)),
  CONSTRAINT ck_ex_risk CHECK (lucie_m06.is_enum('RiskLevel', risk_level))
);
CREATE INDEX IF NOT EXISTS ix_exception_open ON lucie_m06.m06_exception (tenant_id, status);

CREATE TABLE IF NOT EXISTS lucie_m06.task_reference (
  task_reference_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  subject_type text NOT NULL,
  subject_id uuid,
  external_task_id text,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_task_status CHECK (lucie_m06.is_enum('ProcessingStatus', status))
);

CREATE TABLE IF NOT EXISTS lucie_m06.workforce_note (
  note_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  audience text NOT NULL DEFAULT 'AGENCY_VISIBLE',
  body text NOT NULL,
  author_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_note_audience CHECK (lucie_m06.is_enum('NoteAudience', audience))
);

CREATE TABLE IF NOT EXISTS lucie_m06.document_reference (
  document_reference_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  subject_type text NOT NULL,
  subject_id uuid,
  document_state text NOT NULL DEFAULT 'UNAVAILABLE',
  owner_module text NOT NULL DEFAULT 'M00',
  external_document_id text,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_doc_state CHECK (lucie_m06.is_enum('DocumentState', document_state))
);

CREATE TABLE IF NOT EXISTS lucie_m06.history_entry (
  history_entry_id bigserial PRIMARY KEY,
  tenant_id uuid,
  subject_type text NOT NULL,
  subject_id uuid,
  action text NOT NULL,
  actor_id uuid,
  before_state jsonb,
  after_state jsonb,
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_history_subject ON lucie_m06.history_entry (subject_type, subject_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS lucie_m06.job_reference (
  job_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  organization_id uuid,
  job_kind text NOT NULL CHECK (job_kind IN ('IMPORT','EXPORT')),
  status text NOT NULL,
  file_name text,
  row_count int NOT NULL DEFAULT 0,
  error_count int NOT NULL DEFAULT 0,
  errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  requested_by uuid,
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS lucie_m06.reconciliation_run (
  reconciliation_run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  scope text NOT NULL,
  status text NOT NULL DEFAULT 'REQUESTED',
  drift_count int NOT NULL DEFAULT 0,
  findings jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  CONSTRAINT ck_recon_status CHECK (lucie_m06.is_enum('ReconciliationStatus', status))
);

CREATE TABLE IF NOT EXISTS lucie_m06.notification_request (
  notification_request_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  channel text NOT NULL DEFAULT 'IN_PRODUCT',
  urgency text NOT NULL DEFAULT 'ROUTINE',
  recipient_profile_id uuid REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE SET NULL,
  template_code text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_nr_channel CHECK (lucie_m06.is_enum('NotificationChannel', channel)),
  CONSTRAINT ck_nr_urgency CHECK (lucie_m06.is_enum('NotificationUrgency', urgency)),
  CONSTRAINT ck_nr_status CHECK (lucie_m06.is_enum('ProcessingStatus', status))
);

CREATE TABLE IF NOT EXISTS lucie_m06.duplicate_candidate (
  duplicate_candidate_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  candidate_profile_id uuid REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  match_outcome text NOT NULL DEFAULT 'POSSIBLE_MATCH',
  match_signals jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_dup_outcome CHECK (lucie_m06.is_enum('IdentityMatchOutcome', match_outcome)),
  CONSTRAINT ck_dup_status CHECK (lucie_m06.is_enum('ExceptionStatus', status))
);

CREATE TABLE IF NOT EXISTS lucie_m06.identity_link_review (
  identity_link_review_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  proposed_user_account_id uuid,
  match_outcome text NOT NULL DEFAULT 'REVIEW_REQUIRED',
  decision text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_ilr_outcome CHECK (lucie_m06.is_enum('IdentityMatchOutcome', match_outcome))
);

CREATE TABLE IF NOT EXISTS lucie_m06.work_assignment_context (
  work_assignment_context_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  workforce_profile_id uuid NOT NULL REFERENCES lucie_m06.workforce_profile(workforce_profile_id) ON DELETE CASCADE,
  organization_id uuid NOT NULL,
  business_unit_id uuid REFERENCES lucie_m06.workforce_group(group_id) ON DELETE SET NULL,
  team_id uuid REFERENCES lucie_m06.workforce_group(group_id) ON DELETE SET NULL,
  effective_from date NOT NULL DEFAULT current_date,
  effective_to date
);

CREATE TABLE IF NOT EXISTS lucie_m06.support_context (
  support_context_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  actor_id uuid NOT NULL,
  mode text NOT NULL DEFAULT 'INACTIVE',
  reason text NOT NULL,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_sc_mode CHECK (lucie_m06.is_enum('SupportMode', mode))
);

CREATE TABLE IF NOT EXISTS lucie_m06.upstream_projection (
  projection_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id     text NOT NULL,
  owner_module  text NOT NULL,
  tenant_id     uuid NOT NULL,
  subject_type  text NOT NULL,
  subject_id    uuid,
  payload       jsonb NOT NULL DEFAULT '{}'::jsonb,
  owner_version text,
  owner_observed_at timestamptz NOT NULL DEFAULT now(),
  stale         boolean NOT NULL DEFAULT false,
  CONSTRAINT ck_proj_owner CHECK (owner_module IN ('M00','M01','M04','M05','M08'))
);
CREATE INDEX IF NOT EXISTS ix_projection_lookup ON lucie_m06.upstream_projection (object_id, tenant_id, subject_id);

CREATE TABLE IF NOT EXISTS lucie_m06.event_outbox (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  tenant_id uuid,
  aggregate_type text NOT NULL,
  aggregate_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  correlation_id uuid,
  actor_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX IF NOT EXISTS ix_outbox_unpublished ON lucie_m06.event_outbox (occurred_at) WHERE published_at IS NULL;

CREATE OR REPLACE FUNCTION lucie_m06.audit_row()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = lucie_m06, public AS $fn$
BEGIN
  INSERT INTO lucie_m06.history_entry (tenant_id, subject_type, subject_id, action, before_state, after_state)
  VALUES (
    NULLIF(to_jsonb(COALESCE(NEW, OLD)) ->> 'tenant_id', '')::uuid,
    TG_TABLE_NAME,
    NULLIF(to_jsonb(COALESCE(NEW, OLD)) ->> (TG_ARGV[0]), '')::uuid,
    TG_OP,
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$fn$;

DO $do$
DECLARE t record;
BEGIN
  FOR t IN
    SELECT c.relname AS tbl,
           (SELECT a.attname FROM pg_attribute a
             JOIN pg_index i ON i.indrelid = c.oid AND i.indisprimary
            WHERE a.attrelid = c.oid AND a.attnum = ANY (i.indkey)
            ORDER BY a.attnum LIMIT 1) AS pk
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'lucie_m06' AND c.relkind = 'r'
       AND c.relname NOT IN ('history_entry','event_outbox','enumeration_value','state_model')
  LOOP
    EXECUTE format('ALTER TABLE lucie_m06.%I ENABLE ROW LEVEL SECURITY', t.tbl);
    EXECUTE format('ALTER TABLE lucie_m06.%I FORCE ROW LEVEL SECURITY', t.tbl);
    EXECUTE format('DROP TRIGGER IF EXISTS trg_audit_%I ON lucie_m06.%I', t.tbl, t.tbl);
    IF t.pk IS NOT NULL AND t.tbl <> 'upstream_projection' THEN
      EXECUTE format(
        'CREATE TRIGGER trg_audit_%I AFTER INSERT OR UPDATE OR DELETE ON lucie_m06.%I FOR EACH ROW EXECUTE FUNCTION lucie_m06.audit_row(%L)',
        t.tbl, t.tbl, t.pk);
    END IF;
  END LOOP;
END $do$;

ALTER TABLE lucie_m06.history_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m06.history_entry FORCE ROW LEVEL SECURITY;
ALTER TABLE lucie_m06.event_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m06.event_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE lucie_m06.enumeration_value ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m06.state_model ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA lucie_m06 FROM anon, authenticated;
REVOKE ALL ON SCHEMA lucie_m06 FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS lucie_m06.schema_version (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now(),
  note text
);
INSERT INTO lucie_m06.schema_version (version, note)
VALUES ('M06-1.0-V001', 'Canonical foundation authored under CCL-M06-001 (packet migrations were marker stubs).')
ON CONFLICT DO NOTHING;