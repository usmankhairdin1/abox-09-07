/**
 * Auth gating switch for the internal workspace and member area.
 *
 * Demo mode is ON: /app/* and /member/* are open to everyone.
 * Flip ENFORCE_LOGIN to true to require a signed-in session; the route
 * guard below then redirects unauthenticated visitors to /auth.
 */
export const ENFORCE_LOGIN = false;

export async function requireSessionIfEnforced(): Promise<void> {
  if (!ENFORCE_LOGIN) return;
  if (typeof window === "undefined") return;

  const { supabase } = await import("@/integrations/supabase/client");
  const { redirect } = await import("@tanstack/react-router");
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw redirect({ to: "/auth" });
  }
}
