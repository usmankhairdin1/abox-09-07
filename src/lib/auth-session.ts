/**
 * Real Supabase auth session — replaces the earlier local-only
 * demo-session shim (src/lib/demo-session.ts, now retired) now that
 * real registration/sign-in is wired in auth.tsx. Wraps supabase.auth
 * as a React external store so any component can read the live session.
 */
import { useSyncExternalStore } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthSnapshot {
  session: Session | null;
  loading: boolean;
}

/** Returns the best available human name from the auth user record.
 *  Prefers name-oriented metadata fields over identifiers/email so the
 *  header profile button shows the user's name, not their address. */
export function getDisplayNameFromUser(user: User | null | undefined): string {
  if (!user) return "Account";
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const firstName = typeof meta.first_name === "string" ? meta.first_name.trim() : "";
  const lastName = typeof meta.last_name === "string" ? meta.last_name.trim() : "";
  const fullFromParts = firstName || lastName ? `${firstName} ${lastName}`.trim() : "";
  const candidates = [
    typeof meta.full_name === "string" ? meta.full_name.trim() : "",
    typeof meta.name === "string" ? meta.name.trim() : "",
    fullFromParts,
    typeof meta.preferred_username === "string" ? meta.preferred_username.trim() : "",
    typeof meta.username === "string" ? meta.username.trim() : "",
  ];
  const found = candidates.find((v) => v.length > 0);
  return found ?? "Account";
}

// useSyncExternalStore requires getSnapshot to return a stable reference
// when nothing changed — a fresh object literal on every call causes an
// infinite re-render loop ("Maximum update depth exceeded"), so the
// snapshot is only rebuilt inside notify(), never inside the getter.
let snapshot: AuthSnapshot = { session: null, loading: true };
const SERVER_SNAPSHOT: AuthSnapshot = { session: null, loading: true };
const listeners = new Set<() => void>();

function notify(session: Session | null, initialized: boolean) {
  snapshot = { session, loading: !initialized };
  for (const l of listeners) l();
}

if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => {
    notify(data.session, true);
  });
  supabase.auth.onAuthStateChange((_event, newSession) => {
    notify(newSession, true);
  });
}

export function useAuthSession(): AuthSnapshot {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
    () => SERVER_SNAPSHOT,
  );
}

export function getCurrentSession(): Session | null {
  return snapshot.session;
}
