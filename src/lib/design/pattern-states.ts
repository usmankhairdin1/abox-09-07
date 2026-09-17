/**
 * Phase 10 — pattern-level states.
 * DOCUMENTATION ONLY. A state is listed only where the code handles it.
 * Where a state is not handled, the record says FUTURE DECISION with the
 * reason instead of describing behaviour that does not exist.
 */
import type { PatternStateRecord } from "./pattern-spec-types";

export const PATTERN_STATES: PatternStateRecord[] = [
  { patternId: "pat.filter-results", state: "default", behavior: "Rail beside results; counts reflect the active filters.", evidence: "plans.index.tsx", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.filter-results", state: "selected", behavior: "Filter chips carry aria-pressed. Exchange chips deliberately show no visible selection ring.", evidence: "plans.index.tsx filter chips", status: "OBSERVED VARIATION" },
  { patternId: "pat.filter-results", state: "empty", behavior: "EmptyState replaces the result grid.", evidence: "EmptyState usage", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.filter-results", state: "collapsed", behavior: "Below lg the rail is removed and a trigger opens the filter dialog.", evidence: "plans.index.tsx lines 244, 279, 374", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.filter-results", state: "error", behavior: "Not handled at pattern level.", evidence: "No error branch in the route", status: "FUTURE DECISION" },

  { patternId: "pat.page-header", state: "default", behavior: "Title, optional description and actions with a closing hairline.", evidence: "page-header.tsx", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.page-header", state: "loading", behavior: "No skeleton form exists; routes render the header immediately.", evidence: "page-header.tsx has no loading branch", status: "FUTURE DECISION" },

  { patternId: "pat.kpi-grid", state: "default", behavior: "Value counts up on mount.", evidence: "kpi-card.tsx CountUp", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.kpi-grid", state: "hover", behavior: "Card lifts 2px and the icon tile inverts to its tone.", evidence: "kpi-card.tsx hover:-translate-y-0.5 and group-hover tone", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.kpi-grid", state: "warning", behavior: "Tone switches the text, tile and wash to the warning colour.", evidence: "kpi-card.tsx TONE map", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.kpi-grid", state: "loading", behavior: "No skeleton variant.", evidence: "kpi-card.tsx has no loading prop", status: "FUTURE DECISION" },

  { patternId: "pat.table-screen", state: "default", behavior: "Header row plus body rows at px-5 py-4.", evidence: "data-table.tsx", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.table-screen", state: "empty", behavior: "A single spanning cell with centred muted text at py-10.", evidence: "data-table.tsx line 52", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.table-screen", state: "collapsed", behavior: "min-w-[640px] forces horizontal scroll rather than restructuring.", evidence: "data-table.tsx line 29", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.table-screen", state: "loading", behavior: "Handled per route with Skeleton, not by the table.", evidence: "Skeleton in 4 files", status: "OBSERVED VARIATION" },

  { patternId: "pat.empty-loading-error", state: "empty", behavior: "Icon tile, display title, body and optional action on a dashed surface.", evidence: "empty-state.tsx", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.empty-loading-error", state: "loading", behavior: "Skeleton blocks placed by each route; no shared composition.", evidence: "Skeleton in 4 files", status: "UNOWNED AREA" },
  { patternId: "pat.empty-loading-error", state: "error", behavior: "Written inline per route.", evidence: "No error component exists", status: "UNOWNED AREA" },

  { patternId: "pat.status-tier", state: "default", behavior: "Solid tone background with a foreground chosen for contrast.", evidence: "status-badge.tsx, metal-badge.tsx", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.status-tier", state: "selected", behavior: "In filters the same badge doubles as a toggle via aria-pressed.", evidence: "plans.index.tsx filter chips", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.status-tier", state: "disabled", behavior: "Not offered; badges carry no disabled form.", evidence: "No disabled branch in either badge", status: "FUTURE DECISION" },

  { patternId: "pat.navigation", state: "active", behavior: "The current destination is marked in each shell independently.", evidence: "three shells", status: "OBSERVED OVERLAP" },
  { patternId: "pat.navigation", state: "hover", behavior: "hover:bg-accent on internal and marketplace controls.", evidence: "internal-shell.tsx line 74, marketplace-shell.tsx line 197", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.navigation", state: "collapsed", behavior: "Internal rail collapses to 104px; marketplace links hide below md; member nav becomes a scrollable row.", evidence: "internal-shell.tsx line 63, marketplace-shell.tsx line 197, member-shell.tsx line 101", status: "CURRENT IMPLEMENTATION" },

  { patternId: "pat.wizard", state: "active", behavior: "The current step chip is filled; upcoming steps sit at 50% foreground.", evidence: "downline-wizard-stepper.tsx lines 47-55", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.wizard", state: "success", behavior: "Completed steps replace the number with a check mark.", evidence: "downline-wizard-stepper.tsx line 51", status: "CURRENT IMPLEMENTATION" },

  { patternId: "pat.dialog-drawer", state: "default", behavior: "Overlay plus panel with an accessible name.", evidence: "plans.index.tsx line 374", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.dialog-drawer", state: "focus", behavior: "The primitive traps focus; the route-local overlay does not declare a trap.", evidence: "dialog primitive versus plans.index.tsx", status: "OBSERVED VARIATION" },

  { patternId: "pat.cart-summary", state: "empty", behavior: "The cart shows its own empty message.", evidence: "cart.tsx", status: "CURRENT IMPLEMENTATION" },
  { patternId: "pat.cart-summary", state: "warning", behavior: "Replacing a product of the same type notifies the shopper.", evidence: "src/lib/cart-store.ts replacement notice", status: "CURRENT IMPLEMENTATION" },

  { patternId: "pat.form-layout", state: "error", behavior: "Primitive inputs accept aria-invalid; route-local field systems vary.", evidence: "input primitive, governed module kits", status: "OBSERVED VARIATION" },
  { patternId: "pat.form-layout", state: "disabled", behavior: "Primitive controls carry a disabled style; there is no shared disabled token.", evidence: "primitive control classes", status: "OBSERVED VARIATION" },
];
