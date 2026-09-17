/**
 * Reference-layer types.
 *
 * DOCUMENTATION ONLY. Nothing in `src/lib/design/*` defines a design value,
 * and nothing here may be imported by application screens or business logic.
 * Consumers: `/design-system` and `/design-guide` only.
 */

/** Where the decision actually lives and how widely it is shared. */
export type Ownership =
  | "foundation" // src/styles.css — global token
  | "primitive" // src/components/ui/* — shadcn primitive
  | "business" // src/components/abox/* — ABox component
  | "pattern" // recurring markup across routes, no single owner yet
  | "local"; // intentionally one-off in a single screen

/** Whether the entry describes what ships today or a future idea. */
export type Maturity = "current" | "opportunity";

export interface FoundationEntry {
  /** Token, utility class or convention name. */
  name: string;
  /** Actual value or implementation as it exists today. */
  value: string;
  /** Owning source file. */
  source: string;
  /** Known consumers, described in plain terms. */
  consumers: string;
  ownership: Ownership;
  /** True shared source of truth vs. a recurring convention vs. one-off. */
  shared: "source-of-truth" | "convention" | "one-off";
  maturity: Maturity;
  /** What must not be changed casually. */
  note?: string;
}

export interface FoundationCategory {
  id: string;
  title: string;
  summary: string;
  entries: FoundationEntry[];
}

export interface RelationshipEntry {
  /** The pair being measured, e.g. "Heading → supporting text". */
  pair: string;
  /** Observed implementation, verbatim from production code. */
  observed: string;
  /** Where it was observed. */
  source: string;
  /** Consistency as found — not normalized. */
  consistency: "consistent" | "varies";
  note?: string;
}

export interface RelationshipGroup {
  id: string;
  title: string;
  summary: string;
  entries: RelationshipEntry[];
}

export interface InventoryEntry {
  name: string;
  source: string;
  /** Number of distinct application files importing it (reference pages excluded). */
  consumers: number;
  ownership: Ownership;
  /** States or variants implemented today. */
  states: string;
  status: "in-use" | "available-unused" | "internal-only";
  note?: string;
}

export interface InventoryGroup {
  id: string;
  title: string;
  summary: string;
  entries: InventoryEntry[];
}
