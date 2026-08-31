ALTER FUNCTION m00.current_user_id() SET search_path = m00, public, pg_temp;
ALTER FUNCTION m00.current_tenant_id() SET search_path = m00, public, pg_temp;
ALTER FUNCTION m00.is_platform_admin() SET search_path = m00, public, pg_temp;
ALTER FUNCTION m00.touch_version() SET search_path = m00, public, pg_temp;
ALTER FUNCTION m00.prevent_mutation() SET search_path = m00, public, pg_temp;