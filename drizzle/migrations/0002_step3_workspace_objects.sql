-- Step 3 — Reconciliation Workspace (gov_stage only; thin public RPC entry points).
-- No GSIDs, no registry, no ledger. Phase 0 baseline rows are append-only.
-- gov_stage schema USAGE remains revoked from anon/authenticated (migration 0000).

CREATE TABLE gov_stage.gov_role (
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('gov_reviewer','gov_approver','gov_operator')),
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role)
);
CREATE TABLE gov_stage.decision_event (
  event_id bigserial PRIMARY KEY,
  decision_row_id uuid NOT NULL REFERENCES gov_stage.decision(decision_row_id),
  event_type text NOT NULL CHECK (event_type IN ('PROPOSED','APPROVED','REJECTED','WITHDRAWN','SUPERSEDED')),
  actor uuid NOT NULL,
  rationale text,
  idempotency_key text UNIQUE,
  at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX decision_event_decision_idx ON gov_stage.decision_event(decision_row_id, event_id);
CREATE TABLE gov_stage.audit_event (
  seq bigserial PRIMARY KEY,
  run_id uuid,
  actor uuid,
  action text NOT NULL,
  subject text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  prev_hash text NOT NULL DEFAULT '',
  hash text NOT NULL DEFAULT '',
  at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE gov_stage.m00_sample_entry (
  run_id uuid NOT NULL REFERENCES gov_stage.recon_run(run_id),
  entry_index int NOT NULL,
  screen_id text NOT NULL,
  name text,
  payload jsonb NOT NULL,
  source_hash text NOT NULL,
  PRIMARY KEY (run_id, entry_index)
);
CREATE UNIQUE INDEX recon_run_snapshot_uq ON gov_stage.recon_run(snapshot_hash);
CREATE UNIQUE INDEX decision_id_uq ON gov_stage.decision(run_id, decision_id);

GRANT SELECT, INSERT ON gov_stage.gov_role, gov_stage.decision_event, gov_stage.audit_event, gov_stage.m00_sample_entry TO service_role;
GRANT USAGE ON SEQUENCE gov_stage.decision_event_event_id_seq, gov_stage.audit_event_seq_seq TO service_role;
ALTER TABLE gov_stage.gov_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.decision_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.audit_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.m00_sample_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_stage.approved_set_item ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER decision_event_ro BEFORE UPDATE OR DELETE ON gov_stage.decision_event FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER audit_event_ro BEFORE UPDATE OR DELETE ON gov_stage.audit_event FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER m00_sample_entry_ro BEFORE UPDATE OR DELETE ON gov_stage.m00_sample_entry FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER candidate_ro BEFORE UPDATE OR DELETE ON gov_stage.candidate FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER candidate_member_ro BEFORE UPDATE OR DELETE ON gov_stage.candidate_member FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER match_result_ro BEFORE UPDATE OR DELETE ON gov_stage.match_result FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER issue_ro BEFORE UPDATE OR DELETE ON gov_stage.issue FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();
CREATE TRIGGER alias_observation_ro BEFORE UPDATE OR DELETE ON gov_stage.alias_observation FOR EACH ROW EXECUTE FUNCTION gov_stage.forbid_mutation();

CREATE OR REPLACE FUNCTION gov_stage.recon_run_guard() RETURNS trigger
LANGUAGE plpgsql SET search_path = gov_stage AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'gov_stage.recon_run is append-only'; END IF;
  IF NEW.snapshot_hash <> OLD.snapshot_hash OR NEW.snapshot_manifest <> OLD.snapshot_manifest OR NEW.operator IS DISTINCT FROM OLD.operator THEN
    RAISE EXCEPTION 'gov_stage.recon_run baseline fields are immutable';
  END IF;
  IF OLD.status = 'FROZEN' THEN RAISE EXCEPTION 'gov_stage.recon_run is frozen'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER recon_run_guard BEFORE UPDATE OR DELETE ON gov_stage.recon_run FOR EACH ROW EXECUTE FUNCTION gov_stage.recon_run_guard();

CREATE OR REPLACE FUNCTION gov_stage.approved_set_guard() RETURNS trigger
LANGUAGE plpgsql SET search_path = gov_stage AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'gov_stage.approved_set is append-only'; END IF;
  IF OLD.approved_by IS NOT NULL THEN RAISE EXCEPTION 'gov_stage.approved_set is frozen'; END IF;
  IF NEW.set_hash <> OLD.set_hash OR NEW.proposed_by <> OLD.proposed_by OR NEW.run_id <> OLD.run_id THEN
    RAISE EXCEPTION 'gov_stage.approved_set fields are immutable';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER approved_set_guard BEFORE UPDATE OR DELETE ON gov_stage.approved_set FOR EACH ROW EXECUTE FUNCTION gov_stage.approved_set_guard();

CREATE OR REPLACE FUNCTION gov_stage.decision_event_sod() RETURNS trigger
LANGUAGE plpgsql SET search_path = gov_stage AS $$
DECLARE v_prop uuid; v_op uuid;
BEGIN
  SELECT d.proposed_by, r.operator INTO v_prop, v_op
  FROM gov_stage.decision d JOIN gov_stage.recon_run r ON r.run_id = d.run_id
  WHERE d.decision_row_id = NEW.decision_row_id;
  IF NEW.event_type IN ('APPROVED','REJECTED') AND (NEW.actor = v_prop OR NEW.actor = v_op) THEN
    RAISE EXCEPTION 'SOD_VIOLATION: proposer or loading operator cannot approve/reject';
  END IF;
  IF NEW.event_type = 'PROPOSED' AND NEW.actor <> v_prop THEN RAISE EXCEPTION 'SOD_VIOLATION: proposal actor mismatch'; END IF;
  IF NEW.event_type = 'WITHDRAWN' AND NEW.actor <> v_prop THEN RAISE EXCEPTION 'SOD_VIOLATION: only the proposer can withdraw'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER decision_event_sod BEFORE INSERT ON gov_stage.decision_event FOR EACH ROW EXECUTE FUNCTION gov_stage.decision_event_sod();

CREATE OR REPLACE FUNCTION gov_stage.audit_hash(p_prev text, p_run uuid, p_actor uuid, p_action text, p_subject text, p_payload jsonb)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT encode(sha256(convert_to(p_prev || '|' || coalesce(p_run::text,'') || '|' || coalesce(p_actor::text,'') || '|' || p_action || '|' || coalesce(p_subject,'') || '|' || p_payload::text, 'UTF8')), 'hex')
$$;
CREATE OR REPLACE FUNCTION gov_stage.audit_chain() RETURNS trigger
LANGUAGE plpgsql SET search_path = gov_stage AS $$
DECLARE v_prev text;
BEGIN
  PERFORM pg_advisory_xact_lock(771100);
  SELECT hash INTO v_prev FROM gov_stage.audit_event ORDER BY seq DESC LIMIT 1;
  NEW.prev_hash := coalesce(v_prev, 'GENESIS');
  NEW.hash := gov_stage.audit_hash(NEW.prev_hash, NEW.run_id, NEW.actor, NEW.action, NEW.subject, NEW.payload);
  RETURN NEW;
END $$;
CREATE TRIGGER audit_event_chain BEFORE INSERT ON gov_stage.audit_event FOR EACH ROW EXECUTE FUNCTION gov_stage.audit_chain();

CREATE OR REPLACE FUNCTION gov_stage.audit(p_run uuid, p_actor uuid, p_action text, p_subject text, p_payload jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = gov_stage AS $$
  INSERT INTO gov_stage.audit_event(run_id, actor, action, subject, payload) VALUES (p_run, p_actor, p_action, p_subject, coalesce(p_payload,'{}'::jsonb));
$$;

CREATE OR REPLACE FUNCTION gov_stage.has_gov_role(p_user uuid, p_role text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = gov_stage AS $$
  SELECT p_user IS NOT NULL AND EXISTS (SELECT 1 FROM gov_stage.gov_role WHERE user_id = p_user AND role = p_role)
$$;
CREATE OR REPLACE FUNCTION gov_stage.has_any_gov_role(p_user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = gov_stage AS $$
  SELECT p_user IS NOT NULL AND EXISTS (SELECT 1 FROM gov_stage.gov_role WHERE user_id = p_user)
$$;
CREATE OR REPLACE FUNCTION gov_stage.protected_ids(p_run uuid)
RETURNS text[] LANGUAGE sql STABLE SET search_path = gov_stage AS $$
  SELECT array(SELECT DISTINCT v FROM (
    SELECT unnest(ARRAY['SCR_AGENCY_SETUP','UX-009','SCR_PLATFORM_HOME']) AS v
    UNION SELECT alias_value FROM gov_stage.alias_observation WHERE run_id = p_run AND protected) s ORDER BY v)
$$;
CREATE OR REPLACE FUNCTION gov_stage.cand_protected(p_run uuid, p_cand text)
RETURNS boolean LANGUAGE sql STABLE SET search_path = gov_stage AS $$
  SELECT EXISTS (SELECT 1 FROM gov_stage.candidate_member m JOIN gov_stage.source_record r
      ON r.run_id = m.run_id AND r.source_record_id = m.source_record_id
    WHERE m.run_id = p_run AND m.cand_id = p_cand AND r.norm_id = ANY (gov_stage.protected_ids(p_run)))
$$;
CREATE OR REPLACE FUNCTION gov_stage.issue_protected(p_run uuid, p_issue text)
RETURNS boolean LANGUAGE sql STABLE SET search_path = gov_stage AS $$
  SELECT EXISTS (SELECT 1 FROM gov_stage.issue i WHERE i.run_id = p_run AND i.issue_id = p_issue AND (
    coalesce(i.evidence->>'alias','') = ANY (gov_stage.protected_ids(p_run))
    OR EXISTS (SELECT 1 FROM unnest(i.cand_ids) c WHERE gov_stage.cand_protected(p_run, c))))
$$;
CREATE OR REPLACE FUNCTION gov_stage.decision_state(p_row uuid)
RETURNS text LANGUAGE sql STABLE SET search_path = gov_stage AS $$
  SELECT event_type FROM gov_stage.decision_event WHERE decision_row_id = p_row ORDER BY event_id DESC LIMIT 1
$$;
CREATE OR REPLACE FUNCTION gov_stage.cand_terminal(p_run uuid, p_cand text)
RETURNS jsonb LANGUAGE sql STABLE SET search_path = gov_stage AS $$
  SELECT co || jsonb_build_object('decision_id', d.decision_id, 'decision_row_id', d.decision_row_id)
  FROM gov_stage.decision d, jsonb_array_elements(coalesce(d.outcome->'candidate_outcomes','[]'::jsonb)) co
  WHERE d.run_id = p_run AND co->>'cand_id' = p_cand AND gov_stage.decision_state(d.decision_row_id) = 'APPROVED'
  ORDER BY d.recorded_at DESC, d.decision_id DESC LIMIT 1
$$;
CREATE OR REPLACE FUNCTION gov_stage.issue_decided(p_run uuid, p_issue text)
RETURNS boolean LANGUAGE sql STABLE SET search_path = gov_stage AS $$
  SELECT EXISTS (SELECT 1 FROM gov_stage.decision d WHERE d.run_id = p_run AND p_issue = ANY (d.issue_ids)
    AND gov_stage.decision_state(d.decision_row_id) = 'APPROVED')
$$;
CREATE OR REPLACE FUNCTION gov_stage.basis_version(p_run uuid, p_cands text[], p_issues text[])
RETURNS bigint LANGUAGE sql STABLE SET search_path = gov_stage AS $$
  SELECT count(*) FROM gov_stage.decision_event e JOIN gov_stage.decision d ON d.decision_row_id = e.decision_row_id
  WHERE d.run_id = p_run AND e.event_type IN ('APPROVED','SUPERSEDED')
    AND (d.cand_ids && coalesce(p_cands,'{}') OR d.issue_ids && coalesce(p_issues,'{}'))
$$;
CREATE OR REPLACE FUNCTION gov_stage.need_text(p jsonb, k text, code text)
RETURNS text LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF p IS NULL OR length(btrim(coalesce(p->>k,''))) = 0 THEN RAISE EXCEPTION '%: % is required', code, k; END IF;
  RETURN p->>k;
END $$;

CREATE OR REPLACE FUNCTION gov_stage.check_candidate_outcome(p_run uuid, co jsonb)
RETURNS void LANGUAGE plpgsql STABLE SET search_path = gov_stage AS $$
DECLARE v_cand text := co->>'cand_id'; v_out text := co->>'outcome'; v_t jsonb; v_rec text; v_target text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM gov_stage.candidate WHERE run_id = p_run AND cand_id = v_cand) THEN RAISE EXCEPTION 'UNKNOWN_CANDIDATE: %', v_cand; END IF;
  IF v_out IS NULL OR v_out NOT IN ('APPROVED_SCREEN','MERGED_INTO','VARIANT_OF','NOT_A_SCREEN','DEFERRED') THEN RAISE EXCEPTION 'INVALID_OUTCOME: %', v_out; END IF;
  IF v_out IN ('APPROVED_SCREEN','MERGED_INTO','VARIANT_OF') AND coalesce(co->>'classification','') NOT IN ('EXISTING','NEW') THEN
    RAISE EXCEPTION 'CLASSIFICATION_REQUIRED: % needs EXISTING or NEW', v_out;
  END IF;
  IF v_out = 'APPROVED_SCREEN' THEN
    PERFORM gov_stage.need_text(co, 'name', 'APPROVED_SCREEN');
    PERFORM gov_stage.need_text(co, 'owner_module', 'APPROVED_SCREEN');
    IF length(btrim(coalesce(co->>'primary_route',''))) = 0 AND coalesce((co->>'route_deferred')::boolean, false) = false THEN
      RAISE EXCEPTION 'APPROVED_SCREEN: primary_route or route_deferred is required';
    END IF;
    IF jsonb_typeof(co->'record_ids') IS DISTINCT FROM 'array' OR jsonb_array_length(co->'record_ids') = 0 THEN
      RAISE EXCEPTION 'APPROVED_SCREEN: record_ids (screen-defining members) are required';
    END IF;
    FOR v_rec IN SELECT jsonb_array_elements_text(co->'record_ids') LOOP
      IF NOT EXISTS (SELECT 1 FROM gov_stage.candidate_member WHERE run_id = p_run AND cand_id = v_cand AND source_record_id = v_rec) THEN
        RAISE EXCEPTION 'FIGMA_OR_FOREIGN_RECORD_REFUSED: % is not a screen-defining member of %', v_rec, v_cand;
      END IF;
    END LOOP;
  ELSIF v_out = 'MERGED_INTO' THEN
    v_target := gov_stage.need_text(co, 'target', 'MERGED_INTO');
    IF v_target = v_cand OR NOT EXISTS (SELECT 1 FROM gov_stage.candidate WHERE run_id = p_run AND cand_id = v_target) THEN RAISE EXCEPTION 'MERGED_INTO: invalid target %', v_target; END IF;
    v_t := gov_stage.cand_terminal(p_run, v_target);
    IF v_t->>'outcome' = 'MERGED_INTO' THEN RAISE EXCEPTION 'MERGE_CHAIN_REFUSED: % is itself merged', v_target; END IF;
    IF EXISTS (SELECT 1 FROM gov_stage.candidate c WHERE c.run_id = p_run AND c.cand_id <> v_cand
               AND gov_stage.cand_terminal(p_run, c.cand_id)->>'outcome' = 'MERGED_INTO'
               AND gov_stage.cand_terminal(p_run, c.cand_id)->>'target' = v_cand) THEN
      RAISE EXCEPTION 'MERGE_CHAIN_REFUSED: other candidates are merged into %', v_cand;
    END IF;
  ELSIF v_out = 'VARIANT_OF' THEN
    v_target := gov_stage.need_text(co, 'parent', 'VARIANT_OF');
    PERFORM gov_stage.need_text(co, 'variant_key', 'VARIANT_OF');
    IF v_target = v_cand OR NOT EXISTS (SELECT 1 FROM gov_stage.candidate WHERE run_id = p_run AND cand_id = v_target) THEN RAISE EXCEPTION 'VARIANT_OF: invalid parent %', v_target; END IF;
    IF gov_stage.cand_terminal(p_run, v_target)->>'outcome' IN ('NOT_A_SCREEN','DEFERRED','MERGED_INTO') THEN
      RAISE EXCEPTION 'VARIANT_OF: parent % is not an eligible screen', v_target;
    END IF;
  ELSIF v_out = 'NOT_A_SCREEN' THEN
    PERFORM gov_stage.need_text(co, 'reason_code', 'NOT_A_SCREEN');
  ELSIF v_out = 'DEFERRED' THEN
    PERFORM gov_stage.need_text(co, 'reason', 'DEFERRED');
    PERFORM gov_stage.need_text(co, 'owner', 'DEFERRED');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.gov_recon_me()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = gov_stage, public AS $$
  SELECT jsonb_build_object('user_id', auth.uid(),
    'roles', coalesce((SELECT jsonb_agg(role ORDER BY role) FROM gov_stage.gov_role WHERE user_id = auth.uid()), '[]'::jsonb))
$$;

CREATE OR REPLACE FUNCTION public.gov_recon_load(p_run jsonb, p_file_hash text, p_m00 jsonb, p_m00_hash text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = gov_stage, public AS $$
DECLARE
  c_file constant text := 'f7bdf608d1f5de6f4537450cb5ca4253d41f3fcc472189dbd6edf3ba1d3e8f7d';
  c_snap constant text := 'd780027549529f06c11bbb39400e71e418f8d88eed76be4c0ec30be7ca9ad6fc';
  v_uid uuid := auth.uid(); v_run uuid; n_rec int; n_cand int; n_match int; n_iss int; v_prot text[];
BEGIN
  IF NOT gov_stage.has_gov_role(v_uid, 'gov_operator') THEN RAISE EXCEPTION 'FORBIDDEN: gov_operator role required'; END IF;
  IF p_file_hash IS DISTINCT FROM c_file THEN RAISE EXCEPTION 'BASELINE_HASH_MISMATCH: file hash % is not the frozen baseline', p_file_hash; END IF;
  IF p_run->'meta'->>'snapshot_hash' IS DISTINCT FROM c_snap THEN RAISE EXCEPTION 'SNAPSHOT_HASH_MISMATCH'; END IF;
  PERFORM pg_advisory_xact_lock(771101);
  SELECT run_id INTO v_run FROM gov_stage.recon_run WHERE snapshot_hash = c_snap;
  IF FOUND THEN RETURN jsonb_build_object('run_id', v_run, 'status', 'ALREADY_LOADED'); END IF;
  IF jsonb_typeof(p_m00) IS DISTINCT FROM 'array' OR jsonb_array_length(p_m00) <> (p_run->'counts'->'m00'->>'sample_structural_entries')::int THEN
    RAISE EXCEPTION 'M00_SAMPLE_MISMATCH: entries do not match the baseline structural count';
  END IF;
  INSERT INTO gov_stage.recon_run(snapshot_manifest, snapshot_hash, status, operator)
  VALUES (jsonb_build_object('file_hash', c_file, 'meta', p_run->'meta', 'counts', p_run->'counts', 'packets', p_run->'packets',
          'population_proof', p_run->'population_proof', 'evidence', p_run->'evidence', 'm00_source_hash', p_m00_hash),
          c_snap, 'LOADED', v_uid)
  RETURNING run_id INTO v_run;
  INSERT INTO gov_stage.source_record(source_record_id, run_id, source_id, source_path, source_hash, record_locator,
    raw_id, raw_name, raw_route, raw_module, norm_id, alias_kind, norm_route, norm_state, norm_name, screen_defining, raw_payload)
  SELECT e->>'source_record_id', v_run, e->>'source_id', e->>'source_path', c_snap, e->>'record_locator',
    e->>'raw_id', e->>'raw_name', e->>'raw_route', e->>'raw_module', e->>'norm_id', e->>'alias_kind', e->>'norm_route', e->>'norm_state', e->>'norm_name',
    coalesce((e->>'screen_defining')::boolean, false), e
  FROM jsonb_array_elements(p_run->'records') e;
  SELECT array(SELECT jsonb_array_elements_text(p_run->'counts'->'protected_aliases')) INTO v_prot;
  INSERT INTO gov_stage.alias_observation(run_id, alias_value, alias_kind, source_record_id, protected)
  SELECT v_run, r.norm_id, coalesce(r.alias_kind,'UNKNOWN'), r.source_record_id, true
  FROM gov_stage.source_record r WHERE r.run_id = v_run AND r.norm_id = ANY (v_prot);
  INSERT INTO gov_stage.candidate(run_id, cand_id, state) SELECT v_run, e->>'cand_id', 'OPEN' FROM jsonb_array_elements(p_run->'candidates') e;
  INSERT INTO gov_stage.candidate_member(run_id, cand_id, source_record_id, membership, reason)
  SELECT v_run, e->>'cand_id', m, 'MEMBER', 'PHASE0_BASELINE' FROM jsonb_array_elements(p_run->'candidates') e, jsonb_array_elements_text(e->'members') m;
  INSERT INTO gov_stage.match_result(run_id, cand_a, cand_b, signals, class, evidence)
  SELECT v_run, e->>'cand_a', e->>'cand_b', e->'signals', e->>'class', jsonb_build_object('merged', e->'merged') FROM jsonb_array_elements(p_run->'matches') e;
  INSERT INTO gov_stage.issue(run_id, issue_id, issue_type, severity, cand_ids, record_ids, sem_ref, evidence)
  SELECT v_run, e->>'issue_id', e->>'issue_type', e->>'severity',
    array(SELECT jsonb_array_elements_text(coalesce(e->'cand_ids','[]'::jsonb))),
    array(SELECT jsonb_array_elements_text(coalesce(e->'record_ids','[]'::jsonb))), e->>'sem_ref', e
  FROM jsonb_array_elements(p_run->'issues') e;
  INSERT INTO gov_stage.m00_sample_entry(run_id, entry_index, screen_id, name, payload, source_hash)
  SELECT v_run, (o - 1)::int, e->>'id', e->>'name', e, p_m00_hash FROM jsonb_array_elements(p_m00) WITH ORDINALITY AS t(e, o);
  SELECT count(*) INTO n_rec FROM gov_stage.source_record WHERE run_id = v_run;
  SELECT count(*) INTO n_cand FROM gov_stage.candidate WHERE run_id = v_run;
  SELECT count(*) INTO n_match FROM gov_stage.match_result WHERE run_id = v_run;
  SELECT count(*) INTO n_iss FROM gov_stage.issue WHERE run_id = v_run;
  IF (n_rec, n_cand, n_match, n_iss) <> (1897, 277, 2626, 2917) THEN
    RAISE EXCEPTION 'LOAD_COUNT_MISMATCH: % / % / % / %', n_rec, n_cand, n_match, n_iss;
  END IF;
  PERFORM gov_stage.audit(v_run, v_uid, 'LOAD', c_file, jsonb_build_object('records', n_rec, 'candidates', n_cand, 'matches', n_match, 'issues', n_iss, 'm00_source_hash', p_m00_hash));
  RETURN jsonb_build_object('run_id', v_run, 'status', 'LOADED', 'records', n_rec, 'candidates', n_cand, 'matches', n_match, 'issues', n_iss);
END $$;

CREATE OR REPLACE FUNCTION public.gov_recon_propose(p_run uuid, p_type text, p_cand_ids text[], p_issue_ids text[],
  p_outcome jsonb, p_rationale text, p_evidence_refs jsonb, p_idem text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = gov_stage, public AS $$
DECLARE
  v_uid uuid := auth.uid(); v_row uuid; v_actor uuid; v_status text; v_prot boolean; v_all text[]; v_co jsonb; co jsonb;
  v_issues text[] := coalesce(p_issue_ids, '{}'); v_open text; v_basis bigint; v_did text; v_ref text; v_nonfigma int := 0;
  v_hash text; v_m00 jsonb; v_counts jsonb; v_sup uuid; k text;
BEGIN
  IF NOT (gov_stage.has_gov_role(v_uid, 'gov_reviewer') OR gov_stage.has_gov_role(v_uid, 'gov_approver')) THEN RAISE EXCEPTION 'FORBIDDEN: reviewer role required'; END IF;
  IF length(btrim(coalesce(p_idem,''))) = 0 THEN RAISE EXCEPTION 'IDEMPOTENCY_KEY_REQUIRED'; END IF;
  PERFORM pg_advisory_xact_lock(771102);
  SELECT decision_row_id, actor INTO v_row, v_actor FROM gov_stage.decision_event WHERE idempotency_key = p_idem;
  IF FOUND THEN
    IF v_actor <> v_uid THEN RAISE EXCEPTION 'IDEMPOTENCY_KEY_REUSED'; END IF;
    RETURN jsonb_build_object('decision_row_id', v_row, 'decision_id', (SELECT decision_id FROM gov_stage.decision WHERE decision_row_id = v_row), 'replay', true);
  END IF;
  SELECT status, snapshot_manifest->'counts' INTO v_status, v_counts FROM gov_stage.recon_run WHERE run_id = p_run;
  IF NOT FOUND THEN RAISE EXCEPTION 'UNKNOWN_RUN'; END IF;
  IF v_status = 'FROZEN' THEN RAISE EXCEPTION 'RUN_FROZEN'; END IF;
  IF p_type IS NULL OR p_type NOT IN ('OUTCOME','BOUNDARY_DECISION','DUPLICATE_CONFLICT','EVIDENCE_CLOSURE','SEM_DECISION','ISSUE_RESOLUTION') THEN
    RAISE EXCEPTION 'INVALID_DECISION_TYPE: %', p_type;
  END IF;
  IF length(btrim(coalesce(p_rationale,''))) = 0 THEN RAISE EXCEPTION 'RATIONALE_REQUIRED'; END IF;
  v_co := coalesce(p_outcome->'candidate_outcomes', '[]'::jsonb);
  IF jsonb_typeof(v_co) <> 'array' THEN RAISE EXCEPTION 'candidate_outcomes must be an array'; END IF;
  v_all := array(SELECT DISTINCT x FROM (SELECT unnest(coalesce(p_cand_ids,'{}')) x UNION SELECT e->>'cand_id' FROM jsonb_array_elements(v_co) e) s WHERE x IS NOT NULL ORDER BY x);
  IF array_length(v_all,1) IS NULL AND array_length(v_issues,1) IS NULL THEN RAISE EXCEPTION 'SUBJECT_REQUIRED: at least one candidate or issue'; END IF;
  FOREACH k IN ARRAY v_all LOOP
    IF NOT EXISTS (SELECT 1 FROM gov_stage.candidate WHERE run_id = p_run AND cand_id = k) THEN RAISE EXCEPTION 'UNKNOWN_CANDIDATE: %', k; END IF;
  END LOOP;
  FOREACH k IN ARRAY v_issues LOOP
    IF NOT EXISTS (SELECT 1 FROM gov_stage.issue WHERE run_id = p_run AND issue_id = k) THEN RAISE EXCEPTION 'UNKNOWN_ISSUE: %', k; END IF;
  END LOOP;

  v_prot := EXISTS (SELECT 1 FROM unnest(v_all) c WHERE gov_stage.cand_protected(p_run, c))
         OR EXISTS (SELECT 1 FROM unnest(v_issues) i WHERE gov_stage.issue_protected(p_run, i));
  IF v_prot THEN
    IF p_type = 'EVIDENCE_CLOSURE' THEN RAISE EXCEPTION 'PROTECTED_BULK_CLOSURE_REFUSED'; END IF;
    IF p_type <> 'BOUNDARY_DECISION' THEN RAISE EXCEPTION 'BOUNDARY_DECISION_REQUIRED: protected alias involved'; END IF;
    IF length(btrim(p_rationale)) < 40 THEN RAISE EXCEPTION 'RATIONALE_TOO_SHORT: protected decisions need at least 40 characters'; END IF;
    IF coalesce(p_outcome->>'alias','') <> ALL (gov_stage.protected_ids(p_run)) THEN RAISE EXCEPTION 'BOUNDARY_DECISION: alias must be a protected alias'; END IF;
    PERFORM gov_stage.need_text(p_outcome, 'alias_owner', 'BOUNDARY_DECISION');
    IF coalesce(p_outcome->>'pattern','') NOT IN ('ONE_SCREEN_MULTI_ROUTE','MULTIPLE_SCREENS_SHARED_LEGACY_ID','ONE_SCREEN_VARIANTS','DUPLICATE_CONFLICT') THEN
      RAISE EXCEPTION 'BOUNDARY_DECISION: pattern is required';
    END IF;
    IF jsonb_typeof(p_outcome->'route_assignments') IS DISTINCT FROM 'array' OR jsonb_array_length(p_outcome->'route_assignments') = 0 THEN
      RAISE EXCEPTION 'BOUNDARY_DECISION: route_assignments are required';
    END IF;
  ELSIF p_type = 'BOUNDARY_DECISION' THEN
    RAISE EXCEPTION 'BOUNDARY_DECISION_ONLY_FOR_PROTECTED';
  END IF;

  IF p_type NOT IN ('DUPLICATE_CONFLICT','BOUNDARY_DECISION') AND EXISTS (
      SELECT 1 FROM gov_stage.issue WHERE run_id = p_run AND issue_id = ANY (v_issues) AND evidence->>'match_class' IN ('STRONG','CONFLICT')) THEN
    RAISE EXCEPTION 'EXPLICIT_DUPLICATE_CONFLICT_REQUIRED: STRONG/CONFLICT matches cannot be closed this way';
  END IF;
  IF p_type = 'DUPLICATE_CONFLICT' THEN
    IF array_length(v_issues,1) IS NULL OR EXISTS (SELECT 1 FROM gov_stage.issue WHERE run_id = p_run AND issue_id = ANY (v_issues) AND issue_type NOT IN ('POSSIBLE_DUPLICATE','MATCH_CONFLICT')) THEN
      RAISE EXCEPTION 'DUPLICATE_CONFLICT: must reference duplicate/conflict issues';
    END IF;
    IF coalesce(p_outcome->>'resolution','') NOT IN ('DISTINCT_SCREENS','DUPLICATE') THEN RAISE EXCEPTION 'DUPLICATE_CONFLICT: resolution must be chosen explicitly'; END IF;
  END IF;
  IF p_type = 'EVIDENCE_CLOSURE' THEN
    IF jsonb_array_length(v_co) > 0 OR array_length(coalesce(p_cand_ids,'{}'),1) IS NOT NULL THEN RAISE EXCEPTION 'EVIDENCE_CLOSURE_CANNOT_CHANGE_CANDIDATES'; END IF;
    IF array_length(v_issues,1) IS NULL THEN RAISE EXCEPTION 'EVIDENCE_CLOSURE: issues required'; END IF;
    IF EXISTS (SELECT 1 FROM gov_stage.issue WHERE run_id = p_run AND issue_id = ANY (v_issues) AND (
        issue_type <> 'POSSIBLE_DUPLICATE' OR coalesce(evidence->>'match_class','') <> 'POSSIBLE'
        OR coalesce((evidence->'evidence'->>'SIG-01')::boolean, true) OR coalesce((evidence->'evidence'->>'SIG-02')::boolean, true)
        OR coalesce((evidence->'evidence'->>'SIG-03')::boolean, true))) THEN
      RAISE EXCEPTION 'EVIDENCE_CLOSURE: only POSSIBLE matches without SIG-01/02/03 may be closed in bulk';
    END IF;
    PERFORM gov_stage.need_text(p_outcome, 'filter', 'EVIDENCE_CLOSURE');
    v_hash := encode(sha256(convert_to(array_to_string(array(SELECT unnest(v_issues) ORDER BY 1), ','), 'UTF8')), 'hex');
    IF coalesce(p_outcome->>'pair_hash','') <> v_hash OR coalesce((p_outcome->>'pair_count')::int, -1) <> array_length(v_issues,1) THEN
      RAISE EXCEPTION 'EVIDENCE_CLOSURE: pair_count/pair_hash do not match the selected pairs (expected % / %)', array_length(v_issues,1), v_hash;
    END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM gov_stage.issue WHERE run_id = p_run AND issue_id = ANY (v_issues) AND issue_type = 'COUNT_DISCREPANCY') THEN
    IF p_type <> 'SEM_DECISION' THEN RAISE EXCEPTION 'SEM_DECISION_REQUIRED for COUNT_DISCREPANCY'; END IF;
    v_m00 := p_outcome->'m00';
    IF (v_m00->'register_rows'->>'count')::int IS DISTINCT FROM (v_counts->'m00'->>'register_rows')::int
       OR (v_m00->'stated_count'->>'count')::int IS DISTINCT FROM (v_counts->'m00'->>'sample_stated_count')::int
       OR (v_m00->'structural_entries'->>'count')::int IS DISTINCT FROM (v_counts->'m00'->>'sample_structural_entries')::int THEN
      RAISE EXCEPTION 'SEM-04: register_rows, stated_count and structural_entries must each be referenced with their baseline counts';
    END IF;
    PERFORM gov_stage.need_text(v_m00->'register_rows', 'disposition', 'SEM-04 register_rows');
    PERFORM gov_stage.need_text(v_m00->'stated_count', 'disposition', 'SEM-04 stated_count');
    PERFORM gov_stage.need_text(v_m00->'structural_entries', 'disposition', 'SEM-04 structural_entries');
    IF (SELECT array_agg(x ORDER BY x) FROM jsonb_array_elements_text(coalesce(v_m00->'structural_entries'->'entries','[]'::jsonb)) x)
       IS DISTINCT FROM (SELECT array_agg(screen_id ORDER BY screen_id) FROM gov_stage.m00_sample_entry WHERE run_id = p_run) THEN
      RAISE EXCEPTION 'SEM-04: structural_entries.entries must list each M00 sample entry';
    END IF;
  END IF;
  IF p_type = 'OUTCOME' AND jsonb_array_length(v_co) <> 1 THEN RAISE EXCEPTION 'OUTCOME: exactly one candidate outcome'; END IF;
  FOR co IN SELECT jsonb_array_elements(v_co) LOOP PERFORM gov_stage.check_candidate_outcome(p_run, co); END LOOP;

  IF jsonb_typeof(coalesce(p_evidence_refs,'[]'::jsonb)) <> 'array' OR jsonb_array_length(coalesce(p_evidence_refs,'[]'::jsonb)) = 0 THEN
    RAISE EXCEPTION 'EVIDENCE_REQUIRED';
  END IF;
  FOR v_ref IN SELECT jsonb_array_elements_text(p_evidence_refs) LOOP
    IF v_ref LIKE 'issue:%' THEN
      IF NOT EXISTS (SELECT 1 FROM gov_stage.issue WHERE run_id = p_run AND issue_id = substr(v_ref, 7)) THEN RAISE EXCEPTION 'UNKNOWN_EVIDENCE: %', v_ref; END IF;
      v_nonfigma := v_nonfigma + 1;
    ELSIF v_ref LIKE 'm00:%' THEN
      IF NOT EXISTS (SELECT 1 FROM gov_stage.m00_sample_entry WHERE run_id = p_run AND entry_index::text = substr(v_ref, 5)) THEN RAISE EXCEPTION 'UNKNOWN_EVIDENCE: %', v_ref; END IF;
      v_nonfigma := v_nonfigma + 1;
    ELSE
      IF NOT EXISTS (SELECT 1 FROM gov_stage.source_record WHERE run_id = p_run AND source_record_id = v_ref) THEN RAISE EXCEPTION 'UNKNOWN_EVIDENCE: %', v_ref; END IF;
      IF EXISTS (SELECT 1 FROM gov_stage.source_record WHERE run_id = p_run AND source_record_id = v_ref AND source_id NOT IN ('SRC-12','SRC-13')) THEN v_nonfigma := v_nonfigma + 1; END IF;
    END IF;
  END LOOP;
  IF v_nonfigma = 0 THEN RAISE EXCEPTION 'FIGMA_ONLY_EVIDENCE_REFUSED: Figma evidence cannot establish identity on its own'; END IF;

  IF p_outcome ? 'supersedes' THEN
    v_sup := (p_outcome->>'supersedes')::uuid;
    IF NOT EXISTS (SELECT 1 FROM gov_stage.decision WHERE decision_row_id = v_sup AND run_id = p_run) OR gov_stage.decision_state(v_sup) <> 'APPROVED' THEN
      RAISE EXCEPTION 'SUPERSEDES: target must be an approved decision in this run';
    END IF;
  END IF;
  SELECT d.decision_id INTO v_open FROM gov_stage.decision d
  WHERE d.run_id = p_run AND gov_stage.decision_state(d.decision_row_id) = 'PROPOSED' AND (d.cand_ids && v_all OR d.issue_ids && v_issues) LIMIT 1;
  IF v_open IS NOT NULL THEN RAISE EXCEPTION 'OPEN_PROPOSAL_EXISTS: %', v_open; END IF;

  v_basis := gov_stage.basis_version(p_run, v_all, v_issues);
  v_did := 'DEC-' || lpad(((SELECT count(*) FROM gov_stage.decision WHERE run_id = p_run) + 1)::text, 6, '0');
  INSERT INTO gov_stage.decision(decision_id, run_id, issue_ids, cand_ids, decision_type, outcome, rationale, evidence_refs, state, proposed_by)
  VALUES (v_did, p_run, v_issues, v_all, p_type, coalesce(p_outcome,'{}'::jsonb) || jsonb_build_object('basis_version', v_basis),
          btrim(p_rationale), p_evidence_refs, 'RECORDED', v_uid)
  RETURNING decision_row_id INTO v_row;
  INSERT INTO gov_stage.decision_event(decision_row_id, event_type, actor, rationale, idempotency_key) VALUES (v_row, 'PROPOSED', v_uid, btrim(p_rationale), p_idem);
  PERFORM gov_stage.audit(p_run, v_uid, 'PROPOSE', v_did, jsonb_build_object('type', p_type, 'cand_ids', v_all, 'issue_ids', v_issues, 'protected', v_prot));
  RETURN jsonb_build_object('decision_row_id', v_row, 'decision_id', v_did, 'replay', false);
END $$;

CREATE OR REPLACE FUNCTION public.gov_recon_review(p_decision uuid, p_action text, p_rationale text, p_idem text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = gov_stage, public AS $$
DECLARE v_uid uuid := auth.uid(); d gov_stage.decision%ROWTYPE; v_row uuid; v_actor uuid; v_op uuid; v_status text; co jsonb; v_sup uuid; v_type text;
BEGIN
  IF p_action IS NULL OR p_action NOT IN ('APPROVE','REJECT','WITHDRAW') THEN RAISE EXCEPTION 'INVALID_ACTION'; END IF;
  IF length(btrim(coalesce(p_idem,''))) = 0 THEN RAISE EXCEPTION 'IDEMPOTENCY_KEY_REQUIRED'; END IF;
  PERFORM pg_advisory_xact_lock(771102);
  SELECT decision_row_id, actor INTO v_row, v_actor FROM gov_stage.decision_event WHERE idempotency_key = p_idem;
  IF FOUND THEN
    IF v_actor <> v_uid OR v_row <> p_decision THEN RAISE EXCEPTION 'IDEMPOTENCY_KEY_REUSED'; END IF;
    RETURN jsonb_build_object('decision_row_id', v_row, 'state', gov_stage.decision_state(v_row), 'replay', true);
  END IF;
  SELECT * INTO d FROM gov_stage.decision WHERE decision_row_id = p_decision;
  IF NOT FOUND THEN RAISE EXCEPTION 'UNKNOWN_DECISION'; END IF;
  SELECT operator, status INTO v_op, v_status FROM gov_stage.recon_run WHERE run_id = d.run_id;
  IF v_status = 'FROZEN' THEN RAISE EXCEPTION 'RUN_FROZEN'; END IF;
  IF gov_stage.decision_state(p_decision) <> 'PROPOSED' THEN RAISE EXCEPTION 'NOT_PROPOSED: decision is %', gov_stage.decision_state(p_decision); END IF;
  IF p_action = 'WITHDRAW' THEN
    IF v_uid IS DISTINCT FROM d.proposed_by THEN RAISE EXCEPTION 'SOD_VIOLATION: only the proposer can withdraw'; END IF;
    v_type := 'WITHDRAWN';
  ELSE
    IF NOT gov_stage.has_gov_role(v_uid, 'gov_approver') THEN RAISE EXCEPTION 'FORBIDDEN: gov_approver role required'; END IF;
    IF v_uid = d.proposed_by THEN RAISE EXCEPTION 'SOD_SELF_APPROVAL: the proposer cannot approve or reject'; END IF;
    IF v_uid = v_op THEN RAISE EXCEPTION 'SOD_OPERATOR: the loading operator cannot approve or reject'; END IF;
    IF p_action = 'REJECT' THEN
      IF length(btrim(coalesce(p_rationale,''))) = 0 THEN RAISE EXCEPTION 'RATIONALE_REQUIRED'; END IF;
      v_type := 'REJECTED';
    ELSE
      IF gov_stage.basis_version(d.run_id, d.cand_ids, d.issue_ids) <> (d.outcome->>'basis_version')::bigint THEN
        RAISE EXCEPTION 'STALE_EVIDENCE: related decisions changed after this proposal';
      END IF;
      FOR co IN SELECT jsonb_array_elements(coalesce(d.outcome->'candidate_outcomes','[]'::jsonb)) LOOP PERFORM gov_stage.check_candidate_outcome(d.run_id, co); END LOOP;
      v_type := 'APPROVED';
    END IF;
  END IF;
  INSERT INTO gov_stage.decision_event(decision_row_id, event_type, actor, rationale, idempotency_key) VALUES (p_decision, v_type, v_uid, nullif(btrim(coalesce(p_rationale,'')),''), p_idem);
  IF v_type = 'APPROVED' AND d.outcome ? 'supersedes' THEN
    v_sup := (d.outcome->>'supersedes')::uuid;
    INSERT INTO gov_stage.decision_event(decision_row_id, event_type, actor, rationale) VALUES (v_sup, 'SUPERSEDED', v_uid, 'Superseded by ' || d.decision_id);
  END IF;
  PERFORM gov_stage.audit(d.run_id, v_uid, v_type, d.decision_id, jsonb_build_object('rationale', p_rationale));
  RETURN jsonb_build_object('decision_row_id', p_decision, 'state', v_type, 'replay', false);
END $$;

CREATE OR REPLACE FUNCTION gov_stage.set_payload(p_run uuid)
RETURNS jsonb LANGUAGE sql STABLE SET search_path = gov_stage AS $$
  SELECT coalesce(jsonb_agg(jsonb_build_object('cand_id', c.cand_id, 'terminal', gov_stage.cand_terminal(p_run, c.cand_id) - 'decision_row_id') ORDER BY c.cand_id), '[]'::jsonb)
  FROM gov_stage.candidate c WHERE c.run_id = p_run
$$;

CREATE OR REPLACE FUNCTION public.gov_recon_set(p_run uuid, p_set uuid, p_action text, p_idem text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = gov_stage, public AS $$
DECLARE v_uid uuid := auth.uid(); v_open int; v_block int; v_payload jsonb; v_hash text; s gov_stage.approved_set%ROWTYPE; v_op uuid; v_status text; v_run uuid := p_run;
BEGIN
  PERFORM pg_advisory_xact_lock(771102);
  IF p_action = 'PROPOSE' THEN
    IF NOT (gov_stage.has_gov_role(v_uid, 'gov_reviewer') OR gov_stage.has_gov_role(v_uid, 'gov_approver')) THEN RAISE EXCEPTION 'FORBIDDEN: reviewer role required'; END IF;
  ELSIF p_action = 'FREEZE' THEN
    IF NOT gov_stage.has_gov_role(v_uid, 'gov_approver') THEN RAISE EXCEPTION 'FORBIDDEN: gov_approver role required'; END IF;
    SELECT * INTO s FROM gov_stage.approved_set WHERE set_id = p_set;
    IF NOT FOUND THEN RAISE EXCEPTION 'UNKNOWN_SET'; END IF;
    v_run := s.run_id;
  ELSE RAISE EXCEPTION 'INVALID_ACTION'; END IF;
  SELECT operator, status INTO v_op, v_status FROM gov_stage.recon_run WHERE run_id = v_run;
  IF NOT FOUND THEN RAISE EXCEPTION 'UNKNOWN_RUN'; END IF;
  IF p_action = 'FREEZE' AND s.approved_by IS NOT NULL THEN
    IF s.approved_by <> v_uid THEN RAISE EXCEPTION 'SET_ALREADY_FROZEN'; END IF;
    RETURN jsonb_build_object('set_id', s.set_id, 'set_hash', s.set_hash, 'state', 'FROZEN', 'replay', true);
  END IF;
  IF v_status = 'FROZEN' THEN RAISE EXCEPTION 'RUN_FROZEN'; END IF;
  SELECT count(*) INTO v_open FROM gov_stage.candidate c WHERE c.run_id = v_run AND gov_stage.cand_terminal(v_run, c.cand_id) IS NULL;
  IF v_open > 0 THEN RAISE EXCEPTION 'CANDIDATES_NOT_TERMINAL: %', v_open; END IF;
  SELECT count(*) INTO v_block FROM gov_stage.issue i WHERE i.run_id = v_run AND i.severity = 'Blocking' AND NOT gov_stage.issue_decided(v_run, i.issue_id);
  IF v_block > 0 THEN RAISE EXCEPTION 'BLOCKING_ISSUES_UNDECIDED: %', v_block; END IF;
  v_payload := gov_stage.set_payload(v_run);
  v_hash := encode(sha256(convert_to(v_payload::text, 'UTF8')), 'hex');
  IF p_action = 'PROPOSE' THEN
    SELECT * INTO s FROM gov_stage.approved_set WHERE run_id = v_run AND set_hash = v_hash AND approved_by IS NULL LIMIT 1;
    IF FOUND THEN RETURN jsonb_build_object('set_id', s.set_id, 'set_hash', v_hash, 'state', 'PROPOSED', 'replay', true); END IF;
    INSERT INTO gov_stage.approved_set(run_id, set_hash, proposed_by) VALUES (v_run, v_hash, v_uid) RETURNING * INTO s;
    INSERT INTO gov_stage.approved_set_item(set_id, cand_id, payload)
    SELECT s.set_id, e->>'cand_id', e->'terminal' FROM jsonb_array_elements(v_payload) e;
    PERFORM gov_stage.audit(v_run, v_uid, 'SET_PROPOSE', s.set_id::text, jsonb_build_object('set_hash', v_hash, 'idempotency_key', p_idem));
    RETURN jsonb_build_object('set_id', s.set_id, 'set_hash', v_hash, 'state', 'PROPOSED', 'replay', false);
  END IF;
  IF v_uid = s.proposed_by OR v_uid = v_op THEN RAISE EXCEPTION 'SOD_VIOLATION: set proposer or loading operator cannot freeze'; END IF;
  IF v_hash <> s.set_hash THEN RAISE EXCEPTION 'STALE_SET: decisions changed after the set was proposed'; END IF;
  UPDATE gov_stage.approved_set SET approved_by = v_uid WHERE set_id = s.set_id;
  UPDATE gov_stage.recon_run SET status = 'FROZEN', finished_at = now() WHERE run_id = v_run;
  PERFORM gov_stage.audit(v_run, v_uid, 'SET_FREEZE', s.set_id::text, jsonb_build_object('set_hash', v_hash, 'idempotency_key', p_idem));
  RETURN jsonb_build_object('set_id', s.set_id, 'set_hash', v_hash, 'state', 'FROZEN', 'replay', false);
END $$;

CREATE OR REPLACE FUNCTION public.gov_recon_overview()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = gov_stage, public AS $$
DECLARE v_uid uuid := auth.uid(); r gov_stage.recon_run%ROWTYPE;
BEGIN
  IF NOT gov_stage.has_any_gov_role(v_uid) THEN RAISE EXCEPTION 'FORBIDDEN: governance role required'; END IF;
  SELECT * INTO r FROM gov_stage.recon_run ORDER BY started_at DESC LIMIT 1;
  IF NOT FOUND THEN RETURN jsonb_build_object('run', null); END IF;
  RETURN jsonb_build_object(
    'run', jsonb_build_object('run_id', r.run_id, 'status', r.status, 'snapshot_hash', r.snapshot_hash, 'file_hash', r.snapshot_manifest->>'file_hash',
       'operator', r.operator, 'started_at', r.started_at, 'm00_source_hash', r.snapshot_manifest->>'m00_source_hash'),
    'counts', r.snapshot_manifest->'counts',
    'loaded', jsonb_build_object(
      'records', (SELECT count(*) FROM gov_stage.source_record WHERE run_id = r.run_id),
      'candidates', (SELECT count(*) FROM gov_stage.candidate WHERE run_id = r.run_id),
      'matches', (SELECT count(*) FROM gov_stage.match_result WHERE run_id = r.run_id),
      'issues', (SELECT count(*) FROM gov_stage.issue WHERE run_id = r.run_id)),
    'progress', jsonb_build_object(
      'terminal_candidates', (SELECT count(*) FROM gov_stage.candidate c WHERE c.run_id = r.run_id AND gov_stage.cand_terminal(r.run_id, c.cand_id) IS NOT NULL),
      'decided_issues', (SELECT count(*) FROM gov_stage.issue i WHERE i.run_id = r.run_id AND gov_stage.issue_decided(r.run_id, i.issue_id)),
      'blocking_undecided', (SELECT count(*) FROM gov_stage.issue i WHERE i.run_id = r.run_id AND i.severity = 'Blocking' AND NOT gov_stage.issue_decided(r.run_id, i.issue_id))),
    'decisions', coalesce((SELECT jsonb_object_agg(st, n) FROM (SELECT gov_stage.decision_state(decision_row_id) st, count(*) n FROM gov_stage.decision WHERE run_id = r.run_id GROUP BY 1) x), '{}'::jsonb),
    'protected_aliases', to_jsonb(gov_stage.protected_ids(r.run_id)),
    'm00_samples', coalesce((SELECT jsonb_agg(jsonb_build_object('ref', 'm00:' || entry_index, 'entry_index', entry_index, 'screen_id', screen_id, 'name', name, 'payload', payload, 'source_hash', source_hash) ORDER BY entry_index) FROM gov_stage.m00_sample_entry WHERE run_id = r.run_id), '[]'::jsonb),
    'sets', coalesce((SELECT jsonb_agg(jsonb_build_object('set_id', set_id, 'set_hash', set_hash, 'proposed_by', proposed_by, 'approved_by', approved_by, 'at', frozen_at) ORDER BY frozen_at) FROM gov_stage.approved_set WHERE run_id = r.run_id), '[]'::jsonb),
    'audit_ok', coalesce((SELECT bool_and(ok) FROM (SELECT hash = gov_stage.audit_hash(prev_hash, run_id, actor, action, subject, payload)
        AND prev_hash = coalesce(lag(hash) OVER (ORDER BY seq), 'GENESIS') AS ok FROM gov_stage.audit_event) a), true),
    'audit_events', (SELECT count(*) FROM gov_stage.audit_event));
END $$;

CREATE OR REPLACE FUNCTION public.gov_recon_queue(p_run uuid, p_type text, p_severity text, p_sem text, p_search text, p_limit int, p_offset int)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = gov_stage, public AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF NOT gov_stage.has_any_gov_role(v_uid) THEN RAISE EXCEPTION 'FORBIDDEN: governance role required'; END IF;
  RETURN (
    WITH f AS (
      SELECT i.* FROM gov_stage.issue i WHERE i.run_id = p_run
        AND (p_type IS NULL OR i.issue_type = p_type) AND (p_severity IS NULL OR i.severity = p_severity)
        AND (p_sem IS NULL OR i.sem_ref = p_sem)
        AND (p_search IS NULL OR i.issue_id ILIKE '%' || p_search || '%' OR array_to_string(i.cand_ids, ' ') ILIKE '%' || p_search || '%'
             OR i.evidence::text ILIKE '%' || p_search || '%')
    )
    SELECT jsonb_build_object('total', (SELECT count(*) FROM f),
      'by_type', coalesce((SELECT jsonb_object_agg(issue_type, n) FROM (SELECT issue_type, count(*) n FROM gov_stage.issue WHERE run_id = p_run GROUP BY 1) t), '{}'::jsonb),
      'items', coalesce((SELECT jsonb_agg(x) FROM (
        SELECT jsonb_build_object('issue_id', f.issue_id, 'issue_type', f.issue_type, 'severity', f.severity, 'sem_ref', f.sem_ref,
          'cand_ids', f.cand_ids, 'record_ids', f.record_ids, 'match_class', f.evidence->>'match_class', 'signals', f.evidence->'evidence',
          'evidence', f.evidence, 'decided', gov_stage.issue_decided(p_run, f.issue_id), 'protected', gov_stage.issue_protected(p_run, f.issue_id)) x
        FROM f ORDER BY CASE f.severity WHEN 'Blocking' THEN 0 WHEN 'Review' THEN 1 ELSE 2 END, f.sem_ref NULLS LAST, f.issue_id
        LIMIT least(coalesce(p_limit, 100), 3000) OFFSET coalesce(p_offset, 0)) q), '[]'::jsonb))
  );
END $$;

CREATE OR REPLACE FUNCTION public.gov_recon_candidate(p_run uuid, p_cand text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = gov_stage, public AS $$
DECLARE v_uid uuid := auth.uid(); v_prot boolean; v_ev jsonb;
BEGIN
  IF NOT gov_stage.has_any_gov_role(v_uid) THEN RAISE EXCEPTION 'FORBIDDEN: governance role required'; END IF;
  IF NOT EXISTS (SELECT 1 FROM gov_stage.candidate WHERE run_id = p_run AND cand_id = p_cand) THEN RAISE EXCEPTION 'UNKNOWN_CANDIDATE'; END IF;
  v_prot := gov_stage.cand_protected(p_run, p_cand);
  IF v_prot THEN PERFORM gov_stage.audit(p_run, v_uid, 'VIEW_PROTECTED', p_cand, '{}'::jsonb); END IF;
  SELECT coalesce(jsonb_agg(e->>'record' ORDER BY e->>'record'), '[]'::jsonb) INTO v_ev
  FROM gov_stage.recon_run r, jsonb_array_elements(r.snapshot_manifest->'evidence') e
  WHERE r.run_id = p_run AND e->'cands' ? p_cand;
  RETURN jsonb_build_object(
    'cand_id', p_cand, 'protected', v_prot, 'terminal', gov_stage.cand_terminal(p_run, p_cand),
    'members', coalesce((SELECT jsonb_agg(r.raw_payload ORDER BY r.source_record_id) FROM gov_stage.candidate_member m JOIN gov_stage.source_record r
        ON r.run_id = m.run_id AND r.source_record_id = m.source_record_id WHERE m.run_id = p_run AND m.cand_id = p_cand), '[]'::jsonb),
    'evidence', coalesce((SELECT jsonb_agg(r.raw_payload ORDER BY r.source_record_id) FROM gov_stage.source_record r
        WHERE r.run_id = p_run AND r.source_record_id IN (SELECT jsonb_array_elements_text(v_ev))), '[]'::jsonb),
    'matches', coalesce((SELECT jsonb_agg(jsonb_build_object('cand_a', cand_a, 'cand_b', cand_b, 'class', class, 'signals', signals) ORDER BY class, cand_a, cand_b)
        FROM gov_stage.match_result WHERE run_id = p_run AND (cand_a = p_cand OR cand_b = p_cand) AND class <> 'POSSIBLE'), '[]'::jsonb),
    'possible_match_count', (SELECT count(*) FROM gov_stage.match_result WHERE run_id = p_run AND (cand_a = p_cand OR cand_b = p_cand) AND class = 'POSSIBLE'),
    'issues', coalesce((SELECT jsonb_agg(jsonb_build_object('issue_id', i.issue_id, 'issue_type', i.issue_type, 'severity', i.severity, 'sem_ref', i.sem_ref,
        'match_class', i.evidence->>'match_class', 'cand_ids', i.cand_ids, 'record_ids', i.record_ids, 'evidence', i.evidence,
        'decided', gov_stage.issue_decided(p_run, i.issue_id)) ORDER BY i.issue_id)
        FROM gov_stage.issue i WHERE i.run_id = p_run AND (p_cand = ANY (i.cand_ids) OR i.record_ids && array(SELECT source_record_id FROM gov_stage.candidate_member WHERE run_id = p_run AND cand_id = p_cand))), '[]'::jsonb),
    'decisions', coalesce((SELECT jsonb_agg(jsonb_build_object('decision_row_id', d.decision_row_id, 'decision_id', d.decision_id, 'type', d.decision_type,
        'state', gov_stage.decision_state(d.decision_row_id), 'outcome', d.outcome, 'rationale', d.rationale, 'evidence_refs', d.evidence_refs,
        'proposed_by', d.proposed_by, 'recorded_at', d.recorded_at, 'cand_ids', d.cand_ids, 'issue_ids', d.issue_ids,
        'events', (SELECT jsonb_agg(jsonb_build_object('type', e.event_type, 'actor', e.actor, 'rationale', e.rationale, 'at', e.at) ORDER BY e.event_id) FROM gov_stage.decision_event e WHERE e.decision_row_id = d.decision_row_id))
        ORDER BY d.recorded_at DESC) FROM gov_stage.decision d WHERE d.run_id = p_run AND p_cand = ANY (d.cand_ids)), '[]'::jsonb),
    'm00_samples', CASE WHEN EXISTS (SELECT 1 FROM gov_stage.candidate_member m WHERE m.run_id = p_run AND m.cand_id = p_cand AND m.source_record_id LIKE 'SRC-01:%')
      THEN coalesce((SELECT jsonb_agg(jsonb_build_object('ref', 'm00:' || entry_index, 'screen_id', screen_id, 'name', name, 'payload', payload) ORDER BY entry_index) FROM gov_stage.m00_sample_entry WHERE run_id = p_run), '[]'::jsonb)
      ELSE '[]'::jsonb END);
END $$;

CREATE OR REPLACE FUNCTION public.gov_recon_decisions(p_run uuid, p_state text, p_issue text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = gov_stage, public AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF NOT gov_stage.has_any_gov_role(v_uid) THEN RAISE EXCEPTION 'FORBIDDEN: governance role required'; END IF;
  RETURN coalesce((SELECT jsonb_agg(x ORDER BY x->>'decision_id' DESC) FROM (
    SELECT jsonb_build_object('decision_row_id', d.decision_row_id, 'decision_id', d.decision_id, 'type', d.decision_type,
      'state', gov_stage.decision_state(d.decision_row_id), 'outcome', d.outcome, 'rationale', d.rationale, 'evidence_refs', d.evidence_refs,
      'proposed_by', d.proposed_by, 'recorded_at', d.recorded_at, 'cand_ids', d.cand_ids, 'issue_ids', d.issue_ids) x
    FROM gov_stage.decision d WHERE d.run_id = p_run
      AND (p_state IS NULL OR gov_stage.decision_state(d.decision_row_id) = p_state)
      AND (p_issue IS NULL OR p_issue = ANY (d.issue_ids))) q), '[]'::jsonb);
END $$;

REVOKE ALL ON FUNCTION public.gov_recon_me() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gov_recon_load(jsonb, text, jsonb, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gov_recon_propose(uuid, text, text[], text[], jsonb, text, jsonb, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gov_recon_review(uuid, text, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gov_recon_set(uuid, uuid, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gov_recon_overview() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gov_recon_queue(uuid, text, text, text, text, int, int) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gov_recon_candidate(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.gov_recon_decisions(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gov_recon_me(), public.gov_recon_load(jsonb, text, jsonb, text),
  public.gov_recon_propose(uuid, text, text[], text[], jsonb, text, jsonb, text), public.gov_recon_review(uuid, text, text, text),
  public.gov_recon_set(uuid, uuid, text, text), public.gov_recon_overview(), public.gov_recon_queue(uuid, text, text, text, text, int, int),
  public.gov_recon_candidate(uuid, text), public.gov_recon_decisions(uuid, text, text) TO authenticated;
