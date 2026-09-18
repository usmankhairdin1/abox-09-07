/**
 * ABox action pill — the rounded action button/link treatment that is
 * repeated verbatim across many routes.
 *
 * These are the EXACT class strings already used in production; this module
 * only gives them a single owner so a change lands everywhere at once.
 * Values are byte-identical to the previous inline strings — importing them
 * must never alter rendered output.
 *
 * Naming: <variant><Size>
 *   primary  — filled primary action
 *   outline  — bordered secondary action
 *   Xs/Sm/Md/Lg — h-8 / h-9 / h-10 / h-11
 */
export const ACTION_PILL = {
  /** h-8 filled pill — compact inline action. */
  primaryXs:
    "inline-flex h-8 items-center gap-1 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90",
  /** h-10 filled pill — default page/section action. */
  primaryMd:
    "inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90",
  /** h-11 filled pill — prominent/marketing action. */
  primaryLg:
    "inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90",

  /** h-8 bordered pill — compact secondary action. */
  outlineXs:
    "inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium hover:bg-accent",
  /** h-9 bordered pill — dense toolbar action. */
  outlineSm:
    "inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium hover:bg-accent",
  /** h-9 bordered pill on a card surface. */
  outlineSmCard:
    "inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium hover:bg-accent",
  /** h-10 bordered pill — default secondary action. */
  outlineMd:
    "inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:bg-accent",
  /** h-11 bordered pill — prominent secondary action. */
  outlineLg:
    "inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium hover:bg-accent",

  /**
   * Phase 37 additive variants. Byte-identical copies of literals already in
   * production; they are deliberately NOT merged with the variants above —
   * these carry no `gap-*` (no icon slot) and differ in weight/padding/hover.
   */
  /** h-10 bordered pill, no icon gap, regular weight — text-only secondary action. */
  outlineMdPlain:
    "inline-flex h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent",
  /** h-11 filled pill, no icon gap, no hover rule — text-only primary submit/continue. */
  primaryLgPlain:
    "inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground",
} as const;

export type ActionPillVariant = keyof typeof ACTION_PILL;
