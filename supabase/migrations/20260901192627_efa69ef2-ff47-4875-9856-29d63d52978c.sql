ALTER FUNCTION public.abox_m06_permissions_for_role(text) SET search_path = public;

REVOKE ALL ON FUNCTION public.abox_resolve_context(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.abox_sync_m06_grants(uuid, uuid, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.abox_m06_permissions_for_role(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.abox_is_tenant_member(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.abox_resolve_context(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.abox_sync_m06_grants(uuid, uuid, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.abox_m06_permissions_for_role(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.abox_is_tenant_member(uuid) TO authenticated, service_role;