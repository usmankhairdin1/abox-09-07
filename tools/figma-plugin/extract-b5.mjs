// Phase 52 / Batch B5 — component variants & states extractor.
// Reads the production source of truth under src/ plus the generated B4 data,
// and emits tokens-b5.js. Run from the repository root:
//
//   node tools/figma-plugin/extract-b5.mjs
//
// Never hand-edit tokens-b5.js; never edit code.js (see build.mjs).
//
// Rules enforced here:
//  - every property comes from a production declaration / render guard;
//  - a property is emitted ONLY when its exact target layer exists in the
//    B4 node tree (tokens-b4.js). Missing target => recorded as deferred,
//    never created, never approximated;
//  - construction/sample values are the literals B4 already built, so no new
//    content is invented here.

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
  pillCmp: "src/components/abox/action-pill-component.tsx",
  status: "src/components/abox/status-badge.tsx",
  metal: "src/components/abox/metal-badge.tsx",
  button: "src/components/ui/button.tsx",
  input: "src/components/ui/input.tsx",
  field: "src/components/abox/field.tsx",
  kpi: "src/components/abox/kpi-card.tsx",
  header: "src/components/abox/page-header.tsx",
  empty: "src/components/abox/empty-state.tsx",
  tabs: "src/components/abox/module-tabs.tsx",
  wizard: "src/components/abox/downline-wizard-stepper.tsx",
};

/* ---------- B4 reality: what layers actually exist ---------- */
const ABOX_B4 = eval(readFileSync(join(here, "tokens-b4.js"), "utf8") + ";ABOX_B4");

const textsOf = (node, out = []) => {
  if (!node) return out;
  if (node.type === "TEXT") out.push(node);
  for (const child of node.children || []) textsOf(child, out);
  return out;
};
const rootNode = (name) => {
  const set = ABOX_B4.sets.find((s) => s.name === name);
  if (set) return { kind: "SET", node: set.values[0].node, spec: set };
  const cmp = ABOX_B4.components.find((c) => c.name === name);
  if (cmp) return { kind: "COMPONENT", node: cmp.node, spec: cmp };
  throw new Error("STOP: B4 object not found — " + name);
};

/** Emit a binding only when the target TEXT layer really exists in B4. */
const text = (component, property, textIndex, source, layerName) => {
  const owner = rootNode(component);
  const list = textsOf(owner.node);
  const target = list[textIndex];
  if (!target) {
    throw new Error(
      "STOP: target TEXT layer missing — " + component + " textIndex " + textIndex,
    );
  }
  return {
    component,
    owner: owner.kind,
    property,
    type: "TEXT",
    source,
    target: { textIndex, expect: target.characters, name: layerName || property },
    reference: "characters",
    value: target.characters,
  };
};

const bool = (component, property, textIndex, source, layerName) => {
  const t = text(component, property, textIndex, source, layerName);
  return {
    component,
    owner: t.owner,
    property,
    type: "BOOLEAN",
    source,
    target: t.target,
    reference: "visible",
    value: true,
  };
};

/* ---------- 15 TEXT properties ---------- */
const bindings = [
  text("ABox/Action/ActionPill", "label", 0, lineOf(F.pillCmp, "children"), "label"),
  text("ABox/Action/Button", "label", 0, lineOf(F.button, "children"), "label"),
  text("ABox/Status/StatusBadge", "label", 0, lineOf(F.status, "children"), "label"),
  text("ABox/Status/MetalBadge", "label", 0, lineOf(F.metal, "tier"), "label"),
  text("ABox/Card/KpiCard", "label", 0, lineOf(F.kpi, "label: string"), "label"),
  text("ABox/Card/KpiCard", "value", 1, lineOf(F.kpi, "value:"), "value"),
  text("ABox/Header/PageHeader", "eyebrow", 0, lineOf(F.header, "eyebrow?"), "eyebrow"),
  text("ABox/Header/PageHeader", "title", 1, lineOf(F.header, "title:"), "title"),
  text("ABox/Header/PageHeader", "description", 2, lineOf(F.header, "description?"), "description"),
  text("ABox/Nav/ModuleTab", "label", 0, lineOf(F.tabs, "label"), "label"),
  text("ABox/Nav/WizardStep", "label", 0, lineOf(F.wizard, "label"), "label"),
  text("ABox/Feedback/EmptyState", "title", 0, lineOf(F.empty, "title"), "title"),
  text("ABox/Feedback/EmptyState", "body", 1, lineOf(F.empty, "body"), "body"),
  text("ABox/Form/LabeledField", "label", 0, lineOf(F.field, "label"), "label"),
  text("ABox/Form/Input", "placeholder", 0, lineOf(F.input, "placeholder"), "placeholder"),
  /* ---------- 4 BOOLEAN properties (optional-render guards) ---------- */
  bool("ABox/Card/KpiCard", "hasDelta", 2, lineOf(F.kpi, "{delta && ("), "delta"),
  bool("ABox/Header/PageHeader", "hasEyebrow", 0, lineOf(F.header, "{eyebrow && "), "eyebrow"),
  bool("ABox/Header/PageHeader", "hasDescription", 2, lineOf(F.header, "{description && "), "description"),
  bool("ABox/Feedback/EmptyState", "hasBody", 1, lineOf(F.empty, "{body && "), "body"),
];

/* ---------- the one new variant axis, and its 4 new ComponentNodes ---------- */
const kpiSet = ABOX_B4.sets.find((s) => s.name === "ABox/Card/KpiCard");
const kpiTones = kpiSet.values.map((v) => v.value);
const deltaChip = textsOf(kpiSet.values[0].node)[2];

const variantAxis = {
  set: "ABox/Card/KpiCard",
  existingProperty: kpiSet.property,
  property: "deltaSign",
  values: ["positive", "negative"],
  tones: kpiTones,
  source: lineOf(F.kpi, "delta.pct >= 0 ?"),
  positive: { characters: deltaChip.characters, note: "existing B4 construction text, left untouched" },
  negative: {
    characters: "▼ 4.2%",
    colorStyle: "ABox/Semantic/destructive",
    source: lineOf(F.kpi, "{delta.pct >= 0 ?"),
  },
  // Recorded, never silently corrected: B4 bound the positive chip to the tone
  // style, not to the sage style production declares at :78.
  positiveStyleByTone: Object.fromEntries(
    kpiSet.values.map((v) => [v.value, textsOf(v.node)[2].colorStyle]),
  ),
};

/* ---------- exposed nested instance ---------- */
const exposed = {
  component: "ABox/Form/LabeledField",
  of: "ABox/Control/Control",
  name: "control",
  source: lineOf(F.field, "children"),
};

/* ---------- deferred: target layer does not exist in B4 ---------- */
const deferred = [
  { component: "ABox/Card/KpiCard", property: "hasIcon", type: "BOOLEAN", missing: "no icon tile layer", source: lineOf(F.kpi, "{Icon && (") },
  { component: "ABox/Card/KpiCard", property: "hasHint", type: "BOOLEAN", missing: "no hint layer", source: lineOf(F.kpi, "{hint && ") },
  { component: "ABox/Card/KpiCard", property: "hasDeltaLabel", type: "BOOLEAN", missing: "no delta-label TEXT layer", source: lineOf(F.kpi, "{delta?.label && ") },
  { component: "ABox/Card/KpiCard", property: "deltaLabel", type: "TEXT", missing: "no delta-label TEXT layer", source: lineOf(F.kpi, "{delta?.label && ") },
  { component: "ABox/Header/PageHeader", property: "hasIcon", type: "BOOLEAN", missing: "no icon layer", source: lineOf(F.header, "icon?") },
  { component: "ABox/Header/PageHeader", property: "hasActions", type: "BOOLEAN", missing: "no actions wrapper layer", source: lineOf(F.header, "{actions && ") },
  { component: "ABox/Header/PageHeader", property: "actions", type: "INSTANCE_SWAP", missing: "no nested instance in the actions region", source: lineOf(F.header, "actions?") },
  { component: "ABox/Feedback/EmptyState", property: "hasIcon", type: "BOOLEAN", missing: "no icon layer", source: lineOf(F.empty, "icon?") },
  { component: "ABox/Feedback/EmptyState", property: "hasAction", type: "BOOLEAN", missing: "no action region", source: lineOf(F.empty, "action?") },
  { component: "ABox/Feedback/EmptyState", property: "action", type: "SLOT", missing: "no action region to attach or convert", source: lineOf(F.empty, "{action}") },
];

const counts = {
  boolean: bindings.filter((b) => b.type === "BOOLEAN").length,
  text: bindings.filter((b) => b.type === "TEXT").length,
  instanceSwap: 0,
  slot: 0,
  nonVariant: bindings.length,
  exposedInstances: 1,
  newVariantAxes: 1,
  newVariantNodes: kpiTones.length,
  variantsBefore: ABOX_B4.counts.totalVariants,
  variantsAfter: ABOX_B4.counts.totalVariants + kpiTones.length,
  axesBefore: 16,
  axesAfter: 17,
  sets: ABOX_B4.counts.sets,
  standalone: ABOX_B4.counts.components,
  physicalNodes: ABOX_B4.counts.totalVariants + kpiTones.length + ABOX_B4.counts.components,
  deferred: deferred.length,
  target: bindings.length + deferred.length,
};

const limitations = [
  'src/components/ui/button.tsx:8 "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed", used at src/components/abox/plan-card.tsx:116 (size="sm" disabled={inCart}) — not converted to a Figma variant or property: a set-wide state axis would require a production-backed value for the other eight Button combinations, and production names none; pointer-events and cursor have no Figma representation.',
  "src/components/abox/kpi-card.tsx:19,73,78 — with hasDelta = false the hidden delta layer still carries a deltaSign value, because Figma requires every variant to hold a value for every axis of its set; recorded rather than resolved by invention.",
  "src/components/abox/kpi-card.tsx:19,73,78 — one production prop delta? carries both presence and sign; Figma cannot express both in a single property, so it is split into hasDelta and deltaSign, and the production prop name delta is used for neither.",
  'src/components/abox/kpi-card.tsx:81 — the delta chip text "{delta.pct >= 0 ? \\"▲\\" : \\"▼\\"} {Math.abs(delta.pct).toFixed(1)}%" is computed from the numeric pct and is not exposed as a Text property; the static chip text authored per variant is sample/construction content and the computation is recorded rather than reproduced.',
  "src/components/abox/kpi-card.tsx:78 — no negative pct literal occurs at any production call site; deltaSign=negative is included on the strength of the source branch and this absence is recorded.",
  "src/components/abox/kpi-card.tsx:78 — B4 bound the positive delta chip to the per-tone status style (ABox/Status/primary | sage | warning), while production declares text-sage for every positive delta independent of tone. B5 does not rewrite those existing B4 bindings; the deviation is recorded here and left for a B4 amendment decision.",
  "src/components/ui/input.tsx:11 disabled:cursor-not-allowed disabled:opacity-50 — declared, never used in production; not converted.",
  "src/components/abox/control.tsx:11-12 — disabled variants are explicitly consumer-owned; no canonical definition exists to convert.",
  "src/components/abox/page-header.tsx:33 — eyebrow is suppressed in compact; the combination is not created.",
  "src/components/abox/page-header.tsx:15 / kpi-card.tsx:20 / empty-state.tsx:6 — icon?: ComponentType<{className?: string}> cannot become an Instance Swap because B4 created no icon Component and no icon layer; only the recorded intent survives, and no placeholder component is invented.",
  "src/components/abox/empty-state.tsx:9,24 — production passes raw inline <Link>/<button> elements styled with pill classes rather than any B4 component, so action cannot be an INSTANCE_SWAP (that type requires a default component, and nominating ActionPill on class similarity would be value-equality inference). A SLOT also cannot be created: the audited B4 EmptyState contains no action region to attach or convert, so SLOT creation is 0 regardless of runtime SLOT support, which is still detected read-only and printed.",
  "Hover / focus / active / transition rules in src/components/ui/button.tsx:8, action-pill.ts, surface.tsx, control.tsx, module-tabs.tsx:28, kpi-card.tsx:41,62 — CSS pseudo-classes, not reusable design-system states; not converted.",
  "Motion: CountUp, FadeRise, animate-hairline, group-hover:-rotate-6 group-hover:scale-105 — no reusable resting state beyond what already exists; not converted.",
  "Responsive md:/xl: rules (page-header.tsx:37,44,46, kpi-card.tsx, ui/input.tsx:11) — layout composition, not component-level states; deferred to B7/B8.",
  "color-mix() tints and oklch() source literals, as already recorded in B3/B4.",
  "b4Build() assigns no name to any sublayer, so every B5 target is resolved structurally (TEXT-descendant index + exact characters) and then named; naming an existing layer changes no geometry, style, variant or id, and is the only B5 mutation of B4 node metadata.",
];

const excluded = [
  { candidate: "ABox/Action/Button state axis", reason: "src/components/ui/button.tsx:8 styles the native disabled attribute; production names no non-disabled counterpart, so a set-wide axis would need an invented value." },
  { candidate: "hover / group-hover / focus-visible / focus / active", reason: "CSS pseudo-classes; production treats them as interaction behaviour, not reusable states." },
  { candidate: "ABox/Form/Input disabled", reason: "src/components/ui/input.tsx:11 declares it with no production call site; adding it would convert a standalone component into a set." },
  { candidate: "ABox/Control/Control disabled", reason: "src/components/abox/control.tsx:11-12 leaves it consumer-owned." },
  { candidate: "error / validation / aria-invalid", reason: "only present in the reference routes design-system.tsx and design-guide.tsx." },
  { candidate: "loading / checked / open / expanded / success", reason: "no production definition on any B4 object." },
  { candidate: "dialog, sheet, popover, tooltip, dropdown-menu, tabs states", reason: "behavioural primitives — B6." },
  { candidate: "responsive md:/xl: branches", reason: "layout composition — B7/B8." },
];

const out =
  "// GENERATED by tools/figma-plugin/extract-b5.mjs — do not hand-edit.\n" +
  "var ABOX_B5 = " +
  JSON.stringify(
    { variantAxis, bindings, exposed, deferred, counts, limitations, excluded },
    null,
    2,
  ) +
  ";\n";

writeFileSync(join(here, "tokens-b5.js"), out);
console.log(
  "tokens-b5.js written — TEXT " + counts.text + " + BOOLEAN " + counts.boolean +
    " = " + counts.nonVariant + " properties, " + counts.deferred + " deferred (" +
    counts.nonVariant + " + " + counts.deferred + " = " + counts.target + "), " +
    counts.newVariantNodes + " new variant nodes.",
);
