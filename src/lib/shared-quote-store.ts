/**
 * Shared Quote — client-side persistence keyed by the tokenized link
 * generated in Agent Send Quote (UX-019) and resolved by the read-only
 * Shared Quote view (UX-020). There is no backend yet (see
 * src/integrations/supabase), so this uses localStorage rather than
 * sessionStorage — it must survive opening the link in a fresh tab, not
 * just a refresh — which means it only actually resolves within the same
 * browser the agent sent it from. That's an intentional, honest
 * limitation of a Wave-1 build without a real backend: the token
 * mechanics, expiration, and recipient-facing plan selection are real,
 * but true cross-device delivery requires the persistence layer this
 * package doesn't have yet.
 */

export interface SharedQuotePackage {
  token: string;
  planIds: string[];
  recipientLabel: string;
  channel: "email" | "sms" | "link";
  createdAt: string; // ISO
  expiresInDays: number;
  agentName: string;
}

const KEY_PREFIX = "abox_shared_quote_";

export function generateShareToken(): string {
  return `HND-${Date.now().toString(36).toUpperCase()}`;
}

export function saveSharedQuote(pkg: SharedQuotePackage): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_PREFIX + pkg.token, JSON.stringify(pkg));
  } catch {
    /* quota / privacy mode — silently skip */
  }
}

export function loadSharedQuote(token: string): SharedQuotePackage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + token);
    return raw ? (JSON.parse(raw) as SharedQuotePackage) : null;
  } catch {
    return null;
  }
}

export function isSharedQuoteExpired(pkg: SharedQuotePackage): boolean {
  const created = new Date(pkg.createdAt).getTime();
  const expiryMs = created + pkg.expiresInDays * 24 * 60 * 60 * 1000;
  return Date.now() > expiryMs;
}
