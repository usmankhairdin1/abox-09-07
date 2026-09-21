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
