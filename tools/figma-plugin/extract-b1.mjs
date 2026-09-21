// Phase 52 / Batch B1 — extracts the foundation variable inventory from
// src/styles.css and writes tools/figma-plugin/tokens-b1.js as static data.
// The plugin never reads src/ at runtime; this snapshot is the mapping
// authority, transcribed mechanically from the production stylesheet.
// Run: node tools/figma-plugin/extract-b1.mjs  (from the project root)
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync("src/styles.css", "utf8");
const darkIdx = css.indexOf(".dark,");
const lightSrc = css.slice(css.indexOf(":root {"), darkIdx);
const darkSrc = css.slice(darkIdx, css.indexOf("@layer base"));

const parse = (src) => {
  const out = {};
  for (const m of src.matchAll(
    /--([\w-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/g,
  )) {
    out[m[1]] = { L: +m[2], C: +m[3], h: +m[4], a: m[5] !== undefined ? +m[5] : 1 };
  }
  return out;
};
const light = parse(lightSrc);
const dark = parse(darkSrc);

const metals = Object.keys(light).filter((k) => k.startsWith("metal-"));
const semantic = Object.keys(light).filter((k) => !k.startsWith("metal-") && k !== "radius");

const slash = (name) =>
  name
    .replace(/^metal-/, "metal/")
    .replace(/^chart-/, "chart/")
    .replace(/^sidebar-/, "sidebar/")
    .replace(/^primary-/, "primary/")
    .replace(/^secondary-/, "secondary/")
    .replace(/^sage-/, "sage/")
    .replace(/^muted-/, "muted/")
    .replace(/^accent-/, "accent/")
    .replace(/^destructive-/, "destructive/")
    .replace(/^warning-/, "warning/")
    .replace(/^info-/, "info/")
    .replace(/^success-/, "success/")
    .replace(/^surface-/, "surface/")
    .replace(/^card-/, "card/")
    .replace(/^popover-/, "popover/");

const src = (name, mode) => {
  const v = mode === "dark" && dark[name] ? dark[name] : light[name];
  return (
    "oklch(" + v.L + " " + v.C + " " + v.h + (v.a !== 1 ? " / " + v.a : "") + ")"
  );
};
const colorEntry = (name) => ({
  light: light[name],
  // Figma has no CSS cascade: no .dark override => record Light as Dark.
  dark: dark[name] || light[name],
  css: "--" + name,
  source: { light: src(name, "light"), dark: src(name, "dark") },
});

const shadows = {};
const shadowSrc = css.slice(css.indexOf("/* Crisp enterprise shadows"), css.indexOf(":root {"));
for (const m of shadowSrc.matchAll(/--(shadow-[\w-]+):\s*([^;]+);/g)) {
  const layers = [];
  const re = /(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px(?:\s+(-?[\d.]+)px)?\s+oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/g;
  let lm;
  while ((lm = re.exec(m[2])) !== null) {
    layers.push({
      x: +lm[1],
      y: +lm[2],
      blur: +lm[3],
      spread: lm[4] !== undefined ? +lm[4] : 0,
      tint: { L: +lm[5], C: +lm[6], h: +lm[7], a: lm[8] !== undefined ? +lm[8] : 1 },
    });
  }
  shadows[m[1].replace("shadow-", "")] = layers;
}

const data = {
  meta: {
    phase: "52/B1",
    generatedBy: "tools/figma-plugin/extract-b1.mjs",
    source: "src/styles.css",
    note: "Colours are oklch [L, C, h] (+alpha); converted to sRGB at run time. Recorded Figma limitation, never a production change.",
  },
  collections: [
    { name: "ABox/Color/Primitive", modes: ["Light", "Dark"] },
    { name: "ABox/Color/Semantic", modes: ["Light", "Dark"] },
    { name: "ABox/Status", modes: ["Light", "Dark"] },
    { name: "ABox/Spacing", modes: ["Default"] },
    { name: "ABox/Radius", modes: ["Default"] },
    { name: "ABox/Border", modes: ["Default"] },
    { name: "ABox/Elevation", modes: ["Light", "Dark"] },
    { name: "ABox/Layout", modes: ["Default"] },
    { name: "ABox/Control sizing", modes: ["Default"] },
  ],
  // One primitive per production role path; Light and Dark are mode values on
  // the SAME variable, never two variables.
  primitives: [...semantic, ...metals].map((name) => ({
    name: slash(name),
    role: name,
    ...colorEntry(name),
  })),
  // Semantic roles alias the primitive of the same path.
  semantics: semantic.map((name) => ({
    name: slash(name),
    alias: slash(name),
    css: "--color-" + name,
  })),
  // StatusBadge tones alias semantic roles exactly as status-badge.tsx does.
  tones: [
    { name: "tone/sage", alias: "sage" },
    { name: "tone/primary", alias: "primary" },
    { name: "tone/warning", alias: "warning" },
    { name: "tone/muted", alias: "foreground" }, // muted resolves to --foreground
    { name: "tone/destructive", alias: "destructive" },
    { name: "tone/info", alias: "info" },
  ],
  metalAliases: metals.map((name) => ({ name: slash(name), alias: slash(name) })),
  spacing: {
    "surface/none": 0,
    "surface/sm": 16, // Surface padding sm = p-4
    "surface/md": 20, // md = p-5
    "surface/lg": 24, // lg = p-6
  },
  radius: {
    sm: 6, md: 10, lg: 14, xl: 18, "2xl": 22, "3xl": 28, "4xl": 36,
    base: 14, // --radius: 0.875rem
    full: 9999, // rounded-full (StatusBadge, ring-pill)
  },
  border: { hairline: 1, ring: 2 }, // border / focus:ring-2
  shadows, // not theme-split: Light value recorded for Dark (no cascade in Figma)
  layout: { "container/wide": 1408, "container/shell": 1500 }, // max-w-[88rem] / max-w-[1500px]
  control: {
    "height/md": 40, // h-10
    "height/lg": 44, // h-11
    "padding-x": 12, // px-3
    "min-touch-target": 44, // max-width:640px rule
  },
};

const js =
  "// GENERATED by tools/figma-plugin/extract-b1.mjs — edit the extractor or src/styles.css, not this file.\n" +
  "const ABOX_B1 = " +
  JSON.stringify(data, null, 2) +
  ";\n";
writeFileSync("tools/figma-plugin/tokens-b1.js", js);
console.log(
  "wrote tokens-b1.js — primitives=" +
    data.primitives.length +
    " semantics=" +
    data.semantics.length +
    " tones=" +
    data.tones.length +
    " metals=" +
    data.metalAliases.length +
    " shadows=" +
    Object.keys(shadows).length,
);
