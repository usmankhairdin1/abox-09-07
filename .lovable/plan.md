# Phase 52 / Batch B1: Figma Foundation Variables

PLAN ONLY. Use the current `ABox Design System — Library` Figma file and the approved Phase 50 blueprint plus the current production source as the only mapping authority. Do not implement anything yet.

## A. Target-file requirement

- Target file: `ABox Design System — Library` (same file created for Batch B0).
- Must already contain the seven empty pages `00 Foundations` … `06 Documentation` at indices 0–6.
- The existing file-isolation guard rejects any other file.
- `ABox Proof — Scratch` remains the Phase 52A proof file and is not repurposed.

## B. Collection names and ownership

Create exactly these 9 variable collections, each owned by this batch:

| # | Collection | Purpose | Modes |
|---|---|---|---|
| 1 | `ABox/Color/Primitive` | Raw production primitive tokens from `:root` and `.dark` | Light, Dark |
| 2 | `ABox/Color/Semantic` | Semantic colour roles (`--color-*`) from `src/styles.css` | Light, Dark |
| 3 | `ABox/Status` | StatusBadge tones + metal tier + foreground aliases | Light, Dark |
| 4 | `ABox/Spacing` | Surface padding values | Light, Dark |
| 5 | `ABox/Radius` | Radius scale | Light, Dark |
| 6 | `ABox/Border` | Hairline and focus-ring widths | Light, Dark |
| 7 | `ABox/Elevation` | Per-layer shadow numerics and tint colours | Light, Dark |
| 8 | `ABox/Layout` | Container max-widths | Light, Dark |
| 9 | `ABox/Control sizing` | Control heights, padding, touch target | Light, Dark |

## C. Exact variable inventory to extract from production

### C.1 ABox/Color/Primitive

Create exactly one primitive variable per distinct production primitive token/role path, with Light and Dark mode values populated from the corresponding `:root` and `.dark` source values.

Rules:
- A token with different Light and Dark literals remains ONE Figma variable with two mode values; it must never become two separate variables merely because the literals differ.
- If a primitive token has no `.dark` override, explicitly record the Light value as the Dark-mode value because Figma has no CSS cascade.
- Name each variable with the production role path stripped of the `--color-` prefix (e.g. `--color-base` → `base`, `--color-surface` → `surface`, `--color-chart-1` → `chart/1`).
- Type: `COLOR`.
- Description must contain the original oklch() literal(s) for traceability.

Sources: all distinct `oklch()` literals declared in `src/styles.css` `:root` and `.dark`.

### C.2 ABox/Color/Semantic

Create one variable per distinct `@theme inline --color-*` role in `src/styles.css` (lines 32–79) plus the `ink` role.

Rules:
- Type: `COLOR`.
- Each semantic variable is bound to the corresponding primitive via Figma variable alias (not a hard-coded sRGB value) where a single primitive is the source.
- Where the production source uses `color-mix(in oklch, ...)`, do **not** create a Figma variable; record this as a runtime-computed limitation because Figma variables cannot express `color-mix()`.
- Keep production names verbatim; strip `--color-` prefix (e.g. `--color-primary` → `primary`, `--color-sidebar-border` → `sidebar/border`).
- If a semantic role resolves to a different primitive in Light vs Dark, set the Light and Dark mode values independently to the appropriate primitive aliases.

Expected semantic roles from `src/styles.css`: 48 named roles (including `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring`, `radius`, `chart/1`–`chart/5`, `sidebar/background`, `sidebar/foreground`, `sidebar/primary`, `sidebar/primary-foreground`, `sidebar/accent`, `sidebar/accent-foreground`, `sidebar/border`, `sidebar/ring`, `ink`, etc.).

### C.3 ABox/Status

StatusBadge tones from `src/components/abox/status-badge.tsx`:
- `sage`, `primary`, `amber`, `red`, `sky`, `neutral`.

For each tone create a background variable aliased to the matching semantic colour in `ABox/Color/Semantic` (e.g. `sage` → semantic `sage`, `primary` → semantic `primary`, etc.).

Metal tier tokens from production (12 variables):
- `metal/platinum`, `metal/platinum-fg`
- `metal/gold`, `metal/gold-fg`
- `metal/silver`, `metal/silver-fg`
- `metal/bronze`, `metal/bronze-fg`
- `metal/iron`, `metal/iron-fg`
- `metal/lead`, `metal/lead-fg`

Type: `COLOR` for all status variables.
Mode values: Light and Dark from the corresponding semantic or primitive alias.

### C.4 ABox/Spacing

From `src/components/abox/surface.tsx` (`SURFACE_PADDING`):
- `surface/none` = 0
- `surface/sm` = 16
- `surface/md` = 20
- `surface/lg` = 24

Type: `FLOAT` (unitless px).
Light and Dark modes carry identical values (production spacing does not theme).

### C.5 ABox/Radius

From `@theme inline --radius-*` in `src/styles.css`:
- `sm` = 6
- `md` = 10
- `lg` = 14
- `xl` = 18
- `2xl` = 22
- `3xl` = 28
- `4xl` = 36
- `base` = 14
- `full` = 9999

Type: `FLOAT` (unitless px).
Light and Dark modes carry identical values (production radius does not theme).

### C.6 ABox/Border

From production utility usage:
- `hairline` = 1 (default border width)
- `ring` = 2 (focus ring width)

Type: `FLOAT` (unitless px).
Light and Dark modes carry identical values.

### C.7 ABox/Elevation

From `--shadow-*` declarations in `src/styles.css`. Each composite shadow is decomposed into per-layer numeric parts and a tint colour part.

Composite shadow families (5): `card`, `elevated`, `drawer`, `plate`, `glow`.

For every layer `i` of every family create:
- `{family}/{i}/x` — `FLOAT`
- `{family}/{i}/y` — `FLOAT`
- `{family}/{i}/blur` — `FLOAT`
- `{family}/{i}/spread` — `FLOAT`
- `{family}/{i}/tint` — `COLOR` (the shadow colour value)

Collection modes: `Light` and `Dark`.
ALL variables inside `ABox/Elevation`, including numeric FLOAT shadow parts and COLOR shadow tints, use the collection's `Light` and `Dark` modes.

For elevation numeric values whose production x/y/blur/spread values are identical between Light and Dark, write the same numeric value into both modes. If production defines different numeric values between Light and Dark, preserve those independently. Elevation tint COLOR variables keep their exact production Light/Dark values. Do not create a `Default` mode inside `ABox/Elevation`.

The full composite shadow (the layered `box-shadow` string itself) is not a Figma variable type; it becomes an Effect Style in a later batch. B1 stores only the decomposed, reusable parts.

### C.8 ABox/Layout

From shell and marketplace-page-layout max-widths:
- `container/wide` = 1408 (from `max-w-[88rem]`)
- `container/shell` = 1500 (from `max-w-[1500px]`)

Type: `FLOAT` (unitless px).
Light and Dark modes carry identical values.

### C.9 ABox/Control sizing

From `src/components/abox/control.tsx` (`controlClass` heights/padding) and responsive touch-target rules:
- `height/md` = 40 (from `h-10`)
- `height/lg` = 44 (from `h-11`)
- `padding-x` = 12 (from `px-3`)
- `min-touch-target` = 44 (from the `max-width: 640px` rule)

Type: `FLOAT` (unitless px).
Light and Dark modes carry identical values.

## D. Primitive vs semantic relationship

- `ABox/Color/Primitive` holds raw oklch literals.
- `ABox/Color/Semantic` aliases into `ABox/Color/Primitive`.
- `ABox/Status` aliases into `ABox/Color/Semantic`.
- No semantic variable hard-codes an sRGB value when a primitive alias is available.

## E. Exact Figma variable types and modes

- `COLOR` variables: all colour primitives, semantics, status tones/metals, elevation tints.
- `FLOAT` variables: spacing, radius, border widths, elevation numerics, layout, control sizing.
- No `STRING` or `BOOLEAN` variables in this batch.
- Every collection declares exactly two modes: `Light` and `Dark`.
- Values identical between modes are duplicated explicitly (Figma has no CSS cascade).

## F. Source-to-variable naming mapping

- Strip `--color-` and `--` prefixes.
- Keep production names verbatim.
- Use `/` only for families that already exist in production: `chart/1`–`chart/5`, `sidebar/*`, `metal/*`, `container/*`, `height/*`, `shadow-card/*`, etc.
- Do not introduce new slash-delimited names that do not exist in production.

## G. Handling of values Figma Variables cannot represent exactly

- `oklch()` source values: convert to sRGB for Figma `COLOR` values; record the original oklch literal in the variable description.
- `color-mix(in oklch, ...)`: runtime-computed, not created in B1. Recorded explicitly as a limitation.
- Composite `box-shadow` strings: decomposed into per-layer numeric/tint variables in B1; the composite Effect Style is deferred to a later batch.
- Decorative utilities (`noise-field`, `contour`, `aurora`, `glass`, `ember-underline`, `card-brackets`, `edge-sheen`) and keyframe motion: not representable as variables; intentionally excluded.
- Tailwind responsive breakpoints: library-owned, not variables; encoded as frames in later screen batches.

## H. Idempotent creation/update strategy

- Match collections by exact name. If a matching collection exists, reuse it; otherwise create it.
- If more than one collection with the same name exists, STOP with a duplicate-collection error.
- Match variables by exact name within their collection. If a matching variable exists, update its type/mode values in place; otherwise create it.
- STOP on type mismatch (e.g. an existing variable has a different `resolvedType`).
- Never delete variables that are not part of the approved B1 inventory.
- On rerun, every log line for existing objects must say "reused" or "updated"; zero new collections and zero new variables should be created.

## I. Validation strategy

New `b1-verify` flow must confirm:

1. Exactly the 9 approved collections exist, each exactly once, with modes `Light` and `Dark`.
2. Every variable in the approved inventory exists exactly once in the correct collection with the correct `resolvedType`.
3. For `ABox/Color/Primitive`: exactly one primitive variable per production primitive token/role path; Light and Dark values compared independently against their `:root` and `.dark` source values; no duplicate primitive created solely because Light and Dark literals differ.
4. For `ABox/Color/Semantic`: 48 semantic roles; values are aliases to the correct primitives where applicable; Light and Dark compared independently.
5. For `ABox/Status`: 6 tone variables + 12 metal variables (6 bg + 6 fg); values alias to semantic colours.
6. For `ABox/Spacing`, `ABox/Radius`, `ABox/Border`, `ABox/Layout`, `ABox/Control sizing`: every FLOAT variable matches the approved production value.
7. For `ABox/Elevation`: every shadow family layer has exactly 5 variables (`x`, `y`, `blur`, `spread`, `tint`); every variable has both `Light` and `Dark` values; numeric values compared independently; tint values compared independently; no variable has a `Default` mode.
8. No extra variables exist inside the ABox collections.
9. No runtime/tenant/branding values were imported into any collection.
10. B1 created no text styles, no effect styles, no components, no variants, no page content.
11. The B0 seven pages remain at indices 0–6 and remain empty.

Verification output must print:
- per-collection variable counts and ids,
- a structural check summary,
- `RESULT: B1 PASSED` or `RESULT: B1 FAILED — do not proceed to B2.`

## J. Run 1 / Run 2 success criteria

**Run 1 — Create foundation variables**
- Logs per-collection creation/reuse for each of the 9 collections.
- Logs per-variable creation for every approved variable.
- Then `Verify foundation variables` reports `RESULT: B1 PASSED`.

**Run 2 — Idempotent re-run**
- Every collection is "reused", not created.
- Every variable is "reused" or "updated", not created.
- Collection ids and variable ids are identical to Run 1.
- `RESULT: B1 PASSED` again.

Any mismatch prints `RESULT: B1 FAILED — do not proceed to B2.` and stops.

## K. FINAL REPORT evidence required

1. Confirmation that `code.js` was regenerated via `build.mjs` (not hand-edited).
2. Verbatim Run 1 output, including per-collection lines and final `RESULT:` line.
3. Run 1 inventory: 9 collection names + ids, and per-collection variable counts.
4. Verbatim Run 2 output.
5. Run 2 inventory with identical ids, confirming zero created and update-in-place.
6. Explicit confirmation that B1 created no text styles, no effect styles, no components, no variants.
7. Explicit confirmation that the B0 seven pages remain at indices 0–6 and empty.
8. Any deviation, STOP, or recorded limitation, quoted verbatim.

## L. Out-of-scope

- B2 Typography, B3 Foundational Styles, B4 Components, B5 Variants, B6 Patterns, B7 Shells, B8 Screens, library publishing, documentation pages — all later batches remain out of scope.
- No text styles, effect styles, components, variants, patterns, screens, or documentation content in this batch.
- No Figma library publishing in this batch.

## M. No ABox application files modified

No file under `src/**`, no route, asset, token, branding, reference-layer or governance file is touched. Only `tools/figma-plugin/` source files and the regenerated `code.js` may change. `git diff --stat -- src/` must remain empty.
