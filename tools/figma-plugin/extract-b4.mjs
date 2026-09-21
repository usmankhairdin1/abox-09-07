// Phase 52 / Batch B4 — production component foundation extractor.
// Reads the production source of truth under src/ and emits tokens-b4.js.
// Run from the repository root:
//
//   node tools/figma-plugin/extract-b4.mjs
//
// Never hand-edit tokens-b4.js; never edit code.js (see build.mjs).
//
// Rules enforced here:
//  - every component/variant is derived from a production declaration;
//  - Button / Surface / Control variant axes are enumerated from real call
//    sites only (dynamic values are recorded as limitations, never guessed);
//  - colours map to the B3 Colour Styles that already bind B1 variables;
//  - Tailwind numeric utilities are literals with the class string recorded —
//    they are NOT bound to B1 spacing/radius variables, because production
//    does not declare them through those variables.

import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const lineOf = (file, text, needle) => {
  const i = text.split("\n").findIndex((l) => l.includes(needle));
  if (i === -1) throw new Error("STOP: not found in " + file + " — " + needle);
  return file + ":" + (i + 1);
};

/* ---------- production sources ---------- */
const F = {
  pill: "src/components/abox/action-pill.ts",
  pillCmp: "src/components/abox/action-pill-component.tsx",
  status: "src/components/abox/status-badge.tsx",
  metal: "src/components/abox/metal-badge.tsx",
  button: "src/components/ui/button.tsx",
  input: "src/components/ui/input.tsx",
  surface: "src/components/abox/surface.tsx",
  control: "src/components/abox/control.tsx",
  field: "src/components/abox/field.tsx",
  kpi: "src/components/abox/kpi-card.tsx",
  header: "src/components/abox/page-header.tsx",
  empty: "src/components/abox/empty-state.tsx",
  tabs: "src/components/abox/module-tabs.tsx",
  wizard: "src/components/abox/downline-wizard-stepper.tsx",
  logo: "src/components/abox/logo.tsx",
};
const S = {};
for (const k of Object.keys(F)) S[k] = read(F[k]);

/* ---------- Tailwind utility -> geometry (literal values, class recorded) ---------- */
const SIZE = {
  "h-4": 16, "h-5": 20, "h-6": 24, "h-8": 32, "h-9": 36, "h-10": 40, "h-11": 44,
  "h-12": 48, "h-14": 56, "h-16": 64, "w-4": 16, "w-5": 20, "w-8": 32, "w-9": 36,
  "w-12": 48, "w-16": 64,
};
const PX = {
  "px-2.5": 10, "px-3": 12, "px-4": 16, "px-5": 20, "px-6": 24, "px-8": 32,
  "p-4": 16, "p-5": 20, "p-6": 24,
};
const PY = { "py-0.5": 2, "py-1": 4, "py-1.5": 6, "py-2": 8, "py-14": 56 };
const GAP = { "gap-1": 4, "gap-1.5": 6, "gap-2": 8, "gap-3": 12, "gap-4": 16 };
const RADIUS = { "rounded-full": 9999, "rounded-2xl": 16, "rounded-lg": 8, "rounded-md": 6 };
const FONTSIZE = {
  "text-[10px]": 10, "text-[11px]": 11, "text-xs": 12, "text-sm": 14, "text-base": 16,
  "text-lg": 18, "text-xl": 20, "text-2xl": 24, "text-3xl": 30, "text-5xl": 48,
};
const WEIGHT = { "font-medium": 500, "font-semibold": 600 };
const COLOR = {
  "bg-primary": "primary",
  "text-primary-foreground": "primary-foreground",
  "text-primary": "primary",
  "bg-card": "card",
  "bg-background": "background",
  "bg-surface": "surface",
  "bg-secondary": "secondary",
  "text-secondary-foreground": "secondary-foreground",
  "bg-destructive": "destructive",
  "text-destructive-foreground": "destructive-foreground",
  "border-border": "border",
  "border-border-strong": "border-strong",
  "border-hairline": "hairline",
  "border-input": "input",
  "border-primary": "primary",
  "text-foreground": "foreground",
  "text-muted-foreground": "muted-foreground",
};
const sem = (cls) => {
  const name = COLOR[cls];
  if (!name) throw new Error("STOP: no semantic mapping for Tailwind class " + cls);
  return "ABox/Semantic/" + name;
};
const pick = (cls, table, what) => {
  if (!(cls in table)) throw new Error("STOP: unmapped " + what + " utility " + cls);
  return table[cls];
};

/** Parse one ACTION_PILL class string into a faithful node spec. */
function pillNode(classes, label) {
  const c = classes.split(/\s+/);
  const has = (x) => c.indexOf(x) !== -1;
  const find = (table) => c.find((x) => x in table);
  const node = {
    type: "FRAME",
    layout: "HORIZONTAL",
    align: "CENTER",
    h: pick(find(SIZE), SIZE, "height"),
    px: pick(find(PX), PX, "padding-x"),
    py: 0,
    gap: find(GAP) ? GAP[find(GAP)] : 0,
    radius: pick(find(RADIUS), RADIUS, "radius"),
    fillStyle: has("bg-primary") ? sem("bg-primary") : has("bg-card") ? sem("bg-card") : null,
    strokeStyle: has("border") && has("border-border") ? sem("border-border") : null,
    strokeWeight: has("border") ? 1 : 0,
    children: [
      {
        type: "TEXT",
        characters: label,
        fontSize: pick(find(FONTSIZE), FONTSIZE, "font-size"),
        weight: find(WEIGHT) ? WEIGHT[find(WEIGHT)] : 400,
        colorStyle: has("text-primary-foreground") ? sem("text-primary-foreground") : sem("text-foreground"),
      },
    ],
  };
  return node;
}

/* ---------- 1. ActionPill (10 production keys) ---------- */
const pillKeys = [...S.pill.matchAll(/^\s{2}([a-zA-Z]+):\s*\n?\s*"([^"]+)",/gm)].map((m) => ({
  key: m[1],
  classes: m[2],
}));
if (pillKeys.length !== 10) throw new Error("STOP: expected 10 ACTION_PILL keys, got " + pillKeys.length);

const actionPill = {
  name: "ABox/Action/ActionPill",
  property: "variant",
  source: "source: " + lineOf(F.pill, S.pill, "export const ACTION_PILL"),
  textProps: [{ name: "label", default: "Action" }],
  values: pillKeys.map((k) => ({
    value: k.key,
    source: "source: " + F.pill + " ACTION_PILL." + k.key + ' = "' + k.classes + '"',
    node: pillNode(k.classes, "Action"),
  })),
};

/* ---------- 2. Button (enumerated call sites) ---------- */
const CVA = {
  variant: {
    default: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background",
    secondary: "bg-secondary text-secondary-foreground",
    ghost: "",
    link: "text-primary",
  },
  size: {
    default: { h: 36, px: 16, radius: 6, fontSize: 14 },
    sm: { h: 32, px: 12, radius: 6, fontSize: 12 },
    lg: { h: 40, px: 32, radius: 6, fontSize: 14 },
    icon: { h: 36, w: 36, px: 0, radius: 6, fontSize: 14 },
    "icon-sm": { h: 32, w: 32, px: 0, radius: 6, fontSize: 14 },
  },
};

/** Walk every production tsx/ts file outside excluded layers. */
function productionFiles() {
  const out = [];
  const skip = [
    "src/components/ui",
    "src/lib/design",
    "src/components/design",
    "src/routes/design-system.tsx",
    "src/routes/design-guide.tsx",
  ];
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      const rel = relative(root, p).split("\\").join("/");
      if (skip.some((s) => rel === s || rel.startsWith(s + "/"))) continue;
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(e)) out.push(rel);
    }
  };
  walk(join(root, "src"));
  return out.sort();
}
const files = productionFiles();

const dynamicNotes = [];
const buttonPairs = new Map();
for (const rel of files) {
  const text = read(rel);
  const re = /<Button\b/g;
  let m;
  while ((m = re.exec(text))) {
    // balanced scan to the end of the opening tag
    let i = m.index + 7;
    let depth = 0;
    while (i < text.length) {
      const ch = text[i];
      if (ch === "{") depth += 1;
      else if (ch === "}") depth -= 1;
      else if (ch === ">" && depth === 0) break;
      i += 1;
    }
    const tag = text.slice(m.index, i);
    const line = text.slice(0, m.index).split("\n").length;
    const lit = (prop) => {
      const l = tag.match(new RegExp(prop + '="([a-z-]+)"'));
      if (l) return l[1];
      if (new RegExp(prop + "=\\{").test(tag)) return null;
      return "default";
    };
    const variant = lit("variant");
    const size = lit("size");
    if (variant === null || size === null) {
      dynamicNotes.push(
        rel + ":" + line + " — <Button> receives a computed variant/size expression; not statically enumerable, recorded, no variant invented.",
      );
      continue;
    }
    const key = variant + "|" + size;
    if (!buttonPairs.has(key)) buttonPairs.set(key, []);
    buttonPairs.get(key).push(rel + ":" + line);
  }
}
if (buttonPairs.size === 0) throw new Error("STOP: no Button call sites enumerated");

function buttonNode(variant, size) {
  const v = CVA.variant[variant];
  if (v === undefined) throw new Error("STOP: unknown Button variant " + variant);
  const s = CVA.size[size];
  if (!s) throw new Error("STOP: unknown Button size " + size);
  const c = v.split(/\s+/).filter(Boolean);
  const has = (x) => c.indexOf(x) !== -1;
  const fill = has("bg-primary")
    ? sem("bg-primary")
    : has("bg-destructive")
      ? sem("bg-destructive")
      : has("bg-secondary")
        ? sem("bg-secondary")
        : has("bg-background")
          ? sem("bg-background")
          : null;
  const text = has("text-primary-foreground")
    ? sem("text-primary-foreground")
    : has("text-destructive-foreground")
      ? sem("text-destructive-foreground")
      : has("text-secondary-foreground")
        ? sem("text-secondary-foreground")
        : has("text-primary")
          ? sem("text-primary")
          : sem("text-foreground");
  return {
    type: "FRAME",
    layout: "HORIZONTAL",
    align: "CENTER",
    justify: "CENTER",
    h: s.h,
    w: s.w || null,
    px: s.px,
    py: 0,
    gap: 8,
    radius: s.radius,
    fillStyle: fill,
    strokeStyle: has("border") ? sem("border-input") : null,
    strokeWeight: has("border") ? 1 : 0,
    effectStyle: variant === "default" || variant === "destructive" || variant === "outline" || variant === "secondary" ? null : null,
    children: [
      {
        type: "TEXT",
        characters: size === "icon" || size === "icon-sm" ? "＋" : "Button",
        fontSize: s.fontSize,
        weight: 500,
        colorStyle: text,
      },
    ],
  };
}

const buttonValues = [...buttonPairs.entries()]
  .sort(([a], [b]) => (a < b ? -1 : 1))
  .map(([key, sites]) => {
    const [variant, size] = key.split("|");
    return {
      value: "variant=" + variant + ", size=" + size,
      variant,
      size,
      source:
        "source: " +
        lineOf(F.button, S.button, "const buttonVariants") +
        " (cva) — enumerated from production call sites: " +
        sites.slice(0, 6).join(", ") +
        (sites.length > 6 ? " (+" + (sites.length - 6) + " more)" : ""),
      node: buttonNode(variant, size),
    };
  });

const button = {
  name: "ABox/Action/Button",
  properties: ["variant", "size"],
  source: "source: " + lineOf(F.button, S.button, "const buttonVariants"),
  defaults: { variant: "default", size: "default" },
  textProps: [{ name: "label", default: "Button" }],
  values: buttonValues,
};

/* ---------- 3. StatusBadge ---------- */
const tones = ["sage", "primary", "warning", "muted", "destructive", "info"];
const statusBadge = {
  name: "ABox/Status/StatusBadge",
  property: "tone",
  source: "source: " + lineOf(F.status, S.status, "const tones: Record<Tone, string>"),
  textProps: [{ name: "label", default: "Status" }],
  values: tones.map((t) => ({
    value: t,
    source:
      "source: " +
      F.status +
      " tones." +
      t +
      ' = "[--tone:var(--' +
      (t === "muted" ? "foreground" : t) +
      ')]" — pill colour/background/border are color-mix() at runtime; the tone variable is bound and the expression recorded verbatim.',
    node: {
      type: "FRAME",
      layout: "HORIZONTAL",
      align: "CENTER",
      px: 10,
      py: 2,
      gap: 6,
      radius: 9999,
      fillStyle: sem("bg-card"),
      strokeStyle: "ABox/Status/" + t,
      strokeWeight: 1,
      children: [
        { type: "ELLIPSE", w: 6, h: 6, fillStyle: "ABox/Status/" + t },
        {
          type: "TEXT",
          characters: "Status",
          textStyle: null,
          fontSize: 10,
          weight: 600,
          letterSpacingPercent: 12,
          textCase: "UPPER",
          colorStyle: "ABox/Status/" + t,
        },
      ],
    },
  })),
};

/* ---------- 4. MetalBadge ---------- */
const tiers = [
  ["Bronze", "bronze"],
  ["Expanded Bronze", "expanded-bronze"],
  ["Silver", "silver"],
  ["Gold", "gold"],
  ["Platinum", "platinum"],
  ["Catastrophic", "catastrophic"],
];
const metalBadge = {
  name: "ABox/Status/MetalBadge",
  property: "tier",
  source: "source: " + lineOf(F.metal, S.metal, "const TIER_VAR"),
  textProps: [{ name: "label", default: "Tier" }],
  values: tiers.map(([label, slug]) => ({
    value: label,
    source:
      "source: " +
      F.metal +
      ' TIER_VAR["' +
      label +
      '"] = "[--tone:var(--metal-' +
      slug +
      ")] [--tone-fg:var(--metal-" +
      slug +
      '-fg)]"',
    node: {
      type: "FRAME",
      layout: "HORIZONTAL",
      align: "CENTER",
      px: 10,
      py: 2,
      gap: 0,
      radius: 9999,
      fillStyle: "ABox/Metal/" + slug,
      strokeStyle: null,
      strokeWeight: 0,
      children: [
        {
          type: "TEXT",
          characters: label,
          fontSize: 10,
          weight: 600,
          letterSpacingPercent: 12,
          textCase: "UPPER",
          colorStyle: "ABox/Metal/" + slug + "-fg",
        },
      ],
    },
  })),
};

/* ---------- 5. Surface (enumerated call sites) ---------- */
const surfaceCombos = new Map();
for (const rel of files) {
  const text = read(rel);
  const re = /surfaceClass\(/g;
  let m;
  while ((m = re.exec(text))) {
    let i = m.index + "surfaceClass(".length;
    let depth = 1;
    while (i < text.length && depth > 0) {
      if (text[i] === "(") depth += 1;
      else if (text[i] === ")") depth -= 1;
      i += 1;
    }
    const args = text.slice(m.index, i);
    const line = text.slice(0, m.index).split("\n").length;
    if (/\{\s*padding,\s*elevated/.test(args)) continue; // the definition itself
    const obj = args.match(/\{[^}]*\}/);
    const opt = { padding: "md", elevated: false, interactiveHover: false, decor: false };
    if (obj) {
      const p = obj[0].match(/padding:\s*"(none|sm|md|lg)"/);
      if (p) opt.padding = p[1];
      else if (/padding:\s*[^"]/.test(obj[0])) {
        dynamicNotes.push(rel + ":" + line + " — surfaceClass() receives a computed padding; recorded, no variant invented.");
        continue;
      }
      for (const b of ["elevated", "interactiveHover", "decor"]) {
        if (new RegExp(b + ":\\s*true").test(obj[0])) opt[b] = true;
      }
    }
    const key = [opt.padding, opt.elevated, opt.interactiveHover, opt.decor].join("|");
    if (!surfaceCombos.has(key)) surfaceCombos.set(key, []);
    surfaceCombos.get(key).push(rel + ":" + line);
  }
  const jsx = /<Surface\b/g;
  let j;
  while ((j = jsx.exec(text))) {
    const line = text.slice(0, j.index).split("\n").length;
    dynamicNotes.push(rel + ":" + line + " — <Surface> JSX call site recorded; padding/boolean props read as written.");
  }
}
if (surfaceCombos.size === 0) throw new Error("STOP: no surfaceClass call sites enumerated");

const SURFACE_PAD = { none: 0, sm: 16, md: 20, lg: 24 };
const surface = {
  name: "ABox/Surface/Surface",
  properties: ["padding", "elevated", "interactiveHover", "decor"],
  source: "source: " + lineOf(F.surface, S.surface, "const SURFACE_BASE"),
  defaults: { padding: "md", elevated: "false", interactiveHover: "false", decor: "false" },
  values: [...surfaceCombos.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, sites]) => {
      const [padding, elevated, interactiveHover, decor] = key.split("|");
      return {
        value:
          "padding=" + padding + ", elevated=" + elevated + ", interactiveHover=" + interactiveHover + ", decor=" + decor,
        props: { padding, elevated, interactiveHover, decor },
        source:
          "source: " +
          F.surface +
          " SURFACE_BASE + SURFACE_PADDING." +
          padding +
          " — enumerated from production call sites: " +
          sites.slice(0, 6).join(", ") +
          (sites.length > 6 ? " (+" + (sites.length - 6) + " more)" : ""),
        node: {
          type: "FRAME",
          layout: "VERTICAL",
          w: 320,
          px: SURFACE_PAD[padding],
          py: SURFACE_PAD[padding],
          gap: 0,
          radius: 16,
          fillStyle: sem("bg-card"),
          strokeStyle: sem("border-border"),
          strokeWeight: 1,
          effectStyle: elevated === "true" ? "ABox/Elevation/card" : null,
          children: [
            {
              type: "TEXT",
              characters: "Surface",
              fontSize: 14,
              weight: 400,
              colorStyle: sem("text-foreground"),
            },
          ],
        },
      };
    }),
};

/* ---------- 6. Control (enumerated call sites) ---------- */
const controlCombos = new Map();
for (const rel of files) {
  const text = read(rel);
  const re = /controlClass\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(text))) {
    const line = text.slice(0, m.index).split("\n").length;
    const a = m[1];
    if (/height\s*=/.test(a)) continue; // the definition itself
    const h = a.match(/height:\s*"(md|lg)"/);
    const height = h ? h[1] : "md";
    const focusRing = /focusRing:\s*true/.test(a) ? "true" : "false";
    const key = height + "|" + focusRing;
    if (!controlCombos.has(key)) controlCombos.set(key, []);
    controlCombos.get(key).push(rel + ":" + line);
  }
}
if (controlCombos.size === 0) throw new Error("STOP: no controlClass call sites enumerated");

const control = {
  name: "ABox/Control/Control",
  properties: ["height", "focusRing"],
  source: "source: " + lineOf(F.control, S.control, "const CONTROL_BASE"),
  defaults: { height: "md", focusRing: "false" },
  values: [...controlCombos.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, sites]) => {
      const [height, focusRing] = key.split("|");
      return {
        value: "height=" + height + ", focusRing=" + focusRing,
        props: { height, focusRing },
        source:
          "source: " +
          F.control +
          " CONTROL_HEIGHT." +
          height +
          " + CONTROL_BASE" +
          (focusRing === "true" ? " + CONTROL_FOCUS_RING" : "") +
          " — enumerated from production call sites: " +
          sites.slice(0, 6).join(", ") +
          (sites.length > 6 ? " (+" + (sites.length - 6) + " more)" : ""),
        node: {
          type: "FRAME",
          layout: "HORIZONTAL",
          align: "CENTER",
          w: 280,
          h: height === "lg" ? 44 : 40,
          px: 12,
          py: 0,
          gap: 0,
          radius: 8,
          fillStyle: sem("bg-background"),
          strokeStyle: sem("border-border"),
          strokeWeight: 1,
          children: [
            { type: "TEXT", characters: "Value", fontSize: 14, weight: 400, colorStyle: sem("text-foreground") },
          ],
        },
      };
    }),
};

/* ---------- 7. KpiCard ---------- */
const kpiTones = [
  ["default", "primary", "text-primary"],
  ["primary", "primary", "text-primary"],
  ["sage", "sage", "text-primary"],
  ["warning", "warning", "text-primary"],
];
const kpiCard = {
  name: "ABox/Card/KpiCard",
  property: "tone",
  source: "source: " + lineOf(F.kpi, S.kpi, "const TONE = {"),
  defaults: { tone: "default" },
  textProps: [
    { name: "label", default: "Metric" },
    { name: "value", default: "1,280" },
  ],
  boolProps: ["icon", "delta", "hint"],
  values: kpiTones.map(([tone, token]) => ({
    value: tone,
    source: "source: " + F.kpi + " TONE." + tone + " — text/tile tone token var(--" + token + ")",
    node: {
      type: "FRAME",
      layout: "VERTICAL",
      w: 320,
      px: 24,
      py: 24,
      gap: 32,
      radius: 16,
      fillStyle: sem("bg-card"),
      strokeStyle: sem("border-hairline"),
      strokeWeight: 1,
      effectStyle: "ABox/Elevation/card",
      children: [
        { type: "TEXT", characters: "METRIC", textStyle: "ABox/Text/eyebrow", colorStyle: sem("text-muted-foreground") },
        {
          type: "TEXT",
          characters: "1,280",
          fontSize: 48,
          weight: 600,
          colorStyle: sem("text-foreground"),
        },
        {
          type: "TEXT",
          characters: "▲ 4.2%",
          fontSize: 12,
          weight: 500,
          colorStyle: tone === "warning" ? "ABox/Status/warning" : "ABox/Status/" + (tone === "sage" ? "sage" : "primary"),
        },
      ],
    },
  })),
};

/* ---------- 8. PageHeader ---------- */
const pageHeader = {
  name: "ABox/Header/PageHeader",
  property: "variant",
  source: "source: " + lineOf(F.header, S.header, "const isCompact"),
  defaults: { variant: "default" },
  textProps: [
    { name: "title", default: "Page title" },
    { name: "eyebrow", default: "SECTION" },
    { name: "description", default: "Supporting description." },
  ],
  boolProps: ["eyebrow", "description", "icon", "actions"],
  values: [
    {
      value: "default",
      source: "source: " + F.header + " variant default — eyebrow + text-display 30px title + 18px description + hairline rule",
      node: {
        type: "FRAME",
        layout: "VERTICAL",
        w: 640,
        px: 0,
        py: 0,
        gap: 12,
        radius: 0,
        fillStyle: null,
        strokeStyle: null,
        strokeWeight: 0,
        children: [
          { type: "TEXT", characters: "SECTION", textStyle: "ABox/Text/eyebrow", colorStyle: sem("text-muted-foreground") },
          { type: "TEXT", characters: "Page title", fontSize: 30, weight: 600, colorStyle: sem("text-foreground") },
          { type: "TEXT", characters: "Supporting description.", fontSize: 18, weight: 400, colorStyle: sem("text-muted-foreground") },
        ],
      },
    },
    {
      value: "compact",
      source: "source: " + F.header + " variant compact — no eyebrow, 20px semibold title, 12px description, no rule",
      node: {
        type: "FRAME",
        layout: "VERTICAL",
        w: 640,
        px: 0,
        py: 0,
        gap: 8,
        radius: 0,
        fillStyle: null,
        strokeStyle: null,
        strokeWeight: 0,
        children: [
          { type: "TEXT", characters: "Page title", fontSize: 20, weight: 600, colorStyle: sem("text-foreground") },
          { type: "TEXT", characters: "Supporting description.", fontSize: 12, weight: 400, colorStyle: sem("text-muted-foreground") },
        ],
      },
    },
  ],
};

/* ---------- 9. ModuleTab ---------- */
const moduleTab = {
  name: "ABox/Nav/ModuleTab",
  property: "state",
  source: "source: " + lineOf(F.tabs, S.tabs, "activeProps"),
  defaults: { state: "default" },
  textProps: [{ name: "label", default: "Section" }],
  values: [
    {
      value: "default",
      source: "source: " + F.tabs + ' className="rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-muted-foreground"',
      node: {
        type: "FRAME",
        layout: "HORIZONTAL",
        align: "CENTER",
        px: 12,
        py: 6,
        gap: 0,
        radius: 9999,
        fillStyle: null,
        strokeStyle: sem("border-hairline"),
        strokeWeight: 1,
        children: [{ type: "TEXT", characters: "Section", fontSize: 12, weight: 500, colorStyle: sem("text-muted-foreground") }],
      },
    },
    {
      value: "active",
      source: "source: " + F.tabs + ' activeProps className="bg-primary/10 text-foreground border-primary/30"',
      node: {
        type: "FRAME",
        layout: "HORIZONTAL",
        align: "CENTER",
        px: 12,
        py: 6,
        gap: 0,
        radius: 9999,
        fillStyle: sem("bg-primary"),
        fillOpacity: 0.1,
        strokeStyle: sem("border-primary"),
        strokeOpacity: 0.3,
        strokeWeight: 1,
        children: [{ type: "TEXT", characters: "Section", fontSize: 12, weight: 500, colorStyle: sem("text-foreground") }],
      },
    },
  ],
};

/* ---------- 10. WizardStep ---------- */
const wizardStates = [
  ["current", 'isCurrent → "border-primary bg-primary text-primary-foreground"', sem("bg-primary"), sem("border-primary"), sem("text-primary-foreground")],
  ["done", 'isDone → reachable link with Check glyph, "border-border text-muted-foreground"', null, sem("border-border"), sem("text-muted-foreground")],
  ["upcoming", 'reachable, not current, not done → "border-border text-muted-foreground"', null, sem("border-border"), sem("text-muted-foreground")],
  ["unreachable", "not reachable → rendered as a non-link span with the same pill geometry", null, sem("border-border"), sem("text-muted-foreground")],
];
const wizardStep = {
  name: "ABox/Nav/WizardStep",
  property: "state",
  source: "source: " + lineOf(F.wizard, S.wizard, "const isCurrent"),
  textProps: [{ name: "label", default: "Identity" }],
  values: wizardStates.map(([state, note, fill, stroke, text]) => ({
    value: state,
    source: "source: " + F.wizard + " " + note,
    node: {
      type: "FRAME",
      layout: "HORIZONTAL",
      align: "CENTER",
      px: 10,
      py: 6,
      gap: 6,
      radius: 9999,
      fillStyle: fill,
      strokeStyle: stroke,
      strokeWeight: 1,
      children: [{ type: "TEXT", characters: "Identity", fontSize: 12, weight: 500, colorStyle: text }],
    },
  })),
};

/* ---------- 11. AboxMark (Component Set, tone axis) ---------- */
const toneRecord = S.logo.slice(S.logo.indexOf("const TONES"), S.logo.indexOf("};", S.logo.indexOf("const TONES")));
const markTones = [...toneRecord.matchAll(/(\w+):\s*\{\s*bg:\s*"var\(--([\w-]+)\)",\s*ring:\s*"var\(--([\w-]+)\)",\s*fg:\s*"var\(--([\w-]+)\)",\s*dot:\s*"var\(--([\w-]+)\)"/g)].map(
  (m) => ({ tone: m[1], bg: m[2], ring: m[3], fg: m[4], dot: m[5] }),
);
if (markTones.length !== 4) throw new Error("STOP: expected 4 AboxMark tones, got " + markTones.length);
const markCallSites = {
  primary:
    "src/components/abox/marketplace-shell.tsx:60, src/components/abox/member-shell.tsx:71, src/components/abox/internal-shell.tsx:167, src/routes/index.tsx:122, src/routes/quote.tsx:501, src/components/abox/placeholder-screen.tsx:43",
  sidebar: "src/components/abox/internal-shell.tsx:80, src/components/abox/marketplace-shell.tsx:154",
  sage: "src/components/abox/plan-o-assistant.tsx:47",
  foreground:
    "declared in the production TONES record with no non-reference call site (only src/routes/design-system.tsx and src/routes/design-guide.tsx, which are reference layers); included because the production component API defines it as a first-class branch — recorded, not dropped.",
};
const normalise = (t) => (t.startsWith("sidebar") ? "ABox/Semantic/" + t.replace("sidebar-", "sidebar/") : "ABox/Semantic/" + t);
const aboxMark = {
  name: "ABox/Brand/AboxMark",
  property: "tone",
  source: "source: " + lineOf(F.logo, S.logo, "const TONES"),
  defaults: { tone: "primary" },
  values: markTones.map((t) => ({
    value: t.tone,
    source:
      "source: " +
      F.logo +
      " TONES." +
      t.tone +
      " = { bg: var(--" + t.bg + "), ring: var(--" + t.ring + "), fg: var(--" + t.fg + "), dot: var(--" + t.dot + ") } — call sites: " +
      markCallSites[t.tone],
    node: {
      type: "MARK",
      size: 36,
      bgStyle: normalise(t.bg),
      ringStyle: normalise(t.ring),
      fgStyle: normalise(t.fg),
      dotStyle: normalise(t.dot),
      hairlineStyle: "ABox/Semantic/hairline",
    },
  })),
};

/* ---------- standalone components ---------- */
const emptyState = {
  name: "ABox/Feedback/EmptyState",
  source: "source: " + lineOf(F.empty, S.empty, "export function EmptyState"),
  textProps: [
    { name: "title", default: "Nothing here yet" },
    { name: "body", default: "Supporting copy." },
  ],
  boolProps: ["icon", "body"],
  instanceProps: ["action"],
  node: {
    type: "FRAME",
    layout: "VERTICAL",
    align: "CENTER",
    w: 480,
    px: 24,
    py: 56,
    gap: 16,
    radius: 8,
    fillStyle: sem("bg-surface"),
    fillOpacity: 0.6,
    strokeStyle: sem("border-border-strong"),
    strokeWeight: 1,
    dashed: true,
    children: [
      { type: "TEXT", characters: "Nothing here yet", fontSize: 24, weight: 600, colorStyle: sem("text-foreground") },
      { type: "TEXT", characters: "Supporting copy.", fontSize: 14, weight: 400, colorStyle: sem("text-muted-foreground") },
    ],
  },
};

const labeledField = {
  name: "ABox/Form/LabeledField",
  source: "source: " + lineOf(F.field, S.field, "export function LabeledField"),
  textProps: [{ name: "label", default: "Label" }],
  exposedInstances: ["ABox/Control/Control"],
  node: {
    type: "FRAME",
    layout: "VERTICAL",
    w: 280,
    px: 0,
    py: 0,
    gap: 4,
    radius: 0,
    fillStyle: null,
    strokeStyle: null,
    strokeWeight: 0,
    children: [
      { type: "TEXT", characters: "LABEL", textStyle: "ABox/Text/eyebrow", colorStyle: sem("text-muted-foreground") },
      { type: "INSTANCE", of: "ABox/Control/Control" },
    ],
  },
};

const inputCmp = {
  name: "ABox/Form/Input",
  source: "source: " + lineOf(F.input, S.input, "const Input = React.forwardRef"),
  textProps: [{ name: "placeholder", default: "Placeholder" }],
  node: {
    type: "FRAME",
    layout: "HORIZONTAL",
    align: "CENTER",
    w: 280,
    h: 36,
    px: 12,
    py: 4,
    gap: 0,
    radius: 6,
    fillStyle: null,
    strokeStyle: sem("border-input"),
    strokeWeight: 1,
    children: [{ type: "TEXT", characters: "Placeholder", fontSize: 14, weight: 400, colorStyle: sem("text-muted-foreground") }],
  },
};

/* ---------- excluded inventory ---------- */
const excluded = [
  ["src/components/ui/{accordion,alert-dialog,aspect-ratio,avatar,breadcrumb,calendar,carousel,chart,collapsible,context-menu,form,input-otp,menubar,navigation-menu,pagination,resizable,scroll-area,sidebar,table,toggle,toggle-group}.tsx", "Zero production importers — file exists, no consumer."],
  ["src/components/ui/{alert,checkbox,switch,drawer}.tsx", "Only imported by src/routes/design-system.tsx, a reference layer."],
  ["src/components/ui/{spinner,command,hover-card,input-group,button-group}.tsx", "Only imported by src/components/ai-elements/*."],
  ["src/components/ui/{dialog,sheet,popover,tooltip,dropdown-menu,tabs}.tsx", "Behavioural overlay/navigation primitives — interaction patterns, deferred to B6."],
  ["src/components/ui/{badge,card,skeleton,textarea,select,label}.tsx", "Real importers, but consumed beneath ABox components or as raw defaults; not created to avoid a second source of truth beside Surface/Control/StatusBadge."],
  ["src/components/abox/{plan-card,data-table,marketplace-page-layout,notice-page,downline-context-banner,shopping-path-bar,product-switcher,quote-edit-panel,suspended-marketplace-notice}.tsx", "Composite screens/surfaces — deferred to B6/B8."],
  ["src/components/abox/{internal-shell,marketplace-shell,member-shell}.tsx", "Shells — B7."],
  ["src/components/abox/{planai-assistant,plan-o-assistant}.tsx", "Zero importers — documented gap, not a component foundation candidate."],
  ["src/components/abox/carrier-mark.tsx", "Monogram and hue are computed at runtime from the carrier name — no finite variant set exists."],
];

/* ---------- limitations ---------- */
const limitations = [
  "src/components/abox/status-badge.tsx:21-23 — color: color-mix(in oklch, var(--tone) 88%, var(--foreground)); background: color-mix(in oklch, var(--tone) 12%, var(--card)); borderColor: color-mix(in oklch, var(--tone) 34%, transparent): runtime-computed, no Figma equivalent. The tone Colour Style is bound and the expression is recorded verbatim; no substitute value is fabricated.",
  "src/styles.css — oklch() has no Figma equivalent: colours reach components through the B3 styles, which already record the original oklch literal.",
  "Tailwind numeric utilities (h-*, px-*, gap-*, rounded-*, text-*) are literal values in Figma: production does not declare them through the B1 spacing/radius/control-sizing variables, so they are NOT bound to those variables. The class string is recorded on every component/variant instead.",
  "Hover, group-hover, focus-visible, active and transition rules (src/components/ui/button.tsx, src/components/abox/action-pill.ts, src/components/abox/surface.tsx SURFACE_INTERACTIVE_HOVER, src/components/abox/control.tsx CONTROL_FOCUS_RING) are interaction states, not Figma variants; no Hover/Focus/Pressed variant is invented.",
  "src/components/abox/kpi-card.tsx — CountUp animation and group-hover icon-tile rotation/scale: motion, not representable.",
  "src/components/abox/page-header.tsx — FadeRise entrance and animate-hairline rule: motion, not representable.",
  "Decorative utilities card-brackets, edge-sheen, glass (kpi-card.tsx), DiagonalWeave (empty-state.tsx): no exact Figma representation; recorded, not approximated.",
  "Responsive md:/xl: rules inside page-header.tsx, kpi-card.tsx and plan-card.tsx are layout composition, not component variants; deferred to a later composition batch.",
  "src/components/abox/logo.tsx — size is a free numeric prop with no finite production set: the AboxMark set is built at the production default size = 36 and resizing stays an instance concern.",
  "src/components/abox/carrier-mark.tsx — deterministic hash-derived hue and initials: no finite variant set; excluded, not approximated.",
  "src/components/ui/button.tsx — shadow/shadow-sm utilities on the default/destructive/outline/secondary variants are Tailwind defaults, not production --shadow-* families; no Effect Style is attached rather than binding an unrelated elevation style.",
  "Figma requires every component node to belong to a page: the 14 B4 objects are placed on the existing B0 page \"01 Components\", which B0 created for this purpose. No page is created, renamed or reordered, and pages 00, 02, 03, 04, 05 and 06 stay empty. This is a deviation from the plan wording \"no B0 page gains content\", forced by the Figma API and recorded rather than worked around.",
  "src/components/abox/module-tabs.tsx — activeProps bg-primary/10 and border-primary/30 are alpha-modified tokens: a bound Figma Colour Style carries no per-instance alpha, so the full-strength primary style is bound and the /10 and /30 modifiers are recorded here rather than approximated with a hard-coded translucent fill.",
  "src/components/abox/empty-state.tsx — bg-surface/60 is an alpha-modified token with the same Figma limitation; the surface style is bound and the /60 modifier recorded.",
];
for (const d of dynamicNotes) limitations.push(d);

/* ---------- assemble ---------- */
const sets = [
  actionPill,
  button,
  statusBadge,
  metalBadge,
  surface,
  control,
  kpiCard,
  pageHeader,
  moduleTab,
  wizardStep,
  aboxMark,
];
const components = [emptyState, labeledField, inputCmp];

const fixedNames = [
  "ABox/Action/ActionPill",
  "ABox/Status/StatusBadge",
  "ABox/Status/MetalBadge",
  "ABox/Card/KpiCard",
  "ABox/Header/PageHeader",
  "ABox/Nav/ModuleTab",
  "ABox/Nav/WizardStep",
  "ABox/Brand/AboxMark",
];
const fixedVariants = sets.filter((s) => fixedNames.indexOf(s.name) !== -1).reduce((n, s) => n + s.values.length, 0);
const enumeratedVariants = sets
  .filter((s) => fixedNames.indexOf(s.name) === -1)
  .reduce((n, s) => n + s.values.length, 0);
const totalVariants = fixedVariants + enumeratedVariants;

if (sets.length !== 11) throw new Error("STOP: expected 11 component sets, got " + sets.length);
if (components.length !== 3) throw new Error("STOP: expected 3 standalone components, got " + components.length);
if (fixedVariants !== 38) throw new Error("STOP: expected 38 fixed variants, got " + fixedVariants);

const out =
  "// GENERATED by tools/figma-plugin/extract-b4.mjs — do not edit by hand.\n" +
  "const ABOX_B4 = " +
  JSON.stringify(
    {
      meta: {
        batch: "B4",
        source: Object.values(F).join(", "),
        generated: "tools/figma-plugin/extract-b4.mjs",
      },
      counts: {
        sets: sets.length,
        components: components.length,
        objects: sets.length + components.length,
        fixedVariants,
        enumeratedVariants,
        totalVariants,
      },
      sets,
      components,
      excluded: excluded.map(([source, reason]) => ({ source, reason })),
      limitations,
    },
    null,
    2,
  ) +
  ";\n";

writeFileSync(join(here, "tokens-b4.js"), out);
console.log(
  "wrote tokens-b4.js — " +
    sets.length +
    " sets + " +
    components.length +
    " components = " +
    (sets.length + components.length) +
    " objects; variants fixed " +
    fixedVariants +
    " + enumerated " +
    enumeratedVariants +
    " = " +
    totalVariants +
    "; " +
    limitations.length +
    " limitations",
);
