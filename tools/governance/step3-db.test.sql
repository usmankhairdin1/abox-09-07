-- Step 3 database acceptance tests (§15). Self-contained and non-persistent:
-- everything runs inside one DO block that ALWAYS ends by raising, so every
-- row it creates (synthetic run, test roles, decisions) is rolled back.
-- Read the result from the raised message: "STEP3_DB_TESTS: <pass>/<total> passed; failures: ...".
CREATE OR REPLACE FUNCTION pg_temp.expect_err(p_sql text, p_pattern text) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE p_sql;
  RETURN 'NO_ERROR (expected ' || p_pattern || ')';
EXCEPTION WHEN OTHERS THEN
  IF SQLERRM LIKE '%' || p_pattern || '%' THEN RETURN NULL; END IF;
  RETURN 'WRONG_ERROR: ' || SQLERRM || ' (expected ' || p_pattern || ')';
END $$;

DO $test$
DECLARE
  u_op uuid := '00000000-0000-4000-8000-0000000000a1';
  u_rev uuid := '00000000-0000-4000-8000-0000000000a2';
  u_app uuid := '00000000-0000-4000-8000-0000000000a3';
  u_none uuid := '00000000-0000-4000-8000-0000000000a4';
  v_run uuid; r jsonb; r2 jsonb; v_dec uuid; v_dec2 uuid; v_hash text; v_members_before int; v_members_after int;
  total int := 0; passed int := 0; fails text[] := '{}'; res text; t text;
BEGIN
  -- test identities (rolled back)
  INSERT INTO gov_stage.gov_role VALUES (u_op, 'gov_operator', now()), (u_rev, 'gov_reviewer', now()), (u_rev, 'gov_approver', now()), (u_app, 'gov_approver', now());
  -- synthetic run (no pinned hash; inserted directly, rolled back)
  INSERT INTO gov_stage.recon_run(snapshot_manifest, snapshot_hash, status, operator)
  VALUES (jsonb_build_object('counts', jsonb_build_object('m00', jsonb_build_object('register_rows', 34, 'sample_stated_count', 52, 'sample_structural_entries', 3)), 'evidence', '[]'::jsonb),
          'TEST-SNAPSHOT-' || gen_random_uuid(), 'LOADED', u_op) RETURNING run_id INTO v_run;
  INSERT INTO gov_stage.source_record(source_record_id, run_id, source_id, source_path, source_hash, record_locator, norm_id, alias_kind, norm_route, screen_defining, raw_payload) VALUES
    ('R1', v_run, 'SRC-08', 'x', 't', 'R1', 'UX-009', 'UX', '/plans', true, '{}'),
    ('R2', v_run, 'SRC-04', 'x', 't', 'R2', 'SCR-M06-003', 'SCR_MODULE', '/agency/agent-profile', true, '{}'),
    ('R3', v_run, 'SRC-04', 'x', 't', 'R3', 'SCR-M06-004', 'SCR_MODULE', '/agency/agency-profile', true, '{}'),
    ('R4', v_run, 'SRC-01', 'x', 't', 'R4', 'SCR_X', 'SCR_LEGACY', null, true, '{}'),
    ('R5', v_run, 'SRC-11', 'x', 't', 'R5', null, null, '/a', true, '{}'),
    ('R6', v_run, 'SRC-11', 'x', 't', 'R6', null, null, '/b', true, '{}'),
    ('R7', v_run, 'SRC-11', 'x', 't', 'R7', null, null, '/c', true, '{}'),
    ('F1', v_run, 'SRC-12', 'x', 't', 'F1', null, null, '/a', false, '{}');
  INSERT INTO gov_stage.alias_observation VALUES (v_run, 'UX-009', 'UX', 'R1', true);
  INSERT INTO gov_stage.candidate(run_id, cand_id) VALUES (v_run,'C1'),(v_run,'C2'),(v_run,'C3'),(v_run,'C4'),(v_run,'C5'),(v_run,'C6'),(v_run,'C7');
  INSERT INTO gov_stage.candidate_member VALUES (v_run,'C1','R1','MEMBER','T'),(v_run,'C2','R2','MEMBER','T'),(v_run,'C3','R3','MEMBER','T'),
    (v_run,'C4','R4','MEMBER','T'),(v_run,'C5','R5','MEMBER','T'),(v_run,'C6','R6','MEMBER','T'),(v_run,'C7','R7','MEMBER','T');
  INSERT INTO gov_stage.issue(run_id, issue_id, issue_type, severity, cand_ids, record_ids, sem_ref, evidence) VALUES
    (v_run, 'I1', 'SHARED_ALIAS', 'Blocking', '{C1}', '{}', 'SEM-02', '{"alias":"UX-009"}'),
    (v_run, 'I2', 'POSSIBLE_DUPLICATE', 'Review', '{C2,C3}', '{}', 'SEM-05', '{"match_class":"STRONG","evidence":{"SIG-01":false,"SIG-02":false,"SIG-03":false,"SIG-04":true}}'),
    (v_run, 'I3', 'POSSIBLE_DUPLICATE', 'Review', '{C5,C6}', '{}', 'SEM-05', '{"match_class":"POSSIBLE","evidence":{"SIG-01":false,"SIG-02":false,"SIG-03":false,"SIG-08":true,"SIG-09":true}}'),
    (v_run, 'I4', 'COUNT_DISCREPANCY', 'Review', '{}', '{}', 'SEM-04', '{}'),
    (v_run, 'I5', 'POSSIBLE_DUPLICATE', 'Review', '{C5,C7}', '{}', 'SEM-05', '{"match_class":"POSSIBLE","evidence":{"SIG-01":false,"SIG-02":false,"SIG-03":true}}');
  INSERT INTO gov_stage.m00_sample_entry VALUES (v_run,0,'SCR_PLATFORM_HOME','Platform Foundation Home','{}','h'),(v_run,1,'SCR_AUDIT_LOG','Audit Log','{}','h'),(v_run,2,'SCR_ACL_MATRIX','ACL Matrix','{}','h');
  SELECT count(*) INTO v_members_before FROM gov_stage.candidate_member WHERE run_id = v_run;

  -- T10: no governance role → forbidden (anonymous has no EXECUTE at all)
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_none, 'role', 'authenticated')::text, true);
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_overview()$$), 'FORBIDDEN'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T10a ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'OUTCOME','{C5}','{}','{"candidate_outcomes":[{"cand_id":"C5","outcome":"DEFERRED","reason":"r","owner":"o"}]}','why','["R5"]','k-none')$$, v_run), 'FORBIDDEN'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T10b ' || res); END IF;
  total := total + 1; IF NOT has_function_privilege('anon', 'public.gov_recon_overview()', 'EXECUTE') AND NOT has_schema_privilege('authenticated', 'gov_stage', 'USAGE') AND NOT has_schema_privilege('anon', 'gov_stage', 'USAGE') THEN passed := passed + 1; ELSE fails := fails || 'T10c anon/authenticated can reach gov_stage'::text; END IF;

  -- T1: loader refuses a non-baseline hash
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_op, 'role', 'authenticated')::text, true);
  total := total + 1; res := pg_temp.expect_err($$SELECT public.gov_recon_load('{"meta":{"snapshot_hash":"x"}}'::jsonb, 'deadbeef', '[]'::jsonb, 'h')$$, 'BASELINE_HASH_MISMATCH'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T1a ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err($$SELECT public.gov_recon_load('{"meta":{"snapshot_hash":"x"}}'::jsonb, 'f7bdf608d1f5de6f4537450cb5ca4253d41f3fcc472189dbd6edf3ba1d3e8f7d', '[]'::jsonb, 'h')$$, 'SNAPSHOT_HASH_MISMATCH'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T1b ' || res); END IF;

  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_rev, 'role', 'authenticated')::text, true);
  -- T4: protected alias rules
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'OUTCOME','{C1}','{}','{"candidate_outcomes":[{"cand_id":"C1","outcome":"DEFERRED","reason":"r","owner":"o"}]}','auto accept attempt','["R1"]','k-p1')$$, v_run), 'BOUNDARY_DECISION_REQUIRED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T4a ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'EVIDENCE_CLOSURE','{}','{I1}','{"filter":"x","pair_count":1,"pair_hash":"x"}','bulk','["issue:I1"]','k-p2')$$, v_run), 'PROTECTED_BULK_CLOSURE_REFUSED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T4b ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'BOUNDARY_DECISION','{C1}','{I1}','{"alias":"UX-009","alias_owner":"C1","pattern":"ONE_SCREEN_VARIANTS","route_assignments":[{"route":"/plans","cand_id":"C1"}]}','too short','["R1"]','k-p3')$$, v_run), 'RATIONALE_TOO_SHORT'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T4c ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'BOUNDARY_DECISION','{C1}','{I1}','{"alias":"UX-009","alias_owner":"C1","route_assignments":[{"route":"/plans"}]}','A sufficiently long human rationale for the boundary.','["R1"]','k-p4')$$, v_run), 'pattern is required'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T4d ' || res); END IF;
  r := public.gov_recon_propose(v_run, 'BOUNDARY_DECISION', '{C1}', '{I1}',
    '{"alias":"UX-009","alias_owner":"C1","pattern":"ONE_SCREEN_VARIANTS","route_assignments":[{"route":"/plans","cand_id":"C1"}],"candidate_outcomes":[{"cand_id":"C1","outcome":"APPROVED_SCREEN","classification":"EXISTING","name":"Plans","owner_module":"M01","primary_route":"/plans","record_ids":["R1"]}]}',
    'A sufficiently long human rationale for the boundary decision.', '["R1"]', 'k-p5');
  v_dec := (r->>'decision_row_id')::uuid;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_review(%L,'APPROVE',null,'k-a1')$$, v_dec), 'SOD_SELF_APPROVAL'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T3a/T4e ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$INSERT INTO gov_stage.decision_event(decision_row_id, event_type, actor) VALUES (%L,'APPROVED',%L)$$, v_dec, u_rev), 'SOD_VIOLATION'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T3b ' || res); END IF;
  total := total + 1; IF gov_stage.cand_terminal(v_run, 'C1') IS NULL THEN passed := passed + 1; ELSE fails := fails || 'T4f protected candidate terminal before approval'::text; END IF;
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_op, 'role', 'authenticated')::text, true);
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_review(%L,'APPROVE',null,'k-a2')$$, v_dec), 'FORBIDDEN'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T3c ' || res); END IF;
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_app, 'role', 'authenticated')::text, true);
  r := public.gov_recon_review(v_dec, 'APPROVE', null, 'k-a3');
  total := total + 1; IF r->>'state' = 'APPROVED' AND gov_stage.cand_terminal(v_run, 'C1')->>'outcome' = 'APPROVED_SCREEN' THEN passed := passed + 1; ELSE fails := fails || ('T4g ' || r::text); END IF;
  -- T8: idempotent replay of an approval
  r := public.gov_recon_review(v_dec, 'APPROVE', null, 'k-a3');
  total := total + 1; IF (r->>'replay')::boolean THEN passed := passed + 1; ELSE fails := fails || 'T8a approval replay'::text; END IF;

  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_rev, 'role', 'authenticated')::text, true);
  -- T5: M06-003/004 STRONG needs its own explicit decision
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'EVIDENCE_CLOSURE','{}','{I2}','{"filter":"x","pair_count":1,"pair_hash":"x"}','bulk','["issue:I2"]','k-m1')$$, v_run), 'EXPLICIT_DUPLICATE_CONFLICT_REQUIRED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T5a ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'ISSUE_RESOLUTION','{}','{I2}','{"resolution":"x"}','close','["issue:I2"]','k-m2')$$, v_run), 'EXPLICIT_DUPLICATE_CONFLICT_REQUIRED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T5b ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'DUPLICATE_CONFLICT','{C2,C3}','{I2}','{}','no resolution chosen','["R2","R3"]','k-m3')$$, v_run), 'resolution must be chosen explicitly'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T5c ' || res); END IF;

  -- T6: SEM-04 keeps 34 / 52 / 3 separate
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'ISSUE_RESOLUTION','{}','{I4}','{}','resolve','["issue:I4"]','k-s1')$$, v_run), 'SEM_DECISION_REQUIRED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T6a ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'SEM_DECISION','{}','{I4}','{"m00":{"register_rows":{"count":34,"disposition":"a"},"stated_count":{"count":89,"disposition":"b"},"structural_entries":{"count":3,"disposition":"c","entries":["SCR_PLATFORM_HOME","SCR_AUDIT_LOG","SCR_ACL_MATRIX"]}}}','summed','["issue:I4"]','k-s2')$$, v_run), 'SEM-04'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T6b ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'SEM_DECISION','{}','{I4}','{"m00":{"register_rows":{"count":34,"disposition":"a"},"stated_count":{"count":52,"disposition":"b"},"structural_entries":{"count":3,"disposition":"c","entries":["SCR_PLATFORM_HOME"]}}}','partial','["issue:I4"]','k-s3')$$, v_run), 'each M00 sample entry'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T6c ' || res); END IF;
  r := public.gov_recon_propose(v_run, 'SEM_DECISION', '{}', '{I4}', '{"m00":{"register_rows":{"count":34,"disposition":"a"},"stated_count":{"count":52,"disposition":"b"},"structural_entries":{"count":3,"disposition":"c","entries":["SCR_PLATFORM_HOME","SCR_AUDIT_LOG","SCR_ACL_MATRIX"]}}}', 'separate', '["issue:I4","m00:0","m00:1","m00:2"]', 'k-s4');
  total := total + 1; IF r ? 'decision_row_id' THEN passed := passed + 1; ELSE fails := fails || 'T6d'::text; END IF;

  -- T7: Figma evidence alone cannot establish identity
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'OUTCOME','{C5}','{}','{"candidate_outcomes":[{"cand_id":"C5","outcome":"DEFERRED","reason":"r","owner":"o"}]}','figma only','["F1"]','k-f1')$$, v_run), 'FIGMA_ONLY_EVIDENCE_REFUSED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T7a ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'OUTCOME','{C5}','{}','{"candidate_outcomes":[{"cand_id":"C5","outcome":"APPROVED_SCREEN","classification":"NEW","name":"A","owner_module":"M01","primary_route":"/a","record_ids":["F1"]}]}','figma record','["R5"]','k-f2')$$, v_run), 'FIGMA_OR_FOREIGN_RECORD_REFUSED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T7b ' || res); END IF;

  -- T13: EXISTING/NEW only required for identity outcomes
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'OUTCOME','{C5}','{}','{"candidate_outcomes":[{"cand_id":"C5","outcome":"APPROVED_SCREEN","name":"A","owner_module":"M01","primary_route":"/a","record_ids":["R5"]}]}','no class','["R5"]','k-c1')$$, v_run), 'CLASSIFICATION_REQUIRED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T13a ' || res); END IF;
  r := public.gov_recon_propose(v_run, 'OUTCOME', '{C4}', '{}', '{"candidate_outcomes":[{"cand_id":"C4","outcome":"DEFERRED","reason":"awaiting route","owner":"M00"}]}', 'defer', '["R4"]', 'k-c2');
  total := total + 1; IF r ? 'decision_row_id' THEN passed := passed + 1; ELSE fails := fails || 'T13b DEFERRED without classification'::text; END IF;
  r := public.gov_recon_propose(v_run, 'OUTCOME', '{C7}', '{}', '{"candidate_outcomes":[{"cand_id":"C7","outcome":"NOT_A_SCREEN","reason_code":"LAYOUT"}]}', 'layout', '["R7"]', 'k-c3');
  v_dec2 := (r->>'decision_row_id')::uuid;
  total := total + 1; IF r ? 'decision_row_id' THEN passed := passed + 1; ELSE fails := fails || 'T13c NOT_A_SCREEN without classification'::text; END IF;

  -- T8: idempotency and one open proposal per subject
  r2 := public.gov_recon_propose(v_run, 'OUTCOME', '{C7}', '{}', '{"candidate_outcomes":[{"cand_id":"C7","outcome":"NOT_A_SCREEN","reason_code":"LAYOUT"}]}', 'layout', '["R7"]', 'k-c3');
  total := total + 1; IF (r2->>'replay')::boolean AND r2->>'decision_row_id' = r->>'decision_row_id' THEN passed := passed + 1; ELSE fails := fails || 'T8b propose replay'::text; END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'OUTCOME','{C7}','{}','{"candidate_outcomes":[{"cand_id":"C7","outcome":"DEFERRED","reason":"r","owner":"o"}]}','second','["R7"]','k-c4')$$, v_run), 'OPEN_PROPOSAL_EXISTS'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T8c ' || res); END IF;
  -- stale evidence: an approval lands on the same candidate after the proposal (simulated concurrent writer)
  INSERT INTO gov_stage.decision(decision_id, run_id, cand_ids, decision_type, outcome, rationale, state, proposed_by)
    VALUES ('DEC-X', v_run, '{C7}', 'ISSUE_RESOLUTION', '{}', 'concurrent', 'RECORDED', u_app) RETURNING decision_row_id INTO v_dec;
  INSERT INTO gov_stage.decision_event(decision_row_id, event_type, actor) VALUES (v_dec, 'PROPOSED', u_app), (v_dec, 'APPROVED', u_rev);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_app, 'role', 'authenticated')::text, true);
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_review(%L,'APPROVE',null,'k-a4')$$, v_dec2), 'STALE_EVIDENCE'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T8d ' || res); END IF;

  -- merge chain refusal
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_rev, 'role', 'authenticated')::text, true);
  r := public.gov_recon_propose(v_run, 'OUTCOME', '{C6}', '{}', '{"candidate_outcomes":[{"cand_id":"C6","outcome":"MERGED_INTO","classification":"NEW","target":"C1"}]}', 'merge', '["R6"]', 'k-g1');
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_app, 'role', 'authenticated')::text, true);
  PERFORM public.gov_recon_review((r->>'decision_row_id')::uuid, 'APPROVE', null, 'k-g2');
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_rev, 'role', 'authenticated')::text, true);
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'OUTCOME','{C5}','{}','{"candidate_outcomes":[{"cand_id":"C5","outcome":"MERGED_INTO","classification":"NEW","target":"C6"}]}','chain','["R5"]','k-g3')$$, v_run), 'MERGE_CHAIN_REFUSED'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T8e ' || res); END IF;

  -- T15: POSSIBLE bulk closure is evidence-only
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'EVIDENCE_CLOSURE','{}','{I5}','{"filter":"x","pair_count":1,"pair_hash":"x"}','bulk','["issue:I5"]','k-b1')$$, v_run), 'without SIG-01/02/03'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T15a ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'EVIDENCE_CLOSURE','{C5}','{I3}','{"filter":"x","pair_count":1,"pair_hash":"x"}','bulk','["issue:I3"]','k-b2')$$, v_run), 'EVIDENCE_CLOSURE_CANNOT_CHANGE_CANDIDATES'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T15b ' || res); END IF;
  v_hash := encode(sha256(convert_to('I3', 'UTF8')), 'hex');
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_propose(%L,'EVIDENCE_CLOSURE','{}','{I3}','{"filter":"SIG-08+09 only","pair_count":1,"pair_hash":"wrong"}','bulk','["issue:I3"]','k-b3')$$, v_run), 'pair_hash'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T15c ' || res); END IF;
  r := public.gov_recon_propose(v_run, 'EVIDENCE_CLOSURE', '{}', '{I3}', jsonb_build_object('filter', 'SIG-08+09 only', 'pair_count', 1, 'pair_hash', v_hash), 'template-only overlap', '["issue:I3"]', 'k-b4');
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_app, 'role', 'authenticated')::text, true);
  PERFORM public.gov_recon_review((r->>'decision_row_id')::uuid, 'APPROVE', null, 'k-b5');
  SELECT count(*) INTO v_members_after FROM gov_stage.candidate_member WHERE run_id = v_run;
  total := total + 1; IF v_members_after = v_members_before AND gov_stage.issue_decided(v_run, 'I3') AND gov_stage.cand_terminal(v_run, 'C5') IS NULL THEN passed := passed + 1; ELSE fails := fails || 'T15d closure changed membership/outcomes'::text; END IF;

  -- T9: append-only baseline, decisions, events and audit; audit chain verifies
  total := total + 1; res := pg_temp.expect_err(format($$UPDATE gov_stage.source_record SET raw_name = 'x' WHERE run_id = %L$$, v_run), 'append-only'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T9a ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$DELETE FROM gov_stage.decision WHERE run_id = %L$$, v_run), 'append-only'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T9b ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err($$DELETE FROM gov_stage.decision_event$$, 'append-only'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T9c ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err($$UPDATE gov_stage.audit_event SET action = 'x'$$, 'append-only'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T9d ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$DELETE FROM gov_stage.candidate_member WHERE run_id = %L$$, v_run), 'append-only'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T9e ' || res); END IF;
  total := total + 1; res := pg_temp.expect_err(format($$UPDATE gov_stage.recon_run SET snapshot_hash = 'x' WHERE run_id = %L$$, v_run), 'immutable'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T9f ' || res); END IF;
  total := total + 1; IF (SELECT bool_and(ok) FROM (SELECT hash = gov_stage.audit_hash(prev_hash, run_id, actor, action, subject, payload)
      AND prev_hash = coalesce(lag(hash) OVER (ORDER BY seq), 'GENESIS') AS ok FROM gov_stage.audit_event) a)
      AND (SELECT count(*) FROM gov_stage.audit_event WHERE run_id = v_run) >= 5 THEN passed := passed + 1; ELSE fails := fails || 'T9g audit chain'::text; END IF;

  -- T11: approved set requires all candidates terminal
  PERFORM set_config('request.jwt.claims', json_build_object('sub', u_rev, 'role', 'authenticated')::text, true);
  total := total + 1; res := pg_temp.expect_err(format($$SELECT public.gov_recon_set(%L,null,'PROPOSE','k-set1')$$, v_run), 'CANDIDATES_NOT_TERMINAL'); IF res IS NULL THEN passed := passed + 1; ELSE fails := fails || ('T11a ' || res); END IF;

  -- no GSID / registry / ledger objects exist
  total := total + 1; IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name ~* '(gsid|registry|ledger)' AND table_schema IN ('gov_stage','public')) THEN passed := passed + 1; ELSE fails := fails || 'GSID/registry/ledger table exists'::text; END IF;

  RAISE EXCEPTION 'STEP3_DB_TESTS: %/% passed; failures: %', passed, total, CASE WHEN array_length(fails,1) IS NULL THEN 'none' ELSE array_to_string(fails, ' | ') END;
END $test$;
