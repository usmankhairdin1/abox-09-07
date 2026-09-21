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

`documentAccess: dynamic-page` also forbids the synchronous style-id setters. Node style
bindings must be written with `setFillStyleIdAsync`, `setStrokeStyleIdAsync`,
`setEffectStyleIdAsync` and `setTextStyleIdAsync` (awaited); otherwise Figma throws
`in set_fillStyleId: Cannot call with documentAccess: dynamic-page`. Reading
`fillStyleId` / `strokeStyleId` / `effectStyleId` in the verifiers remains valid and is
unchanged. `b4Build` and `b5KpiVariants` use the async setters. The same synchronous
pattern still exists in the B6-B10 builders (`b6ApplyRoot`, `b7Frame`, `b7Text`,
`b7Build*`, `b8BuildFrame`, `b9BuildFrame`, `b10BuildFrame`) and must be converted in
those batches before they are run.

B5 writes characters onto TEXT nodes B4 already created, so it calls `b5LoadTextFonts`
first: the node's own `fontName` (or every range font when it is mixed) is loaded with
`figma.loadFontAsync` and awaited before the write, and an unloadable font stops the run
rather than being substituted. If a negative variant clone fails mid-mutation, the clone
is removed again so a partial run leaves no duplicate variant behind.

B4 component and variant wrappers are Figma packaging, not production surfaces:
`b4EnsureSet` and `b4EnsureComponent` clear the wrapper's `fills` and `strokes` (the
component-set container already did this), and `b4Build` clears the SVG importer's
group chrome on `ABox/Brand/AboxMark`. The painted mark vectors are bound by painted
shape identity in document order — not by direct child index — and an unbound vector
STOPs the run. Without this, `figma.createComponent()`'s default opaque white fill made
the verifier's "no hard-coded foundation fill or stroke" check report 60 raw paints.

`verifyB4` prints `B4 RAW FILL EVIDENCE` (offending node, type, id, fill/stroke) and
`B4 PAGE EVIDENCE` (every unexpected page child, plus extras or missing objects on
`01 Components`) whenever those checks fail. The assertions themselves are unchanged:
the 14 B4 objects must live on `01 Components` with nothing else there, and pages 00,
03, 04, 05 and 06 must stay empty (`02 Patterns` is B6-owned).

The `Remove B4 orphan debris` button (`b4-cleanup-orphans`) exists for debris left on a
library page by an aborted build — `createFrame` / `createText` / `createNodeFromSvg`
append to the current page before being reparented. It removes only top-level nodes on
the seven B0 pages that are not `COMPONENT` / `COMPONENT_SET` and not batch-owned
(`ABox/Pattern/`, `ABox/Shell/`, `ABox/Screen/`, `ABox/ScreenState/`, `ABox/Doc/`, and
the approved B8/B9/B10 frame names). It prints every removal and the resulting per-page
counts, and never touches B0 pages, B1/B2/B3 data, or any B4 component. `ensureB4Components`
additionally removes its own transient nodes when a build step throws.

A component stranded outside its set is a separate case: `b4EnsureSet` parents each new
variant to `01 Components` before `combineAsVariants` absorbs it, so a run that aborts
mid-loop leaves a top-level `COMPONENT` named like a variant (e.g. `variant=primaryXs`).
The orphan cleanup deliberately refuses to touch components, and reconciliation never
consults stray top-level nodes, so the next successful run builds a fresh variant inside
the set and the verifier reports a 15th object.

`Remove stale B4 variant components` (`b4-cleanup-stale-variants`, `b4StaleVariants()`)
handles exactly that. It removes a node only when all six identity conditions hold:
(1) it sits directly on `01 Components`; (2) it is a `COMPONENT`, never a
`COMPONENT_SET`; (3) its name is not an approved standalone B4 component name and not
batch-owned; (4) its name equals an approved B4 variant name, so it belongs inside a
set; (5) that set exists and already holds a different live variant of the same name —
the valid replacement is proven present; (6) `getInstancesAsync()` returns zero
instances. A node failing any single condition is printed under `KEPT — …` and left
alone, so no valid B4 object, and nothing from B0/B1/B2/B3 or B5+, can qualify. The
builder now also throws `STOP: STALE TOP-LEVEL VARIANT` instead of quietly creating a
duplicate when such a node is present, and the verifier still demands exactly the 14 B4
objects on `01 Components`.

B6 has the same stranding shape: `b6BuildNode` parents each variant to `02 Patterns`
before `combineAsVariants` absorbs it, so an aborted pattern run can leave a top-level
`COMPONENT` named like a matrix (e.g. `columns=4`). Three plugin controls cover it.
`Inspect 02 Patterns (read-only)` (`b6-inspect`, `b6InspectPatterns()`) prints, for every
page child, its type, id, parent, component property definitions, variant properties,
child names, live instance count, whether the name is an approved B6 top-level object, an
approved matrix that must live inside a set, or neither, and for a matrix the expected vs
live signature. It writes, modifies and deletes nothing.
`Remove stale B6 variant components` (`b6-cleanup-stale-variants`, `b6StaleVariants()`)
removes a node only when it sits directly on `02 Patterns`, is a `COMPONENT` and never a
`COMPONENT_SET`, is not an approved B6 top-level or batch-owned name, has a name equal to
an approved B6 variant matrix, and reports zero instances from `getInstancesAsync()`. When
the owning set exists, a different live variant of the same matrix must also be present —
the same proof B4 requires. When the set does not exist, the removal reason is printed in
full: a bare matrix node with zero instances that no approved page inventory permits.
Anything failing a condition is printed under `KEPT — …` and left alone.
`ensureB6Patterns` additionally wraps each pattern in `b6Guarded`, which removes only the
matrix-named, non-set nodes that the failing build itself parented to the page, so a
future aborted run strands nothing. The existing orphan STOP now also prints the offending
node's type, id and instance count.


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

FLOAT verification tolerance: `verifyB2` compares stored numbers against the production-derived
values with `Math.abs(stored - expected) <= 1e-7` instead of strict `===`. Figma round-trips a
stored FLOAT through its own numeric representation, so values that are not exactly representable
in binary floating point (`-2.8`, `-3.2`, `1.02`) can come back a few ulps away from the JS literal
that was written. The largest real-Figma delta observed so far is ~4.8e-8, so 1e-7 is safely above
the storage jitter while remaining orders of magnitude below any meaningful typographic
difference. This is not a relaxation of source fidelity: the extracted values in `tokens-b2.js` are
unchanged, and `B2 NUMERIC EVIDENCE` prints every expected/stored pair at 20-digit precision with
its absolute delta, so a genuine mismatch is always visible and named.


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
| `ABox/Action/ActionPill` | Set | `variant` × 10 keys | `abox/action-pill.ts` |
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

## Phase 52 / Batch B5 — component variants & states

`tokens-b5.js` is GENERATED by `node tools/figma-plugin/extract-b5.mjs` (run from the project
root) from the production component sources plus the generated B4 node tree. Never edit it by
hand. Rebuild with `node build.mjs`.

In Figma Desktop, inside `ABox Design System — Library`, after B4: click **Create component
states**, then **Verify component states**, then run creation a second time — it must report
`RESULT: B5 PASSED` with zero created and identical ids.

B5 creates no Component Set and no standalone Component. It adds:

- one Variant axis, `deltaSign = positive | negative`, on `ABox/Card/KpiCard`
  (`kpi-card.tsx:78`), and exactly **4 new negative Variant ComponentNodes** created by
  duplicating the existing tone variants. Final matrix: `tone` × `deltaSign` = 8 nodes.
  Positive keeps `"▲ 4.2%"`; each negative carries `"▼ 4.2%"` and the existing B3
  `ABox/Semantic/destructive` style — no colour value is copied in;
- **19 non-variant component properties**: 15 TEXT (`characters`) and 4 BOOLEAN (`visible`),
  each attached to the exact production-equivalent sublayer. B4 leaves sublayers unnamed, so
  every target is resolved structurally (TEXT-descendant position + the B4 construction text)
  and then named; that naming is the only B5 mutation of B4 node metadata;
- **1 exposed nested instance**: the existing `ABox/Control/Control` inside
  `ABox/Form/LabeledField`.

Totals: 11 sets + 3 components, 56 variant ComponentNodes (52 from B4 + 4 from B5), 59 physical
ComponentNodes, 17 variant axes, 19 created non-variant properties, 0 INSTANCE_SWAP, 0 SLOT.

10 further production properties are **deferred**, because the audited B4 object contains no
target layer for them: KpiCard `hasIcon`, `hasHint`, `hasDeltaLabel`, `deltaLabel`; PageHeader
`hasIcon`, `hasActions`, `actions`; EmptyState `hasIcon`, `hasAction`, `action`. 19 + 10 = 29.
`EmptyState.action` is not created even where the runtime reports SLOT support: the capability
check is read-only and the structural target is absent, so SLOT creation is 0 on every run.
`PageHeader` compact omits the eyebrow in production, so the eyebrow properties are not attached
to that variant. B5 publishes nothing.

## Phase 53 / Batch B6 — patterns & interactions

Buttons: **Create patterns** (`b6-run`) and **Verify patterns** (`b6-verify`). Source data is
extracted by `extract-b6.mjs` into `tokens-b6.js`; `code.js` is regenerated only by `build.mjs`.

B6 composes existing B4/B5 components as instances on the `02 Patterns` page. It creates no
primitive, no new component set on `01 Components`, no new state axis, and no B4/B5 mutation.

Created objects (3 patterns / 4 ComponentNodes):

- `ABox/Pattern/KpiRow` — Component Set, axis `columns = 3 | 4`; 15 non-reference routes render
  the same `grid gap-4` KPI row (`src/routes/app.dashboard.tsx:31`). Nested `ABox/Card/KpiCard`
  instances only;
- `ABox/Pattern/ModuleTabBar` — Component; `src/components/abox/module-tabs.tsx` owns the
  composition, 3 hosts consume it. Nested `ABox/Nav/ModuleTab` instances, one `state=active`;
  the hairline uses the live B3 `ABox/Semantic/hairline` style;
- `ABox/Pattern/WizardStepper` — Component; `src/components/abox/downline-wizard-stepper.tsx`
  owns the composition. Nested `ABox/Nav/WizardStep` instances covering all four real states.

0 Figma prototype connections: every represented interaction is an existing B4 variant consumed
by a pattern instance. Tab and wizard-step navigation is router-driven and its destinations are
B8 scope, so no connection is created. 9 candidates are deferred and 3 rejected — all printed by
`b6-verify` with their production source. 7 limitations are recorded verbatim, including the
preserved B5 KpiCard positive-delta deviation, which B6 displays but does not correct.

`verifyB6` asserts B1 (9 collections / 200 variables), B2 (19 variables), B3 (79 styles), B4/B5
architecture and every component and property id, page scope, per-pattern structural signatures,
zero duplicated foundation values, and zero creations on run 2.

### B6 — revised precision amendment

- KpiRow creation sequence: resolve `02 Patterns`, resolve the live KpiCard main
  component(s) before any write, read the live page inventory, then either resolve the
  existing set (exactly one `columns` VARIANT axis with values `3` and `4`, each variant
  resolved by exact matrix, never recreated) or create exactly two ComponentNodes named
  `columns=3` / `columns=4` and combine only those with `combineAsVariants`. No
  `addComponentProperty`, no second axis. Physical B6 nodes: 1 Component Set + 2 variant
  ComponentNodes + 2 standalone Components = 4.
- Wrapped auto-layout: ModuleTabBar and WizardStepper set `layoutMode=HORIZONTAL`,
  `layoutWrap=WRAP`, `itemSpacing=6`, `counterAxisSpacing=6` (gap-1.5 on both axes),
  `primaryAxisSizingMode=AUTO`, `counterAxisSizingMode=AUTO`; no fixed width, no
  breakpoint. ModuleTabBar keeps `paddingBottom=12` (pb-3). KpiRow stays `NO_WRAP`.
- ModuleTabBar border: individual strokes — bottom 1, other sides 0 — bound to the live
  B3 `ABox/Semantic/hairline` paint style (STOP when unresolvable), with
  `strokesIncludedInLayout=false`; no extra line child, no colour literal.
- WizardStepper carries all 8 production steps in `DOWNLINE_WIZARD_STEPS` order; states
  are copied from one real route (`/agency/downlines/new/contacts`, SCR-M05-009, step 3
  of 8) → done, done, current, unreachable ×5. B4's `upcoming` state does not occur for
  any real route and is not manufactured.
- Structural signatures now include layout mode, wrap, both gaps, both sizing modes,
  padding, the four individual stroke weights, the live stroke style id and
  `strokesIncludedInLayout`; verification adds 18 further checks covering all of the above.

## Phase 54 / Batch B7 — shells

Buttons: **Create shells** (`b7-run`) and **Verify shells** (`b7-verify`). Source data is
extracted by `extract-b7.mjs` into `tokens-b7.js`; `code.js` is regenerated only by `build.mjs`.

B7 creates only on `03 Shells`:

- `ABox/Shell/Internal` — standalone Component;
- `ABox/Shell/Marketplace` — Component Set with exactly `variant = flow | landing`;
- `ABox/Shell/Member` — standalone Component.

The shell assets consume live B4/B5/B6 foundations and components by id. `Marketplace.showProducts`
is intentionally asymmetric: the `flow` variant binds the Boolean to the real
`product-switcher-region.visible` target, while `landing` has no product switcher layer and no
synthetic hidden placeholder. If Figma cannot safely keep the shared property definition with only a
flow target binding, B7 must stop rather than creating a detached property.

B7 creates no screens, no responsive variants, no prototype links, no publishing and no application
files. Real evidence requires running **Create shells** → **Verify shells** → **Create shells** in
Figma Desktop and comparing identical ids with zero creations on the second run.

## Phase 55 / Batch B8 — experiences

Buttons: **Create experiences** (`b8-run`) and **Verify experiences** (`b8-verify`). Source data is
extracted by `extract-b8.mjs` into `tokens-b8.js`; `code.js` is regenerated only by `build.mjs`.

B8 creates exactly five editable top-level FRAME reference compositions on `04 Experiences` only:

- `ABox/Experience/Internal/DownlineAgencyCreation`;
- `ABox/Experience/Internal/MarketplaceActivationGovernance`;
- `ABox/Experience/Marketplace/PlanAIShoppingPath`;
- `ABox/Experience/Marketplace/EnrollmentReviewAndSubmission`;
- `ABox/Experience/Member/ContinuationWorkspace`.

Each frame consumes existing live B7 shell instances, B6 pattern instances where the production
journey uses those foundations, and existing B4/B5 component instances. B8 creates no variables,
styles, components, component sets, patterns, component properties, responsive variants, prototype
links, screenshots, HTML embeds or flattened substitutes. Route-local structures such as PlanCard,
ShoppingPathBar, application steppers, tables, checklists, overlays, field groups and message rows
remain documented editable route composition and are not promoted to foundations.

Idempotency is strict: an existing B8 frame is reused only when its B8 plugin data, source list,
structural signature and four approved child regions match exactly. Any mismatch, duplicate name,
wrong type or missing B7/B6/B4 dependency stops without overwriting or deleting the live object. Run 1
creates five frames; Run 2 must create zero frames with identical ids.

Offline/static validation is not native Figma evidence. Real evidence requires running **Create
experiences** → **Verify experiences** → **Create experiences** in Figma Desktop and confirming real ids
with zero creations on the second run. No publishing is performed.


## Phase 56 / Batch B9 — complete screens / bulk application import

Buttons: **Create All Screens** (`b9-run`) and **Verify All Screens** (`b9-verify`). Source data is extracted by `extract-b9.mjs` into `tokens-b9.js`; `code.js` is regenerated only by `build.mjs`.

B9 creates editable top-level FRAME screen artifacts on `05 Screens` only. The bulk import derives the inventory from the route files, stable screen registry, governed M06 screen registry, governed M08 registry, and the B1-B8 token outputs. It excludes redirect-only routes, layout-only routes, internal design-reference routes, and shared host routes that are replaced by registered governed screen records.

B9 also classifies source-backed interactions:

- **A** — deterministic Figma prototype reaction, with source frame, target frame/state, trigger/action and transition metadata in the signature;
- **B** — existing B4/B5 component state or variant representation for hover, focus, pressed, active, selected, expanded and disabled states;
- **C** — runtime or business-logic dependent metadata only, unless a source-backed visual destination exists;
- **D** — unsupported or ambiguous metadata only, with no invented destination.

Idempotency is strict: Run 1 creates the approved screen frames plus valid source-backed reactions; Run 2 must create zero duplicate frames and zero duplicate reactions. Existing frames and reactions are reused only when their B9 plugin data, source list, structural signature, reaction source/target, trigger, action and transition/state metadata match exactly. Any duplicate name, changed protected B0-B8 object, missing dependency or conflicting prototype mapping stops without overwriting or deleting live objects.

B9 does not execute React, JavaScript, authentication, database work, pricing, subsidy, file upload or governed runtime logic inside Figma. It is a standalone design/prototype representation, not a permanent Lovable-to-Figma sync. Offline/static validation is not native Figma evidence. Real evidence requires running **Create All Screens** → **Verify All Screens** → **Create All Screens** → **Verify All Screens** in Figma Desktop, then opening representative Internal, Marketplace and Member flows in Figma Presentation/Prototype mode and checking mapped clicks/hovers and reported runtime-only limitations.

## Phase 57 / Batch B10 — documentation / final reference layer

Buttons: **Create documentation** (`b10-run`) and **Verify documentation** (`b10-verify`). Source data is extracted by `extract-b10.mjs` into `tokens-b10.js`; `code.js` is regenerated only by `build.mjs`.

B10 creates exactly 10 editable top-level FRAME documentation assets on `06 Documentation` only:

- `ABox/Documentation/00 Library Overview`;
- `ABox/Documentation/01 Foundations Tokens Typography Styles`;
- `ABox/Documentation/02 Components States Properties`;
- `ABox/Documentation/03 Patterns Shells`;
- `ABox/Documentation/04 Experiences`;
- `ABox/Documentation/05 Screens Route Inventory`;
- `ABox/Documentation/06 Prototype Interaction Mapping`;
- `ABox/Documentation/07 Governance Source Of Truth`;
- `ABox/Documentation/08 Import Reimport Workflow`;
- `ABox/Documentation/09 Limitations Evidence Register`.

The documentation is native editable Figma text and frame structure. It links by plugin metadata to existing B0-B9 pages, variable collections, styles, components, patterns, shells, experiences and screens. B10 creates no variables, styles, components, component sets, patterns, shells, experiences, screens, prototypes, screenshots, HTML embeds or flattened substitutes.

B10 records the source-of-truth hierarchy: production source remains authoritative for runtime behavior; extraction converts audited facts into deterministic reference data; the Figma library is a standalone design/prototype artifact. It documents the B9 one-bulk-import screen model, B9 A/B/C/D interaction classification, current limitation/deferred registers, evidence labels, and the explicit absence of permanent Lovable-to-Figma sync.

Idempotency is strict: Run 1 creates the 10 approved documentation frames; Run 2 must create zero frames with identical ids. Existing B10 frames are reused only when their plugin data, source list, deterministic signature and four approved child regions match exactly. Any duplicate, wrong type, unapproved object on `06 Documentation`, missing B1-B9 reference, changed protected B0-B9 count or conflicting signature stops without overwriting or deleting live objects.

Offline/static validation is not native Figma evidence. Real evidence requires running **Create documentation** → **Verify documentation** → **Create documentation** → **Verify documentation** in Figma Desktop and confirming real ids with zero creations on the second run. Unless that native sequence is executed, B10 must be reported as `REAL FIGMA NOT VERIFIED`.
