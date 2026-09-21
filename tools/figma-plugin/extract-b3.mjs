// Phase 52 / Batch B3 — foundational Figma Styles extractor.
// Reads the production source of truth (src/styles.css, status-badge.tsx,
// metal-badge.tsx) plus the already-generated B1/B2 token files, and emits
// tokens-b3.js. Run from the repository root:
//
//   node tools/figma-plugin/extract-b3.mjs
//
// Never hand-edit tokens-b3.js; never edit code.js (see build.mjs).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const cssPath = "src/styles.css";
const css = readFileSync(join(root, cssPath), "utf8");
const cssLines = css.split("\n");

const loadTokens = (file, name) => {
  const src = readFileSync(join(here, file), "utf8").replace("const " + name + " =", "out =");
  let out;
  // eslint-disable-next-line no-eval
  eval(src);
  return out;
};
const B1 = loadTokens("tokens-b1.js", "ABOX_B1");
const B2 = loadTokens("tokens-b2.js", "ABOX_B2");

const lineOf = (needle) => {
  const i = cssLines.findIndex((l) => l.includes(needle));
  if (i === -1) throw new Error("STOP: not found in " + cssPath + " — " + needle);
  return i + 1;
};
const src = (needle) => cssPath + ":" + lineOf(needle);

/* ---------- Colour Styles ---------- */
// One style per production-consumed colour role, each bound to the existing B1
// variable. Primitives get no style: production consumes them only as alias
// targets. Value equality is never a reason to create or merge a style.
const colorStyles = [];
for (const s of B1.semantics) {
  colorStyles.push({
    name: "ABox/Semantic/" + s.name,
    collection: "ABox/Color/Semantic",
    variable: s.name,
    source: "source: " + s.css + " (" + cssPath + ")",
  });
}
for (const t of B1.tones) {
  colorStyles.push({
    name: "ABox/Status/" + t.name,
    collection: "ABox/Status",
    variable: t.name,
    source: "source: " + t.source,
  });
}
for (const m of B1.metals) {
  colorStyles.push({
    name: "ABox/Metal/" + m.name.replace(/^metal\//, ""),
    collection: "ABox/Status",
    variable: m.name,
    source: "source: " + m.source,
  });
}

/* ---------- Text Styles ---------- */
// Only roles whose production rule declares a font size can become a faithful
// Figma Text Style. base / heading / display declare no font-size (sizes come
// from per-usage Tailwind utilities) and are recorded as limitations instead.
const float = (name) => {
  const f = B2.floats.find((x) => x.name === name);
  if (!f) throw new Error("STOP: B2 float missing — " + name);
  return f.value;
};
const familyStack = (roleFamilyName) => {
  const role = B2.roleFamilies.find((r) => r.name === roleFamilyName);
  if (!role) throw new Error("STOP: B2 role family missing — " + roleFamilyName);
  const fam = B2.families.find((f) => f.name === role.alias);
  if (!fam) throw new Error("STOP: B2 family missing — " + role.alias);
  return { stack: fam.value, alias: role.alias };
};
const firstFamily = (stack) => stack.split(",")[0].trim().replace(/^["']|["']$/g, "");

const eyebrowFam = familyStack("role/eyebrow/family");
const serialFam = familyStack("role/serial/family");

const textStyles = [
  {
    name: "ABox/Text/eyebrow",
    family: firstFamily(eyebrowFam.stack),
    weight: float("role/eyebrow/weight"),
    styleNames: ["Medium"],
    fontSize: float("role/eyebrow/size"),
    letterSpacing: { value: float("role/eyebrow/letter-spacing"), unit: "PERCENT" },
    textCase: "UPPER",
    source:
      "source: @utility text-eyebrow (" +
      src("@utility text-eyebrow") +
      ") — font-family var(--font-mono) -> " +
      eyebrowFam.alias +
      "; font-size 0.6875rem; font-weight 500; letter-spacing 0; text-transform uppercase",
  },
  {
    name: "ABox/Text/serial",
    family: firstFamily(serialFam.stack),
    weight: 400,
    styleNames: ["Regular"],
    fontSize: float("role/serial/size"),
    letterSpacing: { value: float("role/serial/letter-spacing"), unit: "PERCENT" },
    textCase: "UPPER",
    source:
      "source: @utility text-serial (" +
      src("@utility text-serial") +
      ") — font-family var(--font-mono) -> " +
      serialFam.alias +
      "; font-size 0.625rem; letter-spacing 0; text-transform uppercase. Production declares" +
      " no font-weight for this role: the CSS-inherited initial value normal (400) is used, not a chosen weight.",
  },
];

/* ---------- Effect Styles ---------- */
// Layer geometry and tint come from B1's elevation decomposition; every field
// is BOUND to the existing B1 variable, so no number is duplicated.
const effectStyles = Object.keys(B1.shadows).map((family) => ({
  name: "ABox/Elevation/" + family,
  family,
  layers: B1.shadows[family].map((layer) => ({
    index: layer.index,
    x: layer.x,
    y: layer.y,
    blur: layer.blur,
    spread: layer.spread,
    tint: layer.tint,
    tintCss: layer.tintCss,
    vars: {
      x: family + "/" + layer.index + "/x",
      y: family + "/" + layer.index + "/y",
      blur: family + "/" + layer.index + "/blur",
      spread: family + "/" + layer.index + "/spread",
      tint: family + "/" + layer.index + "/tint",
    },
  })),
  source:
    "source: --shadow-" +
    family +
    " (" +
    src("--shadow-" + family + ":") +
    ") — every layer field bound to ABox/Elevation variables",
}));

/* ---------- Limitations (verbatim, never substituted) ---------- */
const limitations = [
  "src/components/abox/status-badge.tsx — color: color-mix(in oklch, var(--tone) 88%, var(--foreground)); background: color-mix(in oklch, var(--tone) 12%, var(--card)); borderColor: color-mix(in oklch, var(--tone) 34%, transparent): runtime-computed, no static Figma Style created.",
  "src/styles.css — oklch() has no Figma equivalent: colours are converted to sRGB and the original oklch literal is preserved in the style description.",
  "src/styles.css:" + lineOf("h1, h2, h3, .font-display") + " and " + lineOf("@utility text-display") + " — h1,h2,h3,.font-display and @utility text-display declare no font-size, so no faithful Text Style exists; sizes are applied per usage by Tailwind utilities. Recorded, not approximated.",
  "src/styles.css:" + lineOf("font-family: var(--font-sans);") + " — the html base role declares only font-family; no Text Style created.",
  'src/styles.css:' + lineOf('font-variation-settings: "wdth" 102, "opsz" 32') + ' and :' + lineOf('font-variation-settings: "wdth" 102, "opsz" 48') + ' — font-variation-settings axes are per text node, not Text Style properties; recorded only.',
  'src/styles.css:' + lineOf('font-feature-settings: "ss01", "cv11"') + ' — font-feature-settings has no Figma Text Style property; recorded only.',
  "src/styles.css:" + lineOf("font-variant-numeric: tabular-nums") + " — font-variant-numeric: tabular-nums has no Figma Text Style property; recorded only.",
  "@utility text-eyebrow / text-serial declare color: var(--muted-foreground): Figma Text Styles hold no colour; the ABox/Semantic/muted-foreground colour style carries it.",
  "src/components/abox/plan-o-assistant.tsx:27 composes var(--shadow-glow) with an additional inline shadow layer: a component-level composition, not a foundational Effect Style.",
  "src/styles.css:" + lineOf("--shadow-overlay:") + " — --shadow-overlay is an alias of --shadow-elevated with no consumer; documented, no separate Effect Style.",
  "Production declares no .dark override for --shadow-*: the elevation styles are mode-identical by production, not by approximation.",
  "The 62 B1 primitives receive no colour styles: production consumes them only as alias targets.",
  "Decorative utilities (noise-field, contour, aurora, glass, ember-underline, card-brackets, edge-sheen), motion keyframes and responsive breakpoints are not Figma Styles; none is representable exactly and all are out of scope.",
  "No grid styles: production declares no reusable grid definition. Category recorded as zero.",
  "No components, component sets, variants, page content or publishing in B3.",
];

const out =
  "// GENERATED by tools/figma-plugin/extract-b3.mjs — do not edit by hand.\n" +
  "const ABOX_B3 = " +
  JSON.stringify(
    {
      meta: {
        batch: "B3",
        source: cssPath + ", src/components/abox/status-badge.tsx, src/components/abox/metal-badge.tsx",
        generated: "tools/figma-plugin/extract-b3.mjs",
      },
      colorStyles,
      textStyles,
      effectStyles,
      limitations,
    },
    null,
    2,
  ) +
  ";\n";

writeFileSync(join(here, "tokens-b3.js"), out);

const layerCount = effectStyles.reduce((n, e) => n + e.layers.length, 0);
if (colorStyles.length !== 72) throw new Error("STOP: expected 72 colour styles, got " + colorStyles.length);
if (textStyles.length !== 2) throw new Error("STOP: expected 2 text styles, got " + textStyles.length);
if (effectStyles.length !== 5) throw new Error("STOP: expected 5 effect styles, got " + effectStyles.length);
console.log(
  "wrote tokens-b3.js — colour " +
    colorStyles.length +
    " + text " +
    textStyles.length +
    " + effect " +
    effectStyles.length +
    " = " +
    (colorStyles.length + textStyles.length + effectStyles.length) +
    " styles; " +
    layerCount +
    " effect layers; " +
    limitations.length +
    " limitations",
);
