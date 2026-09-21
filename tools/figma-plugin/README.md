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

## Phase 52 / Batch B3 — foundational styles

`tokens-b3.js` is GENERATED by `node tools/figma-plugin/extract-b3.mjs` (run from the project
root) from `src/styles.css`, `status-badge.tsx`, `metal-badge.tsx` and the existing B1/B2 token
files. Never edit it by hand. Rebuild with `node build.mjs`.

In Figma Desktop, inside `ABox Design System — Library`: click **Create foundational styles**,
then **Verify foundational styles**, then run creation a second time — it must report
`RESULT: B3 PASSED` with zero created and identical ids.

79 styles, each a single mode-independent wrapper bound to the mode-aware B1 variable — there
are no Light/Dark style duplicates and no hard-coded fills.

| Category | Names | Count |
| --- | --- | --- |
| Colour | `ABox/Semantic/<role>` for all 54 production roles | 54 |
| Colour | `ABox/Status/<tone>` (sage, primary, warning, muted, destructive, info) | 6 |
| Colour | `ABox/Metal/<tier>` and `<tier>-fg` | 12 |
| Text | `ABox/Text/eyebrow`, `ABox/Text/serial` | 2 |
| Effect | `ABox/Elevation/{card,elevated,drawer,plate,glow}` | 5 |

The 62 primitives get no styles: production consumes them only as alias targets. Effect layers
bind `offsetX`, `offsetY`, `radius`, `spread` and `color` to the existing `ABox/Elevation`
variables, so no number is duplicated.

Only `text-eyebrow` and `text-serial` become Text Styles: `base`, `heading` and `display`
declare no font size in production (sizes come from per-usage Tailwind utilities), so a faithful
Text Style cannot exist for them. `text-serial` declares no weight either, so the CSS-inherited
`normal` (400) is used and stated in the description.

Recorded rather than approximated: `color-mix()` badge tints, `oklch()` conversion,
`font-variation-settings`, `font-feature-settings`, `font-variant-numeric`, the eyebrow/serial
`color` (a colour style already carries it), the `plan-o-assistant` inline shadow composition,
the unused `--shadow-overlay` alias, decorative utilities, motion and breakpoints. No grid
styles — production declares no grid definition. B3 creates no components and publishes nothing.

## Phase 52 / Batch B4 — component foundation

`tokens-b4.js` is GENERATED by `node tools/figma-plugin/extract-b4.mjs` (run from the project
root) from the production component sources — `action-pill.ts`, `status-badge.tsx`,
`metal-badge.tsx`, `surface.tsx`, `control.tsx`, `kpi-card.tsx`, `page-header.tsx`,
`module-tabs.tsx`, `downline-wizard-stepper.tsx`, `logo.tsx`, `empty-state.tsx`, `field.tsx`,
`ui/button.tsx`, `ui/input.tsx` — plus a call-site scan of every non-reference route and
component. Never edit it by hand. Rebuild with `node build.mjs`.

In Figma Desktop, inside `ABox Design System — Library`: click **Create components**, then
**Verify components**, then run creation a second time — it must report `RESULT: B4 PASSED`
with zero created and identical ids.

14 objects: 11 Component Sets + 3 standalone Components, 52 variants (38 fixed + 14 enumerated
from real production call sites).

| Object | Kind | Variant axis | Source |
| --- | --- | --- | --- |
| `ABox/Action/ActionPill` | Set | `action` × 10 keys | `abox/action-pill.ts` |
| `ABox/Action/Button` | Set | `variant` × `size`, enumerated | `ui/button.tsx` |
| `ABox/Status/StatusBadge` | Set | `tone` × 6 | `abox/status-badge.tsx` |
| `ABox/Status/MetalBadge` | Set | `tier` × 6 | `abox/metal-badge.tsx` |
| `ABox/Surface/Surface` | Set | enumerated prop combinations | `abox/surface.tsx` |
| `ABox/Control/Control` | Set | enumerated `height`/`focusRing` | `abox/control.tsx` |
| `ABox/Card/KpiCard` | Set | `tone` × 4 | `abox/kpi-card.tsx` |
| `ABox/Header/PageHeader` | Set | default, compact | `abox/page-header.tsx` |
| `ABox/Nav/ModuleTab` | Set | default, active | `abox/module-tabs.tsx` |
| `ABox/Nav/WizardStep` | Set | current, done, upcoming, unreachable | `abox/downline-wizard-stepper.tsx` |
| `ABox/Brand/AboxMark` | Set | `tone` × 4 | `abox/logo.tsx` |
| `ABox/Feedback/EmptyState` | Component | — | `abox/empty-state.tsx` |
| `ABox/Form/LabeledField` | Component | — | `abox/field.tsx` |
| `ABox/Form/Input` | Component | — | `ui/input.tsx` |

Colours and elevation reach components only through the B3 styles (which already bind the B1
variables); `ABox/Text/eyebrow` and `ABox/Text/serial` are used where production declares those
roles. Tailwind numeric utilities stay literal because production does not declare them through
the B1 spacing/radius/control-sizing variables — nothing is bound by value equality.

Figma requires component nodes to live on a page, so the 14 objects are placed on the existing
B0 page `01 Components`. The other six pages stay empty. No variant is invented: hover, focus,
pressed and transition rules are recorded as limitations, never as variants.
