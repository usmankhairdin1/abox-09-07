CREATE SCHEMA IF NOT EXISTS gov_stage;
REVOKE ALL ON SCHEMA gov_stage FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA gov_stage TO service_role;

CREATE TABLE gov_stage.recon_run (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_manifest jsonb NOT NULL,
  snapshot_hash text NOT NULL,
  status text NOT NULL DEFAULT 'EXTRACTED',
  operator uuid,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);
CREATE TABLE gov_stage.source_record (
  source_record_id text NOT NULL,
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  source_id text NOT NULL,
  source_path text NOT NULL,
  source_hash text NOT NULL,
  record_locator text NOT NULL,
  raw_id text, raw_name text, raw_route text, raw_module text,
  norm_id text, alias_kind text, norm_route text, norm_state text, norm_name text,
  screen_defining boolean NOT NULL DEFAULT false,
  raw_payload jsonb NOT NULL,
  PRIMARY KEY (run_id, source_record_id)
);
CREATE TABLE gov_stage.alias_observation (
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  alias_value text NOT NULL, alias_kind text NOT NULL,
  source_record_id text NOT NULL, protected boolean NOT NULL DEFAULT false,
  PRIMARY KEY (run_id, alias_value, source_record_id)
);
CREATE TABLE gov_stage.candidate (
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  cand_id text NOT NULL,
  state text NOT NULL DEFAULT 'OPEN',
  terminal_state text,
  PRIMARY KEY (run_id, cand_id)
);
CREATE TABLE gov_stage.candidate_member (
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  cand_id text NOT NULL, source_record_id text NOT NULL,
  membership text NOT NULL, reason text NOT NULL,
  PRIMARY KEY (run_id, cand_id, source_record_id)
);
CREATE TABLE gov_stage.match_result (
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  cand_a text NOT NULL, cand_b text NOT NULL,
  signals jsonb NOT NULL, class text NOT NULL, evidence jsonb NOT NULL,
  PRIMARY KEY (run_id, cand_a, cand_b)
);
CREATE TABLE gov_stage.issue (
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  issue_id text NOT NULL, issue_type text NOT NULL, severity text NOT NULL,
  cand_ids text[] NOT NULL DEFAULT '{}', record_ids text[] NOT NULL DEFAULT '{}',
  sem_ref text, evidence jsonb NOT NULL,
  PRIMARY KEY (run_id, issue_id)
);
CREATE TABLE gov_stage.decision (
  decision_row_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id text NOT NULL,
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  issue_ids text[] NOT NULL DEFAULT '{}', cand_ids text[] NOT NULL DEFAULT '{}',
  decision_type text NOT NULL, outcome jsonb NOT NULL, rationale text NOT NULL,
  evidence_refs jsonb NOT NULL DEFAULT '[]', state text NOT NULL,
  proposed_by uuid NOT NULL, approved_by uuid,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT decision_sod CHECK (approved_by IS NULL OR approved_by <> proposed_by),
  CONSTRAINT decision_rationale CHECK (length(btrim(rationale)) > 0)
);
CREATE TABLE gov_stage.approved_set (
  set_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  set_hash text NOT NULL, proposed_by uuid NOT NULL, approved_by uuid,
  frozen_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT set_sod CHECK (approved_by IS NULL OR approved_by <> proposed_by)
);
CREATE TABLE gov_stage.approved_set_item (
  set_id uuid NOT NULL REFERENCES gov_stage.approved_set(set_id),
  cand_id text NOT NULL, payload jsonb NOT NULL,
  PRIMARY KEY (set_id, cand_id)
);

-- append-only: block UPDATE/DELETE on evidence and decisions
CREATE OR REPLACE FUNCTION gov_stage.forbid_mutation() RETURNS trigger
LANGUAGE plpgsql SET search_path = gov_stage AS $$
BEGIN RAISE EXCEPTION 'gov_stage.% is append-only', TG_TABLE_NAME; END $$;
CREATE TRIGGER source_record_ro BEFORE UPDATE OR DELETE ON gov_stage.source_record FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER decision_ro BEFORE UPDATE OR DELETE ON gov_stage.decision FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER approved_set_item_ro BEFORE UPDATE OR DELETE ON gov_stage.approved_set_item FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA gov_stage TO service_role;

ALTER TABLE gov_stage.recon_run ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.source_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.alias_observation ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.candidate ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.candidate_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.match_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.issue ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.decision ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.approved_set ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.approved_set_item ENABLE ROW LEVEL SECURITY;