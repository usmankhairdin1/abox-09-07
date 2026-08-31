-- V008 M00 application runtime layer (CCL-008)
CREATE OR REPLACE FUNCTION public.m00_set_request_context(
  p_user_id uuid,
  p_tenant_id uuid,
  p_is_platform_admin boolean
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, m00
AS $$
BEGIN
  PERFORM set_config('app.user_id', COALESCE(p_user_id::text, ''), true);
  PERFORM set_config('app.tenant_id', COALESCE(p_tenant_id::text, ''), true);
  PERFORM set_config('app.is_platform_admin', CASE WHEN p_is_platform_admin THEN 'true' ELSE 'false' END, true);
END;
$$;

CREATE OR REPLACE FUNCTION public.m00_emit(
  p_event_name text,
  p_aggregate_type text,
  p_aggregate_id text,
  p_tenant_id uuid,
  p_payload jsonb,
  p_audit_code text,
  p_actor uuid,
  p_correlation uuid
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, m00
AS $$
DECLARE v_event_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO m00.outbox_event (event_id, event_name, aggregate_type, aggregate_id, tenant_id, correlation_id, payload, occurred_at, attempt_count)
  VALUES (v_event_id, p_event_name, p_aggregate_type, p_aggregate_id, p_tenant_id, COALESCE(p_correlation, gen_random_uuid()), COALESCE(p_payload, '{}'::jsonb), now(), 0);

  INSERT INTO m00.audit_event (audit_event_id, event_code, actor_user_id, tenant_id, correlation_id, occurred_at, payload_hash, metadata, created_by, updated_by)
  VALUES (gen_random_uuid(), p_audit_code, p_actor, p_tenant_id, COALESCE(p_correlation, v_event_id),
          now(), encode(digest(COALESCE(p_payload, '{}'::jsonb)::text, 'sha256'), 'hex'),
          jsonb_build_object('event_id', v_event_id, 'event_name', p_event_name), p_actor, p_actor);
  RETURN v_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.m00_foundation_status()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, m00
AS $$
  SELECT jsonb_build_object(
    'tables', (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'm00' AND table_type = 'BASE TABLE'),
    'views', (SELECT count(*) FROM information_schema.views WHERE table_schema = 'm00'),
    'rls_forced', (SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'm00' AND c.relkind = 'r' AND c.relrowsecurity AND c.relforcerowsecurity),
    'policies', (SELECT count(*) FROM pg_policies WHERE schemaname = 'm00'),
    'roles', (SELECT count(*) FROM m00.role_template),
    'permissions', (SELECT count(*) FROM m00.permission_definition),
    'role_permission_grants', (SELECT count(*) FROM m00.role_permission_grant),
    'geographies', (SELECT count(*) FROM m00.reference_geography),
    'users', (SELECT count(*) FROM m00.user_identity),
    'memberships', (SELECT count(*) FROM m00.tenant_membership),
    'role_assignments', (SELECT count(*) FROM m00.role_assignment),
    'tasks', (SELECT count(*) FROM m00.task),
    'feature_controls', (SELECT count(*) FROM m00.feature_control),
    'exceptions', (SELECT count(*) FROM m00.exception),
    'consent_evidence', (SELECT count(*) FROM m00.consent_evidence),
    'audit_events', (SELECT count(*) FROM m00.audit_event),
    'outbox_events', (SELECT count(*) FROM m00.outbox_event),
    'outbox_pending', (SELECT count(*) FROM m00.outbox_event WHERE published_at IS NULL)
  );
$$;

CREATE OR REPLACE FUNCTION public.m00_api(
  p_op text,
  p_payload jsonb DEFAULT '{}'::jsonb,
  p_user_id uuid DEFAULT NULL,
  p_tenant_id uuid DEFAULT NULL,
  p_is_platform_admin boolean DEFAULT false,
  p_idempotency_key text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, m00
AS $$
DECLARE
  v_result jsonb;
  v_cached jsonb;
  v_key_hash text;
  v_id uuid;
  v_now timestamptz := now();
BEGIN
  PERFORM public.m00_set_request_context(p_user_id, p_tenant_id, COALESCE(p_is_platform_admin, false));

  IF p_idempotency_key IS NOT NULL THEN
    v_key_hash := encode(digest(p_op || ':' || p_idempotency_key, 'sha256'), 'hex');
    SELECT response_body INTO v_cached FROM m00.idempotency_record
      WHERE idempotency_key_hash = v_key_hash AND operation_id = p_op AND expires_at > v_now LIMIT 1;
    IF v_cached IS NOT NULL THEN
      RETURN jsonb_build_object('ok', true, 'op', p_op, 'replayed', true, 'data', v_cached);
    END IF;
  END IF;

  CASE p_op

  WHEN 'context.resolve' THEN
    v_result := jsonb_build_object(
      'user_id', p_user_id, 'tenant_id', p_tenant_id, 'is_platform_admin', COALESCE(p_is_platform_admin, false),
      'memberships', COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT membership_id, tenant_id, organization_id, status FROM m00.tenant_membership WHERE user_id = p_user_id LIMIT 50) t), '[]'::jsonb),
      'roles', COALESCE((SELECT jsonb_agg(rt.code) FROM m00.role_assignment ra JOIN m00.role_template rt ON rt.role_template_id = ra.role_template_id WHERE ra.user_id = p_user_id), '[]'::jsonb));

  WHEN 'context.switch' THEN
    v_result := jsonb_build_object('tenant_id', (p_payload->>'tenant_id')::uuid, 'switched_at', v_now);
    PERFORM public.m00_emit('abox.m00.context.switched.v1', 'context', COALESCE(p_payload->>'tenant_id', 'null'), (p_payload->>'tenant_id')::uuid, p_payload, 'CONTEXT_SWITCHED', p_user_id, NULL);

  WHEN 'roles.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT role_template_id, code, name, actor_type, status FROM m00.role_template ORDER BY code) t), '[]'::jsonb);

  WHEN 'permissions.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT permission_id, code, resource, action, risk_level FROM m00.permission_definition ORDER BY code) t), '[]'::jsonb);

  WHEN 'roles.matrix' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (
      SELECT rt.code AS role_code, pd.code AS permission_code, g.access
      FROM m00.role_permission_grant g
      JOIN m00.role_template rt ON rt.role_template_id = g.role_template_id
      JOIN m00.permission_definition pd ON pd.permission_id = g.permission_id
      ORDER BY rt.code, pd.code) t), '[]'::jsonb);

  WHEN 'geography.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT * FROM m00.reference_geography LIMIT 200) t), '[]'::jsonb);

  WHEN 'features.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT feature_control_id, feature_code, environment, target_type, target_reference, enabled, effective_from FROM m00.feature_control ORDER BY feature_code LIMIT 200) t), '[]'::jsonb);

  WHEN 'features.set' THEN
    INSERT INTO m00.feature_control (feature_control_id, feature_code, environment, target_type, target_reference, enabled, effective_from, created_by, updated_by)
    VALUES (gen_random_uuid(), p_payload->>'feature_code', COALESCE(p_payload->>'environment', 'local'), COALESCE(p_payload->>'target_type', 'PLATFORM'), p_payload->>'target_reference', COALESCE((p_payload->>'enabled')::boolean, false), v_now, p_user_id, p_user_id)
    RETURNING feature_control_id INTO v_id;
    PERFORM public.m00_emit('abox.m00.feature.control.changed.v1', 'feature_control', v_id::text, p_tenant_id, p_payload, 'FEATURE_CONTROL_CHANGED', p_user_id, NULL);
    v_result := jsonb_build_object('feature_control_id', v_id);

  WHEN 'users.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT user_id, account_status, primary_locale, created_at FROM m00.user_identity ORDER BY created_at DESC LIMIT 100) t), '[]'::jsonb);

  WHEN 'users.create' THEN
    v_id := gen_random_uuid();
    INSERT INTO m00.user_identity (user_id, account_status, primary_locale, created_by, updated_by)
    VALUES (v_id, COALESCE(p_payload->>'account_status', 'PENDING'), COALESCE(p_payload->>'primary_locale', 'en-US'), p_user_id, p_user_id);
    INSERT INTO m00.actor_profile (actor_profile_id, user_id, actor_type, status, created_by, updated_by)
    VALUES (gen_random_uuid(), v_id, COALESCE(p_payload->>'actor_type', 'CONSUMER'), 'ACTIVE', p_user_id, p_user_id);
    PERFORM public.m00_emit('abox.m00.identity.registered.v1', 'user_identity', v_id::text, p_tenant_id, p_payload, 'IDENTITY_REGISTERED', p_user_id, NULL);
    v_result := jsonb_build_object('user_id', v_id);

  WHEN 'memberships.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT membership_id, user_id, tenant_id, organization_id, status, effective_from FROM m00.tenant_membership ORDER BY created_at DESC LIMIT 100) t), '[]'::jsonb);

  WHEN 'memberships.create' THEN
    v_id := gen_random_uuid();
    INSERT INTO m00.tenant_membership (membership_id, user_id, tenant_id, organization_id, status, effective_from, created_by, updated_by)
    VALUES (v_id, (p_payload->>'user_id')::uuid, COALESCE((p_payload->>'tenant_id')::uuid, p_tenant_id), (p_payload->>'organization_id')::uuid, COALESCE(p_payload->>'status', 'ACTIVE'), CURRENT_DATE, p_user_id, p_user_id);
    PERFORM public.m00_emit('abox.m00.membership.changed.v1', 'tenant_membership', v_id::text, COALESCE((p_payload->>'tenant_id')::uuid, p_tenant_id), p_payload, 'MEMBERSHIP_CHANGED', p_user_id, NULL);
    v_result := jsonb_build_object('membership_id', v_id);

  WHEN 'roles.assign' THEN
    v_id := gen_random_uuid();
    INSERT INTO m00.role_assignment (role_assignment_id, user_id, role_template_id, tenant_id, organization_id, effective_from, created_by, updated_by)
    VALUES (v_id, (p_payload->>'user_id')::uuid,
            COALESCE((p_payload->>'role_template_id')::uuid, (SELECT role_template_id FROM m00.role_template WHERE code = p_payload->>'role_code')),
            COALESCE((p_payload->>'tenant_id')::uuid, p_tenant_id), (p_payload->>'organization_id')::uuid, v_now, p_user_id, p_user_id);
    PERFORM public.m00_emit('abox.m00.role.assignment.changed.v1', 'role_assignment', v_id::text, COALESCE((p_payload->>'tenant_id')::uuid, p_tenant_id), p_payload, 'ROLE_ASSIGNMENT_CHANGED', p_user_id, NULL);
    v_result := jsonb_build_object('role_assignment_id', v_id);

  WHEN 'tasks.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT task_id, task_type, related_record_type, tenant_id, assignee_type, status, priority, due_at, created_at FROM m00.task ORDER BY created_at DESC LIMIT 100) t), '[]'::jsonb);

  WHEN 'tasks.create' THEN
    v_id := gen_random_uuid();
    INSERT INTO m00.task (task_id, task_type, related_record_type, related_record_id, tenant_id, assignee_type, assignee_reference, status, priority, due_at, created_by, updated_by)
    VALUES (v_id, COALESCE(p_payload->>'task_type', 'REVIEW'), p_payload->>'related_record_type', (p_payload->>'related_record_id')::uuid,
            COALESCE((p_payload->>'tenant_id')::uuid, p_tenant_id), COALESCE(p_payload->>'assignee_type', 'USER'), COALESCE((p_payload->>'assignee_reference')::uuid, p_user_id),
            'OPEN', COALESCE(p_payload->>'priority', 'NORMAL'), (p_payload->>'due_at')::timestamptz, p_user_id, p_user_id);
    PERFORM public.m00_emit('abox.m00.task.created.v1', 'task', v_id::text, COALESCE((p_payload->>'tenant_id')::uuid, p_tenant_id), p_payload, 'TASK_CREATED', p_user_id, NULL);
    v_result := jsonb_build_object('task_id', v_id);

  WHEN 'tasks.transition' THEN
    UPDATE m00.task SET status = p_payload->>'status', updated_by = p_user_id WHERE task_id = (p_payload->>'task_id')::uuid;
    PERFORM public.m00_emit('abox.m00.task.state.changed.v1', 'task', p_payload->>'task_id', p_tenant_id, p_payload, 'TASK_STATE_CHANGED', p_user_id, NULL);
    v_result := jsonb_build_object('task_id', p_payload->>'task_id', 'status', p_payload->>'status');

  WHEN 'exceptions.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT exception_id, exception_type, severity, related_record_type, responsible_module_id, status, created_at FROM m00.exception ORDER BY created_at DESC LIMIT 100) t), '[]'::jsonb);

  WHEN 'exceptions.raise' THEN
    v_id := gen_random_uuid();
    INSERT INTO m00.exception (exception_id, exception_type, severity, related_record_type, related_record_id, responsible_module_id, owner_reference, status, diagnostic_reference, created_by, updated_by)
    VALUES (v_id, COALESCE(p_payload->>'exception_type', 'INTEGRATION'), COALESCE(p_payload->>'severity', 'MEDIUM'), p_payload->>'related_record_type', (p_payload->>'related_record_id')::uuid,
            COALESCE(p_payload->>'responsible_module_id', 'M00'), p_user_id, 'OPEN', p_payload->>'diagnostic_reference', p_user_id, p_user_id);
    PERFORM public.m00_emit('abox.m00.exception.raised.v1', 'exception', v_id::text, p_tenant_id, p_payload, 'EXCEPTION_RAISED', p_user_id, NULL);
    v_result := jsonb_build_object('exception_id', v_id);

  WHEN 'audit.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT audit_event_id, event_code, actor_user_id, tenant_id, correlation_id, occurred_at, metadata FROM m00.audit_event ORDER BY occurred_at DESC LIMIT 100) t), '[]'::jsonb);

  WHEN 'events.list' THEN
    v_result := COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT event_id, event_name, aggregate_type, aggregate_id, tenant_id, occurred_at, published_at, attempt_count, last_error_code, payload FROM m00.outbox_event ORDER BY occurred_at DESC LIMIT 100) t), '[]'::jsonb);

  WHEN 'events.publish' THEN
    v_id := public.m00_emit(COALESCE(p_payload->>'event_name', 'abox.m00.platform.diagnostic.v1'), COALESCE(p_payload->>'aggregate_type', 'platform'), COALESCE(p_payload->>'aggregate_id', 'manual'), p_tenant_id, COALESCE(p_payload->'data', '{}'::jsonb), 'EVENT_PUBLISHED', p_user_id, NULL);
    v_result := jsonb_build_object('event_id', v_id);

  WHEN 'events.drain' THEN
    WITH drained AS (
      UPDATE m00.outbox_event SET published_at = v_now, attempt_count = attempt_count + 1
      WHERE event_id IN (SELECT event_id FROM m00.outbox_event WHERE published_at IS NULL ORDER BY occurred_at LIMIT COALESCE((p_payload->>'batch_size')::int, 50))
      RETURNING event_id)
    SELECT jsonb_build_object('published', count(*)) INTO v_result FROM drained;

  WHEN 'consent.record' THEN
    v_id := gen_random_uuid();
    INSERT INTO m00.consent_evidence (consent_evidence_id, consent_definition_id, subject_user_id, tenant_id, captured_at, capture_channel, evidence_reference, created_by, updated_by)
    VALUES (v_id, (p_payload->>'consent_definition_id')::uuid, COALESCE((p_payload->>'subject_user_id')::uuid, p_user_id), COALESCE((p_payload->>'tenant_id')::uuid, p_tenant_id), v_now, COALESCE(p_payload->>'capture_channel', 'WEB'), p_payload->>'evidence_reference', p_user_id, p_user_id);
    PERFORM public.m00_emit('abox.m00.consent.recorded.v1', 'consent_evidence', v_id::text, p_tenant_id, p_payload, 'CONSENT_RECORDED', p_user_id, NULL);
    v_result := jsonb_build_object('consent_evidence_id', v_id);

  WHEN 'status' THEN
    v_result := public.m00_foundation_status();

  ELSE
    RETURN jsonb_build_object('ok', false, 'op', p_op, 'error', 'unsupported_operation');
  END CASE;

  IF p_idempotency_key IS NOT NULL THEN
    INSERT INTO m00.idempotency_record (idempotency_record_id, tenant_id, actor_user_id, operation_id, idempotency_key_hash, request_hash, response_status, response_body, created_at, expires_at)
    VALUES (gen_random_uuid(), p_tenant_id, p_user_id, p_op, v_key_hash, encode(digest(p_payload::text, 'sha256'), 'hex'), 200, v_result, v_now, v_now + interval '24 hours');
  END IF;

  RETURN jsonb_build_object('ok', true, 'op', p_op, 'replayed', false, 'data', v_result);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('ok', false, 'op', p_op, 'error', SQLERRM, 'sqlstate', SQLSTATE);
END;
$$;

REVOKE ALL ON FUNCTION public.m00_set_request_context(uuid, uuid, boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.m00_emit(text, text, text, uuid, jsonb, text, uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.m00_api(text, jsonb, uuid, uuid, boolean, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.m00_foundation_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.m00_api(text, jsonb, uuid, uuid, boolean, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.m00_foundation_status() TO service_role;