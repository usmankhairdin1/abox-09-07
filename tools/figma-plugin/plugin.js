// ABox Figma Proof — plugin logic.
// Concatenated with tokens.js into code.js by build.mjs.
// Creates exactly four native objects and verifies their structure.

const T = ABOX_TOKENS;

/* ---------- oklch -> sRGB (Figma has no oklch colour space) ---------- */
function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const bb = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bb;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bb;
  const s_ = L - 0.0894841775 * a - 1.291485548 * bb;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const enc = (v) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, c));
  };
  return { r: enc(lr), g: enc(lg), b: enc(lb) };
}
const tokenRgb = (name) => {
  const t = T.color[name];
  return oklchToRgb(t.oklch[0], t.oklch[1], t.oklch[2]);
};
const mix = (a, b, amount) => ({
  r: a.r * amount + b.r * (1 - amount),
  g: a.g * amount + b.g * (1 - amount),
  b: a.b * amount + b.b * (1 - amount),
});

/* ---------- helpers ---------- */
const lines = [];
const say = (s) => lines.push(s);
const report = () => figma.ui.postMessage({ type: "report", text: lines.join("\n") });

const normalizeFontStyle = (style) => style.toLowerCase().replace(/[\s_-]/g, "");
const fontLabel = (font) => {
  const variation = font.variationSettings && font.variationSettings.wght;
  return font.family + " / " + font.style + (variation ? " / wght " + variation : "");
};

async function resolveFont(spec, role) {
  const available = await figma.listAvailableFontsAsync();
  const familyFonts = available
    .map((entry) => entry.fontName)
    .filter((font) => font.family === spec.family);
  const availableStyles = [...new Set(familyFonts.map((font) => font.style))].sort();

  say(
    "font family: " +
      spec.family +
      " (" +
      role +
      ", required weight " +
      spec.weight +
      ")",
  );
  say("font styles: " + (availableStyles.length ? availableStyles.join(", ") : "NONE"));

  if (!familyFonts.length) {
    throw new Error(
      'STOP: font family "' + spec.family + '" is not available. No substitution is permitted.',
    );
  }

  const allowedNames = new Set(spec.styleNames.map(normalizeFontStyle));
  const named = familyFonts.find((font) => allowedNames.has(normalizeFontStyle(font.style)));
  if (named) {
    try {
      await figma.loadFontAsync(named);
      say("font resolved: " + fontLabel(named));
      return named;
    } catch (e) {
      throw new Error(
        'STOP: Figma listed but could not load "' +
          fontLabel(named) +
          '". No substitution is permitted. Figma error: ' +
          String((e && e.message) || e),
      );
    }
  }

  const getAxes = figma.getFontFamilyVariationAxes;
  const axes = typeof getAxes === "function" ? getAxes.call(figma, spec.family) : null;
  say("font axes  : " + (axes && axes.length ? axes.join(", ") : "NONE"));
  if (axes && axes.includes("wght")) {
    const regular = familyFonts.find((font) => normalizeFontStyle(font.style) === "regular");
    const base = regular || familyFonts[0];
    const variableFont = {
      family: spec.family,
      style: base.style,
      variationSettings: { wght: spec.weight },
    };
    try {
      await figma.loadFontAsync({ family: spec.family });
      say("font resolved: " + fontLabel(variableFont));
      return variableFont;
    } catch (e) {
      throw new Error(
        'STOP: variable font "' +
          spec.family +
          '" could not load at wght ' +
          spec.weight +
          ". No substitution is permitted. Figma error: " +
          String((e && e.message) || e),
      );
    }
  }

  throw new Error(
    'STOP: font family "' +
      spec.family +
      '" is available, but no exact native representation for weight ' +
      spec.weight +
      " was found. Available styles: " +
      availableStyles.join(", ") +
      ". No substitution is permitted.",
  );
}

async function resolveProofFonts() {
  const body = await resolveFont(T.typography["ABox/Body/Base"], "body");
  const badge = await resolveFont(T.statusBadge.text, "StatusBadge");
  return { body, badge };
}

async function loadFont(font) {
  try {
    await figma.loadFontAsync(font);
    return font;
  } catch (e) {
    throw new Error(
      'STOP: font "' +
        fontLabel(font) +
        '" is not available. No substitution is permitted. Figma error: ' +
        String((e && e.message) || e),
    );
  }
}

/* ---------- 1. colour variable ---------- */
async function ensureVariable() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = collections.find((c) => c.name === "ABox/Color/Semantic");
  if (!collection) {
    collection = figma.variables.createVariableCollection("ABox/Color/Semantic");
    collection.renameMode(collection.modes[0].modeId, "Light");
  }
  const modeId = collection.modes[0].modeId;
  const existing = await figma.variables.getLocalVariablesAsync("COLOR");
  let variable = existing.find(
    (v) => v.name === "background/base" && v.variableCollectionId === collection.id,
  );
  if (!variable) {
    variable = figma.variables.createVariable("background/base", collection, "COLOR");
  }
  variable.setValueForMode(modeId, tokenRgb("background/base"));
  variable.description = "abox/styles.css --background (oklch converted to sRGB)";
  say("variable   : ABox/Color/Semantic / background/base");
  return { collection, variable, modeId };
}

/* ---------- 2. text style ---------- */
async function ensureTextStyle(resolvedFont) {
  const spec = T.typography["ABox/Body/Base"];
  const font = await loadFont(resolvedFont);
  const styles = await figma.getLocalTextStylesAsync();
  let style = styles.find((s) => s.name === "ABox/Body/Base");
  if (!style) style = figma.createTextStyle();
  style.name = "ABox/Body/Base";
  style.fontName = font;
  style.fontSize = spec.size;
  style.lineHeight = { unit: "PERCENT", value: spec.lineHeightPercent };
  style.letterSpacing = { unit: "PERCENT", value: spec.letterSpacingPercent };
  style.description = "abox/styles.css --font-sans body role";
  say("text style : ABox/Body/Base");
  return style;
}

/* ---------- 3 + 4. component and variant ---------- */
async function buildToneVariant(tone, font) {
  const b = T.statusBadge;
  const toneRgb = tokenRgb(b.toneVar[tone]);
  const fg = tokenRgb("foreground/base");
  const card = tokenRgb("card/base");

  const component = figma.createComponent();
  component.name = "tone=" + tone;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.paddingLeft = b.paddingX;
  component.paddingRight = b.paddingX;
  component.paddingTop = b.paddingY;
  component.paddingBottom = b.paddingY;
  component.itemSpacing = b.gap;
  component.cornerRadius = b.cornerRadius;
  component.fills = [{ type: "SOLID", color: mix(toneRgb, card, b.mix.background) }];
  component.strokeWeight = b.borderWidth;
  component.strokes = [{ type: "SOLID", color: toneRgb, opacity: b.mix.border }];

  const dot = figma.createEllipse();
  dot.name = "dot";
  dot.resize(b.dotSize, b.dotSize);
  dot.fills = [{ type: "SOLID", color: toneRgb }];
  component.appendChild(dot);

  const text = figma.createText();
  text.name = "label";
  text.fontName = font;
  text.fontSize = b.text.size;
  text.letterSpacing = { unit: "PERCENT", value: b.text.letterSpacingEm * 100 };
  text.characters = tone.toUpperCase();
  text.fills = [{ type: "SOLID", color: mix(toneRgb, fg, b.mix.text) }];
  component.appendChild(text);

  return component;
}

async function ensureComponentSet(resolvedFont) {
  const b = T.statusBadge;
  const font = await loadFont(resolvedFont);

  const page = figma.currentPage;
  await page.loadAsync();
  const previous = page.findOne((n) => n.name === "ABox/StatusBadge");
  if (previous) previous.remove(); // idempotent: rebuild in place, never duplicate

  const variants = [];
  for (const tone of b.proofTones) variants.push(await buildToneVariant(tone, font));
  const set = figma.combineAsVariants(variants, page);
  set.name = "ABox/StatusBadge";
  set.description = b.traceabilityId + " — source " + b.source;
  set.layoutMode = "VERTICAL";
  set.itemSpacing = 12;
  set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 16;
  set.x = 0;
  set.y = 0;
  say("component  : ABox/StatusBadge (COMPONENT_SET)");
  say("variant    : tone = " + b.proofTones.join(", "));
  return set;
}

/* ---------- structural verification ---------- */
const hasExactFont = (font, spec) => {
  if (!font || font === figma.mixed || font.family !== spec.family) return false;
  if (font.variationSettings && font.variationSettings.wght === spec.weight) return true;
  return spec.styleNames.map(normalizeFontStyle).includes(normalizeFontStyle(font.style));
};

async function verify() {
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collection = collections.find((c) => c.name === "ABox/Color/Semantic");
  const vars = await figma.variables.getLocalVariablesAsync("COLOR");
  const variable = vars.find(
    (v) => v.name === "background/base" && collection && v.variableCollectionId === collection.id,
  );
  add(
    !!variable && !!collection && collection.modes.length > 0 && variable.resolvedType === "COLOR",
    "variable resolves in collection with a mode",
  );

  const styles = await figma.getLocalTextStylesAsync();
  const bodySpec = T.typography["ABox/Body/Base"];
  add(
    styles.some(
      (s) =>
        s.name === "ABox/Body/Base" &&
        s.fontSize === bodySpec.size &&
        hasExactFont(s.fontName, bodySpec),
    ),
    "text style exists with exact Inter Tight 400 font settings",
  );

  await figma.currentPage.loadAsync();
  const set = figma.currentPage.findOne((n) => n.name === "ABox/StatusBadge");
  add(!!set && set.type === "COMPONENT_SET", "component set node type is COMPONENT_SET");

  const first = set && set.children[0];
  add(
    !!first &&
      first.type === "COMPONENT" &&
      first.layoutMode !== "NONE" &&
      first.findOne((n) => n.type === "TEXT") !== null,
    "component is native, uses Auto Layout, contains editable text",
  );

  const variants = set && set.type === "COMPONENT_SET" ? set.children : [];
  const labels = variants.map((variant) => variant.findOne((n) => n.type === "TEXT"));
  add(
    variants.length === 2 &&
      variants.every((variant) => variant.type === "COMPONENT") &&
      labels.every((label) => label && label.type === "TEXT" && hasExactFont(label.fontName, T.statusBadge.text)),
    "two native variants carry editable Inter Tight 600 labels",
  );

  const defs = set ? set.componentPropertyDefinitions : {};
  const toneDef = defs["tone"];
  add(
    !!toneDef && toneDef.type === "VARIANT" && toneDef.variantOptions.length === 2,
    "variant property 'tone' exposes two options",
  );

  const flat = figma.currentPage.findAll(
    (n) =>
      Array.isArray(n.fills) && n.fills.some((f) => f && f.type === "IMAGE"),
  );
  add(flat.length === 0, "no image fills anywhere on the page (nothing flattened)");

  say("");
  say("STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say(passed ? "RESULT: PROOF PASSED" : "RESULT: PROOF FAILED — do not proceed to Phase 52.");
  return passed;
}

/* ---------- Phase 52 / Batch B0: library foundation pages ---------- */
function requireFile(expectedName) {
  if (figma.root.name !== expectedName) {
    throw new Error(
      'STOP: wrong target file. Expected "' +
        expectedName +
        '" but this file is "' +
        figma.root.name +
        '". Nothing was changed.',
    );
  }
}

async function ensureLibraryPages() {
  // dynamic-page document access: page.children requires explicit page loading.
  await figma.loadAllPagesAsync();
  const names = T.library.pages;
  const pages = figma.root.children;

  for (const name of names) {
    const matches = pages.filter((p) => p.name === name);
    if (matches.length > 1) {
      throw new Error(
        'STOP: DUPLICATE PAGE — ' +
          matches.length +
          ' pages are named "' +
          name +
          '". Resolve manually; the plugin will not guess which to delete.',
      );
    }
  }

  const resolved = names.map((name) => {
    let page = figma.root.children.find((p) => p.name === name);
    if (page) {
      say("page reused  : " + name);
    } else {
      page = figma.createPage();
      page.name = name;
      say("page created : " + name);
    }
    return page;
  });

  resolved.forEach((page, index) => figma.root.insertChild(index, page));

  say("");
  say("PAGE INVENTORY (before stray removal)");
  figma.root.children.forEach((page, index) => {
    say("  [" + index + "] " + page.name + "  id=" + page.id);
  });
  say("");

  // The Figma API refuses remove() on the currently active page. Make a required
  // page current first so no stray can ever be the active page at removal time.
  if (names.indexOf(figma.currentPage.name) === -1) {
    await figma.setCurrentPageAsync(resolved[0]);
    say("active page  : " + resolved[0].name + " (switched before stray removal)");
  }

  const strays = figma.root.children.filter((p) => names.indexOf(p.name) === -1);
  for (const stray of strays) {
    if (stray.children.length === 0 && figma.root.children.length > 1) {
      const strayName = stray.name;
      stray.remove();
      say("page removed : " + strayName + " (empty default page)");
    } else {
      say("UNEXPECTED PAGE: " + stray.name + " (not empty — left untouched)");
    }
  }


  say("");
  say("PAGE INVENTORY");
  figma.root.children.forEach((page, index) => {
    say("  [" + index + "] " + page.name + "  id=" + page.id);
  });
  return resolved;
}

async function verifyLibraryPages() {
  // dynamic-page document access: load every page once before any children access.
  await figma.loadAllPagesAsync();
  const names = T.library.pages;
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);

  add(figma.root.name === T.library.targetFileName, "file name is the library target file");

  const children = figma.root.children;
  add(
    names.every((name) => children.filter((p) => p.name === name).length === 1),
    "each of the seven pages exists exactly once",
  );
  add(
    names.every((name) => {
      const page = children.find((p) => p.name === name);
      return !!page && page.type === "PAGE";
    }),
    "every library page is a native PAGE node",
  );
  add(
    names.every((name, index) => children[index] && children[index].name === name),
    "pages occupy indices 0..6 in the declared order",
  );

  const strays = children.filter((p) => names.indexOf(p.name) === -1);
  if (strays.length) say("  unexpected pages: " + strays.map((p) => p.name).join(", "));
  add(strays.length === 0, "no unexpected extra pages in the file");

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();
  say(
    "  local objects: collections=" +
      collections.length +
      " textStyles=" +
      textStyles.length +
      " effectStyles=" +
      effectStyles.length,
  );
  add(
    collections.length === 0 && textStyles.length === 0 && effectStyles.length === 0,
    "batch B0 created no variables, text styles or effect styles",
  );

  let nodeCount = 0;
  let imageFills = 0;
  let components = 0;
  for (const page of children) {
    nodeCount += page.children.length;
    components += page.findAll((n) => n.type === "COMPONENT" || n.type === "COMPONENT_SET").length;
    imageFills += page.findAll(
      (n) => Array.isArray(n.fills) && n.fills.some((f) => f && f.type === "IMAGE"),
    ).length;
  }
  add(components === 0, "no components or component sets created by this batch");
  add(imageFills === 0, "no image fills anywhere in the file (nothing flattened)");
  say("  top-level nodes across all pages: " + nodeCount);

  say("");
  say("STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say(passed ? "RESULT: B0 PASSED" : "RESULT: B0 FAILED — do not proceed to B1.");
  say("Library publishing is NOT part of this batch and was not performed.");
  return passed;
}

/* ---------- Phase 52 / Batch B1 — foundation variables ---------- */
const oklchCss = (v) =>
  "oklch(" + v.L + " " + v.C + " " + v.h + (v.a !== 1 ? " / " + v.a : "") + ")";
const oklchToRgba = (v) => {
  const rgb = oklchToRgb(v.L, v.C, v.h);
  return { r: rgb.r, g: rgb.g, b: rgb.b, a: v.a !== undefined ? v.a : 1 };
};
const round = (n) => Math.round(n * 100000) / 100000;
const rgbaEq = (a, b) =>
  round(a.r) === round(b.r) &&
  round(a.g) === round(b.g) &&
  round(a.b) === round(b.b) &&
  round(a.a !== undefined ? a.a : 1) === round(b.a !== undefined ? b.a : 1);

async function b1Collections() {
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  return B1.collections.map((spec) => {
    const found = existing.filter((c) => c.name === spec.name);
    if (found.length > 1) {
      throw new Error(
        'STOP: DUPLICATE COLLECTION — ' + found.length + ' collections named "' + spec.name + '".',
      );
    }
    return { spec, collection: found[0] || null };
  });
}

async function ensureB1Collection(entry) {
  let collection = entry.collection;
  if (!collection) {
    collection = figma.variables.createVariableCollection(entry.spec.name);
    say("collection created : " + entry.spec.name);
  } else {
    say("collection reused  : " + entry.spec.name);
  }
  // Reuse modes by name; create missing ones. Never re-create on rerun.
  const modeNames = collection.modes.map((m) => m.name);
  for (let i = 0; i < entry.spec.modes.length; i++) {
    const wanted = entry.spec.modes[i];
    if (modeNames.indexOf(wanted) === -1) {
      if (i === 0 && collection.modes.length === 1 && modeNames[0] === "Mode 1") {
        collection.renameMode(collection.modes[0].modeId, wanted);
      } else {
        collection.addMode(wanted);
      }
    }
  }
  const modeId = {};
  for (const m of collection.modes) modeId[m.name] = m.modeId;
  return { collection, modeId };
}

async function ensureB1Variable(ctx, name, resolvedType, valuesByMode, description) {
  const vars = await ctx.collection.variableIds;
  const all = [];
  for (const id of vars) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v) all.push(v);
  }
  const matches = all.filter((v) => v.name === name);
  if (matches.length > 1) {
    throw new Error('STOP: DUPLICATE VARIABLE — "' + name + '" exists ' + matches.length + " times in " + ctx.collection.name + ".");
  }
  let variable = matches[0] || null;
  if (variable && variable.resolvedType !== resolvedType) {
    throw new Error(
      'STOP: TYPE MISMATCH — "' + name + '" is ' + variable.resolvedType + ", expected " + resolvedType + ". Not deleting; resolve manually.",
    );
  }
  if (!variable) {
    variable = figma.variables.createVariable(name, ctx.collection, resolvedType);
    say("  variable created : " + ctx.collection.name + " / " + name);
  } else {
    say("  variable updated : " + ctx.collection.name + " / " + name);
  }
  variable.description = description || "";
  for (const modeName of Object.keys(valuesByMode)) {
    variable.setValueForMode(ctx.modeId[modeName], valuesByMode[modeName]);
  }
  return variable;
}

async function ensureB1Variables() {
  await figma.loadAllPagesAsync();
  const entries = await b1Collections();
  const byName = {};
  for (const entry of entries) byName[entry.spec.name] = await ensureB1Collection(entry);

  const primId = {}; // role path -> variable id (for aliases)

  // 1) Primitives — one variable per role path, Light + Dark mode values.
  const prim = byName["ABox/Color/Primitive"];
  for (const p of ABOX_B1.primitives) {
    const desc =
      "source: src/styles.css --" + p.role +
      " — light " + p.source.light + "; dark " + p.source.dark +
      " (oklch converted to sRGB; recorded Figma limitation)";
    const v = await ensureB1Variable(prim, p.name, "COLOR", {
      Light: oklchToRgba(p.light),
      Dark: oklchToRgba(p.dark),
    }, desc);
    primId[p.role] = v.id;
  }

  // 2) Semantic roles — aliases to the primitive of the same path.
  const sem = byName["ABox/Color/Semantic"];
  for (const s of ABOX_B1.semantics) {
    const aliasId = primId[slashToRole(s.alias)];
    if (!aliasId) throw new Error('STOP: alias target missing — primitive "' + s.alias + '".');
    const v = await ensureB1Variable(sem, s.name, "COLOR", {
      Light: { type: "VARIABLE_ALIAS", id: aliasId },
      Dark: { type: "VARIABLE_ALIAS", id: aliasId },
    }, "alias of " + "ABox/Color/Primitive/" + s.alias + " (source: " + s.css + ")");
    primId["semantic:" + s.name] = v.id;
  }

  // 3) Status — tones alias semantic roles; metal tiers alias primitives.
  const status = byName["ABox/Status"];
  const semVars = await variablesByName(sem.collection);
  for (const t of ABOX_B1.tones) {
    const target = semVars[t.alias];
    if (!target) throw new Error('STOP: alias target missing — semantic "' + t.alias + '".');
    await ensureB1Variable(status, t.name, "COLOR", {
      Light: { type: "VARIABLE_ALIAS", id: target.id },
      Dark: { type: "VARIABLE_ALIAS", id: target.id },
    }, "StatusBadge tone; alias of semantic " + t.alias + " (src/components/abox/status-badge.tsx)");
  }
  const primVars = await variablesByName(prim.collection);
  for (const mt of ABOX_B1.metalAliases) {
    const target = primVars[mt.alias];
    if (!target) throw new Error('STOP: alias target missing — primitive "' + mt.alias + '".');
    await ensureB1Variable(status, mt.name, "COLOR", {
      Light: { type: "VARIABLE_ALIAS", id: target.id },
      Dark: { type: "VARIABLE_ALIAS", id: target.id },
    }, "metal tier; alias of primitive " + mt.alias + " (src/styles.css)");
  }

  // 4-9) Float collections.
  const floatGroups = [
    ["ABox/Spacing", ABOX_B1.spacing, "Surface padding (src/components/abox/surface.tsx)"],
    ["ABox/Radius", ABOX_B1.radius, "@theme inline --radius-* (src/styles.css)"],
    ["ABox/Border", ABOX_B1.border, "border / focus:ring-2 widths"],
    ["ABox/Layout", ABOX_B1.layout, "container max-widths (shells, marketplace-page-layout)"],
    ["ABox/Control sizing", ABOX_B1.control, "controlClass heights/padding (src/components/abox/control.tsx)"],
  ];
  for (const [collectionName, values, desc] of floatGroups) {
    for (const name of Object.keys(values)) {
      await ensureB1Variable(byName[collectionName], name, "FLOAT", { Default: values[name] }, desc);
    }
  }

  // Elevation — numeric layer parts (FLOAT) and tint colours (COLOR).
  // Composite box-shadows are NOT a Figma variable type; full shadows become
  // Effect Styles in a later batch. Recorded as a deferred representation.
  const elev = byName["ABox/Elevation"];
  for (const shadowName of Object.keys(ABOX_B1.shadows)) {
    ABOX_B1.shadows[shadowName].forEach((layer, i) => {
      layer._index = i + 1;
    });
    for (const layer of ABOX_B1.shadows[shadowName]) {
      const prefix = "shadow-" + shadowName + "/" + layer._index + "/";
      for (const part of ["x", "y", "blur", "spread"]) {
        await ensureB1Variable(elev, prefix + part, "FLOAT", {
          Light: layer[part],
          Dark: layer[part], // no .dark override in production — recorded
        }, "--shadow-" + shadowName + " layer " + layer._index + " " + part + " (src/styles.css)");
      }
      await ensureB1Variable(elev, prefix + "tint", "COLOR", {
        Light: oklchToRgba(layer.tint),
        Dark: oklchToRgba(layer.tint),
      }, "--shadow-" + shadowName + " layer " + layer._index + " tint " + oklchCss(layer.tint) + " (oklch converted to sRGB; recorded limitation)");
    }
  }
}

function slashToRole(name) {
  return name.replace(/\//g, "-");
}

async function variablesByName(collection) {
  const out = {};
  for (const id of collection.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v) out[v.name] = v;
  }
  return out;
}

async function verifyB1() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  for (const spec of ABOX_B1.collections) {
    const found = collections.filter((c) => c.name === spec.name);
    add(found.length === 1, 'collection "' + spec.name + '" exists exactly once');
    if (found.length === 1) {
      const modeNames = found[0].modes.map((m) => m.name).sort().join(",");
      add(
        modeNames === spec.modes.slice().sort().join(","),
        'collection "' + spec.name + '" modes = ' + spec.modes.join(", "),
      );
    }
  }
  const byName = {};
  for (const spec of ABOX_B1.collections) {
    const c = collections.find((x) => x.name === spec.name);
    if (c) byName[spec.name] = { collection: c, vars: await variablesByName(c) };
  }

  const expectFloat = (collectionName, inventory) => {
    const entry = byName[collectionName];
    if (!entry) { add(false, collectionName + " present"); return; }
    for (const name of Object.keys(inventory)) {
      const v = entry.vars[name];
      add(!!v && v.resolvedType === "FLOAT", collectionName + " / " + name + " exists as FLOAT");
      if (v && v.resolvedType === "FLOAT") {
        const got = v.valuesByMode[entry.collection.modes[0].modeId];
        add(got === inventory[name], collectionName + " / " + name + " = " + inventory[name]);
      }
    }
    const extras = Object.keys(entry.vars).filter((n) => !(n in inventory));
    add(extras.length === 0, collectionName + " has no extra variables" + (extras.length ? " (extra: " + extras.join(", ") + ")" : ""));
  };

  expectFloat("ABox/Spacing", ABOX_B1.spacing);
  expectFloat("ABox/Radius", ABOX_B1.radius);
  expectFloat("ABox/Border", ABOX_B1.border);
  expectFloat("ABox/Layout", ABOX_B1.layout);
  expectFloat("ABox/Control sizing", ABOX_B1.control);

  // Colour value checks against converted production source, per mode.
  const prim = byName["ABox/Color/Primitive"];
  if (prim) {
    const lightId = prim.collection.modes.find((m) => m.name === "Light").modeId;
    const darkId = prim.collection.modes.find((m) => m.name === "Dark").modeId;
    let ok = true;
    for (const p of ABOX_B1.primitives) {
      const v = prim.vars[p.name];
      if (!v || v.resolvedType !== "COLOR") { ok = false; continue; }
      if (!rgbaEq(v.valuesByMode[lightId], oklchToRgba(p.light))) ok = false;
      if (!rgbaEq(v.valuesByMode[darkId], oklchToRgba(p.dark))) ok = false;
    }
    add(ok, "all " + ABOX_B1.primitives.length + " primitives match production Light/Dark values");
    const extraP = Object.keys(prim.vars).filter(
      (n) => !ABOX_B1.primitives.some((p) => p.name === n),
    );
    add(extraP.length === 0, "no extra or duplicated primitive variables");
  }

  const aliasCheck = (collectionName, items, resolveTarget) => {
    const entry = byName[collectionName];
    if (!entry) { add(false, collectionName + " present"); return; }
    let ok = true;
    for (const item of items) {
      const v = entry.vars[item.name];
      if (!v) { ok = false; continue; }
      for (const mode of entry.collection.modes) {
        const val = v.valuesByMode[mode.modeId];
        if (!val || val.type !== "VARIABLE_ALIAS" || val.id !== resolveTarget(item)) ok = false;
      }
    }
    add(ok, collectionName + " aliases point at the correct production targets");
  };
  aliasCheck("ABox/Color/Semantic", ABOX_B1.semantics, (item) =>
    prim.vars[item.alias] ? prim.vars[item.alias].id : null,
  );
  aliasCheck("ABox/Status", ABOX_B1.tones, (item) =>
    byName["ABox/Color/Semantic"] && byName["ABox/Color/Semantic"].vars[item.alias]
      ? byName["ABox/Color/Semantic"].vars[item.alias].id
      : null,
  );
  aliasCheck("ABox/Status", ABOX_B1.metalAliases, (item) =>
    prim && prim.vars[item.alias] ? prim.vars[item.alias].id : null,
  );

  // No runtime branding leaked in.
  const brandingTerms = /primary_color|accent_color|white.?label|tenant|brand[_-]?record/i;
  let brandingLeak = false;
  for (const spec of ABOX_B1.collections) {
    const entry = byName[spec.name];
    if (!entry) continue;
    for (const n of Object.keys(entry.vars)) {
      if (brandingTerms.test(n) || brandingTerms.test(entry.vars[n].description || "")) brandingLeak = true;
    }
  }
  add(!brandingLeak, "no runtime/white-label branding values imported");

  // B1 must not create styles, components or page content.
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();
  add(textStyles.length === 0, "B1 created no text styles");
  add(effectStyles.length === 0, "B1 created no effect styles");
  let components = 0;
  let nodes = 0;
  for (const page of figma.root.children) {
    nodes += page.children.length;
    components += page.findAll((n) => n.type === "COMPONENT" || n.type === "COMPONENT_SET").length;
  }
  add(components === 0, "B1 created no components or variants");
  add(nodes === 0, "the seven library pages remain empty");
  add(
    T.library.pages.every((n, i) => figma.root.children[i] && figma.root.children[i].name === n),
    "the seven pages remain at indices 0..6 in order",
  );

  say("");
  say("B1 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say(passed ? "RESULT: B1 PASSED" : "RESULT: B1 FAILED — do not proceed to B2.");
  say("Recorded limitations: oklch stored as sRGB (source notation kept in descriptions);");
  say("color-mix() badge tints are runtime-computed (later batch); composite shadows become");
  say("Effect Styles in a later batch. No runtime branding imported. No publishing performed.");
  return passed;
}

/* ---------- entry ---------- */
figma.showUI(__html__, { width: 420, height: 560 });

figma.ui.onmessage = async (msg) => {
  lines.length = 0;
  const b0 = msg.type === "b0-run" || msg.type === "b0-verify";
  const b1 = msg.type === "b1-run" || msg.type === "b1-verify";
  try {
    if (msg.type === "run") {
      say("ABox Figma Proof — creating native objects");
      say("file: " + figma.root.name);
      requireFile(T.library.proofFileName);
      say("");
      const fonts = await resolveProofFonts();
      say("");
      await ensureVariable();
      await ensureTextStyle(fonts.body);
      await ensureComponentSet(fonts.badge);
      await verify();
    } else if (msg.type === "verify") {
      say("ABox Figma Proof — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.proofFileName);
      await verify();
    } else if (msg.type === "b0-run") {
      say("ABox Phase 52 / Batch B0 — library foundation pages");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureLibraryPages();
      await verifyLibraryPages();
    } else if (msg.type === "b0-verify") {
      say("ABox Phase 52 / Batch B0 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyLibraryPages();
    } else if (msg.type === "b1-run") {
      say("ABox Phase 52 / Batch B1 — foundation variables");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB1Variables();
      await verifyB1();
    } else if (msg.type === "b1-verify") {
      say("ABox Phase 52 / Batch B1 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB1();
    }
  } catch (e) {
    say("");
    say(String((e && e.message) || e));
    say(
      b0
        ? "RESULT: B0 FAILED — do not proceed to B1."
        : b1
          ? "RESULT: B1 FAILED — do not proceed to B2."
          : "RESULT: PROOF FAILED — do not proceed to Phase 52.",
    );
  }
  report();
};
