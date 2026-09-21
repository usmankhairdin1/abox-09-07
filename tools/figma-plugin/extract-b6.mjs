// Phase 53 / Batch B6 — patterns & interactions extractor.
// Reads the production source of truth under src/ plus the generated B4/B5 data,
// and emits tokens-b6.js. Run from the repository root:
//
//   node tools/figma-plugin/extract-b6.mjs
//
// Never hand-edit tokens-b6.js; never edit code.js (see build.mjs).
//
// Rules enforced here:
//  - a pattern is emitted only when production shows repeated structural use
//    (rule A) or a component explicitly owns the composition (rule B);
//  - every nested instance targets an existing B4/B5 object — no primitive is
//    redefined, rebuilt or duplicated here;
//  - every sample string is a literal that already exists in production;
//  - every geometry number is derived from a production Tailwind class;
//  - anything not representable is recorded as deferred/rejected, never faked.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const lineOf = (file, needle) => {
  const i = read(file).split("\n").findIndex((l) => l.includes(needle));
  if (i === -1) throw new Error("STOP: not found in " + file + " — " + needle);
  return file + ":" + (i + 1);
};

const F = {
  kpi: "src/components/abox/kpi-card.tsx",
  tabs: "src/components/abox/module-tabs.tsx",
  wizard: "src/components/abox/downline-wizard-stepper.tsx",
  dash: "src/routes/app.dashboard.tsx",
  statements: "src/routes/app.agency.statements.tsx",
  workforce: "src/components/m06/workforce-page.tsx",
  frames: "src/components/lucie-app/frames.tsx",
  header: "src/components/abox/page-header.tsx",
  empty: "src/components/abox/empty-state.tsx",
  table: "src/components/abox/data-table.tsx",
  control: "src/components/abox/control.tsx",
};

/* ---------- B4/B5 reality: the objects a pattern may instance ---------- */
const ABOX_B4 = eval(readFileSync(join(here, "tokens-b4.js"), "utf8") + ";ABOX_B4");
const ABOX_B5 = eval(readFileSync(join(here, "tokens-b5.js"), "utf8") + ";ABOX_B5");

const b4Set = (name) => {
  const s = ABOX_B4.sets.find((x) => x.name === name);
  if (!s) throw new Error("STOP: B4 set not found — " + name);
  return s;
};
const b4Values = (name) => b4Set(name).values.map((v) => v.value);
/** A variant value must exist in B4, or (for deltaSign) in the B5 axis. */
const assertVariant = (setName, prop, value) => {
  const set = b4Set(setName);
  if (prop === set.property) {
    if (b4Values(setName).indexOf(value) === -1) {
      throw new Error("STOP: unknown " + setName + " " + prop + " — " + value);
    }
    return;
  }
  const A = ABOX_B5.variantAxis;
  if (setName === A.set && prop === A.property && A.values.indexOf(value) !== -1) return;
  throw new Error("STOP: unknown variant axis " + setName + "." + prop);
};
/** A text property must already be a B5 binding on that component. */
const assertText = (component, property) => {
  const hit = ABOX_B5.bindings.find(
    (b) => b.component === component && b.property === property && b.type === "TEXT",
  );
  if (!hit) throw new Error("STOP: no B5 TEXT property " + component + "." + property);
};

const instance = (of, variants, texts, source) => {
  for (const k of Object.keys(variants || {})) assertVariant(of, k, variants[k]);
  for (const k of Object.keys(texts || {})) assertText(of, k);
  return { of, variants: variants || {}, texts: texts || {}, source };
};

/* ---------- 1. KPI metric row ---------- */
// Rule A: 15 non-reference routes render `grid gap-4` rows of KpiCard.
// The two authored column counts (3 and 4) are the only structural alternatives.
const KPI_ROUTES = [
  "src/routes/app.dashboard.tsx",
  "src/routes/app.agency.index.tsx",
  "src/routes/app.my-work.tsx",
  "src/routes/app.commissions.tsx",
  "src/routes/agency.my-organization.tsx",
  "src/routes/agency.organization-admin.tsx",
  "src/routes/marketplace.admin.index.tsx",
  "src/routes/member.index.tsx",
  "src/routes/platform.organizations.index.tsx",
  "src/routes/platform.marketplaces.index.tsx",
  "src/routes/app.partner.tsx",
  "src/routes/app.employer.ichra.tsx",
  "src/routes/app.agency.statements.tsx",
  "src/routes/app.jet.platform.tsx",
  "src/routes/app.index.tsx",
];
for (const r of KPI_ROUTES) {
  if (!/grid gap-4/.test(read(r)) || !/KpiCard/.test(read(r))) {
    throw new Error("STOP: KPI row evidence missing in " + r);
  }
}

// Sample content: the literal four-card row at app.dashboard.tsx.
const KPI_CARDS = [
  { tone: "default", label: "Visits (30d)", value: "2,140" },
  { tone: "primary", label: "Quotes sent", value: "214" },
  { tone: "sage", label: "Enrollments", value: "92" },
  { tone: "primary", label: "Projected earnings", value: "$15,200" },
];
for (const c of KPI_CARDS) {
  if (!read(F.dash).includes(c.label)) throw new Error("STOP: KPI label not in " + F.dash + " — " + c.label);
}

const kpiChildren = (n) =>
  KPI_CARDS.slice(0, n).map((c) =>
    instance(
      "ABox/Card/KpiCard",
      { tone: c.tone, deltaSign: "positive" },
      { label: c.label, value: c.value },
      lineOf(F.dash, c.label),
    ),
  );

// Production KPI rows are a single non-wrapping grid row (gap-4); both axes hug.
const KPI_ROOT = {
  layout: "HORIZONTAL",
  wrap: "NO_WRAP",
  gap: 16,
  counterGap: 0,
  primarySizing: "AUTO",
  counterSizing: "AUTO",
};


const kpiRow = {
  name: "ABox/Pattern/KpiRow",
  kind: "SET",
  property: "columns",
  source:
    "source: " + lineOf(F.dash, "md:grid-cols-4") +
    " and " + lineOf(F.statements, "md:grid-cols-3") +
    " — repeated in " + KPI_ROUTES.length + " non-reference routes",
  evidence: KPI_ROUTES,
  // Variant-matrix names are exactly "columns=<value>"; the axis exists only through
  // combineAsVariants, never through addComponentProperty.
  values: ["3", "4"],
  variants: [
    { value: "4", root: KPI_ROOT, children: kpiChildren(4) },
    { value: "3", root: KPI_ROOT, children: kpiChildren(3) },
  ],
};

/* ---------- 2. Module tab bar ---------- */
// Rule B: module-tabs.tsx owns the multi-tab composition; two hosts consume it.
const TAB_LABELS = ["Overview", "Roster", "Person", "Onboarding", "Structure"];
for (const l of TAB_LABELS) {
  if (!read(F.workforce).includes('label: "' + l + '"')) {
    throw new Error("STOP: tab label not in " + F.workforce + " — " + l);
  }
}
const moduleTabBar = {
  name: "ABox/Pattern/ModuleTabBar",
  kind: "COMPONENT",
  source:
    "source: " + lineOf(F.tabs, "export function ModuleTabs") +
    " | hosts " + lineOf(F.workforce, "<ModuleTabs tabs={WORKFORCE_TABS}") +
    ", " + lineOf(F.frames, "<ModuleTabs tabs={EMPLOYER_TABS}"),
  root: {
    layout: "HORIZONTAL",
    wrap: "WRAP", // flex-wrap
    gap: 6, // gap-1.5 — primary axis
    counterGap: 6, // gap-1.5 — wrapped (row) axis
    primarySizing: "AUTO", // no width constraint in production
    counterSizing: "AUTO", // no height constraint in production
    paddingBottom: 12, // pb-3
    strokeBottomStyle: "ABox/Semantic/hairline", // border-b border-hairline
    strokesIncludedInLayout: false, // border-b paints outside the pb-3 spacing contract
    strokeSource: lineOf(F.tabs, "border-b border-hairline"),
    gapSource: lineOf(F.tabs, "gap-1.5"),
  },
  children: TAB_LABELS.map((label, i) =>
    instance(
      "ABox/Nav/ModuleTab",
      { state: i === 0 ? "active" : "default" },
      { label },
      lineOf(F.workforce, 'label: "' + label + '"'),
    ),
  ),
};

/* ---------- 3. Downline wizard stepper ---------- */
// Rule B: downline-wizard-stepper.tsx owns the fixed step list; 8 step routes.
const STEP_LABELS = ["Identity", "Legal & identifiers", "Contacts", "Addresses & offices", "Settings"];
for (const l of STEP_LABELS) {
  if (!read(F.wizard).includes('label: "' + l + '"')) {
    throw new Error("STOP: wizard label not in " + F.wizard + " — " + l);
  }
}
const STEP_STATES = ["done", "done", "current", "upcoming", "unreachable"];
const wizardStepper = {
  name: "ABox/Pattern/WizardStepper",
  kind: "COMPONENT",
  source:
    "source: " + lineOf(F.wizard, "export const DOWNLINE_WIZARD_STEPS") +
    " | states " + lineOf(F.wizard, "const isCurrent ="),
  root: { layout: "HORIZONTAL", gap: 6, gapSource: lineOf(F.wizard, "items-center gap-1.5") },
  children: STEP_LABELS.map((label, i) =>
    instance(
      "ABox/Nav/WizardStep",
      { state: STEP_STATES[i] },
      { label },
      lineOf(F.wizard, 'label: "' + label + '"'),
    ),
  ),
};

/* ---------- interactions ---------- */
const interactions = [
  {
    pattern: "ABox/Pattern/ModuleTabBar",
    trigger: "route match (TanStack Link activeProps)",
    source: lineOf(F.tabs, "activeProps"),
    behaviour: "the matching tab gains bg-primary/10 text-foreground border-primary/30",
    representation: "existing B4 variant ABox/Nav/ModuleTab state=active on child 1",
    before: "state=default",
    after: "state=active",
    prototype: "none",
    reuse: "existing B4 variant reused; no new state axis, no B4 mutation",
    limitation: "",
  },
  {
    pattern: "ABox/Pattern/WizardStepper",
    trigger: "current route position within DOWNLINE_WIZARD_STEPS",
    source: lineOf(F.wizard, "const isCurrent ="),
    behaviour: "steps render as done (check glyph), current (filled), upcoming (reachable link) or unreachable (dimmed span)",
    representation: "existing B4 variants ABox/Nav/WizardStep state=done|current|upcoming|unreachable",
    before: "state=upcoming",
    after: "state=current / state=done",
    prototype: "none",
    reuse: "existing B4 variants reused; no new state axis, no B4 mutation",
    limitation:
      "Step navigation is route navigation (Link to=…); the destination screens are B8 scope, so no prototype connection is created — one would imply navigation not supported by any existing Figma frame.",
  },
];

const deferredInteractions = [
  { candidate: "ModuleTab hover (hover:bg-accent)", source: lineOf(F.tabs, "hover:bg-accent"), reason: "no B4 hover variant exists; adding one would add a state axis to a protected B4 set" },
  { candidate: "DataTable row hover ember bar", source: lineOf(F.table, "group-hover:scale-y-100"), reason: "DataTable was excluded from B4; no primitive exists to host the interaction" },
  { candidate: "Control focus-visible ring", source: lineOf(F.control, "focus:ring-2"), reason: "CSS pseudo-class, not a design-system state; no focus variant on the protected B4 Control" },
  { candidate: "dialog / sheet / dropdown / tooltip open-close", source: "src/components/ui/{dialog,sheet,dropdown-menu,tooltip}.tsx", reason: "no B4 overlay primitives; composition differs per consumer" },
];

/* ---------- deferred / rejected pattern candidates ---------- */
const deferred = [
  { candidate: "Page header + actions region", source: lineOf(F.header, "{actions &&"), decision: "DEFER — insufficient representation", reason: "B4 PageHeader has no actions wrapper layer; B5 deferred hasActions/actions" },
  { candidate: "Empty state with action", source: lineOf(F.empty, "{action}"), decision: "DEFER — insufficient representation", reason: "B4 EmptyState has no action region; B5 deferred hasAction/action" },
  { candidate: "Data table + empty row", source: lineOf(F.table, "rows.length === 0"), decision: "DEFER — insufficient representation", reason: "DataTable excluded from B4; no table primitive exists" },
  { candidate: "Shell + header + content", source: "src/components/abox/{internal,marketplace,member}-shell.tsx", decision: "DEFER — later shell/screen phase (B7)", reason: "shell composition belongs to 03 Shells" },
  { candidate: "Notice screen", source: "src/components/abox/notice-page.tsx", decision: "DEFER — later shell/screen phase (B8)", reason: "screen-level composition belongs to 05 Screens" },
  { candidate: "Placeholder screen", source: "src/components/abox/placeholder-screen.tsx", decision: "DEFER — later shell/screen phase (B8)", reason: "screen-level, single consumer" },
  { candidate: "Shopping path bar", source: "src/components/abox/shopping-path-bar.tsx", decision: "DEFER — insufficient representation", reason: "no B4 primitive for its steps" },
  { candidate: "Card group (PlanCard)", source: "src/components/abox/plan-card.tsx", decision: "DEFER — insufficient representation", reason: "PlanCard is not a B4 component" },
  { candidate: "Overlay compositions (dialog/sheet/dropdown/tooltip/tabs)", source: "src/components/ui/*", decision: "DEFER — insufficient representation", reason: "no B4 overlay primitives" },
];

const rejected = [
  { candidate: "Labelled field group", reason: "REJECT — not actually reusable: each route composes its own ad-hoc field set (3 LabeledField consumers, no fixed grouping)" },
  { candidate: "Filter / toolbar + result region", reason: "REJECT — not actually reusable: no repeated structural composition found in the non-reference routes" },
  { candidate: "Action-group arrangement", reason: "REJECT — not actually reusable: ActionPill groupings are route-specific" },
];

const limitations = [
  "Production lays KPI rows out with CSS grid and responsive breakpoints (grid gap-4 sm:grid-cols-2 lg:grid-cols-4); Figma auto-layout has no responsive breakpoint concept, so the columns axis encodes only the two authored column counts (3 and 4) and no breakpoint behaviour is modelled. — " + lineOf(F.dash, "md:grid-cols-4"),
  "ModuleTabBar shows 5 of the 12 production workforce tabs; the count is sample scope, chosen as the minimum that demonstrates the active/default relationship. — " + lineOf(F.workforce, "export const WORKFORCE_TABS"),
  "WizardStepper shows 5 of the 8 production steps; the count is sample scope, chosen as the minimum that demonstrates all four real step states. — " + lineOf(F.wizard, "export const DOWNLINE_WIZARD_STEPS"),
  "B4 coloured positive KpiCard delta chips per tone, while production always uses the sage branch for a positive delta (kpi-card.tsx:78). KpiRow consumes the live B5 component unchanged: the deviation is displayed, recorded, and not silently corrected in B6.",
  "Tab and wizard-step navigation is router-driven; no Figma prototype connection is created because the destination screens are B8 scope. B6 creates 0 prototype reactions.",
  "CSS pseudo-class states (hover, focus-visible, active) are not converted into Figma variants; each is recorded as a deferred interaction instead.",
  "Production row wrappers carry only layout classes (grid/gap), so B6 pattern roots have no fill, and only ModuleTabBar carries a stroke — bound to the existing B3 ABox/Semantic/hairline style, never a copied colour value.",
];

const patterns = [kpiRow, moduleTabBar, wizardStepper];
const patternNodes = patterns.reduce((n, p) => n + (p.kind === "SET" ? p.variants.length : 1), 0);

const data = {
  meta: {
    batch: "Phase 53 / Batch B6 — patterns & interactions",
    page: "02 Patterns",
    generatedBy: "tools/figma-plugin/extract-b6.mjs",
    protects: ["B1", "B2", "B3", "B4", "B5"],
  },
  counts: {
    patterns: patterns.length,
    sets: patterns.filter((p) => p.kind === "SET").length,
    components: patterns.filter((p) => p.kind === "COMPONENT").length,
    patternNodes,
    prototypes: 0,
    deferred: deferred.length,
    rejected: rejected.length,
    // protected inventory B6 must leave exactly as it found it
    b4Sets: ABOX_B5.counts.sets,
    b4Standalone: ABOX_B5.counts.standalone,
    b5Variants: ABOX_B5.counts.variantsAfter,
    b5Physical: ABOX_B5.counts.physicalNodes,
    b5NonVariant: ABOX_B5.counts.nonVariant,
    b5Exposed: ABOX_B5.counts.exposedInstances,
  },
  patterns,
  interactions,
  deferredInteractions,
  deferred,
  rejected,
  limitations,
};

writeFileSync(
  join(here, "tokens-b6.js"),
  "// GENERATED by tools/figma-plugin/extract-b6.mjs — do not hand-edit.\nvar ABOX_B6 = " +
    JSON.stringify(data, null, 2) +
    ";\n",
);
console.log(
  "wrote tokens-b6.js — " + patterns.length + " patterns / " + patternNodes + " pattern nodes, " +
    deferred.length + " deferred, " + rejected.length + " rejected, " + limitations.length + " limitations",
);
