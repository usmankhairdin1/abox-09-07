/**
 * FLOW-M05-001 — Create one direct downline (SCR-M05-007..014).
 * Wizard state shared across the 8 distinct step routes, persisted to
 * sessionStorage so back/forward and refresh don't lose progress —
 * same pattern as src/lib/quote-store.ts.
 */
import { z } from "zod";
import type { IdentifierType, Language } from "./org-store";

export const step7IdentitySchema = z.object({
  legal_name: z.string().trim().min(2, { message: "Enter the legal business name." }).max(200),
  display_name: z.string().trim().min(2, { message: "Enter a display name." }).max(120),
  dba_name: z.string().trim().max(120).optional().or(z.literal("")),
});

export const step8LegalSchema = z.object({
  identifier_type: z.enum(["EIN", "AGENCY_NPN", "NAIC_CARRIER_CODE", "JET_CUSTOMER_CODE", "VENDOR_REFERENCE", "PARTNER_REFERENCE", "EXTERNAL_ORGANIZATION_CODE"] as const),
  identifier_value: z.string().trim().min(4, { message: "Enter the identifier value." }).max(40),
  time_zone: z.string().min(1, { message: "Choose a time zone." }),
  default_language: z.enum(["EN", "ES"] as const),
});

export const step9ContactSchema = z.object({
  contact_name: z.string().trim().min(2, { message: "Enter the contact's name." }).max(120),
  job_title: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email({ message: "Enter a valid email address." }),
  telephone: z.string().trim().min(7, { message: "Enter a valid phone number." }).max(20),
  preferred_language: z.enum(["EN", "ES"] as const),
});

export const step10LocationSchema = z.object({
  line_1: z.string().trim().min(2, { message: "Enter a street address." }).max(200),
  line_2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, { message: "Enter a city." }).max(100),
  state_code: z.string().trim().length(2, { message: "Use a 2-letter state code." }),
  postal_code: z.string().trim().regex(/^\d{5}$/, { message: "Postal code must be 5 digits." }),
});

export const step12AdministratorSchema = z.object({
  admin_name: z.string().trim().min(2, { message: "Enter the administrator's name." }).max(120),
  admin_email: z.string().trim().email({ message: "Enter a valid email address." }),
});

export interface DownlineWizardState {
  identity: { legal_name: string; display_name: string; dba_name: string };
  legal: { identifier_type: IdentifierType; identifier_value: string; time_zone: string; default_language: Language };
  contact: { contact_name: string; job_title: string; email: string; telephone: string; preferred_language: Language };
  location: { line_1: string; line_2: string; city: string; state_code: string; postal_code: string };
  settings: { quote_expiration_days: number; copy_root_defaults: boolean };
  administrator: { admin_name: string; admin_email: string };
  duplicateAcknowledged: boolean;
}

export function defaultWizardState(): DownlineWizardState {
  return {
    identity: { legal_name: "", display_name: "", dba_name: "" },
    legal: { identifier_type: "EIN", identifier_value: "", time_zone: "America/New_York", default_language: "EN" },
    contact: { contact_name: "", job_title: "", email: "", telephone: "", preferred_language: "EN" },
    location: { line_1: "", line_2: "", city: "", state_code: "", postal_code: "" },
    settings: { quote_expiration_days: 7, copy_root_defaults: true },
    administrator: { admin_name: "", admin_email: "" },
    duplicateAcknowledged: false,
  };
}

const STORAGE_KEY = "abox_downline_wizard_v1";

export function loadWizardState(): DownlineWizardState {
  if (typeof window === "undefined") return defaultWizardState();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultWizardState();
    return { ...defaultWizardState(), ...(JSON.parse(raw) as Partial<DownlineWizardState>) };
  } catch {
    return defaultWizardState();
  }
}
export function saveWizardState(state: DownlineWizardState): void {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
}
export function clearWizardState(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export const TIME_ZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu",
];
