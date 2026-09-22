// Runtime-safe regression harness for the Phase 59 mobile companion builder.
// Extracts currentAppBuildMobile from plugin.js and executes it against a real
// manifest screen with stubbed Figma helpers. Fails on any undefined identifier
// or geometry drift before a Figma Desktop run.
// Run: node tools/figma-plugin/check-current-app-mobile.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, "plugin.js"), "utf8");
const ast = acorn.parse(source, { ecmaVersion: 2022, sourceType: "script", ranges: true });

const fnNode = ast.body.find((n) => n.type === "FunctionDeclaration" && n.id && n.id.name === "currentAppBuildMobile");
if (!fnNode) throw new Error("currentAppBuildMobile not found in plugin.js");
const fnSource = source.slice(fnNode.range[0], fnNode.range[1]);

// Real manifest data — no invented screens.
const manifestSource = readFileSync(join(here, "tokens-current-app.js"), "utf8");
const ABOX_CURRENT_APP = new Function(manifestSource + "\nreturn ABOX_CURRENT_APP;")();

const makeNode = (name) => ({
  name,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  children: [],
  pluginData: {},
  appendChild(child) { this.children.push(child); },
  setPluginData(k, v) {
    if (typeof v !== "string") throw new Error("setPluginData value must be a string: " + k);
    this.pluginData[k] = v;
  },
  getPluginData(k) { return this.pluginData[k] || ""; },
});

const stubs = {
  ABOX_CURRENT_APP,
  currentAppCreatedDescendants: 0,
  async b8Frame(name, opts) {
    const node = makeNode(name);
    if (typeof opts.w !== "number" || !Number.isFinite(opts.w)) throw new Error("b8Frame(" + name + "): invalid width " + String(opts.w));
    if (opts.primarySizing === "FIXED" && opts.counterSizing === "FIXED") {
      if (typeof opts.h !== "number" || !Number.isFinite(opts.h)) throw new Error("b8Frame(" + name + "): invalid height " + String(opts.h));
    }
    node.width = opts.w;
    node.height = typeof opts.h === "number" ? opts.h : 0;
    return node;
  },
  async currentAppText(name) { return makeNode(name); },
  async currentAppInstance(name) { return makeNode("instance/" + name); },
  async currentAppLocalCard(name) { return makeNode(name); },
};

const runner = new Function(
  ...Object.keys(stubs),
  fnSource + "\nreturn currentAppBuildMobile;"
)(...Object.values(stubs));

const screens = ABOX_CURRENT_APP.screens.filter((s) => s.mobile);
if (!screens.length) throw new Error("no mobile companion screens in manifest");

let checked = 0;
for (const spec of screens) {
  const placement = { width: 1440, height: 1200, mobileX: 1500, y: 240 };
  const frame = await runner(spec, placement, {});
  const expectedHeight = Math.max(844, Math.round(placement.height * 0.82));
  if (frame.width !== ABOX_CURRENT_APP.layout.mobileWidth) throw new Error(spec.key + ": width " + frame.width);
  if (frame.height !== expectedHeight) throw new Error(spec.key + ": height " + frame.height + " expected " + expectedHeight);
  if (frame.name !== "mobile/" + spec.name) throw new Error(spec.key + ": name " + frame.name);
  if (frame.getPluginData("aboxCurrentAppDesktopKey") !== spec.key) throw new Error(spec.key + ": desktop key not stamped");
  checked += 1;
}

console.log("OK currentAppBuildMobile — " + checked + " mobile companions built offline, width " + ABOX_CURRENT_APP.layout.mobileWidth);
