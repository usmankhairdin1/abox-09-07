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
- Font **Inter Tight** (Regular and Semi Bold) available to Figma. The plugin stops
  rather than substituting a font.

## Install and run

1. Download this folder (`manifest.json`, `code.js`, `ui.html`) to your machine.
2. Figma Desktop → Plugins → Development → Import plugin from manifest → pick `manifest.json`.
3. Open the scratch file, run **ABox Figma Proof**, click **Run proof**.
4. Read the structural report in the plugin panel. It ends with
   `RESULT: PROOF PASSED` or `RESULT: PROOF FAILED`.

Re-running rebuilds in place; it does not create duplicates. **Verify only**
re-checks without creating anything.

## Library publishing check

In the scratch file, open the Assets panel and look for the publish/library control.
If it is unavailable, publishing is not permitted on that team. This does not fail
the proof — it is recorded as a constraint for later.

## Read-back

Independent of the plugin's own report, you can confirm the objects by changing the
`tone` variant, editing the label text and renaming the variable directly in Figma.

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
