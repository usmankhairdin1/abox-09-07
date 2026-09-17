/**
 * Phase 6 — duplicate/overlap normalization map, route-local kit architecture,
 * shell architecture and the migration roadmap.
 *
 * DOCUMENTATION ONLY.
 *
 * Deliberate omissions, per the governing constraints:
 *   - No implementation is named a winner.
 *   - No implementation is ranked or scored.
 *   - Nothing is consolidated, deleted or renamed.
 *
 * Every `decision` field states the question a FUTURE phase must answer. It
 * is intentionally left open here.
 *
 * Consumers: /design-system, /design-guide.
 */
import type { OverlapArea, RouteKitEntry, ShellArchEntry, MigrationPhaseEntry } from "./types";

/* ==================== DUPLICATE / OVERLAP MAP ==================== */

export const OVERLAP_MAP: OverlapArea[] = [
  {
    area: "Table implementations",
    implementations:
      "abox/data-table.tsx · ui/table.tsx (installed, no production consumer) · lucie table · lucie-app DataTable · m06 inline tables",
    evidence: "Phase 5 component inventory and duplication findings",
    consumers: "abox DataTable 20 direct; the kit tables serve their own module screens only",
    differences:
      "Cell density, column API (column objects versus children), empty handling, hover treatment, caption support, row-click behaviour.",
    risks:
      "Consolidating changes row height and cell padding on live admin screens. The kits also carry governed module semantics that a generic table does not model.",
    decision:
      "FUTURE DECISION — whether one table with a Density property can serve all five contexts, and whether governed module tables should stay separate on purpose.",
    sequence:
      "1) Map each table's full feature set. 2) Identify features unique to one implementation. 3) Decide whether governed tables are in scope at all. 4) Only then consider a target. Visual diffing required at every step.",
    label: "OBSERVED DUPLICATE",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Page headers",
    implementations:
      "abox/page-header.tsx · m06 page head · lucie page head · lucie-app PageHeader",
    evidence: "Phase 5 component inventory",
    consumers: "abox PageHeader 25 direct; each kit header serves its own module screens",
    differences:
      "Heading sizes, presence of an eyebrow, SCR identifier support, motion entrance, action-area layout.",
    risks:
      "Heading sizes were tuned by hand across the product in an earlier change. Consolidating would move type sizes on many screens.",
    decision:
      "FUTURE DECISION — one header with a Density property, or a Core header plus a governed-module header that carries traceability identifiers.",
    sequence:
      "1) Compare rendered heading sizes side by side. 2) Establish whether the SCR identifier belongs in Core. 3) Decide the density model. 4) Diff every affected screen.",
    label: "OBSERVED DUPLICATE",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Empty states",
    implementations: "abox/empty-state.tsx · DataTable empty row · m06 StateBlock · lucie-app EmptyState",
    evidence: "Phase 5 component inventory",
    consumers: "abox EmptyState 10 direct",
    differences: "Decorative background, icon support, action support, inline versus full-page scale.",
    risks: "Low structural risk; the kits' empty states also carry governed wording.",
    decision: "FUTURE DECISION — whether the table empty row and the standalone empty state share one component.",
    sequence: "1) Collect every empty message in the product. 2) Separate wording from layout. 3) Decide the scale property.",
    label: "OBSERVED DUPLICATE",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Assistants",
    implementations: "abox/planai-assistant.tsx · abox/plan-o-assistant.tsx",
    evidence: "Phase 5 component inventory",
    consumers: "Neither has a located route consumer today",
    differences:
      "Two coexisting implementations of the same idea, one of them predating the Plan-AI rename.",
    risks:
      "Low, because neither is mounted. But the ai-elements tree hangs off one of them, so removing either affects what else becomes unreachable.",
    decision: "FUTURE DECISION — which assistant the product intends to keep, and whether ai-elements stays.",
    sequence: "1) Confirm the product intent for the assistant. 2) Trace ai-elements reachability. 3) Decide together, not separately.",
    label: "OBSERVED DUPLICATE",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Form field systems",
    implementations:
      "ui/label + ui/input composed per screen · ui/form (installed, unused) · m06 Field/TextInput/TextArea/Picker · m08 field helpers · lucie-app Field",
    evidence: "Phase 5 component inventory",
    consumers: "Input 7 direct, Label 5 direct; the kits serve their module screens",
    differences:
      "Label association, hint placement, error placement, required marker, validation model.",
    risks:
      "Highest-risk area in the audit. Form semantics, accessibility wiring and governed validation all intersect here.",
    decision:
      "FUTURE DECISION — the canonical field anatomy. The evidence does not settle it; this needs a design decision.",
    sequence:
      "1) Inventory every field instance. 2) Agree the anatomy. 3) Build the canonical field alongside the existing ones. 4) Migrate screen by screen with diffs.",
    label: "OBSERVED DUPLICATE",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Action paths",
    implementations: "ui/button.tsx · abox/action-pill.ts · m06 Btn",
    evidence: "Phase 5 component inventory; ACTION_PILL measured at 35 files / 82 references",
    consumers: "Button 22 direct; ACTION_PILL 35 files; m06 Btn within its module",
    differences:
      "Shape (rounded-md versus rounded-full), height ramp, whether it is a component or a class string, focus handling.",
    risks:
      "ACTION_PILL is applied to both buttons and links. A component-based replacement changes the DOM on 35 files.",
    decision: "FUTURE DECISION — one action component with an appearance property, or two documented paths.",
    sequence:
      "1) Classify every ACTION_PILL site as button or link. 2) Decide the appearance model. 3) Migrate in small batches with screenshots.",
    label: "OBSERVED OVERLAP",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Status and tone vocabulary",
    implementations:
      "abox StatusBadge (6 tones) · ui/Badge (4 variants) · m06 StatusTag · lucie-app StatusChip · M08 controlled outcomes",
    evidence: "Phase 5 component inventory; 15 tone values across the vocabularies",
    consumers: "StatusBadge 89 direct — the widest reach of anything in the system",
    differences:
      "Different tone names, different meanings for similar names, and one vocabulary (M08) that is contractually fixed.",
    risks:
      "M08's four controlled outcomes are governed by the build packet and must not be merged into a generic scale.",
    decision:
      "FUTURE DECISION — a shared tone scale for the generic vocabularies, with the governed M08 outcomes explicitly excluded.",
    sequence:
      "1) Write the semantic meaning of every tone. 2) Exclude governed vocabularies. 3) Map the remainder. 4) Migrate consumers.",
    label: "OBSERVED DUPLICATE",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Card surface",
    implementations: "ui/Card · KpiCard · PlanCard · repeated route markup",
    evidence: "Phase 2 spacing audit; p-5 measured at 187 occurrences",
    consumers: "ui/Card 6 direct; the repeated markup is not countable by import",
    differences: "Padding, radius, border token, hover behaviour.",
    risks: "Every route would need a visual diff. This is the widest-reaching unowned pattern.",
    decision: "FUTURE DECISION — the canonical padding and border for a card surface.",
    sequence: "1) Catalogue every card instance with its exact classes. 2) Group by intent. 3) Decide the property set. 4) Migrate by route family.",
    label: "UNOWNED AREA",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    area: "Results toolbar",
    implementations: "src/routes/plans.index.tsx inline composition",
    evidence: "Phase 5 pattern inventory",
    consumers: "1",
    differences: "Single implementation, but it mixes sorting, shopping mode and quote editing.",
    risks: "Low today; the risk is future divergence if a second results screen copies it.",
    decision: "FUTURE DECISION — whether a shared results toolbar is warranted before a second consumer exists.",
    sequence: "1) Wait for a second consumer. 2) Extract only then.",
    label: "UNOWNED AREA",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Circular icon container",
    implementations: "Shells, landing cards, member arc, empty states",
    evidence: "Phase 4 iconography audit",
    consumers: "Several, none importing a shared implementation",
    differences: "Diameter, background token, icon size inside the circle.",
    risks: "Low structural risk; several diameters are in live use.",
    decision: "FUTURE DECISION — the canonical diameter set.",
    sequence: "1) Measure every circle. 2) Group by role. 3) Decide the size set.",
    label: "UNOWNED AREA",
    phase: "Phase 4 — iconography & assets",
  },
  {
    area: "Route-local kits as a class",
    implementations: "m06, m06 screen common, m08, lucie, lucie-app, ai-elements",
    evidence: "Phase 5 component inventory",
    consumers: "Each kit serves its own module screens",
    differences:
      "Each kit re-implements pattern-level concerns instead of consuming Core, for reasons ranging from governed vocabulary to timing.",
    risks:
      "Absorbing a kit into Core risks losing governed semantics; leaving them risks continued divergence.",
    decision: "FUTURE DECISION — per kit, not as a class. See the route-local kit architecture.",
    sequence: "1) Handle each kit separately. 2) Start with the kit that has the least governed vocabulary.",
    label: "OBSERVED OVERLAP",
    phase: "Phase 5 — components, variants, states",
  },
  {
    area: "Sheet name collision",
    implementations: "ui/sheet.tsx · m06 kit Sheet",
    evidence: "Direct read of src/components/m06/kit.tsx",
    consumers: "ui/Sheet 3 direct; m06 Sheet inside its module",
    differences: "Two entirely different components sharing one name in one codebase.",
    risks: "Renaming either is a code change with no visual effect but a real import surface.",
    decision: "FUTURE DECISION — which name changes, if either.",
    sequence: "1) Confirm both are intentional. 2) Decide naming at the same time as the naming convention lands.",
    label: "OBSERVED OVERLAP",
    phase: "Phase 6 — direct production read",
  },
];

/* ==================== ROUTE-LOCAL KIT ARCHITECTURE ==================== */

export const ROUTE_LOCAL_KITS: RouteKitEntry[] = [
  {
    kit: "M06 kit",
    source: "src/components/m06/kit.tsx",
    purpose:
      "Supplies the controls the governed M06 agency and workforce screens need: status tags, buttons, fields, pickers, state and query blocks, pending/owned-elsewhere notices, a side sheet, a meta rail, a toast and date helpers.",
    consumers: "The M06 screen set — structure, roster, access, lifecycle, readiness, dataops.",
    reusableScope:
      "Reusable within M06. Several members (StateBlock, MetaRail) are general enough to be Core candidates.",
    experienceScope: "Dashboard / Admin",
    dependencies: "Foundation tokens, lucide icons; largely independent of abox/*.",
    overlap:
      "OBSERVED OVERLAP — StatusTag overlaps StatusBadge, Btn overlaps Button and ACTION_PILL, Field/TextInput overlap the form-field systems, Sheet collides with ui/Sheet by name, Toast overlaps sonner.",
    classification: "Route-local kit — a true internal component library scoped to one module.",
    migration:
      "FUTURE MIGRATION — the highest-overlap kit and therefore the most valuable to examine first, but also the one whose screens are governed. No action in this phase.",
    label: "OBSERVED OVERLAP",
  },
  {
    kit: "M06 screen common",
    source: "src/components/m06/screens/common.tsx",
    purpose: "Shared helpers used across the individual M06 screens, one level below the kit.",
    consumers: "The M06 screen files only.",
    reusableScope: "Internal to M06 screens.",
    experienceScope: "Dashboard / Admin",
    dependencies: "M06 kit.",
    overlap: "Minor — mostly layout helpers rather than new visual vocabulary.",
    classification: "Pattern collection, not a component library.",
    migration: "FUTURE MIGRATION — follows whatever happens to the M06 kit; never migrated independently.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    kit: "M08 kit",
    source: "src/components/m08/kit.tsx",
    purpose:
      "Expresses the governed M08 vocabulary: locale toggle, traceability rail, approval notice, review-mode banner, the four controlled outcomes, status dimensions, provenance, context, blockers, dependency, loading, empty and denied states.",
    consumers: "The M08 Selling Setup screens embedded in the M06 profiles.",
    reusableScope:
      "Deliberately not generic. Its vocabulary is defined by the M08 build packet, not by the design system.",
    experienceScope: "Dashboard / Admin, with bilingual requirements",
    dependencies: "Foundation tokens, lucide icons, M08 model and evaluators.",
    overlap:
      "Surface-level only. Its outcome and dimension components look like badges but carry contractual meaning.",
    classification: "Governed module vocabulary — a pattern collection with contractual semantics.",
    migration:
      "GOVERNANCE RULE — the four controlled outcomes must never be merged into the generic tone scale. Only the purely presentational shells around them could ever be Core candidates.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    kit: "Lucie kit",
    source: "src/components/lucie/ui.tsx",
    purpose:
      "Traceability presentation for the Lucie spine: identifiers, tags, sections, page head, stat and key-value blocks, table, toolbar, select, search and notes.",
    consumers: "The Lucie traceability screens.",
    reusableScope: "Internal to Lucie.",
    experienceScope: "Dashboard / Admin",
    dependencies: "Foundation tokens, Lucie release data.",
    overlap: "OBSERVED OVERLAP — its table, page head and tags overlap the Core equivalents.",
    classification: "Route-local kit.",
    migration: "FUTURE MIGRATION — a candidate once the Core table and header decisions are made, not before.",
    label: "OBSERVED OVERLAP",
  },
  {
    kit: "Lucie-app kit",
    source: "src/components/lucie-app/ui.tsx, frames.tsx",
    purpose:
      "A second Lucie surface: PageHeader, Section, StatCard, StatusChip, DataTable, EmptyState, LoadingRows, Stepper, Field, Money, NotPermitted and frame layouts.",
    consumers: "The Lucie prototype walkthrough screens.",
    reusableScope: "Internal to the Lucie app walkthrough.",
    experienceScope: "Dashboard / Admin",
    dependencies: "Foundation tokens, Lucie app store and steps.",
    overlap:
      "OBSERVED OVERLAP — the broadest overlap of any kit: header, table, stat card, status chip, empty state, loading and field all have Core equivalents.",
    classification: "Route-local kit that mirrors much of Core.",
    migration:
      "FUTURE MIGRATION — the clearest consolidation candidate on paper. Whether it should be consolidated depends on whether the walkthrough is permanent product surface, which is a product question.",
    label: "OBSERVED OVERLAP",
  },
  {
    kit: "ai-elements",
    source: "src/components/ai-elements/conversation.tsx, message.tsx, prompt-input.tsx, shimmer.tsx",
    purpose: "Chat surface primitives for an assistant experience.",
    consumers:
      "Reachable only through PlanAiAssistant, which itself has no located route consumer today.",
    reusableScope: "Would be reusable if an assistant were mounted.",
    experienceScope: "Cross-experience, if activated",
    dependencies: "Foundation tokens, lucide icons.",
    overlap: "Minimal against Core; it solves a problem Core does not address.",
    classification: "Route-local kit awaiting a consumer.",
    migration:
      "FUTURE DECISION — tied to the assistant decision. Nothing should happen to ai-elements before that is settled.",
    label: "POSSIBLY UNUSED",
  },
];

/* ======================= SHELL ARCHITECTURE ======================= */

export const SHELL_ARCHITECTURE: ShellArchEntry[] = [
  {
    shell: "InternalShell",
    source: "src/components/abox/internal-shell.tsx",
    purpose:
      "The workspace frame for internal, agency, platform and admin screens — the densest information context in the product.",
    responsibility:
      "Skip link, sticky header, collapsible navigation rail, search control, account control, main region.",
    routes: "89 routes — the largest single coverage in the product.",
    dependencies: "Sheet, Input, DropdownMenu, Tooltip, nav-config, Logo, auth session.",
    navigation:
      "A grouped rail driven by nav-config, with expanded and collapsed states and a mobile Sheet.",
    responsive: "The rail becomes a Sheet below lg; the search control appears only at lg and above.",
    branding: "Renders the ABox mark; does not own white-label configuration.",
    coreRelationship: "ABox Core · Shell. Consumes primitives and Core components only.",
    figma: "Frame template with Rail (expanded/collapsed) and Viewport properties.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    shell: "MarketplaceShell",
    source: "src/components/abox/marketplace-shell.tsx",
    purpose: "The consumer-facing frame for the marketplace, landing, shopping and cart surfaces.",
    responsibility:
      "Full-width header, product navigation, cart affordance, signed-in account control, content container.",
    routes: "30 routes.",
    dependencies: "Sheet, DropdownMenu, Logo, cart store, product store, auth session.",
    navigation:
      "Horizontal header links with product icons, a cart control that becomes prominent when the cart is non-empty, and an account control.",
    responsive:
      "Header is full width at every size; content centres on max-w-[88rem]; a landing offset variant exists.",
    branding: "Renders the ABox mark and per-marketplace context supplied at runtime.",
    coreRelationship: "ABox Core · Shell.",
    figma: "Frame template with Header (default/landing) and Cart (empty/filled) properties.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    shell: "MemberShell",
    source: "src/components/abox/member-shell.tsx",
    purpose: "The member area frame — quotes, messages and settings.",
    responsibility: "Full-width header, icon navigation with a connecting arc, content container.",
    routes: "4 routes.",
    dependencies: "Foundation tokens, lucide icons, auth session.",
    navigation: "Icon circles joined by an arc that passes through their centres.",
    responsive: "Content centres on max-w-[88rem]; the arc reflows on narrow widths.",
    branding: "Renders the ABox mark.",
    coreRelationship: "ABox Core · Shell.",
    figma: "Frame template with an Active navigation property.",
    label: "CURRENT IMPLEMENTATION",
  },
];

/** What the three shells share, and what stays distinct. Documentation only. */
export const SHELL_SHARED_CONCERNS: string[] = [
  "CURRENT IMPLEMENTATION — all three provide a skip link, a sticky header, an ABox mark and a centred content container.",
  "CURRENT IMPLEMENTATION — all three render the account control with the user's display name, falling back to other identity data.",
  "OBSERVED OVERLAP — the header, skip link and container are implemented three times rather than shared.",
  "GOVERNANCE RULE — the three navigation models are genuinely different and must stay three. Only the shared chrome is a consolidation candidate.",
  "FUTURE OPPORTUNITY — a shell base owning skip link, header shell and content container, with navigation injected per family.",
  "FUTURE MIGRATION — highest-risk migration in the roadmap, because all 123 routes render through a shell.",
];

/* ======================= MIGRATION ROADMAP ======================= */

export const MIGRATION_ROADMAP: MigrationPhaseEntry[] = [
  {
    phase: "Phase A",
    title: "Foundations",
    goal:
      "Name the values that are currently written as literals — container width, table min-width, header offset, tracking steps — without changing any rendered value.",
    prerequisites: "Phase 1–3 audits (complete).",
    affected: "src/styles.css and the places that reference the literals.",
    risk: "low",
    validation: "Computed-style comparison before and after; every value must resolve identically.",
    rollback: "Revert the token definitions; literals are unchanged in the same commit range.",
    visualDiff: "Required, but expected to show zero difference.",
    label: "FUTURE MIGRATION",
  },
  {
    phase: "Phase B",
    title: "Canonical shared components",
    goal:
      "Agree the canonical action, field, status and surface components and build them alongside the existing ones. Nothing is replaced yet.",
    prerequisites: "Phase A; the open FUTURE DECISIONs on action, field and tone vocabulary.",
    affected: "src/components/abox/* and src/components/ui/* — additions only.",
    risk: "low",
    validation: "New components render in the reference pages only; no production consumer changes.",
    rollback: "Delete the new components; production never referenced them.",
    visualDiff: "Not required — production output is untouched.",
    label: "FUTURE MIGRATION",
  },
  {
    phase: "Phase C",
    title: "Compound components",
    goal:
      "Bring the page header, table and card surface onto the canonical base, one component at a time.",
    prerequisites: "Phase B; a resolved decision on density properties.",
    affected: "PageHeader 25 consumers, DataTable 20 consumers, unowned card markup across routes.",
    risk: "medium",
    validation: "Per-consumer screenshots at desktop and mobile; heading sizes verified numerically.",
    rollback: "Per-component revert; each component migrates independently.",
    visualDiff: "Required for every consumer.",
    label: "FUTURE MIGRATION",
  },
  {
    phase: "Phase D",
    title: "Patterns",
    goal: "Give owners to the unowned patterns: card surface, section heading, form field, loading.",
    prerequisites: "Phase C.",
    affected: "Most routes, because the card surface is everywhere.",
    risk: "high",
    validation: "Full-route visual diffing across all three experiences.",
    rollback: "Pattern-by-pattern revert; never migrate two patterns in one change.",
    visualDiff: "Required across every route family.",
    label: "FUTURE MIGRATION",
  },
  {
    phase: "Phase E",
    title: "Experience-specific patterns",
    goal:
      "Formalise the filter rail, results toolbar, cart summary and dashboard KPI row as documented experience patterns.",
    prerequisites: "Phase D.",
    affected: "Shopping and dashboard routes.",
    risk: "medium",
    validation: "Behavioural checks alongside visual diffs — filters and sorting must behave identically.",
    rollback: "Per-pattern revert.",
    visualDiff: "Required.",
    label: "FUTURE MIGRATION",
  },
  {
    phase: "Phase F",
    title: "Figma library synchronization",
    goal:
      "Build the Figma library from the canonical system, mapping variables, components, variants and states one to one.",
    prerequisites: "Phases A–E, so the library mirrors something real.",
    affected: "Figma only. No code changes.",
    risk: "low",
    validation: "Every Figma variable resolves to a real token; every component maps to a real implementation.",
    rollback: "Figma versioning.",
    visualDiff: "Not applicable to code.",
    label: "FUTURE MIGRATION",
  },
  {
    phase: "Phase G",
    title: "Controlled production migration",
    goal:
      "Retire duplicate implementations and route-local overlaps where a decision has been made and validated.",
    prerequisites: "Every FUTURE DECISION in this blueprint resolved and recorded.",
    affected: "Route-local kits, duplicate tables, headers, empty states and assistants.",
    risk: "high",
    validation:
      "Full regression across all 123 routes, including governed module screens and bilingual surfaces.",
    rollback: "One implementation per change, each independently revertible.",
    visualDiff: "Required, exhaustively.",
    label: "FUTURE MIGRATION",
  },
];

/** Open questions this blueprint deliberately does not answer. */
export const OPEN_FUTURE_DECISIONS: string[] = [
  "FUTURE DECISION — the canonical action model: one component with an appearance property, or Button and ACTION_PILL as two documented paths.",
  "FUTURE DECISION — the canonical form field anatomy across four coexisting systems.",
  "FUTURE DECISION — the canonical card surface padding and border, since p-4, p-5, p-6, `border` and `hairline` are all in live use.",
  "FUTURE DECISION — one table with a Density property, or governed module tables kept separate on purpose.",
  "FUTURE DECISION — one page header, or a Core header plus a traceability header for governed modules.",
  "FUTURE DECISION — which assistant the product keeps, and the fate of ai-elements with it.",
  "FUTURE DECISION — the shared tone scale, explicitly excluding the governed M08 outcomes.",
  "FUTURE DECISION — mobile table behaviour: horizontal scroll or stacked cards.",
  "FUTURE DECISION — toolbar behaviour on narrow widths: wrap or collapse.",
  "FUTURE DECISION — whether icon size should scale with control density. Production currently says it should not.",
  "FUTURE DECISION — the Sheet name collision between ui/sheet and the M06 kit.",
  "FUTURE DECISION — whether the Lucie walkthrough is permanent product surface, which determines whether its kit is a consolidation candidate at all.",
];
