# Phase 52 / Batch B1 — Figma Foundation Variables (PLAN ONLY)

Target: existing `ABox Design System — Library` file (file-isolation guard unchanged). No Text Styles, Effect Styles, Components, Variants, Patterns, Screens or page content. No publishing. No `src/**` change.

## A. Collections and ownership

| # | Collection | Modes | Owner | Source |
|---|---|---|---|---|
| 1 | `ABox/Color/Primitive` | Light, Dark | ABox foundation | raw `oklch(...)` literals in `src/styles.css` `:root` / `.dark` |
| 2 | `ABox/Color/Semantic` | Light, Dark | ABox foundation | role names in `@theme inline` (`--color-*`) |
| 3 | `ABox/Status` | Light, Dark | ABox foundation | status + metal tier roles |
| 4 | `ABox/Spacing` | Default | ABox foundation | Surface padding + shell/layout spacing actually defined in ABox code |
| 5 | `ABox/Radius` | Default | ABox foundation | `@theme inline --radius-*` + `--radius` |
| 6 | `ABox/Border` | Default | ABox foundation | border widths used by canonical components |
| 7 | `ABox/Elevation` | Light, Dark | ABox foundation (partial — see F) | `--shadow-*` in `@theme inline` |
| 8 | `ABox/Layout` | Default | ABox foundation | container max-widths in shells / marketplace layout |
| 9 | `ABox/Control sizing` | Default | ABox foundation | `controlClass` heights and padding |

Excluded by rule: runtime tenant/white-label branding (`primary_color`, `accent_color`, logo/favicon assets in `src/lib/marketplace-store.ts`). None of it enters Figma. Tailwind's generic spacing scale is library-owned and not re-declared as ABox variables.

## B. Variable inventory (extracted, nothing invented)

**Color/Primitive** — every distinct `oklch()` literal declared in `:root` and `.dark`, named by its first defining role path, e.g. `navy/ink`, `white/pure`, `navy/primary-600`. No primitive is created that is not literally present in `src/styles.css`.

**Color/Semantic** — one variable per `@theme inline --color-*` role (lines 32-79): background, foreground, surface, surface-foreground, panel, card, card-foreground, popover, popover-foreground, primary, primary-foreground, primary-soft, secondary, secondary-foreground, sage, sage-foreground, sage-soft, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, warning, warning-foreground, info, info-foreground, success, success-foreground, border, border-strong, hairline, input, ring, chart-1..chart-5, sidebar, sidebar-foreground, sidebar-primary, sidebar-primary-foreground, sidebar-accent, sidebar-accent-foreground, sidebar-border, sidebar-ring. Plus `ink` (declared in `:root`, not exported through `@theme`) recorded as a semantic role.

**Status** — the six StatusBadge tones as they actually resolve (`sage`, `primary`, `warning`, `muted` → foreground, `destructive`, `info`) as aliases to Color/Semantic, plus the twelve metal tier variables `--metal-{bronze, expanded-bronze, silver, gold, platinum, catastrophic}` and their `-fg` pairs.

**Spacing** — `surface/none 0`, `surface/sm 16`, `surface/md 20`, `surface/lg 24` (from `SURFACE_PADDING` p-4/p-5/p-6).

**Radius** — `sm 6`, `md 10`, `lg 14`, `xl 18`, `2xl 22`, `3xl 28`, `4xl 36`, plus `base 14` (`--radius: 0.875rem`) and `full 9999` (the `rounded-full` used by StatusBadge/ring-pill).

**Border** — `hairline 1` (the single border width all canonical components use), `ring 2` (`focus:ring-2`).

**Elevation** — for each of `shadow-card`, `shadow-elevated`, `shadow-drawer`, `shadow-plate`, `shadow-glow`: the numeric x/y/blur/spread floats and the tint colors as color variables, one set per layer. The composite shadow itself is not a Figma variable type (see F).

**Layout** — `container/wide 1408` (`max-w-[88rem]`), `container/shell 1500` (`max-w-[1500px]`).

**Control sizing** — `height/md 40` (`h-10`), `height/lg 44` (`h-11`), `padding-x 12` (`px-3`), `min-touch-target 44` (the `max-width: 640px` rule).

## C. Primitive vs semantic

Primitives hold literal color values per mode. Semantic variables are created as **aliases** to primitives wherever the production CSS itself points a role at a value shared by another role; where a role declares a unique literal, the semantic variable holds the value directly and no artificial primitive is manufactured for it. Status tone variables alias Color/Semantic exactly as `status-badge.tsx` aliases `var(--sage)` etc. No alias chain is invented that production does not express.

## D. Figma types and modes

- Colors → `COLOR`, modes `Light` / `Dark` matching `:root` and `.dark`. Roles that the `.dark` block does not redeclare inherit the Light value explicitly (recorded, since Figma has no CSS cascade).
- Spacing, Radius, Border, Layout, Control, Elevation numerics → `FLOAT`, single `Default` mode, unitless px numbers.
- Elevation tints → `COLOR`, `Light` / `Dark`.
- No `STRING` or `BOOLEAN` variables in B1.

## E. Naming mapping

`--color-surface-foreground` → `ABox/Color/Semantic` variable `surface-foreground`; `--metal-gold-fg` → `ABox/Status` variable `metal/gold-fg`; `--radius-2xl` → `ABox/Radius` variable `2xl`. Rule: strip the `--color-` / `--` prefix, keep the production token name verbatim, use `/` only to group families that already exist in production (`metal/`, `chart/`, `sidebar/`, `container/`, `height/`, `shadow-card/`). No renaming, no re-casing, no "improvement" of production names.

## F. Values Figma cannot represent exactly — recorded, never silently approximated

1. **oklch source notation.** Figma variables store sRGB. Every color is converted once, deterministically, and the original `oklch(...)` string is recorded in the variable description as the authoritative value. Conversion is a recorded limitation; production is never changed to match Figma.
2. **Alpha-bearing roles** (`--border`, `--border-strong`, `--hairline`, `--input`, `--sidebar-border`) keep their alpha in the Figma color value; the source notation stays in the description.
3. **`color-mix(in oklch, …)`** used by StatusBadge for text/background/border is computed at runtime from the tone and cannot be a static variable. Not created in B1; recorded as runtime-computed and handled at component level in a later batch.
4. **Composite box-shadows** are not a Figma variable type. B1 stores only their numeric parts and tints; the shadows themselves become Effect Styles in a later batch. Recorded as a deferred representation, not a gap.
5. **Decorative utilities** (`noise-field`, `contour`, `aurora`, `glass`, `edge-sheen`, `ember-underline`, `card-brackets`, `divider-warm`) and keyframe motion are not variables and are not converted into invented tokens.
6. **Tailwind responsive breakpoints and generic spacing scale** are library-owned; no ABox variables are created for them.

## G. Idempotency

Collections and variables are matched by exact name within their collection. Existing collection → reuse its id; existing variable of the same name and type → update its per-mode values in place; type mismatch → STOP with an explicit error rather than delete-and-recreate. Modes are matched by name and reused. A rerun must change no ids. The plugin never deletes a variable it did not create in this batch.

## H. Validation

`b1-verify` runs independently of creation and checks:
1. the nine collections exist exactly once, with the declared modes;
2. every inventoried variable exists exactly once, in the right collection, with the right `resolvedType`;
3. each value per mode matches the converted production source within exact equality of the stored sRGB tuple;
4. no variable exists in an ABox collection that is not in the approved inventory (extras are listed and fail);
5. no branding/runtime value from `marketplace-store.ts` appears in any variable name or description;
6. counts of text styles, effect styles, components and component sets are unchanged from the pre-B1 baseline (B1 must create none);
7. the seven pages still exist at indices 0..6 and remain empty.

Any FAIL → `RESULT: B1 FAILED`.

## I. Run 1 / Run 2 evidence

Run 1: verbatim output with per-collection creation log, total variables created per collection, full `RESULT: B1 PASSED`, plus collection and variable ids.
Run 2: every line reads "reused/updated", zero created, identical collection and variable ids, identical counts, `RESULT: B1 PASSED`.
Both runs: confirmation that text-style / effect-style / component / component-set counts are unchanged and that the seven pages are untouched and empty. Any limitation from section F restated in the run output.

## J. Scope

B2 Typography, B3 Foundational Styles, B4 components, B5 patterns/shells, B6 screens, traceability and validation batches, and library publishing all remain out of scope. Nothing in `src/**` or any ABox production/reference file is modified; only `tools/figma-plugin/` source plus the regenerated `code.js`.
