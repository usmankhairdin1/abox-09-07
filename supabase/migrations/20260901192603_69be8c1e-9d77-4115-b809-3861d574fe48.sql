
-- =====================================================================
-- Stage 1: remove the platform-admin bypass; resolve real actor context.
-- =====================================================================

-- ---------- canonical tenant + organizations (M05 owns these) ----------
INSERT INTO lucie_m05.tenant (
  tenant_id, reference_code, display_name, lifecycle_status, boundary_classification,
  effective_from, created_by, updated_by)
VALUES ('11111111-1111-4111-8111-111111111111', 'JET_HEALTH', 'JET Health Solutions', 'ACTIVE',
  'US_DOMESTIC', now(), '00000000-0000-4000-8000-000000000000', '00000000-0000-4000-8000-000000000000')
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO lucie_m05.organization (
  organization_id, tenant_id, reference_code, legal_name, display_name, dba_name,
  organization_type, lifecycle_status, primary_business_email, time_zone, default_language,
  effective_from, created_by, updated_by)
VALUES
  ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'AGY_NE',
   'Northeast Benefit Advisors LLC', 'Northeast Benefit Advisors', 'Northeast Benefits',
   'AGENCY', 'ACTIVE', 'ops@northeastbenefits.example', 'America/New_York', 'EN', now(),
   '00000000-0000-4000-8000-000000000000', '00000000-0000-4000-8000-000000000000'),
  ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'AGY_SW',
   'Southwest Coverage Partners LLC', 'Southwest Coverage Partners', 'Southwest Coverage',
   'AGENCY', 'ACTIVE', 'ops@southwestcoverage.example', 'America/Phoenix', 'EN', now(),
   '00000000-0000-4000-8000-000000000000', '00000000-0000-4000-8000-000000000000')
ON CONFLICT (organization_id) DO NOTHING;

-- ---------- helper: is the caller a member of this tenant? ----------
CREATE OR REPLACE FUNCTION public.abox_is_tenant_member(p_tenant_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = m00, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM m00.tenant_membership tm
     WHERE tm.user_id = auth.uid()
       AND tm.tenant_id = p_tenant_id
       AND tm.status = 'ACTIVE'
       AND (tm.effective_to IS NULL OR tm.effective_to >= current_date)
  );
$$;

-- ---------- M06 permission set per role template ----------
CREATE OR REPLACE FUNCTION public.abox_m06_permissions_for_role(p_role_code text)
RETURNS text[]
LANGUAGE sql IMMUTABLE
AS $$
  SELECT CASE p_role_code
    WHEN 'AGENCY_ADMIN' THEN ARRAY[
      'workforce.profile.read','workforce.profile.create','workforce.profile.update',
      'workforce.lifecycle.manage','affiliation.manage','group.manage',
      'workforce.readiness.read','workforce.note.manage','exception.manage',
      'agency.profile.manage','identity.review.manage','roster.transfer.manage',
      'operations.read','support.context.manage','access.role.read']
    WHEN 'SELLING_AGENT' THEN ARRAY[
      'workforce.profile.read','workforce.readiness.read','workforce.note.manage','access.role.read']
    WHEN 'UNLICENSED_STAFF' THEN ARRAY[
      'workforce.profile.read','workforce.readiness.read','access.role.read']
    ELSE ARRAY[]::text[]
  END;
$$;

-- ---------- sync M06 grants from an M00 role assignment ----------
CREATE OR REPLACE FUNCTION public.abox_sync_m06_grants(
  p_user_id uuid, p_tenant_id uuid, p_organization_id uuid, p_role_code text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = lucie_m06, public
AS $$
DECLARE v_perm text;
BEGIN
  DELETE FROM lucie_m06.permission_grant
   WHERE user_id = p_user_id AND tenant_id = p_tenant_id
     AND organization_id IS NOT DISTINCT FROM p_organization_id;

  FOREACH v_perm IN ARRAY public.abox_m06_permissions_for_role(p_role_code) LOOP
    INSERT INTO lucie_m06.permission_grant (user_id, tenant_id, organization_id, permission, scope_type)
    VALUES (p_user_id, p_tenant_id, p_organization_id, v_perm, 'ORGANIZATION');
  END LOOP;
END;
$$;

-- ---------- provision + resolve the acting context ----------
CREATE OR REPLACE FUNCTION public.abox_resolve_context(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = m00, public
AS $$
DECLARE
  v_tenant uuid := '11111111-1111-4111-8111-111111111111';
  v_default_org uuid := '22222222-2222-4222-8222-222222222222';
  v_role_code text;
  v_role_id uuid;
  v_org uuid;
  v_is_admin boolean;
  v_orgs jsonb;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'UNAUTHENTICATED');
  END IF;

  -- first sight of a signed-in user: register identity + baseline membership
  INSERT INTO m00.user_identity (user_id, account_status, primary_locale, created_by, updated_by)
  VALUES (p_user_id, 'ACTIVE', 'en-US', p_user_id, p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM m00.tenant_membership WHERE user_id = p_user_id) THEN
    INSERT INTO m00.tenant_membership (user_id, tenant_id, organization_id, status, effective_from, created_by, updated_by)
    VALUES (p_user_id, v_tenant, v_default_org, 'ACTIVE', current_date, p_user_id, p_user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM m00.role_assignment WHERE user_id = p_user_id) THEN
    SELECT role_template_id INTO v_role_id FROM m00.role_template WHERE code = 'AGENCY_ADMIN';
    INSERT INTO m00.role_assignment (user_id, tenant_id, organization_id, role_template_id, effective_from, created_by, updated_by)
    VALUES (p_user_id, v_tenant, v_default_org, v_role_id, now(), p_user_id, p_user_id);
  END IF;

  SELECT rt.code, ra.organization_id, ra.tenant_id
    INTO v_role_code, v_org, v_tenant
    FROM m00.role_assignment ra
    JOIN m00.role_template rt ON rt.role_template_id = ra.role_template_id
   WHERE ra.user_id = p_user_id
     AND ra.effective_from <= now()
     AND (ra.effective_to IS NULL OR ra.effective_to > now())
   ORDER BY CASE rt.code WHEN 'JET_PLATFORM_ADMIN' THEN 0 WHEN 'AGENCY_ADMIN' THEN 1 ELSE 2 END
   LIMIT 1;

  IF v_role_code IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'NO_EFFECTIVE_ROLE',
      'reason', 'No active role assignment; access is denied until a role is granted.');
  END IF;

  v_is_admin := (v_role_code = 'JET_PLATFORM_ADMIN');

  -- platform administrators act across organizations; everyone else is org-scoped
  IF v_org IS NULL AND NOT v_is_admin THEN
    RETURN jsonb_build_object('ok', false, 'code', 'CONTEXT_AMBIGUOUS',
      'reason', 'Role assignment has no organization scope; ambiguous context is denied.');
  END IF;
  IF v_org IS NULL THEN v_org := v_default_org; END IF;

  PERFORM public.abox_sync_m06_grants(p_user_id, v_tenant, v_org, v_role_code);

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'organization_id', o.organization_id,
           'display_name', o.display_name) ORDER BY o.display_name), '[]'::jsonb)
    INTO v_orgs
    FROM lucie_m05.organization o
   WHERE o.tenant_id = v_tenant
     AND (v_is_admin OR o.organization_id = v_org);

  RETURN jsonb_build_object(
    'ok', true,
    'user_id', p_user_id,
    'tenant_id', v_tenant,
    'organization_id', v_org,
    'role_code', v_role_code,
    'is_platform_admin', v_is_admin,
    'organizations', v_orgs,
    'permissions', to_jsonb(public.abox_m06_permissions_for_role(v_role_code)));
END;
$$;

-- ---------- known operators get their intended roles ----------
DO $$
DECLARE
  v_tenant uuid := '11111111-1111-4111-8111-111111111111';
  v_admin_role uuid;
  u record;
BEGIN
  SELECT role_template_id INTO v_admin_role FROM m00.role_template WHERE code = 'JET_PLATFORM_ADMIN';
  FOR u IN SELECT id FROM auth.users LOOP
    PERFORM public.abox_resolve_context(u.id);
  END LOOP;

  -- the first registered operator runs the platform
  UPDATE m00.role_assignment ra
     SET role_template_id = v_admin_role, updated_at = now()
   WHERE ra.user_id = (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)
     AND ra.tenant_id = v_tenant;
END $$;

-- ---------- tenant-scoped read visibility (writes stay in governed RPC) ----------
SET CONSTRAINTS ALL IMMEDIATE;

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.table_schema, c.table_name
      FROM information_schema.columns c
      JOIN information_schema.tables t
        ON t.table_schema = c.table_schema AND t.table_name = c.table_name
     WHERE c.table_schema IN ('lucie_m06','lucie_m05','m00')
       AND c.column_name = 'tenant_id'
       AND t.table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.table_schema, r.table_name);
    EXECUTE format('GRANT SELECT ON %I.%I TO authenticated', r.table_schema, r.table_name);
    EXECUTE format('DROP POLICY IF EXISTS abox_tenant_read ON %I.%I', r.table_schema, r.table_name);
    EXECUTE format(
      'CREATE POLICY abox_tenant_read ON %I.%I FOR SELECT TO authenticated USING (public.abox_is_tenant_member(tenant_id))',
      r.table_schema, r.table_name);
  END LOOP;
END $$;

-- reference/catalogue tables carry no tenant: readable by any signed-in user
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT t.table_schema, t.table_name
      FROM information_schema.tables t
     WHERE t.table_schema IN ('lucie_m06','lucie_m05','m00')
       AND t.table_type = 'BASE TABLE'
       AND NOT EXISTS (
         SELECT 1 FROM information_schema.columns c
          WHERE c.table_schema = t.table_schema AND c.table_name = t.table_name
            AND c.column_name = 'tenant_id')
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.table_schema, r.table_name);
    EXECUTE format('GRANT SELECT ON %I.%I TO authenticated', r.table_schema, r.table_name);
    EXECUTE format('DROP POLICY IF EXISTS abox_signed_in_read ON %I.%I', r.table_schema, r.table_name);
    EXECUTE format(
      'CREATE POLICY abox_signed_in_read ON %I.%I FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL)',
      r.table_schema, r.table_name);
  END LOOP;
END $$;

GRANT USAGE ON SCHEMA lucie_m05, lucie_m06, m00 TO authenticated;
REVOKE EXECUTE ON FUNCTION public.abox_resolve_context(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.abox_sync_m06_grants(uuid, uuid, uuid, text) FROM anon, authenticated;
