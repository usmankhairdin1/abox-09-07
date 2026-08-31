/**
 * Lightweight auth-session stub used by internal/admin surfaces.
 * In a production build this is replaced by the Supabase session provider.
 */

export interface AuthSession {
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
  };
}

let _session: AuthSession | null = {
  user: {
    id: "user-elena",
    email: "elena@cedargrove.example",
    name: "Elena Alvarez",
  },
};

export function useAuthSession(): { session: AuthSession | null } {
  return { session: _session };
}

export function setAuthSession(session: AuthSession | null): void {
  _session = session;
}
