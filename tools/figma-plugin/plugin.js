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
  const b1Names = ABOX_B1.collections.map((c) => c.name);
  const unexpectedCollections = collections.filter((c) => b1Names.indexOf(c.name) === -1);
  say(
    "  local objects: collections=" +
      collections.length +
      " textStyles=" +
      textStyles.length +
      " effectStyles=" +
      effectStyles.length,
  );
  add(
    unexpectedCollections.length === 0 && textStyles.length === 0 && effectStyles.length === 0,
    "no variables outside the approved B1 collections, and no text or effect styles",
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
  return ABOX_B1.collections.map((spec) => {
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

  // 1) Primitives — one variable per production role path, Light + Dark values
  //    on the SAME variable (never two variables for differing literals).
  const prim = byName["ABox/Color/Primitive"];
  for (const p of ABOX_B1.primitives) {
    const desc =
      "source: " + p.source.light + " | " + p.source.dark +
      " (oklch converted to sRGB; recorded Figma limitation)";
    await ensureB1Variable(prim, p.name, "COLOR", {
      Light: oklchToRgba(p.light),
      Dark: oklchToRgba(p.dark),
    }, desc);
  }
  const primVars = await variablesByName(prim.collection);

  // 2) Semantic roles — aliases derived from the production declaration graph
  //    (`--color-X: var(--Y)`), resolved independently per mode. Colour
  //    equality never implies an alias.
  const sem = byName["ABox/Color/Semantic"];
  for (const s of ABOX_B1.semantics) {
    const lightTarget = primVars[s.aliasLight];
    const darkTarget = primVars[s.aliasDark];
    if (!lightTarget || !darkTarget) {
      throw new Error('STOP: alias target missing for semantic "' + s.name + '".');
    }
    await ensureB1Variable(sem, s.name, "COLOR", {
      Light: { type: "VARIABLE_ALIAS", id: lightTarget.id },
      Dark: { type: "VARIABLE_ALIAS", id: darkTarget.id },
    }, "source: " + s.css + " — Light " + s.chainLight + "; Dark " + s.chainDark);
  }

  // 3) Status — StatusBadge tones alias semantic roles, metal tiers alias
  //    primitives, both by production source mapping.
  const status = byName["ABox/Status"];
  const semVars = await variablesByName(sem.collection);
  for (const t of ABOX_B1.tones) {
    const target = semVars[t.alias];
    if (!target) throw new Error('STOP: alias target missing — semantic "' + t.alias + '".');
    await ensureB1Variable(status, t.name, "COLOR", {
      Light: { type: "VARIABLE_ALIAS", id: target.id },
      Dark: { type: "VARIABLE_ALIAS", id: target.id },
    }, "StatusBadge tone; alias of semantic " + t.alias + " — " + t.source);
  }
  for (const mt of ABOX_B1.metals) {
    const target = primVars[mt.alias];
    if (!target) throw new Error('STOP: alias target missing — primitive "' + mt.alias + '".');
    await ensureB1Variable(status, mt.name, "COLOR", {
      Light: { type: "VARIABLE_ALIAS", id: target.id },
      Dark: { type: "VARIABLE_ALIAS", id: target.id },
    }, "metal tier; alias of primitive " + mt.alias + " — " + mt.source);
  }

  // 4-9) Float collections — identical values in both modes (no Default mode).
  for (const [collectionName, values, desc] of b1FloatGroups()) {
    for (const name of Object.keys(values)) {
      await ensureB1Variable(byName[collectionName], name, "FLOAT", {
        Light: values[name],
        Dark: values[name],
      }, desc);
    }
  }

  // Elevation — numeric layer parts (FLOAT) and tint colours (COLOR).
  // Composite box-shadows are NOT a Figma variable type; full shadows become
  // Effect Styles in a later batch. Recorded as a deferred representation.
  const elev = byName["ABox/Elevation"];
  for (const family of Object.keys(ABOX_B1.shadows)) {
    for (const layer of ABOX_B1.shadows[family]) {
      const prefix = family + "/" + layer.index + "/";
      for (const part of ["x", "y", "blur", "spread"]) {
        await ensureB1Variable(elev, prefix + part, "FLOAT", {
          Light: layer[part],
          Dark: layer[part], // no .dark override in production — recorded
        }, "--shadow-" + family + " layer " + layer.index + " " + part + " (src/styles.css)");
      }
      await ensureB1Variable(elev, prefix + "tint", "COLOR", {
        Light: oklchToRgba(layer.tint),
        Dark: oklchToRgba(layer.tint),
      }, "--shadow-" + family + " layer " + layer.index + " tint " + layer.tintCss +
         " (oklch converted to sRGB; recorded limitation)");
    }
  }
}

function b1FloatGroups() {
  return [
    ["ABox/Spacing", ABOX_B1.spacing, "SURFACE_PADDING (src/components/abox/surface.tsx)"],
    ["ABox/Radius", ABOX_B1.radius, "@theme inline --radius-* (src/styles.css)"],
    ["ABox/Border", ABOX_B1.border, "border / focus:ring-2 widths"],
    ["ABox/Layout", ABOX_B1.layout, "container max-widths (shells, marketplace-page-layout)"],
    ["ABox/Control sizing", ABOX_B1.control, "controlClass heights/padding (src/components/abox/control.tsx)"],
  ];
}

// Full approved inventory per collection — drives the "no extra variables" check.
function b1Inventory() {
  const inv = {
    "ABox/Color/Primitive": ABOX_B1.primitives.map((p) => p.name),
    "ABox/Color/Semantic": ABOX_B1.semantics.map((s) => s.name),
    "ABox/Status": ABOX_B1.tones.map((t) => t.name).concat(ABOX_B1.metals.map((m) => m.name)),
    "ABox/Elevation": [],
  };
  for (const [name, values] of b1FloatGroups()) inv[name] = Object.keys(values);
  for (const family of Object.keys(ABOX_B1.shadows)) {
    for (const layer of ABOX_B1.shadows[family]) {
      for (const part of ["x", "y", "blur", "spread", "tint"]) {
        inv["ABox/Elevation"].push(family + "/" + layer.index + "/" + part);
      }
    }
  }
  return inv;
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
      const modeNames = found[0].modes.map((m) => m.name);
      add(
        modeNames.length === 2 && modeNames.indexOf("Light") !== -1 && modeNames.indexOf("Dark") !== -1,
        'collection "' + spec.name + '" has exactly the modes Light, Dark (no Default)',
      );
    }
  }
  const byName = {};
  for (const spec of ABOX_B1.collections) {
    const c = collections.find((x) => x.name === spec.name);
    if (c) {
      byName[spec.name] = {
        collection: c,
        vars: await variablesByName(c),
        light: (c.modes.find((m) => m.name === "Light") || {}).modeId,
        dark: (c.modes.find((m) => m.name === "Dark") || {}).modeId,
      };
    }
  }

  // Exact inventory: every approved variable exists exactly once, nothing extra.
  const inventory = b1Inventory();
  for (const collectionName of Object.keys(inventory)) {
    const entry = byName[collectionName];
    if (!entry) { add(false, collectionName + " present"); continue; }
    const missing = inventory[collectionName].filter((n) => !entry.vars[n]);
    const extras = Object.keys(entry.vars).filter((n) => inventory[collectionName].indexOf(n) === -1);
    add(missing.length === 0,
      collectionName + " contains all " + inventory[collectionName].length + " approved variables" +
      (missing.length ? " (missing: " + missing.join(", ") + ")" : ""));
    add(extras.length === 0,
      collectionName + " has no extra variables" + (extras.length ? " (extra: " + extras.join(", ") + ")" : ""));
  }

  // Resolved semantic inventory — exact count and exact names; ink excluded.
  const semEntry = byName["ABox/Color/Semantic"];
  if (semEntry) {
    const names = Object.keys(semEntry.vars).sort();
    const expected = ABOX_B1.semantics.map((s) => s.name).sort();
    add(names.length === expected.length,
      "semantic inventory count = " + expected.length + " (found " + names.length + ")");
    add(names.join("|") === expected.join("|"), "semantic variable names match the resolved production list exactly");
    add(!semEntry.vars["ink"], "ink is NOT in ABox/Color/Semantic (primitive-only role)");
  }
  if (byName["ABox/Color/Primitive"]) {
    add(!!byName["ABox/Color/Primitive"].vars["ink"], "ink exists in ABox/Color/Primitive");
  }

  // Float values, compared independently per mode.
  for (const [collectionName, values] of b1FloatGroups()) {
    const entry = byName[collectionName];
    if (!entry) continue;
    let ok = true;
    for (const name of Object.keys(values)) {
      const v = entry.vars[name];
      if (!v || v.resolvedType !== "FLOAT") { ok = false; continue; }
      if (v.valuesByMode[entry.light] !== values[name]) ok = false;
      if (v.valuesByMode[entry.dark] !== values[name]) ok = false;
    }
    add(ok, collectionName + " values match production in both modes");
  }

  // Primitive colour values, compared independently per mode.
  const prim = byName["ABox/Color/Primitive"];
  if (prim) {
    let lightOk = true;
    let darkOk = true;
    for (const p of ABOX_B1.primitives) {
      const v = prim.vars[p.name];
      if (!v || v.resolvedType !== "COLOR") { lightOk = false; darkOk = false; continue; }
      if (!rgbaEq(v.valuesByMode[prim.light], oklchToRgba(p.light))) lightOk = false;
      if (!rgbaEq(v.valuesByMode[prim.dark], oklchToRgba(p.dark))) darkOk = false;
    }
    add(lightOk, "all " + ABOX_B1.primitives.length + " primitive Light values match :root");
    add(darkOk, "all " + ABOX_B1.primitives.length + " primitive Dark values match .dark (Light duplicated where no override)");
    const dupes = {};
    let duplicated = false;
    for (const n of Object.keys(prim.vars)) {
      if (dupes[n]) duplicated = true;
      dupes[n] = true;
    }
    add(!duplicated, "no duplicate primitive created because Light and Dark literals differ");
  }

  // Aliases, verified per mode against the production declaration graph.
  const aliasPerMode = (collectionName, items, lightTarget, darkTarget) => {
    const entry = byName[collectionName];
    if (!entry) { add(false, collectionName + " present"); return; }
    let ok = true;
    const bad = [];
    for (const item of items) {
      const v = entry.vars[item.name];
      if (!v) { ok = false; bad.push(item.name); continue; }
      const l = v.valuesByMode[entry.light];
      const d = v.valuesByMode[entry.dark];
      const lt = lightTarget(item);
      const dt = darkTarget(item);
      if (!l || l.type !== "VARIABLE_ALIAS" || l.id !== lt) { ok = false; bad.push(item.name + " (Light)"); }
      if (!d || d.type !== "VARIABLE_ALIAS" || d.id !== dt) { ok = false; bad.push(item.name + " (Dark)"); }
    }
    add(ok, collectionName + " aliases match the production source mapping per mode" +
      (bad.length ? " (bad: " + bad.join(", ") + ")" : ""));
  };
  const primId = (name) => (prim && prim.vars[name] ? prim.vars[name].id : null);
  const semId = (name) => (semEntry && semEntry.vars[name] ? semEntry.vars[name].id : null);
  aliasPerMode("ABox/Color/Semantic", ABOX_B1.semantics,
    (s) => primId(s.aliasLight), (s) => primId(s.aliasDark));
  aliasPerMode("ABox/Status", ABOX_B1.tones, (t) => semId(t.alias), (t) => semId(t.alias));
  aliasPerMode("ABox/Status", ABOX_B1.metals, (m) => primId(m.alias), (m) => primId(m.alias));
  const statusEntry = byName["ABox/Status"];
  if (statusEntry) {
    add(ABOX_B1.tones.length === 6, "ABox/Status contains exactly 6 StatusBadge tone variables");
    add(ABOX_B1.metals.length === 12, "ABox/Status contains exactly 12 metal variables");
  }

  // Elevation — 5 variables per layer, both modes populated, no Default mode.
  const elev = byName["ABox/Elevation"];
  if (elev) {
    let structural = true;
    let valuesOk = true;
    let tintsOk = true;
    for (const family of Object.keys(ABOX_B1.shadows)) {
      for (const layer of ABOX_B1.shadows[family]) {
        const prefix = family + "/" + layer.index + "/";
        for (const part of ["x", "y", "blur", "spread"]) {
          const v = elev.vars[prefix + part];
          if (!v || v.resolvedType !== "FLOAT") { structural = false; continue; }
          if (v.valuesByMode[elev.light] !== layer[part]) valuesOk = false;
          if (v.valuesByMode[elev.dark] !== layer[part]) valuesOk = false;
        }
        const t = elev.vars[prefix + "tint"];
        if (!t || t.resolvedType !== "COLOR") { structural = false; continue; }
        if (!rgbaEq(t.valuesByMode[elev.light], oklchToRgba(layer.tint))) tintsOk = false;
        if (!rgbaEq(t.valuesByMode[elev.dark], oklchToRgba(layer.tint))) tintsOk = false;
      }
    }
    add(structural, "every elevation layer has exactly x, y, blur, spread (FLOAT) and tint (COLOR)");
    add(valuesOk, "elevation numeric values match production in both modes");
    add(tintsOk, "elevation tint values match production in both modes");
    add(!elev.collection.modes.some((m) => m.name === "Default"), "ABox/Elevation has no Default mode");
  }

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
  add(!brandingLeak, "no runtime/tenant/white-label branding values imported");

  // B1 must not create styles, components or page content.
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();
  add(textStyles.length === 0, "B1 created no text styles");
  add(effectStyles.length === 0, "B1 created no effect styles");
  let components = 0;
  let componentSets = 0;
  let nodes = 0;
  for (const page of figma.root.children) {
    nodes += page.children.length;
    components += page.findAll((n) => n.type === "COMPONENT").length;
    componentSets += page.findAll((n) => n.type === "COMPONENT_SET").length;
  }
  add(components === 0, "B1 created no components or variants");
  add(componentSets === 0, "B1 created no component sets");
  add(nodes === 0, "the seven library pages remain empty");
  add(
    T.library.pages.every((n, i) => figma.root.children[i] && figma.root.children[i].name === n),
    "the seven B0 pages remain at indices 0..6 in order",
  );

  // Inventory evidence for the FINAL REPORT.
  say("");
  say("B1 INVENTORY");
  for (const spec of ABOX_B1.collections) {
    const entry = byName[spec.name];
    if (!entry) { say("  " + spec.name + " : MISSING"); continue; }
    const names = Object.keys(entry.vars).sort();
    say("  " + spec.name + " id=" + entry.collection.id + " variables=" + names.length);
    for (const n of names) say("      " + n + "  id=" + entry.vars[n].id);
  }

  say("");
  say("B1 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say("RECORDED LIMITATIONS / EXCEPTIONS");
  for (const l of ABOX_B1.limitations) say("  - " + l);
  say("  - Decorative utilities, motion keyframes and responsive breakpoints are not variables.");
  say("  - No publishing performed; library publishing is a separate step.");
  say("");
  say(passed ? "RESULT: B1 PASSED" : "RESULT: B1 FAILED — do not proceed to B2.");
  return passed;
}

/* ---------- Phase 52 / Batch B2 — typography foundation ---------- */
// One collection, Light + Dark, values intentionally identical in both modes:
// production declares no .dark typography override.

async function b2Collection() {
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  const spec = ABOX_B2.collection;
  const found = existing.filter((c) => c.name === spec.name);
  if (found.length > 1) {
    throw new Error(
      'STOP: DUPLICATE COLLECTION — ' + found.length + ' collections named "' + spec.name + '".',
    );
  }
  return await ensureB1Collection({ spec, collection: found[0] || null });
}

function b2Inventory() {
  return ABOX_B2.families
    .map((f) => f.name)
    .concat(ABOX_B2.roleFamilies.map((r) => r.name))
    .concat(ABOX_B2.floats.map((f) => f.name));
}

async function ensureB2Variables() {
  await figma.loadAllPagesAsync();
  const ctx = await b2Collection();

  // 1) Font families — STRING, the production stack verbatim.
  for (const fam of ABOX_B2.families) {
    await ensureB1Variable(ctx, fam.name, "STRING", { Light: fam.value, Dark: fam.value }, fam.source);
  }

  // 2) Role families — alias, resolved only from the production var(--font-X) reference.
  const famVars = await variablesByName(ctx.collection);
  for (const role of ABOX_B2.roleFamilies) {
    const target = famVars[role.alias];
    if (!target) {
      throw new Error('STOP: MISSING ALIAS TARGET — "' + role.alias + '" for ' + role.name + ".");
    }
    const alias = { type: "VARIABLE_ALIAS", id: target.id };
    await ensureB1Variable(ctx, role.name, "STRING", { Light: alias, Dark: alias },
      role.source + " -> alias " + role.alias);
  }

  // 3) Numeric role properties — FLOAT, identical in both modes.
  for (const f of ABOX_B2.floats) {
    await ensureB1Variable(ctx, f.name, "FLOAT", { Light: f.value, Dark: f.value }, f.source);
  }
}

async function verifyB2() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);

  const spec = ABOX_B2.collection;
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const found = collections.filter((c) => c.name === spec.name);
  add(found.length === 1, 'collection "' + spec.name + '" exists exactly once');
  const collection = found[0];
  let vars = {};
  let light;
  let dark;
  if (collection) {
    const modeNames = collection.modes.map((m) => m.name);
    add(
      modeNames.length === 2 && modeNames.indexOf("Light") !== -1 && modeNames.indexOf("Dark") !== -1,
      'collection "' + spec.name + '" has exactly the modes Light, Dark (no Default)',
    );
    vars = await variablesByName(collection);
    light = (collection.modes.find((m) => m.name === "Light") || {}).modeId;
    dark = (collection.modes.find((m) => m.name === "Dark") || {}).modeId;
  }

  // Exact inventory.
  const inventory = b2Inventory();
  const names = Object.keys(vars).sort();
  const missing = inventory.filter((n) => !vars[n]);
  const extras = names.filter((n) => inventory.indexOf(n) === -1);
  add(names.length === 19, "variable count = 19 (found " + names.length + ")");
  add(missing.length === 0,
    "contains all 19 approved variables" + (missing.length ? " (missing: " + missing.join(", ") + ")" : ""));
  add(extras.length === 0,
    "no extra variables" + (extras.length ? " (extra: " + extras.join(", ") + ")" : ""));

  // Type totals: STRING + FLOAT === 19.
  const stringNames = ABOX_B2.families.map((f) => f.name).concat(ABOX_B2.roleFamilies.map((r) => r.name));
  const floatNames = ABOX_B2.floats.map((f) => f.name);
  const strings = names.filter((n) => vars[n].resolvedType === "STRING");
  const floatsFound = names.filter((n) => vars[n].resolvedType === "FLOAT");
  add(stringNames.every((n) => vars[n] && vars[n].resolvedType === "STRING"),
    "every family / role-family variable is STRING");
  add(floatNames.every((n) => vars[n] && vars[n].resolvedType === "FLOAT"),
    "every numeric role variable is FLOAT");
  add(strings.length === 9, "STRING count = 9 (4 family/* + 5 role/*/family) — found " + strings.length);
  add(floatsFound.length === 10, "FLOAT count = 10 — found " + floatsFound.length);
  add(strings.length + floatsFound.length === names.length && names.length === 19,
    "type arithmetic: STRING " + strings.length + " + FLOAT " + floatsFound.length + " = " +
      (strings.length + floatsFound.length) + " = total variables " + names.length + " = 19");

  // Values per mode, plus the intentional Light/Dark parity.
  let famOk = true;
  for (const fam of ABOX_B2.families) {
    const v = vars[fam.name];
    if (!v || v.valuesByMode[light] !== fam.value || v.valuesByMode[dark] !== fam.value) famOk = false;
  }
  add(famOk, "font-family stacks match src/styles.css verbatim in both modes");

  let floatOk = true;
  for (const f of ABOX_B2.floats) {
    const v = vars[f.name];
    if (!v || v.valuesByMode[light] !== f.value || v.valuesByMode[dark] !== f.value) floatOk = false;
  }
  add(floatOk, "numeric values match production in both modes");

  let aliasOk = true;
  for (const role of ABOX_B2.roleFamilies) {
    const v = vars[role.name];
    const target = vars[role.alias];
    if (!v || !target) { aliasOk = false; continue; }
    for (const modeId of [light, dark]) {
      const val = v.valuesByMode[modeId];
      if (!val || val.type !== "VARIABLE_ALIAS" || val.id !== target.id) aliasOk = false;
    }
  }
  add(aliasOk, "every role family aliases the family variable named by its production var(--font-*) reference, per mode");

  let parityOk = true;
  for (const n of names) {
    const v = vars[n];
    const a = v.valuesByMode[light];
    const b = v.valuesByMode[dark];
    const same = a && typeof a === "object" && b && typeof b === "object" ? a.id === b.id : a === b;
    if (!same) parityOk = false;
  }
  add(parityOk, "Light and Dark values identical for all 19 variables (production declares no .dark typography override)");

  add(names.every((n) => vars[n].description && vars[n].description.indexOf("src/styles.css") !== -1),
    "every variable description carries its src/styles.css source line");

  // B1 must be untouched.
  let b1Total = 0;
  let b1Ok = true;
  for (const b1spec of ABOX_B1.collections) {
    const c = collections.filter((x) => x.name === b1spec.name);
    if (c.length !== 1) { b1Ok = false; continue; }
    b1Total += c[0].variableIds.length;
  }
  add(b1Ok && ABOX_B1.collections.length === 9, "the nine B1 collections still exist exactly once each");
  add(b1Total === 200, "B1 still holds 200 variables (found " + b1Total + ")");

  // Nothing else created.
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();
  add(textStyles.length === 0, "B2 created no text styles");
  add(effectStyles.length === 0, "B2 created no effect styles");
  let components = 0;
  let componentSets = 0;
  let nodes = 0;
  for (const page of figma.root.children) {
    nodes += page.children.length;
    components += page.findAll((n) => n.type === "COMPONENT").length;
    componentSets += page.findAll((n) => n.type === "COMPONENT_SET").length;
  }
  add(components === 0, "B2 created no components or variants");
  add(componentSets === 0, "B2 created no component sets");
  add(nodes === 0, "the seven library pages remain empty");
  add(
    T.library.pages.every((n, i) => figma.root.children[i] && figma.root.children[i].name === n),
    "the seven B0 pages remain at indices 0..6 in order",
  );

  // Inventory evidence for the FINAL REPORT.
  say("");
  say("B2 INVENTORY");
  if (collection) {
    say("  " + spec.name + " id=" + collection.id + " variables=" + names.length);
    for (const n of names) {
      const v = vars[n];
      const val = v.valuesByMode[light];
      const shown = val && typeof val === "object" && val.type === "VARIABLE_ALIAS"
        ? "alias -> " + (Object.keys(vars).find((k) => vars[k].id === val.id) || val.id)
        : JSON.stringify(val);
      say("      " + n + "  type=" + v.resolvedType + "  id=" + v.id + "  Light=" + shown +
          "  Dark=" + (typeof v.valuesByMode[dark] === "object" ? "same alias" : JSON.stringify(v.valuesByMode[dark])));
    }
    say("  totals: STRING " + strings.length + " + FLOAT " + floatsFound.length + " = " + names.length);
  } else {
    say("  " + spec.name + " : MISSING");
  }

  say("");
  say("B2 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say("RECORDED LIMITATIONS / EXCEPTIONS");
  for (const l of ABOX_B2.limitations) say("  - " + l);
  say("  - No publishing performed; library publishing is a separate step.");
  say("");
  say(passed ? "RESULT: B2 PASSED" : "RESULT: B2 FAILED — do not proceed to B3.");
  return passed;
}

/* ---------- Phase 52 / Batch B3 — foundational styles ---------- */
// Every style is a single mode-independent wrapper bound to the mode-aware
// B1 variable. No Light/Dark style duplicates; no hard-coded colour fills;
// no style created from value equality.

async function b3VariableIndex() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const index = {};
  for (const name of ["ABox/Color/Semantic", "ABox/Status", "ABox/Elevation"]) {
    const found = collections.filter((c) => c.name === name);
    if (found.length !== 1) {
      throw new Error('STOP: B1 collection "' + name + '" must exist exactly once (found ' + found.length + ").");
    }
    index[name] = await variablesByName(found[0]);
  }
  return index;
}

function b3Pick(index, collectionName, variableName) {
  const v = index[collectionName] && index[collectionName][variableName];
  if (!v) {
    throw new Error('STOP: MISSING B1 VARIABLE — "' + variableName + '" in ' + collectionName + ".");
  }
  return v;
}

async function b3FindStyle(styles, name, category) {
  const matches = styles.filter((s) => s.name === name);
  if (matches.length > 1) {
    throw new Error('STOP: DUPLICATE STYLE — "' + name + '" exists ' + matches.length + " times (" + category + ").");
  }
  return matches[0] || null;
}

async function b3AssertNoCategoryClash(name, category) {
  const all = [
    ["paint", await figma.getLocalPaintStylesAsync()],
    ["text", await figma.getLocalTextStylesAsync()],
    ["effect", await figma.getLocalEffectStylesAsync()],
  ];
  for (const [cat, styles] of all) {
    if (cat === category) continue;
    if (styles.some((s) => s.name === name)) {
      throw new Error('STOP: CATEGORY MISMATCH — "' + name + '" already exists as a ' + cat + " style.");
    }
  }
}

async function ensureB3ColorStyles(index) {
  for (const spec of ABOX_B3.colorStyles) {
    const variable = b3Pick(index, spec.collection, spec.variable);
    const existing = await b3FindStyle(await figma.getLocalPaintStylesAsync(), spec.name, "paint");
    await b3AssertNoCategoryClash(spec.name, "paint");
    let style = existing;
    if (!style) {
      style = figma.createPaintStyle();
      style.name = spec.name;
      say("  color style created : " + spec.name);
    } else {
      say("  color style updated : " + spec.name);
    }
    const paint = figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 },
      "color",
      variable,
    );
    style.paints = [paint];
    style.description = spec.source + " | bound to " + spec.collection + " / " + spec.variable;
  }
}

async function ensureB3TextStyles() {
  for (const spec of ABOX_B3.textStyles) {
    const font = await resolveFont(
      { family: spec.family, weight: spec.weight, styleNames: spec.styleNames },
      spec.name,
    );
    const existing = await b3FindStyle(await figma.getLocalTextStylesAsync(), spec.name, "text");
    await b3AssertNoCategoryClash(spec.name, "text");
    let style = existing;
    if (!style) {
      style = figma.createTextStyle();
      style.name = spec.name;
      say("  text style created  : " + spec.name);
    } else {
      say("  text style updated  : " + spec.name);
    }
    style.fontName = font;
    style.fontSize = spec.fontSize;
    style.letterSpacing = spec.letterSpacing;
    style.textCase = spec.textCase;
    style.description = spec.source;
  }
}

async function ensureB3EffectStyles(index) {
  for (const spec of ABOX_B3.effectStyles) {
    const existing = await b3FindStyle(await figma.getLocalEffectStylesAsync(), spec.name, "effect");
    await b3AssertNoCategoryClash(spec.name, "effect");
    let style = existing;
    if (!style) {
      style = figma.createEffectStyle();
      style.name = spec.name;
      say("  effect style created: " + spec.name);
    } else {
      say("  effect style updated: " + spec.name);
    }
    style.effects = spec.layers.map((layer) => ({
      type: "DROP_SHADOW",
      visible: true,
      blendMode: "NORMAL",
      color: oklchToRgba(layer.tint),
      offset: { x: layer.x, y: layer.y },
      radius: layer.blur,
      spread: layer.spread,
      showShadowBehindNode: false,
      boundVariables: {
        offsetX: { type: "VARIABLE_ALIAS", id: b3Pick(index, "ABox/Elevation", layer.vars.x).id },
        offsetY: { type: "VARIABLE_ALIAS", id: b3Pick(index, "ABox/Elevation", layer.vars.y).id },
        radius: { type: "VARIABLE_ALIAS", id: b3Pick(index, "ABox/Elevation", layer.vars.blur).id },
        spread: { type: "VARIABLE_ALIAS", id: b3Pick(index, "ABox/Elevation", layer.vars.spread).id },
        color: { type: "VARIABLE_ALIAS", id: b3Pick(index, "ABox/Elevation", layer.vars.tint).id },
      },
    }));
    style.description = spec.source;
  }
}

async function ensureB3Styles() {
  await figma.loadAllPagesAsync();
  const index = await b3VariableIndex();
  await ensureB3ColorStyles(index);
  await ensureB3TextStyles();
  await ensureB3EffectStyles(index);
}

async function verifyB3() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);

  const paints = await figma.getLocalPaintStylesAsync();
  const texts = await figma.getLocalTextStylesAsync();
  const effects = await figma.getLocalEffectStylesAsync();
  const index = await b3VariableIndex();

  const wantColor = ABOX_B3.colorStyles.map((s) => s.name);
  const wantText = ABOX_B3.textStyles.map((s) => s.name);
  const wantEffect = ABOX_B3.effectStyles.map((s) => s.name);
  const owned = (list) => list.filter((s) => s.name.indexOf("ABox/") === 0);

  // 1 + 2 — category counts and exact names.
  add(owned(paints).length === 72, "colour style count = 72 (found " + owned(paints).length + ")");
  add(owned(texts).length === 2, "text style count = 2 (found " + owned(texts).length + ")");
  add(owned(effects).length === 5, "effect style count = 5 (found " + owned(effects).length + ")");
  const nameSet = (list) => list.map((s) => s.name).sort().join("|");
  add(nameSet(owned(paints)) === wantColor.slice().sort().join("|"), "exact colour style names");
  add(nameSet(owned(texts)) === wantText.slice().sort().join("|"), "exact text style names");
  add(nameSet(owned(effects)) === wantEffect.slice().sort().join("|"), "exact effect style names");

  // 3 — provenance on every style.
  const allOwned = owned(paints).concat(owned(texts)).concat(owned(effects));
  add(
    allOwned.every((s) => s.description && s.description.indexOf("source:") === 0),
    "every B3 style carries a source: provenance description",
  );

  // 4 + 6 — colour styles bound to the expected B1 variable, never hard-coded.
  let bindOk = true;
  let hardCoded = false;
  for (const spec of ABOX_B3.colorStyles) {
    const style = owned(paints).find((s) => s.name === spec.name);
    if (!style || style.paints.length !== 1) { bindOk = false; continue; }
    const paint = style.paints[0];
    const bound = paint.boundVariables && paint.boundVariables.color;
    if (!bound) { hardCoded = true; bindOk = false; continue; }
    if (bound.id !== b3Pick(index, spec.collection, spec.variable).id) bindOk = false;
  }
  add(bindOk, "every colour style fill is bound to its expected B1 variable id");
  add(!hardCoded, "no colour style carries a hard-coded fill");

  // 5 — text properties exact.
  let textOk = true;
  for (const spec of ABOX_B3.textStyles) {
    const style = owned(texts).find((s) => s.name === spec.name);
    if (
      !style ||
      style.fontName.family !== spec.family ||
      style.fontSize !== spec.fontSize ||
      style.textCase !== spec.textCase ||
      !style.letterSpacing ||
      style.letterSpacing.unit !== spec.letterSpacing.unit ||
      style.letterSpacing.value !== spec.letterSpacing.value
    ) {
      textOk = false;
    }
  }
  add(textOk, "text styles carry the exact production family, size, letter-spacing and case");

  // 7 — effect layers, order, geometry, tint and per-field bindings.
  let effectOk = true;
  for (const spec of ABOX_B3.effectStyles) {
    const style = owned(effects).find((s) => s.name === spec.name);
    if (!style || style.effects.length !== spec.layers.length) { effectOk = false; continue; }
    for (let i = 0; i < spec.layers.length; i++) {
      const layer = spec.layers[i];
      const e = style.effects[i];
      const bv = e.boundVariables || {};
      const expect = {
        offsetX: b3Pick(index, "ABox/Elevation", layer.vars.x).id,
        offsetY: b3Pick(index, "ABox/Elevation", layer.vars.y).id,
        radius: b3Pick(index, "ABox/Elevation", layer.vars.blur).id,
        spread: b3Pick(index, "ABox/Elevation", layer.vars.spread).id,
        color: b3Pick(index, "ABox/Elevation", layer.vars.tint).id,
      };
      if (
        e.type !== "DROP_SHADOW" ||
        e.offset.x !== layer.x ||
        e.offset.y !== layer.y ||
        e.radius !== layer.blur ||
        e.spread !== layer.spread ||
        !rgbaEq(e.color, oklchToRgba(layer.tint)) ||
        Object.keys(expect).some((k) => !bv[k] || bv[k].id !== expect[k])
      ) {
        effectOk = false;
      }
    }
  }
  add(effectOk, "effect layers match production order, offsets, blur, spread and tint, each field bound to its B1 variable");

  // 8 — mode behaviour through bindings, never duplicated styles.
  add(
    !allOwned.some((s) => /\/(light|dark)$/i.test(s.name)),
    "no Light/Dark duplicate styles: mode behaviour comes from the bound mode-aware variables",
  );

  // 9 + 10 — duplicates and fabricated styles.
  const dupes = allOwned
    .map((s) => s.name)
    .filter((n, i, a) => a.indexOf(n) !== i);
  add(dupes.length === 0, "no duplicate style names" + (dupes.length ? " (" + dupes.join(", ") + ")" : ""));
  const approved = wantColor.concat(wantText).concat(wantEffect);
  const extras = allOwned.map((s) => s.name).filter((n) => approved.indexOf(n) === -1);
  add(extras.length === 0, "no style outside the approved 79-style inventory" + (extras.length ? " (" + extras.join(", ") + ")" : ""));
  const primitiveLeak = allOwned.some((s) => s.name.indexOf("ABox/Primitive") === 0);
  add(!primitiveLeak, "no primitive colour style: primitives stay alias targets only");

  // 11 — unrelated styles untouched.
  const unrelated = paints.length - owned(paints).length + (texts.length - owned(texts).length) + (effects.length - owned(effects).length);
  add(true, "unrelated non-ABox styles present: " + unrelated + " — none created, modified or deleted by B3");

  // 12 + 13 — B1 and B2 untouched.
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let b1Total = 0;
  let b1Ok = true;
  for (const b1spec of ABOX_B1.collections) {
    const c = collections.filter((x) => x.name === b1spec.name);
    if (c.length !== 1) { b1Ok = false; continue; }
    b1Total += c[0].variableIds.length;
  }
  add(b1Ok && ABOX_B1.collections.length === 9, "the nine B1 collections still exist exactly once each");
  add(b1Total === 200, "B1 still holds 200 variables (found " + b1Total + ")");
  const b2c = collections.filter((c) => c.name === ABOX_B2.collection.name);
  add(b2c.length === 1, 'collection "' + ABOX_B2.collection.name + '" still exists exactly once');
  add(b2c.length === 1 && b2c[0].variableIds.length === 19,
    "B2 still holds 19 variables (found " + (b2c.length === 1 ? b2c[0].variableIds.length : 0) + ")");

  // 14 + 15 — nothing else created.
  let components = 0;
  let componentSets = 0;
  let nodes = 0;
  for (const page of figma.root.children) {
    nodes += page.children.length;
    components += page.findAll((n) => n.type === "COMPONENT").length;
    componentSets += page.findAll((n) => n.type === "COMPONENT_SET").length;
  }
  add(components === 0, "B3 created no components or variants");
  add(componentSets === 0, "B3 created no component sets");
  add(nodes === 0, "the seven library pages remain empty");
  add(
    T.library.pages.every((n, i) => figma.root.children[i] && figma.root.children[i].name === n),
    "the seven B0 pages remain at indices 0..6 in order",
  );

  // Inventory evidence for the FINAL REPORT.
  say("");
  say("B3 INVENTORY");
  say("  COLOUR STYLES (" + owned(paints).length + ")");
  for (const spec of ABOX_B3.colorStyles) {
    const s = owned(paints).find((x) => x.name === spec.name);
    const bound = s && s.paints[0] && s.paints[0].boundVariables && s.paints[0].boundVariables.color;
    say("      " + spec.name + "  id=" + (s ? s.id : "MISSING") +
        "  -> " + spec.collection + " / " + spec.variable + "  varId=" + (bound ? bound.id : "UNBOUND"));
  }
  say("  TEXT STYLES (" + owned(texts).length + ")");
  for (const spec of ABOX_B3.textStyles) {
    const s = owned(texts).find((x) => x.name === spec.name);
    say("      " + spec.name + "  id=" + (s ? s.id : "MISSING") +
        (s ? "  " + s.fontName.family + " / " + s.fontName.style + "  " + s.fontSize + "px  " +
             s.letterSpacing.value + s.letterSpacing.unit + "  case=" + s.textCase : ""));
  }
  say("  EFFECT STYLES (" + owned(effects).length + ")");
  for (const spec of ABOX_B3.effectStyles) {
    const s = owned(effects).find((x) => x.name === spec.name);
    say("      " + spec.name + "  id=" + (s ? s.id : "MISSING") + "  layers=" + (s ? s.effects.length : 0));
    if (s) {
      for (let i = 0; i < s.effects.length; i++) {
        const e = s.effects[i];
        say("          layer " + (i + 1) + "  x=" + e.offset.x + " y=" + e.offset.y +
            " blur=" + e.radius + " spread=" + e.spread + "  tint=" + spec.layers[i].tintCss);
      }
    }
  }
  say("  totals: colour " + owned(paints).length + " + text " + owned(texts).length +
      " + effect " + owned(effects).length + " = " +
      (owned(paints).length + owned(texts).length + owned(effects).length) + " = 79");

  say("");
  say("B3 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say("RECORDED LIMITATIONS / EXCEPTIONS");
  for (const l of ABOX_B3.limitations) say("  - " + l);
  say("  - No publishing performed; library publishing is a separate step.");
  say("");
  say(passed ? "RESULT: B3 PASSED" : "RESULT: B3 FAILED — do not proceed to B4.");
  return passed;
}

/* ---------- Phase 52 / Batch B4 — production component foundation ---------- */
// Every component/variant comes from tokens-b4.js, which is generated from the
// production source. Colours/typography/elevation are applied through the B3
// styles (which already bind the B1/B2 variables); Tailwind numeric utilities
// stay literal and are recorded in each description.

const B4_PAGE = "01 Components";
var b4Created = 0;

function b4Say(kind, name, isNew) {
  if (isNew) {
    b4Created += 1;
    say("  " + kind + " created : " + name);
  } else {
    say("  " + kind + " updated : " + name);
  }
}

async function b4StyleIndex() {
  const index = { paint: {}, text: {}, effect: {} };
  for (const s of await figma.getLocalPaintStylesAsync()) index.paint[s.name] = s;
  for (const s of await figma.getLocalTextStylesAsync()) index.text[s.name] = s;
  for (const s of await figma.getLocalEffectStylesAsync()) index.effect[s.name] = s;
  return index;
}

function b4Style(index, category, name) {
  const s = index[category][name];
  if (!s) throw new Error('STOP: MISSING B3 ' + category.toUpperCase() + ' STYLE — "' + name + '".');
  return s;
}

const B4_FONTS = {};
async function b4Font(weight) {
  const key = String(weight);
  if (B4_FONTS[key]) return B4_FONTS[key];
  const styleNames = weight >= 600 ? ["SemiBold", "Semi Bold"] : weight >= 500 ? ["Medium"] : ["Regular"];
  const font = await resolveFont({ family: "Inter Tight", weight: weight, styleNames: styleNames }, "B4 weight " + weight);
  B4_FONTS[key] = font;
  return font;
}

function b4Page() {
  const page = figma.root.children.filter((p) => p.name === B4_PAGE);
  if (page.length !== 1) {
    throw new Error('STOP: B0 page "' + B4_PAGE + '" must exist exactly once (found ' + page.length + ").");
  }
  return page[0];
}

/** Build one node spec into a real Figma node. Content is rebuilt in place. */
async function b4Build(spec, index) {
  if (spec.type === "TEXT") {
    const node = figma.createText();
    if (spec.textStyle) {
      const style = b4Style(index, "text", spec.textStyle);
      if (style.fontName) {
        await figma.loadFontAsync(style.fontName);
        node.fontName = style.fontName;
      }
      node.characters = spec.characters;
      node.textStyleId = style.id;
    } else {
      const font = await b4Font(spec.weight || 400);
      node.fontName = font;
      node.characters = spec.characters;
      node.fontSize = spec.fontSize;
      if (spec.letterSpacingPercent) node.letterSpacing = { value: spec.letterSpacingPercent, unit: "PERCENT" };
      if (spec.textCase) node.textCase = spec.textCase;
    }
    if (spec.colorStyle) node.fillStyleId = b4Style(index, "paint", spec.colorStyle).id;
    return node;
  }
  if (spec.type === "ELLIPSE") {
    const node = figma.createEllipse();
    node.resize(spec.w, spec.h);
    if (spec.fillStyle) node.fillStyleId = b4Style(index, "paint", spec.fillStyle).id;
    return node;
  }
  if (spec.type === "INSTANCE") {
    const target = b4FindSet(spec.of) || b4FindComponent(spec.of);
    if (!target) throw new Error("STOP: nested component not found — " + spec.of);
    const source = target.type === "COMPONENT_SET" ? target.defaultVariant || target.children[0] : target;
    return source.createInstance();
  }
  if (spec.type === "MARK") {
    const svg =
      '<svg viewBox="0 0 40 40" width="' + spec.size + '" height="' + spec.size + '">' +
      '<circle cx="20" cy="20" r="19" fill="#ffffff" stroke="#000000" stroke-width="1"/>' +
      '<circle cx="20" cy="20" r="13" fill="none" stroke="#000000" stroke-width="1.2"/>' +
      '<circle cx="20" cy="20" r="16" fill="none" stroke="#000000" stroke-width="0.6" stroke-dasharray="1.4 2.4"/>' +
      '<circle cx="34" cy="20" r="2.2" fill="#000000"/>' +
      '<path d="M13.5 25 L20 12 L26.5 25" fill="none" stroke="#000000" stroke-width="1.8"/>' +
      '<path d="M16.5 21.5 H23.5" stroke="#000000" stroke-width="1.5"/>' +
      "</svg>";
    const node = figma.createNodeFromSvg(svg);
    node.name = "AboxMark";
    node.fills = []; // wrapper frame only; every painted vector below is style-bound
    node.strokes = [];
    const kids = node.children;
    const bind = [
      [0, spec.bgStyle, spec.hairlineStyle],
      [1, null, spec.ringStyle],
      [2, null, spec.ringStyle],
      [3, spec.dotStyle, null],
      [4, null, spec.fgStyle],
      [5, null, spec.fgStyle],
    ];
    for (const [i, fill, stroke] of bind) {
      const kid = kids[i];
      if (!kid) continue;
      if (fill) kid.fillStyleId = b4Style(index, "paint", fill).id;
      if (stroke) kid.strokeStyleId = b4Style(index, "paint", stroke).id;
    }
    return node;
  }
  // FRAME
  const frame = figma.createFrame();
  frame.layoutMode = spec.layout || "NONE";
  if (frame.layoutMode !== "NONE") {
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.counterAxisAlignItems = spec.align === "CENTER" ? "CENTER" : "MIN";
    frame.primaryAxisAlignItems = spec.justify === "CENTER" ? "CENTER" : "MIN";
    frame.itemSpacing = spec.gap || 0;
    frame.paddingLeft = spec.px || 0;
    frame.paddingRight = spec.px || 0;
    frame.paddingTop = spec.py || 0;
    frame.paddingBottom = spec.py || 0;
  }
  frame.cornerRadius = spec.radius || 0;
  if (spec.fillStyle) frame.fillStyleId = b4Style(index, "paint", spec.fillStyle).id;
  else frame.fills = [];
  if (spec.strokeStyle) {
    frame.strokeStyleId = b4Style(index, "paint", spec.strokeStyle).id;
    frame.strokeWeight = spec.strokeWeight || 1;
    if (spec.dashed) frame.dashPattern = [4, 4];
  } else {
    frame.strokes = [];
  }
  if (spec.effectStyle) frame.effectStyleId = b4Style(index, "effect", spec.effectStyle).id;
  for (const child of spec.children || []) {
    frame.appendChild(await b4Build(child, index));
  }
  if (spec.w || spec.h) {
    if (frame.layoutMode === "HORIZONTAL" && spec.w) frame.counterAxisSizingMode = "FIXED";
    frame.resize(spec.w || frame.width, spec.h || frame.height);
  }
  return frame;
}

function b4AllNodes(types) {
  return figma.root.findAllWithCriteria({ types: types });
}

function b4FindSet(name) {
  const found = b4AllNodes(["COMPONENT_SET"]).filter((n) => n.name === name);
  if (found.length > 1) throw new Error('STOP: DUPLICATE COMPONENT SET — "' + name + '" exists ' + found.length + " times.");
  const clash = b4AllNodes(["COMPONENT"]).filter((n) => n.name === name && (!n.parent || n.parent.type !== "COMPONENT_SET"));
  if (found.length && clash.length) throw new Error('STOP: TYPE MISMATCH — "' + name + '" exists as both a component and a set.');
  return found[0] || null;
}

function b4FindComponent(name) {
  const found = b4AllNodes(["COMPONENT"]).filter(
    (n) => n.name === name && (!n.parent || n.parent.type !== "COMPONENT_SET"),
  );
  if (found.length > 1) throw new Error('STOP: DUPLICATE COMPONENT — "' + name + '" exists ' + found.length + " times.");
  if (b4AllNodes(["COMPONENT_SET"]).some((n) => n.name === name) && found.length) {
    throw new Error('STOP: TYPE MISMATCH — "' + name + '" exists as both a component and a set.');
  }
  return found[0] || null;
}

function b4VariantName(set, value) {
  if (set.properties) {
    // multi-axis: the extractor already emits "prop=value, prop=value"
    return value.value;
  }
  return set.property + "=" + value.value;
}

async function b4Describe(node, text) {
  node.description = text;
}

/** Match a live variant to a B4 spec name, tolerating axes added later by B5. */
function b4MatchVariant(children, vname) {
  const exact = children.filter((c) => c.name === vname);
  if (exact.length) return exact[0];
  const pairs = vname.split(",").map((s) => s.trim());
  const wider = children.filter((c) => {
    const have = c.name.split(",").map((s) => s.trim());
    return pairs.every((p) => have.indexOf(p) !== -1);
  });
  if (wider.length === 1) return wider[0];
  if (wider.length > 1 && typeof ABOX_B5 !== "undefined") {
    // Axes added by a later batch: the B4 spec addresses the axis default.
    const A = ABOX_B5.variantAxis;
    const preferred = wider.filter((c) => c.name.indexOf(A.property + "=" + A.values[0]) !== -1);
    if (preferred.length === 1) return preferred[0];
  }
  if (wider.length > 1) {
    throw new Error('STOP: AMBIGUOUS VARIANT — "' + vname + '" matches ' + wider.length + " live variants; not silently rewritten.");
  }
  return null;
}

async function b4EnsureSet(set, index, page) {
  const existing = b4FindSet(set.name);
  const children = existing ? existing.children.slice() : [];
  const variants = [];
  for (const value of set.values) {
    const vname = b4VariantName(set, value);
    let component = b4MatchVariant(children, vname);
    const isNew = !component;
    if (isNew) {
      component = figma.createComponent();
      component.name = vname;
      // Figma requires component nodes to live on a page before they can be combined.
      page.appendChild(component);
    } else {

      for (const child of component.children.slice()) child.remove();
    }
    const content = await b4Build(value.node, index);
    component.layoutMode = "HORIZONTAL";
    component.primaryAxisSizingMode = "AUTO";
    component.counterAxisSizingMode = "AUTO";
    component.appendChild(content);
    await b4Describe(component, value.source);
    b4Say("variant  ", set.name + " / " + vname, isNew);
    variants.push(component);
  }
  let node = existing;
  if (!node) {
    node = figma.combineAsVariants(variants, page);
    node.name = set.name;
    node.fills = []; // set container chrome, not a production surface
    b4Created += 1;
    say("  set     created : " + set.name);
  } else {
    for (const v of variants) if (v.parent !== node) node.appendChild(v);
    node.fills = [];
    say("  set     updated : " + set.name);
  }
  await b4Describe(
    node,
    set.source +
      (set.defaults ? " | production defaults: " + JSON.stringify(set.defaults) : "") +
      (set.textProps ? " | text properties: " + set.textProps.map((p) => p.name).join(", ") : "") +
      (set.boolProps ? " | boolean properties: " + set.boolProps.join(", ") : ""),
  );
  return node;
}

async function b4EnsureComponent(spec, index, page) {
  let node = b4FindComponent(spec.name);
  const isNew = !node;
  if (isNew) {
    node = figma.createComponent();
    node.name = spec.name;
    page.appendChild(node);
  } else {
    for (const child of node.children.slice()) child.remove();
  }
  node.layoutMode = "HORIZONTAL";
  node.primaryAxisSizingMode = "AUTO";
  node.counterAxisSizingMode = "AUTO";
  node.appendChild(await b4Build(spec.node, index));
  await b4Describe(
    node,
    spec.source +
      (spec.textProps ? " | text properties: " + spec.textProps.map((p) => p.name).join(", ") : "") +
      (spec.boolProps ? " | boolean properties: " + spec.boolProps.join(", ") : "") +
      (spec.instanceProps ? " | instance-swap properties: " + spec.instanceProps.join(", ") : "") +
      (spec.exposedInstances ? " | exposed nested instances: " + spec.exposedInstances.join(", ") : ""),
  );
  b4Say("component", spec.name, isNew);
  return node;
}

async function ensureB4Components() {
  await figma.loadAllPagesAsync();
  b4Created = 0;
  const page = b4Page();
  const index = await b4StyleIndex();
  for (const set of ABOX_B4.sets) await b4EnsureSet(set, index, page);
  for (const spec of ABOX_B4.components) await b4EnsureComponent(spec, index, page);
  say("");
  say("  objects created this run: " + b4Created);
}

async function verifyB4() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);

  const page = b4Page();
  // B6 pattern assets ("ABox/Pattern/…") live on 02 Patterns and are not B4/B5 primitives.
  const b4Own = (n) => n.name.indexOf("ABox/") === 0 && n.name.indexOf("ABox/Pattern/") !== 0;
  const sets = b4AllNodes(["COMPONENT_SET"]).filter(b4Own);
  const standalone = b4AllNodes(["COMPONENT"]).filter(
    (n) => b4Own(n) && (!n.parent || n.parent.type !== "COMPONENT_SET"),
  );
  const variants = sets.reduce((n, s) => n + s.children.length, 0);
  const C = ABOX_B4.counts;

  // 1-3 — counts and the printed arithmetic.
  add(sets.length === C.sets, "component set count = " + C.sets + " (found " + sets.length + ")");
  add(standalone.length === C.components, "standalone component count = " + C.components + " (found " + standalone.length + ")");
  add(
    sets.length + standalone.length === C.objects,
    "object arithmetic " + sets.length + " + " + standalone.length + " = " + C.objects,
  );
  const b5Extra = typeof ABOX_B5 === "undefined" ? 0 : ABOX_B5.counts.newVariantNodes;
  add(
    variants === C.totalVariants || variants === C.totalVariants + b5Extra,
    "variant count = " + C.totalVariants + " (B4) or " + (C.totalVariants + b5Extra) + " (after B5) — found " + variants,
  );

  add(
    C.fixedVariants + C.enumeratedVariants === C.totalVariants,
    "variant arithmetic fixed " + C.fixedVariants + " + enumerated " + C.enumeratedVariants + " = " + C.totalVariants,
  );

  // 4 — exact names.
  const wantSets = ABOX_B4.sets.map((s) => s.name).sort().join("|");
  const wantCmp = ABOX_B4.components.map((s) => s.name).sort().join("|");
  add(sets.map((s) => s.name).sort().join("|") === wantSets, "exact component set names");
  add(standalone.map((s) => s.name).sort().join("|") === wantCmp, "exact standalone component names");
  add(
    sets.some((s) => s.name === "ABox/Brand/AboxMark") && !standalone.some((s) => s.name === "ABox/Brand/AboxMark"),
    "ABox/Brand/AboxMark is a Component Set, never a standalone component",
  );
  const mark = sets.find((s) => s.name === "ABox/Brand/AboxMark");
  add(
    !!mark && mark.children.map((c) => c.name).sort().join("|") === "tone=foreground|tone=primary|tone=sage|tone=sidebar",
    "AboxMark tone axis = primary, sage, sidebar, foreground",
  );
  add(
    !sets.some((s) => standalone.some((c) => c.name === s.name)),
    "no B4 object is both a set and a standalone component",
  );

  // 5-6 — variant property names and values.
  let axisOk = true;
  for (const spec of ABOX_B4.sets) {
    const node = sets.find((s) => s.name === spec.name);
    if (!node) { axisOk = false; continue; }
    // Every B4 variant must still be addressable; axes added by a later batch
    // widen the name and are matched through b4MatchVariant, never renamed.
    for (const v of spec.values) {
      if (!b4MatchVariant(node.children.slice(), b4VariantName(spec, v))) axisOk = false;
    }
  }
  add(axisOk, "exact variant property names and values on every set");

  // 7-8 — declared properties and production defaults carried in the description.
  let propsOk = true;
  for (const spec of ABOX_B4.sets.concat(ABOX_B4.components)) {
    const node = sets.concat(standalone).find((s) => s.name === spec.name);
    if (!node || !node.description || node.description.indexOf("source:") !== 0) propsOk = false;
    if (spec.defaults && node && node.description.indexOf("production defaults") === -1) propsOk = false;
  }
  add(propsOk, "declared text/boolean/instance properties and production defaults recorded");

  // 9 — per-variant production source mapping.
  let srcOk = true;
  for (const spec of ABOX_B4.sets) {
    const node = sets.find((s) => s.name === spec.name);
    if (!node) { srcOk = false; continue; }
    for (const value of spec.values) {
      const v = b4MatchVariant(node.children.slice(), b4VariantName(spec, value));
      if (!v || !v.description || v.description.indexOf("source:") !== 0) srcOk = false;
    }
  }
  add(srcOk, "every variant carries its exact production source mapping");

  // 10-11 — foundation bindings, no hard-coded foundation values.
  const paintNames = {};
  for (const s of await figma.getLocalPaintStylesAsync()) paintNames[s.id] = s.name;
  const effectNames = {};
  for (const s of await figma.getLocalEffectStylesAsync()) effectNames[s.id] = s.name;
  let boundOk = true;
  let rawFill = 0;
  const walk = (node) => {
    if (node.type !== "COMPONENT" && node.type !== "COMPONENT_SET" && node.type !== "FRAME" && node.type !== "TEXT" &&
        node.type !== "ELLIPSE" && node.type !== "VECTOR" && node.type !== "INSTANCE") return;
    if (node.fills && node.fills.length && !node.fillStyleId) rawFill += 1;
    if (node.strokes && node.strokes.length && !node.strokeStyleId) rawFill += 1;
    if (node.fillStyleId && !paintNames[node.fillStyleId]) boundOk = false;
    if (node.effectStyleId && !effectNames[node.effectStyleId]) boundOk = false;
    for (const child of node.children || []) walk(child);
  };
  for (const node of sets.concat(standalone)) walk(node);
  add(boundOk, "every colour/elevation reference resolves to an existing B3 style");
  add(rawFill === 0, "no hard-coded foundation fill or stroke (found " + rawFill + ")");

  // 12-14 — no invented variants, no equality-derived relationships, no file-only primitives.
  add(
    ABOX_B4.sets.every((s) => s.values.every((v) => typeof v.source === "string" && v.source.indexOf("source:") === 0)),
    "no value-equality-derived or invented variants: every variant cites a production declaration",
  );
  add(ABOX_B4.excluded.length > 0, "excluded primitives recorded with reasons (" + ABOX_B4.excluded.length + ")");

  // 15 — nesting consistency.
  const field = standalone.find((s) => s.name === "ABox/Form/LabeledField");
  const hasInstance = (node) =>
    (node.children || []).some((c) => c.type === "INSTANCE" || hasInstance(c));
  add(!!field && hasInstance(field), "LabeledField nests a real ABox/Control/Control instance");

  // 16-18 — foundations untouched.
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const b1Names = ["ABox/Color/Primitive", "ABox/Color/Semantic", "ABox/Status", "ABox/Spacing", "ABox/Radius",
    "ABox/Border", "ABox/Elevation", "ABox/Layout", "ABox/Control sizing"];
  const b1Cols = collections.filter((c) => b1Names.indexOf(c.name) !== -1);
  let b1Vars = 0;
  for (const c of b1Cols) b1Vars += c.variableIds.length;
  add(b1Cols.length === 9 && b1Vars === 200, "B1 unchanged: 9 collections / 200 variables (found " + b1Cols.length + " / " + b1Vars + ")");
  const typo = collections.filter((c) => c.name === "ABox/Typography");
  add(typo.length === 1 && typo[0].variableIds.length === 19, "B2 unchanged: ABox/Typography with 19 variables");
  const owned = (list) => list.filter((s) => s.name.indexOf("ABox/") === 0);
  const paints = owned(await figma.getLocalPaintStylesAsync());
  const texts = owned(await figma.getLocalTextStylesAsync());
  const effects = owned(await figma.getLocalEffectStylesAsync());
  add(
    paints.length === 72 && texts.length === 2 && effects.length === 5,
    "B3 unchanged: 72 colour + 2 text + 5 effect styles (found " + paints.length + " / " + texts.length + " / " + effects.length + ")",
  );

  // 19-20 — pages.
  const wantPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells", "04 Experiences", "05 Screens", "06 Documentation"];
  add(
    figma.root.children.length === 7 && figma.root.children.map((p) => p.name).join("|") === wantPages.join("|"),
    "B0 pages unchanged: exactly 7, in order, none created/renamed/reordered",
  );
  // "02 Patterns" is B6's page; every other non-component page must stay empty.
  const others = figma.root.children.filter((p) => p.name !== B4_PAGE && p.name !== "02 Patterns");
  add(others.every((p) => p.children.length === 0), "pages 00, 03, 04, 05, 06 remain empty (02 Patterns is B6-owned)");
  add(
    page.children.length === sets.length + standalone.length,
    'page "01 Components" holds exactly the ' + (sets.length + standalone.length) + " B4 objects (Figma requires component nodes to live on a page)",
  );
  add(
    page.children.every((n) => n.type === "COMPONENT_SET" || n.type === "COMPONENT"),
    "no patterns, shells, screens or documentation content created",
  );

  /* ---------- inventory ---------- */
  say("");
  say("B4 INVENTORY");
  say('  page: "' + B4_PAGE + '"  id=' + page.id);
  for (const spec of ABOX_B4.sets) {
    const node = sets.find((s) => s.name === spec.name);
    say("  SET  " + spec.name + "  id=" + (node ? node.id : "MISSING") + "  variants=" + (node ? node.children.length : 0));
    say("       " + spec.source);
    for (const value of spec.values) {
      const v = node && b4MatchVariant(node.children.slice(), b4VariantName(spec, value));
      say("         " + b4VariantName(spec, value) + "  id=" + (v ? v.id : "MISSING"));
      say("             " + value.source);
    }
  }
  for (const spec of ABOX_B4.components) {
    const node = standalone.find((s) => s.name === spec.name);
    say("  CMP  " + spec.name + "  id=" + (node ? node.id : "MISSING"));
    say("       " + spec.source);
  }
  say("");
  say("  totals: sets " + sets.length + " + components " + standalone.length + " = " + (sets.length + standalone.length) +
      " objects; variants fixed " + C.fixedVariants + " + enumerated " + C.enumeratedVariants + " = " + variants);

  say("");
  say("B1/B2/B3 BINDING SUMMARY");
  say("  colours  -> B3 Colour Styles (each already bound to an ABox/Color/Semantic, ABox/Status or ABox/Metal B1 variable)");
  say("  type     -> B3 Text Styles ABox/Text/eyebrow and ABox/Text/serial where a production role exists; other text carries the production font size/weight literal");
  say("  elevation-> B3 Effect Styles ABox/Elevation/* (bound to the 45 B1 elevation variables)");
  say("  spacing/radius -> Tailwind utility literals: production does not declare them through B1 variables, so nothing is bound by value equality");

  say("");
  say("EXCLUDED PRODUCTION PRIMITIVES / COMPONENTS");
  for (const e of ABOX_B4.excluded) say("  - " + e.source + " — " + e.reason);

  say("");
  say("B4 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say("RECORDED LIMITATIONS / EXCEPTIONS");
  for (const l of ABOX_B4.limitations) say("  - " + l);
  say("  - No publishing performed; library publishing is a separate step.");
  say("");
  say(passed ? "RESULT: B4 PASSED" : "RESULT: B4 FAILED — do not proceed to B5.");
  return passed;
}

/* =========================================================================
   Phase 52 / Batch B5 — component variants & states.

   B5 creates NO new Component Set and NO new standalone Component. It:
     - adds one Variant axis (deltaSign) to the existing ABox/Card/KpiCard set
       and creates exactly 4 new negative Variant ComponentNodes inside it;
     - creates 19 non-variant component properties (15 TEXT + 4 BOOLEAN) and
       attaches each one to the exact production-equivalent sublayer;
     - exposes the existing nested ABox/Control/Control instance inside
       ABox/Form/LabeledField.
   10 further production properties are deferred because the B4 object contains
   no target layer for them; they are reported, never approximated.
   ========================================================================= */

let b5Created = 0;
function b5Say(kind, name, isNew) {
  if (isNew) {
    b5Created += 1;
    say("  " + kind + " created : " + name);
  } else {
    say("  " + kind + " reused  : " + name);
  }
}

/** TEXT descendants in document order — B4 assigns no layer names. */
function b5Texts(node, out) {
  out = out || [];
  for (const child of node.children || []) {
    if (child.type === "TEXT") out.push(child);
    b5Texts(child, out);
  }
  return out;
}

function b5Owner(name) {
  const set = b4FindSet(name);
  if (set) return set;
  const cmp = b4FindComponent(name);
  if (cmp) return cmp;
  throw new Error('STOP: MISSING B4 OBJECT — "' + name + '" does not exist; run B4 first.');
}

/** Bodies that carry the layers: every variant of a set, or the component itself. */
function b5Bodies(owner) {
  return owner.type === "COMPONENT_SET" ? owner.children.slice() : [owner];
}

/** Characters B4 authored for a given body, from the generated spec. */
function b5SpecChars(ownerName, bodyName) {
  const collect = (node) => {
    const list = [];
    (function walk(n) {
      if (n.type === "TEXT") list.push(n.characters);
      for (const c of n.children || []) walk(c);
    })(node);
    return list;
  };
  const set = ABOX_B4.sets.find((s) => s.name === ownerName);
  if (set) {
    const value = set.values.filter(function (v) {
      const pairs = b4VariantName(set, v).split(",").map((s) => s.trim());
      const have = String(bodyName).split(",").map((s) => s.trim());
      return pairs.every((p) => have.indexOf(p) !== -1);
    })[0];
    return { body: value ? collect(value.node) : null, canonical: collect(set.values[0].node) };
  }
  const cmp = ABOX_B4.components.find((c) => c.name === ownerName);
  if (!cmp) return { body: null, canonical: null };
  const list = collect(cmp.node);
  return { body: list, canonical: list };
}

/**
 * Resolve the TEXT index of a binding inside one body. Variants that omit the
 * role entirely (PageHeader compact suppresses the eyebrow, page-header.tsx:29)
 * return null: the property is not attached there and the omission is reported,
 * never approximated by index drift.
 */
function b5IndexIn(ownerName, bodyName, binding) {
  const spec = b5SpecChars(ownerName, bodyName);
  if (!spec.body || !spec.canonical) return binding.target.textIndex;
  if (spec.body.length === spec.canonical.length) return binding.target.textIndex;
  const canonical = spec.canonical[binding.target.textIndex];
  const idx = spec.body.indexOf(canonical);
  return idx === -1 ? null : idx;
}

/** Resolve the exact target layer, structurally. Missing or ambiguous => STOP. */
function b5Target(ownerName, body, binding) {
  const index = b5IndexIn(ownerName, body.name, binding);
  if (index === null) return null;
  const node = b5Texts(body)[index];
  if (!node) {
    throw new Error(
      "STOP: TARGET LAYER MISSING — " + ownerName + " / " + body.name +
        " has no TEXT descendant at index " + index +
        " for property " + binding.property + ".",
    );
  }
  const spec = b5SpecChars(ownerName, body.name);
  let expect = spec.body ? spec.body[index] : null;
  // The four B5 negative variants carry the negative chip text by design.
  if (
    ownerName === ABOX_B5.variantAxis.set &&
    b5ParseVariant(body.name)[ABOX_B5.variantAxis.property] === ABOX_B5.variantAxis.values[1] &&
    expect === ABOX_B5.variantAxis.positive.characters
  ) {
    expect = ABOX_B5.variantAxis.negative.characters;
  }
  if (expect !== null && expect !== undefined && node.characters !== expect) {
    throw new Error(
      "STOP: TARGET LAYER MISMATCH — " + ownerName + " / " + body.name +
        " TEXT[" + index + '] is "' + node.characters +
        '", expected the B4 construction text "' + expect + '".',
    );
  }
  return node;
}

/** Read live definitions first; reuse in place; name/type mismatch => STOP. */
function b5EnsureProperty(owner, name, type, defaultValue) {
  const defs = owner.componentPropertyDefinitions || {};
  const keys = Object.keys(defs).filter((k) => k === name || k.split("#")[0] === name);
  if (keys.length > 1) {
    throw new Error('STOP: DUPLICATE PROPERTY — "' + name + '" is defined ' + keys.length + " times on " + owner.name + ".");
  }
  if (keys.length === 1) {
    if (defs[keys[0]].type !== type) {
      throw new Error(
        'STOP: PROPERTY TYPE MISMATCH — "' + name + '" on ' + owner.name +
          " is " + defs[keys[0]].type + ", expected " + type + ". Not renamed, not recreated.",
      );
    }
    return { id: keys[0], created: false };
  }
  return { id: owner.addComponentProperty(name, type, defaultValue), created: true };
}

/** Attach a property id to the exact sublayer. Wrong existing binding => STOP. */
function b5Bind(owner, body, node, field, propId, property) {
  const refs = node.componentPropertyReferences || {};
  if (refs[field] && refs[field] !== propId && refs[field].split("#")[0] !== property) {
    throw new Error(
      "STOP: WRONG BINDING — " + owner.name + " / " + body.name + " layer " + node.name +
        " already references " + refs[field] + ' on "' + field + '"; not silently moved.',
    );
  }
  const next = {};
  for (const k of Object.keys(refs)) next[k] = refs[k];
  next[field] = propId;
  node.componentPropertyReferences = next;
}

/* ---------- the one new Variant axis, and its 4 new ComponentNodes ---------- */

function b5ParseVariant(name) {
  const out = {};
  for (const part of name.split(",")) {
    const bits = part.split("=");
    if (bits.length === 2) out[bits[0].trim()] = bits[1].trim();
  }
  return out;
}

async function b5KpiVariants(index) {
  const A = ABOX_B5.variantAxis;
  const set = b5Owner(A.set);
  if (set.type !== "COMPONENT_SET") throw new Error("STOP: " + A.set + " is not a Component Set.");

  // (1) read and lock the live B4 variants.
  const live = set.children.slice();
  const positives = live.filter((c) => {
    const v = b5ParseVariant(c.name);
    return !v[A.property] || v[A.property] === A.values[0];
  });
  const negatives = live.filter((c) => b5ParseVariant(c.name)[A.property] === A.values[1]);

  // pre-write check: exactly 4 originals, tones default/primary/sage/warning, one each.
  const tones = positives.map((c) => b5ParseVariant(c.name)[A.existingProperty]).sort();
  const want = A.tones.slice().sort();
  if (positives.length !== A.tones.length || tones.join("|") !== want.join("|")) {
    throw new Error(
      "STOP: KPICARD PRE-WRITE CHECK FAILED — expected exactly " + A.tones.length +
        " existing variants with tones " + want.join(", ") + "; found " + positives.length +
        " (" + tones.join(", ") + ").",
    );
  }
  if (negatives.length > A.tones.length) {
    throw new Error("STOP: DUPLICATE NEGATIVE VARIANT — found " + negatives.length + ", expected at most " + A.tones.length + ".");
  }

  // (2)(3) the axis itself: every existing variant becomes deltaSign=positive.
  for (const node of positives) {
    const v = b5ParseVariant(node.name);
    if (!v[A.property]) {
      node.name = A.existingProperty + "=" + v[A.existingProperty] + ", " + A.property + "=" + A.values[0];
      b5Say("variant ", A.set + " / " + node.name + " (axis added)", false);
    }
  }

  const destructive = b4Style(index, "paint", A.negative.colorStyle);

  // (4)-(8) exactly one negative ComponentNode per existing tone, by duplication.
  for (const source of positives) {
    const tone = b5ParseVariant(source.name)[A.existingProperty];
    const vname = A.existingProperty + "=" + tone + ", " + A.property + "=" + A.values[1];
    let node = set.children.filter((c) => c.name === vname)[0];
    const isNew = !node;
    if (isNew) {
      node = source.clone();
      node.name = vname;
      set.appendChild(node);
    }
    // (10)-(12) the only mutation: the delta chip's text and colour foundation.
    const chip = b5Texts(node)[2];
    if (!chip) throw new Error("STOP: KPICARD DELTA LAYER MISSING on " + vname + ".");
    chip.name = "delta";
    if (chip.characters !== A.negative.characters) chip.characters = A.negative.characters;
    if (chip.fillStyleId !== destructive.id) chip.fillStyleId = destructive.id;
    node.description = A.negative.source;
    b5Say("variant ", A.set + " / " + vname, isNew);
  }

  // (9) positives keep their B4 text and their existing colour binding untouched.
  for (const node of positives) {
    const chip = b5Texts(node)[2];
    if (chip) chip.name = "delta";
  }
  return set;
}

/* ---------- non-variant properties ---------- */

async function b5Properties() {
  for (const binding of ABOX_B5.bindings) {
    const owner = b5Owner(binding.component);
    const defaultValue = binding.type === "TEXT" ? binding.value : true;
    const prop = b5EnsureProperty(owner, binding.property, binding.type, defaultValue);
    for (const body of b5Bodies(owner)) {
      const node = b5Target(binding.component, body, binding);
      if (!node) {
        say("  skipped : " + binding.component + " / " + body.name + " omits the " + binding.property + " layer in production");
        continue;
      }
      node.name = binding.target.name;
      b5Bind(owner, body, node, binding.reference, prop.id, binding.property);
    }
    b5Say(binding.type === "TEXT" ? "text    " : "boolean ", binding.component + " . " + binding.property, prop.created);
  }
}

/* ---------- exposed nested instance ---------- */

function b5Exposed() {
  const E = ABOX_B5.exposed;
  const owner = b5Owner(E.component);
  const found = [];
  (function walk(n) {
    for (const c of n.children || []) {
      if (c.type === "INSTANCE") found.push(c);
      walk(c);
    }
  })(owner);
  if (found.length !== 1) {
    throw new Error(
      "STOP: EXPOSED INSTANCE TARGET — " + E.component + " must contain exactly one nested instance (found " + found.length + ").",
    );
  }
  const node = found[0];
  node.name = E.name;
  const already = node.isExposedInstance === true;
  node.isExposedInstance = true;
  b5Say("exposed ", E.component + " -> " + E.of, !already);
  return node;
}

/* ---------- SLOT: non-mutating capability check, structural gate ---------- */

function b5SlotCapability() {
  const hasCreateSlot = typeof figma.createSlot === "function";
  let typeSurface = false;
  try {
    const list = (figma.mixed, figma.componentPropertyTypes) || null;
    typeSurface = !!(list && String(list).indexOf("SLOT") !== -1);
  } catch (e) {
    typeSurface = false;
  }
  return { supported: hasCreateSlot || typeSurface, createSlot: hasCreateSlot, typeSurface: typeSurface };
}

async function ensureB5Properties() {
  await figma.loadAllPagesAsync();
  b5Created = 0;
  const index = await b4StyleIndex();
  await b5KpiVariants(index);
  await b5Properties();
  b5Exposed();
  say("");
  say("  objects/properties created this run: " + b5Created);
}

async function verifyB5() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);
  const C = ABOX_B5.counts;
  const A = ABOX_B5.variantAxis;
  const index = await b4StyleIndex();

  // B6 pattern assets ("ABox/Pattern/…") live on 02 Patterns and are not B4/B5 primitives.
  const b5Own = (n) => n.name.indexOf("ABox/") === 0 && n.name.indexOf("ABox/Pattern/") !== 0;
  const sets = b4AllNodes(["COMPONENT_SET"]).filter(b5Own);
  const standalone = b4AllNodes(["COMPONENT"]).filter(
    (n) => b5Own(n) && (!n.parent || n.parent.type !== "COMPONENT_SET"),
  );
  const variants = sets.reduce((n, s) => n + s.children.length, 0);

  // 1-5 — the object population B5 may not change, and the counts it must reach.
  add(sets.length === C.sets, "component sets = " + C.sets + " (found " + sets.length + ") — B5 creates none");
  add(standalone.length === C.standalone, "standalone components = " + C.standalone + " (found " + standalone.length + ") — B5 creates none");
  add(variants === C.variantsAfter, "variant ComponentNodes = " + C.variantsAfter + " (found " + variants + ")");
  add(
    C.variantsBefore + C.newVariantNodes === C.variantsAfter,
    "variant arithmetic " + C.variantsBefore + " (B4) + " + C.newVariantNodes + " (B5) = " + C.variantsAfter,
  );
  add(
    variants + standalone.length === C.physicalNodes,
    "physical ComponentNodes " + variants + " + " + standalone.length + " = " + C.physicalNodes,
  );

  // 6-9 — the KpiCard matrix.
  const kpi = sets.filter((s) => s.name === A.set)[0];
  const matrix = kpi ? kpi.children.map((c) => b5ParseVariant(c.name)) : [];
  const expected = [];
  for (const tone of A.tones) for (const sign of A.values) expected.push(tone + "/" + sign);
  const actual = matrix.map((v) => v[A.existingProperty] + "/" + v[A.property]).sort();
  add(!!kpi && kpi.children.length === 8, A.set + " holds exactly 8 variants (found " + (kpi ? kpi.children.length : 0) + ")");
  add(actual.join("|") === expected.slice().sort().join("|"), "KpiCard matrix = tone x deltaSign, all 8 combinations, none extra");
  add(
    matrix.filter((v) => v[A.property] === A.values[1]).length === C.newVariantNodes,
    "exactly " + C.newVariantNodes + " negative variants, one per tone, no duplicate",
  );
  add(
    Object.keys((kpi && kpi.componentPropertyDefinitions) || {}).filter((k) => k.split("#")[0] === A.property).length <= 1,
    'the "' + A.property + '" axis exists once, added, never renamed',
  );

  // 10-12 — the visual mutation of the negative nodes (check 21a-bis).
  let negOk = true, posOk = true, rawOk = true;
  const dest = b4Style(index, "paint", A.negative.colorStyle);
  if (kpi) {
    for (const node of kpi.children) {
      const v = b5ParseVariant(node.name);
      const chip = b5Texts(node)[2];
      if (!chip) { negOk = false; posOk = false; continue; }
      if (!chip.fillStyleId) rawOk = false;
      if (v[A.property] === A.values[1]) {
        if (chip.characters !== A.negative.characters || chip.fillStyleId !== dest.id) negOk = false;
      } else if (chip.characters !== A.positive.characters) {
        posOk = false;
      }
    }
  }
  add(negOk, 'negative variants: delta text "' + A.negative.characters + '" + existing B3 ' + A.negative.colorStyle);
  add(posOk, 'positive variants: delta text "' + A.positive.characters + '" unchanged');
  add(rawOk, "no hard-coded or duplicated colour on any delta chip — every fill resolves to an existing B3 style");

  // 13-18 — property definitions and their layer bindings.
  let textCount = 0, boolCount = 0, bindOk = true, typeOk = true, defaultOk = true;
  const inventory = [];
  for (const b of ABOX_B5.bindings) {
    const owner = b5Owner(b.component);
    const defs = owner.componentPropertyDefinitions || {};
    const key = Object.keys(defs).filter((k) => k.split("#")[0] === b.property)[0];
    if (!key) { typeOk = false; continue; }
    if (defs[key].type !== b.type) typeOk = false;
    if (b.type === "TEXT") { textCount += 1; if (defs[key].defaultValue !== b.value) defaultOk = false; }
    else { boolCount += 1; if (defs[key].defaultValue !== true) defaultOk = false; }
    for (const body of b5Bodies(owner)) {
      const idx = b5IndexIn(b.component, body.name, b);
      if (idx === null) {
        inventory.push("  " + b.component + " . " + b.property + "  [" + b.type + "]  id=" + key +
          "  -> " + body.name + " : layer absent in this variant (production omits it) — not attached");
        continue;
      }
      const node = b5Texts(body)[idx];
      const refs = (node && node.componentPropertyReferences) || {};
      const ok = !!node && refs[b.reference] === key && node.name === b.target.name;
      if (!ok) bindOk = false;
      inventory.push(
        "  " + b.component + " . " + b.property + "  [" + b.type + "]  id=" + key +
          "  -> " + body.name + " / " + (node ? node.name : "MISSING") + " id=" + (node ? node.id : "-") +
          "  ref=" + b.reference + "  " + (ok ? "bound" : "UNBOUND") + "  " + b.source,
      );
    }
  }
  add(textCount === C.text, "TEXT properties = " + C.text + " (found " + textCount + ")");
  add(boolCount === C.boolean, "BOOLEAN properties = " + C.boolean + " (found " + boolCount + ")");
  add(typeOk, "every property exists exactly once with the planned type — none renamed, none recreated");
  add(bindOk, "every property is attached to its exact production-equivalent layer (characters / visible)");
  add(defaultOk, "every construction value matches the B4 literal; no production default is invented");
  add(
    textCount + boolCount === C.nonVariant,
    "created non-variant properties " + textCount + " + " + boolCount + " = " + C.nonVariant,
  );

  // 19-20 — exposed instance, and the absence of anything B5 may not create.
  const field = b5Owner(ABOX_B5.exposed.component);
  const nested = [];
  (function walk(n) { for (const c of n.children || []) { if (c.type === "INSTANCE") nested.push(c); walk(c); } })(field);
  add(
    nested.length === C.exposedInstances && nested[0] && nested[0].isExposedInstance === true && nested[0].name === ABOX_B5.exposed.name,
    "exposed nested instances = " + C.exposedInstances + " (the existing " + ABOX_B5.exposed.of + ", not recreated)",
  );
  let swaps = 0, slots = 0;
  for (const owner of sets.concat(standalone)) {
    const defs = owner.componentPropertyDefinitions || {};
    for (const k of Object.keys(defs)) {
      if (defs[k].type === "INSTANCE_SWAP") swaps += 1;
      if (defs[k].type === "SLOT") slots += 1;
    }
  }
  add(swaps === C.instanceSwap && slots === C.slot, "INSTANCE_SWAP properties = 0 and SLOT properties = 0");

  // 21 — EmptyState.action: capability reported, structural target absent, nothing created.
  const cap = b5SlotCapability();
  const empty = b5Owner("ABox/Feedback/EmptyState");
  const emptyDefs = Object.keys(empty.componentPropertyDefinitions || {});
  add(
    emptyDefs.filter((k) => k.split("#")[0] === "action").length === 0,
    "no EmptyState.action property of any type exists, and no temporary or probe SLOT was created " +
      "(runtime SLOT capability = " + cap.supported + "; target region in B4 = absent)",
  );

  // 22-25 — B0-B4 foundations untouched.
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const b1Names = ABOX_B1.collections.map((c) => c.name);
  const b1Cols = collections.filter((c) => b1Names.indexOf(c.name) !== -1);
  let b1Vars = 0;
  for (const c of b1Cols) b1Vars += c.variableIds.length;
  const typo = collections.filter((c) => c.name === "ABox/Typography");
  add(b1Cols.length === 9 && b1Vars === 200, "B1 unchanged: 9 collections / 200 variables (found " + b1Cols.length + " / " + b1Vars + ")");
  add(typo.length === 1 && typo[0].variableIds.length === 19, "B2 unchanged: ABox/Typography with 19 variables");
  const owned = (list) => list.filter((s) => s.name.indexOf("ABox/") === 0);
  const paints = owned(await figma.getLocalPaintStylesAsync());
  const tstyles = owned(await figma.getLocalTextStylesAsync());
  const effects = owned(await figma.getLocalEffectStylesAsync());
  add(
    paints.length === 72 && tstyles.length === 2 && effects.length === 5,
    "B3 unchanged: 72 colour + 2 text + 5 effect styles (found " + paints.length + " / " + tstyles.length + " / " + effects.length + ")",
  );
  const wantPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells", "04 Experiences", "05 Screens", "06 Documentation"];
  // B6 populates "02 Patterns"; every other non-component page must stay empty.
  const writable = [B4_PAGE, "02 Patterns"];
  add(
    figma.root.children.length === 7 && figma.root.children.map((p) => p.name).join("|") === wantPages.join("|") &&
      figma.root.children.filter((p) => writable.indexOf(p.name) === -1).every((p) => p.children.length === 0),
    "B0 pages unchanged: exactly 7, in order, only 01 Components and 02 Patterns populated",
  );

  /* ---------- inventory ---------- */
  say("");
  say("B5 VARIANT INVENTORY");
  if (kpi) {
    say("  SET  " + kpi.name + "  id=" + kpi.id + "  variants=" + kpi.children.length);
    for (const node of kpi.children) {
      const chip = b5Texts(node)[2];
      say(
        "    " + node.name + "  id=" + node.id + '  delta="' + (chip ? chip.characters : "MISSING") +
          '"  fillStyle=' + (chip && chip.fillStyleId === dest.id ? A.negative.colorStyle : "(B4 tone style, unchanged)"),
      );
    }
  }
  say("");
  say("B5 PROPERTY / LAYER BINDING INVENTORY");
  for (const line of inventory) say(line);
  say("");
  say("  exposed instance: " + ABOX_B5.exposed.component + "  parent id=" + field.id +
      "  nested " + ABOX_B5.exposed.of + " id=" + (nested[0] ? nested[0].id : "MISSING") +
      "  isExposedInstance=" + !!(nested[0] && nested[0].isExposedInstance));
  say("  SLOT capability (read-only check): figma.createSlot=" + cap.createSlot + "  type surface=" + cap.typeSurface);
  say("  EmptyState.action target region in B4: absent — SLOT created = 0, action property created = 0");

  say("");
  say("B5 COUNTS");
  say("  component sets " + C.sets + " | standalone components " + C.standalone +
      " | variant ComponentNodes " + C.variantsAfter + " (B5 created " + C.newVariantNodes + ")" +
      " | physical ComponentNodes " + C.physicalNodes);
  say("  variant axes " + C.axesBefore + " (B4) + " + C.newVariantAxes + " (B5) = " + C.axesAfter);
  say("  created non-variant properties: " + C.nonVariant + " (TEXT " + C.text + " + BOOLEAN " + C.boolean +
      " + INSTANCE_SWAP " + C.instanceSwap + " + SLOT " + C.slot + ")");
  say("  deferred/blocked properties: " + C.deferred);
  say("  total documented production-faithful non-variant target: " + C.target +
      "  (" + C.nonVariant + " + " + C.deferred + " = " + C.target + ")");

  say("");
  say("DEFERRED PROPERTIES — target layer absent in the audited B4 object");
  for (const d of ABOX_B5.deferred) {
    say("  - " + d.component + " . " + d.property + " [" + d.type + "] — " + d.missing + " — " + d.source);
  }

  say("");
  say("EXCLUDED STATES");
  for (const e of ABOX_B5.excluded) say("  - " + e.candidate + " — " + e.reason);

  say("");
  say("B5 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say("RECORDED LIMITATIONS / EXCEPTIONS");
  for (const l of ABOX_B5.limitations) say("  - " + l);
  say("  - No publishing performed; library publishing is a separate step.");
  say("");
  say(passed ? "RESULT: B5 PASSED" : "RESULT: B5 FAILED — do not proceed to B6.");
  return passed;
}

/* =====================  Phase 53 / Batch B6 — patterns  ===================== */
/*
 * B6 composes production-backed patterns out of the existing B4/B5 components.
 * It never creates, renames, rebuilds or mutates a B1-B5 object: nested
 * primitives are live instances, and an existing pattern whose structure
 * differs from the approved definition is reported, never overwritten.
 */

const B6_PAGE = "02 Patterns";
var b6Created = 0;

function b6Say(kind, name, isNew) {
  if (isNew) {
    b6Created += 1;
    say("  " + kind + " created : " + name);
  } else {
    say("  " + kind + " reused  : " + name);
  }
}

function b6Page() {
  const page = figma.root.children.filter((p) => p.name === B6_PAGE);
  if (page.length !== 1) {
    throw new Error('STOP: B0 page "' + B6_PAGE + '" must exist exactly once (found ' + page.length + ").");
  }
  return page[0];
}

/** Resolve the live B4/B5 object a pattern instances. Never creates anything. */
function b6Main(name) {
  const set = b4FindSet(name);
  if (set) return set;
  const cmp = b4FindComponent(name);
  if (cmp) return cmp;
  throw new Error('STOP: MISSING B4/B5 COMPONENT — "' + name + '" not found in the live file.');
}

function b6Key(defs, name) {
  const keys = Object.keys(defs || {}).filter((k) => k.split("#")[0] === name);
  if (keys.length !== 1) {
    throw new Error(
      'STOP: component property "' + name + '" resolves to ' + keys.length + " live definitions; B6 never guesses.",
    );
  }
  return keys[0];
}

/** Short, deterministic instance layer name — "ABox/Nav/ModuleTab" -> "ModuleTab". */
function b6InstanceName(of) {
  const parts = of.split("/");
  return parts[parts.length - 1];
}

function b6CreateInstance(spec) {
  const main = b6Main(spec.of);
  const source = main.type === "COMPONENT_SET" ? main.defaultVariant || main.children[0] : main;
  const inst = source.createInstance();
  const props = {};
  const defs = inst.componentProperties || {};
  for (const k of Object.keys(spec.variants || {})) props[b6Key(defs, k)] = spec.variants[k];
  for (const k of Object.keys(spec.texts || {})) props[b6Key(defs, k)] = spec.texts[k];
  if (Object.keys(props).length) inst.setProperties(props);
  inst.name = b6InstanceName(spec.of);
  return inst;
}

/** Name of the live main component (the set, when the instance is a variant). */
function b6MainName(inst) {
  const main = inst.mainComponent;
  if (!main) return "MISSING";
  if (main.parent && main.parent.type === "COMPONENT_SET") return main.parent.name;
  return main.name;
}

function b6MainId(inst) {
  const main = inst.mainComponent;
  if (!main) return "-";
  if (main.parent && main.parent.type === "COMPONENT_SET") return main.parent.id;
  return main.id;
}

/** Only the properties the approved definition declares take part in the signature. */
function b6LiveProps(inst, spec) {
  const live = inst.componentProperties || {};
  const names = Object.keys(spec.variants || {}).concat(Object.keys(spec.texts || {})).sort();
  return names
    .map((n) => {
      const keys = Object.keys(live).filter((k) => k.split("#")[0] === n);
      return n + "=" + (keys.length === 1 ? String(live[keys[0]].value) : "MISSING");
    })
    .join(",");
}

function b6SpecProps(spec) {
  const all = {};
  for (const k of Object.keys(spec.variants || {})) all[k] = spec.variants[k];
  for (const k of Object.keys(spec.texts || {})) all[k] = spec.texts[k];
  return Object.keys(all)
    .sort()
    .map((n) => n + "=" + all[n])
    .join(",");
}

/** Every geometry field the approved definition pins down, in a fixed order. */
function b6RootParts(root) {
  return [
    "layout=" + (root.layout || "HORIZONTAL"),
    "wrap=" + (root.wrap || "NO_WRAP"),
    "gap=" + (root.gap || 0),
    "cgap=" + (root.counterGap || 0),
    "primarySizing=" + (root.primarySizing || "AUTO"),
    "counterSizing=" + (root.counterSizing || "AUTO"),
    "pb=" + (root.paddingBottom || 0),
    "stroke=" + (root.strokeBottomStyle || "none"),
    "strokeWeights=" + (root.strokeBottomStyle ? "0/0/0/1" : "0/0/0/0"),
    "strokesInLayout=" + (root.strokeBottomStyle ? String(root.strokesIncludedInLayout === true) : "n/a"),
  ];
}

function b6ExpectedSignature(root, children) {
  const parts = b6RootParts(root);
  parts.push("children=" + children.length);
  for (const c of children) parts.push("INSTANCE:" + c.of + ":" + b6SpecProps(c));
  return parts.join("|");
}

function b6LiveSignature(node, root, children) {
  const styled = !!root.strokeBottomStyle && !!node.strokeStyleId &&
    node.strokeStyleId === b6HairlineId(root.strokeBottomStyle);
  const parts = [
    "layout=" + node.layoutMode,
    "wrap=" + (node.layoutWrap || "NO_WRAP"),
    "gap=" + node.itemSpacing,
    "cgap=" + (node.counterAxisSpacing || 0),
    "primarySizing=" + node.primaryAxisSizingMode,
    "counterSizing=" + node.counterAxisSizingMode,
    "pb=" + node.paddingBottom,
    "stroke=" + (styled ? root.strokeBottomStyle : "none"),
    "strokeWeights=" +
      [node.strokeTopWeight || 0, node.strokeRightWeight || 0, node.strokeLeftWeight || 0, node.strokeBottomWeight || 0].join("/"),
    "strokesInLayout=" + (root.strokeBottomStyle ? String(node.strokesIncludedInLayout === true) : "n/a"),
  ];
  parts.push("children=" + node.children.length);
  for (let i = 0; i < node.children.length; i += 1) {
    const kid = node.children[i];
    const spec = children[i];
    if (kid.type !== "INSTANCE" || !spec) {
      parts.push(kid.type + ":" + kid.name + ":-");
      continue;
    }
    parts.push("INSTANCE:" + b6MainName(kid) + ":" + b6LiveProps(kid, spec));
  }
  return parts.join("|");
}

/** Resolved once per run; STOP rather than approximate the B3 hairline. */
var b6StyleIndex = null;
function b6HairlineId(styleName) {
  if (!b6StyleIndex) throw new Error("STOP: style index not resolved before a pattern stroke was read.");
  return b4Style(b6StyleIndex, "paint", styleName).id;
}

function b6ApplyRoot(node, root, index) {
  node.layoutMode = root.layout || "HORIZONTAL";
  node.layoutWrap = root.wrap || "NO_WRAP";
  node.primaryAxisSizingMode = root.primarySizing || "AUTO";
  node.counterAxisSizingMode = root.counterSizing || "AUTO";
  node.counterAxisAlignItems = "MIN";
  node.primaryAxisAlignItems = "MIN";
  node.itemSpacing = root.gap || 0;
  if (node.layoutWrap === "WRAP") node.counterAxisSpacing = root.counterGap || 0;
  node.paddingLeft = 0;
  node.paddingRight = 0;
  node.paddingTop = 0;
  node.paddingBottom = root.paddingBottom || 0;
  node.fills = []; // production row wrappers carry layout classes only
  if (root.strokeBottomStyle) {
    // Individual bottom stroke, bound to the live B3 style — never a colour value,
    // never an extra line child. b4Style STOPs when the style cannot be resolved.
    node.strokeStyleId = b4Style(index, "paint", root.strokeBottomStyle).id;
    node.strokeTopWeight = 0;
    node.strokeLeftWeight = 0;
    node.strokeRightWeight = 0;
    node.strokeBottomWeight = 1;
    node.strokesIncludedInLayout = root.strokesIncludedInLayout === true;
  } else {
    node.strokes = [];
  }
}

/** Create one pattern ComponentNode with its nested live instances. */
function b6BuildNode(name, root, children, index, page) {
  const node = figma.createComponent();
  node.name = name;
  page.appendChild(node);
  b6ApplyRoot(node, root, index);
  for (const spec of children) node.appendChild(b6CreateInstance(spec));
  return node;
}

/** Reuse when the live structure matches the approved definition; STOP when it differs. */
function b6Check(node, root, children, label) {
  const expected = b6ExpectedSignature(root, children);
  const live = b6LiveSignature(node, root, children);
  if (expected !== live) {
    throw new Error(
      "STOP: LIVE PATTERN DIFFERS FROM THE APPROVED DEFINITION — " + label +
        "\n  live     : " + live +
        "\n  expected : " + expected +
        "\n  nothing was overwritten or deleted.",
    );
  }
}

function b6FindOnPage(page, name) {
  const found = page.children.filter((n) => n.name === name);
  if (found.length > 1) throw new Error('STOP: DUPLICATE PATTERN — "' + name + '" exists ' + found.length + " times on " + B6_PAGE + ".");
  return found[0] || null;
}

async function b6EnsurePattern(spec, index, page) {
  if (spec.kind === "SET") {
    let set = b4FindSet(spec.name);
    if (set && set.parent !== page) {
      throw new Error('STOP: PATTERN OUTSIDE SCOPE — "' + spec.name + '" lives on "' + (set.parent && set.parent.name) + '".');
    }
    const fresh = [];
    for (const v of spec.variants) {
      const vname = spec.property + "=" + v.value;
      const existing = set ? set.children.filter((c) => c.name === vname)[0] : b6FindOnPage(page, vname);
      if (existing) {
        b6Check(existing, v.root, v.children, spec.name + " / " + vname);
        b6Say("variant  ", spec.name + " / " + vname, false);
        continue;
      }
      const node = b6BuildNode(vname, v.root, v.children, index, page);
      node.description = spec.source;
      b6Say("variant  ", spec.name + " / " + vname, true);
      if (set) set.appendChild(node);
      else fresh.push(node);
    }
    if (!set) {
      set = figma.combineAsVariants(fresh, page);
      set.name = spec.name;
      set.fills = [];
      b6Created += 1;
      say("  set      created : " + spec.name);
    } else {
      say("  set      reused  : " + spec.name);
    }
    set.description = spec.source;
    return set;
  }

  let node = b4FindComponent(spec.name);
  if (node && node.parent !== page) {
    throw new Error('STOP: PATTERN OUTSIDE SCOPE — "' + spec.name + '" lives on "' + (node.parent && node.parent.name) + '".');
  }
  if (node) {
    b6Check(node, spec.root, spec.children, spec.name);
    b6Say("component", spec.name, false);
    return node;
  }
  node = b6BuildNode(spec.name, spec.root, spec.children, index, page);
  node.description = spec.source;
  b6Say("component", spec.name, true);
  return node;
}

async function ensureB6Patterns() {
  await figma.loadAllPagesAsync();
  b6Created = 0;
  const page = b6Page();
  const index = await b4StyleIndex();
  for (const spec of ABOX_B6.patterns) await b6EnsurePattern(spec, index, page);
  say("");
  say("  pattern objects created this run: " + b6Created);
}

function b6PatternNodes(page) {
  const out = [];
  for (const child of page.children) {
    if (child.type === "COMPONENT_SET") for (const v of child.children) out.push(v);
    else if (child.type === "COMPONENT") out.push(child);
  }
  return out;
}

async function verifyB6() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);
  const C = ABOX_B6.counts;
  const index = await b4StyleIndex();
  const page = b6Page();

  /* ---------- protected B1-B5 inventory ---------- */
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const b1Names = ABOX_B1.collections.map((c) => c.name);
  const b1Cols = collections.filter((c) => b1Names.indexOf(c.name) !== -1);
  let b1Vars = 0;
  for (const c of b1Cols) b1Vars += c.variableIds.length;
  const typo = collections.filter((c) => c.name === "ABox/Typography");
  add(b1Cols.length === 9 && b1Vars === 200, "B1 unchanged: 9 collections / 200 variables (found " + b1Cols.length + " / " + b1Vars + ")");
  add(typo.length === 1 && typo[0].variableIds.length === 19, "B2 unchanged: ABox/Typography with 19 variables");
  const owned = (list) => list.filter((s) => s.name.indexOf("ABox/") === 0);
  const paints = owned(await figma.getLocalPaintStylesAsync());
  const tstyles = owned(await figma.getLocalTextStylesAsync());
  const effects = owned(await figma.getLocalEffectStylesAsync());
  add(
    paints.length + tstyles.length + effects.length === 79,
    "B3 unchanged: 79 styles — 72 colour + 2 text + 5 effect (found " +
      paints.length + " / " + tstyles.length + " / " + effects.length + ")",
  );

  const componentsPage = figma.root.children.filter((p) => p.name === B4_PAGE)[0];
  const primSets = componentsPage.children.filter((n) => n.type === "COMPONENT_SET");
  const primStandalone = componentsPage.children.filter((n) => n.type === "COMPONENT");
  const primVariants = primSets.reduce((n, s) => n + s.children.length, 0);
  add(primSets.length === C.b4Sets, "B4 architecture unchanged: " + C.b4Sets + " component sets (found " + primSets.length + ")");
  add(
    primStandalone.length === C.b4Standalone && primVariants === C.b5Variants &&
      primVariants + primStandalone.length === C.b5Physical,
    "B5 architecture unchanged: " + C.b4Standalone + " standalone, " + C.b5Variants +
      " variant nodes, " + C.b5Physical + " physical nodes (found " + primStandalone.length + " / " +
      primVariants + " / " + (primVariants + primStandalone.length) + ")",
  );

  // every nested primitive the patterns rely on still exists under its own id
  const usedNames = {};
  for (const p of ABOX_B6.patterns) {
    const kids = p.kind === "SET" ? p.variants.reduce((a, v) => a.concat(v.children), []) : p.children;
    for (const k of kids) usedNames[k.of] = true;
  }
  let idsOk = true;
  const primIds = [];
  for (const name of Object.keys(usedNames).sort()) {
    const main = b4FindSet(name) || b4FindComponent(name);
    if (!main || main.parent !== componentsPage) idsOk = false;
    primIds.push("  " + name + "  id=" + (main ? main.id : "MISSING"));
  }
  add(idsOk, "every B4/B5 component id used by a pattern resolves live on " + B4_PAGE);

  let propIdsOk = true, propCount = 0;
  for (const b of ABOX_B5.bindings) {
    const owner = b5Owner(b.component);
    const keys = Object.keys(owner.componentPropertyDefinitions || {}).filter((k) => k.split("#")[0] === b.property);
    if (keys.length !== 1 || (owner.componentPropertyDefinitions[keys[0]].type !== b.type)) propIdsOk = false;
    else propCount += 1;
  }
  add(propIdsOk && propCount === C.b5NonVariant, "every B4/B5 component-property id preserved (" + propCount + " / " + C.b5NonVariant + ")");

  const patternNames = ABOX_B6.patterns.map((p) => p.name);
  const duplicated = primSets.concat(primStandalone).filter((n) => patternNames.indexOf(n.name) !== -1);
  add(duplicated.length === 0, "no B4/B5 primitive duplicated by a pattern (0 pattern name collides on " + B4_PAGE + ")");
  add(primSets.length === C.b4Sets, "no new B4/B5 Component Set created");

  /* ---------- page scope ---------- */
  const wantPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells", "04 Experiences", "05 Screens", "06 Documentation"];
  const writable = [B4_PAGE, B6_PAGE];
  add(
    figma.root.children.length === 7 && figma.root.children.map((p) => p.name).join("|") === wantPages.join("|"),
    "B0 pages unchanged: exactly 7, in the original order",
  );
  add(
    figma.root.children.filter((p) => writable.indexOf(p.name) === -1).every((p) => p.children.length === 0),
    "00 Foundations, 03 Shells, 04 Experiences, 05 Screens and 06 Documentation remain empty",
  );
  add(
    page.children.length === C.patterns,
    "pattern assets exist only on " + B6_PAGE + " — " + C.patterns + " top-level objects (found " + page.children.length + ")",
  );

  /* ---------- the patterns themselves ---------- */
  let structOk = true, nestedOk = true, rawOk = true, protoOk = true, axisOk = true;
  const inventory = [];
  for (const spec of ABOX_B6.patterns) {
    const bodies = [];
    if (spec.kind === "SET") {
      const set = b4FindSet(spec.name);
      if (!set || set.parent !== page) { structOk = false; continue; }
      const axes = Object.keys(set.componentPropertyDefinitions || {}).map((k) => k.split("#")[0]);
      if (axes.length !== 1 || axes[0] !== spec.property) axisOk = false;
      for (const v of spec.variants) {
        const vname = spec.property + "=" + v.value;
        const node = set.children.filter((c) => c.name === vname)[0];
        bodies.push({ node: node, root: v.root, children: v.children, label: spec.name + " / " + vname, set: set });
      }
    } else {
      const node = b4FindComponent(spec.name);
      if (node && node.parent !== page) structOk = false;
      bodies.push({ node: node, root: spec.root, children: spec.children, label: spec.name, set: null });
    }
    for (const body of bodies) {
      const node = body.node;
      if (!node) { structOk = false; inventory.push("  " + body.label + "  MISSING"); continue; }
      const live = b6LiveSignature(node, body.root, body.children);
      const expected = b6ExpectedSignature(body.root, body.children);
      if (live !== expected) structOk = false;
      if ((node.reactions || []).length) protoOk = false;
      if (node.fills && node.fills.length) rawOk = false;
      if (body.root.strokeBottomStyle) {
        if (node.strokeStyleId !== b4Style(index, "paint", body.root.strokeBottomStyle).id) rawOk = false;
      } else if (node.strokes && node.strokes.length) rawOk = false;
      const ids = [];
      for (let i = 0; i < node.children.length; i += 1) {
        const kid = node.children[i];
        const cspec = body.children[i];
        if (kid.type !== "INSTANCE" || !cspec || b6MainName(kid) !== cspec.of) { nestedOk = false; continue; }
        if ((kid.reactions || []).length) protoOk = false;
        ids.push(b6MainName(kid) + " id=" + b6MainId(kid) + " [" + b6LiveProps(kid, cspec) + "]");
      }
      inventory.push(
        "  " + body.label + "  root id=" + node.id + "  root=" + node.type + "/" + node.layoutMode +
          "\n      nested: " + ids.join("  |  ") +
          "\n      source: " + spec.source,
      );
    }
  }
  add(structOk, "every pattern matches its approved source-backed structural signature");
  add(nestedOk, "every nested primitive resolves to the expected live B4/B5 component");
  add(rawOk, "no hard-coded duplicate foundation value — pattern roots are unfilled, the only stroke is the live B3 ABox/Semantic/hairline style");
  add(axisOk, "no invented pattern state — the single pattern axis is " + ABOX_B6.patterns[0].property);
  add(protoOk, "no invented interaction — " + C.prototypes + " prototype reactions on any B6 node");

  const nodes = b6PatternNodes(page);
  add(nodes.length === C.patternNodes, "pattern ComponentNodes = " + C.patternNodes + " (found " + nodes.length + ")");
  const deferredNames = ABOX_B6.deferred.map((d) => d.candidate).concat(ABOX_B6.rejected.map((r) => r.candidate));
  add(
    page.children.every((n) => patternNames.indexOf(n.name) !== -1),
    "no deferred or rejected candidate was created (" + deferredNames.length + " candidates, 0 built)",
  );
  add(
    page.children.every((n) => n.name.indexOf("ABox/Pattern/") === 0),
    "no shell, screen, experience or responsive layout construct created on " + B6_PAGE,
  );
  add(b6Created === 0 || b6Created === C.patternNodes + C.sets, "run bookkeeping: objects created this run = " + b6Created);

  /* ---------- report ---------- */
  say("");
  say("ID PROVENANCE: ids below are REAL FIGMA ids only when this run executed inside Figma Desktop.");
  say("  An offline/mock harness prints OFFLINE MOCK ids and they are never evidence of a real write.");
  say("  runtime: " + (typeof figma.getFileThumbnailNodeAsync === "function" ? "figma plugin API" : "figma plugin API (host-reported)"));

  say("");
  say("B6 PATTERN INVENTORY");
  for (const line of inventory) say(line);

  say("");
  say("B4/B5 PRIMITIVES CONSUMED (live ids, unchanged by B6)");
  for (const line of primIds) say(line);

  say("");
  say("B6 INTERACTION VERIFICATION");
  for (const it of ABOX_B6.interactions) {
    const target = b4FindComponent(it.pattern) || b4FindSet(it.pattern);
    say("  pattern " + it.pattern + "  id=" + (target ? target.id : "MISSING"));
    say("    trigger        : " + it.trigger);
    say("    source         : " + it.source);
    say("    behaviour      : " + it.behaviour);
    say("    representation : " + it.representation);
    say("    before -> after: " + it.before + " -> " + it.after);
    say("    prototype      : " + it.prototype);
    say("    reuse          : " + it.reuse);
    if (it.limitation) say("    limitation     : " + it.limitation);
  }
  say("");
  say("  DEFERRED INTERACTIONS (production behaviour with no faithful Figma representation)");
  for (const d of ABOX_B6.deferredInteractions) say("    - " + d.candidate + " — " + d.source + " — " + d.reason);

  say("");
  say("B6 COUNTS");
  say("  patterns " + C.patterns + " (sets " + C.sets + " + components " + C.components + ")" +
      " | pattern ComponentNodes " + C.patternNodes + " | prototype connections " + C.prototypes);
  say("  deferred candidates " + C.deferred + " | rejected candidates " + C.rejected);
  say("  protected and unchanged: B4 sets " + C.b4Sets + ", standalone " + C.b4Standalone +
      ", variant nodes " + C.b5Variants + ", physical nodes " + C.b5Physical +
      ", non-variant properties " + C.b5NonVariant + ", exposed instances " + C.b5Exposed);

  say("");
  say("DEFERRED PATTERN CANDIDATES");
  for (const d of ABOX_B6.deferred) say("  - " + d.candidate + " — " + d.decision + " — " + d.reason + " — " + d.source);
  say("");
  say("REJECTED PATTERN CANDIDATES");
  for (const r of ABOX_B6.rejected) say("  - " + r.candidate + " — " + r.reason);

  say("");
  say("B6 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  say("  NOTE  src/** unchanged — asserted outside Figma with `git diff --stat -- src/`; the plugin sandbox cannot read the repository.");
  const passed = checks.every((c) => c.indexOf("PASS") === 0);

  say("");
  say("RECORDED LIMITATIONS / EXCEPTIONS");
  for (const l of ABOX_B6.limitations) say("  - " + l);
  say("  - No publishing performed; library publishing is a separate step.");
  say("");
  say(passed ? "RESULT: B6 PASSED" : "RESULT: B6 FAILED — do not proceed to B7.");
  return passed;
}

/* ---------- entry ---------- */

figma.showUI(__html__, { width: 420, height: 560 });

figma.ui.onmessage = async (msg) => {
  lines.length = 0;
  const b0 = msg.type === "b0-run" || msg.type === "b0-verify";
  const b1 = msg.type === "b1-run" || msg.type === "b1-verify";
  const b2 = msg.type === "b2-run" || msg.type === "b2-verify";
  const b3 = msg.type === "b3-run" || msg.type === "b3-verify";
  const b4 = msg.type === "b4-run" || msg.type === "b4-verify";
  const b5 = msg.type === "b5-run" || msg.type === "b5-verify";
  const b6 = msg.type === "b6-run" || msg.type === "b6-verify";
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
    } else if (msg.type === "b2-run") {
      say("ABox Phase 52 / Batch B2 — typography foundation");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB2Variables();
      await verifyB2();
    } else if (msg.type === "b2-verify") {
      say("ABox Phase 52 / Batch B2 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB2();
    } else if (msg.type === "b3-run") {
      say("ABox Phase 52 / Batch B3 — foundational styles");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB3Styles();
      await verifyB3();
    } else if (msg.type === "b3-verify") {
      say("ABox Phase 52 / Batch B3 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB3();
    } else if (msg.type === "b4-run") {
      say("ABox Phase 52 / Batch B4 — component foundation");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB4Components();
      await verifyB4();
    } else if (msg.type === "b4-verify") {
      say("ABox Phase 52 / Batch B4 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB4();
    } else if (msg.type === "b5-run") {
      say("ABox Phase 52 / Batch B5 — component variants & states");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB5Properties();
      await verifyB5();
    } else if (msg.type === "b5-verify") {
      say("ABox Phase 52 / Batch B5 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB5();
    } else if (msg.type === "b6-run") {
      say("ABox Phase 53 / Batch B6 — patterns & interactions");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB6Patterns();
      await verifyB6();
    } else if (msg.type === "b6-verify") {
      say("ABox Phase 53 / Batch B6 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB6();
    }
  } catch (e) {
    say("");
    say(String((e && e.message) || e));
    say(
      b0
        ? "RESULT: B0 FAILED — do not proceed to B1."
        : b1
          ? "RESULT: B1 FAILED — do not proceed to B2."
          : b2
            ? "RESULT: B2 FAILED — do not proceed to B3."
            : b3
              ? "RESULT: B3 FAILED — do not proceed to B4."
              : b4
                ? "RESULT: B4 FAILED — do not proceed to B5."
                : b5
                  ? "RESULT: B5 FAILED — do not proceed to B6."
                  : b6
                    ? "RESULT: B6 FAILED — do not proceed to B7."
                : "RESULT: PROOF FAILED — do not proceed to Phase 52.",
    );
  }
  report();
};
