-- =====================================================================
-- M06-1.0-V003 : governed operations for the full screen register
--                + realistic sample network data (Local Development)
-- =====================================================================

-- ---------- 1. Extended governed API -------------------------------
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
    WHEN p_op LIKE 'group.%' OR p_op LIKE 'membership.%' OR p_op LIKE 'assignment.%' THEN 'group.manage'
    WHEN p_op LIKE 'availability.%' OR p_op LIKE 'servicescope.%' THEN 'workforce.profile.update'
    WHEN p_op LIKE 'readiness.%' THEN 'workforce.readiness.read'
    WHEN p_op LIKE 'note.%' THEN 'workforce.note.manage'
    WHEN p_op LIKE 'exception.%' THEN 'exception.manage'
    WHEN p_op LIKE 'history.%' THEN 'workforce.profile.read'
    WHEN p_op LIKE 'agency.%' THEN 'agency.profile.manage'
    WHEN p_op LIKE 'task.%' OR p_op LIKE 'document.%' OR p_op LIKE 'notification.%' THEN 'workforce.profile.read'
    WHEN p_op LIKE 'duplicate.%' OR p_op LIKE 'identity.%' THEN 'identity.review.manage'
    WHEN p_op LIKE 'job.%' THEN 'roster.transfer.manage'
    WHEN p_op LIKE 'reconciliation.%' OR p_op LIKE 'outbox.%' THEN 'operations.read'
    WHEN p_op LIKE 'support.%' THEN 'support.context.manage'
    WHEN p_op LIKE 'projection.%' OR p_op LIKE 'access.%' THEN 'access.role.read'
    ELSE NULL END;

  IF v_perm IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'UNKNOWN_OPERATION', 'reason', p_op);
  END IF;

  IF NOT lucie_m06.has_permission(p_user_id, p_tenant_id, p_organization_id, v_perm, p_is_platform_admin) THEN
    RETURN jsonb_build_object('ok', false, 'code', 'PERMISSION_DENIED', 'permission', v_perm);
  END IF;

  -- ============ workforce profile =================================
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
    IF v_result IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
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
      external_reference = COALESCE(p_payload->>'external_reference', w.external_reference),
      invitation_disposition = COALESCE(p_payload->>'invitation_disposition', w.invitation_disposition),
      version      = w.version + 1,
      updated_at   = now(), updated_by = p_user_id
     WHERE w.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid
       AND w.tenant_id = p_tenant_id AND w.organization_id = p_organization_id
     RETURNING w.workforce_profile_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.workforce_profile.updated','WorkforceProfile', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('workforce_profile_id', v_id));

  -- ============ lifecycle =========================================
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
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object(
      'status', v_result #>> '{}',
      'access_revocation', CASE WHEN p_payload->>'action' IN ('SUSPEND','OFFBOARD')
        THEN 'AWAITING_M00_CONFIRMATION' ELSE 'NOT_APPLICABLE' END));

  ELSIF p_op = 'workforce.lifecycle.case.open' THEN
    INSERT INTO lucie_m06.lifecycle_case (tenant_id, organization_id, case_type, workforce_profile_id, status,
      source_organization_id, target_organization_id, scheduled_for, created_by, detail)
    VALUES (p_tenant_id, p_organization_id, p_payload->>'case_type',
      (p_payload->>'workforce_profile_id')::uuid, 'DRAFT',
      NULLIF(p_payload->>'source_organization_id','')::uuid,
      NULLIF(p_payload->>'target_organization_id','')::uuid,
      NULLIF(p_payload->>'scheduled_for','')::date, p_user_id,
      COALESCE(p_payload->'detail','{}'::jsonb))
    RETURNING case_id INTO v_id;
    PERFORM lucie_m06.emit('m06.lifecycle_case.opened','LifecycleCase', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('case_id', v_id));

  ELSIF p_op = 'workforce.lifecycle.case.complete' THEN
    UPDATE lucie_m06.lifecycle_case SET status = 'COMPLETED', completed_at = now(), updated_at = now()
     WHERE case_id = (p_payload->>'case_id')::uuid AND tenant_id = p_tenant_id
       AND cardinality(blocking_reasons) = 0
     RETURNING case_id INTO v_id;
    IF v_id IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'code', 'BLOCKED',
        'reason', 'Case is missing or still carries blocking reasons.');
    END IF;
    PERFORM lucie_m06.emit('m06.lifecycle_case.completed','LifecycleCase', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('case_id', v_id));

  ELSIF p_op = 'workforce.lifecycle.case.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY c.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.lifecycle_case c
     WHERE c.tenant_id = p_tenant_id AND c.organization_id = p_organization_id
       AND (p_payload->>'case_type' IS NULL OR c.case_type = p_payload->>'case_type');
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'workforce.lifecycle.case.get' THEN
    SELECT to_jsonb(c) INTO v_result FROM lucie_m06.lifecycle_case c
     WHERE c.case_id = (p_payload->>'case_id')::uuid AND c.tenant_id = p_tenant_id;
    IF v_result IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'workforce.lifecycle.case.update' THEN
    UPDATE lucie_m06.lifecycle_case c SET
      status = COALESCE(p_payload->>'status', c.status),
      scheduled_for = COALESCE(NULLIF(p_payload->>'scheduled_for','')::date, c.scheduled_for),
      blocking_reasons = CASE WHEN p_payload ? 'blocking_reasons'
        THEN ARRAY(SELECT jsonb_array_elements_text(p_payload->'blocking_reasons')) ELSE c.blocking_reasons END,
      detail = CASE WHEN p_payload ? 'detail' THEN c.detail || (p_payload->'detail') ELSE c.detail END,
      updated_at = now()
     WHERE c.case_id = (p_payload->>'case_id')::uuid AND c.tenant_id = p_tenant_id
     RETURNING c.case_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.lifecycle_case.updated','LifecycleCase', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('case_id', v_id));

  ELSIF p_op = 'workforce.lifecycle.history' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(h) ORDER BY h.occurred_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.profile_status_history h
     WHERE h.tenant_id = p_tenant_id
       AND (p_payload->>'workforce_profile_id' IS NULL
            OR h.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  -- ============ affiliation =======================================
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
    UPDATE lucie_m06.agency_affiliation SET status = 'ENDED', effective_to = current_date, is_primary = false
     WHERE affiliation_id = (p_payload->>'affiliation_id')::uuid AND tenant_id = p_tenant_id
     RETURNING affiliation_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.affiliation.ended','AgencyAffiliation', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('affiliation_id', v_id));

  ELSIF p_op = 'affiliation.correct' THEN
    SELECT to_jsonb(a) INTO v_result FROM lucie_m06.agency_affiliation a
     WHERE a.affiliation_id = (p_payload->>'affiliation_id')::uuid AND a.tenant_id = p_tenant_id;
    IF v_result IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    IF COALESCE(p_payload->>'reason','') = '' THEN
      RETURN jsonb_build_object('ok', false, 'code', 'REASON_REQUIRED');
    END IF;
    UPDATE lucie_m06.agency_affiliation a SET
      captivity = COALESCE(p_payload->>'captivity', a.captivity),
      effective_from = COALESCE(NULLIF(p_payload->>'effective_from','')::date, a.effective_from)
     WHERE a.affiliation_id = (p_payload->>'affiliation_id')::uuid;
    INSERT INTO lucie_m06.affiliation_correction (tenant_id, affiliation_id, reason, before_state, after_state, corrected_by)
    SELECT p_tenant_id, a.affiliation_id, p_payload->>'reason', v_result, to_jsonb(a), p_user_id
      FROM lucie_m06.agency_affiliation a WHERE a.affiliation_id = (p_payload->>'affiliation_id')::uuid
    RETURNING correction_id INTO v_id;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('correction_id', v_id));

  ELSIF p_op = 'affiliation.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(a) ORDER BY a.effective_from DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.agency_affiliation a
     WHERE a.tenant_id = p_tenant_id
       AND (p_payload->>'workforce_profile_id' IS NULL
            OR a.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  -- ============ agency operational profile ========================
  ELSIF p_op = 'agency.profile.get' THEN
    SELECT to_jsonb(a) INTO v_result FROM lucie_m06.agency_operational_profile a
     WHERE a.tenant_id = p_tenant_id AND a.organization_id = p_organization_id;
    RETURN jsonb_build_object('ok', true, 'data', COALESCE(v_result, 'null'::jsonb));

  ELSIF p_op = 'agency.profile.upsert' THEN
    INSERT INTO lucie_m06.agency_operational_profile (tenant_id, organization_id, operating_name, captivity_default, service_states, defaults)
    VALUES (p_tenant_id, p_organization_id, p_payload->>'operating_name',
      COALESCE(p_payload->>'captivity_default','UNSPECIFIED'),
      COALESCE(ARRAY(SELECT jsonb_array_elements_text(COALESCE(p_payload->'service_states','[]'::jsonb))), '{}'),
      COALESCE(p_payload->'defaults','{}'::jsonb))
    ON CONFLICT (organization_id) DO UPDATE SET
      operating_name = COALESCE(EXCLUDED.operating_name, lucie_m06.agency_operational_profile.operating_name),
      captivity_default = EXCLUDED.captivity_default,
      service_states = CASE WHEN cardinality(EXCLUDED.service_states) > 0 THEN EXCLUDED.service_states
                            ELSE lucie_m06.agency_operational_profile.service_states END,
      defaults = lucie_m06.agency_operational_profile.defaults || EXCLUDED.defaults,
      updated_at = now()
    RETURNING agency_operational_profile_id INTO v_id;
    PERFORM lucie_m06.emit('m06.agency_profile.updated','AgencyOperationalProfile', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('agency_operational_profile_id', v_id));

  -- ============ groups ============================================
  ELSIF p_op = 'group.create' THEN
    INSERT INTO lucie_m06.workforce_group (tenant_id, organization_id, group_type, name, description, parent_group_id)
    VALUES (p_tenant_id, p_organization_id, COALESCE(p_payload->>'group_type','TEAM'),
      p_payload->>'name', p_payload->>'description', NULLIF(p_payload->>'parent_group_id','')::uuid)
    RETURNING group_id INTO v_id;
    PERFORM lucie_m06.emit('m06.group.created','WorkforceGroup', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('group_id', v_id));

  ELSIF p_op = 'group.list' THEN
    SELECT COALESCE(jsonb_agg(x ORDER BY x->>'group_type', x->>'name'), '[]'::jsonb) INTO v_result
      FROM (
        SELECT to_jsonb(g) || jsonb_build_object(
                 'member_count', (SELECT count(*) FROM lucie_m06.group_membership m
                                   WHERE m.group_id = g.group_id AND m.effective_to IS NULL)) AS x
          FROM lucie_m06.workforce_group g
         WHERE g.tenant_id = p_tenant_id AND g.organization_id = p_organization_id
           AND (p_payload->>'group_type' IS NULL OR g.group_type = p_payload->>'group_type')
      ) s;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'group.get' THEN
    SELECT to_jsonb(g) INTO v_result FROM lucie_m06.workforce_group g
     WHERE g.group_id = (p_payload->>'group_id')::uuid AND g.tenant_id = p_tenant_id;
    IF v_result IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', v_result ||
      jsonb_build_object('members', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'membership_id', m.membership_id, 'workforce_profile_id', w.workforce_profile_id,
                 'display_name', w.display_name, 'person_category', w.person_category,
                 'status', w.status, 'is_lead', m.is_lead, 'effective_from', m.effective_from)
               ORDER BY m.is_lead DESC, w.display_name)
          FROM lucie_m06.group_membership m
          JOIN lucie_m06.workforce_profile w ON w.workforce_profile_id = m.workforce_profile_id
         WHERE m.group_id = g.group_id AND m.effective_to IS NULL), '[]'::jsonb)));

  ELSIF p_op = 'group.update' THEN
    UPDATE lucie_m06.workforce_group g SET
      name = COALESCE(p_payload->>'name', g.name),
      description = COALESCE(p_payload->>'description', g.description),
      is_active = COALESCE((p_payload->>'is_active')::boolean, g.is_active),
      updated_at = now()
     WHERE g.group_id = (p_payload->>'group_id')::uuid AND g.tenant_id = p_tenant_id
     RETURNING g.group_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('group_id', v_id));

  ELSIF p_op = 'membership.add' THEN
    INSERT INTO lucie_m06.group_membership (tenant_id, group_id, workforce_profile_id, group_type, is_lead)
    SELECT p_tenant_id, g.group_id, (p_payload->>'workforce_profile_id')::uuid, g.group_type,
           COALESCE((p_payload->>'is_lead')::boolean, false)
      FROM lucie_m06.workforce_group g
     WHERE g.group_id = (p_payload->>'group_id')::uuid AND g.tenant_id = p_tenant_id
    ON CONFLICT DO NOTHING
    RETURNING membership_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_APPLIED',
      'reason', 'Already a member of this group, or the group is out of scope.'); END IF;
    PERFORM lucie_m06.emit('m06.group_membership.added','GroupMembership', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('membership_id', v_id));

  ELSIF p_op = 'membership.remove' THEN
    UPDATE lucie_m06.group_membership SET effective_to = current_date
     WHERE membership_id = (p_payload->>'membership_id')::uuid AND tenant_id = p_tenant_id AND effective_to IS NULL
     RETURNING membership_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.group_membership.removed','GroupMembership', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('membership_id', v_id));

  ELSIF p_op = 'membership.setlead' THEN
    UPDATE lucie_m06.group_membership SET is_lead = COALESCE((p_payload->>'is_lead')::boolean, true)
     WHERE membership_id = (p_payload->>'membership_id')::uuid AND tenant_id = p_tenant_id
     RETURNING membership_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('membership_id', v_id));

  ELSIF p_op = 'membership.list' THEN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
             'membership_id', m.membership_id, 'group_id', m.group_id, 'group_name', g.name,
             'group_type', g.group_type, 'is_lead', m.is_lead, 'effective_from', m.effective_from,
             'effective_to', m.effective_to) ORDER BY g.group_type, g.name), '[]'::jsonb) INTO v_result
      FROM lucie_m06.group_membership m
      JOIN lucie_m06.workforce_group g ON g.group_id = m.group_id
     WHERE m.tenant_id = p_tenant_id
       AND m.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'assignment.list' THEN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
             'work_assignment_context_id', a.work_assignment_context_id,
             'workforce_profile_id', a.workforce_profile_id, 'display_name', w.display_name,
             'business_unit', bu.name, 'team', t.name,
             'effective_from', a.effective_from, 'effective_to', a.effective_to) ORDER BY w.display_name), '[]'::jsonb)
      INTO v_result
      FROM lucie_m06.work_assignment_context a
      JOIN lucie_m06.workforce_profile w ON w.workforce_profile_id = a.workforce_profile_id
      LEFT JOIN lucie_m06.workforce_group bu ON bu.group_id = a.business_unit_id
      LEFT JOIN lucie_m06.workforce_group t ON t.group_id = a.team_id
     WHERE a.tenant_id = p_tenant_id AND a.organization_id = p_organization_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  -- ============ operating posture =================================
  ELSIF p_op = 'availability.declare' THEN
    INSERT INTO lucie_m06.availability_declaration (tenant_id, workforce_profile_id, availability, note, declared_by)
    VALUES (p_tenant_id, (p_payload->>'workforce_profile_id')::uuid,
      COALESCE(p_payload->>'availability','AVAILABLE'), p_payload->>'note', p_user_id)
    RETURNING availability_id INTO v_id;
    PERFORM lucie_m06.emit('m06.availability.declared','AvailabilityDeclaration', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('availability_id', v_id));

  ELSIF p_op = 'availability.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(a) ORDER BY a.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.availability_declaration a
     WHERE a.tenant_id = p_tenant_id
       AND (p_payload->>'workforce_profile_id' IS NULL
            OR a.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'servicescope.set' THEN
    INSERT INTO lucie_m06.service_scope (tenant_id, workforce_profile_id, state_code, product_lines)
    VALUES (p_tenant_id, (p_payload->>'workforce_profile_id')::uuid, upper(p_payload->>'state_code'),
      COALESCE(ARRAY(SELECT jsonb_array_elements_text(COALESCE(p_payload->'product_lines','[]'::jsonb))), '{}'))
    ON CONFLICT (workforce_profile_id, state_code) DO UPDATE
      SET product_lines = EXCLUDED.product_lines, status = 'ACTIVE'
    RETURNING service_scope_id INTO v_id;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('service_scope_id', v_id));

  ELSIF p_op = 'servicescope.remove' THEN
    UPDATE lucie_m06.service_scope SET status = 'INACTIVE'
     WHERE service_scope_id = (p_payload->>'service_scope_id')::uuid AND tenant_id = p_tenant_id
     RETURNING service_scope_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('service_scope_id', v_id));

  ELSIF p_op = 'servicescope.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(s) ORDER BY s.state_code), '[]'::jsonb) INTO v_result
      FROM lucie_m06.service_scope s
     WHERE s.tenant_id = p_tenant_id
       AND (p_payload->>'workforce_profile_id' IS NULL
            OR s.workforce_profile_id = (p_payload->>'workforce_profile_id')::uuid);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  -- ============ readiness =========================================
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

  -- ============ notes / tasks / documents =========================
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

  ELSIF p_op = 'task.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.due_at NULLS LAST), '[]'::jsonb) INTO v_result
      FROM lucie_m06.task_reference t
     WHERE t.tenant_id = p_tenant_id
       AND (p_payload->>'subject_id' IS NULL OR t.subject_id = (p_payload->>'subject_id')::uuid);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'task.update' THEN
    UPDATE lucie_m06.task_reference SET status = COALESCE(p_payload->>'status','COMPLETED')
     WHERE task_reference_id = (p_payload->>'task_reference_id')::uuid AND tenant_id = p_tenant_id
     RETURNING task_reference_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('task_reference_id', v_id));

  ELSIF p_op = 'document.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(d) ORDER BY d.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.document_reference d
     WHERE d.tenant_id = p_tenant_id
       AND (p_payload->>'subject_id' IS NULL OR d.subject_id = (p_payload->>'subject_id')::uuid);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  -- ============ exceptions ========================================
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

  -- ============ identity resolution ===============================
  ELSIF p_op = 'duplicate.list' THEN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
             'duplicate_candidate_id', d.duplicate_candidate_id,
             'match_outcome', d.match_outcome, 'status', d.status,
             'match_signals', d.match_signals, 'created_at', d.created_at,
             'primary', jsonb_build_object('workforce_profile_id', a.workforce_profile_id,
                 'display_name', a.display_name, 'work_email', a.work_email, 'npn', a.npn,
                 'status', a.status, 'created_at', a.created_at),
             'candidate', CASE WHEN b.workforce_profile_id IS NULL THEN 'null'::jsonb ELSE
                 jsonb_build_object('workforce_profile_id', b.workforce_profile_id,
                 'display_name', b.display_name, 'work_email', b.work_email, 'npn', b.npn,
                 'status', b.status, 'created_at', b.created_at) END)
             ORDER BY d.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.duplicate_candidate d
      JOIN lucie_m06.workforce_profile a ON a.workforce_profile_id = d.workforce_profile_id
      LEFT JOIN lucie_m06.workforce_profile b ON b.workforce_profile_id = d.candidate_profile_id
     WHERE d.tenant_id = p_tenant_id
       AND (p_payload->>'status' IS NULL OR d.status = p_payload->>'status');
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'duplicate.resolve' THEN
    IF COALESCE(p_payload->>'resolution','') NOT IN ('SAME_PERSON','DIFFERENT_PEOPLE','NEEDS_MORE_INFORMATION') THEN
      RETURN jsonb_build_object('ok', false, 'code', 'INVALID_ACTION',
        'reason', 'Resolution must be SAME_PERSON, DIFFERENT_PEOPLE or NEEDS_MORE_INFORMATION.');
    END IF;
    IF COALESCE(p_payload->>'reason','') = '' THEN
      RETURN jsonb_build_object('ok', false, 'code', 'REASON_REQUIRED');
    END IF;
    UPDATE lucie_m06.duplicate_candidate
       SET status = CASE p_payload->>'resolution' WHEN 'NEEDS_MORE_INFORMATION' THEN 'IN_REVIEW' ELSE 'RESOLVED' END,
           match_outcome = CASE p_payload->>'resolution'
             WHEN 'SAME_PERSON' THEN 'VERIFIED_MATCH'
             WHEN 'DIFFERENT_PEOPLE' THEN 'NO_MATCH' ELSE 'REVIEW_REQUIRED' END,
           match_signals = match_signals || jsonb_build_object('decision_reason', p_payload->>'reason')
     WHERE duplicate_candidate_id = (p_payload->>'duplicate_candidate_id')::uuid AND tenant_id = p_tenant_id
     RETURNING duplicate_candidate_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    PERFORM lucie_m06.emit('m06.duplicate.resolved','DuplicateCandidate', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('duplicate_candidate_id', v_id));

  ELSIF p_op = 'identity.review.list' THEN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
             'identity_link_review_id', r.identity_link_review_id,
             'workforce_profile_id', r.workforce_profile_id, 'display_name', w.display_name,
             'proposed_user_account_id', r.proposed_user_account_id,
             'match_outcome', r.match_outcome, 'decision', r.decision,
             'reviewed_at', r.reviewed_at, 'created_at', r.created_at)
             ORDER BY r.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.identity_link_review r
      JOIN lucie_m06.workforce_profile w ON w.workforce_profile_id = r.workforce_profile_id
     WHERE r.tenant_id = p_tenant_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'identity.review.decide' THEN
    IF COALESCE(p_payload->>'decision','') NOT IN ('LINK','REJECT') THEN
      RETURN jsonb_build_object('ok', false, 'code', 'INVALID_ACTION');
    END IF;
    UPDATE lucie_m06.identity_link_review
       SET decision = p_payload->>'decision', reviewed_by = p_user_id, reviewed_at = now(),
           match_outcome = CASE p_payload->>'decision' WHEN 'LINK' THEN 'VERIFIED_MATCH' ELSE 'NO_MATCH' END
     WHERE identity_link_review_id = (p_payload->>'identity_link_review_id')::uuid AND tenant_id = p_tenant_id
     RETURNING identity_link_review_id, workforce_profile_id, proposed_user_account_id INTO v_row;
    IF v_row IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    IF p_payload->>'decision' = 'LINK' THEN
      UPDATE lucie_m06.workforce_profile
         SET user_account_id = v_row.proposed_user_account_id, roster_only = false, updated_at = now()
       WHERE workforce_profile_id = v_row.workforce_profile_id;
    END IF;
    PERFORM lucie_m06.emit('m06.identity_link.decided','IdentityLinkReview',
      v_row.identity_link_review_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object(
      'identity_link_review_id', v_row.identity_link_review_id,
      'note', 'Account linkage is recorded in M06; M00 owns the identity record itself.'));

  -- ============ jobs, reconciliation, notification ================
  ELSIF p_op = 'job.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(j) ORDER BY j.requested_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.job_reference j
     WHERE j.tenant_id = p_tenant_id
       AND (p_payload->>'job_kind' IS NULL OR j.job_kind = p_payload->>'job_kind');
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'job.get' THEN
    SELECT to_jsonb(j) INTO v_result FROM lucie_m06.job_reference j
     WHERE j.job_id = (p_payload->>'job_id')::uuid AND j.tenant_id = p_tenant_id;
    IF v_result IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'job.create' THEN
    IF COALESCE(p_payload->>'job_kind','') NOT IN ('IMPORT','EXPORT') THEN
      RETURN jsonb_build_object('ok', false, 'code', 'INVALID_ACTION');
    END IF;
    INSERT INTO lucie_m06.job_reference (tenant_id, organization_id, job_kind, status, file_name, row_count, requested_by)
    VALUES (p_tenant_id, p_organization_id, p_payload->>'job_kind',
      CASE p_payload->>'job_kind' WHEN 'IMPORT' THEN 'UPLOADED' ELSE 'REQUESTED' END,
      p_payload->>'file_name', COALESCE((p_payload->>'row_count')::int, 0), p_user_id)
    RETURNING job_id INTO v_id;
    PERFORM lucie_m06.emit('m06.job.requested','JobReference', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('job_id', v_id));

  ELSIF p_op = 'job.advance' THEN
    UPDATE lucie_m06.job_reference
       SET status = COALESCE(p_payload->>'status', status),
           completed_at = CASE WHEN p_payload->>'status' IN ('COMPLETED','READY','FAILED','EXPIRED')
                               THEN now() ELSE completed_at END
     WHERE job_id = (p_payload->>'job_id')::uuid AND tenant_id = p_tenant_id
     RETURNING job_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('job_id', v_id));

  ELSIF p_op = 'reconciliation.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(r) ORDER BY r.started_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.reconciliation_run r WHERE r.tenant_id = p_tenant_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'reconciliation.start' THEN
    INSERT INTO lucie_m06.reconciliation_run (tenant_id, scope, status, drift_count, findings, finished_at)
    SELECT p_tenant_id, COALESCE(p_payload->>'scope','ROSTER_VS_IDENTITY'),
      CASE WHEN d.n = 0 THEN 'COMPLETED_WITHOUT_DRIFT' ELSE 'COMPLETED_WITH_DRIFT' END, d.n,
      COALESCE(d.findings, '[]'::jsonb), now()
      FROM (
        SELECT count(*)::int AS n,
               jsonb_agg(jsonb_build_object('workforce_profile_id', w.workforce_profile_id,
                 'display_name', w.display_name, 'finding', 'Active profile has no linked identity account')) AS findings
          FROM lucie_m06.workforce_profile w
         WHERE w.tenant_id = p_tenant_id AND w.organization_id = p_organization_id
           AND w.status = 'ACTIVE' AND w.user_account_id IS NULL
      ) d
    RETURNING reconciliation_run_id INTO v_id;
    PERFORM lucie_m06.emit('m06.reconciliation.completed','ReconciliationRun', v_id::text, p_tenant_id, p_payload, p_user_id);
    SELECT to_jsonb(r) INTO v_result FROM lucie_m06.reconciliation_run r WHERE r.reconciliation_run_id = v_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'notification.list' THEN
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
             'notification_request_id', n.notification_request_id, 'channel', n.channel,
             'urgency', n.urgency, 'template_code', n.template_code, 'status', n.status,
             'created_at', n.created_at, 'recipient', w.display_name, 'payload', n.payload)
             ORDER BY n.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.notification_request n
      LEFT JOIN lucie_m06.workforce_profile w ON w.workforce_profile_id = n.recipient_profile_id
     WHERE n.tenant_id = p_tenant_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'outbox.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(e) ORDER BY e.occurred_at DESC), '[]'::jsonb) INTO v_result
      FROM (SELECT * FROM lucie_m06.event_outbox
             WHERE tenant_id = p_tenant_id ORDER BY occurred_at DESC LIMIT 200) e;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  -- ============ support context ===================================
  ELSIF p_op = 'support.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(s) ORDER BY s.created_at DESC), '[]'::jsonb) INTO v_result
      FROM lucie_m06.support_context s WHERE s.tenant_id = p_tenant_id;
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'support.start' THEN
    IF COALESCE(p_payload->>'reason','') = '' THEN
      RETURN jsonb_build_object('ok', false, 'code', 'REASON_REQUIRED');
    END IF;
    INSERT INTO lucie_m06.support_context (tenant_id, actor_id, mode, reason, expires_at)
    VALUES (p_tenant_id, p_user_id, 'ACTIVE', p_payload->>'reason', now() + interval '2 hours')
    RETURNING support_context_id INTO v_id;
    PERFORM lucie_m06.emit('m06.support_context.started','SupportContext', v_id::text, p_tenant_id, p_payload, p_user_id);
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('support_context_id', v_id));

  ELSIF p_op = 'support.end' THEN
    UPDATE lucie_m06.support_context SET mode = 'EXPIRED', expires_at = now()
     WHERE support_context_id = (p_payload->>'support_context_id')::uuid AND tenant_id = p_tenant_id
     RETURNING support_context_id INTO v_id;
    IF v_id IS NULL THEN RETURN jsonb_build_object('ok', false, 'code', 'NOT_FOUND'); END IF;
    RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object('support_context_id', v_id));

  -- ============ projections and access ============================
  ELSIF p_op = 'projection.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(u) ORDER BY u.owner_module, u.object_id), '[]'::jsonb) INTO v_result
      FROM lucie_m06.upstream_projection u
     WHERE u.tenant_id = p_tenant_id
       AND (p_payload->>'owner_module' IS NULL OR u.owner_module = p_payload->>'owner_module')
       AND (p_payload->>'subject_id' IS NULL OR u.subject_id = (p_payload->>'subject_id')::uuid);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'access.grant.list' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(g) ORDER BY g.permission), '[]'::jsonb) INTO v_result
      FROM lucie_m06.permission_grant g
     WHERE g.tenant_id = p_tenant_id
       AND (g.organization_id IS NULL OR g.organization_id = p_organization_id);
    RETURN jsonb_build_object('ok', true, 'data', v_result);

  ELSIF p_op = 'access.effective' THEN
    -- Effective access evaluation is owned by M00. Until DELTA-M06-M00-007 is
    -- approved, M06 can only explain the grants it can observe.
    SELECT jsonb_build_object(
             'actor', p_user_id,
             'tenant_id', p_tenant_id,
             'organization_id', p_organization_id,
             'platform_admin', p_is_platform_admin,
             'observable_grants', COALESCE(jsonb_agg(jsonb_build_object(
                 'permission', g.permission, 'scope_type', g.scope_type,
                 'organization_id', g.organization_id)), '[]'::jsonb),
             'authoritative', false,
             'blocked_by', 'DELTA-M06-M00-007')
      INTO v_result
      FROM lucie_m06.permission_grant g
     WHERE g.tenant_id = p_tenant_id
       AND g.user_id = COALESCE(NULLIF(p_payload->>'user_id','')::uuid, p_user_id);
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

-- ---------- 2. Sample network data (Local Development) -------------
DO $seed$
DECLARE
  t uuid := '11111111-1111-4111-8111-111111111111';
  o uuid := '22222222-2222-4222-8222-222222222222';
  o2 uuid := '22222222-2222-4222-8222-333333333333';
  bu_north uuid; bu_south uuid;
  tm_med uuid; tm_life uuid; tm_service uuid;
  p record;
  ids uuid[] := '{}';
BEGIN
  IF EXISTS (SELECT 1 FROM lucie_m06.workforce_profile WHERE tenant_id = t) THEN RETURN; END IF;

  INSERT INTO lucie_m06.agency_operational_profile (tenant_id, organization_id, operating_name, captivity_default, service_states, defaults)
  VALUES (t, o, 'Brightline Benefits Group', 'INDEPENDENT', ARRAY['TX','FL','GA','AZ','NC'],
    jsonb_build_object('default_team','Medicare Advantage','invitation_policy','MANUAL_REVIEW',
                       'roster_only_allowed', true, 'notification_channel','IN_PRODUCT'))
  ON CONFLICT (organization_id) DO NOTHING;

  INSERT INTO lucie_m06.workforce_group (tenant_id, organization_id, group_type, name, description)
  VALUES (t, o, 'BUSINESS_UNIT', 'North Region', 'Dallas, Austin and Oklahoma City offices'),
         (t, o, 'BUSINESS_UNIT', 'South Region', 'Houston, Tampa and Miami offices')
  ON CONFLICT DO NOTHING;
  SELECT group_id INTO bu_north FROM lucie_m06.workforce_group WHERE tenant_id=t AND name='North Region';
  SELECT group_id INTO bu_south FROM lucie_m06.workforce_group WHERE tenant_id=t AND name='South Region';

  INSERT INTO lucie_m06.workforce_group (tenant_id, organization_id, group_type, name, description, parent_group_id)
  VALUES (t, o, 'TEAM', 'Medicare Advantage', 'AEP and year-round Medicare production', bu_north),
         (t, o, 'TEAM', 'Life and Final Expense', 'Simplified issue life production', bu_south),
         (t, o, 'TEAM', 'Member Services', 'Unlicensed service and retention staff', bu_north)
  ON CONFLICT DO NOTHING;
  SELECT group_id INTO tm_med FROM lucie_m06.workforce_group WHERE tenant_id=t AND name='Medicare Advantage';
  SELECT group_id INTO tm_life FROM lucie_m06.workforce_group WHERE tenant_id=t AND name='Life and Final Expense';
  SELECT group_id INTO tm_service FROM lucie_m06.workforce_group WHERE tenant_id=t AND name='Member Services';

  INSERT INTO lucie_m06.workforce_profile
    (tenant_id, organization_id, person_category, status, captivity, invitation_disposition,
     user_account_id, display_name, legal_first_name, legal_last_name, work_email, work_phone, npn,
     external_reference, roster_only, effective_from)
  VALUES
   (t,o,'AGENT','ACTIVE','INDEPENDENT','ACCEPTED','a0000000-0000-4000-8000-000000000001','Marisol Vega','Marisol','Vega','marisol.vega@brightline.example','+1-214-555-0142','18442051','BL-1001',false, current_date - 640),
   (t,o,'AGENT','ACTIVE','INDEPENDENT','ACCEPTED','a0000000-0000-4000-8000-000000000002','Devon Okafor','Devon','Okafor','devon.okafor@brightline.example','+1-713-555-0118','19003377','BL-1002',false, current_date - 512),
   (t,o,'AGENT','ACTIVE','CAPTIVE','ACCEPTED','a0000000-0000-4000-8000-000000000003','Priya Raman','Priya','Raman','priya.raman@brightline.example','+1-512-555-0187','17558842','BL-1003',false, current_date - 430),
   (t,o,'AGENT','ACTIVE','INDEPENDENT','PENDING',NULL,'Curtis Nakamura','Curtis','Nakamura','curtis.nakamura@brightline.example','+1-813-555-0165','20114596','BL-1004',true, current_date - 96),
   (t,o,'AGENT','SUSPENDED','INDEPENDENT','ACCEPTED','a0000000-0000-4000-8000-000000000005','Renée Baptiste','Renee','Baptiste','renee.baptiste@brightline.example','+1-305-555-0173','16620094','BL-1005',false, current_date - 780),
   (t,o,'AGENT','DRAFT','UNSPECIFIED','NOT_REQUESTED',NULL,'Thomas Ellery','Thomas','Ellery','thomas.ellery@brightline.example','+1-405-555-0139','21008812','BL-1006',true, current_date - 12),
   (t,o,'AGENT','ACTIVE','INDEPENDENT','ACCEPTED','a0000000-0000-4000-8000-000000000007','Sofia Marchetti','Sofia','Marchetti','sofia.marchetti@brightline.example','+1-602-555-0155','18871230','BL-1007',false, current_date - 289),
   (t,o,'AGENT','INACTIVE','INDEPENDENT','REVOKED',NULL,'Grant Whitfield','Grant','Whitfield','grant.whitfield@brightline.example','+1-919-555-0121','15590431','BL-1008',true, current_date - 1120),
   (t,o,'UNLICENSED_STAFF','ACTIVE','UNSPECIFIED','ACCEPTED','a0000000-0000-4000-8000-000000000009','Alicia Brennan','Alicia','Brennan','alicia.brennan@brightline.example','+1-214-555-0190',NULL,'BL-2001',false, current_date - 365),
   (t,o,'UNLICENSED_STAFF','ACTIVE','UNSPECIFIED','PENDING',NULL,'Jonah Feldman','Jonah','Feldman','jonah.feldman@brightline.example','+1-713-555-0134',NULL,'BL-2002',true, current_date - 58),
   (t,o,'OTHER_WORKFORCE','ACTIVE','UNSPECIFIED','NOT_REQUESTED',NULL,'Bianca Duarte','Bianca','Duarte','bianca.duarte@brightline.example','+1-512-555-0148',NULL,'BL-3001',true, current_date - 201),
   (t,o,'AGENT','ACTIVE','INDEPENDENT','ACCEPTED','a0000000-0000-4000-8000-000000000012','Marisol Vega Jr','Marisol','Vega','m.vega@brightline.example','+1-214-555-0142','18442051','BL-1009',true, current_date - 21);

  -- affiliations
  INSERT INTO lucie_m06.agency_affiliation (tenant_id, workforce_profile_id, organization_id, status, captivity, is_primary, effective_from)
  SELECT t, w.workforce_profile_id, o,
         CASE w.status WHEN 'DRAFT' THEN 'PLANNED' WHEN 'INACTIVE' THEN 'ENDED' ELSE 'ACTIVE' END,
         w.captivity, w.status NOT IN ('DRAFT','INACTIVE'), w.effective_from
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id = t;

  UPDATE lucie_m06.agency_affiliation SET effective_to = current_date - 30
   WHERE tenant_id = t AND status = 'ENDED';

  -- secondary (independent) affiliation for one producer
  INSERT INTO lucie_m06.agency_affiliation (tenant_id, workforce_profile_id, organization_id, status, captivity, is_primary, effective_from)
  SELECT t, w.workforce_profile_id, o2, 'ACTIVE', 'INDEPENDENT', false, current_date - 120
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id = t AND w.display_name = 'Devon Okafor';

  -- memberships
  INSERT INTO lucie_m06.group_membership (tenant_id, group_id, workforce_profile_id, group_type, is_lead)
  SELECT t, tm_med, w.workforce_profile_id, 'TEAM', w.display_name = 'Marisol Vega'
    FROM lucie_m06.workforce_profile w
   WHERE w.tenant_id=t AND w.display_name IN ('Marisol Vega','Priya Raman','Curtis Nakamura','Sofia Marchetti');
  INSERT INTO lucie_m06.group_membership (tenant_id, group_id, workforce_profile_id, group_type, is_lead)
  SELECT t, tm_life, w.workforce_profile_id, 'TEAM', w.display_name = 'Devon Okafor'
    FROM lucie_m06.workforce_profile w
   WHERE w.tenant_id=t AND w.display_name IN ('Devon Okafor','Renée Baptiste');
  INSERT INTO lucie_m06.group_membership (tenant_id, group_id, workforce_profile_id, group_type, is_lead)
  SELECT t, tm_service, w.workforce_profile_id, 'TEAM', w.display_name = 'Alicia Brennan'
    FROM lucie_m06.workforce_profile w
   WHERE w.tenant_id=t AND w.display_name IN ('Alicia Brennan','Jonah Feldman','Bianca Duarte');
  INSERT INTO lucie_m06.group_membership (tenant_id, group_id, workforce_profile_id, group_type, is_lead)
  SELECT t, bu_north, w.workforce_profile_id, 'BUSINESS_UNIT', false
    FROM lucie_m06.workforce_profile w
   WHERE w.tenant_id=t AND w.display_name IN ('Marisol Vega','Priya Raman','Alicia Brennan','Jonah Feldman','Bianca Duarte','Sofia Marchetti');
  INSERT INTO lucie_m06.group_membership (tenant_id, group_id, workforce_profile_id, group_type, is_lead)
  SELECT t, bu_south, w.workforce_profile_id, 'BUSINESS_UNIT', false
    FROM lucie_m06.workforce_profile w
   WHERE w.tenant_id=t AND w.display_name IN ('Devon Okafor','Renée Baptiste','Curtis Nakamura');

  -- work assignment context
  INSERT INTO lucie_m06.work_assignment_context (tenant_id, workforce_profile_id, organization_id, business_unit_id, team_id)
  SELECT t, m.workforce_profile_id, o,
         (SELECT gm.group_id FROM lucie_m06.group_membership gm
           WHERE gm.workforce_profile_id = m.workforce_profile_id AND gm.group_type='BUSINESS_UNIT' LIMIT 1),
         (SELECT gm.group_id FROM lucie_m06.group_membership gm
           WHERE gm.workforce_profile_id = m.workforce_profile_id AND gm.group_type='TEAM' LIMIT 1)
    FROM (SELECT DISTINCT workforce_profile_id FROM lucie_m06.group_membership WHERE tenant_id=t) m;

  -- service scope
  FOR p IN SELECT workforce_profile_id, display_name FROM lucie_m06.workforce_profile
            WHERE tenant_id=t AND person_category='AGENT' AND status='ACTIVE' LOOP
    INSERT INTO lucie_m06.service_scope (tenant_id, workforce_profile_id, state_code, product_lines)
    VALUES (t, p.workforce_profile_id, 'TX', ARRAY['MEDICARE_ADVANTAGE','MEDICARE_SUPPLEMENT'])
    ON CONFLICT DO NOTHING;
    INSERT INTO lucie_m06.service_scope (tenant_id, workforce_profile_id, state_code, product_lines)
    VALUES (t, p.workforce_profile_id, 'FL', ARRAY['MEDICARE_ADVANTAGE'])
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- availability
  INSERT INTO lucie_m06.availability_declaration (tenant_id, workforce_profile_id, availability, note)
  SELECT t, w.workforce_profile_id,
         CASE WHEN w.display_name='Sofia Marchetti' THEN 'NOT_ACCEPTING_NEW_WORK'
              WHEN w.display_name='Priya Raman' THEN 'TEMPORARILY_UNAVAILABLE' ELSE 'AVAILABLE' END,
         CASE WHEN w.display_name='Priya Raman' THEN 'On parental leave through the end of the quarter.'
              WHEN w.display_name='Sofia Marchetti' THEN 'At book capacity for AEP.' ELSE NULL END
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.status='ACTIVE';

  -- exceptions
  INSERT INTO lucie_m06.m06_exception (tenant_id, organization_id, subject_type, subject_id, code, summary, status, risk_level)
  SELECT t, o, 'WorkforceProfile', w.workforce_profile_id, 'DUPLICATE_NPN',
         'Two roster records share NPN 18442051; identity review required before either can sell.', 'OPEN','HIGH'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Marisol Vega Jr';
  INSERT INTO lucie_m06.m06_exception (tenant_id, organization_id, subject_type, subject_id, code, summary, status, risk_level)
  SELECT t, o, 'WorkforceProfile', w.workforce_profile_id, 'SUSPENSION_UNCONFIRMED',
         'Suspension recorded in M06 but access and session revocation is not yet confirmed by M00.', 'IN_REVIEW','CRITICAL'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Renée Baptiste';
  INSERT INTO lucie_m06.m06_exception (tenant_id, organization_id, subject_type, subject_id, code, summary, status, risk_level)
  SELECT t, o, 'WorkforceProfile', w.workforce_profile_id, 'MISSING_CONTACT',
         'No verified work phone on a roster-only record scheduled for onboarding.', 'OPEN','STANDARD'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Thomas Ellery';
  INSERT INTO lucie_m06.m06_exception (tenant_id, organization_id, subject_type, subject_id, code, summary, status, risk_level)
  SELECT t, o, 'AgencyAffiliation', w.workforce_profile_id, 'OVERLAPPING_PRIMARY',
         'Producer holds an active affiliation with a second organization; primary affiliation must be confirmed.', 'OPEN','HIGH'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Devon Okafor';

  -- tasks
  INSERT INTO lucie_m06.task_reference (tenant_id, subject_type, subject_id, external_task_id, title, status, due_at)
  SELECT t,'WorkforceProfile', w.workforce_profile_id, 'TSK-4471','Collect signed producer agreement','PENDING', now() + interval '3 days'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Curtis Nakamura';
  INSERT INTO lucie_m06.task_reference (tenant_id, subject_type, subject_id, external_task_id, title, status, due_at)
  SELECT t,'WorkforceProfile', w.workforce_profile_id, 'TSK-4472','Confirm state appointments with carrier desk','PROCESSING', now() + interval '9 days'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Thomas Ellery';
  INSERT INTO lucie_m06.task_reference (tenant_id, subject_type, subject_id, external_task_id, title, status, due_at)
  SELECT t,'WorkforceProfile', w.workforce_profile_id, 'TSK-4468','Return agency equipment and close book handoff','PENDING', now() + interval '1 day'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Grant Whitfield';
  INSERT INTO lucie_m06.task_reference (tenant_id, subject_type, subject_id, external_task_id, title, status, due_at)
  SELECT t,'WorkforceProfile', w.workforce_profile_id, 'TSK-4455','Complete annual compliance attestation','COMPLETED', now() - interval '6 days'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Marisol Vega';

  -- notes
  INSERT INTO lucie_m06.workforce_note (tenant_id, workforce_profile_id, audience, body)
  SELECT t, w.workforce_profile_id, 'AGENCY_VISIBLE','Top AEP producer three years running; keep on the escalation rota.'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Marisol Vega';
  INSERT INTO lucie_m06.workforce_note (tenant_id, workforce_profile_id, audience, body)
  SELECT t, w.workforce_profile_id, 'JET_ONLY','Suspension pending platform confirmation. Do not surface reinstatement controls yet.'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Renée Baptiste';
  INSERT INTO lucie_m06.workforce_note (tenant_id, workforce_profile_id, audience, body)
  SELECT t, w.workforce_profile_id, 'AGENCY_VISIBLE','Roster-only until the producer agreement is countersigned.'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Curtis Nakamura';

  -- documents (owned by M13/M08, projected read-only)
  INSERT INTO lucie_m06.document_reference (tenant_id, subject_type, subject_id, document_state, owner_module, external_document_id, label)
  SELECT t,'WorkforceProfile', w.workforce_profile_id, 'AVAILABLE','M00','DOC-99120','Producer agreement (countersigned)'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Marisol Vega';
  INSERT INTO lucie_m06.document_reference (tenant_id, subject_type, subject_id, document_state, owner_module, external_document_id, label)
  SELECT t,'WorkforceProfile', w.workforce_profile_id, 'PROCESSING','M00','DOC-99341','E&O certificate of insurance'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Curtis Nakamura';
  INSERT INTO lucie_m06.document_reference (tenant_id, subject_type, subject_id, document_state, owner_module, external_document_id, label)
  SELECT t,'WorkforceProfile', w.workforce_profile_id, 'UNAVAILABLE','M00',NULL,'Background check attestation'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Thomas Ellery';

  -- lifecycle cases
  INSERT INTO lucie_m06.lifecycle_case (tenant_id, organization_id, case_type, workforce_profile_id, status, scheduled_for, blocking_reasons, detail)
  SELECT t,o,'ONBOARDING', w.workforce_profile_id,'BLOCKED', current_date + 7,
         ARRAY['E&O certificate still processing','Producer agreement not countersigned'],
         jsonb_build_object('steps', jsonb_build_array(
           jsonb_build_object('label','Roster record created','done',true),
           jsonb_build_object('label','Identity invitation sent','done',true),
           jsonb_build_object('label','Producer agreement countersigned','done',false),
           jsonb_build_object('label','E&O certificate verified','done',false),
           jsonb_build_object('label','Team assignment','done',true),
           jsonb_build_object('label','Activate profile','done',false)))
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Curtis Nakamura';
  INSERT INTO lucie_m06.lifecycle_case (tenant_id, organization_id, case_type, workforce_profile_id, status, scheduled_for, detail)
  SELECT t,o,'ONBOARDING', w.workforce_profile_id,'DRAFT', current_date + 21,
         jsonb_build_object('steps', jsonb_build_array(
           jsonb_build_object('label','Roster record created','done',true),
           jsonb_build_object('label','Identity invitation sent','done',false),
           jsonb_build_object('label','Producer agreement countersigned','done',false),
           jsonb_build_object('label','Activate profile','done',false)))
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Thomas Ellery';
  INSERT INTO lucie_m06.lifecycle_case (tenant_id, organization_id, case_type, workforce_profile_id, status, source_organization_id, target_organization_id, scheduled_for, blocking_reasons, detail)
  SELECT t,o,'TRANSFER', w.workforce_profile_id,'BLOCKED', o, o2, current_date + 14,
         ARRAY['Primary affiliation conflict must be resolved first'],
         jsonb_build_object('reason','Producer relocating to the Houston office','book_of_business','412 members')
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Devon Okafor';
  INSERT INTO lucie_m06.lifecycle_case (tenant_id, organization_id, case_type, workforce_profile_id, status, scheduled_for, detail, completed_at)
  SELECT t,o,'OFFBOARDING', w.workforce_profile_id,'COMPLETED', current_date - 30,
         jsonb_build_object('reason','Voluntary resignation','book_reassigned_to','Medicare Advantage team'), now() - interval '29 days'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Grant Whitfield';

  -- status history
  INSERT INTO lucie_m06.profile_status_history (tenant_id, workforce_profile_id, from_status, to_status, lifecycle_action, reason, occurred_at)
  SELECT t, w.workforce_profile_id,'DRAFT','ACTIVE','ACTIVATE','Onboarding completed and agreement countersigned.', now() - interval '400 days'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.status='ACTIVE';
  INSERT INTO lucie_m06.profile_status_history (tenant_id, workforce_profile_id, from_status, to_status, lifecycle_action, reason, occurred_at)
  SELECT t, w.workforce_profile_id,'ACTIVE','SUSPENDED','SUSPEND','Carrier compliance hold pending investigation.', now() - interval '11 days'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Renée Baptiste';
  INSERT INTO lucie_m06.profile_status_history (tenant_id, workforce_profile_id, from_status, to_status, lifecycle_action, reason, occurred_at)
  SELECT t, w.workforce_profile_id,'ACTIVE','INACTIVE','OFFBOARD','Voluntary resignation; book reassigned.', now() - interval '29 days'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Grant Whitfield';

  -- readiness
  INSERT INTO lucie_m06.readiness_result (tenant_id, workforce_profile_id, readiness_state, operational_eligibility, reasons, contributing_sources, owner_freshness_at)
  SELECT t, w.workforce_profile_id,
    CASE w.status WHEN 'ACTIVE' THEN CASE WHEN w.user_account_id IS NULL THEN 'READY_WITH_LIMITATIONS' ELSE 'READY' END
         WHEN 'SUSPENDED' THEN 'REVIEW_REQUIRED' WHEN 'DRAFT' THEN 'NOT_READY' ELSE 'NOT_APPLICABLE' END,
    CASE w.status WHEN 'ACTIVE' THEN 'OPERATIONALLY_ELIGIBLE' WHEN 'SUSPENDED' THEN 'REVIEW_REQUIRED'
         ELSE 'OPERATIONALLY_INELIGIBLE' END,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN w.status <> 'ACTIVE' THEN 'Profile is not active' END,
      CASE WHEN w.user_account_id IS NULL THEN 'No linked identity account (roster-only)' END,
      CASE WHEN w.npn IS NULL AND w.person_category='AGENT' THEN 'No national producer number on file' END], NULL),
    jsonb_build_object('m00_identity', w.user_account_id IS NOT NULL, 'm08_selling_authority','projection_pending',
                       'm06_affiliation', w.status IN ('ACTIVE','SUSPENDED')),
    now() - interval '4 hours'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t
  ON CONFLICT (workforce_profile_id) DO NOTHING;

  -- duplicates and identity reviews
  INSERT INTO lucie_m06.duplicate_candidate (tenant_id, workforce_profile_id, candidate_profile_id, match_outcome, match_signals, status)
  SELECT t, a.workforce_profile_id, b.workforce_profile_id, 'POSSIBLE_MATCH',
    jsonb_build_object('npn','exact','work_phone','exact','legal_name','strong','work_email','different','score',0.92), 'OPEN'
    FROM lucie_m06.workforce_profile a, lucie_m06.workforce_profile b
   WHERE a.tenant_id=t AND b.tenant_id=t AND a.display_name='Marisol Vega' AND b.display_name='Marisol Vega Jr';
  INSERT INTO lucie_m06.duplicate_candidate (tenant_id, workforce_profile_id, candidate_profile_id, match_outcome, match_signals, status)
  SELECT t, a.workforce_profile_id, b.workforce_profile_id, 'POSSIBLE_MATCH',
    jsonb_build_object('legal_last_name','exact','work_email','different','npn','different','score',0.41), 'IN_REVIEW'
    FROM lucie_m06.workforce_profile a, lucie_m06.workforce_profile b
   WHERE a.tenant_id=t AND b.tenant_id=t AND a.display_name='Thomas Ellery' AND b.display_name='Grant Whitfield';

  INSERT INTO lucie_m06.identity_link_review (tenant_id, workforce_profile_id, proposed_user_account_id, match_outcome)
  SELECT t, w.workforce_profile_id, 'a0000000-0000-4000-8000-0000000000c4','REVIEW_REQUIRED'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Curtis Nakamura';
  INSERT INTO lucie_m06.identity_link_review (tenant_id, workforce_profile_id, proposed_user_account_id, match_outcome)
  SELECT t, w.workforce_profile_id, 'a0000000-0000-4000-8000-0000000000ca','POSSIBLE_MATCH'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Jonah Feldman';

  -- jobs
  INSERT INTO lucie_m06.job_reference (tenant_id, organization_id, job_kind, status, file_name, row_count, error_count, errors, requested_at, completed_at)
  VALUES
   (t,o,'IMPORT','COMPLETED','brightline_roster_q3.csv',148,0,'[]'::jsonb, now() - interval '17 days', now() - interval '17 days'),
   (t,o,'IMPORT','INVALID','houston_transfer_batch.csv',36,7,
     jsonb_build_array(
       jsonb_build_object('row',4,'field','npn','message','NPN is not 8 to 10 digits'),
       jsonb_build_object('row',9,'field','work_email','message','Duplicate work email within the file'),
       jsonb_build_object('row',12,'field','person_category','message','Value "BROKER" is not a controlled category'),
       jsonb_build_object('row',18,'field','captivity','message','Value is required when the agency default is UNSPECIFIED'),
       jsonb_build_object('row',22,'field','npn','message','NPN already belongs to another active roster record'),
       jsonb_build_object('row',29,'field','legal_last_name','message','Required value is empty'),
       jsonb_build_object('row',33,'field','work_phone','message','Not a valid North American number')),
     now() - interval '2 days', now() - interval '2 days'),
   (t,o,'IMPORT','VALIDATING','aep_seasonal_agents.csv',61,0,'[]'::jsonb, now() - interval '11 minutes', NULL),
   (t,o,'EXPORT','READY','roster_full_export.csv',162,0,'[]'::jsonb, now() - interval '5 days', now() - interval '5 days'),
   (t,o,'EXPORT','REQUESTED','readiness_snapshot.csv',0,0,'[]'::jsonb, now() - interval '3 minutes', NULL);

  -- reconciliation
  INSERT INTO lucie_m06.reconciliation_run (tenant_id, scope, status, drift_count, findings, started_at, finished_at)
  VALUES
   (t,'ROSTER_VS_IDENTITY','COMPLETED_WITH_DRIFT',3,
     jsonb_build_array(
       jsonb_build_object('finding','Active profile has no linked identity account','count',3)),
     now() - interval '1 day', now() - interval '1 day' + interval '4 minutes'),
   (t,'AFFILIATION_VS_ORGANIZATION','COMPLETED_WITHOUT_DRIFT',0,'[]'::jsonb,
     now() - interval '8 days', now() - interval '8 days' + interval '2 minutes'),
   (t,'READINESS_VS_SELLING_AUTHORITY','FAILED',0,
     jsonb_build_array(jsonb_build_object('finding','M08 selling authority projection is unavailable','count',1)),
     now() - interval '3 days', now() - interval '3 days' + interval '1 minute');

  -- notifications
  INSERT INTO lucie_m06.notification_request (tenant_id, channel, urgency, recipient_profile_id, template_code, payload, status)
  SELECT t,'IN_PRODUCT','IMPORTANT', w.workforce_profile_id,'M06_ONBOARDING_BLOCKED',
    jsonb_build_object('blocking_reasons', 2), 'COMPLETED'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Curtis Nakamura';
  INSERT INTO lucie_m06.notification_request (tenant_id, channel, urgency, recipient_profile_id, template_code, payload, status)
  SELECT t,'EMAIL','TIME_SENSITIVE', w.workforce_profile_id,'M06_SUSPENSION_NOTICE',
    jsonb_build_object('effective','immediate'), 'PENDING'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Renée Baptiste';
  INSERT INTO lucie_m06.notification_request (tenant_id, channel, urgency, recipient_profile_id, template_code, payload, status)
  SELECT t,'IN_PRODUCT','ROUTINE', w.workforce_profile_id,'M06_TEAM_ASSIGNMENT_CHANGED',
    jsonb_build_object('team','Medicare Advantage'), 'COMPLETED'
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.display_name='Sofia Marchetti';

  -- upstream projections (read-only, owned elsewhere)
  INSERT INTO lucie_m06.upstream_projection (object_id, owner_module, tenant_id, subject_type, subject_id, payload, owner_version, stale)
  SELECT 'OBJ-M06-008','M00', t,'IdentityAccount', w.workforce_profile_id,
    jsonb_build_object('account_status','ACTIVE','mfa','ENABLED','last_sign_in', to_char(now() - interval '2 days','YYYY-MM-DD')),
    'M00-1.1', false
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.user_account_id IS NOT NULL;
  INSERT INTO lucie_m06.upstream_projection (object_id, owner_module, tenant_id, subject_type, subject_id, payload, owner_version, stale)
  SELECT 'OBJ-M06-009','M05', t,'Organization', NULL,
    jsonb_build_object('legal_name','Brightline Benefits Group LLC','offices',6,'primary_state','TX','status','ACTIVE'),
    'M05-1.0', false;
  INSERT INTO lucie_m06.upstream_projection (object_id, owner_module, tenant_id, subject_type, subject_id, payload, owner_version, stale)
  SELECT 'OBJ-M06-010','M04', t,'MarketplaceParticipation', NULL,
    jsonb_build_object('marketplace_route','brightline','referral_token_state','ISSUED','white_label','ENABLED','listing_state','LIVE'),
    'M04-1.0', false;
  INSERT INTO lucie_m06.upstream_projection (object_id, owner_module, tenant_id, subject_type, subject_id, payload, owner_version, stale)
  SELECT 'OBJ-M06-034','M08', t,'SellingAuthority', w.workforce_profile_id,
    jsonb_build_object('licenses', jsonb_build_array('TX Life & Health','FL Health'),
                       'appointments', 4, 'final_selling_authority','GRANTED'),
    'M08-pending', true
    FROM lucie_m06.workforce_profile w WHERE w.tenant_id=t AND w.person_category='AGENT' AND w.status='ACTIVE';
  INSERT INTO lucie_m06.upstream_projection (object_id, owner_module, tenant_id, subject_type, subject_id, payload, owner_version, stale)
  SELECT 'OBJ-M06-036','M00', t,'NotificationPreference', NULL,
    jsonb_build_object('in_product', true,'email', true,'sms', false,'digest','DAILY'),'M00-1.1', false;

  -- support context history
  INSERT INTO lucie_m06.support_context (tenant_id, actor_id, mode, reason, expires_at, created_at)
  VALUES (t,'a0000000-0000-4000-8000-0000000000ff','EXPIRED','Investigating a roster import failure reported by the agency.', now() - interval '20 hours', now() - interval '22 hours');
END
$seed$;

INSERT INTO lucie_m06.schema_version (version, note)
VALUES ('M06-1.0-V003', 'Full screen-register operation surface plus Local Development sample network under CCL-M06-003.')
ON CONFLICT DO NOTHING;
