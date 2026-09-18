/**
 * Canonical marketplace page-wrapper classes (Phase 38).
 *
 * Class-level only: consumers retain their native element, DOM position,
 * children, state, and behavior. These two values are limited to the exact
 * wide content-page and narrow workflow-page roles proven in production.
 */
export const MARKETPLACE_PAGE_LAYOUT = {
  wide: "mx-auto max-w-[88rem] px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-6",
  narrow: "mx-auto max-w-4xl px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6",
} as const;