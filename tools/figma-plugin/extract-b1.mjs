// Phase 52 / Batch B1 — extracts the foundation variable inventory from
// src/styles.css and writes tools/figma-plugin/tokens-b1.js as static data.
// The plugin never reads src/ at runtime; this snapshot is the mapping
// authority, transcribed mechanically from the production stylesheet.
//
// Mapping rules (approved B1 plan):
//   * Aliasing is source-mapping authoritative: a semantic role aliases a
//     primitive only because production declares `--color-X: var(--Y)`.
//     Equal colour values NEVER imply an alias.
//   * Light and Dark are resolved independently from `:root` and `.dark`.
//   * One variable per production role path; a Light/Dark literal difference
//     is two mode values on the SAME variable.
//   * Slash paths only where production already uses a family prefix:
//     chart-, sidebar-, metal-.
// Run: node tools/figma-plugin/extract-b1.mjs  (from the project root)
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync("src/styles.css", "utf8");

/* ---------- block collection ---------- */
// Every `:root { … }` and `.dark… { … }` declaration block, in source order.
function blocks(selectorRe) {
  const out = [];
  const re = new RegExp(selectorRe.source + "\\s*\\{", "g");
  let m;
  while ((m = re.exec(css)) !== null) {
    const start = m.index + m[0].length;
    const end = css.indexOf("}", start);
    out.push(css.slice(start, end));
  }
  return out;
}
const lightBlocks = blocks(/(?:^|\n):root(?![.\w-])/);
const darkBlocks = blocks(/(?:^|\n)\.dark,?\s*(?:\n\s*)?(?::root\.dark)?/);

function declarations(srcBlocks) {
  const out = {};
  for (const b of srcBlocks) {
    for (const m of b.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      out[m[1]] = m[2].trim();
    }
  }
  return out;
}
const lightDecl = declarations(lightBlocks);
const darkDecl = declarations(darkBlocks);

const OKLCH = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/;
const parseOklch = (raw) => {
  const m = raw.match(OKLCH);
  if (!m) return null;
  return { L: +m[1], C: +m[2], h: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
};
const varRef = (raw) => {
  const m = raw.match(/^var\(--([\w-]+)\)$/);
  return m ? m[1] : null;
};
const oklchCss = (v) =>
  "oklch(" + v.L + " " + v.C + " " + v.h + (v.a !== 1 ? " / " + v.a : "") + ")";

/* ---------- primitives ---------- */
// A primitive is a role whose production declaration is a literal oklch()
// value. `var()`-only roles (brand-accent, surface-1..3) are not primitives —
// they resolve through the declaration graph to one.
const primitiveRoles = Object.keys(lightDecl).filter((k) => parseOklch(lightDecl[k]));

const slash = (role) =>
  role
    .replace(/^metal-/, "metal/")
    .replace(/^chart-/, "chart/")
    .replace(/^sidebar-/, "sidebar/");

const primitives = primitiveRoles.map((role) => {
  const light = parseOklch(lightDecl[role]);
  // Figma has no CSS cascade: no .dark override => record Light as Dark.
  const darkRaw = darkDecl[role];
  const dark = darkRaw ? parseOklch(darkRaw) : null;
  return {
    name: slash(role),
    role,
    light,
    dark: dark || light,
    darkOverridden: !!dark,
    source: {
      light: "--" + role + ": " + oklchCss(light),
      dark: dark
        ? "--" + role + ": " + oklchCss(dark) + "  (.dark)"
        : "--" + role + ": " + oklchCss(light) + "  (no .dark override — Light duplicated)",
    },
  };
});
const primitiveByRole = {};
for (const p of primitives) primitiveByRole[p.role] = p;

/* ---------- semantic roles (@theme inline --color-*) ---------- */
const limitations = [];

// Follow `var()` chains within one mode until a primitive literal is reached.
function resolveToPrimitive(role, mode, trail) {
  const decl = mode === "dark" ? darkDecl[role] || lightDecl[role] : lightDecl[role];
  if (decl === undefined) return { error: "undeclared role --" + role };
  if (parseOklch(decl)) return { role, trail: trail.concat("--" + role) };
  const next = varRef(decl);
  if (next) return resolveToPrimitive(next, mode, trail.concat("--" + role));
  if (/color-mix/.test(decl)) {
    return { runtime: true, decl, trail: trail.concat("--" + role) };
  }
  return { error: "--" + role + ": " + decl };
}

const themeColorRoles = [];
for (const m of css.matchAll(/--color-([\w-]+):\s*var\(--([\w-]+)\);/g)) {
  themeColorRoles.push({ name: m[1], target: m[2] });
}

const semantics = themeColorRoles.map((r) => {
  const l = resolveToPrimitive(r.target, "light", []);
  const d = resolveToPrimitive(r.target, "dark", []);
  for (const [mode, res] of [["Light", l], ["Dark", d]]) {
    if (res.runtime) {
      limitations.push(
        "--color-" + r.name + " (" + mode + ") resolves through a runtime computation: " + res.decl,
      );
    } else if (res.error) {
      throw new Error("STOP: unresolved semantic role --color-" + r.name + " — " + res.error);
    }
  }
  return {
    name: slash(r.name),
    css: "--color-" + r.name + ": var(--" + r.target + ");",
    aliasLight: l.role ? slash(l.role) : null,
    aliasDark: d.role ? slash(d.role) : null,
    chainLight: l.trail.join(" -> "),
    chainDark: d.trail.join(" -> "),
  };
});

/* ---------- Status — StatusBadge tones + metal tiers ---------- */
// Tone -> production custom property, transcribed from the `tones` record in
// src/components/abox/status-badge.tsx. Each tone aliases the SEMANTIC
// variable for that role, by source mapping, never by colour equality.
const toneSource = "src/components/abox/status-badge.tsx";
const tones = [
  { name: "sage", role: "sage" },
  { name: "primary", role: "primary" },
  { name: "warning", role: "warning" },
  { name: "muted", role: "foreground" }, // muted: [--tone:var(--foreground)]
  { name: "destructive", role: "destructive" },
  { name: "info", role: "info" },
].map((t) => {
  const sem = semantics.find((s) => s.name === slash(t.role));
  if (!sem) throw new Error("STOP: tone " + t.name + " has no semantic role " + t.role);
  return {
    name: t.name,
    alias: sem.name,
    source: toneSource + ' — tones.' + t.name + ': "[--tone:var(--' + t.role + ')]"',
  };
});

// StatusBadge colours themselves are color-mix() expressions — runtime-computed.
limitations.push(
  "StatusBadge colour/background/border use color-mix(in oklch, var(--tone) …, …) " +
    "(" + toneSource + "): runtime-computed, no static Figma variable created.",
);

const metals = primitives
  .filter((p) => p.role.startsWith("metal-"))
  .map((p) => ({
    name: p.name,
    alias: p.name,
    source: "src/components/abox/metal-badge.tsx — [--tone:var(--" + p.role + ")]",
  }));

/* ---------- elevation ---------- */
const shadowFamilies = ["card", "elevated", "drawer", "plate", "glow"];
const shadows = {};
for (const family of shadowFamilies) {
  const m = css.match(new RegExp("--shadow-" + family + ":\\s*([^;]+);"));
  if (!m) throw new Error("STOP: --shadow-" + family + " not found in src/styles.css");
  const layers = [];
  const re =
    /(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px(?:\s+(-?[\d.]+)px)?\s+oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/g;
  let lm;
  while ((lm = re.exec(m[1])) !== null) {
    const tint = {
      L: +lm[5],
      C: +lm[6],
      h: +lm[7],
      a: lm[8] !== undefined ? +lm[8] : 1,
    };
    layers.push({
      index: layers.length + 1,
      x: +lm[1],
      y: +lm[2],
      blur: +lm[3],
      spread: lm[4] !== undefined ? +lm[4] : 0,
      tint,
      tintCss: oklchCss(tint),
    });
  }
  if (!layers.length) throw new Error("STOP: --shadow-" + family + " produced no layers");
  shadows[family] = layers;
}
limitations.push(
  "Composite box-shadow is not a Figma variable type: --shadow-* is decomposed into " +
    "x/y/blur/spread/tint variables. Effect Styles are a later batch.",
);
limitations.push(
  "oklch() has no Figma equivalent: values are stored as sRGB and the original " +
    "oklch literal is preserved in each variable description.",
);
limitations.push(
  "Production declares no .dark override for --shadow-*: the Light value is duplicated " +
    "into Dark because Figma has no CSS cascade.",
);

/* ---------- static (non-colour) inventories ---------- */
const MODES = ["Light", "Dark"];
const data = {
  meta: {
    phase: "52/B1",
    generatedBy: "tools/figma-plugin/extract-b1.mjs",
    source: "src/styles.css",
    note:
      "Colours are oklch [L, C, h] (+alpha); converted to sRGB at run time. " +
      "Recorded Figma limitation, never a production change.",
  },
  collections: [
    { name: "ABox/Color/Primitive", modes: MODES },
    { name: "ABox/Color/Semantic", modes: MODES },
    { name: "ABox/Status", modes: MODES },
    { name: "ABox/Spacing", modes: MODES },
    { name: "ABox/Radius", modes: MODES },
    { name: "ABox/Border", modes: MODES },
    { name: "ABox/Elevation", modes: MODES },
    { name: "ABox/Layout", modes: MODES },
    { name: "ABox/Control sizing", modes: MODES },
  ],
  primitives,
  semantics,
  tones,
  metals,
  spacing: {
    "surface/none": 0,
    "surface/sm": 16, // Surface padding sm = p-4
    "surface/md": 20, // md = p-5
    "surface/lg": 24, // lg = p-6
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    "2xl": 22,
    "3xl": 28,
    "4xl": 36,
    base: 14, // --radius: 0.875rem
    full: 9999, // rounded-full (StatusBadge, ring-pill)
  },
  border: { hairline: 1, ring: 2 }, // border / focus:ring-2
  shadows,
  layout: { "container/wide": 1408, "container/shell": 1500 }, // max-w-[88rem] / max-w-[1500px]
  control: {
    "height/md": 40, // h-10
    "height/lg": 44, // h-11
    "padding-x": 12, // px-3
    "min-touch-target": 44, // max-width:640px rule
  },
  limitations,
};

const js =
  "// GENERATED by tools/figma-plugin/extract-b1.mjs — edit the extractor or src/styles.css, not this file.\n" +
  "const ABOX_B1 = " +
  JSON.stringify(data, null, 2) +
  ";\n";
writeFileSync("tools/figma-plugin/tokens-b1.js", js);

const elevationVars = Object.keys(shadows).reduce(
  (n, f) => n + shadows[f].length * 5,
  0,
);
console.log(
  "wrote tokens-b1.js — primitives=" +
    primitives.length +
    " semantics=" +
    semantics.length +
    " tones=" +
    tones.length +
    " metals=" +
    metals.length +
    " elevation vars=" +
    elevationVars +
    " limitations=" +
    limitations.length,
);
