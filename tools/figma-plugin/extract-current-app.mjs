#!/usr/bin/env node
// Phase 59 — Current Application Fidelity Import extractor.
// Reads current production routes plus the closed B9 manifest and emits a separate additive import manifest.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const evalToken = (file, name) => eval(readFileSync(join(here, file), "utf8") + ";" + name);
const B9 = evalToken("tokens-b9.js", "ABOX_B9");
const B10 = evalToken("tokens-b10.js", "ABOX_B10");
const B8 = evalToken("tokens-b8.js", "ABOX_B8");

if (B9.counts.topLevelFrames !== 179 || B9.counts.categoryAPrototypeReactions !== 682) throw new Error("STOP: protected B9 baseline drifted.");
if (B10.counts.documentationFrames !== 10) throw new Error("STOP: protected B10 baseline drifted.");

const unique = (items) => [...new Set(items.filter(Boolean))];
const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
const slug = (value) => clean(value).replace(/\$/g, "param-").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/--+/g, "-") || "screen";
const hash = (value) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, "0");
};

function filesBelow(path) {
  const absolute = join(root, path);
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path + "/" + entry.name;
    return entry.isDirectory() ? filesBelow(relative) : [relative];
  });
}
const routeInventory = filesBelow("src/routes").filter((file) => file.endsWith(".tsx")).flatMap((sourceFile) => {
  const text = read(sourceFile);
  const match = text.match(/createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/);
  if (!match) return [];
  const route = match[1];
  const category = sourceFile.endsWith("/__root.tsx") ? "root"
    : /beforeLoad\s*:|<Outlet\s*\/?\s*>/.test(text) && !/component\s*:/.test(text) ? "layout-only"
      : /throw\s+redirect|redirect\s*\(/.test(text) ? "redirect-or-alias"
        : /design-(?:guide|system)/.test(sourceFile) ? "design-reference"
          : "content";
  return [{ route, sourceFile, category, dynamicParameters: [...route.matchAll(/\$([A-Za-z0-9_]+)/g)].map((item) => item[1]), headMetadata: /\bhead\s*:/.test(text) }];
});
if (routeInventory.length !== B9.counts.routeDeclarations) throw new Error("STOP: route declaration inventory drifted (expected " + B9.counts.routeDeclarations + ", found " + routeInventory.length + ").");
if (unique(routeInventory.map((item) => item.sourceFile)).length !== routeInventory.length) throw new Error("STOP: duplicate route source identity.");

const moduleOrder = ["public", "agency", "m06", "m08", "agency-operations", "agent", "jet", "employer", "marketplace-admin", "member", "platform", "partner"];
const moduleLabels = {
  public: "Public & Marketplace", agency: "Agency & Organization", m06: "M06 Workforce", m08: "M08 Selling Setup",
  "agency-operations": "Agency Operations", agent: "Agent Workspace", jet: "JET Platform", employer: "Employer & ICHRA",
  "marketplace-admin": "Marketplace Administration", member: "Member", platform: "Platform Governance", partner: "Partner",
};
function moduleOf(screen) {
  const route = String(screen.route || "").replace(/\/$/, "") || "/";
  if (screen.sourceType === "m06-governed-screen") return "m06";
  if (screen.sourceType === "m08-governed-screen") return "m08";
  if (route.startsWith("/agency")) return "agency";
  if (route.startsWith("/app/agency")) return "agency-operations";
  if (route.startsWith("/app/jet")) return "jet";
  if (route.startsWith("/app/employer")) return "employer";
  if (route.startsWith("/marketplace/admin")) return "marketplace-admin";
  if (route.startsWith("/member")) return "member";
  if (route.startsWith("/platform")) return "platform";
  if (route === "/app/partner") return "partner";
  if (route.startsWith("/app")) return "agent";
  return "public";
}

const componentMap = [
  ["ActionPill", "ABox/Action/ActionPill"], ["Button", "ABox/Action/Button"], ["StatusBadge", "ABox/Status/StatusBadge"],
  ["MetalBadge", "ABox/Status/MetalBadge"], ["Surface", "ABox/Surface/Surface"], ["Control", "ABox/Control/Control"],
  ["KpiCard", "ABox/Card/KpiCard"], ["PageHeader", "ABox/Header/PageHeader"], ["ModuleTabs", "ABox/Nav/ModuleTab"],
  ["DownlineWizardStepper", "ABox/Nav/WizardStep"], ["WizardStepper", "ABox/Nav/WizardStep"], ["AboxMark", "ABox/Brand/AboxMark"],
  ["EmptyState", "ABox/Feedback/EmptyState"], ["LabeledField", "ABox/Form/LabeledField"], ["Input", "ABox/Form/Input"],
];
const routeLocalMap = ["DataTable", "PlanCard", "MarketplacePageLayout", "NoticePage", "DownlineContextBanner", "ShoppingPathBar", "ProductSwitcher", "QuoteEditPanel", "CarrierMark", "Dialog", "Sheet", "Drawer", "Popover", "Tabs", "Select", "Chart", "PlanAIAssistant", "PlanOAssistant", "SellingSetup", "WorkforcePage"];

function stringsFrom(text) {
  const values = [];
  for (const match of text.matchAll(/>([^<>{}\n][^<>{}\n]{1,90})</g)) {
    const value = clean(match[1]);
    if (/^[A-Za-z0-9$]/.test(value) && !/[=;{}]/.test(value)) values.push(value);
  }
  for (const match of text.matchAll(/(?:title|label|description|placeholder|eyebrow|caption|empty)=\{?["']([^"']{2,100})["']/g)) values.push(clean(match[1]));
  return unique(values).slice(0, 24);
}
function sourceEvidence(screen) {
  if (!screen.sourceFile || !screen.sourceFile.startsWith("src/")) return { text: "", labels: [] };
  try { const text = read(screen.sourceFile); return { text, labels: stringsFrom(text) }; } catch { return { text: "", labels: [] }; }
}
function sectionsFor(screen, text, labels) {
  const sections = [];
  const add = (kind, title, columns, rows) => sections.push({ key: slug(kind + "-" + title), kind, title, columns, rows });
  if (/KpiCard|StatCard|Counter/.test(text)) add("kpi-row", "Key metrics", Math.min(4, Math.max(3, (text.match(/KpiCard|StatCard/g) || []).length || 3)), labels.slice(0, 4));
  if (/DataTable|<Table|<table/.test(text)) add("data-table", labels.find((v) => /people|organization|customer|product|market|task|quote|record/i.test(v)) || "Records", 1, labels.slice(0, 8));
  if (/PlanCard/.test(text)) add("plan-grid", "Available plans", /horizontal/.test(text) ? 1 : 3, labels.slice(0, 8));
  if (/onSubmit|<form/.test(text)) add("form", labels.find((v) => /details|information|settings|contact|request|profile/i.test(v)) || "Details", 2, labels.slice(0, 8));
  if (/Tabs|ModuleTabs|setTab/.test(text)) add("tabs", "Sections", 1, labels.slice(0, 6));
  if (/Dialog|Sheet|Drawer|Popover/.test(text)) add("overlay", "Source-backed overlay", 1, labels.slice(0, 6));
  if (/EmptyState|EmptyRows|empty=/.test(text)) add("empty-state", "Empty state", 1, labels.slice(0, 3));
  if (!sections.length) add("content", labels[0] || screen.title || "Screen content", /grid-cols-[234]/.test(text) ? Number((text.match(/grid-cols-([234])/) || [])[1] || 2) : 1, labels.slice(0, 10));
  return sections;
}

const screens = B9.screens.map((screen, index) => {
  const { text, labels } = sourceEvidence(screen);
  const sourceComponents = unique(componentMap.filter(([source]) => new RegExp("\\b" + source + "\\b").test(text)).map(([, figma]) => figma));
  const components = unique([...(screen.components || []), ...sourceComponents]);
  const routeLocal = unique(routeLocalMap.filter((name) => new RegExp("\\b" + name + "\\b").test(text)));
  const responsive = /(?:sm|md|lg|xl):/.test(text);
  const sections = sectionsFor(screen, text, labels);
  const estimatedHeight = Math.max(1024, 420 + sections.reduce((n, s) => n + (s.kind === "data-table" || s.kind === "plan-grid" ? 420 : 260), 0));
  const module = moduleOf(screen);
  const stableId = "current:" + screen.key;
  const spec = {
    key: stableId,
    b9Key: screen.key,
    name: "ABox/CurrentApp/" + moduleLabels[module] + "/" + (screen.id ? slug(screen.id) + "/" : "") + slug(stableId.replace(/^current:/, "")),
    title: screen.title,
    route: screen.route,
    sourceFile: screen.sourceFile,
    sourceType: screen.sourceType,
    screenId: screen.id || "",
    module,
    shell: screen.shell,
    components,
    patterns: screen.patterns || [],
    routeLocal,
    labels,
    sections,
    states: screen.states || [],
    responsiveEvidence: responsive || String(screen.responsive || "").toLowerCase().includes("responsive"),
    viewports: responsive || String(screen.responsive || "").toLowerCase().includes("responsive") ? [1440, 390] : [1440],
    desktopHeight: estimatedHeight,
    sources: unique([...(screen.sources || []), screen.sourceFile]),
    order: index,
    b8Refs: B8.experiences.filter((experience) => (experience.sources || []).some((source) => String(source).split(":")[0] === screen.sourceFile)).map((experience) => experience.name),
    bindings: {
      paintStyles: ["ABox/Semantic/background", "ABox/Semantic/foreground", "ABox/Semantic/surface", "ABox/Semantic/card", "ABox/Semantic/muted-foreground", "ABox/Semantic/hairline"],
      textStyles: ["ABox/Text/serial"],
      literalFallbacks: ["source-derived dimensions", "source-unmapped spacing", "unsupported responsive values"],
    },
    evidenceQuality: { structure: "source-static", responsive: responsive ? "breakpoint-candidate" : "desktop-only", interactions: "B9-governed" },
  };
  spec.sourceSignature = hash(spec.sources.slice().sort().join("|") + "|" + hash(text));
  spec.structureSignature = hash(JSON.stringify([spec.sections, spec.components, spec.patterns, spec.routeLocal, spec.viewports]));
  spec.bindingSignature = hash(JSON.stringify([spec.components, spec.patterns, spec.shell && spec.shell.name]));
  spec.signature = [spec.key, spec.route, spec.sourceSignature, spec.structureSignature, spec.bindingSignature].join("|");
  return spec;
});

const byB9 = Object.fromEntries(screens.map((s) => [s.b9Key, s]));
const interactions = B9.interactions.filter((i) => byB9[i.sourceKey] && byB9[i.targetKey]).map((i) => ({
  ...i,
  sourceKey: byB9[i.sourceKey].key,
  targetKey: byB9[i.targetKey].key,
  signature: hash("current|" + i.signature),
}));

const groups = [];
let groupY = 0;
for (const module of moduleOrder) {
  const members = screens.filter((s) => s.module === module);
  if (!members.length) continue;
  let maxBottom = 256;
  const placements = [];
  members.forEach((screen, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const priorRows = members.slice(0, row * 4);
    const priorHeight = row === 0 ? 0 : Array.from({ length: row }, (_, r) => Math.max(...priorRows.slice(r * 4, r * 4 + 4).map((s) => s.desktopHeight))).reduce((a, b) => a + b + 240, 0);
    const x = 160 + col * 2070;
    const y = 256 + priorHeight;
    const h = screen.desktopHeight;
    placements.push({ key: screen.key, x, y, width: 1440, height: h, mobileX: screen.viewports.includes(390) ? x + 1520 : null, mobileWidth: screen.viewports.includes(390) ? 390 : 0 });
    maxBottom = Math.max(maxBottom, y + h);
  });
  const width = 160 + Math.min(4, members.length) * 1910 + Math.max(0, Math.min(4, members.length) - 1) * 160 + 160;
  const height = maxBottom + 160;
  const signature = hash(JSON.stringify([module, members.map((s) => s.signature), placements, width, height]));
  groups.push({ key: "group:" + module, name: "ABox/CurrentAppGroup/" + moduleLabels[module], title: moduleLabels[module], module, x: 0, y: groupY, width, height, placements, screenKeys: members.map((s) => s.key), signature });
  groupY += height + 640;
}

// Rectangle intersection proof within every module group.
for (const group of groups) for (let a = 0; a < group.placements.length; a += 1) for (let b = a + 1; b < group.placements.length; b += 1) {
  const x = group.placements[a], y = group.placements[b];
  if (x.x < y.x + y.width + y.mobileWidth + (y.mobileWidth ? 80 : 0) && x.x + x.width + x.mobileWidth + (x.mobileWidth ? 80 : 0) > y.x && x.y < y.y + y.height && x.y + x.height > y.y) throw new Error("STOP: placement collision in " + group.name);
}

const classified = {
  A: interactions,
  B: B9.interactionClassification.B.map((i) => ({ ...i, sourceKey: byB9[i.sourceKey] ? byB9[i.sourceKey].key : i.sourceKey })),
  C: B9.interactionClassification.C.map((i) => ({ ...i, sourceKey: byB9[i.sourceKey] ? byB9[i.sourceKey].key : i.sourceKey })),
  D: B9.interactionClassification.D.map((i) => ({ ...i, sourceKey: byB9[i.sourceKey] ? byB9[i.sourceKey].key : i.sourceKey })),
};
const expectedInstances = screens.reduce((count, screen) => count + (screen.shell && screen.shell.name ? 1 : 0) + screen.patterns.length + screen.components.length + (screen.viewports.includes(390) && screen.shell && screen.shell.name ? 1 : 0), 0);
const expectedStyleBindings = screens.reduce((count, screen) => count + 2 + screen.sections.length * 2 + (screen.viewports.includes(390) ? 2 + screen.sections.length * 2 : 0), 0) + groups.length * 2;
const manifest = {
  meta: { phase: "Phase 59 — Current Application Fidelity Import", page: "07 Current App", generatedBy: "tools/figma-plugin/extract-current-app.mjs", protects: ["B0","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10"], model: "additive native editable fidelity import; no permanent sync" },
  counts: { routeDeclarations: routeInventory.length, groups: groups.length, screens: screens.length, desktopFrames: screens.length, mobileCompanions: screens.filter((s) => s.viewports.includes(390)).length, nativeInstances: expectedInstances, minimumStyleBindings: expectedStyleBindings, reactions: interactions.length, categoryB: classified.B.length, categoryC: classified.C.length, categoryD: classified.D.length, classifiedInteractions: interactions.length + classified.B.length + classified.C.length + classified.D.length, b1Collections: 9, b1Variables: 200, b2Variables: 19, b3Styles: 79, b4Sets: 11, b4Standalone: 3, b5Variants: 56, b5Physical: 59, b6TopLevel: 3, b6PhysicalNodes: 4, b7TopLevel: 3, b7PhysicalNodes: 4, b8TopLevelFrames: 5, b9TopLevelFrames: 179, b9Reactions: 682, b10DocumentationFrames: 10, newVariables: 0, newStyles: 0, newComponents: 0, newComponentSets: 0, newPatterns: 0, newShells: 0 },
  arithmetic: B9.arithmetic,
  routeInventory,
  layout: { page: "07 Current App", desktopWidth: 1440, desktopMinHeight: 1024, mobileWidth: 390, headingHeight: 96, groupPadding: 160, familyGap: 80, columnGap: 160, rowGap: 240, groupGap: 640, columns: 4 },
  groups, screens, interactions, interactionClassification: classified,
  limitations: ["Native editable reconstruction only; no screenshots, image fills, HTML embeds or flattened imports.", "Static source analysis preserves visible literals and source hierarchy evidence but does not execute recursive React rendering.", "Responsive breakpoint detection marks candidates; it does not claim runtime-measured hierarchy equivalence.", "Unsupported production values remain literal editable properties with source metadata; equality is not treated as token evidence.", "Runtime authentication, data, pricing, subsidy, persistence, validation and generated values are metadata only.", "Dynamic, external and ambiguous destinations remain Category C/D metadata and receive no reaction.", "Route-local compositions do not become new Figma foundations.", "REAL FIGMA NOT VERIFIED until create, verify, recreate and verify run in Figma Desktop."],
};
if (screens.length !== 179) throw new Error("STOP: expected 179 current-app screen identities, found " + screens.length);
if (interactions.length !== 682) throw new Error("STOP: expected 682 deterministic interactions, found " + interactions.length);
if (classified.B.length !== 135 || classified.C.length !== 102 || classified.D.length !== 3) throw new Error("STOP: interaction classification baseline drifted.");
const out = "// GENERATED by tools/figma-plugin/extract-current-app.mjs — do not hand-edit.\nvar ABOX_CURRENT_APP = " + JSON.stringify(manifest, null, 2) + ";\n";
writeFileSync(join(here, "tokens-current-app.js"), out);
console.log("wrote tools/figma-plugin/tokens-current-app.js (" + out.length + " bytes, " + groups.length + " groups, " + screens.length + " screens, " + interactions.length + " reactions)");
