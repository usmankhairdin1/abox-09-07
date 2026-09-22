// Runtime-safe regression harness for the Phase 59 guarded rollback.
// Extracts currentAppGuarded from plugin.js and executes it with stubbed Figma
// pages, proving that a transient node left on the active (protected) page by a
// failing run is removed, while pre-existing nodes are never touched.
// Run: node tools/figma-plugin/check-current-app-guard.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, "plugin.js"), "utf8");
const ast = acorn.parse(source, { ecmaVersion: 2022, sourceType: "script", ranges: true });

const fnNode = ast.body.find((n) => n.type === "FunctionDeclaration" && n.id && n.id.name === "currentAppGuarded");
if (!fnNode) throw new Error("currentAppGuarded not found in plugin.js");
const fnSource = source.slice(fnNode.range[0], fnNode.range[1]);

let removedIds = [];
const makeNode = (id, name, type = "FRAME") => {
  const node = { id, name, type, removed: false };
  node.remove = () => { node.removed = true; removedIds.push(id); page.children = page.children.filter((c) => c !== node); };
  return node;
};

const preExisting = makeNode("pre-1", "Existing foundations note");
const stray = makeNode("stray-1", "desktop/current:route:/app");
const strayText = makeNode("stray-2", "page-title", "TEXT");
const mainComponent = makeNode("main-1", "ABox/Button", "COMPONENT");

const page = { id: "p0", name: "00 Foundations", children: [preExisting] };
const currentAppPageNode = { id: "p7", name: "07 Current App", children: [] };

const lines = [];
const stubs = {
  CURRENT_APP_PAGE: "07 Current App",
  currentAppApprovedNames: () => [],
  say: (line) => lines.push(line),
  figma: {
    root: { children: [page, currentAppPageNode] },
    currentPage: page,
    loadAllPagesAsync: async () => {},
  },
};

const runner = new Function(
  ...Object.keys(stubs),
  fnSource + "\nreturn currentAppGuarded;"
)(...Object.values(stubs));

let threw = false;
try {
  await runner("regression", async () => {
    // simulates figma.createFrame/createText landing on the active page mid-run
    page.children.push(stray, strayText, mainComponent);
    throw new Error("h is not defined");
  });
} catch (error) {
  threw = true;
  if (error.message !== "h is not defined") throw new Error("guard swallowed or rewrote the original error: " + error.message);
}
if (!threw) throw new Error("currentAppGuarded did not rethrow the original failure");

if (preExisting.removed) throw new Error("pre-existing node on 00 Foundations was removed");
if (mainComponent.removed) throw new Error("a COMPONENT was removed by rollback");
if (!stray.removed) throw new Error("transient frame stray was NOT removed from the active page");
if (!strayText.removed) throw new Error("transient text stray was NOT removed from the active page");
if (!lines.some((l) => l.indexOf("guarded rollback completed") !== -1)) throw new Error("rollback did not report completion");

// A successful run must remove nothing at all.
removedIds = [];
const okStray = makeNode("stray-3", "desktop/ok");
await runner("regression-ok", async () => { page.children.push(okStray); return "done"; });
if (removedIds.length) throw new Error("successful run removed nodes: " + removedIds.join(", "));

console.log("OK currentAppGuarded — transient strays on the active page are swept, pre-existing and component nodes are preserved, successful runs remove nothing.");
