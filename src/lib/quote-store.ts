/**
 * ABox Quote Wizard — shared types, zod schemas, and sessionStorage
 * persistence for UX-003 → UX-008. Each step has its own strict schema
 * so the wizard can validate before moving forward, but data is kept
 * as one object so users can go back and edit without losing state.
 */
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Static option catalogs                                              */
/* ------------------------------------------------------------------ */

export const RELATIONSHIPS = ["primary", "spouse", "domestic_partner", "child", "other_dependent"] as const;
export type Relationship = (typeof RELATIONSHIPS)[number];

export const RELATIONSHIP_LABEL: Record<Relationship, string> = {
  primary: "Primary applicant",
  spouse: "Spouse",
  domestic_partner: "Domestic partner",
  child: "Child",
  other_dependent: "Other dependent",
};

export const SEX_OPTIONS = ["female", "male"] as const;
export type Sex = (typeof SEX_OPTIONS)[number];

export const USAGE_LEVELS = [
  { key: "low", label: "Rarely use care", body: "Preventive visits, occasional urgent care." },
  { key: "moderate", label: "Steady, predictable care", body: "A few visits a year, maybe one recurring Rx." },
  { key: "high", label: "Frequent or complex care", body: "Ongoing conditions, specialists, regular Rx." },
] as const;
export type UsageLevel = (typeof USAGE_LEVELS)[number]["key"];

export const PRIORITIES = [
  { key: "premium", label: "Low monthly premium", hint: "Keep the monthly bill down" },
  { key: "deductible", label: "Low deductible", hint: "Care kicks in sooner" },
  { key: "doctor", label: "Keep my doctor", hint: "In-network for a specific provider" },
  { key: "rx", label: "Prescription coverage", hint: "Especially specialty or brand Rx" },
  { key: "network", label: "Broad network", hint: "Travel or specialists across states" },
  { key: "hsa", label: "HSA eligibility", hint: "Tax-advantaged savings for care" },
] as const;
export type PriorityKey = (typeof PRIORITIES)[number]["key"];

/* ------------------------------------------------------------------ */
/* Validation helpers                                                  */
/* ------------------------------------------------------------------ */

const zipRegex = /^\d{5}$/;
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Enter a valid date." });

/** DOB must be a real past date and imply age 0–120. */
const dobSchema = isoDate.refine(
  (v) => {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return false;
    const now = new Date();
    if (d > now) return false;
    const age = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age <= 120;
  },
  { message: "Enter a real date of birth." },
);

/* ------------------------------------------------------------------ */
/* Step schemas                                                         */
/* ------------------------------------------------------------------ */

/** UX-003 — ZIP + effective date */
export const step1Schema = z.object({
  zip: z
    .string()
    .trim()
    .regex(zipRegex, { message: "ZIP must be 5 digits." }),
  effectiveDate: isoDate.refine(
    (v) => {
      const d = new Date(v + "T00:00:00");
      const min = new Date();
      min.setHours(0, 0, 0, 0);
      return d >= min;
    },
    { message: "Effective date must be today or later." },
  ),
});

/** UX-004 — Household members. Exactly one primary; each with DOB, sex, tobacco. */
const memberSchema = z.object({
  id: z.string(),
  relationship: z.enum(RELATIONSHIPS),
  dob: dobSchema,
  sex: z.enum(SEX_OPTIONS),
  tobacco: z.boolean(),
});
export type Member = z.infer<typeof memberSchema>;

export const step2Schema = z.object({
  members: z
    .array(memberSchema)
    .min(1, { message: "Add at least the primary applicant." })
    .max(10, { message: "Maximum 10 members." })
    .refine(
      (arr) => arr.filter((m) => m.relationship === "primary").length === 1,
      { message: "Exactly one primary applicant is required." },
    ),
});

/** UX-005 — Goals + usage */
export const step3Schema = z.object({
  priorities: z
    .array(z.enum(PRIORITIES.map((p) => p.key) as [PriorityKey, ...PriorityKey[]]))
    .min(1, { message: "Pick at least one priority." })
    .max(3, { message: "Pick up to three priorities — Plan-O works best with focus." }),
  usage: z.enum(["low", "moderate", "high"] as const, {
    errorMap: () => ({ message: "Choose an expected usage level." }),
  }),
  keepDoctor: z.boolean(),
});

/** UX-006 — Optional provider + drug lookup */
const providerSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }).max(80),
  kind: z.enum(["pcp", "specialist", "hospital"] as const),
});
const drugSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }).max(80),
  dosage: z.string().trim().max(60).optional().or(z.literal("")),
});
export const step4Schema = z
  .object({
    skipLookup: z.boolean(),
    providers: z.array(providerSchema).max(10),
    drugs: z.array(drugSchema).max(20),
  })
  .refine((v) => v.skipLookup || v.providers.length + v.drugs.length > 0, {
    message: "Add a provider or drug — or choose Skip.",
    path: ["skipLookup"],
  });
export type Provider = z.infer<typeof providerSchema>;
export type Drug = z.infer<typeof drugSchema>;

/** UX-007 — Optional subsidy inputs */
export const step5Schema = z
  .object({
    skipSubsidy: z.boolean(),
    income: z
      .number({ invalid_type_error: "Enter your estimated annual income." })
      .int({ message: "Whole dollars only." })
      .min(0)
      .max(2_000_000)
      .optional(),
    taxHouseholdSize: z
      .number({ invalid_type_error: "Enter tax household size." })
      .int()
      .min(1, { message: "At least 1 person in the tax household." })
      .max(20)
      .optional(),
  })
  .refine((v) => v.skipSubsidy || (v.income !== undefined && v.taxHouseholdSize !== undefined), {
    message: "Enter income + household — or choose Skip.",
    path: ["income"],
  });

/* Full wizard state -------------------------------------------------- */

export interface QuoteState {
  zip: string;
  effectiveDate: string; // ISO yyyy-mm-dd
  county?: string;       // resolved from ZIP (stub for now)
  members: Member[];
  priorities: PriorityKey[];
  usage?: UsageLevel;
  keepDoctor: boolean;
  skipLookup: boolean;
  providers: Provider[];
  drugs: Drug[];
  skipSubsidy: boolean;
  income?: number;
  taxHouseholdSize?: number;
}

export function defaultEffectiveDate(): string {
  const now = new Date();
  const y = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const m = (now.getMonth() + 1) % 12;
  const first = new Date(y, m, 1);
  const iso = first.toISOString().slice(0, 10);
  return iso;
}

export function defaultQuoteState(): QuoteState {
  return {
    zip: "",
    effectiveDate: defaultEffectiveDate(),
    county: undefined,
    members: [
      { id: cryptoRandomId(), relationship: "primary", dob: "", sex: "female", tobacco: false },
    ],
    priorities: [],
    usage: undefined,
    keepDoctor: false,
    skipLookup: false,
    providers: [],
    drugs: [],
    skipSubsidy: false,
    income: undefined,
    taxHouseholdSize: undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "abox_quote_v1";

export function loadQuoteState(): QuoteState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuoteState;
    // Best-effort revive — ensure at least one member exists
    if (!parsed.members || parsed.members.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveQuoteState(state: QuoteState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / privacy mode — silently skip */
  }
}

export function clearQuoteState(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

/* ------------------------------------------------------------------ */
/* Utility                                                             */
/* ------------------------------------------------------------------ */

export function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10);
}

/** Stubbed ZIP → county resolver so Wave 1 feels alive without EDE. */
export function resolveCountyStub(zip: string): string | undefined {
  if (!zipRegex.test(zip)) return undefined;
  const map: Record<string, string> = {
    "30301": "Fulton County, GA",
    "10001": "New York County, NY",
    "78701": "Travis County, TX",
    "94103": "San Francisco County, CA",
    "60601": "Cook County, IL",
    "33101": "Miami-Dade County, FL",
    "98101": "King County, WA",
  };
  if (map[zip]) return map[zip];
  const first = zip[0];
  const region =
    first === "0" || first === "1" ? "Northeast Region" :
    first === "2" || first === "3" ? "Southeast Region" :
    first === "4" || first === "5" || first === "6" ? "Midwest Region" :
    first === "7" ? "South Central Region" :
    "West Region";
  return `${zip} · ${region}`;
}

/** Household APTC-eligible income band, for the subsidy education card. */
export function fplBand(income: number | undefined, hh: number | undefined): {
  band: "below" | "cost-share" | "aptc" | "over" | "unknown";
  pctFpl?: number;
} {
  if (!income || !hh) return { band: "unknown" };
  // 2024 FPL — rough table, illustrative only
  const base = 15060 + (hh - 1) * 5380;
  const pct = (income / base) * 100;
  if (pct < 100) return { band: "below", pctFpl: pct };
  if (pct <= 250) return { band: "cost-share", pctFpl: pct };
  if (pct <= 400) return { band: "aptc", pctFpl: pct };
  return { band: "over", pctFpl: pct };
}

/** Illustrative APTC estimate — clearly labeled as education, not promise. */
export function estimateMonthlyAPTC(income: number | undefined, hh: number | undefined): number | undefined {
  if (!income || !hh) return undefined;
  const { band, pctFpl } = fplBand(income, hh);
  if (band === "over" || band === "below" || pctFpl === undefined) return 0;
  // Simple sliding-scale placeholder: 8.5% cap of income → benchmark $520
  const benchmarkMonthly = 520;
  const expectedContribPct = Math.min(0.085, Math.max(0.02, pctFpl / 4000));
  const contribMonthly = (income * expectedContribPct) / 12;
  return Math.max(0, Math.round(benchmarkMonthly - contribMonthly));
}

/**
 * Recommended exchange-view default (BR-006): on-exchange if the shopper
 * checked subsidy and qualifies, off-exchange if checked and doesn't,
 * otherwise "all" (no subsidy signal).
 */
export function recommendedExchangeView(
  q: Pick<QuoteState, "skipSubsidy" | "income" | "taxHouseholdSize"> | null,
): "all" | "on" | "off" {
  if (!q || q.skipSubsidy || q.income == null || q.taxHouseholdSize == null) return "all";
  const aptc = estimateMonthlyAPTC(q.income, q.taxHouseholdSize);
  return aptc && aptc > 0 ? "on" : "off";
}

const SAVED_AT_KEY = "abox_quote_saved_at_v1";

export function markProgressSaved(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SAVED_AT_KEY, new Date().toISOString());
  } catch {
    /* ignore */
  }
}

export function getLastSavedAt(): Date | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SAVED_AT_KEY);
    return raw ? new Date(raw) : null;
  } catch {
    return null;
  }
}
