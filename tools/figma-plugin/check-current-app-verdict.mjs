// Regression harness for the Phase 59 00 Foundations debris classification.
// Extracts currentAppFoundationsVerdict + currentAppOwnedVerdict from plugin.js and runs
// them against stubbed nodes, proving that a genuine Phase 59 module group is classified as
// debris even though it contains B4-B7 instances, while anything failing the full ownership
// predicate stays UNIDENTIFIED and inspection never mutates a node.
// Run: node tools/figma-plugin/check-current-app-verdict.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, "plugin.js"), "utf8");
const ast = acorn.parse(source, { ecmaVersion: 2022, sourceType: "script", ranges: true });

const slice = (name, kinds) => {
  const node = ast.body.find((n) => {
    if (kinds.indexOf(n.type) === -1) return false;
    if (n.type === "FunctionDeclaration") return n.id && n.id.name === name;
    return (n.declarations || []).some((d) => d.id && d.id.name === name);
  });
  if (!node) throw new Error(name + " not found in plugin.js");
  return source.slice(node.range[0], node.range[1]);
};

const pieces = [
  slice("CURRENT_APP_DEBRIS_NAMES", ["VariableDeclaration"]),
  slice("currentAppLooksLikeDebrisName", ["FunctionDeclaration"]),
  slice("CURRENT_APP_OWNED_KINDS", ["VariableDeclaration"]),
  slice("currentAppOwnedVerdict", ["FunctionDeclaration"]),
  slice("currentAppFoundationsVerdict", ["FunctionDeclaration"]),
].join("\n");

const stubs = {
  b7RegionNames: () => ({ "region/header": true }),
  b7DescendantInstances: async (node) => {
    const out = [];
    const walk = (n) => { if (n.type === "INSTANCE") out.push(n.name); (n.children || []).forEach(walk); };
    (node.children || []).forEach(walk);
    return out;
  },
};

const exported = new Function(
  ...Object.keys(stubs),
  pieces + "\nreturn { currentAppFoundationsVerdict, currentAppOwnedVerdict };"
)(...Object.values(stubs));

const DEBRIS = "PHASE 59 TRANSIENT DEBRIS";
const UNKNOWN = "UNIDENTIFIED — DO NOT REMOVE";

const makeNode = (name, type, data, children) => {
  const node = {
    name, type,
    children: children || [],
    getPluginData: (key) => (data && data[key]) || "",
    remove: () => { throw new Error("inspection mutated a node: remove() called on " + name); },
  };
  if (type === "COMPONENT" || type === "COMPONENT_SET") node.getInstancesAsync = async () => [];
  return node;
};

// The instance-bearing subtree the real failing group contains.
const groupChildren = () => [
  makeNode("module-heading", "TEXT", {}),
  makeNode("desktop/ABox/CurrentApp/Public & Marketplace/route-accessibility", "FRAME", {}, [
    makeNode("Button", "INSTANCE", {}),
    makeNode("PageHeader", "INSTANCE", {}),
  ]),
];

const owned = { aboxCurrentAppOwner: "Phase59", aboxCurrentAppKind: "module-group", aboxCurrentAppKey: "group:public" };

const cases = [
  // the exact node reported by the real-Figma read-only inspection (id 39:12917)
  ["failing module group", makeNode("ABox/CurrentAppGroup/Public & Marketplace", "FRAME", owned, groupChildren()), DEBRIS],
  ["screen stamp", makeNode("desktop/x", "FRAME", { aboxCurrentAppOwner: "Phase59", aboxCurrentAppKind: "screen", aboxCurrentAppKey: "current:route:/plans" }, groupChildren()), DEBRIS],
  ["mobile stamp", makeNode("mobile/x", "FRAME", { aboxCurrentAppOwner: "Phase59", aboxCurrentAppKind: "mobile-screen", aboxCurrentAppKey: "current:route:/plans:mobile" }), DEBRIS],
  ["B0-B10 batch stamp wins", makeNode("ABox/CurrentAppGroup/Public & Marketplace", "FRAME", { ...owned, aboxBatch: "B7" }, groupChildren()), UNKNOWN],
  ["aboxKey stamp wins", makeNode("ABox/CurrentAppGroup/Public & Marketplace", "FRAME", { ...owned, aboxKey: "shell:app" }, groupChildren()), UNKNOWN],
  ["bad group key", makeNode("ABox/CurrentAppGroup/Public & Marketplace", "FRAME", { ...owned, aboxCurrentAppKey: "public" }, groupChildren()), UNKNOWN],
  ["unknown kind", makeNode("ABox/CurrentAppGroup/Public & Marketplace", "FRAME", { ...owned, aboxCurrentAppKind: "scratch" }, groupChildren()), UNKNOWN],
  ["owner stamp only", makeNode("desktop/whatever", "FRAME", { aboxCurrentAppOwner: "Phase59" }, groupChildren()), UNKNOWN],
  ["pre-existing unrelated frame", makeNode("Cover", "FRAME", {}, groupChildren()), UNKNOWN],
  ["stamped COMPONENT", makeNode("ABox/Button", "COMPONENT", owned), UNKNOWN],
  ["unstamped name match with instances", makeNode("desktop/leftover", "FRAME", {}, groupChildren()), UNKNOWN],
  ["unstamped name match, no instances", makeNode("desktop/leftover", "FRAME", {}, []), DEBRIS],
  ["B7 region orphan", makeNode("region/header", "FRAME", {}, []), "B7 REGION ORPHAN"],
];

for (const [label, node, expected] of cases) {
  const verdict = await exported.currentAppFoundationsVerdict(node);
  if (verdict !== expected) throw new Error(label + ': expected "' + expected + '" but got "' + verdict + '"');
}

const reason = exported.currentAppOwnedVerdict(makeNode("g", "FRAME", owned)).reason;
if (reason.indexOf("pass") !== 0) throw new Error("ownership reason for the failing group should report pass, got: " + reason);

console.log("OK currentAppFoundationsVerdict — the group:public Phase 59 module group is classified as debris, every node failing the full ownership predicate stays UNIDENTIFIED, and classification mutates nothing (" + cases.length + " cases).");
