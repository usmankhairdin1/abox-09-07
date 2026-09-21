#!/usr/bin/env node
// Phase 56 / Batch B9 — Complete Screens / Bulk Application Import extractor.
// Reads production source and generated B1-B8 tokens, then emits tokens-b9.js.
// Run from the repository root: node tools/figma-plugin/extract-b9.mjs
// Never hand-edit tokens-b9.js; never edit code.js directly.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const evalToken = (file, name) => eval(readFileSync(join(here, file), "utf8") + ";" + name);

const ABOX_B4 = evalToken("tokens-b4.js", "ABOX_B4");
const ABOX_B5 = evalToken("tokens-b5.js", "ABOX_B5");
const ABOX_B6 = evalToken("tokens-b6.js", "ABOX_B6");
const ABOX_B7 = evalToken("tokens-b7.js", "ABOX_B7");
const ABOX_B8 = evalToken("tokens-b8.js", "ABOX_B8");

const requiredComponents = [
  "ABox/Header/PageHeader",
  "ABox/Action/ActionPill",
  "ABox/Status/StatusBadge",
  "ABox/Card/KpiCard",
  "ABox/Feedback/EmptyState",
  "ABox/Form/LabeledField",
  "ABox/Form/Input",
  "ABox/Nav/ModuleTab",
  "ABox/Nav/WizardStep",
];
const hasB4 = (name) => ABOX_B4.sets.some((set) => set.name === name) || ABOX_B4.components.some((component) => component.name === name);
for (const name of requiredComponents) {
  if (!hasB4(name)) throw new Error("STOP: missing B4/B5 component token " + name);
}
for (const name of ["ABox/Pattern/KpiRow", "ABox/Pattern/ModuleTabBar", "ABox/Pattern/WizardStepper"]) {
  if (!ABOX_B6.patterns.some((pattern) => pattern.name === name)) throw new Error("STOP: missing B6 pattern token " + name);
}
for (const name of ["ABox/Shell/Internal", "ABox/Shell/Marketplace", "ABox/Shell/Member"]) {
  if (!ABOX_B7.shells.some((shell) => shell.name === name)) throw new Error("STOP: missing B7 shell token " + name);
}
if (ABOX_B8.experiences.length !== 5) throw new Error("STOP: missing B8 experience token baseline.");

const lineOf = (file, needle) => {
  const lines = read(file).split("\n");
  const index = lines.findIndex((line) => line.includes(needle));
  if (index === -1) throw new Error("STOP: not found in " + file + " — " + needle);
  return file + ":" + (index + 1);
};
const mustContain = (file, fragments) => {
  const text = read(file);
  for (const fragment of fragments) {
    if (!text.includes(fragment)) throw new Error("B9 extraction guard failed: " + file + " does not contain " + JSON.stringify(fragment));
  }
};

for (const [file, fragments] of [
  ["src/lib/screens.ts", ["UX-001", "SCR-M04-036", "SCR-M05-030", "SCR_JET_PRODUCTS"]],
  ["src/components/m06/registry.tsx", ["M06_SCREENS", "SCR-M06-001", "SCR-M06-035"]],
  ["src/lib/governed/m06.index.ts", ["\"screens\"", "SCR-M06-001", "SCR-M06-035"]],
  ["src/lib/m08/registry.ts", ["SCR-M08-001", "SCR-M08-010", "flow_defined_by_source"]],
  ["src/lib/m08/strings.ts", ["screen.001", "screen.010"]],
  ["src/components/m08/selling-setup.tsx", ["M08_SCREENS.map", "setTab", "returnTo"]],
  ["src/routes/quote.tsx", ["STEP_COUNT", "WizardStepper", "See my plans", "Quote wizard progress"]],
  ["src/routes/plans.index.tsx", ["drawerOpen", "Compare", "QuoteEditPanel", "FilterRail"]],
  ["src/components/abox/internal-shell.tsx", ["InternalShell", "PlanOAssistant", "pageTitle"]],
  ["src/components/abox/marketplace-shell.tsx", ["MarketplaceShell", "ProductSwitcher", "showAssistant"]],
  ["src/components/abox/member-shell.tsx", ["MemberShell", "MEMBER_NAV"]],
]) mustContain(file, fragments);

const slug = (value) => String(value || "screen")
  .replace(/\$/g, "param-")
  .replace(/[^A-Za-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .replace(/--+/g, "-") || "screen";
const routeKey = (value) => {
  if (!value) return "/";
  const noQuery = value.split("?")[0];
  if (noQuery === "/") return "/";
  return noQuery.replace(/\/$/, "");
};
const unique = (items) => [...new Set(items.filter(Boolean))];
const workspaceLabel = (workspace) => ({
  marketplace: "Marketplace",
  member: "Member",
  agent: "Agent",
  agency: "Agency",
  jet: "JET",
  carrier: "Carrier",
  employer: "Employer",
  partner: "Partner",
  system: "System",
  public: "Public",
  m06: "M06",
  m08: "M08",
}[workspace] || "Route");

function parseScreensRegistry() {
  const text = read("src/lib/screens.ts");
  const map = {};
  const re = /["']([^"']+)["']:\s*\{\s*id:\s*["']([^"']+)["'],\s*name:\s*["']([^"']+)["'],\s*workspace:\s*["']([^"']+)["'],\s*phase:\s*["']([^"']+)["'],\s*purpose:\s*["']([^"']+)["']\s*\}/gms;
  let m;
  while ((m = re.exec(text))) {
    map[m[1]] = { id: m[2], name: m[3], workspace: m[4], phase: m[5], purpose: m[6] };
  }
  return map;
}

function parseM06() {
  const indexText = read("src/lib/governed/m06.index.ts");
  const registryText = read("src/components/m06/registry.tsx");
  const componentById = {};
  const componentRe = /["'](SCR-M06-\d+)["']:\s*(?:\(props\)\s*=>\s*<)?([A-Za-z0-9_]+)/g;
  let cm;
  while ((cm = componentRe.exec(registryText))) componentById[cm[1]] = cm[2];

  const screens = [];
  const re = /\{\s*"id":\s*"(SCR-M06-\d+)"[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"workspace":\s*"([^"]+)"[\s\S]*?"route":\s*"([^"]+)"[\s\S]*?"purpose":\s*"([^"]+)"[\s\S]*?"states":\s*\[([\s\S]*?)\][\s\S]*?"responsive":\s*"([^"]+)"[\s\S]*?"capability":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(indexText))) {
    const states = unique([...m[6].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
    screens.push({
      id: m[1],
      name: m[2],
      workspace: "m06",
      governedWorkspace: m[3],
      route: m[4],
      purpose: m[5],
      states,
      responsive: m[7],
      capability: m[8],
      component: componentById[m[1]] || "registered-screen",
    });
  }
  if (screens.length !== 35) throw new Error("STOP: expected 35 M06 screens, found " + screens.length);
  return screens;
}

function parseM08() {
  const registryText = read("src/lib/m08/registry.ts");
  const stringsText = read("src/lib/m08/strings.ts");
  const nameByKey = {};
  const strRe = /["'](screen\.\d+)["']:\s*\{\s*en:\s*["']([^"']+)["']/g;
  let sm;
  while ((sm = strRe.exec(stringsText))) nameByKey[sm[1]] = sm[2];
  const screens = [];
  const re = /\{\s*id:\s*"(SCR-M08-\d+)"[\s\S]*?key:\s*"([^"]+)"[\s\S]*?name_key:\s*"([^"]+)"[\s\S]*?route:\s*"([^"]+)"[\s\S]*?audience:\s*\[([\s\S]*?)\][\s\S]*?permission:\s*"([^"]+)"[\s\S]*?capability:\s*"([^"]+)"[\s\S]*?flows:\s*\[([\s\S]*?)\][\s\S]*?flow_defined_by_source:\s*(true|false)/g;
  let m;
  while ((m = re.exec(registryText))) {
    screens.push({
      id: m[1],
      key: m[2],
      name: nameByKey[m[3]] || m[2],
      workspace: "m08",
      route: m[4],
      purpose: "Governed M08 selling setup surface for " + (nameByKey[m[3]] || m[2]) + ".",
      audience: [...m[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      permission: m[6],
      capability: m[7],
      flows: [...m[8].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      flowDefinedBySource: m[9] === "true",
      states: ["ready", "denied"],
    });
  }
  if (screens.length !== 10) throw new Error("STOP: expected 10 M08 screens, found " + screens.length);
  return screens;
}

function routeShell(file, text) {
  if (text.includes("MarketplaceShell")) return { family: "Marketplace", name: "ABox/Shell/Marketplace", overrides: { variant: file === "index.tsx" ? "landing" : "flow", showProducts: !["index.tsx", "auth.tsx", "terms.tsx", "privacy.tsx", "faq.tsx"].includes(file), showAssistant: true, product: "ifp" } };
  if (text.includes("MemberShell")) return { family: "Member", name: "ABox/Shell/Member", overrides: {} };
  if (text.includes("InternalShell") || text.includes("EmployerFrame") || text.includes("JetFrame")) return { family: "Internal", name: "ABox/Shell/Internal", overrides: { pageTitle: "Route screen", eyebrow: "ABox", entity: "Cedar Grove Insurance" } };
  return { family: "Standalone", name: null, overrides: {} };
}

function titleCaseFromPath(path) {
  if (path === "/") return "Marketplace Landing";
  const tail = path.split("/").filter(Boolean).pop() || "screen";
  return tail.replace(/^\$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}

function routeSourceId(text) {
  const found = [];
  const re = /SCREENS(?:\[["']([^"']+)["']\]|\.([A-Za-z0-9_]+))/g;
  let m;
  while ((m = re.exec(text))) found.push(m[1] || m[2]);
  return unique(found)[0] || null;
}

function routeComponents(text) {
  const out = ["ABox/Header/PageHeader"];
  if (text.includes("StatusBadge") || text.includes("StatusChip") || text.includes("Tag")) out.push("ABox/Status/StatusBadge");
  if (text.includes("KpiCard") || text.includes("StatCard") || text.includes("Counter")) out.push("ABox/Card/KpiCard");
  if (text.includes("EmptyState") || text.includes("EmptyRows") || text.includes("empty=")) out.push("ABox/Feedback/EmptyState");
  if (text.includes("Input") || text.includes("<input") || text.includes("Field")) out.push("ABox/Form/Input");
  if (text.includes("Button") || text.includes("<button") || text.includes("Btn")) out.push("ABox/Action/ActionPill");
  return unique(out).filter(hasB4);
}

function routePatterns(text) {
  const out = [];
  if (text.includes("KpiCard") || text.includes("StatCard") || /grid gap-3 sm:grid-cols-[34]/.test(text)) out.push({ name: "ABox/Pattern/KpiRow", variant: { columns: text.includes("grid-cols-4") || text.includes("sm:grid-cols-4") || text.includes("lg:grid-cols-4") ? "4" : "3" } });
  if (text.includes("ModuleTabs")) out.push({ name: "ABox/Pattern/ModuleTabBar", variant: null });
  if (text.includes("DownlineWizardStepper") || text.includes("WizardStepper")) out.push({ name: "ABox/Pattern/WizardStepper", variant: null });
  return out;
}

function evidenceSignals(text) {
  const signals = [];
  if (text.includes("Dialog")) signals.push("dialog");
  if (text.includes("Drawer") || text.includes("Sheet")) signals.push("drawer-sheet");
  if (text.includes("Tabs") || text.includes("ModuleTabs") || text.includes("setTab")) signals.push("tabs");
  if (text.includes("DataTable") || text.includes("Table")) signals.push("table");
  if (text.includes("EmptyState") || text.includes("EmptyRows") || text.includes("empty=")) signals.push("empty");
  if (text.includes("animate-") || text.includes("transition-")) signals.push("motion-css");
  if (text.includes("grid") || text.includes("md:") || text.includes("lg:") || text.includes("sm:")) signals.push("responsive");
  if (text.includes("onSubmit") || text.includes("schema.safeParse") || text.includes("errors")) signals.push("validation");
  return unique(signals);
}

const SCREENS = parseScreensRegistry();
const routeFiles = readdirSync(join(root, "src/routes")).filter((f) => f.endsWith(".tsx") && f !== "__root.tsx").sort();
const routeRecords = [];
const excluded = [];
for (const file of routeFiles) {
  const source = "src/routes/" + file;
  const text = read(source);
  const match = text.match(/createFileRoute\((['"])(.*?)\1\)/);
  if (!match) continue;
  const route = match[2];
  const redirectOnly = text.includes("redirect(") || text.includes("throw redirect");
  const layoutOnly = ["agency.tsx", "app.tsx", "marketplace.tsx", "member.tsx", "platform.tsx"].includes(file);
  const designOnly = route === "/design-guide" || route === "/design-system";
  const workforceHost = text.includes("WorkforcePage");
  const quoteHost = routeKey(route) === "/quote";
  const agentProfileHost = routeKey(route) === "/app/agent-profile";
  if (redirectOnly || layoutOnly || designOnly || workforceHost || quoteHost || agentProfileHost) {
    excluded.push({ route, source, reason: redirectOnly ? "redirect-only" : layoutOnly ? "layout-only" : designOnly ? "internal-design-reference" : workforceHost ? "replaced-by-governed-M06-or-M08-screen-registry" : quoteHost ? "replaced-by-six-UX-003-through-UX-008-state-frames" : "replaced-by-M06-agent-workspace-plus-M08-selling-setup-registry" });
    continue;
  }
  const id = routeSourceId(text);
  const meta = id && SCREENS[id] ? SCREENS[id] : null;
  const sh = routeShell(file, text);
  const title = meta ? meta.name : titleCaseFromPath(route);
  const workspace = meta ? meta.workspace : (sh.family === "Marketplace" ? "marketplace" : sh.family === "Member" ? "member" : sh.family === "Internal" ? "agency" : "public");
  const key = "route:" + routeKey(route);
  routeRecords.push({
    key,
    name: "ABox/Screen/" + workspaceLabel(workspace) + "/" + (id || "ROUTE") + "/" + slug(route),
    kind: "screen",
    sourceType: "route",
    route,
    sourceFile: source,
    id,
    title,
    workspace,
    purpose: meta ? meta.purpose : "Source-backed route composition for " + route + ".",
    shell: sh,
    patterns: routePatterns(text),
    components: routeComponents(text),
    states: evidenceSignals(text),
    responsive: text.includes("md:") || text.includes("lg:") || text.includes("sm:") ? "responsive classes present in route source" : "canonical desktop frame; no route-specific breakpoint evidence",
    sources: [source + ":" + (text.substring(0, match.index).split("\n").length + 1)],
  });
}

const quoteSteps = [
  ["UX-003", "ZIP & Effective Date", "zip-effective", "Step 1", "src/routes/quote.tsx"],
  ["UX-004", "Household Members", "household", "Step 2", "src/routes/quote.tsx"],
  ["UX-005", "PlanAI Goals & Usage", "goals-usage", "Step 3", "src/routes/quote.tsx"],
  ["UX-006", "Provider & Drug Optional Lookup", "providers-drugs", "Step 4", "src/routes/quote.tsx"],
  ["UX-007", "Optional Subsidy Check", "subsidy-check", "Step 5", "src/routes/quote.tsx"],
  ["UX-008", "Subsidy Estimate & Education", "subsidy-estimate", "Step 6", "src/routes/quote.tsx"],
];
const quoteRecords = quoteSteps.map(([id, label, keyPart, stepLabel, sourceFile], index) => {
  const meta = SCREENS[id];
  return {
    key: "quote:" + (index + 1),
    name: "ABox/Screen/Marketplace/" + id + "-" + slug(meta.name),
    kind: "screen",
    sourceType: "quote-step",
    route: "/quote?step=" + (index + 1),
    sourceFile,
    id,
    title: meta.name,
    workspace: "marketplace",
    purpose: meta.purpose,
    shell: { family: "Marketplace", name: "ABox/Shell/Marketplace", overrides: { variant: "flow", showProducts: true, showAssistant: true, product: "ifp" } },
    patterns: [{ name: "ABox/Pattern/WizardStepper", variant: null }],
    components: ["ABox/Header/PageHeader", "ABox/Form/LabeledField", "ABox/Form/Input", "ABox/Action/ActionPill", "ABox/Status/StatusBadge"],
    states: ["ready", "validation", "saved-progress"],
    responsive: "Marketplace wizard route uses canonical desktop plus md breakpoints and horizontal overflow stepper.",
    sources: [lineOf(sourceFile, stepLabel), lineOf(sourceFile, "WizardStepper"), lineOf(sourceFile, "WizardFooter")],
  };
});

const m06Screens = parseM06().map((s) => ({
  key: "m06:" + s.id,
  name: "ABox/Screen/M06/" + s.id + "-" + slug(s.name),
  kind: "screen",
  sourceType: "m06-governed-screen",
  route: s.route,
  sourceFile: "src/lib/governed/m06.index.ts",
  id: s.id,
  title: s.name,
  workspace: "m06",
  purpose: s.purpose,
  shell: { family: "Internal", name: "ABox/Shell/Internal", overrides: { pageTitle: s.name, eyebrow: "M06 · " + s.governedWorkspace, entity: "Cedar Grove Insurance" } },
  patterns: [{ name: "ABox/Pattern/ModuleTabBar", variant: null }],
  components: ["ABox/Header/PageHeader", "ABox/Status/StatusBadge", "ABox/Card/KpiCard", "ABox/Feedback/EmptyState", "ABox/Action/ActionPill"],
  states: s.states,
  responsive: s.responsive,
  sources: ["src/lib/governed/m06.index.ts", "src/components/m06/registry.tsx", "src/components/m06/workforce-page.tsx", s.component],
  capability: s.capability,
}));

const m08Screens = parseM08().map((s) => ({
  key: "m08:" + s.id,
  name: "ABox/Screen/M08/" + s.id + "-" + slug(s.name),
  kind: "screen",
  sourceType: "m08-governed-screen",
  route: s.route,
  sourceFile: "src/lib/m08/registry.ts",
  id: s.id,
  title: s.name,
  workspace: "m08",
  purpose: s.purpose,
  shell: { family: "Internal", name: "ABox/Shell/Internal", overrides: { pageTitle: "Selling setup", eyebrow: "M08 · Licensing", entity: "Cedar Grove Insurance" } },
  patterns: [{ name: "ABox/Pattern/ModuleTabBar", variant: null }],
  components: ["ABox/Header/PageHeader", "ABox/Status/StatusBadge", "ABox/Card/KpiCard", "ABox/Feedback/EmptyState", "ABox/Action/ActionPill"],
  states: s.states,
  responsive: "M08 host uses flex-wrap tabs, grid counters and governed table/detail/empty/denied states.",
  sources: ["src/lib/m08/registry.ts", "src/components/m08/selling-setup.tsx", "src/components/m08/screens.tsx", s.route],
  capability: s.capability,
  flows: s.flows,
}));

const screens = [...routeRecords, ...quoteRecords, ...m06Screens, ...m08Screens]
  .sort((a, b) => a.name.localeCompare(b.name));
const byKey = Object.fromEntries(screens.map((s) => [s.key, s]));
const byRoute = {};
for (const s of screens) {
  if (s.route) byRoute[routeKey(s.route)] = s;
  if (s.route && s.route.endsWith("/")) byRoute[routeKey(s.route) + "/"] = s;
}
byRoute["/quote"] = quoteRecords[0];
for (let i = 0; i < quoteRecords.length; i++) byRoute["/quote?step=" + (i + 1)] = quoteRecords[i];

const interactions = [];
const addInteraction = (row) => {
  if (!row.sourceKey || !row.targetKey || !byKey[row.sourceKey] || !byKey[row.targetKey]) return;
  const id = slug([row.sourceKey, row.control || row.targetKey, row.targetKey].join("--"));
  if (interactions.some((i) => i.id === id)) return;
  const signature = [row.sourceKey, row.targetKey, row.trigger || "click", row.action || "navigate", row.transition || "instant", row.stateTarget || "root", row.source || "source"].join("|");
  interactions.push({
    id,
    category: "A",
    sourceKey: row.sourceKey,
    targetKey: row.targetKey,
    control: row.control || "Open target",
    trigger: row.trigger || "click",
    action: row.action || "navigate",
    navigation: row.navigation || "NAVIGATE",
    transition: row.transition || "instant",
    source: row.source || byKey[row.sourceKey].sourceFile,
    targetIdentity: byKey[row.targetKey].name,
    signature,
  });
};

// Deterministic static route links and hrefs from route source.
for (const s of screens) {
  if (!s.sourceFile || !s.sourceFile.startsWith("src/routes/")) continue;
  const text = read(s.sourceFile);
  const re = /(?:to|href)=\{?["']([^"'}`]+)["']\}?/g;
  let m;
  while ((m = re.exec(text))) {
    const raw = m[1];
    if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("${")) continue;
    const target = byRoute[raw] || byRoute[routeKey(raw)];
    if (!target || target.key === s.key) continue;
    addInteraction({ sourceKey: s.key, targetKey: target.key, control: "source link " + raw, source: s.sourceFile + ":route-link" });
  }
}

// Source-backed quote wizard next/back/finish path.
for (let i = 0; i < quoteRecords.length; i += 1) {
  if (i > 0) addInteraction({ sourceKey: quoteRecords[i].key, targetKey: quoteRecords[i - 1].key, control: "Back", source: lineOf("src/routes/quote.tsx", "goBack") });
  if (i < quoteRecords.length - 1) addInteraction({ sourceKey: quoteRecords[i].key, targetKey: quoteRecords[i + 1].key, control: "Continue", source: lineOf("src/routes/quote.tsx", "Continue") });
}
const plans = screens.find((s) => routeKey(s.route) === "/plans");
if (plans) addInteraction({ sourceKey: quoteRecords[5].key, targetKey: plans.key, control: "See my plans", source: lineOf("src/routes/quote.tsx", "See my plans") });

// M08 tab navigation is explicitly source-backed by M08_SCREENS.map + setTab.
for (const src of m08Screens) {
  for (const dst of m08Screens) {
    if (src.key !== dst.key) addInteraction({ sourceKey: src.key, targetKey: dst.key, control: "M08 tab: " + dst.title, source: lineOf("src/components/m08/selling-setup.tsx", "setTab(s.key)") });
  }
}

// M06 workspace tab targets: each tab maps to the first governed screen hosted by the route.
const workforceTargetByRoute = {
  "/agency/workforce": "SCR-M06-001",
  "/agency/workforce/roster": "SCR-M06-002",
  "/agency/workforce/person": "SCR-M06-003",
  "/agency/workforce/onboarding": "SCR-M06-005",
  "/agency/workforce/structure": "SCR-M06-015",
  "/agency/workforce/access": "SCR-M06-008",
  "/agency/workforce/lifecycle": "SCR-M06-019",
  "/agency/workforce/readiness": "SCR-M06-023",
  "/agency/workforce/selling-setup": "SCR-M08-001",
  "/agency/workforce/work": "SCR-M06-022",
  "/agency/workforce/data": "SCR-M06-027",
  "/agency/workforce/settings": "SCR-M06-004",
};
for (const src of m06Screens) {
  for (const [route, id] of Object.entries(workforceTargetByRoute)) {
    const dst = screens.find((s) => s.id === id);
    if (dst && dst.key !== src.key) addInteraction({ sourceKey: src.key, targetKey: dst.key, control: "Workforce tab: " + route.split("/").pop(), source: lineOf("src/components/m06/workforce-page.tsx", "WORKFORCE_TABS") });
  }
}

const categoryB = [];
const categoryC = [];
const categoryD = [];
for (const s of screens) {
  const text = s.sourceFile && s.sourceFile.startsWith("src/routes/") ? read(s.sourceFile) : "";
  if (text.includes("hover:") || text.includes("focus:") || text.includes("disabled:") || text.includes("aria-current") || s.sourceType.includes("governed")) {
    categoryB.push({ sourceKey: s.key, control: "component interaction states", representedBy: "existing B4/B5 hover/focus/pressed/active/selected/expanded/disabled variants or state metadata", source: s.sourceFile });
  }
  if (/onSubmit|safeParse|dispatch\(|setState|sessionStorage|localStorage|auth|pricing|subsidy|estimateMonthlyAPTC|toast\./.test(text) || s.sourceType.includes("governed")) {
    categoryC.push({ sourceKey: s.key, control: "runtime governed logic", reason: "Requires React state, validation, browser storage, authentication, data store, pricing/subsidy calculation or governed permissions.", source: s.sourceFile });
  }
  if (/href=\{?`|to=\{?`|window\.location|target="_blank"|https?:\/\//.test(text)) {
    categoryD.push({ sourceKey: s.key, control: "dynamic/external destination", reason: "Unsupported or ambiguous destination is recorded only and not invented.", source: s.sourceFile });
  }
}

const motion = [];
for (const s of screens) {
  const text = s.sourceFile && s.sourceFile.startsWith("src/routes/") ? read(s.sourceFile) : "";
  if (text.includes("transition-")) motion.push({ sourceKey: s.key, source: s.sourceFile, sourceMotion: "transition-* class", figmaMapping: "not mapped to Smart Animate; component-state metadata unless paired with a deterministic Category A target" });
  if (text.includes("animate-")) motion.push({ sourceKey: s.key, source: s.sourceFile, sourceMotion: "animate-* class", figmaMapping: "metadata only; CSS animation is not faithfully recreated as a prototype transition" });
}

const duplicateNames = screens.map((s) => s.name).filter((name, i, all) => all.indexOf(name) !== i);
if (duplicateNames.length) throw new Error("STOP: duplicate B9 screen names " + duplicateNames.join(", "));

const stateFrames = [
  { key: "state:plans:filters", sourceKey: plans ? plans.key : "", title: "Plan Results — Filters open", route: "/plans#filters", source: lineOf("src/routes/plans.index.tsx", "setDrawerOpen(true)"), control: "Filters" },
  { key: "state:plans:edit-quote", sourceKey: plans ? plans.key : "", title: "Plan Results — Edit quote open", route: "/plans#edit-quote", source: lineOf("src/routes/plans.index.tsx", "setEditOpen((v) => !v)") , control: "Edit quote"},
].filter((s) => s.sourceKey);
for (const st of stateFrames) {
  const base = byKey[st.sourceKey];
  const record = {
    key: st.key,
    name: "ABox/ScreenState/Marketplace/" + slug(st.title),
    kind: "state",
    sourceType: "visual-state",
    route: st.route,
    sourceFile: base.sourceFile,
    id: base.id,
    title: st.title,
    workspace: base.workspace,
    purpose: "Source-backed visual state for " + base.title + ".",
    shell: base.shell,
    patterns: base.patterns,
    components: base.components,
    states: ["overlay-open"],
    responsive: base.responsive,
    sources: [st.source],
  };
  screens.push(record);
  byKey[record.key] = record;
  addInteraction({ sourceKey: st.sourceKey, targetKey: st.key, control: st.control, source: st.source, navigation: "OVERLAY", transition: "instant-overlay" });
}

const placement = screens.map((s, i) => ({ name: s.name, x: (i % 6) * 1560, y: Math.floor(i / 6) * 1200 }));

const ABOX_B9 = {
  meta: {
    batch: "Phase 56 / Batch B9 — complete screens / bulk application import",
    page: "05 Screens",
    generatedBy: "tools/figma-plugin/extract-b9.mjs",
    protects: ["B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"],
    operation: "Create All Screens",
    verifyOperation: "Verify All Screens",
    model: "one-bulk-import; standalone editable design/prototype artifact; no permanent sync",
  },
  counts: {
    routeTsxFiles: routeFiles.length,
    routeDeclarations: routeFiles.filter((f) => /createFileRoute\((['"])(.*?)\1\)/.test(read("src/routes/" + f))).length,
    rootLayouts: 1,
    contentRouteFilesAudited: 142,
    excluded: excluded.length,
    ordinaryRouteFrames: routeRecords.length,
    quoteStepFrames: quoteRecords.length,
    m06Screens: m06Screens.length,
    m08Screens: m08Screens.length,
    stateFrames: stateFrames.length,
    topLevelFrames: screens.length,
    categoryAPrototypeReactions: interactions.length,
    categoryBStateMappings: categoryB.length,
    categoryCRuntimeMappings: categoryC.length,
    categoryDUnsupportedMappings: categoryD.length,
    classifiedInteractions: interactions.length + categoryB.length + categoryC.length + categoryD.length,
    b1Collections: 9,
    b1Variables: 200,
    b2Variables: 19,
    b3Styles: 79,
    b4Sets: 11,
    b4Standalone: 3,
    b5Variants: 56,
    b5Physical: 59,
    b5NonVariant: 19,
    b6TopLevel: 3,
    b6PhysicalNodes: 4,
    b7TopLevel: 3,
    b7PhysicalNodes: 4,
    b8TopLevelFrames: 5,
    newVariables: 0,
    newStyles: 0,
    newComponents: 0,
    newComponentSets: 0,
    newPatterns: 0,
    newProperties: 0,
  },
  arithmetic: {
    formula: "142 content route files - 2 internal design references - 12 workforce host routes - 1 quote host route - 1 app agent-profile host route + 35 M06 registered screens + 10 M08 registered screens + 6 quote UX state frames + 2 source-backed visual-state frames = " + screens.length,
    sourceCounts: {
      contentRouteFiles: 142,
      excludedInternalDesignRoutes: 2,
      excludedWorkforceHosts: 12,
      excludedQuoteHost: 1,
      excludedAgentProfileHost: 1,
      governedM06Screens: 35,
      governedM08Screens: 10,
      quoteUxStateFrames: 6,
      sourceBackedVisualStateFrames: 2,
    },
  },
  page: "05 Screens",
  layout: { frameWidth: 1440, frameXGap: 1560, frameYGap: 1200, startX: 0, startY: 0, columns: 6 },
  screens,
  placement,
  interactions,
  interactionClassification: { A: interactions, B: categoryB, C: categoryC, D: categoryD },
  motionAudit: motion,
  exclusions: excluded,
  limitations: [
    "REAL FIGMA NOT VERIFIED until Create All Screens and Verify All Screens run inside Figma Desktop; offline checks are not native write/read evidence.",
    "B9 creates native editable screen and visual-state frames only on 05 Screens; it creates no variables, styles, components, component sets, patterns or component properties.",
    "B9 represents design and prototype paths; it does not execute React, JavaScript, authentication, database, pricing, subsidy, file upload or governed business logic inside Figma.",
    "Runtime/business-logic-dependent interactions are classified and reported; only deterministic source-backed visual destinations receive prototype reactions.",
    "Hover, focus, pressed, active, selected, expanded and disabled states prefer existing B4/B5 component states or metadata; whole-screen duplicates are not created for component-state behaviour.",
    "CSS animations and transitions are not converted into invented Smart Animate relationships; only supported, explicit prototype mappings are written.",
    "Dynamic route parameters remain source metadata and are not expanded into fake records.",
    "Figma remains a standalone imported design/prototype artifact; no permanent Lovable-to-Figma sync and no manual per-screen import are implemented.",
  ],
};

if (ABOX_B9.screens.length !== ABOX_B9.counts.topLevelFrames) throw new Error("STOP: B9 top-level frame count mismatch.");
if (ABOX_B9.interactions.length !== ABOX_B9.counts.categoryAPrototypeReactions) throw new Error("STOP: B9 interaction count mismatch.");
for (const interaction of ABOX_B9.interactions) {
  if (!byKey[interaction.sourceKey]) throw new Error("STOP: missing B9 interaction source " + interaction.sourceKey);
  if (!byKey[interaction.targetKey]) throw new Error("STOP: missing B9 interaction target " + interaction.targetKey);
}
for (const s of ABOX_B9.screens) {
  s.signature = [
    s.name,
    s.kind,
    s.sourceType,
    s.route,
    s.id || "no-id",
    "shell=" + (s.shell.name || "none"),
    "components=" + s.components.join(","),
    "patterns=" + s.patterns.map((p) => p.name + (p.variant ? JSON.stringify(p.variant) : "")).join(","),
    "states=" + s.states.join(","),
    "sources=" + s.sources.slice().sort().join(","),
  ].join("|");
}

const out = "// GENERATED by tools/figma-plugin/extract-b9.mjs — do not hand-edit.\nvar ABOX_B9 = " +
  JSON.stringify(ABOX_B9, null, 2) + ";\n";
writeFileSync(join(root, "tools/figma-plugin/tokens-b9.js"), out);
console.log("wrote tools/figma-plugin/tokens-b9.js (" + out.length + " bytes, " + screens.length + " frames, " + interactions.length + " prototype reactions)");
