// Static guard: fails on any free (undeclared) identifier reference in the plugin
// source and in the generated bundle. Catches errors like `'h' is not defined`
// offline, before a Figma Desktop run.
// Run: node tools/figma-plugin/check-globals.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";
import eslintScope from "eslint-scope";

const here = dirname(fileURLToPath(import.meta.url));

// Figma plugin sandbox surface + standard ES globals the plugin relies on.
const ALLOWED = new Set([
  "figma", "__html__", "console", "globalThis", "undefined", "NaN", "Infinity",
  "Object", "Array", "String", "Number", "Boolean", "Symbol", "BigInt", "Math",
  "JSON", "Date", "RegExp", "Error", "TypeError", "RangeError", "Promise",
  "Map", "Set", "WeakMap", "WeakSet", "Proxy", "Reflect", "Function",
  "parseInt", "parseFloat", "isNaN", "isFinite", "encodeURIComponent",
  "decodeURIComponent", "encodeURI", "decodeURI", "setTimeout", "clearTimeout",
  "setInterval", "clearInterval", "Uint8Array", "ArrayBuffer", "TextEncoder",
  "TextDecoder", "fetch", "module", "require", "exports",
]);

const files = ["plugin.js", "code.js"];
let failures = 0;

for (const file of files) {
  const source = readFileSync(join(here, file), "utf8");
  const ast = acorn.parse(source, { ecmaVersion: 2022, sourceType: "script", locations: true });
  const scopeManager = eslintScope.analyze(ast, { ecmaVersion: 2022, sourceType: "script" });
  const offenders = [];
  for (const ref of scopeManager.globalScope.through) {
    const name = ref.identifier.name;
    if (ALLOWED.has(name)) continue;
    offenders.push(name + " @ " + file + ":" + ref.identifier.loc.start.line);
  }
  if (offenders.length) {
    failures += offenders.length;
    console.error("FAIL " + file + " — free identifier references:");
    for (const line of offenders.slice(0, 40)) console.error("  " + line);
  } else {
    console.log("OK " + file + " — no free identifier references");
  }
}

if (failures) {
  console.error("free-identifier scan FAILED (" + failures + " reference(s))");
  process.exit(1);
}
console.log("free-identifier scan passed");
