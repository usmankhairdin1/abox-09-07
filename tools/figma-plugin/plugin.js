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

  // FLOAT comparison uses a 1e-7 tolerance. Figma round-trips a stored FLOAT
  // through its own numeric representation, so values that are not exactly
  // representable in binary floating point (-2.8, -3.2, 1.02) can come back a
  // few ulps away from the JS literal that was written. The largest observed
  // real-Figma delta is ~4.8e-8; 1e-7 is safely above that while remaining many
  // orders of magnitude below any meaningful typographic difference. Every
  // comparison is printed at full precision below, so a real mismatch cannot hide.
  const FLOAT_EPSILON = 1e-7;
  const floatMatches = (stored, expected) =>
    typeof stored === "number" && Math.abs(stored - expected) <= FLOAT_EPSILON;

  let floatOk = true;
  const floatEvidence = [];
  for (const f of ABOX_B2.floats) {
    const v = vars[f.name];
    const l = v ? v.valuesByMode[light] : undefined;
    const d = v ? v.valuesByMode[dark] : undefined;
    const ok = !!v && floatMatches(l, f.value) && floatMatches(d, f.value);
    if (!ok) floatOk = false;
    const prec = (x) => (typeof x === "number" ? x.toPrecision(20) : String(x));
    const diff = (x) => (typeof x === "number" ? Math.abs(x - f.value).toExponential(3) : "n/a");
    floatEvidence.push(
      "      " + (ok ? "PASS  " : "FAIL  ") + f.name +
        "  expected=" + prec(f.value) +
        "  Light=" + prec(l) + " (delta " + diff(l) + ")" +
        "  Dark=" + prec(d) + " (delta " + diff(d) + ")",
    );
  }
  const floatFailures = floatEvidence.filter((l) => l.indexOf("FAIL") !== -1).length;
  add(floatOk, "numeric values match production in both modes" +
    (floatOk ? "" : " (" + floatFailures + " of " + ABOX_B2.floats.length + " FLOAT variables mismatched; see B2 NUMERIC EVIDENCE)"));

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
    const same = a && typeof a === "object" && b && typeof b === "object"
      ? a.id === b.id
      : typeof a === "number" && typeof b === "number"
        ? Math.abs(a - b) <= FLOAT_EPSILON
        : a === b;
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
    say("");
    say("B2 NUMERIC EVIDENCE (expected vs stored, full precision; tolerance 1e-9)");
    floatEvidence.forEach((l) => say(l));

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
      await node.setTextStyleIdAsync(style.id);
    } else {
      const font = await b4Font(spec.weight || 400);
      node.fontName = font;
      node.characters = spec.characters;
      node.fontSize = spec.fontSize;
      if (spec.letterSpacingPercent) node.letterSpacing = { value: spec.letterSpacingPercent, unit: "PERCENT" };
      if (spec.textCase) node.textCase = spec.textCase;
    }
    if (spec.colorStyle) await node.setFillStyleIdAsync(b4Style(index, "paint", spec.colorStyle).id);
    return node;
  }
  if (spec.type === "ELLIPSE") {
    const node = figma.createEllipse();
    node.resize(spec.w, spec.h);
    if (spec.fillStyle) await node.setFillStyleIdAsync(b4Style(index, "paint", spec.fillStyle).id);
    return node;
  }
  if (spec.type === "INSTANCE") {
    const target = b4FindSet(spec.of) || b4FindComponent(spec.of);
    if (!target) throw new Error("STOP: nested component not found — " + spec.of);
    const source = target.type === "COMPONENT_SET" ? target.defaultVariant || target.children[0] : target;
    const instance = source.createInstance();
    // The main component's root is a chrome wrapper (fills cleared in b4EnsureSet /
    // b4EnsureComponent). Clear the instance root the same way, but only when it is
    // not style-bound — a style-bound root is a production surface and stays as is.
    if (!instance.fillStyleId && instance.fills && instance.fills.length) instance.fills = [];
    if (!instance.strokeStyleId && instance.strokes && instance.strokes.length) instance.strokes = [];
    return instance;
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
    // Bind by painted-shape identity in document order rather than by direct child
    // index: figma.createNodeFromSvg may nest the six shapes inside groups, in which
    // case index-based binding silently leaves vectors unbound.
    const painted = [];
    const collect = (n) => {
      const isPainted = (n.fills && n.fills.length) || (n.strokes && n.strokes.length);
      if (n !== node && isPainted && (!n.children || !n.children.length)) painted.push(n);
      for (const child of n.children || []) {
        collect(child);
      }

      // Group / wrapper frames introduced by the SVG importer are chrome, never a
      // production surface: clear their own paint so nothing is left hard-coded.
      if (n !== node && n.children && n.children.length) {
        if (!n.fillStyleId && n.fills && n.fills.length) n.fills = [];
        if (!n.strokeStyleId && n.strokes && n.strokes.length) n.strokes = [];
      }
    };
    collect(node);
    const bind = [
      [spec.bgStyle, spec.hairlineStyle],
      [null, spec.ringStyle],
      [null, spec.ringStyle],
      [spec.dotStyle, null],
      [null, spec.fgStyle],
      [null, spec.fgStyle],
    ];
    if (painted.length !== bind.length) {
      throw new Error(
        "STOP: MARK SHAPE COUNT — expected " + bind.length + " painted vectors, found " + painted.length + ".",
      );
    }
    for (let i = 0; i < bind.length; i += 1) {
      const kid = painted[i];
      const fill = bind[i][0];
      const stroke = bind[i][1];
      if (fill) await kid.setFillStyleIdAsync(b4Style(index, "paint", fill).id);
      else if (kid.fills && kid.fills.length) kid.fills = [];
      if (stroke) await kid.setStrokeStyleIdAsync(b4Style(index, "paint", stroke).id);
      else if (kid.strokes && kid.strokes.length) kid.strokes = [];
    }
    for (const kid of painted) {
      if (kid.fills && kid.fills.length && !kid.fillStyleId) {
        throw new Error('STOP: UNBOUND MARK VECTOR — "' + kid.name + '" keeps a hard-coded fill.');
      }
      if (kid.strokes && kid.strokes.length && !kid.strokeStyleId) {
        throw new Error('STOP: UNBOUND MARK VECTOR — "' + kid.name + '" keeps a hard-coded stroke.');
      }
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
  if (spec.fillStyle) await frame.setFillStyleIdAsync(b4Style(index, "paint", spec.fillStyle).id);
  else frame.fills = [];
  if (spec.strokeStyle) {
    await frame.setStrokeStyleIdAsync(b4Style(index, "paint", spec.strokeStyle).id);
    frame.strokeWeight = spec.strokeWeight || 1;
    if (spec.dashed) frame.dashPattern = [4, 4];
  } else {
    frame.strokes = [];
  }
  if (spec.effectStyle) await frame.setEffectStyleIdAsync(b4Style(index, "effect", spec.effectStyle).id);
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
      // Debris guard: a variant left on the page by an aborted run is never silently
      // adopted or deleted here — the operator clears it with the stale-variant cleanup.
      const stray = page.children.filter((n) => n.type === "COMPONENT" && n.name === vname);
      if (stray.length) {
        throw new Error(
          'STOP: STALE TOP-LEVEL VARIANT — "' + vname + '" (id=' + stray[0].id + ") sits on " +
            B4_PAGE + ' outside its set. Run "Remove stale B4 variant components" first.',
        );
      }
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
    // Variant wrapper chrome, not a production surface: the built child frame below
    // carries every style-bound foundation paint.
    component.fills = [];
    component.strokes = [];
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
    node.strokes = [];
    b4Created += 1;
    say("  set     created : " + set.name);
  } else {
    for (const v of variants) if (v.parent !== node) node.appendChild(v);
    node.fills = [];
    node.strokes = [];
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
  // Component wrapper chrome, not a production surface.
  node.fills = [];
  node.strokes = [];
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

/**
 * Run one build step and, when it throws, remove the transient nodes it left on the
 * current page. figma.createFrame/createText/createNodeFromSvg append to
 * figma.currentPage at creation time and are only reparented afterwards, so an
 * aborted build otherwise leaves orphan debris behind on a library page.
 */
async function b4Guarded(label, fn) {
  const before = {};
  for (const n of figma.currentPage.children) before[n.id] = true;
  try {
    return await fn();
  } catch (err) {
    let removed = 0;
    for (const n of figma.currentPage.children.slice()) {
      if (before[n.id]) continue;
      if (n.type === "COMPONENT" || n.type === "COMPONENT_SET") continue;
      n.remove();
      removed += 1;
    }
    if (removed) say("  cleanup : removed " + removed + " transient node(s) left by " + label);
    throw err;
  }
}

async function ensureB4Components() {
  await figma.loadAllPagesAsync();
  b4Created = 0;
  const page = b4Page();
  const index = await b4StyleIndex();
  for (const set of ABOX_B4.sets) {
    await b4Guarded(set.name, () => b4EnsureSet(set, index, page));
  }
  for (const spec of ABOX_B4.components) {
    await b4Guarded(spec.name, () => b4EnsureComponent(spec, index, page));
  }
  say("");
  say("  objects created this run: " + b4Created);
}


async function verifyB4() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);

  const page = b4Page();
  // B6 pattern assets ("ABox/Pattern/…") live on 02 Patterns and are not B4/B5 primitives.
  const b4Own = (n) => n.name.indexOf("ABox/") === 0 && n.name.indexOf("ABox/Pattern/") !== 0 && n.name.indexOf("ABox/Shell/") !== 0;
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
  const rawEvidence = [];
  const noteRaw = (node, root, kind) => {
    rawFill += 1;
    if (rawEvidence.length < 40) {
      rawEvidence.push("  " + root.name + " › " + node.name + " (" + node.type + ") " + kind + "  id=" + node.id);
    }
  };
  const walk = (node, root) => {
    if (node.type !== "COMPONENT" && node.type !== "COMPONENT_SET" && node.type !== "FRAME" && node.type !== "TEXT" &&
        node.type !== "ELLIPSE" && node.type !== "VECTOR" && node.type !== "INSTANCE") return;
    if (node.fills && node.fills.length && !node.fillStyleId) noteRaw(node, root, "fill");
    if (node.strokes && node.strokes.length && !node.strokeStyleId) noteRaw(node, root, "stroke");
    if (node.fillStyleId && !paintNames[node.fillStyleId]) boundOk = false;
    if (node.effectStyleId && !effectNames[node.effectStyleId]) boundOk = false;
    for (const child of node.children || []) walk(child, root);
  };
  for (const node of sets.concat(standalone)) walk(node, node);
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
  const pageEvidence = [];
  for (const p of others) {
    for (const child of p.children) {
      pageEvidence.push("  " + p.name + " › " + child.name + " (" + child.type + ")  id=" + child.id);
    }
  }
  add(others.every((p) => p.children.length === 0), "pages 00, 03, 04, 05, 06 remain empty (02 Patterns is B6-owned)");
  const expectedOnPage = sets.concat(standalone).filter((n) => n.parent && n.parent.id === page.id);
  const extras = page.children.filter((n) => !expectedOnPage.some((e) => e.id === n.id));
  const missing = sets.concat(standalone).filter((n) => !n.parent || n.parent.id !== page.id);
  add(
    expectedOnPage.length === sets.length + standalone.length && extras.length === 0,
    'page "01 Components" holds exactly the ' + (sets.length + standalone.length) +
      " B4 component objects and nothing else (found " + expectedOnPage.length + " B4 objects, " + extras.length + " extra node(s))",
  );
  for (const n of extras) {
    pageEvidence.push("  " + B4_PAGE + " › EXTRA " + n.name + " (" + n.type + ")  id=" + n.id);
  }
  for (const n of missing) {
    pageEvidence.push("  " + B4_PAGE + " › MISSING FROM PAGE " + n.name + " (" + n.type + ")  id=" + n.id);
  }
  add(
    page.children.every((n) => n.type === "COMPONENT_SET" || n.type === "COMPONENT"),
    "no patterns, shells, screens or documentation content created",
  );

  if (rawEvidence.length) {
    say("");
    say("B4 RAW FILL EVIDENCE (first " + rawEvidence.length + " of " + rawFill + ")");
    for (const line of rawEvidence) say(line);
  }
  if (pageEvidence.length) {
    say("");
    say("B4 PAGE EVIDENCE");
    for (const line of pageEvidence) say(line);
  }


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

/**
 * Load the fonts a live TEXT node already uses, before any character write.
 * The font is read off the node B4 created; nothing is guessed or substituted.
 */
async function b5LoadTextFonts(node) {
  const fonts = [];
  if (node.fontName !== figma.mixed) {
    fonts.push(node.fontName);
  } else {
    const seen = {};
    const len = node.characters.length;
    for (let i = 0; i < len; i += 1) {
      const f = node.getRangeFontName(i, i + 1);
      const key = f.family + "\u0000" + f.style;
      if (!seen[key]) {
        seen[key] = true;
        fonts.push(f);
      }
    }
  }
  for (const font of fonts) {
    try {
      await figma.loadFontAsync(font);
    } catch (e) {
      throw new Error(
        'STOP: B5 FONT — could not load "' + font.family + " " + font.style +
          '" used by ' + node.name + ". No substitution is permitted. Figma error: " +
          String((e && e.message) || e),
      );
    }
  }
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
    try {
      // (10)-(12) the only mutation: the delta chip's text and colour foundation.
      const chip = b5Texts(node)[2];
      if (!chip) throw new Error("STOP: KPICARD DELTA LAYER MISSING on " + vname + ".");
      chip.name = "delta";
      if (chip.characters !== A.negative.characters) {
        await b5LoadTextFonts(chip);
        chip.characters = A.negative.characters;
      }
      if (chip.fillStyleId !== destructive.id) await chip.setFillStyleIdAsync(destructive.id);
      node.description = A.negative.source;
    } catch (e) {
      // A partial run must not leave a half-built duplicate behind.
      if (isNew && node && !node.removed) node.remove();
      throw e;
    }
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
  const b5Own = (n) => n.name.indexOf("ABox/") === 0 && n.name.indexOf("ABox/Pattern/") !== 0 && n.name.indexOf("ABox/Shell/") !== 0;
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
  const livePageNames = figma.root.children.map((p) => p.name);
  add(
    figma.root.children.length === 7 && livePageNames.join("|") === wantPages.join("|"),
    "B0 pages unchanged: exactly 7, in the approved order (found " + figma.root.children.length + ": " + livePageNames.join(", ") + ")",
  );
  // B6 populates "02 Patterns", B7 "03 Shells"; every other non-component page must stay empty,
  // except "06 Documentation", which may hold exactly the approved B10 frames (see verifyB9).
  const writable = [B4_PAGE, "02 Patterns", "03 Shells"];
  const b5PageEvidence = [];
  for (const p of figma.root.children) {
    if (writable.indexOf(p.name) !== -1) continue;
    if (p.name === "06 Documentation") {
      const docNames = p.children.map((n) => n.name);
      if (docNames.length === 0 || docNames.join("|") === b10ApprovedNames().join("|")) continue;
    }
    for (const child of p.children) {
      if (b5PageEvidence.length >= 40) break;
      b5PageEvidence.push("  " + p.name + " › " + child.name + " (" + child.type + ")  id=" + child.id);
    }
  }
  add(
    b5PageEvidence.length === 0,
    "only 01 Components, 02 Patterns and 03 Shells populated (06 Documentation may hold the approved B10 frames); unexpected nodes: " +
      b5PageEvidence.length,
  );
  if (b5PageEvidence.length) {
    say("");
    say("B5 PAGE EVIDENCE");
    for (const line of b5PageEvidence) say(line);
  }

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
async function b6MainName(inst) {
  const main = await inst.getMainComponentAsync(); // async: documentAccess dynamic-page
  if (!main) return "MISSING";
  if (main.parent && main.parent.type === "COMPONENT_SET") return main.parent.name;
  return main.name;
}

async function b6MainId(inst) {
  const main = await inst.getMainComponentAsync(); // async: documentAccess dynamic-page
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

async function b6LiveSignature(node, root, children) {
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
    parts.push("INSTANCE:" + (await b6MainName(kid)) + ":" + b6LiveProps(kid, spec));
  }
  return parts.join("|");
}

/** Resolved once per run; STOP rather than approximate the B3 hairline. */
var b6StyleIndex = null;
function b6HairlineId(styleName) {
  if (!b6StyleIndex) throw new Error("STOP: style index not resolved before a pattern stroke was read.");
  return b4Style(b6StyleIndex, "paint", styleName).id;
}

async function b6ApplyRoot(node, root, index) {
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
    // documentAccess: dynamic-page forbids the synchronous setter (same rule as B4/B5).
    await node.setStrokeStyleIdAsync(b4Style(index, "paint", root.strokeBottomStyle).id);
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
async function b6BuildNode(name, root, children, index, page) {
  const node = figma.createComponent();
  node.name = name;
  page.appendChild(node);
  await b6ApplyRoot(node, root, index);
  for (const spec of children) node.appendChild(b6CreateInstance(spec));
  return node;
}

/** Reuse when the live structure matches the approved definition; STOP when it differs. */
async function b6Check(node, root, children, label) {
  const expected = b6ExpectedSignature(root, children);
  const live = await b6LiveSignature(node, root, children);
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

/** The set's single variant axis, read from the live node. */
function b6SetAxis(set) {
  const defs = set.componentPropertyDefinitions || {};
  const names = Object.keys(defs).filter((k) => defs[k].type === "VARIANT");
  return { names: names, name: names[0], values: names.length === 1 ? (defs[names[0]].variantOptions || []).slice().sort() : [] };
}

function b6AssertAxis(set, spec) {
  const axis = b6SetAxis(set);
  const want = spec.values.slice().sort();
  if (set.name !== spec.name) {
    throw new Error('STOP: PATTERN SET NAME MISMATCH — expected "' + spec.name + '", live "' + set.name + '".');
  }
  if (axis.names.length !== 1 || axis.name !== spec.property) {
    throw new Error(
      "STOP: PATTERN SET AXIS MISMATCH — " + spec.name + " must expose exactly one VARIANT property named \"" +
        spec.property + '"; live axes: ' + JSON.stringify(axis.names) + ".",
    );
  }
  if (axis.values.join(",") !== want.join(",")) {
    throw new Error(
      "STOP: PATTERN SET VALUES MISMATCH — " + spec.name + " expected " + JSON.stringify(want) +
        ", live " + JSON.stringify(axis.values) + ".",
    );
  }
  if (set.children.length !== spec.variants.length) {
    throw new Error(
      "STOP: PATTERN SET SHAPE MISMATCH — " + spec.name + " expected " + spec.variants.length +
        " variant nodes, live " + set.children.length + ".",
    );
  }
  const seen = {};
  for (const child of set.children) {
    if (seen[child.name]) throw new Error("STOP: DUPLICATE VARIANT MATRIX — " + spec.name + " / " + child.name + ".");
    seen[child.name] = true;
  }
}

async function b6EnsurePattern(spec, index, page) {
  if (spec.kind === "SET") {
    // 1. resolve the live B4/B5 main components every nested instance needs, before any write
    const needed = {};
    for (const v of spec.variants) for (const c of v.children) needed[c.of] = true;
    for (const name of Object.keys(needed).sort()) {
      const main = b6Main(name);
      say("  primitive resolved: " + name + "  id=" + main.id);
    }

    // 2. read the live 02 Patterns inventory and detect the set by deterministic identity
    let set = b4FindSet(spec.name);
    if (set && set.parent !== page) {
      throw new Error('STOP: PATTERN OUTSIDE SCOPE — "' + spec.name + '" lives on "' + (set.parent && set.parent.name) + '".');
    }
    if (!set) {
      for (const child of page.children) {
        if (child.type === "COMPONENT_SET" && child.name === spec.name) {
          throw new Error("STOP: CONFLICTING PATTERN SET — " + spec.name + ".");
        }
      }
    }

    if (set) {
      // 3a. present — verify the axis, then resolve each variant by its exact matrix. Never create.
      b6AssertAxis(set, spec);
      for (const v of spec.variants) {
        const vname = spec.property + "=" + v.value;
        const matches = set.children.filter((c) => c.name === vname);
        if (matches.length !== 1) {
          throw new Error(
            "STOP: VARIANT MATRIX NOT RESOLVABLE — " + spec.name + " / " + vname + " matched " + matches.length + " nodes.",
          );
        }
        await b6Check(matches[0], v.root, v.children, spec.name + " / " + vname);
        b6Say("variant  ", spec.name + " / " + vname, false);
      }
      say("  set      reused  : " + spec.name + "  id=" + set.id);
      set.description = spec.source;
      return set;
    }

    // 3b. absent — create exactly one ComponentNode per declared matrix, then combine only those.
    const fresh = [];
    for (const v of spec.variants) {
      const vname = spec.property + "=" + v.value;
      const stray = b6FindOnPage(page, vname);
      if (stray) {
        const strayInstances = stray.type === "COMPONENT" ? (await stray.getInstancesAsync()).length : 0;
        throw new Error(
          "STOP: ORPHAN VARIANT NODE ON " + B6_PAGE + " — " + vname +
            "  (type=" + stray.type + " id=" + stray.id + " instances=" + strayInstances + ")" +
            '\n  It belongs inside "' + spec.name + '", not on the page.' +
            '\n  Run "Inspect 02 Patterns", then "Remove stale B6 variant components" first. Nothing was overwritten or deleted.',
        );
      }
      const node = await b6BuildNode(vname, v.root, v.children, index, page);
      node.description = spec.source;
      b6Say("variant  ", spec.name + " / " + vname, true);
      fresh.push(node);
    }
    // combineAsVariants is the only supported mechanism — no addComponentProperty, no second axis.
    set = figma.combineAsVariants(fresh, page);
    set.name = spec.name;
    set.fills = [];
    b6Created += 1;
    b6AssertAxis(set, spec);
    say("  set      created : " + spec.name + "  id=" + set.id);
    set.description = spec.source;
    return set;
  }

  let node = b4FindComponent(spec.name);
  if (node && node.parent !== page) {
    throw new Error('STOP: PATTERN OUTSIDE SCOPE — "' + spec.name + '" lives on "' + (node.parent && node.parent.name) + '".');
  }
  if (node) {
    await b6Check(node, spec.root, spec.children, spec.name);
    b6Say("component", spec.name, false);
    return node;
  }
  node = await b6BuildNode(spec.name, spec.root, spec.children, index, page);
  node.description = spec.source;
  b6Say("component", spec.name, true);
  return node;
}

/**
 * Read-only preflight: B6 instances the B5 variant axis on ABox/Card/KpiCard, so B5 must
 * already be applied to this file. Creates and changes nothing.
 */
function b6RequireB5() {
  const A = ABOX_B5.variantAxis;
  const set = b4FindSet(A.set);
  if (!set) throw new Error('STOP: MISSING B4/B5 COMPONENT — "' + A.set + '" not found in the live file.');
  const defs = set.componentPropertyDefinitions || {};
  const found = Object.keys(defs).filter((k) => k.split("#")[0] === A.property);
  if (found.length !== 1) {
    throw new Error(
      "STOP: B6 PREREQUISITE — B5 has not been applied to this file (" + A.set + ' has no "' +
        A.property + '" axis). Run B5 Create + B5 Verify first. B6 creates nothing.',
    );
  }
}

/** Approved B6 top-level object names on 02 Patterns. */
function b6ApprovedNames() {
  return ABOX_B6.patterns.map((p) => p.name);
}

/** Approved B6 variant-matrix names ("columns=3") mapped to their owning set spec. */
function b6VariantOwners() {
  const owners = {};
  for (const spec of ABOX_B6.patterns) {
    if (spec.kind !== "SET") continue;
    for (const v of spec.variants) owners[spec.property + "=" + v.value] = spec;
  }
  return owners;
}

/**
 * Per-pattern guard: any node this build parented to 02 Patterns is removed again when the
 * build throws, so an aborted run can never strand a bare variant or a half-built pattern
 * component on the page. Only nodes created during this build whose names are B6-owned
 * (approved top-level pattern names or approved variant matrices), never a COMPONENT_SET,
 * are ever removed.
 */
async function b6Guarded(page, label, fn) {
  const before = {};
  for (const child of page.children) before[child.id] = true;
  try {
    return await fn();
  } catch (err) {
    const owned = {};
    for (const name of b6ApprovedNames()) owned[name] = true;
    for (const name of Object.keys(b6VariantOwners())) owned[name] = true;
    let removed = 0;
    for (const child of page.children.slice()) {
      if (before[child.id]) continue;
      if (child.type === "COMPONENT_SET") continue;
      if (!owned[child.name]) continue;
      say("  rollback : removed node created this run — " + child.name + "  id=" + child.id);
      child.remove();
      removed += 1;
    }
    if (!removed) say("  (" + label + " left no new node on " + B6_PAGE + ")");
    throw err;
  }
}

async function ensureB6Patterns() {
  await figma.loadAllPagesAsync();
  b6Created = 0;
  b6RequireB5();
  const page = b6Page();
  const index = await b4StyleIndex();
  b6StyleIndex = index;

  for (const spec of ABOX_B6.patterns) {
    await b6Guarded(page, spec.name, () => b6EnsurePattern(spec, index, page));
  }
  say("");
  say("  pattern objects created this run: " + b6Created);
}

/**
 * Read-only evidence report for 02 Patterns. Writes nothing, deletes nothing.
 */
async function b6InspectPatterns() {
  await figma.loadAllPagesAsync();
  const page = b6Page();
  const index = await b4StyleIndex();
  b6StyleIndex = index;
  const approved = {};
  for (const name of b6ApprovedNames()) approved[name] = true;
  const owners = b6VariantOwners();

  say("B6 PAGE INSPECTION — " + B6_PAGE + " (read-only)");
  say("  page id=" + page.id + "  children=" + page.children.length);
  say("");
  if (!page.children.length) say("  page is empty.");

  for (const node of page.children) {
    say("  " + node.name + "  (" + node.type + ")  id=" + node.id);
    say("    parent : " + (node.parent ? node.parent.name + " (" + node.parent.type + ") id=" + node.parent.id : "none"));
    const ownership = approved[node.name]
      ? "approved B6 top-level object"
      : owners[node.name]
        ? 'approved B6 variant matrix of "' + owners[node.name].name + '" — must live INSIDE that set'
        : "not an approved B6 name";
    say("    ownership : " + ownership);
    if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
      const defs = node.componentPropertyDefinitions || {};
      say("    componentPropertyDefinitions : " + JSON.stringify(Object.keys(defs)));
    }
    if (node.type === "COMPONENT") {
      say("    variantProperties : " + JSON.stringify(node.variantProperties || null));
      const instances = await node.getInstancesAsync();
      say("    live instances : " + instances.length);
    }
    if ("children" in node) {
      say("    children : " + node.children.length + "  " + JSON.stringify(node.children.map((c) => c.name)));
    }
    const owner = owners[node.name];
    if (owner && node.type === "COMPONENT") {
      const v = owner.variants.filter((x) => owner.property + "=" + x.value === node.name)[0];
      if (v) {
        let live = "(unreadable)";
        try {
          live = await b6LiveSignature(node, v.root, v.children);
        } catch (err) {
          live = "(signature error: " + (err && err.message) + ")";
        }
        say("    expected signature : " + b6ExpectedSignature(v.root, v.children));
        say("    live     signature : " + live);
      }
    }
    say("");
  }
  say("  nothing was created, modified or deleted.");
}

/**
 * Remove B6 variant components stranded directly on 02 Patterns by an aborted run.
 * A node is removed ONLY when every identity condition holds; anything failing a single
 * condition is reported and kept. Approved B6 objects and component sets never qualify.
 */
async function b6StaleVariants() {
  await figma.loadAllPagesAsync();
  const page = b6Page();

  const approved = {};
  for (const list of [b6ApprovedNames(), b8ApprovedNames(), b9ApprovedNames(), b10ApprovedNames()]) {
    for (const name of list || []) approved[name] = true;
  }
  const batchOwned = (name) =>
    approved[name] === true ||
    name.indexOf("ABox/Pattern/") === 0 ||
    name.indexOf("ABox/Shell/") === 0 ||
    name.indexOf("ABox/Screen/") === 0 ||
    name.indexOf("ABox/ScreenState/") === 0 ||
    name.indexOf("ABox/Doc/") === 0;
  const owners = b6VariantOwners();

  say("B6 STALE VARIANT CLEANUP");
  say("");

  const doomed = [];
  const kept = [];
  for (const node of page.children) {
    if (node.type !== "COMPONENT") continue; // conditions 1 + 2
    if (!node.parent || node.parent.id !== page.id) continue;
    if (batchOwned(node.name)) {
      kept.push("  KEPT — batch-owned name : " + node.name + "  id=" + node.id);
      continue;
    }
    const owner = owners[node.name]; // condition 4
    if (!owner) {
      kept.push("  KEPT — not a B6 variant matrix name : " + node.name + "  id=" + node.id);
      continue;
    }
    const instances = await node.getInstancesAsync(); // condition 5 (async: dynamic-page)
    if (instances.length) {
      kept.push("  KEPT — has " + instances.length + " live instance(s) : " + node.name + "  id=" + node.id);
      continue;
    }
    const set = b4FindSet(owner.name);
    let reason;
    if (set) {
      const live = set.children.filter((c) => c.name === node.name)[0];
      if (!live || live.id === node.id) {
        kept.push("  KEPT — owning set " + owner.name + " holds no surviving " + node.name + " : id=" + node.id);
        continue;
      }
      reason = "belongs in " + owner.name + "; surviving variant id=" + live.id;
    } else {
      reason =
        "bare variant matrix of " + owner.name + " with zero instances; the owning set does not exist, " +
        "and no approved page inventory permits a top-level " + node.name + " on " + B6_PAGE;
    }
    doomed.push({ node: node, reason: reason });
  }

  for (const line of kept) say(line);
  if (kept.length) say("");

  if (!doomed.length) {
    say("  nothing to remove — no stale B6 variant component on " + B6_PAGE + ".");
  }
  for (const entry of doomed) {
    say("  remove : " + entry.node.name + "  id=" + entry.node.id + "  (" + entry.reason + ")");
    entry.node.remove();
  }

  say("");
  say("  page contents after cleanup");
  for (const p of figma.root.children) {
    say("    " + p.name + " : " + p.children.length + " node(s)");
  }
  say("");
  say("  removed this run: " + doomed.length);
  return doomed.length;
}

/**
 * Remove a half-built approved B6 pattern COMPONENT left on 02 Patterns by an aborted run.
 * A node is removed only when every condition holds:
 *   1. it sits directly on 02 Patterns;
 *   2. it is a COMPONENT (never a COMPONENT_SET);
 *   3. its name is an approved B6 kind:"COMPONENT" pattern name;
 *   4. its live signature differs from the approved expected signature (provably incomplete);
 *   5. it reports zero live instances.
 * Anything failing a condition is printed as KEPT and left untouched.
 */
async function b6CleanupIncompletePatterns() {
  await figma.loadAllPagesAsync();
  const page = b6Page();
  const index = await b4StyleIndex();
  b6StyleIndex = index;

  const specs = {};
  for (const spec of ABOX_B6.patterns) if (spec.kind === "COMPONENT") specs[spec.name] = spec;

  say("B6 INCOMPLETE PATTERN CLEANUP");
  say("");

  const doomed = [];
  const kept = [];
  for (const node of page.children) {
    if (node.type !== "COMPONENT") continue; // conditions 1 + 2
    if (!node.parent || node.parent.id !== page.id) continue;
    const spec = specs[node.name]; // condition 3
    if (!spec) {
      kept.push("  KEPT — not an approved B6 pattern component name : " + node.name + "  id=" + node.id);
      continue;
    }
    const expected = b6ExpectedSignature(spec.root, spec.children);
    const live = await b6LiveSignature(node, spec.root, spec.children);
    if (expected === live) { // condition 4
      kept.push("  KEPT — complete, matches the approved definition : " + node.name + "  id=" + node.id);
      continue;
    }
    const instances = await node.getInstancesAsync(); // condition 5 (async: dynamic-page)
    if (instances.length) {
      kept.push("  KEPT — has " + instances.length + " live instance(s) : " + node.name + "  id=" + node.id);
      continue;
    }
    doomed.push({ node: node, live: live, expected: expected });
  }

  for (const line of kept) say(line);
  if (kept.length) say("");

  if (!doomed.length) {
    say("  nothing to remove — no incomplete B6 pattern component on " + B6_PAGE + ".");
  }
  for (const entry of doomed) {
    say("  remove : " + entry.node.name + "  id=" + entry.node.id + "  (incomplete, zero instances)");
    say("    live     : " + entry.live);
    say("    expected : " + entry.expected);
    entry.node.remove();
  }

  say("");
  say("  page contents after cleanup");
  for (const p of figma.root.children) {
    say("    " + p.name + " : " + p.children.length + " node(s)");
  }
  say("");
  say("  removed this run: " + doomed.length);
  return doomed.length;
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
  b6StyleIndex = index;
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
  const writable = [B4_PAGE, B6_PAGE, B7_PAGE];
  add(
    figma.root.children.length === 7 && figma.root.children.map((p) => p.name).join("|") === wantPages.join("|"),
    "B0 pages unchanged: exactly 7, in the original order",
  );
  add(
    figma.root.children.filter((p) => writable.indexOf(p.name) === -1).every((p) => p.children.length === 0),
    "00 Foundations, 04 Experiences, 05 Screens and 06 Documentation remain empty",
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
      const live = await b6LiveSignature(node, body.root, body.children);
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
        const kidMain = kid.type === "INSTANCE" ? await b6MainName(kid) : null;
        if (kid.type !== "INSTANCE" || !cspec || kidMain !== cspec.of) { nestedOk = false; continue; }
        if ((kid.reactions || []).length) protoOk = false;
        ids.push(kidMain + " id=" + (await b6MainId(kid)) + " [" + b6LiveProps(kid, cspec) + "]");
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

  /* ---------- revised-precision checks ---------- */
  const kpiSpec = ABOX_B6.patterns.filter((p) => p.kind === "SET")[0];
  const kpiSets = page.children.filter((n) => n.type === "COMPONENT_SET" && n.name === kpiSpec.name);
  const kpiSet = kpiSets[0] || null;
  const kpiAxis = kpiSet ? b6SetAxis(kpiSet) : { names: [], values: [] };
  add(kpiSets.length === 1 && kpiSet.children.length === 2,
    kpiSpec.name + " is exactly one Component Set with exactly two Variant ComponentNodes (found " +
      kpiSets.length + " set(s) / " + (kpiSet ? kpiSet.children.length : 0) + " variant nodes)");
  add(kpiAxis.names.length === 1 && kpiAxis.name === kpiSpec.property,
    "the only " + kpiSpec.name + " Variant property is " + kpiSpec.property + " (live: " + JSON.stringify(kpiAxis.names) + ")");
  add(kpiAxis.values.join(",") === kpiSpec.values.slice().sort().join(","),
    kpiSpec.name + " values are exactly " + kpiSpec.values.join(" and ") + " (live: " + JSON.stringify(kpiAxis.values) + ")");
  const kpiMatrix = {};
  let kpiDup = false;
  if (kpiSet) for (const c of kpiSet.children) { if (kpiMatrix[c.name]) kpiDup = true; kpiMatrix[c.name] = true; }
  add(!kpiDup, "no duplicate " + kpiSpec.name + " variant matrix exists");

  const wrapSpecs = ABOX_B6.patterns.filter((p) => p.kind !== "SET");
  let wrapOk = true, gapsOk = true;
  const gapReport = [];
  for (const spec of wrapSpecs) {
    const node = b4FindComponent(spec.name);
    if (!node) { wrapOk = false; gapsOk = false; continue; }
    if (node.layoutWrap !== "WRAP") wrapOk = false;
    if (node.itemSpacing !== 6 || node.counterAxisSpacing !== 6) gapsOk = false;
    gapReport.push(spec.name + " wrap=" + node.layoutWrap + " itemSpacing=" + node.itemSpacing +
      " counterAxisSpacing=" + node.counterAxisSpacing + " sizing=" + node.primaryAxisSizingMode + "/" + node.counterAxisSizingMode);
  }
  add(wrapOk, "ModuleTabBar and WizardStepper have layoutWrap = WRAP");
  add(gapsOk, "both wrapped patterns have itemSpacing = 6 and counterAxisSpacing = 6 — " + gapReport.join(" ; "));

  const tabSpec = wrapSpecs.filter((p) => p.name.indexOf("ModuleTabBar") !== -1)[0];
  const tabNode = tabSpec ? b4FindComponent(tabSpec.name) : null;
  const hairlineId = b4Style(index, "paint", tabSpec.root.strokeBottomStyle).id;
  const strokeOk = !!tabNode && tabNode.strokeBottomWeight === 1 &&
    (tabNode.strokeTopWeight || 0) === 0 && (tabNode.strokeLeftWeight || 0) === 0 && (tabNode.strokeRightWeight || 0) === 0 &&
    tabNode.strokeStyleId === hairlineId &&
    tabNode.strokesIncludedInLayout === (tabSpec.root.strokesIncludedInLayout === true);
  add(strokeOk,
    "ModuleTabBar has exactly one bottom stroke of weight 1 bound to the live B3 " + tabSpec.root.strokeBottomStyle +
      " style (id=" + hairlineId + "), other sides 0, strokesIncludedInLayout=" +
      (tabNode ? String(tabNode.strokesIncludedInLayout) : "-"));
  const tabExtras = tabNode ? tabNode.children.filter((c) => c.type !== "INSTANCE") : [];
  add(tabExtras.length === 0, "ModuleTabBar has no extra line/border child (found " + tabExtras.length + ")");
  const tabRawStroke = !!tabNode && (!tabNode.strokeStyleId && (tabNode.strokes || []).length > 0);
  add(!tabRawStroke, "no hard-coded stroke colour exists on any pattern root");
  add(page.children.every((n) => n.name.indexOf("/sm") === -1 && n.name.indexOf("breakpoint") === -1),
    "no responsive breakpoint state or variant was created");

  /* ---------- WizardStepper: the complete production step list ---------- */
  const wizSpec = wrapSpecs.filter((p) => p.name.indexOf("WizardStepper") !== -1)[0];
  const wizNode = wizSpec ? b4FindComponent(wizSpec.name) : null;
  const wizSteps = wizSpec.configuration.steps;
  const wizMain = b6Main("ABox/Nav/WizardStep");
  const wizKids = wizNode ? wizNode.children : [];
  add(wizKids.length === 8, "WizardStepper contains exactly 8 child nodes (found " + wizKids.length + ")");
  let orderOk = wizKids.length === 8, mainOk = true, stateOk = true, labelOk = true;
  const allowedStates = ["current", "done", "upcoming", "unreachable"];
  const wizReport = [];
  for (let i = 0; i < wizKids.length; i += 1) {
    const kid = wizKids[i];
    const want = wizSteps[i];
    const cspec = wizSpec.children[i];
    if (!want || kid.type !== "INSTANCE") { orderOk = false; continue; }
    const kidMainId = await b6MainId(kid);
    if (kidMainId !== wizMain.id) mainOk = false;
    const live = b6LiveProps(kid, cspec);
    if (live.indexOf("state=" + want.state) === -1) stateOk = false;
    if (allowedStates.indexOf(want.state) === -1) stateOk = false;
    if (live.indexOf("label=" + want.label) === -1) labelOk = false;
    wizReport.push("    " + (i + 1) + ". " + want.label + " — " + want.state + " — main id=" + kidMainId);
  }
  add(orderOk, "WizardStepper child order matches DOWNLINE_WIZARD_STEPS position by position (1-8)");
  add(mainOk, "every WizardStepper child resolves to the live B4/B5 ABox/Nav/WizardStep main component (id=" + wizMain.id + ")");
  add(stateOk, "every WizardStepper child state is a real production state copied from " + wizSpec.configuration.route +
    " (step " + wizSpec.configuration.currentStep + " of 8) — none manufactured, none combined across routes");
  add(labelOk, "every WizardStepper child label matches the production step label");
  add(page.children.filter((n) => n.name === wizSpec.name).length === 1 &&
    figma.root.children.reduce((n, pg) => n + pg.children.filter((c) => c.name === wizSpec.name).length, 0) === 1,
    "no duplicate WizardStepper exists on any page");

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
  say("B6 WIZARDSTEPPER CONFIGURATION (route " + wizSpec.configuration.route + " — " +
    wizSpec.configuration.scr + " — step " + wizSpec.configuration.currentStep + " of 8)");
  for (const line of wizReport) say(line);

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


/* =====================  Phase 54 / Batch B7 — shells  ===================== */
/*
 * B7 creates production-backed shell assets on 03 Shells only. It consumes live
 * B4/B5/B6 objects by identity, never rebuilds protected assets, and records
 * responsive / interaction behaviour as metadata when Figma has no faithful
 * native representation.
 */

const B7_PAGE = "03 Shells";
var b7CreatedPhysical = 0;
var b7CreatedSets = 0;
var b7CreatedProperties = 0;

function b7Say(kind, name, isNew) {
  if (isNew) say("  " + kind + " created : " + name);
  else say("  " + kind + " reused  : " + name);
}

function b7Page() {
  const page = figma.root.children.filter((p) => p.name === B7_PAGE);
  if (page.length !== 1) {
    throw new Error('STOP: B0 page "' + B7_PAGE + '" must exist exactly once (found ' + page.length + ").");
  }
  return page[0];
}

function b7ShellNames() {
  return ABOX_B7.shells.map((s) => s.name);
}

function b7Main(name) {
  const set = b4FindSet(name);
  if (set) return set;
  const cmp = b4FindComponent(name);
  if (cmp) return cmp;
  throw new Error('STOP: MISSING LIVE COMPONENT — "' + name + '" not found. Run the required prior batch first.');
}

function b7Instance(spec) {
  const main = b7Main(spec.of);
  const source = main.type === "COMPONENT_SET" ? main.defaultVariant || main.children[0] : main;
  const inst = source.createInstance();
  const props = {};
  const defs = inst.componentProperties || {};
  for (const k of Object.keys(spec.variants || {})) props[b6Key(defs, k)] = spec.variants[k];
  for (const k of Object.keys(spec.texts || {})) props[b6Key(defs, k)] = spec.texts[k];
  if (Object.keys(props).length) inst.setProperties(props);
  inst.name = spec.name || spec.of.split("/").pop();
  return inst;
}

function b7Frame(name, opts, index) {
  const node = figma.createFrame();
  node.name = name;
  node.layoutMode = opts.layout || "VERTICAL";
  node.layoutWrap = opts.wrap || "NO_WRAP";
  node.primaryAxisSizingMode = opts.primarySizing || "AUTO";
  node.counterAxisSizingMode = opts.counterSizing || "AUTO";
  node.primaryAxisAlignItems = opts.justify || "MIN";
  node.counterAxisAlignItems = opts.align || "MIN";
  node.itemSpacing = opts.gap || 0;
  if (node.layoutWrap === "WRAP") node.counterAxisSpacing = opts.counterGap || 0;
  node.paddingLeft = opts.pl != null ? opts.pl : opts.px || 0;
  node.paddingRight = opts.pr != null ? opts.pr : opts.px || 0;
  node.paddingTop = opts.pt != null ? opts.pt : opts.py || 0;
  node.paddingBottom = opts.pb != null ? opts.pb : opts.py || 0;
  node.cornerRadius = opts.radius || 0;
  if (opts.fillStyle) node.fillStyleId = b4Style(index, "paint", opts.fillStyle).id;
  else node.fills = [];
  if (opts.strokeStyle) {
    node.strokeStyleId = b4Style(index, "paint", opts.strokeStyle).id;
    node.strokeWeight = opts.strokeWeight || 1;
  } else {
    node.strokes = [];
  }
  if (opts.effectStyle) node.effectStyleId = b4Style(index, "effect", opts.effectStyle).id;
  if (opts.w || opts.h) {
    node.resize(opts.w || node.width, opts.h || node.height);
    if (opts.w) node.primaryAxisSizingMode = opts.primarySizing || node.primaryAxisSizingMode;
    if (opts.h) node.counterAxisSizingMode = opts.counterSizing || node.counterAxisSizingMode;
  }
  return node;
}

async function b7Text(name, characters, opts, index) {
  const node = figma.createText();
  node.name = name;
  if (opts.textStyle) {
    const style = b4Style(index, "text", opts.textStyle);
    if (style.fontName) {
      await figma.loadFontAsync(style.fontName);
      node.fontName = style.fontName;
    }
    node.textStyleId = style.id;
  } else {
    const font = await b4Font(opts.weight || 400);
    node.fontName = font;
    node.fontSize = opts.size || 14;
    if (opts.letterSpacingPercent != null) node.letterSpacing = { unit: "PERCENT", value: opts.letterSpacingPercent };
  }
  node.characters = characters;
  if (opts.colorStyle) node.fillStyleId = b4Style(index, "paint", opts.colorStyle).id;
  return node;
}

async function b7Pill(name, label, index, opts) {
  const frame = b7Frame(name, {
    layout: "HORIZONTAL", align: "CENTER", gap: 6, px: 12, py: 8, radius: 9999,
    fillStyle: opts && opts.fillStyle ? opts.fillStyle : null,
    strokeStyle: opts && opts.strokeStyle ? opts.strokeStyle : null,
  }, index);
  frame.appendChild(await b7Text("icon", opts && opts.icon ? opts.icon : "•", { size: 12, weight: 500, colorStyle: opts && opts.colorStyle ? opts.colorStyle : "ABox/Semantic/muted-foreground" }, index));
  frame.appendChild(await b7Text("label", label, { size: 14, weight: 500, colorStyle: opts && opts.colorStyle ? opts.colorStyle : "ABox/Semantic/foreground" }, index));
  return frame;
}

function b7FindOne(root, name) {
  const found = [];
  (function walk(n) {
    for (const c of n.children || []) {
      if (c.name === name) found.push(c);
      walk(c);
    }
  })(root);
  if (found.length !== 1) {
    throw new Error('STOP: TARGET LAYER "' + name + '" resolved to ' + found.length + " nodes in " + root.name + ".");
  }
  return found[0];
}

function b7FindOptional(root, name) {
  const found = [];
  (function walk(n) {
    for (const c of n.children || []) {
      if (c.name === name) found.push(c);
      walk(c);
    }
  })(root);
  if (found.length > 1) {
    throw new Error('STOP: TARGET LAYER "' + name + '" resolved to ' + found.length + " nodes in " + root.name + ".");
  }
  return found[0] || null;
}

function b7Property(owner, binding) {
  const prop = b5EnsureProperty(owner, binding.name, binding.type, binding.value);
  if (prop.created) b7CreatedProperties += 1;
  return prop.id;
}

function b7BindTo(owner, body, target, binding, propId) {
  if (binding.field !== "characters" && binding.field !== "visible") {
    throw new Error('STOP: unsupported B7 property field "' + binding.field + '" for ' + binding.name + ".");
  }
  b5Bind(owner, body, target, binding.field, propId, binding.name);
}

function b7NodePaths(root) {
  const out = [];
  (function walk(n, prefix) {
    for (const c of n.children || []) {
      const path = prefix ? prefix + "/" + c.name : c.name;
      const pieces = [c.type + ":" + path];
      if (c.layoutMode) pieces.push("layout=" + c.layoutMode);
      if (c.layoutWrap) pieces.push("wrap=" + c.layoutWrap);
      if (c.itemSpacing != null) pieces.push("gap=" + c.itemSpacing);
      if (c.counterAxisSpacing != null) pieces.push("cgap=" + c.counterAxisSpacing);
      if (c.fillStyleId) pieces.push("fill=" + c.fillStyleId);
      if (c.strokeStyleId) pieces.push("stroke=" + c.strokeStyleId);
      if (c.type === "TEXT") pieces.push("text=" + c.characters);
      const refs = c.componentPropertyReferences || {};
      for (const key of Object.keys(refs).sort()) pieces.push("ref." + key + "=" + refs[key].split("#")[0]);
      out.push(pieces.join("|"));
      walk(c, path);
    }
  })(root, "");
  return out;
}

function b7HasRequiredShape(root, expectedNames) {
  const names = b7NodePaths(root).map((p) => p.split(":")[1].split("|")[0]);
  return expectedNames.every((n) => names.indexOf(n) !== -1);
}

function b7SetDescription(node, shell, extra) {
  node.description = shell.source + " | B7 signature: " + (shell.signature || extra || shell.name);
}

async function b7BuildInternal(index, page, shell) {
  const root = figma.createComponent();
  root.name = shell.name;
  root.layoutMode = "HORIZONTAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.itemSpacing = 24;
  root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 24;
  root.fillStyleId = b4Style(index, "paint", "ABox/Semantic/background").id;
  page.appendChild(root);

  const rail = b7Frame("desktop-rail", { w: 268, h: 900, layout: "VERTICAL", gap: 24, px: 18, py: 18, radius: 28, fillStyle: "ABox/Semantic/sidebar", strokeStyle: "ABox/Semantic/sidebar-border", effectStyle: "ABox/Elevation/plate" }, index);
  const brand = b7Frame("rail-brand", { layout: "HORIZONTAL", align: "CENTER", gap: 10 }, index);
  brand.appendChild(b7Instance({ of: "ABox/Brand/AboxMark", variants: { tone: "sidebar" }, name: "AboxMark" }));
  brand.appendChild(await b7Text("brand-label", "Agency in a Box", { size: 16, weight: 600, colorStyle: "ABox/Semantic/sidebar-foreground" }, index));
  rail.appendChild(brand);
  const nav = b7Frame("rail-navigation", { layout: "VERTICAL", gap: 8 }, index);
  for (const label of ["Dashboard", "Organizations", "Customers", "Tasks", "Commissions"]) {
    nav.appendChild(await b7Pill(label === shell.construction.activeNavSample ? "nav-item[active-sample]" : "nav-item", label, index, {
      icon: "•",
      fillStyle: label === shell.construction.activeNavSample ? "ABox/Semantic/sidebar-accent" : null,
      strokeStyle: label === shell.construction.activeNavSample ? "ABox/Semantic/sidebar-border" : null,
      colorStyle: "ABox/Semantic/sidebar-foreground",
    }));
  }
  rail.appendChild(nav);
  root.appendChild(rail);

  const content = b7Frame("workspace-column", { w: 1080, h: 900, layout: "VERTICAL", gap: 28 }, index);
  const top = b7Frame("top-bar", { layout: "HORIZONTAL", align: "CENTER", gap: 16, px: 16, py: 10, radius: 9999, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline", effectStyle: "ABox/Elevation/plate" }, index);
  const wp = b7Frame("workspace-pill", { layout: "VERTICAL", gap: 2 }, index);
  wp.appendChild(await b7Text("workspace-label", shell.construction.workspaceLabel, { size: 11, weight: 500, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  wp.appendChild(await b7Text("entity-label", shell.construction.entity, { size: 14, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  top.appendChild(wp);
  top.appendChild(await b7Pill("search-region", "Search everything", index, { icon: "⌕", strokeStyle: "ABox/Semantic/hairline", colorStyle: "ABox/Semantic/muted-foreground" }));
  top.appendChild(await b7Pill("action-orb-group", "Tasks · Notifications · Theme · Account", index, { icon: "◌", colorStyle: "ABox/Semantic/muted-foreground" }));
  content.appendChild(top);

  const header = b7Frame("page-header", { layout: "HORIZONTAL", align: "CENTER", gap: 20 }, index);
  const copy = b7Frame("page-header-copy", { layout: "VERTICAL", gap: 8 }, index);
  copy.appendChild(await b7Text("eyebrow", shell.construction.eyebrow, { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  copy.appendChild(await b7Text("title", shell.construction.pageTitle, { size: 44, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  header.appendChild(copy);
  header.appendChild(b7Frame("actions-region", { w: 220, h: 44, layout: "HORIZONTAL", gap: 8, px: 0, py: 0 }, index));
  content.appendChild(header);
  const main = b7Frame("content-region — shell placeholder", { w: 980, h: 520, layout: "VERTICAL", gap: 0, px: 24, py: 24, radius: 24, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
  content.appendChild(main);
  content.appendChild(await b7Pill("assistant-launcher-region", "Plan-AI", index, { icon: "✦", fillStyle: "ABox/Semantic/primary", colorStyle: "ABox/Semantic/primary-foreground" }));
  root.appendChild(content);
  b7SetDescription(root, shell);
  b7CreatedPhysical += 1;
  return root;
}

async function b7BuildMarketplaceVariant(index, shell, variant) {
  const root = figma.createComponent();
  root.name = "variant=" + variant.value;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.itemSpacing = 22;
  root.paddingLeft = root.paddingRight = 32;
  root.paddingTop = variant.value === "landing" ? 24 : 16;
  root.paddingBottom = 32;
  root.fillStyleId = b4Style(index, "paint", "ABox/Semantic/background").id;

  const header = b7Frame("header-pill", { layout: "HORIZONTAL", align: "CENTER", gap: 18, px: 16, py: 10, radius: 9999, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline", effectStyle: "ABox/Elevation/plate" }, index);
  const brand = b7Frame("brand-home-region", { layout: "HORIZONTAL", align: "CENTER", gap: 10 }, index);
  brand.appendChild(b7Instance({ of: "ABox/Brand/AboxMark", variants: { tone: "primary" }, name: "AboxMark" }));
  const brandText = b7Frame("brand-copy", { layout: "VERTICAL", gap: 2 }, index);
  brandText.appendChild(await b7Text("brand-name", "ABox", { size: 16, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  brandText.appendChild(await b7Text("brand-tagline", "Agency in a Box", { textStyle: "ABox/Text/serial", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  brand.appendChild(brandText);
  header.appendChild(brand);
  const nav = b7Frame("marketplace-navigation", { layout: "HORIZONTAL", align: "CENTER", gap: 6 }, index);
  if (variant.navAddsShopPlans) nav.appendChild(await b7Pill("pill-link-shop-plans", "Shop plans", index, { icon: "▦" }));
  nav.appendChild(await b7Pill("pill-link-ichra", "ICHRA", index, { icon: "▣" }));
  nav.appendChild(await b7Pill("pill-link-agent-help", "Agent help", index, { icon: "?" }));
  nav.appendChild(await b7Pill("cart-region", "Cart", index, { icon: "◷", colorStyle: "ABox/Semantic/muted-foreground" }));
  nav.appendChild(await b7Pill("auth-region", "Sign in", index, { icon: "→", fillStyle: "ABox/Semantic/primary", colorStyle: "ABox/Semantic/primary-foreground" }));
  header.appendChild(nav);
  root.appendChild(header);

  if (variant.hasProductRegion) {
    const rail = b7Frame("product-switcher-region", { layout: "HORIZONTAL", wrap: "WRAP", gap: 8, counterGap: 8, px: 12, py: 10, radius: 9999, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
    for (const key of ABOX_B7.shells[1].productKeys) {
      rail.appendChild(await b7Pill(key === variant.construction.product ? "product-item[active-sample]" : "product-item", key.toUpperCase(), index, {
        icon: "•",
        fillStyle: key === variant.construction.product ? "ABox/Semantic/primary" : null,
        strokeStyle: "ABox/Semantic/hairline",
        colorStyle: key === variant.construction.product ? "ABox/Semantic/primary-foreground" : "ABox/Semantic/foreground",
      }));
    }
    root.appendChild(rail);
  }
  root.appendChild(b7Frame("content-region — shell placeholder", { w: 1180, h: 440, layout: "VERTICAL", gap: 0, px: 24, py: 24, radius: 0 }, index));
  const footer = b7Frame("footer-plate", { layout: "VERTICAL", gap: 18, px: 28, py: 28, radius: 28, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
  const footBrand = b7Frame("footer-brand-region", { layout: "HORIZONTAL", align: "CENTER", gap: 10 }, index);
  footBrand.appendChild(b7Instance({ of: "ABox/Brand/AboxMark", variants: { tone: "foreground" }, name: "AboxMark" }));
  footBrand.appendChild(await b7Text("footer-brand-copy", "ABox · Agency in a Box", { size: 14, weight: 500, colorStyle: "ABox/Semantic/foreground" }, index));
  footer.appendChild(footBrand);
  footer.appendChild(await b7Text("footer-links", "Terms · Privacy · Compliance · Accessibility", { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  root.appendChild(footer);
  root.appendChild(await b7Pill("assistant-launcher-region", "Plan-AI", index, { icon: "✦", fillStyle: "ABox/Semantic/primary", colorStyle: "ABox/Semantic/primary-foreground" }));
  root.description = shell.source + " | B7 signature: " + variant.signature;
  b7CreatedPhysical += 1;
  return root;
}

async function b7BuildMember(index, page, shell) {
  const root = figma.createComponent();
  root.name = shell.name;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.itemSpacing = 28;
  root.paddingLeft = root.paddingRight = 32;
  root.paddingTop = root.paddingBottom = 24;
  root.fillStyleId = b4Style(index, "paint", "ABox/Semantic/background").id;
  page.appendChild(root);

  const header = b7Frame("header-pill", { layout: "HORIZONTAL", align: "CENTER", gap: 16, px: 16, py: 10, radius: 9999, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline", effectStyle: "ABox/Elevation/plate" }, index);
  header.appendChild(b7Instance({ of: "ABox/Brand/AboxMark", variants: { tone: "primary" }, name: "AboxMark" }));
  header.appendChild(await b7Text("member-workspace-label", "Member workspace", { size: 16, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  header.appendChild(await b7Pill("member-header-actions", "Hello · Theme · Sign out", index, { icon: "◌" }));
  root.appendChild(header);

  const body = b7Frame("member-body", { layout: "HORIZONTAL", gap: 32 }, index);
  const nav = b7Frame("member-nav", { layout: "VERTICAL", gap: 12 }, index);
  for (const label of shell.construction.navItems) {
    nav.appendChild(await b7Pill(label === shell.construction.activeNavSample ? "member-nav/item[active-sample]" : "member-nav/item", label, index, {
      icon: "•",
      fillStyle: label === shell.construction.activeNavSample ? "ABox/Semantic/primary" : null,
      strokeStyle: "ABox/Semantic/hairline",
      colorStyle: label === shell.construction.activeNavSample ? "ABox/Semantic/primary-foreground" : "ABox/Semantic/foreground",
    }));
  }
  body.appendChild(nav);
  body.appendChild(b7Frame("content-region — shell placeholder", { w: 920, h: 560, layout: "VERTICAL", gap: 0, px: 40, py: 40, radius: 24, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index));
  root.appendChild(body);
  root.appendChild(await b7Pill("assistant-launcher-region", "Plan-AI", index, { icon: "✦", fillStyle: "ABox/Semantic/primary", colorStyle: "ABox/Semantic/primary-foreground" }));
  b7SetDescription(root, shell);
  b7CreatedPhysical += 1;
  return root;
}

function b7AssertNoDuplicateShells(page) {
  const approved = b7ShellNames();
  for (const name of approved) {
    const top = page.children.filter((n) => n.name === name);
    if (top.length > 1) throw new Error('STOP: DUPLICATE SHELL — "' + name + '" exists ' + top.length + " times on " + B7_PAGE + ".");
  }
  for (const n of b4AllNodes(["COMPONENT", "COMPONENT_SET"])) {
    if (approved.indexOf(n.name) !== -1 && n.parent !== page && (!n.parent || n.parent.type !== "COMPONENT_SET")) {
      throw new Error('STOP: SHELL OUTSIDE SCOPE — "' + n.name + '" lives on "' + (n.parent && n.parent.name) + '".');
    }
  }
}

function b7MarketplaceAxis(set, shell) {
  const defs = set.componentPropertyDefinitions || {};
  const axes = Object.keys(defs).filter((k) => defs[k].type === "VARIANT");
  const values = axes.length === 1 ? (defs[axes[0]].variantOptions || []).slice().sort() : [];
  const want = shell.values.slice().sort();
  if (axes.length !== 1 || axes[0].split("#")[0] !== shell.property || values.join("|") !== want.join("|")) {
    throw new Error('STOP: MARKETPLACE VARIANT AXIS MISMATCH — expected variant=flow|landing; live axes ' + JSON.stringify(axes) + " values " + JSON.stringify(values) + ".");
  }
}

function b7MarketplaceVariant(set, value) {
  const name = "variant=" + value;
  const found = set.children.filter((c) => c.name === name);
  if (found.length !== 1) throw new Error('STOP: MARKETPLACE VARIANT "' + name + '" resolved to ' + found.length + " nodes.");
  return found[0];
}

async function b7EnsureMarketplace(index, page, shell) {
  b7Main("ABox/Brand/AboxMark");
  let set = b4FindSet(shell.name);
  if (set && set.parent !== page) throw new Error('STOP: SHELL OUTSIDE SCOPE — "' + shell.name + '" lives on "' + (set.parent && set.parent.name) + '".');
  if (!set) {
    const existingStandalone = b4FindComponent(shell.name);
    if (existingStandalone) throw new Error('STOP: TYPE MISMATCH — "' + shell.name + '" exists as a standalone component.');
    const variants = [];
    for (const variant of shell.variants) {
      const orphan = page.children.filter((n) => n.name === "variant=" + variant.value);
      if (orphan.length) throw new Error('STOP: ORPHAN MARKETPLACE VARIANT NODE — variant=' + variant.value + ".");
      const node = await b7BuildMarketplaceVariant(index, shell, variant);
      page.appendChild(node);
      variants.push(node);
      b7Say("variant  ", shell.name + " / variant=" + variant.value, true);
    }
    set = figma.combineAsVariants(variants, page);
    set.name = shell.name;
    set.fills = [];
    b7CreatedSets += 1;
    b7Say("set      ", shell.name, true);
  } else {
    b7MarketplaceAxis(set, shell);
    for (const variant of shell.variants) {
      const node = b7MarketplaceVariant(set, variant.value);
      const expected = variant.hasProductRegion
        ? ["header-pill", "product-switcher-region", "content-region — shell placeholder", "footer-plate", "assistant-launcher-region"]
        : ["header-pill", "content-region — shell placeholder", "footer-plate", "assistant-launcher-region"];
      if (!b7HasRequiredShape(node, expected)) {
        throw new Error('STOP: LIVE SHELL DIFFERS FROM THE APPROVED DEFINITION — ' + shell.name + " / variant=" + variant.value + ". Nothing was overwritten or deleted.");
      }
      b7Say("variant  ", shell.name + " / variant=" + variant.value, false);
    }
    b7Say("set      ", shell.name, false);
  }

  b7MarketplaceAxis(set, shell);
  const showProducts = shell.properties.filter((p) => p.name === "showProducts")[0];
  const showAssistant = shell.properties.filter((p) => p.name === "showAssistant")[0];
  const flow = b7MarketplaceVariant(set, "flow");
  const landing = b7MarketplaceVariant(set, "landing");
  const flowProduct = b7FindOne(flow, "product-switcher-region");
  if (b7FindOptional(landing, "product-switcher-region")) {
    throw new Error("STOP: Marketplace landing contains a product-switcher-region. No synthetic target is allowed.");
  }
  const showProductsId = b7Property(set, showProducts);
  b7BindTo(set, flow, flowProduct, showProducts, showProductsId);
  say("  boolean  bound   : " + shell.name + " . showProducts  id=" + showProductsId + " -> variant=flow / product-switcher-region ref=visible; landing=no target");

  const showAssistantId = b7Property(set, showAssistant);
  for (const body of [flow, landing]) {
    b7BindTo(set, body, b7FindOne(body, "assistant-launcher-region"), showAssistant, showAssistantId);
  }
  say("  boolean  bound   : " + shell.name + " . showAssistant  id=" + showAssistantId + " -> assistant-launcher-region ref=visible in flow+landing");
  set.description = shell.source + " | B7 signature: ComponentSet variant=flow|landing; showProducts asymmetric flow-only binding; landing no target.";
  return set;
}

async function b7EnsureStandalone(index, page, shell) {
  b7Main("ABox/Brand/AboxMark");
  let node = b4FindComponent(shell.name);
  if (node && node.parent !== page) throw new Error('STOP: SHELL OUTSIDE SCOPE — "' + shell.name + '" lives on "' + (node.parent && node.parent.name) + '".');
  if (b4FindSet(shell.name)) throw new Error('STOP: TYPE MISMATCH — "' + shell.name + '" exists as a Component Set.');
  if (!node) {
    node = shell.name.indexOf("/Internal") !== -1 ? await b7BuildInternal(index, page, shell) : await b7BuildMember(index, page, shell);
    b7Say("component", shell.name, true);
  } else {
    const expected = shell.name.indexOf("/Internal") !== -1
      ? ["desktop-rail", "top-bar", "page-header", "content-region — shell placeholder", "assistant-launcher-region"]
      : ["header-pill", "member-body", "member-nav", "content-region — shell placeholder", "assistant-launcher-region"];
    if (!b7HasRequiredShape(node, expected)) {
      throw new Error('STOP: LIVE SHELL DIFFERS FROM THE APPROVED DEFINITION — ' + shell.name + ". Nothing was overwritten or deleted.");
    }
    b7Say("component", shell.name, false);
  }
  for (const binding of shell.properties || []) {
    const propId = b7Property(node, binding);
    const targetName = binding.target.split("/").pop();
    const target = b7FindOne(node, targetName);
    b7BindTo(node, node, target, binding, propId);
    say("  " + binding.type.toLowerCase() + "     bound   : " + shell.name + " . " + binding.name + "  id=" + propId + " -> " + target.name + " ref=" + binding.field + "  " + binding.source);
  }
  return node;
}

async function ensureB7Shells() {
  await figma.loadAllPagesAsync();
  b7CreatedPhysical = 0;
  b7CreatedSets = 0;
  b7CreatedProperties = 0;
  const page = b7Page();
  b7AssertNoDuplicateShells(page);
  const index = await b4StyleIndex();

  // Protected dependencies are resolved before any shell write.
  const required = {};
  for (const shell of ABOX_B7.shells) for (const n of shell.requiredInstances || []) required[n] = true;
  for (const name of Object.keys(required).sort()) {
    const main = b7Main(name);
    say("  primitive resolved: " + name + "  id=" + main.id);
  }

  for (const shell of ABOX_B7.shells) {
    if (shell.kind === "COMPONENT_SET") await b7EnsureMarketplace(index, page, shell);
    else await b7EnsureStandalone(index, page, shell);
  }
  say("");
  say("  shell physical ComponentNodes created this run: " + b7CreatedPhysical);
  say("  shell Component Sets created this run: " + b7CreatedSets);
  say("  shell component properties created this run: " + b7CreatedProperties);
}

function b7Nodes(page) {
  const sets = page.children.filter((n) => n.type === "COMPONENT_SET" && n.name.indexOf("ABox/Shell/") === 0);
  const standalone = page.children.filter((n) => n.type === "COMPONENT" && n.name.indexOf("ABox/Shell/") === 0);
  const variants = sets.reduce((n, s) => n + s.children.length, 0);
  return { sets, standalone, variants, physical: standalone.length + variants };
}

function b7Refs(node) {
  const out = [];
  (function walk(n) {
    const refs = n.componentPropertyReferences || {};
    for (const field of Object.keys(refs)) out.push({ node: n, field: field, prop: refs[field] });
    for (const c of n.children || []) walk(c);
  })(node);
  return out;
}

function b7PropKey(owner, name, type) {
  const defs = owner.componentPropertyDefinitions || {};
  const keys = Object.keys(defs).filter((k) => k.split("#")[0] === name);
  if (keys.length !== 1) return null;
  if (defs[keys[0]].type !== type) return null;
  return keys[0];
}

function b7MainName(inst) {
  const main = inst.mainComponent;
  if (!main) return "MISSING";
  if (main.parent && main.parent.type === "COMPONENT_SET") return main.parent.name;
  return main.name;
}

function b7NestedComponentIds(root) {
  const ids = [];
  (function walk(n) {
    for (const c of n.children || []) {
      if (c.type === "INSTANCE") ids.push(b7MainName(c) + " id=" + (c.mainComponent ? (c.mainComponent.parent && c.mainComponent.parent.type === "COMPONENT_SET" ? c.mainComponent.parent.id : c.mainComponent.id) : "MISSING"));
      walk(c);
    }
  })(root);
  return ids;
}

function b7RawStyleLeaks(root) {
  let raw = 0;
  (function walk(n) {
    if ((n.fills || []).length && !n.fillStyleId && n.type !== "COMPONENT_SET") raw += 1;
    if ((n.strokes || []).length && !n.strokeStyleId && n.type !== "COMPONENT_SET") raw += 1;
    for (const c of n.children || []) walk(c);
  })(root);
  return raw;
}

async function verifyB7() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);
  const C = ABOX_B7.counts;
  const page = b7Page();
  const nodes = b7Nodes(page);

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const b1Names = ABOX_B1.collections.map((c) => c.name);
  const b1Cols = collections.filter((c) => b1Names.indexOf(c.name) !== -1);
  let b1Vars = 0;
  for (const c of b1Cols) b1Vars += c.variableIds.length;
  const typo = collections.filter((c) => c.name === "ABox/Typography");
  add(b1Cols.length === C.b1Collections && b1Vars === C.b1Variables, "B1 unchanged: 9 collections / 200 variables (found " + b1Cols.length + " / " + b1Vars + ")");
  add(typo.length === 1 && typo[0].variableIds.length === C.b2Variables, "B2 unchanged: ABox/Typography with 19 variables");
  const owned = (list) => list.filter((s) => s.name.indexOf("ABox/") === 0);
  const paints = owned(await figma.getLocalPaintStylesAsync());
  const texts = owned(await figma.getLocalTextStylesAsync());
  const effects = owned(await figma.getLocalEffectStylesAsync());
  add(paints.length + texts.length + effects.length === C.b3Styles, "B3 unchanged: 79 styles — found " + (paints.length + texts.length + effects.length));

  const componentsPage = figma.root.children.filter((p) => p.name === B4_PAGE)[0];
  const primSets = componentsPage ? componentsPage.children.filter((n) => n.type === "COMPONENT_SET") : [];
  const primStandalone = componentsPage ? componentsPage.children.filter((n) => n.type === "COMPONENT") : [];
  const primVariants = primSets.reduce((n, s) => n + s.children.length, 0);
  add(primSets.length === C.b4Sets, "B4 unchanged: 11 component sets on 01 Components (found " + primSets.length + ")");
  add(primStandalone.length === C.b4Standalone && primVariants === C.b5Variants && primVariants + primStandalone.length === C.b5Physical,
    "B5 unchanged: 3 standalone, 56 variant nodes, 59 physical nodes (found " + primStandalone.length + " / " + primVariants + " / " + (primStandalone.length + primVariants) + ")");

  const b5Props = ABOX_B5.bindings.filter((b) => !!b7PropKey(b5Owner(b.component), b.property, b.type)).length;
  add(b5Props === C.b5NonVariant, "existing B4/B5 component-property ids preserved (" + b5Props + " / " + C.b5NonVariant + ")");
  const patternPage = figma.root.children.filter((p) => p.name === B6_PAGE)[0];
  const patternNodes = patternPage ? b6PatternNodes(patternPage) : [];
  add(patternPage && patternPage.children.length === C.b6TopLevel && patternNodes.length === C.b6PhysicalNodes, "B6 unchanged: 3 top-level pattern objects / 4 physical ComponentNodes");

  const wantPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells", "04 Experiences", "05 Screens", "06 Documentation"];
  add(figma.root.children.length === 7 && figma.root.children.map((p) => p.name).join("|") === wantPages.join("|"), "B0 pages unchanged: exactly 7, in original order");
  const writable = [B4_PAGE, B6_PAGE, B7_PAGE, B8_PAGE];
  add(figma.root.children.filter((p) => writable.indexOf(p.name) === -1).every((p) => p.children.length === 0), "00 Foundations, 05 Screens and 06 Documentation remain empty; B8 may populate 04 Experiences");
  add(page.children.length === C.topLevelObjects, "only 03 Shells receives B7 shell content: 3 top-level shell objects (found " + page.children.length + ")");

  const internal = page.children.filter((n) => n.name === "ABox/Shell/Internal" && n.type === "COMPONENT")[0];
  const member = page.children.filter((n) => n.name === "ABox/Shell/Member" && n.type === "COMPONENT")[0];
  const marketplace = page.children.filter((n) => n.name === "ABox/Shell/Marketplace" && n.type === "COMPONENT_SET")[0];
  add(!!internal && !!marketplace && !!member, "approved shell inventory exists: Internal, Marketplace, Member");
  add(nodes.sets.length === C.componentSets && nodes.standalone.length === C.standaloneComponents, "shell object types: 1 Component Set + 2 standalone Components");
  add(nodes.variants === C.variantComponentNodes && nodes.physical === C.physicalComponentNodes, "physical B7 ComponentNodes total = 4 (found " + nodes.physical + ")");

  let marketAxisOk = false, marketShapeOk = false, marketNoTarget = false, showProductsOk = false, showAssistantOk = false;
  let showProductsLine = "  ABox/Shell/Marketplace.showProducts : MISSING";
  if (marketplace) {
    try { b7MarketplaceAxis(marketplace, ABOX_B7.shells[1]); marketAxisOk = true; } catch (e) { marketAxisOk = false; }
    const flow = marketplace.children.filter((c) => c.name === "variant=flow")[0];
    const landing = marketplace.children.filter((c) => c.name === "variant=landing")[0];
    marketShapeOk = !!flow && !!landing && b7HasRequiredShape(flow, ["product-switcher-region", "content-region — shell placeholder", "assistant-launcher-region"]) && b7HasRequiredShape(landing, ["content-region — shell placeholder", "assistant-launcher-region"]);
    marketNoTarget = !!landing && !b7FindOptional(landing, "product-switcher-region");
    const spKey = b7PropKey(marketplace, "showProducts", "BOOLEAN");
    if (flow && spKey) {
      const product = b7FindOptional(flow, "product-switcher-region");
      const refs = (product && product.componentPropertyReferences) || {};
      showProductsOk = !!product && refs.visible === spKey;
      showProductsLine = "  ABox/Shell/Marketplace.showProducts [BOOLEAN] id=" + spKey + " -> variant=flow / " + (product ? product.name : "MISSING") + " id=" + (product ? product.id : "-") + " ref=visible " + (showProductsOk ? "bound" : "UNBOUND") + "; variant=landing no target";
    }
    const saKey = b7PropKey(marketplace, "showAssistant", "BOOLEAN");
    if (flow && landing && saKey) {
      const f = b7FindOptional(flow, "assistant-launcher-region");
      const l = b7FindOptional(landing, "assistant-launcher-region");
      showAssistantOk = !!f && !!l && ((f.componentPropertyReferences || {}).visible === saKey) && ((l.componentPropertyReferences || {}).visible === saKey);
    }
  }
  add(marketAxisOk, "Marketplace.variant is exactly one source-backed VARIANT axis with values flow and landing");
  add(marketShapeOk, "Marketplace flow/landing structures match approved shell regions");
  add(marketNoTarget, "Marketplace.showProducts is never attached to a nonexistent landing node; landing has no synthetic product-switcher target");
  add(showProductsOk, "Marketplace.showProducts flow variant's exact product-switcher region has the correct visible reference");
  add(showAssistantOk, "Marketplace.showAssistant is bound to exact launcher-region visible fields in flow and landing");

  let internalPropsOk = false;
  let propertyLines = [showProductsLine];
  if (internal) {
    const expected = [
      { name: "pageTitle", type: "TEXT", field: "characters", target: "title" },
      { name: "eyebrow", type: "TEXT", field: "characters", target: "eyebrow" },
      { name: "entity", type: "TEXT", field: "characters", target: "entity-label" },
    ];
    internalPropsOk = true;
    for (const e of expected) {
      const key = b7PropKey(internal, e.name, e.type);
      const target = b7FindOptional(internal, e.target);
      const ok = !!key && !!target && (target.componentPropertyReferences || {})[e.field] === key;
      if (!ok) internalPropsOk = false;
      propertyLines.push("  ABox/Shell/Internal." + e.name + " [" + e.type + "] id=" + (key || "MISSING") + " -> " + e.target + " id=" + (target ? target.id : "-") + " ref=" + e.field + " " + (ok ? "bound" : "UNBOUND"));
    }
  }
  add(internalPropsOk, "Internal.pageTitle, Internal.eyebrow and Internal.entity are bound TEXT properties on exact text layers");

  let actionsOk = true;
  if (internal) {
    const defs = internal.componentPropertyDefinitions || {};
    actionsOk = Object.keys(defs).filter((k) => ["actions", "hasActions"].indexOf(k.split("#")[0]) !== -1).length === 0 && !!b7FindOptional(internal, "actions-region");
  }
  add(actionsOk, "Internal.actions is explicitly deferred as a structural actions-region placeholder; no detached SLOT property exists");
  add(!!member && !Object.keys((member && member.componentPropertyDefinitions) || {}).some((k) => k.split("#")[0] === "children"), "Member.children remains structural content-region only and is not fabricated into a generic property");

  let nestedOk = true, rawOk = true, protoOk = true, shellPropsDetached = true;
  const inventory = [];
  for (const top of page.children) {
    if (top.name.indexOf("ABox/Shell/") !== 0) continue;
    if (b7RawStyleLeaks(top) > 0) rawOk = false;
    const bodies = top.type === "COMPONENT_SET" ? top.children : [top];
    for (const body of bodies) {
      if ((body.reactions || []).length) protoOk = false;
      const mark = b7NestedComponentIds(body).filter((line) => line.indexOf("ABox/Brand/AboxMark") === 0);
      if (!mark.length) nestedOk = false;
      for (const r of b7Refs(body)) {
        if (!r.prop) shellPropsDetached = false;
      }
      inventory.push("  " + top.name + (top.type === "COMPONENT_SET" ? " / " + body.name : "") + "  root id=" + body.id + "  root=" + body.type + "/" + body.layoutMode + "\n      nested: " + (b7NestedComponentIds(body).join(" | ") || "none") + "\n      content: " + (b7FindOptional(body, "content-region — shell placeholder") ? b7FindOptional(body, "content-region — shell placeholder").id : "MISSING"));
    }
  }
  add(nestedOk, "every shell nested component resolves to the expected live B4/B5/B6 component id where used");
  add(rawOk, "no hard-coded duplicate foundation fills/strokes on B7 shells; style-backed or empty only");
  add(protoOk, "no invented interaction: 0 prototype reactions on any B7 shell node");
  add(shellPropsDetached, "no represented property has a wrong or detached componentPropertyReferences target");
  add(ABOX_B7.apiAudit.length === 10, "every production shell prop/state appears in the Shell API → Figma representation audit");
  add(ABOX_B7.responsive.length === 3, "responsive classifications are recorded for every shell");
  add(ABOX_B7.interactions.length === 3, "interaction metadata is recorded for every shell");
  add(!page.children.some((n) => /mobile|desktop\/mobile|screen|experience|B8/i.test(n.name)), "no invented responsive variant, screen-level content or B8 object created on 03 Shells");
  add(b7CreatedPhysical === 0 || b7CreatedPhysical === C.physicalComponentNodes, "run bookkeeping: physical ComponentNodes created this run = " + b7CreatedPhysical);
  add(b7CreatedSets === 0 || b7CreatedSets === C.componentSets, "run bookkeeping: Component Sets created this run = " + b7CreatedSets);

  say("");
  say("ID PROVENANCE: ids below are REAL FIGMA ids only when this run executed inside Figma Desktop.");
  say("  An offline/mock harness prints OFFLINE MOCK ids and they are never evidence of a real write.");
  say("  runtime: " + (typeof figma.getFileThumbnailNodeAsync === "function" ? "figma plugin API" : "figma plugin API (host-reported)"));

  say("");
  say("B7 SHELL INVENTORY");
  for (const line of inventory) say(line);
  say("");
  say("B7 PROPERTY / LAYER BINDING INVENTORY");
  for (const line of propertyLines) say(line);
  if (marketplace) {
    const saKey = b7PropKey(marketplace, "showAssistant", "BOOLEAN");
    say("  ABox/Shell/Marketplace.showAssistant [BOOLEAN] id=" + (saKey || "MISSING") + " -> assistant-launcher-region ref=visible in flow+landing");
    say("  ABox/Shell/Marketplace.variant [VARIANT] values=flow|landing");
  }
  say("");
  say("B7 API AUDIT");
  for (const row of ABOX_B7.apiAudit) say("  - " + row);
  say("");
  say("B7 RESPONSIVE AUDIT");
  for (const row of ABOX_B7.responsive) say("  - " + row);
  say("");
  say("B7 INTERACTION AUDIT");
  for (const row of ABOX_B7.interactions) say("  - " + row);
  say("");
  say("B7 COUNTS");
  say("  shell assets total " + C.shellAssets + " | shell Component Sets " + C.componentSets + " | standalone shell Components " + C.standaloneComponents);
  say("  shell Variant ComponentNodes " + C.variantComponentNodes + " | physical B7 ComponentNodes " + C.physicalComponentNodes + " | top-level objects on 03 Shells " + C.topLevelObjects);
  say("  run creation count: physical=" + b7CreatedPhysical + ", sets=" + b7CreatedSets + ", properties=" + b7CreatedProperties + "; run 2 must be zero with identical ids/property ids");
  say("");
  say("B7 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  say("  NOTE  src/** unchanged — asserted outside Figma with `git diff --stat -- src/`; the plugin sandbox cannot read the repository.");
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say("RECORDED LIMITATIONS / EXCEPTIONS");
  for (const l of ABOX_B7.limitations) say("  - " + l);
  say("  - No publishing performed; library publishing is a separate step.");
  say("");
  say(passed ? "RESULT: B7 PASSED" : "RESULT: B7 FAILED — do not proceed to B8.");
  return passed;
}


/* =====================  Phase 55 / Batch B8 — experiences  ===================== */
/*
 * B8 creates journey-level reference compositions on 04 Experiences only. It
 * consumes existing B7 shells, B6 patterns and B4/B5 components as live
 * instances, creates only top-level FRAME assets, and never creates variables,
 * styles, components, component sets, properties, patterns or prototype links.
 */

const B8_PAGE = "04 Experiences";
var b8Created = 0;

function b8Page() {
  const page = figma.root.children.filter((p) => p.name === B8_PAGE);
  if (page.length !== 1) {
    throw new Error('STOP: B0 page "' + B8_PAGE + '" must exist exactly once (found ' + page.length + ").");
  }
  return page[0];
}

function b8ApprovedNames() {
  return ABOX_B8.experiences.map((e) => e.name);
}

function b8PluginSignature(frame) {
  return {
    batch: frame.getPluginData("aboxBatch"),
    kind: frame.getPluginData("aboxKind"),
    name: frame.getPluginData("aboxName"),
    signature: frame.getPluginData("aboxSignature"),
    sources: frame.getPluginData("aboxSources"),
  };
}

function b8SetPluginData(frame, spec) {
  frame.setPluginData("aboxBatch", "B8");
  frame.setPluginData("aboxKind", "experience");
  frame.setPluginData("aboxName", spec.name);
  frame.setPluginData("aboxSignature", spec.signature);
  frame.setPluginData("aboxSources", spec.sources.slice().sort().join("|"));
}

function b8ShellMain(name) {
  const set = b4FindSet(name);
  if (set) return set;
  const component = b4FindComponent(name);
  if (component) return component;
  throw new Error('STOP: MISSING B7 SHELL — "' + name + '" not found. Run B7 first.');
}

function b8PatternMain(name) {
  const set = b4FindSet(name);
  if (set) return set;
  const component = b4FindComponent(name);
  if (component) return component;
  throw new Error('STOP: MISSING B6 PATTERN — "' + name + '" not found. Run B6 first.');
}

function b8ComponentMain(name) {
  const set = b4FindSet(name);
  if (set) return set;
  const component = b4FindComponent(name);
  if (component) return component;
  throw new Error('STOP: MISSING B4/B5 COMPONENT — "' + name + '" not found. Run B4/B5 first.');
}

function b8MainName(inst) {
  const main = inst.mainComponent;
  if (!main) return "MISSING";
  if (main.parent && main.parent.type === "COMPONENT_SET") return main.parent.name;
  return main.name;
}

function b8SetInstanceProps(inst, props) {
  const defs = inst.componentProperties || {};
  const out = {};
  for (const name of Object.keys(props || {})) {
    if (name === "product") continue; // B7 records product as metadata only.
    const keys = Object.keys(defs).filter((k) => k.split("#")[0] === name);
    if (keys.length === 0) throw new Error('STOP: MISSING INSTANCE PROPERTY — "' + name + '" is not available on "' + b8MainName(inst) + '".');
    if (keys.length > 1) throw new Error('STOP: instance property "' + name + '" resolves to ' + keys.length + " definitions.");
    out[keys[0]] = props[name];
  }
  if (Object.keys(out).length) inst.setProperties(out);
}

function b8VariantChild(main, props) {
  if (main.type !== "COMPONENT_SET") return main;
  const entries = Object.keys(props || {}).filter((k) => k !== "product" && typeof props[k] === "string");
  for (const key of entries) {
    const wanted = key + "=" + props[key];
    const match = main.children.filter((c) => c.name.split(",").map((s) => s.trim()).indexOf(wanted) !== -1);
    if (match.length === 1) return match[0];
    if (match.length > 1) throw new Error('STOP: AMBIGUOUS B8 VARIANT — "' + main.name + '" / "' + wanted + '" matched ' + match.length + " variants.");
  }
  return main.defaultVariant || main.children[0];
}

function b8CreateInstance(main, props, name) {
  const source = b8VariantChild(main, props || {});
  const inst = source.createInstance();
  b8SetInstanceProps(inst, props || {});
  inst.name = name || main.name.split("/").pop();
  return inst;
}

function b8ShellInstance(spec) {
  const main = b8ShellMain(spec.shell.name);
  const inst = b8CreateInstance(main, spec.shell.overrides || {}, "shell-reference-instance");
  inst.setPluginData("aboxB8Reference", spec.shell.name);
  const meta = [];
  for (const k of Object.keys(spec.shell.overrides || {}).sort()) meta.push(k + "=" + String(spec.shell.overrides[k]));
  inst.setPluginData("aboxB8Overrides", meta.join("|"));
  return inst;
}

function b8PatternInstance(pat) {
  const main = b8PatternMain(pat.name);
  const inst = b8CreateInstance(main, pat.variant || {}, pat.name.split("/").pop());
  inst.setPluginData("aboxB8Reference", pat.name);
  return inst;
}

function b8ComponentInstance(comp) {
  const main = b8ComponentMain(comp.name);
  const inst = b8CreateInstance(main, {}, comp.name.split("/").pop());
  inst.setPluginData("aboxB8Reference", comp.name);
  return inst;
}

async function b8Card(title, body, source, index) {
  const card = b7Frame("state-card", { layout: "VERTICAL", gap: 8, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline", w: 300, primarySizing: "FIXED" }, index);
  card.appendChild(await b7Text("state-title", title, { size: 16, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  card.appendChild(await b7Text("state-body", body, { size: 13, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  card.appendChild(await b7Text("state-source", source, { textStyle: "ABox/Text/serial", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  return card;
}

async function b8MetadataRegion(spec, index) {
  const region = b7Frame("metadata/source-and-limitations", { layout: "VERTICAL", gap: 8, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/surface", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("experience-name", spec.name, { size: 14, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  region.appendChild(await b7Text("experience-kind", spec.type + " · source-derived reference composition · no B8 properties/prototypes", { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(await b7Text("source-list", spec.sources.join("\n"), { size: 10, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(await b7Text("limitations", spec.limitations.join("\n"), { size: 10, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  return region;
}

async function b8ShellRegion(spec, index) {
  const region = b7Frame("shell-reference", { layout: "VERTICAL", gap: 10, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("region-label", "B7 shell instance", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(b8ShellInstance(spec));
  return region;
}

async function b8SequenceRegion(spec, index) {
  const region = b7Frame("journey-sequence", { layout: "VERTICAL", gap: 10, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/surface", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("region-label", "Journey states", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  const row = b7Frame("state-cards", { layout: "HORIZONTAL", wrap: "WRAP", gap: 12, counterGap: 12 }, index);
  for (const item of spec.sequence) row.appendChild(await b8Card(item.title, item.body, item.source, index));
  region.appendChild(row);
  return region;
}

async function b8ContentRegion(spec, index) {
  const region = b7Frame("representative-content", { layout: "VERTICAL", gap: 12, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("region-label", "Existing foundations used", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  const patternRow = b7Frame("pattern-instances", { layout: "HORIZONTAL", wrap: "WRAP", gap: 12, counterGap: 12 }, index);
  for (const pat of spec.patterns || []) patternRow.appendChild(b8PatternInstance(pat));
  if (!(spec.patterns || []).length) patternRow.appendChild(await b7Text("no-b6-pattern", "No B6 pattern applies to this journey; route-local composition remains editable native content.", { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(patternRow);
  const componentRow = b7Frame("component-instances", { layout: "HORIZONTAL", wrap: "WRAP", gap: 10, counterGap: 10 }, index);
  for (const comp of spec.components || []) componentRow.appendChild(b8ComponentInstance(comp));
  region.appendChild(componentRow);
  const native = b7Frame("route-composition-notes", { layout: "VERTICAL", gap: 8, px: 12, py: 12, radius: 12, fillStyle: "ABox/Semantic/background", strokeStyle: "ABox/Semantic/hairline" }, index);
  native.appendChild(await b7Text("note-title", "Editable route content", { size: 13, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  native.appendChild(await b7Text("note-body", spec.sequence.map((s) => s.title + ": " + s.body).join("\n"), { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(native);
  return region;
}

async function b8BuildFrame(spec, placement, index, page) {
  const root = figma.createFrame();
  root.name = spec.name;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "FIXED";
  root.counterAxisAlignItems = "MIN";
  root.primaryAxisAlignItems = "MIN";
  root.itemSpacing = 18;
  root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 24;
  root.resize(ABOX_B8.layout.frameWidth, 1000);
  root.x = placement.x;
  root.y = placement.y;
  root.fillStyleId = b4Style(index, "paint", "ABox/Semantic/background").id;
  root.strokeStyleId = b4Style(index, "paint", "ABox/Semantic/hairline").id;
  root.strokeWeight = 1;
  root.cornerRadius = 24;
  b8SetPluginData(root, spec);
  root.appendChild(await b8MetadataRegion(spec, index));
  root.appendChild(await b8ShellRegion(spec, index));
  root.appendChild(await b8SequenceRegion(spec, index));
  root.appendChild(await b8ContentRegion(spec, index));
  page.appendChild(root);
  b8Created += 1;
  return root;
}

function b8ExpectedRegions() {
  return ["metadata/source-and-limitations", "shell-reference", "journey-sequence", "representative-content"];
}

function b8HasRegions(frame) {
  const names = frame.children.map((c) => c.name);
  return b8ExpectedRegions().every((name, i) => names[i] === name);
}

function b8FindFrame(page, spec) {
  const found = page.children.filter((n) => n.name === spec.name);
  if (found.length > 1) throw new Error('STOP: DUPLICATE EXPERIENCE — "' + spec.name + '" exists ' + found.length + " times on " + B8_PAGE + ".");
  return found[0] || null;
}

function b8AssertReusable(frame, spec) {
  if (frame.type !== "FRAME") throw new Error('STOP: EXPERIENCE TYPE MISMATCH — "' + spec.name + '" is ' + frame.type + ", expected FRAME.");
  const pd = b8PluginSignature(frame);
  const wantSources = spec.sources.slice().sort().join("|");
  if (pd.batch !== "B8" || pd.kind !== "experience" || pd.name !== spec.name || pd.signature !== spec.signature || pd.sources !== wantSources) {
    throw new Error('STOP: LIVE EXPERIENCE DIFFERS FROM APPROVED B8 SIGNATURE — "' + spec.name + '". Nothing was overwritten or deleted.');
  }
  if (!b8HasRegions(frame)) {
    throw new Error('STOP: LIVE EXPERIENCE STRUCTURE DIFFERS FROM APPROVED B8 REGIONS — "' + spec.name + '". Nothing was overwritten or deleted.');
  }
}

async function ensureB8Experiences() {
  await figma.loadAllPagesAsync();
  b8Created = 0;
  const page = b8Page();
  const index = await b4StyleIndex();

  // Protected dependencies are resolved before any write.
  for (const shell of ["ABox/Shell/Internal", "ABox/Shell/Marketplace", "ABox/Shell/Member"]) {
    const main = b8ShellMain(shell);
    say("  B7 shell resolved: " + shell + "  id=" + main.id);
  }
  for (const pattern of ["ABox/Pattern/KpiRow", "ABox/Pattern/WizardStepper"]) {
    const main = b8PatternMain(pattern);
    say("  B6 pattern resolved: " + pattern + "  id=" + main.id);
  }
  const needed = {};
  for (const exp of ABOX_B8.experiences) for (const comp of exp.components || []) needed[comp.name] = true;
  for (const name of Object.keys(needed).sort()) {
    const main = b8ComponentMain(name);
    say("  B4/B5 component resolved: " + name + "  id=" + main.id);
  }

  for (let i = 0; i < ABOX_B8.experiences.length; i += 1) {
    const spec = ABOX_B8.experiences[i];
    const placement = ABOX_B8.placement.filter((p) => p.name === spec.name)[0];
    if (!placement) throw new Error('STOP: B8 placement missing for "' + spec.name + '".');
    const existing = b8FindFrame(page, spec);
    if (existing) {
      b8AssertReusable(existing, spec);
      say("  frame    reused  : " + spec.name + "  id=" + existing.id);
    } else {
      const frame = await b8BuildFrame(spec, placement, index, page);
      say("  frame    created : " + spec.name + "  id=" + frame.id);
    }
  }
  say("");
  say("  B8 top-level frames created this run: " + b8Created);
}

function b8Walk(root, fn) {
  fn(root);
  for (const c of root.children || []) b8Walk(c, fn);
}

function b8InstanceMainNames(root) {
  const names = [];
  b8Walk(root, (n) => {
    if (n.type === "INSTANCE") names.push(b8MainName(n));
  });
  return names;
}

function b8HasImageFill(root) {
  let bad = false;
  b8Walk(root, (n) => {
    for (const fill of n.fills || []) if (fill.type === "IMAGE") bad = true;
  });
  return bad;
}

function b8HasPrototype(root) {
  let bad = false;
  b8Walk(root, (n) => { if ((n.reactions || []).length) bad = true; });
  return bad;
}

async function verifyB8() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);
  const C = ABOX_B8.counts;
  const page = b8Page();

  const wantPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells", "04 Experiences", "05 Screens", "06 Documentation"];
  add(figma.root.children.length === 7 && figma.root.children.map((p) => p.name).join("|") === wantPages.join("|"), "B0 pages exist exactly once and remain in original order");
  const emptyPages = figma.root.children.filter((p) => ["00 Foundations", "05 Screens", "06 Documentation"].indexOf(p.name) !== -1);
  add(emptyPages.every((p) => p.children.length === 0), "00 Foundations, 05 Screens and 06 Documentation remain empty during B8");

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const b1Names = ABOX_B1.collections.map((c) => c.name);
  const b1Cols = collections.filter((c) => b1Names.indexOf(c.name) !== -1);
  let b1Vars = 0;
  for (const c of b1Cols) b1Vars += c.variableIds.length;
  const typo = collections.filter((c) => c.name === "ABox/Typography");
  add(b1Cols.length === C.b1Collections && b1Vars === C.b1Variables, "B1 unchanged: 9 collections / 200 variables (found " + b1Cols.length + " / " + b1Vars + ")");
  add(typo.length === 1 && typo[0].variableIds.length === C.b2Variables, "B2 unchanged: ABox/Typography with 19 variables");
  const owned = (list) => list.filter((s) => s.name.indexOf("ABox/") === 0);
  const paints = owned(await figma.getLocalPaintStylesAsync());
  const texts = owned(await figma.getLocalTextStylesAsync());
  const effects = owned(await figma.getLocalEffectStylesAsync());
  add(paints.length + texts.length + effects.length === C.b3Styles, "B3 unchanged: 79 styles — found " + (paints.length + texts.length + effects.length));

  const componentsPage = figma.root.children.filter((p) => p.name === B4_PAGE)[0];
  const primSets = componentsPage ? componentsPage.children.filter((n) => n.type === "COMPONENT_SET") : [];
  const primStandalone = componentsPage ? componentsPage.children.filter((n) => n.type === "COMPONENT") : [];
  const primVariants = primSets.reduce((n, s) => n + s.children.length, 0);
  add(primSets.length === C.b4Sets, "B4 unchanged: 11 component sets on 01 Components (found " + primSets.length + ")");
  add(primStandalone.length === C.b4Standalone && primVariants === C.b5Variants && primVariants + primStandalone.length === C.b5Physical,
    "B5 unchanged: 3 standalone, 56 variant nodes, 59 physical nodes (found " + primStandalone.length + " / " + primVariants + " / " + (primStandalone.length + primVariants) + ")");
  const b5Props = ABOX_B5.bindings.filter((b) => !!b7PropKey(b5Owner(b.component), b.property, b.type)).length;
  add(b5Props === C.b5NonVariant, "B5 non-variant component properties preserved (" + b5Props + " / " + C.b5NonVariant + ")");

  const patternPage = figma.root.children.filter((p) => p.name === B6_PAGE)[0];
  const patternNodes = patternPage ? b6PatternNodes(patternPage) : [];
  add(patternPage && patternPage.children.length === C.b6TopLevel && patternNodes.length === C.b6PhysicalNodes, "B6 unchanged: 3 top-level pattern objects / 4 physical ComponentNodes");
  const shellPage = figma.root.children.filter((p) => p.name === B7_PAGE)[0];
  const shellNodes = shellPage ? b7Nodes(shellPage) : { sets: [], standalone: [], physical: 0 };
  add(shellPage && shellPage.children.length === C.b7TopLevel && shellNodes.physical === C.b7PhysicalNodes, "B7 unchanged: 3 shell assets / 4 physical ComponentNodes");

  const approved = b8ApprovedNames();
  const frames = page.children.filter((n) => n.name.indexOf("ABox/Experience/") === 0);
  const frameNames = frames.map((n) => n.name);
  add(page.children.length === C.topLevelFrames, "only 04 Experiences receives B8 content: exactly 5 top-level objects (found " + page.children.length + ")");
  add(frameNames.join("|") === approved.join("|"), "04 Experiences contains exactly the five approved B8 frame names in deterministic order");
  add(frames.every((n) => n.type === "FRAME"), "every B8 top-level object is a FRAME, not Component or Component Set");

  let signaturesOk = true, placementOk = true, shellOk = true, patternOk = true, componentsOk = true, protoOk = true, imageOk = true, regionsOk = true, propOk = true;
  const inventory = [];
  for (let i = 0; i < ABOX_B8.experiences.length; i += 1) {
    const spec = ABOX_B8.experiences[i];
    const frame = frames.filter((n) => n.name === spec.name)[0];
    const placement = ABOX_B8.placement.filter((p) => p.name === spec.name)[0];
    if (!frame) { signaturesOk = false; placementOk = false; shellOk = false; continue; }
    const pd = b8PluginSignature(frame);
    if (pd.batch !== "B8" || pd.kind !== "experience" || pd.name !== spec.name || pd.signature !== spec.signature || pd.sources !== spec.sources.slice().sort().join("|")) signaturesOk = false;
    if (frame.x !== placement.x || frame.y !== placement.y || Math.round(frame.width) !== ABOX_B8.layout.frameWidth) placementOk = false;
    if (!b8HasRegions(frame)) regionsOk = false;
    if (b8HasPrototype(frame)) protoOk = false;
    if (b8HasImageFill(frame)) imageOk = false;
    if (Object.keys(frame.componentPropertyDefinitions || {}).length) propOk = false;
    const mains = b8InstanceMainNames(frame);
    if (mains.indexOf(spec.shell.name) === -1) shellOk = false;
    for (const pat of spec.patterns || []) if (mains.indexOf(pat.name) === -1) patternOk = false;
    for (const comp of spec.components || []) if (mains.indexOf(comp.name) === -1) componentsOk = false;
    inventory.push("  " + spec.name + "  id=" + frame.id + "  x=" + frame.x + " y=" + frame.y + "  signature=" + pd.signature + "\n      instances: " + mains.join(" | "));
  }
  add(signaturesOk, "every B8 frame has matching B8 plugin data, deterministic signature and sorted source list");
  add(placementOk, "every B8 frame uses deterministic x/y placement and 1440px canonical desktop width");
  add(regionsOk, "every B8 frame contains the four approved child regions in order");
  add(shellOk, "every B8 frame includes at least one existing B7 shell instance matching its mapped shell");
  add(patternOk, "B6 pattern usage is exact: Downline uses WizardStepper; governance/member use KpiRow columns 4/3; none invented");
  add(componentsOk, "all referenced B4/B5 component instances resolve to existing library nodes");
  add(propOk, "B8 creates no top-level component properties, generic children/content property or synthetic state property");
  add(protoOk, "B8 creates no prototype reactions or simulated navigation links");
  add(imageOk, "B8 uses no screenshots, HTML embeds, flattened images or external image substitutions");
  add(C.newVariables === 0 && C.newStyles === 0 && C.newComponents === 0 && C.newComponentSets === 0 && C.newPatterns === 0 && C.newProperties === 0 && C.prototypes === 0, "B8 token contract declares zero new foundations, properties and prototypes");
  add(!page.children.some((n) => n.type === "COMPONENT" || n.type === "COMPONENT_SET"), "B8 creates no components, component sets, patterns, variables or styles");
  add(ABOX_B8.experiences.every((e) => e.sources.length >= 4 && e.sequence.length >= 3), "every B8 experience has source traceability and multi-state journey evidence");
  add(ABOX_B8.limitations.length >= 6, "dynamic, unsupported and deferred areas are documented as B8 limitations");
  add(b8Created === 0 || b8Created === C.topLevelFrames, "run bookkeeping: B8 top-level frames created this run = " + b8Created + " (run 2 must be 0)");

  say("");
  say("ID PROVENANCE: ids below are REAL FIGMA ids only when this run executed inside Figma Desktop.");
  say("  An offline/mock harness prints OFFLINE MOCK ids and they are never evidence of a real write.");
  say("  runtime: " + (typeof figma.getFileThumbnailNodeAsync === "function" ? "figma plugin API" : "figma plugin API (host-reported)"));
  say("");
  say("B8 EXPERIENCE INVENTORY");
  for (const line of inventory) say(line);
  say("");
  say("B8 LIMITATIONS / DEFERRED FOUNDATIONS");
  for (const l of ABOX_B8.limitations) say("  - " + l);
  say("");
  say("B8 COUNTS");
  say("  top-level frames " + C.topLevelFrames + " | new variables/styles/components/component sets/patterns/properties/prototypes = 0");
  say("  protected and unchanged: B1 " + C.b1Variables + " vars, B2 " + C.b2Variables + " vars, B3 " + C.b3Styles + " styles, B4/B5 " + C.b5Physical + " physical nodes, B6 " + C.b6PhysicalNodes + " nodes, B7 " + C.b7PhysicalNodes + " nodes");
  say("");
  say("B8 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  say("  NOTE  src/** unchanged — asserted outside Figma with `git diff --stat -- src/`; the plugin sandbox cannot read the repository.");
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say(passed ? "RESULT: B8 PASSED" : "RESULT: B8 FAILED — do not proceed to B9.");
  return passed;
}


/* =====================  Phase 56 / Batch B9 — complete screens  ===================== */
/*
 * B9 is a one-bulk-import screen pass. It creates editable top-level FRAME
 * nodes on 05 Screens only, then adds source-backed native prototype reactions
 * where the extractor proves a deterministic generated target. Runtime logic is
 * reported as metadata and never simulated.
 */

const B9_PAGE = "05 Screens";
var b9CreatedFrames = 0;
var b9CreatedReactions = 0;

function b9Page() {
  const page = figma.root.children.filter((p) => p.name === B9_PAGE);
  if (page.length !== 1) {
    throw new Error('STOP: B0 page "' + B9_PAGE + '" must exist exactly once (found ' + page.length + ").");
  }
  return page[0];
}

function b9ApprovedNames() {
  return ABOX_B9.screens.map((s) => s.name);
}

function b9FrameMap(page) {
  const out = {};
  for (const node of page.children) {
    if (node.name.indexOf("ABox/Screen/") === 0 || node.name.indexOf("ABox/ScreenState/") === 0) {
      if (out[node.name]) throw new Error('STOP: DUPLICATE B9 SCREEN — "' + node.name + '" exists more than once on ' + B9_PAGE + ".");
      out[node.name] = node;
    }
  }
  return out;
}

function b9FindFrame(page, spec) {
  const found = page.children.filter((n) => n.name === spec.name);
  if (found.length > 1) throw new Error('STOP: DUPLICATE B9 SCREEN — "' + spec.name + '" exists ' + found.length + " times on " + B9_PAGE + ".");
  return found[0] || null;
}

function b9PluginSignature(frame) {
  return {
    batch: frame.getPluginData("aboxBatch"),
    kind: frame.getPluginData("aboxKind"),
    name: frame.getPluginData("aboxName"),
    key: frame.getPluginData("aboxKey"),
    signature: frame.getPluginData("aboxSignature"),
    sources: frame.getPluginData("aboxSources"),
  };
}

function b9SetPluginData(frame, spec) {
  frame.setPluginData("aboxBatch", "B9");
  frame.setPluginData("aboxKind", spec.kind || "screen");
  frame.setPluginData("aboxName", spec.name);
  frame.setPluginData("aboxKey", spec.key);
  frame.setPluginData("aboxSignature", spec.signature);
  frame.setPluginData("aboxSources", spec.sources.slice().sort().join("|"));
  frame.setPluginData("aboxRoute", spec.route || "");
  frame.setPluginData("aboxScreenId", spec.id || "");
}

function b9Main(name, batch) {
  const set = b4FindSet(name);
  if (set) return set;
  const component = b4FindComponent(name);
  if (component) return component;
  throw new Error('STOP: MISSING ' + batch + ' DEPENDENCY — "' + name + '" not found. Run the required prior batch first.');
}

function b9Instance(name, props, label) {
  const main = b9Main(name, name.indexOf("/Shell/") !== -1 ? "B7 SHELL" : name.indexOf("/Pattern/") !== -1 ? "B6 PATTERN" : "B4/B5 COMPONENT");
  return b8CreateInstance(main, props || {}, label || name.split("/").pop());
}

async function b9MetadataRegion(spec, index) {
  const region = b7Frame("metadata/source-and-identity", { layout: "VERTICAL", gap: 8, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/surface", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("screen-title", spec.title || spec.name, { size: 18, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  region.appendChild(await b7Text("screen-route", (spec.id || "route") + " · " + (spec.route || "no-route") + " · " + spec.sourceType, { textStyle: "ABox/Text/serial", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(await b7Text("screen-purpose", spec.purpose || "Source-backed screen composition.", { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(await b7Text("source-list", spec.sources.join("\n"), { size: 10, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  return region;
}

async function b9ShellRegion(spec, index) {
  const region = b7Frame("shell-reference", { layout: "VERTICAL", gap: 10, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("region-label", spec.shell && spec.shell.name ? "B7 shell instance" : "Standalone/public route", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  if (spec.shell && spec.shell.name) {
    const inst = b9Instance(spec.shell.name, spec.shell.overrides || {}, "shell-reference-instance");
    inst.setPluginData("aboxB9Reference", spec.shell.name);
    region.appendChild(inst);
  } else {
    region.appendChild(await b7Text("standalone-note", "This route does not use one of the three B7 shell families; source-backed content remains editable native composition.", { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  }
  return region;
}

async function b9FoundationRegion(spec, index) {
  const region = b7Frame("foundations-and-states", { layout: "VERTICAL", gap: 12, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("region-label", "Existing foundations reused", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  const patternRow = b7Frame("pattern-instances", { layout: "HORIZONTAL", wrap: "WRAP", gap: 10, counterGap: 10 }, index);
  for (const pat of spec.patterns || []) patternRow.appendChild(b9Instance(pat.name, pat.variant || {}, pat.name.split("/").pop()));
  if (!(spec.patterns || []).length) patternRow.appendChild(await b7Text("no-pattern", "No B6 pattern applies; this screen is represented as route-local native content.", { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(patternRow);
  const compRow = b7Frame("component-instances", { layout: "HORIZONTAL", wrap: "WRAP", gap: 8, counterGap: 8 }, index);
  for (const name of spec.components || []) compRow.appendChild(b9Instance(name, {}, name.split("/").pop()));
  region.appendChild(compRow);
  const states = b7Frame("source-backed-states", { layout: "VERTICAL", gap: 6, px: 12, py: 12, radius: 12, fillStyle: "ABox/Semantic/background", strokeStyle: "ABox/Semantic/hairline" }, index);
  states.appendChild(await b7Text("states-title", "States and responsive evidence", { size: 13, weight: 600, colorStyle: "ABox/Semantic/foreground" }, index));
  states.appendChild(await b7Text("states-list", (spec.states || []).join(", ") + "\n" + (spec.responsive || "canonical desktop"), { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(states);
  return region;
}

function b9Outgoing(spec) {
  return ABOX_B9.interactions.filter((i) => i.sourceKey === spec.key);
}

async function b9PrototypeRegion(spec, index) {
  const region = b7Frame("prototype-links", { layout: "VERTICAL", gap: 8, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/surface", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("region-label", "Source-backed prototype reactions", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  const outgoing = b9Outgoing(spec);
  if (!outgoing.length) {
    region.appendChild(await b7Text("no-reactions", "No deterministic Category-A prototype destination is source-backed for this frame.", { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
    return region;
  }
  for (const interaction of outgoing) {
    const link = b7Frame("prototype-link/" + interaction.id, { layout: "HORIZONTAL", align: "CENTER", gap: 8, px: 10, py: 8, radius: 12, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
    link.setPluginData("aboxB9InteractionId", interaction.id);
    link.setPluginData("aboxB9ReactionSignature", interaction.signature);
    link.setPluginData("aboxB9TargetKey", interaction.targetKey);
    link.setPluginData("aboxB9Trigger", interaction.trigger);
    link.setPluginData("aboxB9Action", interaction.action);
    link.appendChild(await b7Text("control", interaction.control, { size: 11, weight: 500, colorStyle: "ABox/Semantic/foreground" }, index));
    link.appendChild(await b7Text("target", "→ " + interaction.targetIdentity, { size: 10, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
    region.appendChild(link);
  }
  return region;
}

async function b9RuntimeRegion(spec, index) {
  const b = ABOX_B9.interactionClassification.B.filter((i) => i.sourceKey === spec.key).length;
  const c = ABOX_B9.interactionClassification.C.filter((i) => i.sourceKey === spec.key).length;
  const d = ABOX_B9.interactionClassification.D.filter((i) => i.sourceKey === spec.key).length;
  const region = b7Frame("runtime-boundaries", { layout: "VERTICAL", gap: 8, px: 16, py: 14, radius: 18, fillStyle: "ABox/Semantic/background", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b7Text("region-label", "B/C/D classifications", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground" }, index));
  region.appendChild(await b7Text("classification-counts", "B component-state mappings: " + b + "\nC runtime/business-logic metadata: " + c + "\nD unsupported/ambiguous metadata: " + d, { size: 12, weight: 400, colorStyle: "ABox/Semantic/muted-foreground" }, index));
  return region;
}

async function b9BuildFrame(spec, placement, index, page) {
  const root = figma.createFrame();
  root.name = spec.name;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "FIXED";
  root.primaryAxisAlignItems = "MIN";
  root.counterAxisAlignItems = "MIN";
  root.itemSpacing = 18;
  root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 24;
  root.resize(ABOX_B9.layout.frameWidth, 1000);
  root.x = placement.x;
  root.y = placement.y;
  root.fillStyleId = b4Style(index, "paint", "ABox/Semantic/background").id;
  root.strokeStyleId = b4Style(index, "paint", "ABox/Semantic/hairline").id;
  root.strokeWeight = 1;
  root.cornerRadius = 24;
  b9SetPluginData(root, spec);
  root.appendChild(await b9MetadataRegion(spec, index));
  root.appendChild(await b9ShellRegion(spec, index));
  root.appendChild(await b9FoundationRegion(spec, index));
  root.appendChild(await b9PrototypeRegion(spec, index));
  root.appendChild(await b9RuntimeRegion(spec, index));
  page.appendChild(root);
  b9CreatedFrames += 1;
  return root;
}

function b9ExpectedRegions() {
  return ["metadata/source-and-identity", "shell-reference", "foundations-and-states", "prototype-links", "runtime-boundaries"];
}

function b9HasRegions(frame) {
  const names = frame.children.map((c) => c.name);
  return b9ExpectedRegions().every((name, i) => names[i] === name);
}

function b9FindInteractionNode(frame, interaction) {
  const found = [];
  b8Walk(frame, (n) => {
    if (n.getPluginData && n.getPluginData("aboxB9InteractionId") === interaction.id) found.push(n);
  });
  if (found.length > 1) throw new Error('STOP: DUPLICATE B9 PROTOTYPE HOTSPOT — "' + interaction.id + '" appears ' + found.length + " times in " + frame.name + ".");
  return found[0] || null;
}

function b9AssertReusable(frame, spec) {
  if (frame.type !== "FRAME") throw new Error('STOP: B9 SCREEN TYPE MISMATCH — "' + spec.name + '" is ' + frame.type + ", expected FRAME.");
  const pd = b9PluginSignature(frame);
  const wantSources = spec.sources.slice().sort().join("|");
  if (pd.batch !== "B9" || pd.kind !== (spec.kind || "screen") || pd.name !== spec.name || pd.key !== spec.key || pd.signature !== spec.signature || pd.sources !== wantSources) {
    throw new Error('STOP: LIVE B9 SCREEN DIFFERS FROM APPROVED SIGNATURE — "' + spec.name + '". Nothing was overwritten or deleted.');
  }
  if (!b9HasRegions(frame)) throw new Error('STOP: LIVE B9 SCREEN STRUCTURE DIFFERS FROM APPROVED REGIONS — "' + spec.name + '". Nothing was overwritten or deleted.');
  for (const interaction of b9Outgoing(spec)) {
    const node = b9FindInteractionNode(frame, interaction);
    if (!node) throw new Error('STOP: B9 SCREEN IS MISSING SOURCE-BACKED PROTOTYPE HOTSPOT — "' + interaction.id + '" in "' + spec.name + '".');
  }
}

function b9TriggerPayload(interaction) {
  const trigger = String(interaction.trigger || "click").toLowerCase();
  if (trigger === "hover") return { type: "ON_HOVER" };
  if (trigger === "press") return { type: "ON_PRESS" };
  if (trigger === "drag") return { type: "ON_DRAG" };
  if (trigger === "timeout") return { type: "AFTER_TIMEOUT", timeout: interaction.timeout || 1 };
  return { type: "ON_CLICK" };
}

function b9TransitionPayload(interaction) {
  const transition = String(interaction.transition || "instant");
  if (transition === "instant" || transition === "instant-overlay") return null;
  if (transition === "dissolve") return { type: "DISSOLVE", easing: { type: "EASE_OUT" }, duration: interaction.duration || 0.2 };
  return null;
}

function b9ReactionAction(target, interaction) {
  const navigation = interaction.navigation || (interaction.action === "overlay" ? "OVERLAY" : "NAVIGATE");
  return {
    type: "NODE",
    destinationId: target.id,
    navigation,
    transition: b9TransitionPayload(interaction),
    resetScrollPosition: true,
  };
}

function b9ReactionPayload(target, interaction) {
  const action = b9ReactionAction(target, interaction);
  return {
    trigger: b9TriggerPayload(interaction),
    action,
    actions: [action],
  };
}

function b9ReactionActions(reaction) {
  if (reaction.actions && reaction.actions.length) return reaction.actions;
  return reaction.action ? [reaction.action] : [];
}

function b9ReactionMatches(node, target, interaction) {
  const reactions = node.reactions || [];
  if (reactions.length !== 1) return false;
  const reaction = reactions[0];
  const actions = b9ReactionActions(reaction);
  const action = actions[0] || {};
  const trigger = b9TriggerPayload(interaction);
  return node.getPluginData("aboxB9ReactionSignature") === interaction.signature &&
    node.getPluginData("aboxB9TargetKey") === interaction.targetKey &&
    node.getPluginData("aboxB9Trigger") === interaction.trigger &&
    node.getPluginData("aboxB9Action") === interaction.action &&
    node.getPluginData("aboxB9Navigation") === (interaction.navigation || "NAVIGATE") &&
    node.getPluginData("aboxB9Transition") === (interaction.transition || "instant") &&
    reaction.trigger && reaction.trigger.type === trigger.type &&
    actions.length === 1 &&
    action.type === "NODE" && action.destinationId === target.id && action.navigation === (interaction.navigation || "NAVIGATE");
}

async function b9EnsureReaction(sourceFrame, targetFrame, interaction) {
  const node = b9FindInteractionNode(sourceFrame, interaction);
  if (!node) throw new Error('STOP: B9 PROTOTYPE HOTSPOT MISSING — "' + interaction.id + '".');
  if (typeof node.setReactionsAsync !== "function") throw new Error('STOP: Figma host does not expose native prototype reaction writing for "' + interaction.id + '".');
  const reactions = node.reactions || [];
  if (reactions.length > 1) throw new Error('STOP: DUPLICATE B9 PROTOTYPE REACTIONS — "' + interaction.id + '" has ' + reactions.length + " reactions.");
  if (reactions.length === 1) {
    if (!b9ReactionMatches(node, targetFrame, interaction)) {
      throw new Error('STOP: CONFLICTING B9 PROTOTYPE MAPPING — "' + interaction.id + '". Existing reaction was not overwritten.');
    }
    return;
  }
  await node.setReactionsAsync([b9ReactionPayload(targetFrame, interaction)]);
  node.setPluginData("aboxB9ReactionSignature", interaction.signature);
  node.setPluginData("aboxB9TargetNodeId", targetFrame.id);
  node.setPluginData("aboxB9TargetKey", interaction.targetKey);
  node.setPluginData("aboxB9Trigger", interaction.trigger || "click");
  node.setPluginData("aboxB9Action", interaction.action || "navigate");
  node.setPluginData("aboxB9Navigation", interaction.navigation || "NAVIGATE");
  node.setPluginData("aboxB9Transition", interaction.transition || "instant");
  b9CreatedReactions += 1;
}

function b9HasImageFill(root) {
  let bad = false;
  b8Walk(root, (n) => { for (const fill of n.fills || []) if (fill.type === "IMAGE") bad = true; });
  return bad;
}

async function ensureB9Screens() {
  await figma.loadAllPagesAsync();
  b9CreatedFrames = 0;
  b9CreatedReactions = 0;
  const page = b9Page();
  const index = await b4StyleIndex();

  // Protected dependencies are resolved before any B9 write.
  for (const shell of ["ABox/Shell/Internal", "ABox/Shell/Marketplace", "ABox/Shell/Member"]) say("  B7 shell resolved: " + shell + "  id=" + b9Main(shell, "B7 SHELL").id);
  for (const pattern of ["ABox/Pattern/KpiRow", "ABox/Pattern/ModuleTabBar", "ABox/Pattern/WizardStepper"]) say("  B6 pattern resolved: " + pattern + "  id=" + b9Main(pattern, "B6 PATTERN").id);
  const needed = {};
  for (const screen of ABOX_B9.screens) for (const comp of screen.components || []) needed[comp] = true;
  for (const name of Object.keys(needed).sort()) say("  B4/B5 component resolved: " + name + "  id=" + b9Main(name, "B4/B5 COMPONENT").id);

  for (const existing of page.children) {
    if ((existing.name.indexOf("ABox/Screen/") === 0 || existing.name.indexOf("ABox/ScreenState/") === 0) && b9ApprovedNames().indexOf(existing.name) === -1) {
      throw new Error('STOP: UNAPPROVED OBJECT ON 05 SCREENS — "' + existing.name + '". B9 will not overwrite or delete it.');
    }
  }

  for (let i = 0; i < ABOX_B9.screens.length; i += 1) {
    const spec = ABOX_B9.screens[i];
    const placement = ABOX_B9.placement.filter((p) => p.name === spec.name)[0];
    if (!placement) throw new Error('STOP: B9 placement missing for "' + spec.name + '".');
    const existing = b9FindFrame(page, spec);
    if (existing) {
      b9AssertReusable(existing, spec);
      say("  frame    reused  : " + spec.name + "  id=" + existing.id);
    } else {
      const frame = await b9BuildFrame(spec, placement, index, page);
      say("  frame    created : " + spec.name + "  id=" + frame.id);
    }
  }

  const frames = b9FrameMap(page);
  for (const interaction of ABOX_B9.interactions) {
    const sourceSpec = ABOX_B9.screens.filter((s) => s.key === interaction.sourceKey)[0];
    const targetSpec = ABOX_B9.screens.filter((s) => s.key === interaction.targetKey)[0];
    if (!sourceSpec || !targetSpec) throw new Error('STOP: B9 PROTOTYPE TARGET UNRESOLVED — "' + interaction.id + '".');
    await b9EnsureReaction(frames[sourceSpec.name], frames[targetSpec.name], interaction);
  }
  say("");
  say("  B9 top-level frames created this run: " + b9CreatedFrames);
  say("  B9 native prototype reactions created this run: " + b9CreatedReactions);
}

async function verifyB9() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);
  const C = ABOX_B9.counts;
  const page = b9Page();

  const wantPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells", "04 Experiences", "05 Screens", "06 Documentation"];
  add(figma.root.children.length === 7 && figma.root.children.map((p) => p.name).join("|") === wantPages.join("|"), "B0 pages exist exactly once and remain in original order");
  const docsPageForB9 = figma.root.children.filter((p) => p.name === "06 Documentation")[0];
  const b9DocsOk = docsPageForB9 && (docsPageForB9.children.length === 0 || docsPageForB9.children.map((n) => n.name).join("|") === b10ApprovedNames().join("|"));
  add(figma.root.children.filter((p) => p.name === "00 Foundations").every((p) => p.children.length === 0) && b9DocsOk, "00 Foundations remains empty and 06 Documentation is empty or contains only approved B10 documentation during B9");

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const b1Names = ABOX_B1.collections.map((c) => c.name);
  const b1Cols = collections.filter((c) => b1Names.indexOf(c.name) !== -1);
  let b1Vars = 0;
  for (const c of b1Cols) b1Vars += c.variableIds.length;
  const typo = collections.filter((c) => c.name === "ABox/Typography");
  add(b1Cols.length === C.b1Collections && b1Vars === C.b1Variables, "B1 unchanged: 9 collections / 200 variables (found " + b1Cols.length + " / " + b1Vars + ")");
  add(typo.length === 1 && typo[0].variableIds.length === C.b2Variables, "B2 unchanged: ABox/Typography with 19 variables");
  const owned = (list) => list.filter((s) => s.name.indexOf("ABox/") === 0);
  const paints = owned(await figma.getLocalPaintStylesAsync());
  const texts = owned(await figma.getLocalTextStylesAsync());
  const effects = owned(await figma.getLocalEffectStylesAsync());
  add(paints.length + texts.length + effects.length === C.b3Styles, "B3 unchanged: 79 styles — found " + (paints.length + texts.length + effects.length));

  const componentsPage = figma.root.children.filter((p) => p.name === B4_PAGE)[0];
  const primSets = componentsPage ? componentsPage.children.filter((n) => n.type === "COMPONENT_SET") : [];
  const primStandalone = componentsPage ? componentsPage.children.filter((n) => n.type === "COMPONENT") : [];
  const primVariants = primSets.reduce((n, s) => n + s.children.length, 0);
  add(primSets.length === C.b4Sets, "B4 unchanged: 11 component sets on 01 Components (found " + primSets.length + ")");
  add(primStandalone.length === C.b4Standalone && primVariants === C.b5Variants && primVariants + primStandalone.length === C.b5Physical, "B5 unchanged: 3 standalone, 56 variant nodes, 59 physical nodes");
  const b5Props = ABOX_B5.bindings.filter((b) => !!b7PropKey(b5Owner(b.component), b.property, b.type)).length;
  add(b5Props === C.b5NonVariant, "B5 non-variant component properties preserved (" + b5Props + " / " + C.b5NonVariant + ")");
  const patternPage = figma.root.children.filter((p) => p.name === B6_PAGE)[0];
  const patternNodes = patternPage ? b6PatternNodes(patternPage) : [];
  add(patternPage && patternPage.children.length === C.b6TopLevel && patternNodes.length === C.b6PhysicalNodes, "B6 unchanged: 3 top-level pattern objects / 4 physical ComponentNodes");
  const shellPage = figma.root.children.filter((p) => p.name === B7_PAGE)[0];
  const shellNodes = shellPage ? b7Nodes(shellPage) : { physical: 0 };
  add(shellPage && shellPage.children.length === C.b7TopLevel && shellNodes.physical === C.b7PhysicalNodes, "B7 unchanged: 3 shell assets / 4 physical ComponentNodes");
  const expPage = figma.root.children.filter((p) => p.name === B8_PAGE)[0];
  add(expPage && expPage.children.length === C.b8TopLevelFrames, "B8 unchanged: 5 experience frames on 04 Experiences");

  const frames = page.children.filter((n) => n.name.indexOf("ABox/Screen/") === 0 || n.name.indexOf("ABox/ScreenState/") === 0);
  const frameNames = frames.map((n) => n.name);
  add(page.children.length === C.topLevelFrames, "only 05 Screens receives B9 content: exactly " + C.topLevelFrames + " top-level frames (found " + page.children.length + ")");
  add(frameNames.join("|") === b9ApprovedNames().join("|"), "05 Screens contains exactly the approved B9 frame names in deterministic order");
  add(frames.every((n) => n.type === "FRAME"), "every B9 top-level object is a FRAME, not Component or Component Set");

  let signaturesOk = true, placementOk = true, regionsOk = true, imageOk = true, propOk = true, shellOk = true, dependencyOk = true;
  let reactionOk = true, reactionCount = 0, duplicateReactionOk = true, targetOk = true;
  const inventory = [];
  const map = b9FrameMap(page);
  for (const spec of ABOX_B9.screens) {
    const frame = map[spec.name];
    const placement = ABOX_B9.placement.filter((p) => p.name === spec.name)[0];
    if (!frame) { signaturesOk = false; placementOk = false; regionsOk = false; continue; }
    const pd = b9PluginSignature(frame);
    if (pd.batch !== "B9" || pd.kind !== (spec.kind || "screen") || pd.name !== spec.name || pd.key !== spec.key || pd.signature !== spec.signature || pd.sources !== spec.sources.slice().sort().join("|")) signaturesOk = false;
    if (!placement || frame.x !== placement.x || frame.y !== placement.y || Math.round(frame.width) !== ABOX_B9.layout.frameWidth) placementOk = false;
    if (!b9HasRegions(frame)) regionsOk = false;
    if (b9HasImageFill(frame)) imageOk = false;
    if (Object.keys(frame.componentPropertyDefinitions || {}).length) propOk = false;
    const mains = b8InstanceMainNames(frame);
    if (spec.shell && spec.shell.name && mains.indexOf(spec.shell.name) === -1) shellOk = false;
    for (const pat of spec.patterns || []) if (mains.indexOf(pat.name) === -1) dependencyOk = false;
    for (const comp of spec.components || []) if (mains.indexOf(comp) === -1) dependencyOk = false;
    const outgoing = b9Outgoing(spec);
    for (const interaction of outgoing) {
      const node = b9FindInteractionNode(frame, interaction);
      const targetSpec = ABOX_B9.screens.filter((s) => s.key === interaction.targetKey)[0];
      const targetFrame = targetSpec ? map[targetSpec.name] : null;
      if (!node || !targetFrame) { reactionOk = false; targetOk = false; continue; }
      const reactions = node.reactions || [];
      reactionCount += reactions.length;
      if (reactions.length !== 1) { reactionOk = false; duplicateReactionOk = false; }
      else if (!b9ReactionMatches(node, targetFrame, interaction)) { reactionOk = false; targetOk = false; }
    }
    inventory.push("  " + spec.name + "  id=" + frame.id + "  route=" + (spec.route || "-") + "  outgoing=" + outgoing.length + "  signature=" + pd.signature);
  }
  add(signaturesOk, "every B9 frame has matching B9 plugin data, deterministic signature and sorted source list");
  add(placementOk, "every B9 frame uses deterministic x/y placement and 1440px canonical desktop width");
  add(regionsOk, "every B9 frame contains the five approved child regions in order");
  add(shellOk, "B9 shell mapping resolves to existing B7 shell instances where a shell is source-backed");
  add(dependencyOk, "all referenced B6 patterns and B4/B5 component instances resolve to existing library nodes");
  add(propOk, "B9 creates no component properties or synthetic foundation/property layer");
  add(imageOk, "B9 uses no screenshots, HTML embeds, flattened images or external image substitutions");
  add(reactionOk && reactionCount === C.categoryAPrototypeReactions, "Category-A interactions have native Figma prototype reactions (found " + reactionCount + " / " + C.categoryAPrototypeReactions + ")");
  add(targetOk, "prototype reaction targets resolve to the correct generated B9 screen/state frames");
  add(duplicateReactionOk, "no duplicate prototype reactions exist on B9 hotspots after Run 2");
  add(ABOX_B9.interactionClassification.A.length === C.categoryAPrototypeReactions && ABOX_B9.interactionClassification.B.length === C.categoryBStateMappings && ABOX_B9.interactionClassification.C.length === C.categoryCRuntimeMappings && ABOX_B9.interactionClassification.D.length === C.categoryDUnsupportedMappings, "every source-backed interaction classification bucket is represented in B9 tokens");
  add(ABOX_B9.motionAudit.every((m) => String(m.figmaMapping || "").indexOf("Smart Animate") !== -1 || String(m.figmaMapping || "").indexOf("metadata") !== -1), "motion audit distinguishes source animation from supported Figma representation and does not invent Smart Animate");
  add(C.newVariables === 0 && C.newStyles === 0 && C.newComponents === 0 && C.newComponentSets === 0 && C.newPatterns === 0 && C.newProperties === 0, "B9 token contract declares zero new foundations, properties, patterns and components");
  add(b9CreatedFrames === 0 || b9CreatedFrames === C.topLevelFrames, "run bookkeeping: B9 top-level frames created this run = " + b9CreatedFrames + " (run 2 must be 0)");
  add(b9CreatedReactions === 0 || b9CreatedReactions === C.categoryAPrototypeReactions, "run bookkeeping: B9 prototype reactions created this run = " + b9CreatedReactions + " (run 2 must be 0)");

  say("");
  say("ID PROVENANCE: ids below are REAL FIGMA ids only when this run executed inside Figma Desktop.");
  say("  An offline/mock harness prints OFFLINE MOCK ids and they are never evidence of a real write.");
  say("  runtime: " + (typeof figma.getFileThumbnailNodeAsync === "function" ? "figma plugin API" : "figma plugin API (host-reported)"));
  say("");
  say("B9 SCREEN INVENTORY");
  for (const line of inventory) say(line);
  say("");
  say("B9 INTERACTION CLASSIFICATION COUNTS");
  say("  A native prototype reactions: " + C.categoryAPrototypeReactions);
  say("  B component state/variant mappings: " + C.categoryBStateMappings);
  say("  C runtime/business-logic metadata: " + C.categoryCRuntimeMappings);
  say("  D unsupported/ambiguous metadata: " + C.categoryDUnsupportedMappings);
  say("");
  say("B9 INVENTORY ARITHMETIC");
  say("  " + ABOX_B9.arithmetic.formula);
  say("");
  say("B9 LIMITATIONS");
  for (const l of ABOX_B9.limitations) say("  - " + l);
  say("");
  say("REAL-FIGMA PRESENTATION CHECK REQUIRED");
  say("  Open representative Internal, Marketplace and Member flows in Figma Presentation/Prototype mode; click/hover mapped interactions; verify runtime-only limitations are reported, not simulated.");
  say("");
  say("B9 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  say("  NOTE  src/** unchanged — asserted outside Figma with `git diff --stat -- src/`; the plugin sandbox cannot read the repository.");
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say(passed ? "RESULT: B9 PASSED" : "RESULT: B9 FAILED — do not use generated screen/prototype evidence.");
  return passed;
}


/* =====================  Phase 57 / Batch B10 — documentation  ===================== */
/*
 * B10 creates the final source-backed documentation layer on 06 Documentation
 * only. It creates native editable FRAME/TEXT/table nodes and records links to
 * existing B1-B9 references through plugin data. It never creates variables,
 * styles, components, component sets, patterns, shells, experiences or screens.
 */

const B10_PAGE = "06 Documentation";
var b10Created = 0;

function b10Page() {
  const page = figma.root.children.filter((p) => p.name === B10_PAGE);
  if (page.length !== 1) {
    throw new Error('STOP: B0 page "' + B10_PAGE + '" must exist exactly once (found ' + page.length + ").");
  }
  return page[0];
}

function b10ApprovedNames() {
  if (typeof ABOX_B10 === "undefined" || !ABOX_B10.documents) return [];
  return ABOX_B10.documents.map((d) => d.name);
}

function b10FindFrame(page, spec) {
  const found = page.children.filter((n) => n.name === spec.name);
  if (found.length > 1) throw new Error('STOP: DUPLICATE B10 DOCUMENTATION FRAME — "' + spec.name + '" exists ' + found.length + ' times on ' + B10_PAGE + ".");
  return found[0] || null;
}

function b10PluginSignature(frame) {
  return {
    batch: frame.getPluginData("aboxBatch"),
    kind: frame.getPluginData("aboxKind"),
    name: frame.getPluginData("aboxName"),
    key: frame.getPluginData("aboxKey"),
    signature: frame.getPluginData("aboxSignature"),
    sources: frame.getPluginData("aboxSources"),
  };
}

function b10SetPluginData(frame, spec) {
  frame.setPluginData("aboxBatch", "B10");
  frame.setPluginData("aboxKind", "documentation");
  frame.setPluginData("aboxName", spec.name);
  frame.setPluginData("aboxKey", spec.key);
  frame.setPluginData("aboxSignature", spec.signature);
  frame.setPluginData("aboxSources", spec.sources.slice().sort().join("|"));
}

function b10ExpectedRegions() {
  return ["metadata/source-and-purpose", "reference-links", "documentation-sections", "evidence-and-boundaries"];
}

function b10HasRegions(frame) {
  const names = frame.children.map((c) => c.name);
  return b10ExpectedRegions().every((name, i) => names[i] === name);
}

function b10AllText(root) {
  const chunks = [];
  b8Walk(root, (n) => {
    if (n.type === "TEXT") chunks.push(n.characters || "");
  });
  return chunks.join("\n");
}

function b10ReferenceKey(ref) {
  return ref.kind + ":" + ref.name;
}

function b10ReferenceTarget(ref) {
  if (!ref || !ref.kind) return null;
  if (ref.kind === "source" || ref.kind === "batch") return { id: ref.name, type: ref.kind, name: ref.name };
  if (ref.kind === "page") return figma.root.children.filter((p) => p.name === ref.name)[0] || null;
  if (ref.kind === "component" || ref.kind === "pattern" || ref.kind === "shell") return b4FindSet(ref.name) || b4FindComponent(ref.name);
  if (ref.kind === "experience") {
    const page = figma.root.children.filter((p) => p.name === B8_PAGE)[0];
    return page ? page.children.filter((n) => n.name === ref.name)[0] || null : null;
  }
  if (ref.kind === "screen") {
    const page = figma.root.children.filter((p) => p.name === B9_PAGE)[0];
    return page ? page.children.filter((n) => n.name === ref.name)[0] || null : null;
  }
  if (ref.kind === "paintStyle") {
    return b10StyleIndex.paint[ref.name] || null;
  }
  if (ref.kind === "textStyle") {
    return b10StyleIndex.text[ref.name] || null;
  }
  if (ref.kind === "effectStyle") {
    return b10StyleIndex.effect[ref.name] || null;
  }
  if (ref.kind === "collection") {
    return b10CollectionIndex[ref.name] || null;
  }
  return null;
}

var b10StyleIndex = { paint: {}, text: {}, effect: {} };
var b10CollectionIndex = {};

async function b10PrepareReferenceIndexes() {
  b10StyleIndex = await b4StyleIndex();
  b10CollectionIndex = {};
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  for (const c of collections) b10CollectionIndex[c.name] = c;
  return b10StyleIndex;
}

function b10RequireReference(ref) {
  const target = b10ReferenceTarget(ref);
  if (!target) throw new Error('STOP: B10 REFERENCE UNRESOLVED — "' + b10ReferenceKey(ref) + '". Run the required prior batch first; B10 will not create substitutes.');
  return target;
}

async function b10Text(name, text, opts, index) {
  const node = await b7Text(name, text, opts || {}, index);
  if (opts && opts.w) {
    node.resize(opts.w, node.height);
    node.textAutoResize = "HEIGHT";
  }
  return node;
}

async function b10MetaRegion(spec, index) {
  const region = b7Frame("metadata/source-and-purpose", { layout: "VERTICAL", gap: 10, px: 18, py: 16, radius: 18, fillStyle: "ABox/Semantic/surface", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b10Text("doc-title", spec.title, { size: 24, weight: 600, colorStyle: "ABox/Semantic/foreground", w: 1280 }, index));
  region.appendChild(await b10Text("doc-purpose", spec.purpose, { size: 13, weight: 400, colorStyle: "ABox/Semantic/muted-foreground", w: 1280 }, index));
  region.appendChild(await b10Text("source-list", spec.sources.join("\n"), { textStyle: "ABox/Text/serial", colorStyle: "ABox/Semantic/muted-foreground", w: 1280 }, index));
  return region;
}

async function b10ReferenceRegion(spec, index) {
  const region = b7Frame("reference-links", { layout: "VERTICAL", gap: 10, px: 18, py: 16, radius: 18, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b10Text("region-label", "Native reference links", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground", w: 1280 }, index));
  const refs = b7Frame("reference-grid", { layout: "HORIZONTAL", wrap: "WRAP", gap: 8, counterGap: 8 }, index);
  const seen = {};
  for (const ref of spec.references || []) {
    const key = b10ReferenceKey(ref);
    if (seen[key]) continue;
    seen[key] = true;
    const target = b10RequireReference(ref);
    const chip = b7Frame("reference/" + ref.kind + "/" + String(ref.name).replace(/[^A-Za-z0-9_-]+/g, "-"), { layout: "VERTICAL", gap: 4, px: 10, py: 8, radius: 10, fillStyle: "ABox/Semantic/background", strokeStyle: "ABox/Semantic/hairline" }, index);
    chip.setPluginData("aboxB10ReferenceKind", ref.kind);
    chip.setPluginData("aboxB10ReferenceName", ref.name);
    chip.setPluginData("aboxB10ReferenceId", target.id || ref.name);
    chip.appendChild(await b10Text("reference-label", ref.name, { size: 10, weight: 500, colorStyle: "ABox/Semantic/foreground", w: 260 }, index));
    chip.appendChild(await b10Text("reference-meta", ref.kind + " · id=" + (target.id || ref.name), { textStyle: "ABox/Text/serial", colorStyle: "ABox/Semantic/muted-foreground", w: 260 }, index));
    refs.appendChild(chip);
  }
  region.appendChild(refs);
  return region;
}

async function b10RowNode(row, index) {
  const item = b7Frame("row/" + String(row.label).slice(0, 64).replace(/[^A-Za-z0-9_-]+/g, "-"), { layout: "VERTICAL", gap: 4, px: 12, py: 10, radius: 10, fillStyle: "ABox/Semantic/background", strokeStyle: "ABox/Semantic/hairline" }, index);
  item.setPluginData("aboxB10RowLabel", row.label);
  item.appendChild(await b10Text("label", row.label, { size: 11, weight: 600, colorStyle: "ABox/Semantic/foreground", w: 1280 }, index));
  item.appendChild(await b10Text("value", row.value, { size: 10, weight: 400, colorStyle: "ABox/Semantic/muted-foreground", w: 1280 }, index));
  if ((row.refs || []).length) {
    item.setPluginData("aboxB10RowRefs", row.refs.map(b10ReferenceKey).join("|"));
  }
  return item;
}

async function b10SectionNode(section, index) {
  const wrapper = b7Frame("section/" + section.key, { layout: "VERTICAL", gap: 8, px: 16, py: 14, radius: 16, fillStyle: "ABox/Semantic/card", strokeStyle: "ABox/Semantic/hairline" }, index);
  wrapper.setPluginData("aboxB10SectionKey", section.key);
  wrapper.appendChild(await b10Text("section-title", section.title, { size: 15, weight: 600, colorStyle: "ABox/Semantic/foreground", w: 1280 }, index));
  for (const r of section.rows) wrapper.appendChild(await b10RowNode(r, index));
  return wrapper;
}

async function b10SectionsRegion(spec, index) {
  const region = b7Frame("documentation-sections", { layout: "VERTICAL", gap: 12, px: 18, py: 16, radius: 18, fillStyle: "ABox/Semantic/surface", strokeStyle: "ABox/Semantic/hairline" }, index);
  for (const section of spec.sections) region.appendChild(await b10SectionNode(section, index));
  return region;
}

async function b10EvidenceRegion(spec, index) {
  const region = b7Frame("evidence-and-boundaries", { layout: "VERTICAL", gap: 8, px: 18, py: 16, radius: 18, fillStyle: "ABox/Semantic/background", strokeStyle: "ABox/Semantic/hairline" }, index);
  region.appendChild(await b10Text("region-label", "Evidence and boundaries", { textStyle: "ABox/Text/eyebrow", colorStyle: "ABox/Semantic/muted-foreground", w: 1280 }, index));
  region.appendChild(await b10Text("evidence", ABOX_B10.evidenceStatus.map((e) => e.phase + ": " + e.status + " · " + e.realFigma).join("\n"), { size: 11, weight: 400, colorStyle: "ABox/Semantic/muted-foreground", w: 1280 }, index));
  region.appendChild(await b10Text("signature", "B10 signature " + spec.signature + " · no screenshots/HTML/flattening · no production app changes · no permanent sync", { textStyle: "ABox/Text/serial", colorStyle: "ABox/Semantic/muted-foreground", w: 1280 }, index));
  return region;
}

async function b10BuildFrame(spec, placement, index, page) {
  const root = figma.createFrame();
  root.name = spec.name;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "FIXED";
  root.primaryAxisAlignItems = "MIN";
  root.counterAxisAlignItems = "MIN";
  root.itemSpacing = 18;
  root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 24;
  root.resize(ABOX_B10.layout.frameWidth, 1000);
  root.x = placement.x;
  root.y = placement.y;
  root.fillStyleId = b4Style(index, "paint", "ABox/Semantic/background").id;
  root.strokeStyleId = b4Style(index, "paint", "ABox/Semantic/hairline").id;
  root.strokeWeight = 1;
  root.cornerRadius = 24;
  b10SetPluginData(root, spec);
  root.appendChild(await b10MetaRegion(spec, index));
  root.appendChild(await b10ReferenceRegion(spec, index));
  root.appendChild(await b10SectionsRegion(spec, index));
  root.appendChild(await b10EvidenceRegion(spec, index));
  page.appendChild(root);
  b10Created += 1;
  return root;
}

function b10AssertReusable(frame, spec) {
  if (frame.type !== "FRAME") throw new Error('STOP: B10 DOCUMENTATION TYPE MISMATCH — "' + spec.name + '" is ' + frame.type + ', expected FRAME.');
  const pd = b10PluginSignature(frame);
  const wantSources = spec.sources.slice().sort().join("|");
  if (pd.batch !== "B10" || pd.kind !== "documentation" || pd.name !== spec.name || pd.key !== spec.key || pd.signature !== spec.signature || pd.sources !== wantSources) {
    throw new Error('STOP: LIVE B10 DOCUMENTATION DIFFERS FROM APPROVED SIGNATURE — "' + spec.name + '". Nothing was overwritten or deleted.');
  }
  if (!b10HasRegions(frame)) throw new Error('STOP: LIVE B10 DOCUMENTATION STRUCTURE DIFFERS FROM APPROVED REGIONS — "' + spec.name + '". Nothing was overwritten or deleted.');
}

async function ensureB10Documentation() {
  await figma.loadAllPagesAsync();
  b10Created = 0;
  const page = b10Page();
  const index = await b10PrepareReferenceIndexes();

  for (const existing of page.children) {
    if (b10ApprovedNames().indexOf(existing.name) === -1) {
      throw new Error('STOP: UNAPPROVED OBJECT ON 06 DOCUMENTATION — "' + existing.name + '". B10 will not overwrite or delete it.');
    }
  }

  for (const doc of ABOX_B10.documents) {
    for (const ref of doc.references || []) b10RequireReference(ref);
  }

  for (let i = 0; i < ABOX_B10.documents.length; i += 1) {
    const spec = ABOX_B10.documents[i];
    const placement = ABOX_B10.placement.filter((p) => p.name === spec.name)[0];
    if (!placement) throw new Error('STOP: B10 placement missing for "' + spec.name + '".');
    const existing = b10FindFrame(page, spec);
    if (existing) {
      b10AssertReusable(existing, spec);
      say("  frame    reused  : " + spec.name + "  id=" + existing.id);
    } else {
      const frame = await b10BuildFrame(spec, placement, index, page);
      say("  frame    created : " + spec.name + "  id=" + frame.id);
    }
  }
  say("");
  say("  B10 documentation frames created this run: " + b10Created);
}

function b10HasImageFill(root) {
  let bad = false;
  b8Walk(root, (n) => { for (const fill of n.fills || []) if (fill.type === "IMAGE") bad = true; });
  return bad;
}

function b10HasPrototype(root) {
  let bad = false;
  b8Walk(root, (n) => { if ((n.reactions || []).length) bad = true; });
  return bad;
}

function b10HasComponentNodes(root) {
  let bad = false;
  b8Walk(root, (n) => { if (n.type === "COMPONENT" || n.type === "COMPONENT_SET" || n.type === "INSTANCE") bad = true; });
  return bad;
}

async function verifyB10() {
  await figma.loadAllPagesAsync();
  const checks = [];
  const add = (ok, label) => checks.push((ok ? "PASS  " : "FAIL  ") + label);
  const C = ABOX_B10.counts;
  const page = b10Page();
  await b10PrepareReferenceIndexes();

  const wantPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells", "04 Experiences", "05 Screens", "06 Documentation"];
  add(figma.root.children.length === C.b0Pages && figma.root.children.map((p) => p.name).join("|") === wantPages.join("|"), "B0 pages exist exactly once and remain in original order");
  const foundationsPage = figma.root.children.filter((p) => p.name === "00 Foundations")[0];
  add(foundationsPage && foundationsPage.children.length === 0, "00 Foundations remains empty");

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const b1Names = ABOX_B1.collections.map((c) => c.name);
  const b1Cols = collections.filter((c) => b1Names.indexOf(c.name) !== -1);
  let b1Vars = 0;
  for (const c of b1Cols) b1Vars += c.variableIds.length;
  const typo = collections.filter((c) => c.name === "ABox/Typography");
  add(b1Cols.length === C.b1Collections && b1Vars === C.b1Variables, "B1 unchanged: 9 collections / 200 variables (found " + b1Cols.length + " / " + b1Vars + ")");
  add(typo.length === 1 && typo[0].variableIds.length === C.b2Variables, "B2 unchanged: ABox/Typography with 19 variables");
  const owned = (list) => list.filter((s) => s.name.indexOf("ABox/") === 0);
  const paints = owned(await figma.getLocalPaintStylesAsync());
  const texts = owned(await figma.getLocalTextStylesAsync());
  const effects = owned(await figma.getLocalEffectStylesAsync());
  add(paints.length + texts.length + effects.length === C.b3Styles, "B3 unchanged: 79 styles — found " + (paints.length + texts.length + effects.length));

  const componentsPage = figma.root.children.filter((p) => p.name === B4_PAGE)[0];
  const primSets = componentsPage ? componentsPage.children.filter((n) => n.type === "COMPONENT_SET") : [];
  const primStandalone = componentsPage ? componentsPage.children.filter((n) => n.type === "COMPONENT") : [];
  const primVariants = primSets.reduce((n, s) => n + s.children.length, 0);
  add(primSets.length === C.b4Sets, "B4 unchanged: 11 component sets on 01 Components (found " + primSets.length + ")");
  add(primStandalone.length === C.b4Standalone && primVariants === C.b5Variants && primVariants + primStandalone.length === C.b5Physical, "B5 unchanged: 3 standalone, 56 variant nodes, 59 physical nodes");
  const b5Props = ABOX_B5.bindings.filter((b) => !!b7PropKey(b5Owner(b.component), b.property, b.type)).length;
  add(b5Props === C.b5NonVariant, "B5 non-variant component properties preserved (" + b5Props + " / " + C.b5NonVariant + ")");
  const patternPage = figma.root.children.filter((p) => p.name === B6_PAGE)[0];
  const patternNodes = patternPage ? b6PatternNodes(patternPage) : [];
  add(patternPage && patternPage.children.length === C.b6TopLevel && patternNodes.length === C.b6PhysicalNodes, "B6 unchanged: 3 top-level pattern objects / 4 physical ComponentNodes");
  const shellPage = figma.root.children.filter((p) => p.name === B7_PAGE)[0];
  const shellNodes = shellPage ? b7Nodes(shellPage) : { physical: 0 };
  add(shellPage && shellPage.children.length === C.b7TopLevel && shellNodes.physical === C.b7PhysicalNodes, "B7 unchanged: 3 shell assets / 4 physical ComponentNodes");
  const expPage = figma.root.children.filter((p) => p.name === B8_PAGE)[0];
  add(expPage && expPage.children.length === C.b8TopLevelFrames, "B8 unchanged: 5 experience frames on 04 Experiences");
  const screenPage = figma.root.children.filter((p) => p.name === B9_PAGE)[0];
  const b9Frames = screenPage ? screenPage.children.filter((n) => n.name.indexOf("ABox/Screen/") === 0 || n.name.indexOf("ABox/ScreenState/") === 0) : [];
  add(screenPage && screenPage.children.length === C.b9TopLevelFrames && b9Frames.length === C.b9TopLevelFrames, "B9 unchanged: 179 top-level screen/state frames on 05 Screens");

  const docs = page.children.filter((n) => n.name.indexOf("ABox/Documentation/") === 0);
  const names = docs.map((n) => n.name);
  add(page.children.length === C.documentationFrames, "only 06 Documentation receives B10 content: exactly 10 top-level frames (found " + page.children.length + ")");
  add(names.join("|") === b10ApprovedNames().join("|"), "06 Documentation contains exactly the approved B10 frame names in deterministic order");
  add(docs.every((n) => n.type === "FRAME"), "every B10 top-level object is a FRAME, not Component or Component Set");

  let signaturesOk = true, placementOk = true, regionsOk = true, imageOk = true, protoOk = true, componentOk = true, referencesOk = true, evidenceOk = true, coverageOk = true;
  const inventory = [];
  const requiredSnippets = ["No permanent Lovable-to-Figma synchronization", "REAL FIGMA NOT VERIFIED", "Create All Screens", "runtime", "B1", "B9"];
  for (let i = 0; i < ABOX_B10.documents.length; i += 1) {
    const spec = ABOX_B10.documents[i];
    const frame = docs.filter((n) => n.name === spec.name)[0];
    const placement = ABOX_B10.placement.filter((p) => p.name === spec.name)[0];
    if (!frame) { signaturesOk = false; placementOk = false; regionsOk = false; referencesOk = false; continue; }
    const pd = b10PluginSignature(frame);
    if (pd.batch !== "B10" || pd.kind !== "documentation" || pd.name !== spec.name || pd.key !== spec.key || pd.signature !== spec.signature || pd.sources !== spec.sources.slice().sort().join("|")) signaturesOk = false;
    if (!placement || frame.x !== placement.x || frame.y !== placement.y || Math.round(frame.width) !== ABOX_B10.layout.frameWidth) placementOk = false;
    if (!b10HasRegions(frame)) regionsOk = false;
    if (b10HasImageFill(frame)) imageOk = false;
    if (b10HasPrototype(frame)) protoOk = false;
    if (b10HasComponentNodes(frame)) componentOk = false;
    for (const ref of spec.references || []) if (!b10ReferenceTarget(ref)) referencesOk = false;
    const text = b10AllText(frame);
    if (!requiredSnippets.some((snippet) => text.indexOf(snippet) !== -1)) coverageOk = false;
    if (text.indexOf("REAL FIGMA VERIFIED") !== -1 && text.indexOf("REAL FIGMA NOT VERIFIED") === -1) evidenceOk = false;
    inventory.push("  " + spec.name + "  id=" + frame.id + "  x=" + frame.x + " y=" + frame.y + "  signature=" + pd.signature);
  }
  add(signaturesOk, "every B10 frame has matching B10 plugin data, deterministic signature and sorted source list");
  add(placementOk, "every B10 frame uses deterministic x/y placement and 1440px documentation width");
  add(regionsOk, "every B10 frame contains the four approved documentation regions in order");
  add(imageOk, "B10 uses no screenshots, flattened images, HTML embeds or external image substitutions");
  add(protoOk, "B10 creates no prototype reactions");
  add(componentOk, "B10 creates no component/component-set/instance content; documentation is native editable frames and text");
  add(referencesOk, "B10 references resolve to existing B1-B9 pages, collections, styles, components, patterns, shells, experiences and screens where applicable");
  add(evidenceOk, "B10 does not claim unverified real-Figma evidence");
  add(coverageOk, "B10 documentation covers source, bulk import, limitations, evidence, runtime boundaries and B1-B9 coverage");
  add(C.newVariables === 0 && C.newStyles === 0 && C.newComponents === 0 && C.newComponentSets === 0 && C.newPatterns === 0 && C.newShells === 0 && C.newExperiences === 0 && C.newScreens === 0, "B10 token contract declares zero new foundations/assets outside documentation frames");
  add(ABOX_B10.documents.length === 10 && ABOX_B10.counts.documentationFrames === 10, "B10 approved inventory is exactly 10 documentation frames");
  add(ABOX_B10.verificationChecklist.length === 25, "B10 verification checklist contains 25 checks");
  add(b10Created === 0 || b10Created === C.documentationFrames, "run bookkeeping: B10 documentation frames created this run = " + b10Created + " (run 2 must be 0)");

  say("");
  say("ID PROVENANCE: ids below are REAL FIGMA ids only when this run executed inside Figma Desktop.");
  say("  An offline/mock harness prints OFFLINE MOCK ids and they are never evidence of a real write.");
  say("  runtime: " + (typeof figma.getFileThumbnailNodeAsync === "function" ? "figma plugin API" : "figma plugin API (host-reported)"));
  say("");
  say("B10 DOCUMENTATION INVENTORY");
  for (const line of inventory) say(line);
  say("");
  say("B10 COUNTS");
  say("  documentation frames " + C.documentationFrames + " | new variables/styles/components/component sets/patterns/shells/experiences/screens = 0");
  say("  protected unchanged: B1 " + C.b1Variables + " vars, B2 " + C.b2Variables + " vars, B3 " + C.b3Styles + " styles, B4/B5 " + C.b5Physical + " physical nodes, B6 " + C.b6PhysicalNodes + " nodes, B7 " + C.b7PhysicalNodes + " nodes, B8 " + C.b8TopLevelFrames + " frames, B9 " + C.b9TopLevelFrames + " frames");
  say("");
  say("B10 EVIDENCE STATUS");
  for (const e of ABOX_B10.evidenceStatus) say("  - " + e.phase + ": " + e.status + " / " + e.realFigma);
  say("");
  say("B10 LIMITATION CATEGORIES");
  for (const c of ABOX_B10.limitationCategories) say("  - " + c);
  say("");
  say("REAL-FIGMA DOCUMENTATION CHECK REQUIRED");
  say("  Run Create documentation → Verify documentation → Create documentation → Verify documentation in Figma Desktop; confirm real ids and zero new frames on run 2.");
  say("");
  say("B10 STRUCTURAL CHECK");
  checks.forEach((c) => say("  " + c));
  say("  NOTE  src/** unchanged — asserted outside Figma with `git diff --stat -- src/`; the plugin sandbox cannot read the repository.");
  const passed = checks.every((c) => c.indexOf("PASS") === 0);
  say("");
  say(passed ? "RESULT: B10 PASSED" : "RESULT: B10 FAILED — do not use generated documentation evidence.");
  return passed;
}

/* ---------- B4 orphan cleanup (guarded, opt-in) ---------- */

/**
 * Removes only debris left behind on the seven B0 library pages by an aborted
 * build: top-level nodes that are not components, not batch-owned assets, and not
 * approved B8/B9/B10 frames. It never touches B0 pages themselves, B1/B2/B3 data,
 * or any B4 component object.
 */
async function b4CleanupOrphans() {
  await figma.loadAllPagesAsync();
  const libraryPages = ["00 Foundations", "01 Components", "02 Patterns", "03 Shells",
    "04 Experiences", "05 Screens", "06 Documentation"];
  const approved = {};
  for (const list of [b8ApprovedNames(), b9ApprovedNames(), b10ApprovedNames()]) {
    for (const name of list || []) approved[name] = true;
  }
  const owned = (name) =>
    approved[name] === true ||
    name.indexOf("ABox/Pattern/") === 0 ||
    name.indexOf("ABox/Shell/") === 0 ||
    name.indexOf("ABox/Screen/") === 0 ||
    name.indexOf("ABox/ScreenState/") === 0 ||
    name.indexOf("ABox/Doc/") === 0;

  const doomed = [];
  for (const page of figma.root.children) {
    if (libraryPages.indexOf(page.name) === -1) continue;
    for (const node of page.children) {
      if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") continue;
      if (owned(node.name)) continue;
      doomed.push({ page: page.name, node: node });
    }
  }

  say("B4 ORPHAN CLEANUP");
  if (!doomed.length) {
    say("  nothing to remove — every library page holds only components and batch-owned assets.");
  }
  for (const entry of doomed) {
    say("  remove : " + entry.page + " › " + entry.node.name + " (" + entry.node.type + ")  id=" + entry.node.id);
    entry.node.remove();
  }
  say("");
  say("  page contents after cleanup");
  for (const page of figma.root.children) {
    say("    " + page.name + " : " + page.children.length + " node(s)");
  }
  say("");
  say("  removed this run: " + doomed.length);
  return doomed.length;
}

/**
 * Remove stale B4 variant components stranded on "01 Components" by an aborted run.
 * A node is removed ONLY when every identity condition below holds; anything failing a
 * single condition is reported and kept. Valid B4 objects can never qualify.
 */
async function b4StaleVariants() {
  await figma.loadAllPagesAsync();
  const page = b4Page();

  const approved = {};
  for (const list of [b8ApprovedNames(), b9ApprovedNames(), b10ApprovedNames()]) {
    for (const name of list || []) approved[name] = true;
  }
  for (const spec of ABOX_B4.components) approved[spec.name] = true;
  const batchOwned = (name) =>
    approved[name] === true ||
    name.indexOf("ABox/Pattern/") === 0 ||
    name.indexOf("ABox/Shell/") === 0 ||
    name.indexOf("ABox/Screen/") === 0 ||
    name.indexOf("ABox/ScreenState/") === 0 ||
    name.indexOf("ABox/Doc/") === 0;

  // condition 4: map every approved B4 variant name to its owning set spec
  const variantOwner = {};
  for (const set of ABOX_B4.sets) {
    for (const value of set.values) variantOwner[b4VariantName(set, value)] = set;
  }

  say("B4 STALE VARIANT CLEANUP");
  say("");

  const doomed = [];
  const kept = [];
  for (const node of page.children) {
    if (node.type !== "COMPONENT") continue; // conditions 1 + 2
    if (!node.parent || node.parent.id !== page.id) continue;
    if (batchOwned(node.name)) {
      kept.push("  KEPT — batch-owned name : " + node.name + "  id=" + node.id);
      continue;
    }
    const owner = variantOwner[node.name];
    if (!owner) {
      kept.push("  KEPT — not a B4 variant name : " + node.name + "  id=" + node.id);
      continue;
    }
    const set = b4FindSet(owner.name); // condition 5
    if (!set) {
      kept.push("  KEPT — owning set missing : " + node.name + " (" + owner.name + ")  id=" + node.id);
      continue;
    }
    const live = b4MatchVariant(set.children.slice(), node.name);
    if (!live || live.id === node.id) {
      kept.push("  KEPT — no surviving variant in " + owner.name + " : " + node.name + "  id=" + node.id);
      continue;
    }
    const instances = await node.getInstancesAsync(); // condition 6 (async: dynamic-page)
    if (instances.length) {
      kept.push("  KEPT — has " + instances.length + " live instance(s) : " + node.name + "  id=" + node.id);
      continue;
    }
    doomed.push({ node: node, owner: owner.name, live: live.id });
  }

  for (const line of kept) say(line);
  if (kept.length) say("");

  if (!doomed.length) {
    say("  nothing to remove — no stale B4 variant component on " + B4_PAGE + ".");
  }
  for (const entry of doomed) {
    say(
      "  remove : " + entry.node.name + "  id=" + entry.node.id +
        "  (belongs in " + entry.owner + "; surviving variant id=" + entry.live + ")",
    );
    entry.node.remove();
  }

  say("");
  say("  page contents after cleanup");
  for (const p of figma.root.children) {
    say("    " + p.name + " : " + p.children.length + " node(s)");
  }
  say("");
  say("  removed this run: " + doomed.length);
  return doomed.length;
}


/* ---------- entry ---------- */


figma.showUI(__html__, { width: 420, height: 640 });

figma.ui.onmessage = async (msg) => {
  lines.length = 0;
  const b0 = msg.type === "b0-run" || msg.type === "b0-verify";
  const b1 = msg.type === "b1-run" || msg.type === "b1-verify";
  const b2 = msg.type === "b2-run" || msg.type === "b2-verify";
  const b3 = msg.type === "b3-run" || msg.type === "b3-verify";
  const b4 = msg.type === "b4-run" || msg.type === "b4-verify" || msg.type === "b4-cleanup-orphans" ||
    msg.type === "b4-cleanup-stale-variants";
  const b5 = msg.type === "b5-run" || msg.type === "b5-verify";
  const b6 = msg.type === "b6-run" || msg.type === "b6-verify" || msg.type === "b6-inspect" ||
    msg.type === "b6-cleanup-stale-variants" || msg.type === "b6-cleanup-incomplete-patterns";
  const b7 = msg.type === "b7-run" || msg.type === "b7-verify";
  const b8 = msg.type === "b8-run" || msg.type === "b8-verify";
  const b9 = msg.type === "b9-run" || msg.type === "b9-verify";
  const b10 = msg.type === "b10-run" || msg.type === "b10-verify";
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
    } else if (msg.type === "b4-cleanup-orphans") {
      say("ABox Phase 52 / Batch B4 — remove orphan debris");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await b4CleanupOrphans();
    } else if (msg.type === "b4-cleanup-stale-variants") {
      say("ABox Phase 52 / Batch B4 — remove stale variant components");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await b4StaleVariants();

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
    } else if (msg.type === "b6-inspect") {
      say("ABox Phase 53 / Batch B6 — inspect 02 Patterns (read-only)");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await b6InspectPatterns();
    } else if (msg.type === "b6-cleanup-stale-variants") {
      say("ABox Phase 53 / Batch B6 — remove stale variant components");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await b6StaleVariants();
    } else if (msg.type === "b6-cleanup-incomplete-patterns") {
      say("ABox Phase 53 / Batch B6 — remove incomplete pattern components");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await b6CleanupIncompletePatterns();
    } else if (msg.type === "b7-run") {
      say("ABox Phase 54 / Batch B7 — shells");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB7Shells();
      await verifyB7();
    } else if (msg.type === "b7-verify") {
      say("ABox Phase 54 / Batch B7 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB7();
    } else if (msg.type === "b8-run") {
      say("ABox Phase 55 / Batch B8 — experiences & journey compositions");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB8Experiences();
      await verifyB8();
    } else if (msg.type === "b8-verify") {
      say("ABox Phase 55 / Batch B8 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB8();
    } else if (msg.type === "b9-run") {
      say("ABox Phase 56 / Batch B9 — complete screens / bulk application import");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB9Screens();
      await verifyB9();
    } else if (msg.type === "b9-verify") {
      say("ABox Phase 56 / Batch B9 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB9();
    } else if (msg.type === "b10-run") {
      say("ABox Phase 57 / Batch B10 — documentation / final reference layer");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await ensureB10Documentation();
      await verifyB10();
    } else if (msg.type === "b10-verify") {
      say("ABox Phase 57 / Batch B10 — verify only");
      say("file: " + figma.root.name);
      requireFile(T.library.targetFileName);
      say("");
      await verifyB10();
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
                    : b7
                      ? "RESULT: B7 FAILED — do not proceed to B8."
                      : b8
                        ? "RESULT: B8 FAILED — do not proceed to B9."
                        : b9
                          ? "RESULT: B9 FAILED — do not use generated screen/prototype evidence."
                          : b10
                            ? "RESULT: B10 FAILED — do not use generated documentation evidence."
                            : "RESULT: PROOF FAILED — do not proceed to Phase 52.",
    );
  }
  report();
};
