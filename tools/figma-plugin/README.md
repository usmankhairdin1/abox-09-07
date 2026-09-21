# ABox Figma Proof plugin (Phase 52A)

Standalone development plugin used to prove that genuine, native Figma objects can
be created from ABox production sources. It is **not** part of the ABox application:
nothing here is imported by `src/`, routed, bundled or shipped.

## What it creates

In whichever file you run it in — use a dedicated scratch file:

1. Variable collection `ABox/Color/Semantic`, mode `Light`, colour variable `background/base`.
2. Text style `ABox/Body/Base`.
3. Component set `ABox/StatusBadge` with Auto Layout, an ellipse dot and an editable text label.
4. Variant property `tone` with two real tones (`sage`, `primary`).

All values are transcribed from `src/styles.css` and
`src/components/abox/status-badge.tsx` into `tokens.js`. Nothing is redesigned.

## Prerequisites

- Figma **Desktop** app (development plugins do not run in the browser).
- A Figma account with **Can edit** on the target team/file.
- A new, empty Figma Design file named `ABox Proof — Scratch`, used for nothing else.
  Verify edit access first by creating and deleting a rectangle.
- Font **Inter Tight** available to Figma at native weights 400 and 600. The plugin
  discovers Figma's exact named styles (including `SemiBold` or `Semi Bold`) or a
  native `wght` variation axis. It stops rather than guessing or substituting.

## Install and run

1. Download this folder (`manifest.json`, `code.js`, `ui.html`) to your machine.
2. Figma Desktop → Plugins → Development → Import plugin from manifest → pick `manifest.json`.
3. Open the scratch file, run **ABox Figma Proof**, click **Run proof**.
4. Read the structural report in the plugin panel. It ends with
   `RESULT: PROOF PASSED` or `RESULT: PROOF FAILED`.

Font discovery runs before any proof object is created. The report lists the exact
Inter Tight styles and variable axes Figma exposes, then records the native 400 and
600 representations selected. If weight 600 cannot be proven, creation stops.

Re-running rebuilds in place; it does not create duplicates. **Verify only**
re-checks without creating anything.

## Two files, two batches

The plugin enforces which file each action may run in:

| Action | Required file |
| --- | --- |
| Run proof / Verify only (Phase 52A) | `ABox Proof — Scratch` |
| Create library pages / Verify library pages (Batch B0) | `ABox Design System — Library` |

Running an action in the wrong file stops immediately with `STOP: wrong target file`
and changes nothing, so the proof objects can never be touched by B0 and vice versa.

## Batch B0 — library foundation pages

Create a new, empty Figma Design file named exactly `ABox Design System — Library`
(same team as the scratch file, with Can edit). Open it, run the plugin and click
**Create library pages**. It creates exactly these pages, in this order:

```
00 Foundations
01 Components
02 Patterns
03 Shells
04 Experiences
05 Screens
06 Documentation
```

Pages are matched by exact name, so re-running reuses and reorders the same pages
instead of duplicating them; page ids are printed on every run for comparison. An
empty leftover default page is removed; a non-empty stray page is reported and the
run fails. Duplicate names stop the run rather than being guessed at.

B0 creates no variables, text styles, effect styles, components or variants, and
never publishes the library. The report ends with `RESULT: B0 PASSED` or
`RESULT: B0 FAILED`.

Note: the manifest uses `"documentAccess": "dynamic-page"`, so the plugin loads all
pages with `figma.loadAllPagesAsync()` before reading any page's children (both in
page creation and in verification). Re-import the plugin from `manifest.json` after
pulling plugin changes so Figma Desktop picks up the rebuilt `code.js`.

## Library publishing check

In the scratch file, open the Assets panel and look for the publish/library control.
If it is unavailable, publishing is not permitted on that team. This does not fail
the proof — it is recorded as a constraint for later.

## Read-back

Independent of the plugin's own report, you can confirm the objects by changing the
`tone` variant, editing the label text and renaming the variable directly in Figma.
The structural report also reads the font back from the text style and both variant
labels; the labels must resolve to Inter Tight weight 600.

## Editing

Edit `tokens.js` (data) or `plugin.js` (logic), then run:

```
node tools/figma-plugin/build.mjs
```

which regenerates `code.js`. Never edit `code.js` directly.

## Known Figma limitations (recorded, never a reason to change production)

- Figma has no oklch colour space — values are converted to sRGB.
- `color-mix(in oklch, …)` is resolved numerically at build time.
- Variable font axes, the decorative CSS utilities and keyframe motion have no
  Figma equivalent.

## Phase 52 / Batch B1 — foundation variables

`tokens-b1.js` is GENERATED from `src/styles.css` by `node tools/figma-plugin/extract-b1.mjs`
(run from the project root). Never edit it by hand. Rebuild with `node build.mjs`.

In Figma Desktop, inside `ABox Design System — Library`: click **Create library pages**
(B0, already done), then **Create foundation variables** (B1). Run a second time — it must
report `RESULT: B1 PASSED` with zero created and identical ids. **Verify foundation variables**
runs the checks alone. B1 creates no text styles, effect styles, components or page content,
never publishes, and imports no runtime branding.

### Inventory (9 collections, 200 variables, every collection Light + Dark, no Default mode)

| Collection | Variables |
| --- | --- |
| `ABox/Color/Primitive` | 62 — one per production role path declared with an `oklch()` literal in `:root`/`.dark` (includes `ink` and the 12 metal tokens). A Light/Dark literal difference is two mode values on ONE variable. |
| `ABox/Color/Semantic` | 54 — every `--color-*` role in the two `@theme inline` blocks. `ink` is NOT here: production declares no `--color-ink`. |
| `ABox/Status` | 18 — 6 StatusBadge tones (`sage`, `primary`, `warning`, `muted`, `destructive`, `info`) + 12 metal variables. |
| `ABox/Spacing` | 4 · `ABox/Radius` 9 · `ABox/Border` 2 · `ABox/Layout` 2 · `ABox/Control sizing` 4 |
| `ABox/Elevation` | 45 — 9 shadow layers across `card`, `elevated`, `drawer`, `plate`, `glow`, each with `x`, `y`, `blur`, `spread` (FLOAT) and `tint` (COLOR). |

Aliasing is **source-mapping authoritative**: a semantic variable aliases a primitive only
because production declares `--color-X: var(--Y)`, resolved independently for Light and Dark.
Equal colour values never imply an alias. Tones alias semantics per the `tones` record in
`status-badge.tsx`; metal variables alias primitives per `metal-badge.tsx`.

Tone and metal names follow **production**, not the generic tone list in the batch brief:
production declares `warning`/`muted`/`destructive`/`info` (not `amber`/`neutral`/`red`/`sky`)
and the metal tiers `bronze`, `expanded-bronze`, `silver`, `gold`, `platinum`, `catastrophic`
(not `iron`/`lead`). Counts still match exactly: 6 tones and 12 metal variables.

Recorded limitations: oklch is stored as sRGB (source notation in variable descriptions);
`color-mix()` StatusBadge tints stay runtime-computed and get no static variable; composite
shadows become Effect Styles later; decorative utilities, motion keyframes and responsive
breakpoints are not variables.

## Phase 52 / Batch B2 — typography foundation

`tokens-b2.js` is GENERATED from `src/styles.css` by `node tools/figma-plugin/extract-b2.mjs`
(run from the project root). Never edit it by hand. Rebuild with `node build.mjs`.

In Figma Desktop, inside `ABox Design System — Library`: click **Create typography variables**,
then run a second time — it must report `RESULT: B2 PASSED` with zero created and identical ids.
**Verify typography variables** runs the checks alone.

One collection, `ABox/Typography`, modes `Light` and `Dark` only (no `Default`). Production
declares no `.dark` typography override, so both modes intentionally carry identical values.

| Group | Type | Count |
| --- | --- | --- |
| `family/sans`, `family/display`, `family/serif`, `family/mono` | STRING | 4 |
| `role/{base,heading,display,eyebrow,serial}/family` (alias) | STRING | 5 |
| `role/heading/{weight,letter-spacing}` | FLOAT | 2 |
| `role/display/{weight,letter-spacing,line-height}` | FLOAT | 3 |
| `role/eyebrow/{size,weight,letter-spacing}` | FLOAT | 3 |
| `role/serial/{size,letter-spacing}` | FLOAT | 2 |

STRING 9 + FLOAT 10 = 19 variables. `--font-serif` and `--font-display` hold identical stacks,
as do `--font-mono` and `--font-sans`; they stay four distinct variables because production
declares four roles and value equality is never alias evidence. A role family aliases a family
variable only because production writes `font-family: var(--font-X)` in that rule.

Conversions: `rem` → px at the 16px root; `em` letter-spacing → Figma percentage
(`-0.028em` → `-2.8`); line-height stays the unitless production number. Every variable
description carries its `src/styles.css:<line>` source declaration.

Not represented as variables, recorded verbatim instead: `font-variation-settings`
(`wdth`/`opsz` axes), `font-feature-settings`, `font-variant-numeric`, `text-transform`,
and the eyebrow/serial `color` (already a B1 semantic variable). Font stacks are stored whole
even though Figma has no fallback concept. JetBrains Mono is loaded in the document head but
referenced by no token, so it gets no variable. Tailwind's built-in size/leading/tracking
utilities are library-owned defaults and are not imported. B2 creates no text styles.
