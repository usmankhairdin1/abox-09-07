#!/usr/bin/env node
// Phase 57 / Batch B10 — Documentation / Final Reference Layer extractor.
// Reads generated B1-B9 tokens and current reference documentation, then emits tokens-b10.js.
// Run from the repository root: node tools/figma-plugin/extract-b10.mjs
// Never hand-edit tokens-b10.js; never edit code.js directly.

import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const readProject = (p) => readFileSync(join(root, p), "utf8");
const evalToken = (file, name) => eval(readFileSync(join(here, file), "utf8") + ";" + name);

const T = evalToken("tokens.js", "ABOX_TOKENS");
const B1 = evalToken("tokens-b1.js", "ABOX_B1");
const B2 = evalToken("tokens-b2.js", "ABOX_B2");
const B3 = evalToken("tokens-b3.js", "ABOX_B3");
const B4 = evalToken("tokens-b4.js", "ABOX_B4");
const B5 = evalToken("tokens-b5.js", "ABOX_B5");
const B6 = evalToken("tokens-b6.js", "ABOX_B6");
const B7 = evalToken("tokens-b7.js", "ABOX_B7");
const B8 = evalToken("tokens-b8.js", "ABOX_B8");
const B9 = evalToken("tokens-b9.js", "ABOX_B9");

const mustContain = (file, fragments) => {
  const text = readProject(file);
  for (const fragment of fragments) {
    if (!text.includes(fragment)) throw new Error("B10 extraction guard failed: " + file + " does not contain " + JSON.stringify(fragment));
  }
};

mustContain("tools/figma-plugin/README.md", ["Batch B9", "Create All Screens", "Figma Presentation/Prototype mode"]);
mustContain(".lovable/manual-work-map.md", ["Phase 56 / Batch B9", "permanent Lovable-to-Figma sync", "real Figma ids still require"]);

const expectedPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells", "04 Experiences", "05 Screens", "06 Documentation"];
if (JSON.stringify(T.library.pages) !== JSON.stringify(expectedPages)) throw new Error("STOP: B0 page order differs from approved B10 baseline.");
if (B1.collections.length !== 9) throw new Error("STOP: B1 collection baseline missing.");
if ((B1.primitives.length + B1.semantics.length + B1.tones.length + B1.metals.length + Object.keys(B1.spacing).length + Object.keys(B1.radius).length + Object.keys(B1.border).length + B1.shadows.layers.length * 5 + Object.keys(B1.layout).length + Object.keys(B1.control).length) !== 200) throw new Error("STOP: B1 variable arithmetic changed.");
if ((B2.families.length + B2.roleFamilies.length + B2.floats.length) !== 19) throw new Error("STOP: B2 variable count changed.");
if ((B3.colorStyles.length + B3.textStyles.length + B3.effectStyles.length) !== 79) throw new Error("STOP: B3 style count changed.");
if (B4.counts.objects !== 14 || B4.counts.totalVariants !== 52) throw new Error("STOP: B4 component baseline changed.");
if (B5.counts.variantsAfter !== 56 || B5.counts.nonVariant !== 19 || B5.counts.exposedInstances !== 1) throw new Error("STOP: B5 state/property baseline changed.");
if (B6.counts.patterns !== 3 || B6.counts.patternNodes !== 4) throw new Error("STOP: B6 pattern baseline changed.");
if (B7.counts.topLevelObjects !== 3 || B7.counts.physicalComponentNodes !== 4) throw new Error("STOP: B7 shell baseline changed.");
if (B8.counts.topLevelFrames !== 5) throw new Error("STOP: B8 experience baseline changed.");
if (B9.counts.topLevelFrames !== 179 || B9.counts.classifiedInteractions !== 922) throw new Error("STOP: B9 screen/interaction baseline changed.");

const sha = (value) => createHash("sha256").update(value).digest("hex").slice(0, 16);
const oneLine = (value) => String(value || "").replace(/\s+/g, " ").trim();
const source = (path) => ({ kind: "source", name: path, path });
const batch = (name) => ({ kind: "batch", name });
const page = (name) => ({ kind: "page", name });
const collection = (name) => ({ kind: "collection", name });
const paintStyle = (name) => ({ kind: "paintStyle", name });
const textStyle = (name) => ({ kind: "textStyle", name });
const effectStyle = (name) => ({ kind: "effectStyle", name });
const componentRef = (name) => ({ kind: "component", name });
const patternRef = (name) => ({ kind: "pattern", name });
const shellRef = (name) => ({ kind: "shell", name });
const experienceRef = (name) => ({ kind: "experience", name });
const screenRef = (name) => ({ kind: "screen", name });

const row = (label, value, refs = []) => ({ label, value: oneLine(value), refs });
const section = (key, title, rows) => ({ key, title, rows });
const allComponentNames = [...B4.sets.map((x) => x.name), ...B4.components.map((x) => x.name)].sort();
const allStyleRefs = [
  ...B3.colorStyles.slice(0, 12).map((s) => paintStyle(s.name)),
  ...B3.textStyles.map((s) => textStyle(s.name)),
  ...B3.effectStyles.map((s) => effectStyle(s.name)),
];
const allLimitations = [];
const addLimitations = (phase, items) => {
  for (const item of items || []) allLimitations.push({ phase, text: oneLine(item) });
};
addLimitations("B1", B1.limitations);
addLimitations("B2", B2.limitations);
addLimitations("B3", B3.limitations);
addLimitations("B4", B4.limitations);
addLimitations("B5", B5.limitations);
addLimitations("B6", B6.limitations);
addLimitations("B7", B7.limitations);
addLimitations("B8", B8.limitations);
addLimitations("B9", B9.limitations);
for (const d of B5.deferred || []) allLimitations.push({ phase: "B5 deferred", text: `${d.component}.${d.property} (${d.type}) — ${d.missing}. ${d.source}` });
for (const d of B6.deferred || []) allLimitations.push({ phase: "B6 deferred", text: `${d.candidate} — ${d.reason}. ${d.source}` });
for (const d of B6.deferredInteractions || []) allLimitations.push({ phase: "B6 deferred interaction", text: `${d.candidate} — ${d.reason}. ${d.source}` });
for (const r of B6.rejected || []) allLimitations.push({ phase: "B6 rejected", text: `${r.candidate} — ${r.reason}` });
for (const shell of B7.shells) for (const d of shell.deferredProperties || []) allLimitations.push({ phase: "B7 deferred", text: `${shell.name}.${d.name} — ${d.reason}. ${d.source}` });
for (const exp of B8.experiences) for (const l of exp.limitations || []) allLimitations.push({ phase: "B8 frame limitation", text: `${exp.name} — ${l}` });

const limitationCategory = (text) => {
  const t = text.toLowerCase();
  if (t.includes("real figma") || t.includes("offline")) return "proof-status";
  if (t.includes("runtime") || t.includes("react") || t.includes("database") || t.includes("auth") || t.includes("pricing") || t.includes("subsidy")) return "runtime-only";
  if (t.includes("responsive") || t.includes("breakpoint")) return "responsive";
  if (t.includes("motion") || t.includes("animate") || t.includes("transition") || t.includes("smart animate")) return "motion";
  if (t.includes("deferred") || t.includes("missing") || t.includes("no target") || t.includes("no action region") || t.includes("no icon")) return "missing-target-or-deferred";
  if (t.includes("prototype") || t.includes("navigation") || t.includes("route-driven")) return "prototype-interaction";
  if (t.includes("oklch") || t.includes("color-mix") || t.includes("font") || t.includes("opentype") || t.includes("shadow")) return "figma-representation";
  return "governance-boundary";
};
const limitationRows = allLimitations.map((l, i) => ({ label: `${String(i + 1).padStart(2, "0")} · ${l.phase} · ${limitationCategory(l.text)}`, value: l.text, refs: [batch(l.phase.split(" ")[0])] }));

const screenRows = B9.screens.map((s, i) => row(`${String(i + 1).padStart(3, "0")} · ${s.name}`, `${s.route || "no route"} · ${s.sourceType} · ${s.shell && s.shell.family ? s.shell.family : "Standalone"} · ${s.sources.join(" | ")}`, [screenRef(s.name)]));
const exclusionRows = B9.exclusions.map((e) => row(e.route, `${e.reason} · ${e.source}`, [source(e.source)]));
const interactionRows = [
  row("A · directly representable in Figma prototype", `${B9.counts.categoryAPrototypeReactions} interactions; native reactions only when source and target resolve to generated B9 frames/states.`, [batch("B9")]),
  row("B · component state/variant", `${B9.counts.categoryBStateMappings} mappings represented through existing B4/B5 state/variant behavior.`, [batch("B4"), batch("B5")]),
  row("C · runtime/business-logic dependent", `${B9.counts.categoryCRuntimeMappings} mappings recorded as metadata unless a source-backed visual target exists.`, [batch("B9")]),
  row("D · unsupported/ambiguous", `${B9.counts.categoryDUnsupportedMappings} mappings recorded only; no destination invented.`, [batch("B9")]),
];
const representativeInteractions = [
  ...B9.interactionClassification.A.slice(0, 8).map((i) => row(`A · ${i.id}`, `${i.sourceKey} → ${i.targetKey}; ${i.trigger}; ${i.action}; ${i.transition || "instant"}`, [screenRef(B9.screens.find((s) => s.key === i.sourceKey)?.name || ""), screenRef(B9.screens.find((s) => s.key === i.targetKey)?.name || "")])),
  ...B9.interactionClassification.B.slice(0, 6).map((i) => row(`B · ${i.id || i.control || i.sourceKey}`, oneLine(`${i.sourceKey || "source"}; ${i.control || "component state"}; ${i.representation || i.reason || "existing component state/variant"}`), [batch("B4"), batch("B5")])),
  ...B9.interactionClassification.C.slice(0, 6).map((i) => row(`C · ${i.id || i.control || i.sourceKey}`, oneLine(`${i.sourceKey || "source"}; ${i.control || "runtime"}; ${i.reason || i.runtimeBoundary || "runtime/business-logic dependent"}`), [batch("B9")])),
  ...B9.interactionClassification.D.slice(0, 3).map((i) => row(`D · ${i.id || i.control || i.sourceKey}`, oneLine(`${i.sourceKey || "source"}; ${i.control || "unsupported"}; ${i.reason || "unsupported/ambiguous"}`), [batch("B9")])),
];

const commands = [
  row("Phase 52A proof", "Run proof / Verify only in ABox Proof — Scratch", [source("tools/figma-plugin/ui.html")]),
  row("B0", "Create library pages / Verify library pages · b0-run / b0-verify", [page("00 Foundations")]),
  row("B1", "Create foundation variables / Verify foundation variables · b1-run / b1-verify", [batch("B1")]),
  row("B2", "Create typography variables / Verify typography variables · b2-run / b2-verify", [batch("B2")]),
  row("B3", "Create foundational styles / Verify foundational styles · b3-run / b3-verify", [batch("B3")]),
  row("B4", "Create components / Verify components · b4-run / b4-verify", [batch("B4")]),
  row("B5", "Create component states / Verify component states · b5-run / b5-verify", [batch("B5")]),
  row("B6", "Create patterns / Verify patterns · b6-run / b6-verify", [batch("B6")]),
  row("B7", "Create shells / Verify shells · b7-run / b7-verify", [batch("B7")]),
  row("B8", "Create experiences / Verify experiences · b8-run / b8-verify", [batch("B8")]),
  row("B9", "Create All Screens / Verify All Screens · b9-run / b9-verify", [batch("B9")]),
  row("B10", "Create documentation / Verify documentation · b10-run / b10-verify", [batch("B10")]),
];

const documents = [
  {
    key: "overview",
    name: "ABox/Documentation/00 Library Overview",
    title: "ABox Design System Library Overview",
    purpose: "Seven-page Figma reference architecture and current proof boundaries.",
    sources: ["tools/figma-plugin/tokens.js", "tools/figma-plugin/README.md", ".lovable/manual-work-map.md"],
    references: expectedPages.map(page).concat([batch("B0"), batch("B1"), batch("B2"), batch("B3"), batch("B4"), batch("B5"), batch("B6"), batch("B7"), batch("B8"), batch("B9"), batch("B10")]),
    sections: [
      section("structure", "Library structure", expectedPages.map((p, i) => row(String(i).padStart(2, "0"), p, [page(p)]))),
      section("boundary", "What B10 does and does not do", [
        row("Creates", "Native editable documentation frames on 06 Documentation only."),
        row("Does not create", "No variables, styles, components, component sets, patterns, shells, experiences or screens."),
        row("Does not execute", "React, JavaScript, backend/API logic, database state, auth, pricing, subsidy, uploads or governed runtime workflows."),
        row("No sync", "No permanent Lovable-to-Figma synchronization is implemented."),
      ]),
    ],
  },
  {
    key: "foundations",
    name: "ABox/Documentation/01 Foundations Tokens Typography Styles",
    title: "Foundations, Tokens, Typography and Styles",
    purpose: "B1-B3 governed foundation model and style relationship.",
    sources: ["tools/figma-plugin/tokens-b1.js", "tools/figma-plugin/tokens-b2.js", "tools/figma-plugin/tokens-b3.js", "src/styles.css"],
    references: B1.collections.map((c) => collection(c.name)).concat(allStyleRefs),
    sections: [
      section("b1", "B1 variables", [
        row("Collections", `${B1.collections.length} collections: ${B1.collections.map((c) => c.name).join(", ")}`, B1.collections.map((c) => collection(c.name))),
        row("Variables", "200 variables across primitive, semantic, status, metal, spacing, radius, border, elevation, layout and control sizing."),
        row("Modes", "Every B1 collection uses Light and Dark modes; no Default mode is documented as authoritative."),
        row("Alias rule", "Aliases follow source declarations only; equal values do not create aliases."),
      ]),
      section("b2", "B2 typography", [
        row("Collection", "ABox/Typography with 19 variables.", [collection("ABox/Typography")]),
        row("Families", B2.families.map((f) => f.name).join(", ")),
        row("Roles", B2.roleFamilies.map((f) => f.name).join(", ")),
        row("Modes", "Light and Dark values are intentionally identical because production declares no dark typography override."),
      ]),
      section("b3", "B3 foundational styles", [
        row("Color styles", `${B3.colorStyles.length} color styles bound to B1 variables.`),
        row("Text styles", `${B3.textStyles.length} text styles: ${B3.textStyles.map((s) => s.name).join(", ")}.`, B3.textStyles.map((s) => textStyle(s.name))),
        row("Effect styles", `${B3.effectStyles.length} effect styles: ${B3.effectStyles.map((s) => s.name).join(", ")}.`, B3.effectStyles.map((s) => effectStyle(s.name))),
      ]),
    ],
  },
  {
    key: "components",
    name: "ABox/Documentation/02 Components States Properties",
    title: "Components, States and Properties",
    purpose: "B4 component inventory and B5 state/property governance.",
    sources: ["tools/figma-plugin/tokens-b4.js", "tools/figma-plugin/tokens-b5.js", "src/components/abox/*", "src/components/ui/button.tsx", "src/components/ui/input.tsx"],
    references: allComponentNames.map(componentRef),
    sections: [
      section("b4-inventory", "B4 component foundation", [
        row("Objects", `${B4.counts.objects} objects: ${B4.counts.sets} component sets + ${B4.counts.components} standalone components.`),
        row("Variants", `${B4.counts.totalVariants} variants: ${B4.counts.fixedVariants} fixed + ${B4.counts.enumeratedVariants} call-site enumerated.`),
        ...allComponentNames.map((name) => row(name, "Existing reusable Figma asset; designers should reuse this asset rather than duplicate its structure.", [componentRef(name)])),
      ]),
      section("b5-states", "B5 states and properties", [
        row("Variant axis", `${B5.variantAxis.set}.${B5.variantAxis.property} = ${B5.variantAxis.values.join(" | ")}; ${B5.counts.newVariantNodes} negative variants added.`, [componentRef(B5.variantAxis.set)]),
        row("Component properties", `${B5.counts.nonVariant} non-variant properties: ${B5.counts.text} text, ${B5.counts.boolean} boolean, ${B5.counts.instanceSwap} instance swap, ${B5.counts.slot} slot.`),
        row("Exposed nested instance", `${B5.exposed.component} exposes existing ${B5.exposed.of} as ${B5.exposed.name}.`, [componentRef(B5.exposed.component), componentRef(B5.exposed.of)]),
        row("Deferred properties", `${B5.counts.deferred} properties remain deferred because target layers were unavailable.`),
      ]),
    ],
  },
  {
    key: "patterns-shells",
    name: "ABox/Documentation/03 Patterns Shells",
    title: "Patterns and Shells",
    purpose: "B6 and B7 reusable composition layer, with no duplicated foundations.",
    sources: ["tools/figma-plugin/tokens-b6.js", "tools/figma-plugin/tokens-b7.js", "src/components/abox/internal-shell.tsx", "src/components/abox/marketplace-shell.tsx", "src/components/abox/member-shell.tsx"],
    references: B6.patterns.map((p) => patternRef(p.name)).concat(B7.shells.map((s) => shellRef(s.name))),
    sections: [
      section("patterns", "B6 patterns", [
        row("Inventory", `${B6.counts.patterns} top-level pattern objects / ${B6.counts.patternNodes} physical nodes / ${B6.counts.prototypes} prototype reactions.`),
        ...B6.patterns.map((p) => row(p.name, `${p.kind}; source ${p.source}; uses existing B4/B5 instances.`, [patternRef(p.name)])),
      ]),
      section("shells", "B7 shells", [
        row("Inventory", `${B7.counts.topLevelObjects} shell assets / ${B7.counts.physicalComponentNodes} physical nodes / ${B7.counts.prototypes} prototype reactions.`),
        ...B7.shells.map((s) => row(s.name, `${s.kind}; ${s.signature}; source ${s.source}`, [shellRef(s.name)])),
      ]),
      section("governance", "Reuse rules", [
        row("Instances", "B6 and B7 consume existing B1-B5 assets by live reference; they do not copy primitive values."),
        row("Properties", "Only source-backed finite properties are created; deferred properties remain documented."),
      ]),
    ],
  },
  {
    key: "experiences",
    name: "ABox/Documentation/04 Experiences",
    title: "Experiences",
    purpose: "B8 journey-level reference compositions.",
    sources: ["tools/figma-plugin/tokens-b8.js", "src/routes/agency.downlines.new.*", "src/routes/plans.index.tsx", "src/routes/member.*"],
    references: B8.experiences.map((e) => experienceRef(e.name)),
    sections: [
      section("inventory", "B8 inventory", [
        row("Frames", `${B8.counts.topLevelFrames} top-level editable FRAME reference compositions on 04 Experiences.`),
        ...B8.experiences.map((e) => row(e.name, `${e.type}; states ${e.states.join(", ")}; shell ${e.shell.name}; signature ${e.signature}`, [experienceRef(e.name), shellRef(e.shell.name)])),
      ]),
      section("boundaries", "B8 boundaries", [
        row("Reuse", "B8 consumes B7 shells, B6 patterns and B4/B5 components as references."),
        row("No prototypes", `${B8.counts.prototypes} prototype links are created in B8.`),
        row("No new foundations", "No variables, styles, components, component sets, patterns, properties or responsive variants are created."),
      ]),
    ],
  },
  {
    key: "screens",
    name: "ABox/Documentation/05 Screens Route Inventory",
    title: "Screens and Route Inventory",
    purpose: "B9 source-derived bulk screen inventory, route exclusions and traceability.",
    sources: ["tools/figma-plugin/tokens-b9.js", "src/routes/*", "src/lib/screens.ts", "src/components/m06/registry.tsx", "src/lib/m08/registry.ts"],
    references: B9.screens.map((s) => screenRef(s.name)),
    sections: [
      section("method", "B9 bulk import model", [
        row("Operation", "Create All Screens is one user-facing bulk import operation; manual per-screen import is not implemented."),
        row("Source-derived", "Inventory is derived from routes, SCREENS, governed M06, governed M08, shell/component/pattern sources and B1-B8 tokens."),
        row("Idempotency", "Repeated runs use deterministic identity, signatures and placement; conflicts stop rather than silently overwrite."),
        row("Arithmetic", B9.arithmetic.formula),
      ]),
      section("counts", "B9 counts", Object.entries(B9.counts).map(([k, v]) => row(k, String(v)))),
      section("exclusions", "Route exclusions", exclusionRows),
      section("inventory", "Complete B9 screen/state manifest", screenRows),
    ],
  },
  {
    key: "prototype",
    name: "ABox/Documentation/06 Prototype Interaction Mapping",
    title: "Prototype and Interaction Mapping",
    purpose: "B9 source-backed interaction classification and Figma/runtime boundary.",
    sources: ["tools/figma-plugin/tokens-b9.js", "tools/figma-plugin/plugin.js", "src/routes/*", "src/components/abox/*"],
    references: [batch("B9")],
    sections: [
      section("classification", "A/B/C/D classification", interactionRows),
      section("representative", "Representative interaction records", representativeInteractions),
      section("motion", "Motion and transition audit", B9.motionAudit.map((m) => row(m.sourceKey || m.source, `${m.sourceMotion} → ${m.figmaMapping}`, [source(m.source)]))),
      section("boundary", "Prototype boundary", [
        row("Figma prototype", "Only deterministic source-backed Category-A mappings receive native Figma prototype reactions."),
        row("Visual states", "Hover, focus, pressed, active, selected, expanded and disabled states prefer existing B4/B5 state/variant behavior or metadata."),
        row("Runtime logic", "Auth, APIs, database, pricing, subsidy, uploads and business logic are not simulated in Figma."),
      ]),
    ],
  },
  {
    key: "governance",
    name: "ABox/Documentation/07 Governance Source Of Truth",
    title: "Governance and Source of Truth",
    purpose: "Authority model across production code, extraction, reference architecture and final library.",
    sources: [".lovable/manual-work-map.md", "tools/figma-plugin/README.md", "tools/figma-plugin/tokens-b1.js", "tools/figma-plugin/tokens-b9.js"],
    references: expectedPages.map(page),
    sections: [
      section("hierarchy", "Governance hierarchy", [
        row("1", "Production code/source is authoritative for runtime behavior, production tokens and production typography."),
        row("2", "Plugin extraction/audit translates source-backed facts into deterministic reference data."),
        row("3", "B1-B9 Figma reference architecture organizes variables, styles, components, patterns, shells, experiences and screens."),
        row("4", "Final Figma Library is a standalone design/prototype reference artifact."),
      ]),
      section("authority", "Layer authority", [
        row("Production behavior", "Production source code remains authoritative."),
        row("Production tokens", "Production CSS/source remains authoritative; Figma variables/styles are reference representations."),
        row("Reusable Figma components", "B4/B5 assets are authoritative inside the Figma library only."),
        row("Screen reference composition", "B9 frames are source-derived design references, not runtime screens."),
        row("Prototype behavior", "B9 prototype reactions are Figma-only representations of source-backed deterministic interactions."),
      ]),
    ],
  },
  {
    key: "workflow",
    name: "ABox/Documentation/08 Import Reimport Workflow",
    title: "Figma Import and Re-import Workflow",
    purpose: "How to operate the standalone import without permanent sync.",
    sources: ["tools/figma-plugin/ui.html", "tools/figma-plugin/build.mjs", "tools/figma-plugin/README.md"],
    references: [source("tools/figma-plugin/ui.html"), source("tools/figma-plugin/build.mjs")],
    sections: [
      section("operating-model", "Operating model", [
        row("1", "Lovable/ABox production code remains independent."),
        row("2", "When the application changes, regenerate plugin tokens and run the explicit plugin commands again."),
        row("3", "Extraction compares source identity and signatures."),
        row("4", "Existing matching Figma assets are reused."),
        row("5", "Changed source-backed assets are reconciled according to their phase rules."),
        row("6", "Conflicts are reported rather than silently overwritten."),
        row("7", "Figma remains a standalone design/prototype artifact."),
        row("8", "There is no permanent sync connection."),
      ]),
      section("commands", "Command map", commands),
    ],
  },
  {
    key: "limitations-evidence",
    name: "ABox/Documentation/09 Limitations Evidence Register",
    title: "Limitations, Deferred Items and Evidence Status",
    purpose: "Consolidated B1-B9 limitation register and proof model.",
    sources: ["tools/figma-plugin/tokens-b1.js", "tools/figma-plugin/tokens-b2.js", "tools/figma-plugin/tokens-b3.js", "tools/figma-plugin/tokens-b4.js", "tools/figma-plugin/tokens-b5.js", "tools/figma-plugin/tokens-b6.js", "tools/figma-plugin/tokens-b7.js", "tools/figma-plugin/tokens-b8.js", "tools/figma-plugin/tokens-b9.js", "tools/figma-plugin/README.md", ".lovable/manual-work-map.md"],
    references: [batch("B1"), batch("B2"), batch("B3"), batch("B4"), batch("B5"), batch("B6"), batch("B7"), batch("B8"), batch("B9"), batch("B10")],
    sections: [
      section("status-model", "Evidence status model", [
        row("PLAN APPROVED", "Plan approved; no implementation evidence by itself."),
        row("OFFLINE / PLUGIN-LAYER IMPLEMENTED", "Plugin/reference files exist for the batch."),
        row("OFFLINE VERIFIED", "Extractor/build/syntax checks passed outside Figma."),
        row("REAL FIGMA CREATED", "The relevant command created/read native objects inside Figma Desktop."),
        row("REAL FIGMA VERIFIED", "The verify command and manual Figma inspection confirmed native objects and references."),
      ]),
      section("current-evidence", "Current evidence state", [
        row("B0-B9", "Plugin/reference-layer implementation records exist; offline validation records exist in repository documentation."),
        row("B9", "Offline checks passed in the recorded implementation summary; real Figma Desktop proof remains pending unless executed."),
        row("B10", "Created by this batch only after plan approval; real Figma proof is pending until b10-run and b10-verify execute in Figma Desktop."),
        row("Real proof label", "If native creation/readback is not performed, report REAL FIGMA NOT VERIFIED."),
      ]),
      section("limitations", "Consolidated limitation/deferred register", limitationRows),
      section("stop-conditions", "Conflict and stop conditions", [
        row("Duplicate identity", "Duplicate same-name or same-identity B10 objects stop verification."),
        row("Wrong target", "Wrong file or missing 06 Documentation page stops before B10 writes."),
        row("Protected mutation", "Changed B1-B9 counts, pages or signatures stop verification."),
        row("Broken reference", "Missing referenced B1-B9 assets are reported; B10 does not create substitutes."),
      ]),
    ],
  },
];

const layout = { frameWidth: 1440, frameXGap: 1560, frameYGap: 1200, startX: 0, startY: 0, columns: 2 };
const placement = documents.map((doc, i) => ({ name: doc.name, x: layout.startX + (i % layout.columns) * layout.frameXGap, y: layout.startY + Math.floor(i / layout.columns) * layout.frameYGap }));
for (const doc of documents) {
  const refs = doc.references.map((r) => `${r.kind}:${r.name}`).sort();
  const sectionKeys = doc.sections.map((s) => s.key).join("|");
  const sourceKeys = doc.sources.slice().sort().join("|");
  doc.signature = sha(JSON.stringify({ name: doc.name, key: doc.key, sectionKeys, sources: sourceKeys, refs, counts: { b1: 200, b2: 19, b3: 79, b4: B4.counts, b5: B5.counts, b6: B6.counts, b7: B7.counts, b8: B8.counts, b9: B9.counts }, evidence: "real-figma-pending-unless-run", limitations: limitationRows.map((r) => r.label) }));
}

const ABOX_B10 = {
  meta: {
    batch: "Phase 57 / Batch B10 — Documentation / Final Reference Layer",
    page: "06 Documentation",
    generatedBy: "tools/figma-plugin/extract-b10.mjs",
    protects: ["B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9"],
    operation: "Create documentation",
    verifyOperation: "Verify documentation",
    model: "final source-backed reference documentation; standalone artifact; no permanent sync",
  },
  counts: {
    documentationFrames: documents.length,
    b0Pages: expectedPages.length,
    b1Collections: B1.collections.length,
    b1Variables: 200,
    b2Variables: 19,
    b3Styles: 79,
    b4Objects: B4.counts.objects,
    b4Sets: B4.counts.sets,
    b4Standalone: B4.counts.components,
    b5Variants: B5.counts.variantsAfter,
    b5Physical: B5.counts.physicalNodes,
    b5NonVariant: B5.counts.nonVariant,
    b5Exposed: B5.counts.exposedInstances,
    b6TopLevel: B6.counts.patterns,
    b6PhysicalNodes: B6.counts.patternNodes,
    b7TopLevel: B7.counts.topLevelObjects,
    b7PhysicalNodes: B7.counts.physicalComponentNodes,
    b8TopLevelFrames: B8.counts.topLevelFrames,
    b9TopLevelFrames: B9.counts.topLevelFrames,
    b9CategoryAPrototypeReactions: B9.counts.categoryAPrototypeReactions,
    b9CategoryBStateMappings: B9.counts.categoryBStateMappings,
    b9CategoryCRuntimeMappings: B9.counts.categoryCRuntimeMappings,
    b9CategoryDUnsupportedMappings: B9.counts.categoryDUnsupportedMappings,
    b9ClassifiedInteractions: B9.counts.classifiedInteractions,
    limitationRows: limitationRows.length,
    newVariables: 0,
    newStyles: 0,
    newComponents: 0,
    newComponentSets: 0,
    newPatterns: 0,
    newShells: 0,
    newExperiences: 0,
    newScreens: 0,
  },
  page: "06 Documentation",
  layout,
  documents,
  placement,
  evidenceStatus: [
    { phase: "B0-B9", status: "OFFLINE / PLUGIN-LAYER IMPLEMENTED", realFigma: "REAL FIGMA NOT VERIFIED unless Figma Desktop outputs are supplied." },
    { phase: "B9", status: "OFFLINE VERIFIED in repository record", realFigma: "Presentation/prototype proof pending unless executed in Figma Desktop." },
    { phase: "B10", status: "PLAN APPROVED before implementation; command output determines creation/verification evidence.", realFigma: "REAL FIGMA NOT VERIFIED until b10-run and b10-verify execute in Figma Desktop." },
  ],
  limitationCategories: [...new Set(limitationRows.map((r) => r.label.split(" · ")[2]))].sort(),
  verificationChecklist: [
    "Exactly seven B0 pages exist in original order.",
    "B10 top-level assets exist only on 06 Documentation.",
    "The 10 B10 documentation frames exist in deterministic order and placement.",
    "Every B10 frame is a native editable FRAME with native text/table layout.",
    "No screenshots, flattened images, HTML embeds, or external documentation images exist in B10 frames.",
    "B1 remains 9 collections / 200 variables.",
    "B2 remains ABox/Typography with 19 variables.",
    "B3 remains 79 styles.",
    "B4/B5 remain 11 component sets, 3 standalone components, 56 variant nodes, 59 physical component nodes, 19 non-variant properties, and 1 exposed nested instance.",
    "B6 remains 3 top-level pattern objects / 4 physical nodes.",
    "B7 remains 3 shell assets / 4 physical nodes.",
    "B8 remains 5 top-level experience frames on 04 Experiences.",
    "B9 remains 179 top-level screen/state frames and source-backed reaction metadata on 05 Screens.",
    "No new variables/styles/components/component sets/patterns/shells/experiences/screens were created by B10.",
    "Documentation references resolve to existing B1-B9 assets by name and available node ID.",
    "Documentation does not claim unverified real-Figma evidence.",
    "Runtime behavior and Figma prototype behavior are separated.",
    "B9 Create All Screens bulk-import model is documented as one user operation.",
    "Permanent Lovable-Figma sync is explicitly excluded.",
    "Limitations/deferred items from B1-B9 are present and not hidden.",
    "Run 2 creates zero duplicate B10 documentation frames.",
    "B10 signatures remain deterministic.",
    "ABox Proof — Scratch remains untouched.",
    "src/** remains untouched, verified outside Figma.",
    "Existing extractor/build/syntax checks remain unaffected.",
  ],
};

writeFileSync(join(here, "tokens-b10.js"), "// GENERATED by tools/figma-plugin/extract-b10.mjs — do not hand-edit.\nvar ABOX_B10 = " + JSON.stringify(ABOX_B10, null, 2) + ";\n");
console.log("wrote tokens-b10.js (" + documents.length + " documentation frames, " + limitationRows.length + " limitation rows)");
