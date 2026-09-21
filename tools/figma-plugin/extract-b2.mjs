// Phase 52 / Batch B2 — typography extractor.
// GENERATES tokens-b2.js from src/styles.css. Never edit tokens-b2.js by hand.
// Run from the project root: node tools/figma-plugin/extract-b2.mjs
// Reads only; never writes to src/**.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = join(here, "..", "..", "src", "styles.css");
const css = readFileSync(cssPath, "utf8");
const cssLines = css.split("\n");

const stop = (m) => {
  throw new Error("STOP: " + m + " — production source is authoritative; nothing is invented.");
};

// Line number (1-based) of the first line matching a predicate, searching from `from`.
const lineOf = (re, from = 0) => {
  for (let i = from; i < cssLines.length; i++) if (re.test(cssLines[i])) return i + 1;
  return -1;
};

// The declaration block that starts at the line matching `startRe`.
function block(startRe) {
  const start = lineOf(startRe);
  if (start === -1) stop("selector " + startRe + " not found in src/styles.css");
  let depth = 0;
  const decls = [];
  for (let i = start - 1; i < cssLines.length; i++) {
    const line = cssLines[i];
    depth += (line.match(/\{/g) || []).length;
    if (depth > 0 && i > start - 1) {
      const m = line.match(/^\s*([-a-z]+)\s*:\s*(.+?);\s*$/);
      if (m) decls.push({ prop: m[1], value: m[2].trim(), line: i + 1 });
    }
    depth -= (line.match(/\}/g) || []).length;
    if (depth <= 0 && i > start - 1) break;
  }
  return { start, decls };
}

const decl = (b, prop) => b.decls.find((d) => d.prop === prop) || null;
const need = (b, prop, where) => decl(b, prop) || stop(prop + " not declared in " + where);
const src = (d) => "src/styles.css:" + d.line + " — " + d.prop + ": " + d.value;

/* ---------- 1. Font families (@theme) ---------- */
const FAMILY_ROLES = ["sans", "display", "serif", "mono"];
const families = FAMILY_ROLES.map((role) => {
  const ln = lineOf(new RegExp("^\\s*--font-" + role + "\\s*:"));
  if (ln === -1) stop("--font-" + role + " not declared");
  const value = cssLines[ln - 1].match(/^\s*--font-[a-z]+\s*:\s*(.+?);\s*$/)[1].trim();
  return {
    name: "family/" + role,
    token: "--font-" + role,
    value,
    source: "src/styles.css:" + ln + " — --font-" + role + ": " + value,
  };
});

/* ---------- 2. Role declarations ---------- */
const roleBlocks = {
  base: { b: block(/^\s*html\s*\{/), where: "html" },
  heading: { b: block(/^\s*h1,\s*h2,\s*h3,\s*\.font-display\s*\{/), where: "h1, h2, h3, .font-display" },
  display: { b: block(/^@utility text-display\s*\{/), where: "@utility text-display" },
  eyebrow: { b: block(/^@utility text-eyebrow\s*\{/), where: "@utility text-eyebrow" },
  serial: { b: block(/^@utility text-serial\s*\{/), where: "@utility text-serial" },
};

// Role family -> alias, resolved from the production var(--font-X) reference only.
const roleFamilies = Object.keys(roleBlocks).map((role) => {
  const { b, where } = roleBlocks[role];
  const d = need(b, "font-family", where);
  const m = d.value.match(/^var\(\s*(--font-[a-z]+)\s*\)$/);
  if (!m) stop(where + " font-family is not a var(--font-*) reference: " + d.value);
  const target = families.find((f) => f.token === m[1]);
  if (!target) stop(where + " references undeclared " + m[1]);
  return { name: "role/" + role + "/family", alias: target.name, source: src(d), role };
});

// rem -> px at the 16px root; em -> Figma percentage.
const remToPx = (v) => {
  const m = v.match(/^([\d.]+)rem$/);
  return m ? Number(m[1]) * 16 : null;
};
const emToPercent = (v) => {
  if (v === "0") return 0;
  const m = v.match(/^(-?[\d.]+)em$/);
  return m ? Math.round(Number(m[1]) * 100 * 1000) / 1000 : null;
};

const floats = [];
const addFloat = (role, part, value, d, note) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    stop("could not convert " + role + " " + part + " from " + d.value);
  }
  floats.push({
    name: "role/" + role + "/" + part,
    value,
    source: src(d) + (note ? " (" + note + ")" : ""),
  });
};

for (const role of ["heading", "display", "eyebrow", "serial"]) {
  const { b, where } = roleBlocks[role];
  const size = decl(b, "font-size");
  if (size) addFloat(role, "size", remToPx(size.value), size, "rem converted to px at the 16px root");
  const weight = decl(b, "font-weight");
  if (weight) addFloat(role, "weight", Number(weight.value), weight);
  const ls = decl(b, "letter-spacing");
  if (ls) addFloat(role, "letter-spacing", emToPercent(ls.value), ls, "em converted to Figma percentage");
  const lh = decl(b, "line-height");
  if (lh) addFloat(role, "line-height", Number(lh.value), lh);
  void where;
}

/* ---------- 3. Limitations, recorded verbatim, never approximated ---------- */
const verbatim = (role, prop) => {
  const d = decl(roleBlocks[role].b, prop);
  return d ? roleBlocks[role].where + ": " + prop + ": " + d.value + " (src/styles.css:" + d.line + ")" : null;
};
const bodyFeature = (() => {
  const b = block(/^\s*body\s*\{/);
  const d = decl(b, "font-feature-settings");
  return d ? "body: font-feature-settings: " + d.value + " (src/styles.css:" + d.line + ")" : null;
})();

const limitations = [
  verbatim("heading", "font-variation-settings") +
    " — Figma exposes variable-font axes per text node, not as variables; recorded, no variable created.",
  verbatim("display", "font-variation-settings") +
    " — Figma exposes variable-font axes per text node, not as variables; recorded, no variable created.",
  bodyFeature + " — OpenType feature settings have no Figma variable type; recorded, no variable created.",
  verbatim("serial", "font-variant-numeric") +
    " — OpenType numeric feature; no Figma variable type; recorded, no variable created.",
  verbatim("eyebrow", "text-transform") + " — text-node property, not variable-bindable; recorded.",
  verbatim("serial", "text-transform") + " — text-node property, not variable-bindable; recorded.",
  "eyebrow/serial color: var(--muted-foreground) is already a B1 semantic variable; not duplicated into ABox/Typography.",
  "Font-family values are CSS fallback stacks. Figma has no fallback concept: the full stack is stored as the STRING value and only the first family renders when bound.",
  "JetBrains Mono is loaded in src/routes/__root.tsx but referenced by no production token (--font-mono resolves to Inter Tight); no variable created.",
  "Tailwind's built-in size/leading/tracking utilities are library-owned defaults, not ABox tokens; not imported.",
  "No Text Styles in B2: text styles, effect styles, components, component sets, variants and page content are out of scope for this batch.",
].filter((l) => l && l.indexOf("null") !== 0);

/* ---------- 4. Emit ---------- */
const data = {
  meta: {
    generated: "tools/figma-plugin/extract-b2.mjs",
    source: "src/styles.css",
    note: "Production-derived. Light and Dark values are intentionally identical: production declares no .dark typography override.",
  },
  collection: { name: "ABox/Typography", modes: ["Light", "Dark"] },
  families,
  roleFamilies,
  floats,
  limitations,
};

const stringCount = families.length + roleFamilies.length;
const floatCount = floats.length;
if (stringCount !== 9) stop("expected 9 STRING variables, derived " + stringCount);
if (floatCount !== 10) stop("expected 10 FLOAT variables, derived " + floatCount);

writeFileSync(
  join(here, "tokens-b2.js"),
  "// GENERATED by tools/figma-plugin/extract-b2.mjs from src/styles.css — do not edit.\n" +
    "const ABOX_B2 = " + JSON.stringify(data, null, 2) + ";\n",
);
console.log(
  "wrote tokens-b2.js — STRING " + stringCount + " (4 family + 5 role/family) + FLOAT " + floatCount +
    " = " + (stringCount + floatCount) + " variables, " + limitations.length + " limitations",
);
