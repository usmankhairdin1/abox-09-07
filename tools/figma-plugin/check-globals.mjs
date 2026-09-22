// Static guard: fails on any free (undeclared) identifier reference in the
// generated plugin bundle (code.js), which contains the token files plus
// plugin.js exactly as the Figma sandbox runs them.
// Catches errors like `'h' is not defined` offline, before a Figma Desktop run.
// Run: node tools/figma-plugin/check-globals.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";
import { analyze } from "eslint-scope";

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

const file = "code.js";
const source = readFileSync(join(here, file), "utf8");
const ast = acorn.parse(source, { ecmaVersion: 2022, sourceType: "script", locations: true, ranges: true });

// Top-level declarations are real script globals shared across the concatenated files.
const declared = new Set();
const collectPattern = (node) => {
  if (!node) return;
  if (node.type === "Identifier") declared.add(node.name);
  else if (node.type === "ObjectPattern") node.properties.forEach((p) => collectPattern(p.value || p.argument));
  else if (node.type === "ArrayPattern") node.elements.forEach(collectPattern);
  else if (node.type === "AssignmentPattern") collectPattern(node.left);
  else if (node.type === "RestElement") collectPattern(node.argument);
};
for (const node of ast.body) {
  if (node.type === "VariableDeclaration") node.declarations.forEach((d) => collectPattern(d.id));
  else if (node.type === "FunctionDeclaration" || node.type === "ClassDeclaration") collectPattern(node.id);
}

const scopeManager = analyze(ast, { ecmaVersion: 2022, sourceType: "script" });
const offenders = [];
for (const ref of scopeManager.globalScope.through) {
  const name = ref.identifier.name;
  if (ALLOWED.has(name) || declared.has(name)) continue;
  offenders.push(name + " @ " + file + ":" + ref.identifier.loc.start.line);
}

if (offenders.length) {
  console.error("FAIL " + file + " — free identifier references:");
  for (const line of offenders.slice(0, 40)) console.error("  " + line);
  console.error("free-identifier scan FAILED (" + offenders.length + " reference(s))");
  process.exit(1);
}
console.log("OK " + file + " — no free identifier references (" + declared.size + " script globals declared)");
