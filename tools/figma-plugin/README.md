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

Recorded limitations: oklch is stored as sRGB (source notation in variable descriptions);
color-mix() badge tints stay runtime-computed; composite shadows become Effect Styles later.
