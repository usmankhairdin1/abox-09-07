/**
 * Auth gating for the internal workspace, agency/platform admin areas and
 * the member area. Unauthenticated visitors are redirected to /auth with a
 * `redirect` search param so they land back where they intended after
 * signing in.
 */
export const ENFORCE_LOGIN = true;

export async function requireSessionIfEnforced(href?: string): Promise<void> {
  if (!ENFORCE_LOGIN) return;
  if (typeof window === "undefined") return;

  const { supabase } = await import("@/integrations/supabase/client");
  const { redirect } = await import("@tanstack/react-router");
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw redirect({
      to: "/auth",
      search: href ? { redirect: href } : ({} as { redirect?: string }),
    });
  }
}

export async function signOutAndLeave(): Promise<void> {
  const { supabase } = await import("@/integrations/supabase/client");
  await supabase.auth.signOut();
  window.location.assign("/auth");
}
