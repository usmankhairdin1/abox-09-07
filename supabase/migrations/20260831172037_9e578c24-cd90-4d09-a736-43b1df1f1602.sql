CREATE OR REPLACE FUNCTION lucie_m06.emit(
  p_event_name text, p_aggregate_type text, p_aggregate_id text,
  p_tenant_id uuid, p_payload jsonb, p_actor uuid, p_correlation uuid DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = lucie_m06, public AS $fn$
DECLARE v_id uuid;
BEGIN
  INSERT INTO lucie_m06.event_outbox (event_name, tenant_id, aggregate_type, aggregate_id, payload, actor_id, correlation_id)
  VALUES (p_event_name, p_tenant_id, p_aggregate_type, p_aggregate_id, COALESCE(p_payload,'{}'::jsonb), p_actor, p_correlation)
  RETURNING event_id INTO v_id;
  RETURN v_id;
END;
$fn$;

CREATE TABLE IF NOT EXISTS lucie_m06.permission_grant (
  grant_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  organization_id uuid,
  user_id uuid NOT NULL,
  permission text NOT NULL,
  scope_type text NOT NULL DEFAULT 'ORGANIZATION',
  granted_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_pg_scope CHECK (lucie_m06.is_enum('ScopeType', scope_type))
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_perm_grant ON lucie_m06.permission_grant (tenant_id, COALESCE(organization_id,'00000000-0000-0000-0000-000000000000'::uuid), user_id, permission);
ALTER TABLE lucie_m06.permission_grant ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucie_m06.permission_grant FORCE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION lucie_m06.has_permission(
  p_user uuid, p_tenant uuid, p_org uuid, p_permission text, p_is_platform_admin boolean)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = lucie_m06, public AS $fn$
  SELECT COALESCE(p_is_platform_admin, false) OR EXISTS (
    SELECT 1 FROM lucie_m06.permission_grant g
     WHERE g.user_id = p_user
       AND g.tenant_id = p_tenant
       AND g.permission = p_permission
       AND (g.organization_id IS NULL OR g.organization_id = p_org)
  );
$fn$;

CREATE OR REPLACE FUNCTION lucie_m06_api(
  p_op text,
  p_payload jsonb DEFAULT '{}'::jsonb,
  p_user_id uuid DEFAULT NULL,
  p_tenant_id uuid DEFAULT NULL,
  p_organization_id uuid DEFAULT NULL,
  p_is_platform_admin boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = lucie_m06, public AS $fn$
DECLARE
  v_perm text;
  v_result jsonb;
  v_id uuid;
  v_row record;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'UNAUTHENTICATED', 'reason', 'No acting user in request context.');
  END IF;
  IF p_tenant_id IS NULL OR p_organization_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'CONTEXT_AMBIGUOUS',
      'reason', 'Tenant and organization context must both be resolved; ambiguous context is denied.');
  END IF;

  v_perm := CASE
    WHEN p_op LIKE 'workforce.profile.list%' OR p_op LIKE 'workforce.profile.get%' THEN 'workforce.profile.read'
    WHEN p_op = 'workforce.profile.create' THEN 'workforce.profile.create'
    WHEN p_op = 'workforce.profile.update' THEN 'workforce.profile.update'
    WHEN p_op LIKE 'workforce.lifecycle.%' THEN 'workforce.lifecycle.manage'
    WHEN p_op LIKE 'affiliation.%' THEN 'affiliation.manage'
    WHEN p_op LIKE 'group.%' OR p_op LIKE 'membership.%' THEN 'group.manage'
    WHEN p_op LIKE 'availability.%' OR p_op LIKE 'servicescope.%' THEN 'workforce.profile.update'
    WHEN p_op LIKE 'readiness.%' THEN 'workforce.readiness.read'
    WHEN p_op LIKE 'note.%' THEN 'workforce.note.manage'
    WHEN p_op LIKE 'exception.%' THEN 'exception.manage'
    WHEN p_op LIKE 'history.%' THEN 'workforce.profile.read'
    ELSE NULL END;

  IF v_perm IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'UNKNOWN_OPERATION', 'reason', p_op);
  END IF;

  IF NOT lucie_m06.has_permission(p_user_id, p_tenant_id, p_organization_id, v_perm, p_is_platform_admin) THEN
    RETURN jsonb_build_object('ok', false, 'code', 'PERMISSION_DENIED', 'permission', v_perm);
  END IF;

  IF p_op = 'workforce.profile.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(w) ORDER BY w.display_name), '[]'::jsonb) INTO v_result
      FROM lucie_m06.workforce_profile w
     WHERE w.tenant_id = p_tenant_id AND w.organization_id = p_organization_id
       AND (p_payload->>'status' IS NULL OR w.status = p_payload->>'status');
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'workforce.profile.get' THEN
    SELECT to_jsonb(w) INTO v_result FROM lucie_m06.workforce_profile w
     WHERE w.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid
       AND w.tenant_id = p_tenant_id AND w.organization_id = p_organization_id;
    IF v_result IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND');
    END IF;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'workforce.profile.create' THEN
    INSERT INTO lucie_m06.workforce_profile (
      tenant_id, organization_id, person_category, display_name, legal_first_name, legal_last_name,
      work_email, work_phone, npn, captivity, roster_only, created_by, updated_by)
    VALUES (p_tenant_id, p_organization_id,
      COALESCE(p_payload->>'person_category','AGENT'),
      p_payload->>'display_name', p_payload->>'legal_first_name', p_payload->>'legal_last_name',
      p_payload->>'work_email', p_payload->>'work_phone', p_payload->>'npn',
      COALESCE(p_payload->>'captivity','UNSPECIFIED'),
      COALESCE((p_payload->>'roster_only')::boolean, true), p_user_id, p_user_id)
    RETURNING workforce_profile_id INTO v_id;
    PERFORM lucie_m06.emit('m06.workforce_profile.created','WorkforceProfile', v_id::text, p_tenant_id,
      jsonb_build_object('workforce_profile_id', v_id), p_user_id);
    INSERT INTO lucie_m06.readiness_result (tenant_id, workforce_profile_id, reasons)
    VALUES (p_tenant_id, v_id, ARRAY['Readiness not yet evaluated'])
    ON CONFLICT (workforce_profile_id) DO NOTHING;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('workforce_profile_id', v_id));

  ELSIF p_op = 'workforce.profile.update' THEN
    UPDATE lucie_m06.workforce_profile w SET
      display_name = COALESCE(p_payload->>'display_name', w.display_name),
      work_email   = COALESCE(p_payload->>'work_email', w.work_email),
      work_phone   = COALESCE(p_payload->>'work_phone', w.work_phone),
      npn          = COALESCE(p_payload->>'npn', w.npn),
      captivity    = COALESCE(p_payload->>'captivity', w.captivity),
      version      = w.version + 1,
      updated_at   = now(), updated_by = p_user_id
     WHERE w.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid
       AND w.tenant_id = p_tenant_id AND w.organization_id = p_organization_id
     RETURNING w.workforce_profile_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.workforce_profile.updated','WorkforceProfile', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('workforce_profile_id', v_id));

  ELSIF p_op = 'workforce.lifecycle.transition' THEN
    SELECT * INTO v_row FROM lucie_m06.workforce_profile
     WHERE workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid
       AND tenant_id = p_tenant_id AND organization_id = p_organization_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    IF (p_payload->>'action') NOT IN ('ACTIVATE','SUSPEND','REACTIVATE','OFFBOARD') THEN
      RETURN jsonb_build_object('ok', false, 'code', 'INVALID_ACTION');
    END IF;
    IF COALESCE(p_payload->>'reason','') = '' THEN
      RETURN jsonb_build_object('ok', false, 'code', 'REASON_REQUIRED');
    END IF;
    v_result := to_jsonb(CASE p_payload->>'action'
      WHEN 'ACTIVATE' THEN 'ACTIVE' WHEN 'REACTIVATE' THEN 'ACTIVE'
      WHEN 'SUSPEND' THEN 'SUSPENDED' ELSE 'INACTIVE' END);
    UPDATE lucie_m06.workforce_profile
       SET status = v_result #>> '{}', updated_at = now(), updated_by = p_user_id, version = version + 1
     WHERE workforce_profile_id = v_row.workforce_profile_id;
    INSERT INTO lucie_m06.profile_status_history (tenant_id, workforce_profile_id, from_status, to_status, lifecycle_action, reason, actor_id)
    VALUES (p_tenant_id, v_row.workforce_profile_id, v_row.status, v_result #>> '{}', p_payload->>'action', p_payload->>'reason', p_user_id);
    PERFORM lucie_m06.emit('m06.workforce_profile.status_changed','WorkforceProfile', v_row.workforce_profile_id::text, p_tenant_id,
      jsonb_build_object('from', v_row.status, 'to', v_result #>> '{}', 'action', p_payload->>'action'), p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('status', v_result #>> '{}'));

  ELSIF p_op = 'workforce.lifecycle.case.open' THEN
    INSERT INTO lucie_m06.lifecycle_case (tenant_id, organization_id, case_type, workforce_profile_id, status,
      source_organization_id, target_organization_id, scheduled_for, created_by)
    VALUES (p_tenant_id, p_organization_id, p_payload->>'case_type',
      (p_payload->>'workforce_profile_id')::uuid, 'DRAFT',
      NULLIF(p_payload->>'source_organization_id','')::uuid,
      NULLIF(p_payload->>'target_organization_id','')::uuid,
      NULLIF(p_payload->>'scheduled_for','')::date, p_user_id)
    RETURNING case_id INTO v_id;
    PERFORM lucie_m06.emit('m06.lifecycle_case.opened','LifecycleCase', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('case_id', v_id));

  ELSIF p_op = 'workforce.lifecycle.case.complete' THEN
    UPDATE lucie_m06.lifecycle_case SET status = 'COMPLETED', completed_at = now(), updated_at = now()
     WHERE case_id = (p_payload->>'case_id')::uuid AND tenant_id = p_tenant_id
     RETURNING case_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.lifecycle_case.completed','LifecycleCase', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('case_id', v_id));

  ELSIF p_op = 'workforce.lifecycle.case.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY c.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.lifecycle_case c
     WHERE c.tenant_id = p_tenant_id AND c.organization_id = p_organization_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'affiliation.create' THEN
    INSERT INTO lucie_m06.agency_affiliation (tenant_id, workforce_profile_id, organization_id, status, captivity, is_primary, created_by)
    VALUES (p_tenant_id, (p_payload->>'workforce_profile_id')::uuid,
      COALESCE(NULLIF(p_payload->>'organization_id','')::uuid, p_organization_id),
      COALESCE(p_payload->>'status','ACTIVE'), COALESCE(p_payload->>'captivity','UNSPECIFIED'),
      COALESCE((p_payload->>'is_primary')::boolean, false), p_user_id)
    RETURNING affiliation_id INTO v_id;
    PERFORM lucie_m06.emit('m06.affiliation.created','AgencyAffiliation', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('affiliation_id', v_id));

  ELSIF p_op = 'affiliation.end' THEN
    UPDATE lucie_m06.agency_affiliation
       SET status = 'ENDED', effective_to = COALESCE(NULLIF(p_payload->>'effective_to','')::date, current_date)
     WHERE affiliation_id = (p_payload->>'affiliation_id')::uuid AND tenant_id = p_tenant_id
     RETURNING affiliation_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.affiliation.ended','AgencyAffiliation', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('affiliation_id', v_id));

  ELSIF p_op = 'affiliation.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(a) ORDER BY a.effective_from DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.agency_affiliation a
     WHERE a.tenant_id = p_tenant_id
       AND (p_payload->>'workforce_profile_id' IS NULL
            OR a.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'group.create' THEN
    INSERT INTO lucie_m06.workforce_group (tenant_id, organization_id, group_type, name, description, parent_group_id)
    VALUES (p_tenant_id, p_organization_id, COALESCE(p_payload->>'group_type','TEAM'),
      p_payload->>'name', p_payload->>'description', NULLIF(p_payload->>'parent_group_id','')::uuid)
    RETURNING group_id INTO v_id;
    PERFORM lucie_m06.emit('m06.group.created','WorkforceGroup', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('group_id', v_id));

  ELSIF p_op = 'group.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(g) ORDER BY g.group_type, g.name), '[]'::jsonb) INTO v_result
      FROM lucie_m06.workforce_group g
     WHERE g.tenant_id = p_tenant_id AND g.organization_id = p_organization_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'membership.add' THEN
    INSERT INTO lucie_m06.group_membership (tenant_id, group_id, workforce_profile_id, group_type, is_lead)
    SELECT p_tenant_id, g.group_id, (p_payload->>'workforce_profile_id')::uuid, g.group_type,
           COALESCE((p_payload->>'is_lead')::boolean, false)
      FROM lucie_m06.workforce_group g
     WHERE g.group_id = (p_payload->>'group_id')::uuid AND g.tenant_id = p_tenant_id
    ON CONFLICT DO NOTHING
    RETURNING membership_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_APPLIED'); END IF;
    PERFORM lucie_m06.emit('m06.group_membership.added','GroupMembership', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('membership_id', v_id));

  ELSIF p_op = 'availability.declare' THEN
    INSERT INTO lucie_m06.availability_declaration (tenant_id, workforce_profile_id, availability, note, declared_by)
    VALUES (p_tenant_id, (p_payload->>'workforce_profile_id')::uuid,
      COALESCE(p_payload->>'availability','AVAILABLE'), p_payload->>'note', p_user_id)
    RETURNING availability_id INTO v_id;
    PERFORM lucie_m06.emit('m06.availability.declared','AvailabilityDeclaration', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('availability_id', v_id));

  ELSIF p_op = 'servicescope.set' THEN
    INSERT INTO lucie_m06.service_scope (tenant_id, workforce_profile_id, state_code, product_lines)
    VALUES (p_tenant_id, (p_payload->>'workforce_profile_id')::uuid, upper(p_payload->>'state_code'),
      COALESCE(ARRAY(SELECT jsonb_array_elements_text(COALESCE(p_payload->'product_lines','[]'::jsonb))), '{}'))
    ON CONFLICT (workforce_profile_id, state_code) DO UPDATE
      SET product_lines = EXCLUDED.product_lines, status = 'ACTIVE'
    RETURNING service_scope_id INTO v_id;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('service_scope_id', v_id));

  ELSIF p_op = 'readiness.evaluate' THEN
    SELECT * INTO v_row FROM lucie_m06.workforce_profile
     WHERE workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid
       AND tenant_id = p_tenant_id AND organization_id = p_organization_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    WITH facts AS (
      SELECT
        v_row.status = 'ACTIVE' AS active,
        v_row.user_account_id IS NOT NULL AS linked,
        EXISTS (SELECT 1 FROM lucie_m06.agency_affiliation a
                 WHERE a.workforce_profile_id = v_row.workforce_profile_id AND a.status = 'ACTIVE') AS affiliated,
        EXISTS (SELECT 1 FROM lucie_m06.service_scope s
                 WHERE s.workforce_profile_id = v_row.workforce_profile_id AND s.status = 'ACTIVE') AS scoped,
        EXISTS (SELECT 1 FROM lucie_m06.m06_exception e
                 WHERE e.subject_id = v_row.workforce_profile_id AND e.status IN ('OPEN','IN_REVIEW')) AS blocked
    )
    INSERT INTO lucie_m06.readiness_result (tenant_id, workforce_profile_id, readiness_state, operational_eligibility, reasons, contributing_sources, owner_freshness_at)
    SELECT p_tenant_id, v_row.workforce_profile_id,
      CASE WHEN f.blocked THEN 'REVIEW_REQUIRED'
           WHEN f.active AND f.affiliated AND f.scoped AND f.linked THEN 'READY'
           WHEN f.active AND f.affiliated THEN 'READY_WITH_LIMITATIONS'
           ELSE 'NOT_READY' END,
      CASE WHEN f.blocked THEN 'REVIEW_REQUIRED'
           WHEN f.active AND f.affiliated THEN 'OPERATIONALLY_ELIGIBLE'
           ELSE 'OPERATIONALLY_INELIGIBLE' END,
      ARRAY_REMOVE(ARRAY[
        CASE WHEN NOT f.active THEN 'Profile is not active' END,
        CASE WHEN NOT f.affiliated THEN 'No active agency affiliation' END,
        CASE WHEN NOT f.scoped THEN 'No active service scope' END,
        CASE WHEN NOT f.linked THEN 'No linked user account (roster-only)' END,
        CASE WHEN f.blocked THEN 'Open exception requires review' END], NULL),
      jsonb_build_object('m00_identity', f.linked, 'm06_affiliation', f.affiliated, 'm06_scope', f.scoped),
      now()
    FROM facts f
    ON CONFLICT (workforce_profile_id) DO UPDATE SET
      readiness_state = EXCLUDED.readiness_state,
      operational_eligibility = EXCLUDED.operational_eligibility,
      reasons = EXCLUDED.reasons,
      contributing_sources = EXCLUDED.contributing_sources,
      owner_freshness_at = EXCLUDED.owner_freshness_at,
      evaluated_at = now();
    SELECT to_jsonb(r) INTO v_result FROM lucie_m06.readiness_result r WHERE r.workforce_profile_id = v_row.workforce_profile_id;
    PERFORM lucie_m06.emit('m06.readiness.evaluated','ReadinessResult', v_row.workforce_profile_id::text, p_tenant_id, v_result, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'readiness.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(r) ORDER BY r.evaluated_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.readiness_result r
      JOIN lucie_m06.workforce_profile w ON w.workforce_profile_id = r.workforce_profile_id
     WHERE r.tenant_id = p_tenant_id AND w.organization_id = p_organization_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'note.add' THEN
    INSERT INTO lucie_m06.workforce_note (tenant_id, workforce_profile_id, audience, body, author_id)
    VALUES (p_tenant_id, (p_payload->>'workforce_profile_id')::uuid,
      COALESCE(p_payload->>'audience','AGENCY_VISIBLE'), p_payload->>'body', p_user_id)
    RETURNING note_id INTO v_id;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('note_id', v_id));

  ELSIF p_op = 'note.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(n) ORDER BY n.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.workforce_note n
     WHERE n.tenant_id = p_tenant_id
       AND n.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid
       AND (n.audience <> 'ME_ONLY' OR n.author_id = p_user_id)
       AND (n.audience <> 'JET_ONLY' OR p_is_platform_admin);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'exception.open' THEN
    INSERT INTO lucie_m06.m06_exception (tenant_id, organization_id, subject_type, subject_id, code, summary, risk_level)
    VALUES (p_tenant_id, p_organization_id, COALESCE(p_payload->>'subject_type','WorkforceProfile'),
      NULLIF(p_payload->>'subject_id','')::uuid, p_payload->>'code', p_payload->>'summary',
      COALESCE(p_payload->>'risk_level','STANDARD'))
    RETURNING exception_id INTO v_id;
    PERFORM lucie_m06.emit('m06.exception.opened','M06Exception', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('exception_id', v_id));

  ELSIF p_op = 'exception.resolve' THEN
    UPDATE lucie_m06.m06_exception
       SET status = COALESCE(p_payload->>'status','RESOLVED'),
           resolution_note = p_payload->>'resolution_note', resolved_at = now()
     WHERE exception_id = (p_payload->>'exception_id')::uuid AND tenant_id = p_tenant_id
     RETURNING exception_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.exception.resolved','M06Exception', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('exception_id', v_id));

  ELSIF p_op = 'exception.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(e) ORDER BY e.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.m06_exception e
     WHERE e.tenant_id = p_tenant_id AND (e.organization_id IS NULL OR e.organization_id = p_organization_id);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'history.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(h) ORDER BY h.occurred_at DESC), '[]'::jsonb) INTO v_result
      FROM (SELECT * FROM lucie_m06.history_entry
             WHERE tenant_id = p_tenant_id
               AND (p_payload->>'subject_id' IS NULL OR subject_id = (p_payload->>'subject_id')::uuid)
             ORDER BY occurred_at DESC LIMIT 200) h;
    RETURN jsonb_build_object('ok', true, 'data', v_result);
  END IF;

  RETURN jsonb_build_object('ok', false, 'code', 'UNKNOWN_OPERATION', 'reason', p_op);
END;
$fn$;

REVOKE ALL ON FUNCTION lucie_m06_api(text, jsonb, uuid, uuid, uuid, boolean) FROM public, anon, authenticated;

INSERT INTO lucie_m06.schema_version (version, note)
VALUES ('M06-1.0-V002', 'Governed API entry point, permission grants and server-side enforcement (CCL-M06-002).')
ON CONFLICT DO NOTHING;