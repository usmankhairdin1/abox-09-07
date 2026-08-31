REVOKE ALL ON FUNCTION public.m00_set_request_context(uuid, uuid, boolean) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.m00_emit(text, text, text, uuid, jsonb, text, uuid, uuid) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.m00_api(text, jsonb, uuid, uuid, boolean, text) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.m00_foundation_status() FROM anon, authenticated;